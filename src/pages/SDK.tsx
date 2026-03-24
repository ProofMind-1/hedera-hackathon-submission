import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CodeBlock from "@/components/CodeBlock";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowRight, Zap, Shield, Code2 } from "lucide-react";

const pythonInstall = `pip install proofmind`;

const pythonQuickstart = `from proofmind import ProofMind

pm = ProofMind(
    enterprise_id="ent_your_company",
    kms_key_arn="arn:aws:kms:us-east-1:...",
    hcs_topic_id="0.0.12345"
)

# Decorator pattern
@pm.notarize(model_id="fraud_detection_v2")
def predict(data):
    return model.predict(data)

# Manual notarization
result = model.predict(data)
receipt = pm.notarize_sync(
    input_data=data,
    output_data=result,
    model_id="fraud_detection_v2"
)`;

const nodeInstall = `npm install @proofmind/sdk`;

const nodeQuickstart = `import { ProofMind } from '@proofmind/sdk';

const pm = new ProofMind({
  enterpriseId: 'ent_your_company',
  kmsKeyArn: 'arn:aws:kms:us-east-1:...',
  hcsTopicId: '0.0.12345'
});

// Wrapper pattern
const notarizedPredict = pm.wrap(model.predict, {
  modelId: 'fraud_detection_v2'
});

const result = await notarizedPredict(data);

// Manual notarization
const receipt = await pm.notarize({
  inputData: data,
  outputData: result,
  modelId: 'fraud_detection_v2'
});`;

const features = [
  { name: "Decorator/Wrapper Pattern", python: true, node: true },
  { name: "Manual Notarization", python: true, node: true },
  { name: "Batch Notarization", python: true, node: true },
  { name: "Async/Await Support", python: true, node: true },
  { name: "Shadow Mode (A/B Testing)", python: true, node: true },
  { name: "TypeScript Types", python: false, node: true },
  { name: "Type Hints", python: true, node: false },
  { name: "Streaming Support", python: true, node: true },
  { name: "Model Registry", python: true, node: true },
  { name: "Custom Context", python: true, node: true },
  { name: "PII Scrubbing", python: true, node: true },
];

const SDK = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24">
        {/* Hero */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          <div className="container px-6 relative">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="outline" className="mb-4 border-primary/50 text-primary">
                v2.1.4 — Latest Release
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                ProofMind{' '}
                <span className="text-gradient">SDKs</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Official client libraries for Python and Node.js. Add immutable audit trails 
                to any AI pipeline with a single line of code.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/docs/sdk/python">
                  <Button size="lg" className="gap-2">
                    <Code2 className="w-4 h-4" />
                    Python Docs
                  </Button>
                </Link>
                <Link to="/docs/sdk/nodejs">
                  <Button size="lg" variant="outline" className="gap-2">
                    <Code2 className="w-4 h-4" />
                    Node.js Docs
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Side by Side Install */}
        <section className="py-16 bg-secondary/30">
          <div className="container px-6">
            <h2 className="text-2xl font-bold text-center mb-12">Install in Seconds</h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">Py</span>
                  </div>
                  <span className="font-semibold">Python</span>
                  <Badge variant="secondary" className="ml-auto">3.8+</Badge>
                </div>
                <CodeBlock code={pythonInstall} language="bash" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-accent">JS</span>
                  </div>
                  <span className="font-semibold">Node.js</span>
                  <Badge variant="secondary" className="ml-auto">18+</Badge>
                </div>
                <CodeBlock code={nodeInstall} language="bash" />
              </div>
            </div>
          </div>
        </section>

        {/* Side by Side Quickstart */}
        <section className="py-16">
          <div className="container px-6">
            <h2 className="text-2xl font-bold text-center mb-4">Quick Start Examples</h2>
            <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
              Both SDKs follow the same patterns — decorator/wrapper for automatic notarization, 
              or manual calls for fine-grained control.
            </p>
            <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">Py</span>
                  </div>
                  <span className="font-semibold">Python SDK</span>
                </div>
                <CodeBlock code={pythonQuickstart} language="python" filename="example.py" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-accent">JS</span>
                  </div>
                  <span className="font-semibold">Node.js SDK</span>
                </div>
                <CodeBlock code={nodeQuickstart} language="javascript" filename="example.js" />
              </div>
            </div>
          </div>
        </section>

        {/* Feature Comparison */}
        <section className="py-16 bg-secondary/30">
          <div className="container px-6">
            <h2 className="text-2xl font-bold text-center mb-12">Feature Comparison</h2>
            <div className="max-w-3xl mx-auto">
              <div className="rounded-xl border border-border overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-secondary/50">
                      <th className="text-left p-4 font-semibold">Feature</th>
                      <th className="text-center p-4 font-semibold">Python</th>
                      <th className="text-center p-4 font-semibold">Node.js</th>
                    </tr>
                  </thead>
                  <tbody>
                    {features.map((feature, index) => (
                      <tr key={feature.name} className={index % 2 === 0 ? "bg-background" : "bg-secondary/20"}>
                        <td className="p-4 text-sm">{feature.name}</td>
                        <td className="p-4 text-center">
                          {feature.python ? (
                            <Check className="w-5 h-5 text-primary mx-auto" />
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          {feature.node ? (
                            <Check className="w-5 h-5 text-accent mx-auto" />
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Key Benefits */}
        <section className="py-16">
          <div className="container px-6">
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="p-6 rounded-xl bg-gradient-card border border-border">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Sub-10ms Overhead</h3>
                <p className="text-sm text-muted-foreground">
                  Hash computation and queue dispatch happen in milliseconds. HCS submission is async.
                </p>
              </div>
              <div className="p-6 rounded-xl bg-gradient-card border border-border">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Zero Data Exposure</h3>
                <p className="text-sm text-muted-foreground">
                  Only SHA-256 hashes leave your infrastructure. Original data stays with you.
                </p>
              </div>
              <div className="p-6 rounded-xl bg-gradient-card border border-border">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Code2 className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Drop-In Integration</h3>
                <p className="text-sm text-muted-foreground">
                  No pipeline restructuring. Wrap existing inference functions with one decorator.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SDK Modes */}
        <section className="py-16 bg-secondary/20">
          <div className="container px-6">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl font-bold mb-2 text-center">SDK Modes</h2>
              <p className="text-muted-foreground text-center mb-10 text-sm">
                Three submission modes cover every production scenario — from high-volume async pipelines to pre-production A/B testing.
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    mode: 'async',
                    label: 'Async (Default)',
                    color: 'border-primary/30 bg-primary/5',
                    badge: 'text-primary border-primary/30',
                    desc: 'HCS submission happens in a background queue. Inference result returns immediately. Adds <10ms to any call. Default for production.',
                    use: 'High-volume production inference',
                    code: `pm = ProofMind(
    enterprise_id="ent_acme",
    kms_key_arn="...",
    hcs_topic_id="0.0.12345",
    mode="async",  # default
)`,
                  },
                  {
                    mode: 'sync',
                    label: 'Sync',
                    color: 'border-amber-500/20 bg-amber-500/5',
                    badge: 'text-amber-600 border-amber-500/30',
                    desc: 'Waits for HCS confirmation before returning. Adds 2–5 seconds. Only for low-volume decisions where confirmation is legally required before responding.',
                    use: 'Medical denials, high-value financial decisions',
                    code: `pm = ProofMind(
    enterprise_id="ent_acme",
    kms_key_arn="...",
    hcs_topic_id="0.0.12345",
    mode="sync",  # blocks until anchored
)`,
                  },
                  {
                    mode: 'shadow',
                    label: 'Shadow',
                    color: 'border-purple-500/20 bg-purple-500/5',
                    badge: 'text-purple-600 border-purple-500/30',
                    desc: 'Notarizations submitted to HCS but flagged SHADOW — excluded from compliance reports and regulatory metrics. Use to A/B test a new model in production traffic before going live.',
                    use: 'Pre-production A/B testing, integration validation',
                    code: `pm = ProofMind(
    enterprise_id="ent_acme",
    kms_key_arn="...",
    hcs_topic_id="0.0.12345",
    mode="shadow",  # no compliance trail
)`,
                  },
                ].map(m => (
                  <div key={m.mode} className={`rounded-xl border p-5 ${m.color}`}>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline" className={`font-mono text-xs ${m.badge}`}>{`mode="${m.mode}"`}</Badge>
                      <span className="text-sm font-semibold">{m.label}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{m.desc}</p>
                    <p className="text-[11px] text-muted-foreground mb-3"><strong>Use for:</strong> {m.use}</p>
                    <pre className="text-[10px] font-mono bg-background/60 rounded-lg p-3 text-muted-foreground leading-relaxed overflow-x-auto">{m.code}</pre>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-secondary/30">
          <div className="container px-6">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-muted-foreground mb-8">
                Follow our quickstart guide and have your first AI decision notarized in under 5 minutes.
              </p>
              <Link to="/docs/quickstart/install">
                <Button size="lg" className="gap-2">
                  Start Building <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default SDK;
