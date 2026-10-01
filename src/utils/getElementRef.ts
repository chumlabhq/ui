import type { ReactElement, Ref } from "react";

type RefCarrier<T> = { ref?: Ref<T> | null };

/**
 * The ref a consumer put on an element, read the way each React major stores it.
 *
 * React 18 keeps `ref` off `props`: it lives on the element, and in development
 * `props.ref` is a getter that warns "`ref` is not a prop" and returns
 * `undefined`. React 19 made it a plain prop and turned `element.ref` into the
 * getter that warns, "Accessing element.ref was removed in React 19". Reading
 * either one the other major's way loses the ref or logs a warning, and an
 * `asChild` child is exactly where a consumer's ref arrives.
 *
 * So the order is decided by what `props` holds, and no getter is ever called.
 * Measured against 18.3.1 and 19.3.0: React 19 defines its `element.ref` getter
 * only when `props.ref` is set, and both production builds store plain values.
 */
export function getElementRef<T>(element: ReactElement): Ref<T> | undefined {
  const props = element.props as RefCarrier<T>;
  const fromProps = Object.getOwnPropertyDescriptor(props, "ref");
  if (fromProps && !fromProps.get) return props.ref ?? undefined;

  const fromElement = Object.getOwnPropertyDescriptor(element, "ref");
  if (!fromElement || fromElement.get) return undefined;
  return (element as unknown as RefCarrier<T>).ref ?? undefined;
}
