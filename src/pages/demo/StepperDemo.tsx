import {
  useState,
  useRef } from "react";
import { Stepper } from "../../components/Stepper/index.js";
import type {
  Step,
  StepStatus,
  StepTooltipConfig,
  } from "../../components/Stepper/index.js";
import { Button } from "../../components/Button/index.js";
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
          <div className="text-cl-text-tertiary text-xs">
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

const getClasses = (_dark: boolean) => ({
  // Same overrides for light + dark — the underlying tokens (cl-accent,
  // cl-success, cl-error, cl-bg-hover, cl-bg-elevated) are theme-aware,
  // so a single object is correct for both modes. Previously light mode
  // got `{}` here and fell through to raw green-500 / red-500 from the
  // library defaults, which read as disconnected from the brand palette.
  // ADR 002 R4: the per-status keys are gone. The same brand palette is now
  // expressed as data-variants on the surviving parts — which is the migration
  // a consumer has to make, so the demo shows it rather than hiding it.
  stepper: {
    trigger:
      "cursor-pointer rounded-cl-md px-2 py-1.5 hover:bg-cl-code-text/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent focus-visible:ring-offset-2 focus-visible:ring-offset-cl-bg",
    itemIndicator:
      "data-[state=active]:bg-cl-accent data-[state=active]:text-cl-on-accent data-[state=completed]:bg-cl-accent data-[state=completed]:text-cl-on-accent data-[state=inactive]:bg-black/[0.06] dark:data-[state=inactive]:bg-white/10 data-[state=inactive]:text-cl-text-secondary data-[invalid]:bg-cl-error data-[invalid]:text-cl-on-accent",
    itemText:
      "data-[state=active]:text-cl-accent data-[state=completed]:text-cl-text data-[state=inactive]:text-cl-text-tertiary data-[invalid]:text-cl-error",
    description:
      "data-[state=active]:text-cl-accent data-[state=completed]:text-cl-text-secondary data-[state=inactive]:text-cl-text-tertiary data-[invalid]:text-cl-error",
    separator:
      "data-[orientation=horizontal]:w-full data-[orientation=horizontal]:h-0.5 data-[orientation=vertical]:w-0.5 data-[orientation=vertical]:h-6 bg-black/[0.08] dark:bg-white/15 data-[state=active]:bg-cl-accent/30 data-[state=completed]:bg-cl-accent",
  } as const,
 card: `rounded-cl-lg p-5 bg-cl-bg-elevated`,
 kbd: `px-2 py-1 rounded-cl-md text-[11px] font-mono min-w-[2.5rem] text-center font-medium bg-cl-bg-elevated border border-cl-border text-cl-text-secondary`,
  label: `text-xs font-medium text-cl-text-tertiary`,
 note: `mt-3 p-3 rounded-cl-md text-xs bg-cl-bg-elevated border border-cl-border text-cl-accent`,
  btn: `px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors bg-cl-bg-elevated text-cl-text border border-cl-border hover:border-cl-border-input-hover hover:bg-cl-bg-hover cursor-pointer`,
  btnPrimary: `px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors bg-cl-text text-cl-bg hover:opacity-90`,
});

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
  const [uncontrolledStepChange, setUncontrolledStepChange] = useState("not fired yet");
  const [perStepIconStep, setPerStepIconStep] = useState<number>(2);
  const [loopStep, setLoopStep] = useState<number>(2);
  const [autoStep, setAutoStep] = useState<number>(2);
  const [preventStep, setPreventStep] = useState<number>(1);
  /* Sections that used to pass `value={2}` with a no-op handler. Their steps
     render as real buttons — the library only makes completed and active steps
     interactive — so they invited a click and then did nothing. Each drives
     its own state now, whatever else the section is demonstrating. */
  const [connectorStep, setConnectorStep] = useState<number>(2);
  const [disabledStepsStep, setDisabledStepsStep] = useState<number>(2);
  const [nonLinearStep, setNonLinearStep] = useState<number>(2);
  const [fullWidthStep, setFullWidthStep] = useState<number>(2);
  const [customIdStep, setCustomIdStep] = useState<number>(2);
  const [refStep, setRefStep] = useState<number>(2);
  const [ariaLabelStep, setAriaLabelStep] = useState<number>(2);
  const [renderStepStep, setRenderStepStep] = useState<number>(2);
  const stepperRef = useRef<HTMLDivElement>(null);

  /**
   * Step 2 errors until you move past it, then completes like any other.
   *
   * `if (index === 1) return "error"` came first and had no exit, so the step
   * was pinned to error for every value the stepper could hold: it could not
   * reach `completed`, which is the state the icon-override sections exist to
   * show. Advancing now resolves it, and stepping back re-raises it.
   */
  const errorGetStatus = (
    _stepId: string | number,
    index: number,
    activeIndex: number,
  ): StepStatus => {
    if (index === 1 && index >= activeIndex) return "error";
    if (index < activeIndex) return "completed";
    if (index === activeIndex) return "active";
    return "pending";
  };

  return (
    <div className="space-y-10">
      <DocsHero
        title="Stepper"
        description='A navigation component that displays progress through a sequence of steps. Uses semantic <ol>/<li> markup with proper ARIA attributes, conditional role="button" only on interactive steps, and focus-visible ring for keyboard accessibility.'
        code={`import { Stepper } from "@chumlab/ui/stepper";`}
      />

      <SetupNote />

      <CopyPasteBlock name="Stepper" />

      <Section
        title="Basic Usage"
        description="Works out-of-the-box with built-in styles and dark mode. Click a step or use the buttons to navigate. No custom classes needed."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full">
            {}
            <Stepper
              steps={basicSteps}
              value={basicStep}
              onValueChange={(id) => setBasicStep(id as number)}
              isStepClickable={() => true}
            />
          </div>
        </DemoWrapper>
      </Section>

      <Section
        title="Uncontrolled Usage"
        description="Use defaultValue instead of value for uncontrolled mode. The component manages its own active step state internally."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <Stepper
            steps={basicSteps}
            defaultValue={2}
            onValueChange={(id) => setUncontrolledStepChange(JSON.stringify(id))}
            isStepClickable={() => true}
            classes={c.stepper}
          />
          <div
            className="rounded-cl-md px-3 py-2 text-xs font-mono bg-cl-bg-elevated text-cl-text-tertiary"
            data-demo-action
          >
            onValueChange: {uncontrolledStepChange}
          </div>
        </DemoWrapper>
      </Section>

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
              itemText: "text-sm font-medium leading-tight mt-1 transition-colors",
            }}
          />
        </DemoWrapper>
      </Section>

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

      <Section
        title="Hidden Connectors"
        description="Set showConnectors={false} to remove the connecting lines between steps."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <Stepper
            steps={basicSteps}
            value={connectorStep}
            onValueChange={(id) => setConnectorStep(id as number)}
            isStepClickable={() => true}
            showConnectors={false}
            classes={{
              ...c.stepper,
              list: "flex items-center gap-4",
            }}
          />
        </DemoWrapper>
      </Section>

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
            value={disabledStepsStep}
            onValueChange={(id) => setDisabledStepsStep(id as number)}
            isStepClickable={() => true}
            classes={c.stepper}
          />
        </DemoWrapper>
      </Section>

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
              className={`text-sm text-cl-text-secondary`}
            >
              All steps are non-interactive when the stepper is globally
              disabled
            </p>
          </div>
        </DemoWrapper>
      </Section>

      <Section
        title="Non-linear Navigation"
        description="Set isStepClickable={() => true} to allow clicking any step regardless of its status."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full space-y-2">
            <Stepper
              steps={basicSteps}
              value={nonLinearStep}
              onValueChange={(id) => setNonLinearStep(id as number)}
              isStepClickable={() => true}
              classes={c.stepper}
            />
            <p
              className={`text-sm text-cl-text-secondary`}
            >
              All steps are clickable regardless of status
            </p>
          </div>
        </DemoWrapper>
      </Section>

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
              className={`text-sm text-cl-text-secondary`}
            >
              Click any step &mdash; cannot skip ahead more than one step at a
              time
            </p>
          </div>
        </DemoWrapper>
      </Section>

      <Section
        title="Try it: Keyboard Navigation with Loop"
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
              className={`text-sm text-cl-text-secondary`}
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
              className={`text-sm text-cl-text-secondary`}
            >
              Arrow keys move focus and activate the step in one action
            </p>
          </div>
        </DemoWrapper>
      </Section>

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
            getStepStatus={errorGetStatus}
            isStepClickable={() => true}
            classes={c.stepper}
          />
        </DemoWrapper>
      </Section>

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
              trigger: `flex items-center gap-2 px-3 py-2 rounded-cl-lg border-2 border-transparent transition-all hover:border-cl-border-input-focus dark:hover:border-cl-border-input-focus/30`,
              itemIndicator: `shrink-0 rounded-cl-lg flex items-center justify-center shadow-lg bg-cl-accent text-cl-on-accent shadow-accent dark:shadow-accent/20`,
              itemIcon: "w-5 h-5",
              itemText: `text-sm font-semibold text-cl-accent`,
            }}
          />
        </DemoWrapper>
      </Section>

      <Section
        title="Full Width"
        description="Set fullWidth to make the stepper expand to fill its container."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <Stepper
            steps={basicSteps}
            value={fullWidthStep}
            onValueChange={(id) => setFullWidthStep(id as number)}
            isStepClickable={() => true}
            fullWidth
            classes={c.stepper}
          />
        </DemoWrapper>
      </Section>

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
              value={customIdStep}
              onValueChange={(id) => setCustomIdStep(id as number)}
              isStepClickable={() => true}
              classes={c.stepper}
            />
            <p
              className={`text-sm text-cl-text-secondary`}
            >
              Root element has{" "}
              <code
                className={`px-1 rounded text-xs font-mono bg-cl-bg-elevated text-cl-text-secondary`}
              >
                id=&quot;checkout-stepper&quot;
              </code>
            </p>
          </div>
        </DemoWrapper>
      </Section>

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
              value={refStep}
              onValueChange={(id) => setRefStep(id as number)}
              isStepClickable={() => true}
              classes={c.stepper}
            />
            <Button
              size="sm"
              onClick={() =>
                stepperRef.current?.scrollIntoView({ behavior: "smooth" })
              }
              className="rounded-cl-md bg-cl-bg-elevated text-cl-text border border-cl-border hover:border-cl-border-input-hover hover:bg-cl-bg-hover"
            >
              Scroll to Stepper
            </Button>
          </div>
        </DemoWrapper>
      </Section>

      <Section
        title="Custom Aria Label"
        description="Use aria-label to provide a meaningful accessible name for the navigation landmark."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="w-full space-y-2">
            <Stepper
              steps={basicSteps}
              value={ariaLabelStep}
              onValueChange={(id) => setAriaLabelStep(id as number)}
              isStepClickable={() => true}
              aria-label="Checkout Progress"
              classes={c.stepper}
            />
            <p
              className={`text-sm text-cl-text-secondary`}
            >
              The navigation landmark has{" "}
              <code
                className={`px-1 rounded text-xs font-mono bg-cl-bg-elevated text-cl-text-secondary`}
              >
                aria-label=&quot;Checkout Progress&quot;
              </code>
            </p>
          </div>
        </DemoWrapper>
      </Section>

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
              className={`text-sm text-cl-text-secondary`}
            >
              Hover over each step to see the tooltip
            </p>
          </div>
        </DemoWrapper>
      </Section>

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
                itemIndicator: `shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold border-2 border-transparent transition-colors data-[status=active]:bg-cl-accent data-[status=active]:text-cl-on-accent data-[status=active]:border-cl-border-input-focus data-[status=completed]:bg-cl-accent data-[status=completed]:text-cl-on-accent data-[status=completed]:border-cl-accent data-[status=pending]:bg-black/[0.06] data-[status=pending]:text-cl-text-secondary data-[status=pending]:border-black/[0.08] dark:data-[status=pending]:bg-white/10 dark:data-[status=pending]:border-white/15`,
                itemIcon: "w-5 h-5",
              }}
            />
            <p
              className={`text-sm text-cl-text-secondary`}
            >
              Uses{" "}
              <code
                className={`px-1 rounded text-xs font-mono bg-cl-bg-elevated text-cl-text-secondary`}
              >
                data-[status]
              </code>{" "}
              selectors for per-status styling
            </p>
          </div>
        </DemoWrapper>
      </Section>

      <Section
        title="Custom Step Rendering"
        description="Use renderStep for fully custom step rendering. You receive the render props and the default element."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <Stepper
            steps={basicSteps}
            value={renderStepStep}
            onValueChange={(id) => setRenderStepStep(id as number)}
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
                      className={`flex items-center gap-2 px-3 py-2 rounded-cl-lg bg-cl-accent/10 border border-cl-border-input-focus dark:bg-cl-accent/20 dark:border dark:border-cl-border-input-focus/30`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-cl-accent text-cl-on-accent`}
                      >
                        {props.index + 1}
                      </div>
                      <span
                        className={`text-sm font-semibold text-cl-accent`}
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

      {/* ─── Reference — generated from the schema and the .ai.md ──────── */}
      <ComponentDocs name="Stepper" />

      {/* ─── Accessibility ────────────────────────────────────────────── */}

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
