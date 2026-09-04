import { gotoFixture } from "./_nav";
import { skipWithoutTabTraversal } from "./_helpers";
import { test, expect } from "@playwright/test";

test.describe("Tooltip Component - Cross-Browser Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/tooltip");
    await page.waitForLoadState("domcontentloaded");
  });

  test.describe("Basic Functionality", () => {
    test("should render tooltip triggers on the page", async ({ page }) => {
      // `:visible` for the same reason button.spec needs it: the first
      // element of this kind in the document is site chrome, and on a mobile
      // viewport it has no box at all.
      const buttons = page.locator("button:visible");
      await expect(buttons.first()).toBeVisible();

      const count = await buttons.count();
      expect(count).toBeGreaterThan(0);
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


    test("should position tooltip on right", async ({ page, isMobile }) => {
      const positionsSection = page.locator("section").filter({ hasText: "Positions" }).first();
      const trigger = positionsSection.locator("button").filter({ hasText: /^Right$/ });
      await trigger.scrollIntoViewIfNeeded();

      await trigger.hover();
      await page.waitForTimeout(500);

      const tooltip = page.getByRole("tooltip", { name: "Right tooltip" });
      await expect(tooltip).toBeVisible();

      await expect(async () => {
        const triggerBox = await trigger.boundingBox();
        const tooltipBox = await tooltip.boundingBox();
        expect(triggerBox).toBeTruthy();
        expect(tooltipBox).toBeTruthy();
        if (isMobile) {
          expect(tooltipBox!.width).toBeGreaterThan(0);
        } else {
          expect(tooltipBox!.x).toBeGreaterThan(triggerBox!.x + triggerBox!.width / 2);
        }
      }).toPass({ timeout: 5000 });
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
        // Left placement only when there is room for it. On a 390px viewport
        // the trigger sits at x=37 and the tooltip is 82px wide, so the left
        // side would put it at x=-45; flipping is the correct behaviour and the
        // real requirement is that it stays on screen. Asserting the side
        // unconditionally was asserting a wide viewport.
        const viewport = page.viewportSize()!;
        if (triggerBox.x >= tooltipBox.width) {
          expect(tooltipBox.x + tooltipBox.width).toBeLessThan(
            triggerBox.x + triggerBox.width / 2,
          );
        } else {
          expect(tooltipBox.x).toBeGreaterThanOrEqual(0);
          expect(tooltipBox.x + tooltipBox.width).toBeLessThanOrEqual(viewport.width);
        }
      }
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

});

test.describe("Tooltip - Mobile Interactions", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/tooltip");
    await page.waitForLoadState("domcontentloaded");
  });


  test("should render tooltip triggers correctly on mobile", async ({ page }) => {
    // See above: first-in-document is the page chrome, not a tooltip trigger.
    const buttons = page.locator("button:visible");
    const count = await buttons.count();
    expect(count).toBeGreaterThan(0);

    const firstButton = buttons.first();
    await firstButton.scrollIntoViewIfNeeded();
    await expect(firstButton).toBeVisible();
  });
});


/**
 * The three of tooltip.spec.ts's twelve stale tests that need a browser
 * (E2E-TRIAGE.md). The other nine duplicated Tooltip.test.tsx, which covers
 * hover, focus, Escape, touch, the ARIA wiring and the portal in jsdom.
 */
test.describe("Tooltip (fixtures)", () => {
  test("places the tooltip below the trigger when side=bottom", async ({ page }) => {
    await gotoFixture(page, "Tooltip", "bottom");

    const trigger = page.getByRole("button", { name: "Trigger" });
    await trigger.hover();

    const tooltip = page.getByRole("tooltip");
    await expect(tooltip).toBeVisible();

    await expect(async () => {
      const t = (await trigger.boundingBox())!;
      const tip = (await tooltip.boundingBox())!;
      expect(tip.y).toBeGreaterThan(t.y + t.height / 2);
    }).toPass({ timeout: 5000 });
  });

  test("reaches the trigger by Tab", async ({ page, browserName }) => {
    skipWithoutTabTraversal(test, browserName);

    await gotoFixture(page, "Tooltip", "closed");

    const trigger = page.getByRole("button", { name: "Trigger" });
    for (let i = 0; i < 8; i++) {
      await page.keyboard.press("Tab");
      if (await trigger.evaluate((el) => document.activeElement === el)) break;
    }

    await expect(trigger).toBeFocused();
  });

  test("keeps the tooltip anchored to the trigger through a scroll", async ({ page }) => {
    await gotoFixture(page, "Tooltip", "in-scroller");

    const trigger = page.getByRole("button", { name: "Trigger" });
    await trigger.scrollIntoViewIfNeeded();
    // Opened by focus, not hover: the scroll below moves the trigger out from
    // under the pointer, which would close a hover-opened tooltip and leave the
    // test measuring nothing.
    await trigger.focus();

    const tooltip = page.getByRole("tooltip");
    await expect(tooltip).toBeVisible();

    const offsetNow = async () => {
      const t = (await trigger.boundingBox())!;
      const tip = (await tooltip.boundingBox())!;
      return tip.y - t.y;
    };

    const before = await offsetNow();
    await page.evaluate(() => window.scrollBy(0, 200));

    // The tooltip is  and repositioned from a scroll listener,
    // so "still anchored" — not "still on screen" — is the assertion that fails
    // if that listener goes away.
    await expect(async () => {
      expect(Math.abs((await offsetNow()) - before)).toBeLessThan(4);
    }).toPass({ timeout: 5000 });
  });
});
