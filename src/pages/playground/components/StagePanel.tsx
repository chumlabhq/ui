import { useEffect, useRef, useState, type ReactNode } from "react";
import { Tooltip } from "../../../components/Tooltip";
import PreviewFrame from "./PreviewFrame";
import logoSmall from "../../../assets/images/logo-small.png";
import type { PreviewTheme } from "../../../lib/preview/runtime";
import type { PreviewDevice, VerifyError } from "../types";

type Tab = "preview" | "code";

interface StagePanelProps {
  code: string | null;
  previewTheme: PreviewTheme;
  onPreviewThemeChange: (theme: PreviewTheme) => void;
  device: PreviewDevice;
  onDeviceChange: (device: PreviewDevice) => void;
  onRendered?: () => void;
  onRenderError?: (error: VerifyError) => void;
  statusText: string;
  // A re-opened chat's run is being fetched — show a skeleton, not the idle state.
  loading?: boolean;
  initialTab?: Tab;
  onClose?: () => void;
}

const DEVICE: Record<PreviewDevice, { width: string; label: string; tip: string }> = {
  mobile: { width: "360px", label: "360px · mobile", tip: "Mobile · 360px" },
  tablet: { width: "620px", label: "620px · tablet", tip: "Tablet · 620px" },
  fill: { width: "100%", label: "fill · responsive", tip: "Desktop · fill" },
};

const DEVICE_ICONS: Record<PreviewDevice, ReactNode> = {
  mobile: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <rect x="7" y="3" width="10" height="18" rx="2" />
      <path d="M11 18h2" />
    </svg>
  ),
  tablet: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M11 17h2" />
    </svg>
  ),
  // Desktop / fill — a monitor, so it never reads as "fullscreen".
  fill: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8M12 16v4" />
    </svg>
  ),
};

const PREVIEW_ICON = (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
    <path
      fillRule="evenodd"
      d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z"
      clipRule="evenodd"
    />
  </svg>
);

const CODE_ICON = (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path
      fillRule="evenodd"
      d="M14.447 3.026a.75.75 0 0 1 .527.921l-4.5 16.5a.75.75 0 0 1-1.448-.394l4.5-16.5a.75.75 0 0 1 .921-.527ZM16.72 6.22a.75.75 0 0 1 1.06 0l5.25 5.25a.75.75 0 0 1 0 1.06l-5.25 5.25a.75.75 0 1 1-1.06-1.06L21.44 12l-4.72-4.72a.75.75 0 0 1 0-1.06Zm-9.44 0a.75.75 0 0 1 0 1.06L2.56 12l4.72 4.72a.75.75 0 0 1-1.06 1.06L.97 12.53a.75.75 0 0 1 0-1.06l5.25-5.25a.75.75 0 0 1 1.06 0Z"
      clipRule="evenodd"
    />
  </svg>
);

const SUN_ICON = (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-2.25A.75.75 0 0 1 12 18ZM7.758 17.303a.75.75 0 0 0-1.061-1.06l-1.591 1.59a.75.75 0 0 0 1.06 1.061l1.591-1.59ZM6 12a.75.75 0 0 1-.75.75H3a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 6 12ZM6.697 7.757a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 0 0-1.061 1.06l1.59 1.591Z" />
  </svg>
);

const MOON_ICON = (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path
      fillRule="evenodd"
      d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z"
      clipRule="evenodd"
    />
  </svg>
);

const COPY_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M5 15V5a2 2 0 0 1 2-2h10" />
  </svg>
);

function Sparkle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2l1.7 6.6a2 2 0 0 0 1.7 1.7L22 12l-6.6 1.7a2 2 0 0 0-1.7 1.7L12 22l-1.7-6.6a2 2 0 0 0-1.7-1.7L2 12l6.6-1.7a2 2 0 0 0 1.7-1.7z" />
    </svg>
  );
}

const WINDOW_ICON = (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path
      fillRule="evenodd"
      d="M2.25 6a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V6Zm18 3H3.75v9a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V9Zm-15-3.75A.75.75 0 0 0 4.5 6v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75V6a.75.75 0 0 0-.75-.75H5.25Zm1.5.75a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V6Zm3-.75A.75.75 0 0 0 9 6v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75V6a.75.75 0 0 0-.75-.75H9.75Z"
      clipRule="evenodd"
    />
  </svg>
);

const WARNING_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
    <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
    <path d="M12 9v4M12 17h.01" />
  </svg>
);

// Skeleton shown in the preview frame while a re-opened chat's run loads.
function PreviewSkeleton() {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3 bg-bg-base p-5" aria-hidden>
      <div className="pg-skeleton h-8 w-1/2 rounded-lg" />
      <div className="pg-skeleton h-24 w-full rounded-lg" />
      <div className="flex gap-3">
        <div className="pg-skeleton h-16 flex-1 rounded-lg" />
        <div className="pg-skeleton h-16 flex-1 rounded-lg" />
      </div>
      <div className="pg-skeleton h-9 w-2/3 rounded-lg" />
      <div className="pg-skeleton min-h-0 flex-1 rounded-lg" />
    </div>
  );
}

// The preview panel's placeholder — a premium idle state (and building / error
// variants) instead of a lone line of text.
function Placeholder({ statusText }: { statusText: string }) {
  const isError = statusText.startsWith("Render error");
  const isBuilding = statusText.toLowerCase().startsWith("building");

  const title = isError ? "Render error" : isBuilding ? "Building your component…" : "Live preview";
  const subtitle = isError
    ? statusText.replace("Render error — ", "")
    : isBuilding
      ? "The agents are composing and verifying it."
      : "Describe a component in the chat — it renders here, live.";

  return (
    <div className="relative grid min-h-0 flex-1 place-items-center bg-bg-base px-8 text-center">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-[60%] rounded-full blur-3xl"
        style={{
          background: isError
            ? "radial-gradient(circle, var(--danger-bg), transparent 70%)"
            : "radial-gradient(circle, color-mix(in srgb, var(--accent) 14%, transparent), transparent 70%)",
        }}
      />
      <div className="relative flex max-w-[260px] flex-col items-center">
        <span
          className={`relative grid h-14 w-14 place-items-center rounded-2xl border shadow-[0_12px_40px_-16px_var(--accent-glow)] ${
            isError
              ? "border-danger/30 bg-danger-bg text-danger"
              : "border-border-faint bg-bg-elevated text-fg-tertiary"
          }`}
        >
          {isBuilding ? (
            <>
              <img src={logoSmall} alt="" className="h-6 w-6 object-contain" />
              {/* sparkles orbiting the badge edge */}
              <span
                aria-hidden
                className="absolute inset-[-4px] animate-spin motion-reduce:animate-none"
                style={{ animationDuration: "4.5s" }}
              >
                <Sparkle className="absolute left-1/2 top-0 h-[13px] w-[13px] -translate-x-1/2 -translate-y-1/2 text-accent" />
                <Sparkle className="absolute right-1 top-2 h-2 w-2 text-accent/70" />
                <Sparkle className="absolute left-1.5 top-1.5 h-[7px] w-[7px] text-accent/50" />
              </span>
            </>
          ) : isError ? (
            <span className="[&_svg]:h-6 [&_svg]:w-6">{WARNING_ICON}</span>
          ) : (
            <span className="[&_svg]:h-6 [&_svg]:w-6">{WINDOW_ICON}</span>
          )}
        </span>
        <p className="mt-4 font-display text-[14.5px] font-semibold tracking-tight text-fg">{title}</p>
        <p className="mt-1.5 text-[12.5px] leading-relaxed text-fg-tertiary">{subtitle}</p>
      </div>
    </div>
  );
}

// A segmented control of icon buttons (Preview/Code, Light/Dark, device).
function Segmented({ children }: { children: ReactNode }) {
  return (
    <div className="flex shrink-0 gap-0.5 rounded-lg border border-border-faint bg-bg-elevated p-[3px]">
      {children}
    </div>
  );
}

function IconToggle({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: ReactNode;
}) {
  return (
    <Tooltip content={label} side="bottom" asChild>
      <button
        type="button"
        onClick={onClick}
        aria-pressed={active}
        aria-label={label}
        className={`grid place-items-center rounded-[6px] px-2 py-1.5 transition-colors [&_svg]:h-[15px] [&_svg]:w-[15px] ${
          active
            ? "bg-bg-overlay text-accent shadow-[inset_0_0_0_0.5px_var(--border-soft)]"
            : "text-fg-tertiary hover:text-fg-secondary"
        }`}
      >
        {children}
      </button>
    </Tooltip>
  );
}

// The preview stage: a clean icon toolbar and the rendered component (or its
// code) on a lit plinth that fills the panel height.
export default function StagePanel({
  code,
  previewTheme,
  onPreviewThemeChange,
  device,
  onDeviceChange,
  onRendered,
  onRenderError,
  statusText,
  loading = false,
  initialTab = "preview",
  onClose,
}: StagePanelProps) {
  const [tab, setTab] = useState<Tab>(initialTab);
  const [copied, setCopied] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  // Desktop ("fill") renders the real desktop layout at 1280px and scales it
  // down to fit the pane — so the sidebar/nav show just like in fullscreen,
  // instead of collapsing to the page's mobile breakpoint at ~pane width.
  const DESKTOP_W = 1280;
  const frameBodyRef = useRef<HTMLDivElement | null>(null);
  const [bodySize, setBodySize] = useState({ w: 0, h: 0 });
  useEffect(() => {
    const el = frameBodyRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const r = entries[0].contentRect;
      setBodySize({ w: Math.round(r.width), h: Math.round(r.height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [tab, code, fullscreen, device]);
  const desktopScale =
    device === "fill" && bodySize.w > 0 ? Math.min(1, bodySize.w / DESKTOP_W) : 1;

  // Esc exits fullscreen.
  useEffect(() => {
    if (!fullscreen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFullscreen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fullscreen]);

  const copyCode = () => {
    if (!code) return;
    void navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <section
      className={`flex flex-col bg-bg-base ${
        fullscreen ? "fixed inset-0 z-[60]" : "h-full min-h-0 min-w-0 flex-1"
      }`}
    >
      <div className="rule-b flex h-12 shrink-0 items-center gap-2 border-border-faint bg-bg-base px-3">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Back to chat"
            className="grid h-[30px] w-[30px] shrink-0 place-items-center rounded-lg border border-border-faint text-fg-tertiary hover:bg-fg/[0.045] hover:text-fg [&_svg]:h-4 [&_svg]:w-4"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </button>
        )}

        <Segmented>
          <IconToggle active={tab === "preview"} onClick={() => setTab("preview")} label="Preview">
            {PREVIEW_ICON}
          </IconToggle>
          <IconToggle active={tab === "code"} onClick={() => setTab("code")} label="Code">
            {CODE_ICON}
          </IconToggle>
        </Segmented>

        <span className="flex-1" />

        {/* device sizes — one segmented control, centered */}
        <div className="hidden sm:block">
          <Segmented>
            {(Object.keys(DEVICE) as PreviewDevice[]).map((d) => (
              <IconToggle
                key={d}
                active={device === d}
                onClick={() => onDeviceChange(d)}
                label={DEVICE[d].tip}
              >
                {DEVICE_ICONS[d]}
              </IconToggle>
            ))}
          </Segmented>
        </div>

        <span className="flex-1" />

        {code && (
          <Tooltip content={copied ? "Copied" : "Copy code"} side="bottom" asChild>
            <button
              type="button"
              onClick={copyCode}
              className="flex shrink-0 items-center gap-1.5 rounded-lg border border-border-faint px-2.5 py-1.5 text-[11.5px] text-fg-secondary transition-colors hover:bg-fg/[0.045] hover:text-fg [&_svg]:h-3.5 [&_svg]:w-3.5"
            >
              {COPY_ICON}
              <span className="hidden md:inline">{copied ? "Copied" : "Copy"}</span>
            </button>
          </Tooltip>
        )}

        <Segmented>
          <IconToggle
            active={previewTheme === "light"}
            onClick={() => onPreviewThemeChange("light")}
            label="Light mode"
          >
            {SUN_ICON}
          </IconToggle>
          <IconToggle
            active={previewTheme === "dark"}
            onClick={() => onPreviewThemeChange("dark")}
            label="Dark mode"
          >
            {MOON_ICON}
          </IconToggle>
        </Segmented>
      </div>

      {tab === "code" ? (
        <div className="pg-no-scrollbar min-h-0 flex-1 overflow-auto bg-bg-base p-4">
          {code ? (
            <pre className="w-full font-mono text-[12px] leading-relaxed text-fg-secondary">{code}</pre>
          ) : (
            <p className="pt-10 text-center text-sm text-fg-tertiary">No code yet.</p>
          )}
        </div>
      ) : (
        <div className="relative flex min-h-0 flex-1 justify-center overflow-hidden p-5">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(60% 45% at 50% 55%, color-mix(in srgb, var(--accent) 7%, transparent), transparent 70%), radial-gradient(circle at 1px 1px, color-mix(in srgb, var(--fg) 2.5%, transparent) 1px, transparent 0)",
              backgroundSize: "auto, 26px 26px",
            }}
          />
          <div
            className="relative z-10 flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-border-soft bg-bg-elevated shadow-[0_40px_90px_-40px_rgba(0,0,0,0.85)] transition-[width] duration-300 pg-settle"
            style={{ width: DEVICE[device].width, maxWidth: "100%" }}
          >
            <div className="rule-b flex h-8 shrink-0 items-center gap-2 border-border-faint bg-bg-overlay px-3">
              <span className="flex gap-1.5" aria-hidden>
                <i className="h-2 w-2 rounded-full bg-border-active" />
                <i className="h-2 w-2 rounded-full bg-border-active" />
                <i className="h-2 w-2 rounded-full bg-border-active" />
              </span>
            </div>
            {code ? (
              <div
                ref={frameBodyRef}
                className="pg-no-scrollbar relative min-h-0 flex-1 overflow-hidden bg-bg-base"
              >
                {device === "fill" ? (
                  <div
                    style={{
                      width: DESKTOP_W,
                      height: bodySize.h > 0 ? bodySize.h / desktopScale : "100%",
                      transform: `scale(${desktopScale})`,
                      transformOrigin: "top left",
                    }}
                  >
                    <PreviewFrame
                      code={code}
                      theme={previewTheme}
                      onRendered={onRendered}
                      onRenderError={onRenderError}
                      className="h-full w-full"
                    />
                  </div>
                ) : (
                  <PreviewFrame
                    code={code}
                    theme={previewTheme}
                    onRendered={onRendered}
                    onRenderError={onRenderError}
                    className="h-full w-full"
                  />
                )}
              </div>
            ) : loading ? (
              <PreviewSkeleton />
            ) : (
              <Placeholder statusText={statusText} />
            )}
          </div>
        </div>
      )}
    </section>
  );
}
