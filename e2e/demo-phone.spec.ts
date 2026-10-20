import ts from "typescript";
import { readFileSync } from "node:fs";
import { test, expect, type Frame, type Locator } from "./_test";
import { demoPages } from "./_demo-routes";

/**
 * Every phone-width frame on the docs pages shows what its section says.
 *
 * A `PhoneFrame` loads `/preview/<Component>/<example>` in a 360 px iframe,
 * because popovers place themselves against the viewport and only a document
 * that narrow shows where they land on a phone. On a page narrower than that
 * the frame takes the width it has: 351 px on a Pixel 5, inside a 393 px page.
 * The demo-scenarios contract proves from the AST that the frame is there and
 * names a registered preview; this proves what a reader sees in it, per frame:
 *
 *   - it loads that preview, not the not-found page, and its document is 360
 *     px wide, or as wide as the figure leaves room for inside the wrapper's
 *     border when that is less: read from the page, so a frame narrower than
 *     both still fails;
 *   - nothing in it scrolls the document sideways;
 *   - the component is visible, and every popup it has open lies inside the
 *     frame's viewport: getBoundingClientRect, not scrollWidth, since a fixed
 *     popup adds nothing to scrollWidth and clips unseen. That is how
 *     CascadingDropdown's menu, 8 px wider than the viewport, went unnoticed
 *     until L24 fixed it and gave it a frame;
 *   - for the two tall overlays, the last control is out of view at first and
 *     is reached both by Tab and by scrolling, and seen.
 *
 * The frames are read from the pages' source, so a frame added to a page is
 * checked here with no edit, and fails until it has an entry below.
 */

interface PhoneFrameSection {
  /** The docs page's route, e.g. "pagination". */
  page: string;
  section: string;
  route: string;
  lookFor: string;
}

function phoneFrames(): PhoneFrameSection[] {
  const out: PhoneFrameSection[] = [];
  for (const { file, routes } of demoPages()) {
    const sf = ts.createSourceFile(file, readFileSync(`src/pages/demo/${file}`, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const attr = (el: ts.JsxOpeningLikeElement, name: string) => {
      const init = el.attributes.properties.find((a): a is ts.JsxAttribute => ts.isJsxAttribute(a) && a.name.getText(sf) === name)?.initializer;
      return init && ts.isStringLiteral(init) ? init.text : "";
    };
    let section = "";
    const visit = (n: ts.Node) => {
      if (ts.isJsxElement(n) && n.openingElement.tagName.getText(sf) === "Section") section = attr(n.openingElement, "title");
      if (ts.isJsxSelfClosingElement(n) && n.tagName.getText(sf) === "PhoneFrame") {
        out.push({ page: routes[0], section, route: attr(n, "route"), lookFor: attr(n, "lookFor") });
      }
      ts.forEachChild(n, visit);
    };
    visit(sf);
  }
  return out;
}

interface Expect {
  /** The component, visible in the frame. */
  shows: string;
  /** Clicked first, for a component whose popup starts closed. */
  open?: string;
  /** A tall overlay: its last control, and what scrolls to reach it. */
  reach?: { last: string; scroller: "the overlay" | "the content"; heading: string };
}

const EXPECT: Record<string, Expect> = {
  "Breadcrumb/phone": { shows: "nav[aria-label=Breadcrumb]", open: "nav[aria-label=Breadcrumb] button" },
  "CascadingDropdown/phone": { shows: "[role=menu]" },
  "DatePicker/phone": { shows: "[role=dialog] [role=grid]" },
  "Drawer/phone": { shows: "[role=dialog]" },
  "Drawer/long-sheet": { shows: "[role=dialog]", reach: { last: "Place the order", scroller: "the content", heading: "Your order" } },
  "Dropdown/phone": { shows: "[role=listbox]" },
  "InternationalPhoneInput/phone": { shows: "input[aria-label=Number]", open: "[aria-label='Select country']" },
  "Modal/phone": { shows: "[role=dialog]" },
  "Modal/tall": { shows: "[role=dialog]", reach: { last: "Accept the terms", scroller: "the overlay", heading: "Terms of service" } },
  "MultiSelectDropdown/phone": { shows: "[role=listbox]" },
  "MultiSelectSearchableDropdown/phone": { shows: "[role=listbox]" },
  "OtpInput/phone": { shows: "[role=group] input" },
  "Pagination/phone": { shows: "nav[aria-label=Pagination]" },
  "ResizablePanel/phone": { shows: "[role=separator]" },
  "SearchableDropdown/phone": { shows: "[role=listbox]" },
  "Stepper/phone": { shows: "[role=navigation] ol" },
  "TabPanel/phone": { shows: "[role=tablist]" },
  "TimePicker/phone": { shows: "[role=listbox]" },
  "Toast/phone": { shows: "[role=region][aria-label=Notifications] [role=status]" },
  "Tooltip/phone": { shows: "[role=tooltip]" },
};

/** The sentence the Modal section promises, which the frame is held to. */
const MODAL_TALL = "The dialog scrolls inside the overlay, and the last control can be reached by Tab and by scrolling.";

const FLOOR = 20;
const WIDTH = 360;

/**
 * The width the frame's document should have: 360 px, or the room its figure
 * gives the iframe when that is less, which is the figure's content box less
 * the wrapper's border.
 */
const widthFor = (figure: Locator) =>
  figure.evaluate((fig, most) => {
    const wrap = fig.querySelector("iframe")!.parentElement!;
    const [f, w] = [getComputedStyle(fig), getComputedStyle(wrap)];
    const room =
      fig.clientWidth - parseFloat(f.paddingLeft) - parseFloat(f.paddingRight) - parseFloat(w.borderLeftWidth) - parseFloat(w.borderRightWidth);
    return { room, want: Math.min(most, room) };
  }, WIDTH);

/** Popups open in the frame, with their boxes; dialogs may run past the bottom, since the tall ones scroll. */
const popupsOf = (frame: Frame) =>
  frame.evaluate(() =>
    [...document.querySelectorAll("[role=listbox],[role=menu],[role=dialog],[role=tooltip],[role=region][aria-label=Notifications] [role=status]")]
      .filter((e) => e.getClientRects().length && getComputedStyle(e).visibility !== "hidden")
      .map((e) => {
        const r = e.getBoundingClientRect();
        return { role: e.getAttribute("role") ?? "", left: r.left, right: r.right, top: r.top, bottom: r.bottom, height: innerHeight };
      }),
  );

/**
 * Resolves when every finite animation in the frame has finished: what the
 * popups' boxes are read against is where they come to rest. The Drawer slides
 * in with a transform transition started on the frame after it mounts, and is
 * visible from its first frame, so a read straight after `toBeVisible` caught
 * it in flight: at 4x CPU throttle, x -13.8..286 with the transition at 149 ms,
 * and -0.39 px in Firefox under load. Two frames first, so a transition queued
 * by that frame's state change exists before the list is taken.
 */
const settled = (frame: Frame) =>
  frame.evaluate(async () => {
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    const finite = document
      .getAnimations()
      .filter((a) => Number.isFinite(a.effect?.getComputedTiming().endTime ?? Infinity))
      .map((a) => a.finished.catch(() => undefined));
    await Promise.all(finite);
  });

/** Whether `name`'s button is inside the frame's viewport. */
const inView = (frame: Frame, name: string) =>
  frame.getByRole("button", { name, exact: true }).evaluate((el) => {
    const r = el.getBoundingClientRect();
    return r.top >= 0 && r.bottom <= innerHeight && r.left >= 0 && r.right <= innerWidth;
  });

test("every phone-width frame loads its preview at 360 px or the page's width, inside the screen", async ({ page }) => {
  test.setTimeout(300_000);
  const frames = phoneFrames();
  const counts = { frames: frames.length, loaded: 0, overflow: 0, outside: 0, reachable: 0, focusTaken: 0 };
  const problems: string[] = [];

  for (const f of frames) {
    const id = f.route.replace(/^\/preview\//, "");
    const want = EXPECT[id];
    expect(want, `${f.page} "${f.section}": the frame loads ${f.route}, which has no entry in EXPECT`).toBeTruthy();

    await page.goto(`/${f.page}`, { waitUntil: "networkidle" });
    const figure = page.locator(`figure[data-phone-frame="${f.route}"]`);
    await expect(figure, `${f.page}: no frame for ${f.route}`).toHaveCount(1);
    await figure.scrollIntoViewIfNeeded();
    await expect(page.locator("section").filter({ has: figure }).getByRole("heading", { level: 2 })).toHaveText(f.section);
    await expect(figure.locator("figcaption")).toHaveText(`At phone width. ${f.lookFor}`);
    const [component, example] = id.split("/");
    await expect(figure.locator("iframe")).toHaveAttribute("title", `${component}, ${example.replace(/-/g, " ")}, at phone width`);
    if (id === "Modal/tall") {
      expect(f.section).toBe("Taller than the screen");
      expect(f.lookFor).toBe(MODAL_TALL);
    }

    const frame = (await figure.locator("iframe").elementHandle())!;
    const inner = (await frame.contentFrame())!;
    await expect(inner.locator(`main[data-preview="${id}"]`), `${f.route}: the preview did not load`).toHaveCount(1, { timeout: 15_000 });
    await expect(inner.locator("[data-route-404]"), `${f.route}: the frame shows the not-found page`).toHaveCount(0);
    await expect(inner.locator(want.shows).first(), `${f.route}: ${want.shows} is not visible`).toBeVisible({ timeout: 10_000 });
    counts.loaded += 1;
    // Loading took no focus from the docs page: a preview opened by
    // defaultOpen focuses its list, and the frame holds that until used.
    if ((await page.evaluate(() => document.activeElement?.tagName)) === "IFRAME") {
      counts.focusTaken += 1;
      problems.push(`${f.route}: loading the frame moved the docs page's focus into it`);
    }

    const { room, want: wide } = await widthFor(figure);
    const width = await inner.evaluate(() => ({ client: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth }));
    if (width.client !== wide) problems.push(`${f.route}: the document is ${width.client} px wide, not ${wide} (the figure leaves ${room})`);
    if (width.scroll > width.client) {
      counts.overflow += 1;
      problems.push(`${f.route}: the document scrolls sideways (${width.scroll} > ${width.client})`);
    }

    if (want.open) {
      await inner.locator(want.open).first().click();
      await inner.waitForTimeout(400);
    }
    await settled(inner);
    const popups = await popupsOf(inner);
    for (const p of popups) {
      const across = p.left >= -0.5 && p.right <= width.client + 0.5;
      const down = p.role === "dialog" || (p.top >= -0.5 && p.bottom <= p.height + 0.5);
      if (!across || !down) {
        counts.outside += 1;
        problems.push(`${f.route}: the ${p.role} lies at x ${Math.round(p.left)}..${Math.round(p.right)}, y ${Math.round(p.top)}..${Math.round(p.bottom)}, outside the ${width.client} x ${p.height} viewport`);
      }
    }

    let reach = "n/a";
    if (want.reach) {
      const { last, scroller, heading } = want.reach;
      // What scrolls: the nearest ancestor of the last control that overflows.
      const scrolls = await inner.getByRole("button", { name: last, exact: true }).evaluate((el) => {
        const dialog = el.closest("[role=dialog]")!;
        for (let n = el.parentElement; n; n = n.parentElement) {
          const style = getComputedStyle(n);
          if (/auto|scroll/.test(style.overflowY) && n.scrollHeight > n.clientHeight + 1) {
            n.scrollTop = 0;
            return { where: n === dialog ? "the dialog" : n.contains(dialog) ? "the overlay" : "the content" };
          }
        }
        return { where: "nothing" };
      });
      const atFirst = await inView(inner, last);
      const button = inner.getByRole("button", { name: last, exact: true });
      // By Tab, from the dialog's first control. A reader's click in the frame
      // comes first: until then the preview takes no focus (PreviewRoute).
      // The frame just below the site's fixed header, which otherwise covers
      // its top edge, where the dialog's heading is.
      await figure.evaluate((el) => window.scrollBy(0, el.getBoundingClientRect().top - 80));
      await inner.locator("[role=dialog]").getByText(heading, { exact: true }).click();
      await inner.locator("[role=dialog] button").first().focus();
      let byTab = false;
      for (let i = 0; i < 12 && !byTab; i += 1) {
        await page.keyboard.press("Tab");
        byTab = await button.evaluate((el) => el === document.activeElement);
      }
      const seenByTab = byTab && (await inView(inner, last));
      // By scrolling, from the top again, with the wheel over the overlay.
      await inner.evaluate((name) => {
        (document.activeElement as HTMLElement | null)?.blur();
        const el = [...document.querySelectorAll("button")].find((b) => b.textContent?.trim() === name)!;
        for (let n = el.parentElement; n; n = n.parentElement) if (n.scrollHeight > n.clientHeight + 1) n.scrollTop = 0;
      }, last);
      const box = (await frame.boundingBox())!;
      await page.mouse.move(box.x + box.width / 2, box.y + box.height * 0.75);
      let byScroll = false;
      for (let i = 0; i < 20 && !byScroll; i += 1) {
        await page.mouse.wheel(0, 400);
        await inner.waitForTimeout(100);
        byScroll = await inView(inner, last);
      }
      reach = `scrolls=${scrolls.where} hidden-at-first=${!atFirst} tab=${seenByTab} scroll=${byScroll}`;
      if (scrolls.where !== scroller) problems.push(`${f.route}: ${scrolls.where} scrolls to reach "${last}", not ${scroller}`);
      if (atFirst) problems.push(`${f.route}: "${last}" is in view before scrolling, so nothing was reached`);
      if (!seenByTab) problems.push(`${f.route}: Tab did not reach "${last}" and bring it into view`);
      if (!byScroll) problems.push(`${f.route}: scrolling did not bring "${last}" into view`);
      if (scrolls.where === scroller && !atFirst && seenByTab && byScroll) counts.reachable += 1;
    }

    console.log(
      `DEMO_PHONE_FRAME ${f.route} page=/${f.page} section="${f.section}" width=${width.client} want=${wide} room=${room} ` +
        `overflow=${width.scroll > width.client ? width.scroll - width.client : 0} shows=${want.shows} ` +
        `popups=${popups.length} outside=${popups.filter((p) => p.left < -0.5 || p.right > width.client + 0.5).length} reach=${reach}`,
    );
  }

  const overlays = Object.values(EXPECT).filter((e) => e.reach).length;
  console.log(
    `DEMO_PHONE frames ${counts.frames} (floor ${FLOOR}), loaded ${counts.loaded}, overflow ${counts.overflow}, ` +
      `popups outside ${counts.outside}, overlays reachable ${counts.reachable}, focus taken ${counts.focusTaken}`,
  );
  for (const p of problems) console.log(`DEMO_PHONE_PROBLEM ${p}`);
  expect(counts.frames, "fewer frames than the floor: the walk lost pages").toBeGreaterThanOrEqual(FLOOR);
  expect(problems).toEqual([]);
  expect(counts.loaded).toBe(counts.frames);
  expect(counts.reachable).toBe(overlays);
  expect(Object.keys(EXPECT).filter((id) => !frames.some((f) => f.route === `/preview/${id}`)), "an EXPECT entry no frame loads; delete it").toEqual([]);
});
