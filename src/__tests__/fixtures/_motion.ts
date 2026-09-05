import type { Fixture } from "./types.js";

/**
 * The two explicit values of `reduceMotion`, on top of a component's simplest
 * state.
 *
 * `reduceMotion` is `boolean | "auto"`, and `"auto"` — the default — is the only
 * value any fixture had. `reduced-motion.contract` drives the media query
 * through `setReducedMotion()`, which exercises what `"auto"` defers to but
 * never the override itself, so the explicit `true` and `false` paths were
 * unrendered on all 16 components that offer them.
 *
 * Derived from a base fixture rather than written out per component: the prop is
 * orthogonal to whatever state the component is in, and a hand-copied prop set
 * per file is 16 chances to drift from the state it was copied from.
 */
/** Constrained so applying it to a component without the prop is a compile error. */
export const motionOverrides = <P extends { reduceMotion?: boolean | "auto" }>(
  base: Fixture<P>,
): Fixture<P>[] => [
  {
    ...base,
    name: "reduce-motion-forced",
    props: { ...base.props, reduceMotion: true },
    note: "The override on: motion off regardless of what the media query says.",
  },
  {
    ...base,
    name: "reduce-motion-refused",
    props: { ...base.props, reduceMotion: false },
    note: "The override off: motion kept even when the user asked for less.",
  },
];
