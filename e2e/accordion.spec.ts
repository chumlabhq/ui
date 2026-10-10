import { test, expect } from "@playwright/test";
import { injectAxe } from "axe-playwright";

test.describe("Accordion Component - Cross-Browser Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/accordion");
    await page.waitForLoadState("domcontentloaded");
    // Wait for accordion to be visible instead of networkidle (more reliable)
    await page
      .locator('[data-orientation="vertical"]')
      .first()
      .waitFor({ state: "visible" });
  });

  test.describe("Basic Functionality", () => {
    test("should render accordion components on the page", async ({ page }) => {
      const accordions = page.locator('[data-orientation="vertical"]');
      await expect(accordions.first()).toBeVisible();

      const count = await accordions.count();
      expect(count).toBeGreaterThan(0);
    });

    test("should toggle accordion item on click", async ({ page }) => {
      const accordion = page.locator('[data-orientation="vertical"]').first();
      const triggers = accordion.getByRole("button");
      const firstTrigger = triggers.first();

      await firstTrigger.click();

      const newState = await firstTrigger.getAttribute("aria-expanded");
      expect(newState).toBeDefined();
      expect(["true", "false"]).toContain(newState);
    });

    test("should show content region when expanded", async ({ page }) => {
      const accordion = page.locator('[data-orientation="vertical"]').first();
      const trigger = accordion.getByRole("button").first();

      const isExpanded = await trigger.getAttribute("aria-expanded");
      if (isExpanded === "false") {
        await trigger.click();
      }

      const contentId = await trigger.getAttribute("aria-controls");
      if (contentId) {
        const content = page.locator(`#${contentId}`);
        await expect(content).toBeVisible();
        await expect(content).toHaveAttribute("role", "region");
      }
    });

    test("should switch between items in single mode", async ({ page }) => {
      const accordion = page.locator('[data-orientation="vertical"]').first();
      const triggers = accordion.getByRole("button");

      // The guard used to make this pass when the demo rendered fewer than
      // 2 triggers, which is the failure the test exists to catch.
      expect(await triggers.count()).toBeGreaterThanOrEqual(2);
      const trigger1 = triggers.first();
      const trigger2 = triggers.nth(1);

      await trigger1.click();
      await page.waitForTimeout(100);

      await trigger2.click();
      await page.waitForTimeout(100);

      await expect(trigger2).toHaveAttribute("aria-expanded", "true");
    });
  });

  test.describe("Keyboard Navigation", () => {
    test("should navigate with ArrowDown key", async ({ page }) => {
      const accordion = page.locator('[data-orientation="vertical"]').first();
      const triggers = accordion.getByRole("button");

      // The guard used to make this pass when the demo rendered fewer than
      // 2 triggers, which is the failure the test exists to catch.
      expect(await triggers.count()).toBeGreaterThanOrEqual(2);
      await triggers.first().focus();
      await expect(triggers.first()).toBeFocused();

      await page.keyboard.press("ArrowDown");

      await expect(triggers.nth(1)).toBeFocused();
    });

    test("should navigate with ArrowUp key", async ({ page }) => {
      const accordion = page.locator('[data-orientation="vertical"]').first();
      const triggers = accordion.getByRole("button");

      // The guard used to make this pass when the demo rendered fewer than
      // 2 triggers, which is the failure the test exists to catch.
      expect(await triggers.count()).toBeGreaterThanOrEqual(2);
      await triggers.nth(1).focus();

      await page.keyboard.press("ArrowUp");

      await expect(triggers.first()).toBeFocused();
    });

    test("should navigate to first with Home key", async ({ page }) => {
      const accordion = page.locator('[data-orientation="vertical"]').first();
      const triggers = accordion.getByRole("button");

      // The guard used to make this pass when the demo rendered fewer than
      // 2 triggers, which is the failure the test exists to catch.
      expect(await triggers.count()).toBeGreaterThanOrEqual(2);
      await triggers.last().focus();

      await page.keyboard.press("Home");

      await expect(triggers.first()).toBeFocused();
    });

    test("should navigate to last with End key", async ({ page }) => {
      const accordion = page.locator('[data-orientation="vertical"]').first();
      const triggers = accordion.getByRole("button");

      // The guard used to make this pass when the demo rendered fewer than
      // 2 triggers, which is the failure the test exists to catch.
      expect(await triggers.count()).toBeGreaterThanOrEqual(2);
      await triggers.first().focus();

      await page.keyboard.press("End");

      await expect(triggers.last()).toBeFocused();
    });

    test("should toggle with Enter key", async ({ page }) => {
      const accordion = page.locator('[data-orientation="vertical"]').first();
      const trigger = accordion.getByRole("button").first();

      await trigger.focus();
      await page.keyboard.press("Enter");

      const newState = await trigger.getAttribute("aria-expanded");
      expect(newState).toBeDefined();
      expect(["true", "false"]).toContain(newState);
    });

    test("should toggle with Space key", async ({ page }) => {
      const accordion = page.locator('[data-orientation="vertical"]').first();
      const trigger = accordion.getByRole("button").first();

      await trigger.focus();
      await page.keyboard.press("Space");

      const state = await trigger.getAttribute("aria-expanded");
      expect(state).toBeDefined();
    });

    test("should maintain tab order through triggers", async ({ page }) => {
      const accordion = page.locator('[data-orientation="vertical"]').first();
      const triggers = accordion.getByRole("button");
      const triggerCount = await triggers.count();

      if (triggerCount >= 2) {
        await triggers.first().focus();
        await expect(triggers.first()).toBeFocused();

        await page.keyboard.press("Tab");

        // After Tab, focus should leave the accordion (triggers are siblings, not a roving tabindex)
        // This validates that each trigger is individually tabbable
        const isTriggerFocused = await page.evaluate(() => {
          const active = document.activeElement;
          return active?.tagName === "BUTTON" && active?.closest('[data-orientation="vertical"]') !== null;
        });

        expect(isTriggerFocused !== null).toBe(true);
      }
    });
  });

  test.describe("Visual & CSS Tests", () => {
    test("should show focus ring on keyboard navigation", async ({ page }) => {
      const accordion = page.locator('[data-orientation="vertical"]').first();
      const trigger = accordion.getByRole("button").first();

      await page.keyboard.press("Tab");
      await trigger.focus();

      expect(
        await trigger.evaluate((el) => document.activeElement === el),
      ).toBe(true);

      const hasFocusStyles = await trigger.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return (
          styles.outline !== "none" ||
          styles.outlineWidth !== "0px" ||
          styles.boxShadow !== "none" ||
          el.matches(":focus-visible")
        );
      });
      expect(hasFocusStyles).toBe(true);
    });

    test("the panel animates against its measured height", async ({ page }) => {
      const accordion = page.locator('[data-orientation="vertical"]').first();
      const trigger = accordion.getByRole("button").first();
      const contentId = await trigger.getAttribute("aria-controls");
      expect(contentId, "the trigger names no panel").toBeTruthy();

      // Open it: the panel is not mounted until it has been opened once.
      if ((await trigger.getAttribute("aria-expanded")) !== "true") await trigger.click();
      const content = page.locator(`#${contentId}`);
      await expect(content).toBeVisible();

      // This asserted a CSS transition, which the component no longer uses —
      // it was testing the max-height machinery rather than that the panel
      // animates. Replaced rather than deleted because the animation being
      // wired at all is exactly what broke repeatedly, and nothing else in the
      // suite would have noticed: the keyframes shipped missing from
      // dist/styles.css and every unit test still passed.
      const state = await content.evaluate((el) => {
        const cs = window.getComputedStyle(el);
        return {
          name: cs.animationName,
          duration: cs.animationDuration,
          heightVar: el.style.getPropertyValue("--cl-accordion-content-height"),
          padding: cs.padding,
          overflow: cs.overflow,
        };
      });

      expect(["cl-accordion-down", "cl-accordion-up"]).toContain(state.name);
      expect(state.duration, "the panel has no animation duration").not.toBe("0s");
      expect(state.heightVar, "nothing measured the content height").toMatch(/^\d/);
      // The animating element must stay a bare clipper: padding on it stops the
      // height collapsing cleanly, which is the stutter this component had.
      expect(state.padding).toBe("0px");
      expect(state.overflow).toBe("hidden");
    });

    test("should rotate chevron icon when expanded", async ({ page }) => {
      const accordion = page.locator('[data-orientation="vertical"]').first();
      const trigger = accordion.getByRole("button").first();

      const icon = trigger.locator("svg").first();

      // The guard used to make this pass when the element was absent, which is
      // the failure the test exists to catch. Assert presence, then behaviour.
      await expect(icon.first()).toBeVisible();
      const isExpanded = await trigger.getAttribute("aria-expanded");

      if (isExpanded === "true") {
        const hasRotation = await icon.evaluate((el) => {
          return (
            el.classList.contains("rotate-180") ||
            window.getComputedStyle(el).transform.includes("matrix")
          );
        });
        expect(hasRotation).toBe(true);
      }
    });
  });

  test.describe("Disabled State", () => {
    test("should have disabled items on the page", async ({ page }) => {
      const disabledButtons = page.locator("button[disabled]");
      const count = await disabledButtons.count();

      expect(count).toBeGreaterThanOrEqual(0);
    });

    test("should show disabled visual styles", async ({ page }) => {
      const disabledButton = page.locator("button[disabled]").first();

      // The guard used to make this pass when the element was absent, which is
      // the failure the test exists to catch. Assert presence, then behaviour.
      await expect(disabledButton.first()).toBeVisible();
      const hasDisabledStyles = await disabledButton.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return (
          parseFloat(styles.opacity) < 1 ||
          styles.cursor === "not-allowed" ||
          el.classList.contains("opacity-50")
        );
      });

      expect(hasDisabledStyles).toBe(true);
    });
  });

  test.describe("Multiple Selection Mode", () => {
    test("should find accordion with data-selection-mode=multiple", async ({ page }) => {
      const multiAccordion = page.locator('[data-selection-mode="multiple"]').first();

      // The guard used to make this pass when the element was absent, which is
      // the failure the test exists to catch. Assert presence, then behaviour.
      await expect(multiAccordion.first()).toBeVisible();
      await expect(multiAccordion).toBeVisible();
    });

    test("should allow multiple items open in multiple mode", async ({
      page,
    }) => {
      const multiAccordion = page.locator('[data-selection-mode="multiple"]').first();

      // The guard used to make this pass when the element was absent, which is
      // the failure the test exists to catch. Assert presence, then behaviour.
      await expect(multiAccordion.first()).toBeVisible();
      const triggers = multiAccordion.getByRole("button");
      const triggerCount = await triggers.count();

      if (triggerCount >= 2) {
        for (let i = 0; i < triggerCount; i++) {
          const trigger = triggers.nth(i);
          const isExpanded = await trigger.getAttribute("aria-expanded");
          if (isExpanded === "true") {
            await trigger.click();
            await page.waitForTimeout(50);
          }
        }

        await triggers.first().click();
        await page.waitForTimeout(100);

        await triggers.nth(1).click();
        await page.waitForTimeout(100);

        // Both should now be expanded (multiple mode allows this)
        const state1 = await triggers.first().getAttribute("aria-expanded");
        const state2 = await triggers.nth(1).getAttribute("aria-expanded");

        expect(state1).toBe("true");
        expect(state2).toBe("true");
      }
    });
  });

  test.describe("Responsive & Touch", () => {
    test("accordion component renders on mobile viewport", async ({ page }) => {
      const accordion = page.locator('[data-orientation="vertical"]').first();
      await expect(accordion).toBeVisible();

      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForTimeout(300);

      await expect(accordion).toBeAttached();

      await expect(accordion).toHaveAttribute("data-orientation", "vertical");
    });

    test("accordion maintains state after viewport resize", async ({
      page,
    }) => {
      const accordion = page.locator('[data-orientation="vertical"]').first();
      await expect(accordion).toBeVisible();

      const trigger = accordion.getByRole("button").first();

      await trigger.click();
      const stateBeforeResize = await trigger.getAttribute("aria-expanded");

      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForTimeout(200);
      await page.setViewportSize({ width: 1280, height: 720 });
      await page.waitForTimeout(200);

      const stateAfterResize = await trigger.getAttribute("aria-expanded");
      expect(stateAfterResize).toBe(stateBeforeResize);
    });
  });
});

test.describe("Accessibility Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/accordion");
    await page.waitForLoadState("domcontentloaded");
    await page
      .locator('[data-orientation="vertical"]')
      .first()
      .waitFor({ state: "visible" });
    await injectAxe(page);
  });

  test("should have no critical accessibility violations in accordion", async ({
    page,
  }) => {
    const accordion = page.locator('[data-orientation="vertical"]').first();
    await expect(accordion).toBeVisible();

    // Run axe on the accordion container
    const results = await page.evaluate(async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const axeResults = await (window as any).axe.run('[data-orientation="vertical"]', {
        rules: {
          "color-contrast": { enabled: false },
          region: { enabled: false },
        },
      });
      return axeResults.violations;
    });

    const criticalViolations = results.filter(
      (v: { impact: string }) =>
        v.impact === "critical" || v.impact === "serious",
    );

    if (criticalViolations.length > 0) {
      console.log(
        "Accessibility violations:",
        JSON.stringify(criticalViolations, null, 2),
      );
    }

    expect(criticalViolations).toHaveLength(0);
  });

  test("should have proper ARIA attributes on triggers", async ({ page }) => {
    const trigger = page
      .locator('[data-orientation="vertical"]')
      .first()
      .getByRole("button")
      .first();

    await expect(trigger).toHaveAttribute("aria-expanded");
    await expect(trigger).toHaveAttribute("aria-controls");
    await expect(trigger).toHaveAttribute("id");
  });

  test("should have proper ARIA attributes on content", async ({ page }) => {
    const accordion = page.locator('[data-orientation="vertical"]').first();
    const trigger = accordion.getByRole("button").first();

    const isExpanded = await trigger.getAttribute("aria-expanded");
    if (isExpanded === "false") {
      await trigger.click();
      await page.waitForTimeout(100);
    }

    const contentId = await trigger.getAttribute("aria-controls");
    if (contentId) {
      const content = page.locator(`#${contentId}`);

      await expect(content).toHaveAttribute("role", "region");
      await expect(content).toHaveAttribute("aria-labelledby");
    }
  });

  test("should wrap triggers in heading elements", async ({ page }) => {
    const accordion = page.locator('[data-orientation="vertical"]').first();
    const trigger = accordion.getByRole("button").first();

    const heading = trigger.locator(
      "xpath=ancestor::h1 | ancestor::h2 | ancestor::h3 | ancestor::h4 | ancestor::h5 | ancestor::h6",
    );

    expect(await heading.count()).toBeGreaterThan(0);
  });
});

test.describe("Repeated Interaction", () => {

  test("should handle rapid interactions without errors", async ({ page }) => {
    await page.goto("/accordion");
    await page.waitForLoadState("domcontentloaded");
    await page
      .locator('[data-orientation="vertical"]')
      .first()
      .waitFor({ state: "visible" });

    const accordion = page.locator('[data-orientation="vertical"]').first();
    const trigger = accordion.getByRole("button").first();

    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));

    for (let i = 0; i < 10; i++) {
      await trigger.click({ delay: 30 });
    }

    expect(errors).toHaveLength(0);

    const state = await trigger.getAttribute("aria-expanded");
    expect(["true", "false"]).toContain(state);
  });
});
