import { Link } from "react-router-dom";
import { ArrowRight, Hash, Key, Link as LinkIcon, CheckCircle, Server, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ArchitectureDiagram from "@/components/ArchitectureDiagram";
import CodeBlock from "@/components/CodeBlock";

const layers = [
  {
    name: "Enterprise AI System",
    description: "Your ML models, inference pipelines, and business logic. ProofMind integrates at the inference point without requiring changes to your model architecture.",
    icon: Server,
  },
  {
    name: "ProofMind SDK",
    description: "Lightweight Python and Node.js libraries that wrap your inference functions. Computes SHA-256 hashes, manages signing requests, and queues HCS submissions.",
    icon: Hash,
  },
  {
    name: "AWS KMS Signing",
    description: "Your enterprise-controlled AWS Key Management Service signs every notarization record. Creates CloudTrail audit events for complete traceability.",
    icon: Key,
  },
  {
    name: "Hedera Consensus Service",
    description: "Signed hash records are submitted to Hedera HCS, receiving immutable consensus timestamps that cannot be altered by anyone — ever.",
    icon: LinkIcon,
  },
  {
    name: "Audit Agent",
    description: "An autonomous AI agent monitors your HCS stream in real-time, detecting anomalies and answering natural language queries from regulators.",
    icon: Shield,
  },
  {
    name: "Dashboard & Verification",
    description: "Enterprise compliance dashboard and regulator verification portal for independent audit access.",
    icon: CheckCircle,
  },
];

const dataFlow = `# Data Flow Summary

1. AI model receives inference request
2. ProofMind SDK intercepts at wrapper layer
3. SHA-256 hashes computed (PII scrubbed)
4. Hash bundle signed with AWS KMS
5. Signed record submitted to Hedera HCS
6. Consensus timestamp returned
7. Audit Agent monitors stream`;

const Architecture = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container px-6">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              System{' '}
              <span className="text-gradient">Architecture</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              ProofMind's layered architecture is designed for zero data exposure, 
              enterprise security, and independent verifiability.
            </p>
          </div>

          {/* Visual diagram */}
          <div className="max-w-5xl mx-auto mb-24">
            <div className="p-8 rounded-xl bg-gradient-card border border-border">
              <ArchitectureDiagram />
            </div>
          </div>

          {/* Layer breakdown */}
          <div className="max-w-4xl mx-auto mb-24">
            <h2 className="text-2xl font-bold text-center mb-12">Architecture Layers</h2>
            <div className="space-y-6">
              {layers.map((layer, i) => (
                <div 
                  key={layer.name}
                  className="flex items-start gap-6 p-6 rounded-xl bg-gradient-card border border-border"
                >
                  <div className="flex-shrink-0 flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {i + 1}
                    </div>
                    <layer.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{layer.name}</h3>
                    <p className="text-muted-foreground">{layer.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Data flow */}
          <div className="max-w-3xl mx-auto mb-24">
            <h2 className="text-2xl font-bold text-center mb-8">Data Flow</h2>
            <CodeBlock code={dataFlow} language="markdown" filename="data-flow.md" />
          </div>

          {/* Security boundary */}
          <div className="max-w-3xl mx-auto">
            <div className="p-6 rounded-xl border border-primary/30 bg-primary/5">
              <h3 className="font-semibold text-lg mb-3">Security Boundary</h3>
              <p className="text-muted-foreground mb-4">
                The critical security boundary is between your enterprise infrastructure and 
                ProofMind/Hedera. Only cryptographic hashes cross this boundary — never raw data, 
                model weights, or business logic.
              </p>
              <div className="flex flex-wrap gap-2">
                {["SHA-256 Hashes", "Model IDs", "Context Strings", "Timestamps"].map((item) => (
                  <span key={item} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-mono">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="max-w-xl mx-auto text-center mt-16">
            <Link to="/docs/architecture/overview">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Read Full Architecture Docs
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Architecture;
