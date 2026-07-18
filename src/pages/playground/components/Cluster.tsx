import { useState } from "react";
import type { GateStatus } from "../lib/pipeline";

export interface ClusterGateReadout {
  lint: GateStatus;
  types: GateStatus;
  render: GateStatus;
  qa: GateStatus;
}

interface ClusterProps {
  gates: ClusterGateReadout;
  sizeKb: number | null;
  a11y: string | null;
  code?: string | null;
}

const GATE_ORDER: (keyof ClusterGateReadout)[] = ["lint", "types", "render", "qa"];

function dotClass(status: GateStatus): string {
  switch (status) {
    case "pass":
      return "bg-success shadow-[0_0_6px_var(--success-glow)]";
    case "fail":
      return "bg-danger shadow-[0_0_6px_rgba(232,93,93,0.5)]";
    case "running":
      return "bg-accent pg-pulse";
    default:
      return "bg-fg-muted";
  }
}

// The slim gate bar: the deliver verdict as a seal, four lamps, the a11y/size
// readout, and the share-code actions — all on one line.
export default function Cluster({ gates, sizeKb, a11y, code }: ClusterProps) {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  const values = GATE_ORDER.map((g) => gates[g]);
  const anyFail = values.some((v) => v === "fail");
  const anyRunning = values.some((v) => v === "running");
  const allPass = values.every((v) => v === "pass");
  const failCount = values.filter((v) => v === "fail").length;

  const seal = anyFail
    ? { text: `FAILED · ${failCount}`, cls: "text-danger", glow: "rgba(232,93,93,0.5)" }
    : anyRunning
      ? { text: "CHECKING", cls: "text-accent", glow: "var(--accent-glow)" }
      : allPass
        ? { text: "PASSED", cls: "text-success", glow: "var(--success-glow)" }
        : { text: "IDLE", cls: "text-fg-tertiary", glow: "transparent" };

  const copy = () => {
    if (!code) return;
    void navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const share = () => {
    if (!code) return;
    if (typeof navigator.share === "function") {
      void navigator.share({ title: "Chumlab component", text: code }).catch(() => {});
      return;
    }
    void navigator.clipboard.writeText(code).then(() => {
      setShared(true);
      setTimeout(() => setShared(false), 1500);
    });
  };

  return (
    <div className="rule-t flex h-11 shrink-0 items-center gap-3 overflow-x-auto border-border-soft bg-bg-elevated/40 px-4">
      <span className="flex shrink-0 items-center gap-1.5">
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden
          className={seal.cls}
          style={{ filter: `drop-shadow(0 0 4px ${seal.glow})` }}
        >
          <path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6z" />
          {allPass && !anyFail && !anyRunning && <path d="M9 12l2 2 4-4" />}
        </svg>
        <span className={`font-mono text-[11px] font-medium tracking-[0.04em] ${seal.cls}`}>{seal.text}</span>
      </span>

      <span className="h-3.5 w-px shrink-0 bg-border-faint" aria-hidden />

      <div className="flex shrink-0 items-center gap-2.5">
        {GATE_ORDER.map((name) => (
          <span key={name} className="flex items-center gap-1.5">
            <span className={`h-1.5 w-1.5 rounded-full ${dotClass(gates[name])}`} />
            <span className="font-mono text-[10.5px] tracking-[0.03em] text-fg-tertiary">{name}</span>
          </span>
        ))}
      </div>

      <span className="ml-auto flex shrink-0 items-center gap-2.5 font-mono text-[10.5px] text-fg-tertiary">
        {a11y && (
          <span>
            a11y <b className="font-medium text-fg-secondary">{a11y}</b>
          </span>
        )}
        {sizeKb != null && (
          <span>
            <b className="font-medium text-fg-secondary">{sizeKb}</b>kb
          </span>
        )}
      </span>

      {code && (
        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={copy}
            className="rounded-md border-[0.5px] border-border-faint px-2.5 py-1 text-[11px] text-fg-secondary transition-colors hover:bg-fg/[0.045] hover:text-fg"
          >
            {copied ? "Copied" : "Copy"}
          </button>
          <button
            type="button"
            onClick={share}
            className="rounded-md border-[0.5px] border-border-faint px-2.5 py-1 text-[11px] text-fg-secondary transition-colors hover:bg-fg/[0.045] hover:text-fg"
          >
            {shared ? "Copied" : "Share"}
          </button>
        </div>
      )}
    </div>
  );
}
