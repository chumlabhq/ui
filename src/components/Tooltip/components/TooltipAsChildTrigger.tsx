import { cloneElement } from "react";
import type { ReactElement, Ref } from "react";
import { cn } from "../../../utils/cn";
import { mergeTooltipRefs } from "../utils/helpers";

export const TooltipAsChildTrigger: React.FC<{
  child: ReactElement<Record<string, unknown>>;
  setTriggerNode: (node: HTMLElement | null) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onFocus: () => void;
  onBlur: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  isOpen: boolean;
  tooltipId: string;
  triggerClassName?: string;
  tooltipContent: React.ReactNode;
}> = ({
  child,
  setTriggerNode,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  onKeyDown,
  isOpen,
  tooltipId,
  triggerClassName,
  tooltipContent,
}) => {
  const childRef = (child.props as { ref?: Ref<HTMLElement> }).ref;

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
          onFocus();
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
        onKeyDown: (e: React.KeyboardEvent) => {
          onKeyDown(e);
          (
            child.props.onKeyDown as
              | ((e: React.KeyboardEvent) => void)
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
};

TooltipAsChildTrigger.displayName = "TooltipAsChildTrigger";
