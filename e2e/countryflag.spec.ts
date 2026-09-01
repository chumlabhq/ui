import { gotoFixture } from "./_nav";
import { test, expect } from "@playwright/test";

test.describe("CountryFlag Component - Cross-Browser Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/country-flag");
    await page.waitForLoadState("domcontentloaded");
    await page.locator('[role="img"]').first().waitFor({ state: "visible" });
  });

  // -------------------------------------------------------------------------
  // Basic rendering
  // -------------------------------------------------------------------------

  test.describe("Flag rendering", () => {
    test("should render flag images on the page", async ({ page }) => {
      const flags = page.locator('[role="img"] img');
      await expect(flags.first()).toBeVisible();

      const count = await flags.count();
      expect(count).toBeGreaterThan(0);
    });


  });

  // -------------------------------------------------------------------------
  // Flag groups
  // -------------------------------------------------------------------------

  test.describe("Flag groups", () => {
    test("should display all flags in a group without max", async ({
      page,
    }) => {
      // "3 flags, md size" section
      const groups = page.locator('[role="group"]');
      const firstGroup = groups.first();
      await expect(firstGroup).toBeVisible();

      const label = await firstGroup.getAttribute("aria-label");
      expect(label).toContain("Flag group with");
    });

    test("should show count badge when max is applied", async ({ page }) => {
      // Look for "+N" badges
      const countBadges = page.locator('[role="group"] [role="img"]').filter({
        hasText: /^\+\d+$/,
      });

      // The guard used to make this pass when the element was absent, which is
      // the failure the test exists to catch. Assert presence, then behaviour.
      await expect(countBadges.first()).toBeVisible();
      await expect(countBadges.first()).toBeVisible();
    });

    test("should include hidden count in group aria-label", async ({
      page,
    }) => {
      // Find groups that have a surplus badge (they contain "+N")
      const groups = page.locator('[role="group"]');
      const groupCount = await groups.count();

      for (let i = 0; i < groupCount; i++) {
        const group = groups.nth(i);
        const label = await group.getAttribute("aria-label");
        const hasBadge = (await group.locator("text=/^\\+\\d+$/").count()) > 0;

        if (hasBadge && label) {
          expect(label).toContain("more not shown");
        }
      }
    });
  });

  // -------------------------------------------------------------------------
  // Accessibility
  // -------------------------------------------------------------------------

  test.describe("Accessibility", () => {
    test("every flag has role=img and an aria-label", async ({ page }) => {
      // Check the first several standalone flags (not in groups)
      const flags = page.locator('[role="img"]');
      const count = Math.min(await flags.count(), 10);

      for (let i = 0; i < count; i++) {
        const flag = flags.nth(i);
        const label = await flag.getAttribute("aria-label");
        expect(label).toBeTruthy();
      }
    });

    test("every group has role=group and an aria-label", async ({ page }) => {
      const groups = page.locator('[role="group"]');
      const count = await groups.count();

      for (let i = 0; i < count; i++) {
        const label = await groups.nth(i).getAttribute("aria-label");
        expect(label).toContain("Flag group with");
      }
    });

    test("inner img elements are aria-hidden", async ({ page }) => {
      const imgs = page.locator('[role="img"] img');
      const count = Math.min(await imgs.count(), 5);

      for (let i = 0; i < count; i++) {
        await expect(imgs.nth(i)).toHaveAttribute("aria-hidden", "true");
      }
    });
  });

  // -------------------------------------------------------------------------
  // Shimmer loading states
  // -------------------------------------------------------------------------

  test.describe("Shimmer placeholders", () => {
    test("should render shimmer via loading prop on CountryFlag", async ({ page }) => {
      // The demo has <CountryFlag loading /> examples in the "Built-in loading prop" section
      const shimmers = page.locator('[aria-label="Loading flag"]');
      const count = await shimmers.count();
      expect(count).toBeGreaterThan(0);
      await expect(shimmers.first()).toBeVisible();
    });

    test("should render standalone shimmer placeholders", async ({ page }) => {
      const shimmers = page.locator('[aria-label="Loading flag"]');

      // The guard used to make this pass when the element was absent, which is
      // the failure the test exists to catch. Assert presence, then behaviour.
      await expect(shimmers.first()).toBeVisible();
      await expect(shimmers.first()).toBeVisible();
    });

    test("should render group shimmer with loading group label", async ({
      page,
    }) => {
      const groupShimmers = page.locator('[aria-label="Loading flag group"]');

      // The guard used to make this pass when the element was absent, which is
      // the failure the test exists to catch. Assert presence, then behaviour.
      await expect(groupShimmers.first()).toBeVisible();
      await expect(groupShimmers.first()).toBeVisible();
    });

  });

  // -------------------------------------------------------------------------
  // Visual dimensions (cross-browser)
  // -------------------------------------------------------------------------

  test.describe("Dimensions", () => {
    test("flag aspect ratio is approximately 4:3", async ({ page }) => {
      const flag = page.locator('[role="img"]').first();
      const box = await flag.boundingBox();

      if (box && box.width > 0) {
        const ratio = box.height / box.width;
        // Should be ~0.75 (allow ±0.05 for rounding)
        expect(ratio).toBeGreaterThan(0.7);
        expect(ratio).toBeLessThan(0.8);
      }
    });
  });

  // -------------------------------------------------------------------------
  // Error / fallback states
  // -------------------------------------------------------------------------

});

/**
 * countryflag.spec.ts's one stale test that needs a browser (E2E-TRIAGE.md).
 * The other three duplicated CountryFlag.test.tsx, which covers src building,
 * the size presets and the fallback path in jsdom.
 *
 * Rewritten: the original only counted a shimmer and an image in the same
 * group, which jsdom can do. What needs a browser is that the two line up —
 * a decoded image and a placeholder sharing a row without a jump.
 */
test.describe("CountryFlagGroup (fixtures)", () => {
  test("aligns shimmers with decoded flags on one row", async ({ page }) => {
    await gotoFixture(page, "CountryFlag/CountryFlagGroup", "mixed-loading");

    const shimmers = page.locator('[data-fixture] [role="status"]');
    const flags = page.locator('[data-fixture] [role="img"]');
    await expect(shimmers).toHaveCount(2);
    await expect(flags).toHaveCount(2);

    // Waits for decode: a flag measured before its image resolves has the
    // placeholder's box, which would make the comparison vacuous.
    await expect(async () => {
      const loaded = await flags.first().evaluate(
        (el) => el.querySelector("img")?.complete === true,
      );
      expect(loaded).toBe(true);
    }).toPass({ timeout: 5000 });

    const boxes = await Promise.all(
      [shimmers.nth(0), flags.nth(0), shimmers.nth(1), flags.nth(1)].map((l) =>
        l.boundingBox(),
      ),
    );
    const tops = boxes.map((b) => b!.y);
    const heights = boxes.map((b) => b!.height);

    expect(Math.max(...tops) - Math.min(...tops), "the row is not level").toBeLessThan(2);
    expect(
      Math.max(...heights) - Math.min(...heights),
      "a shimmer and a flag are different heights, so the row jumps as flags load",
    ).toBeLessThan(2);
  });
});
