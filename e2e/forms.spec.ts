import { test, expect, type Page } from "./_test";
import { gotoGuarded } from "./_nav";

/**
 * Every form field inside a real `<form>`, in three engines.
 *
 * L20's step 0 measured, in Chromium, all eleven fields that submitted through
 * `<input type="hidden">` letting an empty `required` field submit, and keeping
 * the changed value on screen and in FormData after `form.reset()`. Input and
 * TextArea ignored reset too, Checkbox and RadioGroup reset their native input
 * and not what they paint, and RadioGroup never put `required` on its radios.
 *
 * Three rows per field:
 * - required and empty: is the submit stopped, and does focus land on the
 *   field's visible control rather than on a hidden input or the button;
 * - uncontrolled, changed, then the form's own Reset button: is what the field
 *   shows back where it started, and is FormData the documented default;
 * - controlled, then Reset: is nothing changed and the change handler uncalled.
 *
 * The fields and their documented FormData come from `_forms.tsx` through the
 * page (`data-documented`, `data-empty`), the same table the contract tier reads.
 * The changes are real input — clicks, typing, arrow keys — not the fixture
 * acts, so this is the user's path and the contract is the fast one.
 */

interface Field {
  /** The component's export name, the route's `:field`. */
  name: string;
  /** Where focus should land when an empty required submit is stopped. */
  focus: string | null;
  change: (page: Page) => Promise<void>;
}

const FORM = "form[data-form-harness]";

const openByKeyboard = async (page: Page, trigger: string) => {
  await page.locator(`${FORM} ${trigger}`).first().focus();
  await page.keyboard.press("Enter");
};

const FIELDS: Field[] = [
  {
    name: "Dropdown",
    focus: "[role=combobox]",
    change: async (page) => {
      await openByKeyboard(page, "[role=combobox]");
      await page.getByRole("option", { name: "Banana" }).click();
    },
  },
  {
    name: "SearchableDropdown",
    focus: "[role=combobox]",
    change: async (page) => {
      await openByKeyboard(page, "[role=combobox]");
      await page.getByRole("option", { name: "Banana" }).click();
    },
  },
  {
    name: "MultiSelectDropdown",
    focus: "[role=combobox]",
    change: async (page) => {
      await openByKeyboard(page, "[role=combobox]");
      await page.getByRole("option", { name: "Banana" }).click();
      await page.keyboard.press("Escape");
    },
  },
  {
    name: "MultiSelectSearchableDropdown",
    focus: "[role=combobox]",
    change: async (page) => {
      await openByKeyboard(page, "[role=combobox]");
      await page.getByRole("option", { name: "Banana" }).click();
      await page.keyboard.press("Escape");
    },
  },
  {
    name: "CascadingDropdown",
    focus: "button[aria-haspopup]",
    change: async (page) => {
      await page.locator(`${FORM} button[aria-haspopup]`).click();
      await page.getByText("Veg", { exact: true }).click();
      await page.getByText("Carrot", { exact: true }).click();
      await page.keyboard.press("Escape");
    },
  },
  {
    name: "DatePicker",
    focus: "[role=combobox]",
    change: async (page) => {
      await page.locator(`${FORM} [role=combobox]`).click();
      await page.getByRole("gridcell", { name: /15/ }).first().click();
    },
  },
  {
    name: "TimePicker",
    focus: "input[role=combobox]",
    change: async (page) => {
      const input = page.locator(`${FORM} input[role=combobox]`);
      await input.fill("14:45");
      await input.press("Enter");
    },
  },
  {
    name: "Switch",
    focus: "[role=switch]",
    change: async (page) => {
      await page.locator(`${FORM} [role=switch]`).click();
    },
  },
  {
    name: "Slider",
    focus: null,
    change: async (page) => {
      await page.locator(`${FORM} [role=slider]`).first().focus();
      await page.keyboard.press("ArrowRight");
    },
  },
  {
    name: "OtpInput",
    focus: "[role=group] input >> nth=0",
    change: async (page) => {
      await page.locator(`${FORM} [role=group] input`).first().click();
      await page.keyboard.type("9");
    },
  },
  {
    name: "InternationalPhoneInput",
    focus: "input[type=tel]",
    change: async (page) => {
      await page.locator(`${FORM} input[type=tel]`).fill("2079460000");
    },
  },
  {
    name: "RadioGroup",
    focus: "input[type=radio] >> nth=0",
    change: async (page) => {
      await page.locator(FORM).getByText("Banana", { exact: true }).click();
    },
  },
  {
    name: "Checkbox",
    focus: "input[type=checkbox]",
    change: async (page) => {
      await page.locator(`${FORM} input[type=checkbox]`).click();
    },
  },
  {
    name: "Input",
    focus: "input",
    change: async (page) => {
      await page.locator(`${FORM} input`).fill("beta");
    },
  },
  {
    name: "TextArea",
    focus: "textarea",
    change: async (page) => {
      await page.locator(`${FORM} textarea`).fill("beta");
    },
  },
];

/** What the field paints, read off its visible control. */
const shown = (page: Page) =>
  page.locator(FORM).evaluate((form) => {
    const visible = (el: Element) => (el as HTMLElement).getAttribute("aria-hidden") !== "true";
    const sw = form.querySelector("[role=switch]");
    if (sw) return `switch ${sw.getAttribute("aria-checked")}`;
    const sliders = [...form.querySelectorAll("[role=slider]")];
    if (sliders.length) return `slider ${sliders.map((s) => s.getAttribute("aria-valuenow")).join(",")}`;
    const cells = [...form.querySelectorAll<HTMLInputElement>("[role=group] input[inputmode=numeric]")];
    if (cells.length) return `cells ${cells.map((c) => c.value || "_").join("")}`;
    const tel = form.querySelector<HTMLInputElement>("input[type=tel]");
    if (tel) return `tel ${tel.value}`;
    const painted = [...form.querySelectorAll("[data-state]")];
    if (form.querySelector("input[type=radio], input[type=checkbox]"))
      return `painted ${painted.map((p) => p.getAttribute("data-state")).join(",")}`;
    const time = form.querySelector<HTMLInputElement>("input[role=combobox]");
    if (time) return `input ${time.value}`;
    const area = form.querySelector("textarea");
    if (area) return `textarea ${area.value}`;
    const trigger = form.querySelector<HTMLElement>("[role=combobox], button[aria-haspopup]");
    if (trigger) return `trigger ${trigger.innerText.replace(/\s+/g, " ").trim()}`;
    const input = [...form.querySelectorAll<HTMLInputElement>("input")].find(visible);
    return `input ${input?.value ?? ""}`;
  });

const formData = (page: Page) =>
  page.locator(FORM).evaluate((form) =>
    [...new FormData(form as HTMLFormElement).entries()].map(([k, v]) => `${k}=${String(v)}`),
  );

const attr = async (page: Page, name: string) => (await page.locator(FORM).getAttribute(name)) ?? "";

const open = async (page: Page, field: string, mode: string) => {
  await gotoGuarded(page, `/__fixtures/forms/${field}?mode=${mode}`, `${FORM}[data-mode=${mode}]`);
  await page.evaluate(() => document.fonts.ready);
};

const rows: string[] = [];

test.describe("Form fields in a native form", () => {
  test.afterAll(({ browserName }) => {
    console.log(`FORMS_MATRIX ${browserName}: ${rows.length} rows\n  ${rows.join("\n  ")}`);
  });

  for (const field of FIELDS) {
    test(`${field.name}: required and empty stops the submit and focuses the field`, async ({ page }) => {
      await open(page, field.name, "required");
      await page.locator(`${FORM} button[type=submit]`).click();
      const blocks = (await attr(page, "data-blocks")) === "true";
      await expect.poll(() => page.locator(FORM).evaluate((f) => (f as HTMLFormElement).checkValidity())).toBe(!blocks);
      if (blocks) {
        await expect(page.locator(`${FORM} ${field.focus}`)).toBeFocused();
        await expect(page.locator(FORM)).toHaveAttribute("data-submits", "0");
      } else {
        await expect(page.locator(FORM)).toHaveAttribute("data-submits", "1");
        expect(await formData(page)).toEqual(JSON.parse(await attr(page, "data-empty")));
      }
      rows.push(`${field.name} required: ${blocks ? "blocked, focus on " + field.focus : "never empty, submitted " + JSON.stringify(await formData(page))}`);
    });

    test(`${field.name}: Reset restores the uncontrolled default`, async ({ page }) => {
      await open(page, field.name, "uncontrolled");
      const documented = JSON.parse(await attr(page, "data-documented")) as string[];
      const before = await shown(page);
      expect(await formData(page)).toEqual(documented);
      await field.change(page);
      await expect.poll(() => formData(page), "the change moved nothing").not.toEqual(documented);
      const changed = await shown(page);
      expect(changed, "the field painted no change").not.toBe(before);
      await page.locator(`${FORM} button[type=reset]`).click();
      await expect.poll(() => shown(page)).toBe(before);
      expect(await formData(page)).toEqual(documented);
      rows.push(`${field.name} reset: "${changed}" -> "${before}" ${JSON.stringify(documented)}`);
    });

    test(`${field.name}: Reset leaves a controlled field alone`, async ({ page }) => {
      await open(page, field.name, "controlled");
      const documented = JSON.parse(await attr(page, "data-documented")) as string[];
      const before = await shown(page);
      await page.locator(`${FORM} button[type=reset]`).click();
      await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
      expect(await shown(page)).toBe(before);
      await expect(page.locator(FORM)).toHaveAttribute("data-changes", "0");
      expect(await formData(page)).toEqual(documented);
    });
  }
});
