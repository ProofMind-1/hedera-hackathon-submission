import { useEffect } from "react";
import { Link } from "react-router-dom";
import Lenis from "lenis";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteCtaSection } from "@/components/SiteCtaSection";

const GS: React.CSSProperties = { fontFamily: "'Google Sans', sans-serif" };

const PAIN_POINTS = [
  {
    icon: "gavel",
    stat: "72%",
    label: "of financial AI deployments have no verifiable audit trail",
    detail:
      "SEC Rule 17a-4 requires firms to preserve all business communications including AI-generated decisions. Most banks still rely on internal logs that regulators cannot independently verify.",
  },
  {
    icon: "policy",
    stat: "$2.4B",
    label: "in fines for model risk management failures since 2020",
    detail:
      "SR 11-7 requires model validation, documentation, and ongoing monitoring. Without immutable records, restatements and enforcement actions follow every major model update.",
  },
  {
    icon: "speed",
    stat: "18 mo",
    label: "average time to resolve a regulatory inquiry without audit infrastructure",
    detail:
      "Manual log reconstruction from scattered databases delays responses to FINRA, OCC, and SEC examination requests by months — creating reputational and legal exposure.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Register your models",
    body: "Every loan approval, fraud detection, or trade routing model gets a cryptographic identity on Hedera. Dual KMS signing (enterprise + ProofMind keys) means no single party can retroactively alter records.",
  },
  {
    n: "02",
    title: "Wrap inference with one decorator",
    body: "Add @proofmind.notarize to any Python or Node inference call. Input hashes, output hashes, model version, timestamp, and jurisdiction context are captured without any raw data leaving your infrastructure.",
  },
  {
    n: "03",
    title: "Anomalies surface in real time",
    body: "Volume spikes, outcome distribution shifts, revoked model reactivation, and jurisdiction violations trigger automated alerts. Your risk team sees the issue before the regulator does.",
  },
  {
    n: "04",
    title: "Regulators query directly",
    body: "SEC examiners access the on-chain Audit Agent via natural language. Every response is itself anchored to HCS — no ProofMind or bank employee mediates the query.",
  },
];

const REGS = [
  {
    code: "SEC 17a-4",
    name: "Books & Records",
    desc: "Immutable WORM-equivalent storage on Hedera. Every AI decision preserved with cryptographic integrity for the required retention period.",
    color: "#4F46E5",
  },
  {
    code: "SR 11-7",
    name: "Model Risk Management",
    desc: "Full model lineage — registration, validation, deployment, and retirement — anchored on-chain with dual KMS signatures enforcing governance gates.",
    color: "#818CF8",
  },
  {
    code: "FINRA 4370",
    name: "Business Continuity",
    desc: "Hedera HCS provides geo-redundant, third-party tamper-proof storage independent of your internal systems — accessible even if your infrastructure is unavailable.",
    color: "#6366F1",
  },
  {
    code: "MiFID II",
    name: "Best Execution",
    desc: "Every algorithmic trading decision recorded with nanosecond timestamps and full context. Regulators can reconstruct any execution path years after the fact.",
    color: "#4F46E5",
  },
  {
    code: "Basel IV",
    name: "Model Validation",
    desc: "Independent model performance audit trails that satisfy both internal validation teams and external supervisors without duplicating infrastructure.",
    color: "#818CF8",
  },
  {
    code: "DORA",
    name: "Digital Operational Resilience",
    desc: "AI system audit records stored on a decentralized network that satisfies DORA's third-party risk and operational continuity requirements.",
    color: "#6366F1",
  },
];

export default function FinancialServices() {
  useEffect(() => {
    window.scrollTo(0, 0);
    const lenis = new Lenis();
    const raf = (time: number) => { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  return (
    <div className="min-h-screen bg-white" style={GS}>
      <SiteHeader />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="pt-36 pb-24 px-6 text-center relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(79,70,229,0.07), transparent 65%)",
          }}
        />
        <div className="relative max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 border border-[#4F46E5]/20 bg-[#EEF2FF] rounded-full px-4 py-1.5 mb-8">
            <span className="material-symbols-outlined text-[16px] text-[#4F46E5]">account_balance</span>
            <span className="text-xs text-[#4F46E5] font-medium tracking-wide uppercase">Financial Services</span>
          </div>
          <h1
            className="text-5xl md:text-6xl text-[#202124] mb-6"
            style={{ fontWeight: 300, lineHeight: 1.1, letterSpacing: "-0.03em" }}
          >
            Audit infrastructure for{" "}
            <span
              style={{
                backgroundImage: "linear-gradient(135deg, #4F46E5 0%, #818CF8 50%, #6366F1 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              financial AI
            </span>
          </h1>
          <p className="text-lg text-[#45474D] font-light max-w-xl mx-auto leading-relaxed mb-10">
            SEC-compliant, immutable audit trails for every loan approval, fraud
            detection signal, and investment decision — without restructuring your pipeline.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/docs/quickstart/install"
              className="bg-[#4F46E5] text-white text-sm px-6 py-3 rounded-full hover:bg-[#4338CA] transition-colors inline-flex items-center gap-2"
            >
              Get started
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
            <Link
              to="/playground"
              className="border border-black/[0.12] text-[#202124] text-sm px-6 py-3 rounded-full hover:bg-black/[0.04] transition-colors"
            >
              Try playground
            </Link>
          </div>

          {/* compliance badges */}
          <div className="mt-12 flex flex-wrap justify-center gap-2">
            {["SEC 17a-4", "SR 11-7", "MiFID II", "FINRA 4370", "Basel IV", "DORA"].map((r) => (
              <span
                key={r}
                className="text-xs text-[#45474D] border border-black/[0.1] rounded-full px-3 py-1"
              >
                {r}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── The Problem ──────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-[#FAFAFA]">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-medium tracking-widest text-[#4F46E5] uppercase mb-4">The problem</p>
          <h2
            className="text-4xl text-[#202124] mb-16"
            style={{ fontWeight: 300, letterSpacing: "-0.02em" }}
          >
            Financial AI is moving fast.
            <br />Compliance infrastructure is not.
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {PAIN_POINTS.map((p) => (
              <div key={p.stat} className="bg-white rounded-3xl p-8 border border-black/[0.06]">
                <span className="material-symbols-outlined text-[28px] text-[#4F46E5] mb-4 block">{p.icon}</span>
                <p
                  className="text-5xl text-[#202124] mb-2"
                  style={{ fontWeight: 300, letterSpacing: "-0.04em" }}
                >
                  {p.stat}
                </p>
                <p className="text-sm font-medium text-[#202124] mb-3">{p.label}</p>
                <p className="text-sm text-[#45474D] font-light leading-relaxed">{p.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-medium tracking-widest text-[#4F46E5] uppercase mb-4">How ProofMind works</p>
          <h2
            className="text-4xl text-[#202124] mb-16"
            style={{ fontWeight: 300, letterSpacing: "-0.02em" }}
          >
            Four steps to SEC-grade auditability
          </h2>
          <div className="space-y-6">
            {STEPS.map((s) => (
              <div
                key={s.n}
                className="flex gap-8 p-8 rounded-3xl border border-black/[0.06] hover:border-[#4F46E5]/20 hover:bg-[#EEF2FF]/30 transition-all duration-200"
              >
                <span
                  className="text-4xl text-[#4F46E5]/20 flex-shrink-0 w-16"
                  style={{ fontWeight: 300, letterSpacing: "-0.04em" }}
                >
                  {s.n}
                </span>
                <div>
                  <h3 className="text-lg font-medium text-[#202124] mb-2">{s.title}</h3>
                  <p className="text-[#45474D] font-light leading-relaxed">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Code card ────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-[#0f0a2a]">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-medium tracking-widest text-[#818CF8] uppercase mb-4">What gets recorded</p>
          <h2
            className="text-4xl text-white mb-12"
            style={{ fontWeight: 300, letterSpacing: "-0.02em" }}
          >
            Every loan decision leaves
            <br />an immutable proof
          </h2>
          <div className="rounded-3xl overflow-hidden border border-white/10">
            <div className="flex items-center gap-2 px-6 py-4 border-b border-white/10 bg-white/5">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
              <span className="ml-4 text-xs text-white/40 font-mono">notarization-receipt.json</span>
            </div>
            <pre
              className="p-8 text-sm leading-relaxed overflow-x-auto"
              style={{ fontFamily: "'JetBrains Mono', monospace", color: "#a5b4fc" }}
            >
{`{
  "receipt_version": "2.1.0",
  "timestamp_utc":   "2025-09-14T09:23:41.882Z",
  "jurisdiction":    "US",
  "regulation_profile": ["SEC-17a4", "SR-11-7"],

  "model": {
    "id":      "loan-approval-v3.2.1",
    "hash":    "sha256:9f4a…c821",
    "status":  "validated",
    "deployer_sig": "0x3f7b…a92d"
  },

  "inference": {
    "input_hash":  "sha256:2b8c…f034",
    "output_hash": "sha256:7e1a…b209",
    "decision":    "APPROVED",
    "confidence":  0.94,
    "latency_ms":  312
  },

  "anchor": {
    "ledger":           "hedera-testnet",
    "topic_id":         "0.0.4820193",
    "consensus_ts":     "1726306621.882000000",
    "tx_id":            "0.0.4558066@1726306621.882",
    "dual_kms_sig":     "verified"
  }
}`}
            </pre>
          </div>
        </div>
      </section>

      {/* ── Compliance coverage ──────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-[#FAFAFA]">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-medium tracking-widest text-[#4F46E5] uppercase mb-4">Compliance coverage</p>
          <h2
            className="text-4xl text-[#202124] mb-16"
            style={{ fontWeight: 300, letterSpacing: "-0.02em" }}
          >
            Every major financial AI regulation,
            <br />pre-configured
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {REGS.map((r) => (
              <div
                key={r.code}
                className="bg-white rounded-3xl p-7 border border-black/[0.06] hover:shadow-md transition-shadow"
              >
                <div
                  className="inline-block text-xs font-mono font-semibold px-3 py-1 rounded-full mb-4"
                  style={{ background: `${r.color}15`, color: r.color }}
                >
                  {r.code}
                </div>
                <h3 className="text-base font-semibold text-[#202124] mb-2">{r.name}</h3>
                <p className="text-sm text-[#45474D] font-light leading-relaxed">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteCtaSection />

      <SiteFooter />
    </div>
  );
}
