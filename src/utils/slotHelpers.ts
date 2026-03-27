import {
  isValidElement,
  Children,
  type ReactNode,
  type ReactElement,
  type CSSProperties,
} from "react";

type AnyProps = Record<string, unknown>;

export function mergeProps(slotProps: AnyProps, childProps: AnyProps): AnyProps {
  const overrideProps: AnyProps = { ...childProps };

  for (const propName in childProps) {
    const slotPropValue = slotProps[propName];
    const childPropValue = childProps[propName];

    const isHandler = /^on[A-Z]/.test(propName);

    if (isHandler) {
      if (slotPropValue && childPropValue) {
        overrideProps[propName] = (...args: unknown[]) => {
          (slotPropValue as (...args: unknown[]) => void)(...args);
          const event = args[0] as { defaultPrevented?: boolean } | undefined;
          if (!event?.defaultPrevented) {
            (childPropValue as (...args: unknown[]) => void)(...args);
          }
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

export function getValidChild(children: ReactNode): ReactElement | null {
  const childArray = Children.toArray(children);
  if (childArray.length > 1) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("Slot: Only one child is allowed when using asChild");
    }
    const first = childArray[0];
    return isValidElement(first) ? first : null;
  }

  const child = childArray[0];
  if (!isValidElement(child)) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("Slot: Child must be a valid React element when using asChild");
    }
    return null;
  }

  return child;
}
