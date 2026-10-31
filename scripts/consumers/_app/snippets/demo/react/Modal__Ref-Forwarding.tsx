import { useRef, useState } from "react";
import { Button } from "@chumlab/ui/button";
import { Modal } from "@chumlab/ui/modal";

export default function ModalExample() {
  const modalRef = useRef<HTMLDivElement>(null);
  const [refForwardOpen, setRefForwardOpen] = useState(false);
  const [refFocusReadout, setRefFocusReadout] = useState("nothing yet");
  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Button
          className="inline-flex items-center justify-center gap-2 h-10 px-5 text-sm font-medium rounded-cl-md transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-cl-text text-cl-bg hover:opacity-90 cursor-pointer"
          onClick={() => setRefForwardOpen(true)}
        >
          Modal with Ref
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
            closeTrigger: "shrink-0 p-1 rounded-cl-md hover:bg-cl-bg-hover transition-colors ms-auto",
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
        <div className="flex justify-end gap-2 mt-4">
          <Button
            className="inline-flex items-center justify-center gap-2 h-10 px-5 text-sm font-medium rounded-cl-md transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-cl-bg-elevated text-cl-text border border-cl-border hover:border-cl-border-input hover:bg-cl-bg-elevated cursor-pointer"
            onClick={
              () => {
                modalRef.current?.focus();
                setRefFocusReadout(
                  document.activeElement === modalRef.current
                    ? "the modal content element (ref.current)"
                    : (document.activeElement?.tagName.toLowerCase() ?? "nothing"),
                );
              }
            }
          >
            Focus Modal via Ref
          </Button>
          <Button
            className="inline-flex items-center justify-center gap-2 h-10 px-5 text-sm font-medium rounded-cl-md transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-cl-text text-cl-bg hover:opacity-90 cursor-pointer"
            onClick={() => setRefForwardOpen(false)}
          >
            Close
          </Button>
        </div>
        <div
          className="mt-3 rounded-cl-md px-3 py-2 text-xs font-mono bg-cl-bg-elevated text-cl-text-tertiary"
          data-demo-action
          role="status"
        >
          focused:
          {refFocusReadout}
        </div>
      </Modal>
    </>
  );
}
