import { useState, useEffect, useRef } from "react";
import { NavLink, Outlet, useLocation, Link } from "react-router-dom";
import { ThemeContext } from "./ThemeContext";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import logoDark from "../../assets/images/logo-dark.png";
import logoLight from "../../assets/images/logo-light.png";

interface ComponentItem {
  path: string;
  displayName: string;
  description?: string;
}

const components: ComponentItem[] = [
  { path: "accordion", displayName: "Accordion", description: "Accessible, animated accordion component for React. Supports single and multiple expand modes, keyboard navigation, controlled state, and full Tailwind CSS customization." },
  { path: "avatar", displayName: "Avatar", description: "React avatar component with image, initials, and icon support. Includes avatar groups, status indicators, badges, auto-generated colors, and loading shimmer states." },
  { path: "breadcrumb", displayName: "Breadcrumb", description: "Accessible breadcrumb navigation for React. Features truncation with dropdown, custom separators, icons, tooltips, and per-item click handlers." },
  { path: "button", displayName: "Button", description: "Production-grade React button with variants, sizes, icon animations, loading states, tooltips, button groups, and polymorphic rendering via the as prop." },
  { path: "cascading-dropdown", displayName: "Cascading Dropdown", description: "Multi-level cascading dropdown for React with nested submenus, single and multi-select, async data loading, search with debounce, and REST API integration." },
  { path: "checkbox", displayName: "Checkbox", description: "Accessible React checkbox with indeterminate state, custom icons, label positioning, and full keyboard support." },
  { path: "country-flag", displayName: "Country Flag", description: "Render country flag images by ISO code. Supports multiple sizes, custom fallback, and lazy loading." },
  { path: "date-picker", displayName: "Date Picker", description: "Full-featured React date picker with range selection, min/max dates, disabled dates, keyboard navigation, and locale support." },
  { path: "drawer", displayName: "Drawer", description: "Accessible slide-out drawer component for React. Supports all four directions, focus trapping, backdrop, and nested drawers." },
  { path: "dropdown", displayName: "Dropdown", description: "Accessible React dropdown select with keyboard navigation, search filtering, custom rendering, and portal-based positioning." },
  { path: "input", displayName: "Input", description: "Versatile React input component with validation states, prefix/suffix slots, clearable option, and full form integration." },
  {
    path: "international-phone-input",
    displayName: "International Phone Input",
    description: "International phone number input for React with country code selector, flag display, and phone number formatting.",
  },
  { path: "loader", displayName: "Loader", description: "Animated loading indicators for React. Multiple variants including spinner, dots, pulse, and skeleton shimmer." },
  { path: "modal", displayName: "Modal", description: "Accessible React modal dialog with focus trapping, keyboard dismiss, nested modals, and customizable overlay." },
  { path: "multi-select-dropdown", displayName: "Multi Select Dropdown", description: "Multi-select dropdown for React with chip display, select all, max selection limits, and keyboard navigation." },
  {
    path: "multi-select-searchable-dropdown",
    displayName: "Multi Select Searchable Dropdown",
    description: "Searchable multi-select dropdown for React with async search, debounce, chip display, and custom option rendering.",
  },
  { path: "otp-input", displayName: "OTP Input", description: "One-time password input for React with auto-focus advance, paste support, masked mode, and configurable length." },
  { path: "pagination", displayName: "Pagination", description: "Accessible React pagination with page size selector, jump-to-page, ellipsis truncation, and responsive layout." },
  { path: "radio-button", displayName: "Radio Button", description: "Accessible React radio button group with horizontal and vertical layouts, custom icons, and controlled state." },
  { path: "resizable-panel", displayName: "Resizable Panel", description: "Draggable resizable panel layout for React with min/max constraints, collapse, and nested panels." },
  { path: "searchable-dropdown", displayName: "Searchable Dropdown", description: "Searchable dropdown for React with async search, debounce, initial options, custom rendering, and keyboard navigation." },
  { path: "slider", displayName: "Slider", description: "Accessible React slider with range mode, step marks, tooltips, vertical orientation, and custom track styling." },
  { path: "stepper", displayName: "Stepper", description: "Multi-step progress indicator for React with horizontal and vertical layouts, clickable steps, and custom icons." },
  { path: "switch", displayName: "Switch", description: "Accessible React toggle switch with labels, sizes, custom track and thumb styling, and reduced motion support." },
  { path: "tab-panel", displayName: "Tab Panel", description: "Accessible React tabs with lazy loading, closable tabs, overflow scroll, vertical orientation, and keyboard navigation." },
  { path: "table", displayName: "Table", description: "Feature-rich React data table with sorting, filtering, pagination, row selection, expandable rows, and sticky columns." },
  { path: "text-area", displayName: "Text Area", description: "React textarea with auto-resize, character count, validation states, and full form integration." },
  { path: "time-picker", displayName: "Time Picker", description: "Accessible React time picker with 12/24 hour format, minute intervals, min/max time, and keyboard input." },
  { path: "toast", displayName: "Toast", description: "Toast notification system for React with multiple positions, auto-dismiss, progress bar, and stacking." },
  { path: "tooltip", displayName: "Tooltip", description: "Accessible React tooltip with configurable placement, delay, arrow, and rich content support." },
];

const ThemeToggle = ({
  isDarkMode,
  toggle,
}: {
  isDarkMode: boolean;
  toggle: () => void;
}) => (
  <button
    onClick={toggle}
    aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer group transition-colors duration-200 text-sm font-medium ${
      isDarkMode
        ? "hover:bg-white/8 active:bg-white/12 text-gray-300"
        : "hover:bg-black/5 active:bg-black/10 text-gray-600"
    }`}
  >
    {/* Sun icon */}
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={`transition-all duration-300 ease-out ${
        isDarkMode
          ? "text-amber-400 group-hover:text-amber-300"
          : "hidden"
      }`}
    >
      <path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM10 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zM10 7a3 3 0 100 6 3 3 0 000-6zM15.657 5.404a.75.75 0 10-1.06-1.06l-1.061 1.06a.75.75 0 001.06 1.06l1.06-1.06zM6.464 14.596a.75.75 0 10-1.06-1.06l-1.06 1.06a.75.75 0 001.06 1.06l1.06-1.06zM18 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 0118 10zM5 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 015 10zM14.596 15.657a.75.75 0 001.06-1.06l-1.06-1.061a.75.75 0 10-1.06 1.06l1.06 1.06zM5.404 6.464a.75.75 0 001.06-1.06l-1.06-1.06a.75.75 0 10-1.06 1.06l1.06 1.06z" />
    </svg>
    {/* Moon icon */}
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={`transition-all duration-300 ease-out ${
        isDarkMode
          ? "hidden"
          : "text-slate-500 group-hover:text-indigo-500"
      }`}
    >
      <path
        fillRule="evenodd"
        d="M7.455 2.004a.75.75 0 01.26.77 7 7 0 009.958 7.967.75.75 0 011.067.853A8.5 8.5 0 116.647 1.921a.75.75 0 01.808.083z"
        clipRule="evenodd"
      />
    </svg>
    <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
  </button>
);

const MenuIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseMenuIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const Demo = () => {
  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // SEO: Set document title based on the active component route
  const activeComponent = components.find(
    (c) => location.pathname === `/${c.path}`
  );
  useDocumentTitle(
    activeComponent ? `${activeComponent.displayName} Component` : "Components",
    activeComponent?.description
  );
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const stored = localStorage.getItem("chumlab-ui-theme");
    if (stored) return stored === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("chumlab-ui-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("chumlab-ui-theme", "light");
    }
  }, [isDarkMode]);

  // Close sidebar on route change (render-time derived state)
  const [prevPathname, setPrevPathname] = useState(location.pathname);
  if (prevPathname !== location.pathname) {
    setPrevPathname(location.pathname);
    if (sidebarOpen) {
      setSidebarOpen(false);
    }
  }

  // Scroll to top on route change
  useEffect(() => {
    mainRef.current?.scrollTo(0, 0);
  }, [location.pathname]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  // Colors matching home page blue palette
  const bg = isDarkMode ? "bg-[#08080f]" : "bg-gray-50";
  const sidebarBg = isDarkMode ? "bg-[#0a0a14]" : "bg-white";
  const borderColor = isDarkMode ? "border-white/[0.06]" : "border-gray-200";
  const activeLink = isDarkMode
    ? "bg-blue-500/15 text-blue-400 font-medium"
    : "bg-blue-50 text-blue-700 font-medium";
  const inactiveLink = isDarkMode
    ? "text-white/90 hover:bg-white/4 hover:text-white"
    : "text-black/90 hover:bg-gray-50 hover:text-black";

  const sidebarContent = (
    <>
      <div className="flex items-center mb-8">
        <Link to="/" className="flex items-center group">
          <div className="relative">
            <img
              src={isDarkMode ? logoLight : logoDark}
              alt="Chumlab"
              width={160}
              height={160}
              style={{ width: 160, height: "auto", objectFit: "contain" }}
            />
          </div>
        </Link>
      </div>

      <nav className="flex flex-col gap-0.5">
        {components.map(({ path, displayName }) => (
          <NavLink
            key={path}
            to={`/${path}`}
            className={({ isActive }) =>
              `text-left px-3 py-2 rounded-lg text-[13px] lg:text-[15px] transition-all duration-200 ${isActive ? activeLink : inactiveLink}`
            }
          >
            {displayName}
          </NavLink>
        ))}
      </nav>
    </>
  );

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      <div
        className={`h-screen flex flex-col lg:flex-row overflow-hidden ${bg}`}
      >
        {/* ── Mobile top bar ── */}
        <div
          className={`lg:hidden flex items-center justify-between px-4 py-3 border-b shrink-0 ${sidebarBg} ${borderColor}`}
        >
          <Link to="/" className="flex items-center gap-2">
            <img
              src={isDarkMode ? logoLight : logoDark}
              alt="Chumlab"
              width={160}
              height={160}
              style={{ width: 160, height: "auto", objectFit: "contain" }}
            />
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle isDarkMode={isDarkMode} toggle={toggleDarkMode} />
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`p-1.5 rounded-lg transition-colors ${isDarkMode ? "text-gray-400 hover:bg-white/6" : "text-gray-600 hover:bg-gray-100"}`}
              aria-label={sidebarOpen ? "Close menu" : "Open menu"}
            >
              {sidebarOpen ? <CloseMenuIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* ── Mobile sidebar overlay ── */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ── Mobile sidebar drawer ── */}
        <aside
          className={`lg:hidden fixed top-0 right-0 z-50 h-full w-[280px] max-w-[80vw] p-5 overflow-y-auto transition-transform duration-300 ease-out
          [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
          ${sidebarOpen ? "translate-x-0" : "translate-x-full"}
          ${sidebarBg}`}
        >
          <div className="flex items-center justify-between mb-8">
            <Link to="/" className="flex items-center" onClick={() => setSidebarOpen(false)}>
              <img
                src={isDarkMode ? logoLight : logoDark}
                alt="Chumlab"
                width={160}
                height={160}
                style={{ width: 160, height: "auto", objectFit: "contain" }}
              />
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className={`p-1.5 rounded-lg transition-colors ${isDarkMode ? "text-gray-400 hover:bg-white/6" : "text-gray-600 hover:bg-gray-100"}`}
              aria-label="Close menu"
            >
              <CloseMenuIcon />
            </button>
          </div>
          <nav className="flex flex-col gap-0.5">
            {components.map(({ path, displayName }) => (
              <NavLink
                key={path}
                to={`/${path}`}
                className={({ isActive }) =>
                  `text-left px-3 py-2 rounded-lg text-[13px] lg:text-[15px] transition-all duration-200 ${isActive ? activeLink : inactiveLink}`
                }
              >
                {displayName}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* ── Desktop sidebar ── */}
        <aside
          className={`hidden lg:block w-[280px] xl:w-[300px] shrink-0 border-r p-5 overflow-y-auto
          [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
          ${sidebarBg} ${borderColor}`}
        >
          {sidebarContent}
        </aside>

        {/* ── Main content ── */}
        <main
          ref={mainRef}
          className={`flex-1 min-h-0 min-w-0 overflow-x-hidden overflow-y-auto overscroll-y-contain [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${bg}`}
        >
          {/* ── Top bar with theme toggle (desktop only — mobile has it in top bar) ── */}
          <div className="hidden lg:flex justify-end px-4 sm:px-6 lg:px-8 py-3">
            <ThemeToggle isDarkMode={isDarkMode} toggle={toggleDarkMode} />
          </div>

          <div className="p-4 sm:p-6 lg:p-8 pt-4 sm:pt-6 lg:pt-0 w-full max-w-none min-w-0 min-h-0">
            <Outlet context={{ isDarkMode, toggleDarkMode }} />
          </div>
        </main>
      </div>
    </ThemeContext.Provider>
  );
};

export default Demo;
