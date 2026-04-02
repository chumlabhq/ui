import { useCallback, useEffect, useMemo } from "react";
import type { StorageConfig } from "../utils/types";
import { getDefaultStorageConfig } from "../utils/constants";
import { isBrowser } from "../../../utils/isBrowser";

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
    // Ensure serialize/deserialize are never undefined even if explicitly passed as undefined
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
      const stored = storageConfig.storage?.getItem(storageConfig.key);
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
        if (storageConfig.serialize && storageConfig.storage) {
          storageConfig.storage.setItem(
            storageConfig.key,
            storageConfig.serialize(Array.from(values)),
          );
        }
      } catch {
        // Storage access may fail
      }
    },
    [storageConfig, isControlled],
  );

  return { storageConfig, readFromStorage, writeToStorage };
}

export function useStorageSync(
  values: Set<string>,
  writeToStorage: (values: Set<string>) => void,
  isControlled: boolean,
) {
  useEffect(() => {
    if (!isControlled) {
      writeToStorage(values);
    }
  }, [values, writeToStorage, isControlled]);
}
