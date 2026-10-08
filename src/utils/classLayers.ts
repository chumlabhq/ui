/**
 * The structural / decorative split that `unstyled` is defined by, expressed as
 * code.
 *
 * Applied at module load, once per constants file, to derive each component's
 * UNSTYLED_*_CLASSES from its DEFAULT_*_CLASSES. Deriving rather than
 * hand-maintaining a second copy is what stops the two drifting.
 *
 * A utility is structural if removing it changes the box's participation in
 * layout — where it is positioned, what formatting context it establishes or
 * joins, whether it can overflow, and what size it takes. `unstyled` keeps the
 * structural half and drops the rest.
 */

const STRUCTURAL: RegExp[] = [
  /^(static|relative|absolute|fixed|sticky)$/,
  /^(inset|top|right|bottom|left)(-|$)/,
  /^z-/,
  /^(isolate|isolation-)/,
  /^(block|inline-block|inline|flex|inline-flex|grid|inline-grid|contents|hidden|flow-root)$/,
  /^align-/,
  /^table(-|$)/,
  /^flex-(row|row-reverse|col|col-reverse|wrap|wrap-reverse|nowrap|1|auto|initial|none)$/,
  /^(grow|shrink)(-|$)/,
  /^basis-/,
  /^(grid-cols|grid-rows|grid-flow|auto-cols|auto-rows|col|row|order)-/,
  /^(items|justify|content|self|place)-/,
  /^(overflow|overscroll)-/,
  /^(truncate|text-ellipsis|text-clip)$/,
  /^whitespace-/,
  /^(w|h|min-w|min-h|max-w|max-h|size)-/,
  /^aspect-/,
  /^(box-border|box-content)$/,
  /^(float|clear)-/,
];

/** Strips variants (`dark:`, `hover:`, `sm:`) and the `!` important flag. */
export const baseUtility = (token: string): string => {
  const withoutVariants = token.slice(token.lastIndexOf(":") + 1);
  return withoutVariants.startsWith("!")
    ? withoutVariants.slice(1)
    : withoutVariants;
};

export const isStructural = (token: string): boolean => {
  const base = baseUtility(token);
  return STRUCTURAL.some((pattern) => pattern.test(base));
};

export const isDecorative = (token: string): boolean => !isStructural(token);

/** Splits a class string into its structural and decorative halves. */
export const splitLayers = (classString: string) => {
  const tokens = classString.split(/\s+/).filter(Boolean);
  return {
    structural: tokens.filter(isStructural),
    decorative: tokens.filter(isDecorative),
  };
};

/**
 * The half of a default class set that survives `unstyled`.
 *
 * Every component's UNSTYLED_*_CLASSES is this applied to its DEFAULT_*_CLASSES,
 * so the two sets share one source of truth and cannot disagree.
 */
/** A class bag: strings, or a nested child component's own bag. */
export type ClassBag = { [key: string]: string | undefined | ClassBag };

/**
 * Recurses into nested bags so `unstyled` reaches a child component by the same
 * path its classes do. Without this a nested bag would keep its decorative
 * defaults under `unstyled`, because the value is an object rather than a
 * class string.
 */
export const structuralOnly = <T extends object>(defaults: T): T =>
  Object.fromEntries(
    Object.entries(defaults).map(([key, value]) => [
      key,
      typeof value === "string"
        ? splitLayers(value).structural.join(" ")
        : value && typeof value === "object"
          ? structuralOnly(value as object)
          : "",
    ]),
  ) as T;

/**
 * Utilities that make something move.
 *
 * Narrower than "anything that could move" on purpose: `transform`, `scale-*`,
 * `rotate-*` and `translate-*` are static geometry unless a transition drives
 * them, and stripping them would move a `-translate-y-1/2` centred element
 * rather than calm it. Only the utilities that animate come out.
 */
const MOTION: RegExp[] = [
  /^transition(-|$)/,
  /^duration-/,
  /^ease-/,
  /^delay-/,
  /^animate-/,
];

export const isMotion = (token: string): boolean => {
  // `transition-none` switches motion OFF; counting it as motion would make the
  // idiomatic opt-out look like the thing it opts out of.
  const base = baseUtility(token);
  if (base === "transition-none") return false;

  // A `motion-safe:` or `motion-reduce:` utility is already gated by the media
  // query in CSS — that is the platform's own mechanism, not a component
  // ignoring the preference — so it is not a violation either way.
  if (/(^|:)motion-(safe|reduce):/.test(`:${token}`)) return false;

  return MOTION.some((pattern) => pattern.test(base));
};

/**
 * Strips animation from a class string when the user has asked for reduced
 * motion. Returns the string unchanged otherwise, so the caller can apply it
 * unconditionally.
 *
 * Lives beside the structural/decorative split because it is the same question
 * asked of the same tokens — which is also why `unstyled` and reduced motion
 * compose rather than fight: motion is decorative, so `unstyled` has already
 * removed it and this becomes a no-op.
 */
export const motionSafe = (value: string, prefersReducedMotion: boolean): string =>
  prefersReducedMotion
    ? value
        .split(/\s+/)
        .filter((token) => token && !isMotion(token))
        .join(" ")
    : value;

/** `motionSafe` over every value of a class set. */
export const motionSafeClasses = <T extends object>(
  classes: T,
  prefersReducedMotion: boolean,
): T => {
  if (!prefersReducedMotion) return classes;
  return Object.fromEntries(
    Object.entries(classes).map(([key, value]) => [
      key,
      typeof value === "string"
        ? motionSafe(value, true)
        // A nested child bag is stripped by the same path.
        : value && typeof value === "object"
          ? motionSafeClasses(value as object, true)
          : value,
    ]),
  ) as T;
};
