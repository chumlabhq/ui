import { useState } from "react";
import { Tooltip } from "../../components/Tooltip";
import { Button } from "../../components/Button";
import { useTheme } from "./ThemeContext";
import {
  Section,
  DemoWrapper,
  PropsTable,
  PropRow,
  DocControlledPattern,
  DocEdgeCases,
  DocDoDont,
} from "./components";

// ─── Themed Classes ──────────────────────────────────────────────────────────

const getClasses = (dark: boolean) => ({
  card: `rounded-2xl border p-5 ${dark ? "border-white/[0.06] bg-linear-to-br from-white/[0.03] to-white/[0.01]" : "border-gray-200 bg-white shadow-sm shadow-gray-900/[0.04]"}`,
  kbd: `px-2 py-1 rounded-md text-[11px] font-mono min-w-[2.5rem] text-center font-medium ${dark ? "bg-gray-900 border border-white/10 text-gray-300 shadow-sm" : "bg-white border border-gray-200 text-gray-600 shadow-sm"}`,
  label: `text-xs font-medium ${dark ? "text-gray-500" : "text-gray-400"}`,
  btn: `px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${dark ? "bg-gray-700 text-gray-200 hover:bg-gray-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
  btnPrimary: `px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${dark ? "bg-indigo-500 text-white hover:bg-indigo-600" : "bg-indigo-600 text-white hover:bg-indigo-700"}`,
  note: `mt-3 p-3 rounded-lg text-xs ${dark ? "bg-blue-900/20 border border-blue-800/50 text-blue-300" : "bg-blue-50 border border-blue-200 text-blue-700"}`,
  trigger: `cursor-pointer px-4 py-2 rounded-lg font-medium text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 ${
    dark
      ? "bg-gray-700 text-gray-200 hover:bg-gray-600 focus-visible:ring-gray-400 focus-visible:ring-offset-gray-900"
      : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200 focus-visible:ring-gray-500"
  }`,
});

// ─── Demo ────────────────────────────────────────────────────────────────────

const TooltipDemo = () => {
  const { isDarkMode: dark } = useTheme();
  const c = getClasses(dark);

  const [controlled, setControlled] = useState(false);

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
      <div className={`font-semibold ${dark ? "text-white" : "text-gray-900"}`}>Pro Tip</div>
      <p className={dark ? "text-gray-300" : "text-gray-600"}>
        Tooltips can contain <strong>rich HTML</strong> content including{" "}
        <span className={dark ? "text-blue-400" : "text-blue-600"}>colored text</span>,{" "}
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
      <p className={`text-xs ${dark ? "text-gray-400" : "text-gray-500"}`}>Last seen just now</p>
    </div>
  );

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
            Tooltip
          </h1>
          <p
            className={`text-sm leading-relaxed max-w-2xl ${dark ? "text-gray-400" : "text-gray-600"}`}
          >
            A flexible, accessible tooltip component that supports positioning,
            custom styling, rich HTML content, and auto-truncation with tooltip
            on overflow.
          </p>
          <div className="mt-5">
            <pre className={`p-3.5 rounded-xl text-[13px] leading-relaxed overflow-x-auto whitespace-pre-wrap break-all ${dark ? "bg-linear-to-br from-gray-800 to-gray-900 text-gray-300 border border-white/6" : "bg-gray-50 text-gray-700 border border-gray-200"}`}>
              <code>{`import { Tooltip } from "@chumlab/ui/tooltip";`}</code>
            </pre>
          </div>
        </div>
      </header>

      {/* ─── Basic Tooltip ────────────────────────────────────────────── */}
      <Section
        title="Basic Usage"
        description="Works out-of-the-box with built-in styles and dark mode. Wrap any element to show a tooltip on hover."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          {/* Basic usage — wrap any element to show a tooltip on hover */}
          <Tooltip content="Save your changes">
            <button className={c.trigger}>Hover me</button>
          </Tooltip>
          <Tooltip content="Edit profile settings" side="bottom">
            <button className={c.trigger}>Bottom tooltip</button>
          </Tooltip>
          <Tooltip content="This action cannot be undone" side="right">
            <button className={c.trigger}>Right tooltip</button>
          </Tooltip>
        </DemoWrapper>
      </Section>

      {/* ─── Positions ────────────────────────────────────────────────── */}
      <Section
        title="Positions"
        description="Use the side prop to control tooltip placement: top, right, bottom, or left."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <Tooltip content="Top tooltip" side="top">
            <button className={c.trigger}>Top</button>
          </Tooltip>
          <Tooltip content="Right tooltip" side="right">
            <button className={c.trigger}>Right</button>
          </Tooltip>
          <Tooltip content="Bottom tooltip" side="bottom">
            <button className={c.trigger}>Bottom</button>
          </Tooltip>
          <Tooltip content="Left tooltip" side="left">
            <button className={c.trigger}>Left</button>
          </Tooltip>
        </DemoWrapper>
      </Section>

      {/* ─── Alignment ────────────────────────────────────────────────── */}
      <Section
        title="Alignment"
        description="Use align prop to control tooltip alignment along the side axis: start, center, or end."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <Tooltip content="Start aligned tooltip" side="bottom" align="start">
            <button className={c.trigger}>Start</button>
          </Tooltip>
          <Tooltip content="Center aligned tooltip" side="bottom" align="center">
            <button className={c.trigger}>Center</button>
          </Tooltip>
          <Tooltip content="End aligned tooltip" side="bottom" align="end">
            <button className={c.trigger}>End</button>
          </Tooltip>
        </DemoWrapper>
      </Section>

      {/* ─── Offsets ──────────────────────────────────────────────────── */}
      <Section
        title="Offsets"
        description="Use sideOffset and alignOffset to fine-tune tooltip positioning."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <Tooltip content="Default offset (6px)" side="top">
            <button className={c.trigger}>Default</button>
          </Tooltip>
          <Tooltip content="Large offset (16px)" side="top" sideOffset={16}>
            <button className={c.trigger}>Large Offset</button>
          </Tooltip>
          <Tooltip content="No offset (0px)" side="top" sideOffset={0}>
            <button className={c.trigger}>No Offset</button>
          </Tooltip>
          <Tooltip content="Align offset (20px)" side="bottom" align="start" alignOffset={20}>
            <button className={c.trigger}>Align Offset</button>
          </Tooltip>
        </DemoWrapper>
      </Section>

      {/* ─── Arrow ────────────────────────────────────────────────────── */}
      <Section
        title="Arrow"
        description="Toggle the arrow visibility with showArrow prop."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <Tooltip content="Arrow visible on this tooltip" showArrow={true}>
            <button className={c.trigger}>With Arrow</button>
          </Tooltip>
          <Tooltip content="No arrow on this tooltip" showArrow={false}>
            <button className={c.trigger}>No Arrow</button>
          </Tooltip>
        </DemoWrapper>
      </Section>

      {/* ─── Delay Duration ───────────────────────────────────────────── */}
      <Section
        title="Delay Duration"
        description="Control how long to wait before showing the tooltip with delayDuration (in milliseconds)."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <Tooltip content="Instant appearance (0ms)" delayDuration={0}>
            <button className={c.trigger}>Instant</button>
          </Tooltip>
          <Tooltip content="Fast appearance (100ms)" delayDuration={100}>
            <button className={c.trigger}>Fast (100ms)</button>
          </Tooltip>
          <Tooltip content="Default (200ms)" delayDuration={200}>
            <button className={c.trigger}>Default (200ms)</button>
          </Tooltip>
          <Tooltip content="Slow appearance (1000ms)" delayDuration={1000}>
            <button className={c.trigger}>Slow (1s)</button>
          </Tooltip>
        </DemoWrapper>
      </Section>

      {/* ─── Max Width ────────────────────────────────────────────────── */}
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
            <button className={c.trigger}>Narrow (150px)</button>
          </Tooltip>
          <Tooltip content="Default max width (300px)" maxWidth={300}>
            <button className={c.trigger}>Default (300px)</button>
          </Tooltip>
          <Tooltip
            content="This tooltip has a wider max width so more content can fit on a single line without wrapping"
            maxWidth={400}
          >
            <button className={c.trigger}>Wide (400px)</button>
          </Tooltip>
        </DemoWrapper>
      </Section>

      {/* ─── Text Wrapping ────────────────────────────────────────────── */}
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
            <button className={c.trigger}>Break Word (default)</button>
          </Tooltip>
          <Tooltip
            content="This is a tooltip with normal word wrapping that respects word boundaries"
            maxWidth={200}
            wordWrap="normal"
          >
            <button className={c.trigger}>Normal Wrap</button>
          </Tooltip>
          <Tooltip
            content="This tooltip content will not wrap and may overflow"
            maxWidth={400}
            wordWrap="nowrap"
          >
            <button className={c.trigger}>No Wrap</button>
          </Tooltip>
        </DemoWrapper>
        <div className={c.note}>
          <p><strong>break-word</strong>: Long words will break if they exceed maxWidth (default behavior)</p>
          <p className="mt-1"><strong>normal</strong>: Words won't break mid-word, wraps at word boundaries only</p>
          <p className="mt-1"><strong>nowrap</strong>: Content stays on one line, useful for short messages</p>
        </div>
      </Section>

      {/* ─── Controlled State ─────────────────────────────────────────── */}
      <Section
        title="Controlled State"
        description="Use open and onOpenChange props for controlled tooltip state."
        isDarkMode={dark}
      >
        <div
          className={`mb-3 p-3 rounded-lg flex items-center gap-3 ${dark ? "bg-gray-800" : "bg-gray-50"}`}
        >
          <span
            className={`text-xs font-medium ${dark ? "text-gray-400" : "text-gray-500"}`}
          >
            State:
          </span>
          <span
            className={`text-sm font-mono ${dark ? "text-gray-300" : "text-gray-600"}`}
          >
            {controlled ? "Open" : "Closed"}
          </span>
          <button
            className={`ml-auto ${c.btn}`}
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
            <button className={c.trigger}>Controlled</button>
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
            <button className={c.trigger}>Default (wrapped)</button>
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
            <button className={c.trigger}>Disabled Tooltip</button>
          </Tooltip>
          <Tooltip content="This tooltip is enabled" disabled={false}>
            <button className={c.trigger}>Enabled Tooltip</button>
          </Tooltip>
        </DemoWrapper>
      </Section>

      {/* ─── Hoverable Content ────────────────────────────────────────── */}
      <Section
        title="Hoverable Content"
        description="By default, moving mouse to tooltip keeps it open. Use disableHoverableContent to disable."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <Tooltip content="Move mouse to tooltip - it stays open" disableHoverableContent={false}>
            <button className={c.trigger}>Hoverable (default)</button>
          </Tooltip>
          <Tooltip content="Tooltip closes when leaving trigger" disableHoverableContent={true}>
            <button className={c.trigger}>Not Hoverable</button>
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
            <button className={c.trigger}>Rich Content</button>
          </Tooltip>
          <Tooltip content={richContentStatus}>
            <button className={c.trigger}>Status Tooltip</button>
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
            classes={{ content: contentClassNameDark, arrow: "fill-gray-900" }}
          >
            <button className={c.trigger}>Dark</button>
          </Tooltip>
          <Tooltip
            content="Success styled tooltip"
            classes={{ content: contentClassNameSuccess, arrow: "fill-green-600" }}
          >
            <button className={c.trigger}>Success</button>
          </Tooltip>
          <Tooltip
            content="Warning styled tooltip"
            classes={{ content: contentClassNameWarning, arrow: "fill-amber-500" }}
          >
            <button className={c.trigger}>Warning</button>
          </Tooltip>
          <Tooltip
            content="Error styled tooltip"
            classes={{ content: contentClassNameError, arrow: "fill-red-600" }}
          >
            <button className={c.trigger}>Error</button>
          </Tooltip>
        </DemoWrapper>
      </Section>

      {/* ─── Shadow Presets ───────────────────────────────────────────── */}
      <Section
        title="Shadow Presets"
        description="Use shadow prop with presets: none, sm, md, lg (default), xl, 2xl."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <Tooltip content="No shadow" shadow="none">
            <button className={c.trigger}>None</button>
          </Tooltip>
          <Tooltip content="Small shadow" shadow="sm">
            <button className={c.trigger}>Small</button>
          </Tooltip>
          <Tooltip content="Medium shadow" shadow="md">
            <button className={c.trigger}>Medium</button>
          </Tooltip>
          <Tooltip content="Large shadow (default)" shadow="lg">
            <button className={c.trigger}>Large</button>
          </Tooltip>
          <Tooltip content="Extra large shadow" shadow="xl">
            <button className={c.trigger}>XL</button>
          </Tooltip>
          <Tooltip content="2XL shadow" shadow="2xl">
            <button className={c.trigger}>2XL</button>
          </Tooltip>
        </DemoWrapper>
      </Section>

      {/* ─── Custom Shadows ───────────────────────────────────────────── */}
      <Section
        title="Custom Shadows"
        description="Pass a custom CSS box-shadow string to the shadow prop."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <Tooltip content="Custom blue glow shadow" shadow={shadowBlueGlow}>
            <button className={c.trigger}>Blue Glow</button>
          </Tooltip>
          <Tooltip content="Custom purple glow shadow" shadow={shadowPurpleGlow}>
            <button className={c.trigger}>Purple Glow</button>
          </Tooltip>
          <Tooltip content="Soft elevated shadow" shadow={shadowSoftElevated}>
            <button className={c.trigger}>Soft Elevated</button>
          </Tooltip>
          <Tooltip content="Sharp drop shadow" shadow={shadowSharpDrop}>
            <button className={c.trigger}>Sharp Drop</button>
          </Tooltip>
        </DemoWrapper>
      </Section>

      {/* ─── Gradient Backgrounds ─────────────────────────────────────── */}
      <Section
        title="Gradient Backgrounds"
        description="Use contentStyle for gradient backgrounds and arrowColor to match the arrow."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <Tooltip
            content="Purple gradient with arrow"
            classes={{ content: contentClassNameGradient }}
            contentStyle={gradientPurple}
            arrowColor="#764ba2"
          >
            <button className={c.trigger}>Purple Gradient</button>
          </Tooltip>
          <Tooltip
            content="Ocean breeze gradient"
            classes={{ content: contentClassNameGradient }}
            contentStyle={gradientGreen}
            arrowColor="#38ef7d"
          >
            <button className={c.trigger}>Green Gradient</button>
          </Tooltip>
          <Tooltip
            content="Sunset gradient tooltip"
            classes={{ content: contentClassNameGradient }}
            contentStyle={gradientPink}
            arrowColor="#f5576c"
          >
            <button className={c.trigger}>Pink Gradient</button>
          </Tooltip>
          <Tooltip
            content="Without arrow"
            classes={{ content: contentClassNameGradient }}
            contentStyle={gradientBlue}
            showArrow={false}
          >
            <button className={c.trigger}>No Arrow</button>
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
            arrowColor={dark ? "#818cf8" : "#4f46e5"}
            classes={{ content: `rounded-lg px-3 py-2 text-sm text-white ${dark ? "bg-indigo-500" : "bg-indigo-600"}` }}
          >
            <button className={c.trigger}>Indigo</button>
          </Tooltip>
          <Tooltip
            content="Emerald arrow"
            arrowColor={dark ? "#34d399" : "#059669"}
            classes={{ content: `rounded-lg px-3 py-2 text-sm text-white ${dark ? "bg-emerald-500" : "bg-emerald-600"}` }}
          >
            <button className={c.trigger}>Emerald</button>
          </Tooltip>
          <Tooltip
            content="Amber arrow"
            arrowColor={dark ? "#fbbf24" : "#d97706"}
            classes={{ content: `rounded-lg px-3 py-2 text-sm ${dark ? "bg-amber-500 text-amber-950" : "bg-amber-500 text-amber-950"}` }}
          >
            <button className={c.trigger}>Amber</button>
          </Tooltip>
          <Tooltip
            content="Rose arrow"
            arrowColor={dark ? "#fb7185" : "#e11d48"}
            classes={{ content: `rounded-lg px-3 py-2 text-sm text-white ${dark ? "bg-rose-500" : "bg-rose-600"}` }}
          >
            <button className={c.trigger}>Rose</button>
          </Tooltip>
          <Tooltip
            content="Default content, colored arrow only"
            arrowColor={dark ? "#818cf8" : "#4f46e5"}
          >
            <button className={c.trigger}>Arrow Only</button>
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
            <button className={c.trigger}>Default</button>
          </Tooltip>
          <Tooltip content="Lower z-index (100)" zIndex={100}>
            <button className={c.trigger}>z-index: 100</button>
          </Tooltip>
          <Tooltip content="Higher z-index (99999)" zIndex={99999}>
            <button className={c.trigger}>z-index: 99999</button>
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
            <div className={`p-4 rounded-xl border ${dark ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"}`}>
              <p className={`text-sm mb-3 ${dark ? "text-gray-400" : "text-gray-500"}`}>
                Tooltip only appears when text is truncated:
              </p>
              <div className={`w-full max-w-[220px] p-3 rounded-lg shadow-sm border ${dark ? "bg-gray-800 border-gray-600" : "bg-white border-gray-200"}`}>
                <Tooltip
                  truncate
                  truncateWidth={196}
                  classes={{ trigger: `text-sm font-medium ${dark ? "text-white" : "text-gray-900"}` }}
                >
                  This is a very long text that will be truncated and show tooltip on hover
                </Tooltip>
              </div>
            </div>
            <div className={`p-4 rounded-xl border ${dark ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"}`}>
              <p className={`text-sm mb-3 ${dark ? "text-gray-400" : "text-gray-500"}`}>
                Short text - no tooltip needed:
              </p>
              <div className={`w-full max-w-[220px] p-3 rounded-lg shadow-sm border ${dark ? "bg-gray-800 border-gray-600" : "bg-white border-gray-200"}`}>
                <Tooltip
                  truncate
                  truncateWidth={196}
                  classes={{ trigger: `text-sm font-medium ${dark ? "text-white" : "text-gray-900"}` }}
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
          <div className={`w-full rounded-xl border overflow-hidden ${dark ? "border-gray-600" : "border-gray-200"}`}>
            <div className={`grid grid-cols-1 sm:grid-cols-3 gap-px ${dark ? "bg-gray-600" : "bg-gray-200"}`}>
              <div className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider ${dark ? "bg-gray-700 text-gray-400" : "bg-gray-50 text-gray-500"}`}>
                Title
              </div>
              <div className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider ${dark ? "bg-gray-700 text-gray-400" : "bg-gray-50 text-gray-500"}`}>
                Description
              </div>
              <div className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider ${dark ? "bg-gray-700 text-gray-400" : "bg-gray-50 text-gray-500"}`}>
                Author
              </div>
            </div>
            <div className={`grid grid-cols-1 sm:grid-cols-3 gap-px ${dark ? "bg-gray-600" : "bg-gray-200"}`}>
              <div className={`px-4 py-3 ${dark ? "bg-gray-800" : "bg-white"}`}>
                <Tooltip
                  truncate
                  truncateWidth={150}
                  classes={{ trigger: `text-sm font-medium cursor-pointer hover:underline ${dark ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-800"}` }}
                >
                  Short Title
                </Tooltip>
              </div>
              <div className={`px-4 py-3 ${dark ? "bg-gray-800" : "bg-white"}`}>
                <Tooltip
                  truncate
                  truncateWidth={150}
                  classes={{ trigger: `text-sm ${dark ? "text-gray-300" : "text-gray-600"}` }}
                >
                  Brief description
                </Tooltip>
              </div>
              <div className={`px-4 py-3 ${dark ? "bg-gray-800" : "bg-white"}`}>
                <Tooltip
                  truncate
                  truncateWidth={150}
                  classes={{ trigger: `text-sm ${dark ? "text-gray-300" : "text-gray-600"}` }}
                >
                  John Doe
                </Tooltip>
              </div>
            </div>
            <div className={`grid grid-cols-1 sm:grid-cols-3 gap-px ${dark ? "bg-gray-600" : "bg-gray-200"}`}>
              <div className={`px-4 py-3 ${dark ? "bg-gray-800" : "bg-white"}`}>
                <Tooltip
                  truncate
                  truncateWidth={150}
                  classes={{ trigger: `text-sm font-medium cursor-pointer hover:underline ${dark ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-800"}` }}
                >
                  This is a very long title that should truncate nicely
                </Tooltip>
              </div>
              <div className={`px-4 py-3 ${dark ? "bg-gray-800" : "bg-white"}`}>
                <Tooltip
                  truncate
                  truncateWidth={150}
                  classes={{ trigger: `text-sm ${dark ? "text-gray-300" : "text-gray-600"}` }}
                >
                  A much longer description that definitely won't fit in the cell
                </Tooltip>
              </div>
              <div className={`px-4 py-3 ${dark ? "bg-gray-800" : "bg-white"}`}>
                <Tooltip
                  truncate
                  truncateWidth={150}
                  classes={{ trigger: `text-sm ${dark ? "text-gray-300" : "text-gray-600"}` }}
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
                <button className={c.trigger}>{size}px arrow</button>
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
              <div className={`w-full px-4 py-3 rounded text-sm text-center ${dark ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-800"}`}>
                Block display — stretches full width
              </div>
            </Tooltip>
            <p className={`text-sm ${dark ? "text-gray-300" : "text-gray-700"}`}>
              Hover over this{" "}
              <Tooltip content="Inline tooltip" triggerDisplay="inline">
                <span className="underline decoration-dotted cursor-help font-medium">inline text</span>
              </Tooltip>{" "}
              to see an inline trigger.
            </p>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Data Attributes ──────────────────────────────────────────── */}
      <Section
        title="Data Attributes"
        description="The Tooltip trigger wrapper applies data attributes for CSS-based styling."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <Tooltip content="Inspect me to see aria-describedby">
            <button className={c.trigger}>Inspect trigger</button>
          </Tooltip>
        </DemoWrapper>
      </Section>

      {/* ─── Props ────────────────────────────────────────────────────── */}
      <Section title="Props" isDarkMode={dark}>
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow
              name="children"
              type="ReactNode"
              description="Trigger element or text content for truncate mode"
              isDarkMode={dark}
            />
            <PropRow
              name="content"
              type="ReactNode"
              description="Tooltip content (supports text or HTML)"
              isDarkMode={dark}
            />
            <PropRow
              name="side"
              type={`"top"|"right"|"bottom"|"left"`}
              defaultVal='"top"'
              description="Preferred side for tooltip placement"
              isDarkMode={dark}
            />
            <PropRow
              name="align"
              type={`"start"|"center"|"end"`}
              defaultVal='"center"'
              description="Alignment along the side axis"
              isDarkMode={dark}
            />
            <PropRow
              name="sideOffset"
              type="number"
              defaultVal="6"
              description="Distance from trigger element (px)"
              isDarkMode={dark}
            />
            <PropRow
              name="alignOffset"
              type="number"
              defaultVal="0"
              description="Offset from alignment edge (px)"
              isDarkMode={dark}
            />
            <PropRow
              name="maxWidth"
              type="string | number"
              defaultVal="300"
              description="Maximum width of tooltip"
              isDarkMode={dark}
            />
            <PropRow
              name="wordWrap"
              type={`"normal"|"break-word"|"nowrap"`}
              defaultVal='"break-word"'
              description="Text wrapping behavior within tooltip"
              isDarkMode={dark}
            />
            <PropRow
              name="delayDuration"
              type="number"
              defaultVal="200"
              description="Delay before showing (ms)"
              isDarkMode={dark}
            />
            <PropRow
              name="hideDelayDuration"
              type="number"
              defaultVal="100"
              description="Delay before hiding tooltip (ms)"
              isDarkMode={dark}
            />
            <PropRow
              name="disableHoverableContent"
              type="boolean"
              defaultVal="false"
              description="Disable hovering over tooltip content"
              isDarkMode={dark}
            />
            <PropRow
              name="open"
              type="boolean"
              description="Controlled open state"
              isDarkMode={dark}
            />
            <PropRow
              name="defaultOpen"
              type="boolean"
              defaultVal="false"
              description="Initial open state (uncontrolled)"
              isDarkMode={dark}
            />
            <PropRow
              name="onOpenChange"
              type="(open: boolean) => void"
              description="Callback when open state changes"
              isDarkMode={dark}
            />
            <PropRow
              name="showArrow"
              type="boolean"
              defaultVal="true"
              description="Show tooltip arrow"
              isDarkMode={dark}
            />
            <PropRow
              name="arrowSize"
              type="number"
              defaultVal="6"
              description="Size of the tooltip arrow in pixels"
              isDarkMode={dark}
            />
            <PropRow
              name="arrowColor"
              type="string"
              description="Arrow fill color (useful for gradients)"
              isDarkMode={dark}
            />
            <PropRow
              name="disabled"
              type="boolean"
              defaultVal="false"
              description="Disable the tooltip"
              isDarkMode={dark}
            />
            <PropRow
              name="truncate"
              type="boolean"
              defaultVal="false"
              description="Enable auto-truncation mode"
              isDarkMode={dark}
            />
            <PropRow
              name="truncateWidth"
              type="number | string"
              description="Max width for truncation (number = px, string = CSS)"
              isDarkMode={dark}
            />
            <PropRow
              name="shadow"
              type='preset | string'
              defaultVal='"lg"'
              description="Shadow preset or custom box-shadow CSS"
              isDarkMode={dark}
            />
            <PropRow
              name="zIndex"
              type="number"
              defaultVal="9999"
              description="Z-index for stacking control"
              isDarkMode={dark}
            />
            <PropRow
              name="portal"
              type="boolean"
              defaultVal="true"
              description="Whether to render tooltip in a portal"
              isDarkMode={dark}
            />
            <PropRow
              name="portalContainer"
              type="HTMLElement | null"
              defaultVal="document.body"
              description="Custom container element for the tooltip portal"
              isDarkMode={dark}
            />
            <PropRow
              name="asChild"
              type="boolean"
              defaultVal="false"
              description="Clone handlers onto child instead of wrapping in a span"
              isDarkMode={dark}
            />
            <PropRow
              name="triggerDisplay"
              type='CSSProperties["display"]'
              defaultVal='"inline-flex"'
              description="CSS display value for the trigger wrapper"
              isDarkMode={dark}
            />
            <PropRow
              name="className"
              type="string"
              description="CSS class for outer wrapper (in truncate mode)"
              isDarkMode={dark}
            />
            <PropRow
              name="classes"
              type="TooltipClasses"
              description="Slot class overrides (4 slots)"
              isDarkMode={dark}
            />
            <PropRow
              name="unstyled"
              type="boolean"
              defaultVal="false"
              description="Remove all default classes"
              isDarkMode={dark}
            />
            <PropRow
              name="contentStyle"
              type="CSSProperties"
              description="Inline styles for tooltip content (useful for gradients)"
              isDarkMode={dark}
            />
            <PropRow
              name="arrowStyle"
              type="CSSProperties"
              description="Inline styles for the arrow element"
              isDarkMode={dark}
            />
            <PropRow
              name="baseArrowStyle"
              type="CSSProperties"
              description="Base inline styles for the arrow"
              isDarkMode={dark}
            />
          </PropsTable>
        </div>
      </Section>

      {/* ─── TooltipClasses Slots ─────────────────────────────────────── */}
      <Section title="TooltipClasses Slots" isDarkMode={dark}>
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow
              name="trigger"
              type="string"
              description="Trigger wrapper element"
              isDarkMode={dark}
            />
            <PropRow
              name="content"
              type="string"
              description="Tooltip content container"
              isDarkMode={dark}
            />
            <PropRow
              name="arrow"
              type="string"
              description="Arrow SVG element"
              isDarkMode={dark}
            />
            <PropRow
              name="baseArrow"
              type="string"
              description="Base arrow container"
              isDarkMode={dark}
            />
          </PropsTable>
        </div>
      </Section>

      {/* ─── Data Attributes Reference ────────────────────────────────── */}
      <Section
        title="Data Attributes"
        description="Use for CSS-based state styling."
        isDarkMode={dark}
      >
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow
              name="aria-describedby"
              type="trigger"
              description="Links trigger to tooltip content when open"
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
              'Tooltip has role="tooltip" for proper semantics',
              "Trigger has aria-describedby pointing to tooltip when open",
              "Unique tooltip ID generated via useId() for proper ARIA association",
              'Arrow has aria-hidden="true" as it is decorative',
              "Trigger is focusable via tabIndex={0}",
              "Opens on focus and hover for keyboard and mouse users",
              "Keep tooltip content concise and supplementary",
              "Avoid interactive elements inside tooltips",
              "Use appropriate delay to prevent accidental triggers",
              "Test with screen readers to ensure proper announcements",
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
              ["Tab", "Focus trigger element to show tooltip"],
              ["Escape", "Close tooltip when open"],
              ["Tab", "Move focus away to close tooltip"],
            ].map(([key, desc], i) => (
              <div key={`${key}-${i}`} className="flex items-center gap-3">
                <kbd className={c.kbd}>{key}</kbd>
                <span>{desc}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

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

      {/* ─── Data Attributes ──────────────────────────────────────────── */}
      <Section title="Data Attributes" description="Use for CSS-based state styling." isDarkMode={dark}>
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow name="data-state" type="trigger" description="'open' or 'closed' — inherited via asChild" isDarkMode={dark} />
          </PropsTable>
        </div>
      </Section>

      {/* ─── Accessibility ────────────────────────────────────────────── */}
      <Section title="Accessibility" description="Built-in accessibility features." isDarkMode={dark}>
        <div className={c.card}>
          <div className={`space-y-2 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>
            {[
              "aria-describedby on the trigger references the tooltip content",
              "role=\"tooltip\" on the tooltip element",
              "Triggered on hover and focus for mouse and keyboard users",
              "Touch long-press support for mobile devices",
              "Escape key dismisses the tooltip",
              "disableHoverableContent prevents tooltip from staying open on content hover",
            ].map((text) => (
              <p key={text} className="flex items-start gap-2">
                <span className={`mt-0.5 shrink-0 ${dark ? "text-emerald-400" : "text-emerald-600"}`}>&#10003;</span>
                <span>{text}</span>
              </p>
            ))}
          </div>
        </div>
        <div className={`${c.card} mt-3`}>
          <p className={`text-xs font-semibold mb-3 ${dark ? "text-gray-300" : "text-gray-700"}`}>Keyboard Reference</p>
          <div className={`space-y-2 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>
            {[
              ["Tab", "Trigger tooltip via focus"],
              ["Escape", "Dismiss the tooltip"],
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

export default TooltipDemo;
