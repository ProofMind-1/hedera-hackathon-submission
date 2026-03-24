import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  className?: string;
}

const tokenPatterns: Record<string, { pattern: RegExp; className: string }[]> = {
  python: [
    { pattern: /("""[\s\S]*?"""|'''[\s\S]*?''')/g, className: "text-accent/80" }, // docstrings
    { pattern: /(#.*$)/gm, className: "text-muted-foreground/60 italic" }, // comments
    { pattern: /("[^"]*"|'[^']*')/g, className: "text-accent" }, // strings
    { pattern: /\b(from|import|def|return|class|async|await|if|else|elif|for|in|while|try|except|finally|with|as|None|True|False|and|or|not|is|lambda|yield)\b/g, className: "text-primary font-medium" }, // keywords
    { pattern: /\b(self|cls)\b/g, className: "text-primary/70" }, // self/cls
    { pattern: /@[\w.]+/g, className: "text-accent font-medium" }, // decorators
    { pattern: /\b(\d+\.?\d*)\b/g, className: "text-accent" }, // numbers
    { pattern: /\b([A-Z][a-zA-Z0-9_]*)\b/g, className: "text-foreground" }, // classes
  ],
  javascript: [
    { pattern: /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm, className: "text-muted-foreground/60 italic" }, // comments
    { pattern: /(`[\s\S]*?`|"[^"]*"|'[^']*')/g, className: "text-accent" }, // strings
    { pattern: /\b(const|let|var|function|return|await|async|new|if|else|for|while|try|catch|finally|throw|class|extends|import|export|from|default|typeof|instanceof)\b/g, className: "text-primary font-medium" }, // keywords
    { pattern: /\b(true|false|null|undefined|this)\b/g, className: "text-primary/70" }, // literals
    { pattern: /\b(\d+\.?\d*)\b/g, className: "text-accent" }, // numbers
    { pattern: /\b([A-Z][a-zA-Z0-9_]*)\b/g, className: "text-foreground" }, // classes
  ],
  typescript: [
    { pattern: /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm, className: "text-muted-foreground/60 italic" },
    { pattern: /(`[\s\S]*?`|"[^"]*"|'[^']*')/g, className: "text-accent" },
    { pattern: /\b(const|let|var|function|return|await|async|new|if|else|for|while|try|catch|finally|throw|class|extends|import|export|from|default|typeof|instanceof|interface|type|as|implements)\b/g, className: "text-primary font-medium" },
    { pattern: /\b(true|false|null|undefined|this)\b/g, className: "text-primary/70" },
    { pattern: /\b(\d+\.?\d*)\b/g, className: "text-accent" },
    { pattern: /:\s*(string|number|boolean|any|void|never|unknown|object)\b/g, className: "text-accent/80" }, // types
  ],
  bash: [
    { pattern: /(#.*$)/gm, className: "text-muted-foreground/60 italic" },
    { pattern: /("[^"]*"|'[^']*')/g, className: "text-accent" },
    { pattern: /\b(npm|pip|yarn|pnpm|install|run|build|start|aws|docker|git|cd|ls|mkdir|rm|mv|cp|echo|export|sudo)\b/g, className: "text-primary font-medium" },
    { pattern: /(-{1,2}[\w-]+)/g, className: "text-accent/80" }, // flags
  ],
  json: [
    { pattern: /("[^"]*")(\s*:)/g, className: "text-primary" }, // keys
    { pattern: /:\s*("[^"]*")/g, className: "text-accent" }, // string values
    { pattern: /:\s*(\d+\.?\d*)/g, className: "text-accent" }, // numbers
    { pattern: /:\s*(true|false|null)/g, className: "text-primary/70" }, // literals
  ],
};

const highlightCode = (code: string, language: string): string => {
  const patterns = tokenPatterns[language] || tokenPatterns.javascript;
  
  // Create placeholder system to prevent double-highlighting
  const placeholders: string[] = [];
  let result = code;
  
  patterns.forEach(({ pattern, className }) => {
    result = result.replace(pattern, (match) => {
      const index = placeholders.length;
      placeholders.push(`<span class="${className}">${match}</span>`);
      return `__PLACEHOLDER_${index}__`;
    });
  });
  
  // Replace placeholders with actual spans
  placeholders.forEach((span, index) => {
    result = result.replace(`__PLACEHOLDER_${index}__`, span);
  });
  
  return result;
};

const CodeBlock = ({ code, language = "python", filename, className }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split("\n");

  return (
    <div className={cn("rounded-lg border border-border overflow-hidden bg-card", className)}>
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-secondary/50">
        <div className="flex items-center gap-3">
          {/* Traffic light dots */}
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-destructive/60" />
            <div className="w-3 h-3 rounded-full bg-accent/60" />
            <div className="w-3 h-3 rounded-full bg-primary/60" />
          </div>
          {filename && <span className="text-xs font-mono text-muted-foreground">{filename}</span>}
          {language && (
            <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary font-medium">
              {language}
            </span>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded hover:bg-secondary"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <div className="p-4 overflow-x-auto">
        <pre className="text-sm font-mono leading-relaxed">
          <code className="text-muted-foreground">
            {lines.map((line, index) => (
              <div key={index} className="flex">
                <span className="select-none w-8 text-right pr-4 text-muted-foreground/40 text-xs">
                  {index + 1}
                </span>
                <span
                  className="flex-1"
                  dangerouslySetInnerHTML={{ __html: highlightCode(line, language) || "&nbsp;" }}
                />
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
};

export default CodeBlock;
