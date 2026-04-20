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
  onOpenStart?: () => void;
  onOpenEnd?: () => void;
  onCloseStart?: () => void;
  onCloseEnd?: () => void;
}

export interface AccordionClasses {
  root?: string;
  item?: string;
  trigger?: string;
  triggerInner?: string;
  content?: string;
  contentWrapper?: string;
  icon?: string;
  iconWrapper?: string;
  subtitle?: string;
  triggerLeft?: string;
  triggerRight?: string;
  contentInner?: string;
  heading?: string;
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
  value: string;
  disabled?: boolean;
  children: ReactNode;
  asChild?: boolean;
  /** Fires when the item's expanded state changes. */
  onExpandedChange?: (isExpanded: boolean) => void;
  /**
   * @deprecated Use `onExpandedChange` instead — kept for backward compatibility.
   * If both are provided, `onExpandedChange` takes precedence.
   */
  onToggle?: (isExpanded: boolean) => void;
  "aria-describedby"?: string;
}

export interface AccordionTriggerProps extends Omit<
  HTMLAttributes<HTMLButtonElement>,
  "onClick"
> {
  children: ReactNode;
  expandedIcon?: ReactNode;
  collapsedIcon?: ReactNode;
  iconPosition?: "left" | "right" | "none";
  asChild?: boolean;
  subtitle?: ReactNode;
  iconAnimation?: "rotate" | "switch" | "none";
  leftSlot?: ReactNode;
  rightSlot?: ReactNode;
  "aria-describedby"?: string;
}

export interface AccordionContentProps
  extends HTMLAttributes<HTMLDivElement>, AnimationCallbacks {
  children: ReactNode;
  forceMount?: boolean;
  animationDuration?: number;
  animationEasing?: AnimationEasing;
  asChild?: boolean;
  lazyLoad?: boolean;
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

export interface AccordionShimmerProps {
  count?: number;
  size?: AccordionSize;
  variant?: AccordionVariant;
  animate?: boolean;
  className?: string;
  style?: CSSProperties;
  showContent?: boolean;
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
