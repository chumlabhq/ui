"use client";

import React, { useMemo } from "react";
import { Button } from "@chumlab/ui/button";
import { SortingState, Table } from "@chumlab/ui/table";
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

function getTableClasses() {
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

const StatusBadge = ({
  status,
}: {
  status: User["status"];
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

const s = getTableClasses();

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
  const sortableColumns: ColumnDef<User>[] = useMemo(
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
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <StatusBadge status={row.getValue("status")} />
        ),
      },
      { accessorKey: "department", header: "Department" },
      { accessorKey: "joinDate", header: "Join Date" },
    ],
    [],
  );
  return (
    <>
      {
        (() => {
          const SaveViewDemo = () => {
            const [savedViews, setSavedViews] = React.useState<
              { name: string; view: Record<string, unknown> }[]
            >([]);
            const [sortState, setSortState] = React.useState<SortingState>([]);
            const [visState, setVisState] = React.useState<
              Record<string, boolean>
            >({
              name: true,
              email: true,
              role: true,
              status: true,
              department: true,
              joinDate: true
            });
            return (
              <div className="space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <Button
                    onClick={() =>
                      setSavedViews((prev) => [
                        ...prev,
                        {
                          name: `View ${prev.length + 1}`,
                          view: {
                            sorting: sortState,
                            columnVisibility: visState
                          }
                        }
                      ])
                    }
                    className={"px-3 py-1.5 text-xs rounded-cl-md cursor-pointer transition-colors bg-cl-accent-bg text-cl-accent-hover hover:bg-cl-accent-bg-hover"}
                  >
                    Save current view
                  </Button>
                  {savedViews.map((sv, i) => (
                    <Button
                      key={i}
                      onClick={() => {
                        setSortState((sv.view.sorting as SortingState) || []);
                        setVisState(
                          (sv.view.columnVisibility as Record<
                            string,
                            boolean
                          >) || {
                            name: true,
                            email: true,
                            role: true,
                            status: true,
                            department: true,
                            joinDate: true
                          },
                        );
                      }}
                      className={"px-2.5 py-1 text-xs rounded-cl-md cursor-pointer bg-cl-bg-hover text-cl-text-secondary hover:bg-cl-bg-hover"}
                    >
                      {sv.name}
                    </Button>
                  ))}
                </div>
                <Table
                  columns={sortableColumns}
                  data={sampleData.slice(0, 5)}
                  getRowId={(row) => row.id}
                  sortable
                  sorting={sortState}
                  onSortingChange={setSortState}
                  columnVisibility={visState}
                  onColumnVisibilityChange={setVisState}
                  classes={s}
                />
                <p
                  className={"text-xs text-cl-text-tertiary"}
                >
                  {savedViews.length === 0
                    ? 'Sort or hide columns, then click "Save current view".'
                    : `${savedViews.length} view(s) saved. Click to restore.`}
                </p>
              </div>
            );
          };
          return <SaveViewDemo />;
        })()
      }
    </>
  );
}
