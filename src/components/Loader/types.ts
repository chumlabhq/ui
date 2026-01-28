import type { HTMLAttributes } from "react";

export interface CircularLoaderProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
  thickness?: number;
  speed?: number;
  trackColor?: string;
  color?: string;
}
