import type { ModalClasses } from "./types";

export const DEFAULT_MODAL_CLASSES: Required<ModalClasses> = {
  root: "fixed inset-0 z-50 flex items-center justify-center",
  overlay:
    "fixed inset-0 bg-black/60 dark:bg-black/70 backdrop-blur-sm transition-opacity",
  container: "relative z-10 flex items-center justify-center p-4",
  content:
    "w-full max-w-lg rounded-xl shadow-2xl overflow-hidden bg-white dark:bg-gray-800",
  header: "flex items-start gap-3 p-6 pb-4",
  title: "font-semibold text-lg text-gray-900 dark:text-white",
  description: "mt-1 text-sm text-gray-600 dark:text-gray-400",
  icon: "",
  closeButton:
    "shrink-0 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ml-auto",
  closeIcon: "w-5 h-5 text-gray-500 dark:text-gray-400",
  body: "px-6 pb-6",
};

export const UNSTYLED_MODAL_CLASSES: Required<ModalClasses> = {
  root: "",
  overlay: "",
  container: "",
  content: "",
  header: "",
  title: "",
  description: "",
  icon: "",
  closeButton: "",
  closeIcon: "",
  body: "",
};
