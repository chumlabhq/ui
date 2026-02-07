import { useState } from "react";
import { Button, ButtonGroup } from "../../components/Button";
import { useTheme } from "./ThemeContext";
import { Section, CodeBlock, DemoWrapper } from "./components";


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


const ButtonDemo = () => {
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(false);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [formStatus, setFormStatus] = useState<string>("");

  const simulateLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  const handleGroupClick = (name: string) => {
    setActiveGroup(name);
    setTimeout(() => setActiveGroup(null), 500);
  };

  const getButtonStyles = () => ({
    primary: `cursor-pointer px-4 py-2 rounded-lg font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 ${
      isDarkMode
        ? "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-blue-400 focus-visible:ring-offset-gray-900"
        : "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-blue-500"
    }`,
    secondary: `cursor-pointer px-4 py-2 rounded-lg font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 ${
      isDarkMode
        ? "bg-gray-600 text-white hover:bg-gray-500 active:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-gray-400 focus-visible:ring-offset-gray-900"
        : "bg-gray-200 text-gray-800 hover:bg-gray-300 active:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-gray-500"
    }`,
    outline: `cursor-pointer px-4 py-2 rounded-lg font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 ${
      isDarkMode
        ? "border border-gray-500 text-gray-200 hover:bg-gray-700 active:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-gray-400 focus-visible:ring-offset-gray-900"
        : "border border-gray-300 text-gray-700 hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-gray-500"
    }`,
    ghost: `cursor-pointer px-4 py-2 rounded-lg font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 ${
      isDarkMode
        ? "text-gray-200 hover:bg-gray-700 active:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-gray-400 focus-visible:ring-offset-gray-900"
        : "text-gray-700 hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-gray-500"
    }`,
    danger: `cursor-pointer px-4 py-2 rounded-lg font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 ${
      isDarkMode
        ? "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-red-400 focus-visible:ring-offset-gray-900"
        : "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-red-500"
    }`,
    success: `cursor-pointer px-4 py-2 rounded-lg font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 ${
      isDarkMode
        ? "bg-green-600 text-white hover:bg-green-700 active:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-green-400 focus-visible:ring-offset-gray-900"
        : "bg-green-600 text-white hover:bg-green-700 active:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-green-500"
    }`,
    link: `cursor-pointer font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 ${
      isDarkMode
        ? "text-blue-400 hover:text-blue-300 hover:underline focus-visible:ring-blue-400 focus-visible:ring-offset-gray-900"
        : "text-blue-600 hover:text-blue-800 hover:underline focus-visible:ring-blue-500"
    }`,
    text: `cursor-pointer font-medium transition-colors ${
      isDarkMode
        ? "text-gray-300 hover:text-gray-100"
        : "text-gray-700 hover:text-gray-900"
    }`,
    iconOnly: `cursor-pointer p-2 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 ${
      isDarkMode
        ? "text-gray-300 hover:text-white hover:bg-gray-700 active:bg-gray-600 focus-visible:ring-gray-400 focus-visible:ring-offset-gray-900"
        : "text-gray-700 hover:text-gray-900 hover:bg-gray-100 active:bg-gray-200 focus-visible:ring-gray-500"
    }`,
  });

  const styles = getButtonStyles();

  return (
    <div className="space-y-16">
      <header>
        <h1 className={`text-3xl font-bold mb-3 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          Button
        </h1>
        <p className={`text-lg ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
          A flexible, accessible button component for your design system. Supports icons,
          loading states, animations, tooltips, polymorphic rendering (button, link, span),
          and extensive customization.
        </p>

        <div className="mt-6">
          <h3 className={`text-sm font-semibold mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
            Installation
          </h3>
          <CodeBlock
            isDarkMode={isDarkMode}
            code={`import { Button, ButtonGroup } from "@kern-ui/button";`}
          />
        </div>
      </header>

      <div className="space-y-12">
        <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          Examples
        </h2>

        <Section
          title="Basic Variants"
          description="Different button styles for various use cases."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Button className={styles.primary}>Primary</Button>
            <Button className={styles.secondary}>Secondary</Button>
            <Button className={styles.outline}>Outline</Button>
            <Button className={styles.ghost}>Ghost</Button>
            <Button className={styles.danger}>Danger</Button>
            <Button className={styles.success}>Success</Button>
          </DemoWrapper>
        </Section>

        <Section
          title="With Icons"
          description="Add leading and/or trailing icons using the leadingIcon and trailingIcon props."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Button className={styles.primary} leadingIcon={<PlusIcon />}>
              Add Item
            </Button>
            <Button className={styles.secondary} trailingIcon={<ArrowRightIcon />}>
              Continue
            </Button>
            <Button
              className={styles.outline}
              leadingIcon={<SearchIcon />}
              trailingIcon={<ArrowRightIcon />}
            >
              Search
            </Button>
            <Button className={styles.success} leadingIcon={<DownloadIcon />}>
              Download
            </Button>
            <Button className={styles.danger} leadingIcon={<TrashIcon />}>
              Delete
            </Button>
          </DemoWrapper>
        </Section>

        <Section
          title="Icon Only Buttons"
          description="Buttons with only icons. Always provide an aria-label for accessibility."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Button
              className={styles.iconOnly}
              leadingIcon={<SearchIcon />}
              aria-label="Search"
            />
            <Button
              className={styles.iconOnly}
              leadingIcon={<PlusIcon />}
              aria-label="Add"
            />
            <Button
              className={styles.iconOnly}
              leadingIcon={<DownloadIcon />}
              aria-label="Download"
            />
            <Button
              className={styles.iconOnly}
              leadingIcon={<TrashIcon />}
              aria-label="Delete"
            />
            <Button
              className={`${styles.iconOnly} ${isDarkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-600 hover:bg-blue-700"} text-white`}
              leadingIcon={<CheckIcon />}
              aria-label="Confirm"
            />
          </DemoWrapper>
        </Section>

        <Section
          title="Polymorphic Rendering (as prop)"
          description='Render as different elements using the "as" prop: button (default), anchor link, or span.'
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="flex flex-col gap-4 w-full">
              <div>
                <p className={`text-xs mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  as="button" (default)
                </p>
                <Button className={styles.primary} onClick={() => alert("Button clicked!")}>
                  Button Element
                </Button>
              </div>
              <div>
                <p className={`text-xs mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  as="a" (anchor link)
                </p>
                <div className="flex items-center gap-3">
                  <Button
                    as="a"
                    href="https://example.com"
                    target="_blank"
                    rel="noreferrer"
                    className={styles.link}
                  >
                    Simple Link
                  </Button>
                  <Button
                    as="a"
                    href="https://example.com"
                    target="_blank"
                    rel="noreferrer"
                    className={styles.link}
                    trailingIcon={<ExternalLinkIcon />}
                    iconAnimation="slideRight"
                  >
                    External Link
                  </Button>
                  <Button
                    as="a"
                    href="https://example.com"
                    target="_blank"
                    rel="noreferrer"
                    className={styles.primary}
                  >
                    Styled Link Button
                  </Button>
                </div>
              </div>
              <div>
                <p className={`text-xs mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  as="span" (keyboard accessible span)
                </p>
                <div className="flex items-center gap-3">
                  <Button as="span" className={styles.text}>
                    Text Button
                  </Button>
                  <Button
                    as="span"
                    className={styles.text}
                    trailingIcon={<ArrowRightIcon />}
                    iconAnimation="slideRight"
                  >
                    Learn More
                  </Button>
                  <Button
                    as="span"
                    className={`${styles.text} ${isDarkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-800"}`}
                    leadingIcon={<PlusIcon />}
                    iconAnimation="pulse"
                    animateIcon="leading"
                  >
                    Add New
                  </Button>
                </div>
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Icon Animations (On Hover)"
          description="Animate icons on hover using iconAnimation prop. Default animateOnHover is true."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Button
              className={styles.primary}
              trailingIcon={<ArrowRightIcon />}
              iconAnimation="slideRight"
            >
              Slide Right
            </Button>
            <Button
              className={styles.secondary}
              leadingIcon={<ArrowRightIcon />}
              iconAnimation="slideLeft"
              animateIcon="leading"
            >
              Slide Left
            </Button>
            <Button
              className={styles.outline}
              trailingIcon={<ArrowRightIcon />}
              iconAnimation="slideUp"
            >
              Slide Up
            </Button>
            <Button
              className={styles.ghost}
              trailingIcon={<ArrowRightIcon />}
              iconAnimation="slideDown"
            >
              Slide Down
            </Button>
          </DemoWrapper>
        </Section>

        <Section
          title="More Animation Effects"
          description="Additional animation options: bounce, pulse, and spin."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Button
              className={styles.primary}
              trailingIcon={<ArrowRightIcon />}
              iconAnimation="bounce"
            >
              Bounce
            </Button>
            <Button
              className={styles.secondary}
              leadingIcon={<SearchIcon />}
              iconAnimation="pulse"
              animateIcon="leading"
            >
              Pulse
            </Button>
            <Button
              className={styles.outline}
              leadingIcon={<SpinnerIcon />}
              iconAnimation="spin"
              animateIcon="leading"
            >
              Spin (Hover)
            </Button>
          </DemoWrapper>
        </Section>

        <Section
          title="Animate Both Icons"
          description='Use animateIcon="both" to animate leading and trailing icons together.'
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Button
              className={styles.primary}
              leadingIcon={<ArrowRightIcon />}
              trailingIcon={<ArrowRightIcon />}
              iconAnimation="slideRight"
              animateIcon="both"
            >
              Both Slide Right
            </Button>
            <Button
              className={styles.secondary}
              leadingIcon={<PlusIcon />}
              trailingIcon={<PlusIcon />}
              iconAnimation="pulse"
              animateIcon="both"
            >
              Both Pulse
            </Button>
          </DemoWrapper>
        </Section>

        <Section
          title="Continuous Animation"
          description="Set animateOnHover={false} to make animations run continuously."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Button
              className={styles.primary}
              trailingIcon={<ArrowRightIcon />}
              iconAnimation="slideRight"
              animateOnHover={false}
            >
              Always Sliding
            </Button>
            <Button
              className={styles.secondary}
              leadingIcon={<SpinnerIcon />}
              iconAnimation="spin"
              animateIcon="leading"
              animateOnHover={false}
            >
              Always Spinning
            </Button>
            <Button
              className={styles.outline}
              leadingIcon={<SearchIcon />}
              iconAnimation="pulse"
              animateIcon="leading"
              animateOnHover={false}
            >
              Always Pulsing
            </Button>
          </DemoWrapper>
        </Section>

        <Section
          title="Loading States"
          description="Use loading to show a loading spinner. Customize with loadingText, loaderPosition, and loaderSize."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="flex flex-col gap-4 w-full">
              <div>
                <p className={`text-xs mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Default loading (loader on right)
                </p>
                <div className="flex items-center gap-3">
                  <Button className={styles.primary} loading>
                    Loading
                  </Button>
                  <Button className={styles.secondary} loading>
                    Saving
                  </Button>
                </div>
              </div>
              <div>
                <p className={`text-xs mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  loaderPosition="left"
                </p>
                <Button className={styles.primary} loading loaderPosition="left">
                  Processing
                </Button>
              </div>
              <div>
                <p className={`text-xs mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  With loadingText
                </p>
                <Button className={styles.outline} loading loadingText="Submitting...">
                  Submit
                </Button>
              </div>
              <div>
                <p className={`text-xs mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Loading with icon (icon remains visible)
                </p>
                <Button className={styles.success} loading leadingIcon={<DownloadIcon />}>
                  Downloading
                </Button>
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Custom Loader"
          description="Provide a custom loader component using the loader prop."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Button
              className={styles.primary}
              loading
              loaderSize={12}
            >
              Small Loader
            </Button>
            <Button
              className={styles.primary}
              loading
              loaderSize={20}
            >
              Large Loader
            </Button>
            <Button
              className={styles.secondary}
              loading
              loader={
                <span className={`text-xs animate-pulse ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
                  ...
                </span>
              }
            >
              Custom Dots
            </Button>
            <Button
              className={styles.outline}
              loading
              loader={
                <div className="flex gap-0.5">
                  <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              }
            >
              Bouncing Dots
            </Button>
          </DemoWrapper>
        </Section>

        <Section
          title="Interactive Loading"
          description="Click to trigger a loading state simulation."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Button
              className={styles.primary}
              loading={loading}
              loadingText="Processing..."
              onClick={simulateLoading}
            >
              Click to Load
            </Button>
            <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
              {loading ? "Loading for 2 seconds..." : "Click the button to see loading state"}
            </p>
          </DemoWrapper>
        </Section>

        <Section
          title="Disabled State"
          description="Use the disabled prop to disable the button."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Button className={styles.primary} disabled>
              Disabled Primary
            </Button>
            <Button className={styles.secondary} disabled>
              Disabled Secondary
            </Button>
            <Button className={styles.outline} disabled>
              Disabled Outline
            </Button>
            <Button className={styles.ghost} disabled leadingIcon={<PlusIcon />}>
              Disabled with Icon
            </Button>
          </DemoWrapper>
        </Section>

        <Section
          title="Full Width"
          description="Use fullWidth prop to make the button span the full container width."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="w-full space-y-3">
              <Button className={styles.primary} fullWidth>
                Full Width Primary
              </Button>
              <Button className={styles.outline} fullWidth leadingIcon={<DownloadIcon />}>
                Full Width with Icon
              </Button>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Content Class Name"
          description="Customize the inner content wrapper with contentClassName prop."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Button
              className={styles.primary}
              contentClassName="inline-flex items-center justify-center gap-4"
              leadingIcon={<SearchIcon />}
            >
              Wider Gap (gap-4)
            </Button>
            <Button
              className={styles.secondary}
              contentClassName="inline-flex items-center justify-center gap-1"
              trailingIcon={<ArrowRightIcon />}
            >
              Tighter Gap (gap-1)
            </Button>
            <Button
              className={styles.outline}
              contentClassName="flex flex-row-reverse items-center justify-center gap-2"
              leadingIcon={<CheckIcon />}
            >
              Reversed Content
            </Button>
          </DemoWrapper>
        </Section>

        <Section
          title="As Child (asChild prop)"
          description="Use asChild to merge button props onto a child element for maximum flexibility."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="flex flex-wrap gap-3">
              <Button className={styles.primary} asChild>
                <a href="https://example.com" target="_blank" rel="noreferrer">
                  Link as Button (asChild)
                </a>
              </Button>
              <Button className={styles.primary} asChild disabled>
                <a href="https://example.com" target="_blank" rel="noreferrer" onClick={() => alert("This should NOT fire")}>
                  Disabled asChild (click suppressed)
                </a>
              </Button>
              <Button className={styles.primary} asChild loading>
                <a href="https://example.com" target="_blank" rel="noreferrer" onClick={() => alert("This should NOT fire")}>
                  Loading asChild
                </a>
              </Button>
            </div>
          </DemoWrapper>
          <CodeBlock
            isDarkMode={isDarkMode}
            code={`{/* Normal */}
<Button asChild>
  <a href="/about">Link as Button</a>
</Button>

{/* Disabled — child's onClick is automatically suppressed */}
<Button asChild disabled>
  <a href="/about" onClick={() => alert("won't fire")}>
    Disabled Link
  </a>
</Button>

{/* Loading — also suppresses child click */}
<Button asChild loading>
  <a href="/about">Loading Link</a>
</Button>`}
          />
          <div className={`mt-4 p-3 rounded-lg ${isDarkMode ? "bg-blue-900/30 border border-blue-800" : "bg-blue-50 border border-blue-200"}`}>
            <p className={`text-sm ${isDarkMode ? "text-blue-200" : "text-blue-800"}`}>
              <strong>Note:</strong> When <code className={`px-1 py-0.5 border rounded text-xs font-mono ${isDarkMode ? "bg-gray-800/80 border-gray-600 text-gray-300" : "bg-white border-gray-300 text-gray-700"}`}>asChild</code> is 
              combined with <code className={`px-1 py-0.5 border rounded text-xs font-mono ${isDarkMode ? "bg-gray-800/80 border-gray-600 text-gray-300" : "bg-white border-gray-300 text-gray-700"}`}>disabled</code> or <code className={`px-1 py-0.5 border rounded text-xs font-mono ${isDarkMode ? "bg-gray-800/80 border-gray-600 text-gray-300" : "bg-white border-gray-300 text-gray-700"}`}>loading</code>, 
              the child element&#39;s native onClick is automatically suppressed via event.preventDefault(). 
              The child also receives <code className={`px-1 py-0.5 border rounded text-xs font-mono ${isDarkMode ? "bg-gray-800/80 border-gray-600 text-gray-300" : "bg-white border-gray-300 text-gray-700"}`}>aria-disabled</code> for accessibility.
            </p>
          </div>
        </Section>

        <Section
          title="With Tooltip"
          description="Add tooltips using the tooltip prop. Customize with tooltipProps."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Button className={styles.primary} tooltip="Click to save your changes">
              Save
            </Button>
            <Button
              className={styles.danger}
              tooltip="This action cannot be undone"
              tooltipProps={{ side: "bottom" }}
            >
              Delete
            </Button>
            <Button
              className={styles.outline}
              tooltip="Copy to clipboard"
              tooltipProps={{ side: "right", delayDuration: 100 }}
            >
              Copy
            </Button>
            <Button
              className={styles.iconOnly}
              leadingIcon={<SearchIcon />}
              aria-label="Search"
              tooltip="Search for items"
              tooltipProps={{ side: "bottom", showArrow: false }}
            />
          </DemoWrapper>
        </Section>

        <Section
          title="Tooltip Customization"
          description="Full control over tooltip appearance and behavior using tooltipProps."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Button
              className={styles.primary}
              tooltip="Top tooltip (default)"
              tooltipProps={{ side: "top" }}
            >
              Top
            </Button>
            <Button
              className={styles.secondary}
              tooltip="Right side tooltip"
              tooltipProps={{ side: "right" }}
            >
              Right
            </Button>
            <Button
              className={styles.outline}
              tooltip="Bottom tooltip"
              tooltipProps={{ side: "bottom" }}
            >
              Bottom
            </Button>
            <Button
              className={styles.ghost}
              tooltip="Left side tooltip"
              tooltipProps={{ side: "left" }}
            >
              Left
            </Button>
            <Button
              className={styles.primary}
              tooltip="Custom offset tooltip"
              tooltipProps={{ side: "top", sideOffset: 16 }}
            >
              Large Offset
            </Button>
            <Button
              className={styles.secondary}
              tooltip="No arrow tooltip"
              tooltipProps={{ showArrow: false }}
            >
              No Arrow
            </Button>
          </DemoWrapper>
        </Section>

        <Section
          title="Tooltip with Icons & Animation"
          description="Combine tooltips with icons and animations."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Button
              className={styles.primary}
              trailingIcon={<ArrowRightIcon />}
              iconAnimation="slideRight"
              tooltip="Continue to the next step"
            >
              Continue
            </Button>
            <Button
              as="a"
              href="https://example.com"
              target="_blank"
              rel="noreferrer"
              className={styles.link}
              trailingIcon={<ExternalLinkIcon />}
              iconAnimation="slideRight"
              tooltip="Opens in a new tab"
              tooltipProps={{ side: "top" }}
            >
              External Link
            </Button>
            <Button
              className={styles.success}
              leadingIcon={<DownloadIcon />}
              iconAnimation="slideDown"
              animateIcon="leading"
              tooltip="Download the file"
            >
              Download
            </Button>
          </DemoWrapper>
        </Section>

        <Section
          title="Button Group"
          description="Group related buttons together using ButtonGroup component."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="flex flex-col gap-6 w-full">
              <div>
                <p className={`text-xs mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Segmented control (no gap)
                </p>
                <ButtonGroup className="inline-flex gap-0">
                  <Button
                    className={`${styles.outline} rounded-r-none border-r-0 ${activeGroup === "left" ? (isDarkMode ? "bg-gray-600" : "bg-blue-100") : ""}`}
                    onClick={() => handleGroupClick("left")}
                  >
                    Left
                  </Button>
                  <Button
                    className={`${styles.outline} rounded-none border-r-0 ${activeGroup === "middle" ? (isDarkMode ? "bg-gray-600" : "bg-blue-100") : ""}`}
                    onClick={() => handleGroupClick("middle")}
                  >
                    Middle
                  </Button>
                  <Button
                    className={`${styles.outline} rounded-l-none ${activeGroup === "right" ? (isDarkMode ? "bg-gray-600" : "bg-blue-100") : ""}`}
                    onClick={() => handleGroupClick("right")}
                  >
                    Right
                  </Button>
                </ButtonGroup>
              </div>
              <div>
                <p className={`text-xs mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Action buttons with gap
                </p>
                <ButtonGroup className="inline-flex gap-2">
                  <Button
                    className={`${styles.primary} ${activeGroup === "save" ? "ring-2 ring-blue-300" : ""}`}
                    onClick={() => handleGroupClick("save")}
                  >
                    Save
                  </Button>
                  <Button
                    className={`${styles.secondary} ${activeGroup === "cancel" ? "ring-2 ring-gray-400" : ""}`}
                    onClick={() => handleGroupClick("cancel")}
                  >
                    Cancel
                  </Button>
                </ButtonGroup>
              </div>
              {activeGroup && (
                <p className={`text-sm ${isDarkMode ? "text-green-400" : "text-green-600"}`}>
                  Clicked: <strong>{activeGroup}</strong>
                </p>
              )}
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Vertical Button Group"
          description="Stack buttons vertically using flex-col on the ButtonGroup."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <ButtonGroup className="flex flex-col gap-2">
              <Button
                className={`${styles.outline} ${activeGroup === "opt1" ? (isDarkMode ? "bg-gray-600" : "bg-blue-100") : ""}`}
                onClick={() => handleGroupClick("opt1")}
              >
                Option 1
              </Button>
              <Button
                className={`${styles.outline} ${activeGroup === "opt2" ? (isDarkMode ? "bg-gray-600" : "bg-blue-100") : ""}`}
                onClick={() => handleGroupClick("opt2")}
              >
                Option 2
              </Button>
              <Button
                className={`${styles.outline} ${activeGroup === "opt3" ? (isDarkMode ? "bg-gray-600" : "bg-blue-100") : ""}`}
                onClick={() => handleGroupClick("opt3")}
              >
                Option 3
              </Button>
            </ButtonGroup>
          </DemoWrapper>
        </Section>

        <Section
          title="Button Group with Icons"
          description="Combine ButtonGroup with icon buttons for toolbars and action bars."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="flex flex-col gap-6 w-full">
              <div>
                <p className={`text-xs mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Icon-only toolbar
                </p>
                <ButtonGroup className="inline-flex gap-0">
                  <Button
                    className={`${styles.outline} rounded-r-none border-r-0`}
                    leadingIcon={<SearchIcon />}
                    aria-label="Search"
                  />
                  <Button
                    className={`${styles.outline} rounded-none border-r-0`}
                    leadingIcon={<PlusIcon />}
                    aria-label="Add"
                  />
                  <Button
                    className={`${styles.outline} rounded-none border-r-0`}
                    leadingIcon={<DownloadIcon />}
                    aria-label="Download"
                  />
                  <Button
                    className={`${styles.outline} rounded-l-none`}
                    leadingIcon={<TrashIcon />}
                    aria-label="Delete"
                  />
                </ButtonGroup>
              </div>
              <div>
                <p className={`text-xs mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Mixed icons and text
                </p>
                <ButtonGroup className="inline-flex gap-2">
                  <Button
                    className={styles.primary}
                    leadingIcon={<PlusIcon />}
                  >
                    Add
                  </Button>
                  <Button
                    className={styles.secondary}
                    leadingIcon={<DownloadIcon />}
                  >
                    Export
                  </Button>
                  <Button
                    className={styles.danger}
                    leadingIcon={<TrashIcon />}
                  >
                    Delete
                  </Button>
                </ButtonGroup>
              </div>
              <div>
                <p className={`text-xs mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Icon buttons with animations
                </p>
                <ButtonGroup className="inline-flex gap-1">
                  <Button
                    className={styles.ghost}
                    leadingIcon={<SearchIcon />}
                    iconAnimation="pulse"
                    animateIcon="leading"
                    aria-label="Search"
                  />
                  <Button
                    className={styles.ghost}
                    leadingIcon={<DownloadIcon />}
                    iconAnimation="slideDown"
                    animateIcon="leading"
                    aria-label="Download"
                  />
                  <Button
                    className={styles.ghost}
                    leadingIcon={<ArrowRightIcon />}
                    iconAnimation="slideRight"
                    animateIcon="leading"
                    aria-label="Next"
                  />
                </ButtonGroup>
              </div>
              <div>
                <p className={`text-xs mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Vertical icon toolbar
                </p>
                <ButtonGroup className="inline-flex flex-col gap-0">
                  <Button
                    className={`${styles.outline} rounded-b-none border-b-0`}
                    leadingIcon={<PlusIcon />}
                    aria-label="Add"
                  />
                  <Button
                    className={`${styles.outline} rounded-none border-b-0`}
                    leadingIcon={<SearchIcon />}
                    aria-label="Search"
                  />
                  <Button
                    className={`${styles.outline} rounded-t-none`}
                    leadingIcon={<CheckIcon />}
                    aria-label="Confirm"
                  />
                </ButtonGroup>
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Form Integration"
          description='Use type="submit" or type="reset" for form buttons. Default type is "button".'
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setFormStatus("Form submitted!");
                setTimeout(() => setFormStatus(""), 2000);
              }}
              onReset={() => {
                setFormStatus("Form reset!");
                setTimeout(() => setFormStatus(""), 2000);
              }}
              className="w-full max-w-md space-y-4"
            >
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Sample Input
                </label>
                <input
                  type="text"
                  placeholder="Enter something..."
                  className={`w-full px-3 py-2 rounded-lg border outline-none ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-blue-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500"
                  }`}
                />
              </div>
              <div className="flex gap-3">
                <Button className={styles.primary} type="submit">
                  Submit
                </Button>
                <Button className={styles.secondary} type="reset">
                  Reset
                </Button>
                <Button className={styles.ghost} type="button" onClick={() => alert("Button type (no form action)")}>
                  Button
                </Button>
              </div>
              {formStatus && (
                <p className={`text-sm font-medium ${isDarkMode ? "text-green-400" : "text-green-600"}`}>
                  {formStatus}
                </p>
              )}
            </form>
          </DemoWrapper>
        </Section>

        <Section
          title="Data Attributes"
          description="Button applies data attributes for CSS-based state styling."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="overflow-x-auto w-full">
              <table className={`min-w-full text-sm ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}>
                <thead>
                  <tr className={`border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
                    <th className="text-left py-3 pr-4 font-semibold">Attribute</th>
                    <th className="text-left py-3 pr-4 font-semibold">Applied When</th>
                    <th className="text-left py-3 font-semibold">Example Usage</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-100"}`}>
                  <tr>
                    <td className="py-3 pr-4 font-mono text-blue-500">data-loading</td>
                    <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      loading is true
                    </td>
                    <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                        data-[loading]:opacity-70
                      </code>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-mono text-blue-500">data-disabled</td>
                    <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      disabled or loading
                    </td>
                    <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                        data-[disabled]:cursor-not-allowed
                      </code>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-mono text-blue-500">data-full-width</td>
                    <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      fullWidth is true
                    </td>
                    <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                        data-[full-width]:w-full
                      </code>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </DemoWrapper>
        </Section>
      </div>

      <div className="space-y-8">
        <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          API Reference
        </h2>

        <div>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
            Button
          </h3>
          <div className="overflow-x-auto">
            <table className={`min-w-full text-sm ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}>
              <thead>
                <tr className={`border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
                  <th className="text-left py-3 pr-4 font-semibold">Prop</th>
                  <th className="text-left py-3 pr-4 font-semibold">Type</th>
                  <th className="text-left py-3 pr-4 font-semibold">Default</th>
                  <th className="text-left py-3 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-100"}`}>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">as</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    "button" | "a" | "span"
                  </td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>"button"</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Element type to render (button, anchor, or span)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">children</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>ReactNode</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>-</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Button content
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">leadingIcon</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>ReactNode</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>-</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Icon displayed before the content
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">trailingIcon</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>ReactNode</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>-</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Icon displayed after the content
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">iconAnimation</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>IconAnimation</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>"none"</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Animation effect for icons
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">animateOnHover</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>boolean</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>true</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Animate icons only on hover (false = continuous)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">animateIcon</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    "leading" | "trailing" | "both"
                  </td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>"trailing"</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Which icon(s) to animate
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">loading</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>boolean</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>false</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Show loading state
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">loadingText</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>ReactNode</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>-</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Text to display while loading
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">loaderPosition</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>"left" | "right"</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>"right"</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Position of the loader spinner
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">loaderSize</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>number</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>16</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Size of the loader spinner in pixels
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">loader</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>ReactNode</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>CircularLoader</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Custom loader component
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">fullWidth</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>boolean</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>false</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Make button full width
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">asChild</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>boolean</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>false</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Merge props onto child element (polymorphic)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">tooltip</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>ReactNode</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>-</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Tooltip content
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">tooltipProps</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>ButtonTooltipProps</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>-</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Tooltip configuration options
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">href</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>-</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    URL for link buttons (required when as="a")
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">target</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>-</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Link target (e.g., "_blank")
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">rel</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>-</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Link relationship (e.g., "noreferrer")
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">type</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    "button" | "submit" | "reset"
                  </td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>"button"</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    HTML button type (only for as="button")
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">disabled</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>boolean</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>false</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Disable the button
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">className</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>""</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    CSS class for the button element
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">contentClassName</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>"inline-flex items-center..."</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    CSS class for the inner content wrapper
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
            ButtonTooltipProps
          </h3>
          <div className="overflow-x-auto">
            <table className={`min-w-full text-sm ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}>
              <thead>
                <tr className={`border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
                  <th className="text-left py-3 pr-4 font-semibold">Prop</th>
                  <th className="text-left py-3 pr-4 font-semibold">Type</th>
                  <th className="text-left py-3 pr-4 font-semibold">Default</th>
                  <th className="text-left py-3 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-100"}`}>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">side</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    "top" | "right" | "bottom" | "left"
                  </td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>"top"</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Tooltip position relative to button
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">align</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    "start" | "center" | "end"
                  </td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>"center"</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Tooltip alignment
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">sideOffset</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>number</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>6</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Offset from the button in pixels
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">maxWidth</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string | number</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>300</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Max width of tooltip
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">delayDuration</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>number</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>200</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Delay before showing tooltip (ms)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">showArrow</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>boolean</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>true</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Show arrow on tooltip
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">contentClassName</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>-</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Custom CSS class for tooltip content
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">contentStyle</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>CSSProperties</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>-</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Custom inline styles for tooltip content
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
            ButtonGroup
          </h3>
          <div className="overflow-x-auto">
            <table className={`min-w-full text-sm ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}>
              <thead>
                <tr className={`border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
                  <th className="text-left py-3 pr-4 font-semibold">Prop</th>
                  <th className="text-left py-3 pr-4 font-semibold">Type</th>
                  <th className="text-left py-3 pr-4 font-semibold">Default</th>
                  <th className="text-left py-3 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-100"}`}>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">children</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>ReactNode</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>required</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Button components to render in the group
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">className</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>""</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    CSS class for the group container
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
            Type Definitions
          </h3>
          <CodeBlock
            isDarkMode={isDarkMode}
            code={`type IconAnimation =
  | "none"
  | "slideRight"
  | "slideLeft"
  | "slideUp"
  | "slideDown"
  | "bounce"
  | "pulse"
  | "spin";

type TooltipSide = "top" | "right" | "bottom" | "left";
type TooltipAlign = "start" | "center" | "end";

interface ButtonTooltipProps {
  side?: TooltipSide;
  align?: TooltipAlign;
  sideOffset?: number;
  maxWidth?: string | number;
  delayDuration?: number;
  showArrow?: boolean;
  contentClassName?: string;
  contentStyle?: CSSProperties;
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  loading?: boolean;
  loadingText?: ReactNode;
  loaderPosition?: "left" | "right";
  loaderSize?: number;
  loader?: ReactNode;
  fullWidth?: boolean;
  asChild?: boolean;
  contentClassName?: string;
  as?: "button" | "a" | "span";
  href?: string;
  target?: string;
  rel?: string;
  iconAnimation?: IconAnimation;
  animateOnHover?: boolean;
  animateIcon?: "leading" | "trailing" | "both";
  tooltip?: ReactNode;
  tooltipProps?: ButtonTooltipProps;
}

interface ButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}`}
          />
        </div>
      </div>

      <div className="space-y-6">
        <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          Accessibility
        </h2>
        <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-gray-50"}`}>
          <h3 className={`font-semibold mb-3 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
            Features
          </h3>
          <ul className={`list-disc list-inside space-y-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            <li>
              Proper button semantics with{" "}
              <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                type="button"
              </code>{" "}
              by default to prevent accidental form submission
            </li>
            <li>
              <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                aria-busy
              </code>{" "}
              is set when loading
            </li>
            <li>
              <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                aria-disabled
              </code>{" "}
              is set when disabled or loading
            </li>
            <li>
              Span buttons (as="span") include{" "}
              <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                role="button"
              </code>{" "}
              and keyboard support (Enter/Space)
            </li>
            <li>
              Focus visible ring for keyboard navigation
            </li>
            <li>
              Loader has{" "}
              <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                aria-hidden="true"
              </code>{" "}
              as it's decorative
            </li>
            <li>
              ButtonGroup uses{" "}
              <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                role="group"
              </code>{" "}
              for grouping semantics
            </li>
            <li>
              Icon-only buttons should always have an{" "}
              <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                aria-label
              </code>
            </li>
          </ul>
        </div>

        <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-gray-50"}`}>
          <h3 className={`font-semibold mb-3 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
            Keyboard Navigation
          </h3>
          <ul className={`space-y-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            <li>
              <kbd className={`px-2 py-1 rounded text-xs font-mono ${isDarkMode ? "bg-gray-900 border border-gray-600 text-gray-100" : "bg-white border border-gray-300 text-gray-700"}`}>
                Tab
              </kbd>{" "}
              - Move focus to/from button
            </li>
            <li>
              <kbd className={`px-2 py-1 rounded text-xs font-mono ${isDarkMode ? "bg-gray-900 border border-gray-600 text-gray-100" : "bg-white border border-gray-300 text-gray-700"}`}>
                Enter
              </kbd>{" "}
              /{" "}
              <kbd className={`px-2 py-1 rounded text-xs font-mono ${isDarkMode ? "bg-gray-900 border border-gray-600 text-gray-100" : "bg-white border border-gray-300 text-gray-700"}`}>
                Space
              </kbd>{" "}
              - Activate button (also works for span buttons)
            </li>
          </ul>
        </div>

        <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-gray-50"}`}>
          <h3 className={`font-semibold mb-3 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
            Best Practices
          </h3>
          <ul className={`list-disc list-inside space-y-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            <li>
              Always provide descriptive button text or{" "}
              <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                aria-label
              </code>{" "}
              for icon-only buttons
            </li>
            <li>
              Use{" "}
              <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                type="submit"
              </code>{" "}
              for form submission buttons
            </li>
            <li>
              Avoid using{" "}
              <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                as="span"
              </code>{" "}
              when a real button or link would be more appropriate
            </li>
            <li>
              Ensure sufficient color contrast for button text and backgrounds
            </li>
            <li>
              Provide visual feedback for loading and disabled states
            </li>
          </ul>
        </div>
      </div>

      <div className={`p-4 rounded-lg border ${isDarkMode ? "border-blue-800 bg-blue-950/30 text-blue-300" : "border-blue-200 bg-blue-50 text-blue-800"}`}>
        <p className="text-sm">
          <strong>Note:</strong> The Button component accepts all standard HTML button attributes.
          When using <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}>as="a"</code>, anchor-specific
          attributes like <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}>href</code>, <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}>target</code>, and <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}>rel</code> are available.
        </p>
      </div>
    </div>
  );
};

export default ButtonDemo;
