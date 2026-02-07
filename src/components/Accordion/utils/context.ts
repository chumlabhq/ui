import { createContext, useContext, useMemo, useCallback, useSyncExternalStore } from "react";
import type { AccordionContextValue, AccordionDispatchValue, AccordionItemContextValue, AccordionConfigValue } from "./types";

export const AccordionContext = createContext<AccordionContextValue | null>(null);

export const AccordionDispatchContext = createContext<AccordionDispatchValue | null>(null);

export const AccordionConfigContext = createContext<AccordionConfigValue | null>(null);

export interface ExpandedStore {
  subscribe: (listener: () => void) => () => void;
  getSnapshot: () => Set<string>;
  isExpanded: (value: string) => boolean;
}

export const AccordionExpandedContext = createContext<ExpandedStore | null>(null);

export function createExpandedStore(initial: Set<string>): ExpandedStore & { setValues: (v: Set<string>) => void } {
  let values = initial;
  const listeners = new Set<() => void>();
  return {
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getSnapshot: () => values,
    isExpanded: (value: string) => values.has(value),
    setValues: (v: Set<string>) => {
      if (v !== values) {
        values = v;
        listeners.forEach((l) => l());
      }
    },
  };
}

export function useExpandedStore(): ExpandedStore {
  const store = useContext(AccordionExpandedContext);
  if (!store) {
    throw new Error(
      "Accordion compound components must be used within an <Accordion> component"
    );
  }
  return store;
}

export function useIsItemExpanded(value: string): boolean {
  const store = useExpandedStore();
  const selector = useCallback(() => store.isExpanded(value), [store, value]);
  return useSyncExternalStore(store.subscribe, selector, selector);
}

export function useAccordionContext(): AccordionContextValue {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error(
      "Accordion compound components must be used within an <Accordion> component"
    );
  }
  return context;
}

export function useAccordionDispatch(): AccordionDispatchValue {
  const context = useContext(AccordionDispatchContext);
  if (!context) {
    throw new Error(
      "Accordion compound components must be used within an <Accordion> component"
    );
  }
  return context;
}

export function useAccordionConfig(): AccordionConfigValue {
  const context = useContext(AccordionConfigContext);
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
  const store = useExpandedStore();
  const dispatch = useAccordionDispatch();
  const isExpanded = useIsItemExpanded(value);

  return useMemo(() => ({
    isExpanded,
    toggle: () => dispatch.toggleItem(value),
    expand: () => {
      if (!isExpanded) {
        dispatch.toggleItem(value);
      }
    },
    collapse: () => {
      if (isExpanded) {
        dispatch.toggleItem(value);
      }
    },
  }), [isExpanded, dispatch, value]);
}

export function useAccordionState() {
  const store = useExpandedStore();
  const expandedValues = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
  const { type, itemCount } = useAccordionContext();
  const { disabled } = useAccordionConfig();

  return useMemo(() => ({
    expandedValues: Array.from(expandedValues),
    expandedCount: expandedValues.size,
    itemCount,
    type,
    disabled,
    isAllExpanded: expandedValues.size === itemCount,
    isAllCollapsed: expandedValues.size === 0,
  }), [expandedValues, itemCount, type, disabled]);
}
