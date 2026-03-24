import { createClient } from '@supabase/supabase-js';
import { AnomalyDetectionService } from './anomaly-detection-service';
import { ModelRegistryService } from './model-registry-service';
import { GoogleGenerativeAI } from '@google/generative-ai';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

export class AuditAgent {
  private anomalyService: AnomalyDetectionService;
  private modelRegistry: ModelRegistryService;
  private enterpriseId: string;

  constructor(enterpriseId: string) {
    this.enterpriseId = enterpriseId;
    this.anomalyService = new AnomalyDetectionService();
    this.modelRegistry = new ModelRegistryService();
  }

  async monitorNotarization(notarization: any) {
    // Validate model registration
    const validation = await this.modelRegistry.validateModel(
      notarization.enterprise_id,
      notarization.model_id,
      notarization.decision_context
    );

    let model = null;
    if (validation.valid) {
      model = validation.model;
    }

    // Detect anomalies
    const anomalies = await this.anomalyService.detectAnomalies(notarization, model);

    // Log anomalies
    for (const anomaly of anomalies) {
      await this.anomalyService.logAnomaly(
        notarization.enterprise_id,
        anomaly,
        notarization.notarization_id
      );
    }

    return { anomalies, model_valid: validation.valid };
  }

  async processQuery(query: string, regulatorId: string) {
    // Fetch context data from Supabase
    const [{ count: totalDecisions }, { data: anomalies }, { data: models }, { data: recentNotarizations }] = await Promise.all([
      supabase.from('notarizations').select('*', { count: 'exact', head: true }).eq('enterprise_id', this.enterpriseId),
      supabase.from('anomalies').select('anomaly_class, severity, detail, detected_at').eq('enterprise_id', this.enterpriseId).order('detected_at', { ascending: false }).limit(10),
      supabase.from('model_registry').select('model_id, version, status, deployed_at').eq('enterprise_id', this.enterpriseId),
      supabase.from('notarizations').select('model_id, decision_context, outcome_label, submitted_at').eq('enterprise_id', this.enterpriseId).order('submitted_at', { ascending: false }).limit(50),
    ]);

    const context = {
      enterprise_id: this.enterpriseId,
      total_decisions: totalDecisions,
      recent_notarizations: recentNotarizations,
      anomalies,
      registered_models: models,
      queried_by: regulatorId,
    };

    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) {
      return { answer: 'Gemini API key not configured.', query };
    }

    try {
      const genAI = new GoogleGenerativeAI(geminiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      const prompt = `You are an AI audit agent for ProofMind, an immutable AI decision audit system.
A regulator or compliance officer is querying the audit trail for enterprise "${this.enterpriseId}".

Here is the current audit data:
${JSON.stringify(context, null, 2)}

Answer this query concisely and accurately based only on the data above:
"${query}"

Respond with a clear, professional answer in 1-3 sentences. If data is insufficient, say so.`;

      const result = await model.generateContent(prompt);
      const answer = result.response.text();

      return { answer, query, data_used: { total_decisions: totalDecisions, anomaly_count: anomalies?.length, model_count: models?.length } };
    } catch (error: any) {
      return { answer: `AI query failed: ${error.message}`, query };
    }
  }

  private async queryDecisionCount(query: string) {
    const { count } = await supabase
      .from('notarizations')
      .select('*', { count: 'exact', head: true })
      .eq('enterprise_id', this.enterpriseId);

    return {
      answer: `Total decisions: ${count || 0}`,
      count,
      query,
    };
  }

  private async queryAnomalies() {
    const { data, count } = await supabase
      .from('anomalies')
      .select('*', { count: 'exact' })
      .eq('enterprise_id', this.enterpriseId)
      .eq('status', 'active');

    return {
      answer: `Active anomalies: ${count || 0}`,
      anomalies: data,
      count,
    };
  }

  private async queryModels() {
    const { data } = await supabase
      .from('model_registry')
      .select('*')
      .eq('enterprise_id', this.enterpriseId)
      .eq('status', 'ACTIVE');

    return {
      answer: `Active models: ${data?.length || 0}`,
      models: data,
    };
  }

  async detectModelDrift() {
    const { data: recentNotarizations } = await supabase
      .from('notarizations')
      .select('model_id')
      .eq('enterprise_id', this.enterpriseId)
      .order('submitted_at', { ascending: false })
      .limit(1000);

    if (!recentNotarizations) return null;

    const modelCounts: Record<string, number> = {};
    recentNotarizations.forEach(n => {
      modelCounts[n.model_id] = (modelCounts[n.model_id] || 0) + 1;
    });

    return { distribution: modelCounts, total: recentNotarizations.length };
  }
}
