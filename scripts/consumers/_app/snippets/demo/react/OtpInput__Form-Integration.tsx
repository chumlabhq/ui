import { useState } from "react";
import { Button } from "@chumlab/ui/button";
import { OtpInput } from "@chumlab/ui/otp-input";

export default function OtpInputExample() {
  const [formSubmit, setFormSubmit] = useState("not fired yet");
  return (
    <>
      <form
        onSubmit={
          (e) => {
            e.preventDefault();
            setFormSubmit(JSON.stringify([...new FormData(e.currentTarget).entries()]));
          }
        }
      >
        <OtpInput
          name="otp"
          label="Enter OTP"
          classes={
            {
              group: "flex items-center gap-2",
              input: "w-12 h-12 text-center text-lg font-semibold border-2 rounded-cl-lg transition-all focus:outline-none bg-cl-bg-panel border-cl-border-input text-cl-text focus:border-cl-border-input-focus focus:ring-2 focus:ring-cl-accent/20 disabled:opacity-50 disabled:cursor-not-allowed data-[error]:border-cl-error data-[valid]:border-cl-success",
              label: "block text-sm font-medium mb-2 text-cl-text-secondary",
              separator: "text-lg select-none text-cl-text-tertiary"
            }
          }
        />
        <Button
          type="submit"
          className="mt-3 px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors bg-cl-accent text-cl-on-accent hover:bg-cl-accent/90 cursor-pointer"
        >
          Submit
        </Button>
      </form>
      <div
        className="mt-3 rounded-cl-md px-3 py-2 text-xs font-mono bg-cl-bg-elevated text-cl-text-tertiary"
        data-demo-action
      >
        onSubmit:
        {formSubmit}
      </div>
    </>
  );
}
