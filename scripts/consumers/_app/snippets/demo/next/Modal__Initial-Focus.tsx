"use client";

import { useRef, useState } from "react";
import { Button } from "@chumlab/ui/button";
import { Modal } from "@chumlab/ui/modal";

export default function ModalExample() {
  const [initialFocusOpen, setInitialFocusOpen] = useState(false);
  const initialFocusRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <Button
        className="inline-flex items-center justify-center gap-2 h-10 px-5 text-sm font-medium rounded-cl-md transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-cl-text text-cl-bg hover:opacity-90 cursor-pointer"
        onClick={() => setInitialFocusOpen(true)}
      >
        Focus Specific Input
      </Button>
      <Modal
        open={initialFocusOpen}
        onOpenChange={setInitialFocusOpen}
        title="Initial Focus"
        description="The email input receives focus automatically on open."
        initialFocus={initialFocusRef}
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
          <div>
            <label
              htmlFor="initial-focus-name"
              className="block text-sm font-medium text-cl-text mb-1"
            >
              Name
            </label>
            <input
              id="initial-focus-name"
              type="text"
              placeholder="Your name"
              className="w-full px-3 py-2 border border-cl-border rounded-cl-md outline-none focus:ring-2 focus:ring-cl-accent"
            />
          </div>
          <div>
            <label
              htmlFor="initial-focus-email"
              className="block text-sm font-medium text-cl-text mb-1"
            >
              Email
            </label>
            <input
              id="initial-focus-email"
              ref={initialFocusRef}
              type="email"
              placeholder="you@example.com"
              className="w-full px-3 py-2 border border-cl-border rounded-cl-md outline-none focus:ring-2 focus:ring-cl-accent"
            />
          </div>
          <div className="flex justify-end">
            <Button
              className="inline-flex items-center justify-center gap-2 h-10 px-5 text-sm font-medium rounded-cl-md transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-cl-text text-cl-bg hover:opacity-90 cursor-pointer"
              onClick={() => setInitialFocusOpen(false)}
            >
              Submit
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
