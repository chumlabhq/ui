import { fireEvent } from "@testing-library/react";
import type { Fixtures } from "./types";
import { ROWS, COLUMNS } from "./_data";

const GET_ID = (r: { id: string }) => r.id;
const FILTERABLE = { role: { options: [{ label: "Engineer", value: "Engineer" }], multi: true } };

const fixtures: Fixtures = [
  { name: "default", props: { data: ROWS, columns: COLUMNS } },
  { name: "empty", props: { data: [], columns: COLUMNS } },
  { name: "loading", props: { data: [], columns: COLUMNS, loading: true } },
  { name: "with-search", props: { data: ROWS, columns: COLUMNS, showSearch: true } },
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
  { name: "mobile", props: { data: ROWS, columns: COLUMNS, renderMobileCard: () => <div>Card</div>, mobileBreakpoint: 9999 } },
  { name: "load-more", props: { data: ROWS, columns: COLUMNS, hasMore: true, loadingMore: true, enableInfiniteScroll: true, onLoadMore: () => {} } },
  {
    name: "pinned-right",
    props: { data: ROWS, columns: COLUMNS, pinnableColumns: ["name", "role"], pinnedRightColumns: ["role"] },
  },
  {
    name: "pin-hover",
    props: { data: ROWS, columns: COLUMNS, pinnableColumns: ["name", "role"], pinnedColumns: ["name"] },
    note: "The pin control and its hover variant only paint while a header is hovered.",
    act: (c) => {
      c.querySelectorAll("th").forEach((th) => fireEvent.mouseEnter(th));
    },
  },
  {
    name: "filter-open",
    props: { data: ROWS, columns: COLUMNS, enableColumnFilters: true, filterableColumns: FILTERABLE },
    act: (c) => {
      const btn = c.querySelector("[data-table-filter-trigger], th button");
      if (btn) fireEvent.click(btn);
    },
  },
  {
    name: "cell-editing",
    props: { data: ROWS, columns: COLUMNS, editable: true, editableColumns: ["name"], getRowId: GET_ID },
    act: (c) => {
      const cell = c.querySelector("tbody td");
      if (cell) fireEvent.doubleClick(cell);
    },
  },
];
export default fixtures;
