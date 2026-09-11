"use client";

import { useRef, useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionRef, AccordionTrigger } from "@chumlab/ui/accordion";

export default function AccordionExample() {
  const [toggleLog, setToggleLog] = useState<string[]>([]);
  const accordionRef = useRef<AccordionRef>(null);
  return (
    <Accordion
      type="multiple"
      ref={accordionRef}
      classes={
        {
          root: "w-full",
          item: "border-b border-cl-border last:border-b-0",
          trigger: "flex w-full items-center justify-between px-4 py-4 text-left text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-cl-text hover:bg-cl-bg-hover focus-visible:ring-cl-accent dark:text-cl-text dark:hover:bg-cl-bg-elevated dark:focus-visible:ring-cl-accent dark:focus-visible:ring-offset-cl-bg",
          icon: "h-4 w-4 shrink-0 transition-transform duration-200 text-cl-text-secondary"
        }
      }
      onExpandedChange={
        (e) => {
          setToggleLog((prev) => [
            `${e.value} ${e.isExpanded ? "expanded" : "collapsed"} (${e.expandedCount}/${e.totalCount})`,
            ...prev.slice(0, 4)
          ]);
        }
      }
    >
      <AccordionItem value="ref-1">
        <AccordionTrigger>First Item</AccordionTrigger>
        <AccordionContent>Controlled via ref.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="ref-2">
        <AccordionTrigger>Second Item</AccordionTrigger>
        <AccordionContent>Toggle me with the button above.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="ref-3">
        <AccordionTrigger>Third Item</AccordionTrigger>
        <AccordionContent>Expand all to see me.</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
