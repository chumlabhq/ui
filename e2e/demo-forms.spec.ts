import { test, expect, type Locator, type Page } from "./_test";

/**
 * Every form field's "In a form" section works, not just exists.
 *
 * The demo-scenarios contract proves from the AST that each page puts its
 * field, with `name` and `required`, in a form with a Submit and a Reset. That
 * says the JSX is there; this says a reader gets what the page promises:
 *
 *   - blocked: Submit with the field empty is stopped (the readout stays
 *     "Nothing submitted yet.") and focus lands on the field's visible control.
 *     Slider is the documented exception: it always holds a value, so it
 *     submits its default instead;
 *   - submitted: after a real change — clicks, typing, arrow keys — the readout
 *     shows the FormData in the format the field's `.ai.md` documents;
 *   - reset: the form's Reset button puts the readout back, the control shows
 *     its default again, and a second Submit is blocked again (Slider's
 *     submits its default), which is the value back where it started.
 *
 * Modal's "Form in a modal" is checked the same way, with focus held inside
 * the dialog.
 */

interface Page_ {
  route: string;
  /** The section's title. */
  section: string;
  /** Where focus lands when an empty required submit is stopped; null where it cannot be. */
  focus: string | null;
  fill: (form: Locator, page: Page) => Promise<void>;
  /** The documented FormData, one pattern per entry, in order. */
  submits: RegExp[];
  /** What the control shows once reset. */
  defaultShown: (form: Locator) => Promise<void>;
  /** For a field that cannot block: what it submits untouched. */
  submitsUntouched?: RegExp[];
  open?: (page: Page) => Promise<void>;
}

const NOTHING = "Nothing submitted yet.";

const pick = async (form: Locator, page: Page, trigger: string, label: string) => {
  await form.locator(trigger).first().focus();
  await page.keyboard.press("Enter");
  await page.getByRole("option", { name: label, exact: true }).click();
};

const day = (page: Page, n: number) =>
  page.locator("[role=gridcell]:not([data-outside]):visible").filter({ hasText: new RegExp(`^${n}$`) }).first();

const PAGES: Page_[] = [
  {
    route: "dropdown", section: "In a form", focus: "[role=combobox]",
    fill: (form, page) => pick(form, page, "[role=combobox]", "Banana"),
    submits: [/^fruit=b$/],
    defaultShown: async (form) => expect(form.locator("[role=combobox]")).not.toContainText("Banana"),
  },
  {
    route: "searchable-dropdown", section: "In a form", focus: "[role=combobox]",
    fill: (form, page) => pick(form, page, "[role=combobox]", "Banana"),
    submits: [/^fruit=b$/],
    defaultShown: async (form) => expect(form.locator("[role=combobox]")).not.toContainText("Banana"),
  },
  {
    route: "multi-select-dropdown", section: "In a form", focus: "[role=combobox]",
    fill: async (form, page) => { await pick(form, page, "[role=combobox]", "Banana"); await page.getByRole("option", { name: "Cherry", exact: true }).click(); await page.keyboard.press("Escape"); },
    submits: [/^fruits=b$/, /^fruits=c$/],
    defaultShown: async (form) => expect(form).not.toContainText("Cherry"),
  },
  {
    route: "multi-select-searchable-dropdown", section: "In a form", focus: "[role=combobox]",
    fill: async (form, page) => { await pick(form, page, "[role=combobox]", "Banana"); await page.getByRole("option", { name: "Cherry", exact: true }).click(); await page.keyboard.press("Escape"); },
    submits: [/^fruits=b$/, /^fruits=c$/],
    defaultShown: async (form) => expect(form).not.toContainText("Cherry"),
  },
  {
    route: "cascading-dropdown", section: "In a form", focus: "button[aria-haspopup]",
    fill: async (form, page) => {
      await form.locator("button[aria-haspopup]").click();
      await page.getByText("Veg", { exact: true }).click();
      await page.getByText("Carrot", { exact: true }).click();
      await page.keyboard.press("Escape");
    },
    submits: [/^produce=\{"veg":"c"\}$/],
    defaultShown: async (form) => expect(form.locator("button[aria-haspopup]")).not.toContainText("Carrot"),
  },
  {
    route: "date-picker", section: "In a form", focus: "[role=combobox] >> nth=0",
    fill: async (form, page) => {
      const pickers = form.locator("[role=combobox]");
      await pickers.nth(0).click();
      await day(page, 15).click();
      await pickers.nth(1).click();
      await day(page, 10).click();
      await day(page, 12).click();
      await pickers.nth(2).click();
      await day(page, 3).click();
      await day(page, 5).click();
      await page.keyboard.press("Escape");
    },
    submits: [/^day=\d{4}-\d{2}-15$/, /^stay=\d{4}-\d{2}-10\/\d{4}-\d{2}-12$/, /^days=\d{4}-\d{2}-03$/, /^days=\d{4}-\d{2}-05$/],
    defaultShown: async (form) => expect(form.locator("[role=combobox]").first()).not.toContainText("15"),
  },
  {
    route: "time-picker", section: "In a form", focus: "input[role=combobox]",
    fill: async (form) => { const input = form.locator("input[role=combobox]"); await input.fill("14:45"); await input.press("Enter"); },
    submits: [/^time=14:45$/],
    defaultShown: async (form) => expect(form.locator("input[role=combobox]")).toHaveValue(""),
  },
  {
    route: "switch", section: "In a form", focus: "[role=switch]",
    fill: async (form) => form.locator("[role=switch]").click(),
    submits: [/^terms=on$/],
    defaultShown: async (form) => expect(form.locator("[role=switch]")).toHaveAttribute("aria-checked", "false"),
  },
  {
    route: "slider", section: "In a form", focus: null,
    fill: async (form, page) => { await form.locator("[role=slider]").first().focus(); await page.keyboard.press("ArrowRight"); },
    submits: [/^price\[0\]=21$/, /^price\[1\]=80$/],
    submitsUntouched: [/^price\[0\]=20$/, /^price\[1\]=80$/],
    defaultShown: async (form) => expect(form.locator("[role=slider]").first()).toHaveAttribute("aria-valuenow", "20"),
  },
  {
    route: "otp-input", section: "In a form", focus: "[role=group] input >> nth=0",
    fill: async (form, page) => { await form.locator("[role=group] input").first().click(); await page.keyboard.type("123456"); },
    submits: [/^code=123456$/],
    defaultShown: async (form) => expect(form.locator("[role=group] input").first()).toHaveValue(""),
  },
  {
    route: "international-phone-input", section: "In a form", focus: "input[type=tel]",
    fill: async (form) => form.locator("input[type=tel]").fill("2079460000"),
    submits: [/^phone_country=[A-Z]{2}$/, /^phone=\+\d+2079460000$/],
    defaultShown: async (form) => expect(form.locator("input[type=tel]")).toHaveValue(""),
  },
  {
    route: "radio-button", section: "In a form", focus: "input[type=radio] >> nth=0",
    fill: async (form) => form.getByText("Pro", { exact: true }).click(),
    submits: [/^plan=pro$/],
    defaultShown: async (form) => expect(form.locator("input[type=radio]:checked")).toHaveCount(0),
  },
  {
    route: "checkbox", section: "In a form", focus: "input[type=checkbox]",
    fill: async (form) => form.locator("input[type=checkbox]").check(),
    submits: [/^terms=on$/],
    defaultShown: async (form) => expect(form.locator("input[type=checkbox]")).not.toBeChecked(),
  },
  {
    route: "input", section: "In a form", focus: "input[name=email]",
    fill: async (form) => form.locator("input[name=email]").fill("ada@example.com"),
    submits: [/^email=ada@example\.com$/],
    defaultShown: async (form) => expect(form.locator("input[name=email]")).toHaveValue(""),
  },
  {
    route: "text-area", section: "In a form", focus: "textarea",
    fill: async (form) => form.locator("textarea").fill("Hello"),
    submits: [/^message=Hello$/],
    defaultShown: async (form) => expect(form.locator("textarea")).toHaveValue(""),
  },
  {
    route: "modal", section: "Form in a modal", focus: "input[name=email]",
    open: async (page) => {
      await page.locator("section").filter({ has: page.getByRole("heading", { name: "Form in a modal", exact: true }) }).getByRole("button", { name: "Open the form" }).click();
    },
    fill: async (form) => form.locator("input[name=email]").fill("ada@example.com"),
    submits: [/^email=ada@example\.com$/],
    defaultShown: async (form) => expect(form.locator("input[name=email]")).toHaveValue(""),
  },
];

/**
 * The pages walked: the 15 form-field pages and Modal's Form in a modal. It was
 * 15 from D12a (4035b0a3) to G1, one under the 16 the walk has read since D12a,
 * so one page could drop out unnoticed.
 */
const FLOOR = 16;

test("every form field's In a form section blocks, submits and resets as documented", async ({ page }) => {
  test.setTimeout(300_000);
  const counts = { pages: 0, blocked: 0, submitted: 0, reset: 0 };

  for (const p of PAGES) {
    await page.goto(`/${p.route}`, { waitUntil: "networkidle" });
    const section = page.locator("section").filter({ has: page.getByRole("heading", { name: p.section, exact: true }) });
    await expect(section, `${p.route}: no "${p.section}" section`).toHaveCount(1);
    await section.scrollIntoViewIfNeeded();
    if (p.open) await p.open(page);
    const form = p.open ? page.locator("[role=dialog] form[data-demo-form]") : section.locator("form[data-demo-form]");
    await expect(form).toHaveCount(1);
    const readout = form.locator("[data-demo-form-readout]");
    const submit = form.getByRole("button", { name: "Submit", exact: true });
    const reset = form.getByRole("button", { name: "Reset", exact: true });
    const entries = async () => ((await readout.textContent()) ?? "").split("\n");
    // The browser's own word that it refused a submit: an `invalid` event per
    // invalid control, in every engine, on every refusal.
    await form.evaluate((f) => {
      const g = f as HTMLFormElement & { invalids?: number };
      g.invalids = 0;
      f.addEventListener("invalid", () => (g.invalids = (g.invalids ?? 0) + 1), true);
    });
    const invalids = () => form.evaluate((f) => (f as HTMLFormElement & { invalids?: number }).invalids ?? 0);
    // Waits for this submit's payload, not for a line count: "Nothing
    // submitted yet." is one line, so a one-entry count was met before the
    // submit had rendered anything.
    const matches = async (patterns: RegExp[]) => {
      const shown = (got: string[]) => got.length === patterns.length && patterns.every((re, i) => re.test(got[i]));
      return expect
        .poll(async () => shown(await entries()), { message: `${p.route}: readout` })
        .toBe(true)
        .then(() => true, () => false);
    };
    counts.pages += 1;

    // 1. empty and required
    await submit.click();
    let blocked = false;
    if (p.focus) {
      // Focus on the field is the browser's answer to the blocked submit; the
      // readout still saying nothing is only worth reading once it has come.
      await expect(form.locator(p.focus).first(), `${p.route}: focus is not on the field's control`).toBeFocused();
      await expect(readout, `${p.route}: an empty required submit went through`).toHaveText(NOTHING);
      blocked = true;
      counts.blocked += 1;
    } else {
      expect(await matches(p.submitsUntouched!), `${p.route}: the untouched submit is not the documented default`).toBe(true);
    }

    // 2. a real change, then submit
    await p.fill(form, page);
    await submit.click();
    const ok = await matches(p.submits);
    expect.soft(ok, `${p.route}: submitted ${JSON.stringify(await entries())}, documented ${p.submits.join(" ")}`).toBe(true);
    if (ok) counts.submitted += 1;

    // 3. reset
    await reset.click();
    await expect(readout, `${p.route}: Reset left the readout`).toHaveText(NOTHING);
    await p.defaultShown(form);
    const refused = await invalids();
    await submit.click();
    // Wait for the refusal itself, not for focus: Firefox moves focus to a
    // field that submits through a hidden input on the first refused submit
    // only, and leaves it on Submit after that (measured in G7).
    const again = p.focus
      ? await expect
          .poll(invalids, { message: `${p.route}: the submit after Reset was not refused` })
          .toBeGreaterThan(refused)
          .then(async () => (await readout.textContent()) === NOTHING, () => false)
      : await matches(p.submitsUntouched!);
    expect.soft(again, `${p.route}: after Reset the field did not submit its default`).toBe(true);
    if (again) counts.reset += 1;

    console.log(
      `DEMO_FORMS_PAGE ${p.route} "${p.section}" blocked=${p.focus ? blocked : "n/a (always holds a value)"} ` +
        `submitted=${ok} reset=${again}`,
    );
    if (p.open) await page.keyboard.press("Escape");
  }

  console.log(`DEMO_FORMS pages ${counts.pages} (floor ${FLOOR}), blocked ${counts.blocked}, submitted ${counts.submitted}, reset ${counts.reset}`);
  expect(counts.pages).toBeGreaterThanOrEqual(FLOOR);
  expect(counts.submitted).toBe(counts.pages);
  expect(counts.reset).toBe(counts.pages);
  expect(counts.blocked).toBe(PAGES.filter((p) => p.focus).length);
});
