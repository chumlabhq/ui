import type { QaFinding } from "../types";

// Mirrors the Phase 4.1 verify indicator, for the separate-context QA review.
export type QaUIState =
  | { phase: "reviewing" }
  | { phase: "fixing"; findings: QaFinding[] }
  | { phase: "passed"; fixed: boolean }
  | { phase: "warnings"; findings: QaFinding[] };

export default function QaIndicator({ state }: { state: QaUIState }) {
  if (state.phase === "reviewing") {
    return <p className="text-xs text-fg-secondary">QA reviewing the build...</p>;
  }
  if (state.phase === "fixing") {
    return (
      <div className="text-xs text-accent">
        <p>
          QA found {state.findings.length} thing{state.findings.length === 1 ? "" : "s"} — fixing...
        </p>
        <ul className="mt-1 space-y-0.5 text-fg-tertiary">
          {state.findings.slice(0, 3).map((f, i) => (
            <li key={i} className="truncate">
              [{f.severity}] {f.location ? `${f.location} ` : ""}
              {f.description}
            </li>
          ))}
        </ul>
      </div>
    );
  }
  if (state.phase === "passed") {
    return (
      <p className="text-xs text-success">
        QA passed{state.fixed ? " · fixed after review" : " · looks good"}
      </p>
    );
  }
  return (
    <div className="text-xs text-warning">
      <p>
        QA flagged {state.findings.length} unresolved issue
        {state.findings.length === 1 ? "" : "s"}:
      </p>
      <ul className="mt-1 space-y-0.5 text-fg-tertiary">
        {state.findings.slice(0, 3).map((f, i) => (
          <li key={i} className="truncate">
            [{f.severity}] {f.location ? `${f.location} ` : ""}
            {f.description}
          </li>
        ))}
      </ul>
    </div>
  );
}
