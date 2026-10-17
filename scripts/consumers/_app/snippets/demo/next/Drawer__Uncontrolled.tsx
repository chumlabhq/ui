"use client";

import { useState } from "react";
import { Button } from "@chumlab/ui/button";
import { Drawer, DrawerBody, DrawerCloseButton, DrawerHeader } from "@chumlab/ui/drawer";

export default function DrawerExample() {
  const [announcementMounts, setAnnouncementMounts] = useState(0);
  return (
    <>
      <Button
        className="border border-cl-border bg-cl-bg-elevated text-cl-text"
        onClick={() => setAnnouncementMounts((n) => n + 1)}
      >
        Show it
      </Button>
      {
        announcementMounts > 0 && (
          <Drawer key={announcementMounts} defaultOpen side="right" aria-label="What's new">
            <div className="flex h-full flex-col bg-cl-bg text-cl-text">
              <DrawerHeader
                className="flex items-center justify-between border-b border-cl-border px-6 py-4"
              >
                <h2 className="text-[17px] font-semibold">What's new</h2>
                <DrawerCloseButton
                  className="inline-flex h-9 w-9 items-center justify-center rounded-cl-md text-cl-text-tertiary hover:bg-cl-bg-hover hover:text-cl-text"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </DrawerCloseButton>
              </DrawerHeader>
              <DrawerBody
                className="flex-1 overflow-y-auto px-6 py-5 text-sm text-cl-text-secondary"
              >
                Saved filters now sync across your devices.
              </DrawerBody>
            </div>
          </Drawer>
        )
      }
    </>
  );
}
