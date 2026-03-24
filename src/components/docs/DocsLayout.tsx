import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Shield, Search, ChevronRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface TocItem {
  id: string;
  title: string;
  level: number;
}

interface DocsLayoutProps {
  children: React.ReactNode;
  toc?: TocItem[];
}

const sidebarNav = [
  {
    title: "Introduction",
    items: [
      { title: "What is ProofMind", href: "/docs" },
      { title: "Why AI Auditing Matters", href: "/docs/why-immutable-audits" },
      { title: "How It Works", href: "/docs/how-it-works" },
    ],
  },
  {
    title: "Quickstart",
    items: [
      { title: "Install SDK", href: "/docs/quickstart/install" },
      { title: "Initialize SDK", href: "/docs/quickstart/initialize" },
      { title: "First Notarization", href: "/docs/quickstart/wrap-inference" },
      { title: "Verify Notarizations", href: "/docs/quickstart/verify" },
    ],
  },
  {
    title: "SDK",
    items: [
      { title: "Python SDK", href: "/docs/sdk/python" },
      { title: "Node SDK", href: "/docs/sdk/nodejs" },
      { title: "Decorator Usage", href: "/docs/examples/decorator" },
      { title: "Manual Notarization", href: "/docs/examples/manual" },
      { title: "Batch Notarization", href: "/docs/examples/batch" },
    ],
  },
  {
    title: "Architecture",
    items: [
      { title: "System Architecture", href: "/docs/architecture/overview" },
      { title: "Data Flow", href: "/docs/architecture/data-flow" },
      { title: "Hedera Integration", href: "/docs/architecture/hedera-hcs" },
      { title: "AWS KMS Integration", href: "/docs/architecture/aws-kms" },
      { title: "Hashing Model", href: "/docs/architecture/hashing" },
    ],
  },
  {
    title: "Model Registry",
    items: [
      { title: "Registering Models", href: "/docs/model-registry/register" },
      { title: "Model Lifecycle", href: "/docs/model-registry/lifecycle" },
      { title: "Governance Rules", href: "/docs/model-registry/versioning" },
    ],
  },
  {
    title: "Audit Agents",
    items: [
      { title: "Real-Time Monitoring", href: "/docs/audit-agent/overview" },
      { title: "Anomaly Detection", href: "/docs/audit-agent/anomaly-detection" },
      { title: "Regulator Queries", href: "/docs/audit-agent/queries" },
      { title: "Compliance Reports", href: "/docs/audit-agent/reports" },
    ],
  },
  {
    title: "Verification",
    items: [
      { title: "Single Decision Verification", href: "/docs/verification/single" },
      { title: "Batch Verification", href: "/docs/verification/batch" },
      { title: "Tamper Detection", href: "/docs/verification/tamper-detection" },
    ],
  },
  {
    title: "Compliance",
    items: [
      { title: "EU AI Act", href: "/docs/compliance/eu-ai-act" },
      { title: "Financial AI Regulations", href: "/docs/compliance/sec" },
      { title: "Healthcare AI", href: "/docs/compliance/hipaa" },
    ],
  },
  {
    title: "Security",
    items: [
      { title: "Hashing", href: "/docs/security/hashing" },
      { title: "Key Management", href: "/docs/security/key-management" },
      { title: "Threat Model", href: "/docs/security/threat-model" },
    ],
  },
];

const DocsLayout = ({ children, toc = [] }: DocsLayoutProps) => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Intersection observer for TOC highlighting
  useEffect(() => {
    if (toc.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -80% 0px" }
    );
    toc.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [toc]);

  const filteredNav = searchQuery
    ? sidebarNav
        .map((group) => ({
          ...group,
          items: group.items.filter((item) =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase())
          ),
        }))
        .filter((group) => group.items.length > 0)
    : sidebarNav;

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between h-full px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <Link to="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center">
                <Shield className="w-4 h-4 text-primary" />
              </div>
              <span className="font-bold">ProofMind</span>
            </Link>
            <span className="text-muted-foreground text-sm hidden sm:inline">/</span>
            <span className="text-sm text-muted-foreground hidden sm:inline">Documentation</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="outline" size="sm">Back to Home</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex pt-14">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed top-14 bottom-0 w-72 border-r border-border bg-background overflow-y-auto z-40 transition-transform lg:translate-x-0",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {/* Search */}
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search docs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-secondary border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <nav className="p-4 space-y-6">
            {filteredNav.map((group) => (
              <div key={group.title}>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  {group.title}
                </h4>
                <ul className="space-y-0.5">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        to={item.href}
                        className={cn(
                          "block px-3 py-1.5 text-sm rounded-md transition-colors",
                          location.pathname === item.href
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                        )}
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 lg:ml-72 min-w-0">
          <div className="max-w-4xl mx-auto px-6 py-10 lg:pr-72">
            {children}
          </div>
        </main>

        {/* Right TOC */}
        {toc.length > 0 && (
          <aside className="hidden lg:block fixed top-14 right-0 w-64 h-[calc(100vh-3.5rem)] overflow-y-auto p-6">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              On this page
            </h4>
            <ul className="space-y-1">
              {toc.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className={cn(
                      "block text-sm py-1 transition-colors",
                      item.level > 2 ? "pl-4" : "",
                      activeId === item.id
                        ? "text-primary font-medium"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </aside>
        )}
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-background/80 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </div>
  );
};

export default DocsLayout;
