import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Package, AlertTriangle, Sparkles, Bug, Wrench } from "lucide-react";

interface ChangelogEntry {
  version: string;
  date: string;
  type: "major" | "minor" | "patch";
  breaking?: boolean;
  changes: {
    type: "feature" | "fix" | "breaking" | "improvement";
    description: string;
  }[];
}

const changelog: ChangelogEntry[] = [
  {
    version: "2.1.4",
    date: "2026-03-01",
    type: "patch",
    changes: [
      { type: "fix", description: "Fixed ECDSA_SHA_256 signature verification edge case on ARM-based Lambda deployments" },
      { type: "fix", description: "Resolved HCS retry loop not honouring max-attempts config on network timeout" },
      { type: "improvement", description: "Shadow mode notarizations now include shadow_batch_id for easier A/B attribution" },
      { type: "improvement", description: "Audit Agent NL query response time reduced by 22% via Supabase index optimisation" },
    ],
  },
  {
    version: "2.1.0",
    date: "2026-01-15",
    type: "minor",
    changes: [
      { type: "feature", description: "Multi-environment support — separate HCS topics for dev/staging/prod with automatic tagging" },
      { type: "feature", description: "SHADOW model lifecycle state — A/B test models without creating regulatory trail" },
      { type: "feature", description: "frameworkHash field in model registration — hash of requirements.txt / conda env for full supply-chain auditability" },
      { type: "feature", description: "authorizedSensitivityLevels enforced at SDK level — models can restrict to high/medium/low" },
      { type: "improvement", description: "Batch Merkle tree now includes individual proof paths — verifiers can prove single record in batch without full batch data" },
    ],
  },
  {
    version: "2.0.0",
    date: "2025-09-01",
    type: "major",
    breaking: true,
    changes: [
      { type: "breaking", description: "Schema upgraded to v2.0 — adds schemaVersion, sensitivityLevel, modelRegistryRef, cloudTrailEventId fields to notarization record" },
      { type: "breaking", description: "KMS dual-sign now enforced for all ACTIVE model registrations (was optional in v1.x)" },
      { type: "feature", description: "Dual-hash mode for sensitivity=critical — SHA-256 + SHA-3-256 both required for VERIFIED result" },
      { type: "feature", description: "BATCH_WITHOUT_CONSENT anomaly class added — detects unplanned bulk processing in consent-required contexts" },
      { type: "feature", description: "SDK open source release hashes now anchored to Hedera HCS at each release (0.0.99999)" },
      { type: "improvement", description: "Async queue uses Redis in production; SQLite fallback for single-instance deployments" },
    ],
  },
  {
    version: "1.4.0",
    date: "2025-01-08",
    type: "minor",
    changes: [
      { type: "feature", description: "Added streaming support for real-time AI inference notarization" },
      { type: "feature", description: "New `pm.stream()` method for LLM streaming responses" },
      { type: "improvement", description: "Reduced hash computation overhead by 40%" },
      { type: "fix", description: "Fixed race condition in batch notarization queue" },
    ],
  },
  {
    version: "1.3.2",
    date: "2024-12-15",
    type: "patch",
    changes: [
      { type: "fix", description: "Fixed TypeScript type definitions for NotarizationReceipt" },
      { type: "fix", description: "Resolved memory leak in long-running processes" },
      { type: "improvement", description: "Better error messages for KMS authentication failures" },
    ],
  },
  {
    version: "1.3.0",
    date: "2024-11-20",
    type: "minor",
    changes: [
      { type: "feature", description: "Model Registry support — register and version AI models" },
      { type: "feature", description: "Added `pm.register_model()` for Python, `pm.registerModel()` for Node.js" },
      { type: "feature", description: "Automatic model version detection from metadata" },
      { type: "improvement", description: "HCS submission retries with exponential backoff" },
    ],
  },
  {
    version: "1.2.0",
    date: "2024-10-05",
    type: "minor",
    breaking: true,
    changes: [
      { type: "breaking", description: "Renamed `enterprise_key` to `enterprise_id` for consistency" },
      { type: "feature", description: "Batch notarization — notarize up to 1000 decisions in a single call" },
      { type: "feature", description: "PII scrubbing hooks — automatically sanitize sensitive data before hashing" },
      { type: "improvement", description: "Node.js SDK now fully supports ESM and CommonJS" },
    ],
  },
  {
    version: "1.1.0",
    date: "2024-08-18",
    type: "minor",
    changes: [
      { type: "feature", description: "Async notarization with `pm.notarize_async()` / `pm.notarizeAsync()`" },
      { type: "feature", description: "Custom context fields for regulatory metadata" },
      { type: "improvement", description: "Improved SDK initialization with automatic HCS topic validation" },
    ],
  },
  {
    version: "1.0.0",
    date: "2024-07-01",
    type: "major",
    changes: [
      { type: "feature", description: "Initial stable release" },
      { type: "feature", description: "Python decorator pattern with `@pm.notarize()`" },
      { type: "feature", description: "Node.js wrapper pattern with `pm.wrap()`" },
      { type: "feature", description: "Manual notarization methods for both SDKs" },
      { type: "feature", description: "AWS KMS integration for cryptographic signing" },
      { type: "feature", description: "Hedera HCS anchoring with consensus timestamps" },
    ],
  },
];

const getChangeIcon = (type: string) => {
  switch (type) {
    case "feature":
      return <Sparkles className="w-4 h-4 text-primary" />;
    case "fix":
      return <Bug className="w-4 h-4 text-accent" />;
    case "breaking":
      return <AlertTriangle className="w-4 h-4 text-destructive" />;
    case "improvement":
      return <Wrench className="w-4 h-4 text-muted-foreground" />;
    default:
      return <Package className="w-4 h-4" />;
  }
};

const getVersionBadge = (type: string, breaking?: boolean) => {
  if (breaking) {
    return <Badge variant="destructive">Breaking</Badge>;
  }
  switch (type) {
    case "major":
      return <Badge className="bg-primary">Major</Badge>;
    case "minor":
      return <Badge variant="secondary">Minor</Badge>;
    case "patch":
      return <Badge variant="outline">Patch</Badge>;
    default:
      return null;
  }
};

const Changelog = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24">
        {/* Hero */}
        <section className="py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          <div className="container px-6 relative">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="text-gradient">Changelog</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Track every update, feature, and fix across ProofMind SDKs.
              </p>
            </div>
          </div>
        </section>

        {/* Changelog entries */}
        <section className="py-12">
          <div className="container px-6">
            <div className="max-w-3xl mx-auto">
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />

                {changelog.map((entry, index) => (
                  <div key={entry.version} className="relative pl-16 pb-12 last:pb-0">
                    {/* Timeline dot */}
                    <div className="absolute left-4 top-1 w-5 h-5 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>

                    {/* Version header */}
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <h2 className="text-2xl font-bold font-mono">v{entry.version}</h2>
                      {getVersionBadge(entry.type, entry.breaking)}
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <CalendarDays className="w-4 h-4" />
                        {entry.date}
                      </div>
                    </div>

                    {/* Changes list */}
                    <div className="space-y-3">
                      {entry.changes.map((change, changeIndex) => (
                        <div
                          key={changeIndex}
                          className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 border border-border"
                        >
                          {getChangeIcon(change.type)}
                          <span className="text-sm">{change.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Changelog;
