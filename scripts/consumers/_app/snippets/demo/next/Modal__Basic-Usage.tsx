"use client";

import { useState } from "react";
import { Button } from "@chumlab/ui/button";
import { Modal } from "@chumlab/ui/modal";

export default function ModalExample() {
  const [basicOpen, setBasicOpen] = useState(false);
  return (
    <>
      <Button
        className="inline-flex items-center justify-center gap-2 h-10 px-5 text-sm font-medium rounded-cl-md transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-cl-text text-cl-bg hover:opacity-90 cursor-pointer"
        onClick={() => setBasicOpen(true)}
      >
        Open Modal
      </Button>
      <Modal
        open={basicOpen}
        onOpenChange={setBasicOpen}
        title="Welcome Back"
        description="Your session has been restored. You can continue where you left off."
        classes={{ content: "w-full max-w-lg m-4 rounded-cl-lg shadow-2xl overflow-hidden bg-cl-bg-elevated border border-cl-border" }}
      >
        <p className="text-sm text-cl-text-secondary">
          This modal uses only built-in default styles. It includes a title, description, close button, overlay with blur, focus trapping, and Escape key support — all out-of-the-box.
        </p>
        <div className="flex justify-end gap-3 mt-6">
          <Button
            className="px-4 py-2 text-sm font-medium rounded-cl-md transition-colors bg-cl-bg-elevated text-cl-text border border-cl-border hover:border-cl-border-input-hover hover:bg-cl-bg-hover cursor-pointer"
            onClick={() => setBasicOpen(false)}
          >
            Cancel
          </Button>
          <Button
            className="px-4 py-2 text-sm font-medium rounded-cl-md transition-colors bg-cl-text text-cl-bg hover:opacity-90 cursor-pointer"
            onClick={() => setBasicOpen(false)}
          >
            Continue
          </Button>
        </div>
      </Modal>
    </>
  );
}
