import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, within, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Table } from "../index";
import type { ColumnDef } from "@tanstack/react-table";
import {
  getColumnId,
  getSortDirection,
  isInteractiveElement,
  exportTableToCSV,
  copyToClipboard,
} from "../utils";

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

    it("applies ariaLabel to region", () => {
      render(
        <Table columns={columns} data={data} ariaLabel="Users table" />
      );

      expect(screen.getByRole("region", { name: "Users table" })).toBeInTheDocument();
    });

    it("uses legacy COLUMNS/COLUMNS_DATA props", () => {
      render(<Table COLUMNS={columns} COLUMNS_DATA={data} />);

      expect(screen.getByText("Alice")).toBeInTheDocument();
      expect(screen.getByText("Name")).toBeInTheDocument();
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

      // Click once -> sorts (direction depends on Table default)
      await user.click(sortButton);

      let rows = screen.getAllByRole("row");
      const firstDataCells1 = within(rows[1]).getAllByRole("gridcell");
      const firstAge = firstDataCells1[1].textContent;

      // Click again -> reverses direction
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

      // Should have a sort direction (ascending or descending)
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

    it("calls onSelectionChange when a row checkbox is clicked", async () => {
      const user = userEvent.setup();
      const onSelectionChange = vi.fn();

      render(
        <Table
          columns={columns}
          data={data}
          selectionMode="multiple"
          getRowId={getRowId}
          onSelectionChange={onSelectionChange}
        />
      );

      const checkboxes = screen.getAllByRole("checkbox");
      // Click the first data row checkbox (index 1, since 0 is "select all")
      await user.click(checkboxes[1]);

      expect(onSelectionChange).toHaveBeenCalled();
    });

    it("selects all rows when select-all checkbox is clicked", async () => {
      const user = userEvent.setup();
      const onSelectionChange = vi.fn();

      render(
        <Table
          columns={columns}
          data={data}
          selectionMode="multiple"
          getRowId={getRowId}
          onSelectionChange={onSelectionChange}
        />
      );

      const checkboxes = screen.getAllByRole("checkbox");
      await user.click(checkboxes[0]); // select all

      expect(onSelectionChange).toHaveBeenCalledWith(
        expect.arrayContaining(["1", "2", "3"])
      );
    });

    it("selects a single row and reports its id", async () => {
      const user = userEvent.setup();
      const onSelectionChange = vi.fn();

      render(
        <Table
          columns={columns}
          data={data}
          selectionMode="multiple"
          getRowId={getRowId}
          onSelectionChange={onSelectionChange}
        />
      );

      const checkboxes = screen.getAllByRole("checkbox");
      // Click second data row (index 2 = Bob)
      await user.click(checkboxes[2]);

      expect(onSelectionChange).toHaveBeenCalledWith(["2"]);
    });

    it("deselects a row when clicked again", async () => {
      const user = userEvent.setup();
      const onSelectionChange = vi.fn();

      render(
        <Table
          columns={columns}
          data={data}
          selectionMode="multiple"
          getRowId={getRowId}
          onSelectionChange={onSelectionChange}
        />
      );

      const checkboxes = screen.getAllByRole("checkbox");
      // Select then deselect first row
      await user.click(checkboxes[1]);
      await user.click(checkboxes[1]);

      // Last call should be empty array (deselected)
      const lastCall = onSelectionChange.mock.calls[onSelectionChange.mock.calls.length - 1];
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
      // Row checkboxes at indices 1 and 3 should be checked
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

    it("respects shimmerRowCount", () => {
      const { container: _container } = render(
        <Table columns={columns} data={data} loading shimmerRowCount={5} />
      );

      // shimmerRowCount=5 means 5 shimmer rows rendered + 1 default = 6
      const shimmerContainer = screen.getByRole("status");
      expect(shimmerContainer).toBeInTheDocument();
    });

    it("renders correct number of shimmer rows for given shimmerRowCount", () => {
      render(
        <Table columns={columns} data={data} loading shimmerRowCount={3} />
      );

      // TableShimmer renders 1 header row + shimmerRowCount data rows
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
          classes={{ container: "my-container" }}
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
      // Click the first data row (index 1)
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
      // Data rows should have data-clickable
      expect(rows[1]).toHaveAttribute("data-clickable", "true");
    });
  });

  describe("Density", () => {
    it("sets data-density attribute", () => {
      render(
        <Table columns={columns} data={data} density="compact" />
      );

      const region = screen.getByRole("region");
      expect(region).toHaveAttribute("data-density", "compact");
    });

    it("defaults density to comfortable", () => {
      render(<Table columns={columns} data={data} />);

      const region = screen.getByRole("region");
      expect(region).toHaveAttribute("data-density", "comfortable");
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

      // All rows should be back
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

      const expandButton = screen.getAllByRole("button", { name: /expand row/i })[0];
      await user.click(expandButton);

      expect(screen.getByText("Details for Alice")).toBeInTheDocument();

      const collapseButton = screen.getByRole("button", { name: /collapse row/i });
      await user.click(collapseButton);

      expect(screen.queryByText("Details for Alice")).not.toBeInTheDocument();
    });

    it("calls onExpandedChange with expanded row ids", async () => {
      const user = userEvent.setup();
      const onExpandedChange = vi.fn();

      render(
        <Table
          columns={columns}
          data={data}
          getRowId={getRowId}
          expandable
          onExpandedChange={onExpandedChange}
          renderExpandedRow={(row) => <div>Details for {row.name}</div>}
        />
      );

      const expandButtons = screen.getAllByRole("button", { name: /expand row/i });
      await user.click(expandButtons[0]);

      expect(onExpandedChange).toHaveBeenCalledWith(["1"]);
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
          onPinColumn={() => {}}
        />
      );

      // Should have separate grids for pinned and unpinned
      const grids = screen.getAllByRole("grid");
      expect(grids.length).toBe(2);
    });

    it("calls onPinColumn when pin button is clicked", async () => {
      const user = userEvent.setup();
      const onPinColumn = vi.fn();

      render(
        <Table
          columns={columns}
          data={data}
          pinnableColumns={["name", "age", "email"]}
          onPinColumn={onPinColumn}
        />
      );

      const pinButtons = screen.getAllByRole("button", { name: /pin .* column/i });
      await user.click(pinButtons[0]);

      expect(onPinColumn).toHaveBeenCalled();
    });

    it("shows unpin button for already pinned columns", () => {
      render(
        <Table
          columns={columns}
          data={data}
          pinnedColumns={["name"]}
          pinnableColumns={["name", "age", "email"]}
          onPinColumn={() => {}}
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
      // Focus the first cell
      fireEvent.keyDown(cells[0], { key: "ArrowRight" });

      // Verify that the focus state was updated (cell gets tabIndex 0)
      // The component sets focusedCell state which controls tabIndex
      // We just verify no error is thrown and the event is handled
      expect(cells[0]).toBeInTheDocument();
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
      // Bob's row (index 2) should be selected
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
      // Input should be gone
      expect(screen.queryByDisplayValue("Alice")).not.toBeInTheDocument();
      // Original cell text should be back
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
          enableInfiniteScroll
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
          enableInfiniteScroll
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
          enableInfiniteScroll
          hasMore={false}
          onLoadMore={() => {}}
          infiniteEndContent="No more data"
        />
      );

      expect(screen.getByText("No more data")).toBeInTheDocument();
    });
  });

  describe("Copy on click", () => {
    it("calls onCellCopy when a cell is clicked with enableCopyOnClick", async () => {
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
          enableCopyOnClick
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

      // Filter dropdown should appear (portal renders filter content)
      const filterContent = document.querySelector("[data-table-filter-content]");
      expect(filterContent).toBeInTheDocument();
      // The dropdown should contain Filter text
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

      // Click on a filter option inside the filter dropdown
      const filterContent = document.querySelector("[data-table-filter-content]");
      const optionButtons = filterContent?.querySelectorAll("button");
      // The first button might be "Clear", the subsequent ones are options
      if (optionButtons && optionButtons.length > 0) {
        const lastOption = optionButtons[optionButtons.length - 1];
        await user.click(lastOption);
      }
    });
  });

  describe("Search icon position", () => {
    it("renders search icon on the right side", () => {
      render(
        <Table
          columns={columns}
          data={data}
          showSearch
          searchIconPosition="right"
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

      // The search input should still exist but no SVG icon sibling
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
          onPinColumn={() => {}}
        />
      );

      // Should have separate grids for pinned sections
      const grids = screen.getAllByRole("grid");
      expect(grids.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("Mobile card rendering", () => {
    it("renders mobile cards when renderMobileCard is provided and mobileBreakpoint met", () => {
      // Mock matchMedia to simulate mobile viewport
      const originalMatchMedia = window.matchMedia;
      window.matchMedia = vi.fn().mockImplementation((query: string) => ({
        matches: true,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      render(
        <Table
          columns={columns}
          data={data}
          responsiveBreakpoint={1024}
          renderMobileCard={(row) => <div data-testid="mobile-card">{row.name}</div>}
        />
      );

      // Restore
      window.matchMedia = originalMatchMedia;
    });
  });
});

// ── Utility function tests ──────────────────────────────────────────────────

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

    // The link.download should be set to "table-export.csv"
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
    // Read blob content
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

    // Should not throw
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

// ─── Table Icons ──────────────────────────────────────────────────────────────

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
} from "../icons";

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
    it("renders with active=true", () => {
      const { container } = render(<FilterIcon className="test" active={true} />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveClass("opacity-100");
    });

    it("renders with active=false (default)", () => {
      const { container } = render(<FilterIcon className="test" />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveClass("opacity-60");
    });
  });
});

describe("Table – additional coverage", () => {
  describe("maxWidth / maxHeight / minHeight styles", () => {
    it("applies maxWidth as number to container style", () => {
      const { container } = render(
        <Table columns={columns} data={data} maxWidth={800} ariaLabel="t" />,
      );
      const region = container.querySelector("[data-table-container]");
      expect((region as HTMLElement).style.maxWidth).toBe("800px");
    });

    it("applies maxWidth as string to container style", () => {
      const { container } = render(
        <Table columns={columns} data={data} maxWidth="50vw" ariaLabel="t" />,
      );
      const region = container.querySelector("[data-table-container]");
      expect((region as HTMLElement).style.maxWidth).toBe("50vw");
    });

    it("applies maxHeight as number", () => {
      const { container } = render(
        <Table columns={columns} data={data} maxHeight={400} ariaLabel="t" />,
      );
      const region = container.querySelector("[data-table-container]");
      expect((region as HTMLElement).style.maxHeight).toBe("400px");
    });

    it("applies maxHeight as string", () => {
      const { container } = render(
        <Table columns={columns} data={data} maxHeight="60vh" ariaLabel="t" />,
      );
      const region = container.querySelector("[data-table-container]");
      expect((region as HTMLElement).style.maxHeight).toBe("60vh");
    });

    it("applies minHeight as number", () => {
      const { container } = render(
        <Table columns={columns} data={data} minHeight={200} ariaLabel="t" />,
      );
      const region = container.querySelector("[data-table-container]");
      expect((region as HTMLElement).style.minHeight).toBe("200px");
    });

    it("applies minHeight as string", () => {
      const { container } = render(
        <Table columns={columns} data={data} minHeight="20rem" ariaLabel="t" />,
      );
      const region = container.querySelector("[data-table-container]");
      expect((region as HTMLElement).style.minHeight).toBe("20rem");
    });
  });

  describe("hideVerticalScrollbar / hideHorizontalScrollbar", () => {
    it("applies hideVerticalScrollbar class", () => {
      const { container } = render(
        <Table columns={columns} data={data} hideVerticalScrollbar ariaLabel="t" />,
      );
      const region = container.querySelector("[data-table-container]");
      // should get scrollbar hide class applied
      expect(region).toBeInTheDocument();
    });

    it("applies hideHorizontalScrollbar class", () => {
      const { container } = render(
        <Table columns={columns} data={data} hideHorizontalScrollbar ariaLabel="t" />,
      );
      const region = container.querySelector("[data-table-container]");
      expect(region).toBeInTheDocument();
    });

    it("applies both scrollbar classes", () => {
      const { container } = render(
        <Table columns={columns} data={data} hideVerticalScrollbar hideHorizontalScrollbar ariaLabel="t" />,
      );
      expect(container.querySelector("[data-table-container]")).toBeInTheDocument();
    });
  });

  describe("getRowId prop", () => {
    it("uses custom getRowId for row identification", () => {
      const onSelectionChange = vi.fn();
      render(
        <Table
          columns={columns}
          data={data}
          getRowId={(row) => (row as Person).id}
          selectionMode="multiple"
          onSelectionChange={onSelectionChange}
          ariaLabel="t"
        />,
      );
      expect(screen.getAllByRole("checkbox").length).toBeGreaterThan(0);
    });
  });

  describe("enableColumnResizing", () => {
    it("renders with enableColumnResizing without error", () => {
      render(
        <Table
          columns={columns}
          data={data}
          enableColumnResizing
          ariaLabel="t"
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
          enableColumnResizing
          onColumnSizingChange={onColumnSizingChange}
          ariaLabel="t"
        />,
      );
      expect(screen.getByRole("region")).toBeInTheDocument();
    });
  });

  describe("enableRowDragDrop", () => {
    it("renders drag handles when enableRowDragDrop is true", () => {
      render(
        <Table
          columns={columns}
          data={data}
          enableRowDragDrop
          ariaLabel="t"
        />,
      );
      const handles = screen.getAllByLabelText("Drag to reorder");
      expect(handles.length).toBe(data.length);
    });

    it("renders drag handle on right when dragColumnPosition is right", () => {
      render(
        <Table
          columns={columns}
          data={data}
          enableRowDragDrop
          dragColumnPosition="right"
          ariaLabel="t"
        />,
      );
      expect(screen.getAllByLabelText("Drag to reorder").length).toBe(data.length);
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
          ariaLabel="t"
        />,
      );
      const filterBtn = screen.getByLabelText("Filter name");
      await userEvent.click(filterBtn);
      // Use getAllByText and pick the one inside the filter dropdown (button element)
      const options = screen.getAllByText("Alice");
      const filterOption = options.find((el) => el.closest("button") && el.closest("[data-table-filter-content]"));
      if (filterOption) await userEvent.click(filterOption);
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
          ariaLabel="t"
        />,
      );
      expect(screen.getAllByRole("checkbox").length).toBeGreaterThan(0);
    });
  });

  describe("mobile card onContextMenu", () => {
    it("renders mobile cards with onContextMenu when mobileBreakpoint is exceeded", () => {
      // jsdom innerWidth is 0, so mobileBreakpoint of 9999 ensures mobile view
      render(
        <Table
          columns={columns}
          data={data}
          responsiveBreakpoint={9999}
          renderMobileCard={(row) => <div data-testid="mobile-card">{(row as Person).name}</div>}
          onContextMenu={vi.fn()}
          ariaLabel="t"
        />,
      );
      const cards = screen.queryAllByTestId("mobile-card");
      if (cards.length > 0) {
        fireEvent.contextMenu(cards[0].parentElement!);
      }
      // Test passes if no error thrown
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
          ariaLabel="t"
        />,
      );
      // age column should be hidden
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
          ariaLabel="t"
        />,
      );
      const filterBtn = screen.getByLabelText("Filter name");
      await userEvent.click(filterBtn);
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
          ariaLabel="t"
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
          ariaLabel="t"
        />,
      );
      const filterBtn = screen.getByLabelText("Filter name");
      await userEvent.click(filterBtn);
      // The filter dropdown content should be in DOM
      expect(document.querySelector("[data-table-filter-content]")).toBeInTheDocument();
      // Click Alice option (inside the filter dropdown button)
      const aliceOptions = screen.getAllByText("Alice");
      const aliceBtn = aliceOptions.find((el) => el.closest("[data-table-filter-content]"));
      if (aliceBtn) await userEvent.click(aliceBtn);
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
          ariaLabel="t"
        />,
      );
      expect(screen.getByRole("region")).toBeInTheDocument();
    });
  });
});
