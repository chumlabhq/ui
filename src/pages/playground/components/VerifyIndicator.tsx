import type { VerifyError } from "../types";

// Driven entirely by the frozen verify SSE events (round/pass/fixing/
// exhausted/errors) plus the client-side render gate - no parallel channel.
export type VerifyUIState =
  | { phase: "checking"; round: number }
  | { phase: "fixing"; round: number; errors: VerifyError[] }
  | { phase: "passed"; rounds: number; typecheckUnavailable?: boolean }
  | { phase: "warnings"; errors: VerifyError[] };

export type RenderGateStatus = "idle" | "running" | "passed" | "failed";

type GateStatus = "running" | "passed" | "failed" | "skipped" | "pending";

function Dot({ status }: { status: GateStatus }) {
  const color =
    status === "passed"
      ? "bg-success"
      : status === "failed"
        ? "bg-danger"
        : status === "running"
          ? "bg-accent animate-pulse"
          : "bg-border-active";
  return <span className={`inline-block h-1.5 w-1.5 rounded-full ${color}`} />;
}

function Gate({ label, status }: { label: string; status: GateStatus }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-fg-tertiary">
      <Dot status={status} />
      {label}
      {status === "skipped" && " (skipped)"}
    </span>
  );
}

// Server verify runs lint first and short-circuits, so the error kinds tell
// us exactly which gates ran: a lint failure means types never ran; a pure
// type failure means lint passed.
function serverGates(state: VerifyUIState): { lint: GateStatus; types: GateStatus } {
  if (state.phase === "checking") return { lint: "running", types: "running" };
  if (state.phase === "passed") {
    return { lint: "passed", types: state.typecheckUnavailable ? "skipped" : "passed" };
  }
  const kinds = new Set(state.errors.map((e) => e.kind));
  if (kinds.has("lint")) return { lint: "failed", types: "pending" };
  if (kinds.has("type")) return { lint: "passed", types: "failed" };
  // render-only failure: the server gates passed before delivery
  return { lint: "passed", types: "passed" };
}

interface VerifyIndicatorProps {
  state: VerifyUIState;
  renderGate: RenderGateStatus;
}

export default function VerifyIndicator({ state, renderGate }: VerifyIndicatorProps) {
  const { lint, types } = serverGates(state);
  const render: GateStatus =
    state.phase === "fixing" && state.errors.some((e) => e.kind === "render")
      ? "failed"
      : renderGate === "idle"
        ? "pending"
        : renderGate;

  let headline: React.ReactNode;
  if (state.phase === "checking") {
    headline = (
      <span className="text-fg-secondary">
        Verifying{state.round > 0 ? ` (fix round ${state.round}/2)` : ""}...
      </span>
    );
  } else if (state.phase === "fixing") {
    headline = (
      <span className="text-accent">
        Found {state.errors.length} issue{state.errors.length === 1 ? "" : "s"} — fixing
        {state.round > 0 ? ` (round ${state.round}/2)` : ""}...
      </span>
    );
  } else if (state.phase === "passed") {
    headline = (
      <span className="text-success">
        Verified
        {state.rounds > 0 && (
          <span className="text-fg-tertiary">
            {" "}
            · fixed after {state.rounds} round{state.rounds === 1 ? "" : "s"}
          </span>
        )}
      </span>
    );
  } else {
    headline = (
      <span className="text-warning">
        Delivered with {state.errors.length} unresolved issue
        {state.errors.length === 1 ? "" : "s"} after 2 fix rounds
      </span>
    );
  }

  return (
    <div className="rule rounded-lg bg-bg-elevated px-4 py-3 text-xs">
      <p>{headline}</p>
      <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
        <Gate label="lint" status={lint} />
        <Gate label="types" status={types} />
        <Gate label="render" status={render} />
      </p>
      {(state.phase === "fixing" || state.phase === "warnings") && (
        <ul className="mt-2 space-y-0.5 text-fg-tertiary">
          {state.errors.slice(0, 3).map((error, i) => (
            <li key={i} className="truncate">
              [{error.kind}] {error.loc ? `${error.loc} ` : ""}
              {error.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
