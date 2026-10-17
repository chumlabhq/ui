import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import ts from "typescript";
import { describe, expect, it } from "vitest";
import { DEMO_SNIPPETS } from "../../pages/demo/generated/demoSnippets.js";

/**
 * What a copy-paste snippet is allowed to look like.
 *
 * These are public surface in the most literal sense: a reader copies one into
 * their own file. `doc-truth.contract` asserts the prose around them is true;
 * nothing asserted anything about the code itself, and it showed — 41 snippets
 * carried an entire page styling object where a single slot belonged, because
 * `c.accordion.root` substituted the whole of `c.accordion` and left the
 * `.root` hanging off it. `DatePicker/Classes System` was 18.5 KB of the same
 * object repeated once per slot. It COMPILED, which is why the snippet
 * typecheck gate stayed green and nobody found it for months; it was noticed
 * only because someone was reading that file for an unrelated reason.
 *
 * Three rules, because the defect had three visible faces: a slot that is not
 * a slot, an object where a string belongs, and a snippet too big to be an
 * example.
 */
const SRC = "src/components";

/** The `classes` keys each component and sub-component actually declares. */
const slotsByTag = (): Map<string, Set<string>> => {
  const out = new Map<string, Set<string>>();
  const add = (tag: string, keys: string[]) => {
    if (!keys.length) return;
    out.set(tag, new Set([...(out.get(tag) ?? []), ...keys]));
  };
  for (const dir of readdirSync(SRC)) {
    const schemaPath = join(SRC, dir, `${dir}.schema.json`);
    if (!existsSync(schemaPath)) continue;
    const schema = JSON.parse(readFileSync(schemaPath, "utf8")) as {
      properties?: Record<string, { properties?: Record<string, unknown> }>;
      oneOf?: Array<{ title?: string; properties?: Record<string, { properties?: Record<string, unknown> }> }>;
      subComponents?: Record<string, { properties?: Record<string, { properties?: Record<string, unknown> }> }>;
    };
    add(dir, Object.keys(schema.properties?.classes?.properties ?? {}));
    for (const branch of schema.oneOf ?? []) {
      add(branch.title ?? dir, Object.keys(branch.properties?.classes?.properties ?? {}));
    }
    for (const [tag, sub] of Object.entries(schema.subComponents ?? {})) {
      add(tag, Object.keys(sub.properties?.classes?.properties ?? {}));
    }
  }
  return out;
};

const SLOTS = slotsByTag();
/** Every value a component's entry exports — what its snippet may legitimately name. */
function exportedTagsOf(component: string): Set<string> {
  const file = join("src/components", component, "index.ts");
  const tags = new Set([component]);
  if (!existsSync(file)) return tags;
  for (const m of readFileSync(file, "utf8").matchAll(/export\s*\{([^}]*)\}/g)) {
    for (const part of m[1].split(",")) {
      const name = (part.split(" as ").pop() ?? "").trim();
      if (/^[A-Z][A-Za-z]*$/.test(name) && !/^[A-Z0-9_]+$/.test(name)) tags.add(name);
    }
  }
  return tags;
}

const every = Object.entries(DEMO_SNIPPETS).flatMap(([component, sections]) =>
  Object.entries(sections).map(([title, snippet]) => ({ component, title, code: snippet.react })),
);

/**
 * `classes={{ … }}` object literals in a snippet, as [tag, keys].
 *
 * Textual rather than a parse: the snippet is already valid TSX by the time it
 * is written — `build-demo-snippets.mjs` typechecks every one — so what is
 * wanted here is the shape a reader sees, and a brace-matched scan reads it
 * without dragging the compiler into a contract test.
 */
const classesObjects = (code: string): Array<{ tag: string; keys: string[]; body: string }> => {
  const out: Array<{ tag: string; keys: string[]; body: string }> = [];
  const opening = /<([A-Z][A-Za-z0-9]*)\b/g;
  for (const match of code.matchAll(/classes=\{\s*\{/g)) {
    const start = (match.index ?? 0) + match[0].length - 1;
    let depth = 0;
    let end = start;
    for (let i = start; i < code.length; i += 1) {
      if (code[i] === "{") depth += 1;
      else if (code[i] === "}") {
        depth -= 1;
        if (depth === 0) { end = i; break; }
      }
    }
    const body = code.slice(start + 1, end);
    // Top-level keys only: a nested bag (`loading: { root: … }`) belongs to the
    // slot above it and is checked against that component's own schema entry.
    const keys: string[] = [];
    let nesting = 0;
    for (const line of body.split("\n")) {
      const key = nesting === 0 ? /^\s*["']?([A-Za-z][A-Za-z0-9]*)["']?\s*:/.exec(line) : null;
      if (key) keys.push(key[1]);
      nesting += (line.match(/[{[(]/g) ?? []).length - (line.match(/[}\])]/g) ?? []).length;
    }
    // The tag whose ATTRIBUTE LIST this is, which is not the nearest opening
    // tag before it: a render prop puts other elements in between, and
    // `<InternationalPhoneInput … renderSelectedCountry={() => <CountryFlag/>}
    // classes={{…}}>` reported three of IPI's own slots as phantoms on
    // CountryFlag. Match the brace depth, so an element nested inside a prop
    // is skipped.
    const before = code.slice(0, match.index ?? 0);
    const depthAt = (text: string) =>
      (text.match(/\{/g) ?? []).length - (text.match(/\}/g) ?? []).length;
    const target = depthAt(before);
    let tag = "";
    for (const found of before.matchAll(opening)) {
      if (depthAt(before.slice(0, found.index ?? 0)) === target) tag = found[1];
    }
    out.push({ tag, keys, body });
  }
  return out;
};

describe("snippet shape contract", () => {
  /**
   * How many sections produce a snippet, ratcheted both ways.
   *
   * A section that stops producing one fails nowhere else: the generator moves
   * it to its skipped list with a reason, the copy button disappears, and every
   * case below runs over one snippet fewer and stays green. SN5 showed it — a
   * `.map()` over page-only data took Drawer's Basic Usage from 744 to 743 with
   * no gate red. So the count is recorded: a fall fails until the record is
   * lowered with a reason (or the section is fixed), and a rise fails until it
   * is raised with one, like the `dark:` ratchets.
   */
  it("produces as many snippets as recorded", () => {
    /**
     * 2026-10-09, D4b: recorded at 744 (of 839 sections; the skipped list says why for the rest).
     * 2026-10-09, D10: 744 -> 778. Table's Show code: 30 sections wrapped so the
     * snippet captures them, and 3 that did not typecheck fixed at the generator
     * (default `React` import, `React` as a value, an `extends User` heritage
     * type) — 33. One more from the generator fixes: Slider's Custom Thumb, whose
     * renamed binding (`{ value: v }`) had read as an undeclared `value`. The 31
     * Table sections still without code carry their reason in the skipped list.
     * 2026-10-09, L10: 778 -> 783. Table's five Footer sections: they were
     * code-less while Table nested their footer rows inside a cell of its own;
     * L10 renders a footer of rows directly in <tfoot>, so they now show code.
     * 2026-10-17, D12a: 783 -> 798. An "In a form" section with code on the 15
     * form-field pages and Modal's "Form in a modal" (+16), less Slider's
     * "Form Integration", which the In a form section replaces (-1). The shared
     * FormDemo helper travels into each snippet with its react and library imports.
     */
    const RECORDED = 798;
    const count = every.length;
    console.log(
      `SNIPPET_COUNT snippets=${count} recorded=${RECORDED} ` +
        `${count > RECORDED ? "ROSE — raise the record, with the section that gained one" : count < RECORDED ? "FELL — a section stopped producing a snippet; see demoSnippets.skipped.json" : "held"}`,
    );
    expect(count, "a section stopped producing a snippet: its reason is in demoSnippets.skipped.json").toBeGreaterThanOrEqual(RECORDED);
    expect(count, "a section started producing a snippet: raise RECORDED to it, with the reason").toBeLessThanOrEqual(RECORDED);
  });

  /**
   * One theming method: a token whose value switches per theme. The demo pages
   * also carried a second, a ternary on the theme flag (`dark ? "…" : "…"`),
   * and the snippet generator folds every one of those to its light branch, so
   * a reader copied light-only strings. T4 took them from 157 to 2.
   *
   * Counted from the pages' source by the compiler, not from the snippets: a
   * ternary in page markup the generator does not capture is still a second
   * theming method on the page. Ratcheted both ways. What remains is allowed
   * by name, keyed by file and the property or variable it assigns rather than
   * a line, with its reason; an allowed entry that no longer matches fails as
   * stale.
   */
  it("themes demo pages with tokens, not ternaries on the theme flag", () => {
    /** 2026-10-10, T4: 157 -> 2. Lower it when the count falls. */
    const RECORDED = 2;
    const ALLOWED: Record<string, string> = {
      "AvatarDemo.tsx ringSurface":
        "the ring demo needs an opaque surface plainly distinct from the page in both themes, and the token " +
        "scale has none (--cl-bg-elevated is a hair off white; --cl-bg-recessed and --cl-bg-hover are translucent " +
        "in light), while a solid ring colour has to equal the surface exactly",
      "AvatarDemo.tsx ringSurfaceColor": "the same pair as ringSurface: the ring colour that has to equal it",
    };
    const FLAGS = new Set(["dark", "isDarkMode", "isDark", "_dark"]);
    const strip = (e: ts.Expression): ts.Expression => (ts.isParenthesizedExpression(e) ? strip(e.expression) : e);
    const isFlag = (e: ts.Expression): boolean => {
      const x = strip(e);
      if (ts.isPrefixUnaryExpression(x) && x.operator === ts.SyntaxKind.ExclamationToken) return isFlag(x.operand);
      if (ts.isIdentifier(x)) return FLAGS.has(x.text);
      if (ts.isPropertyAccessExpression(x)) return FLAGS.has(x.name.text);
      return false;
    };
    const dir = "src/pages/demo";
    const walk = (d: string): string[] =>
      readdirSync(d, { withFileTypes: true }).flatMap((e) =>
        e.isDirectory() ? (e.name === "generated" ? [] : walk(join(d, e.name))) : /\.tsx?$/.test(e.name) ? [join(d, e.name)] : [],
      );
    const files = walk(dir);
    const found: string[] = [];
    for (const file of files) {
      const sf = ts.createSourceFile(file, readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
      const visit = (n: ts.Node): void => {
        if (ts.isConditionalExpression(n) && isFlag(n.condition)) {
          let owner = "(expression)";
          for (let up: ts.Node | undefined = n.parent; up; up = up.parent) {
            if ((ts.isPropertyAssignment(up) || ts.isVariableDeclaration(up)) && up.name) { owner = up.name.getText(sf); break; }
          }
          found.push(`${file.split("/").pop()} ${owner}:${sf.getLineAndCharacterOfPosition(n.getStart(sf)).line + 1}`);
        }
        ts.forEachChild(n, visit);
      };
      visit(sf);
    }
    const keyOf = (f: string) => f.replace(/:\d+$/, "");
    const unexplained = found.filter((f) => !(keyOf(f) in ALLOWED));
    const stale = Object.keys(ALLOWED).filter((k) => !found.some((f) => keyOf(f) === k));
    const count = found.length;
    console.log(
      `DEMO_THEME_TERNARIES files=${files.length} count=${count} recorded=${RECORDED} allowed=${count - unexplained.length} ` +
        `unexplained=${unexplained.length} stale=${stale.length} ` +
        `${count > RECORDED ? "ROSE" : count < RECORDED ? "FELL — lower the record" : "held"}`,
    );
    for (const f of unexplained) console.log(`  UNEXPLAINED ${f}`);
    expect(files.length, "no demo page was read").toBeGreaterThan(30);
    expect(stale, "an allowed ternary that no longer exists excuses nothing; delete it").toEqual([]);
    expect(unexplained, "a demo page themes with a ternary on the theme flag; use a token that switches per theme").toEqual([]);
    expect(count, "a theme-flag ternary was added").toBeLessThanOrEqual(RECORDED);
    expect(count, "the count fell: lower RECORDED to it, so the gain is kept").toBe(RECORDED);
  });

  it("reads the snippets and the schemas", () => {
    // Either side coming back empty would pass every assertion below for the
    // wrong reason.
    expect(every.length, "no snippets were read").toBeGreaterThan(500);
    expect(SLOTS.size, "no schema slots were read").toBeGreaterThan(20);
    expect(SLOTS.get("Accordion")?.has("trigger")).toBe(true);
  });

  it("names only slots the component declares", () => {
    const phantom: string[] = [];
    for (const { component, title, code } of every) {
      for (const { tag, keys } of classesObjects(code)) {
        const slots = SLOTS.get(tag);
        // A tag whose schema records no `classes` properties is not checked:
        // nothing known is not the same as known to have none, which is how
        // CountryFlagGroup's two real keys were cut out of its own snippet.
        if (!slots) continue;
        for (const key of keys) {
          if (!slots.has(key)) phantom.push(`${component}/${title}: <${tag} classes={{ ${key} }}`);
        }
      }
    }
    expect(
      phantom.sort(),
      "a `classes` key the component does not declare. The snippet is what a reader pastes, " +
        "so this is a compile error in their editor — and `build-demo-snippets.mjs` drops " +
        "unknown keys, so one arriving here means a path around that dropper",
    ).toEqual([]);
  });

  it("puts a class string where a slot belongs, never a styling object", () => {
    const serialised: string[] = [];
    for (const { component, title, code } of every) {
      // `({ root: "…", item: "…" }).root` — the whole bag inlined for one slot.
      // `({ root: "…", item: "…" }).root` and its bracket form: the whole bag
      // inlined so one member can be read off it.
      // The braces have to hold a STRING-valued member, which is what a class
      // bag is. `\}\s*\)\s*[.[]` alone also matched
      // `Array.from({ length: 20 }).map(…)` — an ordinary loop, and a false
      // positive that only surfaced when Drawer's body started reaching the
      // snippets. The pattern was never about the punctuation.
      if (/\{[^{}]*:\s*"[^"]*"[^{}]*\}\s*\)\s*[.[]/.test(code)) {
        serialised.push(`${component}/${title}: an object literal read for one member`);
      }
      // One rule, not two. A "the same long class string appears three times"
      // proxy was tried and dropped: it flagged nine avatars sharing a
      // className, and a page bag whose own `trigger`, `content` and `chip`
      // legitimately carry one string, while adding nothing the member-access
      // test above does not already catch exactly. A rule that needs
      // exceptions carved into it is a rule that will be waived.
    }
    expect(
      serialised.sort(),
      "a page styling object serialised into a snippet. `c.accordion.root` must resolve to " +
        "that slot's string, not to the whole bag with `.root` appended — it compiles either " +
        "way, and a reader pastes the difference",
    ).toEqual([]);
  });

  it("keeps every snippet small enough to read", () => {
    /**
     * 30000 characters. The largest legitimate snippet today is
     * `Avatar/Avatar Group` at 25807, which renders nine examples in one
     * section; the median is 2308 and the 90th percentile 6042. So this is
     * about 16% above the real maximum: it leaves room for a section to gain
     * an example, and a snippet that repeats a styling object per slot lands
     * far past it — the one that prompted this rule was 18.5 KB for a section
     * whose honest size is 15.6 KB, and a larger section would have cleared
     * 30000 outright.
     *
     * The number is a backstop, not a style rule. The two assertions above
     * catch the mechanism directly; this catches whatever the next mechanism
     * turns out to be.
     */
    const CEILING = 30000;
    const oversize = every
      .filter(({ code }) => code.length > CEILING)
      .map(({ component, title, code }) => `${component}/${title}: ${code.length} chars`);
    expect(
      oversize.sort(),
      `a snippet over ${CEILING} characters. Something is being inlined that should be ` +
        "referenced, or a section is rendering more examples than one copy-paste block can carry",
    ).toEqual([]);
  });

  /**
   * A snippet has to name the component its page documents.
   *
   * Trigger-driven components are written as two siblings — the button in the
   * `DemoWrapper`, the surface after it — and reading the wrapper alone gave 55
   * snippets that were a styled button and nothing else. Drawer's Form Drawer
   * taught a reader to build a button and stopped: no Drawer, no fields, no
   * sign of where the panel came from. That reads as complete, which is worse
   * than having no snippet.
   */
  it("names the component the page documents", () => {
    /**
     * Recorded by name, and the two kinds are NOT the same:
     *   EXEMPT — the snippet is right as it is, for a stated reason.
     *   UNPARSED — nobody decided; the tool could not read the page.
     */
    // Empty since SN4: Drawer/Directions was the one entry, excused because the
    // generator dropped library elements rendered inside a `.map()`. It now
    // carries the map with them (build-demo-snippets.mjs, sectionsOf). The
    // entry stayed a release after its reason was gone, because nothing here
    // checked that an exempt section was still missing anything.
    const EXEMPT_MISSING = new Map<string, string>([]);

    const lacking: string[] = [];
    for (const { component, title, code } of every) {
      const tags = exportedTagsOf(component);
      if ([...tags].some((t) => new RegExp(`<${t}[\\s/>]`).test(code))) continue;
      lacking.push(`${component}/${title}`);
    }
    const missing = lacking.filter((key) => !EXEMPT_MISSING.has(key));
    // An exemption whose section names its component now, or has no snippet at
    // all, excuses nothing.
    const stale = [...EXEMPT_MISSING.keys()].filter((key) => !lacking.includes(key));
    console.log(
      `SNIPPET_NAMES_COMPONENT snippets=${every.length} lacking=${lacking.length} ` +
        `exempt=${lacking.length - missing.length} failing=${missing.length} stale=${stale.length}`,
    );
    expect(stale, "an exemption whose section is no longer missing its component excuses nothing; delete it").toEqual([]);
    expect(
      missing.sort(),
      "the snippet under this section never names the component whose page it is on. A reader " +
        "copies it and gets the trigger without the thing the trigger opens",
    ).toEqual([]);
  });

  /**
   * A snippet carries every library component its section renders.
   *
   * "Names the component" passes once one tag of the page's component appears.
   * Drawer's Directions passed it with a Drawer it never rendered: the page
   * drew four buttons in the demo wrapper and the four Drawers they open in a
   * `.map()` beside it, and the generator dropped library elements rendered
   * inside a `.map()`, so the snippet shipped four buttons that opened nothing.
   * SN4 made the generator carry the map; this holds it there.
   *
   * Both sides are read by the compiler: the page side is every library tag
   * (an import from `src/components`) anywhere inside the `<Section>`, `.map()`
   * callbacks included; the snippet side is every tag in its code. Sections
   * without a snippet are not in this count — they are the generator's skipped
   * list, which says why for each. `SNIPPET_SHAPE_TREE` points the case at
   * another checkout's `src/pages/demo`, which is how it was proven red on D7's
   * parent.
   */
  it("carries every library component its section renders", () => {
    const tree = process.env.SNIPPET_SHAPE_TREE ?? process.cwd();
    const pagesDir = join(tree, "src/pages/demo");
    const generated = readFileSync(join(pagesDir, "generated/demoSnippets.ts"), "utf8");
    const start = generated.indexOf("= {", generated.indexOf("export const DEMO_SNIPPETS")) + 2;
    const snippets = JSON.parse(generated.slice(start, generated.lastIndexOf("}") + 1)) as Record<
      string,
      Record<string, { react: string }>
    >;

    const tagOf = (n: ts.Node, sf: ts.SourceFile) =>
      ts.isJsxElement(n) ? n.openingElement.tagName.getText(sf) : ts.isJsxSelfClosingElement(n) ? n.tagName.getText(sf) : null;
    const tagsIn = (root: ts.Node, sf: ts.SourceFile, keep: (tag: string) => boolean) => {
      const out = new Set<string>();
      const visit = (n: ts.Node): void => {
        const tag = tagOf(n, sf);
        if (tag && keep(tag)) out.add(tag);
        ts.forEachChild(n, visit);
      };
      visit(root);
      return out;
    };

    // The generator's own population: every `<Name>Demo.tsx`, the component
    // named by the file (build-demo-snippets.mjs).
    const pages = readdirSync(pagesDir).filter((f) => f.endsWith("Demo.tsx") && f !== "Demo.tsx");
    let checked = 0;
    let withoutSnippet = 0;
    const missing: string[] = [];
    for (const file of pages) {
      const component = file.replace(/Demo\.tsx$/, "");
      const sf = ts.createSourceFile(file, readFileSync(join(pagesDir, file), "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
      const library = new Set<string>();
      for (const st of sf.statements) {
        if (!ts.isImportDeclaration(st) || !ts.isStringLiteral(st.moduleSpecifier)) continue;
        if (!/^\.\.\/\.\.\/components\//.test(st.moduleSpecifier.text)) continue;
        const clause = st.importClause;
        if (!clause || clause.isTypeOnly) continue;
        if (clause.name) library.add(clause.name.text);
        if (clause.namedBindings && ts.isNamedImports(clause.namedBindings)) {
          for (const el of clause.namedBindings.elements) if (!el.isTypeOnly) library.add(el.name.text);
        }
      }
      const visit = (n: ts.Node): void => {
        if (ts.isJsxElement(n) && n.openingElement.tagName.getText(sf) === "Section") {
          const title = n.openingElement.attributes.properties.find(
            (p): p is ts.JsxAttribute => ts.isJsxAttribute(p) && p.name.getText(sf) === "title",
          )?.initializer;
          if (title && ts.isStringLiteral(title)) {
            const snippet = snippets[component]?.[title.text];
            if (!snippet) withoutSnippet += 1;
            else {
              checked += 1;
              const code = ts.createSourceFile("snippet.tsx", snippet.react, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
              const shipped = tagsIn(code, code, () => true);
              const gone = [...tagsIn(n, sf, (t) => library.has(t))].filter((t) => !shipped.has(t)).sort();
              if (gone.length) missing.push(`${component} / ${title.text}: ${gone.join(", ")}`);
            }
          }
        }
        ts.forEachChild(n, visit);
      };
      visit(sf);
    }
    const total = Object.values(snippets).reduce((n, sections) => n + Object.keys(sections).length, 0);
    console.log(
      `SNIPPET_CARRIES pages=${pages.length} sections checked=${checked} (no snippet: ${withoutSnippet}) ` +
        `missing a component=${missing.length} ${missing.length ? "FAIL" : "ok"}`,
    );
    for (const m of missing) console.log(`  MISSING ${m}`);
    // Every snippet has to be found under a page section, or the count above is
    // over a population that quietly lost some.
    expect(checked, "a snippet was not found under any page section, so it was never compared").toBe(total);
    expect(
      missing,
      "the page renders a library component in this section that its snippet does not. A reader " +
        "copies the snippet and gets part of what the page shows",
    ).toEqual([]);
  });

  /**
   * A snippet may not hand-class an element the library provides.
   *
   * The demo pages keep ~300 raw `<button>`s as page harness, and that rule is
   * right for the page and wrong here: in a snippet nothing is harness, every
   * line is being shown as the way to do it. A `<button>` classed
   * `bg-cl-accent text-cl-on-accent` teaches a reader to rebuild `Button`.
   *
   * Read from the parsed snippet, not with a regex. The regex this replaced,
   * `/<button\b[^>]*className="[^"]*"/`, saw a double-quoted className only and
   * stopped at the `>` of any `=>` in an earlier prop, so `onClick={() => …}`
   * ahead of the className hid the button: it passed with 3 of 40 found. Here
   * every string the className can produce is read: a string, a template
   * literal, a conditional, a `cn()` / `clsx()` call, and a `c.x` or identifier
   * the snippet itself declares.
   */
  it("hand-classes no element the library provides", () => {
    /**
     * The raw element is the lesson. Each names its section, its element by the
     * text or aria-label a reader sees, and why — and goes stale, failing, once
     * that section stops containing that element hand-classed.
     */
    const LINK_STYLE =
      "A text action styled as a link: accent or plain text, no fill. Button has no text or link " +
      "variant, and adding one is new API, not a demo fix.";
    const EXEMPT_RAW: Array<{ key: string; element: string; reason: string }> = [
      // The API hands you the element.
      { key: "Accordion/Composition with asChild", element: '<button> "Your own button, styled your way"', reason: "`asChild` hands the trigger's behaviour to an element you supply; a raw `<button>` styled your way is that element, and a `Button` would hide the point." },
      { key: "Dropdown/Custom Trigger (renderTrigger)", element: '<button> "<button>"', reason: "`renderTrigger` is handed a ref and trigger props to put on an element of your own. The raw `<button>` taking that ref is the lesson." },
      { key: "SearchableDropdown/Custom Trigger (renderTrigger)", element: '<button> "<button>"', reason: "As Dropdown's: the `renderTrigger` element that takes the ref." },
      { key: "OtpInput/Custom Render Input", element: '<input> "<input>"', reason: "`renderInput` passes the props for a native input; spreading them on a raw `<input>` is what the section shows." },
      // The library's element would not fit the slot.
      { key: "Avatar/Clickable Avatars", element: '<button> "<button>"', reason: "A profile row: an avatar and a name, `gap-3` and `px-3 py-2` around a 40px avatar. Button's sizes set their own gap (gap-1.5 to gap-2.5, in the span wrapping its children) and padding, so the row's spacing would have to be overridden back by hand." },
      { key: "Pagination/Custom Ellipsis (Jump to Page)", element: '<button> "Jump to page"', reason: "It stands in for Pagination's ellipsis and takes each variant's page-item box (`w-9 h-9 rounded-full` for the pill). Button's sizes are padding-based, 28, 40 and 52px tall." },
      { key: "Pagination/Custom Ellipsis (Jump to Page)", element: '<input> "<input>"', reason: "The same slot's page-number box, `w-12` inline in the pagination row. Input renders a field: a wrapper with label, description and message around its `<input>`." },
      // Link-style text actions.
      { key: "CascadingDropdown/Fully Async - Load on Open", element: '<button> "Reset"', reason: LINK_STYLE },
      { key: "Modal/Use Cases", element: '<button> "Maybe later"', reason: LINK_STYLE },
      { key: "Table/Right Column Pinning", element: '<button> "Edit"', reason: LINK_STYLE },
      { key: "Table/Context Menu", element: '<button> "Dismiss"', reason: LINK_STYLE },
      { key: "Table/Infinite Scroll", element: '<button> "Reset"', reason: LINK_STYLE },
      { key: "Table/Infinite Scroll (Skeleton Loader)", element: '<button> "Reset"', reason: LINK_STYLE },
      { key: "Table/Infinite Scroll (Progress Bar Loader)", element: '<button> "Reset"', reason: LINK_STYLE },
      { key: "Table/Infinite Scroll (No Loading UI, Silent Load)", element: '<button> "Reset"', reason: LINK_STYLE },
      // The raw element is the mechanism or the subject.
      { key: "Input/InputLabel Standalone", element: '<input> "<input>"', reason: "The section exists to pair `InputLabel` with a NATIVE field — with `Input` you pass `label` and never reach for it. The raw input is the lesson." },
      { key: "TextArea/TextAreaLabel Standalone", element: '<textarea> "<textarea>"', reason: "As Input's, for `TextAreaLabel`." },
      { key: "Modal/Focus Trap", element: '<input> "<input>"', reason: "Raw inputs as focus-order fodder. Borderline: `Input` is focusable too and would teach better, so this is a decision to revisit, not a principle." },
      { key: "Modal/Initial Focus", element: '<input> "<input>"', reason: "As Focus Trap's." },
    ];

    const TOKEN = /\b(?:bg-cl-|text-cl-|border-cl-|rounded-cl-)/;
    /**
     * `<input>` types a snippet may hand-class, by type, with why.
     *
     * Empty since SN5. It held checkbox, radio, range and file as "types the
     * library has no field for", and both halves had stopped being true: the
     * library ships Checkbox, RadioButton and Slider, and no snippet
     * hand-classed an input of any of the four — the one native checkbox
     * (Table's column toggles) carries `cursor-pointer` and no token. An entry
     * that excuses nothing fails as stale below, like every other list here.
     */
    const NATIVE_ONLY_INPUT = new Map<string, string>([]);

    let parsed = 0;
    const examined = { button: 0, input: 0, textarea: 0 };
    const found: string[] = [];
    /** Native-only types that actually excused a hand-classed input. */
    const nativeExcused = new Set<string>();

    for (const { component, title, code } of every) {
      const key = `${component}/${title}`;
      const sf = ts.createSourceFile("snippet.tsx", code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
      parsed += 1;

      // What a `c.x` or a bare identifier stands for, from the snippet's own
      // declarations: object-literal properties and `const` initializers.
      const declared = new Map<string, ts.Expression>();
      const collect = (node: ts.Node): void => {
        if (ts.isPropertyAssignment(node) && (ts.isIdentifier(node.name) || ts.isStringLiteral(node.name))) {
          declared.set(node.name.text, node.initializer);
        } else if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.initializer) {
          declared.set(node.name.text, node.initializer);
        }
        ts.forEachChild(node, collect);
      };
      collect(sf);

      /** Every class string a className expression can produce, concatenated. */
      const classText = (node: ts.Node, seen = new Set<ts.Node>()): string => {
        if (seen.has(node)) return "";
        seen.add(node);
        if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
        if (ts.isTemplateExpression(node)) {
          return [node.head.text, ...node.templateSpans.flatMap((s) => [classText(s.expression, seen), s.literal.text])].join(" ");
        }
        if (ts.isPropertyAccessExpression(node) || ts.isIdentifier(node)) {
          const name = ts.isIdentifier(node) ? node.text : node.name.text;
          const target = declared.get(name);
          return target ? classText(target, seen) : "";
        }
        const parts: string[] = [];
        ts.forEachChild(node, (child) => { parts.push(classText(child, seen)); });
        return parts.join(" ");
      };

      const attr = (open: ts.JsxOpeningLikeElement, name: string) =>
        open.attributes.properties.find(
          (a): a is ts.JsxAttribute => ts.isJsxAttribute(a) && a.name.getText(sf) === name,
        );
      /** The element as a reader names it: its aria-label, else its own text. */
      const nameOf = (node: ts.JsxElement | ts.JsxSelfClosingElement, open: ts.JsxOpeningLikeElement) => {
        const label = attr(open, "aria-label")?.initializer;
        if (label && ts.isStringLiteral(label)) return label.text;
        if (ts.isJsxSelfClosingElement(node)) return `<${open.tagName.getText(sf)}>`;
        const text = node.children
          .map((c) => (ts.isJsxText(c) ? c.text : ts.isJsxExpression(c) && c.expression ? `{${c.expression.getText(sf)}}` : ""))
          .join(" ")
          .replace(/\s+/g, " ")
          .trim();
        return text || `<${open.tagName.getText(sf)}>`;
      };

      const visit = (node: ts.Node): void => {
        if (ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node)) {
          const open = ts.isJsxElement(node) ? node.openingElement : node;
          const tag = open.tagName.getText(sf);
          if (tag === "button" || tag === "input" || tag === "textarea") {
            const type = attr(open, "type")?.initializer;
            const nativeOnly =
              tag === "input" && type !== undefined && ts.isStringLiteral(type) && NATIVE_ONLY_INPUT.has(type.text);
            const cls = attr(open, "className")?.initializer;
            const tokened = cls !== undefined && TOKEN.test(classText(cls));
            if (nativeOnly) {
              if (tokened) nativeExcused.add((type as ts.StringLiteral).text);
            } else {
              examined[tag] += 1;
              if (tokened) found.push(`${key} <${tag}> "${nameOf(node, open)}"`);
            }
          }
        }
        ts.forEachChild(node, visit);
      };
      visit(sf);
    }

    const isExempt = (f: string) => EXEMPT_RAW.some((e) => f === `${e.key} ${e.element}`);
    const handClassed = found.filter((f) => !isExempt(f));
    const stale = EXEMPT_RAW.filter((e) => !found.includes(`${e.key} ${e.element}`)).map((e) => `${e.key} ${e.element}`);
    const staleNative = [...NATIVE_ONLY_INPUT.keys()].filter((type) => !nativeExcused.has(type)).map((type) => `<input type="${type}">`);
    console.log(
      `HAND_CLASSED snippets=${parsed} examined button=${examined.button} input=${examined.input} ` +
        `textarea=${examined.textarea} found=${found.length} exempt=${found.length - handClassed.length} ` +
        `failing=${handClassed.length} stale=${stale.length} native-only=${NATIVE_ONLY_INPUT.size} (stale ${staleNative.length})`,
    );
    for (const f of found) console.log(`  ${isExempt(f) ? "exempt " : "FOUND  "} ${f}`);

    expect(parsed, "the snippets were not read, so nothing was examined").toBe(every.length);
    expect(stale, "an exemption whose section no longer hand-classes that element excuses nothing; delete it").toEqual([]);
    expect(staleNative, "a native-only input type no snippet hand-classes excuses nothing; delete it").toEqual([]);
    expect(
      handClassed.sort(),
      "a snippet dresses a raw element in the library's own tokens. In a snippet nothing is " +
        "harness — every line is being shown as the way to do it",
    ).toEqual([]);
  });
  /**
   * A snippet themes colour with tokens, not with `dark:` colour overrides.
   *
   * A token switches value under any dark strategy a consumer's Tailwind uses;
   * a `dark:text-…` in a copied snippet works only if the consumer's `dark`
   * variant is configured the way this site's is. The demo pages carried 1,082
   * such overrides and the snippets 8,704 (one class bag repeats in many
   * snippets). T1 removed the no-ops, replaced every pair a single token renders
   * identically, and moved field borders, hover fills and accent chips onto
   * the tokens built for them. T2 minted the three tokens the remaining pairs
   * lacked, and T3 moved every other site onto one token for both themes,
   * fixing the pairs that failed contrast on the way; the one override left is
   * the exemption the next test names.
   *
   * Ratcheted both ways, like the class-literal baseline: a rise fails, and a
   * fall fails until the record is lowered, so the gain cannot be spent later.
   */
  it("carries no more dark: colour overrides than recorded", () => {
    /**
     * 2026-10-09, T1: 8,704 -> 3,329. T3: 3,329 -> 1. Lower it when the count falls.
     * 2026-10-10, T4: 1 -> 0. Tooltip's warning tooltip, the last one, takes
     * --cl-on-warning, minted for it.
     */
    const RECORDED = 0;
    const COLOUR = /^(text|bg|border(-[trblxyse])?|ring|ring-offset|fill|stroke|from|via|to|shadow|outline|divide|placeholder|decoration)-(.+)$/;
    const NOT_A_COLOUR = /^(\d|\[|px$|xs$|sm$|md$|lg$|xl$|\dxl$|left$|center$|right$|justify$|start$|end$|none$|inner$|solid$|dashed$|dotted$|double$|hidden$|collapse$|separate$|inset$|offset$|x$|y$|t$|r$|b$|l$|s$|e$|wrap$|nowrap$|balance$|pretty$|ellipsis$|clip$|base$|linear-|radial|conic|gradient-|wavy$|line$|through$|box$|opacity-|width-)/;
    const isDarkColour = (token: string) => {
      if (!token.includes("dark:")) return false;
      const m = COLOUR.exec(token.split(":").pop()!.replace(/^!/, ""));
      if (!m) return false;
      const value = m[m.length - 1];
      if (/^(ring|ring-offset|outline)$/.test(m[1]) && /^\d/.test(value)) return false;
      return !NOT_A_COLOUR.test(value);
    };
    let count = 0;
    for (const { code } of every) {
      const sf = ts.createSourceFile("snippet.tsx", code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
      const visit = (node: ts.Node): void => {
        if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node) || ts.isTemplateHead(node) || ts.isTemplateMiddle(node) || ts.isTemplateTail(node)) {
          count += node.text.split(/\s+/).filter(isDarkColour).length;
        }
        ts.forEachChild(node, visit);
      };
      visit(sf);
    }
    console.log(`SNIPPET_DARK_COLOUR snippets=${every.length} count=${count} recorded=${RECORDED} ${count > RECORDED ? "ROSE" : count < RECORDED ? "FELL — lower the record" : "held"}`);
    expect(every.length, "no snippet was read").toBeGreaterThan(0);
    expect(count, "a snippet gained a `dark:` colour override — theme it with a token that switches per theme").toBeLessThanOrEqual(RECORDED);
    expect(count, "the count fell: lower RECORDED to it, so the gain is kept").toBe(RECORDED);
  });
  /**
   * A snippet uses no `dark:` variant at all beyond the ones named here.
   *
   * The colour ratchet above cannot see a `dark:border` that adds a border only
   * in dark, a `dark:focus:ring-2` that repeats the light class, or a
   * `dark:bg-[…]` arbitrary value — T3 found 2,225 such variants in the
   * snippets, every one a no-op or a structure one theme had and the other
   * lacked. Theming goes through tokens; structure is the same in both themes.
   *
   * `[color-scheme:dark]` is the one non-colour variant allowed: it sets the
   * scheme a native control paints its own parts in (caret, autofill, spin
   * buttons, the date and time pickers), which no token reaches. Anything else
   * is an exemption with its section and a reason, and an exemption whose
   * section no longer carries it fails, so the list cannot go stale.
   *
   * Ratcheted both ways, like the colour count.
   */
  it("carries no dark: variant beyond the allowed ones", () => {
    /**
     * 2026-10-09, T3: 5,554 -> 101. Lower it when the count falls.
     * 2026-10-09, D5: 101 -> 100. Input "Custom Themes" lost its per-row `input`
     * override, a second copy of the allowed `dark:[color-scheme:dark]` that the
     * spread `c.input` still carries.
     * 2026-10-10, T4: 100 -> 99. Tooltip's warning tooltip lost its exempt
     * `dark:text-cl-on-accent` to --cl-on-warning; the 99 left are all the
     * allowed `dark:[color-scheme:dark]`.
     */
    const RECORDED = 99;
    const ALLOWED: Record<string, string> = {
      "dark:[color-scheme:dark]": "a native control paints its own parts (caret, autofill, spin buttons, pickers) in the page's scheme; no token reaches them",
    };
    /** Empty since T4: Tooltip's warning tooltip was the one entry; --cl-on-warning replaced it. */
    const EXEMPT: Array<{ key: string; variant: string; reason: string }> = [];
    let count = 0;
    const found: string[] = [];
    const allowedSeen = new Set<string>();
    for (const { component, title, code } of every) {
      const sf = ts.createSourceFile("snippet.tsx", code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
      const visit = (node: ts.Node): void => {
        if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node) || ts.isTemplateHead(node) || ts.isTemplateMiddle(node) || ts.isTemplateTail(node)) {
          for (const token of node.text.split(/\s+/)) {
            if (!token.includes("dark:")) continue;
            count++;
            if (token in ALLOWED) allowedSeen.add(token);
            else found.push(`${component}/${title} ${token}`);
          }
        }
        ts.forEachChild(node, visit);
      };
      visit(sf);
    }
    const isExempt = (f: string) => EXEMPT.some((e) => f === `${e.key} ${e.variant}`);
    const unexplained = [...new Set(found.filter((f) => !isExempt(f)))].sort();
    const stale = EXEMPT.filter((e) => !found.includes(`${e.key} ${e.variant}`)).map((e) => `${e.key} ${e.variant}`);
    // An allowed variant no snippet carries any more allows nothing.
    const staleAllowed = Object.keys(ALLOWED).filter((variant) => !allowedSeen.has(variant));
    console.log(
      `SNIPPET_DARK_ANY snippets=${every.length} count=${count} recorded=${RECORDED} allowed=${count - found.length} ` +
        `exempt=${found.length - found.filter((f) => !isExempt(f)).length} unexplained=${unexplained.length} ` +
        `stale=${stale.length} stale-allowed=${staleAllowed.length} ` +
        `${count > RECORDED ? "ROSE" : count < RECORDED ? "FELL — lower the record" : "held"}`,
    );
    for (const f of unexplained) console.log(`  UNEXPLAINED ${f}`);
    expect(every.length, "no snippet was read").toBeGreaterThan(0);
    expect(stale, "an exemption whose section no longer carries that variant excuses nothing; delete it").toEqual([]);
    expect(staleAllowed, "an allowed variant no snippet carries any more allows nothing; delete it").toEqual([]);
    expect(unexplained, "a snippet carries a `dark:` variant that is neither allowed nor exempt — theme it with a token, and give both themes the same structure").toEqual([]);
    expect(count, "a snippet gained a `dark:` variant").toBeLessThanOrEqual(RECORDED);
    expect(count, "the count fell: lower RECORDED to it, so the gain is kept").toBe(RECORDED);
  });
});
