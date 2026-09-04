/**
 * The accessible name for a `role="combobox"` trigger.
 *
 * `combobox` is not a name-from-content role. A trigger button whose only text
 * is the selected value or the placeholder therefore has **no** accessible
 * name at all — the visible "Select an option" that tells a sighted user what
 * the control is reaches assistive tech as nothing. That is 63 of the 66
 * `button-name` nodes on the axe baseline, across six components, and every one
 * of them is a fixture where the consumer passed no label.
 *
 * The fix is not to invent a name. A generic "Select" would describe the
 * widget class rather than this control, which is the failure mode of labelling
 * to satisfy a checker. Instead the name falls back to the element already
 * showing the value or the placeholder, so the accessible name is exactly the
 * text on screen — which is also what SC 2.5.3 Label in Name asks for.
 *
 * `aria-labelledby` may reference a descendant, and this is the same
 * arrangement Radix's Select trigger uses.
 *
 * The fallback is parity, not a substitute for a label: a control named only by
 * its own value tells a screen-reader user "Banana, combobox" and nothing about
 * what Banana is for. Components pair this with `useAccessibleNameWarning` so
 * the consumer is told in development that a label is still the right answer.
 */
export interface ComboboxNameOptions {
  /** id of the element rendering the current value, or the placeholder. */
  valueId: string;
  /** id of the visible `<label>` the component renders for this control. */
  labelId: string;
  /** Whether the consumer supplied a visible label. */
  hasLabel: boolean;
  /** The consumer's `aria-label`, used when there is no visible label. */
  ariaLabel?: string;
}

export function comboboxNameProps({
  valueId,
  labelId,
  hasLabel,
  ariaLabel,
}: ComboboxNameOptions): {
  "aria-labelledby"?: string;
  "aria-label"?: string;
} {
  if (hasLabel) return { "aria-labelledby": labelId };
  if (ariaLabel) return { "aria-label": ariaLabel };
  return { "aria-labelledby": valueId };
}
