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

/**
 * Merges multiple refs into a single ref callback.
 * Useful when you need to pass a ref to both a parent component and use it internally.
 */
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

/**
 * Merges props from slot and child, with special handling for:
 * - Event handlers (onX): Both handlers are called, child first
 * - style: Objects are merged, child styles override slot styles
 * - className: Strings are concatenated with a space
 */
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

/**
 * Validates and returns the single child element.
 * Warns in development if multiple children or invalid elements are passed.
 */
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

/**
 * Slot component for polymorphic rendering (asChild pattern).
 * Merges its props onto its single child element, allowing components
 * to render as different elements while maintaining their behavior.
 * 
 * @example
 * ```tsx
 * // Usage in a component
 * const Comp = asChild ? Slot : "div";
 * return <Comp {...props}>{children}</Comp>;
 * 
 * // Consumer can then render as any element
 * <MyComponent asChild>
 *   <a href="/link">Click me</a>
 * </MyComponent>
 * ```
 */
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

export { Slot, mergeRefs, mergeProps, getValidChild };
export type { SlotProps };
