import type { PlaygroundSettings, PreviewDevice } from "../types";

interface SettingsViewProps {
  settings: PlaygroundSettings;
  onChange: (patch: Partial<PlaygroundSettings>) => void;
  saving?: boolean;
}

const THEMES: PlaygroundSettings["previewTheme"][] = ["light", "dark", "system"];
const DEVICES: PreviewDevice[] = ["mobile", "tablet", "fill"];

const GATES = [
  { name: "Lint", desc: "Style + rule violations block delivery" },
  { name: "Type-check", desc: "TypeScript must compile clean" },
  { name: "Render", desc: "Component must mount without errors" },
  { name: "QA critic", desc: "Cold-reviewer pass for a11y + edge cases" },
];

function Pills<T extends string>({
  value,
  options,
  onSelect,
}: {
  value: T;
  options: readonly T[];
  onSelect: (v: T) => void;
}) {
  return (
    <div className="flex shrink-0 gap-0.5 rounded-md border-[0.5px] border-border-faint bg-bg-base p-[3px]">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onSelect(opt)}
          aria-pressed={value === opt}
          className={`rounded-[6px] px-2.5 py-1 text-xs capitalize transition-colors ${
            value === opt
              ? "bg-bg-overlay text-fg shadow-[inset_0_0_0_0.5px_var(--border-soft)]"
              : "text-fg-tertiary hover:text-fg-secondary"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

// Appearance settings persist to the backend; the gates panel is informational
// and read-only — gates are the product's whole promise and always run
// (Decision 2).
export default function SettingsView({ settings, onChange, saving }: SettingsViewProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="px-6 pb-2 pt-[30px]">
        <div className="mx-auto flex w-full max-w-[680px] items-center gap-3">
          <h1 className="font-display text-[23px] font-semibold tracking-tight">Settings</h1>
          {saving && <span className="font-mono text-[11px] text-fg-tertiary">saving…</span>}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-12 pt-2">
        <div className="mx-auto w-full max-w-[680px]">
          <div className="rule mb-4 overflow-hidden rounded-[10px] border-border-faint bg-bg-elevated">
            <div className="rule-b border-border-faint px-4 py-3.5 font-display text-sm font-semibold">
              Appearance
            </div>
            <div className="rule-b flex items-center gap-3.5 border-border-faint px-4 py-4">
              <div className="flex-1">
                <div className="text-[13px] font-medium">Preview theme default</div>
                <div className="mt-0.5 text-[11.5px] text-fg-tertiary">Which theme the stage opens in</div>
              </div>
              <Pills value={settings.previewTheme} options={THEMES} onSelect={(v) => onChange({ previewTheme: v })} />
            </div>
            <div className="flex items-center gap-3.5 px-4 py-4">
              <div className="flex-1">
                <div className="text-[13px] font-medium">Default device</div>
                <div className="mt-0.5 text-[11.5px] text-fg-tertiary">Viewport the preview frame starts at</div>
              </div>
              <Pills value={settings.previewDevice} options={DEVICES} onSelect={(v) => onChange({ previewDevice: v })} />
            </div>
          </div>

          <div className="rule overflow-hidden rounded-[10px] border-border-faint bg-bg-elevated">
            <div className="rule-b flex items-center gap-2 border-border-faint px-4 py-3.5 font-display text-sm font-semibold">
              Verification gates
              <span className="font-sans text-[11px] font-normal text-fg-tertiary">· always on</span>
            </div>
            {GATES.map((gate, i) => (
              <div
                key={gate.name}
                className={`flex items-center gap-3.5 px-4 py-4 ${i < GATES.length - 1 ? "rule-b border-border-faint" : ""}`}
              >
                <div className="flex-1">
                  <div className="text-[13px] font-medium">{gate.name}</div>
                  <div className="mt-0.5 text-[11.5px] text-fg-tertiary">{gate.desc}</div>
                </div>
                <span
                  role="switch"
                  aria-checked="true"
                  aria-disabled="true"
                  title="Gates always run in v1"
                  className="relative h-[22px] w-[38px] shrink-0 cursor-not-allowed rounded-full border border-accent bg-accent opacity-90"
                >
                  <span className="absolute left-[18px] top-[2px] h-4 w-4 rounded-full bg-white" />
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
