"use client";

import { useState } from "react";
import { Button } from "@chumlab/ui/button";
import { Modal } from "@chumlab/ui/modal";

export default function ModalExample() {
  const [customOverlayOpen, setCustomOverlayOpen] = useState(false);
  const [preventCloseOpen, setPreventCloseOpen] = useState(false);
  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Button
          className="inline-flex items-center justify-center gap-2 h-10 px-5 text-sm font-medium rounded-cl-md transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-cl-bg-elevated text-cl-text border border-cl-border hover:border-cl-border-input hover:bg-cl-bg-elevated cursor-pointer"
          onClick={() => setCustomOverlayOpen(true)}
        >
          Custom Overlay
        </Button>
        <Button
          className="inline-flex items-center justify-center gap-2 h-10 px-5 text-sm font-medium rounded-cl-md transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-cl-bg-elevated text-cl-text border border-cl-border hover:border-cl-border-input hover:bg-cl-bg-elevated cursor-pointer"
          onClick={() => setPreventCloseOpen(true)}
        >
          Prevent Outside Click & Escape
        </Button>
      </div>
      <Modal
        open={customOverlayOpen}
        onOpenChange={setCustomOverlayOpen}
        title="Custom Overlay"
        description="This modal has a brand-blue overlay with higher opacity."
        overlayColor="#5b9bff"
        overlayOpacity={0.4}
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
          Customize the overlay with overlayColor and overlayOpacity props.
        </p>
      </Modal>
      <Modal
        open={preventCloseOpen}
        onOpenChange={setPreventCloseOpen}
        title="Important Action Required"
        description="You must complete this action before continuing."
        closeOnOverlayClick={false}
        closeOnEscape={false}
        showCloseButton={false}
        showIcon
        icon={
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full bg-cl-warning/15"
          >
            <svg
              className="h-5 w-5 text-cl-warning"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        }
        classes={
          {
            content: "w-full max-w-lg m-4 rounded-cl-lg shadow-2xl overflow-hidden bg-cl-bg-elevated border border-cl-border",
            header: "flex items-start gap-3 p-6 pb-4",
            title: "font-semibold text-lg text-cl-text",
            description: "mt-1 text-sm text-cl-text-secondary",
            icon: "shrink-0",
            body: "px-6 pb-6"
          }
        }
      >
        <p className="text-cl-text-secondary">
          This modal cannot be dismissed by clicking outside or pressing Escape. Use the buttons below.
        </p>
        <div className="flex justify-end gap-3 mt-6">
          <Button
            className="inline-flex items-center justify-center gap-2 h-10 px-5 text-sm font-medium rounded-cl-md transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-cl-bg-elevated text-cl-text border border-cl-border hover:border-cl-border-input hover:bg-cl-bg-elevated cursor-pointer"
            onClick={() => setPreventCloseOpen(false)}
          >
            Cancel
          </Button>
          <Button
            className="inline-flex items-center justify-center gap-2 h-10 px-5 text-sm font-medium rounded-cl-md transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-cl-warning text-cl-bg hover:bg-cl-warning/90 cursor-pointer"
            onClick={() => setPreventCloseOpen(false)}
          >
            I Understand
          </Button>
        </div>
      </Modal>
    </>
  );
}
