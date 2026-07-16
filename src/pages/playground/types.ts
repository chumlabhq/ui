export type PlaygroundRole =
  | "student"
  | "developer"
  | "designer"
  | "founder"
  | "company"
  | "other";

export type PlaygroundBudgetTier =
  | "none"
  | "low"
  | "medium"
  | "high"
  | "enterprise";

export interface PlaygroundUser {
  name: string;
  email: string;
  initials: string;
}

export interface PlaygroundOnboardingSubmission {
  user: PlaygroundUser;
  role: PlaygroundRole;
  context: string;
  contextLabel: string;
  budgetTier: PlaygroundBudgetTier;
  budgetLabel: string;
  organization?: string;
  phone?: string;
  requirements?: string;
}

export interface OnboardingResult {
  submittedAt: string;
  position: number;
  estimatedWait: string;
}

// Pipeline contract, frozen in Phase 0. Mirrors chumlab-be/src/ai/sse.js and the
// run/chat API shapes; this module is the single source of truth on the client.

export type PipelineStage =
  | "router"
  | "clarify"
  | "plan"
  | "develop"
  | "verify"
  | "qa"
  | "deliver";

export type PipelineEventStatus =
  | "start"
  | "delta"
  | "done"
  | "error"
  | "needs_input";

export interface PipelineEvent {
  runId: string;
  stage: PipelineStage;
  status: PipelineEventStatus;
  payload?: unknown;
}

export type PipelineRunStatus =
  | "queued"
  | "running"
  | "needs_input"
  | "done"
  | "error";

export interface PipelineRunSummary {
  _id: string;
  chatId: string;
  status: PipelineRunStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PlaygroundChat {
  _id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export type PlaygroundChatMessageRole = "user" | "assistant";

export interface PlaygroundChatMessage {
  _id: string;
  chatId: string;
  role: PlaygroundChatMessageRole;
  content: string;
  createdAt: string;
}

export interface CreateRunRequest {
  chatId?: string;
  prompt: string;
}

export interface CreateRunResponse {
  success: boolean;
  runId: string;
  chatId: string;
}

export interface VerifyError {
  kind: "lint" | "type" | "render";
  message: string;
  loc?: string;
}

// Payload of the develop-stage SSE events.
export interface GenerationEventPayload {
  text?: string;
  chatId?: string;
  message?: string;
}

export type PlaygroundOnboardingStatus =
  | "waiting"
  | "invited"
  | "onboarded"
  | "rejected";

// `details` payload of the 403/429 gate responses (requirePlaygroundAccess,
// perUserQuota) - what Playground.tsx renders when access is denied.
export interface PlaygroundGateInfo {
  code: "not_invited" | "over_quota";
  position?: number | null;
  estimatedWait?: string | null;
  limit?: number;
  used?: number;
  resetsAt?: string;
}

export interface PlaygroundOnboardingRecord {
  _id: string;
  user: { name: string; email: string; initials?: string; picture?: string };
  role: PlaygroundRole;
  contextLabel: string;
  budgetLabel: string;
  organization: string;
  position: number;
  status: PlaygroundOnboardingStatus;
  invitedAt: string | null;
  onboardedAt?: string | null;
  createdAt: string;
}

export interface AssetUploadResponse {
  success: boolean;
  url: string;
  kind: "image" | "svg";
}
