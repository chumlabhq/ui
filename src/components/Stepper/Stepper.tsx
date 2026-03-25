import {
  forwardRef,
  Fragment,
  memo,
  useId,
  useCallback,
  useRef,
  useEffect,
  useMemo,
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
import {
  DEFAULT_STEPPER_CLASSES,
  UNSTYLED_STEPPER_CLASSES,
} from "./utils/constants";

const EMPTY_TOOLTIP_DEFAULTS: StepperTooltipDefaults = {};

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

const INDICATOR_SIZE: Record<string, string> = {
  dot: "w-3 h-3",
  icon: "w-10 h-10",
  numbered: "w-8 h-8 text-sm font-medium",
};

/** Default indicator pixel sizes per variant (used for connector alignment) */
const INDICATOR_PX: Record<string, number> = {
  dot: 12,
  icon: 40,
  numbered: 32,
};

const ICON_SIZE: Record<string, string> = {
  dot: "w-full h-full",
  icon: "w-5 h-5",
  numbered: "w-4 h-4",
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
  indicatorPx: number;
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
  classes: Required<StepperClasses>;
  nextStepStatus?: StepStatus;
}

const getStatusClass = (
  status: StepStatus,
  active: string,
  completed: string,
  pending: string,
  error: string,
): string => {
  switch (status) {
    case "active":
      return active;
    case "completed":
      return completed;
    case "pending":
      return pending;
    case "error":
      return error;
  }
};

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
  indicatorPx,
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

  const indicatorSizeClass = INDICATOR_SIZE[variant] ?? INDICATOR_SIZE.numbered;
  const iconSizeClass = ICON_SIZE[variant] ?? ICON_SIZE.numbered;

  const iconClassName = cn(iconSizeClass, classes.indicatorIcon);

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

  const indicatorStatusClass = getStatusClass(
    status,
    classes.indicatorActive,
    classes.indicatorCompleted,
    classes.indicatorPending,
    classes.indicatorError,
  );

  const indicator = (
    <div
      className={cn(
        indicatorSizeClass,
        classes.indicator,
        indicatorStatusClass,
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
          classes.labelWrapper,
          isLabelBottom && classes.labelWrapperBottom,
        )}
      >
        {showLabels && step.label && (
          <span
            className={cn(
              classes.label,
              getStatusClass(
                status,
                classes.labelActive,
                classes.labelCompleted,
                classes.labelPending,
                classes.labelError,
              ),
            )}
            data-status={status}
          >
            {step.label}
          </span>
        )}
        {showDescriptions && step.description && (
          <span
            className={cn(
              classes.description,
              getStatusClass(
                status,
                classes.descriptionActive,
                classes.descriptionCompleted,
                classes.descriptionPending,
                classes.descriptionError,
              ),
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
            ? classes.connectorHorizontal
            : classes.connectorVertical,
          classes.connector,
          getStatusClass(
            status,
            classes.connectorActive,
            classes.connectorCompleted,
            classes.connectorPending,
            classes.connectorError,
          ),
        )}
        data-status={status}
        data-next-status={nextStepStatus}
        aria-hidden="true"
      />
    ) : null;

  // ─── Shared interactive wrapper props ──────────────────────────────
  const sharedAriaLabel =
    stepAriaLabel ||
    (isHorizontal && isLabelBottom && typeof step.label === "string"
      ? step.label
      : stepAriaLabel);

  // ─── VERTICAL LAYOUT ─────────────────────────────────────────────
  if (!isHorizontal) {
    // Connector margin: step padding-left (8px from px-2) + half indicator width
    const stepPaddingLeft = 8; // px-2 = 0.5rem = 8px
    const connectorMarginLeft = stepPaddingLeft + indicatorPx / 2;

    const verticalConnector =
      showConnectors && !isLast ? (
        <div
          className={cn(
            classes.connectorVertical,
            classes.connector,
            getStatusClass(
              status,
              classes.connectorActive,
              classes.connectorCompleted,
              classes.connectorPending,
              classes.connectorError,
            ),
          )}
          style={{ marginLeft: connectorMarginLeft }}
          data-status={status}
          data-next-status={nextStepStatus}
          aria-hidden="true"
        />
      ) : null;

    const stepContent = isInteractive ? (
      <button
        ref={(el) => setStepRef(index, el)}
        type="button"
        tabIndex={isTabbable ? 0 : -1}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        aria-current={status === "active" ? "step" : undefined}
        aria-label={sharedAriaLabel}
        className={cn(classes.step, classes.stepInteractive)}
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
        aria-label={sharedAriaLabel}
        className={cn(classes.step, isDisabled && classes.stepDisabled)}
        data-status={status}
        data-disabled={isDisabled || undefined}
      >
        {indicator}
        {labelContent}
      </div>
    );

    return (
      <li
        className={cn("flex flex-col", classes.stepContainer)}
        data-status={status}
        data-orientation={orientation}
      >
        {wrapWithTooltip(stepContent)}
        {verticalConnector}
      </li>
    );
  }

  // ─── HORIZONTAL LAYOUT ────────────────────────────────────────────
  //
  // Connectors are rendered as SEPARATE <li> elements by the Stepper
  // parent (between step <li> items). This StepItem only renders the
  // step itself.
  //
  // labelPosition="right":
  //   Button wraps [indicator + label] in a horizontal row.
  //   Connector <li> sits between steps at the same vertical center.
  //
  // labelPosition="bottom":
  //   The <li> uses a 2-row CSS grid so that:
  //   - Row 1: indicator (button) — fixed height, connector aligns here
  //   - Row 2: label/description — below, handled by CSS, never affects
  //     the connector's vertical position
  //   The button wraps ONLY the indicator. The label is a separate
  //   element in row 2. This cleanly separates concerns.

  if (isLabelBottom) {
    // Button wraps only the indicator for clean connector alignment
    const indicatorEl = isInteractive ? (
      <button
        ref={(el) => setStepRef(index, el)}
        type="button"
        tabIndex={isTabbable ? 0 : -1}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        aria-current={status === "active" ? "step" : undefined}
        aria-label={
          typeof step.label === "string"
            ? step.label
            : `Step ${index + 1} of ${totalSteps}`
        }
        className="cursor-pointer rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        data-status={status}
        data-clickable="true"
      >
        {indicator}
      </button>
    ) : (
      <div
        ref={(el) => setStepRef(index, el)}
        role="group"
        aria-current={status === "active" ? "step" : undefined}
        aria-disabled={isDisabled || undefined}
        aria-label={
          typeof step.label === "string"
            ? step.label
            : `Step ${index + 1} of ${totalSteps}`
        }
        className={isDisabled ? classes.stepDisabled : undefined}
        data-status={status}
        data-disabled={isDisabled || undefined}
      >
        {indicator}
      </div>
    );

    return (
      <li
        className={cn(
          "shrink-0 flex flex-col items-center",
          classes.stepContainer,
        )}
        data-status={status}
        data-orientation={orientation}
      >
        {wrapWithTooltip(indicatorEl)}
        {labelContent && (
          <div className="mt-2">
            {labelContent}
          </div>
        )}
      </li>
    );
  }

  // labelPosition="right" — button wraps indicator + label together
  const stepContent = isInteractive ? (
    <button
      ref={(el) => setStepRef(index, el)}
      type="button"
      tabIndex={isTabbable ? 0 : -1}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-current={status === "active" ? "step" : undefined}
      aria-label={stepAriaLabel}
      className={cn(classes.step, classes.stepInteractive)}
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
      className={cn(classes.step, isDisabled && classes.stepDisabled)}
      data-status={status}
      data-disabled={isDisabled || undefined}
    >
      {indicator}
      {labelContent}
    </div>
  );

  return (
    <li
      className={cn("shrink-0", classes.stepContainer)}
      data-status={status}
      data-orientation={orientation}
    >
      {wrapWithTooltip(stepContent)}
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
      indicatorSize: indicatorSizeProp,
      classes: classesProp,
      unstyled = false,
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
    const baseClasses = unstyled
      ? UNSTYLED_STEPPER_CLASSES
      : DEFAULT_STEPPER_CLASSES;

    const mergedClasses: Required<StepperClasses> = useMemo(
      () => ({
        root: classesProp?.root ?? baseClasses.root,
        list: classesProp?.list ?? baseClasses.list,
        stepContainer: classesProp?.stepContainer ?? baseClasses.stepContainer,
        step: classesProp?.step ?? baseClasses.step,
        stepInteractive:
          classesProp?.stepInteractive ?? baseClasses.stepInteractive,
        stepDisabled: classesProp?.stepDisabled ?? baseClasses.stepDisabled,
        indicator: classesProp?.indicator ?? baseClasses.indicator,
        indicatorIcon:
          classesProp?.indicatorIcon ?? baseClasses.indicatorIcon,
        indicatorActive:
          classesProp?.indicatorActive ?? baseClasses.indicatorActive,
        indicatorCompleted:
          classesProp?.indicatorCompleted ?? baseClasses.indicatorCompleted,
        indicatorPending:
          classesProp?.indicatorPending ?? baseClasses.indicatorPending,
        indicatorError:
          classesProp?.indicatorError ?? baseClasses.indicatorError,
        labelWrapper: classesProp?.labelWrapper ?? baseClasses.labelWrapper,
        labelWrapperBottom:
          classesProp?.labelWrapperBottom ?? baseClasses.labelWrapperBottom,
        label: classesProp?.label ?? baseClasses.label,
        labelActive: classesProp?.labelActive ?? baseClasses.labelActive,
        labelCompleted:
          classesProp?.labelCompleted ?? baseClasses.labelCompleted,
        labelPending: classesProp?.labelPending ?? baseClasses.labelPending,
        labelError: classesProp?.labelError ?? baseClasses.labelError,
        description: classesProp?.description ?? baseClasses.description,
        descriptionActive:
          classesProp?.descriptionActive ?? baseClasses.descriptionActive,
        descriptionCompleted:
          classesProp?.descriptionCompleted ??
          baseClasses.descriptionCompleted,
        descriptionPending:
          classesProp?.descriptionPending ?? baseClasses.descriptionPending,
        descriptionError:
          classesProp?.descriptionError ?? baseClasses.descriptionError,
        connector: classesProp?.connector ?? baseClasses.connector,
        connectorHorizontal:
          classesProp?.connectorHorizontal ?? baseClasses.connectorHorizontal,
        connectorVertical:
          classesProp?.connectorVertical ?? baseClasses.connectorVertical,
        connectorActive:
          classesProp?.connectorActive ?? baseClasses.connectorActive,
        connectorCompleted:
          classesProp?.connectorCompleted ?? baseClasses.connectorCompleted,
        connectorPending:
          classesProp?.connectorPending ?? baseClasses.connectorPending,
        connectorError:
          classesProp?.connectorError ?? baseClasses.connectorError,
      }),
      [classesProp, baseClasses],
    );

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
        className={cn(fullWidth && "w-full", mergedClasses.root, className)}
        style={style}
        data-orientation={orientation}
        data-variant={variant}
        data-disabled={disabled || undefined}
      >
        <ol
          className={cn(
            orientation === "horizontal"
              ? `flex w-full ${labelPosition === "bottom" ? "items-start" : "items-center"}`
              : "flex flex-col",
            mergedClasses.list,
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
            const isLast = index === steps.length - 1;
            const nextStatus =
              !isLast
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
              isLast,
              variant,
              indicatorPx: indicatorSizeProp ?? INDICATOR_PX[variant] ?? 32,
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
              classes: mergedClasses,
              nextStepStatus: nextStatus,
            };

            const stepElement = renderStep
              ? (() => {
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
                })()
              : <StepItem key={step.id} {...itemProps} />;

            // For horizontal mode, render connector between steps (not inside them).
            // The connector is a separate flex item in the <ol> that fills space.
            // For labelPosition="bottom" + items-start, offset the connector to
            // align with indicator center.
            if (orientation === "horizontal" && showConnectors && !isLast) {
              const indicatorPx = indicatorSizeProp ?? INDICATOR_PX[variant] ?? 32;
              const connectorStyle = labelPosition === "bottom"
                ? { marginTop: indicatorPx / 2 - 1 }
                : undefined;

              return (
                <Fragment key={step.id}>
                  {stepElement}
                  <li
                    role="presentation"
                    aria-hidden="true"
                    className="flex-1 min-w-4 px-2"
                  >
                    <div
                      className={cn(
                        mergedClasses.connectorHorizontal,
                        mergedClasses.connector,
                        getStatusClass(
                          status,
                          mergedClasses.connectorActive,
                          mergedClasses.connectorCompleted,
                          mergedClasses.connectorPending,
                          mergedClasses.connectorError,
                        ),
                      )}
                      style={connectorStyle}
                      data-status={status}
                      data-next-status={nextStatus}
                    />
                  </li>
                </Fragment>
              );
            }

            return stepElement;
          })}
        </ol>
      </div>
    );
  },
);

Stepper.displayName = "Stepper";

export default Stepper;
