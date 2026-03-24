import { Link } from "react-router-dom";
import { ArrowRight, Shield, Lock, Key, Hash, Server, Eye, FileCheck, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const securityPrinciples = [
  {
    icon: Hash,
    title: "Zero Data Exposure",
    description: "ProofMind never sees your data. Only SHA-256 cryptographic hashes leave your infrastructure. Original inputs, outputs, and model weights remain entirely within your environment.",
  },
  {
    icon: Key,
    title: "Enterprise Key Ownership",
    description: "You control the signing keys in your AWS KMS. ProofMind has no access to your cryptographic keys. All signing operations happen within your AWS account.",
  },
  {
    icon: Lock,
    title: "FIPS 140-2 Level 3",
    description: "AWS KMS uses FIPS 140-2 Level 3 certified hardware security modules (HSMs) for key storage and cryptographic operations.",
  },
  {
    icon: Server,
    title: "Hedera Immutability",
    description: "Records anchored to Hedera Consensus Service are mathematically immutable. They cannot be modified or deleted by anyone — including ProofMind.",
  },
  {
    icon: Eye,
    title: "Full Transparency",
    description: "Every signing operation creates a CloudTrail event. Complete visibility over all notarization activity in your AWS account.",
  },
  {
    icon: FileCheck,
    title: "Independent Verification",
    description: "Anyone with the original data can independently verify a notarization by recomputing the hash and checking against Hedera.",
  },
];

const threatModel = [
  {
    threat: "Enterprise modifies records after the fact",
    mitigation: "Records on Hedera are immutable with consensus timestamps. Retroactive modification is impossible.",
  },
  {
    threat: "ProofMind systems are compromised",
    mitigation: "Only hashes stored. Enterprise KMS keys are never accessible to ProofMind. No sensitive data to exfiltrate.",
  },
  {
    threat: "Replay attacks submitting old records",
    mitigation: "Hedera consensus timestamps provide ordering. Duplicate detection flags replayed records.",
  },
  {
    threat: "Enterprise KMS key is compromised",
    mitigation: "AWS CloudTrail detects unauthorized signing. Key rotation supported. Previous records remain valid.",
  },
  {
    threat: "Regulator receives fabricated data",
    mitigation: "Verification recomputes hash. Any data modification is detected by hash mismatch.",
  },
];

const Security = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container px-6">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-6">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">Security Model</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Security{' '}
              <span className="text-gradient">by Design</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              ProofMind's architecture was built from the ground up with enterprise security 
              as a foundational requirement, not an afterthought.
            </p>
          </div>

          {/* Security principles */}
          <div className="max-w-5xl mx-auto mb-24">
            <h2 className="text-2xl font-bold text-center mb-12">Security Principles</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {securityPrinciples.map((principle) => (
                <div 
                  key={principle.title}
                  className="p-6 rounded-xl bg-gradient-card border border-border"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <principle.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{principle.title}</h3>
                  <p className="text-sm text-muted-foreground">{principle.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Threat model */}
          <div className="max-w-4xl mx-auto mb-24">
            <h2 className="text-2xl font-bold text-center mb-12">Threat Model & Mitigations</h2>
            <div className="space-y-4">
              {threatModel.map((item) => (
                <div 
                  key={item.threat}
                  className="p-5 rounded-xl bg-gradient-card border border-border"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="w-4 h-4 text-destructive" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm text-destructive mb-1">{item.threat}</h4>
                      <p className="text-sm text-muted-foreground">→ {item.mitigation}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Compliance certifications */}
          <div className="max-w-3xl mx-auto">
            <div className="p-6 rounded-xl border border-border bg-secondary/30 text-center">
              <h3 className="font-semibold text-lg mb-4">Compliance & Certifications</h3>
              <div className="flex flex-wrap justify-center gap-4">
                {["SOC 2 Type II", "GDPR", "HIPAA", "ISO 27001"].map((cert) => (
                  <span key={cert} className="px-4 py-2 rounded-lg bg-background border border-border text-sm font-medium">
                    {cert}
                  </span>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Enterprise security questionnaire and pen test reports available upon request.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="max-w-xl mx-auto text-center mt-16">
            <Link to="/docs/security/threat-model">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Read Full Security Docs
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

export default Security;
