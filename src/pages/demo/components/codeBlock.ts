/** Shared by every code block on a component page. */
export const preClass =
  "rounded-cl-lg border border-cl-border bg-cl-code-bg text-cl-code-text font-mono text-[12px] leading-[1.65] px-4 py-3 overflow-x-auto code-scroll";

/**
 * A block that scrolls has to be reachable by keyboard, or the only way to read
 * the right-hand side of a long line is a mouse. axe reports it as
 * `scrollable-region-focusable`; `tabIndex={0}` is the whole fix.
 */
export const scrollableCode = { tabIndex: 0 } as const;
