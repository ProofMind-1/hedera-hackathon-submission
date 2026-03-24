import DocsLayout, { TocItem } from "@/components/docs/DocsLayout";
import CodeBlock from "@/components/CodeBlock";

const toc: TocItem[] = [
  { id: "decorator", title: "Using the Decorator", level: 2 },
  { id: "wrapper", title: "Using the Wrapper", level: 2 },
  { id: "what-happens", title: "What Happens", level: 2 },
];

const WrapInference = () => (
  <DocsLayout toc={toc}>
    <h1 className="text-4xl font-bold mb-4">Wrap AI Inference</h1>
    <p className="text-lg text-muted-foreground mb-8">
      Add immutable audit trails to your AI inferences with a single decorator or wrapper.
    </p>

    <h2 id="decorator" className="text-2xl font-bold mt-12 mb-4 scroll-mt-20">Using the Decorator (Python)</h2>
    <CodeBlock language="python" filename="inference.py" code={`@pm.notarize(
    model_id="credit_risk_v4.2",
    context="loan_application_decision",
    sensitivity="high"
)
def credit_decision(applicant_data: dict) -> dict:
    return ai_model.predict(applicant_data)

# Every call is now automatically notarized
result = credit_decision({"income": 75000, "score": 720})
print(result.notarization_id)  # "ntx_abc123..."`} />

    <h2 id="wrapper" className="text-2xl font-bold mt-12 mb-4 scroll-mt-20">Using the Wrapper (Node.js)</h2>
    <CodeBlock language="javascript" filename="inference.js" code={`const notarizedDecision = pm.wrap(
  contentModerationModel.classify,
  {
    modelId: 'content_moderation_v3.0',
    context: 'content_moderation',
    sensitivity: 'medium'
  }
);

const result = await notarizedDecision(userContent);
console.log(result.notarizationId); // "ntx_abc123..."`} />

    <h2 id="what-happens" className="text-2xl font-bold mt-12 mb-4 scroll-mt-20">What Happens Under the Hood</h2>
    <ol className="list-decimal pl-6 text-muted-foreground space-y-3">
      <li>SDK computes <code className="text-primary font-mono text-sm">SHA-256</code> hashes of the input and output</li>
      <li>Hash bundle is signed with your AWS KMS key</li>
      <li>Signed record is submitted to Hedera HCS (async by default)</li>
      <li>A <code className="text-primary font-mono text-sm">notarization_id</code> is returned immediately</li>
      <li>Full HCS confirmation is available via callback or polling</li>
    </ol>
  </DocsLayout>
);

export default WrapInference;
