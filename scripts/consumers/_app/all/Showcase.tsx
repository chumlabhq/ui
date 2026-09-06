import { ENTRIES } from "./registry";

/**
 * Every component in one tree, which is what the SSR targets prerender and what
 * the render sweep reads. One page rather than thirty, because "does the whole
 * library render together" is a different question from "does each component
 * hydrate", and only the second one needs isolating.
 */
export default function Showcase() {
  return (
    <main>
      {/* The sentinel the matrix greps for in server-rendered HTML. */}
      <h1>chumlab-consumer-smoke</h1>
      {ENTRIES.map((entry) => (
        <section key={entry.name} data-component={entry.name}>
          {entry.node}
        </section>
      ))}
    </main>
  );
}
