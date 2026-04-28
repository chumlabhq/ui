import { useState, useRef } from "react";
import { ResizablePanel } from "../../components/ResizablePanel";
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

// ─── Themed Classes ──────────────────────────────────────────────────────────

const getClasses = (_dark: boolean) => ({
  panel: {
    root: "",
    handle: "",
  },
 card: `rounded-cl-lg p-5 bg-cl-bg-elevated`,
 kbd: `px-2 py-1 rounded-cl-md text-[11px] font-mono min-w-[2.5rem] text-center font-medium bg-cl-bg-elevated border border-cl-border text-cl-text-secondary`,
  label: `text-xs font-medium text-cl-text-tertiary`,
 note: `mt-3 p-3 rounded-cl-md text-xs bg-cl-bg-elevated border border-cl-border text-cl-accent`,
  btn: `px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors bg-cl-bg-elevated text-cl-text hover:bg-cl-bg-elevated`,
  btnPrimary: `px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors bg-cl-text text-cl-bg hover:opacity-90`,
});

// ─── Demo ────────────────────────────────────────────────────────────────────

const ResizablePanelDemo = () => {
  const { isDarkMode: dark } = useTheme();
  const c = getClasses(dark);

  const [rightWidth, setRightWidth] = useState(300);
  const [leftWidth, setLeftWidth] = useState(350);
  const [bottomHeight, setBottomHeight] = useState(200);
  const [topHeight, setTopHeight] = useState(200);
  const [constrainedWidth, setConstrainedWidth] = useState(250);
  const [controlledWidth, setControlledWidth] = useState(320);
  const [callbackWidth, setCallbackWidth] = useState(300);
  const [callbackLog, setCallbackLog] = useState<string[]>([]);
  const [sidebarWidth, setSidebarWidth] = useState(250);
  const [leftPanelWidth, setLeftPanelWidth] = useState(250);
  const [rightPanelWidth, setRightPanelWidth] = useState(250);
  const [styledWidth, setStyledWidth] = useState(300);
  const [customStepWidth, setCustomStepWidth] = useState(300);
  const [disabledToggle, setDisabledToggle] = useState(true);
  const logRef = useRef<HTMLDivElement>(null);

  const addLog = (msg: string) => {
    setCallbackLog((prev) => [...prev.slice(-4), msg]);
    requestAnimationFrame(() => {
      logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
    });
  };

  const sidebarContent = () => (
    <div className="h-full p-4 flex flex-col gap-3">
      <div
        className={`text-xs font-semibold uppercase tracking-wider text-cl-accent`}
      >
        Sidebar
      </div>
      <div className="space-y-2">
        {["Dashboard", "Projects", "Team", "Settings"].map((item) => (
          <div
            key={item}
            className={`px-3 py-1.5 rounded-cl-md text-sm text-cl-text-secondary hover:bg-cl-bg-hover dark:text-cl-text-secondary dark:hover:bg-cl-text/4 cursor-pointer transition-colors`}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );

  const editorContent = (height: number) => (
    <div className="h-full p-4 flex flex-col gap-2">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-cl-text-tertiary">
        Editor
      </div>
      <div className="flex-1 rounded-cl-md p-3 font-mono text-xs leading-relaxed bg-cl-bg border border-cl-border text-cl-text-secondary">
        <div><span className="text-cl-text-tertiary">const</span> app = <span className="text-cl-text-tertiary">express</span>();</div>
        <div>app.<span className="text-cl-text-tertiary">get</span>(<span className="text-cl-accent">'/'</span>, handler);</div>
        <div>app.<span className="text-cl-text-tertiary">listen</span>(<span className="text-cl-accent">3000</span>);</div>
      </div>
      <div className="text-[10px] font-mono text-cl-text-tertiary tabular-nums">
        {Math.round(height)}px
      </div>
    </div>
  );

  const previewContent = (width: number) => (
    <div className="h-full p-4 flex flex-col gap-2">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-cl-text-tertiary">
        Preview
      </div>
      <div className="flex-1 rounded-cl-md flex items-center justify-center bg-cl-bg border border-cl-border">
        <div className="text-center">
          <div className="text-sm font-medium text-cl-text">Preview</div>
          <div className="text-[11px] mt-1 text-cl-text-tertiary">Live output here</div>
        </div>
      </div>
      <div className="text-[10px] font-mono text-cl-text-tertiary tabular-nums">
        {Math.round(width)}px
      </div>
    </div>
  );

  const simpleContent = (color: string, label: string, size: number) => {
    const cl = {
      blue: {
        text: dark ? "text-cl-accent" : "text-cl-accent",
        muted: dark ? "text-cl-accent/60" : "text-cl-accent/60",
      },
      green: {
        text: dark ? "text-cl-success" : "text-cl-success",
        muted: dark ? "text-cl-success/60" : "text-cl-success/60",
      },
      amber: {
        text: dark ? "text-cl-warning" : "text-cl-warning",
        muted: dark ? "text-cl-warning/60" : "text-cl-warning/60",
      },
      indigo: {
        text: dark ? "text-cl-accent" : "text-cl-accent",
        muted: dark ? "text-cl-accent/60" : "text-cl-accent/60",
      },
      teal: {
        text: dark ? "text-cl-accent" : "text-cl-accent",
        muted: dark ? "text-cl-accent/60" : "text-cl-accent/60",
      },
      purple: {
        text: dark ? "text-cl-accent" : "text-cl-accent",
        muted: dark ? "text-cl-accent/60" : "text-cl-accent/60",
      },
    }[color] ?? {
      text: dark ? "text-cl-text-tertiary" : "text-cl-text-secondary",
      muted: dark ? "text-cl-text-tertiary" : "text-cl-text-tertiary",
    };
    return (
      <div className="h-full p-4 flex flex-col justify-between">
        <div
          className={`text-xs font-semibold uppercase tracking-wider ${cl.text}`}
        >
          {label}
        </div>
        <div className={`text-[10px] font-mono ${cl.muted}`}>
          {Math.round(size)}px
        </div>
      </div>
    );
  };

  // Neutral handle at rest, subtle text-color tint on hover/drag. The
  // color cue ties the handle visually to its panel via the eyebrow
  // label inside, without flooding the surface.
  const handleClass = (_color: string) => {
    void _color;
    return "bg-cl-border hover:bg-cl-text/20 transition-colors motion-reduce:transition-none";
  };

  const panelRootClass = (color: string) => {
    const base = "bg-cl-bg-elevated border border-cl-border";
    const map: Record<string, string> = {
      blue: `h-40 ${base} rounded-cl-md`,
      green: `h-40 ${base} rounded-cl-md`,
      purple: `${base} rounded-l-lg`,
      indigo: `${base} rounded-l-lg`,
      teal: `${base} rounded-r-lg`,
      amber: `h-40 ${base} rounded-cl-md`,
    };
    return map[color] ?? map.blue;
  };

  return (
    <div className="space-y-10">
      <DocsHero
        title="Resizable Panel"
        description="A panel component with a draggable separator handle for resizing. Supports horizontal and vertical orientations, keyboard navigation, pointer events for mouse and touch, controlled and uncontrolled modes, custom constraints, resize callbacks, Escape to cancel, handle content slots, CSS custom properties, and full accessibility via WAI-ARIA separator semantics."
        code={`import { ResizablePanel } from "@chumlab/ui/resizable-panel";`}
      />

      {/* ─── Basic Usage ────────────────────────────────────────────────── */}
      <Section
        title="Basic Usage"
        description="Works out-of-the-box with built-in styles and dark mode. Drag the right edge to resize. No custom classes needed."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          {/* Basic usage — drag the edge to resize */}
          <ResizablePanel defaultValue={300} minValue={150} maxValue={500}>
            <div className="h-full p-4">
              <div
                className={`text-sm text-cl-text-secondary`}
              >
                Drag the edge to resize.
              </div>
            </div>
          </ResizablePanel>
        </DemoWrapper>
      </Section>

      {/* ─── Right Resize (Default) ───────────────────────────────────── */}
      <Section
        title="Right Resize (Default)"
        description="Drag the right edge to resize. A classic sidebar layout pattern — the default resizeDirection is 'right'."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <ResizablePanel
            defaultValue={rightWidth}
            minValue={200}
            maxValue={500}
            onValueChange={setRightWidth}
            classes={{
              // Override h-40 from panelRootClass — the sidebar content
              // (eyebrow + 4 nav items + width footer) needs ~240px.
              root: `${panelRootClass("blue").replace("h-40", "h-60")}`,
              handle: handleClass("blue"),
            }}
          >
            {sidebarContent()}
          </ResizablePanel>
        </DemoWrapper>
      </Section>

      {/* ─── Left Resize ──────────────────────────────────────────────── */}
      <Section
        title="Left Resize"
        description="Set resizeDirection='left' to place the drag handle on the left edge."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="flex justify-end w-full">
            <ResizablePanel
              defaultValue={leftWidth}
              minValue={200}
              maxValue={600}
              onValueChange={setLeftWidth}
              resizeDirection="left"
              classes={{
                root: panelRootClass("green"),
                handle: handleClass("green"),
              }}
            >
              {previewContent(leftWidth)}
            </ResizablePanel>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Bottom Resize (Vertical) ─────────────────────────────────── */}
      <Section
        title="Bottom Resize (Vertical)"
        description="Set resizeDirection='bottom' for vertical resizing. The handle appears on the bottom edge and the component manages height instead of width."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <ResizablePanel
            defaultValue={bottomHeight}
            minValue={100}
            maxValue={400}
            resizeDirection="bottom"
            onValueChange={setBottomHeight}
            classes={{
              root: "w-full bg-cl-bg-elevated rounded-cl-md border border-cl-border",
              handle: handleClass("blue"),
            }}
          >
            {editorContent(bottomHeight)}
          </ResizablePanel>
        </DemoWrapper>
      </Section>

      {/* ─── Top Resize (Vertical) ────────────────────────────────────── */}
      <Section
        title="Top Resize (Vertical)"
        description="Set resizeDirection='top' to place the handle on the top edge. Dragging up increases height."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="flex items-end w-full" style={{ minHeight: 420 }}>
            <ResizablePanel
              defaultValue={topHeight}
              minValue={100}
              maxValue={400}
              resizeDirection="top"
              onValueChange={setTopHeight}
              classes={{
                root: "w-full bg-cl-bg-elevated rounded-cl-md border border-cl-border",
                handle: handleClass("green"),
              }}
            >
              {simpleContent("green", "Terminal", topHeight)}
            </ResizablePanel>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Uncontrolled ─────────────────────────────────────────────── */}
      <Section
        title="Uncontrolled (defaultValue)"
        description="Use defaultValue for uncontrolled behavior — no external state management needed. The component manages its own size internally."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <ResizablePanel
            defaultValue={280}
            minValue={150}
            maxValue={450}
            classes={{
              root: panelRootClass("blue"),
              handle: handleClass("blue"),
            }}
          >
            <div className="p-4">
              <p
                className="font-medium text-cl-text"
              >
                Uncontrolled Panel
              </p>
              <p
                className="text-sm mt-2 text-cl-text-tertiary"
              >
                Started at 280px (no external state)
              </p>
            </div>
          </ResizablePanel>
        </DemoWrapper>
      </Section>

      {/* ─── Controlled State ─────────────────────────────────────────── */}
      <Section
        title="Controlled State"
        description="Use value and onValueChange for full controlled behavior. The external slider and the drag handle both drive the panel width."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="flex-col">
          <div className="w-full space-y-4">
            <div className="flex items-center gap-4">
              <label
                className={`text-sm font-medium whitespace-nowrap text-cl-text-secondary`}
              >
                Width: {controlledWidth}px
              </label>
              <input
                type="range"
                min={150}
                max={500}
                value={controlledWidth}
                onChange={(e) => setControlledWidth(Number(e.target.value))}
                className="flex-1"
                aria-label="Panel width"
              />
              <button
                type="button"
                onClick={() => setControlledWidth(320)}
                className={c.btnPrimary}
              >
                Reset
              </button>
            </div>
            <ResizablePanel
              value={controlledWidth}
              onValueChange={setControlledWidth}
              minValue={150}
              maxValue={500}
              classes={{
                root: panelRootClass("blue"),
                handle: handleClass("blue"),
              }}
            >
              {simpleContent("blue", "Controlled", controlledWidth)}
            </ResizablePanel>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Custom Constraints ───────────────────────────────────────── */}
      <Section
        title="Custom Constraints"
        description="Use minValue and maxValue to constrain the panel size. The handle stops at the boundaries. Values outside the range are clamped."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <ResizablePanel
            defaultValue={constrainedWidth}
            minValue={180}
            maxValue={400}
            onValueChange={setConstrainedWidth}
            classes={{
              root: panelRootClass("amber"),
              handle: handleClass("amber"),
            }}
          >
            {simpleContent("amber", "Constrained", constrainedWidth)}
          </ResizablePanel>
        </DemoWrapper>
      </Section>

      {/* ─── Custom Step Size ─────────────────────────────────────────── */}
      <Section
        title="Custom Step Size"
        description="The step prop controls how many pixels each arrow key press moves. Shift+Arrow multiplies by 5x."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="flex-col">
          <div className="w-full space-y-4">
            <div className={c.note}>
              Tab to the handle, then use arrow keys. Each press moves{" "}
              <strong>25px</strong> (Shift+Arrow: 125px).
            </div>
            <ResizablePanel
              defaultValue={customStepWidth}
              minValue={100}
              maxValue={500}
              step={25}
              onValueChange={setCustomStepWidth}
              classes={{
                root: panelRootClass("amber"),
                handle: handleClass("amber"),
              }}
            >
              {simpleContent("amber", "Step: 25px", customStepWidth)}
            </ResizablePanel>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Disabled ─────────────────────────────────────────────────── */}
      <Section
        title="Disabled"
        description="Set disabled to prevent all resize interactions. The handle is removed from tab order, pointer and keyboard events are ignored, and data-disabled is applied for CSS targeting."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="flex-col">
          <div className="w-full space-y-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setDisabledToggle((p) => !p)}
                className={
                  disabledToggle
                    ? `px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors bg-cl-error hover:bg-cl-error text-cl-bg dark:bg-cl-error dark:hover:bg-cl-error dark:text-cl-bg`
                    : `px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors bg-cl-success hover:bg-cl-success text-cl-bg dark:bg-cl-success dark:hover:bg-cl-success dark:text-cl-bg`
                }
              >
                {disabledToggle ? "Disabled" : "Enabled"} — Click to toggle
              </button>
            </div>
            <ResizablePanel
              defaultValue={280}
              disabled={disabledToggle}
              classes={{
                root: `h-40 rounded-cl-md bg-cl-bg-elevated border border-cl-border transition-opacity ${
                  disabledToggle ? "opacity-60" : ""
                }`,
                handle: disabledToggle ? "" : handleClass("blue"),
              }}
            >
              <div className="p-4">
                <p className={`font-medium ${disabledToggle ? "text-cl-text-tertiary" : "text-cl-text"}`}>
                  {disabledToggle ? "Disabled Panel" : "Enabled Panel"}
                </p>
                <p className="text-sm mt-2 text-cl-text-tertiary">
                  {disabledToggle ? "Cannot be resized" : "Drag to resize"}
                </p>
              </div>
            </ResizablePanel>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Keyboard Navigation ──────────────────────────────────────── */}
      <Section
        title="Keyboard Navigation"
        description="Focus the resize handle (Tab to it) and use arrow keys to resize. Shift+Arrow moves by 5x the step. Home and End jump to min/max. Press Escape during a drag to cancel and restore the original size."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <ResizablePanel
            defaultValue={300}
            minValue={150}
            maxValue={500}
            step={10}
            classes={{
              root: panelRootClass("blue"),
              handle: handleClass("blue"),
            }}
          >
            <div className="p-4">
              <p
                className="font-medium text-cl-text"
              >
                Tab to the handle, then use arrow keys
              </p>
              <p
                className="text-sm mt-2 text-cl-text-tertiary"
              >
                Step: 10px | Shift+Arrow: 50px | Escape: cancel drag
              </p>
            </div>
          </ResizablePanel>
        </DemoWrapper>
      </Section>

      {/* ─── Escape to Cancel Drag ────────────────────────────────────── */}
      <Section
        title="Escape to Cancel Drag"
        description="During an active pointer drag, pressing Escape cancels the resize and restores the size to its value before the drag started."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <ResizablePanel
            defaultValue={300}
            minValue={150}
            maxValue={500}
            classes={{
              root: panelRootClass("blue"),
              handle: handleClass("blue"),
            }}
          >
            <div className="p-4">
              <p
                className="font-medium text-cl-text"
              >
                Start dragging, then press Escape
              </p>
              <p
                className="text-sm mt-2 text-cl-text-tertiary"
              >
                Size snaps back to where it was before the drag
              </p>
            </div>
          </ResizablePanel>
        </DemoWrapper>
        <div className={c.note}>
          <strong>Note:</strong> Escape only works during an active pointer
          drag. For keyboard resizing (arrow keys), each key press is an
          individual resize action with its own onResizeStart/onResizeEnd
          lifecycle.
        </div>
      </Section>

      {/* ─── Resize Callbacks ─────────────────────────────────────────── */}
      <Section
        title="Resize Callbacks"
        description="Use onResizeStart and onResizeEnd to respond to the start and end of a resize gesture. Both receive the current size value. onValueChange fires continuously during resize."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="flex-col">
          <div className="w-full space-y-4">
            <ResizablePanel
              defaultValue={callbackWidth}
              minValue={200}
              maxValue={500}
              onValueChange={setCallbackWidth}
              onResizeStart={(w) =>
                addLog(
                  `[${new Date().toLocaleTimeString()}] onResizeStart \u2192 ${Math.round(w)}px`,
                )
              }
              onResizeEnd={(w) =>
                addLog(
                  `[${new Date().toLocaleTimeString()}] onResizeEnd \u2192 ${Math.round(w)}px`,
                )
              }
              classes={{
                root: panelRootClass("blue"),
                handle: handleClass("blue"),
              }}
            >
              {simpleContent("blue", "Resize me", callbackWidth)}
            </ResizablePanel>
            <div
              ref={logRef}
              className={`h-28 overflow-y-auto rounded-cl-md border p-3 font-mono text-xs bg-cl-bg-hover border-cl-border text-cl-text-secondary dark:bg-cl-bg dark:border dark:border-cl-border dark:text-cl-text-secondary`}
            >
              {callbackLog.length === 0 ? (
                <span className={dark ? "text-cl-text-tertiary" : "text-cl-text-tertiary"}>
                  Drag the handle to see resize events...
                </span>
              ) : (
                callbackLog.map((msg, i) => <div key={i}>{msg}</div>)
              )}
            </div>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Custom Styling (classes) ─────────────────────────────────── */}
      <Section
        title="Custom Styling (classes)"
        description="Use the classes prop to style the root container and the drag handle independently. Both keys accept Tailwind classes."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <ResizablePanel
            defaultValue={styledWidth}
            minValue={200}
            maxValue={500}
            onValueChange={setStyledWidth}
            classes={{
              root: `h-32 rounded-cl-md border bg-linear-to-r from-cl-accent/10 to-cl-accent/10 border-cl-border-input-focus dark:bg-linear-to-r dark:from-cl-accent/60 dark:to-cl-accent/60 dark:border dark:border-cl-border-input-focus`,
              handle: `rounded-full bg-linear-to-b from-cl-accent/30 to-cl-accent/30 hover:from-cl-accent hover:to-cl-accent dark:bg-linear-to-b dark:from-cl-accent dark:to-cl-accent dark:hover:from-cl-accent/30 dark:hover:to-cl-accent/30 transition-colors`,
            }}
          >
            <div className="p-4">
              <p
                className="font-medium text-cl-text"
              >
                Gradient Styling
              </p>
              <p
                className="text-sm mt-2 text-cl-text-tertiary"
              >
                Custom handle and root styles via classes
              </p>
            </div>
          </ResizablePanel>
        </DemoWrapper>
      </Section>

      {/* ─── Handle Content ───────────────────────────────────────────── */}
      <Section
        title="Handle Content"
        description="Use the handleContent prop to render custom content (grip icons, dots, etc.) inside the separator handle."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <ResizablePanel
            defaultValue={300}
            minValue={200}
            maxValue={500}
            classes={{
              root: panelRootClass("blue"),
              handle: `${handleClass("blue")} flex items-center justify-center`,
            }}
            handleContent={
              <svg
                width="4"
                height="16"
                viewBox="0 0 4 16"
                fill="currentColor"
                className={dark ? "text-cl-accent" : "text-cl-accent"}
                aria-hidden="true"
              >
                <circle cx="2" cy="2" r="1.5" />
                <circle cx="2" cy="8" r="1.5" />
                <circle cx="2" cy="14" r="1.5" />
              </svg>
            }
          >
            <div className="p-4">
              <p
                className="font-medium text-cl-text"
              >
                Panel with Grip Handle
              </p>
              <p
                className="text-sm mt-2 text-cl-text-tertiary"
              >
                Three-dot grip icon rendered inside the handle
              </p>
            </div>
          </ResizablePanel>
        </DemoWrapper>
      </Section>

      {/* ─── className + classes.root Merging ─────────────────────────── */}
      <Section
        title="className + classes.root Merging"
        description="When both className and classes.root are provided, they are merged via tailwind-merge. className is a shorthand for classes.root."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <ResizablePanel
            defaultValue={280}
            minValue={150}
            maxValue={450}
            className="h-32 rounded-cl-md"
            classes={{
              root: "bg-cl-bg-elevated border border-cl-border",
              handle: handleClass("blue"),
            }}
          >
            <div className="p-4">
              <p className="font-medium text-cl-text">
                Both className and classes.root
              </p>
              <p className="text-sm mt-2 text-cl-text-tertiary">
                className=&quot;h-32 rounded-cl-md&quot; + classes.root=&quot;bg-cl-bg-elevated ...&quot;
              </p>
            </div>
          </ResizablePanel>
        </DemoWrapper>
      </Section>

      {/* ─── Side-by-Side Panels ──────────────────────────────────────── */}
      <Section
        title="Side-by-Side Panels"
        description="Two resizable panels side by side, simulating a split view layout."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="flex flex-col sm:flex-row h-auto sm:h-64 w-full">
            <ResizablePanel
              defaultValue={sidebarWidth}
              minValue={150}
              maxValue={400}
              onValueChange={setSidebarWidth}
              aria-label="Resize sidebar"
              classes={{
                root: `h-full ${panelRootClass("purple")}`,
                handle: handleClass("purple"),
              }}
            >
              <div className="p-4">
                <p
                  className="font-medium text-cl-text"
                >
                  Sidebar
                </p>
                <p
                  className="text-sm mt-2 text-cl-text-tertiary"
                >
                  Width: {Math.round(sidebarWidth)}px
                </p>
                <ul className="mt-4 space-y-1 text-sm">
                  {["Navigation 1", "Navigation 2", "Navigation 3"].map(
                    (item) => (
                      <li
                        key={item}
                        className="px-2 py-1.5 rounded-cl-md text-cl-text-secondary hover:bg-cl-bg-hover hover:text-cl-text transition-colors cursor-pointer"
                      >
                        {item}
                      </li>
                    ),
                  )}
                </ul>
              </div>
            </ResizablePanel>
            <div
 className={`flex-1 p-4 rounded-b-lg sm:rounded-b-none sm:rounded-r-lg sm:border-l-0 bg-cl-bg-hover border border-cl-border dark:bg-cl-bg-elevated dark:border dark:border-cl-border`}
            >
              <p
                className={`font-medium text-cl-text`}
              >
                Main Content
              </p>
              <p
                className={`text-sm mt-2 text-cl-text-secondary`}
              >
                This area expands as the sidebar shrinks.
              </p>
            </div>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Three-Segment Layout ─────────────────────────────────────── */}
      <Section
        title="Three-Segment Layout"
        description="Left and right panels are resizable, center expands to fill remaining space."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="flex flex-col sm:flex-row h-auto sm:h-80 w-full">
            <ResizablePanel
              defaultValue={leftPanelWidth}
              minValue={150}
              maxValue={350}
              onValueChange={setLeftPanelWidth}
              aria-label="Resize left panel"
              classes={{
                root: `h-full ${panelRootClass("indigo")}`,
                handle: handleClass("indigo"),
              }}
            >
              <div className="p-4 h-full flex flex-col">
                <p
                  className={`font-medium text-cl-accent dark:text-cl-accent`}
                >
                  Left Panel
                </p>
                <p
                  className="text-sm mt-2 text-cl-text-tertiary"
                >
                  Width: {Math.round(leftPanelWidth)}px
                </p>
                <div className="mt-4 flex-1 space-y-2">
                  {[
                    "Navigation Item 1",
                    "Navigation Item 2",
                    "Navigation Item 3",
                  ].map((item) => (
                    <div
                      key={item}
                      className="px-3 py-2 rounded-cl-md text-sm text-cl-text-secondary hover:bg-cl-bg-hover hover:text-cl-text transition-colors cursor-pointer"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </ResizablePanel>

            <div
              className={`flex-1 p-4 flex flex-col border sm:border-x-0 sm:border-y bg-cl-bg-hover border-cl-border dark:bg-cl-bg-elevated dark:border dark:border-cl-border`}
            >
              <p
                className={`font-medium text-cl-text`}
              >
                Center Panel
              </p>
              <p
                className={`text-sm mt-2 text-cl-text-secondary`}
              >
                Flexible width &mdash; expands to fill available space
              </p>
              <div
                className={`mt-4 flex-1 rounded border p-4 bg-white border-cl-border dark:bg-cl-bg dark:border dark:border-cl-border`}
              >
                <p
                  className={`text-sm text-cl-text-tertiary`}
                >
                  Main content area
                </p>
              </div>
            </div>

            <ResizablePanel
              defaultValue={rightPanelWidth}
              minValue={150}
              maxValue={350}
              onValueChange={setRightPanelWidth}
              resizeDirection="left"
              aria-label="Resize right panel"
              classes={{
                root: `h-full ${panelRootClass("teal")}`,
                handle: handleClass("teal"),
              }}
            >
              <div className="p-4 h-full flex flex-col">
                <p
                  className={`font-medium text-cl-accent dark:text-cl-accent`}
                >
                  Right Panel
                </p>
                <p
                  className={`text-sm mt-2 text-cl-accent dark:text-cl-accent`}
                >
                  Width: {Math.round(rightPanelWidth)}px
                </p>
                <div className="mt-4 flex-1 space-y-2">
                  {["Details Section", "Properties", "Actions"].map((item) => (
                    <div
                      key={item}
                      className="px-3 py-2 rounded-cl-md text-sm text-cl-text-secondary hover:bg-cl-bg-hover hover:text-cl-text transition-colors cursor-pointer"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </ResizablePanel>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Custom ID ────────────────────────────────────────────────── */}
      <Section
        title="Custom ID"
        description="Use the id prop for deterministic IDs useful for SSR and testing. When omitted, a unique ID is auto-generated via useId()."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <ResizablePanel
            id="my-resizable"
            defaultValue={280}
            minValue={150}
            maxValue={450}
            classes={{
              root: panelRootClass("blue"),
              handle: handleClass("blue"),
            }}
          >
            <div className="p-4">
              <p
                className="font-medium text-cl-text"
              >
                Custom ID Panel
              </p>
              <p
                className="text-sm mt-2 text-cl-text-tertiary"
              >
                id=&quot;my-resizable&quot;
              </p>
            </div>
          </ResizablePanel>
        </DemoWrapper>
      </Section>

      {/* ─── Custom Aria Label ────────────────────────────────────────── */}
      <Section
        title="Custom Aria Label"
        description='Use aria-label to provide a meaningful accessible name for the resize handle. Defaults to "Resize panel".'
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <ResizablePanel
            defaultValue={280}
            minValue={150}
            maxValue={450}
            aria-label="Resize sidebar navigation"
            classes={{
              root: panelRootClass("blue"),
              handle: handleClass("blue"),
            }}
          >
            <div className="p-4">
              <p
                className="font-medium text-cl-text"
              >
                Custom Aria Label
              </p>
              <p
                className="text-sm mt-2 text-cl-text-tertiary"
              >
                aria-label=&quot;Resize sidebar navigation&quot;
              </p>
            </div>
          </ResizablePanel>
        </DemoWrapper>
      </Section>

      {/* ─── Props ────────────────────────────────────────────────────── */}
      <Section title="ResizablePanel Props" isDarkMode={dark}>
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow
              name="children"
              type="ReactNode"
              description="Content to render inside the panel"
              isDarkMode={dark}
            />
            <PropRow
              name="value"
              type="number"
              description="Controlled panel size in pixels (width or height depending on resizeDirection)"
              isDarkMode={dark}
            />
            <PropRow
              name="defaultValue"
              type="number"
              defaultVal="300"
              description="Initial size for uncontrolled mode (clamped to [minValue, maxValue])"
              isDarkMode={dark}
            />
            <PropRow
              name="onValueChange"
              type="(value: number) => void"
              description="Callback fired continuously as size changes during resize"
              isDarkMode={dark}
            />
            <PropRow
              name="onResizeStart"
              type="(value: number) => void"
              description="Callback fired when a resize gesture begins, receiving the current size"
              isDarkMode={dark}
            />
            <PropRow
              name="onResizeEnd"
              type="(value: number) => void"
              description="Callback fired when a resize gesture ends, with the final size"
              isDarkMode={dark}
            />
            <PropRow
              name="minValue"
              type="number"
              defaultVal="200"
              description="Minimum size constraint in pixels"
              isDarkMode={dark}
            />
            <PropRow
              name="maxValue"
              type="number"
              defaultVal="800"
              description="Maximum size constraint in pixels"
              isDarkMode={dark}
            />
            <PropRow
              name="resizeDirection"
              type='"left" | "right" | "top" | "bottom"'
              defaultVal='"right"'
              description='Which edge has the resize handle. "left"/"right" manage width; "top"/"bottom" manage height.'
              isDarkMode={dark}
            />
            <PropRow
              name="step"
              type="number"
              defaultVal="10"
              description="Keyboard arrow key increment in pixels (Shift multiplies by 5)"
              isDarkMode={dark}
            />
            <PropRow
              name="disabled"
              type="boolean"
              defaultVal="false"
              description="Disable all resize interactions (pointer, keyboard, and focus)"
              isDarkMode={dark}
            />
            <PropRow
              name="aria-label"
              type="string"
              defaultVal='"Resize panel"'
              description="Accessible label for the separator handle element"
              isDarkMode={dark}
            />
            <PropRow
              name="classes"
              type="ResizablePanelClasses"
              defaultVal="{}"
              description="Object of class overrides for internal slots (root, handle)"
              isDarkMode={dark}
            />
            <PropRow
              name="handleContent"
              type="ReactNode"
              description="Content rendered inside the separator handle (e.g. grip icon)"
              isDarkMode={dark}
            />
            <PropRow
              name="className"
              type="string"
              description="Shorthand for classes.root — merged with classes.root when both are provided"
              isDarkMode={dark}
            />
            <PropRow
              name="style"
              type="CSSProperties"
              description="Inline styles merged onto the root element (managed size property cannot be overridden)"
              isDarkMode={dark}
            />
            <PropRow
              name="id"
              type="string"
              defaultVal="auto-generated"
              description="Deterministic ID for the root element (auto-generated via useId if omitted)"
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
              name="...rest"
              type="HTMLDivElement props"
              description="All standard HTML div attributes are forwarded to the root element (e.g. data-testid, event handlers)"
              isDarkMode={dark}
            />
          </PropsTable>
        </div>
      </Section>

      {/* ─── ResizablePanelClasses Slots ──────────────────────────────── */}
      <Section title="ResizablePanelClasses Slots" isDarkMode={dark}>
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow
              name="root"
              type="string"
              description="Root container div that wraps children and the handle"
              isDarkMode={dark}
            />
            <PropRow
              name="handle"
              type="string"
              description='Drag handle element (role="separator") — positioned on the edge specified by resizeDirection'
              isDarkMode={dark}
            />
          </PropsTable>
        </div>
      </Section>

      {/* ─── Data Attributes ──────────────────────────────────────────── */}
      <Section
        title="Data Attributes"
        description="Use for CSS-based state styling."
        isDarkMode={dark}
      >
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow
              name="data-resizing"
              type="root, handle"
              description="Present during an active pointer drag"
              isDarkMode={dark}
            />
            <PropRow
              name="data-disabled"
              type="root, handle"
              description="Present when the component is disabled"
              isDarkMode={dark}
            />
            <PropRow
              name="data-direction"
              type="handle"
              description='"left", "right", "top", or "bottom" — which edge the handle is on'
              isDarkMode={dark}
            />
          </PropsTable>
        </div>
      </Section>

      {/* ─── CSS Custom Properties ────────────────────────────────────── */}
      <Section
        title="CSS Custom Properties"
        description="The component exposes CSS custom properties on the root element for flexible styling and integration with external CSS."
        isDarkMode={dark}
      >
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow
              name="--resizable-panel-size"
              type="root"
              description="Current size in pixels (rounded)"
              isDarkMode={dark}
            />
            <PropRow
              name="--resizable-panel-min"
              type="root"
              description="Minimum size constraint in pixels"
              isDarkMode={dark}
            />
            <PropRow
              name="--resizable-panel-max"
              type="root"
              description="Maximum size constraint in pixels"
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
            className={`space-y-2 text-sm text-cl-text-secondary`}
          >
            {[
              'Handle has role="separator" with aria-orientation set per the WAI-ARIA window splitter pattern',
              "aria-controls on the separator references the panel's id, linking the handle to the element it controls",
              "aria-valuenow, aria-valuemin, and aria-valuemax expose current and allowed size range to assistive technology",
              'aria-valuetext provides a human-readable announcement (e.g. "300 pixels")',
              "aria-label on the handle for screen reader identification (customizable via prop)",
              "Full keyboard navigation: ArrowLeft/ArrowRight for horizontal, ArrowUp/ArrowDown for vertical, Home/End, Shift for large increments, Escape to cancel drag",
              "Keyboard resizing fires onResizeStart and onResizeEnd per key press for consistent lifecycle hooks",
              "Handle is focusable via tabIndex=0 (disabled handle gets tabIndex=-1)",
              "aria-disabled on the handle when disabled",
              "Pointer events (not mouse events) for cross-device support including touch, pen, and mouse",
              "setPointerCapture ensures drag events are received even when pointer leaves the browser window",
              "Handles pointercancel for interrupted touch gestures (e.g. incoming calls)",
              "touch-none and select-none on the handle prevent browser scroll and text selection interference",
              "motion-reduce:transition-none respects reduced-motion preferences",
              "No opinionated focus ring styles — browser native focus indicator preserved",
              "Deterministic IDs via useId() for SSR safety, overridable with the id prop",
              "Only primary pointer button (button === 0) initiates drag",
              "Body cursor and user-select overrides are saved and restored, preventing conflicts",
              "CSS custom properties (--resizable-panel-size, --resizable-panel-min, --resizable-panel-max) for external CSS integrations",
              "All standard HTML div attributes forwarded via rest props",
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
        <div className={`${c.card} mt-3`}>
          <p
            className={`text-xs font-semibold mb-3 text-cl-text-secondary`}
          >
            Keyboard Reference
          </p>
          <div
            className={`space-y-2 text-sm text-cl-text-secondary`}
          >
            {[
              ["Tab", "Focus the resize handle"],
              ["\u2192", "Increase width (horizontal panels)"],
              ["\u2190", "Decrease width (horizontal panels)"],
              ["\u2193", "Increase height (vertical panels)"],
              ["\u2191", "Decrease height (vertical panels)"],
              ["Shift+Arrow", "Resize by 5\u00D7 step size"],
              ["Home", "Jump to minimum size (minValue)"],
              ["End", "Jump to maximum size (maxValue)"],
              ["Escape", "Cancel active drag and restore original size"],
            ].map(([key, desc]) => (
              <div key={key} className="flex items-center gap-3">
                <kbd className={c.kbd}>{key}</kbd>
                <span>{desc}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <DocControlledPattern
        isDarkMode={dark}
        summary="Use `value` with `onValueChange` for controlled size, or `defaultValue` for uncontrolled. Values are clamped to `minValue` and `maxValue`—keep parent state in range when possible."
      />
      <DocEdgeCases
        isDarkMode={dark}
        items={[
          "Window resize can invalidate stored sizes—consider persisting ratios, not pixels.",
          "Touch drag vs keyboard step may need different UX affordances.",
          "Nested scroll areas can steal pointer events—test drag handles carefully.",
        ]}
      />
      <DocDoDont
        isDarkMode={dark}
        dos={[
          "Provide `aria-label` or `aria-labelledby` for the separator/handle.",
          "Expose resize via keyboard per implementation (step, home/end).",
          "Honor `prefers-reduced-motion` when animating layout changes.",
        ]}
        donts={[
          "Do not set `minValue` greater than `maxValue`.",
          "Do not use a zero-width handle without a visible focus ring.",
          "Do not block critical content behind a zero-size panel.",
        ]}
      />
    </div>
  );
};

export default ResizablePanelDemo;
