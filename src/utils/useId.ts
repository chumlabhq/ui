import { useId as reactUseId, useState } from "react";

let idCounter = 0;

/**
 * Polyfill for useId that works with React versions before 18.
 * Uses a simple counter-based approach with useState to ensure stability.
 */
function useIdPolyfill(): string {
  const [id] = useState(() => `:kern-${idCounter++}:`);
  return id;
}

/**
 * Cross-compatible useId hook.
 * Uses React's native useId (React 18+) when available, otherwise falls back to polyfill.
 */
export const useId: () => string =
  typeof reactUseId === "function" ? reactUseId : useIdPolyfill;
