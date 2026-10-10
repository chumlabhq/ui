"use client";

import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@chumlab/ui/accordion";

export default function AccordionExample() {
  const [openStartCount, setOpenStartCount] = useState(0);
  const [openEndCount, setOpenEndCount] = useState(0);
  const [closeStartCount, setCloseStartCount] = useState(0);
  const [closeEndCount, setCloseEndCount] = useState(0);
  return (
    <>
      <Accordion
        selectionMode="single"
        collapsible
        classes={
          {
            root: "w-full",
            item: "border-b border-cl-border last:border-b-0",
            trigger: "flex w-full items-center justify-between px-4 py-4 text-left text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-cl-text hover:bg-cl-bg-hover focus-visible:ring-cl-accent focus-visible:ring-offset-cl-bg",
            icon: "h-4 w-4 shrink-0 transition-transform duration-200 text-cl-text-secondary"
          }
        }
      >
        <AccordionItem value="cb-1">
          <AccordionTrigger>Toggle to fire the callbacks</AccordionTrigger>
          <AccordionContent
            onOpenStart={() => setOpenStartCount((n) => n + 1)}
            onOpenEnd={() => setOpenEndCount((n) => n + 1)}
            onCloseStart={() => setCloseStartCount((n) => n + 1)}
            onCloseEnd={() => setCloseEndCount((n) => n + 1)}
          >
            Each lifecycle callback is counted in the readout below.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <div
        className="rounded-cl-md px-3 py-2 text-xs font-mono bg-cl-bg-elevated text-cl-text-tertiary"
        data-demo-action
      >
        <div>
          onOpenStart:
          {openStartCount ? `fired ${openStartCount}×` : "not fired yet"}
        </div>
        <div>
          onOpenEnd:
          {openEndCount ? `fired ${openEndCount}×` : "not fired yet"}
        </div>
        <div>
          onCloseStart:
          {closeStartCount ? `fired ${closeStartCount}×` : "not fired yet"}
        </div>
        <div>
          onCloseEnd:
          {closeEndCount ? `fired ${closeEndCount}×` : "not fired yet"}
        </div>
      </div>
    </>
  );
}
