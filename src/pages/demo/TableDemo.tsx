import React, { useState, useMemo, useRef, useEffect } from "react";
import { Table, Pagination } from "../../components/Table";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Section,
  CodeBlock,
  DemoWrapper,
  PropsTable,
  PropRow,
  DocControlledPattern,
  DocEdgeCases,
  DocDoDont,
} from "./components";
import { useTheme } from "./ThemeContext";

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
}

function FloatingActions<T>({
  rowRef,
  rowData,
  onHover,
  isVisible,
  getName,
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

  return (
    <div
      className="z-30 flex items-center gap-0.5 bg-white/95 backdrop-blur-sm border border-gray-200 rounded shadow-sm px-1 py-0.5"
      style={{
        top: displayState.top,
        transform: "translate(-50%, -50%)",
        position: "absolute",
        left: "30%",
      }}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      <button
        className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer"
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
        className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors cursor-pointer"
        title="More options"
        onClick={() => alert(`More options: ${name}`)}
      >
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
        </svg>
      </button>
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

const containerStyle =
  "w-full border border-gray-200 rounded-lg overflow-hidden";
const tableStyle = "w-full border-collapse";
const headerRowStyle = "";
const headerCellStyle =
  "px-4 py-3 text-left text-sm font-medium text-gray-600 bg-gray-50 border-b border-gray-200 whitespace-nowrap";
const bodyStyle = "";
const rowStyle =
  "border-b border-gray-100 hover:bg-gray-100 transition-colors data-[clickable]:cursor-pointer";
const selectedRowStyle =
  "border-b border-gray-100 bg-blue-50 hover:bg-blue-100 transition-colors data-[clickable]:cursor-pointer";
const cellStyle = "px-4 py-3 text-sm text-gray-900 whitespace-nowrap";
const emptyStyle = "flex items-center justify-center py-12 text-gray-500";

const pinnedContainerStyle =
  "shrink-0 sticky left-0 z-20 border-r-2 border-blue-200 bg-white";
const pinnedTableStyle = "border-collapse";
const unpinnedContainerStyle = "min-w-0 flex-1 overflow-x-auto";
const unpinnedTableStyle = "w-full border-collapse";
const headerCellHoverStyle = "bg-gray-100";
const pinButtonStyle = "ml-2 p-1 rounded transition-colors hover:bg-gray-200";
const pinnedPinButtonStyle =
  "ml-2 p-1 rounded transition-colors hover:bg-blue-100";
const pinIconStyle = "text-gray-400";
const pinnedPinIconStyle = "text-blue-600";

const shimmerContainerStyle =
  "w-full border border-gray-200 rounded-lg overflow-hidden";
const shimmerContainerWideStyle = "w-max min-w-[1600px]"; // Matches table width for scroll demos
const shimmerRowStyle = "border-b border-gray-100";
const shimmerCellStyle = "px-4 py-2 h-14";
const shimmerBarStyle =
  "h-full w-full bg-linear-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse";

const paginationContainerStyle = "flex items-center justify-between mt-4 px-2";
const paginationRowSelectorStyle = "flex items-center gap-2";
const paginationButtonStyle =
  "flex items-center gap-1 px-2 py-1 border border-gray-300 rounded bg-white hover:bg-gray-50";
const paginationDropdownStyle =
  "absolute bottom-full mb-1 left-0 z-50 bg-white border border-gray-200 rounded shadow-lg min-w-[60px]";
const paginationOptionStyle =
  "w-full px-2 py-1 text-left text-sm hover:bg-gray-100 data-[selected]:bg-blue-50 data-[selected]:font-medium";
const paginationPageStyle =
  "px-2 py-1 text-sm text-gray-600 hover:text-gray-900";
const paginationActivePageStyle =
  "px-2 py-1 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded";
const paginationNavStyle =
  "p-1 text-gray-600 hover:text-gray-900 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed";
const paginationEllipsisStyle = "px-2 text-gray-400";
const paginationLabelStyle = "text-sm text-gray-600";

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

const StatusBadge = ({ status }: { status: User["status"] }) => {
  const styles = {
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
}: {
  performance: ExtendedUser["performance"];
}) => {
  const styles = {
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

const TableDemo = () => {
  const { isDarkMode: dark } = useTheme();
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
        cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
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
        cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
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
          <PerformanceBadge performance={row.getValue("performance")} />
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
    [],
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

  return (
    <>
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
            <CodeBlock
              isDarkMode={dark}
              code={`import { Table, Pagination } from "@kern-ui/table";`}
            />
          </div>
        </div>
      </header>

      <Section title="Basic Usage">
        <DemoWrapper isDarkMode={dark}>
          <Table
            columns={columns}
            data={sampleData.slice(0, 5)}
            containerClassName={containerStyle}
            tableClassName={tableStyle}
            headerRowClassName={headerRowStyle}
            headerCellClassName={headerCellStyle}
            bodyClassName={bodyStyle}
            rowClassName={rowStyle}
            cellClassName={cellStyle}
            emptyClassName={emptyStyle}
          />
        </DemoWrapper>
      </Section>

      <Section title="With Row Selection">
        <Table
          columns={columns}
          data={sampleData.slice(0, 5)}
          getRowId={(row) => row.id}
          selectedRowId={selectedRowId}
          onRowClick={handleRowClick}
          containerClassName={containerStyle}
          tableClassName={tableStyle}
          headerRowClassName={headerRowStyle}
          headerCellClassName={headerCellStyle}
          bodyClassName={bodyStyle}
          rowClassName={rowStyle}
          selectedRowClassName={selectedRowStyle}
          cellClassName={cellStyle}
          emptyClassName={emptyStyle}
        />
        {selectedRowId && (
          <p className="mt-2 text-sm text-gray-500">
            Selected:{" "}
            <code className="bg-gray-100 px-1 rounded">{selectedRowId}</code>
          </p>
        )}
      </Section>

      <Section title="With Floating Actions">
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
            />
          }
          containerClassName={containerStyle}
          tableClassName={tableStyle}
          headerRowClassName={headerRowStyle}
          headerCellClassName={headerCellStyle}
          bodyClassName={bodyStyle}
          rowClassName={rowStyle}
          cellClassName={cellStyle}
          emptyClassName={emptyStyle}
        />
        <p className="mt-3 text-sm text-gray-500">
          Hover over any row to see floating action buttons (View, Edit,
          Delete). The actions stay at the right edge of the table.
        </p>
      </Section>

      <Section title="With Pinned Columns (Interactive)">
        <div className="w-full">
          <Table
            columns={columns}
            data={sampleData.slice(0, 5)}
            pinnedColumns={pinnedCols}
            onPinColumn={handlePinColumn}
            maxPinnedColumns={3}
            containerClassName={`${containerStyle} overflow-x-auto`}
            tableClassName={tableStyle}
            pinnedTableClassName={pinnedTableStyle}
            unpinnedTableClassName={unpinnedTableStyle}
            headerRowClassName={headerRowStyle}
            headerCellClassName={headerCellStyle}
            headerCellHoverClassName={headerCellHoverStyle}
            bodyClassName={bodyStyle}
            rowClassName={rowStyle}
            cellClassName={cellStyle}
            pinnedContainerClassName={pinnedContainerStyle}
            unpinnedContainerClassName={unpinnedContainerStyle}
            pinButtonClassName={pinButtonStyle}
            pinnedPinButtonClassName={pinnedPinButtonStyle}
            pinIconClassName={pinIconStyle}
            pinnedPinIconClassName={pinnedPinIconStyle}
            emptyClassName={emptyStyle}
          />
        </div>
        <div className="mt-2 text-sm text-gray-500 space-y-1">
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

      <Section title="With Pagination">
        <div>
          <Table
            columns={columns}
            data={paginatedData}
            getRowId={(row) => row.id}
            selectedRowId={selectedRowId}
            onRowClick={handleRowClick}
            containerClassName={containerStyle}
            tableClassName={tableStyle}
            headerRowClassName={headerRowStyle}
            headerCellClassName={headerCellStyle}
            bodyClassName={bodyStyle}
            rowClassName={rowStyle}
            selectedRowClassName={selectedRowStyle}
            cellClassName={cellStyle}
            emptyClassName={emptyStyle}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            rowsPerPage={rowsPerPage}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            classes={{
              root: paginationContainerStyle,
              selector: paginationRowSelectorStyle,
              selectorButton: paginationButtonStyle,
              selectorDropdown: paginationDropdownStyle,
              selectorOption: paginationOptionStyle,
              pageButton: paginationPageStyle,
              activePageButton: paginationActivePageStyle,
              navButton: paginationNavStyle,
              ellipsis: paginationEllipsisStyle,
              label: paginationLabelStyle,
            }}
          />
        </div>
      </Section>

      <Section title="Dark/Modern Pagination Style">
        <div>
          <Table
            columns={columns}
            data={darkPaginatedData}
            containerClassName={containerStyle}
            tableClassName={tableStyle}
            headerRowClassName={headerRowStyle}
            headerCellClassName={headerCellStyle}
            bodyClassName={bodyStyle}
            rowClassName={rowStyle}
            cellClassName={cellStyle}
            emptyClassName={emptyStyle}
          />
          <Pagination
            currentPage={darkCurrentPage}
            totalPages={darkTotalPages}
            rowsPerPage={darkRowsPerPage}
            rowOptions={[3, 6, 9, 12]}
            onPageChange={handleDarkPageChange}
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
        <p className="mt-3 text-sm text-gray-500">
          Alternative dark theme pagination with custom row options: 3, 6, 9, 12
        </p>
      </Section>

      <Section title="Horizontal Scroll (Many Columns)">
        <Table
          columns={extendedColumns}
          data={extendedSampleData.slice(0, 5)}
          maxWidth={900}
          containerClassName="border border-gray-200 rounded-lg"
          tableClassName="w-max border-collapse"
          headerRowClassName={headerRowStyle}
          headerCellClassName={headerCellStyle}
          bodyClassName={bodyStyle}
          rowClassName={rowStyle}
          cellClassName={cellStyle}
          emptyClassName={emptyStyle}
        />
        <p className="mt-3 text-sm text-gray-500">
          Table with 14 columns and{" "}
          <code className="bg-gray-100 px-1 rounded">maxWidth={"{900}"}</code>{" "}
          demonstrates horizontal scrolling.
        </p>
      </Section>

      <Section title="Vertical Scroll (Fixed Height)">
        <Table
          columns={columns}
          data={sampleData}
          maxHeight={300}
          containerClassName="w-full border border-gray-200 rounded-lg"
          tableClassName={tableStyle}
          headerRowClassName={headerRowStyle}
          headerCellClassName={headerCellStyle}
          bodyClassName={bodyStyle}
          rowClassName={rowStyle}
          cellClassName={cellStyle}
          emptyClassName={emptyStyle}
        />
        <p className="mt-3 text-sm text-gray-500">
          Table with{" "}
          <code className="bg-gray-100 px-1 rounded">maxHeight={"{300}"}</code>{" "}
          shows vertical scrolling within the table.
        </p>
      </Section>

      <Section title="Sticky Header">
        <Table
          columns={columns}
          data={sampleData}
          maxHeight={250}
          stickyHeader
          containerClassName="w-full border border-gray-200 rounded-lg"
          tableClassName={tableStyle}
          headerRowClassName={headerRowStyle}
          headerCellClassName={headerCellStyle}
          bodyClassName={bodyStyle}
          rowClassName={rowStyle}
          cellClassName={cellStyle}
          emptyClassName={emptyStyle}
        />
        <p className="mt-3 text-sm text-gray-500">
          Table with{" "}
          <code className="bg-gray-100 px-1 rounded">stickyHeader</code> prop -
          the header stays visible while scrolling vertically. No need to
          manually add sticky classes.
        </p>
      </Section>

      <Section title="Both Scrollbars (Fixed Height + Many Columns)">
        <Table
          columns={extendedColumns}
          data={extendedSampleData}
          maxWidth={900}
          maxHeight={350}
          containerClassName="border border-gray-200 rounded-lg"
          tableClassName="w-max border-collapse"
          headerRowClassName={headerRowStyle}
          headerCellClassName={headerCellStyle}
          bodyClassName={bodyStyle}
          rowClassName={rowStyle}
          cellClassName={cellStyle}
          emptyClassName={emptyStyle}
        />
        <p className="mt-3 text-sm text-gray-500">
          Table with{" "}
          <code className="bg-gray-100 px-1 rounded">maxWidth={"{900}"}</code>{" "}
          and{" "}
          <code className="bg-gray-100 px-1 rounded">maxHeight={"{350}"}</code>{" "}
          creates both scrollbars.
        </p>
      </Section>

      <Section title="Hidden Vertical Scrollbar">
        <Table
          columns={columns}
          data={sampleData}
          maxHeight={250}
          hideVerticalScrollbar
          containerClassName="w-full border border-gray-200 rounded-lg"
          tableClassName={tableStyle}
          headerRowClassName={headerRowStyle}
          headerCellClassName={headerCellStyle}
          bodyClassName={bodyStyle}
          rowClassName={rowStyle}
          cellClassName={cellStyle}
          emptyClassName={emptyStyle}
        />
        <p className="mt-3 text-sm text-gray-500">
          Table with{" "}
          <code className="bg-gray-100 px-1 rounded">maxHeight={"{250}"}</code>{" "}
          and{" "}
          <code className="bg-gray-100 px-1 rounded">
            hideVerticalScrollbar
          </code>{" "}
          - scroll functionality works but the scrollbar is hidden. Try
          scrolling with mouse wheel or trackpad.
        </p>
      </Section>

      <Section title="Hidden Scrollbars (Both Directions)">
        <Table
          columns={extendedColumns}
          data={extendedSampleData}
          maxWidth={900}
          maxHeight={300}
          hideVerticalScrollbar
          hideHorizontalScrollbar
          containerClassName="border border-gray-200 rounded-lg"
          tableClassName="w-max border-collapse"
          headerRowClassName={headerRowStyle}
          headerCellClassName={headerCellStyle}
          bodyClassName={bodyStyle}
          rowClassName={rowStyle}
          cellClassName={cellStyle}
          emptyClassName={emptyStyle}
        />
        <p className="mt-3 text-sm text-gray-500">
          Table with both{" "}
          <code className="bg-gray-100 px-1 rounded">
            hideVerticalScrollbar
          </code>{" "}
          and{" "}
          <code className="bg-gray-100 px-1 rounded">
            hideHorizontalScrollbar
          </code>{" "}
          - scrollable in both directions but no visible scrollbars. Use mouse
          wheel, trackpad, or touch to scroll.
        </p>
      </Section>

      <Section title="Comprehensive Demo (All Features)">
        <div className="space-y-4">
          <div className="flex items-center gap-4 flex-wrap">
            <button
              onClick={() => setCompIsLoading(true)}
              className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Simulate Loading
            </button>
            <button
              onClick={() => {
                setCompIsLoading(true);
                setTimeout(() => setCompIsLoading(false), 2000);
              }}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Reload Data (2s)
            </button>
            <span className="text-sm text-gray-500">
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
              />
            }
            containerClassName="border border-gray-200 rounded-lg"
            tableClassName="w-max border-collapse"
            pinnedTableClassName={pinnedTableStyle}
            unpinnedTableClassName="w-max border-collapse"
            headerRowClassName={headerRowStyle}
            headerCellClassName={headerCellStyle}
            headerCellHoverClassName={headerCellHoverStyle}
            bodyClassName={bodyStyle}
            rowClassName={rowStyle}
            cellClassName={cellStyle}
            pinnedContainerClassName="shrink-0 sticky left-0 z-20 border-r-2 border-blue-200 bg-white"
            unpinnedContainerClassName=""
            pinButtonClassName={pinButtonStyle}
            pinnedPinButtonClassName={pinnedPinButtonStyle}
            pinIconClassName={pinIconStyle}
            pinnedPinIconClassName={pinnedPinIconStyle}
            emptyClassName={emptyStyle}
            shimmerClassName={shimmerContainerWideStyle}
            shimmerRowClassName={shimmerRowStyle}
            shimmerCellClassName={shimmerCellStyle}
            shimmerBarClassName={shimmerBarStyle}
          />

          <div className="text-sm text-gray-500 space-y-1">
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

      <Section title="Loading State">
        <Table
          columns={columns}
          data={[]}
          loading
          shimmerRowCount={5}
          shimmerClassName={shimmerContainerStyle}
          shimmerRowClassName={shimmerRowStyle}
          shimmerCellClassName={shimmerCellStyle}
          shimmerBarClassName={shimmerBarStyle}
          containerClassName={containerStyle}
          tableClassName={tableStyle}
        />
      </Section>

      <Section title="Empty State (Fully Customizable)">
        <Table
          columns={columns}
          data={[]}
          emptyContent={
            <div className="flex flex-col items-center justify-center py-16 px-4 bg-linear-to-b from-gray-50 to-white border border-gray-200 rounded-lg">
              {/* Custom Icon */}
              <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                <svg
                  className="w-10 h-10 text-blue-500"
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
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No users found
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-500 text-center max-w-sm mb-6">
                Get started by adding your first team member. You can invite
                users via email or create accounts manually.
              </p>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
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
                <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Import CSV
                </button>
              </div>
            </div>
          }
          containerClassName={containerStyle}
          tableClassName={tableStyle}
          headerRowClassName={headerRowStyle}
          headerCellClassName={headerCellStyle}
          bodyClassName={bodyStyle}
        />
        <p className="mt-3 text-sm text-gray-500">
          The <code className="bg-gray-100 px-1 rounded">emptyContent</code>{" "}
          prop accepts any React node, giving you full control over the empty
          state UI — icons, buttons, styling, and layout are all customizable.
        </p>
      </Section>

      <Section title="Table Props">
        <PropsTable isDarkMode={dark}>
          <PropRow name="columns" type="ColumnDef[]" description="TanStack table column definitions" isDarkMode={dark} />
          <PropRow name="COLUMNS" type="ColumnDef[]" description="Alternative to columns prop" isDarkMode={dark} />
          <PropRow name="data" type="TData[]" description="Table data array" isDarkMode={dark} />
          <PropRow name="COLUMNS_DATA" type="TData[]" description="Alternative to data prop" isDarkMode={dark} />
          <PropRow name="loading" type="boolean" defaultVal="false" description="Show loading shimmer state" isDarkMode={dark} />
          <PropRow name="showHeader" type="boolean" defaultVal="true" description="Show/hide table header" isDarkMode={dark} />
          <PropRow name="tableHeader" type="boolean" description="Alternative to showHeader prop" isDarkMode={dark} />
          <PropRow name="maxWidth" type="string | number" description="Maximum width with horizontal scroll" isDarkMode={dark} />
          <PropRow name="maxHeight" type="string | number" description="Maximum height with vertical scroll" isDarkMode={dark} />
          <PropRow name="minHeight" type="string | number" description="Minimum height of the table" isDarkMode={dark} />
          <PropRow name="hideVerticalScrollbar" type="boolean" defaultVal="false" description="Hide vertical scrollbar while keeping scroll" isDarkMode={dark} />
          <PropRow name="hideHorizontalScrollbar" type="boolean" defaultVal="false" description="Hide horizontal scrollbar while keeping scroll" isDarkMode={dark} />
          <PropRow name="stickyHeader" type="boolean" defaultVal="false" description="Make header sticky during vertical scroll" isDarkMode={dark} />
          <PropRow name="pinnedColumns" type="string[]" defaultVal="[]" description="Column IDs to pin left" isDarkMode={dark} />
          <PropRow name="onPinColumn" type="(columnId, isPinned) => void" description="Handler when column is pinned/unpinned" isDarkMode={dark} />
          <PropRow name="pinnableColumns" type="string[]" defaultVal="all" description="Columns that can be pinned" isDarkMode={dark} />
          <PropRow name="maxPinnedColumns" type="number" defaultVal="3" description="Maximum pinnable columns (1-5)" isDarkMode={dark} />
          <PropRow name="getRowId" type="(row) => string" description="Get unique row ID for selection" isDarkMode={dark} />
          <PropRow name="selectedRowId" type="string | null" description="Currently selected row ID" isDarkMode={dark} />
          <PropRow name="onRowClick" type="(row) => void" description="Row click handler" isDarkMode={dark} />
          <PropRow name="onRowHover" type="(index, ref) => void" description="Row hover handler for floating actions" isDarkMode={dark} />
          <PropRow name="floatingActions" type="ReactNode" description="Floating action buttons component" isDarkMode={dark} />
          <PropRow name="isFloatingActionsHovered" type="boolean" defaultVal="false" description="Whether floating actions are hovered" isDarkMode={dark} />
          <PropRow name="isPopupOpen" type="boolean" defaultVal="false" description="Whether a popup is open (prevents hover reset)" isDarkMode={dark} />
          <PropRow name="emptyContent" type="ReactNode" description="Custom empty state content" isDarkMode={dark} />
          <PropRow name="ariaLabel" type="string" defaultVal='"Data table"' description="Accessibility label for the table" isDarkMode={dark} />
          <PropRow name="shimmerRowCount" type="number" defaultVal="10" description="Number of shimmer rows when loading" isDarkMode={dark} />
          <PropRow name="PinIcon" type="ComponentType" defaultVal="default" description="Custom icon for unpinned state" isDarkMode={dark} />
          <PropRow name="PinnedIcon" type="ComponentType" defaultVal="PinIcon" description="Custom icon for pinned state" isDarkMode={dark} />
          <PropRow name="onCursorPosition" type="(pos) => void" description="Cursor position callback" isDarkMode={dark} />
          <PropRow name="onCursorOverHeader" type="(bool) => void" description="Cursor over header callback" isDarkMode={dark} />
          <PropRow name="children" type="ReactNode" description="Children rendered before table" isDarkMode={dark} />
        </PropsTable>
      </Section>

      <Section title="Pagination Props">
        <PropsTable isDarkMode={dark}>
          <PropRow name="currentPage" type="number" description="Current active page (1-indexed)" isDarkMode={dark} />
          <PropRow name="totalPages" type="number" description="Total number of pages" isDarkMode={dark} />
          <PropRow name="rowsPerPage" type="number" description="Current rows per page" isDarkMode={dark} />
          <PropRow name="rowOptions" type="number[]" defaultVal="[5,10,25,50]" description="Available rows per page options" isDarkMode={dark} />
          <PropRow name="onPageChange" type="(page) => void" description="Page change handler" isDarkMode={dark} />
          <PropRow name="onRowsPerPageChange" type="(rows) => void" description="Rows per page change handler" isDarkMode={dark} />
          <PropRow name="showRowsPerPage" type="boolean" defaultVal="true" description="Show rows per page selector" isDarkMode={dark} />
          <PropRow name="rowsPerPageLabel" type="string" defaultVal='"rows"' description="Label after row count" isDarkMode={dark} />
          <PropRow name="classes" type="PaginationClasses" defaultVal="{}" description="Slot class overrides (17 slots: root, nav, pageButtons, pageButton, activePageButton, navButton, ellipsis, selector, selectorButton, selectorDropdown, selectorOption, label, etc.)" isDarkMode={dark} />
          <PropRow name="unstyled" type="boolean" defaultVal="false" description="Strip all default classes" isDarkMode={dark} />
        </PropsTable>
      </Section>

      <Section title="Table Styling Props">
        <PropsTable isDarkMode={dark}>
          <PropRow name="containerClassName" type="string" description="Root container wrapper" isDarkMode={dark} />
          <PropRow name="tableClassName" type="string" description="Table element (default for both pinned/unpinned)" isDarkMode={dark} />
          <PropRow name="pinnedTableClassName" type="string" description="Pinned columns table element" isDarkMode={dark} />
          <PropRow name="unpinnedTableClassName" type="string" description="Unpinned columns table element" isDarkMode={dark} />
          <PropRow name="headerClassName" type="string" description="thead element" isDarkMode={dark} />
          <PropRow name="headerRowClassName" type="string" description="Header row (tr) element" isDarkMode={dark} />
          <PropRow name="headerCellClassName" type="string" description="th elements" isDarkMode={dark} />
          <PropRow name="headerCellHoverClassName" type="string" description="th hover state" isDarkMode={dark} />
          <PropRow name="headerCellContentClassName" type="string" description="Header cell content wrapper" isDarkMode={dark} />
          <PropRow name="bodyClassName" type="string" description="tbody element" isDarkMode={dark} />
          <PropRow name="rowClassName" type="string" description="tr elements (unselected)" isDarkMode={dark} />
          <PropRow name="selectedRowClassName" type="string" description="tr elements (selected)" isDarkMode={dark} />
          <PropRow name="cellClassName" type="string" description="td elements" isDarkMode={dark} />
          <PropRow name="pinnedContainerClassName" type="string" description="Pinned columns container" isDarkMode={dark} />
          <PropRow name="unpinnedContainerClassName" type="string" description="Scrollable columns container" isDarkMode={dark} />
          <PropRow name="emptyClassName" type="string" description="Empty state container" isDarkMode={dark} />
          <PropRow name="pinButtonClassName" type="string" description="Pin button (unpinned state)" isDarkMode={dark} />
          <PropRow name="pinnedPinButtonClassName" type="string" description="Pin button (pinned state)" isDarkMode={dark} />
          <PropRow name="pinIconClassName" type="string" description="Pin icon (unpinned state)" isDarkMode={dark} />
          <PropRow name="pinIconHoverClassName" type="string" description="Pin icon hover (unpinned)" isDarkMode={dark} />
          <PropRow name="pinnedPinIconClassName" type="string" description="Pin icon (pinned state)" isDarkMode={dark} />
          <PropRow name="pinnedPinIconHoverClassName" type="string" description="Pin icon hover (pinned)" isDarkMode={dark} />
          <PropRow name="shimmerClassName" type="string" description="Shimmer container class" isDarkMode={dark} />
          <PropRow name="shimmerRowClassName" type="string" description="Shimmer row wrapper class" isDarkMode={dark} />
          <PropRow name="shimmerCellClassName" type="string" description="Shimmer cell wrapper class" isDarkMode={dark} />
          <PropRow name="shimmerBarClassName" type="string" description="Shimmer bar element class" isDarkMode={dark} />
        </PropsTable>
      </Section>

      <Section title="TableShimmer Props">
        <PropsTable isDarkMode={dark}>
          <PropRow name="rowCount" type="number" defaultVal="10" description="Number of shimmer rows" isDarkMode={dark} />
          <PropRow name="className" type="string" defaultVal="default" description="Container class (via shimmerClassName on Table)" isDarkMode={dark} />
          <PropRow name="rowClassName" type="string" defaultVal="default" description="Row wrapper class (via shimmerRowClassName)" isDarkMode={dark} />
          <PropRow name="cellClassName" type="string" defaultVal="default" description="Cell wrapper class (via shimmerCellClassName)" isDarkMode={dark} />
          <PropRow name="shimmerClassName" type="string" defaultVal="default" description="Shimmer bar class (via shimmerBarClassName)" isDarkMode={dark} />
        </PropsTable>
        <p className="mt-3 text-sm text-gray-500">
          Note: When using Table component, pass these props with the "shimmer"
          prefix (e.g.,{" "}
          <code className="bg-gray-100 px-1 rounded">shimmerClassName</code>,{" "}
          <code className="bg-gray-100 px-1 rounded">shimmerRowClassName</code>,
          etc.)
        </p>
      </Section>

      <Section
        title="Core API (PropsTable)"
        description="Shared documentation layout for primary Table props."
      >
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
      </Section>

      {/* ─── Data Attributes ──────────────────────────────────────────── */}
      <Section title="Data Attributes" description="Use for CSS-based state styling." isDarkMode={dark}>
        <div className={`rounded-2xl border p-5 ${dark ? "border-white/[0.06] bg-linear-to-br from-white/[0.03] to-white/[0.01]" : "border-gray-200 bg-white shadow-sm shadow-gray-900/[0.04]"}`}>
          <PropsTable isDarkMode={dark}>
            <PropRow name="data-table-container" type="root" description="Always present on the scrollable container" isDarkMode={dark} />
            <PropRow name="data-testid" type="root" description="Test identifier for integration tests" isDarkMode={dark} />
            <PropRow name="data-pinned" type="cell, header" description='Present on pinned columns ("left" or "right")' isDarkMode={dark} />
            <PropRow name="data-column-index" type="cell, header" description="Zero-based column index for CSS targeting" isDarkMode={dark} />
            <PropRow name="data-selected" type="row" description="Present on selected rows" isDarkMode={dark} />
            <PropRow name="data-clickable" type="row" description="Present when onRowClick is provided" isDarkMode={dark} />
            <PropRow name="data-focused" type="cell" description="Present on the keyboard-focused cell" isDarkMode={dark} />
          </PropsTable>
        </div>
      </Section>

      {/* ─── Accessibility ────────────────────────────────────────────── */}
      <Section title="Accessibility" description="Built-in accessibility features." isDarkMode={dark}>
        <div className={`rounded-2xl border p-5 ${dark ? "border-white/[0.06] bg-linear-to-br from-white/[0.03] to-white/[0.01]" : "border-gray-200 bg-white shadow-sm shadow-gray-900/[0.04]"}`}>
          <div className={`space-y-2 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>
            {[
              'Table uses role="grid" with role="row", role="gridcell", and role="columnheader" for proper structure',
              "aria-label on the table element provides an accessible name for the grid landmark",
              "aria-sort on sortable column headers announces current sort direction",
              "aria-selected on focused cells indicates the active cell to screen readers",
              "aria-rowindex on each row for virtual scrolling context",
              "Full keyboard grid navigation between cells, rows, and headers",
              'Pin button includes aria-label describing the pin action and target column',
            ].map((text) => (
              <p key={text} className="flex items-start gap-2">
                <span className={`mt-0.5 shrink-0 ${dark ? "text-emerald-400" : "text-emerald-600"}`}>&#10003;</span>
                <span>{text}</span>
              </p>
            ))}
          </div>
        </div>
        <div className={`rounded-2xl border p-5 mt-3 ${dark ? "border-white/[0.06] bg-linear-to-br from-white/[0.03] to-white/[0.01]" : "border-gray-200 bg-white shadow-sm shadow-gray-900/[0.04]"}`}>
          <p className={`text-xs font-semibold mb-3 ${dark ? "text-gray-300" : "text-gray-700"}`}>
            Keyboard Reference
          </p>
          <div className={`space-y-2 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>
            {[
              ["Arrow keys", "Navigate between cells in the grid"],
              ["Escape", "Clear cell focus and exit grid navigation"],
              ["Tab", "Exit the grid and move to next focusable element"],
            ].map(([key, desc]) => (
              <div key={key} className="flex items-center gap-3">
                <kbd className={`px-2 py-1 rounded-md text-[11px] font-mono min-w-[2.5rem] text-center font-medium ${dark ? "bg-gray-900 border border-white/10 text-gray-300 shadow-sm" : "bg-white border border-gray-200 text-gray-600 shadow-sm"}`}>{key}</kbd>
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
    </>
  );
};

export default TableDemo;
