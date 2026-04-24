import { useState, useCallback, useMemo } from "react";
import Modal from "../../components/Modal/Modal";
import InternationalPhoneInput from "../../components/InternationalPhoneInput/InternationalPhoneInput";
import logoSmall from "../../assets/images/logo-small.png";
import {
  mockSignInWithGoogle,
  mockSubmitOnboarding,
  type PlaygroundUser,
  type PlaygroundRole,
  type PlaygroundBudgetTier,
  type OnboardingResult,
} from "./mockApi";

interface PlaygroundOnboardingProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Step = "auth" | "role" | "context" | "budget" | "details" | "success";

interface FormState {
  user: PlaygroundUser | null;
  role: PlaygroundRole | null;
  /** Role-specific context key, e.g. "class-project", "full-time", "idea". */
  contextValue: string | null;
  /** Human-readable version of `contextValue` (the shown option label). */
  contextLabel: string | null;
  budgetTier: PlaygroundBudgetTier | null;
  budgetLabel: string | null;
  organization: string;
  phone: string;
  requirements: string;
}

const INITIAL_FORM: FormState = {
  user: null,
  role: null,
  contextValue: null,
  contextLabel: null,
  budgetTier: null,
  budgetLabel: null,
  organization: "",
  phone: "",
  requirements: "",
};

const STEP_ORDER: Step[] = [
  "auth",
  "role",
  "context",
  "budget",
  "details",
  "success",
];

// Fire a GA4/GTM-compatible event without coupling to either library. Used
// throughout the onboarding to record role choice, context, budget tier
// selection and final submit — so funnel + pricing metrics are available
// without a backend.
function trackOnboardingEvent(
  event: string,
  payload: Record<string, unknown>,
) {
  type AnalyticsWindow = Window & {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
  };
  const w = window as AnalyticsWindow;
  if (Array.isArray(w.dataLayer)) w.dataLayer.push({ event, ...payload });
  if (typeof w.gtag === "function") w.gtag("event", event, payload);
}

export default function PlaygroundOnboarding({
  open,
  onOpenChange,
}: PlaygroundOnboardingProps) {
  const [step, setStep] = useState<Step>("auth");
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [isSubmitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<OnboardingResult | null>(null);

  const reset = useCallback(() => {
    setStep("auth");
    setForm(INITIAL_FORM);
    setSubmitting(false);
    setResult(null);
  }, []);

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      onOpenChange(false);
      // Delay reset so closing animation doesn't show a flash of step 1.
      setTimeout(reset, 250);
    } else {
      onOpenChange(true);
    }
  };

  const progressIndex = STEP_ORDER.indexOf(step);
  const progressPct = useMemo(
    () =>
      step === "success"
        ? 100
        : Math.round((progressIndex / (STEP_ORDER.length - 1)) * 100),
    [step, progressIndex],
  );

  const handleGoogleSignIn = async () => {
    setSubmitting(true);
    try {
      const user = await mockSignInWithGoogle();
      setForm((prev) => ({ ...prev, user }));
      trackOnboardingEvent("onboarding_signed_in", { email: user.email });
      setStep("role");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSelectRole = (role: PlaygroundRole) => {
    setForm((p) => ({
      ...p,
      role,
      // Reset role-dependent fields so stale context/budget never survives
      // a back → forward flip through the role selection.
      contextValue: null,
      contextLabel: null,
      budgetTier: null,
      budgetLabel: null,
    }));
    trackOnboardingEvent("onboarding_role_selected", { role });
  };

  const handleSelectContext = (value: string, label: string) => {
    setForm((p) => ({ ...p, contextValue: value, contextLabel: label }));
    trackOnboardingEvent("onboarding_context_selected", {
      role: form.role,
      context: value,
      contextLabel: label,
    });
  };

  const handleSelectBudget = (
    tier: PlaygroundBudgetTier,
    label: string,
  ) => {
    setForm((p) => ({ ...p, budgetTier: tier, budgetLabel: label }));
    trackOnboardingEvent("onboarding_budget_selected", {
      role: form.role,
      budgetTier: tier,
      budgetLabel: label,
    });
  };

  const handleSubmitOnboarding = async () => {
    if (
      !form.user ||
      !form.role ||
      !form.contextValue ||
      !form.contextLabel ||
      !form.budgetTier ||
      !form.budgetLabel
    )
      return;
    setSubmitting(true);
    try {
      const submission = {
        user: form.user,
        role: form.role,
        context: form.contextValue,
        contextLabel: form.contextLabel,
        budgetTier: form.budgetTier,
        budgetLabel: form.budgetLabel,
        organization: form.organization.trim() || undefined,
        phone: form.phone.trim() || undefined,
        requirements: form.requirements.trim() || undefined,
      };
      const res = await mockSubmitOnboarding(submission);
      trackOnboardingEvent("onboarding_completed", {
        role: submission.role,
        context: submission.context,
        budgetTier: submission.budgetTier,
        budgetLabel: submission.budgetLabel,
        hasOrganization: !!submission.organization,
        hasPhone: !!submission.phone,
        hasRequirements: !!submission.requirements,
      });
      setResult(res);
      setStep("success");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={handleOpenChange}
      showHeader={false}
      preventOutsideClick={step !== "auth" && step !== "success"}
      showCloseButton={false}
      maxWidth={560}
      unstyled
      classes={{
        root: "fixed inset-0 z-50 flex items-center justify-center",
        overlay: "fixed inset-0 bg-black/75 backdrop-blur-sm",
        container:
          "relative z-10 flex items-center justify-center p-4 sm:p-6 w-full",
        // Fixed `sm:w-[560px]` (in addition to the mobile `w-full` fallback)
        // forces every step to render the modal at exactly 560px — auth,
        // role, experience, details, success all share the same footprint.
        content:
          "relative outline-none w-full sm:w-[560px] rounded-2xl border border-white/[0.1] bg-[#0a0a14]/80 backdrop-blur-2xl text-white overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.06)]",
      }}
    >
      <GlassSheen />
      <ProgressBar percent={progressPct} />

      {step !== "success" && (
        <button
          type="button"
          onClick={() => handleOpenChange(false)}
          aria-label="Close"
          className="cursor-pointer absolute top-4 right-4 z-10 w-9 h-9 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.06] transition-colors"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      )}

      <div className="px-6 sm:px-8 py-7 sm:py-9">
        {step === "auth" && (
          <AuthStep onSignIn={handleGoogleSignIn} loading={isSubmitting} />
        )}

        {step === "role" && (
          <RoleStep
            user={form.user}
            selected={form.role}
            onSelect={handleSelectRole}
            onBack={() => setStep("auth")}
            onNext={() => setStep("context")}
          />
        )}

        {step === "context" && form.role && (
          <ContextStep
            role={form.role}
            selected={form.contextValue}
            onSelect={handleSelectContext}
            onBack={() => setStep("role")}
            onNext={() => setStep("budget")}
          />
        )}

        {step === "budget" && form.role && (
          <BudgetStep
            role={form.role}
            selected={form.budgetTier}
            onSelect={handleSelectBudget}
            onBack={() => setStep("context")}
            onNext={() => setStep("details")}
          />
        )}

        {step === "details" && form.role && (
          <DetailsStep
            role={form.role}
            form={form}
            onChange={(partial) => setForm((p) => ({ ...p, ...partial }))}
            onBack={() => setStep("budget")}
            onSubmit={handleSubmitOnboarding}
            submitting={isSubmitting}
          />
        )}

        {step === "success" && result && (
          <SuccessStep
            user={form.user!}
            result={result}
            onClose={() => handleOpenChange(false)}
          />
        )}
      </div>
    </Modal>
  );
}

// ─── Progress bar ────────────────────────────────────────────────────────────

function ProgressBar({ percent }: { percent: number }) {
  if (percent <= 0) return null;
  return (
    <div className="h-[3px] bg-white/[0.04]">
      <div
        className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 transition-[width] duration-500 ease-out"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}

function GlassSheen() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -left-20 w-[380px] h-[300px] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.22)_0%,transparent_70%)] blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -right-20 w-[380px] h-[300px] rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.18)_0%,transparent_70%)] blur-3xl"
      />
    </>
  );
}

// ─── Step 1: Auth ────────────────────────────────────────────────────────────

function AuthStep({
  onSignIn,
  loading,
}: {
  onSignIn: () => void;
  loading: boolean;
}) {
  return (
    <div className="relative flex flex-col items-center text-center">
      <div className="relative mb-5">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/25 via-indigo-500/25 to-violet-500/25 blur-2xl scale-[1.8]" />
        <img
          src={logoSmall}
          alt="Chumlab"
          className="relative w-11 h-11 object-contain"
        />
      </div>

      <h2 className="text-[22px] sm:text-[26px] font-semibold tracking-tight mb-2 leading-[1.2]">
        <span className="bg-gradient-to-b from-white to-white/85 bg-clip-text text-transparent">
          Sign in to the{" "}
        </span>
        <span className="bg-gradient-to-r from-blue-300 via-indigo-300 to-violet-300 bg-clip-text text-transparent">
          AI Playground
        </span>
      </h2>
      <p className="text-[13.5px] text-white/55 leading-relaxed max-w-sm mb-7">
        Turn a prompt or screenshot into clean React and Next.js components,
        built on the Chumlab primitives you already ship.
      </p>

      <button
        type="button"
        onClick={onSignIn}
        disabled={loading}
        className="cursor-pointer relative group w-full overflow-hidden flex items-center justify-center gap-3 px-5 py-3 rounded-xl bg-white text-gray-900 font-semibold text-[14.5px] hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-[0_6px_20px_-6px_rgba(255,255,255,0.2)] hover:shadow-[0_8px_26px_-6px_rgba(255,255,255,0.28)]"
      >
        {loading ? (
          <Spinner tone="dark" />
        ) : (
          <>
            <GoogleGlyph />
            Continue with Google
          </>
        )}
      </button>

      <div className="mt-5 flex items-center gap-2.5 text-[11.5px] text-white/45">
        <span className="inline-flex items-center gap-1.5">
          <ShieldSolidIcon />
          Private by design
        </span>
        <span className="text-white/15">·</span>
        <span className="inline-flex items-center gap-1.5">
          <BadgeCheckSolidIcon />
          Typed end to end
        </span>
        <span className="text-white/15">·</span>
        <span className="inline-flex items-center gap-1.5">
          <HeartSolidIcon />
          MIT licensed
        </span>
      </div>
    </div>
  );
}

// ─── Step 2: Role ────────────────────────────────────────────────────────────

type Tone = "sky" | "emerald" | "pink" | "amber" | "violet" | "indigo";

const TONE_STYLES: Record<
  Tone,
  { idle: string; active: string; border: string }
> = {
  sky: {
    idle: "bg-sky-500/15 text-sky-300",
    active:
      "bg-gradient-to-br from-sky-400 to-sky-600 text-white shadow-[0_8px_24px_-6px_rgba(56,189,248,0.55)]",
    border: "border-sky-400/60 shadow-[0_0_0_1px_rgba(56,189,248,0.4)_inset]",
  },
  emerald: {
    idle: "bg-emerald-500/15 text-emerald-300",
    active:
      "bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-[0_8px_24px_-6px_rgba(52,211,153,0.55)]",
    border:
      "border-emerald-400/60 shadow-[0_0_0_1px_rgba(52,211,153,0.4)_inset]",
  },
  pink: {
    idle: "bg-pink-500/15 text-pink-300",
    active:
      "bg-gradient-to-br from-pink-400 to-pink-600 text-white shadow-[0_8px_24px_-6px_rgba(244,114,182,0.55)]",
    border: "border-pink-400/60 shadow-[0_0_0_1px_rgba(244,114,182,0.4)_inset]",
  },
  amber: {
    idle: "bg-amber-500/15 text-amber-300",
    active:
      "bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-[0_8px_24px_-6px_rgba(251,191,36,0.55)]",
    border: "border-amber-400/60 shadow-[0_0_0_1px_rgba(251,191,36,0.4)_inset]",
  },
  violet: {
    idle: "bg-violet-500/15 text-violet-300",
    active:
      "bg-gradient-to-br from-violet-400 to-violet-600 text-white shadow-[0_8px_24px_-6px_rgba(167,139,250,0.55)]",
    border:
      "border-violet-400/60 shadow-[0_0_0_1px_rgba(167,139,250,0.4)_inset]",
  },
  indigo: {
    idle: "bg-indigo-500/15 text-indigo-300",
    active:
      "bg-gradient-to-br from-indigo-400 to-indigo-600 text-white shadow-[0_8px_24px_-6px_rgba(129,140,248,0.55)]",
    border:
      "border-indigo-400/60 shadow-[0_0_0_1px_rgba(129,140,248,0.4)_inset]",
  },
};

const ROLE_OPTIONS: Array<{
  value: PlaygroundRole;
  label: string;
  description: string;
  icon: React.ReactNode;
  tone: Tone;
}> = [
  {
    value: "student",
    label: "Student",
    description: "Learning or building on the side",
    icon: <GraduationIcon />,
    tone: "sky",
  },
  {
    value: "developer",
    label: "Developer",
    description: "Full-time engineer or freelance",
    icon: <CodeIcon />,
    tone: "emerald",
  },
  {
    value: "designer",
    label: "Designer",
    description: "Design systems to production UI",
    icon: <PaletteIcon />,
    tone: "pink",
  },
  {
    value: "founder",
    label: "Founder",
    description: "Shipping your own product",
    icon: <LightbulbIcon />,
    tone: "amber",
  },
  {
    value: "company",
    label: "Company",
    description: "Evaluating for a team",
    icon: <BuildingIcon />,
    tone: "violet",
  },
  {
    value: "other",
    label: "Something else",
    description: "Tell us more in a moment",
    icon: <SparklesIcon />,
    tone: "indigo",
  },
];

function RoleStep({
  user,
  selected,
  onSelect,
  onBack,
  onNext,
}: {
  user: PlaygroundUser | null;
  selected: PlaygroundRole | null;
  onSelect: (role: PlaygroundRole) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex flex-col">
      {user && <GreetingPill user={user} />}

      <h2 className="text-xl sm:text-2xl font-semibold tracking-tight mb-1">
        What best describes you?
      </h2>
      <p className="text-sm text-white/60 mb-6">
        We'll tailor the playground to match how you build.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-7">
        {ROLE_OPTIONS.map((option) => (
          <SelectCard
            key={option.value}
            active={selected === option.value}
            onClick={() => onSelect(option.value)}
            icon={option.icon}
            label={option.label}
            description={option.description}
            tone={option.tone}
          />
        ))}
      </div>

      <StepFooter
        onBack={onBack}
        onNext={onNext}
        nextDisabled={!selected}
        nextLabel="Continue"
      />
    </div>
  );
}

// ─── Step 3: Context (role-specific follow-up) ──────────────────────────────

// Role-specific follow-up question. Each branch has a distinct question,
// subtitle and option set, so the user is answering something that actually
// applies to them rather than one generic prompt.
const CONTEXT_BY_ROLE: Record<
  PlaygroundRole,
  {
    question: string;
    subtitle: string;
    options: Array<{
      value: string;
      label: string;
      description: string;
      tone: Tone;
    }>;
  }
> = {
  student: {
    question: "What are you working on?",
    subtitle: "So we can queue up the right templates and shortcuts.",
    options: [
      { value: "class-project", label: "Class project", description: "Coursework, assignment, or capstone", tone: "sky" },
      { value: "portfolio", label: "Personal portfolio", description: "Showcasing what you can build", tone: "emerald" },
      { value: "side-project", label: "Side project", description: "A passion build outside of class", tone: "violet" },
      { value: "open-source", label: "Open source", description: "Contributing to a shared project", tone: "amber" },
    ],
  },
  developer: {
    question: "How do you ship today?",
    subtitle: "Helps us tune output for your workflow and stack.",
    options: [
      { value: "full-time", label: "Full-time at a company", description: "Salaried engineer on a product team", tone: "sky" },
      { value: "freelance", label: "Freelance or contract", description: "Billing clients directly", tone: "emerald" },
      { value: "agency", label: "Agency or studio", description: "Multiple clients through a team", tone: "pink" },
      { value: "maintainer", label: "Open-source maintainer", description: "Building libraries for the community", tone: "amber" },
    ],
  },
  designer: {
    question: "How do you work with code?",
    subtitle: "We will surface the right level of detail in generated JSX.",
    options: [
      { value: "handoff", label: "I design, devs build", description: "Figma then engineering handoff", tone: "pink" },
      { value: "design-and-code", label: "I design and code", description: "Ship my own designs end to end", tone: "violet" },
      { value: "design-ops", label: "Design ops or systems", description: "Library and tokens for other teams", tone: "sky" },
      { value: "product-designer", label: "Product designer", description: "Own flows, prototypes, research", tone: "emerald" },
    ],
  },
  founder: {
    question: "Where is your product today?",
    subtitle: "So we can pick defaults that fit your stage.",
    options: [
      { value: "idea", label: "Idea stage", description: "Still validating the problem", tone: "sky" },
      { value: "prototype", label: "Prototyping", description: "Building the first clickable version", tone: "emerald" },
      { value: "pre-launch", label: "Pre-launch", description: "Closed beta or earliest users", tone: "violet" },
      { value: "live", label: "Live with users", description: "In market, iterating on feedback", tone: "amber" },
      { value: "scaling", label: "Scaling", description: "Growing revenue and team size", tone: "pink" },
    ],
  },
  company: {
    question: "How big is the team?",
    subtitle: "We will recommend the right rollout model.",
    options: [
      { value: "1-5", label: "1 to 5", description: "Tight-knit early team", tone: "sky" },
      { value: "6-25", label: "6 to 25", description: "Startup or small product group", tone: "emerald" },
      { value: "26-100", label: "26 to 100", description: "Multiple product teams", tone: "violet" },
      { value: "100-plus", label: "100+", description: "Enterprise or multi-division", tone: "amber" },
    ],
  },
  other: {
    question: "What brings you to Chumlab AI?",
    subtitle: "Short and sweet, whatever fits best.",
    options: [
      { value: "exploring", label: "Just exploring", description: "Curious about the tooling", tone: "sky" },
      { value: "teaching", label: "Teaching others", description: "Workshops, courses, or content", tone: "emerald" },
      { value: "client-pitch", label: "Client pitch", description: "Prototyping for a pitch or demo", tone: "violet" },
      { value: "personal-tool", label: "Personal tool", description: "Solo dev, building for myself", tone: "amber" },
    ],
  },
};

function ContextStep({
  role,
  selected,
  onSelect,
  onBack,
  onNext,
}: {
  role: PlaygroundRole;
  selected: string | null;
  onSelect: (value: string, label: string) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const config = CONTEXT_BY_ROLE[role];
  return (
    <div className="flex flex-col">
      <h2 className="text-xl sm:text-2xl font-semibold tracking-tight mb-1">
        {config.question}
      </h2>
      <p className="text-sm text-white/60 mb-6">{config.subtitle}</p>

      <div className="flex flex-col gap-2.5 mb-7">
        {config.options.map((option) => {
          const isActive = selected === option.value;
          const toneStyle = TONE_STYLES[option.tone];
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onSelect(option.value, option.label)}
              className={`cursor-pointer group relative overflow-hidden text-left rounded-xl border transition-all duration-200 flex items-center gap-4 p-4 ${
                isActive
                  ? toneStyle.border + " bg-white/[0.05]"
                  : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.18] hover:bg-white/[0.04]"
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="text-[14.5px] font-semibold text-white">
                  {option.label}
                </div>
                <div className="text-[12.5px] text-white/55 leading-snug mt-0.5">
                  {option.description}
                </div>
              </div>
              {isActive && (
                <span
                  aria-hidden
                  className={`shrink-0 inline-flex items-center justify-center w-5 h-5 rounded-full ${toneStyle.active}`}
                >
                  <CheckIcon />
                </span>
              )}
            </button>
          );
        })}
      </div>

      <StepFooter
        onBack={onBack}
        onNext={onNext}
        nextDisabled={!selected}
        nextLabel="Continue"
      />
    </div>
  );
}


// ─── Step 4: Budget (role-specific willingness-to-pay) ──────────────────────

// Role-specific pricing tiers. `tier` is the normalised bucket that rolls up
// across roles for funnel metrics; `label` preserves what the user saw.
const BUDGET_BY_ROLE: Record<
  PlaygroundRole,
  {
    question: string;
    subtitle: string;
    options: Array<{
      tier: PlaygroundBudgetTier;
      label: string;
      description: string;
      tone: Tone;
    }>;
  }
> = {
  student: {
    question: "What fits your student budget?",
    subtitle: "We want pricing that actually works while you are learning.",
    options: [
      { tier: "none", label: "Free tier only", description: "I will stick with free", tone: "sky" },
      { tier: "low", label: "Under $5 / mo", description: "Coffee money for something I love", tone: "emerald" },
      { tier: "medium", label: "$5 to $10 / mo", description: "Worth it for coursework and portfolio", tone: "violet" },
      { tier: "high", label: "$10+ / mo", description: "Happy to pay for strong tools", tone: "amber" },
    ],
  },
  developer: {
    question: "What is fair for a personal subscription?",
    subtitle: "Your own wallet — not your employer's.",
    options: [
      { tier: "none", label: "Free tier only", description: "Only pay if it is absolutely needed", tone: "sky" },
      { tier: "low", label: "Up to $15 / mo", description: "On par with common dev tools", tone: "emerald" },
      { tier: "medium", label: "$15 to $30 / mo", description: "If it saves hours every week", tone: "violet" },
      { tier: "high", label: "$30+ / mo", description: "For something I use every day", tone: "amber" },
      { tier: "enterprise", label: "Company expense", description: "I would expense it to my team", tone: "pink" },
    ],
  },
  designer: {
    question: "What would you pay for strong UI primitives?",
    subtitle: "We would rather price at a level you would actually approve.",
    options: [
      { tier: "none", label: "Free tier only", description: "Free tier is enough for me", tone: "sky" },
      { tier: "low", label: "Up to $20 / mo", description: "Same league as Figma plugins", tone: "emerald" },
      { tier: "medium", label: "$20 to $40 / mo", description: "In my stack and justified", tone: "violet" },
      { tier: "high", label: "$40+ / mo", description: "Core tool, I would prioritise it", tone: "amber" },
      { tier: "enterprise", label: "Studio / team plan", description: "Per-seat for my design team", tone: "pink" },
    ],
  },
  founder: {
    question: "What is your monthly tooling spend?",
    subtitle: "Matches plans to stages, bootstrapped through funded.",
    options: [
      { tier: "none", label: "Bootstrapped", description: "Under $50 / mo total on tools", tone: "sky" },
      { tier: "low", label: "$50 to $200 / mo", description: "A few premium SaaS subscriptions", tone: "emerald" },
      { tier: "medium", label: "$200 to $1,000 / mo", description: "Comfortable paying for premium tools", tone: "violet" },
      { tier: "high", label: "$1,000+ / mo", description: "Seed or post-seed tooling budget", tone: "amber" },
      { tier: "enterprise", label: "Enterprise contract", description: "Annual deals and procurement", tone: "pink" },
    ],
  },
  company: {
    question: "What is a reasonable per-seat price?",
    subtitle: "Team-wide rollouts, billed per engineer or designer.",
    options: [
      { tier: "none", label: "Under $10 / seat", description: "Utility pricing for everyone", tone: "sky" },
      { tier: "low", label: "$10 to $25 / seat", description: "Widely accepted mid-range", tone: "emerald" },
      { tier: "medium", label: "$25 to $50 / seat", description: "Premium productivity tier", tone: "violet" },
      { tier: "high", label: "$50 to $100 / seat", description: "High leverage engineering tool", tone: "amber" },
      { tier: "enterprise", label: "Enterprise contract", description: "Custom pricing and procurement", tone: "pink" },
    ],
  },
  other: {
    question: "What would you pay monthly?",
    subtitle: "Honest answer helps us price this right.",
    options: [
      { tier: "none", label: "Free only", description: "Free tier is enough", tone: "sky" },
      { tier: "low", label: "Under $20 / mo", description: "If it is genuinely useful", tone: "emerald" },
      { tier: "medium", label: "$20 to $50 / mo", description: "For something I reach for often", tone: "violet" },
      { tier: "high", label: "$50+ / mo", description: "A tool I rely on daily", tone: "amber" },
    ],
  },
};

function BudgetStep({
  role,
  selected,
  onSelect,
  onBack,
  onNext,
}: {
  role: PlaygroundRole;
  selected: PlaygroundBudgetTier | null;
  onSelect: (tier: PlaygroundBudgetTier, label: string) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const config = BUDGET_BY_ROLE[role];

  return (
    <div className="flex flex-col">
      <h2 className="text-xl sm:text-2xl font-semibold tracking-tight mb-1">
        {config.question}
      </h2>
      <p className="text-sm text-white/60 mb-6">{config.subtitle}</p>

      <div className="flex flex-col gap-2.5 mb-7">
        {config.options.map((option) => {
          const isActive = selected === option.tier;
          const toneStyle = TONE_STYLES[option.tone];
          return (
            <button
              key={option.tier + option.label}
              type="button"
              onClick={() => onSelect(option.tier, option.label)}
              className={`cursor-pointer group relative overflow-hidden text-left rounded-xl border transition-all duration-200 flex items-center gap-4 p-4 ${
                isActive
                  ? toneStyle.border + " bg-white/[0.05]"
                  : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.18] hover:bg-white/[0.04]"
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="text-[14.5px] font-semibold text-white">
                  {option.label}
                </div>
                <div className="text-[12.5px] text-white/55 leading-snug mt-0.5">
                  {option.description}
                </div>
              </div>
              {isActive && (
                <span
                  aria-hidden
                  className={`shrink-0 inline-flex items-center justify-center w-5 h-5 rounded-full ${toneStyle.active}`}
                >
                  <CheckIcon />
                </span>
              )}
            </button>
          );
        })}
      </div>

      <StepFooter
        onBack={onBack}
        onNext={onNext}
        nextDisabled={!selected}
        nextLabel="Continue"
      />
    </div>
  );
}

// ─── Step 5: Details (role-aware org label, optional phone + location) ─────

// Role-tailored organization field. `required` flips the submit gate so
// founders + companies must name their company, but students/freelancers
// can leave it blank. The `hint` line nudges ambiguous roles (e.g. developer
// who might be freelance vs full-time).
const ORG_BY_ROLE: Record<
  PlaygroundRole,
  { label: string; placeholder: string; required: boolean; hint?: string }
> = {
  student: {
    label: "School or university",
    placeholder: "e.g. MIT",
    required: false,
  },
  developer: {
    label: "Company or team",
    placeholder: "e.g. Stripe",
    required: false,
    hint: "Leave blank if freelance.",
  },
  designer: {
    label: "Studio or company",
    placeholder: "e.g. Linear",
    required: false,
  },
  founder: {
    label: "Company name",
    placeholder: "e.g. Chumlab",
    required: true,
  },
  company: {
    label: "Company name",
    placeholder: "e.g. Acme Inc.",
    required: true,
  },
  other: {
    label: "Organisation or role",
    placeholder: "e.g. Independent consultant",
    required: false,
  },
};

// Role-tailored "what are you building" prompt so the textarea feels
// relevant rather than generic.
const REQUIREMENTS_PROMPT: Record<PlaygroundRole, string> = {
  student: "What are you trying to build or learn?",
  developer: "What components or flows are you planning to build?",
  designer: "Which screens or surfaces are you hoping to ship?",
  founder: "What is your product and who is it for?",
  company: "What problem are you trying to solve with Chumlab?",
  other: "Tell us what you're hoping to build.",
};

// Shared Tailwind class strings for DetailsStep inputs/labels/textareas so
// the phone input, plain text inputs, and textarea all read as one coherent
// form. If you tweak the base input styling, update the phone input slots
// (below) to keep them visually identical.
const DETAILS_LABEL_CLASS =
  "flex items-center gap-1 text-[13px] font-medium text-white/80 mb-2";
const DETAILS_FIELD_CLASS =
  "w-full px-3.5 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[14px] text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.12)] transition-all";

// Phone input class overrides — `InternationalPhoneInput`'s default look
// assumes a light theme (or a `.dark` ancestor). The modal has neither, so
// we pin every relevant slot here to the same dark-theme styling as the
// other DetailsStep fields.
const PHONE_INPUT_CLASSES = {
  root: "flex flex-col",
  label: DETAILS_LABEL_CLASS,
  wrapper: "flex gap-2 items-stretch",
  input:
    "flex-1 px-3.5 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[14px] text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.12)] transition-all",
  countrySelectTrigger:
    "flex items-center justify-between gap-1.5 min-w-[108px] px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[14px] text-white/85 hover:bg-white/[0.06] focus:outline-none focus:border-blue-500/50 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.12)] transition-all",
  countrySelectDropdown:
    "w-72 border rounded-lg shadow-[0_18px_40px_rgba(0,0,0,0.55)] overflow-hidden bg-[#0c0c16] border-white/[0.1]",
  countrySelectSearchInput:
    "flex items-center gap-2 px-3 py-2 border-b border-white/[0.08]",
  countrySelectSearchInputElement:
    "flex-1 bg-transparent focus:outline-none text-sm text-white placeholder:text-white/35",
  countrySelectOption:
    "flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-white/[0.06] data-[focused]:bg-white/[0.08] text-white/80",
  countrySelectOptionSelected: "bg-indigo-500/15 text-white",
  countrySelectOptionList: "max-h-60 overflow-y-auto",
  countrySelectChevron: "w-4 h-4 shrink-0 text-white/60",
  countrySelectCheckIcon: "w-4 h-4 shrink-0 text-indigo-300",
  countrySelectSearchIcon: "w-4 h-4 shrink-0 text-white/40",
  countrySelectNoResults:
    "px-3 py-4 text-sm text-center text-white/50",
} as const;

// Small red asterisk after a field label for required fields. `aria-hidden`
// because `aria-required` on the input already conveys the state; the star
// is purely a visual cue.
function RequiredMark() {
  return (
    <span aria-hidden className="text-red-400/90 text-[13px] leading-none">
      *
    </span>
  );
}

function DetailsStep({
  role,
  form,
  onChange,
  onBack,
  onSubmit,
  submitting,
}: {
  role: PlaygroundRole;
  form: FormState;
  onChange: (partial: Partial<FormState>) => void;
  onBack: () => void;
  onSubmit: () => void;
  submitting: boolean;
}) {
  const orgConfig = ORG_BY_ROLE[role];
  const orgOk = !orgConfig.required || !!form.organization.trim();
  const canSubmit = orgOk && !submitting;

  return (
    <div className="flex flex-col">
      <h2 className="text-xl sm:text-2xl font-semibold tracking-tight mb-1">
        A few final details
      </h2>
      <p className="text-sm text-white/60 mb-6">
        Helps us tailor templates and docs to your situation.
      </p>

      <div className="flex flex-col gap-5">
        {/* Organization — label varies by role */}
        <div>
          <label htmlFor="pg-organization" className={DETAILS_LABEL_CLASS}>
            {orgConfig.label}
            {orgConfig.required && <RequiredMark />}
          </label>
          <input
            id="pg-organization"
            type="text"
            value={form.organization}
            onChange={(e) => onChange({ organization: e.target.value })}
            placeholder={orgConfig.placeholder}
            required={orgConfig.required}
            aria-required={orgConfig.required || undefined}
            className={DETAILS_FIELD_CLASS}
          />
          {orgConfig.hint && (
            <p className="mt-1.5 text-[12px] text-white/40">
              {orgConfig.hint}
            </p>
          )}
        </div>

        {/* Phone — uses the Chumlab InternationalPhoneInput, optional.
            Used uncontrolled (no `value`) and we persist the E.164
            `fullNumber` into form state via onValueChange so downstream
            submission stores a single canonical string rather than the
            component's internal { countryCode, phoneNumber } shape. */}
        <div>
          <InternationalPhoneInput
            label="Phone number"
            defaultCountry="IN"
            onValueChange={(data) =>
              onChange({ phone: data.fullNumber || "" })
            }
            fullWidth
            placeholder="WhatsApp or mobile"
            classes={PHONE_INPUT_CLASSES}
            // Chumlab's Modal internally pins itself to z-index 9999
            // (BASE_Z_INDEX in components/Modal/Modal.tsx). The country
            // dropdown must render ABOVE that, so pick 10050 — clears the
            // base modal and also any nested/stacked modals (each nesting
            // level bumps modal z-index by 10).
            dropdownZIndex={10050}
          />
        </div>

        {/* Requirements — role-aware prompt */}
        <div>
          <label htmlFor="pg-requirements" className={DETAILS_LABEL_CLASS}>
            {REQUIREMENTS_PROMPT[role]}
          </label>
          <textarea
            id="pg-requirements"
            rows={3}
            value={form.requirements}
            onChange={(e) => onChange({ requirements: e.target.value })}
            placeholder="Short and specific is best — one or two sentences."
            className={`${DETAILS_FIELD_CLASS} resize-none leading-snug`}
          />
        </div>
      </div>

      <div className="mt-7">
        <StepFooter
          onBack={onBack}
          onNext={onSubmit}
          nextDisabled={!canSubmit}
          nextLabel={submitting ? "Setting up…" : "Get access"}
          nextLoading={submitting}
          nextAccent
        />
      </div>
    </div>
  );
}

// ─── Step 6: Success ─────────────────────────────────────────────────────────

function SuccessStep({
  user,
  result,
  onClose,
}: {
  user: PlaygroundUser;
  result: OnboardingResult;
  onClose: () => void;
}) {
  const firstName = user.name.split(" ")[0];

  return (
    <div className="relative flex flex-col items-center text-center">
      <ConfettiBurst />

      <div className="relative mb-5 mt-1">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-400/40 via-orange-400/40 to-pink-500/40 blur-2xl" />
        <div
          className="relative w-20 h-20 rounded-[26px] bg-gradient-to-br from-amber-300 via-orange-400 to-pink-500 flex items-center justify-center shadow-[0_12px_40px_-6px_rgba(251,146,60,0.55)]"
          style={{
            animation:
              "pg-trophy-pop 0.7s cubic-bezier(0.2, 1.5, 0.4, 1) both",
          }}
        >
          <TrophyIcon />
          <span
            aria-hidden
            className="absolute inset-0 rounded-[26px] overflow-hidden"
          >
            <span
              className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              style={{ animation: "pg-sheen 1.8s ease-out 0.6s both" }}
            />
          </span>
        </div>
      </div>

      <div className="inline-flex items-center gap-2 mb-3">
        <span className="relative flex w-1.5 h-1.5">
          <span className="absolute inset-0 rounded-full bg-amber-400 animate-ping opacity-75" />
          <span className="relative rounded-full w-1.5 h-1.5 bg-amber-400" />
        </span>
        <span className="text-[10.5px] font-semibold uppercase tracking-[0.22em] text-amber-300/90">
          On the waitlist
        </span>
      </div>

      <h2 className="text-[26px] sm:text-[30px] font-bold tracking-tight mb-2 leading-tight">
        <span className="bg-gradient-to-r from-amber-200 via-orange-200 to-pink-200 bg-clip-text text-transparent">
          Welcome in, {firstName}
        </span>
      </h2>
      <p className="text-sm text-white/60 leading-relaxed max-w-sm mb-6">
        We'll email{" "}
        <span className="text-white/85 font-medium">{user.email}</span> as soon
        as early access opens.
      </p>

      <div
        className="relative w-full rounded-2xl border border-white/[0.08] bg-gradient-to-br from-amber-500/[0.08] via-orange-500/[0.05] to-pink-500/[0.08] p-5 mb-6 overflow-hidden"
        style={{ animation: "pg-position-count 0.5s ease-out 0.3s both" }}
      >
        <div
          aria-hidden
          className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-gradient-to-br from-amber-400/20 to-pink-500/20 blur-3xl"
        />
        <div className="relative flex items-center gap-5">
          <div className="flex-1 text-left">
            <div className="text-[10.5px] uppercase tracking-[0.18em] text-white/50 mb-1.5 font-semibold">
              Your position
            </div>
            <span className="text-[42px] font-bold leading-none tabular-nums bg-gradient-to-br from-amber-200 via-orange-200 to-pink-200 bg-clip-text text-transparent">
              #{result.position}
            </span>
          </div>
          <div className="w-px h-14 bg-white/10" />
          <div className="flex-1 text-left">
            <div className="text-[10.5px] uppercase tracking-[0.18em] text-white/50 mb-1.5 font-semibold">
              Est. wait
            </div>
            <div className="text-[15px] text-white/90 font-semibold leading-tight">
              {result.estimatedWait}
            </div>
            <div className="text-[12px] text-white/45 mt-0.5">
              Rolling batches
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="cursor-pointer relative w-full overflow-hidden px-5 py-3 rounded-xl text-[15px] font-semibold text-white transition-transform duration-200 hover:-translate-y-px shadow-[0_10px_28px_-10px_rgba(251,146,60,0.55)] hover:shadow-[0_14px_34px_-10px_rgba(251,146,60,0.7)]"
      >
        <span className="absolute inset-0 bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500" />
        <span className="absolute inset-0 opacity-0 hover:opacity-100 bg-gradient-to-r from-amber-400 via-orange-400 to-pink-400 transition-opacity duration-300" />
        <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
        <span className="relative">Start building</span>
      </button>
    </div>
  );
}

function ConfettiBurst() {
  const particles = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => {
        const angle = (i / 22) * Math.PI * 2 + Math.random() * 0.4;
        const dist = 70 + Math.random() * 60;
        return {
          tx: Math.cos(angle) * dist,
          ty: Math.sin(angle) * dist - 10,
          rot: Math.random() * 720 - 360,
          delay: Math.random() * 0.15,
          duration: 1.1 + Math.random() * 0.5,
          color: [
            "#fbbf24",
            "#f97316",
            "#ec4899",
            "#a78bfa",
            "#60a5fa",
            "#34d399",
          ][i % 6],
          size: 6 + Math.random() * 5,
          rounded: Math.random() > 0.5,
        };
      }),
    [],
  );
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 z-10"
    >
      {particles.map((p, i) => (
        <span
          key={i}
          className="absolute top-12 left-0 block"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.rounded ? "9999px" : "2px",
            transform: "translate(-50%, -50%)",
            animation: `pg-burst ${p.duration}s cubic-bezier(0.15, 0.75, 0.35, 1) ${p.delay}s forwards`,
            ["--pg-tx" as string]: `${p.tx}px`,
            ["--pg-ty" as string]: `${p.ty}px`,
            ["--pg-rot" as string]: `${p.rot}deg`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

// ─── Shared bits ─────────────────────────────────────────────────────────────

function GreetingPill({ user }: { user: PlaygroundUser }) {
  return (
    <div className="inline-flex self-start items-center gap-2.5 px-2.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] mb-6">
      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-[11px] font-semibold">
        {user.initials}
      </div>
      <span className="text-[12px] text-white/70 pr-1">
        Signed in as <span className="text-white">{user.email}</span>
      </span>
    </div>
  );
}

function SelectCard({
  active,
  onClick,
  label,
  description,
  icon,
  tone = "indigo",
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  tone?: Tone;
}) {
  const toneStyle = TONE_STYLES[tone];
  return (
    <button
      type="button"
      onClick={onClick}
      className={`cursor-pointer group relative overflow-hidden text-left rounded-xl border transition-all duration-200 p-4 ${
        active
          ? toneStyle.border + " bg-white/[0.05] -translate-y-px"
          : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.18] hover:bg-white/[0.04] hover:-translate-y-px"
      }`}
    >
      {icon && (
        <div
          className={`mb-2.5 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
            active ? toneStyle.active : toneStyle.idle
          }`}
        >
          {icon}
        </div>
      )}
      <div>
        <div className="text-[14.5px] font-semibold text-white">{label}</div>
        {description && (
          <div className="text-[12.5px] text-white/55 leading-snug mt-0.5">
            {description}
          </div>
        )}
      </div>
      {active && (
        <span
          aria-hidden
          className="absolute top-3 right-3 w-5 h-5 rounded-full bg-white flex items-center justify-center shadow-md"
        >
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#111827"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </span>
      )}
    </button>
  );
}


function StepFooter({
  onBack,
  onNext,
  nextDisabled,
  nextLabel,
  nextLoading,
  nextAccent,
}: {
  onBack: () => void;
  onNext: () => void;
  nextDisabled?: boolean;
  nextLabel: string;
  nextLoading?: boolean;
  nextAccent?: boolean;
}) {
  const chevron = (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );

  return (
    <div className="flex items-center justify-between gap-3">
      <button
        type="button"
        onClick={onBack}
        className="cursor-pointer inline-flex items-center gap-1 px-2.5 py-1.5 -ml-1 rounded-md text-[13px] font-medium text-white/55 hover:text-white transition-colors"
      >
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
        Back
      </button>

      {nextAccent ? (
        <button
          type="button"
          onClick={onNext}
          disabled={nextDisabled}
          className="cursor-pointer group relative overflow-hidden px-4 py-1.5 rounded-lg text-[13px] font-semibold text-white transition-all duration-200 hover:-translate-y-px active:translate-y-0 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:opacity-45 shadow-[0_4px_14px_-4px_rgba(99,102,241,0.55)] hover:shadow-[0_8px_20px_-4px_rgba(99,102,241,0.7)] disabled:shadow-none"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-600" />
          <span className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-400 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
          <span className="relative inline-flex items-center gap-1.5">
            {nextLoading ? <Spinner tone="light" /> : null}
            {nextLabel}
            {!nextLoading && (
              <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                {chevron}
              </span>
            )}
          </span>
        </button>
      ) : (
        <button
          type="button"
          onClick={onNext}
          disabled={nextDisabled}
          className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[13px] font-semibold bg-white text-gray-900 hover:bg-gray-100 disabled:bg-white/10 disabled:text-white/30 disabled:cursor-not-allowed transition-colors"
        >
          {nextLabel}
          {chevron}
        </button>
      )}
    </div>
  );
}

// ─── Icons ───────────────────────────────────────────────────────────────────

function GoogleGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.3 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.3-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.6 15.1 18.9 12 24 12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.3 6.1 29.4 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-1.9 1.3-4.4 2.4-7.2 2.4-5.1 0-9.5-3.2-11.2-7.8l-6.5 5C9.4 39.5 16.1 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.1 4.2-3.8 5.6l6.2 5.2c3.9-3.6 6.3-9 6.3-15.3 0-1.2-.1-2.3-.4-3.5z"
      />
    </svg>
  );
}

function CheckIcon({ large }: { large?: boolean } = {}) {
  const size = large ? 28 : 12;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-white"
      aria-hidden
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function Spinner({ tone }: { tone: "light" | "dark" }) {
  return (
    <svg
      className="animate-spin"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke={tone === "dark" ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.3)"}
        strokeWidth="3"
        fill="none"
      />
      <path
        d="M22 12a10 10 0 0 0-10-10"
        stroke={tone === "dark" ? "#111827" : "#fff"}
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

function GraduationIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2 0 8l4 2v5c0 2.21 3.58 4 8 4s8-1.79 8-4v-5l2-1v7h2V8L12 2Zm6 13c0 .53-2.24 2-6 2s-6-1.47-6-2v-3.73l6 3L18 11.27V15Z" />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M3 3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H3Zm2 5h14v1H5V8Zm2 3.2 3.5 2.8L7 16.8V15l1.6-1L7 13v-1.8ZM12 16h6v1h-6v-1Z" />
    </svg>
  );
}

// Palette icon — custom illustrated palette with a paintbrush drip (provided
// artwork). Source viewBox is 48×60 so the intrinsic aspect is taller than
// wide; rendering at 22×26 keeps the brush tail from being clipped while
// still visually weighing the same as the other 22×22 role icons.
function PaletteIcon() {
  return (
    <svg
      width="22"
      height="26"
      viewBox="0 0 48 60"
      fill="currentColor"
      aria-hidden
    >
      <path d="M47.44 47.8c-.81.47-1.68-.34-2-.65A17.4 17.4 0 0 1 43.56 45a74 74 0 0 1-4.88-7.51A65 65 0 0 1 34.05 28a.85.85 0 0 1 .09-.73.8.8 0 0 1 .63-.36 1.5 1.5 0 0 0 .47-.11 2 2 0 0 0 .27-.16 1.4 1.4 0 0 0 .28-.27.81.81 0 0 1 1.27 0 65.4 65.4 0 0 1 5.81 8.67 73 73 0 0 1 4.06 8 18 18 0 0 1 .94 2.7c.13.44.38 1.59-.43 2.06M35.91 28.33a72 72 0 0 0 4.18 8.32 77 77 0 0 0 4.37 6.79 26 26 0 0 0 1.65 2.06 25 25 0 0 0-1-2.46 76 76 0 0 0-3.7-7.17 68 68 0 0 0-5.11-7.78 4 4 0 0 1-.39.24" />
      <path d="M36.61 22.91a3.14 3.14 0 0 1-1.2 3.17l-.23.15-.28.14a3.3 3.3 0 0 1-2.73-.05 5.27 5.27 0 0 1-2.08-1.67c-1.65-2.25-.25-5.39-.57-7.94a11 11 0 0 1-.24-1.65c.2-.12 1.2.41 1.51.59a12.7 12.7 0 0 1 4.63 4.11 7.8 7.8 0 0 1 1.19 3.15" />
      <path d="M45.17 9.08c-2.06-7.42-15.37-9-21.54-9C10.58.06 0 10.07 0 22.41s10.57 22.34 23.61 22.35c2.75 0 7.23-.07 8.18-3.32 1.19-4.12-4.32-8.42-5.4-12 0-.09-.05-.19-.08-.28a9 9 0 0 1 1.91-8.39c0-.43.07-.86.12-1.28a12 12 0 0 0 .1-2.65 1.5 1.5 0 0 1 0-.22c0-.23-.11-.58-.16-.88s0-.32 0-.43a1.16 1.16 0 0 1 .54-1.21 1.34 1.34 0 0 1 .63-.16 2.76 2.76 0 0 1 1.18.35 8 8 0 0 1 .79.4 17.2 17.2 0 0 1 3 2.09c.36-.12.72-.23 1.09-.32 3.63-.94 11.24-1.66 9.66-7.38m-29.08-2.4a3.8 3.8 0 1 1-3.8 3.8 3.8 3.8 0 0 1 3.8-3.8m-6.51 8.11a3.8 3.8 0 1 1-3.8 3.8 3.8 3.8 0 0 1 3.8-3.8m0 18a3.8 3.8 0 1 1 3.8-3.8 3.8 3.8 0 0 1-3.8 3.8m7.6 6.73a3.8 3.8 0 1 1 3.82-3.8 3.8 3.8 0 0 1-3.82 3.8m13.63-27a4.66 4.66 0 1 1 4.65-4.65 4.65 4.65 0 0 1-4.65 4.66Z" />
    </svg>
  );
}

// Heroicons "light-bulb" solid — the universal "idea / vision" glyph. More
// fitting for a founder than a generic rocket; rockets lean "speed / ship",
// lightbulbs lean "the 0→1 you're actually doing as a founder".
function LightbulbIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 .75a8.25 8.25 0 0 0-4.135 15.39c.686.398 1.115 1.008 1.134 1.623a.75.75 0 0 0 .577.706c.352.083.71.148 1.074.195.323.041.6-.218.6-.544v-4.661a6.714 6.714 0 0 1-.937-.171.75.75 0 1 1 .374-1.453 5.261 5.261 0 0 0 2.626 0 .75.75 0 1 1 .374 1.452 6.712 6.712 0 0 1-.937.172v4.66c0 .327.277.586.6.545.364-.047.722-.112 1.074-.195a.75.75 0 0 0 .577-.706c.02-.615.448-1.225 1.134-1.623A8.25 8.25 0 0 0 12 .75Z" />
      <path
        fillRule="evenodd"
        d="M9.013 19.9a.75.75 0 0 1 .877-.597 11.319 11.319 0 0 0 4.22 0 .75.75 0 1 1 .28 1.473 12.819 12.819 0 0 1-4.78 0 .75.75 0 0 1-.597-.876ZM9.754 22.344a.75.75 0 0 1 .824-.668 13.682 13.682 0 0 0 2.844 0 .75.75 0 1 1 .156 1.492 15.156 15.156 0 0 1-3.156 0 .75.75 0 0 1-.668-.824Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M4 2v20h7v-4h2v4h7V2H4Zm4 16H6v-2h2v2Zm0-4H6v-2h2v2Zm0-4H6V8h2v2Zm0-4H6V4h2v2Zm5 8h-2v-2h2v2Zm0-4h-2V8h2v2Zm0-4h-2V4h2v2Zm5 12h-2v-2h2v2Zm0-4h-2v-2h2v2Zm0-4h-2V8h2v2Zm0-4h-2V4h2v2Z" />
    </svg>
  );
}

function SparklesIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M10 2 8 8 2 10l6 2 2 6 2-6 6-2-6-2-2-6Zm9 11-1 3-3 1 3 1 1 3 1-3 3-1-3-1-1-3Z" />
    </svg>
  );
}

function TrophyIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor" className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]" aria-hidden>
      <path d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 0 0-.584.859 6.753 6.753 0 0 0 6.138 5.6 6.73 6.73 0 0 0 2.743 1.346A6.707 6.707 0 0 1 9.279 15H8.54c-1.059 0-1.91.852-1.936 1.906l-.025 1.031a.75.75 0 0 1-.749.738 4.5 4.5 0 0 1-.274-.012.75.75 0 0 0-.748.739l-.026 1.05a.75.75 0 0 0 .75.762H18.47a.75.75 0 0 0 .75-.762l-.026-1.05a.75.75 0 0 0-.748-.739 4.5 4.5 0 0 1-.273.012.75.75 0 0 1-.75-.738l-.025-1.03A1.94 1.94 0 0 0 15.462 15h-.739a6.707 6.707 0 0 1-1.112-3.173 6.73 6.73 0 0 0 2.743-1.347 6.753 6.753 0 0 0 6.139-5.6.75.75 0 0 0-.585-.858 47.077 47.077 0 0 0-3.07-.543V2.62a.75.75 0 0 0-.658-.744 49.22 49.22 0 0 0-6.093-.377c-2.063 0-4.096.128-6.093.377a.75.75 0 0 0-.657.744ZM4.508 4.903c-.549.087-1.093.185-1.633.293a5.253 5.253 0 0 0 3.723 3.81c-.7-1.247-1.398-2.683-2.09-4.103Zm13.35 4.103a5.253 5.253 0 0 0 3.724-3.81c-.54-.108-1.085-.206-1.633-.293-.692 1.42-1.39 2.856-2.091 4.103Z" />
    </svg>
  );
}

// Solid shield-check — "secured, guaranteed private".
function ShieldSolidIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path
        fillRule="evenodd"
        d="M12.516 2.17a.75.75 0 0 0-1.032 0 11.209 11.209 0 0 1-7.877 3.08.75.75 0 0 0-.722.515A12.74 12.74 0 0 0 2.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 0 0 .374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 0 0-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08Zm3.094 8.016a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

// Solid verified badge — "checked, type-safe, trustworthy".
function BadgeCheckSolidIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path
        fillRule="evenodd"
        d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

// Solid heart — "made freely available, open source with love (MIT)".
function HeartSolidIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M11.645 20.91 11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.75.75 0 0 1-.704 0l-.003-.001Z" />
    </svg>
  );
}

