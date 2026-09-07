export { default as TabPanel } from "./TabPanel.js";
export { default as TabButton } from "./components/TabButton.js";
export { DEFAULT_TABPANEL_CLASSES, UNSTYLED_TABPANEL_CLASSES } from "./utils/constants.js";

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
} from "./utils/types.js";

export { TabPanelContext, useTabPanelContext } from "./utils/context.js";
