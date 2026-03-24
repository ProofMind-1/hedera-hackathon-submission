import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

async function seed() {
  console.log('Seeding database...');

  // Create demo enterprise
  const { data: enterprise, error: enterpriseError } = await supabase
    .from('enterprises')
    .upsert({
      enterprise_id: 'ent_demo',
      company_name: 'Demo Financial Corp',
      jurisdictions: ['US', 'EU'],
      compliance_frameworks: ['EU_AI_ACT', 'SEC'],
      hcs_topic_id: '0.0.12345',
      kms_key_arn: 'arn:aws:kms:us-east-1:123456:key/demo',
      status: 'active',
    })
    .select()
    .single();

  if (enterpriseError) {
    console.error('Enterprise error:', enterpriseError);
  } else {
    console.log('✓ Enterprise created');
  }

  // Create demo models
  const models = [
    {
      enterprise_id: 'ent_demo',
      model_id: 'credit_risk_v4.2',
      version: '4.2.1',
      weights_hash: 'sha256:abc123...',
      authorized_contexts: ['loan_application', 'credit_review'],
      status: 'ACTIVE',
    },
    {
      enterprise_id: 'ent_demo',
      model_id: 'fraud_detector_v2.1',
      version: '2.1.0',
      weights_hash: 'sha256:def456...',
      authorized_contexts: ['transaction_screening'],
      status: 'ACTIVE',
    },
  ];

  for (const model of models) {
    const { error } = await supabase.from('model_registry').upsert(model);
    if (error) {
      console.error('Model error:', error);
    } else {
      console.log(`✓ Model ${model.model_id} created`);
    }
  }

  // Create demo notarizations
  const notarizations = Array.from({ length: 20 }, (_, i) => ({
    notarization_id: `pm_demo_${Date.now()}_${i}`,
    enterprise_id: 'ent_demo',
    model_id: i % 2 === 0 ? 'credit_risk_v4.2' : 'fraud_detector_v2.1',
    input_hash: `sha256:input_${i}`,
    output_hash: `sha256:output_${i}`,
    decision_context: i % 2 === 0 ? 'loan_application' : 'transaction_screening',
    sensitivity_level: 'high',
    outcome_label: i % 3 === 0 ? 'approved' : 'denied',
    hcs_sequence: BigInt(1000 + i),
    submitted_at: new Date(Date.now() - i * 3600000).toISOString(),
  }));

  for (const notarization of notarizations) {
    const { error } = await supabase.from('notarizations').upsert(notarization);
    if (error) {
      console.error('Notarization error:', error);
    }
  }
  console.log(`✓ ${notarizations.length} notarizations created`);

  console.log('Seeding complete!');
}

seed().catch(console.error);
