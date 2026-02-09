import { useState, useRef, useMemo } from "react";
import { Stepper } from "../../components/Stepper";
import type {
  Step,
  StepStatus,
  StepTooltipConfig,
  StepperClasses,
} from "../../components/Stepper";
import {
  Section,
  DemoWrapper,
  CodeBlock,
  PropsTable,
  PropRow,
} from "./components";
import { useTheme } from "./ThemeContext";

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

const mergeClasses = (
  ...sources: (StepperClasses | undefined)[]
): StepperClasses => {
  const result: Record<string, string> = {};
  for (const source of sources) {
    if (!source) continue;
    for (const [key, value] of Object.entries(source)) {
      if (value) {
        result[key] = result[key] ? `${result[key]} ${value}` : value;
      }
    }
  }
  return result as StepperClasses;
};

const StepperDemo = () => {
  const { isDarkMode } = useTheme();
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

  const darkClasses: StepperClasses = useMemo(
    () =>
      isDarkMode
        ? {
            step: "hover:bg-white/5 focus-visible:ring-offset-gray-900",
            indicator:
              "data-[status=pending]:bg-gray-700 data-[status=pending]:text-gray-300",
            label:
              "data-[status=active]:text-blue-400 data-[status=completed]:text-green-400 data-[status=pending]:text-gray-400 data-[status=error]:text-red-400",
            description:
              "data-[status=active]:text-blue-300 data-[status=completed]:text-green-300 data-[status=pending]:text-gray-500 data-[status=error]:text-red-300",
            connector:
              "data-[status=pending]:bg-gray-700 data-[status=error]:bg-gray-700",
          }
        : {},
    [isDarkMode],
  );

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

  const s = {
    text: isDarkMode ? "text-gray-300" : "text-gray-600",
    textMuted: isDarkMode ? "text-gray-400" : "text-gray-500",
    textStrong: isDarkMode ? "text-white" : "text-gray-900",
    code: isDarkMode
      ? "bg-gray-700 text-gray-300 px-1 rounded text-xs font-mono"
      : "bg-gray-100 text-gray-700 px-1 rounded text-xs font-mono",
    codeBorder: isDarkMode
      ? "bg-gray-800/80 border border-gray-600 text-gray-300 px-1 py-0.5 rounded text-xs font-mono"
      : "bg-white border border-gray-300 text-gray-700 px-1 py-0.5 rounded text-xs font-mono",
    btnPrimary: isDarkMode
      ? "px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-400"
      : "px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700",
    btnSecondary: isDarkMode
      ? "px-4 py-2 text-sm bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600"
      : "px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200",
    heading: isDarkMode ? "text-white" : "text-gray-900",
    infoBox: isDarkMode
      ? "bg-blue-900/30 border border-blue-800 text-blue-200"
      : "bg-blue-50 border border-blue-200 text-blue-800",
    panel: isDarkMode ? "bg-gray-800" : "bg-gray-50",
  };

  return (
    <div className="space-y-16">
      <header>
        <h1 className={`text-3xl font-bold mb-3 ${s.heading}`}>Stepper</h1>
        <p className={`text-lg ${s.textMuted}`}>
          A navigation component that displays progress through a sequence of
          steps. Uses semantic {"<ol>/<li>"} markup with proper ARIA attributes,
          conditional role=&quot;button&quot; only on interactive steps, and
          focus-visible ring for keyboard accessibility.
        </p>
        <div className="mt-6">
          <h3
            className={`text-sm font-semibold mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
          >
            Installation
          </h3>
          <CodeBlock
            isDarkMode={isDarkMode}
            code={`import { Stepper } from "@kern-ui/stepper";`}
          />
        </div>
      </header>

      <div className="space-y-12">
        <h2 className={`text-2xl font-bold ${s.heading}`}>Examples</h2>

        <Section
          title="Basic Stepper"
          description="Default numbered variant with horizontal layout. Click a step or use the buttons to navigate."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="w-full space-y-4">
              <Stepper
                steps={basicSteps}
                value={basicStep}
                onValueChange={(id) => setBasicStep(id as number)}
                classes={darkClasses}
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setBasicStep(Math.max(1, basicStep - 1))}
                  className={s.btnSecondary}
                >
                  Previous
                </button>
                <button
                  onClick={() => setBasicStep(Math.min(4, basicStep + 1))}
                  className={s.btnPrimary}
                >
                  Next
                </button>
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Uncontrolled Usage"
          description="Use defaultValue instead of value for uncontrolled mode. The component manages its own active step state internally."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Stepper
              steps={basicSteps}
              defaultValue={2}
              onValueChange={(id) => console.log("Step changed:", id)}
              classes={darkClasses}
            />
          </DemoWrapper>
          <CodeBlock
            isDarkMode={isDarkMode}
            code={`<Stepper
  steps={steps}
  defaultValue={2}
  onValueChange={(id) => console.log("Step changed:", id)}
/>`}
          />
        </Section>

        <Section
          title="Icon Variant with Descriptions"
          description="Use variant='icon' with showDescriptions and labelPosition='bottom' for a rich checkout-style stepper."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Stepper
              steps={checkoutSteps}
              value={checkoutStep}
              onValueChange={(id) => setCheckoutStep(id as string)}
              variant="icon"
              showDescriptions
              labelPosition="bottom"
              classes={mergeClasses(darkClasses, {
                label: "text-sm font-medium mt-2",
              })}
            />
          </DemoWrapper>
        </Section>

        <Section
          title="Vertical Stepper"
          description="Set orientation='vertical' for a top-to-bottom step layout."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Stepper
              steps={basicSteps}
              value={verticalStep}
              onValueChange={(id) => setVerticalStep(id as number)}
              orientation="vertical"
              classes={darkClasses}
            />
          </DemoWrapper>
        </Section>

        <Section
          title="Dot Variant"
          description="Minimal dot indicators — ideal for carousels or wizards. Labels are hidden, aria-label is auto-generated for each step."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Stepper
              steps={basicSteps}
              value={dotStep}
              onValueChange={(id) => setDotStep(id as number)}
              variant="dot"
              showLabels={false}
              classes={mergeClasses(darkClasses, {
                list: "flex items-center justify-center",
                stepContainer: "flex items-center",
                step: "px-1 py-1",
                connector: "w-8 h-0.5 mx-1 bg-gray-200",
              })}
            />
          </DemoWrapper>
        </Section>

        <Section
          title="Hidden Connectors"
          description="Set showConnectors={false} to remove the connecting lines between steps."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Stepper
              steps={basicSteps}
              value={2}
              onValueChange={() => {}}
              showConnectors={false}
              classes={mergeClasses(darkClasses, {
                list: "flex items-center gap-4",
              })}
            />
          </DemoWrapper>
        </Section>

        <Section
          title="Error State"
          description="Use getStepStatus to override the default linear status calculation — here step 2 is always 'error'."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Stepper
              steps={[
                { id: 1, label: "Account" },
                { id: 2, label: "Verification" },
                { id: 3, label: "Complete" },
              ]}
              value={errorStep}
              onValueChange={(id) => setErrorStep(id as number)}
              getStepStatus={errorGetStatus}
              classes={darkClasses}
            />
          </DemoWrapper>
        </Section>

        <Section
          title="Disabled Steps"
          description="Individual steps can be disabled via the step object's disabled property. Disabled steps are not interactive even when isStepClickable returns true."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
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
              classes={darkClasses}
            />
          </DemoWrapper>
        </Section>

        <Section
          title="Globally Disabled"
          description="Set disabled on the root component to disable all steps regardless of their individual disabled state."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="w-full space-y-2">
              <Stepper
                steps={basicSteps}
                value={2}
                disabled
                classes={darkClasses}
              />
              <p className={`text-sm ${s.textMuted}`}>
                All steps are non-interactive when the stepper is globally
                disabled
              </p>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Non-linear Navigation"
          description="Set isStepClickable={() => true} to allow clicking any step regardless of its status."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="w-full space-y-2">
              <Stepper
                steps={basicSteps}
                value={2}
                onValueChange={() => {}}
                isStepClickable={() => true}
                classes={darkClasses}
              />
              <p className={`text-sm ${s.textMuted}`}>
                All steps are clickable regardless of status
              </p>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Step Change Prevention"
          description="Use beforeStepChange to validate or prevent step transitions. Return false to block the change. Here, steps can only advance one at a time."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="w-full space-y-3">
              <Stepper
                steps={basicSteps}
                value={preventStep}
                onValueChange={(id) => setPreventStep(id as number)}
                beforeStepChange={(nextId) => {
                  const nextIndex = basicSteps.findIndex(
                    (s) => s.id === nextId,
                  );
                  const currentIndex = basicSteps.findIndex(
                    (s) => s.id === preventStep,
                  );
                  return nextIndex <= currentIndex + 1;
                }}
                isStepClickable={() => true}
                classes={darkClasses}
              />
              <p className={`text-sm ${s.textMuted}`}>
                Click any step &mdash; cannot skip ahead more than one step at a
                time
              </p>
            </div>
          </DemoWrapper>
          <CodeBlock
            isDarkMode={isDarkMode}
            code={`<Stepper
  steps={steps}
  value={step}
  onValueChange={setStep}
  beforeStepChange={(nextId, currentId) => {
    const nextIdx = steps.findIndex(s => s.id === nextId);
    const currentIdx = steps.findIndex(s => s.id === currentId);
    return nextIdx <= currentIdx + 1;
  }}
  isStepClickable={() => true}
/>`}
          />
        </Section>

        <Section
          title="Keyboard Navigation with Loop"
          description="Arrow keys move focus between interactive steps. Home/End jump to first/last. Set loop to wrap around at boundaries."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="w-full space-y-3">
              <Stepper
                steps={basicSteps}
                value={loopStep}
                onValueChange={(id) => setLoopStep(id as number)}
                loop
                isStepClickable={() => true}
                classes={darkClasses}
              />
              <p className={`text-sm ${s.textMuted}`}>
                Use{" "}
                <kbd className={s.codeBorder}>←</kbd>{" "}
                <kbd className={s.codeBorder}>→</kbd> to move focus,{" "}
                <kbd className={s.codeBorder}>Enter</kbd> /{" "}
                <kbd className={s.codeBorder}>Space</kbd> to activate.
                Focus loops from last → first and first → last.
              </p>
            </div>
          </DemoWrapper>
          <CodeBlock
            isDarkMode={isDarkMode}
            code={`<Stepper
  steps={steps}
  value={step}
  onValueChange={setStep}
  loop
  isStepClickable={() => true}
/>`}
          />
        </Section>

        <Section
          title="Automatic Activation Mode"
          description="Set activationMode='automatic' so arrow keys activate steps immediately as focus moves, matching TabPanel's automatic mode."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="w-full space-y-3">
              <Stepper
                steps={basicSteps}
                value={autoStep}
                onValueChange={(id) => setAutoStep(id as number)}
                activationMode="automatic"
                loop
                isStepClickable={() => true}
                classes={darkClasses}
              />
              <p className={`text-sm ${s.textMuted}`}>
                Arrow keys move focus and activate the step in one action
              </p>
            </div>
          </DemoWrapper>
          <CodeBlock
            isDarkMode={isDarkMode}
            code={`<Stepper
  steps={steps}
  value={step}
  onValueChange={setStep}
  activationMode="automatic"
  loop
  isStepClickable={() => true}
/>`}
          />
        </Section>

        <Section
          title="Custom Completed & Error Icons"
          description="Override the default CheckIcon and ErrorIcon globally via completedIcon and errorIcon props."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
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
              classes={darkClasses}
            />
          </DemoWrapper>
          <CodeBlock
            isDarkMode={isDarkMode}
            code={`<Stepper
  steps={steps}
  value={step}
  completedIcon={StarIcon}
  errorIcon={WarningIcon}
  getStepStatus={errorGetStatus}
/>`}
          />
        </Section>

        <Section
          title="Per-Step Icon Overrides"
          description="Each step can override the global completedIcon and errorIcon via step.completedIcon and step.errorIcon."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Stepper
              steps={perStepIconSteps}
              value={perStepIconStep}
              onValueChange={(id) => setPerStepIconStep(id as number)}
              getStepStatus={perStepErrorGetStatus}
              classes={darkClasses}
            />
          </DemoWrapper>
          <CodeBlock
            isDarkMode={isDarkMode}
            code={`const steps: Step[] = [
  { id: 1, label: "Upload", completedIcon: ThumbsUpIcon },
  { id: 2, label: "Validate", errorIcon: WarningIcon },
  { id: 3, label: "Publish" },
];`}
          />
        </Section>

        <Section
          title="Custom Styling"
          description="Full visual customization via the classes object. Override any internal slot — the component merges your classes with defaults via cn()."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Stepper
              steps={[
                { id: 1, label: "Design" },
                { id: 2, label: "Develop" },
                { id: 3, label: "Deploy" },
              ]}
              value={customStep}
              onValueChange={(id) => setCustomStep(id as number)}
              classes={{
                step: `px-3 py-2 rounded-2xl border-2 border-transparent transition-all ${
                  isDarkMode
                    ? "hover:border-purple-400/30"
                    : "hover:border-purple-200"
                }`,
                indicator: `w-10 h-10 rounded-xl shadow-lg ${
                  isDarkMode
                    ? "bg-purple-500 text-white shadow-purple-500/20"
                    : "bg-purple-600 text-white shadow-purple-200"
                }`,
                indicatorIcon: "w-5 h-5",
                label: `text-sm font-semibold ${
                  isDarkMode ? "text-purple-300" : "text-purple-700"
                }`,
                connector: `flex-1 h-1 min-w-8 mx-1 rounded-full ${
                  isDarkMode ? "bg-purple-400/30" : "bg-purple-200"
                }`,
              }}
            />
          </DemoWrapper>
        </Section>

        <Section
          title="Full Width"
          description="Set fullWidth to make the stepper expand to fill its container."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Stepper
              steps={basicSteps}
              value={2}
              onValueChange={() => {}}
              fullWidth
              classes={mergeClasses(darkClasses, {
                list: "flex items-center w-full",
              })}
            />
          </DemoWrapper>
        </Section>

        <Section
          title="Custom ID"
          description="Use the id prop for deterministic IDs useful for SSR and testing. Auto-generated via useId() if not provided."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="w-full space-y-2">
              <Stepper
                id="checkout-stepper"
                steps={basicSteps}
                value={2}
                onValueChange={() => {}}
                classes={darkClasses}
              />
              <p className={`text-sm ${s.textMuted}`}>
                Root element has{" "}
                <code className={s.code}>id=&quot;checkout-stepper&quot;</code>
              </p>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Ref Forwarding"
          description="Use ref to access the root DOM element for programmatic scroll, measurement, or focus management."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="w-full space-y-4">
              <Stepper
                ref={stepperRef}
                steps={basicSteps}
                value={2}
                onValueChange={() => {}}
                classes={darkClasses}
              />
              <button
                onClick={() =>
                  stepperRef.current?.scrollIntoView({ behavior: "smooth" })
                }
                className={s.btnSecondary}
              >
                Scroll to Stepper
              </button>
            </div>
          </DemoWrapper>
          <CodeBlock
            isDarkMode={isDarkMode}
            code={`const ref = useRef<HTMLDivElement>(null);
<Stepper ref={ref} steps={steps} value={1} />
ref.current?.scrollIntoView({ behavior: "smooth" });`}
          />
        </Section>

        <Section
          title="Custom Aria Label"
          description='Use aria-label to provide a meaningful accessible name for the navigation landmark.'
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="w-full space-y-2">
              <Stepper
                steps={basicSteps}
                value={2}
                onValueChange={() => {}}
                aria-label="Checkout Progress"
                classes={darkClasses}
              />
              <p className={`text-sm ${s.textMuted}`}>
                The navigation landmark has{" "}
                <code className={s.code}>
                  aria-label=&quot;Checkout Progress&quot;
                </code>
              </p>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="With Tooltips (Simple)"
          description="Enable showTooltips and add a tooltip string to each step for hover-activated tooltips."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="w-full space-y-3">
              <Stepper
                steps={tooltipSteps}
                value={tooltipStep}
                onValueChange={(id) => setTooltipStep(id as number)}
                showTooltips
                tooltipDefaults={{ side: "top", delayDuration: 100 }}
                classes={darkClasses}
              />
              <p className={`text-sm ${s.textMuted}`}>
                Hover over each step to see the tooltip
              </p>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="With Tooltips (Custom Config)"
          description="Each step can have a StepTooltipConfig object for per-step tooltip customization including position, JSX content, max width, and shadow."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="w-full space-y-3">
              <Stepper
                steps={tooltipConfigSteps}
                value={tooltipConfigStep}
                onValueChange={(id) => setTooltipConfigStep(id as number)}
                showTooltips
                classes={mergeClasses(darkClasses, {
                  indicator: `w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold border-2 border-transparent ${
                    isDarkMode
                      ? "data-[status=active]:bg-purple-500 data-[status=active]:text-white data-[status=active]:border-purple-500 data-[status=completed]:bg-green-500 data-[status=completed]:text-white data-[status=completed]:border-green-500 data-[status=pending]:bg-gray-800 data-[status=pending]:text-gray-400 data-[status=pending]:border-gray-600"
                      : "data-[status=active]:bg-purple-600 data-[status=active]:text-white data-[status=active]:border-purple-600 data-[status=completed]:bg-green-500 data-[status=completed]:text-white data-[status=completed]:border-green-500 data-[status=pending]:bg-white data-[status=pending]:text-gray-400 data-[status=pending]:border-gray-300"
                  }`,
                  indicatorIcon: "w-5 h-5",
                  connector: `flex-1 h-0.5 min-w-12 mx-1 rounded-full ${
                    isDarkMode ? "bg-gray-700" : "bg-gray-200"
                  }`,
                })}
              />
              <p className={`text-sm ${s.textMuted}`}>
                Uses <code className={s.code}>data-[status]</code> selectors for
                per-status styling
              </p>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Data Attributes"
          description="The Stepper applies data attributes for CSS-based styling and state inspection."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
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
                    <th className="text-left py-3 font-semibold">Values</th>
                  </tr>
                </thead>
                <tbody
                  className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-100"}`}
                >
                  <tr>
                    <td className="py-3 pr-4 font-mono text-blue-500">
                      data-orientation
                    </td>
                    <td className={`py-3 pr-4 ${s.textMuted}`}>root, ol, li</td>
                    <td className={`py-3 ${s.textMuted}`}>
                      &quot;horizontal&quot; | &quot;vertical&quot;
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-mono text-blue-500">
                      data-variant
                    </td>
                    <td className={`py-3 pr-4 ${s.textMuted}`}>root</td>
                    <td className={`py-3 ${s.textMuted}`}>
                      &quot;numbered&quot; | &quot;icon&quot; | &quot;dot&quot;
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-mono text-blue-500">
                      data-status
                    </td>
                    <td className={`py-3 pr-4 ${s.textMuted}`}>
                      li, step div, indicator, label, description, connector
                    </td>
                    <td className={`py-3 ${s.textMuted}`}>
                      &quot;pending&quot; | &quot;active&quot; |
                      &quot;completed&quot; | &quot;error&quot;
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-mono text-blue-500">
                      data-disabled
                    </td>
                    <td className={`py-3 pr-4 ${s.textMuted}`}>step div</td>
                    <td className={`py-3 ${s.textMuted}`}>
                      Present when step is disabled
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-mono text-blue-500">
                      data-clickable
                    </td>
                    <td className={`py-3 pr-4 ${s.textMuted}`}>step div</td>
                    <td className={`py-3 ${s.textMuted}`}>
                      Present when step is interactive
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-mono text-blue-500">
                      data-next-status
                    </td>
                    <td className={`py-3 pr-4 ${s.textMuted}`}>connector</td>
                    <td className={`py-3 ${s.textMuted}`}>
                      Status of the next step (&quot;pending&quot; |
                      &quot;active&quot; | &quot;completed&quot; |
                      &quot;error&quot;)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className={`text-sm mt-4 ${s.textMuted}`}>
              Example usage:{" "}
              <code className={s.code}>
                data-[status=active]:font-bold
              </code>
              ,{" "}
              <code className={s.code}>
                data-[disabled]:opacity-50
              </code>
            </p>
          </DemoWrapper>
        </Section>
      </div>

      <div className="space-y-8">
        <h2 className={`text-2xl font-bold ${s.heading}`}>API Reference</h2>

        <Section title="Stepper Props" isDarkMode={isDarkMode}>
          <PropsTable isDarkMode={isDarkMode}>
            <PropRow name="steps" type="Step[]" defaultVal="[]" description="Array of step objects" isDarkMode={isDarkMode} />
            <PropRow name="value" type="string | number" description="Currently active step ID (controlled)" isDarkMode={isDarkMode} />
            <PropRow name="defaultValue" type="string | number" description="Initial step ID for uncontrolled usage" isDarkMode={isDarkMode} />
            <PropRow name="onValueChange" type="(stepId: string | number) => void" description="Callback when a step is activated" isDarkMode={isDarkMode} />
            <PropRow name="beforeStepChange" type="(nextStepId, currentStepId) => boolean" description="Return false to prevent a step transition" isDarkMode={isDarkMode} />
            <PropRow name="orientation" type={'"horizontal" | "vertical"'} defaultVal="horizontal" description="Layout direction" isDarkMode={isDarkMode} />
            <PropRow name="variant" type={'"numbered" | "icon" | "dot"'} defaultVal="numbered" description="Visual style of step indicators" isDarkMode={isDarkMode} />
            <PropRow name="activationMode" type={'"automatic" | "manual"'} defaultVal="manual" description="Whether arrow keys activate steps immediately or only move focus" isDarkMode={isDarkMode} />
            <PropRow name="isStepClickable" type="(stepId, status) => boolean" defaultVal="completed/active" description="Custom logic for step clickability" isDarkMode={isDarkMode} />
            <PropRow name="getStepStatus" type="(stepId, index, activeIndex) => StepStatus" defaultVal="auto" description="Custom status logic (pending/active/completed/error)" isDarkMode={isDarkMode} />
            <PropRow name="showLabels" type="boolean" defaultVal="true" description="Show step labels" isDarkMode={isDarkMode} />
            <PropRow name="showDescriptions" type="boolean" defaultVal="false" description="Show step descriptions" isDarkMode={isDarkMode} />
            <PropRow name="showConnectors" type="boolean" defaultVal="true" description="Show connectors between steps" isDarkMode={isDarkMode} />
            <PropRow name="labelPosition" type={'"bottom" | "right"'} defaultVal="right" description="Position of labels relative to indicator" isDarkMode={isDarkMode} />
            <PropRow name="completedIcon" type="ComponentType | ReactNode" defaultVal="CheckIcon" description="Global icon for completed steps" isDarkMode={isDarkMode} />
            <PropRow name="errorIcon" type="ComponentType | ReactNode" defaultVal="ErrorIcon" description="Global icon for error steps" isDarkMode={isDarkMode} />
            <PropRow name="fullWidth" type="boolean" defaultVal="false" description="Whether container takes full width" isDarkMode={isDarkMode} />
            <PropRow name="aria-label" type="string" defaultVal='"Progress"' description="Accessible label for the navigation landmark" isDarkMode={isDarkMode} />
            <PropRow name="showTooltips" type="boolean" defaultVal="false" description="Enable tooltips on steps with tooltip content" isDarkMode={isDarkMode} />
            <PropRow name="tooltipDefaults" type="StepperTooltipDefaults" defaultVal="{}" description="Default tooltip configuration for all steps" isDarkMode={isDarkMode} />
            <PropRow name="classes" type="StepperClasses" defaultVal="{}" description="Object of class overrides for internal slots (root, list, step, indicator, etc.)" isDarkMode={isDarkMode} />
            <PropRow name="className" type="string" description="Shorthand for classes.root — merged with classes.root when both are provided" isDarkMode={isDarkMode} />
            <PropRow name="id" type="string" defaultVal="auto (useId)" description="Deterministic ID for SSR and testing" isDarkMode={isDarkMode} />
            <PropRow name="ref" type="Ref<HTMLDivElement>" description="Ref forwarded to the root element" isDarkMode={isDarkMode} />
            <PropRow name="style" type="CSSProperties" description="Inline styles on the root element" isDarkMode={isDarkMode} />
            <PropRow name="disabled" type="boolean" defaultVal="false" description="Disable all steps globally" isDarkMode={isDarkMode} />
            <PropRow name="loop" type="boolean" defaultVal="false" description="Loop keyboard navigation at boundaries" isDarkMode={isDarkMode} />
            <PropRow name="renderStep" type="(props, defaultElement) => ReactNode" description="Custom step rendering via render prop" isDarkMode={isDarkMode} />
          </PropsTable>
        </Section>

        <Section title="Step Object Properties" isDarkMode={isDarkMode}>
          <PropsTable isDarkMode={isDarkMode}>
            <PropRow name="id" type="string | number" defaultVal="required" description="Unique identifier for the step" isDarkMode={isDarkMode} />
            <PropRow name="label" type="ReactNode" description="Step label text" isDarkMode={isDarkMode} />
            <PropRow name="description" type="ReactNode" description="Step description text" isDarkMode={isDarkMode} />
            <PropRow name="icon" type="ComponentType | ReactNode" description="Custom icon (icon variant)" isDarkMode={isDarkMode} />
            <PropRow name="completedIcon" type="ComponentType | ReactNode" description="Per-step override for completed icon" isDarkMode={isDarkMode} />
            <PropRow name="errorIcon" type="ComponentType | ReactNode" description="Per-step override for error icon" isDarkMode={isDarkMode} />
            <PropRow name="disabled" type="boolean" description="Whether the step is disabled" isDarkMode={isDarkMode} />
            <PropRow name="tooltip" type="ReactNode | StepTooltipConfig" description="Tooltip content or configuration object" isDarkMode={isDarkMode} />
          </PropsTable>
        </Section>

        <Section title="StepperClasses Slots" isDarkMode={isDarkMode}>
          <PropsTable isDarkMode={isDarkMode}>
            <PropRow name="root" type="string" description="Root navigation container" isDarkMode={isDarkMode} />
            <PropRow name="list" type="string" description="The <ol> list wrapping all steps" isDarkMode={isDarkMode} />
            <PropRow name="stepContainer" type="string" description="Each <li> wrapper (step + connector)" isDarkMode={isDarkMode} />
            <PropRow name="step" type="string" description="Clickable step area (indicator + labels)" isDarkMode={isDarkMode} />
            <PropRow name="indicator" type="string" description="Number/icon circle indicator" isDarkMode={isDarkMode} />
            <PropRow name="indicatorIcon" type="string" description="Icon/SVG inside the indicator" isDarkMode={isDarkMode} />
            <PropRow name="labelWrapper" type="string" description="Container for label + description" isDarkMode={isDarkMode} />
            <PropRow name="label" type="string" description="Step label text" isDarkMode={isDarkMode} />
            <PropRow name="description" type="string" description="Step description text" isDarkMode={isDarkMode} />
            <PropRow name="connector" type="string" description="Line between steps (use data-status for per-status)" isDarkMode={isDarkMode} />
          </PropsTable>
        </Section>

        <Section title="StepTooltipConfig Properties" isDarkMode={isDarkMode}>
          <PropsTable isDarkMode={isDarkMode}>
            <PropRow name="content" type="ReactNode" defaultVal="required" description="Tooltip content (text or JSX)" isDarkMode={isDarkMode} />
            <PropRow name="side" type={'"top" | "right" | "bottom" | "left"'} description="Override tooltip position for this step" isDarkMode={isDarkMode} />
            <PropRow name="align" type={'"start" | "center" | "end"'} description="Override tooltip alignment" isDarkMode={isDarkMode} />
            <PropRow name="sideOffset" type="number" description="Distance from trigger (px)" isDarkMode={isDarkMode} />
            <PropRow name="alignOffset" type="number" description="Offset from aligned edge (px)" isDarkMode={isDarkMode} />
            <PropRow name="maxWidth" type="string | number" description="Maximum tooltip width" isDarkMode={isDarkMode} />
            <PropRow name="delayDuration" type="number" description="Delay before showing (ms)" isDarkMode={isDarkMode} />
            <PropRow name="showArrow" type="boolean" description="Show tooltip arrow" isDarkMode={isDarkMode} />
            <PropRow name="arrowColor" type="string" description="Custom arrow color" isDarkMode={isDarkMode} />
            <PropRow name="shadow" type="TooltipShadow" description="Tooltip shadow preset" isDarkMode={isDarkMode} />
            <PropRow name="contentClassName" type="string" description="Custom class for tooltip content" isDarkMode={isDarkMode} />
            <PropRow name="contentStyle" type="CSSProperties" description="Inline styles for tooltip content" isDarkMode={isDarkMode} />
            <PropRow name="arrowClassName" type="string" description="Custom class for tooltip arrow" isDarkMode={isDarkMode} />
            <PropRow name="arrowStyle" type="CSSProperties" description="Inline styles for tooltip arrow" isDarkMode={isDarkMode} />
          </PropsTable>
        </Section>

        <Section title="StepperTooltipDefaults Properties" isDarkMode={isDarkMode}>
          <PropsTable isDarkMode={isDarkMode}>
            <PropRow name="side" type={'"top" | "right" | "bottom" | "left"'} defaultVal="top" description="Default tooltip position for all steps" isDarkMode={isDarkMode} />
            <PropRow name="align" type={'"start" | "center" | "end"'} defaultVal="center" description="Default tooltip alignment" isDarkMode={isDarkMode} />
            <PropRow name="sideOffset" type="number" defaultVal="6" description="Default distance from trigger (px)" isDarkMode={isDarkMode} />
            <PropRow name="delayDuration" type="number" defaultVal="200" description="Default delay before showing (ms)" isDarkMode={isDarkMode} />
            <PropRow name="maxWidth" type="string | number" defaultVal="300" description="Default maximum tooltip width" isDarkMode={isDarkMode} />
            <PropRow name="showArrow" type="boolean" defaultVal="true" description="Default show/hide arrow" isDarkMode={isDarkMode} />
            <PropRow name="shadow" type="TooltipShadow" defaultVal="lg" description="Default shadow preset" isDarkMode={isDarkMode} />
          </PropsTable>
        </Section>

        <div>
          <h3
            className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}
          >
            Type Definitions
          </h3>
          <CodeBlock
            isDarkMode={isDarkMode}
            code={`type StepStatus = "pending" | "active" | "completed" | "error";

interface Step {
  id: string | number;
  label?: ReactNode;
  description?: ReactNode;
  icon?: ComponentType<IconProps> | ReactNode;
  completedIcon?: ComponentType<IconProps> | ReactNode;
  errorIcon?: ComponentType<IconProps> | ReactNode;
  disabled?: boolean;
  tooltip?: ReactNode | StepTooltipConfig;
}

interface StepperClasses {
  root?: string;
  list?: string;
  stepContainer?: string;
  step?: string;
  indicator?: string;
  indicatorIcon?: string;
  labelWrapper?: string;
  label?: string;
  description?: string;
  connector?: string;
}

interface StepRenderProps {
  step: Step;
  index: number;
  status: StepStatus;
  isClickable: boolean;
  isDisabled: boolean;
  nextStepStatus?: StepStatus;
}

interface StepperProps {
  steps: Step[];
  value?: string | number;
  defaultValue?: string | number;
  onValueChange?: (stepId: string | number) => void;
  beforeStepChange?: (nextStepId: string | number, currentStepId: string | number) => boolean;
  orientation?: "horizontal" | "vertical";
  variant?: "numbered" | "icon" | "dot";
  activationMode?: "automatic" | "manual";
  isStepClickable?: (stepId: string | number, status: StepStatus) => boolean;
  getStepStatus?: (stepId: string | number, index: number, activeIndex: number) => StepStatus;
  showLabels?: boolean;
  showDescriptions?: boolean;
  showConnectors?: boolean;
  labelPosition?: "bottom" | "right";
  completedIcon?: ComponentType<IconProps> | ReactNode;
  errorIcon?: ComponentType<IconProps> | ReactNode;
  fullWidth?: boolean;
  "aria-label"?: string;
  showTooltips?: boolean;
  tooltipDefaults?: StepperTooltipDefaults;
  classes?: StepperClasses;
  className?: string;
  style?: CSSProperties;
  id?: string;
  disabled?: boolean;
  loop?: boolean;
  renderStep?: (props: StepRenderProps, defaultElement: ReactElement) => ReactNode;
}`}
          />
        </div>
      </div>

      <div className="space-y-6">
        <h2 className={`text-2xl font-bold ${s.heading}`}>Accessibility</h2>

        <div className={`p-4 rounded-lg ${s.panel}`}>
          <h3
            className={`font-semibold mb-3 ${isDarkMode ? "text-white" : "text-gray-800"}`}
          >
            Features
          </h3>
          <ul
            className={`list-disc list-inside space-y-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
          >
            <li>
              Semantic <code className={s.code}>&lt;ol&gt;</code> /{" "}
              <code className={s.code}>&lt;li&gt;</code> list structure — screen
              readers announce &quot;item 2 of 4&quot;
            </li>
            <li>
              <code className={s.code}>role=&quot;navigation&quot;</code> with
              configurable <code className={s.code}>aria-label</code> landmark
            </li>
            <li>
              Native{" "}
              <code className={s.code}>&lt;button type=&quot;button&quot;&gt;</code>{" "}
              for interactive steps with roving{" "}
              <code className={s.code}>tabIndex</code> — only one step is in the
              tab order at a time
            </li>
            <li>
              <code className={s.code}>aria-current=&quot;step&quot;</code> on
              the active step
            </li>
            <li>
              <code className={s.code}>aria-disabled</code> on disabled steps
            </li>
            <li>
              Auto-generated{" "}
              <code className={s.code}>aria-label</code> when labels are hidden
              (dot variant) — &quot;Step 2 of 4&quot;
            </li>
            <li>
              Indicator content is{" "}
              <code className={s.code}>aria-hidden=&quot;true&quot;</code> — the
              step label or aria-label provides the accessible name
            </li>
            <li>
              All SVG icons include{" "}
              <code className={s.code}>aria-hidden=&quot;true&quot;</code>
            </li>
            <li>
              Connectors are{" "}
              <code className={s.code}>aria-hidden=&quot;true&quot;</code> to
              avoid screen reader noise
            </li>
            <li>
              Default <code className={s.code}>focus-visible</code> ring on
              interactive steps for keyboard navigation
            </li>
            <li>
              RTL-aware arrow key navigation — respects{" "}
              <code className={s.code}>direction: rtl</code> on the element
            </li>
            <li>
              <code className={s.code}>motion-reduce:transition-none</code>{" "}
              applied to all animated elements for reduced-motion preference
            </li>
            <li>Supports ref forwarding for programmatic focus management</li>
          </ul>
        </div>

        <div className={`p-4 rounded-lg ${s.panel}`}>
          <h3
            className={`font-semibold mb-3 ${isDarkMode ? "text-white" : "text-gray-800"}`}
          >
            Keyboard Navigation
          </h3>
          <ul
            className={`space-y-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
          >
            <li>
              <kbd className={s.codeBorder}>Tab</kbd> — Move focus into the
              stepper (lands on the active or first interactive step via roving
              tabindex)
            </li>
            <li>
              <kbd className={s.codeBorder}>→</kbd> /{" "}
              <kbd className={s.codeBorder}>↓</kbd> — Move focus to the next
              interactive step (direction follows orientation; RTL-aware)
            </li>
            <li>
              <kbd className={s.codeBorder}>←</kbd> /{" "}
              <kbd className={s.codeBorder}>↑</kbd> — Move focus to the
              previous interactive step
            </li>
            <li>
              <kbd className={s.codeBorder}>Home</kbd> — Move focus to the
              first interactive step
            </li>
            <li>
              <kbd className={s.codeBorder}>End</kbd> — Move focus to the last
              interactive step
            </li>
            <li>
              <kbd className={s.codeBorder}>Enter</kbd> /{" "}
              <kbd className={s.codeBorder}>Space</kbd> — Activate the focused
              step (fires onValueChange)
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StepperDemo;
