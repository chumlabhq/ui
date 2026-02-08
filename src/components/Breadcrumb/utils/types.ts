import type { ReactNode, CSSProperties, ComponentType } from "react";

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
  iconPosition?: IconPosition;
  disabled?: boolean;
  content?: ReactNode;
  tooltip?: ReactNode;
  tooltipProps?: BreadcrumbTooltipProps;
}

export interface BreadcrumbClassNames {
  root?: string;
  list?: string;
  item?: string;
  itemActive?: string;
  itemDisabled?: string;
  link?: string;
  separator?: string;
  icon?: string;
  ellipsis?: string;
  ellipsisButton?: string;
  dropdown?: string;
  dropdownItem?: string;
  dropdownItemDisabled?: string;
}

export type DropdownPosition = "top" | "bottom" | "left" | "right";

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  maxVisibleItems?: number;
  separator?: ReactNode;
  onItemClick?: (item: BreadcrumbItem) => void;
  "aria-label"?: string;
  classes?: BreadcrumbClassNames;
  className?: string;
  style?: CSSProperties;
  SeparatorIcon?: ComponentType<{ className?: string; style?: CSSProperties }>;
  EllipsisIcon?: ComponentType<{ className?: string; style?: CSSProperties }>;
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
  ellipsisAriaLabel?: string;
}
