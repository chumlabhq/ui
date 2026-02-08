import { createContext, useContext } from "react";
import type { TabPanelContextValue } from "./types";

export const TabPanelContext = createContext<TabPanelContextValue | null>(null);

export function useTabPanelContext(): TabPanelContextValue {
  const context = useContext(TabPanelContext);
  if (!context) {
    throw new Error(
      "TabPanel compound components must be used within a <TabPanel> component",
    );
  }
  return context;
}
