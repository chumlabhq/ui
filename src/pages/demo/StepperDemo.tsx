import { useState, useRef } from "react";
import { Stepper } from "../../components/Stepper";
import type {
  Step,
  StepStatus,
  StepTooltipConfig,
} from "../../components/Stepper";
import {
  Section,
  DemoWrapper,
  CodeBlock,
  PropsTable,
  PropRow,
  DocControlledPattern,
  DocEdgeCases,
  DocDoDont,
} from "./components";
import { useTheme } from "./ThemeContext";

// ─── Icons ───────────────────────────────────────────────────────────────────

const UserIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path
      fillRule="evenodd"
      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
      clipRule="evenodd"
    />
  </svg>
);

const CreditCardIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
    <path
      fillRule="evenodd"
      d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
      clipRule="evenodd"
    />
  </svg>
);

const TruckIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
  </svg>
);

const CheckCircleIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      clipRule="evenodd"
    />
  </svg>
);

const StarIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const WarningIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path
      fillRule="evenodd"
      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
      clipRule="evenodd"
    />
  </svg>
);

const ThumbsUpIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
  </svg>
);

// ─── Step Data ───────────────────────────────────────────────────────────────

const basicSteps: Step[] = [
  { id: 1, label: "Step 1" },
  { id: 2, label: "Step 2" },
  { id: 3, label: "Step 3" },
  { id: 4, label: "Step 4" },
];

const checkoutSteps: Step[] = [
  {
    id: "account",
    label: "Account",
    description: "Create your account",
    icon: UserIcon,
  },
  {
    id: "payment",
    label: "Payment",
    description: "Add payment method",
    icon: CreditCardIcon,
  },
  {
    id: "shipping",
    label: "Shipping",
    description: "Set delivery address",
    icon: TruckIcon,
  },
  {
    id: "confirm",
    label: "Confirm",
    description: "Review your order",
    icon: CheckCircleIcon,
  },
];

const tooltipSteps: Step[] = [
  { id: 1, label: "Step 1", tooltip: "This is the first step" },
  { id: 2, label: "Step 2", tooltip: "Complete the second step here" },
  { id: 3, label: "Step 3", tooltip: "Almost done!" },
  { id: 4, label: "Step 4", tooltip: "Final step - you're done!" },
];

const tooltipConfigSteps: Step[] = [
  {
    id: 1,
    label: "Info",
    tooltip: {
      content: "Hover for more details about this step",
      side: "bottom",
      showArrow: true,
    } as StepTooltipConfig,
  },
  {
    id: 2,
    label: "Settings",
    tooltip: {
      content: (
        <div className="space-y-1">
          <div className="font-semibold">Configure Settings</div>
          <div className="text-gray-500 text-xs">
            Customize your preferences here
          </div>
        </div>
      ),
      maxWidth: 200,
    } as StepTooltipConfig,
  },
  {
    id: 3,
    label: "Review",
    tooltip: {
      content: "Review all your changes before proceeding",
      side: "top",
      shadow: "xl",
    } as StepTooltipConfig,
  },
];

const perStepIconSteps: Step[] = [
  { id: 1, label: "Upload", completedIcon: ThumbsUpIcon },
  { id: 2, label: "Validate", errorIcon: WarningIcon },
  { id: 3, label: "Publish" },
];

// ─── Themed Classes ──────────────────────────────────────────────────────────

const getClasses = (dark: boolean) => ({
  stepper: dark
    ? {
        stepInteractive:
          "cursor-pointer rounded-lg px-2 py-1.5 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900",
        indicatorPending: "bg-gray-700 text-gray-300",
        labelActive: "text-blue-400",
        labelCompleted: "text-green-400",
        labelPending: "text-gray-400",
        labelError: "text-red-400",
        descriptionActive: "text-blue-300",
        descriptionCompleted: "text-green-300",
        descriptionPending: "text-gray-500",
        descriptionError: "text-red-300",
        connectorHorizontal: "w-full h-0.5 bg-gray-700",
        connectorVertical: "w-0.5 h-6 bg-gray-700",
      }
    : {},
  card: `rounded-2xl border p-5 ${dark ? "border-white/[0.06] bg-linear-to-br from-white/[0.03] to-white/[0.01]" : "border-gray-200 bg-white shadow-sm shadow-gray-900/[0.04]"}`,
  kbd: `px-2 py-1 rounded-md text-[11px] font-mono min-w-[2.5rem] text-center font-medium ${dark ? "bg-gray-900 border border-white/10 text-gray-300 shadow-sm" : "bg-white border border-gray-200 text-gray-600 shadow-sm"}`,
  label: `text-xs font-medium ${dark ? "text-gray-500" : "text-gray-400"}`,
  note: `mt-3 p-3 rounded-lg text-xs ${dark ? "bg-blue-900/20 border border-blue-800/50 text-blue-300" : "bg-blue-50 border border-blue-200 text-blue-700"}`,
  btn: `px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${dark ? "bg-gray-700 text-gray-200 hover:bg-gray-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
  btnPrimary: `px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${dark ? "bg-indigo-500 text-white hover:bg-indigo-600" : "bg-indigo-600 text-white hover:bg-indigo-700"}`,
});

// ─── Demo ────────────────────────────────────────────────────────────────────

const StepperDemo = () => {
  const { isDarkMode: dark } = useTheme();
  const c = getClasses(dark);

  const [basicStep, setBasicStep] = useState<number>(2);
  const [checkoutStep, setCheckoutStep] = useState<string>("payment");
  const [verticalStep, setVerticalStep] = useState<number>(2);
  const [dotStep, setDotStep] = useState<number>(3);
  const [errorStep, setErrorStep] = useState<number>(2);
  const [customStep, setCustomStep] = useState<number>(2);
  const [tooltipStep, setTooltipStep] = useState<number>(2);
  const [tooltipConfigStep, setTooltipConfigStep] = useState<number>(2);
  const [customIconStep, setCustomIconStep] = useState<number>(2);
  const [perStepIconStep, setPerStepIconStep] = useState<number>(2);
  const [loopStep, setLoopStep] = useState<number>(2);
  const [autoStep, setAutoStep] = useState<number>(2);
  const [preventStep, setPreventStep] = useState<number>(1);
  const stepperRef = useRef<HTMLDivElement>(null);

  const errorGetStatus = (
    _stepId: string | number,
    index: number,
    activeIndex: number,
  ): StepStatus => {
    if (index === 1) return "error";
    if (index < activeIndex) return "completed";
    if (index === activeIndex) return "active";
    return "pending";
  };

  const perStepErrorGetStatus = (
    _stepId: string | number,
    index: number,
    activeIndex: number,
  ): StepStatus => {
    if (index === 1) return "error";
    if (index < activeIndex) return "completed";
    if (index === activeIndex) return "active";
    return "pending";
  };

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
            Stepper
          </h1>
          <p
            className={`text-sm leading-relaxed max-w-2xl ${dark ? "text-gray-400" : "text-gray-600"}`}
          >
            A navigation component that displays progress through a sequence of
            steps. Uses semantic {"<ol>/<li>"} markup with proper ARIA
            attributes, conditional role=&quot;button&quot; only on interactive
            steps, and focus-visible ring for keyboard accessibility.
          </p>
          <div className="mt-5">
            <CodeBlock
              isDarkMode={dark}
              code={`import { Stepper } from "@kern-ui/stepper";`}
            />
          </div>
        </div>
      </header>

      {/* ─── Basic ────────────────────────────────────────────────────── */}
      <Section
        title="Basic Stepper"
        description="Default numbered variant with horizontal layout. Click a step or use the buttons to navigate."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full space-y-4">
            <Stepper
              steps={basicSteps}
              value={basicStep}
              onValueChange={(id) => setBasicStep(id as number)}
              isStepClickable={() => true}
              classes={c.stepper}
            />
            <div className="flex gap-2">
              <button
                onClick={() => setBasicStep(Math.max(1, basicStep - 1))}
                className={c.btn}
              >
                Previous
              </button>
              <button
                onClick={() => setBasicStep(Math.min(4, basicStep + 1))}
                className={c.btnPrimary}
              >
                Next
              </button>
            </div>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Uncontrolled ─────────────────────────────────────────────── */}
      <Section
        title="Uncontrolled Usage"
        description="Use defaultValue instead of value for uncontrolled mode. The component manages its own active step state internally."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <Stepper
            steps={basicSteps}
            defaultValue={2}
            onValueChange={(id) => console.log("Step changed:", id)}
            isStepClickable={() => true}
            classes={c.stepper}
          />
        </DemoWrapper>
      </Section>

      {/* ─── Icon Variant ─────────────────────────────────────────────── */}
      <Section
        title="Icon Variant with Descriptions"
        description="Use variant='icon' with showDescriptions and labelPosition='bottom' for a rich checkout-style stepper with horizontal connectors."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <Stepper
            steps={checkoutSteps}
            value={checkoutStep}
            onValueChange={(id) => setCheckoutStep(id as string)}
            variant="icon"
            showDescriptions
            showConnectors
            labelPosition="bottom"
            fullWidth
            isStepClickable={() => true}
            classes={{
              ...c.stepper,
              label: "text-sm font-medium leading-tight mt-1 transition-colors",
            }}
          />
        </DemoWrapper>
      </Section>

      {/* ─── Vertical ─────────────────────────────────────────────────── */}
      <Section
        title="Vertical Stepper"
        description="Set orientation='vertical' for a top-to-bottom step layout."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <Stepper
            steps={basicSteps}
            value={verticalStep}
            onValueChange={(id) => setVerticalStep(id as number)}
            orientation="vertical"
            isStepClickable={() => true}
            classes={c.stepper}
          />
        </DemoWrapper>
      </Section>

      {/* ─── Dot Variant ──────────────────────────────────────────────── */}
      <Section
        title="Dot Variant"
        description="Minimal dot indicators — ideal for carousels or wizards. Labels are hidden, aria-label is auto-generated for each step."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <Stepper
            steps={basicSteps}
            value={dotStep}
            onValueChange={(id) => setDotStep(id as number)}
            variant="dot"
            showLabels={false}
            isStepClickable={() => true}
            classes={{
              ...c.stepper,
              list: "flex items-center justify-center list-none m-0 p-0",
            }}
          />
        </DemoWrapper>
      </Section>

      {/* ─── Hidden Connectors ────────────────────────────────────────── */}
      <Section
        title="Hidden Connectors"
        description="Set showConnectors={false} to remove the connecting lines between steps."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <Stepper
            steps={basicSteps}
            value={2}
            onValueChange={() => {}}
            showConnectors={false}
            classes={{
              ...c.stepper,
              list: "flex items-center gap-4",
            }}
          />
        </DemoWrapper>
      </Section>

      {/* ─── Error State ──────────────────────────────────────────────── */}
      <Section
        title="Error State"
        description="Use getStepStatus to override the default linear status calculation — here step 2 is always 'error'."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <Stepper
            steps={[
              { id: 1, label: "Account" },
              { id: 2, label: "Verification" },
              { id: 3, label: "Complete" },
            ]}
            value={errorStep}
            onValueChange={(id) => setErrorStep(id as number)}
            getStepStatus={errorGetStatus}
            isStepClickable={() => true}
            classes={c.stepper}
          />
        </DemoWrapper>
      </Section>

      {/* ─── Disabled Steps ───────────────────────────────────────────── */}
      <Section
        title="Disabled Steps"
        description="Individual steps can be disabled via the step object's disabled property. Disabled steps are not interactive even when isStepClickable returns true."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <Stepper
            steps={[
              { id: 1, label: "Step 1" },
              { id: 2, label: "Step 2" },
              { id: 3, label: "Step 3", disabled: true },
              { id: 4, label: "Step 4" },
            ]}
            value={2}
            onValueChange={() => {}}
            isStepClickable={() => true}
            classes={c.stepper}
          />
        </DemoWrapper>
      </Section>

      {/* ─── Globally Disabled ────────────────────────────────────────── */}
      <Section
        title="Globally Disabled"
        description="Set disabled on the root component to disable all steps regardless of their individual disabled state."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full space-y-2">
            <Stepper
              steps={basicSteps}
              value={2}
              disabled
              classes={c.stepper}
            />
            <p
              className={`text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
            >
              All steps are non-interactive when the stepper is globally
              disabled
            </p>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Non-linear Navigation ────────────────────────────────────── */}
      <Section
        title="Non-linear Navigation"
        description="Set isStepClickable={() => true} to allow clicking any step regardless of its status."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full space-y-2">
            <Stepper
              steps={basicSteps}
              value={2}
              onValueChange={() => {}}
              isStepClickable={() => true}
              classes={c.stepper}
            />
            <p
              className={`text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
            >
              All steps are clickable regardless of status
            </p>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Step Change Prevention ───────────────────────────────────── */}
      <Section
        title="Step Change Prevention"
        description="Use beforeStepChange to validate or prevent step transitions. Return false to block the change. Here, steps can only advance one at a time."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full space-y-3">
            <Stepper
              steps={basicSteps}
              value={preventStep}
              onValueChange={(id) => setPreventStep(id as number)}
              beforeStepChange={(nextId) => {
                const nextIndex = basicSteps.findIndex((s) => s.id === nextId);
                const currentIndex = basicSteps.findIndex(
                  (s) => s.id === preventStep,
                );
                return nextIndex <= currentIndex + 1;
              }}
              isStepClickable={() => true}
              classes={c.stepper}
            />
            <p
              className={`text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
            >
              Click any step &mdash; cannot skip ahead more than one step at a
              time
            </p>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Keyboard Navigation with Loop ────────────────────────────── */}
      <Section
        title="Keyboard Navigation with Loop"
        description="Arrow keys move focus between interactive steps. Home/End jump to first/last. Set loop to wrap around at boundaries."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full space-y-3">
            <Stepper
              steps={basicSteps}
              value={loopStep}
              onValueChange={(id) => setLoopStep(id as number)}
              loop
              isStepClickable={() => true}
              classes={c.stepper}
            />
            <p
              className={`text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
            >
              Use <kbd className={c.kbd}>{"\u2190"}</kbd>{" "}
              <kbd className={c.kbd}>{"\u2192"}</kbd> to move focus,{" "}
              <kbd className={c.kbd}>Enter</kbd> /{" "}
              <kbd className={c.kbd}>Space</kbd> to activate. Focus loops from
              last to first and first to last.
            </p>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Automatic Activation Mode ────────────────────────────────── */}
      <Section
        title="Automatic Activation Mode"
        description="Set activationMode='automatic' so arrow keys activate steps immediately as focus moves, matching TabPanel's automatic mode."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full space-y-3">
            <Stepper
              steps={basicSteps}
              value={autoStep}
              onValueChange={(id) => setAutoStep(id as number)}
              activationMode="automatic"
              loop
              isStepClickable={() => true}
              classes={c.stepper}
            />
            <p
              className={`text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
            >
              Arrow keys move focus and activate the step in one action
            </p>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Custom Completed & Error Icons ───────────────────────────── */}
      <Section
        title="Custom Completed & Error Icons"
        description="Override the default CheckIcon and ErrorIcon globally via completedIcon and errorIcon props."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <Stepper
            steps={[
              { id: 1, label: "Upload" },
              { id: 2, label: "Validate" },
              { id: 3, label: "Publish" },
            ]}
            value={customIconStep}
            onValueChange={(id) => setCustomIconStep(id as number)}
            completedIcon={StarIcon}
            errorIcon={WarningIcon}
            getStepStatus={errorGetStatus}
            isStepClickable={() => true}
            classes={c.stepper}
          />
        </DemoWrapper>
      </Section>

      {/* ─── Per-Step Icon Overrides ──────────────────────────────────── */}
      <Section
        title="Per-Step Icon Overrides"
        description="Each step can override the global completedIcon and errorIcon via step.completedIcon and step.errorIcon."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <Stepper
            steps={perStepIconSteps}
            value={perStepIconStep}
            onValueChange={(id) => setPerStepIconStep(id as number)}
            getStepStatus={perStepErrorGetStatus}
            isStepClickable={() => true}
            classes={c.stepper}
          />
        </DemoWrapper>
      </Section>

      {/* ─── Custom Styling ───────────────────────────────────────────── */}
      <Section
        title="Custom Styling"
        description="Full visual customization via the classes prop. Each slot replaces the default — no class merging conflicts."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <Stepper
            steps={[
              { id: 1, label: "Design" },
              { id: 2, label: "Develop" },
              { id: 3, label: "Deploy" },
            ]}
            value={customStep}
            onValueChange={(id) => setCustomStep(id as number)}
            isStepClickable={() => true}
            classes={{
              ...c.stepper,
              step: `flex items-center gap-2 px-3 py-2 rounded-2xl border-2 border-transparent transition-all ${
                dark ? "hover:border-purple-400/30" : "hover:border-purple-200"
              }`,
              stepInteractive:
                "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2",
              indicator: `shrink-0 rounded-xl flex items-center justify-center shadow-lg ${
                dark
                  ? "bg-purple-500 text-white shadow-purple-500/20"
                  : "bg-purple-600 text-white shadow-purple-200"
              }`,
              indicatorActive: "",
              indicatorCompleted: "",
              indicatorPending: "",
              indicatorIcon: "w-5 h-5",
              label: `text-sm font-semibold ${
                dark ? "text-purple-300" : "text-purple-700"
              }`,
              labelActive: "",
              labelCompleted: "",
              labelPending: "",
              connectorHorizontal: `w-full h-1 rounded-full ${
                dark ? "bg-purple-400/30" : "bg-purple-200"
              }`,
            }}
          />
        </DemoWrapper>
      </Section>

      {/* ─── Full Width ───────────────────────────────────────────────── */}
      <Section
        title="Full Width"
        description="Set fullWidth to make the stepper expand to fill its container."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <Stepper
            steps={basicSteps}
            value={2}
            onValueChange={() => {}}
            fullWidth
            classes={c.stepper}
          />
        </DemoWrapper>
      </Section>

      {/* ─── Custom ID ────────────────────────────────────────────────── */}
      <Section
        title="Custom ID"
        description="Use the id prop for deterministic IDs useful for SSR and testing. Auto-generated via useId() if not provided."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full space-y-2">
            <Stepper
              id="checkout-stepper"
              steps={basicSteps}
              value={2}
              onValueChange={() => {}}
              classes={c.stepper}
            />
            <p
              className={`text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
            >
              Root element has{" "}
              <code
                className={`px-1 rounded text-xs font-mono ${dark ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}
              >
                id=&quot;checkout-stepper&quot;
              </code>
            </p>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Ref Forwarding ───────────────────────────────────────────── */}
      <Section
        title="Ref Forwarding"
        description="Use ref to access the root DOM element for programmatic scroll, measurement, or focus management."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full space-y-4">
            <Stepper
              ref={stepperRef}
              steps={basicSteps}
              value={2}
              onValueChange={() => {}}
              classes={c.stepper}
            />
            <button
              onClick={() =>
                stepperRef.current?.scrollIntoView({ behavior: "smooth" })
              }
              className={c.btn}
            >
              Scroll to Stepper
            </button>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Custom Aria Label ────────────────────────────────────────── */}
      <Section
        title="Custom Aria Label"
        description="Use aria-label to provide a meaningful accessible name for the navigation landmark."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full space-y-2">
            <Stepper
              steps={basicSteps}
              value={2}
              onValueChange={() => {}}
              aria-label="Checkout Progress"
              classes={c.stepper}
            />
            <p
              className={`text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
            >
              The navigation landmark has{" "}
              <code
                className={`px-1 rounded text-xs font-mono ${dark ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}
              >
                aria-label=&quot;Checkout Progress&quot;
              </code>
            </p>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── With Tooltips (Simple) ───────────────────────────────────── */}
      <Section
        title="With Tooltips (Simple)"
        description="Enable showTooltips and add a tooltip string to each step for hover-activated tooltips."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full space-y-3">
            <Stepper
              steps={tooltipSteps}
              value={tooltipStep}
              onValueChange={(id) => setTooltipStep(id as number)}
              showTooltips
              tooltipDefaults={{ side: "top", delayDuration: 100 }}
              isStepClickable={() => true}
              classes={c.stepper}
            />
            <p
              className={`text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
            >
              Hover over each step to see the tooltip
            </p>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── With Tooltips (Custom Config) ────────────────────────────── */}
      <Section
        title="With Tooltips (Custom Config)"
        description="Each step can have a StepTooltipConfig object for per-step tooltip customization including position, JSX content, max width, and shadow."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full space-y-3">
            <Stepper
              steps={tooltipConfigSteps}
              value={tooltipConfigStep}
              onValueChange={(id) => setTooltipConfigStep(id as number)}
              showTooltips
              isStepClickable={() => true}
              classes={{
                ...c.stepper,
                indicator: `shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold border-2 border-transparent transition-colors ${
                  dark
                    ? "data-[status=active]:bg-purple-500 data-[status=active]:text-white data-[status=active]:border-purple-500 data-[status=completed]:bg-green-500 data-[status=completed]:text-white data-[status=completed]:border-green-500 data-[status=pending]:bg-gray-800 data-[status=pending]:text-gray-400 data-[status=pending]:border-gray-600"
                    : "data-[status=active]:bg-purple-600 data-[status=active]:text-white data-[status=active]:border-purple-600 data-[status=completed]:bg-green-500 data-[status=completed]:text-white data-[status=completed]:border-green-500 data-[status=pending]:bg-white data-[status=pending]:text-gray-400 data-[status=pending]:border-gray-300"
                }`,
                indicatorActive: "",
                indicatorCompleted: "",
                indicatorPending: "",
                indicatorIcon: "w-5 h-5",
                connectorHorizontal: `w-full h-0.5 rounded-full ${
                  dark ? "bg-gray-700" : "bg-gray-200"
                }`,
              }}
            />
            <p
              className={`text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
            >
              Uses{" "}
              <code
                className={`px-1 rounded text-xs font-mono ${dark ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}
              >
                data-[status]
              </code>{" "}
              selectors for per-status styling
            </p>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Unstyled Mode ─────────────────────────────────────────────── */}
      <Section
        title="Unstyled Mode"
        description="Set unstyled to strip all default classes. Build from scratch using the classes prop."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <Stepper
            steps={basicSteps}
            value={2}
            onValueChange={() => {}}
            isStepClickable={() => true}
            unstyled
            classes={{
              list: "flex items-center gap-0 list-none m-0 p-0",
              step: `flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition-all ${dark ? "border-gray-700" : "border-gray-200"}`,
              stepInteractive: `cursor-pointer ${dark ? "hover:border-indigo-400/50" : "hover:border-indigo-300"}`,
              indicator: `shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${dark ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-600"}`,
              indicatorActive: dark
                ? "bg-indigo-500 text-white"
                : "bg-indigo-600 text-white",
              indicatorCompleted: dark
                ? "bg-emerald-500 text-white"
                : "bg-emerald-600 text-white",
              label: `text-sm font-medium ${dark ? "text-gray-300" : "text-gray-700"}`,
              labelActive: dark ? "text-indigo-400" : "text-indigo-600",
              labelCompleted: dark ? "text-emerald-400" : "text-emerald-600",
              connectorHorizontal: `w-6 h-0.5 ${dark ? "bg-gray-700" : "bg-gray-200"}`,
            }}
          />
        </DemoWrapper>
      </Section>

      {/* ─── Render Step ────────────────────────────────────────────────── */}
      <Section
        title="Custom Step Rendering"
        description="Use renderStep for fully custom step rendering. You receive the render props and the default element."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <Stepper
            steps={basicSteps}
            value={2}
            onValueChange={() => {}}
            isStepClickable={() => true}
            classes={c.stepper}
            renderStep={(props, defaultElement) => {
              if (props.status === "active") {
                return (
                  <li
                    key={props.step.id}
                    className="shrink-0"
                    data-status={props.status}
                  >
                    <div
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl ${
                        dark
                          ? "bg-indigo-500/20 border border-indigo-400/30"
                          : "bg-indigo-50 border border-indigo-200"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          dark
                            ? "bg-indigo-500 text-white"
                            : "bg-indigo-600 text-white"
                        }`}
                      >
                        {props.index + 1}
                      </div>
                      <span
                        className={`text-sm font-semibold ${
                          dark ? "text-indigo-300" : "text-indigo-700"
                        }`}
                      >
                        {typeof props.step.label === "string"
                          ? props.step.label
                          : `Step ${props.index + 1}`}
                      </span>
                    </div>
                  </li>
                );
              }
              return defaultElement;
            }}
          />
        </DemoWrapper>
      </Section>

      {/* ─── Props Tables ─────────────────────────────────────────────── */}
      <Section title="Stepper Props" isDarkMode={dark}>
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow
              name="steps"
              type="Step[]"
              defaultVal="[]"
              description="Array of step objects"
              isDarkMode={dark}
            />
            <PropRow
              name="value"
              type="string | number"
              description="Currently active step ID (controlled)"
              isDarkMode={dark}
            />
            <PropRow
              name="defaultValue"
              type="string | number"
              description="Initial step ID for uncontrolled usage"
              isDarkMode={dark}
            />
            <PropRow
              name="onValueChange"
              type="(stepId: string | number) => void"
              description="Callback when a step is activated"
              isDarkMode={dark}
            />
            <PropRow
              name="beforeStepChange"
              type="(nextStepId, currentStepId) => boolean"
              description="Return false to prevent a step transition"
              isDarkMode={dark}
            />
            <PropRow
              name="orientation"
              type={'"horizontal" | "vertical"'}
              defaultVal="horizontal"
              description="Layout direction"
              isDarkMode={dark}
            />
            <PropRow
              name="variant"
              type={'"numbered" | "icon" | "dot"'}
              defaultVal="numbered"
              description="Visual style of step indicators"
              isDarkMode={dark}
            />
            <PropRow
              name="activationMode"
              type={'"automatic" | "manual"'}
              defaultVal="manual"
              description="Whether arrow keys activate steps immediately or only move focus"
              isDarkMode={dark}
            />
            <PropRow
              name="isStepClickable"
              type="(stepId, status) => boolean"
              defaultVal="completed/active"
              description="Custom logic for step clickability"
              isDarkMode={dark}
            />
            <PropRow
              name="getStepStatus"
              type="(stepId, index, activeIndex) => StepStatus"
              defaultVal="auto"
              description="Custom status logic (pending/active/completed/error)"
              isDarkMode={dark}
            />
            <PropRow
              name="showLabels"
              type="boolean"
              defaultVal="true"
              description="Show step labels"
              isDarkMode={dark}
            />
            <PropRow
              name="showDescriptions"
              type="boolean"
              defaultVal="false"
              description="Show step descriptions"
              isDarkMode={dark}
            />
            <PropRow
              name="showConnectors"
              type="boolean"
              defaultVal="true"
              description="Show connectors between steps"
              isDarkMode={dark}
            />
            <PropRow
              name="labelPosition"
              type={'"bottom" | "right"'}
              defaultVal="right"
              description="Position of labels relative to indicator"
              isDarkMode={dark}
            />
            <PropRow
              name="completedIcon"
              type="ComponentType | ReactNode"
              defaultVal="CheckIcon"
              description="Global icon for completed steps"
              isDarkMode={dark}
            />
            <PropRow
              name="errorIcon"
              type="ComponentType | ReactNode"
              defaultVal="ErrorIcon"
              description="Global icon for error steps"
              isDarkMode={dark}
            />
            <PropRow
              name="fullWidth"
              type="boolean"
              defaultVal="false"
              description="Whether container takes full width"
              isDarkMode={dark}
            />
            <PropRow
              name="aria-label"
              type="string"
              defaultVal='"Progress"'
              description="Accessible label for the navigation landmark"
              isDarkMode={dark}
            />
            <PropRow
              name="showTooltips"
              type="boolean"
              defaultVal="false"
              description="Enable tooltips on steps with tooltip content"
              isDarkMode={dark}
            />
            <PropRow
              name="tooltipDefaults"
              type="StepperTooltipDefaults"
              defaultVal="{}"
              description="Default tooltip configuration for all steps"
              isDarkMode={dark}
            />
            <PropRow
              name="classes"
              type="StepperClasses"
              defaultVal="{}"
              description="Object of class overrides for internal slots (root, list, step, indicator, etc.)"
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
              name="className"
              type="string"
              description="Shorthand for classes.root — merged with classes.root when both are provided"
              isDarkMode={dark}
            />
            <PropRow
              name="id"
              type="string"
              defaultVal="auto (useId)"
              description="Deterministic ID for SSR and testing"
              isDarkMode={dark}
            />
            <PropRow
              name="ref"
              type="Ref<HTMLDivElement>"
              description="Ref forwarded to the root element"
              isDarkMode={dark}
            />
            <PropRow
              name="style"
              type="CSSProperties"
              description="Inline styles on the root element"
              isDarkMode={dark}
            />
            <PropRow
              name="disabled"
              type="boolean"
              defaultVal="false"
              description="Disable all steps globally"
              isDarkMode={dark}
            />
            <PropRow
              name="loop"
              type="boolean"
              defaultVal="false"
              description="Loop keyboard navigation at boundaries"
              isDarkMode={dark}
            />
            <PropRow
              name="renderStep"
              type="(props, defaultElement) => ReactNode"
              description="Custom step rendering via render prop"
              isDarkMode={dark}
            />
          </PropsTable>
        </div>
      </Section>

      <Section title="Step Object Properties" isDarkMode={dark}>
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow
              name="id"
              type="string | number"
              defaultVal="required"
              description="Unique identifier for the step"
              isDarkMode={dark}
            />
            <PropRow
              name="label"
              type="ReactNode"
              description="Step label text"
              isDarkMode={dark}
            />
            <PropRow
              name="description"
              type="ReactNode"
              description="Step description text"
              isDarkMode={dark}
            />
            <PropRow
              name="icon"
              type="ComponentType | ReactNode"
              description="Custom icon (icon variant)"
              isDarkMode={dark}
            />
            <PropRow
              name="completedIcon"
              type="ComponentType | ReactNode"
              description="Per-step override for completed icon"
              isDarkMode={dark}
            />
            <PropRow
              name="errorIcon"
              type="ComponentType | ReactNode"
              description="Per-step override for error icon"
              isDarkMode={dark}
            />
            <PropRow
              name="disabled"
              type="boolean"
              description="Whether the step is disabled"
              isDarkMode={dark}
            />
            <PropRow
              name="tooltip"
              type="ReactNode | StepTooltipConfig"
              description="Tooltip content or configuration object"
              isDarkMode={dark}
            />
          </PropsTable>
        </div>
      </Section>

      <Section title="StepperClasses Slots" isDarkMode={dark}>
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow
              name="root"
              type="string"
              description="Root navigation container"
              isDarkMode={dark}
            />
            <PropRow
              name="list"
              type="string"
              description="The <ol> list wrapping all steps"
              isDarkMode={dark}
            />
            <PropRow
              name="stepContainer"
              type="string"
              description="Each <li> wrapper (step + connector)"
              isDarkMode={dark}
            />
            <PropRow
              name="step"
              type="string"
              description="Clickable step area (indicator + labels)"
              isDarkMode={dark}
            />
            <PropRow
              name="indicator"
              type="string"
              description="Number/icon circle indicator"
              isDarkMode={dark}
            />
            <PropRow
              name="indicatorIcon"
              type="string"
              description="Icon/SVG inside the indicator"
              isDarkMode={dark}
            />
            <PropRow
              name="labelWrapper"
              type="string"
              description="Container for label + description"
              isDarkMode={dark}
            />
            <PropRow
              name="label"
              type="string"
              description="Step label text"
              isDarkMode={dark}
            />
            <PropRow
              name="description"
              type="string"
              description="Step description text"
              isDarkMode={dark}
            />
            <PropRow
              name="connector"
              type="string"
              description="Line between steps (use data-status for per-status)"
              isDarkMode={dark}
            />
          </PropsTable>
        </div>
      </Section>

      <Section title="StepTooltipConfig Properties" isDarkMode={dark}>
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow
              name="content"
              type="ReactNode"
              defaultVal="required"
              description="Tooltip content (text or JSX)"
              isDarkMode={dark}
            />
            <PropRow
              name="side"
              type={'"top" | "right" | "bottom" | "left"'}
              description="Override tooltip position for this step"
              isDarkMode={dark}
            />
            <PropRow
              name="align"
              type={'"start" | "center" | "end"'}
              description="Override tooltip alignment"
              isDarkMode={dark}
            />
            <PropRow
              name="sideOffset"
              type="number"
              description="Distance from trigger (px)"
              isDarkMode={dark}
            />
            <PropRow
              name="alignOffset"
              type="number"
              description="Offset from aligned edge (px)"
              isDarkMode={dark}
            />
            <PropRow
              name="maxWidth"
              type="string | number"
              description="Maximum tooltip width"
              isDarkMode={dark}
            />
            <PropRow
              name="delayDuration"
              type="number"
              description="Delay before showing (ms)"
              isDarkMode={dark}
            />
            <PropRow
              name="showArrow"
              type="boolean"
              description="Show tooltip arrow"
              isDarkMode={dark}
            />
            <PropRow
              name="arrowColor"
              type="string"
              description="Custom arrow color"
              isDarkMode={dark}
            />
            <PropRow
              name="shadow"
              type="TooltipShadow"
              description="Tooltip shadow preset"
              isDarkMode={dark}
            />
            <PropRow
              name="contentClassName"
              type="string"
              description="Custom class for tooltip content"
              isDarkMode={dark}
            />
            <PropRow
              name="contentStyle"
              type="CSSProperties"
              description="Inline styles for tooltip content"
              isDarkMode={dark}
            />
            <PropRow
              name="arrowClassName"
              type="string"
              description="Custom class for tooltip arrow"
              isDarkMode={dark}
            />
            <PropRow
              name="arrowStyle"
              type="CSSProperties"
              description="Inline styles for tooltip arrow"
              isDarkMode={dark}
            />
          </PropsTable>
        </div>
      </Section>

      <Section title="StepperTooltipDefaults Properties" isDarkMode={dark}>
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow
              name="side"
              type={'"top" | "right" | "bottom" | "left"'}
              defaultVal="top"
              description="Default tooltip position for all steps"
              isDarkMode={dark}
            />
            <PropRow
              name="align"
              type={'"start" | "center" | "end"'}
              defaultVal="center"
              description="Default tooltip alignment"
              isDarkMode={dark}
            />
            <PropRow
              name="sideOffset"
              type="number"
              defaultVal="6"
              description="Default distance from trigger (px)"
              isDarkMode={dark}
            />
            <PropRow
              name="delayDuration"
              type="number"
              defaultVal="200"
              description="Default delay before showing (ms)"
              isDarkMode={dark}
            />
            <PropRow
              name="maxWidth"
              type="string | number"
              defaultVal="300"
              description="Default maximum tooltip width"
              isDarkMode={dark}
            />
            <PropRow
              name="showArrow"
              type="boolean"
              defaultVal="true"
              description="Default show/hide arrow"
              isDarkMode={dark}
            />
            <PropRow
              name="shadow"
              type="TooltipShadow"
              defaultVal="lg"
              description="Default shadow preset"
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
              name="data-orientation"
              type="root, ol, li"
              description={'"horizontal" | "vertical"'}
              isDarkMode={dark}
            />
            <PropRow
              name="data-variant"
              type="root"
              description={'"numbered" | "icon" | "dot"'}
              isDarkMode={dark}
            />
            <PropRow
              name="data-status"
              type="li, step, indicator, label, description, connector"
              description={'"pending" | "active" | "completed" | "error"'}
              isDarkMode={dark}
            />
            <PropRow
              name="data-disabled"
              type="step"
              description="Present when step is disabled"
              isDarkMode={dark}
            />
            <PropRow
              name="data-clickable"
              type="step"
              description="Present when step is interactive"
              isDarkMode={dark}
            />
            <PropRow
              name="data-next-status"
              type="connector"
              description="Status of the next step"
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
              'Semantic <ol>/<li> list structure — screen readers announce "item 2 of 4"',
              'role="navigation" with configurable aria-label landmark',
              'Native <button type="button"> for interactive steps with roving tabIndex',
              'aria-current="step" on the active step',
              "aria-disabled on disabled steps",
              'Auto-generated aria-label when labels are hidden (dot variant) — "Step 2 of 4"',
              'Indicator content is aria-hidden="true" — the step label provides the accessible name',
              'All SVG icons include aria-hidden="true"',
              'Connectors are aria-hidden="true" to avoid screen reader noise',
              "Default focus-visible ring on interactive steps for keyboard navigation",
              "RTL-aware arrow key navigation — respects direction: rtl on the element",
              "motion-reduce:transition-none applied to all animated elements",
              "Supports ref forwarding for programmatic focus management",
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
              [
                "Tab",
                "Move focus into the stepper (lands on active or first interactive step)",
              ],
              ["\u2192 / \u2193", "Move focus to the next interactive step"],
              [
                "\u2190 / \u2191",
                "Move focus to the previous interactive step",
              ],
              ["Home", "Move focus to the first interactive step"],
              ["End", "Move focus to the last interactive step"],
              [
                "Enter / Space",
                "Activate the focused step (fires onValueChange)",
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
        summary="Use `value` with `onValueChange` for controlled flow; step ids must match with strict equality. Align optional steps with your backend workflow state."
      />
      <DocEdgeCases
        isDarkMode={dark}
        items={[
          "Skipping steps may invalidate validation—coordinate with `beforeStepChange`.",
          "Async step content should not steal focus unexpectedly.",
          "Mobile horizontal scroll vs vertical layouts—test both.",
        ]}
      />
      <DocDoDont
        isDarkMode={dark}
        dos={[
          "Give each step a stable string or number id.",
          "Expose current step to assistive tech via labels and announcements.",
          "Disable steps that are not yet available.",
        ]}
        donts={[
          "Do not change step ids after mount.",
          "Do not use the stepper as the only progress indicator for long-running jobs.",
          "Do not hide errors that block progression without messaging.",
        ]}
      />
    </div>
  );
};

export default StepperDemo;
