import { useState, useRef } from "react";
import { ToastProvider, useToast } from "../../components/Toast";
import type { ToastPosition } from "../../components/Toast/utils/types";
import { useTheme } from "./ThemeContext";
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

// ─── Themed Classes ──────────────────────────────────────────────────────────

const getClasses = (dark: boolean) => ({
  card: `rounded-2xl border p-5 ${dark ? "border-white/[0.06] bg-linear-to-br from-white/[0.03] to-white/[0.01]" : "border-gray-200 bg-white shadow-sm shadow-gray-900/[0.04]"}`,
  kbd: `px-2 py-1 rounded-md text-[11px] font-mono min-w-[2.5rem] text-center font-medium ${dark ? "bg-gray-900 border border-white/10 text-gray-300 shadow-sm" : "bg-white border border-gray-200 text-gray-600 shadow-sm"}`,
  label: `text-xs font-medium ${dark ? "text-gray-500" : "text-gray-400"}`,
  btn: `px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${dark ? "bg-gray-700 text-gray-200 hover:bg-gray-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
  btnPrimary: `px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${dark ? "bg-indigo-500 text-white hover:bg-indigo-600" : "bg-indigo-600 text-white hover:bg-indigo-700"}`,
  note: `mt-3 p-3 rounded-lg text-xs ${dark ? "bg-blue-900/20 border border-blue-800/50 text-blue-300" : "bg-blue-50 border border-blue-200 text-blue-700"}`,
  btnSuccess: `px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${dark ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-emerald-500 text-white hover:bg-emerald-600"}`,
  btnWarning: `px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${dark ? "bg-amber-600 text-white hover:bg-amber-700" : "bg-amber-500 text-white hover:bg-amber-600"}`,
  btnError: `px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${dark ? "bg-rose-600 text-white hover:bg-rose-700" : "bg-rose-500 text-white hover:bg-rose-600"}`,
  btnInfo: `px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${dark ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-blue-500 text-white hover:bg-blue-600"}`,
});

// ─── Toast Demo Content ──────────────────────────────────────────────────────

const ToastDemoContent = ({
  position,
  setPosition,
}: {
  position: ToastPosition;
  setPosition: (pos: ToastPosition) => void;
}) => {
  const { isDarkMode: dark } = useTheme();
  const c = getClasses(dark);
  const toast = useToast();
  const toastIdRef = useRef<string | null>(null);

  return (
    <div className="space-y-10">
      {/* ─── Header ─────────────────────────────────────────────────────── */}
      <header className="relative overflow-hidden rounded-2xl p-6 sm:p-8">
        <div
          className={`absolute inset-0 ${dark ? "bg-linear-to-br from-indigo-950/80 via-gray-900/60 to-blue-950/50" : "bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50"}`}
        />
        <div
          className={`absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl ${dark ? "bg-blue-500/10" : "bg-blue-200/40"}`}
        />
        <div
          className={`absolute -bottom-24 -left-24 w-64 h-64 rounded-full blur-3xl ${dark ? "bg-indigo-500/10" : "bg-indigo-200/30"}`}
        />
        <div className="relative">
          <h1
            className={`text-3xl font-bold mb-3 ${dark ? "text-white" : "text-gray-900"}`}
          >
            Toast
          </h1>
          <p
            className={`text-sm leading-relaxed max-w-2xl ${dark ? "text-gray-400" : "text-gray-600"}`}
          >
            A flexible, accessible notification system for displaying brief
            messages to users. Supports multiple variants, customizable durations,
            progress indicators, custom content, and extensive styling options.
          </p>
          <div className="mt-5">
            <CodeBlock
              isDarkMode={dark}
              code={`import { ToastProvider, useToast } from "@chumlab/ui/toast";`}
            />
          </div>
        </div>
      </header>

      {/* ─── Basic Variants ───────────────────────────────────────────── */}
      <Section
        title="Basic Usage"
        description="Four toast types for different notification contexts: success, warning, error, and info."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <button
            className={c.btnSuccess}
            onClick={() => toast.success("Operation completed successfully!")}
          >
            Success
          </button>
          <button
            className={c.btnWarning}
            onClick={() => toast.warning("Please review before proceeding.")}
          >
            Warning
          </button>
          <button
            className={c.btnError}
            onClick={() =>
              toast.error("Something went wrong. Please try again.")
            }
          >
            Error
          </button>
          <button
            className={c.btnInfo}
            onClick={() => toast.info("Here's some useful information.")}
          >
            Info
          </button>
        </DemoWrapper>
      </Section>

      {/* ─── With Description ─────────────────────────────────────────── */}
      <Section
        title="With Description"
        description="Add secondary text using the description prop for more context."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <button
            className={c.btnSuccess}
            onClick={() =>
              toast.success("File uploaded", {
                description:
                  "Your file has been successfully uploaded to the server.",
              })
            }
          >
            Success with Description
          </button>
          <button
            className={c.btnError}
            onClick={() =>
              toast.error("Upload failed", {
                description:
                  "The file size exceeds the maximum limit of 10MB.",
              })
            }
          >
            Error with Description
          </button>
          <button
            className={c.btnWarning}
            onClick={() =>
              toast.warning("Session expiring", {
                description:
                  "Your session will expire in 5 minutes. Please save your work.",
              })
            }
          >
            Warning with Description
          </button>
        </DemoWrapper>
      </Section>

      {/* ─── Duration ─────────────────────────────────────────────────── */}
      <Section
        title="Duration"
        description="Control how long toasts stay visible with the duration prop (in milliseconds). Use Infinity for persistent toasts."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <button
            className={c.btnInfo}
            onClick={() =>
              toast.info("Quick notification", {
                duration: 2000,
                description: "Disappears in 2 seconds",
              })
            }
          >
            2 Seconds
          </button>
          <button
            className={c.btnInfo}
            onClick={() =>
              toast.info("Standard notification", {
                duration: 5000,
                description: "Disappears in 5 seconds (default)",
              })
            }
          >
            5 Seconds (default)
          </button>
          <button
            className={c.btnInfo}
            onClick={() =>
              toast.info("Long notification", {
                duration: 10000,
                description: "Disappears in 10 seconds",
              })
            }
          >
            10 Seconds
          </button>
          <button
            className={c.btn}
            onClick={() =>
              toast.info("Persistent notification", {
                duration: Infinity,
                description: "Stays until manually closed",
              })
            }
          >
            Persistent (Infinity)
          </button>
        </DemoWrapper>
      </Section>

      {/* ─── Progress Bar ─────────────────────────────────────────────── */}
      <Section
        title="Progress Bar"
        description="Toggle the progress indicator with showProgress. The bar shows remaining time before auto-dismiss."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <button
            className={c.btnInfo}
            onClick={() =>
              toast.info("With progress bar", {
                showProgress: true,
                description: "Progress bar shows remaining time",
              })
            }
          >
            With Progress (default)
          </button>
          <button
            className={c.btn}
            onClick={() =>
              toast.info("No progress indicator", {
                showProgress: false,
                description: "Clean toast without progress bar",
              })
            }
          >
            Without Progress
          </button>
        </DemoWrapper>
      </Section>

      {/* ─── Custom Progress Color ────────────────────────────────────── */}
      <Section
        title="Custom Progress Color"
        description="Customize the progress bar with progressColor (inline style) or classes.progress (Tailwind classes)."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <button
            className={c.btn}
            onClick={() =>
              toast.toast({
                type: "info",
                message: "Custom progress color",
                description: "Using progressColor prop (inline style)",
                progressColor: "#a855f7",
              })
            }
          >
            Purple (progressColor)
          </button>
          <button
            className={c.btn}
            onClick={() =>
              toast.toast({
                type: "info",
                message: "Gradient progress",
                description: "Using classes.progress prop",
                classes: {
                  progress:
                    "bg-linear-to-r from-pink-400 via-purple-400 to-indigo-400",
                },
              })
            }
          >
            Gradient (classes.progress)
          </button>
          <button
            className={c.btn}
            onClick={() =>
              toast.toast({
                type: "success",
                message: "Themed progress",
                description: "Green progress bar",
                progressColor: "#22c55e",
              })
            }
          >
            Green Progress
          </button>
        </DemoWrapper>
      </Section>

      {/* ─── Close Button ─────────────────────────────────────────────── */}
      <Section
        title="Close Button"
        description="Toggle the close button visibility with showCloseButton prop."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <button
            className={c.btnInfo}
            onClick={() =>
              toast.info("With close button", {
                showCloseButton: true,
                description: "Click X to dismiss (default)",
              })
            }
          >
            With Close Button (default)
          </button>
          <button
            className={c.btn}
            onClick={() =>
              toast.info("Auto-dismiss only", {
                showCloseButton: false,
                duration: 3000,
                description: "Cannot be manually closed",
              })
            }
          >
            Without Close Button
          </button>
        </DemoWrapper>
      </Section>

      {/* ─── Pause on Hover ───────────────────────────────────────────── */}
      <Section
        title="Pause on Hover"
        description="Control whether the auto-dismiss timer pauses when hovering over the toast."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <button
            className={c.btnInfo}
            onClick={() =>
              toast.info("Hover to pause", {
                duration: 5000,
                description: "Timer pauses when hovered (default)",
                pauseOnHover: true,
              })
            }
          >
            Pause on Hover (default)
          </button>
          <button
            className={c.btn}
            onClick={() =>
              toast.info("No pause on hover", {
                duration: 5000,
                description: "Timer continues when hovered",
                pauseOnHover: false,
              })
            }
          >
            No Pause
          </button>
        </DemoWrapper>
      </Section>

      {/* ─── Escape Key Dismissal ─────────────────────────────────────── */}
      <Section
        title="Escape Key Dismissal"
        description="Enable keyboard dismissal with the dismissOnEscape prop on ToastProvider."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <button
            className={c.btnInfo}
            onClick={() =>
              toast.info("Press Escape to dismiss", {
                duration: Infinity,
                description:
                  "This toast can be dismissed with the Escape key",
              })
            }
          >
            With Escape Dismissal
          </button>
          <button
            className={c.btn}
            onClick={() =>
              toast.info("Standard toast", {
                duration: Infinity,
                description: "Use close button to dismiss (Escape disabled)",
              })
            }
          >
            Without Escape Dismissal
          </button>
        </DemoWrapper>
        <div className={c.note}>
          <strong>Tip:</strong> Set{" "}
          <code className="font-mono">dismissOnEscape</code> on ToastProvider to
          enable Escape dismissal for all toasts globally.
        </div>
      </Section>

      {/* ─── Custom Icon ──────────────────────────────────────────────── */}
      <Section
        title="Custom Icon"
        description="Replace the default type icon with a custom icon using the icon prop."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <button
            className={c.btnInfo}
            onClick={() =>
              toast.toast({
                type: "info",
                message: "Custom icon",
                description: "Using emoji as icon",
                icon: <span className="text-xl">🚀</span>,
              })
            }
          >
            Rocket Icon
          </button>
          <button
            className={c.btnSuccess}
            onClick={() =>
              toast.success("Celebration!", {
                icon: <span className="text-xl">🎉</span>,
              })
            }
          >
            Party Icon
          </button>
          <button
            className={c.btnWarning}
            onClick={() =>
              toast.warning("Heads up!", {
                icon: <span className="text-xl">👀</span>,
              })
            }
          >
            Eyes Icon
          </button>
          <button
            className={c.btn}
            onClick={() =>
              toast.toast({
                type: "info",
                message: "SVG Icon",
                description: "Custom SVG icon",
                icon: (
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ),
              })
            }
          >
            Star Icon
          </button>
        </DemoWrapper>
      </Section>

      {/* ─── Icon Styling ─────────────────────────────────────────────── */}
      <Section
        title="Icon Styling"
        description="Customize the icon wrapper with classes.icon slot."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <button
            className={c.btn}
            onClick={() =>
              toast.toast({
                type: "info",
                message: "Styled icon",
                description: "Icon with custom background",
                icon: <span className="text-lg">✨</span>,
                classes: { icon: "bg-white/20 p-1.5 rounded-full" },
              })
            }
          >
            Rounded Icon Background
          </button>
          <button
            className={c.btn}
            onClick={() =>
              toast.toast({
                type: "success",
                message: "Large icon",
                description: "Icon with larger size",
                classes: { icon: "text-2xl" },
              })
            }
          >
            Large Default Icon
          </button>
        </DemoWrapper>
      </Section>

      {/* ─── Custom Content ───────────────────────────────────────────── */}
      <Section
        title="Custom Content (content prop)"
        description="Replace message/description with fully custom content using the content prop."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="flex flex-col gap-4 w-full">
            <div className="flex flex-wrap gap-4">
              <button
                className={c.btnInfo}
                onClick={() =>
                  toast.toast({
                    type: "info",
                    content: (
                      <div className="flex flex-col gap-2">
                        <p className="font-bold text-base">
                          New Update Available
                        </p>
                        <p className="text-sm opacity-80">
                          Version 2.0 is now available.
                        </p>
                        <div className="flex gap-2 mt-1">
                          <button className="px-3 py-1 bg-white text-[#213f70] text-xs font-medium rounded hover:bg-white/90">
                            Update Now
                          </button>
                          <button className="px-3 py-1 bg-white/20 text-white text-xs rounded hover:bg-white/30">
                            Later
                          </button>
                        </div>
                      </div>
                    ),
                    duration: 10000,
                  })
                }
              >
                With Action Buttons
              </button>
              <button
                className={c.btnSuccess}
                onClick={() =>
                  toast.toast({
                    type: "success",
                    content: (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                          <span className="text-lg">🏆</span>
                        </div>
                        <div>
                          <p className="font-bold">Achievement Unlocked!</p>
                          <p className="text-sm opacity-80">
                            You've completed 100 tasks
                          </p>
                        </div>
                      </div>
                    ),
                    showProgress: false,
                  })
                }
              >
                Custom Layout
              </button>
              <button
                className={c.btn}
                onClick={() =>
                  toast.toast({
                    type: "info",
                    content: (
                      <div>
                        <p className="font-medium">Download Progress</p>
                        <div className="mt-2 h-2 bg-white/20 rounded-full overflow-hidden">
                          <div className="h-full bg-white w-3/4 animate-pulse" />
                        </div>
                        <p className="text-xs mt-1 opacity-70">
                          75% complete
                        </p>
                      </div>
                    ),
                    duration: 8000,
                    showProgress: false,
                  })
                }
              >
                Progress Content
              </button>
            </div>
            <div className={c.note}>
              <strong>Note:</strong> When using{" "}
              <code className="font-mono">content</code>, the{" "}
              <code className="font-mono">message</code> and{" "}
              <code className="font-mono">description</code> props are ignored.
            </div>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Custom Styling (classes prop) ────────────────────────────── */}
      <Section
        title="Custom Styling"
        description="Customize toast appearance using the classes prop with slot overrides."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <button
            className={c.btn}
            onClick={() =>
              toast.toast({
                type: "info",
                message: "Light themed toast",
                description: "Using classes.container to override styles",
                classes: {
                  container: "bg-white border-gray-200 text-gray-800",
                  icon: "text-blue-500",
                  closeButton: "hover:bg-gray-100",
                },
              })
            }
          >
            Light Theme
          </button>
          <button
            className={c.btn}
            onClick={() =>
              toast.toast({
                type: "success",
                message: "Custom border radius",
                description: "Rounded-full style",
                classes: {
                  container: "rounded-full bg-[#195030]",
                },
              })
            }
          >
            Rounded Full
          </button>
          <button
            className={c.btn}
            onClick={() =>
              toast.toast({
                type: "info",
                message: "Custom message style",
                description: "Description with custom styling",
                classes: {
                  message: "text-lg font-bold text-yellow-300",
                  description: "text-xs italic text-blue-200",
                },
              })
            }
          >
            Custom Text Styles
          </button>
          <button
            className={c.btn}
            onClick={() =>
              toast.toast({
                type: "success",
                message: "Custom content wrapper",
                description: "Using classes.content for padding",
                classes: {
                  content: "p-6 bg-white/10 rounded-lg",
                },
              })
            }
          >
            Custom Content Wrapper
          </button>
        </DemoWrapper>
      </Section>

      {/* ─── Inline Styles ────────────────────────────────────────────── */}
      <Section
        title="Inline Styles"
        description="Use the style prop for inline CSS customization."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <button
            className={c.btn}
            onClick={() =>
              toast.toast({
                type: "info",
                message: "Custom shadow",
                description: "Using style prop for box-shadow",
                style: {
                  boxShadow: "0 10px 40px rgba(59, 130, 246, 0.5)",
                },
              })
            }
          >
            Custom Shadow
          </button>
          <button
            className={c.btn}
            onClick={() =>
              toast.toast({
                type: "success",
                message: "Custom width",
                description: "This toast has a wider minimum width",
                style: {
                  minWidth: "400px",
                },
              })
            }
          >
            Custom Width
          </button>
          <button
            className={c.btn}
            onClick={() =>
              toast.toast({
                type: "warning",
                message: "Gradient background",
                description: "Using style for gradient",
                style: {
                  background:
                    "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                  border: "none",
                },
              })
            }
          >
            Gradient Background
          </button>
        </DemoWrapper>
      </Section>

      {/* ─── CSS Variables ────────────────────────────────────────────── */}
      <Section
        title="CSS Variables (Theming)"
        description="Toast colors can be customized globally using CSS custom properties for design system integration."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <button
            className={c.btnSuccess}
            onClick={() =>
              toast.success("Themed success", {
                description: "Uses --toast-success-bg CSS variable",
              })
            }
          >
            Success (Themed)
          </button>
          <button
            className={c.btnError}
            onClick={() =>
              toast.error("Themed error", {
                description: "Uses --toast-error-bg CSS variable",
              })
            }
          >
            Error (Themed)
          </button>
        </DemoWrapper>
      </Section>

      {/* ─── Callbacks ────────────────────────────────────────────────── */}
      <Section
        title="Callbacks"
        description="Use onDismiss callback to execute code when a toast is dismissed. (onClose is deprecated — use onDismiss instead.)"
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <button
            className={c.btnInfo}
            onClick={() =>
              toast.info("Toast with callback", {
                description: "Check console when this closes",
                onDismiss: () => console.log("Toast was dismissed!"),
              })
            }
          >
            With onDismiss Callback
          </button>
          <button
            className={c.btn}
            onClick={() =>
              toast.success("Action completed", {
                description: "Alert will show when dismissed",
                onDismiss: () => alert("Toast dismissed! Performing cleanup..."),
              })
            }
          >
            Alert on Dismiss
          </button>
        </DemoWrapper>
      </Section>

      {/* ─── Programmatic Dismiss ─────────────────────────────────────── */}
      <Section
        title="Programmatic Dismiss"
        description="Use dismiss(id) to remove a specific toast, or dismissAll() to clear all toasts."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="flex flex-col gap-4 w-full">
            <div className="flex flex-wrap gap-3">
              <button
                className={c.btnInfo}
                onClick={() => {
                  toastIdRef.current = toast.info("Persistent toast", {
                    duration: Infinity,
                    description: "Use the dismiss button to remove this",
                  });
                }}
              >
                Create Tracked Toast
              </button>
              <button
                className={c.btn}
                onClick={() => {
                  if (toastIdRef.current) {
                    toast.dismiss(toastIdRef.current);
                    toastIdRef.current = null;
                  }
                }}
              >
                Dismiss by ID
              </button>
              <button
                className={c.btnError}
                onClick={() => toast.dismissAll()}
              >
                Dismiss All
              </button>
            </div>
            <p
              className={`text-xs ${dark ? "text-gray-400" : "text-gray-500"}`}
            >
              The <code className="font-mono">toast()</code> methods return a
              unique ID that can be used with{" "}
              <code className="font-mono">dismiss(id)</code>.
            </p>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Multiple Toasts & Max Limit ──────────────────────────────── */}
      <Section
        title="Multiple Toasts & Max Limit"
        description="Toasts stack automatically. When maxToasts is exceeded, oldest toasts are dismissed."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <button
            className={c.btnInfo}
            onClick={() => {
              toast.success("First toast");
              setTimeout(() => toast.warning("Second toast"), 200);
              setTimeout(() => toast.error("Third toast"), 400);
              setTimeout(() => toast.info("Fourth toast"), 600);
            }}
          >
            Trigger 4 Toasts
          </button>
          <button
            className={c.btn}
            onClick={() => {
              for (let i = 1; i <= 10; i++) {
                setTimeout(() => {
                  toast.info(`Toast #${i}`, {
                    description: `This is toast number ${i}`,
                  });
                }, i * 100);
              }
            }}
          >
            Trigger 10 Toasts (Max 5 visible)
          </button>
        </DemoWrapper>
        <div className={c.note}>
          <strong>Tip:</strong> Configure{" "}
          <code className="font-mono">maxToasts</code> on ToastProvider to
          control the maximum visible toasts (default: 5).
        </div>
      </Section>

      {/* ─── Position ─────────────────────────────────────────────────── */}
      <Section
        title="Position"
        description="Control toast position using the position prop on ToastProvider."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="flex flex-col gap-4 w-full">
            <div className="flex flex-wrap gap-2">
              {(
                [
                  "top-left",
                  "top-center",
                  "top-right",
                  "bottom-left",
                  "bottom-center",
                  "bottom-right",
                ] as const
              ).map((pos) => (
                <button
                  key={pos}
                  className={position === pos ? c.btnPrimary : c.btn}
                  onClick={() => setPosition(pos)}
                >
                  {pos}
                </button>
              ))}
            </div>
            <p
              className={`text-xs ${dark ? "text-gray-400" : "text-gray-500"}`}
            >
              Current position:{" "}
              <strong className={dark ? "text-white" : "text-gray-900"}>
                {position}
              </strong>
            </p>
            <button
              className={c.btnInfo}
              onClick={() =>
                toast.info(`Toast at ${position}`, {
                  description: "See the position in action!",
                })
              }
            >
              Show Toast at Current Position
            </button>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Generic toast() ──────────────────────────────────────────── */}
      <Section
        title="Generic toast() Method"
        description="Use toast.toast() for full configuration control, or pass a simple string for quick notifications."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <button
            className={c.btn}
            onClick={() => toast.toast("Simple string message")}
          >
            String Shorthand
          </button>
          <button
            className={c.btn}
            onClick={() =>
              toast.toast({
                type: "success",
                message: "Full config",
                description: "Using toast() with object config",
                duration: 4000,
                showProgress: true,
              })
            }
          >
            Object Config
          </button>
        </DemoWrapper>
      </Section>

      {/* ─── Custom Close Button Label ────────────────────────────────── */}
      <Section
        title="Custom Close Button Label"
        description="Use closeAriaLabel to provide a localized or context-specific accessible label for the close button."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <button
            className={c.btnInfo}
            onClick={() =>
              toast.info("Localized close label", {
                description: "The close button has a custom aria-label",
                closeAriaLabel: "Dismiss this notification",
              })
            }
          >
            Custom closeAriaLabel
          </button>
          <button
            className={c.btnInfo}
            onClick={() =>
              toast.info("Spanish label", {
                description:
                  "El boton de cierre tiene una etiqueta personalizada",
                closeAriaLabel: "Cerrar notificacion",
              })
            }
          >
            i18n Example (Spanish)
          </button>
        </DemoWrapper>
      </Section>

      {/* ─── Animation Duration ───────────────────────────────────────── */}
      <Section
        title="Animation Duration"
        description="Control the speed of toast enter/exit animations via animationDuration on the ToastProvider (in milliseconds). Default is 200ms."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <p
            className={`text-xs ${dark ? "text-gray-400" : "text-gray-500"}`}
          >
            This page uses the default 200ms animation. To customize, set
            animationDuration on the ToastProvider.
          </p>
        </DemoWrapper>
      </Section>

      {/* ─── Container Aria Label ─────────────────────────────────────── */}
      <Section
        title="Container Aria Label"
        description='Customize the accessible label for the toast container region via containerAriaLabel on the ToastProvider. Defaults to "Notifications".'
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <p
            className={`text-xs ${dark ? "text-gray-400" : "text-gray-500"}`}
          >
            The toast container has{" "}
            <code className="font-mono">role=&quot;region&quot;</code> with an{" "}
            <code className="font-mono">aria-label</code> for screen readers.
          </p>
        </DemoWrapper>
      </Section>

      {/* ─── Unstyled Mode ────────────────────────────────────────────── */}
      <Section
        title="Unstyled Mode"
        description="Set unstyled=true to strip all default styles and build from scratch using the classes prop."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <button
            className={c.btn}
            onClick={() =>
              toast.toast({
                type: "info",
                message: "Fully custom toast",
                description: "Built from scratch with unstyled + classes",
                unstyled: true,
                classes: {
                  container: `p-4 rounded-xl border ${dark ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-900"} shadow-lg`,
                  message: "font-semibold text-sm",
                  description: `text-xs mt-1 ${dark ? "text-gray-400" : "text-gray-500"}`,
                },
              })
            }
          >
            Unstyled Toast
          </button>
        </DemoWrapper>
      </Section>

      {/* ─── ToastConfig Props ────────────────────────────────────────── */}
      <Section title="ToastConfig Props" isDarkMode={dark}>
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow
              name="type"
              type='"success"|"warning"|"error"|"info"'
              description="Toast variant type determining colors and default icon"
              isDarkMode={dark}
            />
            <PropRow
              name="message"
              type="ReactNode"
              description="Primary toast message (ignored if content is provided)"
              isDarkMode={dark}
            />
            <PropRow
              name="description"
              type="ReactNode"
              description="Secondary description text (ignored if content is provided)"
              isDarkMode={dark}
            />
            <PropRow
              name="content"
              type="ReactNode"
              description="Custom content replacing message/description"
              isDarkMode={dark}
            />
            <PropRow
              name="duration"
              type="number"
              defaultVal="5000"
              description="Auto-dismiss time in ms (Infinity for persistent)"
              isDarkMode={dark}
            />
            <PropRow
              name="showProgress"
              type="boolean"
              defaultVal="true"
              description="Show progress bar indicating time remaining"
              isDarkMode={dark}
            />
            <PropRow
              name="progressColor"
              type="string"
              description="Progress bar color (CSS color value)"
              isDarkMode={dark}
            />
            <PropRow
              name="icon"
              type="ReactNode"
              description="Custom icon (overrides type-based default)"
              isDarkMode={dark}
            />
            <PropRow
              name="showCloseButton"
              type="boolean"
              defaultVal="true"
              description="Show close button for manual dismissal"
              isDarkMode={dark}
            />
            <PropRow
              name="pauseOnHover"
              type="boolean"
              defaultVal="true"
              description="Pause auto-dismiss timer on hover"
              isDarkMode={dark}
            />
            <PropRow
              name="role"
              type='"alert"|"status"'
              defaultVal="auto"
              description='ARIA role (defaults to "alert" for error/warning, "status" for success/info)'
              isDarkMode={dark}
            />
            <PropRow
              name="onDismiss"
              type="() => void"
              description="Callback fired when toast is dismissed"
              isDarkMode={dark}
            />
            <PropRow
              name="onClose"
              type="() => void"
              description="Deprecated — use onDismiss instead"
              isDarkMode={dark}
            />
            <PropRow
              name="style"
              type="CSSProperties"
              description="Inline styles for the toast container"
              isDarkMode={dark}
            />
            <PropRow
              name="closeAriaLabel"
              type="string"
              defaultVal='"Close notification"'
              description="Accessible label for the close button"
              isDarkMode={dark}
            />
            <PropRow
              name="classes"
              type="ToastClasses"
              description="Slot class overrides (7 slots)"
              isDarkMode={dark}
            />
            <PropRow
              name="unstyled"
              type="boolean"
              defaultVal="false"
              description="Strip all default styles"
              isDarkMode={dark}
            />
          </PropsTable>
        </div>
      </Section>

      {/* ─── ToastProviderProps ────────────────────────────────────────── */}
      <Section title="ToastProvider Props" isDarkMode={dark}>
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow
              name="children"
              type="ReactNode"
              description="Application content to wrap"
              isDarkMode={dark}
            />
            <PropRow
              name="position"
              type="ToastPosition"
              defaultVal='"bottom-right"'
              description="Screen position for toast container"
              isDarkMode={dark}
            />
            <PropRow
              name="maxToasts"
              type="number"
              defaultVal="5"
              description="Maximum visible toasts (older ones auto-dismissed)"
              isDarkMode={dark}
            />
            <PropRow
              name="defaultDuration"
              type="number"
              defaultVal="5000"
              description="Default duration for all toasts (ms)"
              isDarkMode={dark}
            />
            <PropRow
              name="gap"
              type="number"
              defaultVal="12"
              description="Gap between stacked toasts (px)"
              isDarkMode={dark}
            />
            <PropRow
              name="containerClassName"
              type="string"
              description="CSS class for the toast container wrapper"
              isDarkMode={dark}
            />
            <PropRow
              name="zIndex"
              type="number"
              defaultVal="9999"
              description="Z-index for the toast portal"
              isDarkMode={dark}
            />
            <PropRow
              name="dismissOnEscape"
              type="boolean"
              defaultVal="false"
              description="Dismiss all toasts when Escape key is pressed"
              isDarkMode={dark}
            />
            <PropRow
              name="animationDuration"
              type="number"
              defaultVal="200"
              description="Duration of entry/exit animations in milliseconds"
              isDarkMode={dark}
            />
            <PropRow
              name="containerAriaLabel"
              type="string"
              defaultVal='"Notifications"'
              description="Accessible label for the toast container region"
              isDarkMode={dark}
            />
            <PropRow
              name="classes"
              type="ToastClasses"
              description="Default class overrides applied to all toasts"
              isDarkMode={dark}
            />
            <PropRow
              name="unstyled"
              type="boolean"
              defaultVal="false"
              description="Strip all default styles from all toasts"
              isDarkMode={dark}
            />
          </PropsTable>
        </div>
      </Section>

      {/* ─── ToastClasses Slots ───────────────────────────────────────── */}
      <Section title="ToastClasses Slots" isDarkMode={dark}>
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow
              name="container"
              type="string"
              description="Outer toast container element"
              isDarkMode={dark}
            />
            <PropRow
              name="content"
              type="string"
              description="Content wrapper (icon, text, close button)"
              isDarkMode={dark}
            />
            <PropRow
              name="message"
              type="string"
              description="Message text element"
              isDarkMode={dark}
            />
            <PropRow
              name="description"
              type="string"
              description="Description text element"
              isDarkMode={dark}
            />
            <PropRow
              name="progress"
              type="string"
              description="Progress bar element"
              isDarkMode={dark}
            />
            <PropRow
              name="closeButton"
              type="string"
              description="Close button element"
              isDarkMode={dark}
            />
            <PropRow
              name="icon"
              type="string"
              description="Icon wrapper element"
              isDarkMode={dark}
            />
          </PropsTable>
        </div>
      </Section>

      {/* ─── useToast Methods ─────────────────────────────────────────── */}
      <Section title="useToast Methods" isDarkMode={dark}>
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow
              name="toast"
              type="(config: ToastConfig | string) => string"
              description="Create a toast with full config or simple string message"
              isDarkMode={dark}
            />
            <PropRow
              name="success"
              type="(message: ReactNode, options?: ToastConfig) => string"
              description="Create a success toast"
              isDarkMode={dark}
            />
            <PropRow
              name="warning"
              type="(message: ReactNode, options?: ToastConfig) => string"
              description="Create a warning toast"
              isDarkMode={dark}
            />
            <PropRow
              name="error"
              type="(message: ReactNode, options?: ToastConfig) => string"
              description="Create an error toast"
              isDarkMode={dark}
            />
            <PropRow
              name="info"
              type="(message: ReactNode, options?: ToastConfig) => string"
              description="Create an info toast"
              isDarkMode={dark}
            />
            <PropRow
              name="dismiss"
              type="(id: string) => void"
              description="Dismiss a specific toast by ID"
              isDarkMode={dark}
            />
            <PropRow
              name="dismissAll"
              type="() => void"
              description="Dismiss all visible toasts"
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
              'Toast container uses role="alert" for screen reader announcements',
              'Toast region uses aria-live="polite" for non-intrusive updates',
              'Region labeled with aria-label="Notifications" (customizable)',
              'Close button has aria-label="Close notification" (customizable via closeAriaLabel)',
              "Focus is not forcibly moved to toasts (non-modal behavior)",
              "Pause on hover allows users time to read content",
              "Respects prefers-reduced-motion media query",
              "Escape key dismissal supported via dismissOnEscape",
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
              ["Tab", "Navigate to close button within toast"],
              ["Enter / Space", "Activate close button when focused"],
              ["Escape", "Dismiss toast(s) when dismissOnEscape is enabled"],
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
        summary="Toasts are pushed via `useToast()` from a `ToastProvider`. The provider owns position and queue; consumers only supply messages and options per call."
      />
      <DocEdgeCases
        isDarkMode={dark}
        items={[
          "Rapid duplicate errors may need deduplication in the caller.",
          "Long-running sessions should cap `maxToasts` to avoid DOM growth.",
          "Screen readers: avoid stacking many simultaneous alerts.",
        ]}
      />
      <DocDoDont
        isDarkMode={dark}
        dos={[
          "Use for transient feedback; critical flows may still need inline errors.",
          "Customize dismiss labels and durations per severity.",
          "Keep messages concise and actionable.",
        ]}
        donts={[
          "Do not use toasts for required form validation that blocks submit.",
          "Do not spam toast on every keystroke.",
          "Do not put essential-only content exclusively in a dismissed toast.",
        ]}
      />

      {/* ─── Data Attributes ──────────────────────────────────────────── */}
      <Section title="Data Attributes" description="Use for CSS-based state styling." isDarkMode={dark}>
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow name="data-toast-id" type="toast" description="Unique identifier for the toast instance" isDarkMode={dark} />
            <PropRow name="data-toast-type" type="toast" description="'success' | 'error' | 'warning' | 'info' | 'default'" isDarkMode={dark} />
          </PropsTable>
        </div>
      </Section>

      {/* ─── Accessibility ────────────────────────────────────────────── */}
      <Section title="Accessibility" description="Built-in accessibility features." isDarkMode={dark}>
        <div className={c.card}>
          <div className={`space-y-2 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>
            {[
              "role=\"alert\" or role=\"status\" based on toast type",
              "aria-live regions for dynamic announcements",
              "Close button includes aria-label for screen readers",
              "Auto-dismiss with pauseOnHover to avoid dismissing while reading",
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
              ["Escape", "Dismiss all toasts (via provider)"],
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

// ─── Wrapper Component ───────────────────────────────────────────────────────

const ToastDemo = () => {
  const [position, setPosition] = useState<ToastPosition>("bottom-right");

  return (
    <ToastProvider key={position} position={position} maxToasts={5}>
      <ToastDemoContent position={position} setPosition={setPosition} />
    </ToastProvider>
  );
};

export default ToastDemo;
