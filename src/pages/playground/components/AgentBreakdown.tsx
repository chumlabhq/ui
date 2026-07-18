import { useState } from "react";
import type { AgentNode, AgentRunState, AgentStatus } from "../lib/agents";

interface AgentBreakdownProps {
  state: AgentRunState;
  elapsedLabel?: string | null;
}

const CHECK = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden>
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

function statusWord(status: AgentStatus): string {
  if (status === "waiting") return "waiting for you";
  return status;
}

function AgentRow({ node, last }: { node: AgentNode; last: boolean }) {
  const running = node.status === "running" || node.status === "waiting";
  const done = node.status === "done";
  return (
    <div className="relative py-2 pl-[42px] pr-3.5">
      {!last && (
        <span
          aria-hidden
          className={`absolute left-[22px] top-6 bottom-[-2px] w-[1.5px] ${
            done ? "bg-accent" : "bg-border-soft"
          }`}
        />
      )}
      <span
        aria-hidden
        className={`absolute left-3.5 top-2.5 grid h-[17px] w-[17px] place-items-center rounded-full border-[1.5px] transition ${
          done
            ? "border-accent bg-accent"
            : running
              ? "border-accent bg-bg-elevated shadow-[0_0_0_4px_var(--accent-bg,rgba(91,155,255,0.12)),0_0_10px_var(--accent-glow)] pg-pulse"
              : "border-border-active bg-bg-elevated"
        }`}
      >
        <span className={`h-[9px] w-[9px] text-bg-base ${done ? "opacity-100" : "opacity-0"}`}>
          {CHECK}
        </span>
      </span>

      <div className="flex items-baseline gap-1.5">
        <span className="font-display text-[12.5px] font-semibold">{node.name}</span>
        <span className="truncate text-[11px] text-fg-tertiary">· {node.role}</span>
        <span
          className={`ml-auto font-mono text-[9px] uppercase tracking-[0.05em] ${
            running ? "text-accent" : done ? "text-fg-tertiary" : "text-fg-muted"
          }`}
        >
          {statusWord(node.status)}
        </span>
      </div>

      {node.substeps.length > 0 && (
        <div className="mt-1.5 flex flex-col gap-1">
          {node.substeps.map((s, i) => (
            <div key={i} className="flex items-center gap-1.5 text-[11.5px] text-fg-secondary pg-settle">
              <span className={`h-3 w-3 ${s.ok ? "text-success" : "text-danger"}`}>
                {s.ok ? (
                  CHECK
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden>
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                )}
              </span>
              {s.text}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// The Cursor-style agent activity: 4 folded agents streaming their sub-steps,
// collapsed by default, opening while a build runs and settling back after.
// A polite live region so screen readers hear progress without being flooded.
export default function AgentBreakdown({ state, elapsedLabel }: AgentBreakdownProps) {
  const { running, agents, label, activated } = state;

  // Open by default — the timeline is the interesting part; it collapses only
  // when the user chooses to.
  const [open, setOpen] = useState(true);

  // While running, show the whole relay (upcoming agents queued). Once done,
  // only the agents that actually ran — a single-tier build never runs QA, so
  // it must not linger as a stuck "queued" row (its gate still reads pass).
  const visibleAgents = running ? agents : agents.filter((a) => activated.includes(a.id));

  return (
    <div className="rule mt-3 shrink-0 overflow-hidden rounded-[10px] border-border-soft bg-bg-elevated">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center gap-2.5 px-3.5 py-3 text-left"
      >
        {running ? (
          <span className="grid h-5 w-5 place-items-center rounded-full bg-accent/12" aria-hidden>
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.6" className="h-3 w-3">
              <path d="M12 3a9 9 0 1 0 9 9" strokeLinecap="round">
                <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite" />
              </path>
            </svg>
          </span>
        ) : (
          <span className="grid h-5 w-5 place-items-center rounded-full bg-success/15" aria-hidden>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" className="h-3 w-3 text-success">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </span>
        )}
        <span
          className={`min-w-0 flex-1 truncate text-[12.5px] font-medium ${
            running ? "pg-shimmer-text" : "text-fg-secondary"
          }`}
          aria-live="polite"
        >
          {running ? label || "Building your component…" : label || "Done"}
          {!running && elapsedLabel ? ` · ${elapsedLabel}` : ""}
        </span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`h-3.5 w-3.5 text-fg-tertiary transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="rule-t border-border-faint pb-2 pt-1">
          {visibleAgents.map((node, i) => (
            <AgentRow key={node.id} node={node} last={i === visibleAgents.length - 1} />
          ))}
        </div>
      )}
    </div>
  );
}
