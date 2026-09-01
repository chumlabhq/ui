/** @jsxImportSource react */
/**
 * The class of bug `ssr.contract` structurally cannot see.
 *
 * That suite calls `renderToString` and asserts it does not throw, which proves
 * a component survives the server but says nothing about whether the client
 * then renders the same thing. AUDIT-GAP §2.5 recorded exactly that gap:
 * `useReducedMotion` read `matchMedia` from a `useState` initializer, so a user
 * with the preference set got server markup saying "animated" and a first
 * client render saying "not" — a mismatch React patches silently in production
 * and warns about in development. Task 2 propagated that hook to 34 components
 * before it was converted.
 *
 * So: render each fixture to a string as a server would, hydrate that markup
 * with the preference ON, and fail on any recoverable hydration error. React 19
 * reports these through `onRecoverableError` rather than console.error — it
 * recovers from a text mismatch silently — so the spy alone would have found
 * nothing, which the self-check below exists to prove. The preference is
 * the axis that matters — with it off there is nothing for the client to
 * disagree with, which is why the previous stub's blanket `false` hid this too.
 */
import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { renderToString } from "react-dom/server";
import { hydrateRoot } from "react-dom/client";
import { act } from "@testing-library/react";
import { COMPONENTS } from "./registry";
import { fixturesFor } from "../fixtures";
import { setReducedMotion } from "../../test/matchMedia";
import waivers from "../../../docs/adr/002-unrenderable-keys.json";

/**
 * Known mismatches, by component and fixture. Recorded rather than fixed when
 * the cause is out of scope for the phase that found it. The staleness check
 * below fails if an entry stops mismatching, so the list can only shrink.
 */
const KNOWN = (waivers as {
  hydrationMismatches: Record<string, Record<string, string>>;
}).hydrationMismatches;

const candidates = COMPONENTS.filter((c) => fixturesFor(c.name).length > 0);

const HYDRATION_WARNING =
  /hydrat|did not match|server (?:rendered )?html|text content does not match/i;

/** Both channels React uses: recoverable errors, plus any console warning. */
let errors: string[] = [];
let spy: ReturnType<typeof vi.spyOn>;

const hydrate = async (container: HTMLElement, tree: React.ReactElement) => {
  let root: ReturnType<typeof hydrateRoot> | undefined;
  await act(async () => {
    root = hydrateRoot(container, tree, {
      onRecoverableError: (error) => errors.push(String(error)),
    });
  });
  return root as ReturnType<typeof hydrateRoot> | undefined;
};

beforeEach(() => {
  setReducedMotion(false);
  errors = [];
  spy = vi.spyOn(console, "error").mockImplementation((...args: unknown[]) => {
    errors.push(args.map(String).join(" "));
  });
});

afterEach(() => spy.mockRestore());

describe("hydration contract", () => {
  it("detection sees a real hydration mismatch", async () => {
    // Without this, a suite that never warns is indistinguishable from one
    // whose detection is broken — the failure mode this whole tier exists for.
    const Mismatch = ({ text }: { text: string }) => <div>{text}</div>;
    const container = document.createElement("div");
    container.innerHTML = renderToString(<Mismatch text="server" />);
    document.body.appendChild(container);
    const root = await hydrate(container, <Mismatch text="client" />);
    expect(
      errors.some((e) => HYDRATION_WARNING.test(e)),
      `no hydration signal reached the test — detection is broken, not the components. Saw: ${JSON.stringify(errors)}`,
    ).toBe(true);
    await act(async () => root?.unmount());
    document.body.removeChild(container);
  });

  describe.each(candidates)("$name", (component) => {
    const fixtures = fixturesFor(component.name);
    const { Component, props, wrap } = component;

    const waived = KNOWN[component.name] ?? {};

    it("hydrates without a mismatch when reduced motion is on", async () => {
      const failures: string[] = [];
      const stale: string[] = [];

      for (const fixture of fixtures) {
        // The server does not know the preference; the client does. That
        // asymmetry is the bug, so it is what the test reproduces.
        setReducedMotion(false);
        const element = (
          <Component {...props} {...fixture.props}>
            {fixture.children as React.ReactNode}
          </Component>
        );
        const tree = (
          wrap ? wrap(element) : fixture.wrap ? fixture.wrap(element) : element
        ) as React.ReactElement;

        let html = "";
        try {
          html = renderToString(tree);
        } catch {
          // ssr.contract owns "does it render on a server at all".
          continue;
        }

        const container = document.createElement("div");
        container.innerHTML = html;
        document.body.appendChild(container);

        setReducedMotion(true);
        errors = [];
        const root = await hydrate(container, tree);

        const mismatched = errors.filter((e) => HYDRATION_WARNING.test(e));
        if (mismatched.length && !(fixture.name in waived)) {
          failures.push(`${fixture.name}: ${mismatched[0]}`);
        }
        if (!mismatched.length && fixture.name in waived) stale.push(fixture.name);

        await act(async () => {
          root?.unmount();
        });
        document.body.removeChild(container);
      }

      expect(
        failures,
        `hydration mismatched under prefers-reduced-motion:\n${failures.join("\n")}`,
      ).toEqual([]);
      expect(
        stale,
        `hydrationMismatches entries that no longer mismatch — remove them from 002-unrenderable-keys.json: ${stale.join(", ")}`,
      ).toEqual([]);
    });
  });
});
