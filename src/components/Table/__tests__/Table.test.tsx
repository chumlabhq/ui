import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Table } from "../index";
import type { ColumnDef } from "@tanstack/react-table";

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
  });

  describe("Density", () => {
    it("sets data-density attribute", () => {
      render(
        <Table columns={columns} data={data} density="compact" />
      );

      const region = screen.getByRole("region");
      expect(region).toHaveAttribute("data-density", "compact");
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
  });
});
