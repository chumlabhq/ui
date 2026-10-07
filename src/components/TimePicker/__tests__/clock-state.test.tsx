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
    expect(bounded!.props).toMatchObject({ variant: "clock", minTime: "09:00", maxTime: "17:00" });
  });

  for (const mode of ["hours", "minutes"] as const) {
    it(`marks every disabled ${mode} number aria-disabled, and no enabled one`, async () => {
      render(<TimePicker {...propsFor(mode)} />);
      // The popover mounts a frame after `defaultOpen`; `findBy` waits for it rather than assuming it.
      await screen.findByRole("slider");
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
      await screen.findByRole("slider");
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
