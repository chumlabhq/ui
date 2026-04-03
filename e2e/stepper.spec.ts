import { test, expect } from "@playwright/test";
import { injectAxe } from "axe-playwright";

async function waitForStepperVisible(page: import("@playwright/test").Page) {
  const nav = page.getByRole("navigation", { name: "Progress" }).first();
  await nav.waitFor({ state: "attached", timeout: 10000 });
  await nav.scrollIntoViewIfNeeded();
}

test.describe("Stepper Component", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/demo/stepper");
    await page.waitForLoadState("domcontentloaded");
    await waitForStepperVisible(page);
  });

  test.describe("Basic Functionality", () => {
    test("renders stepper navigation landmarks on the page", async ({ page }) => {
      const navs = page.getByRole("navigation");
      const count = await navs.count();
      expect(count).toBeGreaterThan(0);
    });

    test("displays step labels", async ({ page }) => {
      const basicSection = page.locator("section").filter({ hasText: "Basic Stepper" }).first();
      await expect(basicSection.getByText("Step 1")).toBeVisible();
      await expect(basicSection.getByText("Step 4")).toBeVisible();
    });

    test("clicking a completed step changes the active step", async ({ page }) => {
      const basicSection = page.locator("section").filter({ hasText: "Basic Stepper" }).first();
      const step1Button = basicSection.getByRole("button").filter({ hasText: "Step 1" });
      await step1Button.click();
      await expect(step1Button).toHaveAttribute("aria-current", "step");
    });

    test("Next and Previous buttons navigate between steps", async ({ page }) => {
      const basicSection = page.locator("section").filter({ hasText: "Basic Stepper" }).first();
      const nextButton = basicSection.getByRole("button", { name: "Next" });
      const prevButton = basicSection.getByRole("button", { name: "Previous" });

      await nextButton.click();
      const step3Buttons = basicSection.getByRole("button").filter({ hasText: "Step 3" });
      await expect(step3Buttons.first()).toHaveAttribute("aria-current", "step");

      await prevButton.click();
      const step2Buttons = basicSection.getByRole("button").filter({ hasText: "Step 2" });
      await expect(step2Buttons.first()).toHaveAttribute("aria-current", "step");
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
    test("stepper has no critical accessibility violations", async ({ page }) => {
      await injectAxe(page);
      const basicSection = page.locator("section").filter({ hasText: "Basic Stepper" }).first();
      await basicSection.scrollIntoViewIfNeeded();

      const results = await page.evaluate(async () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const axeResults = await (window as any).axe.run(
          "[role='navigation'][aria-label='Progress']",
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
        (v: { impact: string }) => v.impact === "critical" || v.impact === "serious",
      );

      expect(criticalViolations).toHaveLength(0);
    });

    test("navigation landmark has aria-label", async ({ page }) => {
      const nav = page.getByRole("navigation", { name: "Progress" }).first();
      await expect(nav).toHaveAttribute("aria-label", "Progress");
    });

    test("active step has aria-current='step'", async ({ page }) => {
      const basicSection = page.locator("section").filter({ hasText: "Basic Stepper" }).first();
      const activeButton = basicSection.locator("[aria-current='step']");
      await expect(activeButton).toBeVisible();
    });

    test("steps use semantic list markup", async ({ page }) => {
      const basicSection = page.locator("section").filter({ hasText: "Basic Stepper" }).first();
      const list = basicSection.locator("ol");
      await expect(list).toBeVisible();
      const items = list.locator("li");
      expect(await items.count()).toBe(4);
    });
  });
});

test.describe("Stepper - Cross Browser", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/demo/stepper");
    await page.waitForLoadState("domcontentloaded");
  });

  test("click navigation works consistently", async ({ page }) => {
    const basicSection = page.locator("section").filter({ hasText: "Basic Stepper" }).first();
    const step1 = basicSection.getByRole("button").filter({ hasText: "Step 1" });
    await step1.click();
    await expect(step1).toHaveAttribute("aria-current", "step");
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

test.describe("Stepper - Mobile Touch", () => {
  test.use({
    viewport: { width: 375, height: 667 },
    hasTouch: true,
  });

  test.beforeEach(async ({ page }) => {
    await page.goto("/demo/stepper");
    await page.waitForLoadState("domcontentloaded");
  });

  test("tap activates a step on mobile", async ({ page, browserName }) => {
    const basicSection = page.locator("section").filter({ hasText: "Basic Stepper" }).first();
    const step1 = basicSection.getByRole("button").filter({ hasText: "Step 1" });

    if (browserName === "firefox") {
      await step1.click();
    } else {
      await step1.tap();
    }
    await expect(step1).toHaveAttribute("aria-current", "step");
  });

  test("stepper steps are visible at mobile viewport", async ({ page }) => {
    const basicSection = page.locator("section").filter({ hasText: "Basic Stepper" }).first();
    const step1 = basicSection.getByRole("button").filter({ hasText: "Step 1" });
    await expect(step1).toBeVisible();

    const box = await step1.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThanOrEqual(20);
    expect(box!.height).toBeGreaterThanOrEqual(20);
  });
});

test.describe("Stepper - Full User Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/demo/stepper");
    await page.waitForLoadState("domcontentloaded");
  });

  test("user can navigate through all steps using buttons", async ({ page }) => {
    const basicSection = page.locator("section").filter({ hasText: "Basic Stepper" }).first();
    const nextButton = basicSection.getByRole("button", { name: "Next" });

    await nextButton.click();
    const step3 = basicSection.locator("[aria-current='step']");
    await expect(step3).toContainText("Step 3");

    await nextButton.click();
    await expect(step3).toContainText("Step 4");
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
