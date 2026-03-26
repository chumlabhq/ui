import { createContext } from "react";
import type { ModalContextValue } from "./utils/types";

export const ModalContext = createContext<ModalContextValue | null>(null);
