import { useState } from "react";
import { OtpInput } from "@chumlab/ui/otp-input";

export default function OtpInputExample() {
  const [grouped, setGrouped] = useState("");
  return (
    <>
      <OtpInput
        value={grouped}
        onValueChange={setGrouped}
        groups={[3, 3]}
        separator={<span className="text-lg select-none text-cl-text-tertiary">—</span>}
        classes={
          {
            group: "flex items-center gap-2",
            input: "w-12 h-12 text-center text-lg font-semibold border-2 rounded-cl-lg transition-all focus:outline-none bg-cl-bg-panel border-cl-border-input text-cl-text focus:border-cl-border-input-focus focus:ring-2 focus:ring-cl-accent/20 disabled:opacity-50 disabled:cursor-not-allowed dark:focus:ring-2 dark:disabled:opacity-50 dark:disabled:cursor-not-allowed data-[error]:border-cl-error data-[valid]:border-cl-success",
            label: "block text-sm font-medium mb-2 text-cl-text-secondary",
            separator: "text-lg select-none text-cl-text-tertiary"
          }
        }
      />
      <OtpInput
        groups={[2, 2, 2]}
        separator={<span className="text-lg select-none text-cl-text-tertiary">·</span>}
        classes={
          {
            group: "flex items-center gap-2",
            input: "w-12 h-12 text-center text-lg font-semibold border-2 rounded-cl-lg transition-all focus:outline-none bg-cl-bg-panel border-cl-border-input text-cl-text focus:border-cl-border-input-focus focus:ring-2 focus:ring-cl-accent/20 disabled:opacity-50 disabled:cursor-not-allowed dark:focus:ring-2 dark:disabled:opacity-50 dark:disabled:cursor-not-allowed data-[error]:border-cl-error data-[valid]:border-cl-success",
            label: "block text-sm font-medium mb-2 text-cl-text-secondary",
            separator: "text-lg select-none text-cl-text-tertiary"
          }
        }
      />
    </>
  );
}
