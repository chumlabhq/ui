/** @jsxImportSource react */
/**
 * SC 2.1.1 Keyboard and SC 4.1.2 Name, Role, Value — the composite widgets.
 *
 * A roving tabindex is a promise that exactly one element in a group is
 * tabbable and that it is the one the user is on. Three widgets in this package
 * kept the first half and dropped the second: `tabIndex={isFocused ? 0 : -1}`
 * and `data-highlighted` moved with the arrow keys while `document.activeElement`
 * never did.
 *
 * The consequences are not cosmetic. Nothing is announced, because a screen
 * reader reports the focused element and the focused element never changed; and
 * navigation freezes after one step, because the next key event is still
 * delivered to the element that kept the focus, which recomputes from the same
 * stale position. All three were invisible to axe: every attribute is present
 * and correct in the DOM.
 *
 * Found in the DatePicker day grid, then the DatePicker month/year menus, then
 * CascadingDropdown's menu. Three times is a pattern, so this asserts the
 * property rather than the three instances.
 */
import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { render, cleanup, fireEvent, act } from "@testing-library/react";
import { DatePicker } from "../../components/DatePicker/index.js";
import { CascadingDropdown } from "../../components/CascadingDropdown/index.js";

import { setReducedMotion } from "../../test/matchMedia.js";

beforeEach(() => setReducedMotion(false));
afterEach(cleanup);

/** The single tabbable element of a roving group. */
const tabbable = (selector: string): HTMLElement | null =>
  document.querySelector<HTMLElement>(`${selector}[tabindex="0"]`);

const tabbableCount = (selector: string): number =>
  document.querySelectorAll(`${selector}[tabindex="0"]`).length;

const active = () => document.activeElement as HTMLElement | null;

interface Widget {
  name: string;
  /** Renders the widget with its roving group already on screen and focused. */
  open: () => Promise<void>;
  /** Matches every member of the roving group. */
  selector: string;
  key: string;
}

const WIDGETS: Widget[] = [
  {
    name: "DatePicker day grid",
    selector: '[role="gridcell"]',
    key: "ArrowRight",
    open: async () => {
      render(<DatePicker selectionMode="single" value={new Date(2026, 0, 15)} defaultOpen />);
      await act(async () => {});
      tabbable('[role="gridcell"]')?.focus();
    },
  },
  {
    name: "CascadingDropdown menu",
    selector: '[role^="menuitem"]',
    key: "ArrowDown",
    open: async () => {
      render(
        <CascadingDropdown
          aria-label="Pick"
          defaultOpen
          options={[
            { value: "a", label: "Alpha" },
            { value: "b", label: "Beta" },
            { value: "c", label: "Gamma" },
          ]}
        />,
      );
      await act(async () => {});
      document.querySelector("button")?.focus();
      await act(async () => {
        fireEvent.keyDown(active() ?? document.body, { key: "ArrowDown" });
      });
    },
  },
];

describe("roving focus contract", () => {
  describe("self-check", () => {
    it("catches a group whose focus does not follow its tabindex", () => {
      const host = document.createElement("div");
      host.innerHTML =
        '<button id="a" role="gridcell" tabindex="0">a</button>' +
        '<button id="b" role="gridcell" tabindex="-1">b</button>';
      document.body.appendChild(host);

      // The defect exactly: move the attribute, leave the focus behind.
      (host.querySelector("#a") as HTMLElement).focus();
      host.querySelector("#a")!.setAttribute("tabindex", "-1");
      host.querySelector("#b")!.setAttribute("tabindex", "0");

      expect(tabbableCount('[role="gridcell"]')).toBe(1);
      expect(tabbable('[role="gridcell"]')).not.toBe(active());
      host.remove();
    });

    it("accepts a group whose focus does follow", () => {
      const host = document.createElement("div");
      host.innerHTML =
        '<button id="a" role="gridcell" tabindex="-1">a</button>' +
        '<button id="b" role="gridcell" tabindex="0">b</button>';
      document.body.appendChild(host);
      (host.querySelector("#b") as HTMLElement).focus();
      expect(tabbable('[role="gridcell"]')).toBe(active());
      host.remove();
    });
  });

  describe.each(WIDGETS)("$name", ({ open, selector, key }) => {
    it("keeps exactly one member tabbable", async () => {
      await open();
      expect(tabbableCount(selector)).toBe(1);

      await act(async () => {
        fireEvent.keyDown(active() ?? document.body, { key });
      });
      expect(tabbableCount(selector)).toBe(1);
    });

    it("puts the focus on the tabbable member", async () => {
      await open();
      expect(tabbable(selector), "no member is tabbable").not.toBeNull();
      expect(
        active(),
        "the roving tabindex moved and the focus did not — nothing is announced",
      ).toBe(tabbable(selector));
    });

    it("moves the focus with the arrow key, repeatedly", async () => {
      await open();
      const seen: (string | null)[] = [];

      for (let i = 0; i < 3; i++) {
        await act(async () => {
          fireEvent.keyDown(active() ?? document.body, { key });
        });
        expect(
          active(),
          "focus fell off the roving group",
        ).toBe(tabbable(selector));
        seen.push(active()?.textContent?.trim() ?? null);
      }

      // The freeze this catches: the second press recomputing from the element
      // that still had focus, so navigation advances once and then stops.
      expect(new Set(seen).size, `focus did not advance: ${seen.join(",")}`).toBe(
        seen.length,
      );
    });
  });
});
