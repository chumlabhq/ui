import { structuralOnly } from "../../../utils/classLayers.js";
import type {
  CircularLoaderClasses,
  LinearLoaderClasses,
  DotLoaderClasses,
  PulseLoaderClasses,
} from "./types.js";

export const DEFAULT_CIRCULAR_LOADER_CLASSES: Required<CircularLoaderClasses> = {
  root: "inline-flex shrink-0 text-cl-accent h-(--loader-size) w-(--loader-size)",
  control: "h-full w-full animate-spin [animation-duration:var(--loader-speed)]",
  track: "opacity-20",
  range: "",
};

export const UNSTYLED_CIRCULAR_LOADER_CLASSES: Required<CircularLoaderClasses> =
  structuralOnly(DEFAULT_CIRCULAR_LOADER_CLASSES);

export const DEFAULT_LINEAR_LOADER_CLASSES: Required<LinearLoaderClasses> = {
  root: "inline-block text-cl-accent",
  range: "",
};

export const UNSTYLED_LINEAR_LOADER_CLASSES: Required<LinearLoaderClasses> =
  structuralOnly(DEFAULT_LINEAR_LOADER_CLASSES);

export const DEFAULT_DOT_LOADER_CLASSES: Required<DotLoaderClasses> = {
  root: "text-cl-accent",
  range: "",
};

export const UNSTYLED_DOT_LOADER_CLASSES: Required<DotLoaderClasses> =
  structuralOnly(DEFAULT_DOT_LOADER_CLASSES);

export const DEFAULT_PULSE_LOADER_CLASSES: Required<PulseLoaderClasses> = {
  root: "text-cl-accent",
  range: "",
};

export const UNSTYLED_PULSE_LOADER_CLASSES: Required<PulseLoaderClasses> =
  structuralOnly(DEFAULT_PULSE_LOADER_CLASSES);
