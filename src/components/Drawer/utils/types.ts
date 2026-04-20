import type { HTMLAttributes, ReactNode, RefObject } from "react";

export type DrawerDirection = "left" | "right" | "top" | "bottom";

export interface DrawerClasses {
  root?: string;
  overlay?: string;
  panel?: string;
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
  overlayOpacity?: number;
  overlayBlur?: number;
  duration?: number;
  lockScroll?: boolean;
  closeOnOverlayClick?: boolean;
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
  children?: ReactNode;
}

export interface DrawerBodyProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export interface DrawerFooterProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export interface DrawerCloseButtonProps
  extends HTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
}
