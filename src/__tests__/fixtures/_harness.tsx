import { useState, type ReactNode } from "react";

/**
 * Trigger + component, for fixtures whose behaviour needs both.
 *
 * "Opens on trigger click" cannot be expressed as a static prop set, and the
 * alternative — reaching back into a demo page for a button — is the coupling
 * E2E-INVENTORY.md is about. This harness is owned by the tests, versioned with
 * them, and has no prose to drift.
 */
export function Toggle({
  label = "Open",
  defaultOpen = false,
  children,
}: {
  label?: string;
  /** Starts open, for behaviour that only exists on an open component — a
   *  swipe-to-dismiss, say, which has nothing to dismiss from a closed start. */
  defaultOpen?: boolean;
  children: (open: boolean, setOpen: (v: boolean) => void) => ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div data-harness="toggle">
      <button type="button" data-harness-trigger onClick={() => setOpen(true)}>
        {label}
      </button>
      {children(open, setOpen)}
    </div>
  );
}

/**
 * Buttons that set a numeric index, for props whose effect is only observable
 * after a change — a snap point's height cannot be read off a static render.
 */
export function IndexPicker({
  count,
  initial = 0,
  children,
}: {
  count: number;
  initial?: number;
  children: (index: number) => ReactNode;
}) {
  const [index, setIndex] = useState(initial);
  return (
    <div data-harness="index-picker">
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          data-harness-index={i}
          onClick={() => setIndex(i)}
        >
          {`Index ${i}`}
        </button>
      ))}
      {children(index)}
    </div>
  );
}

/**
 * Owns the "is it still there" half of a dismissal.
 *
 * A Toast calls `onRemove` and keeps rendering; unmounting it is the host's
 * job. Without an owner, "tapping close dismisses the toast" has nothing to
 * assert against.
 */
export function Dismissable({
  children,
}: {
  children: (onRemove: () => void) => ReactNode;
}) {
  const [present, setPresent] = useState(true);
  return (
    <div data-harness="dismissable">
      {present ? children(() => setPresent(false)) : null}
    </div>
  );
}
