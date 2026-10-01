import {
  forwardRef,
  cloneElement,
  type ReactNode,
  type HTMLAttributes,
} from "react";
import { getElementRef } from "./getElementRef.js";
import { mergeRefs } from "./mergeRefs.js";
import { mergeProps, getValidChild } from "./slotHelpers.js";

type AnyProps = Record<string, unknown>;

interface SlotProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
}

const Slot = forwardRef<HTMLElement, SlotProps>(
  ({ children, ...slotProps }, forwardedRef) => {
    const child = getValidChild(children);

    if (!child) {
      return null;
    }

    const childRef = getElementRef<HTMLElement>(child);

    return cloneElement(child, {
      ...mergeProps(slotProps, child.props as AnyProps),
      ref: forwardedRef
        ? mergeRefs(forwardedRef, childRef)
        : childRef,
    } as AnyProps);
  }
);

Slot.displayName = "Slot";

export { Slot };
export type { SlotProps };
