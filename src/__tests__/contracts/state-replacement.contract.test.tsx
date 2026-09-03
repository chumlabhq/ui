/** @jsxImportSource react */
/**
 * ADR 002 Task 3b — the deletion gate for the 97 `deleted-as-state` keys.
 *
 * `state-attributes.contract` proves the attribute reaches the DOM. That is not
 * the same claim as "a consumer can still style this state", which is what the
 * deletion actually costs them. The route has three links and each can break on
 * its own: the consumer's variant class has to reach the element, the element
 * has to carry the attribute in that state, and the value has to survive `cn()`
 * and tailwind-merge without the default eating it.
 *
 * So each case renders the fixtures with a real override on the SURVIVING key —
 * `classes={{ item: "data-[highlighted]:bg-cl-probe" }}` — and requires the
 * probe to land on an element that is in the state. One case per deleted key,
 * derived from the migration table, so a key cannot be deleted without its
 * replacement being demonstrated first.
 *
 * A key whose route cannot be demonstrated is reported, not deleted.
 */
import { describe, expect, it, beforeEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { COMPONENTS } from "./registry";
import { fixturesFor } from "../fixtures";
import { setReducedMotion } from "../../test/matchMedia";
import { SELECTOR } from "./partSelectors";

beforeEach(() => setReducedMotion(false));

const read = <T,>(f: string): T => JSON.parse(readFileSync(resolve(process.cwd(), f), "utf8")) as T;

interface Row { component: string; key: string; outcome: string; to: string | null; note: string }
interface Requirement {
  component: string; part: string; attribute: string; values: string[] | null;
  fromKeys: string[]; tier?: "browserTier" | "blocked"; assertedIn?: string; blockedOn?: string;
}
const TABLE = read<{ rows: Row[] }>("docs/adr/002-key-migration.json");
const SPEC = read<{
  requirements: Requirement[];
  cssPseudoReplacements: { component: string; part: string; key: string; replacement: string }[];
}>("docs/adr/002-state-attributes.json");

const DELETED = TABLE.rows.filter((r) => r.outcome === "deleted-as-state");

/** The requirement that carries a deleted key's replacement attribute. */
const requirementFor = (component: string, key: string) =>
  SPEC.requirements.find((r) => r.component === component && r.fromKeys.includes(key));
const pseudoFor = (component: string, key: string) =>
  SPEC.cssPseudoReplacements.find((r) => r.component === component && r.key === key);

/**
 * `data-state=active` -> "active"; a bare attribute -> null. The note is only
 * trusted when it names the same attribute the requirement carries: DatePicker's
 * `dayToday` note reads `data-state=active (today)` while its requirement is
 * `data-today`, and reading the value across would probe `data-today="active"`.
 */
const valueFor = (note: string, attribute: string): string | null => {
  const m = note.match(/^(data-[\w-]+)=([\w-]+)/);
  return m && m[1] === attribute ? m[2] : null;
};

const PROBE = "bg-cl-probe";

/**
 * The class list is not the claim. Under the deleted keys a consumer's value
 * REPLACED the default for that slot; the replacement route is only equivalent
 * if their value still paints. A class can be present and lose.
 *
 * So each case renders, then builds a stylesheet in the order least favourable
 * to the consumer — their rule first, every rival rule on the same element
 * after it, at equal specificity — and reads the computed value back. The
 * consumer's value can only win there by having displaced the rivals in the
 * merge, never by source order.
 */
const PROBE_RGB = "rgb(1, 2, 3)";
const RIVAL_RGB = "rgb(9, 9, 9)";

/** Which CSS property a probe should contest, and the two values to tell apart. */
const PROPERTIES = {
  bg: { utility: "bg-cl-probe", css: "background-color", mine: "rgb(1,2,3)", rival: "rgb(9,9,9)", read: (s: CSSStyleDeclaration) => s.backgroundColor, win: PROBE_RGB },
  opacity: { utility: "opacity-[0.123]", css: "opacity", mine: "0.123", rival: "0.9", read: (s: CSSStyleDeclaration) => s.opacity, win: "0.123" },
  cursor: { utility: "cursor-crosshair", css: "cursor", mine: "crosshair", rival: "progress", read: (s: CSSStyleDeclaration) => s.cursor, win: "crosshair" },
} as const;
type PropertyKey = keyof typeof PROPERTIES;

const escapeClass = (name: string) => name.replace(/[^a-zA-Z0-9_-]/g, (c) => `\\${c}`);

/** `data-[state=active]` -> `[data-state="active"]`; `data-[selected]` -> `[data-selected]`. */
const attributeSelector = (variant: string) => {
  const inner = variant.slice("data-[".length, -1);
  const [attr, value] = inner.split("=");
  return value ? `[data-${attr.replace(/^data-/, "")}="${value}"]` : `[data-${attr}]`;
};

/**
 * Returns the computed value of `property` on `el` once the consumer's rule and
 * every rival rule for the same variant are installed, consumer first.
 */
const paintedValue = (el: Element, variant: string, probeClass: string, property: PropertyKey) => {
  const spec = PROPERTIES[property];
  const sel = attributeSelector(variant);
  const rivals = Array.from(el.classList).filter(
    (t) => t !== probeClass && t.startsWith(`${variant}:`) && t.slice(variant.length + 1).startsWith(`${property}-`),
  );
  const style = document.createElement("style");
  style.textContent = [
    `.${escapeClass(probeClass)}${sel}{${spec.css}:${spec.mine}}`,
    ...rivals.map((t) => `.${escapeClass(t)}${sel}{${spec.css}:${spec.rival}}`),
  ].join("\n");
  document.head.appendChild(style);
  const painted = spec.read(getComputedStyle(el as HTMLElement));
  style.remove();
  return { painted, rivals, wins: spec.win };
};

/** The property a consumer would have to contest, given what the default carries. */
const contestedProperty = (defaultValue: string, variant: string): PropertyKey => {
  for (const token of defaultValue.split(/\s+/)) {
    if (!token.startsWith(`${variant}:`)) continue;
    const utility = token.slice(variant.length + 1);
    if (utility.startsWith("opacity-")) return "opacity";
    if (utility.startsWith("cursor-")) return "cursor";
    if (utility.startsWith("bg-")) return "bg";
  }
  return "bg";
};

const constantsModules = {
  ...(import.meta.glob("../../components/*/utils/constants.ts", { eager: true }) as Record<string, Record<string, unknown>>),
  ...(import.meta.glob("../../components/*/constants.ts", { eager: true }) as Record<string, Record<string, unknown>>),
};
const defaultSets: Record<string, Record<string, string>> = {};
for (const [path, module] of Object.entries(constantsModules)) {
  const component = path.replace("../../components/", "").split("/")[0];
  for (const [name, value] of Object.entries(module)) {
    if (name.startsWith("DEFAULT_") && name.endsWith("_CLASSES")) {
      defaultSets[`${component}::${name}`] = value as Record<string, string>;
    }
  }
}
const defaultFor = (component: string, key: string) => {
  const owner = component.split("/")[0];
  for (const [n, set] of Object.entries(defaultSets)) if (n.startsWith(`${owner}::`) && key in set) return set[key] ?? "";
  return "";
};


/**
 * Renders every fixture with `override` on `part` and returns the class lists of
 * the elements that are in the state.
 *
 * `select` is the attribute itself, not the part selector. The claim under test
 * is "the consumer's class reaches an element that is in this state", and asking
 * it that way directly is both simpler and stricter: Breadcrumb puts
 * `data-disabled` on a <button> that the `item` selector does not match, so
 * going through the selector reported a working route as broken.
 */
const probe = async (
  componentName: string,
  part: string,
  override: string,
  selector: string,
  matches: (el: Element) => boolean,
  measure?: { variant: string; probeClass: string; property: PropertyKey },
) => {
  const entry = COMPONENTS.find((c) => c.name === componentName);
  if (!entry) return { inState: [] as Element[], painted: [] as ReturnType<typeof paintedValue>[], fixtures: 0 };
  const inState: Element[] = [];
  const painted: { painted: string; rivals: string[]; wins: string }[] = [];
  let fixtures = 0;

  for (const f of fixturesFor(componentName).filter((x) => !x.render)) {
    const props = { ...entry.props, ...(f.props as Record<string, unknown>) };
    const classes = { ...((props.classes as Record<string, string>) ?? {}), [part]: override };
    const element = (
      <entry.Component {...props} classes={classes}>
        {f.children as React.ReactNode}
      </entry.Component>
    );
    const { container } = render(
      (f.wrap ? f.wrap(element) : entry.wrap ? entry.wrap(element) : element) as React.ReactElement,
    );
    if (f.act) await f.act(container);
    fixtures += 1;
    for (const el of Array.from(document.body.querySelectorAll(selector))) {
      if (!matches(el)) continue;
      inState.push(el);
      // Measured here, while this fixture's DOM is still the only one mounted.
      // Deferring it meant keeping every fixture mounted at once, and the
      // submenu `act` helper then found a stale [role=menuitem] from an earlier
      // render and never opened the menu it was pointed at.
      if (measure) painted.push(paintedValue(el, measure.variant, measure.probeClass, measure.property));
    }
    cleanup();
  }
  return { inState, painted, fixtures };
};

describe("state replacement contract", () => {
  it("covers every deleted-as-state key exactly once", () => {
    expect(DELETED.length).toBe(97);
    const seen = new Set(DELETED.map((r) => `${r.component}.${r.key}`));
    expect(seen.size).toBe(97);
    for (const r of DELETED) {
      const has = requirementFor(r.component, r.key) ?? pseudoFor(r.component, r.key);
      expect(has, `${r.component}.${r.key} has no recorded replacement at all`).toBeTruthy();
    }
  });

  describe("self-check", () => {
    it("a probe that no element carries is not reported as reaching one", async () => {
      const { inState } = await probe(
        "Breadcrumb", "item", "data-[nonesuch]:bg-cl-probe", "[data-nonesuch]",
        (el) => el.hasAttribute("data-nonesuch"),
      );
      expect(inState).toEqual([]);
    });

    it("reports a loss when a rival for the same variant survives the merge", () => {
      // The whole point of the paint assertion: a class can be present and lose.
      // If tailwind-merge ever stops collapsing these, this is the shape the
      // real cases would take.
      const el = document.createElement("div");
      el.className = `data-[selected]:${PROBE} data-[selected]:bg-rival`;
      el.setAttribute("data-selected", "");
      document.body.appendChild(el);
      const r = paintedValue(el, "data-[selected]", `data-[selected]:${PROBE}`, "bg");
      expect(r.rivals).toEqual(["data-[selected]:bg-rival"]);
      expect(r.painted).toBe(RIVAL_RGB);
      expect(r.painted).not.toBe(r.wins);
      el.remove();
    });

    it("reports a win when the rival was merged away", () => {
      const el = document.createElement("div");
      el.className = `data-[selected]:${PROBE}`;
      el.setAttribute("data-selected", "");
      document.body.appendChild(el);
      const r = paintedValue(el, "data-[selected]", `data-[selected]:${PROBE}`, "bg");
      expect(r.rivals).toEqual([]);
      expect(r.painted).toBe(r.wins);
      el.remove();
    });

    it("a probe on a state that exists does reach the element", async () => {
      const { inState, painted } = await probe(
        "Breadcrumb", "item", `data-[disabled]:${PROBE}`, "[data-disabled]",
        (el) => el.hasAttribute("data-disabled"),
        { variant: "data-[disabled]", probeClass: `data-[disabled]:${PROBE}`, property: "bg" },
      );
      expect(inState.length).toBeGreaterThan(0);
      expect(painted.some((r) => r.painted === PROBE_RGB)).toBe(true);
    });
  });

  /**
   * Keys whose replacement route cannot be demonstrated, so Task 3b does not
   * delete them. Each names what has to happen first; a key may not sit here
   * without one.
   */
  const NOT_DELETABLE: Record<string, string> = {
    // The two DatePicker rows left here when the a11y phase gave the panel a
    // focus trap and the grid its roving tabindex: a focused day now exists, so
    // `data-highlighted` is reachable, and the month menu's selected option
    // carries `data-selected`. Both are deleted and both generate a case below.
    "InternationalPhoneInput.countrySelectOptionSelected":
      "target is R6-nested (countrySelect.item); the route needs the nested classes object, which is Task 4",
  };

  it("every undeletable key names what unblocks it, and is still present", () => {
    for (const [id, why] of Object.entries(NOT_DELETABLE)) {
      expect(why.length, `${id} has no stated blocker`).toBeGreaterThan(20);
      const [component, key] = id.split(".");
      expect(
        DELETED.some((r) => r.component === component && r.key === key),
        `${id} is recorded undeletable but is not a deleted-as-state row`,
      ).toBe(true);
    }
  });

  const ATTRIBUTE_CASES = DELETED.map((r) => [r, requirementFor(r.component, r.key)] as const)
    .filter(([r, req]) => req && !req.tier && !NOT_DELETABLE[`${r.component}.${r.key}`])
    .map(([r, req]) => [`${r.component}.${r.key} -> ${r.to}`, r, req!] as const);

  describe.each(ATTRIBUTE_CASES)("%s", (_label, row, req) => {
    it("a consumer variant on the surviving key paints over the default in that state", async () => {
      const value = valueFor(row.note, req.attribute);
      const variant = value ? `data-[${req.attribute.slice(5)}=${value}]` : `data-[${req.attribute.slice(5)}]`;
      const property = contestedProperty(defaultFor(row.component, req.part), variant);
      const override = `${variant}:${PROPERTIES[property].utility}`;
      const { inState, painted, fixtures } = await probe(
        row.component, req.part, override, `[${req.attribute}]`,
        (el) => {
          const v = el.getAttribute(req.attribute);
          return v !== null && (value === null || v === value);
        },
        { variant, probeClass: override, property },
      );
      expect(fixtures, `${row.component} renders no fixtures`).toBeGreaterThan(0);
      expect(
        inState.length,
        `no element carries ${req.attribute}${value ? `="${value}"` : ""} on part '${req.part}', so nothing replaces classes.${row.key}`,
      ).toBeGreaterThan(0);

      const winner = painted.find((r) => r.painted === r.wins);
      expect(
        winner,
        `the consumer's '${override}' is on the element but does not paint: ` +
          `${painted.map((r) => `got ${r.painted || "nothing"}${r.rivals.length ? ` behind [${r.rivals.join(" ")}]` : ""}`).join("; ")}`,
      ).toBeTruthy();
    });
  });

  const PSEUDO_CASES = DELETED.map((r) => [r, pseudoFor(r.component, r.key)] as const)
    .filter(([, p]) => p)
    .map(([r, p]) => [`${r.component}.${r.key} -> ${p!.part}`, r, p!] as const);

  describe.each(PSEUDO_CASES)("%s", (_label, row, pseudo) => {
    it("a consumer hover/focus variant reaches the part", async () => {
      // jsdom resolves no :hover, so the assertable half is that the variant
      // lands on the right element; Tailwind generates the rule from there.
      const override = `hover:${PROBE}`;
      const { inState } = await probe(
        row.component, pseudo.part, override, SELECTOR[pseudo.part] ?? "*", () => true,
      );
      expect(
        inState.some((el) => el.classList.contains(override)),
        `nothing on part '${pseudo.part}' carries the consumer's '${override}'`,
      ).toBe(true);
      cleanup();
    });
  });

  /**
   * browserTier states cannot be reached in jsdom, so the route is proven in two
   * halves: the e2e spec shows the attribute lands on the part (guarded by
   * state-attributes.contract), and this shows the consumer's class lands on the
   * same element. Neither half alone justifies deleting the key.
   */
  const BROWSER_CASES = DELETED.map((r) => [r, requirementFor(r.component, r.key)] as const)
    .filter(([, req]) => req?.tier === "browserTier")
    .map(([r, req]) => [`${r.component}.${r.key} -> ${r.to}`, r, req!] as const);

  describe.each(BROWSER_CASES)("%s", (_label, row, req) => {
    it("the consumer override reaches the part the e2e spec asserts the attribute on", async () => {
      const override = `data-[${req.attribute.slice(5)}=active]:${PROBE}`;
      const { inState } = await probe(
        row.component, req.part, override, SELECTOR[req.part] ?? "*", () => true,
      );
      expect(
        inState.some((el) => el.classList.contains(override)),
        `nothing on part '${req.part}' carries the consumer override, so ${req.attribute} in the browser has nothing to style`,
      ).toBe(true);
      expect(req.assertedIn, "browserTier with no spec named").toBeTruthy();
    });
  });

  /** blocked routes are asserted nowhere yet; say so out loud. */
  it("records the routes proven outside this suite", () => {
    const elsewhere = DELETED.map((r) => [r, requirementFor(r.component, r.key)] as const)
      .filter(([, req]) => req?.tier)
      .map(([r, req]) => `${r.component}.${r.key}: ${req!.tier} (${req!.assertedIn ?? req!.blockedOn})`);
    expect(elsewhere.length).toBeGreaterThan(0);
    for (const line of elsewhere) expect(line).toMatch(/browserTier|blocked/);
  });
});
