/** @vitest-environment jsdom */
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import AgentBreakdown from "./AgentBreakdown";
import { agentRunFromEvents } from "../lib/agents";
import type { PipelineEvent } from "../types";

const ev = (
  stage: PipelineEvent["stage"],
  status: PipelineEvent["status"],
  payload?: unknown
): PipelineEvent => ({ runId: "r1", stage, status, payload });

const OTP_EVENTS: PipelineEvent[] = [
  ev("router", "start", { label: "Understanding your request" }),
  ev("router", "done", { tier: "multi" }),
  ev("develop", "start", { label: "Writing the component" }),
  ev("develop", "done", {}),
  ev("verify", "start", { label: "Testing edge cases" }),
  ev("verify", "substep", { text: "No banned APIs, imports, or inline styles", ok: true }),
  ev("verify", "substep", { text: "Type-checks against @chumlab/ui", ok: true }),
  ev("verify", "done", { pass: true }),
  ev("qa", "start", { label: "Running the gates" }),
  ev("qa", "done", { pass: true }),
  ev("deliver", "done", {
    sizeKb: 4.1,
    a11y: "AA",
    gates: { lint: true, types: true, render: true, qa: true },
  }),
];

const SINGLE_TIER_EVENTS: PipelineEvent[] = [
  ev("router", "start", { label: "Understanding" }),
  ev("router", "done", { tier: "single" }),
  ev("develop", "start", { label: "Writing" }),
  ev("develop", "done", {}),
  ev("verify", "start", { label: "Testing", round: 0 }),
  ev("verify", "substep", { text: "lint ok", ok: true }),
  ev("verify", "done", { pass: true }),
  ev("deliver", "done", { sizeKb: 1.2, a11y: "AA", gates: { lint: true, types: true, render: true, qa: true } }),
];

describe("AgentBreakdown", () => {
  it("is open by default, showing the agents + summary, and collapses on click", () => {
    const state = agentRunFromEvents(OTP_EVENTS);
    render(<AgentBreakdown state={state} elapsedLabel="12.4s" />);

    expect(screen.getByText(/Built by 4 agents · all gates passed/)).toBeTruthy();
    expect(screen.getByRole("button", { expanded: true })).toBeTruthy();
    expect(screen.getByText("Router")).toBeTruthy();
    expect(screen.getByText("QA")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { expanded: true }));
    expect(screen.queryByText("Router")).toBeNull();
  });

  it("shows the live relay while a run is in flight", () => {
    const state = agentRunFromEvents(OTP_EVENTS.slice(0, 5));
    render(<AgentBreakdown state={state} />);
    expect(screen.getByRole("button", { expanded: true })).toBeTruthy();
    expect(screen.getByText("Developer")).toBeTruthy();
  });

  it("hides agents that never ran once a single-tier build is done (no QA row)", () => {
    const state = agentRunFromEvents(SINGLE_TIER_EVENTS);
    render(<AgentBreakdown state={state} />);
    expect(screen.getByText("Router")).toBeTruthy();
    expect(screen.getByText("Verifier")).toBeTruthy();
    expect(screen.queryByText("QA")).toBeNull();
  });
});
