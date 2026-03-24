-- ProofMind Database Schema

CREATE TABLE enterprises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enterprise_id TEXT UNIQUE NOT NULL,
  company_name TEXT NOT NULL,
  jurisdictions TEXT[],
  compliance_frameworks TEXT[],
  hcs_topic_id TEXT UNIQUE NOT NULL,
  kms_key_arn TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  onboarded_at TIMESTAMPTZ DEFAULT NOW()
);

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
  status TEXT DEFAULT 'pending',
  hcs_sequence BIGINT,
  mlops_signature TEXT,
  compliance_signature TEXT,
  deployed_at TIMESTAMPTZ,
  deprecated_at TIMESTAMPTZ,
  UNIQUE(enterprise_id, model_id, version)
);

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

CREATE INDEX ON notarizations (enterprise_id, decision_context, submitted_at);
CREATE INDEX ON notarizations (enterprise_id, model_id, submitted_at);

CREATE TABLE anomalies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enterprise_id TEXT REFERENCES enterprises(enterprise_id),
  anomaly_class TEXT NOT NULL,
  notarization_id TEXT,
  severity TEXT NOT NULL,
  detail JSONB,
  status TEXT DEFAULT 'active',
  hcs_sequence BIGINT,
  detected_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

CREATE TABLE compliance_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enterprise_id TEXT REFERENCES enterprises(enterprise_id),
  report_type TEXT NOT NULL,
  period_from TIMESTAMPTZ NOT NULL,
  period_to TIMESTAMPTZ NOT NULL,
  total_decisions INTEGER,
  anomaly_count INTEGER,
  models_used TEXT[],
  human_oversight_rate DECIMAL,
  compliance_frameworks TEXT[],
  hcs_sequence BIGINT,
  kms_signature TEXT,
  generated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  verification_id TEXT UNIQUE NOT NULL,
  notarization_id TEXT REFERENCES notarizations(notarization_id),
  requested_by TEXT NOT NULL,
  result TEXT NOT NULL,
  checks_json JSONB,
  hcs_verification_sequence BIGINT,
  verified_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE human_oversight_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notarization_id TEXT REFERENCES notarizations(notarization_id),
  enterprise_id TEXT REFERENCES enterprises(enterprise_id),
  review_outcome TEXT,
  reviewer_role_hash TEXT,
  reviewed_at TIMESTAMPTZ DEFAULT NOW(),
  hcs_sequence BIGINT
);

CREATE TABLE decision_reversals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notarization_id TEXT REFERENCES notarizations(notarization_id),
  enterprise_id TEXT REFERENCES enterprises(enterprise_id),
  reversal_reason TEXT,
  reversed_by_role_hash TEXT,
  original_outcome TEXT,
  new_outcome TEXT,
  reversed_at TIMESTAMPTZ DEFAULT NOW(),
  hcs_sequence BIGINT
);
