// AI Knowledge: See BREADCRUMB.ai.md in this directory for full usage guide, props, styling, and patterns.

export { default as Breadcrumb } from "./Breadcrumb.js";

export type {
  BreadcrumbItem,
  BreadcrumbProps,
  BreadcrumbClasses,
  BreadcrumbTooltipProps,
  TooltipSide,
  TooltipAlign,
  IconPosition,
  DropdownPosition,
} from "./utils/types.js";

export {
  DEFAULT_BREADCRUMB_CLASSES,
  UNSTYLED_BREADCRUMB_CLASSES,
} from "./utils/constants.js";

export { ChevronRightIcon, EllipsisIcon } from "./icons.js";
