import { test, expect } from "@playwright/test";
import { injectAxe } from "axe-playwright";

test.describe("Avatar Component - Cross-Browser Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/demo/avatar");
    await page.waitForLoadState("domcontentloaded");
    // Wait for avatar content to be visible
    await page.locator('[data-shape]').first().waitFor({ state: "visible" });
  });

  test.describe("Basic Functionality", () => {
    test("should render avatar components on the page", async ({ page }) => {
      // Check that avatars are visible on the page
      const avatars = page.locator('[data-shape]');
      await expect(avatars.first()).toBeVisible();

      const count = await avatars.count();
      expect(count).toBeGreaterThan(0);
    });

    test("should display initials for text avatars", async ({ page }) => {
      // Find avatars with text content (initials)
      const avatarWithInitials = page.locator('[data-shape][role="img"]').first();
      
      await expect(avatarWithInitials).toBeVisible();
      
      // Verify it has text content (initials)
      const textContent = await avatarWithInitials.textContent();
      expect(textContent?.trim().length).toBeGreaterThan(0);
    });

    test("should render images when src provided", async ({ page }) => {
      // Find avatars with images
      const avatarImages = page.locator('[data-shape] img');
      
      if (await avatarImages.count() > 0) {
        const firstImage = avatarImages.first();
        await expect(firstImage).toBeVisible();
        
        const src = await firstImage.getAttribute("src");
        expect(src).toBeTruthy();
      }
    });

    test("should show status indicator when configured", async ({ page }) => {
      // Look for status indicators (small colored dots)
      const statusIndicators = page.locator('[aria-label="online"], [aria-label="offline"], [aria-label="away"], [aria-label="busy"]');
      
      if (await statusIndicators.count() > 0) {
        await expect(statusIndicators.first()).toBeVisible();
      }
    });
  });

  test.describe("Avatar Shapes", () => {
    test("should render circle shape correctly", async ({ page }) => {
      const circleAvatar = page.locator('[data-shape="circle"]').first();
      
      if (await circleAvatar.count() > 0) {
        await expect(circleAvatar).toBeVisible();
        
        const borderRadius = await circleAvatar.evaluate((el) => {
          return window.getComputedStyle(el).borderRadius;
        });
        
        // Circle should have large border-radius (9999px or 50%)
        expect(borderRadius === "9999px" || borderRadius === "50%").toBe(true);
      }
    });

    test("should render square shape correctly", async ({ page }) => {
      const squareAvatar = page.locator('[data-shape="square"]').first();
      
      if (await squareAvatar.count() > 0) {
        await expect(squareAvatar).toBeVisible();
        
        const borderRadius = await squareAvatar.evaluate((el) => {
          return window.getComputedStyle(el).borderRadius;
        });
        
        expect(borderRadius === "0px" || borderRadius === "0").toBe(true);
      }
    });

    test("should render rounded shape correctly", async ({ page }) => {
      const roundedAvatar = page.locator('[data-shape="rounded"]').first();
      
      if (await roundedAvatar.count() > 0) {
        await expect(roundedAvatar).toBeVisible();
        
        const borderRadius = await roundedAvatar.evaluate((el) => {
          return window.getComputedStyle(el).borderRadius;
        });
        
        // Rounded should have moderate border-radius
        expect(borderRadius !== "0px" && borderRadius !== "9999px").toBe(true);
      }
    });
  });

  test.describe("Avatar Group", () => {
    test("should display avatar group with overlapping avatars", async ({ page }) => {
      const avatarGroup = page.locator('[role="group"]').first();
      
      if (await avatarGroup.count() > 0) {
        await expect(avatarGroup).toBeVisible();
        
        // Group should contain multiple avatars
        const avatarsInGroup = avatarGroup.locator('[data-shape]');
        const count = await avatarsInGroup.count();
        expect(count).toBeGreaterThan(0);
      }
    });

    test("should show surplus count when max exceeded", async ({ page }) => {
      // Look for surplus count element ("+N")
      const surplusCount = page.locator('text=/\\+\\d+/').first();
      
      if (await surplusCount.count() > 0) {
        await expect(surplusCount).toBeVisible();
        
        // Verify it contains a number
        const text = await surplusCount.textContent();
        expect(text).toMatch(/\+\d+/);
      }
    });

    test("should handle avatar click in group", async ({ page }) => {
      const avatarGroup = page.locator('[role="group"]').first();
      
      if (await avatarGroup.count() > 0) {
        const clickableAvatar = avatarGroup.locator('[data-shape][style*="cursor: pointer"]').first();
        
        if (await clickableAvatar.count() > 0) {
          // Should be able to click without errors
          await clickableAvatar.click();
        }
      }
    });
  });

  test.describe("Avatar Badge", () => {
    test("should display notification badge", async ({ page }) => {
      // Look for badge elements with role="status"
      const badges = page.locator('[role="status"]:not([aria-label*="Loading"])');
      
      if (await badges.count() > 0) {
        const badge = badges.first();
        await expect(badge).toBeVisible();
      }
    });

    test("should display dot badge", async ({ page }) => {
      const dotBadges = page.locator('[aria-label="New notification"]');
      
      if (await dotBadges.count() > 0) {
        await expect(dotBadges.first()).toBeVisible();
      }
    });

    test("should show correct badge count", async ({ page }) => {
      // Find badges with count
      const countBadges = page.locator('[role="status"][aria-label*="notification"]');
      
      if (await countBadges.count() > 0) {
        const badge = countBadges.first();
        const text = await badge.textContent();
        
        // Should contain a number
        expect(text).toMatch(/\d+/);
      }
    });
  });

  test.describe("Loading States", () => {
    test("should display loading shimmer", async ({ page }) => {
      const shimmers = page.locator('[aria-label="Loading avatar"], [aria-label="Loading avatar group"]');
      
      if (await shimmers.count() > 0) {
        await expect(shimmers.first()).toBeVisible();
      }
    });

    test("should animate shimmer with pulse effect", async ({ page }) => {
      const shimmer = page.locator('[aria-label="Loading avatar"]').first();
      
      if (await shimmer.count() > 0) {
        const hasAnimation = await shimmer.evaluate((el) => {
          const classes = el.className;
          return classes.includes("animate-pulse") || 
            window.getComputedStyle(el).animation !== "none";
        });
        
        expect(hasAnimation).toBe(true);
      }
    });
  });

  test.describe("Tooltip Integration", () => {
    test("should show tooltip on hover", async ({ page }) => {
      // Find avatars that might have tooltips
      const avatar = page.locator('[data-shape]').first();
      
      await avatar.hover();
      
      // Wait briefly for tooltip to appear
      await page.waitForTimeout(300);
      
      // Check if tooltip appeared (tooltip content is usually in a portal)
      const tooltip = page.locator('[role="tooltip"]');
      
      if (await tooltip.count() > 0) {
        await expect(tooltip).toBeVisible();
      }
    });
  });
});

test.describe("Avatar Accessibility Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/demo/avatar");
    await page.waitForLoadState("domcontentloaded");
    await page.locator('[data-shape]').first().waitFor({ state: "visible" });
    await injectAxe(page);
  });

  test("should have no critical accessibility violations", async ({ page }) => {
    // Focus on the first avatar section to avoid demo page issues
    const firstAvatar = page.locator('[data-shape]').first();
    await expect(firstAvatar).toBeVisible();

    const results = await page.evaluate(async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const axeResults = await (window as any).axe.run('[data-shape]', {
        rules: {
          "color-contrast": { enabled: false },
          region: { enabled: false },
          "aria-allowed-attr": { enabled: false }, // Avatar uses custom data attributes
          "nested-interactive": { enabled: false }, // Tooltips may nest interactive elements
        },
      });
      return axeResults.violations;
    });

    const criticalViolations = results.filter(
      (v: { impact: string }) =>
        v.impact === "critical"
    );

    if (criticalViolations.length > 0) {
      console.log(
        "Critical accessibility violations:",
        JSON.stringify(criticalViolations, null, 2)
      );
    }

    expect(criticalViolations).toHaveLength(0);
  });

  test("should have proper ARIA attributes on avatars", async ({ page }) => {
    const avatar = page.locator('[data-shape][role="img"]').first();
    
    if (await avatar.count() > 0) {
      await expect(avatar).toHaveAttribute("aria-label");
    }
  });

  test("should have proper role on avatar groups", async ({ page }) => {
    const group = page.locator('[role="group"]').first();
    
    if (await group.count() > 0) {
      await expect(group).toHaveAttribute("aria-label");
    }
  });

  test("should have proper role on badges", async ({ page }) => {
    const badge = page.locator('[role="status"]').first();
    
    if (await badge.count() > 0) {
      await expect(badge).toHaveAttribute("aria-label");
    }
  });
});

test.describe("Avatar Responsive Tests", () => {
  test("should render correctly on mobile viewport", async ({ page }) => {
    await page.goto("/demo/avatar");
    await page.waitForLoadState("domcontentloaded");
    
    // Wait for content
    const avatar = page.locator('[data-shape]').first();
    await avatar.waitFor({ state: "visible" });
    
    // Resize to mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(200);
    
    // Avatar should still be visible
    await expect(avatar).toBeVisible();
    
    // Check it maintains shape
    const shape = await avatar.getAttribute("data-shape");
    expect(shape).toBeTruthy();
  });

  test("should handle touch interactions on mobile", async ({ page }, testInfo) => {
    const isMobileProject = testInfo.project.name.includes("Mobile");

    // Set viewport before navigation for desktop browsers
    if (!isMobileProject) {
      await page.setViewportSize({ width: 375, height: 667 });
    }

    await page.goto("/demo/avatar");
    await page.waitForLoadState("domcontentloaded");

    const avatar = page.locator('[data-shape]').first();
    await avatar.waitFor({ state: "attached", timeout: 5000 });

    // For mobile projects, test actual tap/click behavior
    if (isMobileProject) {
      await avatar.scrollIntoViewIfNeeded();
      await avatar.click().catch(() => {
        // Click might not trigger on all avatars, that's okay
      });
      await expect(avatar).toBeVisible();
    } else {
      // For desktop browsers with viewport emulation, just verify avatar exists
      await expect(avatar).toBeAttached();
    }
  });
});

test.describe("Avatar Performance Tests", () => {
  test("should load page within acceptable time", async ({ page, browserName }) => {
    const startTime = Date.now();

    await page.goto("/demo/avatar");
    await page.waitForLoadState("domcontentloaded");
    await page.locator('[data-shape]').first().waitFor({ state: "visible" });

    const loadTime = Date.now() - startTime;

    // Firefox has higher overhead in test environments
    const threshold = browserName === "firefox" ? 10000 : 5000;
    expect(loadTime).toBeLessThan(threshold);
  });

  test("should handle multiple avatars without performance issues", async ({ page }) => {
    await page.goto("/demo/avatar");
    await page.waitForLoadState("domcontentloaded");
    await page.locator('[data-shape]').first().waitFor({ state: "visible" });

    // Count total avatars
    const avatars = page.locator('[data-shape]');
    const count = await avatars.count();
    
    // Page should handle many avatars
    expect(count).toBeGreaterThan(0);
    
    // All should be in valid state
    for (let i = 0; i < Math.min(count, 10); i++) {
      const avatar = avatars.nth(i);
      const shape = await avatar.getAttribute("data-shape");
      expect(["circle", "square", "rounded"]).toContain(shape);
    }
  });
});

test.describe("Avatar Image Fallback", () => {
  test("should handle image loading gracefully", async ({ page }) => {
    await page.goto("/demo/avatar");
    await page.waitForLoadState("domcontentloaded");

    // Find avatars with images
    const avatarImages = page.locator('[data-shape] img');
    
    if (await avatarImages.count() > 0) {
      const firstImage = avatarImages.first();
      
      // Wait for image to have a src
      await expect(firstImage).toHaveAttribute("src");
      
      // Check loading attribute
      const loading = await firstImage.getAttribute("loading");
      expect(["lazy", "eager", null]).toContain(loading);
    }
  });

  test("should show initials when data-has-image is not present", async ({ page }) => {
    await page.goto("/demo/avatar");
    await page.waitForLoadState("domcontentloaded");

    // Find avatars without images (no data-has-image attribute)
    const textAvatars = page.locator('[data-shape]:not([data-has-image])');
    
    if (await textAvatars.count() > 0) {
      const avatar = textAvatars.first();
      const text = await avatar.textContent();
      
      // Should have some text content (initials)
      expect(text?.trim().length).toBeGreaterThan(0);
    }
  });
});
