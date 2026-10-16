import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import ts from "typescript";
import { test, expect, type Page, type Locator } from "./_test";
import { gotoFixture } from "./_nav";
import { caretKeys, caretToEnd, caretToStart, skipWithoutTabTraversal } from "./_helpers";
import { demoPages } from "./_demo-routes";

/**
 * ADR 002 R4, browser tier.
 *
 * `data-state="active"` on the pin control replaces the `pinnedPinButton` and
 * `pinnedPinIcon` keys, which Task 3 deletes. The control ships at `opacity-0`
 * and appears on `group-hover/header`, so jsdom — which resolves no hover and no
 * computed opacity — would assert against an element the user can never see.
 * That is the same failure the fixture repoint removed elsewhere: a green
 * assertion about something invisible.
 *
 * `002-state-attributes.json` marks this requirement `browserTier` and names
 * this file; a guard in state-attributes.contract fails if the attribute is not
 * asserted here.
 */
test.describe("Table (fixtures)", () => {
  test("marks the pin control active on a pinned column", async ({ page }) => {
    await gotoFixture(page, "Table", "pinned-column");

    const header = page.locator('[data-fixture] th').first();
    await expect(header).toBeVisible();
    // Hover is the point: the control is opacity-0 until the header is entered.
    await header.hover();

    const pinned = page.locator('[data-fixture] button[data-state="active"]').first();
    await expect(pinned).toBeVisible();

    const opacity = await pinned.evaluate((el) => getComputedStyle(el).opacity);
    expect(
      Number(opacity),
      "the pin control reports active but is still transparent",
    ).toBeGreaterThan(0);
  });

  /**
   * `Table.input` — the cell editor — is recorded in `002-unrenderable-keys.json`
   * as "ATTEMPTED, still unreachable", with the note to re-attempt it with a
   * real double-click in the browser tier before Task 3 deletes it. This is that
   * re-attempt, and the key is NOT dead: a real double-click opens the editor.
   *
   * A dispatched `dblclick` did not, until L9: the editor's own focus moved the
   * roving cell, the roving effect took focus back, and the blur committed and
   * closed the editor in the frame it opened. A real double-click focuses the
   * cell on mousedown first, so it never hit that. Every path into and out of
   * the editor is gated below, the fixtures' own act included.
   */
  test("opens the cell editor on a real double-click", async ({ page }) => {
    // `editable`, not `editing-cell`: that fixture's act now opens the editor on
    // load, so there would be nothing left for the real double-click to open.
    await gotoFixture(page, "Table", "editable");

    const cell = page.locator('[data-fixture] tbody td').first();
    await expect(cell).toBeVisible();
    await expect(page.locator('[data-fixture] tbody input')).toHaveCount(0);

    await cell.dblclick();

    const editor = page.locator('[data-fixture] tbody input');
    await expect(editor).toBeVisible();
    await expect(
      page.locator('[data-fixture] td[data-editing="true"]'),
      "the editor is open but the cell does not report it",
    ).toHaveCount(1);
  });
});

/**
 * Every editable cell, through every way into the editor and back out.
 *
 * L8 found `editing-cell` and `cell-editing` reporting their act "applied"
 * while no `[data-edit-input]` ever mounted. The act dispatches `dblclick` at a
 * cell nothing has focused, and the editor did mount — then its own focus
 * bubbled to the cell's `onFocus`, moved the roving `focusedCell` off null, and
 * the roving effect focused the `<td>` over it. The blur committed and closed
 * the editor in the frame it opened. A real double-click focuses the cell on
 * mousedown first, which is why the test above it was green.
 *
 * The same path had no keyboard way in (editing was pointer-only, SC 2.1.1),
 * left focus on `<body>` after Enter and Escape (SC 2.4.3), and let the
 * editor's keys reach the grid: ArrowLeft was `preventDefault`ed by grid
 * navigation, so the caret could not move inside the text being edited. And
 * once it could mount, axe found the editor had no accessible name, and the
 * cell under it still a tab stop it obscured (target-size).
 *
 * Population, read from source rather than listed: every Table fixture whose
 * props set `editable: true`, and every `<Table editable>` on a demo page, by
 * the `<Section title>` around it. The editable column is the first entry of
 * `editableColumns`, or the first column when there is none.
 */
type EditSurface = {
  label: string;
  path: string;
  /** Scopes the table: the fixture root, or the demo section's heading. */
  scope: (page: Page) => Locator;
  column: string | null;
  /** The fixture page runs its act on load; this one's must have opened the editor. */
  act: boolean;
  /** Controlled data that re-renders on `onCellEdit`, so a commit is visible in the cell. */
  observable: boolean;
};

const attr = (el: ts.JsxOpeningLikeElement, name: string) =>
  el.attributes.properties.find((a): a is ts.JsxAttribute => ts.isJsxAttribute(a) && a.name.getText() === name);

const firstString = (node: ts.Node | undefined): string | null => {
  if (!node) return null;
  if (ts.isStringLiteral(node)) return node.text;
  return ts.forEachChild(node, firstString) ?? null;
};

const EDIT_SURFACES: EditSurface[] = (() => {
  const surfaces: EditSurface[] = [];

  const fixtureFile = resolve(process.cwd(), "src/__tests__/fixtures/Table.fixtures.tsx");
  const fsf = ts.createSourceFile(fixtureFile, readFileSync(fixtureFile, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const prop = (o: ts.ObjectLiteralExpression, name: string) =>
    o.properties.find((p): p is ts.PropertyAssignment => ts.isPropertyAssignment(p) && p.name.getText() === name)?.initializer;
  const visitFixture = (node: ts.Node): void => {
    if (ts.isObjectLiteralExpression(node)) {
      const name = prop(node, "name");
      const props = prop(node, "props");
      if (name && ts.isStringLiteral(name) && props && ts.isObjectLiteralExpression(props) && prop(props, "editable")?.kind === ts.SyntaxKind.TrueKeyword) {
        surfaces.push({
          label: `fixture Table/${name.text}`,
          path: `fixture:${name.text}`,
          scope: (page) => page.locator("[data-fixture]"),
          column: firstString(prop(props, "editableColumns")),
          act: prop(node, "act") !== undefined,
          observable: false,
        });
      }
    }
    ts.forEachChild(node, visitFixture);
  };
  visitFixture(fsf);

  for (const { file, routes } of demoPages()) {
    const path = resolve(process.cwd(), "src/pages/demo", file);
    const sf = ts.createSourceFile(path, readFileSync(path, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const visit = (node: ts.Node, section: string | null): void => {
      let current = section;
      if (ts.isJsxElement(node) && node.openingElement.tagName.getText() === "Section") {
        current = firstString(attr(node.openingElement, "title")?.initializer) ?? section;
      }
      if ((ts.isJsxSelfClosingElement(node) || ts.isJsxOpeningElement(node)) && node.tagName.getText() === "Table") {
        const editable = attr(node, "editable");
        const on = editable && (!editable.initializer || editable.initializer.getText() === "{true}");
        if (on) {
          const heading = current ?? "(no section)";
          surfaces.push({
            label: `demo /${routes[0]} "${heading}"`,
            path: `/${routes[0]}`,
            scope: (page) => page.getByRole("heading", { name: heading, exact: true }).locator("xpath=following::table[1]"),
            column: firstString(attr(node, "editableColumns")?.initializer),
            act: false,
            observable: attr(node, "onCellEdit") !== undefined,
          });
        }
      }
      ts.forEachChild(node, (child) => visit(child, current));
    };
    visit(sf, null);
  }
  return surfaces;
})();

test.describe("Table cell editing (every editable cell, every path)", () => {
  test("the editor opens, edits, commits, cancels and hands focus back", async ({ page }) => {
    test.setTimeout(180_000);
    // A guard on the derivation: the two fixtures L8 named, and the demo section.
    expect(EDIT_SURFACES.map((s) => s.label)).toEqual(
      expect.arrayContaining(["fixture Table/editing-cell", "fixture Table/cell-editing", expect.stringMatching(/^demo /)]),
    );

    const failures: string[] = [];
    let rows = 0;
    const check = (surface: EditSurface, row: string, ok: boolean, detail: string) => {
      rows += 1;
      if (!ok) failures.push(`${surface.label} — ${row}: ${detail}`);
    };

    const open = async (surface: EditSurface) => {
      if (surface.path.startsWith("fixture:")) await gotoFixture(page, "Table", surface.path.slice("fixture:".length));
      else await page.goto(surface.path, { waitUntil: "networkidle" });
      const table = surface.scope(page);
      await expect(table.locator("tbody td").first()).toBeVisible();
      // The cell under the editable column, matched on its header text.
      const headers = await table.locator("thead th").allInnerTexts();
      const want = (surface.column ?? "").toLowerCase();
      const index = Math.max(0, headers.findIndex((h) => h.trim().toLowerCase().replace(/\s+/g, "") === want));
      return { table, cell: table.locator("tbody tr").first().locator("td").nth(index) };
    };

    /** What the page says about the editor and about focus, in one read. */
    const read = (cell: Locator) =>
      cell.evaluate((td) => {
        const editor = td.ownerDocument.querySelector<HTMLInputElement>("[data-edit-input]");
        const active = td.ownerDocument.activeElement;
        return {
          editor: !!editor,
          editorFocused: !!editor && active === editor,
          inCell: !!editor && td.contains(editor),
          value: editor?.value ?? null,
          cellFocused: active === td,
          active: active ? active.tagName + (active === td ? "(the cell)" : "") : "none",
          text: (td as HTMLElement).innerText.trim(),
        };
      });

    for (const surface of EDIT_SURFACES) {
      // The fixture page's own act — a dispatched dblclick at an unfocused cell.
      if (surface.act) {
        const { cell } = await open(surface);
        await expect(page.locator("main[data-fixture-act]")).not.toHaveAttribute("data-fixture-act", /none|pending/);
        await page.waitForTimeout(100);
        const s = await read(cell);
        check(surface, "act opens the editor", s.editor && s.editorFocused, `editor=${s.editor} focused=${s.editorFocused} active=${s.active}`);
      }

      // Each way into the editor.
      for (const how of ["double-click", "Enter", "F2"] as const) {
        const { cell } = await open(surface);
        if (how === "double-click") await cell.dblclick();
        else {
          await cell.focus();
          await page.keyboard.press(how);
        }
        await page.waitForTimeout(100);
        const s = await read(cell);
        check(surface, `${how} opens the editor`, s.editor && s.inCell && s.editorFocused, `editor=${s.editor} in-cell=${s.inCell} focused=${s.editorFocused} active=${s.active}`);
        if (how === "double-click") {
          // axe's `label` (critical) on both editing fixtures, once the editor could mount.
          const named = await expect(page.locator("[data-edit-input]")).toHaveAccessibleName(/\S/, { timeout: 1000 }).then(() => true, () => false);
          check(surface, "the editor has an accessible name", named, `no accessible name`);
          // The editor holds the tab stop; a focusable cell under it is a target it obscures (axe target-size).
          const cellTab = await cell.getAttribute("tabindex");
          check(surface, "the cell leaves the tab order while it edits", cellTab === "-1", `cell tabindex=${cellTab}`);
        }
      }

      // Typing edits the value where the caret is; Enter commits and hands focus back.
      {
        const { cell } = await open(surface);
        // On an act fixture the editor is already open, and an input's value is not innerText.
        const before = await read(cell).then((r) => r.value ?? r.text);
        // Measured before the editor opens: the probe borrows focus.
        await caretKeys(page);
        await cell.dblclick();
        await caretToEnd(page);
        await page.keyboard.press("ArrowLeft");
        await page.keyboard.type("Q");
        const typed = await read(cell);
        const expected = before.slice(0, -1) + "Q" + before.slice(-1);
        check(surface, "typing edits at the caret", typed.value === expected, `value=${JSON.stringify(typed.value)} expected ${JSON.stringify(expected)}`);
        await page.keyboard.press("Enter");
        await page.waitForTimeout(100);
        const s = await read(cell);
        check(surface, "Enter closes the editor", !s.editor, `editor still open`);
        check(surface, "focus returns to the cell after commit", s.cellFocused, `active=${s.active}`);
        if (surface.observable) check(surface, "Enter commits the value", s.text === expected, `cell reads ${JSON.stringify(s.text)}, expected ${JSON.stringify(expected)}`);
      }

      // Escape cancels: the typed text is gone and focus is back on the cell.
      {
        const { cell } = await open(surface);
        const before = await read(cell).then((r) => r.value ?? r.text);
        await cell.dblclick();
        await page.keyboard.type("Z");
        await page.keyboard.press("Escape");
        await page.waitForTimeout(100);
        const s = await read(cell);
        check(surface, "Escape closes the editor", !s.editor, `editor still open`);
        check(surface, "Escape restores the value", s.text === before, `cell reads ${JSON.stringify(s.text)}, was ${JSON.stringify(before)}`);
        check(surface, "focus returns to the cell after cancel", s.cellFocused, `active=${s.active}`);
        await cell.dblclick();
        await page.waitForTimeout(50);
        const reopened = await read(cell);
        check(surface, "Escape leaves nothing behind", reopened.value === before, `reopened editor holds ${JSON.stringify(reopened.value)}`);
      }
    }

    console.log(`CELL_EDITING ${EDIT_SURFACES.length} surfaces (${EDIT_SURFACES.map((s) => s.label).join(", ")}), ${rows} rows, ${failures.length} failing`);
    expect(failures, `${failures.length} of ${rows} cell-editing rows failed`).toEqual([]);
  });
});

/**
 * The grid's navigation keys, APG data grid, over the body cells.
 *
 * TABLE.ai.md documented Home and End and the grid did nothing with them. These
 * rows hold all four, from the first, a middle and the last body row, on a
 * grid big enough that each key lands somewhere no other key would. The
 * header row is not in the roving grid (its controls are reached with Tab), so
 * the rows that start there check that the keys leave it alone.
 *
 * Around them, what the keys must not disturb: the arrows (printed, so a run
 * at HEAD and a run after can be compared line for line), the header controls'
 * tab order and activation, the caret in a text field — the cell editor and
 * the built-in search — and the controls inside cells.
 */
test.describe("Table grid keys", () => {
  test("Home, End, Ctrl+Home and Ctrl+End move the cell; nothing else moves", async ({ page }) => {
    const rows: Array<{ name: string; ok: boolean; detail: string }> = [];
    const row = (name: string, ok: boolean, detail = "") => rows.push({ name, ok, detail });

    // Where focus is, as [row, column] of the body grid; null off the grid.
    const at = () =>
      page.evaluate(() => {
        const td = document.activeElement?.closest("tbody td");
        if (!td) return null;
        const tr = td.closest("tr")!;
        return [[...tr.parentElement!.children].indexOf(tr), [...tr.children].indexOf(td)] as [number, number];
      });
    const cell = (r: number, c: number) => page.locator(`[data-fixture] tbody tr:nth-child(${r + 1}) td:nth-child(${c + 1})`);

    // ── the four keys, keyboard-grid: 5 rows × 4 columns ──
    await gotoFixture(page, "Table", "keyboard-grid");
    const LAST_ROW = 4;
    const LAST_COL = 3;
    const starts: Array<[string, number, number]> = [["first row", 0, 1], ["middle row", 2, 2], ["last row", LAST_ROW, 1]];
    const keys: Array<[string, (r: number) => [number, number]]> = [
      ["Home", (r) => [r, 0]],
      ["End", (r) => [r, LAST_COL]],
      ["Control+Home", () => [0, 0]],
      ["Control+End", () => [LAST_ROW, LAST_COL]],
    ];
    for (const [key, target] of keys) {
      for (const [label, r, c] of starts) {
        await cell(r, c).focus();
        await page.keyboard.press(key);
        const got = await at();
        const want = target(r);
        row(`${key} from the ${label}`, JSON.stringify(got) === JSON.stringify(want), `at ${JSON.stringify(got)}, want ${JSON.stringify(want)}`);
      }
    }

    // ── arrows: bounded moves, printed for a HEAD/after comparison ──
    const arrows: string[] = [];
    for (const [r, c, key] of [[2, 2, "ArrowLeft"], [2, 2, "ArrowRight"], [2, 2, "ArrowUp"], [2, 2, "ArrowDown"], [0, 0, "ArrowLeft"], [0, 0, "ArrowUp"], [LAST_ROW, LAST_COL, "ArrowRight"], [LAST_ROW, LAST_COL, "ArrowDown"]] as Array<[number, number, string]>) {
      await cell(r, c).focus();
      await page.keyboard.press(key);
      arrows.push(`${key}@${r},${c}->${JSON.stringify(await at())}`);
    }
    console.log(`TABLE_ARROWS ${arrows.join(" ")}`);
    const expectArrows = ["ArrowLeft@2,2->[2,1]", "ArrowRight@2,2->[2,3]", "ArrowUp@2,2->[1,2]", "ArrowDown@2,2->[3,2]", "ArrowLeft@0,0->[0,0]", "ArrowUp@0,0->[0,0]", "ArrowRight@4,3->[4,3]", "ArrowDown@4,3->[4,3]"];
    row("arrows move one cell and stop at the edges", arrows.join(" ") === expectArrows.join(" "), arrows.join(" "));

    // ── header controls: activation, and the keys left alone (their tab order is its own test, below) ──
    for (const fixture of ["sortable", "filterable", "pinned-column"]) {
      await gotoFixture(page, "Table", fixture);
      const control = page.locator("[data-fixture] thead button").first();
      if (!(await control.count())) {
        row(`${fixture}: has a header control to test`, false, "none found");
        continue;
      }
      await control.focus();
      const scroll0 = await page.evaluate(() => window.scrollY);
      for (const key of ["Home", "End", "Control+Home", "Control+End"]) await page.keyboard.press(key);
      const still = await control.evaluate((el) => el === document.activeElement);
      const scroll1 = await page.evaluate(() => window.scrollY);
      row(`${fixture}: Home/End on a header control leave focus and scroll alone`, still && scroll0 === scroll1 && (await at()) === null, `focus kept ${still}, scrollY ${scroll0}->${scroll1}`);

      const state = () =>
        page.evaluate(() => {
          const th = document.querySelector("[data-fixture] thead th");
          const b = th?.querySelector("button");
          return [th?.getAttribute("aria-sort"), b?.getAttribute("aria-expanded"), b?.getAttribute("data-state"), b?.getAttribute("aria-pressed"), !!document.querySelector("[data-table-filter-content]")].join("|");
        });
      // pinned-column's pins are fixed (onPinnedColumnsChange is a no-op), so Enter has
      // nothing to change there; pin activation is checked on the demo below.
      if (fixture === "pinned-column") continue;
      for (const key of ["Enter", "Space"]) {
        await control.focus();
        const before = await state();
        await page.keyboard.press(key);
        await page.waitForTimeout(150);
        const after = await state();
        row(`${fixture}: ${key} activates the first header control`, before !== after, `${before} -> ${after}`);
        await page.keyboard.press("Escape");
        await page.waitForTimeout(100);
      }
    }

    // ── text fields keep the caret keys: Home and End, or what the platform uses instead ──
    await gotoFixture(page, "Table", "editable");
    const caretKeyNames = await caretKeys(page);
    const editable = page.locator("[data-fixture] tbody td").first();
    await editable.focus();
    await page.keyboard.press("Enter");
    const editor = page.locator("[data-fixture] tbody input");
    await expect(editor).toBeFocused();
    const caret = () => editor.evaluate((el: HTMLInputElement) => [el.selectionStart, el.value.length, el === document.activeElement]);
    await caretToStart(page);
    const home = await caret();
    await caretToEnd(page);
    const end = await caret();
    row(`cell editor: ${caretKeyNames.start} and ${caretKeyNames.end} move the caret, the editor stays open`, home[0] === 0 && home[2] === true && end[0] === end[1] && end[2] === true, `${caretKeyNames.start} ${JSON.stringify(home)} ${caretKeyNames.end} ${JSON.stringify(end)}`);
    await page.keyboard.press("Escape");

    await gotoFixture(page, "Table", "with-search");
    const search = page.locator("[data-fixture] input").first();
    await search.fill("abc");
    await caretToStart(page);
    const sHome = await search.evaluate((el: HTMLInputElement) => [el.selectionStart, el === document.activeElement]);
    await caretToEnd(page);
    const sEnd = await search.evaluate((el: HTMLInputElement) => [el.selectionStart, el === document.activeElement]);
    row(`built-in search: ${caretKeyNames.start} and ${caretKeyNames.end} move the caret`, sHome[0] === 0 && sHome[1] === true && sEnd[0] === 3 && sEnd[1] === true, `${caretKeyNames.start} ${JSON.stringify(sHome)} ${caretKeyNames.end} ${JSON.stringify(sEnd)}`);

    // ── the controls inside cells, on the demo's live sections ──
    await page.goto("/table", { waitUntil: "networkidle" });
    const section = (title: string) => page.locator("section", { has: page.getByRole("heading", { name: title, exact: true }) }).first();

    const select = section("Multi-Row Selection (Checkboxes)").locator("tbody input[type=checkbox]").first();
    const sel0 = await select.isChecked();
    await select.focus();
    await page.keyboard.press("Space");
    row("selection: Space toggles a row checkbox", (await select.isChecked()) !== sel0, `${sel0} -> ${await select.isChecked()}`);

    const expand = section("Row Expansion").getByRole("button", { name: /Expand row|Collapse row/ }).first();
    const exp0 = await expand.getAttribute("aria-label");
    await expand.focus();
    await page.keyboard.press("Enter");
    row("expansion: Enter toggles a row", (await expand.getAttribute("aria-label")) !== exp0, `${exp0} -> ${await expand.getAttribute("aria-label")}`);

    const drag = section("Row Drag & Drop (Default)");
    const first = () => drag.locator("tbody tr").first().innerText();
    const firstBefore = await first();
    await drag.getByRole("button", { name: /^Reorder row 2/ }).focus();
    await page.keyboard.press("ArrowUp");
    row("drag handle: ArrowUp moves the row", (await first()) !== firstBefore, "");

    for (const key of ["Enter", "Space"]) {
      const pin = section("With Pinned Columns (Interactive)").locator("thead button[aria-label*='column']").first();
      const label0 = await pin.getAttribute("aria-label");
      await pin.focus();
      await page.keyboard.press(key);
      await page.waitForTimeout(150);
      const label1 = await section("With Pinned Columns (Interactive)").locator("thead button[aria-label*='column']").first().getAttribute("aria-label");
      row(`pin: ${key} activates a header pin button`, label1 !== label0, `${label0} -> ${label1}`);
    }

    const custom = section("Custom Checkbox Selection").getByRole("checkbox").first();
    const cus0 = await custom.getAttribute("aria-checked") ?? String(await custom.isChecked());
    await custom.focus();
    await page.keyboard.press("Space");
    const cus1 = await custom.getAttribute("aria-checked") ?? String(await custom.isChecked());
    row("custom checkbox: Space toggles it", cus1 !== cus0, `${cus0} -> ${cus1}`);

    // ── pinned columns: one grid, one tab stop, keys cross the parts ──
    // Pinned columns render as tables of their own beside the scrolling one.
    // The body is still one grid: one tab stop, and the keys move across the
    // seam. Cells are found by their text, since each part numbers its own.
    await gotoFixture(page, "Table", "pinned");
    const stops = await page.locator("[data-fixture] tbody td[tabindex='0']").count();
    row("pinned: the body grid has exactly one tab stop", stops === 1, `${stops} cells with tabindex=0`);
    const active = () => page.evaluate(() => document.activeElement?.closest("tbody td")?.textContent?.trim() ?? null);
    const bodyCell = (text: string) => page.locator("[data-fixture] tbody td", { hasText: text }).first();
    await bodyCell("Engineer").focus();
    const placed = await active();
    row("pinned: focusing a scrolling cell keeps focus there", placed === "Engineer", `at ${placed}`);
    await bodyCell("Ada").focus();
    await page.keyboard.press("ArrowRight");
    const right = await active();
    row("pinned: ArrowRight crosses from the pinned cell into the scrolling part", right === "Engineer", `at ${right}`);
    await page.keyboard.press("ArrowLeft");
    const left = await active();
    // Only a real crossing counts: if ArrowRight never left Ada, Ada is no proof.
    row("pinned: ArrowLeft crosses back into the pinned part", right === "Engineer" && left === "Ada", `right ${right}, then left ${left}`);
    await bodyCell("Ada").focus();
    await page.keyboard.press("End");
    const pinnedEnd = await active();
    row("pinned: End reaches the scrolling last cell", pinnedEnd === "Engineer", `at ${pinnedEnd}`);
    await page.keyboard.press("Home");
    const pinnedHome = await active();
    row("pinned: Home reaches the pinned first cell", pinnedEnd === "Engineer" && pinnedHome === "Ada", `End ${pinnedEnd}, then Home ${pinnedHome}`);
    const highlighted = await page.locator("[data-fixture] tbody td[data-highlighted]").count();
    row("pinned: one cell is highlighted, not one per part", highlighted === 1, `${highlighted} highlighted`);

    const failing = rows.filter((r) => !r.ok);
    console.log(`TABLE_GRID_KEYS rows=${rows.length} failing=${failing.length}`);
    for (const r of failing) console.log(`  FAILING ${r.name}: ${r.detail}`);
    expect(failing.map((r) => `${r.name}: ${r.detail}`)).toEqual([]);
  });

  /**
   * Tab reaches the header controls.
   *
   * Its own test, not a row of the one above, so that the engine whose Tab does
   * not reach buttons at all skips it with the reason rather than failing on
   * the platform: in webkit the order read `tbody:td[Ada] > (left the fixture)`
   * on all three fixtures.
   */
  test("Tab reaches the header controls", async ({ page, browserName }) => {
    skipWithoutTabTraversal(test, browserName);
    const describe = () =>
      page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null;
        if (!el || !el.closest("[data-fixture]")) return "(left the fixture)";
        const where = el.closest("thead") ? "thead" : el.closest("tbody") ? "tbody" : "other";
        return `${where}:${el.tagName.toLowerCase()}[${el.getAttribute("aria-label") ?? el.textContent?.trim().slice(0, 20) ?? ""}]`;
      });
    const missing: string[] = [];
    for (const fixture of ["sortable", "filterable", "pinned-column"]) {
      await gotoFixture(page, "Table", fixture);
      await page.locator("body").click({ position: { x: 1, y: 1 } });
      const order: string[] = [];
      for (let i = 0; i < 14; i += 1) {
        await page.keyboard.press("Tab");
        const d = await describe();
        order.push(d);
        if (d === "(left the fixture)" && order.length > 1) break;
      }
      console.log(`TABLE_TAB_ORDER ${fixture}: ${order.join(" > ")}`);
      if (!order.some((o) => o.startsWith("thead:button"))) missing.push(`${fixture}: ${order.join(" > ")}`);
    }
    expect(missing, "Tab never reached a header control").toEqual([]);
  });
});
