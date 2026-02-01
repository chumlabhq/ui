import { useState, useEffect, useRef } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Switch } from "../../components/Switch";
import { ThemeContext } from "./ThemeContext";

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
  { path: "modal", displayName: "Modal" },
  { path: "multi-select-dropdown", displayName: "Multi Select Dropdown" },
  {
    path: "multi-select-searchable-dropdown",
    displayName: "Multi Select Searchable Dropdown",
  },
  { path: "otp-input", displayName: "OTP Input" },
  { path: "pagination", displayName: "Pagination" },
  { path: "resizable-panel", displayName: "Resizable Panel" },
  { path: "searchable-dropdown", displayName: "Searchable Dropdown" },
  { path: "stepper", displayName: "Stepper" },
  { path: "switch", displayName: "Switch" },
  { path: "tab-panel", displayName: "Tab Panel" },
  { path: "table", displayName: "Table" },
  { path: "text-area", displayName: "Text Area" },
  { path: "time-picker", displayName: "Time Picker" },
  { path: "toast", displayName: "Toast" },
  { path: "tooltip", displayName: "Tooltip" },
];

const SunIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className={className}
  >
    <path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM10 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zM10 7a3 3 0 100 6 3 3 0 000-6zM15.657 5.404a.75.75 0 10-1.06-1.06l-1.061 1.06a.75.75 0 001.06 1.06l1.06-1.06zM6.464 14.596a.75.75 0 10-1.06-1.06l-1.06 1.06a.75.75 0 001.06 1.06l1.06-1.06zM18 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 0118 10zM5 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 015 10zM14.596 15.657a.75.75 0 001.06-1.06l-1.06-1.061a.75.75 0 10-1.06 1.06l1.06 1.06zM5.404 6.464a.75.75 0 001.06-1.06l-1.06-1.06a.75.75 0 10-1.06 1.06l1.06 1.06z" />
  </svg>
);

const MoonIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M7.455 2.004a.75.75 0 01.26.77 7 7 0 009.958 7.967.75.75 0 011.067.853A8.5 8.5 0 116.647 1.921a.75.75 0 01.808.083z"
      clipRule="evenodd"
    />
  </svg>
);

const Demo = () => {
  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const stored = localStorage.getItem("kern-ui-theme");
    if (stored) return stored === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("kern-ui-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("kern-ui-theme", "light");
    }
  }, [isDarkMode]);

  useEffect(() => {
    mainRef.current?.scrollTo(0, 0);
  }, [location.pathname]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      <div
        className={`h-screen flex overflow-hidden ${
          isDarkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <aside
          className={`w-64 border-r p-6 sticky top-0 h-screen overflow-y-auto z-40 
          [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
          ${
            isDarkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between mb-6">
            <h1
              className={`text-xl font-bold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Components
            </h1>
            <Switch
              isChecked={isDarkMode}
              handleToggle={toggleDarkMode}
              containerClassName="flex items-center"
              trackerClassName={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                isDarkMode
                  ? "bg-blue-600 focus-visible:ring-blue-500 focus-visible:ring-offset-gray-800"
                  : "bg-gray-200 focus-visible:ring-blue-500"
              }`}
              thumbClassName={`inline-flex h-4 w-4 transform items-center justify-center rounded-full transition-transform ${
                isDarkMode
                  ? "translate-x-6 bg-white"
                  : "translate-x-1 bg-white shadow-sm"
              }`}
              checkedIcon={<MoonIcon className="h-2.5 w-2.5 text-blue-600" />}
              uncheckedIcon={<SunIcon className="h-2.5 w-2.5 text-amber-500" />}
            />
          </div>

          <nav className="flex flex-col gap-1">
            {components.map(({ path, displayName }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `text-left px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? isDarkMode
                        ? "bg-blue-600/20 text-blue-400 font-medium"
                        : "bg-blue-100 text-blue-700 font-medium"
                      : isDarkMode
                        ? "text-gray-400 hover:bg-gray-700 hover:text-gray-200"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`
                }
              >
                {displayName}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main
          ref={mainRef}
          className={`flex-1 p-8 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]`}
        >
          <div className="max-w-4xl">
            <Outlet context={{ isDarkMode, toggleDarkMode }} />
          </div>
        </main>
      </div>
    </ThemeContext.Provider>
  );
};

export default Demo;
