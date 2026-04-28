import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
} from "react";
import { createPortal } from "react-dom";
import { Table, exportTableToCSV } from "../../components/Table";
import { Pagination } from "../../components/Pagination";
import type { ColumnDef } from "@tanstack/react-table";
import type { SortingState } from "../../components/Table";
import { useTheme } from "./ThemeContext";
import {
  DocsHero,
  Section,
  DemoWrapper,
  PropsTable,
  PropRow,
  DocControlledPattern,
  DocEdgeCases,
  DocDoDont,
} from "./components";

// ─── Themed Classes ──────────────────────────────────────────────────────────

const getClasses = (_dark: boolean) => ({
 card: `rounded-cl-lg p-5 bg-cl-bg-elevated`,
 kbd: `px-2 py-1 rounded-cl-md text-[11px] font-mono min-w-[2.5rem] text-center font-medium bg-cl-bg-elevated border-cl-border text-cl-text-secondary`,
  label: `text-xs font-medium text-cl-text-tertiary`,
});

// Basic User interface
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive" | "pending";
  department: string;
  joinDate: string;
}

// Extended User interface for comprehensive demo
interface ExtendedUser extends User {
  phone: string;
  location: string;
  salary: number;
  manager: string;
  team: string;
  projects: number;
  performance: "excellent" | "good" | "average" | "poor";
  lastLogin: string;
}

// Floating Actions Component - positioned at middle-left of hovered row
interface FloatingActionsProps<T> {
  rowRef: React.RefObject<HTMLTableRowElement> | null;
  rowData: T | undefined;
  onHover: (isHovered: boolean) => void;
  isVisible: boolean;
  getName: (data: T) => string;
  dark?: boolean;
  className?: string;
  renderContent?: (name: string, data: T) => React.ReactNode;
}

function FloatingActions<T>({
  rowRef,
  rowData,
  onHover,
  isVisible,
  getName,
  dark: _dark = false,
  className: classNameProp,
  renderContent,
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
  const defaultClassName = "z-10 flex items-center gap-0.5 border rounded-cl-md shadow-md px-1 py-0.5 bg-white border-cl-border dark:bg-cl-bg-elevated dark:border-cl-text/10";
  const buttonClassName = "p-1.5 rounded-cl-sm transition-colors cursor-pointer text-cl-text-tertiary hover:text-cl-text hover:bg-black/[0.06] dark:hover:bg-white/10";

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
          <button
            className={buttonClassName}
            title="View"
            onClick={() => alert(`View: ${name}`)}
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
          </button>
          <button
            className={buttonClassName}
            title="Edit"
            onClick={() => alert(`Edit: ${name}`)}
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
          </button>
          <button
            className={`${buttonClassName} hover:!text-cl-error hover:!bg-cl-error/15`}
            title="Delete"
            onClick={() => alert(`Delete: ${name}`)}
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
          </button>
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

// Extended sample data with more columns for scroll testing
const extendedSampleData: ExtendedUser[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    status: "active",
    department: "Engineering",
    joinDate: "2023-01-15",
    phone: "+1 555-0101",
    location: "New York",
    salary: 120000,
    manager: "CEO",
    team: "Platform",
    projects: 5,
    performance: "excellent",
    lastLogin: "2024-01-15 09:30",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "Manager",
    status: "active",
    department: "Marketing",
    joinDate: "2023-02-20",
    phone: "+1 555-0102",
    location: "Los Angeles",
    salary: 95000,
    manager: "John Doe",
    team: "Growth",
    projects: 3,
    performance: "good",
    lastLogin: "2024-01-14 14:22",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "Developer",
    status: "inactive",
    department: "Engineering",
    joinDate: "2023-03-10",
    phone: "+1 555-0103",
    location: "Chicago",
    salary: 85000,
    manager: "John Doe",
    team: "Backend",
    projects: 7,
    performance: "excellent",
    lastLogin: "2024-01-10 11:45",
  },
  {
    id: "4",
    name: "Alice Brown",
    email: "alice@example.com",
    role: "Designer",
    status: "active",
    department: "Design",
    joinDate: "2023-04-05",
    phone: "+1 555-0104",
    location: "San Francisco",
    salary: 90000,
    manager: "Jane Smith",
    team: "Product",
    projects: 4,
    performance: "good",
    lastLogin: "2024-01-15 08:15",
  },
  {
    id: "5",
    name: "Charlie Wilson",
    email: "charlie@example.com",
    role: "Developer",
    status: "pending",
    department: "Engineering",
    joinDate: "2023-05-12",
    phone: "+1 555-0105",
    location: "Seattle",
    salary: 82000,
    manager: "John Doe",
    team: "Frontend",
    projects: 6,
    performance: "average",
    lastLogin: "2024-01-13 16:30",
  },
  {
    id: "6",
    name: "Diana Ross",
    email: "diana@example.com",
    role: "HR Manager",
    status: "active",
    department: "Human Resources",
    joinDate: "2023-06-18",
    phone: "+1 555-0106",
    location: "Boston",
    salary: 88000,
    manager: "CEO",
    team: "People",
    projects: 2,
    performance: "excellent",
    lastLogin: "2024-01-15 10:00",
  },
  {
    id: "7",
    name: "Edward Lee",
    email: "edward@example.com",
    role: "Analyst",
    status: "active",
    department: "Finance",
    joinDate: "2023-07-22",
    phone: "+1 555-0107",
    location: "Miami",
    salary: 78000,
    manager: "Diana Ross",
    team: "Analytics",
    projects: 8,
    performance: "good",
    lastLogin: "2024-01-14 09:45",
  },
  {
    id: "8",
    name: "Fiona Green",
    email: "fiona@example.com",
    role: "Developer",
    status: "inactive",
    department: "Engineering",
    joinDate: "2023-08-30",
    phone: "+1 555-0108",
    location: "Denver",
    salary: 84000,
    manager: "John Doe",
    team: "Mobile",
    projects: 3,
    performance: "average",
    lastLogin: "2024-01-08 17:20",
  },
  {
    id: "9",
    name: "George Harris",
    email: "george@example.com",
    role: "DevOps",
    status: "active",
    department: "Engineering",
    joinDate: "2023-09-05",
    phone: "+1 555-0109",
    location: "Austin",
    salary: 95000,
    manager: "John Doe",
    team: "Infrastructure",
    projects: 4,
    performance: "excellent",
    lastLogin: "2024-01-15 07:30",
  },
  {
    id: "10",
    name: "Hannah White",
    email: "hannah@example.com",
    role: "Product Manager",
    status: "active",
    department: "Product",
    joinDate: "2023-10-12",
    phone: "+1 555-0110",
    location: "Portland",
    salary: 105000,
    manager: "CEO",
    team: "Product",
    projects: 6,
    performance: "excellent",
    lastLogin: "2024-01-15 11:15",
  },
  {
    id: "11",
    name: "Ian Black",
    email: "ian@example.com",
    role: "QA Engineer",
    status: "active",
    department: "Engineering",
    joinDate: "2023-11-01",
    phone: "+1 555-0111",
    location: "Phoenix",
    salary: 75000,
    manager: "John Doe",
    team: "Quality",
    projects: 5,
    performance: "good",
    lastLogin: "2024-01-14 13:00",
  },
  {
    id: "12",
    name: "Julia Martinez",
    email: "julia@example.com",
    role: "Data Scientist",
    status: "pending",
    department: "Analytics",
    joinDate: "2023-12-15",
    phone: "+1 555-0112",
    location: "Atlanta",
    salary: 110000,
    manager: "Edward Lee",
    team: "Data",
    projects: 2,
    performance: "good",
    lastLogin: "2024-01-12 15:45",
  },
];

function getTableClasses(_dark: boolean) {
  return {
    container: `w-full border rounded-cl-md overflow-hidden border-cl-border`,
    table: "w-full border-collapse",
    headerRow: "",
    headerCell: `px-4 py-3 h-[52px] text-left text-sm font-medium whitespace-nowrap border-b text-cl-text-secondary bg-cl-bg-elevated border-cl-border dark:text-cl-text-tertiary dark:bg-cl-bg-elevated dark:border-cl-text/[0.06]`,
    body: "",
    row: `border-b transition-colors data-[clickable]:cursor-pointer border-cl-border hover:bg-cl-bg-hover dark:border-cl-text/[0.04] dark:hover:bg-cl-bg-hover`,
    selectedRow: `border-b transition-colors data-[clickable]:cursor-pointer border-cl-border bg-cl-accent/10 hover:bg-cl-accent/10 dark:border-cl-text/[0.04] dark:bg-cl-accent/10 dark:hover:bg-cl-accent/15`,
    cell: `px-4 py-3 h-[52px] text-sm whitespace-nowrap text-cl-text`,
    empty: `flex items-center justify-center py-12 text-cl-text-secondary`,
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
    pinButton: `ml-2 p-1 rounded transition-colors hover:bg-cl-bg-hover dark:hover:bg-cl-bg-elevated`,
    pinnedPinButton: "ml-2 p-1 rounded transition-colors hover:bg-cl-accent/10",
    pinIcon: "text-cl-text-tertiary",
    pinnedPinIcon: "text-cl-accent",
    shimmer: `w-full border rounded-cl-md overflow-hidden border-cl-border`,
    shimmerRow: `border-b border-cl-border dark:border-cl-text/[0.04]`,
    shimmerCell: "px-4 py-2 h-14",
    shimmerBar: `h-full w-full bg-linear-to-r rounded animate-pulse from-fg/[0.04] via-gray-300 to-fg/[0.04] dark:from-bg-elevated dark:via-gray-600 dark:to-bg-elevated`,
  };
}

function getPaginationClasses(_dark: boolean) {
  return {
    root: "flex items-center justify-between mt-4 px-2",
    selector: "flex items-center gap-2",
    selectorButton: `flex items-center gap-1 px-2 py-1 border rounded border-cl-border-input bg-white hover:bg-cl-bg-hover dark:border dark:border-cl-border dark:bg-cl-bg dark:hover:bg-cl-bg-elevated`,
    selectorDropdown: `absolute bottom-full mb-1 left-0 z-50 border rounded shadow-lg min-w-[60px] bg-white border-cl-border dark:bg-cl-bg dark:border-cl-text/[0.06]`,
    selectorOption: `w-full px-2 py-1 text-left text-sm hover:bg-cl-bg-hover data-[selected]:bg-cl-accent/10 data-[selected]:font-medium dark:hover:bg-cl-bg-hover dark:data-[selected]:bg-cl-accent/10 dark:data-[selected]:font-medium`,
    pageButton: `px-2 py-1 text-sm text-cl-text-tertiary hover:text-cl-text`,
    activePageButton: `px-2 py-1 text-sm font-medium rounded text-cl-accent bg-cl-accent/10 border-cl-border-input-focus dark:text-cl-accent dark:bg-cl-accent/10 dark:border dark:border-cl-border-input-focus/30`,
    navButton: `p-1 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed text-cl-text-tertiary hover:text-cl-text`,
    ellipsis: "px-2 text-cl-text-tertiary",
    label: `text-sm text-cl-text-secondary`,
  };
}

// Dark/Modern pagination styles
const darkPaginationContainerStyle =
  "flex items-center justify-between mt-4 px-4 py-3 bg-cl-bg rounded-cl-md";
const darkPaginationRowSelectorStyle = "flex items-center gap-3";
const darkPaginationButtonStyle =
 "flex items-center gap-2 px-3 py-1.5 bg-cl-bg-elevated border-cl-border rounded-cl-md text-cl-text hover:bg-cl-bg-elevated transition-colors";
const darkPaginationDropdownStyle =
 "absolute bottom-full mb-1 left-0 z-50 bg-cl-bg-elevated border-cl-border rounded-cl-md shadow-xl min-w-[70px] overflow-hidden";
const darkPaginationOptionStyle =
  "w-full px-3 py-2 text-left text-sm text-cl-text-secondary hover:bg-cl-bg-elevated data-[selected]:bg-cl-accent data-[selected]:text-white transition-colors";
const darkPaginationPageStyle =
  "w-8 h-8 flex items-center justify-center text-sm text-cl-text-tertiary hover:text-white hover:bg-cl-bg-elevated rounded-cl-md transition-colors";
const darkPaginationActivePageStyle =
  "w-8 h-8 flex items-center justify-center text-sm font-semibold text-white bg-cl-accent rounded-cl-md";
const darkPaginationNavStyle =
  "p-2 text-cl-text-tertiary hover:text-white hover:bg-cl-bg-elevated rounded-cl-md transition-colors data-[disabled]:opacity-30 data-[disabled]:cursor-not-allowed data-[disabled]:hover:bg-transparent";
const darkPaginationEllipsisStyle = "px-1 text-cl-text-tertiary";
const darkPaginationLabelStyle = "text-sm text-cl-text-tertiary";
const darkPaginationNavContainerStyle = "flex items-center gap-1";
const darkPaginationPageContainerStyle = "flex items-center gap-1";

const StatusBadge = ({
  status,
  dark = false,
}: {
  status: User["status"];
  dark?: boolean;
}) => {
  const styles = dark
    ? {
        active: "bg-cl-success/15 text-cl-success",
        inactive: "bg-cl-text/15 text-cl-text-tertiary",
        pending: "bg-cl-warning/15 text-cl-warning",
      }
    : {
        active: "bg-cl-success/15 text-cl-success",
        inactive: "bg-cl-bg-hover text-cl-text",
        pending: "bg-cl-warning/15 text-cl-warning",
      };

  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const PerformanceBadge = ({
  performance,
  dark = false,
}: {
  performance: ExtendedUser["performance"];
  dark?: boolean;
}) => {
  const styles = dark
    ? {
        excellent: "bg-cl-success/15 text-cl-success",
        good: "bg-cl-accent/15 text-cl-accent",
        average: "bg-cl-warning/15 text-cl-warning",
        poor: "bg-cl-error/15 text-cl-error",
      }
    : {
        excellent: "bg-cl-success/15 text-cl-success",
        good: "bg-cl-accent/10 text-cl-accent",
        average: "bg-cl-warning/15 text-cl-warning",
        poor: "bg-cl-error/15 text-cl-error",
      };

  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full ${styles[performance]}`}
    >
      {performance.charAt(0).toUpperCase() + performance.slice(1)}
    </span>
  );
};

// ─── Server API Demo (extracted to prevent IIFE remounting) ────────────────
interface Product {
  id: number;
  title: string;
  brand: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  sku: string;
  weight: number;
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  thumbnail: string;
}

// Inline searchable category picker for use inside the Table's filter dropdown.
// Renders directly (no portal) so it doesn't conflict with the Table's click-outside handler.
function ServerApiDemo({
  dark,
  s,
}: {
  dark: boolean;
  s: ReturnType<typeof getTableClasses>;
}) {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [total, setTotal] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const [pageSize] = React.useState(10);
  const [sortField, setSortField] = React.useState("title");
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("asc");
  const [search, setSearch] = React.useState("");
  const [categories, setCategories] = React.useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = React.useState("");
  const [selectedStatuses, setSelectedStatuses] = React.useState<string[]>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [serverPinnedCols, setServerPinnedCols] = React.useState<string[]>([
    "thumbnail",
  ]);

  React.useEffect(() => {
    fetch("https://dummyjson.com/products/category-list")
      .then((r) => r.json())
      .then((data: string[]) => setCategories(data.slice(0, 15)))
      .catch(() => {});
  }, []);

  React.useEffect(() => {
    setLoading(true);
    const skip = (page - 1) * pageSize;
    let url: string;
    const fields =
      "id,title,brand,category,price,discountPercentage,rating,stock,sku,weight,warrantyInformation,shippingInformation,availabilityStatus,thumbnail";
    if (search) {
      url = `https://dummyjson.com/products/search?q=${encodeURIComponent(search)}&limit=${pageSize}&skip=${skip}&sortBy=${sortField}&order=${sortOrder}&select=${fields}`;
    } else if (selectedCategory) {
      url = `https://dummyjson.com/products/category/${encodeURIComponent(selectedCategory)}?limit=${pageSize}&skip=${skip}&sortBy=${sortField}&order=${sortOrder}&select=${fields}`;
    } else {
      url = `https://dummyjson.com/products?limit=${pageSize}&skip=${skip}&sortBy=${sortField}&order=${sortOrder}&select=${fields}`;
    }
    fetch(url)
      .then((r) => r.json())
      .then((data: { products: Product[]; total: number }) => {
        setProducts(data.products || []);
        setTotal(data.total || 0);
      })
      .catch(() => {
        setProducts([]);
        setTotal(0);
      })
      .finally(() => setLoading(false));
  }, [page, pageSize, sortField, sortOrder, search, selectedCategory]);

  const handleSortChange = React.useCallback((newSorting: SortingState) => {
    setSorting(newSorting);
    if (newSorting.length > 0) {
      setSortField(newSorting[0].id);
      setSortOrder(newSorting[0].desc ? "desc" : "asc");
    } else {
      setSortField("title");
      setSortOrder("asc");
    }
    setPage(1);
  }, []);

  const searchTimeout = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const handleSearch = React.useCallback((value: string) => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setSearch(value);
      setPage(1);
      if (value) setSelectedCategory("");
    }, 400);
  }, []);

  const totalPages = Math.ceil(total / pageSize);

  const categoryOptions = React.useMemo(
    () =>
      categories.map((c) => ({
        label: c.charAt(0).toUpperCase() + c.slice(1),
        value: c,
      })),
    [categories],
  );

  const statusOptions = React.useMemo(
    () => [
      { label: "In Stock", value: "In Stock" },
      { label: "Low Stock", value: "Low Stock" },
      { label: "Out of Stock", value: "Out of Stock" },
    ],
    [],
  );

  // Filterable columns: Category (server-side) + Status (client-side post-filter).
  // Uses the Table's built-in filter dropdown (single trigger = filter icon → checkbox list).
  const filterColumnsConfig = React.useMemo(() => {
    const config: Record<string, { options: { label: string; value: string }[]; multi?: boolean }> = {
      availabilityStatus: { options: statusOptions, multi: true },
    };
    if (categories.length > 0) {
      config.category = { options: categoryOptions, multi: true };
    }
    return config;
  }, [categories, categoryOptions, statusOptions]);

  // Controlled column filters state — react to changes for server/client filtering
  const [columnFilters, setColumnFilters] = React.useState<{ id: string; value: unknown }[]>([]);

  // When column filters change, extract category & status and trigger appropriate actions
  const handleColumnFiltersChange = React.useCallback((newFilters: { id: string; value: unknown }[]) => {
    setColumnFilters(newFilters);

    // Extract category filter (server-side)
    const catFilter = newFilters.find((f) => f.id === "category");
    const catValues = Array.isArray(catFilter?.value) ? (catFilter.value as string[]) : [];
    // dummyjson supports one category at a time — use the last selected
    const newCat = catValues.length > 0 ? catValues[catValues.length - 1] : "";
    if (newCat !== selectedCategory) {
      setSelectedCategory(newCat);
      if (newCat) setSearch("");
      setPage(1);
    }

    // Extract status filter (client-side)
    const statusFilter = newFilters.find((f) => f.id === "availabilityStatus");
    const statusValues = Array.isArray(statusFilter?.value) ? (statusFilter.value as string[]) : [];
    setSelectedStatuses(statusValues);
  }, [selectedCategory]);

  // Apply status filter client-side on the server-fetched data
  const filteredProducts = React.useMemo(() => {
    if (selectedStatuses.length === 0) return products;
    return products.filter((p) => selectedStatuses.includes(p.availabilityStatus || "In Stock"));
  }, [products, selectedStatuses]);

  const productColumns: ColumnDef<Product>[] = React.useMemo(
    () => [
      {
        accessorKey: "thumbnail",
        header: () => <span>Image</span>,
        cell: ({ row }) => (
          <div
            className={`w-8 h-8 rounded-cl-md overflow-hidden bg-cl-bg-hover ring-1 ring-border-soft dark:bg-cl-bg-hover dark:ring-1 dark:ring-cl-text/[0.08]`}
          >
            <img
              src={row.original.thumbnail}
              alt={row.original.title}
              className="w-full h-full object-cover"
            />
          </div>
        ),
        enableSorting: false,
      },
      {
        accessorKey: "title",
        header: () => <span>Product</span>,
        cell: ({ row }) => (
          <div className="min-w-[180px]">
            <p
              className={`text-sm font-medium text-cl-text`}
            >
              {row.original.title}
            </p>
            <p
              className={`text-xs text-cl-text-tertiary`}
            >
              {row.original.brand || "No brand"}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "category",
        header: () => <span>Category</span>,
        cell: ({ row }) => (
          <span
            className={`text-xs px-2 py-1 rounded-full whitespace-nowrap bg-cl-bg-hover text-cl-text-secondary dark:bg-cl-bg-hover dark:text-cl-text-secondary`}
          >
            {row.original.category}
          </span>
        ),
      },
      {
        accessorKey: "price",
        header: () => <span>Price</span>,
        cell: ({ row }) => (
          <span
            className={`font-medium whitespace-nowrap text-cl-success`}
          >
            ${(row.original.price ?? 0).toFixed(2)}
          </span>
        ),
      },
      {
        accessorKey: "discountPercentage",
        header: () => <span>Discount</span>,
        cell: ({ row }) => {
          const disc = row.original.discountPercentage ?? 0;
          return (
            <span
              className={`text-sm whitespace-nowrap ${disc > 10 ? (dark ? "text-cl-warning" : "text-cl-warning") : dark ? "text-cl-text-tertiary" : "text-cl-text-tertiary"}`}
            >
              {disc.toFixed(1)}%
            </span>
          );
        },
      },
      {
        accessorKey: "rating",
        header: () => <span>Rating</span>,
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill={dark ? "#fbbf24" : "#f59e0b"}
              stroke="none"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span
              className={`text-sm text-cl-text-secondary`}
            >
              {(row.original.rating ?? 0).toFixed(1)}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "stock",
        header: () => <span>Stock</span>,
        cell: ({ row }) => {
          const stock = row.original.stock;
          return (
            <span
              className={`text-sm whitespace-nowrap ${stock < 10 ? (dark ? "text-cl-error" : "text-cl-error") : dark ? "text-cl-text-secondary" : "text-cl-text"}`}
            >
              {stock} {stock < 10 && <span className="text-xs">(low)</span>}
            </span>
          );
        },
      },
      {
        accessorKey: "sku",
        header: () => <span>SKU</span>,
        cell: ({ row }) => (
          <span
            className={`text-xs font-mono whitespace-nowrap text-cl-text-secondary`}
          >
            {row.original.sku || "\u2014"}
          </span>
        ),
        enableSorting: false,
      },
      {
        accessorKey: "weight",
        header: () => <span>Weight</span>,
        cell: ({ row }) => (
          <span
            className={`text-sm whitespace-nowrap text-cl-text-secondary`}
          >
            {row.original.weight ?? 0}kg
          </span>
        ),
      },
      {
        accessorKey: "warrantyInformation",
        header: () => <span>Warranty</span>,
        cell: ({ row }) => (
          <span
            className={`text-xs whitespace-nowrap text-cl-text-secondary`}
          >
            {row.original.warrantyInformation || "\u2014"}
          </span>
        ),
        enableSorting: false,
      },
      {
        accessorKey: "shippingInformation",
        header: () => <span>Shipping</span>,
        cell: ({ row }) => (
          <span
            className={`text-xs whitespace-nowrap text-cl-text-secondary`}
          >
            {row.original.shippingInformation || "\u2014"}
          </span>
        ),
        enableSorting: false,
      },
      {
        accessorKey: "availabilityStatus",
        header: () => <span>Status</span>,
        cell: ({ row }) => {
          const status = row.original.availabilityStatus || "In Stock";
          const isLow = status === "Low Stock";
          const isOut = status === "Out of Stock";
          return (
            <span
              className={`text-xs px-2 py-1 rounded-full whitespace-nowrap font-medium ${
                isOut
                  ? dark
                    ? "bg-cl-error/15 text-cl-error"
                    : "bg-cl-error/15 text-cl-error"
                  : isLow
                    ? dark
                      ? "bg-cl-warning/15 text-cl-warning"
                      : "bg-cl-warning/15 text-cl-warning"
                    : dark
                      ? "bg-cl-success/15 text-cl-success"
                      : "bg-cl-success/15 text-cl-success"
              }`}
            >
              {status}
            </span>
          );
        },
        enableSorting: false,
      },
    ],
    [dark],
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <div
            className={`absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-cl-text-tertiary`}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
          <input
            type="text"
            defaultValue={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search products..."
 className={`w-full h-[38px] pl-9 pr-3 text-sm rounded-cl-md focus:outline-none focus:ring-2 bg-cl-bg-elevated border-cl-border text-cl-text placeholder-fg-muted focus:ring-cl-accent/40 focus:border-cl-border-input-focus/50`}
          />
        </div>
        {(selectedCategory || selectedStatuses.length > 0) && (
          <div className="flex items-center gap-2 flex-wrap">
            {selectedCategory && (
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full bg-cl-accent/10 text-cl-accent dark:bg-cl-accent/15 dark:text-cl-accent`}>
                {selectedCategory}
                <button onClick={() => { setSelectedCategory(""); setPage(1); setColumnFilters((prev) => prev.filter((f) => f.id !== "category")); }} className="cursor-pointer hover:opacity-70">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>
              </span>
            )}
            {selectedStatuses.map((st) => (
              <span key={st} className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full bg-cl-success/15 text-cl-success dark:bg-cl-success/15 dark:text-cl-success`}>
                {st}
                <button onClick={() => {
                  const remaining = selectedStatuses.filter((s2) => s2 !== st);
                  setSelectedStatuses(remaining);
                  setColumnFilters((prev) => remaining.length > 0 ? prev.map((f) => f.id === "availabilityStatus" ? { ...f, value: remaining } : f) : prev.filter((f) => f.id !== "availabilityStatus"));
                }} className="cursor-pointer hover:opacity-70">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
      <div
        className={`flex items-center justify-between text-xs text-cl-text-tertiary`}
      >
        <span>
          {loading ? "Loading..." : `${filteredProducts.length}${selectedStatuses.length > 0 ? ` of ${total}` : ` `} products found`}
          {search && ` for "${search}"`}
          {selectedCategory && ` in ${selectedCategory}`}
          {selectedStatuses.length > 0 && ` (${selectedStatuses.join(", ")})`}
        </span>
        <span>
          Page {page} of {totalPages || 1}
          {sorting.length > 0 &&
            ` | Sorted by ${sorting[0].id} (${sorting[0].desc ? "desc" : "asc"})`}
        </span>
      </div>
      <Table
        columns={productColumns}
        data={filteredProducts}
        sortable
        sorting={sorting}
        onSortingChange={handleSortChange}
        manualSorting
        manualPagination
        manualFiltering
        loading={loading}
        enableColumnFilters
        columnFilters={columnFilters}
        onColumnFiltersChange={handleColumnFiltersChange}
        filterableColumns={filterColumnsConfig}
        pinnedColumns={serverPinnedCols}
        onPinColumn={(col) =>
          setServerPinnedCols((prev) =>
            prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col],
          )
        }
        maxPinnedColumns={2}
        shimmerRowCount={pageSize}
        getRowId={(row) => String(row.id)}
        classes={{
          ...s,
          // Tall enough for the Product cell's title + brand subtitle so
          // both pinned (image-only) and unpinned cells render at exactly
          // the same height row-for-row. Without this the pinned image
          // stays vertically centered while unpinned rows drift slightly
          // taller, accumulating a misalignment by a few rows in.
          cell: `px-4 py-3 h-[64px] text-sm whitespace-nowrap text-cl-text align-middle`,
          shimmer: "w-full overflow-hidden",
          shimmerRow: "border-b border-cl-border/50 dark:border-cl-text/[0.03]",
          shimmerCell: "px-4 py-3.5 h-16",
          shimmerBar: `h-3 w-full rounded-cl-md bg-cl-bg-elevated bg-[length:200%_100%] animate-[shimmer_2s_ease-in-out_infinite]`,
          filterDropdown: `bg-cl-bg border-cl-border`,
        }}
      />
      {totalPages > 1 && !loading && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className={`px-3 py-1.5 text-sm rounded-cl-md cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-cl-bg-elevated text-cl-text-secondary hover:bg-cl-bg-elevated`}
          >
            Previous
          </button>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            let pageNum: number;
            if (totalPages <= 5) pageNum = i + 1;
            else if (page <= 3) pageNum = i + 1;
            else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
            else pageNum = page - 2 + i;
            return (
              <button
                key={pageNum}
                onClick={() => setPage(pageNum)}
                className={`w-8 h-8 text-sm rounded-cl-md cursor-pointer transition-colors ${page === pageNum ? "bg-cl-accent text-white" : dark ? "text-cl-text-tertiary hover:bg-cl-bg-hover" : "text-cl-text-secondary hover:bg-cl-bg-hover"}`}
              >
                {pageNum}
              </button>
            );
          })}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className={`px-3 py-1.5 text-sm rounded-cl-md cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-cl-bg-elevated text-cl-text-secondary hover:bg-cl-bg-elevated`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

const TableDemo = () => {
  const { isDarkMode: dark } = useTheme();
  const c = getClasses(dark);
  const s = getTableClasses(dark);
  const pClasses = getPaginationClasses(dark);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [pinnedCols, setPinnedCols] = useState<string[]>([]);

  // State for dark/modern pagination
  const [darkCurrentPage, setDarkCurrentPage] = useState(1);
  const [darkRowsPerPage, setDarkRowsPerPage] = useState(3);

  // State for floating actions demo
  const [hoveredRowIndex, setHoveredRowIndex] = useState<number | null>(null);
  const [hoveredRowRef, setHoveredRowRef] =
    useState<React.RefObject<HTMLTableRowElement> | null>(null);
  const [isFloatingActionsHovered, setIsFloatingActionsHovered] =
    useState(false);

  // State for comprehensive demo
  const [compHoveredRowIndex, setCompHoveredRowIndex] = useState<number | null>(
    null,
  );
  const [compHoveredRowRef, setCompHoveredRowRef] =
    useState<React.RefObject<HTMLTableRowElement> | null>(null);
  const [compIsFloatingActionsHovered, setCompIsFloatingActionsHovered] =
    useState(false);
  const [compPinnedCols, setCompPinnedCols] = useState<string[]>(["name"]);
  const [compIsLoading, setCompIsLoading] = useState(false);

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
          <StatusBadge status={row.getValue("status")} dark={dark} />
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
    [dark],
  );

  // Extended columns for scroll demos
  const extendedColumns: ColumnDef<ExtendedUser>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: () => <span>Name</span>,
        cell: ({ row }) => (
          <span className="font-medium">{row.getValue("name")}</span>
        ),
      },
      {
        accessorKey: "status",
        header: () => <span>Status</span>,
        cell: ({ row }) => (
          <StatusBadge status={row.getValue("status")} dark={dark} />
        ),
      },
      {
        accessorKey: "email",
        header: () => <span>Email</span>,
        cell: ({ row }) => row.getValue("email"),
      },
      {
        accessorKey: "phone",
        header: () => <span>Phone</span>,
        cell: ({ row }) => row.getValue("phone"),
      },
      {
        accessorKey: "role",
        header: () => <span>Role</span>,
        cell: ({ row }) => row.getValue("role"),
      },
      {
        accessorKey: "department",
        header: () => <span>Department</span>,
        cell: ({ row }) => row.getValue("department"),
      },
      {
        accessorKey: "team",
        header: () => <span>Team</span>,
        cell: ({ row }) => row.getValue("team"),
      },
      {
        accessorKey: "location",
        header: () => <span>Location</span>,
        cell: ({ row }) => row.getValue("location"),
      },
      {
        accessorKey: "salary",
        header: () => <span>Salary</span>,
        cell: ({ row }) =>
          `$${(row.getValue("salary") as number).toLocaleString()}`,
      },
      {
        accessorKey: "manager",
        header: () => <span>Manager</span>,
        cell: ({ row }) => row.getValue("manager"),
      },
      {
        accessorKey: "projects",
        header: () => <span>Projects</span>,
        cell: ({ row }) => row.getValue("projects"),
      },
      {
        accessorKey: "performance",
        header: () => <span>Performance</span>,
        cell: ({ row }) => (
          <PerformanceBadge
            performance={row.getValue("performance")}
            dark={dark}
          />
        ),
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
      {
        accessorKey: "lastLogin",
        header: () => <span>Last Login</span>,
        cell: ({ row }) => row.getValue("lastLogin"),
      },
    ],
    [dark],
  );

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return sampleData.slice(start, start + rowsPerPage);
  }, [currentPage, rowsPerPage]);

  const totalPages = Math.ceil(sampleData.length / rowsPerPage);

  // Data for dark pagination
  const darkPaginatedData = useMemo(() => {
    const start = (darkCurrentPage - 1) * darkRowsPerPage;
    return sampleData.slice(start, start + darkRowsPerPage);
  }, [darkCurrentPage, darkRowsPerPage]);

  const darkTotalPages = Math.ceil(sampleData.length / darkRowsPerPage);

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

  const handleDarkPageChange = (page: number) => {
    setDarkCurrentPage(page);
  };

  const handleDarkRowsPerPageChange = (rows: number) => {
    setDarkRowsPerPage(rows);
    setDarkCurrentPage(1);
  };

  const handlePinColumn = (columnId: string, isPinned: boolean) => {
    if (isPinned) {
      setPinnedCols((prev) => [...prev, columnId]);
    } else {
      setPinnedCols((prev) => prev.filter((id) => id !== columnId));
    }
  };

  // Floating actions handlers - state is set directly, FloatingActions handles delay internally
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

  // While the user is actively scrolling the comp table, skip hover
  // state updates. Without this, every row that passes under the cursor
  // during scroll fires `mouseenter` -> setState -> full re-render ->
  // FAB getBoundingClientRect (layout flush) -> 220ms transform
  // transition. That cascade per row makes scroll feel laggy.
  const compIsScrollingRef = useRef(false);
  const compScrollEndTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  useEffect(() => {
    const onScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      // Only react to scrolls inside a table-container (the inner
      // flex/grid wrapper that actually scrolls in stickyHeader mode).
      if (!target.closest?.('[data-testid="table-container"]')) return;
      compIsScrollingRef.current = true;
      if (compScrollEndTimeoutRef.current)
        clearTimeout(compScrollEndTimeoutRef.current);
      compScrollEndTimeoutRef.current = setTimeout(() => {
        compIsScrollingRef.current = false;
      }, 120);
    };
    document.addEventListener("scroll", onScroll, {
      passive: true,
      capture: true,
    });
    return () => {
      document.removeEventListener("scroll", onScroll, { capture: true });
      if (compScrollEndTimeoutRef.current)
        clearTimeout(compScrollEndTimeoutRef.current);
    };
  }, []);

  // Comprehensive demo handlers - state is set directly, FloatingActions handles delay internally
  const handleCompRowHover = (
    rowIndex: number | null,
    rowRef?: React.RefObject<HTMLTableRowElement>,
  ) => {
    if (compIsScrollingRef.current) return;
    setCompHoveredRowIndex(rowIndex);
    setCompHoveredRowRef(rowRef ?? null);
  };

  const handleCompFloatingActionsHover = (isHovered: boolean) => {
    setCompIsFloatingActionsHovered(isHovered);
  };

  const handleCompPinColumn = (columnId: string, isPinned: boolean) => {
    if (isPinned) {
      setCompPinnedCols((prev) => [...prev, columnId]);
    } else {
      setCompPinnedCols((prev) => prev.filter((id) => id !== columnId));
    }
  };

  const compFloatingActionsData =
    compHoveredRowIndex !== null
      ? extendedSampleData[compHoveredRowIndex]
      : undefined;

  // ── New demo state ─────────────────────────────────────────────────────
  // Column Sorting
  const [sortingState, setSortingState] = useState<SortingState>([]);

  // Multi-Row Selection
  const [multiSelectedIds, setMultiSelectedIds] = useState<string[]>([]);

  // Row Expansion
  const [expandedRowIds, setExpandedRowIds] = useState<string[]>([]);

  // Column Visibility Toggle
  const [colVisibility, setColVisibility] = useState<Record<string, boolean>>({
    name: true,
    email: true,
    role: true,
    status: true,
    department: true,
    joinDate: true,
  });

  // Striped (no extra state needed)

  // Density Modes
  const [density, setDensity] = useState<
    "compact" | "comfortable" | "spacious"
  >("comfortable");

  // Column Resizing (no extra state needed beyond enableColumnResizing)

  // Inline Cell Editing
  const [editedCells, setEditedCells] = useState<
    { rowId: string; columnId: string; value: unknown }[]
  >([]);

  // CSV Export (no extra state needed)

  // Row Drag & Drop
  const [dragDropData, setDragDropData] = useState<User[]>(() =>
    sampleData.slice(0, 6),
  );

  // Context Menu
  const [contextMenuInfo, setContextMenuInfo] = useState<string | null>(null);

  // Copy to Clipboard
  const [lastCopied, setLastCopied] = useState<string | null>(null);

  // Infinite Scroll
  const infiniteScrollTableRef = useRef<HTMLDivElement>(null);
  // Generate a larger dataset
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

  // Infinite Scroll demo variants
  const inf2Ref = useRef<HTMLDivElement>(null);
  const [inf2Data, setInf2Data] = useState<User[]>(() =>
    allInfiniteData.slice(0, 10),
  );
  const [inf2HasMore, setInf2HasMore] = useState(true);
  const [inf2Loading, setInf2Loading] = useState(false);
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

  const inf3Ref = useRef<HTMLDivElement>(null);
  const [inf3Data, setInf3Data] = useState<User[]>(() =>
    allInfiniteData.slice(0, 10),
  );
  const [inf3HasMore, setInf3HasMore] = useState(true);
  const [inf3Loading, setInf3Loading] = useState(false);
  const handleLoadMore3 = useCallback(() => {
    if (inf3Loading || !inf3HasMore) return;
    setInf3Loading(true);
    setTimeout(() => {
      setInf3Data((prev) => {
        const more = allInfiniteData.slice(prev.length, prev.length + 10);
        const updated = [...prev, ...more];
        if (updated.length >= allInfiniteData.length) setInf3HasMore(false);
        return updated;
      });
      setInf3Loading(false);
    }, 800);
  }, [inf3Loading, inf3HasMore, allInfiniteData]);

  const inf4Ref = useRef<HTMLDivElement>(null);
  const [inf4Data, setInf4Data] = useState<User[]>(() =>
    allInfiniteData.slice(0, 10),
  );
  const [inf4HasMore, setInf4HasMore] = useState(true);
  const [inf4Loading, setInf4Loading] = useState(false);
  const handleLoadMore4 = useCallback(() => {
    if (inf4Loading || !inf4HasMore) return;
    setInf4Loading(true);
    setTimeout(() => {
      setInf4Data((prev) => {
        const more = allInfiniteData.slice(prev.length, prev.length + 10);
        const updated = [...prev, ...more];
        if (updated.length >= allInfiniteData.length) setInf4HasMore(false);
        return updated;
      });
      setInf4Loading(false);
    }, 1200);
  }, [inf4Loading, inf4HasMore, allInfiniteData]);

  // Built-in Search Bar
  const [builtInSearchFilter, setBuiltInSearchFilter] = useState("");

  // Server-Side Mode
  const [serverSorting, setServerSorting] = useState<SortingState>([]);
  const [serverData, setServerData] = useState<User[]>(sampleData.slice(0, 5));
  const [serverLoading, setServerLoading] = useState(false);

  // Editable data for inline editing
  const [editableData, setEditableData] = useState<User[]>(() =>
    sampleData.slice(0, 5),
  );

  // Infinite scroll load more handler
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

  // Server-side sorting handler
  const handleServerSortingChange = useCallback((newSorting: SortingState) => {
    setServerSorting(newSorting);
    setServerLoading(true);
    setTimeout(() => {
      const sorted = [...sampleData];
      if (newSorting.length > 0) {
        const { id, desc } = newSorting[0];
        sorted.sort((a, b) => {
          const aVal = String((a as unknown as Record<string, unknown>)[id] ?? "");
          const bVal = String((b as unknown as Record<string, unknown>)[id] ?? "");
          return desc ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
        });
      }
      setServerData(sorted.slice(0, 5));
      setServerLoading(false);
    }, 800);
  }, []);

  // Columns for sorting demo (reuse base but with string headers for sorting)
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
          <StatusBadge status={row.getValue("status")} dark={dark} />
        ),
      },
      { accessorKey: "department", header: "Department" },
      { accessorKey: "joinDate", header: "Join Date" },
    ],
    [dark],
  );

  // Columns with actions for right pinning
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
            className={`px-2 py-1 text-xs rounded bg-cl-accent/10 text-cl-accent hover:bg-cl-accent/10 dark:bg-cl-accent/20 dark:text-cl-accent dark:hover:bg-cl-accent/30`}
            onClick={() => alert("Action clicked")}
          >
            Edit
          </button>
        ),
      },
    ],
    [],
  );

  // Columns for footer demo
  const footerColumns: ColumnDef<ExtendedUser>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <span className="font-medium">{row.getValue("name")}</span>
        ),
      },
      { accessorKey: "department", header: "Department" },
      {
        accessorKey: "salary",
        header: "Salary",
        cell: ({ row }) =>
          `$${(row.getValue("salary") as number).toLocaleString()}`,
      },
      { accessorKey: "projects", header: "Projects" },
    ],
    [],
  );

  return (
    <div className="space-y-10">
      <DocsHero
        title="Table"
        description={
          'A flexible data table with sorting, pagination, row selection, and pinned columns. Requires @tanstack/react-table as a peer dependency — install it alongside @chumlab/ui.'
        }
        code={`npm install @chumlab/ui @tanstack/react-table

import { Table } from "@chumlab/ui/table";
import { Pagination } from "@chumlab/ui/pagination";`}
      />

      <Section title="Basic Usage" description="A simple table with columns and data." isDarkMode={dark}>
        <DemoWrapper isDarkMode={dark}>
          {/* Basic usage — works out-of-the-box with built-in styles */}
          <Table columns={columns} data={sampleData.slice(0, 5)} classes={s} />
        </DemoWrapper>
      </Section>

      <Section title="With Row Selection" isDarkMode={dark}>
        <Table
          columns={columns}
          data={sampleData.slice(0, 5)}
          getRowId={(row) => row.id}
          selectedRowId={selectedRowId}
          onRowClick={handleRowClick}
          classes={s}
        />
        {selectedRowId && (
          <p
            className={`mt-2 text-sm text-cl-text-secondary`}
          >
            Selected:{" "}
            <code
              className={`px-1 rounded bg-cl-bg-elevated`}
            >
              {selectedRowId}
            </code>
          </p>
        )}
      </Section>

      <Section title="With Floating Actions" isDarkMode={dark}>
        <Table
          columns={columns}
          data={sampleData.slice(0, 5)}
          onRowHover={handleRowHover}
          isFloatingActionsHovered={isFloatingActionsHovered}
          floatingActions={
            <FloatingActions<User>
              rowRef={hoveredRowRef}
              rowData={floatingActionsData}
              onHover={handleFloatingActionsHover}
              isVisible={hoveredRowIndex !== null || isFloatingActionsHovered}
              getName={(data) => data.name}
              dark={dark}
            />
          }
          classes={s}
        />
        <p
          className={`mt-3 text-sm text-cl-text-secondary`}
        >
          Hover over any row to see floating action buttons (View, Edit,
          Delete). The actions stay at the right edge of the table.
        </p>
      </Section>

      <Section title="Actions Column + Floating 3-Dot Menu" isDarkMode={dark}>
        {(() => {
          const DotMenuDemo = () => {
            const [dotMenuState, setDotMenuState] = React.useState<{
              rowId: string;
              top: number;
              left: number;
            } | null>(null);
            const [dotHoverIdx, setDotHoverIdx] = React.useState<number | null>(
              null,
            );
            const [dotHoverRef, setDotHoverRef] =
              React.useState<React.RefObject<HTMLTableRowElement> | null>(null);
            const [dotFloatingHovered, setDotFloatingHovered] =
              React.useState(false);
            const dotMenuRef = React.useRef<HTMLDivElement>(null);

            // Close menu on click outside
            React.useEffect(() => {
              if (!dotMenuState) return;
              const handler = (e: MouseEvent) => {
                if (
                  dotMenuRef.current &&
                  !dotMenuRef.current.contains(e.target as Node)
                ) {
                  setDotMenuState(null);
                }
              };
              document.addEventListener("mousedown", handler);
              return () => document.removeEventListener("mousedown", handler);
            }, [dotMenuState]);

            // Close menu when hovering a different row
            React.useEffect(() => {
              if (dotMenuState && dotHoverIdx !== null) {
                const hoveredRowId = sampleData[dotHoverIdx]?.id;
                if (hoveredRowId && hoveredRowId !== dotMenuState.rowId) {
                  setDotMenuState(null);
                }
              }
            }, [dotHoverIdx, dotMenuState]);

            const actionsColumns: ColumnDef<User>[] = useMemo(
              () => [
                {
                  accessorKey: "name",
                  header: () => <span>Name</span>,
                  cell: ({ row }) => (
                    <span className="font-medium">{row.getValue("name")}</span>
                  ),
                },
                { accessorKey: "email", header: () => <span>Email</span> },
                { accessorKey: "role", header: () => <span>Role</span> },
                {
                  accessorKey: "status",
                  header: () => <span>Status</span>,
                  cell: ({ row }) => (
                    <StatusBadge status={row.getValue("status")} dark={dark} />
                  ),
                },
                {
                  id: "actions",
                  header: () => <span>Actions</span>,
                  size: 100,
                  cell: ({ row }) => (
                    <div className="flex items-center gap-1">
                      <button
                        className={`p-1.5 rounded-cl-md transition-colors cursor-pointer text-cl-accent hover:bg-cl-bg-elevated`}
                        title="Edit"
                        onClick={() => alert(`Edit: ${row.original.name}`)}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button
                        className={`p-1.5 rounded-cl-md transition-colors cursor-pointer text-cl-error hover:bg-cl-bg-elevated`}
                        title="Delete"
                        onClick={() => alert(`Delete: ${row.original.name}`)}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                        </svg>
                      </button>
                    </div>
                  ),
                },
              ],
              // eslint-disable-next-line react-hooks/exhaustive-deps -- dark triggers theme-aware column re-creation
              [dark],
            );

            const dotFloatingData =
              dotHoverIdx !== null ? sampleData[dotHoverIdx] : undefined;

            return (
              <>
                <Table
                  columns={actionsColumns}
                  data={sampleData.slice(0, 5)}
                  onRowHover={(idx, ref) => {
                    setDotHoverIdx(idx);
                    setDotHoverRef(ref ?? null);
                  }}
                  isFloatingActionsHovered={dotFloatingHovered}
                  isPopupOpen={dotMenuState !== null}
                  floatingActions={
                    <FloatingActions<User>
                      rowRef={dotHoverRef}
                      rowData={dotFloatingData}
                      onHover={setDotFloatingHovered}
                      isVisible={
                        dotHoverIdx !== null ||
                        dotFloatingHovered ||
                        dotMenuState !== null
                      }
                      getName={(data) => data.name}
                      dark={dark}
                      renderContent={(_name, rowData) => (
                        <button
                          className={`p-1.5 rounded transition-colors cursor-pointer text-cl-text-tertiary hover:text-cl-text hover:bg-cl-bg-hover dark:text-cl-text-tertiary dark:hover:text-cl-text dark:hover:bg-cl-bg-hover`}
                          title="More actions"
                          onClick={(e) => {
                            const rowId = (rowData as User)?.id ?? null;
                            if (dotMenuState?.rowId === rowId) {
                              setDotMenuState(null);
                            } else if (rowId) {
                              const rect =
                                e.currentTarget.getBoundingClientRect();
                              setDotMenuState({
                                rowId,
                                top: rect.top,
                                left: rect.right + 8,
                              });
                            }
                          }}
                        >
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <circle cx="12" cy="5" r="2" />
                            <circle cx="12" cy="12" r="2" />
                            <circle cx="12" cy="19" r="2" />
                          </svg>
                        </button>
                      )}
                    />
                  }
                  classes={s}
                />
                {dotMenuState &&
                  createPortal(
                    <div
                      ref={dotMenuRef}
                      className={`fixed rounded-cl-md border shadow-xl overflow-hidden min-w-[160px] z-[9999] bg-cl-bg border-cl-border`}
                      style={{ top: dotMenuState.top, left: dotMenuState.left }}
                    >
                      {[
                        {
                          label: "View Details",
                          icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
                        },
                        {
                          label: "Duplicate",
                          icon: "M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z",
                        },
                        {
                          label: "Archive",
                          icon: "M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4",
                        },
                        {
                          label: "Delete",
                          icon: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16",
                          danger: true,
                        },
                      ].map((item) => (
                        <button
                          key={item.label}
                          className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm transition-colors cursor-pointer ${(item as { danger?: boolean }).danger ? (dark ? "text-cl-error hover:bg-cl-error/10" : "text-cl-error hover:bg-cl-error/15") : dark ? "text-cl-text-secondary hover:bg-cl-bg-hover" : "text-cl-text hover:bg-cl-bg-hover"}`}
                          onClick={() => {
                            alert(
                              `${item.label}: ${sampleData.find((u) => u.id === dotMenuState.rowId)?.name}`,
                            );
                            setDotMenuState(null);
                          }}
                        >
                          <svg
                            className="w-4 h-4 shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d={item.icon} />
                          </svg>
                          {item.label}
                        </button>
                      ))}
                    </div>,
                    document.body,
                  )}
              </>
            );
          };
          return <DotMenuDemo />;
        })()}
        <div
          className={`mt-3 text-sm space-y-2 text-cl-text-secondary`}
        >
          <p>
            Combines an inline <strong>Actions column</strong> (Edit, Delete)
            with a <strong>floating 3-dot menu</strong> on hover. The dropdown
            renders via portal so it never gets clipped by the table container.
          </p>
          <p>
            Uses{" "}
            <code
              className={`px-1 rounded bg-cl-bg-elevated`}
            >
              isPopupOpen
            </code>{" "}
            to keep the floating panel visible while the dropdown is open.
          </p>
        </div>
      </Section>

      <Section title="Floating Actions with Custom Triggers" isDarkMode={dark}>
        {(() => {
          const PillToolbarDemo = () => {
            const [pillHoverIdx, setPillHoverIdx] = React.useState<
              number | null
            >(null);
            const [pillHoverRef, setPillHoverRef] =
              React.useState<React.RefObject<HTMLTableRowElement> | null>(null);
            const [pillFloatingHovered, setPillFloatingHovered] =
              React.useState(false);

            const pillFloatingData =
              pillHoverIdx !== null ? sampleData[pillHoverIdx] : undefined;

            return (
              <Table
                columns={columns}
                data={sampleData.slice(0, 4)}
                onRowHover={(idx, ref) => {
                  setPillHoverIdx(idx);
                  setPillHoverRef(ref ?? null);
                }}
                isFloatingActionsHovered={pillFloatingHovered}
                floatingActions={
                  <FloatingActions<User>
                    rowRef={pillHoverRef}
                    rowData={pillFloatingData}
                    onHover={setPillFloatingHovered}
                    isVisible={pillHoverIdx !== null || pillFloatingHovered}
                    getName={(data) => data.name}
                    dark={dark}
                    className={`z-30 flex items-center gap-1 backdrop-blur-sm border rounded-full shadow-lg px-1.5 py-1 bg-cl-text/95 border-cl-border dark:bg-cl-bg/95 dark:border dark:border-cl-text/[0.08]`}
                    renderContent={(name) => (
                      <>
                        <button
                          className={`p-1.5 rounded-full transition-colors cursor-pointer text-cl-accent hover:bg-cl-accent/10 dark:text-cl-accent dark:hover:bg-cl-accent/15`}
                          title="Quick edit"
                          onClick={() => alert(`Editing ${name}`)}
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        <button
                          className={`p-1.5 rounded-full transition-colors cursor-pointer text-cl-success hover:bg-cl-success/15 dark:text-cl-success dark:hover:bg-cl-success/15`}
                          title="Bookmark"
                          onClick={() => alert(`Bookmarked ${name}`)}
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
                          </svg>
                        </button>
                        <button
                          className={`p-1.5 rounded-full transition-colors cursor-pointer text-cl-warning hover:bg-cl-warning/15 dark:text-cl-warning dark:hover:bg-cl-warning/15`}
                          title="Share"
                          onClick={() => alert(`Share link copied for ${name}`)}
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="18" cy="5" r="3" />
                            <circle cx="6" cy="12" r="3" />
                            <circle cx="18" cy="19" r="3" />
                            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                          </svg>
                        </button>
                        <div
                          className={`w-px h-5 mx-0.5 bg-cl-bg-elevated`}
                        />
                        <button
                          className={`p-1.5 rounded-full transition-colors cursor-pointer text-cl-error hover:bg-cl-error/15 dark:text-cl-error dark:hover:bg-cl-error/15`}
                          title="Delete"
                          onClick={() => alert(`Deleted ${name}`)}
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                          </svg>
                        </button>
                      </>
                    )}
                  />
                }
                classes={s}
              />
            );
          };
          return <PillToolbarDemo />;
        })()}
        <div
          className={`mt-3 text-sm space-y-2 text-cl-text-secondary`}
        >
          <p>
            A pill-shaped floating toolbar with{" "}
            <strong>custom action triggers</strong> (Edit, Bookmark, Share,
            Delete). The{" "}
            <code
              className={`px-1 rounded bg-cl-bg-elevated`}
            >
              floatingActions
            </code>{" "}
            prop accepts any ReactNode via{" "}
            <code
              className={`px-1 rounded bg-cl-bg-elevated`}
            >
              renderContent
            </code>
            .
          </p>
        </div>
      </Section>

      <Section title="With Pinned Columns (Interactive)" isDarkMode={dark}>
        <div className="w-full">
          <Table
            columns={columns}
            data={sampleData.slice(0, 5)}
            pinnedColumns={pinnedCols}
            onPinColumn={handlePinColumn}
            maxPinnedColumns={3}
            classes={{
              ...s,
              ...s,
              container: `${s.container} overflow-x-auto`,
            }}
          />
        </div>
        <div
          className={`mt-2 text-sm space-y-1 text-cl-text-secondary`}
        >
          <p>
            Hover over any column header to see the pin icon. Click to pin/unpin
            columns.
          </p>
          <p>
            <span className="font-medium">Currently pinned:</span>{" "}
            {pinnedCols.length > 0
              ? pinnedCols.map((c) => `"${c}"`).join(", ")
              : "None"}{" "}
            (max 3)
          </p>
        </div>
      </Section>

      <Section title="Custom Pin Icon (Star)" isDarkMode={dark}>
        <DemoWrapper isDarkMode={dark}>
          <Table
            columns={columns}
            data={sampleData.slice(0, 5)}
            pinnedColumns={["name"]}
            onPinColumn={handlePinColumn}
            maxPinnedColumns={3}
            PinIcon={({ className }) => (
              <svg
                className={className}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            )}
            PinnedIcon={({ className }) => (
              <svg
                className={className}
                viewBox="0 0 24 24"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="1"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            )}
            classes={{
              ...s,
              container: `${s.container} overflow-x-auto`,
              pinIcon: dark ? "text-cl-text-tertiary" : "text-cl-text-tertiary",
              pinnedPinIcon: dark ? "text-cl-warning" : "text-cl-warning",
            }}
          />
        </DemoWrapper>
        <div
          className={`mt-2 text-sm space-y-1 text-cl-text-secondary`}
        >
          <p>
            Uses a custom{" "}
            <code
              className={`px-1 rounded bg-cl-bg-elevated`}
            >
              PinIcon
            </code>{" "}
            (outline star) and{" "}
            <code
              className={`px-1 rounded bg-cl-bg-elevated`}
            >
              PinnedIcon
            </code>{" "}
            (filled star) via component props. The pinned icon is yellow to
            visually distinguish starred columns.
          </p>
        </div>
      </Section>

      <Section title="Custom Pin Separator Styling" isDarkMode={dark}>
        <DemoWrapper isDarkMode={dark}>
          <Table
            columns={columns}
            data={sampleData.slice(0, 5)}
            pinnedColumns={["name", "email"]}
            onPinColumn={handlePinColumn}
            maxPinnedColumns={3}
            classes={{
              ...s,
              ...s,
              container: `${s.container} overflow-x-auto`,
              pinnedContainer: "shrink-0 sticky left-0 z-30 bg-white dark:bg-cl-bg [box-shadow:4px_0_0_0_var(--cl-success)] transition-shadow duration-200",
              pinButton: `ml-2 p-1 rounded transition-colors hover:bg-cl-success/15 dark:hover:bg-cl-success/20`,
              pinnedPinButton: `ml-2 p-1 rounded transition-colors hover:bg-cl-success/15 dark:hover:bg-cl-success/20`,
              pinIcon: "text-cl-text-tertiary",
              pinnedPinIcon: dark ? "text-cl-success" : "text-cl-success",
            }}
          />
        </DemoWrapper>
        <div
          className={`mt-2 text-sm space-y-1 text-cl-text-secondary`}
        >
          <p>
            The pinned separator line uses a thicker green border (
            <code
              className={`px-1 rounded bg-cl-bg-elevated`}
            >
              border-r-4 border-cl-success
            </code>
            ) instead of the default blue. The pin icon color, hover background,
            and button styles are all customized via{" "}
            <code
              className={`px-1 rounded bg-cl-bg-elevated`}
            >
              classes
            </code>{" "}
            props.
          </p>
          <p className="mt-1">
            <span className="font-medium">Customizable via:</span>{" "}
            <code
              className={`px-1 rounded bg-cl-bg-elevated`}
            >
              pinnedContainerClassName
            </code>
            ,{" "}
            <code
              className={`px-1 rounded bg-cl-bg-elevated`}
            >
              pinButtonClassName
            </code>
            ,{" "}
            <code
              className={`px-1 rounded bg-cl-bg-elevated`}
            >
              pinnedPinButtonClassName
            </code>
            ,{" "}
            <code
              className={`px-1 rounded bg-cl-bg-elevated`}
            >
              pinIconClassName
            </code>
            ,{" "}
            <code
              className={`px-1 rounded bg-cl-bg-elevated`}
            >
              pinnedPinIconClassName
            </code>
          </p>
        </div>
      </Section>

      <Section title="With Pagination" isDarkMode={dark}>
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
            classes={{
              root: pClasses.root,
              selector: pClasses.selector,
              selectorButton: pClasses.selectorButton,
              selectorDropdown: pClasses.selectorDropdown,
              selectorOption: pClasses.selectorOption,
              pageButton: pClasses.pageButton,
              activePageButton: pClasses.activePageButton,
              navButton: pClasses.navButton,
              ellipsis: pClasses.ellipsis,
              label: pClasses.label,
            }}
          />
        </div>
      </Section>

      <Section title="Dark/Modern Pagination Style" isDarkMode={dark}>
        <div>
          <Table columns={columns} data={darkPaginatedData} classes={s} />
          <Pagination
            value={darkCurrentPage}
            totalPages={darkTotalPages}
            rowsPerPage={darkRowsPerPage}
            rowOptions={[3, 6, 9, 12]}
            onValueChange={handleDarkPageChange}
            onRowsPerPageChange={handleDarkRowsPerPageChange}
            rowsPerPageLabel="per page"
            classes={{
              root: darkPaginationContainerStyle,
              selector: darkPaginationRowSelectorStyle,
              selectorButton: darkPaginationButtonStyle,
              selectorDropdown: darkPaginationDropdownStyle,
              selectorOption: darkPaginationOptionStyle,
              pageButton: darkPaginationPageStyle,
              activePageButton: darkPaginationActivePageStyle,
              navButton: darkPaginationNavStyle,
              nav: darkPaginationNavContainerStyle,
              pageButtons: darkPaginationPageContainerStyle,
              ellipsis: darkPaginationEllipsisStyle,
              label: darkPaginationLabelStyle,
            }}
          />
        </div>
        <p
          className={`mt-3 text-sm text-cl-text-secondary`}
        >
          Alternative dark theme pagination with custom row options: 3, 6, 9, 12
        </p>
      </Section>

      <Section title="Horizontal Scroll (Many Columns)" isDarkMode={dark}>
        <Table
          columns={extendedColumns}
          data={extendedSampleData.slice(0, 5)}
          maxWidth={900}
          classes={{
            ...s,
            ...s,
            container: `border rounded-cl-md border-cl-border`,
            table: "w-max border-collapse",
          }}
        />
        <p
          className={`mt-3 text-sm text-cl-text-secondary`}
        >
          Table with 14 columns and{" "}
          <code
            className={`px-1 rounded bg-cl-bg-elevated`}
          >
            maxWidth={"{900}"}
          </code>{" "}
          demonstrates horizontal scrolling.
        </p>
      </Section>

      <Section title="Vertical Scroll (Fixed Height)" isDarkMode={dark}>
        <Table
          columns={columns}
          data={sampleData}
          maxHeight={300}
          classes={{
            ...s,
            ...s,
            container: `w-full border rounded-cl-md border-cl-border`,
          }}
        />
        <p
          className={`mt-3 text-sm text-cl-text-secondary`}
        >
          Table with{" "}
          <code
            className={`px-1 rounded bg-cl-bg-elevated`}
          >
            maxHeight={"{300}"}
          </code>{" "}
          shows vertical scrolling within the table.
        </p>
      </Section>

      <Section title="Sticky Header" isDarkMode={dark}>
        <Table
          columns={columns}
          data={sampleData}
          maxHeight={250}
          stickyHeader
          classes={{
            ...s,
            ...s,
            container: `w-full border rounded-cl-md border-cl-border`,
          }}
        />
        <p
          className={`mt-3 text-sm text-cl-text-secondary`}
        >
          Table with{" "}
          <code
            className={`px-1 rounded bg-cl-bg-elevated`}
          >
            stickyHeader
          </code>{" "}
          prop - the header stays visible while scrolling vertically. No need to
          manually add sticky classes.
        </p>
      </Section>

      <Section
        title="Both Scrollbars (Fixed Height + Many Columns)"
        isDarkMode={dark}
      >
        <Table
          columns={extendedColumns}
          data={extendedSampleData}
          maxWidth={900}
          maxHeight={350}
          classes={{
            ...s,
            ...s,
            container: `border rounded-cl-md border-cl-border`,
            table: "w-max border-collapse",
          }}
        />
        <p
          className={`mt-3 text-sm text-cl-text-secondary`}
        >
          Table with{" "}
          <code
            className={`px-1 rounded bg-cl-bg-elevated`}
          >
            maxWidth={"{900}"}
          </code>{" "}
          and{" "}
          <code
            className={`px-1 rounded bg-cl-bg-elevated`}
          >
            maxHeight={"{350}"}
          </code>{" "}
          creates both scrollbars.
        </p>
      </Section>

      <Section title="Hidden Vertical Scrollbar" isDarkMode={dark}>
        <Table
          columns={columns}
          data={sampleData}
          maxHeight={250}
          hideVerticalScrollbar
          classes={{
            ...s,
            ...s,
            container: `w-full border rounded-cl-md border-cl-border`,
          }}
        />
        <p
          className={`mt-3 text-sm text-cl-text-secondary`}
        >
          Table with{" "}
          <code
            className={`px-1 rounded bg-cl-bg-elevated`}
          >
            maxHeight={"{250}"}
          </code>{" "}
          and{" "}
          <code
            className={`px-1 rounded bg-cl-bg-elevated`}
          >
            hideVerticalScrollbar
          </code>{" "}
          - scroll functionality works but the scrollbar is hidden. Try
          scrolling with mouse wheel or trackpad.
        </p>
      </Section>

      <Section title="Hidden Scrollbars (Both Directions)" isDarkMode={dark}>
        <Table
          columns={extendedColumns}
          data={extendedSampleData}
          maxWidth={900}
          maxHeight={300}
          hideVerticalScrollbar
          hideHorizontalScrollbar
          classes={{
            ...s,
            ...s,
            container: `border rounded-cl-md border-cl-border`,
            table: "w-max border-collapse",
          }}
        />
        <p
          className={`mt-3 text-sm text-cl-text-secondary`}
        >
          Table with both{" "}
          <code
            className={`px-1 rounded bg-cl-bg-elevated`}
          >
            hideVerticalScrollbar
          </code>{" "}
          and{" "}
          <code
            className={`px-1 rounded bg-cl-bg-elevated`}
          >
            hideHorizontalScrollbar
          </code>{" "}
          - scrollable in both directions but no visible scrollbars. Use mouse
          wheel, trackpad, or touch to scroll.
        </p>
      </Section>

      <Section title="Comprehensive Demo (All Features)" isDarkMode={dark}>
        <div className="space-y-4">
          <div className="flex items-center gap-4 flex-wrap">
            <button
              onClick={() => setCompIsLoading(true)}
              className={`px-3 py-1.5 text-sm font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-text text-cl-bg hover:opacity-90`}
            >
              Simulate Loading
            </button>
            <button
              onClick={() => {
                setCompIsLoading(true);
                setTimeout(() => setCompIsLoading(false), 2000);
              }}
 className={`px-3 py-1.5 text-sm font-medium rounded-cl-md transition-colors cursor-pointer text-cl-text bg-white border-cl-border-input hover:bg-cl-bg-hover dark:text-cl-text dark:bg-cl-bg dark:border dark:border-cl-border dark:hover:bg-cl-bg-elevated`}
            >
              Reload Data (2s)
            </button>
            <span
              className={`text-sm text-cl-text-secondary`}
            >
              Pinned:{" "}
              {compPinnedCols.length > 0
                ? compPinnedCols.map((c) => `"${c}"`).join(", ")
                : "None"}
            </span>
          </div>

          <Table
            columns={extendedColumns}
            data={extendedSampleData}
            loading={compIsLoading}
            maxWidth={1000}
            maxHeight={400}
            stickyHeader={true}
            pinnedColumns={compPinnedCols}
            onPinColumn={handleCompPinColumn}
            maxPinnedColumns={3}
            onRowHover={handleCompRowHover}
            isFloatingActionsHovered={compIsFloatingActionsHovered}
            floatingActions={
              <FloatingActions<ExtendedUser>
                rowRef={compHoveredRowRef}
                rowData={compFloatingActionsData}
                onHover={handleCompFloatingActionsHover}
                isVisible={
                  compHoveredRowIndex !== null || compIsFloatingActionsHovered
                }
                getName={(data) => data.name}
                dark={dark}
              />
            }
            classes={{
              ...s,
              container: `border rounded-cl-md border-cl-border`,
              table: "w-max border-collapse",
              unpinnedTable: "w-max border-collapse",
              pinnedContainer: "shrink-0 sticky left-0 z-30 bg-cl-bg-elevated [box-shadow:2px_0_0_0_var(--cl-border-input-focus)] transition-shadow duration-200",
              unpinnedContainer: "",
              shimmer: "w-max min-w-[1600px]",
            }}
          />

          <div
            className={`text-sm space-y-1 text-cl-text-secondary`}
          >
            <p>
              <strong>Features demonstrated:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Loading shimmer state (click "Simulate Loading")</li>
              <li>
                Horizontal & vertical scrolling within the table (table
                contained in viewport)
              </li>
              <li>
                Pinnable columns - hover column headers to pin/unpin (max 3)
              </li>
              <li>Floating actions on row hover (stays at right edge)</li>
              <li>Sticky header during vertical scroll</li>
              <li>14 columns with various data types</li>
            </ul>
          </div>
        </div>
      </Section>

      <Section title="Loading State" isDarkMode={dark}>
        <Table
          columns={columns}
          data={[]}
          loading
          shimmerRowCount={5}
          classes={s}
        />
      </Section>

      <Section title="Empty State (Fully Customizable)" isDarkMode={dark}>
        <Table
          columns={columns}
          data={[]}
          emptyContent={
            <div
              className={`flex flex-col items-center justify-center py-16 px-4 bg-linear-to-b border rounded-cl-md from-fg/[0.04] to-white border-cl-border dark:from-fg/[0.03] dark:to-bg-elevated dark:border-cl-text/[0.06]`}
            >
              {/* Custom Icon */}
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 bg-cl-accent/10 dark:bg-cl-accent/10`}
              >
                <svg
                  className={`w-10 h-10 text-cl-accent`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>

              {/* Title */}
              <h3
                className={`text-lg font-semibold mb-2 text-cl-text`}
              >
                No users found
              </h3>

              {/* Description */}
              <p
                className={`text-sm text-center max-w-sm mb-6 text-cl-text-secondary`}
              >
                Get started by adding your first team member. You can invite
                users via email or create accounts manually.
              </p>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button className={`px-4 py-2 text-sm font-medium rounded-cl-md transition-colors flex items-center gap-2 bg-cl-text text-cl-bg hover:opacity-90`}>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add User
                </button>
                <button
 className={`px-4 py-2 text-sm font-medium rounded-cl-md transition-colors text-cl-text bg-white border-cl-border-input hover:bg-cl-bg-hover dark:text-cl-text dark:bg-cl-bg dark:border dark:border-cl-border dark:hover:bg-cl-bg-elevated`}
                >
                  Import CSV
                </button>
              </div>
            </div>
          }
          classes={s}
        />
        <p
          className={`mt-3 text-sm text-cl-text-secondary`}
        >
          The{" "}
          <code
            className={`px-1 rounded bg-cl-bg-elevated`}
          >
            emptyContent
          </code>{" "}
          prop accepts any React node, giving you full control over the empty
          state UI — icons, buttons, styling, and layout are all customizable.
        </p>
      </Section>

      {/* ─── NEW FEATURE DEMOS ──────────────────────────────────────── */}

      <Section title="Column Sorting" isDarkMode={dark}>
        <DemoWrapper isDarkMode={dark}>
          <Table
            columns={sortableColumns}
            data={sampleData.slice(0, 6)}
            sortable
            sorting={sortingState}
            onSortingChange={setSortingState}
            getRowId={(row) => row.id}
            classes={s}
          />
          <p
            className={`mt-3 text-sm text-cl-text-secondary`}
          >
            Click any column header to sort. Current sorting state:{" "}
            <code
              className={`px-1 rounded bg-cl-bg-elevated`}
            >
              {sortingState.length > 0
                ? `${sortingState[0].id} (${sortingState[0].desc ? "desc" : "asc"})`
                : "none"}
            </code>
          </p>
        </DemoWrapper>
      </Section>

      <Section title="Multi-Row Selection (Checkboxes)" isDarkMode={dark}>
        <DemoWrapper isDarkMode={dark}>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span
                className={`text-sm text-cl-text-secondary`}
              >
                Selected: {multiSelectedIds.length} row(s)
              </span>
              {multiSelectedIds.length > 0 && (
                <button
                  onClick={() => {
                    alert(`Deleting rows: ${multiSelectedIds.join(", ")}`);
                    setMultiSelectedIds([]);
                  }}
                  className={`px-3 py-1 text-xs font-medium rounded transition-colors cursor-pointer text-cl-bg bg-cl-error hover:bg-cl-error dark:text-cl-bg dark:bg-cl-error dark:hover:bg-cl-error/30`}
                >
                  Delete Selected
                </button>
              )}
            </div>
            <Table
              columns={columns}
              data={sampleData.slice(0, 6)}
              selectionMode="multiple"
              selectedRowIds={multiSelectedIds}
              onSelectionChange={setMultiSelectedIds}
              getRowId={(row) => row.id}
              checkboxColor={dark ? "#6366f1" : "#4f46e5"}
              classes={s}
            />
          </div>
          <p
            className={`mt-3 text-sm text-cl-text-secondary`}
          >
            Use{" "}
            <code
              className={`px-1 rounded bg-cl-bg-elevated`}
            >
              selectionMode="multiple"
            </code>{" "}
            to show checkboxes. The header checkbox toggles select-all. Selected
            IDs are controlled via state.
          </p>
        </DemoWrapper>
      </Section>

      <Section title="Custom Checkbox Selection" isDarkMode={dark}>
        {(() => {
          const CustomCheckboxDemo = () => {
            const [customSelectedIds, setCustomSelectedIds] = React.useState<
              string[]
            >([]);

            const CustomCheck = ({
              checked,
              indeterminate,
              className,
            }: {
              checked: boolean;
              indeterminate?: boolean;
              className?: string;
            }) => (
              <div
                className={`w-5 h-5 rounded-cl-md border-2 flex items-center justify-center transition-all cursor-pointer ${
                  checked || indeterminate
                    ? dark
                      ? "bg-cl-success border-cl-success"
                      : "bg-cl-success border-cl-success"
                    : dark
                      ? "border-cl-border hover:border-cl-success"
                      : "border-cl-border-input hover:border-cl-success"
                } ${className ?? ""}`}
              >
                {indeterminate ? (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={3}
                    strokeLinecap="round"
                  >
                    <path d="M5 12h14" />
                  </svg>
                ) : checked ? (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                ) : null}
              </div>
            );

            return (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span
                    className={`text-sm text-cl-text-secondary`}
                  >
                    Selected: {customSelectedIds.length} row(s)
                  </span>
                  {customSelectedIds.length > 0 && (
                    <button
                      onClick={() => setCustomSelectedIds([])}
                      className={`px-3 py-1 text-xs font-medium rounded transition-colors cursor-pointer text-cl-success bg-cl-success/15 hover:bg-cl-success/15 dark:text-cl-success dark:bg-cl-success/15 dark:hover:bg-cl-success/25`}
                    >
                      Clear Selection
                    </button>
                  )}
                </div>
                <Table
                  columns={columns}
                  data={sampleData.slice(0, 6)}
                  selectionMode="multiple"
                  selectedRowIds={customSelectedIds}
                  onSelectionChange={setCustomSelectedIds}
                  getRowId={(row) => row.id}
                  CheckboxIcon={CustomCheck}
                  classes={{
                    ...s,
                    ...s,
                    selectedRow: `border-b transition-colors data-[clickable]:cursor-pointer border-cl-border bg-cl-success/15 hover:bg-cl-success/15 dark:border-cl-text/[0.04] dark:bg-cl-success/10 dark:hover:bg-cl-success/15`,
                  }}
                />
              </div>
            );
          };
          return <CustomCheckboxDemo />;
        })()}
        <div
          className={`mt-3 text-sm space-y-2 text-cl-text-secondary`}
        >
          <p>
            Custom checkbox using the{" "}
            <code
              className={`px-1 rounded bg-cl-bg-elevated`}
            >
              CheckboxIcon
            </code>{" "}
            prop. The component receives{" "}
            <code
              className={`px-1 rounded bg-cl-bg-elevated`}
            >
              checked
            </code>
            ,{" "}
            <code
              className={`px-1 rounded bg-cl-bg-elevated`}
            >
              indeterminate
            </code>
            , and{" "}
            <code
              className={`px-1 rounded bg-cl-bg-elevated`}
            >
              className
            </code>{" "}
            props. This example uses a green rounded checkbox with a custom
            checkmark icon and a dash for indeterminate state.
          </p>
          <p>
            The{" "}
            <code
              className={`px-1 rounded bg-cl-bg-elevated`}
            >
              selectedRowClassName
            </code>{" "}
            is also customized to match the green theme, highlighting selected
            rows with an emerald background.
          </p>
        </div>
      </Section>

      <Section title="Star Selection (Favorites)" isDarkMode={dark}>
        {(() => {
          const StarSelectDemo = () => {
            const [starredIds, setStarredIds] = React.useState<string[]>([]);

            const StarCheck = ({
              checked,
            }: {
              checked: boolean;
              indeterminate?: boolean;
              className?: string;
            }) => (
              <button
                type="button"
                className="cursor-pointer p-0.5 transition-transform hover:scale-110"
              >
                <svg
                  className={`w-5 h-5 transition-colors ${checked ? "text-cl-warning fill-cl-warning" : dark ? "text-cl-text-secondary fill-none hover:text-cl-warning/50" : "text-cl-text-secondary fill-none hover:text-cl-warning/50"}`}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </button>
            );

            return (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span
                    className={`text-sm text-cl-text-secondary`}
                  >
                    {starredIds.length > 0
                      ? `${starredIds.length} starred`
                      : "Click a star to favorite a row"}
                  </span>
                  {starredIds.length > 0 && (
                    <button
                      onClick={() => setStarredIds([])}
                      className={`px-3 py-1 text-xs font-medium rounded transition-colors cursor-pointer text-cl-warning bg-cl-warning/15 hover:bg-cl-warning/15 dark:text-cl-warning dark:bg-cl-warning/15 dark:hover:bg-cl-warning/25`}
                    >
                      Clear All Stars
                    </button>
                  )}
                </div>
                <Table
                  columns={columns}
                  data={sampleData.slice(0, 6)}
                  selectionMode="multiple"
                  selectedRowIds={starredIds}
                  onSelectionChange={setStarredIds}
                  getRowId={(row) => row.id}
                  CheckboxIcon={StarCheck}
                  classes={{
                    ...s,
                    ...s,
                    selectedRow: `border-b transition-colors data-[clickable]:cursor-pointer border-cl-border bg-cl-warning/50 hover:bg-cl-warning/15 dark:border-cl-text/[0.04] dark:bg-cl-warning/5 dark:hover:bg-cl-warning/10`,
                  }}
                />
              </div>
            );
          };
          return <StarSelectDemo />;
        })()}
        <div
          className={`mt-3 text-sm space-y-2 text-cl-text-secondary`}
        >
          <p>
            Stars instead of checkboxes using{" "}
            <code
              className={`px-1 rounded bg-cl-bg-elevated`}
            >
              CheckboxIcon
            </code>
            . Unselected rows show an outline star, selected rows show a filled
            amber star. Great for "favorites" or "bookmarks" patterns in SaaS
            apps.
          </p>
        </div>
      </Section>

      <Section title="Checkbox with Star Icon Inside" isDarkMode={dark}>
        {(() => {
          const StarInsideCheckboxDemo = () => {
            const [selected, setSelected] = React.useState<string[]>([]);

            const StarCheckbox = ({
              checked,
              indeterminate,
            }: {
              checked: boolean;
              indeterminate?: boolean;
              className?: string;
            }) => (
              <div
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all cursor-pointer ${
                  checked || indeterminate
                    ? dark
                      ? "bg-cl-accent border-cl-border-input-focus"
                      : "bg-cl-accent border-cl-border-input-focus"
                    : dark
                      ? "border-cl-border hover:border-cl-border-input-focus"
                      : "border-cl-border-input hover:border-cl-border-input-focus"
                }`}
              >
                {indeterminate ? (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={3}
                    strokeLinecap="round"
                  >
                    <path d="M5 12h14" />
                  </svg>
                ) : checked ? (
                  <svg
                    className="w-3 h-3 text-white"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth={0.5}
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ) : null}
              </div>
            );

            return (
              <div className="space-y-3">
                <span
                  className={`text-sm text-cl-text-secondary`}
                >
                  {selected.length > 0
                    ? `${selected.length} selected`
                    : "Select rows to see the star inside the checkbox"}
                </span>
                <Table
                  columns={columns}
                  data={sampleData.slice(0, 5)}
                  selectionMode="multiple"
                  selectedRowIds={selected}
                  onSelectionChange={setSelected}
                  getRowId={(row) => row.id}
                  CheckboxIcon={StarCheckbox}
                  classes={{
                    ...s,
                    ...s,
                    selectedRow: `border-b transition-colors data-[clickable]:cursor-pointer border-cl-border bg-cl-accent/10 hover:bg-cl-accent/10 dark:border-cl-text/[0.04] dark:bg-cl-accent/10 dark:hover:bg-cl-accent/15`,
                  }}
                />
              </div>
            );
          };
          return <StarInsideCheckboxDemo />;
        })()}
        <div
          className={`mt-3 text-sm space-y-2 text-cl-text-secondary`}
        >
          <p>
            A square checkbox that shows a <strong>star icon inside</strong>{" "}
            when checked instead of the default checkmark. Uses a violet theme.
            The indeterminate state shows a dash. Demonstrates full control over
            the checked icon via{" "}
            <code
              className={`px-1 rounded bg-cl-bg-elevated`}
            >
              CheckboxIcon
            </code>
            .
          </p>
        </div>
      </Section>

      <Section title="Global Search (Basic)" isDarkMode={dark}>
        <DemoWrapper isDarkMode={dark}>
          {(() => {
            // Local state so keystrokes don't re-render the whole TableDemo
            // (which contains 30+ Table sections — that's the source of the
            // typing latency the user reported).
            const BasicSearchDemo = () => {
              const [filter, setFilter] = React.useState("");
              return (
                <div className="space-y-3">
                  <div className="relative w-full max-w-sm">
                    <div
                      className={`absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-cl-text-tertiary`}
                    >
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
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.3-4.3" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      placeholder="Search by name, email, role..."
                      className={`w-full pl-9 pr-8 py-2 text-sm rounded-cl-md focus:outline-none focus:ring-2 bg-cl-bg-elevated border-cl-border text-cl-text placeholder-fg-muted focus:ring-cl-accent/40 focus:border-cl-border-input-focus/50`}
                    />
                    {filter && (
                      <button
                        onClick={() => setFilter("")}
                        className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded cursor-pointer transition-colors text-cl-text-tertiary hover:text-cl-text`}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        >
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                  <Table
                    columns={columns}
                    data={sampleData}
                    globalFilter={filter}
                    onGlobalFilterChange={setFilter}
                    getRowId={(row) => row.id}
                    classes={s}
                  />
                </div>
              );
            };
            return <BasicSearchDemo />;
          })()}
          <p
            className={`mt-3 text-sm text-cl-text-secondary`}
          >
            External search input with left icon and clear button. Uses{" "}
            <code
              className={`px-1 rounded bg-cl-bg-elevated`}
            >
              globalFilter
            </code>{" "}
            and{" "}
            <code
              className={`px-1 rounded bg-cl-bg-elevated`}
            >
              onGlobalFilterChange
            </code>{" "}
            to filter across all columns.
          </p>
        </DemoWrapper>
      </Section>

      <Section title="Global Search (Custom Colors & Focus)" isDarkMode={dark}>
        {(() => {
          const ColorSearchDemo = () => {
            const [filter, setFilter] = React.useState("");
            return (
              <div className="space-y-3">
                <div className="relative w-full max-w-sm">
                  <input
                    type="text"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    placeholder="Search with emerald focus..."
                    className={`w-full px-4 py-2.5 text-sm border-2 rounded-cl-lg focus:outline-none bg-white border-cl-border text-cl-text placeholder-gray-400 focus:border-cl-success focus:shadow-[0_0_0_3px_rgba(16,185,129,0.15)] dark:bg-cl-bg dark:border dark:border-cl-border dark:text-cl-text dark:placeholder-gray-500 dark:focus:border-cl-success dark:focus:shadow-[0_0_0_3px_rgba(16,185,129,0.15)]`}
                  />
                  <div
                    className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${filter ? (dark ? "text-cl-success" : "text-cl-success") : dark ? "text-cl-text-secondary" : "text-cl-text-secondary"}`}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.3-4.3" />
                    </svg>
                  </div>
                </div>
                <Table
                  columns={columns}
                  data={sampleData}
                  globalFilter={filter}
                  onGlobalFilterChange={setFilter}
                  getRowId={(row) => row.id}
                  classes={s}
                />
              </div>
            );
          };
          return <ColorSearchDemo />;
        })()}
        <p
          className={`mt-3 text-sm text-cl-text-secondary`}
        >
          Search icon on the <strong>right side</strong>, thicker border (
          <code
            className={`px-1 rounded bg-cl-bg-elevated`}
          >
            border-2
          </code>
          ), rounded-cl-lg shape, and emerald focus ring with shadow glow. Icon
          changes color when input has value.
        </p>
      </Section>

      <Section title="Global Search (Minimal, No Icon)" isDarkMode={dark}>
        {(() => {
          const MinimalSearchDemo = () => {
            const [filter, setFilter] = React.useState("");
            return (
              <div className="space-y-3">
                <input
                  type="text"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  placeholder="Type to filter..."
                  className={`w-full max-w-xs px-3 py-2 text-sm border-b-2 border-t-0 border-l-0 border-r-0 rounded-none focus:outline-none bg-transparent border-cl-border text-cl-text placeholder-gray-400 focus:border-cl-border-input-focus dark:bg-transparent dark:border dark:border-cl-border dark:text-cl-text dark:placeholder-gray-600 dark:focus:border-cl-border-input-focus`}
                />
                <Table
                  columns={columns}
                  data={sampleData}
                  globalFilter={filter}
                  onGlobalFilterChange={setFilter}
                  getRowId={(row) => row.id}
                  classes={s}
                />
              </div>
            );
          };
          return <MinimalSearchDemo />;
        })()}
        <p
          className={`mt-3 text-sm text-cl-text-secondary`}
        >
          Minimal underline-style input with no icon, no border radius, and no
          background. Just a bottom border that changes color on focus. Clean
          and unobtrusive.
        </p>
      </Section>

      <Section title="Global Search (Pill Shape with Badge)" isDarkMode={dark}>
        {(() => {
          const PillSearchDemo = () => {
            const [filter, setFilter] = React.useState("");
            const matchCount = filter
              ? sampleData.filter((u) =>
                  Object.values(u).some((v) =>
                    String(v).toLowerCase().includes(filter.toLowerCase()),
                  ),
                ).length
              : sampleData.length;
            return (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="relative flex-1 max-w-md">
                    <div
                      className={`absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-cl-text-tertiary`}
                    >
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.3-4.3" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      placeholder="Filter table data..."
                      className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-full focus:outline-none focus:ring-2 bg-cl-bg-hover border-cl-border text-cl-text placeholder-gray-400 focus:ring-cl-accent/20 focus:border-cl-border-input-focus dark:bg-cl-bg-hover dark:border dark:border-cl-text/[0.08] dark:text-cl-text dark:placeholder-gray-500 dark:focus:ring-cl-accent/30 dark:focus:border-cl-border-input-focus/40`}
                    />
                    {filter && (
                      <button
                        onClick={() => setFilter("")}
                        className={`absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full cursor-pointer transition-colors text-cl-text-tertiary hover:text-cl-text-secondary hover:bg-cl-bg-hover dark:text-cl-text-tertiary dark:hover:text-cl-text-secondary dark:hover:bg-cl-bg-hover`}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        >
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${filter ? (dark ? "bg-cl-accent/15 text-cl-accent" : "bg-cl-accent/10 text-cl-accent") : dark ? "bg-cl-bg-hover text-cl-text-tertiary" : "bg-cl-bg-hover text-cl-text-tertiary"}`}
                  >
                    {matchCount} {matchCount === 1 ? "result" : "results"}
                  </span>
                </div>
                <Table
                  columns={columns}
                  data={sampleData}
                  globalFilter={filter}
                  onGlobalFilterChange={setFilter}
                  getRowId={(row) => row.id}
                  classes={s}
                />
              </div>
            );
          };
          return <PillSearchDemo />;
        })()}
        <p
          className={`mt-3 text-sm text-cl-text-secondary`}
        >
          Pill-shaped search (
          <code
            className={`px-1 rounded bg-cl-bg-elevated`}
          >
            rounded-full
          </code>
          ) with a result count badge that updates in real time. The badge
          highlights in indigo when a filter is active. Uses a subtle background
          instead of a bordered input.
        </p>
      </Section>

      <Section title="Row Expansion" isDarkMode={dark}>
        <DemoWrapper isDarkMode={dark}>
          <Table
            columns={columns}
            data={sampleData.slice(0, 5)}
            expandable
            expandedRowIds={expandedRowIds}
            onExpandedChange={setExpandedRowIds}
            renderExpandedRow={(row) => (
              <div
                className={`p-4 bg-cl-bg-hover dark:bg-cl-text/[0.03] animate-row-expand`}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span
                      className={`text-xs font-medium text-cl-text-tertiary`}
                    >
                      Name
                    </span>
                    <p
                      className={`text-sm text-cl-text`}
                    >
                      {row.name}
                    </p>
                  </div>
                  <div>
                    <span
                      className={`text-xs font-medium text-cl-text-tertiary`}
                    >
                      Email
                    </span>
                    <p
                      className={`text-sm text-cl-text`}
                    >
                      {row.email}
                    </p>
                  </div>
                  <div>
                    <span
                      className={`text-xs font-medium text-cl-text-tertiary`}
                    >
                      Department
                    </span>
                    <p
                      className={`text-sm text-cl-text`}
                    >
                      {row.department}
                    </p>
                  </div>
                  <div>
                    <span
                      className={`text-xs font-medium text-cl-text-tertiary`}
                    >
                      Join Date
                    </span>
                    <p
                      className={`text-sm text-cl-text`}
                    >
                      {row.joinDate}
                    </p>
                  </div>
                </div>
              </div>
            )}
            getRowId={(row) => row.id}
            classes={s}
          />
          <p
            className={`mt-3 text-sm text-cl-text-secondary`}
          >
            Click the expand icon to reveal row details. Expanded rows:{" "}
            <code
              className={`px-1 rounded bg-cl-bg-elevated`}
            >
              {expandedRowIds.length > 0 ? expandedRowIds.join(", ") : "none"}
            </code>
          </p>
        </DemoWrapper>
      </Section>

      <Section title="Row Expansion (Custom Chevron Icons)" isDarkMode={dark}>
        {(() => {
          const ChevronExpandDemo = () => {
            const [ids, setIds] = React.useState<string[]>([]);
            const ChevronIcon = ({
              expanded,
              className,
            }: {
              expanded: boolean;
              className?: string;
            }) => (
              <svg
                className={`${className} transition-transform duration-200 ${expanded ? "rotate-90" : ""}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            );
            return (
              <Table
                columns={columns}
                data={sampleData.slice(0, 5)}
                expandable
                expandedRowIds={ids}
                onExpandedChange={setIds}
                ExpandIcon={ChevronIcon}
                renderExpandedRow={(row) => (
                  <div
                    className="px-6 py-4 bg-cl-accent/50 border-l-2 border-cl-border-input-focus dark:bg-cl-accent/5 dark:border-l-2 dark:border-cl-border-input-focus/30"
                  >
                    <p
                      className={`text-sm text-cl-text-secondary`}
                    >
                      <strong>{row.name}</strong> works in {row.department} as a{" "}
                      {row.role}. Contact: {row.email}
                    </p>
                  </div>
                )}
                getRowId={(row) => row.id}
                classes={{
                  ...s,
                  expandIcon: dark ? "text-cl-accent" : "text-cl-accent",
                }}
              />
            );
          };
          return <ChevronExpandDemo />;
        })()}
        <p
          className={`mt-3 text-sm text-cl-text-secondary`}
        >
          Custom chevron icon that <strong>rotates 90 degrees</strong> on expand
          via CSS transition. Uses{" "}
          <code
            className={`px-1 rounded bg-cl-bg-elevated`}
          >
            ExpandIcon
          </code>{" "}
          component prop. The expanded row has a left blue border accent.
        </p>
      </Section>

      <Section title="Row Expansion (Plus/Minus Icons)" isDarkMode={dark}>
        {(() => {
          const PlusMinusDemo = () => {
            const [ids, setIds] = React.useState<string[]>([]);
            const PlusMinusIcon = ({
              expanded,
              className,
            }: {
              expanded: boolean;
              className?: string;
            }) => (
              <div
                className={`w-5 h-5 rounded border flex items-center justify-center text-xs font-bold transition-colors ${className} ${
                  expanded
                    ? dark
                      ? "bg-cl-success/20 border-cl-success/40 text-cl-success"
                      : "bg-cl-success/15 border-cl-success text-cl-success"
                    : dark
                      ? "bg-cl-bg-hover border-cl-border text-cl-text-tertiary"
                      : "bg-cl-bg-hover border-cl-border-input text-cl-text-tertiary"
                }`}
              >
                {expanded ? "−" : "+"}
              </div>
            );
            return (
              <Table
                columns={columns}
                data={sampleData.slice(0, 5)}
                expandable
                expandedRowIds={ids}
                onExpandedChange={setIds}
                ExpandIcon={PlusMinusIcon}
                renderExpandedRow={(row) => (
                  <div
                    className={`px-6 py-4 bg-cl-success/50 dark:bg-cl-success/5`}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[
                        { label: "Department", value: row.department },
                        { label: "Status", value: row.status },
                        { label: "Joined", value: row.joinDate },
                      ].map((item) => (
                        <div key={item.label}>
                          <span
                            className={`text-xs font-medium uppercase tracking-wider text-cl-text-tertiary`}
                          >
                            {item.label}
                          </span>
                          <p
                            className={`text-sm mt-0.5 text-cl-text`}
                          >
                            {item.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                getRowId={(row) => row.id}
                classes={s}
              />
            );
          };
          return <PlusMinusDemo />;
        })()}
        <p
          className={`mt-3 text-sm text-cl-text-secondary`}
        >
          Square plus/minus icons with color change on expand. The expanded
          state uses a green theme. Common in tree-view and accordion-style
          table patterns.
        </p>
      </Section>

      <Section title="Row Expansion (Right Side, Arrow Icon)" isDarkMode={dark}>
        {(() => {
          const RightExpandDemo = () => {
            const [ids, setIds] = React.useState<string[]>([]);
            const ArrowIcon = ({
              expanded,
              className,
            }: {
              expanded: boolean;
              className?: string;
            }) => (
              <svg
                className={`${className} transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            );
            return (
              <Table
                columns={columns}
                data={sampleData.slice(0, 5)}
                expandable
                expandColumnPosition="right"
                expandedRowIds={ids}
                onExpandedChange={setIds}
                ExpandIcon={ArrowIcon}
                renderExpandedRow={(row) => (
                  <div
                    className={`px-6 py-4 bg-cl-accent/50 border-r-2 border-cl-border-input-focus dark:bg-cl-accent/5 dark:border-r-2 dark:border dark:border-cl-border-input-focus/30`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold bg-cl-accent/10 text-cl-accent dark:bg-cl-accent/20 dark:text-cl-accent`}
                      >
                        {row.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <p
                          className={`text-sm font-medium text-cl-text`}
                        >
                          {row.name}
                        </p>
                        <p
                          className={`text-xs mt-0.5 text-cl-text-secondary`}
                        >
                          {row.role} in {row.department}
                        </p>
                        <p
                          className={`text-xs mt-0.5 text-cl-text-tertiary`}
                        >
                          {row.email}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                getRowId={(row) => row.id}
                classes={{
                  ...s,
                  expandIcon: dark ? "text-cl-accent" : "text-cl-accent",
                }}
              />
            );
          };
          return <RightExpandDemo />;
        })()}
        <p
          className={`mt-3 text-sm space-y-1 text-cl-text-secondary`}
        >
          <span className="block">
            Expand column placed on the <strong>right side</strong> using{" "}
            <code
              className={`px-1 rounded bg-cl-bg-elevated`}
            >
              expandColumnPosition="right"
            </code>
            . Down arrow that rotates 180 degrees on expand. Expanded row shows
            an avatar card with a right border accent.
          </span>
        </p>
      </Section>

      <Section
        title="Row Expansion (Styled Expanded Content)"
        isDarkMode={dark}
      >
        {(() => {
          const StyledExpandDemo = () => {
            const [ids, setIds] = React.useState<string[]>([]);
            return (
              <Table
                columns={columns}
                data={sampleData.slice(0, 5)}
                expandable
                expandedRowIds={ids}
                onExpandedChange={setIds}
                renderExpandedRow={(row) => (
                  <div
                    className={`px-6 py-5 bg-gradient-to-r from-cl-accent/10 to-transparent dark:bg-gradient-to-r dark:from-cl-accent/[0.06] dark:to-transparent`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-cl-lg flex items-center justify-center text-lg font-bold bg-cl-accent/10 text-cl-accent dark:bg-cl-accent/20 dark:text-cl-accent`}
                        >
                          {row.name[0]}
                        </div>
                        <div>
                          <p
                            className={`text-sm font-semibold text-cl-text`}
                          >
                            {row.name}
                          </p>
                          <p
                            className={`text-xs text-cl-text-secondary`}
                          >
                            {row.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          className={`px-3 py-1.5 text-xs font-medium rounded-cl-md cursor-pointer transition-colors bg-cl-accent/10 text-cl-accent hover:bg-cl-accent/10 dark:bg-cl-accent/15 dark:text-cl-accent dark:hover:bg-cl-accent/25`}
                          onClick={() => alert(`View profile: ${row.name}`)}
                        >
                          View Profile
                        </button>
                        <button
                          className={`px-3 py-1.5 text-xs font-medium rounded-cl-md cursor-pointer transition-colors bg-cl-bg-elevated text-cl-text-secondary hover:bg-cl-bg-elevated`}
                          onClick={() => alert(`Send email to: ${row.email}`)}
                        >
                          Send Email
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                getRowId={(row) => row.id}
                classes={{
                  ...s,
                  expandIcon: dark
                    ? "text-cl-accent hover:text-cl-accent"
                    : "text-cl-accent hover:text-cl-accent",
                  expandedRow: dark
                    ? "border-t border-cl-text/[0.04]"
                    : "border-t border-cl-border",
                }}
              />
            );
          };
          return <StyledExpandDemo />;
        })()}
        <p
          className={`mt-3 text-sm text-cl-text-secondary`}
        >
          Rich expanded row content with gradient background, avatar, action
          buttons, and custom expand icon colors via{" "}
          <code
            className={`px-1 rounded bg-cl-bg-elevated`}
          >
            classes.expandIcon
          </code>{" "}
          and{" "}
          <code
            className={`px-1 rounded bg-cl-bg-elevated`}
          >
            classes.expandedRow
          </code>
          .
        </p>
      </Section>

      <Section title="Row Expansion (Click Anywhere on Row)" isDarkMode={dark}>
        {(() => {
          const RowClickExpandDemo = () => {
            const [ids, setIds] = React.useState<string[]>([]);
            const SmallChevron = ({
              expanded,
              className,
            }: {
              expanded: boolean;
              className?: string;
            }) => (
              <svg
                className={`${className} transition-transform duration-200 ${expanded ? "rotate-90" : ""}`}
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            );
            return (
              <Table
                columns={columns}
                data={sampleData.slice(0, 5)}
                expandable
                expandOnRowClick
                expandedRowIds={ids}
                onExpandedChange={setIds}
                ExpandIcon={SmallChevron}
                renderExpandedRow={(row) => (
                  <div
                    className={`px-6 py-4 bg-cl-text/80 dark:bg-cl-text/[0.02]`}
                  >
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {[
                        { label: "Email", value: row.email },
                        { label: "Role", value: row.role },
                        { label: "Department", value: row.department },
                        { label: "Joined", value: row.joinDate },
                      ].map((item) => (
                        <div key={item.label}>
                          <span
                            className={`text-[11px] font-semibold uppercase tracking-wider text-cl-text-tertiary`}
                          >
                            {item.label}
                          </span>
                          <p
                            className={`text-sm mt-0.5 text-cl-text`}
                          >
                            {item.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                getRowId={(row) => row.id}
                classes={{
                  ...s,
                  ...s,
                  row: `${s.row} select-none`,
                  expandIcon: dark ? "text-cl-text-tertiary" : "text-cl-text-tertiary",
                }}
              />
            );
          };
          return <RowClickExpandDemo />;
        })()}
        <div
          className={`mt-3 text-sm space-y-1 text-cl-text-secondary`}
        >
          <p>
            The entire row is clickable for expansion using{" "}
            <code
              className={`px-1 rounded bg-cl-bg-elevated`}
            >
              expandOnRowClick
            </code>
            . Click anywhere on a row to toggle its expanded state. The small
            chevron icon acts as a visual indicator, not the only click target.
          </p>
          <p>
            When{" "}
            <code
              className={`px-1 rounded bg-cl-bg-elevated`}
            >
              expandOnRowClick
            </code>{" "}
            is true, it takes priority over{" "}
            <code
              className={`px-1 rounded bg-cl-bg-elevated`}
            >
              onRowClick
            </code>
            . Interactive elements (buttons, links, inputs) inside cells are
            still clickable without triggering expansion.
          </p>
        </div>
      </Section>

      <Section title="Column Visibility (Toggle Checkboxes)" isDarkMode={dark}>
        <DemoWrapper isDarkMode={dark}>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-3">
              {[
                "name",
                "email",
                "role",
                "status",
                "department",
                "joinDate",
              ].map((col) => (
                <label
                  key={col}
                  className={`flex items-center gap-1.5 text-sm cursor-pointer text-cl-text-secondary`}
                >
                  <input
                    type="checkbox"
                    checked={colVisibility[col] !== false}
                    onChange={(e) =>
                      setColVisibility((prev) => ({
                        ...prev,
                        [col]: e.target.checked,
                      }))
                    }
                    className="cursor-pointer"
                  />
                  {col}
                </label>
              ))}
            </div>
            <Table
              columns={columns}
              data={sampleData.slice(0, 5)}
              columnVisibility={colVisibility}
              onColumnVisibilityChange={setColVisibility}
              getRowId={(row) => row.id}
              classes={s}
            />
          </div>
          <p
            className={`mt-3 text-sm text-cl-text-secondary`}
          >
            Basic column visibility toggle using checkboxes. Hidden columns are
            removed from the DOM entirely.
          </p>
        </DemoWrapper>
      </Section>

      <Section title="Column Visibility (Pill Toggles)" isDarkMode={dark}>
        {(() => {
          const PillToggleDemo = () => {
            const allCols = [
              "name",
              "email",
              "role",
              "status",
              "department",
              "joinDate",
            ];
            const labels: Record<string, string> = {
              name: "Name",
              email: "Email",
              role: "Role",
              status: "Status",
              department: "Department",
              joinDate: "Join Date",
            };
            const [vis, setVis] = React.useState<Record<string, boolean>>(
              Object.fromEntries(allCols.map((c) => [c, true])),
            );
            const visibleCount = Object.values(vis).filter(Boolean).length;

            return (
              <div className="space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`text-xs font-medium uppercase tracking-wider mr-1 text-cl-text-tertiary`}
                  >
                    Columns:
                  </span>
                  {allCols.map((col) => (
                    <button
                      key={col}
                      onClick={() =>
                        setVis((prev) => ({ ...prev, [col]: !prev[col] }))
                      }
                      className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all cursor-pointer ${
                        vis[col]
                          ? dark
                            ? "bg-cl-accent/15 text-cl-accent border-cl-border-input-focus/30"
                            : "bg-cl-accent/10 text-cl-accent border-cl-border-input-focus"
                          : dark
                            ? "bg-cl-text/[0.03] text-cl-text-secondary border border-cl-text/[0.06] line-through"
                            : "bg-cl-bg-hover text-cl-text-tertiary border-cl-border line-through"
                      }`}
                    >
                      {labels[col]}
                    </button>
                  ))}
                  <span
                    className={`text-xs ml-2 text-cl-text-tertiary`}
                  >
                    {visibleCount}/{allCols.length} visible
                  </span>
                </div>
                <Table
                  columns={columns}
                  data={sampleData.slice(0, 5)}
                  columnVisibility={vis}
                  onColumnVisibilityChange={setVis}
                  getRowId={(row) => row.id}
                  classes={s}
                />
              </div>
            );
          };
          return <PillToggleDemo />;
        })()}
        <p
          className={`mt-3 text-sm text-cl-text-secondary`}
        >
          Pill-shaped toggle buttons for each column. Active columns are
          highlighted in blue, hidden columns show with strikethrough text.
          Shows a visible/total counter.
        </p>
      </Section>

      <Section title="Column Visibility (Dropdown Menu)" isDarkMode={dark}>
        {(() => {
          const DropdownToggleDemo = () => {
            const allCols = [
              "name",
              "email",
              "role",
              "status",
              "department",
              "joinDate",
            ];
            const labels: Record<string, string> = {
              name: "Name",
              email: "Email",
              role: "Role",
              status: "Status",
              department: "Department",
              joinDate: "Join Date",
            };
            const [vis, setVis] = React.useState<Record<string, boolean>>(
              Object.fromEntries(allCols.map((c) => [c, true])),
            );
            const [open, setOpen] = React.useState(false);
            const menuRef = React.useRef<HTMLDivElement>(null);

            React.useEffect(() => {
              if (!open) return;
              const handler = (e: MouseEvent) => {
                if (
                  menuRef.current &&
                  !menuRef.current.contains(e.target as Node)
                )
                  setOpen(false);
              };
              document.addEventListener("mousedown", handler);
              return () => document.removeEventListener("mousedown", handler);
            }, [open]);

            const visibleCount = Object.values(vis).filter(Boolean).length;

            return (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="relative" ref={menuRef}>
                    <button
                      onClick={() => setOpen(!open)}
                      className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-cl-md transition-colors cursor-pointer bg-white text-cl-text border-cl-border-input hover:bg-cl-bg-hover dark:bg-cl-bg-hover dark:text-cl-text-secondary dark:border dark:border-cl-text/[0.08] dark:hover:bg-cl-bg-hover`}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={dark ? "text-cl-text-tertiary" : "text-cl-text-tertiary"}
                      >
                        <rect x="3" y="3" width="7" height="7" />
                        <rect x="14" y="3" width="7" height="7" />
                        <rect x="14" y="14" width="7" height="7" />
                        <rect x="3" y="14" width="7" height="7" />
                      </svg>
                      Columns
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded-full bg-cl-accent/10 text-cl-accent dark:bg-cl-accent/15 dark:text-cl-accent`}
                      >
                        {visibleCount}
                      </span>
                    </button>
                    {open && (
                      <div
                        className={`absolute top-full left-0 mt-1 rounded-cl-md border shadow-xl overflow-hidden min-w-[180px] z-50 bg-cl-bg border-cl-border`}
                      >
                        <div
                          className={`px-3 py-2 border-b border-cl-border`}
                        >
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-xs font-medium text-cl-text-secondary`}
                            >
                              Toggle columns
                            </span>
                            <button
                              onClick={() =>
                                setVis(
                                  Object.fromEntries(
                                    allCols.map((c) => [c, true]),
                                  ),
                                )
                              }
                              className={`text-xs cursor-pointer text-cl-accent hover:text-cl-accent dark:text-cl-accent dark:hover:text-cl-accent`}
                            >
                              Show all
                            </button>
                          </div>
                        </div>
                        {allCols.map((col) => (
                          <button
                            key={col}
                            onClick={() =>
                              setVis((prev) => ({ ...prev, [col]: !prev[col] }))
                            }
                            className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors cursor-pointer hover:bg-cl-bg-hover dark:hover:bg-cl-bg-hover`}
                          >
                            <div
                              className={`w-4 h-4 rounded border flex items-center justify-center ${vis[col] ? (dark ? "bg-cl-accent border-cl-border-input-focus" : "bg-cl-accent border-cl-border-input-focus") : dark ? "border-cl-border" : "border-cl-border-input"}`}
                            >
                              {vis[col] && (
                                <svg
                                  width="10"
                                  height="10"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="white"
                                  strokeWidth="3"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                            <span
                              className={
                                vis[col]
                                  ? dark
                                    ? "text-cl-text"
                                    : "text-cl-text"
                                  : dark
                                    ? "text-cl-text-tertiary"
                                    : "text-cl-text-tertiary"
                              }
                            >
                              {labels[col]}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() =>
                      setVis(Object.fromEntries(allCols.map((c) => [c, true])))
                    }
                    className={`text-xs cursor-pointer text-cl-text-tertiary hover:text-cl-text`}
                  >
                    Reset
                  </button>
                </div>
                <Table
                  columns={columns}
                  data={sampleData.slice(0, 5)}
                  columnVisibility={vis}
                  onColumnVisibilityChange={setVis}
                  getRowId={(row) => row.id}
                  classes={s}
                />
              </div>
            );
          };
          return <DropdownToggleDemo />;
        })()}
        <p
          className={`mt-3 text-sm text-cl-text-secondary`}
        >
          A dropdown menu button with custom checkboxes, column count badge,
          "Show all" link, and external "Reset" button. Common SaaS pattern for
          data-heavy tables where horizontal space is limited.
        </p>
      </Section>

      <Section title="Column Visibility (Switch Toggles)" isDarkMode={dark}>
        {(() => {
          const SwitchToggleDemo = () => {
            const allCols = [
              "name",
              "email",
              "role",
              "status",
              "department",
              "joinDate",
            ];
            const labels: Record<string, string> = {
              name: "Name",
              email: "Email",
              role: "Role",
              status: "Status",
              department: "Department",
              joinDate: "Join Date",
            };
            const [vis, setVis] = React.useState<Record<string, boolean>>(
              Object.fromEntries(allCols.map((c) => [c, true])),
            );

            return (
              <div className="space-y-3">
                <div
 className={`rounded-cl-lg p-4 border-cl-border bg-cl-bg-elevated`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-xs font-semibold uppercase tracking-wider text-cl-text-secondary`}
                    >
                      Visible Columns
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          setVis(
                            Object.fromEntries(allCols.map((c) => [c, true])),
                          )
                        }
                        className={`text-xs cursor-pointer px-2 py-1 rounded text-cl-accent hover:bg-cl-bg-elevated`}
                      >
                        All on
                      </button>
                      <button
                        onClick={() =>
                          setVis(
                            Object.fromEntries(
                              allCols.map((c) => [c, c === "name"]),
                            ),
                          )
                        }
                        className={`text-xs cursor-pointer px-2 py-1 rounded text-cl-text-tertiary hover:bg-cl-bg-hover dark:text-cl-text-tertiary dark:hover:bg-cl-bg-hover`}
                      >
                        Minimal
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {allCols.map((col) => (
                      <button
                        key={col}
                        onClick={() =>
                          setVis((prev) => ({ ...prev, [col]: !prev[col] }))
                        }
                        className={`flex items-center justify-between gap-2 px-3 py-2 rounded-cl-md text-sm transition-all cursor-pointer ${
                          vis[col]
                            ? dark
                              ? "bg-cl-accent/10 text-cl-accent"
                              : "bg-cl-accent/10 text-cl-accent"
                            : dark
                              ? "bg-cl-text/[0.02] text-cl-text-tertiary"
                              : "bg-white text-cl-text-tertiary"
                        }`}
                      >
                        <span>{labels[col]}</span>
                        <div
                          className={`w-8 h-4.5 rounded-full relative transition-colors ${vis[col] ? (dark ? "bg-cl-accent" : "bg-cl-accent") : dark ? "bg-cl-bg-elevated" : "bg-cl-bg-hover"}`}
                        >
                          <div
                            className={`absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white shadow transition-transform ${vis[col] ? "translate-x-4" : "translate-x-0.5"}`}
                          />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                <Table
                  columns={columns}
                  data={sampleData.slice(0, 5)}
                  columnVisibility={vis}
                  onColumnVisibilityChange={setVis}
                  getRowId={(row) => row.id}
                  classes={s}
                />
              </div>
            );
          };
          return <SwitchToggleDemo />;
        })()}
        <p
          className={`mt-3 text-sm text-cl-text-secondary`}
        >
          Switch-style toggles in a card panel with "All on" and "Minimal"
          presets. Each column has a mini toggle switch that visually indicates
          on/off state. Grid layout for clean presentation.
        </p>
      </Section>

      <Section title="Striped Rows (Default)" isDarkMode={dark}>
        <DemoWrapper isDarkMode={dark}>
          <Table
            columns={columns}
            data={sampleData.slice(0, 6)}
            striped
            stripedClassName="bg-cl-bg-elevated dark:bg-cl-text/[0.03]"
            getRowId={(row) => row.id}
            classes={s}
          />
          <p
            className={`mt-3 text-sm text-cl-text-secondary`}
          >
            Default striped rows with{" "}
            <code
              className={`px-1 rounded bg-cl-bg-elevated`}
            >
              striped
            </code>{" "}
            prop. Alternating rows get a subtle gray background for improved
            readability on large datasets.
          </p>
        </DemoWrapper>
      </Section>

      <Section title="Striped Rows (Custom Colors)" isDarkMode={dark}>
        {(() => {
          // Use bracketed arbitrary opacity values (Tailwind requires
          // /[0.06] for non-preset alphas — `/0.06` is silently dropped).
          // Same alpha for both modes: a tint that reads on light and dark.
          const colors = [
            { label: "Blue", className: "bg-cl-accent/[0.10] dark:bg-cl-accent/[0.10]" },
            { label: "Emerald", className: "bg-cl-success/[0.12] dark:bg-cl-success/[0.10]" },
            { label: "Amber", className: "bg-cl-warning/[0.12] dark:bg-cl-warning/[0.10]" },
            { label: "Rose", className: "bg-cl-error/[0.10] dark:bg-cl-error/[0.10]" },
            { label: "Violet", className: "bg-violet-500/[0.10] dark:bg-violet-500/[0.10]" },
          ];
          const CustomColorStripedDemo = () => {
            const [activeColor, setActiveColor] = React.useState(0);
            return (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-medium uppercase tracking-wider text-cl-text-tertiary`}
                  >
                    Stripe color:
                  </span>
                  {colors.map((c, i) => (
                    <button
                      key={c.label}
                      onClick={() => setActiveColor(i)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer border ${
                        activeColor === i
                          ? "bg-cl-accent text-white border-cl-accent"
                          : "bg-cl-bg-elevated text-cl-text-secondary border-cl-border hover:bg-cl-bg-hover dark:bg-cl-text/[0.03] dark:text-cl-text-tertiary dark:border-cl-text/[0.06]"
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
                <Table
                  columns={columns}
                  data={sampleData.slice(0, 6)}
                  striped
                  stripedClassName={colors[activeColor].className}
                  getRowId={(row) => row.id}
                  classes={s}
                />
              </div>
            );
          };
          return <CustomColorStripedDemo />;
        })()}
        <p
          className={`mt-3 text-sm text-cl-text-secondary`}
        >
          Use{" "}
          <code
            className={`px-1 rounded bg-cl-bg-elevated`}
          >
            stripedClassName
          </code>{" "}
          to set any custom background color for striped rows. Click the color
          buttons above to switch between themes.
        </p>
      </Section>

      <Section
        title="Striped Rows (Bold Stripes with Border)"
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <Table
            columns={columns}
            data={sampleData.slice(0, 6)}
            striped
            stripedClassName={
              dark
                ? "bg-cl-accent/10 border-l-2 border-l-accent/40"
                : "bg-cl-accent/10 border-l-2 border-l-accent"
            }
            getRowId={(row) => row.id}
            classes={s}
          />
          <p
            className={`mt-3 text-sm text-cl-text-secondary`}
          >
            Striped rows with a <strong>left border accent</strong> and stronger
            background tint. Combines{" "}
            <code
              className={`px-1 rounded bg-cl-bg-elevated`}
            >
              bg-cl-accent/10
            </code>{" "}
            with{" "}
            <code
              className={`px-1 rounded bg-cl-bg-elevated`}
            >
              border-l-2 border-l-accent
            </code>{" "}
            for visual emphasis.
          </p>
        </DemoWrapper>
      </Section>

      <Section title="Striped Rows (Hover Interaction)" isDarkMode={dark}>
        <DemoWrapper isDarkMode={dark}>
          <Table
            columns={columns}
            data={sampleData.slice(0, 6)}
            striped
            stripedClassName={dark ? "bg-cl-text/[0.03]" : "bg-cl-bg-hover"}
            getRowId={(row) => row.id}
            classes={{
              ...s,
              ...s,
              row: `border-b transition-colors data-[clickable]:cursor-pointer border-cl-border hover:bg-cl-accent/10 dark:border-cl-text/[0.04] dark:hover:bg-cl-accent/10`,
            }}
            onRowClick={(row) => alert(`Clicked: ${(row as User).name}`)}
          />
          <p
            className={`mt-3 text-sm text-cl-text-secondary`}
          >
            Striped rows combined with a <strong>blue hover effect</strong>.
            Both striped and non-striped rows highlight on hover, but the
            contrast difference makes the table feel more interactive. Rows are
            clickable in this demo.
          </p>
        </DemoWrapper>
      </Section>

      <Section
        title="Striped Rows (CSS-only via data-striped)"
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <Table
            columns={columns}
            data={sampleData.slice(0, 6)}
            striped
            stripedClassName=""
            getRowId={(row) => row.id}
            classes={{
              ...s,
              ...s,
              row: `border-b transition-colors border-cl-border hover:bg-cl-bg-hover [&[data-striped]]:bg-gradient-to-r [&[data-striped]]:from-cl-accent/10 [&[data-striped]]:to-transparent dark:border-cl-text/[0.04] dark:hover:bg-cl-bg-hover dark:[&[data-striped]]:bg-gradient-to-r dark:[&[data-striped]]:from-cl-accent/0.04 dark:[&[data-striped]]:to-transparent`,
            }}
          />
          <p
            className={`mt-3 text-sm text-cl-text-secondary`}
          >
            No{" "}
            <code
              className={`px-1 rounded bg-cl-bg-elevated`}
            >
              stripedClassName
            </code>{" "}
            needed. Instead, uses the{" "}
            <code
              className={`px-1 rounded bg-cl-bg-elevated`}
            >
              data-striped
            </code>{" "}
            attribute on rows to apply a <strong>gradient stripe</strong> via
            CSS selectors in{" "}
            <code
              className={`px-1 rounded bg-cl-bg-elevated`}
            >
              rowClassName
            </code>
            . This approach gives you full CSS control without any extra props.
          </p>
        </DemoWrapper>
      </Section>

      <Section title="Density Modes" isDarkMode={dark}>
        <DemoWrapper isDarkMode={dark}>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {(["compact", "comfortable", "spacious"] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDensity(d)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer ${
                    density === d
                      ? "bg-cl-accent text-white"
                      : dark
                        ? "bg-cl-bg-elevated text-cl-text-secondary hover:bg-cl-bg-elevated"
                        : "bg-cl-bg-hover text-cl-text hover:bg-cl-bg-hover"
                  }`}
                >
                  {d.charAt(0).toUpperCase() + d.slice(1)}
                </button>
              ))}
            </div>
            <Table
              columns={columns}
              data={sampleData.slice(0, 5)}
              density={density}
              getRowId={(row) => row.id}
              classes={s}
            />
          </div>
          <p
            className={`mt-3 text-sm text-cl-text-secondary`}
          >
            Current density:{" "}
            <code
              className={`px-1 rounded bg-cl-bg-elevated`}
            >
              {density}
            </code>
            . This controls cell padding: compact (tight), comfortable
            (default), spacious (generous).
          </p>
        </DemoWrapper>
      </Section>

      <Section title="Right Column Pinning" isDarkMode={dark}>
        <DemoWrapper isDarkMode={dark}>
          <Table
            columns={rightPinColumns}
            data={sampleData.slice(0, 5)}
            pinnedRightColumns={["actions"]}
            getRowId={(row) => row.id}
            maxWidth={600}
            classes={{
              ...s,
              ...s,
              container: `border rounded-cl-md border-cl-border`,
              table: "w-max border-collapse",
              pinnedRightContainer: `shrink-0 sticky right-0 z-20 border-l-2 border-cl-border-input-focus bg-cl-bg-elevated`,
            }}
          />
          <p
            className={`mt-3 text-sm text-cl-text-secondary`}
          >
            The "Actions" column is pinned to the right using{" "}
            <code
              className={`px-1 rounded bg-cl-bg-elevated`}
            >
              pinnedRightColumns={'{["actions"]}'}
            </code>
            . Scroll horizontally to see it stay fixed.
          </p>
        </DemoWrapper>
      </Section>

      <Section title="Column Resizing (Basic)" isDarkMode={dark}>
        <DemoWrapper isDarkMode={dark}>
          <div
            className={`overflow-x-auto rounded-cl-md border-cl-border`}
          >
            <Table
              columns={columns}
              data={sampleData.slice(0, 5)}
              enableColumnResizing
              getRowId={(row) => row.id}
              classes={{
                ...s,
                ...s,
                container: "",
                cell: `${s.cell} overflow-hidden text-ellipsis`,
              }}
            />
          </div>
          <p
            className={`mt-3 text-sm text-cl-text-secondary`}
          >
            Drag the right edge of any column header to resize. Hover over the
            column border to see the resize handle appear. The table scrolls
            horizontally if columns exceed the container width.
          </p>
        </DemoWrapper>
      </Section>

      <Section title="Column Resizing (Custom Handle Style)" isDarkMode={dark}>
        {(() => {
          const CustomHandleDemo = () => (
            <div
              className={`overflow-x-auto rounded-cl-md border-cl-border`}
            >
              <Table
                columns={columns}
                data={sampleData.slice(0, 5)}
                enableColumnResizing
                getRowId={(row) => row.id}
                classes={{
                  ...s,
                  ...s,
                  container: "",
                  cell: `${s.cell} overflow-hidden text-ellipsis`,
                  resizeHandle:
                    "[&>div]:bg-cl-success [&>div]:opacity-100 [&>div]:w-1 [&>div]:h-full [&>div]:rounded-none",
                }}
              />
            </div>
          );
          return <CustomHandleDemo />;
        })()}
        <p
          className={`mt-3 text-sm text-cl-text-secondary`}
        >
          Custom resize handle styled via{" "}
          <code
            className={`px-1 rounded bg-cl-bg-elevated`}
          >
            classes.resizeHandle
          </code>
          . This example uses a full-height emerald bar that's always visible,
          instead of the default subtle indicator.
        </p>
      </Section>

      <Section
        title="Column Resizing (Controlled with Size Display)"
        isDarkMode={dark}
      >
        {(() => {
          const ControlledResizeDemo = () => {
            const [sizing, setSizing] = React.useState<Record<string, number>>(
              {},
            );
            const colNames = [
              "name",
              "email",
              "role",
              "status",
              "department",
              "joinDate",
            ];
            return (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {colNames.map((col) => (
                    <span
                      key={col}
                      className={`text-xs px-2 py-1 rounded-cl-md font-mono bg-cl-bg-hover text-cl-text-secondary dark:bg-cl-bg-hover dark:text-cl-text-tertiary`}
                    >
                      {col}:{" "}
                      {sizing[col] ? `${Math.round(sizing[col])}px` : "auto"}
                    </span>
                  ))}
                  {Object.keys(sizing).length > 0 && (
                    <button
                      onClick={() => setSizing({})}
                      className={`text-xs px-2 py-1 rounded-cl-md cursor-pointer text-cl-accent hover:bg-cl-bg-elevated`}
                    >
                      Reset
                    </button>
                  )}
                </div>
                <div
                  className={`overflow-x-auto rounded-cl-md border-cl-border`}
                >
                  <Table
                    columns={columns}
                    data={sampleData.slice(0, 5)}
                    enableColumnResizing
                    columnSizing={sizing}
                    onColumnSizingChange={setSizing}
                    getRowId={(row) => row.id}
                    classes={{
                      ...s,
                      ...s,
                      container: "",
                      cell: `${s.cell} overflow-hidden text-ellipsis`,
                    }}
                  />
                </div>
              </div>
            );
          };
          return <ControlledResizeDemo />;
        })()}
        <p
          className={`mt-3 text-sm text-cl-text-secondary`}
        >
          Controlled column sizing via{" "}
          <code
            className={`px-1 rounded bg-cl-bg-elevated`}
          >
            columnSizing
          </code>{" "}
          and{" "}
          <code
            className={`px-1 rounded bg-cl-bg-elevated`}
          >
            onColumnSizingChange
          </code>
          . The badges above show each column's current pixel width in real
          time. Click "Reset" to restore defaults. You could persist these sizes
          to localStorage for user preferences.
        </p>
      </Section>

      <Section title="Column Resizing (With Initial Sizes)" isDarkMode={dark}>
        {(() => {
          const InitialSizeDemo = () => {
            const sized = useMemo<ColumnDef<User>[]>(
              () => [
                {
                  accessorKey: "name",
                  header: () => <span>Name</span>,
                  size: 200,
                  minSize: 100,
                  maxSize: 400,
                  cell: ({ row }) => (
                    <span className="font-medium">{row.getValue("name")}</span>
                  ),
                },
                {
                  accessorKey: "email",
                  header: () => <span>Email</span>,
                  size: 250,
                  minSize: 150,
                },
                {
                  accessorKey: "role",
                  header: () => <span>Role</span>,
                  size: 100,
                  minSize: 80,
                  maxSize: 200,
                },
                {
                  accessorKey: "status",
                  header: () => <span>Status</span>,
                  size: 120,
                  enableResizing: false,
                  cell: ({ row }) => (
                    <StatusBadge status={row.getValue("status")} dark={dark} />
                  ),
                },
                {
                  accessorKey: "department",
                  header: () => <span>Department</span>,
                  size: 150,
                },
              ],
              // eslint-disable-next-line react-hooks/exhaustive-deps -- dark triggers theme-aware column re-creation
              [dark],
            );

            return (
              <div
                className={`overflow-x-auto rounded-cl-md border-cl-border`}
              >
                <Table
                  columns={sized}
                  data={sampleData.slice(0, 5)}
                  enableColumnResizing
                  getRowId={(row) => row.id}
                  classes={{
                    ...s,
                    ...s,
                    container: "",
                    cell: `${s.cell} overflow-hidden text-ellipsis`,
                  }}
                />
              </div>
            );
          };
          return <InitialSizeDemo />;
        })()}
        <div
          className={`mt-3 text-sm space-y-1 text-cl-text-secondary`}
        >
          <p>
            Columns with preset{" "}
            <code
              className={`px-1 rounded bg-cl-bg-elevated`}
            >
              size
            </code>
            ,{" "}
            <code
              className={`px-1 rounded bg-cl-bg-elevated`}
            >
              minSize
            </code>
            , and{" "}
            <code
              className={`px-1 rounded bg-cl-bg-elevated`}
            >
              maxSize
            </code>{" "}
            via TanStack ColumnDef. The "Status" column has{" "}
            <code
              className={`px-1 rounded bg-cl-bg-elevated`}
            >
              enableResizing: false
            </code>{" "}
            so it cannot be resized (no handle appears).
          </p>
        </div>
      </Section>

      <Section title="Inline Cell Editing" isDarkMode={dark}>
        <DemoWrapper isDarkMode={dark}>
          <div className="space-y-3">
            <Table
              columns={sortableColumns}
              data={editableData}
              editable
              editableColumns={["name", "email", "role"]}
              onCellEdit={(rowId, columnId, value) => {
                setEditedCells((prev) => [...prev, { rowId, columnId, value }]);
                setEditableData((prev) =>
                  prev.map((row) =>
                    row.id === rowId
                      ? { ...row, [columnId]: value as string }
                      : row,
                  ),
                );
              }}
              getRowId={(row) => row.id}
              classes={s}
            />
            {editedCells.length > 0 && (
              <div
                className={`text-sm text-cl-text-secondary`}
              >
                <p className="font-medium">Edited cells:</p>
                <ul className="list-disc list-inside ml-2">
                  {editedCells.slice(-5).map((c, i) => (
                    <li key={i}>
                      Row {c.rowId}, column "{c.columnId}" = "{String(c.value)}"
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <p
            className={`mt-3 text-sm text-cl-text-secondary`}
          >
            Double-click a cell in the Name, Email, or Role columns to edit
            inline. Press Enter to save, Escape to cancel.
          </p>
        </DemoWrapper>
      </Section>

      <Section title="CSV Export" isDarkMode={dark}>
        <DemoWrapper isDarkMode={dark}>
          <div className="space-y-3">
            <button
              onClick={() =>
                exportTableToCSV(sampleData, columns, "users-export")
              }
              className={`px-4 py-2 text-sm font-medium rounded-cl-md transition-colors cursor-pointer text-cl-bg bg-cl-success hover:bg-cl-success dark:text-cl-bg dark:bg-cl-success dark:hover:bg-cl-success/30`}
            >
              Export to CSV
            </button>
            <Table
              columns={columns}
              data={sampleData}
              getRowId={(row) => row.id}
              classes={s}
            />
          </div>
          <p
            className={`mt-3 text-sm text-cl-text-secondary`}
          >
            Click "Export to CSV" to download the table data. Uses the{" "}
            <code
              className={`px-1 rounded bg-cl-bg-elevated`}
            >
              exportTableToCSV
            </code>{" "}
            utility function from the Table package.
          </p>
        </DemoWrapper>
      </Section>

      <Section title="Row Drag & Drop (Default)" isDarkMode={dark}>
        <DemoWrapper isDarkMode={dark}>
          <Table
            columns={columns}
            data={dragDropData}
            enableRowDragDrop
            onRowReorder={(fromIndex, toIndex) => {
              setDragDropData((prev) => {
                const updated = [...prev];
                const [moved] = updated.splice(fromIndex, 1);
                updated.splice(toIndex, 0, moved);
                return updated;
              });
            }}
            getRowId={(row) => row.id}
            classes={s}
          />
          <p
            className={`mt-3 text-sm text-cl-text-secondary`}
          >
            Drag rows using the grip handle on the left to reorder. Current
            order: {dragDropData.map((d) => d.name).join(", ")}
          </p>
        </DemoWrapper>
      </Section>

      <Section title="Row Drag & Drop (Custom Arrow Icons)" isDarkMode={dark}>
        {(() => {
          const ArrowDragDemo = () => {
            const [data, setData] = React.useState(sampleData.slice(0, 5));
            const ArrowHandle = ({ className }: { className?: string }) => (
              <div
                className={`flex flex-col items-center gap-0.5 ${className}`}
              >
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={dark ? "text-cl-text-tertiary" : "text-cl-text-tertiary"}
                >
                  <path d="M12 5l-5 5h10z" />
                </svg>
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={dark ? "text-cl-text-tertiary" : "text-cl-text-tertiary"}
                >
                  <path d="M12 19l5-5H7z" />
                </svg>
              </div>
            );
            return (
              <div className="space-y-3">
                <Table
                  columns={columns}
                  data={data}
                  enableRowDragDrop
                  DragHandleIcon={ArrowHandle}
                  onRowReorder={(from, to) => {
                    setData((prev) => {
                      const u = [...prev];
                      const [m] = u.splice(from, 1);
                      u.splice(to, 0, m);
                      return u;
                    });
                  }}
                  getRowId={(row) => row.id}
                  classes={{
                    ...s,
                    dragHandle: dark
                      ? "text-cl-text-tertiary hover:text-cl-text-secondary"
                      : "text-cl-text-tertiary hover:text-cl-text-secondary",
                  }}
                />
                <div
                  className={`flex items-center gap-2 text-xs text-cl-text-tertiary`}
                >
                  <span className="font-medium">Order:</span>
                  {data.map((d, i) => (
                    <span
                      key={d.id}
                      className={`px-2 py-0.5 rounded bg-cl-bg-hover dark:bg-cl-bg-hover`}
                    >
                      {i + 1}. {d.name}
                    </span>
                  ))}
                </div>
              </div>
            );
          };
          return <ArrowDragDemo />;
        })()}
        <p
          className={`mt-3 text-sm text-cl-text-secondary`}
        >
          Custom up/down arrow icons via{" "}
          <code
            className={`px-1 rounded bg-cl-bg-elevated`}
          >
            DragHandleIcon
          </code>{" "}
          prop. Styled via{" "}
          <code
            className={`px-1 rounded bg-cl-bg-elevated`}
          >
            classes.dragHandle
          </code>{" "}
          for hover color.
        </p>
      </Section>

      <Section
        title="Row Drag & Drop (Number Handle with Reorder History)"
        isDarkMode={dark}
      >
        {(() => {
          const NumberDragDemo = () => {
            const [data, setData] = React.useState(sampleData.slice(0, 5));
            const [history, setHistory] = React.useState<string[]>([]);
            const NumberHandle = ({ className }: { className?: string }) => {
              return (
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${className} bg-cl-accent/10 text-cl-accent border-cl-border-input-focus dark:bg-cl-accent/20 dark:text-cl-accent dark:border dark:border-cl-border-input-focus/30`}
                >
                  ≡
                </div>
              );
            };
            return (
              <div className="space-y-3">
                <Table
                  columns={columns}
                  data={data}
                  enableRowDragDrop
                  DragHandleIcon={NumberHandle}
                  onRowReorder={(from, to) => {
                    const name = data[from].name;
                    setHistory((prev) => [
                      ...prev,
                      `${name}: ${from + 1} → ${to + 1}`,
                    ]);
                    setData((prev) => {
                      const u = [...prev];
                      const [m] = u.splice(from, 1);
                      u.splice(to, 0, m);
                      return u;
                    });
                  }}
                  getRowId={(row) => row.id}
                  classes={s}
                />
                {history.length > 0 && (
                  <div
 className={`rounded-cl-md p-3 border-cl-border bg-cl-bg-elevated`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`text-xs font-semibold uppercase tracking-wider text-cl-text-secondary`}
                      >
                        Reorder History
                      </span>
                      <button
                        onClick={() => setHistory([])}
                        className={`text-xs cursor-pointer text-cl-text-tertiary hover:text-cl-text`}
                      >
                        Clear
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {history.map((h, i) => (
                        <span
                          key={i}
                          className={`text-xs px-2 py-1 rounded-cl-md bg-cl-accent/10 text-cl-accent dark:bg-cl-accent/10 dark:text-cl-accent`}
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          };
          return <NumberDragDemo />;
        })()}
        <p
          className={`mt-3 text-sm text-cl-text-secondary`}
        >
          Custom round handle icon with a reorder history log showing every
          move. Useful for undo/audit trail patterns.
        </p>
      </Section>

      <Section title="Row Drag & Drop (Styled Drag State)" isDarkMode={dark}>
        {(() => {
          const StyledDragDemo = () => {
            const [data, setData] = React.useState(sampleData.slice(0, 5));
            return (
              <Table
                columns={columns}
                data={data}
                enableRowDragDrop
                onRowReorder={(from, to) => {
                  setData((prev) => {
                    const u = [...prev];
                    const [m] = u.splice(from, 1);
                    u.splice(to, 0, m);
                    return u;
                  });
                }}
                getRowId={(row) => row.id}
                classes={{
                  ...s,
                  row: `border-b transition-all data-[clickable]:cursor-pointer border-cl-border hover:bg-cl-bg-hover dark:border-cl-text/[0.04] dark:hover:bg-cl-bg-hover [&[draggable]]:cursor-grab [&[draggable]]:active:cursor-grabbing`,
                  dragHandle: `text-cl-accent hover:text-cl-accent dark:text-cl-accent dark:hover:text-cl-accent transition-colors`,
                }}
              />
            );
          };
          return <StyledDragDemo />;
        })()}
        <p
          className={`mt-3 text-sm text-cl-text-secondary`}
        >
          Custom drag handle color (blue theme) and grab/grabbing cursor states
          on draggable rows via{" "}
          <code
            className={`px-1 rounded bg-cl-bg-elevated`}
          >
            rowClassName
          </code>{" "}
          selectors. Uses{" "}
          <code
            className={`px-1 rounded bg-cl-bg-elevated`}
          >
            [&[draggable]]:cursor-grab
          </code>{" "}
          for native cursor feedback.
        </p>
      </Section>

      <Section title="Row Drag & Drop (With Row Numbers)" isDarkMode={dark}>
        {(() => {
          const NumberedDragDemo = () => {
            const [data, setData] = React.useState(sampleData.slice(0, 5));
            const numberedColumns: ColumnDef<User>[] = useMemo(
              () => [
                {
                  id: "rank",
                  header: () => <span>#</span>,
                  cell: ({ row }) => (
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-cl-warning/15 text-cl-warning dark:bg-cl-warning/15 dark:text-cl-warning`}
                    >
                      {row.index + 1}
                    </span>
                  ),
                  size: 50,
                  enableSorting: false,
                },
                ...columns,
              ],
              // eslint-disable-next-line react-hooks/exhaustive-deps -- dark triggers theme-aware column re-creation
              [dark],
            );

            return (
              <Table
                columns={numberedColumns}
                data={data}
                enableRowDragDrop
                onRowReorder={(from, to) => {
                  setData((prev) => {
                    const u = [...prev];
                    const [m] = u.splice(from, 1);
                    u.splice(to, 0, m);
                    return u;
                  });
                }}
                getRowId={(row) => row.id}
                classes={s}
              />
            );
          };
          return <NumberedDragDemo />;
        })()}
        <p
          className={`mt-3 text-sm text-cl-text-secondary`}
        >
          Drag handle + a rank number column that updates automatically as rows
          are reordered. The numbers reflect the current visual order, not the
          original data order. Useful for priority lists and ranked items.
        </p>
      </Section>

      <Section title="Row Drag & Drop (Handle on Right)" isDarkMode={dark}>
        {(() => {
          const RightDragDemo = () => {
            const [data, setData] = React.useState(sampleData.slice(0, 5));
            return (
              <Table
                columns={columns}
                data={data}
                enableRowDragDrop
                dragColumnPosition="right"
                onRowReorder={(from, to) => {
                  setData((prev) => {
                    const u = [...prev];
                    const [m] = u.splice(from, 1);
                    u.splice(to, 0, m);
                    return u;
                  });
                }}
                getRowId={(row) => row.id}
                classes={{
                  ...s,
                  dragHandle: dark
                    ? "text-cl-text-tertiary hover:text-cl-text-secondary"
                    : "text-cl-text-tertiary hover:text-cl-text-secondary",
                }}
              />
            );
          };
          return <RightDragDemo />;
        })()}
        <p
          className={`mt-3 text-sm text-cl-text-secondary`}
        >
          Drag handle placed on the <strong>right side</strong> using{" "}
          <code
            className={`px-1 rounded bg-cl-bg-elevated`}
          >
            dragColumnPosition="right"
          </code>
          . Useful when the left side is reserved for selection checkboxes or
          row numbers.
        </p>
      </Section>

      <Section title="Footer / Summary Row" isDarkMode={dark}>
        <DemoWrapper isDarkMode={dark}>
          <Table
            columns={footerColumns}
            data={extendedSampleData.slice(0, 6)}
            showFooter
            footerContent={
              <tr
                className={`border-t-2 border-cl-border-input bg-cl-bg-hover dark:border dark:border-cl-text/[0.1] dark:bg-cl-text/[0.03]`}
              >
                <td
                  colSpan={100}
                  className={`px-4 py-3 text-cl-text-secondary`}
                >
                  <div className="flex items-center gap-6 text-sm">
                    <span className="font-semibold">
                      Total: {extendedSampleData.slice(0, 6).length} employees
                    </span>
                    <span>
                      {
                        new Set(
                          extendedSampleData
                            .slice(0, 6)
                            .map((d) => d.department),
                        ).size
                      }{" "}
                      departments
                    </span>
                    <span className="font-semibold">
                      $
                      {extendedSampleData
                        .slice(0, 6)
                        .reduce((sum, d) => sum + d.salary, 0)
                        .toLocaleString()}
                    </span>
                    <span className="font-semibold">
                      {extendedSampleData
                        .slice(0, 6)
                        .reduce((sum, d) => sum + d.projects, 0)}{" "}
                      projects
                    </span>
                  </div>
                </td>
              </tr>
            }
            getRowId={(row) => row.id}
            classes={s}
          />
          <p
            className={`mt-3 text-sm text-cl-text-secondary`}
          >
            Set{" "}
            <code
              className={`px-1 rounded bg-cl-bg-elevated`}
            >
              showFooter
            </code>{" "}
            and provide{" "}
            <code
              className={`px-1 rounded bg-cl-bg-elevated`}
            >
              footerContent
            </code>{" "}
            with summary rows showing totals and counts.
          </p>
        </DemoWrapper>
      </Section>

      <Section title="Footer (Column-Aligned Totals)" isDarkMode={dark}>
        {(() => {
          const data = sampleData.slice(0, 6);
          return (
            <Table
              columns={columns}
              data={data}
              showFooter
              footerContent={
                <>
                  <tr
                    className={`border-t-2 border-cl-border-input bg-cl-bg-hover dark:border dark:border-cl-text/[0.1] dark:bg-cl-text/[0.03]`}
                  >
                    <td
                      className={`px-4 py-2.5 text-sm font-semibold text-cl-text`}
                    >
                      Totals
                    </td>
                    <td
                      className={`px-4 py-2.5 text-sm text-cl-text-secondary`}
                    >
                      {data.length} rows
                    </td>
                    <td
                      className={`px-4 py-2.5 text-sm text-cl-text-secondary`}
                    >
                      {new Set(data.map((d) => d.role)).size} roles
                    </td>
                    <td
                      className={`px-4 py-2.5 text-sm font-semibold text-cl-success`}
                    >
                      {data.filter((d) => d.status === "active").length} active
                    </td>
                    <td
                      className={`px-4 py-2.5 text-sm text-cl-text-secondary`}
                    >
                      {new Set(data.map((d) => d.department)).size} depts
                    </td>
                    <td
                      className={`px-4 py-2.5 text-sm text-cl-text-secondary`}
                    ></td>
                  </tr>
                  <tr className={dark ? "bg-cl-text/[0.02]" : "bg-cl-text/50"}>
                    <td
                      className={`px-4 py-2 text-xs text-cl-text-tertiary`}
                    >
                      Summary
                    </td>
                    <td
                      className={`px-4 py-2 text-xs text-cl-text-tertiary`}
                    ></td>
                    <td
                      className={`px-4 py-2 text-xs text-cl-text-tertiary`}
                    ></td>
                    <td
                      className={`px-4 py-2 text-xs text-cl-text-tertiary`}
                    >
                      {data.filter((d) => d.status === "inactive").length}{" "}
                      inactive
                    </td>
                    <td
                      className={`px-4 py-2 text-xs text-cl-text-tertiary`}
                    ></td>
                    <td
                      className={`px-4 py-2 text-xs text-cl-text-tertiary`}
                    ></td>
                  </tr>
                </>
              }
              getRowId={(row) => row.id}
              classes={s}
            />
          );
        })()}
        <p
          className={`mt-3 text-sm text-cl-text-secondary`}
        >
          Footer with <strong>column-aligned totals and averages</strong> in two
          rows. Each{" "}
          <code
            className={`px-1 rounded bg-cl-bg-elevated`}
          >
            &lt;td&gt;
          </code>{" "}
          aligns under its column. Salary and projects are color-highlighted.
        </p>
      </Section>

      <Section title="Footer (Styled Summary Card)" isDarkMode={dark}>
        <Table
          columns={columns}
          data={sampleData.slice(0, 6)}
          showFooter
          footerContent={
            <tr>
              <td colSpan={100} className="p-0">
                <div
                  className={`px-5 py-4 flex items-center justify-between bg-gradient-to-r from-cl-accent/15 to-cl-accent/10 border-t-2 border-cl-border-input-focus dark:bg-gradient-to-r dark:from-cl-accent/150/[0.06] dark:to-cl-accent/0.04 dark:border-t-2 dark:border dark:border-cl-border-input-focus/20`}
                >
                  <div className="flex items-center gap-6">
                    <div>
                      <p
                        className={`text-xs font-medium uppercase tracking-wider text-cl-text-tertiary`}
                      >
                        Total Rows
                      </p>
                      <p
                        className={`text-xl font-bold text-cl-text`}
                      >
                        {sampleData.slice(0, 6).length}
                      </p>
                    </div>
                    <div
                      className={`w-px h-10 bg-cl-bg-elevated`}
                    />
                    <div>
                      <p
                        className={`text-xs font-medium uppercase tracking-wider text-cl-text-tertiary`}
                      >
                        Active
                      </p>
                      <p
                        className={`text-xl font-bold text-cl-success`}
                      >
                        {
                          sampleData
                            .slice(0, 6)
                            .filter((d) => d.status === "active").length
                        }
                      </p>
                    </div>
                    <div
                      className={`w-px h-10 bg-cl-bg-elevated`}
                    />
                    <div>
                      <p
                        className={`text-xs font-medium uppercase tracking-wider text-cl-text-tertiary`}
                      >
                        Departments
                      </p>
                      <p
                        className={`text-xl font-bold text-cl-accent`}
                      >
                        {
                          new Set(
                            sampleData.slice(0, 6).map((d) => d.department),
                          ).size
                        }
                      </p>
                    </div>
                  </div>
                  <button
                    className={`px-4 py-2 text-sm font-medium rounded-cl-md cursor-pointer transition-colors bg-cl-accent text-white hover:bg-cl-accent/90 dark:bg-cl-accent/15 dark:text-cl-accent dark:hover:bg-cl-accent/25`}
                    onClick={() => alert("Export triggered")}
                  >
                    Export Report
                  </button>
                </div>
              </td>
            </tr>
          }
          getRowId={(row) => row.id}
          classes={s}
        />
        <p
          className={`mt-3 text-sm text-cl-text-secondary`}
        >
          A dashboard-style summary card as footer with large metric numbers,
          dividers, gradient background, and an action button. Uses{" "}
          <code
            className={`px-1 rounded bg-cl-bg-elevated`}
          >
            colSpan={"{100}"}
          </code>{" "}
          for full width.
        </p>
      </Section>

      <Section title="Footer (Sticky Footer)" isDarkMode={dark}>
        <Table
          columns={columns}
          data={sampleData}
          maxHeight={250}
          showFooter
          footerContent={
            <tr
              className={`bg-cl-bg-hover border-t-2 border-cl-border-input dark:bg-cl-bg-elevated dark:border-t-2 dark:border dark:border-cl-text/[0.1]`}
            >
              <td
                colSpan={100}
                className={`px-4 py-3 text-sm font-medium text-cl-text-secondary`}
              >
                <div className="flex items-center justify-between">
                  <span>Showing {sampleData.length} rows total</span>
                  <span
                    className={`text-xs text-cl-text-tertiary`}
                  >
                    Scroll to see all data
                  </span>
                </div>
              </td>
            </tr>
          }
          getRowId={(row) => row.id}
          classes={{ ...s, footer: "sticky bottom-0 z-10" }}
        />
        <p
          className={`mt-3 text-sm text-cl-text-secondary`}
        >
          Footer stays <strong>sticky at the bottom</strong> while the table
          scrolls vertically, using{" "}
          <code
            className={`px-1 rounded bg-cl-bg-elevated`}
          >
            classes.footer
          </code>{" "}
          with{" "}
          <code
            className={`px-1 rounded bg-cl-bg-elevated`}
          >
            sticky bottom-0
          </code>
          . Needs{" "}
          <code
            className={`px-1 rounded bg-cl-bg-elevated`}
          >
            maxHeight
          </code>{" "}
          on the table for scroll context.
        </p>
      </Section>

      <Section title="Footer (Multi-Row with Styling)" isDarkMode={dark}>
        <Table
          columns={columns}
          data={sampleData.slice(0, 5)}
          showFooter
          footerContent={
            <>
              <tr
                className={
                  dark
                    ? "border-t border-cl-text/[0.06]"
                    : "border-t border-cl-border"
                }
              >
                <td
                  colSpan={100}
                  className={`px-4 py-2.5 text-cl-text-secondary`}
                >
                  <div className="flex items-center gap-4 text-xs">
                    <span
                      className={`flex items-center gap-1.5 text-cl-success`}
                    >
                      <span className={`w-2 h-2 rounded-full bg-cl-success/30`} />
                      {
                        sampleData
                          .slice(0, 5)
                          .filter((d) => d.status === "active").length
                      }{" "}
                      Active
                    </span>
                    <span
                      className={`flex items-center gap-1.5 text-cl-text-secondary`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full bg-cl-text/10 dark:bg-cl-text/10`}
                      />
                      {
                        sampleData
                          .slice(0, 5)
                          .filter((d) => d.status === "inactive").length
                      }{" "}
                      Inactive
                    </span>
                    <span
                      className={`flex items-center gap-1.5 text-cl-warning dark:text-cl-warning`}
                    >
                      <span className={`w-2 h-2 rounded-full bg-cl-warning dark:bg-cl-warning/30`} />
                      {
                        sampleData
                          .slice(0, 5)
                          .filter((d) => d.status === "pending").length
                      }{" "}
                      Pending
                    </span>
                  </div>
                </td>
              </tr>
              <tr className={dark ? "bg-cl-text/[0.02]" : "bg-cl-bg-hover"}>
                <td
                  colSpan={100}
                  className={`px-4 py-2 text-[11px] text-cl-text-disabled`}
                >
                  Last updated:{" "}
                  {new Date().toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
              </tr>
            </>
          }
          getRowId={(row) => row.id}
          classes={s}
        />
        <p
          className={`mt-3 text-sm text-cl-text-secondary`}
        >
          Two-row footer: first row shows status breakdown with colored dots,
          second row shows a timestamp. Pass multiple{" "}
          <code
            className={`px-1 rounded bg-cl-bg-elevated`}
          >
            &lt;tr&gt;
          </code>{" "}
          elements wrapped in a{" "}
          <code
            className={`px-1 rounded bg-cl-bg-elevated`}
          >
            &lt;&gt;...&lt;/&gt;
          </code>{" "}
          fragment.
        </p>
      </Section>

      <Section title="Context Menu" isDarkMode={dark}>
        <DemoWrapper isDarkMode={dark}>
          <div className="space-y-3">
            <Table
              columns={columns}
              data={sampleData.slice(0, 5)}
              onContextMenu={(_event, row) => {
                _event.preventDefault();
                setContextMenuInfo(`Right-clicked: ${row.name} (${row.role})`);
              }}
              getRowId={(row) => row.id}
              classes={s}
            />
            {contextMenuInfo && (
              <div
                className={`p-3 rounded-cl-md text-sm bg-cl-warning/15 text-cl-warning border border-cl-warning dark:bg-cl-warning/10 dark:text-cl-warning dark:border dark:border-cl-warning/20`}
              >
                {contextMenuInfo}
                <button
                  onClick={() => setContextMenuInfo(null)}
                  className={`ml-3 underline text-xs text-cl-warning dark:text-cl-warning`}
                >
                  Dismiss
                </button>
              </div>
            )}
          </div>
          <p
            className={`mt-3 text-sm text-cl-text-secondary`}
          >
            Right-click any row to trigger the{" "}
            <code
              className={`px-1 rounded bg-cl-bg-elevated`}
            >
              onContextMenu
            </code>{" "}
            handler. You could use this to show a custom context menu.
          </p>
        </DemoWrapper>
      </Section>

      <Section title="Copy to Clipboard" isDarkMode={dark}>
        <DemoWrapper isDarkMode={dark}>
          <div className="space-y-3">
            <Table
              columns={columns}
              data={sampleData.slice(0, 5)}
              enableCopyOnClick
              onCellCopy={(value, rowId, columnId) => {
                setLastCopied(
                  `"${value}" from row ${rowId}, column "${columnId}"`,
                );
                setTimeout(() => setLastCopied(null), 3000);
              }}
              getRowId={(row) => row.id}
              classes={s}
            />
            {lastCopied && (
              <div
                className={`p-3 rounded-cl-md text-sm bg-cl-success/15 text-cl-success border border-cl-success dark:bg-cl-success/10 dark:text-cl-success dark:border dark:border-cl-success/20`}
              >
                Copied: {lastCopied}
              </div>
            )}
          </div>
          <p
            className={`mt-3 text-sm text-cl-text-secondary`}
          >
            Click any cell to copy its value to clipboard. Uses{" "}
            <code
              className={`px-1 rounded bg-cl-bg-elevated`}
            >
              enableCopyOnClick
            </code>{" "}
            and{" "}
            <code
              className={`px-1 rounded bg-cl-bg-elevated`}
            >
              onCellCopy
            </code>{" "}
            for feedback.
          </p>
        </DemoWrapper>
      </Section>

      <Section title="Infinite Scroll" isDarkMode={dark}>
        <DemoWrapper isDarkMode={dark}>
          <Table
            ref={infiniteScrollTableRef}
            columns={columns}
            data={infiniteData}
            enableInfiniteScroll
            hasMore={infiniteHasMore}
            loadingMore={infiniteLoading}
            onLoadMore={handleLoadMore}
            maxHeight={300}
            getRowId={(row) => row.id}
            loadingMoreContent={
              <span
                className={`flex items-center gap-2 text-sm text-cl-text-secondary`}
              >
                <svg
                  className="animate-spin h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                >
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
              <span
                className={`text-xs text-cl-text-tertiary`}
              >
                All {allInfiniteData.length} rows loaded
              </span>
            }
            classes={{
              ...s,
              ...s,
              container: `w-full border rounded-cl-md border-cl-border`,
            }}
          />
          <div
            className={`mt-3 flex items-center justify-between text-cl-text-secondary`}
          >
            <span className="text-sm">
              Loaded {infiniteData.length} of {allInfiniteData.length} rows.{" "}
              {!infiniteHasMore && (
                <span
                  className={dark ? "text-cl-success" : "text-cl-success"}
                >
                  All data loaded.
                </span>
              )}
              {infiniteHasMore && "Scroll down to load more."}
            </span>
            <button
              onClick={() => {
                setInfiniteData(allInfiniteData.slice(0, 10));
                setInfiniteHasMore(true);
                setInfiniteLoading(false);
                if (infiniteScrollTableRef.current) {
                  infiniteScrollTableRef.current.scrollTop = 0;
                }
              }}
              className={`text-xs px-3 py-1 rounded cursor-pointer text-cl-accent hover:bg-cl-bg-elevated`}
            >
              Reset
            </button>
          </div>
        </DemoWrapper>
      </Section>

      <Section title="Infinite Scroll (Skeleton Loader)" isDarkMode={dark}>
        <DemoWrapper isDarkMode={dark}>
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
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-4 ${i > 1 ? "opacity-60" : ""}`}
                  >
                    <div
                      className={`h-3 rounded-full animate-pulse bg-cl-bg-hover dark:bg-cl-bg-hover`}
                      style={{ width: "25%" }}
                    />
                    <div
                      className={`h-3 rounded-full animate-pulse bg-cl-bg-hover dark:bg-cl-bg-hover`}
                      style={{ width: "35%" }}
                    />
                    <div
                      className={`h-3 rounded-full animate-pulse bg-cl-bg-hover dark:bg-cl-bg-hover`}
                      style={{ width: "15%" }}
                    />
                    <div
                      className={`h-3 rounded-full animate-pulse bg-cl-bg-hover dark:bg-cl-text/[0.03]`}
                      style={{ width: "20%" }}
                    />
                  </div>
                ))}
              </div>
            }
            infiniteEndContent={
              <div
                className={`flex items-center gap-2 text-cl-success`}
              >
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
                  All {allInfiniteData.length} rows loaded
                </span>
              </div>
            }
            classes={{
              ...s,
              ...s,
              container: `w-full border rounded-cl-md border-cl-border`,
            }}
          />
          <div
            className={`mt-3 flex items-center justify-between text-cl-text-secondary`}
          >
            <span className="text-sm">
              Loaded {inf2Data.length} of {allInfiniteData.length}
            </span>
            <button
              onClick={() => {
                setInf2Data(allInfiniteData.slice(0, 10));
                setInf2HasMore(true);
                setInf2Loading(false);
                if (inf2Ref.current) inf2Ref.current.scrollTop = 0;
              }}
              className={`text-xs px-3 py-1 rounded cursor-pointer text-cl-accent hover:bg-cl-bg-elevated`}
            >
              Reset
            </button>
          </div>
        </DemoWrapper>
        <p
          className={`mt-3 text-sm text-cl-text-secondary`}
        >
          Skeleton row placeholders as loading indicator via{" "}
          <code
            className={`px-1 rounded bg-cl-bg-elevated`}
          >
            loadingMoreContent
          </code>
          . Shows 3 shimmer rows with fading opacity. End state shows a
          checkmark icon with "All rows loaded" via{" "}
          <code
            className={`px-1 rounded bg-cl-bg-elevated`}
          >
            infiniteEndContent
          </code>
          .
        </p>
      </Section>

      <Section title="Infinite Scroll (Progress Bar Loader)" isDarkMode={dark}>
        <DemoWrapper isDarkMode={dark}>
          <Table
            ref={inf3Ref}
            columns={columns}
            data={inf3Data}
            enableInfiniteScroll
            hasMore={inf3HasMore}
            loadingMore={inf3Loading}
            onLoadMore={handleLoadMore3}
            maxHeight={300}
            getRowId={(row) => row.id}
            loadingMoreContent={
              <div className="w-full px-4 py-4 space-y-2">
                <div
                  className={`w-full h-1 rounded-full overflow-hidden bg-cl-bg-hover dark:bg-cl-bg-hover`}
                >
                  <div
                    className={`h-full rounded-full animate-pulse bg-cl-accent dark:bg-cl-accent`}
                    style={{
                      width: "60%",
                      animation: "pulse 1s ease-in-out infinite",
                    }}
                  />
                </div>
                <p
                  className={`text-xs text-center text-cl-text-tertiary`}
                >
                  Loading rows {inf3Data.length + 1} to{" "}
                  {Math.min(inf3Data.length + 10, allInfiniteData.length)}...
                </p>
              </div>
            }
            infiniteEndContent={
              <span
                className={`text-xs text-cl-text-tertiary`}
              >
                You've reached the end ({allInfiniteData.length} rows)
              </span>
            }
            classes={{
              ...s,
              ...s,
              container: `w-full border rounded-cl-md border-cl-border`,
            }}
          />
          <div
            className={`mt-3 flex items-center justify-between text-cl-text-secondary`}
          >
            <span className="text-sm">
              Loaded {inf3Data.length} of {allInfiniteData.length}
            </span>
            <button
              onClick={() => {
                setInf3Data(allInfiniteData.slice(0, 10));
                setInf3HasMore(true);
                setInf3Loading(false);
                if (inf3Ref.current) inf3Ref.current.scrollTop = 0;
              }}
              className={`text-xs px-3 py-1 rounded cursor-pointer text-cl-accent hover:bg-cl-bg-elevated`}
            >
              Reset
            </button>
          </div>
        </DemoWrapper>
        <p
          className={`mt-3 text-sm text-cl-text-secondary`}
        >
          Progress bar with contextual text showing which rows are loading. End
          state shows a simple "reached the end" message.
        </p>
      </Section>

      <Section
        title="Infinite Scroll (No Loading UI, Silent Load)"
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <Table
            ref={inf4Ref}
            columns={columns}
            data={inf4Data}
            enableInfiniteScroll
            hasMore={inf4HasMore}
            loadingMore={inf4Loading}
            onLoadMore={handleLoadMore4}
            maxHeight={300}
            getRowId={(row) => row.id}
            classes={{
              ...s,
              ...s,
              container: `w-full border rounded-cl-md border-cl-border`,
            }}
          />
          <div
            className={`mt-3 flex items-center justify-between text-cl-text-secondary`}
          >
            <span className="text-sm">
              {inf4HasMore
                ? `${inf4Data.length} rows loaded, scroll for more`
                : `All ${inf4Data.length} rows loaded`}
            </span>
            <button
              onClick={() => {
                setInf4Data(allInfiniteData.slice(0, 10));
                setInf4HasMore(true);
                setInf4Loading(false);
                if (inf4Ref.current) inf4Ref.current.scrollTop = 0;
              }}
              className={`text-xs px-3 py-1 rounded cursor-pointer text-cl-accent hover:bg-cl-bg-elevated`}
            >
              Reset
            </button>
          </div>
        </DemoWrapper>
        <p
          className={`mt-3 text-sm text-cl-text-secondary`}
        >
          No{" "}
          <code
            className={`px-1 rounded bg-cl-bg-elevated`}
          >
            loadingMoreContent
          </code>{" "}
          or{" "}
          <code
            className={`px-1 rounded bg-cl-bg-elevated`}
          >
            infiniteEndContent
          </code>{" "}
          set. Data loads silently in the background with no visual indicator.
          The counter below tracks progress. Use this when you want seamless,
          invisible loading.
        </p>
      </Section>

      <Section title="Built-in Search Bar (Default)" isDarkMode={dark}>
        <DemoWrapper isDarkMode={dark}>
          <Table
            columns={columns}
            data={sampleData}
            showSearch
            searchPlaceholder="Search users by any field..."
            globalFilter={builtInSearchFilter}
            onGlobalFilterChange={setBuiltInSearchFilter}
            onSearchClear={() => setBuiltInSearchFilter("")}
            getRowId={(row) => row.id}
            classes={s}
          />
          <p
            className={`mt-3 text-sm text-cl-text-secondary`}
          >
            Set{" "}
            <code
              className={`px-1 rounded bg-cl-bg-elevated`}
            >
              showSearch
            </code>{" "}
            to render a built-in search bar above the table. Customize styling
            via{" "}
            <code
              className={`px-1 rounded bg-cl-bg-elevated`}
            >
              classes.searchBar
            </code>{" "}
            and{" "}
            <code
              className={`px-1 rounded bg-cl-bg-elevated`}
            >
              classes.searchInput
            </code>
            .
          </p>
        </DemoWrapper>
      </Section>

      <Section title="Built-in Search (Rose Theme)" isDarkMode={dark}>
        {(() => {
          const RoseSearchDemo = () => {
            const [filter, setFilter] = React.useState("");
            return (
              <Table
                columns={columns}
                data={sampleData}
                showSearch
                searchPlaceholder="Find team members..."
                globalFilter={filter}
                onGlobalFilterChange={setFilter}
                onSearchClear={() => setFilter("")}
                getRowId={(row) => row.id}
                classes={{
                  ...s,
                  searchInput:
                    "rounded-cl-lg focus:!ring-rose-500/25 focus:!border-rose-500/60",
                }}
                SearchIcon={({ className }) => (
                  <svg
                    className={className}
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={dark ? "#fb7185" : "#e11d48"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                )}
              />
            );
          };
          return <RoseSearchDemo />;
        })()}
        <p
          className={`mt-3 text-sm text-cl-text-secondary`}
        >
          Rose/pink themed search with custom{" "}
          <code
            className={`px-1 rounded bg-cl-bg-elevated`}
          >
            SearchIcon
          </code>
          , thicker border, and a rose focus glow effect.
        </p>
      </Section>

      <Section title="Built-in Search (Icon on Right)" isDarkMode={dark}>
        {(() => {
          const RightIconDemo = () => {
            const [filter, setFilter] = React.useState("");
            return (
              <Table
                columns={columns}
                data={sampleData}
                showSearch
                searchIconPosition="right"
                searchPlaceholder="Search users..."
                globalFilter={filter}
                onGlobalFilterChange={setFilter}
                onSearchClear={() => setFilter("")}
                getRowId={(row) => row.id}
                classes={s}
              />
            );
          };
          return <RightIconDemo />;
        })()}
        <p
          className={`mt-3 text-sm text-cl-text-secondary`}
        >
          Search icon on the <strong>right side</strong> via{" "}
          <code
            className={`px-1 rounded bg-cl-bg-elevated`}
          >
            searchIconPosition="right"
          </code>
          . The clear button shifts left when a right icon is present.
        </p>
      </Section>

      <Section title="Built-in Search (No Icon)" isDarkMode={dark}>
        {(() => {
          const NoIconDemo = () => {
            const [filter, setFilter] = React.useState("");
            return (
              <Table
                columns={columns}
                data={sampleData}
                showSearch
                searchIconPosition="none"
                searchPlaceholder="Type to filter rows..."
                globalFilter={filter}
                onGlobalFilterChange={setFilter}
                onSearchClear={() => setFilter("")}
                getRowId={(row) => row.id}
                classes={{
                  ...s,
                  searchInput:
                    "!rounded-full focus:!ring-cl-warning/30 focus:!border-cl-warning/60",
                }}
              />
            );
          };
          return <NoIconDemo />;
        })()}
        <p
          className={`mt-3 text-sm text-cl-text-secondary`}
        >
          No icon using{" "}
          <code
            className={`px-1 rounded bg-cl-bg-elevated`}
          >
            searchIconPosition="none"
          </code>
          . Pill shape with amber focus ring. Clean minimal look.
        </p>
      </Section>

      <Section
        title="Built-in Search (Emerald Underline Style)"
        isDarkMode={dark}
      >
        {(() => {
          const UnderlineDemo = () => {
            const [filter, setFilter] = React.useState("");
            return (
              <Table
                columns={columns}
                data={sampleData}
                showSearch
                searchIconPosition="none"
                searchPlaceholder="Filter table..."
                globalFilter={filter}
                onGlobalFilterChange={setFilter}
                onSearchClear={() => setFilter("")}
                getRowId={(row) => row.id}
                classes={{
                  ...s,
                  searchInput:
                    "!rounded-none !border-0 !border-b-2 !bg-transparent !border-cl-border focus:!ring-0 focus:!border-cl-success",
                }}
              />
            );
          };
          return <UnderlineDemo />;
        })()}
        <p
          className={`mt-3 text-sm text-cl-text-secondary`}
        >
          Underline-only input with no background, no border-radius, and emerald
          focus color. Minimalist style that blends into the page.
        </p>
      </Section>

      <Section
        title="Built-in Search (Custom Filter Icon on Right)"
        isDarkMode={dark}
      >
        {(() => {
          const FilterIconDemo = () => {
            const [filter, setFilter] = React.useState("");
            return (
              <Table
                columns={columns}
                data={sampleData}
                showSearch
                searchIconPosition="right"
                searchPlaceholder="Filter by any column..."
                globalFilter={filter}
                onGlobalFilterChange={setFilter}
                onSearchClear={() => setFilter("")}
                getRowId={(row) => row.id}
                SearchIcon={({ className }) => (
                  <svg
                    className={className}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={dark ? "#a78bfa" : "#7c3aed"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                  </svg>
                )}
                classes={{
                  ...s,
                  searchInput:
                    "rounded-cl-lg focus:!ring-violet-500/25 focus:!border-violet-500/60",
                }}
              />
            );
          };
          return <FilterIconDemo />;
        })()}
        <p
          className={`mt-3 text-sm text-cl-text-secondary`}
        >
          A funnel/filter icon on the right via{" "}
          <code
            className={`px-1 rounded bg-cl-bg-elevated`}
          >
            SearchIcon
          </code>{" "}
          +{" "}
          <code
            className={`px-1 rounded bg-cl-bg-elevated`}
          >
            searchIconPosition="right"
          </code>
          . Violet theme with thick border and focus glow.
        </p>
      </Section>

      <Section title="Column Header Filters (Default)" isDarkMode={dark}>
        {(() => {
          const HeaderFilterDemo = () => {
            const [filters, setFilters] = React.useState<
              { id: string; value: unknown }[]
            >([]);
            return (
              <div className="space-y-3">
                <Table
                  columns={columns}
                  data={sampleData}
                  getRowId={(row) => row.id}
                  enableColumnFilters
                  columnFilters={filters}
                  onColumnFiltersChange={setFilters}
                  filterableColumns={{
                    role: {
                      options: [
                        { label: "Admin", value: "Admin" },
                        { label: "Manager", value: "Manager" },
                        { label: "Developer", value: "Developer" },
                        { label: "Designer", value: "Designer" },
                      ],
                    },
                    status: {
                      options: [
                        { label: "Active", value: "active" },
                        { label: "Inactive", value: "inactive" },
                        { label: "Pending", value: "pending" },
                      ],
                    },
                    department: {
                      options: [
                        { label: "Engineering", value: "Engineering" },
                        { label: "Marketing", value: "Marketing" },
                        { label: "Design", value: "Design" },
                      ],
                    },
                  }}
                  classes={s}
                />
                {filters.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-xs text-cl-text-tertiary`}
                    >
                      Active filters:
                    </span>
                    {filters.map((f) => (
                      <span
                        key={f.id}
                        className={`text-xs px-2 py-1 rounded-full bg-cl-accent/10 text-cl-accent dark:bg-cl-accent/15 dark:text-cl-accent`}
                      >
                        {f.id}:{" "}
                        {Array.isArray(f.value)
                          ? (f.value as string[]).join(", ")
                          : String(f.value)}
                      </span>
                    ))}
                    <button
                      onClick={() => setFilters([])}
                      className={`text-xs cursor-pointer text-cl-text-tertiary hover:text-cl-text`}
                    >
                      Clear all
                    </button>
                  </div>
                )}
              </div>
            );
          };
          return <HeaderFilterDemo />;
        })()}
        <p
          className={`mt-3 text-sm text-cl-text-secondary`}
        >
          Click the filter icon in Role, Status, or Department headers to open a
          multi-select dropdown. Active filters show a filled icon. Uses{" "}
          <code
            className={`px-1 rounded bg-cl-bg-elevated`}
          >
            filterableColumns
          </code>{" "}
          with options arrays.
        </p>
      </Section>

      <Section title="Column Header Filters (Custom Icon)" isDarkMode={dark}>
        {(() => {
          const CustomFilterIconDemo = () => {
            const [filters, setFilters] = React.useState<
              { id: string; value: unknown }[]
            >([]);
            const DownChevronFilter = ({
              active,
              className,
            }: {
              active: boolean;
              className?: string;
            }) => (
              <svg
                className={className}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={active ? "2.5" : "2"}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            );
            return (
              <Table
                columns={columns}
                data={sampleData}
                getRowId={(row) => row.id}
                enableColumnFilters
                columnFilters={filters}
                onColumnFiltersChange={setFilters}
                FilterIcon={DownChevronFilter}
                filterableColumns={{
                  role: {
                    options: [
                      { label: "Admin", value: "Admin" },
                      { label: "Manager", value: "Manager" },
                      { label: "Developer", value: "Developer" },
                      { label: "Designer", value: "Designer" },
                    ],
                  },
                  status: {
                    options: [
                      { label: "Active", value: "active" },
                      { label: "Inactive", value: "inactive" },
                      { label: "Pending", value: "pending" },
                    ],
                  },
                }}
                classes={{
                  ...s,
                  filterIcon: dark ? "text-cl-accent" : "text-cl-accent",
                }}
              />
            );
          };
          return <CustomFilterIconDemo />;
        })()}
        <p
          className={`mt-3 text-sm text-cl-text-secondary`}
        >
          Custom chevron-down filter icon via{" "}
          <code
            className={`px-1 rounded bg-cl-bg-elevated`}
          >
            FilterIcon
          </code>{" "}
          prop. Styled in violet via{" "}
          <code
            className={`px-1 rounded bg-cl-bg-elevated`}
          >
            classes.filterIcon
          </code>
          . The icon gets bolder stroke when a filter is active.
        </p>
      </Section>

      <Section
        title="Column Header Filters (Custom Dropdown Content)"
        isDarkMode={dark}
      >
        {(() => {
          const CustomDropdownDemo = () => {
            const [filters, setFilters] = React.useState<
              { id: string; value: unknown }[]
            >([]);
            return (
              <Table
                columns={columns}
                data={sampleData}
                getRowId={(row) => row.id}
                enableColumnFilters
                columnFilters={filters}
                onColumnFiltersChange={setFilters}
                filterableColumns={{
                  status: {
                    options: [
                      { label: "Active", value: "active" },
                      { label: "Inactive", value: "inactive" },
                      { label: "Pending", value: "pending" },
                    ],
                  },
                }}
                renderColumnFilter={(columnId, currentValues, setValues) => (
                  <div className="p-3 space-y-2">
                    <p
                      className={`text-xs font-semibold uppercase tracking-wider text-cl-text-secondary`}
                    >
                      Filter by {columnId}
                    </p>
                    <div className="space-y-1">
                      {[
                        {
                          label: "Active",
                          value: "active",
                          color: dark
                            ? "text-cl-success bg-cl-success/10"
                            : "text-cl-success bg-cl-success/15",
                        },
                        {
                          label: "Inactive",
                          value: "inactive",
                          color: dark
                            ? "text-cl-text-tertiary bg-cl-text/10"
                            : "text-cl-text-secondary bg-cl-bg-hover",
                        },
                        {
                          label: "Pending",
                          value: "pending",
                          color: dark
                            ? "text-cl-warning bg-cl-warning/10"
                            : "text-cl-warning bg-cl-warning/15",
                        },
                      ].map((opt) => {
                        const selected = currentValues.includes(opt.value);
                        return (
                          <button
                            key={opt.value}
                            onClick={() =>
                              setValues(
                                selected
                                  ? currentValues.filter((v) => v !== opt.value)
                                  : [...currentValues, opt.value],
                              )
                            }
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-cl-md text-sm cursor-pointer transition-all ${selected ? opt.color + " font-medium" : dark ? "text-cl-text-tertiary hover:bg-cl-bg-hover" : "text-cl-text-secondary hover:bg-cl-bg-hover"}`}
                          >
                            <span
                              className={`w-2 h-2 rounded-full ${opt.value === "active" ? "bg-cl-success" : opt.value === "pending" ? "bg-cl-warning" : dark ? "bg-cl-text/10" : "bg-cl-text/10"}`}
                            />
                            {opt.label}
                            {selected && (
                              <svg
                                className="w-4 h-4 ml-auto"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    {currentValues.length > 0 && (
                      <button
                        onClick={() => setValues([])}
                        className={`w-full text-center text-xs py-1.5 rounded cursor-pointer text-cl-text-tertiary hover:text-cl-text-secondary hover:bg-cl-bg-hover dark:text-cl-text-tertiary dark:hover:text-cl-text-secondary dark:hover:bg-cl-bg-hover`}
                      >
                        Clear filter
                      </button>
                    )}
                  </div>
                )}
                classes={{
                  ...s,
                  filterDropdown: dark
                    ? "bg-cl-bg border-cl-text/[0.08]"
                    : "bg-white border-cl-border",
                }}
              />
            );
          };
          return <CustomDropdownDemo />;
        })()}
        <p
          className={`mt-3 text-sm text-cl-text-secondary`}
        >
          Fully custom dropdown content via{" "}
          <code
            className={`px-1 rounded bg-cl-bg-elevated`}
          >
            renderColumnFilter
          </code>
          . Receives{" "}
          <code
            className={`px-1 rounded bg-cl-bg-elevated`}
          >
            columnId
          </code>
          ,{" "}
          <code
            className={`px-1 rounded bg-cl-bg-elevated`}
          >
            currentValues
          </code>
          , and{" "}
          <code
            className={`px-1 rounded bg-cl-bg-elevated`}
          >
            setValues
          </code>
          . You can render any UI: your own MultiSelectDropdown, date range
          pickers, sliders, or any custom component.
        </p>
      </Section>

      <Section title="Column Filters + Sorting Combined" isDarkMode={dark}>
        {(() => {
          const FilterSortDemo = () => {
            const [filters, setFilters] = React.useState<
              { id: string; value: unknown }[]
            >([]);
            return (
              <div className="space-y-3">
                <Table
                  columns={columns}
                  data={sampleData}
                  getRowId={(row) => row.id}
                  sortable
                  enableColumnFilters
                  columnFilters={filters}
                  onColumnFiltersChange={setFilters}
                  filterableColumns={{
                    role: {
                      options: [
                        { label: "Admin", value: "Admin" },
                        { label: "Manager", value: "Manager" },
                        { label: "Developer", value: "Developer" },
                        { label: "Designer", value: "Designer" },
                      ],
                    },
                    status: {
                      options: [
                        { label: "Active", value: "active" },
                        { label: "Inactive", value: "inactive" },
                        { label: "Pending", value: "pending" },
                      ],
                    },
                    department: {
                      options: [
                        { label: "Engineering", value: "Engineering" },
                        { label: "Marketing", value: "Marketing" },
                        { label: "Design", value: "Design" },
                      ],
                    },
                  }}
                  classes={s}
                />
                <p
                  className={`text-sm text-cl-text-secondary`}
                >
                  Click a header name to sort, click the filter icon to filter.
                  Both work together: filter narrows the data, sort reorders the
                  filtered results.
                </p>
              </div>
            );
          };
          return <FilterSortDemo />;
        })()}
      </Section>

      <Section title="Column Filters (Styled Dropdown)" isDarkMode={dark}>
        {(() => {
          const StyledFilterDemo = () => {
            const [filters, setFilters] = React.useState<
              { id: string; value: unknown }[]
            >([]);
            return (
              <Table
                columns={columns}
                data={sampleData}
                getRowId={(row) => row.id}
                enableColumnFilters
                columnFilters={filters}
                onColumnFiltersChange={setFilters}
                filterableColumns={{
                  role: {
                    options: [
                      { label: "Admin", value: "Admin" },
                      { label: "Manager", value: "Manager" },
                      { label: "Developer", value: "Developer" },
                      { label: "Designer", value: "Designer" },
                    ],
                  },
                  status: {
                    options: [
                      { label: "Active", value: "active" },
                      { label: "Inactive", value: "inactive" },
                      { label: "Pending", value: "pending" },
                    ],
                  },
                }}
                renderColumnFilter={(columnId, currentValues, setValues) => (
                  <div className={`p-2 bg-white dark:bg-cl-bg`}>
                    <div
                      className={`px-2 py-1.5 mb-1 flex items-center justify-between`}
                    >
                      <span
                        className={`text-[11px] font-bold uppercase tracking-widest text-cl-accent`}
                      >
                        {columnId}
                      </span>
                      {currentValues.length > 0 && (
                        <button
                          onClick={() => setValues([])}
                          className={`text-[10px] px-1.5 py-0.5 rounded cursor-pointer text-cl-text-tertiary hover:text-cl-text-secondary hover:bg-cl-bg-hover dark:text-cl-text-tertiary dark:hover:text-cl-text-secondary dark:hover:bg-cl-bg-hover`}
                        >
                          Reset
                        </button>
                      )}
                    </div>
                    {(columnId === "status"
                      ? [
                          {
                            label: "Active",
                            value: "active",
                            dot: "bg-cl-success",
                          },
                          {
                            label: "Inactive",
                            value: "inactive",
                            dot: dark ? "bg-cl-text/10" : "bg-cl-text/10",
                          },
                          {
                            label: "Pending",
                            value: "pending",
                            dot: "bg-cl-warning",
                          },
                        ]
                      : [
                          { label: "Admin", value: "Admin", dot: "bg-cl-error" },
                          {
                            label: "Manager",
                            value: "Manager",
                            dot: "bg-cl-accent",
                          },
                          {
                            label: "Developer",
                            value: "Developer",
                            dot: "bg-cl-success",
                          },
                          {
                            label: "Designer",
                            value: "Designer",
                            dot: "bg-cl-accent",
                          },
                        ]
                    ).map((opt) => {
                      const selected = currentValues.includes(opt.value);
                      return (
                        <button
                          key={opt.value}
                          onClick={() =>
                            setValues(
                              selected
                                ? currentValues.filter((v) => v !== opt.value)
                                : [...currentValues, opt.value],
                            )
                          }
                          className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-cl-md text-sm cursor-pointer transition-all mb-0.5 ${
                            selected
                              ? dark
                                ? "bg-cl-accent/15 text-cl-accent"
                                : "bg-cl-accent/10 text-cl-accent"
                              : dark
                                ? "text-cl-text-secondary hover:bg-cl-bg-hover"
                                : "text-cl-text hover:bg-cl-bg-hover"
                          }`}
                        >
                          <span
                            className={`w-2.5 h-2.5 rounded-full shrink-0 ${opt.dot}`}
                          />
                          <span className="flex-1 text-left">{opt.label}</span>
                          {selected && (
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className={
                                dark ? "text-cl-accent" : "text-cl-accent"
                              }
                            >
                              <path d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                      );
                    })}
                    {currentValues.length > 0 && (
                      <div
                        className={`mt-1 px-2 py-1 text-[11px] text-cl-text-disabled`}
                      >
                        {currentValues.length} selected
                      </div>
                    )}
                  </div>
                )}
                classes={{
                  ...s,
                  filterIcon: dark ? "text-cl-accent" : "text-cl-accent",
                  filterDropdown: `rounded-cl-lg border shadow-2xl bg-white border-cl-border-input-focus dark:bg-cl-bg dark:border dark:border-cl-border-input-focus/20`,
                }}
              />
            );
          };
          return <StyledFilterDemo />;
        })()}
        <p
          className={`mt-3 text-sm text-cl-text-secondary`}
        >
          Custom styled dropdown with color-coded dots per option, indigo theme,
          rounded items, selection count, and styled via{" "}
          <code
            className={`px-1 rounded bg-cl-bg-elevated`}
          >
            classes.filterDropdown
          </code>{" "}
          and{" "}
          <code
            className={`px-1 rounded bg-cl-bg-elevated`}
          >
            renderColumnFilter
          </code>
          .
        </p>
      </Section>

      <Section title="Column Filters (Chip Tags Style)" isDarkMode={dark}>
        {(() => {
          const ChipFilterDemo = () => {
            const [filters, setFilters] = React.useState<
              { id: string; value: unknown }[]
            >([]);
            return (
              <div className="space-y-3">
                <Table
                  columns={columns}
                  data={sampleData}
                  getRowId={(row) => row.id}
                  enableColumnFilters
                  columnFilters={filters}
                  onColumnFiltersChange={setFilters}
                  filterableColumns={{
                    status: {
                      options: [
                        { label: "Active", value: "active" },
                        { label: "Inactive", value: "inactive" },
                        { label: "Pending", value: "pending" },
                      ],
                    },
                    department: {
                      options: [
                        { label: "Engineering", value: "Engineering" },
                        { label: "Marketing", value: "Marketing" },
                        { label: "Design", value: "Design" },
                        { label: "Human Resources", value: "Human Resources" },
                      ],
                    },
                  }}
                  renderColumnFilter={(columnId, currentValues, setValues) => {
                    const opts =
                      columnId === "status"
                        ? [
                            { label: "Active", value: "active" },
                            { label: "Inactive", value: "inactive" },
                            { label: "Pending", value: "pending" },
                          ]
                        : [
                            { label: "Engineering", value: "Engineering" },
                            { label: "Marketing", value: "Marketing" },
                            { label: "Design", value: "Design" },
                            {
                              label: "Human Resources",
                              value: "Human Resources",
                            },
                          ];
                    return (
                      <div
                        className={`p-3 bg-cl-bg`}
                      >
                        <p
                          className={`text-xs font-medium mb-2 text-cl-text-tertiary`}
                        >
                          Select {columnId}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {opts.map((opt) => {
                            const selected = currentValues.includes(opt.value);
                            return (
                              <button
                                key={opt.value}
                                onClick={() =>
                                  setValues(
                                    selected
                                      ? currentValues.filter(
                                          (v) => v !== opt.value,
                                        )
                                      : [...currentValues, opt.value],
                                  )
                                }
                                className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all ${
                                  selected
                                    ? dark
                                      ? "bg-cl-accent/20 text-cl-accent border-cl-border-input-focus/40"
                                      : "bg-cl-accent/10 text-cl-accent border-cl-border-input-focus"
                                    : dark
                                      ? "bg-cl-bg-hover text-cl-text-tertiary border border-cl-text/[0.08] hover:border-cl-border-input-focus/30"
                                      : "bg-cl-bg-hover text-cl-text-secondary border-cl-border hover:border-cl-border-input-focus"
                                }`}
                              >
                                {opt.label}
                              </button>
                            );
                          })}
                        </div>
                        {currentValues.length > 0 && (
                          <button
                            onClick={() => setValues([])}
                            className={`mt-2 text-xs cursor-pointer text-cl-text-disabled hover:text-cl-text-secondary`}
                          >
                            Clear
                          </button>
                        )}
                      </div>
                    );
                  }}
                  FilterIcon={({ active, className }) => (
                    <svg
                      className={className}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={
                        active ? (dark ? "#22d3ee" : "#0891b2") : "currentColor"
                      }
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.3-4.3" />
                    </svg>
                  )}
                  classes={{
                    ...s,
                    filterDropdown: `rounded-cl-lg border shadow-2xl bg-white border-cl-border-input-focus dark:bg-cl-bg dark:border dark:border-cl-border-input-focus/20`,
                  }}
                />
                {filters.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-xs text-cl-text-tertiary`}
                    >
                      Filtered by:
                    </span>
                    {filters.map((f) => (
                      <span
                        key={f.id}
                        className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-cl-accent/10 text-cl-accent border-cl-border-input-focus dark:bg-cl-accent/10 dark:text-cl-accent dark:border dark:border-cl-border-input-focus/20`}
                      >
                        {f.id}:{" "}
                        {Array.isArray(f.value)
                          ? (f.value as string[]).join(", ")
                          : String(f.value)}
                        <button
                          onClick={() =>
                            setFilters((prev) =>
                              prev.filter((pf) => pf.id !== f.id),
                            )
                          }
                          className="cursor-pointer hover:opacity-70"
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                          >
                            <path d="M18 6L6 18M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    ))}
                    <button
                      onClick={() => setFilters([])}
                      className={`text-xs cursor-pointer text-cl-text-disabled hover:text-cl-text-secondary`}
                    >
                      Clear all
                    </button>
                  </div>
                )}
              </div>
            );
          };
          return <ChipFilterDemo />;
        })()}
        <p
          className={`mt-3 text-sm text-cl-text-secondary`}
        >
          Chip/tag-style filter selection instead of checkboxes. Cyan theme with
          a search icon as filter trigger. Active filters shown as removable
          chips below the table. Uses{" "}
          <code
            className={`px-1 rounded bg-cl-bg-elevated`}
          >
            classes.filterDropdown
          </code>{" "}
          for container styling.
        </p>
      </Section>

      <Section title="Server-Side Mode" isDarkMode={dark}>
        <DemoWrapper isDarkMode={dark}>
          <div className="space-y-3">
            <Table
              columns={sortableColumns}
              data={serverData}
              sortable
              sorting={serverSorting}
              onSortingChange={handleServerSortingChange}
              manualSorting
              loading={serverLoading}
              shimmerRowCount={5}
              getRowId={(row) => row.id}
              classes={s}
            />
            <p
              className={`text-sm text-cl-text-secondary`}
            >
              Sorting:{" "}
              <code
                className={`px-1 rounded bg-cl-bg-elevated`}
              >
                {serverSorting.length > 0
                  ? `${serverSorting[0].id} (${serverSorting[0].desc ? "desc" : "asc"})`
                  : "none"}
              </code>
              {serverLoading && <span className="ml-2 italic">Loading...</span>}
            </p>
          </div>
          <p
            className={`mt-3 text-sm text-cl-text-secondary`}
          >
            With{" "}
            <code
              className={`px-1 rounded bg-cl-bg-elevated`}
            >
              manualSorting={"{true}"}
            </code>
            , the table does not sort data locally. Instead, sorting state
            changes trigger a server request (simulated with 800ms delay). Also
            supports{" "}
            <code
              className={`px-1 rounded bg-cl-bg-elevated`}
            >
              manualPagination
            </code>{" "}
            and{" "}
            <code
              className={`px-1 rounded bg-cl-bg-elevated`}
            >
              manualFiltering
            </code>
            .
          </p>
        </DemoWrapper>
      </Section>

      <Section title="Server-Side (Real API: dummyjson.com)" isDarkMode={dark}>
        <ServerApiDemo dark={dark} s={s} />
        <div
          className={`mt-3 text-sm space-y-2 text-cl-text-secondary`}
        >
          <p>
            A complete server-side table using the{" "}
            <strong>dummyjson.com</strong> products API. All operations happen
            on the server:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
            <li>
              <strong>Server-side pagination</strong>:{" "}
              <code
                className={`px-1 rounded bg-cl-bg-elevated`}
              >
                ?limit=10&amp;skip=10
              </code>{" "}
              with{" "}
              <code
                className={`px-1 rounded bg-cl-bg-elevated`}
              >
                manualPagination
              </code>
            </li>
            <li>
              <strong>Server-side sorting</strong>:{" "}
              <code
                className={`px-1 rounded bg-cl-bg-elevated`}
              >
                ?sortBy=title&amp;order=asc
              </code>{" "}
              with{" "}
              <code
                className={`px-1 rounded bg-cl-bg-elevated`}
              >
                manualSorting
              </code>
            </li>
            <li>
              <strong>Server-side search</strong>:{" "}
              <code
                className={`px-1 rounded bg-cl-bg-elevated`}
              >
                /products/search?q=phone
              </code>{" "}
              with debounced input
            </li>
            <li>
              <strong>Server-side category filter</strong>:{" "}
              <code
                className={`px-1 rounded bg-cl-bg-elevated`}
              >
                /products/category/smartphones
              </code>{" "}
              via{" "}
              <code
                className={`px-1 rounded bg-cl-bg-elevated`}
              >
                renderColumnFilter
              </code>{" "}
              with{" "}
              <code
                className={`px-1 rounded bg-cl-bg-elevated`}
              >
                MultiSelectSearchableDropdown
              </code>
            </li>
            <li>
              Categories loaded from{" "}
              <code
                className={`px-1 rounded bg-cl-bg-elevated`}
              >
                /products/category-list
              </code>
            </li>
          </ul>
        </div>
      </Section>

      <Section title="Column Reordering" isDarkMode={dark}>
        {(() => {
          const ColumnReorderDemo = () => {
            const [colOrder, setColOrder] = React.useState<string[]>([
              "name",
              "email",
              "role",
              "status",
              "department",
              "joinDate",
            ]);
            return (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {colOrder.map((col, i) => (
                    <div
                      key={col}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-cl-md text-xs font-medium bg-cl-bg-hover text-cl-text dark:bg-cl-bg-hover dark:text-cl-text-secondary`}
                    >
                      <span>{i + 1}.</span>
                      <span className="capitalize">{col}</span>
                      {i > 0 && (
                        <button
                          onClick={() => {
                            const next = [...colOrder];
                            [next[i - 1], next[i]] = [next[i], next[i - 1]];
                            setColOrder(next);
                          }}
                          className={`p-0.5 rounded cursor-pointer hover:bg-cl-bg-hover text-cl-text-tertiary hover:text-cl-text-secondary dark:hover:bg-cl-text/10 dark:text-cl-text-tertiary dark:hover:text-cl-text-secondary`}
                          title="Move left"
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M15 18l-6-6 6-6" />
                          </svg>
                        </button>
                      )}
                      {i < colOrder.length - 1 && (
                        <button
                          onClick={() => {
                            const next = [...colOrder];
                            [next[i], next[i + 1]] = [next[i + 1], next[i]];
                            setColOrder(next);
                          }}
                          className={`p-0.5 rounded cursor-pointer hover:bg-cl-bg-hover text-cl-text-tertiary hover:text-cl-text-secondary dark:hover:bg-cl-text/10 dark:text-cl-text-tertiary dark:hover:text-cl-text-secondary`}
                          title="Move right"
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M9 18l6-6-6-6" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <Table
                  columns={columns}
                  data={sampleData.slice(0, 5)}
                  enableColumnReordering
                  columnOrder={colOrder}
                  onColumnOrderChange={setColOrder}
                  getRowId={(row) => row.id}
                  classes={s}
                />
                <button
                  onClick={() =>
                    setColOrder([
                      "name",
                      "email",
                      "role",
                      "status",
                      "department",
                      "joinDate",
                    ])
                  }
                  className={`text-xs cursor-pointer text-cl-accent hover:text-cl-accent dark:text-cl-accent dark:hover:text-cl-accent`}
                >
                  Reset order
                </button>
              </div>
            );
          };
          return <ColumnReorderDemo />;
        })()}
        <p
          className={`mt-3 text-sm text-cl-text-secondary`}
        >
          Reorder columns via{" "}
          <code
            className={`px-1 rounded bg-cl-bg-elevated`}
          >
            columnOrder
          </code>{" "}
          and{" "}
          <code
            className={`px-1 rounded bg-cl-bg-elevated`}
          >
            onColumnOrderChange
          </code>
          . Enable with{" "}
          <code
            className={`px-1 rounded bg-cl-bg-elevated`}
          >
            enableColumnReordering
          </code>
          .
        </p>
      </Section>

      <Section title="Row Grouping" isDarkMode={dark}>
        {(() => {
          const GroupByDemo = () => {
            const [groupCols, setGroupCols] = React.useState<string[]>([
              "department",
            ]);
            const toggleGroup = (col: string) =>
              setGroupCols((prev) =>
                prev.includes(col)
                  ? prev.filter((c) => c !== col)
                  : [...prev, col],
              );
            return (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs text-cl-text-tertiary`}
                  >
                    Group by:
                  </span>
                  {["department", "role", "status"].map((col) => (
                    <button
                      key={col}
                      onClick={() => toggleGroup(col)}
                      className={`px-2.5 py-1 rounded-cl-md text-xs cursor-pointer transition-colors ${groupCols.includes(col) ? (dark ? "bg-cl-accent/20 text-cl-accent" : "bg-cl-accent/10 text-cl-accent") : dark ? "bg-cl-bg-hover text-cl-text-tertiary hover:bg-cl-bg-hover" : "bg-cl-bg-hover text-cl-text-secondary hover:bg-cl-bg-hover"}`}
                    >
                      <span className="capitalize">{col}</span>
                    </button>
                  ))}
                </div>
                <Table
                  columns={columns}
                  data={sampleData}
                  groupBy={groupCols}
                  getRowId={(row) => row.id}
                  classes={{
                    ...s,
                    ...s,
                    groupHeader: dark
                      ? "bg-cl-bg-hover font-semibold text-cl-text-secondary"
                      : "bg-cl-bg-hover font-semibold text-cl-text",
                  }}
                />
              </div>
            );
          };
          return <GroupByDemo />;
        })()}
        <p
          className={`mt-3 text-sm text-cl-text-secondary`}
        >
          Group rows by column values via{" "}
          <code
            className={`px-1 rounded bg-cl-bg-elevated`}
          >
            groupBy
          </code>
          . Style grouped headers with{" "}
          <code
            className={`px-1 rounded bg-cl-bg-elevated`}
          >
            classes.groupHeader
          </code>
          .
        </p>
      </Section>

      <Section title="Mobile Card Layout" isDarkMode={dark}>
        {(() => {
          const MobileCardDemo = () => (
            <div className="space-y-3">
              <p
                className={`text-xs text-cl-text-tertiary`}
              >
                Resize below 768px to see cards, or view the forced preview
                below.
              </p>
              <div
                className="max-w-[360px] border-cl-border rounded-cl-lg overflow-hidden mx-auto"
                style={{
                  borderColor: dark ? "rgba(255,255,255,0.06)" : "#e5e7eb",
                }}
              >
                <Table
                  columns={columns}
                  data={sampleData.slice(0, 3)}
                  getRowId={(row) => row.id}
                  responsiveBreakpoint={9999}
                  renderMobileCard={(row) => (
                    <div
                      className={`p-4 border-b last:border-b-0 border-cl-border`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`font-semibold text-sm text-cl-text`}
                        >
                          {row.name}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${row.status === "active" ? (dark ? "bg-cl-success/15 text-cl-success" : "bg-cl-success/15 text-cl-success") : row.status === "pending" ? (dark ? "bg-cl-warning/15 text-cl-warning" : "bg-cl-warning/15 text-cl-warning") : dark ? "bg-cl-text/15 text-cl-text-tertiary" : "bg-cl-bg-hover text-cl-text-secondary"}`}
                        >
                          {row.status}
                        </span>
                      </div>
                      <div
                        className={`space-y-1 text-xs text-cl-text-secondary`}
                      >
                        <p>{row.email}</p>
                        <p>
                          {row.role} &middot; {row.department}
                        </p>
                      </div>
                    </div>
                  )}
                  classes={{
                    ...s,
                    ...s,
                    mobileCard: dark ? "bg-cl-bg" : "bg-white",
                  }}
                />
              </div>
            </div>
          );
          return <MobileCardDemo />;
        })()}
        <p
          className={`mt-3 text-sm text-cl-text-secondary`}
        >
          Set{" "}
          <code
            className={`px-1 rounded bg-cl-bg-elevated`}
          >
            responsiveBreakpoint
          </code>{" "}
          and{" "}
          <code
            className={`px-1 rounded bg-cl-bg-elevated`}
          >
            renderMobileCard
          </code>{" "}
          to switch to card layout below a viewport width.
        </p>
      </Section>

      <Section title="Select All Mode (Page vs All)" isDarkMode={dark}>
        {(() => {
          const SelectAllDemo = () => {
            const [selectedPage, setSelectedPage] = React.useState<string[]>(
              [],
            );
            const [selectedAll, setSelectedAll] = React.useState<string[]>([]);
            return (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p
                    className={`text-xs font-medium text-cl-text-secondary`}
                  >
                    selectAllMode=&quot;page&quot; (default) —{" "}
                    {selectedPage.length} selected
                  </p>
                  <Table
                    columns={columns}
                    data={sampleData.slice(0, 5)}
                    getRowId={(row) => row.id}
                    selectionMode="multiple"
                    selectedRowIds={selectedPage}
                    onSelectionChange={setSelectedPage}
                    selectAllMode="page"
                    classes={s}
                    density="compact"
                  />
                </div>
                <div className="space-y-2">
                  <p
                    className={`text-xs font-medium text-cl-text-secondary`}
                  >
                    selectAllMode=&quot;all&quot; — {selectedAll.length}{" "}
                    selected
                  </p>
                  <Table
                    columns={columns}
                    data={sampleData}
                    getRowId={(row) => row.id}
                    selectionMode="multiple"
                    selectedRowIds={selectedAll}
                    onSelectionChange={setSelectedAll}
                    selectAllMode="all"
                    classes={s}
                    density="compact"
                  />
                </div>
              </div>
            );
          };
          return <SelectAllDemo />;
        })()}
        <p
          className={`mt-3 text-sm text-cl-text-secondary`}
        >
          Control what the header checkbox selects with{" "}
          <code
            className={`px-1 rounded bg-cl-bg-elevated`}
          >
            selectAllMode
          </code>
          . &quot;page&quot; selects only visible rows. &quot;all&quot; selects
          every row.
        </p>
      </Section>

      <Section title="Save View (Presets)" isDarkMode={dark}>
        {(() => {
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
              joinDate: true,
            });
            return (
              <div className="space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() =>
                      setSavedViews((prev) => [
                        ...prev,
                        {
                          name: `View ${prev.length + 1}`,
                          view: {
                            sorting: sortState,
                            columnVisibility: visState,
                          },
                        },
                      ])
                    }
                    className={`px-3 py-1.5 text-xs rounded-cl-md cursor-pointer transition-colors bg-cl-accent/10 text-cl-accent hover:bg-cl-accent/10 dark:bg-cl-accent/20 dark:text-cl-accent dark:hover:bg-cl-accent/30`}
                  >
                    Save current view
                  </button>
                  {savedViews.map((sv, i) => (
                    <button
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
                            joinDate: true,
                          },
                        );
                      }}
                      className={`px-2.5 py-1 text-xs rounded-cl-md cursor-pointer bg-cl-bg-hover text-cl-text-secondary hover:bg-cl-bg-hover dark:bg-cl-bg-hover dark:text-cl-text-secondary dark:hover:bg-cl-bg-hover`}
                    >
                      {sv.name}
                    </button>
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
                  onSaveView={(view) =>
                    setSavedViews((prev) => [
                      ...prev,
                      {
                        name: `Auto ${prev.length + 1}`,
                        view: view as unknown as Record<string, unknown>,
                      },
                    ])
                  }
                  classes={s}
                />
                <p
                  className={`text-xs text-cl-text-tertiary`}
                >
                  {savedViews.length === 0
                    ? 'Sort or hide columns, then click "Save current view".'
                    : `${savedViews.length} view(s) saved. Click to restore.`}
                </p>
              </div>
            );
          };
          return <SaveViewDemo />;
        })()}
        <p
          className={`mt-3 text-sm text-cl-text-secondary`}
        >
          Use{" "}
          <code
            className={`px-1 rounded bg-cl-bg-elevated`}
          >
            onSaveView
          </code>{" "}
          to capture the current table state as a{" "}
          <code
            className={`px-1 rounded bg-cl-bg-elevated`}
          >
            TableView
          </code>{" "}
          object.
        </p>
      </Section>

      <Section title="Table Props" isDarkMode={dark}>
        <div className={c.card}>
        <PropsTable isDarkMode={dark}>
          <PropRow
            name="columns"
            type="ColumnDef[]"
            description="TanStack table column definitions"
            isDarkMode={dark}
          />
          <PropRow
            name="COLUMNS"
            type="ColumnDef[]"
            description="Alternative to columns prop"
            isDarkMode={dark}
          />
          <PropRow
            name="data"
            type="TData[]"
            description="Table data array"
            isDarkMode={dark}
          />
          <PropRow
            name="COLUMNS_DATA"
            type="TData[]"
            description="Alternative to data prop"
            isDarkMode={dark}
          />
          <PropRow
            name="loading"
            type="boolean"
            defaultVal="false"
            description="Show loading shimmer state"
            isDarkMode={dark}
          />
          <PropRow
            name="showHeader"
            type="boolean"
            defaultVal="true"
            description="Show/hide table header"
            isDarkMode={dark}
          />
          <PropRow
            name="tableHeader"
            type="boolean"
            description="Alternative to showHeader prop"
            isDarkMode={dark}
          />
          <PropRow
            name="maxWidth"
            type="string | number"
            description="Maximum width with horizontal scroll"
            isDarkMode={dark}
          />
          <PropRow
            name="maxHeight"
            type="string | number"
            description="Maximum height with vertical scroll"
            isDarkMode={dark}
          />
          <PropRow
            name="minHeight"
            type="string | number"
            description="Minimum height of the table"
            isDarkMode={dark}
          />
          <PropRow
            name="hideVerticalScrollbar"
            type="boolean"
            defaultVal="false"
            description="Hide vertical scrollbar while keeping scroll"
            isDarkMode={dark}
          />
          <PropRow
            name="hideHorizontalScrollbar"
            type="boolean"
            defaultVal="false"
            description="Hide horizontal scrollbar while keeping scroll"
            isDarkMode={dark}
          />
          <PropRow
            name="stickyHeader"
            type="boolean"
            defaultVal="false"
            description="Make header sticky during vertical scroll"
            isDarkMode={dark}
          />
          <PropRow
            name="pinnedColumns"
            type="string[]"
            defaultVal="[]"
            description="Column IDs to pin left"
            isDarkMode={dark}
          />
          <PropRow
            name="onPinColumn"
            type="(columnId, isPinned) => void"
            description="Handler when column is pinned/unpinned"
            isDarkMode={dark}
          />
          <PropRow
            name="pinnableColumns"
            type="string[]"
            defaultVal="all"
            description="Columns that can be pinned"
            isDarkMode={dark}
          />
          <PropRow
            name="maxPinnedColumns"
            type="number"
            defaultVal="3"
            description="Maximum pinnable columns (1-5)"
            isDarkMode={dark}
          />
          <PropRow
            name="getRowId"
            type="(row) => string"
            description="Get unique row ID for selection"
            isDarkMode={dark}
          />
          <PropRow
            name="selectedRowId"
            type="string | null"
            description="Currently selected row ID"
            isDarkMode={dark}
          />
          <PropRow
            name="onRowClick"
            type="(row) => void"
            description="Row click handler"
            isDarkMode={dark}
          />
          <PropRow
            name="onRowHover"
            type="(index, ref) => void"
            description="Row hover handler for floating actions"
            isDarkMode={dark}
          />
          <PropRow
            name="floatingActions"
            type="ReactNode"
            description="Floating action buttons component"
            isDarkMode={dark}
          />
          <PropRow
            name="isFloatingActionsHovered"
            type="boolean"
            defaultVal="false"
            description="Whether floating actions are hovered"
            isDarkMode={dark}
          />
          <PropRow
            name="isPopupOpen"
            type="boolean"
            defaultVal="false"
            description="Whether a popup is open (prevents hover reset)"
            isDarkMode={dark}
          />
          <PropRow
            name="emptyContent"
            type="ReactNode"
            description="Custom empty state content"
            isDarkMode={dark}
          />
          <PropRow
            name="ariaLabel"
            type="string"
            defaultVal='"Data table"'
            description="Accessibility label for the table"
            isDarkMode={dark}
          />
          <PropRow
            name="shimmerRowCount"
            type="number"
            defaultVal="10"
            description="Number of shimmer rows when loading"
            isDarkMode={dark}
          />
          <PropRow
            name="PinIcon"
            type="ComponentType"
            defaultVal="default"
            description="Custom icon for unpinned state"
            isDarkMode={dark}
          />
          <PropRow
            name="PinnedIcon"
            type="ComponentType"
            defaultVal="PinIcon"
            description="Custom icon for pinned state"
            isDarkMode={dark}
          />
          <PropRow
            name="onCursorPosition"
            type="(pos) => void"
            description="Cursor position callback"
            isDarkMode={dark}
          />
          <PropRow
            name="onCursorOverHeader"
            type="(bool) => void"
            description="Cursor over header callback"
            isDarkMode={dark}
          />
          <PropRow
            name="children"
            type="ReactNode"
            description="Children rendered before table"
            isDarkMode={dark}
          />
          <PropRow
            name="sortable"
            type="boolean"
            defaultVal="false"
            description="Enable column sorting on click"
            isDarkMode={dark}
          />
          <PropRow
            name="sorting"
            type="SortingState"
            description="Controlled sorting state array"
            isDarkMode={dark}
          />
          <PropRow
            name="onSortingChange"
            type="(sorting) => void"
            description="Callback when sorting changes"
            isDarkMode={dark}
          />
          <PropRow
            name="manualSorting"
            type="boolean"
            defaultVal="false"
            description="Disable local sorting (server-side mode)"
            isDarkMode={dark}
          />
          <PropRow
            name="selectionMode"
            type='"single" | "multiple" | "none"'
            defaultVal='"none"'
            description="Row selection mode with checkboxes"
            isDarkMode={dark}
          />
          <PropRow
            name="selectedRowIds"
            type="string[]"
            description="Controlled selected row IDs"
            isDarkMode={dark}
          />
          <PropRow
            name="onSelectionChange"
            type="(ids) => void"
            description="Callback when selection changes"
            isDarkMode={dark}
          />
          <PropRow
            name="selectAllMode"
            type='"page" | "all"'
            defaultVal='"page"'
            description="Whether select-all applies to current page or all rows"
            isDarkMode={dark}
          />
          <PropRow
            name="globalFilter"
            type="string"
            description="Global search filter value"
            isDarkMode={dark}
          />
          <PropRow
            name="onGlobalFilterChange"
            type="(value) => void"
            description="Callback when global filter changes"
            isDarkMode={dark}
          />
          <PropRow
            name="columnFilters"
            type="ColumnFiltersState"
            description="Controlled column filter state"
            isDarkMode={dark}
          />
          <PropRow
            name="onColumnFiltersChange"
            type="(filters) => void"
            description="Callback when column filters change"
            isDarkMode={dark}
          />
          <PropRow
            name="enableColumnFilters"
            type="boolean"
            defaultVal="false"
            description="Enable per-column filter inputs"
            isDarkMode={dark}
          />
          <PropRow
            name="expandable"
            type="boolean"
            defaultVal="false"
            description="Enable row expansion"
            isDarkMode={dark}
          />
          <PropRow
            name="expandedRowIds"
            type="string[]"
            description="Controlled expanded row IDs"
            isDarkMode={dark}
          />
          <PropRow
            name="onExpandedChange"
            type="(ids) => void"
            description="Callback when expanded rows change"
            isDarkMode={dark}
          />
          <PropRow
            name="renderExpandedRow"
            type="(row) => ReactNode"
            description="Render function for expanded row content"
            isDarkMode={dark}
          />
          <PropRow
            name="columnVisibility"
            type="Record<string, boolean>"
            description="Controlled column visibility map"
            isDarkMode={dark}
          />
          <PropRow
            name="onColumnVisibilityChange"
            type="(vis) => void"
            description="Callback when column visibility changes"
            isDarkMode={dark}
          />
          <PropRow
            name="striped"
            type="boolean"
            defaultVal="false"
            description="Alternate row background colors"
            isDarkMode={dark}
          />
          <PropRow
            name="density"
            type='"compact" | "comfortable" | "spacious"'
            defaultVal='"comfortable"'
            description="Controls cell padding density"
            isDarkMode={dark}
          />
          <PropRow
            name="pinnedRightColumns"
            type="string[]"
            defaultVal="[]"
            description="Column IDs to pin to the right"
            isDarkMode={dark}
          />
          <PropRow
            name="editable"
            type="boolean"
            defaultVal="false"
            description="Enable inline cell editing on double-click"
            isDarkMode={dark}
          />
          <PropRow
            name="editableColumns"
            type="string[]"
            description="Column IDs that are editable (all if not set)"
            isDarkMode={dark}
          />
          <PropRow
            name="onCellEdit"
            type="(rowId, columnId, value) => void"
            description="Callback when a cell is edited"
            isDarkMode={dark}
          />
          <PropRow
            name="enableColumnResizing"
            type="boolean"
            defaultVal="false"
            description="Enable column resizing via drag handles"
            isDarkMode={dark}
          />
          <PropRow
            name="columnSizing"
            type="ColumnSizingState"
            description="Controlled column sizing state"
            isDarkMode={dark}
          />
          <PropRow
            name="onColumnSizingChange"
            type="(sizing) => void"
            description="Callback when column sizing changes"
            isDarkMode={dark}
          />
          <PropRow
            name="manualPagination"
            type="boolean"
            defaultVal="false"
            description="Disable local pagination (server-side mode)"
            isDarkMode={dark}
          />
          <PropRow
            name="manualFiltering"
            type="boolean"
            defaultVal="false"
            description="Disable local filtering (server-side mode)"
            isDarkMode={dark}
          />
          <PropRow
            name="enableRowDragDrop"
            type="boolean"
            defaultVal="false"
            description="Enable row drag-and-drop reordering"
            isDarkMode={dark}
          />
          <PropRow
            name="onRowReorder"
            type="(fromIndex, toIndex) => void"
            description="Callback when a row is reordered"
            isDarkMode={dark}
          />
          <PropRow
            name="showFooter"
            type="boolean"
            defaultVal="false"
            description="Show the table footer (tfoot)"
            isDarkMode={dark}
          />
          <PropRow
            name="footerContent"
            type="ReactNode"
            description="Custom content for the footer"
            isDarkMode={dark}
          />
          <PropRow
            name="onContextMenu"
            type="(event, row) => void"
            description="Right-click handler for rows"
            isDarkMode={dark}
          />
          <PropRow
            name="enableCopyOnClick"
            type="boolean"
            defaultVal="false"
            description="Enable single-click cell copy to clipboard"
            isDarkMode={dark}
          />
          <PropRow
            name="onCellCopy"
            type="(value, rowId, columnId) => void"
            description="Callback after cell value is copied"
            isDarkMode={dark}
          />
          <PropRow
            name="enableInfiniteScroll"
            type="boolean"
            defaultVal="false"
            description="Enable infinite scroll loading"
            isDarkMode={dark}
          />
          <PropRow
            name="onLoadMore"
            type="() => void"
            description="Callback when user scrolls near bottom"
            isDarkMode={dark}
          />
          <PropRow
            name="hasMore"
            type="boolean"
            defaultVal="false"
            description="Whether more data is available to load"
            isDarkMode={dark}
          />
          <PropRow
            name="loadingMore"
            type="boolean"
            defaultVal="false"
            description="Whether more data is currently loading"
            isDarkMode={dark}
          />
          <PropRow
            name="showSearch"
            type="boolean"
            defaultVal="false"
            description="Show built-in search bar above table"
            isDarkMode={dark}
          />
          <PropRow
            name="searchPlaceholder"
            type="string"
            defaultVal='"Search..."'
            description="Placeholder text for the search bar"
            isDarkMode={dark}
          />
          <PropRow
            name="onExport"
            type="(format) => void"
            description="Callback when export is requested"
            isDarkMode={dark}
          />
          <PropRow
            name="responsiveBreakpoint"
            type="number"
            description="Viewport width for mobile card layout"
            isDarkMode={dark}
          />
          <PropRow
            name="renderMobileCard"
            type="(row) => ReactNode"
            description="Render function for mobile card layout"
            isDarkMode={dark}
          />
          <PropRow
            name="groupBy"
            type="string[]"
            description="Column IDs to group rows by"
            isDarkMode={dark}
          />
          <PropRow
            name="onGroupByChange"
            type="(groupBy) => void"
            description="Callback when group-by changes"
            isDarkMode={dark}
          />
          <PropRow
            name="onSaveView"
            type="(view) => void"
            description="Callback to save current table view state"
            isDarkMode={dark}
          />
          <PropRow
            name="classes"
            type="TableClasses"
            description="Slot class overrides for all table sub-elements (preferred over individual className props)"
            isDarkMode={dark}
          />
          <PropRow
            name="unstyled"
            type="boolean"
            defaultVal="false"
            description="Remove all default styling"
            isDarkMode={dark}
          />
          <PropRow
            name="style"
            type="CSSProperties"
            description="Inline styles for root container"
            isDarkMode={dark}
          />
          <PropRow
            name="enableColumnReordering"
            type="boolean"
            defaultVal="false"
            description="Enable column reordering via controlled order"
            isDarkMode={dark}
          />
          <PropRow
            name="columnOrder"
            type="string[]"
            description="Controlled column order (array of column IDs)"
            isDarkMode={dark}
          />
          <PropRow
            name="onColumnOrderChange"
            type="(order) => void"
            description="Callback when column order changes"
            isDarkMode={dark}
          />
          <PropRow
            name="expandColumnPosition"
            type={'"left" | "right"'}
            defaultVal='"left"'
            description="Place the expand toggle on the left or right side"
            isDarkMode={dark}
          />
          <PropRow
            name="expandOnRowClick"
            type="boolean"
            defaultVal="false"
            description="Make the entire row clickable to toggle expansion"
            isDarkMode={dark}
          />
          <PropRow
            name="dragColumnPosition"
            type={'"left" | "right"'}
            defaultVal='"left"'
            description="Place the drag handle on the left or right side"
            isDarkMode={dark}
          />
          <PropRow
            name="filterableColumns"
            type="Record<string, { options, multi? }>"
            description="Columns with filter options shown via header icon"
            isDarkMode={dark}
          />
          <PropRow
            name="renderColumnFilter"
            type="(columnId, values, setValues) => ReactNode"
            description="Custom filter dropdown content per column"
            isDarkMode={dark}
          />
          <PropRow
            name="searchIconPosition"
            type={'"left" | "right" | "none"'}
            defaultVal='"left"'
            description="Position of the search icon in built-in search bar"
            isDarkMode={dark}
          />
          <PropRow
            name="stripedClassName"
            type="string"
            description="Custom class for striped alternating rows"
            isDarkMode={dark}
          />
          <PropRow
            name="checkboxColor"
            type="string"
            description="Accent color for the default selection checkbox"
            isDarkMode={dark}
          />
          <PropRow
            name="CheckboxIcon"
            type="ComponentType"
            description="Custom checkbox icon for multi-row selection"
            isDarkMode={dark}
          />
          <PropRow
            name="ExpandIcon"
            type="ComponentType"
            description="Custom expand/collapse icon component"
            isDarkMode={dark}
          />
          <PropRow
            name="FilterIcon"
            type="ComponentType"
            description="Custom filter icon shown in filterable column headers"
            isDarkMode={dark}
          />
          <PropRow
            name="DragHandleIcon"
            type="ComponentType"
            description="Custom drag handle icon for row reordering"
            isDarkMode={dark}
          />
          <PropRow
            name="SearchIcon"
            type="ComponentType"
            description="Custom search icon for built-in search bar"
            isDarkMode={dark}
          />
          <PropRow
            name="onSearchClear"
            type="() => void"
            description="Callback when search clear button is clicked"
            isDarkMode={dark}
          />
          <PropRow
            name="infiniteEndContent"
            type="ReactNode"
            description="Content shown when all infinite scroll data is loaded"
            isDarkMode={dark}
          />
          <PropRow
            name="loadingMoreContent"
            type="ReactNode"
            description="Custom loading indicator for infinite scroll"
            isDarkMode={dark}
          />
        </PropsTable>
        </div>
      </Section>

      <Section title="Pagination Props" isDarkMode={dark}>
        <div className={c.card}>
        <PropsTable isDarkMode={dark}>
          <PropRow
            name="value"
            type="number"
            description="Current active page (1-indexed, controlled)"
            isDarkMode={dark}
          />
          <PropRow
            name="defaultValue"
            type="number"
            defaultVal="1"
            description="Initial page for uncontrolled usage"
            isDarkMode={dark}
          />
          <PropRow
            name="totalPages"
            type="number"
            description="Total number of pages"
            isDarkMode={dark}
          />
          <PropRow
            name="rowsPerPage"
            type="number"
            description="Current rows per page"
            isDarkMode={dark}
          />
          <PropRow
            name="rowOptions"
            type="number[]"
            defaultVal="[5,10,25,50]"
            description="Available rows per page options"
            isDarkMode={dark}
          />
          <PropRow
            name="onValueChange"
            type="(page) => void"
            description="Page change handler"
            isDarkMode={dark}
          />
          <PropRow
            name="onRowsPerPageChange"
            type="(rows) => void"
            description="Rows per page change handler"
            isDarkMode={dark}
          />
          <PropRow
            name="showRowsPerPage"
            type="boolean"
            defaultVal="true"
            description="Show rows per page selector"
            isDarkMode={dark}
          />
          <PropRow
            name="rowsPerPageLabel"
            type="string"
            defaultVal='"rows"'
            description="Label after row count"
            isDarkMode={dark}
          />
          <PropRow
            name="classes"
            type="PaginationClasses"
            defaultVal="{}"
            description="Slot class overrides (17 slots: root, nav, pageButtons, pageButton, activePageButton, navButton, ellipsis, selector, selectorButton, selectorDropdown, selectorOption, label, etc.)"
            isDarkMode={dark}
          />
          <PropRow
            name="unstyled"
            type="boolean"
            defaultVal="false"
            description="Strip all default classes"
            isDarkMode={dark}
          />
        </PropsTable>
        </div>
      </Section>

      <Section title="Table Styling Props" isDarkMode={dark}>
        <div className={c.card}>
        <PropsTable isDarkMode={dark}>
          <PropRow
            name="containerClassName"
            type="string"
            description="Root container wrapper"
            isDarkMode={dark}
          />
          <PropRow
            name="tableClassName"
            type="string"
            description="Table element (default for both pinned/unpinned)"
            isDarkMode={dark}
          />
          <PropRow
            name="pinnedTableClassName"
            type="string"
            description="Pinned columns table element"
            isDarkMode={dark}
          />
          <PropRow
            name="unpinnedTableClassName"
            type="string"
            description="Unpinned columns table element"
            isDarkMode={dark}
          />
          <PropRow
            name="headerClassName"
            type="string"
            description="thead element"
            isDarkMode={dark}
          />
          <PropRow
            name="headerRowClassName"
            type="string"
            description="Header row (tr) element"
            isDarkMode={dark}
          />
          <PropRow
            name="headerCellClassName"
            type="string"
            description="th elements"
            isDarkMode={dark}
          />
          <PropRow
            name="headerCellHoverClassName"
            type="string"
            description="th hover state"
            isDarkMode={dark}
          />
          <PropRow
            name="headerCellContentClassName"
            type="string"
            description="Header cell content wrapper"
            isDarkMode={dark}
          />
          <PropRow
            name="bodyClassName"
            type="string"
            description="tbody element"
            isDarkMode={dark}
          />
          <PropRow
            name="rowClassName"
            type="string"
            description="tr elements (unselected)"
            isDarkMode={dark}
          />
          <PropRow
            name="selectedRowClassName"
            type="string"
            description="tr elements (selected)"
            isDarkMode={dark}
          />
          <PropRow
            name="cellClassName"
            type="string"
            description="td elements"
            isDarkMode={dark}
          />
          <PropRow
            name="pinnedContainerClassName"
            type="string"
            description="Pinned columns container"
            isDarkMode={dark}
          />
          <PropRow
            name="unpinnedContainerClassName"
            type="string"
            description="Scrollable columns container"
            isDarkMode={dark}
          />
          <PropRow
            name="emptyClassName"
            type="string"
            description="Empty state container"
            isDarkMode={dark}
          />
          <PropRow
            name="pinButtonClassName"
            type="string"
            description="Pin button (unpinned state)"
            isDarkMode={dark}
          />
          <PropRow
            name="pinnedPinButtonClassName"
            type="string"
            description="Pin button (pinned state)"
            isDarkMode={dark}
          />
          <PropRow
            name="pinIconClassName"
            type="string"
            description="Pin icon (unpinned state)"
            isDarkMode={dark}
          />
          <PropRow
            name="pinIconHoverClassName"
            type="string"
            description="Pin icon hover (unpinned)"
            isDarkMode={dark}
          />
          <PropRow
            name="pinnedPinIconClassName"
            type="string"
            description="Pin icon (pinned state)"
            isDarkMode={dark}
          />
          <PropRow
            name="pinnedPinIconHoverClassName"
            type="string"
            description="Pin icon hover (pinned)"
            isDarkMode={dark}
          />
          <PropRow
            name="shimmerClassName"
            type="string"
            description="Shimmer container class"
            isDarkMode={dark}
          />
          <PropRow
            name="shimmerRowClassName"
            type="string"
            description="Shimmer row wrapper class"
            isDarkMode={dark}
          />
          <PropRow
            name="shimmerCellClassName"
            type="string"
            description="Shimmer cell wrapper class"
            isDarkMode={dark}
          />
          <PropRow
            name="shimmerBarClassName"
            type="string"
            description="Shimmer bar element class"
            isDarkMode={dark}
          />
        </PropsTable>
        </div>
      </Section>

      <Section title="TableShimmer Props" isDarkMode={dark}>
        <div className={c.card}>
        <PropsTable isDarkMode={dark}>
          <PropRow
            name="rowCount"
            type="number"
            defaultVal="10"
            description="Number of shimmer rows"
            isDarkMode={dark}
          />
          <PropRow
            name="className"
            type="string"
            defaultVal="default"
            description="Container class (via shimmerClassName on Table)"
            isDarkMode={dark}
          />
          <PropRow
            name="rowClassName"
            type="string"
            defaultVal="default"
            description="Row wrapper class (via shimmerRowClassName)"
            isDarkMode={dark}
          />
          <PropRow
            name="cellClassName"
            type="string"
            defaultVal="default"
            description="Cell wrapper class (via shimmerCellClassName)"
            isDarkMode={dark}
          />
          <PropRow
            name="shimmerClassName"
            type="string"
            defaultVal="default"
            description="Shimmer bar class (via shimmerBarClassName)"
            isDarkMode={dark}
          />
        </PropsTable>
        <p
          className={`mt-3 text-sm text-cl-text-secondary`}
        >
          Note: When using Table component, pass these props with the "shimmer"
          prefix (e.g.,{" "}
          <code
            className={`px-1 rounded bg-cl-bg-elevated`}
          >
            shimmerClassName
          </code>
          ,{" "}
          <code
            className={`px-1 rounded bg-cl-bg-elevated`}
          >
            shimmerRowClassName
          </code>
          , etc.)
        </p>
        </div>
      </Section>

      <Section
        title="Core API (PropsTable)"
        description="Shared documentation layout for primary Table props."
        isDarkMode={dark}
      >
        <div className={c.card}>
        <PropsTable isDarkMode={dark}>
          <PropRow
            name="columns / COLUMNS"
            type="ColumnDef[]"
            description="TanStack column definitions (or COLUMNS static export)"
            isDarkMode={dark}
          />
          <PropRow
            name="data / COLUMNS_DATA"
            type="TData[]"
            description="Row data (or COLUMNS_DATA static export)"
            isDarkMode={dark}
          />
          <PropRow
            name="loading"
            type="boolean"
            defaultVal="false"
            description="Shimmer loading state"
            isDarkMode={dark}
          />
          <PropRow
            name="ariaLabel"
            type="string"
            defaultVal='"Data table"'
            description="Accessible name for the table"
            isDarkMode={dark}
          />
          <PropRow
            name="getRowId"
            type="(row) => string"
            description="Stable row id for selection and keys"
            isDarkMode={dark}
          />
          <PropRow
            name="emptyContent"
            type="ReactNode"
            description="Custom empty state when data is empty"
            isDarkMode={dark}
          />
        </PropsTable>
        </div>
      </Section>

      {/* ─── Data Attributes ──────────────────────────────────────────── */}
      <Section
        title="Data Attributes"
        description="Use for CSS-based state styling."
        isDarkMode={dark}
      >
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow
              name="data-table-container"
              type="root"
              description="Always present on the scrollable container"
              isDarkMode={dark}
            />
            <PropRow
              name="data-testid"
              type="root"
              description="Test identifier for integration tests"
              isDarkMode={dark}
            />
            <PropRow
              name="data-pinned"
              type="cell, header"
              description='Present on pinned columns ("left" or "right")'
              isDarkMode={dark}
            />
            <PropRow
              name="data-column-index"
              type="cell, header"
              description="Zero-based column index for CSS targeting"
              isDarkMode={dark}
            />
            <PropRow
              name="data-selected"
              type="row"
              description="Present on selected rows"
              isDarkMode={dark}
            />
            <PropRow
              name="data-clickable"
              type="row"
              description="Present when onRowClick is provided"
              isDarkMode={dark}
            />
            <PropRow
              name="data-focused"
              type="cell"
              description="Present on the keyboard-focused cell"
              isDarkMode={dark}
            />
            <PropRow
              name="data-sorted"
              type="header"
              description="Present on sorted column headers ('asc' or 'desc')"
              isDarkMode={dark}
            />
            <PropRow
              name="data-expanded"
              type="row"
              description="Present on expanded rows"
              isDarkMode={dark}
            />
            <PropRow
              name="data-striped"
              type="row"
              description="Present on alternating rows when striped is enabled"
              isDarkMode={dark}
            />
            <PropRow
              name="data-editable"
              type="cell"
              description="Present on editable cells"
              isDarkMode={dark}
            />
            <PropRow
              name="data-dragging"
              type="row"
              description="Present on a row being dragged"
              isDarkMode={dark}
            />
            <PropRow
              name="data-group-header"
              type="row"
              description="Present on group header rows"
              isDarkMode={dark}
            />
          </PropsTable>
        </div>
      </Section>

      {/* ─── Accessibility ────────────────────────────────────────────── */}
      <Section
        title="Accessibility"
        description="Built-in accessibility features."
        isDarkMode={dark}
      >
        <div className={c.card}>
          <div
            className={`space-y-2 text-sm text-cl-text-secondary`}
          >
            {[
              'Table uses role="grid" with role="row", role="gridcell", and role="columnheader" for proper structure',
              "aria-label on the table element provides an accessible name for the grid landmark",
              "aria-sort on sortable column headers announces current sort direction",
              "aria-selected on focused cells indicates the active cell to screen readers",
              "aria-rowindex on each row for virtual scrolling context",
              "Full keyboard grid navigation between cells, rows, and headers",
              "Pin button includes aria-label describing the pin action and target column",
            ].map((text) => (
              <p key={text} className="flex items-start gap-2">
                <span
                  className={`mt-0.5 shrink-0 text-cl-success`}
                >
                  &#10003;
                </span>
                <span>{text}</span>
              </p>
            ))}
          </div>
        </div>
        <div className={`${c.card} mt-3`}>
          <p
            className={`text-xs font-semibold mb-3 text-cl-text-secondary`}
          >
            Keyboard Reference
          </p>
          <div
            className={`space-y-2 text-sm text-cl-text-secondary`}
          >
            {[
              ["Arrow keys", "Navigate between cells in the grid"],
              ["Escape", "Clear cell focus and exit grid navigation"],
              ["Tab", "Exit the grid and move to next focusable element"],
            ].map(([key, desc]) => (
              <div key={key} className="flex items-center gap-3">
                <kbd className={c.kbd}>
                  {key}
                </kbd>
                <span>{desc}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <DocControlledPattern
        isDarkMode={dark}
        summary="Table is data-in: pass `columns` and `data` from TanStack definitions. Selection, pagination, and pinning are controlled via props; the component does not fetch."
      />
      <DocEdgeCases
        isDarkMode={dark}
        items={[
          "Row ids must be stable for selection and virtualization.",
          "Pinned columns and horizontal scroll interact—test on small screens.",
          "Empty and loading states should be explicit for UX and SR.",
        ]}
      />
      <DocDoDont
        isDarkMode={dark}
        dos={[
          "Provide `ariaLabel` for the table landmark.",
          "Use `getRowId` when rows lack natural keys.",
          "Keep column definitions memoized to avoid unnecessary work.",
        ]}
        donts={[
          "Do not render thousands of rows without virtualization strategy.",
          "Do not put interactive elements in headers without keyboard support.",
          "Do not omit text alternatives for icon-only actions.",
        ]}
      />
    </div>
  );
};

export default TableDemo;
