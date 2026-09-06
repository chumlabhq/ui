import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import "@chumlab/ui/styles.css";
import Showcase from "./Showcase";

/**
 * StrictMode, actually run.
 *
 * The vite-react19 template has always written `<StrictMode>` and the matrix
 * has only ever built it — nothing mounted the tree, so the double-invoked
 * effects it exists to expose never ran. Everything the library does twice
 * under StrictMode lives in an effect: `useSyncExternalStore` subscriptions,
 * portals, `ResizeObserver`s, focus traps and the measure-then-settle frame.
 */
function Harness() {
  const [mounted, setMounted] = useState(true);
  return (
    <>
      <button data-probe="toggle" onClick={() => setMounted((m) => !m)}>
        {mounted ? "unmount" : "mount"}
      </button>
      {mounted ? <Showcase /> : <p data-probe="unmounted">unmounted</p>}
    </>
  );
}

const root = document.getElementById("root");
if (!root) throw new Error("no root");
createRoot(root).render(
  <StrictMode>
    <Harness />
  </StrictMode>,
);
