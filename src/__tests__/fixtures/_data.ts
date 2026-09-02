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

// No `content` key: TabPanelProps documents panel content as a `children`
// render function and says so ("Not a `renderContent` prop or `content` on tab
// objects"). Every TabPanel fixture carried one anyway, and it was ignored.
export const TABS = [
  { id: "one", label: "First", icon: "1", count: 3 },
  { id: "two", label: "Second", disabled: true },
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
