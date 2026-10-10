import { useState } from "react";
import { Button } from "@chumlab/ui/button";
import { Modal } from "@chumlab/ui/modal";

export default function ModalExample() {
  const [disableAnimOpen, setDisableAnimOpen] = useState(false);
  return (
    <>
      <Button
        className="inline-flex items-center justify-center gap-2 h-10 px-5 text-sm font-medium rounded-cl-md transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-cl-text text-cl-bg hover:opacity-90 cursor-pointer"
        onClick={() => setDisableAnimOpen(true)}
      >
        No Animation Modal
      </Button>
      <Modal
        open={disableAnimOpen}
        onOpenChange={setDisableAnimOpen}
        title="No Animation"
        description="This modal opens and closes instantly."
        reduceMotion={true}
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
          <code className="px-1.5 py-0.5 bg-cl-bg-hover rounded text-sm font-mono">
            reduceMotion=
            {true}
          </code>
          removes the open/close transitions; the default,
          <code className="px-1.5 py-0.5 bg-cl-bg-hover rounded text-sm font-mono">"auto"</code>
          , follows the OS setting.
        </p>
      </Modal>
    </>
  );
}
