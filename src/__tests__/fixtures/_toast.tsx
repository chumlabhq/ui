import { useEffect, useRef } from "react";
import { ToastProvider, useToast } from "../../components/Toast/index.js";
import type { ToastPosition } from "../../components/Toast/utils/types.js";
import { logFixtureCall } from "./_act.js";

function ShowOnce() {
  const toast = useToast();
  const shown = useRef(false);
  useEffect(() => {
    if (shown.current) return;
    shown.current = true;
    toast.info("Saved", { duration: 600000 });
  }, [toast]);
  return null;
}

/** A provider at `position` holding one toast that stays: the region is the subject, and it only paints with a toast in it. */
export function ToastAt({ position }: { position?: ToastPosition }) {
  return (
    <ToastProvider position={position}>
      <ShowOnce />
    </ToastProvider>
  );
}

function ShowById() {
  const toast = useToast();
  return (
    <button
      data-show-toast
      onClick={() => {
        const returned = toast.info("Saved", {
          id: "saved",
          duration: 600000,
          showCloseButton: true,
          onDismiss: (id) => logFixtureCall("onDismiss", [id]),
        });
        logFixtureCall("returned", [returned]);
      }}
    >
      Show
    </button>
  );
}

/** A toast with an id of the caller's, so `callbacks.spec` can hold what comes back. */
export function ToastById() {
  return (
    <ToastProvider>
      <ShowById />
    </ToastProvider>
  );
}
