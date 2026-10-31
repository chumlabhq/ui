import type { Page } from "@playwright/test";
import { test, expect } from "./_test";
import { gotoFixture, servedRtl } from "./_nav";
import { settle } from "./_surfaces";
import { decodePng } from "./_png";

/**
 * What a value puts on the inline axis is painted on the inline axis, and an
 * icon that points along it points the way the page reads.
 *
 * The A2 audit measured a right-to-left page with the Slider laid out from the
 * physical left (value 25 painted 75% from the leading edge, a press 20% from
 * the left read as 20), a checked Switch's thumb painted 18 px past its track,
 * Table's resize handles on each column's inline-START edge, and every
 * direction-bearing chevron (Pagination, Breadcrumb, CascadingDropdown's
 * submenu, DatePicker's month and year arrows, Table's expand icon) pointing
 * the left-to-right way (causes C5 and C7). CascadingDropdown's chevron also
 * pointed right with `submenuSide="start"` in a left-to-right page, while its
 * submenu opened on the left; it is held to the side the submenu painted on,
 * on a centred menu where the side asked for has room. A menu with no room
 * there flips its submenu and keeps the chevron, as native menus do.
 *
 * Everything is read off the painted page, never off a class name:
 * - positions from bounding rects, against the inline start (the left in LTR,
 *   the right in RTL);
 * - which way an icon points from its own geometry (the end of the shape that
 *   narrows to a point: a chevron's apex is a point, its two arms are a span),
 *   times every horizontal flip above it in `scale`, `transform` and `rotate`;
 * - that an icon with no direction was not mirrored: a mirror is a flip with a
 *   negative determinant, which a half turn (an open dropdown's chevron) is
 *   not.
 *
 * A2d2 made the physical-by-name props logical (Drawer `side`, Toast
 * `position`, Avatar's badge and status corners, Button's slides and
 * ResizablePanel's `resizeDirection`, whose default `end` puts the handle
 * between the panes in either direction); `sides` holds each to the edge it
 * names, by painted box. And text the library writes reads in its own order in
 * either page: before A2d2 a right-to-left page painted AvatarGroup's "+3" as
 * "3+", the badge cap "99+" as "+99", the dial code "+44" as "44+", the clock
 * header "09:30" as "30:09" and every "Search..." placeholder as "...Search".
 * `bidi` reads each token's characters in painted order (a Range per
 * character, sorted by x) and each placeholder from its pixels (whether the
 * dots' ink sits after the word's).
 */

type Dir = "ltr" | "rtl";
type Row = { name: string; ok: boolean; detail: string };

/**
 * Rows per check and direction, from A2d's step 0 on 7fa7310c, with icons'
 * 32 raised to 36 by the centred `submenuSide="start"` page; sides and bidi
 * from A2d2's step 0 on 6eb6ccd5. A walk that reads fewer has lost rows.
 */
const FLOOR = { positions: 10, ResizablePanel: 2, icons: 36, sides: 10, bidi: 10 } as const;
type Check = keyof typeof FLOOR;

async function load(page: Page, dir: Dir, component: string, fixture: string): Promise<void> {
  await page.setViewportSize({ width: 1024, height: 800 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await gotoFixture(page, component, fixture);
  await settle(page, `${component}/${fixture}`);
  const painted = await page.evaluate(() => getComputedStyle(document.documentElement).direction);
  expect(painted, `${component}/${fixture} was served ${dir} and rendered ${painted}`).toBe(dir);
}

type Box = { left: number; right: number; width: number; centre: number };
const box = (page: Page, selector: string, index = 0): Promise<Box> =>
  page.locator(selector).nth(index).evaluate((el) => {
    const r = el.getBoundingClientRect();
    return { left: r.left, right: r.right, width: r.width, centre: r.left + r.width / 2 };
  });

/** Distance from the inline start of `within`, in px. */
const fromStart = (dir: Dir, within: Box, x: number) => (dir === "ltr" ? x - within.left : within.right - x);
const near = (a: number, b: number, tolerance: number) => Math.abs(a - b) <= tolerance;
const r = Math.round;

async function positions(page: Page, dir: Dir): Promise<Row[]> {
  const rows: Row[] = [];
  const thumb = "[data-fixture] [role='slider']";
  const control = `${thumb} >> xpath=..`;
  const fill = `${control} >> xpath=./*[2]`;

  await load(page, dir, "Slider", "tooltip-always");
  let track = await box(page, control);
  const at = fromStart(dir, track, (await box(page, thumb)).centre) / track.width;
  rows.push({ name: "Slider at 40: the thumb's centre", ok: near(at, 0.4, 0.01), detail: `${r(at * 100)}% from the inline start` });
  let f = await box(page, fill);
  rows.push({
    name: "Slider at 40: the fill",
    ok: near(fromStart(dir, track, dir === "ltr" ? f.left : f.right), 0, 2) && near(f.width / track.width, 0.4, 0.01),
    detail: `[${r(f.left)}..${r(f.right)}] in a track [${r(track.left)}..${r(track.right)}], want the inline start to 40%`,
  });

  await load(page, dir, "Slider", "range");
  track = await box(page, control);
  for (const [index, value] of [[0, 20], [1, 60]] as const) {
    const t = fromStart(dir, track, (await box(page, thumb, index)).centre) / track.width;
    rows.push({ name: `Slider range: thumb ${index} at ${value}`, ok: near(t, value / 100, 0.01), detail: `${r(t * 100)}% from the inline start` });
  }
  f = await box(page, fill);
  const fillStart = fromStart(dir, track, dir === "ltr" ? f.left : f.right) / track.width;
  rows.push({
    name: "Slider range: the fill between the thumbs",
    ok: near(fillStart, 0.2, 0.01) && near(f.width / track.width, 0.4, 0.01),
    detail: `starts ${r(fillStart * 100)}% from the inline start, ${r((f.width / track.width) * 100)}% wide`,
  });

  await load(page, dir, "Slider", "tooltip-always");
  track = await box(page, control);
  const y = await page.locator(thumb).evaluate((el) => el.getBoundingClientRect().top + el.getBoundingClientRect().height / 2);
  await page.mouse.click(dir === "ltr" ? track.left + 0.2 * track.width : track.right - 0.2 * track.width, y);
  const pressed = Number(await page.locator(thumb).getAttribute("aria-valuenow"));
  rows.push({ name: "Slider: a press 20% from the inline start", ok: near(pressed, 20, 1), detail: `value ${pressed}, want 20` });

  for (const [fixture, side] of [["default", "start"], ["checked", "end"]] as const) {
    await load(page, dir, "Switch", fixture);
    const sw = await box(page, "[data-fixture] [role='switch']");
    const th = await box(page, "[data-fixture] [role='switch'] > span");
    const inside = th.left >= sw.left - 0.5 && th.right <= sw.right + 0.5;
    const edge = side === "start" ? fromStart(dir, sw, dir === "ltr" ? th.left : th.right) : fromStart(dir, sw, dir === "ltr" ? th.right : th.left) - sw.width;
    rows.push({
      name: `Switch ${fixture}: the thumb at the inline ${side}`,
      ok: inside && near(edge, 0, 3),
      detail: `thumb [${r(th.left)}..${r(th.right)}] in a track [${r(sw.left)}..${r(sw.right)}]`,
    });
  }

  await load(page, dir, "Table", "resizable");
  const handle = "[data-fixture] [data-resize-handle]";
  const count = await page.locator(handle).count();
  for (let i = 0; i < count; i++) {
    const h = await box(page, handle, i);
    const th = await page.locator(handle).nth(i).evaluate((el) => {
      const c = el.closest("th")!.getBoundingClientRect();
      return { left: c.left, right: c.right, width: c.width, centre: c.left + c.width / 2 };
    });
    const endEdge = dir === "ltr" ? th.right : th.left;
    rows.push({
      name: `Table: column ${i + 1}'s resize handle on its inline-end edge`,
      ok: near(h.centre, endEdge, 10),
      detail: `handle centre ${r(h.centre)}, header [${r(th.left)}..${r(th.right)}]`,
    });
  }
  return rows;
}

async function resizablePanel(page: Page, dir: Dir): Promise<Row[]> {
  const rows: Row[] = [];
  const handle = "[data-fixture] [role='separator']";
  await load(page, dir, "ResizablePanel", "default");
  const panel = await page.locator(handle).evaluate((el) => {
    const p = el.parentElement!.getBoundingClientRect();
    return { left: p.left, right: p.right, width: p.width, centre: p.left + p.width / 2 };
  });
  const h = await box(page, handle);
  const free = dir === "ltr" ? panel.right : panel.left;
  rows.push({ name: "the handle on the panel's free edge", ok: near(h.centre, free, 6), detail: `handle centre ${r(h.centre)}, panel [${r(panel.left)}..${r(panel.right)}]` });

  const before = Number(await page.locator(handle).getAttribute("aria-valuenow"));
  const out = dir === "ltr" ? 50 : -50;
  await page.mouse.move(h.centre, (await page.locator(handle).boundingBox())!.y + 20);
  await page.mouse.down();
  await page.mouse.move(h.centre + out / 2, (await page.locator(handle).boundingBox())!.y + 20, { steps: 3 });
  await page.mouse.move(h.centre + out, (await page.locator(handle).boundingBox())!.y + 20, { steps: 3 });
  await page.mouse.up();
  const after = Number(await page.locator(handle).getAttribute("aria-valuenow"));
  const moved = (await box(page, handle)).centre - h.centre;
  rows.push({
    name: "a 50px drag away from the panel widens it and the handle follows",
    ok: after - before === 50 && near(moved, out, 1),
    detail: `size ${before} -> ${after}, handle moved ${r(moved)}px, want ${out}px`,
  });
  return rows;
}

/** The pages walked for icons, and which icons on them point along the inline axis. */
const ICON_PAGES: Array<[string, string]> = [
  ["Pagination", "default"],
  ["Breadcrumb", "default"],
  ["CascadingDropdown", "open-submenu"],
  ["CascadingDropdown", "open-submenu-start"],
  ["DatePicker", "open"],
  ["Table", "expandable"],
  ["Table", "sortable"],
  ["Table", "with-search"],
  ["Table", "pinned-column"],
  ["Table", "draggable"],
  ["Accordion", "single-open"],
  ["Dropdown", "open"],
  ["Drawer", "open"],
  ["Toast", "dismissable"],
  ["Modal", "open"],
];

/** The inline side a directional icon points to, by the control or role that holds it; anything else has no direction. */
const POINTS_TO: Record<string, "start" | "end"> = {
  "Previous page": "start",
  "Next page": "end",
  "Previous year": "start",
  "Previous month": "start",
  "Next month": "end",
  "Next year": "end",
  "Expand row": "end",
  presentation: "end",
};

async function icons(page: Page, dir: Dir): Promise<Row[]> {
  const rows: Row[] = [];
  for (const [component, fixture] of ICON_PAGES) {
    await load(page, dir, component, fixture);
    const found = await page.evaluate(() =>
      [...document.body.querySelectorAll("svg")].map((svg) => {
        const pts: Array<[number, number]> = [];
        for (const shape of svg.querySelectorAll<SVGGeometryElement>("path, polyline, line, polygon")) {
          const len = shape.getTotalLength();
          for (let i = 0; i <= 200; i++) {
            const p = shape.getPointAtLength((len * i) / 200);
            pts.push([p.x, p.y]);
          }
        }
        const xs = pts.map((p) => p[0]);
        const ys = pts.map((p) => p[1]);
        const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
        const w = x1 - x0 || 1;
        const h = y1 - y0 || 1;
        const spread = (side: Array<[number, number]>) => (side.length ? Math.max(...side.map((p) => p[1])) - Math.min(...side.map((p) => p[1])) : 0) / h;
        const L = spread(pts.filter((p) => p[0] <= x0 + 0.1 * w));
        const R = spread(pts.filter((p) => p[0] >= x1 - 0.1 * w));
        const own = R < 0.35 && L > 0.6 ? 1 : L < 0.35 && R > 0.6 ? -1 : 0;
        let across = 1;
        let mirror = 1;
        for (let el: Element | null = svg; el; el = el.parentElement) {
          const cs = getComputedStyle(el);
          if (cs.transform !== "none") {
            const m = new DOMMatrix(cs.transform);
            across *= Math.sign(m.a) || 1;
            mirror *= Math.sign(m.a * m.d - m.b * m.c) || 1;
          }
          if (cs.scale !== "none") {
            const [sx, sy = sx] = cs.scale.split(" ").map(parseFloat);
            across *= Math.sign(sx) || 1;
            mirror *= Math.sign(sx * sy) || 1;
          }
          if (cs.rotate !== "none") across *= Math.sign(Math.cos((parseFloat(cs.rotate) * Math.PI) / 180)) || 1;
        }
        const host = svg.closest("button,[role],li,th,td");
        const rect = svg.getBoundingClientRect();
        const opened = host?.getAttribute("role") === "menuitem" ? host.parentElement?.querySelector("[role='menuitem'][aria-expanded='true']") : null;
        const submenu = opened && document.getElementById(opened.getAttribute("aria-controls") ?? "");
        const from = opened?.getBoundingClientRect();
        const to = submenu?.getBoundingClientRect();
        return {
          submenu: from && to ? Math.sign(to.left + to.width / 2 - (from.left + from.width / 2)) : 0,
          label: host?.getAttribute("aria-label") ?? host?.getAttribute("role") ?? host?.tagName.toLowerCase() ?? "?",
          points: own * across,
          mirrored: mirror < 0,
          x: Math.round(rect.left),
        };
      }),
    );
    for (const icon of found) {
      const side = POINTS_TO[icon.label];
      const name = `${component}/${fixture} ${icon.label} @x${icon.x}`;
      const pointsWord = icon.points > 0 ? "right" : icon.points < 0 ? "left" : "nowhere along the axis";
      if (icon.label === "menuitem") {
        const toward = icon.submenu > 0 ? "right" : icon.submenu < 0 ? "left" : "nowhere: no open submenu";
        rows.push({ name, ok: icon.submenu !== 0 && icon.points === icon.submenu, detail: `points ${pointsWord}, its menu's submenu painted ${toward}` });
      } else if (side) {
        const want = (side === "end") === (dir === "ltr") ? 1 : -1;
        rows.push({ name, ok: icon.points === want, detail: `points ${pointsWord}, want the inline ${side} (${want > 0 ? "right" : "left"})` });
      } else {
        rows.push({ name, ok: !icon.mirrored, detail: `${icon.mirrored ? "MIRRORED" : "not mirrored"}; it has no direction` });
      }
    }
  }
  return rows;
}

/** Where on the inline axis a box sits: its start edge's distance from the viewport's inline start, and its end edge's from the inline end. */
async function inlineEdges(page: Page, selector: string): Promise<{ start: number; end: number; box: Box }> {
  const [b, width] = await Promise.all([box(page, selector), page.evaluate(() => document.documentElement.clientWidth)]);
  return { box: b, start: b.left, end: width - b.right };
}
const fromInline = (dir: Dir, edges: { start: number; end: number }) =>
  dir === "ltr" ? { start: edges.start, end: edges.end } : { start: edges.end, end: edges.start };

async function sides(page: Page, dir: Dir): Promise<Row[]> {
  const rows: Row[] = [];
  for (const [fixture, side] of [["open-left", "start"], ["open-end", "end"]] as const) {
    await load(page, dir, "Drawer", fixture);
    const e = fromInline(dir, await inlineEdges(page, "[data-drawer-panel]"));
    rows.push({ name: `Drawer side="${side}": the panel against the inline ${side}`, ok: near(e[side], 0, 1), detail: `${r(e[side])}px from the inline ${side}` });
  }
  for (const [fixture, side] of [["provider-bottom-end", "end"], ["provider-top-start", "start"]] as const) {
    await load(page, dir, "Toast", fixture);
    await page.locator("[role='region'] [role='status'], [role='region'] [role='alert']").first().waitFor();
    const e = fromInline(dir, await inlineEdges(page, "[role='region']"));
    rows.push({ name: `Toast ${fixture.replace("provider-", "")}: the region 16px in from the inline ${side}`, ok: near(e[side], 16, 2), detail: `${r(e[side])}px from the inline ${side}` });
  }
  const corner = async (component: string, fixture: string, selector: string, side: "start" | "end", label: string) => {
    await load(page, dir, component, fixture);
    const [mark, host] = await Promise.all([box(page, selector), box(page, `${selector} >> xpath=..`)]);
    const at = fromStart(dir, host, mark.centre) / host.width;
    rows.push({ name: `${label}: at the host's inline ${side}`, ok: side === "end" ? at > 0.7 : at < 0.3, detail: `centre ${r(at * 100)}% from the inline start` });
  };
  await corner("Avatar/AvatarBadge", "count-solid", "[data-fixture] [role='status']", "end", "AvatarBadge top-end");
  await corner("Avatar/AvatarBadge", "count-top-start", "[data-fixture] [role='status']", "start", "AvatarBadge top-start");
  await corner("Avatar", "with-status", "[data-fixture] [aria-label$='is online']", "end", "Avatar status bottom-end");

  await load(page, dir, "ResizablePanel", "start");
  const sep = "[data-fixture] [role='separator']";
  const h = await box(page, sep);
  const panel = await page.locator(sep).evaluate((el) => {
    const p = el.parentElement!.getBoundingClientRect();
    return { left: p.left, right: p.right, width: p.width, centre: p.left + p.width / 2 };
  });
  const startEdge = dir === "ltr" ? panel.left : panel.right;
  rows.push({ name: `ResizablePanel resizeDirection="start": the handle on the panel's inline-start edge`, ok: near(h.centre, startEdge, 6), detail: `handle centre ${r(h.centre)}, panel [${r(panel.left)}..${r(panel.right)}]` });

  // Hover slides exist only where the device can hover (Tailwind puts `hover:`
  // inside `@media (hover: hover)`), so they are read there; the continuous
  // slides run on every device and are read everywhere.
  const canHover = await page.evaluate(() => matchMedia("(hover: hover)").matches);
  const slides = [
    ...(canHover ? ([["icon-slide-end", "end", "R", "on hover"], ["icon-slide-start", "start", "L", "on hover"]] as const) : []),
    ["icon-slide-end-continuous", "end", "R", "on its own"],
    ["icon-slide-start-continuous", "start", "L", "on its own"],
  ] as const;
  for (const [fixture, side, icon, how] of slides) {
    await load(page, dir, "Button", fixture);
    // load() renders under reduced motion, where Button draws no slide at all;
    // render again with motion allowed.
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.reload();
    await settle(page, `Button/${fixture}`);
    const glyph = page.locator("[data-fixture] button span", { hasText: new RegExp(`^${icon}$`) }).first();
    await page.mouse.move(0, 0);
    await page.waitForTimeout(100);
    const before = (await glyph.boundingBox())!.x;
    let moved = 0;
    let seen = "";
    if (how === "on hover") {
      await page.locator("[data-fixture] button").first().hover();
      await page.waitForTimeout(400);
      moved = (await glyph.boundingBox())!.x - before;
    } else {
      // servedRtl stills every animation in a right-to-left page; this one is
      // the subject, so its one rule goes (by its exact text: the dev server
      // injects the library's own stylesheet as <style> elements too).
      await page.evaluate(() => {
        for (const style of document.querySelectorAll("style")) {
          if (style.textContent?.trim() === "*, *::before, *::after { animation: none !important; transition: none !important; }") style.remove();
        }
      });
      // Its farthest offset from rest in one 1s cycle: the animated element's
      // own painted translation, sampled, so the phase it started in does not
      // matter.
      for (let i = 0; i < 12; i++) {
        await page.waitForTimeout(90);
        const [d, name] = await glyph.evaluate((el) => {
          for (let n: Element | null = el; n; n = n.parentElement) {
            const cs = getComputedStyle(n);
            if (cs.animationName !== "none") return [cs.translate === "none" ? 0 : parseFloat(cs.translate), cs.animationName] as const;
          }
          return [0, "no animation"] as const;
        });
        seen = name;
        if (Math.abs(d) > Math.abs(moved)) moved = d;
      }
    }
    const toward = (side === "end") === (dir === "ltr") ? 1 : -1;
    rows.push({ name: `Button ${fixture}: the icon slides toward the inline ${side} ${how}`, ok: Math.sign(moved) === toward && Math.abs(moved) >= 2, detail: `moved ${moved.toFixed(1)}px, want ${toward > 0 ? "right" : "left"}${seen ? ` (${seen})` : ""}` });
    await page.mouse.move(0, 0);
  }
  return rows;
}

/** Characters under `root` in painted order, left to right: one Range per character, sorted by its box's centre. */
const paintedOrder = (page: Page, selector: string) =>
  page.locator(selector).first().evaluate((root) => {
    const out: Array<[number, string]> = [];
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      const t = n.textContent ?? "";
      for (let i = 0; i < t.length; i++) {
        if (!t[i].trim()) continue;
        const range = document.createRange();
        range.setStart(n, i);
        range.setEnd(n, i + 1);
        const b = range.getClientRects()[0];
        if (b) out.push([b.left + b.width / 2, t[i]]);
      }
    }
    return { painted: out.sort((a, b) => a[0] - b[0]).map((x) => x[1]).join(""), text: (root.textContent ?? "").replace(/\s+/g, "") };
  });

/**
 * Whether an input's placeholder paints its trailing dots after its word: the
 * ink in the content box, split into columns inked only in the bottom quarter
 * of the text band (the dots) and the rest (the letters), compared by their
 * centroids.
 */
async function placeholderOrder(page: Page, selector: string): Promise<string> {
  const input = page.locator(selector).first();
  await input.evaluate((el) => {
    (el as HTMLInputElement).style.caretColor = "transparent";
    (el as HTMLInputElement).blur();
  });
  const clip = await input.evaluate((el) => {
    const rect = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    const px = (v: string) => parseFloat(v) || 0;
    const x = rect.left + px(cs.borderLeftWidth) + px(cs.paddingLeft);
    return { x, y: rect.top + px(cs.borderTopWidth), width: rect.width - px(cs.borderLeftWidth) - px(cs.borderRightWidth) - px(cs.paddingLeft) - px(cs.paddingRight), height: rect.height - px(cs.borderTopWidth) - px(cs.borderBottomWidth) };
  });
  const { width, height, pixels } = decodePng(await page.screenshot({ clip }));
  const ch = pixels.length / (width * height);
  const counts = new Map<number, number>();
  for (let i = 0; i < pixels.length; i += ch) counts.set((pixels[i] << 16) | (pixels[i + 1] << 8) | pixels[i + 2], (counts.get((pixels[i] << 16) | (pixels[i + 1] << 8) | pixels[i + 2]) ?? 0) + 1);
  const bg = [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
  const ink = (i: number) => Math.abs(pixels[i] - (bg >> 16)) + Math.abs(pixels[i + 1] - ((bg >> 8) & 255)) + Math.abs(pixels[i + 2] - (bg & 255)) > 90;
  const cols: Array<[number, number] | null> = [];
  let top = height, bottom = -1;
  for (let x = 0; x < width; x++) {
    let lo = -1, hi = -1;
    for (let y = 0; y < height; y++) if (ink((y * width + x) * ch)) { if (lo < 0) lo = y; hi = y; }
    cols.push(lo < 0 ? null : [lo, hi]);
    if (lo >= 0) { top = Math.min(top, lo); bottom = Math.max(bottom, hi); }
  }
  const cut = bottom - (bottom - top) / 4;
  let word = 0, wordN = 0, dots = 0, dotsN = 0;
  cols.forEach((c, x) => { if (!c) return; if (c[0] >= cut) { dots += x; dotsN++; } else { word += x; wordN++; } });
  if (!wordN || !dotsN) return "no placeholder ink";
  return dots / dotsN > word / wordN ? "word then dots" : "dots then word";
}

async function bidi(page: Page, dir: Dir): Promise<Row[]> {
  const rows: Row[] = [];
  const tokens: Array<[string, string, string, string]> = [
    ["Avatar/AvatarGroupCount", "solid", "[data-fixture] [role='status'] span", "AvatarGroupCount's surplus"],
    ["Avatar/AvatarBadge", "count-overflow", "[data-fixture] [role='status']", "AvatarBadge's cap"],
    ["InternationalPhoneInput", "with-value", "[data-fixture] [role='combobox'] span:not(:has(*))", "InternationalPhoneInput's dial code"],
    ["TimePicker", "open-clock", "button[aria-pressed] >> xpath=..", "TimePicker's clock header"],
    ["Slider", "negative", "[data-fixture] [role='tooltip']", "Slider's signed value"],
  ];
  for (const [component, fixture, selector, label] of tokens) {
    await load(page, dir, component, fixture);
    const { painted, text } = await paintedOrder(page, selector);
    rows.push({ name: `${label} (${component}/${fixture})`, ok: painted === text && text.length > 0, detail: `painted "${painted}", text "${text}"` });
  }
  const fields: Array<[string, string, string]> = [
    ["SearchableDropdown", "open", "[role='listbox'] >> xpath=ancestor::*[.//input[@placeholder]][1] >> input[placeholder]"],
    ["MultiSelectSearchableDropdown", "open", "input[placeholder]"],
    ["Table", "with-search", "[data-fixture] input[placeholder]"],
    ["CascadingDropdown", "open-submenu", "input[placeholder]"],
    ["InternationalPhoneInput", "country-open", "input[placeholder^='Search']"],
  ];
  for (const [component, fixture, selector] of fields) {
    await load(page, dir, component, fixture);
    const order = await placeholderOrder(page, selector);
    const placeholder = await page.locator(selector).first().getAttribute("placeholder");
    rows.push({ name: `${component}/${fixture} placeholder "${placeholder}"`, ok: order === "word then dots", detail: order });
  }
  return rows;
}

const CHECKS: Record<Check, (page: Page, dir: Dir) => Promise<Row[]>> = {
  positions,
  ResizablePanel: resizablePanel,
  icons,
  sides,
  bidi,
};

for (const dir of ["ltr", "rtl"] as const) {
  for (const check of Object.keys(CHECKS) as Check[]) {
    test(`${check} in a ${dir} page follow the inline direction`, async ({ page }, info) => {
      test.setTimeout(120000);
      if (dir === "rtl") await servedRtl(page);
      const rows = await CHECKS[check](page, dir);
      const wrong = rows.filter((row) => !row.ok);
      console.log(
        `RTL_PAINT ${info.project.name} ${dir} ${check}: rows ${rows.length} (floor ${FLOOR[check]}), ` +
          `wrong ${wrong.length} -> ${wrong.length ? "RED" : "GREEN"}`,
      );
      for (const row of rows) console.log(`RTL_PAINT_ROW ${info.project.name} ${dir} ${check} ${row.ok ? "ok   " : "WRONG"} ${row.name}: ${row.detail}`);
      expect(rows.length, "fewer rows than step 0 read: the walk lost rows").toBeGreaterThanOrEqual(FLOOR[check]);
      expect(wrong.map((row) => `${row.name}: ${row.detail}`)).toEqual([]);
    });
  }
}
