import type { ResizablePanelClasses } from "./types";

import { structuralOnly } from "../../../utils/classLayers";
const DEFAULT_RESIZABLEPANEL_CLASSES: Required<ResizablePanelClasses> = {
  root: "relative",
  handle: "absolute touch-none select-none motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent",
};

const UNSTYLED_RESIZABLEPANEL_CLASSES: Required<ResizablePanelClasses> =
  structuralOnly(DEFAULT_RESIZABLEPANEL_CLASSES);

export { DEFAULT_RESIZABLEPANEL_CLASSES, UNSTYLED_RESIZABLEPANEL_CLASSES };
