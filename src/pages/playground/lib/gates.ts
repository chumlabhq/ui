import type { DeliverGates, PipelineEvent } from "../types";
import type { RenderGateStatus } from "../components/VerifyIndicator";

// Six pipeline gates surfaced as lamps. Five stream over SSE (verify substeps +
// the qa stage); render is a client-side probe (renderGate). The reducer here
// binds ONLY to real pipeline state — see the audit: no invented state.
export type GateId = "lint" | "types" | "render" | "qa" | "responsive" | "safety";
export type LampState = "pending" | "running" | "passed" | "failed";
export type GateLamps = Record<GateId, LampState>;

export const GATE_ORDER: GateId[] = ["lint", "types", "render", "qa", "responsive", "safety"];

export const GATE_LABELS: Record<GateId, string> = {
  lint: "Lint",
  types: "Types",
  render: "Render",
  qa: "QA",
  responsive: "Responsive",
  safety: "Safety",
};

// The four verify substeps carry plain-English text; map each to its gate.
type StreamGate = Exclude<GateId, "render">;
const VERIFY_GATES: StreamGate[] = ["lint", "types", "responsive", "safety"];

function gateForSubstep(text: string): StreamGate | null {
  if (text.startsWith("No banned")) return "lint";
  if (text.includes("Type-checks")) return "types";
  if (text.includes("Mobile-responsive")) return "responsive";
  if (text.includes("Content policy")) return "safety";
  return null;
}

// Fold the SSE log into the five stream gates. `verify.start` moves the four
// verify lamps to running (unless already passed, so a re-run shows red→running→
// blue); each `verify.substep` resolves its gate; the qa stage drives the qa
// lamp. `deliver.done` finalises anything still unresolved from its gate booleans
// (e.g. qa never ran on a single-tier build, or a lint short-circuit skipped the
// downstream verify substeps).
export function gatesFromEvents(events: PipelineEvent[]): Record<StreamGate, LampState> {
  const g: Record<StreamGate, LampState> = {
    lint: "pending",
    types: "pending",
    responsive: "pending",
    safety: "pending",
    qa: "pending",
  };

  for (const e of events) {
    if (e.stage === "verify") {
      if (e.status === "start") {
        for (const k of VERIFY_GATES) if (g[k] !== "passed") g[k] = "running";
      } else if (e.status === "substep") {
        const p = e.payload as { text?: string; ok?: boolean } | undefined;
        const id = p?.text ? gateForSubstep(p.text) : null;
        if (id) g[id] = p?.ok !== false ? "passed" : "failed";
      }
    } else if (e.stage === "qa") {
      if (e.status === "start") g.qa = "running";
      else if (e.status === "done") g.qa = (e.payload as { pass?: boolean })?.pass ? "passed" : "failed";
      else if (e.status === "error" && (e.payload as { fixing?: boolean })?.fixing) g.qa = "running";
    } else if (e.stage === "deliver" && e.status === "done") {
      const gates = (e.payload as { gates?: DeliverGates } | undefined)?.gates;
      if (gates) {
        for (const k of VERIFY_GATES) if (g[k] !== "passed" && g[k] !== "failed") g[k] = gates[k] ? "passed" : "failed";
        if (g.qa !== "passed" && g.qa !== "failed") g.qa = gates.qa ? "passed" : "failed";
      }
    }
  }

  return g;
}

// The full six-lamp state: stream gates + client render, with deliver.gates as
// the finalize/rehydrate backstop. During a live build the stream drives the
// lamps; on load or re-opening a completed run, `deliverGates` fills every lamp
// still pending so an old chat shows its final states, not stuck-pending.
export function resolveGateLamps(
  events: PipelineEvent[],
  renderGate: RenderGateStatus,
  deliverGates: DeliverGates | null
): GateLamps {
  const stream = gatesFromEvents(events);
  const lamps: GateLamps = {
    ...stream,
    render: renderGate === "idle" ? "pending" : renderGate,
  };

  if (deliverGates) {
    for (const id of GATE_ORDER) {
      if (lamps[id] === "pending") lamps[id] = deliverGates[id] ? "passed" : "failed";
    }
  }

  return lamps;
}

export const allGatesPassed = (lamps: GateLamps): boolean =>
  GATE_ORDER.every((id) => lamps[id] === "passed");
