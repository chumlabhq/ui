import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { createPortal } from "react-dom";
import { Table, exportTableToCSV } from "../../components/Table";
import { Pagination } from "../../components/Pagination";
import type { ColumnDef } from "@tanstack/react-table";
import type { SortingState } from "../../components/Table";
import {
  Section,
  DemoWrapper,
  PropsTable,
  PropRow,
  DocControlledPattern,
  DocEdgeCases,
  DocDoDont,
} from "./components";
import { useTheme } from "./ThemeContext";

// ─── Themed Classes ──────────────────────────────────────────────────────────

const getClasses = (dark: boolean) => ({
  card: `rounded-2xl border p-5 ${dark ? "border-white/[0.06] bg-linear-to-br from-white/[0.03] to-white/[0.01]" : "border-gray-200 bg-white shadow-sm shadow-gray-900/[0.04]"}`,
  kbd: `px-2 py-1 rounded-md text-[11px] font-mono min-w-[2.5rem] text-center font-medium ${dark ? "bg-gray-900 border border-white/10 text-gray-300 shadow-sm" : "bg-white border border-gray-200 text-gray-600 shadow-sm"}`,
  label: `text-xs font-medium ${dark ? "text-gray-500" : "text-gray-400"}`,
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
  dark = false,
  className: classNameProp,
  renderContent,
}: FloatingActionsProps<T>) {
  // Combined display state to avoid cascading renders
  const [displayState, setDisplayState] = useState<{
    show: boolean;
    top: number;
    data: T;
  } | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Update position and data when row changes (and we're visible)
  useEffect(() => {
    if (rowRef?.current && rowData !== undefined && isVisible) {
      const rowElement = rowRef.current;
      const rowRect = rowElement.getBoundingClientRect();
      const tableContainer = rowElement.closest("[data-table-container]");
      const containerRect = tableContainer?.getBoundingClientRect();

      if (containerRect) {
        const top = rowRect.top - containerRect.top + rowRect.height / 2;
        setDisplayState({
          show: true,
          top,
          data: rowData,
        });
      }
    }
  }, [rowRef, rowData, isVisible]);

  // Handle visibility changes (show immediately, hide with delay)
  useEffect(() => {
    if (isVisible) {
      // Clear any pending hide timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    } else {
      // Clear existing timeout before setting new one
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      // Delay hiding to allow moving between rows or to floating actions
      timeoutRef.current = setTimeout(() => {
        setDisplayState(null);
      }, 150);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isVisible]);

  if (!displayState?.show) return null;

  const name = getName(displayState.data);

  const defaultClassName = `z-30 flex items-center gap-0.5 backdrop-blur-sm border rounded shadow-sm px-1 py-0.5 ${dark ? "bg-gray-900/95 border-white/[0.06]" : "bg-white/95 border-gray-200"}`;

  return (
    <div
      className={classNameProp ?? defaultClassName}
      style={{
        top: displayState.top,
        transform: "translate(-50%, -50%)",
        position: "absolute",
        left: "clamp(1rem, 30%, calc(100% - 6rem))",
      }}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      {renderContent ? (
        renderContent(name, displayState.data)
      ) : (
        <>
          <button
            className={`p-1 rounded transition-colors cursor-pointer ${dark ? "text-gray-400 hover:text-blue-400 hover:bg-blue-500/10" : "text-gray-400 hover:text-blue-600 hover:bg-blue-50"}`}
            title="Edit"
            onClick={() => alert(`Edit: ${name}`)}
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            className={`p-1 rounded transition-colors cursor-pointer ${dark ? "text-gray-400 hover:text-gray-200 hover:bg-white/[0.06]" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"}`}
            title="More options"
            onClick={() => alert(`More options: ${name}`)}
          >
            <svg
              className="w-3.5 h-3.5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
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

function getTableClasses(dark: boolean) {
  return {
    container: `w-full border rounded-lg overflow-hidden ${dark ? "border-white/[0.06]" : "border-gray-200"}`,
    table: "w-full border-collapse",
    headerRow: "",
    headerCell: `px-4 py-3 text-left text-sm font-medium whitespace-nowrap border-b ${dark ? "text-gray-400 bg-[#111118] border-white/[0.06]" : "text-gray-600 bg-gray-50 border-gray-200"}`,
    body: "",
    row: `border-b transition-colors data-[clickable]:cursor-pointer ${dark ? "border-white/[0.04] hover:bg-white/[0.06]" : "border-gray-100 hover:bg-gray-100"}`,
    selectedRow: `border-b transition-colors data-[clickable]:cursor-pointer ${dark ? "border-white/[0.04] bg-blue-500/10 hover:bg-blue-500/15" : "border-gray-100 bg-blue-50 hover:bg-blue-100"}`,
    cell: `px-4 py-3 text-sm whitespace-nowrap ${dark ? "text-gray-100" : "text-gray-900"}`,
    empty: `flex items-center justify-center py-12 ${dark ? "text-gray-400" : "text-gray-500"}`,
    pinnedContainer: `shrink-0 sticky left-0 z-20 border-r-2 ${dark ? "border-blue-500/30 bg-gray-900" : "border-blue-200 bg-white"}`,
    pinnedTable: "border-collapse",
    unpinnedContainer: "min-w-0 flex-1 overflow-x-auto",
    unpinnedTable: "w-full border-collapse",
    headerCellHover: dark ? "bg-white/[0.06]" : "bg-gray-100",
    pinButton: `ml-2 p-1 rounded transition-colors ${dark ? "hover:bg-gray-700" : "hover:bg-gray-200"}`,
    pinnedPinButton: "ml-2 p-1 rounded transition-colors hover:bg-blue-100",
    pinIcon: "text-gray-400",
    pinnedPinIcon: "text-blue-600",
    shimmer: `w-full border rounded-lg overflow-hidden ${dark ? "border-white/[0.06]" : "border-gray-200"}`,
    shimmerRow: `border-b ${dark ? "border-white/[0.04]" : "border-gray-100"}`,
    shimmerCell: "px-4 py-2 h-14",
    shimmerBar: `h-full w-full bg-linear-to-r rounded animate-pulse ${dark ? "from-gray-700 via-gray-600 to-gray-700" : "from-gray-200 via-gray-300 to-gray-200"}`,
  };
}

function getPaginationClasses(dark: boolean) {
  return {
    root: "flex items-center justify-between mt-4 px-2",
    selector: "flex items-center gap-2",
    selectorButton: `flex items-center gap-1 px-2 py-1 border rounded ${dark ? "border-gray-700 bg-gray-900 hover:bg-gray-800" : "border-gray-300 bg-white hover:bg-gray-50"}`,
    selectorDropdown: `absolute bottom-full mb-1 left-0 z-50 border rounded shadow-lg min-w-[60px] ${dark ? "bg-gray-900 border-white/[0.06]" : "bg-white border-gray-200"}`,
    selectorOption: `w-full px-2 py-1 text-left text-sm ${dark ? "hover:bg-white/[0.06] data-[selected]:bg-blue-500/10 data-[selected]:font-medium" : "hover:bg-gray-100 data-[selected]:bg-blue-50 data-[selected]:font-medium"}`,
    pageButton: `px-2 py-1 text-sm ${dark ? "text-gray-400 hover:text-gray-100" : "text-gray-600 hover:text-gray-900"}`,
    activePageButton: `px-2 py-1 text-sm font-medium rounded ${dark ? "text-blue-400 bg-blue-500/10 border border-blue-500/30" : "text-blue-600 bg-blue-50 border border-blue-200"}`,
    navButton: `p-1 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed ${dark ? "text-gray-400 hover:text-gray-100" : "text-gray-600 hover:text-gray-900"}`,
    ellipsis: "px-2 text-gray-400",
    label: `text-sm ${dark ? "text-gray-400" : "text-gray-600"}`,
  };
}

// Dark/Modern pagination styles
const darkPaginationContainerStyle =
  "flex items-center justify-between mt-4 px-4 py-3 bg-gray-900 rounded-lg";
const darkPaginationRowSelectorStyle = "flex items-center gap-3";
const darkPaginationButtonStyle =
  "flex items-center gap-2 px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-md text-gray-200 hover:bg-gray-700 transition-colors";
const darkPaginationDropdownStyle =
  "absolute bottom-full mb-1 left-0 z-50 bg-gray-800 border border-gray-700 rounded-md shadow-xl min-w-[70px] overflow-hidden";
const darkPaginationOptionStyle =
  "w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 data-[selected]:bg-indigo-600 data-[selected]:text-white transition-colors";
const darkPaginationPageStyle =
  "w-8 h-8 flex items-center justify-center text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors";
const darkPaginationActivePageStyle =
  "w-8 h-8 flex items-center justify-center text-sm font-semibold text-white bg-indigo-600 rounded-md";
const darkPaginationNavStyle =
  "p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors data-[disabled]:opacity-30 data-[disabled]:cursor-not-allowed data-[disabled]:hover:bg-transparent";
const darkPaginationEllipsisStyle = "px-1 text-gray-500";
const darkPaginationLabelStyle = "text-sm text-gray-400";
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
        active: "bg-green-500/15 text-green-400",
        inactive: "bg-gray-500/15 text-gray-400",
        pending: "bg-yellow-500/15 text-yellow-400",
      }
    : {
        active: "bg-green-100 text-green-800",
        inactive: "bg-gray-100 text-gray-800",
        pending: "bg-yellow-100 text-yellow-800",
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
        excellent: "bg-emerald-500/15 text-emerald-400",
        good: "bg-blue-500/15 text-blue-400",
        average: "bg-amber-500/15 text-amber-400",
        poor: "bg-red-500/15 text-red-400",
      }
    : {
        excellent: "bg-emerald-100 text-emerald-800",
        good: "bg-blue-100 text-blue-800",
        average: "bg-amber-100 text-amber-800",
        poor: "bg-red-100 text-red-800",
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
            className={`w-11 h-11 rounded-xl overflow-hidden ${dark ? "bg-white/[0.05] ring-1 ring-white/[0.08]" : "bg-gray-100 ring-1 ring-gray-200"}`}
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
              className={`text-sm font-medium ${dark ? "text-gray-100" : "text-gray-900"}`}
            >
              {row.original.title}
            </p>
            <p
              className={`text-xs ${dark ? "text-gray-500" : "text-gray-400"}`}
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
            className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${dark ? "bg-white/[0.05] text-gray-300" : "bg-gray-100 text-gray-600"}`}
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
            className={`font-medium whitespace-nowrap ${dark ? "text-emerald-400" : "text-emerald-600"}`}
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
              className={`text-sm whitespace-nowrap ${disc > 10 ? (dark ? "text-amber-400" : "text-amber-600") : dark ? "text-gray-400" : "text-gray-500"}`}
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
              className={`text-sm ${dark ? "text-gray-300" : "text-gray-700"}`}
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
              className={`text-sm whitespace-nowrap ${stock < 10 ? (dark ? "text-red-400" : "text-red-600") : dark ? "text-gray-300" : "text-gray-700"}`}
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
            className={`text-xs font-mono whitespace-nowrap ${dark ? "text-gray-400" : "text-gray-500"}`}
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
            className={`text-sm whitespace-nowrap ${dark ? "text-gray-300" : "text-gray-700"}`}
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
            className={`text-xs whitespace-nowrap ${dark ? "text-gray-400" : "text-gray-500"}`}
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
            className={`text-xs whitespace-nowrap ${dark ? "text-gray-400" : "text-gray-500"}`}
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
                    ? "bg-red-500/15 text-red-400"
                    : "bg-red-50 text-red-600"
                  : isLow
                    ? dark
                      ? "bg-amber-500/15 text-amber-400"
                      : "bg-amber-50 text-amber-600"
                    : dark
                      ? "bg-emerald-500/15 text-emerald-400"
                      : "bg-emerald-50 text-emerald-600"
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
            className={`absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${dark ? "text-gray-500" : "text-gray-400"}`}
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
            className={`w-full h-[38px] pl-9 pr-3 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all ${dark ? "bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-500 focus:ring-blue-500/40 focus:border-blue-500/50" : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500/30 focus:border-blue-500"}`}
          />
        </div>
        {(selectedCategory || selectedStatuses.length > 0) && (
          <div className="flex items-center gap-2 flex-wrap">
            {selectedCategory && (
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full ${dark ? "bg-blue-500/15 text-blue-400" : "bg-blue-50 text-blue-700"}`}>
                {selectedCategory}
                <button onClick={() => { setSelectedCategory(""); setPage(1); setColumnFilters((prev) => prev.filter((f) => f.id !== "category")); }} className="cursor-pointer hover:opacity-70">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>
              </span>
            )}
            {selectedStatuses.map((st) => (
              <span key={st} className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full ${dark ? "bg-emerald-500/15 text-emerald-400" : "bg-emerald-50 text-emerald-700"}`}>
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
        className={`flex items-center justify-between text-xs ${dark ? "text-gray-500" : "text-gray-400"}`}
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
          shimmer: "w-full overflow-hidden",
          shimmerRow: `border-b ${dark ? "border-white/[0.03]" : "border-gray-100/50"}`,
          shimmerCell: "px-4 py-3.5 h-14",
          shimmerBar: `h-3 w-full rounded-md ${dark ? "bg-white/[0.04]" : "bg-gray-100"} bg-[length:200%_100%] animate-[shimmer_2s_ease-in-out_infinite]`,
          filterDropdown: `${dark ? "bg-gray-900 border-white/[0.08]" : "bg-white border-gray-200"}`,
        }}
      />
      {totalPages > 1 && !loading && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className={`px-3 py-1.5 text-sm rounded-lg cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${dark ? "bg-white/[0.05] text-gray-300 hover:bg-white/[0.08]" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
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
                className={`w-8 h-8 text-sm rounded-lg cursor-pointer transition-colors ${page === pageNum ? "bg-blue-600 text-white" : dark ? "text-gray-400 hover:bg-white/[0.06]" : "text-gray-600 hover:bg-gray-100"}`}
              >
                {pageNum}
              </button>
            );
          })}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className={`px-3 py-1.5 text-sm rounded-lg cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${dark ? "bg-white/[0.05] text-gray-300 hover:bg-white/[0.08]" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
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

  // Comprehensive demo handlers - state is set directly, FloatingActions handles delay internally
  const handleCompRowHover = (
    rowIndex: number | null,
    rowRef?: React.RefObject<HTMLTableRowElement>,
  ) => {
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

  // Global Search
  const [globalSearchFilter, setGlobalSearchFilter] = useState("");

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
            className={`px-2 py-1 text-xs rounded ${dark ? "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30" : "bg-blue-50 text-blue-600 hover:bg-blue-100"}`}
            onClick={() => alert("Action clicked")}
          >
            Edit
          </button>
        ),
      },
    ],
    [dark],
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
      {/* ─── Header ─────────────────────────────────────────────────────── */}
      <header className="relative overflow-hidden rounded-2xl p-6 sm:p-8">
        <div
          className={`absolute inset-0 ${
            dark
              ? "bg-linear-to-br from-indigo-950/80 via-gray-900/60 to-blue-950/50"
              : "bg-linear-to-br from-indigo-50 via-white to-blue-50/80"
          }`}
        />
        <div
          className={`absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl ${dark ? "bg-indigo-500/10" : "bg-indigo-200/40"}`}
        />
        <div
          className={`absolute -bottom-20 -left-20 w-56 h-56 rounded-full blur-3xl ${dark ? "bg-blue-500/8" : "bg-blue-200/30"}`}
        />

        <div className="relative">
          <h1
            className={`text-3xl font-bold mb-3 ${dark ? "text-white" : "text-gray-900"}`}
          >
            Table
          </h1>
          <p
            className={`text-sm leading-relaxed max-w-2xl ${dark ? "text-gray-400" : "text-gray-600"}`}
          >
            A flexible data table with sorting, pagination, row selection, and
            pinned columns.
          </p>

          <div className="mt-5">
            <pre className={`p-3.5 rounded-xl text-[13px] leading-relaxed overflow-x-auto whitespace-pre-wrap break-all ${dark ? "bg-linear-to-br from-gray-800 to-gray-900 text-gray-300 border border-white/6" : "bg-gray-50 text-gray-700 border border-gray-200"}`}>
              <code>{`import { Table } from "@chumlab/ui/table";\nimport { Pagination } from "@chumlab/ui/pagination";`}</code>
            </pre>
          </div>
        </div>
      </header>

      <Section title="Basic Usage" description="A simple table with columns and data." isDarkMode={dark}>
        <DemoWrapper isDarkMode={dark}>
          {/* Basic usage — works out-of-the-box with built-in styles */}
          <Table columns={columns} data={sampleData.slice(0, 5)} />
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
            className={`mt-2 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
          >
            Selected:{" "}
            <code
              className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
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
          className={`mt-3 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
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
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${dark ? "text-blue-400 hover:bg-blue-500/10" : "text-blue-600 hover:bg-blue-50"}`}
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
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${dark ? "text-red-400 hover:bg-red-500/10" : "text-red-500 hover:bg-red-50"}`}
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
                          className={`p-1.5 rounded transition-colors cursor-pointer ${dark ? "text-gray-400 hover:text-white hover:bg-white/[0.08]" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"}`}
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
                      className={`fixed rounded-lg border shadow-xl overflow-hidden min-w-[160px] z-[9999] ${dark ? "bg-gray-900 border-white/[0.08]" : "bg-white border-gray-200"}`}
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
                          className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm transition-colors cursor-pointer ${(item as { danger?: boolean }).danger ? (dark ? "text-red-400 hover:bg-red-500/10" : "text-red-600 hover:bg-red-50") : dark ? "text-gray-300 hover:bg-white/[0.06]" : "text-gray-700 hover:bg-gray-50"}`}
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
          className={`mt-3 text-sm space-y-2 ${dark ? "text-gray-400" : "text-gray-500"}`}
        >
          <p>
            Combines an inline <strong>Actions column</strong> (Edit, Delete)
            with a <strong>floating 3-dot menu</strong> on hover. The dropdown
            renders via portal so it never gets clipped by the table container.
          </p>
          <p>
            Uses{" "}
            <code
              className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
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
                    className={`z-30 flex items-center gap-1 backdrop-blur-sm border rounded-full shadow-lg px-1.5 py-1 ${dark ? "bg-gray-900/95 border-white/[0.08]" : "bg-white/95 border-gray-200"}`}
                    renderContent={(name) => (
                      <>
                        <button
                          className={`p-1.5 rounded-full transition-colors cursor-pointer ${dark ? "text-blue-400 hover:bg-blue-500/15" : "text-blue-500 hover:bg-blue-50"}`}
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
                          className={`p-1.5 rounded-full transition-colors cursor-pointer ${dark ? "text-emerald-400 hover:bg-emerald-500/15" : "text-emerald-500 hover:bg-emerald-50"}`}
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
                          className={`p-1.5 rounded-full transition-colors cursor-pointer ${dark ? "text-amber-400 hover:bg-amber-500/15" : "text-amber-500 hover:bg-amber-50"}`}
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
                          className={`w-px h-5 mx-0.5 ${dark ? "bg-white/[0.08]" : "bg-gray-200"}`}
                        />
                        <button
                          className={`p-1.5 rounded-full transition-colors cursor-pointer ${dark ? "text-red-400 hover:bg-red-500/15" : "text-red-400 hover:bg-red-50"}`}
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
          className={`mt-3 text-sm space-y-2 ${dark ? "text-gray-400" : "text-gray-500"}`}
        >
          <p>
            A pill-shaped floating toolbar with{" "}
            <strong>custom action triggers</strong> (Edit, Bookmark, Share,
            Delete). The{" "}
            <code
              className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
            >
              floatingActions
            </code>{" "}
            prop accepts any ReactNode via{" "}
            <code
              className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
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
          className={`mt-2 text-sm space-y-1 ${dark ? "text-gray-400" : "text-gray-500"}`}
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
              pinIcon: dark ? "text-gray-500" : "text-gray-400",
              pinnedPinIcon: dark ? "text-yellow-400" : "text-yellow-500",
            }}
          />
        </DemoWrapper>
        <div
          className={`mt-2 text-sm space-y-1 ${dark ? "text-gray-400" : "text-gray-500"}`}
        >
          <p>
            Uses a custom{" "}
            <code
              className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
            >
              PinIcon
            </code>{" "}
            (outline star) and{" "}
            <code
              className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
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
              pinnedContainer: `shrink-0 sticky left-0 z-20 border-r-4 ${dark ? "border-emerald-500/50 bg-gray-900" : "border-emerald-400 bg-white"}`,
              pinButton: `ml-2 p-1 rounded transition-colors ${dark ? "hover:bg-emerald-500/20" : "hover:bg-emerald-100"}`,
              pinnedPinButton: `ml-2 p-1 rounded transition-colors ${dark ? "hover:bg-emerald-500/20" : "hover:bg-emerald-100"}`,
              pinIcon: "text-gray-400",
              pinnedPinIcon: dark ? "text-emerald-400" : "text-emerald-600",
            }}
          />
        </DemoWrapper>
        <div
          className={`mt-2 text-sm space-y-1 ${dark ? "text-gray-400" : "text-gray-500"}`}
        >
          <p>
            The pinned separator line uses a thicker green border (
            <code
              className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
            >
              border-r-4 border-emerald-400
            </code>
            ) instead of the default blue. The pin icon color, hover background,
            and button styles are all customized via{" "}
            <code
              className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
            >
              classes
            </code>{" "}
            props.
          </p>
          <p className="mt-1">
            <span className="font-medium">Customizable via:</span>{" "}
            <code
              className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
            >
              pinnedContainerClassName
            </code>
            ,{" "}
            <code
              className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
            >
              pinButtonClassName
            </code>
            ,{" "}
            <code
              className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
            >
              pinnedPinButtonClassName
            </code>
            ,{" "}
            <code
              className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
            >
              pinIconClassName
            </code>
            ,{" "}
            <code
              className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
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
          className={`mt-3 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
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
            container: `border rounded-lg ${dark ? "border-white/[0.06]" : "border-gray-200"}`,
            table: "w-max border-collapse",
          }}
        />
        <p
          className={`mt-3 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
        >
          Table with 14 columns and{" "}
          <code
            className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
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
            container: `w-full border rounded-lg ${dark ? "border-white/[0.06]" : "border-gray-200"}`,
          }}
        />
        <p
          className={`mt-3 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
        >
          Table with{" "}
          <code
            className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
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
            container: `w-full border rounded-lg ${dark ? "border-white/[0.06]" : "border-gray-200"}`,
          }}
        />
        <p
          className={`mt-3 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
        >
          Table with{" "}
          <code
            className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
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
            container: `border rounded-lg ${dark ? "border-white/[0.06]" : "border-gray-200"}`,
            table: "w-max border-collapse",
          }}
        />
        <p
          className={`mt-3 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
        >
          Table with{" "}
          <code
            className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
          >
            maxWidth={"{900}"}
          </code>{" "}
          and{" "}
          <code
            className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
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
            container: `w-full border rounded-lg ${dark ? "border-white/[0.06]" : "border-gray-200"}`,
          }}
        />
        <p
          className={`mt-3 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
        >
          Table with{" "}
          <code
            className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
          >
            maxHeight={"{250}"}
          </code>{" "}
          and{" "}
          <code
            className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
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
            container: `border rounded-lg ${dark ? "border-white/[0.06]" : "border-gray-200"}`,
            table: "w-max border-collapse",
          }}
        />
        <p
          className={`mt-3 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
        >
          Table with both{" "}
          <code
            className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
          >
            hideVerticalScrollbar
          </code>{" "}
          and{" "}
          <code
            className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
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
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors cursor-pointer ${dark ? "text-white bg-blue-500 hover:bg-blue-400" : "text-white bg-blue-600 hover:bg-blue-700"}`}
            >
              Simulate Loading
            </button>
            <button
              onClick={() => {
                setCompIsLoading(true);
                setTimeout(() => setCompIsLoading(false), 2000);
              }}
              className={`px-3 py-1.5 text-sm font-medium border rounded-md transition-colors cursor-pointer ${dark ? "text-gray-200 bg-gray-900 border-gray-700 hover:bg-gray-800" : "text-gray-700 bg-white border-gray-300 hover:bg-gray-50"}`}
            >
              Reload Data (2s)
            </button>
            <span
              className={`text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
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
              container: `border rounded-lg ${dark ? "border-white/[0.06]" : "border-gray-200"}`,
              table: "w-max border-collapse",
              unpinnedTable: "w-max border-collapse",
              pinnedContainer: `shrink-0 sticky left-0 z-20 border-r-2 ${dark ? "border-blue-500/30 bg-gray-900" : "border-blue-200 bg-white"}`,
              unpinnedContainer: "",
              shimmer: "w-max min-w-[1600px]",
            }}
          />

          <div
            className={`text-sm space-y-1 ${dark ? "text-gray-400" : "text-gray-500"}`}
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
              className={`flex flex-col items-center justify-center py-16 px-4 bg-linear-to-b border rounded-lg ${dark ? "from-white/[0.03] to-gray-900 border-white/[0.06]" : "from-gray-50 to-white border-gray-200"}`}
            >
              {/* Custom Icon */}
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${dark ? "bg-blue-500/10" : "bg-blue-50"}`}
              >
                <svg
                  className={`w-10 h-10 ${dark ? "text-blue-400" : "text-blue-500"}`}
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
                className={`text-lg font-semibold mb-2 ${dark ? "text-gray-100" : "text-gray-900"}`}
              >
                No users found
              </h3>

              {/* Description */}
              <p
                className={`text-sm text-center max-w-sm mb-6 ${dark ? "text-gray-400" : "text-gray-500"}`}
              >
                Get started by adding your first team member. You can invite
                users via email or create accounts manually.
              </p>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${dark ? "text-white bg-blue-500 hover:bg-blue-400" : "text-white bg-blue-600 hover:bg-blue-700"}`}>
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
                  className={`px-4 py-2 text-sm font-medium border rounded-lg transition-colors ${dark ? "text-gray-200 bg-gray-900 border-gray-700 hover:bg-gray-800" : "text-gray-700 bg-white border-gray-300 hover:bg-gray-50"}`}
                >
                  Import CSV
                </button>
              </div>
            </div>
          }
          classes={s}
        />
        <p
          className={`mt-3 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
        >
          The{" "}
          <code
            className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
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
            className={`mt-3 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
          >
            Click any column header to sort. Current sorting state:{" "}
            <code
              className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
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
                className={`text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
              >
                Selected: {multiSelectedIds.length} row(s)
              </span>
              {multiSelectedIds.length > 0 && (
                <button
                  onClick={() => {
                    alert(`Deleting rows: ${multiSelectedIds.join(", ")}`);
                    setMultiSelectedIds([]);
                  }}
                  className={`px-3 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${dark ? "text-white bg-red-500 hover:bg-red-400" : "text-white bg-red-600 hover:bg-red-700"}`}
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
            className={`mt-3 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
          >
            Use{" "}
            <code
              className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
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
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all cursor-pointer ${
                  checked || indeterminate
                    ? dark
                      ? "bg-emerald-500 border-emerald-500"
                      : "bg-emerald-600 border-emerald-600"
                    : dark
                      ? "border-gray-600 hover:border-emerald-400"
                      : "border-gray-300 hover:border-emerald-500"
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
                    className={`text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
                  >
                    Selected: {customSelectedIds.length} row(s)
                  </span>
                  {customSelectedIds.length > 0 && (
                    <button
                      onClick={() => setCustomSelectedIds([])}
                      className={`px-3 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${dark ? "text-emerald-300 bg-emerald-500/15 hover:bg-emerald-500/25" : "text-emerald-700 bg-emerald-50 hover:bg-emerald-100"}`}
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
                    selectedRow: `border-b transition-colors data-[clickable]:cursor-pointer ${dark ? "border-white/[0.04] bg-emerald-500/10 hover:bg-emerald-500/15" : "border-gray-100 bg-emerald-50 hover:bg-emerald-100"}`,
                  }}
                />
              </div>
            );
          };
          return <CustomCheckboxDemo />;
        })()}
        <div
          className={`mt-3 text-sm space-y-2 ${dark ? "text-gray-400" : "text-gray-500"}`}
        >
          <p>
            Custom checkbox using the{" "}
            <code
              className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
            >
              CheckboxIcon
            </code>{" "}
            prop. The component receives{" "}
            <code
              className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
            >
              checked
            </code>
            ,{" "}
            <code
              className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
            >
              indeterminate
            </code>
            , and{" "}
            <code
              className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
            >
              className
            </code>{" "}
            props. This example uses a green rounded checkbox with a custom
            checkmark icon and a dash for indeterminate state.
          </p>
          <p>
            The{" "}
            <code
              className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
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
                  className={`w-5 h-5 transition-colors ${checked ? "text-amber-400 fill-amber-400" : dark ? "text-gray-600 fill-none hover:text-amber-400/50" : "text-gray-300 fill-none hover:text-amber-400/50"}`}
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
                    className={`text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
                  >
                    {starredIds.length > 0
                      ? `${starredIds.length} starred`
                      : "Click a star to favorite a row"}
                  </span>
                  {starredIds.length > 0 && (
                    <button
                      onClick={() => setStarredIds([])}
                      className={`px-3 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${dark ? "text-amber-300 bg-amber-500/15 hover:bg-amber-500/25" : "text-amber-700 bg-amber-50 hover:bg-amber-100"}`}
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
                    selectedRow: `border-b transition-colors data-[clickable]:cursor-pointer ${dark ? "border-white/[0.04] bg-amber-500/5 hover:bg-amber-500/10" : "border-gray-100 bg-amber-50/50 hover:bg-amber-50"}`,
                  }}
                />
              </div>
            );
          };
          return <StarSelectDemo />;
        })()}
        <div
          className={`mt-3 text-sm space-y-2 ${dark ? "text-gray-400" : "text-gray-500"}`}
        >
          <p>
            Stars instead of checkboxes using{" "}
            <code
              className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
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
                      ? "bg-violet-500 border-violet-500"
                      : "bg-violet-600 border-violet-600"
                    : dark
                      ? "border-gray-600 hover:border-violet-400"
                      : "border-gray-300 hover:border-violet-500"
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
                  className={`text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
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
                    selectedRow: `border-b transition-colors data-[clickable]:cursor-pointer ${dark ? "border-white/[0.04] bg-violet-500/10 hover:bg-violet-500/15" : "border-gray-100 bg-violet-50 hover:bg-violet-100"}`,
                  }}
                />
              </div>
            );
          };
          return <StarInsideCheckboxDemo />;
        })()}
        <div
          className={`mt-3 text-sm space-y-2 ${dark ? "text-gray-400" : "text-gray-500"}`}
        >
          <p>
            A square checkbox that shows a <strong>star icon inside</strong>{" "}
            when checked instead of the default checkmark. Uses a violet theme.
            The indeterminate state shows a dash. Demonstrates full control over
            the checked icon via{" "}
            <code
              className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
            >
              CheckboxIcon
            </code>
            .
          </p>
        </div>
      </Section>

      <Section title="Global Search (Basic)" isDarkMode={dark}>
        <DemoWrapper isDarkMode={dark}>
          <div className="space-y-3">
            <div className="relative w-full max-w-sm">
              <div
                className={`absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${dark ? "text-gray-500" : "text-gray-400"}`}
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
                value={globalSearchFilter}
                onChange={(e) => setGlobalSearchFilter(e.target.value)}
                placeholder="Search by name, email, role..."
                className={`w-full pl-9 pr-8 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all ${dark ? "bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-500 focus:ring-blue-500/40 focus:border-blue-500/50" : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500/30 focus:border-blue-500"}`}
              />
              {globalSearchFilter && (
                <button
                  onClick={() => setGlobalSearchFilter("")}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded cursor-pointer transition-colors ${dark ? "text-gray-500 hover:text-gray-300" : "text-gray-400 hover:text-gray-600"}`}
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
              globalFilter={globalSearchFilter}
              onGlobalFilterChange={setGlobalSearchFilter}
              getRowId={(row) => row.id}
              classes={s}
            />
          </div>
          <p
            className={`mt-3 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
          >
            External search input with left icon and clear button. Uses{" "}
            <code
              className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
            >
              globalFilter
            </code>{" "}
            and{" "}
            <code
              className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
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
                    className={`w-full px-4 py-2.5 text-sm border-2 rounded-xl focus:outline-none transition-all ${dark ? "bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-500 focus:border-emerald-500 focus:shadow-[0_0_0_3px_rgba(16,185,129,0.15)]" : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:shadow-[0_0_0_3px_rgba(16,185,129,0.15)]"}`}
                  />
                  <div
                    className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${filter ? (dark ? "text-emerald-400" : "text-emerald-600") : dark ? "text-gray-600" : "text-gray-300"}`}
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
          className={`mt-3 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
        >
          Search icon on the <strong>right side</strong>, thicker border (
          <code
            className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
          >
            border-2
          </code>
          ), rounded-xl shape, and emerald focus ring with shadow glow. Icon
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
                  className={`w-full max-w-xs px-3 py-2 text-sm border-b-2 border-t-0 border-l-0 border-r-0 rounded-none focus:outline-none transition-all ${dark ? "bg-transparent border-gray-700 text-gray-100 placeholder-gray-600 focus:border-blue-400" : "bg-transparent border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-600"}`}
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
          className={`mt-3 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
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
                      className={`absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none ${dark ? "text-gray-500" : "text-gray-400"}`}
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
                      className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-full focus:outline-none focus:ring-2 transition-all ${dark ? "bg-white/[0.05] border border-white/[0.08] text-gray-100 placeholder-gray-500 focus:ring-indigo-500/30 focus:border-indigo-500/40" : "bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-indigo-500/20 focus:border-indigo-400"}`}
                    />
                    {filter && (
                      <button
                        onClick={() => setFilter("")}
                        className={`absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full cursor-pointer transition-colors ${dark ? "text-gray-500 hover:text-gray-300 hover:bg-white/[0.06]" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"}`}
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
                    className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${filter ? (dark ? "bg-indigo-500/15 text-indigo-300" : "bg-indigo-50 text-indigo-600") : dark ? "bg-white/[0.05] text-gray-500" : "bg-gray-100 text-gray-500"}`}
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
          className={`mt-3 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
        >
          Pill-shaped search (
          <code
            className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
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
              <div className={`p-4 ${dark ? "bg-white/[0.03]" : "bg-gray-50"}`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span
                      className={`text-xs font-medium ${dark ? "text-gray-500" : "text-gray-400"}`}
                    >
                      Name
                    </span>
                    <p
                      className={`text-sm ${dark ? "text-gray-200" : "text-gray-800"}`}
                    >
                      {row.name}
                    </p>
                  </div>
                  <div>
                    <span
                      className={`text-xs font-medium ${dark ? "text-gray-500" : "text-gray-400"}`}
                    >
                      Email
                    </span>
                    <p
                      className={`text-sm ${dark ? "text-gray-200" : "text-gray-800"}`}
                    >
                      {row.email}
                    </p>
                  </div>
                  <div>
                    <span
                      className={`text-xs font-medium ${dark ? "text-gray-500" : "text-gray-400"}`}
                    >
                      Department
                    </span>
                    <p
                      className={`text-sm ${dark ? "text-gray-200" : "text-gray-800"}`}
                    >
                      {row.department}
                    </p>
                  </div>
                  <div>
                    <span
                      className={`text-xs font-medium ${dark ? "text-gray-500" : "text-gray-400"}`}
                    >
                      Join Date
                    </span>
                    <p
                      className={`text-sm ${dark ? "text-gray-200" : "text-gray-800"}`}
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
            className={`mt-3 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
          >
            Click the expand icon to reveal row details. Expanded rows:{" "}
            <code
              className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
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
                    className={`px-6 py-4 ${dark ? "bg-blue-500/5 border-l-2 border-blue-500/30" : "bg-blue-50/50 border-l-2 border-blue-300"}`}
                  >
                    <p
                      className={`text-sm ${dark ? "text-gray-300" : "text-gray-700"}`}
                    >
                      <strong>{row.name}</strong> works in {row.department} as a{" "}
                      {row.role}. Contact: {row.email}
                    </p>
                  </div>
                )}
                getRowId={(row) => row.id}
                classes={{
                  ...s,
                  expandIcon: dark ? "text-blue-400" : "text-blue-600",
                }}
              />
            );
          };
          return <ChevronExpandDemo />;
        })()}
        <p
          className={`mt-3 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
        >
          Custom chevron icon that <strong>rotates 90 degrees</strong> on expand
          via CSS transition. Uses{" "}
          <code
            className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
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
                      ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                      : "bg-emerald-100 border-emerald-300 text-emerald-700"
                    : dark
                      ? "bg-white/[0.05] border-gray-600 text-gray-400"
                      : "bg-gray-100 border-gray-300 text-gray-500"
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
                    className={`px-6 py-4 ${dark ? "bg-emerald-500/5" : "bg-emerald-50/50"}`}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[
                        { label: "Department", value: row.department },
                        { label: "Status", value: row.status },
                        { label: "Joined", value: row.joinDate },
                      ].map((item) => (
                        <div key={item.label}>
                          <span
                            className={`text-xs font-medium uppercase tracking-wider ${dark ? "text-gray-500" : "text-gray-400"}`}
                          >
                            {item.label}
                          </span>
                          <p
                            className={`text-sm mt-0.5 ${dark ? "text-gray-200" : "text-gray-800"}`}
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
          className={`mt-3 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
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
                    className={`px-6 py-4 ${dark ? "bg-violet-500/5 border-r-2 border-violet-500/30" : "bg-violet-50/50 border-r-2 border-violet-300"}`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${dark ? "bg-violet-500/20 text-violet-300" : "bg-violet-100 text-violet-700"}`}
                      >
                        {row.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <p
                          className={`text-sm font-medium ${dark ? "text-gray-200" : "text-gray-800"}`}
                        >
                          {row.name}
                        </p>
                        <p
                          className={`text-xs mt-0.5 ${dark ? "text-gray-400" : "text-gray-500"}`}
                        >
                          {row.role} in {row.department}
                        </p>
                        <p
                          className={`text-xs mt-0.5 ${dark ? "text-gray-500" : "text-gray-400"}`}
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
                  expandIcon: dark ? "text-violet-400" : "text-violet-600",
                }}
              />
            );
          };
          return <RightExpandDemo />;
        })()}
        <p
          className={`mt-3 text-sm space-y-1 ${dark ? "text-gray-400" : "text-gray-500"}`}
        >
          <span className="block">
            Expand column placed on the <strong>right side</strong> using{" "}
            <code
              className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
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
                    className={`px-6 py-5 ${dark ? "bg-gradient-to-r from-indigo-500/5 to-transparent" : "bg-gradient-to-r from-indigo-50 to-transparent"}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold ${dark ? "bg-indigo-500/20 text-indigo-300" : "bg-indigo-100 text-indigo-700"}`}
                        >
                          {row.name[0]}
                        </div>
                        <div>
                          <p
                            className={`text-sm font-semibold ${dark ? "text-gray-100" : "text-gray-900"}`}
                          >
                            {row.name}
                          </p>
                          <p
                            className={`text-xs ${dark ? "text-gray-400" : "text-gray-500"}`}
                          >
                            {row.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          className={`px-3 py-1.5 text-xs font-medium rounded-lg cursor-pointer transition-colors ${dark ? "bg-indigo-500/15 text-indigo-300 hover:bg-indigo-500/25" : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"}`}
                          onClick={() => alert(`View profile: ${row.name}`)}
                        >
                          View Profile
                        </button>
                        <button
                          className={`px-3 py-1.5 text-xs font-medium rounded-lg cursor-pointer transition-colors ${dark ? "bg-white/[0.05] text-gray-300 hover:bg-white/[0.08]" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
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
                    ? "text-indigo-400 hover:text-indigo-300"
                    : "text-indigo-600 hover:text-indigo-800",
                  expandedRow: dark
                    ? "border-t border-white/[0.04]"
                    : "border-t border-gray-100",
                }}
              />
            );
          };
          return <StyledExpandDemo />;
        })()}
        <p
          className={`mt-3 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
        >
          Rich expanded row content with gradient background, avatar, action
          buttons, and custom expand icon colors via{" "}
          <code
            className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
          >
            classes.expandIcon
          </code>{" "}
          and{" "}
          <code
            className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
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
                    className={`px-6 py-4 ${dark ? "bg-white/[0.02]" : "bg-gray-50/80"}`}
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
                            className={`text-[11px] font-semibold uppercase tracking-wider ${dark ? "text-gray-500" : "text-gray-400"}`}
                          >
                            {item.label}
                          </span>
                          <p
                            className={`text-sm mt-0.5 ${dark ? "text-gray-200" : "text-gray-800"}`}
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
                  expandIcon: dark ? "text-gray-500" : "text-gray-400",
                }}
              />
            );
          };
          return <RowClickExpandDemo />;
        })()}
        <div
          className={`mt-3 text-sm space-y-1 ${dark ? "text-gray-400" : "text-gray-500"}`}
        >
          <p>
            The entire row is clickable for expansion using{" "}
            <code
              className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
            >
              expandOnRowClick
            </code>
            . Click anywhere on a row to toggle its expanded state. The small
            chevron icon acts as a visual indicator, not the only click target.
          </p>
          <p>
            When{" "}
            <code
              className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
            >
              expandOnRowClick
            </code>{" "}
            is true, it takes priority over{" "}
            <code
              className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
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
                  className={`flex items-center gap-1.5 text-sm cursor-pointer ${dark ? "text-gray-300" : "text-gray-700"}`}
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
            className={`mt-3 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
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
                    className={`text-xs font-medium uppercase tracking-wider mr-1 ${dark ? "text-gray-500" : "text-gray-400"}`}
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
                            ? "bg-blue-500/15 text-blue-300 border border-blue-500/30"
                            : "bg-blue-50 text-blue-700 border border-blue-200"
                          : dark
                            ? "bg-white/[0.03] text-gray-600 border border-white/[0.06] line-through"
                            : "bg-gray-50 text-gray-400 border border-gray-200 line-through"
                      }`}
                    >
                      {labels[col]}
                    </button>
                  ))}
                  <span
                    className={`text-xs ml-2 ${dark ? "text-gray-500" : "text-gray-400"}`}
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
          className={`mt-3 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
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
                      className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${dark ? "bg-white/[0.05] text-gray-300 border border-white/[0.08] hover:bg-white/[0.08]" : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"}`}
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
                        className={dark ? "text-gray-400" : "text-gray-500"}
                      >
                        <rect x="3" y="3" width="7" height="7" />
                        <rect x="14" y="3" width="7" height="7" />
                        <rect x="14" y="14" width="7" height="7" />
                        <rect x="3" y="14" width="7" height="7" />
                      </svg>
                      Columns
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded-full ${dark ? "bg-blue-500/15 text-blue-300" : "bg-blue-50 text-blue-600"}`}
                      >
                        {visibleCount}
                      </span>
                    </button>
                    {open && (
                      <div
                        className={`absolute top-full left-0 mt-1 rounded-lg border shadow-xl overflow-hidden min-w-[180px] z-50 ${dark ? "bg-gray-900 border-white/[0.08]" : "bg-white border-gray-200"}`}
                      >
                        <div
                          className={`px-3 py-2 border-b ${dark ? "border-white/[0.06]" : "border-gray-100"}`}
                        >
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-xs font-medium ${dark ? "text-gray-400" : "text-gray-500"}`}
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
                              className={`text-xs cursor-pointer ${dark ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700"}`}
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
                            className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors cursor-pointer ${dark ? "hover:bg-white/[0.04]" : "hover:bg-gray-50"}`}
                          >
                            <div
                              className={`w-4 h-4 rounded border flex items-center justify-center ${vis[col] ? (dark ? "bg-blue-500 border-blue-500" : "bg-blue-600 border-blue-600") : dark ? "border-gray-600" : "border-gray-300"}`}
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
                                    ? "text-gray-200"
                                    : "text-gray-800"
                                  : dark
                                    ? "text-gray-500"
                                    : "text-gray-400"
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
                    className={`text-xs cursor-pointer ${dark ? "text-gray-500 hover:text-gray-300" : "text-gray-400 hover:text-gray-600"}`}
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
          className={`mt-3 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
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
                  className={`rounded-xl border p-4 ${dark ? "border-white/[0.06] bg-white/[0.02]" : "border-gray-200 bg-gray-50"}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-xs font-semibold uppercase tracking-wider ${dark ? "text-gray-400" : "text-gray-500"}`}
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
                        className={`text-xs cursor-pointer px-2 py-1 rounded ${dark ? "text-blue-400 hover:bg-blue-500/10" : "text-blue-600 hover:bg-blue-50"}`}
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
                        className={`text-xs cursor-pointer px-2 py-1 rounded ${dark ? "text-gray-400 hover:bg-white/[0.04]" : "text-gray-500 hover:bg-gray-100"}`}
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
                        className={`flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm transition-all cursor-pointer ${
                          vis[col]
                            ? dark
                              ? "bg-blue-500/10 text-blue-300"
                              : "bg-blue-50 text-blue-700"
                            : dark
                              ? "bg-white/[0.02] text-gray-500"
                              : "bg-white text-gray-400"
                        }`}
                      >
                        <span>{labels[col]}</span>
                        <div
                          className={`w-8 h-4.5 rounded-full relative transition-colors ${vis[col] ? (dark ? "bg-blue-500" : "bg-blue-600") : dark ? "bg-gray-700" : "bg-gray-300"}`}
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
          className={`mt-3 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
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
            getRowId={(row) => row.id}
            classes={s}
          />
          <p
            className={`mt-3 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
          >
            Default striped rows with{" "}
            <code
              className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
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
          const colors = [
            {
              label: "Blue",
              className: dark ? "bg-blue-500/[0.06]" : "bg-blue-50/70",
            },
            {
              label: "Emerald",
              className: dark ? "bg-emerald-500/[0.06]" : "bg-emerald-50/70",
            },
            {
              label: "Amber",
              className: dark ? "bg-amber-500/[0.06]" : "bg-amber-50/70",
            },
            {
              label: "Rose",
              className: dark ? "bg-rose-500/[0.06]" : "bg-rose-50/70",
            },
            {
              label: "Violet",
              className: dark ? "bg-violet-500/[0.06]" : "bg-violet-50/70",
            },
          ];
          const CustomColorStripedDemo = () => {
            const [activeColor, setActiveColor] = React.useState(0);
            return (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-medium uppercase tracking-wider ${dark ? "text-gray-500" : "text-gray-400"}`}
                  >
                    Stripe color:
                  </span>
                  {colors.map((c, i) => (
                    <button
                      key={c.label}
                      onClick={() => setActiveColor(i)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                        activeColor === i
                          ? dark
                            ? "bg-white/[0.1] text-white border border-white/[0.15]"
                            : "bg-gray-900 text-white"
                          : dark
                            ? "bg-white/[0.03] text-gray-400 border border-white/[0.06] hover:bg-white/[0.06]"
                            : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
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
          className={`mt-3 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
        >
          Use{" "}
          <code
            className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
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
                ? "bg-indigo-500/10 border-l-2 border-l-indigo-500/40"
                : "bg-indigo-50 border-l-2 border-l-indigo-400"
            }
            getRowId={(row) => row.id}
            classes={s}
          />
          <p
            className={`mt-3 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
          >
            Striped rows with a <strong>left border accent</strong> and stronger
            background tint. Combines{" "}
            <code
              className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
            >
              bg-indigo-50
            </code>{" "}
            with{" "}
            <code
              className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
            >
              border-l-2 border-l-indigo-400
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
            stripedClassName={dark ? "bg-white/[0.03]" : "bg-gray-50"}
            getRowId={(row) => row.id}
            classes={{
              ...s,
              ...s,
              row: `border-b transition-colors data-[clickable]:cursor-pointer ${dark ? "border-white/[0.04] hover:bg-blue-500/10" : "border-gray-100 hover:bg-blue-50"}`,
            }}
            onRowClick={(row) => alert(`Clicked: ${(row as User).name}`)}
          />
          <p
            className={`mt-3 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
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
              row: `border-b transition-colors ${dark ? "border-white/[0.04] hover:bg-white/[0.06] [&[data-striped]]:bg-gradient-to-r [&[data-striped]]:from-cyan-500/[0.04] [&[data-striped]]:to-transparent" : "border-gray-100 hover:bg-gray-100 [&[data-striped]]:bg-gradient-to-r [&[data-striped]]:from-cyan-50 [&[data-striped]]:to-transparent"}`,
            }}
          />
          <p
            className={`mt-3 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
          >
            No{" "}
            <code
              className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
            >
              stripedClassName
            </code>{" "}
            needed. Instead, uses the{" "}
            <code
              className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
            >
              data-striped
            </code>{" "}
            attribute on rows to apply a <strong>gradient stripe</strong> via
            CSS selectors in{" "}
            <code
              className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
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
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                    density === d
                      ? "bg-blue-600 text-white"
                      : dark
                        ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
            className={`mt-3 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
          >
            Current density:{" "}
            <code
              className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
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
              container: `border rounded-lg ${dark ? "border-white/[0.06]" : "border-gray-200"}`,
              table: "w-max border-collapse",
              pinnedRightContainer: `shrink-0 sticky right-0 z-20 border-l-2 ${dark ? "border-blue-500/30 bg-gray-900" : "border-blue-200 bg-white"}`,
            }}
          />
          <p
            className={`mt-3 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
          >
            The "Actions" column is pinned to the right using{" "}
            <code
              className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
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
            className={`overflow-x-auto rounded-lg border ${dark ? "border-white/[0.06]" : "border-gray-200"}`}
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
            className={`mt-3 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
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
              className={`overflow-x-auto rounded-lg border ${dark ? "border-white/[0.06]" : "border-gray-200"}`}
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
                    "[&>div]:bg-emerald-500 [&>div]:opacity-100 [&>div]:w-1 [&>div]:h-full [&>div]:rounded-none",
                }}
              />
            </div>
          );
          return <CustomHandleDemo />;
        })()}
        <p
          className={`mt-3 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
        >
          Custom resize handle styled via{" "}
          <code
            className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
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
                      className={`text-xs px-2 py-1 rounded-md font-mono ${dark ? "bg-white/[0.05] text-gray-400" : "bg-gray-100 text-gray-600"}`}
                    >
                      {col}:{" "}
                      {sizing[col] ? `${Math.round(sizing[col])}px` : "auto"}
                    </span>
                  ))}
                  {Object.keys(sizing).length > 0 && (
                    <button
                      onClick={() => setSizing({})}
                      className={`text-xs px-2 py-1 rounded-md cursor-pointer ${dark ? "text-blue-400 hover:bg-blue-500/10" : "text-blue-600 hover:bg-blue-50"}`}
                    >
                      Reset
                    </button>
                  )}
                </div>
                <div
                  className={`overflow-x-auto rounded-lg border ${dark ? "border-white/[0.06]" : "border-gray-200"}`}
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
          className={`mt-3 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
        >
          Controlled column sizing via{" "}
          <code
            className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
          >
            columnSizing
          </code>{" "}
          and{" "}
          <code
            className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
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
                className={`overflow-x-auto rounded-lg border ${dark ? "border-white/[0.06]" : "border-gray-200"}`}
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
          className={`mt-3 text-sm space-y-1 ${dark ? "text-gray-400" : "text-gray-500"}`}
        >
          <p>
            Columns with preset{" "}
            <code
              className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
            >
              size
            </code>
            ,{" "}
            <code
              className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
            >
              minSize
            </code>
            , and{" "}
            <code
              className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
            >
              maxSize
            </code>{" "}
            via TanStack ColumnDef. The "Status" column has{" "}
            <code
              className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
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
                className={`text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
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
            className={`mt-3 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
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
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer ${dark ? "text-white bg-green-500 hover:bg-green-400" : "text-white bg-green-600 hover:bg-green-700"}`}
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
            className={`mt-3 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
          >
            Click "Export to CSV" to download the table data. Uses the{" "}
            <code
              className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
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
            className={`mt-3 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
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
                  className={dark ? "text-gray-500" : "text-gray-400"}
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
                  className={dark ? "text-gray-500" : "text-gray-400"}
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
                      ? "text-gray-500 hover:text-gray-300"
                      : "text-gray-400 hover:text-gray-600",
                  }}
                />
                <div
                  className={`flex items-center gap-2 text-xs ${dark ? "text-gray-500" : "text-gray-400"}`}
                >
                  <span className="font-medium">Order:</span>
                  {data.map((d, i) => (
                    <span
                      key={d.id}
                      className={`px-2 py-0.5 rounded ${dark ? "bg-white/[0.05]" : "bg-gray-100"}`}
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
          className={`mt-3 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
        >
          Custom up/down arrow icons via{" "}
          <code
            className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
          >
            DragHandleIcon
          </code>{" "}
          prop. Styled via{" "}
          <code
            className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
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
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${className} ${dark ? "bg-violet-500/20 text-violet-300 border border-violet-500/30" : "bg-violet-100 text-violet-700 border border-violet-200"}`}
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
                    className={`rounded-lg border p-3 ${dark ? "border-white/[0.06] bg-white/[0.02]" : "border-gray-200 bg-gray-50"}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`text-xs font-semibold uppercase tracking-wider ${dark ? "text-gray-400" : "text-gray-500"}`}
                      >
                        Reorder History
                      </span>
                      <button
                        onClick={() => setHistory([])}
                        className={`text-xs cursor-pointer ${dark ? "text-gray-500 hover:text-gray-300" : "text-gray-400 hover:text-gray-600"}`}
                      >
                        Clear
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {history.map((h, i) => (
                        <span
                          key={i}
                          className={`text-xs px-2 py-1 rounded-md ${dark ? "bg-violet-500/10 text-violet-300" : "bg-violet-50 text-violet-700"}`}
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
          className={`mt-3 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
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
                  row: `border-b transition-all data-[clickable]:cursor-pointer ${dark ? "border-white/[0.04] hover:bg-white/[0.06]" : "border-gray-100 hover:bg-gray-100"} [&[draggable]]:cursor-grab [&[draggable]]:active:cursor-grabbing`,
                  dragHandle: `${dark ? "text-blue-400 hover:text-blue-300" : "text-blue-500 hover:text-blue-700"} transition-colors`,
                }}
              />
            );
          };
          return <StyledDragDemo />;
        })()}
        <p
          className={`mt-3 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
        >
          Custom drag handle color (blue theme) and grab/grabbing cursor states
          on draggable rows via{" "}
          <code
            className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
          >
            rowClassName
          </code>{" "}
          selectors. Uses{" "}
          <code
            className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
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
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${dark ? "bg-amber-500/15 text-amber-300" : "bg-amber-100 text-amber-700"}`}
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
          className={`mt-3 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
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
                    ? "text-gray-500 hover:text-gray-300"
                    : "text-gray-400 hover:text-gray-600",
                }}
              />
            );
          };
          return <RightDragDemo />;
        })()}
        <p
          className={`mt-3 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
        >
          Drag handle placed on the <strong>right side</strong> using{" "}
          <code
            className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
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
                className={`border-t-2 ${dark ? "border-white/[0.1] bg-white/[0.03]" : "border-gray-300 bg-gray-50"}`}
              >
                <td
                  colSpan={100}
                  className={`px-4 py-3 ${dark ? "text-gray-300" : "text-gray-700"}`}
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
            className={`mt-3 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
          >
            Set{" "}
            <code
              className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
            >
              showFooter
            </code>{" "}
            and provide{" "}
            <code
              className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
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
                    className={`border-t-2 ${dark ? "border-white/[0.1] bg-white/[0.03]" : "border-gray-300 bg-gray-50"}`}
                  >
                    <td
                      className={`px-4 py-2.5 text-sm font-semibold ${dark ? "text-gray-200" : "text-gray-800"}`}
                    >
                      Totals
                    </td>
                    <td
                      className={`px-4 py-2.5 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
                    >
                      {data.length} rows
                    </td>
                    <td
                      className={`px-4 py-2.5 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
                    >
                      {new Set(data.map((d) => d.role)).size} roles
                    </td>
                    <td
                      className={`px-4 py-2.5 text-sm font-semibold ${dark ? "text-emerald-400" : "text-emerald-600"}`}
                    >
                      {data.filter((d) => d.status === "active").length} active
                    </td>
                    <td
                      className={`px-4 py-2.5 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
                    >
                      {new Set(data.map((d) => d.department)).size} depts
                    </td>
                    <td
                      className={`px-4 py-2.5 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
                    ></td>
                  </tr>
                  <tr className={dark ? "bg-white/[0.02]" : "bg-gray-50/50"}>
                    <td
                      className={`px-4 py-2 text-xs ${dark ? "text-gray-500" : "text-gray-400"}`}
                    >
                      Summary
                    </td>
                    <td
                      className={`px-4 py-2 text-xs ${dark ? "text-gray-500" : "text-gray-400"}`}
                    ></td>
                    <td
                      className={`px-4 py-2 text-xs ${dark ? "text-gray-500" : "text-gray-400"}`}
                    ></td>
                    <td
                      className={`px-4 py-2 text-xs ${dark ? "text-gray-500" : "text-gray-400"}`}
                    >
                      {data.filter((d) => d.status === "inactive").length}{" "}
                      inactive
                    </td>
                    <td
                      className={`px-4 py-2 text-xs ${dark ? "text-gray-500" : "text-gray-400"}`}
                    ></td>
                    <td
                      className={`px-4 py-2 text-xs ${dark ? "text-gray-500" : "text-gray-400"}`}
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
          className={`mt-3 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
        >
          Footer with <strong>column-aligned totals and averages</strong> in two
          rows. Each{" "}
          <code
            className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
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
                  className={`px-5 py-4 flex items-center justify-between ${dark ? "bg-gradient-to-r from-blue-500/[0.06] to-violet-500/[0.04] border-t-2 border-blue-500/20" : "bg-gradient-to-r from-blue-50 to-violet-50 border-t-2 border-blue-200"}`}
                >
                  <div className="flex items-center gap-6">
                    <div>
                      <p
                        className={`text-xs font-medium uppercase tracking-wider ${dark ? "text-gray-500" : "text-gray-400"}`}
                      >
                        Total Rows
                      </p>
                      <p
                        className={`text-xl font-bold ${dark ? "text-white" : "text-gray-900"}`}
                      >
                        {sampleData.slice(0, 6).length}
                      </p>
                    </div>
                    <div
                      className={`w-px h-10 ${dark ? "bg-white/[0.08]" : "bg-gray-200"}`}
                    />
                    <div>
                      <p
                        className={`text-xs font-medium uppercase tracking-wider ${dark ? "text-gray-500" : "text-gray-400"}`}
                      >
                        Active
                      </p>
                      <p
                        className={`text-xl font-bold ${dark ? "text-emerald-400" : "text-emerald-600"}`}
                      >
                        {
                          sampleData
                            .slice(0, 6)
                            .filter((d) => d.status === "active").length
                        }
                      </p>
                    </div>
                    <div
                      className={`w-px h-10 ${dark ? "bg-white/[0.08]" : "bg-gray-200"}`}
                    />
                    <div>
                      <p
                        className={`text-xs font-medium uppercase tracking-wider ${dark ? "text-gray-500" : "text-gray-400"}`}
                      >
                        Departments
                      </p>
                      <p
                        className={`text-xl font-bold ${dark ? "text-blue-400" : "text-blue-600"}`}
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
                    className={`px-4 py-2 text-sm font-medium rounded-lg cursor-pointer transition-colors ${dark ? "bg-blue-500/15 text-blue-300 hover:bg-blue-500/25" : "bg-blue-600 text-white hover:bg-blue-700"}`}
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
          className={`mt-3 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
        >
          A dashboard-style summary card as footer with large metric numbers,
          dividers, gradient background, and an action button. Uses{" "}
          <code
            className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
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
              className={`${dark ? "bg-[#111118] border-t-2 border-white/[0.1]" : "bg-gray-50 border-t-2 border-gray-300"}`}
            >
              <td
                colSpan={100}
                className={`px-4 py-3 text-sm font-medium ${dark ? "text-gray-300" : "text-gray-700"}`}
              >
                <div className="flex items-center justify-between">
                  <span>Showing {sampleData.length} rows total</span>
                  <span
                    className={`text-xs ${dark ? "text-gray-500" : "text-gray-400"}`}
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
          className={`mt-3 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
        >
          Footer stays <strong>sticky at the bottom</strong> while the table
          scrolls vertically, using{" "}
          <code
            className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
          >
            classes.footer
          </code>{" "}
          with{" "}
          <code
            className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
          >
            sticky bottom-0
          </code>
          . Needs{" "}
          <code
            className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
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
                    ? "border-t border-white/[0.06]"
                    : "border-t border-gray-200"
                }
              >
                <td
                  colSpan={100}
                  className={`px-4 py-2.5 ${dark ? "text-gray-400" : "text-gray-500"}`}
                >
                  <div className="flex items-center gap-4 text-xs">
                    <span
                      className={`flex items-center gap-1.5 ${dark ? "text-emerald-400" : "text-emerald-600"}`}
                    >
                      <span className={`w-2 h-2 rounded-full ${dark ? "bg-emerald-400" : "bg-emerald-500"}`} />
                      {
                        sampleData
                          .slice(0, 5)
                          .filter((d) => d.status === "active").length
                      }{" "}
                      Active
                    </span>
                    <span
                      className={`flex items-center gap-1.5 ${dark ? "text-gray-400" : "text-gray-500"}`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${dark ? "bg-gray-600" : "bg-gray-400"}`}
                      />
                      {
                        sampleData
                          .slice(0, 5)
                          .filter((d) => d.status === "inactive").length
                      }{" "}
                      Inactive
                    </span>
                    <span
                      className={`flex items-center gap-1.5 ${dark ? "text-amber-400" : "text-amber-600"}`}
                    >
                      <span className={`w-2 h-2 rounded-full ${dark ? "bg-amber-400" : "bg-amber-500"}`} />
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
              <tr className={dark ? "bg-white/[0.02]" : "bg-gray-50"}>
                <td
                  colSpan={100}
                  className={`px-4 py-2 text-[11px] ${dark ? "text-gray-600" : "text-gray-400"}`}
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
          className={`mt-3 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
        >
          Two-row footer: first row shows status breakdown with colored dots,
          second row shows a timestamp. Pass multiple{" "}
          <code
            className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
          >
            &lt;tr&gt;
          </code>{" "}
          elements wrapped in a{" "}
          <code
            className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
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
                className={`p-3 rounded-md text-sm ${dark ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20" : "bg-yellow-50 text-yellow-800 border border-yellow-200"}`}
              >
                {contextMenuInfo}
                <button
                  onClick={() => setContextMenuInfo(null)}
                  className={`ml-3 underline text-xs ${dark ? "text-yellow-500" : "text-yellow-600"}`}
                >
                  Dismiss
                </button>
              </div>
            )}
          </div>
          <p
            className={`mt-3 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
          >
            Right-click any row to trigger the{" "}
            <code
              className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
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
                className={`p-3 rounded-md text-sm ${dark ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-green-50 text-green-800 border border-green-200"}`}
              >
                Copied: {lastCopied}
              </div>
            )}
          </div>
          <p
            className={`mt-3 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
          >
            Click any cell to copy its value to clipboard. Uses{" "}
            <code
              className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
            >
              enableCopyOnClick
            </code>{" "}
            and{" "}
            <code
              className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
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
                className={`flex items-center gap-2 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
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
                className={`text-xs ${dark ? "text-gray-500" : "text-gray-400"}`}
              >
                All {allInfiniteData.length} rows loaded
              </span>
            }
            classes={{
              ...s,
              ...s,
              container: `w-full border rounded-lg ${dark ? "border-white/[0.06]" : "border-gray-200"}`,
            }}
          />
          <div
            className={`mt-3 flex items-center justify-between ${dark ? "text-gray-400" : "text-gray-500"}`}
          >
            <span className="text-sm">
              Loaded {infiniteData.length} of {allInfiniteData.length} rows.{" "}
              {!infiniteHasMore && (
                <span
                  className={dark ? "text-emerald-400" : "text-emerald-600"}
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
              className={`text-xs px-3 py-1 rounded cursor-pointer ${dark ? "text-blue-400 hover:bg-blue-500/10" : "text-blue-600 hover:bg-blue-50"}`}
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
                      className={`h-3 rounded-full animate-pulse ${dark ? "bg-white/[0.06]" : "bg-gray-200"}`}
                      style={{ width: "25%" }}
                    />
                    <div
                      className={`h-3 rounded-full animate-pulse ${dark ? "bg-white/[0.04]" : "bg-gray-150"}`}
                      style={{ width: "35%" }}
                    />
                    <div
                      className={`h-3 rounded-full animate-pulse ${dark ? "bg-white/[0.05]" : "bg-gray-200"}`}
                      style={{ width: "15%" }}
                    />
                    <div
                      className={`h-3 rounded-full animate-pulse ${dark ? "bg-white/[0.03]" : "bg-gray-100"}`}
                      style={{ width: "20%" }}
                    />
                  </div>
                ))}
              </div>
            }
            infiniteEndContent={
              <div
                className={`flex items-center gap-2 ${dark ? "text-emerald-400" : "text-emerald-600"}`}
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
              container: `w-full border rounded-lg ${dark ? "border-white/[0.06]" : "border-gray-200"}`,
            }}
          />
          <div
            className={`mt-3 flex items-center justify-between ${dark ? "text-gray-400" : "text-gray-500"}`}
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
              className={`text-xs px-3 py-1 rounded cursor-pointer ${dark ? "text-blue-400 hover:bg-blue-500/10" : "text-blue-600 hover:bg-blue-50"}`}
            >
              Reset
            </button>
          </div>
        </DemoWrapper>
        <p
          className={`mt-3 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
        >
          Skeleton row placeholders as loading indicator via{" "}
          <code
            className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
          >
            loadingMoreContent
          </code>
          . Shows 3 shimmer rows with fading opacity. End state shows a
          checkmark icon with "All rows loaded" via{" "}
          <code
            className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
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
                  className={`w-full h-1 rounded-full overflow-hidden ${dark ? "bg-white/[0.06]" : "bg-gray-200"}`}
                >
                  <div
                    className={`h-full rounded-full animate-pulse ${dark ? "bg-blue-500" : "bg-blue-600"}`}
                    style={{
                      width: "60%",
                      animation: "pulse 1s ease-in-out infinite",
                    }}
                  />
                </div>
                <p
                  className={`text-xs text-center ${dark ? "text-gray-500" : "text-gray-400"}`}
                >
                  Loading rows {inf3Data.length + 1} to{" "}
                  {Math.min(inf3Data.length + 10, allInfiniteData.length)}...
                </p>
              </div>
            }
            infiniteEndContent={
              <span
                className={`text-xs ${dark ? "text-gray-500" : "text-gray-400"}`}
              >
                You've reached the end ({allInfiniteData.length} rows)
              </span>
            }
            classes={{
              ...s,
              ...s,
              container: `w-full border rounded-lg ${dark ? "border-white/[0.06]" : "border-gray-200"}`,
            }}
          />
          <div
            className={`mt-3 flex items-center justify-between ${dark ? "text-gray-400" : "text-gray-500"}`}
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
              className={`text-xs px-3 py-1 rounded cursor-pointer ${dark ? "text-blue-400 hover:bg-blue-500/10" : "text-blue-600 hover:bg-blue-50"}`}
            >
              Reset
            </button>
          </div>
        </DemoWrapper>
        <p
          className={`mt-3 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
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
              container: `w-full border rounded-lg ${dark ? "border-white/[0.06]" : "border-gray-200"}`,
            }}
          />
          <div
            className={`mt-3 flex items-center justify-between ${dark ? "text-gray-400" : "text-gray-500"}`}
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
              className={`text-xs px-3 py-1 rounded cursor-pointer ${dark ? "text-blue-400 hover:bg-blue-500/10" : "text-blue-600 hover:bg-blue-50"}`}
            >
              Reset
            </button>
          </div>
        </DemoWrapper>
        <p
          className={`mt-3 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
        >
          No{" "}
          <code
            className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
          >
            loadingMoreContent
          </code>{" "}
          or{" "}
          <code
            className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
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
            classes={{
              ...s,
              searchBar: "mb-3",
              searchInput: `w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all ${dark ? "bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-500 focus:ring-blue-500/40 focus:border-blue-500/50" : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500/30 focus:border-blue-500"}`,
            }}
          />
          <p
            className={`mt-3 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
          >
            Set{" "}
            <code
              className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
            >
              showSearch
            </code>{" "}
            to render a built-in search bar above the table. Customize styling
            via{" "}
            <code
              className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
            >
              classes.searchBar
            </code>{" "}
            and{" "}
            <code
              className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
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
                  searchBar: "mb-3",
                  searchInput: `w-full px-4 py-2.5 text-sm border-2 rounded-xl focus:outline-none transition-all ${dark ? "bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-500 focus:border-rose-500 focus:shadow-[0_0_0_3px_rgba(244,63,94,0.15)]" : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-rose-500 focus:shadow-[0_0_0_3px_rgba(244,63,94,0.1)]"}`,
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
          className={`mt-3 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
        >
          Rose/pink themed search with custom{" "}
          <code
            className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
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
                classes={{
                  ...s,
                  searchBar: "mb-3",
                  searchInput: `w-full text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all ${dark ? "bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-500 focus:ring-blue-500/40 focus:border-blue-500/50" : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500/30 focus:border-blue-500"}`,
                }}
              />
            );
          };
          return <RightIconDemo />;
        })()}
        <p
          className={`mt-3 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
        >
          Search icon on the <strong>right side</strong> via{" "}
          <code
            className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
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
                  searchBar: "mb-3",
                  searchInput: `w-full text-sm rounded-full focus:outline-none focus:ring-2 transition-all ${dark ? "bg-white/[0.05] border border-white/[0.08] text-gray-100 placeholder-gray-500 focus:ring-amber-500/30 focus:border-amber-500/40" : "bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-amber-500/20 focus:border-amber-400"}`,
                }}
              />
            );
          };
          return <NoIconDemo />;
        })()}
        <p
          className={`mt-3 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
        >
          No icon using{" "}
          <code
            className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
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
                  searchBar: "mb-3",
                  searchInput: `w-full text-sm border-0 border-b-2 rounded-none bg-transparent focus:outline-none transition-all ${dark ? "border-gray-700 text-gray-100 placeholder-gray-600 focus:border-emerald-400" : "border-gray-200 text-gray-900 placeholder-gray-400 focus:border-emerald-600"}`,
                }}
              />
            );
          };
          return <UnderlineDemo />;
        })()}
        <p
          className={`mt-3 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
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
                  searchBar: "mb-3",
                  searchInput: `w-full text-sm border-2 rounded-xl focus:outline-none transition-all ${dark ? "bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-500 focus:border-violet-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.15)]" : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-violet-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.1)]"}`,
                }}
              />
            );
          };
          return <FilterIconDemo />;
        })()}
        <p
          className={`mt-3 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
        >
          A funnel/filter icon on the right via{" "}
          <code
            className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
          >
            SearchIcon
          </code>{" "}
          +{" "}
          <code
            className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
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
                      className={`text-xs ${dark ? "text-gray-500" : "text-gray-400"}`}
                    >
                      Active filters:
                    </span>
                    {filters.map((f) => (
                      <span
                        key={f.id}
                        className={`text-xs px-2 py-1 rounded-full ${dark ? "bg-blue-500/15 text-blue-300" : "bg-blue-50 text-blue-700"}`}
                      >
                        {f.id}:{" "}
                        {Array.isArray(f.value)
                          ? (f.value as string[]).join(", ")
                          : String(f.value)}
                      </span>
                    ))}
                    <button
                      onClick={() => setFilters([])}
                      className={`text-xs cursor-pointer ${dark ? "text-gray-500 hover:text-gray-300" : "text-gray-400 hover:text-gray-600"}`}
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
          className={`mt-3 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
        >
          Click the filter icon in Role, Status, or Department headers to open a
          multi-select dropdown. Active filters show a filled icon. Uses{" "}
          <code
            className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
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
                  filterIcon: dark ? "text-violet-400" : "text-violet-600",
                }}
              />
            );
          };
          return <CustomFilterIconDemo />;
        })()}
        <p
          className={`mt-3 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
        >
          Custom chevron-down filter icon via{" "}
          <code
            className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
          >
            FilterIcon
          </code>{" "}
          prop. Styled in violet via{" "}
          <code
            className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
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
                      className={`text-xs font-semibold uppercase tracking-wider ${dark ? "text-gray-400" : "text-gray-500"}`}
                    >
                      Filter by {columnId}
                    </p>
                    <div className="space-y-1">
                      {[
                        {
                          label: "Active",
                          value: "active",
                          color: dark
                            ? "text-emerald-400 bg-emerald-500/10"
                            : "text-emerald-700 bg-emerald-50",
                        },
                        {
                          label: "Inactive",
                          value: "inactive",
                          color: dark
                            ? "text-gray-400 bg-gray-500/10"
                            : "text-gray-600 bg-gray-100",
                        },
                        {
                          label: "Pending",
                          value: "pending",
                          color: dark
                            ? "text-amber-400 bg-amber-500/10"
                            : "text-amber-700 bg-amber-50",
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
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm cursor-pointer transition-all ${selected ? opt.color + " font-medium" : dark ? "text-gray-400 hover:bg-white/[0.04]" : "text-gray-600 hover:bg-gray-50"}`}
                          >
                            <span
                              className={`w-2 h-2 rounded-full ${opt.value === "active" ? "bg-emerald-500" : opt.value === "pending" ? "bg-amber-500" : dark ? "bg-gray-600" : "bg-gray-400"}`}
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
                        className={`w-full text-center text-xs py-1.5 rounded cursor-pointer ${dark ? "text-gray-500 hover:text-gray-300 hover:bg-white/[0.04]" : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"}`}
                      >
                        Clear filter
                      </button>
                    )}
                  </div>
                )}
                classes={{
                  ...s,
                  filterDropdown: dark
                    ? "bg-gray-900 border-white/[0.08]"
                    : "bg-white border-gray-200",
                }}
              />
            );
          };
          return <CustomDropdownDemo />;
        })()}
        <p
          className={`mt-3 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
        >
          Fully custom dropdown content via{" "}
          <code
            className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
          >
            renderColumnFilter
          </code>
          . Receives{" "}
          <code
            className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
          >
            columnId
          </code>
          ,{" "}
          <code
            className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
          >
            currentValues
          </code>
          , and{" "}
          <code
            className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
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
                  className={`text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
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
                  <div className={`p-2 ${dark ? "bg-gray-950" : "bg-white"}`}>
                    <div
                      className={`px-2 py-1.5 mb-1 flex items-center justify-between`}
                    >
                      <span
                        className={`text-[11px] font-bold uppercase tracking-widest ${dark ? "text-indigo-400" : "text-indigo-600"}`}
                      >
                        {columnId}
                      </span>
                      {currentValues.length > 0 && (
                        <button
                          onClick={() => setValues([])}
                          className={`text-[10px] px-1.5 py-0.5 rounded cursor-pointer ${dark ? "text-gray-500 hover:text-gray-300 hover:bg-white/[0.05]" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"}`}
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
                            dot: "bg-emerald-500",
                          },
                          {
                            label: "Inactive",
                            value: "inactive",
                            dot: dark ? "bg-gray-600" : "bg-gray-400",
                          },
                          {
                            label: "Pending",
                            value: "pending",
                            dot: "bg-amber-500",
                          },
                        ]
                      : [
                          { label: "Admin", value: "Admin", dot: "bg-red-500" },
                          {
                            label: "Manager",
                            value: "Manager",
                            dot: "bg-blue-500",
                          },
                          {
                            label: "Developer",
                            value: "Developer",
                            dot: "bg-emerald-500",
                          },
                          {
                            label: "Designer",
                            value: "Designer",
                            dot: "bg-violet-500",
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
                          className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm cursor-pointer transition-all mb-0.5 ${
                            selected
                              ? dark
                                ? "bg-indigo-500/15 text-indigo-300"
                                : "bg-indigo-50 text-indigo-700"
                              : dark
                                ? "text-gray-300 hover:bg-white/[0.04]"
                                : "text-gray-700 hover:bg-gray-50"
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
                                dark ? "text-indigo-400" : "text-indigo-600"
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
                        className={`mt-1 px-2 py-1 text-[11px] ${dark ? "text-gray-600" : "text-gray-400"}`}
                      >
                        {currentValues.length} selected
                      </div>
                    )}
                  </div>
                )}
                classes={{
                  ...s,
                  filterIcon: dark ? "text-indigo-400" : "text-indigo-600",
                  filterDropdown: `rounded-xl border shadow-2xl ${dark ? "bg-gray-950 border-indigo-500/20" : "bg-white border-indigo-200"}`,
                }}
              />
            );
          };
          return <StyledFilterDemo />;
        })()}
        <p
          className={`mt-3 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
        >
          Custom styled dropdown with color-coded dots per option, indigo theme,
          rounded items, selection count, and styled via{" "}
          <code
            className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
          >
            classes.filterDropdown
          </code>{" "}
          and{" "}
          <code
            className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
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
                        className={`p-3 ${dark ? "bg-gray-900" : "bg-white"}`}
                      >
                        <p
                          className={`text-xs font-medium mb-2 ${dark ? "text-gray-500" : "text-gray-400"}`}
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
                                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                                      : "bg-cyan-50 text-cyan-700 border border-cyan-300"
                                    : dark
                                      ? "bg-white/[0.04] text-gray-400 border border-white/[0.08] hover:border-cyan-500/30"
                                      : "bg-gray-50 text-gray-600 border border-gray-200 hover:border-cyan-400"
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
                            className={`mt-2 text-xs cursor-pointer ${dark ? "text-gray-600 hover:text-gray-400" : "text-gray-400 hover:text-gray-600"}`}
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
                    filterDropdown: `rounded-xl border shadow-2xl ${dark ? "bg-gray-900 border-cyan-500/20" : "bg-white border-cyan-200"}`,
                  }}
                />
                {filters.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-xs ${dark ? "text-gray-500" : "text-gray-400"}`}
                    >
                      Filtered by:
                    </span>
                    {filters.map((f) => (
                      <span
                        key={f.id}
                        className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${dark ? "bg-cyan-500/10 text-cyan-300 border border-cyan-500/20" : "bg-cyan-50 text-cyan-700 border border-cyan-200"}`}
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
                      className={`text-xs cursor-pointer ${dark ? "text-gray-600 hover:text-gray-400" : "text-gray-400 hover:text-gray-600"}`}
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
          className={`mt-3 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
        >
          Chip/tag-style filter selection instead of checkboxes. Cyan theme with
          a search icon as filter trigger. Active filters shown as removable
          chips below the table. Uses{" "}
          <code
            className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
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
              className={`text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
            >
              Sorting:{" "}
              <code
                className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
              >
                {serverSorting.length > 0
                  ? `${serverSorting[0].id} (${serverSorting[0].desc ? "desc" : "asc"})`
                  : "none"}
              </code>
              {serverLoading && <span className="ml-2 italic">Loading...</span>}
            </p>
          </div>
          <p
            className={`mt-3 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
          >
            With{" "}
            <code
              className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
            >
              manualSorting={"{true}"}
            </code>
            , the table does not sort data locally. Instead, sorting state
            changes trigger a server request (simulated with 800ms delay). Also
            supports{" "}
            <code
              className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
            >
              manualPagination
            </code>{" "}
            and{" "}
            <code
              className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
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
          className={`mt-3 text-sm space-y-2 ${dark ? "text-gray-400" : "text-gray-500"}`}
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
                className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
              >
                ?limit=10&amp;skip=10
              </code>{" "}
              with{" "}
              <code
                className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
              >
                manualPagination
              </code>
            </li>
            <li>
              <strong>Server-side sorting</strong>:{" "}
              <code
                className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
              >
                ?sortBy=title&amp;order=asc
              </code>{" "}
              with{" "}
              <code
                className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
              >
                manualSorting
              </code>
            </li>
            <li>
              <strong>Server-side search</strong>:{" "}
              <code
                className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
              >
                /products/search?q=phone
              </code>{" "}
              with debounced input
            </li>
            <li>
              <strong>Server-side category filter</strong>:{" "}
              <code
                className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
              >
                /products/category/smartphones
              </code>{" "}
              via{" "}
              <code
                className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
              >
                renderColumnFilter
              </code>{" "}
              with{" "}
              <code
                className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
              >
                MultiSelectSearchableDropdown
              </code>
            </li>
            <li>
              Categories loaded from{" "}
              <code
                className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
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
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium ${dark ? "bg-white/[0.06] text-gray-300" : "bg-gray-100 text-gray-700"}`}
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
                          className={`p-0.5 rounded cursor-pointer ${dark ? "hover:bg-white/10 text-gray-500 hover:text-gray-300" : "hover:bg-gray-200 text-gray-400 hover:text-gray-600"}`}
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
                          className={`p-0.5 rounded cursor-pointer ${dark ? "hover:bg-white/10 text-gray-500 hover:text-gray-300" : "hover:bg-gray-200 text-gray-400 hover:text-gray-600"}`}
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
                  className={`text-xs cursor-pointer ${dark ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700"}`}
                >
                  Reset order
                </button>
              </div>
            );
          };
          return <ColumnReorderDemo />;
        })()}
        <p
          className={`mt-3 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
        >
          Reorder columns via{" "}
          <code
            className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
          >
            columnOrder
          </code>{" "}
          and{" "}
          <code
            className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
          >
            onColumnOrderChange
          </code>
          . Enable with{" "}
          <code
            className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
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
                    className={`text-xs ${dark ? "text-gray-500" : "text-gray-400"}`}
                  >
                    Group by:
                  </span>
                  {["department", "role", "status"].map((col) => (
                    <button
                      key={col}
                      onClick={() => toggleGroup(col)}
                      className={`px-2.5 py-1 rounded-lg text-xs cursor-pointer transition-colors ${groupCols.includes(col) ? (dark ? "bg-blue-500/20 text-blue-400" : "bg-blue-50 text-blue-700") : dark ? "bg-white/[0.06] text-gray-400 hover:bg-white/[0.08]" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
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
                      ? "bg-white/[0.04] font-semibold text-gray-300"
                      : "bg-gray-50 font-semibold text-gray-700",
                  }}
                />
              </div>
            );
          };
          return <GroupByDemo />;
        })()}
        <p
          className={`mt-3 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
        >
          Group rows by column values via{" "}
          <code
            className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
          >
            groupBy
          </code>
          . Style grouped headers with{" "}
          <code
            className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
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
                className={`text-xs ${dark ? "text-gray-500" : "text-gray-400"}`}
              >
                Resize below 768px to see cards, or view the forced preview
                below.
              </p>
              <div
                className="max-w-[360px] border rounded-xl overflow-hidden mx-auto"
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
                      className={`p-4 border-b last:border-b-0 ${dark ? "border-white/[0.06]" : "border-gray-100"}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`font-semibold text-sm ${dark ? "text-gray-100" : "text-gray-900"}`}
                        >
                          {row.name}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${row.status === "active" ? (dark ? "bg-emerald-500/15 text-emerald-400" : "bg-emerald-50 text-emerald-700") : row.status === "pending" ? (dark ? "bg-amber-500/15 text-amber-400" : "bg-amber-50 text-amber-700") : dark ? "bg-gray-500/15 text-gray-400" : "bg-gray-100 text-gray-600"}`}
                        >
                          {row.status}
                        </span>
                      </div>
                      <div
                        className={`space-y-1 text-xs ${dark ? "text-gray-400" : "text-gray-500"}`}
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
                    mobileCard: dark ? "bg-gray-900" : "bg-white",
                  }}
                />
              </div>
            </div>
          );
          return <MobileCardDemo />;
        })()}
        <p
          className={`mt-3 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
        >
          Set{" "}
          <code
            className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
          >
            responsiveBreakpoint
          </code>{" "}
          and{" "}
          <code
            className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
          >
            renderMobileCard
          </code>{" "}
          to switch to card layout below a viewport width.
        </p>
      </Section>

      <Section title="Unstyled Mode" isDarkMode={dark}>
        <DemoWrapper isDarkMode={dark}>
          <Table
            columns={columns}
            data={sampleData.slice(0, 3)}
            unstyled
            getRowId={(row) => row.id}
          />
        </DemoWrapper>
        <p
          className={`mt-3 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
        >
          Pass{" "}
          <code
            className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
          >
            unstyled
          </code>{" "}
          to strip all default classes. Combine with{" "}
          <code
            className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
          >
            classes
          </code>{" "}
          to apply your own design system.
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
                    className={`text-xs font-medium ${dark ? "text-gray-400" : "text-gray-500"}`}
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
                    className={`text-xs font-medium ${dark ? "text-gray-400" : "text-gray-500"}`}
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
          className={`mt-3 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
        >
          Control what the header checkbox selects with{" "}
          <code
            className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
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
                    className={`px-3 py-1.5 text-xs rounded-lg cursor-pointer transition-colors ${dark ? "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30" : "bg-blue-50 text-blue-700 hover:bg-blue-100"}`}
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
                      className={`px-2.5 py-1 text-xs rounded-lg cursor-pointer ${dark ? "bg-white/[0.06] text-gray-300 hover:bg-white/[0.08]" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
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
                  className={`text-xs ${dark ? "text-gray-500" : "text-gray-400"}`}
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
          className={`mt-3 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
        >
          Use{" "}
          <code
            className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
          >
            onSaveView
          </code>{" "}
          to capture the current table state as a{" "}
          <code
            className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
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
          className={`mt-3 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
        >
          Note: When using Table component, pass these props with the "shimmer"
          prefix (e.g.,{" "}
          <code
            className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
          >
            shimmerClassName
          </code>
          ,{" "}
          <code
            className={`px-1 rounded ${dark ? "bg-white/[0.06]" : "bg-gray-100"}`}
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
            className={`space-y-2 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
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
                  className={`mt-0.5 shrink-0 ${dark ? "text-emerald-400" : "text-emerald-600"}`}
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
            className={`text-xs font-semibold mb-3 ${dark ? "text-gray-300" : "text-gray-700"}`}
          >
            Keyboard Reference
          </p>
          <div
            className={`space-y-2 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
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
