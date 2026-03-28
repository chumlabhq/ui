import type { ModalClasses } from "./types";

export const DEFAULT_MODAL_CLASSES: Required<ModalClasses> = {
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

export const UNSTYLED_MODAL_CLASSES: Required<ModalClasses> = {
  ...DEFAULT_MODAL_CLASSES,
};
