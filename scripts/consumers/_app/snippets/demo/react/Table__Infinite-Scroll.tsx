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

function getTableClasses() {
  return {
    container: "w-full border rounded-cl-md overflow-hidden border-cl-border",
    table: "w-full border-collapse",
    headerRow: "",
    headerCell: "px-4 py-3 h-[52px] text-start text-sm font-medium whitespace-nowrap border-b text-cl-text-chrome-quiet bg-cl-bg-elevated border-cl-border",
    body: "",
    row: "border-b transition-colors data-[clickable]:cursor-pointer border-cl-border hover:bg-cl-bg-hover",
    selectedRow: "border-b transition-colors data-[clickable]:cursor-pointer border-cl-border bg-cl-accent-bg hover:bg-cl-accent-bg-hover",
    cell: "px-4 py-3 h-[52px] text-sm whitespace-nowrap text-cl-text",
    empty: "flex items-center justify-center py-12 text-cl-text-secondary",
    pinnedContainer: "shrink-0 sticky start-0 z-30 bg-cl-bg-elevated [box-shadow:2px_0_0_0_var(--cl-border-input-focus)] transition-shadow duration-200",
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
    pinTrigger: "ms-2 p-1 rounded transition-colors hover:bg-cl-bg-hover",
    pinnedPinButton: "ms-2 p-1 rounded transition-colors hover:bg-cl-accent/10",
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

export default function TableExample() {
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
          <StatusBadge status={row.getValue("status")} />
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
    [],
  );
  const infiniteScrollTableRef = useRef<HTMLDivElement>(null);
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
  const [infiniteData, setInfiniteData] = useState<User[]>(() =>
    allInfiniteData.slice(0, 10),
  );
  const [infiniteHasMore, setInfiniteHasMore] = useState(true);
  const [infiniteLoading, setInfiniteLoading] = useState(false);
  const handleLoadMore = useCallback(() => {
    if (infiniteLoading || !infiniteHasMore) return;
    setInfiniteLoading(true);
    setTimeout(() => {
      setInfiniteData((prev) => {
        const nextIndex = prev.length;
        const more = allInfiniteData.slice(nextIndex, nextIndex + 10);
        const updated = [...prev, ...more];
        if (updated.length >= allInfiniteData.length) {
          setInfiniteHasMore(false);
        }
        return updated;
      });
      setInfiniteLoading(false);
    }, 1000);
  }, [infiniteLoading, infiniteHasMore, allInfiniteData]);
  return (
    <>
      <Table
        ref={infiniteScrollTableRef}
        columns={columns}
        data={infiniteData}
        infiniteScroll
        hasMore={infiniteHasMore}
        loadingMore={infiniteLoading}
        onLoadMore={handleLoadMore}
        maxHeight={300}
        getRowId={(row) => row.id}
        loadingMoreContent={
          <span className="flex items-center gap-2 text-sm text-cl-text-secondary">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Loading more rows...
          </span>
        }
        infiniteEndContent={
          <span className="text-xs text-cl-text-tertiary">
            All
            {allInfiniteData.length}
            rows loaded
          </span>
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
          {infiniteData.length}
          of
          {allInfiniteData.length}
          rows.
          {" "}
          {
            !infiniteHasMore && (
              <span className="text-cl-success">All data loaded.</span>
            )
          }
          {infiniteHasMore && "Scroll down to load more."}
        </span>
        <button
          onClick={
            () => {
              setInfiniteData(allInfiniteData.slice(0, 10));
              setInfiniteHasMore(true);
              setInfiniteLoading(false);
              if (infiniteScrollTableRef.current) {
                infiniteScrollTableRef.current.scrollTop = 0;
              }
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
