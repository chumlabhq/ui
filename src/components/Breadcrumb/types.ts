import type { ReactNode, CSSProperties } from "react";

export type TooltipSide = "top" | "right" | "bottom" | "left";
export type TooltipAlign = "start" | "center" | "end";

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
  iconPosition?: "left" | "right";
  disabled?: boolean;
  content?: ReactNode;
  tooltip?: ReactNode;
  tooltipProps?: BreadcrumbTooltipProps;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  maxVisibleItems?: number;
  separator?: ReactNode;
  onItemClick?: (item: BreadcrumbItem) => void;
  ariaLabel?: string;
  className?: string;
  containerClassName?: string;
  itemClassName?: string;
  activeItemClassName?: string;
  separatorClassName?: string;
  ellipsisClassName?: string;
  ellipsisButtonClassName?: string;
  ellipsisDropdownClassName?: string;
  ellipsisDropdownItemClassName?: string;
  iconClassName?: string;
  linkClassName?: string;
  SeparatorIcon?: React.ComponentType<{ className?: string }>;
  EllipsisIcon?: React.ComponentType<{ className?: string }>;
  iconSize?: string;
  ellipsisTooltip?: ReactNode;
  ellipsisTooltipProps?: BreadcrumbTooltipProps;
  defaultTooltipProps?: BreadcrumbTooltipProps;
}
