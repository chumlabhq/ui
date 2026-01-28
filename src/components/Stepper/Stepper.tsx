import {
  forwardRef,
  memo,
  useId,
  isValidElement,
  type ComponentType,
  type ReactNode,
} from "react";
import type {
  StepperProps,
  StepItemProps,
  StepStatus,
  IconProps,
  StepTooltipConfig,
} from "./types";
import { CheckIcon, ErrorIcon, DotIcon } from "./icons";
import { Tooltip } from "../Tooltip";

const renderIcon = (
  icon: ComponentType<IconProps> | ReactNode | undefined,
  className: string,
): ReactNode => {
  if (!icon) return null;
  if (isValidElement(icon)) return icon;
  const IconComponent = icon as ComponentType<IconProps>;
  return <IconComponent className={className} />;
};

const isTooltipConfig = (
  tooltip: ReactNode | StepTooltipConfig,
): tooltip is StepTooltipConfig => {
  return (
    tooltip !== null &&
    typeof tooltip === "object" &&
    !isValidElement(tooltip) &&
    "content" in tooltip
  );
};

const StepItem = memo(function StepItem({
  step,
  index,
  status,
  isClickable,
  isLast,
  variant,
  orientation,
  labelPosition,
  showLabels,
  showDescriptions,
  showConnectors,
  completedIcon,
  errorIcon,
  onClick,
  showTooltips,
  tooltipSide,
  tooltipAlign,
  tooltipSideOffset,
  tooltipAlignOffset,
  tooltipMaxWidth,
  tooltipDelayDuration,
  tooltipShowArrow,
  tooltipArrowColor,
  tooltipShadow,
  tooltipContentClassName,
  tooltipContentStyle,
  tooltipArrowClassName,
  tooltipArrowStyle,
  stepContainerClassName,
  stepClassName,
  stepActiveClassName,
  stepCompletedClassName,
  stepPendingClassName,
  stepErrorClassName,
  stepDisabledClassName,
  indicatorClassName,
  indicatorActiveClassName,
  indicatorCompletedClassName,
  indicatorPendingClassName,
  indicatorErrorClassName,
  indicatorIconClassName,
  labelClassName,
  labelActiveClassName,
  labelCompletedClassName,
  labelPendingClassName,
  labelErrorClassName,
  descriptionClassName,
  descriptionActiveClassName,
  descriptionCompletedClassName,
  descriptionPendingClassName,
  descriptionErrorClassName,
  connectorClassName,
  connectorActiveClassName,
  connectorCompletedClassName,
  connectorPendingClassName,
  connectorErrorClassName,
}: StepItemProps) {
  const stepStatusClassName = {
    active: stepActiveClassName,
    completed: stepCompletedClassName,
    pending: stepPendingClassName,
    error: stepErrorClassName,
  }[status];

  const indicatorStatusClassName = {
    active: indicatorActiveClassName,
    completed: indicatorCompletedClassName,
    pending: indicatorPendingClassName,
    error: indicatorErrorClassName,
  }[status];

  const labelStatusClassName = {
    active: labelActiveClassName,
    completed: labelCompletedClassName,
    pending: labelPendingClassName,
    error: labelErrorClassName,
  }[status];

  const descriptionStatusClassName = {
    active: descriptionActiveClassName,
    completed: descriptionCompletedClassName,
    pending: descriptionPendingClassName,
    error: descriptionErrorClassName,
  }[status];

  const connectorStatusClassName = {
    active: connectorActiveClassName,
    completed: connectorCompletedClassName,
    pending: connectorPendingClassName,
    error: connectorErrorClassName,
  }[status];

  const getIndicatorContent = () => {
    if (status === "completed") {
      const icon = step.completedIcon || completedIcon;
      if (icon) return renderIcon(icon, indicatorIconClassName);
      if (variant === "dot")
        return <DotIcon className={indicatorIconClassName} />;
      return <CheckIcon className={indicatorIconClassName} />;
    }

    if (status === "error") {
      const icon = step.errorIcon || errorIcon;
      if (icon) return renderIcon(icon, indicatorIconClassName);
      return <ErrorIcon className={indicatorIconClassName} />;
    }

    if (variant === "icon" && step.icon) {
      return renderIcon(step.icon, indicatorIconClassName);
    }

    if (variant === "dot") {
      return <DotIcon className={indicatorIconClassName} />;
    }

    return index + 1;
  };

  const isHorizontal = orientation === "horizontal";
  const isLabelBottom = labelPosition === "bottom";

  const handleClick = isClickable && !step.disabled ? onClick : undefined;
  const handleKeyDown =
    isClickable && !step.disabled
      ? (e: React.KeyboardEvent) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick();
          }
        }
      : undefined;

  const wrapWithTooltip = (content: ReactNode): ReactNode => {
    if (!showTooltips || !step.tooltip) return content;

    const stepTooltip = step.tooltip;
    const tooltipConfig = isTooltipConfig(stepTooltip)
      ? stepTooltip
      : { content: stepTooltip };

    return (
      <Tooltip
        content={tooltipConfig.content}
        side={tooltipConfig.side ?? tooltipSide}
        align={tooltipConfig.align ?? tooltipAlign}
        sideOffset={tooltipConfig.sideOffset ?? tooltipSideOffset}
        alignOffset={tooltipConfig.alignOffset ?? tooltipAlignOffset}
        maxWidth={tooltipConfig.maxWidth ?? tooltipMaxWidth}
        delayDuration={tooltipConfig.delayDuration ?? tooltipDelayDuration}
        showArrow={tooltipConfig.showArrow ?? tooltipShowArrow}
        arrowColor={tooltipConfig.arrowColor ?? tooltipArrowColor}
        shadow={tooltipConfig.shadow ?? tooltipShadow}
        contentClassName={
          tooltipConfig.contentClassName ?? tooltipContentClassName
        }
        contentStyle={tooltipConfig.contentStyle ?? tooltipContentStyle}
        arrowClassName={tooltipConfig.arrowClassName ?? tooltipArrowClassName}
        arrowStyle={tooltipConfig.arrowStyle ?? tooltipArrowStyle}
      >
        {content}
      </Tooltip>
    );
  };

  const indicator = (
    <div
      className={[indicatorClassName, indicatorStatusClassName]
        .filter(Boolean)
        .join(" ")}
      data-status={status}
    >
      {getIndicatorContent()}
    </div>
  );

  const labelContent =
    (showLabels || showDescriptions) && (step.label || step.description) ? (
      <div
        className={
          isLabelBottom ? "flex flex-col items-center" : "flex flex-col"
        }
      >
        {showLabels && step.label && (
          <span
            className={[labelClassName, labelStatusClassName]
              .filter(Boolean)
              .join(" ")}
            data-status={status}
          >
            {step.label}
          </span>
        )}
        {showDescriptions && step.description && (
          <span
            className={[descriptionClassName, descriptionStatusClassName]
              .filter(Boolean)
              .join(" ")}
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
        className={[connectorClassName, connectorStatusClassName]
          .filter(Boolean)
          .join(" ")}
        data-status={status}
        aria-hidden="true"
      />
    ) : null;

  if (isHorizontal) {
    const stepButton = (
      <div
        role="button"
        tabIndex={isClickable ? 0 : -1}
        aria-current={status === "active" ? "step" : undefined}
        aria-disabled={!isClickable || step.disabled}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={[
          stepClassName,
          stepStatusClassName,
          step.disabled ? stepDisabledClassName : "",
          isClickable && !step.disabled ? "cursor-pointer" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        data-status={status}
        data-disabled={step.disabled || undefined}
        data-clickable={isClickable || undefined}
      >
        {indicator}
        {labelContent}
      </div>
    );

    return (
      <div
        className={stepContainerClassName || undefined}
        data-status={status}
        data-orientation={orientation}
      >
        {wrapWithTooltip(stepButton)}
        {connector}
      </div>
    );
  }

  const stepButton = (
    <div
      role="button"
      tabIndex={isClickable ? 0 : -1}
      aria-current={status === "active" ? "step" : undefined}
      aria-disabled={!isClickable || step.disabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={[
        stepClassName,
        stepStatusClassName,
        step.disabled ? stepDisabledClassName : "",
        isClickable && !step.disabled ? "cursor-pointer" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      data-status={status}
      data-disabled={step.disabled || undefined}
      data-clickable={isClickable || undefined}
    >
      {indicator}
      {labelContent}
    </div>
  );

  return (
    <div
      className={stepContainerClassName || undefined}
      data-status={status}
      data-orientation={orientation}
    >
      {wrapWithTooltip(stepButton)}
      {connector}
    </div>
  );
});

const Stepper = forwardRef<HTMLDivElement, StepperProps>(
  (
    {
      steps = [],
      activeStep,
      orientation = "horizontal",
      variant = "numbered",
      onChange,
      isStepClickable,
      getStepStatus,
      showLabels = true,
      showDescriptions = false,
      showConnectors = true,
      labelPosition = "right",
      completedIcon,
      errorIcon,
      fullWidth = false,
      showTooltips = false,
      tooltipSide = "top",
      tooltipAlign = "center",
      tooltipSideOffset = 6,
      tooltipAlignOffset = 0,
      tooltipMaxWidth = 300,
      tooltipDelayDuration = 200,
      tooltipShowArrow = true,
      tooltipArrowColor,
      tooltipShadow = "lg",
      tooltipContentClassName = "",
      tooltipContentStyle,
      tooltipArrowClassName = "",
      tooltipArrowStyle,
      className = "",
      containerClassName = "",
      stepContainerClassName = "",
      stepClassName = "",
      stepActiveClassName = "",
      stepCompletedClassName = "",
      stepPendingClassName = "",
      stepErrorClassName = "",
      stepDisabledClassName = "",
      indicatorClassName = "",
      indicatorActiveClassName = "",
      indicatorCompletedClassName = "",
      indicatorPendingClassName = "",
      indicatorErrorClassName = "",
      indicatorIconClassName = "",
      labelClassName = "",
      labelActiveClassName = "",
      labelCompletedClassName = "",
      labelPendingClassName = "",
      labelErrorClassName = "",
      descriptionClassName = "",
      descriptionActiveClassName = "",
      descriptionCompletedClassName = "",
      descriptionPendingClassName = "",
      descriptionErrorClassName = "",
      connectorClassName = "",
      connectorActiveClassName = "",
      connectorCompletedClassName = "",
      connectorPendingClassName = "",
      connectorErrorClassName = "",
      ...rest
    },
    ref,
  ) => {
    const generatedId = useId();
    const stepperId = rest.id || generatedId;

    const activeIndex = steps.findIndex((step) => step.id === activeStep);

    const defaultGetStepStatus = (
      _stepId: string | number,
      index: number,
      currentActiveIndex: number,
    ): StepStatus => {
      if (currentActiveIndex === -1) return "pending";
      if (index < currentActiveIndex) return "completed";
      if (index === currentActiveIndex) return "active";
      return "pending";
    };

    const defaultIsStepClickable = (
      _stepId: string | number,
      status: StepStatus,
    ): boolean => {
      return status === "completed" || status === "active";
    };

    const getStatus = getStepStatus || defaultGetStepStatus;
    const checkClickable = isStepClickable || defaultIsStepClickable;

    const fullWidthClass = fullWidth ? "w-full" : "";

    return (
      <div
        ref={ref}
        id={stepperId}
        role="navigation"
        aria-label="Progress"
        className={
          [containerClassName, fullWidthClass].filter(Boolean).join(" ") ||
          undefined
        }
        data-orientation={orientation}
        data-variant={variant}
        {...rest}
      >
        <div className={className || undefined} data-orientation={orientation}>
          {steps.map((step, index) => {
            const status = getStatus(step.id, index, activeIndex);
            const clickable = !step.disabled && checkClickable(step.id, status);

            return (
              <StepItem
                key={step.id}
                step={step}
                index={index}
                status={status}
                isClickable={clickable}
                isFirst={index === 0}
                isLast={index === steps.length - 1}
                variant={variant}
                orientation={orientation}
                labelPosition={labelPosition}
                showLabels={showLabels}
                showDescriptions={showDescriptions}
                showConnectors={showConnectors}
                completedIcon={completedIcon}
                errorIcon={errorIcon}
                onClick={() => onChange?.(step.id)}
                showTooltips={showTooltips}
                tooltipSide={tooltipSide}
                tooltipAlign={tooltipAlign}
                tooltipSideOffset={tooltipSideOffset}
                tooltipAlignOffset={tooltipAlignOffset}
                tooltipMaxWidth={tooltipMaxWidth}
                tooltipDelayDuration={tooltipDelayDuration}
                tooltipShowArrow={tooltipShowArrow}
                tooltipArrowColor={tooltipArrowColor}
                tooltipShadow={tooltipShadow}
                tooltipContentClassName={tooltipContentClassName}
                tooltipContentStyle={tooltipContentStyle}
                tooltipArrowClassName={tooltipArrowClassName}
                tooltipArrowStyle={tooltipArrowStyle}
                stepContainerClassName={stepContainerClassName}
                stepClassName={stepClassName}
                stepActiveClassName={stepActiveClassName}
                stepCompletedClassName={stepCompletedClassName}
                stepPendingClassName={stepPendingClassName}
                stepErrorClassName={stepErrorClassName}
                stepDisabledClassName={stepDisabledClassName}
                indicatorClassName={indicatorClassName}
                indicatorActiveClassName={indicatorActiveClassName}
                indicatorCompletedClassName={indicatorCompletedClassName}
                indicatorPendingClassName={indicatorPendingClassName}
                indicatorErrorClassName={indicatorErrorClassName}
                indicatorIconClassName={indicatorIconClassName}
                labelClassName={labelClassName}
                labelActiveClassName={labelActiveClassName}
                labelCompletedClassName={labelCompletedClassName}
                labelPendingClassName={labelPendingClassName}
                labelErrorClassName={labelErrorClassName}
                descriptionClassName={descriptionClassName}
                descriptionActiveClassName={descriptionActiveClassName}
                descriptionCompletedClassName={descriptionCompletedClassName}
                descriptionPendingClassName={descriptionPendingClassName}
                descriptionErrorClassName={descriptionErrorClassName}
                connectorClassName={connectorClassName}
                connectorActiveClassName={connectorActiveClassName}
                connectorCompletedClassName={connectorCompletedClassName}
                connectorPendingClassName={connectorPendingClassName}
                connectorErrorClassName={connectorErrorClassName}
              />
            );
          })}
        </div>
      </div>
    );
  },
);

Stepper.displayName = "Stepper";

export default memo(Stepper);
