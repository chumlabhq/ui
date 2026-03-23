import { test, expect } from "@playwright/test";

function getSectionByHeading(
  page: import("@playwright/test").Page,
  headingName: string,
) {
  return page
    .locator("section")
    .filter({
      has: page.getByRole("heading", { name: headingName, exact: true }),
    })
    .first();
}

async function getListboxForTrigger(
  page: import("@playwright/test").Page,
  trigger: import("@playwright/test").Locator,
) {
  const listboxId = await trigger.getAttribute("aria-controls");
  if (!listboxId) throw new Error("Trigger has no aria-controls");
  return page.locator(`[id="${listboxId}"]`);
}

// Use tap on mobile (like searchable-dropdown), click otherwise.
// evaluate() bypasses interception but tap() works better for touch devices.
async function ensureVisibleAndClick(
  locator: import("@playwright/test").Locator,
  isMobile?: boolean,
) {
  await locator.scrollIntoViewIfNeeded();
  if (isMobile) {
    await locator.tap();
  } else {
    await locator.click();
  }
}

async function clickOption(
  locator: import("@playwright/test").Locator,
  isMobile?: boolean,
) {
  if (isMobile) {
    await locator.tap();
  } else {
    await locator.click();
  }
}

// Dispatch a mousedown on document to trigger click-outside close logic
async function closeDropdownViaClickOutside(
  page: import("@playwright/test").Page,
) {
  await page.evaluate(() => {
    document.body.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
  });
}

test.describe("MultiSelectDropdown Component - Cross-Browser Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/demo/multi-select-dropdown");
    await page.waitForLoadState("domcontentloaded");
    const trigger = page.getByRole("combobox").first();
    await trigger.waitFor({ state: "visible" });
    await trigger.scrollIntoViewIfNeeded();
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

    test("should open dropdown on trigger click", async ({
      page,
      isMobile,
    }) => {
      const trigger = page.getByRole("combobox").first();
      await ensureVisibleAndClick(trigger, isMobile);

      await expect(trigger).toHaveAttribute("aria-expanded", "true");
      await expect(page.getByRole("listbox").first()).toBeVisible();
    });

    test("should keep dropdown open when option is selected (multi-select)", async ({
      page,
      isMobile,
    }) => {
      const trigger = page.getByRole("combobox").first();
      await ensureVisibleAndClick(trigger, isMobile);

      const listbox = page.getByRole("listbox").first();
      await expect(listbox).toBeVisible();

      const option = page.getByRole("option", { name: "Banana" }).first();
      await option.waitFor({ state: "visible" });
      await clickOption(option, isMobile);

      // Multi-select: dropdown stays open after selection
      await expect(trigger).toHaveAttribute("aria-expanded", "true");
      await expect(listbox).toBeVisible();
    });

    test("should display selected value as chip in trigger after selection", async ({
      page,
      isMobile,
    }) => {
      const trigger = page.getByRole("combobox").first();
      await ensureVisibleAndClick(trigger, isMobile);

      const option = page.getByRole("option", { name: "Banana" }).first();
      await option.waitFor({ state: "visible" });
      await clickOption(option, isMobile);

      await expect(trigger).toContainText("Banana");
    });

    test("should allow selecting multiple options", async ({
      page,
      isMobile,
    }) => {
      const section = getSectionByHeading(page, "Basic Usage");
      const trigger = section.getByRole("combobox").first();
      await ensureVisibleAndClick(trigger, isMobile);

      const listbox = await getListboxForTrigger(page, trigger);
      await listbox.waitFor({ state: "visible" });

      const appleOpt = listbox.getByRole("option", { name: "Apple" }).first();
      const bananaOpt = listbox.getByRole("option", { name: "Banana" }).first();
      await appleOpt.waitFor({ state: "visible" });
      await clickOption(appleOpt, isMobile);
      await clickOption(bananaOpt, isMobile);

      await expect(trigger).toContainText("Apple");
      await expect(trigger).toContainText("Banana");
    });

    test("should remove selection when chip remove button is clicked", async ({
      page,
      isMobile,
    }) => {
      const section = getSectionByHeading(page, "Basic Usage");
      await section.scrollIntoViewIfNeeded();
      const trigger = section.getByRole("combobox").first();
      await ensureVisibleAndClick(trigger, isMobile);

      const listbox = await getListboxForTrigger(page, trigger);
      await listbox.waitFor({ state: "visible" });
      const appleOpt = listbox.getByRole("option", { name: "Apple" }).first();
      await appleOpt.waitFor({ state: "visible" });
      await clickOption(appleOpt, isMobile);
      await expect(trigger).toContainText("Apple");

      const removeButton = section
        .getByRole("button", {
          name: "Remove Apple",
        })
        .first();
      await removeButton.scrollIntoViewIfNeeded();
      if (isMobile) {
        await removeButton.tap();
      } else {
        await removeButton.click();
      }

      await expect(trigger).not.toContainText("Apple", { timeout: 5000 });
    });
  });

  test.describe("Keyboard Navigation", () => {
    test("should open dropdown with ArrowDown", async ({ page }) => {
      const trigger = page.getByRole("combobox").first();
      await trigger.scrollIntoViewIfNeeded();
      await trigger.focus();
      await page.keyboard.press("ArrowDown");

      await expect(trigger).toHaveAttribute("aria-expanded", "true");
      await expect(page.getByRole("listbox").first()).toBeVisible();
    });

    test("should close dropdown with Escape", async ({ page, isMobile }) => {
      const trigger = page.getByRole("combobox").first();
      await ensureVisibleAndClick(trigger, isMobile);
      await expect(page.getByRole("listbox").first()).toBeVisible();

      await trigger.focus();
      await page.keyboard.press("Escape");

      await expect(trigger).toHaveAttribute("aria-expanded", "false", {
        timeout: 10000,
      });
    });

    test("should toggle option selection with Space after keyboard navigation", async ({
      page,
    }) => {
      const trigger = page.getByRole("combobox").first();
      await trigger.scrollIntoViewIfNeeded();
      await trigger.focus();
      await page.keyboard.press("ArrowDown");
      await page.getByRole("listbox").first().waitFor({ state: "visible" });

      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("Space");

      await expect(trigger).toContainText("Banana");
      // Dropdown stays open for multi-select
      await expect(page.getByRole("listbox").first()).toBeVisible();
    });

    test("should toggle option selection with Enter after keyboard navigation", async ({
      page,
    }) => {
      const trigger = page.getByRole("combobox").first();
      await trigger.scrollIntoViewIfNeeded();
      await trigger.focus();
      await page.keyboard.press("ArrowDown");
      await page.getByRole("listbox").first().waitFor({ state: "visible" });

      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("Enter");

      await expect(trigger).toContainText("Banana");
    });
  });

  test.describe("Click Outside", () => {
    test("should close dropdown when clicking outside", async ({
      page,
      isMobile,
    }) => {
      const trigger = page.getByRole("combobox").first();
      await ensureVisibleAndClick(trigger, isMobile);
      await expect(page.getByRole("listbox").first()).toBeVisible();

      await closeDropdownViaClickOutside(page);

      await expect(trigger).toHaveAttribute("aria-expanded", "false");
    });
  });

  test.describe("Disabled State", () => {
    test("should not open when disabled", async ({ page }) => {
      const section = getSectionByHeading(page, "Disabled State");
      await section.scrollIntoViewIfNeeded();
      const trigger = section.getByRole("combobox").first();

      await expect(trigger).toBeDisabled();
    });
  });

  test.describe("Error State", () => {
    test("should display error message", async ({ page }) => {
      const section = getSectionByHeading(page, "Error State");
      await section.scrollIntoViewIfNeeded();
      const errorMessage = section.getByRole("alert").first();

      await expect(errorMessage).toContainText("Please select at least one");
    });

    test("should have aria-invalid on trigger", async ({ page }) => {
      const section = getSectionByHeading(page, "Error State");
      await section.scrollIntoViewIfNeeded();
      const triggerWithError = section.locator('[aria-invalid="true"]').first();

      await expect(triggerWithError).toHaveAttribute("aria-invalid", "true");
    });
  });

  test.describe("Portal Rendering", () => {
    test("should render dropdown in portal (not clipped by overflow)", async ({
      page,
      isMobile,
    }) => {
      const trigger = page.getByRole("combobox").first();
      await ensureVisibleAndClick(trigger, isMobile);

      const listbox = page.getByRole("listbox").first();
      await expect(listbox).toBeVisible();

      const isInBody = await listbox.evaluate((el) => {
        return (
          el.parentElement === document.body ||
          el.closest("[data-dropdown-id]") !== null
        );
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

    test("should update aria-expanded when opened", async ({
      page,
      isMobile,
    }) => {
      const trigger = page.getByRole("combobox").first();
      await ensureVisibleAndClick(trigger, isMobile);

      await expect(trigger).toHaveAttribute("aria-expanded", "true");
    });

    test("should have role=listbox with aria-multiselectable on dropdown content", async ({
      page,
      isMobile,
    }) => {
      const trigger = page.getByRole("combobox").first();
      await ensureVisibleAndClick(trigger, isMobile);

      const listbox = page.getByRole("listbox").first();
      await expect(listbox).toBeVisible();
      await expect(listbox).toHaveAttribute("aria-multiselectable", "true");
    });

    test("should have role=option on each option", async ({
      page,
      isMobile,
    }) => {
      const trigger = page.getByRole("combobox").first();
      await ensureVisibleAndClick(trigger, isMobile);

      const listbox = await getListboxForTrigger(page, trigger);
      const options = listbox.getByRole("option");
      await options.first().waitFor({ state: "visible", timeout: 5000 });
      expect(await options.count()).toBeGreaterThan(0);
    });
  });

  test.describe("Controlled Open State", () => {
    test("should respect controlled open state", async ({ page }) => {
      const section = getSectionByHeading(page, "Controlled Open State");
      await section.scrollIntoViewIfNeeded();
      const trigger = section.getByRole("combobox").first();
      const openCloseButton = section
        .getByRole("button", {
          name: /^(Open|Close)$/,
        })
        .first();

      await openCloseButton.scrollIntoViewIfNeeded();
      // evaluate() invokes a real DOM click, bypassing Playwright's interception check
      await openCloseButton.evaluate((el: HTMLElement) => el.click());
      await expect(trigger).toHaveAttribute("aria-expanded", "true");

      await openCloseButton.evaluate((el: HTMLElement) => el.click());
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
    });
  });

  test.describe("With Disabled Options", () => {
    test("should have aria-disabled on disabled options", async ({
      page,
      isMobile,
    }) => {
      const section = getSectionByHeading(page, "With Disabled Options");
      await section.scrollIntoViewIfNeeded();
      const trigger = section.getByRole("combobox").first();
      await ensureVisibleAndClick(trigger, isMobile);

      await page.getByRole("listbox").first().waitFor({ state: "visible" });

      const disabledOption = page
        .getByRole("option", { name: "Disabled Option" })
        .first();
      await expect(disabledOption).toHaveAttribute("aria-disabled", "true");
    });
  });

  test.describe("Form Integration", () => {
    test("should participate in form submission when name is set", async ({
      page,
      isMobile,
    }) => {
      const section = getSectionByHeading(page, "Native Form Participation");
      await section.scrollIntoViewIfNeeded();
      const trigger = section.getByRole("combobox").first();

      await ensureVisibleAndClick(trigger, isMobile);

      const listbox = await getListboxForTrigger(page, trigger);
      await listbox.waitFor({ state: "visible", timeout: 10000 });
      const appleOpt = listbox.getByRole("option", { name: "Apple" }).first();
      await appleOpt.waitFor({ state: "visible", timeout: 10000 });
      await clickOption(appleOpt, isMobile);

      // Close dropdown before submitting (Escape is more reliable than mousedown)
      await trigger.focus();
      await page.keyboard.press("Escape");
      await expect(trigger).toHaveAttribute("aria-expanded", "false");

      const dialogPromise = page.waitForEvent("dialog");
      // page.evaluate() must NOT be awaited when the form's onSubmit calls alert():
      // alert() suspends the page's JS thread, which would prevent the evaluate from
      // ever resolving. Fire-and-forget lets Playwright handle the dialog event separately.
      page.evaluate(() => {
        const sections = Array.from(document.querySelectorAll("section"));
        const sec = sections.find((s) => {
          const h2 = s.querySelector("h2");
          return h2?.textContent?.trim() === "Native Form Participation";
        });
        const form = sec?.querySelector("form");
        if (form) (form as HTMLFormElement).requestSubmit();
      });
      const dialog = await dialogPromise;

      expect(dialog.message()).toContain("fruits");
      expect(dialog.message()).toContain("apple");
      await dialog.dismiss();
    });
  });
});
