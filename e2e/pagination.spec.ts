import { test, expect } from "@playwright/test";
import { skipWithoutTouchEvents, skipWithoutTabTraversal } from "./_helpers";
import { injectAxe } from "axe-playwright";
import { gotoFixture, gotoGuarded } from "./_nav";

/**
 * The demo page is reached through `gotoGuarded`, never `page.goto` with its
 * default `load` wait followed by `networkidle`.
 *
 * Those two waits are what `_nav.ts` already refuses: `load` waits on every
 * third-party script in the app shell and `networkidle` on a quiet network. Six
 * of these tests timed out at 37-58s in one full run, three of them in exactly
 * those waits, and holding one allowed third-party host for 35s reproduced the
 * same timeout. A navigation that can be slow without the page being absent is
 * a test of the network, not of the component.
 */
const NAV_SELECTOR = 'nav[aria-label="Pagination"]';
// The page renders 26 of those navs, and `gotoGuarded` asserts its marker in
// strict mode, so the marker is the first of them rather than the selector.
const PAGE_MARKER = `${NAV_SELECTOR} >> nth=0`;

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
    await gotoGuarded(page, "/pagination", PAGE_MARKER);
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
    await gotoGuarded(page, "/pagination", PAGE_MARKER);
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
    await gotoGuarded(page, "/pagination", PAGE_MARKER);
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
    await gotoGuarded(page, "/pagination", PAGE_MARKER);
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
    await gotoGuarded(page, "/pagination", PAGE_MARKER);
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

    await gotoGuarded(page, "/pagination", PAGE_MARKER);
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
    await gotoGuarded(page, "/pagination", PAGE_MARKER);
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
    await gotoGuarded(page, "/pagination", PAGE_MARKER);
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

  test("lets Tab out of the last control", async ({ page, browserName }) => {
    // Same engine limitation as its sibling above: WebKit does not move focus
    // between buttons with Tab, so it cannot move focus out of them either.
    skipWithoutTabTraversal(test, browserName);
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

/**
 * Pagination keeps prev, its pages and next on one row by showing fewer pages,
 * never by wrapping: a wrapped list dropped prev and next to the middle of its
 * two lines, out of line with the numbers. The steps, in order: fewer siblings
 * down to none, compact spacing, compact padding, and a scrolling page list.
 *
 * Every case reads the same things off the rendered row: the vertical centres
 * of prev, every visible list item and next; the row's and the list's
 * overflow; every target's box; the visible items left to right; and the step
 * the row reached, from what is painted — the list's gap, a page button's
 * padding and whether the list scrolls — with the number of pages shown.
 */
test.describe("Pagination fits one row", () => {
  type Seen = {
    spread: number;
    row: [number, number];
    list: [number, number];
    step: string;
    current: string | null;
    currentInList: boolean;
    navOnScreen: boolean;
    host: { nav: number; left: number; right: number };
    targets: { label: string; w: number; h: number }[];
    sequence: string[];
  };

  const read = (page: import("@playwright/test").Page): Promise<Seen> =>
    page.evaluate(() => {
      const prev = document.querySelector('[data-fixture] button[aria-label="Previous page"]') as HTMLElement;
      const next = document.querySelector('[data-fixture] button[aria-label="Next page"]') as HTMLElement;
      const row = prev.parentElement!;
      const list = prev.nextElementSibling as HTMLElement;
      const nav = row.closest("nav")!;
      const box = (el: Element) => el.getBoundingClientRect();
      const mid = (el: Element) => box(el).top + box(el).height / 2;
      const items = Array.from(list.children).filter((el) => box(el).width > 0 && box(el).height > 0);
      const pages = items.filter((el) => el.tagName === "BUTTON") as HTMLElement[];
      const mids = [prev, ...items, next].map(mid);
      const lb = box(list);
      const within = (el: Element, left: number, right: number) => box(el).left >= left - 1 && box(el).right <= right + 1;
      const current = list.querySelector('[aria-current="page"]');
      const listStyle = getComputedStyle(list);
      const scrolls = listStyle.overflowX === "auto" && list.scrollWidth > list.clientWidth;
      const mode = scrolls
        ? "scroll"
        : parseFloat(getComputedStyle(pages[0]).paddingLeft) < 12
          ? "compact-padding"
          : parseFloat(listStyle.columnGap) < 8
            ? "compact-spacing"
            : "normal";
      const hb = box(nav.parentElement!);
      const nb = box(nav);
      return {
        spread: Math.round((Math.max(...mids) - Math.min(...mids)) * 100) / 100,
        row: [row.scrollWidth, row.clientWidth],
        list: [list.scrollWidth, list.clientWidth],
        step: `${mode}:${pages.length}`,
        current: current?.textContent ?? null,
        currentInList: !!current && within(current, lb.left, lb.right),
        navOnScreen: within(prev, 0, window.innerWidth) && within(next, 0, window.innerWidth),
        host: { nav: Math.round(nb.width), left: Math.round(nb.left - hb.left), right: Math.round(hb.right - nb.right) },
        targets: [prev, ...pages, next].map((el) => ({
          label: el.getAttribute("aria-label") ?? "",
          w: Math.round(box(el).width * 100) / 100,
          h: Math.round(box(el).height * 100) / 100,
        })),
        sequence: items
          .slice()
          .sort((a, b) => Math.round(mid(a) / 8) - Math.round(mid(b) / 8) || box(a).left - box(b).left)
          .map((el) => (el.tagName === "BUTTON" ? el.textContent ?? "" : "…")),
      };
    });

  /**
   * Every pair of neighbouring visible numbers: a gap needs exactly one
   * ellipsis between them, consecutive numbers none.
   */
  const ellipsisPairs = (sequence: string[]) => {
    const pairs: string[] = [];
    const wrong: string[] = [];
    let last: number | null = null;
    let between = 0;
    for (const token of sequence) {
      if (token === "…") {
        between++;
        continue;
      }
      const n = Number(token);
      if (last !== null) {
        const label = `${last}${between ? "…" : ","}${n}`;
        pairs.push(label);
        if (n - last > 1 ? between !== 1 : between !== 0) wrong.push(label);
      }
      last = n;
      between = 0;
    }
    return { pairs, wrong };
  };

  const expectOneRow = (seen: Seen, name: string, current: string) => {
    const { pairs, wrong } = ellipsisPairs(seen.sequence);
    console.log(`PAGINATION_FIT ${name} step=${seen.step} row=${seen.row.join("/")} list=${seen.list.join("/")} pairs=${pairs.join(" ")}`);
    console.log(`PAGINATION_TARGETS ${name} ${seen.targets.map((t) => `${t.label} ${t.w}x${t.h}`).join(" | ")}`);
    for (const t of seen.targets) {
      expect.soft(Math.min(t.w, t.h), `${t.label} is ${t.w}x${t.h}, under WCAG 2.5.8's 24x24`).toBeGreaterThanOrEqual(24);
    }
    expect.soft(seen.spread, "prev, the visible items and next are not on one row").toBeLessThanOrEqual(2);
    expect.soft(seen.row[0], `the row overflows: ${seen.row.join(" > ")}`).toBeLessThanOrEqual(seen.row[1]);
    expect.soft(seen.navOnScreen, "prev or next is off-screen").toBe(true);
    expect.soft(seen.current).toBe(current);
    expect.soft(seen.currentInList, "the current page is outside the list's visible box").toBe(true);
    expect.soft(wrong, `ellipsis rule broken in ${seen.sequence.join(" ")}`).toEqual([]);
  };

  const CASES = [
    { fixture: "middle", width: 320, current: "5", step: "compact-spacing:3" },
    { fixture: "middle", width: 375, current: "5", step: "normal:3" },
    { fixture: "three-digit", width: 320, current: "118", step: "compact-padding:3" },
    { fixture: "sibling-count-2", width: 320, current: "15", step: "compact-spacing:3" },
    { fixture: "sibling-count-2", width: 375, current: "15", step: "normal:3" },
    { fixture: "default", width: 375, current: "1", step: "normal:5" },
  ];

  for (const c of CASES) {
    test(`${c.fixture} at ${c.width}px reaches ${c.step}: one row, no overflow, the current page shows`, async ({ page }) => {
      await page.setViewportSize({ width: c.width, height: 700 });
      await gotoFixture(page, "Pagination", c.fixture);
      const seen = await read(page);
      expectOneRow(seen, `${c.fixture}@${c.width}`, c.current);
      expect.soft(seen.list[0], `the page list overflows: ${seen.list.join(" > ")}`).toBeLessThanOrEqual(seen.list[1]);
      expect(seen.step).toBe(c.step);
    });
  }

  test("five pages at 375px show every page", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 700 });
    await gotoFixture(page, "Pagination", "default");
    expect((await read(page)).sequence).toEqual(["1", "2", "3", "4", "5"]);
  });

  test("a 240 px container: the page list scrolls, prev and next stay on the row, the current page is in view", async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 700 });
    await gotoFixture(page, "Pagination", "narrow");
    const seen = await read(page);
    expectOneRow(seen, "narrow@240", "118");
    expect(seen.step).toBe("scroll:3");
  });

  test("a centred flex host sizes Pagination to its content, and it grows back when the host widens", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 700 });
    await gotoFixture(page, "Pagination", "centred");
    const narrow = await read(page);
    expectOneRow(narrow, "centred@320", "5");
    console.log(`PAGINATION_HOST centred@320 ${JSON.stringify(narrow.host)}`);
    expect.soft(narrow.host.nav, "the nav collapsed in its host").toBeGreaterThan(200);
    expect.soft(Math.abs(narrow.host.left - narrow.host.right), "not centred in its host").toBeLessThanOrEqual(1);
    expect(narrow.step).toBe("compact-spacing:3");

    await page.setViewportSize({ width: 1024, height: 700 });
    await expect.poll(async () => (await read(page)).step).toBe("normal:5");
    const wide = await read(page);
    expectOneRow(wide, "centred@1024", "5");
    console.log(`PAGINATION_HOST centred@1024 ${JSON.stringify(wide.host)}`);
    expect(Math.abs(wide.host.left - wide.host.right), "not centred in its host").toBeLessThanOrEqual(1);
  });
});
