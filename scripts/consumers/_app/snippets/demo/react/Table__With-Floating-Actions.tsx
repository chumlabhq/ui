import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Button } from "@chumlab/ui/button";
import { Table } from "@chumlab/ui/table";
import { ColumnDef } from "@tanstack/react-table";

interface FloatingActionsProps<T> {
  rowRef: React.RefObject<HTMLTableRowElement> | null;
  rowData: T | undefined;
  onHover: (isHovered: boolean) => void;
  isVisible: boolean;
  getName: (data: T) => string;
  className?: string;
  renderContent?: (name: string, data: T) => React.ReactNode;
  onAction?: (action: "View" | "Edit" | "Delete", data: T) => void;
}

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

function FloatingActions<T>({
  rowRef,
  rowData,
  onHover,
  isVisible,
  getName,
  className: classNameProp,
  renderContent,
  onAction,
}: FloatingActionsProps<T>) {
  // Architecture: we deliberately keep `top` OUT of React state — every
  // hover transition between rows would otherwise require a parent
  // setState → child re-render → useEffect → child setState → child
  // re-render cycle (≥2 frames of latency, plus visible jitter). Instead
  // we write `top` directly to the DOM via a ref in a useLayoutEffect,
  // synchronously after each render, before the browser paints. The only
  // thing in React state is the latched data + show flag (so the FAB can
  // hold its content during the 150ms hide-out window).
  const fabRef = useRef<HTMLDivElement | null>(null);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Latch the row data the moment we have a visible row — keeps the FAB
  // rendering during the fade-out delay even after the parent clears its
  // hover state. setState-during-render (with a reference-equality guard)
  // is the React-recommended pattern for syncing derived state from props
  // and avoids both react-hooks/set-state-in-effect and react-hooks/refs.
  const [latchedData, setLatchedData] = useState<T | undefined>(undefined);
  if (isVisible && rowData !== undefined && rowData !== latchedData) {
    setLatchedData(rowData);
  }

  // Direct DOM position write via `transform` (GPU compositor), not via
  // `top` (CPU layout). Animating `top` would trigger a layout reflow on
  // every frame and stutter under load; animating `transform` runs on
  // its own compositor layer so the FAB glides at the display refresh
  // rate even when other parts of the page are rendering.
  // Runs synchronously on every commit (useLayoutEffect, not useEffect)
  // so the FAB tracks `rowRef` 1:1 with the parent's render.
  useLayoutEffect(() => {
    const fab = fabRef.current;
    const row = rowRef?.current;
    if (!fab || !row || !isVisible) return;
    const rowRect = row.getBoundingClientRect();
    // The FAB is rendered inside the inner flex/grid wrapper (the
    // [data-testid="table-container"] element), which becomes the actual
    // scroll container when stickyHeader+maxHeight is on. We position the
    // FAB against that wrapper so its containing-block math is correct,
    // and we add scrollTop because the overlay holding the FAB is INSIDE
    // the scrolling content — without it the FAB drifts off the hovered
    // row by exactly the scroll distance.
    const scrollContainer = (row.closest('[data-testid="table-container"]') ??
      row.closest("[data-table-container]")) as HTMLElement | null;
    if (!scrollContainer) return;
    const scrollContainerRect = scrollContainer.getBoundingClientRect();
    const top =
      rowRect.top -
      scrollContainerRect.top +
      scrollContainer.scrollTop +
      rowRect.height / 2;
    // translate3d forces a GPU layer; the calc() bakes in the -50%
    // self-centering offset that used to be a static transform.
    fab.style.transform = `translate3d(-50%, calc(${top}px - 50%), 0)`;
  });

  // Show immediately while isVisible is true; hide with 150ms grace so
  // the user can reach the toolbar from a row hover or move between rows
  // without a flash gap. State transitions are detected via `prevIsVisible`
  // state (not a ref) so we satisfy both react-hooks/refs and
  // react-hooks/set-state-in-effect: the guard fires only on transitions,
  // and the timer-driven clear runs inside setTimeout (not the effect body).
  const [graceActive, setGraceActive] = useState(false);
  const [prevIsVisible, setPrevIsVisible] = useState(isVisible);
  if (prevIsVisible !== isVisible) {
    setPrevIsVisible(isVisible);
    if (isVisible) {
      setGraceActive(false);
    } else {
      setGraceActive(true);
    }
  }

  useEffect(() => {
    if (isVisible) {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
      return;
    }
    hideTimeoutRef.current = setTimeout(() => {
      setGraceActive(false);
      hideTimeoutRef.current = null;
    }, 150);
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
    };
  }, [isVisible]);

  const show = isVisible || graceActive;
  if (!show || latchedData === undefined) return null;

  const name = getName(latchedData);

  // Theme-aware surface: white card in light mode, elevated dark in dark
  // mode. Icons use brand-tokenized colors so they're readable on both.
  // z-10 keeps the FAB above tbody (z-auto) but BELOW the sticky thead
  // (z-20) and the pinned column (z-30). When a hovered row scrolls
  // partially under the sticky header, the FAB now slips behind the
  // header instead of painting over it.
  const defaultClassName = "z-10 flex items-center gap-0.5 border rounded-cl-md shadow-md px-1 py-0.5 bg-cl-bg-panel border-cl-text/10";
  const buttonClassName = "p-1.5 rounded-cl-sm transition-colors cursor-pointer text-cl-text-tertiary hover:text-cl-text hover:bg-cl-bg-hover";

  return (
    <div
      ref={fabRef}
      className={classNameProp ?? defaultClassName}
      style={{
        // `transform` is set imperatively in useLayoutEffect (above) so
        // position updates skip React's render cycle entirely.
        // `translate3d` + `will-change: transform` keep the FAB on its
        // own GPU compositor layer for buttery 60 fps motion.
        position: "absolute",
        top: 0,
        left: "clamp(1rem, 30%, calc(100% - 6rem))",
        transition: "transform 220ms cubic-bezier(0.32, 0.72, 0, 1)",
        willChange: "transform",
      }}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      {renderContent ? (
        renderContent(name, latchedData)
      ) : (
        <>
          <Button aria-label="View"
            className={buttonClassName}
            title="View"
            onClick={() => onAction?.("View", latchedData)}
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </Button>
          <Button aria-label="Edit"
            className={buttonClassName}
            title="Edit"
            onClick={() => onAction?.("Edit", latchedData)}
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />
            </svg>
          </Button>
          <Button aria-label="Delete"
            className={`${buttonClassName} hover:!text-cl-error hover:!bg-cl-error/15 cursor-pointer`}
            title="Delete"
            onClick={() => onAction?.("Delete", latchedData)}
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M3 6h18" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
              <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <path d="M10 11v6" />
              <path d="M14 11v6" />
            </svg>
          </Button>
        </>
      )}
    </div>
  );
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

export default function TableExample() {
  const [hoveredRowIndex, setHoveredRowIndex] = useState<number | null>(null);
  const [hoveredRowRef, setHoveredRowRef] =
    useState<React.RefObject<HTMLTableRowElement> | null>(null);
  const [isFloatingActionsHovered, setIsFloatingActionsHovered] =
    useState(false);
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
  const handleRowHover = (
    rowIndex: number | null,
    rowRef?: React.RefObject<HTMLTableRowElement>,
  ) => {
    setHoveredRowIndex(rowIndex);
    setHoveredRowRef(rowRef ?? null);
  };
  const handleFloatingActionsHover = (isHovered: boolean) => {
    setIsFloatingActionsHovered(isHovered);
  };
  const floatingActionsData =
    hoveredRowIndex !== null ? sampleData[hoveredRowIndex] : undefined;
  const [floatingAction, setFloatingAction] = useState("not fired yet");
  return (
    <>
      <Table
        columns={columns}
        data={sampleData.slice(0, 5)}
        onRowHover={handleRowHover}
        isFloatingActionsHovered={isFloatingActionsHovered}
        floatingActions={
          <FloatingActions
            rowRef={hoveredRowRef}
            rowData={floatingActionsData}
            onHover={handleFloatingActionsHover}
            isVisible={hoveredRowIndex !== null || isFloatingActionsHovered}
            getName={(data) => data.name}
            onAction={
              (action, data) =>
              setFloatingAction(JSON.stringify({ action, name: data.name }))
            }
          />
        }
        classes={s}
      />
      <div
        className="mt-3 rounded-cl-md px-3 py-2 text-xs font-mono bg-cl-bg-elevated text-cl-text-tertiary"
        data-demo-action
      >
        action:
        {floatingAction}
      </div>
    </>
  );
}
