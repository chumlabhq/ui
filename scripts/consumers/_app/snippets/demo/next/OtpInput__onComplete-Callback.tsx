"use client";

import { useState } from "react";
import { OtpInput } from "@chumlab/ui/otp-input";

export default function OtpInputExample() {
  const [completed, setCompleted] = useState<string | null>(null);
  return (
    <>
      <OtpInput
        onComplete={(val) => setCompleted(val)}
        classes={
          {
            group: "flex items-center gap-2",
            input: "w-12 h-12 text-center text-lg font-semibold border-2 rounded-cl-lg transition-all focus:outline-none bg-white border-cl-border-input text-cl-text focus:border-cl-border-input-focus focus:ring-2 focus:ring-cl-accent/20 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-cl-bg-elevated dark:border dark:border-cl-border dark:text-cl-text dark:focus:border-cl-border-input-focus dark:focus:ring-2 dark:focus:ring-cl-accent/20 dark:disabled:opacity-50 dark:disabled:cursor-not-allowed",
            label: "block text-sm font-medium mb-2 text-cl-text-secondary",
            separator: "text-lg select-none text-cl-text-disabled"
          }
        }
      />
      {
        completed && (
          <div
            className="mt-3 px-3 py-2 rounded-cl-md text-sm font-mono bg-cl-success/15 text-cl-success border border-cl-success dark:bg-cl-success/30 dark:text-cl-success dark:border dark:border-cl-success"
          >
            Completed:
            {completed}
          </div>
        )
      }
    </>
  );
}
