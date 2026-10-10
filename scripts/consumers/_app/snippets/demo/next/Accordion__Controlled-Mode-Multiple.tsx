"use client";

import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@chumlab/ui/accordion";

export default function AccordionExample() {
  const [multipleValue, setMultipleValue] = useState<string[]>(["multi-1"]);
  return (
    <Accordion
      selectionMode="multiple"
      value={multipleValue}
      onValueChange={setMultipleValue}
      classes={
        {
          root: "w-full",
          item: "border-b border-cl-border last:border-b-0",
          trigger: "flex w-full items-center justify-between px-4 py-4 text-left text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-cl-text hover:bg-cl-bg-hover focus-visible:ring-cl-accent focus-visible:ring-offset-cl-bg",
          icon: "h-4 w-4 shrink-0 transition-transform duration-200 text-cl-text-secondary"
        }
      }
    >
      <AccordionItem value="multi-1">
        <AccordionTrigger>First</AccordionTrigger>
        <AccordionContent>First content</AccordionContent>
      </AccordionItem>
      <AccordionItem value="multi-2">
        <AccordionTrigger>Second</AccordionTrigger>
        <AccordionContent>Second content</AccordionContent>
      </AccordionItem>
      <AccordionItem value="multi-3">
        <AccordionTrigger>Third</AccordionTrigger>
        <AccordionContent>Third content</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
