import DocsLayout, { TocItem } from "@/components/docs/DocsLayout";

const toc: TocItem[] = [
  { id: "step-1", title: "1. Hash Computation", level: 2 },
  { id: "step-2", title: "2. KMS Signing", level: 2 },
  { id: "step-3", title: "3. HCS Anchoring", level: 2 },
  { id: "step-4", title: "4. Verification", level: 2 },
];

const HowItWorksDocs = () => (
  <DocsLayout toc={toc}>
    <h1 className="text-4xl font-bold mb-4">How It Works</h1>
    <p className="text-lg text-muted-foreground mb-8">
      The four-step process that makes every AI decision independently verifiable.
    </p>

    <h2 id="step-1" className="text-2xl font-bold mt-12 mb-4 scroll-mt-20">1. Hash Computation</h2>
    <p className="text-muted-foreground mb-4">
      When your AI model makes a decision, the ProofMind SDK computes SHA-256 hashes of the input 
      and output data. PII is scrubbed before hashing if enabled. The original data never leaves 
      your infrastructure — only the hash.
    </p>
    <p className="text-sm text-muted-foreground">⏱ Time: &lt; 2ms</p>

    <h2 id="step-2" className="text-2xl font-bold mt-12 mb-4 scroll-mt-20">2. KMS Signing</h2>
    <p className="text-muted-foreground mb-4">
      The hash bundle is signed with your enterprise's AWS KMS key. This creates a CloudTrail audit 
      event, providing an additional layer of proof that the submission came from your authorized pipeline.
    </p>
    <p className="text-sm text-muted-foreground">⏱ Time: 20-50ms</p>

    <h2 id="step-3" className="text-2xl font-bold mt-12 mb-4 scroll-mt-20">3. HCS Anchoring</h2>
    <p className="text-muted-foreground mb-4">
      The signed record is submitted to Hedera Consensus Service. It receives an immutable consensus 
      timestamp that cannot be altered — by you, by ProofMind, or by anyone. Ever.
    </p>
    <p className="text-sm text-muted-foreground">⏱ Time: 1-3 seconds (async, does not block inference)</p>

    <h2 id="step-4" className="text-2xl font-bold mt-12 mb-4 scroll-mt-20">4. Verification</h2>
    <p className="text-muted-foreground">
      At any point in the future, anyone with the original input/output data can verify the notarization. 
      They recompute the hash and check it against the Hedera record. If the hashes match, the decision 
      is verified. If they don't, tampering is detected.
    </p>
  </DocsLayout>
);

export default HowItWorksDocs;
