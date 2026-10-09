import {
  useState,
  useRef,
  useEffect,
  useCallback } from "react";
import { Modal,
  useModal } from "../../components/Modal/index.js";
import { Button } from "../../components/Button/index.js";
import { Switch } from "../../components/Switch/index.js";
import { useTheme } from "./ThemeContext.js";
import {
  DocsHero,
  Section,
  DemoWrapper,
  DocControlledPattern,
  DocEdgeCases,
  DocDoDont,
  ComponentDocs,
  CopyPasteBlock,
  SetupNote,
} from "./components/index.js";

// Buttons follow the home-page CTA system: primary = the inverse-fg pill
// (the "Browse components" treatment), secondary = an elevated-surface
// pill with a hairline border (the npm-install pill). Status variants
// (danger/success/warning) keep their semantic hue and use text-cl-bg
// so the inverted text stays legible against the colored fill in either
// theme. Sizes match the Drawer demo so every demo button reads at the
// same visual weight.
const baseBtn =
  "inline-flex items-center justify-center gap-2 h-10 px-5 text-sm font-medium rounded-cl-md transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

const getClasses = (dark: boolean) => ({
  btn: `${baseBtn} bg-cl-bg-elevated text-cl-text border border-cl-border hover:border-cl-border-input hover:bg-cl-bg-elevated cursor-pointer`,
  btnPrimary: `${baseBtn} bg-cl-text text-cl-bg hover:opacity-90 cursor-pointer`,
  btnAccent: `${baseBtn} bg-cl-accent text-cl-on-accent hover:bg-cl-accent/90 cursor-pointer`,
  btnDanger: `${baseBtn} bg-cl-error text-cl-bg hover:bg-cl-error/90 cursor-pointer`,
  btnSuccess: `${baseBtn} bg-cl-success text-cl-bg hover:bg-cl-success/90 cursor-pointer`,
  btnWarning: `${baseBtn} bg-cl-warning text-cl-bg hover:bg-cl-warning/90 cursor-pointer`,
  btnGhost: `${baseBtn} text-cl-text-secondary hover:text-cl-text hover:bg-cl-bg-hover`,
  text: dark ? "text-cl-text-secondary" : "text-cl-text-secondary",
  card: `rounded-cl-lg p-5 bg-cl-bg-elevated`,
  label: `text-xs font-medium text-cl-text-tertiary`,
  modalContent: "w-full max-w-lg m-4 rounded-cl-lg shadow-2xl overflow-hidden bg-cl-bg-elevated border border-cl-border",
  modalHeader: "flex items-start gap-3 p-6 pb-4",
  modalTitle: "font-semibold text-lg text-cl-text",
  modalDescription: "mt-1 text-sm text-cl-text-secondary",
  modalCloseBtn: "shrink-0 p-1 rounded-cl-md hover:bg-cl-bg-hover transition-colors ml-auto",
  modalCloseIcon: "w-5 h-5 text-cl-text-tertiary",
  modalBody: "px-6 pb-6",
  kbd: `px-2 py-1 rounded-cl-md text-[11px] font-mono min-w-[2.5rem] text-center font-medium bg-cl-bg-elevated border border-cl-border text-cl-text-secondary`,
  // Form input: tokenized so it auto-themes. Uses bg-cl-bg (page base) so
  // it contrasts against the modal's bg-cl-bg-elevated surface — otherwise
  // the field blends invisibly into the modal in both modes.
  input:
    "w-full px-3 py-2.5 rounded-cl-md bg-cl-bg border border-cl-border text-cl-text placeholder:text-cl-text-tertiary outline-none transition-colors focus:border-cl-border-input-focus focus:ring-2 focus:ring-cl-accent/15 dark:[color-scheme:dark]",
});

const ModalChildWithHook = () => {
  const { close, nestingLevel } = useModal();
  return (
    <div className="space-y-3">
      <p className="text-cl-text-secondary">
        This component uses the <code className="px-1.5 py-0.5 bg-cl-bg-hover rounded text-sm font-mono">useModal()</code> hook.
      </p>
      <div className="p-3 bg-cl-accent/10 rounded-cl-md text-sm text-cl-accent">
        Current nesting level: <span className="font-bold">{nestingLevel}</span>
      </div>
      <Button
        onClick={close}
        className="px-4 py-2 bg-cl-accent text-cl-on-accent rounded-cl-md hover:bg-cl-accent/90 transition-colors cursor-pointer"
      >
        Close via useModal().close()
      </Button>
    </div>
  );
};

const KeepMountedLogger = ({ onLog }: { onLog: (msg: string) => void }) => {
  useEffect(() => {
    onLog("Mounted");
    return () => onLog("Unmounted");
  }, [onLog]);
  return <p className="text-cl-text-secondary">This content logs mount/unmount events.</p>;
};

/** The document preview's page count and zoom range, in percent. */
const DOC_PAGES = 12;
const ZOOM_MIN = 50;
const ZOOM_MAX = 200;
const ZOOM_STEP = 25;

const ModalDemo = () => {
  const { isDarkMode: dark } = useTheme();
  const c = getClasses(dark);

  const [basicOpen, setBasicOpen] = useState(false);
  const [bareOpen, setBareOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [imagePreviewOpen, setImagePreviewOpen] = useState(false);
  const [customSizeOpen, setCustomSizeOpen] = useState(false);
  const [fullScreenOpen, setFullScreenOpen] = useState(false);
  // The document preview's pager and zoom, and what its demo actions report.
  const [docPage, setDocPage] = useState(1);
  const [docZoom, setDocZoom] = useState(100);
  const [docAction, setDocAction] = useState<string | null>(null);
  const [imageAction, setImageAction] = useState<string | null>(null);
  const [inviteNote, setInviteNote] = useState<string | null>(null);
  const [customOverlayOpen, setCustomOverlayOpen] = useState(false);
  const [preventCloseOpen, setPreventCloseOpen] = useState(false);
  const [nestedLevel1Open, setNestedLevel1Open] = useState(false);
  const [nestedLevel2Open, setNestedLevel2Open] = useState(false);

  const [classesOpen, setClassesOpen] = useState(false);
  const [reduceMotionOpen, setReduceMotionOpen] = useState(false);
  const [reduceMotionAutoOpen, setReduceMotionAutoOpen] = useState(false);
  const [focusTrapOpen, setFocusTrapOpen] = useState(false);
  const [noFocusTrapOpen, setNoFocusTrapOpen] = useState(false);
  const [initialFocusOpen, setInitialFocusOpen] = useState(false);
  const initialFocusRef = useRef<HTMLInputElement>(null);
  const [keepMountedOpen, setKeepMountedOpen] = useState(false);
  const [keepMountedLog, setKeepMountedLog] = useState<string[]>([]);
  const handleKeepMountedLog = useCallback((msg: string) => {
    setKeepMountedLog((prev) => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] ${msg}`,
    ]);
  }, []);
  const [customCloseIconOpen, setCustomCloseIconOpen] = useState(false);
  const [disableAnimOpen, setDisableAnimOpen] = useState(false);
  const [customZIndexOpen, setCustomZIndexOpen] = useState(false);
  const [useModalOpen, setUseModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const [refForwardOpen, setRefForwardOpen] = useState(false);
  const [refFocusReadout, setRefFocusReadout] = useState("nothing yet");

  return (
    <div className="space-y-10">
      <DocsHero
        title="Modal"
        description="Accessible dialog overlays for focused interactions and important content."
        code={`import { Modal, useModal } from "@chumlab/ui/modal";`}
      />

      <SetupNote />

      <CopyPasteBlock name="Modal" />

      {/* ─── Basic ───────────────────────────────────────────────────────── */}
      <Section
        title="Basic Usage"
        description="Works out-of-the-box with built-in styles, dark mode, focus trapping, and Escape to close. No custom classes needed."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          {/* Basic usage — open/close via controlled state, built-in defaults */}
          <Button className={c.btnPrimary} onClick={() => setBasicOpen(true)}>
            Open Modal
          </Button>
        </DemoWrapper>
        <Modal open={basicOpen}
          onOpenChange={setBasicOpen}
          title="Welcome Back"
          description="Your session has been restored. You can continue where you left off."
          classes={{ content: c.modalContent }}
        >
          <p className={`text-sm text-cl-text-secondary`}>
            This modal uses only built-in default styles. It includes a title, description, close button, overlay with blur, focus trapping, and Escape key support — all out-of-the-box.
          </p>
          <div className="flex justify-end gap-3 mt-6">
            <Button
              className={`px-4 py-2 text-sm font-medium rounded-cl-md transition-colors bg-cl-bg-elevated text-cl-text border border-cl-border hover:border-cl-border-input-hover hover:bg-cl-bg-hover cursor-pointer`}
              onClick={() => setBasicOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className={`px-4 py-2 text-sm font-medium rounded-cl-md transition-colors bg-cl-text text-cl-bg hover:opacity-90 cursor-pointer`}
              onClick={() => setBasicOpen(false)}
            >
              Continue
            </Button>
          </div>
        </Modal>
      </Section>

      {/* ─── Use Cases ───────────────────────────────────────────────────── */}
      <Section
        title="Use Cases"
        description="Common modal patterns for confirmations, success states, forms, and previews."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <div className="flex flex-wrap gap-2">
            <Button className={c.btnDanger} onClick={() => setConfirmDeleteOpen(true)}>
              Confirm Delete
            </Button>
            <Button className={c.btnSuccess} onClick={() => setSuccessOpen(true)}>
              Success State
            </Button>
            <Button className={c.btnAccent} onClick={() => setUpgradeOpen(true)}>
              Upgrade Plan
            </Button>
            <Button className={c.btn} onClick={() => setImagePreviewOpen(true)}>
              Image Preview
            </Button>
          </div>
        </DemoWrapper>
        <Modal
          open={confirmDeleteOpen}
          onOpenChange={setConfirmDeleteOpen}
          showHeader={false}
          preventOutsideClick
          closeOnEscape={false}
          classes={{ body: "p-6" }}
        >
          <div className="flex flex-col items-center">
            {/* Animated danger icon */}
            <div className={`relative mb-5 flex h-16 w-16 items-center justify-center rounded-cl-lg bg-cl-error-bg`}>
              <div className={`absolute inset-0 rounded-cl-lg bg-cl-error/50 animate-pulse`} />
              <svg className={`relative h-8 w-8 text-cl-error`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>

            <h3 className={`text-lg font-bold mb-1 text-cl-text`}>Delete this project?</h3>
            <p className={`text-sm text-center mb-5 max-w-xs text-cl-text-secondary`}>
              This will permanently remove <span className={`font-semibold text-cl-error`}>"Marketing Website"</span> and all its data. This cannot be undone.
            </p>

            {/* Danger zone card */}
            <div className={`w-full rounded-cl-lg p-4 mb-6 border bg-cl-error-bg border-cl-error`}>
              <div className="flex items-start gap-3">
                <svg className={`h-5 w-5 mt-0.5 shrink-0 text-cl-error`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className={`text-sm font-medium text-cl-error`}>What will be deleted:</p>
                  <ul className={`text-xs mt-1.5 space-y-1 text-cl-error/80`}>
                    <li>12 pages and all content</li>
                    <li>3 team members will lose access</li>
                    <li>Connected analytics data</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex w-full gap-3">
              <Button className={`flex-1 ${c.btn} cursor-pointer`} onClick={() => setConfirmDeleteOpen(false)}>Keep Project</Button>
              <Button
                className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-cl-lg transition-all text-cl-bg bg-cl-error hover:bg-cl-error/95 cursor-pointer`}
                onClick={() => setConfirmDeleteOpen(false)}
              >
                Yes, Delete
              </Button>
            </div>
          </div>
        </Modal>
        <Modal
          open={successOpen}
          onOpenChange={setSuccessOpen}
          showHeader={false}
          classes={{ body: "p-6" }}
        >
          <div className="flex flex-col items-center">
            {/* Animated success icon */}
            <div className="relative mb-5">
              <div className={`absolute -inset-3 rounded-full blur-xl bg-cl-success/25`} />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-cl-success/30 to-cl-success shadow-lg shadow-success/25">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            <h3 className={`text-xl font-bold mb-1 text-cl-text`}>Payment Successful!</h3>
            <p className={`text-sm mb-5 text-cl-text-secondary`}>Your order has been confirmed and is being processed.</p>

            {/* Order details card */}
   <div className={`w-full rounded-cl-lg divide-y mb-6 border border-cl-border divide-border-faint bg-cl-bg-hover`}>
              <div className="flex items-center justify-between px-4 py-3">
                <span className={`text-sm text-cl-text-secondary`}>Order</span>
                <span className={`text-sm font-mono font-medium text-cl-text`}>#ORD-2024-8847</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <span className={`text-sm text-cl-text-secondary`}>Amount</span>
                <span className={`text-sm font-bold text-cl-success`}>$149.00</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <span className={`text-sm text-cl-text-secondary`}>Confirmation</span>
                <span className={`text-sm text-cl-text-secondary`}>john.doe@example.com</span>
              </div>
            </div>

            <div className="flex w-full gap-3">
              <Button className={`flex-1 ${c.btn} cursor-pointer`} onClick={() => setSuccessOpen(false)}>View Order</Button>
              <Button
                className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-cl-lg transition-all text-cl-bg bg-cl-success hover:bg-cl-success/95 cursor-pointer`}
                onClick={() => setSuccessOpen(false)}
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        </Modal>
        <Modal
          open={upgradeOpen}
          onOpenChange={setUpgradeOpen}
          showHeader={false}
          classes={{ body: "p-0" }}
        >
          <div className="bg-cl-accent p-8 text-center text-cl-on-accent">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-cl-text/20 backdrop-blur-sm">
              <svg
                className="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-2">Upgrade to Pro</h3>
            <p className="text-white/85">
              Unlock all features and boost your productivity.
            </p>
          </div>
          <div className="p-6">
            <ul className="space-y-3 mb-6">
              {["Unlimited projects", "Advanced analytics", "Priority support", "API access"].map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className={`flex h-5 w-5 items-center justify-center rounded-full bg-cl-accent-surface`}>
                    <svg className={`h-3 w-3 text-cl-accent`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-cl-text-secondary">{feature}</span>
                </li>
              ))}
            </ul>
            <div className="flex items-baseline gap-1 justify-center mb-6">
              <span className={`text-3xl font-bold text-cl-text`}>$29</span>
              <span className="text-cl-text-tertiary">/month</span>
            </div>
            <Button
              size="lg"
              onClick={() => setUpgradeOpen(false)}
              className="w-full rounded-cl-md bg-cl-text text-cl-bg hover:opacity-90"
            >
              Upgrade Now
            </Button>
            <button
              onClick={() => setUpgradeOpen(false)}
              className={`w-full mt-3 text-sm text-cl-text-tertiary hover:text-cl-text cursor-pointer`}
            >
              Maybe later
            </button>
          </div>
        </Modal>
        <Modal
          open={imagePreviewOpen}
          onOpenChange={setImagePreviewOpen}
          showHeader={false}
          overlayOpacity={0.85}
          classes={{ content: "bg-cl-bg", body: "p-0" }}
        >
          <div className="relative">
            <button aria-label="Close"
              onClick={() => setImagePreviewOpen(false)}
              className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(0,0,0,0.55)] text-white hover:bg-[rgba(0,0,0,0.75)] transition-colors cursor-pointer"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className="aspect-video bg-linear-to-br from-cl-accent/40 via-cl-accent/30 to-cl-accent/60 flex items-center justify-center">
              <div className="text-center text-white">
                <svg
                  className="h-16 w-16 mx-auto mb-4 opacity-80"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-lg font-medium opacity-90">Image Preview</p>
              </div>
            </div>
            <div className="bg-cl-bg p-4 flex flex-wrap items-center justify-between gap-3">
              <div className="text-cl-text min-w-0">
                <p className="font-medium truncate">Sunset at Malibu Beach</p>
                <p className="text-sm text-cl-text-tertiary truncate">4032 × 3024 • 3.2 MB</p>
                {imageAction && (
                  <p role="status" className="text-sm text-cl-text-secondary">
                    {imageAction}
                  </p>
                )}
              </div>
              <Button
                className="flex items-center gap-2 px-3 py-2 text-sm text-cl-text-secondary hover:text-cl-text hover:bg-cl-bg-elevated rounded-cl-md transition-colors cursor-pointer"
                onClick={() => setImageAction("Download started (demo): Sunset at Malibu Beach.jpg")}
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Download
              </Button>
            </div>
          </div>
        </Modal>
      </Section>

      {/* ─── Size & Position ─────────────────────────────────────────────── */}
      <Section
        title="Size & Position"
        description="Control modal dimensions and screen placement."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <div className="flex flex-wrap gap-2">
            <Button className={c.btnPrimary} onClick={() => setCustomSizeOpen(true)}>
              Custom Size
            </Button>
            <Button className={c.btnPrimary} onClick={() => setFullScreenOpen(true)}>
              Full Screen
            </Button>
          </div>
        </DemoWrapper>
        <Modal
          open={customSizeOpen}
          onOpenChange={setCustomSizeOpen}
          title="Custom Size Modal"
          description="This modal has custom width and height constraints."
          maxWidth={700}
          maxHeight={400}
          classes={{
            content: "w-full m-4 rounded-cl-lg shadow-2xl overflow-hidden",
            header: c.modalHeader,
            title: c.modalTitle,
            description: c.modalDescription,
            closeTrigger: c.modalCloseBtn,
            closeIcon: c.modalCloseIcon,
            body: c.modalBody,
          }}
        >
          <div className="space-y-4">
            <p className="text-cl-text-secondary">
              Use maxWidth, maxHeight, minWidth, and minHeight props to control
              modal dimensions.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-cl-bg-hover rounded-cl-md">
                <span className="text-cl-text-tertiary">maxWidth:</span>{" "}
                <span className="font-mono">700px</span>
              </div>
              <div className="p-3 bg-cl-bg-hover rounded-cl-md">
                <span className="text-cl-text-tertiary">maxHeight:</span>{" "}
                <span className="font-mono">400px</span>
              </div>
            </div>
          </div>
        </Modal>
        <Modal
          open={fullScreenOpen}
          onOpenChange={setFullScreenOpen}
          showHeader={false}
          fullScreen
          centered={false}
          classes={{
            // bg-cl-bg-elevated for a consistent surface across the panel —
            // matches the header/footer so there's no visual seam between
            // the chrome strips and the body region.
            content: "bg-cl-bg-elevated",
            body: "p-0 h-full",
          }}
        >
          <div className="h-full flex flex-col">
            <header className="bg-cl-bg-elevated border-b border-cl-border px-4 sm:px-6 py-4 flex flex-wrap items-center gap-3 sm:gap-4 shrink-0">
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <Button
                  size="sm"
                  aria-label="Close"
                  onClick={() => setFullScreenOpen(false)}
                  className="shrink-0 rounded-cl-md hover:bg-cl-bg-hover"
                  startIcon={
                    <svg
                      className="w-5 h-5 text-cl-text-secondary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  }
                />
                <div className="min-w-0">
                  <h1 className="font-semibold text-cl-text truncate">
                    Document Preview
                  </h1>
                  <p className="text-sm text-cl-text-tertiary truncate">Annual Report 2024.pdf</p>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <Button className="px-3 py-2 text-sm text-cl-text-secondary hover:bg-cl-bg-hover rounded-cl-md transition-colors flex items-center gap-2 cursor-pointer"
                  onClick={() => setDocAction("Download started (demo)")}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  <span className="hidden sm:inline">Download</span>
                </Button>
                <Button className="px-3 py-2 text-sm text-cl-text-secondary hover:bg-cl-bg-hover rounded-cl-md transition-colors flex items-center gap-2 cursor-pointer"
                  onClick={() => setDocAction("Print dialog would open (demo)")}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                    />
                  </svg>
                  <span className="hidden sm:inline">Print</span>
                </Button>
                <Button className="px-3 py-2 text-sm bg-cl-accent text-cl-on-accent hover:bg-cl-accent/90 rounded-cl-md transition-colors flex items-center gap-2 cursor-pointer"
                  onClick={() => setDocAction("Share link copied (demo)")}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    />
                  </svg>
                  <span className="hidden sm:inline">Share</span>
                </Button>
              </div>
            </header>

            <div className="flex-1 overflow-auto p-8">
              <div
                className="max-w-4xl mx-auto bg-cl-bg-elevated rounded-cl-lg shadow-sm border border-cl-border p-12 origin-top transition-transform"
                style={{ transform: `scale(${docZoom / 100})` }}
              >
                <p className="text-right text-sm text-cl-text-tertiary mb-4">
                  Page {docPage} of {DOC_PAGES}
                </p>
                <div className="text-center mb-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-cl-accent/10 rounded-full mb-4">
                    <svg
                      className="w-8 h-8 text-cl-accent"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-cl-text mb-2">
                    Annual Report 2024
                  </h2>
                  <p className="text-cl-text-tertiary">
                    Acme Corporation • Q4 Financial Summary
                  </p>
                </div>

                <div className="space-y-8">
                  <section>
                    <h3 className="text-xl font-semibold text-cl-text mb-4">
                      Executive Summary
                    </h3>
                    <p className="text-cl-text-secondary leading-relaxed">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                      do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                      ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold text-cl-text mb-4">
                      Key Metrics
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div className="p-4 bg-cl-success/15 rounded-cl-md border border-cl-success">
                        <p className="text-sm text-cl-success font-medium">
                          Revenue
                        </p>
                        <p className="text-2xl font-bold text-cl-success">
                          $12.4M
                        </p>
                        <p className="text-sm text-cl-success">+24% YoY</p>
                      </div>
                      <div className="p-4 bg-cl-accent/10 rounded-cl-md border border-cl-border-input-focus">
                        <p className="text-sm text-cl-accent font-medium">Users</p>
                        <p className="text-2xl font-bold text-cl-accent">847K</p>
                        <p className="text-sm text-cl-accent">+18% YoY</p>
                      </div>
                      <div className="p-4 bg-cl-accent/10 rounded-cl-md border border-cl-border-input-focus">
                        <p className="text-sm text-cl-accent font-medium">
                          NPS Score
                        </p>
                        <p className="text-2xl font-bold text-cl-accent">72</p>
                        <p className="text-sm text-cl-accent">+8 points</p>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold text-cl-text mb-4">
                      Looking Ahead
                    </h3>
                    <p className="text-cl-text-secondary leading-relaxed">
                      Duis aute irure dolor in reprehenderit in voluptate velit
                      esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                      occaecat cupidatat non proident, sunt in culpa qui officia
                      deserunt mollit anim id est laborum.
                    </p>
                  </section>
                </div>
              </div>
            </div>

            <footer className="bg-cl-bg-elevated border-t border-cl-border px-4 sm:px-6 py-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                <Button aria-label="Previous page"
                  className="p-2 hover:bg-cl-bg-hover rounded-cl-md transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                  disabled={docPage === 1}
                  onClick={() => setDocPage((p) => Math.max(1, p - 1))}
                >
                  <svg
                    className="w-5 h-5 text-cl-text-secondary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </Button>
                <span className="text-sm text-cl-text-secondary">Page {docPage} of {DOC_PAGES}</span>
                <Button
                  aria-label="Next page"
                  className="p-2 hover:bg-cl-bg-hover rounded-cl-md transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                  disabled={docPage === DOC_PAGES}
                  onClick={() => setDocPage((p) => Math.min(DOC_PAGES, p + 1))}
                >
                  <svg
                    className="w-5 h-5 text-cl-text-secondary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Button>
              </div>
              {docAction && (
                <p role="status" className="text-sm text-cl-text-secondary">
                  {docAction}
                </p>
              )}
              <div className="flex items-center gap-2">
                <Button
                  aria-label="Zoom in"
                  className="p-2 hover:bg-cl-bg-hover rounded-cl-md transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                  disabled={docZoom === ZOOM_MAX}
                  onClick={() => setDocZoom((z) => Math.min(ZOOM_MAX, z + ZOOM_STEP))}
                >
                  <svg
                    className="w-5 h-5 text-cl-text-secondary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                    />
                  </svg>
                </Button>
                <Button
                  aria-label="Zoom out"
                  className="p-2 hover:bg-cl-bg-hover rounded-cl-md transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                  disabled={docZoom === ZOOM_MIN}
                  onClick={() => setDocZoom((z) => Math.max(ZOOM_MIN, z - ZOOM_STEP))}
                >
                  <svg
                    className="w-5 h-5 text-cl-text-secondary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"
                    />
                  </svg>
                </Button>
                <span className="text-sm text-cl-text-tertiary ml-2">{docZoom}%</span>
              </div>
            </footer>
          </div>
        </Modal>
      </Section>

      {/* ─── Overlay & Behavior ──────────────────────────────────────────── */}
      <Section
        title="Overlay, Outside Click & Escape"
        description="Customize the overlay backdrop, or keep a modal open with preventOutsideClick and closeOnEscape={false}. Use that only when closing would lose work, such as unsaved changes, and always give the modal a visible close control."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <div className="flex flex-wrap gap-2">
            <Button className={c.btn} onClick={() => setCustomOverlayOpen(true)}>
              Custom Overlay
            </Button>
            <Button className={c.btn} onClick={() => setPreventCloseOpen(true)}>
              Prevent Outside Click & Escape
            </Button>
          </div>
        </DemoWrapper>
        <Modal
          open={customOverlayOpen}
          onOpenChange={setCustomOverlayOpen}
          title="Custom Overlay"
          description="This modal has a brand-blue overlay with higher opacity."
          overlayColor="#5b9bff"
          overlayOpacity={0.4}
          classes={{
            content: c.modalContent,
            header: c.modalHeader,
            title: c.modalTitle,
            description: c.modalDescription,
            closeTrigger: c.modalCloseBtn,
            closeIcon: c.modalCloseIcon,
            body: c.modalBody,
          }}
        >
          <p className="text-cl-text-secondary">
            Customize the overlay with overlayColor and overlayOpacity props.
          </p>
        </Modal>
        <Modal open={preventCloseOpen}
          onOpenChange={setPreventCloseOpen}
          title="Important Action Required"
          description="You must complete this action before continuing."
          preventOutsideClick
          closeOnEscape={false}
          showCloseButton={false}
          showIcon
          icon={
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cl-warning/15"
        >
              <svg
                className="h-5 w-5 text-cl-warning"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          }
          classes={{
            content: c.modalContent,
            header: c.modalHeader,
            title: c.modalTitle,
            description: c.modalDescription,
            icon: "shrink-0",
            body: c.modalBody,
          }}
        >
          <p className="text-cl-text-secondary">
            This modal cannot be dismissed by clicking outside or pressing Escape.
            Use the buttons below.
          </p>
          <div className="flex justify-end gap-3 mt-6">
            <Button
              className={c.btn}
              onClick={() => setPreventCloseOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className={c.btnWarning}
              onClick={() => setPreventCloseOpen(false)}
            >
              I Understand
            </Button>
          </div>
        </Modal>
      </Section>

      {/* ─── Nested Modals ───────────────────────────────────────────────── */}
      <Section
        title="Nested Modals"
        description="Stack multiple modals with proper nesting and z-index management."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <Button className={c.btnPrimary} onClick={() => setNestedLevel1Open(true)}>
            Open Nested Modal
          </Button>
        </DemoWrapper>
        <Modal open={nestedLevel1Open}
          onOpenChange={setNestedLevel1Open}
          title="Project Settings"
          description="Configure your project preferences and team access."
          classes={{ content: c.modalContent }}
        >
          <div className="space-y-4">
            <div className={`p-4 rounded-cl-md border bg-cl-accent-surface border-cl-border-input-focus`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`font-medium text-cl-accent`}>Team Members</p>
                  <p className={`text-sm text-cl-accent`}>5 members with access</p>
                </div>
                <Button
                  className={`px-3 py-1.5 text-cl-on-accent text-sm rounded-cl-md transition-colors bg-cl-accent hover:bg-cl-accent/90 cursor-pointer`}
                  onClick={() => setNestedLevel2Open(true)}
                >
                  Manage
                </Button>
              </div>
            </div>
            <div className={`flex items-center justify-between p-4 border rounded-cl-md border-cl-border`}>
              <div>
                <p className={`font-medium text-cl-text`}>Notifications</p>
                <p className={`text-sm text-cl-text-secondary`}>Email & push notifications</p>
              </div>
              <Switch defaultChecked aria-label="Notifications" />
            </div>
          </div>
          <div className={`flex justify-end gap-3 mt-6 pt-4 border-t border-cl-border`}>
            <Button
              className={c.btn}
              onClick={() => setNestedLevel1Open(false)}
            >
              Cancel
            </Button>
            <Button
              className={c.btnPrimary}
              onClick={() => setNestedLevel1Open(false)}
            >
              Save Changes
            </Button>
          </div>

          <Modal open={nestedLevel2Open}
            onOpenChange={setNestedLevel2Open}
            title="Team Members"
            description="Manage project access and roles."
            nestingLevel={1}
        >
            <div className="space-y-3">
              {[
                { name: "Sarah Chen", role: "Owner", initials: "SC" },
                { name: "Mike Johnson", role: "Editor", initials: "MJ" },
                { name: "Emily Davis", role: "Viewer", initials: "ED" },
              ].map((member, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between p-3 rounded-cl-md bg-cl-bg-hover`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-cl-accent/40 to-cl-accent text-white text-sm font-medium">
                      {member.initials}
                    </div>
                    <div>
                      <p className={`font-medium text-cl-text`}>{member.name}</p>
                      <p className={`text-sm text-cl-text-secondary`}>{member.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button
              className={`w-full mt-4 flex items-center justify-center gap-2 p-3 border-2 border-dashed rounded-cl-md transition-colors border-cl-border text-cl-text-tertiary hover:border-cl-border-input-focus hover:text-cl-accent cursor-pointer`}
              onClick={() => setInviteNote("Invitation sent to new.member@example.com (demo)")}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Invite Member
            </Button>
            {inviteNote && (
              <p role="status" className="mt-2 text-sm text-cl-text-secondary">
                {inviteNote}
              </p>
            )}
            <div className={`flex justify-end mt-6 pt-4 border-t border-cl-border`}>
              <Button
                className={c.btnPrimary}
                onClick={() => setNestedLevel2Open(false)}
              >
                Done
              </Button>
            </div>
          </Modal>
        </Modal>
      </Section>

      <Section
        title="Classes System"
        description="Override individual sub-element styles via the classes prop."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <Button className={c.btnPrimary} onClick={() => setClassesOpen(true)}>
            Modal with Classes
          </Button>
        </DemoWrapper>
        <Modal
          open={classesOpen}
          onOpenChange={setClassesOpen}
          title="Classes System Demo"
          description="Each slot is styled via the classes prop."
          classes={{
            root: "custom-root",
            overlay: "backdrop-blur-sm",
            content: `w-full max-w-lg m-4 rounded-cl-lg shadow-2xl overflow-hidden bg-cl-bg`,
            header: "flex items-start gap-3 p-6 pb-4 border-b border-cl-border-input-focus",
            title: "font-semibold text-lg text-cl-accent",
            closeTrigger: "shrink-0 p-1 rounded-cl-md hover:bg-cl-accent/10 transition-colors ml-auto",
            body: "px-6 pb-6 pt-4",
          }}
        >
          <p className={c.text}>
            The <code className="px-1.5 py-0.5 bg-cl-bg-hover rounded text-sm font-mono">classes</code> prop
            accepts an object with keys for each slot: root, overlay, container, content, header, title,
            description, icon, closeButton, closeIcon, and body.
          </p>
          <div className="flex justify-end mt-6">
            <Button className={c.btnPrimary} onClick={() => setClassesOpen(false)}>
              Got it
            </Button>
          </div>
        </Modal>
      </Section>

      {/* ─── Reduce Motion ───────────────────────────────────────────────── */}
      <Section
        title="Reduce Motion"
        description="Respect prefers-reduced-motion or force-disable animations."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <div className="flex flex-wrap gap-2">
            <Button className={c.btnPrimary} onClick={() => setReduceMotionOpen(true)}>
              reduceMotion=true
            </Button>
            <Button className={c.btn} onClick={() => setReduceMotionAutoOpen(true)}>
              reduceMotion="auto"
            </Button>
          </div>
        </DemoWrapper>
        <Modal
          open={reduceMotionOpen}
          onOpenChange={setReduceMotionOpen}
          title="Reduce Motion (true)"
          description="This modal has animations completely disabled."
          reduceMotion={true}
          classes={{
            content: c.modalContent,
            header: c.modalHeader,
            title: c.modalTitle,
            description: c.modalDescription,
            closeTrigger: c.modalCloseBtn,
            closeIcon: c.modalCloseIcon,
            body: c.modalBody,
          }}
        >
          <p className="text-cl-text-secondary">
            With <code className="px-1.5 py-0.5 bg-cl-bg-hover rounded text-sm font-mono">reduceMotion=true</code>,
            all open/close animations are suppressed regardless of user preference.
          </p>
        </Modal>
        <Modal
          open={reduceMotionAutoOpen}
          onOpenChange={setReduceMotionAutoOpen}
          title='Reduce Motion ("auto")'
          description="Respects the user's prefers-reduced-motion setting."
          reduceMotion="auto"
          classes={{
            content: c.modalContent,
            header: c.modalHeader,
            title: c.modalTitle,
            description: c.modalDescription,
            closeTrigger: c.modalCloseBtn,
            closeIcon: c.modalCloseIcon,
            body: c.modalBody,
          }}
        >
          <p className="text-cl-text-secondary">
            With <code className="px-1.5 py-0.5 bg-cl-bg-hover rounded text-sm font-mono">reduceMotion="auto"</code>,
            animations are disabled only when the OS/browser <code className="px-1.5 py-0.5 bg-cl-bg-hover rounded text-sm font-mono">prefers-reduced-motion</code> media
            query matches.
          </p>
        </Modal>
      </Section>

      {/* ─── Focus Trap ──────────────────────────────────────────────────── */}
      <Section
        title="Focus Trap"
        description="Tab key cycles through focusable elements within the modal."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <div className="flex flex-wrap gap-2">
            <Button className={c.btnPrimary} onClick={() => setFocusTrapOpen(true)}>
              With Focus Trap (default)
            </Button>
            <Button className={c.btn} onClick={() => setNoFocusTrapOpen(true)}>
              Without Focus Trap
            </Button>
          </div>
        </DemoWrapper>
        <Modal
          open={focusTrapOpen}
          onOpenChange={setFocusTrapOpen}
          title="Focus Trap Enabled"
          description="Tab cycles through focusable elements inside this modal."
          trapFocus={true}
          classes={{
            content: c.modalContent,
            header: c.modalHeader,
            title: c.modalTitle,
            description: c.modalDescription,
            closeTrigger: c.modalCloseBtn,
            closeIcon: c.modalCloseIcon,
            body: c.modalBody,
          }}
        >
          <div className="space-y-3">
            <p className="text-cl-text-secondary">Try pressing Tab - focus stays within the modal.</p>
            <input
              type="text"
              placeholder="First input"
              className="w-full px-3 py-2 border border-cl-border rounded-cl-md outline-none focus:ring-2 focus:ring-cl-accent"
            />
            <input
              type="text"
              placeholder="Second input"
              className="w-full px-3 py-2 border border-cl-border rounded-cl-md outline-none focus:ring-2 focus:ring-cl-accent"
            />
            <div className="flex justify-end gap-3">
              <Button className={c.btn} onClick={() => setFocusTrapOpen(false)}>
                Cancel
              </Button>
              <Button className={c.btnPrimary} onClick={() => setFocusTrapOpen(false)}>
                Confirm
              </Button>
            </div>
          </div>
        </Modal>
        <Modal
          open={noFocusTrapOpen}
          onOpenChange={setNoFocusTrapOpen}
          title="Focus Trap Disabled"
          description="Tab can move focus outside the modal."
          trapFocus={false}
          classes={{
            content: c.modalContent,
            header: c.modalHeader,
            title: c.modalTitle,
            description: c.modalDescription,
            closeTrigger: c.modalCloseBtn,
            closeIcon: c.modalCloseIcon,
            body: c.modalBody,
          }}
        >
          <div className="space-y-3">
            <p className="text-cl-text-secondary">
              With <code className="px-1.5 py-0.5 bg-cl-bg-hover rounded text-sm font-mono">trapFocus=false</code>,
              pressing Tab can move focus to elements behind the modal.
            </p>
            <input
              type="text"
              placeholder="Input field"
              className="w-full px-3 py-2 border border-cl-border rounded-cl-md outline-none focus:ring-2 focus:ring-cl-accent"
            />
            <div className="flex justify-end">
              <Button className={c.btnPrimary} onClick={() => setNoFocusTrapOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      </Section>

      {/* ─── Initial Focus ───────────────────────────────────────────────── */}
      <Section
        title="Initial Focus"
        description="Direct focus to a specific element when the modal opens. Focus lands on Email, the second field, precisely because the first is where it would have gone on its own — a demo that focused Name would look identical with the prop removed."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <Button className={c.btnPrimary} onClick={() => setInitialFocusOpen(true)}>
            Focus Specific Input
          </Button>
        </DemoWrapper>
        <Modal
          open={initialFocusOpen}
          onOpenChange={setInitialFocusOpen}
          title="Initial Focus"
          description="The email input receives focus automatically on open."
          initialFocus={initialFocusRef}
          classes={{
            content: c.modalContent,
            header: c.modalHeader,
            title: c.modalTitle,
            description: c.modalDescription,
            closeTrigger: c.modalCloseBtn,
            closeIcon: c.modalCloseIcon,
            body: c.modalBody,
          }}
        >
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-cl-text mb-1">Name</label>
              <input
                type="text"
                placeholder="Your name"
                className="w-full px-3 py-2 border border-cl-border rounded-cl-md outline-none focus:ring-2 focus:ring-cl-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-cl-text mb-1">Email (auto-focused)</label>
              <input
                ref={initialFocusRef}
                type="email"
                placeholder="you@example.com"
                className="w-full px-3 py-2 border border-cl-border rounded-cl-md outline-none focus:ring-2 focus:ring-cl-accent"
              />
            </div>
            <div className="flex justify-end">
              <Button className={c.btnPrimary} onClick={() => setInitialFocusOpen(false)}>
                Submit
              </Button>
            </div>
          </div>
        </Modal>
      </Section>

      {/* ─── Keep Mounted ────────────────────────────────────────────────── */}
      <Section
        title="Keep Mounted"
        description="Preserve modal DOM when closed for faster re-opens."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <div className="space-y-3">
            <Button className={c.btnPrimary} onClick={() => setKeepMountedOpen(true)}>
              Keep Mounted Modal
            </Button>
            {keepMountedLog.length > 0 && (
              <div className={`text-xs font-mono p-3 rounded-cl-md max-h-32 overflow-auto bg-cl-bg-elevated text-cl-text-secondary`}>
                {keepMountedLog.map((log, i) => (
                  <div key={i}>{log}</div>
                ))}
              </div>
            )}
          </div>
        </DemoWrapper>
        <Modal
          open={keepMountedOpen}
          onOpenChange={setKeepMountedOpen}
          title="Keep Mounted"
          description="This modal stays in the DOM even when closed."
          keepMounted
          classes={{
            content: c.modalContent,
            header: c.modalHeader,
            title: c.modalTitle,
            description: c.modalDescription,
            closeTrigger: c.modalCloseBtn,
            closeIcon: c.modalCloseIcon,
            body: c.modalBody,
          }}
        >
          <KeepMountedLogger onLog={handleKeepMountedLog} />
          <div className="flex justify-end mt-4">
            <Button className={c.btnPrimary} onClick={() => setKeepMountedOpen(false)}>
              Close
            </Button>
          </div>
        </Modal>
      </Section>

      {/* ─── Custom Close Icon ───────────────────────────────────────────── */}
      <Section
        title="Custom Close Icon"
        description="Replace the default close button icon."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <Button className={c.btnPrimary} onClick={() => setCustomCloseIconOpen(true)}>
            Custom Close Icon
          </Button>
        </DemoWrapper>
        <Modal open={customCloseIconOpen}
          onOpenChange={setCustomCloseIconOpen}
          title="Custom Close Icon"
          description="This modal uses a custom close icon."
          closeIcon={
            // A chevron, not another X. The previous icon was a plus rotated
            // 45 degrees, which is an X — a real `closeIcon` passing a node
            // indistinguishable from the default, so the section demonstrated
            // nothing a reader could see.
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          }
          classes={{
            content: c.modalContent,
            header: c.modalHeader,
            title: c.modalTitle,
            description: c.modalDescription,
            closeTrigger: c.modalCloseBtn,
            body: c.modalBody,
          }}
        >
          <p className="text-cl-text-secondary">
            Pass any ReactNode to the <code className="px-1.5 py-0.5 bg-cl-bg-hover rounded text-sm font-mono">closeIcon</code> prop
            to replace the default close icon.
          </p>
        </Modal>
      </Section>

      {/* ─── Disable Animation ───────────────────────────────────────────── */}
      <Section
        title="Disable Animation"
        description="Instantly show and hide the modal without transitions."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <Button className={c.btnPrimary} onClick={() => setDisableAnimOpen(true)}>
            No Animation Modal
          </Button>
        </DemoWrapper>
        <Modal
          open={disableAnimOpen}
          onOpenChange={setDisableAnimOpen}
          title="No Animation"
          description="This modal opens and closes instantly."
          disableAnimation={true}
          classes={{
            content: c.modalContent,
            header: c.modalHeader,
            title: c.modalTitle,
            description: c.modalDescription,
            closeTrigger: c.modalCloseBtn,
            closeIcon: c.modalCloseIcon,
            body: c.modalBody,
          }}
        >
          <p className="text-cl-text-secondary">
            The <code className="px-1.5 py-0.5 bg-cl-bg-hover rounded text-sm font-mono">disableAnimation</code> prop
            completely removes open/close transitions.
          </p>
        </Modal>
      </Section>

      {/* ─── Custom Z-Index ──────────────────────────────────────────────── */}
      <Section
        title="Custom Z-Index"
        description="Override the default z-index for specific stacking contexts."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <Button className={c.btnPrimary} onClick={() => setCustomZIndexOpen(true)}>
            z-index: 99999
          </Button>
        </DemoWrapper>
        <Modal
          open={customZIndexOpen}
          onOpenChange={setCustomZIndexOpen}
          title="Custom Z-Index"
          description="This modal renders with z-index: 99999."
          zIndex={99999}
          classes={{
            content: c.modalContent,
            header: c.modalHeader,
            title: c.modalTitle,
            description: c.modalDescription,
            closeTrigger: c.modalCloseBtn,
            closeIcon: c.modalCloseIcon,
            body: c.modalBody,
          }}
        >
          <p className="text-cl-text-secondary">
            Use the <code className="px-1.5 py-0.5 bg-cl-bg-hover rounded text-sm font-mono">zIndex</code> prop
            to control stacking order when integrating with other overlays.
          </p>
        </Modal>
      </Section>

      {/* ─── useModal Hook ───────────────────────────────────────────────── */}
      <Section
        title="useModal Hook"
        description="Access modal context (close function, nesting level) from child components."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <Button className={c.btnPrimary} onClick={() => setUseModalOpen(true)}>
            useModal Demo
          </Button>
        </DemoWrapper>
        <Modal
          open={useModalOpen}
          onOpenChange={setUseModalOpen}
          title="useModal Hook"
          classes={{
            content: c.modalContent,
            header: c.modalHeader,
            title: c.modalTitle,
            closeTrigger: c.modalCloseBtn,
            closeIcon: c.modalCloseIcon,
            body: c.modalBody,
          }}
        >
          <ModalChildWithHook />
        </Modal>
      </Section>

      {/* ─── Ref Forwarding ──────────────────────────────────────────────── */}
      <Section
        title="Ref Forwarding"
        description="Forward a ref to the modal content element for imperative access."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <div className="flex flex-wrap gap-2">
            <Button className={c.btnPrimary} onClick={() => setRefForwardOpen(true)}>
              Modal with Ref
            </Button>
          </div>
        </DemoWrapper>
        <Modal
          ref={modalRef}
          open={refForwardOpen}
          onOpenChange={setRefForwardOpen}
          title="Ref Forwarding"
          description="A ref is attached to this modal's content element."
          classes={{
            content: c.modalContent,
            header: c.modalHeader,
            title: c.modalTitle,
            description: c.modalDescription,
            closeTrigger: c.modalCloseBtn,
            closeIcon: c.modalCloseIcon,
            body: c.modalBody,
          }}
        >
          <p className="text-cl-text-secondary">
            The parent holds a ref to this modal. Use it for imperative actions
            like <code className="px-1.5 py-0.5 bg-cl-bg-hover rounded text-sm font-mono">ref.current?.focus()</code>.
          </p>
          {/* Inside the modal: it traps focus while open, and closed there is
              nothing for the ref to point at, so a button outside could never
              be used. */}
          <div className="flex justify-end gap-2 mt-4">
            <Button
              className={c.btn}
              onClick={() => {
                modalRef.current?.focus();
                setRefFocusReadout(
                  document.activeElement === modalRef.current
                    ? "the modal content element (ref.current)"
                    : (document.activeElement?.tagName.toLowerCase() ?? "nothing"),
                );
              }}
            >
              Focus Modal via Ref
            </Button>
            <Button className={c.btnPrimary} onClick={() => setRefForwardOpen(false)}>
              Close
            </Button>
          </div>
          <div
            className="mt-3 rounded-cl-md px-3 py-2 text-xs font-mono bg-cl-bg-elevated text-cl-text-tertiary"
            data-demo-action
            role="status"
          >
            focused: {refFocusReadout}
          </div>
        </Modal>
      </Section>

      {/* ─── Modal Instances ─────────────────────────────────────────────── */}



























      {/* ─── Reference — generated from the schema and the .ai.md ──────── */}

      <ComponentDocs name="Modal" />

      <DocControlledPattern
        isDarkMode={dark}
        summary="Use `open` with `onOpenChange` (and title/description props) for controlled visibility. Nesting levels are bounded—design flows that avoid deep modal stacks."
      />
      <DocEdgeCases
        isDarkMode={dark}
        items={[
          "Route changes while open should close or confirm to avoid orphaned focus.",
          "iOS Safari viewport and scroll quirks—test with fixed positioning.",
          "Nested modals must manage focus return and z-index deliberately.",
        ]}
      />
      <DocDoDont
        isDarkMode={dark}
        dos={[
          "Provide `aria-labelledby` / `aria-describedby` for title and description.",
          "Trap focus and restore on close.",
          "Close on Escape when appropriate and documented.",
        ]}
        donts={[
          "Do not exceed `maxNestingLevel` in production flows.",
          "Do not render essential page actions only inside a dismissed modal.",
          "Do not remove visible focus outlines.",
        ]}
      />

      {/* ─── The three things a Modal does besides render ─────────────────── */}
      <Section
        title="Turning off what a Modal does for you"
        description="A Modal dims the page, freezes its scroll and puts focus back where it was when it closes. All three are on by default and each can be turned off — worth knowing, because nothing on screen tells you they are there until they are gone."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <Button className={c.btnPrimary} onClick={() => setBareOpen(true)}>
            Open without overlay, scroll lock or focus restore
          </Button>
          <p className="mt-3 text-sm text-cl-text-secondary">
            Scroll the page behind it — it moves, which it cannot do for the
            modal above. Close it and focus returns to the top of the document
            rather than to this button.
          </p>
        </DemoWrapper>
        <Modal
          open={bareOpen}
          onOpenChange={setBareOpen}
          title="No overlay, no scroll lock, no focus restore"
          showOverlay={false}
          lockScroll={false}
          restoreFocus={false}
        >
          <p>
            The page behind is still scrollable and undimmed. Each of the three is
            a separate prop, so a modal that should dim but not lock, or lock but
            not restore, is one prop away.
          </p>
        </Modal>
      </Section>

    </div>
  );
};

export default ModalDemo;
