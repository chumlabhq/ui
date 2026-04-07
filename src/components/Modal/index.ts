// AI Knowledge: See MODAL.ai.md in this directory for full usage guide, props, styling, and patterns.
export { default as Modal, ModalHeader, ModalBody, ModalFooter } from "./Modal";
export { useModal } from "./useModal";
export type {
  ModalProps,
  ModalClasses,
  ModalHeaderProps,
  ModalBodyProps,
  ModalFooterProps,
  ModalContextValue,
} from "./utils/types";
export {
  DEFAULT_MODAL_CLASSES,
  UNSTYLED_MODAL_CLASSES,
} from "./utils/constants";
