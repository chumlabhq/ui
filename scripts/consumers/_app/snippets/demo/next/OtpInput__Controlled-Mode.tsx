"use client";

import { useState } from "react";
import { Button } from "@chumlab/ui/button";
import { OtpInput } from "@chumlab/ui/otp-input";

export default function OtpInputExample() {
  const [controlled, setControlled] = useState("123");
  return (
    <>
      <div
        className="w-full mb-3 p-3 rounded-cl-md flex flex-wrap items-center gap-3 bg-cl-bg-elevated"
      >
        <span className="text-xs font-medium text-cl-text-secondary">Value:</span>
        <span className="text-sm font-mono text-cl-text-secondary">
          &quot;
          {controlled}
          &quot;
        </span>
        <Button
          className="ml-auto px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors bg-cl-bg-elevated text-cl-text border border-cl-border hover:bg-cl-bg-hover hover:border-cl-border-input-hover cursor-pointer"
          onClick={() => setControlled("")}
        >
          Clear
        </Button>
        <Button
          className="px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors bg-cl-accent text-cl-on-accent hover:bg-cl-accent/90 cursor-pointer"
          onClick={() => setControlled("123456")}
        >
          Set 123456
        </Button>
      </div>
      <OtpInput
        value={controlled}
        onValueChange={setControlled}
        classes={
          {
            group: "flex items-center gap-2",
            input: "w-12 h-12 text-center text-lg font-semibold border-2 rounded-cl-lg transition-all focus:outline-none bg-cl-bg-panel border-cl-border-input text-cl-text focus:border-cl-border-input-focus focus:ring-2 focus:ring-cl-accent/20 disabled:opacity-50 disabled:cursor-not-allowed data-[error]:border-cl-error data-[valid]:border-cl-success",
            label: "block text-sm font-medium mb-2 text-cl-text-secondary",
            separator: "text-lg select-none text-cl-text-tertiary"
          }
        }
      />
    </>
  );
}
