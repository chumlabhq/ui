"use client";

import { useState } from "react";
import { ToastPosition, useToast } from "@chumlab/ui/toast";

export default function ToastExample() {
  const [position, setPosition] = useState<ToastPosition>("bottom-right");
  const toast = useToast();
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-wrap gap-2">
        {
          (
            [
              "top-left",
              "top-center",
              "top-right",
              "bottom-left",
              "bottom-center",
              "bottom-right"
            ] as const
          ).map((pos) => (
            <button
              key={pos}
              className={position === pos ? "px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-text text-cl-bg hover:opacity-90" : "px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-bg-panel border border-cl-border text-cl-text hover:bg-cl-bg-hover"}
              onClick={() => setPosition(pos)}
            >
              {pos}
            </button>
          ))
        }
      </div>
      <p className="text-xs text-cl-text-secondary">
        Current position:
        {" "}
        <strong className="text-cl-text">
          {position}
        </strong>
      </p>
      <button
        className="px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-accent text-cl-on-accent hover:bg-cl-accent/90 dark:bg-cl-accent dark:text-cl-on-accent dark:hover:bg-cl-accent/90 self-start"
        onClick={
          () =>
          toast.info(`Toast at ${position}`, {
            description: "See the position in action!"
          })
        }
      >
        Show Toast at Current Position
      </button>
    </div>
  );
}
