import {
  useState,
  useRef } from "react";
import {
  Drawer,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  DrawerCloseButton,
  } from "../../components/Drawer/index.js";
import { Button } from "../../components/Button/index.js";
import { Input } from "../../components/Input/index.js";
import { TextArea } from "../../components/TextArea/index.js";
import { Dropdown } from "../../components/Dropdown/index.js";
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

const categoryOptions = [
  { value: "general", label: "General" },
  { value: "design", label: "Design" },
  { value: "engineering", label: "Engineering" },
];

const getClasses = () => ({
  // Drawer panel surface. bg-cl-bg uses the page background colour so the
  // panel reads as an extension of the page, not a separate elevated card
  // (drawers slide in from screen edges — they ARE the page). Border on
  // the inner edge keeps the seam between drawer and page legible.
  panel: `flex flex-col h-full bg-cl-bg text-cl-text`,
  header: `flex items-center justify-between px-6 py-4 border-b border-cl-border`,
  body: `flex-1 overflow-y-auto px-6 py-5`,
  footer: `flex items-center justify-end gap-3 px-6 py-4 border-t border-cl-border bg-cl-bg-elevated`,
  title: `text-[17px] font-semibold text-cl-text leading-tight tracking-[-0.01em]`,
  closeBtn: `inline-flex items-center justify-center w-9 h-9 rounded-cl-md transition-colors text-cl-text-tertiary hover:text-cl-text hover:bg-cl-bg-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent focus-visible:ring-offset-2 focus-visible:ring-offset-cl-bg`,
  text: "text-cl-text-secondary leading-relaxed",
  // Button system follows the docs spec: primary = filled accent pill,
  // secondary = elevated surface with hairline border. Same h-10 px-5
  // sizing across the demos so every button reads at the same visual
  // weight.
  btn: `inline-flex items-center justify-center gap-2 h-10 px-5 text-sm font-medium rounded-cl-md transition-colors bg-cl-bg-elevated text-cl-text border border-cl-border hover:border-cl-border-input-hover hover:bg-cl-bg-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent focus-visible:ring-offset-2 focus-visible:ring-offset-cl-bg cursor-pointer`,
  btnPrimary: `inline-flex items-center justify-center gap-2 h-10 px-5 text-sm font-medium rounded-cl-md transition-colors bg-cl-accent text-cl-on-accent hover:bg-cl-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent focus-visible:ring-offset-2 focus-visible:ring-offset-cl-bg cursor-pointer`,
  card: `rounded-cl-lg p-5 bg-cl-bg-elevated`,
  kbd: `px-2 py-1 rounded-cl-sm text-[11px] font-mono min-w-[2.5rem] text-center font-medium bg-cl-bg-elevated border border-cl-border text-cl-text-secondary`,
  label: `text-xs font-medium text-cl-text-tertiary`,
});

function useDrawerState(initial = false) {
  const [open, setOpen] = useState(initial);
  return {
    open,
    onOpen: () => setOpen(true),
    onOpenChange: (o: boolean) => setOpen(o),
    onClose: () => setOpen(false),
  };
}

const DrawerDemo = () => {
  const [announcementMounts, setAnnouncementMounts] = useState(0);
  const { isDarkMode: dark } = useTheme();
  const c = getClasses();

  const basic = useDrawerState();
  const untrapped = useDrawerState();
  const directions = {
    start: useDrawerState(),
    end: useDrawerState(),
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
        <Button className={c.btn} onClick={onClose}>
          Cancel
        </Button>
        <Button className={c.btnPrimary} onClick={onClose}>
          Confirm
        </Button>
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

      <SetupNote />

      <ComponentAnatomy name="Drawer" />

      {/* ─── Basic ──────────────────────────────────────────────────────── */}
      <Section
        title="Basic Usage"
        description="Works out-of-the-box with built-in styles, overlay, focus trapping, and dark mode. No custom classes needed."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          {/* Basic usage — open/close via controlled state */}
          <Button className={c.btnPrimary} onClick={basic.onOpen}>
            Open Drawer
          </Button>
        </DemoWrapper>
        <Drawer open={basic.open} onOpenChange={basic.onOpenChange}>
          {renderDrawerContent("Basic Drawer", basic.onClose)}
        </Drawer>
      </Section>

      {/* ─── Directions ─────────────────────────────────────────────────── */}
      <Section
        title="Directions"
        description="Slide in from the inline start or end, the top or the bottom. Start is the left in a left-to-right page and the right in a right-to-left one."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          {/* Each Drawer beside its own button, inside the wrapper: the panel
              portals out, and the snippet carries the Drawer with its trigger. */}
          {(["start", "end", "top", "bottom"] as const).map((dir) => (
            <div key={dir}>
              <Button className={c.btn} onClick={directions[dir].onOpen}>
                {dir}
              </Button>
              <Drawer
                open={directions[dir].open}
                onOpenChange={directions[dir].onOpenChange}
                side={dir}
                size={dir === "top" || dir === "bottom" ? "250px" : "320px"}
              >
                {renderDrawerContent(
                  `${dir.charAt(0).toUpperCase() + dir.slice(1)} Drawer`,
                  directions[dir].onClose,
                )}
              </Drawer>
            </div>
          ))}
        </DemoWrapper>
      </Section>

      {/* ─── Custom Size ────────────────────────────────────────────────── */}
      <Section
        title="Custom Size"
        description="Control width/height with the size prop (any CSS value)."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <Button className={c.btnPrimary} onClick={sized.onOpen}>
            Open 500px Drawer
          </Button>
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
          <Button className={c.btn} onClick={overlay.onOpen}>
            Custom Opacity (0.45)
          </Button>
          <Button className={c.btn} onClick={blurOverlay.onOpen}>
            Blur Overlay
          </Button>
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
        title="Prevent Closing on Overlay Click or Escape"
        description="Keep a drawer open with closeOnOverlayClick={false} or closeOnEscape={false}. Use that only when closing would lose work, such as unsaved changes, and keep a visible close control in the drawer, like the X here."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <Button className={c.btn} onClick={noOverlayClose.onOpen}>
            No Overlay Close
          </Button>
          <Button className={c.btn} onClick={noEscClose.onOpen}>
            No Escape Close
          </Button>
        </DemoWrapper>
        <Drawer
          open={noOverlayClose.open}
          onOpenChange={noOverlayClose.onOpenChange}
          closeOnOverlayClick={false}
        >
          {renderDrawerContent(
            "Click overlay won't close",
            noOverlayClose.onClose,
            "Clicking the overlay won't close this drawer. Press Escape or use the X.",
          )}
        </Drawer>
        <Drawer
          open={noEscClose.open}
          onOpenChange={noEscClose.onOpenChange}
          closeOnEscape={false}
        >
          {renderDrawerContent(
            "Escape key won't close",
            noEscClose.onClose,
            "Escape won't close this drawer. Use the X: with closeOnEscape={false}, a visible close control is required.",
          )}
        </Drawer>
      </Section>

      {/* ─── Keep Mounted ───────────────────────────────────────────────── */}
      <Section
        title="Keep Mounted"
        description="Keep the drawer in DOM when closed (preserves form state)."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <Button className={c.btnPrimary} onClick={keepMounted.onOpen}>
            Open (keepMounted)
          </Button>
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
          <Button className={c.btnPrimary} onClick={nonModal.onOpen}>
            Open Non-Modal
          </Button>
        </DemoWrapper>
        <Drawer
          open={nonModal.open}
          onOpenChange={nonModal.onOpenChange}
          modal={false}
          side="end"
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
          <Button className={c.btnPrimary} onClick={customDuration.onOpen}>
            Open (600ms)
          </Button>
        </DemoWrapper>
        <Drawer
          open={customDuration.open}
          onOpenChange={customDuration.onOpenChange}
          animationDuration={600}
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
          <Button className={c.btnPrimary} onClick={swipeable.onOpen}>
            Open Swipeable
          </Button>
        </DemoWrapper>
        <Drawer
          open={swipeable.open}
          onOpenChange={swipeable.onOpenChange}
          swipeable
          side="bottom"
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
            <Button className={c.btnPrimary} onClick={snapPoints.onOpen}>
              Open Bottom Sheet
            </Button>
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
          side="bottom"
          size="85vh"
          snapPoints={[0.3, 0.6, 1]}
          snapPointIndex={snapIndex}
          onSnapPointIndexChange={setSnapIndex}
          defaultSnapPointIndex={1}
        >
          <div
            className={`flex flex-col h-full bg-cl-bg text-cl-text rounded-t-cl-lg`}
          >
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
                <Button
                  key={i}
                  size="sm"
                  className={
                    snapIndex === i
                      ? "rounded-cl-md bg-cl-accent text-cl-on-accent hover:bg-cl-accent-hover"
                      : "rounded-cl-md bg-cl-bg-elevated text-cl-text border border-cl-border hover:border-cl-border-input-hover hover:bg-cl-bg-hover"
                  }
                  onClick={() => setSnapIndex(i)}
                >
                  {Math.round([0.3, 0.6, 1][i] * 100)}%
                </Button>
              ))}
            </div>
            <DrawerBody className={`flex-1 overflow-y-auto px-5 py-4`}>
              {Array.from({ length: 20 }).map((_, i) => (
                <p
                  key={i}
                  className={`text-sm py-2 border-b border-cl-border text-cl-text-tertiary`}
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
          <Button className={c.btnPrimary} onClick={stacked1.onOpen}>
            Open First
          </Button>
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
              <Button className={c.btnPrimary} onClick={stacked2.onOpen}>
                Open Second
              </Button>
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
          <Button className={c.btnPrimary} onClick={initialFocus.onOpen}>
            Open (focus on input)
          </Button>
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
              <Input
                ref={initialFocusRef}
                label="Name"
                placeholder="This gets focus on open"
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
          <Button className={c.btnPrimary} onClick={transitionCb.onOpen}>
            Open (check log)
          </Button>
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

      <Section
        title="Classes System"
        description="Override root, overlay, and panel styling with the classes prop."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <Button className={c.btnPrimary} onClick={classesDemo.onOpen}>
            Custom Styled Drawer
          </Button>
        </DemoWrapper>
        <Drawer
          open={classesDemo.open}
          onOpenChange={classesDemo.onOpenChange}
          side="end"
          size="360px"
          classes={{
            overlay: `fixed inset-0 transition-opacity bg-cl-accent/30`,
            content: `fixed z-999999 shadow-2xl shadow-accent/20`,
          }}
        >
          <div
            className={`flex flex-col h-full bg-cl-bg border-s border-cl-border-input-focus`}
          >
            <DrawerHeader
              className={`flex items-center justify-between px-5 py-4 border-b border-cl-border-input-focus`}
            >
              <h2
                className={`text-lg font-semibold text-cl-accent`}
              >
                Custom Classes
              </h2>
              <DrawerCloseButton
                className={`p-2 rounded-cl-md text-cl-accent hover:bg-cl-accent/10`}
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
          <Button className={c.btnPrimary} onClick={reduceMotionDemo.onOpen}>
            Open (no animation)
          </Button>
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
          <Button className={c.btnPrimary} onClick={formDrawer.onOpen}>
            Create New Item
          </Button>
        </DemoWrapper>
        <Drawer
          open={formDrawer.open}
          onOpenChange={formDrawer.onOpenChange}
          side="end"
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
                {/* `data-autofocus` reaches the native input through the
                    rest props, which is what Drawer's initial-focus scan
                    looks for. */}
                <Input data-autofocus label="Name" placeholder="Item name" />
                <TextArea
                  label="Description"
                  rows={3}
                  placeholder="Optional description"
                />
                <Dropdown
                  label="Category"
                  options={categoryOptions}
                  placeholder="Select a category..."
                />
              </form>
            </DrawerBody>
            <DrawerFooter className={c.footer}>
              <Button className={c.btn} onClick={formDrawer.onClose}>
                Cancel
              </Button>
              <Button className={c.btnPrimary} onClick={formDrawer.onClose}>
                Create
              </Button>
            </DrawerFooter>
          </div>
        </Drawer>
      </Section>

      {/* ─── The focus behaviours, and turning them off ───────────────────── */}
      <Section
        title="Focus trapping and restoration"
        description="A Drawer keeps Tab inside itself while it is open and returns focus to whatever opened it when it closes. Both are on by default and both can be turned off — for a non-modal panel that should not steal the keyboard, or one opened from a control that will no longer exist when it closes."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <Button className={c.btnPrimary} onClick={untrapped.onOpen}>
            Open without focus trap or restore
          </Button>
          <p className="mt-3 text-sm text-cl-text-secondary">
            Tab out of it — the focus ring walks into the page behind, which it
            cannot do in the drawer above. Close it and focus does not come back
            to this button.
          </p>
        </DemoWrapper>
        <Drawer
          open={untrapped.open}
          onOpenChange={untrapped.onOpenChange}
          trapFocus={false}
          restoreFocus={false}
        >
          {renderDrawerContent("No trap, no restore", untrapped.onClose)}
        </Drawer>
      </Section>

      {/* ─── Uncontrolled ────────────────────────────────────────────────── */}
      <Section
        title="Uncontrolled"
        description="Uncontrolled: mount it open, and it closes itself (its close button, Escape, the overlay). Use this for a dialog that appears once, such as an announcement or a route's dialog; use open/onOpenChange when the page needs to open it again or know its state."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="inline">
          <Button
            className="border border-cl-border bg-cl-bg-elevated text-cl-text"
            onClick={() => setAnnouncementMounts((n) => n + 1)}
          >
            Show it
          </Button>
          {announcementMounts > 0 && (
            <Drawer key={announcementMounts} defaultOpen side="end" aria-label="What's new">
              <div className="flex h-full flex-col bg-cl-bg text-cl-text">
                <DrawerHeader className="flex items-center justify-between border-b border-cl-border px-6 py-4">
                  <h2 className="text-[17px] font-semibold">What's new</h2>
                  <DrawerCloseButton className="inline-flex h-9 w-9 items-center justify-center rounded-cl-md text-cl-text-tertiary hover:bg-cl-bg-hover hover:text-cl-text">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </DrawerCloseButton>
                </DrawerHeader>
                <DrawerBody className="flex-1 overflow-y-auto px-6 py-5 text-sm text-cl-text-secondary">
                  Saved filters now sync across your devices.
                </DrawerBody>
              </div>
            </Drawer>
          )}
        </DemoWrapper>
      </Section>

      {/* ─── Reference — generated from the schema and the .ai.md ──────── */}
      {/* ─── At phone width ──────────────────────────────────────────────── */}
      <Section
        title="At phone width"
        codeless="the same component at phone width, in a frame; its code is in the sections above"
      >
        <PhoneFrame
          route="/preview/Drawer/phone"
          lookFor="The 300 px panel covers most of the screen and leaves a strip of the page beside it."
        />
      </Section>

      {/* ─── Long sheet ──────────────────────────────────────────────────── */}
      <Section
        title="Long sheet"
        codeless="the same component at phone width, in a frame; its code is in the sections above"
      >
        <PhoneFrame
          route="/preview/Drawer/long-sheet"
          lookFor="Its content scrolls by touch, and the sheet drags from its handle or its header."
        />
      </Section>

      <ComponentDocs name="Drawer" />

      <DocControlledPattern
        isDarkMode={dark}
        summary="Use the `open` prop with `onOpenChange` for full control. For swipe and snap points, coordinate `snapPointIndex` with `onSnapPointIndexChange` when you own that state."
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

      <CopyPasteBlock name="Drawer" />

    </div>
  );
};

export default DrawerDemo;
