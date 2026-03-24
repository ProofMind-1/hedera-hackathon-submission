import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

export class AnomalyDetectionService {
  async detectAnomalies(notarization: any, model: any) {
    const anomalies = [];

    // 1. UNREGISTERED_MODEL
    if (!model) {
      anomalies.push({
        anomaly_class: 'UNREGISTERED_MODEL',
        severity: 'CRITICAL',
        detail: { model_id: notarization.model_id },
      });
    }

    // 2. REVOKED_MODEL_ACTIVE
    if (model && model.status === 'REVOKED') {
      anomalies.push({
        anomaly_class: 'REVOKED_MODEL_ACTIVE',
        severity: 'CRITICAL',
        detail: { model_id: notarization.model_id, status: model.status },
      });
    }

    // 3. CONTEXT_MISMATCH
    if (model && !model.authorized_contexts.includes(notarization.decision_context)) {
      anomalies.push({
        anomaly_class: 'CONTEXT_MISMATCH',
        severity: 'HIGH',
        detail: {
          model_id: notarization.model_id,
          context: notarization.decision_context,
          authorized: model.authorized_contexts,
        },
      });
    }

    // 4. JURISDICTION_VIOLATION
    if (model && model.jurisdictions && model.jurisdictions.length > 0) {
      const notarJurisdiction = notarization.jurisdiction;
      if (notarJurisdiction && !model.jurisdictions.includes(notarJurisdiction)) {
        anomalies.push({
          anomaly_class: 'JURISDICTION_VIOLATION',
          severity: 'HIGH',
          detail: {
            model_id: notarization.model_id,
            jurisdiction: notarJurisdiction,
            authorized: model.jurisdictions,
          },
        });
      }
    }

    // 5. SDK_VERSION_MISMATCH
    const minSdkVersion = '1.0.0';
    if (notarization.sdk_version && notarization.sdk_version < minSdkVersion) {
      anomalies.push({
        anomaly_class: 'SDK_VERSION_MISMATCH',
        severity: 'MEDIUM',
        detail: {
          current: notarization.sdk_version,
          minimum: minSdkVersion,
        },
      });
    }

    // 6. BATCH_WITHOUT_CONSENT
    if (notarization.is_batch && !notarization.batch_job_id) {
      anomalies.push({
        anomaly_class: 'BATCH_WITHOUT_CONSENT',
        severity: 'MEDIUM',
        detail: { notarization_id: notarization.notarization_id },
      });
    }

    // 7. VOLUME_SPIKE
    const volumeAnomaly = await this.checkVolumeSpike(notarization.enterprise_id);
    if (volumeAnomaly) anomalies.push(volumeAnomaly);

    // 8. OUTCOME_DISTRIBUTION_SHIFT
    const distributionAnomaly = await this.checkOutcomeShift(
      notarization.enterprise_id,
      notarization.model_id
    );
    if (distributionAnomaly) anomalies.push(distributionAnomaly);

    // 9. HUMAN_OVERSIGHT_GAP
    if (model && model.human_oversight_required) {
      const oversightAnomaly = await this.checkHumanOversightGap(
        notarization.enterprise_id,
        notarization.model_id
      );
      if (oversightAnomaly) anomalies.push(oversightAnomaly);
    }

    return anomalies;
  }

  async logAnomaly(enterpriseId: string, anomaly: any, notarizationId?: string) {
    const { data, error } = await supabase
      .from('anomalies')
      .insert({
        enterprise_id: enterpriseId,
        anomaly_class: anomaly.anomaly_class,
        notarization_id: notarizationId,
        severity: anomaly.severity,
        detail: anomaly.detail,
        status: 'active',
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  private async checkVolumeSpike(enterpriseId: string) {
    const oneHourAgo = new Date(Date.now() - 3600000).toISOString();
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 3600000).toISOString();

    const { count: hourCount } = await supabase
      .from('notarizations')
      .select('*', { count: 'exact', head: true })
      .eq('enterprise_id', enterpriseId)
      .gte('submitted_at', oneHourAgo);

    const { count: totalCount } = await supabase
      .from('notarizations')
      .select('*', { count: 'exact', head: true })
      .eq('enterprise_id', enterpriseId)
      .gte('submitted_at', thirtyDaysAgo);

    const avgPerHour = (totalCount || 0) / (30 * 24);
    
    if ((hourCount || 0) > avgPerHour * 3) {
      return {
        anomaly_class: 'VOLUME_SPIKE',
        severity: 'MEDIUM',
        detail: { current: hourCount, average: avgPerHour },
      };
    }

    return null;
  }

  private async checkOutcomeShift(enterpriseId: string, modelId: string) {
    const oneDayAgo = new Date(Date.now() - 24 * 3600000).toISOString();
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 3600000).toISOString();

    // Get recent outcomes
    const { data: recentData } = await supabase
      .from('notarizations')
      .select('outcome_label')
      .eq('enterprise_id', enterpriseId)
      .eq('model_id', modelId)
      .gte('submitted_at', oneDayAgo);

    // Get baseline outcomes
    const { data: baselineData } = await supabase
      .from('notarizations')
      .select('outcome_label')
      .eq('enterprise_id', enterpriseId)
      .eq('model_id', modelId)
      .gte('submitted_at', thirtyDaysAgo)
      .lt('submitted_at', oneDayAgo);

    if (!recentData || !baselineData || recentData.length < 10) return null;

    const recentApprovalRate = recentData.filter(d => d.outcome_label === 'approved').length / recentData.length;
    const baselineApprovalRate = baselineData.filter(d => d.outcome_label === 'approved').length / baselineData.length;

    if (Math.abs(recentApprovalRate - baselineApprovalRate) > 0.25) {
      return {
        anomaly_class: 'OUTCOME_DISTRIBUTION_SHIFT',
        severity: 'MEDIUM',
        detail: { recent: recentApprovalRate, baseline: baselineApprovalRate },
      };
    }

    return null;
  }

  private async checkHumanOversightGap(enterpriseId: string, modelId: string) {
    const oneDayAgo = new Date(Date.now() - 24 * 3600000).toISOString();

    const { count: totalDecisions } = await supabase
      .from('notarizations')
      .select('*', { count: 'exact', head: true })
      .eq('enterprise_id', enterpriseId)
      .eq('model_id', modelId)
      .gte('submitted_at', oneDayAgo);

    const { count: reviewedDecisions } = await supabase
      .from('human_oversight_log')
      .select('*', { count: 'exact', head: true })
      .eq('enterprise_id', enterpriseId)
      .gte('reviewed_at', oneDayAgo);

    const reviewRate = totalDecisions ? (reviewedDecisions || 0) / totalDecisions : 1;
    const expectedRate = 0.8;

    if (reviewRate < expectedRate) {
      return {
        anomaly_class: 'HUMAN_OVERSIGHT_GAP',
        severity: 'HIGH',
        detail: { reviewRate, expectedRate, gap: expectedRate - reviewRate },
      };
    }

    return null;
  }
}
