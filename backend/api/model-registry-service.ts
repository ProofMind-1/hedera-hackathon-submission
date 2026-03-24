import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

export class ModelRegistryService {
  async registerModel(modelData: any) {
    const { data, error } = await supabase
      .from('model_registry')
      .insert({
        enterprise_id: modelData.enterprise_id,
        model_id: modelData.model_id,
        version: modelData.version,
        weights_hash: modelData.weights_hash,
        training_data_manifest_hash: modelData.training_data_manifest_hash,
        framework_hash: modelData.framework_hash,
        authorized_contexts: modelData.authorized_contexts,
        authorized_sensitivity: modelData.authorized_sensitivity || ['medium'],
        jurisdictions: modelData.jurisdictions || [],
        compliance_frameworks: modelData.compliance_frameworks || [],
        human_oversight_required: modelData.human_oversight_required || false,
        human_oversight_threshold: modelData.human_oversight_threshold,
        status: 'pending',
        deployed_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getModels(enterpriseId: string) {
    const { data, error } = await supabase
      .from('model_registry')
      .select('*')
      .eq('enterprise_id', enterpriseId)
      .order('deployed_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async updateModelStatus(modelId: string, version: string, status: string) {
    const { data, error } = await supabase
      .from('model_registry')
      .update({ 
        status,
        deprecated_at: status === 'DEPRECATED' ? new Date().toISOString() : null
      })
      .eq('model_id', modelId)
      .eq('version', version)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async validateModel(enterpriseId: string, modelId: string, context: string) {
    const { data } = await supabase
      .from('model_registry')
      .select('*')
      .eq('enterprise_id', enterpriseId)
      .eq('model_id', modelId)
      .eq('status', 'ACTIVE')
      .single();

    if (!data) {
      return { valid: false, reason: 'UNREGISTERED_MODEL' };
    }

    if (!data.authorized_contexts.includes(context)) {
      return { valid: false, reason: 'CONTEXT_MISMATCH' };
    }

    return { valid: true, model: data };
  }
}
