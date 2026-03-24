import DocsLayout, { TocItem } from "@/components/docs/DocsLayout";
import ArchitectureDiagram from "@/components/ArchitectureDiagram";

const toc: TocItem[] = [
  { id: "overview", title: "Overview", level: 2 },
  { id: "layers", title: "Architecture Layers", level: 2 },
  { id: "data-flow", title: "Data Flow", level: 2 },
  { id: "security-boundary", title: "Security Boundary", level: 2 },
];

const ArchOverview = () => (
  <DocsLayout toc={toc}>
    <h1 className="text-4xl font-bold mb-4">System Architecture</h1>
    <p className="text-lg text-muted-foreground mb-8">
      ProofMind's architecture is designed around zero data exposure and independent verifiability.
    </p>

    <h2 id="overview" className="text-2xl font-bold mt-12 mb-4 scroll-mt-20">Overview</h2>
    <div className="my-8 p-6 rounded-xl bg-secondary/50 border border-border overflow-x-auto">
      <ArchitectureDiagram />
    </div>

    <h2 id="layers" className="text-2xl font-bold mt-12 mb-4 scroll-mt-20">Architecture Layers</h2>
    <div className="space-y-4">
      {[
        { title: "Enterprise AI Pipeline", desc: "Your models, data, and business logic. ProofMind integrates via SDK at the inference point." },
        { title: "ProofMind SDK", desc: "Computes SHA-256 hashes of input/output. Manages KMS signing requests. Queues HCS submissions." },
        { title: "AWS KMS", desc: "Enterprise-controlled key management. Signs hash bundles. Creates CloudTrail audit events." },
        { title: "Hedera HCS", desc: "Receives signed hash records. Provides immutable consensus timestamps. Public verifiability." },
        { title: "Audit Agent", desc: "Monitors HCS streams. Detects anomalies. Answers natural language queries from regulators." },
        { title: "Dashboard & Regulator Portal", desc: "Visual interface for compliance teams and external auditors." },
      ].map((l) => (
        <div key={l.title} className="p-4 rounded-lg bg-gradient-card border border-border">
          <h3 className="font-semibold text-sm mb-1">{l.title}</h3>
          <p className="text-sm text-muted-foreground">{l.desc}</p>
        </div>
      ))}
    </div>

    <h2 id="data-flow" className="text-2xl font-bold mt-12 mb-4 scroll-mt-20">Data Flow</h2>
    <ol className="list-decimal pl-6 text-muted-foreground space-y-3">
      <li>AI model receives inference request</li>
      <li>ProofMind SDK intercepts input/output at the wrapper layer</li>
      <li>SHA-256 hashes computed (PII scrubbed if enabled)</li>
      <li>Hash bundle sent to AWS KMS for signing</li>
      <li>Signed record submitted to Hedera HCS</li>
      <li>Consensus timestamp returned and stored locally</li>
      <li>Audit Agent continuously monitors the HCS stream</li>
    </ol>

    <h2 id="security-boundary" className="text-2xl font-bold mt-12 mb-4 scroll-mt-20">Security Boundary</h2>
    <p className="text-muted-foreground">
      The critical security boundary is between your enterprise infrastructure and ProofMind/Hedera. 
      Only cryptographic hashes cross this boundary — never raw data, model weights, or business logic. 
      This makes ProofMind GDPR-safe by design.
    </p>
  </DocsLayout>
);

export default ArchOverview;
