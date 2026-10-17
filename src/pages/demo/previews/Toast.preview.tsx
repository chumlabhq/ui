import { useEffect, useRef } from "react";
import { ToastProvider, useToast } from "../../../components/Toast/index.js";
import { Button } from "../../../components/Button/index.js";
import type { Previews } from "./types.js";

function Saved() {
  const toast = useToast();
  // Once: the context value changes with every toast, so an effect keyed on it
  // alone would show one per render.
  const shown = useRef(false);
  useEffect(() => {
    if (shown.current) return;
    shown.current = true;
    toast.success("Changes saved", { description: "Your profile is up to date.", duration: Infinity });
  }, [toast]);
  return (
    <Button
      className="border border-cl-border bg-cl-bg-elevated text-cl-text"
      onClick={() => toast.success("Changes saved", { description: "Your profile is up to date.", duration: Infinity })}
    >
      Save again
    </Button>
  );
}

function Phone() {
  return (
    <ToastProvider>
      <Saved />
    </ToastProvider>
  );
}

export default { phone: Phone } satisfies Previews;
