"use client";

import { useToast } from "@chumlab/ui/toast";

export default function ToastExample() {
  const toast = useToast();
  return (
    <>
      <button
        className="px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-accent text-cl-on-accent hover:bg-cl-accent/90 dark:bg-cl-accent dark:text-cl-on-accent dark:hover:bg-cl-accent/90"
        onClick={
          () => {
            toast.success("First toast");
            setTimeout(() => toast.warning("Second toast"), 200);
            setTimeout(() => toast.error("Third toast"), 400);
            setTimeout(() => toast.info("Fourth toast"), 600);
          }
        }
      >
        Trigger 4 Toasts
      </button>
      <button
        className="px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-bg-elevated text-cl-text hover:bg-cl-bg-elevated"
        onClick={
          () => {
            for (let i = 1; i <= 10; i++) {
              setTimeout(() => {
                toast.info(`Toast #${i}`, {
                  description: `This is toast number ${i}`
                });
              }, i * 100);
            }
          }
        }
      >
        Trigger 10 Toasts (Max 5 visible)
      </button>
    </>
  );
}
