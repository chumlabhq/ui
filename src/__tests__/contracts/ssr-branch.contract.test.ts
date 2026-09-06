/**
 * No component may ask whether it is in a browser while it is rendering.
 *
 * This is the general form of five defects the consumer matrix found on
 * 2026-09-07, all of them the same shape and none of them visible to any suite
 * in this repo. `ToastProvider` chose its portal target with
 * `isBrowser ? document.body : null`; `Modal`, `Drawer` and `MenuSurface` —
 * nine more components through the last one — returned `null` on a server and a
 * portal on the client; `Table` seeded its viewport width from
 * `window.innerWidth`; `Accordion` read `localStorage` in a state initializer.
 * Each produced a first client render the server never sent, which React
 * reports as a hydration mismatch — #418, whose text names the cause before
 * anything else: "a server/client branch `if (typeof window !== 'undefined')`".
 *
 * Why a source gate rather than a test: `hydration.contract` runs under jsdom,
 * where `window` exists during the "server" render too, so every one of these
 * branches takes the same path on both sides and the mismatch cannot occur
 * there. `ssr.contract` has no DOM but never hydrates. Only the consumer matrix
 * can see the failure, and it costs four minutes and nine npm installs. This
 * reads the source instead, in milliseconds, and it would have caught all five.
 *
 * The rule is about WHEN, not whether:
 *   - in an effect, a callback, an event handler or a `useSyncExternalStore`
 *     argument — fine, none of them run while the server renders
 *   - in a component body, a `useState` initializer or a `useMemo` — a defect,
 *     because all three run during the render React compares against the server
 *
 * `useHydrated()` is the sanctioned answer: false on the server AND during
 * hydration, true from the render after.
 *
 * It reads through one call, too, because one of the five hid there: Accordion
 * branched inside `readFromStorage` — legitimately, in a `useCallback` — and
 * then CALLED it from a `useState` initializer, which is a render. A gate that
 * only looked for `isBrowser` in a render path would have caught four of the
 * five. So any function whose body asks the question is tainted, transitively
 * by name, and calling one while rendering is the same defect as asking
 * directly.
 */
import { describe, expect, it } from "vitest";
import ts from "typescript";

const sources = import.meta.glob("../../{components,utils}/**/*.{ts,tsx}", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

/** Marketing, demos and the tests themselves; the same list `constants.contract` keeps. */
const NOT_SHIPPED =
  /(CatalogSection|ChumlabComparison|GetStarted|SiteHeader|SiteFooter|BuyMeCoffee|WhyChumlab|Typographic|UserMenu|Announcement|FaqLogo|Reveal|\/ui\/|BrandLogo|__tests__|\.test\.)/;

/** Where the environment question is legitimately asked. */
const DEFERRED_CALLS = new Set([
  "useEffect",
  "useLayoutEffect",
  "useIsomorphicLayoutEffect",
  "useCallback",
  "useSyncExternalStore",
  "useImperativeHandle",
  "requestAnimationFrame",
  "setTimeout",
  "setInterval",
  "queueMicrotask",
  "addEventListener",
  "removeEventListener",
  "then",
  "catch",
  "finally",
]);

/**
 * `isBrowser.ts` is the definition, and `useHydrated.ts` is the fix — the one
 * hook whose job is to answer this question safely. Everything else in the
 * shipped source is subject to the rule.
 */
const EXEMPT = /utils\/(isBrowser|useHydrated)\.ts$/;

interface Finding {
  file: string;
  line: number;
  inside: string;
  text: string;
}

const isFunctionLike = (node: ts.Node): boolean =>
  ts.isFunctionDeclaration(node) ||
  ts.isFunctionExpression(node) ||
  ts.isArrowFunction(node) ||
  ts.isMethodDeclaration(node);

/** The name a function is known by, for the report and for the render-path test. */
function functionName(node: ts.Node): string {
  if ((ts.isFunctionDeclaration(node) || ts.isFunctionExpression(node)) && node.name) {
    return node.name.text;
  }
  const parent = node.parent;
  if (parent && ts.isVariableDeclaration(parent) && ts.isIdentifier(parent.name)) {
    return parent.name.text;
  }
  // A function wrapped in a call and assigned to a name — `forwardRef(…)`,
  // `memo(…)`, and `useCallback(…)`, which is how `readFromStorage` is written.
  // Without this it is anonymous, and the one defect that hid behind a call
  // would have stayed hidden.
  if (parent && ts.isCallExpression(parent)) {
    for (let cursor: ts.Node | undefined = parent; cursor; cursor = cursor.parent) {
      if (ts.isVariableDeclaration(cursor) && ts.isIdentifier(cursor.name)) return cursor.name.text;
      if (ts.isPropertyAssignment(cursor) && ts.isIdentifier(cursor.name)) return cursor.name.text;
      if (!ts.isCallExpression(cursor) && cursor !== parent) break;
    }
  }
  return "";
}

/** A component or a hook: the two things React calls while it is rendering. */
const isRenderPath = (node: ts.Node): boolean => {
  const name = functionName(node);
  return /^[A-Z]/.test(name) || /^use[A-Z]/.test(name);
};

/** A function React (or the platform) calls later, never during render. */
function isDeferred(node: ts.Node): boolean {
  const parent = node.parent;
  if (!parent) return false;
  if (ts.isCallExpression(parent) && parent.arguments.includes(node as ts.Expression)) {
    const callee = ts.isIdentifier(parent.expression)
      ? parent.expression.text
      : ts.isPropertyAccessExpression(parent.expression)
        ? parent.expression.name.text
        : "";
    return DEFERRED_CALLS.has(callee);
  }
  // `onClick={() => …}` and `{ onChange: () => … }`.
  if (ts.isJsxAttribute(parent) && /^on[A-Z]/.test(parent.name.getText())) return true;
  if (ts.isJsxExpression(parent)) return isDeferred(parent);
  if (ts.isPropertyAssignment(parent) && /^on[A-Z]/.test(parent.name.getText())) return true;
  return false;
}

/** `isBrowser`, `typeof window`, `typeof document` — the question itself. */
function asksTheQuestion(node: ts.Node): boolean {
  return (
    (ts.isIdentifier(node) &&
      node.text === "isBrowser" &&
      !ts.isImportSpecifier(node.parent) &&
      !ts.isExportSpecifier(node.parent) &&
      !ts.isPropertyAssignment(node.parent)) ||
    (ts.isTypeOfExpression(node) &&
      ts.isIdentifier(node.expression) &&
      (node.expression.text === "window" || node.expression.text === "document"))
  );
}

/** Every reference to the environment, with where it sits. */
function scan(file: string, source: string, tainted: Set<string> = new Set()): Finding[] {
  const sourceFile = ts.createSourceFile(file, source, ts.ScriptTarget.ESNext, true, ts.ScriptKind.TSX);
  const findings: Finding[] = [];

  const visit = (node: ts.Node) => {
    // Either asking directly, or calling something that asks.
    const asks =
      asksTheQuestion(node) ||
      (ts.isCallExpression(node) &&
        ts.isIdentifier(node.expression) &&
        tainted.has(node.expression.text) &&
        // Not a hook: React calls hooks during render by definition, and a
        // hook that asks the question in its own render path is caught there.
        // `useAnchoredPosition` reads the viewport in an effect and is called
        // by nine components; flagging its call sites would say the deferral
        // is in the wrong place, which it is not.
        !/^use[A-Z]|^[A-Z]/.test(node.expression.text));

    if (asks) {
      let deferred = false;
      let renderPath: ts.Node | null = null;
      for (let cursor: ts.Node | undefined = node.parent; cursor; cursor = cursor.parent) {
        if (!isFunctionLike(cursor)) continue;
        if (isDeferred(cursor)) {
          deferred = true;
          break;
        }
        if (isRenderPath(cursor)) renderPath = cursor;
      }
      if (!deferred && renderPath) {
        findings.push({
          file,
          line: sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1,
          inside: functionName(renderPath),
          text: node.getText().slice(0, 60),
        });
      }
    }
    ts.forEachChild(node, visit);
  };

  visit(sourceFile);
  return findings;
}

/**
 * Functions whose body asks the environment question, by name, across every
 * file — then everything that calls one, to a fixed point. Names rather than
 * symbols: a type checker would resolve imports properly, but these names are
 * distinctive and the gate has to stay fast enough to run in the unit tier.
 */
export function taint(files: Record<string, string>): Set<string> {
  const bodies = new Map<string, { asks: boolean }>();
  // How many places define each name. A name defined once is a specific
  // function; `handleKeyDown` is defined in a dozen files and tainting all of
  // them from one would fault every component that has a keyboard handler.
  const definitions = new Map<string, number>();

  for (const [file, source] of Object.entries(files)) {
    const sourceFile = ts.createSourceFile(file, source, ts.ScriptTarget.ESNext, true, ts.ScriptKind.TSX);
    const visit = (node: ts.Node) => {
      if (isFunctionLike(node)) {
        const name = functionName(node);
        if (name) {
          definitions.set(name, (definitions.get(name) ?? 0) + 1);
          const entry = bodies.get(name) ?? { asks: false };
          const inspect = (inner: ts.Node) => {
            // Not into an effect or a handler nested inside this function:
            // what it does there does not run while anything renders, and
            // counting it taints every component with a keyboard handler that
            // happens to copy to the clipboard.
            if (isFunctionLike(inner) && isDeferred(inner)) return;
            if (asksTheQuestion(inner)) entry.asks = true;
            ts.forEachChild(inner, inspect);
          };
          ts.forEachChild(node, inspect);
          bodies.set(name, entry);
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(sourceFile);
  }

  // One hop, deliberately. Propagating further turns every caller of a caller
  // into a suspect — `renderTable` → `renderRow` → `renderCell` →
  // `handleCellClick` → `copyToClipboard` faults a render helper for something
  // that only happens in a click — and a rule that cries wolf gets deleted. The
  // direct rule still applies inside every one of those functions, so the hop
  // that matters is the one this catches: a render calling a function whose own
  // body asks.
  const unique = (name: string) => definitions.get(name) === 1;
  return new Set(
    [...bodies.entries()]
      .filter(([name, entry]) => entry.asks && unique(name))
      .map(([name]) => name),
  );
}

const shipped = Object.fromEntries(
  Object.entries(sources)
    .filter(([path]) => !NOT_SHIPPED.test(path) && !EXEMPT.test(path))
    .map(([path, source]) => [path.replace("../../", "src/"), source]),
);

const TAINTED = taint(shipped);

const findings = Object.entries(shipped).flatMap(([path, source]) =>
  scan(path, source, TAINTED),
);

describe("ssr branch contract", () => {
  it("reads the shipped source", () => {
    // A broken glob would make the assertion below vacuously true.
    expect(Object.keys(sources).length).toBeGreaterThan(50);
  });

  it("catches each shape it exists for", () => {
    const planted = `
      import { isBrowser } from "../../utils/isBrowser.js";
      export function Widget() {
        const target = isBrowser ? document.body : null;
        const [width] = useState(() => (typeof window !== "undefined" ? window.innerWidth : 1024));
        const store = useMemo(() => (typeof document === "undefined" ? null : document.body), []);
        useEffect(() => {
          if (!isBrowser) return;
          window.addEventListener("resize", () => (isBrowser ? 1 : 2));
        }, []);
        const onPress = useCallback(() => (isBrowser ? 1 : 2), []);
        return <div onClick={() => (isBrowser ? 1 : 2)} style={{ width }}>{String(target)}{store}{onPress}</div>;
      }
    `;
    const caught = scan("src/components/Planted.tsx", planted);
    expect(
      caught.map((f) => f.text),
      "the three render-path shapes must be caught and the three deferred ones must not",
    ).toEqual(["isBrowser", "typeof window", "typeof document"]);
  });

  it("would have caught all five defects it was written for", () => {
    // The five as they were written, before 2026-09-07. A gate justified by
    // history has to be run against that history at least once.
    const before: [string, string][] = [
      [
        "ToastProvider chose its portal target",
        `export const ToastProvider = ({ children }) => {
           const portalTarget = isBrowser ? document.body : null;
           return <>{portalTarget && createPortal(<div />, portalTarget)}</>;
         };`,
      ],
      [
        "Modal, Drawer and MenuSurface returned null on a server",
        `export function MenuSurface({ isOpen }) {
           if (!isBrowser) return null;
           return createPortal(<div />, document.body);
         }`,
      ],
      [
        "Table seeded its width from the window",
        `function useViewportWidth() {
           const [width] = useState(() => (isBrowser ? window.innerWidth : 1024));
           return width;
         }`,
      ],
      [
        "Tooltip chose between inline and portalled",
        `export function Tooltip({ portalContainer }) {
           const portalTarget = portalContainer ?? (isBrowser ? document.body : null);
           return <span>{String(portalTarget)}</span>;
         }`,
      ],
      [
        // The one that hid behind a call: the branch itself was in a
        // `useCallback`, which is allowed, and the CALL was in an initializer.
        "Accordion read storage in a state initializer",
        `export function useAccordionStateManager({ readFromStorage }) {
           const [value] = useState(() => {
             const stored = readFromStorage();
             return stored ? new Set(stored) : new Set();
           });
           return value;
         }`,
      ],
    ];

    const missed = before
      .filter(([, source]) => scan("src/components/Historic.tsx", source, TAINTED).length === 0)
      .map(([what]) => what);
    expect(missed, "these are the defects the gate exists for").toEqual([]);
  });

  it("asks nothing about the environment while rendering", () => {
    expect(
      findings.map((f) => `${f.file}:${f.line} in ${f.inside}() — ${f.text}`),
      "Move it into an effect, or use useHydrated() if the render needs to know. " +
        "A branch here renders one tree on a server and another during hydration, " +
        "which React reports as a mismatch and jsdom cannot reproduce.",
    ).toEqual([]);
  });
});
