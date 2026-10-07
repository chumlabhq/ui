import { useState } from "react";
import { Button } from "@chumlab/ui/button";
import { OtpInput } from "@chumlab/ui/otp-input";

export default function OtpInputExample() {
  const [showAutoFocus, setShowAutoFocus] = useState(false);
  return (
    <>
      {
        showAutoFocus ? (
          <OtpInput
            autoFocusFirst
            label="Auto-focused"
            classes={
              {
                group: "flex items-center gap-2",
                input: "w-12 h-12 text-center text-lg font-semibold border-2 rounded-cl-lg transition-all focus:outline-none bg-white border-cl-border-input text-cl-text focus:border-cl-border-input-focus focus:ring-2 focus:ring-cl-accent/20 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-cl-bg-elevated dark:border dark:border-cl-border dark:text-cl-text dark:focus:border-cl-border-input-focus dark:focus:ring-2 dark:focus:ring-cl-accent/20 dark:disabled:opacity-50 dark:disabled:cursor-not-allowed data-[error]:border-cl-error data-[valid]:border-cl-success",
                label: "block text-sm font-medium mb-2 text-cl-text-secondary",
                separator: "text-lg select-none text-cl-text-tertiary"
              }
            }
          />
        ) : (
          <Button
            type="button"
            className="px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors bg-cl-bg-elevated text-cl-text border border-cl-border hover:bg-cl-bg-hover hover:border-cl-border-input-hover cursor-pointer"
            onClick={() => setShowAutoFocus(true)}
          >
            Mount an auto-focused OtpInput
          </Button>
        )
      }
    </>
  );
}
