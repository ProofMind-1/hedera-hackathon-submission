import crypto from 'crypto';
import axios from 'axios';

export interface NotarizationConfig {
  modelId: string;
  context: string;
  sensitivity?: 'low' | 'medium' | 'high';
}

export interface NotarizationReceipt {
  notarizationId: string;
  submissionId: string;
  hcsSequence?: bigint;
  signedAt?: number;
}

export class ProofMind {
  private enterpriseId: string;
  private hcsTopicId: string;
  private apiUrl: string;
  private mode: string;
  private piiFields: string[];

  constructor(config: {
    enterpriseId: string;
    hcsTopicId: string;
    apiUrl?: string;
    mode?: string;
    piiFields?: string[];
  }) {
    this.enterpriseId = config.enterpriseId;
    this.hcsTopicId = config.hcsTopicId;
    this.apiUrl = config.apiUrl || 'http://localhost:3001';
    this.mode = config.mode || 'async';
    this.piiFields = config.piiFields || [];
  }

  hash(data: any, scrubPii: boolean = true): string {
    let processedData = data;
    
    if (typeof data === 'object' && scrubPii) {
      processedData = Object.keys(data).reduce((acc, key) => {
        acc[key] = this.piiFields.includes(key) ? '[REDACTED]' : data[key];
        return acc;
      }, {} as any);
    }
    
    const canonical = JSON.stringify(processedData, Object.keys(processedData).sort());
    return 'sha256:' + crypto.createHash('sha256').update(canonical).digest('hex');
  }

  wrap(fn: Function, config: NotarizationConfig) {
    return async (...args: any[]) => {
      const inputHash = this.hash(args[0]);
      const result = await fn(...args);
      const outputHash = this.hash(result);
      
      const receipt = await this.notarizeManual({
        modelId: config.modelId,
        inputHash,
        outputHash,
        context: config.context,
        sensitivity: config.sensitivity,
      });
      
      return { decision: result, ...receipt };
    };
  }

  async notarizeManual(params: {
    modelId: string;
    inputHash: string;
    outputHash: string;
    context: string;
    sensitivity?: string;
    outcomeLabel?: string;
  }): Promise<NotarizationReceipt> {
    const notarizationId = `pm_${Date.now()}_${params.inputHash.slice(7, 15)}`;
    
    const record = {
      notarization_id: notarizationId,
      enterprise_id: this.enterpriseId,
      model_id: params.modelId,
      input_hash: params.inputHash,
      output_hash: params.outputHash,
      decision_context: params.context,
      sensitivity_level: params.sensitivity || 'medium',
      outcome_label: params.outcomeLabel,
      submitted_at: Math.floor(Date.now() / 1000),
      sdk_version: '1.0.0',
    };
    
    const submissionId = await this.submitToApi(record);
    
    return {
      notarizationId,
      submissionId,
      signedAt: Date.now(),
    };
  }

  async notarizeBatch(records: any[], batchSize: number = 50): Promise<NotarizationReceipt[]> {
    const batchRecords = records.map(r => ({
      notarization_id: `pm_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`,
      enterprise_id: this.enterpriseId,
      ...r,
      submitted_at: Math.floor(Date.now() / 1000),
      sdk_version: '1.0.0',
    }));

    try {
      await axios.post(`${this.apiUrl}/api/v1/notarize/batch`, {
        records: batchRecords,
        topic_id: this.hcsTopicId,
      });

      return batchRecords.map(r => ({
        notarizationId: r.notarization_id,
        submissionId: `batch_${Date.now()}`,
        signedAt: Date.now(),
      }));
    } catch (error) {
      throw new Error(`Batch submission failed: ${error}`);
    }
  }

  private async submitToApi(record: any): Promise<string> {
    try {
      const response = await axios.post(`${this.apiUrl}/api/v1/notarize`, record, {
        timeout: 5000,
      });
      return response.data.id || `sub_${Date.now()}`;
    } catch (error) {
      return `sub_error_${Date.now()}`;
    }
  }
}
