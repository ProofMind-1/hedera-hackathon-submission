import DocsLayout, { TocItem } from "@/components/docs/DocsLayout";
import CodeBlock from "@/components/CodeBlock";

const toc: TocItem[] = [
  { id: "overview", title: "Overview", level: 2 },
  { id: "initialization", title: "Initialization", level: 2 },
  { id: "wrap-method", title: "Wrap Method", level: 2 },
  { id: "manual", title: "Manual Notarization", level: 2 },
  { id: "verify", title: "Verification", level: 2 },
  { id: "express", title: "Express Middleware", level: 2 },
];

const NodeSDK = () => (
  <DocsLayout toc={toc}>
    <h1 className="text-4xl font-bold mb-4">Node.js SDK Reference</h1>
    <p className="text-lg text-muted-foreground mb-8">
      Complete reference for the ProofMind Node.js SDK.
    </p>

    <h2 id="overview" className="text-2xl font-bold mt-12 mb-4 scroll-mt-20">Overview</h2>
    <CodeBlock language="bash" filename="Terminal" code="npm install @proofmind/sdk" />
    <p className="text-muted-foreground mt-3 mb-6">Requires Node.js 16+. Compatible with Express, Fastify, and serverless environments.</p>

    <h2 id="initialization" className="text-2xl font-bold mt-12 mb-4 scroll-mt-20">Initialization</h2>
    <CodeBlock language="javascript" filename="config.js" code={`const { ProofMind } = require('@proofmind/sdk');

const pm = new ProofMind({
  enterpriseId: 'ent_acme_financial',
  kmsKeyArn: 'arn:aws:kms:us-east-1:...:key/...',
  hcsTopicId: '0.0.12345',
  mode: 'async'
});`} />

    <h2 id="wrap-method" className="text-2xl font-bold mt-12 mb-4 scroll-mt-20">Wrap Method</h2>
    <CodeBlock language="javascript" code={`const notarizedClassify = pm.wrap(
  contentModerationModel.classify,
  {
    modelId: 'content_moderation_v3.0',
    context: 'content_moderation',
    sensitivity: 'medium'
  }
);

const result = await notarizedClassify(userContent);
console.log(result.notarizationId);`} />

    <h2 id="manual" className="text-2xl font-bold mt-12 mb-4 scroll-mt-20">Manual Notarization</h2>
    <CodeBlock language="javascript" code={`const receipt = await pm.notarize({
  modelId: 'fraud_detection_v2.1',
  inputData: transactionData,
  outputData: fraudScore,
  context: 'real_time_fraud_check'
});

console.log(receipt.notarizationId);
console.log(receipt.hcsSequenceNumber);`} />

    <h2 id="verify" className="text-2xl font-bold mt-12 mb-4 scroll-mt-20">Verification</h2>
    <CodeBlock language="javascript" code={`const result = await pm.verify({
  notarizationId: 'ntx_abc123',
  originalInput: inputData,
  originalOutput: outputData
});

console.log(result.verified);       // true
console.log(result.tamperDetected); // false`} />

    <h2 id="express" className="text-2xl font-bold mt-12 mb-4 scroll-mt-20">Express Middleware</h2>
    <CodeBlock language="javascript" filename="server.js" code={`const express = require('express');
const app = express();

// Automatically notarize all AI inference endpoints
app.use('/api/ai/*', pm.middleware({
  modelId: 'api_gateway_model',
  context: 'api_inference'
}));`} />
  </DocsLayout>
);

export default NodeSDK;
