import { useState } from "react";
import { Button, ButtonGroup } from "../../components/Button";
import { useTheme } from "./ThemeContext";
import {
  Section,
  CodeBlock,
  DemoWrapper,
  PropsTable,
  PropRow,
} from "./components";

// ─── Icons ───────────────────────────────────────────────────────────────────

const SearchIcon = ({ className = "" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);
const ArrowRightIcon = ({ className = "" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);
const PlusIcon = ({ className = "" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
);
const DownloadIcon = ({ className = "" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" x2="12" y1="15" y2="3" />
  </svg>
);
const TrashIcon = ({ className = "" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  </svg>
);
const CheckIcon = ({ className = "" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const SpinnerIcon = ({ className = "" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={className}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);
const ExternalLinkIcon = ({ className = "" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" x2="21" y1="14" y2="3" />
  </svg>
);

// ─── Themed Classes ──────────────────────────────────────────────────────────

const base =
  "cursor-pointer text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none";

const getClasses = (dark: boolean) => ({
  primary: `${base} px-4 py-2.5 rounded-xl shadow-md ${
    dark
      ? "bg-indigo-500 text-white hover:bg-indigo-400 active:bg-indigo-600 shadow-indigo-500/20 hover:shadow-indigo-400/30 focus-visible:ring-indigo-400 focus-visible:ring-offset-gray-900"
      : "bg-indigo-600 text-white hover:bg-indigo-500 active:bg-indigo-700 shadow-indigo-600/25 hover:shadow-lg hover:shadow-indigo-500/30 focus-visible:ring-indigo-500"
  }`,
  secondary: `${base} px-4 py-2.5 rounded-xl ${
    dark
      ? "bg-white/8 text-gray-200 hover:bg-white/[0.14] active:bg-white/6 ring-1 ring-inset ring-white/[0.1] focus-visible:ring-gray-400 focus-visible:ring-offset-gray-900"
      : "bg-gray-50 text-gray-700 hover:bg-gray-100 active:bg-gray-150 ring-1 ring-inset ring-gray-200 shadow-sm shadow-gray-900/[0.04] hover:shadow focus-visible:ring-gray-400"
  }`,
  outline: `${base} px-4 py-2.5 rounded-xl ${
    dark
      ? "border border-white/15 text-gray-200 hover:bg-white/6 active:bg-white/4 focus-visible:ring-gray-400 focus-visible:ring-offset-gray-900"
      : "border border-gray-200 text-gray-700 hover:bg-gray-50 active:bg-gray-100 shadow-sm shadow-gray-900/[0.03] hover:border-gray-300 focus-visible:ring-gray-400"
  }`,
  ghost: `${base} px-4 py-2.5 rounded-xl ${
    dark
      ? "text-gray-300 hover:bg-white/8 active:bg-white/4 focus-visible:ring-gray-400 focus-visible:ring-offset-gray-900"
      : "text-gray-600 hover:bg-gray-100 active:bg-gray-50 focus-visible:ring-gray-400"
  }`,
  danger: `${base} px-4 py-2.5 rounded-xl shadow-md ${
    dark
      ? "bg-red-500 text-white hover:bg-red-400 active:bg-red-600 shadow-red-500/20 hover:shadow-red-400/30 focus-visible:ring-red-400 focus-visible:ring-offset-gray-900"
      : "bg-red-500 text-white hover:bg-red-400 active:bg-red-600 shadow-red-500/20 hover:shadow-lg hover:shadow-red-400/25 focus-visible:ring-red-400"
  }`,
  success: `${base} px-4 py-2.5 rounded-xl shadow-md ${
    dark
      ? "bg-emerald-500 text-white hover:bg-emerald-400 active:bg-emerald-600 shadow-emerald-500/20 hover:shadow-emerald-400/30 focus-visible:ring-emerald-400 focus-visible:ring-offset-gray-900"
      : "bg-emerald-500 text-white hover:bg-emerald-400 active:bg-emerald-600 shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-400/25 focus-visible:ring-emerald-400"
  }`,
  link: `cursor-pointer text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 underline-offset-4 ${
    dark
      ? "text-indigo-400 hover:text-indigo-300 hover:underline focus-visible:ring-indigo-400 focus-visible:ring-offset-gray-900"
      : "text-indigo-600 hover:text-indigo-500 hover:underline focus-visible:ring-indigo-500"
  }`,
  text: `cursor-pointer text-sm font-medium transition-colors ${dark ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-900"}`,
  iconOnly: `${base} p-2.5 rounded-xl ${
    dark
      ? "text-gray-400 hover:text-white hover:bg-white/8 active:bg-white/4 focus-visible:ring-gray-400 focus-visible:ring-offset-gray-900"
      : "text-gray-500 hover:text-gray-900 hover:bg-gray-100 active:bg-gray-50 shadow-sm shadow-gray-900/[0.03] ring-1 ring-inset ring-gray-200 hover:ring-gray-300 focus-visible:ring-gray-400"
  }`,
  card: `rounded-2xl border p-5 ${dark ? "border-white/[0.06] bg-linear-to-br from-white/[0.03] to-white/[0.01]" : "border-gray-200 bg-white shadow-sm shadow-gray-900/[0.04]"}`,
  kbd: `px-2 py-1 rounded-md text-[11px] font-mono min-w-[2.5rem] text-center font-medium ${dark ? "bg-gray-900 border border-white/10 text-gray-300 shadow-sm" : "bg-white border border-gray-200 text-gray-600 shadow-sm"}`,
  label: `text-xs font-medium ${dark ? "text-gray-500" : "text-gray-400"}`,
  note: `mt-3 p-3 rounded-lg text-xs ${dark ? "bg-blue-900/20 border border-blue-800/50 text-blue-300" : "bg-blue-50 border border-blue-200 text-blue-700"}`,
});

// ─── Demo ────────────────────────────────────────────────────────────────────

const ButtonDemo = () => {
  const { isDarkMode: dark } = useTheme();
  const c = getClasses(dark);
  const [loading, setLoading] = useState(false);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  const simulateLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="space-y-10">
      {/* ─── Header ─────────────────────────────────────────────────────── */}
      <header className="relative overflow-hidden rounded-2xl p-6 sm:p-8">
        <div
          className={`absolute inset-0 ${dark ? "bg-linear-to-br from-indigo-950/80 via-gray-900/60 to-blue-950/50" : "bg-linear-to-br from-indigo-50 via-white to-blue-50/80"}`}
        />
        <div
          className={`absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl ${dark ? "bg-indigo-500/10" : "bg-indigo-200/40"}`}
        />
        <div
          className={`absolute -bottom-20 -left-20 w-56 h-56 rounded-full blur-3xl ${dark ? "bg-blue-500/8" : "bg-blue-200/30"}`}
        />
        <div className="relative">
          <h1
            className={`text-3xl font-bold mb-3 ${dark ? "text-white" : "text-gray-900"}`}
          >
            Button
          </h1>
          <p
            className={`text-sm leading-relaxed max-w-2xl ${dark ? "text-gray-400" : "text-gray-600"}`}
          >
            A flexible, accessible button component supporting icons, loading
            states, animations, tooltips, polymorphic rendering (button, link,
            span), and extensive customization via the classes system.
          </p>
          <div className="mt-5">
            <CodeBlock
              isDarkMode={dark}
              code={`import { Button, ButtonGroup } from "@kern-ui/button";`}
            />
          </div>
        </div>
      </header>

      {/* ─── Basic Variants ─────────────────────────────────────────────── */}
      <Section
        title="Basic Variants"
        description="Different button styles for various use cases."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <Button className={c.primary}>Primary</Button>
          <Button className={c.secondary}>Secondary</Button>
          <Button className={c.outline}>Outline</Button>
          <Button className={c.ghost}>Ghost</Button>
          <Button className={c.danger}>Danger</Button>
          <Button className={c.success}>Success</Button>
        </DemoWrapper>
      </Section>

      {/* ─── With Icons ─────────────────────────────────────────────────── */}
      <Section
        title="With Icons"
        description="Add leading and trailing icons using startIcon and endIcon props."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <Button className={c.primary} startIcon={<PlusIcon />}>
            Add Item
          </Button>
          <Button className={c.secondary} endIcon={<ArrowRightIcon />}>
            Continue
          </Button>
          <Button
            className={c.outline}
            startIcon={<SearchIcon />}
            endIcon={<ArrowRightIcon />}
          >
            Search
          </Button>
          <Button className={c.success} startIcon={<DownloadIcon />}>
            Download
          </Button>
          <Button className={c.danger} startIcon={<TrashIcon />}>
            Delete
          </Button>
        </DemoWrapper>
      </Section>

      {/* ─── Icon Only ──────────────────────────────────────────────────── */}
      <Section
        title="Icon Only Buttons"
        description="Always provide aria-label for accessibility."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <Button
            className={c.iconOnly}
            startIcon={<SearchIcon />}
            aria-label="Search"
          />
          <Button
            className={c.iconOnly}
            startIcon={<PlusIcon />}
            aria-label="Add"
          />
          <Button
            className={c.iconOnly}
            startIcon={<DownloadIcon />}
            aria-label="Download"
          />
          <Button
            className={c.iconOnly}
            startIcon={<TrashIcon />}
            aria-label="Delete"
          />
          <Button
            className={`${c.iconOnly} ${dark ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-600 hover:bg-blue-700"} text-white`}
            startIcon={<CheckIcon />}
            aria-label="Confirm"
          />
        </DemoWrapper>
      </Section>

      {/* ─── Polymorphic Rendering ──────────────────────────────────────── */}
      <Section
        title="Polymorphic Rendering (as prop)"
        description="Render as button (default), anchor link, or span."
        isDarkMode={dark}
      >
        <div className="space-y-4">
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>
              as=&quot;button&quot; (default)
            </p>
            <DemoWrapper isDarkMode={dark}>
              <Button
                className={c.primary}
                onClick={() => alert("Button clicked!")}
              >
                Button Element
              </Button>
            </DemoWrapper>
          </div>
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>
              as=&quot;a&quot; (anchor link)
            </p>
            <DemoWrapper isDarkMode={dark}>
              <Button
                as="a"
                href="https://example.com"
                target="_blank"
                rel="noreferrer"
                className={c.link}
              >
                Simple Link
              </Button>
              <Button
                as="a"
                href="https://example.com"
                target="_blank"
                rel="noreferrer"
                className={c.link}
                endIcon={<ExternalLinkIcon />}
                iconAnimation="slideRight"
              >
                External Link
              </Button>
              <Button
                as="a"
                href="https://example.com"
                target="_blank"
                rel="noreferrer"
                className={c.primary}
              >
                Styled Link
              </Button>
            </DemoWrapper>
          </div>
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>
              as=&quot;span&quot; (keyboard accessible)
            </p>
            <DemoWrapper isDarkMode={dark}>
              <Button as="span" className={c.text}>
                Text Button
              </Button>
              <Button
                as="span"
                className={c.text}
                endIcon={<ArrowRightIcon />}
                iconAnimation="slideRight"
              >
                Learn More
              </Button>
            </DemoWrapper>
          </div>
        </div>
      </Section>

      {/* ─── Icon Animations (Hover) ────────────────────────────────────── */}
      <Section
        title="Icon Animations (On Hover)"
        description="Animate icons on hover using iconAnimation prop."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <Button
            className={c.primary}
            endIcon={<ArrowRightIcon />}
            iconAnimation="slideRight"
          >
            Slide Right
          </Button>
          <Button
            className={c.secondary}
            startIcon={<ArrowRightIcon />}
            iconAnimation="slideLeft"
            animateIcon="leading"
          >
            Slide Left
          </Button>
          <Button
            className={c.outline}
            endIcon={<ArrowRightIcon />}
            iconAnimation="slideUp"
          >
            Slide Up
          </Button>
          <Button
            className={c.ghost}
            endIcon={<ArrowRightIcon />}
            iconAnimation="slideDown"
          >
            Slide Down
          </Button>
        </DemoWrapper>
      </Section>

      {/* ─── More Animations ────────────────────────────────────────────── */}
      <Section
        title="More Animation Effects"
        description="Bounce, pulse, and spin effects."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <Button
            className={c.primary}
            endIcon={<ArrowRightIcon />}
            iconAnimation="bounce"
          >
            Bounce
          </Button>
          <Button
            className={c.secondary}
            startIcon={<SearchIcon />}
            iconAnimation="pulse"
            animateIcon="leading"
          >
            Pulse
          </Button>
          <Button
            className={c.outline}
            startIcon={<SpinnerIcon />}
            iconAnimation="spin"
            animateIcon="leading"
          >
            Spin
          </Button>
        </DemoWrapper>
      </Section>

      {/* ─── Animate Both ───────────────────────────────────────────────── */}
      <Section
        title="Animate Both Icons"
        description='Use animateIcon="both" to animate leading and trailing icons together.'
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <Button
            className={c.primary}
            startIcon={<ArrowRightIcon />}
            endIcon={<ArrowRightIcon />}
            iconAnimation="slideRight"
            animateIcon="both"
          >
            Both Slide
          </Button>
          <Button
            className={c.secondary}
            startIcon={<PlusIcon />}
            endIcon={<PlusIcon />}
            iconAnimation="pulse"
            animateIcon="both"
          >
            Both Pulse
          </Button>
        </DemoWrapper>
      </Section>

      {/* ─── Continuous Animation ───────────────────────────────────────── */}
      <Section
        title="Continuous Animation"
        description="Set animateOnHover={false} for always-running animations."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <Button
            className={c.primary}
            endIcon={<ArrowRightIcon />}
            iconAnimation="slideRight"
            animateOnHover={false}
          >
            Always Sliding
          </Button>
          <Button
            className={c.secondary}
            startIcon={<SpinnerIcon />}
            iconAnimation="spin"
            animateIcon="leading"
            animateOnHover={false}
          >
            Always Spinning
          </Button>
          <Button
            className={c.outline}
            startIcon={<SearchIcon />}
            iconAnimation="pulse"
            animateIcon="leading"
            animateOnHover={false}
          >
            Always Pulsing
          </Button>
        </DemoWrapper>
      </Section>

      {/* ─── Reduce Motion ──────────────────────────────────────────────── */}
      <Section
        title="Reduce Motion"
        description='Set reduceMotion={true} to disable all icon animations. "auto" respects prefers-reduced-motion.'
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="text-center">
            <Button
              className={c.primary}
              endIcon={<ArrowRightIcon />}
              iconAnimation="slideRight"
            >
              Default (auto)
            </Button>
            <p className={`text-xs mt-2 ${c.label}`}>respects OS setting</p>
          </div>
          <div className="text-center">
            <Button
              className={c.primary}
              endIcon={<ArrowRightIcon />}
              iconAnimation="slideRight"
              reduceMotion={true}
            >
              No Animation
            </Button>
            <p className={`text-xs mt-2 ${c.label}`}>reduceMotion=true</p>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Loading States ─────────────────────────────────────────────── */}
      <Section
        title="Loading States"
        description="Use loading to show a spinner. Customize with loadingText, loaderPosition, and loaderSize."
        isDarkMode={dark}
      >
        <div className="space-y-4">
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>
              Default (loader on right)
            </p>
            <DemoWrapper isDarkMode={dark}>
              <Button className={c.primary} loading>
                Loading
              </Button>
              <Button className={c.secondary} loading>
                Saving
              </Button>
            </DemoWrapper>
          </div>
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>
              loaderPosition=&quot;left&quot;
            </p>
            <DemoWrapper isDarkMode={dark}>
              <Button className={c.primary} loading loaderPosition="left">
                Processing
              </Button>
            </DemoWrapper>
          </div>
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>
              With loadingText
            </p>
            <DemoWrapper isDarkMode={dark}>
              <Button className={c.outline} loading loadingText="Submitting...">
                Submit
              </Button>
            </DemoWrapper>
          </div>
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>
              Loading with icon (icon remains visible)
            </p>
            <DemoWrapper isDarkMode={dark}>
              <Button
                className={c.success}
                loading
                startIcon={<DownloadIcon />}
              >
                Downloading
              </Button>
            </DemoWrapper>
          </div>
        </div>
      </Section>

      {/* ─── Custom Loader ──────────────────────────────────────────────── */}
      <Section
        title="Custom Loader"
        description="Provide a custom loader via the loader prop. Control size with loaderSize."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <Button className={c.primary} loading loaderSize={12}>
            Small Loader
          </Button>
          <Button className={c.primary} loading loaderSize={20}>
            Large Loader
          </Button>
          <Button
            className={c.secondary}
            loading
            loader={
              <span
                className={`text-xs animate-pulse ${dark ? "text-blue-400" : "text-blue-600"}`}
              >
                ...
              </span>
            }
          >
            Custom Dots
          </Button>
          <Button
            className={c.outline}
            loading
            loader={
              <div className="flex gap-0.5">
                <span
                  className="w-1.5 h-1.5 bg-current rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <span
                  className="w-1.5 h-1.5 bg-current rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <span
                  className="w-1.5 h-1.5 bg-current rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            }
          >
            Bouncing Dots
          </Button>
        </DemoWrapper>
      </Section>

      {/* ─── Interactive Loading ─────────────────────────────────────────── */}
      <Section
        title="Interactive Loading"
        description="Click to trigger a loading state."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <Button
            className={c.primary}
            loading={loading}
            loadingText="Processing..."
            onClick={simulateLoading}
          >
            Click to Load
          </Button>
          <p className={`text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>
            {loading ? "Loading for 2 seconds..." : "Click the button"}
          </p>
        </DemoWrapper>
      </Section>

      {/* ─── Disabled ───────────────────────────────────────────────────── */}
      <Section
        title="Disabled State"
        description="Use disabled to disable the button."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <Button className={c.primary} disabled>
            Disabled Primary
          </Button>
          <Button className={c.secondary} disabled>
            Disabled Secondary
          </Button>
          <Button className={c.outline} disabled>
            Disabled Outline
          </Button>
          <Button className={c.ghost} disabled startIcon={<PlusIcon />}>
            Disabled with Icon
          </Button>
        </DemoWrapper>
      </Section>

      {/* ─── Full Width ─────────────────────────────────────────────────── */}
      <Section
        title="Full Width"
        description="Use fullWidth to span the full container."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <div className="w-full space-y-3">
            <Button className={c.primary} fullWidth>
              Full Width Primary
            </Button>
            <Button
              className={c.outline}
              fullWidth
              startIcon={<DownloadIcon />}
            >
              Full Width with Icon
            </Button>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Classes System ─────────────────────────────────────────────── */}
      <Section
        title="Classes System"
        description="Use the classes prop to override internal element styling. Slots: root, content, startIcon, endIcon, loader."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <Button
            className={c.primary}
            classes={{
              content: "inline-flex items-center justify-center gap-4",
            }}
            startIcon={<SearchIcon />}
          >
            Wider Gap
          </Button>
          <Button
            className={c.secondary}
            classes={{
              content: "inline-flex items-center justify-center gap-1",
            }}
            endIcon={<ArrowRightIcon />}
          >
            Tight Gap
          </Button>
          <Button
            className={c.outline}
            classes={{
              content:
                "flex flex-row-reverse items-center justify-center gap-2",
            }}
            startIcon={<CheckIcon />}
          >
            Reversed
          </Button>
        </DemoWrapper>
      </Section>

      {/* ─── Unstyled ───────────────────────────────────────────────────── */}
      <Section
        title="Unstyled Mode"
        description="Set unstyled=true to strip all default classes. Build from scratch."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <Button
            unstyled
            className={`px-4 py-2 rounded-full font-bold ${dark ? "bg-linear-to-r from-purple-500 to-pink-500 text-white" : "bg-linear-to-r from-purple-500 to-pink-500 text-white"}`}
          >
            Gradient Button
          </Button>
        </DemoWrapper>
      </Section>

      {/* ─── asChild ────────────────────────────────────────────────────── */}
      <Section
        title="asChild"
        description="Merge button props onto a child element for maximum flexibility."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <Button className={c.primary} asChild>
            <a href="https://example.com" target="_blank" rel="noreferrer">
              Link as Button
            </a>
          </Button>
          <Button className={c.primary} asChild disabled>
            <a href="https://example.com" target="_blank" rel="noreferrer">
              Disabled asChild
            </a>
          </Button>
        </DemoWrapper>
        <div className={c.note}>
          When asChild is combined with disabled or loading, the child&apos;s
          onClick is automatically suppressed.
        </div>
      </Section>

      {/* ─── Tooltip ────────────────────────────────────────────────────── */}
      <Section
        title="Tooltip"
        description="Add tooltips using the tooltip prop. Customize with tooltipProps."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <Button className={c.primary} tooltip="Save your changes">
            Save
          </Button>
          <Button
            className={c.danger}
            tooltip="Cannot be undone"
            tooltipProps={{ side: "bottom" }}
          >
            Delete
          </Button>
          <Button
            className={c.outline}
            tooltip="Copy to clipboard"
            tooltipProps={{ side: "right", delayDuration: 100 }}
          >
            Copy
          </Button>
          <Button
            className={c.iconOnly}
            startIcon={<SearchIcon />}
            aria-label="Search"
            tooltip="Search items"
            tooltipProps={{ side: "bottom", showArrow: false }}
          />
        </DemoWrapper>
      </Section>

      {/* ─── Tooltip Positions ──────────────────────────────────────────── */}
      <Section
        title="Tooltip Positions"
        description="Control tooltip side, offset, and arrow."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          {(["top", "right", "bottom", "left"] as const).map((side) => (
            <Button
              key={side}
              className={c.secondary}
              tooltip={`${side} tooltip`}
              tooltipProps={{ side }}
            >
              {side}
            </Button>
          ))}
          <Button
            className={c.primary}
            tooltip="Large offset"
            tooltipProps={{ side: "top", sideOffset: 16 }}
          >
            Offset
          </Button>
          <Button
            className={c.secondary}
            tooltip="No arrow"
            tooltipProps={{ showArrow: false }}
          >
            No Arrow
          </Button>
        </DemoWrapper>
      </Section>

      {/* ─── Button Group ───────────────────────────────────────────────── */}
      <Section
        title="Button Group"
        description="Group related buttons using ButtonGroup with role=group semantics."
        isDarkMode={dark}
      >
        <div className="space-y-4">
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>
              Segmented control
            </p>
            <DemoWrapper isDarkMode={dark} layout="block">
              <ButtonGroup className="inline-flex gap-0">
                {["Left", "Middle", "Right"].map((label, i) => (
                  <Button
                    key={label}
                    className={`${c.outline} ${i === 0 ? "rounded-r-none border-r-0" : i === 2 ? "rounded-l-none" : "rounded-none border-r-0"} ${activeGroup === label.toLowerCase() ? (dark ? "bg-gray-600" : "bg-blue-100") : ""}`}
                    onClick={() => {
                      setActiveGroup(label.toLowerCase());
                      setTimeout(() => setActiveGroup(null), 500);
                    }}
                  >
                    {label}
                  </Button>
                ))}
              </ButtonGroup>
            </DemoWrapper>
          </div>
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>
              Action buttons with gap
            </p>
            <DemoWrapper isDarkMode={dark} layout="block">
              <ButtonGroup className="inline-flex gap-2">
                <Button className={c.primary}>Save</Button>
                <Button className={c.secondary}>Cancel</Button>
              </ButtonGroup>
            </DemoWrapper>
          </div>
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>
              Vertical group
            </p>
            <DemoWrapper isDarkMode={dark} layout="block">
              <ButtonGroup
                className="inline-flex flex-col gap-2"
                orientation="vertical"
              >
                <Button className={c.primary} fullWidth>
                  First
                </Button>
                <Button className={c.secondary} fullWidth>
                  Second
                </Button>
                <Button className={c.outline} fullWidth>
                  Third
                </Button>
              </ButtonGroup>
            </DemoWrapper>
          </div>
        </div>
      </Section>

      {/* ─── Form Integration ───────────────────────────────────────────── */}
      <Section
        title="Form Integration"
        description='Use type="submit" for form buttons. Default is type="button" to prevent accidental submission.'
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Form submitted!");
            }}
            className="flex items-center gap-3"
          >
            <Button className={c.primary} type="submit">
              Submit (type=submit)
            </Button>
            <Button className={c.secondary} type="reset">
              Reset (type=reset)
            </Button>
            <Button className={c.ghost}>Button (default type=button)</Button>
          </form>
        </DemoWrapper>
      </Section>

      {/* ─── Props Tables ───────────────────────────────────────────────── */}
      <Section title="Button Props" isDarkMode={dark}>
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow
              name="children"
              type="ReactNode"
              description="Button content"
              isDarkMode={dark}
            />
            <PropRow
              name="as"
              type='"button"|"a"|"span"'
              defaultVal='"button"'
              description="Rendered HTML element"
              isDarkMode={dark}
            />
            <PropRow
              name="asChild"
              type="boolean"
              defaultVal="false"
              description="Merge props onto child element"
              isDarkMode={dark}
            />
            <PropRow
              name="disabled"
              type="boolean"
              defaultVal="false"
              description="Disable the button"
              isDarkMode={dark}
            />
            <PropRow
              name="loading"
              type="boolean"
              defaultVal="false"
              description="Show loading state"
              isDarkMode={dark}
            />
            <PropRow
              name="loadingText"
              type="ReactNode"
              description="Replace children during loading"
              isDarkMode={dark}
            />
            <PropRow
              name="loaderPosition"
              type='"left"|"right"'
              defaultVal='"right"'
              description="Loader placement"
              isDarkMode={dark}
            />
            <PropRow
              name="loaderSize"
              type="number"
              defaultVal="16"
              description="Default loader size in px"
              isDarkMode={dark}
            />
            <PropRow
              name="loader"
              type="ReactNode"
              description="Custom loader element"
              isDarkMode={dark}
            />
            <PropRow
              name="startIcon"
              type="ReactNode"
              description="Leading icon"
              isDarkMode={dark}
            />
            <PropRow
              name="endIcon"
              type="ReactNode"
              description="Trailing icon"
              isDarkMode={dark}
            />
            <PropRow
              name="iconAnimation"
              type="IconAnimation"
              defaultVal='"none"'
              description="Icon animation effect"
              isDarkMode={dark}
            />
            <PropRow
              name="animateOnHover"
              type="boolean"
              defaultVal="true"
              description="Animate only on hover (false = continuous)"
              isDarkMode={dark}
            />
            <PropRow
              name="animateIcon"
              type='"leading"|"trailing"|"both"'
              defaultVal='"trailing"'
              description="Which icon(s) to animate"
              isDarkMode={dark}
            />
            <PropRow
              name="reduceMotion"
              type='boolean|"auto"'
              defaultVal='"auto"'
              description="Disable animations (auto respects OS)"
              isDarkMode={dark}
            />
            <PropRow
              name="fullWidth"
              type="boolean"
              defaultVal="false"
              description="Span full container width"
              isDarkMode={dark}
            />
            <PropRow
              name="classes"
              type="ButtonClasses"
              description="Slot class overrides: root, content, startIcon, endIcon, loader"
              isDarkMode={dark}
            />
            <PropRow
              name="unstyled"
              type="boolean"
              defaultVal="false"
              description="Strip all default classes"
              isDarkMode={dark}
            />
            <PropRow
              name="tooltip"
              type="ReactNode"
              description="Tooltip content"
              isDarkMode={dark}
            />
            <PropRow
              name="tooltipProps"
              type="ButtonTooltipProps"
              description="Tooltip configuration"
              isDarkMode={dark}
            />
            <PropRow
              name="href"
              type="string"
              description='Link URL (when as="a")'
              isDarkMode={dark}
            />
            <PropRow
              name="target"
              type="string"
              description='Link target (when as="a")'
              isDarkMode={dark}
            />
            <PropRow
              name="rel"
              type="string"
              description='Link rel (when as="a")'
              isDarkMode={dark}
            />
            <PropRow
              name="type"
              type='"button"|"submit"|"reset"'
              defaultVal='"button"'
              description="Button type attribute"
              isDarkMode={dark}
            />
          </PropsTable>
        </div>
      </Section>

      <Section title="ButtonGroup Props" isDarkMode={dark}>
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow
              name="children"
              type="ReactNode"
              defaultVal="required"
              description="Button components to render"
              isDarkMode={dark}
            />
            <PropRow
              name="className"
              type="string"
              description="CSS class for the group container"
              isDarkMode={dark}
            />
            <PropRow
              name="orientation"
              type='"horizontal"|"vertical"'
              defaultVal='"horizontal"'
              description="Group orientation for aria-orientation"
              isDarkMode={dark}
            />
          </PropsTable>
        </div>
      </Section>

      <Section title="ButtonClasses" isDarkMode={dark}>
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow
              name="root"
              type="string"
              description="Root button/anchor/span element"
              isDarkMode={dark}
            />
            <PropRow
              name="content"
              type="string"
              description="Inner content wrapper span"
              isDarkMode={dark}
            />
            <PropRow
              name="startIcon"
              type="string"
              description="Leading icon wrapper"
              isDarkMode={dark}
            />
            <PropRow
              name="endIcon"
              type="string"
              description="Trailing icon wrapper"
              isDarkMode={dark}
            />
            <PropRow
              name="loader"
              type="string"
              description="Loader wrapper"
              isDarkMode={dark}
            />
          </PropsTable>
        </div>
      </Section>

      {/* ─── Data Attributes ──────────────────────────────────────────── */}
      <Section
        title="Data Attributes"
        description="Use these for CSS-based state styling."
        isDarkMode={dark}
      >
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow
              name="data-loading"
              type="button element"
              description="Present when loading=true"
              isDarkMode={dark}
            />
            <PropRow
              name="data-disabled"
              type="button element"
              description="Present when disabled or loading"
              isDarkMode={dark}
            />
            <PropRow
              name="data-full-width"
              type="button element"
              description="Present when fullWidth=true"
              isDarkMode={dark}
            />
            <PropRow
              name="aria-busy"
              type="button element"
              description="Set when loading"
              isDarkMode={dark}
            />
            <PropRow
              name="aria-disabled"
              type="button element"
              description="Set when disabled or loading"
              isDarkMode={dark}
            />
          </PropsTable>
        </div>
      </Section>

      {/* ─── Accessibility ────────────────────────────────────────────── */}
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
              'Default type="button" prevents accidental form submission',
              "aria-busy set when loading",
              "aria-disabled set when disabled or loading",
              'Span buttons (as="span") include role="button" and Enter/Space keyboard support',
              "Focus-visible ring for keyboard navigation",
              'Loader has aria-hidden="true" (decorative)',
              'ButtonGroup uses role="group" with aria-orientation',
              "Dev warning fires when icon-only button lacks aria-label",
              "prefers-reduced-motion respected via reduceMotion prop",
              "Disabled anchor links remove href and set tabIndex=-1",
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
        <div className={`${c.card} mt-3`}>
          <p
            className={`text-xs font-semibold mb-3 ${dark ? "text-gray-300" : "text-gray-700"}`}
          >
            Keyboard Reference
          </p>
          <div
            className={`space-y-2 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
          >
            {[
              ["Tab", "Move focus to/from button"],
              [
                "Enter / Space",
                "Activate button (also works for span buttons)",
              ],
            ].map(([key, desc]) => (
              <div key={key} className="flex items-center gap-3">
                <kbd className={c.kbd}>{key}</kbd>
                <span>{desc}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
};

export default ButtonDemo;
