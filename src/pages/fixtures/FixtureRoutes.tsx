import { Route, Routes } from "react-router-dom";
import FixtureIndex from "./FixtureIndex.js";
import FixtureRoute from "./FixtureRoute.js";

/**
 * The dev-only fixture subtree, in one module so App.tsx needs exactly one
 * conditional import to gate it — a top-level `lazy(() => import(...))` is a
 * call with side effects that Rollup keeps, so the chunk shipped even with the
 * branch dead.
 *
 * Mounted under a `/__fixtures/*` splat, so it owns its own nested Routes.
 */
export default function FixtureRoutes() {
  return (
    <Routes>
      <Route index element={<FixtureIndex />} />
      <Route path=":component/:fixture" element={<FixtureRoute />} />
    </Routes>
  );
}
