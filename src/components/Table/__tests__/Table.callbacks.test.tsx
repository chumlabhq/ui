import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { Table } from "../index.js";
import type { TableProps } from "../index.js";
import type { HeaderContext } from "@tanstack/react-table";
import { setReducedMotion } from "../../../test/matchMedia.js";

beforeEach(() => setReducedMotion(false));

type Row = { id: string; name: string; role: string };
const ROWS: Row[] = [
  { id: "1", name: "Ada", role: "Engineer" },
  { id: "2", name: "Grace", role: "Admiral" },
];
const COLS: TableProps<Row>["columns"] = [
  { id: "name", accessorKey: "name", header: "Name" },
  { id: "role", accessorKey: "role", header: "Role" },
];
const base = { data: ROWS, columns: COLS, getRowId: (r: Row) => r.id };
const cell = (text: string) => screen.getByRole("gridcell", { name: text });

describe("Table onRowHover", () => {
  it("reports leaving once, not once for the row and again for the table", () => {
    const onRowHover = vi.fn();
    render(<Table {...base} onRowHover={onRowHover} onCursorPositionChange={() => {}} />);
    const row = cell("Ada").closest("tr")!;
    fireEvent.mouseEnter(row);
    fireEvent.mouseLeave(row);
    fireEvent.mouseLeave(screen.getByTestId("table-container"));
    expect(onRowHover.mock.calls.map((c) => c[0])).toEqual([0, null]);
  });
});

describe("Table onHeaderHoverChange", () => {
  const over = (el: Element) => fireEvent.mouseMove(el);

  it("fires without onCursorPositionChange", () => {
    const onHeaderHoverChange = vi.fn();
    render(<Table {...base} onHeaderHoverChange={onHeaderHoverChange} />);
    over(screen.getByRole("columnheader", { name: "Name" }));
    expect(onHeaderHoverChange.mock.calls).toEqual([[true]]);
  });

  it("fires once for one state, and again when it changes", () => {
    const onHeaderHoverChange = vi.fn();
    render(<Table {...base} onHeaderHoverChange={onHeaderHoverChange} onCursorPositionChange={() => {}} />);
    over(screen.getByRole("columnheader", { name: "Name" }));
    over(screen.getByRole("columnheader", { name: "Role" }));
    over(cell("Ada"));
    expect(onHeaderHoverChange.mock.calls).toEqual([[true], [false]]);
  });
});

describe("Table state with no built-in control", () => {
  const headerCalling = (act: (ctx: HeaderContext<Row, unknown>) => void): TableProps<Row>["columns"] => [
    { id: "name", accessorKey: "name", header: (ctx) => <button onClick={() => act(ctx)}>Name</button> },
    COLS[1],
  ];
  const press = () => fireEvent.click(screen.getByRole("button", { name: "Name" }));

  it("reports a column order set from a render, with no order yet", () => {
    const onColumnOrderChange = vi.fn();
    render(<Table {...base} columns={headerCalling((c) => c.table.setColumnOrder(["role", "name"]))} onColumnOrderChange={onColumnOrderChange} />);
    press();
    expect(onColumnOrderChange.mock.calls).toEqual([[["role", "name"]]]);
  });

  it("reports grouping toggled from a render, with no grouping yet", () => {
    const onGroupByChange = vi.fn();
    render(<Table {...base} columns={headerCalling((c) => c.column.toggleGrouping())} onGroupByChange={onGroupByChange} />);
    press();
    expect(onGroupByChange.mock.calls).toEqual([[["name"]]]);
  });
});

describe("Table onCellEdit", () => {
  it("stays quiet when an edit ends with the value it started with", () => {
    const onCellEdit = vi.fn();
    render(<Table {...base} editable editableColumns={["name"]} onCellEdit={onCellEdit} />);
    fireEvent.doubleClick(cell("Ada"));
    fireEvent.keyDown(screen.getByRole("textbox"), { key: "Enter" });
    expect(onCellEdit).not.toHaveBeenCalled();
  });
});

describe('Table selectionMode="single"', () => {
  it("selects a row on a press and replaces it on another", () => {
    const onSelectedRowIdsChange = vi.fn();
    render(<Table {...base} selectionMode="single" onSelectedRowIdsChange={onSelectedRowIdsChange} />);
    fireEvent.click(cell("Ada"));
    fireEvent.click(cell("Grace"));
    expect(onSelectedRowIdsChange.mock.calls).toEqual([[["1"]], [["2"]]]);
    expect(cell("Grace").closest("tr")).toHaveAttribute("aria-selected", "true");
  });

  it("selects a row by Enter on a cell", () => {
    const onSelectedRowIdsChange = vi.fn();
    render(<Table {...base} selectionMode="single" onSelectedRowIdsChange={onSelectedRowIdsChange} />);
    fireEvent.keyDown(cell("Ada"), { key: "Enter" });
    expect(onSelectedRowIdsChange.mock.calls).toEqual([[["1"]]]);
  });
});

describe("Table onRowClick", () => {
  it("fires on Enter on a cell, the keyboard equal of the click", () => {
    const onRowClick = vi.fn();
    const columns: TableProps<Row>["columns"] = [COLS[0], { id: "role", accessorKey: "role", header: "Role", cell: () => <button>Open</button> }];
    render(<Table {...base} columns={columns} onRowClick={onRowClick} />);
    fireEvent.keyDown(within(cell("Ada").closest("tr")!).getAllByRole("button")[0], { key: "Enter" });
    expect(onRowClick).not.toHaveBeenCalled();
    fireEvent.keyDown(cell("Ada"), { key: "Enter" });
    expect(onRowClick.mock.calls).toEqual([[ROWS[0]]]);
  });
});
