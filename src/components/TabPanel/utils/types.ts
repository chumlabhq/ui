import type { ReactNode, KeyboardEvent, CSSProperties } from "react";

export type IconPosition = "left" | "right";
export type TooltipPosition = "top" | "bottom" | "left" | "right";
export type Orientation = "horizontal" | "vertical";
export type ActivationMode = "automatic" | "manual";

export interface Tab {
  id: string;
  label: string;
  icon?: ReactNode;
  count?: number;
  disabled?: boolean;
  tooltip?: ReactNode;
}

export interface TabPanelClasses {
  root?: string;
  tabList?: string;
  tab?: string;
  tabActive?: string;
  tabInactive?: string;
  tabDisabled?: string;
  tabFocus?: string;
  label?: string;
  labelActive?: string;
  labelInactive?: string;
  icon?: string;
  iconActive?: string;
  iconInactive?: string;
  count?: string;
  countActive?: string;
  countInactive?: string;
  indicator?: string;
  panel?: string;
}

export interface TabRenderProps {
  tab: Tab;
  index: number;
  isActive: boolean;
  isDisabled: boolean;
}

/**
 * Props for the TabPanel component.
 *
 * @example
 * ```tsx
 * <TabPanel tabs={[{ id: "home", label: "Home" }]} value="home" onValueChange={setTab}>
 *   {(tab) => <div>{tab.label}</div>}
 * </TabPanel>
 * ```
 */
export interface TabPanelProps {
  /** Array of tab definitions. Each tab must have a unique `id` and `label`. */
  tabs: Tab[];
  id?: string;
  /** Active tab id. Not `activeTab` or `selectedTab`. */
  value?: string;
  defaultValue?: string;
  /** Tab change callback. Not `onChange` or `onTabChange`. */
  onValueChange?: (tabId: string) => void;
  /** Renders tab panel content. Pass a render function `(tab) => ReactNode` as children. Not a `renderContent` prop or `content` on tab objects. */
  children?: ReactNode | ((tab: Tab) => ReactNode);
  /** Layout direction for the tab list. Default: "horizontal". */
  orientation?: Orientation;
  activationMode?: ActivationMode;
  loop?: boolean;
  iconPosition?: IconPosition;
  showZeroCount?: boolean;
  alwaysShowLabels?: boolean;
  showTooltips?: boolean;
  tooltipPosition?: TooltipPosition;
  tooltipOffset?: number;
  disabled?: boolean;
  /** Controls motion preferences. `"auto"` respects the user's OS setting. */
  reduceMotion?: boolean | "auto";
  unstyled?: boolean;
  renderTab?: (
    props: TabRenderProps,
    defaultElement: React.ReactElement,
  ) => ReactNode;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  classes?: TabPanelClasses;
  className?: string;
  style?: CSSProperties;
  forceMount?: boolean;
  keepMounted?: boolean;
}

export interface ResolvedClasses {
  root: string;
  tabList: string;
  tab: string;
  tabActive: string;
  tabInactive: string;
  tabDisabled: string;
  tabFocus: string;
  label: string;
  labelActive: string;
  labelInactive: string;
  icon: string;
  iconActive: string;
  iconInactive: string;
  count: string;
  countActive: string;
  countInactive: string;
  indicator: string;
  panel: string;
}

export interface TabPanelContextValue {
  tabListId: string;
  iconPosition: IconPosition;
  showZeroCount: boolean;
  alwaysShowLabels: boolean;
  disabled: boolean;
  orientation: Orientation;
  activationMode: ActivationMode;
  classNames: ResolvedClasses;
  onSelect: (tabId: string) => void;
  onKeyDown: (e: KeyboardEvent<HTMLButtonElement>, index: number) => void;
}
