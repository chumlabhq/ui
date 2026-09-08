import type { ModalClasses } from "./types.js";
import { structuralOnly } from "../../../utils/classLayers.js";

export const DEFAULT_MODAL_CLASSES: Required<ModalClasses> = {
  root: "fixed inset-0 z-50 flex items-center justify-center",
  overlay:
    "fixed inset-0 bg-black/60 dark:bg-black/70 backdrop-blur-sm transition-opacity",
  // `fixed inset-0` and `relative` are both here, and they contradict each
  // other: `relative` wins in Tailwind's cascade order, which is why the
  // full-screen content below has to override it with `!important`.
  positioner:
    "fixed inset-0 overflow-y-auto relative z-10 p-2 sm:p-4 data-[centered]:flex data-[centered]:items-center data-[centered]:justify-center",
  content:
    "w-full max-w-lg rounded-cl-lg shadow-2xl overflow-hidden bg-cl-bg-panel data-[fullscreen]:!fixed data-[fullscreen]:!inset-0 data-[fullscreen]:outline-none data-[fullscreen]:max-w-none data-[fullscreen]:m-0 data-[fullscreen]:rounded-none relative outline-none transition-all transform opacity-0 scale-95 data-[open]:opacity-100 data-[open]:scale-100",
  header: "flex items-start gap-3 p-6 pb-4",
  title: "font-semibold text-lg text-cl-text",
  description: "mt-1 text-sm text-cl-text-chrome-quiet",
  icon: "",
  closeTrigger:
    "shrink-0 p-1.5 rounded-cl-md hover:bg-cl-bg-hover transition-colors ml-auto cursor-pointer",
  closeIcon: "w-5 h-5 text-cl-text-tertiary",
  body: "px-6 pb-6",
};

export const UNSTYLED_MODAL_CLASSES: Required<ModalClasses> =
  structuralOnly(DEFAULT_MODAL_CLASSES);
