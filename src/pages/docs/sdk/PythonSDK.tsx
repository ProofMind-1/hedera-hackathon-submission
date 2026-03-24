import DocsLayout, { TocItem } from "@/components/docs/DocsLayout";
import CodeBlock from "@/components/CodeBlock";

const toc: TocItem[] = [
  { id: "overview", title: "Overview", level: 2 },
  { id: "initialization", title: "Initialization", level: 2 },
  { id: "notarize-decorator", title: "Notarize Decorator", level: 2 },
  { id: "manual-notarize", title: "Manual Notarization", level: 2 },
  { id: "verify", title: "Verification", level: 2 },
  { id: "model-registry", title: "Model Registry", level: 2 },
  { id: "batch", title: "Batch Operations", level: 2 },
];

const PythonSDK = () => (
  <DocsLayout toc={toc}>
    <h1 className="text-4xl font-bold mb-4">Python SDK Reference</h1>
    <p className="text-lg text-muted-foreground mb-8">
      Complete reference for the ProofMind Python SDK.
    </p>

    <h2 id="overview" className="text-2xl font-bold mt-12 mb-4 scroll-mt-20">Overview</h2>
    <CodeBlock language="bash" filename="Terminal" code="pip install proofmind" />
    <p className="text-muted-foreground mt-3 mb-6">Requires Python 3.8+. Compatible with asyncio, FastAPI, Django, and Flask.</p>

    <h2 id="initialization" className="text-2xl font-bold mt-12 mb-4 scroll-mt-20">Initialization</h2>
    <CodeBlock language="python" filename="proofmind.py" code={`from proofmind import ProofMind

pm = ProofMind(
    enterprise_id="ent_acme_financial",
    kms_key_arn="arn:aws:kms:us-east-1:...:key/...",
    hcs_topic_id="0.0.12345",
    mode="async",
    retry_policy={"max_retries": 3, "backoff": "exponential"},
    pii_scrubber=True
)`} />

    <h2 id="notarize-decorator" className="text-2xl font-bold mt-12 mb-4 scroll-mt-20">Notarize Decorator</h2>
    <CodeBlock language="python" code={`@pm.notarize(
    model_id="credit_risk_v4.2",
    context="loan_application_decision",
    sensitivity="high",
    tags={"department": "lending", "region": "us-east"}
)
def credit_decision(applicant_data: dict) -> dict:
    return ai_model.predict(applicant_data)`} />

    <h2 id="manual-notarize" className="text-2xl font-bold mt-12 mb-4 scroll-mt-20">Manual Notarization</h2>
    <CodeBlock language="python" code={`receipt = pm.notarize_manual(
    model_id="fraud_detection_v2.1",
    input_data=transaction_data,
    output_data=fraud_score,
    context="real_time_fraud_check",
    metadata={"pipeline": "payments", "priority": "critical"}
)

print(receipt.notarization_id)
print(receipt.hcs_sequence_number)`} />

    <h2 id="verify" className="text-2xl font-bold mt-12 mb-4 scroll-mt-20">Verification</h2>
    <CodeBlock language="python" code={`result = pm.verify(
    notarization_id="ntx_abc123",
    original_input=input_data,
    original_output=output_data
)

assert result.verified == True
assert result.tamper_detected == False`} />

    <h2 id="model-registry" className="text-2xl font-bold mt-12 mb-4 scroll-mt-20">Model Registry</h2>
    <CodeBlock language="python" code={`pm.register_model(
    model_id="credit_risk_v4.2",
    model_hash=pm.compute_hash(model_weights),
    framework="pytorch",
    version="4.2.0",
    owner="ml-team@acme.com",
    requires_dual_sign=True
)`} />

    <h2 id="batch" className="text-2xl font-bold mt-12 mb-4 scroll-mt-20">Batch Operations</h2>
    <CodeBlock language="python" code={`# Batch notarize multiple decisions
receipts = pm.notarize_batch(
    decisions=[
        {"model_id": "model_a", "input": d1_in, "output": d1_out},
        {"model_id": "model_a", "input": d2_in, "output": d2_out},
    ],
    context="batch_processing"
)`} />
  </DocsLayout>
);

export default PythonSDK;
