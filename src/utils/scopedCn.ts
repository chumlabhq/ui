import { type ClassValue } from "clsx";
import { cn as merge } from "./cn.js";

/**
 * The scope marker. Every utility in dist/styles.css ships as
 * `.foo:where(.cl-s)`, so a class string that reaches the DOM without this has
 * no rule behind it. The JSX runtime supplies it for elements the library
 * renders itself (src/jsx/mark.ts) — but `asChild` composes through
 * `cloneElement`, which never touches that runtime, so the marker has to travel
 * with the class string instead. Kept in sync with src/jsx/mark.ts by
 * src/__tests__/contracts/marker.contract.test.tsx.
 */
export const MARKER = "cl-s";

/**
 * INTERNAL. `cn` plus the scope marker — what every component under
 * src/components imports.
 *
 * It is deliberately not exported from the package. The public `cn`
 * (src/utils/cn.ts) is the same merge without the marker, because a consumer
 * calling it on their own markup must not have the library's confined utilities
 * start matching their elements. src/__tests__/contracts/constants.contract.test.tsx
 * fails the build if anything under src/components imports the public one.
 */
export function cn(...inputs: ClassValue[]) {
  // Stripped AFTER the merge, not before: twMerge can neither drop nor reorder
  // what it never sees, and appending last keeps the marker where the JSX
  // runtime also expects to find it. Stripping first makes the result
  // idempotent, so cn(cn(a), b) and an already-marked string both end up with
  // exactly one.
  const merged = merge(inputs)
    .split(" ")
    .filter((token) => token && token !== MARKER)
    .join(" ");

  // An element with no utilities needs no scope marker, and returning "cl-s"
  // here would make every `className={cn(...) || undefined}` guard truthy.
  return merged ? `${merged} ${MARKER}` : "";
}
