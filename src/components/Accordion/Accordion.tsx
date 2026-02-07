import {
  forwardRef,
  useState,
  useCallback,
  useRef,
  useMemo,
  useImperativeHandle,
  useEffect,
} from "react";
import { useId } from "react";
import {
  AccordionContext,
  AccordionDispatchContext,
  AccordionConfigContext,
  AccordionExpandedContext,
  createExpandedStore,
} from "./utils/context";
import {
  DEFAULT_CLASS_NAMES,
  DEFAULT_HEADING_LEVEL,
  DEFAULT_ORIENTATION,
  DEFAULT_DIRECTION,
  DEFAULT_LOOP,
  DEFAULT_SIZE,
  DEFAULT_VARIANT,
  DEFAULT_ANIMATION_EASING,
  DEFAULT_ANIMATION_DURATION,
  DEFAULT_ANNOUNCE_EXPANDED,
  DEFAULT_STORAGE_CONFIG,
  SIZE_CLASSES,
  VARIANT_CLASSES,
  UNSTYLED_CLASS_NAMES,
  PRINT_STYLES,
} from "./utils/constants";
import { Slot } from "../../utils/Slot";
import type {
  AccordionProps,
  AccordionDispatchValue,
  AccordionConfigValue,
  AccordionClassNames,
  AccordionRef,
  StorageConfig,
} from "./utils/types";
import { cn } from "../../utils/cn";

const printStylesId = "kern-accordion-print-styles";
const PRINT_REF_COUNT_ATTR = "data-ref-count";

function injectPrintStyles() {
  if (typeof document === "undefined") return;
  const existing = document.getElementById(printStylesId);
  if (existing) {
    const count = parseInt(
      existing.getAttribute(PRINT_REF_COUNT_ATTR) || "0",
      10,
    );
    existing.setAttribute(PRINT_REF_COUNT_ATTR, String(count + 1));
    return;
  }
  const style = document.createElement("style");
  style.id = printStylesId;
  style.setAttribute(PRINT_REF_COUNT_ATTR, "1");
  style.textContent = PRINT_STYLES;
  document.head.appendChild(style);
}

function removePrintStyles() {
  if (typeof document === "undefined") return;
  const el = document.getElementById(printStylesId);
  if (!el) return;
  const count = parseInt(el.getAttribute(PRINT_REF_COUNT_ATTR) || "0", 10);
  if (count <= 1) {
    el.parentNode?.removeChild(el);
  } else {
    el.setAttribute(PRINT_REF_COUNT_ATTR, String(count - 1));
  }
}

function getStorageConfig(
  storageKey: string | StorageConfig | undefined,
): StorageConfig | null {
  if (!storageKey) return null;
  if (typeof storageKey === "string") {
    return { key: storageKey, ...DEFAULT_STORAGE_CONFIG };
  }
  return { ...DEFAULT_STORAGE_CONFIG, ...storageKey };
}

const Accordion = forwardRef<AccordionRef, AccordionProps>((props, ref) => {
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
    size = DEFAULT_SIZE,
    variant = DEFAULT_VARIANT,
    animationEasing = DEFAULT_ANIMATION_EASING,
    animationDuration = DEFAULT_ANIMATION_DURATION,
    reduceMotion = "auto",
    unstyled = false,
    defaultExpandAll = false,
    expandOnPrint = false,
    storageKey,
    onExpandedChange,
    onKeyDown,
    preventClose,
    "aria-label": ariaLabel,
    "aria-busy": ariaBusy,
    "aria-live": ariaLive,
    announceExpanded = DEFAULT_ANNOUNCE_EXPANDED,
    ...rest
  } = props;

  const generatedId = useId();
  const accordionId = propId ?? `accordion-${generatedId}`;
  const collapsible = type === "single" ? (props.collapsible ?? false) : true;
  const maxExpanded = type === "multiple" ? props.maxExpanded : undefined;
  const controlledValue = props.value;
  const defaultValue = props.defaultValue;
  const onValueChange = props.onValueChange;

  const isControlled = controlledValue !== undefined;

  const elementRef = useRef<HTMLDivElement>(null);
  const announcerRef = useRef<HTMLDivElement>(null);
  const storageConfig = useMemo(
    () => getStorageConfig(storageKey),
    [storageKey],
  );

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    if (reduceMotion !== "auto") return;
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) =>
      setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [reduceMotion]);

  useEffect(() => {
    if (expandOnPrint) {
      injectPrintStyles();
      return () => removePrintStyles();
    }
  }, [expandOnPrint]);

  const effectiveReduceMotion =
    reduceMotion === "auto" ? prefersReducedMotion : reduceMotion;

  if (process.env.NODE_ENV !== "production") {
    if (isControlled && onValueChange === undefined) {
      console.warn(
        "Accordion: A controlled component requires an `onValueChange` handler.",
      );
    }
    if (type === "single" && maxExpanded !== undefined) {
      console.warn(
        "Accordion: maxExpanded is only supported in multiple mode.",
      );
    }
  }

  const getInitialValue = useCallback((): Set<string> => {
    if (storageConfig && typeof window !== "undefined") {
      try {
        const stored = storageConfig.storage?.getItem(storageConfig.key);
        if (stored) {
          const values = storageConfig.deserialize!(stored);
          return new Set(values);
        }
      } catch (_) {
        void _;
      }
    }

    if (defaultValue !== undefined) {
      if (Array.isArray(defaultValue)) return new Set(defaultValue);
      return new Set([defaultValue]);
    }

    return new Set();
  }, [defaultValue, storageConfig]);

  const [internalValue, setInternalValue] =
    useState<Set<string>>(getInitialValue);
  const [itemCount, setItemCount] = useState(0);
  const [pendingItem, setPendingItem] = useState<string | null>(null);

  useEffect(() => {
    if (storageConfig && !isControlled) {
      try {
        const values = Array.from(internalValue);
        storageConfig.storage?.setItem(
          storageConfig.key,
          storageConfig.serialize!(values),
        );
      } catch (_) {
        void _;
      }
    }
  }, [internalValue, storageConfig, isControlled]);

  const expandedValues = useMemo(() => {
    if (isControlled) {
      if (Array.isArray(controlledValue)) return new Set(controlledValue);
      return new Set([controlledValue]);
    }
    return internalValue;
  }, [isControlled, controlledValue, internalValue]);

  const expandedStoreRef = useRef(createExpandedStore(expandedValues));
  useEffect(() => {
    expandedStoreRef.current.setValues(expandedValues);
  }, [expandedValues]);

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

  useEffect(() => {
    if (defaultExpandAll && type === "multiple" && !isControlled) {
      const items = getOrderedItems();
      if (items.length > 0 && internalValue.size === 0) {
        setInternalValue(new Set(items));
      }
    }
  }, [
    defaultExpandAll,
    type,
    isControlled,
    getOrderedItems,
    internalValue.size,
  ]);

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
    [loop, getOrderedItems],
  );

  const focusItemByValue = useCallback((value: string) => {
    const element = itemsRef.current.get(value);
    if (element && !element.disabled) {
      element.focus();
    }
  }, []);

  const announce = useCallback(
    (message: string) => {
      if (announcerRef.current && announceExpanded) {
        announcerRef.current.textContent = message;
      }
    },
    [announceExpanded],
  );

  const fireCallback = useCallback(
    (newSet: Set<string>, changedValue?: string, wasExpanded?: boolean) => {
      if (type === "single") {
        (onValueChange as ((value: string) => void) | undefined)?.(
          Array.from(newSet)[0] ?? "",
        );
      } else {
        (onValueChange as ((value: string[]) => void) | undefined)?.(
          Array.from(newSet),
        );
      }

      if (
        onExpandedChange &&
        changedValue !== undefined &&
        wasExpanded !== undefined
      ) {
        onExpandedChange({
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
        announce(
          `Item ${action}. ${newSet.size} of ${itemCount} items expanded.`,
        );
      }
    },
    [
      type,
      onValueChange,
      onExpandedChange,
      itemCount,
      announceExpanded,
      announce,
    ],
  );

  const performToggle = useCallback(
    (value: string, isCurrentlyExpanded: boolean) => {
      const computeNewValue = (prev: Set<string>): Set<string> => {
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
      };

      if (isControlled) {
        const newSet = computeNewValue(expandedValues);
        if (newSet !== expandedValues) {
          fireCallback(newSet, value, isCurrentlyExpanded);
        }
      } else {
        const newSet = computeNewValue(internalValue);
        if (newSet !== internalValue) {
          setInternalValue(newSet);
          fireCallback(newSet, value, isCurrentlyExpanded);
        }
      }
    },
    [
      type,
      collapsible,
      maxExpanded,
      isControlled,
      expandedValues,
      internalValue,
      fireCallback,
    ],
  );

  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const toggleItem = useCallback(
    (value: string) => {
      const isCurrentlyExpanded = expandedValues.has(value);

      if (isCurrentlyExpanded && preventClose) {
        const result = preventClose(value);
        if (result instanceof Promise) {
          setPendingItem(value);
          result
            .then((shouldPrevent) => {
              if (mountedRef.current) {
                setPendingItem(null);
                if (!shouldPrevent) {
                  performToggle(value, isCurrentlyExpanded);
                }
              }
            })
            .catch(() => {
              if (mountedRef.current) {
                setPendingItem(null);
              }
            });
          return;
        }
        if (result) return;
      }

      performToggle(value, isCurrentlyExpanded);
    },
    [expandedValues, preventClose, performToggle],
  );

  const sizeClasses = SIZE_CLASSES[size];
  const variantClasses = VARIANT_CLASSES[variant];
  const baseClasses = unstyled ? UNSTYLED_CLASS_NAMES : DEFAULT_CLASS_NAMES;

  const mergedClassNames: AccordionClassNames = useMemo(
    () => ({
      root:
        classNames.root ??
        (unstyled ? "" : cn(baseClasses.root, variantClasses.root)),
      item: classNames.item ?? (unstyled ? "" : variantClasses.item),
      trigger:
        classNames.trigger ??
        (unstyled
          ? ""
          : cn(
              baseClasses.trigger,
              sizeClasses.trigger,
              variantClasses.trigger,
            )),
      content:
        classNames.content ??
        (unstyled ? "" : cn(baseClasses.content, sizeClasses.content)),
      icon:
        classNames.icon ??
        (unstyled ? "" : cn(baseClasses.icon, sizeClasses.icon)),
      subtitle:
        classNames.subtitle ??
        (unstyled ? "" : cn(baseClasses.subtitle, sizeClasses.subtitle)),
      triggerLeft: classNames.triggerLeft ?? baseClasses.triggerLeft,
      triggerRight: classNames.triggerRight ?? baseClasses.triggerRight,
      contentInner: classNames.contentInner ?? baseClasses.contentInner,
    }),
    [classNames, sizeClasses, variantClasses, baseClasses, unstyled],
  );

  const expandAll = useCallback(() => {
    const items = getOrderedItems();
    if (type === "multiple") {
      const itemsToExpand = maxExpanded ? items.slice(0, maxExpanded) : items;
      if (isControlled) {
        (onValueChange as ((value: string[]) => void) | undefined)?.(
          itemsToExpand,
        );
      } else {
        setInternalValue(new Set(itemsToExpand));
        (onValueChange as ((value: string[]) => void) | undefined)?.(
          itemsToExpand,
        );
      }
      if (announceExpanded) {
        announce(
          `All items expanded. ${itemsToExpand.length} of ${items.length} items expanded.`,
        );
      }
    }
  }, [
    type,
    maxExpanded,
    isControlled,
    onValueChange,
    getOrderedItems,
    announceExpanded,
    announce,
  ]);

  const collapseAll = useCallback(() => {
    if (type === "single" && !collapsible) {
      return;
    }
    if (isControlled) {
      if (type === "single") {
        (onValueChange as ((value: string) => void) | undefined)?.("");
      } else {
        (onValueChange as ((value: string[]) => void) | undefined)?.([]);
      }
    } else {
      setInternalValue(new Set());
      if (type === "single") {
        (onValueChange as ((value: string) => void) | undefined)?.("");
      } else {
        (onValueChange as ((value: string[]) => void) | undefined)?.([]);
      }
    }
    if (announceExpanded) {
      announce("All items collapsed.");
    }
  }, [
    type,
    collapsible,
    isControlled,
    onValueChange,
    announceExpanded,
    announce,
  ]);

  const expand = useCallback(
    (value: string) => {
      if (expandedValues.has(value)) return;

      if (type === "single") {
        if (isControlled) {
          (onValueChange as ((value: string) => void) | undefined)?.(value);
        } else {
          setInternalValue(new Set([value]));
          (onValueChange as ((value: string) => void) | undefined)?.(value);
        }
      } else {
        if (maxExpanded !== undefined && expandedValues.size >= maxExpanded)
          return;

        if (isControlled) {
          const newValues = [...Array.from(expandedValues), value];
          (onValueChange as ((value: string[]) => void) | undefined)?.(
            newValues,
          );
        } else {
          const newSet = new Set(expandedValues);
          newSet.add(value);
          setInternalValue(newSet);
          (onValueChange as ((value: string[]) => void) | undefined)?.(
            Array.from(newSet),
          );
        }
      }
    },
    [type, maxExpanded, isControlled, onValueChange, expandedValues],
  );

  const collapse = useCallback(
    (value: string) => {
      if (!expandedValues.has(value)) return;

      if (type === "single") {
        if (!collapsible) return;
        if (isControlled) {
          (onValueChange as ((value: string) => void) | undefined)?.("");
        } else {
          setInternalValue(new Set());
          (onValueChange as ((value: string) => void) | undefined)?.("");
        }
      } else {
        if (isControlled) {
          const newValues = Array.from(expandedValues).filter(
            (v) => v !== value,
          );
          (onValueChange as ((value: string[]) => void) | undefined)?.(
            newValues,
          );
        } else {
          const newSet = new Set(expandedValues);
          newSet.delete(value);
          setInternalValue(newSet);
          (onValueChange as ((value: string[]) => void) | undefined)?.(
            Array.from(newSet),
          );
        }
      }
    },
    [type, collapsible, isControlled, onValueChange, expandedValues],
  );

  const toggle = useCallback(
    (value: string) => {
      toggleItem(value);
    },
    [toggleItem],
  );

  const isExpanded = useCallback(
    (value: string) => {
      return expandedValues.has(value);
    },
    [expandedValues],
  );

  useImperativeHandle(
    ref,
    () => ({
      expandAll,
      collapseAll,
      expand,
      collapse,
      toggle,
      getExpandedValues: () => Array.from(expandedValues),
      isExpanded,
      focusItem: focusItemByValue,
      getItemCount: () => itemCount,
      element: elementRef.current,
    }),
    [
      expandAll,
      collapseAll,
      expand,
      collapse,
      toggle,
      expandedValues,
      isExpanded,
      focusItemByValue,
      itemCount,
    ],
  );

  const dispatchValue: AccordionDispatchValue = useMemo(
    () => ({
      toggleItem,
      registerItem,
      unregisterItem,
      focusItem,
      focusItemByValue,
    }),
    [toggleItem, registerItem, unregisterItem, focusItem, focusItemByValue],
  );

  const effectiveDuration = effectiveReduceMotion ? 0 : animationDuration;

  const configValue: AccordionConfigValue = useMemo(
    () => ({
      orientation,
      dir,
      classNames: mergedClassNames,
      headingLevel,
      reduceMotion: effectiveReduceMotion,
      unstyled,
      accordionId,
      disabled,
      size,
      variant,
      animationDuration: effectiveDuration,
      animationEasing,
    }),
    [
      orientation,
      dir,
      mergedClassNames,
      headingLevel,
      effectiveReduceMotion,
      unstyled,
      accordionId,
      disabled,
      size,
      variant,
      effectiveDuration,
      animationEasing,
    ],
  );

  const contextValue = useMemo(
    () => ({
      type,
      collapsible,
      loop,
      itemCount,
      announceExpanded,
      maxExpanded,
      pendingItem,
    }),
    [
      type,
      collapsible,
      loop,
      itemCount,
      announceExpanded,
      maxExpanded,
      pendingItem,
    ],
  );

  const hasExpanded = expandedValues.size > 0;
  const Comp = asChild ? Slot : "div";

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement;
      const itemValue =
        target.closest("[data-value]")?.getAttribute("data-value") ?? null;
      onKeyDown?.(e, itemValue);
    },
    [onKeyDown],
  );

    return (
    <AccordionExpandedContext.Provider value={expandedStoreRef.current}>
    <AccordionDispatchContext.Provider value={dispatchValue}>
      <AccordionConfigContext.Provider value={configValue}>
        <AccordionContext.Provider value={contextValue}>
          <Comp
            ref={elementRef}
            id={accordionId}
            className={cn(mergedClassNames.root, className) || undefined}
            data-orientation={orientation}
            data-state={hasExpanded ? "has-expanded" : "all-closed"}
            data-type={type}
            data-size={size}
            data-variant={variant}
            data-accordion-expand-print={expandOnPrint || undefined}
            dir={dir}
            aria-label={ariaLabel}
            aria-busy={ariaBusy}
            onKeyDown={onKeyDown ? handleKeyDown : undefined}
            {...rest}
          >
            {children}
            {announceExpanded && (
              <div
                ref={announcerRef}
                role="status"
                aria-live={ariaLive ?? "polite"}
                aria-atomic="true"
                className="sr-only"
                style={{
                  position: "absolute",
                  width: 1,
                  height: 1,
                  padding: 0,
                  margin: -1,
                  overflow: "hidden",
                  clip: "rect(0, 0, 0, 0)",
                  whiteSpace: "nowrap",
                  border: 0,
                }}
              />
            )}
          </Comp>
        </AccordionContext.Provider>
      </AccordionConfigContext.Provider>
    </AccordionDispatchContext.Provider>
    </AccordionExpandedContext.Provider>
  );
});

Accordion.displayName = "Accordion";

export default Accordion;
