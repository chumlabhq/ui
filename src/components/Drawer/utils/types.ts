import type { HTMLAttributes, ReactNode, RefObject } from "react";

export type DrawerDirection = "left" | "right" | "top" | "bottom";

export interface DrawerClasses {
  /** The fixed layer the panel and its scrim share. */
  root?: string;
  /** The scrim over the page behind. */
  overlay?: string;
  /** The panel itself, which is the element the `direction` slides. */
  content?: string;
  /** The drag handle's hit area at the panel's leading edge. Rendered only when `swipeable`. */
  handle?: string;
  /** The bar drawn inside the handle, which is the part a pointer user sees. */
  handleBar?: string;
}

/**
 * Props for the Drawer component.
 *
 * @example
 * ```tsx
 * <Drawer open={isOpen} onOpenChange={setIsOpen} direction="right">...</Drawer>
 * ```
 */
export interface DrawerProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "onTransitionEnd"> {
  /** Whether the drawer is visible (controlled). */
  open?: boolean;
  /** Whether the drawer is initially open (uncontrolled). */
  defaultOpen?: boolean;
  /** Callback when the drawer's open state changes. Not `onClose`. Receives boolean. */
  onOpenChange?: (open: boolean) => void;
  /** CSS z-index for the drawer layer. */
  zIndex?: number;
  children?: ReactNode;
  /** Slide-in direction. Not `side` or `placement`. */
  direction?: DrawerDirection;
  size?: string;
  overlayColor?: string;
  /**
   * How strongly `overlayColor` tints the page (0–1), applied as the
   * background's alpha. The overlay element itself stays opaque, so
   * `overlayBlur` is not diluted by the sharp page behind it.
   */
  overlayOpacity?: number;
  overlayBlur?: number;
  duration?: number;
  lockScroll?: boolean;
  closeOnOverlayClick?: boolean;
  /** Enables closing via the Escape key. Default: `true`. */
  closeOnEscape?: boolean;
  classes?: DrawerClasses;
  unstyled?: boolean;
  reduceMotion?: boolean | "auto";
  trapFocus?: boolean;
  restoreFocus?: boolean;
  portalContainer?: HTMLElement | null;
  initialFocus?: RefObject<HTMLElement | null>;
  onTransitionEnd?: (open: boolean) => void;
  keepMounted?: boolean;
  modal?: boolean;
  swipeable?: boolean;
  swipeThreshold?: number;
  snapPoints?: number[];
  activeSnapPointIndex?: number;
  defaultSnapPointIndex?: number;
  onSnapPointIndexChange?: (index: number) => void;
}

export interface DrawerHeaderProps extends HTMLAttributes<HTMLDivElement> {
  /** Content rendered inside this element. */
  children?: ReactNode;
}

export interface DrawerBodyProps extends HTMLAttributes<HTMLDivElement> {
  /** Content rendered inside this element. */
  children?: ReactNode;
}

export interface DrawerFooterProps extends HTMLAttributes<HTMLDivElement> {
  /** Content rendered inside this element. */
  children?: ReactNode;
}

export interface DrawerCloseButtonProps
  extends HTMLAttributes<HTMLButtonElement> {
  /** Content rendered inside this element. */
  children?: ReactNode;
}
