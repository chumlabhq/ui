import { useState } from "react";
import Stepper from "../../components/Stepper";
import type {
  Step,
  StepStatus,
  StepTooltipConfig,
} from "../../components/Stepper";
import { Section, ComponentHeader } from "./components";

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

const StepperDemo = () => {
  const [basicStep, setBasicStep] = useState<number>(2);
  const [connectorStep, setConnectorStep] = useState<number>(2);
  const [checkoutStep, setCheckoutStep] = useState<string>("payment");
  const [verticalStep, setVerticalStep] = useState<number>(2);
  const [dotStep, setDotStep] = useState<number>(3);
  const [errorStep, setErrorStep] = useState<number>(2);
  const [customStep, setCustomStep] = useState<number>(2);
  const [tooltipStep, setTooltipStep] = useState<number>(2);
  const [tooltipConfigStep, setTooltipConfigStep] = useState<number>(2);

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

  return (
    <>
      <ComponentHeader
        title="Stepper"
        description="A navigation component that displays progress through a sequence of steps."
      />

      <Section title="Basic Numbered Stepper">
        <Stepper
          steps={basicSteps}
          activeStep={basicStep}
          onChange={(id) => setBasicStep(id as number)}
          className="flex flex-row items-center"
          stepContainerClassName="flex items-center"
          stepClassName="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-50"
          indicatorClassName="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
          indicatorActiveClassName="bg-blue-600 text-white"
          indicatorCompletedClassName="bg-green-500 text-white"
          indicatorPendingClassName="bg-gray-200 text-gray-600"
          indicatorIconClassName="w-4 h-4"
          labelClassName="text-sm font-medium"
          labelActiveClassName="text-blue-600"
          labelCompletedClassName="text-green-600"
          labelPendingClassName="text-gray-500"
          connectorClassName="flex-1 h-px min-w-8 bg-gray-200"
          connectorCompletedClassName="bg-green-500"
          connectorActiveClassName="bg-blue-200"
        />
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => setBasicStep(Math.max(1, basicStep - 1))}
            className="px-4 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Previous
          </button>
          <button
            onClick={() => setBasicStep(Math.min(4, basicStep + 1))}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Next
          </button>
        </div>
      </Section>

      <Section title="Horizontal with Connectors">
        <Stepper
          steps={basicSteps}
          activeStep={connectorStep}
          onChange={(id) => setConnectorStep(id as number)}
          className="flex flex-row items-center"
          stepContainerClassName="flex items-center"
          stepClassName="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-50"
          indicatorClassName="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold border-2"
          indicatorActiveClassName="bg-blue-600 text-white border-blue-600"
          indicatorCompletedClassName="bg-green-500 text-white border-green-500"
          indicatorPendingClassName="bg-white text-gray-400 border-gray-300"
          indicatorIconClassName="w-5 h-5"
          labelClassName="text-sm font-medium"
          labelActiveClassName="text-blue-600"
          labelCompletedClassName="text-green-600"
          labelPendingClassName="text-gray-400"
          connectorClassName="flex-1 h-0.5 min-w-12 mx-1 bg-gray-200 rounded-full"
          connectorCompletedClassName="bg-green-500"
          connectorActiveClassName="bg-blue-300"
        />
        <p className="mt-3 text-sm text-gray-500">
          Horizontal stepper with visible connector lines between steps. The
          connector uses{" "}
          <code className="bg-gray-100 px-1 rounded">flex-1</code> to expand and
          fill available space.
        </p>
      </Section>

      <Section title="Icon Stepper with Descriptions">
        <Stepper
          steps={checkoutSteps}
          activeStep={checkoutStep}
          onChange={(id) => setCheckoutStep(id as string)}
          variant="icon"
          showDescriptions
          labelPosition="bottom"
          className="flex flex-row items-start"
          stepContainerClassName="flex items-center"
          stepClassName="flex flex-col items-center px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors"
          indicatorClassName="w-12 h-12 rounded-full flex items-center justify-center"
          indicatorActiveClassName="bg-blue-600 text-white"
          indicatorCompletedClassName="bg-green-500 text-white"
          indicatorPendingClassName="bg-gray-100 text-gray-400"
          indicatorIconClassName="w-6 h-6"
          labelClassName="text-sm font-medium mt-2"
          labelActiveClassName="text-blue-600"
          labelCompletedClassName="text-green-600"
          labelPendingClassName="text-gray-500"
          descriptionClassName="text-xs"
          descriptionActiveClassName="text-blue-500"
          descriptionCompletedClassName="text-green-500"
          descriptionPendingClassName="text-gray-400"
          connectorClassName="flex-1 h-0.5 min-w-8 mx-2 mt-6 bg-gray-200"
          connectorCompletedClassName="bg-green-500"
          connectorActiveClassName="bg-blue-200"
        />
      </Section>

      <Section title="Vertical Stepper">
        <Stepper
          steps={basicSteps}
          activeStep={verticalStep}
          onChange={(id) => setVerticalStep(id as number)}
          orientation="vertical"
          className="flex flex-col"
          stepContainerClassName="flex flex-col"
          stepClassName="flex items-center gap-3 py-1"
          indicatorClassName="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0"
          indicatorActiveClassName="bg-blue-600 text-white"
          indicatorCompletedClassName="bg-green-500 text-white"
          indicatorPendingClassName="bg-gray-200 text-gray-600"
          indicatorIconClassName="w-4 h-4"
          labelClassName="text-sm font-medium"
          labelActiveClassName="text-blue-600"
          labelCompletedClassName="text-green-600"
          labelPendingClassName="text-gray-500"
          connectorClassName="w-0.5 h-6 ml-4 bg-gray-200"
          connectorCompletedClassName="bg-green-500"
          connectorActiveClassName="bg-blue-200"
        />
      </Section>

      <Section title="Dot Variant">
        <Stepper
          steps={basicSteps}
          activeStep={dotStep}
          onChange={(id) => setDotStep(id as number)}
          variant="dot"
          showLabels={false}
          className="flex flex-row items-center justify-center"
          stepContainerClassName="flex items-center"
          stepClassName="px-1 py-1"
          indicatorClassName="w-3 h-3 rounded-full transition-all"
          indicatorActiveClassName="bg-blue-600 scale-150"
          indicatorCompletedClassName="bg-green-500"
          indicatorPendingClassName="bg-gray-300"
          indicatorIconClassName="w-full h-full"
          connectorClassName="w-8 h-0.5 mx-1 bg-gray-200"
          connectorCompletedClassName="bg-green-500"
          connectorActiveClassName="bg-blue-200"
        />
      </Section>

      <Section title="Error State">
        <Stepper
          steps={[
            { id: 1, label: "Account" },
            { id: 2, label: "Verification" },
            { id: 3, label: "Complete" },
          ]}
          activeStep={errorStep}
          onChange={(id) => setErrorStep(id as number)}
          getStepStatus={errorGetStatus}
          className="flex flex-row items-center"
          stepContainerClassName="flex items-center"
          stepClassName="flex items-center gap-2 px-2 py-1 rounded-lg"
          indicatorClassName="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
          indicatorActiveClassName="bg-blue-600 text-white"
          indicatorCompletedClassName="bg-green-500 text-white"
          indicatorPendingClassName="bg-gray-200 text-gray-600"
          indicatorErrorClassName="bg-red-500 text-white"
          indicatorIconClassName="w-4 h-4"
          labelClassName="text-sm font-medium"
          labelActiveClassName="text-blue-600"
          labelCompletedClassName="text-green-600"
          labelPendingClassName="text-gray-500"
          labelErrorClassName="text-red-500"
          connectorClassName="flex-1 h-px min-w-8 bg-gray-200"
          connectorCompletedClassName="bg-green-500"
          connectorActiveClassName="bg-blue-200"
        />
      </Section>

      <Section title="Disabled Steps">
        <Stepper
          steps={[
            { id: 1, label: "Step 1" },
            { id: 2, label: "Step 2" },
            { id: 3, label: "Step 3", disabled: true },
            { id: 4, label: "Step 4" },
          ]}
          activeStep={2}
          onChange={() => {}}
          isStepClickable={() => true}
          className="flex flex-row items-center"
          stepContainerClassName="flex items-center"
          stepClassName="flex items-center gap-2 px-2 py-1 rounded-lg"
          stepDisabledClassName="opacity-50 cursor-not-allowed"
          indicatorClassName="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
          indicatorActiveClassName="bg-blue-600 text-white"
          indicatorCompletedClassName="bg-green-500 text-white"
          indicatorPendingClassName="bg-gray-200 text-gray-600"
          indicatorIconClassName="w-4 h-4"
          labelClassName="text-sm font-medium"
          labelActiveClassName="text-blue-600"
          labelCompletedClassName="text-green-600"
          labelPendingClassName="text-gray-500"
          connectorClassName="flex-1 h-px min-w-8 bg-gray-200"
          connectorCompletedClassName="bg-green-500"
        />
      </Section>

      <Section title="Custom Styling">
        <Stepper
          steps={[
            { id: 1, label: "Design" },
            { id: 2, label: "Develop" },
            { id: 3, label: "Deploy" },
          ]}
          activeStep={customStep}
          onChange={(id) => setCustomStep(id as number)}
          className="flex flex-row items-center gap-2"
          stepContainerClassName="flex items-center"
          stepClassName="flex items-center gap-2 px-3 py-2 rounded-2xl border-2 border-transparent hover:border-purple-200 transition-all"
          stepActiveClassName="bg-purple-50 border-purple-300"
          indicatorClassName="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all"
          indicatorActiveClassName="bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-200"
          indicatorCompletedClassName="bg-gradient-to-br from-green-400 to-emerald-500 text-white"
          indicatorPendingClassName="bg-gray-100 text-gray-400 border border-gray-200"
          indicatorIconClassName="w-5 h-5"
          labelClassName="text-sm font-semibold"
          labelActiveClassName="text-purple-700"
          labelCompletedClassName="text-emerald-600"
          labelPendingClassName="text-gray-400"
          connectorClassName="flex-1 h-1 min-w-8 mx-1 rounded-full bg-gray-100"
          connectorCompletedClassName="bg-gradient-to-r from-green-400 to-emerald-500"
          connectorActiveClassName="bg-gradient-to-r from-purple-200 to-purple-300"
        />
      </Section>

      <Section title="Non-linear Navigation">
        <Stepper
          steps={basicSteps}
          activeStep={2}
          onChange={() => {}}
          isStepClickable={() => true}
          className="flex flex-row items-center"
          stepContainerClassName="flex items-center"
          stepClassName="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-blue-50 cursor-pointer"
          indicatorClassName="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
          indicatorActiveClassName="bg-blue-600 text-white"
          indicatorCompletedClassName="bg-green-500 text-white"
          indicatorPendingClassName="bg-gray-200 text-gray-600 hover:bg-gray-300"
          indicatorIconClassName="w-4 h-4"
          labelClassName="text-sm font-medium"
          labelActiveClassName="text-blue-600"
          labelCompletedClassName="text-green-600"
          labelPendingClassName="text-gray-500"
          connectorClassName="flex-1 h-px min-w-8 bg-gray-200"
          connectorCompletedClassName="bg-green-500"
        />
        <p className="mt-2 text-sm text-gray-500">
          All steps are clickable regardless of status
        </p>
      </Section>

      <Section title="With Tooltips (Simple)">
        <Stepper
          steps={tooltipSteps}
          activeStep={tooltipStep}
          onChange={(id) => setTooltipStep(id as number)}
          showTooltips
          tooltipSide="top"
          tooltipDelayDuration={100}
          className="flex flex-row items-center"
          stepContainerClassName="flex items-center"
          stepClassName="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-50"
          indicatorClassName="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
          indicatorActiveClassName="bg-blue-600 text-white"
          indicatorCompletedClassName="bg-green-500 text-white"
          indicatorPendingClassName="bg-gray-200 text-gray-600"
          indicatorIconClassName="w-4 h-4"
          labelClassName="text-sm font-medium"
          labelActiveClassName="text-blue-600"
          labelCompletedClassName="text-green-600"
          labelPendingClassName="text-gray-500"
          connectorClassName="flex-1 h-px min-w-8 bg-gray-200"
          connectorCompletedClassName="bg-green-500"
          connectorActiveClassName="bg-blue-200"
        />
        <p className="mt-3 text-sm text-gray-500">
          Hover over each step to see the tooltip. Enable with{" "}
          <code className="bg-gray-100 px-1 rounded">showTooltips</code> and add{" "}
          <code className="bg-gray-100 px-1 rounded">tooltip</code> to each
          step.
        </p>
      </Section>

      <Section title="With Tooltips (Custom Config)">
        <Stepper
          steps={tooltipConfigSteps}
          activeStep={tooltipConfigStep}
          onChange={(id) => setTooltipConfigStep(id as number)}
          showTooltips
          className="flex flex-row items-center"
          stepContainerClassName="flex items-center"
          stepClassName="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors"
          indicatorClassName="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold border-2"
          indicatorActiveClassName="bg-purple-600 text-white border-purple-600"
          indicatorCompletedClassName="bg-green-500 text-white border-green-500"
          indicatorPendingClassName="bg-white text-gray-400 border-gray-300"
          indicatorIconClassName="w-5 h-5"
          labelClassName="text-sm font-medium"
          labelActiveClassName="text-purple-600"
          labelCompletedClassName="text-green-600"
          labelPendingClassName="text-gray-400"
          connectorClassName="flex-1 h-0.5 min-w-12 mx-1 bg-gray-200 rounded-full"
          connectorCompletedClassName="bg-green-500"
          connectorActiveClassName="bg-purple-300"
        />
        <p className="mt-3 text-sm text-gray-500">
          Each step can have custom tooltip configuration including position,
          content (JSX), max width, and shadow.
        </p>
      </Section>

      <Section title="Stepper Props">
        <div className="overflow-x-auto w-full">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Prop
                </th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Type
                </th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Default
                </th>
                <th className="text-left py-2 font-medium text-gray-900">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">steps</td>
                <td className="py-2 pr-4 text-gray-600">Step[]</td>
                <td className="py-2 pr-4 text-gray-500">[]</td>
                <td className="py-2 text-gray-600">Array of step objects</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  activeStep
                </td>
                <td className="py-2 pr-4 text-gray-600">string | number</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">Currently active step ID</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  orientation
                </td>
                <td className="py-2 pr-4 text-gray-600">
                  "horizontal" | "vertical"
                </td>
                <td className="py-2 pr-4 text-gray-500">"horizontal"</td>
                <td className="py-2 text-gray-600">Layout direction</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">variant</td>
                <td className="py-2 pr-4 text-gray-600">
                  "numbered" | "icon" | "dot"
                </td>
                <td className="py-2 pr-4 text-gray-500">"numbered"</td>
                <td className="py-2 text-gray-600">
                  Visual style of step indicators
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">onChange</td>
                <td className="py-2 pr-4 text-gray-600">(stepId) =&gt; void</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  Callback when a step is clicked
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  isStepClickable
                </td>
                <td className="py-2 pr-4 text-gray-600">
                  (stepId, status) =&gt; boolean
                </td>
                <td className="py-2 pr-4 text-gray-500">
                  completed/active only
                </td>
                <td className="py-2 text-gray-600">
                  Custom logic for step clickability
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  getStepStatus
                </td>
                <td className="py-2 pr-4 text-gray-600">
                  (stepId, index, activeIndex) =&gt; StepStatus
                </td>
                <td className="py-2 pr-4 text-gray-500">auto-calculated</td>
                <td className="py-2 text-gray-600">
                  Custom status logic (pending/active/completed/error)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  showLabels
                </td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">true</td>
                <td className="py-2 text-gray-600">Show step labels</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  showDescriptions
                </td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">false</td>
                <td className="py-2 text-gray-600">Show step descriptions</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  showConnectors
                </td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">true</td>
                <td className="py-2 text-gray-600">
                  Show connectors between steps
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  labelPosition
                </td>
                <td className="py-2 pr-4 text-gray-600">"bottom" | "right"</td>
                <td className="py-2 pr-4 text-gray-500">"right"</td>
                <td className="py-2 text-gray-600">
                  Position of labels relative to indicator
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  completedIcon
                </td>
                <td className="py-2 pr-4 text-gray-600">
                  ComponentType | ReactNode
                </td>
                <td className="py-2 pr-4 text-gray-500">CheckIcon</td>
                <td className="py-2 text-gray-600">Icon for completed steps</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">errorIcon</td>
                <td className="py-2 pr-4 text-gray-600">
                  ComponentType | ReactNode
                </td>
                <td className="py-2 pr-4 text-gray-500">ErrorIcon</td>
                <td className="py-2 text-gray-600">Icon for error steps</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">fullWidth</td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">false</td>
                <td className="py-2 text-gray-600">
                  Whether container takes full width
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  showTooltips
                </td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">false</td>
                <td className="py-2 text-gray-600">
                  Enable tooltips on steps with tooltip content
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  tooltipSide
                </td>
                <td className="py-2 pr-4 text-gray-600">
                  "top" | "right" | "bottom" | "left"
                </td>
                <td className="py-2 pr-4 text-gray-500">"top"</td>
                <td className="py-2 text-gray-600">Default tooltip position</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  tooltipAlign
                </td>
                <td className="py-2 pr-4 text-gray-600">
                  "start" | "center" | "end"
                </td>
                <td className="py-2 pr-4 text-gray-500">"center"</td>
                <td className="py-2 text-gray-600">
                  Default tooltip alignment
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  tooltipSideOffset
                </td>
                <td className="py-2 pr-4 text-gray-600">number</td>
                <td className="py-2 pr-4 text-gray-500">6</td>
                <td className="py-2 text-gray-600">
                  Distance from trigger element (px)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  tooltipAlignOffset
                </td>
                <td className="py-2 pr-4 text-gray-600">number</td>
                <td className="py-2 pr-4 text-gray-500">0</td>
                <td className="py-2 text-gray-600">
                  Offset from aligned edge (px)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  tooltipDelayDuration
                </td>
                <td className="py-2 pr-4 text-gray-600">number</td>
                <td className="py-2 pr-4 text-gray-500">200</td>
                <td className="py-2 text-gray-600">
                  Delay before showing tooltip (ms)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  tooltipMaxWidth
                </td>
                <td className="py-2 pr-4 text-gray-600">string | number</td>
                <td className="py-2 pr-4 text-gray-500">300</td>
                <td className="py-2 text-gray-600">Maximum width of tooltip</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  tooltipShowArrow
                </td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">true</td>
                <td className="py-2 text-gray-600">Show tooltip arrow</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  tooltipShadow
                </td>
                <td className="py-2 pr-4 text-gray-600">TooltipShadow</td>
                <td className="py-2 pr-4 text-gray-500">"lg"</td>
                <td className="py-2 text-gray-600">
                  Tooltip shadow preset or custom value
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  tooltipContentClassName
                </td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">""</td>
                <td className="py-2 text-gray-600">
                  Custom class for tooltip content
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  tooltipContentStyle
                </td>
                <td className="py-2 pr-4 text-gray-600">CSSProperties</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  Inline styles for tooltip content
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  tooltipArrowColor
                </td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  Custom color for tooltip arrow
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  tooltipArrowClassName
                </td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">""</td>
                <td className="py-2 text-gray-600">
                  Custom class for tooltip arrow
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  tooltipArrowStyle
                </td>
                <td className="py-2 pr-4 text-gray-600">CSSProperties</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  Inline styles for tooltip arrow
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Step Object Properties">
        <div className="overflow-x-auto w-full">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Property
                </th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Type
                </th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Required
                </th>
                <th className="text-left py-2 font-medium text-gray-900">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">id</td>
                <td className="py-2 pr-4 text-gray-600">string | number</td>
                <td className="py-2 pr-4 text-gray-500">Yes</td>
                <td className="py-2 text-gray-600">
                  Unique identifier for the step
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">label</td>
                <td className="py-2 pr-4 text-gray-600">ReactNode</td>
                <td className="py-2 pr-4 text-gray-500">No</td>
                <td className="py-2 text-gray-600">Step label text</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  description
                </td>
                <td className="py-2 pr-4 text-gray-600">ReactNode</td>
                <td className="py-2 pr-4 text-gray-500">No</td>
                <td className="py-2 text-gray-600">Step description text</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">icon</td>
                <td className="py-2 pr-4 text-gray-600">
                  ComponentType | ReactNode
                </td>
                <td className="py-2 pr-4 text-gray-500">No</td>
                <td className="py-2 text-gray-600">Custom icon for the step</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  completedIcon
                </td>
                <td className="py-2 pr-4 text-gray-600">
                  ComponentType | ReactNode
                </td>
                <td className="py-2 pr-4 text-gray-500">No</td>
                <td className="py-2 text-gray-600">
                  Icon when step is completed
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">errorIcon</td>
                <td className="py-2 pr-4 text-gray-600">
                  ComponentType | ReactNode
                </td>
                <td className="py-2 pr-4 text-gray-500">No</td>
                <td className="py-2 text-gray-600">Icon when step has error</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">disabled</td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">No</td>
                <td className="py-2 text-gray-600">
                  Whether the step is disabled
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">tooltip</td>
                <td className="py-2 pr-4 text-gray-600">
                  ReactNode | StepTooltipConfig
                </td>
                <td className="py-2 pr-4 text-gray-500">No</td>
                <td className="py-2 text-gray-600">
                  Tooltip content or configuration object
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="StepTooltipConfig Properties">
        <div className="overflow-x-auto w-full">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Property
                </th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Type
                </th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Required
                </th>
                <th className="text-left py-2 font-medium text-gray-900">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">content</td>
                <td className="py-2 pr-4 text-gray-600">ReactNode</td>
                <td className="py-2 pr-4 text-gray-500">Yes</td>
                <td className="py-2 text-gray-600">
                  Tooltip content (text or JSX)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">side</td>
                <td className="py-2 pr-4 text-gray-600">
                  "top" | "right" | "bottom" | "left"
                </td>
                <td className="py-2 pr-4 text-gray-500">No</td>
                <td className="py-2 text-gray-600">
                  Override tooltip position for this step
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">align</td>
                <td className="py-2 pr-4 text-gray-600">
                  "start" | "center" | "end"
                </td>
                <td className="py-2 pr-4 text-gray-500">No</td>
                <td className="py-2 text-gray-600">
                  Override tooltip alignment for this step
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">sideOffset</td>
                <td className="py-2 pr-4 text-gray-600">number</td>
                <td className="py-2 pr-4 text-gray-500">No</td>
                <td className="py-2 text-gray-600">
                  Distance from trigger element (px)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">alignOffset</td>
                <td className="py-2 pr-4 text-gray-600">number</td>
                <td className="py-2 pr-4 text-gray-500">No</td>
                <td className="py-2 text-gray-600">
                  Offset from aligned edge (px)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">maxWidth</td>
                <td className="py-2 pr-4 text-gray-600">string | number</td>
                <td className="py-2 pr-4 text-gray-500">No</td>
                <td className="py-2 text-gray-600">
                  Maximum width of tooltip
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">delayDuration</td>
                <td className="py-2 pr-4 text-gray-600">number</td>
                <td className="py-2 pr-4 text-gray-500">No</td>
                <td className="py-2 text-gray-600">
                  Delay before showing (ms)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">showArrow</td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">No</td>
                <td className="py-2 text-gray-600">
                  Show tooltip arrow
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">arrowColor</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">No</td>
                <td className="py-2 text-gray-600">
                  Custom color for tooltip arrow
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">shadow</td>
                <td className="py-2 pr-4 text-gray-600">TooltipShadow</td>
                <td className="py-2 pr-4 text-gray-500">No</td>
                <td className="py-2 text-gray-600">
                  Tooltip shadow preset
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">contentClassName</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">No</td>
                <td className="py-2 text-gray-600">
                  Custom class for tooltip content
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">contentStyle</td>
                <td className="py-2 pr-4 text-gray-600">CSSProperties</td>
                <td className="py-2 pr-4 text-gray-500">No</td>
                <td className="py-2 text-gray-600">
                  Inline styles for tooltip content
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">arrowClassName</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">No</td>
                <td className="py-2 text-gray-600">
                  Custom class for tooltip arrow
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">arrowStyle</td>
                <td className="py-2 pr-4 text-gray-600">CSSProperties</td>
                <td className="py-2 pr-4 text-gray-500">No</td>
                <td className="py-2 text-gray-600">
                  Inline styles for tooltip arrow
                </td>
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
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Prop
                </th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Type
                </th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Default
                </th>
                <th className="text-left py-2 font-medium text-gray-900">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  containerClassName
                </td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">""</td>
                <td className="py-2 text-gray-600">Outer container wrapper</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">className</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">""</td>
                <td className="py-2 text-gray-600">Steps flex container</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  stepContainerClassName
                </td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">""</td>
                <td className="py-2 text-gray-600">Individual step wrapper</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  stepClassName
                </td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">""</td>
                <td className="py-2 text-gray-600">
                  Clickable step area (base)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  stepActiveClassName
                </td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">""</td>
                <td className="py-2 text-gray-600">Step area when active</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  stepCompletedClassName
                </td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">""</td>
                <td className="py-2 text-gray-600">Step area when completed</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  stepPendingClassName
                </td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">""</td>
                <td className="py-2 text-gray-600">Step area when pending</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  stepErrorClassName
                </td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">""</td>
                <td className="py-2 text-gray-600">Step area when error</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  stepDisabledClassName
                </td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">""</td>
                <td className="py-2 text-gray-600">Step area when disabled</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  indicatorClassName
                </td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">""</td>
                <td className="py-2 text-gray-600">
                  Step number/icon indicator (base)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  indicatorActiveClassName
                </td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">""</td>
                <td className="py-2 text-gray-600">Indicator when active</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  indicatorCompletedClassName
                </td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">""</td>
                <td className="py-2 text-gray-600">Indicator when completed</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  indicatorPendingClassName
                </td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">""</td>
                <td className="py-2 text-gray-600">Indicator when pending</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  indicatorErrorClassName
                </td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">""</td>
                <td className="py-2 text-gray-600">Indicator when error</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  indicatorIconClassName
                </td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">""</td>
                <td className="py-2 text-gray-600">
                  Icon inside the indicator
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  labelClassName
                </td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">""</td>
                <td className="py-2 text-gray-600">Step label text (base)</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  labelActiveClassName
                </td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">""</td>
                <td className="py-2 text-gray-600">Label when active</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  labelCompletedClassName
                </td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">""</td>
                <td className="py-2 text-gray-600">Label when completed</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  labelPendingClassName
                </td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">""</td>
                <td className="py-2 text-gray-600">Label when pending</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  labelErrorClassName
                </td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">""</td>
                <td className="py-2 text-gray-600">Label when error</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  descriptionClassName
                </td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">""</td>
                <td className="py-2 text-gray-600">
                  Step description text (base)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  descriptionActiveClassName
                </td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">""</td>
                <td className="py-2 text-gray-600">Description when active</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  descriptionCompletedClassName
                </td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">""</td>
                <td className="py-2 text-gray-600">
                  Description when completed
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  descriptionPendingClassName
                </td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">""</td>
                <td className="py-2 text-gray-600">Description when pending</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  descriptionErrorClassName
                </td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">""</td>
                <td className="py-2 text-gray-600">Description when error</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  connectorClassName
                </td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">""</td>
                <td className="py-2 text-gray-600">
                  Connector line between steps (base)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  connectorActiveClassName
                </td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">""</td>
                <td className="py-2 text-gray-600">Connector when active</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  connectorCompletedClassName
                </td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">""</td>
                <td className="py-2 text-gray-600">Connector when completed</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  connectorPendingClassName
                </td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">""</td>
                <td className="py-2 text-gray-600">Connector when pending</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  connectorErrorClassName
                </td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">""</td>
                <td className="py-2 text-gray-600">Connector when error</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>
    </>
  );
};

export default StepperDemo;
