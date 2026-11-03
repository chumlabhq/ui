import { useCallback, useRef, useState } from "react";

/** What the next load does. */
export type NextLoad = "succeed" | "fail" | "slow" | "empty";

export interface FakeLoader<A extends unknown[], T> {
  /** What the next load will do; it goes back to "succeed" once that load settles. */
  next: NextLoad;
  setNext: (mode: NextLoad) => void;
  /** Hand this to the component: `loadOptions`, `searchOptions`, `loadChildren`, or your own fetch. */
  load: (...args: A) => Promise<T[]>;
  /** Hand this to the component's `onLoadError`: it sets `error`, and the next good load clears it. */
  onLoadError: (error: unknown) => void;
  /** What to show in the field's `errorMessage` after a failed load; null once a load succeeds. */
  error: string | null;
}

/**
 * A server you can break on purpose, for the "When loading fails" sections.
 *
 * Deterministic and offline: `answer` says what a good load returns, and the
 * control beside the component decides whether the next load fails, is slow or
 * comes back empty. Only the next one, so opening the list again, or pressing
 * Try again, is the retry a reader would make against a real server.
 *
 * A failed load reaches the component as a rejected promise, which it reports
 * through `onLoadError`; that sets `error`, which the page passes to the
 * field's `error` and `errorMessage`, and the field announces it.
 *
 * `answer` must keep its identity across renders (declare it outside the
 * component): the components re-run their load when `load` changes.
 *
 * It imports nothing but react and the library, so the snippet a reader copies
 * carries it whole.
 */
export function useFakeLoader<A extends unknown[], T>(answer: (...args: A) => T[], failedText: string, latency = 400): FakeLoader<A, T> {
  const nextRef = useRef<NextLoad>("succeed");
  const [next, setNextState] = useState<NextLoad>("succeed");
  const [error, setError] = useState<string | null>(null);
  const onLoadError = useCallback(() => setError(failedText), [failedText]);
  const setNext = useCallback((mode: NextLoad) => {
    nextRef.current = mode;
    setNextState(mode);
  }, []);
  const load = useCallback(
    (...args: A) => {
      const mode = nextRef.current;
      return new Promise<T[]>((resolve, reject) => {
        setTimeout(() => {
          if (mode === "fail") reject(new Error("The server did not answer."));
          else {
            setError(null);
            resolve(mode === "empty" ? [] : answer(...args));
          }
          // After it settles, not when it starts: a re-render mid-load would
          // hand the component a new callback and cancel the load it is in.
          if (mode !== "succeed") setNext("succeed");
        }, mode === "slow" ? 3000 : latency);
      });
    },
    [answer, latency, setNext],
  );
  return { next, setNext, load, onLoadError, error };
}
