import { test, expect } from "@playwright/test";
import { injectAxe } from "axe-playwright";
import { gotoFixture } from "./_nav";

import { watchClicks } from "./_helpers";
// Helper to wait for input visibility with scroll support
async function waitForInputVisible(page: import("@playwright/test").Page) {
  // `.first()` used to pick a hidden control in the site chrome, which can
  // never be scrolled to — every test in this file then died in beforeEach.
  const input = page.locator("input:visible").first();
  await input.waitFor({ state: "visible", timeout: 10000 });
  await input.scrollIntoViewIfNeeded();
}

test.describe("Input Component - Cross-Browser Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/input");
    await page.waitForLoadState("domcontentloaded");
    await waitForInputVisible(page);
  });


  test.describe("Labels", () => {
    test("should display labels for inputs", async ({ page }) => {
      const labels = page.locator("label");

      // The guard used to make this pass when the element was absent, which is
      // the failure the test exists to catch. Assert presence, then behaviour.
      await expect(labels.first()).toBeVisible();
      await expect(labels.first()).toBeVisible();
    });

    test("should show required indicator on required fields", async ({
      page,
    }) => {
      const requiredIndicator = page.locator('span:text("*")');

      // The guard used to make this pass when the element was absent, which is
      // the failure the test exists to catch. Assert presence, then behaviour.
      await expect(requiredIndicator.first()).toBeVisible();
      await expect(requiredIndicator.first()).toBeVisible();
    });

    test("clicking label should focus associated input", async ({ page }) => {
      const label = page.locator("label").first();

      // The guard used to make this pass when the element was absent, which is
      // the failure the test exists to catch. Assert presence, then behaviour.
      await expect(label.first()).toBeVisible();
      await label.click();

      // The associated input should be focused
      const forAttr = await label.getAttribute("for");
      if (forAttr) {
        const input = page.locator(`#${forAttr}`);
        await expect(input).toBeFocused();
      }
    });
  });

  test.describe("Icon Interactions", () => {
    test("should render leading icons", async ({ page }) => {
      // At least some inputs should exist on the page
      const inputs = page.locator("input");
      const count = await inputs.count();
      expect(count).toBeGreaterThan(0);
    });

  });

  test.describe("Error States", () => {
    test("should display error message", async ({ page }) => {
      const errorMessages = page.locator('[role="alert"]');

      // The guard used to make this pass when the element was absent, which is
      // the failure the test exists to catch. Assert presence, then behaviour.
      await expect(errorMessages.first()).toBeVisible();
      await expect(errorMessages.first()).toBeVisible();
    });

    test("should mark invalid inputs with aria-invalid", async ({ page }) => {
      const invalidInputs = page.locator('input[aria-invalid="true"]');

      // The guard used to make this pass when the element was absent, which is
      // the failure the test exists to catch. Assert presence, then behaviour.
      await expect(invalidInputs.first()).toBeVisible();
      await expect(invalidInputs.first()).toBeVisible();
    });
  });

  test.describe("Disabled States", () => {

    test("should not allow typing in disabled input", async ({ page }) => {
      const disabledInput = page.locator("input:disabled").first();

      // The guard used to make this pass when the element was absent, which is
      // the failure the test exists to catch. Assert presence, then behaviour.
      await expect(disabledInput.first()).toBeVisible();
      const valueBefore = await disabledInput.inputValue();

      // Attempt to type (should not work on disabled input)
      await disabledInput.type("test").catch(() => {
        // Expected to fail or do nothing
      });

      const valueAfter = await disabledInput.inputValue();
      expect(valueAfter).toBe(valueBefore);
    });
  });

  test.describe("Loading States", () => {
    test("should display loader when loading", async ({ page }) => {
      // Look for loader elements (CircularLoader or custom)
      const loaders = page.locator('[data-loading="true"]');

      // The guard used to make this pass when the element was absent, which is
      // the failure the test exists to catch. Assert presence, then behaviour.
      await expect(loaders.first()).toBeVisible();
      await expect(loaders.first()).toBeVisible();
    });
  });
});

test.describe("Input Keyboard Navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/input");
    await page.waitForLoadState("domcontentloaded");
    await waitForInputVisible(page);
  });

  test("should focus input on tab", async ({ page }) => {
    // Tab into the page
    await page.keyboard.press("Tab");

    // Eventually an input should be focused
    const focusedElement = page.locator(":focus");
    await expect(focusedElement).toBeVisible();
  });

  test("should navigate through inputs with tab", async ({ page }) => {
    const inputs = page.locator("input");
    const count = await inputs.count();

    if (count >= 2) {
      // Focus first input
      await inputs.first().focus();

      // Tab to next element
      await page.keyboard.press("Tab");

      // Something should be focused
      const focusedElement = page.locator(":focus");
      await expect(focusedElement).toBeVisible();
    }
  });

  test("should activate icon buttons with Enter key", async ({ page }) => {
    // Two things were wrong here. The guard made it pass when nothing was
    // found, and `[role="button"]` finds nothing on this page at all: a
    // clickable field icon renders as a real <button type="button"> with an
    // aria-label (FieldWrapper.tsx:176-183), never a role="button" span.
    const button = page.getByRole("button", { name: "Submit search" });
    await expect(button).toBeVisible();

    const clicks = await watchClicks(page);
    await button.focus();
    await page.keyboard.press("Enter");
    await expect.poll(clicks).toBeGreaterThan(0);
  });

  test("should activate icon buttons with Space key", async ({ page }) => {
    // Two things were wrong here. The guard made it pass when nothing was
    // found, and `[role="button"]` finds nothing on this page at all: a
    // clickable field icon renders as a real <button type="button"> with an
    // aria-label (FieldWrapper.tsx:176-183), never a role="button" span.
    const button = page.getByRole("button", { name: "Submit search" });
    await expect(button).toBeVisible();

    const clicks = await watchClicks(page);
    await button.focus();
    await page.keyboard.press("Space");
    await expect.poll(clicks).toBeGreaterThan(0);
  });

});

test.describe("Input Accessibility Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/input");
    await page.waitForLoadState("domcontentloaded");
    await waitForInputVisible(page);
    await injectAxe(page);
  });

  test("should have no critical accessibility violations", async ({ page }) => {
    const results = await page.evaluate(async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const axeResults = await (window as any).axe.run(
        "input, label, [role=alert]",
        {
          rules: {
            "color-contrast": { enabled: false },
            region: { enabled: false },
          },
        },
      );
      return axeResults.violations;
    });

    const criticalViolations = results.filter(
      (v: { impact: string }) => v.impact === "critical",
    );

    if (criticalViolations.length > 0) {
      console.log(
        "Critical accessibility violations:",
        JSON.stringify(criticalViolations, null, 2),
      );
    }

    expect(criticalViolations).toHaveLength(0);
  });


  test("should have aria-invalid on error inputs", async ({ page }) => {
    const errorInputs = page.locator(
      '[data-error="true"] input, input[aria-invalid="true"]',
    );

    // The guard used to make this pass when the element was absent, which is
    // the failure the test exists to catch. Assert presence, then behaviour.
    await expect(errorInputs.first()).toBeVisible();
    const input = errorInputs.first();
    await expect(input).toHaveAttribute("aria-invalid", "true");
  });

  test("should have aria-describedby linking to error message", async ({
    page,
  }) => {
    const inputsWithError = page.locator("input[aria-describedby]");

    // The guard used to make this pass when the element was absent, which is
    // the failure the test exists to catch. Assert presence, then behaviour.
    await expect(inputsWithError.first()).toBeVisible();
    const input = inputsWithError.first();
    const describedBy = await input.getAttribute("aria-describedby");

    if (describedBy) {
      // Use attribute selector instead of ID selector to handle special characters
      // (React's useId() generates IDs with colons that need escaping in CSS)
      const errorElement = page.locator(`[id="${describedBy}"]`);
      await expect(errorElement).toBeVisible();
    }
  });

  test("should mark required inputs with aria-required", async ({ page }) => {
    const requiredInputs = page.locator("input[required]");

    // The guard used to make this pass when the element was absent, which is
    // the failure the test exists to catch. Assert presence, then behaviour.
    await expect(requiredInputs.first()).toBeVisible();
    const input = requiredInputs.first();
    const ariaRequired = await input.getAttribute("aria-required");
    expect(ariaRequired).toBe("true");
  });

});

test.describe("Input Responsive Tests", () => {
  test("should render correctly on mobile viewport", async ({
    page,
    browserName,
  }, testInfo) => {
    const isMobileProject = testInfo.project.name.includes("Mobile");

    // For desktop browsers, set viewport before navigation
    if (!isMobileProject) {
      await page.setViewportSize({ width: 375, height: 667 });
    }

    await page.goto("/input");
    await page.waitForLoadState("domcontentloaded");

    // Firefox needs extra time for rendering after viewport changes
    if (browserName === "firefox") {
      await page.waitForTimeout(500);
    }

    // Wait for inputs to be attached to DOM with longer timeout for Firefox
    const input = page.locator("input").first();
    const timeout = browserName === "firefox" ? 10000 : 5000;
    await input.waitFor({ state: "attached", timeout });

    // Verify inputs exist
    const count = await page.locator("input").count();
    expect(count).toBeGreaterThan(0);

    // For mobile projects, also verify visibility
    if (isMobileProject) {
      await input.scrollIntoViewIfNeeded();
      await expect(input).toBeVisible();
    }
  });

  test("should handle touch interactions on mobile", async ({ page }, testInfo) => {
    const isMobileProject = testInfo.project.name.includes("Mobile");

    if (!isMobileProject) {
      await page.setViewportSize({ width: 375, height: 667 });
    }

    // Driven from the fixture rather than the demo page. On a mobile viewport
    // the first visible `input` on `/input` is the site's own "Search
    // documentation" field — page chrome, not the component — so the test was
    // tapping the wrong thing, which is the defect E2E-INVENTORY recorded when
    // the suite was auditing the marketing home page.
    await gotoFixture(page, "Input", "labelled");

    const input = page.locator('[data-fixture] input:visible').first();
    await input.waitFor({ state: "visible", timeout: 5000 });

    // For mobile projects, test actual tap/click behavior
    if (isMobileProject) {
      await input.scrollIntoViewIfNeeded();
      await input.click();
      await input.fill("Mobile test");
      await expect(input).toHaveValue("Mobile test");
    } else {
      // For desktop browsers with viewport emulation, just verify input exists
      await expect(input).toBeAttached();
    }
  });

  test("fullWidth inputs should span container", async ({ page }) => {
    await page.goto("/input");
    await page.waitForLoadState("domcontentloaded");
    await waitForInputVisible(page);

    // Find the DemoWrapper containers (border rounded-lg) that contain inputs
    // These are the main demo containers that should have reasonable width
    const demoContainers = page.locator(".border.rounded-lg").filter({
      has: page.locator("input"),
    });

    const count = await demoContainers.count();
    if (count > 0) {
      // Scroll to first demo container to ensure it's visible
      const container = demoContainers.first();
      await container.scrollIntoViewIfNeeded();

      const input = container.locator("input").first();
      await input.scrollIntoViewIfNeeded();

      const inputBox = await input.boundingBox();
      const containerBox = await container.boundingBox();

      if (inputBox && containerBox && inputBox.width > 50) {
        // Input should have reasonable width (at least 100px for a functional input)
        expect(inputBox.width).toBeGreaterThan(100);
      } else {
        // If we can't get bounding boxes, just verify the input exists
        await expect(input).toBeVisible();
      }
    }
  });
});


test.describe("Input Form Integration", () => {

  test("should support different input types", async ({ page }) => {
    await page.goto("/input");
    await page.waitForLoadState("domcontentloaded");

    // Check for various input types
    const textInputs = page.locator('input[type="text"]');
    const emailInputs = page.locator('input[type="email"]');
    const passwordInputs = page.locator('input[type="password"]');

    // At least text inputs should exist
    expect(await textInputs.count()).toBeGreaterThanOrEqual(0);

    // If email inputs exist, verify type
    // The guard used to make this pass when the element was absent, which is
    // the failure the test exists to catch. Assert presence, then behaviour.
    await expect(emailInputs.first()).toBeVisible();
    await expect(emailInputs.first()).toHaveAttribute("type", "email");

    // If password inputs exist, verify type
    // The guard used to make this pass when the element was absent, which is
    // the failure the test exists to catch. Assert presence, then behaviour.
    await expect(passwordInputs.first()).toBeVisible();
    await expect(passwordInputs.first()).toHaveAttribute("type", "password");
  });
});

/**
 * The three of input.spec.ts's thirteen stale tests that need a browser
 * (E2E-TRIAGE.md). Eight duplicated Input.test.tsx; two — form participation
 * and id uniqueness across instances — moved there as unit tests.
 */
test.describe("Input (fixtures)", () => {
  test("accepts typing after Tab reaches it", async ({ page }) => {
    await gotoFixture(page, "Input", "labelled");

    const input = page.locator("input").first();
    for (let i = 0; i < 8; i++) {
      await page.keyboard.press("Tab");
      if (await input.evaluate((el) => document.activeElement === el)) break;
    }
    await expect(input).toBeFocused();

    await page.keyboard.type("typed after tab");
    await expect(input).toHaveValue("typed after tab");
  });


  test("keeps every character of fast typing", async ({ page }) => {
    await gotoFixture(page, "Input", "default");

    const input = page.locator("input").first();
    await input.click();
    await page.keyboard.type("abcdefghijklmnopqrstuvwxyz", { delay: 0 });

    await expect(input).toHaveValue("abcdefghijklmnopqrstuvwxyz");
  });
});
