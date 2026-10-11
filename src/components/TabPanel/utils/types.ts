import type { ReactNode, KeyboardEvent, CSSProperties } from "react";

/** Which end of the tab label its icon sits at: `start` before the text, `end` after it. */
export type IconPosition = "start" | "end";
export type TooltipPosition = "top" | "bottom" | "left" | "right";
export type Orientation = "horizontal" | "vertical";
export type ActivationMode = "automatic" | "manual";

/**
 * One tab and its panel. Tabs are addressed by `id`, so reordering the array does not change which one is selected.
 */
export interface Tab {
  /** Identifies the tab. `value` and `onValueChange` carry this, not the index. */
  id: string;
  /** The tab's text. */
  label: string;
  /** An icon beside the label, placed by `iconPosition`. */
  icon?: ReactNode;
  /** A badge on the tab. Hidden at zero unless `showZeroCount` is set. */
  count?: number;
  /** Blocks selection and drops the tab from arrow-key navigation. */
  disabled?: boolean;
  /** Text shown on hover or focus, for a label the strip had to truncate. */
  tooltip?: ReactNode;
}

export interface TabPanelClasses {
  /** Root container */
  root?: string;
  /** The tablist strip holding every tab button. */
  list?: string;
  /** One tab button. */
  item?: string;
  /** The tab's label text, so it can be hidden at narrow widths without hiding the icon. */
  itemText?: string;
  /** The icon inside a tab. */
  itemIcon?: string;
  /** Count badge base */
  count?: string;
  /** Active tab indicator element */
  indicator?: string;
  /** The panel below the strip, showing the active tab's children. */
  content?: string;
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
  tooltipSide?: TooltipPosition;
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
  "aria-describedby"?: string;
  classes?: TabPanelClasses;
  className?: string;
  style?: CSSProperties;
  /**
   * Which panels' content is in the DOM. `false` (default): the active panel
   * only. `"visited"`: every panel opened so far stays mounted. `true`: every
   * panel, including ones never opened.
   */
  keepMounted?: boolean | "visited";
}

export interface ResolvedClasses {
  /** Root container */
  root: string;
  /** The tablist strip holding every tab button. */
  list: string;
  /** One tab button. */
  item: string;
  /** The tab's label text, so it can be hidden at narrow widths without hiding the icon. */
  itemText: string;
  /** The icon inside a tab. */
  itemIcon: string;
  /** Count badge base */
  count: string;
  /** Active tab indicator element */
  indicator: string;
  /** The panel below the strip, showing the active tab's children. */
  content: string;
}

/**
 * What the strip shares with each tab: the resolved classes, the roving-focus handler, and the settings a tab would otherwise take as repeated props.
 */
export interface TabPanelContextValue {
  /** Base id the tabs and panels derive their `aria-controls` and `aria-labelledby` from. */
  tabListId: string;
  /** Where each tab's icon sits relative to its label. */
  iconPosition: IconPosition;
  /** Whether a count of zero still renders its badge. */
  showZeroCount: boolean;
  /** Keeps labels visible at widths where the strip would otherwise show icons alone. */
  alwaysShowLabels: boolean;
  /** Disables every tab at once, rather than one at a time. */
  disabled: boolean;
  /** Horizontal or vertical, which decides both the layout and which arrow keys move between tabs. */
  orientation: Orientation;
  /** Whether arrowing to a tab selects it, or only moves focus until Enter. */
  activationMode: ActivationMode;
  /** The resolved class for each slot, so a tab does not recompute the merge per render. */
  classNames: ResolvedClasses;
  /** Called by a tab when it is chosen. */
  onSelect: (tabId: string) => void;
  /** Shared roving-focus handler, so every tab answers the arrow keys identically. */
  onKeyDown: (e: KeyboardEvent<HTMLButtonElement>, index: number) => void;
}
