import { ProofMind } from './proofmind';

const pm = new ProofMind({
  enterpriseId: 'ent_demo_bank',
  hcsTopicId: '0.0.12345',
  mode: 'async',
  piiFields: ['userId', 'email', 'ipAddress'],
});

// Example: Wrap AI model function
const fraudDetectionModel = {
  async classify(transaction: any) {
    // Your AI inference logic
    const riskScore = Math.random();
    return {
      flagged: riskScore > 0.8,
      riskScore,
      reason: riskScore > 0.8 ? 'high_risk_pattern' : 'normal',
    };
  },
};

const notarizedFraudCheck = pm.wrap(fraudDetectionModel.classify, {
  modelId: 'fraud_detector_v2.1',
  context: 'transaction_screening',
  sensitivity: 'high',
});

// Use the wrapped function
const transaction = {
  amount: 5000,
  userId: 'user_12345',
  merchant: 'Online Store',
};

const result = await notarizedFraudCheck(transaction);
console.log('Decision:', result.decision);
console.log('Notarization ID:', result.notarizationId);
