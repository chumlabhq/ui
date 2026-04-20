import type { ReactNode, ComponentPropsWithoutRef } from "react";

export interface ResizablePanelClasses {
  root?: string;
  handle?: string;
}

/**
 * Props for the ResizablePanel component.
 *
 * @example
 * ```tsx
 * <ResizablePanel defaultValue={300} minValue={100} maxValue={500}>...</ResizablePanel>
 * ```
 */
export interface ResizablePanelProps extends ComponentPropsWithoutRef<"div"> {
  /** Current size in pixels. Not `size` or `width`. */
  value?: number;
  /** Initial size in pixels for uncontrolled usage. */
  defaultValue?: number;
  /** Fires with new pixel size. Not `onChange` or `onResize`. */
  onValueChange?: (value: number) => void;
  /** Fires when the user begins resizing. */
  onResizeStart?: (value: number) => void;
  /** Fires when the user finishes resizing. */
  onResizeEnd?: (value: number) => void;
  /** Minimum allowed size in pixels. */
  minValue?: number;
  /** Maximum allowed size in pixels. */
  maxValue?: number;
  /** Resize handle direction. Not `orientation`. */
  resizeDirection?: "left" | "right" | "top" | "bottom";
  step?: number;
  disabled?: boolean;
  /** Controls motion preferences. `"auto"` respects the user's OS setting. */
  reduceMotion?: boolean | "auto";
  classes?: ResizablePanelClasses;
  handleContent?: ReactNode;
  unstyled?: boolean;
}
