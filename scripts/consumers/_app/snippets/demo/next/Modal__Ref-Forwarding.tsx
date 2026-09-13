"use client";

import { useRef, useState } from "react";
import { Button } from "@chumlab/ui/button";
import { Modal } from "@chumlab/ui/modal";

export default function ModalExample() {
  const [refForwardOpen, setRefForwardOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Button
          className="inline-flex items-center justify-center gap-2 h-10 px-5 text-sm font-medium rounded-cl-md transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-cl-text text-cl-bg hover:opacity-90 cursor-pointer"
          onClick={() => setRefForwardOpen(true)}
        >
          Modal with Ref
        </Button>
        <Button
          className="inline-flex items-center justify-center gap-2 h-10 px-5 text-sm font-medium rounded-cl-md transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-cl-bg-elevated text-cl-text border border-cl-border hover:border-cl-border-input hover:bg-cl-bg-elevated cursor-pointer"
          onClick={() => modalRef.current?.focus()}
        >
          Focus Modal via Ref
        </Button>
      </div>
      <Modal
        ref={modalRef}
        open={refForwardOpen}
        onOpenChange={setRefForwardOpen}
        title="Ref Forwarding"
        description="A ref is attached to this modal's content element."
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
          The parent holds a ref to this modal. Use it for imperative actions like
          <code className="px-1.5 py-0.5 bg-cl-bg-hover rounded text-sm font-mono">
            ref.current?.focus()
          </code>
          .
        </p>
        <div className="flex justify-end mt-4">
          <Button
            className="inline-flex items-center justify-center gap-2 h-10 px-5 text-sm font-medium rounded-cl-md transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-cl-text text-cl-bg hover:opacity-90 cursor-pointer"
            onClick={() => setRefForwardOpen(false)}
          >
            Close
          </Button>
        </div>
      </Modal>
    </>
  );
}
