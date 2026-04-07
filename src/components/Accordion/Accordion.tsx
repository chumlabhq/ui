import {
  forwardRef,
  useCallback,
  useRef,
  useMemo,
  useImperativeHandle,
} from "react";
import { useId } from "react";
import {
  AccordionContext,
  AccordionDispatchContext,
  AccordionConfigContext,
  AccordionExpandedContext,
} from "./utils/context";
import {
  DEFAULT_ACCORDION_CLASSES,
  DEFAULT_HEADING_LEVEL,
  DEFAULT_ORIENTATION,
  DEFAULT_DIRECTION,
  DEFAULT_LOOP,
  DEFAULT_SIZE,
  DEFAULT_VARIANT,
  DEFAULT_ANIMATION_EASING,
  DEFAULT_ANIMATION_DURATION,
  DEFAULT_ANNOUNCE_EXPANDED,
  SIZE_CLASSES,
  VARIANT_CLASSES,
  UNSTYLED_ACCORDION_CLASSES,
} from "./utils/constants";
import { Slot } from "../../utils/Slot";
import type {
  AccordionProps,
  AccordionDispatchValue,
  AccordionConfigValue,
  AccordionClasses,
  AccordionRef,
} from "./utils/types";
import { cn } from "../../utils/cn";
import { useAccordionFocus } from "./hooks/useAccordionFocus";
import { useAccordionStorage, useStorageSync } from "./hooks/useAccordionStorage";
import { useAccordionStateManager } from "./hooks/useAccordionStateManager";
import { usePrintStyles } from "./hooks/usePrintStyles";
import { useReducedMotion } from "./hooks/useReducedMotion";

const DEFAULT_PREVENT_CLOSE_TIMEOUT = 10000;

/**
 * Component: Accordion
 *
 * Purpose:
 * A vertically stacked set of collapsible sections. Each item has a trigger
 * (header) that toggles the visibility of its associated content panel.
 *
 * AI Usage Guidelines:
 * - Use type="single" collapsible for FAQs and settings panels
 * - Use type="multiple" for multi-section forms or filter panels
 * - Works out-of-the-box with no props beyond type and children
 * - Prefer variant/size props over custom classes for common styling
 * - Use defaultValue (uncontrolled) or value+onValueChange (controlled)
 *
 * Behavior:
 * - Single mode: one item open at a time (collapsible allows closing all)
 * - Multiple mode: any number open, optional maxExpanded limit
 * - Full keyboard navigation (Arrow keys, Home, End, Enter/Space)
 * - ARIA-compliant with aria-expanded, role="region", aria-live announcements
 * - Smooth CSS transitions with configurable duration/easing
 * - Supports unstyled mode for fully custom styling
 *
 * Reference:
 * - ACCORDION.ai.md (this directory) — full AI knowledge doc with props, styling guide, patterns
 * - src/pages/demo/AccordionDemo.tsx — live demo with all features implemented
 */
const Accordion = forwardRef<AccordionRef, AccordionProps>((props, ref) => {
  const {
    type,
    orientation = DEFAULT_ORIENTATION,
    dir = DEFAULT_DIRECTION,
    disabled = false,
    loop = DEFAULT_LOOP,
    classes: classesProp,
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
    preventCloseTimeout = DEFAULT_PREVENT_CLOSE_TIMEOUT,
    "aria-label": ariaLabel,
    "aria-busy": ariaBusy,
    "aria-live": ariaLive,
    announceExpanded = DEFAULT_ANNOUNCE_EXPANDED,
    ...rest
  } = props;

  // Extract union-discriminated props to prevent DOM leakage via ...rest
  const {
    collapsible: _collapsible,
    maxExpanded: _maxExpanded,
    value: _value,
    defaultValue: _defaultValue,
    onValueChange: _onValueChange,
    ...domProps
  } = rest as Record<string, unknown>;

  const generatedId = useId();
  const accordionId = propId ?? `accordion-${generatedId}`;
  const collapsible = type === "single" ? ((props as { collapsible?: boolean }).collapsible ?? false) : true;
  const maxExpanded = type === "multiple" ? (props as { maxExpanded?: number }).maxExpanded : undefined;
  const controlledValue = (props as { value?: string | string[] }).value;
  const defaultValue = (props as { defaultValue?: string | string[] }).defaultValue;
  const onValueChange = (props as { onValueChange?: (...args: unknown[]) => void }).onValueChange;

  const elementRef = useRef<HTMLDivElement>(null);
  const announcerRef = useRef<HTMLDivElement>(null);

  // ─── Reduced motion ──────────────────────────────────────────────────────
  const effectiveReduceMotion = useReducedMotion(reduceMotion);

  // ─── Print styles (deduplicated singleton) ───────────────────────────────
  usePrintStyles(expandOnPrint);

  // ─── Focus management ────────────────────────────────────────────────────
  const {
    registerItem,
    unregisterItem,
    focusItem,
    focusItemByValue,
    getOrderedItems,
    itemCount,
  } = useAccordionFocus({ loop });

  // ─── Storage ─────────────────────────────────────────────────────────────
  const isControlled = controlledValue !== undefined;
  const { readFromStorage, writeToStorage } = useAccordionStorage({
    storageKey,
    isControlled,
  });

  // ─── Announcer ───────────────────────────────────────────────────────────
  const announce = useCallback(
    (message: string) => {
      if (announcerRef.current && announceExpanded) {
        announcerRef.current.textContent = message;
      }
    },
    [announceExpanded],
  );

  // ─── State management ────────────────────────────────────────────────────
  const {
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
  } = useAccordionStateManager({
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
  });

  // ─── Storage sync ────────────────────────────────────────────────────────
  useStorageSync(internalValue, writeToStorage, isControlled);

  // ─── Styling ─────────────────────────────────────────────────────────────
  const sizeClasses = SIZE_CLASSES[size];
  const variantClasses = VARIANT_CLASSES[variant];
  const baseClasses = unstyled ? UNSTYLED_ACCORDION_CLASSES : DEFAULT_ACCORDION_CLASSES;

  const mergedClasses: AccordionClasses = useMemo(
    () => ({
      root:
        classesProp?.root ??
        (unstyled ? "" : cn(baseClasses.root, variantClasses.root)),
      item: classesProp?.item ?? (unstyled ? "" : variantClasses.item),
      trigger:
        classesProp?.trigger ??
        (unstyled
          ? ""
          : cn(
              baseClasses.trigger,
              sizeClasses.trigger,
              variantClasses.trigger,
            )),
      triggerInner: classesProp?.triggerInner ?? baseClasses.triggerInner,
      content:
        classesProp?.content ??
        (unstyled ? "" : cn(baseClasses.content, sizeClasses.content)),
      contentWrapper: classesProp?.contentWrapper ?? baseClasses.contentWrapper,
      icon:
        classesProp?.icon ??
        (unstyled ? "" : cn(baseClasses.icon, sizeClasses.icon)),
      iconWrapper: classesProp?.iconWrapper ?? baseClasses.iconWrapper,
      subtitle:
        classesProp?.subtitle ??
        (unstyled ? "" : cn(baseClasses.subtitle, sizeClasses.subtitle)),
      triggerLeft: classesProp?.triggerLeft ?? baseClasses.triggerLeft,
      triggerRight: classesProp?.triggerRight ?? baseClasses.triggerRight,
      contentInner: classesProp?.contentInner ?? baseClasses.contentInner,
      heading: classesProp?.heading ?? baseClasses.heading,
    }),
    [classesProp, sizeClasses, variantClasses, baseClasses, unstyled],
  );

  // ─── Imperative handle ───────────────────────────────────────────────────
  const toggle = useCallback(
    (value: string) => toggleItem(value),
    [toggleItem],
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
      focusItem: (value: string, scrollIntoView?: boolean) => focusItemByValue(value, scrollIntoView),
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

  // ─── Context values ──────────────────────────────────────────────────────
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
      classes: mergedClasses,
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
      mergedClasses,
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

  // ─── Render ──────────────────────────────────────────────────────────────
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
    <AccordionExpandedContext.Provider value={expandedStore}>
      <AccordionDispatchContext.Provider value={dispatchValue}>
        <AccordionConfigContext.Provider value={configValue}>
          <AccordionContext.Provider value={contextValue}>
            <Comp
              ref={elementRef}
              id={accordionId}
              className={cn(mergedClasses.root, className) || undefined}
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
              {...domProps}
            >
              {children}
              {announceExpanded && (
                <div
                  ref={announcerRef}
                  role="status"
                  aria-live={ariaLive ?? "polite"}
                  aria-atomic="true"
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
