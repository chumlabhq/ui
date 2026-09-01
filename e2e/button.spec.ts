import { test, expect } from "@playwright/test";
import { injectAxe } from "axe-playwright";
import { watchClicks } from "./_helpers";

// Helper to wait for button visibility with scroll support
async function waitForButtonVisible(page: import("@playwright/test").Page) {
  const button = page.locator("button").first();
  // Wait for element to be attached to DOM first
  await button.waitFor({ state: "attached", timeout: 10000 });
  // Then scroll into view and wait for visibility
  await button.scrollIntoViewIfNeeded();
  await button.waitFor({ state: "visible", timeout: 10000 });
}

test.describe("Button Component - Cross-Browser Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/button");
    await page.waitForLoadState("networkidle");
    await waitForButtonVisible(page);
  });

  test.describe("Basic Functionality", () => {
    test("should render button elements on the page", async ({ page }) => {
      const buttons = page.locator("button");
      await expect(buttons.first()).toBeVisible();

      const count = await buttons.count();
      expect(count).toBeGreaterThan(0);
    });

    test("should handle click interactions", async ({ page }) => {
      const button = page.locator("button").first();
      await expect(button).toBeVisible();

      // Click should not throw
      await button.click();
    });

    test("should render anchor buttons when configured", async ({ page }) => {
      const linkButtons = page.locator("a[aria-disabled], a[data-loading]");

      // The guard used to make this pass when the element was absent, which is
      // the failure the test exists to catch. Assert presence, then behaviour.
      await expect(linkButtons.first()).toBeVisible();
      const link = linkButtons.first();
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute("href");
    });
  });

test.describe("Keyboard Navigation", () => {
    test("should be focusable via Tab key", async ({ page }) => {
      await page.keyboard.press("Tab");

      // Some button should have focus
      const focusedElement = page.locator(":focus");
      await expect(focusedElement).toBeVisible();
    });

    for (const key of ["Enter", "Space"] as const) {
      test(`should activate button on ${key} key`, async ({ page }) => {
        const button = page.locator("button").first();
        await expect(button).toBeVisible();
        const clicks = await watchClicks(page);
        await button.focus();
        await page.keyboard.press(key);
        await expect.poll(clicks).toBeGreaterThan(0);
      });

      test(`should activate span button on ${key} key`, async ({ page }) => {
        const spanButton = page.locator('span[role="button"]').first();
        // Was guarded by `if (count > 0)`, which passed when the demo rendered
        // no span button — the case the test exists to cover.
        await spanButton.scrollIntoViewIfNeeded();
        await expect(spanButton).toBeVisible();

        // A span calls its onClick directly from onKeyDown; it dispatches no DOM
        // click, so the document-level counter used for real buttons sees
        // nothing here. The demo counts activations instead.
        const readout = page.locator("[data-span-activations]");
        await expect(readout).toHaveAttribute("data-span-activations", "0");
        await spanButton.focus();
        await page.keyboard.press(key);
        await expect(readout).toHaveAttribute("data-span-activations", "1");
      });
    }
  });

  test.describe("Loading State", () => {
    test("should display loading indicator when loading", async ({ page }) => {
      const loadingButton = page.locator('[data-loading="true"]').first();

      // The guard used to make this pass when the element was absent, which is
      // the failure the test exists to catch. Assert presence, then behaviour.
      await expect(loadingButton.first()).toBeVisible();
      await loadingButton.scrollIntoViewIfNeeded();
      await expect(loadingButton).toBeVisible();
      await expect(loadingButton).toHaveAttribute("aria-busy", "true");
    });

    test("should not respond to clicks when loading", async ({ page }) => {
      const loadingButton = page.locator('button[data-loading="true"]').first();

      // The guard used to make this pass when the element was absent, which is
      // the failure the test exists to catch. Assert presence, then behaviour.
      await expect(loadingButton.first()).toBeVisible();
      // Button should be disabled
      await expect(loadingButton).toBeDisabled();
    });
  });

  test.describe("Disabled State", () => {
    test("should display disabled buttons correctly", async ({ page }) => {
      const disabledButton = page.locator("button:disabled").first();

      // The guard used to make this pass when the element was absent, which is
      // the failure the test exists to catch. Assert presence, then behaviour.
      await expect(disabledButton.first()).toBeVisible();
      await expect(disabledButton).toBeVisible();
      await expect(disabledButton).toHaveAttribute("aria-disabled", "true");
    });

    test("should not respond to clicks when disabled", async ({ page }) => {
      const disabledButton = page.locator("button:disabled").first();

      // The guard used to make this pass when the element was absent, which is
      // the failure the test exists to catch. Assert presence, then behaviour.
      await expect(disabledButton.first()).toBeVisible();
      // Click should not throw, but button remains disabled
      await disabledButton.click({ force: true });
      await expect(disabledButton).toBeDisabled();
    });

    test("should prevent navigation for disabled anchor buttons", async ({
      page,
    }) => {
      const disabledLink = page.locator('a[aria-disabled="true"]').first();

      // The guard used to make this pass when the element was absent, which is
      // the failure the test exists to catch. Assert presence, then behaviour.
      await expect(disabledLink.first()).toBeVisible();
      const urlBefore = page.url();

      page.on("dialog", (dialog) => dialog.dismiss());

      const [popup] = await Promise.all([
        page.waitForEvent("popup", { timeout: 2000 }).catch(() => null),
        disabledLink.click({ force: true }),
      ]);

      expect(popup).toBeNull();
      expect(page.url()).toBe(urlBefore);
    });
  });

  test.describe("Button Group", () => {
    test("should render button groups with role='group'", async ({ page }) => {
      const groups = page.locator('[role="group"]');

      // The guard used to make this pass when the element was absent, which is
      // the failure the test exists to catch. Assert presence, then behaviour.
      await expect(groups.first()).toBeVisible();
      const group = groups.first();
      await expect(group).toBeVisible();

      // Group should contain buttons
      const buttonsInGroup = group.locator("button");
      expect(await buttonsInGroup.count()).toBeGreaterThan(0);
    });

    test("should support aria-label on button groups", async ({ page }) => {
      const labeledGroup = page.locator('[role="group"][aria-label]').first();

      // The guard used to make this pass when the element was absent, which is
      // the failure the test exists to catch. Assert presence, then behaviour.
      await expect(labeledGroup.first()).toBeVisible();
      await expect(labeledGroup).toHaveAttribute("aria-label");
    });
  });

  test.describe("Tooltip Integration", () => {
    test("should show tooltip on hover", async ({ page, browserName }) => {
      // Find buttons that might have tooltips (usually have title or trigger tooltips)
      const button = page.locator("button").first();

      await button.hover();

      // Wait for tooltip to appear - Firefox needs longer wait
      const waitTime = browserName === "firefox" ? 1000 : 500;
      await page.waitForTimeout(waitTime);

      const tooltip = page.locator('[role="tooltip"]');

      // The guard used to make this pass when the element was absent, which is
      // the failure the test exists to catch. Assert presence, then behaviour.
      await expect(tooltip.first()).toBeVisible();
      await expect(tooltip).toBeVisible({ timeout: 3000 });
      // If no tooltip found, that's okay - not all buttons have tooltips
    });
  });

  test.describe("Icon Animations", () => {
    test("should apply animation classes on hover", async ({
      page,
      browserName,
    }) => {
      // Find buttons with icons that might animate
      const buttonWithIcon = page
        .locator("button:has(.transition-transform)")
        .first();

      // The guard used to make this pass when the element was absent, which is
      // the failure the test exists to catch. Assert presence, then behaviour.
      await expect(buttonWithIcon.first()).toBeVisible();
      await buttonWithIcon.waitFor({ state: "visible", timeout: 5000 });

      // Hover to trigger animation - use dispatchEvent for Firefox reliability
      if (browserName === "firefox") {
        await buttonWithIcon.dispatchEvent("mouseenter");
        await page.waitForTimeout(100); // Wait for Firefox to process
      } else {
        await buttonWithIcon.hover();
      }

      // Animation classes should be present
      const iconContainer = buttonWithIcon.locator(".transition-transform");
      await expect(iconContainer).toBeVisible();
    });
  });
});

test.describe("Button Accessibility Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/button");
    await page.waitForLoadState("networkidle");
    await waitForButtonVisible(page);
    await injectAxe(page);
  });

  test("should have no critical accessibility violations", async ({ page }) => {
    const results = await page.evaluate(async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const axeResults = await (window as any).axe.run(
        "button, [role=button]",
        {
          rules: {
            "color-contrast": { enabled: false },
            region: { enabled: false },
            // Disable button-name rule since some dynamically loaded content may not be ready
            "button-name": { enabled: false },
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

  test("should have proper button roles", async ({ page }) => {
    const buttons = page.locator("button");
    const spanButtons = page.locator('span[role="button"]');

    // All buttons should be accessible
    // The guard used to make this pass when the element was absent, which is
    // the failure the test exists to catch. Assert presence, then behaviour.
    await expect(buttons.first()).toBeVisible();
    const button = buttons.first();
    await expect(button).toBeVisible();

    // Span buttons should have proper role
    // The guard used to make this pass when the element was absent, which is
    // the failure the test exists to catch. Assert presence, then behaviour.
    await expect(spanButtons.first()).toBeVisible();
    const spanButton = spanButtons.first();
    await expect(spanButton).toHaveAttribute("role", "button");
    await expect(spanButton).toHaveAttribute("tabindex");
  });

  test("should have aria-busy on loading buttons", async ({ page }) => {
    const loadingButtons = page.locator('[data-loading="true"]');

    // The guard used to make this pass when the element was absent, which is
    // the failure the test exists to catch. Assert presence, then behaviour.
    await expect(loadingButtons.first()).toBeVisible();
    await expect(loadingButtons.first()).toHaveAttribute("aria-busy", "true");
  });

  test("should have aria-disabled on disabled buttons", async ({ page }) => {
    const disabledButtons = page.locator('[data-disabled="true"]');

    // The guard used to make this pass when the element was absent, which is
    // the failure the test exists to catch. Assert presence, then behaviour.
    await expect(disabledButtons.first()).toBeVisible();
    const button = disabledButtons.first();
    await button.scrollIntoViewIfNeeded();
    await expect(button).toHaveAttribute("aria-disabled", "true");
  });

  test("button groups should have role='group'", async ({ page }) => {
    const groupHeading = page.getByRole("heading", { name: "Button Group" }).first();
    await groupHeading.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    const groups = page.locator('[role="group"]');
    await expect(groups.first()).toBeAttached({ timeout: 5000 });
    await expect(groups.first()).toHaveAttribute("role", "group");
  });
});

test.describe("Button Responsive Tests", () => {
  test("should render correctly on mobile viewport", async ({
    page,
  }, testInfo) => {
    const isMobileProject = testInfo.project.name.includes("Mobile");

    // For desktop browsers, set viewport before navigation
    if (!isMobileProject) {
      await page.setViewportSize({ width: 375, height: 667 });
    }

    await page.goto("/button");
    await page.waitForLoadState("domcontentloaded");
    await waitForButtonVisible(page);

    // Verify buttons exist and page rendered correctly
    const buttons = page.locator("button");
    const count = await buttons.count();
    expect(count).toBeGreaterThan(0);

    // For mobile projects, also verify visibility
    if (isMobileProject) {
      await expect(buttons.first()).toBeVisible();
    }
  });

  test("should handle touch interactions on mobile", async ({
    page,
  }, testInfo) => {
    const isMobileProject = testInfo.project.name.includes("Mobile");

    if (!isMobileProject) {
      await page.setViewportSize({ width: 375, height: 667 });
    }

    await page.goto("/button");
    await page.waitForLoadState("domcontentloaded");
    await waitForButtonVisible(page);

    const button = page.locator("button").first();

    // For mobile projects, test actual tap/click behavior
    if (isMobileProject) {
      await button.click();
    } else {
      // For desktop browsers with viewport emulation, just verify button exists
      await expect(button).toBeAttached();
    }
  });

  test("full-width buttons should span container width", async ({ page }) => {
    await page.goto("/button");
    await page.waitForLoadState("networkidle");
    await waitForButtonVisible(page);

    const fullWidthButton = page.locator('[data-full-width="true"]').first();

    // The guard used to make this pass when the element was absent, which is
    // the failure the test exists to catch. Assert presence, then behaviour.
    await expect(fullWidthButton.first()).toBeVisible();
    await fullWidthButton.scrollIntoViewIfNeeded();
    await expect(fullWidthButton).toBeVisible();

    // Should have w-full class
    const hasFullWidth = await fullWidthButton.evaluate((el) => {
      return el.classList.contains("w-full");
    });

    expect(hasFullWidth).toBe(true);
  });
});

test.describe("Button Focus Management", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/button");
    await page.waitForLoadState("networkidle");
    await waitForButtonVisible(page);
  });

  test("should maintain visible focus ring", async ({ page }) => {
    const button = page.locator("button").first();
    await button.focus();

    // Button should be focused
    await expect(button).toBeFocused();
  });

  test("disabled buttons should not receive focus via Tab", async ({
    page,
  }) => {
    // Focus first element and Tab through
    await page.keyboard.press("Tab");

    // Get currently focused element
    const focused = page.locator(":focus");

    // If focused element exists, it should not be disabled
    // The guard used to make this pass when the element was absent, which is
    // the failure the test exists to catch. Assert presence, then behaviour.
    await expect(focused.first()).toBeVisible();
    const isDisabled = await focused.evaluate((el) => {
      return (
        (el as HTMLButtonElement).disabled ||
        el.getAttribute("aria-disabled") === "true"
      );
    });

    // Focused element should not be a disabled button
    // (disabled span buttons with tabindex=-1 should be skipped)
    expect(isDisabled).toBe(false);
  });

  test("span buttons should be focusable when not disabled", async ({
    page,
  }) => {
    const spanButton = page
      .locator('span[role="button"]:not([aria-disabled="true"])')
      .first();

    // The guard used to make this pass when the element was absent, which is
    // the failure the test exists to catch. Assert presence, then behaviour.
    await expect(spanButton.first()).toBeVisible();
    await spanButton.focus();
    await expect(spanButton).toBeFocused();
  });

  test("span buttons should not be focusable when disabled", async ({
    page,
  }) => {
    const disabledSpanButton = page
      .locator('span[role="button"][aria-disabled="true"]')
      .first();

    // The guard used to make this pass when the element was absent, which is
    // the failure the test exists to catch. Assert presence, then behaviour.
    await expect(disabledSpanButton.first()).toBeVisible();
    await expect(disabledSpanButton).toHaveAttribute("tabindex", "-1");
  });
});

test.describe("Button Performance Tests", () => {
  test("should load page within acceptable time", async ({
    page,
    browserName,
  }) => {
    const startTime = Date.now();

    await page.goto("/button");
    await page.waitForLoadState("networkidle");

    const button = page.locator("button").first();
    await button.waitFor({ state: "attached", timeout: 10000 });
    await button.scrollIntoViewIfNeeded();
    await button.waitFor({ state: "visible", timeout: 10000 });

    const loadTime = Date.now() - startTime;

    // Mobile browsers and Firefox have higher overhead
    const threshold = browserName === "firefox" ? 15000 : 10000;
    expect(loadTime).toBeLessThan(threshold);
  });

  test("should handle multiple button interactions without lag", async ({
    page,
  }) => {
    await page.goto("/button");
    await page.waitForLoadState("networkidle");
    await waitForButtonVisible(page);

    const buttons = page.locator("button:not(:disabled)");
    const count = Math.min(await buttons.count(), 5);

    // Click multiple buttons in sequence
    for (let i = 0; i < count; i++) {
      const button = buttons.nth(i);
      await button.waitFor({ state: "attached", timeout: 5000 });
      await button.scrollIntoViewIfNeeded();
      await button.click();
    }

    // Page should still be responsive
    const firstButton = buttons.first();
    await firstButton.scrollIntoViewIfNeeded();
    await expect(firstButton).toBeVisible();
  });
});
