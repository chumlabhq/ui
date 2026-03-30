import type { ReactNode, ComponentPropsWithoutRef } from "react";

export interface ResizablePanelClasses {
  root?: string;
  handle?: string;
}

export interface ResizablePanelProps extends ComponentPropsWithoutRef<"div"> {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  onResizeStart?: (value: number) => void;
  onResizeEnd?: (value: number) => void;
  minValue?: number;
  maxValue?: number;
  resizeDirection?: "left" | "right" | "top" | "bottom";
  step?: number;
  disabled?: boolean;
  /** Controls motion preferences. `"auto"` respects the user's OS setting. */
  reduceMotion?: boolean | "auto";
  classes?: ResizablePanelClasses;
  handleContent?: ReactNode;
  unstyled?: boolean;
}
