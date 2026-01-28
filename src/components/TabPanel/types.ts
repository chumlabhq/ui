import type { ReactNode, ComponentType, SVGProps } from "react";

export type IconPosition = "left" | "right";
export type TooltipPosition = "top" | "bottom";

export interface Tab {
  id: string;
  label: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  count?: number;
  disabled?: boolean;
  tooltip?: ReactNode;
}

export interface TabPanelProps {
  tabs: Tab[];
  activeTabId: string;
  onTabChange: (tabId: string) => void;
  children?: ReactNode;
  showIcons?: boolean;
  iconPosition?: IconPosition;
  showCount?: boolean;
  showZeroCount?: boolean;
  alwaysShowLabels?: boolean;
  showTooltips?: boolean;
  tooltipPosition?: TooltipPosition;
  tooltipOffset?: number;
  disableAutoFocus?: boolean;
  disabled?: boolean;
  containerClassName?: string;
  tabListClassName?: string;
  tabButtonClassName?: string;
  tabButtonActiveClassName?: string;
  tabButtonInactiveClassName?: string;
  tabButtonDisabledClassName?: string;
  tabButtonFocusClassName?: string;
  tabLabelClassName?: string;
  tabLabelActiveClassName?: string;
  tabLabelInactiveClassName?: string;
  tabIconClassName?: string;
  tabIconActiveClassName?: string;
  tabIconInactiveClassName?: string;
  tabCountClassName?: string;
  tabCountActiveClassName?: string;
  tabCountInactiveClassName?: string;
  activeIndicatorClassName?: string;
  tabPanelClassName?: string;
}
