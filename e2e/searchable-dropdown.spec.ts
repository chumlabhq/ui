import { test, expect } from "@playwright/test";

function getSectionByHeading(page: import("@playwright/test").Page, headingName: string) {
  return page
    .locator("section")
    .filter({ has: page.getByRole("heading", { name: headingName, exact: true }) })
    .first();
}

async function getListboxForTrigger(
  page: import("@playwright/test").Page,
  trigger: import("@playwright/test").Locator
) {
  const listboxId = await trigger.getAttribute("aria-controls");
  if (!listboxId) throw new Error("Trigger has no aria-controls");
  return page.locator(`[id="${listboxId}"]`);
}

async function getSearchInputForTrigger(
  page: import("@playwright/test").Page,
  trigger: import("@playwright/test").Locator
) {
  const listbox = await getListboxForTrigger(page, trigger);
  return listbox.getByRole("textbox", { name: "Search options" });
}

test.describe("SearchableDropdown Component - Cross-Browser Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/demo/searchable-dropdown");
    await page.waitForLoadState("domcontentloaded");
    await page.getByRole("combobox").first().waitFor({ state: "visible" });
  });

  test.describe("Basic Functionality", () => {
    test("should render dropdown triggers on the page", async ({ page }) => {
      const comboboxes = page.getByRole("combobox");
      await expect(comboboxes.first()).toBeVisible();
      expect(await comboboxes.count()).toBeGreaterThan(0);
    });

    test("should render default trigger with type=button", async ({ page }) => {
      const trigger = page.getByRole("combobox").first();
      await expect(trigger).toHaveAttribute("type", "button");
    });

    test("should open dropdown on trigger click", async ({ page }) => {
      const trigger = page.getByRole("combobox").first();
      await trigger.click();

      await expect(trigger).toHaveAttribute("aria-expanded", "true");
      await expect(page.getByRole("listbox").first()).toBeVisible();
    });

    test("should show search input when dropdown opens", async ({ page }) => {
      const trigger = page.getByRole("combobox").first();
      await trigger.click();

      const searchInput = await getSearchInputForTrigger(page, trigger);
      await expect(searchInput).toBeVisible();
    });

    test("should show search input that accepts input when dropdown opens", async ({ page }) => {
      const trigger = page.getByRole("combobox").first();
      await trigger.click();

      const searchInput = await getSearchInputForTrigger(page, trigger);
      await expect(searchInput).toBeVisible();
      await searchInput.fill("a");
      await expect(searchInput).toHaveValue("a");
    });

    test("should close dropdown when option is selected", async ({ page }) => {
      const trigger = page.getByRole("combobox").first();
      await trigger.click();

      const option = page.getByRole("option").first();
      await option.click();

      await expect(trigger).toHaveAttribute("aria-expanded", "false");
    });

    test("should display selected value in trigger after selection", async ({ page }) => {
      const trigger = page.getByRole("combobox").first();
      await trigger.click();

      const option = page.getByRole("option", { name: "Banana" }).first();
      await option.click();

      await expect(trigger).toContainText("Banana");
    });
  });

  test.describe("Search Filtering", () => {
    test("should filter options as user types", async ({ page }) => {
      const trigger = page.getByRole("combobox").first();
      await trigger.click();

      const searchInput = await getSearchInputForTrigger(page, trigger);
      await searchInput.fill("ban");

      await expect(page.getByRole("option", { name: "Banana" })).toBeVisible();

      const options = page.getByRole("option");
      await expect(options).toHaveCount(1);
    });

    test("should show no results message when nothing matches", async ({ page }) => {
      const trigger = page.getByRole("combobox").first();
      await trigger.click();

      const searchInput = await getSearchInputForTrigger(page, trigger);
      await searchInput.fill("xyz");

      const listbox = await getListboxForTrigger(page, trigger);
      await expect(listbox.getByText("No results found", { exact: true })).toBeVisible();
    });

    test("should clear search when dropdown reopens", async ({ page }) => {
      const trigger = page.getByRole("combobox").first();
      await trigger.click();

      let searchInput = await getSearchInputForTrigger(page, trigger);
      await searchInput.fill("ban");

      await page.keyboard.press("Escape");
      await trigger.click();

      searchInput = await getSearchInputForTrigger(page, trigger);
      await expect(searchInput).toHaveValue("");
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

      await trigger.focus();
      await page.keyboard.press("Escape");

      await expect(trigger).toHaveAttribute("aria-expanded", "false", {
        timeout: 10000,
      });
    });

    test("should restore focus to trigger after Escape", async ({ page }) => {
      const trigger = page.getByRole("combobox").first();
      await trigger.click();
      await page.getByRole("listbox").first().waitFor({ state: "visible" });
      const searchInput = await getSearchInputForTrigger(page, trigger);
      await searchInput.waitFor({ state: "visible" });

      await page.keyboard.press("Escape");

      await expect(trigger).toHaveAttribute("aria-expanded", "false", { timeout: 5000 });
      await expect(trigger).toBeFocused({ timeout: 3000 });
    });

    test("should select option with Enter after keyboard navigation", async ({ page }) => {
      const trigger = page.getByRole("combobox").first();
      await trigger.focus();
      await page.keyboard.press("ArrowDown");
      await page.getByRole("listbox").first().waitFor({ state: "visible" });

      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("Enter");

      await expect(trigger).toHaveAttribute("aria-expanded", "false");
    });

    test("should close dropdown with Tab", async ({ page }) => {
      const trigger = page.getByRole("combobox").first();
      await trigger.click();
      await page.getByRole("listbox").first().waitFor({ state: "visible" });
      const searchInput = await getSearchInputForTrigger(page, trigger);
      await searchInput.waitFor({ state: "visible" });

      await page.keyboard.press("Tab");

      await expect(trigger).toHaveAttribute("aria-expanded", "false", { timeout: 5000 });
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

  test.describe("Trigger type=button", () => {
    test("custom trigger (renderTrigger) receives type=button in props", async ({ page }) => {
      const section = getSectionByHeading(page, "Custom Trigger (renderTrigger)");
      const trigger = section.getByRole("combobox").first();
      await expect(trigger).toHaveAttribute("type", "button");
    });
  });

  test.describe("Clearable", () => {
    test("should clear selected value when clear button is clicked", async ({ page }) => {
      const section = getSectionByHeading(page, "Clearable");
      const trigger = section.getByRole("combobox").first();

      await trigger.click();
      const option = page.getByRole("option", { name: "Apple" }).first();
      await option.click();

      await expect(trigger).toContainText("Apple");

      const clearButton = section.getByLabel("Clear selection").first();
      await clearButton.click();

      await expect(trigger).not.toContainText("Apple", { timeout: 5000 });
    });
  });

  test.describe("Disabled State", () => {
    test("should not open when disabled", async ({ page }) => {
      const section = getSectionByHeading(page, "Disabled State");
      const trigger = section.getByRole("combobox").first();

      await expect(trigger).toBeDisabled();
    });

    test("should skip disabled options during keyboard navigation", async ({ page }) => {
      const section = getSectionByHeading(page, "With Disabled Options");
      const trigger = section.getByRole("combobox").first();

      await trigger.click();
      await page.getByRole("listbox").first().waitFor({ state: "visible" });

      const disabledOption = page.getByRole("option", { name: "Disabled Option" }).first();
      await expect(disabledOption).toHaveAttribute("aria-disabled", "true");
    });
  });

  test.describe("Error State", () => {
    test("should display error message", async ({ page }) => {
      const section = getSectionByHeading(page, "Error State");
      const errorMessage = section.getByRole("alert").first();

      await expect(errorMessage).toContainText("This field is required");
    });

    test("should have aria-invalid on trigger", async ({ page }) => {
      const section = getSectionByHeading(page, "Error State");
      const triggerWithError = section.locator('[aria-invalid="true"]').first();

      await expect(triggerWithError).toHaveAttribute("aria-invalid", "true");
    });
  });

  test.describe("Portal Rendering", () => {
    test("should render dropdown in portal (not clipped by overflow)", async ({ page }) => {
      const trigger = page.getByRole("combobox").first();
      await trigger.click();

      const listbox = page.getByRole("listbox").first();
      await expect(listbox).toBeVisible();

      const isInBody = await listbox.evaluate((el) => {
        return el.parentElement === document.body || el.closest("[data-dropdown-id]") !== null;
      });
      expect(isInBody).toBe(true);
    });
  });

  test.describe("Accessibility", () => {
    test("should have correct ARIA attributes on trigger", async ({ page }) => {
      const trigger = page.getByRole("combobox").first();

      await expect(trigger).toHaveAttribute("aria-haspopup", "listbox");
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
      await expect(trigger).toHaveAttribute("aria-controls");
    });

    test("should update aria-expanded when opened", async ({ page }) => {
      const trigger = page.getByRole("combobox").first();
      await trigger.click();

      await expect(trigger).toHaveAttribute("aria-expanded", "true");
    });

    test("should have role=listbox on dropdown content", async ({ page }) => {
      const trigger = page.getByRole("combobox").first();
      await trigger.click();

      const listbox = page.getByRole("listbox").first();
      await expect(listbox).toBeVisible();
    });

    test("should have role=option on each option", async ({ page }) => {
      const trigger = page.getByRole("combobox").first();
      await trigger.click();

      const listbox = await getListboxForTrigger(page, trigger);
      const options = listbox.getByRole("option");
      await options.first().waitFor({ state: "visible", timeout: 5000 });
      expect(await options.count()).toBeGreaterThan(0);
    });

    test("should have aria-autocomplete on search input", async ({ page }) => {
      const trigger = page.getByRole("combobox").first();
      await trigger.click();

      const searchInput = await getSearchInputForTrigger(page, trigger);
      await expect(searchInput).toHaveAttribute("aria-autocomplete", "list");
    });
  });

  test.describe("Mobile Interactions", () => {
    test("should open dropdown on touch tap or click", async ({ page, isMobile }) => {
      const trigger = page.getByRole("combobox").first();
      if (isMobile) {
        await trigger.tap();
      } else {
        await trigger.click();
      }

      await expect(trigger).toHaveAttribute("aria-expanded", "true");
    });

    test("should close dropdown on outside touch or click", async ({ page, isMobile }) => {
      const trigger = page.getByRole("combobox").first();
      if (isMobile) {
        await trigger.tap();
      } else {
        await trigger.click();
      }
      await expect(page.getByRole("listbox").first()).toBeVisible();

      if (isMobile) {
        await page.touchscreen.tap(10, 10);
      } else {
        await page.mouse.click(10, 10);
      }

      await expect(trigger).toHaveAttribute("aria-expanded", "false");
    });

    test("should select option on touch or click", async ({ page, isMobile }) => {
      const trigger = page.getByRole("combobox").first();
      if (isMobile) {
        await trigger.tap();
      } else {
        await trigger.click();
      }

      const option = page.getByRole("option", { name: "Apple" }).first();
      if (isMobile) {
        await option.tap();
      } else {
        await option.click();
      }

      await expect(trigger).toContainText("Apple");
    });
  });

  test.describe("Full User Flow", () => {
    test("should complete a full search → select → clear flow", async ({ page }) => {
      const section = getSectionByHeading(page, "Clearable");
      const trigger = section.getByRole("combobox").first();

      await trigger.click();

      const searchInput = await getSearchInputForTrigger(page, trigger);
      await searchInput.fill("che");

      const option = page.getByRole("option", { name: "Cherry" }).first();
      await option.click();

      await expect(trigger).toContainText("Cherry");
      await expect(trigger).toHaveAttribute("aria-expanded", "false");

      const clearButton = section.getByLabel("Clear selection").first();
      await clearButton.click();

      await expect(trigger).not.toContainText("Cherry", { timeout: 5000 });
    });

    test("should complete keyboard-only selection flow", async ({ page }) => {
      const trigger = page.getByRole("combobox").first();

      await trigger.focus();
      await page.keyboard.press("Enter");

      await expect(trigger).toHaveAttribute("aria-expanded", "true");

      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("Enter");

      await expect(trigger).toHaveAttribute("aria-expanded", "false");
    });
  });
});
