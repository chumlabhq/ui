import type { PipelineTier } from "../types";

export type PipelineStageId =
  | "router"
  | "clarify"
  | "plan"
  | "develop"
  | "verify"
  | "qa";

export type StageStatus = "pending" | "active" | "done";
export type GateStatus = "idle" | "running" | "pass" | "fail";

export interface RelayStep {
  id: PipelineStageId;
  label: string;
  status: StageStatus;
}

const LABELS: Record<PipelineStageId, string> = {
  router: "route",
  clarify: "clarify",
  plan: "plan",
  develop: "develop",
  verify: "verify",
  qa: "qa",
};

// Role-flavored narration — "watch the senior team work", not "loading".
const NARRATION: Record<PipelineStageId, string> = {
  router: "Understanding your request",
  clarify: "Checking if anything needs clarifying",
  plan: "Planning the architecture",
  develop: "Building it",
  verify: "Reviewing the code",
  qa: "Doing a final review",
};

// Clarify + plan only run on multi/full; the relay collapses for lighter tiers
// so it always reflects the real path.
export function stageOrder(tier: PipelineTier | null): PipelineStageId[] {
  const deep = tier === "multi" || tier === "full";
  return deep
    ? ["router", "clarify", "plan", "develop", "verify", "qa"]
    : ["router", "develop", "verify", "qa"];
}

export function relaySteps(
  activeStage: PipelineStageId | null,
  tier: PipelineTier | null
): RelayStep[] {
  const order = stageOrder(tier);
  const activeIndex = activeStage ? order.indexOf(activeStage) : order.length;
  return order.map((id, i) => ({
    id,
    label: LABELS[id],
    status: i < activeIndex ? "done" : i === activeIndex ? "active" : "pending",
  }));
}

// The resting relay shown before a run — the team standing by.
export function idleSteps(tier: PipelineTier | null): RelayStep[] {
  return stageOrder(tier).map((id) => ({ id, label: LABELS[id], status: "pending" }));
}

export function narration(activeStage: PipelineStageId | null, fixing: boolean): string {
  if (fixing) return "Found an issue — fixing it";
  if (!activeStage) return "Done";
  return NARRATION[activeStage];
}
