import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Shield, LayoutDashboard, Database, CheckCircle, Users,
  Code2, ChevronLeft, ChevronRight, Bell, Settings,
  ArrowLeft, Github, Menu, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Database, label: "Model Registry", path: "/model-registry" },
  { icon: CheckCircle, label: "Verification", path: "/verification" },
  { icon: Users, label: "Regulator Portal", path: "/regulator" },
  { icon: Code2, label: "SDK Console", path: "/sdk-console" },
];

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export default function AppLayout({ children, title, subtitle }: AppLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:relative z-50 h-full flex flex-col bg-card border-r border-border
          transition-all duration-300
          ${collapsed ? "w-16" : "w-60"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
        style={{ minHeight: "100vh" }}
      >
        {/* Logo */}
        <div className={`flex items-center h-16 border-b border-border px-4 ${collapsed ? "justify-center" : "justify-between"}`}>
          {!collapsed && (
            <Link to="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <Shield className="w-4 h-4 text-primary" />
              </div>
              <span className="font-bold text-sm">ProofMind</span>
            </Link>
          )}
          {collapsed && (
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary" />
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-1 rounded hover:bg-secondary transition-colors"
          >
            {collapsed
              ? <ChevronRight className="w-4 h-4 text-muted-foreground" />
              : <ChevronLeft className="w-4 h-4 text-muted-foreground" />
            }
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-4 px-2 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group
                  ${isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }
                  ${collapsed ? "justify-center" : ""}
                `}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-primary" : ""}`} />
                {!collapsed && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
                {!collapsed && item.label === "Regulator Portal" && (
                  <Badge variant="outline" className="ml-auto text-[9px] py-0 h-4 text-accent border-accent/30">
                    READ-ONLY
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom links */}
        <div className="p-2 border-t border-border space-y-1">
          <Link
            to="/"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-all ${collapsed ? "justify-center" : ""}`}
          >
            <ArrowLeft className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span className="text-sm">Back to Site</span>}
          </Link>
          {!collapsed && (
            <a
              href="https://github.com/proofmind"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-all"
            >
              <Github className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">GitHub</span>
            </a>
          )}
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 border-b border-border bg-card/50 backdrop-blur flex items-center px-6 gap-4 sticky top-0 z-30">
          <button
            className="lg:hidden p-2 rounded hover:bg-secondary"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex-1">
            {title && (
              <div>
                <h1 className="text-sm font-semibold text-foreground">{title}</h1>
                {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[11px] font-medium text-green-600 dark:text-green-400">HCS Live</span>
            </div>
            <Button variant="ghost" size="icon" className="w-8 h-8 relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary" />
            </Button>
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
