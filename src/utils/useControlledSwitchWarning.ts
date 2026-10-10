import { useEffect, useRef } from "react";

/**
 * Warns when a controlled prop goes from defined to undefined.
 *
 * `undefined` means uncontrolled, so a component whose `value` disappears
 * silently starts driving itself from its own internal state. The symptom is
 * the worst kind: it stops responding, then works on the second interaction,
 * and nothing in the output points at the prop. That cost a full round on
 * Accordion, where the types forced every consumer into `value={v ?? undefined}`
 * — `onValueChange` handed back `string | null` and `value` only took `string`.
 * The types are fixed; this is for the case a consumer reaches by other means,
 * most often form state where the field is simply absent.
 *
 * React warns for exactly this on its own inputs, for exactly this reason.
 *
 * Guarded by `process.env.NODE_ENV`, which the library build leaves for the
 * consumer's bundler: the branch and the strings stay in their development
 * build and are dropped from their production one.
 *
 * Fires at most once per component instance, and only on that one transition:
 * not on first render either way, and not on undefined → defined, which is a
 * consumer taking control and is fine.
 *
 * Opt-in by naming the component, so a call site has to be looked at before it
 * warns. Not pedantry: `InternationalPhoneInput` passes
 * `value.countryCode ? findCountryByCode(…)?.value : undefined` into the shared
 * helper, so a code the country list does not know flips it to uncontrolled
 * while the consumer's `value` prop stayed defined the whole time. Warning
 * there would tell them to keep a prop they never dropped. `Drawer` has the
 * same shape on `snapPointIndex`, where the message would also name the
 * wrong prop. Both stay silent until someone decides what they should say.
 */
export function useControlledSwitchWarning(
  isControlled: boolean,
  component: string | undefined,
  prop = "value",
): void {
  // `null` until the first commit, so the first render establishes a baseline
  // rather than looking like a transition.
  const previous = useRef<boolean | null>(null);
  const warned = useRef(false);

  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    const wasControlled = previous.current;
    previous.current = isControlled;

    if (!component || wasControlled !== true || isControlled || warned.current) return;
    warned.current = true;

    console.warn(
      `${component}: the \`${prop}\` prop changed from defined to undefined, so it has ` +
        `switched from controlled to uncontrolled and is now driven by its own ` +
        `internal state. Interactions will look like they do nothing until the ` +
        `next one.\n` +
        `Keep \`${prop}\` defined for the whole life of the component — pass ` +
        `\`null\` or an empty value to mean "nothing selected" — or omit it ` +
        `entirely to be uncontrolled deliberately.`,
    );
  }, [isControlled, component, prop]);
}
