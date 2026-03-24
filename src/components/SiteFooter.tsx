import { FC } from "react";
import { LogoMark } from "@/components/LogoMark";

export const SiteFooter: FC = () => (
  <footer className="border-t border-black/[0.06] px-10 py-8">
    <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <LogoMark className="h-5 w-5" />
        <span className="text-sm text-[#45474D]" style={{ fontFamily: "'Google Sans', sans-serif" }}>
          ProofMind · Immutable Audit Infrastructure for Enterprise AI
        </span>
      </div>
      <p className="text-xs text-[#9AA0A6]" style={{ fontFamily: "'Google Sans', sans-serif" }}>
        Built on Hedera HCS · AWS KMS · Supabase · HCS-10 Audit Agent
      </p>
    </div>
  </footer>
);
