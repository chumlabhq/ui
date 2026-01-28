import {
  useState,
  useRef,
  useEffect,
  useCallback,
  memo,
  isValidElement,
} from "react";
import type { PaginationProps, IconProps } from "./types";
import { DEFAULT_ROW_OPTIONS } from "./constants";
import { getVisiblePages } from "./utils";
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from "./icons";

const Pagination = memo(function Pagination({
  currentPage,
  totalPages,
  rowsPerPage,
  rowOptions = [...DEFAULT_ROW_OPTIONS],
  onPageChange,
  onRowsPerPageChange,
  showRowsPerPage = false,
  rowsPerPageLabel = "rows",
  dropdownIcon,
  prevIcon,
  nextIcon,
  containerClassName = "",
  rowSelectorClassName = "",
  rowSelectorButtonClassName = "",
  rowSelectorDropdownClassName = "",
  rowSelectorDropdownWrapperClassName = "",
  rowSelectorOptionClassName = "",
  pageButtonClassName = "",
  activePageButtonClassName = "",
  navButtonClassName = "",
  navContainerClassName = "",
  pageButtonsContainerClassName = "",
  ellipsisClassName = "",
  labelClassName = "",
  dropdownIconClassName = "",
  prevIconClassName = "",
  nextIconClassName = "",
}: PaginationProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        buttonRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleRowsChange = useCallback(
    (rows: number) => {
      onRowsPerPageChange?.(rows);
      setIsDropdownOpen(false);
    },
    [onRowsPerPageChange],
  );

  const visiblePages = getVisiblePages(totalPages, currentPage);

  const handlePrevPage = useCallback(() => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  }, [currentPage, onPageChange]);

  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  }, [currentPage, totalPages, onPageChange]);

  const renderIcon = (
    icon: React.ComponentType<IconProps> | React.ReactNode | undefined,
    DefaultIcon: React.ComponentType<IconProps>,
    className: string,
    defaultClassName: string,
  ) => {
    const finalClassName = className || defaultClassName;

    if (!icon) {
      return <DefaultIcon className={finalClassName} />;
    }

    if (isValidElement(icon)) {
      return icon;
    }

    const IconComponent = icon as React.ComponentType<IconProps>;
    return <IconComponent className={finalClassName} />;
  };

  const dropdownIconClass =
    dropdownIconClassName ||
    [
      "w-3 h-3 transition-transform duration-200",
      isDropdownOpen ? "rotate-180" : "",
    ].join(" ");

  return (
    <div className={containerClassName}>
      {showRowsPerPage && rowsPerPage !== undefined && (
        <div className={rowSelectorClassName}>
          <span className={labelClassName}>Show</span>
          <div className={rowSelectorDropdownWrapperClassName || "relative"}>
            <button
              ref={buttonRef}
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`cursor-pointer ${rowSelectorButtonClassName}`}
              aria-expanded={isDropdownOpen}
              aria-haspopup="listbox"
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
                className={rowSelectorDropdownClassName}
                role="listbox"
                aria-label="Rows per page"
              >
                {rowOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleRowsChange(option)}
                    className={`cursor-pointer ${rowSelectorOptionClassName}`}
                    role="option"
                    aria-selected={rowsPerPage === option}
                    data-selected={rowsPerPage === option || undefined}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
          <span className={labelClassName}>{rowsPerPageLabel}</span>
        </div>
      )}

      <div className={navContainerClassName || "flex items-center gap-2"}>
        <button
          type="button"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className={`cursor-pointer ${navButtonClassName}`}
          aria-label="Previous page"
          data-disabled={currentPage === 1 || undefined}
        >
          {renderIcon(prevIcon, ChevronLeftIcon, prevIconClassName, "w-5 h-5")}
        </button>

        <div
          className={pageButtonsContainerClassName || "flex items-center gap-2"}
        >
          {visiblePages.map((item, index) =>
            item === "ellipsis" ? (
              <span key={`ellipsis-${index}`} className={ellipsisClassName}>
                ...
              </span>
            ) : (
              <button
                key={item}
                type="button"
                onClick={() => onPageChange(item)}
                className={`cursor-pointer ${currentPage === item ? activePageButtonClassName : pageButtonClassName}`}
                aria-label={`Page ${item}`}
                aria-current={currentPage === item ? "page" : undefined}
              >
                {item}
              </button>
            ),
          )}
        </div>

        <button
          type="button"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`cursor-pointer ${navButtonClassName}`}
          aria-label="Next page"
          data-disabled={currentPage === totalPages || undefined}
        >
          {renderIcon(nextIcon, ChevronRightIcon, nextIconClassName, "w-5 h-5")}
        </button>
      </div>
    </div>
  );
});

export default Pagination;
