/**
 * ProofMind — Landing Page
 * Google Antigravity template adapted for ProofMind
 *
 * Dependencies: gsap lenis (npm install gsap lenis)
 */

"use client";

import {
  useEffect,
  useRef,
  useState,
  useCallback,
  type FC,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useNavigate, Link } from "react-router-dom";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteCtaSection } from "@/components/SiteCtaSection";
import { LogoMark } from "@/components/LogoMark";

gsap.registerPlugin(ScrollTrigger);

// ─── Types ────────────────────────────────────────────────────────────────────

interface Feature {
  title: string;
  description: string;
  img: string;
}

interface UseCase {
  role: string;
  description: string;
  img: string;
  imgAlt: string;
  link: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const FEATURES: Feature[] = [
  {
    title: "One-line SDK Integration",
    description:
      "Wrap any AI inference with a single decorator. ProofMind handles hashing, KMS signing, and Hedera HCS anchoring automatically — without restructuring your pipeline or exposing any data.",
    img: "https://placehold.co/800x600/0f0a2a/818cf8?text=SDK+Integration",
  },
  {
    title: "Cryptographic Notarization",
    description:
      "Every inference is SHA-256 hashed client-side and anchored to Hedera HCS in under 3 seconds. The enterprise keeps all raw data. Only tamper-proof hash bundles leave your infrastructure.",
    img: "https://placehold.co/800x600/0f0a2a/818cf8?text=Notarization+Receipt",
  },
  {
    title: "Real-time Anomaly Detection",
    description:
      "Nine anomaly classes monitored continuously: unregistered models, volume spikes, outcome distribution shifts, revoked model reactivation, jurisdiction violations, and more.",
    img: "https://placehold.co/800x600/0f0a2a/818cf8?text=Anomaly+Detection",
  },
  {
    title: "Regulator-direct Verification",
    description:
      "Regulators query the blockchain directly — no enterprise employee mediating. Natural language queries answered by the on-chain Audit Agent. Every response is itself anchored to HCS.",
    img: "https://placehold.co/800x600/0f0a2a/818cf8?text=Regulator+Portal",
  },
  {
    title: "Compliance Profiles Built-in",
    description:
      "EU AI Act, SEC, HIPAA, and UK FCA compliance profiles pre-configured. The right data captured for each regulatory context automatically — retention periods, human oversight thresholds, and bias monitoring included.",
    img: "https://placehold.co/800x600/0f0a2a/818cf8?text=Compliance+Dashboard",
  },
];

const USE_CASES: UseCase[] = [
  {
    role: "Financial Services",
    description:
      "SEC-compliant audit trails for loan approvals, fraud detection, and investment decisions. Dual KMS signing enforces model governance before any model goes live.",
    img: "https://placehold.co/800x450/0f0a2a/818cf8?text=Financial+Services",
    imgAlt: "Financial services compliance dashboard",
    link: "/use-cases/financial-services",
  },
  {
    role: "Healthcare AI",
    description:
      "HIPAA-safe notarization of diagnostic AI recommendations. Patient data never leaves your infrastructure — only cryptographic proofs anchor to Hedera, satisfying FDA SaMD requirements.",
    img: "https://placehold.co/800x450/0f0a2a/818cf8?text=Healthcare+AI",
    imgAlt: "Healthcare AI compliance portal",
    link: "/use-cases/healthcare",
  },
  {
    role: "Enterprise Compliance",
    description:
      "EU AI Act high-risk system audit trails with permanent Hedera retention. Automated monthly compliance reports, bias monitoring, and human oversight compliance metrics — all signed and on-chain.",
    img: "https://placehold.co/800x450/0f0a2a/818cf8?text=Enterprise+Compliance",
    imgAlt: "Enterprise AI compliance overview",
    link: "/use-cases/enterprise",
  },
];

const ICONS = [
  "verified_user", "fingerprint", "policy", "gavel", "shield", "lock",
  "key", "receipt_long", "fact_check", "health_and_safety", "balance", "analytics",
  "data_object", "account_tree", "history", "monitoring", "hub", "link",
  "checklist", "security", "manage_accounts", "memory", "token", "cloud_done",
];

// ─── Hooks ────────────────────────────────────────────────────────────────────

function useTypewriter(text: string, isActive: boolean, speed = 40): string {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    if (!isActive) return;
    setDisplayed("");
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(timer);
    }, speed);
    return () => clearInterval(timer);
  }, [isActive, text, speed]);

  return displayed;
}

// ─── Canvas Particle Ring ─────────────────────────────────────────────────────

const ParticleRing: FC<{ mouseX: number; mouseY: number }> = ({ mouseX, mouseY }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const tickRef = useRef(0);
  const mxRef = useRef(mouseX);
  const myRef = useRef(mouseY);

  useEffect(() => {
    mxRef.current = mouseX;
    myRef.current = mouseY;
  }, [mouseX, mouseY]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * devicePixelRatio;
      canvas.height = canvas.offsetHeight * devicePixelRatio;
      ctx.scale(devicePixelRatio, devicePixelRatio);
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const PARTICLES = 90;
    const ROWS = 6;

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      const t = tickRef.current;
      const cx = (mxRef.current / 100) * w;
      const cy = (myRef.current / 100) * h;

      const baseRadius = 180 + Math.sin(t * 0.8) * 60;

      for (let r = 0; r < ROWS; r++) {
        const rowRadius = baseRadius + r * 18;
        for (let i = 0; i < PARTICLES; i++) {
          const angle = (i / PARTICLES) * Math.PI * 2 + t * 0.15;
          const x = cx + Math.cos(angle) * rowRadius;
          const y = cy + Math.sin(angle) * rowRadius;

          const alphaBase = 0.05 + (ROWS - r) / ROWS * 0.15;
          const alphaWave = Math.abs(Math.sin(t * 2 + i * 0.3)) * 0.4;
          const alpha = alphaBase + alphaWave;
          const size = 1 + (ROWS - r) * 0.25;

          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          // ProofMind indigo instead of Antigravity blue
          ctx.fillStyle = `rgba(79, 70, 229, ${alpha})`;
          ctx.fill();
        }
      }

      tickRef.current += 0.012;
      rafRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.7 }}
    />
  );
};

// ─── Hero Section ─────────────────────────────────────────────────────────────

const HeroSection: FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const [mouseX, setMouseX] = useState(50);
  const [mouseY, setMouseY] = useState(50);
  const navigate = useNavigate();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from([logoRef.current, headingRef.current, ctaRef.current], {
        y: 40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: "power3.out",
        delay: 0.2,
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMouseX(((e.clientX - rect.left) / rect.width) * 100);
    setMouseY(((e.clientY - rect.top) / rect.height) * 100);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMouseX(50);
    setMouseY(50);
  }, []);

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden pt-20"
    >
      <ParticleRing mouseX={mouseX} mouseY={mouseY} />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Logo mark + wordmark */}
        <div ref={logoRef} className="flex items-center gap-3">
          <LogoMark className="h-10 w-10" />
          <span
            className="text-[#202124] font-medium tracking-tight"
            style={{ fontFamily: "'Google Sans', sans-serif", fontSize: "clamp(1.5rem, 4vw, 2.5rem)" }}
          >
            ProofMind
          </span>
        </div>

        {/* Hero headline */}
        <p
          ref={headingRef}
          className="text-[#202124] font-medium leading-tight"
          style={{
            fontFamily: "'Google Sans', sans-serif",
            fontSize: "clamp(2.5rem, 7vw, 5rem)",
            fontWeight: 500,
          }}
        >
          Every AI decision.
          <span
            className="block"
            style={{
              background: "linear-gradient(135deg, #4F46E5 0%, #818CF8 50%, #6366F1 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Notarized. Permanent.
          </span>
          <span
            className="block text-[#45474D]"
            style={{ fontSize: "0.55em", fontWeight: 400, marginTop: "0.2em" }}
          >
            Immutable audit infrastructure for enterprise AI
          </span>
        </p>

        {/* CTA Buttons */}
        <div
          ref={ctaRef}
          className="flex flex-wrap items-center justify-center gap-3 mt-2"
        >
          <button
            onClick={() => navigate("/docs/quickstart/install")}
            className="flex items-center gap-2 bg-[#4F46E5] text-white rounded-full px-6 py-3.5 text-base hover:bg-[#4338CA] transition-colors duration-150"
            style={{ fontFamily: "'Google Sans', sans-serif" }}
          >
            Get started
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </button>
          <button
            onClick={() => navigate("/playground")}
            className="flex items-center gap-2 bg-[#B7BFD91A] text-[#202124] border border-black/[0.06] rounded-full px-6 py-3.5 text-base hover:bg-[#F0F1F5] transition-colors duration-150"
            style={{ fontFamily: "'Google Sans', sans-serif" }}
          >
            Playground
          </button>
        </div>

        {/* Social proof */}
        <p
          className="text-[#45474D] text-sm mt-2"
          style={{ fontFamily: "'Google Sans', sans-serif", fontWeight: 300 }}
        >
          EU AI Act · SEC · FDA SaMD · HIPAA · UK FCA
        </p>
      </div>
    </section>
  );
};

// ─── SDK Demo Section ─────────────────────────────────────────────────────────

const DemoCodeSection: FC = () => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".demo-card", {
        scale: 0.92,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 85%" },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  const codeLines = [
    { t: "comment", v: "# Wrap any AI inference — one decorator, zero data exposure" },
    { t: "blank", v: "" },
    { t: "code", v: `from proofmind import ProofMind` },
    { t: "blank", v: "" },
    { t: "code", v: `pm = ProofMind(` },
    { t: "prop", v: `    enterprise_id = "ent_acme_financial",` },
    { t: "prop", v: `    kms_key_arn   = "arn:aws:kms:us-east-1:...",` },
    { t: "prop", v: `    hcs_topic_id  = "0.0.8320979",` },
    { t: "prop", v: `    mode          = "async",` },
    { t: "code", v: `)` },
    { t: "blank", v: "" },
    { t: "decorator", v: `@pm.notarize(model_id="credit_risk_v4.2", context="loan_decision")` },
    { t: "code", v: `def credit_decision(applicant_data: dict) -> dict:` },
    { t: "code", v: `    return ai_model.predict(applicant_data)` },
    { t: "blank", v: "" },
    { t: "comment", v: "# receipt.hcs_sequence  → immutable sequence # on Hedera" },
    { t: "comment", v: "# receipt.kms_event_id  → CloudTrail audit reference" },
    { t: "comment", v: "# receipt.notarization_id → for regulator verification" },
  ];

  const colorMap: Record<string, string> = {
    comment: "#6A9955",
    decorator: "#DCDCAA",
    prop: "#9CDCFE",
    code: "#D4D4D4",
    blank: "transparent",
  };

  return (
    <section ref={ref} className="px-4 md:px-10 pb-8 flex items-center">
      <div className="demo-card w-full max-w-5xl mx-auto rounded-3xl overflow-hidden bg-[#1E1E1E]" style={{ boxShadow: "0 32px 80px -12px rgba(79,70,229,0.25)" }}>
        {/* Window chrome */}
        <div className="flex items-center gap-2 px-5 py-4 border-b border-white/[0.06]">
          <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
          <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
          <span className="w-3 h-3 rounded-full bg-[#28CA41]" />
          <span className="ml-4 text-xs text-white/30" style={{ fontFamily: "monospace" }}>
            credit_pipeline.py
          </span>
          <span className="ml-auto flex items-center gap-1.5 text-xs text-[#818CF8]" style={{ fontFamily: "'Google Sans', sans-serif" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
            Notarizing to HCS · 0.0.8320979
          </span>
        </div>

        {/* Code */}
        <div className="p-6 md:p-8 overflow-x-auto">
          <pre className="text-sm leading-7" style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}>
            {codeLines.map((line, i) =>
              line.t === "blank" ? (
                <div key={i} className="h-3" />
              ) : (
                <div key={i} style={{ color: colorMap[line.t] }}>
                  {line.v}
                </div>
              )
            )}
          </pre>
        </div>

        {/* Receipt footer */}
        <div className="grid grid-cols-3 divide-x divide-white/[0.06] border-t border-white/[0.06]">
          {[
            { label: "HCS Sequence", value: "#22,817", icon: "link" },
            { label: "KMS Signed", value: "CloudTrail ✓", icon: "key" },
            { label: "Latency Added", value: "< 50ms", icon: "bolt" },
          ].map(({ label, value, icon }) => (
            <div key={label} className="flex items-center gap-3 px-5 py-4">
              <span className="material-symbols-outlined text-[18px] text-[#818CF8]">{icon}</span>
              <div>
                <p className="text-[10px] text-white/30 uppercase tracking-wider" style={{ fontFamily: "'Google Sans', sans-serif" }}>{label}</p>
                <p className="text-sm text-white/80" style={{ fontFamily: "'Google Sans', sans-serif" }}>{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Features Section ─────────────────────────────────────────────────────────

const TypewriterText: FC<{ text: string; className?: string }> = ({ text, className }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(false);
  const displayed = useTypewriter(text, active);

  useEffect(() => {
    if (!ref.current) return;
    ScrollTrigger.create({
      trigger: ref.current,
      start: "top 75%",
      onEnter: () => setActive(true),
      once: true,
    });
  }, []);

  return (
    <span ref={ref} className={className}>
      {displayed}
      {active && displayed.length < text.length && (
        <span className="animate-pulse text-indigo-500">|</span>
      )}
    </span>
  );
};

const FeaturesSection: FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [activeFeature, setActiveFeature] = useState(0);
  const activeRef = useRef(0);

  // Pin section on desktop, scrub through features
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: `+=${FEATURES.length * 100}vh`,
        pin: true,
        onUpdate: (self) => {
          const idx = Math.min(
            Math.floor(self.progress * FEATURES.length),
            FEATURES.length - 1
          );
          if (idx !== activeRef.current) {
            activeRef.current = idx;
            setActiveFeature(idx);
          }
        },
      });
      return () => {};
    });
    return () => mm.revert();
  }, []);

  // Animate text in on each feature change
  useEffect(() => {
    if (!textRef.current) return;
    gsap.fromTo(
      textRef.current,
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.42, ease: "power2.out" }
    );
  }, [activeFeature]);

  return (
    <section
      ref={sectionRef}
      className="flex flex-col bg-white overflow-hidden"
      style={{ minHeight: "100vh", paddingTop: "64px" }}
    >
      {/* Headline */}
      <div className="flex-shrink-0 px-10 pt-10 pb-4 max-w-[1400px] w-full mx-auto">
        <h2
          className="text-2xl md:text-3xl font-light leading-snug text-[#202124]"
          style={{ fontFamily: "'Google Sans', sans-serif", fontWeight: 350, maxWidth: "52ch" }}
        >
          <TypewriterText text="ProofMind is the notarization layer that transforms internal AI logs into independent, regulator-verifiable proof." />
        </h2>
      </div>

      {/* Desktop two-column pinned layout */}
      <div className="hidden md:flex flex-1 px-10 max-w-[1400px] w-full mx-auto gap-16 items-center min-h-0">
        {/* Left: active feature text */}
        <div className="flex-1 flex flex-col justify-center">
          {/* Progress indicator */}
          <div className="flex items-center gap-3 mb-8">
            <span
              className="text-xs font-medium tabular-nums"
              style={{ fontFamily: "'Google Sans', sans-serif", color: "#4F46E5" }}
            >
              {String(activeFeature + 1).padStart(2, "0")}&thinsp;/&thinsp;{String(FEATURES.length).padStart(2, "0")}
            </span>
            <div className="flex items-center gap-1.5">
              {FEATURES.map((_, i) => (
                <div
                  key={i}
                  className="rounded-full"
                  style={{
                    width: i === activeFeature ? "22px" : "6px",
                    height: "6px",
                    background: i === activeFeature ? "#4F46E5" : "#E1E6EC",
                    transition: "width 0.4s cubic-bezier(0.4,0,0.2,1), background 0.3s ease",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Feature text — animated in on change */}
          <div ref={textRef}>
            <h3
              className="text-[1.75rem] md:text-[2rem] font-light text-[#202124] mb-5 leading-snug"
              style={{ fontFamily: "'Google Sans', sans-serif", fontWeight: 350 }}
            >
              {FEATURES[activeFeature].title}
            </h3>
            <p
              className="text-[#45474D] leading-relaxed max-w-[44ch]"
              style={{ fontWeight: 300, fontSize: "1.0625rem" }}
            >
              {FEATURES[activeFeature].description}
            </p>
          </div>

          <p
            className="mt-10 text-[#B0B7C3] text-xs flex items-center gap-1.5 select-none"
            style={{ fontFamily: "'Google Sans', sans-serif" }}
          >
            <span className="material-symbols-outlined text-[14px]">south</span>
            Scroll to continue
          </p>
        </div>

        {/* Right: feature image */}
        <div className="flex-1 flex items-center">
          <div
            className="relative w-full rounded-3xl overflow-hidden bg-[#F0F1F5]"
            style={{
              aspectRatio: "4/3",
              boxShadow: "0 24px 60px -8px rgba(79,70,229,0.18)",
            }}
          >
            {FEATURES.map((feature, i) => (
              <img
                key={i}
                src={feature.img}
                alt={feature.title}
                className="absolute inset-0 w-full h-full object-cover rounded-3xl"
                style={{
                  opacity: i === activeFeature ? 1 : 0,
                  transition: "opacity 0.45s ease",
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    `https://placehold.co/800x600/0f0a2a/818cf8?text=${encodeURIComponent(feature.title)}`;
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Desktop progress bar */}
      <div className="hidden md:block flex-shrink-0 px-10 pb-8 max-w-[1400px] w-full mx-auto">
        <div className="w-full h-px bg-[#E8EAF0] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#4F46E5] rounded-full"
            style={{
              width: `${((activeFeature + 1) / FEATURES.length) * 100}%`,
              transition: "width 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
        </div>
      </div>

      {/* Mobile: stacked features */}
      <div className="md:hidden flex flex-col gap-14 px-6 pb-16 pt-6">
        {FEATURES.map((feature, i) => (
          <div key={i} className="flex flex-col gap-4">
            <img
              src={feature.img}
              alt={feature.title}
              className="w-full rounded-2xl"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  `https://placehold.co/800x600/0f0a2a/818cf8?text=${encodeURIComponent(feature.title)}`;
              }}
            />
            <h3
              className="text-xl text-[#202124]"
              style={{ fontFamily: "'Google Sans', sans-serif", fontWeight: 350 }}
            >
              {feature.title}
            </h3>
            <p className="text-[#45474D] font-light leading-snug text-sm">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

// ─── Use Cases / Carousel ─────────────────────────────────────────────────────

const UseCaseCard: FC<{ uc: UseCase; index: number }> = ({ uc, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [snapped, setSnapped] = useState(index === 0);
  const [active, setActive] = useState(index === 0);
  const displayed = useTypewriter(uc.role, active);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.intersectionRatio > 0.6;
        setSnapped(isVisible);
        if (isVisible) setActive(true);
        else setActive(false);
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className="flex-shrink-0 overflow-hidden"
      style={{ flex: "0 0 min(100%, 60vw)" }}
    >
      {/* Image */}
      <div className="relative grid place-items-center rounded-3xl overflow-hidden">
        <img
          src={uc.img}
          alt={uc.imgAlt}
          className="w-full h-auto rounded-3xl"
          style={{ opacity: snapped ? 1 : 0.25, transition: "opacity 0.5s ease" }}
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              `https://placehold.co/800x450/0f0a2a/818cf8?text=${encodeURIComponent(uc.role)}`;
          }}
        />
        <span
          className="absolute text-white text-3xl md:text-4xl font-light pointer-events-none px-8 text-center"
          style={{
            fontFamily: "'Google Sans', sans-serif",
            opacity: snapped ? 1 : 0,
            transition: "opacity 0.5s ease 0.2s",
          }}
        >
          {displayed}
          {active && displayed.length < uc.role.length && (
            <span className="animate-pulse">|</span>
          )}
        </span>
      </div>

      {/* Text */}
      <div
        style={{
          opacity: snapped ? 1 : 0,
          transform: `translateY(${snapped ? 0 : 8}px)`,
          transition: "opacity 0.5s ease 0.2s, transform 0.5s ease 0.2s",
        }}
      >
        <h3
          className="mt-4 text-xl text-[#202124]"
          style={{ fontFamily: "'Google Sans', sans-serif", fontWeight: 350 }}
        >
          {uc.role}
        </h3>
        <p className="mt-2 text-[#45474D] font-light text-sm leading-snug max-w-[35ch]">
          {uc.description}
        </p>
        <Link
          to={uc.link}
          className="mt-3 inline-flex items-center gap-1 text-[#45474D] text-sm font-light hover:gap-2 transition-all duration-150"
        >
          View case
          <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
        </Link>
      </div>
    </div>
  );
};

const UseCasesSection: FC = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const scroll = (dir: "left" | "right") => {
    const el = carouselRef.current;
    if (!el) return;
    const cardW = el.querySelector("[data-card]")?.clientWidth ?? 500;
    el.scrollBy({ left: dir === "left" ? -cardW - 32 : cardW + 32, behavior: "smooth" });
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("h2, p.intro-text", {
        opacity: 0,
        y: 20,
        duration: 0.7,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="pt-16 border-t border-black/[0.06] overflow-hidden"
    >
      {/* Header */}
      <div className="px-10 max-w-[1400px] mx-auto mb-8 md:flex md:items-start md:justify-between">
        <h2
          className="text-3xl md:text-4xl font-light leading-tight text-[#202124]"
          style={{ fontFamily: "'Google Sans', sans-serif", fontWeight: 350, maxWidth: "20ch" }}
        >
          Built for every regulated industry
        </h2>
        <p
          className="intro-text mt-4 md:mt-0 text-[#45474D] text-base leading-snug font-light md:max-w-[30ch]"
          style={{ fontWeight: 320 }}
        >
          ProofMind is compliance-framework-aware from day one — whether you're a fintech navigating SEC rules or a healthtech team under FDA SaMD requirements.
        </p>
      </div>

      {/* Carousel */}
      <div className="relative">
        <div
          ref={carouselRef}
          className="flex gap-8 px-10 overflow-x-scroll pb-12"
          style={{
            scrollSnapType: "x mandatory",
            scrollbarWidth: "none",
            overscrollBehaviorX: "contain",
            scrollPaddingInline: "2.5rem",
          }}
        >
          {USE_CASES.map((uc, i) => (
            <div
              key={i}
              data-card=""
              style={{ scrollSnapAlign: "start", flex: "0 0 min(100%, 60vw)" }}
            >
              <UseCaseCard uc={uc} index={i} />
            </div>
          ))}
        </div>

        {/* Scroll buttons */}
        <div className="absolute bottom-4 left-10 flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="w-10 h-10 rounded-full bg-[#F0F1F5] hover:bg-[#E1E6EC] transition-colors flex items-center justify-center"
            aria-label="Previous"
          >
            <span className="material-symbols-outlined text-[20px] text-[#202124]">arrow_back</span>
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-10 h-10 rounded-full bg-[#F0F1F5] hover:bg-[#E1E6EC] transition-colors flex items-center justify-center"
            aria-label="Next"
          >
            <span className="material-symbols-outlined text-[20px] text-[#202124]">arrow_forward</span>
          </button>
        </div>
      </div>
    </section>
  );
};

// ─── Audience Section ─────────────────────────────────────────────────────────

const AudienceSection: FC = () => {
  const ref = useRef<HTMLElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".audience-card", {
        opacity: 0,
        y: 30,
        duration: 0.7,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 75%" },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      className="min-h-[70vh] flex flex-col md:flex-row items-stretch"
    >
      {/* Enterprise */}
      <div
        className="audience-card flex-1 flex flex-col items-center justify-center gap-6 py-20 px-8 text-center min-h-[40vh] relative overflow-hidden"
        style={{
          background: "radial-gradient(ellipse at 50% 80%, #e8e8f8 0%, #f8f9fc 60%)",
        }}
      >
        <p
          className="text-xs uppercase tracking-widest text-[#4F46E5] font-medium"
          style={{ fontFamily: "'Google Sans', sans-serif" }}
        >
          Enterprise AI Teams
        </p>
        <h3
          className="text-3xl md:text-4xl font-light leading-tight text-[#202124]"
          style={{ fontFamily: "'Google Sans', sans-serif", fontWeight: 400 }}
        >
          Build AI with<br />
          <span className="text-[#45474D]">regulatory confidence</span>
        </h3>
        <p
          className="text-[#45474D] text-sm leading-relaxed max-w-[28ch] font-light"
          style={{ fontFamily: "'Google Sans', sans-serif" }}
        >
          One SDK call. Every model decision notarized, every compliance report generated automatically.
        </p>
        <button
          onClick={() => navigate("/docs/quickstart/install")}
          className="bg-[#4F46E5] text-white rounded-full px-7 py-3.5 text-base hover:bg-[#4338CA] transition-colors"
          style={{ fontFamily: "'Google Sans', sans-serif" }}
        >
          Get started
        </button>
      </div>

      {/* Regulators */}
      <div
        className="audience-card flex-1 flex flex-col items-center justify-center gap-6 py-20 px-8 text-center min-h-[40vh] relative overflow-hidden border-t md:border-t-0 md:border-l border-black/[0.06]"
        style={{
          background: "radial-gradient(ellipse at 50% 80%, #e8f0e8 0%, #f8f9fc 60%)",
        }}
      >
        <p
          className="text-xs uppercase tracking-widest text-[#059669] font-medium"
          style={{ fontFamily: "'Google Sans', sans-serif" }}
        >
          Regulators &amp; Auditors
        </p>
        <h3
          className="text-3xl md:text-4xl font-light leading-tight text-[#202124]"
          style={{ fontFamily: "'Google Sans', sans-serif", fontWeight: 400 }}
        >
          Verify AI decisions<br />
          <span className="text-[#45474D]">without the enterprise</span>
        </h3>
        <p
          className="text-[#45474D] text-sm leading-relaxed max-w-[28ch] font-light"
          style={{ fontFamily: "'Google Sans', sans-serif" }}
        >
          Direct blockchain access. No intermediary. Natural language queries answered on-chain.
        </p>
        <button
          onClick={() => navigate("/docs")}
          className="bg-[#B7BFD91A] text-[#202124] border border-black/[0.06] rounded-full px-7 py-3.5 text-base hover:bg-[#F0F1F5] transition-colors"
          style={{ fontFamily: "'Google Sans', sans-serif" }}
        >
          Explore docs
        </button>
      </div>
    </section>
  );
};

// ─── (CTA moved to src/components/SiteCtaSection.tsx) ────────────────────────

// ─── (Footer moved to src/components/SiteFooter.tsx) ─────────────────────────

// ─── Root Component ───────────────────────────────────────────────────────────

export default function ProofMindLanding() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(tick);
    };
  }, []);

  return (
    <>
      {/* Google Fonts & Material Symbols */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@300;400;500&display=swap"
      />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
      />

      <div className="bg-white min-h-screen overflow-x-hidden">
        <SiteHeader />
        <main>
          <HeroSection />
          <DemoCodeSection />
          <FeaturesSection />
          <UseCasesSection />
          <AudienceSection />
          <SiteCtaSection />
        </main>
        <SiteFooter />
      </div>
    </>
  );
}
