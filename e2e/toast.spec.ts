import { gotoFixture } from "./_nav";
import { activateByTouch, conceal, press, reveal, skipWithoutTouchEvents } from "./_helpers";
import { test, expect } from "./_test";
import { injectAxe } from "axe-playwright";

const TOAST_SELECTOR = "[data-toast-id]";

async function waitForToastVisible(page: import("@playwright/test").Page) {
  const toast = page.locator(TOAST_SELECTOR).first();
  await toast.waitFor({ state: "visible", timeout: 10000 });
}

async function triggerToast(
  page: import("@playwright/test").Page,
  variant: "success" | "error" | "warning" | "info" = "success",
) {
  const buttonText =
    variant === "success"
      ? "Success"
      : variant === "error"
        ? "Error"
        : variant === "warning"
          ? "Warning"
          : "Info";

  const button = page.locator(`button:has-text("${buttonText}")`).first();
  await button.scrollIntoViewIfNeeded();
  await button.click();
  await waitForToastVisible(page);
}

test.describe("Toast Component - Cross-Browser Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/toast");
    await page.waitForLoadState("domcontentloaded");
  });

  test.describe("Basic Functionality", () => {
    test("should display toast when triggered", async ({ page }) => {
      await triggerToast(page, "success");

      const toast = page.locator(TOAST_SELECTOR).first();
      await expect(toast).toBeVisible();
      await expect(toast).toHaveAttribute("data-variant", "success");
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

      // The guard used to make this pass when the element was absent, which is
      // the failure the test exists to catch. Assert presence, then behaviour.
      await expect(withDescButton.first()).toBeVisible();
      await withDescButton.scrollIntoViewIfNeeded();
      await withDescButton.click();
      await waitForToastVisible(page);

      const toast = page.locator(TOAST_SELECTOR).first();
      await expect(toast).toContainText("File uploaded");
    });

    for (const type of ["success", "error", "warning", "info"] as const) {
      test(`should render ${type} toast variant`, async ({ page }) => {
        await triggerToast(page, type);

        const toast = page.locator(TOAST_SELECTOR).first();
        await expect(toast).toHaveAttribute("data-variant", type);
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

      // The guard used to make this pass when the element was absent, which is
      // the failure the test exists to catch. Assert presence, then behaviour.
      await expect(quickButton.first()).toBeVisible();
      await quickButton.scrollIntoViewIfNeeded();
      await quickButton.click();
      await waitForToastVisible(page);

      await expect(page.locator(TOAST_SELECTOR)).toHaveCount(1);

      await page.waitForTimeout(2500);

      await expect(page.locator(TOAST_SELECTOR)).toHaveCount(0);
    });

    test("should not auto-dismiss persistent toasts", async ({ page }) => {
      const persistentButton = page
        .locator('button:has-text("Persistent (Infinity)")')
        .first();

      // The guard used to make this pass when the element was absent, which is
      // the failure the test exists to catch. Assert presence, then behaviour.
      await expect(persistentButton.first()).toBeVisible();
      await persistentButton.scrollIntoViewIfNeeded();
      await persistentButton.click();
      await waitForToastVisible(page);

      await page.waitForTimeout(3000);

      await expect(page.locator(TOAST_SELECTOR)).toHaveCount(1);
    });

    test("should dismiss all toasts via Dismiss All button", async ({
      page,
    }) => {
      await triggerToast(page, "success");
      await triggerToast(page, "error");

      const dismissAllButton = page
        .locator('button:has-text("Dismiss All")')
        .first();

      // The guard used to make this pass when the element was absent, which is
      // the failure the test exists to catch. Assert presence, then behaviour.
      await expect(dismissAllButton.first()).toBeVisible();
      await dismissAllButton.scrollIntoViewIfNeeded();
      await dismissAllButton.click();

      await expect(page.locator(TOAST_SELECTOR)).toHaveCount(0);
    });
  });

  test.describe("Pause on Hover", () => {
    test("should pause progress on hover", async ({ page }) => {
      const quickButton = page.locator('button:has-text("2 Seconds")').first();

      // The guard used to make this pass when the element was absent, which is
      // the failure the test exists to catch. Assert presence, then behaviour.
      await expect(quickButton.first()).toBeVisible();
      await quickButton.scrollIntoViewIfNeeded();
      await press(page, quickButton);
      await waitForToastVisible(page);

      const toast = page.locator(TOAST_SELECTOR).first();
      await reveal(page, toast);

      await page.waitForTimeout(3000);
      await expect(toast).toBeVisible();
    });

    test("should resume progress on mouse leave", async ({ page }) => {
      const quickButton = page.locator('button:has-text("2 Seconds")').first();

      // The guard used to make this pass when the element was absent, which is
      // the failure the test exists to catch. Assert presence, then behaviour.
      await expect(quickButton.first()).toBeVisible();
      await quickButton.scrollIntoViewIfNeeded();
      await press(page, quickButton);
      await waitForToastVisible(page);

      const toast = page.locator(TOAST_SELECTOR).first();
      await reveal(page, toast);

      await page.waitForTimeout(1000);
      await expect(toast).toBeVisible();

      await conceal(page);

      await expect(page.locator(TOAST_SELECTOR)).toHaveCount(0, {
        timeout: 5000,
      });
    });
  });

  // WCAG 2.2.1: a keyboard or screen-reader user reading the toast holds it as
  // a pointer over it does. Measured before the fix: focus on the close button
  // left a 2 s toast to go at 2.82 s, against 2.83 s untouched.
  test.describe("Pause on Focus", () => {
    test("holds the toast while focus is inside it and releases it when focus leaves", async ({ page }) => {
      const quickButton = page.locator('button:has-text("2 Seconds")').first();
      await expect(quickButton).toBeVisible();
      await quickButton.scrollIntoViewIfNeeded();
      await quickButton.click();
      await waitForToastVisible(page);

      const toast = page.locator(TOAST_SELECTOR).first();
      const close = toast.getByRole("button", { name: "Close notification" });
      await close.focus();

      await page.waitForTimeout(3000);
      await expect(toast, "focus inside should hold the toast past its 2 s").toBeVisible();

      await close.evaluate((el) => (el as HTMLElement).blur());
      await expect(page.locator(TOAST_SELECTOR)).toHaveCount(0, { timeout: 5000 });
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

      // The guard used to make this pass when the element was absent, which is
      // the failure the test exists to catch. Assert presence, then behaviour.
      await expect(noProgressButton.first()).toBeVisible();
      await noProgressButton.scrollIntoViewIfNeeded();
      await noProgressButton.click();
      await waitForToastVisible(page);

      const toast = page.locator(TOAST_SELECTOR).first();
      const progressBar = toast.locator(".absolute.bottom-0");
      await expect(progressBar).toHaveCount(0);
    });
  });

  test.describe("Max Toasts Limit", () => {
    test("should respect max toasts limit", async ({ page }) => {
      const multipleButton = page
        .locator('button:has-text("Trigger 10 Toasts")')
        .first();

      // The guard used to make this pass when the element was absent, which is
      // the failure the test exists to catch. Assert presence, then behaviour.
      await expect(multipleButton.first()).toBeVisible();
      await multipleButton.scrollIntoViewIfNeeded();
      await multipleButton.click();

      // Settled, not sampled. An overflow toast stays in the DOM while its exit
      // animation runs, so a fixed wait counts whatever the engine happens to
      // have cleaned up by then — Chromium had finished at 1500ms and Firefox
      // still held one, which is a difference in animation scheduling rather
      // than in the limit. Retrying until the count settles asserts the limit
      // itself and means the same thing on every engine.
      //
      // Only once the last toast is up: the demo fires its ten 100 ms apart,
      // so a count of five was met at the fifth, before the limit had anything
      // to remove.
      const toasts = page.locator(TOAST_SELECTOR);
      await expect(toasts.filter({ hasText: "Toast #10" })).toHaveCount(1, { timeout: 5000 });
      await expect(toasts).toHaveCount(5, { timeout: 5000 });
    });
  });
});

test.describe("Toast Keyboard Navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/toast");
    await page.waitForLoadState("domcontentloaded");
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

  test("dismisses the toast on Escape through the page provider's default", async ({
    page,
  }) => {
    const withEscape = page.getByRole("button", { name: "With Escape Dismissal" });
    await withEscape.scrollIntoViewIfNeeded();
    await withEscape.click();
    const toast = page.locator(TOAST_SELECTOR, { hasText: "Press Escape to dismiss" });
    await expect(toast).toBeVisible();

    await page.keyboard.press("Escape");

    await expect(toast).toHaveCount(0);
  });

  test("keeps the toast on Escape when its provider sets closeOnEscape={false}", async ({
    page,
  }) => {
    const withoutEscape = page.getByRole("button", { name: "Without Escape Dismissal" });
    await withoutEscape.scrollIntoViewIfNeeded();
    await withoutEscape.click();
    const toast = page.locator(TOAST_SELECTOR, {
      hasText: "Escape leaves this one; use its close button",
    });
    await expect(toast).toBeVisible();

    await page.keyboard.press("Escape");

    // Past the 500ms exit transition, so a dismissal would have finished.
    await page.waitForTimeout(800);
    await expect(toast).toBeVisible();
  });

  test("dismisses only the enabled provider's toast when both are showing", async ({ page }) => {
    await page.getByRole("button", { name: "Without Escape Dismissal" }).click();
    await page.getByRole("button", { name: "With Escape Dismissal" }).click();
    const kept = page.locator(TOAST_SELECTOR, {
      hasText: "Escape leaves this one; use its close button",
    });
    const dismissed = page.locator(TOAST_SELECTOR, { hasText: "Press Escape to dismiss" });
    await expect(kept).toBeVisible();
    await expect(dismissed).toBeVisible();

    await page.keyboard.press("Escape");

    await expect(dismissed).toHaveCount(0);
    await expect(kept).toBeVisible();
  });
});

test.describe("Toast Accessibility Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/toast");
    await page.waitForLoadState("domcontentloaded");
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
    await expect(toast).toHaveAttribute("data-variant");
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
    await page.goto("/toast");
    await page.waitForLoadState("domcontentloaded");
  });

  for (const position of [
    "top-start",
    "top-center",
    "top-end",
    "bottom-start",
    "bottom-center",
    "bottom-end",
  ]) {
    test(`should display toast at ${position} position`, async ({ page }) => {
      const positionButton = page.locator(`button:has-text("${position}")`);

      // The guard used to make this pass when the element was absent, which is
      // the failure the test exists to catch. Assert presence, then behaviour.
      await expect(positionButton.first()).toBeVisible();
      await positionButton.scrollIntoViewIfNeeded();
      await positionButton.click();

      const showButton = page
        .locator('button:has-text("Show Toast at Current Position")')
        .first();

      // The guard used to make this pass when the trigger was absent, which is
      // the failure the test exists to catch. Assert presence, then behaviour.
      await expect(showButton).toBeVisible();
      await showButton.scrollIntoViewIfNeeded();
      await showButton.click();

      await waitForToastVisible(page);

      const toast = page.locator(TOAST_SELECTOR).first();
      await expect(toast).toBeVisible();
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

    await page.goto("/toast");
    await page.waitForLoadState("domcontentloaded");

    await triggerToast(page, "success");

    const toast = page.locator(TOAST_SELECTOR).first();
    await expect(toast).toBeVisible();

    const boundingBox = await toast.boundingBox();
    expect(boundingBox).not.toBeNull();

    if (boundingBox) {
      expect(boundingBox.width).toBeLessThanOrEqual(375);
    }
  });

});

test.describe("Toast Custom Content Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/toast");
    await page.waitForLoadState("domcontentloaded");
  });

  test("should render toast with action buttons", async ({ page }) => {
    const actionButton = page
      .locator('button:has-text("With Action Buttons")')
      .first();

    // The guard used to make this pass when the element was absent, which is
    // the failure the test exists to catch. Assert presence, then behaviour.
    await expect(actionButton.first()).toBeVisible();
    await actionButton.scrollIntoViewIfNeeded();
    await actionButton.click();
    await waitForToastVisible(page);

    const toast = page.locator(TOAST_SELECTOR).first();
    const buttons = toast.locator("button");
    const buttonCount = await buttons.count();

    expect(buttonCount).toBeGreaterThanOrEqual(2);
  });

  test("should render toast with custom layout", async ({ page }) => {
    const customButton = page
      .locator('button:has-text("Custom Layout")')
      .first();

    // The guard used to make this pass when the element was absent, which is
    // the failure the test exists to catch. Assert presence, then behaviour.
    await expect(customButton.first()).toBeVisible();
    await customButton.scrollIntoViewIfNeeded();
    await customButton.click();
    await waitForToastVisible(page);

    const toast = page.locator(TOAST_SELECTOR).first();
    await expect(toast).toBeVisible();
  });

  test("should render toast with custom icon", async ({ page }) => {
    const iconButton = page.locator('button:has-text("Rocket Icon")').first();

    // The guard used to make this pass when the element was absent, which is
    // the failure the test exists to catch. Assert presence, then behaviour.
    await expect(iconButton.first()).toBeVisible();
    await iconButton.scrollIntoViewIfNeeded();
    await iconButton.click();
    await waitForToastVisible(page);

    const toast = page.locator(TOAST_SELECTOR).first();
    await expect(toast).toBeVisible();
  });
});

test.describe("Toast - Bulk Dismissal", () => {


  test("should smoothly dismiss multiple toasts", async ({ page }) => {
    await page.goto("/toast");
    await page.waitForLoadState("domcontentloaded");

    for (let i = 0; i < 3; i++) {
      await triggerToast(page, "success");
    }

    const dismissAllButton = page
      .locator('button:has-text("Dismiss All")')
      .first();

    // The guard used to make this pass when the element was absent, which is
    // the failure the test exists to catch. Assert presence, then behaviour.
    await expect(dismissAllButton.first()).toBeVisible();
    await dismissAllButton.scrollIntoViewIfNeeded();
    await dismissAllButton.click();

    await page.waitForTimeout(500);

    await expect(page.locator(TOAST_SELECTOR)).toHaveCount(0);
  });
});

test.describe("Toast Focus Management", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/toast");
    await page.waitForLoadState("domcontentloaded");
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

/**
 * toast.spec.ts's one stale test (E2E-TRIAGE.md), and the only assertion
 * anywhere that a toast can be dismissed by touch — Toast.test.tsx has no
 * touch coverage at all, so this could not be deleted.
 *
 * The original was named for a swipe; Toast has no gesture handling, and what
 * it actually did was tap the close button. Kept as that, against a fixture.
 */
test.describe("Toast (fixtures)", () => {
  test("dismisses from a touch on the close button", async ({ page }) => {
    await skipWithoutTouchEvents(test, page);

    await page.setViewportSize({ width: 375, height: 667 });
    await gotoFixture(page, "Toast", "dismissable");

    const toast = page.locator("[data-toast-id]");
    await expect(toast).toBeVisible();

    const close = page.getByRole("button", { name: "Close notification" });
    await activateByTouch(page, close);

    await expect(toast).toHaveCount(0);
  });
});
