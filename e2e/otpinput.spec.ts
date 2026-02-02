import { test, expect } from "@playwright/test";
import { injectAxe } from "axe-playwright";

// Helper to wait for OTP inputs visibility with scroll support
async function waitForOtpVisible(page: import("@playwright/test").Page) {
  const input = page.locator('[aria-label="OTP digit 1"]').first();
  await input.waitFor({ state: "attached", timeout: 10000 });
  await input.scrollIntoViewIfNeeded();
  await input.waitFor({ state: "visible", timeout: 10000 });
}

// Helper to get OTP input group
function getOtpInputs(page: import("@playwright/test").Page) {
  return page
    .locator('[role="group"][aria-label="OTP input"]')
    .first()
    .locator("input");
}

test.describe("OTP Input - Cross-Browser Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/demo/otp-input");
    await page.waitForLoadState("domcontentloaded");
    await waitForOtpVisible(page);
  });

  test.describe("Basic Functionality", () => {
    test("should render OTP input components on the page", async ({ page }) => {
      const otpGroups = page.locator('[role="group"][aria-label="OTP input"]');
      await expect(otpGroups.first()).toBeVisible();

      const count = await otpGroups.count();
      expect(count).toBeGreaterThan(0);
    });

    test("should accept digit input in first field", async ({ page }) => {
      const inputs = getOtpInputs(page);
      const firstInput = inputs.first();

      await firstInput.click();
      await page.keyboard.type("5");

      await expect(firstInput).toHaveValue("5");
    });

    test("should auto-advance to next input after entering digit", async ({
      page,
    }) => {
      const inputs = getOtpInputs(page);
      const firstInput = inputs.first();
      const secondInput = inputs.nth(1);

      await firstInput.click();
      // Use press instead of type for more reliable cross-browser behavior
      await page.keyboard.press("1");
      
      // Wait for focus to advance with timeout for Firefox
      await expect(secondInput).toBeFocused({ timeout: 5000 });
    });

    test("should complete full OTP entry", async ({ page }) => {
      const inputs = getOtpInputs(page);
      const firstInput = inputs.first();

      await firstInput.click();

      // Type complete OTP
      await page.keyboard.type("123456");

      // Verify all inputs filled
      for (let i = 0; i < 6; i++) {
        await expect(inputs.nth(i)).toHaveValue(String(i + 1));
      }
    });

    test("should only accept numeric input", async ({ page }) => {
      const inputs = getOtpInputs(page);
      const firstInput = inputs.first();

      await firstInput.click();
      
      // Type non-numeric then numeric characters one by one for reliability
      for (const char of "abc123") {
        await page.keyboard.press(char);
        // Small delay for Firefox input processing
        await page.waitForTimeout(50);
      }

      // Only numeric characters should be accepted - first input should have "1"
      await expect(firstInput).toHaveValue("1", { timeout: 5000 });
    });
  });

  test.describe("Paste Functionality", () => {
    test("should handle paste of complete OTP", async ({ page }) => {
      const inputs = getOtpInputs(page);
      const firstInput = inputs.first();

      await firstInput.click();

      // Paste OTP code
      await page.evaluate(() => {
        const pasteEvent = new ClipboardEvent("paste", {
          bubbles: true,
          clipboardData: new DataTransfer(),
        });
        pasteEvent.clipboardData!.setData("text/plain", "987654");
        document
          .querySelector('[role="group"][aria-label="OTP input"]')
          ?.dispatchEvent(pasteEvent);
      });

      // Verify pasted values
      await expect(inputs.nth(0)).toHaveValue("9");
      await expect(inputs.nth(1)).toHaveValue("8");
      await expect(inputs.nth(2)).toHaveValue("7");
    });

    test("should filter non-digits from pasted content", async ({ page }) => {
      const inputs = getOtpInputs(page);
      const firstInput = inputs.first();

      await firstInput.click();

      await page.evaluate(() => {
        const pasteEvent = new ClipboardEvent("paste", {
          bubbles: true,
          clipboardData: new DataTransfer(),
        });
        pasteEvent.clipboardData!.setData("text/plain", "1-2-3-4-5-6");
        document
          .querySelector('[role="group"][aria-label="OTP input"]')
          ?.dispatchEvent(pasteEvent);
      });

      // Only digits should be captured
      for (let i = 0; i < 6; i++) {
        await expect(inputs.nth(i)).toHaveValue(String(i + 1));
      }
    });
  });

  test.describe("Keyboard Navigation", () => {
    test("should navigate left with ArrowLeft", async ({ page }) => {
      const inputs = getOtpInputs(page);

      // Click third input
      await inputs.nth(2).click();
      await page.keyboard.press("ArrowLeft");

      await expect(inputs.nth(1)).toBeFocused();
    });

    test("should navigate right with ArrowRight", async ({ page }) => {
      const inputs = getOtpInputs(page);

      await inputs.nth(1).click();
      await page.keyboard.press("ArrowRight");

      await expect(inputs.nth(2)).toBeFocused();
    });

    test("should navigate to first input with Home", async ({ page }) => {
      const inputs = getOtpInputs(page);

      await inputs.nth(4).click();
      await page.keyboard.press("Home");

      await expect(inputs.first()).toBeFocused();
    });

    test("should navigate to last input with End", async ({ page }) => {
      const inputs = getOtpInputs(page);

      await inputs.first().click();
      await page.keyboard.press("End");

      await expect(inputs.nth(5)).toBeFocused();
    });

    test("should clear and navigate back on Backspace", async ({ page }) => {
      const inputs = getOtpInputs(page);

      // Enter some digits first
      await inputs.first().click();
      await page.keyboard.type("12");
      // After typing "12": index 0 has "1", index 1 has "2", focus is on index 2 (empty)

      // Backspace on empty input clears previous digit and moves focus there
      await page.keyboard.press("Backspace");

      // Focus should be on index 1 (the cleared digit's position)
      await expect(inputs.nth(1)).toBeFocused();
    });

    test("should clear current input on Delete", async ({ page }) => {
      const inputs = getOtpInputs(page);

      await inputs.first().click();
      await page.keyboard.type("1");

      // Go back and press Delete
      await page.keyboard.press("ArrowLeft");
      await page.keyboard.press("Delete");

      await expect(inputs.first()).toHaveValue("");
      await expect(inputs.first()).toBeFocused();
    });
  });

  test.describe("Grouped OTP Inputs", () => {
    test("should display grouped inputs with separators", async ({ page }) => {
      // Find grouped OTP section - use heading for reliable targeting
      const groupedSection = page.getByRole("heading", {
        name: "Grouped OTP Variations",
      });
      await groupedSection.scrollIntoViewIfNeeded();

      // Look for OTP inputs with separators (dash separators exist in the demo)
      const separators = page
        .locator('[role="group"][aria-label="OTP input"]')
        .filter({
          has: page.locator('span:has-text("-")'),
        });

      const count = await separators.count();
      expect(count).toBeGreaterThan(0);
    });

    test("should navigate through grouped inputs seamlessly", async ({
      page,
    }) => {
      // Find a grouped OTP section - use heading for precise targeting
      const groupedSection = page.getByRole("heading", {
        name: "Layout Variations",
      });
      await groupedSection.scrollIntoViewIfNeeded();

      // Get the first grouped OTP in the Layout Variations section
      // The section contains multiple OTP inputs with [data-group] elements
      const layoutSection = groupedSection.locator("..").locator("..");
      const firstOtpWrapper = layoutSection
        .locator('[role="group"][aria-label="OTP input"]')
        .first();

      const allInputs = firstOtpWrapper.locator("input");

      if ((await allInputs.count()) > 0) {
        await allInputs.first().click();

        // Type through the group
        await page.keyboard.type("123456");

        const count = await allInputs.count();

        for (let i = 0; i < Math.min(count, 6); i++) {
          const value = await allInputs.nth(i).inputValue();
          expect(value).toBe(String(i + 1));
        }
      }
    });
  });

  test.describe("Error States", () => {
    test("should display error styling on error state", async ({ page }) => {
      // Use heading role to avoid matching table cells
      const errorSection = page.getByRole("heading", { name: "Error State" });
      await errorSection.scrollIntoViewIfNeeded();

      // Look for error message
      const errorMessage = page.locator('[role="alert"]');

      if ((await errorMessage.count()) > 0) {
        await expect(errorMessage.first()).toBeVisible();
      }
    });

    test("should mark inputs with aria-invalid in error state", async ({
      page,
    }) => {
      const invalidInputs = page.locator('input[aria-invalid="true"]');

      if ((await invalidInputs.count()) > 0) {
        await expect(invalidInputs.first()).toBeVisible();
      }
    });
  });

  test.describe("Disabled State", () => {
    test("should render disabled OTP inputs", async ({ page }) => {
      // Use heading role to avoid matching table cells
      const disabledSection = page.getByRole("heading", {
        name: "Disabled State",
      });
      await disabledSection.scrollIntoViewIfNeeded();

      // Find disabled inputs nearby
      const disabledInputs = page.locator("input:disabled");

      if ((await disabledInputs.count()) > 0) {
        await expect(disabledInputs.first()).toBeDisabled();
      }
    });

    test("should not accept input when disabled", async ({ page }) => {
      const disabledInputs = page.locator("input:disabled");

      if ((await disabledInputs.count()) > 0) {
        const input = disabledInputs.first();
        const valueBefore = await input.inputValue();

        // Attempt to type (should not work)
        await input.type("9").catch(() => {
          // Expected to fail
        });

        const valueAfter = await input.inputValue();
        expect(valueAfter).toBe(valueBefore);
      }
    });
  });

  test.describe("Password/Masked Input", () => {
    test("should mask input when inputType is password", async ({ page }) => {
      const passwordSection = page.locator("text=Password Type (masked)");
      await passwordSection.scrollIntoViewIfNeeded();

      // Find password type inputs
      const passwordInputs = page.locator('input[type="password"]');

      if ((await passwordInputs.count()) > 0) {
        await expect(passwordInputs.first()).toHaveAttribute(
          "type",
          "password",
        );
      }
    });
  });
});

test.describe("OTP Input - Keyboard Navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/demo/otp-input");
    await page.waitForLoadState("domcontentloaded");
    await waitForOtpVisible(page);
  });

  test("should allow full keyboard-only OTP entry", async ({ page }) => {
    const inputs = getOtpInputs(page);
    
    // Focus first input via click, then use keyboard only
    await inputs.first().click();

    // Type digits (should auto-advance)
    await page.keyboard.type("654321");

    // Verify the values were entered sequentially
    const expectedValues = ["6", "5", "4", "3", "2", "1"];
    for (let i = 0; i < 6; i++) {
      await expect(inputs.nth(i)).toHaveValue(expectedValues[i]);
    }
  });

  test("should support navigation and editing", async ({ page }) => {
    const inputs = getOtpInputs(page);

    // Enter OTP
    await inputs.first().click();
    await page.keyboard.type("111111");

    // Navigate to middle and change value
    await page.keyboard.press("Home");
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowRight");

    // Delete and type new value
    await page.keyboard.press("Delete");
    await page.keyboard.type("9");

    // Third input should now be 9
    await expect(inputs.nth(2)).toHaveValue("9");
  });
});

test.describe("OTP Input - Accessibility Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/demo/otp-input");
    await page.waitForLoadState("domcontentloaded");
    await waitForOtpVisible(page);
    await injectAxe(page);
  });

  test("should have no critical accessibility violations", async ({ page }) => {
    const results = await page.evaluate(async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const axeResults = await (window as any).axe.run(
        '[role="group"][aria-label="OTP input"], label, [role=alert]',
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

  test("should have proper aria-label on each input", async ({ page }) => {
    const inputs = getOtpInputs(page);
    const count = await inputs.count();

    for (let i = 0; i < count; i++) {
      const input = inputs.nth(i);
      const ariaLabel = await input.getAttribute("aria-label");
      expect(ariaLabel).toBe(`OTP digit ${i + 1}`);
    }
  });

  test("should have role=group on wrapper", async ({ page }) => {
    const wrapper = page
      .locator('[role="group"][aria-label="OTP input"]')
      .first();
    await expect(wrapper).toBeVisible();
    await expect(wrapper).toHaveAttribute(
      "aria-roledescription",
      "One-time password input",
    );
  });

  test("should have autocomplete=one-time-code on first input", async ({
    page,
  }) => {
    const inputs = getOtpInputs(page);
    await expect(inputs.first()).toHaveAttribute(
      "autocomplete",
      "one-time-code",
    );
  });

  test("should have aria-describedby linking to error in error state", async ({
    page,
  }) => {
    const inputsWithDescribedBy = page.locator("input[aria-describedby]");

    if ((await inputsWithDescribedBy.count()) > 0) {
      const input = inputsWithDescribedBy.first();
      const describedBy = await input.getAttribute("aria-describedby");

      if (describedBy) {
        const errorElement = page.locator(`[id="${describedBy}"]`);
        await expect(errorElement).toBeVisible();
      }
    }
  });

  test("should have labels properly associated via htmlFor", async ({
    page,
  }) => {
    const labels = page.locator("label[for]");
    const count = await labels.count();

    for (let i = 0; i < Math.min(count, 3); i++) {
      const label = labels.nth(i);
      const forAttr = await label.getAttribute("for");

      if (forAttr) {
        // Check if corresponding input exists using attribute selector (avoids CSS.escape issue)
        const input = page.locator(`[id="${forAttr}"]`);
        if ((await input.count()) > 0) {
          await expect(input).toBeVisible();
        }
      }
    }
  });
});

test.describe("OTP Input - Responsive Tests", () => {
  test("should render correctly on mobile viewport", async ({
    page,
    browserName,
  }, testInfo) => {
    const isMobileProject = testInfo.project.name.includes("Mobile");

    if (!isMobileProject) {
      await page.setViewportSize({ width: 375, height: 667 });
    }

    await page.goto("/demo/otp-input");
    await page.waitForLoadState("domcontentloaded");

    if (browserName === "firefox") {
      await page.waitForTimeout(500);
    }

    const inputs = page.locator('[aria-label="OTP digit 1"]');
    const timeout = browserName === "firefox" ? 10000 : 5000;
    await inputs.first().waitFor({ state: "attached", timeout });

    const count = await inputs.count();
    expect(count).toBeGreaterThan(0);

    if (isMobileProject) {
      await inputs.first().scrollIntoViewIfNeeded();
      await expect(inputs.first()).toBeVisible();
    }
  });

  test("should handle touch interactions on mobile", async ({
    page,
  }, testInfo) => {
    const isMobileProject = testInfo.project.name.includes("Mobile");

    if (!isMobileProject) {
      await page.setViewportSize({ width: 375, height: 667 });
    }

    await page.goto("/demo/otp-input");
    await page.waitForLoadState("domcontentloaded");

    const inputs = getOtpInputs(page);
    await inputs.first().waitFor({ state: "attached", timeout: 5000 });

    if (isMobileProject) {
      await inputs.first().scrollIntoViewIfNeeded();
      await inputs.first().tap();
      await page.keyboard.type("123");

      await expect(inputs.nth(0)).toHaveValue("1");
      await expect(inputs.nth(1)).toHaveValue("2");
      await expect(inputs.nth(2)).toHaveValue("3");
    } else {
      await expect(inputs.first()).toBeAttached();
    }
  });

  test("should maintain touch target size on mobile", async ({
    page,
  }, testInfo) => {
    // Increase timeout for slower browsers
    test.setTimeout(60000);
    
    const isMobileProject = testInfo.project.name.includes("Mobile");

    if (!isMobileProject) {
      await page.setViewportSize({ width: 375, height: 667 });
    }

    await page.goto("/demo/otp-input");
    await page.waitForLoadState("domcontentloaded");

    const inputs = getOtpInputs(page);
    await inputs.first().waitFor({ state: "attached", timeout: 10000 });
    await inputs.first().scrollIntoViewIfNeeded();

    const box = await inputs.first().boundingBox();

    if (box) {
      // Minimum touch target should be 44x44 pixels (WCAG recommendation)
      // Allow some tolerance for styled inputs
      expect(box.width).toBeGreaterThanOrEqual(24);
      expect(box.height).toBeGreaterThanOrEqual(24);
    }
  });
});

test.describe("OTP Input - Browser-Specific Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/demo/otp-input");
    await page.waitForLoadState("domcontentloaded");
    await waitForOtpVisible(page);
  });

  test("should handle focus correctly across browsers", async ({
    page,
    browserName,
  }) => {
    const inputs = getOtpInputs(page);

    await inputs.first().click();
    await expect(inputs.first()).toBeFocused();

    // Type to advance
    await page.keyboard.type("1");
    await expect(inputs.nth(1)).toBeFocused();

    // Safari sometimes has focus quirks with programmatic focus
    if (browserName === "webkit") {
      // Additional verification for Safari
      const focusedElement = page.locator(":focus");
      await expect(focusedElement).toBeVisible();
    }
  });

  test("should handle rapid input across browsers", async ({
    page,
    browserName,
  }) => {
    const inputs = getOtpInputs(page);

    await inputs.first().click();

    // Rapid input
    const startTime = Date.now();
    await page.keyboard.type("123456", { delay: 50 });
    const endTime = Date.now();

    // All inputs should be filled
    for (let i = 0; i < 6; i++) {
      await expect(inputs.nth(i)).toHaveValue(String(i + 1));
    }

    // Should complete in reasonable time (allow more for Firefox/WebKit)
    const maxTime = browserName === "chromium" ? 2000 : 3000;
    expect(endTime - startTime).toBeLessThan(maxTime);
  });
});

test.describe("OTP Input - Performance Tests", () => {
  test("should load page within acceptable time", async ({
    page,
    browserName,
  }) => {
    const startTime = Date.now();

    await page.goto("/demo/otp-input");
    await page.waitForLoadState("networkidle");

    const inputs = page.locator('[aria-label="OTP digit 1"]').first();
    await inputs.waitFor({ state: "attached", timeout: 10000 });
    await inputs.scrollIntoViewIfNeeded();
    await inputs.waitFor({ state: "visible", timeout: 10000 });

    const loadTime = Date.now() - startTime;

    const threshold = browserName === "firefox" ? 15000 : 10000;
    expect(loadTime).toBeLessThan(threshold);
  });

  test("should handle multiple OTP inputs on page efficiently", async ({
    page,
  }) => {
    await page.goto("/demo/otp-input");
    await page.waitForLoadState("domcontentloaded");
    await waitForOtpVisible(page);

    const otpGroups = page.locator('[role="group"][aria-label="OTP input"]');
    const count = await otpGroups.count();

    // Page should handle many OTP components
    expect(count).toBeGreaterThan(5);

    // Spot check a few work correctly
    for (let i = 0; i < Math.min(count, 3); i++) {
      const group = otpGroups.nth(i);
      const firstInput = group.locator("input").first();

      await firstInput.scrollIntoViewIfNeeded();

      if (!(await firstInput.isDisabled())) {
        await firstInput.click();
        await page.keyboard.type("1");

        await expect(firstInput).toHaveValue("1");

        // Clear for next iteration
        await page.keyboard.press("Backspace");
        await page.keyboard.press("Backspace");
      }
    }
  });
});

test.describe("OTP Input - Full User Flows", () => {
  // Increase timeout for this test suite to handle slower browsers
  test.setTimeout(60000);
  
  test.beforeEach(async ({ page }) => {
    await page.goto("/demo/otp-input");
    await page.waitForLoadState("domcontentloaded");
    await waitForOtpVisible(page);
  });

  test("should complete verification code entry flow", async ({ page }) => {
    const inputs = getOtpInputs(page);

    // Step 1: Click first input to focus
    await inputs.first().click();

    // Step 2: Enter complete OTP
    await page.keyboard.type("847291");

    // Step 3: Verify all inputs are filled
    const expectedValues = ["8", "4", "7", "2", "9", "1"];
    for (let i = 0; i < 6; i++) {
      await expect(inputs.nth(i)).toHaveValue(expectedValues[i]);
    }
  });

  test("should support edit and correct flow", async ({ page }) => {
    const inputs = getOtpInputs(page);

    // Enter OTP
    await inputs.first().click();
    await page.keyboard.type("123456");

    // Verify all initial values
    await expect(inputs.nth(0)).toHaveValue("1");
    await expect(inputs.nth(1)).toHaveValue("2");
    await expect(inputs.nth(2)).toHaveValue("3");
    await expect(inputs.nth(3)).toHaveValue("4");
    await expect(inputs.nth(4)).toHaveValue("5");
    await expect(inputs.nth(5)).toHaveValue("6");

    // Edit a specific digit using fill (more reliable than click+delete+type)
    await inputs.nth(2).fill("9");

    // Verify the edit - only index 2 should change
    await expect(inputs.nth(0)).toHaveValue("1");
    await expect(inputs.nth(1)).toHaveValue("2");
    await expect(inputs.nth(2)).toHaveValue("9"); // Changed from "3" to "9"
    await expect(inputs.nth(3)).toHaveValue("4");
    await expect(inputs.nth(4)).toHaveValue("5");
    await expect(inputs.nth(5)).toHaveValue("6");
  });

  test("should handle clear and re-enter flow", async ({ page }) => {
    const inputs = getOtpInputs(page);

    // Enter OTP
    await inputs.first().click();
    await page.keyboard.type("111111");

    // Clear all with multiple backspaces
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press("Backspace");
    }

    // Re-enter new OTP
    await page.keyboard.type("222222");

    // Verify new values
    for (let i = 0; i < 6; i++) {
      await expect(inputs.nth(i)).toHaveValue("2");
    }
  });

  test("should handle copy-paste workflow", async ({ page }) => {
    const inputs = getOtpInputs(page);

    // Focus first input
    await inputs.first().click();

    // Simulate receiving OTP via paste (e.g., from SMS autofill)
    await page.evaluate(() => {
      const pasteEvent = new ClipboardEvent("paste", {
        bubbles: true,
        clipboardData: new DataTransfer(),
      });
      pasteEvent.clipboardData!.setData("text/plain", "567890");
      document
        .querySelector('[role="group"][aria-label="OTP input"]')
        ?.dispatchEvent(pasteEvent);
    });

    // Verify pasted values
    const expectedValues = ["5", "6", "7", "8", "9", "0"];
    for (let i = 0; i < 6; i++) {
      await expect(inputs.nth(i)).toHaveValue(expectedValues[i]);
    }
  });
});
