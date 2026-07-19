import { GATE_LABELS, GATE_ORDER, allGatesPassed, type GateLamps, type LampState } from "../lib/gates";

// Fixed petrol palette — this bar is the preview chrome's status strip and stays
// petrol-dark in both app themes, so the colors are literal (per spec), not the
// theme-flipping tokens.
const RING = "rgba(237,239,244,0.2)";
const LABEL_DIM = "rgba(237,239,244,0.6)";
const LABEL_ACTIVE = "#edeff4";
const PASS = "#5b9bff";
const FAIL = "#e85d5d";

function lampFill(state: LampState): string {
  if (state === "passed") return PASS;
  if (state === "failed") return FAIL;
  return "transparent";
}

function Lamp({ id, state }: { id: keyof typeof GATE_LABELS; state: LampState }) {
  const resolved = state === "passed" || state === "failed";
  const active = resolved || state === "running";
  return (
    <div className="flex flex-col items-center gap-1.5">
      <span
        className={`h-3 w-3 rounded-full border ${state === "running" ? "motion-safe:animate-pulse" : ""}`}
        style={{ borderColor: resolved ? "transparent" : RING, backgroundColor: lampFill(state) }}
        aria-hidden
      />
      <span
        className="font-mono text-[11px] uppercase tracking-[0.12em] transition-colors"
        style={{ color: active ? LABEL_ACTIVE : LABEL_DIM }}
      >
        {GATE_LABELS[id]}
      </span>
      <span className="sr-only">{`${GATE_LABELS[id]}: ${state}`}</span>
    </div>
  );
}

// Sticky status strip at the bottom of the preview pane: six gate lamps driven
// by real pipeline state, plus a PASSED seal that appears only when all six are
// green. Petrol surface, hairline top rule, no gradients or glows.
export default function GateCluster({ lamps }: { lamps: GateLamps }) {
  const passed = allGatesPassed(lamps);
  return (
    <div
      className="shrink-0"
      style={{ background: "#070c10", borderTop: "0.5px solid rgba(237,239,244,0.08)", borderRadius: 0 }}
    >
      <div className="relative flex flex-wrap items-center justify-center gap-x-7 gap-y-3 px-5 py-3">
        <div className="flex items-center gap-7" role="list" aria-label="Build gates">
          {GATE_ORDER.map((id) => (
            <div role="listitem" key={id}>
              <Lamp id={id} state={lamps[id]} />
            </div>
          ))}
        </div>

        <div
          className={`transition-opacity duration-300 sm:absolute sm:right-5 sm:top-1/2 sm:-translate-y-1/2 ${
            passed ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          aria-hidden={!passed}
        >
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.12em]"
            style={{ background: "#0c141b", border: `0.5px solid rgba(91,155,255,0.4)`, color: PASS }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="h-3 w-3" aria-hidden>
              <path d="M20 6L9 17l-5-5" />
            </svg>
            Passed
          </span>
        </div>

        <span className="sr-only" aria-live="polite">
          {passed ? "All six gates passed" : ""}
        </span>
      </div>
    </div>
  );
}
