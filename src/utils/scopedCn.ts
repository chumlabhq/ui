import { type ClassValue } from "clsx";
import { cn as merge } from "./cn.js";

/**
 * The scope marker. Every utility in dist/styles.css ships as
 * `.foo:where(.cl-s)`, so a class string that reaches the DOM without this has
 * no rule behind it. The JSX runtime supplies it for elements the library
 * renders itself (src/jsx/mark.ts) — but `asChild` composes through
 * `cloneElement`, which never touches that runtime, so the marker has to travel
 * with the class string instead.
 */
export const MARKER = "cl-s";

/**
 * INTERNAL. `cn` plus the scope marker — what every component under
 * src/components imports.
 *
 * It is deliberately not exported from the package. The public `cn`
 * (src/utils/cn.ts) is the same merge without the marker, because a consumer
 * calling it on their own markup must not have the library's confined utilities
 * start matching their elements.
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

/**
 * INTERNAL. A consumer's `classes` bag composed over the library's defaults.
 *
 * A spread — `{ ...base, ...classes }` — replaces per key, which is the same
 * defect the top-level slots had: a consumer overriding one nested key lost
 * everything the library had put there, focus ring included. Composing per key
 * keeps the default and lets the consumer's value win through tailwind-merge,
 * because their string is ordered last.
 */
export function composeClasses<T extends object>(
  base: T,
  override: Partial<Record<keyof T, unknown>> | undefined,
): T {
  if (!override) return base;
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const key of new Set([...Object.keys(base), ...Object.keys(override)])) {
    const b = (base as Record<string, unknown>)[key];
    const o = (override as Record<string, unknown>)[key];
    if (o === undefined) continue;
    if (typeof b === "string" || b === undefined) {
      out[key] = typeof o === "string" ? cn(b as string | undefined, o) : o;
    } else if (b && typeof b === "object" && o && typeof o === "object") {
      out[key] = composeClasses(b as Record<string, unknown>, o as Record<string, unknown>);
    } else {
      out[key] = o;
    }
  }
  return out as T;
}
