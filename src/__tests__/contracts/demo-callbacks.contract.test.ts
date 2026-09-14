import { readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import ts from "typescript";

/**
 * A demo shows what a callback received, on the page, and never with alert().
 *
 * Thirty-five sections across the component pages got this wrong at once. Form
 * submits, row clicks and ref reads answered with `alert()`, which blocks the
 * page and leaves nothing on it; animation, dismiss and focus callbacks wrote
 * to the console, which a reader of the site never opens. Those are the
 * sections most likely to be copied, and each looked finished: the page
 * compiles, renders, and a handler that was deleted outright would have looked
 * exactly the same. Finding them took a full sweep; this is so the next one
 * does not.
 *
 * Two rules, both read from source through the TypeScript AST, so comments are
 * never counted.
 *
 * 1. No demo page calls `alert`, `confirm` or `prompt` — bare, or on `window`
 *    or `globalThis`. All three block the page the same way. Population: every
 *    `*Demo.tsx` under `src/pages/demo`, not only the thirty component pages —
 *    a guide page is copied from too.
 *
 * 2. A section whose HEADING names a callback renders that callback's
 *    argument. The heading, not the description: descriptions say things like
 *    "no onValueChange needed", and a rule that cannot tell a claim from a
 *    disclaimer is not precise enough to fail honestly. For each `onX` in a
 *    `<Section title>`, some attachment of `onX` inside that section — a JSX
 *    attribute or an object property — must be one of:
 *      - a `useState` setter passed directly (`onX={setValue}`), whose argument
 *        is by construction what the callback received; or
 *      - an inline function that calls a `useState` setter whose argument
 *        reads one of the function's parameters. If the callback's own type
 *        passes no argument (`() => void`, read from the checker at that exact
 *        attachment, because `onBlur` is `() => void` on Dropdown and takes an
 *        event on Checkbox), calling the setter at all is the record.
 *    and that state must be read inside an element carrying `data-demo-action`
 *    in the same section. A state that only feeds the component's own props is
 *    the component showing itself, not the demo showing the callback.
 *
 *    Left out, each deliberately: a handler passed by name that is not a
 *    setter (`onX={handleX}`) fails rather than being followed — following it
 *    is a second extractor to keep honest, and the snippet builder already
 *    refuses such a section for the same reason, so no section that has a copy
 *    button is written that way. A title computed from an expression is not
 *    read; every title today is a string literal, and the population line
 *    below is how a change to that shows up.
 */
const DEMO_DIR = "src/pages/demo";
const BLOCKING = new Set(["alert", "confirm", "prompt"]);

interface Page {
  path: string;
  source: string;
}

const pagesOnDisk = (): Page[] =>
  readdirSync(DEMO_DIR)
    .filter((f) => f.endsWith("Demo.tsx"))
    .map((f) => ({ path: resolve(DEMO_DIR, f), source: readFileSync(join(DEMO_DIR, f), "utf8") }));

/**
 * One program over every page, compiled with the app's own config so imports
 * and JSX resolve exactly as they do in the site build. Extra in-memory pages
 * (the plants below) are served through the host rather than written to disk.
 */
const buildProgram = (pages: Page[]) => {
  const configPath = resolve("tsconfig.app.json");
  const config = ts.readConfigFile(configPath, (p) => ts.sys.readFile(p));
  const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, resolve("."), { noEmit: true }, configPath);
  const virtual = new Map(pages.map((p) => [p.path, p.source]));
  const host = ts.createCompilerHost(parsed.options);
  const readFile = host.readFile.bind(host);
  const fileExists = host.fileExists.bind(host);
  const getSourceFile = host.getSourceFile.bind(host);
  host.readFile = (f) => virtual.get(resolve(f)) ?? readFile(f);
  host.fileExists = (f) => virtual.has(resolve(f)) || fileExists(f);
  host.getSourceFile = (f, lang, onError, create) => {
    const text = virtual.get(resolve(f));
    return text !== undefined ? ts.createSourceFile(f, text, lang, true, ts.ScriptKind.TSX) : getSourceFile(f, lang, onError, create);
  };
  return ts.createProgram(pages.map((p) => p.path), parsed.options, host);
};

interface Finding {
  page: string;
  line: number;
  rule: "blocking-dialog" | "callback-readout";
  detail: string;
}

interface Scan {
  findings: Finding[];
  pages: number;
  titledSections: number;
  namedCallbacks: number;
}

const scan = (pages: Page[]): Scan => {
  const program = buildProgram(pages);
  const checker = program.getTypeChecker();
  const findings: Finding[] = [];
  let titledSections = 0;
  let namedCallbacks = 0;

  for (const page of pages) {
    const sf = program.getSourceFile(page.path);
    if (!sf) throw new Error(`not in the program: ${page.path}`);
    const name = page.path.split("/").pop()!;
    const lineOf = (n: ts.Node) => sf.getLineAndCharacterOfPosition(n.getStart(sf)).line + 1;

    // setter identifier -> state identifier, from `const [x, setX] = useState(…)`.
    const stateOf = new Map<string, string>();
    const collect = (n: ts.Node): void => {
      if (
        ts.isVariableDeclaration(n) &&
        ts.isArrayBindingPattern(n.name) &&
        n.initializer &&
        ts.isCallExpression(n.initializer) &&
        /(^|\.)useState$/.test(n.initializer.expression.getText(sf))
      ) {
        const [value, setter] = n.name.elements;
        if (value && setter && ts.isBindingElement(value) && ts.isBindingElement(setter) && ts.isIdentifier(value.name) && ts.isIdentifier(setter.name)) {
          stateOf.set(setter.name.text, value.name.text);
        }
      }
      if (ts.isCallExpression(n)) {
        const callee = n.expression;
        const called = ts.isIdentifier(callee)
          ? callee.text
          : ts.isPropertyAccessExpression(callee) && /^(window|globalThis)$/.test(callee.expression.getText(sf))
            ? callee.name.text
            : null;
        if (called && BLOCKING.has(called)) {
          findings.push({ page: name, line: lineOf(n), rule: "blocking-dialog", detail: `${called}() blocks the page and renders nothing on it` });
        }
      }
      ts.forEachChild(n, collect);
    };
    collect(sf);

    const identifiersIn = (n: ts.Node): Set<string> => {
      const out = new Set<string>();
      const visit = (m: ts.Node): void => {
        if (ts.isIdentifier(m)) out.add(m.text);
        ts.forEachChild(m, visit);
      };
      visit(n);
      return out;
    };
    const boundNames = (fn: ts.SignatureDeclaration): Set<string> => {
      const out = new Set<string>();
      for (const p of fn.parameters) for (const id of identifiersIn(p.name)) out.add(id);
      return out;
    };

    /** States read inside a `data-demo-action` element of this section. */
    const readoutStates = (section: ts.JsxElement): Set<string> => {
      const out = new Set<string>();
      const visit = (m: ts.Node, inside: boolean): void => {
        let here = inside;
        const opening = ts.isJsxElement(m) ? m.openingElement : ts.isJsxSelfClosingElement(m) ? m : null;
        if (opening && opening.attributes.properties.some((a) => ts.isJsxAttribute(a) && a.name.getText(sf) === "data-demo-action")) here = true;
        if (here && ts.isJsxExpression(m) && m.expression) for (const id of identifiersIn(m.expression)) out.add(id);
        ts.forEachChild(m, (c) => visit(c, here));
      };
      visit(section, false);
      return out;
    };

    /** Why this attachment does not record its argument, or null when it does. */
    const judge = (callback: string, value: ts.Expression, shown: Set<string>): string | null => {
      if (ts.isIdentifier(value)) {
        const state = stateOf.get(value.text);
        if (!state) return `${callback}={${value.text}} is not a useState setter, and a named handler is not followed`;
        return shown.has(state) ? null : `${callback} sets \`${state}\`, which no data-demo-action element reads`;
      }
      if (!ts.isArrowFunction(value) && !ts.isFunctionExpression(value)) {
        return `${callback} is neither a setter nor an inline function`;
      }
      // An optional prop's contextual type is `callback | undefined`, which has
      // no call signature until `undefined` is removed. Falling back to the
      // handler's own parameter count when the lookup fails would let
      // `() => setX("fired")` pass for a callback that does pass an argument —
      // the one mistake this rule exists for — so an unresolved type fails.
      const contextual = checker.getContextualType(value);
      const signature = contextual && checker.getNonNullableType(contextual).getCallSignatures()[0];
      if (!signature) return `${callback}'s type could not be resolved, so whether it passes an argument is unknown`;
      const passes = signature.getParameters().length;
      const params = boundNames(value);
      const setterCalls: { state: string; call: ts.CallExpression }[] = [];
      const visit = (m: ts.Node): void => {
        if (ts.isCallExpression(m) && ts.isIdentifier(m.expression) && stateOf.has(m.expression.text)) {
          setterCalls.push({ state: stateOf.get(m.expression.text)!, call: m });
        }
        ts.forEachChild(m, visit);
      };
      visit(value.body);
      const recording = setterCalls.filter(({ state, call }) => {
        if (!shown.has(state)) return false;
        if (passes === 0) return true;
        return call.arguments.some((arg) => [...identifiersIn(arg)].some((id) => params.has(id)));
      });
      if (recording.length) return null;
      if (!setterCalls.length) return `${callback}'s handler sets no state, so nothing it received can be on the page`;
      if (passes > 0 && !params.size) return `${callback} passes ${passes} argument(s) and the handler declares none`;
      return passes > 0
        ? `${callback}'s handler sets state from something other than its argument, or sets state no data-demo-action element reads`
        : `${callback}'s handler sets state no data-demo-action element reads`;
    };

    const visitSections = (n: ts.Node): void => {
      if (ts.isJsxElement(n) && n.openingElement.tagName.getText(sf) === "Section") {
        const title = n.openingElement.attributes.properties.find(
          (a): a is ts.JsxAttribute => ts.isJsxAttribute(a) && a.name.getText(sf) === "title",
        );
        const text = title?.initializer && ts.isStringLiteral(title.initializer) ? title.initializer.text : "";
        const named = [...new Set(text.match(/\bon[A-Z][A-Za-z]*/g) ?? [])];
        if (named.length) {
          titledSections++;
          const shown = readoutStates(n);
          for (const callback of named) {
            namedCallbacks++;
            const attachments: ts.Expression[] = [];
            const find = (m: ts.Node): void => {
              if (ts.isJsxAttribute(m) && m.name.getText(sf) === callback && m.initializer && ts.isJsxExpression(m.initializer) && m.initializer.expression) {
                attachments.push(m.initializer.expression);
              }
              if (ts.isPropertyAssignment(m) && m.name.getText(sf) === callback) attachments.push(m.initializer);
              ts.forEachChild(m, find);
            };
            find(n);
            const reasons = attachments.map((a) => judge(callback, a, shown));
            if (!attachments.length) {
              findings.push({ page: name, line: lineOf(n), rule: "callback-readout", detail: `"${text}" names ${callback}, and nothing in the section attaches it` });
            } else if (!reasons.includes(null)) {
              findings.push({ page: name, line: lineOf(n), rule: "callback-readout", detail: `"${text}": ${reasons[0]}` });
            }
          }
        }
        return;
      }
      ts.forEachChild(n, visitSections);
    };
    visitSections(sf);
  }
  return { findings, pages: pages.length, titledSections, namedCallbacks };
};

const format = (f: Finding) => `${f.page}:${f.line} [${f.rule}] ${f.detail}`;

describe("demo callbacks", () => {
  const onDisk = scan(pagesOnDisk());

  it("counts what it reads", () => {
    // Printed so a population that shrinks is visible in the run, not only a
    // population that fails.
    console.info(
      `demo-callbacks: ${onDisk.pages} pages, ${onDisk.titledSections} sections whose heading names a callback, ${onDisk.namedCallbacks} callbacks named`,
    );
    expect(onDisk.pages).toBeGreaterThanOrEqual(30);
    expect(onDisk.titledSections).toBeGreaterThan(0);
  });

  it("no demo page opens a blocking dialog", () => {
    expect(onDisk.findings.filter((f) => f.rule === "blocking-dialog").map(format)).toEqual([]);
  });

  it("a section whose heading names a callback renders that callback's argument", () => {
    expect(onDisk.findings.filter((f) => f.rule === "callback-readout").map(format)).toEqual([]);
  });

  /**
   * The plants. Each is a page the rules must refuse, compiled in the same
   * program shape as the real pages and against the real components, so the
   * contextual-type lookup is exercised rather than assumed.
   */
  describe("plants", () => {
    const page = (id: string, body: string, state = "") => ({
      path: resolve(DEMO_DIR, `__plant_${id}Demo.tsx`),
      source: `import { useState, type ReactNode } from "react";
import { Slider } from "../../components/Slider/index.js";
import { Dropdown } from "../../components/Dropdown/index.js";
const Section = (_: { title: string; children?: ReactNode }) => null;
export const Plant = () => {
  const [received, setReceived] = useState("not fired yet");
  ${state}
  return (<>${body}</>);
};
`,
    });
    const OPTIONS = `options={[{ value: "a", label: "A" }]}`;
    const plants = {
      correct: page("correct", `<Section title="onValueCommit"><Slider onValueCommit={(v) => setReceived(JSON.stringify(v))} /><div data-demo-action>{received}</div></Section>`),
      correctZeroArg: page("zero", `<Section title="Form (onBlur)"><Dropdown ${OPTIONS} onBlur={() => setReceived("blurred")} /><div data-demo-action>{received}</div></Section>`),
      alert: page("alert", `<Section title="Plain"><button onClick={() => window.alert("hi")} /></Section>`),
      console: page("console", `<Section title="onValueCommit"><Slider onValueCommit={(v) => console.log(v)} /><div data-demo-action>{received}</div></Section>`),
      ignoresArgument: page("ignores", `<Section title="onValueCommit"><Slider onValueCommit={() => setReceived("fired")} /><div data-demo-action>{received}</div></Section>`),
      notInReadout: page("outside", `<Section title="onValueCommit"><Slider onValueCommit={(v) => setReceived(String(v))} /><p>{received}</p></Section>`),
      namedHandler: page("named", `<Section title="onValueCommit"><Slider onValueCommit={handle} /><div data-demo-action>{received}</div></Section>`, `const handle = (v: unknown) => setReceived(String(v));`),
      notAttached: page("missing", `<Section title="onValueCommit"><Slider /><div data-demo-action>{received}</div></Section>`),
    };
    const planted = scan(Object.values(plants));
    const at = (p: { path: string }) => planted.findings.filter((f) => p.path.endsWith(f.page)).map((f) => f.rule);

    it("passes a section that renders the argument, and a zero-argument callback that records firing", () => {
      expect(at(plants.correct)).toEqual([]);
      expect(at(plants.correctZeroArg)).toEqual([]);
    });

    it("refuses each way of not showing what the callback received", () => {
      expect(at(plants.alert)).toEqual(["blocking-dialog"]);
      expect(at(plants.console)).toEqual(["callback-readout"]);
      expect(at(plants.ignoresArgument)).toEqual(["callback-readout"]);
      expect(at(plants.notInReadout)).toEqual(["callback-readout"]);
      expect(at(plants.namedHandler)).toEqual(["callback-readout"]);
      expect(at(plants.notAttached)).toEqual(["callback-readout"]);
    });
  });
});
