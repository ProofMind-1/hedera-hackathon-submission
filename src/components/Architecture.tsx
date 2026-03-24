import ArchitectureDiagram from "./ArchitectureDiagram";

const Architecture = () => {
  return (
    <section id="architecture" className="py-24 relative bg-secondary/30">
      <div className="container px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            System{' '}
            <span className="text-gradient">Architecture</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            A layered architecture designed for enterprise security, regulatory compliance, 
            and production-grade performance.
          </p>
        </div>

        <div className="max-w-6xl mx-auto p-8 rounded-xl bg-gradient-card border border-border">
          <ArchitectureDiagram />
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-12">
          {[
            { title: "Your Infrastructure", desc: "AI models, data, and business logic stay entirely within your environment. ProofMind never sees raw data." },
            { title: "ProofMind Layer", desc: "SDK computes hashes, KMS signs them, and submits to Hedera — all async with sub-50ms overhead." },
            { title: "Verification Layer", desc: "Audit Agent monitors in real-time. Regulators and auditors verify independently via the dashboard." },
          ].map((item) => (
            <div key={item.title} className="p-6 rounded-xl bg-gradient-card border border-border">
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Architecture;
