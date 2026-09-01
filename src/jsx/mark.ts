/**
 * Stamps a marker class on every DOM element the library renders, so the
 * utilities in dist/styles.css can be scoped to our own markup.
 *
 * dist/styles.css has to ship the plain Tailwind utilities the components are
 * built from - `flex`, `hidden`, `table`, `container` and ~450 more - because a
 * consumer without Tailwind has nothing else to give those class names meaning.
 * Shipped bare, those rules also match the CONSUMER's markup: a page whose own
 * `.hidden` means "dimmed" had our `display: none` applied and its content
 * vanished, because their rule never declared `display` for ours to lose to.
 * Cascade layers cannot fix that - only making the rules unable to match.
 *
 * So build-styles.mjs emits every utility as `.hidden:where(.cl-s)`, and this
 * supplies the `cl-s`. Marking at the JSX runtime rather than in source keeps
 * the ~1,100 className sites untouched and catches the dynamic ones for free.
 * `:where()` contributes no specificity, so override behaviour is unchanged.
 */
export const MARKER = "cl-s";

export type Props = Record<string, unknown> & { className?: unknown };

/**
 * Only host elements are marked. A component element has no DOM of its own - it
 * passes className down until a host element renders it, which is marked then.
 * Elements with no className cannot match a utility, so they need no marker.
 */
export const mark = (type: unknown, props: Props): Props => {
  if (typeof type !== "string") return props;
  const { className } = props;
  if (typeof className !== "string" || className === "") return props;
  // cn() also appends the marker, so class strings that came through it arrive
  // already marked. Without this check they would carry it twice.
  if (className.split(" ").includes(MARKER)) return props;
  return { ...props, className: `${className} ${MARKER}` };
};
