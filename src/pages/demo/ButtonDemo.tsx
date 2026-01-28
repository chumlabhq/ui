import { useState } from "react";
import { Button, ButtonGroup } from "../../components/Button";
import {
  Section,
  ComponentHeader,
  SearchIcon,
  ArrowRightIcon,
  PlusIcon,
} from "./components";

const ButtonDemo = () => {
  const [loading, setLoading] = useState(false);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  const simulateLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  const handleGroupClick = (name: string) => {
    setActiveGroup(name);
    setTimeout(() => setActiveGroup(null), 500);
  };

  const baseStyles =
    "cursor-pointer px-4 py-2 rounded-lg font-medium transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2";
  const primaryStyles = `${baseStyles} bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed`;
  const secondaryStyles = `${baseStyles} bg-gray-200 text-gray-800 hover:bg-gray-300 active:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed`;
  const outlineStyles = `${baseStyles} border border-gray-300 text-gray-700 hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed`;
  const ghostStyles = `${baseStyles} text-gray-700 hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed`;
  const linkStyles =
    "cursor-pointer text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2";
  const textButtonStyles =
    "cursor-pointer text-gray-700 hover:text-gray-900 font-medium transition-colors";
  const iconOnlyStyles =
    "cursor-pointer p-2 rounded-lg transition-colors hover:bg-gray-100 active:bg-gray-200 focus-visible:ring-2 focus-visible:ring-blue-500";

  return (
    <>
      <ComponentHeader
        title="Button"
        description="A flexible, accessible button component for your design system."
      />

      <Section title="Basic Variants">
        <Button className={primaryStyles}>Primary</Button>
        <Button className={secondaryStyles}>Secondary</Button>
        <Button className={outlineStyles}>Outline</Button>
        <Button className={ghostStyles}>Ghost</Button>
      </Section>

      <Section title="With Icons">
        <Button className={primaryStyles} leadingIcon={<PlusIcon />}>
          Add Item
        </Button>
        <Button className={secondaryStyles} trailingIcon={<ArrowRightIcon />}>
          Continue
        </Button>
        <Button
          className={outlineStyles}
          leadingIcon={<SearchIcon />}
          trailingIcon={<ArrowRightIcon />}
        >
          Search
        </Button>
      </Section>

      <Section title="Icon Only">
        <Button
          className={iconOnlyStyles}
          leadingIcon={<SearchIcon />}
          aria-label="Search"
        />
        <Button
          className={iconOnlyStyles}
          leadingIcon={<PlusIcon />}
          aria-label="Add"
        />
        <Button
          className={iconOnlyStyles}
          leadingIcon={<ArrowRightIcon />}
          aria-label="Next"
        />
      </Section>

      <Section title="Link Buttons">
        <Button
          as="a"
          href="https://example.com"
          target="_blank"
          rel="noreferrer"
          className={linkStyles}
        >
          Simple Link
        </Button>
        <Button
          as="a"
          href="https://example.com"
          target="_blank"
          rel="noreferrer"
          className={linkStyles}
          trailingIcon={<ArrowRightIcon />}
          iconAnimation="slideRight"
        >
          Link with Arrow
        </Button>
        <Button
          as="a"
          href="https://example.com"
          target="_blank"
          rel="noreferrer"
          className={primaryStyles}
        >
          Styled Link Button
        </Button>
      </Section>

      <Section title="Text Buttons">
        <Button as="span" className={textButtonStyles}>
          Text Button
        </Button>
        <Button
          as="span"
          className={textButtonStyles}
          trailingIcon={<ArrowRightIcon />}
          iconAnimation="slideRight"
        >
          Learn More
        </Button>
        <Button
          as="span"
          className={`${textButtonStyles} text-blue-600 hover:text-blue-800`}
          leadingIcon={<PlusIcon />}
          iconAnimation="pulse"
          animateIcon="leading"
        >
          Add New
        </Button>
      </Section>

      <Section title="Animated Icons (Hover)">
        <Button
          className={primaryStyles}
          trailingIcon={<ArrowRightIcon />}
          iconAnimation="slideRight"
        >
          Slide Right
        </Button>
        <Button
          className={secondaryStyles}
          leadingIcon={<ArrowRightIcon />}
          iconAnimation="slideLeft"
          animateIcon="leading"
        >
          Slide Left
        </Button>
        <Button
          className={outlineStyles}
          trailingIcon={<ArrowRightIcon />}
          iconAnimation="slideUp"
        >
          Slide Up
        </Button>
        <Button
          className={ghostStyles}
          trailingIcon={<ArrowRightIcon />}
          iconAnimation="slideDown"
        >
          Slide Down
        </Button>
      </Section>

      <Section title="Animated Icons (More Effects)">
        <Button
          className={primaryStyles}
          trailingIcon={<ArrowRightIcon />}
          iconAnimation="bounce"
        >
          Bounce
        </Button>
        <Button
          className={secondaryStyles}
          leadingIcon={<SearchIcon />}
          iconAnimation="pulse"
          animateIcon="leading"
        >
          Pulse
        </Button>
        <Button
          className={outlineStyles}
          leadingIcon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          }
          iconAnimation="spin"
          animateIcon="leading"
        >
          Spin (Hover)
        </Button>
      </Section>

      <Section title="Animate Both Icons">
        <Button
          className={primaryStyles}
          leadingIcon={<ArrowRightIcon />}
          trailingIcon={<ArrowRightIcon />}
          iconAnimation="slideRight"
          animateIcon="both"
        >
          Both Slide Right
        </Button>
        <Button
          className={secondaryStyles}
          leadingIcon={<PlusIcon />}
          trailingIcon={<PlusIcon />}
          iconAnimation="pulse"
          animateIcon="both"
        >
          Both Pulse
        </Button>
      </Section>

      <Section title="Continuous Animation (No Hover)">
        <Button
          className={primaryStyles}
          trailingIcon={<ArrowRightIcon />}
          iconAnimation="slideRight"
          animateOnHover={false}
        >
          Always Sliding
        </Button>
        <Button
          className={secondaryStyles}
          leadingIcon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          }
          iconAnimation="spin"
          animateIcon="leading"
          animateOnHover={false}
        >
          Always Spinning
        </Button>
      </Section>

      <Section title="Loading States">
        <Button className={primaryStyles} isLoading>
          Loading
        </Button>
        <Button className={secondaryStyles} isLoading loaderPosition="left">
          Saving
        </Button>
        <Button className={outlineStyles} isLoading loadingText="Submitting...">
          Submit
        </Button>
      </Section>

      <Section title="Interactive Loading">
        <Button
          className={primaryStyles}
          isLoading={loading}
          loadingText="Processing..."
          onClick={simulateLoading}
        >
          Click to Load
        </Button>
      </Section>

      <Section title="Disabled">
        <Button className={primaryStyles} disabled>
          Disabled
        </Button>
        <Button className={secondaryStyles} disabled>
          Disabled
        </Button>
      </Section>

      <Section title="Full Width">
        <div className="w-full">
          <Button className={primaryStyles} fullWidth>
            Full Width Button
          </Button>
        </div>
      </Section>

      <Section title="Custom Loader Size">
        <Button className={primaryStyles} isLoading loaderSize={12}>
          Small Loader
        </Button>
        <Button className={primaryStyles} isLoading loaderSize={20}>
          Large Loader
        </Button>
      </Section>

      <Section title="As Link (asChild)">
        <Button className={primaryStyles} asChild>
          <a href="https://example.com" target="_blank" rel="noreferrer">
            Link as Button
          </a>
        </Button>
      </Section>

      <Section title="With Tooltip">
        <Button className={primaryStyles} tooltip="Click to save your changes">
          Save
        </Button>
        <Button
          className={secondaryStyles}
          tooltip="This action cannot be undone"
          tooltipProps={{ side: "bottom" }}
        >
          Delete
        </Button>
        <Button
          className={outlineStyles}
          tooltip="Copy to clipboard"
          tooltipProps={{ side: "right", delayDuration: 100 }}
        >
          Copy
        </Button>
        <Button
          className={iconOnlyStyles}
          leadingIcon={<SearchIcon />}
          aria-label="Search"
          tooltip="Search for items"
          tooltipProps={{ side: "bottom", showArrow: false }}
        />
      </Section>

      <Section title="Tooltip with Icons & Animation">
        <Button
          className={primaryStyles}
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
          className={linkStyles}
          trailingIcon={<ArrowRightIcon />}
          iconAnimation="slideRight"
          tooltip="Opens in a new tab"
          tooltipProps={{ side: "top" }}
        >
          External Link
        </Button>
      </Section>

      <Section title="Button Group">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <ButtonGroup className="inline-flex gap-0">
              <Button
                className={`${outlineStyles} rounded-r-none border-r-0 ${activeGroup === "left" ? "bg-blue-200!" : ""}`}
                onClick={() => handleGroupClick("left")}
              >
                Left
              </Button>
              <Button
                className={`${outlineStyles} rounded-none border-r-0 ${activeGroup === "middle" ? "bg-blue-200!" : ""}`}
                onClick={() => handleGroupClick("middle")}
              >
                Middle
              </Button>
              <Button
                className={`${outlineStyles} rounded-l-none ${activeGroup === "right" ? "bg-blue-200!" : ""}`}
                onClick={() => handleGroupClick("right")}
              >
                Right
              </Button>
            </ButtonGroup>

            <ButtonGroup className="inline-flex gap-2">
              <Button
                className={`${primaryStyles} ${activeGroup === "save" ? "ring-2 ring-blue-300" : ""}`}
                onClick={() => handleGroupClick("save")}
              >
                Save
              </Button>
              <Button
                className={`${secondaryStyles} ${activeGroup === "cancel" ? "ring-2 ring-gray-400" : ""}`}
                onClick={() => handleGroupClick("cancel")}
              >
                Cancel
              </Button>
            </ButtonGroup>
          </div>
          {activeGroup && (
            <p className="text-sm text-green-600">
              Clicked: <strong>{activeGroup}</strong>
            </p>
          )}
        </div>
      </Section>

      <Section title="Button Group (Vertical)">
        <ButtonGroup className="flex flex-col gap-2">
          <Button
            className={`${outlineStyles} ${activeGroup === "opt1" ? "bg-blue-200!" : ""}`}
            onClick={() => handleGroupClick("opt1")}
          >
            Option 1
          </Button>
          <Button
            className={`${outlineStyles} ${activeGroup === "opt2" ? "bg-blue-200!" : ""}`}
            onClick={() => handleGroupClick("opt2")}
          >
            Option 2
          </Button>
          <Button
            className={`${outlineStyles} ${activeGroup === "opt3" ? "bg-blue-200!" : ""}`}
            onClick={() => handleGroupClick("opt3")}
          >
            Option 3
          </Button>
        </ButtonGroup>
      </Section>

      <Section title="Button Props">
        <div className="overflow-x-auto w-full">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Prop
                </th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Type
                </th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Default
                </th>
                <th className="text-left py-2 font-medium text-gray-900">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">as</td>
                <td className="py-2 pr-4 text-gray-600">
                  "button" | "a" | "span"
                </td>
                <td className="py-2 pr-4 text-gray-500">"button"</td>
                <td className="py-2 text-gray-600">
                  Element type to render as (button, link, or text)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">href</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  URL for link buttons (required when as="a")
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">children</td>
                <td className="py-2 pr-4 text-gray-600">ReactNode</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">Button content</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  leadingIcon
                </td>
                <td className="py-2 pr-4 text-gray-600">ReactNode</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  Icon to display before the content
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  trailingIcon
                </td>
                <td className="py-2 pr-4 text-gray-600">ReactNode</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  Icon to display after the content
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  iconAnimation
                </td>
                <td className="py-2 pr-4 text-gray-600">
                  "none" | "slideRight" | "slideLeft" | "slideUp" | "slideDown"
                  | "bounce" | "pulse" | "spin"
                </td>
                <td className="py-2 pr-4 text-gray-500">"none"</td>
                <td className="py-2 text-gray-600">
                  Animation effect for icons
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  animateOnHover
                </td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">true</td>
                <td className="py-2 text-gray-600">
                  Whether to animate icons only on hover
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  animateIcon
                </td>
                <td className="py-2 pr-4 text-gray-600">
                  "leading" | "trailing" | "both"
                </td>
                <td className="py-2 pr-4 text-gray-500">"trailing"</td>
                <td className="py-2 text-gray-600">Which icon to animate</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">isLoading</td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">false</td>
                <td className="py-2 text-gray-600">
                  Whether the button is in loading state
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  loadingText
                </td>
                <td className="py-2 pr-4 text-gray-600">ReactNode</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  Text to display while loading
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  loaderPosition
                </td>
                <td className="py-2 pr-4 text-gray-600">"left" | "right"</td>
                <td className="py-2 pr-4 text-gray-500">"right"</td>
                <td className="py-2 text-gray-600">
                  Position of the loader spinner
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  loaderSize
                </td>
                <td className="py-2 pr-4 text-gray-600">number</td>
                <td className="py-2 pr-4 text-gray-500">16</td>
                <td className="py-2 text-gray-600">
                  Size of the loader spinner in pixels
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">loader</td>
                <td className="py-2 pr-4 text-gray-600">ReactNode</td>
                <td className="py-2 pr-4 text-gray-500">CircularLoader</td>
                <td className="py-2 text-gray-600">Custom loader component</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">fullWidth</td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">false</td>
                <td className="py-2 text-gray-600">
                  Whether the button takes full width
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">asChild</td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">false</td>
                <td className="py-2 text-gray-600">
                  Render as child element (polymorphic pattern)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  contentClassName
                </td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">
                  "inline-flex items-center..."
                </td>
                <td className="py-2 text-gray-600">
                  CSS class for the inner content wrapper
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">disabled</td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">false</td>
                <td className="py-2 text-gray-600">
                  Whether the button is disabled (only for as="button")
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">type</td>
                <td className="py-2 pr-4 text-gray-600">
                  "button" | "submit" | "reset"
                </td>
                <td className="py-2 pr-4 text-gray-500">"button"</td>
                <td className="py-2 text-gray-600">
                  HTML button type attribute (only for as="button")
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">tooltip</td>
                <td className="py-2 pr-4 text-gray-600">ReactNode</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  Tooltip content - wraps button with tooltip when provided
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  tooltipProps
                </td>
                <td className="py-2 pr-4 text-gray-600">ButtonTooltipProps</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  Additional tooltip configuration (side, align, delay, etc.)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="ButtonTooltipProps">
        <div className="overflow-x-auto w-full">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Prop
                </th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Type
                </th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Default
                </th>
                <th className="text-left py-2 font-medium text-gray-900">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">side</td>
                <td className="py-2 pr-4 text-gray-600">
                  "top" | "right" | "bottom" | "left"
                </td>
                <td className="py-2 pr-4 text-gray-500">"top"</td>
                <td className="py-2 text-gray-600">
                  Tooltip position relative to button
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">align</td>
                <td className="py-2 pr-4 text-gray-600">
                  "start" | "center" | "end"
                </td>
                <td className="py-2 pr-4 text-gray-500">"center"</td>
                <td className="py-2 text-gray-600">Tooltip alignment</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  sideOffset
                </td>
                <td className="py-2 pr-4 text-gray-600">number</td>
                <td className="py-2 pr-4 text-gray-500">6</td>
                <td className="py-2 text-gray-600">
                  Offset from the button in pixels
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">maxWidth</td>
                <td className="py-2 pr-4 text-gray-600">string | number</td>
                <td className="py-2 pr-4 text-gray-500">300</td>
                <td className="py-2 text-gray-600">Max width of tooltip</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  delayDuration
                </td>
                <td className="py-2 pr-4 text-gray-600">number</td>
                <td className="py-2 pr-4 text-gray-500">200</td>
                <td className="py-2 text-gray-600">
                  Delay before showing tooltip (ms)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">showArrow</td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">true</td>
                <td className="py-2 text-gray-600">Show arrow on tooltip</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  contentClassName
                </td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  Custom CSS class for tooltip content
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  contentStyle
                </td>
                <td className="py-2 pr-4 text-gray-600">CSSProperties</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  Custom inline styles for tooltip content
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="ButtonGroup Props">
        <div className="overflow-x-auto w-full">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Prop
                </th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Type
                </th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Default
                </th>
                <th className="text-left py-2 font-medium text-gray-900">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">children</td>
                <td className="py-2 pr-4 text-gray-600">ReactNode</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  Button components to render in the group (required)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Styling Props">
        <div className="overflow-x-auto w-full">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Prop
                </th>
                <th className="text-left py-2 font-medium text-gray-900">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">className</td>
                <td className="py-2 text-gray-600">
                  CSS class for the button element (Button) or group container
                  (ButtonGroup)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>
    </>
  );
};

export default ButtonDemo;
