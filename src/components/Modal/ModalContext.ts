import { createContext } from "react";
import type { ModalContextValue } from "./utils/types.js";

export const ModalContext = createContext<ModalContextValue | null>(null);
