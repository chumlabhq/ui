"use client";

import { useState } from "react";
import { Button } from "@chumlab/ui/button";
import { ToastPosition, ToastProvider, useToast } from "@chumlab/ui/toast";

function ToastTrigger() {
  const toast = useToast();
  const [position, setPosition] = useState<ToastPosition>("bottom-end");
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-wrap gap-2">
        {
          (
            [
              "top-start",
              "top-center",
              "top-end",
              "bottom-start",
              "bottom-center",
              "bottom-end"
            ] as const
          ).map((pos) => (
            <Button
              key={pos}
              size="sm"
              className={
                position === pos
                ? "rounded-cl-md bg-cl-text text-cl-bg hover:opacity-90"
                : "rounded-cl-md bg-cl-bg-panel border border-cl-border-input text-cl-text hover:bg-cl-bg-hover"
              }
              onClick={() => setPosition(pos)}
            >
              {pos}
            </Button>
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
      <Button
        className="px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-accent text-cl-on-accent hover:bg-cl-accent/90 self-start"
        onClick={
          () =>
          toast.info(`Toast at ${position}`, {
            description: "See the position in action!"
          })
        }
      >
        Show Toast at Current Position
      </Button>
    </div>
  );
}

export default function ToastExample() {
  return (
    <ToastProvider>
      <ToastTrigger />
    </ToastProvider>
  );
}
