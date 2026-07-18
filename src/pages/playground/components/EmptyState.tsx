import logoSmall from "../../../assets/images/logo-small.png";

interface EmptyStateProps {
  onExample: (prompt: string) => void;
  disabled?: boolean;
}

const EXAMPLES = [
  "A 6-digit OTP input with paste + auto-advance",
  "A login form with email, password & remember me",
  "A pricing table with three tiers",
  "A settings page with labelled toggle rows",
];

// The first-run hero: a calm, premium prompt with one-tap starters. Describes
// what the playground does, then gets out of the way.
export default function EmptyState({ onExample, disabled }: EmptyStateProps) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-6 text-center">
      <span
        className="grid h-12 w-12 place-items-center rounded-2xl border border-border-faint bg-bg-elevated shadow-[0_8px_30px_-12px_var(--accent-glow)]"
        aria-hidden
      >
        <img src={logoSmall} alt="" className="h-7 w-7 object-contain" />
      </span>

      <h2 className="mt-5 font-display text-[22px] font-semibold tracking-tight text-fg">
        What will you build?
      </h2>
      <p className="mt-2 text-[13.5px] leading-relaxed text-fg-tertiary">
        Describe a component and the Chumlab team builds it — typed, accessible, and verified
        against the real library.
      </p>

      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            type="button"
            disabled={disabled}
            onClick={() => onExample(ex)}
            className="rounded-full border border-border-faint bg-bg-elevated px-3.5 py-2 text-[12.5px] text-fg-secondary transition-colors hover:border-accent/40 hover:text-fg disabled:opacity-50"
          >
            {ex}
          </button>
        ))}
      </div>
    </div>
  );
}
