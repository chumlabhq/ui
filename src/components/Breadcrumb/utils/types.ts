import type { ReactNode, CSSProperties, ComponentType, HTMLAttributes } from "react";

export type TooltipSide = "top" | "right" | "bottom" | "left";
export type TooltipAlign = "start" | "center" | "end";
export type IconPosition = "left" | "right";

export interface BreadcrumbTooltipProps {
  side?: TooltipSide;
  align?: TooltipAlign;
  sideOffset?: number;
  maxWidth?: string | number;
  delayDuration?: number;
  showArrow?: boolean;
  contentClassName?: string;
  contentStyle?: CSSProperties;
}

/**
 * One step in the trail. Whether it renders as a link, a button or plain text follows from which of `href` and `onClick` are set.
 */
export interface BreadcrumbItem {
  /** Identifies the item. Callbacks carry this, not the index, so reordering the trail does not change what a click means. */
  id: string;
  /** The item's text, and its accessible name. */
  label: string;
  /** Renders the item as a link. Without it the item is a button, or plain text if it has no `onClick` either. */
  href?: string;
  /** Called when the item is activated. Combined with `href`, this runs and the navigation still happens. */
  onClick?: () => void;
  /** An icon beside the label, placed by `iconPosition`. */
  icon?: ReactNode;
  /**
   * Which side of the label the icon sits on. Falls back to the component's
   * setting.
   *
   * @default "left" when icon is provided
   */
  iconPosition?: IconPosition;
  /** Renders the item but refuses activation. */
  disabled?: boolean;
  /** Replaces the label and icon entirely. */
  content?: ReactNode;
  /** Text shown on hover or focus, for a label the trail had to truncate. */
  tooltip?: ReactNode;
  /** Placement and timing for that tooltip. */
  tooltipProps?: BreadcrumbTooltipProps;
}

export interface BreadcrumbClasses {
  /** Root container (nav element) */
  root?: string;
  /** Breadcrumb list (ol element) */
  list?: string;
  /** Non-active breadcrumb item */
  item?: string;
  /** Item rendered as anchor (has href) */
  link?: string;
  /** Separator element */
  separator?: string;
  /** An item's icon. */
  itemIcon?: string;
  /** Ellipsis container (li) */
  ellipsis?: string;
  /** The button standing in for the items that did not fit. */
  ellipsisTrigger?: string;
  /** The menu those collapsed items open into. */
  content?: string;
  /** One item inside that menu. */
  collapsedItem?: string;
}

export type DropdownPosition = "top" | "bottom" | "left" | "right";

/**
 * Props for the Breadcrumb component.
 *
 * @example
 * ```tsx
 * <Breadcrumb items={[{ id: "home", label: "Home" }]} />
 * ```
 */
export interface BreadcrumbProps extends Omit<HTMLAttributes<HTMLElement>, "className" | "style" | "aria-label"> {
  items: BreadcrumbItem[];
  maxVisibleItems?: number;
  separator?: ReactNode;
  onItemClick?: (item: BreadcrumbItem) => void;
  "aria-label"?: string;
  classes?: BreadcrumbClasses;
  unstyled?: boolean;
  className?: string;
  style?: CSSProperties;
  separatorIcon?: ComponentType<{ className?: string; style?: CSSProperties }>;
  ellipsisIcon?: ComponentType<{ className?: string; style?: CSSProperties }>;
  iconSize?: number | string;
  showTooltips?: boolean;
  tooltipPosition?: TooltipSide;
  tooltipOffset?: number;
  defaultTooltipProps?: BreadcrumbTooltipProps;
  ellipsisTooltip?: ReactNode;
  ellipsisTooltipProps?: BreadcrumbTooltipProps;
  dropdownPosition?: DropdownPosition;
  dropdownZIndex?: number;
  portalContainer?: HTMLElement | null;
  /** Keeps the collapsed-items menu mounted while closed. */
  keepMounted?: boolean;
  ellipsisAriaLabel?: string;
  onDropdownOpenChange?: (open: boolean) => void;
}
