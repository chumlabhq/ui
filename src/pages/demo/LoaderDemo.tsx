import {
  CircularLoader,
  LinearLoader,
  DotLoader,
  PulseLoader,
} from "../../components/Loader";
import {
  DocsHero,
  Section,
  DemoWrapper,
  PropsTable,
  PropRow,
  DocControlledPattern,
  DocEdgeCases,
  DocDoDont,
} from "./components";
import { useTheme } from "./ThemeContext";

const getClasses = (_dark: boolean) => ({
 card: `rounded-cl-lg p-5 bg-cl-bg-elevated`,
  label: `text-xs font-medium text-cl-text-tertiary`,
  text: `text-sm text-cl-text-secondary`,
  textMuted: `text-xs text-cl-text-secondary`,
  btn: `inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-cl-md transition-colors bg-cl-text text-cl-bg hover:opacity-90`,
  btnDisabled: `inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-cl-md bg-cl-bg-hover text-cl-text-tertiary cursor-not-allowed dark:bg-cl-bg-elevated dark:text-cl-text-tertiary dark:cursor-not-allowed`,
 sectionCard: `rounded-cl-lg p-8 flex flex-col items-center justify-center gap-3 border border-cl-border bg-cl-bg-elevated`,
  inlineAlert: `flex items-center gap-2 rounded-cl-md px-3 py-2 text-sm bg-cl-warning/15 border border-cl-warning text-cl-warning dark:bg-cl-warning/20 dark:border dark:border-cl-warning/40 dark:text-cl-warning`,
});

const LoaderDemo = () => {
  const { isDarkMode: dark } = useTheme();
  const c = getClasses(dark);

  return (
    <div className="space-y-10">
      <DocsHero
        title="Loaders"
        description='Lightweight, animated loading indicators. Four variants — CircularLoader, LinearLoader, DotLoader, and PulseLoader — each configurable for size, speed, and color. All use role="status" and aria-label out of the box.'
        code={`import { CircularLoader, LinearLoader, DotLoader, PulseLoader } from "@chumlab/ui/loader";`}
      />

      {/* ─── Basic Usage ────────────────────────────────────────────────── */}
      <Section
        title="Basic Usage"
        description="All four loader variants work out-of-the-box with built-in styles and proper aria attributes."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <CircularLoader />
          <LinearLoader />
          <DotLoader />
          <PulseLoader />
        </DemoWrapper>
      </Section>

      {/* ── All Variants ───────────────────────────────────────────────── */}
      <Section
        title="All Variants"
        description="Four loader variants for different use cases."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <div className="flex items-center gap-6 sm:gap-12 flex-wrap">
            <div className="flex flex-col items-center gap-3">
              <CircularLoader
                size={32}
                className="text-cl-accent"
              />
              <span className={c.label}>Circular</span>
            </div>
            <div className="flex flex-col items-center gap-3 w-32 sm:w-40">
              <LinearLoader
                className="text-cl-accent"
                width="100%"
                trackColor={dark ? "rgba(255,255,255,0.1)" : undefined}
              />
              <span className={c.label}>Linear</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <DotLoader
                dotSize={10}
                className="text-cl-accent"
              />
              <span className={c.label}>Dot</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <PulseLoader
                size={40}
                className="text-cl-accent"
              />
              <span className={c.label}>Pulse</span>
            </div>
          </div>
        </DemoWrapper>
      </Section>

      {/* ━━━ CIRCULAR LOADER ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}

      {/* ── Circular — Sizes ───────────────────────────────────────────── */}
      <Section
        title="Circular — Sizes"
        description="Use the size prop to control dimensions in pixels."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <div className="flex items-center gap-4 sm:gap-8 flex-wrap">
            {[16, 24, 40, 64].map((s) => (
              <div key={s} className="flex flex-col items-center gap-2">
                <CircularLoader
                  size={s}
                  className="text-cl-accent"
                />
                <span className={c.label}>{s}px</span>
              </div>
            ))}
          </div>
        </DemoWrapper>
      </Section>

      {/* ── Circular — Colors ──────────────────────────────────────────── */}
      <Section
        title="Circular — Colors"
        description="The spinner uses currentColor, so you can set the color via a CSS class or inline style."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <div className="flex items-center gap-4 sm:gap-8 flex-wrap">
            {[
              {
                cls: "text-cl-accent",
                name: "Indigo",
              },
              {
                cls: "text-cl-accent",
                name: "Emerald",
              },
              { cls: "text-cl-accent", name: "Rose" },
              {
                cls: "text-cl-accent",
                name: "Amber",
              },
            ].map(({ cls, name }) => (
              <div key={name} className="flex flex-col items-center gap-2">
                <CircularLoader size={32} className={cls} />
                <span className={c.label}>{name}</span>
              </div>
            ))}
          </div>
        </DemoWrapper>
      </Section>

      {/* ── Circular — Speed ───────────────────────────────────────────── */}
      <Section
        title="Circular — Speed"
        description="Control the animation duration in seconds. Lower values spin faster."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <div className="flex items-center gap-4 sm:gap-8 flex-wrap">
            {[
              { speed: 2, label: "Slow (2s)" },
              { speed: 0.75, label: "Normal (0.75s)" },
              { speed: 0.35, label: "Fast (0.35s)" },
            ].map(({ speed, label }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <CircularLoader
                  size={32}
                  speed={speed}
                  className="text-cl-accent"
                />
                <span className={c.label}>{label}</span>
              </div>
            ))}
          </div>
        </DemoWrapper>
      </Section>

      {/* ── Circular — Track Color ─────────────────────────────────────── */}
      <Section
        title="Circular — Track Color"
        description="The trackColor prop sets the background circle color. By default it uses currentColor at 20% opacity."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <div className="flex items-center gap-4 sm:gap-8 flex-wrap">
            <div className="flex flex-col items-center gap-2">
              <CircularLoader
                size={32}
                className="text-cl-accent"
              />
              <span className={c.label}>Default track</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <CircularLoader
                size={32}
                className="text-cl-accent"
                />
              <span className={c.label}>Indigo track</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <CircularLoader
                size={32}
                className="text-cl-accent"
                />
              <span className={c.label}>Emerald track</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <CircularLoader
                size={32}
                className="text-cl-accent"
                />
              <span className={c.label}>Rose track</span>
            </div>
          </div>
        </DemoWrapper>
      </Section>

      {/* ── Circular — Thickness ───────────────────────────────────────── */}
      <Section
        title="Circular — Thickness"
        description="The thickness prop controls the stroke width of both the track and the spinner arc."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <div className="flex items-center gap-4 sm:gap-8 flex-wrap">
            {[
              { thickness: 1, label: "Thin (1)" },
              { thickness: 2, label: "Normal (2)" },
              { thickness: 4, label: "Thick (4)" },
              { thickness: 6, label: "Extra thick (6)" },
            ].map(({ thickness, label }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <CircularLoader
                  size={40}
                  thickness={thickness}
                  className="text-cl-accent"
                />
                <span className={c.label}>{label}</span>
              </div>
            ))}
          </div>
        </DemoWrapper>
      </Section>

      {/* ━━━ LINEAR LOADER ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}

      {/* ── Linear — Basic ─────────────────────────────────────────────── */}
      <Section
        title="Linear — Basic"
        description="An indeterminate horizontal progress bar. Great for page-level or section-level loading states."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <div className="w-full max-w-xs sm:max-w-md">
            <LinearLoader
              className="text-cl-accent"
              trackColor={dark ? "rgba(255,255,255,0.1)" : undefined}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ── Linear — Heights ───────────────────────────────────────────── */}
      <Section
        title="Linear — Heights"
        description="The height prop controls bar thickness in pixels."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <div className="flex flex-col gap-6 w-full max-w-xs sm:max-w-md">
            {[2, 4, 8].map((h) => (
              <div key={h} className="space-y-1">
                <span className={c.label}>{h}px</span>
                <LinearLoader
                  height={h}
                  className="text-cl-accent"
                  trackColor={dark ? "rgba(255,255,255,0.1)" : undefined}
                />
              </div>
            ))}
          </div>
        </DemoWrapper>
      </Section>

      {/* ── Linear — Colors ────────────────────────────────────────────── */}
      <Section
        title="Linear — Colors"
        description="Uses currentColor for the bar and a separate trackColor for the background."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <div className="flex flex-col gap-4 w-full max-w-xs sm:max-w-md">
            <LinearLoader
              className="text-cl-accent"
              trackColor="rgba(91,155,255,0.18)"
            />
            <LinearLoader
              className="text-cl-accent"
              trackColor="rgba(91,155,255,0.18)"
            />
            <LinearLoader
              className="text-cl-accent"
              trackColor="rgba(91,155,255,0.18)"
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ── Linear — Speed ─────────────────────────────────────────────── */}
      <Section
        title="Linear — Speed"
        description="Animation duration in seconds via the speed prop."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <div className="flex flex-col gap-4 w-full max-w-xs sm:max-w-md">
            {[
              { speed: 3, label: "Slow (3s)" },
              { speed: 1.5, label: "Normal (1.5s)" },
              { speed: 0.7, label: "Fast (0.7s)" },
            ].map(({ speed, label }) => (
              <div key={label} className="space-y-1">
                <span className={c.label}>{label}</span>
                <LinearLoader
                  speed={speed}
                  className="text-cl-accent"
                  trackColor={dark ? "rgba(255,255,255,0.1)" : undefined}
                />
              </div>
            ))}
          </div>
        </DemoWrapper>
      </Section>

      {/* ━━━ DOT LOADER ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}

      {/* ── Dot — Basic ────────────────────────────────────────────────── */}
      <Section
        title="Dot — Basic"
        description="Three bouncing dots. A common pattern in messaging and chat interfaces."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <DotLoader
            dotSize={10}
            className="text-cl-accent"
          />
        </DemoWrapper>
      </Section>

      {/* ── Dot — Sizes & Count ────────────────────────────────────────── */}
      <Section
        title="Dot — Sizes & Count"
        description="Control the dot diameter, gap, and number of dots."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <div className="flex items-center gap-6 sm:gap-10 flex-wrap">
            <div className="flex flex-col items-center gap-2">
              <DotLoader
                dotSize={6}
                gap={3}
                className="text-cl-accent"
              />
              <span className={c.label}>Small</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <DotLoader
                dotSize={10}
                className="text-cl-accent"
              />
              <span className={c.label}>Default</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <DotLoader
                dotSize={14}
                gap={6}
                className="text-cl-accent"
              />
              <span className={c.label}>Large</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <DotLoader
                dotSize={8}
                count={5}
                className="text-cl-accent"
              />
              <span className={c.label}>5 dots</span>
            </div>
          </div>
        </DemoWrapper>
      </Section>

      {/* ── Dot — Colors ───────────────────────────────────────────────── */}
      <Section
        title="Dot — Colors"
        description="Uses currentColor, so apply any color class or inline style."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <div className="flex items-center gap-6 sm:gap-10 flex-wrap">
            {[
              {
                cls: "text-cl-accent",
                name: "Indigo",
              },
              {
                cls: "text-cl-accent",
                name: "Emerald",
              },
              { cls: "text-cl-accent", name: "Rose" },
              {
                cls: "text-cl-accent",
                name: "Amber",
              },
            ].map(({ cls, name }) => (
              <div key={name} className="flex flex-col items-center gap-2">
                <DotLoader dotSize={10} className={cls} />
                <span className={c.label}>{name}</span>
              </div>
            ))}
          </div>
        </DemoWrapper>
      </Section>

      {/* ━━━ PULSE LOADER ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}

      {/* ── Pulse — Basic ──────────────────────────────────────────────── */}
      <Section
        title="Pulse — Basic"
        description="A pulsing dot with expanding ripple rings. Great for center-screen loading states."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <PulseLoader
            size={48}
            className="text-cl-accent"
          />
        </DemoWrapper>
      </Section>

      {/* ── Pulse — Sizes ──────────────────────────────────────────────── */}
      <Section
        title="Pulse — Sizes & Rings"
        description="Control the circle diameter and the number of ripple rings."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <div className="flex items-center gap-6 sm:gap-12 flex-wrap">
            <div className="flex flex-col items-center gap-2">
              <PulseLoader
                size={24}
                className="text-cl-accent"
              />
              <span className={c.label}>24px</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <PulseLoader
                size={40}
                className="text-cl-accent"
              />
              <span className={c.label}>40px</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <PulseLoader
                size={64}
                className="text-cl-accent"
              />
              <span className={c.label}>64px</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <PulseLoader
                size={48}
                rings={3}
                className="text-cl-accent"
              />
              <span className={c.label}>3 rings</span>
            </div>
          </div>
        </DemoWrapper>
      </Section>

      {/* ━━━ IN CONTEXT ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}

      {/* ── With Label ─────────────────────────────────────────────────── */}
      <Section
        title="With Label"
        description="Pair loaders with text for a common loading pattern."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <CircularLoader
                size={20}
                className="text-cl-accent"
              />
              <span className={c.text}>Loading...</span>
            </div>
            <div className="flex items-center gap-3">
              <DotLoader
                dotSize={6}
                className="text-cl-accent"
              />
              <span className={c.textMuted}>Typing</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <PulseLoader
                size={48}
                className="text-cl-accent"
              />
              <span
                className={`text-sm font-medium text-cl-text-secondary`}
              >
                Please wait...
              </span>
            </div>
          </div>
        </DemoWrapper>
      </Section>

      {/* ── In Context ─────────────────────────────────────────────────── */}
      <Section
        title="In Context"
        description="Real-world usage patterns showing loaders in buttons, cards, and inline alerts."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <div className="flex flex-col gap-6">
            {/* Buttons */}
            <div className="flex items-center gap-4 flex-wrap">
              <button type="button" className={c.btnDisabled} disabled>
                <CircularLoader
                  size={16}
                  className="text-cl-accent"
                />
                Saving...
              </button>
              <button type="button" className={c.btn}>
                <CircularLoader size={16} className="text-cl-accent" />
                Processing
              </button>
              <button type="button" className={c.btn}>
                <DotLoader dotSize={5} gap={3} className="text-cl-accent" />
              </button>
            </div>

            {/* Card loading */}
            <div className={c.sectionCard}>
              <CircularLoader
                size={36}
                thickness={3}
                className="text-cl-accent"
              />
              <p className={c.textMuted}>Loading content...</p>
            </div>

            {/* Full-width linear bar */}
            <div
              className={`rounded-cl-lg border overflow-hidden border-cl-border`}
            >
              <LinearLoader
                height={3}
                className="text-cl-accent"
                trackColor="rgba(91,155,255,0.18)"
                borderRadius={0}
              />
              <div className={`p-6 bg-cl-bg-elevated`}>
                <div
                  className={`h-4 w-32 sm:w-48 rounded bg-cl-bg-hover dark:bg-cl-text/60`}
                />
                <div
                  className={`mt-2 h-3 w-48 sm:w-64 rounded bg-cl-bg-hover dark:bg-cl-bg-hover`}
                />
              </div>
            </div>

            {/* Inline alert */}
            <div className={c.inlineAlert}>
              <CircularLoader
                size={14}
                thickness={2}
                className="text-cl-accent"
              />
              Syncing your data...
            </div>
          </div>
        </DemoWrapper>
      </Section>

      {/* ── Props — CircularLoader ─────────────────────────────────────── */}
      <Section title="CircularLoader Props" isDarkMode={dark}>
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow
              name="size"
              type="number"
              defaultVal="20"
              description="Width and height of the loader in pixels"
              isDarkMode={dark}
            />
            <PropRow
              name="thickness"
              type="number"
              defaultVal="2"
              description="Stroke width of the track and spinner arc"
              isDarkMode={dark}
            />
            <PropRow
              name="speed"
              type="number"
              defaultVal="0.75"
              description="Animation duration in seconds (lower = faster)"
              isDarkMode={dark}
            />
            <PropRow
              name="trackColor"
              type="string"
              defaultVal="currentColor"
              description="Color of the background track circle (rendered at 20% opacity)"
              isDarkMode={dark}
            />
            <PropRow
              name="className"
              type="string"
              description="CSS class(es) on the root div"
              isDarkMode={dark}
            />
            <PropRow
              name="style"
              type="CSSProperties"
              description="Inline styles on the root div"
              isDarkMode={dark}
            />
            <PropRow
              name="ref"
              type="Ref<HTMLDivElement>"
              description="Forwarded ref to the root div"
              isDarkMode={dark}
            />
          </PropsTable>
        </div>
      </Section>

      {/* ── Props — LinearLoader ───────────────────────────────────────── */}
      <Section title="LinearLoader Props" isDarkMode={dark}>
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow
              name="height"
              type="number"
              defaultVal="4"
              description="Height of the bar in pixels"
              isDarkMode={dark}
            />
            <PropRow
              name="width"
              type="string | number"
              defaultVal='"100%"'
              description="Width of the bar (CSS value)"
              isDarkMode={dark}
            />
            <PropRow
              name="speed"
              type="number"
              defaultVal="1.5"
              description="Animation duration in seconds"
              isDarkMode={dark}
            />
            <PropRow
              name="trackColor"
              type="string"
              description="Background track color"
              isDarkMode={dark}
            />
            <PropRow
              name="borderRadius"
              type="number"
              defaultVal="9999"
              description="Border radius in pixels (pill by default)"
              isDarkMode={dark}
            />
            <PropRow
              name="className"
              type="string"
              description="CSS class(es) on the root div"
              isDarkMode={dark}
            />
            <PropRow
              name="style"
              type="CSSProperties"
              description="Inline styles on the root div"
              isDarkMode={dark}
            />
            <PropRow
              name="ref"
              type="Ref<HTMLDivElement>"
              description="Forwarded ref to the root div"
              isDarkMode={dark}
            />
          </PropsTable>
        </div>
      </Section>

      {/* ── Props — DotLoader ──────────────────────────────────────────── */}
      <Section title="DotLoader Props" isDarkMode={dark}>
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow
              name="dotSize"
              type="number"
              defaultVal="8"
              description="Diameter of each dot in pixels"
              isDarkMode={dark}
            />
            <PropRow
              name="gap"
              type="number"
              defaultVal="4"
              description="Gap between dots in pixels"
              isDarkMode={dark}
            />
            <PropRow
              name="count"
              type="number"
              defaultVal="3"
              description="Number of dots"
              isDarkMode={dark}
            />
            <PropRow
              name="speed"
              type="number"
              defaultVal="1.4"
              description="Full animation cycle duration in seconds"
              isDarkMode={dark}
            />
            <PropRow
              name="className"
              type="string"
              description="CSS class(es) on the root div"
              isDarkMode={dark}
            />
            <PropRow
              name="style"
              type="CSSProperties"
              description="Inline styles on the root div"
              isDarkMode={dark}
            />
            <PropRow
              name="ref"
              type="Ref<HTMLDivElement>"
              description="Forwarded ref to the root div"
              isDarkMode={dark}
            />
          </PropsTable>
        </div>
      </Section>

      {/* ── Props — PulseLoader ────────────────────────────────────────── */}
      <Section title="PulseLoader Props" isDarkMode={dark}>
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow
              name="size"
              type="number"
              defaultVal="40"
              description="Diameter of the circle in pixels"
              isDarkMode={dark}
            />
            <PropRow
              name="speed"
              type="number"
              defaultVal="1.5"
              description="Animation duration in seconds"
              isDarkMode={dark}
            />
            <PropRow
              name="rings"
              type="number"
              defaultVal="2"
              description="Number of ripple rings"
              isDarkMode={dark}
            />
            <PropRow
              name="className"
              type="string"
              description="CSS class(es) on the root div"
              isDarkMode={dark}
            />
            <PropRow
              name="style"
              type="CSSProperties"
              description="Inline styles on the root div"
              isDarkMode={dark}
            />
            <PropRow
              name="ref"
              type="Ref<HTMLDivElement>"
              description="Forwarded ref to the root div"
              isDarkMode={dark}
            />
          </PropsTable>
        </div>
      </Section>

      {/* ── Accessibility ──────────────────────────────────────────────── */}
      <Section
        title="Accessibility"
        description="Built-in accessibility features across all loader variants."
        isDarkMode={dark}
      >
        <div className={c.card}>
          <div
            className={`space-y-2 text-sm text-cl-text-secondary`}
          >
            {[
              'All variants render role="status" so screen readers announce them as live regions.',
              'All include aria-label="Loading" by default — override via props for specific messages.',
              "Uses currentColor so loaders inherit the surrounding text color automatically.",
              "SVG/DOM elements are decorative and inherit accessible names from the parent.",
              "Supports ref forwarding for programmatic focus management if needed.",
              "Use aria-hidden on decorative loaders when adjacent text explains status.",
              "Reduced motion support via CSS prefers-reduced-motion media query.",
            ].map((text) => (
              <p key={text} className="flex items-start gap-2">
                <span
                  className={`mt-0.5 shrink-0 text-cl-success`}
                >
                  &#10003;
                </span>
                <span>{text}</span>
              </p>
            ))}
          </div>
        </div>
      </Section>

      {/* ── Data Attributes ────────────────────────────────────────────── */}
      <Section
        title="Data Attributes"
        description="Use for CSS-based state styling."
        isDarkMode={dark}
      >
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow
              name="data-reduce-motion"
              type="root"
              description="Present when reduced motion is active"
              isDarkMode={dark}
            />
          </PropsTable>
        </div>
      </Section>

      <DocControlledPattern
        isDarkMode={dark}
        summary="Loaders are presentational. Control visibility with parent loading state; there is no internal async state. Use CircularLoader for inline/button contexts, LinearLoader for page/section bars, DotLoader for chat/typing indicators, and PulseLoader for center-screen loading states."
      />
      <DocEdgeCases
        isDarkMode={dark}
        items={[
          "Long requests should pair with cancel/retry at the data layer.",
          "Multiple inline loaders need distinct accessible names if labeled.",
          "Reduced motion preferences should shorten or disable endless animations.",
          "Linear loaders at the top of a container should use borderRadius={0}.",
        ]}
      />
      <DocDoDont
        isDarkMode={dark}
        dos={[
          "Mark decorative loaders with `aria-hidden` when adjacent text explains status.",
          "Provide loading text for page-level busy regions when appropriate.",
          "Keep contrast sufficient on all backgrounds (use dark-mode-aware colors).",
          "Use the right variant for the context — dots for typing, linear for pages.",
        ]}
        donts={[
          "Do not use infinite spinners without timeout or error handling.",
          "Do not rely on color-only loading indicators.",
          "Do not nest focusable controls inside purely decorative loaders.",
          "Do not use Pulse loaders in tight inline spaces — they need room.",
        ]}
      />
    </div>
  );
};

export default LoaderDemo;
