import { useCallback, useState } from "react";
import { Breadcrumb } from "../../components/Breadcrumb";
import type { BreadcrumbItem } from "../../components/Breadcrumb";
import { useTheme } from "./ThemeContext";
import {
  Section,
  DemoWrapper,
  PropsTable,
  PropRow,
  DocControlledPattern,
  DocEdgeCases,
  DocDoDont,
} from "./components";

// ─── Icons ───────────────────────────────────────────────────────────────────

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
const ArrowIcon = ({
  className = "",
  style = {},
}: {
  className?: string;
  style?: React.CSSProperties;
}) => (
  <svg
    viewBox="0 0 20 20"
    fill="currentColor"
    className={className}
    style={style}
  >
    <path
      fillRule="evenodd"
      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
);

// ─── Data ────────────────────────────────────────────────────────────────────

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
  { id: "home", label: "Home", icon: <HomeIcon className="w-4 h-4" /> },
  {
    id: "documents",
    label: "Documents",
    icon: <FolderIcon className="w-4 h-4" />,
  },
  { id: "reports", label: "Reports", icon: <FolderIcon className="w-4 h-4" /> },
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
  },
  {
    id: "documents",
    label: "Documents",
    tooltip: "View all documents",
    icon: <FolderIcon className="w-4 h-4" />,
  },
  {
    id: "reports",
    label: "Reports",
    tooltip: "Quarterly and annual reports",
    icon: <FolderIcon className="w-4 h-4" />,
  },
  {
    id: "current",
    label: "Q4 2025 Report",
    tooltip: "Currently viewing",
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

// ─── Themed Classes ──────────────────────────────────────────────────────────

const getClasses = (dark: boolean) => ({
  breadcrumb: {
    list: "flex items-center gap-1",
    item: `flex items-center gap-1 px-2 py-1 text-sm transition-colors cursor-pointer bg-transparent border-none rounded ${dark ? "text-gray-400 hover:text-gray-200 hover:bg-gray-800" : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"}`,
    itemActive: `flex items-center gap-1 px-2 py-1 text-sm font-medium bg-transparent border-none cursor-default ${dark ? "text-white" : "text-gray-900"}`,
    itemDisabled: dark
      ? "opacity-40 cursor-not-allowed hover:bg-transparent hover:text-gray-400"
      : "opacity-40 cursor-not-allowed hover:bg-transparent hover:text-gray-500",
    separator: dark ? "text-gray-600" : "text-gray-400",
    icon: "shrink-0",
    link: `flex items-center gap-1 px-2 py-1 text-sm rounded transition-colors ${dark ? "text-blue-400 hover:text-blue-300 hover:underline" : "text-blue-600 hover:text-blue-800 hover:underline"}`,
    ellipsisButton: `flex items-center justify-center w-8 h-8 rounded-md transition-colors cursor-pointer ${dark ? "bg-gray-800 hover:bg-gray-700 text-gray-400" : "bg-gray-100 hover:bg-gray-200 text-gray-600"}`,
    dropdown: `min-w-40 rounded-lg shadow-lg py-1 ${dark ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"}`,
    dropdownItem: `flex items-center gap-2 px-3 py-2 text-sm cursor-pointer w-full text-left bg-transparent border-none ${dark ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-50"}`,
    dropdownItemDisabled: dark
      ? "opacity-50 cursor-not-allowed"
      : "opacity-50 cursor-not-allowed",
  },
  pill: {
    list: "flex items-center gap-2",
    item: `flex items-center gap-1 px-4 py-2 text-sm rounded-full transition-all border cursor-pointer bg-transparent ${dark ? "text-gray-400 hover:text-gray-200 bg-gray-800 hover:bg-gray-700 border-gray-700" : "text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-50 border-gray-200 hover:shadow-sm"}`,
    itemActive: `flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-full border-none cursor-default shadow-md ${dark ? "text-white bg-linear-to-r from-indigo-600 to-purple-600" : "text-white bg-linear-to-r from-indigo-500 to-purple-500"}`,
    separator: dark ? "text-gray-600" : "text-gray-300",
    ellipsisButton: `flex items-center justify-center w-10 h-10 rounded-full border transition-all cursor-pointer ${dark ? "bg-gray-800 hover:bg-gray-700 text-gray-400 border-gray-700" : "bg-white hover:bg-gray-50 text-gray-500 border-gray-200 hover:shadow-sm"}`,
    dropdown: `min-w-40 rounded-xl shadow-lg py-2 ${dark ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"}`,
    dropdownItem: `flex items-center gap-2 px-4 py-2 text-sm cursor-pointer w-full text-left bg-transparent border-none ${dark ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-50"}`,
  },
  colored: {
    root: `p-4 rounded-lg ${dark ? "bg-blue-950" : "bg-blue-50"}`,
    list: "flex items-center gap-1",
    item: `flex items-center gap-1 px-3 py-1.5 text-sm rounded-full transition-colors cursor-pointer bg-transparent border-none ${dark ? "text-blue-300 hover:text-blue-200 hover:bg-blue-900" : "text-blue-600 hover:text-blue-800 hover:bg-blue-100"}`,
    itemActive: `flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-full border-none cursor-default ${dark ? "text-white bg-blue-600" : "text-white bg-blue-600"}`,
    separator: dark ? "text-blue-700" : "text-blue-300",
    icon: "shrink-0",
    ellipsisButton: `flex items-center justify-center w-8 h-8 rounded-full transition-colors cursor-pointer ${dark ? "bg-blue-900 hover:bg-blue-800 text-blue-300" : "bg-blue-100 hover:bg-blue-200 text-blue-600"}`,
    dropdown: `min-w-40 rounded-lg shadow-lg py-1 ${dark ? "bg-gray-800 border border-blue-800" : "bg-white border border-blue-200"}`,
    dropdownItem: `flex items-center gap-2 px-3 py-2 text-sm cursor-pointer w-full text-left bg-transparent border-none ${dark ? "text-blue-300 hover:bg-blue-900" : "text-blue-700 hover:bg-blue-50"}`,
  },
  card: `rounded-2xl border p-5 ${dark ? "border-white/[0.06] bg-linear-to-br from-white/[0.03] to-white/[0.01]" : "border-gray-200 bg-white shadow-sm shadow-gray-900/[0.04]"}`,
  kbd: `px-2 py-1 rounded-md text-[11px] font-mono min-w-[2.5rem] text-center font-medium ${dark ? "bg-gray-900 border border-white/10 text-gray-300 shadow-sm" : "bg-white border border-gray-200 text-gray-600 shadow-sm"}`,
  label: `text-xs font-medium ${dark ? "text-gray-500" : "text-gray-400"}`,
  note: `mt-3 p-3 rounded-lg text-xs ${dark ? "bg-blue-900/20 border border-blue-800/50 text-blue-300" : "bg-blue-50 border border-blue-200 text-blue-700"}`,
});

// ─── Demo ────────────────────────────────────────────────────────────────────

const BreadcrumbDemo = () => {
  const { isDarkMode: dark } = useTheme();
  const c = getClasses(dark);
  const [clickedItem, setClickedItem] = useState<string | null>(null);

  const handleItemClick = useCallback((item: BreadcrumbItem) => {
    setClickedItem(item.label);
    setTimeout(() => setClickedItem(null), 2000);
  }, []);

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
            Breadcrumb
          </h1>
          <p
            className={`text-sm leading-relaxed max-w-2xl ${dark ? "text-gray-400" : "text-gray-600"}`}
          >
            A navigation component that shows the user&apos;s current location
            in a hierarchical structure. Supports truncation with an accessible
            ellipsis dropdown, icons, tooltips, links, disabled items, custom
            separators, and full keyboard navigation.
          </p>
          <div className="mt-5">
            <pre className={`p-3.5 rounded-xl text-[13px] leading-relaxed overflow-x-auto ${dark ? "bg-linear-to-br from-gray-800 to-gray-900 text-gray-300 border border-white/6" : "bg-gray-50 text-gray-700 border border-gray-200"}`}>
              <code>{`import { Breadcrumb } from "@chumlab/ui/breadcrumb";`}</code>
            </pre>
          </div>
        </div>
      </header>

      {/* ─── Basic Usage ────────────────────────────────────────────────── */}
      <Section
        title="Basic Usage"
        description="Standard breadcrumb trail with default chevron separators."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          {/* Basic usage — works out-of-the-box with built-in styles */}
          <Breadcrumb
            items={basicItems}
            onItemClick={handleItemClick}
          />
        </DemoWrapper>
      </Section>

      {/* ─── Truncation ─────────────────────────────────────────────────── */}
      <Section
        title="Truncation (maxVisibleItems)"
        description="When items exceed maxVisibleItems, middle items collapse into an accessible dropdown."
        isDarkMode={dark}
      >
        <div className="space-y-4">
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>
              maxVisibleItems=3
            </p>
            <DemoWrapper isDarkMode={dark} layout="block">
              <Breadcrumb
                items={longItems}
                maxVisibleItems={3}
                classes={{
                  ...c.breadcrumb,
                  ellipsisButton: c.breadcrumb.ellipsisButton,
                  dropdown: c.breadcrumb.dropdown,
                  dropdownItem: c.breadcrumb.dropdownItem,
                }}
                onItemClick={handleItemClick}
              />
            </DemoWrapper>
          </div>
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>
              maxVisibleItems=4
            </p>
            <DemoWrapper isDarkMode={dark} layout="block">
              <Breadcrumb
                items={longItems}
                maxVisibleItems={4}
                classes={{
                  ...c.breadcrumb,
                  ellipsisButton: c.breadcrumb.ellipsisButton,
                  dropdown: c.breadcrumb.dropdown,
                  dropdownItem: c.breadcrumb.dropdownItem,
                }}
                onItemClick={handleItemClick}
              />
            </DemoWrapper>
          </div>
        </div>
        <div className={c.note}>
          Click the ellipsis or press <kbd className={c.kbd}>Enter</kbd> /{" "}
          <kbd className={c.kbd}>Space</kbd> to open, then use{" "}
          <kbd className={c.kbd}>↓</kbd> <kbd className={c.kbd}>↑</kbd> to
          navigate.
        </div>
      </Section>

      {/* ─── Icons ──────────────────────────────────────────────────────── */}
      <Section
        title="With Icons"
        description="Items can have icons (defaults to left position). Use iconPosition to control placement."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <Breadcrumb
            items={itemsWithIcons}
            classes={{ ...c.breadcrumb, icon: c.breadcrumb.icon }}
            onItemClick={handleItemClick}
          />
        </DemoWrapper>
      </Section>

      {/* ─── Icons + Truncation ─────────────────────────────────────────── */}
      <Section
        title="Icons + Truncation"
        description="Icons are preserved in both visible items and the collapsed dropdown."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <Breadcrumb
            items={[
              {
                id: "home",
                label: "Home",
                icon: <HomeIcon className="w-4 h-4" />,
              },
              {
                id: "l1",
                label: "Level 1",
                icon: <FolderIcon className="w-4 h-4" />,
              },
              {
                id: "l2",
                label: "Level 2",
                icon: <FolderIcon className="w-4 h-4" />,
              },
              {
                id: "l3",
                label: "Level 3",
                icon: <FolderIcon className="w-4 h-4" />,
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
              ...c.breadcrumb,
              ellipsisButton: c.breadcrumb.ellipsisButton,
              dropdown: c.breadcrumb.dropdown,
              dropdownItem: c.breadcrumb.dropdownItem,
              icon: c.breadcrumb.icon,
            }}
            onItemClick={handleItemClick}
          />
        </DemoWrapper>
      </Section>

      {/* ─── Custom Content ─────────────────────────────────────────────── */}
      <Section
        title="Custom Content"
        description="Use the content property to render custom ReactNode instead of plain label text."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <Breadcrumb
            items={[
              { id: "home", label: "Home" },
              {
                id: "status",
                label: "Status",
                content: (
                  <span className="flex items-center gap-1.5">
                    Status{" "}
                    <span
                      className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium ${dark ? "bg-green-900 text-green-300" : "bg-green-100 text-green-700"}`}
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
                    Details{" "}
                    <span
                      className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium ${dark ? "bg-blue-900 text-blue-300" : "bg-blue-100 text-blue-700"}`}
                    >
                      New
                    </span>
                  </span>
                ),
              },
              { id: "current", label: "Overview" },
            ]}
            classes={c.breadcrumb}
            onItemClick={handleItemClick}
          />
        </DemoWrapper>
      </Section>

      {/* ─── Links ──────────────────────────────────────────────────────── */}
      <Section
        title="With Links"
        description="Items with href render as anchor elements. onClick/onItemClick prevents default navigation."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <Breadcrumb
            items={itemsWithLinks}
            classes={{ ...c.breadcrumb, link: c.breadcrumb.link }}
            onItemClick={handleItemClick}
          />
        </DemoWrapper>
      </Section>

      {/* ─── Per-Item Click ─────────────────────────────────────────────── */}
      <Section
        title="Per-Item Click Handlers"
        description="Individual items can define their own onClick in addition to the global onItemClick."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
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
            classes={c.breadcrumb}
            onItemClick={handleItemClick}
          />
        </DemoWrapper>
        {clickedItem && (
          <p
            className={`text-sm mt-2 ${dark ? "text-blue-400" : "text-blue-600"}`}
          >
            Clicked: {clickedItem}
          </p>
        )}
      </Section>

      {/* ─── Tooltips ───────────────────────────────────────────────────── */}
      <Section
        title="Tooltips"
        description="Hover to see tooltips. Configurable globally and per-item via tooltipProps."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <Breadcrumb
            items={itemsWithTooltips}
            showTooltips
            tooltipPosition="bottom"
            classes={{ ...c.breadcrumb, icon: c.breadcrumb.icon }}
            onItemClick={handleItemClick}
          />
        </DemoWrapper>
      </Section>

      {/* ─── Ellipsis Tooltip ───────────────────────────────────────────── */}
      <Section
        title="Ellipsis Tooltip"
        description="The ellipsis button can have its own tooltip."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <Breadcrumb
            items={longItems}
            maxVisibleItems={3}
            showTooltips
            ellipsisTooltip="Show hidden items"
            ellipsisTooltipProps={{ side: "top", delayDuration: 200 }}
            classes={{
              ...c.breadcrumb,
              ellipsisButton: c.breadcrumb.ellipsisButton,
              dropdown: c.breadcrumb.dropdown,
              dropdownItem: c.breadcrumb.dropdownItem,
            }}
            onItemClick={handleItemClick}
          />
        </DemoWrapper>
      </Section>

      {/* ─── Disabled Items ─────────────────────────────────────────────── */}
      <Section
        title="Disabled Items"
        description="Disabled items are non-interactive, skipped in dropdown keyboard nav, and receive aria-disabled."
        isDarkMode={dark}
      >
        <div className="space-y-4">
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>
              Inline disabled
            </p>
            <DemoWrapper isDarkMode={dark} layout="block">
              <Breadcrumb
                items={itemsWithDisabled}
                classes={{
                  ...c.breadcrumb,
                  itemDisabled: c.breadcrumb.itemDisabled,
                }}
                onItemClick={handleItemClick}
              />
            </DemoWrapper>
          </div>
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>
              Disabled in dropdown
            </p>
            <DemoWrapper isDarkMode={dark} layout="block">
              <Breadcrumb
                items={[
                  { id: "home", label: "Home" },
                  { id: "archived", label: "Archived Section", disabled: true },
                  { id: "legacy", label: "Legacy Docs", disabled: true },
                  { id: "guides", label: "Guides" },
                  { id: "components", label: "Components" },
                  { id: "breadcrumb", label: "Breadcrumb" },
                ]}
                maxVisibleItems={3}
                classes={{
                  ...c.breadcrumb,
                  ellipsisButton: c.breadcrumb.ellipsisButton,
                  dropdown: c.breadcrumb.dropdown,
                  dropdownItem: c.breadcrumb.dropdownItem,
                  dropdownItemDisabled: c.breadcrumb.dropdownItemDisabled,
                }}
                onItemClick={handleItemClick}
              />
            </DemoWrapper>
          </div>
        </div>
      </Section>

      {/* ─── Dropdown Position ──────────────────────────────────────────── */}
      <Section
        title="Dropdown Position"
        description="Control the ellipsis dropdown placement: top, bottom, left, right."
        isDarkMode={dark}
      >
        <div className="space-y-4">
          {(["top", "bottom", "left", "right"] as const).map((pos) => (
            <div key={pos}>
              <p className={`text-xs font-medium mb-2 ${c.label}`}>
                dropdownPosition=&quot;{pos}&quot;
              </p>
              <DemoWrapper isDarkMode={dark} layout="block">
                <Breadcrumb
                  items={longItems}
                  maxVisibleItems={3}
                  dropdownPosition={pos}
                  classes={{
                    ...c.breadcrumb,
                    ellipsisButton: c.breadcrumb.ellipsisButton,
                    dropdown: c.breadcrumb.dropdown,
                    dropdownItem: c.breadcrumb.dropdownItem,
                  }}
                  onItemClick={handleItemClick}
                />
              </DemoWrapper>
            </div>
          ))}
        </div>
        <div className={c.note}>
          The dropdown renders via a React Portal into document.body, so it is
          never clipped by overflow:hidden ancestors.
        </div>
      </Section>

      {/* ─── Custom Separator ───────────────────────────────────────────── */}
      <Section
        title="Custom Separator"
        description="Replace the default chevron with any ReactNode or a custom icon component."
        isDarkMode={dark}
      >
        <div className="space-y-4">
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>
              String separator &quot;/&quot;
            </p>
            <DemoWrapper isDarkMode={dark} layout="block">
              <Breadcrumb
                items={basicItems}
                separator={
                  <span className={dark ? "text-gray-600" : "text-gray-400"}>
                    /
                  </span>
                }
                classes={c.breadcrumb}
                onItemClick={handleItemClick}
              />
            </DemoWrapper>
          </div>
          <div>
            <p className={`text-xs font-medium mb-2 ${c.label}`}>
              Arrow icon (separatorIcon prop)
            </p>
            <DemoWrapper isDarkMode={dark} layout="block">
              <Breadcrumb
                items={basicItems}
                separatorIcon={ArrowIcon}
                classes={c.breadcrumb}
                onItemClick={handleItemClick}
              />
            </DemoWrapper>
          </div>
        </div>
      </Section>

      {/* ─── Icon Size ──────────────────────────────────────────────────── */}
      <Section
        title="Icon Size"
        description="Control separator and ellipsis icon size via iconSize prop."
        isDarkMode={dark}
      >
        <div className="space-y-4">
          {[12, 16, 20].map((size) => (
            <div key={size}>
              <p className={`text-xs font-medium mb-2 ${c.label}`}>
                iconSize={size}
              </p>
              <DemoWrapper isDarkMode={dark} layout="block">
                <Breadcrumb
                  items={longItems}
                  maxVisibleItems={3}
                  iconSize={size}
                  classes={{
                    ...c.breadcrumb,
                    ellipsisButton: c.breadcrumb.ellipsisButton,
                    dropdown: c.breadcrumb.dropdown,
                    dropdownItem: c.breadcrumb.dropdownItem,
                  }}
                  onItemClick={handleItemClick}
                />
              </DemoWrapper>
            </div>
          ))}
        </div>
      </Section>

      {/* ─── Pill Style ─────────────────────────────────────────────────── */}
      <Section
        title="Pill Style"
        description="Pill-shaped breadcrumb items with gradient active state using the classes prop."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <Breadcrumb
            items={longItems}
            maxVisibleItems={4}
            classes={{ ...c.pill, icon: "shrink-0" }}
            onItemClick={handleItemClick}
          />
        </DemoWrapper>
      </Section>

      {/* ─── Colored Theme ──────────────────────────────────────────────── */}
      <Section
        title="Colored Theme"
        description="Blue-themed breadcrumb with a container background via classes.root."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <Breadcrumb
            items={basicItems}
            classes={c.colored}
            onItemClick={handleItemClick}
          />
        </DemoWrapper>
      </Section>

      {/* ─── Combined ───────────────────────────────────────────────────── */}
      <Section
        title="Combined: Tooltips + Icons + Truncation"
        description="A full-featured example."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <Breadcrumb
            items={[
              {
                id: "home",
                label: "Home",
                tooltip: "Go to homepage",
                icon: <HomeIcon className="w-4 h-4" />,
              },
              {
                id: "l1",
                label: "Projects",
                tooltip: "View all projects",
                icon: <FolderIcon className="w-4 h-4" />,
              },
              {
                id: "l2",
                label: "Web Development",
                tooltip: "Web projects",
                icon: <FolderIcon className="w-4 h-4" />,
              },
              {
                id: "l3",
                label: "React Applications",
                tooltip: "React projects",
                icon: <FolderIcon className="w-4 h-4" />,
              },
              {
                id: "l4",
                label: "Component Library",
                tooltip: "UI library",
                icon: <FolderIcon className="w-4 h-4" />,
              },
              {
                id: "current",
                label: "Breadcrumb",
                tooltip: "Currently viewing",
                tooltipProps: { side: "bottom" },
                icon: <DocumentIcon className="w-4 h-4" />,
                iconPosition: "right",
              },
            ]}
            maxVisibleItems={3}
            showTooltips
            ellipsisTooltip="Show 3 hidden items"
            defaultTooltipProps={{ delayDuration: 150 }}
            classes={{
              ...c.colored,
              icon: "shrink-0",
              ellipsisButton: c.colored.ellipsisButton,
              dropdown: c.colored.dropdown,
              dropdownItem: c.colored.dropdownItem,
            }}
            onItemClick={handleItemClick}
          />
        </DemoWrapper>
      </Section>

      {/* ─── Unstyled ───────────────────────────────────────────────────── */}
      <Section
        title="Unstyled Mode"
        description="Set unstyled=true to strip all default classes. Build your own styles from scratch."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          {/* Truly unstyled — no classes, bare HTML structure */}
          <Breadcrumb items={basicItems} unstyled onItemClick={handleItemClick} />
        </DemoWrapper>
      </Section>

      {/* ─── Dropdown Open Change ───────────────────────────────────────── */}
      <Section
        title="onDropdownOpenChange"
        description="Callback that fires whenever the ellipsis dropdown opens or closes."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <Breadcrumb
            items={longItems}
            maxVisibleItems={3}
            classes={{
              ...c.breadcrumb,
              ellipsisButton: c.breadcrumb.ellipsisButton,
              dropdown: c.breadcrumb.dropdown,
              dropdownItem: c.breadcrumb.dropdownItem,
            }}
            onItemClick={handleItemClick}
            onDropdownOpenChange={(open) => {
              setClickedItem(open ? "Dropdown opened" : "Dropdown closed");
              setTimeout(() => setClickedItem(null), 2000);
            }}
          />
        </DemoWrapper>
        {clickedItem && (
          <p
            className={`text-sm mt-2 ${dark ? "text-blue-400" : "text-blue-600"}`}
          >
            {clickedItem}
          </p>
        )}
      </Section>

      {/* ─── Props Table ────────────────────────────────────────────────── */}
      <Section title="BreadcrumbProps" isDarkMode={dark}>
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow
              name="items"
              type="BreadcrumbItem[]"
              defaultVal="required"
              description="Array of breadcrumb items"
              isDarkMode={dark}
            />
            <PropRow
              name="maxVisibleItems"
              type="number"
              defaultVal="4"
              description="Max items before truncation (minimum 2)"
              isDarkMode={dark}
            />
            <PropRow
              name="separator"
              type="ReactNode"
              defaultVal="ChevronRight"
              description="Custom separator between items"
              isDarkMode={dark}
            />
            <PropRow
              name="separatorIcon"
              type="ComponentType"
              defaultVal="ChevronRightIcon"
              description="Custom separator icon component"
              isDarkMode={dark}
            />
            <PropRow
              name="ellipsisIcon"
              type="ComponentType"
              defaultVal="EllipsisIcon"
              description="Custom ellipsis icon component"
              isDarkMode={dark}
            />
            <PropRow
              name="onItemClick"
              type="(item) => void"
              description="Callback when any item is clicked"
              isDarkMode={dark}
            />
            <PropRow
              name="onDropdownOpenChange"
              type="(open: boolean) => void"
              description="Callback when dropdown opens/closes"
              isDarkMode={dark}
            />
            <PropRow
              name="classes"
              type="BreadcrumbClasses"
              description="Class overrides for all 13 internal elements"
              isDarkMode={dark}
            />
            <PropRow
              name="unstyled"
              type="boolean"
              defaultVal="false"
              description="Strip all default classes"
              isDarkMode={dark}
            />
            <PropRow
              name="className"
              type="string"
              description="Additional class on root (merged with classes.root)"
              isDarkMode={dark}
            />
            <PropRow
              name="style"
              type="CSSProperties"
              description="Inline styles on root"
              isDarkMode={dark}
            />
            <PropRow
              name="aria-label"
              type="string"
              defaultVal='"Breadcrumb"'
              description="Accessible label for the nav landmark"
              isDarkMode={dark}
            />
            <PropRow
              name="iconSize"
              type="number | string"
              defaultVal="16"
              description="Size for separator/ellipsis icons"
              isDarkMode={dark}
            />
            <PropRow
              name="showTooltips"
              type="boolean"
              defaultVal="true"
              description="Enable tooltips on items"
              isDarkMode={dark}
            />
            <PropRow
              name="tooltipPosition"
              type="TooltipSide"
              defaultVal='"bottom"'
              description="Default tooltip position"
              isDarkMode={dark}
            />
            <PropRow
              name="tooltipOffset"
              type="number"
              defaultVal="4"
              description="Tooltip offset in px"
              isDarkMode={dark}
            />
            <PropRow
              name="defaultTooltipProps"
              type="BreadcrumbTooltipProps"
              description="Default config for all tooltips"
              isDarkMode={dark}
            />
            <PropRow
              name="ellipsisTooltip"
              type="ReactNode"
              description="Tooltip content for ellipsis button"
              isDarkMode={dark}
            />
            <PropRow
              name="ellipsisTooltipProps"
              type="BreadcrumbTooltipProps"
              description="Tooltip config for ellipsis button"
              isDarkMode={dark}
            />
            <PropRow
              name="dropdownPosition"
              type='"top"|"bottom"|"left"|"right"'
              defaultVal='"top"'
              description="Dropdown position relative to ellipsis"
              isDarkMode={dark}
            />
            <PropRow
              name="dropdownZIndex"
              type="number"
              defaultVal="50"
              description="z-index of the dropdown portal"
              isDarkMode={dark}
            />
            <PropRow
              name="portalContainer"
              type="HTMLElement | null"
              defaultVal="document.body"
              description="Container for dropdown portal"
              isDarkMode={dark}
            />
            <PropRow
              name="ellipsisAriaLabel"
              type="string"
              defaultVal='"Show collapsed..."'
              description="Accessible label for ellipsis button"
              isDarkMode={dark}
            />
          </PropsTable>
        </div>
      </Section>

      <Section title="BreadcrumbItem" isDarkMode={dark}>
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow
              name="id"
              type="string"
              defaultVal="required"
              description="Unique identifier"
              isDarkMode={dark}
            />
            <PropRow
              name="label"
              type="string"
              defaultVal="required"
              description="Display text"
              isDarkMode={dark}
            />
            <PropRow
              name="href"
              type="string"
              description="Link URL (renders as <a>)"
              isDarkMode={dark}
            />
            <PropRow
              name="onClick"
              type="() => void"
              description="Per-item click handler"
              isDarkMode={dark}
            />
            <PropRow
              name="icon"
              type="ReactNode"
              description="Icon element"
              isDarkMode={dark}
            />
            <PropRow
              name="iconPosition"
              type='"left"|"right"'
              defaultVal='"left"'
              description="Icon position relative to label"
              isDarkMode={dark}
            />
            <PropRow
              name="disabled"
              type="boolean"
              description="Disable this item"
              isDarkMode={dark}
            />
            <PropRow
              name="content"
              type="ReactNode"
              description="Custom content instead of label"
              isDarkMode={dark}
            />
            <PropRow
              name="tooltip"
              type="ReactNode"
              description="Tooltip content"
              isDarkMode={dark}
            />
            <PropRow
              name="tooltipProps"
              type="BreadcrumbTooltipProps"
              description="Tooltip config override for this item"
              isDarkMode={dark}
            />
          </PropsTable>
        </div>
      </Section>

      <Section title="BreadcrumbClasses" isDarkMode={dark}>
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow
              name="root"
              type="string"
              description="Root container (nav element)"
              isDarkMode={dark}
            />
            <PropRow
              name="list"
              type="string"
              description="Breadcrumb list (ol element)"
              isDarkMode={dark}
            />
            <PropRow
              name="item"
              type="string"
              description="Non-active breadcrumb item"
              isDarkMode={dark}
            />
            <PropRow
              name="itemActive"
              type="string"
              description="Current/last breadcrumb item"
              isDarkMode={dark}
            />
            <PropRow
              name="itemDisabled"
              type="string"
              description="Disabled breadcrumb item"
              isDarkMode={dark}
            />
            <PropRow
              name="link"
              type="string"
              description="Item rendered as anchor (has href)"
              isDarkMode={dark}
            />
            <PropRow
              name="separator"
              type="string"
              description="Separator element"
              isDarkMode={dark}
            />
            <PropRow
              name="icon"
              type="string"
              description="Icon wrapper"
              isDarkMode={dark}
            />
            <PropRow
              name="ellipsis"
              type="string"
              description="Ellipsis container (li)"
              isDarkMode={dark}
            />
            <PropRow
              name="ellipsisButton"
              type="string"
              description="Ellipsis trigger button"
              isDarkMode={dark}
            />
            <PropRow
              name="dropdown"
              type="string"
              description="Dropdown menu container"
              isDarkMode={dark}
            />
            <PropRow
              name="dropdownItem"
              type="string"
              description="Dropdown menu item"
              isDarkMode={dark}
            />
            <PropRow
              name="dropdownItemDisabled"
              type="string"
              description="Disabled dropdown item"
              isDarkMode={dark}
            />
          </PropsTable>
        </div>
      </Section>

      {/* ─── Data Attributes ──────────────────────────────────────────── */}
      <Section
        title="Data Attributes"
        description="Use these for CSS-based state styling."
        isDarkMode={dark}
      >
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow
              name="data-state"
              type="item, dropdown"
              description='"active" | "inactive" | "open"'
              isDarkMode={dark}
            />
            <PropRow
              name="data-disabled"
              type="item, dropdown item"
              description="Present when disabled"
              isDarkMode={dark}
            />
            <PropRow
              name="data-truncated"
              type="root (nav)"
              description="Present when items are truncated"
              isDarkMode={dark}
            />
            <PropRow
              name="data-dropdown-open"
              type="root (nav)"
              description="Present when dropdown is open"
              isDarkMode={dark}
            />
            <PropRow
              name="data-clickable"
              type="item (button)"
              description="Present when item has a click handler"
              isDarkMode={dark}
            />
            <PropRow
              name="data-position"
              type="dropdown (portal)"
              description='"top" | "bottom" | "left" | "right"'
              isDarkMode={dark}
            />
          </PropsTable>
        </div>
      </Section>

      {/* ─── Accessibility ────────────────────────────────────────────── */}
      <Section
        title="Accessibility"
        description="WAI-ARIA breadcrumb and menu pattern compliance."
        isDarkMode={dark}
      >
        <div className={c.card}>
          <div
            className={`space-y-2 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
          >
            {[
              "Semantic <nav> element with aria-label for landmark navigation",
              "Ordered list <ol> communicates hierarchy to assistive technologies",
              'Current page marked with aria-current="page"',
              'Separators hidden via aria-hidden="true" and role="presentation"',
              'Icons wrapped with aria-hidden="true" (decorative)',
              'Ellipsis button uses aria-expanded, aria-haspopup="menu", and aria-label',
              'Dropdown implements role="menu" with role="menuitem" items',
              "Disabled items receive aria-disabled and are skipped in keyboard navigation",
              "Focus auto-moves to first enabled menu item when dropdown opens",
              "Focus restores to ellipsis button when dropdown closes via Escape",
              "Dropdown closes on focus leaving, scroll, click outside, and Escape (document level)",
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
              ["Tab", "Navigate between items and ellipsis button"],
              ["Enter / Space", "Activate item or toggle dropdown"],
              ["Arrow Down", "Open dropdown / move to next menu item"],
              ["Arrow Up", "Move to previous menu item"],
              ["Home", "Move to first menu item"],
              ["End", "Move to last menu item"],
              ["Escape", "Close dropdown, restore focus to trigger"],
            ].map(([key, desc]) => (
              <div key={key} className="flex items-center gap-3">
                <kbd className={c.kbd}>{key}</kbd>
                <span>{desc}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <DocControlledPattern
        isDarkMode={dark}
        summary="Trail state is defined by the `items` you pass; the component does not fetch routes. Control truncation and overflow menus from your router data."
      />
      <DocEdgeCases
        isDarkMode={dark}
        items={[
          "Very deep trails may need truncation—test ellipsis and overflow menu with real locales.",
          "Dynamic segments should use stable keys for focus management when items update.",
          "Long titles in narrow layouts: verify wrapping vs truncation against design specs.",
        ]}
      />
      <DocDoDont
        isDarkMode={dark}
        dos={[
          "Mark the current page with `current` / `aria-current` semantics via props.",
          "Keep the trail in sync with the router; avoid stale crumbs after navigation.",
          "Provide a nav label (`aria-label` on the root) when multiple landmarks exist.",
        ]}
        donts={[
          "Do not use breadcrumbs as the only navigation for essential tasks.",
          "Do not omit keyboard access to overflow or ellipsis actions.",
          "Do not render duplicate links to the same destination without clear reason.",
        ]}
      />
    </div>
  );
};

export default BreadcrumbDemo;
