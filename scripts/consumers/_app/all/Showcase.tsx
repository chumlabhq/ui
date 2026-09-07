import { ENTRIES } from "./registry";
// Every copy-paste snippet the site offers. Imported rather than rendered: the
// question is whether the code a consumer pastes compiles here — module
// resolution, prop types, the exports map, and where the "use client" line has
// to sit — and rendering thirty more examples would answer a different one.
// The namespace is read below so the bundler cannot shake the modules out
// before the production build has type-checked and compiled them.
import * as SNIPPETS from "./snippets";

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
      <div hidden data-snippets={Object.keys(SNIPPETS).length} />
      {ENTRIES.map((entry) => (
        <section key={entry.name} data-component={entry.name}>
          {entry.node}
        </section>
      ))}
    </main>
  );
}
