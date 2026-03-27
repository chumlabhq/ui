import { CircularLoader } from "../../components/Loader";
import { useTheme } from "./ThemeContext";
import {
  Section,
  CodeBlock,
  DemoWrapper,
  PropsTable,
  PropRow,
  DocControlledPattern,
  DocEdgeCases,
  DocDoDont,
} from "./components";

const getClasses = (dark: boolean) => ({
  card: `rounded-2xl border p-5 ${dark ? "border-white/[0.06] bg-linear-to-br from-white/[0.03] to-white/[0.01]" : "border-gray-200 bg-white shadow-sm shadow-gray-900/[0.04]"}`,
  label: `text-xs font-medium ${dark ? "text-gray-500" : "text-gray-400"}`,
  btn: `inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${dark ? "bg-indigo-500 text-white hover:bg-indigo-600" : "bg-indigo-600 text-white hover:bg-indigo-700"}`,
  btnDisabled: `inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg ${dark ? "bg-gray-700 text-gray-400 cursor-not-allowed" : "bg-gray-200 text-gray-500 cursor-not-allowed"}`,
});

const LoaderDemo = () => {
  const { isDarkMode: dark } = useTheme();
  const c = getClasses(dark);

  return (
    <div className="space-y-10">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="relative overflow-hidden rounded-2xl p-6 sm:p-8">
        <div
          className={`absolute inset-0 ${dark ? "bg-linear-to-br from-indigo-950/80 via-gray-900/60 to-blue-950/50" : "bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50"}`}
        />
        <div
          className={`absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl ${dark ? "bg-blue-500/10" : "bg-blue-200/40"}`}
        />
        <div
          className={`absolute -bottom-24 -left-24 w-64 h-64 rounded-full blur-3xl ${dark ? "bg-indigo-500/10" : "bg-indigo-200/30"}`}
        />
        <div className="relative">
          <h1
            className={`text-3xl font-bold mb-3 ${dark ? "text-white" : "text-gray-900"}`}
          >
            Circular Loader
          </h1>
          <p
            className={`text-sm leading-relaxed max-w-2xl ${dark ? "text-gray-400" : "text-gray-600"}`}
          >
            A lightweight, animated circular loading spinner. Configurable size,
            thickness, speed, and track color. Uses SVG with CSS custom
            properties for easy theming. Includes{" "}
            <code className="text-xs">role="status"</code> and{" "}
            <code className="text-xs">aria-label</code> out of the box.
          </p>
          <div className="mt-5">
            <CodeBlock
              isDarkMode={dark}
              code={`import { CircularLoader } from "@kern-ui/loader";`}
            />
          </div>
        </div>
      </header>

      {/* ── Basic ──────────────────────────────────────────────────────── */}
      <Section
        title="Basic"
        description="Default loader with no props. Renders at 20px with a 2px stroke and 0.75s animation speed."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <CircularLoader />
        </DemoWrapper>
      </Section>

      {/* ── Sizes ──────────────────────────────────────────────────────── */}
      <Section
        title="Sizes"
        description="Use the size prop to control the loader dimensions in pixels."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="flex items-center gap-8">
            <div className="flex flex-col items-center gap-2">
              <CircularLoader size={16} />
              <span className={c.label}>16px</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <CircularLoader size={24} />
              <span className={c.label}>24px</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <CircularLoader size={40} />
              <span className={c.label}>40px</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <CircularLoader size={64} />
              <span className={c.label}>64px</span>
            </div>
          </div>
        </DemoWrapper>
      </Section>

      {/* ── Colors ─────────────────────────────────────────────────────── */}
      <Section
        title="Colors"
        description="The spinner uses currentColor, so you can set the color via a CSS class or inline style."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="flex items-center gap-8">
            <div className="flex flex-col items-center gap-2">
              <CircularLoader size={32} className="text-indigo-500" />
              <span className={c.label}>Indigo</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <CircularLoader size={32} className="text-emerald-500" />
              <span className={c.label}>Emerald</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <CircularLoader size={32} className="text-rose-500" />
              <span className={c.label}>Rose</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <CircularLoader size={32} className="text-amber-500" />
              <span className={c.label}>Amber</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <CircularLoader
                size={32}
                style={{ color: "#8b5cf6" }}
              />
              <span className={c.label}>Inline style</span>
            </div>
          </div>
        </DemoWrapper>
      </Section>

      {/* ── Speed ──────────────────────────────────────────────────────── */}
      <Section
        title="Speed"
        description="Control the animation duration in seconds via the speed prop. Lower values spin faster."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="flex items-center gap-8">
            <div className="flex flex-col items-center gap-2">
              <CircularLoader size={32} speed={2} />
              <span className={c.label}>Slow (2s)</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <CircularLoader size={32} speed={0.75} />
              <span className={c.label}>Normal (0.75s)</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <CircularLoader size={32} speed={0.35} />
              <span className={c.label}>Fast (0.35s)</span>
            </div>
          </div>
        </DemoWrapper>
      </Section>

      {/* ── Track Color ────────────────────────────────────────────────── */}
      <Section
        title="Track Color"
        description="The trackColor prop sets the background circle color. By default it uses currentColor at 20% opacity."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="flex items-center gap-8">
            <div className="flex flex-col items-center gap-2">
              <CircularLoader
                size={32}
                className="text-indigo-500"
              />
              <span className={c.label}>Default track</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <CircularLoader
                size={32}
                className="text-indigo-500"
                trackColor="#c7d2fe"
              />
              <span className={c.label}>Indigo track</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <CircularLoader
                size={32}
                className="text-emerald-500"
                trackColor="#d1fae5"
              />
              <span className={c.label}>Emerald track</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <CircularLoader
                size={32}
                className="text-rose-500"
                trackColor="#ffe4e6"
              />
              <span className={c.label}>Rose track</span>
            </div>
          </div>
        </DemoWrapper>
      </Section>

      {/* ── Thickness ──────────────────────────────────────────────────── */}
      <Section
        title="Thickness"
        description="The thickness prop controls the stroke width of both the track and the spinner arc."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="flex items-center gap-8">
            <div className="flex flex-col items-center gap-2">
              <CircularLoader size={40} thickness={1} />
              <span className={c.label}>Thin (1)</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <CircularLoader size={40} thickness={2} />
              <span className={c.label}>Normal (2)</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <CircularLoader size={40} thickness={4} />
              <span className={c.label}>Thick (4)</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <CircularLoader size={40} thickness={6} />
              <span className={c.label}>Extra thick (6)</span>
            </div>
          </div>
        </DemoWrapper>
      </Section>

      {/* ── With Label ─────────────────────────────────────────────────── */}
      <Section
        title="With Label"
        description="Pair the loader with text for a common loading pattern."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <CircularLoader size={20} className="text-indigo-500" />
              <span
                className={`text-sm ${dark ? "text-gray-300" : "text-gray-600"}`}
              >
                Loading...
              </span>
            </div>
            <div className="flex items-center gap-3">
              <CircularLoader size={16} className="text-emerald-500" />
              <span
                className={`text-xs ${dark ? "text-gray-400" : "text-gray-500"}`}
              >
                Fetching results
              </span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <CircularLoader size={40} className="text-indigo-500" />
              <span
                className={`text-sm font-medium ${dark ? "text-gray-300" : "text-gray-600"}`}
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
        description="Real-world usage patterns showing the loader inside buttons and cards."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="flex flex-col gap-6">
            {/* Button with loader */}
            <div className="flex items-center gap-4">
              <button type="button" className={c.btnDisabled} disabled>
                <CircularLoader size={16} className="text-gray-400" />
                Saving...
              </button>
              <button type="button" className={c.btn}>
                <CircularLoader size={16} className="text-white" />
                Processing
              </button>
            </div>

            {/* Card skeleton */}
            <div
              className={`rounded-xl border p-8 flex flex-col items-center justify-center gap-3 ${dark ? "border-white/6 bg-white/2" : "border-gray-200 bg-gray-50"}`}
            >
              <CircularLoader
                size={36}
                thickness={3}
                className={dark ? "text-indigo-400" : "text-indigo-500"}
              />
              <p
                className={`text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
              >
                Loading content...
              </p>
            </div>

            {/* Inline with text */}
            <div
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${dark ? "bg-amber-900/20 border border-amber-800/40 text-amber-300" : "bg-amber-50 border border-amber-200 text-amber-700"}`}
            >
              <CircularLoader
                size={14}
                thickness={2}
                className="text-amber-500"
              />
              Syncing your data...
            </div>
          </div>
        </DemoWrapper>
      </Section>

      {/* ── Unstyled ───────────────────────────────────────────────────── */}
      <Section
        title="Unstyled"
        description="The component accepts className and style for full control. Since CircularLoader has minimal built-in styling, you can override everything with your own classes."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="flex items-center gap-8">
            <div className="flex flex-col items-center gap-2">
              <CircularLoader
                size={40}
                thickness={3}
                className=""
                style={{ color: "#f97316" }}
              />
              <span className={c.label}>Custom via style</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <CircularLoader
                size={40}
                thickness={1}
                trackColor="transparent"
              />
              <span className={c.label}>No track</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <CircularLoader
                size={40}
                thickness={5}
                trackColor={dark ? "#374151" : "#e5e7eb"}
                className={dark ? "text-cyan-400" : "text-cyan-600"}
              />
              <span className={c.label}>Full override</span>
            </div>
          </div>
        </DemoWrapper>
      </Section>

      {/* ── Props Reference ────────────────────────────────────────────── */}
      <Section title="Props Reference" isDarkMode={dark}>
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
              description="Color of the background track circle. Rendered at 20% opacity."
              isDarkMode={dark}
            />
            <PropRow
              name="color"
              type="string"
              description="Spinner color (available on the type, but implemented via currentColor / className)"
              isDarkMode={dark}
            />
            <PropRow
              name="className"
              type="string"
              defaultVal='""'
              description="Additional CSS class(es) merged onto the root div"
              isDarkMode={dark}
            />
            <PropRow
              name="style"
              type="CSSProperties"
              description="Inline styles merged onto the root div (CSS custom properties are also applied here)"
              isDarkMode={dark}
            />
            <PropRow
              name="ref"
              type="Ref<HTMLDivElement>"
              description="Forwarded ref to the root div element"
              isDarkMode={dark}
            />
            <PropRow
              name="...rest"
              type="HTMLAttributes<HTMLDivElement>"
              description="All standard HTML div attributes are forwarded"
              isDarkMode={dark}
            />
          </PropsTable>
        </div>
      </Section>

      {/* ── Accessibility ──────────────────────────────────────────────── */}
      <Section
        title="Accessibility"
        description="Built-in accessibility features."
        isDarkMode={dark}
      >
        <div className={c.card}>
          <div
            className={`space-y-2 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
          >
            {[
              'Renders role="status" on the root element so screen readers announce it as a live region',
              'Includes aria-label="Loading" by default for screen reader users',
              "Override aria-label via props when you need a more specific message (e.g. \"Loading search results\")",
              "Uses inline-flex display so it sits naturally alongside text or inside flex containers",
              "SVG is decorative and inherits accessible name from the parent div",
              "Supports ref forwarding for programmatic focus management if needed",
              "Respects currentColor so it inherits the surrounding text color automatically",
            ].map((text) => (
              <p key={text} className="flex items-start gap-2">
                <span
                  className={`mt-0.5 shrink-0 ${dark ? "text-emerald-400" : "text-emerald-600"}`}
                >
                  &#10003;
                </span>
                <span>{text}</span>
              </p>
            ))}
          </div>
        </div>
      </Section>

      <DocControlledPattern
        isDarkMode={dark}
        summary="Loaders are presentational. Control visibility with parent loading state; there is no internal async state."
      />
      <DocEdgeCases
        isDarkMode={dark}
        items={[
          "Long requests should pair with cancel/retry at the data layer.",
          "Multiple inline loaders need distinct accessible names if labeled.",
          "Reduced motion should shorten or disable endless spinners.",
        ]}
      />
      <DocDoDont
        isDarkMode={dark}
        dos={[
          "Mark decorative loaders with `aria-hidden` when adjacent text explains status.",
          "Provide loading text for page-level busy regions when appropriate.",
          "Keep contrast sufficient on all backgrounds.",
        ]}
        donts={[
          "Do not use infinite spinners without timeout or error handling.",
          "Do not rely on color-only loading indicators.",
          "Do not nest focusable controls inside purely decorative loaders.",
        ]}
      />
    </div>
  );
};

export default LoaderDemo;
