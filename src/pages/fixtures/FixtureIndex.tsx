import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { componentNames, loadFixtures, toSlug } from "./lazyRegistry.js";

/** Lists every fixture URL. Dev only; see FixtureRoute for why this exists. */
export default function FixtureIndex() {
  const [routes, setRoutes] = useState<{ path: string; hasAct: boolean }[]>([]);
  /**
   * The readiness stamp, the same shape as `data-fixture-act` on a fixture
   * route: a marker that says the page has finished doing the thing a spec is
   * about to read.
   *
   * `data-fixture-index` is on the element from the first commit, while the
   * list behind it arrives from an async effect. A spec that navigated here
   * and enumerated straight away could read zero links and believe it — twice
   * under matrix load, once as `fixture-act.spec.ts` failing on its own guard
   * and once as an axe sweep auditing "Fixtures (0)". Only one of those specs
   * had a guard; this closes it for all of them, in the page rather than in
   * each caller.
   */
  const [ready, setReady] = useState(false);

  useEffect(() => {
    void (async () => {
      const all = await Promise.all(
        componentNames().map(async (name) =>
          (await loadFixtures(name)).map((f) => ({
            path: `/__fixtures/${toSlug(name)}/${f.name}`,
            // fixture-act.spec.ts drives this: a fixture that reaches its state
            // by interaction is the one whose act has to be seen to apply.
            hasAct: typeof f.act === "function",
          })),
        ),
      );
      setRoutes(all.flat());
      setReady(true);
    })();
  }, []);

  return (
    <main
      data-fixture-index
      data-fixture-index-ready={ready ? "" : undefined}
      style={{ padding: 24, fontFamily: "monospace" }}
    >
      <h1>Fixtures ({routes.length})</h1>
      <ul>
        {routes.map((r) => (
          <li key={r.path} data-has-act={r.hasAct ? "" : undefined}>
            <Link to={r.path}>{r.path}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
