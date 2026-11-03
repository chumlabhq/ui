import { Button } from "../../../components/Button/index.js";

/** Declared again rather than imported from `useFakeLoader`: a snippet carries a helper only if its module stands alone. */
type NextLoad = "succeed" | "fail" | "slow" | "empty";

const MODES: Array<{ mode: Exclude<NextLoad, "succeed">; label: string; says: string }> = [
  { mode: "fail", label: "Fail", says: "The next load fails." },
  { mode: "slow", label: "Be slow", says: "The next load takes 3 seconds." },
  { mode: "empty", label: "Return nothing", says: "The next load returns no items." },
];

/** The buttons that set what the next load does, and a line saying what it will do. */
export function NextLoadControl({ loader }: { loader: { next: NextLoad; setNext: (mode: NextLoad) => void } }) {
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
