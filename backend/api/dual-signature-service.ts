import { createClient } from '@supabase/supabase-js';
import { KMSService } from '../aws/kms-service';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

export class DualSignatureService {
  private kmsService: KMSService;

  constructor(kmsService: KMSService) {
    this.kmsService = kmsService;
  }

  async initiateModelRegistration(modelData: any, mlopsUserId: string) {
    const payload = JSON.stringify(modelData);
    const { signature: mlopsSignature, cloudTrailEventId } = await this.kmsService.sign(
      modelData.kms_mlops_key_arn || modelData.kms_key_arn,
      payload
    );

    const { data, error } = await supabase
      .from('model_registry')
      .insert({
        enterprise_id: modelData.enterprise_id,
        model_id: modelData.model_id,
        version: modelData.version,
        weights_hash: modelData.weights_hash,
        authorized_contexts: modelData.authorized_contexts,
        status: 'PENDING',
        mlops_signature: mlopsSignature,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async approveModelRegistration(modelId: string, version: string, complianceUserId: string) {
    const { data: model } = await supabase
      .from('model_registry')
      .select('*')
      .eq('model_id', modelId)
      .eq('version', version)
      .eq('status', 'PENDING')
      .single();

    if (!model) throw new Error('Model not found or already approved');

    const payload = JSON.stringify({ ...model, mlops_signature: model.mlops_signature });
    const { signature: complianceSignature } = await this.kmsService.sign(
      model.kms_compliance_key_arn || model.kms_key_arn,
      payload
    );

    const { data, error } = await supabase
      .from('model_registry')
      .update({
        status: 'ACTIVE',
        compliance_signature: complianceSignature,
        deployed_at: new Date().toISOString(),
      })
      .eq('id', model.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async rejectModelRegistration(modelId: string, version: string, reason: string) {
    const { data, error } = await supabase
      .from('model_registry')
      .update({
        status: 'REJECTED',
        rejection_reason: reason,
      })
      .eq('model_id', modelId)
      .eq('version', version)
      .eq('status', 'PENDING')
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
