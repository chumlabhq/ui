import { createContext, useContext, useMemo } from "react";
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

export function useAccordionItem(value: string) {
  const accordion = useAccordionContext();
  
  return useMemo(() => ({
    isExpanded: accordion.expandedValues.has(value),
    toggle: () => accordion.toggleItem(value),
    expand: () => {
      if (!accordion.expandedValues.has(value)) {
        accordion.toggleItem(value);
      }
    },
    collapse: () => {
      if (accordion.expandedValues.has(value)) {
        accordion.toggleItem(value);
      }
    },
  }), [accordion, value]);
}

export function useAccordionState() {
  const accordion = useAccordionContext();
  
  return useMemo(() => ({
    expandedValues: Array.from(accordion.expandedValues),
    expandedCount: accordion.expandedValues.size,
    itemCount: accordion.itemCount,
    type: accordion.type,
    disabled: accordion.disabled,
    isAllExpanded: accordion.expandedCount === accordion.itemCount,
    isAllCollapsed: accordion.expandedCount === 0,
  }), [accordion]);
}
