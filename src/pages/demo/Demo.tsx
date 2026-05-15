import { useEffect, useMemo, useRef, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { useCanonical, useJsonLd } from "../../hooks/useJsonLd";
import { SiteHeader } from "../../components/SiteHeader";
import { trackEvent } from "../../lib/analytics";

interface NavItem {
  path: string;
  displayName: string;
  description?: string;
  isNew?: boolean;
}

interface NavSection {
  id: string;
  title: string;
  items: NavItem[];
}

const OVERVIEW_ITEMS: NavItem[] = [
  {
    path: "introduction",
    displayName: "Introduction",
    description:
      "What Chumlab UI is, what's inside, and who it's built for.",
  },
  {
    path: "getting-started",
    displayName: "Getting Started",
    description:
      "Install Chumlab UI, render your first component, wire up Tailwind.",
  },
  {
    path: "accessibility",
    displayName: "Accessibility",
    description:
      "How Chumlab UI handles WCAG, keyboard navigation, ARIA, and reduced motion.",
  },
];

const GUIDE_ITEMS: NavItem[] = [
  {
    path: "guides/styling",
    displayName: "Styling",
    description:
      "Override anything with className, CSS Modules, or plain CSS — without fighting our defaults.",
  },
  {
    path: "guides/theming",
    displayName: "Theming",
    description:
      "Theme tokens, dark/light surfaces, and custom palettes via CSS variables.",
  },
  {
    path: "guides/animation",
    displayName: "Animation",
    description:
      "Built-in transitions, prefers-reduced-motion, and where to plug in your own motion.",
  },
  {
    path: "guides/ai-llm",
    displayName: "AI & LLM",
    description:
      "Patterns for AI playgrounds, streaming UIs, and LLM-friendly component APIs.",
  },
];

const COMPONENT_ITEMS: NavItem[] = [
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
  { path: "international-phone-input", displayName: "International Phone Input", description: "International phone number input for React with country code selector, flag display, and phone number formatting." },
  { path: "loader", displayName: "Loader", description: "Animated loading indicators for React. Multiple variants including spinner, dots, pulse, and skeleton shimmer." },
  { path: "modal", displayName: "Modal", description: "Accessible React modal dialog with focus trapping, keyboard dismiss, nested modals, and customizable overlay." },
  { path: "multi-select-dropdown", displayName: "Multi Select Dropdown", description: "Multi-select dropdown for React with chip display, select all, max selection limits, and keyboard navigation." },
  { path: "multi-select-searchable-dropdown", displayName: "Multi Select Searchable Dropdown", description: "Searchable multi-select dropdown for React with async search, debounce, chip display, and custom option rendering." },
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

const NAV_SECTIONS: NavSection[] = [
  { id: "overview", title: "Overview", items: OVERVIEW_ITEMS },
  { id: "guides", title: "Guides", items: GUIDE_ITEMS },
  { id: "components", title: "Components", items: COMPONENT_ITEMS },
];

const ALL_ITEMS: NavItem[] = NAV_SECTIONS.flatMap((s) => s.items);

const Demo = () => {
  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");

  const activeItem = ALL_ITEMS.find(
    (c) => location.pathname === `/${c.path}`,
  );
  useDocumentTitle(
    activeItem ? `${activeItem.displayName} Component` : "Components",
    activeItem?.description,
  );

  // Per-component-page SEO. Each route under the docs surface gets its
  // own canonical and TechArticle JSON-LD so AI search engines and
  // generic crawlers can index the page as a discrete article rather than
  // treating every demo route as a duplicate of the docs root.
  const canonicalUrl = activeItem
    ? `https://chumlab.com/${activeItem.path}`
    : "https://chumlab.com/";
  useCanonical(canonicalUrl);

  const techArticleJsonLd = useMemo(() => {
    if (!activeItem) return null;
    return {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      headline: `${activeItem.displayName} component — Chumlab UI`,
      description:
        activeItem.description ??
        `${activeItem.displayName} is an accessible React component from Chumlab UI. Open source, MIT licensed.`,
      url: canonicalUrl,
      author: { "@id": "https://chumlab.com/#organization" },
      publisher: { "@id": "https://chumlab.com/#organization" },
      about: {
        "@type": "Thing",
        name: `${activeItem.displayName} React component`,
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": canonicalUrl,
      },
    };
  }, [activeItem, canonicalUrl]);
  useJsonLd("page-tech-article", techArticleJsonLd);

  // Close mobile sidebar on route change.
  const [prevPathname, setPrevPathname] = useState(location.pathname);
  if (prevPathname !== location.pathname) {
    setPrevPathname(location.pathname);
    if (sidebarOpen) {
      setSidebarOpen(false);
    }
  }

  useEffect(() => {
    mainRef.current?.scrollTo(0, 0);
  }, [location.pathname]);

  // `/` keyboard shortcut focuses the sidebar search; Esc clears + blurs it.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && !isEditableTarget(e.target)) {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      } else if (e.key === "Escape" && document.activeElement === searchInputRef.current) {
        setSearch("");
        searchInputRef.current?.blur();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const filteredSections = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return NAV_SECTIONS;
    return NAV_SECTIONS.map((s) => ({
      ...s,
      items: s.items.filter((it) =>
        it.displayName.toLowerCase().includes(q),
      ),
    })).filter((s) => s.items.length > 0);
  }, [search]);

  const totalFiltered = filteredSections.reduce(
    (n, s) => n + s.items.length,
    0,
  );

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="p-4 border-b border-border-faint">
        <div className="relative">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-fg-tertiary pointer-events-none"
            aria-hidden
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={searchInputRef}
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onBlur={(e) => {
              const q = e.target.value.trim();
              if (q) trackEvent("docs_search", { query: q });
            }}
            placeholder="Search"
            aria-label="Search documentation"
            className="w-full pl-9 pr-9 py-2.5 rounded-md bg-bg-elevated border border-border-faint text-fg placeholder:text-fg-tertiary font-sans text-[13px] focus:outline-none focus:border-accent/40"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 font-mono text-[10px] text-fg-tertiary px-1.5 py-0.5 rounded border border-border-faint bg-bg-base pointer-events-none">
            /
          </kbd>
        </div>
      </div>

      {/* Sections. Section title and item rows share px-3 so the eyebrow
          and link copy left-align on the same vertical guide. */}
      <nav
        className="flex-1 overflow-y-auto px-3 py-5 sidebar-scroll"
        aria-label="Documentation navigation"
      >
        {totalFiltered === 0 ? (
          <div className="px-3 py-6 text-center font-sans text-[13px] text-fg-tertiary">
            No results for &ldquo;{search}&rdquo;
          </div>
        ) : (
          filteredSections.map((section) => (
            <div key={section.id} className="mb-7 last:mb-0">
              <div className="px-3 mb-3 eyebrow text-fg-tertiary">
                {section.title}
              </div>
              <ul className="space-y-0.5 list-none m-0 p-0">
                {section.items.map((item) => (
                  <li key={item.path}>
                    <NavLink
                      to={`/${item.path}`}
                      className={({ isActive }) =>
                        [
                          "flex items-center gap-2 px-3 py-2 rounded-md font-sans text-[14px] leading-[1.4] transition-colors",
                          isActive
                            ? "bg-accent text-white font-medium"
                            : "text-fg-secondary hover:text-fg hover:bg-fg/5",
                        ].join(" ")
                      }
                      aria-current={
                        location.pathname === `/${item.path}`
                          ? "page"
                          : undefined
                      }
                      data-track-event="docs_nav_click"
                      data-track-target={item.path}
                    >
                      <span className="truncate">{item.displayName}</span>
                      {item.isNew && (
                        <span className="ml-auto font-mono text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-accent/10 text-accent border border-accent/20">
                          New
                        </span>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </nav>
    </div>
  );

  return (
    <div className="docs-surface min-h-screen flex flex-col bg-bg-base text-fg">
      <SiteHeader />

      <div className="flex-1 flex pt-[var(--header-height)] min-h-0">
        {/* Mobile sidebar drawer */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 z-40 bg-bg-base/80 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <aside
          className={`lg:hidden fixed top-[var(--header-height)] bottom-0 left-0 z-50 w-[280px] max-w-[85vw] bg-bg-base border-r border-border-faint transition-transform duration-300 ease-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {sidebarContent}
        </aside>

        {/* Desktop sidebar */}
        <aside
          className="hidden lg:block sticky top-[var(--header-height)] h-[calc(100vh-var(--header-height))] w-[260px] xl:w-[280px] shrink-0 border-r border-border-faint bg-bg-base"
        >
          {sidebarContent}
        </aside>

        {/* Mobile sidebar trigger — fixed bottom-left button */}
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open documentation menu"
          className="lg:hidden fixed bottom-5 left-5 z-30 flex items-center gap-2 px-4 py-2.5 rounded-full bg-fg text-bg-base font-medium text-[13px] shadow-lg border border-border-faint"
          data-track-event="docs_mobile_menu_open"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden
          >
            <line x1="4" y1="7" x2="20" y2="7" />
            <line x1="4" y1="14" x2="20" y2="14" />
            <line x1="4" y1="21" x2="20" y2="21" />
          </svg>
          Menu
        </button>

        {/* Main content */}
        <main
          ref={mainRef}
          className="flex-1 min-h-0 min-w-0 overflow-x-hidden overflow-y-auto bg-bg-base text-fg"
        >
          <div className="p-5 sm:p-7 lg:p-10 w-full max-w-none min-w-0">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
}

export default Demo;
