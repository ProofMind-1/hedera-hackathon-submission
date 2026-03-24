import DocsLayout, { TocItem } from "@/components/docs/DocsLayout";
import CodeBlock from "@/components/CodeBlock";

interface GenericDocProps {
  title: string;
  description: string;
  toc: TocItem[];
  children: React.ReactNode;
}

const GenericDoc = ({ title, description, toc, children }: GenericDocProps) => (
  <DocsLayout toc={toc}>
    <h1 className="text-4xl font-bold mb-4">{title}</h1>
    <p className="text-lg text-muted-foreground mb-8">{description}</p>
    {children}
  </DocsLayout>
);

// Decorator Usage
export const DecoratorUsage = () => (
  <GenericDoc title="Decorator Usage" description="Use Python decorators to notarize AI decisions with zero code changes." toc={[
    { id: "basic", title: "Basic Usage", level: 2 },
    { id: "advanced", title: "Advanced Options", level: 2 },
  ]}>
    <h2 id="basic" className="text-2xl font-bold mt-12 mb-4 scroll-mt-20">Basic Usage</h2>
    <CodeBlock language="python" code={`@pm.notarize(model_id="model_v1", context="inference")
def predict(data):
    return model(data)`} />
    <h2 id="advanced" className="text-2xl font-bold mt-12 mb-4 scroll-mt-20">Advanced Options</h2>
    <CodeBlock language="python" code={`@pm.notarize(
    model_id="model_v1",
    context="inference",
    sensitivity="high",
    tags={"team": "ml", "env": "production"},
    pii_fields=["ssn", "email"],  # Auto-scrubbed before hashing
    on_error="log_and_continue"   # Don't block inference on notarization failure
)
def predict(data):
    return model(data)`} />
  </GenericDoc>
);

// Manual Notarization
export const ManualNotarization = () => (
  <GenericDoc title="Manual Notarization" description="Notarize decisions programmatically without decorators." toc={[
    { id: "python", title: "Python", level: 2 },
    { id: "nodejs", title: "Node.js", level: 2 },
  ]}>
    <h2 id="python" className="text-2xl font-bold mt-12 mb-4 scroll-mt-20">Python</h2>
    <CodeBlock language="python" code={`receipt = pm.notarize_manual(
    model_id="fraud_detection_v2",
    input_data=transaction,
    output_data=score,
    context="fraud_check"
)`} />
    <h2 id="nodejs" className="text-2xl font-bold mt-12 mb-4 scroll-mt-20">Node.js</h2>
    <CodeBlock language="javascript" code={`const receipt = await pm.notarize({
  modelId: 'fraud_detection_v2',
  inputData: transaction,
  outputData: score,
  context: 'fraud_check'
});`} />
  </GenericDoc>
);

// Batch Notarization
export const BatchNotarization = () => (
  <GenericDoc title="Batch Notarization" description="Efficiently notarize multiple decisions in a single operation." toc={[
    { id: "usage", title: "Usage", level: 2 },
    { id: "performance", title: "Performance", level: 2 },
  ]}>
    <h2 id="usage" className="text-2xl font-bold mt-12 mb-4 scroll-mt-20">Usage</h2>
    <CodeBlock language="python" code={`receipts = pm.notarize_batch(
    decisions=[
        {"model_id": "m1", "input": d1, "output": o1},
        {"model_id": "m1", "input": d2, "output": o2},
        {"model_id": "m1", "input": d3, "output": o3},
    ],
    context="batch_scoring"
)`} />
    <h2 id="performance" className="text-2xl font-bold mt-12 mb-4 scroll-mt-20">Performance</h2>
    <p className="text-muted-foreground">Batch operations use a single KMS signing request and a single HCS submission, reducing overhead by up to 90% compared to individual notarizations.</p>
  </GenericDoc>
);

// Data Flow
export const DataFlow = () => (
  <GenericDoc title="Data Flow" description="Detailed breakdown of how data moves through the ProofMind system." toc={[
    { id: "flow", title: "Flow Steps", level: 2 },
    { id: "boundary", title: "Data Boundary", level: 2 },
  ]}>
    <h2 id="flow" className="text-2xl font-bold mt-12 mb-4 scroll-mt-20">Flow Steps</h2>
    <ol className="list-decimal pl-6 text-muted-foreground space-y-3">
      <li>AI model receives inference request within your infrastructure</li>
      <li>SDK intercepts input/output at the wrapper layer</li>
      <li>PII scrubber removes sensitive fields (configurable)</li>
      <li>SHA-256 hashes computed for input, output, and metadata</li>
      <li>Hash bundle packaged with model_id, context, and timestamp</li>
      <li>AWS KMS signs the bundle (creates CloudTrail event)</li>
      <li>Signed record submitted to Hedera HCS topic</li>
      <li>Consensus timestamp and sequence number returned</li>
    </ol>
    <h2 id="boundary" className="text-2xl font-bold mt-12 mb-4 scroll-mt-20">Data Boundary</h2>
    <p className="text-muted-foreground">Only SHA-256 hashes, model IDs, context strings, and timestamps leave your infrastructure. Original data, model weights, and business logic remain entirely within your environment.</p>
  </GenericDoc>
);

// Hashing Model
export const HashingModel = () => (
  <GenericDoc title="Hashing Model" description="How ProofMind computes and structures cryptographic hashes." toc={[
    { id: "algorithm", title: "Hash Algorithm", level: 2 },
    { id: "structure", title: "Hash Structure", level: 2 },
  ]}>
    <h2 id="algorithm" className="text-2xl font-bold mt-12 mb-4 scroll-mt-20">Hash Algorithm</h2>
    <p className="text-muted-foreground mb-4">ProofMind uses SHA-256 as the default hashing algorithm. The hash is computed over a canonical JSON representation of the data to ensure deterministic results.</p>
    <CodeBlock language="python" code={`# Hash computation (simplified)
import hashlib, json

def compute_hash(data):
    canonical = json.dumps(data, sort_keys=True, separators=(',', ':'))
    return hashlib.sha256(canonical.encode()).hexdigest()`} />
    <h2 id="structure" className="text-2xl font-bold mt-12 mb-4 scroll-mt-20">Hash Structure</h2>
    <CodeBlock language="json" code={`{
  "input_hash": "sha256:a1b2c3...",
  "output_hash": "sha256:d4e5f6...",
  "model_id": "credit_risk_v4.2",
  "model_hash": "sha256:g7h8i9...",
  "context": "loan_application_decision",
  "timestamp": "2024-01-15T10:30:00Z",
  "enterprise_id": "ent_acme_financial"
}`} />
  </GenericDoc>
);

// Hedera HCS Integration
export const HederaHCS = () => (
  <GenericDoc title="Hedera HCS Integration" description="How ProofMind leverages Hedera Consensus Service for immutability." toc={[
    { id: "why-hedera", title: "Why Hedera", level: 2 },
    { id: "topics", title: "HCS Topics", level: 2 },
  ]}>
    <h2 id="why-hedera" className="text-2xl font-bold mt-12 mb-4 scroll-mt-20">Why Hedera</h2>
    <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
      <li>Sub-second consensus finality</li>
      <li>$0.0001 per message (enterprise-viable at scale)</li>
      <li>Governed by global enterprises (Google, IBM, Boeing, etc.)</li>
      <li>ABFT consensus — mathematically proven security</li>
    </ul>
    <h2 id="topics" className="text-2xl font-bold mt-12 mb-4 scroll-mt-20">HCS Topics</h2>
    <p className="text-muted-foreground">Each enterprise gets a dedicated HCS topic. All notarization records are submitted to this topic, creating an ordered, immutable sequence of audit events.</p>
  </GenericDoc>
);

// AWS KMS
export const AWSKMS = () => (
  <GenericDoc title="AWS KMS Signing" description="Enterprise key management for notarization signing." toc={[
    { id: "setup", title: "KMS Setup", level: 2 },
    { id: "signing", title: "Signing Process", level: 2 },
  ]}>
    <h2 id="setup" className="text-2xl font-bold mt-12 mb-4 scroll-mt-20">KMS Setup</h2>
    <p className="text-muted-foreground mb-4">ProofMind uses your enterprise AWS KMS key to sign notarization records. The key must be an asymmetric signing key (RSA_2048 or ECC_NIST_P256).</p>
    <CodeBlock language="bash" filename="Terminal" code={`aws kms create-key \\
  --key-spec RSA_2048 \\
  --key-usage SIGN_VERIFY \\
  --description "ProofMind notarization signing key"`} />
    <h2 id="signing" className="text-2xl font-bold mt-12 mb-4 scroll-mt-20">Signing Process</h2>
    <p className="text-muted-foreground">Every KMS signing operation creates an AWS CloudTrail event, providing an independent audit trail of all notarization signing activities.</p>
  </GenericDoc>
);

// Model Registry pages
export const RegisterModels = () => (
  <GenericDoc title="Registering Models" description="Cryptographically register your AI models for version control." toc={[
    { id: "register", title: "Registration", level: 2 },
  ]}>
    <h2 id="register" className="text-2xl font-bold mt-12 mb-4 scroll-mt-20">Registration</h2>
    <CodeBlock language="python" code={`pm.register_model(
    model_id="credit_risk_v4.2",
    model_hash=pm.compute_hash(model_weights),
    framework="pytorch",
    version="4.2.0",
    owner="ml-team@acme.com",
    requires_dual_sign=True
)`} />
    <p className="text-muted-foreground mt-4">Once registered, the model's hash is recorded on Hedera. Any inference using an unregistered model version will be flagged by the Audit Agent.</p>
  </GenericDoc>
);

export const ModelVersioning = () => (
  <GenericDoc title="Version Governance" description="Enforce model version governance with cryptographic controls." toc={[
    { id: "states", title: "Version States", level: 2 },
    { id: "dual-sign", title: "Dual-Sign Requirements", level: 2 },
  ]}>
    <h2 id="states" className="text-2xl font-bold mt-12 mb-4 scroll-mt-20">Version States</h2>
    <div className="space-y-2 mb-6">
      {["draft → registered → active → deprecated → retired"].map((flow) => (
        <p key={flow} className="font-mono text-sm text-primary">{flow}</p>
      ))}
    </div>
    <h2 id="dual-sign" className="text-2xl font-bold mt-12 mb-4 scroll-mt-20">Dual-Sign Requirements</h2>
    <p className="text-muted-foreground">For high-risk models, require dual signatures from ML team lead and compliance officer before a model version can be activated.</p>
  </GenericDoc>
);

export const ModelLifecycle = () => (
  <GenericDoc title="Model Lifecycle States" description="Manage model versions through their complete lifecycle — from registration through deprecation and revocation." toc={[
    { id: "states", title: "Lifecycle States", level: 2 },
    { id: "transitions", title: "Valid Transitions", level: 2 },
    { id: "hcs-events", title: "HCS Events", level: 2 },
  ]}>
    <h2 id="states" className="text-2xl font-bold mt-12 mb-4 scroll-mt-20">Lifecycle States</h2>
    <div className="space-y-3">
      {[
        { state: "PENDING_REVIEW", color: "text-amber-600 bg-amber-500/10", desc: "Model submitted by MLOps and signed with MLOps KMS key (CloudTrail Event 1). Awaiting Compliance Officer counter-signature. Cannot be used for production notarization." },
        { state: "ACTIVE", color: "text-green-600 bg-green-500/10", desc: "Both KMS signatures present. Anchored to HCS. Approved for production inference. Notarizations referencing this model are accepted by the SDK." },
        { state: "DEPRECATED", color: "text-amber-600 bg-amber-500/10", desc: "Scheduled for retirement. Existing deployments continue with SDK warnings on each notarization. A migration deadline is set." },
        { state: "SHADOW", color: "text-purple-600 bg-purple-500/10", desc: "Model in A/B test mode. Notarizations are flagged as SHADOW — not counted in compliance reports or regulatory metrics. Allows testing a new model version in production traffic without creating a regulatory trail. Switch to ACTIVE via the dual KMS sign flow when ready to go live." },
      ].map((s) => (
        <div key={s.state} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50 border border-border">
          <span className={`font-mono text-xs font-bold px-1.5 py-0.5 rounded flex-shrink-0 ${s.color}`}>{s.state}</span>
          <span className="text-sm text-muted-foreground">{s.desc}</span>
        </div>
      ))}
    </div>
    <h2 id="transitions" className="text-2xl font-bold mt-12 mb-4 scroll-mt-20">Valid Transitions</h2>
    <CodeBlock language="text" code={`PENDING_REVIEW → ACTIVE      (Compliance Officer approves + KMS counter-signs)
PENDING_REVIEW → SHADOW      (Deploy as A/B test — no compliance trail)
PENDING_REVIEW → REVOKED     (Registration rejected — governance violation)
SHADOW         → ACTIVE      (A/B test complete — promote to full compliance)
SHADOW         → REVOKED     (A/B test cancelled or failed)
ACTIVE         → DEPRECATED  (Planned retirement with migration timeline)
ACTIVE         → REVOKED     (Emergency revocation — bias/security/regulatory)
DEPRECATED     → REVOKED     (Retirement completed or accelerated)
DEPRECATED     → ACTIVE      (Retirement cancelled — requires new approval cycle)`} />
    <h2 id="hcs-events" className="text-2xl font-bold mt-12 mb-4 scroll-mt-20">HCS Events</h2>
    <p className="text-muted-foreground mb-3">Every lifecycle transition creates a <code className="font-mono text-primary text-sm">MODEL_STATUS_CHANGED</code> event on the models HCS topic (0.0.{'{'}enterpriseId{'}'}.models):</p>
    <CodeBlock language="json" code={`{
  "eventType": "MODEL_STATUS_CHANGED",
  "modelId": "credit_risk_v4.2",
  "oldStatus": "ACTIVE",
  "newStatus": "DEPRECATED",
  "reason": "Successor model credit_risk_v4.3 approved for production",
  "changedBy": "arn:aws:sts::123456:assumed-role/ComplianceOfficerRole/j.smith",
  "effectiveAt": 1740000000
}`} />
  </GenericDoc>
);

// Audit Agent pages
export const AuditAgentOverview = () => (
  <GenericDoc title="Audit Agent" description="An autonomous AI agent that monitors your audit trail in real-time." toc={[
    { id: "what", title: "What It Does", level: 2 },
    { id: "capabilities", title: "Capabilities", level: 2 },
  ]}>
    <h2 id="what" className="text-2xl font-bold mt-12 mb-4 scroll-mt-20">What It Does</h2>
    <p className="text-muted-foreground mb-4">Each enterprise gets one dedicated Audit Agent. It continuously monitors your HCS audit stream, detects anomalies, and can answer natural language queries about your AI decision history.</p>
    <h2 id="capabilities" className="text-2xl font-bold mt-12 mb-4 scroll-mt-20">Capabilities</h2>
    <ul className="list-disc pl-6 text-muted-foreground space-y-2">
      <li>Real-time anomaly detection (drift, volume spikes, unauthorized models)</li>
      <li>Natural language query interface for regulators</li>
      <li>Automated compliance report generation</li>
      <li>Alert routing to compliance teams</li>
    </ul>
  </GenericDoc>
);

export const AnomalyDetection = () => (
  <GenericDoc title="Anomaly Detection" description="How the Audit Agent detects issues in your AI decision stream. Nine anomaly classes are monitored continuously in real-time." toc={[
    { id: "types", title: "All 9 Anomaly Classes", level: 2 },
    { id: "severity", title: "Severity Levels", level: 2 },
    { id: "hcs-schema", title: "HCS Event Schema", level: 2 },
  ]}>
    <h2 id="types" className="text-2xl font-bold mt-12 mb-4 scroll-mt-20">All 9 Anomaly Classes</h2>
    <div className="space-y-3">
      {[
        { type: "UNREGISTERED_MODEL", severity: "critical", desc: "An inference was notarized from a model ID not present in the Model Registry. Indicates an unauthorized deployment bypassing governance." },
        { type: "REVOKED_MODEL_ACTIVE", severity: "critical", desc: "A model with status REVOKED is still producing notarizations. Compliance-critical — revoked models must not run in production under any circumstances." },
        { type: "VOLUME_SPIKE", severity: "medium", desc: "Decision volume exceeds 3× the rolling 24h average within a 1-hour window. May indicate a runaway batch job or infrastructure misconfiguration." },
        { type: "CONTEXT_MISMATCH", severity: "high", desc: "A model is notarizing under a context not listed in its authorizedContexts. For example, a diagnostic model notarizing under treatment_recommendation." },
        { type: "OUTCOME_DISTRIBUTION_SHIFT", severity: "medium", desc: "The distribution of outcomeLabels deviates significantly from the model's historical baseline. May indicate model drift, data pipeline issues, or adversarial manipulation." },
        { type: "JURISDICTION_VIOLATION", severity: "high", desc: "A decision was notarized for a jurisdiction not listed in the model's jurisdictions field. Creates direct regulatory compliance risk." },
        { type: "HUMAN_OVERSIGHT_GAP", severity: "high", desc: "The human oversight review rate has fallen below the configured threshold (e.g. 95%). Required by EU AI Act Article 14 for high-risk AI systems." },
        { type: "SDK_VERSION_MISMATCH", severity: "low", desc: "Notarizations are being submitted by an SDK version below the recommended minimum. Older SDK versions may have known security or compliance gaps." },
        { type: "BATCH_WITHOUT_CONSENT", severity: "high", desc: "A batch notarization was submitted in a context requiring individual consent logging (e.g. healthcare). Consent must be captured per-decision, not per-batch." },
      ].map((a) => (
        <div key={a.type} className="p-3 rounded-lg bg-secondary/50 border border-border">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-sm text-primary">{a.type}</span>
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
              a.severity === 'critical' ? 'bg-red-500/20 text-red-600' :
              a.severity === 'high' ? 'bg-orange-500/20 text-orange-600' :
              a.severity === 'medium' ? 'bg-amber-500/20 text-amber-600' :
              'bg-blue-500/20 text-blue-600'
            }`}>{a.severity.toUpperCase()}</span>
          </div>
          <p className="text-sm text-muted-foreground">{a.desc}</p>
        </div>
      ))}
    </div>
    <h2 id="severity" className="text-2xl font-bold mt-12 mb-4 scroll-mt-20">Severity Levels</h2>
    <div className="space-y-2">
      {[
        { level: 'CRITICAL', color: 'text-red-600 bg-red-500/10', desc: 'Immediate alert within 30 seconds. Audit Agent publishes signed ANOMALY_DETECTED to HCS. Affected decisions may be quarantined pending investigation.' },
        { level: 'HIGH', color: 'text-orange-600 bg-orange-500/10', desc: 'Alert within 5 minutes. Compliance team notified. Escalation if unresolved within 24 hours.' },
        { level: 'MEDIUM', color: 'text-amber-600 bg-amber-500/10', desc: 'Alert within 1 hour. Batched daily summary if multiple medium anomalies detected.' },
        { level: 'LOW', color: 'text-blue-600 bg-blue-500/10', desc: 'Weekly digest. No immediate action required but tracked in compliance reports.' },
      ].map(s => (
        <div key={s.level} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50 border border-border">
          <span className={`text-xs font-bold px-2 py-0.5 rounded font-mono flex-shrink-0 ${s.color}`}>{s.level}</span>
          <p className="text-sm text-muted-foreground">{s.desc}</p>
        </div>
      ))}
    </div>
    <h2 id="hcs-schema" className="text-2xl font-bold mt-12 mb-4 scroll-mt-20">HCS Event Schema</h2>
    <p className="text-muted-foreground mb-3">Every anomaly creates a signed <code className="font-mono text-primary text-sm">ANOMALY_DETECTED</code> event on the enterprise's anomalies topic. This proves the Audit Agent flagged the issue — the enterprise cannot dispute they were notified.</p>
    <CodeBlock language="json" code={`{
  "eventType": "ANOMALY_DETECTED",
  "anomalyId": "anm_7f3a9b2c",
  "anomalyClass": "OUTCOME_DISTRIBUTION_SHIFT",
  "notarizationId": "pm_8c2e1d4f",
  "model": "credit_risk_v4.2",
  "severity": "medium",
  "detail": "Approval rate shifted 28% from 30-day baseline",
  "detectedAt": 1740000000,
  "agentSignature": "0x3a7f9b...",
  "hcsTopicId": "0.0.12347"
}`} />
  </GenericDoc>
);

export const RegulatorQueries = () => (
  <GenericDoc title="Regulator Queries" description="Natural language query interface for regulators and auditors." toc={[
    { id: "examples", title: "Example Queries", level: 2 },
  ]}>
    <h2 id="examples" className="text-2xl font-bold mt-12 mb-4 scroll-mt-20">Example Queries</h2>
    <div className="space-y-3">
      {[
        "Show all credit decisions made by model v4.2 in January 2024",
        "Were there any unauthorized model versions used last quarter?",
        "What was the approval rate for loan applications over $500k?",
        "Generate a compliance summary for EU AI Act Article 12",
      ].map((q) => (
        <div key={q} className="p-3 rounded-lg bg-secondary/50 border border-border font-mono text-sm text-muted-foreground">
          "{q}"
        </div>
      ))}
    </div>
  </GenericDoc>
);

export const ComplianceReports = () => (
  <GenericDoc title="Compliance Reports" description="Automated compliance report generation." toc={[
    { id: "types", title: "Report Types", level: 2 },
  ]}>
    <h2 id="types" className="text-2xl font-bold mt-12 mb-4 scroll-mt-20">Report Types</h2>
    <ul className="list-disc pl-6 text-muted-foreground space-y-2">
      <li>EU AI Act Article 12 compliance summary</li>
      <li>Model governance audit report</li>
      <li>Decision volume and anomaly report</li>
      <li>Verification integrity report</li>
      <li>Custom regulator-specific templates</li>
    </ul>
  </GenericDoc>
);

// Verification pages
export const SingleVerification = () => (
  <GenericDoc title="Single Decision Verification" description="Verify individual AI decisions against the Hedera record." toc={[
    { id: "verify", title: "Verification", level: 2 },
  ]}>
    <h2 id="verify" className="text-2xl font-bold mt-12 mb-4 scroll-mt-20">Verification</h2>
    <CodeBlock language="python" code={`result = pm.verify(
    notarization_id="ntx_abc123",
    original_input={"income": 75000, "score": 720},
    original_output={"approved": True, "rate": 4.5}
)

assert result.verified == True
assert result.tamper_detected == False
print(result.consensus_time)  # Hedera timestamp`} />
  </GenericDoc>
);

export const BatchVerification = () => (
  <GenericDoc title="Batch Verification" description="Verify multiple decisions efficiently." toc={[
    { id: "batch", title: "Batch Verify", level: 2 },
  ]}>
    <h2 id="batch" className="text-2xl font-bold mt-12 mb-4 scroll-mt-20">Batch Verify</h2>
    <CodeBlock language="python" code={`results = pm.verify_batch(
    notarization_ids=["ntx_001", "ntx_002", "ntx_003"],
    original_data=[
        {"input": {...}, "output": {...}},
        {"input": {...}, "output": {...}},
        {"input": {...}, "output": {...}},
    ]
)

failed = [r for r in results if not r.verified]
print(f"{len(failed)} tampered records detected")`} />
  </GenericDoc>
);

export const TamperDetection = () => (
  <GenericDoc title="Tamper Detection" description="How ProofMind detects and reports tampering." toc={[
    { id: "how", title: "How It Works", level: 2 },
    { id: "response", title: "Response Actions", level: 2 },
  ]}>
    <h2 id="how" className="text-2xl font-bold mt-12 mb-4 scroll-mt-20">How It Works</h2>
    <p className="text-muted-foreground mb-4">Verification recomputes the SHA-256 hash of the original data and compares it against the hash stored on Hedera. Any discrepancy indicates tampering.</p>
    <h2 id="response" className="text-2xl font-bold mt-12 mb-4 scroll-mt-20">Response Actions</h2>
    <ul className="list-disc pl-6 text-muted-foreground space-y-2">
      <li>Audit Agent alerts compliance team immediately</li>
      <li>Tampered record flagged with detailed forensic data</li>
      <li>Automatic incident report generation</li>
    </ul>
  </GenericDoc>
);

// Compliance pages
export const SECCompliance = () => (
  <GenericDoc title="SEC Financial AI Guidance" description="Meeting SEC requirements for algorithmic trading and AI-driven financial decisions." toc={[
    { id: "requirements", title: "Requirements", level: 2 },
    { id: "mapping", title: "ProofMind Mapping", level: 2 },
  ]}>
    <h2 id="requirements" className="text-2xl font-bold mt-12 mb-4 scroll-mt-20">Requirements</h2>
    <p className="text-muted-foreground mb-4">SEC guidance requires algorithmic decisions in financial services to be auditable with model governance, including model version tracking and decision trail documentation.</p>
    <h2 id="mapping" className="text-2xl font-bold mt-12 mb-4 scroll-mt-20">ProofMind Mapping</h2>
    <ul className="list-disc pl-6 text-muted-foreground space-y-2">
      <li>Model Registry provides version control and governance</li>
      <li>Every decision creates an immutable audit trail</li>
      <li>SEC examiners can query the Audit Agent directly</li>
    </ul>
  </GenericDoc>
);

export const HIPAACompliance = () => (
  <GenericDoc title="Healthcare HIPAA Model Auditing" description="HIPAA-compliant AI auditing for healthcare applications." toc={[
    { id: "approach", title: "Approach", level: 2 },
    { id: "phi", title: "PHI Protection", level: 2 },
  ]}>
    <h2 id="approach" className="text-2xl font-bold mt-12 mb-4 scroll-mt-20">Approach</h2>
    <p className="text-muted-foreground mb-4">AI-assisted clinical decisions must be documented and auditable under CMS guidance. ProofMind's hash-only submission model ensures HIPAA compliance by design.</p>
    <h2 id="phi" className="text-2xl font-bold mt-12 mb-4 scroll-mt-20">PHI Protection</h2>
    <p className="text-muted-foreground">Protected Health Information never leaves your infrastructure. Only SHA-256 hashes are submitted to Hedera, making it mathematically impossible to reconstruct original patient data from the audit trail.</p>
  </GenericDoc>
);

// Security pages
export const SecurityHashing = () => (
  <GenericDoc title="Hashing" description="Cryptographic hashing implementation details." toc={[
    { id: "algorithm", title: "Algorithm", level: 2 },
    { id: "collision", title: "Collision Resistance", level: 2 },
  ]}>
    <h2 id="algorithm" className="text-2xl font-bold mt-12 mb-4 scroll-mt-20">Algorithm</h2>
    <p className="text-muted-foreground mb-4">SHA-256 (part of SHA-2 family) with canonical JSON serialization. Deterministic: same input always produces same hash.</p>
    <h2 id="collision" className="text-2xl font-bold mt-12 mb-4 scroll-mt-20">Collision Resistance</h2>
    <p className="text-muted-foreground">SHA-256 provides 128 bits of collision resistance. No known practical collision attacks exist. Used by Bitcoin, TLS, and government systems worldwide.</p>
  </GenericDoc>
);

export const KeyManagement = () => (
  <GenericDoc title="Key Management" description="Enterprise key management with AWS KMS." toc={[
    { id: "architecture", title: "Architecture", level: 2 },
    { id: "rotation", title: "Key Rotation", level: 2 },
  ]}>
    <h2 id="architecture" className="text-2xl font-bold mt-12 mb-4 scroll-mt-20">Architecture</h2>
    <p className="text-muted-foreground mb-4">ProofMind never stores or has access to your signing keys. All signing operations happen within AWS KMS, which provides FIPS 140-2 Level 3 certified hardware security modules.</p>
    <h2 id="rotation" className="text-2xl font-bold mt-12 mb-4 scroll-mt-20">Key Rotation</h2>
    <p className="text-muted-foreground">AWS KMS supports automatic annual key rotation. Previous key versions are retained for verification of historical records.</p>
  </GenericDoc>
);

export const ThreatModel = () => (
  <GenericDoc title="Threat Model" description="Security threat analysis for the ProofMind system." toc={[
    { id: "threats", title: "Threat Scenarios", level: 2 },
    { id: "mitigations", title: "Mitigations", level: 2 },
  ]}>
    <h2 id="threats" className="text-2xl font-bold mt-12 mb-4 scroll-mt-20">Threat Scenarios</h2>
    <div className="space-y-3">
      {[
        { threat: "Enterprise modifies records", mitigation: "Records on Hedera are immutable — cannot be altered" },
        { threat: "ProofMind compromised", mitigation: "Only hashes stored; enterprise KMS keys not accessible" },
        { threat: "Replay attacks", mitigation: "Hedera consensus timestamps prevent replay" },
        { threat: "Key compromise", mitigation: "AWS KMS + CloudTrail detect unauthorized signing" },
      ].map((t) => (
        <div key={t.threat} className="p-3 rounded-lg bg-secondary/50 border border-border">
          <span className="font-semibold text-sm text-destructive">{t.threat}</span>
          <p className="text-sm text-muted-foreground mt-1">→ {t.mitigation}</p>
        </div>
      ))}
    </div>
    <h2 id="mitigations" className="text-2xl font-bold mt-12 mb-4 scroll-mt-20">Defense in Depth</h2>
    <p className="text-muted-foreground">ProofMind's security model is based on defense in depth: cryptographic hashing, enterprise KMS signing, immutable ledger anchoring, and continuous monitoring via the Audit Agent.</p>
  </GenericDoc>
);
