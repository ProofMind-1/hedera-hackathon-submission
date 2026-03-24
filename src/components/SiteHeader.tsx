import { useState, useEffect, useRef, FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogoMark } from "@/components/LogoMark";

const navLinks = [
  { label: "Product",    to: "/" },
  { label: "SDK",        to: "/sdk" },
  { label: "Compliance", to: "/docs/compliance/eu-ai-act" },
  { label: "Pricing",    to: "/pricing" },
  { label: "Docs",       to: "/docs" },
];

export const SiteHeader: FC = () => {
  const [hidden, setHidden]     = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > lastScrollY.current && y > 80);
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-black/[0.06]"
      style={{
        transform: hidden ? "translateY(-105%)" : "translateY(0)",
        transition: "transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <header className="flex items-center gap-6 px-10 py-3 max-w-[1400px] mx-auto">
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <LogoMark className="h-6 w-6" />
          <span
            style={{ fontFamily: "'Google Sans', sans-serif" }}
            className="text-[#202124] font-medium text-lg tracking-tight"
          >
            ProofMind
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 ml-4">
          {navLinks.map(({ label, to }) => (
            <Link
              key={label}
              to={to}
              className="px-4 py-2 rounded-full text-sm text-[#45474D] hover:text-[#121317] hover:bg-black/[0.04] transition-all duration-150"
              style={{ fontFamily: "'Google Sans', sans-serif" }}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex ml-auto items-center gap-2">
          <button
            onClick={() => navigate("/playground")}
            className="flex items-center gap-2 border border-black/[0.12] text-[#202124] text-sm px-5 py-2.5 rounded-full hover:bg-black/[0.04] transition-colors duration-150"
            style={{ fontFamily: "'Google Sans', sans-serif" }}
          >
            Playground
          </button>
          <Link
            to="/docs/quickstart/install"
            className="flex items-center gap-2 bg-[#4F46E5] text-white text-sm px-5 py-2.5 rounded-full hover:bg-[#4338CA] transition-colors duration-150"
            style={{ fontFamily: "'Google Sans', sans-serif" }}
          >
            Get started
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>
        </div>

        <button
          className="md:hidden ml-auto p-2 rounded-full hover:bg-black/[0.04] transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className="material-symbols-outlined text-[24px] text-[#202124]">
            {menuOpen ? "close" : "dehaze"}
          </span>
        </button>
      </header>

      {menuOpen && (
        <nav className="md:hidden bg-white border-t border-black/[0.06]">
          {navLinks.map(({ label, to }, i) => (
            <Link
              key={label}
              to={to}
              onClick={() => setMenuOpen(false)}
              className="block px-10 py-5 text-xl font-light text-[#202124] border-b border-black/[0.06] hover:bg-black/[0.02] transition-colors"
              style={{ fontFamily: "'Google Sans', sans-serif", fontWeight: 350, borderTopWidth: i === 0 ? 1 : 0 }}
            >
              {label}
            </Link>
          ))}
          <div className="flex gap-3 px-10 py-6">
            <Link
              to="/playground"
              onClick={() => setMenuOpen(false)}
              className="flex-1 text-center border border-black/[0.12] text-[#202124] text-base py-3 rounded-full hover:bg-black/[0.04] transition-colors"
              style={{ fontFamily: "'Google Sans', sans-serif" }}
            >
              Playground
            </Link>
            <Link
              to="/docs/quickstart/install"
              onClick={() => setMenuOpen(false)}
              className="flex-1 text-center bg-[#4F46E5] text-white text-base py-3 rounded-full hover:bg-[#4338CA] transition-colors"
              style={{ fontFamily: "'Google Sans', sans-serif" }}
            >
              Get started
            </Link>
          </div>
        </nav>
      )}
    </div>
  );
};
