import DocsLayout, { TocItem } from "@/components/docs/DocsLayout";

const toc: TocItem[] = [
  { id: "overview", title: "Overview", level: 2 },
  { id: "requirements", title: "EU AI Act Requirements", level: 2 },
  { id: "mapping", title: "ProofMind Mapping", level: 2 },
];

const EuAiAct = () => (
  <DocsLayout toc={toc}>
    <h1 className="text-4xl font-bold mb-4">EU AI Act Compliance</h1>
    <p className="text-lg text-muted-foreground mb-8">
      How ProofMind helps enterprises comply with the EU AI Act's requirements for high-risk AI systems.
    </p>

    <h2 id="overview" className="text-2xl font-bold mt-12 mb-4 scroll-mt-20">Overview</h2>
    <p className="text-muted-foreground mb-4">
      The EU AI Act (effective 2024) imposes strict requirements on high-risk AI systems including 
      mandatory logging, bias monitoring, human oversight documentation, and audit trails that must 
      be maintained for 5+ years. Non-compliance penalties reach up to €30M or 6% of global turnover.
    </p>

    <h2 id="requirements" className="text-2xl font-bold mt-12 mb-4 scroll-mt-20">EU AI Act Requirements</h2>
    <div className="space-y-3 mb-8">
      {[
        { article: "Article 12", req: "Automatic recording of events (logging)" },
        { article: "Article 14", req: "Human oversight capabilities" },
        { article: "Article 15", req: "Accuracy, robustness, and cybersecurity" },
        { article: "Article 17", req: "Quality management system" },
        { article: "Article 61", req: "Post-market monitoring" },
      ].map((r) => (
        <div key={r.article} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50 border border-border">
          <span className="font-mono text-xs text-primary whitespace-nowrap">{r.article}</span>
          <span className="text-sm text-muted-foreground">{r.req}</span>
        </div>
      ))}
    </div>

    <h2 id="mapping" className="text-2xl font-bold mt-12 mb-4 scroll-mt-20">ProofMind Mapping</h2>
    <p className="text-muted-foreground mb-4">
      ProofMind's immutable audit trail directly addresses the EU AI Act's logging and traceability 
      requirements. Every AI decision is cryptographically recorded with a consensus timestamp, 
      providing the tamper-proof evidence trail that regulators require.
    </p>
    <ul className="list-disc pl-6 text-muted-foreground space-y-2">
      <li>Immutable decision logs with Hedera consensus timestamps (Article 12)</li>
      <li>Model version registry with governance controls (Article 17)</li>
      <li>Audit Agent for continuous monitoring and anomaly detection (Article 61)</li>
      <li>Regulator verification portal for independent audits (Article 14)</li>
      <li>5+ year retention guaranteed by Hedera's public ledger</li>
    </ul>
  </DocsLayout>
);

export default EuAiAct;
