import { describe, it, expect } from "vitest";
import type { PipelineEvent } from "../types";
import {
  AGENTS,
  AGENT_ORDER,
  agentRunFromEvents,
  agentRunFromTimeline,
  reduceAgentRun,
  initialAgentRun,
  stageToAgent,
} from "./agents";

const ev = (
  stage: PipelineEvent["stage"],
  status: PipelineEvent["status"],
  payload?: unknown
): PipelineEvent => ({ runId: "r1", stage, status, payload });

describe("stageToAgent (persona folding)", () => {
  it("folds router/clarify/plan into Router", () => {
    expect(stageToAgent("router")).toBe("router");
    expect(stageToAgent("clarify")).toBe("router");
    expect(stageToAgent("plan")).toBe("router");
  });
  it("maps the writer/verifier/qa stages", () => {
    expect(stageToAgent("develop")).toBe("developer");
    expect(stageToAgent("verify")).toBe("verifier");
    expect(stageToAgent("qa")).toBe("qa");
  });
  it("treats deliver as terminal (not an agent)", () => {
    expect(stageToAgent("deliver")).toBeNull();
  });
});

// The OTP golden, as the FE would receive it over SSE.
const OTP_EVENTS: PipelineEvent[] = [
  ev("router", "start", { label: "Understanding your request" }),
  ev("router", "done", { tier: "multi" }),
  ev("clarify", "start", { label: "Checking what needs clarifying" }),
  ev("clarify", "done", { assumptions: "Six-digit numeric code." }),
  ev("plan", "start", { label: "Planning the build" }),
  ev("plan", "delta", { text: "Plan..." }),
  ev("plan", "done", {}),
  ev("develop", "start", { label: "Writing the component", chatId: "c1" }),
  ev("develop", "substep", { text: "Composing with @chumlab/ui primitives", ok: true }),
  ev("develop", "delta", { text: "```tsx" }),
  ev("develop", "done", { chatId: "c1" }),
  ev("verify", "start", { label: "Testing edge cases", round: 0 }),
  ev("verify", "substep", { text: "No banned APIs, imports, or inline styles", ok: true }),
  ev("verify", "substep", { text: "Type-checks against @chumlab/ui", ok: true }),
  ev("verify", "done", { pass: true, round: 0 }),
  ev("qa", "start", { label: "Running the gates" }),
  ev("qa", "done", { pass: true, fixed: false }),
  ev("deliver", "done", {
    sizeKb: 4.1,
    a11y: "AA",
    gates: { lint: true, types: true, render: true, responsive: true, safety: true, qa: true },
  }),
];

describe("reduceAgentRun over the OTP golden", () => {
  const final = agentRunFromEvents(OTP_EVENTS);

  it("ends with all four agents done, in order", () => {
    expect(final.agents.map((a) => a.id)).toEqual(AGENT_ORDER);
    expect(final.agents.every((a) => a.status === "done")).toBe(true);
    expect(final.activated).toEqual(AGENT_ORDER);
  });

  it("collects the verify substeps under the Verifier", () => {
    const verifier = final.agents.find((a) => a.id === "verifier")!;
    expect(verifier.substeps.length).toBe(2);
    expect(verifier.substeps.every((s) => s.ok)).toBe(true);
    expect(verifier.substeps[0].text).toMatch(/banned/i);
  });

  it("lights the cluster from the deliver metadata", () => {
    expect(final.running).toBe(false);
    expect(final.gates).toEqual({ lint: true, types: true, render: true, responsive: true, safety: true, qa: true });
    expect(final.sizeKb).toBe(4.1);
    expect(final.a11y).toBe("AA");
    expect(final.label).toMatch(/Built by 4 agents · all gates passed/);
  });

  it("marks an earlier agent done once the next one starts", () => {
    // After develop starts, Router must no longer be 'running'.
    let s = initialAgentRun();
    for (const e of OTP_EVENTS.slice(0, 8)) s = reduceAgentRun(s, e); // through develop.start
    expect(s.agents.find((a) => a.id === "router")!.status).toBe("done");
    expect(s.agents.find((a) => a.id === "developer")!.status).toBe("running");
  });
});

describe("clarify pause", () => {
  it("puts Router in a waiting state and stops the run", () => {
    let s = initialAgentRun();
    s = reduceAgentRun(s, ev("router", "start", { label: "Understanding" }));
    s = reduceAgentRun(s, ev("clarify", "start", { label: "Clarifying" }));
    s = reduceAgentRun(s, ev("clarify", "needs_input", { questions: [{ question: "?", options: ["a", "b"] }] }));
    expect(s.needsInput).toBe(true);
    expect(s.running).toBe(false);
    expect(s.agents.find((a) => a.id === "router")!.status).toBe("waiting");
    expect(s.label).toBe("Waiting for you");
  });
});

describe("single-tier run (no clarify/plan/qa)", () => {
  it("reports only the agents that actually ran", () => {
    const events: PipelineEvent[] = [
      ev("router", "start", { label: "Understanding" }),
      ev("router", "done", { tier: "single" }),
      ev("develop", "start", { label: "Writing" }),
      ev("develop", "done", {}),
      ev("verify", "start", { label: "Testing", round: 0 }),
      ev("verify", "substep", { text: "lint ok", ok: true }),
      ev("verify", "done", { pass: true }),
      ev("deliver", "done", { sizeKb: 1.2, a11y: "AA", gates: { lint: true, types: true, render: true, responsive: true, safety: true, qa: true } }),
    ];
    const final = agentRunFromEvents(events);
    expect(final.activated).toEqual(["router", "developer", "verifier"]);
    expect(final.label).toMatch(/Built by 3 agents/);
    // QA never ran → stays queued, honestly.
    expect(final.agents.find((a) => a.id === "qa")!.status).toBe("queued");
  });
});

describe("agentRunFromTimeline (re-open a past build)", () => {
  it("rehydrates the done-state breakdown without re-running", () => {
    const timeline = [
      { agent: "router", durationMs: 1900, steps: ["Routed to the multi tier", "Planned the architecture"] },
      { agent: "developer", durationMs: 4200, steps: ["Composing with @chumlab/ui primitives"] },
      { agent: "verifier", durationMs: 3100, steps: ["No banned APIs", "Type-checks"] },
      { agent: "qa", durationMs: 1200, steps: ["No blocking issues", "a11y AA passed"] },
    ];
    const state = agentRunFromTimeline(
      timeline,
      { lint: true, types: true, render: true, responsive: true, safety: true, qa: true },
      4.1,
      "AA"
    );
    expect(state.agents.every((a) => a.status === "done")).toBe(true);
    expect(state.agents.find((a) => a.id === "verifier")!.substeps.map((s) => s.text)).toEqual([
      "No banned APIs",
      "Type-checks",
    ]);
    expect(state.label).toMatch(/Built by 4 agents · all gates passed/);
    expect(AGENTS.router.role).toBe("plans the build");
  });
});
