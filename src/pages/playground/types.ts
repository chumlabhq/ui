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
  | "needs_input"
  // Phase 10: a streamed sub-line inside a stage (verify edge-case checks,
  // develop compose lines). Additive — old readers ignore what they don't know.
  | "substep";

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

// Component classification (Phase 10) — drives the history row glyph.
export type ComponentType = "otp" | "card" | "form" | "table" | "other";

// Persona-folded agent timeline persisted on a run (C3), used to rehydrate a
// re-opened build with no re-run.
export interface TimelineEntry {
  agent: string;
  durationMs: number;
  steps: string[];
}

export interface PlaygroundChat {
  _id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  // Enriched from the chat's latest run (Phase 10, chat-centric history).
  componentType?: ComponentType | null;
  gatesPassed?: boolean | null;
  sizeKb?: number | null;
  status?: PipelineRunStatus | null;
}

// Full run document for re-opening a past build (C3).
export interface PlaygroundRunDetail {
  _id: string;
  chatId: string;
  status: PipelineRunStatus;
  fixRounds?: number;
  timeline?: TimelineEntry[] | null;
  deliver?: (DeliverEventPayload & { gatesPassed?: boolean; componentType?: ComponentType }) | null;
  componentType?: ComponentType | null;
  sizeKb?: number | null;
  a11y?: string | null;
  gatesPassed?: boolean | null;
  title?: string | null;
  createdAt: string;
  updatedAt: string;
}

// Appearance settings (C4).
export type PreviewDevice = "mobile" | "tablet" | "fill";
export interface PlaygroundSettings {
  previewTheme: "light" | "dark" | "system";
  previewDevice: PreviewDevice;
}

export type PlaygroundChatMessageRole = "user" | "assistant";

export interface PlaygroundChatMessage {
  _id: string;
  chatId: string;
  role: PlaygroundChatMessageRole;
  content: string;
  image?: { mediaType: string; data: string } | null;
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

// Payload of the develop- and plan-stage SSE events.
export interface GenerationEventPayload {
  text?: string;
  chatId?: string;
  message?: string;
}

export type PipelineTier = "trivial" | "single" | "multi" | "full";

// Payload of the router-stage done event.
export interface RouterEventPayload {
  tier?: PipelineTier;
}

export interface ClarifyQuestion {
  question: string;
  options: string[];
}

// A screenshot attached to a generation. `data` is base64 (no data-URL
// prefix) sent to the backend; `previewUrl` is a local data URL for the
// thumbnail.
export interface AttachedImage {
  mediaType: string;
  data: string;
  previewUrl: string;
}

export interface QaFinding {
  severity: "high" | "medium" | "low";
  description: string;
  location?: string;
}

// Payload of the qa-stage SSE events.
export interface QaEventPayload {
  pass?: boolean;
  fixed?: boolean;
  fixing?: boolean;
  exhausted?: boolean;
  round?: number;
  findings?: QaFinding[];
}

// Payload of the clarify-stage needs_input event.
export interface ClarifyEventPayload {
  questions?: ClarifyQuestion[];
  assumptions?: string;
}

// Phase 10 · human-readable label carried on every stage `start` event.
export interface StageStartPayload {
  label?: string;
  chatId?: string;
  round?: number;
}

// Phase 10 · a streamed sub-step line inside a stage.
export interface SubstepEventPayload {
  text: string;
  ok?: boolean;
}

// Phase 10 · per-gate booleans + cluster metadata carried on `deliver.done`.
export interface DeliverGates {
  lint: boolean;
  types: boolean;
  render: boolean;
  qa: boolean;
}
export interface DeliverEventPayload {
  sizeKb?: number;
  a11y?: string | null;
  gates?: DeliverGates;
}

// Payload of the verify-stage SSE events (gate results and fix rounds).
export interface VerifyEventPayload {
  round?: number;
  pass?: boolean;
  fixing?: boolean;
  exhausted?: boolean;
  typecheckUnavailable?: boolean;
  errors?: VerifyError[];
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
