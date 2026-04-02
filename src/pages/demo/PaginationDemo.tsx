import { useState, useRef, useEffect } from "react";
import { Pagination } from "../../components/Pagination";
import { useTheme } from "./ThemeContext";
import {
  Section,
  CodeBlock,
  DemoWrapper,
  DemoLabel,
  PropsTable,
  PropRow,
  DocControlledPattern,
  DocEdgeCases,
  DocDoDont,
} from "./components";

// ─── Icons ───────────────────────────────────────────────────────────────────

const ArrowLeftIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10 19l-7-7m0 0l7-7m-7 7h18"
    />
  </svg>
);

const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M14 5l7 7m0 0l-7 7m7-7H3"
    />
  </svg>
);

const CaretDownIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
);

const DoubleArrowLeftIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
    />
  </svg>
);

const DoubleArrowRightIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13 5l7 7-7 7M5 5l7 7-7 7"
    />
  </svg>
);

// ─── Jump-to-Page Ellipsis ───────────────────────────────────────────────────

const JumpToPageEllipsis = ({
  onPageChange,
  dark,
  variant = "default",
}: {
  onPageChange: (page: number) => void;
  dark: boolean;
  variant?: "default" | "pill" | "ghost";
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSubmit = () => {
    const page = parseInt(value, 10);
    if (!isNaN(page) && page > 0) {
      onPageChange(page);
    }
    setIsEditing(false);
    setValue("");
  };

  const buttonStyles = {
    default: `px-2.5 py-1 rounded-lg text-sm cursor-pointer transition-colors ${
      dark
        ? "text-gray-400 hover:bg-gray-700 hover:text-gray-200"
        : "text-gray-400 hover:bg-gray-100 hover:text-gray-600"
    }`,
    pill: `w-9 h-9 rounded-full flex items-center justify-center text-sm cursor-pointer transition-all ${
      dark
        ? "text-gray-400 border border-gray-600 hover:bg-gray-700 hover:text-gray-200 hover:border-gray-500"
        : "text-gray-400 border border-gray-200 hover:bg-gray-100 hover:text-gray-600 hover:border-gray-300"
    }`,
    ghost: `px-2 py-1 rounded-md text-sm cursor-pointer transition-colors ${
      dark
        ? "text-gray-500 hover:text-gray-300"
        : "text-gray-400 hover:text-gray-600"
    }`,
  };

  const inputStyles = {
    default: `w-12 px-1 py-1 text-sm text-center rounded-lg border outline-none transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
      dark
        ? "bg-gray-700 border-gray-500 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
        : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
    }`,
    pill: `w-9 h-9 text-sm text-center rounded-full border outline-none transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
      dark
        ? "bg-gray-700 border-blue-500 text-white placeholder-gray-500 ring-1 ring-blue-500/40"
        : "bg-white border-blue-500 text-gray-900 placeholder-gray-400 ring-1 ring-blue-500/30"
    }`,
    ghost: `w-10 px-1 py-1 text-sm text-center rounded-md border-b-2 border-t-0 border-x-0 outline-none transition-colors bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
      dark
        ? "border-blue-500 text-white placeholder-gray-500"
        : "border-blue-500 text-gray-900 placeholder-gray-400"
    }`,
  };

  if (!isEditing) {
    return (
      <button
        type="button"
        onClick={() => setIsEditing(true)}
        className={buttonStyles[variant]}
        aria-label="Jump to page"
      >
        &hellip;
      </button>
    );
  }

  return (
    <input
      ref={inputRef}
      type="number"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") handleSubmit();
        if (e.key === "Escape") {
          setIsEditing(false);
          setValue("");
        }
      }}
      onBlur={() => {
        setIsEditing(false);
        setValue("");
      }}
      className={inputStyles[variant]}
      min={1}
      placeholder={variant === "ghost" ? "Go" : "#"}
    />
  );
};

// ─── Themed Classes ──────────────────────────────────────────────────────────

const getClasses = (dark: boolean) => ({
  pagination: {
    root: "flex items-center gap-2",
    nav: "flex items-center gap-2",
    pageButtons: "flex items-center gap-2",
    pageButton: `px-3 py-1 rounded-lg border transition-colors cursor-pointer ${
      dark
        ? "border-gray-600 hover:bg-gray-700 text-gray-300"
        : "border-gray-200 hover:bg-gray-50 text-gray-700"
    }`,
    activePageButton:
      "px-3 py-1 rounded-lg bg-blue-600 text-white border border-blue-600",
    navButton: `p-2 rounded-lg border transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
      dark
        ? "border-gray-600 hover:bg-gray-700 text-gray-300"
        : "border-gray-200 hover:bg-gray-50 text-gray-600"
    }`,
    ellipsis: `px-2 select-none ${dark ? "text-gray-500" : "text-gray-400"}`,
    selector: "flex items-center gap-2",
    selectorButton: `flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
      dark
        ? "border-gray-600 bg-gray-700 text-gray-200 hover:bg-gray-600"
        : "border-gray-200 bg-white hover:bg-gray-50"
    }`,
    selectorDropdown: `rounded-lg shadow-lg py-1 border min-w-[64px] ${
      dark ? "bg-gray-700 border-gray-600" : "bg-white border-gray-200"
    }`,
    selectorDropdownWrapper: "",
    selectorOption: `px-4 py-1.5 w-full text-left cursor-pointer transition-colors ${
      dark
        ? "text-gray-200 hover:bg-gray-600 data-[selected]:bg-blue-900/60 data-[selected]:text-blue-300 data-[highlighted]:bg-gray-600"
        : "hover:bg-gray-50 data-[selected]:bg-blue-50 data-[selected]:text-blue-700 data-[highlighted]:bg-gray-100"
    }`,
    label: `text-sm ${dark ? "text-gray-400" : "text-gray-600"}`,
    dropdownIcon: `w-4 h-4 transition-transform ${dark ? "text-gray-400" : "text-gray-500"}`,
    prevIcon: `w-5 h-5 ${dark ? "text-gray-400" : "text-gray-600"}`,
    nextIcon: `w-5 h-5 ${dark ? "text-gray-400" : "text-gray-600"}`,
    pageInfo: "flex items-center",
  },
  card: `rounded-2xl border p-5 ${dark ? "border-white/[0.06] bg-linear-to-br from-white/[0.03] to-white/[0.01]" : "border-gray-200 bg-white shadow-sm shadow-gray-900/[0.04]"}`,
  kbd: `px-2 py-1 rounded-md text-[11px] font-mono min-w-[2.5rem] text-center font-medium ${dark ? "bg-gray-900 border border-white/10 text-gray-300 shadow-sm" : "bg-white border border-gray-200 text-gray-600 shadow-sm"}`,
  label: `text-xs font-medium ${dark ? "text-gray-500" : "text-gray-400"}`,
  note: `mt-3 p-3 rounded-lg text-xs ${dark ? "bg-blue-900/20 border border-blue-800/50 text-blue-300" : "bg-blue-50 border border-blue-200 text-blue-700"}`,
  btn: `px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${dark ? "bg-gray-700 text-gray-200 hover:bg-gray-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
  btnPrimary: `px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${dark ? "bg-indigo-500 text-white hover:bg-indigo-600" : "bg-indigo-600 text-white hover:bg-indigo-700"}`,
});

// ─── Demo ────────────────────────────────────────────────────────────────────

const PaginationDemo = () => {
  const { isDarkMode: dark } = useTheme();
  const c = getClasses(dark);
  const paginationRef = useRef<HTMLElement>(null);

  // Each demo section gets its own independent state
  const [basicPage, setBasicPage] = useState(1);
  const [rowsPage, setRowsPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [manyPagesPage, setManyPagesPage] = useState(1);
  const [sibling2Page, setSibling2Page] = useState(5);
  const [jumpPage, setJumpPage] = useState(25);
  const [jumpPillPage, setJumpPillPage] = useState(15);
  const [jumpGhostPage, setJumpGhostPage] = useState(10);
  const [pageInfoPage, setPageInfoPage] = useState(1);
  const [pageInfoRowsPerPage, setPageInfoRowsPerPage] = useState(10);
  const [reorderedPage, setReorderedPage] = useState(1);
  const [reorderedRowsPerPage, setReorderedRowsPerPage] = useState(10);
  const [externalPage, setExternalPage] = useState(1);
  const [externalRows, setExternalRows] = useState(10);
  const [i18nPage, setI18nPage] = useState(1);
  const [i18nRowsPerPage, setI18nRowsPerPage] = useState(10);
  const [customIconsPage, setCustomIconsPage] = useState(1);
  const [customIconsRowsPerPage, setCustomIconsRowsPerPage] = useState(10);
  const [doubleArrowPage, setDoubleArrowPage] = useState(1);
  const [customRowsPage, setCustomRowsPage] = useState(1);
  const [customRowsPerPage, setCustomRowsPerPage] = useState(20);
  const [dropdownUpPage, setDropdownUpPage] = useState(1);
  const [dropdownUpRowsPerPage, setDropdownUpRowsPerPage] = useState(10);
  const [dropdownDownPage, setDropdownDownPage] = useState(1);
  const [dropdownDownRowsPerPage, setDropdownDownRowsPerPage] = useState(10);
  const [styledPage, setStyledPage] = useState(1);
  const [styledRowsPerPage, setStyledRowsPerPage] = useState(10);
  const [dataAttrPage, setDataAttrPage] = useState(3);
  const [minimalPage, setMinimalPage] = useState(1);
  const [compactPage, setCompactPage] = useState(1);
  const [edgeSinglePage, setEdgeSinglePage] = useState(1);
  const [edgeBoundaryPage, setEdgeBoundaryPage] = useState(1);
  const [refPage, setRefPage] = useState(1);
  const [zIndexPage, setZIndexPage] = useState(1);
  const [zIndexRowsPerPage, setZIndexRowsPerPage] = useState(10);
  const [valuePage, setValuePage] = useState(1);

  return (
    <div className="space-y-10">
      {/* ─── Header ─────────────────────────────────────────────────────── */}
      <header className="relative overflow-hidden rounded-2xl p-6 sm:p-8">
        <div
          className={`absolute inset-0 ${dark ? "bg-linear-to-br from-indigo-950/80 via-gray-900/60 to-blue-950/50" : "bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50"}`}
        />
        <div
          className={`absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl ${dark ? "bg-blue-500/10" : "bg-blue-200/40"}`}
        />
        <div
          className={`absolute -bottom-24 -left-24 w-64 h-64 rounded-full blur-3xl ${dark ? "bg-indigo-500/10" : "bg-indigo-200/30"}`}
        />
        <div className="relative">
          <h1
            className={`text-3xl font-bold mb-3 ${dark ? "text-white" : "text-gray-900"}`}
          >
            Pagination
          </h1>
          <p
            className={`text-sm leading-relaxed max-w-2xl ${dark ? "text-gray-400" : "text-gray-600"}`}
          >
            A flexible, accessible pagination component with optional
            rows-per-page selector, custom ellipsis rendering, page info
            display, section reordering, i18n support, and extensive
            class-driven styling via the classes prop.
          </p>
          <div className="mt-5">
            <CodeBlock
              isDarkMode={dark}
              code={`import { Pagination } from "@kern-ui/pagination";`}
            />
          </div>
        </div>
      </header>

      {/* ─── Basic ──────────────────────────────────────────────────────── */}
      <Section
        title="Basic Pagination"
        description="Minimal setup with value, totalPages, and onValueChange."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <Pagination
            value={basicPage}
            totalPages={5}
            onValueChange={setBasicPage}
            classes={c.pagination}
          />
        </DemoWrapper>
      </Section>

      {/* ─── With Rows Per Page ───────────────────────────────────────── */}
      <Section
        title="With Rows Per Page"
        description="Enable the rows-per-page selector with showRowsPerPage, rowsPerPage, and onRowsPerPageChange."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <Pagination
            value={rowsPage}
            totalPages={Math.ceil(100 / rowsPerPage)}
            rowsPerPage={rowsPerPage}
            onValueChange={setRowsPage}
            onRowsPerPageChange={(rows) => {
              setRowsPerPage(rows);
              setRowsPage(1);
            }}
            showRowsPerPage
            classes={{
              ...c.pagination,
              root: "flex items-center justify-between gap-4",
            }}
          />
        </DemoWrapper>
      </Section>

      {/* ─── Many Pages & Sibling Count ──────────────────────────────── */}
      <Section
        title="Many Pages & Sibling Count"
        description="Ellipsis appear automatically for large page counts. Use siblingCount to control how many pages surround the current one."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="space-y-8">
            <div className="space-y-3">
              <DemoLabel isDarkMode={dark}>siblingCount=1 (default)</DemoLabel>
              <Pagination
                value={manyPagesPage}
                totalPages={50}
                siblingCount={1}
                onValueChange={setManyPagesPage}
                classes={c.pagination}
              />
            </div>
            <div
              className={`border-t pt-8 ${dark ? "border-gray-700" : "border-gray-200"}`}
            >
              <div className="space-y-3">
                <DemoLabel isDarkMode={dark}>siblingCount=2</DemoLabel>
                <Pagination
                  value={sibling2Page}
                  totalPages={30}
                  siblingCount={2}
                  onValueChange={setSibling2Page}
                  classes={c.pagination}
                />
              </div>
            </div>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Custom Ellipsis (Jump to Page) ──────────────────────────── */}
      <Section
        title="Custom Ellipsis (Jump to Page)"
        description="Replace the default ellipsis with interactive content via renderEllipsis. Click an ellipsis to type a page number and press Enter."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="space-y-8">
            <div className="space-y-3">
              <DemoLabel isDarkMode={dark}>Default - bordered input</DemoLabel>
              <Pagination
                value={jumpPage}
                totalPages={50}
                onValueChange={setJumpPage}
                renderEllipsis={({ onPageChange }) => (
                  <JumpToPageEllipsis
                    onPageChange={onPageChange}
                    dark={dark}
                    variant="default"
                  />
                )}
                classes={c.pagination}
              />
            </div>
            <div
              className={`border-t pt-8 ${dark ? "border-gray-700" : "border-gray-200"}`}
            >
              <div className="space-y-3">
                <DemoLabel isDarkMode={dark}>
                  Pill - circular input matching pill-style buttons
                </DemoLabel>
                <Pagination
                  value={jumpPillPage}
                  totalPages={50}
                  onValueChange={setJumpPillPage}
                  renderEllipsis={({ onPageChange }) => (
                    <JumpToPageEllipsis
                      onPageChange={onPageChange}
                      dark={dark}
                      variant="pill"
                    />
                  )}
                  classes={{
                    ...c.pagination,
                    root: "flex items-center gap-1",
                    navButton: `p-2 rounded-full border shadow-sm transition-shadow disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
                      dark
                        ? "bg-gray-700 border-gray-600 text-gray-300"
                        : "bg-white border-gray-200"
                    }`,
                    pageButton: `w-9 h-9 rounded-full border shadow-sm flex items-center justify-center text-sm transition-shadow cursor-pointer ${
                      dark
                        ? "bg-gray-700 border-gray-600 text-gray-200"
                        : "bg-white border-gray-200"
                    }`,
                    activePageButton:
                      "w-9 h-9 rounded-full shadow-md flex items-center justify-center text-sm bg-blue-600 text-white",
                    pageButtons: "flex items-center gap-1",
                    prevIcon: `w-4 h-4 ${dark ? "text-gray-400" : "text-gray-600"}`,
                    nextIcon: `w-4 h-4 ${dark ? "text-gray-400" : "text-gray-600"}`,
                  }}
                />
              </div>
            </div>
            <div
              className={`border-t pt-8 ${dark ? "border-gray-700" : "border-gray-200"}`}
            >
              <div className="space-y-3">
                <DemoLabel isDarkMode={dark}>
                  Ghost - underline-only input for minimal styles
                </DemoLabel>
                <Pagination
                  value={jumpGhostPage}
                  totalPages={30}
                  onValueChange={setJumpGhostPage}
                  renderEllipsis={({ onPageChange }) => (
                    <JumpToPageEllipsis
                      onPageChange={onPageChange}
                      dark={dark}
                      variant="ghost"
                    />
                  )}
                  classes={{
                    ...c.pagination,
                    root: "flex items-center",
                    navButton: `p-1.5 rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer ${
                      dark
                        ? "hover:bg-gray-700 text-gray-400"
                        : "hover:bg-gray-100 text-gray-500"
                    }`,
                    pageButton: `min-w-[36px] h-9 rounded-md flex items-center justify-center text-sm font-medium transition-colors cursor-pointer ${
                      dark
                        ? "text-gray-400 hover:bg-gray-700 hover:text-white"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`,
                    activePageButton: `min-w-[36px] h-9 rounded-md flex items-center justify-center text-sm font-medium ${
                      dark ? "bg-gray-700 text-white" : "bg-gray-900 text-white"
                    }`,
                    pageButtons: "flex items-center gap-0.5",
                    prevIcon: "w-4 h-4",
                    nextIcon: "w-4 h-4",
                  }}
                />
              </div>
            </div>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Page Info Display ────────────────────────────────────────── */}
      <Section
        title="Page Info Display"
        description='Use renderPageInfo to show contextual information like "Page X of Y" between sections.'
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <Pagination
            value={pageInfoPage}
            totalPages={Math.ceil(100 / pageInfoRowsPerPage)}
            rowsPerPage={pageInfoRowsPerPage}
            onValueChange={setPageInfoPage}
            onRowsPerPageChange={(rows) => {
              setPageInfoRowsPerPage(rows);
              setPageInfoPage(1);
            }}
            showRowsPerPage
            renderPageInfo={({ currentPage, totalPages, rowsPerPage: rpp }) => (
              <span
                className={`text-sm tabular-nums ${dark ? "text-gray-400" : "text-gray-500"}`}
              >
                Page {currentPage} of {totalPages}
                {rpp ? ` (${rpp} per page)` : ""}
              </span>
            )}
            classes={{
              ...c.pagination,
              root: "flex items-center justify-between gap-4 flex-wrap",
            }}
          />
        </DemoWrapper>
      </Section>

      {/* ─── Section Reordering ───────────────────────────────────────── */}
      <Section
        title="Section Reordering"
        description="Use sectionOrder to control the layout. Here, navigation is first and the rows selector is last."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <Pagination
            value={reorderedPage}
            totalPages={Math.ceil(100 / reorderedRowsPerPage)}
            rowsPerPage={reorderedRowsPerPage}
            onValueChange={setReorderedPage}
            onRowsPerPageChange={(rows) => {
              setReorderedRowsPerPage(rows);
              setReorderedPage(1);
            }}
            showRowsPerPage
            sectionOrder={["nav", "pageInfo", "selector"]}
            renderPageInfo={({ currentPage, totalPages }) => (
              <span
                className={`text-sm tabular-nums ${dark ? "text-gray-400" : "text-gray-500"}`}
              >
                {currentPage} / {totalPages}
              </span>
            )}
            classes={{
              ...c.pagination,
              root: "flex items-center justify-between gap-4",
            }}
          />
        </DemoWrapper>
      </Section>

      {/* ─── External Rows Control ────────────────────────────────────── */}
      <Section
        title="External Rows Control"
        description="Manage rows-per-page with your own UI by omitting showRowsPerPage and controlling totalPages externally."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`text-sm font-medium ${dark ? "text-gray-300" : "text-gray-700"}`}
              >
                Items per page:
              </span>
              {[10, 25, 50, 100].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    setExternalRows(r);
                    setExternalPage(1);
                  }}
                  className={`px-3 py-1.5 text-sm rounded-lg border cursor-pointer transition-all ${
                    externalRows === r
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                      : dark
                        ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                        : "border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
            <Pagination
              value={externalPage}
              totalPages={Math.ceil(200 / externalRows)}
              onValueChange={setExternalPage}
              classes={c.pagination}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── i18n / Custom Labels ─────────────────────────────────────── */}
      <Section
        title="i18n / Custom Labels"
        description="Customize all visible text with showLabel, rowsPerPageLabel, and dropdownAriaLabel for internationalization."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <Pagination
            value={i18nPage}
            totalPages={Math.ceil(100 / i18nRowsPerPage)}
            rowsPerPage={i18nRowsPerPage}
            onValueChange={setI18nPage}
            onRowsPerPageChange={(rows) => {
              setI18nRowsPerPage(rows);
              setI18nPage(1);
            }}
            showRowsPerPage
            showLabel="Afficher"
            rowsPerPageLabel="lignes"
            dropdownAriaLabel="Lignes par page"
            paginationAriaLabel="Navigation des pages"
            prevAriaLabel="Page pr\u00e9c\u00e9dente"
            nextAriaLabel="Page suivante"
            pageAriaLabel={(page) => `Page ${page}`}
            renderPageInfo={({ currentPage, totalPages }) => (
              <span
                className={`text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
              >
                Page {currentPage} sur {totalPages}
              </span>
            )}
            classes={{
              ...c.pagination,
              root: "flex items-center justify-between gap-4 flex-wrap",
            }}
          />
        </DemoWrapper>
      </Section>

      {/* ─── Custom Icons ─────────────────────────────────────────────── */}
      <Section
        title="Custom Icons"
        description="Pass icon components via prevIcon, nextIcon, and dropdownIcon. Supports both component functions and ReactNode elements."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="space-y-8">
            <div className="space-y-3">
              <DemoLabel isDarkMode={dark}>
                Component functions (ArrowLeft / ArrowRight / CaretDown)
              </DemoLabel>
              <Pagination
                value={customIconsPage}
                totalPages={Math.ceil(100 / customIconsRowsPerPage)}
                rowsPerPage={customIconsRowsPerPage}
                onValueChange={setCustomIconsPage}
                onRowsPerPageChange={(rows) => {
                  setCustomIconsRowsPerPage(rows);
                  setCustomIconsPage(1);
                }}
                showRowsPerPage
                prevIcon={ArrowLeftIcon}
                nextIcon={ArrowRightIcon}
                dropdownIcon={CaretDownIcon}
                classes={{
                  ...c.pagination,
                  root: "flex items-center justify-between gap-4",
                  navButton: `p-2 rounded-lg border transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
                    dark
                      ? "border-indigo-700 bg-indigo-900/30 hover:bg-indigo-800/50 text-indigo-300"
                      : "border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-600"
                  }`,
                  activePageButton:
                    "px-3 py-1 rounded-lg border border-indigo-600 bg-indigo-600 text-white",
                  prevIcon: `w-5 h-5 ${dark ? "text-indigo-300" : "text-indigo-600"}`,
                  nextIcon: `w-5 h-5 ${dark ? "text-indigo-300" : "text-indigo-600"}`,
                }}
              />
            </div>
            <div
              className={`border-t pt-8 ${dark ? "border-gray-700" : "border-gray-200"}`}
            >
              <div className="space-y-3">
                <DemoLabel isDarkMode={dark}>
                  ReactNode elements (DoubleArrowLeft / DoubleArrowRight)
                </DemoLabel>
                <div className="flex justify-center">
                  <Pagination
                    value={doubleArrowPage}
                    totalPages={20}
                    onValueChange={setDoubleArrowPage}
                    prevIcon={
                      <DoubleArrowLeftIcon
                        className={`w-5 h-5 ${dark ? "text-emerald-300" : "text-emerald-600"}`}
                      />
                    }
                    nextIcon={
                      <DoubleArrowRightIcon
                        className={`w-5 h-5 ${dark ? "text-emerald-300" : "text-emerald-600"}`}
                      />
                    }
                    classes={{
                      ...c.pagination,
                      navButton: `p-2 rounded-full border transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
                        dark
                          ? "border-emerald-700 bg-emerald-900/30 hover:bg-emerald-800/50"
                          : "border-emerald-200 bg-emerald-50 hover:bg-emerald-100"
                      }`,
                      activePageButton:
                        "px-3 py-1 rounded-lg border border-emerald-600 bg-emerald-600 text-white",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Custom Row Options ───────────────────────────────────────── */}
      <Section
        title="Custom Row Options & Label"
        description="Provide custom values via rowOptions and change the label with rowsPerPageLabel."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <Pagination
            value={customRowsPage}
            totalPages={Math.ceil(200 / customRowsPerPage)}
            rowsPerPage={customRowsPerPage}
            rowOptions={[20, 40, 60, 80, 100]}
            onValueChange={setCustomRowsPage}
            onRowsPerPageChange={(rows) => {
              setCustomRowsPerPage(rows);
              setCustomRowsPage(1);
            }}
            showRowsPerPage
            rowsPerPageLabel="items"
            classes={{
              ...c.pagination,
              root: "flex items-center justify-between gap-4",
            }}
          />
        </DemoWrapper>
      </Section>

      {/* ─── Dropdown Direction ───────────────────────────────────────── */}
      <Section
        title="Dropdown Direction"
        description="Control whether the rows-per-page dropdown opens upward (default) or downward with dropdownDirection."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="space-y-8">
            <div className="space-y-3">
              <DemoLabel isDarkMode={dark}>direction="up" (default)</DemoLabel>
              <Pagination
                value={dropdownUpPage}
                totalPages={Math.ceil(100 / dropdownUpRowsPerPage)}
                rowsPerPage={dropdownUpRowsPerPage}
                onValueChange={setDropdownUpPage}
                onRowsPerPageChange={(rows) => {
                  setDropdownUpRowsPerPage(rows);
                  setDropdownUpPage(1);
                }}
                showRowsPerPage
                dropdownPosition="top"
                classes={{
                  ...c.pagination,
                  root: "flex items-center justify-between gap-4",
                }}
              />
            </div>
            <div
              className={`border-t pt-8 ${dark ? "border-gray-700" : "border-gray-200"}`}
            >
              <div className="space-y-3">
                <DemoLabel isDarkMode={dark}>direction="down"</DemoLabel>
                <Pagination
                  value={dropdownDownPage}
                  totalPages={Math.ceil(100 / dropdownDownRowsPerPage)}
                  rowsPerPage={dropdownDownRowsPerPage}
                  onValueChange={setDropdownDownPage}
                  onRowsPerPageChange={(rows) => {
                    setDropdownDownRowsPerPage(rows);
                    setDropdownDownPage(1);
                  }}
                  showRowsPerPage
                  dropdownPosition="bottom"
                  classes={{
                    ...c.pagination,
                    root: "flex items-center justify-between gap-4",
                  }}
                />
              </div>
            </div>
          </div>
        </DemoWrapper>
        <div className={c.note}>
          The dropdown is rendered via a React Portal into document.body, so it
          is never clipped by overflow: hidden ancestors. The component handles
          positioning and z-index via inline styles. It uses role="listbox" with
          aria-activedescendant for keyboard navigation.
        </div>
      </Section>

      {/* ─── Pill Style ───────────────────────────────────────────────── */}
      <Section
        title="Pill Style"
        description="Rounded pill-shaped buttons with shadows for a modern, elevated look."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <Pagination
            value={styledPage}
            totalPages={10}
            rowsPerPage={styledRowsPerPage}
            onValueChange={setStyledPage}
            onRowsPerPageChange={(rows) => {
              setStyledRowsPerPage(rows);
              setStyledPage(1);
            }}
            showRowsPerPage
            classes={{
              ...c.pagination,
              root: `flex items-center justify-between gap-6 p-4 rounded-xl ${dark ? "bg-gray-700/40" : "bg-gray-50"}`,
              nav: "flex items-center gap-1",
              navButton: `p-2 rounded-full border shadow-sm hover:shadow transition-shadow disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
                dark
                  ? "bg-gray-700 border-gray-600 text-gray-300"
                  : "bg-white border-gray-200"
              }`,
              pageButton: `w-10 h-10 rounded-full border shadow-sm hover:shadow transition-shadow flex items-center justify-center cursor-pointer ${
                dark
                  ? "bg-gray-700 border-gray-600 text-gray-200"
                  : "bg-white border-gray-200"
              }`,
              activePageButton:
                "w-10 h-10 rounded-full shadow-md flex items-center justify-center bg-purple-600 text-white",
              pageButtons: "flex items-center gap-1",
              selectorButton: `flex items-center gap-2 px-4 py-2 rounded-full border shadow-sm hover:shadow transition-shadow cursor-pointer ${
                dark
                  ? "bg-gray-700 border-gray-600 text-gray-200"
                  : "bg-white border-gray-200"
              }`,
              selectorDropdown: `rounded-xl shadow-lg py-2 min-w-[80px] border ${
                dark
                  ? "bg-gray-700 border-gray-600"
                  : "bg-white border-gray-200"
              }`,
              selectorOption: `px-4 py-2 w-full text-left cursor-pointer transition-colors ${
                dark
                  ? "text-gray-200 hover:bg-purple-900/40 data-[selected]:bg-purple-900/60 data-[selected]:text-purple-300 data-[highlighted]:bg-purple-900/40"
                  : "hover:bg-purple-50 data-[selected]:bg-purple-100 data-[selected]:text-purple-700 data-[highlighted]:bg-purple-50"
              }`,
              label: `text-sm font-medium ${dark ? "text-gray-300" : "text-gray-700"}`,
              ellipsis: `px-2 ${dark ? "text-gray-500" : "text-gray-400"}`,
              prevIcon: `w-5 h-5 ${dark ? "text-gray-400" : "text-gray-600"}`,
              nextIcon: `w-5 h-5 ${dark ? "text-gray-400" : "text-gray-600"}`,
              dropdownIcon: `w-4 h-4 ${dark ? "text-gray-400" : "text-gray-500"}`,
            }}
          />
        </DemoWrapper>
      </Section>

      {/* ─── Data-Attribute Styling ───────────────────────────────────── */}
      <Section
        title="Data-Attribute Styling"
        description="Use a single pageButton class with data-[active]: variants instead of separate active/inactive classes."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <Pagination
            value={dataAttrPage}
            totalPages={10}
            onValueChange={setDataAttrPage}
            classes={{
              ...c.pagination,
              navButton: `p-2 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
                dark
                  ? "hover:bg-gray-700 text-gray-400"
                  : "hover:bg-gray-100 text-gray-500"
              }`,
              pageButton: `px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                dark
                  ? "text-gray-400 hover:bg-gray-700 hover:text-gray-200 data-[active]:bg-blue-600 data-[active]:text-white data-[active]:hover:bg-blue-700"
                  : "text-gray-600 hover:bg-gray-100 data-[active]:bg-blue-600 data-[active]:text-white data-[active]:hover:bg-blue-700"
              }`,
              activePageButton: `px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                dark
                  ? "text-gray-400 hover:bg-gray-700 hover:text-gray-200 data-[active]:bg-blue-600 data-[active]:text-white data-[active]:hover:bg-blue-700"
                  : "text-gray-600 hover:bg-gray-100 data-[active]:bg-blue-600 data-[active]:text-white data-[active]:hover:bg-blue-700"
              }`,
            }}
          />
        </DemoWrapper>
      </Section>

      {/* ─── Minimal / Borderless ─────────────────────────────────────── */}
      <Section
        title="Minimal / Borderless"
        description="A clean, borderless style using only background and text color transitions."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="flex justify-center">
            <Pagination
              value={minimalPage}
              totalPages={12}
              onValueChange={setMinimalPage}
              classes={{
                ...c.pagination,
                root: "flex items-center",
                navButton: `p-1.5 rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer ${
                  dark
                    ? "hover:bg-gray-700 text-gray-400"
                    : "hover:bg-gray-100 text-gray-500"
                }`,
                pageButton: `min-w-[36px] h-9 rounded-md flex items-center justify-center text-sm font-medium transition-colors cursor-pointer ${
                  dark
                    ? "text-gray-400 hover:bg-gray-700 hover:text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`,
                activePageButton: `min-w-[36px] h-9 rounded-md flex items-center justify-center text-sm font-medium ${
                  dark ? "bg-gray-700 text-white" : "bg-gray-900 text-white"
                }`,
                ellipsis: `px-1 ${dark ? "text-gray-600" : "text-gray-300"}`,
                pageButtons: "flex items-center gap-0.5",
                prevIcon: "w-4 h-4",
                nextIcon: "w-4 h-4",
              }}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Compact ──────────────────────────────────────────────────── */}
      <Section
        title="Compact"
        description="Smaller sizing for tight spaces like card footers or sidebars."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="flex justify-center">
            <Pagination
              value={compactPage}
              totalPages={8}
              onValueChange={setCompactPage}
              classes={{
                ...c.pagination,
                root: "flex items-center gap-0.5",
                navButton: `p-1 rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
                  dark
                    ? "hover:bg-gray-700 text-gray-400"
                    : "hover:bg-gray-100 text-gray-500"
                }`,
                pageButton: `px-2 py-0.5 text-sm rounded transition-colors cursor-pointer ${
                  dark
                    ? "hover:bg-gray-700 text-gray-300"
                    : "hover:bg-gray-100 text-gray-700"
                }`,
                activePageButton:
                  "px-2 py-0.5 text-sm rounded bg-blue-600 text-white",
                pageButtons: "flex items-center gap-0.5",
                ellipsis: `px-1 text-sm ${dark ? "text-gray-500" : "text-gray-400"}`,
                prevIcon: "w-3.5 h-3.5",
                nextIcon: "w-3.5 h-3.5",
              }}
            />
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Boundary Conditions ──────────────────────────────────────── */}
      <Section
        title="Boundary Conditions"
        description="Demonstrating zero pages, a single page, and disabled boundary states."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <DemoLabel isDarkMode={dark}>totalPages=0</DemoLabel>
              <Pagination
                value={1}
                totalPages={0}
                onValueChange={() => {}}
                classes={c.pagination}
              />
              <p className={c.label}>Both buttons disabled, no page buttons</p>
            </div>
            <div className="space-y-3">
              <DemoLabel isDarkMode={dark}>totalPages=1</DemoLabel>
              <Pagination
                value={edgeSinglePage}
                totalPages={1}
                onValueChange={setEdgeSinglePage}
                classes={c.pagination}
              />
              <p className={c.label}>
                Both buttons disabled, single active page
              </p>
            </div>
            <div className="space-y-3">
              <DemoLabel isDarkMode={dark}>First & last page</DemoLabel>
              <Pagination
                value={edgeBoundaryPage}
                totalPages={3}
                onValueChange={setEdgeBoundaryPage}
                classes={c.pagination}
              />
              <p className={c.label}>
                Navigate to page 1 or 3 to see disabled states
              </p>
            </div>
          </div>
        </DemoWrapper>
      </Section>

      {/* ─── Ref Forwarding ───────────────────────────────────────────── */}
      <Section
        title="Ref Forwarding & HTML Attributes"
        description="Forward a ref to the nav element and pass any standard HTML attributes via rest props."
        isDarkMode={dark}
      >
        <div className="mb-3 flex gap-2">
          <button
            className={c.btn}
            onClick={() => paginationRef.current?.focus()}
          >
            Focus pagination via ref
          </button>
          <button
            className={c.btn}
            onClick={() => {
              const el = document.getElementById("ref-demo-pagination");
              if (el) {
                el.style.outline = "2px solid #3b82f6";
                el.style.outlineOffset = "2px";
                el.style.borderRadius = "8px";
                setTimeout(() => {
                  el.style.outline = "none";
                }, 1500);
              }
            }}
          >
            Highlight via id
          </button>
        </div>
        <DemoWrapper isDarkMode={dark} layout="block">
          <Pagination
            ref={paginationRef}
            id="ref-demo-pagination"
            data-section="footer"
            tabIndex={-1}
            value={refPage}
            totalPages={5}
            onValueChange={setRefPage}
            className={`p-3 rounded-lg transition-all ${dark ? "focus:bg-gray-700/50" : "focus:bg-blue-50"}`}
            classes={c.pagination}
          />
        </DemoWrapper>
      </Section>

      {/* ─── Dropdown Z-Index ─────────────────────────────────────────── */}
      <Section
        title="Dropdown Z-Index"
        description="Use dropdownZIndex to control the stacking order of the rows-per-page dropdown when it overlaps other elements."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <Pagination
            value={zIndexPage}
            totalPages={10}
            onValueChange={setZIndexPage}
            showRowsPerPage
            rowsPerPage={zIndexRowsPerPage}
            onRowsPerPageChange={(rows) => {
              setZIndexRowsPerPage(rows);
              setZIndexPage(1);
            }}
            dropdownZIndex={100}
            classes={{
              ...c.pagination,
              root: "flex items-center justify-between gap-4",
            }}
          />
        </DemoWrapper>
      </Section>

      {/* ─── Disabled State ─────────────────────────────────────────── */}
      <Section
        title="Disabled State"
        description="Use the disabled prop to prevent user interaction with the pagination controls."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <Pagination
            value={3}
            totalPages={10}
            onValueChange={() => {}}
            disabled
            classes={c.pagination}
          />
        </DemoWrapper>
      </Section>

      {/* ─── onValueChange Callback ───────────────────────────────────── */}
      <Section
        title="onValueChange Callback"
        description="Use value and onValueChange to control the active page. Pair with defaultValue for uncontrolled usage."
        isDarkMode={dark}
      >
        <DemoWrapper isDarkMode={dark}>
          <Pagination
            value={valuePage}
            totalPages={10}
            onValueChange={setValuePage}
            classes={c.pagination}
          />
        </DemoWrapper>
      </Section>

      {/* ─── Props ────────────────────────────────────────────────────── */}
      <Section title="Props" isDarkMode={dark}>
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow
              name="value"
              type="number"
              description="Current active page (1-indexed, controlled)"
              isDarkMode={dark}
            />
            <PropRow
              name="defaultValue"
              type="number"
              defaultVal="1"
              description="Initial page for uncontrolled usage"
              isDarkMode={dark}
            />
            <PropRow
              name="totalPages"
              type="number"
              description="Total number of pages"
              isDarkMode={dark}
            />
            <PropRow
              name="onValueChange"
              type="(page: number) => void"
              description="Callback when page changes"
              isDarkMode={dark}
            />
            <PropRow
              name="siblingCount"
              type="number"
              defaultVal="1"
              description="Number of sibling pages around the current page"
              isDarkMode={dark}
            />
            <PropRow
              name="showRowsPerPage"
              type="boolean"
              defaultVal="false"
              description="Show the rows-per-page selector"
              isDarkMode={dark}
            />
            <PropRow
              name="rowsPerPage"
              type="number"
              description="Current rows per page value"
              isDarkMode={dark}
            />
            <PropRow
              name="onRowsPerPageChange"
              type="(rows: number) => void"
              description="Callback when rows per page changes"
              isDarkMode={dark}
            />
            <PropRow
              name="rowOptions"
              type="number[]"
              defaultVal="[5, 10, 25, 50, 100]"
              description="Available options for rows per page"
              isDarkMode={dark}
            />
            <PropRow
              name="rowsPerPageLabel"
              type="string"
              defaultVal='"rows"'
              description="Label shown after the rows selector"
              isDarkMode={dark}
            />
            <PropRow
              name="showLabel"
              type="string"
              defaultVal='"Show"'
              description="Label shown before the rows selector (i18n)"
              isDarkMode={dark}
            />
            <PropRow
              name="dropdownAriaLabel"
              type="string"
              defaultVal='"Rows per page"'
              description="ARIA label for the dropdown listbox (i18n)"
              isDarkMode={dark}
            />
            <PropRow
              name="dropdownDirection"
              type={'"up" | "down"'}
              defaultVal='"up"'
              description="Direction the rows-per-page dropdown opens"
              isDarkMode={dark}
            />
            <PropRow
              name="dropdownZIndex"
              type="number"
              defaultVal="50"
              description="z-index of the rows-per-page dropdown portal"
              isDarkMode={dark}
            />
            <PropRow
              name="prevIcon"
              type="ComponentType | ReactNode"
              description="Custom icon for the previous button"
              isDarkMode={dark}
            />
            <PropRow
              name="nextIcon"
              type="ComponentType | ReactNode"
              description="Custom icon for the next button"
              isDarkMode={dark}
            />
            <PropRow
              name="dropdownIcon"
              type="ComponentType | ReactNode"
              description="Custom icon for the dropdown button"
              isDarkMode={dark}
            />
            <PropRow
              name="renderEllipsis"
              type="(props) => ReactNode"
              description="Custom render for ellipsis. Receives { position, onValueChange }"
              isDarkMode={dark}
            />
            <PropRow
              name="renderPageInfo"
              type="(props) => ReactNode"
              description="Custom render for page info. Receives { value, totalPages, rowsPerPage }"
              isDarkMode={dark}
            />
            <PropRow
              name="sectionOrder"
              type="SectionName[]"
              defaultVal='["selector","pageInfo","nav"]'
              description="Order of rendered sections"
              isDarkMode={dark}
            />
            <PropRow
              name="classes"
              type="PaginationClasses"
              description="Slot class overrides (14 slots)"
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
              name="portalContainer"
              type="HTMLElement | null"
              defaultVal="document.body"
              description="Container element for the dropdown portal"
              isDarkMode={dark}
            />
            <PropRow
              name="prevAriaLabel"
              type="string"
              defaultVal='"Previous page"'
              description="Accessible label for the previous button (i18n)"
              isDarkMode={dark}
            />
            <PropRow
              name="nextAriaLabel"
              type="string"
              defaultVal='"Next page"'
              description="Accessible label for the next button (i18n)"
              isDarkMode={dark}
            />
            <PropRow
              name="paginationAriaLabel"
              type="string"
              defaultVal='"Pagination"'
              description="Accessible label for the nav landmark (i18n)"
              isDarkMode={dark}
            />
            <PropRow
              name="pageAriaLabel"
              type="(page: number) => string"
              description="Function to generate accessible label for page buttons (i18n)"
              isDarkMode={dark}
            />
          </PropsTable>
        </div>
      </Section>

      {/* ─── PaginationClasses Slots ──────────────────────────────────── */}
      <Section title="PaginationClasses Slots" isDarkMode={dark}>
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow
              name="root"
              type="string"
              description="Outer nav container"
              isDarkMode={dark}
            />
            <PropRow
              name="nav"
              type="string"
              description="Navigation area wrapper"
              isDarkMode={dark}
            />
            <PropRow
              name="pageButtons"
              type="string"
              description="Page buttons container"
              isDarkMode={dark}
            />
            <PropRow
              name="pageButton"
              type="string"
              description="Inactive page buttons"
              isDarkMode={dark}
            />
            <PropRow
              name="activePageButton"
              type="string"
              description="Active page button"
              isDarkMode={dark}
            />
            <PropRow
              name="navButton"
              type="string"
              description="Prev/next buttons"
              isDarkMode={dark}
            />
            <PropRow
              name="ellipsis"
              type="string"
              description="Ellipsis elements"
              isDarkMode={dark}
            />
            <PropRow
              name="selector"
              type="string"
              description="Rows-per-page selector container"
              isDarkMode={dark}
            />
            <PropRow
              name="selectorButton"
              type="string"
              description="Rows selector trigger button"
              isDarkMode={dark}
            />
            <PropRow
              name="selectorDropdown"
              type="string"
              description="Rows dropdown menu (visual styles only, rendered via portal)"
              isDarkMode={dark}
            />
            <PropRow
              name="selectorDropdownWrapper"
              type="string"
              description="Dropdown wrapper"
              isDarkMode={dark}
            />
            <PropRow
              name="selectorOption"
              type="string"
              description="Each dropdown option"
              isDarkMode={dark}
            />
            <PropRow
              name="label"
              type="string"
              description='"Show" and rows label text'
              isDarkMode={dark}
            />
            <PropRow
              name="dropdownIcon"
              type="string"
              description="Dropdown chevron icon"
              isDarkMode={dark}
            />
            <PropRow
              name="prevIcon"
              type="string"
              description="Previous icon"
              isDarkMode={dark}
            />
            <PropRow
              name="nextIcon"
              type="string"
              description="Next icon"
              isDarkMode={dark}
            />
            <PropRow
              name="pageInfo"
              type="string"
              description="Page info section wrapper"
              isDarkMode={dark}
            />
          </PropsTable>
        </div>
      </Section>

      {/* ─── Data Attributes ──────────────────────────────────────────── */}
      <Section
        title="Data Attributes"
        description="Use for CSS-based state styling."
        isDarkMode={dark}
      >
        <div className={c.card}>
          <PropsTable isDarkMode={dark}>
            <PropRow
              name="data-disabled"
              type="nav buttons"
              description="Present when prev/next is disabled"
              isDarkMode={dark}
            />
            <PropRow
              name="data-active"
              type="page buttons"
              description="Present on the active page button"
              isDarkMode={dark}
            />
            <PropRow
              name="data-selected"
              type="row options"
              description="Present on the selected row option"
              isDarkMode={dark}
            />
            <PropRow
              name="data-highlighted"
              type="row options"
              description="Present on the keyboard-focused option"
              isDarkMode={dark}
            />
            <PropRow
              name='aria-current="page"'
              type="page buttons"
              description="ARIA active page indicator"
              isDarkMode={dark}
            />
            <PropRow
              name="data-state"
              type="dropdown portal"
              description='"open" when the dropdown is visible'
              isDarkMode={dark}
            />
            <PropRow
              name="data-direction"
              type="dropdown portal"
              description='"up" or "down" based on dropdownDirection'
              isDarkMode={dark}
            />
            <PropRow
              name="aria-expanded"
              type="selector button"
              description="Indicates dropdown open state"
              isDarkMode={dark}
            />
            <PropRow
              name="aria-controls"
              type="selector button"
              description="References the listbox when open"
              isDarkMode={dark}
            />
          </PropsTable>
        </div>
      </Section>

      {/* ─── Accessibility ────────────────────────────────────────────── */}
      <Section
        title="Accessibility"
        description="Built-in accessibility features."
        isDarkMode={dark}
      >
        <div className={c.card}>
          <div
            className={`space-y-2 text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}
          >
            {[
              'Rendered as <nav aria-label="Pagination"> landmark (overridable via paginationAriaLabel)',
              'Active page marked with aria-current="page"',
              "Prev/next buttons properly disabled at boundaries",
              'Ellipsis elements marked aria-hidden="true"',
              'Dropdown uses role="listbox" with aria-controls, aria-expanded, and aria-activedescendant',
              "Instance-scoped IDs via useId() prevent collisions with multiple instances",
              "All text labels customizable for i18n (showLabel, rowsPerPageLabel, dropdownAriaLabel, aria-label)",
              "Supports ref forwarding for programmatic focus management",
              "Extends native HTMLAttributes - accepts id, className, style, data-*, aria-*",
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
              ["Tab", "Move focus between pagination controls"],
              ["Enter / Space", "Select page or open/select dropdown option"],
              ["Arrow Up / Down", "Navigate dropdown options"],
              ["Home / End", "Jump to first/last dropdown option"],
              ["Escape", "Close dropdown and return focus to trigger"],
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
        summary="Wire `value`, `totalPages`, `rowsPerPage`, and handlers from your data layer. The component does not fetch; it reflects the slice you already computed."
      />
      <DocEdgeCases
        isDarkMode={dark}
        items={[
          "Zero or one total pages: hide or simplify controls per UX guidelines.",
          "Changing `rowsPerPage` should reset or clamp `value` in the parent.",
          "Large page counts may need URL sync—keep focus stable after navigation.",
        ]}
      />
      <DocDoDont
        isDarkMode={dark}
        dos={[
          "Provide `paginationAriaLabel` or root `aria-label` / `aria-labelledby`.",
          "Keep keyboard order logical for prev/next and page buttons.",
          "Announce loading states at the table level, not only inside cells.",
        ]}
        donts={[
          "Do not use pagination as the only way to reach records—offer search/filter.",
          "Do not omit disabled state for unavailable prev/next.",
          "Do not generate thousands of page buttons without ellipsis.",
        ]}
      />
    </div>
  );
};

export default PaginationDemo;
