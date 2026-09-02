import type { CSSProperties, ReactNode } from "react";
import { SearchIcon } from "../icons";
import { isInteractiveElement } from "../utils";

/**
 * The card layout Table renders below its responsive breakpoint.
 *
 * Split out to be `React.lazy`-loaded: it is a second complete render path,
 * 103 lines of it, that every desktop consumer downloaded and never executed.
 * `isMobileView` is derived from a client-side width measurement, so the server
 * always renders the desktop branch and this chunk is never requested during
 * SSR or hydration of a desktop viewport.
 *
 * Rows are typed `unknown` rather than generic: `React.lazy` erases a generic
 * component's type parameter, so Table casts at the call site instead.
 */
export interface MobileRow {
  id: string;
  original: unknown;
}

export interface TableMobileViewProps {
  /**
   * One callback rather than the two refs it replaces: Table owns both the
   * container ref and the forwarded ref, and a child writing to a ref it was
   * handed is what `react-hooks/refs` objects to.
   */
  setContainer: (node: HTMLDivElement | null) => void;
  containerClassName: string;
  className: string | undefined;
  containerStyle: CSSProperties | undefined;
  styleProp: CSSProperties | undefined;
  ariaLabel: string | undefined;

  showSearch: boolean;
  searchBarClassName: string;
  searchInputClassName: string;
  searchPlaceholder: string | undefined;
  SearchIconOverride: React.ComponentType<{ className?: string }> | undefined;
  globalFilter: string | undefined;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearSearch: () => void;

  children: ReactNode;

  isEmpty: boolean;
  emptyContent: ReactNode;
  emptyClassName: string;

  rows: MobileRow[];
  mobileCardClassName: string;
  renderMobileCard: (row: unknown) => ReactNode;
  onRowClick: ((row: unknown) => void) | undefined;
  onContextMenu: ((e: React.MouseEvent, row: unknown) => void) | undefined;

  enableInfiniteScroll: boolean;
  loadingMore: boolean;
  loadingMoreClassName: string;
  loadingMoreContent: ReactNode;
}

export default function TableMobileView({
  setContainer,
  containerClassName,
  className,
  containerStyle,
  styleProp,
  ariaLabel,
  showSearch,
  searchBarClassName,
  searchInputClassName,
  searchPlaceholder,
  SearchIconOverride,
  globalFilter,
  onSearchChange,
  onClearSearch,
  children,
  isEmpty,
  emptyContent,
  emptyClassName,
  rows,
  mobileCardClassName,
  renderMobileCard,
  onRowClick,
  onContextMenu,
  enableInfiniteScroll,
  loadingMore,
  loadingMoreClassName,
  loadingMoreContent,
}: TableMobileViewProps) {
  return (
    <div
      ref={setContainer}
      className={`${containerClassName} ${className ?? ""}`.trim() || undefined}
      style={{ overflow: "hidden", ...containerStyle, ...styleProp }}
      role="region"
      aria-label={ariaLabel}
      data-table-container
      data-mobile-view
    >
      {showSearch && (
        <div className={`mb-2 ${searchBarClassName}`} data-table-search>
          <div className="relative">
            {SearchIconOverride ? (
              <SearchIconOverride className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            ) : (
              <SearchIcon className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            )}
            <input
              type="text"
              value={globalFilter ?? ""}
              onChange={onSearchChange}
              placeholder={searchPlaceholder}
              className={`w-full pl-8 pr-8 py-2 border rounded bg-inherit text-inherit border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 ${searchInputClassName}`}
              aria-label="Search table"
            />
            {globalFilter && (
              <button
                type="button"
                onClick={onClearSearch}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                aria-label="Clear search"
              >
                <svg
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="w-3.5 h-3.5"
                >
                  <path d="M4.646 4.646a.5.5 0 01.708 0L8 7.293l2.646-2.647a.5.5 0 01.708.708L8.707 8l2.647 2.646a.5.5 0 01-.708.708L8 8.707l-2.646 2.647a.5.5 0 01-.708-.708L7.293 8 4.646 5.354a.5.5 0 010-.708z" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}
      {children}
      {isEmpty
        ? emptyContent || (
            <div className={emptyClassName}>
              <span>No data available</span>
            </div>
          )
        : rows.map((row) => (
            <div
              key={row.id}
              className={mobileCardClassName}
              data-mobile-card
              onClick={(e) => {
                if (onRowClick && !isInteractiveElement(e.target)) {
                  onRowClick(row.original);
                }
              }}
              onContextMenu={
                onContextMenu
                  ? (e) => {
                      e.preventDefault();
                      onContextMenu(e, row.original);
                    }
                  : undefined
              }
            >
              {renderMobileCard(row.original)}
            </div>
          ))}
      {enableInfiniteScroll && loadingMore && (
        <div
          className={`text-center flex items-center justify-center py-3 text-gray-400 ${loadingMoreClassName}`}
          data-loading-more
        >
          {loadingMoreContent ?? "Loading more..."}
        </div>
      )}
    </div>
  );
}
