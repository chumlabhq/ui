import {
  forwardRef,
  useRef,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { useHydrated } from "../useHydrated.js";
import { mergeRefs } from "../mergeRefs.js";
import { useAnchoredPosition } from "../useAnchoredPosition.js";
import { surfaceStyle } from "./measuringStyle.js";
import { useStablePositionAfterOpen } from "../useStablePositionAfterOpen.js";
import type { AnchoredSide } from "../anchoredPosition.js";

/**
 * Extends the div's own props: a surface is a `listbox` or a `menu`, and its
 * roles, labels, handlers and `data-*` attributes belong to the caller.
 */
export interface MenuSurfaceProps
  extends Omit<ComponentPropsWithoutRef<"div">, "style" | "children"> {
  /** The element the surface is anchored to. */
  trigger: HTMLElement | null | RefObject<HTMLElement | null>;
  isOpen: boolean;
  side?: AnchoredSide;
  /** Pins the side, disabling the flip. The family's `forceDropdownSide`. */
  forceSide?: boolean;
  gap?: number;
  zIndex?: number;
  portalContainer?: HTMLElement | null;
  /** Keeps the surface in the DOM while closed, hidden. */
  keepMounted?: boolean;
  /** Sizes the surface to the trigger. Off for menus that size to content. */
  matchTriggerWidth?: boolean;
  /**
   * Caps the surface to the space on the side it opens toward, for a menu that
   * can be taller than the viewport. The caller's classes scroll inside it.
   */
  fitAvailableHeight?: boolean;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

/**
 * The portalled, anchored surface a menu renders into.
 *
 * Nine components wrote this out — portal, fixed positioning, a
 * visibility-hidden first frame, `keepMounted` — and the differences between
 * them were not decisions. This is the shape they agreed on.
 *
 * The invisible first frame is the part worth keeping deliberately:
 * `useAnchoredPosition` cannot measure the surface until it is in the DOM, so
 * the first paint would otherwise land at the top-left corner and jump. Rendering
 * it invisibly rather than not at all is what lets the measurement happen —
 * see `MEASURING_STYLE` for why it is opacity rather than visibility.
 */
const MenuSurface = forwardRef<HTMLDivElement, MenuSurfaceProps>(function MenuSurface(
  {
    trigger,
    isOpen,
    side = "bottom",
    forceSide = false,
    gap = 4,
    zIndex,
    portalContainer,
    keepMounted = false,
    matchTriggerWidth = true,
    fitAvailableHeight = false,
    className,
    style,
    children,
    ...rest
  },
  ref,
) {
  const surfaceRef = useRef<HTMLDivElement>(null);
  const position = useAnchoredPosition(trigger, surfaceRef, isOpen, { side, gap, forceSide, fit: fitAvailableHeight });
  const isStable = useStablePositionAfterOpen(isOpen);
  const hydrated = useHydrated();

  // Not `isBrowser`: that is true during hydration, so an open surface — or a
  // closed one with `keepMounted` — portalled a subtree the server never sent.
  // The nine components here passed only while their surface was shut.
  if (!hydrated) return null;
  if (!isOpen && !keepMounted) return null;

  const placed = position
    ? {
        top: position.top,
        left: position.left,
        ...(matchTriggerWidth ? { width: position.width } : {}),
        maxHeight: position.maxHeight,
      }
    : null;
  const positioned = surfaceStyle(placed, isStable);

  return createPortal(
    <div
      ref={mergeRefs(surfaceRef, ref)}
      data-side={position?.side ?? side}
      className={className}
      style={{
        position: "fixed",
        margin: 0,
        ...(zIndex === undefined ? {} : { zIndex }),
        ...positioned,
        ...(!isOpen && keepMounted ? { display: "none" } : {}),
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>,
    portalContainer ?? document.body,
  );
});

export default MenuSurface;
