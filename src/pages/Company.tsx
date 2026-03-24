import { Link } from "react-router-dom";
import { ArrowRight, Shield, Users, Target, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Company = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container px-6">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About{' '}
              <span className="text-gradient">ProofMind</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              We're building the trust infrastructure for the AI era.
            </p>
          </div>

          {/* Mission */}
          <div className="max-w-3xl mx-auto mb-24">
            <div className="p-8 rounded-xl bg-gradient-card border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Target className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">Our Mission</h2>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                AI systems are making decisions that affect billions of lives — approving loans, 
                assisting diagnoses, pricing insurance. But today, there's no way to independently 
                verify what these systems actually did. We're changing that.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mt-4">
                ProofMind creates cryptographic proof for AI decisions. Immutable records that 
                regulators can trust and enterprises can rely on. We believe AI accountability 
                shouldn't require trusting the organization that deployed the AI.
              </p>
            </div>
          </div>

          {/* Values */}
          <div className="max-w-4xl mx-auto mb-24">
            <h2 className="text-2xl font-bold text-center mb-12">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: Shield,
                  title: "Trust Through Transparency",
                  description: "We believe verification should be independent. No one should have to trust internal logs.",
                },
                {
                  icon: Users,
                  title: "Developer First",
                  description: "Enterprise infrastructure should be as easy to integrate as consumer APIs.",
                },
                {
                  icon: Target,
                  title: "Security by Design",
                  description: "Zero data exposure isn't a feature — it's a foundational architecture decision.",
                },
              ].map((value) => (
                <div key={value.title} className="p-6 rounded-xl bg-gradient-card border border-border text-center">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="max-w-xl mx-auto text-center">
            <div className="p-8 rounded-xl border border-border bg-secondary/30">
              <Mail className="w-10 h-10 text-primary mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Get in Touch</h2>
              <p className="text-muted-foreground mb-6">
                Interested in ProofMind for your enterprise? Let's talk.
              </p>
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Contact Sales
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Company;
