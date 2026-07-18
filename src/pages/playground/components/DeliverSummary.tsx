import { useState } from "react";

interface DeliverSummaryProps {
  code: string;
  primitives: string[];
  assumptions: string[];
  verified: boolean;
  qaPassed: boolean;
}

// The PR-style handoff: what shipped, and — surfaced prominently — the
// assumptions the pipeline made, so the user can correct after (the Option-A
// answer to the logo/theme question). Plus one-click copy.
export default function DeliverSummary({
  code,
  primitives,
  assumptions,
  verified,
  qaPassed,
}: DeliverSummaryProps) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    void navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  };

  return (
    <div className="rule flex flex-col gap-2.5 rounded-lg border-border-faint bg-bg-elevated px-4 py-3">
      <div className="flex items-center justify-between">
        <b className="text-[13px] font-medium tracking-[-0.01em]">Delivered</b>
        <span className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wide text-success">
          {verified && <span>✓ verified</span>}
          {qaPassed && <span className="text-fg-tertiary">· qa passed</span>}
        </span>
      </div>

      {primitives.length > 0 && (
        <p className="text-xs text-fg-secondary">
          Built with{" "}
          {primitives.map((p, i) => (
            <span key={p}>
              <span className="text-accent">{p}</span>
              {i < primitives.length - 1 ? ", " : ""}
            </span>
          ))}
          .
        </p>
      )}

      {assumptions.map((a, i) => (
        <div key={i} className="flex gap-2.5 text-xs leading-relaxed text-fg-secondary">
          <span className="h-fit flex-shrink-0 rounded border border-warning/30 px-1.5 py-0.5 font-mono text-[9.5px] uppercase tracking-wide text-warning">
            assumed
          </span>
          <span>{a}</span>
        </div>
      ))}

      <button
        type="button"
        onClick={copy}
        className="rule mt-0.5 w-fit rounded-md border-border-soft bg-bg-base px-3 py-1.5 text-xs text-fg-secondary transition-colors hover:border-border-active hover:text-fg"
      >
        {copied ? "Copied" : "Copy code"}
      </button>
    </div>
  );
}
