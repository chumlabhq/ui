import { test, expect } from "@playwright/test";
import { injectAxe, checkA11y } from "axe-playwright";

async function waitForPanelVisible(page: import("@playwright/test").Page) {
  const separator = page.getByRole("separator").first();
  await separator.waitFor({ state: "attached", timeout: 10000 });
  await separator.scrollIntoViewIfNeeded();
}

test.describe("ResizablePanel Component", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/demo/resizable-panel");
    await page.waitForLoadState("domcontentloaded");
    await waitForPanelVisible(page);
  });

  test.describe("Basic Functionality", () => {
    test("renders separator handles on the page", async ({ page }) => {
      const separators = page.getByRole("separator");
      const count = await separators.count();
      expect(count).toBeGreaterThan(0);
    });

    test("separator is focusable", async ({ page }) => {
      const separator = page.getByRole("separator").first();
      await separator.focus();
      await expect(separator).toBeFocused();
    });

    test("panel renders with correct initial width", async ({ page }) => {
      const rightSection = page.locator("section").filter({ hasText: "Right Resize (Default)" }).first();
      const separator = rightSection.getByRole("separator");
      const valueNow = await separator.getAttribute("aria-valuenow");
      expect(Number(valueNow)).toBeGreaterThanOrEqual(200);
      expect(Number(valueNow)).toBeLessThanOrEqual(500);
    });
  });

  test.describe("Keyboard Navigation", () => {
    test("ArrowRight increases width for right-resize panel", async ({ page }) => {
      const rightSection = page.locator("section").filter({ hasText: "Right Resize (Default)" }).first();
      const separator = rightSection.getByRole("separator");
      const initialValue = Number(await separator.getAttribute("aria-valuenow"));

      await separator.focus();
      await page.keyboard.press("ArrowRight");

      const newValue = Number(await separator.getAttribute("aria-valuenow"));
      expect(newValue).toBeGreaterThan(initialValue);
    });

    test("ArrowLeft decreases width for right-resize panel", async ({ page }) => {
      const rightSection = page.locator("section").filter({ hasText: "Right Resize (Default)" }).first();
      const separator = rightSection.getByRole("separator");
      const initialValue = Number(await separator.getAttribute("aria-valuenow"));

      await separator.focus();
      await page.keyboard.press("ArrowLeft");

      const newValue = Number(await separator.getAttribute("aria-valuenow"));
      expect(newValue).toBeLessThan(initialValue);
    });

    test("Home sets panel to minimum size", async ({ page }) => {
      const rightSection = page.locator("section").filter({ hasText: "Right Resize (Default)" }).first();
      const separator = rightSection.getByRole("separator");
      const minValue = Number(await separator.getAttribute("aria-valuemin"));

      await separator.focus();
      await page.keyboard.press("Home");

      const newValue = Number(await separator.getAttribute("aria-valuenow"));
      expect(newValue).toBe(minValue);
    });

    test("End sets panel to maximum size", async ({ page }) => {
      const rightSection = page.locator("section").filter({ hasText: "Right Resize (Default)" }).first();
      const separator = rightSection.getByRole("separator");
      const maxValue = Number(await separator.getAttribute("aria-valuemax"));

      await separator.focus();
      await page.keyboard.press("End");

      const newValue = Number(await separator.getAttribute("aria-valuenow"));
      expect(newValue).toBe(maxValue);
    });

    test("Shift+Arrow moves by 5x step", async ({ page }) => {
      const stepSection = page.locator("section").filter({ hasText: "Custom Step Size" });
      const separator = stepSection.getByRole("separator");
      const initialValue = Number(await separator.getAttribute("aria-valuenow"));

      await separator.focus();
      await page.keyboard.press("Shift+ArrowRight");

      const newValue = Number(await separator.getAttribute("aria-valuenow"));
      expect(newValue - initialValue).toBe(125);
    });

    test("ArrowDown increases height for bottom-resize panel", async ({ page }) => {
      const bottomSection = page.locator("section").filter({ hasText: "Bottom Resize (Vertical)" });
      const separator = bottomSection.getByRole("separator");
      const initialValue = Number(await separator.getAttribute("aria-valuenow"));

      await separator.focus();
      await page.keyboard.press("ArrowDown");

      const newValue = Number(await separator.getAttribute("aria-valuenow"));
      expect(newValue).toBeGreaterThan(initialValue);
    });

    test("ArrowUp decreases height for bottom-resize panel", async ({ page }) => {
      const bottomSection = page.locator("section").filter({ hasText: "Bottom Resize (Vertical)" });
      const separator = bottomSection.getByRole("separator");
      const initialValue = Number(await separator.getAttribute("aria-valuenow"));

      await separator.focus();
      await page.keyboard.press("ArrowUp");

      const newValue = Number(await separator.getAttribute("aria-valuenow"));
      expect(newValue).toBeLessThan(initialValue);
    });
  });

  test.describe("Pointer Drag Interaction", () => {
    test("dragging the handle resizes the panel", async ({ page }) => {
      const rightSection = page.locator("section").filter({ hasText: "Right Resize (Default)" }).first();
      const separator = rightSection.getByRole("separator");
      const initialValue = Number(await separator.getAttribute("aria-valuenow"));

      const box = await separator.boundingBox();
      expect(box).not.toBeNull();

      await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
      await page.mouse.down();
      await page.mouse.move(box!.x + box!.width / 2 + 50, box!.y + box!.height / 2);
      await page.mouse.up();

      const newValue = Number(await separator.getAttribute("aria-valuenow"));
      expect(newValue).toBeGreaterThan(initialValue);
    });
  });

  test.describe("Controlled State", () => {
    test("slider and panel stay in sync", async ({ page }) => {
      const controlledSection = page.locator("section").filter({ hasText: "Controlled State" });
      const slider = controlledSection.getByRole("slider", { name: "Panel width" });
      const separator = controlledSection.getByRole("separator");

      await slider.fill("400");

      const panelValue = Number(await separator.getAttribute("aria-valuenow"));
      expect(panelValue).toBe(400);
    });

    test("reset button restores default value", async ({ page }) => {
      const controlledSection = page.locator("section").filter({ hasText: "Controlled State" });
      const resetButton = controlledSection.getByRole("button", { name: "Reset" });
      const separator = controlledSection.getByRole("separator");

      await resetButton.click();

      const panelValue = Number(await separator.getAttribute("aria-valuenow"));
      expect(panelValue).toBe(320);
    });
  });

  test.describe("Disabled State", () => {
    test("disabled panel handle is not focusable", async ({ page }) => {
      const disabledSection = page.locator("section").filter({ hasText: /^Disabled/ });
      const separator = disabledSection.getByRole("separator");

      await expect(separator).toHaveAttribute("aria-disabled", "true");
      await expect(separator).toHaveAttribute("tabindex", "-1");
    });

    test("disabled panel handle does not respond to keyboard", async ({ page }) => {
      const disabledSection = page.locator("section").filter({ hasText: /^Disabled/ });
      const separator = disabledSection.getByRole("separator");
      const initialValue = await separator.getAttribute("aria-valuenow");

      await separator.focus({ timeout: 1000 }).catch(() => {});
      await page.keyboard.press("ArrowRight");

      const newValue = await separator.getAttribute("aria-valuenow");
      expect(newValue).toBe(initialValue);
    });
  });

  test.describe("Resize Callbacks", () => {
    test("resize events appear in callback log", async ({ page }) => {
      const callbackSection = page.locator("section").filter({ hasText: "Resize Callbacks" });
      const separator = callbackSection.getByRole("separator");

      await separator.focus();
      await page.keyboard.press("ArrowRight");

      const log = callbackSection.locator(".font-mono");
      await expect(log).toContainText("onResizeStart");
      await expect(log).toContainText("onResizeEnd");
    });
  });

  test.describe("Accessibility", () => {
    test("separator has no accessibility violations", async ({ page }) => {
      await injectAxe(page);
      const rightSection = page.locator("section").filter({ hasText: "Right Resize (Default)" }).first();
      await rightSection.scrollIntoViewIfNeeded();
      await checkA11y(page, "[role='separator']", {
        detailedReport: true,
      });
    });

    test("separator has correct ARIA attributes", async ({ page }) => {
      const separator = page.getByRole("separator").first();
      await expect(separator).toHaveAttribute("aria-valuenow");
      await expect(separator).toHaveAttribute("aria-valuemin");
      await expect(separator).toHaveAttribute("aria-valuemax");
      await expect(separator).toHaveAttribute("aria-valuetext");
      await expect(separator).toHaveAttribute("aria-label");
    });

    test("separator has aria-controls referencing panel id", async ({ page }) => {
      const customIdSection = page.locator("section").filter({ hasText: "Custom ID" });
      const separator = customIdSection.getByRole("separator");
      await expect(separator).toHaveAttribute("aria-controls", "my-resizable");
    });

    test("separator aria-valuetext describes pixels", async ({ page }) => {
      const separator = page.getByRole("separator").first();
      const valueText = await separator.getAttribute("aria-valuetext");
      expect(valueText).toMatch(/\d+ pixels/);
    });

    test("custom aria-label is applied to separator", async ({ page }) => {
      const ariaSection = page.locator("section").filter({ hasText: "Custom Aria Label" });
      const separator = ariaSection.getByRole("separator");
      await expect(separator).toHaveAttribute("aria-label", "Resize sidebar navigation");
    });
  });
});

test.describe("ResizablePanel - Cross Browser", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/demo/resizable-panel");
    await page.waitForLoadState("domcontentloaded");
  });

  test("keyboard resize works consistently", async ({ page }) => {
    const rightSection = page.locator("section").filter({ hasText: "Right Resize (Default)" }).first();
    const separator = rightSection.getByRole("separator");
    const initialValue = Number(await separator.getAttribute("aria-valuenow"));

    await separator.focus();
    await page.keyboard.press("ArrowRight");

    const newValue = Number(await separator.getAttribute("aria-valuenow"));
    expect(newValue).toBeGreaterThan(initialValue);
  });

  test("focus is visible on separator", async ({ page }) => {
    const separator = page.getByRole("separator").first();
    await separator.focus();
    await expect(separator).toBeFocused();
  });
});

test.describe("ResizablePanel - Mobile Touch", () => {
  test.use({
    viewport: { width: 375, height: 667 },
    hasTouch: true,
  });

  test.beforeEach(async ({ page }) => {
    await page.goto("/demo/resizable-panel");
    await page.waitForLoadState("domcontentloaded");
  });

  test("separator is visible and accessible at mobile viewport", async ({ page }) => {
    const separator = page.getByRole("separator").first();
    await expect(separator).toBeVisible();

    const box = await separator.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThanOrEqual(4);
  });
});

test.describe("ResizablePanel - Full User Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/demo/resizable-panel");
    await page.waitForLoadState("domcontentloaded");
  });

  test("keyboard-only user can resize panel from min to max", async ({ page }) => {
    const rightSection = page.locator("section").filter({ hasText: "Right Resize (Default)" }).first();
    const separator = rightSection.getByRole("separator");

    await separator.focus();
    await page.keyboard.press("Home");
    const minValue = Number(await separator.getAttribute("aria-valuemin"));
    expect(Number(await separator.getAttribute("aria-valuenow"))).toBe(minValue);

    await page.keyboard.press("End");
    const maxValue = Number(await separator.getAttribute("aria-valuemax"));
    expect(Number(await separator.getAttribute("aria-valuenow"))).toBe(maxValue);
  });

  test("side-by-side panels can be resized independently", async ({ page }) => {
    const sideSection = page.locator("section").filter({ hasText: "Side-by-Side Panels" });
    const separators = sideSection.getByRole("separator");
    const sidebarSep = separators.first();

    const initialValue = Number(await sidebarSep.getAttribute("aria-valuenow"));
    await sidebarSep.focus();
    await page.keyboard.press("ArrowRight");

    const newValue = Number(await sidebarSep.getAttribute("aria-valuenow"));
    expect(newValue).toBeGreaterThan(initialValue);
  });

  test("controlled panel syncs with slider", async ({ page }) => {
    const controlledSection = page.locator("section").filter({ hasText: "Controlled State" });
    const slider = controlledSection.getByRole("slider", { name: "Panel width" });
    const separator = controlledSection.getByRole("separator");

    await slider.fill("200");
    expect(Number(await separator.getAttribute("aria-valuenow"))).toBe(200);

    await slider.fill("450");
    expect(Number(await separator.getAttribute("aria-valuenow"))).toBe(450);
  });
});
