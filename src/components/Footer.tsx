import { Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="py-24 relative border-t border-border">
      <div className="container px-6">
        {/* CTA Section */}
        <div className="max-w-3xl mx-auto text-center mb-16 pb-16 border-b border-border">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Make Your AI{' '}
            <span className="text-gradient">Auditable</span>?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join enterprises building trust through transparency. 
            Start with our free tier — no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/docs/quickstart/install">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow px-8">
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-border hover:bg-secondary px-8">
              Schedule Demo
            </Button>
          </div>
        </div>
        
        {/* Footer links */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <span className="text-lg font-bold">ProofMind</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Immutable audit infrastructure for enterprise AI.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              <li><a href="/#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a></li>
              <li><Link to="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</Link></li>
              <li><Link to="/security" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Security</Link></li>
              <li><a href="/#use-cases" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Use Cases</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Developers</h4>
            <ul className="space-y-2">
              <li><Link to="/docs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Documentation</Link></li>
              <li><Link to="/sdk" className="text-sm text-muted-foreground hover:text-foreground transition-colors">SDK Overview</Link></li>
              <li><Link to="/docs/sdk/python" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Python SDK</Link></li>
              <li><Link to="/docs/sdk/nodejs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Node.js SDK</Link></li>
              <li><Link to="/architecture" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Architecture</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Blog</Link></li>
              <li><Link to="/changelog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Changelog</Link></li>
              <li><a href="https://github.com/proofmind" className="text-sm text-muted-foreground hover:text-foreground transition-colors">GitHub</a></li>
              <li><Link to="/docs/quickstart/install" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Quick Start</Link></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Status</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link to="/company" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</Link></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Careers</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</a></li>
              <li><a href="https://twitter.com/proofmind" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Twitter</a></li>
            </ul>
          </div>
        </div>
        
        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            © 2026 ProofMind. All rights reserved.
          </p>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
