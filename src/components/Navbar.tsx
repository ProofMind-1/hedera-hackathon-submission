import { useState } from "react";
import { Link } from "react-router-dom";
import { Shield, Menu, X, ChevronDown, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xl font-bold">ProofMind</span>
          </Link>
          
          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1">
                  Product <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-44">
                <DropdownMenuItem asChild><a href="/#features">Features</a></DropdownMenuItem>
                <DropdownMenuItem asChild><a href="/#use-cases">Use Cases</a></DropdownMenuItem>
                <DropdownMenuItem asChild><a href="/#compliance">Compliance</a></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/architecture">Architecture</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/pricing">Pricing</Link></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1">
                  Developers <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-44">
                <DropdownMenuItem asChild><Link to="/docs">Documentation</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/docs/quickstart/install">Quick Start</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/docs/sdk/python">Python SDK</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/docs/sdk/nodejs">Node.js SDK</Link></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link to="/sdk">
              <Button variant="ghost" size="sm">SDK</Button>
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <a href="https://github.com/proofmind" target="_blank" rel="noopener noreferrer" className="hidden sm:flex">
              <Button variant="ghost" size="icon" className="w-9 h-9">
                <Github className="w-4 h-4" />
              </Button>
            </a>
            <Link to="/playground">
              <Button size="sm" className="bg-violet-600 hover:bg-violet-500 text-white hidden md:flex">
                Playground
              </Button>
            </Link>
            <Link to="/docs/quickstart/install">
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Get Started
              </Button>
            </Link>
            <button className="lg:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-2">
              <a href="/#features" className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground">Features</a>
              <a href="/#use-cases" className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground">Use Cases</a>
              <a href="/#compliance" className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground">Compliance</a>
              <Link to="/sdk" className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground">SDK</Link>
              <Link to="/docs" className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground">Docs</Link>
              <Link to="/pricing" className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground">Pricing</Link>
              <Link to="/playground" className="px-3 py-2 text-sm font-medium text-violet-400 hover:text-violet-300">Playground</Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
