import type { ReactNode, CSSProperties, RefObject } from "react";

/** CSS class overrides for modal sub-elements. */
export interface ModalClasses {
  /** Root fixed-position wrapper. */
  root?: string;
  /** Backdrop overlay. */
  overlay?: string;
  /** Scroll/centering container. */
  container?: string;
  /** Dialog content panel. */
  content?: string;
  /** Header section. */
  header?: string;
  /** Title element. */
  title?: string;
  /** Description element. */
  description?: string;
  /** Header icon wrapper. */
  icon?: string;
  /** Close button. */
  closeButton?: string;
  /** Close icon inside the close button. */
  closeIcon?: string;
  /** Body content area. */
  body?: string;
}

/**
 * Props for the Modal component.
 *
 * @example
 * ```tsx
 * <Modal open={isOpen} onOpenChange={setIsOpen} title="Confirm">...</Modal>
 * ```
 */
export interface ModalProps {
  /** Whether the modal is visible (controlled). */
  open?: boolean;
  /** Callback when the modal's open state changes. Not `onClose`. Receives boolean. */
  onOpenChange?: (open: boolean) => void;
  /** Whether the modal is initially open (uncontrolled). Default: `false`. */
  defaultOpen?: boolean;
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
  lockScroll?: boolean;
  /** Traps keyboard focus within the modal. Default: `true`. */
  trapFocus?: boolean;
  /** Restores focus to the previously focused element on close. Default: `true`. */
  restoreFocus?: boolean;
  /** Element to focus when the modal opens. Defaults to the dialog content. */
  initialFocus?: RefObject<HTMLElement | null>;
  /** Keeps the modal DOM mounted when closed. Default: `false`. */
  keepMounted?: boolean;
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
  /** Controls motion preferences. `"auto"` respects the user's OS setting. Default: `"auto"`. */
  reduceMotion?: boolean | "auto";
  /** Current nesting depth (for stacked modals). Managed automatically. */
  nestingLevel?: number;
  /** Maximum allowed nesting depth for stacked modals. */
  maxNestingLevel?: number;
  /** CSS z-index for the modal layer. */
  zIndex?: number;
  /** CSS class overrides for modal sub-elements. */
  classes?: ModalClasses;
  /** Removes all default styling, rendering a plain dialog. */
  unstyled?: boolean;
  /** Additional CSS class for the dialog content panel. */
  className?: string;
  /** Inline styles for the dialog content panel. */
  contentStyle?: CSSProperties;
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
