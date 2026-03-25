import type { DrawerClasses, DrawerDirection } from "./types";

export const DEFAULT_DIRECTION: DrawerDirection = "left";
export const DEFAULT_SIZE = "300px";
export const DEFAULT_OVERLAY_COLOR = "black";
export const DEFAULT_OVERLAY_OPACITY = 0.5;
export const DEFAULT_OVERLAY_BLUR = 0;
export const DEFAULT_DURATION = 300;
export const DEFAULT_SWIPE_THRESHOLD = 0.4;
export const DEFAULT_SNAP_POINT_INDEX = 0;
export const SWIPE_DEADZONE = 10;
export const VELOCITY_THRESHOLD = 0.5;

export const DEFAULT_DRAWER_CLASSES: Required<DrawerClasses> = {
  root: "z-999999",
  overlay: "fixed inset-0 transition-opacity",
  panel: "fixed z-999999",
};

export const UNSTYLED_DRAWER_CLASSES: Required<DrawerClasses> = {
  root: "",
  overlay: "",
  panel: "",
};

/** @deprecated Use DEFAULT_DRAWER_CLASSES */
export const DEFAULT_CLASS_NAMES = DEFAULT_DRAWER_CLASSES;
