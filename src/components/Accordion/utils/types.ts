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
  root?: string;
  item?: string;
  trigger?: string;
  itemText?: string;
  body?: string;
  content?: string;
  icon?: string;
  /**
   * The chevron glyph itself, inside the `icon` slot. Style `icon` to reach the
   * wrapper and this to reach the glyph alone.
   */
  itemIndicator?: string;
  description?: string;
  itemIcon?: string;
  triggerActions?: string;
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

export interface AccordionExpandEvent {
  value: string;
  isExpanded: boolean;
  expandedCount: number;
  totalCount: number;
}

export interface StorageConfig {
  key: string;
  storage?: Storage;
  serialize?: (values: string[]) => string;
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

export interface AccordionContextValue {
  type: AccordionType;
  collapsible: boolean;
  loop: boolean;
  itemCount: number;
  announceExpanded: boolean;
  maxExpanded?: number;
  pendingItem: string | null;
}

export interface AccordionItemContextValue {
  value: string;
  disabled: boolean;
  isExpanded: boolean;
  triggerId: string;
  contentId: string;
  descriptionId?: string;
  onToggle?: (isExpanded: boolean) => void;
}

/**
 * Class slots for `AccordionShimmer`. Accordion never renders it — you place it
 * yourself while content loads — so it has its own anatomy rather than sharing
 * Accordion's slots.
 */
export interface AccordionShimmerClasses {
  root?: string;
  item?: string;
  trigger?: string;
  itemText?: string;
  /** The title placeholder bar. */
  titleBar?: string;
  /** The description placeholder bars, in the trigger and in the body. */
  descriptionBar?: string;
  icon?: string;
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
