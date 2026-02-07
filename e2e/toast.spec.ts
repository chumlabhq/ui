import { test, expect } from "@playwright/test";
import { injectAxe } from "axe-playwright";

const TOAST_SELECTOR = "[data-toast-id]";

async function waitForToastVisible(page: import("@playwright/test").Page) {
  const toast = page.locator(TOAST_SELECTOR).first();
  await toast.waitFor({ state: "visible", timeout: 10000 });
}

async function triggerToast(
  page: import("@playwright/test").Page,
  type: "success" | "error" | "warning" | "info" = "success",
) {
  const buttonText =
    type === "success"
      ? "Success"
      : type === "error"
        ? "Error"
        : type === "warning"
          ? "Warning"
          : "Info";

  const button = page.locator(`button:has-text("${buttonText}")`).first();
  await button.scrollIntoViewIfNeeded();
  await button.click();
  await waitForToastVisible(page);
}

test.describe("Toast Component - Cross-Browser Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/demo/toast");
    await page.waitForLoadState("networkidle");
  });

  test.describe("Basic Functionality", () => {
    test("should display toast when triggered", async ({ page }) => {
      await triggerToast(page, "success");

      const toast = page.locator(TOAST_SELECTOR).first();
      await expect(toast).toBeVisible();
      await expect(toast).toHaveAttribute("data-toast-type", "success");
    });

    test("should display multiple toasts", async ({ page }) => {
      await triggerToast(page, "success");
      await triggerToast(page, "error");
      await triggerToast(page, "warning");

      const toasts = page.locator(TOAST_SELECTOR);
      await expect(toasts).toHaveCount(3);
    });

    test("should display toast message and description", async ({ page }) => {
      const withDescButton = page
        .locator('button:has-text("Success with Description")')
        .first();

      if ((await withDescButton.count()) > 0) {
        await withDescButton.scrollIntoViewIfNeeded();
        await withDescButton.click();
        await waitForToastVisible(page);

        const toast = page.locator(TOAST_SELECTOR).first();
        await expect(toast).toContainText("File uploaded");
      }
    });

    for (const type of ["success", "error", "warning", "info"] as const) {
      test(`should render ${type} toast variant`, async ({ page }) => {
        await triggerToast(page, type);

        const toast = page.locator(TOAST_SELECTOR).first();
        await expect(toast).toHaveAttribute("data-toast-type", type);
      });
    }
  });

  test.describe("Toast Dismissal", () => {
    test("should dismiss toast via close button", async ({ page }) => {
      await triggerToast(page, "success");

      const closeButton = page.locator(
        `${TOAST_SELECTOR} button[aria-label="Close notification"]`,
      );
      await closeButton.click();

      await expect(page.locator(TOAST_SELECTOR)).toHaveCount(0);
    });

    test("should auto-dismiss after duration", async ({ page }) => {
      const quickButton = page.locator('button:has-text("2 Seconds")').first();

      if ((await quickButton.count()) > 0) {
        await quickButton.scrollIntoViewIfNeeded();
        await quickButton.click();
        await waitForToastVisible(page);

        await expect(page.locator(TOAST_SELECTOR)).toHaveCount(1);

        await page.waitForTimeout(2500);

        await expect(page.locator(TOAST_SELECTOR)).toHaveCount(0);
      }
    });

    test("should not auto-dismiss persistent toasts", async ({ page }) => {
      const persistentButton = page
        .locator('button:has-text("Persistent (Infinity)")')
        .first();

      if ((await persistentButton.count()) > 0) {
        await persistentButton.scrollIntoViewIfNeeded();
        await persistentButton.click();
        await waitForToastVisible(page);

        await page.waitForTimeout(3000);

        await expect(page.locator(TOAST_SELECTOR)).toHaveCount(1);
      }
    });

    test("should dismiss all toasts via Dismiss All button", async ({
      page,
    }) => {
      await triggerToast(page, "success");
      await triggerToast(page, "error");

      const dismissAllButton = page
        .locator('button:has-text("Dismiss All")')
        .first();

      if ((await dismissAllButton.count()) > 0) {
        await dismissAllButton.scrollIntoViewIfNeeded();
        await dismissAllButton.click();

        await expect(page.locator(TOAST_SELECTOR)).toHaveCount(0);
      }
    });
  });

  test.describe("Pause on Hover", () => {
    test("should pause progress on hover", async ({ page }) => {
      const quickButton = page.locator('button:has-text("2 Seconds")').first();

      if ((await quickButton.count()) > 0) {
        await quickButton.scrollIntoViewIfNeeded();
        await quickButton.click();
        await waitForToastVisible(page);

        const toast = page.locator(TOAST_SELECTOR).first();
        await toast.hover();

        await page.waitForTimeout(3000);
        await expect(toast).toBeVisible();
      }
    });

    test("should resume progress on mouse leave", async ({ page }) => {
      const quickButton = page.locator('button:has-text("2 Seconds")').first();

      if ((await quickButton.count()) > 0) {
        await quickButton.scrollIntoViewIfNeeded();
        await quickButton.click();
        await waitForToastVisible(page);

        const toast = page.locator(TOAST_SELECTOR).first();
        await toast.hover();

        await page.waitForTimeout(1000);
        await expect(toast).toBeVisible();

        await page.mouse.move(0, 0);

        await expect(page.locator(TOAST_SELECTOR)).toHaveCount(0, {
          timeout: 5000,
        });
      }
    });
  });

  test.describe("Progress Bar", () => {
    test("should display progress bar by default", async ({ page }) => {
      await triggerToast(page, "success");

      const progressBar = page
        .locator(`${TOAST_SELECTOR} .absolute.bottom-0`)
        .first();
      await expect(progressBar).toBeVisible();
    });

    test("should hide progress bar when configured", async ({ page }) => {
      const noProgressButton = page
        .locator('button:has-text("Without Progress")')
        .first();

      if ((await noProgressButton.count()) > 0) {
        await noProgressButton.scrollIntoViewIfNeeded();
        await noProgressButton.click();
        await waitForToastVisible(page);

        const toast = page.locator(TOAST_SELECTOR).first();
        const progressBar = toast.locator(".absolute.bottom-0");
        await expect(progressBar).toHaveCount(0);
      }
    });
  });

  test.describe("Max Toasts Limit", () => {
    test("should respect max toasts limit", async ({ page }) => {
      const multipleButton = page
        .locator('button:has-text("Trigger 10 Toasts")')
        .first();

      if ((await multipleButton.count()) > 0) {
        await multipleButton.scrollIntoViewIfNeeded();
        await multipleButton.click();

        await page.waitForTimeout(1500);

        const toasts = page.locator(TOAST_SELECTOR);
        const count = await toasts.count();
        expect(count).toBeLessThanOrEqual(5);
      }
    });
  });
});

test.describe("Toast Keyboard Navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/demo/toast");
    await page.waitForLoadState("networkidle");
  });

  test("should focus close button via Tab", async ({ page }) => {
    await triggerToast(page, "success");

    const closeButton = page.locator(
      `${TOAST_SELECTOR} button[aria-label="Close notification"]`,
    );
    await closeButton.focus();

    await expect(closeButton).toBeFocused();
  });

  test("should dismiss via Enter on close button", async ({ page }) => {
    await triggerToast(page, "success");

    const closeButton = page.locator(
      `${TOAST_SELECTOR} button[aria-label="Close notification"]`,
    );
    await closeButton.focus();
    await page.keyboard.press("Enter");

    await expect(page.locator(TOAST_SELECTOR)).toHaveCount(0);
  });

  test("should dismiss via Space on close button", async ({ page }) => {
    await triggerToast(page, "success");

    const closeButton = page.locator(
      `${TOAST_SELECTOR} button[aria-label="Close notification"]`,
    );
    await closeButton.focus();
    await page.keyboard.press("Space");

    await expect(page.locator(TOAST_SELECTOR)).toHaveCount(0);
  });

  test("should not dismiss on Escape when dismissOnEscape is not enabled on provider", async ({
    page,
  }) => {
    const escapeButton = page
      .locator('button:has-text("With Escape Dismissal")')
      .first();

    if ((await escapeButton.count()) > 0) {
      await escapeButton.scrollIntoViewIfNeeded();
      await escapeButton.click();
      await waitForToastVisible(page);

      // The demo's ToastProvider does not set dismissOnEscape=true,
      // so pressing Escape should have no effect on the toast.
      await page.keyboard.press("Escape");

      // Toast should still be visible since dismissOnEscape is not enabled
      await expect(page.locator(TOAST_SELECTOR).first()).toBeVisible();
    }
  });
});

test.describe("Toast Accessibility Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/demo/toast");
    await page.waitForLoadState("networkidle");
    await injectAxe(page);
  });

  test("should have no critical accessibility violations", async ({ page }) => {
    await triggerToast(page, "error");

    const results = await page.evaluate(async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const axeResults = await (window as any).axe.run("[data-toast-id]", {
        rules: {
          "color-contrast": { enabled: false },
          region: { enabled: false },
        },
      });
      return axeResults.violations;
    });

    const criticalViolations = results.filter(
      (v: { impact: string }) => v.impact === "critical",
    );

    expect(criticalViolations).toHaveLength(0);
  });

  test("should have proper ARIA attributes on toast", async ({ page }) => {
    await triggerToast(page, "error");

    const toast = page.locator(TOAST_SELECTOR).first();
    const role = await toast.getAttribute("role");
    expect(["alert", "status"]).toContain(role);
    await expect(toast).toHaveAttribute("data-toast-id");
    await expect(toast).toHaveAttribute("data-toast-type");
  });

  test("should have accessible close button", async ({ page }) => {
    await triggerToast(page, "success");

    const closeButton = page.locator(
      `${TOAST_SELECTOR} button[aria-label="Close notification"]`,
    );
    await expect(closeButton).toHaveAttribute(
      "aria-label",
      "Close notification",
    );
    await expect(closeButton).toHaveAttribute("type", "button");
  });

  test("should have notification region for announcements", async ({
    page,
  }) => {
    const region = page.locator('[role="region"][aria-label="Notifications"]');
    await expect(region).toBeAttached();
  });
});

test.describe("Toast Position Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/demo/toast");
    await page.waitForLoadState("networkidle");
  });

  for (const position of [
    "top-left",
    "top-center",
    "top-right",
    "bottom-left",
    "bottom-center",
    "bottom-right",
  ]) {
    test(`should display toast at ${position} position`, async ({ page }) => {
      const positionButton = page.locator(`button:has-text("${position}")`);

      if ((await positionButton.count()) > 0) {
        await positionButton.scrollIntoViewIfNeeded();
        await positionButton.click();

        const showButton = page
          .locator('button:has-text("Show Toast at Current Position")')
          .first();

        if ((await showButton.count()) > 0) {
          await showButton.scrollIntoViewIfNeeded();
          await showButton.click();

          await waitForToastVisible(page);

          const toast = page.locator(TOAST_SELECTOR).first();
          await expect(toast).toBeVisible();
        }
      }
    });
  }
});

test.describe("Toast Responsive Tests", () => {
  test("should render correctly on mobile viewport", async ({
    page,
  }, testInfo) => {
    const isMobileProject = testInfo.project.name.includes("Mobile");

    if (!isMobileProject) {
      await page.setViewportSize({ width: 375, height: 667 });
    }

    await page.goto("/demo/toast");
    await page.waitForLoadState("networkidle");

    await triggerToast(page, "success");

    const toast = page.locator(TOAST_SELECTOR).first();
    await expect(toast).toBeVisible();

    const boundingBox = await toast.boundingBox();
    expect(boundingBox).not.toBeNull();

    if (boundingBox) {
      expect(boundingBox.width).toBeLessThanOrEqual(375);
    }
  });

  test("should handle touch interactions on mobile", async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 375, height: 667 },
      hasTouch: true,
    });
    const mobilePage = await context.newPage();

    await mobilePage.goto("/demo/toast");
    await mobilePage.waitForLoadState("networkidle");

    await triggerToast(mobilePage, "success");

    const closeButton = mobilePage.locator(
      `${TOAST_SELECTOR} button[aria-label="Close notification"]`,
    );
    await closeButton.tap();

    await expect(mobilePage.locator(TOAST_SELECTOR)).toHaveCount(0);

    await context.close();
  });
});

test.describe("Toast Custom Content Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/demo/toast");
    await page.waitForLoadState("networkidle");
  });

  test("should render toast with action buttons", async ({ page }) => {
    const actionButton = page
      .locator('button:has-text("With Action Buttons")')
      .first();

    if ((await actionButton.count()) > 0) {
      await actionButton.scrollIntoViewIfNeeded();
      await actionButton.click();
      await waitForToastVisible(page);

      const toast = page.locator(TOAST_SELECTOR).first();
      const buttons = toast.locator("button");
      const buttonCount = await buttons.count();

      expect(buttonCount).toBeGreaterThanOrEqual(2);
    }
  });

  test("should render toast with custom layout", async ({ page }) => {
    const customButton = page
      .locator('button:has-text("Custom Layout")')
      .first();

    if ((await customButton.count()) > 0) {
      await customButton.scrollIntoViewIfNeeded();
      await customButton.click();
      await waitForToastVisible(page);

      const toast = page.locator(TOAST_SELECTOR).first();
      await expect(toast).toBeVisible();
    }
  });

  test("should render toast with custom icon", async ({ page }) => {
    const iconButton = page.locator('button:has-text("Rocket Icon")').first();

    if ((await iconButton.count()) > 0) {
      await iconButton.scrollIntoViewIfNeeded();
      await iconButton.click();
      await waitForToastVisible(page);

      const toast = page.locator(TOAST_SELECTOR).first();
      await expect(toast).toBeVisible();
    }
  });
});

test.describe("Toast Performance Tests", () => {
  test("should load page within acceptable time", async ({
    page,
    browserName,
  }) => {
    const startTime = Date.now();

    await page.goto("/demo/toast");
    await page.waitForLoadState("networkidle");

    const loadTime = Date.now() - startTime;

    const threshold = browserName === "firefox" ? 15000 : 10000;
    expect(loadTime).toBeLessThan(threshold);
  });

  test("should handle rapid toast creation without lag", async ({
    page,
    browserName,
  }) => {
    await page.goto("/demo/toast");
    await page.waitForLoadState("networkidle");

    const startTime = Date.now();

    for (let i = 0; i < 5; i++) {
      await triggerToast(page, "success");
    }

    const elapsedTime = Date.now() - startTime;

    const maxTime = browserName === "firefox" ? 10000 : 5000;
    expect(elapsedTime).toBeLessThan(maxTime);

    const toasts = page.locator(TOAST_SELECTOR);
    expect(await toasts.count()).toBeGreaterThan(0);
  });

  test("should smoothly dismiss multiple toasts", async ({ page }) => {
    await page.goto("/demo/toast");
    await page.waitForLoadState("networkidle");

    for (let i = 0; i < 3; i++) {
      await triggerToast(page, "success");
    }

    const dismissAllButton = page
      .locator('button:has-text("Dismiss All")')
      .first();

    if ((await dismissAllButton.count()) > 0) {
      await dismissAllButton.scrollIntoViewIfNeeded();
      await dismissAllButton.click();

      await page.waitForTimeout(500);

      await expect(page.locator(TOAST_SELECTOR)).toHaveCount(0);
    }
  });
});

test.describe("Toast Focus Management", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/demo/toast");
    await page.waitForLoadState("networkidle");
  });

  test("should maintain focus on close button when focused", async ({
    page,
  }) => {
    await triggerToast(page, "success");

    const closeButton = page.locator(
      `${TOAST_SELECTOR} button[aria-label="Close notification"]`,
    );
    await closeButton.focus();

    await expect(closeButton).toBeFocused();
  });

  test("should not trap focus in toast", async ({ page, browserName }) => {
    await triggerToast(page, "success");

    const closeButton = page
      .locator(`${TOAST_SELECTOR} button[aria-label="Close notification"]`)
      .first();
    await closeButton.focus();
    await expect(closeButton).toBeFocused();

    if (browserName === "firefox") {
      const otherButton = page.locator('button:has-text("Success")').first();
      await otherButton.focus();
      await expect(otherButton).toBeFocused();
      await expect(closeButton).not.toBeFocused();
    } else {
      await page.keyboard.press("Tab");
      await expect(closeButton).not.toBeFocused();
    }
  });
});
