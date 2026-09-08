/**
 * Where each part lives in the rendered DOM. Parts are not yet named in the
 * markup — that is Task 3 — so until then they are located by role or by the
 * element the component actually renders. Wrong selector, false failure, so
 * every one of these was read off a rendered fixture rather than guessed.
 *
 * The table itself lives in JSON so `e2e/default-state.spec.ts` can read the
 * same one. Widened to `Record<string, string>` on the way through: callers
 * index it with a part name computed from the migration table, and the literal
 * type inferred from the JSON rejects that.
 */
import selectors from "../../../docs/adr/002-part-selectors.json" with { type: "json" };

export const SELECTOR: Record<string, string> = selectors;
