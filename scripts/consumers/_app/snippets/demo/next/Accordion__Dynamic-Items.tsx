"use client";

import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@chumlab/ui/accordion";

export default function AccordionExample() {
  const [dynamicItems, setDynamicItems] = useState([
    {
      id: "dyn-1",
      title: "First Dynamic Item",
      content: "Content for the first item.",
    },
    {
      id: "dyn-2",
      title: "Second Dynamic Item",
      content: "Content for the second item.",
    },
  ]);
  const removeItem = (id: string) => {
    setDynamicItems((prev) => prev.filter((item) => item.id !== id));
  };
  return (
    <Accordion
      selectionMode="multiple"
      classes={
        {
          root: "w-full",
          item: "border-b border-cl-border last:border-b-0",
          trigger: "flex w-full items-center justify-between px-4 py-4 text-left text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-cl-text hover:bg-cl-bg-hover focus-visible:ring-cl-accent focus-visible:ring-offset-cl-bg",
          icon: "h-4 w-4 shrink-0 transition-transform duration-200 text-cl-text-secondary"
        }
      }
    >
      {
        dynamicItems.map((item) => (
          <AccordionItem key={item.id} value={item.id}>
            <AccordionTrigger
              rightSlot={
                <span
                  role="button"
                  tabIndex={0}
                  className="text-xs px-2 py-0.5 rounded cursor-pointer text-cl-error hover:bg-cl-bg-elevated"
                  onClick={
                    (e) => {
                      e.stopPropagation();
                      removeItem(item.id);
                    }
                  }
                  onKeyDown={
                    (e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        e.stopPropagation();
                        removeItem(item.id);
                      }
                    }
                  }
                >
                  Remove
                </span>
              }
            >
              {item.title}
            </AccordionTrigger>
            <AccordionContent>
              {item.content}
            </AccordionContent>
          </AccordionItem>
        ))
      }
    </Accordion>
  );
}
