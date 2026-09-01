import type { ResizablePanelClasses } from "./types";

import { structuralOnly } from "../../../utils/classLayers";
const DEFAULT_RESIZABLEPANEL_CLASSES: Required<ResizablePanelClasses> = {
  root: "relative",
  handle: "",
};

const UNSTYLED_RESIZABLEPANEL_CLASSES: Required<ResizablePanelClasses> =
  structuralOnly(DEFAULT_RESIZABLEPANEL_CLASSES);

export { DEFAULT_RESIZABLEPANEL_CLASSES, UNSTYLED_RESIZABLEPANEL_CLASSES };
