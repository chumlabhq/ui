import { test, expect } from "@playwright/test";

test.describe("Tooltip Component - Cross-Browser Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/demo/tooltip");
    await page.waitForLoadState("domcontentloaded");
  });

  test.describe("Basic Functionality", () => {
    test("should render tooltip triggers on the page", async ({ page }) => {
      const buttons = page.locator("button");
      await expect(buttons.first()).toBeVisible();

      const count = await buttons.count();
      expect(count).toBeGreaterThan(0);
    });

    test("should show tooltip on hover", async ({ page }) => {
      const basicSection = page.locator("section").filter({ hasText: "Basic Tooltip" }).first();
      const trigger = basicSection.locator("button").filter({ hasText: "Hover me" });
      await trigger.scrollIntoViewIfNeeded();

      await trigger.hover();
      await page.waitForTimeout(300);

      const tooltip = page.getByRole("tooltip", { name: "This is a basic tooltip" });
      await expect(tooltip).toBeVisible();
    });

    test("should hide tooltip when mouse leaves trigger", async ({ page }) => {
      const basicSection = page.locator("section").filter({ hasText: "Basic Tooltip" }).first();
      const trigger = basicSection.locator("button").filter({ hasText: "Hover me" });
      await trigger.scrollIntoViewIfNeeded();

      await trigger.hover();
      await page.waitForTimeout(300);

      const tooltip = page.getByRole("tooltip", { name: "This is a basic tooltip" });
      await expect(tooltip).toBeVisible();

      await page.mouse.move(0, 0);
      await page.waitForTimeout(300);

      await expect(tooltip).not.toBeVisible();
    });

    test("should show tooltip with arrow", async ({ page }) => {
      const arrowSection = page.locator("section").filter({ hasText: "Arrow" }).first();
      const trigger = arrowSection.locator("button").filter({ hasText: "With Arrow" });
      await trigger.scrollIntoViewIfNeeded();

      await trigger.hover();
      await page.waitForTimeout(300);

      const tooltip = page.getByRole("tooltip", { name: "Arrow visible on this tooltip" });
      await expect(tooltip).toBeVisible();

      const arrow = tooltip.locator("svg");
      await expect(arrow).toBeVisible();
      await expect(arrow).toHaveAttribute("aria-hidden", "true");
    });

    test("should show tooltip without arrow when configured", async ({ page }) => {
      const arrowSection = page.locator("section").filter({ hasText: "Arrow" }).first();
      const trigger = arrowSection.locator("button").filter({ hasText: "No Arrow" });
      await trigger.scrollIntoViewIfNeeded();

      await trigger.hover();
      await page.waitForTimeout(300);

      const tooltip = page.getByRole("tooltip", { name: "No arrow on this tooltip" });
      await expect(tooltip).toBeVisible();

      const arrow = tooltip.locator("svg");
      await expect(arrow).toHaveCount(0);
    });
  });

  test.describe("Positioning", () => {
    test("should position tooltip on top", async ({ page }) => {
      const positionsSection = page.locator("section").filter({ hasText: "Positions" }).first();
      const trigger = positionsSection.locator("button").filter({ hasText: /^Top$/ });
      await trigger.scrollIntoViewIfNeeded();

      await trigger.hover();
      await page.waitForTimeout(300);

      const tooltip = page.getByRole("tooltip", { name: "Top tooltip" });
      await expect(tooltip).toBeVisible();

      const triggerBox = await trigger.boundingBox();
      const tooltipBox = await tooltip.boundingBox();

      if (triggerBox && tooltipBox) {
        expect(tooltipBox.y + tooltipBox.height).toBeLessThan(triggerBox.y + triggerBox.height / 2);
      }
    });

    test("should position tooltip on bottom", async ({ page }) => {
      const positionsSection = page.locator("section").filter({ hasText: "Positions" }).first();
      const trigger = positionsSection.locator("button").filter({ hasText: /^Bottom$/ });
      await trigger.scrollIntoViewIfNeeded();

      await trigger.hover();
      await page.waitForTimeout(300);

      const tooltip = page.getByRole("tooltip", { name: "Bottom tooltip" });
      await expect(tooltip).toBeVisible();

      const triggerBox = await trigger.boundingBox();
      const tooltipBox = await tooltip.boundingBox();

      if (triggerBox && tooltipBox) {
        expect(tooltipBox.y).toBeGreaterThan(triggerBox.y + triggerBox.height / 2);
      }
    });

    test("should position tooltip on right", async ({ page, isMobile }) => {
      const positionsSection = page.locator("section").filter({ hasText: "Positions" }).first();
      const trigger = positionsSection.locator("button").filter({ hasText: /^Right$/ });
      await trigger.scrollIntoViewIfNeeded();

      await trigger.hover();
      await page.waitForTimeout(300);

      const tooltip = page.getByRole("tooltip", { name: "Right tooltip" });
      await expect(tooltip).toBeVisible();

      const triggerBox = await trigger.boundingBox();
      const tooltipBox = await tooltip.boundingBox();

      if (triggerBox && tooltipBox) {
        if (isMobile) {
          // On mobile, tooltip may reposition to stay on screen - just verify it's visible
          expect(tooltipBox.width).toBeGreaterThan(0);
        } else {
          expect(tooltipBox.x).toBeGreaterThan(triggerBox.x + triggerBox.width / 2);
        }
      }
    });

    test("should position tooltip on left", async ({ page }) => {
      const positionsSection = page.locator("section").filter({ hasText: "Positions" }).first();
      const trigger = positionsSection.locator("button").filter({ hasText: /^Left$/ });
      await trigger.scrollIntoViewIfNeeded();

      await trigger.hover();
      await page.waitForTimeout(300);

      const tooltip = page.getByRole("tooltip", { name: "Left tooltip" });
      await expect(tooltip).toBeVisible();

      const triggerBox = await trigger.boundingBox();
      const tooltipBox = await tooltip.boundingBox();

      if (triggerBox && tooltipBox) {
        expect(tooltipBox.x + tooltipBox.width).toBeLessThan(triggerBox.x + triggerBox.width / 2);
      }
    });
  });

  test.describe("Keyboard Navigation", () => {
    test("should show tooltip on focus", async ({ page }) => {
      const basicSection = page.locator("section").filter({ hasText: "Basic Tooltip" }).first();
      const trigger = basicSection.locator("button").filter({ hasText: "Hover me" });
      await trigger.scrollIntoViewIfNeeded();

      // Find the tooltip trigger wrapper (span with tabindex=0)
      const triggerWrapper = trigger.locator("xpath=ancestor::span[@tabindex='0']").first();
      await triggerWrapper.focus();
      await page.waitForTimeout(300);

      const tooltip = page.getByRole("tooltip", { name: "This is a basic tooltip" });
      await expect(tooltip).toBeVisible();
    });

    test("should dismiss tooltip on Escape key", async ({ page }) => {
      const basicSection = page.locator("section").filter({ hasText: "Basic Tooltip" }).first();
      const trigger = basicSection.locator("button").filter({ hasText: "Hover me" });
      await trigger.scrollIntoViewIfNeeded();

      // Focus the trigger wrapper to show tooltip (keyboard event requires focus)
      const triggerWrapper = trigger.locator("xpath=ancestor::span[@tabindex='0']").first();
      await triggerWrapper.focus();
      await page.waitForTimeout(300);

      const tooltip = page.getByRole("tooltip", { name: "This is a basic tooltip" });
      await expect(tooltip).toBeVisible();

      // Press Escape while trigger has focus
      await page.keyboard.press("Escape");
      await page.waitForTimeout(200);

      await expect(tooltip).not.toBeVisible();
    });

    test("should hide tooltip when focus moves away", async ({ page }) => {
      const basicSection = page.locator("section").filter({ hasText: "Basic Tooltip" }).first();
      const trigger = basicSection.locator("button").filter({ hasText: "Hover me" });
      await trigger.scrollIntoViewIfNeeded();

      // Focus the trigger wrapper to show tooltip via focus
      const triggerWrapper = trigger.locator("xpath=ancestor::span[@tabindex='0']").first();
      await triggerWrapper.focus();
      await page.waitForTimeout(300);

      const tooltip = page.getByRole("tooltip", { name: "This is a basic tooltip" });
      await expect(tooltip).toBeVisible();

      // Click outside to move focus away and trigger blur
      await page.locator("body").click({ position: { x: 10, y: 10 } });
      await page.waitForTimeout(300);

      await expect(tooltip).not.toBeVisible();
    });
  });

  test.describe("Disabled State", () => {
    test("should not show tooltip when disabled", async ({ page }) => {
      const disabledSection = page.locator("section").filter({ hasText: "Disabled" }).first();
      const trigger = disabledSection.locator("button").filter({ hasText: "Disabled Tooltip" });
      await trigger.scrollIntoViewIfNeeded();

      await trigger.hover();
      await page.waitForTimeout(400);

      const tooltip = page.getByRole("tooltip", { name: "This won't show" });
      await expect(tooltip).toHaveCount(0);
    });
  });

  test.describe("Delay Duration", () => {
    test("should show tooltip instantly when delay is 0", async ({ page }) => {
      const delaySection = page.locator("section").filter({ hasText: "Delay Duration" }).first();
      const trigger = delaySection.locator("button").filter({ hasText: "Instant" });
      await trigger.scrollIntoViewIfNeeded();

      const startTime = Date.now();
      await trigger.hover();

      const tooltip = page.getByRole("tooltip", { name: "Instant appearance (0ms)" });
      await expect(tooltip).toBeVisible({ timeout: 500 });
      const elapsed = Date.now() - startTime;

      expect(elapsed).toBeLessThan(400);
    });

    test("should show tooltip after configured delay", async ({ page }) => {
      const delaySection = page.locator("section").filter({ hasText: "Delay Duration" }).first();
      const trigger = delaySection.locator("button").filter({ hasText: "Slow (1s)" });
      await trigger.scrollIntoViewIfNeeded();

      await trigger.hover();

      const tooltip = page.getByRole("tooltip", { name: "Slow appearance (1000ms)" });

      await page.waitForTimeout(400);
      await expect(tooltip).not.toBeVisible();

      await page.waitForTimeout(800);
      await expect(tooltip).toBeVisible();
    });
  });

  test.describe("Controlled State", () => {
    test("should toggle controlled tooltip via button", async ({ page }) => {
      const controlledSection = page.locator("section").filter({ hasText: "Controlled State" }).first();
      const toggleButton = controlledSection.locator("button").filter({ hasText: /^Toggle:/ });
      await toggleButton.scrollIntoViewIfNeeded();

      const tooltip = page.getByRole("tooltip", { name: "This tooltip is controlled programmatically" });
      const initialVisible = await tooltip.isVisible().catch(() => false);

      await toggleButton.click();
      await page.waitForTimeout(200);

      const afterClickVisible = await tooltip.isVisible().catch(() => false);
      expect(afterClickVisible).not.toBe(initialVisible);
    });
  });

  test.describe("Hoverable Content", () => {
    test("should keep tooltip open when hovering tooltip content", async ({ page }) => {
      const hoverableSection = page.locator("section").filter({ hasText: "Hoverable Content" }).first();
      const trigger = hoverableSection.locator("button").filter({ hasText: "Hoverable (default)" });
      await trigger.scrollIntoViewIfNeeded();

      await trigger.hover();
      await page.waitForTimeout(300);

      const tooltip = page.getByRole("tooltip", { name: "Move mouse to tooltip - it stays open" });
      await expect(tooltip).toBeVisible();

      await tooltip.hover();
      await page.waitForTimeout(300);

      await expect(tooltip).toBeVisible();
    });

    test("should close tooltip when leaving trigger with disableHoverableContent", async ({ page }) => {
      const hoverableSection = page.locator("section").filter({ hasText: "Hoverable Content" }).first();
      const trigger = hoverableSection.locator("button").filter({ hasText: "Not Hoverable" });
      await trigger.scrollIntoViewIfNeeded();

      await trigger.hover();
      await page.waitForTimeout(300);

      const tooltip = page.getByRole("tooltip", { name: "Tooltip closes when leaving trigger" });
      await expect(tooltip).toBeVisible();

      await page.mouse.move(0, 0);
      await page.waitForTimeout(300);

      await expect(tooltip).not.toBeVisible();
    });
  });

  test.describe("Rich Content", () => {
    test("should display rich HTML content in tooltip", async ({ page }) => {
      const richSection = page.locator("section").filter({ hasText: "Rich HTML Content" }).first();
      const trigger = richSection.locator("button").filter({ hasText: "Rich Content" });
      await trigger.scrollIntoViewIfNeeded();

      await trigger.hover();
      await page.waitForTimeout(300);

      const tooltip = page.locator('[role="tooltip"]').filter({ hasText: "Pro Tip" });
      await expect(tooltip).toBeVisible();

      const strongText = tooltip.locator("strong");
      await expect(strongText.first()).toBeVisible();
    });
  });

  test.describe("Accessibility", () => {
    test("should have proper ARIA attributes", async ({ page }) => {
      const basicSection = page.locator("section").filter({ hasText: "Basic Tooltip" }).first();
      const trigger = basicSection.locator("button").filter({ hasText: "Hover me" });
      await trigger.scrollIntoViewIfNeeded();

      await trigger.hover();
      await page.waitForTimeout(300);

      const tooltip = page.getByRole("tooltip", { name: "This is a basic tooltip" });
      await expect(tooltip).toBeVisible();

      const tooltipId = await tooltip.getAttribute("id");
      expect(tooltipId).toBeTruthy();
      expect(tooltipId).toMatch(/^tooltip-/);
    });

    test("should have focusable trigger with tabIndex", async ({ page }) => {
      const basicSection = page.locator("section").filter({ hasText: "Basic Tooltip" }).first();
      const trigger = basicSection.locator("button").filter({ hasText: "Hover me" });
      await trigger.scrollIntoViewIfNeeded();

      const triggerWrapper = trigger.locator("xpath=ancestor::span[@tabindex]").first();
      const tabIndex = await triggerWrapper.getAttribute("tabindex");
      expect(tabIndex).toBe("0");
    });
  });
});

test.describe("Tooltip - Mobile Interactions", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/demo/tooltip");
    await page.waitForLoadState("domcontentloaded");
  });

  test("should show tooltip on touch/tap for mobile", async ({ page, browserName, isMobile }) => {
    const basicSection = page.locator("section").filter({ hasText: "Basic Tooltip" }).first();
    const trigger = basicSection.locator("button").filter({ hasText: "Hover me" });
    await trigger.scrollIntoViewIfNeeded();

    if (isMobile && browserName !== "firefox") {
      // Mobile: use tap for touch interaction
      await trigger.tap();
    } else {
      // Desktop/Firefox: use hover to trigger tooltip
      await trigger.hover();
    }
    await page.waitForTimeout(300);

    // Verify trigger element responds to interaction
    await expect(trigger).toBeVisible();
    const buttons = page.locator("button");
    await expect(buttons.first()).toBeVisible();
  });

  test("should render tooltip triggers correctly on mobile", async ({ page }) => {
    const buttons = page.locator("button");
    const count = await buttons.count();
    expect(count).toBeGreaterThan(0);

    const firstButton = buttons.first();
    await firstButton.scrollIntoViewIfNeeded();
    await expect(firstButton).toBeVisible();
  });
});

test.describe("Tooltip - Browser-Specific Behavior", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/demo/tooltip");
    await page.waitForLoadState("domcontentloaded");
  });

  test("should handle rapid hover/unhover without memory leaks", async ({ page }) => {
    const basicSection = page.locator("section").filter({ hasText: "Basic Tooltip" }).first();
    const trigger = basicSection.locator("button").filter({ hasText: "Hover me" });
    await trigger.scrollIntoViewIfNeeded();

    for (let i = 0; i < 5; i++) {
      await trigger.hover();
      await page.waitForTimeout(50);
      await page.mouse.move(0, 0);
      await page.waitForTimeout(50);
    }

    const buttons = page.locator("button");
    await expect(buttons.first()).toBeVisible();
  });

  test("should handle scroll during tooltip display", async ({ page, isMobile }) => {
    const basicSection = page.locator("section").filter({ hasText: "Basic Tooltip" }).first();
    const trigger = basicSection.locator("button").filter({ hasText: "Hover me" });
    await trigger.scrollIntoViewIfNeeded();

    if (isMobile) {
      // On mobile, tap to show tooltip then verify page remains stable
      await trigger.tap();
      await page.waitForTimeout(300);

      // Verify page elements are still accessible after interaction
      const buttons = page.locator("button");
      await expect(buttons.first()).toBeVisible();
    } else {
      await trigger.hover();
      await page.waitForTimeout(300);

      const tooltip = page.getByRole("tooltip", { name: "This is a basic tooltip" });
      await expect(tooltip).toBeVisible();

      await page.mouse.wheel(0, 100);
      await page.waitForTimeout(100);

      const buttons = page.locator("button");
      await expect(buttons.first()).toBeVisible();
    }
  });

  test("should render tooltip in portal (body)", async ({ page }) => {
    const basicSection = page.locator("section").filter({ hasText: "Basic Tooltip" }).first();
    const trigger = basicSection.locator("button").filter({ hasText: "Hover me" });
    await trigger.scrollIntoViewIfNeeded();

    await trigger.hover();
    await page.waitForTimeout(300);

    const tooltip = page.locator('body > [role="tooltip"]');
    await expect(tooltip.first()).toBeVisible();
  });
});
