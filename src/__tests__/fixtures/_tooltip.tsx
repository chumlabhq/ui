import { useState } from "react";
import { Tooltip } from "../../components/Tooltip/index.js";
import { Modal } from "../../components/Modal/index.js";

// Its own module rather than inside Tooltip.fixtures.tsx: the coverage audit
// reads every `name=` attribute in a fixtures file as that component's prop, and
// the Modal's `onOpenChange` here would count as a Tooltip fixture of it.

/** Hover that cannot fire inside a test, so whatever opens the tip opened from focus. */
export const NEVER = 60_000;

/**
 * A tip on a trigger that opens a dialog. Closing the dialog hands focus back
 * to the trigger; after a mouse close that must not open the tip. The trigger
 * is a focusable `span` rather than a `<button>` because WebKit does not focus
 * a button on click, and then there is no focus to hand back.
 */
export function ModalFromTooltip() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Tooltip content="Tip" asChild delayDuration={NEVER} hideDelayDuration={NEVER}>
        {/* A `role="button"` promises a click, so it declares the cursor that
            says so; asChild puts the library's marker on it, and
            pointer-affordance holds it to that. */}
        <span role="button" tabIndex={0} onClick={() => setOpen(true)} style={{ cursor: "pointer" }}>
          Open dialog
        </span>
      </Tooltip>
      <Modal open={open} onOpenChange={setOpen} title="Dialog" reduceMotion>
        <p>Body</p>
      </Modal>
    </>
  );
}
