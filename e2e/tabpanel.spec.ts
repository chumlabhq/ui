import { test, expect } from "@playwright/test";
import { injectAxe, checkA11y } from "axe-playwright";

test.describe("TabPanel Component - Cross-Browser Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/demo/tab-panel");
    await page.waitForLoadState("domcontentloaded");
    await page.getByRole("tablist").first().waitFor({ state: "visible" });
  });

  test.describe("Basic Functionality", () => {
    test("should render tab components on the page", async ({ page }) => {
      const tablists = page.getByRole("tablist");
      await expect(tablists.first()).toBeVisible();

      const count = await tablists.count();
      expect(count).toBeGreaterThan(0);
    });

    test("should switch tabs on click", async ({ page }) => {
      const tablist = page.getByRole("tablist").first();
      const tabs = tablist.getByRole("tab");

      const secondTab = tabs.nth(1);
      await secondTab.click();

      await expect(secondTab).toHaveAttribute("aria-selected", "true");
      await expect(tabs.first()).toHaveAttribute("aria-selected", "false");
    });

    test("should display corresponding panel content when tab is activated", async ({
      page,
    }) => {
      const tablist = page.getByRole("tablist").first();
      const secondTab = tablist.getByRole("tab").nth(1);

      await secondTab.click();

      const panelId = await secondTab.getAttribute("aria-controls");
      if (panelId) {
        const panel = page.locator(`#${panelId}`);
        await expect(panel).toBeVisible();
        await expect(panel).not.toHaveAttribute("hidden");
      }
    });

    test("should hide inactive panels", async ({ page }) => {
      const tablist = page.getByRole("tablist").first();
      const tabs = tablist.getByRole("tab");
      const firstTab = tabs.first();

      await firstTab.click();

      const secondTabPanelId = await tabs.nth(1).getAttribute("aria-controls");
      if (secondTabPanelId) {
        const panel = page.locator(`#${secondTabPanelId}`);
        await expect(panel).toBeHidden();
      }
    });
  });

  test.describe("Keyboard Navigation", () => {
    test("should navigate forward with ArrowRight in horizontal tabs", async ({
      page,
    }) => {
      const tablist = page.getByRole("tablist").first();
      const tabs = tablist.getByRole("tab");

      await tabs.first().focus();
      await page.keyboard.press("ArrowRight");

      await expect(tabs.nth(1)).toBeFocused();
    });

    test("should navigate backward with ArrowLeft in horizontal tabs", async ({
      page,
    }) => {
      const tablist = page.getByRole("tablist").first();
      const tabs = tablist.getByRole("tab");

      await tabs.nth(1).click();
      await page.keyboard.press("ArrowLeft");

      await expect(tabs.first()).toBeFocused();
    });

    test("should wrap around with loop enabled", async ({ page }) => {
      const tablist = page.getByRole("tablist").first();
      const tabs = tablist.getByRole("tab");
      const lastTab = tabs.last();

      await lastTab.click();
      await page.keyboard.press("ArrowRight");

      await expect(tabs.first()).toBeFocused();
    });

    test("should navigate to first tab with Home key", async ({ page }) => {
      const tablist = page.getByRole("tablist").first();
      const tabs = tablist.getByRole("tab");

      await tabs.last().click();
      await page.keyboard.press("Home");

      await expect(tabs.first()).toBeFocused();
    });

    test("should navigate to last tab with End key", async ({ page }) => {
      const tablist = page.getByRole("tablist").first();
      const tabs = tablist.getByRole("tab");

      await tabs.first().click();
      await page.keyboard.press("End");

      await expect(tabs.last()).toBeFocused();
    });

    test("should use ArrowDown/ArrowUp for vertical orientation", async ({
      page,
    }) => {
      const tablist = page.locator('[aria-orientation="vertical"]');
      const tabs = tablist.getByRole("tab");

      await tabs.first().focus();
      await page.keyboard.press("ArrowDown");

      await expect(tabs.nth(1)).toBeFocused();

      await page.keyboard.press("ArrowUp");

      await expect(tabs.first()).toBeFocused();
    });

    test("should skip disabled tabs during navigation", async ({ page }) => {
      const disabledSection = page.getByText("Disabled Tab").first().locator("../..");
      const tablist = disabledSection.getByRole("tablist");
      const tabs = tablist.getByRole("tab");

      await tabs.first().focus();
      await page.keyboard.press("ArrowRight");

      const focusedTab = page.locator("*:focus");
      const ariaDisabled = await focusedTab.getAttribute("aria-disabled");
      expect(ariaDisabled).not.toBe("true");
    });
  });

  test.describe("Manual Activation Mode", () => {
    test("should move focus without activating in manual mode", async ({
      page,
    }) => {
      const manualSection = page
        .getByText("Manual Activation Mode")
        .locator("../..");
      const tablist = manualSection.getByRole("tablist");
      const tabs = tablist.getByRole("tab");

      await tabs.first().click();
      await expect(tabs.first()).toHaveAttribute("aria-selected", "true");

      await page.keyboard.press("ArrowRight");

      await expect(tabs.nth(1)).toBeFocused();
      await expect(tabs.first()).toHaveAttribute("aria-selected", "true");
    });

    test("should activate focused tab on Enter in manual mode", async ({
      page,
    }) => {
      const manualSection = page
        .getByText("Manual Activation Mode")
        .locator("../..");
      const tablist = manualSection.getByRole("tablist");
      const tabs = tablist.getByRole("tab");

      await tabs.first().click();
      await page.keyboard.press("ArrowRight");
      await page.keyboard.press("Enter");

      await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
    });

    test("should activate focused tab on Space in manual mode", async ({
      page,
    }) => {
      const manualSection = page
        .getByText("Manual Activation Mode")
        .locator("../..");
      const tablist = manualSection.getByRole("tablist");
      const tabs = tablist.getByRole("tab");

      await tabs.first().click();
      await page.keyboard.press("ArrowRight");
      await page.keyboard.press("Space");

      await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
    });
  });

  test.describe("Dynamic Tabs", () => {
    test("should add a new tab when Add Tab button is clicked", async ({
      page,
    }) => {
      const dynamicSection = page
        .getByText("Dynamic Tabs (Add / Remove)")
        .locator("../..");
      const addButton = dynamicSection.getByRole("button", { name: "Add Tab" });

      const tablist = dynamicSection.getByRole("tablist");
      const initialCount = await tablist.getByRole("tab").count();

      await addButton.click();

      const newCount = await tablist.getByRole("tab").count();
      expect(newCount).toBe(initialCount + 1);
    });

    test("should fall back to first tab when active tab is removed", async ({
      page,
    }) => {
      const dynamicSection = page
        .getByText("Dynamic Tabs (Add / Remove)")
        .locator("../..");
      const tablist = dynamicSection.getByRole("tablist");
      const tabs = tablist.getByRole("tab");

      const lastTab = tabs.last();
      await lastTab.click();
      await expect(lastTab).toHaveAttribute("aria-selected", "true");

      const removeButton = dynamicSection.getByRole("button", {
        name: "Remove this tab",
      });
      await removeButton.click();

      const firstTab = tablist.getByRole("tab").first();
      await expect(firstTab).toHaveAttribute("aria-selected", "true");
    });
  });

  test.describe("RTL Support", () => {
    test("should reverse arrow key navigation in RTL context", async ({
      page,
    }) => {
      const rtlContainer = page.locator('[dir="rtl"]');
      const tablist = rtlContainer.getByRole("tablist");
      const tabs = tablist.getByRole("tab");

      await tabs.first().focus();
      await page.keyboard.press("ArrowLeft");

      await expect(tabs.nth(1)).toBeFocused();
    });
  });

  test.describe("Accessibility", () => {
    test("should have proper ARIA roles on all elements", async ({ page }) => {
      const tablist = page.getByRole("tablist").first();
      await expect(tablist).toBeVisible();

      const tabs = tablist.getByRole("tab");
      const tabCount = await tabs.count();
      expect(tabCount).toBeGreaterThan(0);

      for (let i = 0; i < tabCount; i++) {
        const tab = tabs.nth(i);
        await expect(tab).toHaveAttribute("aria-selected");
        await expect(tab).toHaveAttribute("aria-controls");
      }
    });

    test("should have aria-orientation on tablist", async ({ page }) => {
      const tablist = page.getByRole("tablist").first();
      const orientation = await tablist.getAttribute("aria-orientation");
      expect(["horizontal", "vertical"]).toContain(orientation);
    });

    test("should have aria-label on tablist", async ({ page }) => {
      const tablist = page.getByRole("tablist").first();
      await expect(tablist).toHaveAttribute("aria-label");
    });

    test("should implement roving tabindex", async ({ page }) => {
      const tablist = page.getByRole("tablist").first();
      const tabs = tablist.getByRole("tab");
      const tabCount = await tabs.count();

      let tabbableCount = 0;
      for (let i = 0; i < tabCount; i++) {
        const tabindex = await tabs.nth(i).getAttribute("tabindex");
        if (tabindex === "0") tabbableCount++;
      }
      expect(tabbableCount).toBe(1);
    });

    test("should have valid aria-controls referencing existing panels", async ({
      page,
    }) => {
      const tablist = page.getByRole("tablist").first();
      const tabs = tablist.getByRole("tab");
      const tabCount = await tabs.count();

      for (let i = 0; i < tabCount; i++) {
        const controlsId = await tabs.nth(i).getAttribute("aria-controls");
        expect(controlsId).toBeTruthy();
        const panel = page.locator(`#${controlsId}`);
        await expect(panel).toHaveCount(1);
      }
    });

    test("should pass axe accessibility audit", async ({ page }) => {
      await injectAxe(page);
      await checkA11y(page, undefined, {
        detailedReport: true,
        axeOptions: {
          runOnly: {
            type: "tag",
            values: ["wcag2a", "wcag2aa"],
          },
          rules: {
            "scrollable-region-focusable": { enabled: false },
          },
        },
      });
    });
  });

  test.describe("Focus Management", () => {
    test("should not steal focus on page load", async ({ page }) => {
      const activeElement = await page.evaluate(() =>
        document.activeElement?.tagName.toLowerCase(),
      );
      expect(activeElement).toBe("body");
    });

    test("should move focus into tablist on Tab and out on second Tab", async ({
      page,
    }) => {
      const tablist = page.getByRole("tablist").first();
      const tabs = tablist.getByRole("tab");

      await tabs.first().focus();
      await expect(tabs.first()).toBeFocused();

      await page.keyboard.press("Tab");

      const focused = page.locator("*:focus");
      const role = await focused.getAttribute("role");
      expect(role).not.toBe("tab");
    });
  });

  test.describe("Responsive & Mobile", () => {
    test("should handle touch/tap interaction on tabs", async ({
      page,
      isMobile,
    }) => {
      const tablist = page.getByRole("tablist").first();
      const tabs = tablist.getByRole("tab");
      const secondTab = tabs.nth(1);

      if (isMobile) {
        await secondTab.tap();
      } else {
        await secondTab.click();
      }

      await expect(secondTab).toHaveAttribute("aria-selected", "true");
    });
  });

  test.describe("Performance", () => {
    test("should switch tabs without layout thrashing", async ({ page }) => {
      const tablist = page.getByRole("tablist").first();
      const tabs = tablist.getByRole("tab");
      const tabCount = await tabs.count();

      const start = Date.now();

      for (let i = 0; i < tabCount; i++) {
        await tabs.nth(i).click();
        await expect(tabs.nth(i)).toHaveAttribute("aria-selected", "true");
      }

      const duration = Date.now() - start;
      expect(duration).toBeLessThan(5000);
    });
  });
});
