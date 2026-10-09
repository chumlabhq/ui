"use client";

import { useMemo, useState } from "react";
import { Pagination } from "@chumlab/ui/pagination";
import { Table } from "@chumlab/ui/table";
import { ColumnDef } from "@tanstack/react-table";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive" | "pending";
  department: string;
  joinDate: string;
}

function getPaginationClasses(_dark: boolean) {
  return {
    root: "flex items-center justify-between mt-4 px-2",
    selector: "flex items-center gap-2",
    selectorButton: "flex items-center gap-1 px-2 py-1 border rounded border-cl-border-input bg-cl-bg hover:bg-cl-bg-hover",
    selectorDropdown: "absolute bottom-full mb-1 left-0 z-50 border rounded shadow-lg min-w-[60px] bg-cl-bg border-cl-border",
    selectorOption: "w-full px-2 py-1 text-left text-sm hover:bg-cl-bg-hover data-[selected]:bg-cl-accent/10 data-[selected]:font-medium",
    pageButton: "px-2 py-1 text-sm text-cl-text-tertiary hover:text-cl-text data-[active]:text-cl-accent-hover",
    activePageButton: "px-2 py-1 text-sm font-medium rounded text-cl-accent-hover bg-cl-accent-bg border border-cl-border-input-focus",
    navButton: "p-1 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed text-cl-text-tertiary hover:text-cl-text",
    ellipsis: "px-2 text-cl-text-tertiary",
    label: "text-sm text-cl-text-secondary",
  };
}

function getTableClasses(_dark: boolean) {
  return {
    container: "w-full border rounded-cl-md overflow-hidden border-cl-border",
    table: "w-full border-collapse",
    headerRow: "",
    headerCell: "px-4 py-3 h-[52px] text-left text-sm font-medium whitespace-nowrap border-b text-cl-text-chrome-quiet bg-cl-bg-elevated border-cl-border",
    body: "",
    row: "border-b transition-colors data-[clickable]:cursor-pointer border-cl-border hover:bg-cl-bg-hover",
    selectedRow: "border-b transition-colors data-[clickable]:cursor-pointer border-cl-border bg-cl-accent-bg hover:bg-cl-accent-bg-hover",
    cell: "px-4 py-3 h-[52px] text-sm whitespace-nowrap text-cl-text",
    empty: "flex items-center justify-center py-12 text-cl-text-secondary",
    pinnedContainer: "shrink-0 sticky left-0 z-30 bg-cl-bg-elevated [box-shadow:2px_0_0_0_var(--cl-border-input-focus)] transition-shadow duration-200",
    pinnedTable: "border-collapse",
    unpinnedContainer: "min-w-0 flex-1 overflow-x-auto",
    unpinnedTable: "w-full border-collapse",
    // Layer the hover tint via inset box-shadow so the opaque
    // `bg-cl-bg-elevated` underneath stays in place. A bare
    // `bg-cl-bg-hover` would REPLACE the base bg on hover, dropping it
    // to 4% opacity and letting rows behind the sticky header show
    // through. Inset box-shadow paints on top of the bg without
    // touching it.
    headerCellHover:
      "[box-shadow:inset_0_0_0_9999px_var(--cl-bg-hover)]",
    pinButton: "ml-2 p-1 rounded transition-colors hover:bg-cl-bg-hover",
    pinnedPinButton: "ml-2 p-1 rounded transition-colors hover:bg-cl-accent/10",
    pinIcon: "text-cl-text-tertiary",
    pinnedPinIcon: "text-cl-accent",
    shimmer: "w-full border rounded-cl-md overflow-hidden border-cl-border",
    shimmerRow: "border-b border-cl-border",
    shimmerCell: "px-4 py-2 h-14",
    shimmerBar: "h-full w-full bg-linear-to-r rounded animate-pulse from-cl-bg-hover via-cl-bg-skeleton to-cl-bg-hover",
  };
}

const sampleData: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    status: "active",
    department: "Engineering",
    joinDate: "2023-01-15",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "Manager",
    status: "active",
    department: "Marketing",
    joinDate: "2023-02-20",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "Developer",
    status: "inactive",
    department: "Engineering",
    joinDate: "2023-03-10",
  },
  {
    id: "4",
    name: "Alice Brown",
    email: "alice@example.com",
    role: "Designer",
    status: "active",
    department: "Design",
    joinDate: "2023-04-05",
  },
  {
    id: "5",
    name: "Charlie Wilson",
    email: "charlie@example.com",
    role: "Developer",
    status: "pending",
    department: "Engineering",
    joinDate: "2023-05-12",
  },
  {
    id: "6",
    name: "Diana Ross",
    email: "diana@example.com",
    role: "HR Manager",
    status: "active",
    department: "Human Resources",
    joinDate: "2023-06-18",
  },
  {
    id: "7",
    name: "Edward Lee",
    email: "edward@example.com",
    role: "Analyst",
    status: "active",
    department: "Finance",
    joinDate: "2023-07-22",
  },
  {
    id: "8",
    name: "Fiona Green",
    email: "fiona@example.com",
    role: "Developer",
    status: "inactive",
    department: "Engineering",
    joinDate: "2023-08-30",
  },
];

const StatusBadge = ({
  status,
  dark = false,
}: {
  status: User["status"];
  dark?: boolean;
}) => {
  const styles = {
        active: "bg-cl-success/15 text-cl-text",
        inactive: "bg-cl-bg-hover text-cl-text",
        pending: "bg-cl-warning/15 text-cl-text",
      };

  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const pClasses = getPaginationClasses(false);

const s = getTableClasses(false);

export default function TableExample() {
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const columns: ColumnDef<User>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: () => <span>Name</span>,
        cell: ({ row }) => (
          <span className="font-medium">{row.getValue("name")}</span>
        ),
      },
      {
        accessorKey: "email",
        header: () => <span>Email</span>,
        cell: ({ row }) => row.getValue("email"),
      },
      {
        accessorKey: "role",
        header: () => <span>Role</span>,
        cell: ({ row }) => row.getValue("role"),
      },
      {
        accessorKey: "status",
        header: () => <span>Status</span>,
        cell: ({ row }) => (
          <StatusBadge status={row.getValue("status")} dark={false} />
        ),
      },
      {
        accessorKey: "department",
        header: () => <span>Department</span>,
        cell: ({ row }) => row.getValue("department"),
      },
      {
        accessorKey: "joinDate",
        header: () => <span>Join Date</span>,
        cell: ({ row }) => {
          const date = new Date(row.getValue("joinDate"));
          return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });
        },
      },
    ],
    [false],
  );
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return sampleData.slice(start, start + rowsPerPage);
  }, [currentPage, rowsPerPage]);
  const totalPages = Math.ceil(sampleData.length / rowsPerPage);
  const handleRowClick = (row: User) => {
    setSelectedRowId(row.id === selectedRowId ? null : row.id);
  };
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedRowId(null);
  };
  const handleRowsPerPageChange = (rows: number) => {
    setRowsPerPage(rows);
    setCurrentPage(1);
    setSelectedRowId(null);
  };
  return (
    <div>
      <Table
        columns={columns}
        data={paginatedData}
        getRowId={(row) => row.id}
        selectedRowId={selectedRowId}
        onRowClick={handleRowClick}
        classes={s}
      />
      <Pagination
        value={currentPage}
        totalPages={totalPages}
        rowsPerPage={rowsPerPage}
        onValueChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        classes={
          {
            root: pClasses.root,
            rowsPerPage: {
              root: pClasses.selector,
              trigger: pClasses.selectorButton,
              content: pClasses.selectorDropdown,
              item: pClasses.selectorOption
            },
            item: pClasses.pageButton,
            navButton: pClasses.navButton,
            ellipsis: pClasses.ellipsis,
            label: pClasses.label
          }
        }
      />
    </div>
  );
}
