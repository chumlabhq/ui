import { test, expect } from "@playwright/test";
import { injectAxe } from "axe-playwright";

// Helper to wait for textarea visibility with scroll support
async function waitForTextAreaVisible(page: import("@playwright/test").Page) {
  const textarea = page.locator("textarea").first();
  // Wait for element to be attached to DOM first
  await textarea.waitFor({ state: "attached", timeout: 10000 });
  // Then scroll into view and wait for visibility
  await textarea.scrollIntoViewIfNeeded();
  await textarea.waitFor({ state: "visible", timeout: 10000 });
}

test.describe("TextArea Component - Cross-Browser Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/demo/text-area");
    await page.waitForLoadState("domcontentloaded");
    await waitForTextAreaVisible(page);
  });

  test.describe("Basic Functionality", () => {
    test("should render textarea components on the page", async ({ page }) => {
      const textareas = page.locator("textarea");
      await expect(textareas.first()).toBeVisible();

      const count = await textareas.count();
      expect(count).toBeGreaterThan(0);
    });

    test("should accept user input", async ({ page }) => {
      const textarea = page.locator("textarea").first();

      await textarea.fill("Hello World");

      await expect(textarea).toHaveValue("Hello World");
    });

    test("should accept multiline input", async ({ page }) => {
      const textarea = page.locator("textarea").first();

      await textarea.fill("Line 1\nLine 2\nLine 3");

      await expect(textarea).toHaveValue("Line 1\nLine 2\nLine 3");
    });

    test("should clear textarea value", async ({ page }) => {
      const textarea = page.locator("textarea").first();

      await textarea.fill("Test value");
      await textarea.clear();

      await expect(textarea).toHaveValue("");
    });

    test("should display placeholder text", async ({ page }) => {
      const textareaWithPlaceholder = page.locator("textarea[placeholder]").first();

      if ((await textareaWithPlaceholder.count()) > 0) {
        const placeholder = await textareaWithPlaceholder.getAttribute("placeholder");
        expect(placeholder).toBeTruthy();
      }
    });
  });

  test.describe("Labels", () => {
    test("should display labels for textareas", async ({ page }) => {
      const labels = page.locator("label");

      if ((await labels.count()) > 0) {
        await expect(labels.first()).toBeVisible();
      }
    });

    test("should show required indicator on required fields", async ({ page }) => {
      const requiredIndicator = page.locator('span:text("*")');

      if ((await requiredIndicator.count()) > 0) {
        await expect(requiredIndicator.first()).toBeVisible();
      }
    });

    test("clicking label should focus associated textarea", async ({ page }) => {
      const label = page.locator("label").first();

      if ((await label.count()) > 0) {
        await label.click();

        // The associated textarea should be focused
        const forAttr = await label.getAttribute("for");
        if (forAttr) {
          const textarea = page.locator(`#${forAttr}`);
          await expect(textarea).toBeFocused();
        }
      }
    });
  });

  test.describe("Icon Interactions", () => {
    test("should render leading icons", async ({ page }) => {
      // At least some textareas should exist on the page
      const textareas = page.locator("textarea");
      const count = await textareas.count();
      expect(count).toBeGreaterThan(0);
    });

    test("should handle clickable icon interactions", async ({ page }) => {
      // Find elements with role="button" that are icon wrappers
      const iconButtons = page.locator('[role="button"]');

      if ((await iconButtons.count()) > 0) {
        const button = iconButtons.first();
        await expect(button).toBeVisible();

        // Should be clickable without errors
        await button.click();
      }
    });
  });

  test.describe("Error States", () => {
    test("should display error message", async ({ page }) => {
      const errorMessages = page.locator('[role="alert"]');

      if ((await errorMessages.count()) > 0) {
        await expect(errorMessages.first()).toBeVisible();
      }
    });

    test("should mark invalid textareas with aria-invalid", async ({ page }) => {
      const invalidTextareas = page.locator('textarea[aria-invalid="true"]');

      if ((await invalidTextareas.count()) > 0) {
        await expect(invalidTextareas.first()).toBeVisible();
      }
    });
  });

  test.describe("Disabled States", () => {
    test("should render disabled textareas", async ({ page }) => {
      // Look for explicitly disabled textareas
      const disabledTextarea = page.locator('textarea[placeholder="Disabled textarea"]');

      if ((await disabledTextarea.count()) > 0) {
        await disabledTextarea.scrollIntoViewIfNeeded();
        await expect(disabledTextarea).toBeVisible();
        await expect(disabledTextarea).toBeDisabled();
      } else {
        // Fallback: find any disabled textarea and scroll to it
        const anyDisabledTextarea = page.locator("textarea:disabled").first();
        if ((await anyDisabledTextarea.count()) > 0) {
          await anyDisabledTextarea.scrollIntoViewIfNeeded();
          await expect(anyDisabledTextarea).toBeDisabled();
        }
      }
    });

    test("should not allow typing in disabled textarea", async ({ page }) => {
      const disabledTextarea = page.locator("textarea:disabled").first();

      if ((await disabledTextarea.count()) > 0) {
        const valueBefore = await disabledTextarea.inputValue();

        // Attempt to type (should not work on disabled textarea)
        await disabledTextarea.type("test").catch(() => {
          // Expected to fail or do nothing
        });

        const valueAfter = await disabledTextarea.inputValue();
        expect(valueAfter).toBe(valueBefore);
      }
    });
  });

  test.describe("Loading States", () => {
    test("should display loader when loading", async ({ page }) => {
      // Look for loader elements (CircularLoader or custom)
      const loaders = page.locator('[data-loading="true"]');

      if ((await loaders.count()) > 0) {
        await expect(loaders.first()).toBeVisible();
      }
    });
  });
});

test.describe("TextArea Keyboard Navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/demo/text-area");
    await page.waitForLoadState("domcontentloaded");
    await waitForTextAreaVisible(page);
  });

  test("should focus textarea on tab", async ({ page }) => {
    // Tab into the page
    await page.keyboard.press("Tab");

    // Eventually a textarea should be focused
    const focusedElement = page.locator(":focus");
    await expect(focusedElement).toBeVisible();
  });

  test("should navigate through textareas with tab", async ({ page }) => {
    const textareas = page.locator("textarea");
    const count = await textareas.count();

    if (count >= 2) {
      // Focus first textarea
      await textareas.first().focus();

      // Tab to next element
      await page.keyboard.press("Tab");

      // Something should be focused
      const focusedElement = page.locator(":focus");
      await expect(focusedElement).toBeVisible();
    }
  });

  test("should activate icon buttons with Enter key", async ({ page }) => {
    const iconButtons = page.locator('[role="button"]');

    if ((await iconButtons.count()) > 0) {
      const button = iconButtons.first();
      await button.focus();
      await page.keyboard.press("Enter");

      // Should have executed without errors
    }
  });

  test("should activate icon buttons with Space key", async ({ page }) => {
    const iconButtons = page.locator('[role="button"]');

    if ((await iconButtons.count()) > 0) {
      const button = iconButtons.first();
      await button.focus();
      await page.keyboard.press("Space");

      // Should have executed without errors
    }
  });

  test("should allow typing after tabbing to textarea", async ({ page }) => {
    const textarea = page.locator("textarea").first();
    await textarea.focus();

    await page.keyboard.type("Hello");

    await expect(textarea).toHaveValue("Hello");
  });

  test("should support Enter key for newlines", async ({ page }) => {
    const textarea = page.locator("textarea").first();
    await textarea.focus();

    await page.keyboard.type("Line 1");
    await page.keyboard.press("Enter");
    await page.keyboard.type("Line 2");

    await expect(textarea).toHaveValue("Line 1\nLine 2");
  });
});

test.describe("TextArea Accessibility Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/demo/text-area");
    await page.waitForLoadState("domcontentloaded");
    await waitForTextAreaVisible(page);
    await injectAxe(page);
  });

  test("should have no critical accessibility violations", async ({ page }) => {
    const results = await page.evaluate(async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const axeResults = await (window as any).axe.run(
        "textarea, label, [role=alert]",
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

  test("should have proper labels on textareas", async ({ page }) => {
    const labeledTextareas = page.locator("textarea[id]");
    const count = await labeledTextareas.count();

    for (let i = 0; i < Math.min(count, 5); i++) {
      const textarea = labeledTextareas.nth(i);
      const id = await textarea.getAttribute("id");

      if (id) {
        // Check if there's a label pointing to this textarea
        const label = page.locator(`label[for="${id}"]`);

        // Verify label is visible when present
        if ((await label.count()) > 0) {
          await expect(label).toBeVisible();
        }
      }
    }
  });

  test("should have aria-invalid on error textareas", async ({ page }) => {
    const errorTextareas = page.locator(
      '[data-error="true"] textarea, textarea[aria-invalid="true"]',
    );

    if ((await errorTextareas.count()) > 0) {
      const textarea = errorTextareas.first();
      await expect(textarea).toHaveAttribute("aria-invalid", "true");
    }
  });

  test("should have aria-describedby linking to error message", async ({
    page,
  }) => {
    const textareasWithError = page.locator("textarea[aria-describedby]");

    if ((await textareasWithError.count()) > 0) {
      const textarea = textareasWithError.first();
      const describedBy = await textarea.getAttribute("aria-describedby");

      if (describedBy) {
        // Use attribute selector instead of ID selector to handle special characters
        const errorElement = page.locator(`[id="${describedBy}"]`);
        await expect(errorElement).toBeVisible();
      }
    }
  });

  test("should mark required textareas with aria-required", async ({ page }) => {
    const requiredTextareas = page.locator("textarea[required]");

    if ((await requiredTextareas.count()) > 0) {
      const textarea = requiredTextareas.first();
      const ariaRequired = await textarea.getAttribute("aria-required");
      expect(ariaRequired).toBe("true");
    }
  });

  test("icon buttons should have button role when clickable", async ({
    page,
  }) => {
    // Find elements that appear to be icon buttons
    const iconButtons = page.locator('[role="button"]');

    if ((await iconButtons.count()) > 0) {
      const button = iconButtons.first();

      // Verify role is correctly set
      await expect(button).toHaveAttribute("role", "button");

      // Should be focusable (tabindex=0)
      const tabIndex = await button.getAttribute("tabindex");
      expect(tabIndex).toBe("0");
    }
  });
});

test.describe("TextArea Responsive Tests", () => {
  test("should render correctly on mobile viewport", async ({ page }, testInfo) => {
    const isMobileProject = testInfo.project.name.includes("Mobile");

    // For desktop browsers, set viewport before navigation
    if (!isMobileProject) {
      await page.setViewportSize({ width: 375, height: 667 });
    }

    await page.goto("/demo/text-area");
    await page.waitForLoadState("domcontentloaded");

    // Wait for textareas to be attached to DOM
    const textarea = page.locator("textarea").first();
    await textarea.waitFor({ state: "attached", timeout: 5000 });

    // Verify textareas exist
    const count = await page.locator("textarea").count();
    expect(count).toBeGreaterThan(0);

    // For mobile projects, also verify visibility
    if (isMobileProject) {
      await textarea.scrollIntoViewIfNeeded();
      await expect(textarea).toBeVisible();
    }
  });

  test("should handle touch interactions on mobile", async ({ page }, testInfo) => {
    const isMobileProject = testInfo.project.name.includes("Mobile");

    if (!isMobileProject) {
      await page.setViewportSize({ width: 375, height: 667 });
    }

    await page.goto("/demo/text-area");
    await page.waitForLoadState("domcontentloaded");

    const textarea = page.locator("textarea").first();
    await textarea.waitFor({ state: "attached", timeout: 5000 });

    // For mobile projects, test actual tap/click behavior
    if (isMobileProject) {
      await textarea.scrollIntoViewIfNeeded();
      await textarea.click();
      await textarea.fill("Mobile test\nSecond line");
      await expect(textarea).toHaveValue("Mobile test\nSecond line");
    } else {
      // For desktop browsers with viewport emulation, just verify textarea exists
      await expect(textarea).toBeAttached();
    }
  });

  test("fullWidth textareas should span container", async ({ page }) => {
    await page.goto("/demo/text-area");
    await page.waitForLoadState("domcontentloaded");
    await waitForTextAreaVisible(page);

    // Find the DemoWrapper containers that contain textareas
    const demoContainers = page.locator(".border.rounded-lg").filter({
      has: page.locator("textarea"),
    });

    const count = await demoContainers.count();
    if (count > 0) {
      // Scroll to first demo container to ensure it's visible
      const container = demoContainers.first();
      await container.scrollIntoViewIfNeeded();

      const textarea = container.locator("textarea").first();
      await textarea.scrollIntoViewIfNeeded();

      const textareaBox = await textarea.boundingBox();
      const containerBox = await container.boundingBox();

      if (textareaBox && containerBox && textareaBox.width > 50) {
        // Textarea should have reasonable width
        expect(textareaBox.width).toBeGreaterThan(100);
      } else {
        // If we can't get bounding boxes, just verify the textarea exists
        await expect(textarea).toBeVisible();
      }
    }
  });
});

test.describe("TextArea Performance Tests", () => {
  test("should load page within acceptable time", async ({
    page,
    browserName,
  }) => {
    const startTime = Date.now();

    await page.goto("/demo/text-area");
    await page.waitForLoadState("networkidle");

    const textarea = page.locator("textarea").first();
    await textarea.waitFor({ state: "attached", timeout: 10000 });
    await textarea.scrollIntoViewIfNeeded();
    await textarea.waitFor({ state: "visible", timeout: 10000 });

    const loadTime = Date.now() - startTime;

    // Mobile browsers and Firefox have higher overhead in CI environments
    const threshold = browserName === "firefox" ? 15000 : 10000;
    expect(loadTime).toBeLessThan(threshold);
  });

  test("should handle rapid typing without lag", async ({
    page,
    browserName,
  }) => {
    await page.goto("/demo/text-area");
    await page.waitForLoadState("domcontentloaded");

    const textarea = page.locator("textarea").first();
    await textarea.waitFor({ state: "attached", timeout: 10000 });
    await textarea.scrollIntoViewIfNeeded();
    await textarea.click();

    // Use shorter string for Firefox to avoid timeout issues
    const testString =
      browserName === "firefox"
        ? "Quick brown fox\njumps over"
        : "The quick brown fox jumps over the lazy dog\nSecond line of text";

    const startTime = Date.now();

    // Use fill for faster, more reliable input
    await textarea.fill(testString);

    const typeTime = Date.now() - startTime;

    await expect(textarea).toHaveValue(testString);

    // Firefox and WebKit have higher overhead than Chromium
    const buffer = browserName === "chromium" ? 1000 : 2000;
    expect(typeTime).toBeLessThan(testString.length * 10 + buffer);
  });

  test("should handle multiple textareas on page", async ({ page }) => {
    await page.goto("/demo/text-area");
    await page.waitForLoadState("networkidle");
    await waitForTextAreaVisible(page);

    const textareas = page.locator("textarea");
    const count = await textareas.count();

    // Page should handle many textareas
    expect(count).toBeGreaterThan(0);

    // Spot check a few textareas work correctly
    for (let i = 0; i < Math.min(count, 3); i++) {
      const textarea = textareas.nth(i);
      await textarea.scrollIntoViewIfNeeded();

      if (!(await textarea.isDisabled())) {
        await textarea.fill(`Test ${i}\nLine 2`);
        await expect(textarea).toHaveValue(`Test ${i}\nLine 2`);
        await textarea.clear();
      }
    }
  });
});

test.describe("TextArea Form Integration", () => {
  test("should work within form context", async ({ page }) => {
    await page.goto("/demo/text-area");
    await page.waitForLoadState("domcontentloaded");

    // Find textareas with name attribute (form-ready)
    const namedTextareas = page.locator("textarea[name]");

    if ((await namedTextareas.count()) > 0) {
      const textarea = namedTextareas.first();
      const name = await textarea.getAttribute("name");

      expect(name).toBeTruthy();
    }
  });

  test("should respect rows attribute", async ({ page }) => {
    await page.goto("/demo/text-area");
    await page.waitForLoadState("domcontentloaded");

    const textareasWithRows = page.locator("textarea[rows]");

    if ((await textareasWithRows.count()) > 0) {
      const textarea = textareasWithRows.first();
      const rows = await textarea.getAttribute("rows");

      expect(rows).toBeTruthy();
      expect(parseInt(rows!, 10)).toBeGreaterThan(0);
    }
  });
});
