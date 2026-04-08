import { useState, useRef } from "react";
import { ResizablePanel } from "../../components/ResizablePanel";
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
  panel: {
    root: "",
    handle: "",
  },
  card: `rounded-2xl border p-5 ${dark ? "border-white/[0.06] bg-linear-to-br from-white/[0.03] to-white/[0.01]" : "border-gray-200 bg-white shadow-sm shadow-gray-900/[0.04]"}`,
  kbd: `px-2 py-1 rounded-md text-[11px] font-mono min-w-[2.5rem] text-center font-medium ${dark ? "bg-gray-900 border border-white/10 text-gray-300 shadow-sm" : "bg-white border border-gray-200 text-gray-600 shadow-sm"}`,
  label: `text-xs font-medium ${dark ? "text-gray-500" : "text-gray-400"}`,
  note: `mt-3 p-3 rounded-lg text-xs ${dark ? "bg-blue-900/20 border border-blue-800/50 text-blue-300" : "bg-blue-50 border border-blue-200 text-blue-700"}`,
  btn: `px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${dark ? "bg-gray-700 text-gray-200 hover:bg-gray-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
  btnPrimary: `px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${dark ? "bg-indigo-500 text-white hover:bg-indigo-600" : "bg-indigo-600 text-white hover:bg-indigo-700"}`,
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

  const sidebarContent = (width: number) => (
    <div className="h-full p-4 flex flex-col gap-3">
      <div className={`text-xs font-semibold uppercase tracking-wider ${dark ? "text-blue-400" : "text-blue-600"}`}>Sidebar</div>
      <div className="space-y-2">
        {["Dashboard", "Projects", "Team", "Settings"].map((item) => (
          <div key={item} className={`px-3 py-1.5 rounded-md text-sm ${dark ? "text-gray-300 hover:bg-white/4" : "text-gray-600 hover:bg-gray-100"} cursor-pointer transition-colors`}>{item}</div>
        ))}
      </div>
      <div className={`mt-auto text-[10px] font-mono ${dark ? "text-blue-500/60" : "text-blue-400/60"}`}>{Math.round(width)}px</div>
    </div>
  );

  const editorContent = (height: number) => (
    <div className="h-full p-4 flex flex-col gap-2">
      <div className={`text-xs font-semibold uppercase tracking-wider ${dark ? "text-green-400" : "text-green-600"}`}>Editor</div>
      <div className={`flex-1 rounded-md p-3 font-mono text-xs leading-relaxed ${dark ? "bg-black/20 text-green-300/80" : "bg-white/60 text-green-700/80"}`}>
        <div>{"const app = express();"}</div>
        <div>{"app.get('/', handler);"}</div>
        <div>{"app.listen(3000);"}</div>
      </div>
      <div className={`text-[10px] font-mono ${dark ? "text-green-500/60" : "text-green-400/60"}`}>{Math.round(height)}px</div>
    </div>
  );

  const previewContent = (width: number) => (
    <div className="h-full p-4 flex flex-col gap-2">
      <div className={`text-xs font-semibold uppercase tracking-wider ${dark ? "text-purple-400" : "text-purple-600"}`}>Preview</div>
      <div className={`flex-1 rounded-md flex items-center justify-center ${dark ? "bg-purple-900/20" : "bg-purple-50/80"}`}>
        <div className="text-center">
          <div className={`text-2xl font-bold ${dark ? "text-purple-300" : "text-purple-700"}`}>Preview</div>
          <div className={`text-xs mt-1 ${dark ? "text-purple-400/60" : "text-purple-400"}`}>Live output here</div>
        </div>
      </div>
      <div className={`text-[10px] font-mono ${dark ? "text-purple-500/60" : "text-purple-400/60"}`}>{Math.round(width)}px</div>
    </div>
  );

  const simpleContent = (color: string, label: string, size: number) => {
    const cl = {
      blue: { text: dark ? "text-blue-400" : "text-blue-600", muted: dark ? "text-blue-500/60" : "text-blue-400/60" },
      green: { text: dark ? "text-green-400" : "text-green-600", muted: dark ? "text-green-500/60" : "text-green-400/60" },
      amber: { text: dark ? "text-amber-400" : "text-amber-600", muted: dark ? "text-amber-500/60" : "text-amber-400/60" },
      indigo: { text: dark ? "text-indigo-400" : "text-indigo-600", muted: dark ? "text-indigo-500/60" : "text-indigo-400/60" },
      teal: { text: dark ? "text-teal-400" : "text-teal-600", muted: dark ? "text-teal-500/60" : "text-teal-400/60" },
      purple: { text: dark ? "text-purple-400" : "text-purple-600", muted: dark ? "text-purple-500/60" : "text-purple-400/60" },
    }[color] ?? { text: dark ? "text-gray-400" : "text-gray-600", muted: dark ? "text-gray-500" : "text-gray-400" };
    return (
      <div className="h-full p-4 flex flex-col justify-between">
        <div className={`text-xs font-semibold uppercase tracking-wider ${cl.text}`}>{label}</div>
        <div className={`text-[10px] font-mono ${cl.muted}`}>{Math.round(size)}px</div>
      </div>
    );
  };

  const handleClass = (color: string) => {
    const map: Record<string, string> = {
      blue: dark
        ? "bg-blue-600 hover:bg-blue-500 transition-colors motion-reduce:transition-none"
        : "bg-blue-300 hover:bg-blue-500 transition-colors motion-reduce:transition-none",
      green: dark
        ? "bg-green-600 hover:bg-green-500 transition-colors motion-reduce:transition-none"
        : "bg-green-300 hover:bg-green-500 transition-colors motion-reduce:transition-none",
      purple: dark
        ? "bg-purple-600 hover:bg-purple-500 transition-colors motion-reduce:transition-none"
        : "bg-purple-300 hover:bg-purple-500 transition-colors motion-reduce:transition-none",
      indigo: dark
        ? "bg-indigo-600 hover:bg-indigo-500 transition-colors motion-reduce:transition-none"
        : "bg-indigo-300 hover:bg-indigo-500 transition-colors motion-reduce:transition-none",
      teal: dark
        ? "bg-teal-600 hover:bg-teal-500 transition-colors motion-reduce:transition-none"
        : "bg-teal-300 hover:bg-teal-500 transition-colors motion-reduce:transition-none",
      amber: dark
        ? "bg-amber-600 hover:bg-amber-500 transition-colors motion-reduce:transition-none"
        : "bg-amber-300 hover:bg-amber-500 transition-colors motion-reduce:transition-none",
    };
    return map[color] ?? map.blue;
  };

  const panelRootClass = (color: string) => {
    const map: Record<string, string> = {
      blue: dark
        ? "h-40 bg-blue-950/40 rounded-lg border border-blue-800"
        : "h-40 bg-blue-50 rounded-lg border border-blue-200",
      green: dark
        ? "h-40 bg-green-950/40 rounded-lg border border-green-800"
        : "h-40 bg-green-50 rounded-lg border border-green-200",
      purple: dark
        ? "bg-purple-950/40 border border-purple-800 rounded-l-lg"
        : "bg-purple-50 border border-purple-200 rounded-l-lg",
      indigo: dark
        ? "bg-indigo-950/40 border border-indigo-800 rounded-l-lg"
        : "bg-indigo-50 border border-indigo-200 rounded-l-lg",
      teal: dark
        ? "bg-teal-950/40 border border-teal-800 rounded-r-lg"
        : "bg-teal-50 border border-teal-200 rounded-r-lg",
      amber: dark
        ? "h-40 bg-amber-950/40 rounded-lg border border-amber-800"
        : "h-40 bg-amber-50 rounded-lg border border-amber-200",
    };
    return map[color] ?? map.blue;
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
            ResizablePanel
          </h1>
          <p
            className={`text-sm leading-relaxed max-w-2xl ${dark ? "text-gray-400" : "text-gray-600"}`}
          >
            A panel component with a draggable separator handle for resizing.
            Supports horizontal and vertical orientations, keyboard navigation,
            pointer events for mouse and touch, controlled and uncontrolled
            modes, custom constraints, resize callbacks, Escape to cancel,
            handle content slots, CSS custom properties, and full accessibility
            via WAI-ARIA separator semantics.
          </p>
          <div className="mt-5">
            <pre className={`p-3.5 rounded-xl text-[13px] leading-relaxed overflow-x-auto whitespace-pre-wrap break-all ${dark ? "bg-linear-to-br from-gray-800 to-gray-900 text-gray-300 border border-white/6" : "bg-gray-50 text-gray-700 border border-gray-200"}`}>
              <code>{`import { ResizablePanel } from "@chumlab/ui/resizable-panel";`}</code>
            </pre>
          </div>
        </div>
      </header>

      {/* ─── Basic Usage ────────────────────────────────────────────────── */}
      <Section
        title="Basic Usage"
        description="Works out-of-the-box with built-in styles and dark mode. Drag the right edge to resize. No custom classes needed."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          {/* Basic usage — drag the edge to resize */}
          <ResizablePanel
            defaultValue={300}
            minValue={150}
            maxValue={500}
          >
            <div className="h-full p-4">
              <div className={`text-sm ${dark ? "text-gray-300" : "text-gray-600"}`}>
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
              root: panelRootClass("blue"),
              handle: handleClass("blue"),
            }}
          >
            {sidebarContent(rightWidth)}
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
              root: dark
                ? "w-full bg-blue-950/40 rounded-lg border border-blue-800"
                : "w-full bg-blue-50 rounded-lg border border-blue-200",
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
                root: dark
                  ? "w-full bg-green-950/40 rounded-lg border border-green-800"
                  : "w-full bg-green-50 rounded-lg border border-green-200",
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
                className={`font-medium ${dark ? "text-blue-300" : "text-blue-800"}`}
              >
                Uncontrolled Panel
              </p>
              <p
                className={`text-sm mt-2 ${dark ? "text-blue-400" : "text-blue-600"}`}
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
                className={`text-sm font-medium whitespace-nowrap ${dark ? "text-gray-300" : "text-gray-700"}`}
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
                    ? `px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${dark ? "bg-red-600 hover:bg-red-500 text-white" : "bg-red-600 hover:bg-red-700 text-white"}`
                    : `px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${dark ? "bg-green-600 hover:bg-green-500 text-white" : "bg-green-600 hover:bg-green-700 text-white"}`
                }
              >
                {disabledToggle ? "Disabled" : "Enabled"} — Click to toggle
              </button>
            </div>
            <ResizablePanel
              defaultValue={280}
              disabled={disabledToggle}
              classes={{
                root: `h-40 rounded-lg border transition-opacity ${
                  disabledToggle
                    ? dark
                      ? "bg-gray-700/50 border-gray-600 opacity-60"
                      : "bg-gray-100 border-gray-300 opacity-60"
                    : dark
                      ? "bg-blue-950/40 border-blue-800"
                      : "bg-blue-50 border-blue-200"
                }`,
                handle: disabledToggle ? "" : handleClass("blue"),
              }}
            >
              <div className="p-4">
                <p
                  className={`font-medium ${disabledToggle ? (dark ? "text-gray-400" : "text-gray-500") : dark ? "text-blue-300" : "text-blue-800"}`}
                >
                  {disabledToggle ? "Disabled Panel" : "Enabled Panel"}
                </p>
                <p
                  className={`text-sm mt-2 ${disabledToggle ? (dark ? "text-gray-500" : "text-gray-400") : dark ? "text-blue-400" : "text-blue-600"}`}
                >
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
                className={`font-medium ${dark ? "text-blue-300" : "text-blue-800"}`}
              >
                Tab to the handle, then use arrow keys
              </p>
              <p
                className={`text-sm mt-2 ${dark ? "text-blue-400" : "text-blue-600"}`}
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
                className={`font-medium ${dark ? "text-blue-300" : "text-blue-800"}`}
              >
                Start dragging, then press Escape
              </p>
              <p
                className={`text-sm mt-2 ${dark ? "text-blue-400" : "text-blue-600"}`}
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
              className={`h-28 overflow-y-auto rounded-lg border p-3 font-mono text-xs ${dark ? "bg-gray-900 border-gray-700 text-gray-300" : "bg-gray-50 border-gray-200 text-gray-600"}`}
            >
              {callbackLog.length === 0 ? (
                <span className={dark ? "text-gray-500" : "text-gray-400"}>
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
              root: `h-32 rounded-lg border ${dark ? "bg-linear-to-r from-purple-950/60 to-pink-950/60 border-purple-800" : "bg-linear-to-r from-purple-50 to-pink-50 border-purple-200"}`,
              handle: `rounded-full ${dark ? "bg-linear-to-b from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400" : "bg-linear-to-b from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500"} transition-colors`,
            }}
          >
            <div className="p-4">
              <p
                className={`font-medium ${dark ? "text-purple-300" : "text-purple-800"}`}
              >
                Gradient Styling
              </p>
              <p
                className={`text-sm mt-2 ${dark ? "text-purple-400" : "text-purple-600"}`}
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
                className={dark ? "text-blue-200" : "text-blue-700"}
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
                className={`font-medium ${dark ? "text-blue-300" : "text-blue-800"}`}
              >
                Panel with Grip Handle
              </p>
              <p
                className={`text-sm mt-2 ${dark ? "text-blue-400" : "text-blue-600"}`}
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
            className="h-32 rounded-lg"
            classes={{
              root: dark
                ? "bg-blue-950/40 border border-blue-800"
                : "bg-blue-50 border border-blue-200",
              handle: handleClass("blue"),
            }}
          >
            <div className="p-4">
              <p
                className={`font-medium ${dark ? "text-blue-300" : "text-blue-800"}`}
              >
                Both className and classes.root
              </p>
              <p
                className={`text-sm mt-2 ${dark ? "text-blue-400" : "text-blue-600"}`}
              >
                className=&quot;h-32 rounded-lg&quot; +
                classes.root=&quot;bg-blue-50 ...&quot;
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
                  className={`font-medium ${dark ? "text-purple-300" : "text-purple-800"}`}
                >
                  Sidebar
                </p>
                <p
                  className={`text-sm mt-2 ${dark ? "text-purple-400" : "text-purple-600"}`}
                >
                  Width: {Math.round(sidebarWidth)}px
                </p>
                <ul className="mt-4 space-y-2 text-sm">
                  {["Navigation 1", "Navigation 2", "Navigation 3"].map(
                    (item) => (
                      <li
                        key={item}
                        className={`px-2 py-1 rounded ${dark ? "bg-purple-900/50 text-purple-300" : "bg-purple-100 text-purple-700"}`}
                      >
                        {item}
                      </li>
                    ),
                  )}
                </ul>
              </div>
            </ResizablePanel>
            <div
              className={`flex-1 p-4 border rounded-b-lg sm:rounded-b-none sm:rounded-r-lg sm:border-l-0 ${dark ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"}`}
            >
              <p
                className={`font-medium ${dark ? "text-white" : "text-gray-800"}`}
              >
                Main Content
              </p>
              <p
                className={`text-sm mt-2 ${dark ? "text-gray-400" : "text-gray-600"}`}
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
                  className={`font-medium ${dark ? "text-indigo-300" : "text-indigo-800"}`}
                >
                  Left Panel
                </p>
                <p
                  className={`text-sm mt-2 ${dark ? "text-indigo-400" : "text-indigo-600"}`}
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
                      className={`px-3 py-2 rounded text-sm ${dark ? "bg-indigo-900/50 text-indigo-300" : "bg-indigo-100 text-indigo-700"}`}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </ResizablePanel>

            <div
              className={`flex-1 p-4 flex flex-col border sm:border-x-0 sm:border-y ${dark ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"}`}
            >
              <p
                className={`font-medium ${dark ? "text-white" : "text-gray-800"}`}
              >
                Center Panel
              </p>
              <p
                className={`text-sm mt-2 ${dark ? "text-gray-400" : "text-gray-600"}`}
              >
                Flexible width &mdash; expands to fill available space
              </p>
              <div
                className={`mt-4 flex-1 rounded border p-4 ${dark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}
              >
                <p
                  className={`text-sm ${dark ? "text-gray-500" : "text-gray-400"}`}
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
                  className={`font-medium ${dark ? "text-teal-300" : "text-teal-800"}`}
                >
                  Right Panel
                </p>
                <p
                  className={`text-sm mt-2 ${dark ? "text-teal-400" : "text-teal-600"}`}
                >
                  Width: {Math.round(rightPanelWidth)}px
                </p>
                <div className="mt-4 flex-1 space-y-2">
                  {["Details Section", "Properties", "Actions"].map((item) => (
                    <div
                      key={item}
                      className={`px-3 py-2 rounded text-sm ${dark ? "bg-teal-900/50 text-teal-300" : "bg-teal-100 text-teal-700"}`}
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
                className={`font-medium ${dark ? "text-blue-300" : "text-blue-800"}`}
              >
                Custom ID Panel
              </p>
              <p
                className={`text-sm mt-2 ${dark ? "text-blue-400" : "text-blue-600"}`}
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
                className={`font-medium ${dark ? "text-blue-300" : "text-blue-800"}`}
              >
                Custom Aria Label
              </p>
              <p
                className={`text-sm mt-2 ${dark ? "text-blue-400" : "text-blue-600"}`}
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
            className={`space-y-2 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
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
