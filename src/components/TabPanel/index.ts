// AI Knowledge: See TABPANEL.ai.md in this directory for full usage guide, props, styling, and patterns.
export { default as TabPanel } from "./TabPanel";
export { default as TabButton } from "./components/TabButton";
export { DEFAULT_TABPANEL_CLASSES, UNSTYLED_TABPANEL_CLASSES } from "./utils/constants";

export type {
  Tab,
  TabPanelProps,
  TabPanelClasses,
  TabRenderProps,
  IconPosition,
  TooltipPosition,
  Orientation,
  ActivationMode,
  ResolvedClasses,
  TabPanelContextValue,
} from "./utils/types";

export { TabPanelContext, useTabPanelContext } from "./utils/context";
