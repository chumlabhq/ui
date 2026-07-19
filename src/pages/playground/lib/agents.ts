import type {
  DeliverEventPayload,
  DeliverGates,
  PipelineEvent,
  PipelineStage,
  StageStartPayload,
  SubstepEventPayload,
  TimelineEntry,
} from "../types";

// Canonical agent-persona map (Phase 10). The pipeline runs 7 stages; the panel
// folds them into 4 legible agents so the user watches a senior team, not a
// state machine. Mirrors chumlab-be's persona folding and the phase spec.
export type AgentId = "router" | "developer" | "verifier" | "qa";

export const AGENTS: Record<
  AgentId,
  { name: string; role: string; stages: PipelineStage[] }
> = {
  router: { name: "Router", role: "plans the build", stages: ["router", "clarify", "plan"] },
  developer: { name: "Developer", role: "writes the code", stages: ["develop"] },
  verifier: { name: "Verifier", role: "tests edge cases", stages: ["verify"] },
  qa: { name: "QA", role: "runs the gates", stages: ["qa"] },
};

export const AGENT_ORDER: AgentId[] = ["router", "developer", "verifier", "qa"];

// "deliver" is terminal — it closes the panel and lights the cluster; it is not
// an agent row. Every other stage folds onto exactly one agent.
export function stageToAgent(stage: PipelineStage): AgentId | null {
  if (stage === "deliver") return null;
  for (const id of AGENT_ORDER) {
    if (AGENTS[id].stages.includes(stage)) return id;
  }
  return null;
}

export type AgentStatus = "queued" | "running" | "done" | "waiting";

export interface AgentSubstep {
  text: string;
  ok: boolean;
}

export interface AgentNode {
  id: AgentId;
  name: string;
  role: string;
  status: AgentStatus;
  substeps: AgentSubstep[];
}

export interface AgentRunState {
  agents: AgentNode[]; // always 4, in AGENT_ORDER
  running: boolean;
  // Header line: the current stage's label while running, a summary when done.
  label: string;
  // The clarify pause — Router sits in a "waiting for you" state, panel opens.
  needsInput: boolean;
  failed: boolean;
  // Cluster metadata, populated on deliver.
  gates: DeliverGates | null;
  sizeKb: number | null;
  a11y: string | null;
  // Agents that actually ran (received a start/substep) — drives "Built by N".
  activated: AgentId[];
}

function node(id: AgentId): AgentNode {
  return { id, name: AGENTS[id].name, role: AGENTS[id].role, status: "queued", substeps: [] };
}

export function initialAgentRun(): AgentRunState {
  return {
    agents: AGENT_ORDER.map(node),
    running: false,
    label: "",
    needsInput: false,
    failed: false,
    gates: null,
    sizeKb: null,
    a11y: null,
    activated: [],
  };
}

const indexOfAgent = (id: AgentId) => AGENT_ORDER.indexOf(id);

// Pure reducer: folds one SSE event into the breakdown state. Unknown stages /
// statuses are ignored (forward-compatible). Time is intentionally NOT tracked
// here — the component measures elapsed separately so this stays deterministic
// and unit-testable.
export function reduceAgentRun(state: AgentRunState, event: PipelineEvent): AgentRunState {
  const { stage, status, payload } = event;
  const agentId = stageToAgent(stage);

  // deliver: terminal — light the cluster, settle every agent that ran.
  if (stage === "deliver") {
    if (status !== "done") return state;
    const p = (payload ?? {}) as DeliverEventPayload;
    const agents = state.agents.map((a) =>
      state.activated.includes(a.id) ? { ...a, status: "done" as AgentStatus } : a
    );
    return {
      ...state,
      agents,
      running: false,
      needsInput: false,
      gates: p.gates ?? state.gates,
      sizeKb: p.sizeKb ?? state.sizeKb,
      a11y: p.a11y ?? state.a11y,
      label: summaryLabel(state.activated, p.gates ?? state.gates),
    };
  }

  if (!agentId) return state;

  const activated = state.activated.includes(agentId)
    ? state.activated
    : [...state.activated, agentId];

  switch (status) {
    case "start": {
      const label = (payload as StageStartPayload)?.label;
      const idx = indexOfAgent(agentId);
      const agents = state.agents.map((a) => {
        if (a.id === agentId) return { ...a, status: "running" as AgentStatus };
        // Any earlier agent still shown as running has finished its turn.
        if (indexOfAgent(a.id) < idx && a.status === "running") {
          return { ...a, status: "done" as AgentStatus };
        }
        return a;
      });
      return {
        ...state,
        agents,
        activated,
        running: true,
        needsInput: false,
        label: label || AGENTS[agentId].role,
      };
    }

    case "substep": {
      const p = (payload ?? {}) as SubstepEventPayload;
      if (!p.text) return state;
      const agents = state.agents.map((a) =>
        a.id === agentId
          ? { ...a, substeps: [...a.substeps, { text: p.text, ok: p.ok !== false }] }
          : a
      );
      return { ...state, agents, activated, running: true };
    }

    case "needs_input": {
      // Clarify asked a question — Router waits on the user, panel stays open.
      const agents = state.agents.map((a) =>
        a.id === "router" ? { ...a, status: "waiting" as AgentStatus } : a
      );
      return { ...state, agents, activated, running: false, needsInput: true, label: "Waiting for you" };
    }

    case "error": {
      // A fixing error keeps the run alive; a fatal develop error stops it.
      const fixing = Boolean((payload as { fixing?: boolean })?.fixing);
      if (fixing) return { ...state, activated, running: true };
      return { ...state, activated, running: false, failed: true, label: "Something went wrong" };
    }

    default:
      // delta / done are handled implicitly — the agent stays running until the
      // next stage starts or deliver settles it.
      return { ...state, activated, running: status === "done" ? state.running : true };
  }
}

function summaryLabel(activated: AgentId[], gates: DeliverGates | null): string {
  const n = activated.length || AGENT_ORDER.length;
  if (!gates) return `Built by ${n} agent${n === 1 ? "" : "s"}`;
  const allPassed =
    gates.lint && gates.types && gates.render && gates.responsive && gates.safety && gates.qa;
  return `Built by ${n} agent${n === 1 ? "" : "s"} · ${allPassed ? "all gates passed" : "delivered with warnings"}`;
}

// Replay a whole event log into a final state (used to rehydrate a re-opened
// build, and by the live panel from the accumulated event array).
export function agentRunFromEvents(events: PipelineEvent[]): AgentRunState {
  return events.reduce(reduceAgentRun, initialAgentRun());
}

// Build the done-state breakdown from a persisted run timeline (C3), for
// re-opening a past build without re-running.
export function agentRunFromTimeline(
  timeline: TimelineEntry[] | null | undefined,
  gates: DeliverGates | null,
  sizeKb: number | null,
  a11y: string | null
): AgentRunState {
  const state = initialAgentRun();
  const byId = new Map(timeline?.map((t) => [t.agent, t]) ?? []);
  const activated: AgentId[] = [];
  const agents = state.agents.map((a) => {
    const entry = byId.get(a.id);
    if (!entry) return a;
    activated.push(a.id);
    return {
      ...a,
      status: "done" as AgentStatus,
      substeps: entry.steps.map((text) => ({ text, ok: true })),
    };
  });
  return {
    ...state,
    agents,
    activated,
    running: false,
    gates,
    sizeKb,
    a11y,
    label: summaryLabel(activated, gates),
  };
}
