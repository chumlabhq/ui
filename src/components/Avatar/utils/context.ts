import { createContext, useContext } from "react";
import type { AvatarSize, AvatarShape } from "./types.js";

/**
 * What an `AvatarGroup` hands down to the avatars and the surplus count inside
 * it, so a member picks up the group's sizing and ring without repeating them.
 * A member's own prop wins where it sets one.
 */
export interface AvatarGroupContextValue {
  /** Size every member falls back to. */
  size: AvatarSize;
  /** Shape every member falls back to. */
  shape: AvatarShape;
  /** Border every member falls back to, as a boolean or a CSS border shorthand. */
  bordered?: boolean | string;
  /** Ring drawn around each member, in the colour of the surface behind the group, so overlapping members get a clean edge. */
  ringColor: string;
  /** Overlap between members in pixels, negative when they stack. The surplus count needs it to keep its text out from under the member before it. */
  spacing: number;
}

export const AvatarGroupContext =
  createContext<AvatarGroupContextValue | null>(null);

export function useAvatarGroupContext(): AvatarGroupContextValue | null {
  return useContext(AvatarGroupContext);
}
