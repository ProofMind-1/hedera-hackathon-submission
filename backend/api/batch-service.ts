import crypto from 'crypto';
import { HederaService } from '../hedera/hcs-service';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

export class BatchService {
  private hederaService: HederaService;

  constructor(hederaService: HederaService) {
    this.hederaService = hederaService;
  }

  async submitBatch(records: any[], topicId: string) {
    const batchSize = 50;
    const batches = [];

    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize);
      const merkleTree = this.buildMerkleTree(batch);
      
      const batchRecord = {
        batch_id: `batch_${Date.now()}_${i}`,
        merkle_root: merkleTree.root,
        notarization_ids: batch.map(r => r.notarization_id),
        count: batch.length,
        timestamp: Date.now(),
      };

      const hcsSequence = await this.hederaService.submitNotarization(topicId, batchRecord);
      
      // Store individual records with batch reference
      for (const record of batch) {
        await supabase.from('notarizations').insert({
          ...record,
          hcs_sequence: hcsSequence.toString(),
          consensus_timestamp: new Date().toISOString(),
        });
      }

      batches.push({ ...batchRecord, hcs_sequence: hcsSequence });
    }

    return batches;
  }

  async verifyBatch(notarizationIds: string[], inputData: any[], outputData: any[]) {
    const results = [];

    for (let i = 0; i < notarizationIds.length; i++) {
      const { data: notarization } = await supabase
        .from('notarizations')
        .select('*')
        .eq('notarization_id', notarizationIds[i])
        .single();

      if (!notarization) {
        results.push({ notarization_id: notarizationIds[i], result: 'NOT_FOUND' });
        continue;
      }

      const inputHash = this.hash(inputData[i]);
      const outputHash = this.hash(outputData[i]);

      results.push({
        notarization_id: notarizationIds[i],
        result: inputHash === notarization.input_hash && outputHash === notarization.output_hash ? 'VERIFIED' : 'TAMPERED',
      });
    }

    return {
      total: results.length,
      verified: results.filter(r => r.result === 'VERIFIED').length,
      tampered: results.filter(r => r.result === 'TAMPERED').length,
      not_found: results.filter(r => r.result === 'NOT_FOUND').length,
      results,
    };
  }

  private buildMerkleTree(records: any[]): { root: string; tree: string[][] } {
    const leaves = records.map(r => this.hash(JSON.stringify(r)));
    const tree: string[][] = [leaves];

    let currentLevel = leaves;
    while (currentLevel.length > 1) {
      const nextLevel: string[] = [];
      for (let i = 0; i < currentLevel.length; i += 2) {
        const left = currentLevel[i];
        const right = i + 1 < currentLevel.length ? currentLevel[i + 1] : left;
        nextLevel.push(this.hash(left + right));
      }
      tree.push(nextLevel);
      currentLevel = nextLevel;
    }

    return { root: currentLevel[0], tree };
  }

  private hash(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }
}
