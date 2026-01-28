import type { ReactNode, CSSProperties } from "react";

export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  showIcon?: boolean;
  showCloseButton?: boolean;
  closeIcon?: ReactNode;
  showHeader?: boolean;
  showOverlay?: boolean;
  preventOutsideClick?: boolean;
  closeOnEscape?: boolean;
  lockBackgroundScroll?: boolean;
  maxWidth?: string | number;
  maxHeight?: string | number;
  minWidth?: string | number;
  minHeight?: string | number;
  fullScreen?: boolean;
  centered?: boolean;
  overlayColor?: string;
  overlayOpacity?: number;
  animationDuration?: number;
  disableAnimation?: boolean;
  nestingLevel?: number;
  maxNestingLevel?: number;
  zIndex?: number;
  className?: string;
  overlayClassName?: string;
  contentClassName?: string;
  contentStyle?: CSSProperties;
  headerClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  iconClassName?: string;
  closeButtonClassName?: string;
  closeIconClassName?: string;
  bodyClassName?: string;
  rootClassName?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
}

export interface ModalHeaderProps {
  children: ReactNode;
  className?: string;
}

export interface ModalBodyProps {
  children: ReactNode;
  className?: string;
}

export interface ModalFooterProps {
  children: ReactNode;
  className?: string;
}

export interface ModalContextValue {
  nestingLevel: number;
  close: () => void;
}
