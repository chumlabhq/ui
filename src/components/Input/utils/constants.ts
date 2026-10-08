import type { InputClasses, InputSize } from "./types.js";
import { structuralOnly } from "../../../utils/classLayers.js";

/**
 * What `size` paints. It painted nothing until v1: the prop emitted `data-size`
 * and the schema called that a decision, so sm, md and lg rendered identically
 * — the same hole Button carried, in the same words, in three places.
 *
 * The scale is Button's: a 28, 40 and 52px CONTENT box, which a bordered field
 * renders at 30, 42 and 54 once its 1px border is counted on each side. `md` is
 * the field exactly as it was — `px-3.5 py-2.5` with a `text-sm` control — so
 * nothing moves for anyone who never passed the prop, and 42 is what it has
 * always measured. Horizontal padding steps 12/14/20 around today's 14; type
 * steps 12/14/16, which is Accordion's scale and Button's.
 *
 * The VERTICAL padding sits on the input, not on the control around it. Both
 * render the same height, but only one of them is a pointer target: with the
 * padding on the control, `sm` gave a 16px-tall `<input>` inside a 30px box,
 * and a click in that padding lands on the wrapper, not the field.
 * `e2e/target-size.spec.ts` failed it at 1206x16 against a 24px floor — the
 * gate caught it before the scale shipped. Inside, the target is the whole
 * inner box: 28, 40 and 52.
 *
 * Plain utilities, never `min-h-*`: height here is padding plus line-height so
 * that every token is in the same tailwind-merge group as the utility a
 * consumer would reach for, and theirs REPLACES it. A `min-h-10` would sit in a
 * different group from their `h-12`, survive the merge and win — which is the
 * `border-none` defect one layer up.
 */
export const INPUT_SIZE_CLASSES: Record<InputSize, { control: string; input: string; prefix: string; suffix: string }> = {
  sm: { control: "px-3", input: "py-1.5 text-xs", prefix: "text-xs", suffix: "text-xs" },
  md: { control: "px-3.5", input: "py-2.5 text-sm", prefix: "text-sm", suffix: "text-sm" },
  lg: { control: "px-5", input: "py-3.5 text-base", prefix: "text-base", suffix: "text-base" },
};

export const DEFAULT_INPUT_SIZE: InputSize = "md";

export const DEFAULT_INPUT_CLASSES: Required<InputClasses> = {
  root: "flex flex-col data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed",
  control:
    "rounded-cl-lg border gap-2.5 transition-all duration-150 text-cl-text-chrome border-cl-border-input bg-cl-bg-input shadow-sm shadow-black/[0.04] dark:shadow-none focus-within:ring-2 focus-within:ring-cl-accent focus-within:border-cl-border-input-focus data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed data-[error]:border-cl-error has-[[data-error]]:border-cl-error data-[valid]:border-cl-success has-[[data-valid]]:border-cl-success",
  label:
    "text-[13px] font-medium mb-1.5 block text-cl-text-chrome",
  description: "text-xs mt-1 mb-1.5 text-cl-text-tertiary",
  input:
    "flex-1 min-w-0 w-full bg-transparent outline-none text-cl-text placeholder:text-cl-text-tertiary",
  prefix: "select-none text-cl-text-tertiary",
  suffix: "select-none text-cl-text-tertiary",
  message:
    "text-xs mt-1.5 flex items-center gap-1.5 data-[invalid]:text-cl-error data-[valid]:text-cl-success",
  count:
    "text-[11px] mt-1 text-right tabular-nums text-cl-text-tertiary",
};

export const UNSTYLED_INPUT_CLASSES: Required<InputClasses> =
  structuralOnly(DEFAULT_INPUT_CLASSES);
