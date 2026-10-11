/**
 * What the clock face tells assistive technology about its bounds.
 *
 * A number outside `minTime`/`maxTime` was marked `data-disabled` and nothing
 * else, so it was dimmed for a sighted user and announced like any other
 * number. And the face's `role="slider"` reported `aria-valuemin={0}` and
 * `aria-valuemax` of the whole dial whatever the bounds, so a screen reader
 * heard a range the picker would not accept.
 *
 * The props come from the `open-bounded` fixture, the same one the e2e
 * disabled-item check measures, and the expected range is read off the numbers
 * the face renders enabled, so the two cannot drift apart.
 */
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TimePicker } from "../index.js";
import { fixturesFor } from "../../../__tests__/fixtures/index.js";
import { setReducedMotion } from "../../../test/matchMedia.js";
import { lazyLoaded } from "../../../test/lazyLoads.js";

const bounded = fixturesFor("TimePicker").find((f) => f.name === "open-bounded");

/**
 * At the fixture's 10:00 no minute is out of range, so a minutes check there
 * passes with nothing to check. 17:00 is the last bounded hour: 17:05 to 17:55
 * are past `maxTime` and only :00 is selectable.
 */
const LAST_HOUR = "17:00";

const propsFor = (mode: "hours" | "minutes") => ({
  ...(bounded!.props as object),
  ...(mode === "minutes" ? { defaultValue: LAST_HOUR } : {}),
});

const numbersOf = () => [...document.querySelectorAll('[role="slider"] > div')].filter((el) => /^\d+$/.test(el.textContent ?? ""));

describe("TimePicker clock face state", () => {
  beforeEach(() => setReducedMotion(false));

  it("has a bounded fixture to read", () => {
    expect(bounded, "the open-bounded fixture is gone").toBeDefined();
    expect(bounded!.props).toMatchObject({ mode: "clock", minTime: "09:00", maxTime: "17:00" });
  });

  for (const mode of ["hours", "minutes"] as const) {
    it(`marks every disabled ${mode} number aria-disabled, and no enabled one`, async () => {
      render(<TimePicker {...propsFor(mode)} />);
      // The face is a lazy half: wait on its load, not on `findBy`'s second.
      await lazyLoaded();
      screen.getByRole("slider");
      if (mode === "minutes") await userEvent.setup().click(screen.getByRole("button", { name: "00" }));
      const numbers = numbersOf();
      expect(numbers.length, "no clock numbers rendered").toBeGreaterThan(0);
      const wrong = numbers
        .filter((el) => el.hasAttribute("data-disabled") !== (el.getAttribute("aria-disabled") === "true"))
        .map((el) => `${el.textContent}: data-disabled=${el.hasAttribute("data-disabled")} aria-disabled=${el.getAttribute("aria-disabled")}`);
      expect(wrong).toEqual([]);
      expect(numbers.some((el) => el.hasAttribute("data-disabled")), "nothing disabled — the bounds read nothing").toBe(true);
    });
  }

  for (const [mode, expected] of [["hours", ["9", "17"]], ["minutes", ["0", "0"]]] as const) {
    it(`reports the bounded range on its slider, in ${mode}`, async () => {
      render(<TimePicker {...propsFor(mode)} />);
      await lazyLoaded();
      if (mode === "minutes") await userEvent.setup().click(screen.getByRole("button", { name: "00" }));
      const slider = screen.getByRole("slider");
      const enabled = numbersOf()
        .filter((el) => !el.hasAttribute("data-disabled"))
        .map((el) => Number(el.textContent));
      expect(Number(slider.getAttribute("aria-valuemin"))).toBe(Math.min(...enabled));
      expect(Number(slider.getAttribute("aria-valuemax"))).toBe(Math.max(...enabled));
      expect([slider.getAttribute("aria-valuemin"), slider.getAttribute("aria-valuemax")]).toEqual(expected);
    });
  }
});

/**
 * A 12-hour clock's bounds, per period.
 *
 * `isHourDisabled` tested `hour * 60` with no period, so on a 12-hour clock
 * every hour was read as AM: bounded 09:00-17:00, 1-5 PM came out disabled and
 * the slider (which reports the enabled range) inherited it. Each case states
 * the face it expects in one period, with the bounds as a 24-hour range.
 */
const TWELVE_HOUR_CASES: Array<{
  name: string;
  minTime: string;
  maxTime: string;
  value: string;
  enabled: number[];
}> = [
  { name: "09:00-17:00, in the PM", minTime: "09:00", maxTime: "17:00", value: "02:00 PM", enabled: [12, 1, 2, 3, 4, 5] },
  { name: "09:00-17:00, in the AM", minTime: "09:00", maxTime: "17:00", value: "10:00 AM", enabled: [9, 10, 11] },
  { name: "11:00-13:00 crossing noon, in the AM", minTime: "11:00", maxTime: "13:00", value: "11:00 AM", enabled: [11] },
  { name: "11:00-13:00 crossing noon, in the PM", minTime: "11:00", maxTime: "13:00", value: "12:30 PM", enabled: [12, 1] },
  { name: "13:00-18:00 all in the PM, in the PM", minTime: "13:00", maxTime: "18:00", value: "03:00 PM", enabled: [1, 2, 3, 4, 5, 6] },
  { name: "13:00-18:00 all in the PM, in the AM", minTime: "13:00", maxTime: "18:00", value: "09:00 AM", enabled: [] },
];

describe("TimePicker 12-hour clock bounds", () => {
  beforeEach(() => setReducedMotion(false));

  for (const c of TWELVE_HOUR_CASES) {
    it(`enables exactly the in-range hours: ${c.name}`, async () => {
      render(
        <TimePicker mode="clock" format="12h" defaultOpen minTime={c.minTime} maxTime={c.maxTime} defaultValue={c.value} />,
      );
      await lazyLoaded();
      const slider = screen.getByRole("slider");
      const hours = numbersOf();
      expect(hours.map((el) => Number(el.textContent)).sort((a, b) => a - b)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
      const enabled = hours.filter((el) => !el.hasAttribute("data-disabled")).map((el) => Number(el.textContent));
      expect([...enabled].sort((a, b) => a - b)).toEqual([...c.enabled].sort((a, b) => a - b));
      if (c.enabled.length) {
        // The slider's range is the enabled set in the slider's own units, the hour shown (1-12).
        expect([Number(slider.getAttribute("aria-valuemin")), Number(slider.getAttribute("aria-valuemax"))]).toEqual([
          Math.min(...c.enabled),
          Math.max(...c.enabled),
        ]);
      }
    });
  }
});
