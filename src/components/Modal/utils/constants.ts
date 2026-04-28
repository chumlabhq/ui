import type { ModalClasses } from "./types";

export const DEFAULT_MODAL_CLASSES: Required<ModalClasses> = {
  root: "fixed inset-0 z-50 flex items-center justify-center",
  overlay:
    "fixed inset-0 bg-black/60 dark:bg-black/70 backdrop-blur-sm transition-opacity",
  container: "relative z-10 flex items-center justify-center p-2 sm:p-4",
  content:
    "w-full max-w-lg rounded-cl-lg shadow-2xl overflow-hidden bg-white dark:bg-cl-bg-elevated",
  header: "flex items-start gap-3 p-6 pb-4",
  title: "font-semibold text-lg text-cl-text dark:text-white",
  description: "mt-1 text-sm text-cl-text-secondary dark:text-cl-text-tertiary",
  icon: "",
  closeButton:
    "shrink-0 p-1.5 rounded-cl-md hover:bg-cl-bg-hover dark:hover:bg-cl-bg-elevated transition-colors ml-auto",
  closeIcon: "w-5 h-5 text-cl-text-tertiary dark:text-cl-text-tertiary",
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
