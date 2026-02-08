import { useState, useRef, useEffect } from "react";
import { Pagination } from "../../components/Pagination";
import { useTheme } from "./ThemeContext";
import { Section, CodeBlock, DemoWrapper, DemoLabel } from "./components";


interface StatusBadgeProps {
  children: React.ReactNode;
  isDarkMode: boolean;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ children, isDarkMode }) => (
  <span className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full ${
    isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"
  }`}>
    {children}
  </span>
);


const ArrowLeftIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

const CaretDownIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

const DoubleArrowLeftIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
  </svg>
);

const DoubleArrowRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
  </svg>
);


const JumpToPageEllipsis = ({
  onPageChange,
  isDarkMode,
  variant = "default",
}: {
  onPageChange: (page: number) => void;
  isDarkMode: boolean;
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
      isDarkMode
        ? "text-gray-400 hover:bg-gray-700 hover:text-gray-200"
        : "text-gray-400 hover:bg-gray-100 hover:text-gray-600"
    }`,
    pill: `w-9 h-9 rounded-full flex items-center justify-center text-sm cursor-pointer transition-all ${
      isDarkMode
        ? "text-gray-400 border border-gray-600 hover:bg-gray-700 hover:text-gray-200 hover:border-gray-500"
        : "text-gray-400 border border-gray-200 hover:bg-gray-100 hover:text-gray-600 hover:border-gray-300"
    }`,
    ghost: `px-2 py-1 rounded-md text-sm cursor-pointer transition-colors ${
      isDarkMode
        ? "text-gray-500 hover:text-gray-300"
        : "text-gray-400 hover:text-gray-600"
    }`,
  };

  const inputStyles = {
    default: `w-12 px-1 py-1 text-sm text-center rounded-lg border outline-none transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
      isDarkMode
        ? "bg-gray-700 border-gray-500 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
        : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
    }`,
    pill: `w-9 h-9 text-sm text-center rounded-full border outline-none transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
      isDarkMode
        ? "bg-gray-700 border-blue-500 text-white placeholder-gray-500 ring-1 ring-blue-500/40"
        : "bg-white border-blue-500 text-gray-900 placeholder-gray-400 ring-1 ring-blue-500/30"
    }`,
    ghost: `w-10 px-1 py-1 text-sm text-center rounded-md border-b-2 border-t-0 border-x-0 outline-none transition-colors bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
      isDarkMode
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
        if (e.key === "Enter") {
          handleSubmit();
        }
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


const PaginationDemo = () => {
  const { isDarkMode } = useTheme();

  const [basicPage, setBasicPage] = useState(1);
  const [rowsPage, setRowsPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [styledPage, setStyledPage] = useState(1);
  const [styledRowsPerPage, setStyledRowsPerPage] = useState(10);
  const [manyPagesPage, setManyPagesPage] = useState(1);
  const [sibling2Page, setSibling2Page] = useState(5);
  const [customRowsPage, setCustomRowsPage] = useState(1);
  const [customRowsPerPage, setCustomRowsPerPage] = useState(20);
  const [compactPage, setCompactPage] = useState(1);
  const [customIconsPage, setCustomIconsPage] = useState(1);
  const [customIconsRowsPerPage, setCustomIconsRowsPerPage] = useState(10);
  const [doubleArrowPage, setDoubleArrowPage] = useState(1);
  const [dropdownDownPage, setDropdownDownPage] = useState(1);
  const [dropdownDownRowsPerPage, setDropdownDownRowsPerPage] = useState(10);
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
  const [dataAttrPage, setDataAttrPage] = useState(3);
  const [edgeSinglePage, setEdgeSinglePage] = useState(1);
  const [edgeBoundaryPage, setEdgeBoundaryPage] = useState(1);
  const [refPage, setRefPage] = useState(1);
  const [minimalPage, setMinimalPage] = useState(1);
  const paginationRef = useRef<HTMLElement>(null);

  const s = {
    nav: `p-2 rounded-lg border transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
      isDarkMode
        ? "border-gray-600 hover:bg-gray-700 text-gray-300"
        : "border-gray-200 hover:bg-gray-50 text-gray-600"
    }`,
    page: `px-3 py-1 rounded-lg border transition-colors cursor-pointer ${
      isDarkMode
        ? "border-gray-600 hover:bg-gray-700 text-gray-300"
        : "border-gray-200 hover:bg-gray-50 text-gray-700"
    }`,
    activePage: "px-3 py-1 rounded-lg bg-blue-600 text-white border border-blue-600",
    ellipsis: `px-2 select-none ${isDarkMode ? "text-gray-500" : "text-gray-400"}`,
    icon: `w-5 h-5 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`,
    flex: "flex items-center gap-2",
    label: `text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`,
    selectorBtn: `flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
      isDarkMode
        ? "border-gray-600 bg-gray-700 text-gray-200 hover:bg-gray-600"
        : "border-gray-200 bg-white hover:bg-gray-50"
    }`,
    dropdownUp: `rounded-lg shadow-lg py-1 border min-w-[64px] ${
      isDarkMode
        ? "bg-gray-700 border-gray-600"
        : "bg-white border-gray-200"
    }`,
    dropdownDown: `rounded-lg shadow-lg py-1 border min-w-[64px] ${
      isDarkMode
        ? "bg-gray-700 border-gray-600"
        : "bg-white border-gray-200"
    }`,
    option: `px-4 py-1.5 w-full text-left cursor-pointer transition-colors ${
      isDarkMode
        ? "text-gray-200 hover:bg-gray-600 data-[selected]:bg-blue-900/60 data-[selected]:text-blue-300 data-[highlighted]:bg-gray-600"
        : "hover:bg-gray-50 data-[selected]:bg-blue-50 data-[selected]:text-blue-700 data-[highlighted]:bg-gray-100"
    }`,
    dropdownIcon: `w-4 h-4 transition-transform ${isDarkMode ? "text-gray-400" : "text-gray-500"}`,
  };

  return (
    <div className="space-y-16">
      <header>
        <h1 className={`text-3xl font-bold mb-3 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          Pagination
        </h1>
        <p className={`text-lg leading-relaxed ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
          A flexible, accessible pagination component with optional rows-per-page selector,
          custom ellipsis rendering, page info display, section reordering, i18n support,
          and extensive className-driven styling.
        </p>
        <div className="mt-6">
          <h3 className={`text-sm font-semibold mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
            Installation
          </h3>
          <CodeBlock isDarkMode={isDarkMode} code={`import { Pagination } from "@kern-ui/pagination";`} />
        </div>
      </header>

      <div className="space-y-12">
        <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          Core
        </h2>

        <Section
          title="Basic Pagination"
          description="Minimal setup with currentPage, totalPages, and onPageChange."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="flex flex-col items-center gap-4">
              <StatusBadge isDarkMode={isDarkMode}>Page {basicPage} of 5</StatusBadge>
              <Pagination
                currentPage={basicPage}
                totalPages={5}
                onPageChange={setBasicPage}
                containerClassName={s.flex}
                navButtonClassName={s.nav}
                pageButtonClassName={s.page}
                activePageButtonClassName={s.activePage}
                ellipsisClassName={s.ellipsis}
                prevIconClassName={s.icon}
                nextIconClassName={s.icon}
              />
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="With Rows Per Page"
          description="Enable the rows-per-page selector with showRowsPerPage, rowsPerPage, and onRowsPerPageChange."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="space-y-4">
              <StatusBadge isDarkMode={isDarkMode}>
                {rowsPerPage} rows/page &middot; Page {rowsPage} of {Math.ceil(100 / rowsPerPage)}
              </StatusBadge>
              <Pagination
                currentPage={rowsPage}
                totalPages={Math.ceil(100 / rowsPerPage)}
                rowsPerPage={rowsPerPage}
                onPageChange={setRowsPage}
                onRowsPerPageChange={(rows) => { setRowsPerPage(rows); setRowsPage(1); }}
                showRowsPerPage
                containerClassName="flex items-center justify-between gap-4"
                rowSelectorClassName="flex items-center gap-2"
                rowSelectorButtonClassName={s.selectorBtn}
                rowSelectorDropdownClassName={s.dropdownUp}
                rowSelectorOptionClassName={s.option}
                labelClassName={s.label}
                navContainerClassName={s.flex}
                navButtonClassName={s.nav}
                pageButtonClassName={s.page}
                activePageButtonClassName={s.activePage}
                ellipsisClassName={s.ellipsis}
                prevIconClassName={s.icon}
                nextIconClassName={s.icon}
                dropdownIconClassName={s.dropdownIcon}
              />
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Many Pages & Sibling Count"
          description="Ellipsis appear automatically for large page counts. Use siblingCount to control how many pages surround the current one."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="space-y-8">
              <div className="space-y-3">
                <DemoLabel isDarkMode={isDarkMode}>siblingCount=1 (default)</DemoLabel>
                <StatusBadge isDarkMode={isDarkMode}>Page {manyPagesPage} of 50</StatusBadge>
                <Pagination
                  currentPage={manyPagesPage}
                  totalPages={50}
                  siblingCount={1}
                  onPageChange={setManyPagesPage}
                  containerClassName={s.flex}
                  navButtonClassName={s.nav}
                  pageButtonClassName={s.page}
                  activePageButtonClassName={s.activePage}
                  ellipsisClassName={s.ellipsis}
                  prevIconClassName={s.icon}
                  nextIconClassName={s.icon}
                />
              </div>
              <div className={`border-t pt-8 ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
                <div className="space-y-3">
                  <DemoLabel isDarkMode={isDarkMode}>siblingCount=2</DemoLabel>
                  <StatusBadge isDarkMode={isDarkMode}>Page {sibling2Page} of 30</StatusBadge>
                  <Pagination
                    currentPage={sibling2Page}
                    totalPages={30}
                    siblingCount={2}
                    onPageChange={setSibling2Page}
                    containerClassName={s.flex}
                    navButtonClassName={s.nav}
                    pageButtonClassName={s.page}
                    activePageButtonClassName={s.activePage}
                    ellipsisClassName={s.ellipsis}
                    prevIconClassName={s.icon}
                    nextIconClassName={s.icon}
                  />
                </div>
              </div>
            </div>
          </DemoWrapper>
        </Section>
      </div>

      <div className="space-y-12">
        <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          Advanced Features
        </h2>

        <Section
          title="Custom Ellipsis (Jump to Page)"
          description="Replace the default ellipsis with interactive content via renderEllipsis. Click an ellipsis to type a page number and press Enter. Three visual variants shown below."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="space-y-8">
              <div className="space-y-3">
                <DemoLabel isDarkMode={isDarkMode}>Default — bordered input</DemoLabel>
                <div className="flex flex-col items-center gap-3">
                  <StatusBadge isDarkMode={isDarkMode}>Page {jumpPage} of 50</StatusBadge>
                  <Pagination
                    currentPage={jumpPage}
                    totalPages={50}
                    onPageChange={setJumpPage}
                    renderEllipsis={({ onPageChange }) => (
                      <JumpToPageEllipsis onPageChange={onPageChange} isDarkMode={isDarkMode} variant="default" />
                    )}
                    containerClassName={s.flex}
                    navButtonClassName={s.nav}
                    pageButtonClassName={s.page}
                    activePageButtonClassName={s.activePage}
                    ellipsisClassName={s.ellipsis}
                    prevIconClassName={s.icon}
                    nextIconClassName={s.icon}
                  />
                </div>
              </div>
              <div className={`border-t pt-8 ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
                <div className="space-y-3">
                  <DemoLabel isDarkMode={isDarkMode}>Pill — circular input matching pill-style buttons</DemoLabel>
                  <div className="flex flex-col items-center gap-3">
                    <StatusBadge isDarkMode={isDarkMode}>Page {jumpPillPage} of 50</StatusBadge>
                    <Pagination
                      currentPage={jumpPillPage}
                      totalPages={50}
                      onPageChange={setJumpPillPage}
                      renderEllipsis={({ onPageChange }) => (
                        <JumpToPageEllipsis onPageChange={onPageChange} isDarkMode={isDarkMode} variant="pill" />
                      )}
                      containerClassName="flex items-center gap-1"
                      navButtonClassName={`p-2 rounded-full border shadow-sm transition-shadow disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
                        isDarkMode ? "bg-gray-700 border-gray-600 text-gray-300" : "bg-white border-gray-200"
                      }`}
                      pageButtonClassName={`w-9 h-9 rounded-full border shadow-sm flex items-center justify-center text-sm transition-shadow cursor-pointer ${
                        isDarkMode ? "bg-gray-700 border-gray-600 text-gray-200" : "bg-white border-gray-200"
                      }`}
                      activePageButtonClassName="w-9 h-9 rounded-full shadow-md flex items-center justify-center text-sm bg-blue-600 text-white"
                      pageButtonsContainerClassName="flex items-center gap-1"
                      prevIconClassName={`w-4 h-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                      nextIconClassName={`w-4 h-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                    />
                  </div>
                </div>
              </div>
              <div className={`border-t pt-8 ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
                <div className="space-y-3">
                  <DemoLabel isDarkMode={isDarkMode}>Ghost — underline-only input for minimal styles</DemoLabel>
                  <div className="flex flex-col items-center gap-3">
                    <StatusBadge isDarkMode={isDarkMode}>Page {jumpGhostPage} of 30</StatusBadge>
                    <Pagination
                      currentPage={jumpGhostPage}
                      totalPages={30}
                      onPageChange={setJumpGhostPage}
                      renderEllipsis={({ onPageChange }) => (
                        <JumpToPageEllipsis onPageChange={onPageChange} isDarkMode={isDarkMode} variant="ghost" />
                      )}
                      containerClassName="flex items-center"
                      navButtonClassName={`p-1.5 rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer ${
                        isDarkMode ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-100 text-gray-500"
                      }`}
                      pageButtonClassName={`min-w-[36px] h-9 rounded-md flex items-center justify-center text-sm font-medium transition-colors cursor-pointer ${
                        isDarkMode ? "text-gray-400 hover:bg-gray-700 hover:text-white" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                      activePageButtonClassName={`min-w-[36px] h-9 rounded-md flex items-center justify-center text-sm font-medium ${
                        isDarkMode ? "bg-gray-700 text-white" : "bg-gray-900 text-white"
                      }`}
                      pageButtonsContainerClassName="flex items-center gap-0.5"
                      prevIconClassName="w-4 h-4"
                      nextIconClassName="w-4 h-4"
                    />
                  </div>
                </div>
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Page Info Display"
          description='Use renderPageInfo to show contextual information like "Page X of Y" between sections.'
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Pagination
              currentPage={pageInfoPage}
              totalPages={Math.ceil(100 / pageInfoRowsPerPage)}
              rowsPerPage={pageInfoRowsPerPage}
              onPageChange={setPageInfoPage}
              onRowsPerPageChange={(rows) => { setPageInfoRowsPerPage(rows); setPageInfoPage(1); }}
              showRowsPerPage
              renderPageInfo={({ currentPage, totalPages, rowsPerPage: rpp }) => (
                <span className={`text-sm tabular-nums ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Page {currentPage} of {totalPages}{rpp ? ` (${rpp} per page)` : ""}
                </span>
              )}
              containerClassName="flex items-center justify-between gap-4 flex-wrap"
              rowSelectorClassName="flex items-center gap-2"
              rowSelectorButtonClassName={s.selectorBtn}
              rowSelectorDropdownClassName={s.dropdownUp}
              rowSelectorOptionClassName={s.option}
              labelClassName={s.label}
              pageInfoClassName="flex items-center"
              navContainerClassName={s.flex}
              navButtonClassName={s.nav}
              pageButtonClassName={s.page}
              activePageButtonClassName={s.activePage}
              ellipsisClassName={s.ellipsis}
              prevIconClassName={s.icon}
              nextIconClassName={s.icon}
              dropdownIconClassName={s.dropdownIcon}
            />
          </DemoWrapper>
        </Section>

        <Section
          title="Section Reordering"
          description='Use sectionOrder to control the layout. Here, navigation is first and the rows selector is last.'
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Pagination
              currentPage={reorderedPage}
              totalPages={Math.ceil(100 / reorderedRowsPerPage)}
              rowsPerPage={reorderedRowsPerPage}
              onPageChange={setReorderedPage}
              onRowsPerPageChange={(rows) => { setReorderedRowsPerPage(rows); setReorderedPage(1); }}
              showRowsPerPage
              sectionOrder={["nav", "pageInfo", "selector"]}
              renderPageInfo={({ currentPage, totalPages }) => (
                <span className={`text-sm tabular-nums ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  {currentPage} / {totalPages}
                </span>
              )}
              containerClassName="flex items-center justify-between gap-4"
              rowSelectorClassName="flex items-center gap-2"
              rowSelectorButtonClassName={s.selectorBtn}
              rowSelectorDropdownClassName={s.dropdownUp}
              rowSelectorOptionClassName={s.option}
              labelClassName={s.label}
              pageInfoClassName="flex items-center"
              navContainerClassName={s.flex}
              navButtonClassName={s.nav}
              pageButtonClassName={s.page}
              activePageButtonClassName={s.activePage}
              ellipsisClassName={s.ellipsis}
              prevIconClassName={s.icon}
              nextIconClassName={s.icon}
              dropdownIconClassName={s.dropdownIcon}
            />
          </DemoWrapper>
        </Section>

        <Section
          title="External Rows Control"
          description="Manage rows-per-page with your own UI by omitting showRowsPerPage and controlling totalPages externally."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Items per page:
                </span>
                {[10, 25, 50, 100].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => { setExternalRows(r); setExternalPage(1); }}
                    className={`px-3 py-1.5 text-sm rounded-lg border cursor-pointer transition-all ${
                      externalRows === r
                        ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                        : isDarkMode
                          ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                          : "border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <StatusBadge isDarkMode={isDarkMode}>
                  {externalRows} items/page &middot; Page {externalPage} of {Math.ceil(200 / externalRows)}
                </StatusBadge>
                <Pagination
                  currentPage={externalPage}
                  totalPages={Math.ceil(200 / externalRows)}
                  onPageChange={setExternalPage}
                  containerClassName={s.flex}
                  navButtonClassName={s.nav}
                  pageButtonClassName={s.page}
                  activePageButtonClassName={s.activePage}
                  ellipsisClassName={s.ellipsis}
                  prevIconClassName={s.icon}
                  nextIconClassName={s.icon}
                />
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="i18n / Custom Labels"
          description="Customize all visible text with showLabel, rowsPerPageLabel, and dropdownAriaLabel for internationalization."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="space-y-4">
              <Pagination
                currentPage={i18nPage}
                totalPages={Math.ceil(100 / i18nRowsPerPage)}
                rowsPerPage={i18nRowsPerPage}
                onPageChange={setI18nPage}
                onRowsPerPageChange={(rows) => { setI18nRowsPerPage(rows); setI18nPage(1); }}
                showRowsPerPage
                showLabel="Afficher"
                rowsPerPageLabel="lignes"
                dropdownAriaLabel="Lignes par page"
                paginationAriaLabel="Navigation des pages"
                prevAriaLabel="Page précédente"
                nextAriaLabel="Page suivante"
                pageAriaLabel={(page) => `Page ${page}`}
                renderPageInfo={({ currentPage, totalPages }) => (
                  <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                    Page {currentPage} sur {totalPages}
                  </span>
                )}
                containerClassName="flex items-center justify-between gap-4 flex-wrap"
                rowSelectorClassName="flex items-center gap-2"
                rowSelectorButtonClassName={s.selectorBtn}
                rowSelectorDropdownClassName={s.dropdownUp}
                rowSelectorOptionClassName={s.option}
                labelClassName={s.label}
                pageInfoClassName="flex items-center"
                navContainerClassName={s.flex}
                navButtonClassName={s.nav}
                pageButtonClassName={s.page}
                activePageButtonClassName={s.activePage}
                ellipsisClassName={s.ellipsis}
                prevIconClassName={s.icon}
                nextIconClassName={s.icon}
                dropdownIconClassName={s.dropdownIcon}
              />
              <CodeBlock isDarkMode={isDarkMode} code={`<Pagination
  showLabel="Afficher"
  rowsPerPageLabel="lignes"
  dropdownAriaLabel="Lignes par page"
  paginationAriaLabel="Navigation des pages"
  prevAriaLabel="Page précédente"
  nextAriaLabel="Page suivante"
  pageAriaLabel={(page) => \`Page \${page}\`}
  ...
/>`} />
            </div>
          </DemoWrapper>
        </Section>
      </div>

      <div className="space-y-12">
        <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          Customization
        </h2>

        <Section
          title="Custom Icons"
          description="Pass icon components via prevIcon, nextIcon, and dropdownIcon. Supports both component functions and ReactNode elements."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="space-y-8">
              <div className="space-y-3">
                <DemoLabel isDarkMode={isDarkMode}>Component functions (ArrowLeft / ArrowRight / CaretDown)</DemoLabel>
                <Pagination
                  currentPage={customIconsPage}
                  totalPages={Math.ceil(100 / customIconsRowsPerPage)}
                  rowsPerPage={customIconsRowsPerPage}
                  onPageChange={setCustomIconsPage}
                  onRowsPerPageChange={(rows) => { setCustomIconsRowsPerPage(rows); setCustomIconsPage(1); }}
                  showRowsPerPage
                  prevIcon={ArrowLeftIcon}
                  nextIcon={ArrowRightIcon}
                  dropdownIcon={CaretDownIcon}
                  containerClassName="flex items-center justify-between gap-4"
                  rowSelectorClassName="flex items-center gap-2"
                  rowSelectorButtonClassName={s.selectorBtn}
                  rowSelectorDropdownClassName={s.dropdownUp}
                  rowSelectorOptionClassName={s.option}
                  labelClassName={s.label}
                  navContainerClassName={s.flex}
                  navButtonClassName={`p-2 rounded-lg border transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
                    isDarkMode
                      ? "border-indigo-700 bg-indigo-900/30 hover:bg-indigo-800/50 text-indigo-300"
                      : "border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-600"
                  }`}
                  pageButtonClassName={s.page}
                  activePageButtonClassName="px-3 py-1 rounded-lg border border-indigo-600 bg-indigo-600 text-white"
                  ellipsisClassName={s.ellipsis}
                  prevIconClassName={`w-5 h-5 ${isDarkMode ? "text-indigo-300" : "text-indigo-600"}`}
                  nextIconClassName={`w-5 h-5 ${isDarkMode ? "text-indigo-300" : "text-indigo-600"}`}
                  dropdownIconClassName={s.dropdownIcon}
                />
              </div>
              <div className={`border-t pt-8 ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
                <div className="space-y-3">
                  <DemoLabel isDarkMode={isDarkMode}>ReactNode elements (DoubleArrowLeft / DoubleArrowRight)</DemoLabel>
                  <div className="flex justify-center">
                    <Pagination
                      currentPage={doubleArrowPage}
                      totalPages={20}
                      onPageChange={setDoubleArrowPage}
                      prevIcon={<DoubleArrowLeftIcon className={`w-5 h-5 ${isDarkMode ? "text-emerald-300" : "text-emerald-600"}`} />}
                      nextIcon={<DoubleArrowRightIcon className={`w-5 h-5 ${isDarkMode ? "text-emerald-300" : "text-emerald-600"}`} />}
                      containerClassName={s.flex}
                      navButtonClassName={`p-2 rounded-full border transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
                        isDarkMode
                          ? "border-emerald-700 bg-emerald-900/30 hover:bg-emerald-800/50"
                          : "border-emerald-200 bg-emerald-50 hover:bg-emerald-100"
                      }`}
                      pageButtonClassName={s.page}
                      activePageButtonClassName="px-3 py-1 rounded-lg border border-emerald-600 bg-emerald-600 text-white"
                      ellipsisClassName={s.ellipsis}
                      prevIconClassName={s.icon}
                      nextIconClassName={s.icon}
                    />
                  </div>
                </div>
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Custom Row Options & Label"
          description="Provide custom values via rowOptions and change the label with rowsPerPageLabel."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="space-y-3">
              <StatusBadge isDarkMode={isDarkMode}>
                Options: [20, 40, 60, 80, 100] &middot; Label: "items"
              </StatusBadge>
              <Pagination
                currentPage={customRowsPage}
                totalPages={Math.ceil(200 / customRowsPerPage)}
                rowsPerPage={customRowsPerPage}
                rowOptions={[20, 40, 60, 80, 100]}
                onPageChange={setCustomRowsPage}
                onRowsPerPageChange={(rows) => { setCustomRowsPerPage(rows); setCustomRowsPage(1); }}
                showRowsPerPage
                rowsPerPageLabel="items"
                containerClassName="flex items-center justify-between gap-4"
                rowSelectorClassName="flex items-center gap-2"
                rowSelectorButtonClassName={s.selectorBtn}
                rowSelectorDropdownClassName={s.dropdownUp}
                rowSelectorOptionClassName={s.option}
                labelClassName={s.label}
                navContainerClassName={s.flex}
                navButtonClassName={s.nav}
                pageButtonClassName={s.page}
                activePageButtonClassName={s.activePage}
                ellipsisClassName={s.ellipsis}
                prevIconClassName={s.icon}
                nextIconClassName={s.icon}
                dropdownIconClassName={s.dropdownIcon}
              />
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Dropdown Direction"
          description='Control whether the rows-per-page dropdown opens upward (default) or downward with dropdownDirection.'
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="space-y-8">
              <div className="space-y-3">
                <DemoLabel isDarkMode={isDarkMode}>direction="up" (default)</DemoLabel>
                <Pagination
                  currentPage={rowsPage}
                  totalPages={Math.ceil(100 / rowsPerPage)}
                  rowsPerPage={rowsPerPage}
                  onPageChange={setRowsPage}
                  onRowsPerPageChange={(rows) => { setRowsPerPage(rows); setRowsPage(1); }}
                  showRowsPerPage
                  dropdownDirection="up"
                  containerClassName="flex items-center justify-between gap-4"
                  rowSelectorClassName="flex items-center gap-2"
                  rowSelectorButtonClassName={s.selectorBtn}
                  rowSelectorDropdownClassName={s.dropdownUp}
                  rowSelectorOptionClassName={s.option}
                  labelClassName={s.label}
                  navContainerClassName={s.flex}
                  navButtonClassName={s.nav}
                  pageButtonClassName={s.page}
                  activePageButtonClassName={s.activePage}
                  ellipsisClassName={s.ellipsis}
                  prevIconClassName={s.icon}
                  nextIconClassName={s.icon}
                  dropdownIconClassName={s.dropdownIcon}
                />
              </div>
              <div className={`border-t pt-8 ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
                <div className="space-y-3">
                  <DemoLabel isDarkMode={isDarkMode}>direction="down"</DemoLabel>
                  <Pagination
                    currentPage={dropdownDownPage}
                    totalPages={Math.ceil(100 / dropdownDownRowsPerPage)}
                    rowsPerPage={dropdownDownRowsPerPage}
                    onPageChange={setDropdownDownPage}
                    onRowsPerPageChange={(rows) => { setDropdownDownRowsPerPage(rows); setDropdownDownPage(1); }}
                    showRowsPerPage
                    dropdownDirection="down"
                    containerClassName="flex items-center justify-between gap-4"
                    rowSelectorClassName="flex items-center gap-2"
                    rowSelectorButtonClassName={s.selectorBtn}
                    rowSelectorDropdownClassName={s.dropdownDown}
                    rowSelectorOptionClassName={s.option}
                    labelClassName={s.label}
                    navContainerClassName={s.flex}
                    navButtonClassName={s.nav}
                    pageButtonClassName={s.page}
                    activePageButtonClassName={s.activePage}
                    ellipsisClassName={s.ellipsis}
                    prevIconClassName={s.icon}
                    nextIconClassName={s.icon}
                    dropdownIconClassName={s.dropdownIcon}
                  />
                </div>
              </div>
            </div>
          </DemoWrapper>
          <div className={`mt-4 p-3 rounded-lg ${isDarkMode ? "bg-blue-900/30 border border-blue-800" : "bg-blue-50 border border-blue-200"}`}>
            <p className={`text-sm ${isDarkMode ? "text-blue-200" : "text-blue-800"}`}>
              <strong>Note:</strong> The dropdown is rendered via a{" "}
              <code className={`px-1 py-0.5 border rounded text-xs font-mono ${isDarkMode ? "bg-gray-800/80 border-gray-600 text-gray-300" : "bg-white border-gray-300 text-gray-700"}`}>React Portal</code>{" "}
              into{" "}
              <code className={`px-1 py-0.5 border rounded text-xs font-mono ${isDarkMode ? "bg-gray-800/80 border-gray-600 text-gray-300" : "bg-white border-gray-300 text-gray-700"}`}>document.body</code>,{" "}
              so it is never clipped by{" "}
              <code className={`px-1 py-0.5 border rounded text-xs font-mono ${isDarkMode ? "bg-gray-800/80 border-gray-600 text-gray-300" : "bg-white border-gray-300 text-gray-700"}`}>overflow: hidden</code>{" "}
              ancestors. The component handles positioning and{" "}
              <code className={`px-1 py-0.5 border rounded text-xs font-mono ${isDarkMode ? "bg-gray-800/80 border-gray-600 text-gray-300" : "bg-white border-gray-300 text-gray-700"}`}>z-index</code>{" "}
              via inline styles, so you do NOT need to add positioning or z-index classes to{" "}
              <code className={`px-1 py-0.5 border rounded text-xs font-mono ${isDarkMode ? "bg-gray-800/80 border-gray-600 text-gray-300" : "bg-white border-gray-300 text-gray-700"}`}>rowSelectorDropdownClassName</code>.{" "}
              It uses{" "}
              <code className={`px-1 py-0.5 border rounded text-xs font-mono ${isDarkMode ? "bg-gray-800/80 border-gray-600 text-gray-300" : "bg-white border-gray-300 text-gray-700"}`}>role="listbox"</code>{" "}
              with{" "}
              <code className={`px-1 py-0.5 border rounded text-xs font-mono ${isDarkMode ? "bg-gray-800/80 border-gray-600 text-gray-300" : "bg-white border-gray-300 text-gray-700"}`}>aria-activedescendant</code>{" "}
              for keyboard navigation. Focus automatically moves to the listbox when opened and returns to the trigger when closed.
            </p>
          </div>
        </Section>
      </div>

      <div className="space-y-12">
        <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          Styling Variations
        </h2>

        <Section
          title="Pill Style"
          description="Rounded pill-shaped buttons with shadows for a modern, elevated look."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Pagination
              currentPage={styledPage}
              totalPages={10}
              rowsPerPage={styledRowsPerPage}
              onPageChange={setStyledPage}
              onRowsPerPageChange={(rows) => { setStyledRowsPerPage(rows); setStyledPage(1); }}
              showRowsPerPage
              containerClassName={`flex items-center justify-between gap-6 p-4 rounded-xl ${
                isDarkMode ? "bg-gray-700/40" : "bg-gray-50"
              }`}
              rowSelectorClassName="flex items-center gap-2"
              rowSelectorButtonClassName={`flex items-center gap-2 px-4 py-2 rounded-full border shadow-sm hover:shadow transition-shadow cursor-pointer ${
                isDarkMode ? "bg-gray-700 border-gray-600 text-gray-200" : "bg-white border-gray-200"
              }`}
              rowSelectorDropdownClassName={`rounded-xl shadow-lg py-2 min-w-[80px] border ${
                isDarkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-200"
              }`}
              rowSelectorOptionClassName={`px-4 py-2 w-full text-left cursor-pointer transition-colors ${
                isDarkMode
                  ? "text-gray-200 hover:bg-purple-900/40 data-[selected]:bg-purple-900/60 data-[selected]:text-purple-300 data-[highlighted]:bg-purple-900/40"
                  : "hover:bg-purple-50 data-[selected]:bg-purple-100 data-[selected]:text-purple-700 data-[highlighted]:bg-purple-50"
              }`}
              labelClassName={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
              navContainerClassName="flex items-center gap-1"
              navButtonClassName={`p-2 rounded-full border shadow-sm hover:shadow transition-shadow disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
                isDarkMode ? "bg-gray-700 border-gray-600 text-gray-300" : "bg-white border-gray-200"
              }`}
              pageButtonClassName={`w-10 h-10 rounded-full border shadow-sm hover:shadow transition-shadow flex items-center justify-center cursor-pointer ${
                isDarkMode ? "bg-gray-700 border-gray-600 text-gray-200" : "bg-white border-gray-200"
              }`}
              activePageButtonClassName={`w-10 h-10 rounded-full shadow-md flex items-center justify-center bg-purple-600 text-white`}
              pageButtonsContainerClassName="flex items-center gap-1"
              ellipsisClassName={`px-2 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
              prevIconClassName={`w-5 h-5 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
              nextIconClassName={`w-5 h-5 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
              dropdownIconClassName={`w-4 h-4 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
            />
          </DemoWrapper>
        </Section>

        <Section
          title="Data-Attribute Styling"
          description="Use a single pageButtonClassName with data-[active]: variants instead of separate active/inactive classes."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="space-y-4">
              <div className="flex flex-col items-center gap-4">
                <Pagination
                  currentPage={dataAttrPage}
                  totalPages={10}
                  onPageChange={setDataAttrPage}
                  containerClassName={s.flex}
                  navButtonClassName={`p-2 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
                    isDarkMode ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-100 text-gray-500"
                  }`}
                  pageButtonClassName={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    isDarkMode
                      ? "text-gray-400 hover:bg-gray-700 hover:text-gray-200 data-[active]:bg-blue-600 data-[active]:text-white data-[active]:hover:bg-blue-700"
                      : "text-gray-600 hover:bg-gray-100 data-[active]:bg-blue-600 data-[active]:text-white data-[active]:hover:bg-blue-700"
                  }`}
                  activePageButtonClassName={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    isDarkMode
                      ? "text-gray-400 hover:bg-gray-700 hover:text-gray-200 data-[active]:bg-blue-600 data-[active]:text-white data-[active]:hover:bg-blue-700"
                      : "text-gray-600 hover:bg-gray-100 data-[active]:bg-blue-600 data-[active]:text-white data-[active]:hover:bg-blue-700"
                  }`}
                  ellipsisClassName={s.ellipsis}
                  prevIconClassName={s.icon}
                  nextIconClassName={s.icon}
                />
              </div>
              <CodeBlock isDarkMode={isDarkMode} code={`pageButtonClassName="text-gray-600 hover:bg-gray-100 data-[active]:bg-blue-600 data-[active]:text-white"
activePageButtonClassName={/* same as above */}`} />
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Minimal / Borderless"
          description="A clean, borderless style using only background and text color transitions."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="flex justify-center">
              <Pagination
                currentPage={minimalPage}
                totalPages={12}
                onPageChange={setMinimalPage}
                containerClassName="flex items-center"
                navButtonClassName={`p-1.5 rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer ${
                  isDarkMode ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-100 text-gray-500"
                }`}
                pageButtonClassName={`min-w-[36px] h-9 rounded-md flex items-center justify-center text-sm font-medium transition-colors cursor-pointer ${
                  isDarkMode ? "text-gray-400 hover:bg-gray-700 hover:text-white" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
                activePageButtonClassName={`min-w-[36px] h-9 rounded-md flex items-center justify-center text-sm font-medium ${
                  isDarkMode ? "bg-gray-700 text-white" : "bg-gray-900 text-white"
                }`}
                ellipsisClassName={`px-1 ${isDarkMode ? "text-gray-600" : "text-gray-300"}`}
                pageButtonsContainerClassName="flex items-center gap-0.5"
                prevIconClassName={`w-4 h-4`}
                nextIconClassName={`w-4 h-4`}
              />
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Compact"
          description="Smaller sizing for tight spaces like card footers or sidebars."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="flex justify-center">
              <Pagination
                currentPage={compactPage}
                totalPages={8}
                onPageChange={setCompactPage}
                containerClassName="flex items-center gap-0.5"
                navButtonClassName={`p-1 rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
                  isDarkMode ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-100 text-gray-500"
                }`}
                pageButtonClassName={`px-2 py-0.5 text-sm rounded transition-colors cursor-pointer ${
                  isDarkMode ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-100 text-gray-700"
                }`}
                activePageButtonClassName="px-2 py-0.5 text-sm rounded bg-blue-600 text-white"
                pageButtonsContainerClassName="flex items-center gap-0.5"
                ellipsisClassName={`px-1 text-sm ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
                prevIconClassName={`w-3.5 h-3.5`}
                nextIconClassName={`w-3.5 h-3.5`}
              />
            </div>
          </DemoWrapper>
        </Section>
      </div>

      <div className="space-y-12">
        <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          Edge Cases
        </h2>

        <Section
          title="Boundary Conditions"
          description="Demonstrating zero pages, a single page, and disabled boundary states."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <DemoLabel isDarkMode={isDarkMode}>totalPages=0</DemoLabel>
                <Pagination
                  currentPage={1}
                  totalPages={0}
                  onPageChange={() => {}}
                  containerClassName={s.flex}
                  navButtonClassName={s.nav}
                  prevIconClassName={s.icon}
                  nextIconClassName={s.icon}
                />
                <p className={`text-xs ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
                  Both buttons disabled, no page buttons
                </p>
              </div>
              <div className="space-y-3">
                <DemoLabel isDarkMode={isDarkMode}>totalPages=1</DemoLabel>
                <Pagination
                  currentPage={edgeSinglePage}
                  totalPages={1}
                  onPageChange={setEdgeSinglePage}
                  containerClassName={s.flex}
                  navButtonClassName={s.nav}
                  pageButtonClassName={s.page}
                  activePageButtonClassName={s.activePage}
                  prevIconClassName={s.icon}
                  nextIconClassName={s.icon}
                />
                <p className={`text-xs ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
                  Both buttons disabled, single active page
                </p>
              </div>
              <div className="space-y-3">
                <DemoLabel isDarkMode={isDarkMode}>First & last page</DemoLabel>
                <Pagination
                  currentPage={edgeBoundaryPage}
                  totalPages={3}
                  onPageChange={setEdgeBoundaryPage}
                  containerClassName={s.flex}
                  navButtonClassName={s.nav}
                  pageButtonClassName={s.page}
                  activePageButtonClassName={s.activePage}
                  prevIconClassName={s.icon}
                  nextIconClassName={s.icon}
                />
                <p className={`text-xs ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
                  Navigate to page 1 or 3 to see disabled states
                </p>
              </div>
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Ref Forwarding & HTML Attributes"
          description="Forward a ref to the nav element and pass any standard HTML attributes via rest props."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => paginationRef.current?.focus()}
                  className={`px-4 py-2 text-sm rounded-lg border transition-colors cursor-pointer ${
                    isDarkMode
                      ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                      : "border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Focus pagination via ref
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById("ref-demo-pagination");
                    if (el) {
                      el.style.outline = "2px solid #3b82f6";
                      el.style.outlineOffset = "2px";
                      el.style.borderRadius = "8px";
                      setTimeout(() => { el.style.outline = "none"; }, 1500);
                    }
                  }}
                  className={`px-4 py-2 text-sm rounded-lg border transition-colors cursor-pointer ${
                    isDarkMode
                      ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                      : "border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Highlight via id
                </button>
              </div>
              <Pagination
                ref={paginationRef}
                id="ref-demo-pagination"
                data-section="footer"
                tabIndex={-1}
                currentPage={refPage}
                totalPages={5}
                onPageChange={setRefPage}
                className={`p-3 rounded-lg transition-all ${isDarkMode ? "focus:bg-gray-700/50" : "focus:bg-blue-50"}`}
                containerClassName={s.flex}
                navButtonClassName={s.nav}
                pageButtonClassName={s.page}
                activePageButtonClassName={s.activePage}
                ellipsisClassName={s.ellipsis}
                prevIconClassName={s.icon}
                nextIconClassName={s.icon}
              />
              <CodeBlock isDarkMode={isDarkMode} code={`<Pagination
  ref={paginationRef}
  id="ref-demo-pagination"
  data-section="footer"
  className="p-3 rounded-lg focus:bg-blue-50"
  tabIndex={-1}
  ...
/>`} />
            </div>
          </DemoWrapper>
        </Section>

        <Section
          title="Dropdown Z-Index"
          description="Use dropdownZIndex to control the stacking order of the rows-per-page dropdown when it overlaps other elements like modals or sticky headers."
          isDarkMode={isDarkMode}
        >
          <DemoWrapper isDarkMode={isDarkMode}>
            <Pagination
              currentPage={1}
              totalPages={10}
              onPageChange={() => {}}
              showRowsPerPage
              rowsPerPage={10}
              onRowsPerPageChange={() => {}}
              dropdownZIndex={100}
              containerClassName="flex items-center justify-between gap-4"
              rowSelectorClassName="flex items-center gap-2"
              rowSelectorButtonClassName={s.selectorBtn}
              rowSelectorDropdownClassName={s.dropdownUp}
              rowSelectorOptionClassName={s.option}
              labelClassName={s.label}
              navContainerClassName={s.flex}
              navButtonClassName={s.nav}
              pageButtonClassName={s.page}
              activePageButtonClassName={s.activePage}
              ellipsisClassName={s.ellipsis}
              prevIconClassName={s.icon}
              nextIconClassName={s.icon}
            />
          </DemoWrapper>
          <CodeBlock
            isDarkMode={isDarkMode}
            code={`<Pagination
  showRowsPerPage
  rowsPerPage={10}
  dropdownZIndex={100}
  ...
/>

// Use higher values when nested inside modals:
<Pagination dropdownZIndex={10001} ... />`}
          />
        </Section>
      </div>

      <div className="space-y-8">
        <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          API Reference
        </h2>

        <div>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
            Props
          </h3>
          <div className="overflow-x-auto">
            <table className={`min-w-full text-sm ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}>
              <thead>
                <tr className={`border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
                  <th className="text-left py-3 pr-4 font-semibold">Prop</th>
                  <th className="text-left py-3 pr-4 font-semibold">Type</th>
                  <th className="text-left py-3 pr-4 font-semibold">Default</th>
                  <th className="text-left py-3 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-100"}`}>
                {[
                  ["currentPage", "number", "required", "Current active page (1-indexed)"],
                  ["totalPages", "number", "required", "Total number of pages"],
                  ["onPageChange", "(page: number) => void", "required", "Callback when page changes"],
                  ["siblingCount", "number", "1", "Number of sibling pages around the current page"],
                  ["showRowsPerPage", "boolean", "false", "Show the rows-per-page selector"],
                  ["rowsPerPage", "number", "-", "Current rows per page value"],
                  ["onRowsPerPageChange", "(rows: number) => void", "-", "Callback when rows per page changes"],
                  ["rowOptions", "number[]", "[5, 10, 25, 50, 100]", "Available options for rows per page"],
                  ["rowsPerPageLabel", "string", '"rows"', "Label shown after the rows selector"],
                  ["showLabel", "string", '"Show"', "Label shown before the rows selector (i18n)"],
                  ["dropdownAriaLabel", "string", '"Rows per page"', "ARIA label for the dropdown listbox (i18n)"],
                  ["dropdownDirection", '"up" | "down"', '"up"', "Direction the rows-per-page dropdown opens"],
                  ["dropdownZIndex", "number", "50", "z-index of the rows-per-page dropdown portal"],
                  ["prevIcon", "ComponentType | ReactNode", "ChevronLeftIcon", "Custom icon for the previous button"],
                  ["nextIcon", "ComponentType | ReactNode", "ChevronRightIcon", "Custom icon for the next button"],
                  ["dropdownIcon", "ComponentType | ReactNode", "ChevronDownIcon", "Custom icon for the dropdown button"],
                  ["renderEllipsis", "(props) => ReactNode", "-", "Custom render for ellipsis. Receives { position, onPageChange }"],
                  ["renderPageInfo", "(props) => ReactNode", "-", "Custom render for page info. Receives { currentPage, totalPages, rowsPerPage }"],
                  ["sectionOrder", "SectionName[]", '["selector", "pageInfo", "nav"]', "Order of rendered sections"],
                  ["portalContainer", "HTMLElement | null", "document.body", "Container element for the dropdown portal"],
                  ["prevAriaLabel", "string", '"Previous page"', "Accessible label for the previous button (i18n)"],
                  ["nextAriaLabel", "string", '"Next page"', "Accessible label for the next button (i18n)"],
                  ["paginationAriaLabel", "string", '"Pagination"', "Accessible label for the nav landmark (i18n)"],
                  ["pageAriaLabel", "(page: number) => string", 'Page ${page}', "Function to generate accessible label for page buttons (i18n)"],
                ].map(([prop, type, def, desc]) => (
                  <tr key={prop}>
                    <td className="py-3 pr-4 font-mono text-blue-500 whitespace-nowrap">{prop}</td>
                    <td className={`py-3 pr-4 whitespace-nowrap ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{type}</td>
                    <td className={`py-3 pr-4 whitespace-nowrap ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>{def}</td>
                    <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
            Styling Props
          </h3>
          <p className={`text-sm mb-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            All className props are type <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}>string</code>. Props marked with * are merged with internal defaults via tailwind-merge.
          </p>
          <div className="overflow-x-auto">
            <table className={`min-w-full text-sm ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}>
              <thead>
                <tr className={`border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
                  <th className="text-left py-3 pr-4 font-semibold">Prop</th>
                  <th className="text-left py-3 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-100"}`}>
                {[
                  ["containerClassName", "Outer nav container"],
                  ["className", "Additional classes on the nav (merged with containerClassName)"],
                  ["navContainerClassName *", "Navigation area wrapper (default: flex items-center gap-2)"],
                  ["navButtonClassName", "Prev/next buttons"],
                  ["pageButtonClassName", "Inactive page buttons"],
                  ["activePageButtonClassName", "Active page button"],
                  ["pageButtonsContainerClassName *", "Page buttons wrapper (default: flex items-center gap-2)"],
                  ["ellipsisClassName", "Ellipsis elements"],
                  ["rowSelectorClassName", "Rows-per-page selector container"],
                  ["rowSelectorButtonClassName", "Rows selector trigger button"],
                  ["rowSelectorDropdownClassName", "Rows dropdown menu (rendered via portal, visual styles only)"],
                  ["rowSelectorDropdownWrapperClassName *", 'Dropdown wrapper (default: "relative")'],
                  ["rowSelectorOptionClassName", "Each dropdown option"],
                  ["labelClassName", '"Show" and rows label text'],
                  ["pageInfoClassName", "Page info section wrapper"],
                  ["prevIconClassName", "Previous icon"],
                  ["nextIconClassName", "Next icon"],
                  ["dropdownIconClassName", "Dropdown chevron icon"],
                ].map(([prop, desc]) => (
                  <tr key={prop}>
                    <td className="py-3 pr-4 font-mono text-blue-500 whitespace-nowrap">{prop}</td>
                    <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
            Data Attributes
          </h3>
          <div className="overflow-x-auto">
            <table className={`min-w-full text-sm ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}>
              <thead>
                <tr className={`border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
                  <th className="text-left py-3 pr-4 font-semibold">Attribute</th>
                  <th className="text-left py-3 pr-4 font-semibold">Applied To</th>
                  <th className="text-left py-3 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-100"}`}>
                {[
                  ["data-disabled", "nav buttons", "Present when prev/next is disabled"],
                  ["data-active", "page buttons", "Present on the active page button"],
                  ["data-selected", "row options", "Present on the selected row option"],
                  ["data-highlighted", "row options", "Present on the keyboard-focused option"],
                  ['aria-current="page"', "page buttons", "ARIA active page indicator"],
                  ["data-state", "dropdown portal", '"open" when the dropdown is visible'],
                  ["data-direction", "dropdown portal", '"up" or "down" based on dropdownDirection'],
                  ["aria-expanded", "selector button", "Indicates dropdown open state"],
                  ["aria-controls", "selector button", "References the listbox when open"],
                ].map(([attr, target, desc]) => (
                  <tr key={attr}>
                    <td className="py-3 pr-4 font-mono text-blue-500 whitespace-nowrap">{attr}</td>
                    <td className={`py-3 pr-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{target}</td>
                    <td className={`py-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className={`text-sm mt-4 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
            Tailwind usage:{" "}
            <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}>
              data-[disabled]:opacity-50
            </code>{" "}
            <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}>
              data-[active]:bg-blue-600
            </code>
          </p>
        </div>

        <div>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
            Type Definitions
          </h3>
          <CodeBlock
            isDarkMode={isDarkMode}
            code={`interface IconProps {
  className?: string;
}

interface EllipsisRenderProps {
  position: "start" | "end";
  onPageChange: (page: number) => void;
}

interface PageInfoRenderProps {
  currentPage: number;
  totalPages: number;
  rowsPerPage?: number;
}

type SectionName = "selector" | "pageInfo" | "nav";

interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, "onChange"> {
  currentPage: number;
  totalPages: number;
  siblingCount?: number;
  rowsPerPage?: number;
  rowOptions?: number[];
  onPageChange: (page: number) => void;
  onRowsPerPageChange?: (rows: number) => void;
  showRowsPerPage?: boolean;
  rowsPerPageLabel?: string;
  showLabel?: string;
  dropdownAriaLabel?: string;
  dropdownDirection?: "up" | "down";
  dropdownZIndex?: number;
  dropdownIcon?: ComponentType<IconProps> | ReactNode;
  prevIcon?: ComponentType<IconProps> | ReactNode;
  nextIcon?: ComponentType<IconProps> | ReactNode;
  renderEllipsis?: (props: EllipsisRenderProps) => ReactNode;
  renderPageInfo?: (props: PageInfoRenderProps) => ReactNode;
  sectionOrder?: SectionName[];
  containerClassName?: string;
  rowSelectorClassName?: string;
  rowSelectorButtonClassName?: string;
  rowSelectorDropdownClassName?: string;
  rowSelectorDropdownWrapperClassName?: string;
  rowSelectorOptionClassName?: string;
  pageButtonClassName?: string;
  activePageButtonClassName?: string;
  navButtonClassName?: string;
  navContainerClassName?: string;
  pageButtonsContainerClassName?: string;
  ellipsisClassName?: string;
  labelClassName?: string;
  dropdownIconClassName?: string;
  prevIconClassName?: string;
  nextIconClassName?: string;
  pageInfoClassName?: string;
}`}
          />
        </div>
      </div>

      <div className="space-y-6">
        <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          Accessibility
        </h2>
        <div className={`p-5 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-gray-50"}`}>
          <h3 className={`font-semibold mb-3 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
            Features
          </h3>
          <ul className={`list-disc list-inside space-y-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            <li>
              Rendered as{" "}
              <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>&lt;nav aria-label="Pagination"&gt;</code>{" "}
              landmark (overridable via props)
            </li>
            <li>
              Active page marked with{" "}
              <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>aria-current="page"</code>
            </li>
            <li>Prev/next buttons properly disabled at boundaries</li>
            <li>
              Ellipsis elements marked{" "}
              <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>aria-hidden="true"</code>
            </li>
            <li>
              Dropdown uses{" "}
              <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>role="listbox"</code>{" "}
              with{" "}
              <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>aria-controls</code>,{" "}
              <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>aria-expanded</code>, and{" "}
              <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>aria-activedescendant</code>
            </li>
            <li>
              Instance-scoped IDs via{" "}
              <code className={`px-1.5 py-0.5 rounded text-sm ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>useId()</code>{" "}
              prevent collisions with multiple instances
            </li>
            <li>All text labels customizable for i18n (showLabel, rowsPerPageLabel, dropdownAriaLabel, aria-label)</li>
            <li>Supports ref forwarding for programmatic focus management</li>
          </ul>
        </div>

        <div className={`p-5 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-gray-50"}`}>
          <h3 className={`font-semibold mb-3 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
            Keyboard Navigation
          </h3>
          <div className={`space-y-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            {[
              ["Tab", "Move focus between pagination controls"],
              ["Enter / Space", "Select page or open/select dropdown option"],
              ["Arrow Up / Down", "Navigate dropdown options"],
              ["Home / End", "Jump to first/last dropdown option"],
              ["Escape", "Close dropdown and return focus to trigger"],
            ].map(([key, desc]) => (
              <div key={key} className="flex items-start gap-3">
                <kbd className={`px-2 py-1 rounded text-xs font-mono shrink-0 ${isDarkMode ? "bg-gray-900 border border-gray-600 text-gray-100" : "bg-white border border-gray-300 text-gray-700"}`}>
                  {key}
                </kbd>
                <span className="pt-0.5">{desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={`p-5 rounded-lg ${isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-gray-50 border border-gray-200"}`}>
        <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
          <strong>Note:</strong> Pagination extends native{" "}
          <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}>HTMLAttributes</code>{" "}
          and accepts all standard attributes ({" "}
          <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}>id</code>,{" "}
          <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}>className</code>,{" "}
          <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}>style</code>,{" "}
          <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}>data-*</code>,{" "}
          <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}>aria-*</code>{" "}
          ). It supports ref forwarding, and{" "}
          <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}>aria-label</code>{" "}
          defaults to "Pagination" but can be overridden for i18n.
        </p>
      </div>
    </div>
  );
};

export default PaginationDemo;
