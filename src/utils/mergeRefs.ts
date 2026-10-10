import type { MutableRefObject, Ref, RefCallback } from "react";

export function setRef<T>(ref: Ref<T> | undefined, value: T | null): void {
  if (typeof ref === "function") {
    ref(value);
  } else if (ref != null) {
    (ref as MutableRefObject<T | null>).current = value;
  }
}

export function mergeRefs<T>(...refs: (Ref<T> | undefined)[]): RefCallback<T> {
  return (value: T | null) => {
    refs.forEach((ref) => setRef(ref, value));
  };
}
