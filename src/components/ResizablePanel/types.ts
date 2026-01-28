import type { ReactNode } from "react";

export interface ResizablePanelProps {
  children: ReactNode;
  initialWidth: number;
  minWidth?: number;
  maxWidth?: number;
  onWidthChange?: (width: number) => void;
  className?: string;
  resizeHandleClassName?: string;
  resizeDirection?: "left" | "right";
}
