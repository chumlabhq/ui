import type { PlaygroundSettings } from "../types";

interface PersonaCardProps {
  onSeed: (patch: Partial<PlaygroundSettings>) => void;
  onDismiss: () => void;
}

// Each persona just seeds sensible appearance defaults — it never gates the
// build (Track C, D4). One card, first load only, fully skippable.
const PERSONAS: { label: string; hint: string; seed: Partial<PlaygroundSettings> }[] = [
  { label: "Designer", hint: "tablet · light", seed: { previewDevice: "tablet", previewTheme: "light" } },
  { label: "Developer", hint: "fill · dark", seed: { previewDevice: "fill", previewTheme: "dark" } },
  { label: "Founder / PM", hint: "mobile · light", seed: { previewDevice: "mobile", previewTheme: "light" } },
  { label: "Just exploring", hint: "defaults", seed: {} },
];

export default function PersonaCard({ onSeed, onDismiss }: PersonaCardProps) {
  return (
    <div className="rule relative shrink-0 overflow-hidden rounded-xl border-border-soft bg-bg-elevated px-4 py-3.5">
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss"
        className="absolute right-3 top-3 grid h-6 w-6 place-items-center rounded-md text-fg-tertiary hover:bg-fg/[0.045] hover:text-fg"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5" aria-hidden>
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
      <p className="font-display text-[13.5px] font-semibold tracking-tight">Tune the preview to how you work</p>
      <p className="mt-0.5 text-[11.5px] text-fg-tertiary">Optional — sets the preview theme + device. Change it anytime in Settings.</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {PERSONAS.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => {
              onSeed(p.seed);
              onDismiss();
            }}
            className="rule flex items-center gap-2 rounded-lg border-border-faint bg-bg-overlay/60 px-3 py-2 text-left transition-colors hover:border-accent/40 hover:bg-bg-overlay"
          >
            <span className="text-[12.5px] font-medium">{p.label}</span>
            <span className="font-mono text-[10px] text-fg-muted">{p.hint}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
