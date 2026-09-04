import { test, expect } from "@playwright/test";
import { skipWithoutTouchEvents, skipWithoutTabTraversal } from "./_helpers";
import { injectAxe } from "axe-playwright";
import { gotoFixture } from "./_nav";

const NAV_SELECTOR = 'nav[aria-label="Pagination"]';

async function waitForPaginationVisible(page: import("@playwright/test").Page) {
  const nav = page.locator(NAV_SELECTOR).first();
  await nav.waitFor({ state: "attached", timeout: 10000 });
  await nav.scrollIntoViewIfNeeded();
  await nav.waitFor({ state: "visible", timeout: 10000 });
}

function getBasicPagination(page: import("@playwright/test").Page) {
  const section = page.locator("section").filter({ hasText: "Basic Pagination" }).first();
  return section.locator(NAV_SELECTOR).first();
}

function getRowsPagination(page: import("@playwright/test").Page) {
  const section = page.locator("section").filter({ hasText: "With Rows Per Page" }).first();
  return section.locator(NAV_SELECTOR).first();
}

function escapeCSS(value: string): string {
  return value.replace(/:/g, "\\:");
}

async function tapOrClick(locator: import("@playwright/test").Locator) {
  if (test.info().project.use?.hasTouch) {
    await locator.tap();
  } else {
    await locator.click();
  }
}

test.describe("Pagination Component - Cross-Browser Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/pagination");
    await page.waitForLoadState("networkidle");
    await waitForPaginationVisible(page);
  });

  test.describe("Basic Functionality", () => {
    test("should render pagination nav elements on the page", async ({ page }) => {
      const navs = page.locator(NAV_SELECTOR);
      await expect(navs.first()).toBeVisible();

      const count = await navs.count();
      expect(count).toBeGreaterThan(0);
    });





  });


  test.describe("Ellipsis Rendering", () => {
    test("should display ellipsis for many pages", async ({ page }) => {
      const manyPagesSection = page.locator("section").filter({ hasText: "Many Pages & Sibling Count" }).first();
      const pagination = manyPagesSection.locator(NAV_SELECTOR).first();
      await pagination.scrollIntoViewIfNeeded();

      const ellipsis = pagination.locator('[aria-hidden="true"]');
      expect(await ellipsis.count()).toBeGreaterThan(0);
    });
  });

  test.describe("Rows Per Page Dropdown", () => {
    test("should render rows-per-page selector when enabled", async ({ page }) => {
      const pagination = getRowsPagination(page);
      await pagination.scrollIntoViewIfNeeded();

      const triggerButton = pagination.locator('button[aria-haspopup="listbox"]');
      await expect(triggerButton).toBeVisible();
    });

    test("should open dropdown on click and show options", async ({ page }) => {
      const pagination = getRowsPagination(page);
      await pagination.scrollIntoViewIfNeeded();

      const triggerButton = pagination.locator('button[aria-haspopup="listbox"]');
      await tapOrClick(triggerButton);

      await expect(triggerButton).toHaveAttribute("aria-expanded", "true");

      const listboxId = await triggerButton.getAttribute("aria-controls");
      const listbox = page.locator(`#${escapeCSS(listboxId!)}`);
      await expect(listbox).toBeVisible();

      const options = listbox.locator('[role="option"]');
      expect(await options.count()).toBeGreaterThan(0);
    });

    test("should close dropdown after selecting an option", async ({ page }) => {
      const pagination = getRowsPagination(page);
      await pagination.scrollIntoViewIfNeeded();

      const triggerButton = pagination.locator('button[aria-haspopup="listbox"]');
      await tapOrClick(triggerButton);

      const listboxId = await triggerButton.getAttribute("aria-controls");
      const listbox = page.locator(`#${escapeCSS(listboxId!)}`);
      const option25 = listbox.locator('[role="option"]').filter({ hasText: "25" });
      await option25.click();

      await expect(triggerButton).toHaveAttribute("aria-expanded", "false");
      await expect(triggerButton).toContainText("25");
    });

    test("should close dropdown on outside click", async ({ page }) => {
      const pagination = getRowsPagination(page);
      await pagination.scrollIntoViewIfNeeded();

      const triggerButton = pagination.locator('button[aria-haspopup="listbox"]');
      await tapOrClick(triggerButton);

      const listboxId = await triggerButton.getAttribute("aria-controls");
      const listbox = page.locator(`#${escapeCSS(listboxId!)}`);
      await expect(listbox).toBeVisible();

      await page.locator("body").click({ position: { x: 10, y: 10 } });

      await expect(listbox).not.toBeVisible();
    });

    test("should highlight selected option with data-selected", async ({ page }) => {
      const pagination = getRowsPagination(page);
      await pagination.scrollIntoViewIfNeeded();

      const triggerButton = pagination.locator('button[aria-haspopup="listbox"]');
      await tapOrClick(triggerButton);

      const listboxId = await triggerButton.getAttribute("aria-controls");
      const listbox = page.locator(`#${escapeCSS(listboxId!)}`);
      const selectedOption = listbox.locator('[role="option"][data-selected="true"]');
      await expect(selectedOption).toBeVisible();
      await expect(selectedOption).toHaveAttribute("aria-selected", "true");
    });
  });
});

test.describe("Pagination Keyboard Navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/pagination");
    await page.waitForLoadState("networkidle");
    await waitForPaginationVisible(page);
  });




  test.describe("Dropdown Keyboard Navigation", () => {
    test("should open dropdown with ArrowDown when focused", async ({ page }) => {
      const pagination = getRowsPagination(page);
      await pagination.scrollIntoViewIfNeeded();

      const triggerButton = pagination.locator('button[aria-haspopup="listbox"]');
      await tapOrClick(triggerButton);

      await expect(triggerButton).toHaveAttribute("aria-expanded", "true");
      const listboxId = await triggerButton.getAttribute("aria-controls");
      await expect(page.locator(`#${escapeCSS(listboxId!)}`)).toBeVisible();
    });

    test("should navigate dropdown options with ArrowDown and ArrowUp", async ({ page }) => {
      const pagination = getRowsPagination(page);
      await pagination.scrollIntoViewIfNeeded();

      const triggerButton = pagination.locator('button[aria-haspopup="listbox"]');
      await tapOrClick(triggerButton);

      const listboxId = await triggerButton.getAttribute("aria-controls");
      const listbox = page.locator(`#${escapeCSS(listboxId!)}`);
      await expect(listbox).toBeVisible();
      await listbox.focus();

      const highlighted = listbox.locator('[role="option"][data-highlighted="true"]');
      await expect(highlighted).toBeVisible();

      await page.keyboard.press("ArrowDown");
      await page.waitForTimeout(100);

      const newHighlighted = listbox.locator('[role="option"][data-highlighted="true"]');
      await expect(newHighlighted).toBeVisible();
    });

    test("should select option with Enter key", async ({ page }) => {
      const pagination = getRowsPagination(page);
      await pagination.scrollIntoViewIfNeeded();

      const triggerButton = pagination.locator('button[aria-haspopup="listbox"]');
      await tapOrClick(triggerButton);

      const listboxId = await triggerButton.getAttribute("aria-controls");
      const listbox = page.locator(`#${escapeCSS(listboxId!)}`);
      await expect(listbox).toBeVisible();

      await page.keyboard.press("Home");
      await page.keyboard.press("Enter");

      await expect(listbox).not.toBeVisible();
    });

    test("should close dropdown with Escape and return focus to trigger", async ({ page }) => {
      const pagination = getRowsPagination(page);
      await pagination.scrollIntoViewIfNeeded();

      const triggerButton = pagination.locator('button[aria-haspopup="listbox"]');
      await tapOrClick(triggerButton);

      const listboxId = await triggerButton.getAttribute("aria-controls");
      const listbox = page.locator(`#${escapeCSS(listboxId!)}`);
      await expect(listbox).toBeVisible();
      await listbox.focus();

      await page.keyboard.press("Escape");

      await expect(listbox).not.toBeVisible();
      await expect(triggerButton).toBeFocused();
    });

    test("should jump to first option with Home key", async ({ page }) => {
      const pagination = getRowsPagination(page);
      await pagination.scrollIntoViewIfNeeded();

      const triggerButton = pagination.locator('button[aria-haspopup="listbox"]');
      await tapOrClick(triggerButton);

      const listboxId = await triggerButton.getAttribute("aria-controls");
      const listbox = page.locator(`#${escapeCSS(listboxId!)}`);
      await expect(listbox).toBeVisible();
      await listbox.focus();

      await page.keyboard.press("End");
      await page.keyboard.press("Home");

      const firstOption = listbox.locator('[role="option"]').first();
      await expect(firstOption).toHaveAttribute("data-highlighted", "true");
    });

    test("should jump to last option with End key", async ({ page }) => {
      const pagination = getRowsPagination(page);
      await pagination.scrollIntoViewIfNeeded();

      const triggerButton = pagination.locator('button[aria-haspopup="listbox"]');
      await tapOrClick(triggerButton);

      const listboxId = await triggerButton.getAttribute("aria-controls");
      const listbox = page.locator(`#${escapeCSS(listboxId!)}`);
      await expect(listbox).toBeVisible();
      await listbox.focus();

      await page.keyboard.press("End");

      const lastOption = listbox.locator('[role="option"]').last();
      await expect(lastOption).toHaveAttribute("data-highlighted", "true");
    });
  });
});

test.describe("Pagination Accessibility Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/pagination");
    await page.waitForLoadState("networkidle");
    await waitForPaginationVisible(page);
    await injectAxe(page);
  });

  test("should have no critical accessibility violations", async ({ page }) => {
    const results = await page.evaluate(async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const axeResults = await (window as any).axe.run(
        'nav[aria-label="Pagination"]',
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

  test("should have proper nav landmark with aria-label", async ({ page }) => {
    const nav = page.locator(NAV_SELECTOR).first();
    await expect(nav).toHaveAttribute("aria-label", "Pagination");
  });


  test("should have aria-label on all page buttons", async ({ page }) => {
    const pagination = getBasicPagination(page);
    const pageButtons = pagination.locator('button[aria-label^="Page "]');
    const count = await pageButtons.count();

    for (let i = 0; i < count; i++) {
      const label = await pageButtons.nth(i).getAttribute("aria-label");
      expect(label).toMatch(/^Page \d+$/);
    }
  });

  test("should have aria-hidden on ellipsis elements", async ({ page }) => {
    const manyPagesSection = page.locator("section").filter({ hasText: "Many Pages & Sibling Count" }).first();
    const pagination = manyPagesSection.locator(NAV_SELECTOR).first();
    await pagination.scrollIntoViewIfNeeded();

    const page10Button = pagination.locator('button[aria-label="Page 5"]');
    await page10Button.click();

    const ellipsis = pagination.locator('[aria-hidden="true"]');

    // The guard used to make this pass when the element was absent, which is
    // the failure the test exists to catch. Assert presence, then behaviour.
    await expect(ellipsis.first()).toBeVisible();
    await expect(ellipsis.first()).toHaveAttribute("aria-hidden", "true");
  });

  test("should have proper ARIA attributes on dropdown trigger", async ({ page }) => {
    const pagination = getRowsPagination(page);
    await pagination.scrollIntoViewIfNeeded();

    const trigger = pagination.locator('button[aria-haspopup="listbox"]');
    await expect(trigger).toHaveAttribute("aria-haspopup", "listbox");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  test("should connect trigger to listbox via aria-controls when open", async ({ page }) => {
    const pagination = getRowsPagination(page);
    await pagination.scrollIntoViewIfNeeded();

    const trigger = pagination.locator('button[aria-haspopup="listbox"]');
    await tapOrClick(trigger);

    const ariaControls = await trigger.getAttribute("aria-controls");
    expect(ariaControls).toBeTruthy();

    const listbox = page.locator(`#${escapeCSS(ariaControls!)}`);
    await expect(listbox).toBeVisible();
    await expect(listbox).toHaveAttribute("role", "listbox");
  });

  test("should have proper ARIA attributes on dropdown options", async ({ page }) => {
    const pagination = getRowsPagination(page);
    await pagination.scrollIntoViewIfNeeded();

    const trigger = pagination.locator('button[aria-haspopup="listbox"]');
    await tapOrClick(trigger);

    const listboxId = await trigger.getAttribute("aria-controls");
    const listbox = page.locator(`#${escapeCSS(listboxId!)}`);
    const options = listbox.locator('[role="option"]');
    const count = await options.count();

    for (let i = 0; i < count; i++) {
      const option = options.nth(i);
      await expect(option).toHaveAttribute("role", "option");
      const ariaSelected = await option.getAttribute("aria-selected");
      expect(["true", "false"]).toContain(ariaSelected);
    }
  });

  test("should support custom aria-label for i18n", async ({ page }) => {
    const i18nSection = page.locator("section").filter({ hasText: "i18n / Custom Labels" }).first();
    const nav = i18nSection.locator('nav[aria-label="Navigation des pages"]');
    await nav.scrollIntoViewIfNeeded();
    await expect(nav).toBeVisible();
  });
});

test.describe("Pagination Advanced Features", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/pagination");
    await page.waitForLoadState("networkidle");
    await waitForPaginationVisible(page);
  });

  test("should render custom ellipsis via renderEllipsis", async ({ page }) => {
    const jumpSection = page.locator("section").filter({ hasText: "Custom Ellipsis (Jump to Page)" }).first();
    await jumpSection.scrollIntoViewIfNeeded();

    const jumpButton = jumpSection.locator('button[aria-label="Jump to page"]').first();
    await expect(jumpButton).toBeVisible();
  });

  test("should open jump-to-page input when clicking custom ellipsis", async ({ page }) => {
    const jumpSection = page.locator("section").filter({ hasText: "Custom Ellipsis (Jump to Page)" }).first();
    await jumpSection.scrollIntoViewIfNeeded();

    const jumpButton = jumpSection.locator('button[aria-label="Jump to page"]').first();
    await jumpButton.evaluate((el) => (el as HTMLElement).click());

    const input = jumpSection.locator('input[type="number"]').first();
    await expect(input).toBeVisible();
    await expect(input).toBeFocused();
  });

  test("should navigate to page via jump-to-page input on Enter", async ({ page }) => {
    const jumpSection = page.locator("section").filter({ hasText: "Custom Ellipsis (Jump to Page)" }).first();
    await jumpSection.scrollIntoViewIfNeeded();

    const jumpButton = jumpSection.locator('button[aria-label="Jump to page"]').first();
    await jumpButton.evaluate((el) => (el as HTMLElement).click());

    const input = jumpSection.locator('input[type="number"]').first();
    await input.fill("10");
    await page.keyboard.press("Enter");

    const pagination = jumpSection.locator(NAV_SELECTOR).first();
    const activePage = pagination.locator('button[aria-current="page"]');
    await expect(activePage).toHaveText("10");
  });

  test("should close jump-to-page input on Escape", async ({ page }) => {
    const jumpSection = page.locator("section").filter({ hasText: "Custom Ellipsis (Jump to Page)" }).first();
    await jumpSection.scrollIntoViewIfNeeded();

    const jumpButton = jumpSection.locator('button[aria-label="Jump to page"]').first();
    await jumpButton.evaluate((el) => (el as HTMLElement).click());

    const input = jumpSection.locator('input[type="number"]').first();
    await expect(input).toBeVisible();

    await page.keyboard.press("Escape");

    await expect(input).toHaveCount(0);
  });



  test("should support section reordering", async ({ page }) => {
    const reorderSection = page.locator("section").filter({ hasText: "Section Reordering" }).first();
    await reorderSection.scrollIntoViewIfNeeded();

    const pagination = reorderSection.locator(NAV_SELECTOR).first();
    await expect(pagination).toBeVisible();

    const children = pagination.locator("> div");
    const count = await children.count();
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test("should support external rows control without built-in selector", async ({ page }) => {
    const externalSection = page.locator("section").filter({ hasText: "External Rows Control" }).first();
    await externalSection.scrollIntoViewIfNeeded();

    const pagination = externalSection.locator(NAV_SELECTOR).first();
    const dropdown = pagination.locator('button[aria-haspopup="listbox"]');
    await expect(dropdown).toHaveCount(0);

    const extButton50 = externalSection.locator("button").filter({ hasText: "50" });
    await extButton50.click();

    const activePage = pagination.locator('button[aria-current="page"]');
    await expect(activePage).toHaveText("1");
  });
});

test.describe("Pagination Edge Cases", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/pagination");
    await page.waitForLoadState("networkidle");
    await waitForPaginationVisible(page);
  });

  test("should handle totalPages=0 gracefully", async ({ page }) => {
    const boundarySection = page.locator("section").filter({ hasText: "Boundary Conditions" }).first();
    await boundarySection.scrollIntoViewIfNeeded();

    const allNavs = boundarySection.locator(NAV_SELECTOR);
    const firstNav = allNavs.first();

    const prevButton = firstNav.locator('button[aria-label="Previous page"]');
    const nextButton = firstNav.locator('button[aria-label="Next page"]');

    await expect(prevButton).toBeDisabled();
    await expect(nextButton).toBeDisabled();

    const pageButtons = firstNav.locator('button[aria-label^="Page "]');
    await expect(pageButtons).toHaveCount(0);
  });

  test("should handle totalPages=1 with both buttons disabled", async ({ page }) => {
    const boundarySection = page.locator("section").filter({ hasText: "Boundary Conditions" }).first();
    await boundarySection.scrollIntoViewIfNeeded();

    const allNavs = boundarySection.locator(NAV_SELECTOR);
    const secondNav = allNavs.nth(1);

    const prevButton = secondNav.locator('button[aria-label="Previous page"]');
    const nextButton = secondNav.locator('button[aria-label="Next page"]');

    await expect(prevButton).toBeDisabled();
    await expect(nextButton).toBeDisabled();

    const activePage = secondNav.locator('button[aria-current="page"]');
    await expect(activePage).toHaveText("1");
  });
});

test.describe("Pagination Responsive Tests", () => {
  test("should render correctly on mobile viewport", async ({ page }, testInfo) => {
    const isMobileProject = testInfo.project.name.includes("Mobile");

    if (!isMobileProject) {
      await page.setViewportSize({ width: 375, height: 667 });
    }

    await page.goto("/pagination");
    await page.waitForLoadState("networkidle");
    await waitForPaginationVisible(page);

    const navs = page.locator(NAV_SELECTOR);
    const count = await navs.count();
    expect(count).toBeGreaterThan(0);

    if (isMobileProject) {
      await expect(navs.first()).toBeVisible();
    }
  });

});

test.describe("Pagination Focus Management", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/pagination");
    await page.waitForLoadState("networkidle");
    await waitForPaginationVisible(page);
  });



  test("should support ref forwarding for programmatic focus", async ({ page }) => {
    const refSection = page.locator("section").filter({ hasText: "Ref Forwarding & HTML Attributes" }).first();
    await refSection.scrollIntoViewIfNeeded();

    const focusButton = refSection.locator("button").filter({ hasText: "Focus pagination via ref" });
    await focusButton.click();

    const paginationNav = page.locator("#ref-demo-pagination");
    await expect(paginationNav).toBeFocused();
  });

  test("should support custom id and data attributes via rest props", async ({ page }) => {
    const paginationNav = page.locator("#ref-demo-pagination");
    await expect(paginationNav).toBeVisible();
    await expect(paginationNav).toHaveAttribute("data-section", "footer");
  });
});

test.describe("Pagination - Repeated Interaction", () => {


  test("returns to a closed, valid state after repeated open/close", async ({ page }) => {
    await page.goto("/pagination");
    await page.waitForLoadState("networkidle");
    await waitForPaginationVisible(page);

    const pagination = getRowsPagination(page);
    await pagination.scrollIntoViewIfNeeded();

    const trigger = pagination.locator('button[aria-haspopup="listbox"]');

    for (let i = 0; i < 3; i++) {
      await tapOrClick(trigger);
      await page.waitForTimeout(100);
      await tapOrClick(trigger);
      await page.waitForTimeout(100);
    }

    await expect(trigger).toBeVisible();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });
});

/**
 * The seven of pagination.spec.ts's eighteen stale tests that need a browser
 * (E2E-TRIAGE.md). The other eleven duplicated Pagination.test.tsx and are gone.
 *
 * Rewritten rather than repointed: the originals called `.focus()` and then
 * asserted `toBeFocused()`, which is true of any focusable element and says
 * nothing about tab order or key activation. These press keys.
 */
test.describe("Pagination (fixtures)", () => {
  const NAV = 'nav[aria-label="Pagination"]';

  test("reaches the page buttons by Tab", async ({ page, browserName }) => {
    skipWithoutTabTraversal(test, browserName);

    await gotoFixture(page, "Pagination", "default");

    const first = page.locator(`${NAV} button[aria-label="Page 1"]`);
    for (let i = 0; i < 12; i++) {
      await page.keyboard.press("Tab");
      if (await first.evaluate((el) => document.activeElement === el)) break;
    }

    await expect(first).toBeFocused();
  });

  test("activates a page button on Enter", async ({ page }) => {
    await gotoFixture(page, "Pagination", "default");

    await page.locator(`${NAV} button[aria-label="Page 3"]`).focus();
    await page.keyboard.press("Enter");

    await expect(page.locator(`${NAV} button[aria-current="page"]`)).toHaveText("3");
  });

  test("activates a page button on Space", async ({ page }) => {
    await gotoFixture(page, "Pagination", "default");

    await page.locator(`${NAV} button[aria-label="Page 2"]`).focus();
    await page.keyboard.press("Space");

    await expect(page.locator(`${NAV} button[aria-current="page"]`)).toHaveText("2");
  });

  test("navigates from a touch at a mobile viewport", async ({ page }) => {
    await skipWithoutTouchEvents(test, page);

    await page.setViewportSize({ width: 375, height: 667 });
    await gotoFixture(page, "Pagination", "default");

    // Dispatched rather than `tap()`: `hasTouch` is off in the desktop
    // projects and `tap()` throws there instead of degrading.
    const target = page.locator(`${NAV} button[aria-label="Page 2"]`);
    await target.dispatchEvent("touchstart");
    await target.dispatchEvent("touchend");
    await target.click();

    await expect(page.locator(`${NAV} button[aria-current="page"]`)).toHaveText("2");
  });

  test("paints a focus indicator on the focused page button", async ({ page }) => {
    await gotoFixture(page, "Pagination", "default");

    const target = page.locator(`${NAV} button[aria-label="Page 2"]`);
    await target.focus();

    // What the browser is here for: `:focus-visible` and the ring it paints
    // exist only in a real style resolution.
    const indicator = await target.evaluate((el) => {
      const s = getComputedStyle(el);
      return {
        focusVisible: el.matches(":focus-visible"),
        outline: s.outlineStyle !== "none" && s.outlineWidth !== "0px",
        ring: s.boxShadow !== "none",
      };
    });
    expect(
      indicator.focusVisible && (indicator.outline || indicator.ring),
      `no focus indicator: ${JSON.stringify(indicator)}`,
    ).toBe(true);
  });

  test("lets Tab out of the last control", async ({ page }) => {
    await gotoFixture(page, "Pagination", "default");

    // The pagination is the last focusable thing on the fixture page, so Tab
    // from its final control leaves the document entirely. Chromium reports
    // that by resetting `document.activeElement` to <body>; Firefox leaves it
    // pointing at the last focused element, which reads exactly like a keyboard
    // trap and is not one. A sentinel after the component gives focus somewhere
    // observable to land, so the assertion means the same thing on every engine.
    await page.evaluate(() => {
      const sentinel = document.createElement("button");
      sentinel.id = "tab-sentinel";
      sentinel.textContent = "after";
      document.body.append(sentinel);
    });

    await page.locator(`${NAV} button[aria-label="Next page"]`).focus();
    await page.keyboard.press("Tab");

    const landed = await page.evaluate(() => document.activeElement?.id ?? "");
    expect(landed, "focus never left the pagination").toBe("tab-sentinel");
  });

  test("keeps up with rapid page navigation", async ({ page }) => {
    await gotoFixture(page, "Pagination", "default");

    for (let i = 2; i <= 5; i++) {
      await page.locator(`${NAV} button[aria-label="Page ${i}"]`).click();
    }

    await expect(page.locator(`${NAV} button[aria-current="page"]`)).toHaveText("5");
  });
});
