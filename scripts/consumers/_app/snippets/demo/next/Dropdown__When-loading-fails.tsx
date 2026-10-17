"use client";

import { useCallback, useRef, useState } from "react";
import { Button } from "@chumlab/ui/button";
import { Dropdown } from "@chumlab/ui/dropdown";

const answerWarehouses = () => [
  { value: "ams", label: "Amsterdam" },
  { value: "bcn", label: "Barcelona" },
  { value: "dub", label: "Dublin" },
  { value: "lyo", label: "Lyon" },
];

type NextLoad = "succeed" | "fail" | "slow" | "empty";

interface FakeLoader<A extends unknown[], T> {
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

const MODES: Array<{ mode: Exclude<NextLoad, "succeed">; label: string; says: string }> = [
  { mode: "fail", label: "Fail", says: "The next load fails." },
  { mode: "slow", label: "Be slow", says: "The next load takes 3 seconds." },
  { mode: "empty", label: "Return nothing", says: "The next load returns no items." },
];

function NextLoadControl({ loader }: { loader: Pick<FakeLoader<never, unknown>, "next" | "setNext"> }) {
  return (
    <div role="group" aria-label="Next load" className="space-y-2" data-demo-next-load={loader.next}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-cl-text-secondary">Make the next load:</span>
        {MODES.map(({ mode, label }) => (
          <Button
            key={mode}
            aria-pressed={loader.next === mode}
            onClick={() => loader.setNext(loader.next === mode ? "succeed" : mode)}
            className="border border-cl-border bg-cl-bg-elevated text-cl-text aria-pressed:border-cl-accent aria-pressed:text-cl-accent"
          >
            {label}
          </Button>
        ))}
      </div>
      <p className="text-sm text-cl-text-secondary">
        {MODES.find((m) => m.mode === loader.next)?.says ?? "The next load succeeds."}
      </p>
    </div>
  );
}

function useFakeLoader<A extends unknown[], T>(answer: (...args: A) => T[], failedText: string, latency = 400): FakeLoader<A, T> {
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

export default function DropdownExample() {
  const warehouses = useFakeLoader(answerWarehouses, "Couldn't load the warehouses. Open the list again to retry.");
  return (
    <div className="w-full sm:max-w-sm space-y-4">
      <Dropdown
        label="Warehouse"
        placeholder="Choose a warehouse"
        loadOptions={warehouses.load}
        loadOnOpen
        onLoadError={warehouses.onLoadError}
        error={warehouses.error !== null}
        errorMessage={warehouses.error}
        loadingContent="Loading warehouses…"
        emptyContent="No warehouses to show."
      />
      <NextLoadControl loader={warehouses} />
    </div>
  );
}
