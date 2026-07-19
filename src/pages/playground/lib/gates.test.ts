import { describe, it, expect } from "vitest";
import { gatesFromEvents, resolveGateLamps, allGatesPassed } from "./gates";
import type { PipelineEvent } from "../types";

const ev = (
  stage: PipelineEvent["stage"],
  status: PipelineEvent["status"],
  payload?: unknown
): PipelineEvent => ({ runId: "r1", stage, status, payload });

const SUBSTEPS = {
  lint: "No banned APIs, imports, or inline styles",
  types: "Type-checks against @chumlab/ui",
  responsive: "Mobile-responsive (no fixed pixel widths)",
  safety: "Content policy",
};

describe("gatesFromEvents", () => {
  it("starts every stream gate pending", () => {
    expect(gatesFromEvents([])).toEqual({
      lint: "pending",
      types: "pending",
      responsive: "pending",
      safety: "pending",
      qa: "pending",
    });
  });

  it("moves the verify gates to running on verify.start", () => {
    const g = gatesFromEvents([ev("verify", "start", { round: 0 })]);
    expect(g.lint).toBe("running");
    expect(g.types).toBe("running");
    expect(g.responsive).toBe("running");
    expect(g.safety).toBe("running");
    expect(g.qa).toBe("pending");
  });

  it("resolves each verify gate from its substep text + ok", () => {
    const g = gatesFromEvents([
      ev("verify", "start", { round: 0 }),
      ev("verify", "substep", { text: SUBSTEPS.lint, ok: true }),
      ev("verify", "substep", { text: SUBSTEPS.types, ok: true }),
      ev("verify", "substep", { text: SUBSTEPS.responsive, ok: false }),
      ev("verify", "substep", { text: SUBSTEPS.safety, ok: true }),
    ]);
    expect(g.lint).toBe("passed");
    expect(g.types).toBe("passed");
    expect(g.responsive).toBe("failed");
    expect(g.safety).toBe("passed");
  });

  it("drives the qa lamp through running → passed", () => {
    const g = gatesFromEvents([
      ev("qa", "start", {}),
      ev("qa", "done", { pass: true }),
    ]);
    expect(g.qa).toBe("passed");
  });

  it("re-runs a failed gate red → running (not stuck) on the next verify.start", () => {
    const g = gatesFromEvents([
      ev("verify", "start", { round: 0 }),
      ev("verify", "substep", { text: SUBSTEPS.lint, ok: false }),
      ev("verify", "error", { fixing: true, round: 1 }),
      ev("verify", "start", { round: 1 }), // fix round re-checks
    ]);
    expect(g.lint).toBe("running");
  });

  it("keeps an already-passed gate passed across a re-run", () => {
    const g = gatesFromEvents([
      ev("verify", "start", { round: 0 }),
      ev("verify", "substep", { text: SUBSTEPS.types, ok: true }),
      ev("verify", "start", { round: 1 }),
    ]);
    expect(g.types).toBe("passed");
  });

  it("finalises unresolved gates from deliver.gates (qa skipped on single-tier)", () => {
    const g = gatesFromEvents([
      ev("verify", "start", { round: 0 }),
      ev("verify", "substep", { text: SUBSTEPS.lint, ok: true }),
      ev("verify", "substep", { text: SUBSTEPS.types, ok: true }),
      ev("verify", "substep", { text: SUBSTEPS.responsive, ok: true }),
      ev("verify", "substep", { text: SUBSTEPS.safety, ok: true }),
      // qa never ran; deliver reports it passed
      ev("deliver", "done", {
        gates: { lint: true, types: true, render: true, responsive: true, safety: true, qa: true },
      }),
    ]);
    expect(g.qa).toBe("passed");
  });
});

describe("resolveGateLamps", () => {
  it("maps render from the client renderGate (idle → pending)", () => {
    expect(resolveGateLamps([], "idle", null).render).toBe("pending");
    expect(resolveGateLamps([], "running", null).render).toBe("running");
    expect(resolveGateLamps([], "passed", null).render).toBe("passed");
    expect(resolveGateLamps([], "failed", null).render).toBe("failed");
  });

  it("rehydrates a completed run entirely from deliver.gates (no stuck-pending)", () => {
    const lamps = resolveGateLamps([], "idle", {
      lint: true, types: true, render: true, responsive: true, safety: true, qa: true,
    });
    expect(allGatesPassed(lamps)).toBe(true);
  });

  it("rehydrates a failed gate as failed", () => {
    const lamps = resolveGateLamps([], "idle", {
      lint: true, types: false, render: true, responsive: true, safety: true, qa: true,
    });
    expect(lamps.types).toBe("failed");
    expect(allGatesPassed(lamps)).toBe(false);
  });

  it("does not override a live-resolved lamp with the backstop", () => {
    const events = [
      ev("verify", "start", { round: 0 }),
      ev("verify", "substep", { text: SUBSTEPS.lint, ok: false }),
    ];
    // Backstop claims lint passed, but the live stream already failed it.
    const lamps = resolveGateLamps(events, "idle", {
      lint: true, types: true, render: true, responsive: true, safety: true, qa: true,
    });
    expect(lamps.lint).toBe("failed");
  });
});
