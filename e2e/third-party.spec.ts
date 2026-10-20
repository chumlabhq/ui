import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import ts from "typescript";
import type { Page } from "@playwright/test";
import { BLOCKED_HOSTS, STUB_HEADER, test, expect } from "./_test";
import { LATE_SECTIONS, demoRoutes, paintPending } from "./_demo-routes";

/**
 * Third-party hosts never reach the network, in any engine.
 *
 * Every request to a host other than localhost is one of three things:
 * - stubbed: demo data answered from `e2e/fixtures/` by `_test.ts`, carrying
 *   STUB_HEADER;
 * - blocked: aborted by `_test.ts` (BLOCKED_HOSTS), or refused by the dev
 *   server's CSP before it leaves the browser — Chromium reports Google Tag
 *   Manager and Clarity as requests that fail with `csp`, where Firefox and
 *   WebKit never report them at all;
 * - unhandled: anything else, answered by the network or aborted only by the
 *   catch-all in `_test.ts`. One is a failure: the host is named here, then
 *   stubbed or blocked in `_test.ts`.
 *
 * The home page requests Razorpay itself — `index.html` loads its checkout
 * script with `defer` — so a count of zero means nothing asked, and fails
 * rather than passing for want of a request.
 */
const isThirdParty = (host: string) => host !== "localhost" && host !== "127.0.0.1";

type Kind = "stubbed" | "blocked" | "unhandled";

function watchThirdParty(page: Page) {
  const seen: Array<{ host: string; url: string; kind: Kind; how: string }> = [];
  let inFlight = 0;
  const remote = (url: string) => {
    const { hostname, protocol } = new URL(url);
    return protocol.startsWith("http") && isThirdParty(hostname) ? hostname : null;
  };
  page.on("request", (request) => {
    if (remote(request.url())) inFlight += 1;
  });
  page.on("requestfinished", async (request) => {
    const host = remote(request.url());
    if (!host) return;
    const stubbed = (await request.response())?.headers()[STUB_HEADER] !== undefined;
    seen.push({ host, url: request.url(), kind: stubbed ? "stubbed" : "unhandled", how: stubbed ? "stub" : "network" });
    inFlight -= 1;
  });
  page.on("requestfailed", (request) => {
    const host = remote(request.url());
    if (!host) return;
    const error = request.failure()?.errorText ?? "";
    const csp = /csp|content security/i.test(error);
    const kind: Kind = BLOCKED_HOSTS.test(host) || csp ? "blocked" : "unhandled";
    seen.push({ host, url: request.url(), kind, how: csp ? "csp" : error });
    inFlight -= 1;
  });
  /**
   * A duplicate request to a URL the suite has already stubbed or blocked is
   * not an unhandled request: the engine cancelled a second request to a URL
   * it had an answer for in flight. Firefox is the engine that does it — the
   * errorText is `NS_BINDING_ABORTED` — and before this reclassification the
   * second /avatar's `images.unsplash.com` photo was counted as unhandled and
   * failed the whole run.
   *
   * Narrow by rule: the cancelled URL must equal, byte for byte, a URL already
   * recorded as `stubbed` or `blocked`, and the cancellation must look like an
   * abort rather than a network or policy failure. A genuinely unroute-able
   * URL (any new host) stays `unhandled` and the spec still fails on it. Run
   * once after `inFlight` drains, so a reorder between `requestfailed` of the
   * duplicate and `requestfinished` of its handled sibling does not matter.
   */
  const reclassifyDuplicateAborts = () => {
    const abort = /abort|NS_BINDING_ABORTED|ERR_ABORTED/i;
    const handled = new Map<string, { kind: Kind; how: string }>();
    for (const r of seen) if (r.kind === "stubbed" || r.kind === "blocked") handled.set(r.url, r);
    for (const r of seen) {
      if (r.kind !== "unhandled") continue;
      if (!abort.test(r.how)) continue;
      const sibling = handled.get(r.url);
      if (!sibling) continue;
      r.kind = sibling.kind;
      r.how = `duplicate aborted (${r.how}), original ${sibling.how}`;
    }
  };
  return { seen, inFlight: () => inFlight, reclassifyDuplicateAborts };
}

test("third-party hosts are aborted before the network", async ({ page }, testInfo) => {
  const { seen, reclassifyDuplicateAborts } = watchThirdParty(page);

  await page.goto("/", { waitUntil: "load" });
  const load = await page.evaluate(() =>
    Math.round((performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming).loadEventEnd),
  );
  reclassifyDuplicateAborts();

  const razorpay = seen.filter((r) => r.host === "checkout.razorpay.com");
  for (const r of seen) console.log(`[${testInfo.project.name}] ${r.kind}: ${r.host} (${r.how})`);
  console.log(`[${testInfo.project.name}] home load: ${load}ms`);

  expect(razorpay.length, "the home page requests checkout.razorpay.com").toBeGreaterThan(0);
  expect(razorpay.map((r) => r.kind), "checkout.razorpay.com aborted").toEqual(razorpay.map(() => "blocked"));
  expect(seen.filter((r) => r.kind === "unhandled").map((r) => `${r.host} ${r.how}`), "third-party requests neither stubbed nor blocked").toEqual([]);
});

/**
 * Every demo page, not only the home page: the demos are where remote data
 * was. Each page is read once it is ready and has painted what arrives late —
 * lazy images switched to eager, /table's fetched rows (`paintPending`) — and
 * no third-party request is still in flight, so a request made in an effect
 * or by an image below the fold is counted, not missed.
 */
test("every demo page's third-party requests are stubbed or blocked", async ({ page }, testInfo) => {
  test.setTimeout(300_000);
  const { seen, inFlight, reclassifyDuplicateAborts } = watchThirdParty(page);
  const routes = ["", ...demoRoutes()];
  const painted = new Function("section", `return (${paintPending})(section).length === 0;`) as (
    section: string | null,
  ) => boolean;

  for (const route of routes) {
    await page.goto(`/${route}`, { waitUntil: "load" });
    if (route) {
      await page.waitForFunction(() => {
        const main = document.querySelector("main");
        return !!main && !main.querySelector(".suspense-delayed") && !!main.querySelector("header h1")?.textContent?.trim();
      });
      await page.waitForFunction(painted, LATE_SECTIONS[route] ?? null);
    }
    await expect.poll(inFlight, `third-party requests still in flight on /${route}`).toBe(0);
  }
  reclassifyDuplicateAborts();

  const count = (kind: Kind) => seen.filter((r) => r.kind === kind).length;
  const byHost = new Map<string, number>();
  for (const r of seen) byHost.set(`${r.kind} ${r.host} (${r.how})`, (byHost.get(`${r.kind} ${r.host} (${r.how})`) ?? 0) + 1);
  console.log(
    `[${testInfo.project.name}] third-party requests: stubbed ${count("stubbed")}, blocked ${count("blocked")}, ` +
      `unhandled ${count("unhandled")} over ${routes.length} pages`,
  );
  for (const [key, n] of [...byHost].sort()) console.log(`[${testInfo.project.name}]   ${key} → ${n}`);

  expect(
    seen.filter((r) => r.kind === "unhandled").map((r) => `${r.host} (${r.how}) ${r.url.slice(0, 100)}`),
    "third-party requests neither stubbed nor blocked — stub or block the host in _test.ts",
  ).toEqual([]);
  // A stub nothing asks for is a stub that would hide nothing; each host must
  // still be requested, or the page that used it changed and so should this.
  const stubbedHosts = [...new Set(seen.filter((r) => r.kind === "stubbed").map((r) => r.host))].sort();
  expect(stubbedHosts, "every stubbed host is requested by some demo page").toEqual([
    "cdn.dummyjson.com",
    "dummyjson.com",
    "images.unsplash.com",
  ]);
});

/**
 * Read on the TypeScript AST, not as text, so a multi-line import, a namespace
 * import or `import * as pw` is seen the same as `import { test }`. Flagged: any
 * non-type import declaration of "@playwright/test" that binds `test` or the
 * whole module. Type-only imports (`import type { Page }`) carry no runtime
 * `test` and are allowed; `_test.ts` is the one file that must import it.
 */
function directTestImports(file: string): string[] {
  const source = ts.createSourceFile(file, readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true);
  const found: string[] = [];
  for (const statement of source.statements) {
    if (!ts.isImportDeclaration(statement)) continue;
    if (!ts.isStringLiteral(statement.moduleSpecifier) || statement.moduleSpecifier.text !== "@playwright/test") continue;
    const clause = statement.importClause;
    if (!clause || clause.isTypeOnly) continue;
    const bindings = clause.namedBindings;
    const whole = clause.name !== undefined || (bindings !== undefined && ts.isNamespaceImport(bindings));
    const named =
      bindings !== undefined &&
      ts.isNamedImports(bindings) &&
      bindings.elements.some((element) => !element.isTypeOnly && (element.propertyName ?? element.name).text === "test");
    if (whole || named) found.push(`${file.replace(`${process.cwd()}/`, "")}:${source.getLineAndCharacterOfPosition(statement.getStart()).line + 1}`);
  }
  return found;
}

test("every spec takes test from the shared fixture", () => {
  const dir = resolve(process.cwd(), "e2e");
  const files = (readdirSync(dir, { recursive: true }) as string[])
    .filter((file) => file.endsWith(".ts") && file !== "_test.ts")
    .map((file) => resolve(dir, file));
  const direct = files.flatMap(directTestImports);
  console.log(`direct @playwright/test imports: checked ${files.length} files, found ${direct.length}${direct.length ? ` — ${direct.join(", ")}` : ""}`);
  // 42 from G4 (a3508960) until G1, which found 65 checked at aca8bcac: 23
  // files could have left the walk without failing it.
  expect(files.length, "e2e/**/*.ts files checked").toBeGreaterThanOrEqual(65);
  expect(direct, "these bypass the third-party block in _test.ts").toEqual([]);
});
