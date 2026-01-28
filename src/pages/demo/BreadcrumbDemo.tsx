import { useCallback } from "react";
import { Breadcrumb } from "../../components/Breadcrumb";
import type { BreadcrumbItem } from "../../components/Breadcrumb";
import { Section, ComponentHeader } from "./components";

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

const itemsWithLongLabels: BreadcrumbItem[] = [
  { id: "home", label: "Home", tooltip: "Navigate to home" },
  {
    id: "category",
    label: "Enterprise Resource Planning",
    tooltip: "Enterprise Resource Planning (ERP) - Complete business management solution",
  },
  {
    id: "module",
    label: "Human Resources Management",
    tooltip: "Human Resources Management Module",
  },
  {
    id: "current",
    label: "Employee Performance Reviews",
    tooltip: "Current page: Employee Performance Reviews Dashboard",
  },
];

const containerStyle = "";
const listStyle = "flex items-center gap-1";
const itemStyle =
  "flex items-center gap-1 px-2 py-1 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 cursor-pointer rounded transition-colors bg-transparent border-none";
const activeItemStyle =
  "flex items-center gap-1 px-2 py-1 text-sm text-gray-900 font-medium bg-transparent border-none cursor-default";
const separatorStyle = "text-gray-400";
const ellipsisStyle = "";
const ellipsisButtonStyle =
  "flex items-center justify-center w-8 h-8 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors cursor-pointer";
const ellipsisDropdownStyle =
  "absolute top-full left-0 mt-1 min-w-40 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50";
const ellipsisDropdownItemStyle =
  "flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed";
const iconStyle = "shrink-0";
const linkStyle =
  "flex items-center gap-1 px-2 py-1 text-sm text-blue-600 hover:text-blue-800 hover:underline rounded transition-colors";

const darkContainerStyle = "bg-gray-900 p-4 rounded-lg";
const darkListStyle = "flex items-center gap-1";
const darkItemStyle =
  "flex items-center gap-1 px-2 py-1 text-sm text-gray-400 hover:text-gray-200 hover:bg-gray-800 cursor-pointer rounded transition-colors bg-transparent border-none";
const darkActiveItemStyle =
  "flex items-center gap-1 px-2 py-1 text-sm text-white font-medium bg-transparent border-none cursor-default";
const darkSeparatorStyle = "text-gray-600";
const darkEllipsisButtonStyle =
  "flex items-center justify-center w-8 h-8 rounded-md bg-gray-800 hover:bg-gray-700 text-gray-400 transition-colors cursor-pointer";
const darkEllipsisDropdownStyle =
  "absolute top-full left-0 mt-1 min-w-40 bg-gray-800 border border-gray-700 rounded-lg shadow-lg py-1 z-50";
const darkEllipsisDropdownItemStyle =
  "flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 cursor-pointer";

const coloredContainerStyle = "bg-blue-50 p-4 rounded-lg";
const coloredListStyle = "flex items-center gap-1";
const coloredItemStyle =
  "flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-100 cursor-pointer rounded-full transition-colors bg-transparent border-none";
const coloredActiveItemStyle =
  "flex items-center gap-1 px-3 py-1.5 text-sm text-white font-medium bg-blue-600 rounded-full border-none cursor-default";
const coloredSeparatorStyle = "text-blue-300";
const coloredEllipsisButtonStyle =
  "flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 transition-colors cursor-pointer";
const coloredEllipsisDropdownStyle =
  "absolute top-full left-0 mt-1 min-w-40 bg-white border border-blue-200 rounded-lg shadow-lg py-1 z-50";
const coloredEllipsisDropdownItemStyle =
  "flex items-center gap-2 px-3 py-2 text-sm text-blue-700 hover:bg-blue-50 cursor-pointer";

const gradientContainerStyle =
  "bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-4 rounded-lg";
const gradientListStyle = "flex items-center gap-1";
const gradientItemStyle =
  "flex items-center gap-1 px-3 py-1.5 text-sm text-white/80 hover:text-white hover:bg-white/10 cursor-pointer rounded-lg transition-colors bg-transparent border-none";
const gradientActiveItemStyle =
  "flex items-center gap-1 px-3 py-1.5 text-sm text-purple-900 font-medium bg-white rounded-lg border-none cursor-default";
const gradientSeparatorStyle = "text-white/50";
const gradientEllipsisButtonStyle =
  "flex items-center justify-center w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer";
const gradientEllipsisDropdownStyle =
  "absolute top-full left-0 mt-1 min-w-40 bg-white border border-purple-200 rounded-lg shadow-lg py-1 z-50";
const gradientEllipsisDropdownItemStyle =
  "flex items-center gap-2 px-3 py-2 text-sm text-purple-700 hover:bg-purple-50 cursor-pointer";

const greenContainerStyle =
  "bg-gradient-to-r from-emerald-400 to-cyan-400 p-4 rounded-lg";
const greenListStyle = "flex items-center gap-2";
const greenItemStyle =
  "flex items-center gap-1 px-3 py-1.5 text-sm text-emerald-900/70 hover:text-emerald-900 hover:bg-white/30 cursor-pointer rounded-md transition-colors bg-transparent border-none";
const greenActiveItemStyle =
  "flex items-center gap-1 px-3 py-1.5 text-sm text-emerald-900 font-semibold bg-white/80 rounded-md border-none cursor-default shadow-sm";
const greenSeparatorStyle = "text-emerald-900/40";
const greenEllipsisButtonStyle =
  "flex items-center justify-center w-8 h-8 rounded-md bg-white/30 hover:bg-white/50 text-emerald-900 transition-colors cursor-pointer";
const greenEllipsisDropdownStyle =
  "absolute top-full left-0 mt-1 min-w-40 bg-white border border-emerald-200 rounded-lg shadow-lg py-1 z-50";
const greenEllipsisDropdownItemStyle =
  "flex items-center gap-2 px-3 py-2 text-sm text-emerald-700 hover:bg-emerald-50 cursor-pointer";

const pillContainerStyle = "bg-gray-100 p-4 rounded-lg";
const pillListStyle = "flex items-center gap-2";
const pillItemStyle =
  "flex items-center gap-1 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-50 cursor-pointer rounded-full transition-all border border-gray-200 hover:border-gray-300 hover:shadow-sm";
const pillActiveItemStyle =
  "flex items-center gap-1 px-4 py-2 text-sm text-white font-medium bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full border-none cursor-default shadow-md";
const pillSeparatorStyle = "text-gray-300";
const pillEllipsisButtonStyle =
  "flex items-center justify-center w-10 h-10 rounded-full bg-white hover:bg-gray-50 text-gray-500 border border-gray-200 hover:border-gray-300 transition-all cursor-pointer hover:shadow-sm";
const pillEllipsisDropdownStyle =
  "absolute top-full left-0 mt-1 min-w-40 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50";
const pillEllipsisDropdownItemStyle =
  "flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer";

const minimalEllipsisButtonStyle =
  "flex items-center justify-center w-7 h-7 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all cursor-pointer";
const minimalEllipsisDropdownStyle =
  "absolute top-full left-0 mt-1.5 min-w-44 bg-white rounded-xl shadow-lg shadow-gray-200/50 border border-gray-100 py-1.5 z-50";
const minimalEllipsisDropdownItemStyle =
  "flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 cursor-pointer transition-colors";

const glassEllipsisButtonStyle =
  "flex items-center justify-center w-8 h-8 rounded-lg bg-white/60 backdrop-blur-sm hover:bg-white/80 text-gray-600 hover:text-gray-900 border border-white/50 shadow-sm transition-all cursor-pointer";
const glassEllipsisDropdownStyle =
  "absolute top-full left-0 mt-2 min-w-48 bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl shadow-black/5 border border-white/60 py-2 z-50";
const glassEllipsisDropdownItemStyle =
  "flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-white/60 cursor-pointer transition-colors mx-1 rounded-lg";

const softEllipsisButtonStyle =
  "flex items-center justify-center w-8 h-8 rounded-full bg-violet-50 hover:bg-violet-100 text-violet-500 hover:text-violet-600 transition-all cursor-pointer";
const softEllipsisDropdownStyle =
  "absolute top-full left-0 mt-2 min-w-44 bg-white rounded-2xl shadow-xl shadow-violet-100/50 border border-violet-50 py-2 z-50";
const softEllipsisDropdownItemStyle =
  "flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 hover:text-violet-700 hover:bg-violet-50 cursor-pointer transition-colors mx-1.5 rounded-xl";

const darkModernEllipsisButtonStyle =
  "flex items-center justify-center w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-all cursor-pointer";
const darkModernEllipsisDropdownStyle =
  "absolute top-full left-0 mt-2 min-w-48 bg-gray-900 rounded-xl shadow-2xl shadow-black/20 border border-gray-800 py-1.5 z-50";
const darkModernEllipsisDropdownItemStyle =
  "flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-gray-800 cursor-pointer transition-colors mx-1 rounded-lg";

const accentEllipsisButtonStyle =
  "flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/30 transition-all cursor-pointer";
const accentEllipsisDropdownStyle =
  "absolute top-full left-0 mt-2 min-w-48 bg-white rounded-xl shadow-xl shadow-gray-200/60 border border-gray-100 py-1.5 z-50";
const accentEllipsisDropdownItemStyle =
  "flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 cursor-pointer transition-colors mx-1 rounded-lg";

const BreadcrumbDemo = () => {
  const handleItemClick = useCallback((item: BreadcrumbItem) => {
    alert(`Clicked: ${item.label}`);
  }, []);

  return (
    <>
      <ComponentHeader
        title="Breadcrumb"
        description="A navigation component that shows the user's current location in a hierarchical structure."
      />

      <Section title="Basic Usage">
        <Breadcrumb
          items={basicItems}
          containerClassName={containerStyle}
          className={listStyle}
          itemClassName={itemStyle}
          activeItemClassName={activeItemStyle}
          separatorClassName={separatorStyle}
          onItemClick={handleItemClick}
        />
      </Section>

      <Section title="With Truncation (maxVisibleItems=3)">
        <Breadcrumb
          items={longItems}
          maxVisibleItems={3}
          containerClassName={containerStyle}
          className={listStyle}
          itemClassName={itemStyle}
          activeItemClassName={activeItemStyle}
          separatorClassName={separatorStyle}
          ellipsisClassName={ellipsisStyle}
          ellipsisButtonClassName={ellipsisButtonStyle}
          ellipsisDropdownClassName={ellipsisDropdownStyle}
          ellipsisDropdownItemClassName={ellipsisDropdownItemStyle}
          onItemClick={handleItemClick}
        />
        <p className="text-sm text-gray-500 mt-2">
          Shows first item, ellipsis with dropdown for collapsed items, and last
          2 items.
        </p>
      </Section>

      <Section title="With Truncation (maxVisibleItems=4)">
        <Breadcrumb
          items={longItems}
          maxVisibleItems={4}
          containerClassName={containerStyle}
          className={listStyle}
          itemClassName={itemStyle}
          activeItemClassName={activeItemStyle}
          separatorClassName={separatorStyle}
          ellipsisClassName={ellipsisStyle}
          ellipsisButtonClassName={ellipsisButtonStyle}
          ellipsisDropdownClassName={ellipsisDropdownStyle}
          ellipsisDropdownItemClassName={ellipsisDropdownItemStyle}
          onItemClick={handleItemClick}
        />
        <p className="text-sm text-gray-500 mt-2">
          Shows first item, ellipsis with dropdown for collapsed items, and last
          3 items.
        </p>
      </Section>

      <Section title="With Icons (Left Position)">
        <Breadcrumb
          items={itemsWithIcons}
          containerClassName={containerStyle}
          className={listStyle}
          itemClassName={itemStyle}
          activeItemClassName={activeItemStyle}
          separatorClassName={separatorStyle}
          iconClassName={iconStyle}
          onItemClick={handleItemClick}
        />
      </Section>

      <Section title="With Icons and Truncation">
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
          containerClassName={containerStyle}
          className={listStyle}
          itemClassName={itemStyle}
          activeItemClassName={activeItemStyle}
          separatorClassName={separatorStyle}
          ellipsisClassName={ellipsisStyle}
          ellipsisButtonClassName={ellipsisButtonStyle}
          ellipsisDropdownClassName={ellipsisDropdownStyle}
          ellipsisDropdownItemClassName={ellipsisDropdownItemStyle}
          iconClassName={iconStyle}
          onItemClick={handleItemClick}
        />
      </Section>

      <Section title="With Links">
        <Breadcrumb
          items={itemsWithLinks}
          containerClassName={containerStyle}
          className={listStyle}
          itemClassName={itemStyle}
          activeItemClassName={activeItemStyle}
          separatorClassName={separatorStyle}
          linkClassName={linkStyle}
          onItemClick={handleItemClick}
        />
      </Section>

      <Section title="With Click Handler">
        <Breadcrumb
          items={basicItems}
          containerClassName={containerStyle}
          className={listStyle}
          itemClassName={itemStyle}
          activeItemClassName={activeItemStyle}
          separatorClassName={separatorStyle}
          onItemClick={handleItemClick}
        />
        <p className="text-sm text-gray-500 mt-2">
          Click any breadcrumb item to see the click handler in action above.
        </p>
      </Section>

      <Section title="Dark Theme">
        <Breadcrumb
          items={longItems}
          maxVisibleItems={3}
          containerClassName={darkContainerStyle}
          className={darkListStyle}
          itemClassName={darkItemStyle}
          activeItemClassName={darkActiveItemStyle}
          separatorClassName={darkSeparatorStyle}
          ellipsisButtonClassName={darkEllipsisButtonStyle}
          ellipsisDropdownClassName={darkEllipsisDropdownStyle}
          ellipsisDropdownItemClassName={darkEllipsisDropdownItemStyle}
          onItemClick={handleItemClick}
        />
      </Section>

      <Section title="Colored Theme (Active Highlighted)">
        <Breadcrumb
          items={basicItems}
          containerClassName={coloredContainerStyle}
          className={coloredListStyle}
          itemClassName={coloredItemStyle}
          activeItemClassName={coloredActiveItemStyle}
          separatorClassName={coloredSeparatorStyle}
          ellipsisButtonClassName={coloredEllipsisButtonStyle}
          ellipsisDropdownClassName={coloredEllipsisDropdownStyle}
          ellipsisDropdownItemClassName={coloredEllipsisDropdownItemStyle}
          onItemClick={handleItemClick}
        />
        <p className="text-sm text-gray-500 mt-2">
          Active item has a solid blue background with white text to clearly
          indicate current page.
        </p>
      </Section>

      <Section title="Gradient Background (Purple to Red)">
        <Breadcrumb
          items={longItems}
          maxVisibleItems={3}
          containerClassName={gradientContainerStyle}
          className={gradientListStyle}
          itemClassName={gradientItemStyle}
          activeItemClassName={gradientActiveItemStyle}
          separatorClassName={gradientSeparatorStyle}
          ellipsisButtonClassName={gradientEllipsisButtonStyle}
          ellipsisDropdownClassName={gradientEllipsisDropdownStyle}
          ellipsisDropdownItemClassName={gradientEllipsisDropdownItemStyle}
          onItemClick={handleItemClick}
        />
        <p className="text-sm text-gray-500 mt-2">
          Vibrant gradient background with white items and contrasting active
          state.
        </p>
      </Section>

      <Section title="Gradient Background (Green to Cyan)">
        <Breadcrumb
          items={itemsWithIcons}
          containerClassName={greenContainerStyle}
          className={greenListStyle}
          itemClassName={greenItemStyle}
          activeItemClassName={greenActiveItemStyle}
          separatorClassName={greenSeparatorStyle}
          ellipsisButtonClassName={greenEllipsisButtonStyle}
          ellipsisDropdownClassName={greenEllipsisDropdownStyle}
          ellipsisDropdownItemClassName={greenEllipsisDropdownItemStyle}
          iconClassName={iconStyle}
          onItemClick={handleItemClick}
        />
        <p className="text-sm text-gray-500 mt-2">
          Fresh gradient with semi-transparent active state for a modern look.
        </p>
      </Section>

      <Section title="Pill Style with Gradient Active">
        <Breadcrumb
          items={longItems}
          maxVisibleItems={4}
          containerClassName={pillContainerStyle}
          className={pillListStyle}
          itemClassName={pillItemStyle}
          activeItemClassName={pillActiveItemStyle}
          separatorClassName={pillSeparatorStyle}
          ellipsisButtonClassName={pillEllipsisButtonStyle}
          ellipsisDropdownClassName={pillEllipsisDropdownStyle}
          ellipsisDropdownItemClassName={pillEllipsisDropdownItemStyle}
          onItemClick={handleItemClick}
        />
        <p className="text-sm text-gray-500 mt-2">
          Pill-shaped items with gradient active state and subtle shadows.
        </p>
      </Section>

      <Section title="Ellipsis Style Variations">
        <p className="text-sm text-gray-600 mb-6">
          Modern ellipsis button and dropdown designs. Customize shadows using
          Tailwind classes without !important.
        </p>

        <div className="space-y-8">
          <div>
            <p className="text-xs font-medium text-gray-400 mb-3">Minimal</p>
            <Breadcrumb
              items={longItems}
              maxVisibleItems={3}
              containerClassName={containerStyle}
              className={listStyle}
              itemClassName={itemStyle}
              activeItemClassName={activeItemStyle}
              separatorClassName={separatorStyle}
              ellipsisButtonClassName={minimalEllipsisButtonStyle}
              ellipsisDropdownClassName={minimalEllipsisDropdownStyle}
              ellipsisDropdownItemClassName={minimalEllipsisDropdownItemStyle}
              onItemClick={handleItemClick}
            />
          </div>

          <div className="p-5 bg-linear-to-br from-slate-50 to-gray-100 rounded-2xl">
            <p className="text-xs font-medium text-gray-400 mb-3">
              Glassmorphism
            </p>
            <Breadcrumb
              items={longItems}
              maxVisibleItems={3}
              containerClassName={containerStyle}
              className={listStyle}
              itemClassName={itemStyle}
              activeItemClassName={activeItemStyle}
              separatorClassName={separatorStyle}
              ellipsisButtonClassName={glassEllipsisButtonStyle}
              ellipsisDropdownClassName={glassEllipsisDropdownStyle}
              ellipsisDropdownItemClassName={glassEllipsisDropdownItemStyle}
              onItemClick={handleItemClick}
            />
          </div>

          <div>
            <p className="text-xs font-medium text-gray-400 mb-3">
              Soft Violet
            </p>
            <Breadcrumb
              items={longItems}
              maxVisibleItems={3}
              containerClassName={containerStyle}
              className={listStyle}
              itemClassName={itemStyle}
              activeItemClassName={activeItemStyle}
              separatorClassName={separatorStyle}
              ellipsisButtonClassName={softEllipsisButtonStyle}
              ellipsisDropdownClassName={softEllipsisDropdownStyle}
              ellipsisDropdownItemClassName={softEllipsisDropdownItemStyle}
              onItemClick={handleItemClick}
            />
          </div>

          <div className="p-5 bg-gray-950 rounded-2xl">
            <p className="text-xs font-medium text-gray-500 mb-3">
              Dark Modern
            </p>
            <Breadcrumb
              items={longItems}
              maxVisibleItems={3}
              containerClassName={containerStyle}
              className={listStyle}
              itemClassName="flex items-center gap-1 px-2 py-1 text-sm text-gray-400 hover:text-gray-200 cursor-pointer rounded transition-colors bg-transparent border-none"
              activeItemClassName="flex items-center gap-1 px-2 py-1 text-sm text-white font-medium bg-transparent border-none cursor-default"
              separatorClassName="text-gray-600"
              ellipsisButtonClassName={darkModernEllipsisButtonStyle}
              ellipsisDropdownClassName={darkModernEllipsisDropdownStyle}
              ellipsisDropdownItemClassName={
                darkModernEllipsisDropdownItemStyle
              }
              onItemClick={handleItemClick}
            />
          </div>

          <div>
            <p className="text-xs font-medium text-gray-400 mb-3">
              Accent Gradient
            </p>
            <Breadcrumb
              items={longItems}
              maxVisibleItems={3}
              containerClassName={containerStyle}
              className={listStyle}
              itemClassName={itemStyle}
              activeItemClassName={activeItemStyle}
              separatorClassName={separatorStyle}
              ellipsisButtonClassName={accentEllipsisButtonStyle}
              ellipsisDropdownClassName={accentEllipsisDropdownStyle}
              ellipsisDropdownItemClassName={accentEllipsisDropdownItemStyle}
              onItemClick={handleItemClick}
            />
          </div>
        </div>

        <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-100">
          <p className="text-xs font-medium text-gray-500 mb-3">
            Available shadow classes:
          </p>
          <div className="flex flex-wrap gap-1.5">
            <code className="px-2 py-1 bg-white rounded-md text-xs text-gray-500 border border-gray-200">
              shadow-none
            </code>
            <code className="px-2 py-1 bg-white rounded-md text-xs text-gray-500 border border-gray-200">
              shadow-sm
            </code>
            <code className="px-2 py-1 bg-white rounded-md text-xs text-gray-500 border border-gray-200">
              shadow
            </code>
            <code className="px-2 py-1 bg-white rounded-md text-xs text-gray-500 border border-gray-200">
              shadow-md
            </code>
            <code className="px-2 py-1 bg-white rounded-md text-xs text-gray-500 border border-gray-200">
              shadow-lg
            </code>
            <code className="px-2 py-1 bg-white rounded-md text-xs text-gray-500 border border-gray-200">
              shadow-xl
            </code>
            <code className="px-2 py-1 bg-white rounded-md text-xs text-gray-500 border border-gray-200">
              shadow-2xl
            </code>
          </div>
        </div>
      </Section>

      <Section title="Custom Separator">
        <Breadcrumb
          items={basicItems}
          separator={<span className="text-gray-400">/</span>}
          containerClassName={containerStyle}
          className={listStyle}
          itemClassName={itemStyle}
          activeItemClassName={activeItemStyle}
          separatorClassName={separatorStyle}
          onItemClick={handleItemClick}
        />
      </Section>

      <Section title="With Tooltips">
        <div className="w-full">
          <p className="text-sm text-gray-600 mb-4">
            Hover over each breadcrumb item to see tooltips. Tooltips are powered by the Button component's built-in tooltip support.
          </p>
          <Breadcrumb
            items={itemsWithTooltips}
            containerClassName={containerStyle}
            className={listStyle}
            itemClassName={itemStyle}
            activeItemClassName={activeItemStyle}
            separatorClassName={separatorStyle}
            iconClassName={iconStyle}
            onItemClick={handleItemClick}
          />
        </div>
      </Section>

      <Section title="Tooltips with Long Labels">
        <div className="w-full">
          <p className="text-sm text-gray-600 mb-4">
            Hover over items to see full descriptions in tooltips. Great for providing additional context.
          </p>
          <Breadcrumb
            items={itemsWithLongLabels}
            containerClassName={containerStyle}
            className={listStyle}
            itemClassName={itemStyle}
            activeItemClassName={activeItemStyle}
            separatorClassName={separatorStyle}
            onItemClick={handleItemClick}
            defaultTooltipProps={{ side: "bottom", delayDuration: 100 }}
          />
        </div>
      </Section>

      <Section title="Ellipsis with Tooltip">
        <div className="w-full">
          <p className="text-sm text-gray-600 mb-4">
            The ellipsis button can have its own tooltip to indicate what action it performs.
          </p>
          <Breadcrumb
            items={longItems}
            maxVisibleItems={3}
            containerClassName={containerStyle}
            className={listStyle}
            itemClassName={itemStyle}
            activeItemClassName={activeItemStyle}
            separatorClassName={separatorStyle}
            ellipsisClassName={ellipsisStyle}
            ellipsisButtonClassName={ellipsisButtonStyle}
            ellipsisDropdownClassName={ellipsisDropdownStyle}
            ellipsisDropdownItemClassName={ellipsisDropdownItemStyle}
            ellipsisTooltip="Show hidden items"
            ellipsisTooltipProps={{ side: "top", delayDuration: 200 }}
            onItemClick={handleItemClick}
          />
        </div>
      </Section>

      <Section title="Custom Icon Size">
        <div className="w-full">
          <p className="text-sm text-gray-600 mb-4">
            The iconSize prop controls the size of separator and ellipsis icons. Default is "w-4 h-4".
          </p>
          <div className="space-y-6">
          <div>
            <p className="text-xs font-medium text-gray-400 mb-3">Small (w-3 h-3)</p>
            <Breadcrumb
              items={longItems}
              maxVisibleItems={3}
              containerClassName={containerStyle}
              className={listStyle}
              itemClassName={itemStyle}
              activeItemClassName={activeItemStyle}
              separatorClassName={separatorStyle}
              ellipsisClassName={ellipsisStyle}
              ellipsisButtonClassName="flex items-center justify-center w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors cursor-pointer"
              ellipsisDropdownClassName={ellipsisDropdownStyle}
              ellipsisDropdownItemClassName={ellipsisDropdownItemStyle}
              iconSize="w-3 h-3"
              onItemClick={handleItemClick}
            />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400 mb-3">Default (w-4 h-4)</p>
            <Breadcrumb
              items={longItems}
              maxVisibleItems={3}
              containerClassName={containerStyle}
              className={listStyle}
              itemClassName={itemStyle}
              activeItemClassName={activeItemStyle}
              separatorClassName={separatorStyle}
              ellipsisClassName={ellipsisStyle}
              ellipsisButtonClassName={ellipsisButtonStyle}
              ellipsisDropdownClassName={ellipsisDropdownStyle}
              ellipsisDropdownItemClassName={ellipsisDropdownItemStyle}
              onItemClick={handleItemClick}
            />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400 mb-3">Large (w-5 h-5)</p>
            <Breadcrumb
              items={longItems}
              maxVisibleItems={3}
              containerClassName={containerStyle}
              className={listStyle}
              itemClassName={itemStyle}
              activeItemClassName={activeItemStyle}
              separatorClassName={separatorStyle}
              ellipsisClassName={ellipsisStyle}
              ellipsisButtonClassName="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors cursor-pointer"
              ellipsisDropdownClassName={ellipsisDropdownStyle}
              ellipsisDropdownItemClassName={ellipsisDropdownItemStyle}
              iconSize="w-5 h-5"
              onItemClick={handleItemClick}
            />
          </div>
        </div>
        </div>
      </Section>

      <Section title="Combined: Tooltips + Icons + Truncation">
        <div className="w-full">
          <p className="text-sm text-gray-600 mb-4">
            A complete example combining all features: tooltips, icons, truncation, and custom styling.
          </p>
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
              tooltip: "Currently viewing: Breadcrumb Component documentation",
              tooltipProps: { side: "bottom" },
              icon: <DocumentIcon className="w-4 h-4" />,
              iconPosition: "right",
            },
          ]}
          maxVisibleItems={3}
          containerClassName={coloredContainerStyle}
          className={coloredListStyle}
          itemClassName={coloredItemStyle}
          activeItemClassName={coloredActiveItemStyle}
          separatorClassName={coloredSeparatorStyle}
          ellipsisClassName={ellipsisStyle}
          ellipsisButtonClassName={coloredEllipsisButtonStyle}
          ellipsisDropdownClassName={coloredEllipsisDropdownStyle}
          ellipsisDropdownItemClassName={coloredEllipsisDropdownItemStyle}
          iconClassName={iconStyle}
            ellipsisTooltip="Show 3 hidden items"
            defaultTooltipProps={{ delayDuration: 150 }}
            onItemClick={handleItemClick}
          />
        </div>
      </Section>

      <Section title="Breadcrumb Props">
        <div className="overflow-x-auto w-full">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Prop
                </th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Type
                </th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Default
                </th>
                <th className="text-left py-2 font-medium text-gray-900">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">items</td>
                <td className="py-2 pr-4 text-gray-600">BreadcrumbItem[]</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  Array of breadcrumb items (required)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  maxVisibleItems
                </td>
                <td className="py-2 pr-4 text-gray-600">number</td>
                <td className="py-2 pr-4 text-gray-500">4</td>
                <td className="py-2 text-gray-600">
                  Maximum items to show before truncating
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">separator</td>
                <td className="py-2 pr-4 text-gray-600">ReactNode</td>
                <td className="py-2 pr-4 text-gray-500">ChevronRightIcon</td>
                <td className="py-2 text-gray-600">Custom separator element</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  onItemClick
                </td>
                <td className="py-2 pr-4 text-gray-600">(item) =&gt; void</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  Callback when an item is clicked
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">ariaLabel</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">"Breadcrumb"</td>
                <td className="py-2 text-gray-600">
                  Accessible label for navigation
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  SeparatorIcon
                </td>
                <td className="py-2 pr-4 text-gray-600">ComponentType</td>
                <td className="py-2 pr-4 text-gray-500">ChevronRightIcon</td>
                <td className="py-2 text-gray-600">
                  Custom separator icon component
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  EllipsisIcon
                </td>
                <td className="py-2 pr-4 text-gray-600">ComponentType</td>
                <td className="py-2 pr-4 text-gray-500">EllipsisIcon</td>
                <td className="py-2 text-gray-600">
                  Custom ellipsis icon component
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">iconSize</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">"w-4 h-4"</td>
                <td className="py-2 text-gray-600">
                  Size class for separator and ellipsis icons
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  ellipsisTooltip
                </td>
                <td className="py-2 pr-4 text-gray-600">ReactNode</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  Tooltip content for the ellipsis button
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  ellipsisTooltipProps
                </td>
                <td className="py-2 pr-4 text-gray-600">BreadcrumbTooltipProps</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  Tooltip configuration for the ellipsis button
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  defaultTooltipProps
                </td>
                <td className="py-2 pr-4 text-gray-600">BreadcrumbTooltipProps</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  Default tooltip configuration for all breadcrumb items
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="BreadcrumbItem Interface">
        <div className="overflow-x-auto w-full">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Property
                </th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Type
                </th>
                <th className="text-left py-2 font-medium text-gray-900">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">id</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 text-gray-600">
                  Unique identifier (required)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">label</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 text-gray-600">Display text (required)</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">href</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 text-gray-600">
                  Link URL (renders as anchor)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">onClick</td>
                <td className="py-2 pr-4 text-gray-600">() =&gt; void</td>
                <td className="py-2 text-gray-600">
                  Click handler for the item
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">icon</td>
                <td className="py-2 pr-4 text-gray-600">ReactNode</td>
                <td className="py-2 text-gray-600">Icon element</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  iconPosition
                </td>
                <td className="py-2 pr-4 text-gray-600">"left" | "right"</td>
                <td className="py-2 text-gray-600">Position of the icon</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">disabled</td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 text-gray-600">Disable the item</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">content</td>
                <td className="py-2 pr-4 text-gray-600">ReactNode</td>
                <td className="py-2 text-gray-600">
                  Custom content instead of label
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">tooltip</td>
                <td className="py-2 pr-4 text-gray-600">ReactNode</td>
                <td className="py-2 text-gray-600">
                  Tooltip content for this item
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  tooltipProps
                </td>
                <td className="py-2 pr-4 text-gray-600">BreadcrumbTooltipProps</td>
                <td className="py-2 text-gray-600">
                  Tooltip configuration for this item
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="BreadcrumbTooltipProps Interface">
        <div className="overflow-x-auto w-full">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Property
                </th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Type
                </th>
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Default
                </th>
                <th className="text-left py-2 font-medium text-gray-900">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">side</td>
                <td className="py-2 pr-4 text-gray-600">"top" | "right" | "bottom" | "left"</td>
                <td className="py-2 pr-4 text-gray-500">"top"</td>
                <td className="py-2 text-gray-600">
                  Tooltip position relative to item
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">align</td>
                <td className="py-2 pr-4 text-gray-600">"start" | "center" | "end"</td>
                <td className="py-2 pr-4 text-gray-500">"center"</td>
                <td className="py-2 text-gray-600">
                  Tooltip alignment
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">sideOffset</td>
                <td className="py-2 pr-4 text-gray-600">number</td>
                <td className="py-2 pr-4 text-gray-500">6</td>
                <td className="py-2 text-gray-600">
                  Offset from the item in pixels
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">maxWidth</td>
                <td className="py-2 pr-4 text-gray-600">string | number</td>
                <td className="py-2 pr-4 text-gray-500">300</td>
                <td className="py-2 text-gray-600">
                  Maximum width of tooltip
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">delayDuration</td>
                <td className="py-2 pr-4 text-gray-600">number</td>
                <td className="py-2 pr-4 text-gray-500">200</td>
                <td className="py-2 text-gray-600">
                  Delay before showing tooltip (ms)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">showArrow</td>
                <td className="py-2 pr-4 text-gray-600">boolean</td>
                <td className="py-2 pr-4 text-gray-500">true</td>
                <td className="py-2 text-gray-600">
                  Show arrow on tooltip
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">contentClassName</td>
                <td className="py-2 pr-4 text-gray-600">string</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  Custom class for tooltip content
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">contentStyle</td>
                <td className="py-2 pr-4 text-gray-600">CSSProperties</td>
                <td className="py-2 pr-4 text-gray-500">-</td>
                <td className="py-2 text-gray-600">
                  Custom style for tooltip content
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Styling Props">
        <div className="overflow-x-auto w-full">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-medium text-gray-900">
                  Prop
                </th>
                <th className="text-left py-2 font-medium text-gray-900">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">className</td>
                <td className="py-2 text-gray-600">
                  Breadcrumb list (ol element)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  containerClassName
                </td>
                <td className="py-2 text-gray-600">
                  Navigation container (nav element)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  itemClassName
                </td>
                <td className="py-2 text-gray-600">
                  Individual breadcrumb items
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  activeItemClassName
                </td>
                <td className="py-2 text-gray-600">
                  Active/current item (last item)
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  separatorClassName
                </td>
                <td className="py-2 text-gray-600">Separator elements</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  ellipsisClassName
                </td>
                <td className="py-2 text-gray-600">Ellipsis container</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  ellipsisButtonClassName
                </td>
                <td className="py-2 text-gray-600">Ellipsis button</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  ellipsisDropdownClassName
                </td>
                <td className="py-2 text-gray-600">Dropdown menu container</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  ellipsisDropdownItemClassName
                </td>
                <td className="py-2 text-gray-600">Dropdown menu items</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  iconClassName
                </td>
                <td className="py-2 text-gray-600">Icon wrapper</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-blue-600">
                  linkClassName
                </td>
                <td className="py-2 text-gray-600">
                  Link elements (items with href)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>
    </>
  );
};

export default BreadcrumbDemo;
