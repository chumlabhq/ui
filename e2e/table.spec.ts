import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import ts from "typescript";
import { test, expect, type Page, type Locator } from "@playwright/test";
import { gotoFixture } from "./_nav";
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
        await cell.dblclick();
        await page.keyboard.press("End");
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
