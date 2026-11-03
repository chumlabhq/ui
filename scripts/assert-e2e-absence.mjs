/**
 * An assertion that passes when its matcher finds nothing has to show it could
 * have found something.
 *
 * `expect(loc).toHaveCount(0)` is green for a removed element and equally green
 * for a misspelt selector, a renamed fixture or a page that never rendered.
 * `not.toHaveAttribute` and `toBeHidden` are the same, a `for` over a list read
 * from the page runs zero assertions on an empty list, and
 * `expect.poll(...).catch(() => {})` (run D's D-4) reports nothing by itself, so
 * it is worth what is asserted after it. Each of these reads as a pass with the
 * subject gone.
 *
 * What is found, per test (or per helper, when the assertion is in one):
 *
 *   absence  a negated locator matcher, `toBeHidden`, or `toHaveCount(0)`.
 *   query    `expect(x).toBe(false)` or `.toBe(0)` where x is, or was assigned
 *            from, `isVisible`, `count` and the like.
 *   loop     a `for...of`, a counted `for` or `.forEach` over a list or count
 *            read at run time, whose body asserts or reports.
 *   poll     `.catch(...)` on an `expect` or `expect.poll`.
 *
 * What pairs each one:
 *
 *   absence, query  earlier in the same function, a presence assertion on the
 *            same subject, or an action on it, since a locator's action throws
 *            when it matches nothing. Compared as source text, with the
 *            subject's own variable name: an anchor on a parent does not count,
 *            because the parent can be there with the child's selector wrong.
 *   loop     a length or floor check on the same list, before or after the loop:
 *            either way an empty list is red.
 *   poll     a later assertion or reported row reading what the poll read.
 *
 * What stays unpaired is a true absence: a surface that must never have opened,
 * so no earlier moment has it present. Those are on REASONED, each with why.
 *
 * Left out: `waitFor(...).catch` and `focus().catch`, which assert nothing and
 * are read by the next line's assertion; `expect(page)`, which has a page
 * whatever the selector; loops over a list in the source, which cannot be
 * empty at run time; and pairing across a helper's call, so a presence asserted
 * by the caller of a helper is a reasoned entry and not a pass.
 *
 * Counts are exact in both directions, as `assert-e2e-waits.mjs` is. The floor
 * is an independent regex count of the absence matchers over the same files, and
 * files are checked against `git ls-files`.
 *
 * `--self-check` plants each failure in memory and requires it to be caught.
 */
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const E2E = join(ROOT, "e2e");

/** Sites the first run of this gate found unpaired and run D2 changed so they pair. */
const FIXED = 37;

/** Keyed by file, kind and subject: a moved assertion stays on the list, a new subject does not. */
const REASONED = [
  {
    file: "e2e/_nav.ts",
    kind: "query",
    subject: "page.locator(\"[data-route-404]\")",
    count: 1,
    reason: "the not-found page must never be there; the same helper waits for the route's own page first, and a wrong selector here would leave every goto's marker wait to fail",
  },
  {
    file: "e2e/_nav.ts",
    kind: "absence",
    subject: "page.locator(\"[data-fixture-error]\")",
    count: 1,
    reason: "the fixture route's diagnostic must never be there; the next line waits for the fixture itself, which is the presence",
  },
  {
    file: "e2e/accessibility-full.spec.ts",
    kind: "absence",
    subject: "page.locator(\"[data-route-404]\")",
    count: 1,
    reason: "the not-found page must never be there; `main` for this route was waited for on the line above",
  },
  {
    file: "e2e/accessibility-full.spec.ts",
    kind: "loop",
    subject: "violations",
    count: 2,
    reason: "axe's findings: an empty list is the pass; pages audited are floored by PREVIEW_FLOOR and `audited`",
  },
  {
    file: "e2e/accessibility.spec.ts",
    kind: "loop",
    subject: "violations",
    count: 1,
    reason: "axe's findings: an empty list is the pass; the pages walked are floored by the index check and `covered`",
  },
  {
    file: "e2e/contrast-painted.spec.ts",
    kind: "loop",
    subject: "measured",
    count: 1,
    reason: "one fixture may paint nothing measurable; the sweep is floored by paths, indicators and fills",
  },
  {
    file: "e2e/default-state.spec.ts",
    kind: "poll",
    subject: "async () => (await read()).checked",
    count: 1,
    reason: "read again on the next line into `o`, whose `space` reaches `failures` through the caller, a hop this scan does not follow",
  },
  {
    file: "e2e/demo-contrast.spec.ts",
    kind: "loop",
    subject: "rows",
    count: 1,
    reason: "one page's rows may be empty; `measured` across pages is the floor printed with the verdict",
  },
  {
    file: "e2e/demo-failure.spec.ts",
    kind: "absence",
    subject: "dialog",
    count: 1,
    reason: "the dialog starts closed, and this test then shows it and asserts it visible, so the presence comes after by design",
  },
  {
    file: "e2e/demo-forms.spec.ts",
    kind: "absence",
    subject: "form.locator(\"input[type=radio]:checked\")",
    count: 1,
    reason: "no radio is checked by default; the radios themselves are asserted attached on the line above",
  },
  {
    file: "e2e/demo-long.spec.ts",
    kind: "loop",
    subject: "m.hidden",
    count: 1,
    reason: "findings: empty is the pass; `m.labels === 0` is reported on the line above it",
  },
  {
    file: "e2e/demo-phone.spec.ts",
    kind: "absence",
    subject: "inner.locator(\"[data-route-404]\")",
    count: 1,
    reason: "the not-found page must never be there; the preview's `main` is asserted present on the line above",
  },
  {
    file: "e2e/pagination.spec.ts",
    kind: "absence",
    subject: "dropdown",
    count: 1,
    reason: "the fixture has no built-in selector, which is the point; its pagination nav is asserted visible first",
  },
  {
    file: "e2e/pagination.spec.ts",
    kind: "absence",
    subject: "pageButtons",
    count: 1,
    reason: "totalPages=0 renders no page buttons, which is the point; prev and next are asserted disabled first",
  },
  {
    file: "e2e/rtl-paint.spec.ts",
    kind: "loop",
    subject: "found",
    count: 1,
    reason: "one page may have no directional icon; the whole walk's rows are floored by FLOOR",
  },
  {
    file: "e2e/stepper.spec.ts",
    kind: "absence",
    subject: "buttons",
    count: 1,
    reason: "a globally disabled stepper renders no buttons, which is the point; its nav is asserted visible first",
  },
  {
    file: "e2e/table.spec.ts",
    kind: "absence",
    subject: "page.locator('[data-fixture] tbody input')",
    count: 1,
    reason: "no editor before the double-click; the same test then asserts it visible, so the presence comes after by design",
  },
  {
    file: "e2e/table.spec.ts",
    kind: "absence",
    subject: "page.locator(\"[data-table-filter-content]\")",
    count: 1,
    reason: "Escape after a key that may or may not have opened a filter: only that nothing is left open afterwards; the row above reports whether the key acted",
  },
  {
    file: "e2e/tabpanel.spec.ts",
    kind: "absence",
    subject: "panel",
    count: 1,
    reason: "an inactive panel may be unmounted, so nothing can be asserted present before selecting it; `should display corresponding panel content when tab is activated` holds that id visible once selected",
  },
  {
    file: "e2e/toast.spec.ts",
    kind: "absence",
    subject: "progressBar",
    count: 1,
    reason: "`showProgress={false}` renders no bar, which is the point; the toast is waited for visible first",
  },
  {
    file: "e2e/tooltip.spec.ts",
    kind: "absence",
    subject: "arrow",
    count: 1,
    reason: "the fixture configures no arrow, which is the point; its tooltip is asserted visible first",
  },
  {
    file: "e2e/tooltip.spec.ts",
    kind: "absence",
    subject: "tooltip",
    count: 2,
    reason: "the disabled tooltip and the 999 ms read of the slow one: nothing may open yet, and the slow test asserts it visible 1 ms later; the disabled one's trigger is hovered first",
  },
  {
    file: "e2e/tooltip.spec.ts",
    kind: "absence",
    subject: "page.getByRole(\"tooltip\")",
    count: 2,
    reason: "a tooltip that must stay shut: a click and a focus handed back from a dialog never open it; `reveal` tests hold the same role visible",
  },
  {
    file: "e2e/waived-keys.spec.ts",
    kind: "absence",
    subject: "page.locator(\".ovr-input\")",
    count: 1,
    reason: "no editor before the double-click; the same test then finds the class on it, so the presence comes after by design",
  },
  {
    file: "e2e/waived-keys.spec.ts",
    kind: "absence",
    subject: "page.locator(\".ovr-marker-tooltip\")",
    count: 1,
    reason: "the class has no sink, which is the point: the key was deleted; the tooltip itself is asserted open first",
  },
];

/** Matchers that take a locator, and so pass negated on a locator matching nothing. */
const LOCATOR_MATCHERS = new Set([
  "toBeAttached", "toBeChecked", "toBeDisabled", "toBeEditable", "toBeEmpty", "toBeEnabled", "toBeFocused",
  "toBeInViewport", "toBeVisible", "toContainText", "toHaveAccessibleDescription", "toHaveAccessibleName",
  "toHaveAttribute", "toHaveClass", "toHaveCSS", "toHaveId", "toHaveJSProperty", "toHaveRole", "toHaveText",
  "toHaveValue", "toHaveValues",
]);
const ACTIONS = new Set([
  "blur", "boundingBox", "check", "clear", "click", "dblclick", "dragTo", "evaluate", "fill", "focus", "getAttribute",
  "hover", "innerText", "inputValue", "press", "pressSequentially", "screenshot", "scrollIntoViewIfNeeded",
  "selectOption", "setChecked", "tap", "textContent", "type", "uncheck",
]);
/** This suite's helpers that act on the locator they are given, which throws if it matches nothing. */
const ACTING_HELPERS = new Set(["activateByTouch", "press", "reveal", "tapOrClick"]);
const QUERIES = new Set(["count", "isChecked", "isDisabled", "isEditable", "isEnabled", "isVisible"]);
/** How this suite reports a finding without an `expect` of its own. */
const REPORTERS = new Set(["check", "failures", "findings", "problems", "row", "rows", "unmeasured"]);

/** A loop body that can fail the test: an `expect`, or a row of this suite's reporters. */
const ASSERTS = /\bexpect\s*[.(]|\b(check|row)\(|\b(failures|findings|problems|rows|unmeasured)\.push\(/;

const norm = (text) => text.replace(/\s+/g, " ").trim();
const unwrap = (n) => {
  while (ts.isAwaitExpression(n) || ts.isParenthesizedExpression(n) || ts.isNonNullExpression(n) || ts.isAsExpression(n)) n = n.expression;
  return n;
};

/** `expect(x).not.y(...)` as `{ subject, negated, matcher, call }`, or null. `expect.soft` and a message count. */
function expectation(call) {
  if (!ts.isCallExpression(call) || !ts.isPropertyAccessExpression(call.expression)) return null;
  const matcher = call.expression.name.text;
  let target = call.expression.expression;
  let negated = false;
  if (ts.isPropertyAccessExpression(target) && target.name.text === "not") {
    negated = true;
    target = target.expression;
  }
  if (!ts.isCallExpression(target)) return null;
  const head = target.expression.getText();
  if (head !== "expect" && head !== "expect.soft") return null;
  if (!target.arguments.length) return null;
  return { subject: target.arguments[0], negated, matcher, call };
}

const isTestCall = (node) =>
  ts.isCallExpression(node) && /^test(\.(only|fixme|skip|slow))?$/.test(node.expression.getText());

/** The test or helper an assertion belongs to: its outermost function below the module. */
function scopeOf(node) {
  let scope = null;
  for (let n = node.parent; n; n = n.parent) {
    if (ts.isFunctionLike(n)) {
      scope = n;
      if (n.parent && isTestCall(n.parent)) return n;
    }
  }
  return scope;
}

const titleOf = (scope) => {
  const parent = scope?.parent;
  if (parent && isTestCall(parent)) return parent.arguments[0]?.getText().slice(1, -1) ?? "test";
  const named = scope?.name ?? (scope?.parent && ts.isVariableDeclaration(scope.parent) ? scope.parent.name : null);
  return named ? named.getText() : "(module)";
};

/** Names mentioned in an expression, for following a value into later assertions. */
function namesIn(node, out = new Set()) {
  if (ts.isIdentifier(node)) out.add(node.text);
  ts.forEachChild(node, (c) => {
    namesIn(c, out);
  });
  return out;
}

/** A variable's initializer in this scope, from the last declaration before `pos`. */
function initializerOf(scope, name, pos) {
  let found = null;
  const visit = (n) => {
    if (ts.isVariableDeclaration(n) && ts.isIdentifier(n.name) && n.name.text === name && n.initializer && n.getStart() < pos) found = n.initializer;
    ts.forEachChild(n, visit);
  };
  visit(scope);
  return found;
}

const readsThePage = (expr) => {
  let hit = false;
  const visit = (n) => {
    if (ts.isAwaitExpression(n)) hit = true;
    // A callback's own `await` runs later, if at all; the list is not read from it.
    if (!hit && !ts.isFunctionLike(n)) ts.forEachChild(n, visit);
  };
  visit(expr);
  return hit;
};

/** Whether a list's expression is read at run time, following `.filter`, `.map` and local names. */
function listIsRuntime(scope, expr, pos, seen = new Set()) {
  const e = unwrap(expr);
  if (readsThePage(expr)) return true;
  if (ts.isIdentifier(e)) {
    if (seen.has(e.text)) return false;
    seen.add(e.text);
    const init = initializerOf(scope, e.text, pos);
    return init ? listIsRuntime(scope, init, pos, seen) : false;
  }
  if (ts.isCallExpression(e) && ts.isPropertyAccessExpression(e.expression)) {
    return listIsRuntime(scope, e.expression.expression, pos, seen) || e.arguments.some((a) => !ts.isFunctionLike(a) && listIsRuntime(scope, a, pos, seen));
  }
  if (ts.isPropertyAccessExpression(e)) return listIsRuntime(scope, e.expression, pos, seen);
  if (ts.isArrayLiteralExpression(e)) return e.elements.some((el) => ts.isSpreadElement(el) && listIsRuntime(scope, el.expression, pos, seen));
  return false;
}

function presenceAt(scope, subject, before) {
  let via = null;
  const visit = (n) => {
    if (via || n.getStart() >= before) return;
    if (ts.isCallExpression(n)) {
      const e = expectation(n);
      if (e && e.negated && e.matcher === "toHaveCount" && e.call.arguments[0]?.getText() === "0" && norm(e.subject.getText()) === subject) via = `expect(${subject}).not.toHaveCount(0)`;
      if (e && !e.negated && norm(e.subject.getText()) === subject) {
        const zero = e.matcher === "toHaveCount" && e.call.arguments[0]?.getText() === "0";
        if (!zero && e.matcher !== "toBeHidden" && (LOCATOR_MATCHERS.has(e.matcher) || e.matcher === "toHaveCount")) via = `expect(${subject}).${e.matcher}`;
      }
      if (e && !e.negated && /GreaterThan/.test(e.matcher) && norm(e.subject.getText()).includes(`${subject}.count()`)) via = `count of ${subject}`;
      if (!e && ts.isPropertyAccessExpression(n.expression) && norm(n.expression.expression.getText()) === subject) {
        const name = n.expression.name.text;
        if (ACTIONS.has(name)) via = `${subject}.${name}()`;
        if (name === "waitFor" && !/hidden|detached/.test(n.arguments[0]?.getText() ?? "")) via = `${subject}.waitFor()`;
      }
      if (!via && ts.isIdentifier(n.expression) && ACTING_HELPERS.has(n.expression.text) && n.arguments.some((a) => norm(a.getText()) === subject)) {
        via = `${n.expression.text}(${subject})`;
      }
    }
    if (!via) ts.forEachChild(n, visit);
  };
  visit(scope);
  return via;
}

/** A length or floor check naming the list, anywhere in the scope. */
function floorOn(scope, list) {
  let via = null;
  const named = (text) => new RegExp(`\\b${list.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b(\\.length|\\.size)`).test(text);
  const visit = (n) => {
    if (via) return;
    if (ts.isCallExpression(n)) {
      const e = expectation(n);
      if (e && norm(e.subject.getText()) === list && !e.negated && /GreaterThan/.test(e.matcher)) via = `expect(${list}).${e.matcher}`;
      if (e && norm(e.subject.getText()) === list && !e.negated && e.matcher === "toBe" && /^[1-9]\d*$/.test(e.call.arguments[0]?.getText() ?? "")) via = `expect(${list}).toBe(${e.call.arguments[0].getText()})`;
      if (e && named(norm(e.subject.getText())) && !e.negated === /GreaterThan|toBe$|toEqual/.test(e.matcher)) via = `expect(${norm(e.subject.getText())}).${e.matcher}`;
      if (e && norm(e.subject.getText()) === list && (e.matcher === "toHaveLength" || (e.negated && /toEqual|toHaveLength/.test(e.matcher)))) via = `expect(${list}).${e.matcher}`;
    }
    if (ts.isIfStatement(n) && named(norm(n.expression.getText()))) {
      let fails = false;
      const t = (c) => {
        if (ts.isThrowStatement(c) || (ts.isCallExpression(c) && REPORTERS.has(c.expression.getText().split(".")[0]))) fails = true;
        else ts.forEachChild(c, t);
      };
      t(n.thenStatement);
      if (fails) via = `if (${norm(n.expression.getText())}) reported`;
    }
    if (!via) ts.forEachChild(n, visit);
  };
  visit(scope);
  return via;
}

/** A later assertion or reported row reading what the poll read, following one assignment. */
function assertedAfter(scope, polled, after) {
  const names = new Set([...polled].filter((n) => !["expect", "page", "async", "await"].includes(n)));
  let via = null;
  const walk = (n) => {
    if (via) return;
    if (n.getStart() > after) {
      if (ts.isVariableDeclaration(n) && n.initializer && [...namesIn(n.initializer)].some((x) => names.has(x)) && ts.isIdentifier(n.name)) names.add(n.name.text);
      if (ts.isBinaryExpression(n) && n.operatorToken.kind === ts.SyntaxKind.EqualsToken && [...namesIn(n.right)].some((x) => names.has(x))) {
        names.add(n.left.getText().split(".")[0]);
      }
      if (ts.isCallExpression(n)) {
        const e = expectation(n);
        const head = n.expression.getText().split(".")[0];
        const reports = e || REPORTERS.has(head);
        if (reports && [...namesIn(e ? e.subject : n)].some((x) => names.has(x))) via = norm(n.getText()).slice(0, 60);
      }
      if (ts.isIfStatement(n) && [...namesIn(n.expression)].some((x) => names.has(x))) {
        let pushes = false;
        const t = (c) => {
          if (ts.isCallExpression(c) && REPORTERS.has(c.expression.getText().split(".")[0])) pushes = true;
          ts.forEachChild(c, t);
        };
        t(n.thenStatement);
        if (pushes) via = `if (${norm(n.expression.getText()).slice(0, 50)}) reported`;
      }
    }
    ts.forEachChild(n, walk);
  };
  walk(scope);
  return via;
}

/** Every site in one file's source, each `{ kind, file, line, test, subject, text, paired }`. */
export function scan(source, file = "file.ts") {
  const sf = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, file.endsWith("x") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const sites = [];
  const add = (kind, node, scope, subject, paired) =>
    sites.push({
      kind,
      file,
      line: sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1,
      test: titleOf(scope),
      subject,
      text: norm(node.getText(sf)).slice(0, 90),
      paired,
    });

  const visit = (node) => {
    if (ts.isCallExpression(node)) {
      const e = expectation(node);
      if (e) {
        const scope = scopeOf(node);
        const subject = norm(e.subject.getText(sf));
        const absent =
          (e.negated && LOCATOR_MATCHERS.has(e.matcher)) ||
          (!e.negated && e.matcher === "toBeHidden") ||
          (!e.negated && e.matcher === "toHaveCount" && node.arguments[0]?.getText(sf) === "0");
        if (absent && scope && !/^page$/.test(subject)) add("absence", node, scope, subject, presenceAt(scope, subject, node.getStart(sf)));

        const falsy = !e.negated && e.matcher === "toBe" && ["false", "0"].includes(node.arguments[0]?.getText(sf));
        if (falsy && scope) {
          let value = unwrap(e.subject);
          if (ts.isIdentifier(value)) value = initializerOf(scope, value.text, node.getStart(sf)) ?? value;
          value = unwrap(value);
          if (ts.isCallExpression(value) && ts.isPropertyAccessExpression(value.expression) && value.expression.name.text === "catch") value = unwrap(value.expression.expression);
          if (ts.isCallExpression(value) && ts.isPropertyAccessExpression(value.expression) && QUERIES.has(value.expression.name.text)) {
            const queried = norm(value.expression.expression.getText(sf));
            add("query", node, scope, queried, presenceAt(scope, queried, node.getStart(sf)));
          }
        }
      }
      if (ts.isPropertyAccessExpression(node.expression) && node.expression.name.text === "catch") {
        const text = node.expression.expression.getText(sf);
        if (/^(await\s+)?expect\b/.test(norm(text))) {
          const scope = scopeOf(node);
          const polled = new Set();
          let inner = node.expression.expression;
          while (inner && !(ts.isCallExpression(inner) && /^expect(\.poll)?$/.test(inner.expression.getText(sf).replace(/\s/g, "")))) {
            inner = ts.isCallExpression(inner) || ts.isPropertyAccessExpression(inner) ? inner.expression : null;
          }
          if (inner?.arguments[0]) namesIn(inner.arguments[0], polled);
          add("poll", node, scope, norm(inner?.arguments[0]?.getText(sf) ?? ""), scope ? assertedAfter(scope, polled, node.getEnd()) : null);
        }
      }
      if (ts.isPropertyAccessExpression(node.expression) && node.expression.name.text === "forEach") {
        const scope = scopeOf(node);
        const list = node.expression.expression;
        if (scope && ASSERTS.test(node.getText(sf)) && listIsRuntime(scope, list, node.getStart(sf))) {
          add("loop", node, scope, norm(list.getText(sf)), floorOn(scope, norm(list.getText(sf))));
        }
      }
    }
    if (ts.isForOfStatement(node)) {
      const scope = scopeOf(node);
      if (scope && ASSERTS.test(node.statement.getText(sf)) && listIsRuntime(scope, node.expression, node.getStart(sf))) {
        const list = norm(unwrap(node.expression).getText(sf));
        add("loop", node, scope, list, floorOn(scope, list));
      }
    }
    if (ts.isForStatement(node) && node.condition && ts.isBinaryExpression(node.condition) && node.condition.operatorToken.kind === ts.SyntaxKind.LessThanToken) {
      const scope = scopeOf(node);
      const bound = node.condition.right;
      if (scope && ASSERTS.test(node.statement.getText(sf)) && listIsRuntime(scope, bound, node.getStart(sf))) {
        const list = norm((ts.isPropertyAccessExpression(bound) ? bound.expression : unwrap(bound)).getText(sf));
        add("loop", node, scope, list, floorOn(scope, list));
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return sites;
}

/** Compares the unpaired sites with the list; returns every problem, each a line to print. */
export function audit(sites, reasoned = REASONED) {
  const problems = [];
  const key = (s) => `${s.file} ${s.kind} ${s.subject}`;
  const have = new Map();
  for (const s of sites.filter((x) => !x.paired)) {
    if (!have.has(key(s))) have.set(key(s), []);
    have.get(key(s)).push(s);
  }
  const allowed = new Map(reasoned.map((r) => [key(r), r.count]));
  for (const [k, list] of have) {
    const room = allowed.get(k) ?? 0;
    if (list.length > room) {
      const at = list.map((s) => `${s.line} "${s.test}"`).join("; ");
      problems.push(`${k}: ${list.length} unpaired, ${room} reasoned (${at}). Assert it present first; a true absence goes on REASONED with why.`);
    }
  }
  for (const [k, count] of allowed) {
    const n = have.get(k)?.length ?? 0;
    if (n < count) problems.push(`${k}: ${count} reasoned, ${n} unpaired. Drop the entry so the count comes down with it.`);
  }
  return problems;
}

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = join(dir, d.name);
    if (d.isDirectory()) return walk(p);
    return /\.tsx?$/.test(d.name) ? [p] : [];
  });
}

function selfCheck() {
  const code = (body) => `test("t", async ({ page }) => {\n  const a = page.locator("a");\n${body}\n});`;
  const paired = (name, body, kind, want) => {
    const site = scan(code(body)).find((s) => s.kind === kind);
    if (!site || !!site.paired !== want) {
      console.error(`✗ self-check: ${name}: wanted ${kind} paired=${want}, got ${JSON.stringify(site)}`);
      process.exit(1);
    }
  };
  paired("toHaveCount(0) alone", "await expect(a).toHaveCount(0);", "absence", false);
  paired("not.toBeVisible alone", "await expect(a).not.toBeVisible();", "absence", false);
  paired("toBeHidden alone", "await expect(a).toBeHidden();", "absence", false);
  paired("not.toHaveAttribute alone", 'await expect(a).not.toHaveAttribute("x");', "absence", false);
  paired("presence first", "await expect(a).toBeVisible();\nawait expect(a).toHaveCount(0);", "absence", true);
  paired("presence after does not pair", "await expect(a).toHaveCount(0);\nawait expect(a).toBeVisible();", "absence", false);
  paired("an action first", "await a.click();\nawait expect(a).toBeHidden();", "absence", true);
  paired("another subject does not pair", 'await expect(page.locator("b")).toBeVisible();\nawait expect(a).toHaveCount(0);', "absence", false);
  paired("a query alone", "const v = await a.isVisible();\nexpect(v).toBe(false);", "query", false);
  paired("a query with presence", "await expect(a).toBeVisible();\nexpect(await a.isVisible()).toBe(false);", "query", true);
  paired("a loop alone", "const rows = await a.all();\nfor (const r of rows) expect(r).toBeTruthy();", "loop", false);
  paired("a loop with a floor", "const rows = await a.all();\nexpect(rows.length).toBeGreaterThan(3);\nfor (const r of rows) expect(r).toBeTruthy();", "loop", true);
  paired("a poll nothing reads", "const read = () => a.count();\nawait expect.poll(read).toBe(1).catch(() => {});", "poll", false);
  paired("a poll read after", "const read = () => a.count();\nawait expect.poll(read).toBe(1).catch(() => {});\nconst n = await read();\nexpect(n).toBe(1);", "poll", true);
  if (scan(code("for (const r of [1, 2]) expect(r).toBeTruthy();")).length) {
    console.error("✗ self-check: a loop over a list in the source was reported");
    process.exit(1);
  }
  if (scan('// await expect(a).toHaveCount(0);\nconst s = "await expect(a).toBeHidden()";').length) {
    console.error("✗ self-check: a comment or a string was read as a call");
    process.exit(1);
  }
  const site = { kind: "absence", file: "e2e/a.spec.ts", subject: "a", line: 1, test: "t", paired: null };
  const entry = { kind: "absence", file: "e2e/a.spec.ts", subject: "a", count: 1, reason: "r" };
  const expectProblem = (name, sites, list, fragment) => {
    if (!audit(sites, list).some((p) => p.includes(fragment))) {
      console.error(`✗ self-check: ${name}: wanted a problem naming "${fragment}"`);
      process.exit(1);
    }
  };
  expectProblem("an unpaired site nothing lists", [site], [], "1 unpaired, 0 reasoned");
  expectProblem("a second site on one entry", [site, { ...site, line: 2 }], [entry], "2 unpaired, 1 reasoned");
  expectProblem("an entry whose site has gone", [], [entry], "1 reasoned, 0 unpaired");
  if (audit([site], [entry]).length) {
    console.error("✗ self-check: an exact match reported a problem");
    process.exit(1);
  }
  console.log("✓ self-check: each kind unpaired, presence after, another subject, a stale entry and an over-count are caught; a comment, a string and a literal list are not");
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  if (process.argv.includes("--self-check")) {
    selfCheck();
    process.exit(0);
  }
  const files = walk(E2E);
  const sites = files.flatMap((p) => scan(readFileSync(p, "utf8"), relative(ROOT, p)));

  const FLOOR_RE = /\.not\.to(BeVisible|HaveAttribute)\b|\.toBeHidden\(|\.toHaveCount\(0\)/g;
  const floor = files.reduce((sum, p) => {
    const code = readFileSync(p, "utf8").split("\n").filter((l) => !/^\s*(\/\/|\*)/.test(l)).join("\n");
    return sum + (code.match(FLOOR_RE) ?? []).length;
  }, 0);
  const absences = sites.filter((s) => s.kind === "absence").length;
  const tracked = execFileSync("git", ["ls-files", "e2e"], { cwd: ROOT, encoding: "utf8" })
    .split("\n")
    .filter((f) => /\.tsx?$/.test(f)).length;

  const paired = sites.filter((s) => s.paired).length;
  const reasoned = REASONED.reduce((sum, r) => sum + r.count, 0);
  const problems = audit(sites);
  if (absences < floor) problems.push(`the AST read ${absences} absence assertions and a plain count reads ${floor}: the scan lost some`);
  if (files.length < tracked) problems.push(`scanned ${files.length} files, git tracks ${tracked} under e2e/`);

  const kinds = ["absence", "query", "loop", "poll"].map((k) => `${k} ${sites.filter((s) => s.kind === k).length}`).join(", ");
  const line = `E2E_ABSENCE found ${sites.length} (${kinds}; absence floor ${floor}, plain count), paired ${paired}, fixed ${FIXED}, reasoned ${reasoned}; files ${files.length}, floor ${tracked} (git ls-files)`;
  if (process.argv.includes("--list")) for (const s of sites) console.log(`${s.paired ? "paired  " : "UNPAIRED"} ${s.kind.padEnd(7)} ${s.file}:${s.line} [${s.test}] ${s.subject} :: ${s.paired ?? ""}`);
  if (problems.length) {
    console.error(`✗ ${line}`);
    for (const p of problems) console.error(`    ${p}`);
    process.exit(1);
  }
  console.log(`✓ ${line}`);
}
