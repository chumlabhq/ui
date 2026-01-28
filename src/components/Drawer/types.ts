import type { HTMLAttributes, ReactNode } from "react";

export type DrawerDirection = "left" | "right" | "top" | "bottom";

export interface DrawerProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  open: boolean;
  onClose: () => void;
  children?: ReactNode;
  direction?: DrawerDirection;
  size?: string;
  overlayColor?: string;
  overlayOpacity?: number;
  duration?: number;
  lockBackgroundScroll?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  drawerClassName?: string;
  overlayClassName?: string;
  rootClassName?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
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
