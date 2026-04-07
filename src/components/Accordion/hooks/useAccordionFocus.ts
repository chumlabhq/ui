import { useCallback, useRef, useState } from "react";

export interface UseAccordionFocusOptions {
  loop: boolean;
}

export interface UseAccordionFocusReturn {
  registerItem: (value: string, element: HTMLButtonElement | null) => void;
  unregisterItem: (value: string) => void;
  focusItem: (direction: "next" | "prev" | "first" | "last") => void;
  focusItemByValue: (value: string, scrollIntoView?: boolean) => void;
  getOrderedItems: () => string[];
  itemCount: number;
}

export function useAccordionFocus({ loop }: UseAccordionFocusOptions): UseAccordionFocusReturn {
  const itemsRef = useRef<Map<string, HTMLButtonElement>>(new Map());
  const itemOrderRef = useRef<Map<string, number>>(new Map());
  const orderCounterRef = useRef(0);
  const sortedItemsCacheRef = useRef<string[]>([]);
  const itemsCacheValidRef = useRef(false);

  const [itemCount, setItemCount] = useState(0);

  const invalidateItemsCache = useCallback(() => {
    itemsCacheValidRef.current = false;
  }, []);

  const registerItem = useCallback(
    (value: string, element: HTMLButtonElement | null) => {
      if (element) {
        itemsRef.current.set(value, element);
        if (!itemOrderRef.current.has(value)) {
          itemOrderRef.current.set(value, orderCounterRef.current++);
          invalidateItemsCache();
          setItemCount((prev) => prev + 1);
        }
      }
    },
    [invalidateItemsCache],
  );

  const unregisterItem = useCallback(
    (value: string) => {
      itemsRef.current.delete(value);
      itemOrderRef.current.delete(value);
      invalidateItemsCache();
      setItemCount((prev) => Math.max(0, prev - 1));
    },
    [invalidateItemsCache],
  );

  const getOrderedItems = useCallback(() => {
    if (itemsCacheValidRef.current) {
      return sortedItemsCacheRef.current;
    }
    const entries = Array.from(itemOrderRef.current.entries());
    entries.sort((a, b) => a[1] - b[1]);
    sortedItemsCacheRef.current = entries.map(([value]) => value);
    itemsCacheValidRef.current = true;
    return sortedItemsCacheRef.current;
  }, []);

  const focusItem = useCallback(
    (direction: "next" | "prev" | "first" | "last") => {
      const items = getOrderedItems();
      if (items.length === 0) return;

      const currentElement = typeof document !== "undefined" ? document.activeElement : null;
      let currentIndex = -1;

      for (let i = 0; i < items.length; i++) {
        if (itemsRef.current.get(items[i]) === currentElement) {
          currentIndex = i;
          break;
        }
      }

      let targetIndex: number;
      switch (direction) {
        case "first":
          targetIndex = 0;
          break;
        case "last":
          targetIndex = items.length - 1;
          break;
        case "next":
          if (currentIndex === -1) {
            targetIndex = 0;
          } else if (currentIndex === items.length - 1) {
            targetIndex = loop ? 0 : currentIndex;
          } else {
            targetIndex = currentIndex + 1;
          }
          break;
        case "prev":
          if (currentIndex === -1) {
            targetIndex = items.length - 1;
          } else if (currentIndex === 0) {
            targetIndex = loop ? items.length - 1 : 0;
          } else {
            targetIndex = currentIndex - 1;
          }
          break;
      }

      const startIndex = targetIndex;
      const step = direction === "prev" ? -1 : 1;

      do {
        const targetValue = items[targetIndex];
        const targetElement = itemsRef.current.get(targetValue);
        if (targetElement && !targetElement.disabled) {
          targetElement.focus();
          return;
        }

        if (loop) {
          targetIndex = (targetIndex + step + items.length) % items.length;
        } else {
          targetIndex = targetIndex + step;
          if (targetIndex < 0 || targetIndex >= items.length) {
            return;
          }
        }
      } while (targetIndex !== startIndex);
    },
    [loop, getOrderedItems],
  );

  const focusItemByValue = useCallback((value: string, scrollIntoView = false) => {
    const element = itemsRef.current.get(value);
    if (element && !element.disabled) {
      element.focus();
      if (scrollIntoView) {
        element.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }, []);

  return {
    registerItem,
    unregisterItem,
    focusItem,
    focusItemByValue,
    getOrderedItems,
    itemCount,
  };
}
