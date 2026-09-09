"use client";

import { useState } from "react";
import { OtpInput } from "@chumlab/ui/otp-input";

export default function OtpInputExample() {
  const [custom, setCustom] = useState("");
  return (
    <OtpInput
      value={custom}
      onValueChange={setCustom}
      length={4}
      renderInput={
        ({ inputProps, filled }) => (
          <input
            {...inputProps}
            className={`w-14 h-14 text-center text-xl font-bold rounded-cl-lg border-2 transition-all focus:outline-none ${
              filled
                ? "border-cl-border-input-focus bg-cl-accent/10 text-cl-accent"
                : "border-cl-border-input bg-white text-cl-text"
            } focus:border-cl-border-input-focus focus:ring-2 focus:ring-cl-accent/20 dark:focus:border-cl-border-input-focus dark:focus:ring-2 dark:focus:ring-cl-accent/20`}
          />
        )
      }
      classes={{ control: "flex items-center gap-3" }}
    />
  );
}
