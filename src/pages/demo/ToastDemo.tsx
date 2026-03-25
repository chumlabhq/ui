import { useState, useRef } from "react";
import { Section, CodeBlock, DemoWrapper } from "./components";
import { Button } from "../../components/Button";
import { ToastProvider, useToast } from "../../components/Toast";
import { useTheme } from "./ThemeContext";

const ToastDemoContent = ({
  position,
  setPosition,
}: {
  position:
    | "top-left"
    | "top-right"
    | "top-center"
    | "bottom-left"
    | "bottom-right"
    | "bottom-center";
  setPosition: (
    pos:
      | "top-left"
      | "top-right"
      | "top-center"
      | "bottom-left"
      | "bottom-right"
      | "bottom-center",
  ) => void;
}) => {
  const { isDarkMode } = useTheme();
  const toast = useToast();
  const toastIdRef = useRef<string | null>(null);

  const getButtonStyles = () => ({
    success: `cursor-pointer px-4 py-2 rounded-lg font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 ${
      isDarkMode
        ? "bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:ring-emerald-400 focus-visible:ring-offset-gray-900"
        : "bg-emerald-500 text-white hover:bg-emerald-600 focus-visible:ring-emerald-500"
    }`,
    warning: `cursor-pointer px-4 py-2 rounded-lg font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 ${
      isDarkMode
        ? "bg-amber-600 text-white hover:bg-amber-700 focus-visible:ring-amber-400 focus-visible:ring-offset-gray-900"
        : "bg-amber-500 text-white hover:bg-amber-600 focus-visible:ring-amber-500"
    }`,
    error: `cursor-pointer px-4 py-2 rounded-lg font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 ${
      isDarkMode
        ? "bg-rose-600 text-white hover:bg-rose-700 focus-visible:ring-rose-400 focus-visible:ring-offset-gray-900"
        : "bg-rose-500 text-white hover:bg-rose-600 focus-visible:ring-rose-500"
    }`,
    info: `cursor-pointer px-4 py-2 rounded-lg font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 ${
      isDarkMode
        ? "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-400 focus-visible:ring-offset-gray-900"
        : "bg-blue-500 text-white hover:bg-blue-600 focus-visible:ring-blue-500"
    }`,
    secondary: `cursor-pointer px-4 py-2 rounded-lg font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 ${
      isDarkMode
        ? "bg-gray-600 text-white hover:bg-gray-500 focus-visible:ring-gray-400 focus-visible:ring-offset-gray-900"
        : "bg-slate-100 text-slate-700 hover:bg-slate-200 focus-visible:ring-slate-400"
    }`,
    outline: `cursor-pointer px-4 py-2 rounded-lg font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 ${
      isDarkMode
        ? "border border-gray-500 text-gray-200 hover:bg-gray-700 focus-visible:ring-gray-400 focus-visible:ring-offset-gray-900"
        : "border border-slate-300 text-slate-600 hover:bg-slate-50 focus-visible:ring-slate-400"
    }`,
  });

  const styles = getButtonStyles();

  return (
    <div className="space-y-16">
      <header>
        <h1
          className={`text-3xl font-bold mb-3 ${isDarkMode ? "text-white" : "text-gray-900"}`}
        >
          Toast
        </h1>
        <p
          className={`text-lg ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
        >
          A flexible, accessible notification system for displaying brief
          messages to users. Supports multiple variants, customizable durations,
          progress indicators, custom content, and extensive styling options.
        </p>

        <div className="mt-6">
          <h3
            className={`text-sm font-semibold mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
          >
            Installation
          </h3>
          <CodeBlock
            isDarkMode={isDarkMode}
            code={`import { ToastProvider, useToast } from "@kern-ui/toast";

function App() {
  return (
    <ToastProvider position="bottom-right">
      <YourApp />
    </ToastProvider>
  );
}

function MyComponent() {
  const toast = useToast();
  
  return (
    <button onClick={() => toast.success("Success!")}>
      Show Toast
    </button>
  );
}`}
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
          title="Basic Variants"
          description="Four toast types for different notification contexts: success, warning, error, and info."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Button
              className={styles.success}
              onClick={() => toast.success("Operation completed successfully!")}
            >
              Success
            </Button>
            <Button
              className={styles.warning}
              onClick={() => toast.warning("Please review before proceeding.")}
            >
              Warning
            </Button>
            <Button
              className={styles.error}
              onClick={() =>
                toast.error("Something went wrong. Please try again.")
              }
            >
              Error
            </Button>
            <Button
              className={styles.info}
              onClick={() => toast.info("Here's some useful information.")}
            >
              Info
            </Button>
          </DemoWrapper>
        </Section>

        <Section
          title="With Description"
          description="Add secondary text using the description prop for more context."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Button
              className={styles.success}
              onClick={() =>
                toast.success("File uploaded", {
                  description:
                    "Your file has been successfully uploaded to the server.",
                })
              }
            >
              Success with Description
            </Button>
            <Button
              className={styles.error}
              onClick={() =>
                toast.error("Upload failed", {
                  description:
                    "The file size exceeds the maximum limit of 10MB.",
                })
              }
            >
              Error with Description
            </Button>
            <Button
              className={styles.warning}
              onClick={() =>
                toast.warning("Session expiring", {
                  description:
                    "Your session will expire in 5 minutes. Please save your work.",
                })
              }
            >
              Warning with Description
            </Button>
          </DemoWrapper>
        </Section>

        <Section
          title="Duration"
          description="Control how long toasts stay visible with the duration prop (in milliseconds). Use Infinity for persistent toasts."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Button
              className={styles.info}
              onClick={() =>
                toast.info("Quick notification", {
                  duration: 2000,
                  description: "Disappears in 2 seconds",
                })
              }
            >
              2 Seconds
            </Button>
            <Button
              className={styles.info}
              onClick={() =>
                toast.info("Standard notification", {
                  duration: 5000,
                  description: "Disappears in 5 seconds (default)",
                })
              }
            >
              5 Seconds (default)
            </Button>
            <Button
              className={styles.info}
              onClick={() =>
                toast.info("Long notification", {
                  duration: 10000,
                  description: "Disappears in 10 seconds",
                })
              }
            >
              10 Seconds
            </Button>
            <Button
              className={styles.secondary}
              onClick={() =>
                toast.info("Persistent notification", {
                  duration: Infinity,
                  description: "Stays until manually closed",
                })
              }
            >
              Persistent (Infinity)
            </Button>
          </DemoWrapper>
        </Section>

        <Section
          title="Progress Bar"
          description="Toggle the progress indicator with showProgress. The bar shows remaining time before auto-dismiss."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Button
              className={styles.info}
              onClick={() =>
                toast.info("With progress bar", {
                  showProgress: true,
                  description: "Progress bar shows remaining time",
                })
              }
            >
              With Progress (default)
            </Button>
            <Button
              className={styles.secondary}
              onClick={() =>
                toast.info("No progress indicator", {
                  showProgress: false,
                  description: "Clean toast without progress bar",
                })
              }
            >
              Without Progress
            </Button>
          </DemoWrapper>
        </Section>

        <Section
          title="Custom Progress Color"
          description="Customize the progress bar with progressColor (inline style) or progressClassName (Tailwind classes)."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Button
              className={styles.secondary}
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
            </Button>
            <Button
              className={styles.secondary}
              onClick={() =>
                toast.toast({
                  type: "info",
                  message: "Gradient progress",
                  description: "Using progressClassName prop",
                  progressClassName:
                    "bg-linear-to-r from-pink-400 via-purple-400 to-indigo-400",
                })
              }
            >
              Gradient (progressClassName)
            </Button>
            <Button
              className={styles.secondary}
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
            </Button>
          </DemoWrapper>
        </Section>

        <Section
          title="Close Button"
          description="Toggle the close button visibility with showCloseButton prop."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Button
              className={styles.info}
              onClick={() =>
                toast.info("With close button", {
                  showCloseButton: true,
                  description: "Click X to dismiss (default)",
                })
              }
            >
              With Close Button (default)
            </Button>
            <Button
              className={styles.secondary}
              onClick={() =>
                toast.info("Auto-dismiss only", {
                  showCloseButton: false,
                  duration: 3000,
                  description: "Cannot be manually closed",
                })
              }
            >
              Without Close Button
            </Button>
          </DemoWrapper>
        </Section>

        <Section
          title="Pause on Hover"
          description="Control whether the auto-dismiss timer pauses when hovering over the toast."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Button
              className={styles.info}
              onClick={() =>
                toast.info("Hover to pause", {
                  duration: 5000,
                  description: "Timer pauses when hovered (default)",
                  pauseOnHover: true,
                })
              }
            >
              Pause on Hover (default)
            </Button>
            <Button
              className={styles.secondary}
              onClick={() =>
                toast.info("No pause on hover", {
                  duration: 5000,
                  description: "Timer continues when hovered",
                  pauseOnHover: false,
                })
              }
            >
              No Pause
            </Button>
          </DemoWrapper>
        </Section>

        <Section
          title="Escape Key Dismissal"
          description="Enable keyboard dismissal with the dismissOnEscape prop. Can be set per-toast or globally on ToastProvider."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Button
              className={styles.info}
              onClick={() =>
                toast.info("Press Escape to dismiss", {
                  duration: Infinity,
                  description:
                    "This toast can be dismissed with the Escape key",
                })
              }
            >
              With Escape Dismissal
            </Button>
            <Button
              className={styles.secondary}
              onClick={() =>
                toast.info("Standard toast", {
                  duration: Infinity,
                  description: "Use close button to dismiss (Escape disabled)",
                })
              }
            >
              Without Escape Dismissal
            </Button>
          </DemoWrapper>
          <div
            className={`mt-4 p-3 rounded-lg ${isDarkMode ? "bg-blue-900/30 border border-blue-800" : "bg-blue-50 border border-blue-200"}`}
          >
            <p
              className={`text-sm ${isDarkMode ? "text-blue-200" : "text-blue-800"}`}
            >
              <strong>Tip:</strong> Set{" "}
              <code
                className={`px-1 py-0.5 border rounded text-xs font-mono ${isDarkMode ? "bg-gray-800/80 border-gray-600 text-gray-300" : "bg-white border-gray-300 text-gray-700"}`}
              >
                dismissOnEscape
              </code>{" "}
              on ToastProvider to enable Escape dismissal for all toasts
              globally.
            </p>
          </div>
        </Section>

        <Section
          title="Custom Icon"
          description="Replace the default type icon with a custom icon using the icon prop."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Button
              className={styles.info}
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
            </Button>
            <Button
              className={styles.success}
              onClick={() =>
                toast.success("Celebration!", {
                  icon: <span className="text-xl">🎉</span>,
                })
              }
            >
              Party Icon
            </Button>
            <Button
              className={styles.warning}
              onClick={() =>
                toast.warning("Heads up!", {
                  icon: <span className="text-xl">👀</span>,
                })
              }
            >
              Eyes Icon
            </Button>
            <Button
              className={styles.secondary}
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
            </Button>
          </DemoWrapper>
        </Section>

        <Section
          title="Icon Styling"
          description="Customize the icon wrapper with iconClassName prop."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Button
              className={styles.secondary}
              onClick={() =>
                toast.toast({
                  type: "info",
                  message: "Styled icon",
                  description: "Icon with custom background",
                  icon: <span className="text-lg">✨</span>,
                  iconClassName: "bg-white/20 p-1.5 rounded-full",
                })
              }
            >
              Rounded Icon Background
            </Button>
            <Button
              className={styles.secondary}
              onClick={() =>
                toast.toast({
                  type: "success",
                  message: "Large icon",
                  description: "Icon with larger size",
                  iconClassName: "text-2xl",
                })
              }
            >
              Large Default Icon
            </Button>
          </DemoWrapper>
        </Section>

        <Section
          title="Custom Content (content prop)"
          description="Replace message/description with fully custom content using the content prop."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="flex flex-col gap-4 w-full">
              <div className="flex flex-wrap gap-4">
                <Button
                  className={styles.info}
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
                </Button>
                <Button
                  className={styles.success}
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
                </Button>
                <Button
                  className={styles.secondary}
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
                </Button>
              </div>
              <div
                className={`p-3 rounded-lg ${isDarkMode ? "bg-blue-900/30 border border-blue-800" : "bg-blue-50 border border-blue-200"}`}
              >
                <p
                  className={`text-sm ${isDarkMode ? "text-blue-200" : "text-blue-800"}`}
                >
                  <strong>Note:</strong> When using{" "}
                  <code
                    className={`px-1 py-0.5 border rounded text-xs font-mono ${isDarkMode ? "bg-gray-800/80 border-gray-600 text-gray-300" : "bg-white border-gray-300 text-gray-700"}`}
                  >
                    content
                  </code>
                  , the{" "}
                  <code
                    className={`px-1 py-0.5 border rounded text-xs font-mono ${isDarkMode ? "bg-gray-800/80 border-gray-600 text-gray-300" : "bg-white border-gray-300 text-gray-700"}`}
                  >
                    message
                  </code>{" "}
                  and{" "}
                  <code
                    className={`px-1 py-0.5 border rounded text-xs font-mono ${isDarkMode ? "bg-gray-800/80 border-gray-600 text-gray-300" : "bg-white border-gray-300 text-gray-700"}`}
                  >
                    description
                  </code>{" "}
                  props are ignored.
                </p>
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Custom Styling"
          description="Customize toast appearance using className and other styling props."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Button
              className={styles.secondary}
              onClick={() =>
                toast.toast({
                  type: "info",
                  message: "Light themed toast",
                  description: "Using className to override styles",
                  className: "bg-white border-gray-200 text-gray-800",
                  iconClassName: "text-blue-500",
                  closeButtonClassName: "hover:bg-gray-100",
                })
              }
            >
              Light Theme
            </Button>
            <Button
              className={styles.secondary}
              onClick={() =>
                toast.toast({
                  type: "success",
                  message: "Custom border radius",
                  description: "Rounded-full style",
                  className: "rounded-full bg-[#195030]",
                })
              }
            >
              Rounded Full
            </Button>
            <Button
              className={styles.secondary}
              onClick={() =>
                toast.toast({
                  type: "info",
                  message: "Custom message style",
                  description: "Description with custom styling",
                  messageClassName: "text-lg font-bold text-yellow-300",
                  descriptionClassName: "text-xs italic text-blue-200",
                })
              }
            >
              Custom Text Styles
            </Button>
            <Button
              className={styles.secondary}
              onClick={() =>
                toast.toast({
                  type: "success",
                  message: "Custom content wrapper",
                  description: "Using contentClassName for padding",
                  contentClassName: "p-6 bg-white/10 rounded-lg",
                })
              }
            >
              Custom Content Wrapper
            </Button>
          </DemoWrapper>
        </Section>

        <Section
          title="Inline Styles"
          description="Use the style prop for inline CSS customization."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Button
              className={styles.secondary}
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
            </Button>
            <Button
              className={styles.secondary}
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
            </Button>
            <Button
              className={styles.secondary}
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
            </Button>
          </DemoWrapper>
        </Section>

        <Section
          title="CSS Variables (Theming)"
          description="Toast colors can be customized globally using CSS custom properties for design system integration."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="flex flex-col gap-4 w-full">
              <div className="flex flex-wrap gap-4">
                <Button
                  className={styles.success}
                  onClick={() =>
                    toast.success("Themed success", {
                      description: "Uses --toast-success-bg CSS variable",
                    })
                  }
                >
                  Success (Themed)
                </Button>
                <Button
                  className={styles.error}
                  onClick={() =>
                    toast.error("Themed error", {
                      description: "Uses --toast-error-bg CSS variable",
                    })
                  }
                >
                  Error (Themed)
                </Button>
              </div>
              <CodeBlock
                isDarkMode={isDarkMode}
                code={`:root {
  --toast-success-bg: #195030;
  --toast-success-border: #195030;
  --toast-success-text: white;
  --toast-warning-bg: #665823;
  --toast-warning-border: #665823;
  --toast-warning-text: white;
  --toast-error-bg: #82363a;
  --toast-error-border: #82363a;
  --toast-error-text: white;
  --toast-info-bg: #213f70;
  --toast-info-border: #213f70;
  --toast-info-text: white;
  --toast-default-bg: #374151;
  --toast-default-border: #374151;
  --toast-default-text: white;
}`}
              />
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Callbacks"
          description="Use onClose callback to execute code when a toast is dismissed."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Button
              className={styles.info}
              onClick={() =>
                toast.info("Toast with callback", {
                  description: "Check console when this closes",
                  onClose: () => console.log("Toast was closed!"),
                })
              }
            >
              With onClose Callback
            </Button>
            <Button
              className={styles.secondary}
              onClick={() =>
                toast.success("Action completed", {
                  description: "Alert will show when closed",
                  onClose: () => alert("Toast closed! Performing cleanup..."),
                })
              }
            >
              Alert on Close
            </Button>
          </DemoWrapper>
        </Section>

        <Section
          title="Programmatic Dismiss"
          description="Use dismiss(id) to remove a specific toast, or dismissAll() to clear all toasts."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="flex flex-col gap-4 w-full">
              <div className="flex flex-wrap gap-4">
                <Button
                  className={styles.info}
                  onClick={() => {
                    toastIdRef.current = toast.info("Persistent toast", {
                      duration: Infinity,
                      description: "Use the dismiss button to remove this",
                    });
                  }}
                >
                  Create Tracked Toast
                </Button>
                <Button
                  className={styles.secondary}
                  onClick={() => {
                    if (toastIdRef.current) {
                      toast.dismiss(toastIdRef.current);
                      toastIdRef.current = null;
                    }
                  }}
                >
                  Dismiss by ID
                </Button>
                <Button
                  className={styles.error}
                  onClick={() => toast.dismissAll()}
                >
                  Dismiss All
                </Button>
              </div>
              <p
                className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
              >
                The{" "}
                <code
                  className={`px-1 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}
                >
                  toast()
                </code>{" "}
                methods return a unique ID that can be used with{" "}
                <code
                  className={`px-1 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}
                >
                  dismiss(id)
                </code>
                .
              </p>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Multiple Toasts & Max Limit"
          description="Toasts stack automatically. When maxToasts is exceeded, oldest toasts are dismissed."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Button
              className={styles.info}
              onClick={() => {
                toast.success("First toast");
                setTimeout(() => toast.warning("Second toast"), 200);
                setTimeout(() => toast.error("Third toast"), 400);
                setTimeout(() => toast.info("Fourth toast"), 600);
              }}
            >
              Trigger 4 Toasts
            </Button>
            <Button
              className={styles.secondary}
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
            </Button>
          </DemoWrapper>
          <div
            className={`mt-4 p-3 rounded-lg ${isDarkMode ? "bg-amber-900/30 border border-amber-800" : "bg-amber-50 border border-amber-200"}`}
          >
            <p
              className={`text-sm ${isDarkMode ? "text-amber-200" : "text-amber-800"}`}
            >
              <strong>Tip:</strong> Configure{" "}
              <code
                className={`px-1 py-0.5 border rounded text-xs font-mono ${isDarkMode ? "bg-gray-800/80 border-gray-600 text-gray-300" : "bg-white border-gray-300 text-gray-700"}`}
              >
                maxToasts
              </code>{" "}
              on ToastProvider to control the maximum visible toasts (default:
              5).
            </p>
          </div>
        </Section>

        <Section
          title="Position"
          description="Control toast position using the position prop on ToastProvider. Change position to see toasts animate from different corners."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
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
                  <Button
                    key={pos}
                    className={position === pos ? styles.info : styles.outline}
                    onClick={() => setPosition(pos)}
                  >
                    {pos}
                  </Button>
                ))}
              </div>
              <p
                className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
              >
                Current position:{" "}
                <strong className={isDarkMode ? "text-white" : "text-gray-900"}>
                  {position}
                </strong>
              </p>
              <Button
                className={styles.info}
                onClick={() =>
                  toast.info(`Toast at ${position}`, {
                    description: "See the position in action!",
                  })
                }
              >
                Show Toast at Current Position
              </Button>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Generic toast() Method"
          description="Use toast.toast() for full configuration control, or pass a simple string for quick notifications."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Button
              className={styles.secondary}
              onClick={() => toast.toast("Simple string message")}
            >
              String Shorthand
            </Button>
            <Button
              className={styles.secondary}
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
            </Button>
          </DemoWrapper>
        </Section>

        <Section
          title="Custom Close Button Label"
          description="Use closeAriaLabel to provide a localized or context-specific accessible label for the close button. This is important for internationalization and screen reader users."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Button
              className={styles.info}
              onClick={() =>
                toast.info("Localized close label", {
                  description: "The close button has a custom aria-label",
                  closeAriaLabel: "Dismiss this notification",
                })
              }
            >
              Custom closeAriaLabel
            </Button>
            <Button
              className={styles.info}
              onClick={() =>
                toast.info("Spanish label", {
                  description:
                    "El botón de cierre tiene una etiqueta personalizada",
                  closeAriaLabel: "Cerrar notificación",
                })
              }
            >
              i18n Example (Spanish)
            </Button>
          </DemoWrapper>
          <CodeBlock
            isDarkMode={isDarkMode}
            code={`toast.info("Notification", {
  closeAriaLabel: "Dismiss this notification",
})

// i18n example
toast.info("Notificación", {
  closeAriaLabel: "Cerrar notificación",
})`}
          />
        </Section>

        <Section
          title="Animation Duration"
          description="Control the speed of toast enter/exit animations via animationDuration on the ToastProvider (in milliseconds). The default is 200ms."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <p
              className={`text-sm mb-3 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              This page uses the default 200ms animation. To customize, set
              animationDuration on the ToastProvider.
            </p>
          </DemoWrapper>
          <CodeBlock
            isDarkMode={isDarkMode}
            code={`<ToastProvider animationDuration={400}>
  {/* Toasts will animate in/out over 400ms */}
  <App />
</ToastProvider>

<ToastProvider animationDuration={0}>
  {/* Instant show/hide — no animation */}
  <App />
</ToastProvider>`}
          />
        </Section>

        <Section
          title="Container Aria Label"
          description="Customize the accessible label for the toast container region via containerAriaLabel on the ToastProvider. Defaults to 'Notifications'."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <p
              className={`text-sm mb-3 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              The toast container has{" "}
              <code
                className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}
              >
                role=&quot;region&quot;
              </code>{" "}
              with an{" "}
              <code
                className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}
              >
                aria-label
              </code>{" "}
              for screen readers.
            </p>
          </DemoWrapper>
          <CodeBlock
            isDarkMode={isDarkMode}
            code={`<ToastProvider containerAriaLabel="System alerts">
  <App />
</ToastProvider>

// i18n
<ToastProvider containerAriaLabel="Notificaciones del sistema">
  <App />
</ToastProvider>`}
          />
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
            Toast Props (ToastConfig)
          </h3>
          <div className="overflow-x-auto">
            <table
              className={`min-w-full text-sm ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}
            >
              <thead>
                <tr
                  className={`border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
                >
                  <th className="text-left py-3 pr-4 font-semibold">Prop</th>
                  <th className="text-left py-3 pr-4 font-semibold">Type</th>
                  <th className="text-left py-3 pr-4 font-semibold">Default</th>
                  <th className="text-left py-3 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-100"}`}
              >
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">type</td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    "success" | "warning" | "error" | "info"
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    "info"
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Toast variant type determining colors and default icon
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">message</td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    ReactNode
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    -
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Primary toast message (ignored if content is provided)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">
                    description
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    ReactNode
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    -
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Secondary description text (ignored if content is provided)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">content</td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    ReactNode
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    -
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Custom content replacing message/description
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">
                    duration
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    number
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    5000
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Auto-dismiss time in ms (Infinity for persistent)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">
                    showProgress
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    boolean
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    true
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Show progress bar indicating time remaining
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">
                    progressColor
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    string
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    -
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Progress bar color (CSS color value)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">icon</td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    ReactNode
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    Type icon
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Custom icon (overrides type-based default)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">
                    showCloseButton
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    boolean
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    true
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Show close button for manual dismissal
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">
                    pauseOnHover
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    boolean
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    true
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Pause auto-dismiss timer on hover
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">
                    dismissOnEscape
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    boolean
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    false
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Dismiss toast when Escape key is pressed
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">role</td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    "alert" | "status"
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    auto
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    ARIA role override (defaults to "alert" for error/warning,
                    "status" for success/info)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">onClose</td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    () =&gt; void
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    -
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Callback fired when toast is dismissed
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">style</td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    CSSProperties
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    -
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Inline styles for the toast container
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">
                    closeAriaLabel
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    string
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    "Close notification"
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Accessible label for the close button
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3
            className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}
          >
            Styling Props
          </h3>
          <div className="overflow-x-auto">
            <table
              className={`min-w-full text-sm ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}
            >
              <thead>
                <tr
                  className={`border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
                >
                  <th className="text-left py-3 pr-4 font-semibold">Prop</th>
                  <th className="text-left py-3 pr-4 font-semibold">Type</th>
                  <th className="text-left py-3 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-100"}`}
              >
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">
                    className
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    string
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    CSS class for the toast container (overrides default styles)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">
                    contentClassName
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    string
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    CSS class for the content wrapper (icon, text, close button)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">
                    messageClassName
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    string
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    CSS class for the message text element
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">
                    descriptionClassName
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    string
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    CSS class for the description text element
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">
                    progressClassName
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    string
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    CSS class for the progress bar element
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">
                    closeButtonClassName
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    string
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    CSS class for the close button
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">
                    iconClassName
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    string
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    CSS class for the icon wrapper element
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3
            className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}
          >
            ToastProvider Props
          </h3>
          <div className="overflow-x-auto">
            <table
              className={`min-w-full text-sm ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}
            >
              <thead>
                <tr
                  className={`border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
                >
                  <th className="text-left py-3 pr-4 font-semibold">Prop</th>
                  <th className="text-left py-3 pr-4 font-semibold">Type</th>
                  <th className="text-left py-3 pr-4 font-semibold">Default</th>
                  <th className="text-left py-3 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-100"}`}
              >
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">
                    children
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    ReactNode
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    required
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Application content to wrap
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">
                    position
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    ToastPosition
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    "bottom-right"
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Screen position for toast container
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">
                    maxToasts
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    number
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    5
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Maximum visible toasts (older ones auto-dismissed)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">
                    defaultDuration
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    number
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    5000
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Default duration for all toasts (ms)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">gap</td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    number
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    12
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Gap between stacked toasts (px)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">
                    containerClassName
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    string
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    -
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    CSS class for the toast container wrapper
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">zIndex</td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    number
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    9999
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Z-index for the toast portal (for stacking control)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">
                    dismissOnEscape
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    boolean
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    false
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Dismiss all toasts when Escape key is pressed
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">
                    animationDuration
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    number
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    200
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Duration of entry/exit animations in milliseconds
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">
                    containerAriaLabel
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    string
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                  >
                    "Notifications"
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Accessible label for the toast container region
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3
            className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}
          >
            useToast Hook
          </h3>
          <div className="overflow-x-auto">
            <table
              className={`min-w-full text-sm ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}
            >
              <thead>
                <tr
                  className={`border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
                >
                  <th className="text-left py-3 pr-4 font-semibold">Method</th>
                  <th className="text-left py-3 pr-4 font-semibold">
                    Signature
                  </th>
                  <th className="text-left py-3 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-100"}`}
              >
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">toast</td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    (config: ToastConfig | string) =&gt; string
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Create a toast with full config or simple string message
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">success</td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    (message: ReactNode, options?: ToastConfig) =&gt; string
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Create a success toast
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">warning</td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    (message: ReactNode, options?: ToastConfig) =&gt; string
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Create a warning toast
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">error</td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    (message: ReactNode, options?: ToastConfig) =&gt; string
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Create an error toast
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">info</td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    (message: ReactNode, options?: ToastConfig) =&gt; string
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Create an info toast
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">dismiss</td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    (id: string) =&gt; void
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Dismiss a specific toast by ID
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">
                    dismissAll
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    () =&gt; void
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Dismiss all visible toasts
                  </td>
                </tr>
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
            code={`type ToastType = "success" | "warning" | "error" | "info";

type ToastPosition =
  | "top-left"
  | "top-right"
  | "top-center"
  | "bottom-left"
  | "bottom-right"
  | "bottom-center";

interface ToastConfig {
  id?: string;
  type?: ToastType;
  message?: ReactNode;
  description?: ReactNode;
  content?: ReactNode;
  duration?: number;
  showProgress?: boolean;
  progressColor?: string;
  icon?: ReactNode;
  showCloseButton?: boolean;
  onClose?: () => void;
  className?: string;
  style?: CSSProperties;
  contentClassName?: string;
  messageClassName?: string;
  descriptionClassName?: string;
  progressClassName?: string;
  closeButtonClassName?: string;
  iconClassName?: string;
  pauseOnHover?: boolean;
  dismissOnEscape?: boolean;
}

interface ToastProviderProps {
  children: ReactNode;
  position?: ToastPosition;
  maxToasts?: number;
  containerClassName?: string;
  defaultDuration?: number;
  gap?: number;
  zIndex?: number;
  dismissOnEscape?: boolean;
}

interface ToastContextValue {
  toast: (config: ToastConfig | string) => string;
  success: (message: ReactNode, options?: ToastConfig) => string;
  warning: (message: ReactNode, options?: ToastConfig) => string;
  error: (message: ReactNode, options?: ToastConfig) => string;
  info: (message: ReactNode, options?: ToastConfig) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}`}
          />
        </div>

        <div>
          <h3
            className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}
          >
            Data Attributes
          </h3>
          <div className="overflow-x-auto">
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
                  <th className="text-left py-3 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-100"}`}
              >
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">
                    data-toast-id
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Toast container
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Unique ID of the toast
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">
                    data-toast-type
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Toast container
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Type of the toast (success, warning, error, info)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-blue-500">
                    data-paused
                  </td>
                  <td
                    className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Toast container
                  </td>
                  <td
                    className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Present when timer is paused (on hover)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p
            className={`text-sm mt-4 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
          >
            Example CSS selector:{" "}
            <code
              className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}
            >
              [data-toast-type="error"] {"{"} border-color: red; {"}"}
            </code>
          </p>
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
              Toast container has{" "}
              <code
                className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
              >
                role="alert"
              </code>{" "}
              for screen reader announcements
            </li>
            <li>
              Toast region has{" "}
              <code
                className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
              >
                aria-live="polite"
              </code>{" "}
              for non-intrusive updates
            </li>
            <li>
              Toast region labeled with{" "}
              <code
                className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
              >
                aria-label="Notifications"
              </code>
            </li>
            <li>
              Close button has{" "}
              <code
                className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
              >
                aria-label="Close notification"
              </code>
            </li>
            <li>Focus is not forcibly moved to toasts (non-modal behavior)</li>
            <li>Pause on hover allows users time to read content</li>
            <li>
              Respects{" "}
              <code
                className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
              >
                prefers-reduced-motion
              </code>{" "}
              media query for users with vestibular disorders
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
            <li>
              <kbd
                className={`px-2 py-1 rounded text-xs font-mono ${isDarkMode ? "bg-gray-900 border border-gray-600 text-gray-100" : "bg-white border border-gray-300 text-gray-700"}`}
              >
                Tab
              </kbd>{" "}
              - Navigate to close button within toast
            </li>
            <li>
              <kbd
                className={`px-2 py-1 rounded text-xs font-mono ${isDarkMode ? "bg-gray-900 border border-gray-600 text-gray-100" : "bg-white border border-gray-300 text-gray-700"}`}
              >
                Enter
              </kbd>{" "}
              /{" "}
              <kbd
                className={`px-2 py-1 rounded text-xs font-mono ${isDarkMode ? "bg-gray-900 border border-gray-600 text-gray-100" : "bg-white border border-gray-300 text-gray-700"}`}
              >
                Space
              </kbd>{" "}
              - Activate close button when focused
            </li>
            <li>
              <kbd
                className={`px-2 py-1 rounded text-xs font-mono ${isDarkMode ? "bg-gray-900 border border-gray-600 text-gray-100" : "bg-white border border-gray-300 text-gray-700"}`}
              >
                Escape
              </kbd>{" "}
              - Dismiss toast(s) when{" "}
              <code
                className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
              >
                dismissOnEscape
              </code>{" "}
              is enabled
            </li>
          </ul>
        </div>

        <div
          className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-gray-50"}`}
        >
          <h3
            className={`font-semibold mb-3 ${isDarkMode ? "text-white" : "text-gray-800"}`}
          >
            Best Practices
          </h3>
          <ul
            className={`list-disc list-inside space-y-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
          >
            <li>Keep toast messages concise and actionable</li>
            <li>
              Use appropriate toast types to convey meaning (error for failures,
              success for completions)
            </li>
            <li>
              Avoid using toasts for critical information that requires
              acknowledgment (use modals instead)
            </li>
            <li>Provide sufficient duration for users to read content</li>
            <li>
              Use persistent toasts sparingly (only for important, ongoing
              states)
            </li>
            <li>
              Consider using{" "}
              <code
                className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
              >
                pauseOnHover
              </code>{" "}
              to improve readability
            </li>
          </ul>
        </div>
      </div>

      <div
        className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-gray-50 border border-gray-200"}`}
      >
        <p
          className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
        >
          <strong>Note:</strong> The Toast component uses{" "}
          <code
            className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}
          >
            createPortal
          </code>{" "}
          to render toasts outside the normal DOM hierarchy. This ensures toasts
          appear above all other content regardless of z-index stacking in the
          parent application. Customize the portal z-index using the{" "}
          <code
            className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}
          >
            zIndex
          </code>{" "}
          prop on ToastProvider.
        </p>
      </div>
    </div>
  );
};

const ToastDemo = () => {
  const [position, setPosition] = useState<
    | "top-left"
    | "top-right"
    | "top-center"
    | "bottom-left"
    | "bottom-right"
    | "bottom-center"
  >("bottom-right");

  return (
    <ToastProvider key={position} position={position} maxToasts={5}>
      <ToastDemoContent position={position} setPosition={setPosition} />
    </ToastProvider>
  );
};

export default ToastDemo;
