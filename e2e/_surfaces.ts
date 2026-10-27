import type { Page } from "@playwright/test";

/**
 * The open surfaces of a fixture page, for the gates that audit where a popup
 * lands: surface-fit (inside the viewport, holding its content) and
 * rtl-surfaces (against its trigger's inline-start edge).
 *
 * A surface is any visible element the fixture portals out, outermost first, or
 * an in-place one with a popup role. What is left out and why is in
 * surface-fit.spec.ts: a scrim (viewport-sized, no popup role), anything under
 * `aria-hidden` or `inert`, and anything not painted.
 *
 * Read until two reads two frames apart agree: a resize re-places a surface a
 * frame later, and a reader that took the first frame would read the old place.
 */
export type Box = { left: number; right: number; top: number; bottom: number };

export type Surface = Box & {
  el: string;
  role: string;
  client: number;
  scroll: number;
  viewport: number;
  /**
   * What the surface is anchored to, and how that was found:
   * - `prop`: the element the component itself positions against — the
   *   `trigger` prop of MenuSurface or the `triggerRef` of Table's filter
   *   panel, read off the React fiber the same way `_portals.ts` tells a portal
   *   from the app root. Not the ARIA owner: TimePicker's surface anchors to
   *   the field box while its `aria-controls` sits on the input inside it, and
   *   the two differ by the box's padding.
   * - `owner`: an element outside every surface whose `aria-controls`,
   *   `aria-owns` or `aria-describedby` names the surface or something in it.
   *   The only way a tooltip is anchored: one with no owner (DatePicker's
   *   marker tooltip) is `null`, not the picker's open button.
   * - `expanded`: the one `aria-expanded="true"` element outside every surface,
   *   when there is exactly one.
   */
  anchor: (Box & { how: "prop" | "owner" | "expanded" }) | null;
};

export async function openSurfaces(page: Page): Promise<Surface[]> {
  return page.evaluate(async () => {
    const POPUP = /^(listbox|menu|dialog|alertdialog|tooltip)$/;
    const round = (n: number) => Math.round(n * 10) / 10;
    const box = (el: Element): Box => {
      const r = el.getBoundingClientRect();
      return { left: round(r.left), right: round(r.right), top: round(r.top), bottom: round(r.bottom) };
    };
    const read = (): Surface[] => {
      const viewport = document.documentElement.clientWidth;
      const portals = [...document.body.children].filter(
        (c) => c.id !== "root" && Object.keys(c).some((key) => key.startsWith("__reactFiber$")),
      );
      const found: Element[] = [];
      for (const el of document.querySelectorAll("body *")) {
        const portalled = portals.some((p) => p.contains(el));
        const style = getComputedStyle(el);
        const placed = style.position === "fixed" || style.position === "absolute";
        const role = el.getAttribute("role") ?? "";
        if (!(portalled && (placed || POPUP.test(role))) && !(placed && POPUP.test(role))) continue;
        if (el.closest("[aria-hidden='true'], [inert]")) continue;
        if (style.display === "none" || style.visibility === "hidden" || parseFloat(style.opacity) === 0) continue;
        const r = el.getBoundingClientRect();
        if (r.width < 2 || r.height < 2) continue;
        const scrim = Math.abs(r.left) < 0.5 && Math.abs(r.top) < 0.5 && Math.abs(r.right - viewport) < 0.5 && Math.abs(r.bottom - innerHeight) < 0.5;
        if (scrim && !POPUP.test(role)) continue;
        found.push(el);
      }
      const outer = found.filter((el) => !found.some((other) => other !== el && other.contains(el)));
      const outside = (el: Element) => !outer.some((o) => o.contains(el));

      const anchorOf = (surface: Element): Surface["anchor"] => {
        const fiberKey = Object.keys(surface).find((key) => key.startsWith("__reactFiber$"));
        type Fiber = { memoizedProps?: Record<string, unknown>; return: Fiber | null };
        let fiber = fiberKey ? ((surface as unknown as Record<string, Fiber>)[fiberKey] ?? null) : null;
        for (let depth = 0; fiber && depth < 8; depth++, fiber = fiber.return) {
          const props = fiber.memoizedProps;
          const target = props && typeof props === "object" ? (props.trigger ?? props.triggerRef) : undefined;
          const el = target && typeof target === "object" && "current" in target ? (target as { current: unknown }).current : target;
          if (el instanceof Element) return { ...box(el), how: "prop" };
        }
        const ids = [surface, ...surface.querySelectorAll("[id]")].map((e) => e.id).filter(Boolean);
        const owner = [...document.querySelectorAll("[aria-controls],[aria-owns],[aria-describedby]")].find(
          (e) =>
            outside(e) &&
            ["aria-controls", "aria-owns", "aria-describedby"].some((a) =>
              (e.getAttribute(a) ?? "").split(/\s+/).some((token) => ids.includes(token)),
            ),
        );
        if (owner) return { ...box(owner), how: "owner" };
        if (surface.getAttribute("role") === "tooltip") return null;
        const expanded = [...document.querySelectorAll("[aria-expanded='true']")].filter(outside);
        return expanded.length === 1 ? { ...box(expanded[0]), how: "expanded" } : null;
      };

      return outer.map((el) => {
        const classes = String((el as HTMLElement).className ?? "").split(/\s+/).slice(0, 3).join(".");
        const role = el.getAttribute("role") ?? "";
        return {
          el: `${el.tagName.toLowerCase()}${role ? `[role=${role}]` : ""}${el.hasAttribute("data-table-filter-content") ? "[data-table-filter-content]" : ""}.${classes}`,
          role,
          ...box(el),
          client: el.clientWidth,
          scroll: el.scrollWidth,
          viewport,
          anchor: anchorOf(el),
        };
      });
    };
    const frames = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    let last = JSON.stringify(read());
    for (let i = 0; i < 30; i++) {
      await frames();
      const now = JSON.stringify(read());
      if (now === last) return JSON.parse(now) as Surface[];
      last = now;
    }
    throw new Error("the surfaces never stopped moving across 30 double frames");
  });
}

/** The act, the harness's still-document answer and the fonts; a fixture that never settles is named, not read. */
export async function settle(page: Page, id: string): Promise<void> {
  await page
    .waitForFunction(
      () => {
        const main = document.querySelector("main[data-fixture-act]");
        const act = main?.getAttribute("data-fixture-act");
        const still = main?.getAttribute("data-fixture-still");
        return act && act !== "pending" && still && still !== "pending" ? act : null;
      },
      undefined,
      { timeout: 30000 },
    )
    .catch((error: Error) => {
      throw new Error(`${id} never reported a settled act and a still document: ${error.message}`);
    });
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
}
