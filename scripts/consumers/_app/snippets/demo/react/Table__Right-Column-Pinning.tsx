import { useMemo } from "react";
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

function getTableClasses(_dark: boolean) {
  return {
    container: "w-full border rounded-cl-md overflow-hidden border-cl-border",
    table: "w-full border-collapse",
    headerRow: "",
    headerCell: "px-4 py-3 h-[52px] text-left text-sm font-medium whitespace-nowrap border-b text-cl-text-secondary bg-cl-bg-elevated border-cl-border dark:text-cl-text-tertiary dark:bg-cl-bg-elevated dark:border-cl-text/[0.06]",
    body: "",
    row: "border-b transition-colors data-[clickable]:cursor-pointer border-cl-border hover:bg-cl-bg-hover dark:border-cl-text/[0.04] dark:hover:bg-cl-bg-hover",
    selectedRow: "border-b transition-colors data-[clickable]:cursor-pointer border-cl-border bg-cl-accent/10 hover:bg-cl-accent/10 dark:border-cl-text/[0.04] dark:bg-cl-accent/10 dark:hover:bg-cl-accent/15",
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
    pinButton: "ml-2 p-1 rounded transition-colors hover:bg-cl-bg-hover dark:hover:bg-cl-bg-elevated",
    pinnedPinButton: "ml-2 p-1 rounded transition-colors hover:bg-cl-accent/10",
    pinIcon: "text-cl-text-tertiary",
    pinnedPinIcon: "text-cl-accent",
    shimmer: "w-full border rounded-cl-md overflow-hidden border-cl-border",
    shimmerRow: "border-b border-cl-border dark:border-cl-text/[0.04]",
    shimmerCell: "px-4 py-2 h-14",
    shimmerBar: "h-full w-full bg-linear-to-r rounded animate-pulse from-fg/[0.04] via-gray-300 to-fg/[0.04] dark:from-bg-elevated dark:via-gray-600 dark:to-bg-elevated",
  };
}

const s = getTableClasses(false);

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

export default function TableExample() {
  const rightPinColumns: ColumnDef<User>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <span className="font-medium">{row.getValue("name")}</span>
        ),
      },
      { accessorKey: "email", header: "Email" },
      { accessorKey: "role", header: "Role" },
      { accessorKey: "department", header: "Department" },
      {
        id: "actions",
        accessorKey: "actions",
        header: "Actions",
        cell: () => (
          <button
            className={"px-2 py-1 text-xs rounded bg-cl-accent/10 text-cl-accent hover:bg-cl-accent/10 dark:bg-cl-accent/20 dark:text-cl-accent dark:hover:bg-cl-accent/30 cursor-pointer"}
            onClick={() => alert("Action clicked")}
          >
            Edit
          </button>
        ),
      },
    ],
    [],
  );
  return (
    <>
      <Table
        columns={rightPinColumns}
        data={sampleData.slice(0, 5)}
        pinnedRightColumns={["actions"]}
        getRowId={(row) => row.id}
        maxWidth={600}
        classes={
          {
            ...s,
            ...s,
            root: "border rounded-cl-md border-cl-border",
            list: "w-max border-collapse",
            pinnedRightRegion: "shrink-0 sticky right-0 z-20 border-l-2 border-cl-border-input-focus bg-cl-bg-elevated"
          }
        }
      />
      <p className="mt-3 text-sm text-cl-text-secondary">
        The "Actions" column is pinned to the right using
        {" "}
        <code className="px-1 rounded bg-cl-bg-elevated">
          pinnedRightColumns=
          {'{["actions"]}'}
        </code>
        . Scroll horizontally to see it stay fixed.
      </p>
    </>
  );
}
