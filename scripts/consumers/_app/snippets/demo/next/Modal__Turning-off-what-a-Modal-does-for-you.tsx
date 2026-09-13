"use client";

import { useState } from "react";
import { Button } from "@chumlab/ui/button";
import { Modal } from "@chumlab/ui/modal";

export default function ModalExample() {
  const [bareOpen, setBareOpen] = useState(false);
  return (
    <>
      <Button
        className="inline-flex items-center justify-center gap-2 h-10 px-5 text-sm font-medium rounded-cl-md transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-cl-text text-cl-bg hover:opacity-90 cursor-pointer"
        onClick={() => setBareOpen(true)}
      >
        Open without overlay, scroll lock or focus restore
      </Button>
      <p className="mt-3 text-sm text-cl-text-secondary">
        Scroll the page behind it — it moves, which it cannot do for the modal above. Close it and focus returns to the top of the document rather than to this button.
      </p>
      <Modal
        open={bareOpen}
        onOpenChange={setBareOpen}
        title="No overlay, no scroll lock, no focus restore"
        showOverlay={false}
        lockScroll={false}
        restoreFocus={false}
      >
        <p>
          The page behind is still scrollable and undimmed. Each of the three is a separate prop, so a modal that should dim but not lock, or lock but not restore, is one prop away.
        </p>
      </Modal>
    </>
  );
}
