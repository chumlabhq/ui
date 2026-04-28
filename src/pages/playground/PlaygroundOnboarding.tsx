import { useState, useCallback, useMemo } from "react";
import Modal from "../../components/Modal/Modal";
import InternationalPhoneInput from "../../components/InternationalPhoneInput/InternationalPhoneInput";
import { Button } from "../../components/ui";
import logoSmall from "../../assets/images/logo-small.png";
import {
  type PlaygroundUser,
  type PlaygroundRole,
  type PlaygroundBudgetTier,
  type OnboardingResult,
} from "./types";
import { useGetMeQuery } from "../../redux/api/authApi";
import {
  useSubmitPlaygroundOnboardingMutation,
  useGetMyPlaygroundOnboardingQuery,
} from "../../redux/api/playgroundApi";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface PlaygroundOnboardingProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Step = "auth" | "role" | "context" | "budget" | "details" | "success";

interface FormState {
  user: PlaygroundUser | null;
  role: PlaygroundRole | null;
  contextValue: string | null;
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

const NUMBERED_STEPS: Step[] = ["role", "context", "budget", "details"];

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
  const [authError, setAuthError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<OnboardingResult | null>(null);

  const { data: meData, isError: meHasError } = useGetMeQuery(undefined, {
    skip: !open,
  });
  const authedUser = meHasError ? undefined : meData?.user;

  const { data: myOnboarding, isFetching: isLoadingMine } =
    useGetMyPlaygroundOnboardingQuery(undefined, {
      skip: !open || !authedUser,
    });

  const [submitOnboarding, { isLoading: isSubmitting }] =
    useSubmitPlaygroundOnboardingMutation();

  const reset = useCallback(() => {
    setStep("auth");
    setForm(INITIAL_FORM);
    setAuthError(null);
    setSubmitError(null);
    setResult(null);
  }, []);

  // Hydrate form + advance step when the auth gate completes. setState-
  // during-render (with a state-based signature guard) ensures we apply
  // each unique (user, onboarding) combo exactly once per modal-open and
  // satisfies both react-hooks/set-state-in-effect and react-hooks/refs.
  const [lastAuthSignature, setLastAuthSignature] = useState<string>("");
  if (!open && lastAuthSignature !== "") {
    setLastAuthSignature("");
  } else if (open && step === "auth" && authedUser && !isLoadingMine) {
    const sig = `${authedUser.email}|${myOnboarding?.submittedAt ?? ""}|${myOnboarding?.position ?? ""}`;
    if (lastAuthSignature !== sig) {
      setLastAuthSignature(sig);
      setForm((prev) => ({
        ...prev,
        user: {
          name: authedUser.name,
          email: authedUser.email,
          initials: authedUser.initials,
        },
      }));
      if (
        myOnboarding?.onboarding &&
        myOnboarding.submittedAt &&
        typeof myOnboarding.position === "number" &&
        myOnboarding.estimatedWait
      ) {
        setResult({
          submittedAt: myOnboarding.submittedAt,
          position: myOnboarding.position,
          estimatedWait: myOnboarding.estimatedWait,
        });
        setStep("success");
      } else {
        setStep("role");
      }
    }
  }

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      onOpenChange(false);
      setTimeout(reset, 250);
    } else {
      onOpenChange(true);
    }
  };

  const numberedIndex = NUMBERED_STEPS.indexOf(step);
  const progressPct = useMemo(() => {
    if (step === "success") return 100;
    if (numberedIndex < 0) return 0;
    return Math.round(((numberedIndex + 1) / NUMBERED_STEPS.length) * 100);
  }, [step, numberedIndex]);

  const handleGoogleSignIn = () => {
    setAuthError(null);
    if (!API_BASE_URL) {
      setAuthError("API base URL is not configured.");
      return;
    }
    const fallbackUrl = `${window.location.origin}/oauth/google`;
    const url = `${API_BASE_URL}/auth/google/login?fallbackUrl=${encodeURIComponent(
      fallbackUrl,
    )}&flow=playground-onboard`;
    window.location.href = url;
  };

  const handleSelectRole = (role: PlaygroundRole) => {
    setForm((p) => ({
      ...p,
      role,
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

  const handleSelectBudget = (tier: PlaygroundBudgetTier, label: string) => {
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
    setSubmitError(null);
    const submission = {
      role: form.role,
      context: form.contextValue,
      contextLabel: form.contextLabel,
      budgetTier: form.budgetTier,
      budgetLabel: form.budgetLabel,
      organization: form.organization.trim() || undefined,
      phone: form.phone.trim() || undefined,
      requirements: form.requirements.trim() || undefined,
    };
    try {
      const res = await submitOnboarding(submission).unwrap();
      trackOnboardingEvent("onboarding_completed", {
        role: submission.role,
        context: submission.context,
        budgetTier: submission.budgetTier,
        budgetLabel: submission.budgetLabel,
        hasOrganization: !!submission.organization,
        hasPhone: !!submission.phone,
        hasRequirements: !!submission.requirements,
        alreadyOnboarded: res.alreadyOnboarded,
      });
      setResult({
        submittedAt: res.submittedAt,
        position: res.position,
        estimatedWait: res.estimatedWait,
      });
      setStep("success");
    } catch (err) {
      const msg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Could not submit. Please try again.";
      setSubmitError(msg);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={handleOpenChange}
      showHeader={false}
      preventOutsideClick={step !== "auth" && step !== "success"}
      showCloseButton={false}
      maxWidth={580}
      unstyled
      classes={{
        root: "fixed inset-0 z-50 flex items-center justify-center",
        overlay: "fixed inset-0 bg-bg-base/80",
        container:
          "relative z-10 flex items-center justify-center p-4 sm:p-6 w-full",
        content:
          "relative outline-none w-full sm:w-[580px] rounded-xl bg-bg-overlay text-fg overflow-hidden",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-xl"
        style={{ border: "0.5px solid var(--border-soft)" }}
      />

      {NUMBERED_STEPS.includes(step) && <ProgressBar percent={progressPct} />}

      {step !== "success" && (
        <Button
          variant="icon"
          size="sm"
          onClick={() => handleOpenChange(false)}
          aria-label="Close"
          className="absolute top-4 right-4 z-10"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            aria-hidden
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </Button>
      )}

      <div className="relative px-7 sm:px-9 py-9 sm:py-10">
        {step === "auth" &&
          (open && authedUser && isLoadingMine ? (
            <div className="flex flex-col items-center text-center py-12">
              <div className="w-9 h-9 border border-fg-tertiary/20 border-t-fg rounded-full animate-spin mb-4" />
              <p className="text-[13px] text-fg-tertiary">
                Checking your account...
              </p>
            </div>
          ) : !authedUser ? (
            <AuthStep onSignIn={handleGoogleSignIn} error={authError} />
          ) : null)}

        {step === "role" && (
          <RoleStep
            user={form.user}
            selected={form.role}
            stepIndex={numberedIndex}
            onSelect={handleSelectRole}
            onBack={() => setStep("auth")}
            onNext={() => setStep("context")}
          />
        )}

        {step === "context" && form.role && (
          <ContextStep
            role={form.role}
            stepIndex={numberedIndex}
            selected={form.contextValue}
            onSelect={handleSelectContext}
            onBack={() => setStep("role")}
            onNext={() => setStep("budget")}
          />
        )}

        {step === "budget" && form.role && (
          <BudgetStep
            role={form.role}
            stepIndex={numberedIndex}
            selected={form.budgetTier}
            onSelect={handleSelectBudget}
            onBack={() => setStep("context")}
            onNext={() => setStep("details")}
          />
        )}

        {step === "details" && form.role && (
          <DetailsStep
            role={form.role}
            stepIndex={numberedIndex}
            form={form}
            onChange={(partial) => setForm((p) => ({ ...p, ...partial }))}
            onBack={() => setStep("budget")}
            onSubmit={handleSubmitOnboarding}
            submitting={isSubmitting}
            error={submitError}
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
  return (
    <div className="absolute top-0 left-0 right-0 h-px bg-fg-tertiary/15">
      <div
        className="h-full transition-[width] duration-500 ease-out"
        style={{ width: `${percent}%`, background: "var(--accent)" }}
      />
    </div>
  );
}

function StepLabel({ index }: { index: number }) {
  const total = NUMBERED_STEPS.length;
  const current = String(index + 1).padStart(2, "0");
  const totalStr = String(total).padStart(2, "0");
  return (
    <div className="eyebrow text-fg-secondary mb-2">
      Step {current} of {totalStr}
    </div>
  );
}

// ─── Step 1: Auth ────────────────────────────────────────────────────────────

function AuthStep({
  onSignIn,
  error,
}: {
  onSignIn: () => void;
  error: string | null;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <img
        src={logoSmall}
        alt="Chumlab"
        className="w-12 h-12 object-contain mb-7"
      />

      <h2
        className="font-sans font-medium text-fg mb-3 leading-[1.05]"
        style={{ fontSize: 32, letterSpacing: "-0.025em" }}
      >
        Sign in to the{" "}
        <span className="serif-accent">AI Playground.</span>
      </h2>
      <p className="text-[14.5px] text-fg-secondary leading-[1.55] max-w-sm mb-8">
        Turn a prompt or screenshot into clean React and Next.js components,
        built on the Chumlab primitives you already ship.
      </p>

      <Button
        variant="primary"
        size="md"
        onClick={onSignIn}
        startIcon={<GoogleGlyph />}
      >
        Continue with Google
      </Button>

      {error && (
        <p
          role="alert"
          className="mt-3 text-[12.5px] leading-relaxed"
          style={{ color: "var(--accent)" }}
        >
          {error}
        </p>
      )}

      <div className="mt-7 eyebrow text-fg-tertiary">
        Private by design · Typed end to end · MIT licensed
      </div>
    </div>
  );
}

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

// ─── Step 2: Role ────────────────────────────────────────────────────────────

const ROLE_OPTIONS: Array<{
  value: PlaygroundRole;
  label: string;
  description: string;
  icon: React.ReactNode;
}> = [
  {
    value: "student",
    label: "Student",
    description: "Learning or building on the side",
    icon: <GraduationIcon />,
  },
  {
    value: "developer",
    label: "Developer",
    description: "Full-time engineer or freelance",
    icon: <CodeIcon />,
  },
  {
    value: "designer",
    label: "Designer",
    description: "Design systems to production UI",
    icon: <PenToolIcon />,
  },
  {
    value: "founder",
    label: "Founder",
    description: "Shipping your own product",
    icon: <RocketIcon />,
  },
  {
    value: "company",
    label: "Company",
    description: "Evaluating for a team",
    icon: <BuildingIcon />,
  },
  {
    value: "other",
    label: "Something else",
    description: "Tell us more in a moment",
    icon: <SparkleIcon />,
  },
];

function RoleStep({
  user,
  selected,
  stepIndex,
  onSelect,
  onBack,
  onNext,
}: {
  user: PlaygroundUser | null;
  selected: PlaygroundRole | null;
  stepIndex: number;
  onSelect: (role: PlaygroundRole) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex flex-col">
      <StepLabel index={stepIndex} />

      {user && <SignedInPill user={user} />}

      <h2
        className="font-sans font-medium text-fg mb-2 leading-[1.05]"
        style={{ fontSize: 30, letterSpacing: "-0.025em" }}
      >
        What best describes <span className="serif-accent">you?</span>
      </h2>
      <p className="text-[14.5px] text-fg-secondary mb-7">
        We&rsquo;ll tailor the playground to match how you build.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        {ROLE_OPTIONS.map((option) => (
          <RoleCard
            key={option.value}
            active={selected === option.value}
            onClick={() => onSelect(option.value)}
            icon={option.icon}
            label={option.label}
            description={option.description}
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

function RoleCard({
  active,
  onClick,
  label,
  description,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="cursor-pointer text-left rounded-lg p-[18px] bg-bg-elevated transition-colors duration-150"
      style={{
        border: `0.5px solid ${active ? "var(--border-active)" : "var(--border-faint)"}`,
      }}
    >
      <div className="mb-3 text-fg-secondary">{icon}</div>
      <div className="text-[16px] font-medium text-fg leading-[1.3]">
        {label}
      </div>
      <div className="text-[13px] text-fg-tertiary leading-[1.45] mt-1">
        {description}
      </div>
    </button>
  );
}

// ─── Step 3: Context ────────────────────────────────────────────────────────

const CONTEXT_BY_ROLE: Record<
  PlaygroundRole,
  {
    question: string;
    italicWord: string;
    subtitle: string;
    options: Array<{ value: string; label: string; description: string }>;
  }
> = {
  student: {
    question: "What are you working on?",
    italicWord: "working",
    subtitle: "So we can queue up the right templates and shortcuts.",
    options: [
      { value: "class-project", label: "Class project", description: "Coursework, assignment, or capstone" },
      { value: "portfolio", label: "Personal portfolio", description: "Showcasing what you can build" },
      { value: "side-project", label: "Side project", description: "A passion build outside of class" },
      { value: "open-source", label: "Open source", description: "Contributing to a shared project" },
    ],
  },
  developer: {
    question: "How do you ship today?",
    italicWord: "ship",
    subtitle: "Helps us tune output for your workflow and stack.",
    options: [
      { value: "full-time", label: "Full-time at a company", description: "Salaried engineer on a product team" },
      { value: "freelance", label: "Freelance or contract", description: "Billing clients directly" },
      { value: "agency", label: "Agency or studio", description: "Multiple clients through a team" },
      { value: "maintainer", label: "Open-source maintainer", description: "Building libraries for the community" },
    ],
  },
  designer: {
    question: "How do you work with code?",
    italicWord: "work",
    subtitle: "We will surface the right level of detail in generated JSX.",
    options: [
      { value: "handoff", label: "I design, devs build", description: "Figma then engineering handoff" },
      { value: "design-and-code", label: "I design and code", description: "Ship my own designs end to end" },
      { value: "design-ops", label: "Design ops or systems", description: "Library and tokens for other teams" },
      { value: "product-designer", label: "Product designer", description: "Own flows, prototypes, research" },
    ],
  },
  founder: {
    question: "Where are you in the build?",
    italicWord: "build",
    subtitle: "So we can pick defaults that fit your stage.",
    options: [
      { value: "idea", label: "Idea stage", description: "Still validating the problem" },
      { value: "prototype", label: "Prototyping", description: "Building the first clickable version" },
      { value: "pre-launch", label: "Pre-launch", description: "Closed beta or earliest users" },
      { value: "live", label: "Live with users", description: "In market, iterating on feedback" },
      { value: "scaling", label: "Scaling", description: "Growing revenue and team size" },
    ],
  },
  company: {
    question: "How big is the team?",
    italicWord: "team",
    subtitle: "We will recommend the right rollout model.",
    options: [
      { value: "1-5", label: "1 to 5", description: "Tight-knit early team" },
      { value: "6-25", label: "6 to 25", description: "Startup or small product group" },
      { value: "26-100", label: "26 to 100", description: "Multiple product teams" },
      { value: "100-plus", label: "100+", description: "Enterprise or multi-division" },
    ],
  },
  other: {
    question: "What brings you to Chumlab AI?",
    italicWord: "brings",
    subtitle: "Short and sweet, whatever fits best.",
    options: [
      { value: "exploring", label: "Just exploring", description: "Curious about the tooling" },
      { value: "teaching", label: "Teaching others", description: "Workshops, courses, or content" },
      { value: "client-pitch", label: "Client pitch", description: "Prototyping for a pitch or demo" },
      { value: "personal-tool", label: "Personal tool", description: "Solo dev, building for myself" },
    ],
  },
};

function ContextStep({
  role,
  stepIndex,
  selected,
  onSelect,
  onBack,
  onNext,
}: {
  role: PlaygroundRole;
  stepIndex: number;
  selected: string | null;
  onSelect: (value: string, label: string) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const config = CONTEXT_BY_ROLE[role];
  return (
    <div className="flex flex-col">
      <StepLabel index={stepIndex} />

      <h2
        className="font-sans font-medium text-fg mb-2 leading-[1.05]"
        style={{ fontSize: 30, letterSpacing: "-0.025em" }}
      >
        {italicSplit(config.question, config.italicWord)}
      </h2>
      <p className="text-[14.5px] text-fg-secondary mb-7">{config.subtitle}</p>

      <div className="flex flex-col gap-0 mb-8 rule rule-t rule-b">
        {config.options.map((option) => (
          <RowOption
            key={option.value}
            active={selected === option.value}
            onClick={() => onSelect(option.value, option.label)}
            label={option.label}
            description={option.description}
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

// ─── Step 4: Budget ─────────────────────────────────────────────────────────

const BUDGET_BY_ROLE: Record<
  PlaygroundRole,
  {
    question: string;
    italicWord: string;
    subtitle: string;
    options: Array<{
      tier: PlaygroundBudgetTier;
      label: string;
      description: string;
    }>;
  }
> = {
  student: {
    question: "What fits your student budget?",
    italicWord: "student",
    subtitle: "We want pricing that actually works while you are learning.",
    options: [
      { tier: "none", label: "Free tier only", description: "I will stick with free" },
      { tier: "low", label: "Under $5 / mo", description: "Coffee money for something I love" },
      { tier: "medium", label: "$5 to $10 / mo", description: "Worth it for coursework and portfolio" },
      { tier: "high", label: "$10+ / mo", description: "Happy to pay for strong tools" },
    ],
  },
  developer: {
    question: "What is fair for a personal subscription?",
    italicWord: "personal",
    subtitle: "Your own wallet, not your employer's.",
    options: [
      { tier: "none", label: "Free tier only", description: "Only pay if it is absolutely needed" },
      { tier: "low", label: "Up to $15 / mo", description: "On par with common dev tools" },
      { tier: "medium", label: "$15 to $30 / mo", description: "If it saves hours every week" },
      { tier: "high", label: "$30+ / mo", description: "For something I use every day" },
      { tier: "enterprise", label: "Company expense", description: "I would expense it to my team" },
    ],
  },
  designer: {
    question: "What would you pay for strong UI primitives?",
    italicWord: "strong",
    subtitle: "We would rather price at a level you would actually approve.",
    options: [
      { tier: "none", label: "Free tier only", description: "Free tier is enough for me" },
      { tier: "low", label: "Up to $20 / mo", description: "Same league as Figma plugins" },
      { tier: "medium", label: "$20 to $40 / mo", description: "In my stack and justified" },
      { tier: "high", label: "$40+ / mo", description: "Core tool, I would prioritise it" },
      { tier: "enterprise", label: "Studio / team plan", description: "Per-seat for my design team" },
    ],
  },
  founder: {
    question: "What is your tooling budget?",
    italicWord: "tooling",
    subtitle: "Matches plans to stages, bootstrapped through funded.",
    options: [
      { tier: "none", label: "Bootstrapped", description: "Under $50 / mo total on tools" },
      { tier: "low", label: "$50 to $200 / mo", description: "A few premium SaaS subscriptions" },
      { tier: "medium", label: "$200 to $1,000 / mo", description: "Comfortable paying for premium tools" },
      { tier: "high", label: "$1,000+ / mo", description: "Seed or post-seed tooling budget" },
      { tier: "enterprise", label: "Enterprise contract", description: "Annual deals and procurement" },
    ],
  },
  company: {
    question: "What is a reasonable per-seat price?",
    italicWord: "reasonable",
    subtitle: "Team-wide rollouts, billed per engineer or designer.",
    options: [
      { tier: "none", label: "Under $10 / seat", description: "Utility pricing for everyone" },
      { tier: "low", label: "$10 to $25 / seat", description: "Widely accepted mid-range" },
      { tier: "medium", label: "$25 to $50 / seat", description: "Premium productivity tier" },
      { tier: "high", label: "$50 to $100 / seat", description: "High leverage engineering tool" },
      { tier: "enterprise", label: "Enterprise contract", description: "Custom pricing and procurement" },
    ],
  },
  other: {
    question: "What would you pay monthly?",
    italicWord: "monthly",
    subtitle: "Honest answer helps us price this right.",
    options: [
      { tier: "none", label: "Free only", description: "Free tier is enough" },
      { tier: "low", label: "Under $20 / mo", description: "If it is genuinely useful" },
      { tier: "medium", label: "$20 to $50 / mo", description: "For something I reach for often" },
      { tier: "high", label: "$50+ / mo", description: "A tool I rely on daily" },
    ],
  },
};

function BudgetStep({
  role,
  stepIndex,
  selected,
  onSelect,
  onBack,
  onNext,
}: {
  role: PlaygroundRole;
  stepIndex: number;
  selected: PlaygroundBudgetTier | null;
  onSelect: (tier: PlaygroundBudgetTier, label: string) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const config = BUDGET_BY_ROLE[role];

  return (
    <div className="flex flex-col">
      <StepLabel index={stepIndex} />

      <h2
        className="font-sans font-medium text-fg mb-2 leading-[1.05]"
        style={{ fontSize: 30, letterSpacing: "-0.025em" }}
      >
        {italicSplit(config.question, config.italicWord)}
      </h2>
      <p className="text-[14.5px] text-fg-secondary mb-7">{config.subtitle}</p>

      <div className="flex flex-col gap-0 mb-8 rule rule-t rule-b">
        {config.options.map((option) => (
          <RowOption
            key={option.tier + option.label}
            active={selected === option.tier}
            onClick={() => onSelect(option.tier, option.label)}
            label={option.label}
            description={option.description}
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

// ─── Step 5: Details ────────────────────────────────────────────────────────

const ORG_BY_ROLE: Record<
  PlaygroundRole,
  { label: string; placeholder: string; required: boolean; hint?: string }
> = {
  student: { label: "School or university", placeholder: "e.g. MIT", required: false },
  developer: { label: "Company or team", placeholder: "e.g. Stripe", required: false, hint: "Leave blank if freelance." },
  designer: { label: "Studio or company", placeholder: "e.g. Linear", required: false },
  founder: { label: "Company name", placeholder: "e.g. Chumlab", required: true },
  company: { label: "Company name", placeholder: "e.g. Acme Inc.", required: true },
  other: { label: "Organisation or role", placeholder: "e.g. Independent consultant", required: false },
};

const REQUIREMENTS_PROMPT: Record<PlaygroundRole, string> = {
  student: "What are you trying to build or learn?",
  designer: "Which screens or surfaces are you hoping to ship?",
  developer: "What components or flows are you planning to build?",
  founder: "What is your product and who is it for?",
  company: "What problem are you trying to solve with Chumlab?",
  other: "Tell us what you're hoping to build.",
};

const FIELD_LABEL = "block eyebrow text-fg-tertiary mb-2";
const FIELD_INPUT =
  "w-full bg-transparent text-[14.5px] text-fg placeholder:text-fg-muted outline-none py-2.5 transition-colors";
const FIELD_INPUT_BORDER: React.CSSProperties = {
  borderBottom: "0.5px solid var(--border-soft)",
};

const PHONE_INPUT_CLASSES = {
  root: "flex flex-col",
  label: FIELD_LABEL,
  wrapper: "flex gap-2 items-stretch",
  input:
    "flex-1 bg-transparent text-[14.5px] text-fg placeholder:text-fg-muted outline-none py-2.5",
  countrySelectTrigger:
    "flex items-center justify-between gap-1.5 min-w-[108px] px-2 py-2.5 bg-transparent text-[14.5px] text-fg hover:text-accent outline-none transition-colors",
  countrySelectDropdown:
    "w-72 rounded-md overflow-hidden bg-bg-overlay shadow-[0_18px_40px_rgba(0,0,0,0.4)]",
  countrySelectSearchInput:
    "flex items-center gap-2 px-3 py-2 rule rule-b",
  countrySelectSearchInputElement:
    "flex-1 bg-transparent focus:outline-none text-sm text-fg placeholder:text-fg-muted",
  countrySelectOption:
    "flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-bg-elevated data-[focused]:bg-bg-elevated text-fg-secondary",
  countrySelectOptionSelected: "bg-bg-elevated text-fg",
  countrySelectOptionList: "max-h-60 overflow-y-auto",
  countrySelectChevron: "w-4 h-4 shrink-0 text-fg-tertiary",
  countrySelectCheckIcon: "w-4 h-4 shrink-0 text-accent",
  countrySelectSearchIcon: "w-4 h-4 shrink-0 text-fg-tertiary",
  countrySelectNoResults: "px-3 py-4 text-sm text-center text-fg-tertiary",
} as const;

function RequiredMark() {
  return (
    <span aria-hidden className="ml-0.5" style={{ color: "var(--accent)" }}>
      *
    </span>
  );
}

function DetailsStep({
  role,
  stepIndex,
  form,
  onChange,
  onBack,
  onSubmit,
  submitting,
  error,
}: {
  role: PlaygroundRole;
  stepIndex: number;
  form: FormState;
  onChange: (partial: Partial<FormState>) => void;
  onBack: () => void;
  onSubmit: () => void;
  submitting: boolean;
  error: string | null;
}) {
  const orgConfig = ORG_BY_ROLE[role];
  const orgOk = !orgConfig.required || !!form.organization.trim();
  const canSubmit = orgOk && !submitting;

  return (
    <div className="flex flex-col">
      <StepLabel index={stepIndex} />

      <h2
        className="font-sans font-medium text-fg mb-2 leading-[1.05]"
        style={{ fontSize: 30, letterSpacing: "-0.025em" }}
      >
        A few <span className="serif-accent">final</span> details.
      </h2>
      <p className="text-[14.5px] text-fg-secondary mb-7">
        Helps us tailor templates and docs to your situation.
      </p>

      <div className="flex flex-col gap-6">
        <div>
          <label htmlFor="pg-organization" className={FIELD_LABEL}>
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
            className={FIELD_INPUT}
            style={FIELD_INPUT_BORDER}
            onFocus={(e) =>
              (e.currentTarget.style.borderBottomColor = "var(--accent)")
            }
            onBlur={(e) =>
              (e.currentTarget.style.borderBottomColor = "var(--border-soft)")
            }
          />
          {orgConfig.hint && (
            <p className="mt-1.5 text-[12px] text-fg-tertiary">
              {orgConfig.hint}
            </p>
          )}
        </div>

        <div className="pb-1" style={FIELD_INPUT_BORDER}>
          <InternationalPhoneInput
            label="Phone number"
            defaultCountry="IN"
            onValueChange={(data) =>
              onChange({ phone: data.fullNumber || "" })
            }
            fullWidth
            placeholder="WhatsApp or mobile"
            classes={PHONE_INPUT_CLASSES}
            dropdownZIndex={10050}
          />
        </div>

        <div>
          <label htmlFor="pg-requirements" className={FIELD_LABEL}>
            {REQUIREMENTS_PROMPT[role]}
          </label>
          <textarea
            id="pg-requirements"
            rows={3}
            value={form.requirements}
            onChange={(e) => onChange({ requirements: e.target.value })}
            placeholder="Short and specific is best."
            className={`${FIELD_INPUT} resize-none leading-snug`}
            style={FIELD_INPUT_BORDER}
            onFocus={(e) =>
              (e.currentTarget.style.borderBottomColor = "var(--accent)")
            }
            onBlur={(e) =>
              (e.currentTarget.style.borderBottomColor = "var(--border-soft)")
            }
          />
        </div>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-5 text-[12.5px] leading-relaxed"
          style={{ color: "var(--accent)" }}
        >
          {error}
        </p>
      )}

      <div className="mt-8">
        <StepFooter
          onBack={onBack}
          onNext={onSubmit}
          nextDisabled={!canSubmit}
          nextLabel={submitting ? "Setting up..." : "Get access"}
          nextLoading={submitting}
        />
      </div>
    </div>
  );
}

// ─── Step 6: Success ────────────────────────────────────────────────────────

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
    <div className="flex flex-col items-center text-center">
      <img
        src={logoSmall}
        alt=""
        aria-hidden
        className="w-12 h-12 object-contain mb-6"
      />

      <div className="eyebrow mb-3" style={{ color: "var(--accent)" }}>
        On the waitlist
      </div>

      <h2
        className="font-serif italic text-fg leading-[0.95] mb-4"
        style={{ fontSize: 48, letterSpacing: "-0.025em" }}
      >
        Welcome in, {firstName}.
      </h2>
      <p className="text-[14.5px] text-fg-secondary leading-[1.55] max-w-sm mb-8">
        We&rsquo;ll email{" "}
        <span className="text-fg font-medium">{user.email}</span> as soon as
        early access opens.
      </p>

      <div
        className="relative w-full rounded-lg bg-bg-elevated p-6 mb-8 grid grid-cols-2 gap-4"
        style={{ border: "0.5px solid var(--border-soft)" }}
      >
        <div className="text-left">
          <div className="eyebrow text-fg-tertiary mb-2">Your position</div>
          <div
            className="font-serif italic text-fg leading-none tabular-nums"
            style={{ fontSize: 56 }}
          >
            #{result.position}
          </div>
        </div>
        <div className="text-left rule rule-l pl-5">
          <div className="eyebrow text-fg-tertiary mb-2">Est. wait</div>
          <div className="text-[20px] sm:text-[22px] font-medium text-fg leading-tight">
            {result.estimatedWait}
          </div>
          <div className="text-[12px] text-fg-tertiary mt-1">
            Rolling batches
          </div>
        </div>
      </div>

      <Button
        variant="primary"
        size="md"
        onClick={onClose}
        endIcon={<span aria-hidden>→</span>}
      >
        Start building
      </Button>
    </div>
  );
}

// ─── Shared bits ────────────────────────────────────────────────────────────

function SignedInPill({ user }: { user: PlaygroundUser }) {
  return (
    <div
      className="inline-flex self-start items-center gap-2.5 px-2.5 py-1.5 rounded-full bg-bg-elevated mb-6"
      style={{ border: "0.5px solid var(--border-faint)" }}
    >
      <div className="w-6 h-6 rounded-full bg-fg text-bg-base flex items-center justify-center text-[10.5px] font-medium">
        {user.initials}
      </div>
      <span className="text-[12px] text-fg-secondary pr-1">
        Signed in as <span className="text-fg">{user.email}</span>
      </span>
    </div>
  );
}

function RowOption({
  active,
  onClick,
  label,
  description,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  description: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="cursor-pointer text-left px-4 py-4 transition-colors duration-150 flex items-center gap-4 rule rule-b last:border-b-0 hover:bg-bg-elevated/60"
      style={{
        background: active ? "var(--border-faint)" : "transparent",
        borderLeft: active ? "2px solid var(--accent)" : "2px solid transparent",
        paddingLeft: active ? 14 : 16,
      }}
    >
      <div className="flex-1 min-w-0">
        <div className="text-[15px] font-medium text-fg">{label}</div>
        <div className="text-[12.5px] text-fg-tertiary leading-[1.4] mt-0.5">
          {description}
        </div>
      </div>
    </button>
  );
}

function StepFooter({
  onBack,
  onNext,
  nextDisabled,
  nextLabel,
  nextLoading,
}: {
  onBack: () => void;
  onNext: () => void;
  nextDisabled?: boolean;
  nextLabel: string;
  nextLoading?: boolean;
}) {
  return (
    <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
      <Button
        variant="ghost"
        size="sm"
        onClick={onBack}
        startIcon={
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        }
      >
        Back
      </Button>

      <Button
        variant="primary"
        size="sm"
        onClick={onNext}
        disabled={nextDisabled}
        loading={nextLoading}
        endIcon={
          !nextLoading ? (
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          ) : undefined
        }
      >
        {nextLabel}
      </Button>
    </div>
  );
}

function italicSplit(text: string, italicWord: string): React.ReactNode {
  const idx = text.indexOf(italicWord);
  if (idx < 0) return text;
  return (
    <>
      {text.slice(0, idx)}
      <span className="serif-accent">
        {text.slice(idx, idx + italicWord.length)}
      </span>
      {text.slice(idx + italicWord.length)}
    </>
  );
}

// ─── Role icons ─────────────────────────────────────────────────────────────
//
// All six icons share viewBox 0 0 24 24, strokeWidth 1.5, and rounded
// caps/joins so they read as a coherent set in the role-picker grid.

function IconSvg({ children }: { children: React.ReactNode }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {children}
    </svg>
  );
}

// Student — graduation cap + tassel.
function GraduationIcon() {
  return (
    <IconSvg>
      <path d="m22 10-10-5L2 10l10 5 10-5Z" />
      <path d="M6 12v5a6 6 0 0 0 12 0v-5" />
      <path d="M22 10v6" />
    </IconSvg>
  );
}

// Developer — code brackets with a slash. Replaces the previous `>_`
// shape, which read as broken because the polyline traced left-back-right.
function CodeIcon() {
  return (
    <IconSvg>
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
      <line x1="14" y1="4" x2="10" y2="20" />
    </IconSvg>
  );
}

// Designer — pen-tool (Lucide's pen-tool path), with a clean nib.
function PenToolIcon() {
  return (
    <IconSvg>
      <path d="m12 19 7-7 3 3-7 7-3-3Z" />
      <path d="m18 13-1.4-7.4L2 2l3.6 14.6L13 18l5-5Z" />
      <path d="m2 2 7.6 7.6" />
      <circle cx="11" cy="11" r="2" />
    </IconSvg>
  );
}

// Founder — rocket. Replaces the previous tortured single-path shape.
function RocketIcon() {
  return (
    <IconSvg>
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09Z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2Z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </IconSvg>
  );
}

// Company — multi-storey office building.
function BuildingIcon() {
  return (
    <IconSvg>
      <rect x="4" y="2" width="16" height="20" rx="1" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01" />
      <path d="M12 6h.01" />
      <path d="M16 6h.01" />
      <path d="M8 10h.01" />
      <path d="M12 10h.01" />
      <path d="M16 10h.01" />
      <path d="M8 14h.01" />
      <path d="M12 14h.01" />
      <path d="M16 14h.01" />
    </IconSvg>
  );
}

// Something else — sparkles, the conventional "miscellaneous / other" mark.
function SparkleIcon() {
  return (
    <IconSvg>
      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </IconSvg>
  );
}
