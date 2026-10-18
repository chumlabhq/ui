import { useState } from "react";
import { Button } from "@chumlab/ui/button";
import { Modal } from "@chumlab/ui/modal";
import { OtpInput } from "@chumlab/ui/otp-input";

export default function OtpInputExample() {
  const [codeDialogOpen, setCodeDialogOpen] = useState(false);
  const [verifiedCode, setVerifiedCode] = useState<string | null>(null);
  return (
    <div data-demo-recipe="code-in-dialog" className="w-full space-y-4">
      <Button
        className="border border-cl-border bg-cl-bg-elevated text-cl-text"
        onClick={
          () => {
            setVerifiedCode(null);
            setCodeDialogOpen(true);
          }
        }
      >
        Verify your phone
      </Button>
      <Modal
        open={codeDialogOpen}
        onOpenChange={setCodeDialogOpen}
        title="Enter the code"
        description="We sent a six-digit code by text message."
      >
        <OtpInput
          label="Verification code"
          length={6}
          onComplete={
            (code) => {
              setVerifiedCode(code);
              setCodeDialogOpen(false);
            }
          }
        />
      </Modal>
      <p aria-live="polite" data-demo-otp-result="" className="text-sm text-cl-text">
        {verifiedCode ? `Verified with code ${verifiedCode}.` : "Not verified yet."}
      </p>
    </div>
  );
}
