import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Fixture } from "../../__tests__/fixtures/types";
import { fromSlug, loadComponent, loadFixtures, type Resolved } from "./lazyRegistry";

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
 * DEV ONLY. App.tsx imports the subtree inside a ternary on import.meta.env.DEV,
 * so a production build drops the branch and the chunk;
 * scripts/assert-fixture-bundle.mjs asserts it never reaches the package.
 */
/** Reachable by a screen reader, invisible on the page. */
const SR_ONLY = {
  position: "absolute",
  width: 1,
  height: 1,
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  whiteSpace: "nowrap",
} as const;

export default function FixtureRoute() {
  const { component: slug = "", fixture: fixtureName = "" } = useParams();
  const component = fromSlug(slug);

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
      setState({
        resolved,
        fixture: fixtures.find((f) => f.name === fixtureName) ?? null,
        available: fixtures.map((f) => f.name),
        ready: true,
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [component, fixtureName]);

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
    <Component {...props} {...fixture.props}>
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
    <main style={{ padding: 24 }}>
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
