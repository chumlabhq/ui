import type { ReactNode, CSSProperties } from "react";

export interface ModalProps {
  /** Whether the modal is visible. */
  open: boolean;
  /** Callback when the modal's open state changes (close button, overlay click, Escape key). */
  onOpenChange: (open: boolean) => void;
  /** Modal body content. Use `ModalHeader`, `ModalBody`, `ModalFooter` for structure. */
  children: ReactNode;
  /** Title rendered in the modal header. */
  title?: ReactNode;
  /** Description rendered below the title in the header. */
  description?: ReactNode;
  /** Icon rendered in the modal header. */
  icon?: ReactNode;
  /** Whether to display the icon in the header. Default: `false`. */
  showIcon?: boolean;
  /** Whether to display the close button. Default: `true`. */
  showCloseButton?: boolean;
  /** Custom close button icon. */
  closeIcon?: ReactNode;
  /** Whether to render the built-in header section. Default: `true`. */
  showHeader?: boolean;
  /** Whether to render the backdrop overlay. Default: `true`. */
  showOverlay?: boolean;
  /** Prevents closing when clicking outside the modal content. Default: `false`. */
  preventOutsideClick?: boolean;
  /** Enables closing via the Escape key. Default: `true`. */
  closeOnEscape?: boolean;
  /** Locks body scroll when the modal is open. Default: `true`. */
  lockBackgroundScroll?: boolean;
  /** Maximum width of the modal dialog. */
  maxWidth?: string | number;
  /** Maximum height of the modal dialog. */
  maxHeight?: string | number;
  /** Minimum width of the modal dialog. */
  minWidth?: string | number;
  /** Minimum height of the modal dialog. */
  minHeight?: string | number;
  /** Expands the modal to fill the viewport. */
  fullScreen?: boolean;
  /** Vertically centers the modal in the viewport. Default: `true`. */
  centered?: boolean;
  /** Custom overlay background color. */
  overlayColor?: string;
  /** Overlay background opacity (0–1). */
  overlayOpacity?: number;
  /** Open/close animation duration in ms. */
  animationDuration?: number;
  /** Disables open/close animations entirely. */
  disableAnimation?: boolean;
  /** Current nesting depth (for stacked modals). Managed automatically. */
  nestingLevel?: number;
  /** Maximum allowed nesting depth for stacked modals. */
  maxNestingLevel?: number;
  /** CSS z-index for the modal layer. */
  zIndex?: number;
  /** CSS class for the modal wrapper. */
  className?: string;
  /** CSS class for the backdrop overlay. */
  overlayClassName?: string;
  /** CSS class for the dialog content panel. */
  contentClassName?: string;
  /** Inline styles for the dialog content panel. */
  contentStyle?: CSSProperties;
  /** CSS class for the header section. */
  headerClassName?: string;
  /** CSS class for the title element. */
  titleClassName?: string;
  /** CSS class for the description element. */
  descriptionClassName?: string;
  /** CSS class for the header icon. */
  iconClassName?: string;
  /** CSS class for the close button. */
  closeButtonClassName?: string;
  /** CSS class for the close icon inside the close button. */
  closeIconClassName?: string;
  /** CSS class for the body section. */
  bodyClassName?: string;
  /** CSS class for the root portal container. */
  rootClassName?: string;
  /** Accessible label for the modal dialog. */
  "aria-label"?: string;
  /** ID of the element that labels the modal dialog. */
  "aria-labelledby"?: string;
  /** ID of the element that describes the modal dialog. */
  "aria-describedby"?: string;
}

/** Props for the ModalHeader compound component. */
export interface ModalHeaderProps {
  children: ReactNode;
  className?: string;
}

/** Props for the ModalBody compound component. */
export interface ModalBodyProps {
  children: ReactNode;
  className?: string;
}

/** Props for the ModalFooter compound component. */
export interface ModalFooterProps {
  children: ReactNode;
  className?: string;
}

/** Internal context value shared between Modal and its compound children. */
export interface ModalContextValue {
  nestingLevel: number;
  close: () => void;
}
