"use client";

import { useState } from "react";
import { OtpInput } from "@chumlab/ui/otp-input";

export default function OtpInputExample() {
  const [errorVal, setErrorVal] = useState("");
  return (
    <OtpInput
      value={errorVal}
      onValueChange={setErrorVal}
      label="Verification Code"
      error={errorVal.length > 0 && errorVal.length < 6}
      errorMessage={
        errorVal.length > 0 && errorVal.length < 6
        ? "Please enter all 6 digits"
        : undefined
      }
      classes={
        {
                    ...({
          group: "flex items-center gap-2",
          input: "w-12 h-12 text-center text-lg font-semibold border-2 rounded-cl-lg transition-all focus:outline-none bg-white border-cl-border-input text-cl-text focus:border-cl-border-input-focus focus:ring-2 focus:ring-cl-accent/20 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-cl-bg-elevated dark:border dark:border-cl-border dark:text-cl-text dark:focus:border-cl-border-input-focus dark:focus:ring-2 dark:focus:ring-cl-accent/20 dark:disabled:opacity-50 dark:disabled:cursor-not-allowed",
          label: "block text-sm font-medium mb-2 text-cl-text-secondary",
          separator: "text-lg select-none text-cl-text-tertiary"
        }),
                    input: `${"w-12 h-12 text-center text-lg font-semibold border-2 rounded-cl-lg transition-all focus:outline-none bg-white border-cl-border-input text-cl-text focus:border-cl-border-input-focus focus:ring-2 focus:ring-cl-accent/20 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-cl-bg-elevated dark:border dark:border-cl-border dark:text-cl-text dark:focus:border-cl-border-input-focus dark:focus:ring-2 dark:focus:ring-cl-accent/20 dark:disabled:opacity-50 dark:disabled:cursor-not-allowed"} ${errorVal.length > 0 && errorVal.length < 6 ? ("border-cl-error focus:border-cl-error focus:ring-cl-error/20") : ""}`
                  }
      }
    />
  );
}
