import { expect, test, type Page } from "./_test";
import { gotoFixture } from "./_nav";
import { scrollUntil } from "./_helpers";

/**
 * Overlay content taller than the viewport is reachable, by keyboard and by
 * scrolling, and the page behind it stays where it was.
 *
 * Measured before the fix, in all three engines at both sizes: Modal's
 * positioner carried `fixed inset-0 overflow-y-auto relative`, `relative` won,
 * and the positioner grew to its content — a tall dialog ran from -382px to
 * 1102px with nothing to scroll. The Drawer panel is fixed at the viewport's
 * height with no overflow, so a tall body ran past it the same way. And
 * CascadingDropdown's top-level menu had no cap: 24 items made a 960px fixed
 * menu whose item 23 sat at 889-929px in a 720px window.
 */
const VIEWPORTS = [
  { width: 1280, height: 720 },
  { width: 375, height: 667 },
] as const;

/** After one frame (WebKit scrolls a focused element at its next rendering update): inside the viewport and every clipping ancestor up to the fixed layer. */
const seen = (page: Page) =>
  page.evaluate(
    () =>
      new Promise<{ label: string; visible: boolean; at: string }>((resolve) =>
        requestAnimationFrame(() => {
          const el = document.activeElement as HTMLElement;
          const a = el.getBoundingClientRect();
          let visible = a.height > 0 && a.bottom > 0 && a.top < innerHeight && a.right > 0 && a.left < innerWidth;
          for (let c = el.parentElement; c && c !== document.body && visible; c = c.parentElement) {
            const o = getComputedStyle(c);
            if (/auto|scroll|hidden/.test(o.overflowY)) {
              const r = c.getBoundingClientRect();
              visible = a.bottom > r.top && a.top < r.bottom;
            }
            if (o.position === "fixed") break;
          }
          resolve({ label: (el.textContent ?? "").trim().slice(0, 16), visible, at: `${Math.round(a.top)}..${Math.round(a.bottom)}` });
        }),
      ),
  );

const TALL = [
  { component: "Modal", fixture: "tall" },
  { component: "Drawer", fixture: "tall-left" },
  { component: "Drawer", fixture: "tall-right" },
  { component: "Drawer", fixture: "tall-top" },
  { component: "Drawer", fixture: "tall-bottom" },
] as const;

for (const vp of VIEWPORTS) {
  test.describe(`${vp.width}x${vp.height}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(vp);
    });

    for (const t of TALL) {
      test(`${t.component}/${t.fixture}: the last control is reached by Tab and by scrolling, and the page stays put`, async ({ page }) => {
        await gotoFixture(page, t.component, t.fixture);
        const last = page.getByRole("button", { name: "Last action" });
        await expect(last).toBeAttached();

        let s = await seen(page);
        for (let i = 0; i < 12 && s.label !== "Last action"; i++) {
          await page.keyboard.press("Tab");
          s = await seen(page);
        }
        console.log(`OVERLAY_REACH ${vp.width}x${vp.height} ${t.component}/${t.fixture} tab: "${s.label}" at ${s.at} visible=${s.visible}`);
        expect(s.label, "Tab never reached the last control").toBe("Last action");
        expect(s.visible, "focused and out of sight").toBe(true);

        // Scrolling: back to the top, then each project's own input over the
        // overlay (scrollUntil): the wheel on desktop, a touch swipe on Mobile
        // Chrome, and PageDown on Mobile Safari, where Playwright has no wheel
        // and no swipe (the test at the end of this file pins that). Two more
        // gestures past the end, where a scroll that chains would move the
        // page. The overlay scrolls and the page behind it does not.
        await page.evaluate(() => {
          (document.activeElement as HTMLElement).blur();
          const spacer = document.createElement("div");
          spacer.style.height = "3000px";
          document.body.appendChild(spacer);
        });
        await last.evaluate((el) => {
          for (let c = el.parentElement; c; c = c.parentElement) if (c.scrollHeight > c.clientHeight + 1 && /auto|scroll/.test(getComputedStyle(c).overflowY)) c.scrollTop = 0;
        });
        const inView = () => last.evaluate((el) => { const r = el.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight; });
        const scrolled = await scrollUntil(page, last, inView, { beyond: 2 });
        console.log(`OVERLAY_REACH ${vp.width}x${vp.height} ${t.component}/${t.fixture} scroll: ${scrolled.input} x${scrolled.gestures}`);
        await expect.poll(inView, { message: "scrolling the overlay never brought the last control into view" }).toBe(true);
        expect(await page.evaluate(() => window.scrollY), "the page behind the overlay scrolled").toBe(0);
      });
    }

    /**
     * Initial focus is revealed once the panel's content has its final size.
     *
     * The reveal ran in the frame after the panel mounted, while the web font
     * was still loading: the 40 paragraphs rewrapped when Geist arrived, the
     * body grew 1728 -> 1920px, and the control the reveal had scrolled to
     * 696..720 sat at 888..912 in a 720px window. Chromium and Firefox usually
     * repair that with scroll anchoring; WebKit does not, and Chromium did not
     * once under load, which is how this case failed in L17's gates. Holding
     * the font until focus has landed reproduces it on demand: WebKit every
     * time, Chromium intermittently. Holding every frame 300ms does not — the
     * font then lands before the reveal runs — and is kept as the stand-in the
     * slow-machine failure was first reported against.
     */
    const CONDITIONS = [
      { name: "", setup: async () => {} },
      {
        name: " with every frame held 300ms",
        setup: (page: Page) =>
          page.addInitScript(() => {
            const raf = window.requestAnimationFrame.bind(window);
            window.requestAnimationFrame = (cb) => (setTimeout(() => raf(cb), 300), 0) as unknown as number;
          }),
      },
      {
        name: " with the web font held until focus lands",
        setup: async (page: Page) => {
          let release!: () => void;
          const held = new Promise<void>((resolve) => (release = resolve));
          await page.route(/\.(woff2?|ttf|otf)(\?|$)/, async (route) => {
            await held;
            await route.continue();
          });
          return release;
        },
      },
    ];
    for (const fixture of ["tall-initial-focus", "tall-autofocus"]) {
      for (const condition of CONDITIONS) {
        test(`Drawer/${fixture}: initial focus below the fold is brought into view${condition.name}`, async ({ page }) => {
          const release = await condition.setup(page);
          await gotoFixture(page, "Drawer", fixture);
          await expect(page.getByRole("button", { name: "Last action" })).toBeFocused();
          if (release) {
            // Landed means the layout changed, not `document.fonts.status`:
            // WebKit reports "loaded" while the font request is still held. The
            // extra frame is WebKit's: it scrolls at its next rendering update.
            const before = await page.locator("[data-drawer-panel]").evaluate((p) => p.scrollHeight);
            release();
            await page.waitForFunction((h) => document.querySelector("[data-drawer-panel]")!.scrollHeight !== h, before, { polling: "raf" });
            await page.evaluate(() => new Promise((r) => requestAnimationFrame(r)));
          }
          const s = await seen(page);
          console.log(`OVERLAY_REACH ${vp.width}x${vp.height} Drawer/${fixture}${condition.name} initial: "${s.label}" at ${s.at} visible=${s.visible}`);
          expect(s.visible).toBe(true);
        });
      }
    }

    for (const fixture of ["open-long", "open-long-low"]) {
      test(`CascadingDropdown/${fixture}: the menu fits, every item is reached in view, and a submenu opens beside its item`, async ({ page }) => {
        await gotoFixture(page, "CascadingDropdown", fixture);
        const items = page.locator('[role^="menuitem"]');
        await expect(items).toHaveCount(24);
        const menu = page.locator('[role="group"]').filter({ has: items.first() }).first();
        const rect = (await menu.boundingBox())!;
        console.log(`OVERLAY_REACH ${vp.width}x${vp.height} CascadingDropdown/${fixture} menu ${Math.round(rect.y)}..${Math.round(rect.y + rect.height)}`);
        expect(rect.y, "the menu starts above the viewport").toBeGreaterThanOrEqual(0);
        expect(rect.y + rect.height, "the menu runs past the viewport").toBeLessThanOrEqual(vp.height);

        await items.first().focus();
        const hidden: string[] = [];
        const labels = new Set<string>();
        for (let i = 0; i < 23; i++) {
          await page.keyboard.press("ArrowDown");
          const s = await seen(page);
          labels.add(s.label);
          if (!s.visible) hidden.push(`"${s.label}" at ${s.at}`);
        }
        console.log(`OVERLAY_REACH ${vp.width}x${vp.height} CascadingDropdown/${fixture} arrows: ${labels.size} items, ${hidden.length} hidden`);
        expect(labels.size, "arrow keys did not walk the menu").toBe(23);
        expect(hidden, "focused and out of sight").toEqual([]);

        // Back up to Item 22, the parent, in the scrolled part of the menu.
        let at = await seen(page);
        for (let i = 0; i < 4 && !/^Item 22/.test(at.label); i++) {
          await page.keyboard.press("ArrowUp");
          at = await seen(page);
        }
        expect(at.label).toMatch(/^Item 22/);
        await page.keyboard.press("ArrowRight");
        const submenu = page.locator("[data-cascading-submenu]");
        await expect(submenu).toBeVisible();
        const item = (await page.locator('[role^="menuitem"]', { hasText: "Item 22" }).boundingBox())!;
        const sub = (await submenu.boundingBox())!;
        const beside = Math.min(Math.abs(sub.x - (item.x + item.width)), Math.abs(sub.x + sub.width - item.x));
        console.log(`OVERLAY_REACH ${vp.width}x${vp.height} CascadingDropdown/${fixture} submenu ${Math.round(sub.x)},${Math.round(sub.y)} item ${Math.round(item.x)}..${Math.round(item.x + item.width)},${Math.round(item.y)} gap ${Math.round(beside)}`);
        expect(sub.y + sub.height > item.y && sub.y < item.y + item.height, "the submenu is not level with its item").toBe(true);
        // Beside it when there is room on either side; a menu as wide as a
        // 375px viewport leaves none, and the submenu is clamped into the frame
        // over its item instead (cascading-submenu.spec holds that case).
        const room = Math.max(vp.width - (item.x + item.width), item.x) - 8 >= sub.width;
        if (room) expect(beside, "the submenu is not beside its item").toBeLessThanOrEqual(8);
        expect(sub.y >= 0 && sub.y + sub.height <= vp.height, "the submenu runs out of the viewport").toBe(true);

        // Reachable: the keys walk the submenu, and its highlighted item is in view.
        await page.keyboard.press("ArrowDown");
        const highlighted = submenu.locator("[data-highlighted]");
        await expect(highlighted).toHaveText(/Sub B/);
        await expect(highlighted).toBeInViewport();
      });
    }
  });
}

/**
 * Exactly one top-level item is a tab stop, however the menu was opened.
 *
 * Items carried `tabIndex={isFocused ? 0 : -1}`, and nothing is focused until
 * an arrow key moves the highlight, so a menu opened by pointer had no tab stop
 * at all — which axe reports as `scrollable-region-focusable` once the menu can
 * scroll. The tab stop is the selected item, else the first enabled one, and
 * opening by pointer still leaves DOM focus where it was.
 */
test.describe("CascadingDropdown roving tab stop", () => {
  for (const { fixture, open, select, stop } of [
    { fixture: "closed", open: true, select: false, stop: /^Fruit/ },
    { fixture: "open-long", open: false, select: false, stop: /^Item 1$/ },
    // The selected item, not the first: Veg is second, and Carrot under it is picked first.
    { fixture: "closed", open: true, select: true, stop: /^Veg/ },
  ]) {
    test(`${fixture}${select ? " with Veg/Carrot selected" : ""}: opened by pointer, exactly one item is a tab stop and focus stays put`, async ({ page }) => {
      await gotoFixture(page, "CascadingDropdown", fixture);
      const trigger = page.locator("[data-fixture] button[aria-haspopup]").first();
      if (select) {
        await trigger.click();
        await page.locator('[role^="menuitem"]', { hasText: "Veg" }).click();
        await page.locator('[role^="menuitem"]', { hasText: "Carrot" }).click();
        await expect(page.locator('[role="menu"]')).toHaveCount(0);
      }
      if (open) await trigger.click();
      const items = page.locator('[role^="menuitem"]');
      await expect(items.first()).toBeVisible();
      const stops = page.locator('[role^="menuitem"][tabindex="0"]');
      await expect(stops).toHaveCount(1);
      const label = ((await stops.textContent()) ?? "").trim();
      const selected = await page.locator('[role^="menuitem"][data-selected]').count();
      console.log(`TAB_STOP CascadingDropdown/${fixture} stops=1 "${label}" selected-items=${selected}`);
      expect(label).toMatch(stop);
      const focusedItem = await page.evaluate(() => document.activeElement?.matches('[role^="menuitem"]') ?? false);
      expect(focusedItem, "opening by pointer moved DOM focus into the menu").toBe(false);
    });
  }
});

/**
 * The limitation scrollUntil works around, pinned. On Mobile Safari Playwright
 * refuses the wheel, so the overlays above are scrolled there by PageDown.
 * The day the wheel is accepted this fails, and the workaround is revisited:
 * a wheel that works may mean a swipe does too. Every other project takes the
 * wheel, desktop and Mobile Chrome alike.
 */
test("the mouse wheel is refused on Mobile Safari, and only there", async ({ page, browserName }) => {
  await gotoFixture(page, "Modal", "tall");
  const hasTouch = await page.evaluate(() => "ontouchstart" in window || navigator.maxTouchPoints > 0);
  const refused = await page.mouse.wheel(0, 100).then(
    () => "",
    (e: Error) => e.message,
  );
  console.log(`OVERLAY_REACH wheel ${browserName} touch=${hasTouch}: ${refused || "accepted"}`);
  if (browserName === "webkit" && hasTouch) expect(refused).toContain("Mouse wheel is not supported in mobile WebKit");
  else expect(refused).toBe("");
});
