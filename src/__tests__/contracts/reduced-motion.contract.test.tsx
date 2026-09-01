/** @jsxImportSource react */
/**
 * The gate GATE-HONESTY §5.2 found inert.
 *
 * `src/test/setup.ts` used to answer `matches: false` for every media query, so
 * a component that honours `prefers-reduced-motion` and one that ignores it
 * rendered identically and README's claim could not be checked. The stub now
 * answers nothing until asked, and this suite asks it both ways.
 *
 * Both directions matter. Asserting only that motion disappears would pass for
 * a component that never animates at all, which is most of the value gone — so
 * every component is required to animate when motion is allowed before it is
 * required to stop when it is not.
 */
import { describe, expect, it, beforeEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { COMPONENTS } from "./registry";
import { fixturesFor } from "../fixtures";
import { isMotion } from "../../utils/classLayers";
import { setReducedMotion } from "../../test/matchMedia";
import waivers from "../../../docs/adr/002-unrenderable-keys.json";

/**
 * Motion that survives because it is written as a literal at a JSX site, or
 * comes from a nested component the parent does not yet pass `unstyled` to.
 * Both are off-limits here: literals belong to constants.contract's ratcheting
 * baseline, propagation is GATE-HONESTY §4. Listed so this suite names them
 * rather than hiding them, and the staleness check below stops the list rotting.
 */
const MOTION_LEAKS = (waivers as { motionLeaks: Record<string, string[]> })
  .motionLeaks;

const candidates = COMPONENTS.filter((c) => fixturesFor(c.name).length > 0);

/**
 * Motion tokens on elements that have NOT opted out in CSS.
 *
 * An element carrying `motion-reduce:transition-none` has its transitions
 * switched off by the media query itself, so its `transition-opacity` is not a
 * violation — reading tokens as a flat set would fail the idiomatic fix.
 */
const motionOnElements = (root: ParentNode): string[] => {
  const out = new Set<string>();
  for (const el of [
    ...(root instanceof Element ? [root] : []),
    ...Array.from(root.querySelectorAll("*")),
  ]) {
    const cls = el.getAttribute("class");
    if (!cls) continue;
    const tokens = cls.split(/\s+/).filter(Boolean);
    const optedOut = tokens.some((t) =>
      /^motion-reduce:(transition-none|animate-none)$/.test(t),
    );
    if (optedOut) continue;
    for (const t of tokens) if (isMotion(t)) out.add(t);
  }
  return [...out];
};

/** Every class token a component's fixtures produce under one motion setting. */
const tokensUnder = async (
  { Component, props }: (typeof candidates)[number],
  fixtures: ReturnType<typeof fixturesFor>,
  reduced: boolean,
  extraProps: Record<string, unknown> = {},
) => {
  setReducedMotion(reduced);
  const seen = new Set<string>();
  for (const f of fixtures) {
    const { container } = render(
      (f.wrap ? f.wrap(
        <Component {...props} {...f.props} {...extraProps}>
        {f.children as React.ReactNode}
      </Component>
      ) : (
        <Component {...props} {...f.props} {...extraProps}>
        {f.children as React.ReactNode}
      </Component>
      )) as React.ReactElement,
    );
    if (f.act) await f.act(container);
    for (const token of motionOnElements(document.body)) seen.add(token);
    cleanup();
  }
  return seen;
};

const motionOf = (tokens: Set<string>) => [...tokens];

describe("reduced motion contract", () => {
  beforeEach(() => setReducedMotion(false));

  it("the stub refuses to answer a query no test has declared", () => {
    // If this regresses, every assertion below silently becomes "no preference"
    // again and the suite stops meaning anything.
    expect(() => window.matchMedia("(min-width: 900px)")).toThrow(
      /has not said what it answers/,
    );
  });

  describe("classifier", () => {
    it("counts what moves", () => {
      expect(isMotion("transition-colors")).toBe(true);
      expect(isMotion("duration-200")).toBe(true);
      expect(isMotion("animate-pulse")).toBe(true);
      expect(isMotion("ease-out")).toBe(true);
    });

    it("does not count the opt-outs", () => {
      // `transition-none` switches motion off, and a motion-safe/-reduce
      // variant is gated by the media query in CSS already. Treating either as
      // a violation would fail the idiomatic fix.
      expect(isMotion("transition-none")).toBe(false);
      expect(isMotion("motion-safe:transition-all")).toBe(false);
      expect(isMotion("motion-reduce:transition-none")).toBe(false);
    });

    it("leaves static geometry alone", () => {
      // Stripping these would move a centred element rather than calm it.
      expect(isMotion("-translate-y-1/2")).toBe(false);
      expect(isMotion("rotate-180")).toBe(false);
      expect(isMotion("scale-95")).toBe(false);
      expect(isMotion("transform")).toBe(false);
    });
  });

  describe.each(candidates)("$name", (component) => {
    const fixtures = fixturesFor(component.name);
    // Whether this component claims to animate at all, read from its own
    // defaults. A component with no motion in its constants is not required to
    // produce any — but one that declares motion must actually emit it, or the
    // "stops animating" assertion below could never fail.
    const declaresMotion = Object.values(component.defaults ?? {}).some((value) => {
      if (typeof value !== "string") return false;
      const tokens = value.split(/\s+/).filter(Boolean);
      // A slot that pairs its transition with a CSS opt-out is already
      // compliant, so it does not oblige the component to emit anything.
      if (tokens.some((t) => /^motion-reduce:(transition-none|animate-none)$/.test(t)))
        return false;
      return tokens.some(isMotion);
    });

    it.runIf(declaresMotion)("animates when motion is allowed", async () => {
      const moving = motionOf(await tokensUnder(component, fixtures, false));
      expect(
        moving.length,
        `${component.name} declares motion in its defaults but emits none, so the assertion below cannot fail`,
      ).toBeGreaterThan(0);
    });

    const waived = new Set(MOTION_LEAKS[component.name] ?? []);

    it("stops animating when the user asks it to", async () => {
      const still = motionOf(await tokensUnder(component, fixtures, true));
      expect(
        still.filter((t) => !waived.has(t)),
        `${component.name} kept animating under prefers-reduced-motion: ${still.join(" ")}`,
      ).toEqual([]);
    });

    it.runIf(component.supports.unstyled)(
      "composes with unstyled rather than fighting it",
      async () => {
      // Motion is decorative under ADR 001, so `unstyled` removes it too. The
      // two must not depend on each other: either alone, or both together, must
      // leave nothing moving.
      const unstyledOnly = motionOf(
        await tokensUnder(component, fixtures, false, { unstyled: true }),
      );
      const both = motionOf(
        await tokensUnder(component, fixtures, true, { unstyled: true }),
      );
      expect(
        unstyledOnly.filter((t) => !waived.has(t)),
        "unstyled alone left animation behind",
      ).toEqual([]);
      expect(
        both.filter((t) => !waived.has(t)),
        "unstyled + reduced motion left animation behind",
      ).toEqual([]);

      // Checked against every mode this suite measures: Toast's literal is
      // gated on `!isUnstyled`, so it leaks under reduced motion but not under
      // unstyled, and a narrower check would call the entry stale.
      const reduced = motionOf(await tokensUnder(component, fixtures, true));
      const anywhere = new Set([...unstyledOnly, ...both, ...reduced]);
      const stale = [...waived].filter((t) => !anywhere.has(t));
      expect(
        stale,
        `motionLeaks entries that no longer leak — remove them from 002-unrenderable-keys.json: ${stale.join(" ")}`,
      ).toEqual([]);
      },
    );
  });
});
