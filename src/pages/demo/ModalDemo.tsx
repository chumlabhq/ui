import { useState, useRef, useEffect, useCallback } from "react";
import { Modal, useModal } from "../../components/Modal";
import {
  Section,
  CodeBlock,
  DemoWrapper,
  PropsTable,
  PropRow,
  DocControlledPattern,
  DocEdgeCases,
  DocDoDont,
} from "./components";
import { useTheme } from "./ThemeContext";

// ─── Themed Classes ──────────────────────────────────────────────────────────

const getClasses = (dark: boolean) => ({
  btn: `px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${dark ? "bg-gray-700 text-gray-200 hover:bg-gray-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
  btnPrimary:
    "px-3 py-1.5 text-xs font-medium rounded-lg transition-colors bg-indigo-500 text-white hover:bg-indigo-600",
  btnDanger:
    "px-3 py-1.5 text-xs font-medium rounded-lg transition-colors bg-rose-500 text-white hover:bg-rose-600",
  btnSuccess:
    "px-3 py-1.5 text-xs font-medium rounded-lg transition-colors bg-emerald-500 text-white hover:bg-emerald-600",
  btnWarning:
    "px-3 py-1.5 text-xs font-medium rounded-lg transition-colors bg-amber-500 text-white hover:bg-amber-600",
  btnGradient:
    "px-3 py-1.5 text-xs font-medium rounded-lg transition-colors bg-linear-to-r from-violet-600 to-purple-600 text-white hover:from-violet-700 hover:to-purple-700",
  text: dark ? "text-gray-300" : "text-gray-600",
  card: `rounded-2xl border p-5 ${dark ? "border-white/[0.06] bg-linear-to-br from-white/[0.03] to-white/[0.01]" : "border-gray-200 bg-white shadow-sm shadow-gray-900/[0.04]"}`,
  label: `text-xs font-medium ${dark ? "text-gray-500" : "text-gray-400"}`,
  // Modal-specific
  modalContent: "w-full max-w-lg m-4 rounded-xl shadow-2xl overflow-hidden",
  modalHeader: "flex items-start gap-3 p-6 pb-4",
  modalTitle: "font-semibold text-lg text-gray-900",
  modalDescription: "mt-1 text-sm text-gray-600",
  modalCloseBtn: "shrink-0 p-1 rounded-md hover:bg-gray-100 transition-colors ml-auto",
  modalCloseIcon: "w-5 h-5 text-gray-500",
  modalBody: "px-6 pb-6",
  kbd: `px-2 py-1 rounded-md text-[11px] font-mono min-w-[2.5rem] text-center font-medium ${dark ? "bg-gray-900 border border-white/10 text-gray-300 shadow-sm" : "bg-white border border-gray-200 text-gray-600 shadow-sm"}`,
});

// ─── useModal Child Demo ────────────────────────────────────────────────────

const ModalChildWithHook = () => {
  const { close, nestingLevel } = useModal();
  return (
    <div className="space-y-3">
      <p className="text-gray-600">
        This component uses the <code className="px-1.5 py-0.5 bg-gray-100 rounded text-sm font-mono">useModal()</code> hook.
      </p>
      <div className="p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
        Current nesting level: <span className="font-bold">{nestingLevel}</span>
      </div>
      <button
        onClick={close}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Close via useModal().close()
      </button>
    </div>
  );
};

// ─── Keep Mounted Logger ────────────────────────────────────────────────────

const KeepMountedLogger = ({ onLog }: { onLog: (msg: string) => void }) => {
  useEffect(() => {
    onLog("Mounted");
    return () => onLog("Unmounted");
  }, [onLog]);
  return <p className="text-gray-600">This content logs mount/unmount events.</p>;
};

// ─── Demo ────────────────────────────────────────────────────────────────────

const ModalDemo = () => {
  const { isDarkMode: dark } = useTheme();
  const c = getClasses(dark);

  const [basicOpen, setBasicOpen] = useState(false);
  const [withDescriptionOpen, setWithDescriptionOpen] = useState(false);
  const [withIconOpen, setWithIconOpen] = useState(false);
  const [noHeaderOpen, setNoHeaderOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [imagePreviewOpen, setImagePreviewOpen] = useState(false);
  const [customSizeOpen, setCustomSizeOpen] = useState(false);
  const [fullScreenOpen, setFullScreenOpen] = useState(false);
  const [customOverlayOpen, setCustomOverlayOpen] = useState(false);
  const [preventCloseOpen, setPreventCloseOpen] = useState(false);
  const [nestedLevel1Open, setNestedLevel1Open] = useState(false);
  const [nestedLevel2Open, setNestedLevel2Open] = useState(false);

  // New demo states
  const [classesOpen, setClassesOpen] = useState(false);
  const [unstyledOpen, setUnstyledOpen] = useState(false);
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
            Modal
          </h1>
          <p
            className={`text-sm leading-relaxed max-w-2xl ${dark ? "text-gray-400" : "text-gray-600"}`}
          >
            Accessible dialog overlays for focused interactions and important
            content.
          </p>
          <div className="mt-5">
            <CodeBlock
              isDarkMode={dark}
              code={`import { Modal, useModal } from "@chumlab/ui/modal";`}
            />
          </div>
        </div>
      </header>

      {/* ─── Basic ───────────────────────────────────────────────────────── */}
      <Section
        title="Basic Usage"
        description="Simple modal dialogs with various header configurations."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <div className="flex flex-wrap gap-2">
            <button className={c.btnPrimary} onClick={() => setBasicOpen(true)}>
              Basic Modal
            </button>
            <button className={c.btnPrimary} onClick={() => setWithDescriptionOpen(true)}>
              With Description
            </button>
            <button className={c.btnPrimary} onClick={() => setWithIconOpen(true)}>
              With Icon
            </button>
            <button className={c.btn} onClick={() => setNoHeaderOpen(true)}>
              No Header
            </button>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Use Cases ───────────────────────────────────────────────────── */}
      <Section
        title="Use Cases"
        description="Common modal patterns for confirmations, success states, forms, and previews."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <div className="flex flex-wrap gap-2">
            <button className={c.btnDanger} onClick={() => setConfirmDeleteOpen(true)}>
              Confirm Delete
            </button>
            <button className={c.btnSuccess} onClick={() => setSuccessOpen(true)}>
              Success State
            </button>
            <button className={c.btnPrimary} onClick={() => setFormOpen(true)}>
              Form Modal
            </button>
            <button className={c.btnGradient} onClick={() => setUpgradeOpen(true)}>
              Upgrade Plan
            </button>
            <button className={c.btn} onClick={() => setImagePreviewOpen(true)}>
              Image Preview
            </button>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Size & Position ─────────────────────────────────────────────── */}
      <Section
        title="Size & Position"
        description="Control modal dimensions and screen placement."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <div className="flex flex-wrap gap-2">
            <button className={c.btnPrimary} onClick={() => setCustomSizeOpen(true)}>
              Custom Size
            </button>
            <button className={c.btnPrimary} onClick={() => setFullScreenOpen(true)}>
              Full Screen
            </button>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Overlay & Behavior ──────────────────────────────────────────── */}
      <Section
        title="Overlay & Behavior"
        description="Customize the overlay backdrop and close behavior."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <div className="flex flex-wrap gap-2">
            <button className={c.btn} onClick={() => setCustomOverlayOpen(true)}>
              Custom Overlay
            </button>
            <button className={c.btn} onClick={() => setPreventCloseOpen(true)}>
              Prevent Outside Click
            </button>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Nested Modals ───────────────────────────────────────────────── */}
      <Section
        title="Nested Modals"
        description="Stack multiple modals with proper nesting and z-index management."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <button className={c.btnPrimary} onClick={() => setNestedLevel1Open(true)}>
            Open Nested Modal
          </button>
        </DemoWrapper>
      </Section>

      {/* ─── Classes System ──────────────────────────────────────────────── */}
      <Section
        title="Classes System"
        description="Override individual sub-element styles via the classes prop."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <button className={c.btnPrimary} onClick={() => setClassesOpen(true)}>
            Modal with Classes
          </button>
        </DemoWrapper>
      </Section>

      {/* ─── Unstyled ────────────────────────────────────────────────────── */}
      <Section
        title="Unstyled"
        description="Remove all default styles and build from scratch."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <button className={c.btnPrimary} onClick={() => setUnstyledOpen(true)}>
            Unstyled Modal
          </button>
        </DemoWrapper>
      </Section>

      {/* ─── Reduce Motion ───────────────────────────────────────────────── */}
      <Section
        title="Reduce Motion"
        description="Respect prefers-reduced-motion or force-disable animations."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <div className="flex flex-wrap gap-2">
            <button className={c.btnPrimary} onClick={() => setReduceMotionOpen(true)}>
              reduceMotion=true
            </button>
            <button className={c.btn} onClick={() => setReduceMotionAutoOpen(true)}>
              reduceMotion="auto"
            </button>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Focus Trap ──────────────────────────────────────────────────── */}
      <Section
        title="Focus Trap"
        description="Tab key cycles through focusable elements within the modal."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <div className="flex flex-wrap gap-2">
            <button className={c.btnPrimary} onClick={() => setFocusTrapOpen(true)}>
              With Focus Trap (default)
            </button>
            <button className={c.btn} onClick={() => setNoFocusTrapOpen(true)}>
              Without Focus Trap
            </button>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Initial Focus ───────────────────────────────────────────────── */}
      <Section
        title="Initial Focus"
        description="Direct focus to a specific element when the modal opens."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <button className={c.btnPrimary} onClick={() => setInitialFocusOpen(true)}>
            Focus Specific Input
          </button>
        </DemoWrapper>
      </Section>

      {/* ─── Keep Mounted ────────────────────────────────────────────────── */}
      <Section
        title="Keep Mounted"
        description="Preserve modal DOM when closed for faster re-opens."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <div className="space-y-3">
            <button className={c.btnPrimary} onClick={() => setKeepMountedOpen(true)}>
              Keep Mounted Modal
            </button>
            {keepMountedLog.length > 0 && (
              <div className={`text-xs font-mono p-3 rounded-lg max-h-32 overflow-auto ${dark ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-700"}`}>
                {keepMountedLog.map((log, i) => (
                  <div key={i}>{log}</div>
                ))}
              </div>
            )}
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Custom Close Icon ───────────────────────────────────────────── */}
      <Section
        title="Custom Close Icon"
        description="Replace the default close button icon."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <button className={c.btnPrimary} onClick={() => setCustomCloseIconOpen(true)}>
            Custom Close Icon
          </button>
        </DemoWrapper>
      </Section>

      {/* ─── Disable Animation ───────────────────────────────────────────── */}
      <Section
        title="Disable Animation"
        description="Instantly show and hide the modal without transitions."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <button className={c.btnPrimary} onClick={() => setDisableAnimOpen(true)}>
            No Animation Modal
          </button>
        </DemoWrapper>
      </Section>

      {/* ─── Custom Z-Index ──────────────────────────────────────────────── */}
      <Section
        title="Custom Z-Index"
        description="Override the default z-index for specific stacking contexts."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <button className={c.btnPrimary} onClick={() => setCustomZIndexOpen(true)}>
            z-index: 99999
          </button>
        </DemoWrapper>
      </Section>

      {/* ─── useModal Hook ───────────────────────────────────────────────── */}
      <Section
        title="useModal Hook"
        description="Access modal context (close function, nesting level) from child components."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <button className={c.btnPrimary} onClick={() => setUseModalOpen(true)}>
            useModal Demo
          </button>
        </DemoWrapper>
      </Section>

      {/* ─── Ref Forwarding ──────────────────────────────────────────────── */}
      <Section
        title="Ref Forwarding"
        description="Forward a ref to the modal content element for imperative access."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <div className="flex flex-wrap gap-2">
            <button className={c.btnPrimary} onClick={() => setRefForwardOpen(true)}>
              Modal with Ref
            </button>
            <button className={c.btn} onClick={() => modalRef.current?.focus()}>
              Focus Modal via Ref
            </button>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Data Attributes ─────────────────────────────────────────────── */}
      <Section
        title="Data Attributes"
        description="Data attributes emitted for CSS targeting and testing."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <div className="space-y-3">
            <p className={`text-sm ${c.text}`}>
              The Modal emits the following <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${dark ? "bg-gray-800" : "bg-gray-100"}`}>data-*</code> attributes for styling and testing:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { attr: "data-modal-root", desc: "Root portal wrapper" },
                { attr: "data-modal-overlay", desc: "Backdrop overlay" },
                { attr: "data-modal-container", desc: "Centering container" },
                { attr: "data-modal-content", desc: "Content wrapper (role=dialog)" },
                { attr: "data-modal-header", desc: "Header section" },
                { attr: "data-modal-body", desc: "Body section" },
                { attr: "data-modal-footer", desc: "Footer section" },
                { attr: "data-open", desc: "Present when modal is open" },
                { attr: "data-nesting-level", desc: "Current nesting depth (number)" },
                { attr: "data-reduce-motion", desc: "Present when motion is reduced" },
              ].map(({ attr, desc }) => (
                <div
                  key={attr}
                  className={`flex items-start gap-3 p-2.5 rounded-lg text-sm ${dark ? "bg-gray-800/50" : "bg-gray-50"}`}
                >
                  <code className={`shrink-0 px-1.5 py-0.5 rounded text-xs font-mono ${dark ? "bg-gray-700 text-blue-400" : "bg-blue-50 text-blue-700"}`}>
                    {attr}
                  </code>
                  <span className={c.text}>{desc}</span>
                </div>
              ))}
            </div>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Modal Instances ─────────────────────────────────────────────── */}

      <Modal
        open={classesOpen}
        onOpenChange={setClassesOpen}
        title="Classes System Demo"
        description="Each slot is styled via the classes prop."
        classes={{
          root: "custom-root",
          overlay: "backdrop-blur-sm",
          content: `w-full max-w-lg m-4 rounded-xl shadow-2xl overflow-hidden ${dark ? "bg-gray-900" : "bg-white"}`,
          header: "flex items-start gap-3 p-6 pb-4 border-b border-blue-200",
          title: "font-semibold text-lg text-blue-700",
          closeButton: "shrink-0 p-1 rounded-md hover:bg-blue-100 transition-colors ml-auto",
          body: "px-6 pb-6 pt-4",
        }}
      >
        <p className={c.text}>
          The <code className="px-1.5 py-0.5 bg-gray-100 rounded text-sm font-mono">classes</code> prop
          accepts an object with keys for each slot: root, overlay, container, content, header, title,
          description, icon, closeButton, closeIcon, and body.
        </p>
        <div className="flex justify-end mt-6">
          <button className={c.btnPrimary} onClick={() => setClassesOpen(false)}>
            Got it
          </button>
        </div>
      </Modal>

      <Modal
        open={unstyledOpen}
        onOpenChange={setUnstyledOpen}
        title="Unstyled Modal"
        unstyled
        classes={{
          overlay: "fixed inset-0 bg-black/50",
          container: "fixed inset-0 flex items-center justify-center",
          content: "w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden",
          header: "flex items-center justify-between p-5 border-b border-gray-200",
          title: "text-lg font-bold text-gray-900",
          closeButton: "p-1.5 rounded-lg hover:bg-gray-100 transition-colors",
          body: "p-5",
        }}
      >
        <p className="text-gray-600">
          With <code className="px-1.5 py-0.5 bg-gray-100 rounded text-sm font-mono">unstyled</code> all
          default styles are stripped. You must provide all styling via
          the <code className="px-1.5 py-0.5 bg-gray-100 rounded text-sm font-mono">classes</code> prop.
        </p>
        <div className="flex justify-end mt-5">
          <button className={c.btnPrimary} onClick={() => setUnstyledOpen(false)}>
            Close
          </button>
        </div>
      </Modal>

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
          closeButton: c.modalCloseBtn,
          closeIcon: c.modalCloseIcon,
          body: c.modalBody,
        }}
      >
        <p className="text-gray-600">
          With <code className="px-1.5 py-0.5 bg-gray-100 rounded text-sm font-mono">reduceMotion=true</code>,
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
          closeButton: c.modalCloseBtn,
          closeIcon: c.modalCloseIcon,
          body: c.modalBody,
        }}
      >
        <p className="text-gray-600">
          With <code className="px-1.5 py-0.5 bg-gray-100 rounded text-sm font-mono">reduceMotion="auto"</code>,
          animations are disabled only when the OS/browser <code className="px-1.5 py-0.5 bg-gray-100 rounded text-sm font-mono">prefers-reduced-motion</code> media
          query matches.
        </p>
      </Modal>

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
          closeButton: c.modalCloseBtn,
          closeIcon: c.modalCloseIcon,
          body: c.modalBody,
        }}
      >
        <div className="space-y-3">
          <p className="text-gray-600">Try pressing Tab - focus stays within the modal.</p>
          <input
            type="text"
            placeholder="First input"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Second input"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex justify-end gap-3">
            <button className={c.btn} onClick={() => setFocusTrapOpen(false)}>
              Cancel
            </button>
            <button className={c.btnPrimary} onClick={() => setFocusTrapOpen(false)}>
              Confirm
            </button>
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
          closeButton: c.modalCloseBtn,
          closeIcon: c.modalCloseIcon,
          body: c.modalBody,
        }}
      >
        <div className="space-y-3">
          <p className="text-gray-600">
            With <code className="px-1.5 py-0.5 bg-gray-100 rounded text-sm font-mono">trapFocus=false</code>,
            pressing Tab can move focus to elements behind the modal.
          </p>
          <input
            type="text"
            placeholder="Input field"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex justify-end">
            <button className={c.btnPrimary} onClick={() => setNoFocusTrapOpen(false)}>
              Close
            </button>
          </div>
        </div>
      </Modal>

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
          closeButton: c.modalCloseBtn,
          closeIcon: c.modalCloseIcon,
          body: c.modalBody,
        }}
      >
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              placeholder="Your name"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email (auto-focused)</label>
            <input
              ref={initialFocusRef}
              type="email"
              placeholder="you@example.com"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-end">
            <button className={c.btnPrimary} onClick={() => setInitialFocusOpen(false)}>
              Submit
            </button>
          </div>
        </div>
      </Modal>

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
          closeButton: c.modalCloseBtn,
          closeIcon: c.modalCloseIcon,
          body: c.modalBody,
        }}
      >
        <KeepMountedLogger onLog={handleKeepMountedLog} />
        <div className="flex justify-end mt-4">
          <button className={c.btnPrimary} onClick={() => setKeepMountedOpen(false)}>
            Close
          </button>
        </div>
      </Modal>

      <Modal
        open={customCloseIconOpen}
        onOpenChange={setCustomCloseIconOpen}
        title="Custom Close Icon"
        description="This modal uses a custom close icon."
        closeIcon={
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
              d="M12 4v16m8-8H4"
              transform="rotate(45 12 12)"
            />
          </svg>
        }
        classes={{
          content: c.modalContent,
          header: c.modalHeader,
          title: c.modalTitle,
          description: c.modalDescription,
          closeButton: c.modalCloseBtn,
          body: c.modalBody,
        }}
      >
        <p className="text-gray-600">
          Pass any ReactNode to the <code className="px-1.5 py-0.5 bg-gray-100 rounded text-sm font-mono">closeIcon</code> prop
          to replace the default close icon.
        </p>
      </Modal>

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
          closeButton: c.modalCloseBtn,
          closeIcon: c.modalCloseIcon,
          body: c.modalBody,
        }}
      >
        <p className="text-gray-600">
          The <code className="px-1.5 py-0.5 bg-gray-100 rounded text-sm font-mono">disableAnimation</code> prop
          completely removes open/close transitions.
        </p>
      </Modal>

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
          closeButton: c.modalCloseBtn,
          closeIcon: c.modalCloseIcon,
          body: c.modalBody,
        }}
      >
        <p className="text-gray-600">
          Use the <code className="px-1.5 py-0.5 bg-gray-100 rounded text-sm font-mono">zIndex</code> prop
          to control stacking order when integrating with other overlays.
        </p>
      </Modal>

      <Modal
        open={useModalOpen}
        onOpenChange={setUseModalOpen}
        title="useModal Hook"
        classes={{
          content: c.modalContent,
          header: c.modalHeader,
          title: c.modalTitle,
          closeButton: c.modalCloseBtn,
          closeIcon: c.modalCloseIcon,
          body: c.modalBody,
        }}
      >
        <ModalChildWithHook />
      </Modal>

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
          closeButton: c.modalCloseBtn,
          closeIcon: c.modalCloseIcon,
          body: c.modalBody,
        }}
      >
        <p className="text-gray-600">
          The parent holds a ref to this modal. Use it for imperative actions
          like <code className="px-1.5 py-0.5 bg-gray-100 rounded text-sm font-mono">ref.current?.focus()</code>.
        </p>
        <div className="flex justify-end mt-4">
          <button className={c.btnPrimary} onClick={() => setRefForwardOpen(false)}>
            Close
          </button>
        </div>
      </Modal>

      <Modal
        open={basicOpen}
        onOpenChange={setBasicOpen}
        title="Welcome Back"
        classes={{
          content: c.modalContent,
          header: c.modalHeader,
          title: c.modalTitle,
          closeButton: c.modalCloseBtn,
          closeIcon: c.modalCloseIcon,
          body: c.modalBody,
        }}
      >
        <p className="text-gray-600">
          This is a basic modal with just a title. Modal content goes here.
        </p>
        <div className="flex justify-end gap-3 mt-6">
          <button className={c.btn} onClick={() => setBasicOpen(false)}>
            Cancel
          </button>
          <button className={c.btnPrimary} onClick={() => setBasicOpen(false)}>
            Continue
          </button>
        </div>
      </Modal>

      <Modal
        open={withDescriptionOpen}
        onOpenChange={setWithDescriptionOpen}
        title="Project Settings"
        description="Configure your project preferences and team access permissions."
        classes={{
          content: c.modalContent,
          header: c.modalHeader,
          title: c.modalTitle,
          description: c.modalDescription,
          closeButton: c.modalCloseBtn,
          closeIcon: c.modalCloseIcon,
          body: c.modalBody,
        }}
      >
        <p className="text-gray-600">
          Both title and description support ReactNode, allowing custom HTML or
          JSX.
        </p>
        <div className="flex justify-end gap-3 mt-6">
          <button
            className={c.btnPrimary}
            onClick={() => setWithDescriptionOpen(false)}
          >
            Got it
          </button>
        </div>
      </Modal>

      <Modal
        open={withIconOpen}
        onOpenChange={setWithIconOpen}
        title="New Feature Available"
        description="We've added some exciting new features to improve your workflow."
        showIcon
        icon={
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
            <svg
              className="h-5 w-5 text-blue-600"
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
        }
        classes={{
          content: c.modalContent,
          header: c.modalHeader,
          title: c.modalTitle,
          description: c.modalDescription,
          icon: "shrink-0",
          closeButton: c.modalCloseBtn,
          closeIcon: c.modalCloseIcon,
          body: c.modalBody,
        }}
      >
        <ul className="space-y-2 text-gray-600">
          <li className="flex items-center gap-2">
            <svg
              className="h-4 w-4 text-emerald-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Faster performance
          </li>
          <li className="flex items-center gap-2">
            <svg
              className="h-4 w-4 text-emerald-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            New dashboard widgets
          </li>
          <li className="flex items-center gap-2">
            <svg
              className="h-4 w-4 text-emerald-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Improved accessibility
          </li>
        </ul>
        <div className="flex justify-end gap-3 mt-6">
          <button
            className={c.btnPrimary}
            onClick={() => setWithIconOpen(false)}
          >
            Explore Features
          </button>
        </div>
      </Modal>

      <Modal
        open={noHeaderOpen}
        onOpenChange={setNoHeaderOpen}
        showHeader={false}
        classes={{
          content: c.modalContent,
          body: "p-6",
        }}
      >
        <div className="text-center py-4">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <svg
              className="h-8 w-8 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Start a Conversation
          </h3>
          <p className="text-gray-500 mb-6">
            No header modal - perfect for custom layouts and centered content.
          </p>
          <button
            className={c.btnPrimary}
            onClick={() => setNoHeaderOpen(false)}
          >
            Get Started
          </button>
        </div>
      </Modal>

      <Modal
        open={confirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        showHeader={false}
        preventOutsideClick
        closeOnEscape={false}
        maxWidth={400}
        classes={{
          content: "w-full max-w-[400px] m-4 rounded-xl shadow-2xl overflow-hidden",
          body: "p-6",
        }}
      >
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-7 w-7 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Delete Project?
          </h3>
          <p className="text-gray-500 mb-6">
            This will permanently delete{" "}
            <span className="font-medium text-gray-700">
              "Marketing Website"
            </span>{" "}
            and all associated files. This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              className={`flex-1 ${c.btn}`}
              onClick={() => setConfirmDeleteOpen(false)}
            >
              Cancel
            </button>
            <button
              className={`flex-1 ${c.btnDanger}`}
              onClick={() => setConfirmDeleteOpen(false)}
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        open={successOpen}
        onOpenChange={setSuccessOpen}
        showHeader={false}
        maxWidth={400}
        classes={{
          content: "w-full max-w-[400px] m-4 rounded-xl shadow-2xl overflow-hidden",
          body: "p-6",
        }}
      >
        <div className="text-center py-4">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-200">
            <svg
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Payment Successful!
          </h3>
          <p className="text-gray-500 mb-2">Your order has been confirmed.</p>
          <p className="text-sm text-gray-400 mb-6">
            Order #ORD-2024-8847 • $149.00
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500 mb-1">Confirmation sent to</p>
            <p className="font-medium text-gray-900">john.doe@example.com</p>
          </div>
          <button
            className={`w-full ${c.btnSuccess}`}
            onClick={() => setSuccessOpen(false)}
          >
            Continue Shopping
          </button>
        </div>
      </Modal>

      <Modal
        open={formOpen}
        onOpenChange={setFormOpen}
        title="Create New Project"
        description="Fill in the details below to get started."
        maxWidth={480}
        classes={{
          content: "w-full max-w-[480px] m-4 rounded-xl shadow-2xl overflow-hidden",
          header: c.modalHeader,
          title: c.modalTitle,
          description: c.modalDescription,
          closeButton: c.modalCloseBtn,
          closeIcon: c.modalCloseIcon,
          body: c.modalBody,
        }}
      >
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setFormOpen(false);
          }}
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Project Name
            </label>
            <input
              type="text"
              placeholder="e.g., Marketing Campaign"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Describe your project..."
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Category
              </label>
              <select className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white">
                <option>Design</option>
                <option>Development</option>
                <option>Marketing</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Priority
              </label>
              <select className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white">
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
            <button
              type="button"
              className={c.btn}
              onClick={() => setFormOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className={c.btnPrimary}>
              Create Project
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        open={upgradeOpen}
        onOpenChange={setUpgradeOpen}
        showHeader={false}
        maxWidth={440}
        classes={{
          content: "w-full max-w-[440px] m-4 rounded-xl shadow-2xl overflow-hidden",
          body: "p-0",
        }}
      >
        <div className="bg-linear-to-br from-violet-600 via-purple-600 to-indigo-700 p-8 text-center text-white">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
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
          <p className="text-violet-200">
            Unlock all features and boost your productivity.
          </p>
        </div>
        <div className="p-6">
          <ul className="space-y-3 mb-6">
            {[
              "Unlimited projects",
              "Advanced analytics",
              "Priority support",
              "API access",
            ].map((feature, i) => (
              <li key={i} className="flex items-center gap-3">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-100">
                  <svg
                    className="h-3 w-3 text-violet-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>
          <div className="flex items-baseline gap-1 justify-center mb-6">
            <span className="text-3xl font-bold text-gray-900">$29</span>
            <span className="text-gray-500">/month</span>
          </div>
          <button
            onClick={() => setUpgradeOpen(false)}
            className="w-full py-3 bg-linear-to-r from-violet-600 to-purple-600 text-white rounded-lg hover:from-violet-700 hover:to-purple-700 transition-all font-semibold"
          >
            Upgrade Now
          </button>
          <button
            onClick={() => setUpgradeOpen(false)}
            className="w-full mt-3 text-sm text-gray-500 hover:text-gray-700"
          >
            Maybe later
          </button>
        </div>
      </Modal>

      <Modal
        open={imagePreviewOpen}
        onOpenChange={setImagePreviewOpen}
        showHeader={false}
        maxWidth={700}
        overlayOpacity={0.85}
        classes={{
          content: "w-full max-w-[700px] m-4 rounded-xl shadow-2xl overflow-hidden bg-gray-900",
          body: "p-0",
        }}
      >
        <div className="relative">
          <button
            onClick={() => setImagePreviewOpen(false)}
            className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
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
          <div className="aspect-video bg-linear-to-br from-amber-400 via-orange-500 to-red-500 flex items-center justify-center">
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
          <div className="bg-gray-900 p-4 flex items-center justify-between">
            <div className="text-white">
              <p className="font-medium">Sunset at Malibu Beach</p>
              <p className="text-sm text-gray-400">4032 × 3024 • 3.2 MB</p>
            </div>
            <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
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
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        open={customSizeOpen}
        onOpenChange={setCustomSizeOpen}
        title="Custom Size Modal"
        description="This modal has custom width and height constraints."
        maxWidth={700}
        maxHeight={400}
        minWidth={500}
        classes={{
          content: "w-full m-4 rounded-xl shadow-2xl overflow-hidden",
          header: c.modalHeader,
          title: c.modalTitle,
          description: c.modalDescription,
          closeButton: c.modalCloseBtn,
          closeIcon: c.modalCloseIcon,
          body: c.modalBody,
        }}
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Use maxWidth, maxHeight, minWidth, and minHeight props to control
            modal dimensions.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-500">maxWidth:</span>{" "}
              <span className="font-mono">700px</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-500">maxHeight:</span>{" "}
              <span className="font-mono">400px</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-500">minWidth:</span>{" "}
              <span className="font-mono">500px</span>
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
          content: "bg-gray-50",
          body: "p-0 h-full",
        }}
      >
        <div className="h-full flex flex-col">
          <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setFullScreenOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg
                  className="w-5 h-5 text-gray-600"
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
              <div>
                <h1 className="font-semibold text-gray-900">
                  Document Preview
                </h1>
                <p className="text-sm text-gray-500">Annual Report 2024.pdf</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2">
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
                Download
              </button>
              <button className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2">
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
                Print
              </button>
              <button className="px-3 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2">
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
                Share
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-auto p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-12">
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <svg
                    className="w-8 h-8 text-blue-600"
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
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Annual Report 2024
                </h2>
                <p className="text-gray-500">
                  Acme Corporation • Q4 Financial Summary
                </p>
              </div>

              <div className="space-y-8">
                <section>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Executive Summary
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Key Metrics
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                      <p className="text-sm text-emerald-600 font-medium">
                        Revenue
                      </p>
                      <p className="text-2xl font-bold text-emerald-700">
                        $12.4M
                      </p>
                      <p className="text-sm text-emerald-600">+24% YoY</p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <p className="text-sm text-blue-600 font-medium">Users</p>
                      <p className="text-2xl font-bold text-blue-700">847K</p>
                      <p className="text-sm text-blue-600">+18% YoY</p>
                    </div>
                    <div className="p-4 bg-violet-50 rounded-lg border border-violet-100">
                      <p className="text-sm text-violet-600 font-medium">
                        NPS Score
                      </p>
                      <p className="text-2xl font-bold text-violet-700">72</p>
                      <p className="text-sm text-violet-600">+8 points</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Looking Ahead
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia
                    deserunt mollit anim id est laborum.
                  </p>
                </section>
              </div>
            </div>
          </div>

          <footer className="bg-white border-t border-gray-200 px-6 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
              <button
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                disabled
              >
                <svg
                  className="w-5 h-5 text-gray-400"
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
              </button>
              <span className="text-sm text-gray-600">Page 1 of 12</span>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <svg
                  className="w-5 h-5 text-gray-600"
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
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <svg
                  className="w-5 h-5 text-gray-600"
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
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <svg
                  className="w-5 h-5 text-gray-600"
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
              </button>
              <span className="text-sm text-gray-500 ml-2">100%</span>
            </div>
          </footer>
        </div>
      </Modal>

      <Modal
        open={customOverlayOpen}
        onOpenChange={setCustomOverlayOpen}
        title="Custom Overlay"
        description="This modal has a purple overlay with higher opacity."
        overlayColor="#4c1d95"
        overlayOpacity={0.7}
        classes={{
          content: c.modalContent,
          header: c.modalHeader,
          title: c.modalTitle,
          description: c.modalDescription,
          closeButton: c.modalCloseBtn,
          closeIcon: c.modalCloseIcon,
          body: c.modalBody,
        }}
      >
        <p className="text-gray-600">
          Customize the overlay with overlayColor and overlayOpacity props.
        </p>
      </Modal>

      <Modal
        open={preventCloseOpen}
        onOpenChange={setPreventCloseOpen}
        title="Important Action Required"
        description="You must complete this action before continuing."
        preventOutsideClick
        closeOnEscape={false}
        showCloseButton={false}
        showIcon
        icon={
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
            <svg
              className="h-5 w-5 text-amber-600"
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
        <p className="text-gray-600">
          This modal cannot be dismissed by clicking outside or pressing Escape.
          Use the buttons below.
        </p>
        <div className="flex justify-end gap-3 mt-6">
          <button
            className={c.btn}
            onClick={() => setPreventCloseOpen(false)}
          >
            Cancel
          </button>
          <button
            className={c.btnWarning}
            onClick={() => setPreventCloseOpen(false)}
          >
            I Understand
          </button>
        </div>
      </Modal>

      <Modal
        open={nestedLevel1Open}
        onOpenChange={setNestedLevel1Open}
        title="Project Settings"
        description="Configure your project preferences."
        maxWidth={520}
        classes={{
          content: "w-full max-w-[520px] m-4 rounded-xl shadow-2xl overflow-hidden",
          header: c.modalHeader,
          title: c.modalTitle,
          description: c.modalDescription,
          closeButton: c.modalCloseBtn,
          closeIcon: c.modalCloseIcon,
          body: c.modalBody,
        }}
      >
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-blue-900">Team Members</p>
                <p className="text-sm text-blue-600">5 members with access</p>
              </div>
              <button
                className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                onClick={() => setNestedLevel2Open(true)}
              >
                Manage
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Notifications</p>
              <p className="text-sm text-gray-500">
                Email & push notifications
              </p>
            </div>
            <button
              type="button"
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors"
            >
              <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6 transition-transform" />
            </button>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
          <button
            className={c.btn}
            onClick={() => setNestedLevel1Open(false)}
          >
            Cancel
          </button>
          <button
            className={c.btnPrimary}
            onClick={() => setNestedLevel1Open(false)}
          >
            Save Changes
          </button>
        </div>

        <Modal
          open={nestedLevel2Open}
          onOpenChange={setNestedLevel2Open}
          title="Team Members"
          description="Manage project access."
          maxWidth={450}
          classes={{
            content: "w-full max-w-[450px] m-4 rounded-xl shadow-2xl overflow-hidden",
            header: c.modalHeader,
            title: c.modalTitle,
            description: c.modalDescription,
            closeButton: c.modalCloseBtn,
            closeIcon: c.modalCloseIcon,
            body: c.modalBody,
          }}
        >
          <div className="space-y-3">
            {[
              { name: "Sarah Chen", role: "Owner", initials: "SC" },
              { name: "Mike Johnson", role: "Editor", initials: "MJ" },
              { name: "Emily Davis", role: "Viewer", initials: "ED" },
            ].map((member, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-blue-400 to-blue-600 text-white text-sm font-medium">
                    {member.initials}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{member.name}</p>
                    <p className="text-sm text-gray-500">{member.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-200 rounded-lg text-gray-500 hover:border-blue-300 hover:text-blue-600 transition-colors">
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
          </button>
          <div className="flex justify-end mt-6 pt-4 border-t border-gray-100">
            <button
              className={c.btnPrimary}
              onClick={() => setNestedLevel2Open(false)}
            >
              Done
            </button>
          </div>
        </Modal>
      </Modal>

      {/* ─── Props Tables ────────────────────────────────────────────────── */}

      <Section title="Modal Props" isDarkMode={dark}>
        <PropsTable isDarkMode={dark}>
          <PropRow isDarkMode={dark} name="open" type="boolean" description="Controls modal visibility" />
          <PropRow isDarkMode={dark} name="onOpenChange" type="(open: boolean) => void" description="Callback when open state changes" />
          <PropRow isDarkMode={dark} name="children" type="ReactNode" description="Modal body content" />
          <PropRow isDarkMode={dark} name="title" type="ReactNode" description="Modal title (supports HTML)" />
          <PropRow isDarkMode={dark} name="description" type="ReactNode" description="Modal description" />
          <PropRow isDarkMode={dark} name="icon" type="ReactNode" description="Icon to display in header" />
          <PropRow isDarkMode={dark} name="showIcon" type="boolean" defaultVal="false" description="Show icon in header" />
          <PropRow isDarkMode={dark} name="showCloseButton" type="boolean" defaultVal="true" description="Show close button" />
          <PropRow isDarkMode={dark} name="closeIcon" type="ReactNode" description="Custom close icon" />
          <PropRow isDarkMode={dark} name="showHeader" type="boolean" defaultVal="true" description="Show header section" />
          <PropRow isDarkMode={dark} name="showOverlay" type="boolean" defaultVal="true" description="Show overlay backdrop" />
          <PropRow isDarkMode={dark} name="preventOutsideClick" type="boolean" defaultVal="false" description="Prevent closing on outside click" />
          <PropRow isDarkMode={dark} name="closeOnEscape" type="boolean" defaultVal="true" description="Close on Escape key" />
          <PropRow isDarkMode={dark} name="lockScroll" type="boolean" defaultVal="true" description="Lock body scroll when open" />
          <PropRow isDarkMode={dark} name="maxWidth" type="string | number" description="Maximum width" />
          <PropRow isDarkMode={dark} name="maxHeight" type="string | number" description="Maximum height" />
          <PropRow isDarkMode={dark} name="minWidth" type="string | number" description="Minimum width" />
          <PropRow isDarkMode={dark} name="minHeight" type="string | number" description="Minimum height" />
          <PropRow isDarkMode={dark} name="fullScreen" type="boolean" defaultVal="false" description="Full screen mode" />
          <PropRow isDarkMode={dark} name="centered" type="boolean" defaultVal="true" description="Center modal vertically" />
          <PropRow isDarkMode={dark} name="overlayColor" type="string" defaultVal='"black"' description="Overlay background color" />
          <PropRow isDarkMode={dark} name="overlayOpacity" type="number" defaultVal="0.5" description="Overlay opacity (0-1)" />
          <PropRow isDarkMode={dark} name="animationDuration" type="number" defaultVal="200" description="Animation duration in ms" />
          <PropRow isDarkMode={dark} name="disableAnimation" type="boolean" defaultVal="false" description="Disable open/close animations" />
          <PropRow isDarkMode={dark} name="nestingLevel" type="number" description="External nesting level override" />
          <PropRow isDarkMode={dark} name="maxNestingLevel" type="number" defaultVal="5" description="Maximum nested modal depth" />
          <PropRow isDarkMode={dark} name="zIndex" type="number" description="Custom z-index value" />
          <PropRow isDarkMode={dark} name="classes" type="ModalClasses" description="Object with class overrides for each slot: root, overlay, container, content, header, title, description, icon, closeButton, closeIcon, body" />
          <PropRow isDarkMode={dark} name="unstyled" type="boolean" defaultVal="false" description="Strips all default styles; use with classes prop for full control" />
          <PropRow isDarkMode={dark} name="reduceMotion" type='boolean | "auto"' description='Disable animations (true) or respect prefers-reduced-motion ("auto")' />
          <PropRow isDarkMode={dark} name="trapFocus" type="boolean" defaultVal="true" description="Trap focus within the modal when open" />
          <PropRow isDarkMode={dark} name="restoreFocus" type="boolean" defaultVal="true" description="Restore focus to the trigger element on close" />
          <PropRow isDarkMode={dark} name="initialFocus" type="RefObject<HTMLElement | null>" description="Element to receive focus when the modal opens" />
          <PropRow isDarkMode={dark} name="keepMounted" type="boolean" defaultVal="false" description="Keep modal DOM mounted when closed (hidden via display:none)" />
          <PropRow isDarkMode={dark} name="aria-label" type="string" description="Accessible label for modal" />
          <PropRow isDarkMode={dark} name="aria-labelledby" type="string" description="ID of labelling element" />
          <PropRow isDarkMode={dark} name="aria-describedby" type="string" description="ID of describing element" />
        </PropsTable>
      </Section>

      <Section title="Styling Props" isDarkMode={dark}>
        <PropsTable isDarkMode={dark}>
          <PropRow isDarkMode={dark} name="className" type="string" description="Additional class for modal content" />
          <PropRow isDarkMode={dark} name="contentStyle" type="CSSProperties" description="Inline styles for content wrapper" />
          <PropRow isDarkMode={dark} name="classes" type="ModalClasses" description="CSS class overrides for modal sub-elements (root, overlay, container, content, header, title, description, icon, closeButton, closeIcon, body)" />
        </PropsTable>
      </Section>

      <Section title="Sub Components" isDarkMode={dark}>
        <p className={`text-sm mb-4 ${c.text}`}>
          Optional sub-components for more granular control over modal structure.
          These can be used instead of or in addition to the built-in header/body structure.
        </p>
        <PropsTable isDarkMode={dark}>
          <PropRow
            isDarkMode={dark}
            name="ModalHeader"
            type="ReactNode + className?"
            description="Custom header wrapper with data-modal-header attribute"
          />
          <PropRow
            isDarkMode={dark}
            name="ModalBody"
            type="ReactNode + className?"
            description="Custom body wrapper with data-modal-body attribute"
          />
          <PropRow
            isDarkMode={dark}
            name="ModalFooter"
            type="ReactNode + className?"
            description="Custom footer wrapper with data-modal-footer attribute"
          />
        </PropsTable>
      </Section>

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

      {/* ─── Data Attributes ──────────────────────────────────────────── */}
      <Section title="Data Attributes" description="Use for CSS-based state styling." isDarkMode={dark}>
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow name="data-modal-root" type="root" description="Marks the modal root wrapper" isDarkMode={dark} />
            <PropRow name="data-open" type="root" description="'true' when the modal is open" isDarkMode={dark} />
            <PropRow name="data-nesting-level" type="root" description="Current nesting depth (0-based)" isDarkMode={dark} />
            <PropRow name="data-reduce-motion" type="root" description="'true' when reduced motion is enabled" isDarkMode={dark} />
            <PropRow name="data-modal-overlay" type="overlay" description="Marks the overlay/backdrop element" isDarkMode={dark} />
            <PropRow name="data-modal-container" type="container" description="Marks the modal container" isDarkMode={dark} />
            <PropRow name="data-modal-content" type="content" description="Marks the modal content wrapper" isDarkMode={dark} />
            <PropRow name="data-modal-header" type="header" description="Marks the modal header area" isDarkMode={dark} />
            <PropRow name="data-modal-body" type="body" description="Marks the modal body area" isDarkMode={dark} />
            <PropRow name="data-modal-footer" type="footer" description="Marks the modal footer area" isDarkMode={dark} />
          </PropsTable>
        </div>
      </Section>

      {/* ─── Accessibility ────────────────────────────────────────────── */}
      <Section title="Accessibility" description="Built-in accessibility features." isDarkMode={dark}>
        <div className={c.card}>
          <div className={`space-y-2 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>
            {[
              "role=\"dialog\" applied to the modal content",
              "aria-modal=\"true\" to indicate a modal dialog",
              "Focus trap keeps keyboard navigation within the modal",
              "Focus restoration returns focus to the trigger on close",
              "Supports aria-label, aria-labelledby, and aria-describedby",
              "Nesting support with proper focus stack management",
              "closeOnEscape allows dismissal via the Escape key",
              "preventOutsideClick option to require explicit close action",
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
              ["Escape", "Close the modal"],
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

export default ModalDemo;
