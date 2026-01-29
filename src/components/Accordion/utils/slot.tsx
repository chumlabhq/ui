import {
  forwardRef,
  cloneElement,
  isValidElement,
  Children,
  type ReactNode,
  type ReactElement,
  type HTMLAttributes,
  type Ref,
  type CSSProperties,
} from "react";

type AnyProps = Record<string, unknown>;

function mergeRefs<T>(...refs: (Ref<T> | undefined)[]): Ref<T> {
  return (value: T | null) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref != null) {
        (ref as React.MutableRefObject<T | null>).current = value;
      }
    });
  };
}

function mergeProps(slotProps: AnyProps, childProps: AnyProps): AnyProps {
  const overrideProps: AnyProps = { ...childProps };

  for (const propName in childProps) {
    const slotPropValue = slotProps[propName];
    const childPropValue = childProps[propName];

    const isHandler = /^on[A-Z]/.test(propName);

    if (isHandler) {
      if (slotPropValue && childPropValue) {
        overrideProps[propName] = (...args: unknown[]) => {
          (childPropValue as (...args: unknown[]) => void)(...args);
          (slotPropValue as (...args: unknown[]) => void)(...args);
        };
      } else if (slotPropValue) {
        overrideProps[propName] = slotPropValue;
      }
    } else if (propName === "style") {
      overrideProps[propName] = {
        ...(slotPropValue as CSSProperties),
        ...(childPropValue as CSSProperties),
      };
    } else if (propName === "className") {
      overrideProps[propName] = [slotPropValue, childPropValue]
        .filter(Boolean)
        .join(" ");
    }
  }

  return { ...slotProps, ...overrideProps };
}

function getValidChild(children: ReactNode): ReactElement | null {
  const childArray = Children.toArray(children);
  if (childArray.length > 1) {
    if (import.meta.env.DEV) {
      console.warn("Slot: Only one child is allowed when using asChild");
    }
    return null;
  }

  const child = childArray[0];
  if (!isValidElement(child)) {
    if (import.meta.env.DEV) {
      console.warn("Slot: Child must be a valid React element when using asChild");
    }
    return null;
  }

  return child;
}

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

export { Slot, mergeRefs, mergeProps };
export type { SlotProps };
