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
});
