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

/**
 * In a frame, a preview takes no focus until the reader uses it.
 *
 * A frame loads as the docs page scrolls near it, and a preview that opens a
 * list on first render focuses that list's search box: the reader typing in
 * another section had their focus moved into the frame mid-word. Same-origin
 * frames may take focus by script, so it is held here, in the frame's own
 * window, until a pointer, a key or a Tab reaches the frame. Opened as a page
 * of its own, a preview focuses as the example would.
 */
if (typeof window !== "undefined" && window.self !== window.top) {
  let used = false;
  const use = () => {
    used = true;
  };
  for (const type of ["pointerdown", "keydown", "focusin"]) window.addEventListener(type, use, { capture: true, once: true });
  const focus = HTMLElement.prototype.focus;
  HTMLElement.prototype.focus = function (this: HTMLElement, options?: FocusOptions) {
    if (used) focus.call(this, options);
  };
}

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
