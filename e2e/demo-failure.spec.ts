import { test, expect, type Locator, type Page } from "./_test";

/**
 * Failure on demand, and the two other states a demo used to be unable to show.
 *
 * Every "When loading fails" section hands its component a load from
 * `useFakeLoader`, with a control beside it that makes the next load fail. The
 * demo-scenarios contract proves from the AST that the loader can reject; this
 * proves what a reader sees when it does:
 *
 *   - the section's "Fail" button makes the next load fail;
 *   - the component's documented failure path runs: onLoadError sets `error`
 *     and `errorMessage`, which the field shows in a `role="alert"` (Table's
 *     server-side example shows it in emptyContent, also an alert);
 *   - the retry the section names (opening the list again, typing again,
 *     pointing at the parent again, Try again) recovers, and the error goes.
 *
 * Then TimePicker's typed bounds (L19): a time typed outside minTime/maxTime
 * keeps its text, sets aria-invalid and is not committed; one inside them,
 * off the step, is. And the uncontrolled Modal and Drawer: Show it mounts the
 * overlay open, its own close button closes it with no page state involved,
 * and Show it mounts it open again.
 */

const sectionOf = (page: Page, title: string) =>
  page.locator("section").filter({ has: page.getByRole("heading", { name: title, exact: true }) });

const failNext = async (section: Locator) => {
  await section.getByRole("button", { name: "Fail", exact: true }).click();
  await expect(section.getByRole("button", { name: "Fail", exact: true })).toHaveAttribute("aria-pressed", "true");
};

interface FailureCase {
  route: string;
  /** What the reader does to load. */
  load: (section: Locator, page: Page) => Promise<void>;
  /** The retry the section names. */
  retry: (section: Locator, page: Page) => Promise<void>;
  /** The alert's text, as the page sets it. */
  error: RegExp;
  /** What a good load shows. */
  loaded: (page: Page) => Locator;
}

const openList = async (section: Locator, page: Page) => {
  await section.getByRole("combobox").click();
  void page;
};
const closeAndReopen = async (section: Locator, page: Page) => {
  await page.keyboard.press("Escape");
  await expect(section.getByRole("combobox")).toHaveAttribute("aria-expanded", "false");
  await section.getByRole("combobox").click();
};
const searchFor = (text: string) => async (section: Locator, page: Page) => {
  if ((await section.getByRole("combobox").getAttribute("aria-expanded")) !== "true") await section.getByRole("combobox").click();
  await page.keyboard.type(text);
};

const CASES: FailureCase[] = [
  {
    route: "dropdown", load: openList, retry: closeAndReopen,
    error: /Couldn't load the warehouses/, loaded: (page) => page.getByRole("option", { name: "Amsterdam" }),
  },
  {
    route: "multi-select-dropdown", load: openList, retry: closeAndReopen,
    error: /Couldn't load the toppings/, loaded: (page) => page.getByRole("option", { name: "Mushroom" }),
  },
  {
    route: "searchable-dropdown", load: searchFor("a"), retry: searchFor("m"),
    error: /Couldn't search the cities/, loaded: (page) => page.getByRole("option", { name: "Amsterdam" }),
  },
  {
    route: "multi-select-searchable-dropdown", load: searchFor("s"), retry: searchFor("q"),
    error: /Couldn't search the skills/, loaded: (page) => page.getByRole("option", { name: "SQL" }),
  },
  {
    route: "cascading-dropdown",
    load: async (section, page) => {
      await section.locator("button[aria-haspopup]").click();
      await page.getByText("Design", { exact: true }).hover();
    },
    retry: async (_section, page) => {
      await page.getByText("Sales", { exact: true }).hover();
      await page.getByText("Design", { exact: true }).hover();
    },
    error: /Couldn't load that department's teams/, loaded: (page) => page.getByText("Design North", { exact: true }),
  },
  {
    route: "table",
    load: async (section) => section.getByRole("button", { name: "Reload", exact: true }).click(),
    retry: async (section) => section.getByRole("button", { name: "Try again", exact: true }).click(),
    error: /Couldn't load the orders/, loaded: (page) => sectionOf(page, "When loading fails").getByText("Ada Lovelace", { exact: true }),
  },
];

const FLOOR = 6;

test("every When loading fails section fails on demand, announces it, and recovers", async ({ page }) => {
  test.setTimeout(180_000);
  let sections = 0;
  let recovered = 0;
  for (const c of CASES) {
    await page.goto(`/${c.route}`, { waitUntil: "networkidle" });
    const section = sectionOf(page, "When loading fails");
    await expect(section, `${c.route}: no When loading fails section`).toHaveCount(1);
    await section.scrollIntoViewIfNeeded();
    if (c.route === "table") await expect(section.getByText("Ada Lovelace", { exact: true })).toBeVisible();
    sections += 1;

    await failNext(section);
    await c.load(section, page);
    const alert = section.getByRole("alert").filter({ hasText: c.error });
    await expect(alert, `${c.route}: the failed load showed no alert`).toBeVisible({ timeout: 5000 });
    // The next load is back to succeeding: the control says so.
    await expect(section.locator("[data-demo-next-load]")).toHaveAttribute("data-demo-next-load", "succeed");

    await c.retry(section, page);
    await expect(c.loaded(page).first(), `${c.route}: the retry did not load`).toBeVisible({ timeout: 5000 });
    await expect(section.getByRole("alert").filter({ hasText: c.error }), `${c.route}: the error stayed after a good load`).toHaveCount(0);
    recovered += 1;
    console.log(`DEMO_FAILURE_SECTION /${c.route} failed=alert "${c.error.source}" recovered=true`);
    await page.keyboard.press("Escape");
  }
  console.log(`DEMO_FAILURE sections ${sections} (floor ${FLOOR}), recovered ${recovered}`);
  expect(sections).toBeGreaterThanOrEqual(FLOOR);
  expect(recovered).toBe(sections);
});

test("a typed time outside minTime and maxTime is not committed", async ({ page }) => {
  await page.goto("/time-picker", { waitUntil: "networkidle" });
  const section = sectionOf(page, "Typed times outside the range");
  await section.scrollIntoViewIfNeeded();
  const input = section.locator("input[role=combobox]");
  const committed = section.locator("[data-demo-action]");
  await expect(committed).toHaveText("Committed: 10:00");

  await input.fill("18:30");
  await input.press("Enter");
  await expect(input).toHaveAttribute("aria-invalid", "true");
  await expect(input).toHaveValue("18:30");
  await expect(committed, "an out-of-range typed time was committed").toHaveText("Committed: 10:00");

  await input.fill("09:07");
  await input.press("Enter");
  await expect(committed, "an in-range time off the step was not committed").toHaveText("Committed: 09:07");
  await expect(input).not.toHaveAttribute("aria-invalid", "true");
  console.log("TYPED_BOUNDS ok");
});

test("an uncontrolled Modal and Drawer mount open, close themselves, and mount open again", async ({ page }) => {
  let ok = 0;
  for (const route of ["modal", "drawer"]) {
    await page.goto(`/${route}`, { waitUntil: "networkidle" });
    const section = sectionOf(page, "Uncontrolled");
    await section.scrollIntoViewIfNeeded();
    const show = section.getByRole("button", { name: "Show it", exact: true });
    const dialog = page.getByRole("dialog");

    await expect(dialog).toHaveCount(0);
    await show.click();
    await expect(dialog, `${route}: Show it did not mount it open`).toBeVisible();
    // Its own close button: the page holds no open state to clear.
    await dialog.getByRole("button", { name: /^Close/ }).click();
    await expect(dialog, `${route}: its close button did not close it`).toBeHidden();
    await show.click();
    await expect(dialog, `${route}: Show it did not mount it open again`).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog, `${route}: Escape did not close it`).toBeHidden();
    ok += 1;
    console.log(`DEMO_UNCONTROLLED /${route} opened=true closed-by-itself=true reopened=true`);
  }
  console.log(`DEMO_UNCONTROLLED overlays 2, ok ${ok}`);
  expect(ok).toBe(2);
});

/**
 * defaultOpen, mounted on demand. Opened as the page loads, these moved the
 * page's focus into the middle of the page, and two scrolled it: /date-picker
 * loaded 15,084 px down, and a first press on /cascading-dropdown jumped
 * 13,210 px to the open menu's trigger (CascadingDropdown returns focus to its
 * trigger without preventScroll; owed to L24). So each page loads with nothing
 * open, at the top, and Show it open mounts the component open.
 */
test("each Show it open example loads closed and mounts open", async ({ page }) => {
  const EXAMPLES: Array<[route: string, section: string]> = [
    ["dropdown", "Starts open"],
    ["searchable-dropdown", "Starts open"],
    ["cascading-dropdown", "Starts open"],
    ["time-picker", "Starts open"],
    ["date-picker", "Uncontrolled"],
    ["multi-select-dropdown", "Uncontrolled"],
  ];
  let ok = 0;
  for (const [route, title] of EXAMPLES) {
    await page.goto(`/${route}`, { waitUntil: "networkidle" });
    expect(await page.evaluate(() => scrollY), `${route}: the page loaded scrolled`).toBe(0);
    const section = sectionOf(page, title);
    await section.scrollIntoViewIfNeeded();
    await expect(section.locator('[aria-expanded="true"]'), `${route}: something in "${title}" is open before Show it open`).toHaveCount(0);
    await section.getByRole("button", { name: "Show it open", exact: true }).click();
    await expect(section.locator('[aria-expanded="true"]'), `${route}: Show it open did not mount it open`).toHaveCount(1);
    await page.keyboard.press("Escape");
    ok += 1;
    console.log(`DEMO_DEFAULT_OPEN /${route} "${title}" loaded-closed=true mounted-open=true`);
  }
  console.log(`DEMO_DEFAULT_OPEN examples ${EXAMPLES.length}, ok ${ok}`);
  expect(ok).toBe(EXAMPLES.length);
});
