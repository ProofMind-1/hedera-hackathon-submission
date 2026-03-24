import { Link } from "react-router-dom";
import { ArrowRight, FileText, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const posts = [
  {
    title: "Why Immutable AI Audit Trails Matter for EU AI Act Compliance",
    excerpt: "The EU AI Act mandates logging for high-risk AI systems. Internal logs aren't enough. Here's why cryptographic notarization is the answer.",
    date: "March 5, 2026",
    category: "Compliance",
    slug: "eu-ai-act-compliance",
  },
  {
    title: "Introducing ProofMind: Cryptographic Proof for AI Decisions",
    excerpt: "We're launching ProofMind to bring cryptographic verifiability to enterprise AI. Here's the problem we're solving and how we built it.",
    date: "March 1, 2026",
    category: "Product",
    slug: "introducing-proofmind",
  },
  {
    title: "How We Chose Hedera for Immutable AI Audit Infrastructure",
    excerpt: "Comparing blockchain options for enterprise AI auditing. Why Hedera's consensus service is the right choice for sub-second finality at scale.",
    date: "February 25, 2026",
    category: "Technical",
    slug: "why-hedera",
  },
  {
    title: "The Trust Gap in Enterprise AI: A Technical Analysis",
    excerpt: "AI systems make critical decisions, but verification relies on internal logs. We analyze the trust gap and propose a cryptographic solution.",
    date: "February 20, 2026",
    category: "Research",
    slug: "trust-gap-analysis",
  },
];

const Blog = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container px-6">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-gradient">Blog</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Technical articles, product updates, and insights on AI governance and compliance.
            </p>
          </div>

          {/* Posts */}
          <div className="max-w-3xl mx-auto">
            <div className="space-y-8">
              {posts.map((post) => (
                <article 
                  key={post.slug}
                  className="p-6 rounded-xl bg-gradient-card border border-border hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-2 py-1 rounded text-xs font-medium bg-primary/10 text-primary">
                      {post.category}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {post.date}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold mb-2 hover:text-primary transition-colors cursor-pointer">
                    {post.title}
                  </h2>
                  <p className="text-muted-foreground text-sm mb-4">{post.excerpt}</p>
                  <Button variant="ghost" size="sm" className="gap-1 p-0 h-auto text-primary">
                    Read more <ArrowRight className="w-3 h-3" />
                  </Button>
                </article>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
