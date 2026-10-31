"use client";

import { useState } from "react";
import { Button } from "@chumlab/ui/button";
import { Modal, useModal } from "@chumlab/ui/modal";

const ModalChildWithHook = () => {
  const { close, nestingLevel } = useModal();
  return (
    <div className="space-y-3">
      <p className="text-cl-text-secondary">
        This component uses the <code className="px-1.5 py-0.5 bg-cl-bg-hover rounded text-sm font-mono">useModal()</code> hook.
      </p>
      <div className="p-3 bg-cl-accent/10 rounded-cl-md text-sm text-cl-accent">
        Current nesting level: <span className="font-bold">{nestingLevel}</span>
      </div>
      <Button
        onClick={close}
        className="px-4 py-2 bg-cl-accent text-cl-on-accent rounded-cl-md hover:bg-cl-accent/90 transition-colors cursor-pointer"
      >
        Close via useModal().close()
      </Button>
    </div>
  );
};

export default function ModalExample() {
  const [useModalOpen, setUseModalOpen] = useState(false);
  return (
    <>
      <Button
        className="inline-flex items-center justify-center gap-2 h-10 px-5 text-sm font-medium rounded-cl-md transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-cl-text text-cl-bg hover:opacity-90 cursor-pointer"
        onClick={() => setUseModalOpen(true)}
      >
        useModal Demo
      </Button>
      <Modal
        open={useModalOpen}
        onOpenChange={setUseModalOpen}
        title="useModal Hook"
        classes={
          {
            content: "w-full max-w-lg m-4 rounded-cl-lg shadow-2xl overflow-hidden bg-cl-bg-elevated border border-cl-border",
            header: "flex items-start gap-3 p-6 pb-4",
            title: "font-semibold text-lg text-cl-text",
            closeTrigger: "shrink-0 p-1 rounded-cl-md hover:bg-cl-bg-hover transition-colors ms-auto",
            closeIcon: "w-5 h-5 text-cl-text-tertiary",
            body: "px-6 pb-6"
          }
        }
      >
        <ModalChildWithHook />
      </Modal>
    </>
  );
}
