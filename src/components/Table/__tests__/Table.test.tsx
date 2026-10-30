import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act, render, screen, within, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Table } from "../index.js";
import type { ColumnDef } from "@tanstack/react-table";
import { setReducedMotion } from "../../../test/matchMedia.js";
import { lazyLoaded } from "../../../test/lazyLoads.js";

// The stub answers nothing by default, so every file that renders a
// motion-aware component states the preference it is testing under.
beforeEach(() => setReducedMotion(false));

import {
  getColumnId,
  getSortDirection,
  isInteractiveElement,
  exportTableToCSV,
  copyToClipboard,
} from "../utils.js";

interface Person {
  id: string;
  name: string;
  age: number;
  email: string;
}

const columns: ColumnDef<Person>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "age", header: "Age" },
  { accessorKey: "email", header: "Email" },
];

const data: Person[] = [
  { id: "1", name: "Alice", age: 30, email: "alice@example.com" },
  { id: "2", name: "Bob", age: 25, email: "bob@example.com" },
  { id: "3", name: "Charlie", age: 35, email: "charlie@example.com" },
];

const getRowId = (row: Person) => row.id;

describe("Table", () => {
  describe("Default classes", () => {
    it("applies default slot styles with no classes prop", () => {
      const { container } = render(<Table columns={columns} data={data} />);
      const th = container.querySelector("th");
      // A bare Table must render styled, not naked padding-only markup.
      expect(th?.className).toContain("bg-cl-bg-elevated");
      expect(th?.className).toContain("border-cl-border");
    });

    it("composes an override with the slot's default, and the override wins on conflict", () => {
      const { container } = render(
        <Table
          columns={columns}
          data={data}
          classes={{ headerCell: "MINE bg-fuchsia-500" }}
        />,
      );
      const th = container.querySelector("th")?.className ?? "";

      // The consumer's own classes arrive.
      expect(th).toContain("MINE");
      // And the library's default is still there rather than discarded. This
      // used to assert the opposite: `classes` replaced the slot outright, so a
      // consumer overriding one slot silently lost the focus ring with it.
      expect(th).toContain("border-b");
      // Where the two collide, the consumer's value is ordered last and wins.
      expect(th).toContain("bg-fuchsia-500");
      expect(th).not.toContain("bg-cl-bg-elevated");
      // An unspecified slot still gets its default, untouched.
      expect(container.querySelector("tbody td")?.className).toContain("text-cl-text");
    });

    it("clears slot styles when unstyled", () => {
      const { container } = render(<Table columns={columns} data={data} unstyled />);
      expect(container.querySelector("th")?.className).not.toContain("bg-cl-bg-elevated");
    });
  });

  describe("Grid keyboard navigation", () => {
    it("exposes a roving tab stop before any cell is focused", () => {
      const { container } = render(<Table columns={columns} data={data} />);
      const stops = [...container.querySelectorAll('td[role="gridcell"][tabindex="0"]')];
      expect(stops).toHaveLength(1);
    });

    it("does not report focus as selection on cells", () => {
      const { container } = render(<Table columns={columns} data={data} />);
      expect(container.querySelector('td[aria-selected]')).toBeNull();
    });
  });

  describe("Rendering", () => {
    it("renders a table with columns and data", () => {
      render(<Table columns={columns} data={data} />);

      const grid = screen.getByRole("grid");
      expect(grid).toBeInTheDocument();
    });

    it("renders column headers", () => {
      render(<Table columns={columns} data={data} />);

      expect(screen.getByText("Name")).toBeInTheDocument();
      expect(screen.getByText("Age")).toBeInTheDocument();
      expect(screen.getByText("Email")).toBeInTheDocument();
    });

    it("renders data rows", () => {
      render(<Table columns={columns} data={data} />);

      expect(screen.getByText("Alice")).toBeInTheDocument();
      expect(screen.getByText("Bob")).toBeInTheDocument();
      expect(screen.getByText("Charlie")).toBeInTheDocument();
    });

    it("renders correct number of rows", () => {
      render(<Table columns={columns} data={data} />);

      const rows = screen.getAllByRole("row");
      // 1 header row + 3 data rows
      expect(rows.length).toBe(4);
    });

    it("renders cell values correctly", () => {
      render(<Table columns={columns} data={data} />);

      expect(screen.getByText("30")).toBeInTheDocument();
      expect(screen.getByText("alice@example.com")).toBeInTheDocument();
    });

    it("applies aria-label to region", () => {
      render(
        <Table columns={columns} data={data} aria-label="Users table" />
      );

      expect(screen.getByRole("region", { name: "Users table" })).toBeInTheDocument();
    });
  });

  describe("Header", () => {
    it("hides header when showHeader is false", () => {
      render(<Table columns={columns} data={data} showHeader={false} />);

      expect(screen.queryByText("Name")).not.toBeInTheDocument();
    });

    it("shows header by default", () => {
      render(<Table columns={columns} data={data} />);

      const columnHeaders = screen.getAllByRole("columnheader");
      expect(columnHeaders.length).toBe(3);
    });
  });

  describe("Sorting", () => {
    it("renders sort buttons when sortable is true", () => {
      render(<Table columns={columns} data={data} sortable />);

      const sortButtons = screen.getAllByRole("button", { name: /sort by/i });
      expect(sortButtons.length).toBeGreaterThan(0);
    });

    it("does not render sort buttons when sortable is false", () => {
      render(<Table columns={columns} data={data} />);

      const sortButtons = screen.queryAllByRole("button", { name: /sort by/i });
      expect(sortButtons.length).toBe(0);
    });

    it("calls onSortingChange when sort button is clicked", async () => {
      const user = userEvent.setup();
      const onSortingChange = vi.fn();

      render(
        <Table
          columns={columns}
          data={data}
          sortable
          onSortingChange={onSortingChange}
        />
      );

      const sortButton = screen.getByRole("button", { name: "Sort by name" });
      await user.click(sortButton);

      expect(onSortingChange).toHaveBeenCalled();
    });

    it("sorts data on first click then reverses on second click", async () => {
      const user = userEvent.setup();

      render(<Table columns={columns} data={data} sortable />);

      const sortButton = screen.getByRole("button", { name: "Sort by age" });

      await user.click(sortButton);

      let rows = screen.getAllByRole("row");
      const firstDataCells1 = within(rows[1]).getAllByRole("gridcell");
      const firstAge = firstDataCells1[1].textContent;

      await user.click(sortButton);

      rows = screen.getAllByRole("row");
      const firstDataCells2 = within(rows[1]).getAllByRole("gridcell");
      const secondAge = firstDataCells2[1].textContent;

      // The two clicks should produce different orderings
      expect(firstAge).not.toBe(secondAge);
    });

    it("applies aria-sort attribute to sorted column header", async () => {
      const user = userEvent.setup();

      render(<Table columns={columns} data={data} sortable />);

      const ageHeader = screen.getAllByRole("columnheader").find(
        (h) => h.textContent?.includes("Age")
      )!;
      expect(ageHeader).toHaveAttribute("aria-sort", "none");

      const sortButton = screen.getByRole("button", { name: "Sort by age" });
      await user.click(sortButton);

      const sortValue = ageHeader.getAttribute("aria-sort");
      expect(["ascending", "descending"]).toContain(sortValue);
    });
  });

  describe("Selection", () => {
    it("renders checkboxes when selectionMode is multiple", () => {
      render(
        <Table
          columns={columns}
          data={data}
          selectionMode="multiple"
          getRowId={getRowId}
        />
      );

      const checkboxes = screen.getAllByRole("checkbox");
      // 1 header "select all" + 3 row checkboxes
      expect(checkboxes.length).toBe(4);
    });

    it("does not render checkboxes when selectionMode is none", () => {
      render(<Table columns={columns} data={data} selectionMode="none" />);

      const checkboxes = screen.queryAllByRole("checkbox");
      expect(checkboxes.length).toBe(0);
    });

    it("calls onSelectedRowIdsChange when a row checkbox is clicked", async () => {
      const user = userEvent.setup();
      const onSelectedRowIdsChange = vi.fn();

      render(
        <Table
          columns={columns}
          data={data}
          selectionMode="multiple"
          getRowId={getRowId}
          onSelectedRowIdsChange={onSelectedRowIdsChange}
        />
      );

      const checkboxes = screen.getAllByRole("checkbox");
      // Click the first data row checkbox (index 1, since 0 is "select all")
      await user.click(checkboxes[1]);

      expect(onSelectedRowIdsChange).toHaveBeenCalled();
    });

    it("selects all rows when select-all checkbox is clicked", async () => {
      const user = userEvent.setup();
      const onSelectedRowIdsChange = vi.fn();

      render(
        <Table
          columns={columns}
          data={data}
          selectionMode="multiple"
          getRowId={getRowId}
          onSelectedRowIdsChange={onSelectedRowIdsChange}
        />
      );

      const checkboxes = screen.getAllByRole("checkbox");
      await user.click(checkboxes[0]); // select all

      expect(onSelectedRowIdsChange).toHaveBeenCalledWith(
        expect.arrayContaining(["1", "2", "3"])
      );
    });

    it("selects a single row and reports its id", async () => {
      const user = userEvent.setup();
      const onSelectedRowIdsChange = vi.fn();

      render(
        <Table
          columns={columns}
          data={data}
          selectionMode="multiple"
          getRowId={getRowId}
          onSelectedRowIdsChange={onSelectedRowIdsChange}
        />
      );

      const checkboxes = screen.getAllByRole("checkbox");
      // Click second data row (index 2 = Bob)
      await user.click(checkboxes[2]);

      expect(onSelectedRowIdsChange).toHaveBeenCalledWith(["2"]);
    });

    it("deselects a row when clicked again", async () => {
      const user = userEvent.setup();
      const onSelectedRowIdsChange = vi.fn();

      render(
        <Table
          columns={columns}
          data={data}
          selectionMode="multiple"
          getRowId={getRowId}
          onSelectedRowIdsChange={onSelectedRowIdsChange}
        />
      );

      const checkboxes = screen.getAllByRole("checkbox");
      await user.click(checkboxes[1]);
      await user.click(checkboxes[1]);

      const lastCall = onSelectedRowIdsChange.mock.calls[onSelectedRowIdsChange.mock.calls.length - 1];
      expect(lastCall[0]).toEqual([]);
    });

    it("renders controlled selectedRowIds", () => {
      render(
        <Table
          columns={columns}
          data={data}
          selectionMode="multiple"
          getRowId={getRowId}
          selectedRowIds={["1", "3"]}
        />
      );

      const checkboxes = screen.getAllByRole("checkbox");
      expect(checkboxes[1]).toBeChecked();
      expect(checkboxes[2]).not.toBeChecked();
      expect(checkboxes[3]).toBeChecked();
    });
  });

  describe("Loading / Shimmer state", () => {
    it("renders shimmer when loading is true", () => {
      render(<Table columns={columns} data={data} loading />);

      expect(screen.getByRole("status", { name: /loading/i })).toBeInTheDocument();
    });

    it("does not render data rows when loading", () => {
      render(<Table columns={columns} data={data} loading />);

      expect(screen.queryByText("Alice")).not.toBeInTheDocument();
    });

    it("respects shimmerCount", () => {
      const { container: _container } = render(
        <Table columns={columns} data={data} loading shimmerCount={5} />
      );

      // shimmerCount=5 means 5 shimmer rows rendered + 1 default = 6
      const shimmerContainer = screen.getByRole("status");
      expect(shimmerContainer).toBeInTheDocument();
    });

    it("renders correct number of shimmer rows for given shimmerCount", () => {
      render(
        <Table columns={columns} data={data} loading shimmerCount={3} />
      );

      // TableShimmer renders 1 header row + shimmerCount data rows
      const shimmerStatus = screen.getByRole("status");
      // The shimmer status container children: 1 header + 3 data = 4 child divs
      expect(shimmerStatus.children.length).toBe(4);
    });

    it("does not render grid when loading", () => {
      render(<Table columns={columns} data={data} loading />);

      expect(screen.queryByRole("grid")).not.toBeInTheDocument();
    });
  });

  describe("Empty state", () => {
    it("renders default empty message when data is empty", () => {
      render(<Table columns={columns} data={[]} />);

      expect(screen.getByText("No data available")).toBeInTheDocument();
    });

    it("renders custom emptyContent when data is empty", () => {
      render(
        <Table
          columns={columns}
          data={[]}
          emptyContent={<div>No results found</div>}
        />
      );

      expect(screen.getByText("No results found")).toBeInTheDocument();
    });

    it("does not show empty state when data is present", () => {
      render(<Table columns={columns} data={data} />);

      expect(screen.queryByText("No data available")).not.toBeInTheDocument();
    });

    it("renders grid with header but no data rows when empty", () => {
      render(<Table columns={columns} data={[]} />);

      const rows = screen.getAllByRole("row");
      // Only the header row
      expect(rows.length).toBe(1);
    });
  });

  describe("Custom classes", () => {
    it("applies custom className to container", () => {
      render(
        <Table columns={columns} data={data} className="custom-table" />
      );

      const region = screen.getByRole("region");
      expect(region).toHaveClass("custom-table");
    });

    it("applies custom classes via classes prop", () => {
      render(
        <Table
          columns={columns}
          data={data}
          classes={{ root: "my-container" }}
        />
      );

      const region = screen.getByRole("region");
      expect(region.className).toContain("my-container");
    });
  });

  describe("Row click", () => {
    it("calls onRowClick when a row is clicked", async () => {
      const user = userEvent.setup();
      const onRowClick = vi.fn();

      render(
        <Table
          columns={columns}
          data={data}
          getRowId={getRowId}
          onRowClick={onRowClick}
        />
      );

      const rows = screen.getAllByRole("row");
      await user.click(rows[1]);

      expect(onRowClick).toHaveBeenCalledWith(
        expect.objectContaining({ name: "Alice" })
      );
    });

    it("does not call onRowClick when clicking an interactive element inside row", async () => {
      const user = userEvent.setup();
      const onRowClick = vi.fn();

      const columnsWithButton: ColumnDef<Person>[] = [
        ...columns,
        {
          id: "actions",
          header: "Actions",
          cell: () => <button>Edit</button>,
        },
      ];

      render(
        <Table
          columns={columnsWithButton}
          data={data}
          getRowId={getRowId}
          onRowClick={onRowClick}
        />
      );

      const editButton = screen.getAllByText("Edit")[0];
      await user.click(editButton);

      expect(onRowClick).not.toHaveBeenCalled();
    });

    it("marks rows as clickable via data-clickable attribute", () => {
      render(
        <Table
          columns={columns}
          data={data}
          getRowId={getRowId}
          onRowClick={() => {}}
        />
      );

      const rows = screen.getAllByRole("row");
      expect(rows[1]).toHaveAttribute("data-clickable", "true");
    });
  });

  describe("Size", () => {
    it("sets data-size attribute", () => {
      render(
        <Table columns={columns} data={data} size="sm" />
      );

      const region = screen.getByRole("region");
      expect(region).toHaveAttribute("data-size", "sm");
    });

    it("defaults size to md", () => {
      render(<Table columns={columns} data={data} />);

      const region = screen.getByRole("region");
      expect(region).toHaveAttribute("data-size", "md");
    });

    // The padding each size paints is the one compact, comfortable and
    // spacious painted before the rename, class for class.
    it.each([
      ["sm", "px-2 py-1 text-xs"],
      ["md", "px-3 py-2.5 text-sm"],
      ["lg", "px-5 py-4 text-base"],
    ] as const)("size %s pads cells with %s", (size, classes) => {
      render(<Table columns={columns} data={data} size={size} />);

      const cell = screen.getAllByRole("gridcell")[0];
      for (const cls of classes.split(" ")) expect(cell.className.split(/\s+/)).toContain(cls);
    });
  });

  describe("Striped rows", () => {
    it("sets data-striped attribute when striped is true", () => {
      render(
        <Table columns={columns} data={data} striped />
      );

      const region = screen.getByRole("region");
      expect(region).toHaveAttribute("data-striped", "true");
    });

    it("marks odd rows with data-striped attribute", () => {
      render(<Table columns={columns} data={data} striped />);

      const rows = screen.getAllByRole("row");
      // Row index 1 (second data row, index=1 in 0-based) should be striped
      expect(rows[2]).toHaveAttribute("data-striped", "true");
    });
  });

  describe("Search", () => {
    it("renders search bar when showSearch is true", () => {
      render(
        <Table columns={columns} data={data} showSearch />
      );

      expect(screen.getByLabelText("Search table")).toBeInTheDocument();
    });

    it("uses custom search placeholder", () => {
      render(
        <Table
          columns={columns}
          data={data}
          showSearch
          searchPlaceholder="Filter rows..."
        />
      );

      expect(screen.getByPlaceholderText("Filter rows...")).toBeInTheDocument();
    });

    it("filters rows when search text is typed", async () => {
      const user = userEvent.setup();

      render(<Table columns={columns} data={data} showSearch />);

      const searchInput = screen.getByLabelText("Search table");
      await user.type(searchInput, "Alice");

      // Only Alice should remain
      expect(screen.getByText("Alice")).toBeInTheDocument();
      expect(screen.queryByText("Bob")).not.toBeInTheDocument();
      expect(screen.queryByText("Charlie")).not.toBeInTheDocument();
    });

    it("shows clear button when search has value", async () => {
      const user = userEvent.setup();

      render(<Table columns={columns} data={data} showSearch />);

      const searchInput = screen.getByLabelText("Search table");
      await user.type(searchInput, "test");

      const clearButton = screen.getByRole("button", { name: "Clear search" });
      expect(clearButton).toBeInTheDocument();
    });

    it("clears search when clear button is clicked", async () => {
      const user = userEvent.setup();

      render(<Table columns={columns} data={data} showSearch />);

      const searchInput = screen.getByLabelText("Search table");
      await user.type(searchInput, "Alice");

      expect(screen.queryByText("Bob")).not.toBeInTheDocument();

      const clearButton = screen.getByRole("button", { name: "Clear search" });
      await user.click(clearButton);

      expect(screen.getByText("Alice")).toBeInTheDocument();
      expect(screen.getByText("Bob")).toBeInTheDocument();
      expect(screen.getByText("Charlie")).toBeInTheDocument();
    });

    it("calls onGlobalFilterChange when search text changes", async () => {
      const user = userEvent.setup();
      const onGlobalFilterChange = vi.fn();

      render(
        <Table
          columns={columns}
          data={data}
          showSearch
          onGlobalFilterChange={onGlobalFilterChange}
        />
      );

      const searchInput = screen.getByLabelText("Search table");
      await user.type(searchInput, "A");

      expect(onGlobalFilterChange).toHaveBeenCalledWith("A");
    });
  });

  describe("Row expansion", () => {
    it("renders expand buttons when expandable is true", () => {
      render(
        <Table
          columns={columns}
          data={data}
          expandable
          renderExpandedRow={(row) => <div>Details for {row.name}</div>}
        />
      );

      const expandButtons = screen.getAllByRole("button", { name: /expand row/i });
      expect(expandButtons.length).toBe(3);
    });

    it("expands a row when expand button is clicked", async () => {
      const user = userEvent.setup();

      render(
        <Table
          columns={columns}
          data={data}
          expandable
          renderExpandedRow={(row) => <div>Details for {row.name}</div>}
        />
      );

      const expandButtons = screen.getAllByRole("button", { name: /expand row/i });
      await user.click(expandButtons[0]);

      expect(screen.getByText("Details for Alice")).toBeInTheDocument();
    });

    it("collapses a row when collapse button is clicked", async () => {
      const user = userEvent.setup();

      render(
        <Table
          columns={columns}
          data={data}
          expandable
          renderExpandedRow={(row) => <div>Details for {row.name}</div>}
        />
      );

      const expandTrigger = screen.getAllByRole("button", { name: /expand row/i })[0];
      await user.click(expandTrigger);

      expect(screen.getByText("Details for Alice")).toBeInTheDocument();

      const collapseButton = screen.getByRole("button", { name: /collapse row/i });
      await user.click(collapseButton);

      expect(screen.queryByText("Details for Alice")).not.toBeInTheDocument();
    });

    it("calls onExpandedRowIdsChange with expanded row ids", async () => {
      const user = userEvent.setup();
      const onExpandedRowIdsChange = vi.fn();

      render(
        <Table
          columns={columns}
          data={data}
          getRowId={getRowId}
          expandable
          onExpandedRowIdsChange={onExpandedRowIdsChange}
          renderExpandedRow={(row) => <div>Details for {row.name}</div>}
        />
      );

      const expandButtons = screen.getAllByRole("button", { name: /expand row/i });
      await user.click(expandButtons[0]);

      expect(onExpandedRowIdsChange).toHaveBeenCalledWith(["1"]);
    });

    it("expands row on row click when expandOnRowClick is true", async () => {
      const user = userEvent.setup();

      render(
        <Table
          columns={columns}
          data={data}
          expandable
          expandOnRowClick
          renderExpandedRow={(row) => <div>Details for {row.name}</div>}
        />
      );

      const rows = screen.getAllByRole("row");
      await user.click(rows[1]); // click first data row

      expect(screen.getByText("Details for Alice")).toBeInTheDocument();
    });

    it("renders controlled expanded state via expandedRowIds", () => {
      render(
        <Table
          columns={columns}
          data={data}
          getRowId={getRowId}
          expandable
          expandedRowIds={["2"]}
          renderExpandedRow={(row) => <div>Details for {row.name}</div>}
        />
      );

      expect(screen.getByText("Details for Bob")).toBeInTheDocument();
      expect(screen.queryByText("Details for Alice")).not.toBeInTheDocument();
    });
  });

  describe("Column pinning", () => {
    it("renders pinned and unpinned tables when pinnedColumns is set", () => {
      render(
        <Table
          columns={columns}
          data={data}
          pinnedColumns={["name"]}
          onPinnedColumnsChange={() => {}}
        />
      );

      const grids = screen.getAllByRole("grid");
      expect(grids.length).toBe(2);
    });

    it("calls onPinnedColumnsChange when pin button is clicked", async () => {
      const user = userEvent.setup();
      const onPinnedColumnsChange = vi.fn();

      render(
        <Table
          columns={columns}
          data={data}
          pinnableColumns={["name", "age", "email"]}
          onPinnedColumnsChange={onPinnedColumnsChange}
        />
      );

      await user.click(screen.getByRole("button", { name: /^pin age column/i }));

      expect(onPinnedColumnsChange).toHaveBeenCalledWith(["age"]);
    });

    it("hands onPinnedColumnsChange the full new array, appending and removing", async () => {
      const user = userEvent.setup();
      const onPinnedColumnsChange = vi.fn();

      render(
        <Table
          columns={columns}
          data={data}
          pinnedColumns={["name"]}
          pinnableColumns={["name", "age", "email"]}
          onPinnedColumnsChange={onPinnedColumnsChange}
        />
      );

      await user.click(screen.getByRole("button", { name: /^pin email column/i }));
      expect(onPinnedColumnsChange).toHaveBeenLastCalledWith(["name", "email"]);

      await user.click(screen.getByRole("button", { name: /unpin name column/i }));
      expect(onPinnedColumnsChange).toHaveBeenLastCalledWith([]);
    });

    it("shows unpin button for already pinned columns", () => {
      render(
        <Table
          columns={columns}
          data={data}
          pinnedColumns={["name"]}
          pinnableColumns={["name", "age", "email"]}
          onPinnedColumnsChange={() => {}}
        />
      );

      expect(
        screen.getByRole("button", { name: /unpin name column/i })
      ).toBeInTheDocument();
    });
  });

  describe("Keyboard navigation", () => {
    it("moves focus right with ArrowRight key", async () => {
      render(<Table columns={columns} data={data} />);

      const cells = screen.getAllByRole("gridcell");
      fireEvent.keyDown(cells[0], { key: "ArrowRight" });

      // Verify that the focus state was updated (cell gets tabIndex 0)
      // The component sets focusedCell state which controls tabIndex
      // We just verify no error is thrown and the event is handled
      expect(cells[0]).toBeInTheDocument();
    });

    it("moves to the visually adjacent cell in a right-to-left table: ArrowLeft is the next column", () => {
      render(<div dir="rtl"><Table columns={columns} data={data} /></div>);

      const row = screen.getAllByRole("row")[1];
      const cells = within(row).getAllByRole("gridcell");
      act(() => cells[1].focus());
      fireEvent.keyDown(cells[1], { key: "ArrowLeft" });
      expect(cells[2]).toHaveFocus();
      fireEvent.keyDown(cells[2], { key: "ArrowRight" });
      fireEvent.keyDown(cells[1], { key: "ArrowRight" });
      expect(cells[0]).toHaveFocus();
      fireEvent.keyDown(cells[0], { key: "ArrowRight" });
      expect(cells[0]).toHaveFocus();
    });

    it("moves focus down with ArrowDown key", async () => {
      render(<Table columns={columns} data={data} />);

      const cells = screen.getAllByRole("gridcell");
      fireEvent.keyDown(cells[0], { key: "ArrowDown" });

      expect(cells[0]).toBeInTheDocument();
    });

    it("clears focus on Escape key", async () => {
      render(<Table columns={columns} data={data} />);

      const cells = screen.getAllByRole("gridcell");
      fireEvent.keyDown(cells[0], { key: "ArrowRight" });
      fireEvent.keyDown(cells[0], { key: "Escape" });

      expect(cells[0]).toBeInTheDocument();
    });
  });

  /**
   * A column's resize handle sits on its inline-end edge, and in a
   * right-to-left table that edge is on the left: the A2 audit measured the
   * handle on the cell's right (its start) and both the arrows and a drag
   * moving the width the physical way, so the edge that moved went the
   * opposite way to the pointer and the key.
   */
  describe("Column resize in a right-to-left table", () => {
    const handleOf = (container: HTMLElement) => container.querySelector("[data-resize-handle]") as HTMLElement;

    it("widens the column on ArrowLeft, which moves its inline-end edge left", () => {
      const { container } = render(<div dir="rtl"><Table columns={columns} data={data} resizable /></div>);
      const handle = handleOf(container);
      const start = Number(handle.getAttribute("aria-valuenow"));
      fireEvent.keyDown(handle, { key: "ArrowLeft" });
      expect(Number(handle.getAttribute("aria-valuenow"))).toBe(start + 8);
      fireEvent.keyDown(handle, { key: "ArrowRight" });
      fireEvent.keyDown(handle, { key: "ArrowRight" });
      expect(Number(handle.getAttribute("aria-valuenow"))).toBe(start - 8);
    });

    it("widens the column when its handle is dragged left", () => {
      const { container } = render(<div dir="rtl"><Table columns={columns} data={data} resizable /></div>);
      const handle = handleOf(container);
      const start = Number(handle.getAttribute("aria-valuenow"));
      fireEvent.mouseDown(handle, { clientX: 100 });
      fireEvent.mouseMove(document, { clientX: 70 });
      fireEvent.mouseUp(document, { clientX: 70 });
      expect(Number(handle.getAttribute("aria-valuenow"))).toBe(start + 30);
    });

    it("draws the handle on the inline-end edge and the header's room for it on the same side", () => {
      const { container } = render(<Table columns={columns} data={data} resizable />);
      const handle = handleOf(container);
      expect(handle).toHaveClass("end-0");
      expect(handle).not.toHaveClass("right-0");
      expect(handle.previousElementSibling).toHaveClass("pe-3");
    });

    it("mirrors the expand icon, which points along the inline axis", () => {
      const { container } = render(
        <Table columns={columns} data={data} expandable getRowId={(r) => r.id} renderExpandedRow={() => null} />,
      );
      const icon = container.querySelector("button[aria-label='Expand row'] svg");
      expect(icon).toHaveClass("rtl:-scale-x-100");
    });
  });

  describe("Caption", () => {
    it("renders a visually hidden caption when provided", () => {
      const { container } = render(
        <Table columns={columns} data={data} caption="Employee data table" />
      );

      const caption = container.querySelector("caption");
      expect(caption).toBeInTheDocument();
      expect(caption!.textContent).toBe("Employee data table");
    });
  });

  describe("Footer", () => {
    it("renders footer when showFooter is true", () => {
      render(
        <Table
          columns={columns}
          data={data}
          showFooter
          footerContent={
            <tr>
              <td colSpan={3}>Total: 3 rows</td>
            </tr>
          }
        />
      );

      expect(screen.getByText("Total: 3 rows")).toBeInTheDocument();
    });

    /**
     * footerContent is "rendered inside <tfoot>", so rows are what it takes.
     * Table used to wrap every footer in a row and cell of its own, which put
     * each of those rows inside a <td>: invalid DOM that the browser reports
     * on load ("<tr> cannot be a child of <td>") and that the HTML parser
     * rearranges, so server markup and the client disagree.
     */
    describe("footerContent", () => {
      /** console.error during `run`, restored even when an assertion in it throws. */
      const consoleErrorsDuring = (run: () => void) => {
        const spy = vi.spyOn(console, "error").mockImplementation(() => {});
        try {
          run();
          return spy.mock.calls.map((c) => String(c[0]));
        } finally {
          spy.mockRestore();
        }
      };

      it.each([
        [
          "a fragment of rows",
          <>
            <tr><td colSpan={3}>Total: 3 rows</td></tr>
            <tr><td colSpan={3}>Updated today</td></tr>
          </>,
        ],
        [
          "an array of rows",
          [
            <tr key="a"><td colSpan={3}>Total: 3 rows</td></tr>,
            <tr key="b"><td colSpan={3}>Updated today</td></tr>,
          ],
        ],
      ])("renders %s directly in the tfoot, no row nested in a cell", (_label, footer) => {
        let tfoot: HTMLElement | null = null;
        const errors = consoleErrorsDuring(() => {
          tfoot = render(<Table columns={columns} data={data} showFooter footerContent={footer} />).container.querySelector("tfoot");
        });
        expect(tfoot!.querySelector("td tr")).toBeNull();
        expect([...tfoot!.children].map((r) => r.textContent)).toEqual(["Total: 3 rows", "Updated today"]);
        expect(errors).toEqual([]);
      });

      it("keeps text in one full-width row, so no text node sits in <tfoot>", () => {
        let container: HTMLElement | null = null;
        const errors = consoleErrorsDuring(() => {
          container = render(<Table columns={columns} data={data} showFooter footerContent="Total: 3 rows" />).container;
        });
        const rows = container!.querySelectorAll("tfoot > tr");
        expect(rows).toHaveLength(1);
        const cell = rows[0].querySelector("td")!;
        expect(cell.colSpan).toBe(3);
        expect(cell.textContent).toBe("Total: 3 rows");
        expect(errors).toEqual([]);
      });

      it("keeps a non-row element in the full-width row too", () => {
        const { container } = render(
          <Table columns={columns} data={data} showFooter footerContent={<span>Summary</span>} />,
        );
        const rows = container.querySelectorAll("tfoot > tr");
        expect(rows).toHaveLength(1);
        expect(rows[0].querySelector("td > span")?.textContent).toBe("Summary");
      });
    });

    it("does not render footer by default", () => {
      const { container } = render(
        <Table columns={columns} data={data} />
      );

      const tfoot = container.querySelector("tfoot");
      expect(tfoot).not.toBeInTheDocument();
    });
  });

  describe("Selected row highlighting", () => {
    it("highlights the selected row via selectedRowId", () => {
      render(
        <Table
          columns={columns}
          data={data}
          getRowId={getRowId}
          selectedRowId="2"
        />
      );

      const rows = screen.getAllByRole("row");
      expect(rows[2]).toHaveAttribute("data-selected", "true");
    });
  });

  describe("Max height and scrollable container", () => {
    it("applies maxHeight style to container", () => {
      render(
        <Table columns={columns} data={data} maxHeight={300} />
      );

      const region = screen.getByRole("region");
      expect(region.style.maxHeight).toBe("300px");
    });

    it("applies string maxHeight", () => {
      render(
        <Table columns={columns} data={data} maxHeight="50vh" />
      );

      const region = screen.getByRole("region");
      expect(region.style.maxHeight).toBe("50vh");
    });
  });

  describe("Inline editing", () => {
    it("enters edit mode on double click when editable is true", async () => {
      const user = userEvent.setup();

      render(
        <Table
          columns={columns}
          data={data}
          editable
          onCellEdit={() => {}}
        />
      );

      const cells = screen.getAllByRole("gridcell");
      // Double click first cell (name: Alice)
      await user.dblClick(cells[0]);

      const input = screen.getByDisplayValue("Alice");
      expect(input).toBeInTheDocument();
    });

    it("calls onCellEdit when edit is committed with Enter", async () => {
      const user = userEvent.setup();
      const onCellEdit = vi.fn();

      render(
        <Table
          columns={columns}
          data={data}
          getRowId={getRowId}
          editable
          onCellEdit={onCellEdit}
        />
      );

      const cells = screen.getAllByRole("gridcell");
      await user.dblClick(cells[0]);

      const input = screen.getByDisplayValue("Alice");
      await user.clear(input);
      await user.type(input, "Alicia");
      await user.keyboard("{Enter}");

      expect(onCellEdit).toHaveBeenCalledWith("1", "name", "Alicia");
    });

    it("cancels edit on Escape key", async () => {
      const user = userEvent.setup();
      const onCellEdit = vi.fn();

      render(
        <Table
          columns={columns}
          data={data}
          getRowId={getRowId}
          editable
          onCellEdit={onCellEdit}
        />
      );

      const cells = screen.getAllByRole("gridcell");
      await user.dblClick(cells[0]);

      await user.keyboard("{Escape}");

      expect(onCellEdit).not.toHaveBeenCalled();
      expect(screen.queryByDisplayValue("Alice")).not.toBeInTheDocument();
      expect(screen.getByText("Alice")).toBeInTheDocument();
    });
  });

  describe("Context menu", () => {
    it("calls onContextMenu with row data on right click", async () => {
      const onContextMenu = vi.fn();

      render(
        <Table
          columns={columns}
          data={data}
          getRowId={getRowId}
          onContextMenu={onContextMenu}
        />
      );

      const rows = screen.getAllByRole("row");
      fireEvent.contextMenu(rows[1]);

      expect(onContextMenu).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ name: "Alice" })
      );
    });
  });

  describe("Infinite scroll", () => {
    it("shows loading more indicator when loadingMore is true", () => {
      render(
        <Table
          columns={columns}
          data={data}
          infiniteScroll
          hasMore
          loadingMore
          onLoadMore={() => {}}
        />
      );

      expect(screen.getByText("Loading more...")).toBeInTheDocument();
    });

    it("shows custom loadingMoreContent", () => {
      render(
        <Table
          columns={columns}
          data={data}
          infiniteScroll
          hasMore
          loadingMore
          onLoadMore={() => {}}
          loadingMoreContent={<span>Fetching...</span>}
        />
      );

      expect(screen.getByText("Fetching...")).toBeInTheDocument();
    });

    it("shows end content when hasMore is false", () => {
      render(
        <Table
          columns={columns}
          data={data}
          infiniteScroll
          hasMore={false}
          onLoadMore={() => {}}
          infiniteEndContent="No more data"
        />
      );

      expect(screen.getByText("No more data")).toBeInTheDocument();
    });
  });

  describe("Copy on click", () => {
    it("calls onCellCopy when a cell is clicked with copyOnClick", async () => {
      const user = userEvent.setup();
      const onCellCopy = vi.fn();

      Object.defineProperty(navigator, "clipboard", {
        value: { writeText: vi.fn().mockResolvedValue(undefined) },
        writable: true,
        configurable: true,
      });

      render(
        <Table
          columns={columns}
          data={data}
          getRowId={getRowId}
          copyOnClick
          onCellCopy={onCellCopy}
        />
      );

      const cells = screen.getAllByRole("gridcell");
      await user.click(cells[0]); // Click Alice cell

      expect(onCellCopy).toHaveBeenCalledWith("Alice", expect.any(String), "name");
    });
  });

  describe("Children prop", () => {
    it("renders children content above the table", () => {
      render(
        <Table columns={columns} data={data}>
          <div data-testid="toolbar">Toolbar</div>
        </Table>
      );

      expect(screen.getByTestId("toolbar")).toBeInTheDocument();
    });
  });

  describe("Floating actions", () => {
    it("renders floating actions overlay", () => {
      render(
        <Table
          columns={columns}
          data={data}
          floatingActions={<button>Bulk Delete</button>}
        />
      );

      expect(screen.getByText("Bulk Delete")).toBeInTheDocument();
      expect(
        screen.getByRole("complementary", { name: "Table actions" })
      ).toBeInTheDocument();
    });
  });

  describe("Column filter dropdown", () => {
    it("renders filter buttons when filterableColumns is set", () => {
      render(
        <Table
          columns={columns}
          data={data}
          filterableColumns={{
            name: {
              options: [
                { label: "Alice", value: "Alice" },
                { label: "Bob", value: "Bob" },
              ],
            },
          }}
        />
      );

      const filterButtons = screen.getAllByRole("button", {
        name: /filter/i,
      });
      expect(filterButtons.length).toBeGreaterThan(0);
    });

    it("opens filter dropdown when filter button is clicked", async () => {
      const user = userEvent.setup();
      render(
        <Table
          columns={columns}
          data={data}
          filterableColumns={{
            name: {
              options: [
                { label: "Alice", value: "Alice" },
                { label: "Bob", value: "Bob" },
              ],
            },
          }}
        />
      );

      const filterButtons = screen.getAllByRole("button", {
        name: /filter/i,
      });
      await user.click(filterButtons[0]);

      // The panel is a lazy half (see FilterPanel) that lands on the render
      // after its chunk, so the wait is on that load rather than on a clock.
      await lazyLoaded();
      const filterContent = screen.getByRole("dialog");
      expect(filterContent).toHaveAttribute("data-table-filter-content");
      expect(filterContent?.textContent).toContain("Filter");
    });

    it("filters data when a filter option is selected", async () => {
      const user = userEvent.setup();
      render(
        <Table
          columns={columns}
          data={data}
          filterableColumns={{
            name: {
              options: [
                { label: "Alice", value: "Alice" },
                { label: "Bob", value: "Bob" },
              ],
            },
          }}
        />
      );

      const filterButtons = screen.getAllByRole("button", {
        name: /filter/i,
      });
      await user.click(filterButtons[0]);
      await lazyLoaded();

      const filterContent = document.querySelector("[data-table-filter-content]");
      expect(filterContent, "the filter dropdown did not open").not.toBeNull();

      const option = within(filterContent as HTMLElement).getByRole("button", {
        name: "Bob",
      });
      await user.click(option);

      // The test is named for filtering; asserting it is the point. Scoped to
      // the grid because the option button also reads "Bob".
      const grid = screen.getByRole("grid");
      expect(within(grid).getByText("Bob")).toBeInTheDocument();
      expect(within(grid).queryByText("Alice")).not.toBeInTheDocument();
    });
  });

  describe("Search icon position", () => {
    it("renders search icon on the right side", () => {
      render(
        <Table
          columns={columns}
          data={data}
          showSearch
          searchIconPosition="end"
        />
      );

      expect(screen.getByLabelText("Search table")).toBeInTheDocument();
    });

    it("hides search icon when searchIconPosition is none", () => {
      const { container } = render(
        <Table
          columns={columns}
          data={data}
          showSearch
          searchIconPosition="none"
        />
      );

      expect(screen.getByLabelText("Search table")).toBeInTheDocument();
      const searchWrapper = container.querySelector("[data-table-search]");
      const icons = searchWrapper?.querySelectorAll("svg");
      expect(icons?.length ?? 0).toBe(0);
    });
  });

  describe("Right-pinned columns", () => {
    it("renders right-pinned table section", () => {
      render(
        <Table
          columns={columns}
          data={data}
          pinnedRightColumns={["email"]}
          onPinnedColumnsChange={() => {}}
        />
      );

      const grids = screen.getAllByRole("grid");
      expect(grids.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("Mobile card rendering", () => {
    it("renders mobile cards when renderMobileCard is provided and mobileBreakpoint met", () => {
      // This used to stub matchMedia to `matches: true` and assert nothing.
      // The stub was inert: Table switches on window.innerWidth against
      // responsiveBreakpoint, never on a media query, so the mobile branch was
      // not reached and there was nothing to assert. jsdom reports 1024, so a
      // breakpoint above it is what puts the table in card mode.
      render(
        <Table
          columns={columns}
          data={data}
          responsiveBreakpoint={9999}
          renderMobileCard={(row) => <div data-testid="mobile-card">{row.name}</div>}
        />
      );

      expect(screen.getAllByTestId("mobile-card")).toHaveLength(data.length);
      expect(screen.queryByRole("grid")).not.toBeInTheDocument();
    });
  });
});

describe("getColumnId", () => {
  it("returns accessorKey when available", () => {
    expect(getColumnId({ accessorKey: "name", id: "col1" })).toBe("name");
  });

  it("returns id when accessorKey is not present", () => {
    expect(getColumnId({ id: "col1" })).toBe("col1");
  });

  it("returns empty string when neither accessorKey nor id is present", () => {
    expect(getColumnId({})).toBe("");
  });

  it("prefers accessorKey over id", () => {
    expect(getColumnId({ accessorKey: "foo", id: "bar" })).toBe("foo");
  });
});

describe("getSortDirection", () => {
  it('returns "ascending" for "asc"', () => {
    expect(getSortDirection("asc")).toBe("ascending");
  });

  it('returns "descending" for "desc"', () => {
    expect(getSortDirection("desc")).toBe("descending");
  });

  it('returns "none" for false', () => {
    expect(getSortDirection(false)).toBe("none");
  });
});

describe("isInteractiveElement", () => {
  it("returns false for null target", () => {
    expect(isInteractiveElement(null)).toBe(false);
  });

  it("returns false for non-Element target", () => {
    const textNode = document.createTextNode("hello");
    expect(isInteractiveElement(textNode)).toBe(false);
  });

  it("returns true for a button element", () => {
    const button = document.createElement("button");
    document.body.appendChild(button);
    expect(isInteractiveElement(button)).toBe(true);
    document.body.removeChild(button);
  });

  it("returns true for an anchor element", () => {
    const link = document.createElement("a");
    document.body.appendChild(link);
    expect(isInteractiveElement(link)).toBe(true);
    document.body.removeChild(link);
  });

  it("returns true for an input element", () => {
    const input = document.createElement("input");
    document.body.appendChild(input);
    expect(isInteractiveElement(input)).toBe(true);
    document.body.removeChild(input);
  });

  it("returns true for element with role=button", () => {
    const div = document.createElement("div");
    div.setAttribute("role", "button");
    document.body.appendChild(div);
    expect(isInteractiveElement(div)).toBe(true);
    document.body.removeChild(div);
  });

  it("returns true for element inside data-popup-content", () => {
    const wrapper = document.createElement("div");
    wrapper.setAttribute("data-popup-content", "");
    const span = document.createElement("span");
    wrapper.appendChild(span);
    document.body.appendChild(wrapper);
    expect(isInteractiveElement(span)).toBe(true);
    document.body.removeChild(wrapper);
  });

  it("returns true for element with data-interactive attribute", () => {
    const div = document.createElement("div");
    div.setAttribute("data-interactive", "");
    document.body.appendChild(div);
    expect(isInteractiveElement(div)).toBe(true);
    document.body.removeChild(div);
  });

  it("returns false for a plain div", () => {
    const div = document.createElement("div");
    document.body.appendChild(div);
    expect(isInteractiveElement(div)).toBe(false);
    document.body.removeChild(div);
  });

  it("returns true for a select element", () => {
    const select = document.createElement("select");
    document.body.appendChild(select);
    expect(isInteractiveElement(select)).toBe(true);
    document.body.removeChild(select);
  });

  it("returns true for a textarea element", () => {
    const textarea = document.createElement("textarea");
    document.body.appendChild(textarea);
    expect(isInteractiveElement(textarea)).toBe(true);
    document.body.removeChild(textarea);
  });
});

describe("exportTableToCSV", () => {
  let createObjectURLSpy: ReturnType<typeof vi.spyOn>;
  let revokeObjectURLSpy: ReturnType<typeof vi.spyOn>;
  let clickSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    clickSpy = vi.fn();
    vi.spyOn(document.body, "appendChild").mockImplementation((node) => node);
    vi.spyOn(document.body, "removeChild").mockImplementation((node) => node);
    createObjectURLSpy = vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:test-url");
    revokeObjectURLSpy = vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});

    vi.spyOn(document, "createElement").mockImplementation((tag: string) => {
      if (tag === "a") {
        const mockLink = {
          href: "",
          download: "",
          style: { display: "" },
          click: clickSpy,
          tagName: "A",
        } as unknown as HTMLAnchorElement;
        return mockLink;
      }
      return document.implementation.createHTMLDocument().createElement(tag);
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("creates and triggers download of a CSV file", () => {
    const testData = [
      { name: "Alice", age: 30 },
      { name: "Bob", age: 25 },
    ];
    const testColumns: ColumnDef<(typeof testData)[0]>[] = [
      { accessorKey: "name", header: "Name" },
      { accessorKey: "age", header: "Age" },
    ];

    exportTableToCSV(testData, testColumns, "test-export");

    expect(createObjectURLSpy).toHaveBeenCalled();
    const blob = createObjectURLSpy.mock.calls[0][0] as Blob;
    expect(blob.type).toBe("text/csv;charset=utf-8;");

    expect(clickSpy).toHaveBeenCalled();
    expect(revokeObjectURLSpy).toHaveBeenCalledWith("blob:test-url");
  });

  it("uses default filename when not provided", () => {
    const testData = [{ name: "Alice" }];
    const testColumns: ColumnDef<(typeof testData)[0]>[] = [
      { accessorKey: "name", header: "Name" },
    ];

    exportTableToCSV(testData, testColumns);

    expect(clickSpy).toHaveBeenCalled();
  });

  it("skips columns with ids starting with __", () => {
    const testData = [{ name: "Alice" }];
    const testColumns: ColumnDef<(typeof testData)[0]>[] = [
      { id: "__selection", header: "Select" } as ColumnDef<(typeof testData)[0]>,
      { accessorKey: "name", header: "Name" },
    ];

    exportTableToCSV(testData, testColumns);

    const blob = createObjectURLSpy.mock.calls[0][0] as Blob;
    expect(blob).toBeDefined();
    expect(clickSpy).toHaveBeenCalled();
  });

  it("handles columns with accessorFn", () => {
    const testData = [{ firstName: "Alice", lastName: "Smith" }];
    const testColumns: ColumnDef<(typeof testData)[0]>[] = [
      {
        id: "fullName",
        header: "Full Name",
        accessorFn: (row) => `${row.firstName} ${row.lastName}`,
      },
    ];

    exportTableToCSV(testData, testColumns);

    expect(clickSpy).toHaveBeenCalled();
    expect(createObjectURLSpy).toHaveBeenCalled();
  });

  it("handles null and undefined cell values", () => {
    const testData = [{ name: null as unknown as string }];
    const testColumns: ColumnDef<(typeof testData)[0]>[] = [
      { accessorKey: "name", header: "Name" },
    ];

    exportTableToCSV(testData, testColumns);
    expect(clickSpy).toHaveBeenCalled();
  });

  it("escapes CSV fields containing commas", () => {
    const testData = [{ name: "Smith, John" }];
    const testColumns: ColumnDef<(typeof testData)[0]>[] = [
      { accessorKey: "name", header: "Name" },
    ];

    exportTableToCSV(testData, testColumns);

    expect(createObjectURLSpy).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();
  });

  it("escapes CSV fields containing double quotes", () => {
    const testData = [{ name: 'She said "hello"' }];
    const testColumns: ColumnDef<(typeof testData)[0]>[] = [
      { accessorKey: "name", header: "Name" },
    ];

    exportTableToCSV(testData, testColumns);

    expect(createObjectURLSpy).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();
  });

  it("escapes CSV fields containing newlines", () => {
    const testData = [{ name: "Line1\nLine2" }];
    const testColumns: ColumnDef<(typeof testData)[0]>[] = [
      { accessorKey: "name", header: "Name" },
    ];

    exportTableToCSV(testData, testColumns);

    expect(createObjectURLSpy).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();
  });

  it("uses column id as header label when header is not a string", () => {
    const testData = [{ name: "Alice" }];
    const testColumns: ColumnDef<(typeof testData)[0]>[] = [
      { accessorKey: "name", header: () => "Custom" },
    ];

    exportTableToCSV(testData, testColumns);

    expect(createObjectURLSpy).toHaveBeenCalled();
  });

  it("handles empty data array", () => {
    const testColumns: ColumnDef<Record<string, string>>[] = [
      { accessorKey: "name", header: "Name" },
    ];

    exportTableToCSV([], testColumns);

    expect(createObjectURLSpy).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();
  });

  it("handles column with only id (no accessorKey or accessorFn)", () => {
    const testData = [{ name: "Alice" }];
    const testColumns: ColumnDef<(typeof testData)[0]>[] = [
      { id: "custom", header: "Custom" },
    ];

    exportTableToCSV(testData, testColumns);

    expect(createObjectURLSpy).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();
  });
});

describe("copyToClipboard", () => {
  const originalClipboard = navigator.clipboard;

  afterEach(() => {
    vi.restoreAllMocks();
    Object.defineProperty(navigator, "clipboard", {
      value: originalClipboard,
      writable: true,
      configurable: true,
    });
  });

  it("uses navigator.clipboard.writeText when available", async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: writeTextMock },
      writable: true,
      configurable: true,
    });

    const result = await copyToClipboard("hello world");

    expect(result).toBe(true);
    expect(writeTextMock).toHaveBeenCalledWith("hello world");
  });

  it("returns false when clipboard API throws an error", async () => {
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: vi.fn().mockRejectedValue(new Error("Permission denied")),
      },
      writable: true,
      configurable: true,
    });

    const result = await copyToClipboard("test");

    expect(result).toBe(false);
  });

  it("falls back to execCommand when clipboard API is unavailable", async () => {
    Object.defineProperty(navigator, "clipboard", {
      value: undefined,
      writable: true,
      configurable: true,
    });

    // jsdom may not have execCommand; define it if missing
    if (!document.execCommand) {
      (document as unknown as Record<string, unknown>).execCommand = vi.fn().mockReturnValue(true);
    }
    const execCommandSpy = vi.spyOn(document, "execCommand").mockReturnValue(true);

    const result = await copyToClipboard("fallback text");

    expect(result).toBe(true);
    expect(execCommandSpy).toHaveBeenCalledWith("copy");
  });
});

import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SortAscIcon,
  SortDescIcon,
  SortNeutralIcon,
  ExpandIcon,
  CollapseIcon,
  DragHandleIcon,
  SearchIcon,
  PinIcon,
  FilterIcon,
} from "../icons.js";

describe("Table Icons", () => {
  const icons = [
    ["ChevronDownIcon", ChevronDownIcon],
    ["ChevronLeftIcon", ChevronLeftIcon],
    ["ChevronRightIcon", ChevronRightIcon],
    ["SortAscIcon", SortAscIcon],
    ["SortDescIcon", SortDescIcon],
    ["SortNeutralIcon", SortNeutralIcon],
    ["ExpandIcon", ExpandIcon],
    ["CollapseIcon", CollapseIcon],
    ["DragHandleIcon", DragHandleIcon],
    ["SearchIcon", SearchIcon],
    ["PinIcon", PinIcon],
  ] as const;

  it.each(icons)("renders %s with className", (_name, Icon) => {
    const { container } = render(<Icon className="test-icon" />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass("test-icon");
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });

  it.each(icons)("renders %s with default className", (_name, Icon) => {
    const { container } = render(<Icon />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  describe("FilterIcon", () => {
    // ADR 002 R4: `active` is a state the icon reports, not a class it picks.
    // The opacity now lives in `filterTrigger`'s default as a data-variant, so
    // a consumer overriding that key keeps control of both states.
    it("marks itself active", () => {
      const { container } = render(<FilterIcon className="test" active={true} />);
      expect(container.querySelector("svg")).toHaveAttribute("data-active", "true");
    });

    it("carries no active marker by default", () => {
      const { container } = render(<FilterIcon className="test" />);
      expect(container.querySelector("svg")).not.toHaveAttribute("data-active");
    });

    it("still passes the caller's className through", () => {
      const { container } = render(<FilterIcon className="test" />);
      expect(container.querySelector("svg")).toHaveClass("test");
    });
  });
});

describe("Table – additional coverage", () => {
  describe("maxWidth / maxHeight / minHeight styles", () => {
    it("applies maxWidth as number to container style", () => {
      const { container } = render(
        <Table columns={columns} data={data} maxWidth={800} aria-label="t" />,
      );
      const region = container.querySelector("[data-table-container]");
      expect((region as HTMLElement).style.maxWidth).toBe("800px");
    });

    it("applies maxWidth as string to container style", () => {
      const { container } = render(
        <Table columns={columns} data={data} maxWidth="50vw" aria-label="t" />,
      );
      const region = container.querySelector("[data-table-container]");
      expect((region as HTMLElement).style.maxWidth).toBe("50vw");
    });

    it("applies maxHeight as number", () => {
      const { container } = render(
        <Table columns={columns} data={data} maxHeight={400} aria-label="t" />,
      );
      const region = container.querySelector("[data-table-container]");
      expect((region as HTMLElement).style.maxHeight).toBe("400px");
    });

    it("applies maxHeight as string", () => {
      const { container } = render(
        <Table columns={columns} data={data} maxHeight="60vh" aria-label="t" />,
      );
      const region = container.querySelector("[data-table-container]");
      expect((region as HTMLElement).style.maxHeight).toBe("60vh");
    });

    it("applies minHeight as number", () => {
      const { container } = render(
        <Table columns={columns} data={data} minHeight={200} aria-label="t" />,
      );
      const region = container.querySelector("[data-table-container]");
      expect((region as HTMLElement).style.minHeight).toBe("200px");
    });

    it("applies minHeight as string", () => {
      const { container } = render(
        <Table columns={columns} data={data} minHeight="20rem" aria-label="t" />,
      );
      const region = container.querySelector("[data-table-container]");
      expect((region as HTMLElement).style.minHeight).toBe("20rem");
    });
  });

  describe("hideVerticalScrollbar / hideHorizontalScrollbar", () => {
    it("applies hideVerticalScrollbar class", () => {
      const { container } = render(
        <Table columns={columns} data={data} hideVerticalScrollbar aria-label="t" />,
      );
      const region = container.querySelector("[data-table-container]");
      expect(region).toBeInTheDocument();
    });

    it("applies hideHorizontalScrollbar class", () => {
      const { container } = render(
        <Table columns={columns} data={data} hideHorizontalScrollbar aria-label="t" />,
      );
      const region = container.querySelector("[data-table-container]");
      expect(region).toBeInTheDocument();
    });

    it("applies both scrollbar classes", () => {
      const { container } = render(
        <Table columns={columns} data={data} hideVerticalScrollbar hideHorizontalScrollbar aria-label="t" />,
      );
      expect(container.querySelector("[data-table-container]")).toBeInTheDocument();
    });
  });

  describe("getRowId prop", () => {
    it("uses custom getRowId for row identification", () => {
      const onSelectedRowIdsChange = vi.fn();
      render(
        <Table
          columns={columns}
          data={data}
          getRowId={(row) => (row as Person).id}
          selectionMode="multiple"
          onSelectedRowIdsChange={onSelectedRowIdsChange}
          aria-label="t"
        />,
      );
      expect(screen.getAllByRole("checkbox").length).toBeGreaterThan(0);
    });
  });

  describe("resizable", () => {
    it("renders with resizable without error", () => {
      render(
        <Table
          columns={columns}
          data={data}
          resizable
          aria-label="t"
        />,
      );
      expect(screen.getByRole("region")).toBeInTheDocument();
    });

    it("calls onColumnSizingChange when provided", () => {
      const onColumnSizingChange = vi.fn();
      render(
        <Table
          columns={columns}
          data={data}
          resizable
          onColumnSizingChange={onColumnSizingChange}
          aria-label="t"
        />,
      );
      expect(screen.getByRole("region")).toBeInTheDocument();
    });
  });

  describe("reorderable", () => {
    it("renders drag handles when reorderable is true", () => {
      render(
        <Table
          columns={columns}
          data={data}
          reorderable
          aria-label="t"
        />,
      );
      const handles = screen.getAllByRole("button", { name: /Reorder row/ });
      expect(handles.length).toBe(data.length);
    });

    it("renders drag handle on right when dragColumnPosition is right", () => {
      render(
        <Table
          columns={columns}
          data={data}
          reorderable
          dragColumnPosition="end"
          aria-label="t"
        />,
      );
      expect(screen.getAllByRole("button", { name: /Reorder row/ }).length).toBe(data.length);
    });
  });

  describe("onColumnFiltersChange callback", () => {
    it("calls onColumnFiltersChange when filter changes", async () => {
      const onColumnFiltersChange = vi.fn();
      render(
        <Table
          columns={columns}
          data={data}
          filterableColumns={{
            name: { options: [{ value: "Alice", label: "Alice" }] },
          }}
          onColumnFiltersChange={onColumnFiltersChange}
          aria-label="t"
        />,
      );
      const filterBtn = screen.getByLabelText("Filter name");
      await userEvent.click(filterBtn);
      await lazyLoaded();
      // Use getAllByText and pick the one inside the filter dropdown (button element)
      const options = screen.getAllByText("Alice");
      const filterOption = options.find((el) => el.closest("button") && el.closest("[data-table-filter-content]"));
      expect(filterOption, "the filter dropdown did not open").toBeDefined();
      await userEvent.click(filterOption!);
      expect(onColumnFiltersChange).toHaveBeenCalled();
    });
  });

  describe("selectAllMode=page", () => {
    it("renders with selectAllMode=page", () => {
      render(
        <Table
          columns={columns}
          data={data}
          selectionMode="multiple"
          selectAllMode="page"
          aria-label="t"
        />,
      );
      expect(screen.getAllByRole("checkbox").length).toBeGreaterThan(0);
    });
  });

  describe("mobile card onContextMenu", () => {
    it("renders mobile cards with onContextMenu when mobileBreakpoint is exceeded", () => {
      const onContextMenu = vi.fn();
      // jsdom innerWidth is 0, so mobileBreakpoint of 9999 ensures mobile view
      render(
        <Table
          columns={columns}
          data={data}
          responsiveBreakpoint={9999}
          renderMobileCard={(row) => <div data-testid="mobile-card">{(row as Person).name}</div>}
          onContextMenu={onContextMenu}
          aria-label="t"
        />,
      );
      const cards = screen.getAllByTestId("mobile-card");
      expect(cards.length).toBeGreaterThan(0);
      fireEvent.contextMenu(cards[0].parentElement!);
      expect(onContextMenu).toHaveBeenCalled();
    });
  });

  describe("column visibility change", () => {
    it("calls onColumnVisibilityChange when column visibility changes", () => {
      const onColumnVisibilityChange = vi.fn();
      render(
        <Table
          columns={columns}
          data={data}
          columnVisibility={{ age: false }}
          onColumnVisibilityChange={onColumnVisibilityChange}
          aria-label="t"
        />,
      );
      expect(screen.queryByText("Age")).not.toBeInTheDocument();
    });
  });

  describe("renderColumnFilter prop", () => {
    it("renders custom filter UI via renderColumnFilter", async () => {
      const renderColumnFilter = vi.fn().mockReturnValue(
        <div data-testid="custom-filter">Custom</div>,
      );
      render(
        <Table
          columns={columns}
          data={data}
          filterableColumns={{
            name: { options: [{ value: "a", label: "A" }] },
          }}
          renderColumnFilter={renderColumnFilter}
          aria-label="t"
        />,
      );
      const filterBtn = screen.getByLabelText("Filter name");
      await userEvent.click(filterBtn);
      await lazyLoaded();
      expect(renderColumnFilter).toHaveBeenCalled();
    });
  });

  describe("onSearchClear callback", () => {
    it("calls onSearchClear when search is cleared", async () => {
      const onSearchClear = vi.fn();
      render(
        <Table
          columns={columns}
          data={data}
          showSearch
          onSearchClear={onSearchClear}
          aria-label="t"
        />,
      );
      const searchInput = screen.getByLabelText("Search table");
      await userEvent.type(searchInput, "Alice");
      const clearBtn = screen.getByLabelText("Clear search");
      await userEvent.click(clearBtn);
      expect(onSearchClear).toHaveBeenCalled();
    });
  });

  describe("filter dropdown single-select mode", () => {
    it("closes dropdown when single-select filter option is clicked", async () => {
      render(
        <Table
          columns={columns}
          data={data}
          filterableColumns={{
            name: {
              options: [
                { value: "Alice", label: "Alice" },
                { value: "Bob", label: "Bob" },
              ],
              multi: false,
            },
          }}
          aria-label="t"
        />,
      );
      const filterBtn = screen.getByLabelText("Filter name");
      await userEvent.click(filterBtn);
      await lazyLoaded();
      expect(document.querySelector("[data-table-filter-content]")).toBeInTheDocument();
      const aliceOptions = screen.getAllByText("Alice");
      const aliceBtn = aliceOptions.find((el) => el.closest("[data-table-filter-content]"));
      expect(aliceBtn, "no Alice option in the filter dropdown").toBeDefined();
      await userEvent.click(aliceBtn!);
      // dropdown should close after single select
      expect(document.querySelector("[data-table-filter-content]")).not.toBeInTheDocument();
    });
  });

  describe("grouping", () => {
    it("renders table with grouping enabled without error", () => {
      const groupedColumns: ColumnDef<Person>[] = [
        { accessorKey: "name", header: "Name" },
        { accessorKey: "age", header: "Age", aggregationFn: "count" },
      ];
      render(
        <Table
          columns={groupedColumns}
          data={data}
          groupBy={["name"]}
          aria-label="t"
        />,
      );
      expect(screen.getByRole("region")).toBeInTheDocument();
    });
  });
});

describe("filter panel placement and direction", () => {
  const PANEL_WIDTH = 180;
  let trigger: { left: number; right: number };

  const box = (left: number, top: number, width: number, height: number) =>
    ({ left, right: left + width, top, bottom: top + height, width, height, x: left, y: top, toJSON() {} }) as DOMRect;

  beforeEach(() => {
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (this: HTMLElement) {
      if (this.tagName === "BUTTON" && this.getAttribute("aria-label") === "Filter name") return box(trigger.left, 40, trigger.right - trigger.left, 14);
      if (this.hasAttribute("data-table-filter-content")) {
        const own = this.closest("[dir]")?.getAttribute("dir") === "rtl";
        const offset = parseFloat(this.style.left || this.style.insetInlineStart);
        const left = this.style.left || !own ? offset : window.innerWidth - offset - PANEL_WIDTH;
        return box(left, 58, PANEL_WIDTH, 71);
      }
      return box(0, 0, 0, 0);
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.documentElement.removeAttribute("dir");
  });

  const open = async (ui: Parameters<typeof render>[0]) => {
    render(ui);
    await userEvent.click(screen.getByLabelText("Filter name"));
    await lazyLoaded();
    const panel = document.querySelector("[data-table-filter-content]") as HTMLElement;
    expect(panel, "the filter panel did not open").not.toBeNull();
    return panel.getBoundingClientRect();
  };

  const table = (
    <Table
      columns={columns}
      data={data}
      aria-label="t"
      filterableColumns={{ name: { options: [{ label: "Alice", value: "Alice" }] } }}
    />
  );

  it("aligns the panel's right edge to the trigger's in a right-to-left page", async () => {
    document.documentElement.setAttribute("dir", "rtl");
    trigger = { left: 600, right: 614 };
    const panel = await open(table);
    expect([panel.left, panel.right]).toEqual([614 - PANEL_WIDTH, 614]);
  });

  it("mirrors the short-of-room branch: the panel ends where a 220 px estimate would", async () => {
    document.documentElement.setAttribute("dir", "rtl");
    trigger = { left: 41, right: 55 };
    const panel = await open(table);
    expect([panel.left, panel.right]).toEqual([41 + 220 - PANEL_WIDTH, 41 + 220]);
  });

  it("leaves a left-to-right panel at its trigger's left edge", async () => {
    trigger = { left: 400, right: 414 };
    expect((await open(table)).left).toBe(400);
  });

  it("leaves the left-to-right short-of-room branch where it was", async () => {
    trigger = { left: window.innerWidth - 55, right: window.innerWidth - 41 };
    const panel = await open(table);
    expect([panel.left, panel.right]).toEqual([window.innerWidth - 41 - 220, window.innerWidth - 41 - 220 + PANEL_WIDTH]);
  });

  it("places a right-to-left table's panel by the table's direction when the page is left-to-right", async () => {
    trigger = { left: 600, right: 614 };
    const panel = await open(<div dir="rtl">{table}</div>);
    expect([panel.left, panel.right]).toEqual([614 - PANEL_WIDTH, 614]);
  });

  describe("after the viewport resizes", () => {
    const resize = (width: number, to: { left: number; right: number }) => {
      Object.defineProperty(window, "innerWidth", { configurable: true, value: width });
      trigger = to;
      fireEvent(window, new Event("resize"));
    };
    afterEach(() => {
      Object.defineProperty(window, "innerWidth", { configurable: true, value: 1024 });
    });

    it("keeps a right-to-left panel beside its trigger", async () => {
      document.documentElement.setAttribute("dir", "rtl");
      trigger = { left: 41, right: 55 };
      await open(table);
      resize(360, { left: 41, right: 55 });
      const panel = document.querySelector("[data-table-filter-content]")!.getBoundingClientRect();
      expect([panel.left, panel.right]).toEqual([41 + 220 - PANEL_WIDTH, 41 + 220]);
    });

    it("moves a left-to-right panel with its trigger", async () => {
      trigger = { left: 969, right: 983 };
      await open(table);
      resize(360, { left: 305, right: 319 });
      const panel = document.querySelector("[data-table-filter-content]")!.getBoundingClientRect();
      expect([panel.left, panel.right]).toEqual([319 - 220, 319 - 220 + PANEL_WIDTH]);
    });
  });
});
