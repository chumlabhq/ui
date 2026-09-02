import { test, expect } from "@playwright/test";
import { injectAxe, checkA11y } from "axe-playwright";
import { gotoFixture } from "./_nav";

/**
 * Five of avatar.spec.ts's twenty-six tests (E2E-TRIAGE.md, Appendix B).
 *
 * Twenty duplicated Avatar.test.tsx — shapes, initials, badges, group surplus,
 * the ARIA wiring — and one measured the dev server. What is left is the
 * overlap geometry, a real image decode, axe, a viewport and a touch.
 */

const AVATAR = "[data-fixture] [data-shape]";

test.describe("Avatar (fixtures)", () => {
  test("overlaps avatars in a group", async ({ page }) => {
    await gotoFixture(page, "Avatar", "in-group");

    const avatars = page.locator(AVATAR);
    await expect(avatars).toHaveCount(3);

    const boxes = [];
    for (let i = 0; i < 3; i++) boxes.push((await avatars.nth(i).boundingBox())!);

    // The claim the unit tier cannot make: each avatar starts before the one
    // before it ends. `:373` asserts the children render, not that they stack.
    for (let i = 1; i < 3; i++) {
      expect(
        boxes[i].x,
        `avatar ${i} does not overlap avatar ${i - 1}`,
      ).toBeLessThan(boxes[i - 1].x + boxes[i - 1].width);
      expect(boxes[i].x).toBeGreaterThan(boxes[i - 1].x);
    }
  });

  test("decodes and shows a real image", async ({ page }) => {
    await gotoFixture(page, "Avatar", "image-decodable");

    const img = page.locator("[data-fixture] img");
    await expect(img).toBeVisible();

    // `naturalWidth` is zero until the bytes decode, so this fails on a broken
    // src where the unit tier's simulated `load` event would still pass.
    await expect(async () => {
      const decoded = await img.evaluate(
        (el) => (el as HTMLImageElement).naturalWidth > 0,
      );
      expect(decoded).toBe(true);
    }).toPass({ timeout: 5000 });
  });

  test("passes an axe audit", async ({ page }) => {
    await gotoFixture(page, "Avatar", "with-status");
    await injectAxe(page);
    await checkA11y(page, "[data-fixture]", { detailedReport: true });
  });

  test("fits inside a 375px viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await gotoFixture(page, "Avatar", "in-group");

    const avatars = page.locator(AVATAR);
    const count = await avatars.count();
    for (let i = 0; i < count; i++) {
      const box = (await avatars.nth(i).boundingBox())!;
      expect(box.x).toBeGreaterThanOrEqual(-1);
      expect(box.x + box.width).toBeLessThanOrEqual(376);
    }
  });

  test("stays interactive under a touch", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await gotoFixture(page, "Avatar", "initials");

    // Dispatched rather than `tap()`: `hasTouch` is off in the desktop
    // projects and `tap()` throws there instead of degrading.
    const avatar = page.locator(AVATAR).first();
    await avatar.dispatchEvent("touchstart");
    await avatar.dispatchEvent("touchend");

    await expect(avatar).toBeVisible();
    await expect(avatar).toHaveAttribute("data-shape");
  });
});
