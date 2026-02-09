import { useCallback, useState } from "react";
import { Breadcrumb } from "../../components/Breadcrumb";
import type { BreadcrumbItem } from "../../components/Breadcrumb";
import { useTheme } from "./ThemeContext";
import { Section, CodeBlock, DemoWrapper } from "./components";

const HomeIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
  </svg>
);

const FolderIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
  </svg>
);

const DocumentIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path
      fillRule="evenodd"
      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
      clipRule="evenodd"
    />
  </svg>
);

const SlashIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path
      fillRule="evenodd"
      d="M12.293 3.293a1 1 0 011.414 0l.094.094-6.094 13.32-.094-.094a1 1 0 010-1.414l4.68-10.32-1.414-1.586z"
      clipRule="evenodd"
    />
  </svg>
);

const ArrowIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path
      fillRule="evenodd"
      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
);

const basicItems: BreadcrumbItem[] = [
  { id: "home", label: "Home" },
  { id: "products", label: "Products" },
  { id: "electronics", label: "Electronics" },
  { id: "phones", label: "Phones" },
];

const longItems: BreadcrumbItem[] = [
  { id: "home", label: "Home" },
  { id: "documentation", label: "Documentation" },
  { id: "themes", label: "Themes" },
  { id: "github", label: "GitHub" },
  { id: "components", label: "Components" },
  { id: "breadcrumb", label: "Breadcrumb" },
];

const itemsWithIcons: BreadcrumbItem[] = [
  {
    id: "home",
    label: "Home",
    icon: <HomeIcon className="w-4 h-4" />,
    iconPosition: "left",
  },
  {
    id: "documents",
    label: "Documents",
    icon: <FolderIcon className="w-4 h-4" />,
    iconPosition: "left",
  },
  {
    id: "reports",
    label: "Reports",
    icon: <FolderIcon className="w-4 h-4" />,
    iconPosition: "left",
  },
  {
    id: "annual-report",
    label: "Annual Report",
    icon: <DocumentIcon className="w-4 h-4" />,
    iconPosition: "right",
  },
];

const itemsWithLinks: BreadcrumbItem[] = [
  { id: "home", label: "Home", href: "/" },
  { id: "blog", label: "Blog", href: "/blog" },
  { id: "category", label: "Technology", href: "/blog/technology" },
  { id: "post", label: "Building Breadcrumb Components" },
];

const itemsWithTooltips: BreadcrumbItem[] = [
  {
    id: "home",
    label: "Home",
    tooltip: "Go to homepage",
    icon: <HomeIcon className="w-4 h-4" />,
    iconPosition: "left",
  },
  {
    id: "documents",
    label: "Documents",
    tooltip: "View all documents",
    icon: <FolderIcon className="w-4 h-4" />,
    iconPosition: "left",
  },
  {
    id: "reports",
    label: "Reports",
    tooltip: "Quarterly and annual reports",
    icon: <FolderIcon className="w-4 h-4" />,
    iconPosition: "left",
  },
  {
    id: "current",
    label: "Q4 2025 Report",
    tooltip: "You are currently viewing this document",
    tooltipProps: { side: "bottom" },
    icon: <DocumentIcon className="w-4 h-4" />,
    iconPosition: "right",
  },
];

const itemsWithDisabled: BreadcrumbItem[] = [
  { id: "home", label: "Home" },
  { id: "archived", label: "Archived", disabled: true },
  { id: "products", label: "Products" },
  { id: "phones", label: "Phones" },
];

const getStyles = (isDarkMode: boolean) => ({
  default: {
    list: "flex items-center gap-1",
    item: `flex items-center gap-1 px-2 py-1 text-sm transition-colors duration-200 cursor-pointer bg-transparent border-none ${isDarkMode ? "text-gray-400 hover:text-gray-200 hover:bg-gray-800" : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"} rounded`,
    itemActive: `flex items-center gap-1 px-2 py-1 text-sm font-medium bg-transparent border-none cursor-default ${isDarkMode ? "text-white" : "text-gray-900"}`,
    itemDisabled: isDarkMode
      ? "opacity-40 cursor-not-allowed hover:bg-transparent hover:text-gray-400"
      : "opacity-40 cursor-not-allowed hover:bg-transparent hover:text-gray-500",
    separator: isDarkMode ? "text-gray-600" : "text-gray-400",
    icon: "shrink-0",
    link: `flex items-center gap-1 px-2 py-1 text-sm rounded transition-colors ${isDarkMode ? "text-blue-400 hover:text-blue-300 hover:underline" : "text-blue-600 hover:text-blue-800 hover:underline"}`,
    ellipsisButton: `flex items-center justify-center w-8 h-8 rounded-md transition-colors cursor-pointer ${isDarkMode ? "bg-gray-800 hover:bg-gray-700 text-gray-400" : "bg-gray-100 hover:bg-gray-200 text-gray-600"}`,
    dropdown: `min-w-40 rounded-lg shadow-lg py-1 ${isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"}`,
    dropdownItem: `flex items-center gap-2 px-3 py-2 text-sm cursor-pointer w-full text-left bg-transparent border-none ${isDarkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-50"}`,
    dropdownItemDisabled: isDarkMode
      ? "opacity-50 cursor-not-allowed"
      : "opacity-50 cursor-not-allowed",
  },
  pill: {
    list: "flex items-center gap-2",
    item: `flex items-center gap-1 px-4 py-2 text-sm rounded-full transition-all border cursor-pointer bg-transparent ${isDarkMode ? "text-gray-400 hover:text-gray-200 bg-gray-800 hover:bg-gray-700 border-gray-700 hover:border-gray-600" : "text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300 hover:shadow-sm"}`,
    itemActive: `flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-full border-none cursor-default shadow-md ${isDarkMode ? "text-white bg-gradient-to-r from-indigo-600 to-purple-600" : "text-white bg-gradient-to-r from-indigo-500 to-purple-500"}`,
    separator: isDarkMode ? "text-gray-600" : "text-gray-300",
    ellipsisButton: `flex items-center justify-center w-10 h-10 rounded-full border transition-all cursor-pointer ${isDarkMode ? "bg-gray-800 hover:bg-gray-700 text-gray-400 border-gray-700" : "bg-white hover:bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-300 hover:shadow-sm"}`,
    dropdown: `min-w-40 rounded-xl shadow-lg py-2 ${isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"}`,
    dropdownItem: `flex items-center gap-2 px-4 py-2 text-sm cursor-pointer w-full text-left bg-transparent border-none ${isDarkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-50"}`,
  },
  colored: {
    root: `p-4 rounded-lg ${isDarkMode ? "bg-blue-950" : "bg-blue-50"}`,
    list: "flex items-center gap-1",
    item: `flex items-center gap-1 px-3 py-1.5 text-sm rounded-full transition-colors cursor-pointer bg-transparent border-none ${isDarkMode ? "text-blue-300 hover:text-blue-200 hover:bg-blue-900" : "text-blue-600 hover:text-blue-800 hover:bg-blue-100"}`,
    itemActive: `flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-full border-none cursor-default ${isDarkMode ? "text-white bg-blue-600" : "text-white bg-blue-600"}`,
    separator: isDarkMode ? "text-blue-700" : "text-blue-300",
    ellipsisButton: `flex items-center justify-center w-8 h-8 rounded-full transition-colors cursor-pointer ${isDarkMode ? "bg-blue-900 hover:bg-blue-800 text-blue-300" : "bg-blue-100 hover:bg-blue-200 text-blue-600"}`,
    dropdown: `min-w-40 rounded-lg shadow-lg py-1 ${isDarkMode ? "bg-gray-800 border border-blue-800" : "bg-white border border-blue-200"}`,
    dropdownItem: `flex items-center gap-2 px-3 py-2 text-sm cursor-pointer w-full text-left bg-transparent border-none ${isDarkMode ? "text-blue-300 hover:bg-blue-900" : "text-blue-700 hover:bg-blue-50"}`,
  },
  gradient: {
    root: `p-4 rounded-lg ${isDarkMode ? "bg-gradient-to-r from-purple-950 via-pink-950 to-red-950" : "bg-gradient-to-r from-purple-500 via-pink-500 to-red-500"}`,
    list: "flex items-center gap-1",
    item: `flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg transition-colors cursor-pointer bg-transparent border-none ${isDarkMode ? "text-gray-300 hover:text-white hover:bg-white/10" : "text-white/80 hover:text-white hover:bg-white/10"}`,
    itemActive: `flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-lg border-none cursor-default ${isDarkMode ? "text-purple-200 bg-gray-800" : "text-purple-900 bg-white"}`,
    separator: isDarkMode ? "text-gray-600" : "text-white/50",
    ellipsisButton: `flex items-center justify-center w-8 h-8 rounded-lg transition-colors cursor-pointer ${isDarkMode ? "bg-white/10 hover:bg-white/20 text-gray-300" : "bg-white/20 hover:bg-white/30 text-white"}`,
    dropdown: `min-w-40 rounded-lg shadow-lg py-1 ${isDarkMode ? "bg-gray-800 border border-purple-800" : "bg-white border border-purple-200"}`,
    dropdownItem: `flex items-center gap-2 px-3 py-2 text-sm cursor-pointer w-full text-left bg-transparent border-none ${isDarkMode ? "text-gray-300 hover:bg-gray-700" : "text-purple-700 hover:bg-purple-50"}`,
  },
  green: {
    root: `p-4 rounded-lg ${isDarkMode ? "bg-gradient-to-r from-emerald-950 to-cyan-950" : "bg-gradient-to-r from-emerald-400 to-cyan-400"}`,
    list: "flex items-center gap-2",
    item: `flex items-center gap-1 px-3 py-1.5 text-sm rounded-md transition-colors cursor-pointer bg-transparent border-none ${isDarkMode ? "text-emerald-300/70 hover:text-emerald-200 hover:bg-white/10" : "text-emerald-900/70 hover:text-emerald-900 hover:bg-white/30"}`,
    itemActive: `flex items-center gap-1 px-3 py-1.5 text-sm font-semibold rounded-md border-none cursor-default shadow-sm ${isDarkMode ? "text-emerald-200 bg-gray-800/80" : "text-emerald-900 bg-white/80"}`,
    separator: isDarkMode ? "text-emerald-700" : "text-emerald-900/40",
    ellipsisButton: `flex items-center justify-center w-8 h-8 rounded-md transition-colors cursor-pointer ${isDarkMode ? "bg-white/10 hover:bg-white/20 text-emerald-300" : "bg-white/30 hover:bg-white/50 text-emerald-900"}`,
    dropdown: `min-w-40 rounded-lg shadow-lg py-1 ${isDarkMode ? "bg-gray-800 border border-emerald-800" : "bg-white border border-emerald-200"}`,
    dropdownItem: `flex items-center gap-2 px-3 py-2 text-sm cursor-pointer w-full text-left bg-transparent border-none ${isDarkMode ? "text-emerald-300 hover:bg-emerald-900" : "text-emerald-700 hover:bg-emerald-50"}`,
  },
  content: isDarkMode ? "text-gray-300" : "text-gray-700",
  contentStrong: isDarkMode ? "text-white" : "text-gray-900",
});

const BreadcrumbDemo = () => {
  const { isDarkMode } = useTheme();
  const [clickedItem, setClickedItem] = useState<string | null>(null);
  const s = getStyles(isDarkMode);

  const handleItemClick = useCallback((item: BreadcrumbItem) => {
    setClickedItem(item.label);
    setTimeout(() => setClickedItem(null), 2000);
  }, []);

  return (
    <div className="space-y-16">
      <header>
        <h1
          className={`text-3xl font-bold mb-3 ${isDarkMode ? "text-white" : "text-gray-900"}`}
        >
          Breadcrumb
        </h1>
        <p
          className={`text-lg ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
        >
          A navigation component that shows the user&apos;s current location in
          a hierarchical structure. Supports truncation with an accessible
          ellipsis dropdown, icons, tooltips, links, disabled items, custom
          separators, and full keyboard navigation within the dropdown menu.
        </p>

        <div className="mt-6">
          <h3
            className={`text-sm font-semibold mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
          >
            Installation
          </h3>
          <CodeBlock
            isDarkMode={isDarkMode}
            code={`import { Breadcrumb } from "@kern-ui/breadcrumb";`}
          />
        </div>
      </header>

      <div className="space-y-12">
        <h2
          className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}
        >
          Examples
        </h2>

        <Section
          title="Basic Usage"
          description="Standard breadcrumb trail with default chevron separators."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Breadcrumb
              items={basicItems}
              classes={{
                list: s.default.list,
                item: s.default.item,
                itemActive: s.default.itemActive,
                separator: s.default.separator,
              }}
              onItemClick={handleItemClick}
            />
          </DemoWrapper>
          {clickedItem && (
            <p
              className={`text-sm mt-2 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}
            >
              Clicked: {clickedItem}
            </p>
          )}
        </Section>

        <Section
          title="With Truncation (maxVisibleItems=3)"
          description="When items exceed maxVisibleItems, middle items collapse into an accessible dropdown with full keyboard navigation."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Breadcrumb
              items={longItems}
              maxVisibleItems={3}
              classes={{
                list: s.default.list,
                item: s.default.item,
                itemActive: s.default.itemActive,
                separator: s.default.separator,
                ellipsisButton: s.default.ellipsisButton,
                dropdown: s.default.dropdown,
                dropdownItem: s.default.dropdownItem,
              }}
              onItemClick={handleItemClick}
            />
          </DemoWrapper>
          <div
            className={`mt-3 p-3 rounded-lg text-sm ${isDarkMode ? "bg-blue-900/30 border border-blue-800 text-blue-200" : "bg-blue-50 text-blue-800"}`}
          >
            Click the ellipsis button or press{" "}
            <kbd
              className={`px-1.5 py-0.5 rounded border text-xs font-mono ${isDarkMode ? "bg-gray-800 border-gray-600 text-gray-300" : "bg-white border-blue-200 text-blue-800"}`}
            >
              Enter
            </kbd>{" "}
            /{" "}
            <kbd
              className={`px-1.5 py-0.5 rounded border text-xs font-mono ${isDarkMode ? "bg-gray-800 border-gray-600 text-gray-300" : "bg-white border-blue-200 text-blue-800"}`}
            >
              Space
            </kbd>{" "}
            to open, then use{" "}
            <kbd
              className={`px-1.5 py-0.5 rounded border text-xs font-mono ${isDarkMode ? "bg-gray-800 border-gray-600 text-gray-300" : "bg-white border-blue-200 text-blue-800"}`}
            >
              &darr;
            </kbd>{" "}
            <kbd
              className={`px-1.5 py-0.5 rounded border text-xs font-mono ${isDarkMode ? "bg-gray-800 border-gray-600 text-gray-300" : "bg-white border-blue-200 text-blue-800"}`}
            >
              &uarr;
            </kbd>{" "}
            to navigate items.
          </div>
        </Section>

        <Section
          title="With Truncation (maxVisibleItems=4)"
          description="Shows first item, ellipsis, and last 3 items."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Breadcrumb
              items={longItems}
              maxVisibleItems={4}
              classes={{
                list: s.default.list,
                item: s.default.item,
                itemActive: s.default.itemActive,
                separator: s.default.separator,
                ellipsisButton: s.default.ellipsisButton,
                dropdown: s.default.dropdown,
                dropdownItem: s.default.dropdownItem,
              }}
              onItemClick={handleItemClick}
            />
          </DemoWrapper>
        </Section>

        <Section
          title="With Icons"
          description="Items can have icons positioned left or right via the iconPosition property on each item."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Breadcrumb
              items={itemsWithIcons}
              classes={{
                list: s.default.list,
                item: s.default.item,
                itemActive: s.default.itemActive,
                separator: s.default.separator,
                icon: s.default.icon,
              }}
              onItemClick={handleItemClick}
            />
          </DemoWrapper>
        </Section>

        <Section
          title="With Icons and Truncation"
          description="Icons are preserved in both visible items and the collapsed dropdown."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Breadcrumb
              items={[
                {
                  id: "home",
                  label: "Home",
                  icon: <HomeIcon className="w-4 h-4" />,
                  iconPosition: "left",
                },
                {
                  id: "level1",
                  label: "Level 1",
                  icon: <FolderIcon className="w-4 h-4" />,
                  iconPosition: "left",
                },
                {
                  id: "level2",
                  label: "Level 2",
                  icon: <FolderIcon className="w-4 h-4" />,
                  iconPosition: "left",
                },
                {
                  id: "level3",
                  label: "Level 3",
                  icon: <FolderIcon className="w-4 h-4" />,
                  iconPosition: "left",
                },
                {
                  id: "level4",
                  label: "Level 4",
                  icon: <FolderIcon className="w-4 h-4" />,
                  iconPosition: "left",
                },
                {
                  id: "current",
                  label: "Current Page",
                  icon: <DocumentIcon className="w-4 h-4" />,
                  iconPosition: "right",
                },
              ]}
              maxVisibleItems={3}
              classes={{
                list: s.default.list,
                item: s.default.item,
                itemActive: s.default.itemActive,
                separator: s.default.separator,
                icon: s.default.icon,
                ellipsisButton: s.default.ellipsisButton,
                dropdown: s.default.dropdown,
                dropdownItem: s.default.dropdownItem,
              }}
              onItemClick={handleItemClick}
            />
          </DemoWrapper>
        </Section>

        <Section
          title="Custom Content"
          description="Use the content property on BreadcrumbItem to render custom ReactNode content instead of the plain label text."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Breadcrumb
              items={[
                { id: "home", label: "Home" },
                {
                  id: "status",
                  label: "Status",
                  content: (
                    <span className="flex items-center gap-1.5">
                      Status
                      <span
                        className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium ${isDarkMode ? "bg-green-900 text-green-300" : "bg-green-100 text-green-700"}`}
                      >
                        Active
                      </span>
                    </span>
                  ),
                },
                {
                  id: "details",
                  label: "Details",
                  content: (
                    <span className="flex items-center gap-1.5">
                      Details
                      <span
                        className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium ${isDarkMode ? "bg-blue-900 text-blue-300" : "bg-blue-100 text-blue-700"}`}
                      >
                        New
                      </span>
                    </span>
                  ),
                },
                { id: "current", label: "Overview" },
              ]}
              classes={{
                list: s.default.list,
                item: s.default.item,
                itemActive: s.default.itemActive,
                separator: s.default.separator,
              }}
              onItemClick={handleItemClick}
            />
          </DemoWrapper>
        </Section>

        <Section
          title="With Links"
          description="Items with an href property render as anchor elements. When an onClick or onItemClick handler is also present, navigation is prevented and the handler is called instead."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Breadcrumb
              items={itemsWithLinks}
              classes={{
                list: s.default.list,
                item: s.default.item,
                itemActive: s.default.itemActive,
                separator: s.default.separator,
                link: s.default.link,
              }}
              onItemClick={handleItemClick}
            />
          </DemoWrapper>
        </Section>

        <Section
          title="Per-Item Click Handlers"
          description="Individual items can define their own onClick handler in addition to the global onItemClick. Both fire when the item is clicked."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Breadcrumb
              items={[
                {
                  id: "home",
                  label: "Home",
                  onClick: () => setClickedItem("Home (item.onClick)"),
                },
                {
                  id: "products",
                  label: "Products",
                  onClick: () => setClickedItem("Products (item.onClick)"),
                },
                { id: "electronics", label: "Electronics" },
                { id: "phones", label: "Phones" },
              ]}
              classes={{
                list: s.default.list,
                item: s.default.item,
                itemActive: s.default.itemActive,
                separator: s.default.separator,
              }}
              onItemClick={handleItemClick}
            />
          </DemoWrapper>
          {clickedItem && (
            <p
              className={`text-sm mt-2 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}
            >
              Clicked: {clickedItem}
            </p>
          )}
        </Section>

        <Section
          title="With Tooltips"
          description="Hover over breadcrumb items to see tooltips. Tooltip position and behavior are configurable globally and per-item."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Breadcrumb
              items={itemsWithTooltips}
              showTooltips={true}
              tooltipPosition="bottom"
              tooltipOffset={4}
              classes={{
                list: s.default.list,
                item: s.default.item,
                itemActive: s.default.itemActive,
                separator: s.default.separator,
                icon: s.default.icon,
              }}
              onItemClick={handleItemClick}
            />
          </DemoWrapper>
        </Section>

        <Section
          title="Ellipsis with Tooltip"
          description="The ellipsis button can have its own tooltip to indicate available actions."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Breadcrumb
              items={longItems}
              maxVisibleItems={3}
              showTooltips={true}
              ellipsisTooltip="Show hidden items"
              ellipsisTooltipProps={{ side: "top", delayDuration: 200 }}
              classes={{
                list: s.default.list,
                item: s.default.item,
                itemActive: s.default.itemActive,
                separator: s.default.separator,
                ellipsisButton: s.default.ellipsisButton,
                dropdown: s.default.dropdown,
                dropdownItem: s.default.dropdownItem,
              }}
              onItemClick={handleItemClick}
            />
          </DemoWrapper>
        </Section>

        <Section
          title="Disabled Items"
          description="Individual items can be disabled. Disabled items are not interactive, skipped in dropdown keyboard navigation, and receive aria-disabled."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Breadcrumb
              items={itemsWithDisabled}
              classes={{
                list: s.default.list,
                item: s.default.item,
                itemActive: s.default.itemActive,
                itemDisabled: s.default.itemDisabled,
                separator: s.default.separator,
              }}
              onItemClick={handleItemClick}
            />
          </DemoWrapper>
        </Section>

        <Section
          title="Disabled Items in Dropdown"
          description="When truncated, disabled items appear in the collapsed dropdown but are non-interactive, visually dimmed, and skipped during keyboard navigation. Style them with classes.dropdownItemDisabled."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Breadcrumb
              items={[
                { id: "home", label: "Home" },
                {
                  id: "archived",
                  label: "Archived Section",
                  disabled: true,
                },
                { id: "legacy", label: "Legacy Docs", disabled: true },
                { id: "guides", label: "Guides" },
                { id: "components", label: "Components" },
                { id: "breadcrumb", label: "Breadcrumb" },
              ]}
              maxVisibleItems={3}
              classes={{
                list: s.default.list,
                item: s.default.item,
                itemActive: s.default.itemActive,
                separator: s.default.separator,
                ellipsis: "relative",
                ellipsisButton: s.default.ellipsisButton,
                dropdown: s.default.dropdown,
                dropdownItem: s.default.dropdownItem,
                dropdownItemDisabled: s.default.dropdownItemDisabled,
              }}
              onItemClick={handleItemClick}
            />
          </DemoWrapper>
        </Section>

        <Section
          title="Dropdown Position & Z-Index"
          description="Control the ellipsis dropdown placement relative to the trigger button. Supports top, bottom, left, and right positions. The dropdown renders via a portal so it is never clipped by overflow containers."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode} layout="flex-col">
            <div className="w-full space-y-8">
              <div>
                <p
                  className={`text-xs font-medium mb-2 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
                >
                  dropdownPosition=&quot;top&quot; (default)
                </p>
                <Breadcrumb
                  items={longItems}
                  maxVisibleItems={3}
                  dropdownPosition="top"
                  classes={{
                    list: s.default.list,
                    item: s.default.item,
                    itemActive: s.default.itemActive,
                    separator: s.default.separator,
                    ellipsisButton: s.default.ellipsisButton,
                    dropdown: s.default.dropdown,
                    dropdownItem: s.default.dropdownItem,
                  }}
                  onItemClick={handleItemClick}
                />
              </div>
              <div>
                <p
                  className={`text-xs font-medium mb-2 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
                >
                  dropdownPosition=&quot;bottom&quot;
                </p>
                <Breadcrumb
                  items={longItems}
                  maxVisibleItems={3}
                  dropdownPosition="bottom"
                  classes={{
                    list: s.default.list,
                    item: s.default.item,
                    itemActive: s.default.itemActive,
                    separator: s.default.separator,
                    ellipsisButton: s.default.ellipsisButton,
                    dropdown: s.default.dropdown,
                    dropdownItem: s.default.dropdownItem,
                  }}
                  onItemClick={handleItemClick}
                />
              </div>
              <div>
                <p
                  className={`text-xs font-medium mb-2 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
                >
                  dropdownPosition=&quot;left&quot;
                </p>
                <Breadcrumb
                  items={longItems}
                  maxVisibleItems={3}
                  dropdownPosition="left"
                  classes={{
                    list: s.default.list,
                    item: s.default.item,
                    itemActive: s.default.itemActive,
                    separator: s.default.separator,
                    ellipsisButton: s.default.ellipsisButton,
                    dropdown: s.default.dropdown,
                    dropdownItem: s.default.dropdownItem,
                  }}
                  onItemClick={handleItemClick}
                />
              </div>
              <div>
                <p
                  className={`text-xs font-medium mb-2 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
                >
                  dropdownPosition=&quot;right&quot;
                </p>
                <Breadcrumb
                  items={longItems}
                  maxVisibleItems={3}
                  dropdownPosition="right"
                  classes={{
                    list: s.default.list,
                    item: s.default.item,
                    itemActive: s.default.itemActive,
                    separator: s.default.separator,
                    ellipsisButton: s.default.ellipsisButton,
                    dropdown: s.default.dropdown,
                    dropdownItem: s.default.dropdownItem,
                  }}
                  onItemClick={handleItemClick}
                />
              </div>
              <div>
                <p
                  className={`text-xs font-medium mb-2 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
                >
                  dropdownPosition=&quot;right&quot; +
                  dropdownZIndex=&#123;100&#125;
                </p>
                <Breadcrumb
                  items={longItems}
                  maxVisibleItems={3}
                  dropdownPosition="right"
                  dropdownZIndex={100}
                  classes={{
                    list: s.default.list,
                    item: s.default.item,
                    itemActive: s.default.itemActive,
                    separator: s.default.separator,
                    ellipsisButton: s.default.ellipsisButton,
                    dropdown: s.default.dropdown,
                    dropdownItem: s.default.dropdownItem,
                  }}
                  onItemClick={handleItemClick}
                />
              </div>
              <div>
                <p
                  className={`text-xs font-medium mb-2 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
                >
                  dropdownPosition=&quot;left&quot; +
                  dropdownZIndex=&#123;999&#125; (high z-index for layered UIs)
                </p>
                <Breadcrumb
                  items={longItems}
                  maxVisibleItems={3}
                  dropdownPosition="left"
                  dropdownZIndex={999}
                  classes={{
                    list: s.default.list,
                    item: s.default.item,
                    itemActive: s.default.itemActive,
                    separator: s.default.separator,
                    ellipsisButton: s.default.ellipsisButton,
                    dropdown: s.default.dropdown,
                    dropdownItem: s.default.dropdownItem,
                  }}
                  onItemClick={handleItemClick}
                />
              </div>
            </div>
          </DemoWrapper>
          <div
            className={`mt-3 p-3 rounded-lg text-sm ${isDarkMode ? "bg-blue-900/30 border border-blue-800 text-blue-200" : "bg-blue-50 text-blue-800"}`}
          >
            <p>
              <strong>Note:</strong> The dropdown is rendered via a{" "}
              <code
                className={`px-1 rounded text-xs font-mono ${isDarkMode ? "bg-gray-800 text-gray-300" : "bg-white text-blue-800"}`}
              >
                React Portal
              </code>{" "}
              into{" "}
              <code
                className={`px-1 rounded text-xs font-mono ${isDarkMode ? "bg-gray-800 text-gray-300" : "bg-white text-blue-800"}`}
              >
                document.body
              </code>
              , so it is never clipped by{" "}
              <code
                className={`px-1 rounded text-xs font-mono ${isDarkMode ? "bg-gray-800 text-gray-300" : "bg-white text-blue-800"}`}
              >
                overflow: hidden
              </code>{" "}
              ancestors. The component handles positioning (
              <code
                className={`px-1 rounded text-xs font-mono ${isDarkMode ? "bg-gray-800 text-gray-300" : "bg-white text-blue-800"}`}
              >
                top / bottom / left / right
              </code>
              ) and{" "}
              <code
                className={`px-1 rounded text-xs font-mono ${isDarkMode ? "bg-gray-800 text-gray-300" : "bg-white text-blue-800"}`}
              >
                z-index
              </code>{" "}
              via inline styles, so you do NOT need to add positioning or
              z-index classes to{" "}
              <code
                className={`px-1 rounded text-xs font-mono ${isDarkMode ? "bg-gray-800 text-gray-300" : "bg-white text-blue-800"}`}
              >
                classes.dropdown
              </code>
              . Only add visual styles (bg, border, shadow, rounded, etc.).
            </p>
          </div>
        </Section>

        <Section
          title="Custom Separator (Slash)"
          description="Replace the default chevron separator with any ReactNode."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Breadcrumb
              items={basicItems}
              separator={
                <span
                  className={isDarkMode ? "text-gray-600" : "text-gray-400"}
                >
                  /
                </span>
              }
              classes={{
                list: s.default.list,
                item: s.default.item,
                itemActive: s.default.itemActive,
                separator: s.default.separator,
              }}
              onItemClick={handleItemClick}
            />
          </DemoWrapper>
        </Section>

        <Section
          title="Custom Separator Icon"
          description="Use the SeparatorIcon prop to provide a custom icon component."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode} layout="flex-col">
            <div className="w-full space-y-4">
              <div>
                <p
                  className={`text-xs mb-2 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
                >
                  Arrow separator:
                </p>
                <Breadcrumb
                  items={basicItems}
                  SeparatorIcon={ArrowIcon}
                  classes={{
                    list: s.default.list,
                    item: s.default.item,
                    itemActive: s.default.itemActive,
                    separator: s.default.separator,
                  }}
                  onItemClick={handleItemClick}
                />
              </div>
              <div>
                <p
                  className={`text-xs mb-2 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
                >
                  Slash separator:
                </p>
                <Breadcrumb
                  items={basicItems}
                  SeparatorIcon={SlashIcon}
                  classes={{
                    list: s.default.list,
                    item: s.default.item,
                    itemActive: s.default.itemActive,
                    separator: s.default.separator,
                  }}
                  onItemClick={handleItemClick}
                />
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Custom Icon Size"
          description="The iconSize prop controls the size of separator and ellipsis icons."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode} layout="flex-col">
            <div className="w-full space-y-6">
              <div>
                <p
                  className={`text-xs font-medium mb-2 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
                >
                  Small (12px)
                </p>
                <Breadcrumb
                  items={longItems}
                  maxVisibleItems={3}
                  iconSize={12}
                  classes={{
                    list: s.default.list,
                    item: s.default.item,
                    itemActive: s.default.itemActive,
                    separator: s.default.separator,
                    ellipsisButton: `flex items-center justify-center w-6 h-6 rounded transition-colors cursor-pointer ${isDarkMode ? "bg-gray-800 hover:bg-gray-700 text-gray-400" : "bg-gray-100 hover:bg-gray-200 text-gray-600"}`,
                    dropdown: s.default.dropdown,
                    dropdownItem: s.default.dropdownItem,
                  }}
                  onItemClick={handleItemClick}
                />
              </div>
              <div>
                <p
                  className={`text-xs font-medium mb-2 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
                >
                  Default (16px)
                </p>
                <Breadcrumb
                  items={longItems}
                  maxVisibleItems={3}
                  classes={{
                    list: s.default.list,
                    item: s.default.item,
                    itemActive: s.default.itemActive,
                    separator: s.default.separator,
                    ellipsisButton: s.default.ellipsisButton,
                    dropdown: s.default.dropdown,
                    dropdownItem: s.default.dropdownItem,
                  }}
                  onItemClick={handleItemClick}
                />
              </div>
              <div>
                <p
                  className={`text-xs font-medium mb-2 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
                >
                  Large (20px)
                </p>
                <Breadcrumb
                  items={longItems}
                  maxVisibleItems={3}
                  iconSize={20}
                  classes={{
                    list: s.default.list,
                    item: s.default.item,
                    itemActive: s.default.itemActive,
                    separator: s.default.separator,
                    ellipsisButton: `flex items-center justify-center w-10 h-10 rounded-lg transition-colors cursor-pointer ${isDarkMode ? "bg-gray-800 hover:bg-gray-700 text-gray-400" : "bg-gray-100 hover:bg-gray-200 text-gray-600"}`,
                    dropdown: s.default.dropdown,
                    dropdownItem: s.default.dropdownItem,
                  }}
                  onItemClick={handleItemClick}
                />
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Custom Ellipsis Icon"
          description="Replace the default ellipsis icon with any custom icon component via the EllipsisIcon prop."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode} layout="flex-col">
            <div className="w-full space-y-6">
              <div>
                <p
                  className={`text-xs font-medium mb-2 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
                >
                  Vertical dots
                </p>
                <Breadcrumb
                  items={longItems}
                  maxVisibleItems={3}
                  EllipsisIcon={({ className }) => (
                    <svg
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className={className}
                    >
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  )}
                  classes={{
                    list: s.default.list,
                    item: s.default.item,
                    itemActive: s.default.itemActive,
                    separator: s.default.separator,
                    ellipsisButton: s.default.ellipsisButton,
                    dropdown: s.default.dropdown,
                    dropdownItem: s.default.dropdownItem,
                  }}
                  onItemClick={handleItemClick}
                />
              </div>
              <div>
                <p
                  className={`text-xs font-medium mb-2 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
                >
                  Chevron down
                </p>
                <Breadcrumb
                  items={longItems}
                  maxVisibleItems={3}
                  EllipsisIcon={({ className }) => (
                    <svg
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className={className}
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  classes={{
                    list: s.default.list,
                    item: s.default.item,
                    itemActive: s.default.itemActive,
                    separator: s.default.separator,
                    ellipsisButton: s.default.ellipsisButton,
                    dropdown: s.default.dropdown,
                    dropdownItem: s.default.dropdownItem,
                  }}
                  onItemClick={handleItemClick}
                />
              </div>
              <div>
                <p
                  className={`text-xs font-medium mb-2 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
                >
                  Plus icon
                </p>
                <Breadcrumb
                  items={longItems}
                  maxVisibleItems={3}
                  EllipsisIcon={({ className }) => (
                    <svg
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className={className}
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  classes={{
                    list: s.default.list,
                    item: s.default.item,
                    itemActive: s.default.itemActive,
                    separator: s.default.separator,
                    ellipsisButton: s.default.ellipsisButton,
                    dropdown: s.default.dropdown,
                    dropdownItem: s.default.dropdownItem,
                  }}
                  onItemClick={handleItemClick}
                />
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Pill Style"
          description="Pill-shaped breadcrumb items with gradient active state."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Breadcrumb
              items={longItems}
              maxVisibleItems={4}
              classes={{
                list: s.pill.list,
                item: s.pill.item,
                itemActive: s.pill.itemActive,
                separator: s.pill.separator,
                ellipsisButton: s.pill.ellipsisButton,
                dropdown: s.pill.dropdown,
                dropdownItem: s.pill.dropdownItem,
              }}
              onItemClick={handleItemClick}
            />
          </DemoWrapper>
        </Section>

        <Section
          title="Colored Theme"
          description="Blue-themed breadcrumb with container background via classes.root."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Breadcrumb
              items={basicItems}
              classes={{
                root: s.colored.root,
                list: s.colored.list,
                item: s.colored.item,
                itemActive: s.colored.itemActive,
                separator: s.colored.separator,
              }}
              onItemClick={handleItemClick}
            />
          </DemoWrapper>
        </Section>

        <Section
          title="className, style & aria-label"
          description="Use className as a fallback for classes.root, style for inline styles, and aria-label to customize the navigation landmark."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode} layout="flex-col">
            <div className="w-full space-y-6">
              <div>
                <p
                  className={`text-xs font-medium mb-2 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
                >
                  className (fallback for classes.root)
                </p>
                <Breadcrumb
                  items={basicItems}
                  className={`p-3 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}
                  classes={{
                    list: s.default.list,
                    item: s.default.item,
                    itemActive: s.default.itemActive,
                    separator: s.default.separator,
                  }}
                  onItemClick={handleItemClick}
                />
              </div>
              <div>
                <p
                  className={`text-xs font-medium mb-2 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
                >
                  style (inline styles on root)
                </p>
                <Breadcrumb
                  items={basicItems}
                  style={{
                    padding: "12px 16px",
                    borderRadius: 12,
                    border: `1px solid ${isDarkMode ? "#374151" : "#e5e7eb"}`,
                  }}
                  classes={{
                    list: s.default.list,
                    item: s.default.item,
                    itemActive: s.default.itemActive,
                    separator: s.default.separator,
                  }}
                  onItemClick={handleItemClick}
                />
              </div>
              <div>
                <p
                  className={`text-xs font-medium mb-2 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
                >
                  aria-label=&quot;Product navigation&quot;
                </p>
                <Breadcrumb
                  items={basicItems}
                  aria-label="Product navigation"
                  classes={{
                    list: s.default.list,
                    item: s.default.item,
                    itemActive: s.default.itemActive,
                    separator: s.default.separator,
                  }}
                  onItemClick={handleItemClick}
                />
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Gradient Background"
          description="Vibrant gradient backgrounds with adapted text colors."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode} layout="flex-col">
            <div className="w-full space-y-6">
              <div>
                <p
                  className={`text-xs font-medium mb-2 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
                >
                  Purple to Red
                </p>
                <Breadcrumb
                  items={longItems}
                  maxVisibleItems={3}
                  classes={{
                    root: s.gradient.root,
                    list: s.gradient.list,
                    item: s.gradient.item,
                    itemActive: s.gradient.itemActive,
                    separator: s.gradient.separator,
                    ellipsisButton: s.gradient.ellipsisButton,
                    dropdown: s.gradient.dropdown,
                    dropdownItem: s.gradient.dropdownItem,
                  }}
                  onItemClick={handleItemClick}
                />
              </div>
              <div>
                <p
                  className={`text-xs font-medium mb-2 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
                >
                  Emerald to Cyan
                </p>
                <Breadcrumb
                  items={itemsWithIcons}
                  classes={{
                    root: s.green.root,
                    list: s.green.list,
                    item: s.green.item,
                    itemActive: s.green.itemActive,
                    separator: s.green.separator,
                    icon: s.default.icon,
                  }}
                  onItemClick={handleItemClick}
                />
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Ellipsis Style Variations"
          description="Different ellipsis button and dropdown designs demonstrating classes flexibility."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode} layout="flex-col">
            <div className="w-full space-y-8">
              <div>
                <p
                  className={`text-xs font-medium mb-3 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
                >
                  Minimal
                </p>
                <Breadcrumb
                  items={longItems}
                  maxVisibleItems={3}
                  classes={{
                    list: s.default.list,
                    item: s.default.item,
                    itemActive: s.default.itemActive,
                    separator: s.default.separator,
                    ellipsisButton: `flex items-center justify-center w-7 h-7 rounded-md transition-all cursor-pointer ${isDarkMode ? "text-gray-500 hover:text-gray-300 hover:bg-gray-800" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"}`,
                    dropdown: `min-w-44 rounded-xl py-1.5 ${isDarkMode ? "bg-gray-800 shadow-lg shadow-black/30 border border-gray-700" : "bg-white shadow-lg shadow-gray-200/50 border border-gray-100"}`,
                    dropdownItem: `flex items-center gap-2 px-3 py-2 text-sm cursor-pointer w-full text-left bg-transparent border-none transition-colors ${isDarkMode ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"}`,
                  }}
                  onItemClick={handleItemClick}
                />
              </div>

              <div
                className={`p-5 rounded-2xl ${isDarkMode ? "bg-gray-800/50" : "bg-linear-to-br from-slate-50 to-gray-100"}`}
              >
                <p
                  className={`text-xs font-medium mb-3 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
                >
                  Glassmorphism
                </p>
                <Breadcrumb
                  items={longItems}
                  maxVisibleItems={3}
                  classes={{
                    list: s.default.list,
                    item: s.default.item,
                    itemActive: s.default.itemActive,
                    separator: s.default.separator,
                    ellipsisButton: `flex items-center justify-center w-8 h-8 rounded-lg border shadow-sm transition-all cursor-pointer ${isDarkMode ? "bg-gray-700/60 backdrop-blur-sm hover:bg-gray-600/80 text-gray-300 border-gray-600/50" : "bg-white/60 backdrop-blur-sm hover:bg-white/80 text-gray-600 hover:text-gray-900 border-white/50"}`,
                    dropdown: `min-w-48 rounded-2xl py-2 ${isDarkMode ? "bg-gray-800/80 backdrop-blur-xl shadow-xl shadow-black/20 border border-gray-700/60" : "bg-white/80 backdrop-blur-xl shadow-xl shadow-black/5 border border-white/60"}`,
                    dropdownItem: `flex items-center gap-2.5 px-4 py-2.5 text-sm cursor-pointer w-full text-left bg-transparent border-none transition-colors mx-1 rounded-lg ${isDarkMode ? "text-gray-300 hover:bg-gray-700/60" : "text-gray-700 hover:bg-white/60"}`,
                  }}
                  onItemClick={handleItemClick}
                />
              </div>

              <div>
                <p
                  className={`text-xs font-medium mb-3 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
                >
                  Soft Violet
                </p>
                <Breadcrumb
                  items={longItems}
                  maxVisibleItems={3}
                  classes={{
                    list: s.default.list,
                    item: s.default.item,
                    itemActive: s.default.itemActive,
                    separator: s.default.separator,
                    ellipsisButton: `flex items-center justify-center w-8 h-8 rounded-full transition-all cursor-pointer ${isDarkMode ? "bg-violet-900/50 hover:bg-violet-800/60 text-violet-400 hover:text-violet-300" : "bg-violet-50 hover:bg-violet-100 text-violet-500 hover:text-violet-600"}`,
                    dropdown: `min-w-44 rounded-2xl py-2 ${isDarkMode ? "bg-gray-800 shadow-xl shadow-violet-900/20 border border-violet-800/50" : "bg-white shadow-xl shadow-violet-100/50 border border-violet-50"}`,
                    dropdownItem: `flex items-center gap-2 px-4 py-2.5 text-sm cursor-pointer w-full text-left bg-transparent border-none transition-colors mx-1.5 rounded-xl ${isDarkMode ? "text-gray-300 hover:text-violet-300 hover:bg-violet-900/30" : "text-gray-600 hover:text-violet-700 hover:bg-violet-50"}`,
                  }}
                  onItemClick={handleItemClick}
                />
              </div>

              <div
                className={`p-5 rounded-2xl ${isDarkMode ? "bg-gray-900" : "bg-gray-950"}`}
              >
                <p className="text-xs font-medium text-gray-500 mb-3">
                  Dark Modern
                </p>
                <Breadcrumb
                  items={longItems}
                  maxVisibleItems={3}
                  classes={{
                    list: s.default.list,
                    item: "flex items-center gap-1 px-2 py-1 text-sm text-gray-400 hover:text-gray-200 cursor-pointer rounded transition-colors bg-transparent border-none",
                    itemActive:
                      "flex items-center gap-1 px-2 py-1 text-sm text-white font-medium bg-transparent border-none cursor-default",
                    separator: "text-gray-600",
                    ellipsisButton:
                      "flex items-center justify-center w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-all cursor-pointer",
                    dropdown:
                      "min-w-48 bg-gray-900 rounded-xl shadow-2xl shadow-black/20 border border-gray-800 py-1.5",
                    dropdownItem:
                      "flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-gray-800 cursor-pointer transition-colors mx-1 rounded-lg w-full text-left bg-transparent border-none",
                  }}
                  onItemClick={handleItemClick}
                />
              </div>

              <div>
                <p
                  className={`text-xs font-medium mb-3 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
                >
                  Accent Gradient
                </p>
                <Breadcrumb
                  items={longItems}
                  maxVisibleItems={3}
                  classes={{
                    list: s.default.list,
                    item: s.default.item,
                    itemActive: s.default.itemActive,
                    separator: s.default.separator,
                    ellipsisButton: `flex items-center justify-center w-8 h-8 rounded-lg shadow-md transition-all cursor-pointer ${isDarkMode ? "bg-linear-to-br from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white shadow-blue-900/30 hover:shadow-blue-900/40" : "bg-linear-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/30"}`,
                    dropdown: `min-w-48 rounded-xl py-1.5 ${isDarkMode ? "bg-gray-800 shadow-xl shadow-black/20 border border-gray-700" : "bg-white shadow-xl shadow-gray-200/60 border border-gray-100"}`,
                    dropdownItem: `flex items-center gap-2.5 px-4 py-2.5 text-sm cursor-pointer w-full text-left bg-transparent border-none transition-colors mx-1 rounded-lg ${isDarkMode ? "text-gray-300 hover:text-blue-300 hover:bg-blue-900/30" : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"}`,
                  }}
                  onItemClick={handleItemClick}
                />
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Combined: Tooltips + Icons + Truncation"
          description="A complete example combining all features."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Breadcrumb
              items={[
                {
                  id: "home",
                  label: "Home",
                  tooltip: "Go to homepage",
                  icon: <HomeIcon className="w-4 h-4" />,
                  iconPosition: "left",
                },
                {
                  id: "level1",
                  label: "Projects",
                  tooltip: "View all projects",
                  icon: <FolderIcon className="w-4 h-4" />,
                  iconPosition: "left",
                },
                {
                  id: "level2",
                  label: "Web Development",
                  tooltip: "Web Development projects category",
                  icon: <FolderIcon className="w-4 h-4" />,
                  iconPosition: "left",
                },
                {
                  id: "level3",
                  label: "React Applications",
                  tooltip: "React-based web applications",
                  icon: <FolderIcon className="w-4 h-4" />,
                  iconPosition: "left",
                },
                {
                  id: "level4",
                  label: "Component Library",
                  tooltip: "Reusable UI component library",
                  icon: <FolderIcon className="w-4 h-4" />,
                  iconPosition: "left",
                },
                {
                  id: "current",
                  label: "Breadcrumb Component",
                  tooltip:
                    "Currently viewing: Breadcrumb Component documentation",
                  tooltipProps: { side: "bottom" },
                  icon: <DocumentIcon className="w-4 h-4" />,
                  iconPosition: "right",
                },
              ]}
              maxVisibleItems={3}
              showTooltips={true}
              ellipsisTooltip="Show 3 hidden items"
              defaultTooltipProps={{ delayDuration: 150 }}
              classes={{
                root: s.colored.root,
                list: s.colored.list,
                item: s.colored.item,
                itemActive: s.colored.itemActive,
                separator: s.colored.separator,
                icon: s.default.icon,
                ellipsisButton: s.colored.ellipsisButton,
                dropdown: s.colored.dropdown,
                dropdownItem: s.colored.dropdownItem,
              }}
              onItemClick={handleItemClick}
            />
          </DemoWrapper>
        </Section>

        <Section
          title="Keyboard Navigation"
          description="The ellipsis dropdown supports full WAI-ARIA menu keyboard patterns."
          isDarkMode={isDarkMode}
        >
          <div
            className={`mb-4 p-4 rounded-lg text-sm ${isDarkMode ? "bg-blue-900/30 border border-blue-800 text-blue-200" : "bg-blue-50 text-blue-800"}`}
          >
            <p className="font-semibold mb-2">
              Ellipsis dropdown keyboard shortcuts:
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <kbd
                  className={`px-2 py-1 rounded border text-xs font-mono shadow-sm ${isDarkMode ? "bg-gray-800 border-gray-600 text-gray-300" : "bg-white border-blue-200 text-blue-800"}`}
                >
                  Enter
                </kbd>
                <kbd
                  className={`px-2 py-1 rounded border text-xs font-mono shadow-sm ${isDarkMode ? "bg-gray-800 border-gray-600 text-gray-300" : "bg-white border-blue-200 text-blue-800"}`}
                >
                  Space
                </kbd>
                <span>Open dropdown / activate item</span>
              </li>
              <li className="flex items-center gap-2">
                <kbd
                  className={`px-2 py-1 rounded border text-xs font-mono shadow-sm ${isDarkMode ? "bg-gray-800 border-gray-600 text-gray-300" : "bg-white border-blue-200 text-blue-800"}`}
                >
                  &darr;
                </kbd>
                <span>Open dropdown / move to next item</span>
              </li>
              <li className="flex items-center gap-2">
                <kbd
                  className={`px-2 py-1 rounded border text-xs font-mono shadow-sm ${isDarkMode ? "bg-gray-800 border-gray-600 text-gray-300" : "bg-white border-blue-200 text-blue-800"}`}
                >
                  &uarr;
                </kbd>
                <span>Move to previous item</span>
              </li>
              <li className="flex items-center gap-2">
                <kbd
                  className={`px-2 py-1 rounded border text-xs font-mono shadow-sm ${isDarkMode ? "bg-gray-800 border-gray-600 text-gray-300" : "bg-white border-blue-200 text-blue-800"}`}
                >
                  Home
                </kbd>
                <span>Move to first item</span>
              </li>
              <li className="flex items-center gap-2">
                <kbd
                  className={`px-2 py-1 rounded border text-xs font-mono shadow-sm ${isDarkMode ? "bg-gray-800 border-gray-600 text-gray-300" : "bg-white border-blue-200 text-blue-800"}`}
                >
                  End
                </kbd>
                <span>Move to last item</span>
              </li>
              <li className="flex items-center gap-2">
                <kbd
                  className={`px-2 py-1 rounded border text-xs font-mono shadow-sm ${isDarkMode ? "bg-gray-800 border-gray-600 text-gray-300" : "bg-white border-blue-200 text-blue-800"}`}
                >
                  Escape
                </kbd>
                <span>Close dropdown, restore focus to trigger</span>
              </li>
              <li className="flex items-center gap-2">
                <kbd
                  className={`px-2 py-1 rounded border text-xs font-mono shadow-sm ${isDarkMode ? "bg-gray-800 border-gray-600 text-gray-300" : "bg-white border-blue-200 text-blue-800"}`}
                >
                  Tab
                </kbd>
                <span>Close dropdown, move focus forward</span>
              </li>
            </ul>
          </div>
          <DemoWrapper isDarkMode={isDarkMode}>
            <Breadcrumb
              items={longItems}
              maxVisibleItems={3}
              classes={{
                list: s.default.list,
                item: s.default.item,
                itemActive: s.default.itemActive,
                separator: s.default.separator,
                ellipsisButton: s.default.ellipsisButton,
                dropdown: s.default.dropdown,
                dropdownItem: s.default.dropdownItem,
              }}
              onItemClick={handleItemClick}
            />
          </DemoWrapper>
        </Section>

        <Section
          title="Data Attributes"
          description="The Breadcrumb component applies data attributes for CSS-based styling."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="overflow-x-auto">
              <table
                className={`min-w-full text-sm ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}
              >
                <thead>
                  <tr
                    className={`border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
                  >
                    <th className="text-left py-3 pr-4 font-semibold">
                      Attribute
                    </th>
                    <th className="text-left py-3 pr-4 font-semibold">
                      Applied To
                    </th>
                    <th className="text-left py-3 font-semibold">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody
                  className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-100"}`}
                >
                  <tr>
                    <td className="py-3 pr-4 font-mono text-blue-500">
                      data-state
                    </td>
                    <td
                      className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                    >
                      item, dropdown
                    </td>
                    <td
                      className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                    >
                      &quot;active&quot;, &quot;inactive&quot;, or
                      &quot;open&quot;
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-mono text-blue-500">
                      data-disabled
                    </td>
                    <td
                      className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                    >
                      item, dropdown item
                    </td>
                    <td
                      className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                    >
                      Present when the item is disabled
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-mono text-blue-500">
                      data-truncated
                    </td>
                    <td
                      className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                    >
                      root (nav)
                    </td>
                    <td
                      className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                    >
                      Present when items are truncated
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-mono text-blue-500">
                      data-dropdown-open
                    </td>
                    <td
                      className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                    >
                      root (nav)
                    </td>
                    <td
                      className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                    >
                      Present when the ellipsis dropdown is open
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-mono text-blue-500">
                      data-clickable
                    </td>
                    <td
                      className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                    >
                      item (button)
                    </td>
                    <td
                      className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                    >
                      Present when the item has a click handler
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-mono text-blue-500">
                      data-position
                    </td>
                    <td
                      className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                    >
                      dropdown (portal)
                    </td>
                    <td
                      className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                    >
                      &quot;top&quot;, &quot;bottom&quot;, &quot;left&quot;, or
                      &quot;right&quot;
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p
              className={`text-sm mt-4 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              Example usage:{" "}
              <code
                className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}
              >
                data-[state=active]:font-bold
              </code>
              ,{" "}
              <code
                className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}
              >
                data-[disabled]:opacity-50
              </code>
            </p>
          </DemoWrapper>
        </Section>
      </div>

      <div className="space-y-8">
        <h2
          className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}
        >
          API Reference
        </h2>

        <div>
          <h3
            className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}
          >
            Breadcrumb Props
          </h3>
          <div className="overflow-x-auto">
            <table
              className={`min-w-full text-sm ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}
            >
              <thead>
                <tr
                  className={`border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
                >
                  <th className="text-left py-3 pr-4 font-semibold">Prop</th>
                  <th className="text-left py-3 pr-4 font-semibold">Type</th>
                  <th className="text-left py-3 pr-4 font-semibold">Default</th>
                  <th className="text-left py-3 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-100"}`}
              >
                {[
                  [
                    "items",
                    "BreadcrumbItem[]",
                    "required",
                    "Array of breadcrumb items",
                  ],
                  [
                    "maxVisibleItems",
                    "number",
                    "4",
                    "Maximum items before truncation (minimum 2)",
                  ],
                  [
                    "separator",
                    "ReactNode",
                    "ChevronRightIcon",
                    "Custom separator element between items",
                  ],
                  [
                    "onItemClick",
                    "(item: BreadcrumbItem) => void",
                    "-",
                    "Callback when any item is clicked",
                  ],
                  [
                    "aria-label",
                    "string",
                    '"Breadcrumb"',
                    "Accessible label for the nav element",
                  ],
                  [
                    "classes",
                    "BreadcrumbClasses",
                    "-",
                    "Record of class names for all internal elements",
                  ],
                  [
                    "className",
                    "string",
                    "-",
                    "Root element class name (fallback for classes.root)",
                  ],
                  ["style", "CSSProperties", "-", "Root element inline styles"],
                  [
                    "SeparatorIcon",
                    "ComponentType",
                    "ChevronRightIcon",
                    "Custom separator icon component",
                  ],
                  [
                    "EllipsisIcon",
                    "ComponentType",
                    "EllipsisIcon",
                    "Custom ellipsis icon component",
                  ],
                  [
                    "iconSize",
                    "number | string",
                    "16",
                    "Size for separator and ellipsis icons (number for px, string for className)",
                  ],
                  [
                    "showTooltips",
                    "boolean",
                    "true",
                    "Enable tooltips on items with tooltip content",
                  ],
                  [
                    "tooltipPosition",
                    '"top" | "bottom" | "left" | "right"',
                    '"bottom"',
                    "Default position of tooltips",
                  ],
                  [
                    "tooltipOffset",
                    "number",
                    "4",
                    "Distance between tooltip and item (px)",
                  ],
                  [
                    "defaultTooltipProps",
                    "BreadcrumbTooltipProps",
                    "-",
                    "Default tooltip configuration for all items",
                  ],
                  [
                    "ellipsisTooltip",
                    "ReactNode",
                    "-",
                    "Tooltip content for the ellipsis button",
                  ],
                  [
                    "ellipsisTooltipProps",
                    "BreadcrumbTooltipProps",
                    "-",
                    "Tooltip configuration for the ellipsis button",
                  ],
                  [
                    "dropdownPosition",
                    '"top" | "bottom" | "left" | "right"',
                    '"top"',
                    "Position of the ellipsis dropdown relative to the button",
                  ],
                  [
                    "dropdownZIndex",
                    "number",
                    "50",
                    "z-index of the ellipsis dropdown",
                  ],
                  [
                    "portalContainer",
                    "HTMLElement | null",
                    "document.body",
                    "Container element for the dropdown portal",
                  ],
                  [
                    "ellipsisAriaLabel",
                    "string",
                    '"Show collapsed breadcrumb items"',
                    "Accessible label for the ellipsis button (i18n)",
                  ],
                ].map(([prop, type, def, desc]) => (
                  <tr key={prop}>
                    <td className="py-3 pr-4 font-mono text-blue-500">
                      {prop}
                    </td>
                    <td
                      className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                    >
                      {type}
                    </td>
                    <td
                      className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                    >
                      {def}
                    </td>
                    <td
                      className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                    >
                      {desc}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3
            className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}
          >
            BreadcrumbItem Interface
          </h3>
          <div className="overflow-x-auto">
            <table
              className={`min-w-full text-sm ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}
            >
              <thead>
                <tr
                  className={`border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
                >
                  <th className="text-left py-3 pr-4 font-semibold">
                    Property
                  </th>
                  <th className="text-left py-3 pr-4 font-semibold">Type</th>
                  <th className="text-left py-3 pr-4 font-semibold">
                    Required
                  </th>
                  <th className="text-left py-3 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-100"}`}
              >
                {[
                  ["id", "string", "Yes", "Unique identifier for the item"],
                  ["label", "string", "Yes", "Display text"],
                  [
                    "href",
                    "string",
                    "No",
                    "Link URL (renders as anchor element)",
                  ],
                  ["onClick", "() => void", "No", "Click handler for the item"],
                  ["icon", "ReactNode", "No", "Icon element (any ReactNode)"],
                  [
                    "iconPosition",
                    '"left" | "right"',
                    "No",
                    "Position of the icon relative to label",
                  ],
                  ["disabled", "boolean", "No", "Disable this item"],
                  [
                    "content",
                    "ReactNode",
                    "No",
                    "Custom content instead of label text",
                  ],
                  [
                    "tooltip",
                    "ReactNode",
                    "No",
                    "Tooltip content for this item",
                  ],
                  [
                    "tooltipProps",
                    "BreadcrumbTooltipProps",
                    "No",
                    "Tooltip configuration override for this item",
                  ],
                ].map(([prop, type, required, desc]) => (
                  <tr key={prop}>
                    <td className="py-3 pr-4 font-mono text-blue-500">
                      {prop}
                    </td>
                    <td
                      className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                    >
                      {type}
                    </td>
                    <td
                      className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                    >
                      {required}
                    </td>
                    <td
                      className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                    >
                      {desc}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3
            className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}
          >
            classes Record (BreadcrumbClasses)
          </h3>
          <div className="overflow-x-auto">
            <table
              className={`min-w-full text-sm ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}
            >
              <thead>
                <tr
                  className={`border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
                >
                  <th className="text-left py-3 pr-4 font-semibold">Key</th>
                  <th className="text-left py-3 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-100"}`}
              >
                {[
                  ["root", "Root container (nav element)"],
                  ["list", "Breadcrumb list (ol element)"],
                  ["item", "Non-active breadcrumb item"],
                  ["itemActive", "Current/last breadcrumb item"],
                  ["itemDisabled", "Disabled breadcrumb item"],
                  ["link", "Item rendered as anchor (items with href)"],
                  ["separator", "Separator element between items"],
                  ["icon", "Icon wrapper"],
                  ["ellipsis", "Ellipsis container (li element)"],
                  ["ellipsisButton", "Ellipsis trigger button"],
                  ["dropdown", "Dropdown menu container"],
                  ["dropdownItem", "Dropdown menu item"],
                  ["dropdownItemDisabled", "Disabled dropdown menu item"],
                ].map(([key, desc]) => (
                  <tr key={key}>
                    <td className="py-3 pr-4 font-mono text-blue-500">{key}</td>
                    <td
                      className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                    >
                      {desc}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3
            className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}
          >
            BreadcrumbTooltipProps Interface
          </h3>
          <div className="overflow-x-auto">
            <table
              className={`min-w-full text-sm ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}
            >
              <thead>
                <tr
                  className={`border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
                >
                  <th className="text-left py-3 pr-4 font-semibold">
                    Property
                  </th>
                  <th className="text-left py-3 pr-4 font-semibold">Type</th>
                  <th className="text-left py-3 pr-4 font-semibold">Default</th>
                  <th className="text-left py-3 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-100"}`}
              >
                {[
                  [
                    "side",
                    '"top" | "right" | "bottom" | "left"',
                    '"top"',
                    "Tooltip position relative to item",
                  ],
                  [
                    "align",
                    '"start" | "center" | "end"',
                    '"center"',
                    "Tooltip alignment",
                  ],
                  [
                    "sideOffset",
                    "number",
                    "6",
                    "Offset from the item in pixels",
                  ],
                  [
                    "maxWidth",
                    "string | number",
                    "300",
                    "Maximum width of tooltip",
                  ],
                  [
                    "delayDuration",
                    "number",
                    "200",
                    "Delay before showing tooltip (ms)",
                  ],
                  ["showArrow", "boolean", "true", "Show arrow on tooltip"],
                  [
                    "contentClassName",
                    "string",
                    "-",
                    "Custom class for tooltip content",
                  ],
                  [
                    "contentStyle",
                    "CSSProperties",
                    "-",
                    "Custom style for tooltip content",
                  ],
                ].map(([prop, type, def, desc]) => (
                  <tr key={prop}>
                    <td className="py-3 pr-4 font-mono text-blue-500">
                      {prop}
                    </td>
                    <td
                      className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                    >
                      {type}
                    </td>
                    <td
                      className={`py-3 pr-4 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
                    >
                      {def}
                    </td>
                    <td
                      className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                    >
                      {desc}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3
            className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}
          >
            Type Definitions
          </h3>
          <CodeBlock
            isDarkMode={isDarkMode}
            code={`interface BreadcrumbItem {
  id: string;
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  disabled?: boolean;
  content?: ReactNode;
  tooltip?: ReactNode;
  tooltipProps?: BreadcrumbTooltipProps;
}

interface BreadcrumbClassNames {
  root?: string;
  list?: string;
  item?: string;
  itemActive?: string;
  itemDisabled?: string;
  link?: string;
  separator?: string;
  icon?: string;
  ellipsis?: string;
  ellipsisButton?: string;
  dropdown?: string;
  dropdownItem?: string;
  dropdownItemDisabled?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  maxVisibleItems?: number;
  separator?: ReactNode;
  onItemClick?: (item: BreadcrumbItem) => void;
  "aria-label"?: string;
  classes?: BreadcrumbClassNames;
  className?: string;
  style?: CSSProperties;
  SeparatorIcon?: ComponentType<{ className?: string; style?: CSSProperties }>;
  EllipsisIcon?: ComponentType<{ className?: string; style?: CSSProperties }>;
  iconSize?: number | string;
  showTooltips?: boolean;
  tooltipPosition?: "top" | "bottom" | "left" | "right";
  tooltipOffset?: number;
  defaultTooltipProps?: BreadcrumbTooltipProps;
  ellipsisTooltip?: ReactNode;
  ellipsisTooltipProps?: BreadcrumbTooltipProps;
  dropdownPosition?: "top" | "bottom" | "left" | "right";
  dropdownZIndex?: number;
  portalContainer?: HTMLElement | null;
  ellipsisAriaLabel?: string;
}`}
          />
        </div>
      </div>

      <div className="space-y-6">
        <h2
          className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}
        >
          Accessibility
        </h2>
        <div
          className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-gray-50"}`}
        >
          <h3
            className={`font-semibold mb-3 ${isDarkMode ? "text-white" : "text-gray-800"}`}
          >
            Features
          </h3>
          <ul
            className={`list-disc list-inside space-y-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
          >
            <li>
              Uses semantic{" "}
              <code
                className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
              >
                &lt;nav&gt;
              </code>{" "}
              with{" "}
              <code
                className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
              >
                aria-label
              </code>{" "}
              for screen reader landmark navigation
            </li>
            <li>
              Ordered list{" "}
              <code
                className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
              >
                &lt;ol&gt;
              </code>{" "}
              communicates hierarchy to assistive technologies
            </li>
            <li>
              Current page marked with{" "}
              <code
                className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
              >
                aria-current=&quot;page&quot;
              </code>
            </li>
            <li>
              Separators hidden from screen readers via{" "}
              <code
                className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
              >
                aria-hidden=&quot;true&quot;
              </code>{" "}
              and{" "}
              <code
                className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
              >
                role=&quot;presentation&quot;
              </code>
            </li>
            <li>
              Icons wrapped with{" "}
              <code
                className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
              >
                aria-hidden=&quot;true&quot;
              </code>{" "}
              as they are decorative
            </li>
            <li>
              Ellipsis button uses{" "}
              <code
                className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
              >
                aria-expanded
              </code>
              ,{" "}
              <code
                className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
              >
                aria-haspopup=&quot;menu&quot;
              </code>
              , and{" "}
              <code
                className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
              >
                aria-label
              </code>
            </li>
            <li>
              Dropdown menu implements{" "}
              <code
                className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
              >
                role=&quot;menu&quot;
              </code>{" "}
              with{" "}
              <code
                className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
              >
                role=&quot;menuitem&quot;
              </code>{" "}
              items
            </li>
            <li>
              Full keyboard navigation within the dropdown (ArrowUp, ArrowDown,
              Home, End, Escape, Tab)
            </li>
            <li>
              Focus automatically moves to the first menu item when the dropdown
              opens
            </li>
            <li>
              Focus returns to the ellipsis button when the dropdown closes via
              Escape
            </li>
            <li>
              Disabled items receive{" "}
              <code
                className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}
              >
                aria-disabled
              </code>{" "}
              and are skipped during keyboard navigation
            </li>
            <li>Click-outside detection handles both mouse and touch events</li>
            <li>
              No native HTML elements use semantic elements (`button`, `a`,
              `span`) — no polymorphic abstraction layer
            </li>
            <li>Supports ref forwarding for programmatic focus management</li>
          </ul>
        </div>

        <div
          className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-gray-50"}`}
        >
          <h3
            className={`font-semibold mb-3 ${isDarkMode ? "text-white" : "text-gray-800"}`}
          >
            Keyboard Navigation
          </h3>
          <ul
            className={`space-y-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
          >
            <li>
              <kbd
                className={`px-2 py-1 rounded text-xs font-mono ${isDarkMode ? "bg-gray-900 border border-gray-600 text-gray-100" : "bg-white border border-gray-300 text-gray-700"}`}
              >
                Tab
              </kbd>{" "}
              - Navigate between breadcrumb items and the ellipsis button
            </li>
            <li>
              <kbd
                className={`px-2 py-1 rounded text-xs font-mono ${isDarkMode ? "bg-gray-900 border border-gray-600 text-gray-100" : "bg-white border border-gray-300 text-gray-700"}`}
              >
                Enter
              </kbd>{" "}
              /{" "}
              <kbd
                className={`px-2 py-1 rounded text-xs font-mono ${isDarkMode ? "bg-gray-900 border border-gray-600 text-gray-100" : "bg-white border border-gray-300 text-gray-700"}`}
              >
                Space
              </kbd>{" "}
              - Activate items or toggle the ellipsis dropdown
            </li>
            <li>
              <kbd
                className={`px-2 py-1 rounded text-xs font-mono ${isDarkMode ? "bg-gray-900 border border-gray-600 text-gray-100" : "bg-white border border-gray-300 text-gray-700"}`}
              >
                ArrowDown
              </kbd>{" "}
              - Open dropdown (on ellipsis) / move to next menu item
            </li>
            <li>
              <kbd
                className={`px-2 py-1 rounded text-xs font-mono ${isDarkMode ? "bg-gray-900 border border-gray-600 text-gray-100" : "bg-white border border-gray-300 text-gray-700"}`}
              >
                ArrowUp
              </kbd>{" "}
              - Move to previous menu item
            </li>
            <li>
              <kbd
                className={`px-2 py-1 rounded text-xs font-mono ${isDarkMode ? "bg-gray-900 border border-gray-600 text-gray-100" : "bg-white border border-gray-300 text-gray-700"}`}
              >
                Home
              </kbd>{" "}
              - Move to first menu item
            </li>
            <li>
              <kbd
                className={`px-2 py-1 rounded text-xs font-mono ${isDarkMode ? "bg-gray-900 border border-gray-600 text-gray-100" : "bg-white border border-gray-300 text-gray-700"}`}
              >
                End
              </kbd>{" "}
              - Move to last menu item
            </li>
            <li>
              <kbd
                className={`px-2 py-1 rounded text-xs font-mono ${isDarkMode ? "bg-gray-900 border border-gray-600 text-gray-100" : "bg-white border border-gray-300 text-gray-700"}`}
              >
                Escape
              </kbd>{" "}
              - Close dropdown, restore focus to ellipsis button
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BreadcrumbDemo;
