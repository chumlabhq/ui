import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  useId,
  forwardRef,
  isValidElement,
  Fragment,
} from "react";
import type { PaginationProps, IconProps, SectionName } from "./utils/types";
import { DEFAULT_ROW_OPTIONS } from "./utils/constants";
import { getVisiblePages } from "./utils/helpers";
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from "./utils/icons";
import { cn } from "../../utils/cn";

function renderIcon(
  icon: React.ComponentType<IconProps> | React.ReactNode | undefined,
  DefaultIcon: React.ComponentType<IconProps>,
  iconClassName: string | undefined,
  defaultClassName: string,
) {
  const finalClassName = iconClassName || defaultClassName;

  if (!icon) {
    return <DefaultIcon className={finalClassName} />;
  }

  if (isValidElement(icon)) {
    return icon;
  }

  if (typeof icon === "function") {
    const IconComponent = icon as React.ComponentType<IconProps>;
    return <IconComponent className={finalClassName} />;
  }

  return <DefaultIcon className={finalClassName} />;
}

const DEFAULT_SECTION_ORDER: SectionName[] = ["selector", "pageInfo", "nav"];

const Pagination = forwardRef<HTMLElement, PaginationProps>(
  (
    {
      currentPage,
      totalPages,
      siblingCount = 1,
      rowsPerPage,
      rowOptions,
      onPageChange,
      onRowsPerPageChange,
      showRowsPerPage = false,
      rowsPerPageLabel = "rows",
      showLabel = "Show",
      dropdownAriaLabel = "Rows per page",
      dropdownDirection = "up",
      dropdownIcon,
      prevIcon,
      nextIcon,
      renderEllipsis,
      renderPageInfo,
      sectionOrder = DEFAULT_SECTION_ORDER,
      containerClassName,
      rowSelectorClassName,
      rowSelectorButtonClassName,
      rowSelectorDropdownClassName,
      rowSelectorDropdownWrapperClassName,
      rowSelectorOptionClassName,
      pageButtonClassName,
      activePageButtonClassName,
      navButtonClassName,
      navContainerClassName,
      pageButtonsContainerClassName,
      ellipsisClassName,
      labelClassName,
      dropdownIconClassName,
      prevIconClassName,
      nextIconClassName,
      pageInfoClassName,
      className,
      ...rest
    },
    ref,
  ) => {
    const instanceId = useId();

    const resolvedRowOptions = useMemo(
      () => rowOptions ?? [...DEFAULT_ROW_OPTIONS],
      [rowOptions],
    );

    const safeTotalPages = Math.max(0, Math.floor(totalPages));
    const safeCurrentPage = Math.max(1, Math.min(currentPage, safeTotalPages || 1));

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [activeOptionIndex, setActiveOptionIndex] = useState(-1);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const optionRefs = useRef<(HTMLDivElement | null)[]>([]);

    const listboxId = `${instanceId}-listbox`;

    const getOptionId = useCallback(
      (index: number) => `${instanceId}-option-${index}`,
      [instanceId],
    );

    useEffect(() => {
      if (!isDropdownOpen) return;

      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          triggerRef.current &&
          !dropdownRef.current.contains(event.target as Node) &&
          !triggerRef.current.contains(event.target as Node)
        ) {
          setIsDropdownOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isDropdownOpen]);

    useEffect(() => {
      if (isDropdownOpen) {
        dropdownRef.current?.focus();
      }
    }, [isDropdownOpen]);

    useEffect(() => {
      if (isDropdownOpen && activeOptionIndex >= 0) {
        optionRefs.current[activeOptionIndex]?.scrollIntoView({ block: "nearest" });
      }
    }, [isDropdownOpen, activeOptionIndex]);

    const handleRowsChange = useCallback(
      (rows: number) => {
        onRowsPerPageChange?.(rows);
        setIsDropdownOpen(false);
        triggerRef.current?.focus();
      },
      [onRowsPerPageChange],
    );

    const handleDropdownKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (!isDropdownOpen) {
          if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsDropdownOpen(true);
            const selectedIndex = resolvedRowOptions.indexOf(rowsPerPage ?? -1);
            setActiveOptionIndex(selectedIndex >= 0 ? selectedIndex : 0);
          }
          return;
        }

        switch (e.key) {
          case "ArrowDown": {
            e.preventDefault();
            setActiveOptionIndex((prev) =>
              prev < resolvedRowOptions.length - 1 ? prev + 1 : 0,
            );
            break;
          }
          case "ArrowUp": {
            e.preventDefault();
            setActiveOptionIndex((prev) =>
              prev > 0 ? prev - 1 : resolvedRowOptions.length - 1,
            );
            break;
          }
          case "Home": {
            e.preventDefault();
            setActiveOptionIndex(0);
            break;
          }
          case "End": {
            e.preventDefault();
            setActiveOptionIndex(resolvedRowOptions.length - 1);
            break;
          }
          case "Enter":
          case " ": {
            e.preventDefault();
            if (activeOptionIndex >= 0 && activeOptionIndex < resolvedRowOptions.length) {
              handleRowsChange(resolvedRowOptions[activeOptionIndex]);
            }
            break;
          }
          case "Escape": {
            e.preventDefault();
            setIsDropdownOpen(false);
            triggerRef.current?.focus();
            break;
          }
          case "Tab": {
            setIsDropdownOpen(false);
            break;
          }
        }
      },
      [isDropdownOpen, activeOptionIndex, resolvedRowOptions, handleRowsChange, rowsPerPage],
    );

    const visiblePages = useMemo(
      () => getVisiblePages(safeTotalPages, safeCurrentPage, siblingCount),
      [safeTotalPages, safeCurrentPage, siblingCount],
    );

    const handlePrevPage = useCallback(() => {
      if (safeCurrentPage > 1) {
        onPageChange(safeCurrentPage - 1);
      }
    }, [safeCurrentPage, onPageChange]);

    const handleNextPage = useCallback(() => {
      if (safeCurrentPage < safeTotalPages) {
        onPageChange(safeCurrentPage + 1);
      }
    }, [safeCurrentPage, safeTotalPages, onPageChange]);

    const dropdownIconClass = cn(
      "w-3 h-3 transition-transform duration-200",
      isDropdownOpen && "rotate-180",
      dropdownIconClassName,
    );

    const isFirstPage = safeCurrentPage <= 1;
    const isLastPage = safeCurrentPage >= safeTotalPages;
    const activeOptionId =
      isDropdownOpen && activeOptionIndex >= 0
        ? getOptionId(activeOptionIndex)
        : undefined;

    const selectorSection =
      showRowsPerPage && rowsPerPage !== undefined ? (
        <div className={rowSelectorClassName}>
          <span className={labelClassName}>{showLabel}</span>
          <div className={cn("relative", rowSelectorDropdownWrapperClassName)}>
            <button
              ref={triggerRef}
              type="button"
              onClick={(e) => {
                if (e.detail === 0) return;
                const opening = !isDropdownOpen;
                setIsDropdownOpen(opening);
                if (opening) {
                  const selectedIndex = resolvedRowOptions.indexOf(rowsPerPage ?? -1);
                  setActiveOptionIndex(selectedIndex >= 0 ? selectedIndex : 0);
                }
              }}
              onKeyDown={!isDropdownOpen ? handleDropdownKeyDown : undefined}
              className={cn(rowSelectorButtonClassName)}
              aria-expanded={isDropdownOpen}
              aria-haspopup="listbox"
              aria-controls={isDropdownOpen ? listboxId : undefined}
            >
              <span>{rowsPerPage}</span>
              {renderIcon(
                dropdownIcon,
                ChevronDownIcon,
                dropdownIconClassName,
                dropdownIconClass,
              )}
            </button>

            {isDropdownOpen && (
              <div
                ref={dropdownRef}
                id={listboxId}
                className={cn(
                  dropdownDirection === "down"
                    ? "absolute top-full mt-1 left-0"
                    : "absolute bottom-full mb-1 left-0",
                  rowSelectorDropdownClassName,
                )}
                role="listbox"
                tabIndex={-1}
                aria-label={dropdownAriaLabel}
                aria-activedescendant={activeOptionId}
                onKeyDown={handleDropdownKeyDown}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node) &&
                      !triggerRef.current?.contains(e.relatedTarget as Node)) {
                    setIsDropdownOpen(false);
                  }
                }}
                onMouseDown={(e) => e.preventDefault()}
              >
                {resolvedRowOptions.map((option, index) => (
                  <div
                    key={option}
                    ref={(el) => { optionRefs.current[index] = el; }}
                    id={getOptionId(index)}
                    role="option"
                    aria-selected={rowsPerPage === option}
                    data-selected={rowsPerPage === option || undefined}
                    data-highlighted={activeOptionIndex === index || undefined}
                    className={cn(rowSelectorOptionClassName)}
                    onClick={() => handleRowsChange(option)}
                    onMouseEnter={() => setActiveOptionIndex(index)}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
          <span className={labelClassName}>{rowsPerPageLabel}</span>
        </div>
      ) : null;

    const pageInfoSection = renderPageInfo ? (
      <div className={pageInfoClassName}>
        {renderPageInfo({
          currentPage: safeCurrentPage,
          totalPages: safeTotalPages,
          rowsPerPage,
        })}
      </div>
    ) : null;

    const navSection = (
      <div className={cn("flex items-center gap-2", navContainerClassName)}>
        <button
          type="button"
          onClick={handlePrevPage}
          disabled={isFirstPage}
          className={cn(navButtonClassName)}
          aria-label="Previous page"
          data-disabled={isFirstPage || undefined}
        >
          {renderIcon(prevIcon, ChevronLeftIcon, prevIconClassName, "w-5 h-5")}
        </button>

        <div className={cn("flex items-center gap-2", pageButtonsContainerClassName)}>
          {visiblePages.map((item, index) =>
            item === "ellipsis" ? (
              renderEllipsis ? (
                <Fragment key={`ellipsis-${index}`}>
                  {renderEllipsis({
                    position: index < visiblePages.length / 2 ? "start" : "end",
                    onPageChange,
                  })}
                </Fragment>
              ) : (
                <span
                  key={`ellipsis-${index}`}
                  className={ellipsisClassName}
                  aria-hidden="true"
                >
                  &hellip;
                </span>
              )
            ) : (
              <button
                key={item}
                type="button"
                onClick={() => onPageChange(item)}
                className={
                  safeCurrentPage === item
                    ? activePageButtonClassName
                    : pageButtonClassName
                }
                aria-label={`Page ${item}`}
                aria-current={safeCurrentPage === item ? "page" : undefined}
                data-active={safeCurrentPage === item || undefined}
              >
                {item}
              </button>
            ),
          )}
        </div>

        <button
          type="button"
          onClick={handleNextPage}
          disabled={isLastPage}
          className={cn(navButtonClassName)}
          aria-label="Next page"
          data-disabled={isLastPage || undefined}
        >
          {renderIcon(nextIcon, ChevronRightIcon, nextIconClassName, "w-5 h-5")}
        </button>
      </div>
    );

    const sections: Record<SectionName, React.ReactNode> = {
      selector: selectorSection,
      pageInfo: pageInfoSection,
      nav: navSection,
    };

    return (
      <nav
        ref={ref as React.Ref<HTMLElement>}
        aria-label="Pagination"
        className={cn(containerClassName, className)}
        {...rest}
      >
        {sectionOrder.map((section) => (
          <Fragment key={section}>{sections[section]}</Fragment>
        ))}
      </nav>
    );
  },
);

Pagination.displayName = "Pagination";

export default Pagination;
