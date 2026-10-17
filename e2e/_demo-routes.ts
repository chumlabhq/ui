import ts from "typescript";
import { readFileSync, readdirSync } from "node:fs";
import { basename } from "node:path";
import { previewRoutes } from "../src/test/previewExamples";

/**
 * Which routes are demo pages, and which demo pages have a route.
 *
 * `demo-contrast` read its routes with a one-line regex over `<Route path="…"`.
 * Four routes in App.tsx put `path=` on its own line, so the regex never saw
 * them and the scan walked 33 of 37 pages while printing "pages=33" as though
 * that were the whole site: SearchableDropdown, MultiSelectDropdown,
 * MultiSelectSearchableDropdown and InternationalPhoneInput were measured by
 * nothing.
 *
 * So there are two readings here, and they are kept apart on purpose:
 * - `demoRoutes` walks the JSX of App.tsx, any formatting, and returns the
 *   routes nested inside the docs layout;
 * - `demoPages` starts from the files, `src/pages/demo/*Demo.tsx`, and maps each
 *   one through the import that names it to the routes that render it.
 * The second is the denominator for the first. A route the walk misses leaves
 * its page with no measured route, and that page is named.
 */

const APP = "src/App.tsx";
const PAGES_DIR = "src/pages/demo";

const parse = (file: string) =>
  ts.createSourceFile(file, readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);

const tagOf = (node: ts.Node): string | null =>
  ts.isJsxSelfClosingElement(node)
    ? node.tagName.getText()
    : ts.isJsxElement(node)
      ? node.openingElement.tagName.getText()
      : null;

export interface AppRoute {
  /** Full path, nesting resolved; `null` for a pathless layout route. */
  path: string | null;
  /** The component its `element` renders, e.g. `TableDemo`. */
  element: string | null;
  /** The `element` of the nearest enclosing route, if any. */
  parent: string | null;
}

/** Every `<Route>` in App.tsx, however its attributes are laid out. */
export function appRoutes(file = APP): AppRoute[] {
  const sf = parse(file);
  const routes: AppRoute[] = [];
  const attr = (el: ts.JsxOpeningLikeElement, name: string) =>
    el.attributes.properties.find(
      (p): p is ts.JsxAttribute => ts.isJsxAttribute(p) && p.name.getText(sf) === name,
    )?.initializer;
  const visit = (node: ts.Node, prefix: string, parent: string | null): void => {
    const opening = ts.isJsxElement(node) ? node.openingElement : ts.isJsxSelfClosingElement(node) ? node : null;
    if (opening && opening.tagName.getText(sf) === "Route") {
      const p = attr(opening, "path");
      const own = p && ts.isStringLiteral(p) ? p.text : null;
      const e = attr(opening, "element");
      const element = e && ts.isJsxExpression(e) && e.expression ? tagOf(e.expression) : null;
      const path =
        own === null ? null : own.startsWith("/") ? own : `${prefix.replace(/\/$/, "")}/${own}`;
      routes.push({ path, element, parent });
      ts.forEachChild(node, (child) => visit(child, path ?? prefix, element));
      return;
    }
    ts.forEachChild(node, (child) => visit(child, prefix, parent));
  };
  visit(sf, "", null);
  return routes;
}

/** The identifier App.tsx binds each module to: a static import or a `lazy(() => import(…))`. */
function bindings(file = APP): Map<string, string> {
  const sf = parse(file);
  const byModule = new Map<string, string>();
  const visit = (node: ts.Node): void => {
    if (ts.isImportDeclaration(node) && node.importClause?.name && ts.isStringLiteral(node.moduleSpecifier)) {
      byModule.set(node.moduleSpecifier.text, node.importClause.name.text);
    }
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.initializer) {
      const id = node.name.text;
      const find = (n: ts.Node): void => {
        if (
          ts.isCallExpression(n) &&
          n.expression.kind === ts.SyntaxKind.ImportKeyword &&
          n.arguments[0] &&
          ts.isStringLiteral(n.arguments[0])
        ) {
          byModule.set(n.arguments[0].text, id);
        }
        ts.forEachChild(n, find);
      };
      find(node.initializer);
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return byModule;
}

/**
 * The layout every docs page renders inside, named by its file rather than its
 * identifier, so the derivation and the floor agree on it by construction.
 */
const LAYOUT_FILE = "Demo.tsx";

/**
 * Demo page files with no route of their own, each with why. The floor fails on
 * an exemption that stops being true, the same way it fails on a page with no
 * route, so this list cannot keep a page out of the scan by going stale.
 */
export const EXEMPT: Readonly<Record<string, string>> = {
  [LAYOUT_FILE]:
    "the docs layout, not a page: a pathless route that every demo route renders inside, so it is measured on all of them",
};

const layoutId = () => bindings().get(`./pages/demo/${LAYOUT_FILE.replace(/\.tsx$/, ".js")}`) ?? null;

/** Routes nested inside the docs layout, without a leading slash, as the scan visits them. */
export function demoRoutes(): string[] {
  const layout = layoutId();
  return appRoutes()
    .filter((r) => r.path !== null && r.parent === layout)
    .map((r) => r.path!.replace(/^\//, ""));
}

/**
 * Routes App.tsx declares that the scan leaves out, with why. Printed with the
 * verdict, so what is not measured is said rather than implied.
 */
export function outsideDemo(): Array<{ path: string; reason: string }> {
  const layout = layoutId();
  return appRoutes()
    .filter((r) => r.path !== null && r.parent !== layout)
    .map((r) => ({
      path: r.path!,
      reason: r.path!.startsWith("/__fixtures")
        ? "fixtures, which contrast-painted measures"
        : r.path!.startsWith("/preview/")
          ? "the pattern; each registered preview is measured by its own route"
          : r.path === "/*"
          ? "the not-found catch-all"
          : "outside the docs layout (site page)",
    }));
}

/**
 * The preview pages the docs pages' phone-width frames load, without a leading
 * slash: one per example the preview files register, so a frame's content is
 * measured as a page of its own rather than through its iframe.
 */
export const demoPreviewRoutes = (): string[] => previewRoutes().map((r) => r.replace(/^\//, ""));

/** Each demo page file, and the routes that render it — read from the files, not the walk. */
export function demoPages(): Array<{ file: string; routes: string[] }> {
  const byModule = bindings();
  const routes = appRoutes();
  return readdirSync(PAGES_DIR)
    .filter((f) => /Demo\.tsx$/.test(f))
    .sort()
    .map((file) => {
      const id = byModule.get(`./pages/demo/${basename(file, ".tsx")}.js`);
      return {
        file,
        routes: routes
          .filter((r) => r.path !== null && id !== undefined && r.element === id)
          .map((r) => r.path!.replace(/^\//, "")),
      };
    });
}

/**
 * Sections whose content arrives after the page is ready, by route: the
 * section's heading, exactly as it renders.
 *
 * /table's Server-Side example renders a loading table and fetches its rows
 * and its category list from dummyjson.com (answered from `e2e/fixtures/` by
 * `_test.ts`) in an effect. The page heading is up before either lands, so a
 * scan that waited on the heading alone read the table with or without its
 * rows: 5342 or 5482 elements on the same tree.
 */
export const LATE_SECTIONS: Readonly<Record<string, string>> = {
  table: "Server-Side (Real API: dummyjson.com)",
};

/**
 * What a ready page has not finished painting, by name; empty once it has.
 * Runs in the page, so it is self-contained.
 *
 * Images. A lazy image below the fold is not loaded until it is scrolled near,
 * and engines differ on which images that applies to: on /country-flag the
 * "invalid code" flag resolves to `data:,` in an `<img loading="lazy">`.
 * Chromium fired its error at once and swapped in the "??" fallback; Firefox
 * and WebKit held the image until scrolled to, so the fallback a reader sees
 * there was never on the page that was measured (454 elements in Chromium,
 * 453 in the other two, 2026-10-16). So every lazy image is switched to eager
 * — what scrolling to it would do — and the page waits until each has loaded,
 * or failed and been replaced: an image that is complete with no pixels is
 * still waiting for its component to swap it out.
 *
 * Late sections. For a route in LATE_SECTIONS, its section has rows, no
 * loading table, and a filter for the category column, which appears only once
 * the category list has landed.
 *
 * A demo's own load. A section that loads after the page renders, as Table's
 * When loading fails does through useFakeLoader, marks itself
 * `data-demo-loading` while the load is in flight: measured before it lands,
 * /table read 9 elements in that section rather than 21.
 */
export function paintPending(section: string | null): string[] {
  const pending: string[] = [];
  for (const el of document.querySelectorAll("main [data-demo-loading]")) {
    pending.push(`"${el.closest("section")?.querySelector("h2")?.textContent?.trim() ?? "a section"}" is still loading its own data`);
  }
  for (const img of document.images) {
    if (img.loading === "lazy") img.loading = "eager";
    const name = `<img src="${(img.getAttribute("src") ?? "").slice(0, 60)}">`;
    if (!img.complete) pending.push(`${name} has not loaded`);
    else if (img.naturalWidth === 0) pending.push(`${name} failed and is still shown`);
  }
  if (section !== null) {
    const heading = [...document.querySelectorAll("main section h2")].find((h) => h.textContent?.trim() === section);
    const root = heading?.closest("section");
    if (!root) pending.push(`no section headed "${section}"`);
    else {
      if (root.querySelector('[role="status"][aria-label="Loading table data"]')) pending.push(`"${section}" is still loading`);
      else if (!root.querySelector("tbody tr")) pending.push(`"${section}" has no rows`);
      if (!root.querySelector('[aria-label="Filter category"]')) pending.push(`"${section}" has no category filter yet`);
    }
  }
  return pending;
}
