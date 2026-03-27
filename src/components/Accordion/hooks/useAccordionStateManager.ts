import { useCallback, useMemo, useRef, useState } from "react";
import { useIsomorphicLayoutEffect } from "../../../utils/useIsomorphicLayoutEffect";
import { createExpandedStore } from "../utils/context";
import type { AccordionExpandEvent, AccordionType } from "../utils/types";

export interface UseAccordionStateManagerOptions {
  type: AccordionType;
  collapsible: boolean;
  maxExpanded: number | undefined;
  controlledValue: string | string[] | undefined;
  defaultValue: string | string[] | undefined;
  onValueChange: ((value: string | null) => void) | ((value: string[]) => void) | undefined;
  onExpandedChange: ((event: AccordionExpandEvent) => void) | undefined;
  announceExpanded: boolean;
  announce: (message: string) => void;
  defaultExpandAll: boolean;
  getOrderedItems: () => string[];
  itemCount: number;
  preventClose: ((value: string) => boolean | Promise<boolean>) | undefined;
  preventCloseTimeout: number;
  readFromStorage: () => string[] | null;
}

export interface UseAccordionStateManagerReturn {
  expandedValues: Set<string>;
  expandedStore: ReturnType<typeof createExpandedStore>;
  toggleItem: (value: string) => void;
  expandAll: () => void;
  collapseAll: () => void;
  expand: (value: string) => void;
  collapse: (value: string) => void;
  isExpanded: (value: string) => boolean;
  pendingItem: string | null;
  internalValue: Set<string>;
}

export function useAccordionStateManager(
  options: UseAccordionStateManagerOptions,
): UseAccordionStateManagerReturn {
  const {
    type,
    collapsible,
    maxExpanded,
    controlledValue,
    defaultValue,
    onValueChange,
    onExpandedChange,
    announceExpanded,
    announce,
    defaultExpandAll,
    getOrderedItems,
    itemCount,
    preventClose,
    preventCloseTimeout,
    readFromStorage,
  } = options;

  const isControlled = controlledValue !== undefined;

  // Use refs for latest callback values to avoid stale closures
  const onValueChangeRef = useRef(onValueChange);
  const onExpandedChangeRef = useRef(onExpandedChange);
  const announceRef = useRef(announce);
  useIsomorphicLayoutEffect(() => {
    onValueChangeRef.current = onValueChange;
    onExpandedChangeRef.current = onExpandedChange;
    announceRef.current = announce;
  }, [onValueChange, onExpandedChange, announce]);

  const [internalValue, setInternalValue] = useState<Set<string>>(() => {
    const stored = readFromStorage();
    if (stored) return new Set(stored);

    if (defaultValue !== undefined) {
      if (Array.isArray(defaultValue)) return new Set(defaultValue);
      return new Set([defaultValue]);
    }

    return new Set();
  });

  const [pendingItem, setPendingItem] = useState<string | null>(null);

  const expandedValues = useMemo(() => {
    if (isControlled) {
      if (Array.isArray(controlledValue)) return new Set(controlledValue);
      return new Set([controlledValue]);
    }
    return internalValue;
  }, [isControlled, controlledValue, internalValue]);

  // Use ref for expandedValues to avoid stale closures in controlled mode
  const expandedValuesRef = useRef(expandedValues);
  useIsomorphicLayoutEffect(() => {
    expandedValuesRef.current = expandedValues;
  }, [expandedValues]);

  const [expandedStore] = useState(() => createExpandedStore(expandedValues));
  useIsomorphicLayoutEffect(() => {
    expandedStore.setValues(expandedValues);
  }, [expandedValues, expandedStore]);

  // defaultExpandAll — use layout effect to run synchronously before paint
  const defaultExpandAllApplied = useRef(false);
  useIsomorphicLayoutEffect(() => {
    if (
      defaultExpandAll &&
      type === "multiple" &&
      !isControlled &&
      !defaultExpandAllApplied.current
    ) {
      const items = getOrderedItems();
      if (items.length > 0) {
        defaultExpandAllApplied.current = true;
        setInternalValue(new Set(items));
      }
    }
  }, [defaultExpandAll, type, isControlled, getOrderedItems]);

  // ─── Unified state change logic ──────────────────────────────────────────

  const fireCallbacks = useCallback(
    (newSet: Set<string>, changedValue?: string, wasExpanded?: boolean) => {
      const cb = onValueChangeRef.current;
      if (cb) {
        if (type === "single") {
          const singleValue = Array.from(newSet)[0] ?? null;
          (cb as (value: string | null) => void)(singleValue);
        } else {
          (cb as (value: string[]) => void)(Array.from(newSet));
        }
      }

      if (
        onExpandedChangeRef.current &&
        changedValue !== undefined &&
        wasExpanded !== undefined
      ) {
        onExpandedChangeRef.current({
          value: changedValue,
          isExpanded: !wasExpanded,
          expandedCount: newSet.size,
          totalCount: itemCount,
        });
      }

      if (
        announceExpanded &&
        changedValue !== undefined &&
        wasExpanded !== undefined
      ) {
        const action = wasExpanded ? "collapsed" : "expanded";
        announceRef.current(
          `Item ${action}. ${newSet.size} of ${itemCount} items expanded.`,
        );
      }
    },
    [type, itemCount, announceExpanded],
  );

  const computeNewValue = useCallback(
    (
      prev: Set<string>,
      value: string,
      isCurrentlyExpanded: boolean,
    ): Set<string> => {
      const newSet = new Set(prev);

      if (isCurrentlyExpanded) {
        if (type === "single" && !collapsible && newSet.size === 1) {
          return prev;
        }
        newSet.delete(value);
      } else {
        if (type === "single") {
          newSet.clear();
        }
        if (maxExpanded !== undefined && newSet.size >= maxExpanded) {
          return prev;
        }
        newSet.add(value);
      }

      return newSet;
    },
    [type, collapsible, maxExpanded],
  );

  const applyStateChange = useCallback(
    (
      newSet: Set<string>,
      changedValue?: string,
      wasExpanded?: boolean,
    ) => {
      const currentValues = expandedValuesRef.current;
      if (newSet === currentValues) return;

      if (!isControlled) {
        setInternalValue(newSet);
      }
      fireCallbacks(newSet, changedValue, wasExpanded);
    },
    [isControlled, fireCallbacks],
  );

  const performToggle = useCallback(
    (value: string, isCurrentlyExpanded: boolean) => {
      const current = expandedValuesRef.current;
      const newSet = computeNewValue(current, value, isCurrentlyExpanded);
      applyStateChange(newSet, value, isCurrentlyExpanded);
    },
    [computeNewValue, applyStateChange],
  );

  const toggleItem = useCallback(
    (value: string) => {
      const isCurrentlyExpanded = expandedValuesRef.current.has(value);

      if (isCurrentlyExpanded && preventClose) {
        const result = preventClose(value);
        if (result instanceof Promise) {
          setPendingItem(value);

          const timeoutId = setTimeout(() => {
            setPendingItem(null);
            performToggle(value, isCurrentlyExpanded);
          }, preventCloseTimeout);

          result
            .then((shouldPrevent) => {
              clearTimeout(timeoutId);
              setPendingItem(null);
              if (!shouldPrevent) {
                performToggle(value, isCurrentlyExpanded);
              }
            })
            .catch(() => {
              clearTimeout(timeoutId);
              setPendingItem(null);
            });
          return;
        }
        if (result) return;
      }

      performToggle(value, isCurrentlyExpanded);
    },
    [preventClose, preventCloseTimeout, performToggle],
  );

  const expandAll = useCallback(() => {
    if (type !== "multiple") return;

    const items = getOrderedItems();
    const itemsToExpand = maxExpanded ? items.slice(0, maxExpanded) : items;
    const newSet = new Set(itemsToExpand);

    applyStateChange(newSet);

    if (announceExpanded) {
      announceRef.current(
        `All items expanded. ${itemsToExpand.length} of ${items.length} items expanded.`,
      );
    }
  }, [type, maxExpanded, getOrderedItems, applyStateChange, announceExpanded]);

  const collapseAll = useCallback(() => {
    if (type === "single" && !collapsible) return;

    const newSet = new Set<string>();
    applyStateChange(newSet);

    if (announceExpanded) {
      announceRef.current("All items collapsed.");
    }
  }, [type, collapsible, applyStateChange, announceExpanded]);

  const expand = useCallback(
    (value: string) => {
      const current = expandedValuesRef.current;
      if (current.has(value)) return;

      if (type === "single") {
        const newSet = new Set([value]);
        applyStateChange(newSet, value, false);
      } else {
        if (maxExpanded !== undefined && current.size >= maxExpanded) return;
        const newSet = new Set(current);
        newSet.add(value);
        applyStateChange(newSet, value, false);
      }
    },
    [type, maxExpanded, applyStateChange],
  );

  const collapse = useCallback(
    (value: string) => {
      const current = expandedValuesRef.current;
      if (!current.has(value)) return;

      if (type === "single" && !collapsible) return;

      const newSet = new Set(current);
      newSet.delete(value);
      applyStateChange(newSet, value, true);
    },
    [type, collapsible, applyStateChange],
  );

  const isExpanded = useCallback(
    (value: string) => expandedValues.has(value),
    [expandedValues],
  );

  return {
    expandedValues,
    expandedStore,
    toggleItem,
    expandAll,
    collapseAll,
    expand,
    collapse,
    isExpanded,
    pendingItem,
    internalValue,
  };
}
