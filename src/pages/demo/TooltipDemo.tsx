import { useState } from "react";
import { Section, CodeBlock, DemoWrapper } from "./components";
import { Tooltip } from "../../components/Tooltip";
import { Button } from "../../components/Button";
import { useTheme } from "./ThemeContext";


const TooltipDemo = () => {
  const { isDarkMode } = useTheme();
  const [controlled, setControlled] = useState(false);

  const getButtonStyles = () => ({
    primary: `cursor-pointer px-4 py-2 rounded-lg font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 ${
      isDarkMode
        ? "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-400 focus-visible:ring-offset-gray-900"
        : "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500"
    }`,
    secondary: `cursor-pointer px-4 py-2 rounded-lg font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 ${
      isDarkMode
        ? "bg-gray-600 text-white hover:bg-gray-500 focus-visible:ring-gray-400 focus-visible:ring-offset-gray-900"
        : "bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-200 focus-visible:ring-gray-500"
    }`,
    outline: `cursor-pointer px-4 py-2 rounded-lg font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 ${
      isDarkMode
        ? "border border-gray-500 text-gray-200 hover:bg-gray-700 focus-visible:ring-gray-400 focus-visible:ring-offset-gray-900"
        : "border border-gray-300 text-gray-700 hover:bg-gray-50 focus-visible:ring-gray-500"
    }`,
  });

  const styles = getButtonStyles();

  const contentClassNameDark = "rounded-lg bg-gray-900 shadow-xl px-3 py-2 text-sm text-white";
  const contentClassNameSuccess = "rounded-lg bg-green-600 shadow-lg px-3 py-2 text-sm text-white font-medium";
  const contentClassNameWarning = "rounded-lg bg-amber-500 shadow-lg px-3 py-2 text-sm text-white font-medium";
  const contentClassNameError = "rounded-lg bg-red-600 shadow-lg px-3 py-2 text-sm text-white font-medium";
  const contentClassNameGradient = "rounded-lg shadow-xl px-4 py-2.5 text-sm text-white font-medium";

  const gradientPurple = { background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" };
  const gradientGreen = { background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)" };
  const gradientPink = { background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" };
  const gradientBlue = { background: "linear-gradient(135deg, #0c3483 0%, #a2b6df 100%)" };

  const shadowBlueGlow = "0 4px 20px rgba(59, 130, 246, 0.5)";
  const shadowPurpleGlow = "0 4px 20px rgba(147, 51, 234, 0.5)";
  const shadowSoftElevated = "0 10px 40px -10px rgba(0, 0, 0, 0.2)";
  const shadowSharpDrop = "4px 4px 0px rgba(0, 0, 0, 0.1)";

  const richContentProTip = (
    <div className="space-y-2">
      <div className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Pro Tip</div>
      <p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
        Tooltips can contain <strong>rich HTML</strong> content including{" "}
        <span className={isDarkMode ? "text-blue-400" : "text-blue-600"}>colored text</span>,{" "}
        <em>italics</em>, and more.
      </p>
    </div>
  );

  const richContentStatus = (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-green-500"></span>
        <span className="font-medium">Online</span>
      </div>
      <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Last seen just now</p>
    </div>
  );

  return (
    <div className="space-y-16">
      <header>
        <h1 className={`text-3xl font-bold mb-3 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          Tooltip
        </h1>
        <p className={`text-lg ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
          A flexible, accessible tooltip component that supports positioning, custom styling,
          rich HTML content, and auto-truncation with tooltip on overflow.
        </p>

        <div className="mt-6">
          <h3 className={`text-sm font-semibold mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
            Installation
          </h3>
          <CodeBlock
            isDarkMode={isDarkMode}
            code={`import { Tooltip } from "@kern-ui/tooltip";

<Tooltip content="Tooltip text">
  <button>Hover me</button>
</Tooltip>

<Tooltip truncate truncateWidth="max-w-[200px]">
  This long text will truncate and show tooltip on hover
</Tooltip>`}
          />
        </div>
      </header>

      <div className="space-y-12">
        <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          Examples
        </h2>

        <Section
          title="Basic Tooltip"
          description="Wrap any element with Tooltip and provide content to display on hover."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Tooltip content="This is a basic tooltip">
              <Button className={styles.primary}>Hover me</Button>
            </Tooltip>
            <Tooltip content="Another tooltip with more content that wraps nicely when the text is long">
              <Button className={styles.secondary}>More content</Button>
            </Tooltip>
          </DemoWrapper>
        </Section>

        <Section
          title="Positions"
          description="Use the side prop to control tooltip placement: top, right, bottom, or left."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Tooltip content="Top tooltip" side="top">
              <Button className={styles.outline}>Top</Button>
            </Tooltip>
            <Tooltip content="Right tooltip" side="right">
              <Button className={styles.outline}>Right</Button>
            </Tooltip>
            <Tooltip content="Bottom tooltip" side="bottom">
              <Button className={styles.outline}>Bottom</Button>
            </Tooltip>
            <Tooltip content="Left tooltip" side="left">
              <Button className={styles.outline}>Left</Button>
            </Tooltip>
          </DemoWrapper>
        </Section>

        <Section
          title="Alignment"
          description="Use align prop to control tooltip alignment along the side axis: start, center, or end."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Tooltip content="Start aligned tooltip" side="bottom" align="start">
              <Button className={styles.outline}>Start</Button>
            </Tooltip>
            <Tooltip content="Center aligned tooltip" side="bottom" align="center">
              <Button className={styles.outline}>Center</Button>
            </Tooltip>
            <Tooltip content="End aligned tooltip" side="bottom" align="end">
              <Button className={styles.outline}>End</Button>
            </Tooltip>
          </DemoWrapper>
        </Section>

        <Section
          title="Offsets"
          description="Use sideOffset and alignOffset to fine-tune tooltip positioning."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Tooltip content="Default offset (6px)" side="top">
              <Button className={styles.outline}>Default</Button>
            </Tooltip>
            <Tooltip content="Large offset (16px)" side="top" sideOffset={16}>
              <Button className={styles.outline}>Large Offset</Button>
            </Tooltip>
            <Tooltip content="No offset (0px)" side="top" sideOffset={0}>
              <Button className={styles.outline}>No Offset</Button>
            </Tooltip>
            <Tooltip content="Align offset (20px)" side="bottom" align="start" alignOffset={20}>
              <Button className={styles.outline}>Align Offset</Button>
            </Tooltip>
          </DemoWrapper>
        </Section>

        <Section
          title="Arrow"
          description="Toggle the arrow visibility with showArrow prop."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Tooltip content="Arrow visible on this tooltip" showArrow={true}>
              <Button className={styles.outline}>With Arrow</Button>
            </Tooltip>
            <Tooltip content="No arrow on this tooltip" showArrow={false}>
              <Button className={styles.outline}>No Arrow</Button>
            </Tooltip>
          </DemoWrapper>
        </Section>

        <Section
          title="Delay Duration"
          description="Control how long to wait before showing the tooltip with delayDuration (in milliseconds)."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Tooltip content="Instant appearance (0ms)" delayDuration={0}>
              <Button className={styles.outline}>Instant</Button>
            </Tooltip>
            <Tooltip content="Fast appearance (100ms)" delayDuration={100}>
              <Button className={styles.outline}>Fast (100ms)</Button>
            </Tooltip>
            <Tooltip content="Default (200ms)" delayDuration={200}>
              <Button className={styles.outline}>Default (200ms)</Button>
            </Tooltip>
            <Tooltip content="Slow appearance (1000ms)" delayDuration={1000}>
              <Button className={styles.outline}>Slow (1s)</Button>
            </Tooltip>
          </DemoWrapper>
        </Section>

        <Section
          title="Max Width"
          description="Control tooltip width with maxWidth prop (number for pixels or string for CSS value)."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Tooltip
              content="This is a tooltip with a very narrow max width that will wrap text quickly"
              maxWidth={150}
            >
              <Button className={styles.outline}>Narrow (150px)</Button>
            </Tooltip>
            <Tooltip content="Default max width (300px)" maxWidth={300}>
              <Button className={styles.outline}>Default (300px)</Button>
            </Tooltip>
            <Tooltip
              content="This tooltip has a wider max width so more content can fit on a single line without wrapping"
              maxWidth={400}
            >
              <Button className={styles.outline}>Wide (400px)</Button>
            </Tooltip>
          </DemoWrapper>
        </Section>

        <Section
          title="Text Wrapping (Word Wrap)"
          description="Control how text wraps using wordWrap prop: 'break-word' (default), 'normal', or 'nowrap'."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Tooltip
              content="This is a very long tooltip with superlongwordthatwillbreakifneeded to demonstrate break-word behavior"
              maxWidth={200}
              wordWrap="break-word"
            >
              <Button className={styles.outline}>Break Word (default)</Button>
            </Tooltip>
            <Tooltip
              content="This is a tooltip with normal word wrapping that respects word boundaries"
              maxWidth={200}
              wordWrap="normal"
            >
              <Button className={styles.outline}>Normal Wrap</Button>
            </Tooltip>
            <Tooltip
              content="This tooltip content will not wrap and may overflow"
              maxWidth={400}
              wordWrap="nowrap"
            >
              <Button className={styles.outline}>No Wrap</Button>
            </Tooltip>
          </DemoWrapper>
          <div className={`mt-4 p-4 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-50"}`}>
            <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
              <strong>break-word</strong>: Long words will break if they exceed maxWidth (default behavior)
            </p>
            <p className={`text-sm mt-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
              <strong>normal</strong>: Words won't break mid-word, wraps at word boundaries only
            </p>
            <p className={`text-sm mt-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
              <strong>nowrap</strong>: Content stays on one line, useful for short messages
            </p>
          </div>
        </Section>

        <Section
          title="Default Open"
          description="Use defaultOpen to show tooltip on initial render (uncontrolled mode)."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Tooltip content="I'm open by default!" defaultOpen={true}>
              <Button className={styles.primary}>Default Open</Button>
            </Tooltip>
            <Tooltip content="I start closed" defaultOpen={false}>
              <Button className={styles.secondary}>Default Closed</Button>
            </Tooltip>
          </DemoWrapper>
        </Section>

        <Section
          title="Controlled State"
          description="Use open and onOpenChange props for controlled tooltip state."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Tooltip
              content="This tooltip is controlled programmatically"
              open={controlled}
              onOpenChange={setControlled}
            >
              <Button className={styles.primary}>Controlled</Button>
            </Tooltip>
            <Button className={styles.secondary} onClick={() => setControlled(!controlled)}>
              Toggle: {controlled ? "Open" : "Closed"}
            </Button>
          </DemoWrapper>
        </Section>

        <Section
          title="asChild Mode"
          description="Use asChild to clone tooltip handlers onto the child element instead of wrapping it in a span. This avoids double tab-stops for interactive elements."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Tooltip content="No wrapper span - handlers cloned onto button" asChild>
              <Button className={styles.primary}>asChild Button</Button>
            </Tooltip>
            <Tooltip content="Default mode wraps in a span">
              <Button className={styles.outline}>Default (wrapped)</Button>
            </Tooltip>
          </DemoWrapper>
          <div className={`mt-4 p-3 rounded-lg ${isDarkMode ? "bg-blue-900/30 border border-blue-800" : "bg-blue-50 border border-blue-200"}`}>
            <p className={`text-sm ${isDarkMode ? "text-blue-200" : "text-blue-800"}`}>
              <strong>When to use:</strong> Use{" "}
              <code className={`px-1 py-0.5 border rounded text-xs font-mono ${isDarkMode ? "bg-gray-800/80 border-gray-600 text-gray-300" : "bg-white border-gray-300 text-gray-700"}`}>
                asChild
              </code>{" "}
              when wrapping interactive elements like buttons or links to avoid an extra tab-stop from the wrapper span.
            </p>
          </div>
        </Section>

        <Section
          title="Disabled"
          description="Use disabled prop to prevent tooltip from showing."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Tooltip content="This won't show" disabled>
              <Button className={styles.outline}>Disabled Tooltip</Button>
            </Tooltip>
            <Tooltip content="This tooltip is enabled" disabled={false}>
              <Button className={styles.outline}>Enabled Tooltip</Button>
            </Tooltip>
          </DemoWrapper>
        </Section>

        <Section
          title="Hoverable Content"
          description="By default, moving mouse to tooltip keeps it open. Use disableHoverableContent to disable."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Tooltip content="Move mouse to tooltip - it stays open" disableHoverableContent={false}>
              <Button className={styles.outline}>Hoverable (default)</Button>
            </Tooltip>
            <Tooltip content="Tooltip closes when leaving trigger" disableHoverableContent={true}>
              <Button className={styles.outline}>Not Hoverable</Button>
            </Tooltip>
          </DemoWrapper>
        </Section>

        <Section
          title="Rich HTML Content"
          description="The content prop accepts ReactNode for rich formatted content."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Tooltip content={richContentProTip} maxWidth={280}>
              <Button className={styles.primary}>Rich Content</Button>
            </Tooltip>
            <Tooltip content={richContentStatus}>
              <Button className={styles.secondary}>Status Tooltip</Button>
            </Tooltip>
          </DemoWrapper>
        </Section>

        <Section
          title="Custom Styling"
          description="Use contentClassName and arrowClassName to customize tooltip appearance."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Tooltip
              content="Dark theme tooltip"
              contentClassName={contentClassNameDark}
              arrowClassName="fill-gray-900"
            >
              <Button className={styles.outline}>Dark</Button>
            </Tooltip>
            <Tooltip
              content="Success styled tooltip"
              contentClassName={contentClassNameSuccess}
              arrowClassName="fill-green-600"
            >
              <Button className={styles.outline}>Success</Button>
            </Tooltip>
            <Tooltip
              content="Warning styled tooltip"
              contentClassName={contentClassNameWarning}
              arrowClassName="fill-amber-500"
            >
              <Button className={styles.outline}>Warning</Button>
            </Tooltip>
            <Tooltip
              content="Error styled tooltip"
              contentClassName={contentClassNameError}
              arrowClassName="fill-red-600"
            >
              <Button className={styles.outline}>Error</Button>
            </Tooltip>
          </DemoWrapper>
        </Section>

        <Section
          title="Shadow Presets"
          description="Use shadow prop with presets: none, sm, md, lg (default), xl, 2xl."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Tooltip content="No shadow" shadow="none">
              <Button className={styles.outline}>None</Button>
            </Tooltip>
            <Tooltip content="Small shadow" shadow="sm">
              <Button className={styles.outline}>Small</Button>
            </Tooltip>
            <Tooltip content="Medium shadow" shadow="md">
              <Button className={styles.outline}>Medium</Button>
            </Tooltip>
            <Tooltip content="Large shadow (default)" shadow="lg">
              <Button className={styles.outline}>Large</Button>
            </Tooltip>
            <Tooltip content="Extra large shadow" shadow="xl">
              <Button className={styles.outline}>XL</Button>
            </Tooltip>
            <Tooltip content="2XL shadow" shadow="2xl">
              <Button className={styles.outline}>2XL</Button>
            </Tooltip>
          </DemoWrapper>
        </Section>

        <Section
          title="Custom Shadows"
          description="Pass a custom CSS box-shadow string to the shadow prop."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Tooltip content="Custom blue glow shadow" shadow={shadowBlueGlow}>
              <Button className={styles.primary}>Blue Glow</Button>
            </Tooltip>
            <Tooltip content="Custom purple glow shadow" shadow={shadowPurpleGlow}>
              <Button className={styles.secondary}>Purple Glow</Button>
            </Tooltip>
            <Tooltip content="Soft elevated shadow" shadow={shadowSoftElevated}>
              <Button className={styles.outline}>Soft Elevated</Button>
            </Tooltip>
            <Tooltip content="Sharp drop shadow" shadow={shadowSharpDrop}>
              <Button className={styles.outline}>Sharp Drop</Button>
            </Tooltip>
          </DemoWrapper>
        </Section>

        <Section
          title="Gradient Backgrounds"
          description="Use contentStyle for gradient backgrounds and arrowColor to match the arrow."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Tooltip
              content="Purple gradient with arrow"
              contentClassName={contentClassNameGradient}
              contentStyle={gradientPurple}
              arrowColor="#764ba2"
            >
              <Button className={styles.primary}>Purple Gradient</Button>
            </Tooltip>
            <Tooltip
              content="Ocean breeze gradient"
              contentClassName={contentClassNameGradient}
              contentStyle={gradientGreen}
              arrowColor="#38ef7d"
            >
              <Button className={styles.secondary}>Green Gradient</Button>
            </Tooltip>
            <Tooltip
              content="Sunset gradient tooltip"
              contentClassName={contentClassNameGradient}
              contentStyle={gradientPink}
              arrowColor="#f5576c"
            >
              <Button className={styles.outline}>Pink Gradient</Button>
            </Tooltip>
            <Tooltip
              content="Without arrow"
              contentClassName={contentClassNameGradient}
              contentStyle={gradientBlue}
              showArrow={false}
            >
              <Button className={styles.outline}>No Arrow</Button>
            </Tooltip>
          </DemoWrapper>
        </Section>

        <Section
          title="Z-Index"
          description="Use zIndex prop to control stacking order (default: 9999)."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Tooltip content="Default z-index (9999)" zIndex={9999}>
              <Button className={styles.outline}>Default</Button>
            </Tooltip>
            <Tooltip content="Lower z-index (100)" zIndex={100}>
              <Button className={styles.outline}>z-index: 100</Button>
            </Tooltip>
            <Tooltip content="Higher z-index (99999)" zIndex={99999}>
              <Button className={styles.outline}>z-index: 99999</Button>
            </Tooltip>
          </DemoWrapper>
        </Section>

        <Section
          title="Truncated Text (Auto Tooltip)"
          description="Use truncate mode to automatically show tooltip only when text overflows."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="flex flex-col gap-4 w-full">
              <div className={`p-4 rounded-xl border ${isDarkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"}`}>
                <p className={`text-sm mb-3 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Tooltip only appears when text is truncated:
                </p>
                <div className={`w-[220px] p-3 rounded-lg shadow-sm border ${isDarkMode ? "bg-gray-800 border-gray-600" : "bg-white border-gray-200"}`}>
                  <Tooltip
                    truncate
                    truncateWidth="max-w-[196px]"
                    triggerClassName={`text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}
                  >
                    This is a very long text that will be truncated and show tooltip on hover
                  </Tooltip>
                </div>
              </div>
              <div className={`p-4 rounded-xl border ${isDarkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"}`}>
                <p className={`text-sm mb-3 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Short text - no tooltip needed:
                </p>
                <div className={`w-[220px] p-3 rounded-lg shadow-sm border ${isDarkMode ? "bg-gray-800 border-gray-600" : "bg-white border-gray-200"}`}>
                  <Tooltip
                    truncate
                    truncateWidth="max-w-[196px]"
                    triggerClassName={`text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}
                  >
                    Short text
                  </Tooltip>
                </div>
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Truncated Text in Table Layout"
          description="Common pattern for tables with long content that needs truncation."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className={`w-full rounded-xl border overflow-hidden ${isDarkMode ? "border-gray-600" : "border-gray-200"}`}>
              <div className={`grid grid-cols-3 gap-px ${isDarkMode ? "bg-gray-600" : "bg-gray-200"}`}>
                <div className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "bg-gray-700 text-gray-400" : "bg-gray-50 text-gray-500"}`}>
                  Title
                </div>
                <div className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "bg-gray-700 text-gray-400" : "bg-gray-50 text-gray-500"}`}>
                  Description
                </div>
                <div className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "bg-gray-700 text-gray-400" : "bg-gray-50 text-gray-500"}`}>
                  Author
                </div>
              </div>
              <div className={`grid grid-cols-3 gap-px ${isDarkMode ? "bg-gray-600" : "bg-gray-200"}`}>
                <div className={`px-4 py-3 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
                  <Tooltip
                    truncate
                    truncateWidth="max-w-[150px]"
                    triggerClassName={`text-sm font-medium cursor-pointer hover:underline ${isDarkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-800"}`}
                  >
                    Short Title
                  </Tooltip>
                </div>
                <div className={`px-4 py-3 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
                  <Tooltip
                    truncate
                    truncateWidth="max-w-[150px]"
                    triggerClassName={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
                  >
                    Brief description
                  </Tooltip>
                </div>
                <div className={`px-4 py-3 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
                  <Tooltip
                    truncate
                    truncateWidth="max-w-[150px]"
                    triggerClassName={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
                  >
                    John Doe
                  </Tooltip>
                </div>
              </div>
              <div className={`grid grid-cols-3 gap-px ${isDarkMode ? "bg-gray-600" : "bg-gray-200"}`}>
                <div className={`px-4 py-3 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
                  <Tooltip
                    truncate
                    truncateWidth="max-w-[150px]"
                    triggerClassName={`text-sm font-medium cursor-pointer hover:underline ${isDarkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-800"}`}
                  >
                    This is a very long title that should truncate nicely
                  </Tooltip>
                </div>
                <div className={`px-4 py-3 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
                  <Tooltip
                    truncate
                    truncateWidth="max-w-[150px]"
                    triggerClassName={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
                  >
                    A much longer description that definitely won't fit in the cell
                  </Tooltip>
                </div>
                <div className={`px-4 py-3 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
                  <Tooltip
                    truncate
                    truncateWidth="max-w-[150px]"
                    triggerClassName={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
                  >
                    Alexander Christopher Williams III
                  </Tooltip>
                </div>
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Data Attributes"
          description="The Tooltip trigger wrapper applies data attributes for CSS-based styling."
          isDarkMode={isDarkMode}
        >
          <CodeBlock
            isDarkMode={isDarkMode}
            code={`aria-describedby="tooltip-id"   // Trigger: when tooltip is open (links trigger to tooltip content)`}
          />
        </Section>
      </div>

      <div className="space-y-8">
        <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          API Reference
        </h2>

        <div>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
            Tooltip Props
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
                    Trigger element or text content for truncate mode
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">content</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>ReactNode</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>-</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Tooltip content (supports text or HTML)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">side</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    "top" | "right" | "bottom" | "left"
                  </td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>"top"</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Preferred side for tooltip placement
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">align</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    "start" | "center" | "end"
                  </td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>"center"</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Alignment along the side axis
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">sideOffset</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>number</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>6</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Distance from trigger element (px)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">alignOffset</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>number</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>0</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Offset from alignment edge (px)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">maxWidth</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string | number</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>300</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Maximum width of tooltip
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">wordWrap</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    "normal" | "break-word" | "nowrap"
                  </td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>"break-word"</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Text wrapping behavior within tooltip
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">delayDuration</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>number</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>200</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Delay before showing (ms)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">hideDelayDuration</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>number</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>100</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Delay before hiding tooltip (ms)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">disableHoverableContent</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>boolean</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>false</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Disable hovering over tooltip content
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">portal</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>boolean</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>true</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Whether to render tooltip in a portal (document.body)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">open</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>boolean</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>-</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Controlled open state
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">defaultOpen</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>boolean</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>false</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Initial open state (uncontrolled)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">onOpenChange</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>(open: boolean) =&gt; void</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>-</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Callback when open state changes
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">showArrow</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>boolean</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>true</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Show tooltip arrow
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">arrowColor</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>-</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Arrow fill color (useful for gradients)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">disabled</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>boolean</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>false</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Disable the tooltip
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">asChild</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>boolean</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>false</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Clone handlers onto child instead of wrapping in a span
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">shadow</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>preset | string</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>"lg"</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Shadow preset or custom box-shadow CSS
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">zIndex</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>number</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>9999</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Z-index for stacking control
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">truncate</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>boolean</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>false</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Enable auto-truncation mode
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">truncateWidth</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>-</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Width class for truncation (e.g., "max-w-[200px]")
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">triggerDisplay</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>CSSProperties["display"]</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>"inline-block"</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    CSS display value for the trigger wrapper element
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
            Styling Props
          </h3>
          <div className="overflow-x-auto">
            <table className={`min-w-full text-sm ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}>
              <thead>
                <tr className={`border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
                  <th className="text-left py-3 pr-4 font-semibold">Prop</th>
                  <th className="text-left py-3 pr-4 font-semibold">Type</th>
                  <th className="text-left py-3 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-100"}`}>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">className</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    CSS class for outer wrapper (in truncate mode)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">triggerClassName</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    CSS class for the trigger element
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">contentClassName</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    CSS class for tooltip content container
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">contentStyle</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>CSSProperties</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Inline styles for tooltip content (useful for gradients)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">arrowClassName</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    CSS class for the arrow element
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">arrowStyle</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>CSSProperties</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Inline styles for the arrow element
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">baseArrowClassName</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>string</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Base CSS class for arrow (default: "fill-white dark:fill-gray-900")
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">baseArrowStyle</td>
                  <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>CSSProperties</td>
                  <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Base inline styles for the arrow
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
            code={`type TooltipShadowPreset = "none" | "sm" | "md" | "lg" | "xl" | "2xl";
type TooltipShadow = TooltipShadowPreset | (string & {});
type TooltipWordWrap = "normal" | "break-word" | "nowrap";

interface TooltipProps {
  children: ReactNode;
  content?: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  alignOffset?: number;
  maxWidth?: string | number;
  wordWrap?: TooltipWordWrap;
  delayDuration?: number;
  disableHoverableContent?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  showArrow?: boolean;
  arrowColor?: string;
  disabled?: boolean;
  asChild?: boolean;
  truncate?: boolean;
  truncateWidth?: string;
  shadow?: TooltipShadow;
  zIndex?: number;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  contentStyle?: CSSProperties;
  arrowClassName?: string;
  baseArrowClassName?: string;
  arrowStyle?: CSSProperties;
  baseArrowStyle?: CSSProperties;
  hideDelayDuration?: number;
  portal?: boolean;
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
              Tooltip has{" "}
              <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                role="tooltip"
              </code>{" "}
              for proper semantics
            </li>
            <li>
              Trigger has{" "}
              <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                aria-describedby
              </code>{" "}
              pointing to tooltip when open
            </li>
            <li>
              Unique tooltip ID generated via{" "}
              <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                useId()
              </code>{" "}
              for proper ARIA association
            </li>
            <li>
              Arrow has{" "}
              <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                aria-hidden="true"
              </code>{" "}
              as it's decorative
            </li>
            <li>
              Trigger is focusable via{" "}
              <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                tabIndex={0}
              </code>
            </li>
            <li>
              Opens on focus and hover for keyboard and mouse users
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
              - Focus trigger element to show tooltip
            </li>
            <li>
              <kbd className={`px-2 py-1 rounded text-xs font-mono ${isDarkMode ? "bg-gray-900 border border-gray-600 text-gray-100" : "bg-white border border-gray-300 text-gray-700"}`}>
                Escape
              </kbd>{" "}
              - Close tooltip when open
            </li>
            <li>
              <kbd className={`px-2 py-1 rounded text-xs font-mono ${isDarkMode ? "bg-gray-900 border border-gray-600 text-gray-100" : "bg-white border border-gray-300 text-gray-700"}`}>
                Tab
              </kbd>{" "}
              (again) - Move focus away to close tooltip
            </li>
          </ul>
        </div>

        <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-gray-50"}`}>
          <h3 className={`font-semibold mb-3 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
            Best Practices
          </h3>
          <ul className={`list-disc list-inside space-y-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            <li>Keep tooltip content concise and supplementary</li>
            <li>Don't put essential information only in tooltips</li>
            <li>Avoid interactive elements inside tooltips</li>
            <li>Use appropriate delay to prevent accidental triggers</li>
            <li>Test with screen readers to ensure proper announcements</li>
          </ul>
        </div>
      </div>

      <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-gray-50 border border-gray-200"}`}>
        <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
          <strong>Note:</strong> The Tooltip uses{" "}
          <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}>
            createPortal
          </code>{" "}
          to render outside the normal DOM hierarchy. This ensures proper positioning regardless of parent
          overflow or z-index constraints. Customize stacking with the{" "}
          <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}>
            zIndex
          </code>{" "}
          prop.
        </p>
      </div>
    </div>
  );
};

export default TooltipDemo;
