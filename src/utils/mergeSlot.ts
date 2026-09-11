import { twMerge } from "tailwind-merge";
import { cn } from "./scopedCn.js";

/**
 * Merge a slot's library classes with a consumer's, so the consumer's plain
 * utility beats the library's STATE-SCOPED one in the same property group.
 *
 * `cn` alone cannot do this, and that is the defect. tailwind-merge keys a
 * class by its variant chain as well as its utility, so
 * `data-[state=checked]:bg-cl-accent` and a consumer's `bg-green-500` are
 * different keys: both survive the merge, and the variant then wins at paint
 * time because it is an attribute selector on the same element. The consumer's
 * class is present in the DOM and does nothing — measured on Checkbox, whose
 * checked box stayed rgb(91,155,255) with `classes={{ control: "bg-green-500" }}`
 * applied.
 *
 * Found three times by eye and fixed three times as an instance — `border-none`
 * beating a consumer's `border`, Button's `size` as a data variant, Checkbox's
 * checked fill. A sweep then found 99 more across 20 components, which is why
 * this is one function rather than a fourth instance fix.
 *
 * The rule: a consumer's PLAIN token drops every library token whose utility
 * collides with it, whatever variants that token carried. A consumer's own
 * VARIANT token drops nothing extra — they are targeting a state deliberately,
 * and `twMerge` already handles variant against variant.
 *
 * Interaction variants go too when a consumer passes a plain utility of the
 * same group. That is the documented contract — the value replaces the default
 * for that slot — and a consumer who wants to keep a hover can pass their own
 * `hover:` token, which this leaves alone.
 */
const collides = new Map<string, boolean>();

/** Same tailwind-merge group? Asked of tailwind-merge itself, not a table here. */
const conflicts = (utility: string, consumerToken: string): boolean => {
  const key = `${utility} ${consumerToken}`;
  const cached = collides.get(key);
  if (cached !== undefined) return cached;
  const result = twMerge(utility, consumerToken) === consumerToken;
  collides.set(key, result);
  return result;
};

/** The utility with its variant chain removed, brackets respected. */
const bareUtility = (token: string): string => {
  let depth = 0;
  let last = 0;
  for (let i = 0; i < token.length; i += 1) {
    const ch = token[i];
    if (ch === "[") depth += 1;
    else if (ch === "]") depth -= 1;
    else if (ch === ":" && depth === 0) last = i + 1;
  }
  return token.slice(last);
};

export function mergeSlot(library: string, consumer?: string): string {
  // Still through `cn`, even with nothing to merge. Returning `library` raw
  // skipped the dedupe `cn` was doing and OtpInput's message — whose default
  // carries both `text-xs` and `text-sm` and relies on tailwind-merge to
  // settle them — rendered 4px shorter. The visual baseline caught it.
  if (!consumer) return cn(library);
  const plain = consumer
    .split(/\s+/)
    .filter(Boolean)
    .filter((token) => bareUtility(token) === token);
  if (plain.length === 0) return cn(library, consumer);

  const kept = library
    .split(/\s+/)
    .filter(Boolean)
    .filter((token) => {
      const utility = bareUtility(token);
      // A plain library token needs no help: `twMerge` already resolves it
      // against the consumer's.
      if (utility === token) return true;
      return !plain.some((consumerToken) => conflicts(utility, consumerToken));
    });

  return cn(kept.join(" "), consumer);
}
