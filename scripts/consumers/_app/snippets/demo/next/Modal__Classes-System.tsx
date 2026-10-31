"use client";

import { useState } from "react";
import { Button } from "@chumlab/ui/button";
import { Modal } from "@chumlab/ui/modal";

export default function ModalExample() {
  const [classesOpen, setClassesOpen] = useState(false);
  return (
    <>
      <Button
        className="inline-flex items-center justify-center gap-2 h-10 px-5 text-sm font-medium rounded-cl-md transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-cl-text text-cl-bg hover:opacity-90 cursor-pointer"
        onClick={() => setClassesOpen(true)}
      >
        Modal with Classes
      </Button>
      <Modal
        open={classesOpen}
        onOpenChange={setClassesOpen}
        title="Classes System Demo"
        description="Each slot is styled via the classes prop."
        classes={
          {
            root: "custom-root",
            overlay: "backdrop-blur-sm",
            content: "w-full max-w-lg m-4 rounded-cl-lg shadow-2xl overflow-hidden bg-cl-bg",
            header: "flex items-start gap-3 p-6 pb-4 border-b border-cl-border-input-focus",
            title: "font-semibold text-lg text-cl-accent",
            closeTrigger: "shrink-0 p-1 rounded-cl-md hover:bg-cl-accent/10 transition-colors ms-auto",
            body: "px-6 pb-6 pt-4"
          }
        }
      >
        <p className="text-cl-text-secondary">
          The
          <code className="px-1.5 py-0.5 bg-cl-bg-hover rounded text-sm font-mono">
            classes
          </code>
          prop accepts an object with keys for each slot: root, overlay, container, content, header, title, description, icon, closeButton, closeIcon, and body.
        </p>
        <div className="flex justify-end mt-6">
          <Button
            className="inline-flex items-center justify-center gap-2 h-10 px-5 text-sm font-medium rounded-cl-md transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-cl-text text-cl-bg hover:opacity-90 cursor-pointer"
            onClick={() => setClassesOpen(false)}
          >
            Got it
          </Button>
        </div>
      </Modal>
    </>
  );
}
