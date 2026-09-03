/**
 * DatePicker focus management, per ADR 003 D4.
 *
 * The panel shipped `role="dialog" aria-modal="true"` — a claim that the rest
 * of the page is inert — with no focus trap and no `.focus()` call anywhere in
 * the directory (AUDIT-GAP 3.1). Arrow keys moved `focusedDate` in state while
 * DOM focus stayed on the cell the user had actually reached, so every arrow
 * after the first recomputed from the same stale date and the grid appeared to
 * freeze after one step.
 *
 * These are the gates behind ACCESSIBILITY.md's Supports rows for 2.1.1, 2.1.2
 * and 2.4.3. Nothing here asserts an attribute that no behaviour backs: each
 * case reads `document.activeElement` after a real key event.
 */
import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { render, cleanup, fireEvent, act } from "@testing-library/react";
import { DatePicker } from "../index";

import { setReducedMotion } from "../../../test/matchMedia";

beforeEach(() => setReducedMotion(false));
afterEach(cleanup);

const SELECTED = new Date(2026, 0, 15); // Thursday 15 January 2026

const panel = () => document.querySelector('[role="dialog"]') as HTMLElement;
const trigger = () => document.querySelector('[role="combobox"]') as HTMLElement;
const active = () => document.activeElement as HTMLElement;
const activeDay = () => active().textContent?.trim();

const rovingCells = () =>
  [...document.querySelectorAll('[role="gridcell"][tabindex="0"]')];

/**
 * Opens via the trigger and lets the focus timer run.
 *
 * The two `act` blocks are load-bearing: React flushes effects at the end of a
 * block, so the effect that schedules the focus timer has not run yet while the
 * first block is still executing. Advancing timers inside it advances nothing.
 */
const openPicker = async (ui: React.ReactElement) => {
  const result = render(ui);
  await act(async () => {
    fireEvent.click(trigger());
  });
  await act(async () => {
    vi.advanceTimersByTime(50);
  });
  return result;
};

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe("DatePicker focus management", () => {
  describe("the dialog claim", () => {
    it("moves focus into the panel on open", async () => {
      await openPicker(<DatePicker mode="single" value={SELECTED} />);
      expect(panel().contains(active())).toBe(true);
      expect(activeDay()).toBe("15");
    });

    it("returns focus to the trigger on Escape", async () => {
      await openPicker(<DatePicker mode="single" value={SELECTED} />);
      await act(async () => {
        fireEvent.keyDown(active(), { key: "Escape" });
      });
      await act(async () => {
        vi.advanceTimersByTime(50);
      });
      expect(panel()).toBeNull();
      expect(active()).toBe(trigger());
    });

    it("keeps Tab inside the panel", async () => {
      await openPicker(<DatePicker mode="single" value={SELECTED} />);

      // Walk forward well past the number of focusables; focus must never
      // leave the panel, which is what `aria-modal` promises.
      for (let i = 0; i < 40; i++) {
        const from = active();
        fireEvent.keyDown(from, { key: "Tab" });
        expect(panel().contains(active())).toBe(true);
      }
    });

    it("keeps Shift+Tab inside the panel", async () => {
      await openPicker(<DatePicker mode="single" value={SELECTED} />);
      for (let i = 0; i < 40; i++) {
        fireEvent.keyDown(active(), { key: "Tab", shiftKey: true });
        expect(panel().contains(active())).toBe(true);
      }
    });
  });

  describe("the grid keyboard pattern", () => {
    it("keeps exactly one cell tabbable", async () => {
      await openPicker(<DatePicker mode="single" value={SELECTED} />);
      expect(rovingCells()).toHaveLength(1);

      await act(async () => {
        fireEvent.keyDown(active(), { key: "ArrowRight" });
      });
      expect(rovingCells()).toHaveLength(1);
    });

    it("moves focus by one day, repeatedly", async () => {
      await openPicker(<DatePicker mode="single" value={SELECTED} />);
      expect(activeDay()).toBe("15");

      // The regression this covers: the second press used to recompute from
      // the stale cell and land back on 16.
      for (const expected of ["16", "17", "18"]) {
        await act(async () => {
          fireEvent.keyDown(active(), { key: "ArrowRight" });
        });
        expect(activeDay()).toBe(expected);
      }

      await act(async () => {
        fireEvent.keyDown(active(), { key: "ArrowLeft" });
      });
      expect(activeDay()).toBe("17");
    });

    it("moves by a week on ArrowUp and ArrowDown", async () => {
      await openPicker(<DatePicker mode="single" value={SELECTED} />);
      await act(async () => {
        fireEvent.keyDown(active(), { key: "ArrowDown" });
      });
      expect(activeDay()).toBe("22");

      await act(async () => {
        fireEvent.keyDown(active(), { key: "ArrowUp" });
      });
      expect(activeDay()).toBe("15");
    });

    it("moves to the week bounds on Home and End", async () => {
      // 15 Jan 2026 is a Thursday; with weekStartsOn=0 the week is 11–17.
      await openPicker(<DatePicker mode="single" value={SELECTED} />);
      await act(async () => {
        fireEvent.keyDown(active(), { key: "Home" });
      });
      expect(activeDay()).toBe("11");

      await act(async () => {
        fireEvent.keyDown(active(), { key: "End" });
      });
      expect(activeDay()).toBe("17");
    });

    it("honours weekStartsOn at the week bounds", async () => {
      await openPicker(
        <DatePicker mode="single" value={SELECTED} weekStartsOn={1} />,
      );
      await act(async () => {
        fireEvent.keyDown(active(), { key: "Home" });
      });
      expect(activeDay()).toBe("12");
    });

    it("moves by a month on PageUp and PageDown", async () => {
      await openPicker(<DatePicker mode="single" value={SELECTED} />);
      await act(async () => {
        fireEvent.keyDown(active(), { key: "PageDown" });
      });
      await act(async () => {
        vi.advanceTimersByTime(50);
      });
      expect(activeDay()).toBe("15");
      expect(document.body.textContent).toContain("February");

      await act(async () => {
        fireEvent.keyDown(active(), { key: "PageUp" });
      });
      await act(async () => {
        vi.advanceTimersByTime(50);
      });
      expect(document.body.textContent).toContain("January");
    });

    it("moves by a year on Shift+PageUp and Shift+PageDown", async () => {
      await openPicker(<DatePicker mode="single" value={SELECTED} />);
      await act(async () => {
        fireEvent.keyDown(active(), { key: "PageDown", shiftKey: true });
      });
      await act(async () => {
        vi.advanceTimersByTime(50);
      });
      expect(document.body.textContent).toContain("2027");
    });

    it("selects the focused day on Enter", async () => {
      const onValueChange = vi.fn();
      await openPicker(
        <DatePicker mode="single" value={SELECTED} onValueChange={onValueChange} />,
      );
      await act(async () => {
        fireEvent.keyDown(active(), { key: "ArrowRight" });
      });
      await act(async () => {
        fireEvent.keyDown(active(), { key: "Enter" });
      });
      expect(onValueChange).toHaveBeenCalled();
      const [date] = onValueChange.mock.calls[0];
      expect((date as Date).getDate()).toBe(16);
    });
  });

  describe("disabled days", () => {
    it("steps over a disabled day rather than stranding focus on it", async () => {
      await openPicker(
        <DatePicker
          mode="single"
          value={SELECTED}
          disabledDates={{ dates: [new Date(2026, 0, 16)] }}
        />,
      );
      await act(async () => {
        fireEvent.keyDown(active(), { key: "ArrowRight" });
      });
      // 16 is disabled and cannot take focus, so 17 is the next focusable day.
      expect(activeDay()).toBe("17");
      expect(rovingCells()).toHaveLength(1);
    });

    it("does not move past maxDate", async () => {
      await openPicker(
        <DatePicker
          mode="single"
          value={SELECTED}
          maxDate={new Date(2026, 0, 15)}
        />,
      );
      await act(async () => {
        fireEvent.keyDown(active(), { key: "ArrowRight" });
      });
      expect(activeDay()).toBe("15");
    });
  });
});
