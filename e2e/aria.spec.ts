import type { Locator, Page } from "@playwright/test";
import { test, expect } from "./_test";
import { gotoFixture } from "./_nav";
import { settle } from "./_surfaces";

/**
 * What the accessibility tree says, for each property run E's audit found wrong.
 *
 * Read through `getByRole`, which sees what a role and a name resolve to and
 * skips what `aria-hidden` hides. That is the point of the loading rows: five
 * components rendered a `role="status"` inside `aria-hidden`, so the markup looked
 * announced and the tree held nothing. `page.accessibility.snapshot` is gone from
 * Playwright 1.58; this is the replacement its docs name.
 *
 * Each row is one property on one fixture, red on the commit before the fix.
 */

type Row = { component: string; fixture: string; property: string; read: (page: Page) => Promise<boolean> };

/** A role and a name the tree must hold exactly once. */
const once = (role: Parameters<Page["getByRole"]>[0], name: string | RegExp) => async (page: Page) =>
  (await page.getByRole(role, { name }).count()) === 1;

const attr = (locate: (page: Page) => Locator, name: string, want: string | null) => async (page: Page) => {
  await locate(page).first().waitFor({ state: "attached", timeout: 10_000 });
  return (await locate(page).first().getAttribute(name)) === want;
};

/** A status named or reading "Loading", visible to the tree. */
const announcesLoading = async (page: Page) =>
  page
    .getByRole("status")
    .evaluateAll((els) => els.some((el) => /Loading/.test(el.getAttribute("aria-label") ?? el.textContent ?? "")));

const busy = async (page: Page) => (await page.locator('[data-fixture] [aria-busy="true"]').count()) > 0;

const noExposedSvg = async (page: Page) =>
  page.evaluate(() => [...document.querySelectorAll("svg")].every((svg) => !!svg.closest('[aria-hidden="true"]')));

/** No control inside the combobox, the chips' Remove buttons beside it, each named once. */
const chipsBeside = async (page: Page) => {
  const nested = await page.locator('[data-fixture] [role="combobox"]').first().evaluate((el) => el.querySelectorAll('button, a[href], input, [role="button"], [tabindex]').length);
  return nested === 0 && (await page.getByRole("button", { name: /^Remove / }).count()) >= 2;
};

/** The status a success message will arrive in, in the tree and empty before there is one. */
const statusBeforeMessage = async (page: Page) =>
  (await page.getByRole("status").evaluateAll((els) => els.filter((el) => !el.textContent).length)) > 0;

const SUCCESS_FIELDS: Record<string, string> = {"Input": "default", "TextArea": "default", "Checkbox": "default", "Switch": "default", "RadioButton": "default", "Slider": "default", "OtpInput": "default", "TimePicker": "closed", "DatePicker": "closed", "InternationalPhoneInput": "default", "Dropdown": "closed", "SearchableDropdown": "closed", "MultiSelectDropdown": "closed", "MultiSelectSearchableDropdown": "closed", "CascadingDropdown": "closed"};

const ROWS: Row[] = [
  ...Object.entries(SUCCESS_FIELDS).map(
    ([component, fixture]): Row => ({ component, fixture, property: "the success status exists before its message", read: statusBeforeMessage }),
  ),
  ...["MultiSelectDropdown", "MultiSelectSearchableDropdown"].map(
    (component): Row => ({ component, fixture: "multi-value", property: "no interactive element in the combobox", read: chipsBeside }),
  ),
  ...["Input", "TextArea", "RadioButton", "DatePicker", "InternationalPhoneInput", "Checkbox", "OtpInput", "Slider", "TimePicker"].map(
    (component): Row => ({ component, fixture: "loading", property: "status announcing Loading", read: announcesLoading }),
  ),
  ...["Checkbox", "OtpInput", "Slider", "TimePicker"].map(
    (component): Row => ({ component, fixture: "loading", property: "aria-busy", read: busy }),
  ),
  { component: "Slider", fixture: "labelled", property: "a single thumb has no invented name", read: attr((page) => page.getByRole("slider"), "aria-label", null) },
  { component: "Slider", fixture: "range", property: "range thumbs named apart", read: async (page) => (await once("slider", "Minimum")(page)) && (await once("slider", "Maximum")(page)) },
  { component: "TabPanel", fixture: "default", property: "count is an image with its name", read: attr((page) => page.locator('[aria-label="3 items"]'), "role", "img") },
  { component: "Avatar", fixture: "image-decodable", property: "no aria-label on a role-less root", read: attr((page) => page.locator("[data-fixture] [data-has-image]"), "aria-label", null) },
  { component: "Table", fixture: "filterable", property: "no aria-selected without selection", read: attr((page) => page.getByRole("row").nth(1), "aria-selected", null) },
  { component: "Table", fixture: "selectable", property: "aria-selected kept with selection", read: attr((page) => page.getByRole("row").nth(1), "aria-selected", "true") },
  { component: "Table", fixture: "expandable", property: "expand toggle reports aria-expanded", read: attr((page) => page.getByRole("button", { name: "Collapse row" }), "aria-expanded", "true") },
  { component: "Table", fixture: "expandable", property: "expand column header named", read: once("columnheader", "Row details") },
  { component: "Table", fixture: "draggable", property: "drag column header named", read: once("columnheader", "Reorder") },
  { component: "Stepper", fixture: "all-statuses", property: "error step says so", read: async (page) => /error/.test((await page.getByRole("group").first().textContent()) ?? "") },
  { component: "Stepper", fixture: "all-statuses", property: "completed step says so", read: once("button", /Details.*completed/) },
  { component: "DatePicker", fixture: "open-with-value", property: "status holds the visible month", read: async (page) => (await page.getByRole("status").filter({ hasText: "January 2026" }).count()) === 1 },
  { component: "Toast", fixture: "provider-bottom-end", property: "region is live", read: attr((page) => page.getByRole("region", { name: "Notifications" }), "aria-live", "polite") },
  ...[
    ["Breadcrumb", "collapsed"],
    ["CascadingDropdown", "closed"],
    ["Modal", "open"],
    ["Loader", "default"],
    ["TimePicker", "open-clock"],
    ["Table", "filterable"],
  ].map(([component, fixture]): Row => ({ component, fixture, property: "decorative svg hidden from the tree", read: noExposedSvg })),
];

/** Fixed properties, counted from run E's findings (REPORT.md, phase 2): nine loading rows, four busy, and 19 others. */
const FLOOR = 49;

test.describe("accessibility tree", () => {
  test("every fixed property reads as fixed", async ({ page }) => {
    test.slow();
    const failed: string[] = [];
    for (const row of ROWS) {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await gotoFixture(page, row.component, row.fixture);
      await settle(page, `${row.component}/${row.fixture}`);
      if (!(await row.read(page))) failed.push(`${row.component}/${row.fixture}: ${row.property}`);
    }
    console.log(`ARIA rows ${ROWS.length}, floor ${FLOOR}, failed ${failed.length}`);
    expect(ROWS.length, "a property fell off the list").toBeGreaterThanOrEqual(FLOOR);
    expect(failed).toEqual([]);
  });
});
