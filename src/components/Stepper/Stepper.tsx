import {
  forwardRef,
  Fragment,
  memo,
  useId,
  useCallback,
  useRef,
  useEffect,
  isValidElement,
  type ComponentType,
  type ReactNode,
  type KeyboardEvent,
  type FocusEvent,
} from "react";
import type {
  StepperProps,
  StepStatus,
  IconProps,
  StepTooltipConfig,
  StepperTooltipDefaults,
  StepperClasses,
  StepRenderProps,
  Step,
} from "./utils/types";
import { CheckIcon, ErrorIcon, DotIcon } from "./utils/icons";
import { Tooltip } from "../Tooltip";
import { cn } from "../../utils/cn";
import { useControllableState } from "../../utils/useControllableState";
import { isTooltipConfig } from "../../utils/isTooltipConfig";

const EMPTY_TOOLTIP_DEFAULTS: StepperTooltipDefaults = {};
const EMPTY_CLASSES: StepperClasses = {};

const REACT_MEMO_TYPE = Symbol.for("react.memo");
const REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref");

const renderIcon = (
  icon: ComponentType<IconProps> | ReactNode | undefined,
  className: string,
): ReactNode => {
  if (!icon) return null;
  if (typeof icon === "function") {
    const IconComp = icon as ComponentType<IconProps>;
    return <IconComp className={className} />;
  }
  if (isValidElement(icon)) return icon;
  if (typeof icon === "object" && icon !== null && "$$typeof" in icon) {
    const sym = (icon as { $$typeof: symbol }).$$typeof;
    if (sym === REACT_MEMO_TYPE || sym === REACT_FORWARD_REF_TYPE) {
      const IconComp = icon as unknown as ComponentType<IconProps>;
      return <IconComp className={className} />;
    }
  }
  return null;
};

const defaultGetStepStatus = (
  _stepId: string | number,
  index: number,
  activeIndex: number,
): StepStatus => {
  if (activeIndex === -1) return "pending";
  if (index < activeIndex) return "completed";
  if (index === activeIndex) return "active";
  return "pending";
};

const defaultIsStepClickable = (
  _stepId: string | number,
  status: StepStatus,
): boolean => status === "completed" || status === "active";

const INDICATOR_STATUS: Record<StepStatus, string> = {
  active: "bg-blue-600 text-white",
  completed: "bg-green-500 text-white",
  pending: "bg-gray-200 text-gray-600",
  error: "bg-red-500 text-white",
};

const LABEL_STATUS: Record<StepStatus, string> = {
  active: "text-blue-600",
  completed: "text-green-600",
  pending: "text-gray-500",
  error: "text-red-500",
};

const DESCRIPTION_STATUS: Record<StepStatus, string> = {
  active: "text-blue-500",
  completed: "text-green-500",
  pending: "text-gray-400",
  error: "text-red-400",
};

const CONNECTOR_STATUS: Record<StepStatus, string> = {
  active: "bg-blue-200",
  completed: "bg-green-500",
  pending: "",
  error: "",
};

interface StepItemInternalProps {
  step: Step;
  index: number;
  totalSteps: number;
  status: StepStatus;
  isClickable: boolean;
  isDisabled: boolean;
  isTabbable: boolean;
  isLast: boolean;
  variant: "numbered" | "icon" | "dot";
  orientation: "horizontal" | "vertical";
  labelPosition: "bottom" | "right";
  showLabels: boolean;
  showDescriptions: boolean;
  showConnectors: boolean;
  completedIcon?: ComponentType<IconProps> | ReactNode;
  errorIcon?: ComponentType<IconProps> | ReactNode;
  onStepClick: (stepId: string | number) => void;
  onStepKeyDown: (e: KeyboardEvent<HTMLElement>, index: number) => void;
  setStepRef: (index: number, el: HTMLElement | null) => void;
  showTooltips: boolean;
  tooltipDefaults: StepperTooltipDefaults;
  classes: StepperClasses;
  nextStepStatus?: StepStatus;
}

const StepItem = memo(function StepItem({
  step,
  index,
  totalSteps,
  status,
  isClickable,
  isDisabled,
  isTabbable,
  isLast,
  variant,
  orientation,
  labelPosition,
  showLabels,
  showDescriptions,
  showConnectors,
  completedIcon,
  errorIcon,
  onStepClick,
  onStepKeyDown,
  setStepRef,
  showTooltips,
  tooltipDefaults,
  classes,
  nextStepStatus,
}: StepItemInternalProps) {
  const isHorizontal = orientation === "horizontal";
  const isLabelBottom = labelPosition === "bottom";
  const isInteractive = isClickable;

  const indicatorBase =
    variant === "dot"
      ? "w-3 h-3 rounded-full flex items-center justify-center"
      : variant === "icon"
        ? "w-10 h-10 rounded-full flex items-center justify-center"
        : "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium";

  const iconBase =
    variant === "dot"
      ? "w-full h-full"
      : variant === "icon"
        ? "w-5 h-5"
        : "w-4 h-4";

  const iconClassName = cn(iconBase, classes.indicatorIcon);

  const getIndicatorContent = (): ReactNode => {
    if (status === "completed") {
      const icon = step.completedIcon || completedIcon;
      if (icon) return renderIcon(icon, iconClassName);
      if (variant === "dot") return <DotIcon className={iconClassName} />;
      return <CheckIcon className={iconClassName} />;
    }
    if (status === "error") {
      const icon = step.errorIcon || errorIcon;
      if (icon) return renderIcon(icon, iconClassName);
      return <ErrorIcon className={iconClassName} />;
    }
    if (variant === "icon" && step.icon) {
      return renderIcon(step.icon, iconClassName);
    }
    if (variant === "dot") {
      return <DotIcon className={iconClassName} />;
    }
    return <span aria-hidden="true">{index + 1}</span>;
  };

  const handleClick = () => onStepClick(step.id);
  const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    onStepKeyDown(e, index);
  };

  const needsAriaLabel = !showLabels || (variant === "dot" && !step.label);
  const stepAriaLabel = needsAriaLabel
    ? typeof step.label === "string"
      ? step.label
      : `Step ${index + 1} of ${totalSteps}`
    : undefined;

  const wrapWithTooltip = (content: ReactNode): ReactNode => {
    if (!showTooltips || !step.tooltip) return content;
    const stepTooltip = step.tooltip;
    const config = isTooltipConfig<StepTooltipConfig>(stepTooltip)
      ? stepTooltip
      : { content: stepTooltip };

    return (
      <Tooltip
        content={config.content}
        side={config.side ?? tooltipDefaults.side ?? "top"}
        align={config.align ?? tooltipDefaults.align ?? "center"}
        sideOffset={config.sideOffset ?? tooltipDefaults.sideOffset ?? 6}
        alignOffset={config.alignOffset ?? tooltipDefaults.alignOffset ?? 0}
        maxWidth={config.maxWidth ?? tooltipDefaults.maxWidth ?? 300}
        delayDuration={
          config.delayDuration ?? tooltipDefaults.delayDuration ?? 200
        }
        showArrow={config.showArrow ?? tooltipDefaults.showArrow ?? true}
        arrowColor={config.arrowColor ?? tooltipDefaults.arrowColor}
        shadow={config.shadow ?? tooltipDefaults.shadow ?? "lg"}
        contentClassName={
          config.contentClassName ?? tooltipDefaults.contentClassName
        }
        contentStyle={config.contentStyle ?? tooltipDefaults.contentStyle}
        arrowClassName={
          config.arrowClassName ?? tooltipDefaults.arrowClassName
        }
        arrowStyle={config.arrowStyle ?? tooltipDefaults.arrowStyle}
      >
        {content}
      </Tooltip>
    );
  };

  const indicator = (
    <div
      className={cn(
        indicatorBase,
        "shrink-0 transition-colors motion-reduce:transition-none",
        INDICATOR_STATUS[status],
        classes.indicator,
      )}
      data-status={status}
      aria-hidden="true"
    >
      {getIndicatorContent()}
    </div>
  );

  const labelContent =
    (showLabels || showDescriptions) && (step.label || step.description) ? (
      <div
        className={cn(
          "flex flex-col",
          isLabelBottom && "items-center",
          classes.labelWrapper,
        )}
      >
        {showLabels && step.label && (
          <span
            className={cn(
              "text-sm font-medium transition-colors motion-reduce:transition-none",
              LABEL_STATUS[status],
              classes.label,
            )}
            data-status={status}
          >
            {step.label}
          </span>
        )}
        {showDescriptions && step.description && (
          <span
            className={cn(
              "text-xs transition-colors motion-reduce:transition-none",
              DESCRIPTION_STATUS[status],
              classes.description,
            )}
            data-status={status}
          >
            {step.description}
          </span>
        )}
      </div>
    ) : null;

  const connector =
    showConnectors && !isLast ? (
      <div
        className={cn(
          isHorizontal
            ? "flex-1 h-px min-w-8 bg-gray-200"
            : "w-px h-6 ml-4 bg-gray-200",
          "transition-colors motion-reduce:transition-none",
          CONNECTOR_STATUS[status],
          classes.connector,
        )}
        data-status={status}
        data-next-status={nextStepStatus}
        aria-hidden="true"
      />
    ) : null;

  const stepBaseClassName = cn(
    "flex items-center gap-2 rounded-lg transition-colors motion-reduce:transition-none px-2 py-1.5",
    isLabelBottom && "flex-col px-3 py-2",
    classes.step,
  );

  const stepContent = isInteractive ? (
    <button
      ref={(el) => setStepRef(index, el)}
      type="button"
      tabIndex={isTabbable ? 0 : -1}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-current={status === "active" ? "step" : undefined}
      aria-label={stepAriaLabel}
      className={cn(
        stepBaseClassName,
        "cursor-pointer hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
      )}
      data-status={status}
      data-clickable="true"
    >
      {indicator}
      {labelContent}
    </button>
  ) : (
    <div
      ref={(el) => setStepRef(index, el)}
      role="group"
      aria-current={status === "active" ? "step" : undefined}
      aria-disabled={isDisabled || undefined}
      aria-label={stepAriaLabel}
      className={cn(
        stepBaseClassName,
        isDisabled && "opacity-50 cursor-not-allowed",
      )}
      data-status={status}
      data-disabled={isDisabled || undefined}
    >
      {indicator}
      {labelContent}
    </div>
  );

  return (
    <li
      className={cn(
        isHorizontal ? "flex items-center" : "flex flex-col",
        classes.stepContainer,
      )}
      data-status={status}
      data-orientation={orientation}
    >
      {wrapWithTooltip(stepContent)}
      {connector}
    </li>
  );
});

const Stepper = forwardRef<HTMLDivElement, StepperProps>(
  (
    {
      steps = [],
      value: valueProp,
      defaultValue,
      onValueChange,
      orientation = "horizontal",
      variant = "numbered",
      activationMode = "manual",
      isStepClickable,
      getStepStatus,
      showLabels = true,
      showDescriptions = false,
      showConnectors = true,
      labelPosition = "right",
      completedIcon,
      errorIcon,
      fullWidth = false,
      "aria-label": ariaLabel = "Progress",
      showTooltips = false,
      tooltipDefaults = EMPTY_TOOLTIP_DEFAULTS,
      classes: classesProp = EMPTY_CLASSES,
      className,
      style,
      id: idProp,
      disabled = false,
      loop = false,
      renderStep,
      beforeStepChange,
    },
    ref,
  ) => {
    const generatedId = useId();
    const stepperId = idProp || generatedId;

    const [activeValue, setActiveValue] = useControllableState<
      string | number
    >({
      value: valueProp,
      defaultValue: defaultValue ?? steps[0]?.id ?? "",
      onChange: onValueChange,
    });

    const activeStepExists = steps.some((s) => s.id === activeValue);
    const resolvedValue = activeStepExists
      ? activeValue
      : (steps[0]?.id ?? "");

    useEffect(() => {
      if (valueProp !== undefined) return;
      if (!activeStepExists && steps.length > 0) {
        setActiveValue(steps[0].id);
      }
    }, [steps, activeStepExists, valueProp, setActiveValue]);

    const activeIndex = steps.findIndex((step) => step.id === resolvedValue);
    const getStatus = getStepStatus || defaultGetStepStatus;
    const checkClickable = isStepClickable || defaultIsStepClickable;

    if (process.env.NODE_ENV !== "production") {
      if (
        valueProp !== undefined &&
        steps.length > 0 &&
        !steps.some((s) => s.id === valueProp)
      ) {
        const looseMatch = steps.find(
          (s) => String(s.id) === String(valueProp),
        );
        if (looseMatch) {
          console.warn(
            `Stepper: value ${JSON.stringify(valueProp)} (${typeof valueProp}) does not match any step ID. ` +
              `Did you mean ${JSON.stringify(looseMatch.id)} (${typeof looseMatch.id})? ` +
              `Step IDs use strict equality (===) for matching.`,
          );
        }
      }
    }

    const stepRefs = useRef<(HTMLElement | null)[]>([]);
    const getStatusRef = useRef(getStatus);
    const checkClickableRef = useRef(checkClickable);
    const beforeStepChangeRef = useRef(beforeStepChange);
    const resolvedValueRef = useRef(resolvedValue);
    const lastFocusedStepRef = useRef(-1);

    useEffect(() => {
      getStatusRef.current = getStatus;
      checkClickableRef.current = checkClickable;
      beforeStepChangeRef.current = beforeStepChange;
      resolvedValueRef.current = resolvedValue;
    });

    useEffect(() => {
      stepRefs.current = stepRefs.current.slice(0, steps.length);
    }, [steps.length]);

    const setStepRef = useCallback(
      (index: number, el: HTMLElement | null) => {
        stepRefs.current[index] = el;
      },
      [],
    );

    const handleStepClick = useCallback(
      (stepId: string | number) => {
        if (
          beforeStepChangeRef.current &&
          !beforeStepChangeRef.current(stepId, resolvedValueRef.current)
        ) {
          return;
        }
        setActiveValue(stepId);
      },
      [setActiveValue],
    );

    const handleStepKeyDown = useCallback(
      (e: KeyboardEvent<HTMLElement>, index: number) => {
        const isHorizontal = orientation === "horizontal";
        const direction = window.getComputedStyle(e.currentTarget).direction;
        const isRTL = direction === "rtl";

        let forwardKey: string;
        let backwardKey: string;

        if (isHorizontal) {
          forwardKey = isRTL ? "ArrowLeft" : "ArrowRight";
          backwardKey = isRTL ? "ArrowRight" : "ArrowLeft";
        } else {
          forwardKey = "ArrowDown";
          backwardKey = "ArrowUp";
        }

        const currentGetStatus = getStatusRef.current;
        const currentCheckClickable = checkClickableRef.current;

        const interactiveEntries = steps
          .map((step, idx) => ({ step, idx }))
          .filter(({ step, idx }) => {
            if (step.disabled || disabled) return false;
            const status = currentGetStatus(step.id, idx, activeIndex);
            return currentCheckClickable(step.id, status);
          });

        const currentInteractiveIndex = interactiveEntries.findIndex(
          ({ idx }) => idx === index,
        );

        if (currentInteractiveIndex < 0) return;

        let nextEntry: (typeof interactiveEntries)[0] | undefined;

        switch (e.key) {
          case forwardKey:
            e.preventDefault();
            if (loop) {
              nextEntry =
                interactiveEntries[
                  (currentInteractiveIndex + 1) % interactiveEntries.length
                ];
            } else {
              const nextIdx = Math.min(
                currentInteractiveIndex + 1,
                interactiveEntries.length - 1,
              );
              if (nextIdx === currentInteractiveIndex) return;
              nextEntry = interactiveEntries[nextIdx];
            }
            break;
          case backwardKey:
            e.preventDefault();
            if (loop) {
              nextEntry =
                interactiveEntries[
                  (currentInteractiveIndex - 1 + interactiveEntries.length) %
                    interactiveEntries.length
                ];
            } else {
              const prevIdx = Math.max(currentInteractiveIndex - 1, 0);
              if (prevIdx === currentInteractiveIndex) return;
              nextEntry = interactiveEntries[prevIdx];
            }
            break;
          case "Home":
            e.preventDefault();
            nextEntry = interactiveEntries[0];
            break;
          case "End":
            e.preventDefault();
            nextEntry = interactiveEntries[interactiveEntries.length - 1];
            break;
          default:
            return;
        }

        if (nextEntry) {
          stepRefs.current[nextEntry.idx]?.focus();
          if (activationMode === "automatic") {
            handleStepClick(nextEntry.step.id);
          }
        }
      },
      [
        steps,
        orientation,
        loop,
        disabled,
        activeIndex,
        activationMode,
        handleStepClick,
      ],
    );

    const tabbableIndex = (() => {
      const activeInteractiveIdx = steps.findIndex((step, idx) => {
        if (step.disabled || disabled) return false;
        const status = getStatus(step.id, idx, activeIndex);
        return idx === activeIndex && checkClickable(step.id, status);
      });
      if (activeInteractiveIdx >= 0) return activeInteractiveIdx;

      return steps.findIndex((step, idx) => {
        if (step.disabled || disabled) return false;
        const status = getStatus(step.id, idx, activeIndex);
        return checkClickable(step.id, status);
      });
    })();

    const handleListFocus = useCallback(
      (e: FocusEvent<HTMLOListElement>) => {
        const target = e.target as HTMLElement;
        const index = stepRefs.current.findIndex(
          (el) => el === target || el?.contains(target),
        );
        if (index >= 0) {
          lastFocusedStepRef.current = index;
        }
      },
      [],
    );

    const handleListBlur = useCallback(
      (e: FocusEvent<HTMLOListElement>) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          lastFocusedStepRef.current = -1;
        }
      },
      [],
    );

    useEffect(() => {
      const idx = lastFocusedStepRef.current;
      if (idx < 0 || idx >= steps.length) return;

      const el = stepRefs.current[idx];
      if (!el || el.tagName === "BUTTON") return;

      lastFocusedStepRef.current = -1;

      if (tabbableIndex >= 0) {
        stepRefs.current[tabbableIndex]?.focus();
      }
    });

    return (
      <div
        ref={ref}
        id={stepperId}
        role="navigation"
        aria-label={ariaLabel}
        className={cn(fullWidth && "w-full", classesProp.root, className)}
        style={style}
        data-orientation={orientation}
        data-variant={variant}
        data-disabled={disabled || undefined}
      >
        <ol
          className={cn(
            orientation === "horizontal"
              ? "flex items-center"
              : "flex flex-col",
            "list-none m-0 p-0",
            classesProp.list,
          )}
          data-orientation={orientation}
          onFocus={handleListFocus}
          onBlur={handleListBlur}
        >
          {steps.map((step, index) => {
            const status = getStatus(step.id, index, activeIndex);
            const isDisabled = step.disabled || disabled;
            const clickable = !isDisabled && checkClickable(step.id, status);
            const isTabbable = index === tabbableIndex;
            const nextStatus =
              index < steps.length - 1
                ? getStatus(steps[index + 1].id, index + 1, activeIndex)
                : undefined;

            const itemProps: StepItemInternalProps = {
              step,
              index,
              totalSteps: steps.length,
              status,
              isClickable: clickable,
              isDisabled,
              isTabbable,
              isLast: index === steps.length - 1,
              variant,
              orientation,
              labelPosition,
              showLabels,
              showDescriptions,
              showConnectors,
              completedIcon,
              errorIcon,
              onStepClick: handleStepClick,
              onStepKeyDown: handleStepKeyDown,
              setStepRef,
              showTooltips,
              tooltipDefaults,
              classes: classesProp,
              nextStepStatus: nextStatus,
            };

            if (renderStep) {
              const renderProps: StepRenderProps = {
                step,
                index,
                status,
                isClickable: clickable,
                isDisabled,
                nextStepStatus: nextStatus,
              };
              return (
                <Fragment key={step.id}>
                  {renderStep(
                    renderProps,
                    (<StepItem {...itemProps} />) as React.ReactElement,
                  )}
                </Fragment>
              );
            }

            return <StepItem key={step.id} {...itemProps} />;
          })}
        </ol>
      </div>
    );
  },
);

Stepper.displayName = "Stepper";

export default Stepper;
