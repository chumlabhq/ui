"use client";

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

const PerformanceBadge = ({
  performance,
}: {
  performance: ExtendedUser["performance"];
}) => {
  const styles = {
        excellent: "bg-cl-success/15 text-cl-text",
        good: "bg-cl-accent/10 text-cl-text",
        average: "bg-cl-warning/15 text-cl-text",
        poor: "bg-cl-error/15 text-cl-text",
      };

  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full ${styles[performance]}`}
    >
      {performance.charAt(0).toUpperCase() + performance.slice(1)}
    </span>
  );
};

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

export default function TableExample() {
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
          <StatusBadge status={row.getValue("status")} />
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
    [],
  );
  return (
    <Table
      columns={extendedColumns}
      data={extendedSampleData}
      maxWidth={900}
      maxHeight={300}
      hideVerticalScrollbar
      hideHorizontalScrollbar
      classes={
        {
          ...s,
          ...s,
          root: "border rounded-cl-md border-cl-border",
          list: "w-max border-collapse"
        }
      }
    />
  );
}
