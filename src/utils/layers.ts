import { createContext, useContext } from "react";

/**
 * One layering scale for the whole library.
 *
 * Before this there were three unrelated ones: the dropdown family defaulted to
 * 50, Modal based at 9999 and stepped 10 per nesting level, and Drawer, Tooltip
 * and ToastProvider each hardcoded 9999. A dropdown opened inside a drawer
 * therefore rendered ~9950 layers BELOW its own container, which is why popovers
 * inside drawers disappeared.
 *
 * The tiers keep the magnitudes the library already shipped, so a consumer who
 * hardcoded a z-index against Modal's 9999 is not moved out from under it. What
 * changes is that floating content no longer takes `dropdown` unconditionally —
 * see `useLayer`.
 */
export const LAYERS = {
  /** Page content. */
  base: 0,
  /** Local stacking inside one component: a slider thumb over its track. */
  raised: 1,
  /** Sticky table headers and pinned columns. */
  sticky: 20,
  /** Floating content anchored to a trigger, when nothing encloses it. */
  dropdown: 50,
  /** Modal and Drawer: the backdrop and the panel. */
  overlay: 9999,
  /** Notifications, which must clear an open overlay. */
  toast: 10500,
  /** Always topmost: a tooltip describes whatever is above everything else. */
  tooltip: 11000,
} as const;

export type LayerTier = keyof typeof LAYERS;

/**
 * Gap between an overlay and the floating content opened inside it, and between
 * one nested overlay and the next. Ten leaves room for a consumer to slot
 * something between two of our layers without colliding.
 */
export const LAYER_STEP = 10;

/**
 * The layer of the nearest enclosing overlay, or null at the page root.
 *
 * Modal and Drawer publish theirs; floating content reads it. Nothing else
 * should provide this — a component that is not an overlay does not establish a
 * layering scope.
 */
export const OverlayLayerContext = createContext<number | null>(null);

/**
 * Resolve the layer for a piece of floating content.
 *
 * An explicit prop always wins — a consumer who passes a number has decided.
 * Otherwise, content inside an overlay sits one step above that overlay, and
 * content at the page root takes its tier's base value.
 */
export const useLayer = (explicit: number | undefined, tier: LayerTier = "dropdown"): number => {
  const enclosing = useContext(OverlayLayerContext);
  if (explicit !== undefined) return explicit;
  if (enclosing === null) return LAYERS[tier];
  return Math.max(LAYERS[tier], enclosing + LAYER_STEP);
};
