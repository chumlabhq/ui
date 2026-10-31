"use client";

import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@chumlab/ui/accordion";

export default function AccordionExample() {
  const [singleValue, setSingleValue] = useState<string | null>("item-1");
  return (
    <Accordion
      selectionMode="single"
      value={singleValue}
      onValueChange={setSingleValue}
      collapsible
      classes={
        {
          root: "w-full",
          item: "border-b border-cl-border last:border-b-0",
          trigger: "flex w-full items-center justify-between px-4 py-4 text-start text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-cl-text hover:bg-cl-bg-hover focus-visible:ring-cl-accent focus-visible:ring-offset-cl-bg",
          icon: "h-4 w-4 shrink-0 transition-transform duration-200 text-cl-text-secondary"
        }
      }
    >
      <AccordionItem value="item-1">
        <AccordionTrigger>Item 1</AccordionTrigger>
        <AccordionContent>Content for item 1</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Item 2</AccordionTrigger>
        <AccordionContent>Content for item 2</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Item 3</AccordionTrigger>
        <AccordionContent>Content for item 3</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
