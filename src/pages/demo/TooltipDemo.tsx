import {
  useState } from "react";
import { Tooltip } from "../../components/Tooltip/index.js";
import { Button } from "../../components/Button/index.js";
import { useTheme } from "./ThemeContext.js";
import {
  DocsHero,
  Section,
  DemoWrapper,
  DocControlledPattern,
  DocEdgeCases,
  DocDoDont,
  ComponentDocs,
  ComponentAnatomy,
  CopyPasteBlock,
  SetupNote,
} from "./components/index.js";
import { PhoneFrame } from "./components/PhoneFrame.js";

const getClasses = () => ({
 card: `rounded-cl-lg p-5 bg-cl-bg-elevated`,
 kbd: `px-2 py-1 rounded-cl-md text-[11px] font-mono min-w-[2.5rem] text-center font-medium bg-cl-bg-elevated border border-cl-border text-cl-text-secondary`,
  label: `text-xs font-medium text-cl-text-tertiary`,
  btn: `px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors bg-cl-bg-elevated text-cl-text border border-cl-border hover:border-cl-border-input-hover hover:bg-cl-bg-hover cursor-pointer`,
  btnPrimary: `px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors bg-cl-text text-cl-bg hover:opacity-90`,
 note: `mt-3 p-3 rounded-cl-md text-xs bg-cl-bg-elevated border border-cl-border text-cl-accent`,
 trigger: `cursor-pointer px-4 py-2 rounded-cl-md font-medium text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 bg-cl-bg-hover text-cl-text hover:bg-cl-text/[0.14] border border-cl-border focus-visible:ring-border-active focus-visible:ring-offset-cl-bg`,
  // A trigger on the light shadow frame, light in both themes: the light theme's
  // own text, border and hover values, fixed, so it reads on white whatever the page is.
  frameTrigger: `cursor-pointer px-4 py-2 rounded-cl-md font-medium text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-white bg-white text-[#0f1218] border border-[rgba(15,18,24,0.1)] hover:bg-[rgba(15,18,24,0.04)]`,
});

const TooltipDemo = () => {
  const { isDarkMode: dark } = useTheme();
  const c = getClasses();

  const [controlled, setControlled] = useState(false);

  // Dark in both themes on purpose, so a fixed colour: `bg-cl-bg` is the page
  // colour and turns white in light, which put this white text on white.
  const contentClassNameDark = "rounded-cl-md bg-[#0a0d12] shadow-xl px-3 py-2 text-sm text-white";
  // Text that clears 4.5:1 on each fill in both themes. The light theme's success
  // and error fills are dark and its warning fill is light; the dark theme's three
  // are all bright. `cl-on-accent` is the text the library puts on a saturated
  // fill: white in light, near-black in dark. The warning fill is light in both
  // themes, so its text is `cl-on-warning`, which stays dark in both.
  const contentClassNameSuccess = "rounded-cl-md bg-cl-success shadow-lg px-3 py-2 text-sm text-cl-on-accent font-medium";
  const contentClassNameWarning = "rounded-cl-md bg-cl-warning shadow-lg px-3 py-2 text-sm text-cl-on-warning font-medium";
  const contentClassNameError = "rounded-cl-md bg-cl-error shadow-lg px-3 py-2 text-sm text-cl-on-accent font-medium";
  const contentClassNameGradient = "rounded-cl-md shadow-xl px-4 py-2.5 text-sm text-white font-medium";

  const gradientBlue = { background: "linear-gradient(135deg, #0c3483 0%, #a2b6df 100%)" };

  const shadowBlueGlow = "0 4px 20px rgba(59, 130, 246, 0.5)";
  const shadowPurpleGlow = "0 4px 20px rgba(147, 51, 234, 0.5)";
  const shadowSoftElevated = "0 10px 40px -10px rgba(0, 0, 0, 0.2)";
  const shadowSharpDrop = "4px 4px 0px rgba(0, 0, 0, 0.1)";

  const richContentProTip = (
    <div className="space-y-2">
      <div className={`font-semibold text-cl-text`}>Pro Tip</div>
      <p className={"text-cl-text-secondary"}>
        Tooltips can contain <strong>rich HTML</strong> content including{" "}
        <span className={"text-cl-accent"}>colored text</span>,{" "}
        <em>italics</em>, and more.
      </p>
    </div>
  );

  const richContentStatus = (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-cl-success"></span>
        <span className="font-medium">Online</span>
      </div>
      <p className={`text-xs text-cl-text-secondary`}>Last seen just now</p>
    </div>
  );

  return (
    <div className="space-y-10">
      <DocsHero
        title="Tooltip"
        description="A flexible, accessible tooltip component that supports positioning, custom styling, rich HTML content, and auto-truncation with tooltip on overflow."
        code={`import { Tooltip } from "@chumlab/ui/tooltip";`}
      />

      <SetupNote />

      <ComponentAnatomy name="Tooltip" />

      <Section
        title="Basic Usage"
        description="Works out-of-the-box with built-in styles and dark mode. Wrap any element to show a tooltip on hover."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          {/* Basic usage — wrap any element to show a tooltip on hover */}
          <Tooltip content="Save your changes">
            <Button className={c.trigger}>Hover me</Button>
          </Tooltip>
          <Tooltip content="Edit profile settings" side="bottom">
            <Button className={c.trigger}>Bottom tooltip</Button>
          </Tooltip>
          <Tooltip content="This action cannot be undone" side="right">
            <Button className={c.trigger}>Right tooltip</Button>
          </Tooltip>
        </DemoWrapper>
      </Section>

      <Section
        title="Positions"
        description="Use the side prop to control tooltip placement: top, right, bottom, or left."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <Tooltip content="Top tooltip" side="top">
            <Button className={c.trigger}>Top</Button>
          </Tooltip>
          <Tooltip content="Right tooltip" side="right">
            <Button className={c.trigger}>Right</Button>
          </Tooltip>
          <Tooltip content="Bottom tooltip" side="bottom">
            <Button className={c.trigger}>Bottom</Button>
          </Tooltip>
          <Tooltip content="Left tooltip" side="left">
            <Button className={c.trigger}>Left</Button>
          </Tooltip>
        </DemoWrapper>
      </Section>

      <Section
        title="Alignment"
        description="Use align prop to control tooltip alignment along the side axis: start, center, or end."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <Tooltip content="Start aligned tooltip" side="bottom" align="start">
            <Button className={c.trigger}>Start</Button>
          </Tooltip>
          <Tooltip content="Center aligned tooltip" side="bottom" align="center">
            <Button className={c.trigger}>Center</Button>
          </Tooltip>
          <Tooltip content="End aligned tooltip" side="bottom" align="end">
            <Button className={c.trigger}>End</Button>
          </Tooltip>
        </DemoWrapper>
      </Section>

      <Section
        title="Offsets"
        description="Use sideOffset and alignOffset to fine-tune tooltip positioning."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <Tooltip content="Default offset (6px)" side="top">
            <Button className={c.trigger}>Default</Button>
          </Tooltip>
          <Tooltip content="Large offset (16px)" side="top" sideOffset={16}>
            <Button className={c.trigger}>Large Offset</Button>
          </Tooltip>
          <Tooltip content="No offset (0px)" side="top" sideOffset={0}>
            <Button className={c.trigger}>No Offset</Button>
          </Tooltip>
          <Tooltip content="Align offset (20px)" side="bottom" align="start" alignOffset={20}>
            <Button className={c.trigger}>Align Offset</Button>
          </Tooltip>
        </DemoWrapper>
      </Section>

      <Section
        title="Arrow"
        description="Toggle the arrow visibility with showArrow prop."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <Tooltip content="Arrow visible on this tooltip" showArrow={true}>
            <Button className={c.trigger}>With Arrow</Button>
          </Tooltip>
          <Tooltip content="No arrow on this tooltip" showArrow={false}>
            <Button className={c.trigger}>No Arrow</Button>
          </Tooltip>
        </DemoWrapper>
      </Section>

      <Section
        title="Delay Duration"
        description="Control how long to wait before showing the tooltip with delayDuration (in milliseconds)."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <Tooltip content="Instant appearance (0ms)" delayDuration={0}>
            <Button className={c.trigger}>Instant</Button>
          </Tooltip>
          <Tooltip content="Fast appearance (100ms)" delayDuration={100}>
            <Button className={c.trigger}>Fast (100ms)</Button>
          </Tooltip>
          <Tooltip content="Default (200ms)" delayDuration={200}>
            <Button className={c.trigger}>Default (200ms)</Button>
          </Tooltip>
          <Tooltip content="Slow appearance (1000ms)" delayDuration={1000}>
            <Button className={c.trigger}>Slow (1s)</Button>
          </Tooltip>
        </DemoWrapper>
      </Section>

      <Section
        title="Max Width"
        description="Control tooltip width with maxWidth prop (number for pixels or string for CSS value)."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <Tooltip
            content="This is a tooltip with a very narrow max width that will wrap text quickly"
            maxWidth={150}
          >
            <Button className={c.trigger}>Narrow (150px)</Button>
          </Tooltip>
          <Tooltip content="Default max width (300px)" maxWidth={300}>
            <Button className={c.trigger}>Default (300px)</Button>
          </Tooltip>
          <Tooltip
            content="This tooltip has a wider max width so more content can fit on a single line without wrapping"
            maxWidth={400}
          >
            <Button className={c.trigger}>Wide (400px)</Button>
          </Tooltip>
        </DemoWrapper>
      </Section>

      <Section
        title="Text Wrapping (Word Wrap)"
        description="Control how text wraps using wordWrap prop: 'break-word' (default), 'normal', or 'nowrap'."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <Tooltip
            content="This is a very long tooltip with superlongwordthatwillbreakifneeded to demonstrate break-word behavior"
            maxWidth={200}
            wordWrap="break-word"
          >
            <Button className={c.trigger}>Break Word (default)</Button>
          </Tooltip>
          <Tooltip
            content="This is a tooltip with normal word wrapping that respects word boundaries"
            maxWidth={200}
            wordWrap="normal"
          >
            <Button className={c.trigger}>Normal Wrap</Button>
          </Tooltip>
          <Tooltip
            content="This tooltip content will not wrap and may overflow"
            maxWidth={400}
            wordWrap="nowrap"
          >
            <Button className={c.trigger}>No Wrap</Button>
          </Tooltip>
        </DemoWrapper>
        <div className={c.note}>
          <p><strong>break-word</strong>: Long words will break if they exceed maxWidth (default behavior)</p>
          <p className="mt-1"><strong>normal</strong>: Words won't break mid-word, wraps at word boundaries only</p>
          <p className="mt-1"><strong>nowrap</strong>: Content stays on one line, useful for short messages</p>
        </div>
      </Section>

      <Section
        title="Controlled State"
        description="Use open and onOpenChange props for controlled tooltip state."
        isDarkMode={dark}
      >
        <div
          className={`mb-3 p-3 rounded-cl-md flex items-center gap-3 bg-cl-bg-elevated`}
        >
          <span
            className={`text-xs font-medium text-cl-text-secondary`}
          >
            State:
          </span>
          <span
            className={`text-sm font-mono text-cl-text-secondary`}
          >
            {controlled ? "Open" : "Closed"}
          </span>
          <button
            className={`ml-auto ${c.btn} cursor-pointer`}
            onClick={() => setControlled(!controlled)}
          >
            Toggle: {controlled ? "Open" : "Closed"}
          </button>
        </div>
        <DemoWrapper isDarkMode={dark} layout="inline">
          <Tooltip
            content="This tooltip is controlled programmatically"
            open={controlled}
            onOpenChange={setControlled}
          >
            <Button className={c.trigger}>Controlled</Button>
          </Tooltip>
        </DemoWrapper>
      </Section>

      {/* ─── asChild Mode ─────────────────────────────────────────────── */}
      <Section
        title="asChild Mode"
        description="Use asChild to clone tooltip handlers onto the child element instead of wrapping it in a span. This avoids double tab-stops for interactive elements."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <Tooltip content="No wrapper span - handlers cloned onto button" asChild>
            <Button className={c.trigger}>asChild Button</Button>
          </Tooltip>
          <Tooltip content="Default mode wraps in a span">
            <Button className={c.trigger}>Default (wrapped)</Button>
          </Tooltip>
        </DemoWrapper>
        <div className={c.note}>
          <strong>When to use:</strong> Use <code>asChild</code> when wrapping
          interactive elements like buttons or links to avoid an extra tab-stop
          from the wrapper span.
        </div>
      </Section>

      {/* ─── Disabled ─────────────────────────────────────────────────── */}
      <Section
        title="Disabled"
        description="Use disabled prop to prevent tooltip from showing."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <Tooltip content="This won't show" disabled>
            <Button className={c.trigger}>Disabled Tooltip</Button>
          </Tooltip>
          <Tooltip content="This tooltip is enabled" disabled={false}>
            <Button className={c.trigger}>Enabled Tooltip</Button>
          </Tooltip>
        </DemoWrapper>
      </Section>

      {/* ─── Hoverable Content ────────────────────────────────────────── */}
      <Section
        title="Hoverable Content"
        description="By default, moving mouse to tooltip keeps it open. Set hoverableContent={false} to close it as soon as the pointer leaves the trigger."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <Tooltip content="Move mouse to tooltip - it stays open" hoverableContent>
            <Button className={c.trigger}>Hoverable (default)</Button>
          </Tooltip>
          <Tooltip content="Tooltip closes when leaving trigger" hoverableContent={false}>
            <Button className={c.trigger}>Not Hoverable</Button>
          </Tooltip>
        </DemoWrapper>
      </Section>

      {/* ─── Rich HTML Content ────────────────────────────────────────── */}
      <Section
        title="Rich HTML Content"
        description="The content prop accepts ReactNode for rich formatted content."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <Tooltip content={richContentProTip} maxWidth={280}>
            <Button className={c.trigger}>Rich Content</Button>
          </Tooltip>
          <Tooltip content={richContentStatus}>
            <Button className={c.trigger}>Status Tooltip</Button>
          </Tooltip>
        </DemoWrapper>
      </Section>

      {/* ─── Custom Styling ───────────────────────────────────────────── */}
      <Section
        title="Custom Styling"
        description="Use classes prop to customize tooltip appearance."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <Tooltip
            content="Dark theme tooltip"
            classes={{ content: contentClassNameDark, arrow: "fill-[#0a0d12]" }}
          >
            <Button className={c.trigger}>Dark</Button>
          </Tooltip>
          <Tooltip
            content="Success styled tooltip"
            classes={{ content: contentClassNameSuccess, arrow: "fill-cl-success" }}
          >
            <Button className={c.trigger}>Success</Button>
          </Tooltip>
          <Tooltip
            content="Warning styled tooltip"
            classes={{ content: contentClassNameWarning, arrow: "fill-cl-warning" }}
          >
            <Button className={c.trigger}>Warning</Button>
          </Tooltip>
          <Tooltip
            content="Error styled tooltip"
            classes={{ content: contentClassNameError, arrow: "fill-cl-error" }}
          >
            <Button className={c.trigger}>Error</Button>
          </Tooltip>
        </DemoWrapper>
      </Section>

      {/* ─── Shadow Presets ───────────────────────────────────────────── */}
      <Section
        title="Shadow Presets"
        description="Use shadow prop with presets: none, sm, md, lg (default), xl, 2xl. Shadows read on light surfaces, so these sit on a light frame in both themes."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <div className="flex flex-wrap gap-3 rounded-cl-lg bg-white px-6 pt-14 pb-6">
            <Tooltip content="No shadow" shadow="none">
              <Button className={c.frameTrigger}>None</Button>
            </Tooltip>
            <Tooltip content="Small shadow" shadow="sm">
              <Button className={c.frameTrigger}>Small</Button>
            </Tooltip>
            <Tooltip content="Medium shadow" shadow="md">
              <Button className={c.frameTrigger}>Medium</Button>
            </Tooltip>
            <Tooltip content="Large shadow (default)" shadow="lg">
              <Button className={c.frameTrigger}>Large</Button>
            </Tooltip>
            <Tooltip content="Extra large shadow" shadow="xl">
              <Button className={c.frameTrigger}>XL</Button>
            </Tooltip>
            <Tooltip content="2XL shadow" shadow="2xl">
              <Button className={c.frameTrigger}>2XL</Button>
            </Tooltip>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Custom Shadows ───────────────────────────────────────────── */}
      <Section
        title="Custom Shadows"
        description="Pass a custom CSS box-shadow string to the shadow prop. Shadows read on light surfaces, so these sit on a light frame in both themes."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <div className="flex flex-wrap gap-3 rounded-cl-lg bg-white px-6 pt-14 pb-6">
            <Tooltip content="Custom blue glow shadow" shadow={shadowBlueGlow}>
              <Button className={c.frameTrigger}>Blue Glow</Button>
            </Tooltip>
            <Tooltip content="Custom purple glow shadow" shadow={shadowPurpleGlow}>
              <Button className={c.frameTrigger}>Purple Glow</Button>
            </Tooltip>
            <Tooltip content="Soft elevated shadow" shadow={shadowSoftElevated}>
              <Button className={c.frameTrigger}>Soft Elevated</Button>
            </Tooltip>
            <Tooltip content="Sharp drop shadow" shadow={shadowSharpDrop}>
              <Button className={c.frameTrigger}>Sharp Drop</Button>
            </Tooltip>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Gradient Backgrounds ─────────────────────────────────────── */}
      <Section
        title="Gradient Backgrounds"
        description="contentStyle carries the gradient. Turn the arrow off with it: the arrow is a flat fill, so arrowColor can only take one of the gradient's stops and would match at one end and not along the seam. A gradient surface and an arrow do not compose."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <Tooltip
            content="Without arrow"
            classes={{ content: contentClassNameGradient }}
            contentStyle={gradientBlue}
            showArrow={false}
          >
            <Button className={c.trigger}>No Arrow</Button>
          </Tooltip>
        </DemoWrapper>
      </Section>

      {/* ─── Arrow Color ────────────────────────────────────────────── */}
      <Section
        title="Arrow Color"
        description="Use arrowColor to tint the arrow independently. Pair with classes.content or contentStyle to match."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <Tooltip
            content="Indigo arrow"
            arrowColor={"var(--cl-accent)"}
            classes={{ content: `rounded-cl-md px-3 py-2 text-sm text-cl-on-accent bg-cl-accent` }}
          >
            <Button className={c.trigger}>Indigo</Button>
          </Tooltip>
          <Tooltip
            content="Emerald arrow"
            arrowColor={"var(--cl-success)"}
            classes={{ content: `rounded-cl-md px-3 py-2 text-sm text-cl-bg bg-cl-success` }}
          >
            <Button className={c.trigger}>Emerald</Button>
          </Tooltip>
          <Tooltip
            content="Rose arrow"
            arrowColor={"var(--cl-error)"}
            classes={{ content: `rounded-cl-md px-3 py-2 text-sm text-cl-on-accent bg-cl-accent` }}
          >
            <Button className={c.trigger}>Rose</Button>
          </Tooltip>
          <Tooltip
            content="Default content, colored arrow only"
            arrowColor={"var(--cl-accent)"}
          >
            <Button className={c.trigger}>Arrow Only</Button>
          </Tooltip>
        </DemoWrapper>
      </Section>

      {/* ─── Z-Index ──────────────────────────────────────────────────── */}
      <Section
        title="Z-Index"
        description="Use zIndex prop to control stacking order (default: 9999)."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <Tooltip content="Default z-index (9999)" zIndex={9999}>
            <Button className={c.trigger}>Default</Button>
          </Tooltip>
          <Tooltip content="Lower z-index (100)" zIndex={100}>
            <Button className={c.trigger}>z-index: 100</Button>
          </Tooltip>
          <Tooltip content="Higher z-index (99999)" zIndex={99999}>
            <Button className={c.trigger}>z-index: 99999</Button>
          </Tooltip>
        </DemoWrapper>
      </Section>

      {/* ─── Truncated Text ───────────────────────────────────────────── */}
      <Section
        title="Truncated Text (Auto Tooltip)"
        description="Use truncate mode to automatically show tooltip only when text overflows."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="flex flex-col gap-4 w-full">
 <div className={`p-4 rounded-cl-lg bg-cl-bg-hover border border-cl-border`}>
              <p className={`text-sm mb-3 text-cl-text-secondary`}>
                Tooltip only appears when text is truncated:
              </p>
 <div className={`w-full max-w-[220px] p-3 rounded-cl-md shadow-sm bg-cl-bg-panel border border-cl-border`}>
                <Tooltip
                  truncate
                  truncateWidth={196}
                  classes={{ trigger: `text-sm font-medium text-cl-text` }}
                >
                  This is a very long text that will be truncated and show tooltip on hover
                </Tooltip>
              </div>
            </div>
 <div className={`p-4 rounded-cl-lg bg-cl-bg-hover border border-cl-border`}>
              <p className={`text-sm mb-3 text-cl-text-secondary`}>
                Short text - no tooltip needed:
              </p>
 <div className={`w-full max-w-[220px] p-3 rounded-cl-md shadow-sm bg-cl-bg-panel border border-cl-border`}>
                <Tooltip
                  truncate
                  truncateWidth={196}
                  classes={{ trigger: `text-sm font-medium text-cl-text` }}
                >
                  Short text
                </Tooltip>
              </div>
            </div>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Truncated Text in Table ──────────────────────────────────── */}
      <Section
        title="Truncated Text in Table Layout"
        description="Common pattern for tables with long content that needs truncation."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className={`w-full rounded-cl-lg border overflow-hidden border-cl-border`}>
            <div className={`grid grid-cols-1 sm:grid-cols-3 gap-px bg-cl-bg-elevated`}>
              <div className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider bg-cl-bg-elevated text-cl-text-tertiary`}>
                Title
              </div>
              <div className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider bg-cl-bg-elevated text-cl-text-tertiary`}>
                Description
              </div>
              <div className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider bg-cl-bg-elevated text-cl-text-tertiary`}>
                Author
              </div>
            </div>
            <div className={`grid grid-cols-1 sm:grid-cols-3 gap-px bg-cl-bg-elevated`}>
              <div className={`px-4 py-3 bg-cl-bg-elevated`}>
                <Tooltip
                  truncate
                  truncateWidth={150}
                  classes={{ trigger: `text-sm font-medium cursor-pointer hover:underline text-cl-accent hover:text-cl-text` }}
                >
                  Short Title
                </Tooltip>
              </div>
              <div className={`px-4 py-3 bg-cl-bg-elevated`}>
                <Tooltip
                  truncate
                  truncateWidth={150}
                  classes={{ trigger: `text-sm text-cl-text-secondary` }}
                >
                  Brief description
                </Tooltip>
              </div>
              <div className={`px-4 py-3 bg-cl-bg-elevated`}>
                <Tooltip
                  truncate
                  truncateWidth={150}
                  classes={{ trigger: `text-sm text-cl-text-secondary` }}
                >
                  John Doe
                </Tooltip>
              </div>
            </div>
            <div className={`grid grid-cols-1 sm:grid-cols-3 gap-px bg-cl-bg-elevated`}>
              <div className={`px-4 py-3 bg-cl-bg-elevated`}>
                <Tooltip
                  truncate
                  truncateWidth={150}
                  classes={{ trigger: `text-sm font-medium cursor-pointer hover:underline text-cl-accent hover:text-cl-text` }}
                >
                  This is a very long title that should truncate nicely
                </Tooltip>
              </div>
              <div className={`px-4 py-3 bg-cl-bg-elevated`}>
                <Tooltip
                  truncate
                  truncateWidth={150}
                  classes={{ trigger: `text-sm text-cl-text-secondary` }}
                >
                  A much longer description that definitely won't fit in the cell
                </Tooltip>
              </div>
              <div className={`px-4 py-3 bg-cl-bg-elevated`}>
                <Tooltip
                  truncate
                  truncateWidth={150}
                  classes={{ trigger: `text-sm text-cl-text-secondary` }}
                >
                  Alexander Christopher Williams III
                </Tooltip>
              </div>
            </div>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Arrow Size ───────────────────────────────────────────────── */}
      <Section
        title="Arrow Size"
        description="Control the size of the tooltip arrow with arrowSize (in pixels)."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="flex items-center gap-6 flex-wrap">
            {[4, 6, 10].map((size) => (
              <Tooltip key={size} content={`Arrow size: ${size}px`} arrowSize={size}>
                <Button className={c.trigger}>{size}px arrow</Button>
              </Tooltip>
            ))}
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Trigger Display ──────────────────────────────────────────── */}
      <Section
        title="Trigger Display"
        description="By default the trigger wrapper uses display: inline-flex. Use triggerDisplay to change this."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="space-y-4">
            <Tooltip content="This trigger is display: block" triggerDisplay="block">
              <div className={`w-full px-4 py-3 rounded text-sm text-center bg-cl-bg-elevated border border-cl-border text-cl-text`}>
                Block display — stretches full width
              </div>
            </Tooltip>
            <p className={`text-sm text-cl-text-secondary`}>
              Hover over this{" "}
              <Tooltip content="Inline tooltip" triggerDisplay="inline">
                <span className="underline decoration-dotted cursor-help font-medium">inline text</span>
              </Tooltip>{" "}
              to see an inline trigger.
            </p>
          </div>
        </DemoWrapper>
      </Section>

      <Section
        title="Data Attributes"
        description="The Tooltip trigger wrapper applies data attributes for CSS-based styling."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <Tooltip content="Inspect me to see aria-describedby">
            <Button className={c.trigger}>Inspect trigger</Button>
          </Tooltip>
        </DemoWrapper>
      </Section>

      {/* ─── At phone width ──────────────────────────────────────────────── */}
      <Section
        title="At phone width"
        codeless="the same component at a 360 px viewport, in a frame; its code is in the sections above"
      >
        <PhoneFrame
          route="/preview/Tooltip/phone"
          lookFor="The tooltip opens above its trigger and stays inside the screen."
        />
      </Section>

      <ComponentDocs name="Tooltip" />

      {/* ─── Accessibility ────────────────────────────────────────────── */}

      <DocControlledPattern
        isDarkMode={dark}
        summary="Use `open` with `onOpenChange` when you must coordinate with other overlays; otherwise use the default hover/focus behavior. Tooltips are for non-interactive supplementary text."
      />
      <DocEdgeCases
        isDarkMode={dark}
        items={[
          "Touch devices: hover-only patterns may not fire—ensure critical info is visible elsewhere.",
          "Truncation with `truncate` may need layout width constraints.",
          "Portals and z-index may conflict with modals—test stacking contexts.",
        ]}
      />
      <DocDoDont
        isDarkMode={dark}
        dos={[
          "Keep tooltip content short; move rich UI to a popover or dialog.",
          "Prefer focusable triggers that expose name and role.",
          "Respect reduced motion when customizing animations.",
        ]}
        donts={[
          "Do not place buttons or forms inside a tooltip (use a popover).",
          "Do not rely on tooltips for required field instructions.",
          "Do not block pointer events on the trigger.",
        ]}
      />

      <CopyPasteBlock name="Tooltip" />

    </div>
  );
};

export default TooltipDemo;
