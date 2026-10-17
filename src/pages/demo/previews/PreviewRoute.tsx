import { lazy, Suspense, type ComponentType, type LazyExoticComponent } from "react";
import { useParams } from "react-router-dom";
import NotFound from "../../NotFound.js";
import type { Previews } from "./types.js";

/**
 * `/preview/:component/:example`: one demo example on a page of its own, with
 * no site chrome, for a `PhoneFrame` to load at a phone's viewport. Popovers
 * place themselves against the viewport, so a narrow div on the docs page
 * cannot show where they land on a phone; a 360 px iframe can.
 *
 * In every build, unlike `/__fixtures`. Not for search engines: `noindex`, and
 * index.html sends no page view from it, so each frame on a docs page is not
 * counted as a visit.
 */
const modules = import.meta.glob<{ default: Previews }>("./*.preview.tsx");

const loaded = new Map<string, LazyExoticComponent<ComponentType>>();

function previewOf(component: string, example: string): LazyExoticComponent<ComponentType> {
  const key = `${component}/${example}`;
  let hit = loaded.get(key);
  if (!hit) {
    const load = modules[`./${component}.preview.tsx`];
    hit = lazy(async () => ({ default: (load && (await load()).default[example]) || NotFound }));
    loaded.set(key, hit);
  }
  return hit;
}

export default function PreviewRoute() {
  const { component = "", example = "" } = useParams();
  const Example = previewOf(component, example);
  return (
    <main data-preview={`${component}/${example}`} className="min-h-screen bg-cl-bg p-4 text-cl-text">
      <meta name="robots" content="noindex" />
      <header className="sr-only">
        <h1>{component} preview</h1>
      </header>
      <Suspense fallback={null}>
        <Example />
      </Suspense>
    </main>
  );
}
