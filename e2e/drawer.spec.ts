import { test, expect } from "@playwright/test";
import { injectAxe, checkA11y } from "axe-playwright";

test.describe("Drawer Component - Cross-Browser Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/demo/drawer");
    await page.waitForLoadState("domcontentloaded");
  });

  test.describe("Basic Functionality", () => {
    test("should open drawer on trigger click", async ({ page }) => {
      await page.getByRole("button", { name: "Navigation Menu" }).click();

      const dialog = page.getByRole("dialog", { name: "Navigation menu" });
      await expect(dialog).toBeVisible();
      await expect(dialog).toHaveAttribute("aria-modal", "true");
    });

    test("should close drawer on overlay click", async ({ page }) => {
      await page.getByRole("button", { name: "Navigation Menu" }).click();
      const dialog = page.getByRole("dialog", { name: "Navigation menu" });
      await expect(dialog).toBeVisible();

      const viewport = page.viewportSize()!;
      await page.mouse.click(viewport.width - 50, viewport.height / 2);

      await expect(dialog).not.toBeVisible();
    });

    test("should close drawer on Escape key", async ({ page }) => {
      await page.getByRole("button", { name: "Navigation Menu" }).click();
      const dialog = page.getByRole("dialog", { name: "Navigation menu" });
      await expect(dialog).toBeVisible();

      await page.keyboard.press("Escape");

      await expect(dialog).not.toBeVisible();
    });

    test("should close drawer via DrawerCloseButton", async ({ page }) => {
      await page.getByRole("button", { name: "Shopping Cart" }).click();
      const dialog = page.getByRole("dialog", { name: "Shopping cart" });
      await expect(dialog).toBeVisible();

      await dialog.locator("[data-drawer-close]").click();

      await expect(dialog).not.toBeVisible();
    });
  });

  test.describe("Direction Variants", () => {
    test("should open drawers from all four directions", async ({ page }) => {
      const directions = ["left", "right", "top", "bottom"] as const;

      for (const dir of directions) {
        const trigger = page
          .getByRole("button", { name: dir, exact: true })
          .first();
        await trigger.click();

        const dialog = page.getByRole("dialog", { name: `${dir} drawer` });
        await expect(dialog).toBeVisible();
        await expect(dialog).toHaveAttribute("data-direction", dir);

        await page.keyboard.press("Escape");
        await expect(dialog).not.toBeVisible();
      }
    });
  });

  test.describe("Focus Management", () => {
    test("should trap focus inside modal drawer", async ({
      page,
      browserName,
    }) => {
      await page.getByRole("button", { name: "Shopping Cart" }).click();
      const dialog = page.getByRole("dialog", { name: "Shopping cart" });
      await expect(dialog).toBeVisible();

      await page.waitForFunction(
        () => document.activeElement?.closest("[data-drawer-panel]") !== null,
        null,
        { timeout: 3000 },
      );

      const focusableCount = await dialog
        .locator(
          'button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])',
        )
        .count();
      expect(focusableCount).toBeGreaterThan(0);

      if (browserName !== "webkit") {
        for (let i = 0; i < focusableCount + 2; i++) {
          await page.keyboard.press("Tab");
        }

        const activeInsideDialog = await page.evaluate(() =>
          document.activeElement?.closest("[data-drawer-panel]") ? true : false,
        );
        expect(activeInsideDialog).toBe(true);
      }
    });

    test("should restore focus to trigger on close", async ({
      page,
      browserName,
    }) => {
      const trigger = page.getByRole("button", { name: "Shopping Cart" });
      await trigger.click();
      const dialog = page.getByRole("dialog", { name: "Shopping cart" });
      await expect(dialog).toBeVisible();

      await page.keyboard.press("Escape");
      await expect(dialog).not.toBeVisible();

      if (browserName === "webkit") {
        const focusOutsideDialog = await page.evaluate(
          () => !document.activeElement?.closest("[data-drawer-panel]"),
        );
        expect(focusOutsideDialog).toBe(true);
      } else {
        await page.waitForFunction(
          (text) =>
            document.activeElement?.tagName === "BUTTON" &&
            document.activeElement?.textContent?.includes(text),
          "Shopping Cart",
          { timeout: 3000 },
        );
        await expect(trigger).toBeFocused();
      }
    });
  });

  test.describe("Non-Modal Drawer", () => {
    test("should open without overlay", async ({ page }) => {
      await page.getByRole("button", { name: "Open Sidebar" }).click();

      const dialog = page.getByRole("dialog", {
        name: "Sidebar navigation",
      });
      await expect(dialog).toBeVisible();

      const overlayCount = await page
        .locator(
          "[data-drawer-overlay]",
        )
        .count();

      const visibleOverlays = [];
      for (let i = 0; i < overlayCount; i++) {
        const overlay = page.locator("[data-drawer-overlay]").nth(i);
        const isVisible = await overlay.isVisible();
        if (isVisible) visibleOverlays.push(i);
      }

      const sidebarParent = dialog.locator("..");
      const hasSidebarOverlay = await sidebarParent
        .locator("[data-drawer-overlay]")
        .count();
      expect(hasSidebarOverlay).toBe(0);
    });

    test("should not have aria-modal attribute", async ({ page }) => {
      await page.getByRole("button", { name: "Open Sidebar" }).click();

      const dialog = page.getByRole("dialog", {
        name: "Sidebar navigation",
      });
      await expect(dialog).toBeVisible();
      await expect(dialog).not.toHaveAttribute("aria-modal");
    });
  });

  test.describe("Keep Mounted", () => {
    test("should preserve form input across open/close", async ({ page }) => {
      await page.getByRole("button", { name: "Open Form Drawer" }).click();
      const dialog = page.getByRole("dialog", { name: "Form drawer" });
      await expect(dialog).toBeVisible();

      const input = page.getByPlaceholder("Enter your name");
      await input.fill("Test User");
      await expect(input).toHaveValue("Test User");

      await page.keyboard.press("Escape");

      const root = page
        .locator('[data-drawer-panel][aria-label="Form drawer"]')
        .locator("..")
        .first();
      await expect(root).toHaveAttribute("data-state", "closed");

      await page.getByRole("button", { name: "Open Form Drawer" }).click();
      await expect(root).toHaveAttribute("data-state", "open");

      await expect(input).toHaveValue("Test User");
    });
  });

  test.describe("Overlay Customization", () => {
    test("should render overlay with custom opacity", async ({ page }) => {
      await page.getByRole("button", { name: "Dark Overlay" }).click();
      const dialog = page.getByRole("dialog", {
        name: "Dark overlay drawer",
      });
      await expect(dialog).toBeVisible();

      const overlay = dialog.locator("..").locator("[data-drawer-overlay]");

      await page.waitForFunction(
        () => {
          const el = document.querySelector(
            '[data-state="open"] [data-drawer-overlay]',
          );
          return el ? parseFloat(getComputedStyle(el).opacity) > 0 : false;
        },
        null,
        { timeout: 5000 },
      );

      const opacity = await overlay.evaluate(
        (el) => getComputedStyle(el).opacity,
      );
      expect(Number(opacity)).toBeGreaterThan(0);
    });
  });

  test.describe("Swipeable Drawer", () => {
    test("should open swipeable bottom sheet", async ({ page }) => {
      await page
        .getByRole("button", { name: "Swipeable Bottom Sheet" })
        .click();

      const dialog = page.getByRole("dialog", { name: "Swipeable drawer" });
      await expect(dialog).toBeVisible();
      await expect(dialog).toHaveAttribute("data-direction", "bottom");
    });
  });

  test.describe("Snap Points", () => {
    test("should change snap point on button click", async ({ page }) => {
      await page
        .getByRole("button", { name: "Bottom Sheet with Snap Points" })
        .click();

      const dialog = page.getByRole("dialog", { name: "Snap points drawer" });
      await expect(dialog).toBeVisible();

      const btn60 = dialog.getByRole("button", { name: "60%" });
      await btn60.click();

      const header = dialog.locator("[data-drawer-header]");
      await expect(header).toContainText("60%");
    });
  });

  test.describe("Accessibility", () => {
    test("should have correct ARIA attributes on dialog", async ({ page }) => {
      await page.getByRole("button", { name: "Navigation Menu" }).click();

      const dialog = page.getByRole("dialog", { name: "Navigation menu" });
      await expect(dialog).toBeVisible();
      await expect(dialog).toHaveAttribute("aria-modal", "true");
      await expect(dialog).toHaveAttribute("aria-label", "Navigation menu");
      await expect(dialog).toHaveAttribute("tabindex", "-1");
    });

    test("should prefer aria-label over auto-wired aria-labelledby", async ({
      page,
    }) => {
      await page.getByRole("button", { name: "Shopping Cart" }).click();

      const dialog = page.getByRole("dialog", { name: "Shopping cart" });
      await expect(dialog).toBeVisible();

      await expect(dialog).toHaveAttribute("aria-label", "Shopping cart");
      const labelledBy = await dialog.getAttribute("aria-labelledby");
      expect(labelledBy).toBeNull();
    });

    test("should pass axe accessibility audit", async ({ page }) => {
      await injectAxe(page);

      await page.getByRole("button", { name: "Shopping Cart" }).click();
      const dialog = page.getByRole("dialog", { name: "Shopping cart" });
      await expect(dialog).toBeVisible();

      await checkA11y(page, "[data-drawer-panel]", {
        detailedReport: true,
        axeOptions: {
          rules: {
            region: { enabled: false },
            "button-name": { enabled: false },
            "color-contrast": { enabled: false },
          },
        },
      });
    });
  });

  test.describe("Mobile Interactions", () => {
    test("should be usable on mobile viewport", async ({
      page,
      isMobile,
    }) => {
      const trigger = page.getByRole("button", { name: "Navigation Menu" });
      if (isMobile) {
        await trigger.tap();
      } else {
        await trigger.click();
      }

      const dialog = page.getByRole("dialog", { name: "Navigation menu" });
      await expect(dialog).toBeVisible();

      const viewport = page.viewportSize()!;
      if (isMobile) {
        await page.touchscreen.tap(viewport.width - 20, viewport.height / 2);
      } else {
        await page.mouse.click(viewport.width - 50, viewport.height / 2);
      }

      await expect(dialog).not.toBeVisible();
    });

    test("should open swipeable drawer on mobile", async ({
      page,
      isMobile,
    }) => {
      const trigger = page.getByRole("button", {
        name: "Swipeable Bottom Sheet",
      });
      if (isMobile) {
        await trigger.tap();
      } else {
        await trigger.click();
      }

      const dialog = page.getByRole("dialog", { name: "Swipeable drawer" });
      await expect(dialog).toBeVisible();
    });
  });

  test.describe("Visual Stability", () => {
    test("should not shift layout when opening a drawer", async ({ page }) => {
      const bodyWidth = await page.evaluate(() => document.body.offsetWidth);

      await page.getByRole("button", { name: "Navigation Menu" }).click();
      const dialog = page.getByRole("dialog", { name: "Navigation menu" });
      await expect(dialog).toBeVisible();

      const bodyWidthAfter = await page.evaluate(
        () => document.body.offsetWidth,
      );
      expect(bodyWidthAfter).toBe(bodyWidth);
    });
  });
});
