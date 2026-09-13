export { default as TabPanel } from "./TabPanel.js";
/**
 * `TabButton` is deliberately NOT exported.
 *
 * It was, and it could not be called: its props interface is local, and it
 * needs `index`, `isActive`, `isTabbable` and `setTabRef` from TabPanel's own
 * roving-focus state plus the context TabPanel provides. A consumer finds the
 * name in autocomplete, tries it, and loses time to a component that has no
 * usable signature. Making it usable is an API design job — a public props
 * type and a shape someone could actually supply — so v1 stops offering it
 * instead. `TabPanel` imports it by path; nothing depended on this line.
 *
 * Custom tab rendering is the `renderTab` prop, which hands you the default
 * element already wired.
 */
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
