import { test, expect, type Locator, type Page } from "./_test";

/**
 * Every composition recipe, used end to end.
 *
 * The demo-scenarios contract proves from the AST that each recipe section
 * holds the components it composes; this proves they work together the way
 * the section says, as a reader would use them:
 *
 *   - Date and time together: the readout joins the picked day and time;
 *   - A wizard with fields: Next is disabled until the step is valid, Back
 *     returns with the values entered, and Finish confirms them;
 *   - Settings form: the FormData readout follows the radio, the switch and
 *     the checkbox, each of which submits only while on, as a native checkbox
 *     does;
 *   - Tabs holding forms: a value typed on one tab is still there after
 *     switching away and back;
 *   - A toast after submit: the toast shows the value the form submitted;
 *   - Avatars in rows: an avatar renders in the table's cell and in the
 *     dropdown's option;
 *   - A code in a dialog: completing the code closes the Modal and the page
 *     shows the code;
 *   - Over a folder's contents: opening a folder adds a crumb, and a crumb
 *     takes the table back up.
 */

const sectionOf = (page: Page, title: string) =>
  page.locator("section").filter({ has: page.getByRole("heading", { name: title, exact: true }) });

async function open(page: Page, route: string, title: string): Promise<Locator> {
  await page.goto(`/${route}`, { waitUntil: "networkidle" });
  const section = sectionOf(page, title);
  await expect(section, `/${route}: no "${title}" section`).toHaveCount(1);
  await section.scrollIntoViewIfNeeded();
  return section;
}

type Recipe = { name: string; route: string; title: string; run: (section: Locator, page: Page) => Promise<string> };

const RECIPES: Recipe[] = [
  {
    name: "date and time",
    route: "date-picker",
    title: "Date and time together",
    run: async (section, page) => {
      const readout = section.locator("[data-demo-appointment]");
      await expect(readout).toHaveText("Pick a day and a time.");
      await section.getByRole("combobox", { name: "Day" }).click();
      await page.locator("[role=grid] [role=gridcell]").filter({ hasText: /^15$/ }).first().click();
      await expect(readout, "a day alone set the appointment").toHaveText("Pick a day and a time.");
      const time = section.getByRole("combobox", { name: "Time" });
      await time.fill("09:30");
      await time.press("Enter");
      await expect(readout).toHaveText(/^Appointment: \w+day, 15 \w+ \d{4} at 09:30$/);
      return (await readout.textContent()) ?? "";
    },
  },
  {
    name: "wizard",
    route: "stepper",
    title: "A wizard with fields",
    run: async (section) => {
      const next = section.getByRole("button", { name: "Next", exact: true });
      const back = section.getByRole("button", { name: "Back", exact: true });
      await expect(next, "Next is enabled on an empty step").toBeDisabled();
      const name = section.getByRole("textbox", { name: "Full name" });
      await name.fill("A");
      await expect(next, "Next is enabled on a one-letter name").toBeDisabled();
      await name.fill("Ada Lovelace");
      await expect(next).toBeEnabled();
      await next.click();
      await expect(next, "Next is enabled before a plan is picked").toBeDisabled();
      await section.getByRole("combobox", { name: "Plan" }).click();
      await section.page().getByRole("option", { name: "Team" }).click();
      await expect(next).toBeEnabled();
      await back.click();
      await expect(section.getByRole("textbox", { name: "Full name" }), "Back lost the name").toHaveValue("Ada Lovelace");
      await next.click();
      await expect(section.getByRole("combobox", { name: "Plan" }), "Back lost the plan").toContainText("Team");
      await next.click();
      const review = section.locator("[data-demo-wizard-review]");
      await expect(review).toHaveText("Ada Lovelace, team plan. Finish to confirm.");
      await section.getByRole("button", { name: "Finish", exact: true }).click();
      await expect(review).toHaveText("Done: Ada Lovelace on the team plan.");
      return "valid-only Next, values kept on Back";
    },
  },
  {
    name: "settings form",
    route: "radio-button",
    title: "Settings form",
    run: async (section) => {
      const readout = section.locator("[data-demo-form-readout]");
      await section.getByRole("button", { name: "Submit", exact: true }).click();
      await expect(readout).toHaveText("theme=system\ndigest=weekly");
      await section.getByRole("radio", { name: "Dark" }).check();
      await section.getByRole("switch", { name: "Weekly email digest" }).click();
      await section.getByRole("checkbox", { name: "Try features before they ship" }).check();
      await section.getByRole("button", { name: "Submit", exact: true }).click();
      await expect(readout, "the switch, off, submitted an entry").toHaveText("theme=dark\nbeta=on");
      return (await readout.textContent())?.replace(/\n/g, " ") ?? "";
    },
  },
  {
    name: "tabs holding forms",
    route: "tab-panel",
    title: "Tabs holding forms",
    run: async (section) => {
      await section.getByRole("textbox", { name: "Display name" }).fill("Ada");
      await section.getByRole("tab", { name: "Contact" }).click();
      await section.getByRole("textbox", { name: "Email" }).fill("ada@example.com");
      await section.getByRole("tab", { name: "Profile" }).click();
      await expect(section.getByRole("textbox", { name: "Display name" }), "switching tabs lost the name").toHaveValue("Ada");
      await section.getByRole("tab", { name: "Contact" }).click();
      await expect(section.getByRole("textbox", { name: "Email" }), "switching tabs lost the email").toHaveValue("ada@example.com");
      await expect(section.locator("[data-demo-tabs-readout]")).toHaveText("Name: Ada · Email: ada@example.com");
      return "both values kept across tab switches";
    },
  },
  {
    name: "toast after submit",
    route: "toast",
    title: "A toast after submit",
    run: async (section, page) => {
      await section.getByRole("textbox", { name: "Email" }).fill("ada@example.com");
      await section.getByRole("button", { name: "Subscribe", exact: true }).click();
      const toast = page.getByRole("region", { name: "Notifications" }).getByText("Subscribed ada@example.com", { exact: true });
      await expect(toast).toBeVisible();
      return "Subscribed ada@example.com";
    },
  },
  {
    name: "avatars in rows",
    route: "avatar",
    title: "Avatars in rows",
    run: async (section, page) => {
      // The table is a data grid: its cells are gridcells, so they are found by tag.
      const cell = section.locator("td").filter({ hasText: "Grace Hopper" });
      await expect(cell.getByRole("img", { name: "Grace Hopper" }), "no avatar in the table cell").toBeVisible();
      await section.getByRole("combobox", { name: "Assign to" }).click();
      const option = page.getByRole("option", { name: /Alan Turing/ });
      await expect(option.getByRole("img", { name: "Alan Turing" }), "no avatar in the dropdown option").toBeVisible();
      await page.keyboard.press("Escape");
      return "avatar in the cell and in the option";
    },
  },
  {
    name: "code in a dialog",
    route: "otp-input",
    title: "A code in a dialog",
    run: async (section, page) => {
      const result = section.locator("[data-demo-otp-result]");
      await expect(result).toHaveText("Not verified yet.");
      await section.getByRole("button", { name: "Verify your phone", exact: true }).click();
      const dialog = page.getByRole("dialog", { name: "Enter the code" });
      await expect(dialog).toBeVisible();
      await dialog.locator("input").first().click();
      await page.keyboard.type("482913");
      await expect(dialog, "completing the code did not close the Modal").toBeHidden();
      await expect(result).toHaveText("Verified with code 482913.");
      return "Verified with code 482913.";
    },
  },
  {
    name: "breadcrumb over a folder",
    route: "breadcrumb",
    title: "Over a folder's contents",
    run: async (section) => {
      const crumbs = section.getByRole("navigation");
      await expect(section.locator("td", { hasText: /^notes\.txt$/ })).toBeVisible();
      await section.getByRole("button", { name: "Projects", exact: true }).click();
      await expect(crumbs).toContainText("Projects");
      await section.getByRole("button", { name: "Chumlab", exact: true }).click();
      await expect(section.locator("td", { hasText: /^README\.md$/ })).toBeVisible();
      await crumbs.getByRole("button", { name: "Home", exact: true }).click();
      await expect(section.locator("td", { hasText: /^notes\.txt$/ }), "the Home crumb did not take the table back up").toBeVisible();
      await expect(crumbs).not.toContainText("Chumlab");
      return "down two folders, back up by a crumb";
    },
  },
];

const FLOOR = 7;

test("every composition recipe works end to end", async ({ page }) => {
  test.setTimeout(240_000);
  let ok = 0;
  const failed: string[] = [];
  for (const recipe of RECIPES) {
    try {
      const section = await open(page, recipe.route, recipe.title);
      const shown = await recipe.run(section, page);
      ok += 1;
      console.log(`DEMO_RECIPE ${recipe.name} (/${recipe.route}, "${recipe.title}") ok: ${shown}`);
    } catch (error) {
      failed.push(`${recipe.name}: ${(error as Error).message.split("\n")[0]}`);
      console.log(`DEMO_RECIPE ${recipe.name} (/${recipe.route}, "${recipe.title}") FAILED: ${(error as Error).message.split("\n")[0]}`);
    }
  }
  console.log(`DEMO_RECIPES recipes ${RECIPES.length} (floor ${FLOOR}), ok ${ok}`);
  expect(RECIPES.length).toBeGreaterThanOrEqual(FLOOR);
  expect(failed).toEqual([]);
});
