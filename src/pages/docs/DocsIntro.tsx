import DocsLayout, { TocItem } from "@/components/docs/DocsLayout";
import CodeBlock from "@/components/CodeBlock";
import { Link } from "react-router-dom";

const toc: TocItem[] = [
  { id: "what-is-proofmind", title: "What is ProofMind", level: 2 },
  { id: "key-concepts", title: "Key Concepts", level: 2 },
  { id: "quick-example", title: "Quick Example", level: 2 },
  { id: "next-steps", title: "Next Steps", level: 2 },
];

const DocsIntro = () => {
  return (
    <DocsLayout toc={toc}>
      <div className="prose-docs">
        <h1 className="text-4xl font-bold mb-4">Introduction</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Welcome to the ProofMind documentation. Learn how to add immutable audit trails to your AI systems.
        </p>

        <h2 id="what-is-proofmind" className="text-2xl font-bold mt-12 mb-4 scroll-mt-20">What is ProofMind</h2>
        <p className="text-muted-foreground mb-4">
          ProofMind is an SDK that cryptographically notarizes AI decisions to the Hedera Consensus Service (HCS). 
          It creates tamper-proof audit trails that regulators, auditors, and enterprises can independently verify — 
          without exposing any sensitive data.
        </p>
        <p className="text-muted-foreground mb-4">
          When your AI model makes a decision, ProofMind computes SHA-256 hashes of the input and output, 
          signs them with your enterprise AWS KMS key, and submits the signed hash to Hedera HCS. 
          The original data never leaves your infrastructure.
        </p>

        <h2 id="key-concepts" className="text-2xl font-bold mt-12 mb-4 scroll-mt-20">Key Concepts</h2>
        <div className="space-y-4 mb-8">
          {[
            { term: "Notarization", desc: "The process of recording a cryptographic proof of an AI decision to Hedera." },
            { term: "Audit Trail", desc: "The immutable sequence of notarized decisions, ordered by Hedera consensus timestamps." },
            { term: "Audit Agent", desc: "An autonomous AI agent that monitors your audit trail for anomalies and answers regulator queries." },
            { term: "Model Registry", desc: "A cryptographic record of every model version, enforcing governance over model deployments." },
            { term: "Verification", desc: "The ability for any party to independently prove that a decision was recorded accurately." },
          ].map((item) => (
            <div key={item.term} className="p-4 rounded-lg bg-secondary/50 border border-border">
              <span className="font-mono text-sm text-primary">{item.term}</span>
              <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
            </div>
          ))}
        </div>

        <h2 id="quick-example" className="text-2xl font-bold mt-12 mb-4 scroll-mt-20">Quick Example</h2>
        <p className="text-muted-foreground mb-4">
          Add ProofMind to any AI inference with a single decorator:
        </p>
        <CodeBlock
          language="python"
          filename="app.py"
          code={`from proofmind import ProofMind

pm = ProofMind(
    enterprise_id="ent_acme_financial",
    kms_key_arn="arn:aws:kms:us-east-1:...",
    hcs_topic_id="0.0.12345"
)

@pm.notarize(
    model_id="credit_risk_v4.2",
    context="loan_application_decision"
)
def credit_decision(data):
    return model.predict(data)

# Every call is now immutably recorded
result = credit_decision({"income": 75000, "score": 720})`}
        />

        <h2 id="next-steps" className="text-2xl font-bold mt-12 mb-4 scroll-mt-20">Next Steps</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { title: "Install SDK", href: "/docs/quickstart/install", desc: "Get ProofMind installed in minutes" },
            { title: "Architecture", href: "/docs/architecture/overview", desc: "Understand the system design" },
            { title: "Python SDK", href: "/docs/sdk/python", desc: "Full Python SDK reference" },
            { title: "Compliance", href: "/docs/compliance/eu-ai-act", desc: "EU AI Act compliance guide" },
          ].map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="block p-4 rounded-lg border border-border hover:border-primary/50 transition-colors bg-gradient-card"
            >
              <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </DocsLayout>
  );
};

export default DocsIntro;
