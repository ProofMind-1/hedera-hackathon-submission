import { useEffect, useRef, useState } from "react";
import { Cloud, Shield, Key, GitBranch, Brain, Users, Lock, CheckCircle, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

const pipeline = [
  {
    id: "enterprise",
    icon: Cloud,
    title: "Enterprise AI",
    subtitle: "SageMaker · Azure ML · Custom",
    tag: "Your Infrastructure",
    tagColor: "text-zinc-400",
    accent: "border-zinc-700 bg-zinc-800/60",
    iconBg: "bg-zinc-700",
    iconColor: "text-zinc-300",
  },
  {
    id: "sdk",
    icon: Shield,
    title: "ProofMind SDK",
    subtitle: "SHA-256 hash · sign · notarize",
    tag: "One line of code",
    tagColor: "text-violet-400",
    accent: "border-violet-500/60 bg-violet-500/10 shadow-[0_0_24px_rgba(139,92,246,0.15)]",
    iconBg: "bg-violet-500/20",
    iconColor: "text-violet-400",
    highlight: true,
  },
  {
    id: "kms",
    icon: Key,
    title: "AWS KMS",
    subtitle: "ECDSA signing · CloudTrail",
    tag: "Cryptographic proof",
    tagColor: "text-amber-400",
    accent: "border-amber-500/40 bg-amber-500/5",
    iconBg: "bg-amber-500/15",
    iconColor: "text-amber-400",
  },
  {
    id: "hedera",
    icon: GitBranch,
    title: "Hedera HCS",
    subtitle: "Consensus timestamp · Immutable",
    tag: "Tamper-proof ledger",
    tagColor: "text-emerald-400",
    accent: "border-emerald-500/50 bg-emerald-500/8 shadow-[0_0_20px_rgba(16,185,129,0.10)]",
    iconBg: "bg-emerald-500/15",
    iconColor: "text-emerald-400",
    highlight: true,
  },
  {
    id: "agent",
    icon: Brain,
    title: "Audit Agent",
    subtitle: "Anomaly detection · NL queries",
    tag: "AI-powered monitoring",
    tagColor: "text-sky-400",
    accent: "border-sky-500/40 bg-sky-500/5",
    iconBg: "bg-sky-500/15",
    iconColor: "text-sky-400",
  },
  {
    id: "regulators",
    icon: Users,
    title: "Regulators",
    subtitle: "Independent verification · Audit",
    tag: "Zero data exposure",
    tagColor: "text-zinc-400",
    accent: "border-zinc-700 bg-zinc-800/60",
    iconBg: "bg-zinc-700",
    iconColor: "text-zinc-300",
  },
];

const ArchitectureDiagram = () => {
  const [visible, setVisible] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          pipeline.forEach((_, i) => setTimeout(() => setActiveIdx(i), i * 150));
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="w-full flex flex-col items-center">
      {/* Vertical pipeline */}
      <div className="flex flex-col items-center w-full max-w-xs">
        {pipeline.map((node, i) => {
          const Icon = node.icon;
          const entered = visible && activeIdx >= i;
          return (
            <div key={node.id} className="flex flex-col items-center w-full">
              {/* Card — square: fixed w and h */}
              <div
                className={cn(
                  "w-full aspect-square rounded-2xl border-2 flex flex-col items-center justify-center text-center p-4 transition-all duration-500",
                  node.accent,
                  entered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                )}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <p className={cn("text-[10px] font-semibold uppercase tracking-widest mb-3", node.tagColor)}>
                  {node.tag}
                </p>
                <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center mb-3", node.iconBg)}>
                  <Icon className={cn("w-5 h-5", node.iconColor)} />
                </div>
                <p className={cn("text-sm font-semibold leading-tight", node.highlight ? "text-white" : "text-zinc-200")}>
                  {node.title}
                </p>
                <p className="text-[11px] text-zinc-500 mt-1 leading-tight">{node.subtitle}</p>
              </div>

              {/* Arrow connector */}
              {i < pipeline.length - 1 && (
                <div
                  className={cn(
                    "flex flex-col items-center my-1 transition-all duration-500",
                    entered ? "opacity-100" : "opacity-0"
                  )}
                  style={{ transitionDelay: `${(i + 1) * 100}ms` }}
                >
                  <div className={cn("w-px h-4", entered ? "bg-violet-500/40" : "bg-zinc-800")} />
                  <ArrowDown className={cn("w-3 h-3 -mt-0.5", entered ? "text-violet-500/60" : "text-zinc-800")} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom proof strip */}
      <div
        className={cn(
          "mt-6 flex flex-col items-center gap-2 pt-5 border-t border-zinc-800 w-full transition-all duration-700",
          visible ? "opacity-100" : "opacity-0"
        )}
        style={{ transitionDelay: "900ms" }}
      >
        {[
          { icon: Lock,          label: "Zero raw data on-chain",            color: "text-violet-400" },
          { icon: CheckCircle,   label: "Independent verification",           color: "text-emerald-400" },
          { icon: Shield,        label: "Immutable from point of inference",  color: "text-sky-400" },
        ].map(({ icon: I, label, color }) => (
          <div key={label} className="flex items-center gap-2">
            <I className={cn("w-3.5 h-3.5", color)} />
            <span className="text-xs text-zinc-500">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArchitectureDiagram;
