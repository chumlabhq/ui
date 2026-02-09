import { test, expect } from "@playwright/test";

test.describe("Dropdown Component - Cross-Browser Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/demo/dropdown");
    await page.waitForLoadState("domcontentloaded");
    await page.getByRole("combobox").first().waitFor({ state: "visible" });
  });

  test.describe("Basic Functionality", () => {
    test("should render dropdown triggers on the page", async ({ page }) => {
      const comboboxes = page.getByRole("combobox");
      await expect(comboboxes.first()).toBeVisible();
      expect(await comboboxes.count()).toBeGreaterThan(0);
    });

    test("should open dropdown on trigger click", async ({ page }) => {
      const trigger = page.getByRole("combobox").first();
      await trigger.click();

      await expect(trigger).toHaveAttribute("aria-expanded", "true");
      await expect(page.getByRole("listbox").first()).toBeVisible();
    });

    test("should close dropdown when option is selected", async ({ page }) => {
      const trigger = page.getByRole("combobox").first();
      await trigger.click();

      const listbox = page.getByRole("listbox").first();
      await expect(listbox).toBeVisible();

      const option = page.getByRole("option").first();
      await option.click();

      await expect(trigger).toHaveAttribute("aria-expanded", "false");
    });

    test("should display selected value in trigger after selection", async ({
      page,
    }) => {
      const trigger = page.getByRole("combobox").first();
      await trigger.click();

      const option = page.getByRole("option", { name: "Banana" }).first();
      await option.click();

      await expect(trigger).toContainText("Banana");
    });
  });

  test.describe("Keyboard Navigation", () => {
    test("should open dropdown with ArrowDown", async ({ page }) => {
      const trigger = page.getByRole("combobox").first();
      await trigger.focus();
      await page.keyboard.press("ArrowDown");

      await expect(trigger).toHaveAttribute("aria-expanded", "true");
      await expect(page.getByRole("listbox").first()).toBeVisible();
    });

    test("should close dropdown with Escape", async ({ page }) => {
      const trigger = page.getByRole("combobox").first();
      await trigger.click();
      await expect(page.getByRole("listbox").first()).toBeVisible();

      // Ensure focus is on the trigger so Escape is handled (Safari/WebKit can move focus)
      await trigger.focus();
      await page.keyboard.press("Escape");
      await expect(trigger).toHaveAttribute("aria-expanded", "false", {
        timeout: 10000,
      });
    });

    test("should select option with Enter after keyboard navigation", async ({
      page,
    }) => {
      const trigger = page.getByRole("combobox").first();
      await trigger.focus();
      await page.keyboard.press("ArrowDown");
      await page.getByRole("listbox").first().waitFor({ state: "visible" });

      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("Enter");

      await expect(trigger).toContainText("Banana");
    });
  });

  test.describe("Click Outside", () => {
    test("should close dropdown when clicking outside", async ({ page }) => {
      const trigger = page.getByRole("combobox").first();
      await trigger.click();
      await expect(page.getByRole("listbox").first()).toBeVisible();

      await page.mouse.click(10, 10);
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
    });
  });
});
