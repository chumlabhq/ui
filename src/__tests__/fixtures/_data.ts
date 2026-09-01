/** Shared sample data, so fixtures differ by state rather than by payload. */
export const OPTIONS = [
  { value: "a", label: "Apple" },
  { value: "b", label: "Banana" },
  { value: "c", label: "Cherry", disabled: true },
];

export const STEPS = [
  { id: "one", label: "Details", description: "Your details" },
  { id: "two", label: "Payment", description: "Card details" },
  { id: "three", label: "Done", description: "All set" },
];

export const TABS = [
  { id: "one", label: "First", content: "First panel", icon: "1", count: 3 },
  { id: "two", label: "Second", content: "Second panel", disabled: true },
];

export const CRUMBS = [
  { id: "home", label: "Home", href: "/" },
  { id: "docs", label: "Docs", href: "/docs" },
  { id: "here", label: "Here", disabled: true },
];

export const ROWS = [
  { id: "1", name: "Ada", role: "Engineer" },
  { id: "2", name: "Grace", role: "Admiral" },
];

export const COLUMNS = [
  { id: "name", accessorKey: "name", header: "Name" },
  { id: "role", accessorKey: "role", header: "Role" },
];
