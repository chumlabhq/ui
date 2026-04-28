import { useState, useRef } from "react";
import {
  Drawer,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  DrawerCloseButton,
} from "../../components/Drawer";
import { useTheme } from "./ThemeContext";
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

// ─── Icons ───────────────────────────────────────────────────────────────────

const CloseIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);
// ─── Themed Classes ──────────────────────────────────────────────────────────

const getClasses = (_dark: boolean) => ({
  // Drawer panel surface. bg-cl-bg uses the page background colour so the
  // panel reads as an extension of the page, not a separate elevated card
  // (drawers slide in from screen edges — they ARE the page). Border on
  // the inner edge keeps the seam between drawer and page legible.
  panel: `flex flex-col h-full bg-cl-bg text-cl-text`,
  header: `flex items-center justify-between px-6 py-4 border-b border-cl-border`,
  body: `flex-1 overflow-y-auto px-6 py-5`,
  footer: `flex items-center justify-end gap-3 px-6 py-4 border-t border-cl-border bg-cl-bg-elevated`,
  title: `text-[17px] font-semibold text-cl-text leading-tight tracking-[-0.01em]`,
  // Close button: ghost style, square, no chrome until hover.
  closeBtn: `inline-flex items-center justify-center w-9 h-9 rounded-cl-md transition-colors text-cl-text-tertiary hover:text-cl-text hover:bg-cl-bg-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent focus-visible:ring-offset-2 focus-visible:ring-offset-cl-bg`,
  text: "text-cl-text-secondary leading-relaxed",
  // Button system follows the docs spec: primary = filled accent pill,
  // secondary = elevated surface with hairline border. Same h-10 px-5
  // sizing across the demos so every button reads at the same visual
  // weight.
  btn: `inline-flex items-center justify-center gap-2 h-10 px-5 text-sm font-medium rounded-cl-md transition-colors bg-cl-bg-elevated text-cl-text border border-cl-border hover:border-cl-border-input-hover hover:bg-cl-bg-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent focus-visible:ring-offset-2 focus-visible:ring-offset-cl-bg cursor-pointer`,
  btnPrimary: `inline-flex items-center justify-center gap-2 h-10 px-5 text-sm font-medium rounded-cl-md transition-colors bg-cl-accent text-white hover:bg-cl-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent focus-visible:ring-offset-2 focus-visible:ring-offset-cl-bg cursor-pointer`,
  card: `rounded-cl-lg p-5 bg-cl-bg-elevated`,
  kbd: `px-2 py-1 rounded-cl-sm text-[11px] font-mono min-w-[2.5rem] text-center font-medium bg-cl-bg-elevated border border-cl-border text-cl-text-secondary`,
  label: `text-xs font-medium text-cl-text-tertiary`,
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

function useDrawerState(initial = false) {
  const [open, setOpen] = useState(initial);
  return {
    open,
    onOpen: () => setOpen(true),
    onOpenChange: (o: boolean) => setOpen(o),
    onClose: () => setOpen(false),
  };
}

// ─── Demo ────────────────────────────────────────────────────────────────────

const DrawerDemo = () => {
  const { isDarkMode: dark } = useTheme();
  const c = getClasses(dark);

  const basic = useDrawerState();
  const directions = {
    left: useDrawerState(),
    right: useDrawerState(),
    top: useDrawerState(),
    bottom: useDrawerState(),
  };
  const sized = useDrawerState();
  const overlay = useDrawerState();
  const blurOverlay = useDrawerState();
  const noOverlayClose = useDrawerState();
  const noEscClose = useDrawerState();
  const keepMounted = useDrawerState();
  const nonModal = useDrawerState();
  const customDuration = useDrawerState();
  const swipeable = useDrawerState();
  const snapPoints = useDrawerState();
  const stacked1 = useDrawerState();
  const stacked2 = useDrawerState();
  const initialFocusRef = useRef<HTMLInputElement>(null);
  const initialFocus = useDrawerState();
  const transitionCb = useDrawerState();
  const [transitionLog, setTransitionLog] = useState<string[]>([]);
  const classesDemo = useDrawerState();
  const reduceMotionDemo = useDrawerState();
  const formDrawer = useDrawerState();
  const [snapIndex, setSnapIndex] = useState(1);

  const renderDrawerContent = (
    title: string,
    onClose: () => void,
    extra?: React.ReactNode,
  ) => (
    <div className={c.panel}>
      <DrawerHeader className={c.header}>
        <h2 className={c.title}>{title}</h2>
        <DrawerCloseButton className={c.closeBtn}>
          <CloseIcon />
        </DrawerCloseButton>
      </DrawerHeader>
      <DrawerBody className={c.body}>
        <p className={`text-sm ${c.text}`}>
          {extra ||
            "This is the drawer content. Click outside, press Escape, or click the X to close."}
        </p>
      </DrawerBody>
      <DrawerFooter className={c.footer}>
        <button className={c.btn} onClick={onClose}>
          Cancel
        </button>
        <button className={c.btnPrimary} onClick={onClose}>
          Confirm
        </button>
      </DrawerFooter>
    </div>
  );

  return (
    <div className="space-y-10">
      <DocsHero
        title="Drawer"
        description="A sliding panel overlay with focus trapping, scroll lock, swipe-to-close, snap points, stacked drawer support, and fully accessible keyboard navigation."
        code={`import { Drawer, DrawerHeader, DrawerBody, DrawerFooter, DrawerCloseButton } from "@chumlab/ui/drawer";`}
      />

      {/* ─── Basic ──────────────────────────────────────────────────────── */}
      <Section
        title="Basic Usage"
        description="Works out-of-the-box with built-in styles, overlay, focus trapping, and dark mode. No custom classes needed."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          {/* Basic usage — open/close via controlled state */}
          <button className={c.btnPrimary} onClick={basic.onOpen}>
            Open Drawer
          </button>
        </DemoWrapper>
        <Drawer open={basic.open} onOpenChange={basic.onOpenChange}>
          {renderDrawerContent("Basic Drawer", basic.onClose)}
        </Drawer>
      </Section>

      {/* ─── Directions ─────────────────────────────────────────────────── */}
      <Section
        title="Directions"
        description="Slide from left, right, top, or bottom."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          {(["left", "right", "top", "bottom"] as const).map((dir) => (
            <button
              key={dir}
              className={c.btn}
              onClick={directions[dir].onOpen}
            >
              {dir}
            </button>
          ))}
        </DemoWrapper>
        {(["left", "right", "top", "bottom"] as const).map((dir) => (
          <Drawer
            key={dir}
            open={directions[dir].open}
            onOpenChange={directions[dir].onOpenChange}
            direction={dir}
            size={dir === "top" || dir === "bottom" ? "250px" : "320px"}
          >
            {renderDrawerContent(
              `${dir.charAt(0).toUpperCase() + dir.slice(1)} Drawer`,
              directions[dir].onClose,
            )}
          </Drawer>
        ))}
      </Section>

      {/* ─── Custom Size ────────────────────────────────────────────────── */}
      <Section
        title="Custom Size"
        description="Control width/height with the size prop (any CSS value)."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <button className={c.btnPrimary} onClick={sized.onOpen}>
            Open 500px Drawer
          </button>
        </DemoWrapper>
        <Drawer open={sized.open} onOpenChange={sized.onOpenChange} size="500px">
          {renderDrawerContent("500px Wide Drawer", sized.onClose)}
        </Drawer>
      </Section>

      {/* ─── Overlay ────────────────────────────────────────────────────── */}
      <Section
        title="Overlay Customization"
        description="Custom overlay color, opacity, and blur."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <button className={c.btn} onClick={overlay.onOpen}>
            Custom Opacity (0.45)
          </button>
          <button className={c.btn} onClick={blurOverlay.onOpen}>
            Blur Overlay
          </button>
        </DemoWrapper>
        <Drawer
          open={overlay.open}
          onOpenChange={overlay.onOpenChange}
          overlayOpacity={0.45}
        >
          {renderDrawerContent("Heavier Overlay", overlay.onClose)}
        </Drawer>
        <Drawer
          open={blurOverlay.open}
          onOpenChange={blurOverlay.onOpenChange}
          overlayBlur={8}
          overlayOpacity={0.3}
        >
          {renderDrawerContent("Blurred Overlay", blurOverlay.onClose)}
        </Drawer>
      </Section>

      {/* ─── Close Behavior ─────────────────────────────────────────────── */}
      <Section
        title="Close Behavior"
        description="Disable overlay click or Escape key closing."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <button className={c.btn} onClick={noOverlayClose.onOpen}>
            No Overlay Close
          </button>
          <button className={c.btn} onClick={noEscClose.onOpen}>
            No Escape Close
          </button>
        </DemoWrapper>
        <Drawer
          open={noOverlayClose.open}
          onOpenChange={noOverlayClose.onOpenChange}
          closeOnOverlayClick={false}
        >
          {renderDrawerContent(
            "Click overlay won't close",
            noOverlayClose.onClose,
          )}
        </Drawer>
        <Drawer
          open={noEscClose.open}
          onOpenChange={noEscClose.onOpenChange}
          closeOnEscape={false}
        >
          {renderDrawerContent("Escape key won't close", noEscClose.onClose)}
        </Drawer>
      </Section>

      {/* ─── Keep Mounted ───────────────────────────────────────────────── */}
      <Section
        title="Keep Mounted"
        description="Keep the drawer in DOM when closed (preserves form state)."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <button className={c.btnPrimary} onClick={keepMounted.onOpen}>
            Open (keepMounted)
          </button>
        </DemoWrapper>
        <Drawer
          open={keepMounted.open}
          onOpenChange={keepMounted.onOpenChange}
          keepMounted
        >
          {renderDrawerContent(
            "Keep Mounted",
            keepMounted.onClose,
            "This drawer stays in DOM when closed. Form state is preserved.",
          )}
        </Drawer>
      </Section>

      {/* ─── Non-Modal ──────────────────────────────────────────────────── */}
      <Section
        title="Non-Modal Drawer"
        description="No overlay, no scroll lock, no focus trap. Interacts with page behind."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <button className={c.btnPrimary} onClick={nonModal.onOpen}>
            Open Non-Modal
          </button>
        </DemoWrapper>
        <Drawer
          open={nonModal.open}
          onOpenChange={nonModal.onOpenChange}
          modal={false}
          direction="right"
          lockScroll={false}
        >
          {renderDrawerContent(
            "Non-Modal",
            nonModal.onClose,
            "You can interact with the page behind this drawer.",
          )}
        </Drawer>
      </Section>

      {/* ─── Custom Duration ────────────────────────────────────────────── */}
      <Section
        title="Custom Animation Duration"
        description="Control slide animation speed with duration (ms)."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <button className={c.btnPrimary} onClick={customDuration.onOpen}>
            Open (600ms)
          </button>
        </DemoWrapper>
        <Drawer
          open={customDuration.open}
          onOpenChange={customDuration.onOpenChange}
          duration={600}
        >
          {renderDrawerContent("Slow Animation", customDuration.onClose)}
        </Drawer>
      </Section>

      {/* ─── Swipeable ──────────────────────────────────────────────────── */}
      <Section
        title="Swipeable Drawer"
        description="Enable swipe-to-close on touch/pointer devices."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <button className={c.btnPrimary} onClick={swipeable.onOpen}>
            Open Swipeable
          </button>
        </DemoWrapper>
        <Drawer
          open={swipeable.open}
          onOpenChange={swipeable.onOpenChange}
          swipeable
          direction="bottom"
          size="300px"
        >
          {renderDrawerContent("Swipe Down to Close", swipeable.onClose)}
        </Drawer>
      </Section>

      {/* ─── Snap Points ────────────────────────────────────────────────── */}
      <Section
        title="Snap Points"
        description="Bottom-sheet style drawer with snap positions. Drag the handle to snap between heights."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <button className={c.btnPrimary} onClick={snapPoints.onOpen}>
              Open Bottom Sheet
            </button>
            <span
              className={`text-xs font-mono text-cl-text-secondary`}
            >
              snap: {Math.round([0.3, 0.6, 1][snapIndex] * 100)}%
            </span>
          </div>
        </DemoWrapper>
        <Drawer
          open={snapPoints.open}
          onOpenChange={snapPoints.onOpenChange}
          swipeable
          direction="bottom"
          size="85vh"
          snapPoints={[0.3, 0.6, 1]}
          activeSnapPointIndex={snapIndex}
          onSnapPointIndexChange={setSnapIndex}
          defaultSnapPointIndex={1}
        >
          <div
            className={`flex flex-col h-full bg-cl-bg text-cl-text rounded-t-cl-lg`}
          >
            {/* Drag handle */}
            <div className="flex justify-center py-3">
              <div
                className={`w-10 h-1.5 rounded-full bg-cl-bg-hover dark:bg-cl-text/10`}
              />
            </div>
            <DrawerHeader
              className={`px-5 pb-3 border-b border-cl-border`}
            >
              <h2 className={c.title}>Bottom Sheet</h2>
              <p
                className={`text-xs mt-1 text-cl-text-secondary`}
              >
                Snap points: 30%, 60%, 100%
              </p>
            </DrawerHeader>
            <div className="flex gap-2 px-5 py-3">
              {[0, 1, 2].map((i) => (
                <button
                  key={i}
                  className={`${snapIndex === i ? c.btnPrimary : c.btn} text-xs`}
                  onClick={() => setSnapIndex(i)}
                >
                  {Math.round([0.3, 0.6, 1][i] * 100)}%
                </button>
              ))}
            </div>
            <DrawerBody className={`flex-1 overflow-y-auto px-5 py-4`}>
              {Array.from({ length: 20 }).map((_, i) => (
                <p
                  key={i}
                  className={`text-sm py-2 border-b border-cl-border text-cl-text-tertiary dark:border dark:border-cl-border dark:text-cl-text-tertiary`}
                >
                  Item {i + 1} — scroll to see more content
                </p>
              ))}
            </DrawerBody>
          </div>
        </Drawer>
      </Section>

      {/* ─── Stacked ────────────────────────────────────────────────────── */}
      <Section
        title="Stacked Drawers"
        description="Multiple drawers can stack. Only the topmost responds to Escape."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <button className={c.btnPrimary} onClick={stacked1.onOpen}>
            Open First
          </button>
        </DemoWrapper>
        <Drawer open={stacked1.open} onOpenChange={stacked1.onOpenChange}>
          <div className={c.panel}>
            <DrawerHeader className={c.header}>
              <h2 className={c.title}>First Drawer</h2>
              <DrawerCloseButton className={c.closeBtn}>
                <CloseIcon />
              </DrawerCloseButton>
            </DrawerHeader>
            <DrawerBody className={c.body}>
              <p className={`text-sm mb-4 ${c.text}`}>
                This is the first drawer.
              </p>
              <button className={c.btnPrimary} onClick={stacked2.onOpen}>
                Open Second
              </button>
            </DrawerBody>
          </div>
        </Drawer>
        <Drawer open={stacked2.open} onOpenChange={stacked2.onOpenChange} size="280px">
          {renderDrawerContent(
            "Second Drawer",
            stacked2.onClose,
            "Same direction, stacked on top. Escape closes this one first.",
          )}
        </Drawer>
      </Section>

      {/* ─── Initial Focus ──────────────────────────────────────────────── */}
      <Section
        title="Initial Focus"
        description="Direct focus to a specific element when the drawer opens."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <button className={c.btnPrimary} onClick={initialFocus.onOpen}>
            Open (focus on input)
          </button>
        </DemoWrapper>
        <Drawer
          open={initialFocus.open}
          onOpenChange={initialFocus.onOpenChange}
          initialFocus={initialFocusRef}
        >
          <div className={c.panel}>
            <DrawerHeader className={c.header}>
              <h2 className={c.title}>Initial Focus</h2>
              <DrawerCloseButton className={c.closeBtn}>
                <CloseIcon />
              </DrawerCloseButton>
            </DrawerHeader>
            <DrawerBody className={c.body}>
              <label className={`block text-sm mb-1 ${c.text}`}>Name</label>
              <input
                ref={initialFocusRef}
                type="text"
                placeholder="This gets focus on open"
 className={`w-full px-3 py-2 rounded-cl-md text-sm bg-cl-bg-elevated border border-cl-border text-cl-text`}
              />
            </DrawerBody>
          </div>
        </Drawer>
      </Section>

      {/* ─── Transition Callback ────────────────────────────────────────── */}
      <Section
        title="Transition Callback"
        description="onTransitionEnd fires after the open/close animation completes."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <button className={c.btnPrimary} onClick={transitionCb.onOpen}>
            Open (check log)
          </button>
          {transitionLog.length > 0 && (
            <div
              className={`mt-3 text-xs font-mono space-y-1 text-cl-text-secondary`}
            >
              {transitionLog.map((log, i) => (
                <div key={i}>{log}</div>
              ))}
            </div>
          )}
        </DemoWrapper>
        <Drawer
          open={transitionCb.open}
          onOpenChange={transitionCb.onOpenChange}
          onTransitionEnd={(isOpen) =>
            setTransitionLog((prev) => [
              `onTransitionEnd: ${isOpen ? "opened" : "closed"}`,
              ...prev.slice(0, 4),
            ])
          }
        >
          {renderDrawerContent("Transition Callback", transitionCb.onClose)}
        </Drawer>
      </Section>

      {/* ─── Classes System ─────────────────────────────────────────────── */}
      <Section
        title="Classes System"
        description="Override root, overlay, and panel styling with the classes prop."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <button className={c.btnPrimary} onClick={classesDemo.onOpen}>
            Custom Styled Drawer
          </button>
        </DemoWrapper>
        <Drawer
          open={classesDemo.open}
          onOpenChange={classesDemo.onOpenChange}
          direction="right"
          size="360px"
          classes={{
            overlay: `fixed inset-0 transition-opacity bg-cl-accent/30 dark:bg-cl-accent/60`,
            panel: `fixed z-999999 shadow-2xl shadow-accent/20 dark:shadow-2xl dark:shadow-accent/10`,
          }}
        >
          <div
            className={`flex flex-col h-full bg-cl-bg border-l border-cl-border-input-focus dark:border dark:border-cl-border-input-focus/20`}
          >
            <DrawerHeader
              className={`flex items-center justify-between px-5 py-4 border-b border-cl-border-input-focus dark:border dark:border-cl-border-input-focus/20`}
            >
              <h2
                className={`text-lg font-semibold text-cl-accent dark:text-cl-accent`}
              >
                Custom Classes
              </h2>
              <DrawerCloseButton
                className={`p-2 rounded-cl-md text-cl-accent hover:bg-cl-accent/10 dark:text-cl-accent dark:hover:bg-cl-accent/10`}
              >
                <CloseIcon />
              </DrawerCloseButton>
            </DrawerHeader>
            <DrawerBody
              className={`flex-1 px-5 py-4 text-cl-text-secondary`}
            >
              <p className="text-sm">
                Indigo-themed overlay and panel shadow via the classes prop.
              </p>
            </DrawerBody>
          </div>
        </Drawer>
      </Section>

      {/* ─── Reduce Motion ──────────────────────────────────────────────── */}
      <Section
        title="Reduce Motion"
        description="Set reduceMotion={true} to disable slide animation."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <button className={c.btnPrimary} onClick={reduceMotionDemo.onOpen}>
            Open (no animation)
          </button>
        </DemoWrapper>
        <Drawer
          open={reduceMotionDemo.open}
          onOpenChange={reduceMotionDemo.onOpenChange}
          reduceMotion={true}
        >
          {renderDrawerContent(
            "No Animation",
            reduceMotionDemo.onClose,
            "This drawer opens and closes instantly — no slide transition.",
          )}
        </Drawer>
      </Section>

      {/* ─── Form Drawer (Real-World) ───────────────────────────────────── */}
      <Section
        title="Form Drawer (Real-World)"
        description="Common SaaS pattern: a side panel form with input fields, validation, and actions."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <button className={c.btnPrimary} onClick={formDrawer.onOpen}>
            Create New Item
          </button>
        </DemoWrapper>
        <Drawer
          open={formDrawer.open}
          onOpenChange={formDrawer.onOpenChange}
          direction="right"
          size="400px"
        >
          <div className={c.panel}>
            <DrawerHeader className={c.header}>
              <h2 className={c.title}>Create Item</h2>
              <DrawerCloseButton className={c.closeBtn}>
                <CloseIcon />
              </DrawerCloseButton>
            </DrawerHeader>
            <DrawerBody className={c.body}>
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  formDrawer.onClose();
                }}
              >
                <div>
                  <label
                    className={`block text-sm font-medium mb-1 text-cl-text-secondary`}
                  >
                    Name
                  </label>
                  <input
                    data-autofocus
                    type="text"
                    placeholder="Item name"
 className={`w-full px-3 py-2 rounded-cl-md text-sm bg-cl-bg-elevated border border-cl-border text-cl-text`}
                  />
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium mb-1 text-cl-text-secondary`}
                  >
                    Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Optional description"
 className={`w-full px-3 py-2 rounded-cl-md text-sm bg-cl-bg-elevated border border-cl-border text-cl-text`}
                  />
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium mb-1 text-cl-text-secondary`}
                  >
                    Category
                  </label>
                  <select
 className={`w-full px-3 py-2 rounded-cl-md text-sm bg-cl-bg-elevated border border-cl-border text-cl-text`}
                  >
                    <option>General</option>
                    <option>Design</option>
                    <option>Engineering</option>
                  </select>
                </div>
              </form>
            </DrawerBody>
            <DrawerFooter className={c.footer}>
              <button className={c.btn} onClick={formDrawer.onClose}>
                Cancel
              </button>
              <button className={c.btnPrimary} onClick={formDrawer.onClose}>
                Create
              </button>
            </DrawerFooter>
          </div>
        </Drawer>
      </Section>

      {/* ─── Props Table ────────────────────────────────────────────────── */}
      <Section title="Drawer Props" isDarkMode={dark}>
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow
              name="open"
              type="boolean"
              defaultVal="required"
              description="Whether the drawer is open"
              isDarkMode={dark}
            />
            <PropRow
              name="onOpenChange"
              type="(open: boolean) => void"
              defaultVal="required"
              description="Called when the drawer's open state changes"
              isDarkMode={dark}
            />
            <PropRow
              name="onClose"
              type="() => void"
              defaultVal="required"
              description="@deprecated Use onOpenChange. Called when the drawer should close"
              isDarkMode={dark}
            />
            <PropRow
              name="direction"
              type='"left"|"right"|"top"|"bottom"'
              defaultVal='"left"'
              description="Slide direction"
              isDarkMode={dark}
            />
            <PropRow
              name="size"
              type="string"
              defaultVal='"300px"'
              description="Width (left/right) or height (top/bottom)"
              isDarkMode={dark}
            />
            <PropRow
              name="duration"
              type="number"
              defaultVal="300"
              description="Animation duration in ms"
              isDarkMode={dark}
            />
            <PropRow
              name="overlayColor"
              type="string"
              defaultVal='"black"'
              description="Overlay background color"
              isDarkMode={dark}
            />
            <PropRow
              name="overlayOpacity"
              type="number"
              defaultVal="0.5"
              description="Overlay opacity (0–1)"
              isDarkMode={dark}
            />
            <PropRow
              name="overlayBlur"
              type="number"
              defaultVal="0"
              description="Overlay backdrop blur in px"
              isDarkMode={dark}
            />
            <PropRow
              name="lockScroll"
              type="boolean"
              defaultVal="true"
              description="Lock body scroll when open"
              isDarkMode={dark}
            />
            <PropRow
              name="closeOnOverlayClick"
              type="boolean"
              defaultVal="true"
              description="Close on overlay click"
              isDarkMode={dark}
            />
            <PropRow
              name="closeOnEscape"
              type="boolean"
              defaultVal="true"
              description="Close on Escape key"
              isDarkMode={dark}
            />
            <PropRow
              name="trapFocus"
              type="boolean"
              defaultVal="true"
              description="Trap focus inside drawer"
              isDarkMode={dark}
            />
            <PropRow
              name="restoreFocus"
              type="boolean"
              defaultVal="true"
              description="Restore focus to trigger on close"
              isDarkMode={dark}
            />
            <PropRow
              name="initialFocus"
              type="RefObject<HTMLElement>"
              description="Focus this element on open"
              isDarkMode={dark}
            />
            <PropRow
              name="modal"
              type="boolean"
              defaultVal="true"
              description="Render as modal with overlay"
              isDarkMode={dark}
            />
            <PropRow
              name="keepMounted"
              type="boolean"
              defaultVal="false"
              description="Keep in DOM when closed"
              isDarkMode={dark}
            />
            <PropRow
              name="swipeable"
              type="boolean"
              defaultVal="false"
              description="Enable swipe-to-close"
              isDarkMode={dark}
            />
            <PropRow
              name="swipeThreshold"
              type="number"
              defaultVal="0.4"
              description="Swipe distance fraction to close"
              isDarkMode={dark}
            />
            <PropRow
              name="snapPoints"
              type="number[]"
              description="Snap positions as fractions (e.g. [0.3, 0.6, 1])"
              isDarkMode={dark}
            />
            <PropRow
              name="activeSnapPointIndex"
              type="number"
              description="Controlled snap point index"
              isDarkMode={dark}
            />
            <PropRow
              name="defaultSnapPointIndex"
              type="number"
              defaultVal="0"
              description="Initial snap point index"
              isDarkMode={dark}
            />
            <PropRow
              name="onSnapPointIndexChange"
              type="(index) => void"
              description="Snap point change callback"
              isDarkMode={dark}
            />
            <PropRow
              name="classes"
              type="DrawerClasses"
              description="Slot overrides: root, overlay, panel"
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
              name="reduceMotion"
              type='boolean | "auto"'
              description="Override reduced motion (auto = system)"
              isDarkMode={dark}
            />
            <PropRow
              name="portalContainer"
              type="HTMLElement | null"
              defaultVal="document.body"
              description="Portal target"
              isDarkMode={dark}
            />
            <PropRow
              name="onTransitionEnd"
              type="(open: boolean) => void"
              description="Fires after animation completes"
              isDarkMode={dark}
            />
          </PropsTable>
        </div>
      </Section>

      <Section title="Sub-Component Props" isDarkMode={dark}>
        <div className={c.card}>
          <p
            className={`text-xs font-semibold mb-3 text-cl-text-secondary`}
          >
            DrawerHeader, DrawerBody, DrawerFooter
          </p>
          <PropsTable isDarkMode={dark}>
            <PropRow
              name="children"
              type="ReactNode"
              description="Content"
              isDarkMode={dark}
            />
            <PropRow
              name="className"
              type="string"
              description="CSS class"
              isDarkMode={dark}
            />
          </PropsTable>
          <p
            className={`text-xs font-semibold mt-5 mb-3 text-cl-text-secondary`}
          >
            DrawerCloseButton
          </p>
          <PropsTable isDarkMode={dark}>
            <PropRow
              name="children"
              type="ReactNode"
              description="Custom close icon (default: X icon)"
              isDarkMode={dark}
            />
            <PropRow
              name="className"
              type="string"
              description="CSS class"
              isDarkMode={dark}
            />
            <PropRow
              name="onClick"
              type="(e) => void"
              description="Custom click handler (closes drawer unless e.preventDefault)"
              isDarkMode={dark}
            />
          </PropsTable>
        </div>
      </Section>

      {/* ─── Data Attributes ──────────────────────────────────────────── */}
      <Section title="Data Attributes" isDarkMode={dark}>
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow
              name="data-state"
              type="root"
              description='"open" | "closed"'
              isDarkMode={dark}
            />
            <PropRow
              name="data-direction"
              type="root, panel"
              description='"left"|"right"|"top"|"bottom"'
              isDarkMode={dark}
            />
            <PropRow
              name="data-drawer-panel"
              type="panel div"
              description="Identifies the panel element"
              isDarkMode={dark}
            />
            <PropRow
              name="data-drawer-overlay"
              type="overlay div"
              description="Identifies the overlay"
              isDarkMode={dark}
            />
            <PropRow
              name="data-drawer-header"
              type="DrawerHeader"
              description="Identifies the header"
              isDarkMode={dark}
            />
            <PropRow
              name="data-drawer-body"
              type="DrawerBody"
              description="Identifies the body"
              isDarkMode={dark}
            />
            <PropRow
              name="data-drawer-footer"
              type="DrawerFooter"
              description="Identifies the footer"
              isDarkMode={dark}
            />
            <PropRow
              name="data-drawer-close"
              type="DrawerCloseButton"
              description="Identifies the close button"
              isDarkMode={dark}
            />
            <PropRow
              name="data-autofocus"
              type="any element"
              description="Auto-focused on open (if no initialFocus ref)"
              isDarkMode={dark}
            />
          </PropsTable>
        </div>
      </Section>

      {/* ─── Accessibility ────────────────────────────────────────────── */}
      <Section title="Accessibility" isDarkMode={dark}>
        <div className={c.card}>
          <div
            className={`space-y-2 text-sm text-cl-text-secondary`}
          >
            {[
              'role="dialog" with aria-modal on the panel',
              "aria-labelledby auto-wired from DrawerHeader via context",
              "Supports aria-label, aria-labelledby, and aria-describedby",
              "Focus trapped inside the drawer (Tab cycles, Shift+Tab reverse cycles)",
              "Focus restored to trigger element on close",
              "initialFocus ref or data-autofocus for custom initial focus",
              "Escape key closes topmost drawer in stack",
              "Scroll lock prevents background scrolling",
              "inert attribute applied when keepMounted and closed",
              "prefers-reduced-motion disables animations (or override with reduceMotion prop)",
              "Stacked drawers: only topmost responds to Escape",
              "Swipe gestures use touch-action to prevent browser conflicts",
              "GPU-composited transform animations for smooth 60fps transitions",
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
              ["Escape", "Close the drawer (topmost in stack)"],
              ["Tab", "Cycle forward through focusable elements (trapped)"],
              [
                "Shift + Tab",
                "Cycle backward through focusable elements (trapped)",
              ],
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
        summary="Use the `open` prop with `onOpenChange` for full control. For swipe and snap points, coordinate `activeSnapPointIndex` with `onSnapPointIndexChange` when you own that state."
      />
      <DocEdgeCases
        isDarkMode={dark}
        items={[
          "Stacked drawers: confirm z-order and which drawer receives Escape.",
          "Body scroll lock vs nested scroll areas—test on iOS Safari.",
          "Focus restoration when `restoreFocus` conflicts with route changes.",
        ]}
      />
      <DocDoDont
        isDarkMode={dark}
        dos={[
          "Provide `aria-label` / `aria-labelledby` / `aria-describedby` on the panel.",
          "Trap focus when `modal` is true; test Tab order through header, body, footer.",
          "Use `initialFocus` for primary actions in complex layouts.",
        ]}
        donts={[
          "Do not nest modal dialogs that fight focus without a clear stack.",
          "Do not render essential page content only inside a closed drawer.",
          "Do not disable Escape handling without an obvious close affordance.",
        ]}
      />

      {/* ─── Data Attributes ──────────────────────────────────────────── */}
      <Section title="Data Attributes" description="Use for CSS-based state styling." isDarkMode={dark}>
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow name="data-state" type="root" description="'open' or 'closed'" isDarkMode={dark} />
            <PropRow name="data-direction" type="root" description="'left' | 'right' | 'top' | 'bottom'" isDarkMode={dark} />
          </PropsTable>
        </div>
      </Section>

      {/* ─── Accessibility ────────────────────────────────────────────── */}
      <Section title="Accessibility" description="Built-in accessibility features." isDarkMode={dark}>
        <div className={c.card}>
          <div className={`space-y-2 text-sm text-cl-text-secondary`}>
            {[
              "role=\"dialog\" applied to the drawer panel",
              "aria-modal=\"true\" when rendered as a modal overlay",
              "Focus trap with Tab / Shift+Tab keeps focus within the drawer",
              "Focus restoration returns focus to the trigger on close",
              "Supports aria-label, aria-labelledby, and aria-describedby",
              "lockScroll prevents background scroll while open",
              "closeOnEscape allows dismissal via the Escape key",
              "Swipeable dismiss on touch devices",
            ].map((text) => (
              <p key={text} className="flex items-start gap-2">
                <span className={`mt-0.5 shrink-0 text-cl-success`}>&#10003;</span>
                <span>{text}</span>
              </p>
            ))}
          </div>
        </div>
        <div className={`${c.card} mt-3`}>
          <p className={`text-xs font-semibold mb-3 text-cl-text-secondary`}>Keyboard Reference</p>
          <div className={`space-y-2 text-sm text-cl-text-secondary`}>
            {[
              ["Escape", "Close the drawer"],
              ["Tab", "Move focus to the next focusable element (trapped)"],
              ["Shift+Tab", "Move focus to the previous focusable element (trapped)"],
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

export default DrawerDemo;
