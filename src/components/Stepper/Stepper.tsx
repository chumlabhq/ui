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
} from "./utils/types.js";
import { CheckIcon, ErrorIcon, DotIcon } from "./utils/icons.js";
import { Tooltip } from "../Tooltip/index.js";
import { cn } from "../../utils/scopedCn.js";
import { useControllableState } from "../../utils/useControllableState.js";
import { useReducedMotion } from "../../utils/useReducedMotion.js";
import { isTooltipConfig } from "../../utils/isTooltipConfig.js";
import {
  DEFAULT_STEPPER_CLASSES,
  UNSTYLED_STEPPER_CLASSES,
  INDICATOR_SIZE,
  ICON_SIZE,
} from "./utils/constants.js";
import { structuralOnly, motionSafeClasses } from "../../utils/classLayers.js";

const EMPTY_TOOLTIP_DEFAULTS: StepperTooltipDefaults = {};

const REACT_MEMO_TYPE = Symbol.for("react.memo");
const REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref");

// Type guard isolates the unsafe assertion to a single, named, documented
// place. React's exotic component types (memo, forwardRef) carry $$typeof
// at runtime but aren't structurally assignable to ComponentType from
// ReactNode — so the guard does the runtime check, and the cast is the
// minimum needed once the check has narrowed the value.
function isExoticIconComponent(
  value: unknown,
): value is ComponentType<IconProps> {
  if (typeof value !== "object" || value === null) return false;
  if (!("$$typeof" in value)) return false;
  const sym = (value as { $$typeof: symbol }).$$typeof;
  return sym === REACT_MEMO_TYPE || sym === REACT_FORWARD_REF_TYPE;
}

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
  if (isExoticIconComponent(icon)) {
    const IconComp = icon;
    return <IconComp className={className} />;
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

/** Default indicator pixel sizes per variant (used for connector alignment) */
const INDICATOR_PX: Record<string, number> = {
  dot: 12,
  icon: 40,
  numbered: 32,
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
  /** Variant sizing, already split by `unstyled` at the parent. */
  sizeClasses: { indicator: string; icon: string };
  nextStepStatus?: StepStatus;
}

/**
 * `data-status` is this component's own enum
 * (completed | active | pending | error). `data-state` is the library-wide one,
 * and `error` is not a position in it — an errored step is still active or
 * pending — so it carries `data-invalid` alongside rather than replacing the
 * state.
 */
const stateAttrsFor = (status: string) =>
  ({
    "data-state":
      status === "completed" ? "completed" : status === "active" ? "active" : "inactive",
    "data-invalid": status === "error" ? true : undefined,
  }) as const;

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
  sizeClasses,
  nextStepStatus,
}: StepItemInternalProps) {
  const isHorizontal = orientation === "horizontal";
  const isLabelBottom = labelPosition === "bottom";
  const isInteractive = isClickable;

  const indicatorSizeClass = sizeClasses.indicator;
  const iconSizeClass = sizeClasses.icon;

  const iconClassName = cn(iconSizeClass, classes.itemIcon);

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
  const stepLabelText = typeof step.label === "string"
    ? step.label
    : `Step ${index + 1} of ${totalSteps}`;
  const statusSuffix = status === "completed" ? ", completed"
    : status === "error" ? ", error"
    : status === "active" ? ", current"
    : "";
  const stepAriaLabel = needsAriaLabel
    ? `${stepLabelText}${statusSuffix}`
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
        classes={{
          content: config.contentClassName ?? tooltipDefaults.contentClassName,
          arrow: config.arrowClassName ?? tooltipDefaults.arrowClassName,
        }}
        contentStyle={config.contentStyle ?? tooltipDefaults.contentStyle}
        arrowStyle={config.arrowStyle ?? tooltipDefaults.arrowStyle}
      >
        {content}
      </Tooltip>
    );
  };
  const indicatorStatusClass = undefined;

  const indicator = (
    <div
      className={cn(
        indicatorSizeClass,
        classes.itemIndicator,
        indicatorStatusClass,
      )}
      data-status={status}
      {...stateAttrsFor(status)}
      aria-hidden="true"
    >
      {getIndicatorContent()}
    </div>
  );

  const labelContent =
    (showLabels || showDescriptions) && (step.label || step.description) ? (
      <div
        className={cn(
          classes.row,
        )}
        data-align={isLabelBottom ? "bottom" : undefined}
      >
        {showLabels && step.label && (
          <span
            className={cn(
              classes.itemText,
            )}
            data-status={status}
      {...stateAttrsFor(status)}
          >
            {step.label}
          </span>
        )}
        {showDescriptions && step.description && (
          <span
            className={cn(
              classes.description,
            )}
            data-status={status}
      {...stateAttrsFor(status)}
          >
            {step.description}
          </span>
        )}
      </div>
    ) : null;

  const sharedAriaLabel =
    stepAriaLabel ||
    (showLabels ? (statusSuffix ? `${stepLabelText}${statusSuffix}` : undefined) : undefined);

  if (!isHorizontal) {
    // Connector margin: step padding-left (8px from px-2) + half indicator width
    const stepPaddingLeft = 8; // px-2 = 0.5rem = 8px
    const connectorMarginLeft = stepPaddingLeft + indicatorPx / 2;

    const verticalConnector =
      showConnectors && !isLast ? (
        <div
          className={cn(
            classes.separator,
          )}
          style={{ marginLeft: connectorMarginLeft }}
          data-orientation={orientation}
          data-status={status}
      {...stateAttrsFor(status)}
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
        className={classes.trigger}
        data-status={status}
      {...stateAttrsFor(status)}
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
        className={classes.trigger}
        data-status={status}
      {...stateAttrsFor(status)}
        data-disabled={isDisabled || undefined}
      >
        {indicator}
        {labelContent}
      </div>
    );

    return (
      <li
        className={classes.item}
        data-status={status}
      {...stateAttrsFor(status)}
        data-orientation={orientation}
        // ADR 002 R4: the states stepDisabled and stepInteractive named. Clickable
        // is not the inverse of disabled — a step ahead of the current one is
        // neither clickable nor disabled.
        data-disabled={isDisabled || undefined}
        data-clickable={isClickable || undefined}
      >
        {wrapWithTooltip(stepContent)}
        {verticalConnector}
      </li>
    );
  }

  if (isLabelBottom) {
    // Button wraps only the indicator for clean connector alignment
    const bottomAriaLabel = `${stepLabelText}${statusSuffix}`;

    const indicatorEl = isInteractive ? (
      <button
        ref={(el) => setStepRef(index, el)}
        type="button"
        tabIndex={isTabbable ? 0 : -1}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        aria-current={status === "active" ? "step" : undefined}
        aria-label={bottomAriaLabel}
        className={classes.indicatorTrigger}
        data-status={status}
      {...stateAttrsFor(status)}
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
        aria-label={bottomAriaLabel}
        
        data-status={status}
      {...stateAttrsFor(status)}
        data-disabled={isDisabled || undefined}
      >
        {indicator}
      </div>
    );

    return (
      <li
        className={cn(
          classes.item,
        )}
        data-status={status}
      {...stateAttrsFor(status)}
        data-disabled={isDisabled || undefined}
        data-clickable={isClickable || undefined}
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

  const stepContent = isInteractive ? (
    <button
      ref={(el) => setStepRef(index, el)}
      type="button"
      tabIndex={isTabbable ? 0 : -1}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-current={status === "active" ? "step" : undefined}
      aria-label={stepAriaLabel}
      className={classes.trigger}
      data-status={status}
      {...stateAttrsFor(status)}
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
      className={classes.trigger}
      data-status={status}
      {...stateAttrsFor(status)}
      data-disabled={isDisabled || undefined}
    >
      {indicator}
      {labelContent}
    </div>
  );

  return (
    <li
      className={classes.item}
      data-status={status}
      {...stateAttrsFor(status)}
      data-orientation={orientation}
      data-disabled={isDisabled || undefined}
      data-clickable={isClickable || undefined}
    >
      {wrapWithTooltip(stepContent)}
    </li>
  );
});

/**
 * Component: Stepper
 *
 * Purpose: Step progress indicator with numbered/icon variants, horizontal/vertical
 * layouts, clickable steps, and keyboard navigation.
 *
 * AI Usage Guidelines:
 * - Pass `steps` array with `id` and `label`
 * - Use `value` + `onValueChange` for controlled active step
 * - Use `isStepClickable` to control which steps are interactive
 * - Use `variant="icon"` for icon-based indicators
 *
 * Reference: STEPPER.ai.md (this directory), src/pages/demo/StepperDemo.tsx
 */
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
      reduceMotion,
      renderStep,
      beforeStepChange,
    },
    ref,
  ) => {
    const prefersReducedMotion = useReducedMotion(reduceMotion);
    const baseClassesRaw = unstyled
      ? UNSTYLED_STEPPER_CLASSES
      : DEFAULT_STEPPER_CLASSES;
    const baseClasses = motionSafeClasses(baseClassesRaw, prefersReducedMotion);

    // Variant sizing is a default class set like any other, so it takes the
    // same ADR 001 split: `w-7 h-7` survives `unstyled`, `text-xs font-medium`
    // does not. Resolved here because `variant` is a Stepper-level prop.
    const variantSizeClasses = useMemo(() => {
      const raw = {
        indicator: INDICATOR_SIZE[variant] ?? INDICATOR_SIZE.numbered,
        icon: ICON_SIZE[variant] ?? ICON_SIZE.numbered,
      };
      return unstyled ? structuralOnly(raw) : raw;
    }, [variant, unstyled]);

    const mergedClasses: Required<StepperClasses> = useMemo(
      () => ({
        root: cn(baseClasses.root, classesProp?.root),
        list: cn(baseClasses.list, classesProp?.list),
        item: cn(baseClasses.item, classesProp?.item),
        trigger: cn(baseClasses.trigger, classesProp?.trigger),
        itemIndicator: cn(baseClasses.itemIndicator, classesProp?.itemIndicator),
        indicatorTrigger:
          cn(baseClasses.indicatorTrigger, classesProp?.indicatorTrigger),
        itemIcon:
          cn(baseClasses.itemIcon, classesProp?.itemIcon),
        row: cn(baseClasses.row, classesProp?.row),
        itemText: cn(baseClasses.itemText, classesProp?.itemText),
        description: cn(baseClasses.description, classesProp?.description),
        separator: cn(baseClasses.separator, classesProp?.separator),
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
      component: "Stepper",
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
        data-reduce-motion={prefersReducedMotion || undefined}
      >
        <ol
          className={cn(
            orientation === "horizontal"
              ? `flex w-full overflow-x-auto ${labelPosition === "bottom" ? "items-start" : "items-center"}`
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
              sizeClasses: variantSizeClasses,
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
                    className="flex-1 min-w-2 px-1 sm:min-w-4 sm:px-2"
                  >
                    <div
                      className={cn(
                        mergedClasses.separator,
                      )}
                      style={connectorStyle}
                      data-orientation={orientation}
                      data-status={status}
      {...stateAttrsFor(status)}
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
