/**
 * Which element each `classes` slot styles, read from the component's source.
 *
 * The slot's name and description are on its type; the element is not, and a
 * table of slots that says "root" without saying root of what makes a reader
 * open the source to find out. So the generator follows the class: from every
 * read of `<map>.<slot>` up to the JSX attribute that applies it.
 *
 * What the climb follows, each because a real component routes its classes
 * that way:
 *   - a variable the class initialises, then that variable's uses;
 *   - a local function it is passed to, by position, then the parameter's uses
 *     inside it — and on from the call only when the function returns the
 *     class (`stripOverflow(cls)`), not markup built with it (`selectBox`);
 *   - an object property it becomes, read back as `<owner>.<prop>`, never the
 *     whole object: the merged map holds every slot, and following it would
 *     credit every element to every slot;
 *   - a new map handed whole to a child's `classes` (`dayCellClasses`), and a
 *     renamed property read in another file of the component (`itemClassName`);
 *   - an object returned from a local function, to that function's calls.
 * It stops at a hook's dependency list, which reads a slot to watch it.
 *
 * Measured 2026-10-17 over all 400 public slots: every one resolves, and five
 * name more than two elements, each because the slot really is applied to
 * several (Breadcrumb items render as a link, a button or a span).
 */
import ts from "typescript";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve as resolvePath } from "node:path";
import { existsSync } from "node:fs";
const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? (f === "__tests__" ? [] : walk(p)) : /\.tsx?$/.test(f) ? [p] : []; });
/** The objects a slot is read off: the merged map, the prop, or a context's copy of either. */
const RECEIVER = /(?:^|\.)(mergedClasses|classes|cls|merged|slots|resolved|classNames|classesProp)$/;
/** Short local names count only where the file builds them from a classes map: `const c = motionSafeClasses(…)`. */
const localReceivers = (sf) => {
  const names = new Set();
  const v = (n) => { if (ts.isVariableDeclaration(n) && ts.isIdentifier(n.name) && n.initializer && /[a-z]Classes\b|\bclasses\b/.test(n.initializer.getText(sf)) && /^(c|cls|base)$/.test(n.name.text)) names.add(n.name.text); ts.forEachChild(n, v); };
  v(sf);
  return names;
};
/** Renamed slot properties seen on the way (`itemClassName: mergedClasses.item`), for the other files. */
export const renamed = new Map();
const parse = (f) => ts.createSourceFile(f, readFileSync(f, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);

/**
 * The JSX elements a slot's class string reaches, in one file.
 *
 * From each read of `<receiver>.<key>`, climb to what consumes it, following
 * the class through up to three hops: a variable it initialises, a local
 * function it is passed to (by position), and the property of an object it
 * becomes — read back as `<owner>.<key>`, never as the whole object, since the
 * merged map holds every slot and following it reaches every element.
 */
/**
 * A tag held in a variable names the elements it can be: `const Comp = asChild
 * ? Slot : "div"` is a div or a Slot, and `` `h${level}` `` is a heading.
 */
function tagNames(sf, tagName) {
  const text = tagName.getText(sf);
  if (!ts.isIdentifier(tagName) || /^[a-z]/.test(text)) return [text];
  let init = null;
  const v = (n) => { if (!init && ts.isVariableDeclaration(n) && ts.isIdentifier(n.name) && n.name.text === text && n.initializer) init = n.initializer; ts.forEachChild(n, v); };
  v(sf);
  // Only a choice of tags: `cond ? Slot : "div"`, a string, a template. A
  // component defined in the file (`forwardRef<…>(…)`) is named as itself.
  const bare = (e) => ts.isParenthesizedExpression(e) || ts.isAsExpression(e) ? bare(e.expression) : e;
  const b = init && bare(init);
  if (!b || !(ts.isConditionalExpression(b) || ts.isStringLiteral(b) || ts.isTemplateExpression(b) || ts.isNoSubstitutionTemplateLiteral(b))) return [text];
  const names = [];
  const w = (n) => {
    if (ts.isStringLiteral(n) && /^[a-z][a-z0-9]*$/.test(n.text)) names.push(n.text);
    else if (ts.isTemplateExpression(n) && n.head.text === "h") { names.push("h1–h6"); return; }
    else if (ts.isIdentifier(n) && /^[A-Z]/.test(n.text) && !ts.isPropertyAccessExpression(n.parent)) names.push(n.text);
    ts.forEachChild(n, w);
  };
  w(init);
  // A type assertion lists the members a template already named.
  const out = names.includes("h1–h6") ? names.filter((n) => !/^h[1-6]$/.test(n)) : names;
  return out.length ? out : [text];
}

/** A declaration by name in one file. */
function localNamed(file, name) {
  let found = null;
  const v = (n) => {
    if (found) return;
    if (ts.isVariableStatement(n) && n.declarationList.declarations.some((d) => ts.isIdentifier(d.name) && d.name.text === name)) found = n;
    else if (ts.isFunctionDeclaration(n) && n.name?.text === name) found = n;
    else ts.forEachChild(n, v);
  };
  v(file);
  return found;
}

/** A component's declaration: in this file, or in the module a relative import names. */
function declarationOf(sf, name) {
  const local = (file) => {
    let found = null;
    const v = (n) => {
      if (found) return;
      if (ts.isVariableStatement(n) && n.declarationList.declarations.some((d) => ts.isIdentifier(d.name) && d.name.text === name)) found = n;
      else if (ts.isFunctionDeclaration(n) && n.name?.text === name) found = n;
      else ts.forEachChild(n, v);
    };
    v(file);
    return found;
  };
  const here = local(sf);
  // A binding that is a component, not a lazily loaded one: `const ClockFace =
  // useClockFace(…)` and `useLazyComponent(…)` hand back the module's export.
  const isComponent = (n) => ts.isFunctionDeclaration(n) || !n.declarationList.declarations.some((d) =>
    d.initializer && ts.isCallExpression(d.initializer) && /^use[A-Z]|^lazy$/.test(d.initializer.expression.getText(sf)));
  if (here && isComponent(here)) return { sf, node: here };
  // The lazily loaded module, by the convention the components keep: the
  // component lives in a file of its own name beside the one that loads it.
  if (here) {
    const sibling = [".tsx", ".ts"].map((x) => join(dirname(sf.fileName), name + x)).find((f) => existsSync(f));
    if (sibling) {
      const target = parse(sibling);
      const node = local(target) ?? target.statements.find((x) => ts.isFunctionDeclaration(x) && x.modifiers?.some((m) => m.kind === ts.SyntaxKind.DefaultKeyword));
      if (node) return { sf: target, node };
    }
    return null;
  }
  for (const st of sf.statements) {
    if (!ts.isImportDeclaration(st) || !ts.isStringLiteral(st.moduleSpecifier) || !st.moduleSpecifier.text.startsWith(".")) continue;
    const clause = st.importClause;
    const spec = clause?.namedBindings && ts.isNamedImports(clause.namedBindings) ? clause.namedBindings.elements.find((e) => e.name.text === name) : null;
    const named = !!spec;
    // `import { CheckIcon as CheckIconDefault }` is CheckIcon in its module.
    const exported = spec?.propertyName?.text ?? name;
    const isDefault = clause?.name?.text === name;
    if (!named && !isDefault) continue;
    const base = resolvePath(dirname(sf.fileName), st.moduleSpecifier.text.replace(/\.js$/, ""));
    const file = [".tsx", ".ts", "/index.tsx", "/index.ts"].map((x) => base + x).find((f) => existsSync(f));
    if (!file) return null;
    const target = parse(file);
    const node = (exported !== name ? localNamed(target, exported) : local(target)) ?? (isDefault ? target.statements.find((x) => ts.isExportAssignment(x) || (ts.isFunctionDeclaration(x) && x.modifiers?.some((m) => m.kind === ts.SyntaxKind.DefaultKeyword))) : null);
    return node ? { sf: target, node } : null;
  }
  return null;
}

export function elementsFor(sf, key, startProp = null, inRange = () => true, depth = 3, startIdent = null) {
  const found = new Set();
  /**
   * Where the class lands on one of the library's own components rather than
   * on an element, follow it inside: the prop it was handed as (`classes`, or
   * a `labelClassName`), read in that component's own declaration, to the
   * element there. `FieldWrapper` says where Input applies `label`; `label`
   * says what it styles.
   */
  const descend = (tagName, attrName, slotKey) => {
    if (depth <= 0 || !ts.isIdentifier(tagName) || !/^[A-Z]/.test(tagName.text) || tagName.text === "Slot") return null;
    const decl = declarationOf(sf, tagName.text);
    if (!decl) return null;
    const inside = (n) => n.pos >= decl.node.pos && n.end <= decl.node.end;
    const out = /classes$/i.test(attrName) || RECEIVER.test(attrName)
      ? elementsFor(decl.sf, slotKey, null, inside, depth - 1)
      : elementsFor(decl.sf, slotKey, null, inside, depth - 1, attrName);
    return out.size ? out : null;
  };
  const record = (tagName, attrName = null, slotKey = key) => {
    const inner = attrName ? descend(tagName, attrName, slotKey) : null;
    if (inner) for (const t of inner) found.add(t);
    else for (const t of tagNames(sf, tagName)) found.add(t);
  };
  const locals = localReceivers(sf);
  const isReceiver = (e) => { const t = e.getText(sf).replace(/\?$/, ""); return RECEIVER.test(t) || locals.has(t); };
  const refsOf = (name, except) => { const out = []; const v = (n) => { if (ts.isIdentifier(n) && n.text === name && n !== except && !(ts.isPropertyAccessExpression(n.parent) && n.parent.name === n) && !(ts.isPropertyAssignment(n.parent) && n.parent.name === n)) out.push(n); ts.forEachChild(n, v); }; v(sf); return out; };
  const fnNamed = (name) => {
    let fn = null;
    const v = (m) => {
      if (fn) return;
      if (ts.isFunctionDeclaration(m) && m.name?.text === name) fn = m;
      if (ts.isVariableDeclaration(m) && ts.isIdentifier(m.name) && m.name.text === name && m.initializer) {
        const init = m.initializer;
        if (ts.isArrowFunction(init) || ts.isFunctionExpression(init)) fn = init;
        else if (ts.isCallExpression(init) && init.arguments[0] && (ts.isArrowFunction(init.arguments[0]) || ts.isFunctionExpression(init.arguments[0]))) fn = init.arguments[0];
      }
      ts.forEachChild(m, v);
    };
    v(sf);
    return fn;
  };
  /** The variable an object literal ends up in, through parens, casts, arrows and hook calls. */
  const ownerOf = (obj) => {
    for (let n = obj.parent; n; n = n.parent) {
      if (ts.isVariableDeclaration(n)) return ts.isIdentifier(n.name) ? n.name.text : null;
      if (ts.isParenthesizedExpression(n) || ts.isAsExpression(n) || ts.isSatisfiesExpression(n) || ts.isReturnStatement(n) || ts.isBlock(n)) continue;
      // Through a memo's factory, which is the value; any other function
      // returns the object to its callers instead.
      if ((ts.isArrowFunction(n) || ts.isFunctionExpression(n)) && ts.isCallExpression(n.parent) && /useMemo$/.test(n.parent.expression.getText(sf))) continue;
      if (ts.isCallExpression(n) && /useMemo$/.test(n.expression.getText(sf))) continue;
      return null;
    }
    return null;
  };
  const climb = (start, hops, seen) => {
    let child = start;
    for (let n = start.parent; n; child = n, n = n.parent) {
      if (ts.isJsxAttribute(n)) { record(n.parent.parent.tagName, n.name.getText(sf)); return; }
      if (ts.isJsxSpreadAttribute(n)) { record(n.parent.parent.tagName); return; }
      // A hook's dependency list reads the slot to watch it, not to apply it.
      if (ts.isArrayLiteralExpression(n) && ts.isCallExpression(n.parent) && n.parent.arguments.indexOf(n) > 0 && /^(React\.)?use[A-Z]\w*$/.test(n.parent.expression.getText(sf))) return;
      if (ts.isCallExpression(n) && ts.isIdentifier(n.expression) && n.arguments.includes(child) && hops > 0) {
        const fn = fnNamed(n.expression.text);
        const param = fn?.parameters[n.arguments.indexOf(child)];
        const tag = `${n.expression.text}#${n.arguments.indexOf(child)}`;
        if (param && ts.isIdentifier(param.name) && !seen.has(tag)) {
          seen.add(tag);
          for (const r of refsOf(param.name.text, param.name)) if (r.pos >= fn.pos && r.end <= fn.end) climb(r, hops - 1, seen);
        }
        // And on from the call only when the function hands back what it was
        // given — `stripOverflow(cls)` returns a class; a render helper that
        // took the class to apply it inside does not.
        const pname = param && ts.isIdentifier(param.name) ? param.name.text : null;
        const returnsIt = fn && pname && (() => {
          let hit = false;
          const mentions = (e) => { let m = false; const v = (x) => { if (ts.isIdentifier(x) && x.text === pname) m = true; ts.forEachChild(x, v); }; v(e); return m; };
          // Handing back markup that uses the class is applying it, not returning it.
          const jsx = (e) => { let j = false; const v = (x) => { if (ts.isJsxElement(x) || ts.isJsxSelfClosingElement(x) || ts.isJsxFragment(x)) j = true; else ts.forEachChild(x, v); }; v(e); return j; };
          if (!ts.isBlock(fn.body)) return mentions(fn.body) && !jsx(fn.body);
          const v = (x) => { if (hit) return; if (ts.isReturnStatement(x) && x.expression && mentions(x.expression) && !jsx(x.expression)) hit = true; if (!ts.isFunctionLike(x)) ts.forEachChild(x, v); };
          ts.forEachChild(fn.body, v);
          return hit;
        })();
        if (fn && !returnsIt) return;
      }
      if ((ts.isPropertyAssignment(n) || ts.isShorthandPropertyAssignment(n)) && ts.isObjectLiteralExpression(n.parent)) {
        const prop = n.name.getText(sf);
        const owner = ownerOf(n.parent);
        if (prop !== key && owner && !RECEIVER.test(owner)) renamed.set(key, [...(renamed.get(key) ?? []), prop]);
        if (owner && hops > 0 && !seen.has(`${owner}.${prop}`)) {
          seen.add(`${owner}.${prop}`);
          const v = (m) => { if (ts.isPropertyAccessExpression(m) && m.name.text === prop && m.expression.getText(sf).replace(/\?$/, "") === owner) climb(m, hops - 1, seen); ts.forEachChild(m, v); };
          v(sf);
        }
        if (owner) {
          // A map built to rename the slot (`day: mergedClasses.item`) and
          // handed whole to a child's `classes`: that child is what it styles.
          // The merged map itself is not followed this way — it holds every
          // slot, and a child reads its own keys off it directly.
          // An object whose className carries the slot, spread onto an element.
          if (prop === "className") for (const r of refsOf(owner)) {
            if (r.parent && ts.isJsxSpreadAttribute(r.parent)) record(r.parent.parent.parent.tagName);
          }
          // The merged map is built from the prop (`mergeSlot(base.x, classesProp?.x)`),
          // whatever it is called — Slider's is `mc` — and is not a new map.
          const merged = RECEIVER.test(owner) || /mergeSlot\(|classesProp/.test(n.parent.getText(sf));
          if (!merged) for (const r of refsOf(owner)) {
            const attr = r.parent && ts.isJsxExpression(r.parent) && r.parent.parent && ts.isJsxAttribute(r.parent.parent) ? r.parent.parent : null;
            if (attr && /classes$/i.test(attr.name.getText(sf))) record(attr.parent.parent.tagName, attr.name.getText(sf), prop);
          }
          return;
        }
        // No variable: the object goes on — spread onto an element, or returned.
        continue;
      }
      // Returned from a local function: follow its calls.
      if ((ts.isArrowFunction(n) || ts.isFunctionExpression(n)) && hops > 0) {
        const decl = ts.isVariableDeclaration(n.parent) ? n.parent
          : ts.isCallExpression(n.parent) && ts.isVariableDeclaration(n.parent.parent) ? n.parent.parent : null;
        if (decl && ts.isIdentifier(decl.name) && !seen.has(`${decl.name.text}()`)) {
          seen.add(`${decl.name.text}()`);
          for (const r of refsOf(decl.name.text, decl.name)) climb(r, hops - 1, seen);
          return;
        }
      }
      if (ts.isVariableDeclaration(n) && ts.isIdentifier(n.name)) {
        if (hops > 0 && !seen.has(n.name.text)) { seen.add(n.name.text); for (const r of refsOf(n.name.text, n.name)) climb(r, hops - 1, seen); }
        return;
      }
      if (ts.isSourceFile(n) || ts.isFunctionDeclaration(n)) return;
    }
  };
  const visit = (n) => {
    const start = startIdent
      // A prop the class arrived as: its binding's uses, or `props.<name>`.
      ? (ts.isIdentifier(n) && n.text === startIdent &&
          // a reference to the binding, not a name that happens to match:
          // `<label className={…}>` names an attribute, `{ className: … }` a key
          !(ts.isBindingElement(n.parent) && n.parent.name === n) &&
          !(ts.isBindingElement(n.parent) && n.parent.propertyName === n) &&
          !(ts.isJsxAttribute(n.parent) && n.parent.name === n) &&
          !((ts.isPropertyAssignment(n.parent) || ts.isPropertySignature(n.parent)) && n.parent.name === n) &&
          !(ts.isPropertyAccessExpression(n.parent) && n.parent.name === n)) ||
        (ts.isPropertyAccessExpression(n) && n.name.text === startIdent && n.expression.getText(sf) === "props")
      : startProp ? (ts.isPropertyAccessExpression(n) && n.name.text === startProp)
      : (ts.isPropertyAccessExpression(n) && n.name.text === key && isReceiver(n.expression));
    if (inRange(n) && start) climb(n, 3, new Set());
    ts.forEachChild(n, visit);
  };
  visit(sf);
  return found;
}

/**
 * Each slot of one `*Classes` map, with the JSX elements its class reaches.
 *
 * Searched in the files of the component's directory that name the map, then
 * in all of them; an element that is another component is reported by its
 * tag, since that is what the source says the slot is applied to.
 */
export function slotElements(componentDir, map, keys, otherMaps = []) {
  renamed.clear();
  // A file that types its classes with another of the component's maps is
  // that part's: AccordionShimmer's `c.trigger` is not Accordion's trigger.
  const every = walk(componentDir).filter((f) => !/types\.ts$/.test(f));
  // Slots are read where their part is defined. A sub-part (AccordionShimmer,
  // RadioGroup) is read inside its own declaration, whichever file holds it
  // and whether or not it names its map; the root part everywhere else in the
  // directory, outside the other parts' declarations.
  const part = map.replace(/Classes$/, "");
  const others = otherMaps.map((m) => m.replace(/Classes$/, ""));
  const isRoot = part === componentDir.split("/").pop();
  const declarationOf = (sf, name) => {
    let found = null;
    const v = (n) => { if (found) return; if ((ts.isVariableStatement(n) && n.declarationList.declarations.some((d) => ts.isIdentifier(d.name) && d.name.text === name)) || (ts.isFunctionDeclaration(n) && n.name?.text === name)) found = n; else ts.forEachChild(n, v); };
    v(sf);
    return found;
  };
  const scopes = every.map((f) => {
    const sf = parse(f);
    const own = declarationOf(sf, part);
    const theirs = others.map((o) => declarationOf(sf, o)).filter(Boolean);
    const inside = (n, d) => n.pos >= d.pos && n.end <= d.end;
    if (isRoot) return { sf, inRange: (n) => !theirs.some((d) => inside(n, d)) };
    return own ? { sf, inRange: (n) => inside(n, own) } : null;
  }).filter(Boolean);
  const files = scopes;
  const out = {};
  for (const key of keys) {
    const els = new Set();
    for (const { sf, inRange } of files) for (const e of elementsFor(sf, key, null, inRange)) els.add(e);
    // Renamed on the way to another file of the component: read it back there.
    // A renamed property is the part's own name for it, so every file is read.
    if (els.size === 0) for (const prop of renamed.get(key) ?? []) for (const f of every) for (const e of elementsFor(parse(f), key, prop)) els.add(e);
    out[key] = [...els];
  }
  return out;
}
