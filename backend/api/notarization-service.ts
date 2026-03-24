import { createClient } from '@supabase/supabase-js';
import { HederaService } from '../hedera/hcs-service';
import crypto from 'crypto';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

export class NotarizationService {
  private hederaService: HederaService;

  constructor(hederaService: HederaService) {
    this.hederaService = hederaService;
  }

  async submitNotarization(record: any) {
    const { data: enterprise } = await supabase
      .from('enterprises')
      .select('hcs_topic_id')
      .eq('enterprise_id', record.enterprise_id)
      .single();

    if (!enterprise) throw new Error('Enterprise not found');

    const hcsSequence = await this.hederaService.submitNotarization(
      enterprise.hcs_topic_id,
      record
    );

    const notarizationId = record.notarization_id || `pm_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const { data, error } = await supabase
      .from('notarizations')
      .insert({
        notarization_id: notarizationId,
        enterprise_id: record.enterprise_id,
        model_id: record.model_id,
        decision_context: record.decision_context,
        input_hash: record.input_hash,
        output_hash: record.output_hash,
        outcome_label: record.outcome_label,
        sensitivity_level: record.sensitivity_level || 'medium',
        sdk_version: record.sdk_version || '1.0.0',
        hcs_sequence: hcsSequence.toString(),
        submitted_at: new Date().toISOString(),
        consensus_timestamp: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getNotarizations(enterpriseId: string) {
    const { data, error } = await supabase
      .from('notarizations')
      .select('*')
      .eq('enterprise_id', enterpriseId)
      .order('submitted_at', { ascending: false })
      .limit(100);

    if (error) throw error;
    return data;
  }

  async verifyNotarization(notarizationId: string, inputData: any, outputData: any) {
    const { data: notarization } = await supabase
      .from('notarizations')
      .select('*')
      .eq('notarization_id', notarizationId)
      .single();

    if (!notarization) return { result: 'NOT_FOUND' };

    const computedInputHash = this.hash(inputData);
    const computedOutputHash = this.hash(outputData);

    const inputMatch = computedInputHash === notarization.input_hash;
    const outputMatch = computedOutputHash === notarization.output_hash;

    const verificationResult = {
      verification_id: `vrf_${Date.now()}`,
      notarization_id: notarizationId,
      result: inputMatch && outputMatch ? 'VERIFIED' : 'TAMPERED',
      checks: {
        inputHash: { expected: notarization.input_hash, computed: computedInputHash, match: inputMatch },
        outputHash: { expected: notarization.output_hash, computed: computedOutputHash, match: outputMatch },
      },
      verified_at: new Date().toISOString(),
    };

    // Anchor verification to HCS
    const { data: enterprise } = await supabase
      .from('enterprises')
      .select('hcs_topic_id')
      .eq('enterprise_id', notarization.enterprise_id)
      .single();

    if (enterprise) {
      const hcsSequence = await this.hederaService.submitNotarization(
        enterprise.hcs_topic_id,
        { type: 'VERIFICATION_RESULT', ...verificationResult }
      );

      // Store verification event
      await supabase.from('verifications').insert({
        ...verificationResult,
        requested_by: 'system',
        checks_json: verificationResult.checks,
        hcs_verification_sequence: hcsSequence.toString(),
      });
    }

    return verificationResult;
  }

  private hash(data: any): string {
    const canonical = JSON.stringify(data);
    return 'sha256:' + crypto.createHash('sha256').update(canonical).digest('hex');
  }
}
