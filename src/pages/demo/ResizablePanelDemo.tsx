import { useState, useRef } from "react";
import { ResizablePanel } from "../../components/ResizablePanel";
import { useTheme } from "./ThemeContext";
import {
  Section,
  DemoWrapper,
  CodeBlock,
  PropsTable,
  PropRow,
} from "./components";

const ResizablePanelDemo = () => {
  const { isDarkMode } = useTheme();

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

  const panelContent = (
    color: string,
    label: string,
    size: number,
    extra?: string,
  ) => {
    const colors: Record<string, { text: string; textMuted: string }> = {
      blue: {
        text: isDarkMode ? "text-blue-300" : "text-blue-800",
        textMuted: isDarkMode ? "text-blue-400" : "text-blue-600",
      },
      green: {
        text: isDarkMode ? "text-green-300" : "text-green-800",
        textMuted: isDarkMode ? "text-green-400" : "text-green-600",
      },
      purple: {
        text: isDarkMode ? "text-purple-300" : "text-purple-800",
        textMuted: isDarkMode ? "text-purple-400" : "text-purple-600",
      },
      indigo: {
        text: isDarkMode ? "text-indigo-300" : "text-indigo-800",
        textMuted: isDarkMode ? "text-indigo-400" : "text-indigo-600",
      },
      teal: {
        text: isDarkMode ? "text-teal-300" : "text-teal-800",
        textMuted: isDarkMode ? "text-teal-400" : "text-teal-600",
      },
      amber: {
        text: isDarkMode ? "text-amber-300" : "text-amber-800",
        textMuted: isDarkMode ? "text-amber-400" : "text-amber-600",
      },
    };
    const c = colors[color] ?? colors.blue;
    return (
      <div className="p-4">
        <p className={`font-medium ${c.text}`}>{label}</p>
        <p className={`text-sm mt-2 ${c.textMuted}`}>
          Size: {Math.round(size)}px
        </p>
        {extra && <p className={`text-sm ${c.textMuted}`}>{extra}</p>}
      </div>
    );
  };

  const handleClass = (color: string) => {
    const map: Record<string, string> = {
      blue: isDarkMode
        ? "bg-blue-600 hover:bg-blue-500 transition-colors motion-reduce:transition-none"
        : "bg-blue-300 hover:bg-blue-500 transition-colors motion-reduce:transition-none",
      green: isDarkMode
        ? "bg-green-600 hover:bg-green-500 transition-colors motion-reduce:transition-none"
        : "bg-green-300 hover:bg-green-500 transition-colors motion-reduce:transition-none",
      purple: isDarkMode
        ? "bg-purple-600 hover:bg-purple-500 transition-colors motion-reduce:transition-none"
        : "bg-purple-300 hover:bg-purple-500 transition-colors motion-reduce:transition-none",
      indigo: isDarkMode
        ? "bg-indigo-600 hover:bg-indigo-500 transition-colors motion-reduce:transition-none"
        : "bg-indigo-300 hover:bg-indigo-500 transition-colors motion-reduce:transition-none",
      teal: isDarkMode
        ? "bg-teal-600 hover:bg-teal-500 transition-colors motion-reduce:transition-none"
        : "bg-teal-300 hover:bg-teal-500 transition-colors motion-reduce:transition-none",
      amber: isDarkMode
        ? "bg-amber-600 hover:bg-amber-500 transition-colors motion-reduce:transition-none"
        : "bg-amber-300 hover:bg-amber-500 transition-colors motion-reduce:transition-none",
    };
    return map[color] ?? map.blue;
  };

  const panelRootClass = (color: string) => {
    const map: Record<string, string> = {
      blue: isDarkMode
        ? "h-40 bg-blue-950/40 rounded-lg border border-blue-800"
        : "h-40 bg-blue-50 rounded-lg border border-blue-200",
      green: isDarkMode
        ? "h-40 bg-green-950/40 rounded-lg border border-green-800"
        : "h-40 bg-green-50 rounded-lg border border-green-200",
      purple: isDarkMode
        ? "bg-purple-950/40 border border-purple-800 rounded-l-lg"
        : "bg-purple-50 border border-purple-200 rounded-l-lg",
      indigo: isDarkMode
        ? "bg-indigo-950/40 border border-indigo-800 rounded-l-lg"
        : "bg-indigo-50 border border-indigo-200 rounded-l-lg",
      teal: isDarkMode
        ? "bg-teal-950/40 border border-teal-800 rounded-r-lg"
        : "bg-teal-50 border border-teal-200 rounded-r-lg",
      amber: isDarkMode
        ? "h-40 bg-amber-950/40 rounded-lg border border-amber-800"
        : "h-40 bg-amber-50 rounded-lg border border-amber-200",
    };
    return map[color] ?? map.blue;
  };

  return (
    <div className="space-y-16">
      <header>
        <h1
          className={`text-3xl font-bold mb-3 ${isDarkMode ? "text-white" : "text-gray-900"}`}
        >
          ResizablePanel
        </h1>
        <p
          className={`text-lg ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
        >
          A panel component with a draggable separator handle for resizing.
          Supports horizontal and vertical orientations, keyboard navigation,
          pointer events for mouse and touch, controlled and uncontrolled modes,
          custom constraints, resize callbacks, Escape to cancel, handle content
          slots, CSS custom properties, and full accessibility via WAI-ARIA
          separator semantics.
        </p>

        <div className="mt-6">
          <h3
            className={`text-sm font-semibold mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
          >
            Installation
          </h3>
          <CodeBlock
            isDarkMode={isDarkMode}
            code={`import { ResizablePanel } from "@kern-ui/resizable-panel";`}
          />
        </div>
      </header>

      <div className="space-y-12">
        <h2
          className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}
        >
          Examples
        </h2>

        <Section
          title="Right Resize (Default)"
          description="Drag the right edge to resize the panel. The default resizeDirection is 'right'."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
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
              {panelContent(
                "blue",
                "Right Resizable Panel",
                rightWidth,
                "Min: 200px | Max: 500px",
              )}
            </ResizablePanel>
          </DemoWrapper>
          <CodeBlock
            isDarkMode={isDarkMode}
            code={`<ResizablePanel
  defaultValue={300}
  minValue={200}
  maxValue={500}
  onValueChange={(w) => console.log(w)}
  classes={{
    root: "h-40 bg-blue-50 rounded-lg border border-blue-200",
    handle: "bg-blue-300 hover:bg-blue-500 transition-colors",
  }}
>
  <div className="p-4">Panel content</div>
</ResizablePanel>`}
          />
        </Section>

        <Section
          title="Left Resize"
          description="Set resizeDirection='left' to place the drag handle on the left edge."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
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
                {panelContent(
                  "green",
                  "Left Resizable Panel",
                  leftWidth,
                  "Min: 200px | Max: 600px",
                )}
              </ResizablePanel>
            </div>
          </DemoWrapper>
          <CodeBlock
            isDarkMode={isDarkMode}
            code={`<ResizablePanel
  defaultValue={350}
  resizeDirection="left"
  minValue={200}
  maxValue={600}
  onValueChange={setWidth}
  classes={{
    root: "h-40 bg-green-50 rounded-lg border border-green-200",
    handle: "bg-green-300 hover:bg-green-500 transition-colors",
  }}
>
  <div className="p-4">Left Resizable Panel</div>
</ResizablePanel>`}
          />
        </Section>

        <Section
          title="Bottom Resize (Vertical)"
          description="Set resizeDirection='bottom' for vertical resizing. The handle appears on the bottom edge and the component manages height instead of width."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <ResizablePanel
              defaultValue={bottomHeight}
              minValue={100}
              maxValue={400}
              resizeDirection="bottom"
              onValueChange={setBottomHeight}
              classes={{
                root: isDarkMode
                  ? "w-full bg-blue-950/40 rounded-lg border border-blue-800"
                  : "w-full bg-blue-50 rounded-lg border border-blue-200",
                handle: handleClass("blue"),
              }}
            >
              {panelContent(
                "blue",
                "Bottom Resizable Panel",
                bottomHeight,
                "Min: 100px | Max: 400px",
              )}
            </ResizablePanel>
          </DemoWrapper>
          <CodeBlock
            isDarkMode={isDarkMode}
            code={`<ResizablePanel
  defaultValue={200}
  resizeDirection="bottom"
  minValue={100}
  maxValue={400}
  onValueChange={setHeight}
  classes={{
    root: "w-full bg-blue-50 rounded-lg border border-blue-200",
    handle: "bg-blue-300 hover:bg-blue-500 transition-colors",
  }}
>
  <div className="p-4">Bottom Resizable Panel</div>
</ResizablePanel>`}
          />
        </Section>

        <Section
          title="Top Resize (Vertical)"
          description="Set resizeDirection='top' to place the handle on the top edge. Dragging up increases height."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="flex items-end w-full" style={{ minHeight: 420 }}>
              <ResizablePanel
                defaultValue={topHeight}
                minValue={100}
                maxValue={400}
                resizeDirection="top"
                onValueChange={setTopHeight}
                classes={{
                  root: isDarkMode
                    ? "w-full bg-green-950/40 rounded-lg border border-green-800"
                    : "w-full bg-green-50 rounded-lg border border-green-200",
                  handle: handleClass("green"),
                }}
              >
                {panelContent(
                  "green",
                  "Top Resizable Panel",
                  topHeight,
                  "Min: 100px | Max: 400px",
                )}
              </ResizablePanel>
            </div>
          </DemoWrapper>
          <CodeBlock
            isDarkMode={isDarkMode}
            code={`<ResizablePanel
  defaultValue={200}
  resizeDirection="top"
  minValue={100}
  maxValue={400}
  onValueChange={setHeight}
  classes={{
    root: "w-full bg-green-50 rounded-lg border border-green-200",
    handle: "bg-green-300 hover:bg-green-500 transition-colors",
  }}
>
  <div className="p-4">Top Resizable Panel</div>
</ResizablePanel>`}
          />
        </Section>

        <Section
          title="Uncontrolled (defaultValue)"
          description="Use defaultValue for uncontrolled behavior — no external state management needed. The component manages its own size internally."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
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
                  className={`font-medium ${isDarkMode ? "text-blue-300" : "text-blue-800"}`}
                >
                  Uncontrolled Panel
                </p>
                <p
                  className={`text-sm mt-2 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}
                >
                  Started at 280px (no external state)
                </p>
              </div>
            </ResizablePanel>
          </DemoWrapper>
          <CodeBlock
            isDarkMode={isDarkMode}
            code={`<ResizablePanel defaultValue={280} minValue={150} maxValue={450}>
  <div>No state needed — just defaultValue</div>
</ResizablePanel>`}
          />
        </Section>

        <Section
          title="Controlled State"
          description="Use value and onValueChange for full controlled behavior. The external slider and the drag handle both drive the panel width."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode} layout="flex-col">
            <div className="w-full space-y-4">
              <div className="flex items-center gap-4">
                <label
                  className={`text-sm font-medium whitespace-nowrap ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
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
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${isDarkMode ? "bg-blue-600 hover:bg-blue-500 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
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
                {panelContent("blue", "Controlled Panel", controlledWidth)}
              </ResizablePanel>
            </div>
          </DemoWrapper>
          <CodeBlock
            isDarkMode={isDarkMode}
            code={`const [width, setWidth] = useState(320);

<input
  type="range"
  min={150}
  max={500}
  value={width}
  onChange={(e) => setWidth(Number(e.target.value))}
/>

<ResizablePanel
  value={width}
  onValueChange={setWidth}
  minValue={150}
  maxValue={500}
>
  <div>Width: {width}px</div>
</ResizablePanel>`}
          />
        </Section>

        <Section
          title="Custom Constraints"
          description="Use minValue and maxValue to constrain the panel size. The handle stops at the boundaries. Values outside the range are clamped."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
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
              {panelContent(
                "amber",
                "Constrained Panel",
                constrainedWidth,
                "Min: 180px | Max: 400px",
              )}
            </ResizablePanel>
          </DemoWrapper>
          <CodeBlock
            isDarkMode={isDarkMode}
            code={`<ResizablePanel
  defaultValue={250}
  minValue={180}
  maxValue={400}
>
  <div>Constrained between 180px and 400px</div>
</ResizablePanel>`}
          />
        </Section>

        <Section
          title="Custom Step Size"
          description="The step prop controls how many pixels each arrow key press moves. Shift+Arrow multiplies by 5x."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode} layout="flex-col">
            <div className="w-full space-y-4">
              <div
                className={`p-3 rounded-lg text-sm ${isDarkMode ? "bg-amber-900/30 border border-amber-800 text-amber-200" : "bg-amber-50 border border-amber-200 text-amber-800"}`}
              >
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
                {panelContent(
                  "amber",
                  "Custom Step (25px)",
                  customStepWidth,
                  "Step: 25px | Shift: 125px",
                )}
              </ResizablePanel>
            </div>
          </DemoWrapper>
          <CodeBlock
            isDarkMode={isDarkMode}
            code={`<ResizablePanel
  defaultValue={300}
  step={25}
  minValue={100}
  maxValue={500}
>
  <div>Each arrow key press moves 25px</div>
</ResizablePanel>`}
          />
        </Section>

        <Section
          title="Disabled"
          description="Set disabled to prevent all resize interactions. The handle is removed from tab order, pointer and keyboard events are ignored, and data-disabled is applied for CSS targeting."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode} layout="flex-col">
            <div className="w-full space-y-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setDisabledToggle((p) => !p)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    disabledToggle
                      ? isDarkMode
                        ? "bg-red-600 hover:bg-red-500 text-white"
                        : "bg-red-600 hover:bg-red-700 text-white"
                      : isDarkMode
                        ? "bg-green-600 hover:bg-green-500 text-white"
                        : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
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
                      ? isDarkMode
                        ? "bg-gray-700/50 border-gray-600 opacity-60"
                        : "bg-gray-100 border-gray-300 opacity-60"
                      : isDarkMode
                        ? "bg-blue-950/40 border-blue-800"
                        : "bg-blue-50 border-blue-200"
                  }`,
                  handle: disabledToggle ? "" : handleClass("blue"),
                }}
              >
                <div className="p-4">
                  <p
                    className={`font-medium ${disabledToggle ? (isDarkMode ? "text-gray-400" : "text-gray-500") : isDarkMode ? "text-blue-300" : "text-blue-800"}`}
                  >
                    {disabledToggle ? "Disabled Panel" : "Enabled Panel"}
                  </p>
                  <p
                    className={`text-sm mt-2 ${disabledToggle ? (isDarkMode ? "text-gray-500" : "text-gray-400") : isDarkMode ? "text-blue-400" : "text-blue-600"}`}
                  >
                    {disabledToggle ? "Cannot be resized" : "Drag to resize"}
                  </p>
                </div>
              </ResizablePanel>
            </div>
          </DemoWrapper>
          <CodeBlock
            isDarkMode={isDarkMode}
            code={`<ResizablePanel defaultValue={280} disabled>
  <div>Cannot be resized</div>
</ResizablePanel>`}
          />
        </Section>

        <Section
          title="Keyboard Navigation"
          description="Focus the resize handle (Tab to it) and use arrow keys to resize. Shift+Arrow moves by 5x the step. Home and End jump to min/max. Press Escape during a drag to cancel and restore the original size. Vertical panels use ArrowUp/ArrowDown instead of ArrowLeft/ArrowRight."
          isDarkMode={isDarkMode}
        >
          <div
            className={`mb-4 p-4 rounded-lg text-sm ${isDarkMode ? "bg-blue-900/30 border border-blue-800 text-blue-200" : "bg-blue-50 text-blue-800"}`}
          >
            <p className="font-semibold mb-2">Keyboard shortcuts:</p>
            <ul className="space-y-2">
              {[
                ["\u2192", "Increase width (horizontal panels)"],
                ["\u2190", "Decrease width (horizontal panels)"],
                ["\u2193", "Increase height (vertical panels)"],
                ["\u2191", "Decrease height (vertical panels)"],
                ["Shift + Arrow", "Move by 5\u00D7 step size"],
                ["Home", "Jump to minimum size (minValue)"],
                ["End", "Jump to maximum size (maxValue)"],
                ["Escape", "Cancel active drag and restore original size"],
              ].map(([key, desc]) => (
                <li key={key} className="flex items-center gap-2">
                  <kbd
                    className={`px-2 py-1 rounded border text-xs font-mono shadow-sm ${isDarkMode ? "bg-gray-800 border-gray-600 text-gray-300" : "bg-white border-blue-200 text-blue-800"}`}
                  >
                    {key}
                  </kbd>
                  <span>{desc}</span>
                </li>
              ))}
            </ul>
          </div>
          <DemoWrapper isDarkMode={isDarkMode}>
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
                  className={`font-medium ${isDarkMode ? "text-blue-300" : "text-blue-800"}`}
                >
                  Tab to the handle, then use arrow keys
                </p>
                <p
                  className={`text-sm mt-2 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}
                >
                  Step: 10px | Shift+Arrow: 50px | Escape: cancel drag
                </p>
              </div>
            </ResizablePanel>
          </DemoWrapper>
        </Section>

        <Section
          title="Escape to Cancel Drag"
          description="During an active pointer drag, pressing Escape cancels the resize and restores the size to its value before the drag started. This is a standard interaction pattern for drag operations."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
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
                  className={`font-medium ${isDarkMode ? "text-blue-300" : "text-blue-800"}`}
                >
                  Start dragging, then press Escape
                </p>
                <p
                  className={`text-sm mt-2 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}
                >
                  Size snaps back to where it was before the drag
                </p>
              </div>
            </ResizablePanel>
          </DemoWrapper>
          <div
            className={`mt-4 p-3 rounded-lg ${isDarkMode ? "bg-blue-900/30 border border-blue-800" : "bg-blue-50 border border-blue-200"}`}
          >
            <p
              className={`text-sm ${isDarkMode ? "text-blue-200" : "text-blue-800"}`}
            >
              <strong>Note:</strong> Escape only works during an active pointer
              drag. For keyboard resizing (arrow keys), each key press is an
              individual resize action with its own onResizeStart/onResizeEnd
              lifecycle.
            </p>
          </div>
        </Section>

        <Section
          title="Resize Callbacks"
          description="Use onResizeStart and onResizeEnd to respond to the start and end of a resize gesture. Both receive the current size value. onValueChange fires continuously during resize. Keyboard resizing also fires onResizeStart and onResizeEnd per key press."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode} layout="flex-col">
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
                {panelContent("blue", "Resize me", callbackWidth)}
              </ResizablePanel>
              <div
                ref={logRef}
                className={`h-28 overflow-y-auto rounded-lg border p-3 font-mono text-xs ${isDarkMode ? "bg-gray-900 border-gray-700 text-gray-300" : "bg-gray-50 border-gray-200 text-gray-600"}`}
              >
                {callbackLog.length === 0 ? (
                  <span
                    className={isDarkMode ? "text-gray-500" : "text-gray-400"}
                  >
                    Drag the handle to see resize events...
                  </span>
                ) : (
                  callbackLog.map((msg, i) => <div key={i}>{msg}</div>)
                )}
              </div>
            </div>
          </DemoWrapper>
          <CodeBlock
            isDarkMode={isDarkMode}
            code={`<ResizablePanel
  defaultValue={300}
  onResizeStart={(width) => console.log("started at", width)}
  onResizeEnd={(width) => console.log("ended at", width)}
  onValueChange={(width) => console.log("width:", width)}
>
  <div>Content</div>
</ResizablePanel>`}
          />
        </Section>

        <Section
          title="Custom Styling (classes)"
          description="Use the classes prop to style the root container and the drag handle independently. Both keys accept Tailwind classes."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <ResizablePanel
              defaultValue={styledWidth}
              minValue={200}
              maxValue={500}
              onValueChange={setStyledWidth}
              classes={{
                root: `h-32 rounded-lg border ${isDarkMode ? "bg-linear-to-r from-purple-950/60 to-pink-950/60 border-purple-800" : "bg-linear-to-r from-purple-50 to-pink-50 border-purple-200"}`,
                handle: `rounded-full ${isDarkMode ? "bg-linear-to-b from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400" : "bg-linear-to-b from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500"} transition-colors`,
              }}
            >
              <div className="p-4">
                <p
                  className={`font-medium ${isDarkMode ? "text-purple-300" : "text-purple-800"}`}
                >
                  Gradient Styling
                </p>
                <p
                  className={`text-sm mt-2 ${isDarkMode ? "text-purple-400" : "text-purple-600"}`}
                >
                  Custom handle and root styles via classes
                </p>
              </div>
            </ResizablePanel>
          </DemoWrapper>
          <CodeBlock
            isDarkMode={isDarkMode}
            code={`<ResizablePanel
  defaultValue={300}
  classes={{
    root: "h-32 bg-linear-to-r from-purple-50 to-pink-50 rounded-lg border",
    handle: "rounded-full bg-linear-to-b from-purple-400 to-pink-400",
  }}
>
  <div>Styled panel</div>
</ResizablePanel>`}
          />
        </Section>

        <Section
          title="Handle Content"
          description="Use the handleContent prop to render custom content (grip icons, dots, etc.) inside the separator handle."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
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
                  className={isDarkMode ? "text-blue-200" : "text-blue-700"}
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
                  className={`font-medium ${isDarkMode ? "text-blue-300" : "text-blue-800"}`}
                >
                  Panel with Grip Handle
                </p>
                <p
                  className={`text-sm mt-2 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}
                >
                  Three-dot grip icon rendered inside the handle
                </p>
              </div>
            </ResizablePanel>
          </DemoWrapper>
          <CodeBlock
            isDarkMode={isDarkMode}
            code={`<ResizablePanel
  defaultValue={300}
  classes={{
    root: "h-40 bg-blue-50 rounded-lg border",
    handle: "bg-blue-300 flex items-center justify-center",
  }}
  handleContent={
    <svg width="4" height="16" viewBox="0 0 4 16" fill="currentColor" aria-hidden="true">
      <circle cx="2" cy="2" r="1.5" />
      <circle cx="2" cy="8" r="1.5" />
      <circle cx="2" cy="14" r="1.5" />
    </svg>
  }
>
  <div className="p-4">Panel with grip handle</div>
</ResizablePanel>`}
          />
        </Section>

        <Section
          title="className + classes.root Merging"
          description="When both className and classes.root are provided, they are merged via tailwind-merge. className is a shorthand for classes.root."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <ResizablePanel
              defaultValue={280}
              minValue={150}
              maxValue={450}
              className="h-32 rounded-lg"
              classes={{
                root: isDarkMode
                  ? "bg-blue-950/40 border border-blue-800"
                  : "bg-blue-50 border border-blue-200",
                handle: handleClass("blue"),
              }}
            >
              <div className="p-4">
                <p
                  className={`font-medium ${isDarkMode ? "text-blue-300" : "text-blue-800"}`}
                >
                  Both className and classes.root
                </p>
                <p
                  className={`text-sm mt-2 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}
                >
                  className=&quot;h-32 rounded-lg&quot; +
                  classes.root=&quot;bg-blue-50 ...&quot;
                </p>
              </div>
            </ResizablePanel>
          </DemoWrapper>
          <CodeBlock
            isDarkMode={isDarkMode}
            code={`<ResizablePanel
  defaultValue={280}
  className="h-32 rounded-lg"
  classes={{
    root: "bg-blue-50 border border-blue-200",
    handle: "bg-blue-300 hover:bg-blue-500",
  }}
>
  <div>Both className and classes.root are merged</div>
</ResizablePanel>`}
          />
        </Section>

        <Section
          title="Side-by-Side Panels"
          description="Two resizable panels side by side, simulating a split view layout."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="flex h-64 w-full">
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
                    className={`font-medium ${isDarkMode ? "text-purple-300" : "text-purple-800"}`}
                  >
                    Sidebar
                  </p>
                  <p
                    className={`text-sm mt-2 ${isDarkMode ? "text-purple-400" : "text-purple-600"}`}
                  >
                    Width: {Math.round(sidebarWidth)}px
                  </p>
                  <ul className="mt-4 space-y-2 text-sm">
                    {["Navigation 1", "Navigation 2", "Navigation 3"].map(
                      (item) => (
                        <li
                          key={item}
                          className={`px-2 py-1 rounded ${isDarkMode ? "bg-purple-900/50 text-purple-300" : "bg-purple-100 text-purple-700"}`}
                        >
                          {item}
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              </ResizablePanel>
              <div
                className={`flex-1 p-4 border border-l-0 rounded-r-lg ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"}`}
              >
                <p
                  className={`font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}
                >
                  Main Content
                </p>
                <p
                  className={`text-sm mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  This area expands as the sidebar shrinks.
                </p>
              </div>
            </div>
          </DemoWrapper>
          <CodeBlock
            isDarkMode={isDarkMode}
            code={`<div className="flex h-64">
  <ResizablePanel
    defaultValue={250}
    minValue={150}
    maxValue={400}
    aria-label="Resize sidebar"
    classes={{ root: "h-full ...", handle: "..." }}
  >
    <div>Sidebar</div>
  </ResizablePanel>
  <div className="flex-1">Main Content</div>
</div>`}
          />
        </Section>

        <Section
          title="Three-Segment Layout"
          description="Left and right panels are resizable, center expands to fill remaining space."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="flex h-80 w-full">
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
                    className={`font-medium ${isDarkMode ? "text-indigo-300" : "text-indigo-800"}`}
                  >
                    Left Panel
                  </p>
                  <p
                    className={`text-sm mt-2 ${isDarkMode ? "text-indigo-400" : "text-indigo-600"}`}
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
                        className={`px-3 py-2 rounded text-sm ${isDarkMode ? "bg-indigo-900/50 text-indigo-300" : "bg-indigo-100 text-indigo-700"}`}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </ResizablePanel>

              <div
                className={`flex-1 p-4 flex flex-col border-y ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"}`}
              >
                <p
                  className={`font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}
                >
                  Center Panel
                </p>
                <p
                  className={`text-sm mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  Flexible width &mdash; expands to fill available space
                </p>
                <div
                  className={`mt-4 flex-1 rounded border p-4 ${isDarkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}
                >
                  <p
                    className={`text-sm ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
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
                    className={`font-medium ${isDarkMode ? "text-teal-300" : "text-teal-800"}`}
                  >
                    Right Panel
                  </p>
                  <p
                    className={`text-sm mt-2 ${isDarkMode ? "text-teal-400" : "text-teal-600"}`}
                  >
                    Width: {Math.round(rightPanelWidth)}px
                  </p>
                  <div className="mt-4 flex-1 space-y-2">
                    {["Details Section", "Properties", "Actions"].map(
                      (item) => (
                        <div
                          key={item}
                          className={`px-3 py-2 rounded text-sm ${isDarkMode ? "bg-teal-900/50 text-teal-300" : "bg-teal-100 text-teal-700"}`}
                        >
                          {item}
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </ResizablePanel>
            </div>
          </DemoWrapper>
          <CodeBlock
            isDarkMode={isDarkMode}
            code={`<div className="flex h-80">
  <ResizablePanel
    defaultValue={250}
    minValue={150}
    maxValue={350}
    aria-label="Resize left panel"
    classes={{ root: "h-full ...", handle: "..." }}
  >
    <div>Left Panel</div>
  </ResizablePanel>

  <div className="flex-1">Center Panel</div>

  <ResizablePanel
    defaultValue={250}
    resizeDirection="left"
    minValue={150}
    maxValue={350}
    aria-label="Resize right panel"
    classes={{ root: "h-full ...", handle: "..." }}
  >
    <div>Right Panel</div>
  </ResizablePanel>
</div>`}
          />
        </Section>

        <Section
          title="Custom ID"
          description="Use the id prop for deterministic IDs useful for SSR and testing. When omitted, a unique ID is auto-generated via useId()."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
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
                  className={`font-medium ${isDarkMode ? "text-blue-300" : "text-blue-800"}`}
                >
                  Custom ID Panel
                </p>
                <p
                  className={`text-sm mt-2 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}
                >
                  id=&quot;my-resizable&quot;
                </p>
              </div>
            </ResizablePanel>
          </DemoWrapper>
          <CodeBlock
            isDarkMode={isDarkMode}
            code={`<ResizablePanel id="my-resizable" defaultValue={280}>
  <div>Deterministic ID for SSR/testing</div>
</ResizablePanel>`}
          />
        </Section>

        <Section
          title="Custom Aria Label"
          description='Use aria-label to provide a meaningful accessible name for the resize handle. Defaults to "Resize panel".'
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
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
                  className={`font-medium ${isDarkMode ? "text-blue-300" : "text-blue-800"}`}
                >
                  Custom Aria Label
                </p>
                <p
                  className={`text-sm mt-2 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}
                >
                  aria-label=&quot;Resize sidebar navigation&quot;
                </p>
              </div>
            </ResizablePanel>
          </DemoWrapper>
          <CodeBlock
            isDarkMode={isDarkMode}
            code={`<ResizablePanel
  defaultValue={280}
  aria-label="Resize sidebar navigation"
>
  <div>Screen readers announce "Resize sidebar navigation"</div>
</ResizablePanel>`}
          />
        </Section>

        <Section
          title="Data Attributes"
          description="The ResizablePanel applies data attributes for CSS-based styling and state inspection."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="overflow-x-auto w-full">
              <table
                className={`min-w-full text-sm ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}
              >
                <thead>
                  <tr
                    className={`border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
                  >
                    <th className="text-left py-3 pr-4 font-semibold">
                      Attribute
                    </th>
                    <th className="text-left py-3 pr-4 font-semibold">
                      Applied To
                    </th>
                    <th className="text-left py-3 font-semibold">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody
                  className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-100"}`}
                >
                  {[
                    [
                      "data-resizing",
                      "root, handle",
                      "Present during an active pointer drag",
                    ],
                    [
                      "data-disabled",
                      "root, handle",
                      "Present when the component is disabled",
                    ],
                    [
                      "data-direction",
                      "handle",
                      '"left", "right", "top", or "bottom" — which edge the handle is on',
                    ],
                  ].map(([attr, target, desc]) => (
                    <tr key={attr}>
                      <td className="py-3 pr-4 font-mono text-blue-500">
                        {attr}
                      </td>
                      <td
                        className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                      >
                        {target}
                      </td>
                      <td
                        className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                      >
                        {desc}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p
              className={`text-sm mt-4 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              Example usage:{" "}
              <code
                className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}
              >
                data-[resizing]:ring-2
              </code>
              ,{" "}
              <code
                className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}
              >
                data-[disabled]:opacity-50
              </code>
              ,{" "}
              <code
                className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}
              >
                data-[direction=left]:left-0
              </code>
            </p>
          </DemoWrapper>
        </Section>

        <Section
          title="CSS Custom Properties"
          description="The component exposes CSS custom properties on the root element for flexible styling and integration with external CSS."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="overflow-x-auto w-full">
              <table
                className={`min-w-full text-sm ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}
              >
                <thead>
                  <tr
                    className={`border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
                  >
                    <th className="text-left py-3 pr-4 font-semibold">
                      Property
                    </th>
                    <th className="text-left py-3 font-semibold">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody
                  className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-100"}`}
                >
                  {[
                    [
                      "--resizable-panel-size",
                      "Current size in pixels (rounded)",
                    ],
                    [
                      "--resizable-panel-min",
                      "Minimum size constraint in pixels",
                    ],
                    [
                      "--resizable-panel-max",
                      "Maximum size constraint in pixels",
                    ],
                  ].map(([prop, desc]) => (
                    <tr key={prop}>
                      <td className="py-3 pr-4 font-mono text-blue-500">
                        {prop}
                      </td>
                      <td
                        className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                      >
                        {desc}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DemoWrapper>
        </Section>
      </div>

      <div className="space-y-8">
        <h2
          className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}
        >
          API Reference
        </h2>

        <div>
          <h3
            className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}
          >
            ResizablePanel Props
          </h3>
          <PropsTable isDarkMode={isDarkMode}>
            <PropRow
              name="children"
              type="ReactNode"
              description="Content to render inside the panel"
              isDarkMode={isDarkMode}
            />
            <PropRow
              name="value"
              type="number"
              description="Controlled panel size in pixels (width or height depending on resizeDirection)"
              isDarkMode={isDarkMode}
            />
            <PropRow
              name="defaultValue"
              type="number"
              defaultVal="300"
              description="Initial size for uncontrolled mode (clamped to [minValue, maxValue])"
              isDarkMode={isDarkMode}
            />
            <PropRow
              name="onValueChange"
              type="(value: number) => void"
              description="Callback fired continuously as size changes during resize"
              isDarkMode={isDarkMode}
            />
            <PropRow
              name="onResizeStart"
              type="(value: number) => void"
              description="Callback fired when a resize gesture begins, receiving the current size"
              isDarkMode={isDarkMode}
            />
            <PropRow
              name="onResizeEnd"
              type="(value: number) => void"
              description="Callback fired when a resize gesture ends, with the final size"
              isDarkMode={isDarkMode}
            />
            <PropRow
              name="minValue"
              type="number"
              defaultVal="200"
              description="Minimum size constraint in pixels"
              isDarkMode={isDarkMode}
            />
            <PropRow
              name="maxValue"
              type="number"
              defaultVal="800"
              description="Maximum size constraint in pixels"
              isDarkMode={isDarkMode}
            />
            <PropRow
              name="resizeDirection"
              type='"left" | "right" | "top" | "bottom"'
              defaultVal='"right"'
              description='Which edge has the resize handle. "left"/"right" manage width; "top"/"bottom" manage height.'
              isDarkMode={isDarkMode}
            />
            <PropRow
              name="step"
              type="number"
              defaultVal="10"
              description="Keyboard arrow key increment in pixels (Shift multiplies by 5)"
              isDarkMode={isDarkMode}
            />
            <PropRow
              name="disabled"
              type="boolean"
              defaultVal="false"
              description="Disable all resize interactions (pointer, keyboard, and focus)"
              isDarkMode={isDarkMode}
            />
            <PropRow
              name="aria-label"
              type="string"
              defaultVal='"Resize panel"'
              description="Accessible label for the separator handle element"
              isDarkMode={isDarkMode}
            />
            <PropRow
              name="classes"
              type="ResizablePanelClasses"
              defaultVal="{}"
              description="Object of class overrides for internal slots (root, handle)"
              isDarkMode={isDarkMode}
            />
            <PropRow
              name="handleContent"
              type="ReactNode"
              description="Content rendered inside the separator handle (e.g. grip icon)"
              isDarkMode={isDarkMode}
            />
            <PropRow
              name="className"
              type="string"
              description="Shorthand for classes.root — merged with classes.root when both are provided"
              isDarkMode={isDarkMode}
            />
            <PropRow
              name="style"
              type="CSSProperties"
              description="Inline styles merged onto the root element (managed size property cannot be overridden)"
              isDarkMode={isDarkMode}
            />
            <PropRow
              name="id"
              type="string"
              defaultVal="auto-generated"
              description="Deterministic ID for the root element (auto-generated via useId if omitted)"
              isDarkMode={isDarkMode}
            />
            <PropRow
              name="...rest"
              type="HTMLDivElement props"
              description="All standard HTML div attributes are forwarded to the root element (e.g. data-testid, event handlers)"
              isDarkMode={isDarkMode}
            />
          </PropsTable>
        </div>

        <div>
          <h3
            className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}
          >
            classes Record (ResizablePanelClasses)
          </h3>
          <div className="overflow-x-auto">
            <table
              className={`min-w-full text-sm ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}
            >
              <thead>
                <tr
                  className={`border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
                >
                  <th className="text-left py-3 pr-4 font-semibold">Key</th>
                  <th className="text-left py-3 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-100"}`}
              >
                {[
                  [
                    "root",
                    "Root container div that wraps children and the handle",
                  ],
                  [
                    "handle",
                    'Drag handle element (role="separator") — positioned on the edge specified by resizeDirection',
                  ],
                ].map(([key, desc]) => (
                  <tr key={key}>
                    <td className="py-3 pr-4 font-mono text-blue-500">{key}</td>
                    <td
                      className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                    >
                      {desc}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3
            className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}
          >
            Type Definitions
          </h3>
          <CodeBlock
            isDarkMode={isDarkMode}
            code={`interface ResizablePanelClasses {
  root?: string;
  handle?: string;
}

interface ResizablePanelProps extends ComponentPropsWithoutRef<"div"> {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  onResizeStart?: (value: number) => void;
  onResizeEnd?: (value: number) => void;
  minValue?: number;
  maxValue?: number;
  resizeDirection?: "left" | "right" | "top" | "bottom";
  step?: number;
  disabled?: boolean;
  classes?: ResizablePanelClasses;
  handleContent?: ReactNode;
}`}
          />
        </div>

        <div>
          <h3
            className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}
          >
            Development Warnings
          </h3>
          <div
            className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-gray-50"}`}
          >
            <ul
              className={`list-disc list-inside space-y-2 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
            >
              <li>
                Warns if{" "}
                <code
                  className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
                >
                  minValue
                </code>{" "}
                is greater than{" "}
                <code
                  className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
                >
                  maxValue
                </code>
              </li>
              <li>
                Warns if controlled{" "}
                <code
                  className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
                >
                  value
                </code>{" "}
                is outside the [minValue, maxValue] range
              </li>
              <li>
                Warns if{" "}
                <code
                  className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
                >
                  defaultValue
                </code>{" "}
                is outside the [minValue, maxValue] range
              </li>
              <li>
                Warns if switching between controlled and uncontrolled mode at
                runtime (via{" "}
                <code
                  className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
                >
                  useControllableState
                </code>
                )
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2
          className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}
        >
          Accessibility
        </h2>
        <div
          className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-gray-50"}`}
        >
          <h3
            className={`font-semibold mb-3 ${isDarkMode ? "text-white" : "text-gray-800"}`}
          >
            Features
          </h3>
          <ul
            className={`list-disc list-inside space-y-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
          >
            <li>
              Handle has{" "}
              <code
                className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
              >
                role=&quot;separator&quot;
              </code>{" "}
              with{" "}
              <code
                className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
              >
                aria-orientation
              </code>{" "}
              set per the WAI-ARIA window splitter pattern (&quot;vertical&quot;
              for left/right, &quot;horizontal&quot; for top/bottom)
            </li>
            <li>
              <code
                className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
              >
                aria-controls
              </code>{" "}
              on the separator references the panel&apos;s id, linking the
              handle to the element it controls
            </li>
            <li>
              <code
                className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
              >
                aria-valuenow
              </code>
              ,{" "}
              <code
                className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
              >
                aria-valuemin
              </code>
              , and{" "}
              <code
                className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
              >
                aria-valuemax
              </code>{" "}
              expose current and allowed size range to assistive technology
            </li>
            <li>
              <code
                className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
              >
                aria-valuetext
              </code>{" "}
              provides a human-readable announcement (e.g. &quot;300
              pixels&quot;)
            </li>
            <li>
              <code
                className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
              >
                aria-label
              </code>{" "}
              on the handle for screen reader identification (customizable via
              prop)
            </li>
            <li>
              Full keyboard navigation: ArrowLeft/ArrowRight for horizontal
              panels, ArrowUp/ArrowDown for vertical panels, Home/End to jump to
              min/max, Shift for large increments, Escape to cancel drag
            </li>
            <li>
              Keyboard resizing fires onResizeStart and onResizeEnd per key
              press, ensuring consistent lifecycle hooks for all input methods
            </li>
            <li>
              Handle is focusable via{" "}
              <code
                className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
              >
                tabIndex=0
              </code>{" "}
              (disabled handle gets{" "}
              <code
                className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
              >
                tabIndex=-1
              </code>
              , removed from tab order)
            </li>
            <li>
              <code
                className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
              >
                aria-disabled
              </code>{" "}
              on the handle when disabled
            </li>
            <li>
              Uses pointer events (not mouse events) for cross-device support
              including touch, pen, and mouse
            </li>
            <li>
              <code
                className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
              >
                setPointerCapture
              </code>{" "}
              ensures drag events are received even when the pointer leaves the
              browser window
            </li>
            <li>
              Handles{" "}
              <code
                className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
              >
                pointercancel
              </code>{" "}
              for interrupted touch gestures (e.g. incoming calls, system
              gestures)
            </li>
            <li>
              <code
                className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
              >
                touch-none
              </code>{" "}
              and{" "}
              <code
                className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
              >
                select-none
              </code>{" "}
              on the handle prevent browser scroll and text selection
              interference
            </li>
            <li>
              <code
                className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
              >
                motion-reduce:transition-none
              </code>{" "}
              respects user&apos;s reduced-motion preferences
            </li>
            <li>
              No opinionated focus ring styles — the browser&apos;s native focus
              indicator is preserved, allowing consumers to provide their own
              via{" "}
              <code
                className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
              >
                classes.handle
              </code>
            </li>
            <li>
              Deterministic IDs via{" "}
              <code
                className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
              >
                useId()
              </code>{" "}
              for SSR safety, overridable with the{" "}
              <code
                className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
              >
                id
              </code>{" "}
              prop
            </li>
            <li>
              Only primary pointer button (button === 0) initiates drag &mdash;
              right-click and middle-click are ignored
            </li>
            <li>
              Body cursor and user-select overrides are saved and restored (not
              blindly reset), preventing conflicts with other components or app
              state
            </li>
            <li>
              CSS custom properties (--resizable-panel-size,
              --resizable-panel-min, --resizable-panel-max) enable external
              CSS-based integrations
            </li>
            <li>
              All standard HTML div attributes are forwarded via rest props,
              supporting data-testid, event handlers, and custom attributes
            </li>
          </ul>
        </div>

        <div
          className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-gray-50"}`}
        >
          <h3
            className={`font-semibold mb-3 ${isDarkMode ? "text-white" : "text-gray-800"}`}
          >
            Keyboard Navigation
          </h3>
          <ul
            className={`space-y-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
          >
            {[
              ["Tab", "Focus the resize handle (enters the tab order)"],
              [
                "ArrowRight",
                "Increase width by step (horizontal panels; decrease for left-resize)",
              ],
              [
                "ArrowLeft",
                "Decrease width by step (horizontal panels; increase for left-resize)",
              ],
              [
                "ArrowDown",
                "Increase height by step (vertical panels; decrease for top-resize)",
              ],
              [
                "ArrowUp",
                "Decrease height by step (vertical panels; increase for top-resize)",
              ],
              ["Shift + Arrow", "Resize by 5\u00D7 the step value"],
              ["Home", "Set size to minimum (minValue)"],
              ["End", "Set size to maximum (maxValue)"],
              [
                "Escape",
                "Cancel active pointer drag and restore original size",
              ],
            ].map(([key, desc]) => (
              <li key={key}>
                <kbd
                  className={`px-2 py-1 rounded text-xs font-mono ${isDarkMode ? "bg-gray-900 border border-gray-600 text-gray-100" : "bg-white border border-gray-300 text-gray-700"}`}
                >
                  {key}
                </kbd>{" "}
                - {desc}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div
        className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-gray-50 border border-gray-200"}`}
      >
        <p
          className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
        >
          <strong>Note:</strong> The ResizablePanel supports both controlled (
          <code
            className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}
          >
            value
          </code>{" "}
          +{" "}
          <code
            className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}
          >
            onValueChange
          </code>
          ) and uncontrolled (
          <code
            className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}
          >
            defaultValue
          </code>
          ) modes. Switching between controlled and uncontrolled at runtime will
          trigger a development warning. Values outside the [minValue, maxValue]
          range are clamped automatically. In uncontrolled mode, constraint
          changes that clamp the current value will fire onValueChange with the
          new clamped value.
        </p>
      </div>
    </div>
  );
};

export default ResizablePanelDemo;
