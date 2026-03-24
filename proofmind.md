PROOFMIND
Immutable Audit Infrastructure for Enterprise AI
Full Technical Architecture — Production Developer Reference

Technology Stack
Blockchain: Hedera Hashgraph — HCS · HTS · Scheduled Transactions · EVM Smart Contracts
Key Management: AWS KMS — Enterprise signing · CloudTrail regulatory audit
Agent Layer: HOL Registry — Audit Agent per enterprise, autonomous monitoring
SDK: Python & Node.js — ProofMind SDK, one function call wraps any AI inference
Frontend: React-Vite · TypeScript · Tailwind CSS — Enterprise dashboard + Regulator portal
Backend: Supabase — PostgreSQL · Realtime · Edge Functions
Track: Open Track | Bounty: AWS ($8,000)

Version 1.0 | March 2026

 

1. Product Vision & Core Problem
   The EU AI Act is in force. The SEC requires algorithmic decision audit trails for financial firms. The FDA is scrutinizing AI in medical devices. Insurance regulators demand explainability for automated claims decisions. Healthcare systems are deploying AI in diagnostics. Banks are using models for credit and fraud. Enterprise AI is everywhere — and there is no neutral, independently verifiable record of what it actually did.

The current answer is: internal logs. A database maintained by the same organization that made the AI decision. A bank denied your loan via an AI — the regulator asks "prove the model version, prove the input, prove the output" — and the bank produces its own logs, from its own systems, which it can modify at will. Regulators know this. They accept it because there is no alternative.

ProofMind is the alternative. It is an AI decision notarization protocol: a lightweight SDK that enterprises embed in their AI pipelines. Every significant inference gets its cryptographic fingerprint anchored to Hedera HCS in real time. The enterprise keeps all data. Hedera keeps the proof it happened, when, with which model, and what it decided. That proof cannot be altered afterward — not by the enterprise, not by ProofMind, not by anyone.

The central insight: the most valuable thing a distributed ledger can do for AI is not run AI — it is remember what AI did, in a way nobody can change afterward.

1.1 What ProofMind Is Not
What Why Not
Not an AI training platform ProofMind never sees model weights, training data, or inference infrastructure. It only receives cryptographic hashes at inference time.
Not a data processor No personal data, no input content, no output content ever leaves the enterprise. Only SHA-256 hashes are submitted to ProofMind and HCS. GDPR-safe by design.
Not a compliance reporting tool Existing tools generate static reports. ProofMind creates a live, tamper-proof record that regulators query directly — replacing the report with a source of truth.
Not blockchain-native AI The AI runs on the enterprise's own infrastructure. ProofMind adds a witness layer — it does not move the AI or change how it works.

1.2 Regulatory Drivers (Why Now)
Regulation Requirement How ProofMind Addresses It
EU AI Act (2024) High-risk AI systems must maintain logs for 5 years. Bias monitoring, human oversight, and transparency requirements. Fines: up to €30M or 6% of global turnover. ProofMind creates the immutable logs the Act requires, with cryptographic integrity no internal system can provide.
SEC AI Guidance (2023–) Algorithmic decisions in financial services must be auditable. Investment advisers using AI face scrutiny on model governance. ProofMind provides the model version registry and decision trail SEC examiners request.
FDA AI/ML-Based SaMD Software as a Medical Device using AI must have predefined change control plans and locked model references. ProofMind's Model Registry enforces locked model deployment. Unauthorized model swaps are flagged immediately.
UK FCA AI Governance FCA requires explainable decisions in consumer credit. Senior managers accountable for AI outcomes. ProofMind's dual audit trail (CloudTrail + HCS) provides the explainability evidence FCA expects.
HIPAA + ONC (US Healthcare) AI-assisted clinical decisions must be documented and auditable under evolving CMS guidance. ProofMind notarizes the AI recommendation without exposing PHI — hash-only submission preserves HIPAA compliance.

2. Full System Architecture
   2.1 Layer Map
   Layer Detail
   Enterprise AI Pipeline The customer's existing AI infrastructure (AWS SageMaker, Azure ML, self-hosted). ProofMind SDK wraps AI inference calls. Nothing else changes about the pipeline.
   ProofMind SDK Python and Node.js libraries. Wraps AI inference with a single decorator / function call. Computes input/output hashes, signs via KMS, submits to HCS, returns inference result + notarization receipt. Adds < 50ms latency.
   AWS Layer KMS: enterprise signing key lifecycle. CloudTrail: every signing event logged. Cognito: enterprise SSO for ProofMind dashboard. Lambda: signing service. S3: optional long-form compliance report storage.
   Hedera Services HCS (raw): all notarization records, model registry entries, compliance reports, anomaly flags. HCS-10: Audit Agent messaging — regulator queries and responses. HTS: no token issuance, but used for Audit Agent staking. Scheduled Transactions: periodic compliance report generation.
   Agent Layer HOL Registry — one Audit Agent per enterprise. Monitors HCS stream for the enterprise's notarizations. Answers NL queries. Detects anomalies. Generates scheduled reports.
   ProofMind Backend Supabase PostgreSQL: enterprise metadata, model registry, anomaly log, report history. Supabase Realtime: live dashboard updates. Edge Functions: HCS sync, anomaly alerting, report scheduling.
   Portals (1) Enterprise Dashboard — policy setup, model registry, live compliance metrics. (2) Regulator Portal — direct read-only HCS query interface, no enterprise employee mediating. (3) SDK Developer Console — API key management, integration testing.

2.2 Data Flow Principles
WHAT LEAVES THE ENTERPRISE:
SHA-256(input_data) — a 64-character hex string. Cannot be reversed to the original input.
SHA-256(output_data) — same. Output content stays on enterprise infrastructure.
model_id + version_hash — model identifier and cryptographic fingerprint. Not model weights.
decision_context — plain text category: "loan_approval", "fraud_flag", "diagnosis_assist".
timestamp — SDK-generated, confirmed by Hedera consensus timestamp.
enterprise_id — identifies which enterprise's notarization this is.

WHAT NEVER LEAVES THE ENTERPRISE:
The original input (customer PII, medical records, financial data)
The original output (model predictions, scores, recommendations)
Model weights or architecture details
Any business logic or internal workflow data

WHAT HEDERA STORES (PERMANENTLY):
The notarization record — a hash bundle that proves this inference happened at this time.
This record cannot retroactively prove what the data WAS — only that it existed and matched.
Verification requires the enterprise to produce the original — ProofMind confirms it matches the anchor.

3. ProofMind SDK — Full Specification
   The SDK is the integration surface for enterprise developers. Its design requirements: (1) zero friction — wraps existing AI calls without restructuring pipelines, (2) zero data exposure — hashing is done client-side before any network call, (3) zero blocking — notarization is async by default, inference result returns immediately, HCS submission happens in background, (4) SDK failure does not block inference — if HCS submission fails, the inference result is still returned and the failure is queued for retry.

3.1 Python SDK — Full Interface
from proofmind import ProofMind, NotarizationConfig

# Initialize once at application startup

pm = ProofMind(
enterprise_id="ent_acme_financial",
kms_key_arn="arn:aws:kms:us-east-1:123456:key/abc-def",
hcs_topic_id="0.0.12345",
mode="async", # async | sync | shadow
pii_fields=["ssn", "email", "dob"], # auto-excluded from hash
)

# Usage 1: Decorator (wraps model.predict automatically)

@pm.notarize(
model_id="credit_risk_v4.2",
context="loan_application_decision",
sensitivity="high", # high | medium | low — determines dual-hash behavior
pii_scrub=True
)
def credit_decision(applicant_data: dict) -> dict:
return ai_model.predict(applicant_data)

# Usage 2: Context manager (explicit control)

with pm.notarize(model_id="fraud_detector_v2.1", context="transaction_screening") as notarizer:
result = fraud_model.predict(transaction)
notarizer.add_metadata({"risk_tier": result["tier"], "rule_triggered": result["rule"]}) # metadata is hashed — content not stored by ProofMind

# Usage 3: Manual (for complex pipelines)

receipt = pm.notarize_manual(
model_id="diagnosis_assist_v1.0",
input_hash=pm.hash(patient_data),
output_hash=pm.hash(ai_recommendation),
context="clinical_decision_support",
outcome_label="high_risk_flagged"
)

# receipt.notarization_id — unique ID for this notarization

# receipt.hcs_sequence — HCS sequence number (available after async completion)

# receipt.signed_at — KMS signing timestamp

# receipt.kms_event_id — CloudTrail event reference

3.2 Node.js SDK — Full Interface
const { ProofMind } = require('@proofmind/sdk');

const pm = new ProofMind({
enterpriseId: 'ent_acme_financial',
kmsKeyArn: 'arn:aws:kms:us-east-1:123456:key/abc-def',
hcsTopicId: '0.0.12345',
mode: 'async',
piiFields: ['userId', 'email', 'ipAddress'],
});

// Wrap any async function
const notarizedDecision = pm.wrap(contentModerationModel.classify, {
modelId: 'content_moderation_v3.0',
context: 'content_moderation',
sensitivity: 'medium',
});

const result = await notarizedDecision(userContent);
// result.decision — original model output
// result.notarizationId — unique ProofMind receipt ID
// result.hcsSequence — available after async HCS submission

// Batch notarization (for offline/bulk inference)
const batchReceipts = await pm.notarizeBatch([
{ modelId: 'loan_v4', inputHash: hash1, outputHash: out1, context: 'loan' },
{ modelId: 'loan_v4', inputHash: hash2, outputHash: out2, context: 'loan' },
], { batchSize: 50 }); // Submits up to 50 HCS messages per Hedera transaction

3.3 Notarization Record Schema (Anchored to HCS)
{
"schemaVersion": "2.0",
"notarizationId": "pm_7f3a9b2c1d4e5f6a",
"enterpriseId": "ent_acme_financial",
"modelId": "credit_risk_v4.2",
"modelRegistryRef": 12045, // HCS sequence of model registration
"inputHash": "sha256:3a7f9b...",
"outputHash": "sha256:8c2e1d...",
"inputSchema": "applicant_profile_v2", // Schema ID only — no data
"decisionContext": "loan_application_decision",
"sensitivityLevel": "high",
"outcomeLabel": "approved", // Categorical outcome — no score exposed
"kmsKeyArn": "arn:aws:kms:us-east-1:123456:key/abc-def",
"kmsSignature": "0x...",
"cloudTrailEventId": "arn:aws:cloudtrail:...",
"sdkVersion": "2.1.4",
"submittedAt": 1735689600,
"hederaConsensusTimestamp": "1735689600.456789012" // Nanosecond precision
}

3.4 PII Scrubbing Architecture
The SDK ships with a PII scrubber that operates before hashing. This is not optional for high-sensitivity decisions — it is enforced by the sensitivity level configuration. The scrubber removes or masks declared PII fields from the data object before computing the SHA-256 hash. This means the hash is of a PII-free version of the input.
Why this matters: if the hash included raw PII, a regulator who received both the hash and the original data could theoretically use the hash to confirm that a specific individual's data was processed — potentially a GDPR violation. By hashing PII-scrubbed data, ProofMind produces a proof of the decision logic without creating a linkable identifier.

# PII scrubbing happens client-side, before any network call

def hash_for_notarization(data: dict, pii_fields: list[str]) -> str:
scrubbed = {
k: "[REDACTED]" if k in pii_fields else v
for k, v in data.items()
} # Deterministic serialization: sorted keys, no whitespace
canonical = json.dumps(scrubbed, sort_keys=True, separators=(",",":"))
return "sha256:" + hashlib.sha256(canonical.encode()).hexdigest()

# The same scrubbing must be reproduced during verification.

# ProofMind stores the pii_fields list (not the data) as part of the receipt.

# Verifier uses the same list to reproduce the scrubbed hash.

4. Model Registry — Full Specification
   The Model Registry is what separates ProofMind from a simple logging library. Every notarized decision references a registered model. A notarization that references an unregistered model version is flagged immediately by the Audit Agent. This eliminates shadow AI deployments — the single most common enterprise AI governance failure.

4.1 What "Registering a Model" Means
Registering a model does not involve sending model weights to ProofMind. It means creating a cryptographically signed declaration: "On this date, we deployed this model version, trained on this data fingerprint, for these authorized use cases." That declaration is anchored to HCS. If the enterprise later claims they were running a different model at a certain time, the HCS record contradicts them.

4.2 Model Registration Schema
{
"registryVersion": "2.0",
"modelId": "credit_risk_v4.2",
"modelName": "Acme Credit Risk Classifier",
"version": "4.2.1",
"frameworkHash": "sha256:...", // Hash of requirements.txt / conda env
"weightsHash": "sha256:...", // Hash of model artifact — proves specific weights
"trainingDataManifestHash": "sha256:...", // Hash of training dataset manifest (not data)
"authorizedContexts": [
"loan_application_decision",
"credit_limit_review"
],
"authorizedSensitivityLevels": ["high", "medium"],
"jurisdictions": ["EU", "US-NY", "US-CA"],
"complianceFrameworks": ["EU_AI_ACT_HIGH_RISK", "FCRA"],
"humanOversightRequired": true,
"humanOversightThreshold": {
"condition": "outcome_label == denied AND confidence < 0.75",
"action": "route_to_human_review"
},
"deployedAt": 1735689600,
"deprecatedAt": null,
"kmsSignature": "0x...",
"registeredBy": "arn:aws:sts::123456:assumed-role/MLOpsRole/sarah.chen"
}

4.3 Model Lifecycle States
State Meaning
PENDING Registration submitted, awaiting KMS signature from authorized role (MLOps lead + Compliance Officer dual-sign required for high-risk models)
ACTIVE Model approved for production. Notarizations referencing this model_id+version are accepted.
DEPRECATED Model retired. No new notarizations accepted referencing this version. Historical records preserved.
REVOKED Model withdrawn due to discovered issue. All notarizations referencing this version are flagged automatically. Alert sent to compliance team.
SHADOW Model in A/B test. Notarizations flagged as shadow — not for regulatory submission. Allows testing without creating compliance trail.

4.4 Unauthorized Model Detection Flow

1. Enterprise deploys a new model version without registering it in ProofMind first
2. SDK submits notarization with model_id="credit_risk_v4.3" (unregistered)
3. Audit Agent receives HCS message. Queries Model Registry: v4.3 not found.
4. Agent immediately publishes HCS alert: UNREGISTERED_MODEL_DETECTED { enterpriseId, modelId, notarizationId, timestamp }
5. Enterprise Dashboard: red alert — "Unregistered model v4.3 detected in production"
6. Compliance Officer receives email + Slack alert via Supabase Edge Function → SES
7. All notarizations from this unregistered model are quarantined: stored but flagged. Not counted in compliance reports.
8. Enterprise must either: (a) register the model retroactively with explanation, or (b) halt the deployment
9. If unregistered model activity continues > 24 hours: escalation to enterprise's designated regulatory contact

10. Enterprise Onboarding Flow
    Enterprise onboarding is the most security-sensitive phase in ProofMind. The KMS key setup, the HCS topic creation, and the initial Model Registry entries all happen during onboarding. Errors here propagate through every notarization the enterprise makes.

5.1 Onboarding Steps 10. Enterprise admin accesses ProofMind dashboard via AWS Cognito SSO (federated with enterprise IdP: Okta, Azure AD, Google Workspace) 11. Organization profile created: legal entity name, jurisdiction(s), regulatory frameworks applicable (EU AI Act, SEC, FDA, FCA — can multi-select), primary contact for regulatory escalations 12. User roles configured: Admin, MLOps Engineer (model registry), Compliance Officer (report access), Auditor (read-only), Regulator (read-only, scoped to their jurisdiction) 13. KMS key provisioned: ProofMind calls KMS.CreateKey() with ECC_SECG_P256K1 spec. Key policy: MLOps role (can sign notarizations), Compliance Officer role (can sign model registrations), ProofMind Lambda (can sign on behalf of enterprise for automated reports) 14. HCS topic created: one topic per enterprise (wastedao pattern). Topic ID stored in Supabase. Enterprise notarizations all go to this topic. 15. Audit Agent instantiated in HOL Registry: configured with enterprise topic ID, model registry, anomaly detection thresholds 16. SDK credentials issued: enterprise_id + api_key (for SDK auth to ProofMind backend). KMS key ARN provided separately — SDK uses it directly via AWS SDK, not via ProofMind servers 17. First model registered: enterprise registers at least one model before any notarizations are accepted 18. Integration test: enterprise runs SDK in "shadow" mode — notarizations submitted but not counted in compliance metrics. Verifies end-to-end flow without creating regulatory record. 19. Go-live: enterprise switches SDK mode from "shadow" to "async". First live notarization anchored to HCS.

5.2 Multi-Environment Configuration
Enterprise AI systems have development, staging, and production environments. ProofMind supports environment isolation:
Environment Behavior
Development Separate HCS topic (dev). Notarizations not counted in compliance reports. KMS key can be dev/test key (lower cost). Full feature parity for testing.
Staging Separate HCS topic (staging). Notarizations archived but clearly tagged STAGING. Used for pre-production compliance rehearsal.
Production Primary HCS topic. All notarizations count toward regulatory compliance. Full KMS signing with HSM-backed key. CloudTrail fully active.

6. Audit Agent — Full Specification
   The Audit Agent is a HOL Registry autonomous agent, one per enterprise. It is the interface between the immutable HCS record and every party who needs to query or act on it: compliance officers, regulators, enterprise security teams. The agent is stateless between restarts — all durable state is in Supabase and HCS.

6.1 Agent Responsibilities
Function Detail
Continuous HCS Monitoring Subscribes to enterprise's HCS topic via Mirror Node WebSocket. Every notarization message processed within 5 seconds of submission. Model registry validated per message. Anomaly checks run per message.
Real-Time Anomaly Detection 7 anomaly classes detected in real time (see §6.3). Anomalies trigger HCS flag + dashboard alert + email/Slack notification.
NL Query Interface (HCS-10) Regulators and compliance officers query the agent in natural language via HCS-10. Agent uses Claude API to interpret query, retrieves relevant HCS + Supabase data, returns structured response. Query + response anchored to HCS — the agent's answers are also on-chain.
Scheduled Compliance Reports Generates periodic compliance reports (daily/weekly/monthly/quarterly — configurable). Reports include: decision volumes, model version distribution, anomaly summary, jurisdiction breakdown. Reports anchored to HCS as REPORT events. Signed via KMS.
Model Version Drift Detection Tracks which model version is handling what proportion of decisions. Alerts if an older/deprecated version suddenly receives traffic (unexpected rollback).
Human Oversight Compliance For models with humanOversightRequired=true: tracks decisions that met the threshold condition. Alerts if required human review rate falls below expected. Generates human oversight compliance metric.
Regulator Access Management Regulators granted read-only access scope to specific contexts or timeframes. Agent enforces scope — a financial regulator cannot query medical decisions from the same enterprise.

6.2 Natural Language Query System (HCS-10)
Regulators submit queries via HCS-10 message to the enterprise's Audit Agent topic. The agent interprets the query, retrieves data, and responds — all on-chain. This eliminates the enterprise from the compliance verification loop entirely.
// Regulator submits HCS-10 query (plain text):
"How many loan decisions did model credit_risk_v4.2 make in Q1 2025 in EU jurisdictions?"

// Audit Agent receives message via HCS-10 subscription
// Agent calls Claude API to parse intent:
{
"intent": "decision_count_query",
"filters": {
"modelId": "credit_risk_v4.2",
"context": "loan_application_decision",
"jurisdiction": "EU",
"timeRange": { "from": "2025-01-01", "to": "2025-03-31" }
}
}

// Agent queries Supabase notarizations table with filters
// Produces response:
{
"queryId": "q_7f3a",
"answer": "Model credit_risk_v4.2 made 14,872 loan application decisions in EU",
"breakdown": { "approved": 9104, "denied": 5768 },
"hcsSequenceRange": [12045, 26917], // Verifiable range
"anomaliesInPeriod": 0,
"humanOversightCompliance": "98.3%", // Of denials requiring human review
"generatedAt": 1735689600,
"agentSignature": "0x..."
}

// Agent response anchored to HCS — the answer itself is on-chain.
// Regulator can independently verify by querying HCS directly.

6.3 Anomaly Detection Library
Anomaly Class Trigger Response
UNREGISTERED_MODEL Notarization references model_id not in registry Immediate. Alert + quarantine all notarizations from this model.
REVOKED_MODEL_ACTIVE Notarization references a REVOKED model version Immediate. Block further notarizations. Compliance Officer + regulatory escalation.
VOLUME_SPIKE Decision volume > 3× 30-day rolling average in any 1-hour window Real-time. Could indicate runaway batch job or unauthorized bulk processing.
CONTEXT_MISMATCH Model used for context not in authorizedContexts list Immediate. A fraud model used for "medical_recommendation" = compliance violation.
OUTCOME_DISTRIBUTION_SHIFT Approval/denial ratio shifts > 25% from 30-day baseline in any 24-hour window Daily. Signals model drift, data distribution change, or potential bias incident.
JURISDICTION_VIOLATION Model with EU jurisdiction restriction notarizing in US context (or vice versa) Real-time. Cross-border AI compliance violation.
HUMAN_OVERSIGHT_GAP Model requiring human review: review rate drops below configured threshold Daily. Reports gap as % of required reviews not completed.
SDK_VERSION_MISMATCH Notarization submitted by an outdated SDK version that has known security issues Real-time. Advisory alert — does not block notarization.
BATCH_WITHOUT_CONSENT Bulk notarization job detected without batch_job_id declared at SDK init (suggests unplanned bulk processing) Real-time. Logged for review.

7. Verification System
   Verification is the capability that makes the entire system meaningful. Without a verification mechanism that any authorized party can invoke independently, the HCS record is just data — not proof. The verification system transforms it into proof.

7.1 Verification Flow 20. Verifier (regulator, auditor, affected individual) accesses ProofMind Verification Portal or API 21. Selects verification type: single decision or batch 22. For single decision: submits notarization_id + original input data + original output data 23. ProofMind applies the same PII scrubbing configuration that was active at notarization time (retrieved from Supabase receipt) 24. SDK computes hash of scrubbed input and scrubbed output using identical canonical serialization 25. Queries HCS Mirror Node for the notarization record at the stored sequence number 26. Compares: computed input_hash vs anchored input_hash. Computed output_hash vs anchored output_hash. Model ID vs anchored model_id. Timestamp vs expected range. 27. Result returned: VERIFIED (all hashes match) or TAMPERED (any hash mismatch) or NOT_FOUND (notarization_id not on HCS) 28. Verification event itself anchored to HCS: permanent record that this verification was performed, by whom (verifier JWT), on what, and what the result was

7.2 Verification Result Schema
{
"verificationId": "vrf_9a2b3c",
"notarizationId": "pm_7f3a9b2c1d4e5f6a",
"requestedBy": "eu-ai-act-regulator@example.gov",
"result": "VERIFIED",
"checks": {
"inputHash": { "expected": "sha256:3a7f9b...", "computed": "sha256:3a7f9b...", "match": true },
"outputHash": { "expected": "sha256:8c2e1d...", "computed": "sha256:8c2e1d...", "match": true },
"modelId": { "expected": "credit_risk_v4.2", "onChain": "credit_risk_v4.2", "match": true },
"modelStatus": { "statusAtDecisionTime": "ACTIVE", "currentStatus": "DEPRECATED" },
"timestamp": { "anchored": "2025-03-01T14:32:01.456789012Z", "withinExpectedRange": true }
},
"hcsSequence": 22817,
"modelRegistrySequence": 12045,
"verifiedAt": 1740000000,
"verificationHcsSequence": 33102 // The verification event itself is on-chain
}

// TAMPERED example:
"result": "TAMPERED",
"checks": {
"outputHash": { "expected": "sha256:8c2e1d...", "computed": "sha256:7f1a9e...", "match": false }
},
"tампeredFields": ["output"] // System identifies WHAT was changed

7.3 Batch Verification
Regulators examining a period of AI decisions do not verify one at a time. The batch verification API accepts a CSV of notarization*ids and original input/output data. ProofMind processes the batch and returns a verification summary with individual results and aggregate statistics — all anchored as a single BATCH_VERIFICATION HCS event.
// Batch verification API
POST /api/v2/verify/batch
{
"verifierId": "eu_ai_act_authority",
"enterpriseId": "ent_acme_financial",
"scope": {
"context": "loan_application_decision",
"from": "2025-01-01T00:00:00Z",
"to": "2025-03-31T23:59:59Z"
},
"records": [
{ "notarizationId": "pm*...", "inputData": {...}, "outputData": {...} },
...
]
}

// Response:
{
"batchId": "batch_2025Q1_loan",
"totalRecords": 14872,
"verified": 14872,
"tampered": 0,
"notFound": 0,
"summary": {
"approvedAndVerified": 9104,
"deniedAndVerified": 5768,
"anomaliesInPeriod": 0,
"modelsUsed": ["credit_risk_v4.2"],
"allModelsRegistered": true,
"humanOversightComplianceRate": "98.3%"
},
"batchVerificationHcsSequence": 45821
}

8. Regulatory Framework Compliance Profiles
   Different regulations require different data to be auditable. ProofMind uses compliance profiles — pre-configured settings that ensure the right data is captured and retained for each regulatory context. Profiles are assigned at model registration and enforced by the SDK.

8.1 EU AI Act — High Risk Profile
Requirement ProofMind Implementation
Retention Period 10 years (EU AI Act Article 12 requirement). HCS is permanent — no action needed.
Human Oversight Logging Every decision that met the human oversight threshold is logged with: did a human review occur, what was the outcome, who reviewed (role hash, not name). Stored in Supabase, hashed to HCS.
Bias Monitoring Audit Agent tracks outcome_label distribution by no more than outcome categories — not by demographic data. Flags shifts > 10% from baseline as potential bias incidents.
Technical Documentation Model Registry fields required: training data manifest hash, accuracy/fairness metrics hash, intended purpose, known limitations (plain text — hashed). All anchored at registration.
Post-Market Monitoring Audit Agent generates monthly EU AI Act compliance report automatically. Report includes serious incident log (if any anomaly was classified as serious). Report anchored to HCS.

8.2 SEC / Financial Services Profile
Requirement ProofMind Implementation
Model Version Governance Every model version change requires compliance officer sign-off before going active (KMS dual-sign: MLOps + Compliance). Change log anchored to HCS.
Decision Reversal Audit If an AI-assisted decision is later manually reversed: reversal event logged to HCS with notarization_id reference. Enables regulators to examine reversal rate per model version.
Data Lineage Training data manifest hash at registration. If training data changes: new model registration required. No silent dataset changes.
Explainability Stub For denials: explainability metadata field captures primary decision factors (hashed). Enables regulator to request explanation with confidence it has not been post-hoc fabricated.

8.3 HIPAA / Healthcare Profile
Requirement ProofMind Implementation
PHI Isolation PII scrub enforced at sensitivity="high". All patient identifiers removed before hash computation. Hash of scrubbed data only. ProofMind cannot reconstruct PHI from its records.
Provider Attribution Healthcare decisions log provider_type hash (not provider ID) and facility_type. Sufficient for FDA audit without identifying specific providers.
Device Classification For FDA-regulated Software as a Medical Device: model registration includes device class, predicate device reference, 510(k) or PMA reference number (plain text — hashed). Anchored at registration.
Intended Use Enforcement authorizedContexts enforced strictly. A diagnostic model cannot notarize under "treatment_recommendation" without separate registration.

9. AWS KMS Integration
   Every significant action in ProofMind is signed by the enterprise's KMS key before being anchored to HCS. This creates two independent audit trails that together form a legally defensible chain of custody: CloudTrail proves who sent the notarization, HCS proves the notarization cannot be altered.

9.1 KMS Use Cases in ProofMind
Use Case Detail
Notarization Signing Every HCS notarization submission signed by enterprise KMS key. Proves the submission came from the enterprise's authorized pipeline. No engineer can sign manually — only the SDK Lambda function has Sign permission.
Model Registration Signing Model registration requires dual KMS signature: MLOps role + Compliance Officer role. Enforced by contract — single-signer model registrations rejected. Prevents unauthorized model deployments.
Compliance Report Signing Scheduled compliance reports signed by enterprise KMS key before anchoring to HCS. Report cannot be retroactively altered after signing.
Verification Event Signing When a regulator requests verification: ProofMind signs the verification event on behalf of the enterprise (using delegated Lambda role). Creates on-chain record that this verification was performed.
Anomaly Alert Signing Anomaly flags published to HCS are signed by the Audit Agent's Lambda role. Proves ProofMind flagged the issue — enterprise cannot claim they were not notified.

9.2 CloudTrail Coverage
Event Detail
kms:Sign — Notarization Every inference notarization. Key ARN, IAM role (SDK Lambda), timestamp. Volume: one per AI decision.
kms:Sign — Model Registration Every model registration. Two events: MLOps sign + Compliance sign. Correlates to HCS model registry record.
kms:Sign — Compliance Report Periodic report generation. IAM role (Audit Agent Lambda), timestamp. Correlates to HCS report record.
kms:CreateKey Enterprise onboarding. New key created. Key spec, creator ARN, creation timestamp.
kms:ScheduleKeyDeletion Enterprise offboarding or key rotation. Auditable end-of-life event.
sts:AssumeRole Every SDK Lambda invocation. Which role assumed, when, from which service.
cognito:InitiateAuth Every enterprise employee login to ProofMind dashboard.

9.3 KMS Dual-Sign for Model Registration
// Model registration requires two KMS signing steps in sequence

// Step 1: MLOps engineer submits model registration form
const modelRegistrationPayload = {
modelId: "credit_risk_v4.3",
weightsHash: hash(modelArtifact),
...
};

// Step 2: MLOps signs via their KMS key role
const mlopsSignature = await kms.sign({
KeyId: enterprise.mlopsKeyArn,
Message: canonicalize(modelRegistrationPayload),
SigningAlgorithm: "ECDSA_SHA_256"
}); // CloudTrail Event 1

// Step 3: Pending registration appears in Compliance Officer queue
// Step 4: Compliance Officer reviews and approves
const complianceSignature = await kms.sign({
KeyId: enterprise.complianceKeyArn,
Message: canonicalize({ ...modelRegistrationPayload, mlopsSignature }),
SigningAlgorithm: "ECDSA_SHA_256"
}); // CloudTrail Event 2

// Step 5: Both signatures included in HCS model registration record
// Two CloudTrail events + one HCS record = tamper-proof model approval chain

10. HCS Topic Architecture & Event Schema
    10.1 Topic Structure
    Topic Content
    proofmind.{enterpriseId}.decisions All notarization records for this enterprise. One message per AI inference. High volume — Mirror Node indexed.
    proofmind.{enterpriseId}.models Model registry: registrations, status changes, revocations. Low volume — critical records.
    proofmind.{enterpriseId}.anomalies Anomaly flags from Audit Agent. Compliance team subscribes. Low volume — high importance.
    proofmind.{enterpriseId}.reports Compliance reports from Audit Agent. Scheduled generation events.
    proofmind.{enterpriseId}.queries HCS-10 query/response between regulators and Audit Agent. Public — anyone can see regulator asked, only authorized parties can ask.
    proofmind.{enterpriseId}.verifications Verification events: who verified what, when, and what the result was.
    proofmind.global.registry Global enterprise registry: new enterprise onboarded, enterprise offboarded. Read by all Audit Agents.

10.2 Full HCS Event Registry
Event Trigger Key Fields
NOTARIZATION AI inference notarized notarizationId, modelId, modelRegistryRef, inputHash, outputHash, context, outcomeLabel, kmsRef, sdkVersion
MODEL_REGISTERED Model added to registry modelId, version, weightsHash, trainingDataHash, authorizedContexts[], complianceFrameworks[], mlopsSignature, complianceSignature
MODEL_STATUS_CHANGED Model deprecated/revoked modelId, oldStatus, newStatus, reason, changedBy, effectiveAt
ANOMALY_DETECTED Audit Agent flag anomalyClass, notarizationId (if applicable), detail, severity, agentSignature
ANOMALY_RESOLVED Enterprise resolved a flag anomalyId, resolution, resolvedBy, resolvedAt
COMPLIANCE_REPORT Scheduled report generated reportId, period, totalDecisions, anomalyCount, modelVersions[], humanOversightRate, kmsRef
REGULATOR_QUERY Query submitted via HCS-10 queryId, regulatorId, queryText, scope
AGENT_RESPONSE Audit Agent answers query queryId, responseJson, hcsSequenceRange, agentSignature
VERIFICATION_RESULT Verification completed verificationId, notarizationId, result, checks{}, verifiedBy
ENTERPRISE_ONBOARDED New enterprise registered enterpriseId, companyName, jurisdictions[], frameworks[]
MODEL_REGISTRY_AUDIT Periodic registry snapshot enterpriseId, activeModels[], pendingModels[], revokedModels[], reportedAt
HUMAN_OVERSIGHT_LOG Human review of AI decision notarizationId, reviewOutcome, reviewerRoleHash, reviewedAt
DECISION_REVERSAL AI decision manually overridden notarizationId, reversalReason, reversedBy (role hash), reversedAt

11. Real-Time Dashboards
    11.1 Enterprise Compliance Dashboard
    Widget Detail
    Live Decision Feed Real-time stream of notarizations: model ID, context, outcome label, timestamp. Configurable sampling rate for high-volume enterprises (show 1-in-100 on UI while storing all).
    Model Version Distribution Pie chart: what % of today's decisions came from each registered model version. Alerts if unexpected version appears.
    Anomaly Status Active anomalies: count by class, severity, time since first detection. Resolved anomalies: last 30 days.
    Compliance Posture Per regulatory framework: green/amber/red. Human oversight rate, model registration completeness, report submission status.
    Decision Volume Analytics Hourly/daily/weekly decision volume trends. Outcome distribution trends. Context breakdown.
    Audit Trail Explorer Search by notarization ID, model ID, context, date range. Each result shows HCS sequence for independent verification.
    Regulator Access Log Which regulators have queried the Audit Agent, when, and what they asked (query text is on-chain and visible to enterprise).

11.2 Regulator Portal
Feature Detail
Scoped Access Regulators see only the jurisdiction and context scope they are authorized for. An EU financial regulator cannot see a US healthcare enterprise's decisions.
Direct HCS Query Advanced query tool: query HCS Mirror Node directly for a specific notarization. No ProofMind systems involved — pure Hedera verification.
Audit Agent Interface Natural language query submission to enterprise's Audit Agent via HCS-10. Response returned in portal.
Compliance Report Archive All enterprise compliance reports anchored to HCS, accessible via portal. Sorted by period and enterprise.
Batch Verification Tool Upload CSV of notarization IDs and original data. Submit batch verification request. Download results.
Anomaly Report Enterprise's anomaly history: what was flagged, when, resolution status.

12. Edge Cases & Failure Modes

12.1 SDK Failure During High-Volume Inference
• If HCS submission fails (network, Hedera congestion): inference result still returns to the enterprise application — SDK failure is non-blocking
• Failed notarizations queued in a local retry buffer (Redis or SQLite depending on deployment). Retried with exponential backoff: 1s, 2s, 4s, 8s, up to 5 attempts
• If all retries fail: notarization written to local failure log + CloudWatch metric emitted. Compliance team alerted.
• Gap in notarization sequence: Audit Agent detects missing records. Enterprise dashboard shows: "Notarization gap detected: [N] decisions in time range [T1–T2] have no HCS record." This is itself an anomaly — logged and reported.

12.2 Model Weights Hash Mismatch
• At model registration: enterprise hashes model artifact and registers the hash
• Post-deployment: automated model integrity check — ProofMind SDK computes model hash at startup and compares to registry hash
• If mismatch detected: CRITICAL_MODEL_INTEGRITY_FAILURE anomaly. All notarizations from this deployment quarantined. Compliance + security team alerted immediately.
• Why this matters: prevents silent model corruption (infrastructure bug, adversarial attack) from going undetected in production

12.3 Key Rotation
• Enterprises rotate KMS keys periodically (annual rotation is best practice). Key rotation does not invalidate historical HCS records — they were signed by the old key, which is still valid for verification
• Key rotation creates a KEY_ROTATION event on HCS: old key ARN, new key ARN, rotation timestamp. This creates a continuous key provenance chain — regulators can verify which key signed which period of records
• SDK automatically picks up new key ARN after rotation if configured via Systems Manager Parameter Store (key ARN stored as SSM parameter, not hardcoded)

12.4 Enterprise Offboarding
• Enterprise discontinues ProofMind: HCS records are permanent — no ability to delete
• ProofMind marks enterprise as OFFBOARDED in global registry HCS record. Audit Agent retired.
• Historical records: still verifiable via Mirror Node directly. ProofMind is no longer needed as an intermediary — verification is always possible via raw HCS.
• Enterprise data in Supabase: retained for regulatory retention period, then archived to S3 Glacier.

12.5 Regulator Requests Original Data
• A regulator wants to verify a specific decision and needs the original input/output to compare against the hash
• ProofMind never has the original data — only hashes. The enterprise must produce it.
• Enterprise produces the original from their own data warehouse. Submits to ProofMind verification API (or directly to regulator who submits to ProofMind).
• If enterprise claims they "cannot find" the original data: this is a data governance failure on the enterprise's part — ProofMind's HCS record proves the decision existed. The burden to produce the original rests with the enterprise.

12.6 Adversarial Hash Collision Attack
• Theoretical: attacker constructs a different input that produces the same SHA-256 hash (collision)
• SHA-256 collision is computationally infeasible at current computing power: > 2^128 operations required
• Additionally: ProofMind uses canonical JSON serialization with sorted keys — reducing the attack surface vs arbitrary byte-level collision
• For highest-risk decisions (sensitivity="critical"): ProofMind supports dual-hash mode — SHA-256 + SHA-3-256. Both hashes must match for VERIFIED result. Collision on both simultaneously: infeasible.

12.7 Audit Agent Outage
• Audit Agent crashes or is temporarily unavailable: HCS notarizations still submit — the SDK does not depend on the Agent
• On restart: Agent reconstructs state from HCS (last processed sequence stored in Supabase). Replays missed messages in order. Anomaly detection catches anything that should have been flagged.
• Maximum acceptable gap: 1 hour before anomaly detection confidence degrades. SLA target: 99.7% uptime.

13. Supabase Database Schema

enterprises
CREATE TABLE enterprises (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
enterprise_id TEXT UNIQUE NOT NULL, -- e.g. "ent_acme_financial"
company_name TEXT NOT NULL,
jurisdictions TEXT[],
compliance_frameworks TEXT[],
hcs_topic_id TEXT UNIQUE NOT NULL,
kms_key_arn TEXT NOT NULL,
kms_mlops_key_arn TEXT,
kms_compliance_key_arn TEXT,
cognito_tenant_id TEXT,
regulatory_contacts JSONB, -- {eu: "...", us: "..."}
status TEXT DEFAULT ('active'),
onboarded_at TIMESTAMPTZ DEFAULT NOW()
);

model_registry
CREATE TABLE model_registry (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
enterprise_id TEXT REFERENCES enterprises(enterprise_id),
model_id TEXT NOT NULL,
version TEXT NOT NULL,
weights_hash TEXT NOT NULL,
training_data_manifest_hash TEXT,
framework_hash TEXT,
authorized_contexts TEXT[],
authorized_sensitivity TEXT[],
jurisdictions TEXT[],
compliance_frameworks TEXT[],
human_oversight_required BOOLEAN DEFAULT FALSE,
human_oversight_threshold JSONB,
status TEXT DEFAULT ('pending'),
hcs_sequence BIGINT,
mlops_signature TEXT,
compliance_signature TEXT,
deployed_at TIMESTAMPTZ,
deprecated_at TIMESTAMPTZ,
UNIQUE(enterprise_id, model_id, version)
);

notarizations
CREATE TABLE notarizations (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
notarization_id TEXT UNIQUE NOT NULL,
enterprise_id TEXT REFERENCES enterprises(enterprise_id),
model_id TEXT NOT NULL,
model_registry_id UUID REFERENCES model_registry(id),
input_hash TEXT NOT NULL,
output_hash TEXT NOT NULL,
input_schema TEXT,
decision_context TEXT NOT NULL,
sensitivity_level TEXT NOT NULL,
outcome_label TEXT,
kms_key_arn TEXT,
cloud_trail_event_id TEXT,
sdk_version TEXT,
hcs_sequence BIGINT,
consensus_timestamp TEXT,
anomaly_flags TEXT[],
is_quarantined BOOLEAN DEFAULT FALSE,
submitted_at TIMESTAMPTZ NOT NULL
);

-- Indexes for high-volume query performance
CREATE INDEX ON notarizations (enterprise_id, decision_context, submitted_at);
CREATE INDEX ON notarizations (enterprise_id, model_id, submitted_at);
CREATE INDEX ON notarizations (outcome_label, submitted_at);

anomalies + verifications + compliance_reports (abbreviated)
CREATE TABLE anomalies (
id, enterprise_id, anomaly_class, notarization_id,
severity, detail, status, hcs_sequence, detected_at, resolved_at
);

CREATE TABLE verifications (
id, verification_id, notarization_id, requested_by,
result, checks_json, hcs_verification_sequence, verified_at
);

CREATE TABLE compliance_reports (
id, enterprise_id, report_type, period_from, period_to,
total_decisions, anomaly_count, models_used[], human_oversight_rate,
compliance_frameworks[], hcs_sequence, kms_signature, generated_at
);

CREATE TABLE human_oversight_log (
id, notarization_id, enterprise_id, review_outcome,
reviewer_role_hash, reviewed_at, hcs_sequence
);

CREATE TABLE decision_reversals (
id, notarization_id, enterprise_id, reversal_reason,
reversed_by_role_hash, original_outcome, new_outcome, reversed_at, hcs_sequence
);

14. SDK Performance Architecture
    ProofMind's adoption depends entirely on the SDK being invisible in production. An SDK that adds 500ms to an AI inference will be disabled by engineering teams under pressure. The SDK is designed to add under 50ms to any inference, including HCS submission, in async mode.

14.1 Async Submission Architecture

# Async mode: inference result returns immediately

# HCS submission happens in background thread/coroutine

async def notarize_async(inference_fn, args, config): # Step 1: Hash inputs BEFORE calling model (so we know input hash if model crashes)
input_hash = hash_for_notarization(args, config.pii_fields)

    # Step 2: Run inference (this is the actual AI call)
    t_start = time.time()
    result = await inference_fn(*args)
    t_inference = time.time() - t_start

    # Step 3: Hash output
    output_hash = hash_for_notarization(result, config.output_pii_fields)

    # Step 4: Dispatch HCS submission to background queue — non-blocking
    submission_id = queue.dispatch(
        NotarizationJob(input_hash, output_hash, config, t_inference)
    )

    # Step 5: Return inference result immediately (+ receipt handle)
    return result, NotarizationReceipt(submission_id=submission_id)

    # Background worker picks up job, signs via KMS, submits to HCS
    # Receipt populated with hcs_sequence when confirmed (~3-5 seconds)

14.2 Batch Optimization
High-volume inference pipelines (e.g. overnight credit scoring runs) produce thousands of notarizations per second. Individual HCS submissions at this rate would be expensive and slow. ProofMind SDK supports batch mode:
• Batch accumulates up to 50 notarization records per HCS transaction (Hedera transaction size limit)
• Batch is committed on a time-based trigger (default: every 5 seconds) OR size trigger (50 records), whichever comes first
• Each batch transaction contains a Merkle tree of the individual notarization hashes. HCS message contains the Merkle root + list of notarization IDs.
• Individual notarization verification still possible: verifier requests the Merkle proof for their specific record. ProofMind reconstructs the proof from the batch.
• Batch mode reduces HCS costs by approximately 40× compared to individual submission

14.3 Latency Budget
Operation Latency
Input hashing (PII scrub + SHA-256) < 2ms for typical inputs (< 10KB). < 10ms for large structured inputs (< 1MB).
Output hashing < 5ms for typical model outputs.
Queue dispatch (async mode) < 1ms — local in-memory queue push.
KMS signing (background) 20–50ms — AWS KMS API latency.
HCS submission (background) 1–3 seconds — Hedera consensus time. Non-blocking.
Total added latency (async mode) < 10ms to the inference caller. HCS confirmation is background.
Total added latency (sync mode) 2–5 seconds. For low-volume critical decisions only (medical, financial denials).

15. Protocol Economics
    15.1 Pricing Model
    Revenue Source Mechanism
    Notarization Fee $0.001 per notarization. For an enterprise running 1 million AI decisions per month: $1,000/month. Sub-cent per decision — invisible as a line item.
    Model Registration Fee $50 per model version registered. Covers KMS dual-sign processing and HCS anchoring.
    Compliance Report Fee $25 per quarterly report. $100 per annual report. Monthly: $10.
    Batch Verification Fee $0.0001 per record verified in batch. 14,872 record batch: $1.49.
    Audit Agent Premium $500/month per enterprise: includes Audit Agent, anomaly detection, NL query API, regulator portal access. Core feature.
    Enterprise SLA Tiers Standard: 99.5% uptime. Professional: 99.9% + 4-hour incident response. Enterprise: 99.99% + dedicated infrastructure + regulatory white-glove support.

15.2 Unit Economics at Scale
Example: mid-size financial services firm
Monthly AI decisions: 500,000 (loan origination + fraud screening)
Models in use: 8 versions active
Monthly ProofMind cost:
Notarizations: 500,000 × $0.001 = $500
Audit Agent: $500
Monthly report: $10
Total: ~$1,010/month = $12,120/year

Comparable alternatives:
Manual audit trail compliance program: $200,000–$500,000/year in staff + tooling
EU AI Act fine for inadequate audit trail: up to 6% of global revenue
Single regulatory examination response (internal legal + ops): $50,000–$150,000 per exam

ProofMind ROI: eliminates the examination response cost in month 1.

16. Security Architecture
    16.1 Threat Model
    Threat Risk Level Mitigation
    Enterprise tampers own records post-hoc HIGH HCS is immutable — tampering produces hash mismatch on verification. All records independently verifiable without ProofMind.
    Enterprise claims model X when using model Y HIGH Model registry + weights hash at registration. Unauthorized model triggers Audit Agent flag within seconds.
    ProofMind tampers enterprise records MEDIUM ProofMind only stores hashes. Cannot alter originals it never had. Enterprise can verify HCS records without ProofMind.
    Insider threatens to alter HCS records LOW Hedera HCS is immutable by protocol. No entity can modify submitted records — not ProofMind, not Hedera, not anyone.
    SDK compromised / supply chain attack MEDIUM SDK open source — community auditable. SDK hash published to HCS at each release. Enterprises verify SDK hash before deployment.
    KMS key stolen LOW Keys stored in AWS HSM — never exposed. No human access. Theft requires compromising AWS infrastructure.
    Replay attack (resubmit old notarization) LOW Nonce per notarization. HCS sequence is monotonically increasing — replay visible as duplicate sequence reference.

16.2 SDK Open Source Strategy
The SDK must be open source. An enterprise cannot trust a black-box SDK that processes their AI decisions. Open sourcing the SDK achieves three things: (1) community security audit — independent researchers review hashing and submission logic, (2) regulatory confidence — regulators can verify the SDK does what ProofMind claims, (3) enterprise trust — the SDK does exactly what the README says, verifiably.
ProofMind publishes a signed hash of each SDK release to HCS. Enterprises verify the SDK binary against this hash before deployment. Any tampered SDK version produces a hash mismatch — detected before installation.

17. Future Expansion

17.1 Technical Roadmap
• Zero-Knowledge Proofs: for the most sensitive decisions (healthcare, finance), replace hash submission with ZK proof — proves the model made a decision in a certain output range WITHOUT revealing the output hash. Enables regulators to verify "all denied loan decisions had a risk score above threshold" without seeing individual scores.
• On-Chain Model Execution for Micro-Models: for small, low-parameter decision models (e.g. simple credit scoring rules): execute model directly on Hedera EVM. Input, logic, and output all on-chain. Removes even the hash trust assumption.
• Federated Learning Audit: when models are trained across enterprise nodes without centralizing data: ProofMind notarizes each training round contribution — creates an immutable federated learning audit trail.
• Continuous Bias Monitoring: integrate fairness metrics library — compute disparate impact statistics at inference time, hash the fairness metrics alongside the decision. Regulators can verify bias audits without accessing demographic data.

17.2 Ecosystem Expansion
• AI Model Insurance: enterprises with clean ProofMind records (low anomaly rate, high human oversight compliance) qualify for reduced AI liability insurance premiums — insurers use ProofMind data as underwriting signal
• Cross-Enterprise Model Comparison: anonymized aggregate statistics — "for loan decisions, what is the industry-average approval rate for model context X?" — enables benchmarking without exposing individual enterprise data
• Regulator Direct Feed: ProofMind becomes the standard regulatory reporting channel for AI decisions — regulators subscribe to aggregated, anonymized feeds directly from HCS rather than requesting reports from individual firms
• Hedera Guardian Integration: use Guardian Policy Workflow to enforce evidence policy at inference time — certain decision contexts require certain evidence types to be present in the notarization before the inference is allowed to proceed

17.3 Hedera-Native
• ProofMind Governance Token (PROOF HTS): enterprises and regulators earn governance tokens for participation — vote on compliance profile updates, new anomaly detection classes, pricing changes
• Mirror Node Public Stats API: anonymized, aggregated global AI decision statistics queryable by anyone — industry-level transparency without individual enterprise exposure
• Smart Contract Policy Engine: replace configurable compliance profiles with fully on-chain policy contracts — compliance rules become code, not configuration, and are community-auditable

ProofMind — Full Technical Architecture v1.0
Built on Hedera Hashgraph · AWS KMS · Open Track · AWS Bounty
