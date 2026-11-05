import type { Page } from "@playwright/test";
import { expect, test } from "./_test";
import { fixturePath } from "./_nav";
import { settle } from "./_surfaces";

/**
 * What a consumer is told, read through the rendered component. Run F's audit
 * measured every documented callback in chromium; each row here is one that was
 * wrong, in all three engines. A row that says a callback stays quiet ends with
 * an action that does fire it, so the log it reads could have held something.
 */
type Call = { name: string; args: unknown[] };

const open = async (page: Page, component: string, fixture: string, spy: string) => {
  await page.setViewportSize({ width: 1024, height: 800 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(`${fixturePath(component, fixture)}${spy ? `?spy=${spy}` : ""}`, { waitUntil: "domcontentloaded" });
  await settle(page, `${component}/${fixture}`);
  await page.mouse.move(1010, 790);
};

const log = (page: Page, name?: string) =>
  page.evaluate((n) => {
    const calls = (window as unknown as { __fixtureCallLog?: Call[] }).__fixtureCallLog ?? [];
    return (n ? calls.filter((c) => c.name === n) : calls).map((c) => c.args);
  }, name);

const expectCalls = (page: Page, name: string, want: unknown[][]) => expect.poll(() => log(page, name)).toEqual(want);

const paste = (page: Page, text: string) =>
  page.locator('input[type="tel"], input').first().evaluate((input, value) => {
    (input as HTMLElement).focus();
    const event = new Event("paste", { bubbles: true, cancelable: true });
    Object.defineProperty(event, "clipboardData", { value: { getData: () => value } });
    input.dispatchEvent(event);
  }, text);

test.describe("callbacks", () => {
  test("Slider onValueCommit reports the new value on a key, and nothing when nothing moved", async ({ page }) => {
    await open(page, "Slider", "callbacks", "onValueCommit");
    const thumb = page.getByRole("slider");
    await thumb.focus();
    await page.keyboard.press("ArrowRight");
    await expectCalls(page, "onValueCommit", [[51]]);
    await page.keyboard.press("End");
    await expectCalls(page, "onValueCommit", [[51], [100]]);
    await page.keyboard.press("End");
    const box = (await thumb.boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.up();
    await page.keyboard.press("ArrowLeft");
    await expectCalls(page, "onValueCommit", [[51], [100], [99]]);
  });

  test("DatePicker onMonthChange reports keyboard paging and the return on reopening", async ({ page }) => {
    await open(page, "DatePicker", "callbacks", "onMonthChange,onValueChange");
    const trigger = page.getByRole("combobox");
    await trigger.click();
    await expect(page.locator('[role="gridcell"][tabindex="0"]')).toBeFocused();
    await page.keyboard.press("ArrowRight");
    await expectCalls(page, "onMonthChange", [["date:2026-10-1"]]);
    await page.keyboard.press("PageDown");
    await expectCalls(page, "onMonthChange", [["date:2026-10-1"], ["date:2026-11-1"]]);
    await page.keyboard.press("Escape");
    await trigger.click();
    await expectCalls(page, "onMonthChange", [["date:2026-10-1"], ["date:2026-11-1"], ["date:2026-9-1"]]);
  });

  test("DatePicker onValueChange stays quiet when the selected day is pressed again", async ({ page }) => {
    await open(page, "DatePicker", "callbacks", "onValueChange");
    const trigger = page.getByRole("combobox");
    const day = (n: number) => page.locator('[role="gridcell"]').filter({ hasText: new RegExp(`^${n}$`) }).first();
    await trigger.click();
    await expect(page.locator('[role="grid"]')).toBeVisible();
    await page.locator('[role="gridcell"][aria-selected="true"]').click();
    await expect(page.locator('[role="grid"]')).toHaveCount(0);
    await trigger.click();
    await day(20).click();
    await expect.poll(async () => (await log(page, "onValueChange")).map((a) => a[0])).toEqual(["date:2026-9-20"]);
  });

  test("InternationalPhoneInput names the US for a pasted +1 number", async ({ page }) => {
    await open(page, "InternationalPhoneInput", "callbacks", "onCountryChange,onPasteDetect");
    await paste(page, "+14155550100");
    await expect.poll(async () => (await log(page, "onCountryChange")).map((a) => (a[0] as { value: string }).value)).toEqual(["US"]);
    await expect.poll(async () => (await log(page, "onPasteDetect")).map((a) => (a[0] as { detectedCountry: { value: string } }).detectedCountry.value)).toEqual(["US"]);
  });

  test("Pagination onRowsPerPageChange stays quiet on the current option", async ({ page }) => {
    await open(page, "Pagination", "callbacks", "onRowsPerPageChange");
    const trigger = page.locator('[role="combobox"]');
    await trigger.click();
    const options = page.getByRole("option");
    await expect(options).toHaveCount(2);
    await options.filter({ hasText: "10" }).click();
    await expect(options).toHaveCount(0);
    await trigger.click();
    await page.getByRole("option", { name: /25/ }).click();
    await expectCalls(page, "onRowsPerPageChange", [[25]]);
  });

  test("ResizablePanel pairs start and end on a drag, none on a bare press, and closes an abandoned drag", async ({ page }) => {
    await open(page, "ResizablePanel", "callbacks", "onResizeStart,onResizeEnd");
    const handle = page.getByRole("separator");
    const box = (await handle.boundingBox())!;
    const x = box.x + box.width / 2;
    const y = box.y + box.height / 2;
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.up();
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x + 40, y);
    await expectCalls(page, "onResizeStart", [[300]]);
    await page.keyboard.press("Escape");
    await expectCalls(page, "onResizeEnd", [[300]]);
    await page.mouse.up();
    await expectCalls(page, "onResizeStart", [[300]]);
  });

  test("TimePicker onValueChange stays quiet when the field is left with the time it had", async ({ page }) => {
    await open(page, "TimePicker", "callbacks", "onValueChange");
    const input = page.locator('input[role="combobox"], input').first();
    await input.click();
    await page.keyboard.press("Tab");
    await input.click();
    await input.fill("10:15");
    await page.keyboard.press("Enter");
    await expect.poll(async () => (await log(page, "onValueChange")).map((a) => a[0])).toEqual(["10:15"]);
  });

  test("Toast uses the id it is given and reports it on dismissal", async ({ page }) => {
    await open(page, "Toast", "callbacks", "");
    await page.locator("[data-show-toast]").click();
    await expectCalls(page, "returned", [["saved"]]);
    await page.getByRole("button", { name: /close|dismiss/i }).click();
    await expectCalls(page, "onDismiss", [["saved"]]);
  });

  test("Table onRowHover reports leaving once", async ({ page }) => {
    await open(page, "Table", "callbacks", "onRowHover,onCursorPositionChange");
    await page.getByRole("gridcell", { name: "Ada" }).hover();
    await expect.poll(async () => (await log(page, "onRowHover")).map((a) => a[0])).toEqual([0]);
    await page.mouse.move(1010, 790);
    await expect.poll(async () => (await log(page, "onRowHover")).map((a) => a[0])).toEqual([0, null]);
  });

  test("Table onHeaderHoverChange fires alone, once for each state", async ({ page }) => {
    await open(page, "Table", "callbacks", "onHeaderHoverChange");
    await page.getByRole("columnheader", { name: "Name" }).hover();
    await expectCalls(page, "onHeaderHoverChange", [[true]]);
    await page.getByRole("columnheader", { name: "Role" }).hover();
    await page.getByRole("gridcell", { name: "Ada" }).hover();
    await expectCalls(page, "onHeaderHoverChange", [[true], [false]]);
  });

  test("Table onCellEdit stays quiet when an edit changes nothing", async ({ page }) => {
    await open(page, "Table", "callbacks-editable", "onCellEdit");
    const cell = page.getByRole("gridcell", { name: "Ada" });
    await cell.dblclick();
    await page.keyboard.press("Enter");
    await cell.dblclick();
    await page.keyboard.press("End");
    await page.keyboard.type("x");
    await page.keyboard.press("Enter");
    await expectCalls(page, "onCellEdit", [["1", "name", "Adax"]]);
  });

  test('Table selectionMode="single" selects by a press and by Enter', async ({ page }) => {
    await open(page, "Table", "callbacks-single", "onSelectedRowIdsChange");
    await page.getByRole("gridcell", { name: "Ada" }).click();
    await expectCalls(page, "onSelectedRowIdsChange", [[["1"]]]);
    await page.getByRole("gridcell", { name: "Grace" }).focus();
    await page.keyboard.press("Enter");
    await expectCalls(page, "onSelectedRowIdsChange", [[["1"]], [["2"]]]);
  });

  test("Table onRowClick fires on Enter on a cell", async ({ page }) => {
    await open(page, "Table", "callbacks", "onRowClick");
    await page.getByRole("gridcell", { name: "Ada" }).focus();
    await page.keyboard.press("Enter");
    await expect.poll(async () => (await log(page, "onRowClick")).map((a) => (a[0] as { name: string }).name)).toEqual(["Ada"]);
  });

  test("Table onColumnOrderChange and onGroupByChange fire from a column's render with no state yet", async ({ page }) => {
    await open(page, "Table", "callbacks-header-order", "onColumnOrderChange");
    await page.locator("[data-header-action]").click();
    await expectCalls(page, "onColumnOrderChange", [[["role", "name"]]]);
    await open(page, "Table", "callbacks-header-group", "onGroupByChange");
    await page.locator("[data-header-action]").click();
    await expectCalls(page, "onGroupByChange", [[["name"]]]);
  });

  test("Drawer onTransitionEnd fires for a defaultOpen drawer, and a sheet drags up to its next snap point", async ({ page }) => {
    await open(page, "Drawer", "callbacks", "onTransitionEnd,onSnapPointIndexChange");
    await expectCalls(page, "onTransitionEnd", [[true]]);
    const handle = page.locator("[data-drawer-handle]");
    const box = (await handle.boundingBox())!;
    const x = box.x + box.width / 2;
    const y = box.y + box.height / 2;
    await page.mouse.move(x, y);
    await page.mouse.down();
    for (let moved = 40; moved <= 400; moved += 40) await page.mouse.move(x, y - moved);
    await page.mouse.up();
    await expectCalls(page, "onSnapPointIndexChange", [[1]]);
  });
});
