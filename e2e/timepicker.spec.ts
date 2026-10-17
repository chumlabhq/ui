import { test, expect } from "./_test";
import { gotoFixture } from "./_nav";

/**
 * The clock is a popup of the input, not a modal dialog.
 *
 * It declared `aria-modal="true"` and never took focus: opened by click, by
 * ArrowDown or by typing, in chromium, firefox and webkit, the active element
 * stayed the input, and Tab or Enter closed the clock rather than entering it.
 * `aria-modal` tells assistive technology that everything outside the dialog is
 * inert, so the control the user was on was declared out of reach. The input
 * already says what it opens — `aria-haspopup="dialog"`, `aria-expanded` and
 * `aria-controls` — so the clock is tied to it and claims no modality.
 *
 * Open at mount (`defaultOpen`), it takes no focus at all since L24, like a
 * native <select>: the reader enters the field, and from then on the clock is
 * tied to the focused input like any other open.
 */
const CLOCKS = ["open-clock", "open-clock-12h", "open-bounded"];

for (const fixture of CLOCKS) {
  test(`TimePicker/${fixture}: the open clock is non-modal and tied to the focused input`, async ({ page }) => {
    await gotoFixture(page, "TimePicker", fixture);
    const input = page.locator('[data-fixture] input[role="combobox"]');
    const clock = page.getByRole("dialog");

    const check = async (how: string, focused = true) => {
      await expect(clock).toBeVisible();
      if (focused) await expect(input).toBeFocused();
      else expect(await page.evaluate(() => document.activeElement === document.body), "a clock open at mount took the focus").toBe(true);
      const state = await clock.evaluate((el) => {
        const field = document.querySelector('[data-fixture] input[role="combobox"]')!;
        return {
          modal: el.getAttribute("aria-modal"),
          id: el.id,
          controls: field.getAttribute("aria-controls"),
          haspopup: field.getAttribute("aria-haspopup"),
          expanded: field.getAttribute("aria-expanded"),
        };
      });
      console.log(`CLOCK_MODALITY ${fixture} ${how}: ${JSON.stringify(state)}`);
      expect(state.modal, "the clock declares the focused input inert").toBeNull();
      expect(state).toMatchObject({ controls: state.id, haspopup: "dialog", expanded: "true" });
    };

    await check("defaultOpen", false);
    await input.focus();
    await page.keyboard.press("Escape");
    await expect(clock).toHaveCount(0);
    await input.click();
    await check("opened by click");
    await page.keyboard.press("Escape");
    await page.keyboard.press("ArrowDown");
    await check("opened by ArrowDown");
  });
}

/**
 * Every value the clock can set, set from the input by keyboard alone.
 *
 * The clock is a pointer affordance: focus stays in the input while it is
 * open, and its face swallows mousedown so it never takes focus at all. That
 * is only acceptable because the input is a complete keyboard path — 24-hour
 * and 12-hour times, any minute (the clock offers only `minuteStep` ones),
 * both periods, and clearing — with the clock open or closed.
 */
const TYPED: { fixture: string; keys: string; expected: string }[] = [
  { fixture: "open-clock", keys: "14:45", expected: "14:45" },
  { fixture: "open-clock", keys: "0:00", expected: "00:00" },
  { fixture: "open-clock", keys: "23:59", expected: "23:59" },
  { fixture: "open-clock", keys: "14:07", expected: "14:07" },
  { fixture: "open-clock-12h", keys: "7:05 pm", expected: "07:05 PM" },
  { fixture: "open-clock-12h", keys: "12:00 am", expected: "12:00 AM" },
  { fixture: "open-clock", keys: "", expected: "" },
];

for (const clock of ["open", "closed"] as const) {
  test(`TimePicker: the input alone sets every kind of value, with the clock ${clock}`, async ({ page }) => {
    const set: string[] = [];
    for (const { fixture, keys, expected } of TYPED) {
      await gotoFixture(page, "TimePicker", fixture);
      const input = page.locator('[data-fixture] input[role="combobox"]');
      await input.focus();
      if (clock === "closed") await page.keyboard.press("Escape");
      await expect(page.getByRole("dialog")).toHaveCount(clock === "open" ? 1 : 0);
      await page.keyboard.press("ControlOrMeta+a");
      if (keys) await page.keyboard.type(keys);
      else await page.keyboard.press("Backspace");
      await page.keyboard.press("Enter");
      await expect(input, `typing "${keys}" on ${fixture}`).toHaveValue(expected);
      await expect(input).toBeFocused();
      set.push(`"${keys}"->"${expected}"`);
    }
    console.log(`CLOCK_KEYBOARD clock ${clock}: ${set.join(" ")}`);
  });
}

/**
 * A typed time obeys minTime and maxTime, in both variants.
 *
 * Both accepted any time typed into the field: `20:00` on a 09:00-17:00 picker
 * was committed and passed to `onValueChange`, though neither the list nor the
 * clock offers it. It is refused now — the text stays for the user to correct,
 * the field shows its error state with `aria-invalid`, and the value is
 * unchanged. A time off the minute step is still committed: the step is the
 * increment the list and the clock offer, not a constraint.
 */
for (const fixture of ["bounded", "open-bounded"]) {
  test(`TimePicker/${fixture}: typed times outside minTime and maxTime are refused, off-step times are kept`, async ({ page }) => {
    await gotoFixture(page, "TimePicker", fixture);
    const input = page.locator('[data-fixture] input[role="combobox"]');
    const submitted = () => input.evaluate((el) => (el as HTMLInputElement).value);
    const results: string[] = [];
    for (const { keys, commit, value, invalid } of [
      { keys: "20:00", commit: "Enter", value: "20:00", invalid: true },
      { keys: "08:15", commit: "Tab", value: "08:15", invalid: true },
      { keys: "10:07", commit: "Enter", value: "10:07", invalid: false },
    ]) {
      await input.focus();
      await page.keyboard.press("ControlOrMeta+a");
      await page.keyboard.type(keys);
      await page.keyboard.press(commit);
      await expect(input).toHaveValue(value);
      if (invalid) await expect(input).toHaveAttribute("aria-invalid", "true");
      else await expect(input).not.toHaveAttribute("aria-invalid");
      results.push(`${keys}+${commit} -> "${await submitted()}" invalid=${await input.getAttribute("aria-invalid")}`);
    }
    // Refused means nothing reached the form: the field reverts to the last
    // committed time when it is left with garbage, and that is still 10:07.
    await input.focus();
    await page.keyboard.press("ControlOrMeta+a");
    await page.keyboard.type("99");
    await page.keyboard.press("Enter");
    await expect(input).toHaveValue("10:07");
    console.log(`CLOCK_BOUNDS ${fixture}: ${results.join("; ")}; garbage reverts to "10:07"`);
  });
}

for (const keys of [["ArrowDown", "ArrowDown"], ["ArrowUp"]]) {
  test(`TimePicker/open-clock: ${keys.join(", ")} leave nothing highlighted, so Enter commits the typed time`, async ({ page }) => {
    await gotoFixture(page, "TimePicker", "open-clock");
    const input = page.locator('[data-fixture] input[role="combobox"]');
    await input.focus();
    await page.keyboard.press("ControlOrMeta+a");
    await page.keyboard.type("16");
    for (const key of keys) await page.keyboard.press(key);
    await expect(input).not.toHaveAttribute("aria-activedescendant");
    await page.keyboard.press("Enter");
    console.log(`CLOCK_ARROWS open-clock: typed "16", ${keys.join(", ")}, Enter -> "${await input.inputValue()}"`);
    await expect(input).toHaveValue("16:00");
  });
}
