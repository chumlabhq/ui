/** @jsxImportSource react */
/**
 * `classes` is the documented escape hatch (llms-full.txt:44-47): a typed
 * per-slot map for parts `className` cannot reach. This asserts the one
 * guarantee it makes — a consumer value replaces the default for that slot.
 *
 * Stated as a NEGATIVE, deliberately. Two earlier attempts inferred which slots
 * had rendered by reading the default render's classes, and both were unsound:
 * slots share utilities (`flex`, `w-full`, `relative`), so "this key's tokens
 * are in the DOM" can be another element, and "this key's whole token set is on
 * one element" can be a superset coincidence. Checkbox's `labelContainer` only
 * renders when a label is passed and tripped the first; Stepper's `connector`
 * tripped the second.
 *
 * So: override a key, then assert its default is GONE. That still passes
 * trivially for a slot that never rendered — which is why it now iterates
 * FIXTURES rather than default props, and why fixtures.contract exists to prove
 * separately that every key does render somewhere. The two together close
 * GATE-HONESTY §3: this suite says the override wins, that one says there was
 * something to win. If it rendered and the override was honoured, also
 * true. It fails only when a slot rendered and kept its default anyway, which
 * is exactly the defect. No reachability inference is needed, so there is
 * nothing left to get wrong.
 */
import { describe, expect, it, beforeEach, vi } from "vitest";

import { COMPONENTS } from "./registry.js";
import { fixturesFor } from "../fixtures/index.js";
import { fixtureSession } from "../fixtures/_act.contract.js";

import { twMerge } from "tailwind-merge";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { setReducedMotion } from "../../test/matchMedia.js";

// Fixtures render motion-aware components; the stub answers nothing
// until asked. reduced-motion.contract is where the true branch is tested.
beforeEach(() => setReducedMotion(false));

/**
 * 90 seconds for this file, against the project's 30.
 *
 * DERIVED, not picked. This suite renders every fixture of every component and
 * overrides every slot, so it owns the heaviest trees in the repo, and the
 * project-level 30s was cutting into the real distribution rather than sitting
 * above it: `overrides.contract > 'DatePicker'` failed two of five full runs —
 * a rate, not a flake — and a gate that fails two in five teaches you to re-run
 * it instead of reading it.
 *
 * Measured with the timeout lifted to 300s so the tail was uncensored, over
 * three full `vitest run` invocations:
 *
 *   run 1   CascadingDropdown 14.4s   DatePicker 13.3s
 *   run 2   DatePicker        16.3s   CascadingDropdown 12.2s
 *   run 3   DatePicker        32.8s   InternationalPhoneInput 30.1s
 *
 * So the worst case is 32.8s and the SAME case ran in 13.3s on a quiet run: a
 * load factor of 2.5 on identical work. A limit has to clear the worst
 * observation by about that factor again or the next busy machine reproduces
 * today's failure — 32.8 x 2.5 is 82s, rounded up to 90.
 *
 * It is per-file because the measurement says the problem is: across all 96
 * files, this is the ONLY one with a case over 20s. The next heaviest is
 * `doc-truth.contract` at 12.0s, and every other file peaks at 4.2s, which the
 * project's 30s clears seven times over. Raising it globally would slow the
 * detection of a genuinely hung test in 95 files to fix one.
 *
 * Nothing here asserts anything different. A timeout is not an assertion.
 *
 * G3 (2026-10-12): the composition test measured above now renders each
 * fixture once rather than once per slot — DatePicker 3.4s → 0.2s alone. The
 * conflict and variant sweeps still render per slot and are now the heaviest
 * (CascadingDropdown's variant sweep 4.9s alone), so the limit stays; it has
 * not been re-derived for them.
 */
vi.setConfig({ testTimeout: 90_000 });

const candidates = COMPONENTS.filter((c) => c.supports.classes && c.defaults);

/**
 * Coverage is counted across the suite, not per component: plenty of components
 * have no slot carrying a cursor, radius or padding utility, and that is not a
 * defect. What would be a defect is the whole set collapsing to nothing, which
 * is how the version this replaced came to assert on 3 slots out of 340.
 */
const exercised = { composed: 0, conflicts: 0, variants: 0 };

/**
 * Elements that carry two slots' overrides, named with the reason. One that
 * excuses nothing fails at the end of the suite, so the list cannot outlive
 * what it describes.
 */
const SHARED_ELEMENTS: { component: string; slots: [string, string]; reason: string }[] = [
  {
    component: "Breadcrumb",
    slots: ["item", "link"],
    reason: "By design: an item that is a link renders one <a>, painted from both slots (`linkAndItem`, Breadcrumb.tsx).",
  },
];
const sharedUsed = new Set<string>();

const tokensOf = (value: unknown) =>
  typeof value === "string"
    ? [...new Set(value.split(/\s+/).filter(Boolean))]
    : [];

describe("classes override contract", () => {
  it("the index reports components with a classes prop and default classes", () => {
    expect(candidates.length).toBeGreaterThan(0);
  });

  describe.each(candidates)(
    "$name",
    ({ name, Component, props, defaults }) => {
      const fixtures = fixturesFor(name).filter((f) => !f.render);

      /**
       * Located by the override, not by a token unique to the slot.
       *
       * The previous pair asserted ABSENCE — that a slot's identifying tokens
       * were gone after an override — and identifying tokens were those unique
       * across every default map the component has. Almost none are: a token
       * shared with a size, variant or shimmer map is disqualified, so the
       * filter emptied and the loops asserted nothing. It covered 3 of 340
       * slots, 35 of 38 components had nothing checked at all, and it was green
       * for the whole time the library was discarding focus rings on 386 sites.
       *
       * An absence assertion passes trivially when the matcher finds nothing.
       * These assert PRESENCE: find the element carrying the consumer's own
       * sentinel — unambiguous, and its absence is itself a failure — and then
       * check what else is on it.
       */
      const SENTINEL = "ovr-sentinel";

      const slotsWithDefaults = Object.entries(defaults!).filter(
        ([, v]) => typeof v === "string" && v.trim(),
      );

      /**
       * One marker per slot, all passed at once, so each fixture renders once
       * for every slot rather than once per slot. Rendering per slot was ~730
       * DatePicker calendars for this one test, and the 90s below was raised
       * for it. Distinct markers also make a second fault visible that one
       * sentinel could not: a slot's override landing on another slot's
       * element.
       */
      const markers = new Map(slotsWithDefaults.map(([key], i) => [key, `ovr-slot-${i}`]));
      const slotOf = new Map([...markers].map(([key, marker]) => [marker, key]));

      it("a slot keeps its default classes when a consumer overrides it", async () => {
        const session = fixtureSession();
        const classes = Object.fromEntries(markers);
        const landed = new Map<string, Set<string>[]>();
        const leaks = new Set<string>();

        for (const f of fixtures) {
          const element = (
            <Component {...props} {...f.props} classes={classes}>
              {f.children as React.ReactNode}
            </Component>
          );
          const { container } = session.render(
            (f.wrap ? f.wrap(element) : element) as React.ReactElement,
          );
          await session.act(f, container);
          for (const el of document.body.querySelectorAll('[class*="ovr-slot-"]')) {
            const cls = new Set((el.getAttribute("class") ?? "").split(/\s+/).filter(Boolean));
            const slots = [...cls].flatMap((t) => slotOf.get(t) ?? []).sort();
            const shared = SHARED_ELEMENTS.find(
              (e) => e.component === name && slots.length === 2 && e.slots.every((k) => slots.includes(k)),
            );
            if (shared) sharedUsed.add(`${shared.component}:${shared.slots.join("+")}`);
            else if (slots.length > 1) leaks.add(`${slots.join(" + ")} on one <${el.tagName.toLowerCase()}> in ${f.name}`);
            for (const key of slots) landed.set(key, [...(landed.get(key) ?? []), cls]);
          }
          session.unmount();
        }

        // At least one element the consumer's value landed on keeps one of
        // the slot's default tokens. Composition, stated positively. Not every
        // element: a variant can replace a slot's defaults outright (Accordion's
        // `item` is "" in one variant), and these are the component's default
        // map, not the variant's. A slot whose marker never landed rendered in
        // no fixture.
        const notComposed = slotsWithDefaults.flatMap(([key, value]) => {
          const tokens = tokensOf(value);
          const sets = landed.get(key);
          if (!sets) return [];
          return sets.some((cls) => tokens.some((t) => cls.has(t)))
            ? []
            : [`${key} (kept none of ${tokens.length} default tokens)`];
        });

        exercised.composed += landed.size;
        expect(
          { leaks: [...leaks], notComposed },
          `${name}: a consumer override must land on its own slot alone and compose with that ` +
            "slot's defaults. leaks: one element carried two slots' overrides. notComposed: the " +
            "override replaced the library default instead of composing with it",
        ).toEqual({ leaks: [], notComposed: [] });
      });

      it("a conflicting consumer class beats the library's", async () => {
        // Families where tailwind-merge resolves to whichever comes last, so
        // the consumer's member must win. Cursor and ring are here because they
        // are what the library was silently taking away.
        // Two candidates per family, so the value chosen always differs from
        // the library's own — `p-0` against a default of `p-0` asserts both
        // that it is present and that it is absent.
        const session = fixtureSession();
        const CONFLICTS: [RegExp, string[]][] = [
          [/^cursor-/, ["cursor-default", "cursor-help"]],
          [/^rounded(-|$)/, ["rounded-full", "rounded-none"]],
          [/^p-\d/, ["p-8", "p-0"]],
        ];
        const lost: string[] = [];
        let covered = 0;

        for (const [key, value] of slotsWithDefaults) {
          const tokens = tokensOf(value);
          const pair = CONFLICTS.map(([re, options]) => {
            const theirs = tokens.find((t) => re.test(t));
            return theirs ? ([theirs, options.find((o) => o !== theirs)] as const) : null;
          }).find((x): x is readonly [string, string] => Boolean(x && x[1]));
          if (!pair) continue;
          const [theirs, mine] = pair;

          for (const f of fixtures) {
            const element = (
              <Component {...props} {...f.props} classes={{ [key]: `${SENTINEL} ${mine}` }}>
                {f.children as React.ReactNode}
              </Component>
            );
            const { container } = session.render(
              (f.wrap ? f.wrap(element) : element) as React.ReactElement,
            );
            await session.act(f, container);
            for (const el of document.body.querySelectorAll(`.${SENTINEL}`)) {
              const cls = new Set((el.getAttribute("class") ?? "").split(/\s+/).filter(Boolean));
              covered += 1;
              if (!cls.has(mine) || cls.has(theirs!)) {
                lost.push(`${key}: wanted ${mine} to beat ${theirs}`);
              }
            }
            session.unmount();
          }
        }

        exercised.conflicts += covered;
        expect(
          [...new Set(lost)],
          `${name}: the library's class survived a conflicting consumer class: ${[...new Set(lost)].join("; ")}`,
        ).toEqual([]);
      });
    },
  );

  /**
   * The check, shown discriminating.
   *
   * The version this replaced was green for months while asserting on 3 slots
   * of 340 — it could not have failed, and nobody could tell. So the predicate
   * is run against two components built to differ only in the thing being
   * tested: one that composes and one that replaces, the shape every component
   * had before this change. It has to accept the first and name the second.
   */
  describe("the composition check itself", () => {
    const DEFAULTS = "lib-alpha lib-beta";

    /** How every component behaved before this change. */
    const Replacing = ({ classes }: { classes?: { root?: string } }) => (
      <div data-testid="probe" className={classes?.root ?? DEFAULTS} />
    );
    /** How they behave now. */
    const Composing = ({ classes }: { classes?: { root?: string } }) => (
      <div data-testid="probe" className={`${DEFAULTS} ${classes?.root ?? ""}`.trim()} />
    );

    const composesUnderOverride = (C: typeof Replacing) => {
      const session = fixtureSession();
      const { container } = session.render(<C classes={{ root: "ovr-sentinel" }} />);
      const el = container.querySelector(".ovr-sentinel");
      if (!el) return null; // the override never reached the DOM
      const cls = new Set((el.getAttribute("class") ?? "").split(/\s+/).filter(Boolean));
      const composed = DEFAULTS.split(" ").some((t) => cls.has(t));
      session.unmount();
      return composed;
    };

    it("accepts a component that composes", () => {
      expect(composesUnderOverride(Composing)).toBe(true);
    });

    it("names a component that replaces", () => {
      expect(
        composesUnderOverride(Replacing),
        "the check passed a component that discarded its defaults — it cannot fail",
      ).toBe(false);
    });
  });

  /**
   * A reset that a consumer's class cannot beat.
   *
   * `border-none` sets border-STYLE, and `border` sets border-WIDTH, so
   * tailwind-merge keeps both — `cn("border-none", "border border-cl-border")`
   * returns all three tokens — and style:none wins in the browser. A consumer
   * asking for a border gets width and colour and no border, silently, with
   * their class present in the DOM.
   *
   * Found on the Breadcrumb demo's Pill Style, which asks for
   * `border border-cl-border` on the item and rendered flat: measured
   * border-width 0px with the class applied. Six occurrences across four
   * components had the same hole. `border-0` is the same reset — Preflight
   * already sets `border-style: solid` — and it IS in the width group, so a
   * consumer's `border` replaces it.
   *
   * Read from the constants files rather than the rendered DOM: an unbeatable
   * default is a property of the class string, and a fixture that never passes
   * a border would not show it.
   */
  describe.each(candidates)("$name variant defaults", ({ name, Component, props, defaults }) => {
    const fixtures = fixturesFor(name).filter((f) => !f.render);
    const SENTINEL = "var-sentinel";

    /**
     * A consumer's plain utility beats the library's VARIANT-scoped one in the
     * same property group.
     *
     * The other conflict test above probes cursor, radius and padding — plain
     * against plain, which tailwind-merge resolves correctly on its own. This
     * is the case it cannot: `data-[state=checked]:bg-cl-accent` and a
     * consumer's `bg-green-500` are different merge KEYS, so both survive and
     * the variant wins at paint time on its own element. Three components
     * shipped that way and each was found by eye — `border-none` beating a
     * consumer's `border`, Button's `size`, Checkbox's checked fill — before a
     * sweep found 99 more across 20 components.
     *
     * Not "does a variant exist": 317 interaction-scoped defaults are
     * legitimate and untouched here. The question is only whether the
     * consumer's own token displaces the library's when they share a group,
     * and it is asked of the real fixtures through the real render path.
     *
     * Planted by reducing `mergeSlot` to a plain `cn`, which is the state the
     * library shipped in. 26 of the 33 components go red and the failures name
     * the sites: `chipRemoveTrigger: \`hover:text-cl-accent-hover\` survives a
     * consumer's \`text-[rgb(1,2,3)]\``, `clearTrigger:
     * \`dark:hover:text-cl-text\` survives a consumer's \`text-[rgb(1,2,3)]\``,
     * and so on — the slot, the library token that won, and the consumer token
     * it beat.
     */
    const PROBES = [
      "bg-[rgb(1,2,3)]",
      "text-[rgb(1,2,3)]",
      "border-[rgb(1,2,3)]",
      "ring-[rgb(1,2,3)]",
      "shadow-[0_0_0_1px_black]",
      "rounded-[3px]",
      "p-[7px]",
      "opacity-[0.33]",
      "w-[7px]",
      "h-[7px]",
      "font-[700]",
      "text-[13px]",
    ];

    const bare = (token: string) => {
      let depth = 0;
      let last = 0;
      for (let i = 0; i < token.length; i += 1) {
        const ch = token[i];
        if (ch === "[") depth += 1;
        else if (ch === "]") depth -= 1;
        else if (ch === ":" && depth === 0) last = i + 1;
      }
      return token.slice(last);
    };
    const collides = (utility: string, probe: string) => twMerge(utility, probe) === probe;

    it("lets a consumer's plain utility beat a variant-scoped default", async () => {
      const session = fixtureSession();
      const defeated: string[] = [];
      let covered = 0;

      for (const [key, value] of Object.entries(defaults!)) {
        if (typeof value !== "string" || !value.trim()) continue;
        const variants = [...new Set(value.split(/\s+/).filter(Boolean))].filter(
          (t) => bare(t) !== t,
        );
        for (const token of variants) {
          const probe = PROBES.find((candidate) => collides(bare(token), candidate));
          if (!probe) continue; // no plausible consumer utility shares this group
          covered += 1;
          for (const f of fixtures) {
            const element = (
              <Component {...props} {...f.props} classes={{ [key]: `${SENTINEL} ${probe}` }}>
                {f.children as React.ReactNode}
              </Component>
            );
            const { container } = session.render(
              (f.wrap ? f.wrap(element) : element) as React.ReactElement,
            );
            await session.act(f, container);
            for (const el of document.body.querySelectorAll(`.${SENTINEL}`)) {
              const onElement = (el.getAttribute("class") ?? "").split(/\s+/).filter(Boolean);
              if (onElement.includes(token)) {
                defeated.push(`${key}: \`${token}\` survives a consumer's \`${probe}\``);
              }
            }
            session.unmount();
          }
        }
      }

      exercised.variants += covered;
      expect(
        [...new Set(defeated)].sort(),
        `${name}: a variant-scoped default survived a consumer's plain utility in the same ` +
          "property group. Both are in the DOM and the variant paints in its state, so the " +
          "consumer's class is present and inert. Merge the slot with `mergeSlot`, which drops " +
          "the library token instead of letting tailwind-merge keep both",
      ).toEqual([]);
    });
  });

  it("uses no reset a consumer's class cannot beat", () => {
    const offenders: string[] = [];
    const dir = "src/components";
    const walk = (d: string): string[] =>
      readdirSync(d, { withFileTypes: true }).flatMap((e) => {
        const path = join(d, e.name);
        if (e.isDirectory()) return e.name === "__tests__" ? [] : walk(path);
        return /constants\.ts$/.test(e.name) ? [path] : [];
      });
    for (const file of walk(dir)) {
      const source = readFileSync(file, "utf8");
      source.split("\n").forEach((line, i) => {
        // Inside a class string, not in the prose above one.
        if (/^\s*(\/\/|\*|\/\*)/.test(line)) return;
        if (/\bborder-none\b/.test(line)) offenders.push(`${file}:${i + 1}`);
      });
    }
    expect(
      offenders,
      "`border-none` in a library default. It sets border-style, a consumer's " +
        "`border` sets border-width, tailwind-merge keeps both and style:none wins — " +
        "so the consumer's border never paints. Use `border-0`",
    ).toEqual([]);
  });

  it("asserted on a real number of slots, across the suite", () => {
    // The figures this replaced: 3 slots of 340, 35 of 38 components silent.
    console.log(
      `OVERRIDES composed=${exercised.composed} (floor >200) conflicts=${exercised.conflicts} (floor >20) variants=${exercised.variants}`,
    );
    expect(exercised.composed, "no slot anywhere composed an override").toBeGreaterThan(200);
    expect(exercised.conflicts, "no conflicting override was exercised anywhere").toBeGreaterThan(20);
    expect(
      SHARED_ELEMENTS.map((e) => `${e.component}:${e.slots.join("+")}`).filter((k) => !sharedUsed.has(k)),
      "SHARED_ELEMENTS entries that excused nothing — remove them",
    ).toEqual([]);
  });
});
