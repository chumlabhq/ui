import { createContext, useContext } from "react";

export interface DrawerContextValue {
  onClose: () => void;
  titleId: string;
  /**
   * Called by `DrawerHeader` when it mounts, so the dialog knows whether the id
   * it names in `aria-labelledby` exists.
   *
   * The header is optional composition — the docblock on `Drawer` says as much —
   * and the panel referenced `titleId` unconditionally, so a drawer without one
   * claimed a name that resolved to nothing. Found by the first fixture that
   * rendered a drawer with no header, which happened to be an RTL one.
   */
  registerTitle: (present: boolean) => void;
  swipeGrip: boolean;
}

export const DrawerContext = createContext<DrawerContextValue | null>(null);

export function useDrawerContext() {
  return useContext(DrawerContext);
}
