import { useCallback, useEffect, useMemo } from "react";
import type { StorageConfig } from "../utils/types.js";
import { defaultStorage, getDefaultStorageConfig } from "../utils/constants.js";
import { isBrowser } from "../../../utils/isBrowser.js";

export function resolveStorageConfig(
  storageKey: string | StorageConfig | undefined,
): StorageConfig | null {
  if (!storageKey) return null;

  const defaults = getDefaultStorageConfig();

  if (typeof storageKey === "string") {
    return { key: storageKey, ...defaults };
  }

  return {
    ...defaults,
    ...storageKey,
    serialize: storageKey.serialize ?? defaults.serialize,
    deserialize: storageKey.deserialize ?? defaults.deserialize,
  };
}

export interface UseAccordionStorageOptions {
  storageKey: string | StorageConfig | undefined;
  isControlled: boolean;
}

export interface UseAccordionStorageReturn {
  storageConfig: StorageConfig | null;
  readFromStorage: () => string[] | null;
  writeToStorage: (values: Set<string>) => void;
}

export function useAccordionStorage({
  storageKey,
  isControlled,
}: UseAccordionStorageOptions): UseAccordionStorageReturn {
  const storageConfig = useMemo(
    () => resolveStorageConfig(storageKey),
    [storageKey],
  );

  const readFromStorage = useCallback((): string[] | null => {
    if (!storageConfig || !isBrowser) return null;

    try {
      const stored = (storageConfig.storage ?? defaultStorage())?.getItem(storageConfig.key);
      if (stored && storageConfig.deserialize) {
        return storageConfig.deserialize(stored);
      }
    } catch {
      // Storage access may fail (e.g. private browsing, quota exceeded)
    }

    return null;
  }, [storageConfig]);

  const writeToStorage = useCallback(
    (values: Set<string>) => {
      if (!storageConfig || isControlled) return;

      try {
        const storage = storageConfig.storage ?? defaultStorage();
        if (storageConfig.serialize && storage) {
          storage.setItem(storageConfig.key, storageConfig.serialize(Array.from(values)));
        }
      } catch {
        // Private browsing and a full quota both throw on setItem.
      }
    },
    [storageConfig, isControlled],
  );

  return { storageConfig, readFromStorage, writeToStorage };
}

/** `paused` covers both reasons not to write: controlled, or not yet read. */
export function useStorageSync(
  values: Set<string>,
  writeToStorage: (values: Set<string>) => void,
  paused: boolean,
) {
  useEffect(() => {
    if (!paused) {
      writeToStorage(values);
    }
  }, [values, writeToStorage, paused]);
}
