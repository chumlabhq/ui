import { useState } from "react";
import { Button } from "../../components/Button";
import { ToastProvider, useToast } from "../../components/Toast";
import { Section, ComponentHeader } from "./components";

const ToastDemoContent = ({
  position,
  setPosition,
}: {
  position: "top-left" | "top-right" | "top-center" | "bottom-left" | "bottom-right" | "bottom-center";
  setPosition: (pos: "top-left" | "top-right" | "top-center" | "bottom-left" | "bottom-right" | "bottom-center") => void;
}) => {
  const toast = useToast();

  const buttonStyles =
    "cursor-pointer px-4 py-2 rounded-lg font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2";
  const successStyles = `${buttonStyles} bg-emerald-500 text-white hover:bg-emerald-600 focus-visible:ring-emerald-500`;
  const warningStyles = `${buttonStyles} bg-amber-500 text-white hover:bg-amber-600 focus-visible:ring-amber-500`;
  const errorStyles = `${buttonStyles} bg-rose-500 text-white hover:bg-rose-600 focus-visible:ring-rose-500`;
  const infoStyles = `${buttonStyles} bg-blue-500 text-white hover:bg-blue-600 focus-visible:ring-blue-500`;
  const secondaryStyles = `${buttonStyles} bg-slate-100 text-slate-700 hover:bg-slate-200 focus-visible:ring-slate-400`;
  const outlineStyles = `${buttonStyles} border border-slate-300 text-slate-600 hover:bg-slate-50 focus-visible:ring-slate-400`;

  return (
    <>
      <ComponentHeader
        title="Toast"
        description="A customizable notification system for displaying brief messages to users."
      />

      <Section title="Basic Variants">
        <Button
          className={successStyles}
          onClick={() => toast.success("Operation completed successfully!")}
        >
          Success
        </Button>
        <Button
          className={warningStyles}
          onClick={() => toast.warning("Please review before proceeding.")}
        >
          Warning
        </Button>
        <Button
          className={errorStyles}
          onClick={() => toast.error("Something went wrong. Please try again.")}
        >
          Error
        </Button>
        <Button
          className={infoStyles}
          onClick={() => toast.info("Here's some useful information.")}
        >
          Info
        </Button>
      </Section>

      <Section title="With Description">
        <Button
          className={successStyles}
          onClick={() =>
            toast.success("File uploaded", {
              description: "Your file has been successfully uploaded to the server.",
            })
          }
        >
          Success with Description
        </Button>
        <Button
          className={errorStyles}
          onClick={() =>
            toast.error("Upload failed", {
              description: "The file size exceeds the maximum limit of 10MB.",
            })
          }
        >
          Error with Description
        </Button>
      </Section>

      <Section title="Duration">
        <Button
          className={infoStyles}
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
          className={infoStyles}
          onClick={() =>
            toast.info("Standard notification", {
              duration: 5000,
              description: "Disappears in 5 seconds (default)",
            })
          }
        >
          5 Seconds
        </Button>
        <Button
          className={infoStyles}
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
          className={secondaryStyles}
          onClick={() =>
            toast.info("Persistent notification", {
              duration: Infinity,
              description: "Stays until manually closed",
            })
          }
        >
          Persistent
        </Button>
      </Section>

      <Section title="Progress Bar">
        <Button
          className={infoStyles}
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
          className={secondaryStyles}
          onClick={() =>
            toast.info("No progress indicator", {
              showProgress: false,
              description: "Clean toast without progress bar",
            })
          }
        >
          Without Progress
        </Button>
      </Section>

      <Section title="Custom Progress Color">
        <Button
          className={secondaryStyles}
          onClick={() =>
            toast.toast({
              type: "info",
              message: "Custom progress color",
              description: "Using progressColor prop",
              progressColor: "bg-purple-400",
            })
          }
        >
          Purple Progress
        </Button>
        <Button
          className={secondaryStyles}
          onClick={() =>
            toast.toast({
              type: "info",
              message: "Gradient progress",
              description: "Using progressClassName prop",
              progressClassName: "bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400",
            })
          }
        >
          Gradient Progress
        </Button>
      </Section>

      <Section title="Close Button">
        <Button
          className={infoStyles}
          onClick={() =>
            toast.info("With close button", {
              showCloseButton: true,
              description: "Click X to dismiss (default)",
            })
          }
        >
          With Close Button
        </Button>
        <Button
          className={secondaryStyles}
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
      </Section>

      <Section title="Pause on Hover">
        <Button
          className={infoStyles}
          onClick={() =>
            toast.info("Hover to pause", {
              duration: 5000,
              description: "Timer pauses when hovered (default)",
              pauseOnHover: true,
            })
          }
        >
          Pause on Hover
        </Button>
        <Button
          className={secondaryStyles}
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
      </Section>

      <Section title="Custom Icon">
        <Button
          className={infoStyles}
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
          className={successStyles}
          onClick={() =>
            toast.success("Celebration!", {
              icon: <span className="text-xl">🎉</span>,
            })
          }
        >
          Party Icon
        </Button>
        <Button
          className={warningStyles}
          onClick={() =>
            toast.warning("Heads up!", {
              icon: <span className="text-xl">👀</span>,
            })
          }
        >
          Eyes Icon
        </Button>
      </Section>

      <Section title="Custom Content (HTML)">
        <Button
          className={infoStyles}
          onClick={() =>
            toast.toast({
              type: "info",
              content: (
                <div className="flex flex-col gap-2">
                  <p className="font-bold text-base">New Update Available</p>
                  <p className="text-sm opacity-80">Version 2.0 is now available.</p>
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
          className={successStyles}
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
                    <p className="text-sm opacity-80">You've completed 100 tasks</p>
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
          className={secondaryStyles}
          onClick={() =>
            toast.toast({
              type: "info",
              content: (
                <div>
                  <p className="font-medium">Download Progress</p>
                  <div className="mt-2 h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-white w-3/4 animate-pulse" />
                  </div>
                  <p className="text-xs mt-1 opacity-70">75% complete</p>
                </div>
              ),
              duration: 8000,
              showProgress: false,
            })
          }
        >
          Progress Content
        </Button>
      </Section>

      <Section title="Custom Styling">
        <Button
          className={secondaryStyles}
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
          className={secondaryStyles}
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
          className={secondaryStyles}
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
          className={secondaryStyles}
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
      </Section>

      <Section title="Callback">
        <Button
          className={infoStyles}
          onClick={() =>
            toast.info("Toast with callback", {
              description: "Check console when this closes",
              onClose: () => console.log("Toast was closed!"),
            })
          }
        >
          With onClose Callback
        </Button>
      </Section>

      <Section title="Multiple Toasts">
        <Button
          className={infoStyles}
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
          className={secondaryStyles}
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
          Trigger 10 Toasts (Max 5)
        </Button>
      </Section>

      <Section title="Dismiss">
        <Button
          className={errorStyles}
          onClick={() => toast.dismissAll()}
        >
          Dismiss All
        </Button>
        <Button
          className={outlineStyles}
          onClick={() => {
            toast.info("Persistent toast", {
              duration: Infinity,
              description: "This toast stays until you close it manually",
            });
          }}
        >
          Create Persistent Toast
        </Button>
      </Section>

      <Section title="Position">
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
              className={position === pos ? infoStyles : outlineStyles}
              onClick={() => setPosition(pos)}
            >
              {pos}
            </Button>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Current position: <strong>{position}</strong>
        </p>
      </Section>

      <Section title="Toast Props">
        <div className="overflow-x-auto w-full">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-900">Prop</th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">Type</th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">Default</th>
                <th className="text-left py-2 font-medium text-gray-900">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">type</td>
                <td className="py-2 pr-4 text-gray-600">"success" | "warning" | "error" | "info"</td>
                <td className="py-2 pr-4 text-gray-500">"info"</td>
                <td className="py-2 text-gray-600">Toast variant type</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">message</td>
                <td className="py-2 pr-4 text-gray-600">ReactNode</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">Main toast message</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">description</td>
                <td className="py-2 pr-4 text-gray-600">ReactNode</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">Secondary description text</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">content</td>
                <td className="py-2 pr-4 text-gray-600">ReactNode</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">Custom HTML content (replaces message/description)</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">duration</td>
                <td className="py-2 pr-4 text-gray-600">number</td>
                <td className="py-2 pr-4 text-gray-500">5000</td>
                <td className="py-2 text-gray-600">Auto-dismiss duration in ms (Infinity for persistent)</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">showProgress</td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">true</td>
                <td className="py-2 text-gray-600">Show progress bar timer</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">progressColor</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">"bg-white/40"</td>
                <td className="py-2 text-gray-600">Progress bar background color class</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">icon</td>
                <td className="py-2 pr-4 text-gray-600">ReactNode</td>
                <td className="py-2 pr-4 text-gray-500">Type-based icon</td>
                <td className="py-2 text-gray-600">Custom icon (overrides default)</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">showCloseButton</td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">true</td>
                <td className="py-2 text-gray-600">Show close button</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">pauseOnHover</td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">true</td>
                <td className="py-2 text-gray-600">Pause timer when hovering</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">onClose</td>
                <td className="py-2 pr-4 text-gray-600">() =&gt; void</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">Callback when toast closes</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Styling Props">
        <div className="overflow-x-auto w-full">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-900">Prop</th>
                <th className="text-left py-2 font-medium text-gray-900">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">className</td>
                <td className="py-2 text-gray-600">Toast container class</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">contentClassName</td>
                <td className="py-2 text-gray-600">Content wrapper class</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">messageClassName</td>
                <td className="py-2 text-gray-600">Message text class</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">descriptionClassName</td>
                <td className="py-2 text-gray-600">Description text class</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">progressClassName</td>
                <td className="py-2 text-gray-600">Progress bar class</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">closeButtonClassName</td>
                <td className="py-2 text-gray-600">Close button class</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">iconClassName</td>
                <td className="py-2 text-gray-600">Icon wrapper class</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="ToastProvider Props">
        <div className="overflow-x-auto w-full">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-900">Prop</th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">Type</th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">Default</th>
                <th className="text-left py-2 font-medium text-gray-900">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">position</td>
                <td className="py-2 pr-4 text-gray-600">ToastPosition</td>
                <td className="py-2 pr-4 text-gray-500">"bottom-right"</td>
                <td className="py-2 text-gray-600">Position of toast container</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">maxToasts</td>
                <td className="py-2 pr-4 text-gray-600">number</td>
                <td className="py-2 pr-4 text-gray-500">5</td>
                <td className="py-2 text-gray-600">Maximum visible toasts</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">defaultDuration</td>
                <td className="py-2 pr-4 text-gray-600">number</td>
                <td className="py-2 pr-4 text-gray-500">5000</td>
                <td className="py-2 text-gray-600">Default duration for all toasts</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">gap</td>
                <td className="py-2 pr-4 text-gray-600">number</td>
                <td className="py-2 pr-4 text-gray-500">12</td>
                <td className="py-2 text-gray-600">Gap between stacked toasts (px)</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">containerClassName</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">""</td>
                <td className="py-2 text-gray-600">Toast container class</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="useToast Hook">
        <div className="overflow-x-auto w-full">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-900">Method</th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">Signature</th>
                <th className="text-left py-2 font-medium text-gray-900">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">toast</td>
                <td className="py-2 pr-4 text-gray-600">(config | string) =&gt; string</td>
                <td className="py-2 text-gray-600">Create toast with full config</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">success</td>
                <td className="py-2 pr-4 text-gray-600">(message, options?) =&gt; string</td>
                <td className="py-2 text-gray-600">Create success toast</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">warning</td>
                <td className="py-2 pr-4 text-gray-600">(message, options?) =&gt; string</td>
                <td className="py-2 text-gray-600">Create warning toast</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">error</td>
                <td className="py-2 pr-4 text-gray-600">(message, options?) =&gt; string</td>
                <td className="py-2 text-gray-600">Create error toast</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">info</td>
                <td className="py-2 pr-4 text-gray-600">(message, options?) =&gt; string</td>
                <td className="py-2 text-gray-600">Create info toast</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">dismiss</td>
                <td className="py-2 pr-4 text-gray-600">(id: string) =&gt; void</td>
                <td className="py-2 text-gray-600">Dismiss specific toast</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">dismissAll</td>
                <td className="py-2 pr-4 text-gray-600">() =&gt; void</td>
                <td className="py-2 text-gray-600">Dismiss all toasts</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>
    </>
  );
};

const ToastDemo = () => {
  const [position, setPosition] = useState<
    "top-left" | "top-right" | "top-center" | "bottom-left" | "bottom-right" | "bottom-center"
  >("bottom-right");

  return (
    <ToastProvider key={position} position={position} maxToasts={5}>
      <ToastDemoContent position={position} setPosition={setPosition} />
    </ToastProvider>
  );
};

export default ToastDemo;
