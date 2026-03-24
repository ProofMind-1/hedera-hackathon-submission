import DocsLayout, { TocItem } from "@/components/docs/DocsLayout";
import CodeBlock from "@/components/CodeBlock";

const toc: TocItem[] = [
  { id: "installation", title: "Installation", level: 2 },
  { id: "python", title: "Python", level: 3 },
  { id: "nodejs", title: "Node.js", level: 3 },
  { id: "requirements", title: "Requirements", level: 2 },
  { id: "next-steps", title: "Next Steps", level: 2 },
];

const InstallSDK = () => (
  <DocsLayout toc={toc}>
    <h1 className="text-4xl font-bold mb-4">Install SDK</h1>
    <p className="text-lg text-muted-foreground mb-8">
      Install the ProofMind SDK for your platform.
    </p>

    <h2 id="installation" className="text-2xl font-bold mt-12 mb-4 scroll-mt-20">Installation</h2>

    <h3 id="python" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">Python</h3>
    <CodeBlock language="bash" filename="Terminal" code={`pip install proofmind`} />
    <p className="text-sm text-muted-foreground mt-3 mb-6">Requires Python 3.8+</p>

    <h3 id="nodejs" className="text-xl font-semibold mt-8 mb-4 scroll-mt-20">Node.js</h3>
    <CodeBlock language="bash" filename="Terminal" code={`npm install @proofmind/sdk`} />
    <p className="text-sm text-muted-foreground mt-3 mb-6">Requires Node.js 16+</p>

    <h2 id="requirements" className="text-2xl font-bold mt-12 mb-4 scroll-mt-20">Requirements</h2>
    <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-8">
      <li>An AWS account with KMS key configured</li>
      <li>A Hedera account with an HCS topic ID</li>
      <li>ProofMind enterprise credentials (get from dashboard)</li>
    </ul>

    <h2 id="next-steps" className="text-2xl font-bold mt-12 mb-4 scroll-mt-20">Next Steps</h2>
    <p className="text-muted-foreground">
      Once installed, proceed to <a href="/docs/quickstart/initialize" className="text-primary hover:underline">Initialize the SDK</a>.
    </p>
  </DocsLayout>
);

export default InstallSDK;
