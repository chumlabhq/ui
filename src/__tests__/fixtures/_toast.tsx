import { useEffect, useRef } from "react";
import { ToastProvider, useToast } from "../../components/Toast/index.js";
import type { ToastPosition } from "../../components/Toast/utils/types.js";

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
