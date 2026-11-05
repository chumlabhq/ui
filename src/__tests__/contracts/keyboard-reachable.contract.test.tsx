/** @jsxImportSource react */
/**
 * SC 2.1.1 Keyboard — everything that behaves like a control can be reached
 * from the keyboard.
 *
 * The failure this catches is a control built out of a `<div>` or a `<span>`:
 * it takes a click, it reports an interactive role, and it can never take
 * focus. Two shipped that way — DatePicker's clear control was a
 * `<span role="button" tabIndex={0}>` nested inside a `<button>`, which is
 * unreachable however it is marked, and Table's row-reorder handle was a bare
 * `<span>` with an `aria-label` and no tab stop at all.
 *
 * A roving group is the one legitimate way to hold `tabindex="-1"`: its members
 * are reached with the arrow keys once any one of them is the tab stop. So the
 * rule is per group — exactly one member tabbable — rather than per element.
 */
import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { act, cleanup, fireEvent } from "@testing-library/react";
import { COMPONENTS } from "./registry.js";
import { fixturesFor } from "../fixtures/index.js";
import { fixtureSession } from "../fixtures/_act.contract.js";

import { setReducedMotion } from "../../test/matchMedia.js";

beforeEach(() => setReducedMotion(false));
afterEach(cleanup);

/** Roles that mean "the user operates this". */
const INTERACTIVE_ROLES = [
  "button",
  "checkbox",
  "combobox",
  "link",
  "menuitem",
  "menuitemcheckbox",
  "menuitemradio",
  "option",
  "radio",
  "slider",
  "switch",
  "tab",
  "separator",
  "gridcell",
  "spinbutton",
];

/** Roles whose members share one tab stop and are reached with the arrows. */
const ROVING_ROLES = new Set([
  "menuitem",
  "menuitemcheckbox",
  "menuitemradio",
  "option",
  "gridcell",
  "tab",
  "radio",
]);

const NATIVELY_FOCUSABLE = new Set(["BUTTON", "INPUT", "SELECT", "TEXTAREA", "A"]);

const isFocusable = (el: Element): boolean => {
  const tabindex = el.getAttribute("tabindex");
  if (tabindex !== null) return Number(tabindex) >= 0;
  if (el.hasAttribute("disabled")) return true;
  if (el.tagName === "A") return el.hasAttribute("href");
  return NATIVELY_FOCUSABLE.has(el.tagName);
};

/** What the arrow walk measured, and where: a walk that never ran would pass everything. */
const rovingComponents = new Set<string>();
let currentComponent = "";
/** TabPanel, Stepper and DatePicker: the native-button roving groups their `.ai.md` keyboard tables document. */
const ROVING_COMPONENT_FLOOR = 3;

/** A control's identity across a re-render: a calendar paged away and back mounts new cells for the same days. */
const memberKey = (el: Element) => el.getAttribute("aria-label") || el.textContent?.trim() || el.tagName;

/** The controls with a tabindex of their own in `el`'s largest ancestor holding at most one tab stop of its kind. */
const rovingGroup = (el: Element, controls: Element[]): Element[] => {
  const sameKind = controls.filter((c) => c.tagName === el.tagName && c.hasAttribute("tabindex"));
  let group = [el];
  for (let ancestor = el.parentElement; ancestor; ancestor = ancestor.parentElement) {
    const within = sameKind.filter((c) => ancestor!.contains(c));
    if (within.filter((c) => c.getAttribute("tabindex") === "0").length > 1) break;
    group = within;
  }
  return group;
};

/** Presses the arrows from the tab stop, each way, and names the members focus never reached. */
const notReachedByArrows = async (stop: Element, members: Element[]): Promise<string[]> => {
  const wanted = new Set(members.map(memberKey));
  (stop as HTMLElement).focus();
  wanted.delete(memberKey(stop));
  // Each way walks back over the last one first: a calendar's arrows page on past
  // the month, so the days behind the stop are only reached by outwalking the
  // days walked forward.
  let walked = 0;
  for (const key of ["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"]) {
    const presses = members.length + walked * 2;
    walked = 0;
    for (let press = 0; press < presses && wanted.size; press++, walked++) {
      const before = document.activeElement;
      if (!before || before === document.body) break;
      await act(async () => {
        fireEvent.keyDown(before, { key });
        await new Promise((frame) => requestAnimationFrame(frame));
      });
      if (document.activeElement) wanted.delete(memberKey(document.activeElement));
      if (document.activeElement === before) break;
    }
  }
  return [...wanted];
};

/** Controls that no keyboard user can reach. */
const unreachable = async (): Promise<string[]> => {
  const bad: string[] = [];
  const rovingSeen = new Map<string, Element[]>();

  for (const role of INTERACTIVE_ROLES) {
    for (const el of document.querySelectorAll(`[role="${role}"]`)) {
      if (el.getAttribute("aria-disabled") === "true") continue;
      if (ROVING_ROLES.has(role)) {
        const key = `${role}@${el.parentElement?.tagName ?? "?"}`;
        rovingSeen.set(key, [...(rovingSeen.get(key) ?? []), el]);
        continue;
      }
      if (!isFocusable(el)) {
        bad.push(`${el.tagName.toLowerCase()}[role=${role}] cannot take focus`);
      }
    }
  }

  /**
   * A group of members that are all `tabindex="-1"` is legitimate in exactly
   * one arrangement: some focused element points into it with
   * `aria-activedescendant`, which is how a listbox behind a combobox works and
   * how the searchable dropdowns navigate their options. Otherwise the members
   * are unreachable, which is the roving-tabindex bug in its other form.
   */
  const ownedByActiveDescendant = new Set(
    [...document.querySelectorAll("[aria-activedescendant]")].map((el) =>
      el.getAttribute("aria-activedescendant"),
    ),
  );
  const hasActiveDescendantOwner = (members: Element[]): boolean =>
    members.some((m) => ownedByActiveDescendant.has(m.id)) ||
    // The owner may point at no member yet, when nothing is highlighted.
    [...document.querySelectorAll("[aria-activedescendant], [aria-controls]")].some((owner) => {
      const controlled = owner.getAttribute("aria-controls");
      const container = controlled ? document.getElementById(controlled) : null;
      return container ? members.some((m) => container.contains(m)) : false;
    });

  for (const [key, members] of rovingSeen) {
    const enabled = members.filter((m) => !m.hasAttribute("disabled"));
    if (enabled.length === 0) continue;
    if (enabled.some((m) => m.getAttribute("tabindex") === "0")) continue;
    if (hasActiveDescendantOwner(enabled)) continue;
    // The stop has moved into a member: Table's inline editor holds focus inside
    // its cell, and the cell leaves the tab order while it does, or axe faults
    // it as a target the editor obscures. Only the focused control counts, so a
    // group that is merely all -1 still fails.
    const active = document.activeElement;
    if (active && active.matches("input, textarea, select, button") && enabled.some((m) => m !== active && m.contains(active))) continue;
    bad.push(`${key}: ${enabled.length} members, no tab stop and no active-descendant owner`);
  }

  // Native controls made unreachable by hand. The one legitimate `tabindex="-1"`
  // is a roving group, and what makes it one is measured, not named: exactly one
  // member is the tab stop, and the arrow keys reach every other member from it.
  const controls = [...document.querySelectorAll("button, a[href], input, select, textarea")].filter(
    (el) => !el.hasAttribute("disabled") && el.getAttribute("type") !== "hidden" && el.getAttribute("aria-hidden") !== "true",
  );
  const measured = new Set<Element>();
  for (const el of controls) {
    if (el.getAttribute("tabindex") !== "-1" || measured.has(el)) continue;
    const members = rovingGroup(el, controls);
    members.forEach((member) => measured.add(member));
    const stops = members.filter((member) => member.getAttribute("tabindex") === "0");
    if (!stops.length && hasActiveDescendantOwner(members)) continue;
    const missed = stops.length === 1 ? await notReachedByArrows(stops[0], members) : [];
    if (stops.length === 1 && currentComponent) rovingComponents.add(currentComponent);
    if (stops.length !== 1 || missed.length) {
      bad.push(`${el.tagName.toLowerCase()}[tabindex=-1] is a control the user cannot tab to: ${stops.length} tab stops, arrows miss ${missed.length}`);
    }
  }
  return bad;
};
const withFixtures = COMPONENTS.filter((c) => fixturesFor(c.name).length > 0);


/**
 * SC 2.1.1's sibling in mouse terms: a control has to look clickable.
 *
 * Tailwind v4's preflight does not set `cursor: pointer` on a button, and this
 * package ships no preflight at all — `assert-styles-bundle.mjs` asserts that,
 * because a consumer's own page styling is not ours to touch. So the cursor is
 * on us, on every clickable element, explicitly. It was on almost none: a sweep
 * of all 429 fixtures found 242 of 475 interactive elements computing something
 * other than `pointer`, and nothing had ever looked. It is not in a screenshot,
 * axe has no rule for it, and the contrast gate reads colour.
 *
 * Asserted on the class string rather than on computed style because jsdom
 * applies no stylesheet — `getComputedStyle` here would report the default for
 * everything and pass every time. That the class then resolves to a real rule
 * is `assert-styles-bundle.mjs`'s job, and it already counts the emitted
 * utilities.
 *
 * `grab`, `col-resize`, `row-resize`, `text` and `not-allowed` are deliberate
 * and left alone: a slider thumb, a resize handle and a disabled control are
 * each saying something a pointer would contradict.
 */
const CLICKABLE = [
  "button",
  '[role="button"]',
  '[role="tab"]',
  '[role="option"]',
  '[role="menuitem"]',
  '[role="menuitemcheckbox"]',
  '[role="menuitemradio"]',
  '[role="switch"]',
  '[role="checkbox"]',
  '[role="radio"]',
  "summary",
].join(", ");

const DELIBERATE_CURSORS = /cursor-(pointer|grab|grabbing|col-resize|row-resize|text|not-allowed|default)/;

const withoutCursor = (): string[] => {
  const bad: string[] = [];
  for (const el of document.querySelectorAll(CLICKABLE)) {
    if (el.hasAttribute("disabled")) continue;
    if (el.getAttribute("aria-disabled") === "true") continue;
    if (el.getAttribute("aria-hidden") === "true") continue;
    // The native input inside a styled control is visually replaced by it; the
    // label and the control carry the cursor for the whole thing.
    if (el.tagName === "INPUT" && el.closest("label")) continue;
    const cls = el.getAttribute("class") ?? "";
    // Only what the library rendered. A `renderTrigger` returns the consumer's
    // own element — `<button {...triggerProps}>` with no class of ours on it —
    // and its cursor is theirs to set, not a defect here. Every element the
    // library renders carries the `cl-s` marker, which is what makes the two
    // tellable apart; without this the gate reports a consumer's markup as a
    // library defect and cannot be made green by fixing the library.
    if (!/\bcl-s\b/.test(cls)) continue;
    if (DELIBERATE_CURSORS.test(cls)) continue;
    bad.push(
      `${el.tagName.toLowerCase()}${el.getAttribute("role") ? `[role=${el.getAttribute("role")}]` : ""}` +
        ` has no cursor: "${cls.slice(0, 60)}"`,
    );
  }
  return bad;
};

describe("keyboard reachability contract", () => {
  // A run that iterates nothing reports nothing, which reads exactly like a
  // pass. `overrides.contract` asserted on 3 of 340 slots for months on that
  // basis, guarding the very bug it was written for.
  it("iterates a non-empty set", () => {
    expect(withFixtures.length, "the candidate set is empty — this contract asserts nothing").toBeGreaterThan(30);
  });

  describe("self-check", () => {
    it("catches a control that cannot take focus", async () => {
      const host = document.createElement("div");
      host.innerHTML = '<span role="button">click me</span>';
      document.body.appendChild(host);
      expect(await unreachable()).toContain("span[role=button] cannot take focus");
      host.remove();
    });

    it("accepts the same control once it is focusable", async () => {
      const host = document.createElement("div");
      host.innerHTML = '<span role="button" tabindex="0">click me</span>';
      document.body.appendChild(host);
      expect(await unreachable()).toEqual([]);
      host.remove();
    });

    it("catches a tabindex=-1 control beside a tab stop that no arrow key leads to", async () => {
      const host = document.createElement("div");
      host.innerHTML = '<div><button tabindex="0">a</button><button tabindex="-1">b</button></div>';
      document.body.appendChild(host);
      expect((await unreachable()).join()).toContain("arrows miss 1");
      host.remove();
    });

    it("accepts the same group when the arrow keys do move focus to every member", async () => {
      const host = document.createElement("div");
      host.innerHTML = '<div><button tabindex="0">a</button><button tabindex="-1">b</button></div>';
      document.body.appendChild(host);
      const [a, b] = host.querySelectorAll("button");
      a.addEventListener("keydown", () => b.focus());
      expect(await unreachable()).toEqual([]);
      host.remove();
    });

    it("catches a roving group with no tab stop", async () => {
      const host = document.createElement("div");
      host.innerHTML =
        '<div><div role="option" tabindex="-1">a</div><div role="option" tabindex="-1">b</div></div>';
      document.body.appendChild(host);
      expect((await unreachable()).join()).toContain("no tab stop and no active-descendant owner");
      host.remove();
    });

    it("accepts a roving group with exactly one tab stop", async () => {
      const host = document.createElement("div");
      host.innerHTML =
        '<div><div role="option" tabindex="0">a</div><div role="option" tabindex="-1">b</div></div>';
      document.body.appendChild(host);
      expect(await unreachable()).toEqual([]);
      host.remove();
    });

    it("accepts a group whose stop is a focused control inside a member", async () => {
      const host = document.createElement("div");
      host.innerHTML =
        '<table><tbody><tr><td role="gridcell" tabindex="-1"><input aria-label="Edit a"></td><td role="gridcell" tabindex="-1">b</td></tr></tbody></table>';
      document.body.appendChild(host);
      host.querySelector("input")!.focus();
      expect(await unreachable()).toEqual([]);
      host.remove();
    });

    it("still catches that group once focus leaves the control", async () => {
      const host = document.createElement("div");
      host.innerHTML =
        '<table><tbody><tr><td role="gridcell" tabindex="-1"><input aria-label="Edit a"></td><td role="gridcell" tabindex="-1">b</td></tr></tbody></table>';
      document.body.appendChild(host);
      host.querySelector("input")!.focus();
      host.querySelector("input")!.blur();
      expect((await unreachable()).join()).toContain("gridcell@TR: 2 members, no tab stop");
      host.remove();
    });
  });

  describe("cursor self-check", () => {
    it("catches a clickable element with no cursor", () => {
      const host = document.createElement("div");
      host.innerHTML = '<button class="cl-s px-2">Go</button>';
      document.body.append(host);
      expect(withoutCursor().join(" ")).toContain("has no cursor");
      host.remove();
    });

    it("accepts the same element once it says pointer", () => {
      const host = document.createElement("div");
      host.innerHTML = '<button class="cl-s px-2 cursor-pointer">Go</button>';
      document.body.append(host);
      expect(withoutCursor()).toEqual([]);
      host.remove();
    });

    it("leaves a deliberate non-pointer cursor alone", () => {
      const host = document.createElement("div");
      host.innerHTML = '<button class="cl-s cursor-grab" role="button">Drag</button>';
      document.body.append(host);
      expect(withoutCursor()).toEqual([]);
      host.remove();
    });
  });

  /**
   * Both questions off one render pass.
   *
   * They were two loops over the same fixtures, which rendered every fixture of
   * every component twice. That is the heaviest file in the suite and doubling
   * it made the act-driven contracts elsewhere flake noticeably more often —
   * Table's and TimePicker's, which open a surface and read it. Asking both
   * questions of one render costs nothing and gives that back.
   */
  for (const component of withFixtures) {
    it(`${component.name} keeps its controls reachable and clickable`, async () => {
      currentComponent = component.name;
      const session = fixtureSession();
      const unreached: string[] = [];
      const uncursored: string[] = [];
      for (const fixture of fixturesFor(component.name)) {
        await session.mountFixture(
          component.Component as React.ComponentType<Record<string, unknown>>,
          fixture,
        );
        unreached.push(...(await unreachable()).map((b) => `${fixture.name}: ${b}`));
        uncursored.push(...withoutCursor().map((b) => `${fixture.name}: ${b}`));
        session.unmount();
      }
      expect([...new Set(unreached)], "a control no keyboard user can reach").toEqual([]);
      expect([...new Set(uncursored)], "a control that does not look clickable").toEqual([]);
    });
  }

  it("walked the arrows in the components that document roving groups", () => {
    console.log(`KEYBOARD_REACHABLE roving groups walked in ${rovingComponents.size} components (floor ${ROVING_COMPONENT_FLOOR}): ${[...rovingComponents].join(", ")}`);
    expect(rovingComponents.size).toBeGreaterThanOrEqual(ROVING_COMPONENT_FLOOR);
  });
});
