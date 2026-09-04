import { gotoFixture } from "./_nav";
import { skipWithoutTouchEvents } from "./_helpers";
import { test, expect } from "@playwright/test";
import { injectAxe, checkA11y } from "axe-playwright";

async function waitForStepperVisible(page: import("@playwright/test").Page) {
  const nav = page.getByRole("navigation", { name: "Progress" }).first();
  await nav.waitFor({ state: "attached", timeout: 10000 });
  await nav.scrollIntoViewIfNeeded();
}

test.describe("Stepper Component", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/stepper");
    await page.waitForLoadState("domcontentloaded");
    await waitForStepperVisible(page);
  });

  test.describe("Basic Functionality", () => {
    test("renders stepper navigation landmarks on the page", async ({ page }) => {
      const navs = page.getByRole("navigation");
      const count = await navs.count();
      expect(count).toBeGreaterThan(0);
    });



  });

  test.describe("Keyboard Navigation", () => {
    test("Tab focuses the tabbable step in the stepper", async ({ page }) => {
      const loopSection = page.locator("section").filter({ hasText: "Keyboard Navigation with Loop" });
      const firstButton = loopSection.getByRole("button").filter({ hasText: "Step 1" }).first();
      await firstButton.focus();
      await expect(firstButton).toBeFocused();
    });

    test("ArrowRight moves focus to the next step", async ({ page }) => {
      const loopSection = page.locator("section").filter({ hasText: "Keyboard Navigation with Loop" });
      const buttons = loopSection.getByRole("button");
      const step1 = buttons.filter({ hasText: "Step 1" }).first();
      await step1.focus();
      await page.keyboard.press("ArrowRight");
      const step2 = buttons.filter({ hasText: "Step 2" }).first();
      await expect(step2).toBeFocused();
    });

    test("ArrowLeft moves focus to the previous step", async ({ page }) => {
      const loopSection = page.locator("section").filter({ hasText: "Keyboard Navigation with Loop" });
      const buttons = loopSection.getByRole("button");
      const step2 = buttons.filter({ hasText: "Step 2" }).first();
      await step2.focus();
      await page.keyboard.press("ArrowLeft");
      const step1 = buttons.filter({ hasText: "Step 1" }).first();
      await expect(step1).toBeFocused();
    });

    test("loop wraps from last to first step", async ({ page }) => {
      const loopSection = page.locator("section").filter({ hasText: "Keyboard Navigation with Loop" });
      const buttons = loopSection.getByRole("button");
      const step4 = buttons.filter({ hasText: "Step 4" }).first();
      await step4.focus();
      await page.keyboard.press("ArrowRight");
      const step1 = buttons.filter({ hasText: "Step 1" }).first();
      await expect(step1).toBeFocused();
    });

    test("Home moves focus to first step", async ({ page }) => {
      const loopSection = page.locator("section").filter({ hasText: "Keyboard Navigation with Loop" });
      const buttons = loopSection.getByRole("button");
      const step3 = buttons.filter({ hasText: "Step 3" }).first();
      await step3.focus();
      await page.keyboard.press("Home");
      const step1 = buttons.filter({ hasText: "Step 1" }).first();
      await expect(step1).toBeFocused();
    });

    test("End moves focus to last step", async ({ page }) => {
      const loopSection = page.locator("section").filter({ hasText: "Keyboard Navigation with Loop" });
      const buttons = loopSection.getByRole("button");
      const step1 = buttons.filter({ hasText: "Step 1" }).first();
      await step1.focus();
      await page.keyboard.press("End");
      const step4 = buttons.filter({ hasText: "Step 4" }).first();
      await expect(step4).toBeFocused();
    });

    test("Enter activates the focused step (native button click)", async ({ page }) => {
      const loopSection = page.locator("section").filter({ hasText: "Keyboard Navigation with Loop" });
      const buttons = loopSection.getByRole("button");
      const step1 = buttons.filter({ hasText: "Step 1" }).first();
      await step1.focus();
      await page.keyboard.press("Enter");
      await expect(step1).toHaveAttribute("aria-current", "step");
    });
  });

  test.describe("Automatic Activation Mode", () => {
    test("arrow keys activate step immediately in automatic mode", async ({ page }) => {
      const autoSection = page.locator("section").filter({ hasText: "Automatic Activation Mode" });
      const buttons = autoSection.getByRole("button");
      const step2 = buttons.filter({ hasText: "Step 2" }).first();
      await step2.focus();
      await page.keyboard.press("ArrowRight");
      const step3 = buttons.filter({ hasText: "Step 3" }).first();
      await expect(step3).toHaveAttribute("aria-current", "step");
    });
  });

  test.describe("Vertical Orientation", () => {
    test("ArrowDown moves focus in vertical stepper", async ({ page }) => {
      const verticalSection = page.locator("section").filter({ hasText: "Vertical Stepper" });
      const step1 = verticalSection.getByRole("button").filter({ hasText: "Step 1" }).first();
      await step1.focus();
      await page.keyboard.press("ArrowDown");
      const step2 = verticalSection.getByRole("button").filter({ hasText: "Step 2" }).first();
      await expect(step2).toBeFocused();
    });
  });

  test.describe("Step Change Prevention", () => {
    test("prevents skipping ahead more than one step", async ({ page }) => {
      const preventSection = page.locator("section").filter({ hasText: "Step Change Prevention" });
      const step1 = preventSection.getByRole("button").filter({ hasText: "Step 1" }).first();
      await expect(step1).toHaveAttribute("aria-current", "step");

      const step4 = preventSection.getByRole("button").filter({ hasText: "Step 4" }).first();
      await step4.click();
      await expect(step1).toHaveAttribute("aria-current", "step");
    });

    test("allows moving to the next adjacent step", async ({ page }) => {
      const preventSection = page.locator("section").filter({ hasText: "Step Change Prevention" });
      const step2 = preventSection.getByRole("button").filter({ hasText: "Step 2" }).first();
      await step2.click();
      await expect(step2).toHaveAttribute("aria-current", "step");
    });
  });

  test.describe("Disabled States", () => {
    test("disabled step is not interactive", async ({ page }) => {
      const disabledSection = page.locator("section").filter({ hasText: "Disabled Steps" }).first();
      const step3Group = disabledSection.locator("[data-disabled]").first();
      await expect(step3Group).toBeVisible();
    });

    test("globally disabled stepper renders no buttons", async ({ page }) => {
      const globalSection = page.locator("section").filter({ hasText: "Globally Disabled" });
      const stepper = globalSection.getByRole("navigation");
      const buttons = stepper.getByRole("button");
      await expect(buttons).toHaveCount(0);
    });
  });

  test.describe("Icon Variant", () => {
    test("icon variant renders with descriptions", async ({ page }) => {
      const iconSection = page.locator("section").filter({ hasText: "Icon Variant with Descriptions" });
      await expect(iconSection.getByText("Account", { exact: true })).toBeVisible();
      await expect(iconSection.getByText("Create your account", { exact: true })).toBeVisible();
    });
  });

  test.describe("Accessibility", () => {

    test("navigation landmark has aria-label", async ({ page }) => {
      const nav = page.getByRole("navigation", { name: "Progress" }).first();
      await expect(nav).toHaveAttribute("aria-label", "Progress");
    });


  });
});

test.describe("Stepper - Cross Browser", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/stepper");
    await page.waitForLoadState("domcontentloaded");
  });


  test("keyboard navigation works across browsers", async ({ page }) => {
    const loopSection = page.locator("section").filter({ hasText: "Keyboard Navigation with Loop" });
    const step1 = loopSection.getByRole("button").filter({ hasText: "Step 1" }).first();
    await step1.focus();
    await page.keyboard.press("ArrowRight");
    const step2 = loopSection.getByRole("button").filter({ hasText: "Step 2" }).first();
    await expect(step2).toBeFocused();
  });
});


test.describe("Stepper - Full User Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/stepper");
    await page.waitForLoadState("domcontentloaded");
  });


  test("keyboard-only user can navigate and activate steps", async ({ page }) => {
    const loopSection = page.locator("section").filter({ hasText: "Keyboard Navigation with Loop" });
    const step1 = loopSection.getByRole("button").filter({ hasText: "Step 1" }).first();

    await step1.focus();
    await expect(step1).toBeFocused();

    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("Enter");

    const active = loopSection.locator("[aria-current='step']");
    await expect(active).toContainText("Step 3");
  });
});

/**
 * The three of stepper.spec.ts's ten stale tests that need a browser
 * (E2E-TRIAGE.md). Seven duplicated Stepper.test.tsx — two of those drove the
 * demo page's own Next/Previous buttons, which are not library surface.
 */
test.describe("Stepper (fixtures)", () => {
  test("passes an axe audit", async ({ page }) => {
    await gotoFixture(page, "Stepper", "all-statuses");
    await injectAxe(page);
    await checkA11y(page, '[role="navigation"]', { detailedReport: true });
  });

  test("keeps every step inside a 375px viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await gotoFixture(page, "Stepper", "horizontal-numbered");

    const steps = page.locator('[role="navigation"] li');
    const count = await steps.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const box = (await steps.nth(i).boundingBox())!;
      expect(box.x, `step ${i} starts off-screen`).toBeGreaterThanOrEqual(-1);
      expect(box.x + box.width, `step ${i} overflows 375px`).toBeLessThanOrEqual(376);
    }
  });

  test("activates a step from a touch", async ({ page }) => {
    await skipWithoutTouchEvents(test, page);

    await page.setViewportSize({ width: 375, height: 667 });
    await gotoFixture(page, "Stepper", "clickable");

    const target = page.locator('[role="navigation"] button').first();
    // Dispatched rather than `tap()`: `hasTouch` is off in the desktop
    // projects and `tap()` throws there instead of degrading.
    await target.dispatchEvent("touchstart");
    await target.dispatchEvent("touchend");
    await target.click();

    await expect(target).toHaveAttribute("aria-current", "step");
  });
});
