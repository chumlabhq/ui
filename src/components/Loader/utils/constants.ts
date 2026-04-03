import type {
  CircularLoaderClasses,
  LinearLoaderClasses,
  DotLoaderClasses,
  PulseLoaderClasses,
} from "./types";

// ─── CircularLoader ─────────────────────────────────────────────────────────

export const DEFAULT_CIRCULAR_LOADER_CLASSES: Required<CircularLoaderClasses> = {
  root: "inline-flex shrink-0",
  svg: "h-full w-full animate-spin",
  track: "opacity-20",
  indicator: "",
};

export const UNSTYLED_CIRCULAR_LOADER_CLASSES: Required<CircularLoaderClasses> = {
  root: "",
  svg: "",
  track: "",
  indicator: "",
};

// ─── LinearLoader ───────────────────────────────────────────────────────────

export const DEFAULT_LINEAR_LOADER_CLASSES: Required<LinearLoaderClasses> = {
  root: "inline-block",
  bar: "",
};

export const UNSTYLED_LINEAR_LOADER_CLASSES: Required<LinearLoaderClasses> = {
  root: "",
  bar: "",
};

// ─── DotLoader ──────────────────────────────────────────────────────────────

export const DEFAULT_DOT_LOADER_CLASSES: Required<DotLoaderClasses> = {
  root: "",
  dot: "",
};

export const UNSTYLED_DOT_LOADER_CLASSES: Required<DotLoaderClasses> = {
  root: "",
  dot: "",
};

// ─── PulseLoader ────────────────────────────────────────────────────────────

export const DEFAULT_PULSE_LOADER_CLASSES: Required<PulseLoaderClasses> = {
  root: "",
  core: "",
  ring: "",
};

export const UNSTYLED_PULSE_LOADER_CLASSES: Required<PulseLoaderClasses> = {
  root: "",
  core: "",
  ring: "",
};
