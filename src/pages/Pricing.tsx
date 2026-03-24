import { useState } from 'react';
import { Link } from "react-router-dom";
import { Check, ArrowRight, TrendingDown, Calculator, DollarSign, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

const GS: React.CSSProperties = { fontFamily: "'Google Sans', sans-serif" };

const tiers = [
  {
    name: "Developer",
    description: "For individual developers and small projects",
    price: "Free",
    period: "",
    features: [
      "1,000 notarizations / month",
      "1 model registration",
      "Basic verification API",
      "Community support",
      "Test environment only",
    ],
    cta: "Start Free",
    highlighted: false,
  },
  {
    name: "Professional",
    description: "For teams building production AI systems",
    price: "$299",
    period: "/ month",
    features: [
      "500,000 notarizations / month",
      "10 model registrations",
      "Full verification API",
      "Batch notarization (40× cost saving)",
      "Email + Slack support",
      "Production environment",
      "Compliance reports included",
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    description: "For regulated enterprises with compliance requirements",
    price: "Custom",
    period: "",
    features: [
      "Unlimited notarizations",
      "Unlimited model registrations",
      "Audit Agent (NL query + anomaly detection)",
      "Dedicated HCS topic (6 topics)",
      "Regulator portal access",
      "99.99% SLA + dedicated infra",
      "EU AI Act / SEC / HIPAA profiles",
      "White-glove regulatory support",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

const usageRates = [
  { item: "AI Decision Notarization", price: "$0.001", unit: "per decision" },
  { item: "Model Registration", price: "$50", unit: "per version" },
  { item: "Audit Agent", price: "$500", unit: "per month" },
  { item: "Batch Verification", price: "$0.0001", unit: "per record" },
  { item: "Monthly Compliance Report", price: "$10", unit: "per month" },
  { item: "Quarterly Compliance Report", price: "$25", unit: "per quarter" },
  { item: "Annual Compliance Report", price: "$100", unit: "per year" },
];

// ─── ROI Calculator ────────────────────────────────────────────────────────────
function ROICalculator() {
  const [decisionsPerMonth, setDecisionsPerMonth] = useState([500000]);
  const [modelsActive, setModelsActive] = useState([8]);
  const [includeAgent, setIncludeAgent] = useState(true);

  // ProofMind costs (per spec §15.1)
  const notarizationCost = decisionsPerMonth[0] * 0.001;
  const modelCost = modelsActive[0] * 50 / 12; // amortised monthly
  const agentCost = includeAgent ? 500 : 0;
  const reportCost = 10;
  const proofmindMonthly = notarizationCost + modelCost + agentCost + reportCost;
  const proofmindAnnual = proofmindMonthly * 12;

  // Alternative costs (per spec §15.2)
  const manualComplianceLow = 200000;
  const manualComplianceHigh = 500000;
  const examResponseLow = 50000;
  const examResponseHigh = 150000;
  const aiActFineEstimate = 30000000; // €30M max

  const annualSavingsLow = manualComplianceLow - proofmindAnnual;
  const annualSavingsHigh = manualComplianceHigh - proofmindAnnual;
  const roi = Math.round((annualSavingsLow / proofmindAnnual) * 100);

  const formatCurrency = (n: number) => {
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}k`;
    return `$${n.toFixed(0)}`;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-6">
          <Calculator className="w-4 h-4 text-primary" />
          <span className="text-sm text-muted-foreground">ROI Calculator</span>
        </div>
        <h2 className="text-3xl font-bold mb-4">Calculate Your <span className="text-gradient">Return on Investment</span></h2>
        <p className="text-muted-foreground">Based on real unit economics from regulated enterprise AI deployments.</p>
      </div>

      <div className="rounded-2xl border border-border bg-gradient-card overflow-hidden">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Inputs */}
          <div className="p-8 border-b md:border-b-0 md:border-r border-border">
            <h3 className="text-sm font-semibold mb-6 text-muted-foreground uppercase tracking-wide">Your AI Usage</h3>

            <div className="space-y-8">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium">AI Decisions per Month</label>
                  <span className="font-mono text-sm font-bold text-primary">{decisionsPerMonth[0].toLocaleString()}</span>
                </div>
                <Slider
                  min={10000} max={5000000} step={10000}
                  value={decisionsPerMonth}
                  onValueChange={setDecisionsPerMonth}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>10k</span><span>5M</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium">Active Model Versions</label>
                  <span className="font-mono text-sm font-bold text-primary">{modelsActive[0]}</span>
                </div>
                <Slider
                  min={1} max={50} step={1}
                  value={modelsActive}
                  onValueChange={setModelsActive}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>1</span><span>50</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Include Audit Agent</label>
                <button
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${includeAgent ? 'bg-primary' : 'bg-secondary border border-border'}`}
                  onClick={() => setIncludeAgent(!includeAgent)}
                >
                  <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${includeAgent ? 'translate-x-4' : 'translate-x-1'}`} />
                </button>
              </div>

              <div className="bg-secondary/50 rounded-xl p-4 space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">ProofMind Cost Breakdown</p>
                {[
                  ['Notarizations', `${decisionsPerMonth[0].toLocaleString()} × $0.001`, formatCurrency(notarizationCost)],
                  ['Model Registrations', `${modelsActive[0]} × $50 / 12`, formatCurrency(modelCost)],
                  ...(includeAgent ? [['Audit Agent', 'Flat monthly', '$500'] as [string,string,string]] : []),
                  ['Compliance Report', 'Monthly', '$10'],
                ].map(([label, detail, cost]) => (
                  <div key={label} className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{label} <span className="text-muted-foreground/60">({detail})</span></span>
                    <span className="font-mono font-medium">{cost}</span>
                  </div>
                ))}
                <div className="pt-2 border-t border-border flex items-center justify-between text-sm font-semibold">
                  <span>Monthly Total</span>
                  <span className="font-mono text-primary">{formatCurrency(proofmindMonthly)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="p-8">
            <h3 className="text-sm font-semibold mb-6 text-muted-foreground uppercase tracking-wide">vs. Alternatives</h3>

            <div className="space-y-4 mb-8">
              <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4">
                <p className="text-xs font-semibold text-destructive mb-2">Manual Compliance Program</p>
                <p className="text-2xl font-bold">{formatCurrency(manualComplianceLow)}–{formatCurrency(manualComplianceHigh)}<span className="text-sm font-normal text-muted-foreground"> / yr</span></p>
                <p className="text-xs text-muted-foreground mt-1">Staff + tooling + legal for equivalent AI audit coverage</p>
              </div>

              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                <p className="text-xs font-semibold text-amber-600 mb-2">Single Regulatory Examination Response</p>
                <p className="text-2xl font-bold">{formatCurrency(examResponseLow)}–{formatCurrency(examResponseHigh)}</p>
                <p className="text-xs text-muted-foreground mt-1">Internal legal + ops cost per exam. ProofMind eliminates this entirely.</p>
              </div>

              <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                <p className="text-xs font-semibold text-red-600 mb-2">EU AI Act Maximum Fine</p>
                <p className="text-2xl font-bold">€30M or 6% global revenue</p>
                <p className="text-xs text-muted-foreground mt-1">For inadequate audit trail of high-risk AI systems</p>
              </div>
            </div>

            <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <TrendingDown className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Annual savings vs. manual compliance</p>
                  <p className="text-2xl font-bold text-gradient">{formatCurrency(annualSavingsLow)}–{formatCurrency(annualSavingsHigh)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="text-center bg-background/60 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">ProofMind Annual</p>
                  <p className="text-lg font-bold font-mono">{formatCurrency(proofmindAnnual)}</p>
                </div>
                <div className="text-center bg-background/60 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">ROI</p>
                  <p className="text-lg font-bold text-green-500">{roi > 0 ? `${roi.toLocaleString()}%` : 'N/A'}</p>
                </div>
              </div>

              <p className="text-xs text-muted-foreground text-center mt-3">
                Breakeven on examination response savings in <strong>month 1</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
const Pricing = () => {
  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <main className="pt-28 pb-24">
        <div className="px-10 max-w-[1400px] mx-auto">

          {/* Hero */}
          <div className="max-w-3xl mx-auto text-center mb-20">
            <h1
              className="text-4xl md:text-5xl font-light text-[#202124] mb-5 leading-tight"
              style={{ ...GS, fontWeight: 350 }}
            >
              Simple, transparent pricing
            </h1>
            <p className="text-lg text-[#45474D] font-light" style={{ ...GS, fontWeight: 300 }}>
              Pay for what you use. No hidden fees. Sub-cent per AI decision — invisible as a line item.
            </p>
          </div>

          {/* Pricing tiers */}
          <div className="grid md:grid-cols-3 gap-6 mb-24">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className="relative flex flex-col p-8 rounded-3xl border transition-all duration-200"
                style={{
                  border: tier.highlighted ? "1.5px solid #4F46E5" : "1px solid rgba(0,0,0,0.08)",
                  background: tier.highlighted ? "#F5F3FF" : "#FAFAFA",
                  boxShadow: tier.highlighted ? "0 16px 48px -8px rgba(79,70,229,0.16)" : "none",
                }}
              >
                {tier.highlighted && (
                  <div
                    className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#4F46E5] text-white text-xs font-medium px-4 py-1.5 rounded-full"
                    style={GS}
                  >
                    Most Popular
                  </div>
                )}
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-[#202124] mb-1" style={GS}>{tier.name}</h3>
                  <p className="text-sm text-[#45474D] mb-6 font-light" style={GS}>{tier.description}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-light text-[#202124]" style={GS}>{tier.price}</span>
                    <span className="text-[#9AA0A6] text-sm" style={GS}>{tier.period}</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm">
                      <Check className="w-4 h-4 text-[#4F46E5] mt-0.5 flex-shrink-0" />
                      <span className="text-[#45474D] font-light" style={GS}>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to={tier.name === "Enterprise" ? "#" : "/docs/quickstart/install"}
                  className={`flex items-center justify-center gap-2 w-full py-3 rounded-full text-sm transition-colors duration-150 ${
                    tier.highlighted
                      ? "bg-[#4F46E5] text-white hover:bg-[#4338CA]"
                      : "border border-black/[0.12] text-[#202124] hover:bg-black/[0.04]"
                  }`}
                  style={GS}
                >
                  {tier.cta}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>

          {/* Usage-based pricing */}
          <div className="max-w-3xl mx-auto mb-24">
            <h2 className="text-2xl font-light text-[#202124] text-center mb-10" style={{ ...GS, fontWeight: 350 }}>
              Usage-based rates
            </h2>
            <div className="rounded-3xl border border-black/[0.06] overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-black/[0.06] bg-[#FAFAFA]">
                    <th className="text-left px-6 py-4 text-xs font-medium text-[#9AA0A6] uppercase tracking-wider" style={GS}>Service</th>
                    <th className="text-right px-6 py-4 text-xs font-medium text-[#9AA0A6] uppercase tracking-wider" style={GS}>Price</th>
                    <th className="text-right px-6 py-4 text-xs font-medium text-[#9AA0A6] uppercase tracking-wider" style={GS}>Unit</th>
                  </tr>
                </thead>
                <tbody>
                  {usageRates.map((rate, i) => (
                    <tr key={rate.item} className={i < usageRates.length - 1 ? "border-b border-black/[0.04]" : ""}>
                      <td className="px-6 py-4 text-sm text-[#45474D]" style={GS}>{rate.item}</td>
                      <td className="px-6 py-4 text-right font-mono text-sm text-[#4F46E5] font-medium">{rate.price}</td>
                      <td className="px-6 py-4 text-right text-sm text-[#9AA0A6]" style={GS}>{rate.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-[#9AA0A6] text-center mt-4 font-light" style={GS}>
              Volume discounts available. Batch mode reduces HCS costs by ~40×. Contact sales for custom pricing.
            </p>
          </div>

          {/* ROI Calculator */}
          <div className="mb-24">
            <ROICalculator />
          </div>

          {/* SLA tiers */}
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-light text-[#202124] text-center mb-10" style={{ ...GS, fontWeight: 350 }}>
              Enterprise SLA tiers
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { name: "Standard",     uptime: "99.5%",   response: "Business hours",          infra: "Shared",                 accent: "#9AA0A6" },
                { name: "Professional", uptime: "99.9%",   response: "4-hour incident response", infra: "Shared (priority)",       accent: "#4F46E5" },
                { name: "Enterprise",   uptime: "99.99%",  response: "Dedicated team",           infra: "Dedicated infrastructure", accent: "#059669" },
              ].map((sla) => (
                <div
                  key={sla.name}
                  className="rounded-2xl border border-black/[0.06] p-6 bg-[#FAFAFA]"
                >
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-2 h-2 rounded-full" style={{ background: sla.accent }} />
                    <h3 className="font-medium text-[#202124] text-sm" style={GS}>{sla.name}</h3>
                  </div>
                  <div className="space-y-3">
                    {[["Uptime", sla.uptime], ["Incident Response", sla.response], ["Infrastructure", sla.infra]].map(([k, v]) => (
                      <div key={k}>
                        <p className="text-[11px] text-[#9AA0A6] uppercase tracking-wider mb-0.5" style={GS}>{k}</p>
                        <p className="text-sm text-[#202124] font-light" style={GS}>{v}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default Pricing;
