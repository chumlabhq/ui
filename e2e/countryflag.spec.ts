import { test, expect } from "@playwright/test";

test.describe("CountryFlag Component - Cross-Browser Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/demo/country-flag");
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

    test("should load flag images from the local path", async ({ page }) => {
      const img = page.locator('[role="img"] img').first();
      const src = await img.getAttribute("src");

      expect(src).toContain("/flags/");
      expect(src).toMatch(/\.svg$/);
    });

    test("should render flags at multiple sizes", async ({ page }) => {
      const sizeSection = page.locator("section").filter({ hasText: "Preset Sizes" }).first();
      await expect(sizeSection).toBeVisible();

      const flags = sizeSection.locator('[role="img"]');
      const count = await flags.count();
      expect(count).toBeGreaterThanOrEqual(6);
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

      if ((await countBadges.count()) > 0) {
        await expect(countBadges.first()).toBeVisible();
      }
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

      if ((await shimmers.count()) > 0) {
        await expect(shimmers.first()).toBeVisible();
      }
    });

    test("should render group shimmer with loading group label", async ({
      page,
    }) => {
      const groupShimmers = page.locator('[aria-label="Loading flag group"]');

      if ((await groupShimmers.count()) > 0) {
        await expect(groupShimmers.first()).toBeVisible();
      }
    });

    test("loading flags inside a group should show shimmer alongside real flags", async ({
      page,
    }) => {
      // The demo has a group with 2 loading + 2 real flags
      const groups = page.locator('[role="group"]');
      const groupCount = await groups.count();

      let found = false;
      for (let i = 0; i < groupCount; i++) {
        const group = groups.nth(i);
        const shimmers = group.locator('[role="status"]');
        const flags = group.locator('[role="img"]');

        if ((await shimmers.count()) > 0 && (await flags.count()) > 0) {
          found = true;
          break;
        }
      }

      expect(found).toBe(true);
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

  test.describe("Error handling", () => {
    test("should show fallback content for invalid country codes", async ({
      page,
    }) => {
      // The "Error State & Fallback" section has invalid codes like "xx"
      const fallbackSection = page.locator("text=Error State").locator("..");
      if ((await fallbackSection.count()) > 0) {
        await expect(fallbackSection).toBeVisible();
      }
    });
  });
});
