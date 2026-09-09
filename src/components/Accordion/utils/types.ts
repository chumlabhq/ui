import type {
  HTMLAttributes,
  ReactNode,
  FocusEvent,
  CSSProperties,
  KeyboardEvent,
} from "react";

export type AccordionType = "single" | "multiple";
export type Orientation = "vertical" | "horizontal";
export type Direction = "ltr" | "rtl";
export type DataState = "open" | "closed";
export type AccordionSize = "sm" | "md" | "lg";
export type AccordionVariant = "default" | "bordered" | "separated" | "flush";
export type AnimationEasing =
  | "linear"
  | "ease"
  | "ease-in"
  | "ease-out"
  | "ease-in-out"
  | string;

/** The four points in an expand or collapse a caller can hook. */
export interface AnimationCallbacks {
  /** Fires when the expand transition begins. */
  onOpenStart?: () => void;
  /** Fires when the expand transition finishes. */
  onOpenEnd?: () => void;
  /** Fires when the collapse transition begins. */
  onCloseStart?: () => void;
  /** Fires when the collapse transition finishes. */
  onCloseEnd?: () => void;
}

export interface AccordionClasses {
  /** The accordion's outer element. */
  root?: string;
  /** Each item's wrapper. Carries the variant's border treatment. */
  item?: string;
  /** The `<button>` inside each item's heading. */
  trigger?: string;
  /** The trigger's label text. */
  itemText?: string;
  /** The padded region inside the panel that holds the content. */
  body?: string;
  /** The animating panel. It is the grid whose row goes 0fr to 1fr. */
  content?: string;
  /** The wrapper around the expand/collapse indicator. */
  icon?: string;
  /**
   * The chevron glyph itself, inside the `icon` slot. Style `icon` to reach the
   * wrapper and this to reach the glyph alone.
   */
  itemIndicator?: string;
  /** The optional line under the trigger's label. */
  description?: string;
  /** An icon rendered before the label, when one is passed. */
  itemIcon?: string;
  /** The slot after the label for controls that are not the trigger itself. */
  triggerActions?: string;
  /** The heading element the trigger sits inside. */
  header?: string;
}

export interface AccordionRef {
  expandAll: () => void;
  collapseAll: () => void;
  expand: (value: string) => void;
  collapse: (value: string) => void;
  toggle: (value: string) => void;
  getExpandedValues: () => string[];
  isExpanded: (value: string) => boolean;
  focusItem: (value: string, scrollIntoView?: boolean) => void;
  getItemCount: () => number;
  element: HTMLDivElement | null;
}

/** The payload passed to `onExpandedChange`. */
export interface AccordionExpandEvent {
  /** The item the event is about. */
  value: string;
  /** Its state after the change. */
  isExpanded: boolean;
  /** How many items are expanded once the change lands. */
  expandedCount: number;
  /** How many items the accordion holds. */
  totalCount: number;
}

/** How an accordion persists which items are open. */
export interface StorageConfig {
  /** The storage key the expanded set is written under. */
  key: string;
  /** Where to persist. Defaults to `localStorage` when one exists. */
  storage?: Storage;
  /** Turns the expanded values into the stored string. */
  serialize?: (values: string[]) => string;
  /** Reads the stored string back into expanded values. */
  deserialize?: (stored: string) => string[];
}

interface AccordionBaseProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "defaultValue" | "onChange" | "dir" | "onKeyDown"
> {
  orientation?: Orientation;
  dir?: Direction;
  disabled?: boolean;
  loop?: boolean;
  classes?: AccordionClasses;
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  children: ReactNode;
  asChild?: boolean;
  size?: AccordionSize;
  variant?: AccordionVariant;
  animationEasing?: AnimationEasing;
  animationDuration?: number;
  reduceMotion?: boolean | "auto";
  unstyled?: boolean;
  defaultExpandAll?: boolean;
  expandOnPrint?: boolean;
  storageKey?: string | StorageConfig;
  onExpandedChange?: (event: AccordionExpandEvent) => void;
  onKeyDown?: (
    event: KeyboardEvent<HTMLDivElement>,
    itemValue: string | null,
  ) => void;
  preventClose?: (value: string) => boolean | Promise<boolean>;
  preventCloseTimeout?: number;
  onFocusCapture?: (event: FocusEvent<HTMLDivElement>) => void;
  onBlurCapture?: (event: FocusEvent<HTMLDivElement>) => void;
  "aria-busy"?: boolean;
  "aria-live"?: "off" | "polite" | "assertive";
  announceExpanded?: boolean;
}

/**
 * Single-select accordion props.
 *
 * @example
 * ```tsx
 * <Accordion type="single" value={expanded} onValueChange={setExpanded} collapsible>...</Accordion>
 * ```
 */
export interface AccordionSingleProps extends AccordionBaseProps {
  type: "single";
  /** Allow collapsing the active item. */
  collapsible?: boolean;
  /** Expanded item value. Not `activeItem` or `expandedItem`. */
  value?: string;
  /** Initial expanded item value for uncontrolled usage. */
  defaultValue?: string;
  /** Fires when the expanded item changes. Not `onChange`. */
  onValueChange?: (value: string | null) => void;
}

/**
 * Multi-select accordion props.
 *
 * @example
 * ```tsx
 * <Accordion type="multiple" value={expandedItems} onValueChange={setExpandedItems}>...</Accordion>
 * ```
 */
export interface AccordionMultipleProps extends AccordionBaseProps {
  type: "multiple";
  /** Maximum number of simultaneously expanded items. */
  maxExpanded?: number;
  /** Expanded item values. Not `activeItems` or `expandedItems`. */
  value?: string[];
  /** Initial expanded item values for uncontrolled usage. */
  defaultValue?: string[];
  /** Fires when the expanded items change. Not `onChange`. */
  onValueChange?: (value: string[]) => void;
}

/** Accordion props — discriminated by `type`. */
export type AccordionProps = AccordionSingleProps | AccordionMultipleProps;

export interface AccordionItemProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "onToggle"
> {
  /** Identifies this item. Matches the values passed to the accordion's `value` or `defaultValue`. */
  value: string;
  /** Disables this item alone. It stays visible but cannot be toggled and leaves the tab order. */
  disabled?: boolean;
  /** Content rendered inside this element. */
  children: ReactNode;
  /** Render the passed child instead of the default element, keeping behaviour, ARIA and props. */
  asChild?: boolean;
  /** Fires when the item's expanded state changes. */
  onExpandedChange?: (isExpanded: boolean) => void;
  "aria-describedby"?: string;
}

export interface AccordionTriggerProps extends Omit<
  HTMLAttributes<HTMLButtonElement>,
  "onClick"
> {
  /** Content rendered inside this element. */
  children: ReactNode;
  /** Icon shown while the item is expanded. Replaces the default chevron. */
  expandedIcon?: ReactNode;
  /** Icon shown while the item is collapsed. Replaces the default chevron. */
  collapsedIcon?: ReactNode;
  /** Which side of the trigger the icon sits on, or `"none"` to drop it. */
  iconPosition?: "left" | "right" | "none";
  /** Render the passed child instead of the default element, keeping behaviour, ARIA and props. */
  asChild?: boolean;
  /** Secondary line rendered under the trigger's label. */
  subtitle?: ReactNode;
  /** How the icon changes on toggle: rotate the chevron, switch between the two icons, or neither. */
  iconAnimation?: "rotate" | "switch" | "none";
  /** Content placed before the label, inside the trigger. */
  leftSlot?: ReactNode;
  /** Content placed after the label and before the icon. */
  rightSlot?: ReactNode;
  "aria-describedby"?: string;
}

export interface AccordionContentProps
  extends HTMLAttributes<HTMLDivElement>, AnimationCallbacks {
  /** Content rendered inside this element. */
  children: ReactNode;
  /** Keeps the panel mounted while collapsed, so an exit animation or a measurement has a node to read. */
  forceMount?: boolean;
  /** Expand and collapse duration in milliseconds. */
  animationDuration?: number;
  /** CSS easing function for the expand and collapse transition. */
  animationEasing?: AnimationEasing;
  /** Render the passed child instead of the default element, keeping behaviour, ARIA and props. */
  asChild?: boolean;
  /** Delays rendering the panel's children until it is first expanded. */
  lazyLoad?: boolean;
  /** Unmounts the panel's children again each time it collapses. */
  unmountOnClose?: boolean;
}

export interface AccordionDispatchValue {
  toggleItem: (value: string) => void;
  registerItem: (value: string, element: HTMLButtonElement | null) => void;
  unregisterItem: (value: string) => void;
  focusItem: (direction: "next" | "prev" | "first" | "last") => void;
  focusItemByValue: (value: string, scrollIntoView?: boolean) => void;
}

export interface AccordionConfigValue {
  orientation: Orientation;
  dir: Direction;
  classes: AccordionClasses;
  headingLevel: 1 | 2 | 3 | 4 | 5 | 6;
  reduceMotion: boolean;
  unstyled: boolean;
  accordionId: string;
  disabled: boolean;
  size: AccordionSize;
  variant: AccordionVariant;
  animationDuration: number;
  animationEasing: AnimationEasing;
}

/** What `Accordion` hands to the items beneath it. */
export interface AccordionContextValue {
  /** Whether one item or several may be expanded. */
  type: AccordionType;
  /** Whether the last expanded item may be closed. */
  collapsible: boolean;
  /** Whether arrow keys wrap past the first and last trigger. */
  loop: boolean;
  /** How many items are registered, used for the announcement. */
  itemCount: number;
  /** Whether expanding announces itself to a screen reader. */
  announceExpanded: boolean;
  /** The ceiling on simultaneously expanded items in `multiple` mode. */
  maxExpanded?: number;
  /** The item waiting on a `preventClose` guard to resolve. */
  pendingItem: string | null;
}

/** What each item hands to its own trigger and panel. */
export interface AccordionItemContextValue {
  /** This item's own value. */
  value: string;
  /** Whether this item alone is disabled. */
  disabled: boolean;
  /** Whether this item is currently open. */
  isExpanded: boolean;
  /** The trigger's id, referenced by the panel's `aria-labelledby`. */
  triggerId: string;
  /** The panel's id, referenced by the trigger's `aria-controls`. */
  contentId: string;
  /** The description's id, referenced by `aria-describedby`. */
  descriptionId?: string;
  /** Fires when this item's expanded state changes. */
  onToggle?: (isExpanded: boolean) => void;
}

/**
 * Class slots for `AccordionShimmer`. Accordion never renders it — you place it
 * yourself while content loads — so it has its own anatomy rather than sharing
 * Accordion's slots.
 */
export interface AccordionShimmerClasses {
  /** The placeholder's outer element. */
  root?: string;
  /** Each placeholder row. */
  item?: string;
  /** The bar standing in for a trigger. */
  trigger?: string;
  /** The bar standing in for the label. */
  itemText?: string;
  /** The title placeholder bar. */
  titleBar?: string;
  /** The description placeholder bars, in the trigger and in the body. */
  descriptionBar?: string;
  /** The block standing in for the indicator. */
  icon?: string;
  /** The block standing in for an expanded panel, shown only when `showContent` is set. */
  body?: string;
}

export interface AccordionShimmerProps {
  /** Whether to stop the shimmer animation. `"auto"` follows the OS reduced-motion setting. */
  reduceMotion?: boolean | "auto";
  /** Class overrides for this component's slots. */
  classes?: AccordionShimmerClasses;
  /** Drops the decorative default classes and keeps the structural ones, along with focus, keyboard and ARIA wiring. */
  unstyled?: boolean;
  /** How many placeholder items to draw. */
  count?: number;
  /** Matches the accordion size the placeholder stands in for. */
  size?: AccordionSize;
  /** Matches the accordion variant the placeholder stands in for. */
  variant?: AccordionVariant;
  /** Whether the placeholder pulses. Set false for a still skeleton. */
  animate?: boolean;
  /** Additional classes for the root element. */
  className?: string;
  /** Inline styles for the root element. */
  style?: CSSProperties;
  /** Also draws a placeholder for the expanded panel, not just the triggers. */
  showContent?: boolean;
  /** Render the passed child instead of the default element, keeping behaviour, ARIA and props. */
  asChild?: boolean;
}

export interface UseAccordionStateOptions {
  type: AccordionType;
  defaultValue?: string | string[];
  value?: string | string[];
  onValueChange?:
    | ((value: string | null) => void)
    | ((value: string[]) => void);
  collapsible?: boolean;
  maxExpanded?: number;
  storageKey?: string | StorageConfig;
}
