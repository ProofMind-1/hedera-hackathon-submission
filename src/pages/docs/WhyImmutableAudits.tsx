import DocsLayout, { TocItem } from "@/components/docs/DocsLayout";

const toc: TocItem[] = [
  { id: "problem", title: "The Problem", level: 2 },
  { id: "why-immutable", title: "Why Immutability Matters", level: 2 },
  { id: "trust-model", title: "The Trust Model", level: 2 },
];

const WhyImmutableAudits = () => (
  <DocsLayout toc={toc}>
    <h1 className="text-4xl font-bold mb-4">Why Immutable AI Audits Matter</h1>
    <p className="text-lg text-muted-foreground mb-8">
      Understanding the fundamental problem ProofMind solves.
    </p>

    <h2 id="problem" className="text-2xl font-bold mt-12 mb-4 scroll-mt-20">The Problem</h2>
    <p className="text-muted-foreground mb-4">
      Today, when an AI system makes a decision — approving a loan, flagging content, diagnosing a condition — 
      the only evidence of that decision lives in the organization's own systems. Internal logs, internal databases, 
      internal reports.
    </p>
    <p className="text-muted-foreground mb-4">
      The organization can modify, delete, or fabricate these records at will. When a regulator asks 
      "what model version made this decision, with what inputs?", the answer comes from systems 
      the regulated entity fully controls. This is the fundamental trust gap in AI governance.
    </p>

    <h2 id="why-immutable" className="text-2xl font-bold mt-12 mb-4 scroll-mt-20">Why Immutability Matters</h2>
    <p className="text-muted-foreground mb-4">
      Immutability means the record cannot be altered after creation — not by the enterprise, 
      not by ProofMind, not by anyone. Hedera's consensus timestamps provide cryptographic proof 
      of when a record was created, making retroactive fabrication impossible.
    </p>
    <div className="p-4 rounded-lg border border-primary/30 bg-primary/5 my-6">
      <p className="text-sm text-foreground">
        <strong>Key insight:</strong> ProofMind doesn't ask you to trust ProofMind. 
        The verification is based on mathematics — SHA-256 hashing and Hedera's public consensus. 
        Anyone can verify independently.
      </p>
    </div>

    <h2 id="trust-model" className="text-2xl font-bold mt-12 mb-4 scroll-mt-20">The Trust Model</h2>
    <p className="text-muted-foreground">
      ProofMind shifts the trust model from "trust the enterprise's internal logs" to 
      "verify against an immutable public ledger." This is the same shift that happened 
      in financial auditing decades ago — from self-reported numbers to independent verification. 
      AI governance is next.
    </p>
  </DocsLayout>
);

export default WhyImmutableAudits;
