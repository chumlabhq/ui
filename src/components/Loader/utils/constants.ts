import { structuralOnly } from "../../../utils/classLayers";
import type {
  CircularLoaderClasses,
  LinearLoaderClasses,
  DotLoaderClasses,
  PulseLoaderClasses,
} from "./types";

// ─── CircularLoader ─────────────────────────────────────────────────────────

export const DEFAULT_CIRCULAR_LOADER_CLASSES: Required<CircularLoaderClasses> = {
  root: "inline-flex shrink-0 text-cl-accent",
  svg: "h-full w-full animate-spin",
  track: "opacity-20",
  indicator: "",
};

export const UNSTYLED_CIRCULAR_LOADER_CLASSES: Required<CircularLoaderClasses> =
  structuralOnly(DEFAULT_CIRCULAR_LOADER_CLASSES);

// ─── LinearLoader ───────────────────────────────────────────────────────────

export const DEFAULT_LINEAR_LOADER_CLASSES: Required<LinearLoaderClasses> = {
  root: "inline-block text-cl-accent",
  bar: "",
};

export const UNSTYLED_LINEAR_LOADER_CLASSES: Required<LinearLoaderClasses> =
  structuralOnly(DEFAULT_LINEAR_LOADER_CLASSES);

// ─── DotLoader ──────────────────────────────────────────────────────────────

export const DEFAULT_DOT_LOADER_CLASSES: Required<DotLoaderClasses> = {
  root: "text-cl-accent",
  dot: "",
};

export const UNSTYLED_DOT_LOADER_CLASSES: Required<DotLoaderClasses> =
  structuralOnly(DEFAULT_DOT_LOADER_CLASSES);

// ─── PulseLoader ────────────────────────────────────────────────────────────

export const DEFAULT_PULSE_LOADER_CLASSES: Required<PulseLoaderClasses> = {
  root: "text-cl-accent",
  core: "",
  ring: "",
};

export const UNSTYLED_PULSE_LOADER_CLASSES: Required<PulseLoaderClasses> =
  structuralOnly(DEFAULT_PULSE_LOADER_CLASSES);
