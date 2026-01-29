import { createContext, useContext } from "react";
import type { AccordionContextValue, AccordionItemContextValue } from "./types";

export const AccordionContext = createContext<AccordionContextValue | null>(null);

export function useAccordionContext(): AccordionContextValue {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error(
      "Accordion compound components must be used within an <Accordion> component"
    );
  }
  return context;
}

export const AccordionItemContext = createContext<AccordionItemContextValue | null>(null);

export function useAccordionItemContext(): AccordionItemContextValue {
  const context = useContext(AccordionItemContext);
  if (!context) {
    throw new Error(
      "AccordionTrigger and AccordionContent must be used within an <AccordionItem> component"
    );
  }
  return context;
}
