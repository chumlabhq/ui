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

export interface BreadcrumbItem {
  id: string;
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: ReactNode;
  /** @default "left" when icon is provided */
  iconPosition?: IconPosition;
  disabled?: boolean;
  content?: ReactNode;
  tooltip?: ReactNode;
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
  itemIcon?: string;
  /** Ellipsis container (li) */
  ellipsis?: string;
  ellipsisTrigger?: string;
  content?: string;
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
