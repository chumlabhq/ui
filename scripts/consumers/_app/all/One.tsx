import { CANARY, ENTRIES } from "./registry";

/**
 * One component, alone on a route.
 *
 * Hydration is per component or it is nothing: a mismatch reported against a
 * page holding thirty of them names no component, and in a production build the
 * component stack is minified. A route each also isolates the failure — one
 * component throwing on a server takes its own page down and not the sweep.
 */
export function One({ name }: { name: string }) {
  const entry = [...ENTRIES, CANARY].find((candidate) => candidate.name === name);
  if (!entry) return <main data-component="__unknown">{`no component named ${name}`}</main>;
  return (
    <main>
      <h1>chumlab-consumer-smoke</h1>
      <section data-component={entry.name}>{entry.node}</section>
    </main>
  );
}
