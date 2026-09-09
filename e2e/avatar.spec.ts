import { test, expect } from "@playwright/test";
import { skipWithoutTouchEvents } from "./_helpers";
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

  test("the surplus overlaps like an avatar and stays its size", async ({ page }) => {
    await gotoFixture(page, "Avatar", "group-surplus");

    const members = page.locator('[data-fixture] [role="group"] > div');
    await expect(members).toHaveCount(3);

    const boxes = [];
    for (let i = 0; i < 3; i++) boxes.push((await members.nth(i).boundingBox())!);

    // The claim no unit test can make: the surplus is laid out as a member of
    // the stack, not a caption after it. Reported three times as "a gap between
    // the last avatar and the surplus" while the computed margin looked right,
    // so this measures painted geometry rather than style strings.
    const steps = [boxes[1].x - boxes[0].x, boxes[2].x - boxes[1].x];
    expect(
      Math.abs(steps[1] - steps[0]),
      `surplus steps ${steps[1]}px where the avatars step ${steps[0]}px`,
    ).toBeLessThan(0.5);

    // And it is the avatars' size, not a pill that grows with its digits.
    expect(Math.abs(boxes[2].width - boxes[0].width)).toBeLessThan(0.5);
    expect(Math.abs(boxes[2].height - boxes[0].height)).toBeLessThan(0.5);
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

  test("the surplus keeps its role and name as a circle in the stack", async ({
    page,
  }) => {
    await gotoFixture(page, "Avatar", "group-surplus");
    await injectAxe(page);
    await checkA11y(page, "[data-fixture]", { detailedReport: true });

    // The surplus was restyled twice — pill to circle, then refilled. Neither
    // is allowed to move what it reports: it is a status, it says how many are
    // hidden, and the group still counts every member including them.
    const surplus = page.locator('[data-fixture] [role="status"]');
    await expect(surplus).toHaveCount(1);
    await expect(surplus).toHaveAccessibleName("2 more members not shown");
    await expect(surplus).toHaveText("+2");

    await expect(page.locator('[data-fixture] [role="group"]')).toHaveAccessibleName(
      "Avatar group with 4 members, 2 more not shown",
    );
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
    await skipWithoutTouchEvents(test, page);

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
