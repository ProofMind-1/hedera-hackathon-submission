import { useEffect } from "react";
import { Link } from "react-router-dom";
import Lenis from "lenis";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteCtaSection } from "@/components/SiteCtaSection";

const GS: React.CSSProperties = { fontFamily: "'Google Sans', sans-serif" };

const PAIN_POINTS = [
  {
    icon: "health_and_safety",
    stat: "87%",
    label: "of FDA SaMD audits require records that most hospitals cannot produce",
    detail:
      "Software as a Medical Device guidelines require complete decision trails for diagnostic AI. Internal logs are routinely deemed insufficient because they lack independent verification.",
  },
  {
    icon: "privacy_tip",
    stat: "$9.8B",
    label: "in HIPAA penalties since 2020 — many tied to AI data handling",
    detail:
      "Patient data processed by diagnostic models must never leave secure infrastructure. Yet audit requirements demand verifiable records. Most solutions sacrifice one for the other.",
  },
  {
    icon: "emergency",
    stat: "34 mo",
    label: "typical FDA de novo pathway when AI audit evidence is incomplete",
    detail:
      "Incomplete audit trails during 510(k) or de novo submissions force iterative back-and-forth with FDA reviewers — extending timelines and delaying patient access to beneficial AI tools.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Zero-data-egress notarization",
    body: "Patient inputs are SHA-256 hashed client-side inside your HIPAA-secure environment. Only the hash leaves your infrastructure — ProofMind and Hedera never see PHI. HIPAA §164.312 data integrity requirements satisfied by design.",
  },
  {
    n: "02",
    title: "FDA SaMD compliance profile",
    body: "ProofMind's pre-built SaMD profile captures the specific data points FDA requires: model version, clinical indication, prediction confidence, human oversight flag, and adverse event linkage — all anchored immutably.",
  },
  {
    n: "03",
    title: "Human oversight tracking",
    body: "Every AI recommendation where a clinician overrides the model is recorded. EU AI Act Article 14 requires demonstrable human oversight for high-risk medical AI. ProofMind makes that evidence automatic.",
  },
  {
    n: "04",
    title: "Regulator-direct access",
    body: "FDA, EMA, and NHS Digital auditors can query the Audit Agent directly. Natural language questions return cryptographically verified answers — no hospital IT team involved in the audit process.",
  },
];

const REGS = [
  {
    code: "HIPAA §164.312",
    name: "Data Integrity",
    desc: "Electronic PHI integrity controls satisfied without exposing patient data — only cryptographic hashes leave your secure environment.",
    color: "#4F46E5",
  },
  {
    code: "FDA SaMD",
    name: "Software as Medical Device",
    desc: "Pre-built compliance profile captures every data point FDA 510(k) and de novo submissions require for AI/ML-based medical devices.",
    color: "#818CF8",
  },
  {
    code: "EU AI Act Art. 13",
    name: "Transparency",
    desc: "Immutable logs of every AI recommendation, confidence score, and clinical context satisfy the EU's high-risk AI transparency mandate.",
    color: "#6366F1",
  },
  {
    code: "EU AI Act Art. 14",
    name: "Human Oversight",
    desc: "Every clinician override is recorded alongside the AI recommendation — providing the documented human oversight trail regulators require.",
    color: "#4F46E5",
  },
  {
    code: "ISO 14971",
    name: "Risk Management",
    desc: "Continuous anomaly monitoring across 9 risk classes keeps your post-market surveillance obligations satisfied automatically.",
    color: "#818CF8",
  },
  {
    code: "GDPR Art. 22",
    name: "Automated Decisions",
    desc: "Data subject rights around automated medical decisions are documented on-chain — providing a transparent, auditable record of every AI-driven clinical recommendation.",
    color: "#6366F1",
  },
];

export default function Healthcare() {
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
            <span className="material-symbols-outlined text-[16px] text-[#4F46E5]">ecg_heart</span>
            <span className="text-xs text-[#4F46E5] font-medium tracking-wide uppercase">Healthcare AI</span>
          </div>
          <h1
            className="text-5xl md:text-6xl text-[#202124] mb-6"
            style={{ fontWeight: 300, lineHeight: 1.1, letterSpacing: "-0.03em" }}
          >
            HIPAA-safe audits for{" "}
            <span
              style={{
                backgroundImage: "linear-gradient(135deg, #4F46E5 0%, #818CF8 50%, #6366F1 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              diagnostic AI
            </span>
          </h1>
          <p className="text-lg text-[#45474D] font-light max-w-xl mx-auto leading-relaxed mb-10">
            Patient data never leaves your infrastructure. Only cryptographic proofs
            anchor to Hedera — satisfying FDA SaMD and EU AI Act requirements simultaneously.
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
            {["HIPAA §164.312", "FDA SaMD", "EU AI Act", "ISO 14971", "GDPR Art. 22", "NHS DTAC"].map((r) => (
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
            Healthcare AI faces an impossible audit requirement.
            <br />Until now.
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
            Privacy-preserving by architecture,
            <br />not by policy
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
            Every diagnostic recommendation —
            <br />zero patient data exposed
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
  "timestamp_utc":   "2025-09-14T14:07:22.441Z",
  "jurisdiction":    "EU",
  "regulation_profile": ["FDA-SaMD", "HIPAA-164312", "EU-AI-Act"],

  "model": {
    "id":      "radiology-classifier-v1.4.0",
    "hash":    "sha256:b3d7…e918",
    "status":  "clinically_validated",
    "clinical_indication": "chest_xray_triage",
    "deployer_sig": "0x8c2a…f74e"
  },

  "inference": {
    "input_hash":     "sha256:4f2b…a301",  // ← hash only, no PHI
    "output_hash":    "sha256:9e3c…d582",
    "recommendation": "PRIORITY_REVIEW",
    "confidence":     0.91,
    "human_override": false,
    "latency_ms":     847
  },

  "anchor": {
    "ledger":       "hedera-mainnet",
    "topic_id":     "0.0.5102847",
    "consensus_ts": "1726323642.441000000",
    "dual_kms_sig": "verified"
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
            Every healthcare AI regulation,
            <br />addressed by architecture
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
