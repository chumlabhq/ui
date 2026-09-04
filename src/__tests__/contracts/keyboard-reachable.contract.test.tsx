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
import { render, cleanup } from "@testing-library/react";
import { COMPONENTS } from "./registry";
import { fixturesFor } from "../fixtures";

import { setReducedMotion } from "../../test/matchMedia";

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

/** Controls that no keyboard user can reach. */
const unreachable = (): string[] => {
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
    bad.push(`${key}: ${enabled.length} members, no tab stop and no active-descendant owner`);
  }

  // Native controls made unreachable by hand. A member of a roving group is
  // exempt by its own role rather than by its ancestor's: TabPanel's inactive
  // tabs are `<button tabindex="-1">` inside a `[role="tablist"]`, and they are
  // reached with the arrow keys like any other roving group.
  for (const el of document.querySelectorAll("button, a[href], input, select, textarea")) {
    if (el.hasAttribute("disabled")) continue;
    if (el.getAttribute("type") === "hidden") continue;
    if (el.getAttribute("aria-hidden") === "true") continue;
    const role = el.getAttribute("role") ?? "";
    if (ROVING_ROLES.has(role)) continue;
    if (el.getAttribute("tabindex") === "-1") {
      bad.push(`${el.tagName.toLowerCase()}[tabindex=-1] is a control the user cannot tab to`);
    }
  }
  return bad;
};

const renderFixture = async (
  Component: React.ComponentType<Record<string, unknown>>,
  fixture: ReturnType<typeof fixturesFor>[number],
) => {
  const element = (
    <Component {...fixture.props}>{fixture.children as React.ReactNode}</Component>
  );
  const { container } = render(
    (fixture.wrap ? fixture.wrap(element) : element) as React.ReactElement,
  );
  if (fixture.act) await fixture.act(container);
};

const withFixtures = COMPONENTS.filter((c) => fixturesFor(c.name).length > 0);

describe("keyboard reachability contract", () => {
  describe("self-check", () => {
    it("catches a control that cannot take focus", () => {
      const host = document.createElement("div");
      host.innerHTML = '<span role="button">click me</span>';
      document.body.appendChild(host);
      expect(unreachable()).toContain("span[role=button] cannot take focus");
      host.remove();
    });

    it("accepts the same control once it is focusable", () => {
      const host = document.createElement("div");
      host.innerHTML = '<span role="button" tabindex="0">click me</span>';
      document.body.appendChild(host);
      expect(unreachable()).toEqual([]);
      host.remove();
    });

    it("catches a roving group with no tab stop", () => {
      const host = document.createElement("div");
      host.innerHTML =
        '<div><div role="option" tabindex="-1">a</div><div role="option" tabindex="-1">b</div></div>';
      document.body.appendChild(host);
      expect(unreachable().join()).toContain("no tab stop and no active-descendant owner");
      host.remove();
    });

    it("accepts a roving group with exactly one tab stop", () => {
      const host = document.createElement("div");
      host.innerHTML =
        '<div><div role="option" tabindex="0">a</div><div role="option" tabindex="-1">b</div></div>';
      document.body.appendChild(host);
      expect(unreachable()).toEqual([]);
      host.remove();
    });
  });

  for (const component of withFixtures) {
    it(`${component.name} leaves no control out of the keyboard's reach`, async () => {
      const bad: string[] = [];
      for (const fixture of fixturesFor(component.name)) {
        await renderFixture(
          component.Component as React.ComponentType<Record<string, unknown>>,
          fixture,
        );
        bad.push(...unreachable().map((b) => `${fixture.name}: ${b}`));
        cleanup();
      }
      expect([...new Set(bad)], "a control no keyboard user can reach").toEqual([]);
    });
  }
});
