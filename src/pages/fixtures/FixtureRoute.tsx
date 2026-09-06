import { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { browserActTools } from "../../__tests__/fixtures/_act.js";
import type { Fixture } from "../../__tests__/fixtures/types.js";
import { fromSlug, loadComponent, loadFixtures, type Resolved } from "./lazyRegistry.js";

/**
 * Renders one fixture per URL, so e2e can drive a component directly.
 *
 * E2E-INVENTORY.md: 103 of 109 failures were specs coupled to demo prose that
 * had changed — a heading renamed from "Basic Pagination" to "Basic Usage" took
 * eighteen tests with it. Rewriting those specs against the current demos would
 * rebuild the same coupling. A fixture page has no prose to drift.
 *
 * The fixtures are the ones the contract tier already uses, discovered by glob,
 * so a new fixture is reachable here with no extra wiring — which is the
 * property that stops this drifting in turn.
 *
 * It runs the fixture's `act` too, which it did not until the sweep in _act.ts:
 * 50 fixtures reach their named state by interaction and every one of them
 * rendered its base state to visual, a11y-full and e2e. `data-fixture-act`
 * records the outcome and `fixture-act.spec.ts` fails on anything but
 * "applied", so an act that throws or changes nothing cannot pass as a render.
 *
 * DEV ONLY. App.tsx imports the subtree inside a ternary on import.meta.env.DEV,
 * so a production build drops the branch and the chunk;
 * scripts/assert-fixture-bundle.mjs asserts it never reaches the package.
 */
/**
 * Resolves once the document has stopped mutating.
 *
 * The act runs from an effect on the fixture's first commit, and a component
 * still assembling itself takes the event and drops the state that comes of it:
 * Table's cell editor opened from a dblclick dispatched half a second later and
 * not from the identical one dispatched on that first frame, which is how
 * `Table.input` came to be recorded "ATTEMPTED, still unreachable". Waiting for
 * quiet rather than for a fixed delay keeps the fast fixtures fast.
 */
const quiet = (idleMs = 120, capMs = 1500) =>
  new Promise<void>((resolve) => {
    let timer = 0;
    const done = () => {
      clearTimeout(timer);
      clearTimeout(cap);
      observer.disconnect();
      resolve();
    };
    const observer = new MutationObserver(() => {
      clearTimeout(timer);
      timer = window.setTimeout(done, idleMs);
    });
    observer.observe(document.documentElement, {
      subtree: true,
      childList: true,
      attributes: true,
    });
    timer = window.setTimeout(done, idleMs);
    const cap = window.setTimeout(done, capMs);
  });

/** Reachable by a screen reader, invisible on the page. */
const SR_ONLY = {
  position: "absolute",
  width: 1,
  height: 1,
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  whiteSpace: "nowrap",
} as const;

/**
 * `?classes={"input":"ovr-input"}` merges a `classes` map into the fixture.
 *
 * `fixtures.contract` proves a key reaches the DOM by overriding it with a
 * sentinel and looking for the sentinel — in jsdom, which cannot hover, cannot
 * double-click and implements no pointer capture. Every key waived as
 * unrenderable was waived from there, and the waiver for `Table.input` was
 * wrong: a real double-click opens the editor. This is the same probe with a
 * real browser behind it, so a key can be re-attempted rather than believed.
 *
 * Dev-only, like the rest of this page.
 */
function classesFromQuery(search: string): Record<string, string> | null {
  const raw = new URLSearchParams(search).get("classes");
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as Record<string, string>) : null;
  } catch {
    return null;
  }
}

export default function FixtureRoute() {
  const { component: slug = "", fixture: fixtureName = "" } = useParams();
  const component = fromSlug(slug);
  const probeClasses = classesFromQuery(useLocation().search);

  const containerRef = useRef<HTMLDivElement>(null);
  const [actStatus, setActStatus] = useState("none");

  const [state, setState] = useState<{
    resolved: Resolved | null;
    fixture: Fixture | null;
    available: string[];
    ready: boolean;
  }>({ resolved: null, fixture: null, available: [], ready: false });

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const [resolved, fixtures] = await Promise.all([
        loadComponent(component),
        loadFixtures(component),
      ]);
      if (cancelled) return;
      const found = fixtures.find((f) => f.name === fixtureName) ?? null;
      // Set here rather than in the act's own effect, so a fixture with an act
      // never reports the terminal "none" on its way to running one — the
      // browser suites wait on this attribute to know the page is finished.
      setActStatus(found?.act ? "pending" : "none");
      setState({
        resolved,
        fixture: found,
        available: fixtures.map((f) => f.name),
        ready: true,
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [component, fixtureName]);

  useEffect(() => {
    const container = containerRef.current;
    const act = state.fixture?.act;
    if (!container || !act) return;
    let cancelled = false;
    void (async () => {
      // The whole document, not the container: every surface these fixtures
      // open is portalled to the body, so a container-scoped diff would call
      // "open the dropdown" a no-op.
      await quiet();
      const before = document.documentElement.outerHTML;
      try {
        await act(container, browserActTools);
        await browserActTools.settle();
      } catch (error) {
        if (!cancelled) setActStatus(`error: ${(error as Error).message}`);
        return;
      }
      if (cancelled) return;
      setActStatus(document.documentElement.outerHTML === before ? "no-op" : "applied");
    })();
    return () => {
      cancelled = true;
    };
  }, [state.fixture]);

  if (!state.ready) return null;

  if (!state.resolved || !state.fixture) {
    // A miss must be loud: a silent fallback is how the whole suite ended up
    // asserting against the home page.
    return (
      <main data-fixture-error style={{ padding: 24, fontFamily: "monospace" }}>
        <h1>Fixture not found</h1>
        <p>
          {component}/{fixtureName}
        </p>
        <p>
          {state.resolved
            ? `Known fixtures: ${state.available.join(", ") || "(none)"}`
            : "Unknown component — see /__fixtures"}
        </p>
      </main>
    );
  }

  const { Component, props, wrap } = state.resolved;
  const { fixture } = state;
  const element = fixture.render ? (
    fixture.render()
  ) : (
    <Component
      {...props}
      {...fixture.props}
      {...(probeClasses
        ? {
            classes: {
              ...((props as { classes?: Record<string, string> }).classes ?? {}),
              ...((fixture.props as { classes?: Record<string, string> } | undefined)?.classes ??
                {}),
              ...probeClasses,
            },
          }
        : {})}
    >
      {fixture.children as ReactNode}
    </Component>
  );
  const tree = fixture.render
    ? element
    : wrap
      ? wrap(element)
      : fixture.wrap
        ? fixture.wrap(element)
        : element;

  return (
    <main style={{ padding: 24 }} data-fixture-act={actStatus}>
      {/* Outside the marked element on purpose: a page with no h1 trips axe's
          document-level rules, and a component audit scoped to [data-fixture]
          should not then inherit this heading's level.

          Both levels, not just the h1: `heading-order` faults a SKIP, and
          Accordion's trigger defaults to h3 (DEFAULT_HEADING_LEVEL). An h1
          alone left h1 -> h3 and reported all seven Accordion fixtures. The h2
          is the rung between them. */}
      <h1 style={SR_ONLY}>
        {component}/{fixture.name}
      </h1>
      <h2 style={SR_ONLY}>Fixture</h2>
      <div
        ref={containerRef}
        // The identifying attribute the navigation guard asserts on, and the
        // subtree an accessibility audit scopes to.
        data-fixture={`${component}/${fixture.name}`}
        data-fixture-component={component}
        data-fixture-name={fixture.name}
      >
        {tree as ReactNode}
      </div>
    </main>
  );
}

type ReactNode = import("react").ReactNode;
