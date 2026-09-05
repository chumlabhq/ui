// AI Knowledge: See MODAL.ai.md in this directory for full usage guide, props, styling, and patterns.
export { default as Modal, ModalHeader, ModalBody, ModalFooter } from "./Modal.js";
export { useModal } from "./useModal.js";
export type {
  ModalProps,
  ModalClasses,
  ModalHeaderProps,
  ModalBodyProps,
  ModalFooterProps,
  ModalContextValue,
} from "./utils/types.js";
export {
  DEFAULT_MODAL_CLASSES,
  UNSTYLED_MODAL_CLASSES,
} from "./utils/constants.js";
