import type { Fixture } from "./types.js";
import { RtlBoundary } from "./_harness.js";
import type { TableProps } from "../../components/Table/utils/types.js";
import { ROWS, COLUMNS } from "./_data.js";

type Row = (typeof ROWS)[number];

const GET_ID = (r: Row) => r.id;
const FILTERABLE = { role: { options: [{ label: "Engineer", value: "Engineer" }], multi: true } };

// `Fixture<TableProps<Row>>` rather than `Fixtures<typeof Table>`: Table is
// generic over its row, and `ComponentProps` of a generic forwardRef collapses
// the parameter to `unknown`, which would reject every typed accessor.
const fixtures: Fixture<TableProps<Row>>[] = [
  { name: "default", props: { data: ROWS, columns: COLUMNS } },
  { name: "empty", props: { data: [], columns: COLUMNS } },
  { name: "loading", props: { data: [], columns: COLUMNS, loading: true } },
  {
    name: "pinned-column",
    props: { data: ROWS, columns: COLUMNS, pinnedColumns: ["name"], pinnableColumns: ["name", "role"], onPinColumn: () => {} },
    note: "The only fixture where pinButton reaches data-state=active. Needs all three: pinnableColumns to make the control eligible, onPinColumn because canShowPinButton requires a handler, and pinnedColumns to put it in the active state.",
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
    act: (c, ui) => ui.click(c.querySelector("[data-table-filter-trigger], th button")),
  },
  {
    name: "filter-selected",
    props: { data: ROWS, columns: COLUMNS, enableColumnFilters: true, filterableColumns: FILTERABLE },
    // `filterClearTrigger` only appears once a value is selected, so the act
    // opens the panel AND picks an option.
    act: async (c, ui) => {
      ui.click(c.querySelector("[data-table-filter-trigger], th button"));
      await ui.settle();
      ui.click(c.ownerDocument.querySelector("[data-table-filter-content] button"));
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
    act: (c, ui) => ui.click(c.querySelector("[data-table-filter-trigger], th button")),
  },
];
export default fixtures;
