import { useState, useEffect, useRef } from "react";
import { NavLink, Outlet, useLocation, Link } from "react-router-dom";
import { ThemeContext } from "./ThemeContext";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import logoDark from "../../assets/images/logo-dark.png";
import logoLight from "../../assets/images/logo-light.png";

interface ComponentItem {
  path: string;
  displayName: string;
}

const components: ComponentItem[] = [
  { path: "accordion", displayName: "Accordion" },
  { path: "avatar", displayName: "Avatar" },
  { path: "breadcrumb", displayName: "Breadcrumb" },
  { path: "button", displayName: "Button" },
  { path: "cascading-dropdown", displayName: "Cascading Dropdown" },
  { path: "checkbox", displayName: "Checkbox" },
  { path: "country-flag", displayName: "Country Flag" },
  { path: "date-picker", displayName: "Date Picker" },
  { path: "drawer", displayName: "Drawer" },
  { path: "dropdown", displayName: "Dropdown" },
  { path: "input", displayName: "Input" },
  {
    path: "international-phone-input",
    displayName: "International Phone Input",
  },
  { path: "loader", displayName: "Loader" },
  { path: "modal", displayName: "Modal" },
  { path: "multi-select-dropdown", displayName: "Multi Select Dropdown" },
  {
    path: "multi-select-searchable-dropdown",
    displayName: "Multi Select Searchable Dropdown",
  },
  { path: "otp-input", displayName: "OTP Input" },
  { path: "pagination", displayName: "Pagination" },
  { path: "radio-button", displayName: "Radio Button" },
  { path: "resizable-panel", displayName: "Resizable Panel" },
  { path: "searchable-dropdown", displayName: "Searchable Dropdown" },
  { path: "slider", displayName: "Slider" },
  { path: "stepper", displayName: "Stepper" },
  { path: "switch", displayName: "Switch" },
  { path: "tab-panel", displayName: "Tab Panel" },
  { path: "table", displayName: "Table" },
  { path: "text-area", displayName: "Text Area" },
  { path: "time-picker", displayName: "Time Picker" },
  { path: "toast", displayName: "Toast" },
  { path: "toggle", displayName: "Toggle" },
  { path: "tooltip", displayName: "Tooltip" },
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
    className={`relative h-8 w-8 rounded-lg cursor-pointer group transition-colors duration-200 ${
      isDarkMode
        ? "hover:bg-white/8 active:bg-white/12"
        : "hover:bg-black/5 active:bg-black/10"
    }`}
  >
    {/* Sun – visible in dark mode */}
    <svg
      width="18"
      height="18"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={`absolute inset-0 m-auto transition-all duration-500 ease-out ${
        isDarkMode
          ? "opacity-100 rotate-0 scale-100 text-amber-400 group-hover:text-amber-300 group-hover:scale-110"
          : "opacity-0 rotate-180 scale-0"
      }`}
    >
      <path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM10 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zM10 7a3 3 0 100 6 3 3 0 000-6zM15.657 5.404a.75.75 0 10-1.06-1.06l-1.061 1.06a.75.75 0 001.06 1.06l1.06-1.06zM6.464 14.596a.75.75 0 10-1.06-1.06l-1.06 1.06a.75.75 0 001.06 1.06l1.06-1.06zM18 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 0118 10zM5 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 015 10zM14.596 15.657a.75.75 0 001.06-1.06l-1.06-1.061a.75.75 0 10-1.06 1.06l1.06 1.06zM5.404 6.464a.75.75 0 001.06-1.06l-1.06-1.06a.75.75 0 10-1.06 1.06l1.06 1.06z" />
    </svg>
    {/* Moon – visible in light mode */}
    <svg
      width="18"
      height="18"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={`absolute inset-0 m-auto transition-all duration-500 ease-out ${
        isDarkMode
          ? "opacity-0 -rotate-180 scale-0"
          : "opacity-100 rotate-0 scale-100 text-slate-500 group-hover:text-indigo-500 group-hover:scale-110"
      }`}
    >
      <path
        fillRule="evenodd"
        d="M7.455 2.004a.75.75 0 01.26.77 7 7 0 009.958 7.967.75.75 0 011.067.853A8.5 8.5 0 116.647 1.921a.75.75 0 01.808.083z"
        clipRule="evenodd"
      />
    </svg>
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
  useDocumentTitle(activeComponent ? `${activeComponent.displayName} Component` : "Components");
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
              height={36}
              style={{ height: 36, width: "auto", objectFit: "contain" }}
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
              height={32}
              style={{ height: 32, width: "auto", objectFit: "contain" }}
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
          className={`lg:hidden fixed top-0 right-0 z-50 h-full w-[280px] p-5 overflow-y-auto transition-transform duration-300 ease-out
          [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
          ${sidebarOpen ? "translate-x-0" : "translate-x-full"}
          ${sidebarBg}`}
        >
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setSidebarOpen(false)}
              className={`p-1.5 rounded-lg transition-colors ${isDarkMode ? "text-gray-400 hover:bg-white/6" : "text-gray-600 hover:bg-gray-100"}`}
              aria-label="Close menu"
            >
              <CloseMenuIcon />
            </button>
          </div>
          {sidebarContent}
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
          {/* ── Top bar with theme toggle ── */}
          <div className="sticky top-0 z-10 flex justify-end px-4 sm:px-6 lg:px-8 py-3">
            <ThemeToggle isDarkMode={isDarkMode} toggle={toggleDarkMode} />
          </div>

          <div className="p-4 sm:p-6 lg:p-8 pt-0 w-full max-w-none min-w-0 min-h-0">
            <Outlet context={{ isDarkMode, toggleDarkMode }} />
          </div>
        </main>
      </div>
    </ThemeContext.Provider>
  );
};

export default Demo;
