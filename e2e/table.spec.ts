import { test, expect } from "@playwright/test";
import { gotoFixture } from "./_nav";

/**
 * ADR 002 R4, browser tier.
 *
 * `data-state="active"` on the pin control replaces the `pinnedPinButton` and
 * `pinnedPinIcon` keys, which Task 3 deletes. The control ships at `opacity-0`
 * and appears on `group-hover/header`, so jsdom — which resolves no hover and no
 * computed opacity — would assert against an element the user can never see.
 * That is the same failure the fixture repoint removed elsewhere: a green
 * assertion about something invisible.
 *
 * `002-state-attributes.json` marks this requirement `browserTier` and names
 * this file; a guard in state-attributes.contract fails if the attribute is not
 * asserted here.
 */
test.describe("Table (fixtures)", () => {
  test("marks the pin control active on a pinned column", async ({ page }) => {
    await gotoFixture(page, "Table", "pinned-column");

    const header = page.locator('[data-fixture] th').first();
    await expect(header).toBeVisible();
    // Hover is the point: the control is opacity-0 until the header is entered.
    await header.hover();

    const pinned = page.locator('[data-fixture] button[data-state="active"]').first();
    await expect(pinned).toBeVisible();

    const opacity = await pinned.evaluate((el) => getComputedStyle(el).opacity);
    expect(
      Number(opacity),
      "the pin control reports active but is still transparent",
    ).toBeGreaterThan(0);
  });

  /**
   * `Table.input` — the cell editor — is recorded in `002-unrenderable-keys.json`
   * as "ATTEMPTED, still unreachable", with the note to re-attempt it with a
   * real double-click in the browser tier before Task 3 deletes it. This is that
   * re-attempt, and the key is NOT dead: a real double-click opens the editor.
   *
   * A dispatched `dblclick` does not, and the failure is worth recording. The
   * editor mounts and unmounts inside the same frame — the input autofocuses
   * away from `document.body`, and the cell commits the edit it has only just
   * begun. A real double-click focuses the cell on mousedown first, so the
   * focus never leaves it. That is why the assertion lives here rather than in
   * the fixture's own act.
   */
  test("opens the cell editor on a real double-click", async ({ page }) => {
    await gotoFixture(page, "Table", "editing-cell");

    const cell = page.locator('[data-fixture] tbody td').first();
    await expect(cell).toBeVisible();
    await expect(page.locator('[data-fixture] tbody input')).toHaveCount(0);

    await cell.dblclick();

    const editor = page.locator('[data-fixture] tbody input');
    await expect(editor).toBeVisible();
    await expect(
      page.locator('[data-fixture] td[data-editing="true"]'),
      "the editor is open but the cell does not report it",
    ).toHaveCount(1);
  });
});
