import { useState } from "react";
import { Tooltip } from "../../components/Tooltip";
import { Button } from "../../components/Button";
import { Section, ComponentHeader } from "./components";

const TooltipDemo = () => {
  const [controlled, setControlled] = useState(false);

  const buttonStyles =
    "cursor-pointer px-4 py-2 rounded-lg font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700";
  const secondaryStyles =
    "cursor-pointer px-4 py-2 rounded-lg font-medium transition-colors bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-200";
  const outlineStyles =
    "cursor-pointer px-4 py-2 rounded-lg font-medium transition-colors border border-gray-300 text-gray-700 hover:bg-gray-50";

  return (
    <>
      <ComponentHeader
        title="Tooltip"
        description="A flexible tooltip component that supports both regular tooltips and auto-truncation with tooltip on overflow."
      />

      <Section title="Basic Tooltip">
        <Tooltip content="This is a basic tooltip">
          <Button className={buttonStyles}>Hover me</Button>
        </Tooltip>
        <Tooltip content="Another tooltip with more content that wraps nicely when the text is long">
          <Button className={secondaryStyles}>More content</Button>
        </Tooltip>
      </Section>

      <Section title="Tooltip Positions">
        <Tooltip content="Top tooltip" side="top">
          <Button className={outlineStyles}>Top</Button>
        </Tooltip>
        <Tooltip content="Right tooltip" side="right">
          <Button className={outlineStyles}>Right</Button>
        </Tooltip>
        <Tooltip content="Bottom tooltip" side="bottom">
          <Button className={outlineStyles}>Bottom</Button>
        </Tooltip>
        <Tooltip content="Left tooltip" side="left">
          <Button className={outlineStyles}>Left</Button>
        </Tooltip>
      </Section>

      <Section title="Tooltip Alignment">
        <Tooltip content="Start aligned tooltip" side="bottom" align="start">
          <Button className={outlineStyles}>Start</Button>
        </Tooltip>
        <Tooltip content="Center aligned tooltip" side="bottom" align="center">
          <Button className={outlineStyles}>Center</Button>
        </Tooltip>
        <Tooltip content="End aligned tooltip" side="bottom" align="end">
          <Button className={outlineStyles}>End</Button>
        </Tooltip>
      </Section>

      <Section title="Without Arrow">
        <Tooltip content="No arrow on this tooltip" showArrow={false}>
          <Button className={outlineStyles}>No Arrow</Button>
        </Tooltip>
        <Tooltip content="Arrow visible on this tooltip" showArrow={true}>
          <Button className={outlineStyles}>With Arrow</Button>
        </Tooltip>
      </Section>

      <Section title="Custom Delay">
        <Tooltip content="Instant appearance (0ms)" delayDuration={0}>
          <Button className={outlineStyles}>Instant</Button>
        </Tooltip>
        <Tooltip content="Fast appearance (100ms)" delayDuration={100}>
          <Button className={outlineStyles}>Fast (100ms)</Button>
        </Tooltip>
        <Tooltip content="Slow appearance (1000ms)" delayDuration={1000}>
          <Button className={outlineStyles}>Slow (1s)</Button>
        </Tooltip>
      </Section>

      <Section title="Controlled">
        <Tooltip
          content="This tooltip is controlled programmatically"
          open={controlled}
          onOpenChange={setControlled}
        >
          <Button className={buttonStyles}>Controlled</Button>
        </Tooltip>
        <Button
          className={secondaryStyles}
          onClick={() => setControlled(!controlled)}
        >
          Toggle: {controlled ? "Open" : "Closed"}
        </Button>
      </Section>

      <Section title="Disabled">
        <Tooltip content="This won't show" disabled>
          <Button className={outlineStyles}>Disabled Tooltip</Button>
        </Tooltip>
        <Tooltip content="This tooltip is enabled" disabled={false}>
          <Button className={outlineStyles}>Enabled Tooltip</Button>
        </Tooltip>
      </Section>

      <Section title="Custom Max Width">
        <Tooltip
          content="This is a tooltip with a very narrow max width that will wrap text quickly"
          maxWidth={150}
        >
          <Button className={outlineStyles}>Narrow (150px)</Button>
        </Tooltip>
        <Tooltip
          content="This tooltip has a wider max width so more content can fit on a single line without wrapping"
          maxWidth={400}
        >
          <Button className={outlineStyles}>Wide (400px)</Button>
        </Tooltip>
      </Section>

      <Section title="Rich HTML Content">
        <Tooltip
          content={
            <div className="space-y-2">
              <div className="font-semibold text-gray-900 dark:text-white">
                Pro Tip
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Tooltips can contain <strong>rich HTML</strong> content
                including{" "}
                <span className="text-blue-600 dark:text-blue-400">
                  colored text
                </span>
                , <em>italics</em>, and more.
              </p>
            </div>
          }
          maxWidth={280}
        >
          <Button className={buttonStyles}>Rich Content</Button>
        </Tooltip>
        <Tooltip
          content={
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span className="font-medium">Online</span>
              </div>
              <p className="text-gray-500 dark:text-gray-600 text-xs">
                Last seen just now
              </p>
            </div>
          }
        >
          <Button className={secondaryStyles}>Status Tooltip</Button>
        </Tooltip>
      </Section>

      <Section title="Custom Styled Tooltips">
        <Tooltip
          content="Dark theme tooltip"
          contentClassName="z-50 rounded-lg bg-gray-900 shadow-xl px-3 py-2 text-sm text-white"
          arrowClassName="fill-gray-900"
        >
          <Button className={outlineStyles}>Dark</Button>
        </Tooltip>
        <Tooltip
          content="Success styled tooltip"
          contentClassName="z-50 rounded-lg bg-green-600 shadow-lg px-3 py-2 text-sm text-white font-medium"
          arrowClassName="fill-green-600"
        >
          <Button className={outlineStyles}>Success</Button>
        </Tooltip>
        <Tooltip
          content="Warning styled tooltip"
          contentClassName="z-50 rounded-lg bg-amber-500 shadow-lg px-3 py-2 text-sm text-white font-medium"
          arrowClassName="fill-amber-500"
        >
          <Button className={outlineStyles}>Warning</Button>
        </Tooltip>
        <Tooltip
          content="Error styled tooltip"
          contentClassName="z-50 rounded-lg bg-red-600 shadow-lg px-3 py-2 text-sm text-white font-medium"
          arrowClassName="fill-red-600"
        >
          <Button className={outlineStyles}>Error</Button>
        </Tooltip>
      </Section>

      <Section title="Shadow Presets">
        <Tooltip content="No shadow" shadow="none">
          <Button className={outlineStyles}>None</Button>
        </Tooltip>
        <Tooltip content="Small shadow" shadow="sm">
          <Button className={outlineStyles}>Small</Button>
        </Tooltip>
        <Tooltip content="Medium shadow" shadow="md">
          <Button className={outlineStyles}>Medium</Button>
        </Tooltip>
        <Tooltip content="Large shadow (default)" shadow="lg">
          <Button className={outlineStyles}>Large</Button>
        </Tooltip>
        <Tooltip content="Extra large shadow" shadow="xl">
          <Button className={outlineStyles}>XL</Button>
        </Tooltip>
        <Tooltip content="2XL shadow" shadow="2xl">
          <Button className={outlineStyles}>2XL</Button>
        </Tooltip>
      </Section>

      <Section title="Custom Shadows">
        <Tooltip
          content="Custom blue glow shadow"
          shadow="0 4px 20px rgba(59, 130, 246, 0.5)"
        >
          <Button className={buttonStyles}>Blue Glow</Button>
        </Tooltip>
        <Tooltip
          content="Custom purple glow shadow"
          shadow="0 4px 20px rgba(147, 51, 234, 0.5)"
        >
          <Button className={secondaryStyles}>Purple Glow</Button>
        </Tooltip>
        <Tooltip
          content="Soft elevated shadow"
          shadow="0 10px 40px -10px rgba(0, 0, 0, 0.2)"
        >
          <Button className={outlineStyles}>Soft Elevated</Button>
        </Tooltip>
        <Tooltip
          content="Sharp drop shadow"
          shadow="4px 4px 0px rgba(0, 0, 0, 0.1)"
        >
          <Button className={outlineStyles}>Sharp Drop</Button>
        </Tooltip>
      </Section>

      <Section title="Gradient Backgrounds">
        <Tooltip
          content="Purple gradient with arrow"
          contentClassName="z-50 rounded-lg shadow-xl px-4 py-2.5 text-sm text-white font-medium"
          contentStyle={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          }}
          arrowColor="#764ba2"
        >
          <Button className={buttonStyles}>Purple Gradient</Button>
        </Tooltip>
        <Tooltip
          content="Ocean breeze gradient"
          contentClassName="z-50 rounded-lg shadow-xl px-4 py-2.5 text-sm text-white font-medium"
          contentStyle={{
            background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
          }}
          arrowColor="#38ef7d"
        >
          <Button className={secondaryStyles}>Green Gradient</Button>
        </Tooltip>
        <Tooltip
          content="Sunset gradient tooltip"
          contentClassName="z-50 rounded-lg shadow-xl px-4 py-2.5 text-sm text-white font-medium"
          contentStyle={{
            background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
          }}
          arrowColor="#f5576c"
        >
          <Button className={outlineStyles}>Pink Gradient</Button>
        </Tooltip>
        <Tooltip
          content="Without arrow"
          contentClassName="z-50 rounded-lg shadow-xl px-4 py-2.5 text-sm text-white font-medium"
          contentStyle={{
            background: "linear-gradient(135deg, #0c3483 0%, #a2b6df 100%)",
          }}
          showArrow={false}
        >
          <Button className={outlineStyles}>No Arrow</Button>
        </Tooltip>
      </Section>

      <Section title="Truncated Text (Auto Tooltip)">
        <div className="flex flex-col gap-4 w-full">
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
            <p className="text-sm text-gray-500 mb-3">
              Tooltip only appears when text is truncated:
            </p>
            <div className="w-[220px] bg-white border border-gray-200 p-3 rounded-lg shadow-sm">
              <Tooltip
                truncate
                truncateWidth="max-w-[196px]"
                triggerClassName="text-sm font-medium text-gray-900"
              >
                This is a very long text that will be truncated and show tooltip
                on hover
              </Tooltip>
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
            <p className="text-sm text-gray-500 mb-3">
              Short text - no tooltip needed:
            </p>
            <div className="w-[220px] bg-white border border-gray-200 p-3 rounded-lg shadow-sm">
              <Tooltip
                truncate
                truncateWidth="max-w-[196px]"
                triggerClassName="text-sm font-medium text-gray-900"
              >
                Short text
              </Tooltip>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Truncated Text in Table Layout">
        <div className="w-full bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-3 gap-px bg-gray-200">
            <div className="bg-gray-50 px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Title
            </div>
            <div className="bg-gray-50 px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Description
            </div>
            <div className="bg-gray-50 px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Author
            </div>
          </div>
          <div className="grid grid-cols-3 gap-px bg-gray-200">
            <div className="bg-white px-4 py-3">
              <Tooltip
                truncate
                truncateWidth="max-w-[150px]"
                triggerClassName="text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer hover:underline"
              >
                Short Title
              </Tooltip>
            </div>
            <div className="bg-white px-4 py-3">
              <Tooltip
                truncate
                truncateWidth="max-w-[150px]"
                triggerClassName="text-sm text-gray-600"
              >
                Brief description
              </Tooltip>
            </div>
            <div className="bg-white px-4 py-3">
              <Tooltip
                truncate
                truncateWidth="max-w-[150px]"
                triggerClassName="text-sm text-gray-600"
              >
                John Doe
              </Tooltip>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-px bg-gray-200">
            <div className="bg-white px-4 py-3">
              <Tooltip
                truncate
                truncateWidth="max-w-[150px]"
                triggerClassName="text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer hover:underline"
              >
                This is a very long title that should truncate nicely
              </Tooltip>
            </div>
            <div className="bg-white px-4 py-3">
              <Tooltip
                truncate
                truncateWidth="max-w-[150px]"
                triggerClassName="text-sm text-gray-600"
              >
                A much longer description that definitely won't fit in the cell
              </Tooltip>
            </div>
            <div className="bg-white px-4 py-3">
              <Tooltip
                truncate
                truncateWidth="max-w-[150px]"
                triggerClassName="text-sm text-gray-600"
              >
                Alexander Christopher Williams III
              </Tooltip>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Tooltip Props">
        <div className="overflow-x-auto w-full">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 pr-4 font-semibold text-gray-900">
                  Prop
                </th>
                <th className="text-left py-3 pr-4 font-semibold text-gray-900">
                  Type
                </th>
                <th className="text-left py-3 pr-4 font-semibold text-gray-900">
                  Default
                </th>
                <th className="text-left py-3 font-semibold text-gray-900">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-3 pr-4 font-mono text-blue-600 text-xs">
                  children
                </td>
                <td className="py-3 pr-4 text-gray-600">ReactNode</td>
                <td className="py-3 pr-4 text-gray-600">-</td>
                <td className="py-3 text-gray-600">
                  Trigger element or text content for truncate mode
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-mono text-blue-600 text-xs">
                  content
                </td>
                <td className="py-3 pr-4 text-gray-600">ReactNode</td>
                <td className="py-3 pr-4 text-gray-600">-</td>
                <td className="py-3 text-gray-600">
                  Tooltip content (supports text or HTML)
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-mono text-blue-600 text-xs">
                  truncate
                </td>
                <td className="py-3 pr-4 text-gray-600">boolean</td>
                <td className="py-3 pr-4 text-gray-600">false</td>
                <td className="py-3 text-gray-600">
                  Enable auto-truncation mode
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-mono text-blue-600 text-xs">
                  truncateWidth
                </td>
                <td className="py-3 pr-4 text-gray-600">string</td>
                <td className="py-3 pr-4 text-gray-600">-</td>
                <td className="py-3 text-gray-600">
                  Width class for truncation
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-mono text-blue-600 text-xs">
                  side
                </td>
                <td className="py-3 pr-4 text-gray-600">
                  "top" | "right" | "bottom" | "left"
                </td>
                <td className="py-3 pr-4 text-gray-600">"top"</td>
                <td className="py-3 text-gray-600">
                  Preferred side for tooltip
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-mono text-blue-600 text-xs">
                  sideOffset
                </td>
                <td className="py-3 pr-4 text-gray-600">number</td>
                <td className="py-3 pr-4 text-gray-600">6</td>
                <td className="py-3 text-gray-600">
                  Distance from the trigger element (in pixels)
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-mono text-blue-600 text-xs">
                  align
                </td>
                <td className="py-3 pr-4 text-gray-600">
                  "start" | "center" | "end"
                </td>
                <td className="py-3 pr-4 text-gray-600">"center"</td>
                <td className="py-3 text-gray-600">Alignment of tooltip</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-mono text-blue-600 text-xs">
                  alignOffset
                </td>
                <td className="py-3 pr-4 text-gray-600">number</td>
                <td className="py-3 pr-4 text-gray-600">0</td>
                <td className="py-3 text-gray-600">
                  Offset from alignment edge (in pixels)
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-mono text-blue-600 text-xs">
                  maxWidth
                </td>
                <td className="py-3 pr-4 text-gray-600">string | number</td>
                <td className="py-3 pr-4 text-gray-600">300</td>
                <td className="py-3 text-gray-600">Max width of tooltip</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-mono text-blue-600 text-xs">
                  delayDuration
                </td>
                <td className="py-3 pr-4 text-gray-600">number</td>
                <td className="py-3 pr-4 text-gray-600">200</td>
                <td className="py-3 text-gray-600">
                  Delay before showing (ms)
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-mono text-blue-600 text-xs">
                  disableHoverableContent
                </td>
                <td className="py-3 pr-4 text-gray-600">boolean</td>
                <td className="py-3 pr-4 text-gray-600">false</td>
                <td className="py-3 text-gray-600">
                  Disable hovering over tooltip content
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-mono text-blue-600 text-xs">
                  shadow
                </td>
                <td className="py-3 pr-4 text-gray-600">preset | string</td>
                <td className="py-3 pr-4 text-gray-600">"lg"</td>
                <td className="py-3 text-gray-600">
                  Preset ("none" | "sm" | "md" | "lg" | "xl" | "2xl") or custom
                  CSS box-shadow
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-mono text-blue-600 text-xs">
                  showArrow
                </td>
                <td className="py-3 pr-4 text-gray-600">boolean</td>
                <td className="py-3 pr-4 text-gray-600">true</td>
                <td className="py-3 text-gray-600">Show tooltip arrow</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-mono text-blue-600 text-xs">
                  arrowColor
                </td>
                <td className="py-3 pr-4 text-gray-600">string</td>
                <td className="py-3 pr-4 text-gray-600">-</td>
                <td className="py-3 text-gray-600">
                  Arrow fill color (useful for gradients)
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-mono text-blue-600 text-xs">
                  disabled
                </td>
                <td className="py-3 pr-4 text-gray-600">boolean</td>
                <td className="py-3 pr-4 text-gray-600">false</td>
                <td className="py-3 text-gray-600">Disable the tooltip</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-mono text-blue-600 text-xs">
                  open
                </td>
                <td className="py-3 pr-4 text-gray-600">boolean</td>
                <td className="py-3 pr-4 text-gray-600">-</td>
                <td className="py-3 text-gray-600">Controlled open state</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-mono text-blue-600 text-xs">
                  defaultOpen
                </td>
                <td className="py-3 pr-4 text-gray-600">boolean</td>
                <td className="py-3 pr-4 text-gray-600">false</td>
                <td className="py-3 text-gray-600">
                  Initial open state (uncontrolled)
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-mono text-blue-600 text-xs">
                  onOpenChange
                </td>
                <td className="py-3 pr-4 text-gray-600">
                  (open: boolean) =&gt; void
                </td>
                <td className="py-3 pr-4 text-gray-600">-</td>
                <td className="py-3 text-gray-600">
                  Callback when open state changes
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
                <th className="text-left py-3 pr-4 font-semibold text-gray-900">
                  Prop
                </th>
                <th className="text-left py-3 font-semibold text-gray-900">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-3 pr-4 font-mono text-blue-600 text-xs">
                  contentClassName
                </td>
                <td className="py-3 text-gray-600">
                  Custom CSS classes for tooltip content container
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-mono text-blue-600 text-xs">
                  contentStyle
                </td>
                <td className="py-3 text-gray-600">
                  Inline styles for tooltip content (useful for gradients)
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-mono text-blue-600 text-xs">
                  arrowClassName
                </td>
                <td className="py-3 text-gray-600">
                  Custom CSS classes for the arrow element
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-mono text-blue-600 text-xs">
                  arrowStyle
                </td>
                <td className="py-3 text-gray-600">
                  Inline styles for the arrow element
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-mono text-blue-600 text-xs">
                  triggerClassName
                </td>
                <td className="py-3 text-gray-600">
                  Custom CSS classes for the trigger element (in truncate mode)
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-mono text-blue-600 text-xs">
                  className
                </td>
                <td className="py-3 text-gray-600">
                  Custom CSS classes for the outer wrapper (in truncate mode)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>
    </>
  );
};

export default TooltipDemo;
