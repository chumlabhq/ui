import type { DrawerClasses, DrawerSide } from "./types.js";
import { structuralOnly } from "../../../utils/classLayers.js";

export const DEFAULT_SIDE: DrawerSide = "left";
export const DEFAULT_SIZE = "300px";
export const DEFAULT_OVERLAY_COLOR = "black";
// Subtle scrim — keeps the page chrome (sidebar, toolbar) visible behind
// the drawer instead of blanking it out on a small screen.
export const DEFAULT_OVERLAY_OPACITY = 0.32;
export const DEFAULT_OVERLAY_BLUR = 0;
export const DEFAULT_ANIMATION_DURATION = 300;
export const DEFAULT_SWIPE_THRESHOLD = 0.4;
export const DEFAULT_SNAP_POINT_INDEX = 0;
export const SWIPE_DEADZONE = 10;
export const VELOCITY_THRESHOLD = 0.5;

export const DEFAULT_DRAWER_CLASSES: Required<DrawerClasses> = {
  root: "z-999999",
  overlay: "fixed inset-0 transition-opacity",
  content: "fixed z-999999",
  /**
   * The grab handle, rendered only when `swipeable`, and split across two keys.
   *
   * A 36x4 bar inside a 20px-tall row: the bar is what a pointer user sees, the
   * row is what they can hit. They are separate slots because they are separate
   * promises — restyling the bar should not shrink the target, and widening the
   * target should not redraw the bar. Swipe was pointer-invisible before this:
   * the panel took `onPointerDown` and nothing said so, and a drag started on
   * body text selects the text instead. `select-none` and `cursor-grab` are the
   * two that make it a handle rather than decoration.
   */
  handle:
    "flex items-center justify-center h-5 shrink-0 select-none cursor-grab active:cursor-grabbing",
  handleBar: "block h-1 w-9 rounded-full bg-cl-border-input",
};

/**
 * `DrawerCloseButton` has no `classes` slot of its own — the consumer places it
 * as a child, so `Drawer` never renders it and cannot merge a slot into it — and
 * a bare constant is the only shape left. Every other default in the library is
 * a `*_CLASSES` key; this is the one exception, and it is an exception because
 * of who renders the element, not because the key would be unwelcome. `Modal`
 * is NOT the precedent: its close button is a `closeTrigger` key, because
 * `Modal` renders its own.
 */
export const DRAWER_CLOSE_BUTTON_CLASS = "cursor-pointer";

export const UNSTYLED_DRAWER_CLASSES: Required<DrawerClasses> =
  structuralOnly(DEFAULT_DRAWER_CLASSES);
