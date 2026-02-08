import type { HTMLAttributes, ReactNode, RefObject } from "react";

export type DrawerDirection = "left" | "right" | "top" | "bottom";

export interface DrawerClasses {
  root?: string;
  overlay?: string;
  panel?: string;
}

export interface DrawerProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "onTransitionEnd"> {
  open: boolean;
  onClose: () => void;
  children?: ReactNode;
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
  activeSnapPoint?: number;
  defaultSnapPoint?: number;
  onSnapPointChange?: (index: number) => void;
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
