import type { BreadcrumbClasses } from "./types";

export const DEFAULT_BREADCRUMB_CLASSES: Required<BreadcrumbClasses> = {
  root: "",
  list: "flex items-center gap-1",
  item: "flex items-center gap-1 px-2 py-1 text-sm transition-colors cursor-pointer bg-transparent border-none text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded",
  itemActive: "flex items-center gap-1 px-2 py-1 text-sm font-medium bg-transparent border-none cursor-default text-gray-900",
  itemDisabled: "opacity-40 cursor-not-allowed hover:bg-transparent hover:text-gray-500",
  link: "flex items-center gap-1 px-2 py-1 text-sm rounded transition-colors text-blue-600 hover:text-blue-800 hover:underline",
  separator: "text-gray-400",
  icon: "shrink-0",
  ellipsis: "",
  ellipsisButton: "flex items-center justify-center w-8 h-8 rounded-md transition-colors cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-600",
  dropdown: "min-w-40 rounded-lg shadow-lg py-1 bg-white border border-gray-200",
  dropdownItem: "flex items-center gap-2 px-3 py-2 text-sm cursor-pointer w-full text-left bg-transparent border-none text-gray-700 hover:bg-gray-50",
  dropdownItemDisabled: "opacity-50 cursor-not-allowed",
};

export const UNSTYLED_BREADCRUMB_CLASSES: Required<BreadcrumbClasses> = {
  root: "",
  list: "",
  item: "",
  itemActive: "",
  itemDisabled: "",
  link: "",
  separator: "",
  icon: "",
  ellipsis: "",
  ellipsisButton: "",
  dropdown: "",
  dropdownItem: "",
  dropdownItemDisabled: "",
};
