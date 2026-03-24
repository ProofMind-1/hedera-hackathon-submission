import { createClient } from '@supabase/supabase-js';
import { HederaService } from '../hedera/hcs-service';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

export class HumanOversightService {
  private hederaService: HederaService;

  constructor(hederaService: HederaService) {
    this.hederaService = hederaService;
  }

  async logHumanReview(notarizationId: string, reviewData: any) {
    const { data: notarization } = await supabase
      .from('notarizations')
      .select('enterprise_id')
      .eq('notarization_id', notarizationId)
      .single();

    if (!notarization) throw new Error('Notarization not found');

    const { data: enterprise } = await supabase
      .from('enterprises')
      .select('hcs_topic_id')
      .eq('enterprise_id', notarization.enterprise_id)
      .single();

    const reviewRecord = {
      notarization_id: notarizationId,
      enterprise_id: notarization.enterprise_id,
      review_outcome: reviewData.outcome,
      reviewer_role_hash: reviewData.reviewer_role_hash,
      reviewed_at: new Date().toISOString(),
    };

    const hcsSequence = await this.hederaService.submitNotarization(
      enterprise!.hcs_topic_id,
      { type: 'HUMAN_OVERSIGHT_LOG', ...reviewRecord }
    );

    const { data, error } = await supabase
      .from('human_oversight_log')
      .insert({
        ...reviewRecord,
        hcs_sequence: hcsSequence.toString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async logDecisionReversal(notarizationId: string, reversalData: any) {
    const { data: notarization } = await supabase
      .from('notarizations')
      .select('enterprise_id, outcome_label')
      .eq('notarization_id', notarizationId)
      .single();

    if (!notarization) throw new Error('Notarization not found');

    const { data: enterprise } = await supabase
      .from('enterprises')
      .select('hcs_topic_id')
      .eq('enterprise_id', notarization.enterprise_id)
      .single();

    const reversalRecord = {
      notarization_id: notarizationId,
      enterprise_id: notarization.enterprise_id,
      reversal_reason: reversalData.reason,
      reversed_by_role_hash: reversalData.reversed_by_role_hash,
      original_outcome: notarization.outcome_label,
      new_outcome: reversalData.new_outcome,
      reversed_at: new Date().toISOString(),
    };

    const hcsSequence = await this.hederaService.submitNotarization(
      enterprise!.hcs_topic_id,
      { type: 'DECISION_REVERSAL', ...reversalRecord }
    );

    const { data, error } = await supabase
      .from('decision_reversals')
      .insert({
        ...reversalRecord,
        hcs_sequence: hcsSequence.toString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getOversightMetrics(enterpriseId: string, modelId?: string) {
    let query = supabase
      .from('human_oversight_log')
      .select('*')
      .eq('enterprise_id', enterpriseId);

    if (modelId) {
      const { data: notarizations } = await supabase
        .from('notarizations')
        .select('notarization_id')
        .eq('model_id', modelId);

      const ids = notarizations?.map(n => n.notarization_id) || [];
      query = query.in('notarization_id', ids);
    }

    const { data, count } = await query.select('*', { count: 'exact' });

    return {
      total_reviews: count || 0,
      reviews: data,
    };
  }
}
