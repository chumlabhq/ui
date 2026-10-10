import type { Fixture } from "./types.js";
import type { ActTools } from "./_act.js";
import { RtlBoundary } from "./_harness.js";
import type { TableProps } from "../../components/Table/utils/types.js";
import { ROWS, COLUMNS } from "./_data.js";
import { CheckboxPair } from "./_table.js";

type Row = (typeof ROWS)[number];

const GET_ID = (r: Row) => r.id;

/**
 * A grid big enough to tell the navigation keys apart. On `default`'s two rows
 * and two columns, Home and ArrowLeft land on the same cell, and so do Ctrl+End
 * and one ArrowDown plus one ArrowRight; a broken key could pass for another.
 */
const GRID_COLUMNS = [
  { id: "name", accessorKey: "name", header: "Name" },
  { id: "role", accessorKey: "role", header: "Role" },
  { id: "team", accessorKey: "team", header: "Team" },
  { id: "city", accessorKey: "city", header: "City" },
];
const GRID_ROWS = ["Ada", "Grace", "Alan", "Edsger", "Barbara"].map((name, i) => ({
  id: String(i + 1),
  name,
  role: ["Engineer", "Admiral", "Researcher", "Professor", "Scientist"][i],
  team: ["Core", "Fleet", "Labs", "Theory", "Systems"][i],
  city: ["London", "Arlington", "Manchester", "Austin", "Boston"][i],
}));
const FILTERABLE = { role: { options: [{ label: "Engineer", value: "Engineer" }], multi: true } };

/**
 * Opens a column's filter panel and waits for it to arrive.
 *
 * The panel is a chunk of its own (see `FilterPanel`), so in the browser tier
 * the click starts a fetch and one `settle` is a frame, not a round trip. A
 * fixture that queried straight through would silently render the unopened
 * state and take a visual baseline of it.
 */
/**
 * Poll for an element rather than assume the last act produced it.
 *
 * The panel and its contents do not arrive together: `filter-selected` opened
 * the panel, waited for `[data-table-filter-content]`, then went straight for a
 * `button` inside it — which under a four-worker matrix had not rendered yet,
 * and the act reported "target element not found". Passing three times out of
 * three in isolation is what that looks like.
 */
const waitForElement = async (root: Document | HTMLElement, selector: string, ui: ActTools) => {
  for (let i = 0; i < 25; i += 1) {
    const found = root.querySelector(selector);
    if (found) return found;
    await ui.settle(10);
  }
  return null;
};

const openFilterPanel = async (container: HTMLElement, ui: ActTools) => {
  ui.click(container.querySelector("[data-table-filter-trigger], th button"));
  await waitForElement(container.ownerDocument, "[data-table-filter-content]", ui);
};

// `Fixture<TableProps<Row>>` rather than `Fixtures<typeof Table>`: Table is
// generic over its row, and `ComponentProps` of a generic forwardRef collapses
// the parameter to `unknown`, which would reject every typed accessor.
const fixtures: Fixture<TableProps<Row>>[] = [
  { name: "default", props: { data: ROWS, columns: COLUMNS } },
  {
    name: "keyboard-grid",
    props: { data: GRID_ROWS as unknown as Row[], columns: GRID_COLUMNS, getRowId: GET_ID },
  },
  { name: "empty", props: { data: [], columns: COLUMNS } },
  { name: "loading", props: { data: [], columns: COLUMNS, loading: true } },
  {
    name: "pinned-column",
    props: { data: ROWS, columns: COLUMNS, pinnedColumns: ["name"], pinnableColumns: ["name", "role"], onPinnedColumnsChange: () => {} },
    note: "The only fixture where pinButton reaches data-state=active. Needs all three: pinnableColumns to make the control eligible, onPinnedColumnsChange because canShowPinButton requires a handler, and pinnedColumns to put it in the active state.",
  },
  {
    name: "editing-cell",
    props: { data: ROWS, columns: COLUMNS, editable: true, editableColumns: ["name"], getRowId: GET_ID, onCellEdit: () => {} },
    note: "Attempts editInput: edit mode opens on double-click.",
    act: (c, ui) => ui.dblClick(c.ownerDocument.querySelector("tbody td")),
  },
  { name: "with-search", props: { data: ROWS, columns: COLUMNS, showSearch: true } },
  // `clearTrigger` only renders once the search box holds a value, and
  // `filterClearTrigger` only once a column filter has one selected.
  {
    name: "search-with-value",
    props: { data: ROWS, columns: COLUMNS, showSearch: true, globalFilter: "a" },
  },
  { name: "with-footer", props: { data: ROWS, columns: COLUMNS, showFooter: true, footerContent: "Total" } },
  {
    // Rows, the way the demo's footers and the prop's own doc ("rendered
    // inside <tfoot>") use it. Beside `with-footer`'s text, so both halves of
    // footerContent's contract render and hydrate.
    name: "footer-rows",
    props: {
      data: ROWS,
      columns: COLUMNS,
      showFooter: true,
      footerContent: (
        <>
          <tr>
            <td colSpan={COLUMNS.length}>Total: {ROWS.length} people</td>
          </tr>
          <tr>
            <td colSpan={COLUMNS.length}>Updated today</td>
          </tr>
        </>
      ),
    },
  },
  {
    name: "selectable",
    props: { data: ROWS, columns: COLUMNS, selectionMode: "multiple", getRowId: GET_ID, selectedRowIds: ["1"] },
  },
  {
    name: "expandable",
    props: { data: ROWS, columns: COLUMNS, expandable: true, getRowId: GET_ID, expandedRowIds: ["1"], renderExpandedRow: () => <div>More</div> },
  },
  { name: "sortable", props: { data: ROWS, columns: COLUMNS, sortable: true } },
  { name: "resizable", props: { data: ROWS, columns: COLUMNS, enableColumnResizing: true } },
  {
    name: "pinned",
    props: { data: ROWS, columns: COLUMNS, pinnableColumns: ["name", "role"], pinnedColumns: ["name"] },
    note: "Drives both the pinned container and the unpinned remainder.",
  },
  { name: "filterable", props: { data: ROWS, columns: COLUMNS, enableColumnFilters: true, filterableColumns: FILTERABLE } },
  { name: "editable", props: { data: ROWS, columns: COLUMNS, editable: true, editableColumns: ["name"], getRowId: GET_ID } },
  { name: "draggable", props: { data: ROWS, columns: COLUMNS, enableRowDragDrop: true, getRowId: GET_ID } },
  { name: "grouped", props: { data: ROWS, columns: COLUMNS, groupBy: ["role"] } },
  { name: "mobile", props: { data: ROWS, columns: COLUMNS, renderMobileCard: () => <div>Card</div>, responsiveBreakpoint: 9999 } },
  {
    name: "mobile-search",
    props: { data: ROWS, columns: COLUMNS, renderMobileCard: () => <div>Card</div>, responsiveBreakpoint: 9999, showSearch: true },
    note: "The mobile layout's search field, which only mounts with both renderMobileCard and showSearch.",
  },
  { name: "load-more", props: { data: ROWS, columns: COLUMNS, hasMore: true, loadingMore: true, enableInfiniteScroll: true, onLoadMore: () => {} } },
  {
    name: "infinite-end",
    props: { data: ROWS, columns: COLUMNS, enableInfiniteScroll: true, hasMore: false, infiniteEndContent: "No more rows", onLoadMore: () => {} },
    note:
      "The end-of-list label, which no fixture reached. It shipped `text-gray-500` — a fixed " +
      "grey that cannot follow the theme, and one the painted sweep could not read either, " +
      "because Tailwind v4 computes its palette to oklch(). ADR 007.",
  },
  {
    name: "pinned-right",
    props: { data: ROWS, columns: COLUMNS, pinnableColumns: ["name", "role"], pinnedRightColumns: ["role"] },
  },
  {
    name: "pin-hover",
    props: { data: ROWS, columns: COLUMNS, pinnableColumns: ["name", "role"], pinnedColumns: ["name"] },
    note: "The pin control and its hover variant only paint while a header is hovered.",
    act: (c, ui) => c.querySelectorAll("th").forEach((th) => ui.mouseEnter(th)),
  },
  {
    name: "filter-open",
    props: { data: ROWS, columns: COLUMNS, enableColumnFilters: true, filterableColumns: FILTERABLE },
    act: openFilterPanel,
  },
  {
    name: "filter-selected",
    props: { data: ROWS, columns: COLUMNS, enableColumnFilters: true, filterableColumns: FILTERABLE },
    // `filterClearTrigger` only appears once a value is selected, so the act
    // opens the panel AND picks an option.
    act: async (c, ui) => {
      await openFilterPanel(c, ui);
      ui.click(await waitForElement(c.ownerDocument, "[data-table-filter-content] button", ui));
      await ui.settle();
    },
  },
  {
    name: "cell-editing",
    props: { data: ROWS, columns: COLUMNS, editable: true, editableColumns: ["name"], getRowId: GET_ID },
    act: (c, ui) => ui.dblClick(c.querySelector("tbody td")),
  },
  {
    name: "filter-open-rtl",
    props: { data: ROWS, columns: COLUMNS, enableColumnFilters: true, filterableColumns: FILTERABLE },
    wrap: (node) => <RtlBoundary>{node}</RtlBoundary>,
    act: openFilterPanel,
  },
  {
    // A consumer's `CheckboxIcon` beside the default checkbox, both
    // uncontrolled. `default-state` tabs to each, presses Space and Enter,
    // clicks the icon, and holds the custom one to what the default did.
    name: "custom-checkbox",
    props: { data: ROWS, columns: COLUMNS },
    render: () => <CheckboxPair />,
  },
];
export default fixtures;
