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
