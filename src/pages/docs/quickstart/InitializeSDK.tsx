import DocsLayout, { TocItem } from "@/components/docs/DocsLayout";
import CodeBlock from "@/components/CodeBlock";

const toc: TocItem[] = [
  { id: "python-init", title: "Python Initialization", level: 2 },
  { id: "nodejs-init", title: "Node.js Initialization", level: 2 },
  { id: "configuration", title: "Configuration Options", level: 2 },
];

const InitializeSDK = () => (
  <DocsLayout toc={toc}>
    <h1 className="text-4xl font-bold mb-4">Initialize SDK</h1>
    <p className="text-lg text-muted-foreground mb-8">
      Configure ProofMind with your enterprise credentials.
    </p>

    <h2 id="python-init" className="text-2xl font-bold mt-12 mb-4 scroll-mt-20">Python Initialization</h2>
    <CodeBlock language="python" filename="config.py" code={`from proofmind import ProofMind

pm = ProofMind(
    enterprise_id="ent_acme_financial",
    kms_key_arn="arn:aws:kms:us-east-1:123456789:key/abc-def",
    hcs_topic_id="0.0.12345",
    mode="async",           # "async" (default) or "sync"
    hash_algorithm="sha256" # Default
)`} />

    <h2 id="nodejs-init" className="text-2xl font-bold mt-12 mb-4 scroll-mt-20">Node.js Initialization</h2>
    <CodeBlock language="javascript" filename="config.js" code={`const { ProofMind } = require('@proofmind/sdk');

const pm = new ProofMind({
  enterpriseId: 'ent_acme_financial',
  kmsKeyArn: 'arn:aws:kms:us-east-1:123456789:key/abc-def',
  hcsTopicId: '0.0.12345',
  mode: 'async',
  hashAlgorithm: 'sha256'
});`} />

    <h2 id="configuration" className="text-2xl font-bold mt-12 mb-4 scroll-mt-20">Configuration Options</h2>
    <div className="overflow-x-auto">
      <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
        <thead className="bg-secondary">
          <tr>
            <th className="text-left p-3 font-semibold">Parameter</th>
            <th className="text-left p-3 font-semibold">Type</th>
            <th className="text-left p-3 font-semibold">Description</th>
          </tr>
        </thead>
        <tbody className="text-muted-foreground">
          {[
            ["enterprise_id", "string", "Your ProofMind enterprise identifier"],
            ["kms_key_arn", "string", "AWS KMS key ARN for signing"],
            ["hcs_topic_id", "string", "Hedera HCS topic ID"],
            ["mode", '"async" | "sync"', "Submission mode (default: async)"],
            ["hash_algorithm", "string", "Hash algorithm (default: sha256)"],
          ].map(([param, type, desc]) => (
            <tr key={param} className="border-t border-border">
              <td className="p-3 font-mono text-primary">{param}</td>
              <td className="p-3 font-mono">{type}</td>
              <td className="p-3">{desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </DocsLayout>
);

export default InitializeSDK;
