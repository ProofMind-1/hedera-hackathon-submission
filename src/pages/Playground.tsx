import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2, Lock, CheckCircle2, AlertTriangle, Cpu, Eye,
  RotateCcw, BarChart2, FileText, Search, Zap,
  Circle, Loader2, ChevronRight, ArrowLeft,
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const DEFAULT_ENT = 'ent_demo';

async function sha256(obj: unknown): Promise<string> {
  const data = new TextEncoder().encode(JSON.stringify(obj));
  const buf = await crypto.subtle.digest('SHA-256', data);
  return 'sha256:' + Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function apiFetch(path: string, opts?: RequestInit) {
  const res = await fetch(`${API}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || `HTTP ${res.status}`);
  return json;
}

type LogEntry = { ts: string; label: string; ok: boolean; body: string };
function now() { return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }); }

const SECTIONS = [
  { id: 'enterprise', label: 'Enterprise Setup',    icon: Building2,    group: 'Infrastructure' },
  { id: 'notarize',   label: 'Notarize Decision',   icon: Lock,         group: 'Core' },
  { id: 'verify',     label: 'Verify Integrity',    icon: CheckCircle2, group: 'Core' },
  { id: 'tamper',     label: 'Tamper Detection',    icon: AlertTriangle,group: 'Core' },
  { id: 'model',      label: 'Model Registry',      icon: Cpu,          group: 'Governance' },
  { id: 'oversight',  label: 'Human Oversight',     icon: Eye,          group: 'Governance' },
  { id: 'reversal',   label: 'Decision Reversal',   icon: RotateCcw,    group: 'Governance' },
  { id: 'anomalies',  label: 'Anomaly Monitor',     icon: BarChart2,    group: 'Compliance' },
  { id: 'report',     label: 'Compliance Report',   icon: FileText,     group: 'Compliance' },
  { id: 'query',      label: 'AI Audit Query',      icon: Search,       group: 'Compliance' },
  { id: 'batch',      label: 'Batch Notarization',  icon: Zap,          group: 'Advanced' },
];

const GROUPS = ['Infrastructure', 'Core', 'Governance', 'Compliance', 'Advanced'];

export default function Playground() {
  const [active, setActive] = useState('notarize');
  const [enterpriseId, setEnterpriseId] = useState(DEFAULT_ENT);
  const [topicId, setTopicId] = useState('0.0.8172142');
  const [lastInputData, setLastInputData] = useState<object | null>(null);
  const [lastOutputData, setLastOutputData] = useState<object | null>(null);
  const [log, setLog] = useState<LogEntry[]>([]);
  const logRef = useRef<HTMLDivElement>(null);

  const [entLoading, setEntLoading] = useState(false);
  const [entResult, setEntResult] = useState<any>(null);
  const [companyName, setCompanyName] = useState('Acme Financial Corp');

  const [notModel, setNotModel] = useState('credit_risk_v4.2');
  const [notContext, setNotContext] = useState('loan_application');
  const [notOutcome, setNotOutcome] = useState('approved');
  const [notLoading, setNotLoading] = useState(false);
  const [notResult, setNotResult] = useState<any>(null);

  const [verifyId, setVerifyId] = useState('');
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyResult, setVerifyResult] = useState<any>(null);

  const [tamperLoading, setTamperLoading] = useState(false);
  const [tamperResult, setTamperResult] = useState<any>(null);

  const [modelName, setModelName] = useState('fraud_detector_v3');
  const [modelVersion, setModelVersion] = useState('3.0.0');
  const [modelLoading, setModelLoading] = useState(false);
  const [modelResult, setModelResult] = useState<any>(null);
  const [approveLoading, setApproveLoading] = useState(false);
  const [approveResult, setApproveResult] = useState<any>(null);

  const [oversightId, setOversightId] = useState('');
  const [oversightReviewer, setOversightReviewer] = useState('compliance_officer_1');
  const [oversightDecision, setOversightDecision] = useState('upheld');
  const [oversightLoading, setOversightLoading] = useState(false);
  const [oversightResult, setOversightResult] = useState<any>(null);

  const [reversalId, setReversalId] = useState('');
  const [reversalReason, setReversalReason] = useState('Applicant provided additional income documentation');
  const [reversalNewOutcome, setReversalNewOutcome] = useState('approved');
  const [reversalRole, setReversalRole] = useState('senior_compliance_officer');
  const [reversalLoading, setReversalLoading] = useState(false);
  const [reversalResult, setReversalResult] = useState<any>(null);

  const [anomaliesLoading, setAnomaliesLoading] = useState(false);
  const [anomalies, setAnomalies] = useState<any[]>([]);

  const [reportType, setReportType] = useState('EU_AI_ACT');
  const [reportFrom, setReportFrom] = useState(() => {
    const d = new Date(); d.setMonth(d.getMonth() - 1); return d.toISOString().slice(0, 10);
  });
  const [reportTo, setReportTo] = useState(() => new Date().toISOString().slice(0, 10));
  const [reportLoading, setReportLoading] = useState(false);
  const [reportResult, setReportResult] = useState<any>(null);

  const [query, setQuery] = useState("Give me a risk summary of this enterprise's AI decision activity");
  const [queryLoading, setQueryLoading] = useState(false);
  const [queryResult, setQueryResult] = useState<any>(null);

  const [batchLoading, setBatchLoading] = useState(false);
  const [batchResult, setBatchResult] = useState<any>(null);

  function addLog(label: string, ok: boolean, data: any) {
    setLog(prev => [{ ts: now(), label, ok, body: JSON.stringify(data, null, 2) }, ...prev].slice(0, 50));
  }

  // ── API calls ─────────────────────────────────────────────────────
  async function setupEnterprise() {
    setEntLoading(true); setEntResult(null);
    try {
      const r = await apiFetch('/api/v1/enterprises', { method: 'POST', body: JSON.stringify({ enterprise_id: enterpriseId, company_name: companyName }) });
      setEntResult(r); if (r.topics?.decisions) setTopicId(r.topics.decisions); addLog('Enterprise Setup', true, r);
    } catch (e: any) { setEntResult({ error: e.message }); addLog('Enterprise Setup', false, { error: e.message }); }
    finally { setEntLoading(false); }
  }

  async function notarize() {
    setNotLoading(true); setNotResult(null);
    try {
      const inputData = { applicant_id: `A-${Date.now()}`, credit_score: 720, annual_income: 85000, loan_amount: 25000 };
      const outputData = { outcome: notOutcome, confidence: 0.94, model_version: modelVersion, reason_codes: ['R001', 'R002'] };
      const r = await apiFetch('/api/v1/notarize', { method: 'POST', body: JSON.stringify({ enterprise_id: enterpriseId, model_id: notModel, decision_context: notContext, input_hash: await sha256(inputData), output_hash: await sha256(outputData), outcome_label: notOutcome, sensitivity_level: 'high', topic_id: topicId }) });
      setNotResult(r); setLastInputData(inputData); setLastOutputData(outputData);
      setVerifyId(r.notarization_id); setOversightId(r.notarization_id); setReversalId(r.notarization_id);
      addLog('Notarize Decision', true, r);
    } catch (e: any) { setNotResult({ error: e.message }); addLog('Notarize Decision', false, { error: e.message }); }
    finally { setNotLoading(false); }
  }

  async function verify() {
    setVerifyLoading(true); setVerifyResult(null);
    try {
      const r = await apiFetch('/api/v1/verify', { method: 'POST', body: JSON.stringify({ notarization_id: verifyId, input_data: lastInputData, output_data: lastOutputData }) });
      setVerifyResult(r); addLog('Verify Integrity', true, r);
    } catch (e: any) { setVerifyResult({ error: e.message }); addLog('Verify Integrity', false, { error: e.message }); }
    finally { setVerifyLoading(false); }
  }

  async function tamperTest() {
    setTamperLoading(true); setTamperResult(null);
    try {
      const r = await apiFetch('/api/v1/verify', { method: 'POST', body: JSON.stringify({ notarization_id: verifyId, input_data: { ...(lastInputData as any), credit_score: 999, annual_income: 999999 }, output_data: { ...(lastOutputData as any), outcome: 'approved', confidence: 1.0 } }) });
      setTamperResult(r); addLog('Tamper Detection', !r.tampered, r);
    } catch (e: any) { setTamperResult({ error: e.message }); addLog('Tamper Detection', false, { error: e.message }); }
    finally { setTamperLoading(false); }
  }

  async function initiateModel() {
    setModelLoading(true); setModelResult(null);
    try {
      const r = await apiFetch('/api/v1/models/initiate', { method: 'POST', body: JSON.stringify({ enterprise_id: enterpriseId, model_id: modelName, version: modelVersion, weights_hash: await sha256({ model: modelName, version: modelVersion, ts: Date.now() }), authorized_contexts: [notContext], mlops_user_id: 'mlops_engineer_1' }) });
      setModelResult(r); addLog('Model Registry — Initiate', true, r);
    } catch (e: any) { setModelResult({ error: e.message }); addLog('Model Registry — Initiate', false, { error: e.message }); }
    finally { setModelLoading(false); }
  }

  async function approveModel() {
    setApproveLoading(true); setApproveResult(null);
    try {
      const r = await apiFetch('/api/v1/models/approve', { method: 'POST', body: JSON.stringify({ model_id: modelName, version: modelVersion, compliance_user_id: 'compliance_officer_1' }) });
      setApproveResult(r); addLog('Model Registry — Approve', true, r);
    } catch (e: any) { setApproveResult({ error: e.message }); addLog('Model Registry — Approve', false, { error: e.message }); }
    finally { setApproveLoading(false); }
  }

  async function logOversight() {
    setOversightLoading(true); setOversightResult(null);
    try {
      const r = await apiFetch('/api/v1/oversight/review', { method: 'POST', body: JSON.stringify({ notarization_id: oversightId, review_data: { reviewer_id: oversightReviewer, outcome: oversightDecision, reviewer_role_hash: await sha256(oversightReviewer), notes: 'Manual review completed.', reviewed_at: new Date().toISOString() } }) });
      setOversightResult(r); addLog('Human Oversight Review', true, r);
    } catch (e: any) { setOversightResult({ error: e.message }); addLog('Human Oversight Review', false, { error: e.message }); }
    finally { setOversightLoading(false); }
  }

  async function logReversal() {
    setReversalLoading(true); setReversalResult(null);
    try {
      const r = await apiFetch('/api/v1/oversight/reversal', { method: 'POST', body: JSON.stringify({ notarization_id: reversalId, reversal_data: { reason: reversalReason, reversed_by_role_hash: await sha256(reversalRole), new_outcome: reversalNewOutcome } }) });
      setReversalResult(r); addLog('Decision Reversal', true, r);
    } catch (e: any) { setReversalResult({ error: e.message }); addLog('Decision Reversal', false, { error: e.message }); }
    finally { setReversalLoading(false); }
  }

  async function fetchAnomalies() {
    setAnomaliesLoading(true);
    try {
      const r = await apiFetch(`/api/v1/anomalies?enterprise_id=${enterpriseId}`);
      const list = Array.isArray(r) ? r : (r.anomalies || []);
      setAnomalies(list); addLog('Anomaly Monitor', true, { count: list.length });
    } catch (e: any) { setAnomalies([]); addLog('Anomaly Monitor', false, { error: e.message }); }
    finally { setAnomaliesLoading(false); }
  }

  async function generateReport() {
    setReportLoading(true); setReportResult(null);
    try {
      const r = await apiFetch('/api/v1/reports', { method: 'POST', body: JSON.stringify({ enterprise_id: enterpriseId, period_from: reportFrom, period_to: reportTo, report_type: reportType }) });
      setReportResult(r); addLog('Compliance Report', true, r);
    } catch (e: any) { setReportResult({ error: e.message }); addLog('Compliance Report', false, { error: e.message }); }
    finally { setReportLoading(false); }
  }

  async function runQuery() {
    setQueryLoading(true); setQueryResult(null);
    try {
      const r = await apiFetch('/api/v1/query', { method: 'POST', body: JSON.stringify({ enterprise_id: enterpriseId, query, regulator_id: 'regulator_sec_001' }) });
      setQueryResult(r); addLog('AI Audit Query', true, r);
    } catch (e: any) { setQueryResult({ error: e.message }); addLog('AI Audit Query', false, { error: e.message }); }
    finally { setQueryLoading(false); }
  }

  async function runBatch() {
    setBatchLoading(true); setBatchResult(null);
    try {
      const records = await Promise.all(Array.from({ length: 3 }, async (_, i) => {
        const inp = { applicant_id: `BATCH-${i}`, credit_score: 650 + i * 20 };
        const out = { outcome: i === 0 ? 'denied' : 'approved', confidence: 0.85 + i * 0.05 };
        return { enterprise_id: enterpriseId, model_id: notModel, decision_context: notContext, input_hash: await sha256(inp), output_hash: await sha256(out), outcome_label: out.outcome, sensitivity_level: 'medium' };
      }));
      const r = await apiFetch('/api/v1/notarize/batch', { method: 'POST', body: JSON.stringify({ records, topic_id: topicId }) });
      setBatchResult(r); addLog('Batch Notarization', true, r);
    } catch (e: any) { setBatchResult({ error: e.message }); addLog('Batch Notarization', false, { error: e.message }); }
    finally { setBatchLoading(false); }
  }

  // ── Design primitives ─────────────────────────────────────────────
  const inputCls = "w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-colors";
  const labelCls = "block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5";

  const Btn = ({ onClick, loading, children, variant = 'primary', disabled }: {
    onClick: () => void; loading: boolean; children: React.ReactNode; variant?: string; disabled?: boolean;
  }) => (
    <button onClick={onClick} disabled={loading || disabled}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
        variant === 'ghost'
          ? 'border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600'
          : 'bg-violet-600 hover:bg-violet-500 text-white shadow-[0_1px_2px_rgba(0,0,0,0.4)]'
      }`}>
      {loading ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Running…</> : children}
    </button>
  );

  const Field = ({ label, value, onChange, placeholder, type = 'text' }: {
    label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
  }) => (
    <div>
      <label className={labelCls}>{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={inputCls} />
    </div>
  );

  const Sel = ({ label, value, onChange, options }: {
    label: string; value: string; onChange: (v: string) => void; options: string[];
  }) => (
    <div>
      <label className={labelCls}>{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)} className={inputCls}>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );

  const Out = ({ data }: { data: any }) => {
    if (!data) return null;
    const isErr = !!data.error;
    const isTampered = data.tampered || data.result === 'TAMPERED';
    return (
      <div className={`rounded-lg border overflow-hidden ${isErr ? 'border-red-500/30' : isTampered ? 'border-amber-500/30' : 'border-emerald-500/30'}`}>
        <div className={`px-3 py-1.5 flex items-center gap-2 border-b text-xs font-medium ${isErr ? 'bg-red-500/10 border-red-500/20 text-red-400' : isTampered ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}`}>
          <Circle className="w-2 h-2 fill-current" />
          {isErr ? 'Error' : isTampered ? 'Tampered' : 'Success'}
        </div>
        <pre className="text-xs text-zinc-600 dark:text-zinc-400 font-mono p-3 overflow-auto max-h-44 bg-zinc-50 dark:bg-zinc-950 leading-relaxed">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    );
  };

  const KV = ({ items }: { items: [string, any][] }) => (
    <div className="grid grid-cols-3 gap-2">
      {items.map(([k, v]) => (
        <div key={k} className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2">
          <p className="text-[11px] text-zinc-500 mb-0.5">{k}</p>
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">{String(v ?? '—')}</p>
        </div>
      ))}
    </div>
  );

  const InfoBox = ({ color, title, children }: { color: string; title: string; children: React.ReactNode }) => (
    <div className={`rounded-lg border p-3 ${color}`}>
      <p className="text-xs font-semibold mb-1">{title}</p>
      <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">{children}</p>
    </div>
  );

  const SectionHeader = ({ title, desc }: { title: string; desc: string }) => (
    <div className="mb-5">
      <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">{title}</h2>
      <p className="text-sm text-zinc-500 mt-0.5 leading-relaxed">{desc}</p>
    </div>
  );

  // ── Panels ────────────────────────────────────────────────────────
  const panels: Record<string, React.ReactNode> = {

    enterprise: <>
      <SectionHeader title="Enterprise Setup" desc="Register a new enterprise and provision dedicated Hedera HCS topics for immutable audit trails." />
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Enterprise ID" value={enterpriseId} onChange={setEnterpriseId} placeholder="ent_demo" />
          <Field label="Company Name" value={companyName} onChange={setCompanyName} />
        </div>
        <Btn onClick={setupEnterprise} loading={entLoading}>Initialize on Hedera</Btn>
        {entResult && !entResult.error && (
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(entResult.topics || {}).map(([k, v]) => (
              <div key={k} className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2">
                <p className="text-[11px] text-zinc-500 capitalize">{k} topic</p>
                <p className="text-xs font-mono text-violet-500 dark:text-violet-400 truncate">{v as string}</p>
              </div>
            ))}
          </div>
        )}
        <Out data={entResult} />
      </div>
    </>,

    notarize: <>
      <SectionHeader title="Notarize an AI Decision" desc="Submit an AI inference for immutable notarization. Input and output are SHA-256 hashed client-side — only hashes reach the backend." />
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <Field label="Model ID" value={notModel} onChange={setNotModel} />
          <Sel label="Decision Context" value={notContext} onChange={setNotContext} options={['loan_application', 'credit_review', 'transaction_screening', 'fraud_detection']} />
          <Sel label="Outcome" value={notOutcome} onChange={setNotOutcome} options={['approved', 'denied', 'flagged', 'escalated']} />
        </div>
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
          <div className="px-3 py-1.5 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-700" /><span className="w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-700" /><span className="w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-700" />
            <span className="text-xs text-zinc-400 dark:text-zinc-600 ml-1">Payload — hashed client-side before sending</span>
          </div>
          <div className="grid grid-cols-2 divide-x divide-zinc-200 dark:divide-zinc-800 p-4 gap-0">
            <div className="pr-4">
              <p className="text-[11px] text-zinc-400 dark:text-zinc-600 uppercase tracking-wider mb-2">Input</p>
              <pre className="text-xs text-zinc-600 dark:text-zinc-400 font-mono leading-relaxed">{'{\n  "applicant_id": "A-<ts>",\n  "credit_score": 720,\n  "annual_income": 85000,\n  "loan_amount": 25000\n}'}</pre>
            </div>
            <div className="pl-4">
              <p className="text-[11px] text-zinc-400 dark:text-zinc-600 uppercase tracking-wider mb-2">Output</p>
              <pre className="text-xs text-zinc-600 dark:text-zinc-400 font-mono leading-relaxed">{`{\n  "outcome": "${notOutcome}",\n  "confidence": 0.94,\n  "model_version": "3.0.0"\n}`}</pre>
            </div>
          </div>
        </div>
        <Btn onClick={notarize} loading={notLoading}>Submit to Hedera HCS</Btn>
        {notResult && !notResult.error && <KV items={[['Notarization ID', notResult.notarization_id], ['HCS Sequence', notResult.hcs_sequence_number ?? notResult.hcs_sequence ?? '—'], ['Status', notResult.status || 'recorded']]} />}
        <Out data={notResult} />
      </div>
    </>,

    verify: <>
      <SectionHeader title="Verify Integrity" desc="Recompute SHA-256 hashes from the original data and compare against what was anchored to Hedera HCS. Expect VERIFIED." />
      <div className="space-y-4">
        <Field label="Notarization ID — auto-filled from Notarize step" value={verifyId} onChange={setVerifyId} placeholder="pm_..." />
        {!lastInputData && <p className="text-xs text-amber-500 flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5" />Run the Notarize step first to populate the original data.</p>}
        <Btn onClick={verify} loading={verifyLoading} disabled={!verifyId}>Verify Against Hedera</Btn>
        {verifyResult && (
          <div className={`rounded-xl border-2 p-6 text-center ${verifyResult.tampered || verifyResult.result === 'TAMPERED' ? 'border-amber-500/50 bg-amber-500/5' : verifyResult.error ? 'border-red-500/50 bg-red-500/5' : 'border-emerald-500/50 bg-emerald-500/5'}`}>
            <p className={`text-3xl font-bold tracking-tight ${verifyResult.tampered || verifyResult.result === 'TAMPERED' ? 'text-amber-400' : verifyResult.error ? 'text-red-400' : 'text-emerald-400'}`}>
              {verifyResult.error ? 'ERROR' : verifyResult.tampered || verifyResult.result === 'TAMPERED' ? 'TAMPERED' : 'VERIFIED ✓'}
            </p>
            {verifyResult.hcs_sequence_number && <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-2">HCS Sequence #{verifyResult.hcs_sequence_number}</p>}
          </div>
        )}
        <Out data={verifyResult} />
      </div>
    </>,

    tamper: <>
      <SectionHeader title="Tamper Detection" desc="Submit modified data against the same notarization ID. ProofMind detects the hash mismatch and flags it as TAMPERED." />
      <div className="space-y-4">
        <InfoBox color="border-amber-500/20 bg-amber-500/5 text-amber-400" title="What happens:">
          Sends the same notarization ID but with modified values (credit_score: 999, income: 999999). The backend recomputes hashes and detects they don't match the HCS record.
        </InfoBox>
        {!verifyId && <p className="text-xs text-amber-500 flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5" />Run the Notarize step first.</p>}
        <Btn onClick={tamperTest} loading={tamperLoading} disabled={!verifyId}>Run Tamper Test</Btn>
        {tamperResult && (
          <div className={`rounded-xl border-2 p-6 text-center ${tamperResult.tampered || tamperResult.result === 'TAMPERED' ? 'border-amber-500/50 bg-amber-500/5' : tamperResult.error ? 'border-red-500/50 bg-red-500/5' : 'border-emerald-500/50 bg-emerald-500/5'}`}>
            <p className={`text-3xl font-bold tracking-tight ${tamperResult.tampered || tamperResult.result === 'TAMPERED' ? 'text-amber-400' : tamperResult.error ? 'text-red-400' : 'text-emerald-400'}`}>
              {tamperResult.error ? 'ERROR' : tamperResult.tampered || tamperResult.result === 'TAMPERED' ? 'TAMPERED DETECTED ✗' : 'VERIFIED'}
            </p>
          </div>
        )}
        <Out data={tamperResult} />
      </div>
    </>,

    model: <>
      <SectionHeader title="Model Registry — Dual Signature" desc="Two-step cryptographic approval: MLOps initiates, Compliance officer approves. Both signatures are anchored to Hedera." />
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Model Name" value={modelName} onChange={setModelName} />
          <Field label="Version" value={modelVersion} onChange={setModelVersion} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100/50 dark:bg-zinc-900/50 p-4 space-y-3">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-violet-400">Step A — MLOps Engineer</span>
              <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">Initiates with cryptographic model weights hash</p>
            </div>
            <Btn onClick={initiateModel} loading={modelLoading}>Initiate Registration</Btn>
            <Out data={modelResult} />
          </div>
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100/50 dark:bg-zinc-900/50 p-4 space-y-3">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-emerald-400">Step B — Compliance Officer</span>
              <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">Countersigns to activate model for production</p>
            </div>
            <Btn onClick={approveModel} loading={approveLoading}>Approve & Activate</Btn>
            <Out data={approveResult} />
          </div>
        </div>
      </div>
    </>,

    oversight: <>
      <SectionHeader title="Human Oversight Logging" desc="Log a human reviewer's decision on an AI notarization. The review is anchored to HCS as an immutable audit record." />
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <Field label="Notarization ID" value={oversightId} onChange={setOversightId} placeholder="pm_..." />
          <Field label="Reviewer ID" value={oversightReviewer} onChange={setOversightReviewer} />
          <Sel label="Decision" value={oversightDecision} onChange={setOversightDecision} options={['upheld', 'reversed', 'escalated', 'reviewed']} />
        </div>
        <Btn onClick={logOversight} loading={oversightLoading} disabled={!oversightId}>Log Review to HCS</Btn>
        {oversightResult && !oversightResult.error && <KV items={[['Review Outcome', oversightResult.review_outcome], ['HCS Sequence', oversightResult.hcs_sequence], ['Enterprise', oversightResult.enterprise_id]]} />}
        <Out data={oversightResult} />
      </div>
    </>,

    reversal: <>
      <SectionHeader title="Decision Reversal" desc="When a human overturns an AI decision, the reversal is anchored immutably to Hedera HCS — a tamper-proof record of who changed what and why." />
      <div className="space-y-4">
        <InfoBox color="border-indigo-500/20 bg-indigo-500/5 text-indigo-400" title="Why this matters:">
          Regulators can verify not just the original AI decision but any human overrides — both are immutably recorded. This closes the governance gap where decisions are changed without audit evidence.
        </InfoBox>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Notarization ID to Reverse" value={reversalId} onChange={setReversalId} placeholder="pm_..." />
          <Sel label="New Outcome" value={reversalNewOutcome} onChange={setReversalNewOutcome} options={['approved', 'denied', 'flagged', 'escalated']} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Reversal Reason" value={reversalReason} onChange={setReversalReason} />
          <Field label="Reviewer Role" value={reversalRole} onChange={setReversalRole} />
        </div>
        <Btn onClick={logReversal} loading={reversalLoading} disabled={!reversalId}>Anchor Reversal to HCS</Btn>
        {reversalResult && !reversalResult.error && <KV items={[['Original Outcome', reversalResult.original_outcome], ['New Outcome', reversalResult.new_outcome], ['HCS Sequence', reversalResult.hcs_sequence]]} />}
        <Out data={reversalResult} />
      </div>
    </>,

    anomalies: <>
      <SectionHeader title="Anomaly Monitor" desc="The Audit Agent monitors notarization patterns in real time and flags statistical anomalies: drift, bias, unregistered models, and volume spikes." />
      <div className="space-y-4">
        <Btn onClick={fetchAnomalies} loading={anomaliesLoading}>Fetch Anomalies</Btn>
        {anomalies.length > 0 ? (
          <div className="space-y-2">
            {anomalies.map((a, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0 mt-0.5 ${a.severity === 'high' || a.severity === 'critical' ? 'bg-red-500/15 text-red-400' : a.severity === 'medium' ? 'bg-amber-500/15 text-amber-400' : 'bg-yellow-500/15 text-yellow-400'}`}>
                  {(a.severity || 'low').toUpperCase()}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{a.anomaly_class || a.type || 'Unknown'}</p>
                  <p className="text-xs text-zinc-500 mt-0.5 truncate">{typeof a.detail === 'object' ? JSON.stringify(a.detail) : a.detail || a.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : !anomaliesLoading && (
          <p className="text-sm text-zinc-500">No anomalies detected for this enterprise.</p>
        )}
      </div>
    </>,

    report: <>
      <SectionHeader title="Compliance Report" desc="Generate a regulatory compliance report signed with AWS KMS and anchored to Hedera HCS. Supports EU AI Act, SEC, HIPAA, and GDPR." />
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <Sel label="Framework" value={reportType} onChange={setReportType} options={['EU_AI_ACT', 'SEC', 'HIPAA', 'GDPR']} />
          <Field label="Period From" value={reportFrom} onChange={setReportFrom} type="date" />
          <Field label="Period To" value={reportTo} onChange={setReportTo} type="date" />
        </div>
        <Btn onClick={generateReport} loading={reportLoading}>Generate & Anchor Report</Btn>
        {reportResult && !reportResult.error && <KV items={[['Total Decisions', reportResult.total_decisions], ['Anomaly Count', reportResult.anomaly_count], ['Framework', reportResult.report_type], ['Status', reportResult.status || 'generated'], ['HCS Anchored', reportResult.hcs_sequence ? `#${reportResult.hcs_sequence}` : 'Pending'], ['Generated', reportResult.generated_at ? new Date(reportResult.generated_at).toLocaleString() : '—']]} />}
        <Out data={reportResult} />
      </div>
    </>,

    query: <>
      <SectionHeader title="AI Audit Query" desc="Ask the Gemini-powered Audit Agent natural language questions about the enterprise's AI decision history. Designed for regulators and compliance officers." />
      <div className="space-y-4">
        <div>
          <label className={labelCls}>Query</label>
          <textarea value={query} onChange={e => setQuery(e.target.value)} rows={2}
            className={inputCls + ' resize-none'} />
        </div>
        <div className="flex flex-wrap gap-2">
          {["Give me a risk summary of this enterprise's AI decision activity", "How many anomalies were detected and what are they?", "Were there any unregistered models making decisions?", "What is the overall compliance posture?"].map(q => (
            <button key={q} onClick={() => setQuery(q)}
              className="text-xs px-2.5 py-1 rounded-md border border-zinc-300 dark:border-zinc-700 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:border-zinc-400 dark:hover:border-zinc-500 transition-colors">
              {q.length > 48 ? q.slice(0, 48) + '…' : q}
            </button>
          ))}
        </div>
        <Btn onClick={runQuery} loading={queryLoading}>Run Query</Btn>
        {queryResult && !queryResult.error && queryResult.answer && (
          <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-violet-400 mb-3">AI Response</p>
            <p className="text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed">{queryResult.answer}</p>
            {queryResult.data_used && (
              <div className="mt-4 pt-3 border-t border-zinc-200 dark:border-zinc-800 flex gap-5">
                <span className="text-xs text-zinc-500 dark:text-zinc-600">Decisions <span className="text-zinc-700 dark:text-zinc-300 font-medium">{queryResult.data_used.total_decisions}</span></span>
                <span className="text-xs text-zinc-500 dark:text-zinc-600">Anomalies <span className="text-zinc-700 dark:text-zinc-300 font-medium">{queryResult.data_used.anomaly_count}</span></span>
                <span className="text-xs text-zinc-500 dark:text-zinc-600">Models <span className="text-zinc-700 dark:text-zinc-300 font-medium">{queryResult.data_used.model_count}</span></span>
              </div>
            )}
          </div>
        )}
        {queryResult?.error && <Out data={queryResult} />}
      </div>
    </>,

    batch: <>
      <SectionHeader title="Batch Notarization" desc="Submit multiple AI decisions in a single call. All records are individually hashed and anchored to Hedera HCS atomically." />
      <div className="space-y-4">
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
          <div className="px-3 py-1.5 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-700" /><span className="w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-700" /><span className="w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-700" />
            <span className="text-xs text-zinc-400 dark:text-zinc-600 ml-1">3 decisions queued for batch submission</span>
          </div>
          <div className="p-4 space-y-1.5">
            {[{ id: 'BATCH-0', score: 650, out: 'denied' }, { id: 'BATCH-1', score: 670, out: 'approved' }, { id: 'BATCH-2', score: 690, out: 'approved' }].map(r => (
              <div key={r.id} className="flex items-center gap-3">
                <span className="text-xs font-mono text-zinc-400 dark:text-zinc-600">{r.id}</span>
                <span className="text-xs text-zinc-500">credit_score={r.score}</span>
                <ChevronRight className="w-3 h-3 text-zinc-300 dark:text-zinc-700" />
                <span className={`text-xs font-medium ${r.out === 'denied' ? 'text-red-400' : 'text-emerald-400'}`}>{r.out}</span>
              </div>
            ))}
          </div>
        </div>
        <Btn onClick={runBatch} loading={batchLoading}>Submit Batch to Hedera</Btn>
        {batchResult && !batchResult.error && <KV items={[['Records', batchResult.results?.length ?? 3], ['Status', batchResult.status || 'completed'], ['Enterprise', enterpriseId]]} />}
        <Out data={batchResult} />
      </div>
    </>,
  };

  // ── Render ────────────────────────────────────────────────────────
  const doneMap: Record<string, boolean> = {
    enterprise: !!entResult && !entResult?.error,
    notarize: !!notResult && !notResult?.error,
    verify: !!verifyResult && !verifyResult?.error,
    tamper: !!tamperResult,
    model: !!approveResult && !approveResult?.error,
    oversight: !!oversightResult && !oversightResult?.error,
    reversal: !!reversalResult && !reversalResult?.error,
    anomalies: anomalies.length > 0,
    report: !!reportResult && !reportResult?.error,
    query: !!queryResult && !queryResult?.error,
    batch: !!batchResult && !batchResult?.error,
  };

  return (
    <div className="h-screen bg-white text-zinc-900 flex flex-col overflow-hidden font-sans">

      {/* Playground title bar */}
      <div className="shrink-0 h-10 border-b border-black/[0.06] bg-[#FAFAFA] flex items-center px-6 gap-3">
        <Link
          to="/"
          className="flex items-center gap-1.5 text-[#9AA0A6] hover:text-[#45474D] transition-colors"
          style={{ fontFamily: "'Google Sans', sans-serif" }}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="text-xs">Home</span>
        </Link>
        <span className="text-black/[0.12] text-xs">/</span>
        <span className="material-symbols-outlined text-[15px] text-[#4F46E5]">code</span>
        <span className="text-xs font-medium text-[#45474D]" style={{ fontFamily: "'Google Sans', sans-serif" }}>
          Playground
        </span>
        <span className="text-black/[0.15] text-xs">·</span>
        <span className="text-xs text-[#9AA0A6] font-mono">{enterpriseId}</span>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-emerald-600 font-medium" style={{ fontFamily: "'Google Sans', sans-serif" }}>Live</span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 min-h-0">

        {/* Sidebar */}
        <aside className="w-48 shrink-0 border-r border-zinc-200 dark:border-zinc-800 flex flex-col bg-zinc-50 dark:bg-zinc-950 overflow-y-auto">
          <div className="p-2 flex-1">
            {GROUPS.map(group => {
              const items = SECTIONS.filter(s => s.group === group);
              return (
                <div key={group} className="mb-1">
                  <p className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest px-2 py-2">{group}</p>
                  {items.map(s => {
                    const Icon = s.icon;
                    return (
                      <button key={s.id} onClick={() => setActive(s.id)}
                        className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-left transition-colors mb-0.5 ${
                          active === s.id
                            ? 'bg-violet-600/15 text-violet-700 dark:text-violet-300 border border-violet-500/20'
                            : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900'
                        }`}>
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                        <span className="text-xs flex-1 leading-tight">{s.label}</span>
                        {doneMap[s.id] && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Config */}
          <div className="border-t border-zinc-200 dark:border-zinc-800 p-3 space-y-2.5">
            <p className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest">Config</p>
            <div>
              <label className="text-[11px] text-zinc-400 dark:text-zinc-600 block mb-1">Enterprise ID</label>
              <input value={enterpriseId} onChange={e => setEnterpriseId(e.target.value)}
                className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded px-2 py-1 text-xs text-zinc-700 dark:text-zinc-300 focus:outline-none focus:border-violet-500" />
            </div>
            <div>
              <label className="text-[11px] text-zinc-400 dark:text-zinc-600 block mb-1">HCS Topic</label>
              <input value={topicId} onChange={e => setTopicId(e.target.value)}
                className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded px-2 py-1 text-xs text-zinc-700 dark:text-zinc-300 focus:outline-none focus:border-violet-500" />
            </div>
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1 flex flex-col min-w-0 min-h-0">

          {/* Panel */}
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-2xl p-6">
              {panels[active]}
            </div>
          </main>

          {/* Log */}
          <div className="shrink-0 h-32 border-t border-zinc-200 dark:border-zinc-800 flex flex-col" ref={logRef}>
            <div className="flex items-center justify-between px-4 py-1.5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                <span className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Activity Log</span>
              </div>
              <button onClick={() => setLog([])} className="text-[11px] text-zinc-400 dark:text-zinc-700 hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors">Clear</button>
            </div>
            <div className="overflow-y-auto flex-1 px-4 py-1">
              {log.length === 0 ? (
                <p className="text-xs text-zinc-400 dark:text-zinc-700 py-2">No activity yet.</p>
              ) : log.map((e, i) => (
                <div key={i} className="flex items-center gap-3 py-0.5">
                  <span className={`font-mono text-[11px] shrink-0 ${e.ok ? 'text-emerald-500' : 'text-red-500'}`}>{e.ok ? '✓' : '✗'}</span>
                  <span className="text-[11px] text-zinc-400 dark:text-zinc-600 font-mono shrink-0">{e.ts}</span>
                  <span className={`text-[11px] font-medium shrink-0 ${e.ok ? 'text-zinc-700 dark:text-zinc-300' : 'text-red-500 dark:text-red-400'}`}>{e.label}</span>
                  <span className="text-[11px] text-zinc-400 dark:text-zinc-600 truncate">{e.body.replace(/\n/g, ' ').slice(0, 120)}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
