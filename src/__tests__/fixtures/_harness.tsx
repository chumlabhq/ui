import { useEffect, useRef, useState, type ReactNode } from "react";
import { isBrowser } from "../../utils/isBrowser.js";

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

/**
 * A container for `portalContainer`, so a fixture can send a surface somewhere
 * other than `document.body`.
 *
 * It cannot be expressed as a static prop: the element has to exist before the
 * component mounts, and nothing at module scope does. No fixture took any
 * component out of its default portal target until this — which is the exact
 * shape of the scope hole the axe sweep had, one level up.
 */
export function PortalTarget({
  children,
}: {
  children: (container: HTMLElement | null) => ReactNode;
}) {
  const [container, setContainer] = useState<HTMLElement | null>(null);
  return (
    <div data-harness="portal-target">
      <div ref={setContainer} data-harness-portal />
      {children(container)}
    </div>
  );
}

/**
 * Renders its children with the document in right-to-left.
 *
 * The direction has to be on `<html>`, not on a wrapper: every anchored surface
 * in this package is portalled to `document.body`, so a `dir` set on the
 * fixture's own box reaches the trigger and not the menu — which is the half
 * the positioning is about.
 *
 * Set during render rather than in an effect, because a layout effect in a
 * parent runs AFTER its children's, and by then `useAnchoredPosition` has
 * already measured. Restored on unmount so one fixture cannot leak into the
 * next in the contract tier, where they share a document.
 */
export function RtlBoundary({ children }: { children: ReactNode }) {
  const original = useRef<string | null>(null);
  const captured = useRef(false);

  const apply = () => {
    if (!isBrowser) return;
    if (!captured.current) {
      original.current = document.documentElement.getAttribute("dir");
      captured.current = true;
    }
    // Deliberate, and the point of the harness: the document has to carry the
    // direction before any child's layout effect measures against it.
    // eslint-disable-next-line react-hooks/immutability
    document.documentElement.dir = "rtl";
  };

  // During render, so a child's layout effect — which is where every anchored
  // surface measures — sees the direction before it computes anything. A parent
  // layout effect runs after its children's and would be too late, which is the
  // whole reason this harness exists rather than a `dir` on a wrapper div.
  apply();

  // And again on mount, because StrictMode simulates an unmount: the cleanup
  // below removed the attribute and the second render had nothing left to
  // re-apply, so five of these fixtures rendered left-to-right while the two
  // that happened to re-render later did not.
  useEffect(() => {
    apply();
    return () => {
      if (!isBrowser) return;
      if (original.current === null) document.documentElement.removeAttribute("dir");
      else document.documentElement.setAttribute("dir", original.current);
    };
  });

  return <div data-harness="rtl">{children}</div>;
}
