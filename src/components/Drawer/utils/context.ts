import { createContext, useContext } from "react";

export interface DrawerContextValue {
  onClose: () => void;
  titleId: string;
}

export const DrawerContext = createContext<DrawerContextValue | null>(null);

export function useDrawerContext() {
  return useContext(DrawerContext);
}
