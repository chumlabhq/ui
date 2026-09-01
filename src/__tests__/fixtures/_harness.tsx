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
  children,
}: {
  label?: string;
  children: (open: boolean, setOpen: (v: boolean) => void) => ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div data-harness="toggle">
      <button type="button" data-harness-trigger onClick={() => setOpen(true)}>
        {label}
      </button>
      {children(open, setOpen)}
    </div>
  );
}
