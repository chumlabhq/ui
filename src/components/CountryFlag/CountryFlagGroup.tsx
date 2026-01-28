import React from "react";
import type {
  CountryFlagGroupProps,
  CountryFlagGroupCountProps,
  CountryFlagProps,
} from "./types";
import { Tooltip } from "../Tooltip";

export const CountryFlagGroup = ({
  children,
  max,
  showCountTooltip = false,
  countTooltipSide = "top",
  countTooltipAlign = "center",
  countTooltipClassName = "",
  className = "",
  itemClassName = "",
  countClassName = "",
}: CountryFlagGroupProps) => {
  const childArray = React.Children.toArray(children);
  const visibleChildren = max ? childArray.slice(0, max) : childArray;
  const remainingChildren = max ? childArray.slice(max) : [];
  const remainingCount = remainingChildren.length;

  const firstChild = visibleChildren[0];
  const size = React.isValidElement<CountryFlagProps>(firstChild)
    ? firstChild.props.size
    : "md";

  const remainingNames = showCountTooltip
    ? remainingChildren
        .map((child) => {
          if (React.isValidElement<CountryFlagProps>(child)) {
            return child.props.alt || child.props.code?.toUpperCase() || "";
          }
          return "";
        })
        .filter(Boolean)
    : [];

  const countTooltipContent =
    showCountTooltip && remainingNames.length > 0
      ? remainingNames.join(", ")
      : undefined;

  return (
    <div className={`flex -space-x-1.5 ${className}`}>
      {visibleChildren.map((child, index) => {
        if (React.isValidElement<CountryFlagProps>(child)) {
          return React.cloneElement(child, {
            key: index,
            className: `${itemClassName} ${child.props.className ?? ""}`.trim(),
          });
        }
        return child;
      })}
      {remainingCount > 0 && (
        <CountryFlagGroupCount
          count={remainingCount}
          size={typeof size === "number" ? size : undefined}
          className={countClassName}
          tooltipContent={countTooltipContent}
          tooltipSide={countTooltipSide}
          tooltipAlign={countTooltipAlign}
          tooltipClassName={countTooltipClassName}
        />
      )}
    </div>
  );
};

export const CountryFlagGroupCount = ({
  count,
  size = 20,
  className = "",
  tooltipContent,
  tooltipSide = "top",
  tooltipAlign = "center",
  tooltipClassName = "",
}: CountryFlagGroupCountProps) => {
  const height = Math.round(size * 0.75);

  const countElement = (
    <div
      className={`shrink-0 flex items-center justify-center ${className}`}
      style={{
        minWidth: size,
        height,
        paddingLeft: 4,
        paddingRight: 4,
      }}
    >
      +{count}
    </div>
  );

  if (tooltipContent) {
    return (
      <Tooltip
        content={tooltipContent}
        side={tooltipSide}
        align={tooltipAlign}
        contentClassName={tooltipClassName}
        showArrow
      >
        {countElement}
      </Tooltip>
    );
  }

  return countElement;
};

CountryFlagGroup.displayName = "CountryFlagGroup";
CountryFlagGroupCount.displayName = "CountryFlagGroupCount";

export default CountryFlagGroup;
