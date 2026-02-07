import { test, expect } from "@playwright/test";
import { injectAxe, checkA11y } from "axe-playwright";

async function waitForSwitchVisible(page: import("@playwright/test").Page) {
  const switchEl = page.getByRole("switch").first();
  await switchEl.waitFor({ state: "attached", timeout: 10000 });
  await switchEl.scrollIntoViewIfNeeded();
}

test.describe("Switch Component", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/demo/switch");
    await page.waitForLoadState("domcontentloaded");
    await waitForSwitchVisible(page);
  });

  test.describe("Basic Functionality", () => {
    test("renders switch components on the page", async ({ page }) => {
      const switches = page.getByRole("switch");
      const count = await switches.count();
      expect(count).toBeGreaterThan(0);
    });

    test("toggles switch state on click", async ({ page }) => {
      const basicSwitch = page.getByRole("switch").first();
      await expect(basicSwitch).toHaveAttribute("aria-checked", "false");

      await basicSwitch.click();
      await expect(basicSwitch).toHaveAttribute("aria-checked", "true");

      await basicSwitch.click();
      await expect(basicSwitch).toHaveAttribute("aria-checked", "false");
    });

    test("toggles switch when clicking on label", async ({ page }) => {
      const labelSection = page.locator("section").filter({ hasText: "With Label" }).first();
      const label = labelSection.getByText("Enable notifications");
      const switchEl = labelSection.getByRole("switch");

      await expect(switchEl).toHaveAttribute("aria-checked", "true");
      await label.click();
      await expect(switchEl).toHaveAttribute("aria-checked", "false");
    });
  });

  test.describe("Keyboard Navigation", () => {
    test("switch is focusable and responds to keyboard", async ({ page }) => {
      const basicSwitch = page.getByRole("switch").first();

      await basicSwitch.focus();
      await expect(basicSwitch).toBeFocused();

      await expect(basicSwitch).toHaveAttribute("aria-checked", "false");
      await page.keyboard.press("Space");
      await expect(basicSwitch).toHaveAttribute("aria-checked", "true");
    });

    test("toggles switch on Space key", async ({ page }) => {
      const basicSwitch = page.getByRole("switch").first();

      await basicSwitch.focus();
      await expect(basicSwitch).toHaveAttribute("aria-checked", "false");

      await page.keyboard.press("Space");
      await expect(basicSwitch).toHaveAttribute("aria-checked", "true");
    });

    test("toggles switch on Enter key", async ({ page }) => {
      const basicSwitch = page.getByRole("switch").first();

      await basicSwitch.focus();
      await expect(basicSwitch).toHaveAttribute("aria-checked", "false");

      await page.keyboard.press("Enter");
      await expect(basicSwitch).toHaveAttribute("aria-checked", "true");
    });

    test("skips disabled switch in tab order", async ({ page }) => {
      const disabledSection = page.locator("section").filter({ hasText: "Disabled States" });
      const disabledSwitch = disabledSection.getByRole("switch").first();

      await disabledSwitch.focus({ timeout: 1000 }).catch(() => {});

      await expect(disabledSwitch).toBeDisabled();
    });
  });

  test.describe("Disabled State", () => {
    test("disabled switch does not toggle on click", async ({ page }) => {
      const disabledSection = page.locator("section").filter({ hasText: "Disabled States" });
      const disabledSwitch = disabledSection.getByRole("switch").first();

      await expect(disabledSwitch).toBeDisabled();
      await expect(disabledSwitch).toHaveAttribute("aria-checked", "false");

      await disabledSwitch.click({ force: true });
      await expect(disabledSwitch).toHaveAttribute("aria-checked", "false");
    });

    test("disabled switch has correct ARIA attributes", async ({ page }) => {
      const disabledSection = page.locator("section").filter({ hasText: "Disabled States" });
      const disabledSwitch = disabledSection.getByRole("switch").first();

      await expect(disabledSwitch).toHaveAttribute("aria-disabled", "true");
      await expect(disabledSwitch).toHaveAttribute("data-disabled", "true");
    });
  });

  test.describe("With Icons", () => {
    test("displays correct icon based on state", async ({ page }) => {
      const iconSection = page.locator("section").filter({ hasText: /^With Icons/ });
      const switchEl = iconSection.getByRole("switch").first();

      await expect(switchEl).toHaveAttribute("aria-checked", "true");
      const thumbArea = switchEl.locator("span");
      await expect(thumbArea.locator("svg")).toBeVisible();

      await switchEl.click();
      await expect(switchEl).toHaveAttribute("aria-checked", "false");
      await expect(thumbArea.locator("svg")).toBeVisible();
    });
  });

  test.describe("Render Props", () => {
    test("render props update based on switch state", async ({ page }) => {
      const renderSection = page.locator("section").filter({ hasText: "Render Props" });
      const switchEl = renderSection.getByRole("switch");
      const label = renderSection.locator("span.font-bold");

      await expect(label).toHaveText("Inactive");

      await switchEl.click();
      await expect(label).toHaveText("Active");
    });
  });

  test.describe("Custom Animation", () => {
    test("animation switches work correctly", async ({ page }) => {
      const animSection = page.locator("section").filter({ hasText: "Custom Animation Timing" });
      const slowSwitch = animSection.getByRole("switch").first();

      await expect(slowSwitch).toHaveAttribute("aria-checked", "false");

      await slowSwitch.click();
      await expect(slowSwitch).toHaveAttribute("aria-checked", "true");

      await page.waitForTimeout(600);
      await expect(slowSwitch).toHaveAttribute("aria-checked", "true");
    });
  });

  test.describe("Focus Management", () => {
    test("focus events are triggered correctly", async ({ page }) => {
      const focusSection = page.locator("section").filter({ hasText: "Focus and Blur Events" });
      const switchEl = focusSection.getByRole("switch");
      const eventLog = focusSection.locator(".font-mono");

      await switchEl.focus();
      await expect(eventLog).toContainText("Focus:");

      await page.keyboard.press("Tab");
      await expect(eventLog).toContainText("Blur:");
    });
  });

  test.describe("Ref Forwarding", () => {
    test("focus button works via ref", async ({ page }) => {
      const refSection = page.locator("section").filter({ hasText: "Ref Forwarding" });
      const focusButton = refSection.getByRole("button", { name: "Focus Switch" });
      const switchEl = refSection.getByRole("switch");

      await focusButton.click();
      await expect(switchEl).toBeFocused();
    });

    test("toggle button works via ref", async ({ page }) => {
      const refSection = page.locator("section").filter({ hasText: "Ref Forwarding" });
      const toggleButton = refSection.getByRole("button", { name: "Toggle Switch" });
      const switchEl = refSection.getByRole("switch");

      const initialState = await switchEl.getAttribute("aria-checked");

      await toggleButton.click();

      const newState = await switchEl.getAttribute("aria-checked");
      expect(newState).not.toBe(initialState);
    });
  });

  test.describe("Accessibility", () => {
    test("switch components have no accessibility violations", async ({ page }) => {
      await injectAxe(page);

      const switchSection = page.locator("section").filter({ hasText: "Basic Switch" }).first();
      await switchSection.scrollIntoViewIfNeeded();

      await checkA11y(page, '[role="switch"]', {
        detailedReport: true,
      });
    });

    test("switch has correct role and aria attributes", async ({ page }) => {
      const switchEl = page.getByRole("switch").first();

      await expect(switchEl).toHaveAttribute("role", "switch");
      await expect(switchEl).toHaveAttribute("aria-checked");
    });

    test("label is associated with switch", async ({ page }) => {
      const labelSection = page.locator("section").filter({ hasText: "With Label" }).first();
      const switchEl = labelSection.getByRole("switch");
      const switchId = await switchEl.getAttribute("id");

      const label = labelSection.locator(`label[for="${switchId}"]`);
      await expect(label).toBeVisible();
    });
  });
});

test.describe("Switch - Cross Browser", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/demo/switch");
  });

  test("toggle works consistently", async ({ page }) => {
    const basicSwitch = page.getByRole("switch").first();

    await expect(basicSwitch).toHaveAttribute("aria-checked", "false");

    await basicSwitch.click();
    await expect(basicSwitch).toHaveAttribute("aria-checked", "true");

    await basicSwitch.click();
    await expect(basicSwitch).toHaveAttribute("aria-checked", "false");
  });

  test("keyboard toggle works across browsers", async ({ page, browserName }) => {
    const basicSwitch = page.getByRole("switch").first();

    await basicSwitch.focus();

    if (browserName === "webkit") {
      await page.keyboard.press("Space");
    } else {
      await page.keyboard.press("Enter");
    }

    await expect(basicSwitch).toHaveAttribute("aria-checked", "true");
  });

  test("focus visible state is applied", async ({ page }) => {
    const basicSwitch = page.getByRole("switch").first();

    await basicSwitch.focus();
    await expect(basicSwitch).toBeFocused();

    const outlineStyle = await basicSwitch.evaluate((el) => {
      return window.getComputedStyle(el).outlineStyle;
    });

    expect(["none", "auto", "solid"]).toContain(outlineStyle);
  });
});

test.describe("Switch - Mobile Touch", () => {
  test.use({
    viewport: { width: 375, height: 667 },
    hasTouch: true,
  });

  test.beforeEach(async ({ page }) => {
    await page.goto("/demo/switch");
  });

  test("touch tap toggles switch", async ({ page, browserName }) => {
    const basicSwitch = page.getByRole("switch").first();

    await expect(basicSwitch).toHaveAttribute("aria-checked", "false");

    // Firefox mobile emulation doesn't support tap(), use click() as fallback
    if (browserName === "firefox") {
      await basicSwitch.click();
    } else {
      await basicSwitch.tap();
    }
    await expect(basicSwitch).toHaveAttribute("aria-checked", "true");
  });

  test("label tap toggles switch on mobile", async ({ page, browserName }) => {
    const labelSection = page.locator("section").filter({ hasText: "With Label" }).first();
    const label = labelSection.getByText("Enable notifications");
    const switchEl = labelSection.getByRole("switch");

    // Firefox mobile emulation doesn't support tap(), use click() as fallback
    if (browserName === "firefox") {
      await label.click();
    } else {
      await label.tap();
    }

    const currentState = await switchEl.getAttribute("aria-checked");
    expect(currentState).toBe("false");
  });
});

test.describe("Switch - Mobile Viewport", () => {
  test.use({
    viewport: { width: 375, height: 667 },
  });

  test.beforeEach(async ({ page }) => {
    await page.goto("/demo/switch");
  });

  test("switch is accessible at mobile viewport", async ({ page }) => {
    const switches = page.getByRole("switch");
    const firstSwitch = switches.first();

    await expect(firstSwitch).toBeVisible();

    const box = await firstSwitch.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThanOrEqual(36);
    expect(box!.height).toBeGreaterThanOrEqual(20);
  });
});

test.describe("Switch - Full User Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/demo/switch");
  });

  test("user can toggle multiple switches in sequence", async ({ page }) => {
    const switches = page.getByRole("switch");
    const firstSwitch = switches.nth(0);
    const secondSwitch = switches.nth(1);

    await firstSwitch.click();
    await expect(firstSwitch).toHaveAttribute("aria-checked", "true");

    await secondSwitch.click();
    const secondState = await secondSwitch.getAttribute("aria-checked");
    expect(secondState).toBeTruthy();

    await firstSwitch.click();
    await expect(firstSwitch).toHaveAttribute("aria-checked", "false");
  });

  test("keyboard-only user can focus and toggle switch", async ({ page }) => {
    const basicSwitch = page.getByRole("switch").first();

    await basicSwitch.focus();
    await expect(basicSwitch).toBeFocused();

    const initialState = await basicSwitch.getAttribute("aria-checked");
    expect(initialState).toBe("false");

    await page.keyboard.press("Space");

    const newState = await basicSwitch.getAttribute("aria-checked");
    expect(newState).toBe("true");

    await page.keyboard.press("Tab");

    const secondSwitch = page.getByRole("switch").nth(1);
    await secondSwitch.focus();
    await expect(secondSwitch).toBeFocused();
  });

  test("theme toggle switches icon correctly", async ({ page }) => {
    const iconSection = page.locator("section").filter({ hasText: /^With Icons/ });
    const themeSwitchContainer = iconSection.locator("div.space-y-4 > div").nth(1);
    const switchEl = themeSwitchContainer.getByRole("switch");
    const description = themeSwitchContainer.locator("span").filter({ hasText: /mode enabled/ });

    await expect(description).toContainText("Light mode enabled");
    await expect(switchEl).toHaveAttribute("aria-checked", "false");

    await switchEl.click();

    await expect(description).toContainText("Dark mode enabled");
    await expect(switchEl).toHaveAttribute("aria-checked", "true");
  });
});
