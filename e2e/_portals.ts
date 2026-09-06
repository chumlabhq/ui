import type { Page } from "@playwright/test";

/**
 * The fixture's portals, for a gate that has to audit what the fixture opened.
 *
 * Every surface this library opens is `createPortal`ed to `document.body`, so a
 * check scoped to `[data-fixture]` sees a menu, a listbox, a calendar or a
 * modal exactly never. That was the axe sweep's scope for the life of the
 * branch, and 68 findings were sitting in what it could not reach.
 */
export const PORTAL_MARK = "data-axe-portal";

/**
 * Identified positively, by React, not by excluding what is known to be someone
 * else's.
 *
 * A portal root is a direct child of `document.body` that React rendered:
 * `createPortal` mounts the surface's own element there, so it carries a
 * `__reactFiber$…` key, while the app root carries `__reactContainer$…` and the
 * checkout SDK's injected container carries neither. The library's `cl-s` scope
 * marker is the obvious candidate and is the wrong one — `Table`'s filter menu
 * and `Modal`'s root are written with unscoped Tailwind classes and have no
 * marker anywhere inside them, so a marker test would have missed the two
 * surfaces this scope fix exists for.
 *
 * An exclusion list would need editing every time the harness gains a script
 * tag, and would fail open when nobody did.
 *
 * The mark is an attribute rather than an element handle because axe takes a
 * serialisable context: `include` is a list of selectors. It carries no ARIA or
 * style meaning, and is cleared and re-applied per fixture.
 */
export async function markPortalRoots(page: Page): Promise<number> {
  return page.evaluate((attribute) => {
    for (const stale of document.querySelectorAll(`[${attribute}]`)) {
      stale.removeAttribute(attribute);
    }
    let marked = 0;
    for (const child of document.body.children) {
      if (child.id === "root") continue;
      if (!Object.keys(child).some((key) => key.startsWith("__reactFiber$"))) continue;
      child.setAttribute(attribute, "");
      marked += 1;
    }
    return marked;
  }, PORTAL_MARK);
}
