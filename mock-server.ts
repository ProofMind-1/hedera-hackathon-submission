import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Mock data
let notarizations: any[] = [];
let models: any[] = [
  {
    id: '1',
    enterprise_id: 'ent_demo',
    model_id: 'credit_risk_v4.2',
    version: '4.2.1',
    status: 'ACTIVE',
    authorized_contexts: ['loan_application'],
    deployed_at: new Date().toISOString()
  },
  {
    id: '2', 
    enterprise_id: 'ent_demo',
    model_id: 'fraud_detector_v2.1',
    version: '2.1.0',
    status: 'ACTIVE',
    authorized_contexts: ['transaction_screening'],
    deployed_at: new Date().toISOString()
  }
];

let anomalies: any[] = [];

// Mock notarization endpoint
app.post('/api/v1/notarize', (req, res) => {
  const notarization = {
    id: `not_${Date.now()}`,
    ...req.body,
    hcs_sequence: Math.floor(Math.random() * 10000),
    consensus_timestamp: new Date().toISOString(),
    status: 'confirmed'
  };
  
  notarizations.push(notarization);
  
  // Simulate anomaly detection
  if (Math.random() < 0.1) { // 10% chance of anomaly
    anomalies.push({
      id: `anom_${Date.now()}`,
      type: 'VOLUME_SPIKE',
      notarization_id: notarization.id,
      severity: 'medium',
      detected_at: new Date().toISOString()
    });
  }
  
  console.log(`✓ Notarization: ${req.body.model_id} - ${req.body.outcome_label}`);
  res.json(notarization);
});

// Get notarizations
app.get('/api/v1/notarizations', (req, res) => {
  res.json(notarizations.slice(-20)); // Last 20
});

// Get models
app.get('/api/v1/models', (req, res) => {
  res.json(models);
});

// Get anomalies
app.get('/api/v1/anomalies', (req, res) => {
  res.json(anomalies);
});

// Verification endpoint
app.post('/api/v1/verify', (req, res) => {
  const { notarization_id } = req.body;
  const notarization = notarizations.find(n => n.notarization_id === notarization_id);
  
  if (!notarization) {
    return res.json({ result: 'NOT_FOUND' });
  }
  
  res.json({
    result: 'VERIFIED',
    notarization_id,
    hcs_sequence: notarization.hcs_sequence,
    verified_at: new Date().toISOString()
  });
});

// Dashboard stats
app.get('/api/v1/dashboard/stats', (req, res) => {
  const today = new Date().toDateString();
  const todayNotarizations = notarizations.filter(n => 
    new Date(n.submitted_at).toDateString() === today
  );
  
  res.json({
    total_decisions_today: todayNotarizations.length,
    total_decisions_all_time: notarizations.length,
    active_models: models.filter(m => m.status === 'ACTIVE').length,
    active_anomalies: anomalies.length,
    approval_rate: Math.round(
      (notarizations.filter(n => n.outcome_label === 'approved').length / 
       Math.max(notarizations.length, 1)) * 100
    )
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 ProofMind Mock API running on port ${PORT}`);
  console.log(`📊 Dashboard: http://localhost:5173/dashboard`);
  console.log(`🔍 API: http://localhost:${PORT}`);
});