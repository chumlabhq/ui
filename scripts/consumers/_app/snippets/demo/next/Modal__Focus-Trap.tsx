"use client";

import { useState } from "react";
import { Button } from "@chumlab/ui/button";
import { Modal } from "@chumlab/ui/modal";

export default function ModalExample() {
  const [focusTrapOpen, setFocusTrapOpen] = useState(false);
  const [noFocusTrapOpen, setNoFocusTrapOpen] = useState(false);
  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Button
          className="inline-flex items-center justify-center gap-2 h-10 px-5 text-sm font-medium rounded-cl-md transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-cl-text text-cl-bg hover:opacity-90 cursor-pointer"
          onClick={() => setFocusTrapOpen(true)}
        >
          With Focus Trap (default)
        </Button>
        <Button
          className="inline-flex items-center justify-center gap-2 h-10 px-5 text-sm font-medium rounded-cl-md transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-cl-bg-elevated text-cl-text border border-cl-border hover:border-cl-border-input hover:bg-cl-bg-elevated cursor-pointer"
          onClick={() => setNoFocusTrapOpen(true)}
        >
          Without Focus Trap
        </Button>
      </div>
      <Modal
        open={focusTrapOpen}
        onOpenChange={setFocusTrapOpen}
        title="Focus Trap Enabled"
        description="Tab cycles through focusable elements inside this modal."
        trapFocus={true}
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
        <div className="space-y-3">
          <p className="text-cl-text-secondary">
            Try pressing Tab - focus stays within the modal.
          </p>
          <input
            type="text"
            placeholder="First input"
            className="w-full px-3 py-2 border border-cl-border rounded-cl-md outline-none focus:ring-2 focus:ring-cl-accent"
          />
          <input
            type="text"
            placeholder="Second input"
            className="w-full px-3 py-2 border border-cl-border rounded-cl-md outline-none focus:ring-2 focus:ring-cl-accent"
          />
          <div className="flex justify-end gap-3">
            <Button
              className="inline-flex items-center justify-center gap-2 h-10 px-5 text-sm font-medium rounded-cl-md transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-cl-bg-elevated text-cl-text border border-cl-border hover:border-cl-border-input hover:bg-cl-bg-elevated cursor-pointer"
              onClick={() => setFocusTrapOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="inline-flex items-center justify-center gap-2 h-10 px-5 text-sm font-medium rounded-cl-md transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-cl-text text-cl-bg hover:opacity-90 cursor-pointer"
              onClick={() => setFocusTrapOpen(false)}
            >
              Confirm
            </Button>
          </div>
        </div>
      </Modal>
      <Modal
        open={noFocusTrapOpen}
        onOpenChange={setNoFocusTrapOpen}
        title="Focus Trap Disabled"
        description="Tab can move focus outside the modal."
        trapFocus={false}
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
        <div className="space-y-3">
          <p className="text-cl-text-secondary">
            With
            <code className="px-1.5 py-0.5 bg-cl-bg-hover rounded text-sm font-mono">
              trapFocus=false
            </code>
            , pressing Tab can move focus to elements behind the modal.
          </p>
          <input
            type="text"
            placeholder="Input field"
            className="w-full px-3 py-2 border border-cl-border rounded-cl-md outline-none focus:ring-2 focus:ring-cl-accent"
          />
          <div className="flex justify-end">
            <Button
              className="inline-flex items-center justify-center gap-2 h-10 px-5 text-sm font-medium rounded-cl-md transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-cl-text text-cl-bg hover:opacity-90 cursor-pointer"
              onClick={() => setNoFocusTrapOpen(false)}
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
