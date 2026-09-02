/** @jsxImportSource react */
/**
 * ADR 002 R4 — the replacement for the 97 deleted-as-state keys.
 *
 * Every one of those keys names a state a consumer can target today. After Task 3
 * they are gone, and the only way to reach the same element is a data attribute.
 * This suite is what makes that safe: the requirement list is DERIVED from
 * `docs/adr/002-state-attributes.json`, which is itself derived from the
 * `deleted-as-state` rows of the migration table. Nothing here is hand-written,
 * so a key cannot be deleted in Task 3 without its replacement being asserted
 * here first.
 *
 * It asserts three things per requirement:
 *   1. the attribute reaches the DOM on the right part, in some fixture state
 *   2. every documented value is reachable
 *   3. a boolean attribute is ABSENT somewhere — an attribute that is always on
 *      carries no information and would pass a presence-only check
 */
import { describe, expect, it, beforeEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { COMPONENTS } from "./registry";
import { fixturesFor } from "../fixtures";
import { setReducedMotion } from "../../test/matchMedia";

beforeEach(() => setReducedMotion(false));

interface Requirement {
  component: string;
  part: string;
  attribute: string;
  values: string[] | null;
  fromKeys: string[];
  /** Absent = asserted here. See `$comment_tiers` in the spec. */
  tier?: "browserTier" | "blocked";
  tierReason?: string;
  assertedIn?: string;
  blockedOn?: string;
}
const SPEC = JSON.parse(
  readFileSync(resolve(process.cwd(), "docs/adr/002-state-attributes.json"), "utf8"),
) as { requirements: Requirement[] };

/**
 * Where each part lives in the rendered DOM. Parts are not yet named in the
 * markup — that is Task 3 — so until then they are located by role or by the
 * element the component actually renders. Wrong selector, false failure, so
 * every one of these was read off a rendered fixture rather than guessed.
 */
/** Components whose validation feedback Amendment B merges into one part. */
const MESSAGE_COMPONENTS = [
  ...new Set(
    (
      JSON.parse(
        readFileSync(resolve(process.cwd(), "docs/adr/002-state-attributes.json"), "utf8"),
      ) as { requirements: { component: string; part: string }[] }
    ).requirements.filter((r) => r.part === "message").map((r) => r.component),
  ),
];

const SELECTOR: Record<string, string> = {
  // Breadcrumb marks the crumb on the <a>, Pagination on the page <button>, so
  // both are part of `item` even though neither is a list element.
  "item": '[role="option"], [role="menuitem"], [role="menuitemcheckbox"], [role="tab"], [role="gridcell"], li, tr, nav a, nav span[data-state], nav button[aria-label^="Page"]',
  "subItem": '[role="option"]',
  "control": '[role="switch"], [role="checkbox"], input[type="checkbox"] + span, span[data-state], [data-state]',
  "thumb": '[role="slider"], [role="switch"] span, span[data-state]',
  "input": "input",
  "itemIndicator": "[data-status], svg",
  // Stepper's label wrapper is a div carrying data-align, not a span.
  "itemText": "span[data-status], span[data-state], div[data-align], span",
  "itemIcon": "span[data-status], span[data-state], svg",
  "description": "[data-status]",
  "separator": "[data-next-status], [data-status]",
  "count": "span",
  "marker": "[data-state]",
  "clockDisplay": "[data-state]",
  "periodButton": "button",
  "clockNumber": "[data-selected], [data-disabled]",
  "presetTrigger": "button",
  "pinButton": "button",
  "countrySelect.item": '[role="option"]',
  // The validation message has no stable role — half the success elements carry
  // none — so the union includes both attributes. That is not circular: each
  // fixture renders exactly one of the two messages, so the OTHER attribute's
  // absence is still measured on a real element that could have carried it.
  "message": '[role="alert"], [role="status"], [data-invalid], [data-valid]',
};

/** Every attribute value seen on any element matching `part`, across all fixtures. */
const collect = async (componentName: string, part: string, attribute: string) => {
  const entry = COMPONENTS.find((c) => c.name === componentName);
  if (!entry) return { seen: new Set<string>(), absentSomewhere: false, fixtures: 0 };
  const selector = SELECTOR[part] ?? "*";
  const seen = new Set<string>();
  let absentSomewhere = false;
  let fixtures = 0;

  for (const f of fixturesFor(componentName).filter((x) => !x.render)) {
    const element = (
      <entry.Component {...entry.props} {...f.props}>
        {f.children as React.ReactNode}
      </entry.Component>
    );
    const { container } = render(
      (f.wrap ? f.wrap(element) : entry.wrap ? entry.wrap(element) : element) as React.ReactElement,
    );
    if (f.act) await f.act(container);
    fixtures += 1;

    const nodes = Array.from(document.body.querySelectorAll(selector));
    for (const n of nodes) {
      const v = n.getAttribute(attribute);
      if (v !== null) seen.add(v);
      // Per ELEMENT, not per fixture: a boolean state is meaningful when some
      // matching element lacks it, and the interesting case is a disabled
      // option sitting beside enabled ones in the SAME fixture. Checking this
      // per fixture asked a weaker question and passed things it should not.
      else absentSomewhere = true;
    }
    cleanup();
  }
  return { seen, absentSomewhere, fixtures };
};

describe("state attributes contract", () => {
  /**
   * The probe every gate on this branch owes: a component that stops emitting an
   * attribute must be caught. Without it, "the attribute was found" and "the
   * selector matched nothing" produce the same green.
   */
  describe("self-check", () => {
    const Emitting = () => (
      <ul>
        <li role="option" data-selected="true">on</li>
        <li role="option">off</li>
      </ul>
    );
    const Regressed = () => (
      <ul>
        <li role="option">on</li>
        <li role="option">off</li>
      </ul>
    );
    const scan = (Node: () => React.ReactElement, attribute: string) => {
      render(<Node />);
      const seen = new Set<string>();
      for (const n of Array.from(document.body.querySelectorAll(SELECTOR["item"]))) {
        const v = n.getAttribute(attribute);
        if (v !== null) seen.add(v);
      }
      cleanup();
      return seen;
    };

    it("sees the attribute when it is emitted", () => {
      expect(scan(Emitting, "data-selected").size).toBeGreaterThan(0);
    });

    it("catches a component that stops emitting it", () => {
      const seen = scan(Regressed, "data-selected");
      // This is the exact assertion the per-requirement test makes. If it did
      // not fail here, every green below would be meaningless.
      expect(seen.size).toBe(0);
      expect(() =>
        expect(seen.size, "data-selected never reaches the part").toBeGreaterThan(0),
      ).toThrow();
    });

    it("catches an attribute that is always on, which carries no state", () => {
      const AlwaysOn = () => (
        <ul>
          <li role="option" data-selected="true">a</li>
          <li role="option" data-selected="true">b</li>
        </ul>
      );
      render(<AlwaysOn />);
      const nodes = Array.from(document.body.querySelectorAll(SELECTOR["item"]));
      const absentSomewhere = nodes.some((n) => n.getAttribute("data-selected") === null);
      cleanup();
      expect(absentSomewhere).toBe(false);
    });
  });

  /**
   * Amendment B collapses `error` and `success` into one `message` part. That is
   * only sound while at most one of the two can render: a component showing both
   * at once would need two parts after all, and one key could not style them
   * differently.
   *
   * Every component guards the success branch with `!error`, but the fixtures
   * never set both flags, so nothing exercised the guard. This forces the
   * conflict rather than observing its absence.
   */
  describe.each(MESSAGE_COMPONENTS)("%s message", (name) => {
    it("renders one validity state, never both", async () => {
      const entry = COMPONENTS.find((c) => c.name === name);
      if (!entry) throw new Error(`${name} is not in the registry`);
      const base = fixturesFor(name).find((f) => f.name === "error");
      if (!base) throw new Error(`${name} has no error fixture to build the conflict from`);

      const Component = entry.Component;
      const element = (
        <Component
          {...entry.props}
          {...(base.props as Record<string, unknown>)}
          error
          errorMessage="Invalid"
          success
          successMessage="Valid"
        >
          {base.children as React.ReactNode}
        </Component>
      );
      render(
        (base.wrap ? base.wrap(element) : entry.wrap ? entry.wrap(element) : element) as React.ReactElement,
      );

      // Scoped by message text, not by attribute alone: most roots also carry
      // data-valid, and this assertion is about the message part.
      const messages = (attribute: string, text: string) =>
        Array.from(document.body.querySelectorAll(`[${attribute}]`)).filter(
          (el) => el.textContent === text,
        );
      const invalid = messages("data-invalid", "Invalid");
      const valid = messages("data-valid", "Valid");
      expect(
        invalid.length,
        `${name} shows no invalid message when error and success are both set`,
      ).toBeGreaterThan(0);
      expect(
        valid.length,
        `${name} renders both validity states at once, so one \`message\` part cannot style them apart`,
      ).toBe(0);
      cleanup();
    });
  });

  it("the requirement list is derived, not hand-written", () => {
    expect(SPEC.requirements.length).toBeGreaterThan(60);
    for (const r of SPEC.requirements) {
      expect(r.fromKeys.length, `${r.component}.${r.part} cites no source key`).toBeGreaterThan(0);
    }
  });

  const JSDOM_TIER = SPEC.requirements.filter((r) => !r.tier);
  const BROWSER_TIER = SPEC.requirements.filter((r) => r.tier === "browserTier");
  const BLOCKED = SPEC.requirements.filter((r) => r.tier === "blocked");

  /**
   * Without this, `browserTier` is a waiver with a nicer name: a requirement
   * could be moved out of this suite and asserted nowhere at all.
   */
  it.each(BROWSER_TIER.map((r) => [`${r.component} ${r.part} ${r.attribute}`, r] as const))(
    "%s is asserted in the browser tier",
    (_label, r) => {
      expect(r.assertedIn, "browserTier with no spec named").toBeTruthy();
      const spec = readFileSync(resolve(process.cwd(), r.assertedIn!), "utf8");
      expect(
        spec.includes(r.attribute),
        `${r.assertedIn} does not assert ${r.attribute}. A requirement moved out of the jsdom tier and into no tier at all is a waiver.`,
      ).toBe(true);
    },
  );

  /**
   * The inverse assertion: a blocked requirement that starts passing has been
   * unblocked, and the row must be reclassified rather than left as folklore.
   */
  it.each(BLOCKED.map((r) => [`${r.component} ${r.part} ${r.attribute}`, r] as const))(
    "%s is still blocked",
    async (_label, r) => {
      expect(r.blockedOn, "blocked with no phase named").toBeTruthy();
      const { seen } = await collect(r.component, r.part, r.attribute);
      expect(
        seen.size,
        `${r.attribute} now reaches ${r.component} ${r.part}. It was blocked on ${r.blockedOn}; move it back into the asserted tier.`,
      ).toBe(0);
    },
  );

  describe.each(JSDOM_TIER.map((r) => [`${r.component} ${r.part} ${r.attribute}`, r] as const))(
    "%s",
    (_label, r) => {
      it("reaches the DOM, with every documented value, and is absent somewhere", async () => {
        const { seen, absentSomewhere, fixtures } = await collect(r.component, r.part, r.attribute);
        expect(fixtures, `${r.component} has no static fixture`).toBeGreaterThan(0);

        expect(
          seen.size,
          `${r.attribute} never reaches ${r.component}'s ${r.part}. It replaces ` +
            `${r.fromKeys.join(", ")}, which Task 3 deletes — without it that state ` +
            `becomes untargetable.`,
        ).toBeGreaterThan(0);

        for (const v of r.values ?? []) {
          expect(
            [...seen],
            `${r.attribute}="${v}" is documented but no fixture produces it on ${r.component}'s ${r.part}`,
          ).toContain(v);
        }

        if (!r.values) {
          expect(
            absentSomewhere,
            `${r.attribute} is present on every ${r.component} ${r.part} in every fixture. ` +
              `An attribute that is always on carries no state.`,
          ).toBe(true);
        }
      });
    },
  );
});
