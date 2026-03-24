import { useEffect, useRef, useState, FC } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTypewriter } from "@/hooks/useTypewriter";

gsap.registerPlugin(ScrollTrigger);

export const SiteCtaSection: FC = () => {
  const ref = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const TYPEWRITER_TEXT = "Start notarizing your AI decisions today.";
  const displayed = useTypewriter(TYPEWRITER_TEXT, active);
  const navigate = useNavigate();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(cardRef.current, {
        scale: 0.88,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 90%",
          end: "top 50%",
          scrub: 0.5,
        },
      });
    }, ref);

    ScrollTrigger.create({
      trigger: cardRef.current,
      start: "top 70%",
      onEnter: () => setActive(true),
      once: true,
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="px-6 md:px-10 py-24 max-w-[1400px] mx-auto">
      <div
        ref={cardRef}
        className="relative overflow-hidden rounded-3xl bg-[#0F0A2A] text-white p-12 md:p-20"
        style={{ minHeight: "clamp(300px, 50vh, 500px)" }}
      >
        {/* Noise texture */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Gradient orb */}
        <div
          className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #4F46E5, transparent)" }}
        />

        {/* Hedera badge */}
        <div className="absolute top-8 right-8 flex items-center gap-2 bg-white/[0.06] rounded-full px-4 py-2 border border-white/[0.08]">
          <span className="material-symbols-outlined text-[16px] text-[#818CF8]">hub</span>
          <span className="text-xs text-white/60" style={{ fontFamily: "'Google Sans', sans-serif" }}>
            Anchored to Hedera HCS
          </span>
        </div>

        <div className="relative z-10 flex flex-col gap-8 max-w-lg">
          <p
            className="text-3xl md:text-4xl font-light leading-tight"
            style={{ fontFamily: "'Google Sans', sans-serif", fontWeight: 350 }}
          >
            {displayed}
            {active && displayed.length < TYPEWRITER_TEXT.length && (
              <span className="animate-pulse text-indigo-400">|</span>
            )}
          </p>

          <p className="text-white/50 text-sm leading-relaxed" style={{ fontFamily: "'Google Sans', sans-serif" }}>
            Sub-50ms latency. GDPR-safe by design. HCS-anchored, permanent, independently verifiable.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate("/docs/quickstart/install")}
              className="bg-white text-[#0F0A2A] rounded-full px-6 py-3 text-sm hover:bg-[#F0F1F5] transition-colors"
              style={{ fontFamily: "'Google Sans', sans-serif" }}
            >
              Get started
            </button>
            <button
              onClick={() => navigate("/playground")}
              className="bg-white/10 text-white border border-white/20 rounded-full px-6 py-3 text-sm hover:bg-white/20 transition-colors"
              style={{ fontFamily: "'Google Sans', sans-serif" }}
            >
              Playground
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
