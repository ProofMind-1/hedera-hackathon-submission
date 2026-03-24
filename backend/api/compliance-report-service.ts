import { createClient } from '@supabase/supabase-js';
import { KMSService } from '../aws/kms-service';
import { HederaService } from '../hedera/hcs-service';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

export class ComplianceReportService {
  private kmsService: KMSService;
  private hederaService: HederaService;

  constructor(kmsService: KMSService, hederaService: HederaService) {
    this.kmsService = kmsService;
    this.hederaService = hederaService;
  }

  async generateReport(enterpriseId: string, periodFrom: Date, periodTo: Date, reportType: string) {
    const { data: enterprise } = await supabase
      .from('enterprises')
      .select('*')
      .eq('enterprise_id', enterpriseId)
      .single();

    if (!enterprise) throw new Error('Enterprise not found');

    // Gather metrics
    const { count: totalDecisions } = await supabase
      .from('notarizations')
      .select('*', { count: 'exact', head: true })
      .eq('enterprise_id', enterpriseId)
      .gte('submitted_at', periodFrom.toISOString())
      .lte('submitted_at', periodTo.toISOString());

    const { count: anomalyCount } = await supabase
      .from('anomalies')
      .select('*', { count: 'exact', head: true })
      .eq('enterprise_id', enterpriseId)
      .gte('detected_at', periodFrom.toISOString())
      .lte('detected_at', periodTo.toISOString());

    const { data: models } = await supabase
      .from('notarizations')
      .select('model_id')
      .eq('enterprise_id', enterpriseId)
      .gte('submitted_at', periodFrom.toISOString())
      .lte('submitted_at', periodTo.toISOString());

    const modelsUsed = [...new Set(models?.map(m => m.model_id) || [])];

    const report = {
      report_id: `report_${Date.now()}`,
      enterprise_id: enterpriseId,
      report_type: reportType,
      period_from: periodFrom.toISOString(),
      period_to: periodTo.toISOString(),
      total_decisions: totalDecisions || 0,
      anomaly_count: anomalyCount || 0,
      models_used: modelsUsed,
      compliance_frameworks: enterprise.compliance_frameworks,
      generated_at: new Date().toISOString(),
    };

    // Sign report
    const { signature, cloudTrailEventId } = await this.kmsService.sign(
      enterprise.kms_key_arn,
      JSON.stringify(report)
    );

    // Anchor to HCS
    const hcsSequence = await this.hederaService.submitNotarization(
      enterprise.hcs_topic_id,
      { ...report, signature, cloudTrailEventId }
    );

    // Store in database
    const { data, error } = await supabase
      .from('compliance_reports')
      .insert({
        enterprise_id: report.enterprise_id,
        report_type: report.report_type,
        period_from: report.period_from,
        period_to: report.period_to,
        total_decisions: report.total_decisions,
        anomaly_count: report.anomaly_count,
        models_used: report.models_used,
        compliance_frameworks: report.compliance_frameworks,
        kms_signature: signature,
        hcs_sequence: hcsSequence.toString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getReports(enterpriseId: string) {
    const { data, error } = await supabase
      .from('compliance_reports')
      .select('*')
      .eq('enterprise_id', enterpriseId)
      .order('generated_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async scheduleReport(enterpriseId: string, frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly') {
    // Implementation for scheduled report generation
    const now = new Date();
    let periodFrom = new Date(now);

    switch (frequency) {
      case 'daily':
        periodFrom.setDate(now.getDate() - 1);
        break;
      case 'weekly':
        periodFrom.setDate(now.getDate() - 7);
        break;
      case 'monthly':
        periodFrom.setMonth(now.getMonth() - 1);
        break;
      case 'quarterly':
        periodFrom.setMonth(now.getMonth() - 3);
        break;
    }

    return this.generateReport(enterpriseId, periodFrom, now, frequency);
  }
}
