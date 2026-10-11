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

import { COMPONENTS, expectRanAsDeclared } from "./registry.js";
import { fixturesFor } from "../fixtures/index.js";
import { fixtureSession } from "../fixtures/_act.contract.js";
import { isMotion } from "../../utils/classLayers.js";
import { setReducedMotion } from "../../test/matchMedia.js";
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
  const session = fixtureSession();
  setReducedMotion(reduced);
  const seen = new Set<string>();
  for (const f of fixtures) {
    const { container } = session.render(
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
    await session.act(f, container);
    for (const token of motionOnElements(document.body)) seen.add(token);
    session.unmount();
  }
  return seen;
};

const motionOf = (tokens: Set<string>) => [...tokens];

describe("reduced motion contract", () => {
  beforeEach(() => setReducedMotion(false));
  const ran = { motion: [] as string[], unstyled: [] as string[] };

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
    // `render` fixtures own their markup; these suites drive the component
    // themselves from fixture props, so there is nothing for them to apply.
    //
    // The `reduce-motion-*` fixtures are excluded too, and the reason is the
    // point of the suite below: they set the `reduceMotion` prop, and
    // `reduce-motion-refused` sets it to `false` deliberately. This suite
    // asserts what the media query alone does, so a fixture that overrides the
    // query would fail it for doing exactly what it was written to do.
    const fixtures = fixturesFor(component.name).filter(
      (f) => !f.render && !f.name.startsWith("reduce-motion-"),
    );
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
      ran.motion.push(component.name);
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
      ran.unstyled.push(component.name);
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

  it("ran the gated tests for every component whose type declares the prop", () => {
    // `declaresMotion` is read from the defaults, not from a props type, so
    // it has no independent count to hold it to; it is printed beside the one
    // that does.
    console.log(
      `CAPABILITY reduced-motion motion (from the defaults) ran=${ran.motion.length} skipped=${candidates.length - ran.motion.length}`,
    );
    expectRanAsDeclared("reduced-motion", "unstyled", candidates, ran.unstyled);
  });
});

/**
 * The `reduceMotion` prop, asserted independently of the media query.
 *
 * The suite above drives `prefers-reduced-motion` and nothing else, so it tests
 * what `"auto"` — the default — defers to. It never sets the prop, and the prop
 * is the half a consumer controls: 16 components accept
 * `reduceMotion?: boolean | "auto"` and not one fixture supplied a value other
 * than the default.
 *
 * Precedence is unambiguous in `useReducedMotion`:
 *
 *     return reduceMotion === "auto" ? prefersReducedMotion : reduceMotion;
 *
 * An explicit boolean overrides the query outright; `"auto"` defers to it. The
 * hook's own documentation says so — "Pass `true`/`false` to override the query,
 * `\"auto\"` (the default) to follow it" — so the intended precedence is not in
 * doubt.
 *
 * What was in doubt was whether the *decorative classes* followed the same rule,
 * because the source did both. Four components resolved prop-vs-query once and
 * used the result everywhere; eight called `useReducedMotion()` with no argument
 * for `motionSafeClasses` and honoured the prop only for behavioural motion. On
 * those eight, `reduceMotion={true}` calmed JS-driven animation while leaving
 * every `transition-*` and `animate-*` utility in place.
 *
 * There is one precedence, and it is the documented one: the prop overrides the
 * query on both paths. Both directions are asserted below, because each fails a
 * different way — `{true}` ignored is a capability that does not work, `{false}`
 * ignored is a capability that works when it should not.
 *
 * The consequence is worth naming: `reduceMotion={false}` animates for a user
 * who has asked their operating system for less motion. That is an author
 * override of a stated accessibility preference. It is what the hook documents
 * and what four components already did, so it is asserted rather than quietly
 * changed — but it is a policy decision, not a technical one, and it is the
 * place to revisit if the answer should be "the prop may lower motion and may
 * not raise it".
 */
describe("the reduceMotion prop", () => {
  // Linked to the fixtures rather than to a list: a component whose motion
  // fixtures are removed drops out of this suite loudly, via the lookup below.
  const withMotionProp = candidates.filter((c) =>
    fixturesFor(c.name).some((f) => f.name === "reduce-motion-forced"),
  );

  it("covers every component that accepts the prop", () => {
    expect(withMotionProp.length).toBe(16);
  });

  /**
   * Components whose motion fixture emits nothing to calm, so the assertions
   * below cannot fail for them.
   *
   * Named rather than skipped. The fixtures are derived from each component's
   * simplest state, and for five that state has no animation in it — Drawer's
   * closed panel, Switch's resting track. That makes their pair of assertions
   * vacuous, which is worth seeing: it is the difference between "honours the
   * prop" and "was never asked to".
   */
  it("names the components whose motion fixture proves nothing", async () => {
    const vacuous: string[] = [];
    for (const component of withMotionProp) {
      const refused = fixturesFor(component.name).filter(
        (f) => !f.render && f.name === "reduce-motion-refused",
      );
      const moving = await tokensUnder(component, refused, false);
      if (moving.size === 0) vacuous.push(component.name);
    }
    // A ratchet, not a target: this list may shrink as fixtures reach richer
    // states, and must not grow without someone noticing.
    expect(vacuous.sort()).toEqual([
      "CountryFlag",
      "Drawer",
      "ResizablePanel",
      "Stepper",
      "Switch",
    ]);
  });

  describe("self-check", () => {
    it("would catch a component that ignored the prop", () => {
      // The shape of the bug: a component that reads only the media query.
      const ignoresProp = (_prop: boolean | "auto", query: boolean) => query;
      const honoursProp = (prop: boolean | "auto", query: boolean) =>
        prop === "auto" ? query : prop;

      // With the query saying "no preference", only the honouring one stops.
      expect(ignoresProp(true, false)).toBe(false);
      expect(honoursProp(true, false)).toBe(true);
      // And on disagreement the honouring one keeps motion where the other cuts it.
      expect(ignoresProp(false, true)).toBe(true);
      expect(honoursProp(false, true)).toBe(false);
    });
  });

  describe.each(withMotionProp)("$name", (component) => {
    const fixtures = fixturesFor(component.name).filter((f) => !f.render);
    const forced = fixtures.filter((f) => f.name === "reduce-motion-forced");
    const refused = fixtures.filter((f) => f.name === "reduce-motion-refused");
    const waived = new Set(MOTION_LEAKS[component.name] ?? []);
    const surviving = (tokens: Set<string>) =>
      [...tokens].filter((t) => !waived.has(t));

    it("stops animating on the prop alone, with the query saying otherwise", async () => {
      // The query is explicitly "no preference" here, so anything that stops
      // can only have stopped because of the prop.
      const still = surviving(await tokensUnder(component, forced, false));
      expect(
        still,
        `${component.name} kept animating under reduceMotion={true} while the media query said no preference: ${still.join(" ")}`,
      ).toEqual([]);
    });

    it("stops animating on the prop and the query together", async () => {
      const still = surviving(await tokensUnder(component, forced, true));
      expect(still).toEqual([]);
    });

    it("keeps the prop's answer when it disagrees with the query", async () => {
      // `reduceMotion={false}` against a media query asking for reduced motion.
      // The prop overrides, per `useReducedMotion`, so the render must be the
      // same as it is with no preference set — the query must not reach in.
      const underDisagreement = await tokensUnder(component, refused, true);
      const underAgreement = await tokensUnder(component, refused, false);
      expect(
        [...underDisagreement].sort(),
        `${component.name} let the media query overrule an explicit reduceMotion={false}`,
      ).toEqual([...underAgreement].sort());
    });
  });
});
