import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { componentNames, loadFixtures, toSlug } from "./lazyRegistry.js";

/** Lists every fixture URL. Dev only; see FixtureRoute for why this exists. */
export default function FixtureIndex() {
  const [routes, setRoutes] = useState<{ path: string }[]>([]);

  useEffect(() => {
    void (async () => {
      const all = await Promise.all(
        componentNames().map(async (name) =>
          (await loadFixtures(name)).map((f) => ({
            path: `/__fixtures/${toSlug(name)}/${f.name}`,
          })),
        ),
      );
      setRoutes(all.flat());
    })();
  }, []);

  return (
    <main data-fixture-index style={{ padding: 24, fontFamily: "monospace" }}>
      <h1>Fixtures ({routes.length})</h1>
      <ul>
        {routes.map((r) => (
          <li key={r.path}>
            <Link to={r.path}>{r.path}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
