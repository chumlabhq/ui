import { NavLink, Outlet } from "react-router-dom";

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

const Demo = () => {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-fit bg-white border-r border-gray-200 p-6 sticky top-0 h-screen overflow-y-auto z-40 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <h1 className="text-xl font-bold text-gray-900 mb-6">Components</h1>
        <nav className="flex flex-col gap-1">
          {components.map(({ path, displayName }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `text-left px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-100 text-blue-700 font-medium"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`
              }
            >
              {displayName}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="max-w-4xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Demo;
