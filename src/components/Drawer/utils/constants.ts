import type { DrawerClasses, DrawerDirection } from "./types.js";
import { structuralOnly } from "../../../utils/classLayers.js";

export const DEFAULT_DIRECTION: DrawerDirection = "left";
export const DEFAULT_SIZE = "300px";
export const DEFAULT_OVERLAY_COLOR = "black";
// Subtle scrim — keeps the page chrome (sidebar, toolbar) visible behind
// the drawer instead of blanking it out on a small screen.
export const DEFAULT_OVERLAY_OPACITY = 0.32;
export const DEFAULT_OVERLAY_BLUR = 0;
export const DEFAULT_DURATION = 300;
export const DEFAULT_SWIPE_THRESHOLD = 0.4;
export const DEFAULT_SNAP_POINT_INDEX = 0;
export const SWIPE_DEADZONE = 10;
export const VELOCITY_THRESHOLD = 0.5;

export const DEFAULT_DRAWER_CLASSES: Required<DrawerClasses> = {
  root: "z-999999",
  overlay: "fixed inset-0 transition-opacity",
  content: "fixed z-999999",
};

/**
 * `DrawerCloseButton` has no `classes` slot of its own — it takes `className`
 * directly — so its one default lives here rather than inline at the call site,
 * which is what `constants.contract` requires and where `Modal`'s equivalent
 * already is.
 */
export const DRAWER_CLOSE_BUTTON_CLASS = "cursor-pointer";

export const UNSTYLED_DRAWER_CLASSES: Required<DrawerClasses> =
  structuralOnly(DEFAULT_DRAWER_CLASSES);
