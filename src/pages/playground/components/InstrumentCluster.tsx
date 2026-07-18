import type { GateStatus, RelayStep } from "../lib/pipeline";

export interface ClusterGates {
  lint: GateStatus;
  types: GateStatus;
  render: GateStatus;
  qa: GateStatus;
}

interface InstrumentClusterProps {
  steps: RelayStep[];
  narration: string;
  activeLabel: string | null;
  gates: ClusterGates;
  running: boolean;
}

const GATE_ORDER: (keyof ClusterGates)[] = ["lint", "types", "render", "qa"];

function gateClasses(status: GateStatus): { dot: string; box: string } {
  switch (status) {
    case "pass":
      return { dot: "bg-success shadow-[0_0_8px_rgba(74,222,128,0.5)]", box: "border-success/25 text-fg" };
    case "fail":
      return { dot: "bg-danger shadow-[0_0_8px_rgba(232,93,93,0.5)]", box: "border-danger/30 text-fg" };
    case "running":
      return { dot: "bg-accent pg-pulse", box: "border-accent/30 text-fg" };
    default:
      return { dot: "bg-fg-muted", box: "border-border-faint text-fg-tertiary opacity-60" };
  }
}

// The signature: the pipeline made into a live console. Relay steps light
// left-to-right as the senior team works; the gates read their verdict at a
// glance. Driven entirely by the frozen SSE stage events.
export default function InstrumentCluster({
  steps,
  narration,
  activeLabel,
  gates,
  running,
}: InstrumentClusterProps) {
  return (
    <div className="rule relative overflow-hidden rounded-xl border-border-soft bg-bg-overlay px-5 py-4">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.16]"
        style={{
          background:
            "radial-gradient(120% 80% at 18% -10%, var(--accent-glow), transparent 55%)",
        }}
      />
      <div className="relative">
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-2.5 text-sm text-fg">
            {running && <span className="h-1.5 w-1.5 rounded-full bg-accent pg-pulse" />}
            <span>{narration}</span>
          </p>
          {activeLabel && (
            <span className="font-mono text-[11px] uppercase tracking-wider text-fg-tertiary tabular-nums">
              {activeLabel}
            </span>
          )}
        </div>

        {/* relay */}
        <div className="mt-4 flex items-center">
          {steps.map((step, i) => (
            <div key={step.id} className="relative flex flex-1 flex-col items-center gap-2">
              {i > 0 && (
                <span
                  aria-hidden
                  className={`absolute left-[-50%] top-[6.5px] h-0.5 w-full ${
                    step.status === "done" ? "bg-success/50" : "bg-border-faint"
                  }`}
                />
              )}
              <span
                className={`relative z-10 h-[15px] w-[15px] rounded-full border-2 bg-bg-base ${
                  step.status === "done"
                    ? "border-success bg-success shadow-[0_0_0_3px_rgba(74,222,128,0.14)]"
                    : step.status === "active"
                      ? "border-accent shadow-[0_0_0_3px_var(--accent-glow)] pg-pulse"
                      : "border-border-active"
                }`}
              />
              <span
                className={`font-mono text-[10px] uppercase tracking-wide ${
                  step.status === "active"
                    ? "text-accent"
                    : step.status === "done"
                      ? "text-fg-secondary"
                      : "text-fg-tertiary"
                }`}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>

        {/* gates */}
        <div className="rule-t mt-4 flex items-center gap-2.5 pt-3.5">
          <span className="mr-0.5 font-mono text-[10px] uppercase tracking-widest text-fg-muted">
            gates
          </span>
          {GATE_ORDER.map((name) => {
            const cls = gateClasses(gates[name]);
            return (
              <span
                key={name}
                className={`flex items-center gap-1.5 rounded-md border bg-bg-base px-2.5 py-1.5 font-mono text-[11px] ${cls.box}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${cls.dot}`} />
                {name}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
