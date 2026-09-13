"use client";

import { useState } from "react";
import { Button } from "@chumlab/ui/button";
import { Modal } from "@chumlab/ui/modal";

export default function ModalExample() {
  const [customZIndexOpen, setCustomZIndexOpen] = useState(false);
  return (
    <>
      <Button
        className="inline-flex items-center justify-center gap-2 h-10 px-5 text-sm font-medium rounded-cl-md transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-cl-text text-cl-bg hover:opacity-90 cursor-pointer"
        onClick={() => setCustomZIndexOpen(true)}
      >
        z-index: 99999
      </Button>
      <Modal
        open={customZIndexOpen}
        onOpenChange={setCustomZIndexOpen}
        title="Custom Z-Index"
        description="This modal renders with z-index: 99999."
        zIndex={99999}
        classes={
          {
            content: "w-full max-w-lg m-4 rounded-cl-lg shadow-2xl overflow-hidden bg-cl-bg-elevated border border-cl-border",
            header: "flex items-start gap-3 p-6 pb-4",
            title: "font-semibold text-lg text-cl-text",
            description: "mt-1 text-sm text-cl-text-secondary",
            closeTrigger: "shrink-0 p-1 rounded-cl-md hover:bg-cl-bg-hover transition-colors ml-auto",
            closeIcon: "w-5 h-5 text-cl-text-tertiary",
            body: "px-6 pb-6"
          }
        }
      >
        <p className="text-cl-text-secondary">
          Use the
          <code className="px-1.5 py-0.5 bg-cl-bg-hover rounded text-sm font-mono">zIndex</code>
          prop to control stacking order when integrating with other overlays.
        </p>
      </Modal>
    </>
  );
}
