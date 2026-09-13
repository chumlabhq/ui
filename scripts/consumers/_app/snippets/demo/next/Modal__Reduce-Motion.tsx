"use client";

import { useState } from "react";
import { Button } from "@chumlab/ui/button";
import { Modal } from "@chumlab/ui/modal";

export default function ModalExample() {
  const [reduceMotionOpen, setReduceMotionOpen] = useState(false);
  const [reduceMotionAutoOpen, setReduceMotionAutoOpen] = useState(false);
  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Button
          className="inline-flex items-center justify-center gap-2 h-10 px-5 text-sm font-medium rounded-cl-md transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-cl-text text-cl-bg hover:opacity-90 cursor-pointer"
          onClick={() => setReduceMotionOpen(true)}
        >
          reduceMotion=true
        </Button>
        <Button
          className="inline-flex items-center justify-center gap-2 h-10 px-5 text-sm font-medium rounded-cl-md transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-cl-bg-elevated text-cl-text border border-cl-border hover:border-cl-border-input hover:bg-cl-bg-elevated cursor-pointer"
          onClick={() => setReduceMotionAutoOpen(true)}
        >
          reduceMotion="auto"
        </Button>
      </div>
      <Modal
        open={reduceMotionOpen}
        onOpenChange={setReduceMotionOpen}
        title="Reduce Motion (true)"
        description="This modal has animations completely disabled."
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
          With
          <code className="px-1.5 py-0.5 bg-cl-bg-hover rounded text-sm font-mono">
            reduceMotion=true
          </code>
          , all open/close animations are suppressed regardless of user preference.
        </p>
      </Modal>
      <Modal
        open={reduceMotionAutoOpen}
        onOpenChange={setReduceMotionAutoOpen}
        title='Reduce Motion ("auto")'
        description="Respects the user's prefers-reduced-motion setting."
        reduceMotion="auto"
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
          With
          <code className="px-1.5 py-0.5 bg-cl-bg-hover rounded text-sm font-mono">
            reduceMotion="auto"
          </code>
          , animations are disabled only when the OS/browser
          <code className="px-1.5 py-0.5 bg-cl-bg-hover rounded text-sm font-mono">
            prefers-reduced-motion
          </code>
          media query matches.
        </p>
      </Modal>
    </>
  );
}
