import { useState } from "react";

interface CodeCardProps {
  code: string;
  streaming?: boolean;
}

export default function CodeCard({ code, streaming = false }: CodeCardProps) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    void navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div className="rule overflow-hidden rounded-lg bg-bg-elevated">
      <div className="rule-b flex items-center justify-between px-4 py-2">
        <span className="font-mono text-xs text-fg-tertiary">Generated.tsx</span>
        {streaming ? (
          <span className="text-xs text-accent">streaming</span>
        ) : (
          <button
            type="button"
            onClick={copy}
            className="text-xs text-fg-tertiary transition-colors hover:text-fg"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        )}
      </div>
      <pre className="max-h-80 overflow-auto p-4 font-mono text-xs leading-relaxed text-fg-secondary">
        {code}
        {streaming && <span className="animate-cursor text-accent">▎</span>}
      </pre>
    </div>
  );
}
