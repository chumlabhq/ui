import { createContext, useContext } from "react";
import type { AvatarSize, AvatarShape } from "../types";

export interface AvatarGroupContextValue {
  size: AvatarSize;
  shape: AvatarShape;
  bordered?: boolean | string;
  ringColor: string;
}

export const AvatarGroupContext =
  createContext<AvatarGroupContextValue | null>(null);

export function useAvatarGroupContext(): AvatarGroupContextValue | null {
  return useContext(AvatarGroupContext);
}
