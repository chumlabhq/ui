import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import ts from "typescript";
import { BLOCKED_HOSTS, test, expect } from "./_test";

/**
 * Third-party hosts never reach the network, in any engine.
 *
 * The home page requests them itself — `index.html` loads Razorpay's checkout
 * script with `defer` — so a count of zero means nothing asked, and fails
 * rather than passing for want of a request. Demo data (dummyjson, unsplash)
 * is what the demos render, so it is allowed through and is the only
 * third-party traffic that may answer.
 */
const DEMO_DATA = /(^|\.)(dummyjson\.com|unsplash\.com)$/;
const isThirdParty = (host: string) => host !== "localhost" && host !== "127.0.0.1";

test("third-party hosts are aborted before the network", async ({ page }, testInfo) => {
  const requested = new Map<string, number>();
  const failed = new Map<string, string>();
  const answered: string[] = [];
  page.on("request", (request) => {
    const { hostname, protocol } = new URL(request.url());
    if (!protocol.startsWith("http") || !isThirdParty(hostname)) return;
    requested.set(hostname, (requested.get(hostname) ?? 0) + 1);
  });
  page.on("requestfailed", (request) => {
    failed.set(new URL(request.url()).hostname, request.failure()?.errorText ?? "");
  });
  page.on("response", (response) => {
    const { hostname } = new URL(response.url());
    if (isThirdParty(hostname) && !DEMO_DATA.test(hostname)) answered.push(`${hostname} ${response.status()}`);
  });

  await page.goto("/", { waitUntil: "load" });
  const load = await page.evaluate(() =>
    Math.round((performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming).loadEventEnd),
  );

  const blocked = [...requested].filter(([host]) => BLOCKED_HOSTS.test(host));
  for (const [host, count] of blocked) console.log(`[${testInfo.project.name}] blocked: ${host} → ${count} (${failed.get(host)})`);
  console.log(`[${testInfo.project.name}] home load: ${load}ms`);

  expect(requested.get("checkout.razorpay.com") ?? 0, "the home page requests checkout.razorpay.com").toBeGreaterThan(0);
  expect(answered, "third-party responses other than demo data").toEqual([]);
  for (const [host] of blocked) expect(failed.has(host), `${host} aborted`).toBe(true);
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
  expect(files.length, "e2e/**/*.ts files checked").toBeGreaterThanOrEqual(42);
  expect(direct, "these bypass the third-party block in _test.ts").toEqual([]);
});
