import hashlib
import json
import time
import requests
from typing import Dict, List, Optional, Any
from dataclasses import dataclass
from contextlib import contextmanager
import sqlite3
import threading

@dataclass
class NotarizationReceipt:
    notarization_id: str
    submission_id: str
    hcs_sequence: Optional[int] = None
    signed_at: Optional[int] = None

class NotarizationContext:
    def __init__(self, pm, model_id: str, context: str, sensitivity: str):
        self.pm = pm
        self.model_id = model_id
        self.context = context
        self.sensitivity = sensitivity
        self.metadata = {}
        self.input_hash = None
        self.output_hash = None

    def add_metadata(self, metadata: Dict):
        self.metadata.update(metadata)

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        if self.input_hash and self.output_hash:
            self.pm.notarize_manual(
                model_id=self.model_id,
                input_hash=self.input_hash,
                output_hash=self.output_hash,
                context=self.context,
                sensitivity=self.sensitivity
            )

class FailureQueue:
    def __init__(self, db_path: str = "proofmind_queue.db"):
        self.db_path = db_path
        self._init_db()

    def _init_db(self):
        conn = sqlite3.connect(self.db_path)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS failed_notarizations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                record TEXT NOT NULL,
                attempts INTEGER DEFAULT 0,
                created_at INTEGER NOT NULL
            )
        """)
        conn.commit()
        conn.close()

    def add(self, record: Dict):
        conn = sqlite3.connect(self.db_path)
        conn.execute(
            "INSERT INTO failed_notarizations (record, created_at) VALUES (?, ?)",
            (json.dumps(record), int(time.time()))
        )
        conn.commit()
        conn.close()

    def get_pending(self, limit: int = 10):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.execute(
            "SELECT id, record, attempts FROM failed_notarizations WHERE attempts < 5 LIMIT ?",
            (limit,)
        )
        results = cursor.fetchall()
        conn.close()
        return [(r[0], json.loads(r[1]), r[2]) for r in results]

    def mark_success(self, record_id: int):
        conn = sqlite3.connect(self.db_path)
        conn.execute("DELETE FROM failed_notarizations WHERE id = ?", (record_id,))
        conn.commit()
        conn.close()

    def increment_attempts(self, record_id: int):
        conn = sqlite3.connect(self.db_path)
        conn.execute(
            "UPDATE failed_notarizations SET attempts = attempts + 1 WHERE id = ?",
            (record_id,)
        )
        conn.commit()
        conn.close()

class ProofMind:
    def __init__(
        self,
        enterprise_id: str,
        hcs_topic_id: str,
        kms_key_arn: Optional[str] = None,
        api_url: str = "http://localhost:3001",
        mode: str = "async",
        pii_fields: List[str] = None
    ):
        self.enterprise_id = enterprise_id
        self.hcs_topic_id = hcs_topic_id
        self.kms_key_arn = kms_key_arn
        self.api_url = api_url
        self.mode = mode
        self.pii_fields = pii_fields or []
        self.failure_queue = FailureQueue()
        self._start_retry_worker()

    def _start_retry_worker(self):
        def retry_worker():
            while True:
                time.sleep(10)
                self._process_failed_queue()
        
        thread = threading.Thread(target=retry_worker, daemon=True)
        thread.start()

    def _process_failed_queue(self):
        pending = self.failure_queue.get_pending()
        for record_id, record, attempts in pending:
            backoff = 2 ** attempts
            time.sleep(backoff)
            
            try:
                response = requests.post(
                    f"{self.api_url}/api/v1/notarize",
                    json=record,
                    timeout=5
                )
                if response.status_code == 200:
                    self.failure_queue.mark_success(record_id)
                else:
                    self.failure_queue.increment_attempts(record_id)
            except:
                self.failure_queue.increment_attempts(record_id)

    def hash(self, data: Any, scrub_pii: bool = True) -> str:
        if isinstance(data, dict) and scrub_pii:
            scrubbed = {
                k: "[REDACTED]" if k in self.pii_fields else v
                for k, v in data.items()
            }
            canonical = json.dumps(scrubbed, sort_keys=True, separators=(",", ":"))
        else:
            canonical = json.dumps(data, sort_keys=True, separators=(",", ":"))
        
        return "sha256:" + hashlib.sha256(canonical.encode()).hexdigest()

    @contextmanager
    def notarize(self, model_id: str, context: str, sensitivity: str = "medium"):
        ctx = NotarizationContext(self, model_id, context, sensitivity)
        yield ctx

    def notarize_decorator(self, model_id: str, context: str, sensitivity: str = "medium", pii_scrub: bool = True):
        def decorator(func):
            def wrapper(*args, **kwargs):
                if self.mode == "shadow":
                    return func(*args, **kwargs)
                
                input_data = args[0] if args else kwargs
                input_hash = self.hash(input_data, scrub_pii=pii_scrub)
                
                result = func(*args, **kwargs)
                
                output_hash = self.hash(result, scrub_pii=pii_scrub)
                
                self.notarize_manual(
                    model_id=model_id,
                    input_hash=input_hash,
                    output_hash=output_hash,
                    context=context,
                    sensitivity=sensitivity
                )
                
                return result
            return wrapper
        return decorator

    def notarize_manual(
        self,
        model_id: str,
        input_hash: str,
        output_hash: str,
        context: str,
        sensitivity: str = "medium",
        outcome_label: Optional[str] = None
    ) -> NotarizationReceipt:
        notarization_id = f"pm_{int(time.time())}_{hash(input_hash)[:8]}"
        
        notarization_record = {
            "notarization_id": notarization_id,
            "enterprise_id": self.enterprise_id,
            "model_id": model_id,
            "input_hash": input_hash,
            "output_hash": output_hash,
            "decision_context": context,
            "sensitivity_level": sensitivity,
            "outcome_label": outcome_label,
            "submitted_at": int(time.time()),
            "sdk_version": "1.0.0",
            "mode": self.mode
        }
        
        submission_id = self._submit_to_api(notarization_record)
        
        return NotarizationReceipt(
            notarization_id=notarization_id,
            submission_id=submission_id,
            signed_at=int(time.time())
        )

    def notarize_batch(self, records: List[Dict]) -> List[NotarizationReceipt]:
        batch_records = []
        for record in records:
            notarization_id = f"pm_{int(time.time())}_{hash(str(record))[:8]}"
            batch_records.append({
                "notarization_id": notarization_id,
                "enterprise_id": self.enterprise_id,
                **record,
                "submitted_at": int(time.time()),
                "sdk_version": "1.0.0"
            })
        
        try:
            response = requests.post(
                f"{self.api_url}/api/v1/notarize/batch",
                json={"records": batch_records, "topic_id": self.hcs_topic_id},
                timeout=10
            )
            
            if response.status_code == 200:
                return [NotarizationReceipt(
                    notarization_id=r["notarization_id"],
                    submission_id=f"batch_{int(time.time())}",
                    signed_at=int(time.time())
                ) for r in batch_records]
        except:
            for record in batch_records:
                self.failure_queue.add(record)
        
        raise Exception("Batch submission failed")

    def _submit_to_api(self, record: Dict) -> str:
        try:
            response = requests.post(
                f"{self.api_url}/api/v1/notarize",
                json=record,
                timeout=5
            )
            
            if response.status_code == 200:
                return response.json().get("id", f"sub_{int(time.time())}")
            else:
                self.failure_queue.add(record)
                return f"sub_queued_{int(time.time())}"
        except Exception as e:
            self.failure_queue.add(record)
            return f"sub_error_{int(time.time())}"
