import {
  useState } from "react";
import { Button,
  ButtonGroup } from "../../components/Button/index.js";
import { useTheme } from "./ThemeContext.js";
import {
  DocsHero,
  Section,
  DemoWrapper,
  DocControlledPattern,
  DocEdgeCases,
  DocDoDont,
  ComponentDocs,
  CopyPasteBlock,
  SetupNote,
} from "./components/index.js";

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
// Non-directional on purpose: `animateIcon="both"` applies one slide direction
// to the leading and trailing icon alike, so a directional glyph would animate
// against itself on one side.
const SparkleIcon = ({ className = "" }: { className?: string }) => (
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
    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
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

// No `text-sm` and no padding: those are `size`'s to set, and a className
// carrying them wins — correctly, and invisibly. With `text-sm` in here the
// Sizes section rendered three different paddings at one type size.
const base =
  "cursor-pointer font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none";

const getClasses = (_dark: boolean) => ({
  primary: `${base} rounded-cl-lg shadow-md bg-cl-accent text-cl-on-accent hover:bg-cl-accent/90 active:bg-cl-accent/80 shadow-accent/25 hover:shadow-lg hover:shadow-accent/30 focus-visible:ring-cl-accent dark:shadow-accent/20 focus-visible:ring-offset-cl-bg`,
  secondary: `${base} rounded-cl-lg bg-cl-bg-hover text-cl-text hover:bg-cl-bg-hover active:bg-cl-bg-hover ring-1 ring-inset ring-border-soft shadow-sm shadow-black/[0.04] hover:shadow focus-visible:ring-border-active dark:bg-cl-text/8 dark:hover:bg-cl-text/[0.14] dark:active:bg-cl-text/6 dark:ring-1 dark:ring-inset dark:ring-cl-text/[0.1] focus-visible:ring-offset-cl-bg`,
  outline: `${base} rounded-cl-lg border border-cl-border text-cl-text hover:bg-cl-bg-hover active:bg-cl-text/4 shadow-sm shadow-black/[0.03] hover:border-cl-border-input focus-visible:ring-border-active dark:border dark:border-cl-text/15 dark:hover:bg-cl-text/6 focus-visible:ring-offset-cl-bg`,
  ghost: `${base} px-4 py-2.5 rounded-cl-lg text-cl-text-secondary hover:bg-cl-bg-hover active:bg-cl-text/4 focus-visible:ring-border-active dark:hover:bg-cl-text/8 focus-visible:ring-offset-cl-bg`,
  danger: `${base} px-4 py-2.5 rounded-cl-lg shadow-md bg-cl-error text-cl-bg hover:bg-cl-error/30 active:bg-cl-error shadow-danger/20 hover:shadow-lg hover:shadow-danger/25 focus-visible:ring-cl-error dark:hover:shadow-danger/30 focus-visible:ring-offset-cl-bg`,
  success: `${base} px-4 py-2.5 rounded-cl-lg shadow-md bg-cl-success text-cl-bg hover:bg-cl-success/30 active:bg-cl-success shadow-success/20 hover:shadow-lg hover:shadow-success/25 focus-visible:ring-cl-success dark:hover:shadow-success/30 focus-visible:ring-offset-cl-bg`,
  link: `cursor-pointer text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 underline-offset-4 text-cl-accent hover:text-cl-accent hover:underline focus-visible:ring-cl-accent dark:hover:underline focus-visible:ring-offset-cl-bg`,
  text: `cursor-pointer text-sm font-medium transition-colors text-cl-text-tertiary hover:text-cl-text`,
  iconOnly: `${base} p-2.5 rounded-cl-lg text-cl-text-tertiary hover:text-cl-text hover:bg-cl-bg-hover active:bg-cl-text/4 shadow-sm shadow-black/[0.03] ring-1 ring-inset ring-border-soft hover:ring-border-soft focus-visible:ring-border-active dark:hover:bg-cl-text/8 focus-visible:ring-offset-cl-bg`,
 card: `rounded-cl-lg p-5 bg-cl-bg-elevated`,
 kbd: `px-2 py-1 rounded-cl-md text-[11px] font-mono min-w-[2.5rem] text-center font-medium bg-cl-bg-elevated border border-cl-border text-cl-text-secondary`,
  label: `text-xs font-medium text-cl-text-tertiary`,
 note: `mt-3 p-3 rounded-cl-md text-xs bg-cl-bg-elevated border border-cl-border text-cl-accent`,
});

const ButtonDemo = () => {
  const { isDarkMode: dark } = useTheme();
  const c = getClasses(dark);
  const [loading, setLoading] = useState(false);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  // The caption below claims span buttons support Enter/Space. Without an
  // onClick there was nothing to observe, so the claim went unverified.
  const [spanActivations, setSpanActivations] = useState(0);
  const [polymorphicClick, setPolymorphicClick] = useState("not fired yet");
  const [formSubmit, setFormSubmit] = useState("not fired yet");

  const simulateLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="space-y-10">
      <DocsHero
        title="Button"
        description="A flexible, accessible button component supporting icons, loading states, animations, tooltips, polymorphic rendering (button, link, span), and extensive customization via the classes system."
        code={`import { Button, ButtonGroup } from "@chumlab/ui/button";`}
      />

      <SetupNote />

      <CopyPasteBlock name="Button" />

      {/* ─── Basic Usage ─────────────────────────────────────────────────── */}
      <Section
        title="Basic Usage"
        description="The component provides structure (padding, focus ring, disabled state). Pass a className for visual styling."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          {/* Basic usage — className provides the visual theme */}
          <Button className={c.primary}>Primary</Button>
          <Button className={c.secondary}>Secondary</Button>
          <Button className={c.outline}>Outline</Button>
          <Button className={c.ghost}>Ghost</Button>
        </DemoWrapper>
      </Section>

      {/* ─── Basic Variants ─────────────────────────────────────────────── */}
      <Section
        title="Basic Variants"
        description="Different button styles for various use cases."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
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
        <DemoWrapper isDarkMode={dark} layout="inline">
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
        <DemoWrapper isDarkMode={dark} layout="inline">
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
            className={`${c.iconOnly} bg-cl-accent hover:bg-cl-accent/90 text-cl-on-accent`}
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
            <DemoWrapper isDarkMode={dark} layout="inline">
              <Button
                className={c.primary}
                onClick={(e) => setPolymorphicClick(JSON.stringify(e.currentTarget.tagName))}
              >
                Button Element
              </Button>
            </DemoWrapper>
            <div className="mt-2 rounded-cl-md px-3 py-2 text-xs font-mono bg-cl-bg-elevated text-cl-text-tertiary" data-demo-action>
              onClick: {polymorphicClick}
            </div>
          </div>
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>
              as=&quot;a&quot; (anchor link)
            </p>
            <DemoWrapper isDarkMode={dark} layout="inline">
              <Button
                as="a"
                href="https://chumlab.com"
                target="_blank"
                rel="noreferrer"
                className={c.link}
              >
                Simple Link
              </Button>
              <Button
                as="a"
                href="https://chumlab.com"
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
                href="https://chumlab.com"
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
            <DemoWrapper isDarkMode={dark} layout="inline">
              <Button
                as="span"
                className={c.text}
                onClick={() => setSpanActivations((n) => n + 1)}
              >
                Text Button
              </Button>
              <Button
                as="span"
                className={c.text}
                endIcon={<ArrowRightIcon />}
                iconAnimation="slideRight"
                onClick={() => setSpanActivations((n) => n + 1)}
              >
                Learn More
              </Button>
              <span className={c.label} data-span-activations={spanActivations}>
                Activated {spanActivations}x
              </span>
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
        <DemoWrapper isDarkMode={dark} layout="inline">
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
        <DemoWrapper isDarkMode={dark} layout="inline">
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
        <DemoWrapper isDarkMode={dark} layout="inline">
          <Button
            className={c.primary}
            startIcon={<SparkleIcon />}
            endIcon={<SparkleIcon />}
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
        <DemoWrapper isDarkMode={dark} layout="inline">
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
        <DemoWrapper isDarkMode={dark} layout="inline">
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
            <DemoWrapper isDarkMode={dark} layout="inline">
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
            <DemoWrapper isDarkMode={dark} layout="inline">
              <Button className={c.primary} loading loaderPosition="left">
                Processing
              </Button>
            </DemoWrapper>
          </div>
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>
              With loadingText
            </p>
            <DemoWrapper isDarkMode={dark} layout="inline">
              <Button className={c.outline} loading loadingText="Submitting...">
                Submit
              </Button>
            </DemoWrapper>
          </div>
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>
              Loading with icon (icon remains visible)
            </p>
            <DemoWrapper isDarkMode={dark} layout="inline">
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
        <DemoWrapper isDarkMode={dark} layout="inline">
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
                className={`text-xs animate-pulse text-cl-accent`}
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
        <DemoWrapper isDarkMode={dark} layout="inline">
          <Button
            className={c.primary}
            loading={loading}
            loadingText="Processing..."
            onClick={simulateLoading}
          >
            Click to Load
          </Button>
          <p className={`text-sm text-cl-text-secondary`}>
            {loading ? "Loading for 2 seconds..." : "Click the button"}
          </p>
        </DemoWrapper>
      </Section>

      {/* ─── Sizes ─────────────────────────────────────────────────────── */}
      <Section
        title="Sizes"
        description='size="sm" | "md" | "lg" sets padding, type, gap, icon box and loader together — 28, 40 and 52px tall. It also emits data-size, so CSS can hang off it.'
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <Button className={c.primary} size="sm">
            Small
          </Button>
          <Button className={c.primary} size="md">
            Medium
          </Button>
          <Button className={c.primary} size="lg">
            Large
          </Button>
        </DemoWrapper>
        <DemoWrapper isDarkMode={dark} layout="inline">
          <Button
            className={c.outline}
            size="sm"
            startIcon={<PlusIcon />}
          >
            Small
          </Button>
          <Button
            className={c.outline}
            size="md"
            startIcon={<PlusIcon />}
          >
            Medium
          </Button>
          <Button
            className={c.outline}
            size="lg"
            startIcon={<PlusIcon />}
          >
            Large
          </Button>
        </DemoWrapper>
      </Section>

      {/* ─── Disabled ───────────────────────────────────────────────────── */}
      <Section
        title="Disabled State"
        description="Use disabled to disable the button."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
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

      <Section
        title="Classes System"
        description="Use the classes prop to override internal element styling. Slots: root, content, startIcon, endIcon, loader."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <Button
            className={c.primary}
            classes={{
              itemText: "inline-flex items-center justify-center gap-4",
            }}
            startIcon={<SearchIcon />}
          >
            Wider Gap
          </Button>
          <Button
            className={c.secondary}
            classes={{
              itemText: "inline-flex items-center justify-center gap-1",
            }}
            endIcon={<ArrowRightIcon />}
          >
            Tight Gap
          </Button>
          <Button
            className={c.outline}
            classes={{
              itemText:
                "flex flex-row-reverse items-center justify-center gap-2",
            }}
            startIcon={<CheckIcon />}
          >
            Reversed
          </Button>
        </DemoWrapper>
      </Section>

      {/* ─── asChild ────────────────────────────────────────────────────── */}
      <Section
        title="asChild"
        description="Merge button props onto a child element for maximum flexibility."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <Button className={c.primary} asChild>
            <a href="https://chumlab.com" target="_blank" rel="noreferrer">
              Link as Button
            </a>
          </Button>
          <Button className={c.primary} asChild disabled>
            <a href="https://chumlab.com" target="_blank" rel="noreferrer">
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
        <DemoWrapper isDarkMode={dark} layout="inline">
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
        <DemoWrapper isDarkMode={dark} layout="inline">
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
                    className={`${c.outline} ${i === 0 ? "rounded-r-none border-r-0" : i === 2 ? "rounded-l-none" : "rounded-none border-r-0"} ${activeGroup === label.toLowerCase() ? (dark ? "bg-cl-text/10" : "bg-cl-accent/10") : ""}`}
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
              setFormSubmit(JSON.stringify([...new FormData(e.currentTarget).entries()]));
            }}
            className="flex flex-wrap items-center gap-3"
          >
            <Button className={c.primary} type="submit">
              Submit (type=submit)
            </Button>
            <Button className={c.secondary} type="reset">
              Reset (type=reset)
            </Button>
            <Button className={c.ghost}>Button (default type=button)</Button>
          </form>
          <div className="mt-3 rounded-cl-md px-3 py-2 text-xs font-mono bg-cl-bg-elevated text-cl-text-tertiary" data-demo-action>
            onSubmit: {formSubmit}
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Reference — generated from the schema and the .ai.md ──────── */}
      <ComponentDocs name="Button" />

      {/* ─── Accessibility ────────────────────────────────────────────── */}

      <DocControlledPattern
        isDarkMode={dark}
        summary="Button is presentational except for `loading` and `disabled`. Use normal React state in parents for toggles; do not expect internal value state beyond loading."
      />
      <DocEdgeCases
        isDarkMode={dark}
        items={[
          "`asChild` requires exactly one valid element child—merge event handlers carefully.",
          "Anchor buttons (`as=\"a\"`) need `href` for keyboard and SR expectations.",
          "Loading state should pair with `loadingText` or visible content so progress is clear.",
        ]}
      />
      <DocDoDont
        isDarkMode={dark}
        dos={[
          "Provide an accessible name for icon-only buttons.",
          "Use `type=\"button\"` in forms unless you intend to submit.",
          "Disable or show loading for async actions to prevent double submission.",
        ]}
        donts={[
          "Do not rely on color alone for destructive actions.",
          "Do not nest interactive elements inside the button when `asChild` is false.",
          "Do not omit focus styles in custom themes.",
        ]}
      />
    </div>
  );
};

export default ButtonDemo;
