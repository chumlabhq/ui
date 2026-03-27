import {
  forwardRef,
  cloneElement,
  type ReactNode,
  type HTMLAttributes,
  type Ref,
} from "react";
import { mergeRefs } from "./mergeRefs";
import { mergeProps, getValidChild } from "./slotHelpers";

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

    const childRef = (child as unknown as { ref?: Ref<HTMLElement> }).ref;

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
