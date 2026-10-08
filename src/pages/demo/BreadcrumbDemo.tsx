import type { BreadcrumbClasses } from "../../components/Breadcrumb/index.js";
import {
  useCallback,
  useState } from "react";
import { Breadcrumb } from "../../components/Breadcrumb/index.js";
import type { BreadcrumbItem } from "../../components/Breadcrumb/index.js";
import { useTheme } from "./ThemeContext.js";
import {
  DocsHero,
  Section,
  DemoWrapper,
  DocControlledPattern,
  DocEdgeCases,
  DocDoDont,
  ComponentDocs,
  CopyPasteBlock,
  SetupNote,
} from "./components/index.js";

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
  },
];

const itemsWithDisabled: BreadcrumbItem[] = [
  { id: "home", label: "Home" },
  { id: "archived", label: "Archived", disabled: true },
  { id: "products", label: "Products" },
  { id: "phones", label: "Phones" },
];

const getClasses = (dark: boolean) => ({
  breadcrumb: {
    list: "flex flex-wrap items-center gap-1",
    item: `flex items-center gap-1 px-2 py-1 text-sm transition-colors cursor-pointer bg-transparent border border-none rounded text-cl-text-tertiary hover:text-cl-text hover:bg-cl-bg-hover`,
    separator: dark ? "text-cl-text-secondary" : "text-cl-text-tertiary",
    link: `flex items-center gap-1 px-2 py-1 text-sm rounded transition-colors text-cl-accent hover:text-cl-accent hover:underline dark:hover:underline`,
  } satisfies BreadcrumbClasses,

  /* Class strings this page reuses in its own markup. Not `classes`
     keys — Breadcrumb has no such slots, and passing them there styled
     nothing. */
  breadcrumbExtra: {
    icon: "shrink-0",
    ellipsisButton: `flex items-center justify-center w-8 h-8 rounded-cl-md transition-colors cursor-pointer bg-cl-bg-hover hover:bg-cl-bg-hover text-cl-text-secondary dark:bg-cl-bg-elevated`,
    dropdown: `flex flex-col min-w-40 rounded-cl-md shadow-lg py-1 bg-cl-bg-elevated border border-cl-border`,
    dropdownItem: `flex items-center gap-2 px-3 py-2 text-sm cursor-pointer w-full text-left bg-transparent border border-none text-cl-text-secondary hover:bg-cl-bg-elevated`,
  },
  pill: {
    list: "flex flex-wrap items-center gap-2",
    item: `flex items-center gap-1 px-4 py-2 text-sm rounded-full transition-all cursor-pointer text-cl-text hover:text-cl-text bg-cl-bg-panel hover:bg-cl-bg-hover border border-cl-border-input hover:shadow-sm`,
    separator: "text-cl-text-secondary",
    ellipsisTrigger: `flex items-center justify-center w-10 h-10 rounded-full transition-all cursor-pointer bg-cl-bg-panel hover:bg-cl-bg-hover text-cl-text-secondary border border-cl-border-input hover:shadow-sm`,
    content: `flex flex-col min-w-40 rounded-cl-lg shadow-lg py-2 bg-cl-bg-elevated border border-cl-border`,
    collapsedItem: `flex items-center gap-2 px-4 py-2 text-sm cursor-pointer w-full text-left bg-transparent text-cl-text-secondary hover:bg-cl-bg-hover`,
  } satisfies BreadcrumbClasses,
  colored: {
    root: `p-4 rounded-cl-md bg-cl-accent/10 dark:bg-cl-accent/20`,
    list: "flex flex-wrap items-center gap-1",
    item: `flex items-center gap-1 px-3 py-1.5 text-sm rounded-full transition-colors cursor-pointer bg-transparent border border-none text-cl-accent hover:text-cl-accent hover:bg-cl-accent/10 dark:hover:bg-cl-accent/20`,
    separator: dark ? "text-cl-accent" : "text-cl-accent",
  } satisfies BreadcrumbClasses,

  /* Class strings this page reuses in its own markup. Not `classes`
     keys — Breadcrumb has no such slots, and passing them there styled
     nothing. */
  coloredExtra: {
    ellipsisButton: `flex items-center justify-center w-8 h-8 rounded-full transition-colors cursor-pointer bg-cl-accent-bg hover:bg-cl-accent-bg-hover text-cl-accent-hover`,
    dropdown: `flex flex-col min-w-40 rounded-cl-md shadow-lg py-1 bg-cl-bg-panel border border-cl-border-input-focus dark:border`,
    dropdownItem: `flex items-center gap-2 px-3 py-2 text-sm cursor-pointer w-full text-left bg-transparent border border-none text-cl-accent hover:bg-cl-accent/10 dark:hover:bg-cl-accent/20`,
  },
 card: `rounded-cl-lg p-5 bg-cl-bg-elevated`,
 kbd: `px-2 py-1 rounded-cl-md text-[11px] font-mono min-w-[2.5rem] text-center font-medium bg-cl-bg-elevated border border-cl-border text-cl-text-secondary`,
  label: `text-xs font-medium text-cl-text-tertiary`,
 note: `mt-3 p-3 rounded-cl-md text-xs bg-cl-bg-elevated border border-cl-border text-cl-accent`,
});

const BreadcrumbDemo = () => {
  const { isDarkMode: dark } = useTheme();
  const c = getClasses(dark);
  const [clickedItem, setClickedItem] = useState<string | null>(null);
  // Its own state: `onDropdownOpenChange` wrote into `clickedItem`, so opening
  // the ellipsis anywhere on the page put "Dropdown closed" under the Per-Item
  // Click Handlers example, which reports what was clicked.
  const [dropdownState, setDropdownState] = useState<string | null>(null);
  const [linkItemClicked, setLinkItemClicked] = useState("not fired yet");

  const handleItemClick = useCallback((item: BreadcrumbItem) => {
    setClickedItem(item.label);
    setTimeout(() => setClickedItem(null), 2000);
  }, []);

  return (
    <div className="space-y-10">
      <DocsHero
        title="Breadcrumb"
        description="A navigation component that shows the user&apos;s current location in a hierarchical structure. Supports truncation with an accessible ellipsis dropdown, icons, tooltips, links, disabled items, custom separators, and full keyboard navigation."
        code={`import { Breadcrumb } from "@chumlab/ui/breadcrumb";`}
      />

      <SetupNote />

      <CopyPasteBlock name="Breadcrumb" />

      <Section
        title="Basic Usage"
        description="Standard breadcrumb trail with default chevron separators."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          {}
          <Breadcrumb
            items={basicItems}
            onItemClick={handleItemClick}
          />
        </DemoWrapper>
      </Section>

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
                  ellipsisTrigger: c.breadcrumbExtra.ellipsisButton,
                  content: c.breadcrumbExtra.dropdown,
                  collapsedItem: c.breadcrumbExtra.dropdownItem,
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
                  ellipsisTrigger: c.breadcrumbExtra.ellipsisButton,
                  content: c.breadcrumbExtra.dropdown,
                  collapsedItem: c.breadcrumbExtra.dropdownItem,
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
            classes={{ ...c.breadcrumb, itemIcon: c.breadcrumbExtra.icon }}
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
              ellipsisTrigger: c.breadcrumbExtra.ellipsisButton,
              content: c.breadcrumbExtra.dropdown,
              collapsedItem: c.breadcrumbExtra.dropdownItem,
              itemIcon: c.breadcrumbExtra.icon,
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
                      className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-cl-success/15 text-cl-text dark:bg-cl-success/20 dark:text-cl-success`}
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
                      className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-cl-accent-bg text-cl-accent-hover`}
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
            onItemClick={(item) => setLinkItemClicked(JSON.stringify(item))}
          />
          <div
            className="rounded-cl-md px-3 py-2 text-xs font-mono bg-cl-bg-elevated text-cl-text-tertiary"
            data-demo-action
          >
            onItemClick: {linkItemClicked}
          </div>
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
            onItemClick={(item) =>
              setClickedItem(`${item.label} (onItemClick)`)
            }
          />
        </DemoWrapper>
        {clickedItem && (
          <p
            className={`text-sm mt-2 text-cl-accent`}
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
            classes={{ ...c.breadcrumb, itemIcon: c.breadcrumbExtra.icon }}
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
              ellipsisTrigger: c.breadcrumbExtra.ellipsisButton,
              content: c.breadcrumbExtra.dropdown,
              collapsedItem: c.breadcrumbExtra.dropdownItem,
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
                  ellipsisTrigger: c.breadcrumbExtra.ellipsisButton,
                  content: c.breadcrumbExtra.dropdown,
                  collapsedItem: c.breadcrumbExtra.dropdownItem,
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
                    ellipsisTrigger: c.breadcrumbExtra.ellipsisButton,
                    content: c.breadcrumbExtra.dropdown,
                    collapsedItem: c.breadcrumbExtra.dropdownItem,
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
                  <span className={dark ? "text-cl-text-secondary" : "text-cl-text-tertiary"}>
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
        title="Separator & Ellipsis Icon Size"
        description="iconSize controls the chevrons and the ellipsis glyph. An item's own icon is a node you pass, so it keeps the size you gave it."
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
                    ellipsisTrigger: c.breadcrumbExtra.ellipsisButton,
                    content: c.breadcrumbExtra.dropdown,
                    collapsedItem: c.breadcrumbExtra.dropdownItem,
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
        description="Pill-shaped items, a round ellipsis trigger and a matching menu, all through the classes prop."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark} layout="block">
          <Breadcrumb
            items={longItems}
            maxVisibleItems={4}
            classes={{ ...c.pill, itemIcon: "shrink-0" }}
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
              itemIcon: "shrink-0",
              ellipsisTrigger: c.coloredExtra.ellipsisButton,
              content: c.coloredExtra.dropdown,
              collapsedItem: c.coloredExtra.dropdownItem,
            }}
            onItemClick={handleItemClick}
          />
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
              ellipsisTrigger: c.breadcrumbExtra.ellipsisButton,
              content: c.breadcrumbExtra.dropdown,
              collapsedItem: c.breadcrumbExtra.dropdownItem,
            }}
            onItemClick={handleItemClick}
            onDropdownOpenChange={(open) => {
              setDropdownState(open ? "Dropdown opened" : "Dropdown closed");
              setTimeout(() => setDropdownState(null), 2000);
            }}
          />
        </DemoWrapper>
        {dropdownState && (
          <p
            className={`text-sm mt-2 text-cl-accent`}
            data-demo-action
          >
            {dropdownState}
          </p>
        )}
      </Section>

      {/* ─── Reference — generated from the schema and the .ai.md ──────── */}
      <ComponentDocs name="Breadcrumb" />

      {/* ─── Accessibility ────────────────────────────────────────────── */}

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
