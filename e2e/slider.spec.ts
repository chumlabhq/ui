import { test, expect } from "@playwright/test";
import { gotoFixture } from "./_nav";

/**
 * ADR 002 R4, browser tier.
 *
 * `data-state="active"` on the thumb replaces the `thumbActive` key, which
 * Task 3 deletes. It is gated on `isDragging`, set from a pointer sequence that
 * calls `setPointerCapture` — jsdom implements no pointer capture, so the state
 * cannot be reached there however the events are faked. Stubbing the capture to
 * force it would assert against a code path the browser never takes.
 *
 * `002-state-attributes.json` marks this requirement `browserTier` and names
 * this file; a guard in state-attributes.contract fails if the attribute is not
 * asserted here, so the classification cannot quietly become a waiver.
 */
test.describe("Slider (fixtures)", () => {
  test("marks the thumb active while it is dragged", async ({ page }) => {
    await gotoFixture(page, "Slider", "dragging");

    const thumb = page.locator('[data-fixture] [role="slider"]').first();
    await expect(thumb).toBeVisible();
    await expect(thumb).not.toHaveAttribute("data-state", "active");

    const box = (await thumb.boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    // Held down, not clicked: the state exists only between pointerdown and
    // pointerup, which is the whole reason jsdom cannot see it.
    await page.mouse.move(box.x + box.width / 2 + 30, box.y + box.height / 2);

    await expect(thumb).toHaveAttribute("data-state", "active");

    await page.mouse.up();
    await expect(thumb).not.toHaveAttribute("data-state", "active");
  });
});
