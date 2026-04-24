// Mock API for the AI Playground onboarding.
// Replace these functions with real endpoints once the backend is ready.
//
// Key concepts:
//   • `PlaygroundRole`   — self-reported persona selected on step 2.
//   • `PlaygroundBudgetTier` — normalised willingness-to-pay bucket used for
//      aggregate metrics across roles (student $0 vs founder $1000+ should
//      still roll up into the same "none/low/medium/high/enterprise" chart).
//   • `PlaygroundOnboardingSubmission` — the shape sent to the backend.
//     `context*` and `budget*` are stored as both an opaque value (for
//     stable analytics keys) and a human-readable label (for UI display +
//     easy reading of raw analytics data).

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
  /** Role-specific follow-up value (e.g. "full-time", "idea", "1-5"). */
  context: string;
  /** Human-readable form of `context` for display + analytics. */
  contextLabel: string;
  /** Normalised budget tier for cross-role metrics. */
  budgetTier: PlaygroundBudgetTier;
  /** Human-readable form of the budget tier (e.g. "$10 – $25 / mo"). */
  budgetLabel: string;
  /** Organization / school / company — label varies by role. */
  organization?: string;
  /** E.164-formatted phone number captured via InternationalPhoneInput.
   *  Country is inferred from this — we don't collect it separately. */
  phone?: string;
  /** What the user intends to build, free-form textarea. */
  requirements?: string;
}

export interface OnboardingResult {
  submittedAt: string;
  /** Waitlist position shown on the success screen (private, post-submit). */
  position: number;
  /** Human-readable "X weeks" estimate for early-access rollout batches. */
  estimatedWait: string;
}

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

const SAMPLE_NAMES: ReadonlyArray<[string, string]> = [
  ["Aditya Sharma", "AS"],
  ["Sarah Chen", "SC"],
  ["Marcus Webb", "MW"],
  ["Priya Patel", "PP"],
  ["Yui Tanaka", "YT"],
  ["James Okafor", "JO"],
];

export async function mockSignInWithGoogle(): Promise<PlaygroundUser> {
  await sleep(900);
  const [name, initials] =
    SAMPLE_NAMES[Math.floor(Math.random() * SAMPLE_NAMES.length)];
  const slug = name.toLowerCase().replace(/\s+/g, ".");
  return { name, email: `${slug}@gmail.com`, initials };
}

export async function mockSubmitOnboarding(
  _sub: PlaygroundOnboardingSubmission,
): Promise<OnboardingResult> {
  await sleep(1100);
  return {
    submittedAt: new Date().toISOString(),
    position: Math.floor(Math.random() * 400) + 120,
    estimatedWait: "1 week",
  };
}
