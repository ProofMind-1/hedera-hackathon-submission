import { useEffect } from "react";
import { Link } from "react-router-dom";
import Lenis from "lenis";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteCtaSection } from "@/components/SiteCtaSection";

const GS: React.CSSProperties = { fontFamily: "'Google Sans', sans-serif" };

const PAIN_POINTS = [
  {
    icon: "policy",
    stat: "Aug 2026",
    label: "EU AI Act high-risk obligations become enforceable",
    detail:
      "High-risk AI systems — hiring tools, credit scoring, critical infrastructure, biometric categorization — must have complete, verifiable audit trails in place before August 2026 or face fines up to €30M or 6% of global turnover.",
  },
  {
    icon: "inventory",
    stat: "43%",
    label: "of enterprises have no AI system inventory, let alone audit trails",
    detail:
      "EU AI Act requires a complete register of all high-risk AI systems with documentation of their training data, intended purpose, and ongoing monitoring. Most enterprises don't know what AI is running in production.",
  },
  {
    icon: "manage_accounts",
    stat: "€30M",
    label: "maximum fine per infringement under EU AI Act Articles 71-73",
    detail:
      "Unlike GDPR where a first offense might attract a warning, the EU AI Act enforcement framework allows maximum fines from day one of the obligations period. Article 72 defines a strict liability regime.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Build your AI system inventory",
    body: "Register every high-risk AI system in the ProofMind Model Registry. Each system gets a cryptographic identity on Hedera — creating the immutable system inventory Article 51 requires, with timestamps that prove when compliance began.",
  },
  {
    n: "02",
    title: "Automate documentation",
    body: "EU AI Act requires technical documentation covering system purpose, training data characteristics, accuracy metrics, and human oversight mechanisms. ProofMind captures all of this automatically at each model deployment and update.",
  },
  {
    n: "03",
    title: "Continuous bias and anomaly monitoring",
    body: "Article 9 requires ongoing monitoring for risks including bias, accuracy degradation, and unexpected behavior. ProofMind's nine anomaly classes run continuously — generating the monitoring evidence the regulation requires.",
  },
  {
    n: "04",
    title: "Generate compliance reports instantly",
    body: "Monthly compliance reports are generated automatically and signed to Hedera — ready for the national market surveillance authority when they come knocking. No manual compilation from disparate systems.",
  },
];

const REGS = [
  {
    code: "EU AI Act Art. 9",
    name: "Risk Management",
    desc: "Continuous risk monitoring across all high-risk AI systems with tamper-proof evidence of anomaly detection and response — satisfying the ongoing risk management obligation.",
    color: "#4F46E5",
  },
  {
    code: "EU AI Act Art. 11",
    name: "Technical Documentation",
    desc: "Automated technical documentation generated at every model deployment, capturing the 15 mandatory data points Article 11 specifies — immutably anchored on-chain.",
    color: "#818CF8",
  },
  {
    code: "EU AI Act Art. 13",
    name: "Transparency",
    desc: "Cryptographic proof of every AI system output — enabling operators and users to understand AI decision-making as the transparency mandate requires.",
    color: "#6366F1",
  },
  {
    code: "EU AI Act Art. 14",
    name: "Human Oversight",
    desc: "Every human override recorded alongside the AI recommendation — providing the documented human oversight metrics national authorities will audit.",
    color: "#4F46E5",
  },
  {
    code: "EU AI Act Art. 17",
    name: "Quality Management",
    desc: "Signed quality management records including testing, validation, and post-market monitoring — all anchored to Hedera with dual KMS signatures.",
    color: "#818CF8",
  },
  {
    code: "EU AI Act Art. 62",
    name: "Incident Reporting",
    desc: "Serious incident detection and on-chain recording — creating the evidence trail that EASA, EBA, and national competent authorities require for incident investigations.",
    color: "#6366F1",
  },
];

export default function EnterpriseCompliance() {
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
            <span className="material-symbols-outlined text-[16px] text-[#4F46E5]">corporate_fare</span>
            <span className="text-xs text-[#4F46E5] font-medium tracking-wide uppercase">Enterprise Compliance</span>
          </div>
          <h1
            className="text-5xl md:text-6xl text-[#202124] mb-6"
            style={{ fontWeight: 300, lineHeight: 1.1, letterSpacing: "-0.03em" }}
          >
            EU AI Act compliance —{" "}
            <span
              style={{
                backgroundImage: "linear-gradient(135deg, #4F46E5 0%, #818CF8 50%, #6366F1 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              built in
            </span>
          </h1>
          <p className="text-lg text-[#45474D] font-light max-w-xl mx-auto leading-relaxed mb-10">
            Automated audit trails, bias monitoring, and compliance reports for every high-risk AI system.
            Permanent Hedera retention. Enforcement-ready before August 2026.
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
              to="/docs/compliance/eu-ai-act"
              className="border border-black/[0.12] text-[#202124] text-sm px-6 py-3 rounded-full hover:bg-black/[0.04] transition-colors"
            >
              Read EU AI Act guide
            </Link>
          </div>

          {/* compliance badges */}
          <div className="mt-12 flex flex-wrap justify-center gap-2">
            {["EU AI Act", "GDPR", "ISO 42001", "ISO 27001", "SOC 2 Type II", "UK AI Principles"].map((r) => (
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
            The EU AI Act clock is running.
            <br />Most enterprises aren't ready.
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {PAIN_POINTS.map((p) => (
              <div key={p.stat} className="bg-white rounded-3xl p-8 border border-black/[0.06]">
                <span className="material-symbols-outlined text-[28px] text-[#4F46E5] mb-4 block">{p.icon}</span>
                <p
                  className="text-4xl text-[#202124] mb-2"
                  style={{ fontWeight: 300, letterSpacing: "-0.03em" }}
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
            From zero to EU AI Act compliant
            <br />in one afternoon
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
            EU AI Act Article 11 documentation —
            <br />generated automatically
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
  "timestamp_utc":   "2025-09-14T11:14:09.227Z",
  "jurisdiction":    "EU",
  "regulation_profile": ["EU-AI-Act", "GDPR", "ISO-42001"],

  "model": {
    "id":               "hr-screening-v2.1.0",
    "risk_class":       "high_risk",       // Art. 6 Annex III #4
    "hash":             "sha256:c7e2…b841",
    "intended_purpose": "cv_screening",
    "training_data_hash": "sha256:3a9f…d204",
    "bias_metrics": {
      "gender_disparity":     0.03,        // below 5% threshold
      "age_disparity":        0.01,
      "last_evaluated_utc":   "2025-09-14"
    },
    "human_oversight_rate": 1.0,           // all decisions reviewed
    "deployer_sig": "0x1d4c…8f30"
  },

  "inference": {
    "input_hash":     "sha256:8b1a…c723",
    "output_hash":    "sha256:2d9e…f015",
    "decision":       "SHORTLISTED",
    "human_review":   true,
    "reviewer_id":    "sha256:5e7a…b392"  // anonymised
  },

  "anchor": {
    "ledger":       "hedera-mainnet",
    "topic_id":     "0.0.5920341",
    "consensus_ts": "1726312449.227000000",
    "dual_kms_sig": "verified",
    "retention_until": "2035-09-14"       // Art. 12 — 10 year minimum
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
            Every EU AI Act article that
            <br />touches your AI systems
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
