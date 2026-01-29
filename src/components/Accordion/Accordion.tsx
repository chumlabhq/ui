import { forwardRef, useState, useCallback, useRef, useMemo, useId } from "react";
import { AccordionContext } from "./utils/context";
import {
  DEFAULT_CLASS_NAMES,
  DEFAULT_HEADING_LEVEL,
  DEFAULT_ORIENTATION,
  DEFAULT_DIRECTION,
  DEFAULT_LOOP,
} from "./utils/constants";
import { Slot } from "./utils/slot";
import type {
  AccordionProps,
  AccordionContextValue,
  AccordionClassNames,
} from "./utils/types";

const Accordion = forwardRef<HTMLDivElement, AccordionProps>((props, ref) => {
  const {
    type,
    orientation = DEFAULT_ORIENTATION,
    dir = DEFAULT_DIRECTION,
    disabled = false,
    loop = DEFAULT_LOOP,
    classNames = {},
    headingLevel = DEFAULT_HEADING_LEVEL,
    children,
    className,
    asChild = false,
    id: propId,
    "aria-label": ariaLabel,
    ...rest
  } = props;

  const generatedId = useId();
  const accordionId = propId ?? `accordion-${generatedId}`;
  const collapsible = type === "single" ? (props.collapsible ?? false) : true;
  const controlledValue = props.value;
  const defaultValue = props.defaultValue;
  const onValueChange = props.onValueChange;

  const isControlled = controlledValue !== undefined;

  if (import.meta.env.DEV) {
    if (isControlled && onValueChange === undefined) {
      console.warn(
        "Accordion: A controlled component requires an `onValueChange` handler."
      );
    }
  }

  const [internalValue, setInternalValue] = useState<Set<string>>(() => {
    if (defaultValue === undefined) return new Set();
    if (Array.isArray(defaultValue)) return new Set(defaultValue);
    return new Set([defaultValue]);
  });

  const expandedValues = useMemo(() => {
    if (isControlled) {
      if (Array.isArray(controlledValue)) return new Set(controlledValue);
      return new Set([controlledValue]);
    }
    return internalValue;
  }, [isControlled, controlledValue, internalValue]);

  const itemsRef = useRef<Map<string, HTMLButtonElement>>(new Map());
  const itemOrderRef = useRef<Map<string, number>>(new Map());
  const orderCounterRef = useRef(0);
  const sortedItemsCacheRef = useRef<string[]>([]);
  const itemsCacheValidRef = useRef(false);

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
        }
      }
    },
    [invalidateItemsCache]
  );

  const unregisterItem = useCallback((value: string) => {
    itemsRef.current.delete(value);
    itemOrderRef.current.delete(value);
    invalidateItemsCache();
  }, [invalidateItemsCache]);

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

      const currentElement = document.activeElement;
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
    [loop, getOrderedItems]
  );

  const fireCallback = useCallback(
    (newSet: Set<string>) => {
      if (type === "single") {
        (onValueChange as ((value: string) => void) | undefined)?.(
          Array.from(newSet)[0] ?? ""
        );
      } else {
        (onValueChange as ((value: string[]) => void) | undefined)?.(
          Array.from(newSet)
        );
      }
    },
    [type, onValueChange]
  );

  const toggleItem = useCallback(
    (value: string) => {
      const computeNewValue = (prev: Set<string>): Set<string> => {
        const newSet = new Set(prev);
        const isCurrentlyExpanded = newSet.has(value);

        if (isCurrentlyExpanded) {
          if (type === "single" && !collapsible && newSet.size === 1) {
            return prev;
          }
          newSet.delete(value);
        } else {
          if (type === "single") {
            newSet.clear();
          }
          newSet.add(value);
        }

        return newSet;
      };

      if (isControlled) {
        const newSet = computeNewValue(expandedValues);
        if (newSet !== expandedValues) {
          fireCallback(newSet);
        }
      } else {
        setInternalValue((prev) => {
          const newSet = computeNewValue(prev);
          if (newSet !== prev) {
            fireCallback(newSet);
          }
          return newSet;
        });
      }
    },
    [type, collapsible, isControlled, expandedValues, fireCallback]
  );

  const mergedClassNames: AccordionClassNames = useMemo(
    () => ({
      root: classNames.root ?? DEFAULT_CLASS_NAMES.root,
      item: classNames.item ?? DEFAULT_CLASS_NAMES.item,
      trigger: classNames.trigger ?? DEFAULT_CLASS_NAMES.trigger,
      content: classNames.content ?? DEFAULT_CLASS_NAMES.content,
      icon: classNames.icon ?? DEFAULT_CLASS_NAMES.icon,
    }),
    [
      classNames.root,
      classNames.item,
      classNames.trigger,
      classNames.content,
      classNames.icon,
    ]
  );

  const contextValue: AccordionContextValue = useMemo(
    () => ({
      type,
      orientation,
      dir,
      disabled,
      collapsible,
      loop,
      classNames: mergedClassNames,
      headingLevel,
      expandedValues,
      toggleItem,
      registerItem,
      unregisterItem,
      focusItem,
      accordionId,
    }),
    [
      type,
      orientation,
      dir,
      disabled,
      collapsible,
      loop,
      mergedClassNames,
      headingLevel,
      expandedValues,
      toggleItem,
      registerItem,
      unregisterItem,
      focusItem,
      accordionId,
    ]
  );

  const hasExpanded = expandedValues.size > 0;
  const Comp = asChild ? Slot : "div";

  return (
    <AccordionContext.Provider value={contextValue}>
      <Comp
        ref={ref}
        id={accordionId}
        className={`${mergedClassNames.root} ${className ?? ""}`.trim()}
        data-orientation={orientation}
        data-state={hasExpanded ? "has-expanded" : "all-closed"}
        data-type={type}
        dir={dir}
        aria-label={ariaLabel}
        {...rest}
      >
        {children}
      </Comp>
    </AccordionContext.Provider>
  );
});

Accordion.displayName = "Accordion";

export default Accordion;
