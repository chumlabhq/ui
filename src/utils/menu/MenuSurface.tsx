import { forwardRef, useRef, type CSSProperties, type ReactNode, type RefObject } from "react";
import { createPortal } from "react-dom";
import { isBrowser } from "../isBrowser";
import { mergeRefs } from "../mergeRefs";
import { useAnchoredPosition } from "../useAnchoredPosition";
import { useStablePositionAfterOpen } from "../useStablePositionAfterOpen";
import type { AnchoredSide } from "../anchoredPosition";

export interface MenuSurfaceProps {
  /** The element the surface is anchored to. */
  trigger: HTMLElement | null | RefObject<HTMLElement | null>;
  isOpen: boolean;
  side?: AnchoredSide;
  /** Pins the side, disabling the flip. The family's `forceDropdownPosition`. */
  forceSide?: boolean;
  gap?: number;
  zIndex?: number;
  portalContainer?: HTMLElement | null;
  /** Keeps the surface in the DOM while closed, hidden. */
  keepMounted?: boolean;
  /** Sizes the surface to the trigger. Off for menus that size to content. */
  matchTriggerWidth?: boolean;
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
 * The hidden first frame is the part worth keeping deliberately:
 * `useAnchoredPosition` cannot measure the surface until it is in the DOM, so
 * the first paint would otherwise land at the top-left corner and jump. Hiding
 * rather than not rendering is what lets the measurement happen at all.
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
    className,
    style,
    children,
    ...rest
  },
  ref,
) {
  const surfaceRef = useRef<HTMLDivElement>(null);
  const position = useAnchoredPosition(trigger, surfaceRef, isOpen, { side, gap, forceSide });
  const isStable = useStablePositionAfterOpen(isOpen);

  if (!isBrowser) return null;
  if (!isOpen && !keepMounted) return null;

  const positioned: CSSProperties =
    position && isStable
      ? {
          top: position.top,
          left: position.left,
          ...(matchTriggerWidth ? { width: position.width } : {}),
        }
      : { visibility: "hidden", top: 0, left: 0 };

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
