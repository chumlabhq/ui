import { cloneElement } from "react";
import type { ReactElement } from "react";
import { cn } from "../../../utils/scopedCn.js";
import { getElementRef } from "../../../utils/getElementRef.js";
import { mergeTooltipRefs } from "../utils/helpers.js";

interface TooltipAsChildTriggerProps {
  child: ReactElement<Record<string, unknown>>;
  setTriggerNode: (node: HTMLElement | null) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onFocus: (e: React.FocusEvent) => void;
  onBlur: () => void;
  onTouchStart: () => void;
  onTouchEnd: () => void;
  isOpen: boolean;
  tooltipId: string;
  triggerClassName?: string;
  tooltipContent: React.ReactNode;
}

export function TooltipAsChildTrigger({
  child,
  setTriggerNode,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  onTouchStart,
  onTouchEnd,
  isOpen,
  tooltipId,
  triggerClassName,
  tooltipContent,
}: TooltipAsChildTriggerProps) {
  const childRef = getElementRef<HTMLElement>(child);

  return (
    <>
      {cloneElement(child, {
        ref: mergeTooltipRefs(setTriggerNode, childRef),
        onMouseEnter: (e: React.MouseEvent) => {
          onMouseEnter();
          (
            child.props.onMouseEnter as
              | ((e: React.MouseEvent) => void)
              | undefined
          )?.(e);
        },
        onMouseLeave: (e: React.MouseEvent) => {
          onMouseLeave();
          (
            child.props.onMouseLeave as
              | ((e: React.MouseEvent) => void)
              | undefined
          )?.(e);
        },
        onFocus: (e: React.FocusEvent) => {
          onFocus(e);
          (
            child.props.onFocus as ((e: React.FocusEvent) => void) | undefined
          )?.(e);
        },
        onBlur: (e: React.FocusEvent) => {
          onBlur();
          (child.props.onBlur as ((e: React.FocusEvent) => void) | undefined)?.(
            e,
          );
        },
        onTouchStart: (e: React.TouchEvent) => {
          onTouchStart();
          (
            child.props.onTouchStart as
              | ((e: React.TouchEvent) => void)
              | undefined
          )?.(e);
        },
        onTouchEnd: (e: React.TouchEvent) => {
          onTouchEnd();
          (
            child.props.onTouchEnd as
              | ((e: React.TouchEvent) => void)
              | undefined
          )?.(e);
        },
        "aria-describedby": isOpen ? tooltipId : undefined,
        className: cn(
          child.props.className as string | undefined,
          triggerClassName,
        ),
      })}
      {tooltipContent}
    </>
  );
}
