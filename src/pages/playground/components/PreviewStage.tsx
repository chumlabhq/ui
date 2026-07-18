import PreviewFrame from "./PreviewFrame";
import type { PreviewTheme } from "../../../lib/preview/runtime";
import type { VerifyError } from "../types";

interface PreviewStageProps {
  code: string | null;
  theme: PreviewTheme;
  onThemeChange: (theme: PreviewTheme) => void;
  onRendered?: () => void;
  onRenderError?: (error: VerifyError) => void;
  live: boolean;
  statusText: string;
}

// The visual hero: the rendered component presented on a lit plinth. The
// instrument bar carries the live pulse, the address readout, and the
// "prove it's real" theme toggle.
export default function PreviewStage({
  code,
  theme,
  onThemeChange,
  onRendered,
  onRenderError,
  live,
  statusText,
}: PreviewStageProps) {
  return (
    <div className="rule relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border-border-soft bg-bg-elevated">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[36%] h-[60%] w-[70%] -translate-x-1/2 opacity-[0.22] blur-2xl"
        style={{ background: "radial-gradient(closest-side, var(--accent-glow), transparent)" }}
      />

      <div className="rule-b relative z-10 flex items-center gap-3 px-4 py-2.5">
        <span
          className={`flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wide ${
            live ? "text-success" : "text-fg-tertiary"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${live ? "bg-success pg-pulse" : "bg-fg-muted"}`}
          />
          {live ? "live" : "idle"}
        </span>
        <span className="flex flex-1 items-center justify-center gap-1.5 font-mono text-xs text-fg-tertiary">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <rect x="5" y="11" width="14" height="10" rx="2" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" />
          </svg>
          chumlab.app/preview
        </span>
        <div className="flex overflow-hidden rounded-md border border-border-faint">
          {(["dark", "light"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => onThemeChange(t)}
              className={`px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide transition-colors ${
                theme === t ? "bg-bg-overlay text-fg" : "text-fg-tertiary hover:text-fg-secondary"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        {code ? (
          <PreviewFrame
            code={code}
            theme={theme}
            onRendered={onRendered}
            onRenderError={onRenderError}
            className="min-h-0 w-full flex-1 pg-settle"
          />
        ) : (
          <div className="grid flex-1 place-items-center px-8 text-center">
            <p className="max-w-xs text-sm text-fg-tertiary">{statusText}</p>
          </div>
        )}
      </div>
    </div>
  );
}
