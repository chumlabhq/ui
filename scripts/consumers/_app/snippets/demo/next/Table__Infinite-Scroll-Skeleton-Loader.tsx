"use client";

import { useCallback, useMemo, useRef, useState } from "react";
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

const s = getTableClasses(false);

export default function TableExample() {
  const [inf2Data, setInf2Data] = useState<User[]>(() =>
    allInfiniteData.slice(0, 10),
  );
  const [inf2HasMore, setInf2HasMore] = useState(true);
  const [inf2Loading, setInf2Loading] = useState(false);
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
  const allInfiniteData = useMemo(() => {
    const data: User[] = [];
    for (let i = 0; i < 50; i++) {
      const base = sampleData[i % sampleData.length];
      data.push({
        ...base,
        id: `inf-${i}`,
        name: `${base.name} ${Math.floor(i / sampleData.length) + 1}`,
      });
    }
    return data;
  }, []);
  const inf2Ref = useRef<HTMLDivElement>(null);
  const handleLoadMore2 = useCallback(() => {
    if (inf2Loading || !inf2HasMore) return;
    setInf2Loading(true);
    setTimeout(() => {
      setInf2Data((prev) => {
        const more = allInfiniteData.slice(prev.length, prev.length + 10);
        const updated = [...prev, ...more];
        if (updated.length >= allInfiniteData.length) setInf2HasMore(false);
        return updated;
      });
      setInf2Loading(false);
    }, 1500);
  }, [inf2Loading, inf2HasMore, allInfiniteData]);
  return (
    <>
      <Table
        ref={inf2Ref}
        columns={columns}
        data={inf2Data}
        enableInfiniteScroll
        hasMore={inf2HasMore}
        loadingMore={inf2Loading}
        onLoadMore={handleLoadMore2}
        maxHeight={300}
        getRowId={(row) => row.id}
        loadingMoreContent={
          <div className="w-full space-y-2 px-4 py-3">
            {
              [1, 2, 3].map((i) => (
                <div key={i} className={`flex items-center gap-4 ${i > 1 ? "opacity-60" : ""}`}>
                  <div
                    className="h-3 rounded-full animate-pulse bg-cl-bg-hover"
                    style={{ width: "25%" }}
                  />
                  <div
                    className="h-3 rounded-full animate-pulse bg-cl-bg-hover"
                    style={{ width: "35%" }}
                  />
                  <div
                    className="h-3 rounded-full animate-pulse bg-cl-bg-hover"
                    style={{ width: "15%" }}
                  />
                  <div
                    className="h-3 rounded-full animate-pulse bg-cl-bg-hover"
                    style={{ width: "20%" }}
                  />
                </div>
              ))
            }
          </div>
        }
        infiniteEndContent={
          <div className="flex items-center gap-2 text-cl-success">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 12l2 2 4-4" />
              <circle cx="12" cy="12" r="10" />
            </svg>
            <span className="text-sm">
              All
              {allInfiniteData.length}
              rows loaded
            </span>
          </div>
        }
        classes={
          {
            ...s,
            ...s,
            root: "w-full border rounded-cl-md border-cl-border"
          }
        }
      />
      <div className="mt-3 flex items-center justify-between text-cl-text-secondary">
        <span className="text-sm">
          Loaded
          {inf2Data.length}
          of
          {allInfiniteData.length}
        </span>
        <button
          onClick={
            () => {
              setInf2Data(allInfiniteData.slice(0, 10));
              setInf2HasMore(true);
              setInf2Loading(false);
              if (inf2Ref.current) inf2Ref.current.scrollTop = 0;
            }
          }
          className="text-xs px-3 py-1 rounded cursor-pointer text-cl-accent hover:bg-cl-bg-elevated"
        >
          Reset
        </button>
      </div>
    </>
  );
}
