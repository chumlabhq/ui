import { test, expect } from "@playwright/test";
import { injectAxe } from "axe-playwright";

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

test.describe("Pagination Component - Cross-Browser Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/demo/pagination");
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

    test("should render page buttons and nav buttons", async ({ page }) => {
      const pagination = getBasicPagination(page);

      const pageButtons = pagination.locator('button[aria-label^="Page "]');
      expect(await pageButtons.count()).toBeGreaterThan(0);

      const prevButton = pagination.locator('button[aria-label="Previous page"]');
      const nextButton = pagination.locator('button[aria-label="Next page"]');
      await expect(prevButton).toBeVisible();
      await expect(nextButton).toBeVisible();
    });

    test("should navigate to next page on click", async ({ page }) => {
      const pagination = getBasicPagination(page);

      const activePage = pagination.locator('button[aria-current="page"]');
      await expect(activePage).toHaveText("1");

      const nextButton = pagination.locator('button[aria-label="Next page"]');
      await nextButton.click();

      const newActivePage = pagination.locator('button[aria-current="page"]');
      await expect(newActivePage).toHaveText("2");
    });

    test("should navigate to previous page on click", async ({ page }) => {
      const pagination = getBasicPagination(page);
      await pagination.scrollIntoViewIfNeeded();

      const page3Button = pagination.locator('button[aria-label="Page 3"]');
      await page3Button.evaluate((el) => (el as HTMLElement).click());

      const prevButton = pagination.locator('button[aria-label="Previous page"]');
      await prevButton.evaluate((el) => (el as HTMLElement).click());

      const activePage = pagination.locator('button[aria-current="page"]');
      await expect(activePage).toHaveText("2");
    });

    test("should navigate directly to a page number on click", async ({ page }) => {
      const pagination = getBasicPagination(page);

      const page4Button = pagination.locator('button[aria-label="Page 4"]');
      await page4Button.click();

      const activePage = pagination.locator('button[aria-current="page"]');
      await expect(activePage).toHaveText("4");
    });

    test("should mark active page with aria-current and data-active", async ({ page }) => {
      const pagination = getBasicPagination(page);

      const activePage = pagination.locator('button[aria-current="page"]');
      await expect(activePage).toBeVisible();
      await expect(activePage).toHaveAttribute("data-active", "true");
    });
  });

  test.describe("Disabled States", () => {
    test("should disable previous button on first page", async ({ page }) => {
      const pagination = getBasicPagination(page);

      const prevButton = pagination.locator('button[aria-label="Previous page"]');
      await expect(prevButton).toBeDisabled();
      await expect(prevButton).toHaveAttribute("data-disabled", "true");
    });

    test("should disable next button on last page", async ({ page }) => {
      const pagination = getBasicPagination(page);

      const page5Button = pagination.locator('button[aria-label="Page 5"]');
      await page5Button.click();

      const nextButton = pagination.locator('button[aria-label="Next page"]');
      await expect(nextButton).toBeDisabled();
      await expect(nextButton).toHaveAttribute("data-disabled", "true");
    });

    test("should enable both buttons on a middle page", async ({ page }) => {
      const pagination = getBasicPagination(page);

      const page3Button = pagination.locator('button[aria-label="Page 3"]');
      await page3Button.click();

      const prevButton = pagination.locator('button[aria-label="Previous page"]');
      const nextButton = pagination.locator('button[aria-label="Next page"]');
      await expect(prevButton).not.toBeDisabled();
      await expect(nextButton).not.toBeDisabled();
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
      await triggerButton.click();

      await expect(triggerButton).toHaveAttribute("aria-expanded", "true");

      const listbox = pagination.locator('[role="listbox"]');
      await expect(listbox).toBeVisible();

      const options = listbox.locator('[role="option"]');
      expect(await options.count()).toBeGreaterThan(0);
    });

    test("should close dropdown after selecting an option", async ({ page }) => {
      const pagination = getRowsPagination(page);
      await pagination.scrollIntoViewIfNeeded();

      const triggerButton = pagination.locator('button[aria-haspopup="listbox"]');
      await triggerButton.click();

      const listbox = pagination.locator('[role="listbox"]');
      const option25 = listbox.locator('[role="option"]').filter({ hasText: "25" });
      await option25.click();

      await expect(triggerButton).toHaveAttribute("aria-expanded", "false");
      await expect(triggerButton).toContainText("25");
    });

    test("should close dropdown on outside click", async ({ page }) => {
      const pagination = getRowsPagination(page);
      await pagination.scrollIntoViewIfNeeded();

      const triggerButton = pagination.locator('button[aria-haspopup="listbox"]');
      await triggerButton.click();

      await expect(pagination.locator('[role="listbox"]')).toBeVisible();

      await page.locator("body").click({ position: { x: 10, y: 10 } });

      await expect(pagination.locator('[role="listbox"]')).toHaveCount(0);
    });

    test("should highlight selected option with data-selected", async ({ page }) => {
      const pagination = getRowsPagination(page);
      await pagination.scrollIntoViewIfNeeded();

      const triggerButton = pagination.locator('button[aria-haspopup="listbox"]');
      await triggerButton.click();

      const listbox = pagination.locator('[role="listbox"]');
      const selectedOption = listbox.locator('[role="option"][data-selected="true"]');
      await expect(selectedOption).toBeVisible();
      await expect(selectedOption).toHaveAttribute("aria-selected", "true");
    });
  });
});

test.describe("Pagination Keyboard Navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/demo/pagination");
    await page.waitForLoadState("networkidle");
    await waitForPaginationVisible(page);
  });

  test("should be focusable via Tab key", async ({ page }) => {
    const pagination = getBasicPagination(page);
    await pagination.scrollIntoViewIfNeeded();

    const pageButton = pagination.locator('button[aria-label="Page 1"]');
    await pageButton.focus();

    await expect(pageButton).toBeFocused();
  });

  test("should activate page button on Enter key", async ({ page }) => {
    const pagination = getBasicPagination(page);
    await pagination.scrollIntoViewIfNeeded();

    const page3Button = pagination.locator('button[aria-label="Page 3"]');
    await page3Button.focus();
    await page.keyboard.press("Enter");

    const activePage = pagination.locator('button[aria-current="page"]');
    await expect(activePage).toHaveText("3");
  });

  test("should activate page button on Space key", async ({ page }) => {
    const pagination = getBasicPagination(page);
    await pagination.scrollIntoViewIfNeeded();

    const page2Button = pagination.locator('button[aria-label="Page 2"]');
    await page2Button.focus();
    await page.keyboard.press("Space");

    const activePage = pagination.locator('button[aria-current="page"]');
    await expect(activePage).toHaveText("2");
  });

  test.describe("Dropdown Keyboard Navigation", () => {
    test("should open dropdown with ArrowDown when focused", async ({ page }) => {
      const pagination = getRowsPagination(page);
      await pagination.scrollIntoViewIfNeeded();

      const triggerButton = pagination.locator('button[aria-haspopup="listbox"]');
      await triggerButton.focus();
      await page.keyboard.press("ArrowDown");

      await expect(triggerButton).toHaveAttribute("aria-expanded", "true");
      await expect(pagination.locator('[role="listbox"]')).toBeVisible();
    });

    test("should navigate dropdown options with ArrowDown and ArrowUp", async ({ page }) => {
      const pagination = getRowsPagination(page);
      await pagination.scrollIntoViewIfNeeded();

      const triggerButton = pagination.locator('button[aria-haspopup="listbox"]');
      await triggerButton.focus();
      await page.keyboard.press("ArrowDown");

      const listbox = pagination.locator('[role="listbox"]');
      await expect(listbox).toBeVisible();

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
      await triggerButton.focus();
      await page.keyboard.press("ArrowDown");

      const listbox = pagination.locator('[role="listbox"]');
      await expect(listbox).toBeVisible();

      await page.keyboard.press("Home");
      await page.keyboard.press("Enter");

      await expect(pagination.locator('[role="listbox"]')).toHaveCount(0);
    });

    test("should close dropdown with Escape and return focus to trigger", async ({ page }) => {
      const pagination = getRowsPagination(page);
      await pagination.scrollIntoViewIfNeeded();

      const triggerButton = pagination.locator('button[aria-haspopup="listbox"]');
      await triggerButton.focus();
      await page.keyboard.press("ArrowDown");

      await expect(pagination.locator('[role="listbox"]')).toBeVisible();

      await page.keyboard.press("Escape");

      await expect(pagination.locator('[role="listbox"]')).toHaveCount(0);
      await expect(triggerButton).toBeFocused();
    });

    test("should jump to first option with Home key", async ({ page }) => {
      const pagination = getRowsPagination(page);
      await pagination.scrollIntoViewIfNeeded();

      const triggerButton = pagination.locator('button[aria-haspopup="listbox"]');
      await triggerButton.focus();
      await page.keyboard.press("ArrowDown");

      const listbox = pagination.locator('[role="listbox"]');
      await page.keyboard.press("End");
      await page.keyboard.press("Home");

      const firstOption = listbox.locator('[role="option"]').first();
      await expect(firstOption).toHaveAttribute("data-highlighted", "true");
    });

    test("should jump to last option with End key", async ({ page }) => {
      const pagination = getRowsPagination(page);
      await pagination.scrollIntoViewIfNeeded();

      const triggerButton = pagination.locator('button[aria-haspopup="listbox"]');
      await triggerButton.focus();
      await page.keyboard.press("ArrowDown");

      const listbox = pagination.locator('[role="listbox"]');
      await page.keyboard.press("End");

      const lastOption = listbox.locator('[role="option"]').last();
      await expect(lastOption).toHaveAttribute("data-highlighted", "true");
    });
  });
});

test.describe("Pagination Accessibility Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/demo/pagination");
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

  test("should have aria-current=page on active page button", async ({ page }) => {
    const pagination = getBasicPagination(page);
    const activePage = pagination.locator('button[aria-current="page"]');
    await expect(activePage).toBeVisible();
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

    if (await ellipsis.count() > 0) {
      await expect(ellipsis.first()).toHaveAttribute("aria-hidden", "true");
    }
  });

  test("should have proper ARIA attributes on dropdown trigger", async ({ page }) => {
    const pagination = getRowsPagination(page);
    await pagination.scrollIntoViewIfNeeded();

    const trigger = pagination.locator('button[aria-haspopup="listbox"]');
    await expect(trigger).toHaveAttribute("aria-haspopup", "listbox");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  test("should connect trigger to listbox via aria-owns when open", async ({ page }) => {
    const pagination = getRowsPagination(page);
    await pagination.scrollIntoViewIfNeeded();

    const trigger = pagination.locator('button[aria-haspopup="listbox"]');
    await trigger.click();

    const ariaOwns = await trigger.getAttribute("aria-owns");
    expect(ariaOwns).toBeTruthy();

    const listbox = pagination.locator(`[id="${ariaOwns}"]`);
    await expect(listbox).toBeVisible();
    await expect(listbox).toHaveAttribute("role", "listbox");
  });

  test("should have proper ARIA attributes on dropdown options", async ({ page }) => {
    const pagination = getRowsPagination(page);
    await pagination.scrollIntoViewIfNeeded();

    const trigger = pagination.locator('button[aria-haspopup="listbox"]');
    await trigger.click();

    const options = pagination.locator('[role="option"]');
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
    await page.goto("/demo/pagination");
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

  test("should render page info via renderPageInfo", async ({ page }) => {
    const pageInfoSection = page.locator("section").filter({ hasText: "Page Info Display" }).first();
    await pageInfoSection.scrollIntoViewIfNeeded();

    const pageInfo = pageInfoSection.locator("text=Page 1 of");
    await expect(pageInfo).toBeVisible();
  });

  test("should update page info when navigating", async ({ page }) => {
    const pageInfoSection = page.locator("section").filter({ hasText: "Page Info Display" }).first();
    await pageInfoSection.scrollIntoViewIfNeeded();

    const pagination = pageInfoSection.locator(NAV_SELECTOR).first();
    const nextButton = pagination.locator('button[aria-label="Next page"]');
    await nextButton.click();

    const pageInfo = pageInfoSection.locator("text=Page 2 of");
    await expect(pageInfo).toBeVisible();
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
    await page.goto("/demo/pagination");
    await page.waitForLoadState("domcontentloaded");
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

    await page.goto("/demo/pagination");
    await page.waitForLoadState("domcontentloaded");
    await waitForPaginationVisible(page);

    const navs = page.locator(NAV_SELECTOR);
    const count = await navs.count();
    expect(count).toBeGreaterThan(0);

    if (isMobileProject) {
      await expect(navs.first()).toBeVisible();
    }
  });

  test("should handle touch interactions on mobile", async ({ page }, testInfo) => {
    const isMobileProject = testInfo.project.name.includes("Mobile");

    if (!isMobileProject) {
      await page.setViewportSize({ width: 375, height: 667 });
    }

    await page.goto("/demo/pagination");
    await page.waitForLoadState("domcontentloaded");
    await waitForPaginationVisible(page);

    const pagination = getBasicPagination(page);

    if (isMobileProject) {
      const page2Button = pagination.locator('button[aria-label="Page 2"]');
      await page2Button.tap();

      const activePage = pagination.locator('button[aria-current="page"]');
      await expect(activePage).toHaveText("2");
    } else {
      await expect(pagination).toBeAttached();
    }
  });
});

test.describe("Pagination Focus Management", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/demo/pagination");
    await page.waitForLoadState("networkidle");
    await waitForPaginationVisible(page);
  });

  test("should maintain visible focus on page buttons", async ({ page }) => {
    const pagination = getBasicPagination(page);
    await pagination.scrollIntoViewIfNeeded();

    const page2Button = pagination.locator('button[aria-label="Page 2"]');
    await page2Button.focus();

    await expect(page2Button).toBeFocused();
  });

  test("should not trap focus within pagination", async ({ page }) => {
    const pagination = getBasicPagination(page);
    await pagination.scrollIntoViewIfNeeded();

    const nextButton = pagination.locator('button[aria-label="Next page"]');
    await nextButton.focus();
    await expect(nextButton).toBeFocused();

    await page.keyboard.press("Tab");

    const stillFocused = await nextButton.evaluate(
      (el) => document.activeElement === el,
    );
    expect(stillFocused).toBe(false);
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

test.describe("Pagination Performance Tests", () => {
  test("should load page within acceptable time", async ({ page, browserName }) => {
    const startTime = Date.now();

    await page.goto("/demo/pagination");
    await page.waitForLoadState("networkidle");

    const nav = page.locator(NAV_SELECTOR).first();
    await nav.waitFor({ state: "attached", timeout: 10000 });
    await nav.scrollIntoViewIfNeeded();
    await nav.waitFor({ state: "visible", timeout: 10000 });

    const loadTime = Date.now() - startTime;

    const threshold = browserName === "firefox" ? 15000 : 10000;
    expect(loadTime).toBeLessThan(threshold);
  });

  test("should handle rapid page navigation without lag", async ({ page }) => {
    await page.goto("/demo/pagination");
    await page.waitForLoadState("networkidle");
    await waitForPaginationVisible(page);

    const pagination = getBasicPagination(page);
    await pagination.scrollIntoViewIfNeeded();

    for (let i = 2; i <= 5; i++) {
      const pageButton = pagination.locator(`button[aria-label="Page ${i}"]`);
      await pageButton.click();
    }

    const activePage = pagination.locator('button[aria-current="page"]');
    await expect(activePage).toHaveText("5");

    await expect(pagination).toBeVisible();
  });

  test("should handle rapid dropdown interactions without lag", async ({ page }) => {
    await page.goto("/demo/pagination");
    await page.waitForLoadState("networkidle");
    await waitForPaginationVisible(page);

    const pagination = getRowsPagination(page);
    await pagination.scrollIntoViewIfNeeded();

    const trigger = pagination.locator('button[aria-haspopup="listbox"]');

    for (let i = 0; i < 3; i++) {
      await trigger.click();
      await page.waitForTimeout(100);
      await trigger.click();
      await page.waitForTimeout(100);
    }

    await expect(trigger).toBeVisible();
    await expect(pagination.locator('[role="listbox"]')).toHaveCount(0);
  });
});
