import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { HederaService } from './hedera/hcs-service';
import { NotarizationService } from './api/notarization-service';
import { ModelRegistryService } from './api/model-registry-service';
import { AnomalyDetectionService } from './api/anomaly-detection-service';
import { KMSService } from './aws/kms-service';
import { BatchService } from './api/batch-service';
import { ComplianceReportService } from './api/compliance-report-service';
import { AuditAgent } from './api/audit-agent';
import { DualSignatureService } from './api/dual-signature-service';
import { HumanOversightService } from './api/human-oversight-service';
import { NotificationService } from './api/notification-service';
import { MirrorNodeService } from './hedera/mirror-node-service';
import { rateLimiter, authMiddleware } from './api/middleware';

const app = express();
app.use(cors());
app.use(express.json());
app.use(rateLimiter(100, 60000));

const hederaService = new HederaService(
  process.env.HEDERA_OPERATOR_ID!,
  process.env.HEDERA_OPERATOR_KEY!
);

const kmsService = new KMSService();
const notarizationService = new NotarizationService(hederaService);
const modelRegistryService = new ModelRegistryService();
const anomalyService = new AnomalyDetectionService();
const batchService = new BatchService(hederaService);
const complianceService = new ComplianceReportService(kmsService, hederaService);
const dualSignService = new DualSignatureService(kmsService);
const oversightService = new HumanOversightService(hederaService);
const notificationService = new NotificationService();
const mirrorNodeService = new MirrorNodeService();

// Notarization endpoints
app.post('/api/v1/notarize', async (req, res) => {
  try {
    const result = await notarizationService.submitNotarization(req.body);
    
    const agent = new AuditAgent(req.body.enterprise_id);
    const monitoring = await agent.monitorNotarization(req.body);
    
    if (monitoring.anomalies.length > 0) {
      for (const anomaly of monitoring.anomalies) {
        await notificationService.sendAnomalyAlert(anomaly, req.body.enterprise_id);
      }
    }
    
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/v1/notarize/batch', async (req, res) => {
  try {
    const { records, topic_id } = req.body;
    const result = await batchService.submitBatch(records, topic_id);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/v1/notarizations', async (req, res) => {
  try {
    const { enterprise_id } = req.query;
    const result = await notarizationService.getNotarizations(enterprise_id as string);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/v1/verify', async (req, res) => {
  try {
    const { notarization_id, input_data, output_data } = req.body;
    const result = await notarizationService.verifyNotarization(
      notarization_id,
      input_data,
      output_data
    );
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/v1/verify/batch', async (req, res) => {
  try {
    const { notarization_ids, input_data, output_data } = req.body;
    const result = await batchService.verifyBatch(notarization_ids, input_data, output_data);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Model Registry endpoints with dual-signature
app.post('/api/v1/models/initiate', async (req, res) => {
  try {
    const result = await dualSignService.initiateModelRegistration(req.body, req.body.mlops_user_id);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/v1/models/approve', async (req, res) => {
  try {
    const { model_id, version, compliance_user_id } = req.body;
    const result = await dualSignService.approveModelRegistration(model_id, version, compliance_user_id);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/v1/models', async (req, res) => {
  try {
    const result = await modelRegistryService.registerModel(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/v1/models', async (req, res) => {
  try {
    const { enterprise_id } = req.query;
    const result = await modelRegistryService.getModels(enterprise_id as string);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/v1/models/:modelId/:version/status', async (req, res) => {
  try {
    const { modelId, version } = req.params;
    const { status } = req.body;
    const result = await modelRegistryService.updateModelStatus(modelId, version, status);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Human Oversight endpoints
app.post('/api/v1/oversight/review', async (req, res) => {
  try {
    const { notarization_id, review_data } = req.body;
    const result = await oversightService.logHumanReview(notarization_id, review_data);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/v1/oversight/reversal', async (req, res) => {
  try {
    const { notarization_id, reversal_data } = req.body;
    const result = await oversightService.logDecisionReversal(notarization_id, reversal_data);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Anomaly endpoints
app.get('/api/v1/anomalies', async (req, res) => {
  try {
    const { enterprise_id } = req.query;
    const agent = new AuditAgent(enterprise_id as string);
    const result = await agent.queryAnomalies();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Compliance Report endpoints
app.post('/api/v1/reports', async (req, res) => {
  try {
    const { enterprise_id, period_from, period_to, report_type } = req.body;
    const result = await complianceService.generateReport(
      enterprise_id,
      new Date(period_from),
      new Date(period_to),
      report_type
    );
    await notificationService.sendComplianceReport(result, enterprise_id);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/v1/reports', async (req, res) => {
  try {
    const { enterprise_id } = req.query;
    const result = await complianceService.getReports(enterprise_id as string);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/v1/reports/schedule', async (req, res) => {
  try {
    const { enterprise_id, frequency } = req.body;
    const result = await complianceService.scheduleReport(enterprise_id, frequency);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Audit Agent Query endpoint
app.post('/api/v1/query', async (req, res) => {
  try {
    const { enterprise_id, query, regulator_id } = req.body;
    const agent = new AuditAgent(enterprise_id);
    const result = await agent.processQuery(query, regulator_id);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Mirror Node endpoints
app.get('/api/v1/mirror/topic/:topicId/messages', async (req, res) => {
  try {
    const { topicId } = req.params;
    const { limit } = req.query;
    const result = await mirrorNodeService.getTopicMessages(topicId, Number(limit) || 100);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Enterprise endpoints
app.post('/api/v1/enterprises', async (req, res) => {
  try {
    const { enterprise_id, company_name } = req.body;
    const topics = await hederaService.createEnterpriseTopics(enterprise_id);
    const keyArn = await kmsService.createKey(`ProofMind - ${company_name}`);

    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);
    await supabase.from('enterprises').upsert({
      enterprise_id,
      company_name,
      hcs_topic_id: topics.decisions,
      kms_key_arn: keyArn,
      jurisdictions: ['US', 'EU'],
      compliance_frameworks: ['EU_AI_ACT', 'SEC'],
      status: 'active',
    });

    res.json({ enterprise_id, topics, kms_key_arn: keyArn });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`ProofMind API running on port ${PORT}`));
