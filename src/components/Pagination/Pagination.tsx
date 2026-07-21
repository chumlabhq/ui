import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  useId,
  forwardRef,
  isValidElement,
  memo,
  Fragment,
} from "react";
import { createPortal } from "react-dom";
import type { PaginationProps, PaginationClasses, IconProps, SectionName } from "./utils/types";
import { DEFAULT_ROW_OPTIONS, DEFAULT_PAGINATION_CLASSES, UNSTYLED_PAGINATION_CLASSES } from "./utils/constants";
import { getVisiblePages } from "./utils/helpers";
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from "./utils/icons";
import { cn } from "../../utils/cn";
import { useReducedMotion } from "../../utils/useReducedMotion";
import { useControllableState } from "../../utils/useControllableState";
import { isBrowser } from "../../utils/isBrowser";
import { SR_ONLY_STYLE } from "../../utils/srOnlyStyle";

interface DropdownCoords {
  top: number;
  left: number;
  minWidth: number;
}

function computeDropdownCoords(
  buttonEl: HTMLButtonElement,
  dropdownEl: HTMLDivElement,
  direction: "up" | "down",
  gap: number,
): DropdownCoords {
  const rect = buttonEl.getBoundingClientRect();
  const dropdownRect = dropdownEl.getBoundingClientRect();
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const MARGIN = 8;

  let top =
    direction === "up"
      ? rect.top - dropdownRect.height - gap
      : rect.bottom + gap;
  let left = rect.left;

  // Keep the dropdown inside the viewport when the page-size selector sits
  // near a viewport edge (common for right-aligned pagination on narrow widths).
  left = Math.max(MARGIN, Math.min(left, vw - dropdownRect.width - MARGIN));
  top = Math.max(MARGIN, Math.min(top, vh - dropdownRect.height - MARGIN));

  return {
    top,
    left,
    minWidth: rect.width,
  };
}

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

const RowSelectorPortal = memo(function RowSelectorPortal({
  triggerRef,
  direction,
  zIndex,
  gap,
  dropdownClassName,
  optionClassName,
  listboxId,
  activeOptionId,
  activeOptionIndex,
  options,
  selectedValue,
  onSelect,
  onKeyDown,
  onBlur,
  onOptionMouseEnter,
  getOptionId,
  dropdownAriaLabel,
  portalContainer,
}: {
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  direction: "up" | "down";
  zIndex: number;
  gap: number;
  dropdownClassName?: string;
  optionClassName?: string;
  listboxId: string;
  activeOptionId?: string;
  activeOptionIndex: number;
  options: number[];
  selectedValue?: number;
  onSelect: (value: number) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onBlur: (e: React.FocusEvent) => void;
  onOptionMouseEnter: (index: number) => void;
  getOptionId: (index: number) => string;
  dropdownAriaLabel: string;
  portalContainer?: HTMLElement | null;
}) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [coords, setCoords] = useState<DropdownCoords | null>(null);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current || !dropdownRef.current) return;
    setCoords(
      computeDropdownCoords(
        triggerRef.current,
        dropdownRef.current,
        direction,
        gap,
      ),
    );
  }, [triggerRef, direction, gap]);

  useEffect(() => {
    requestAnimationFrame(updatePosition);
  }, [updatePosition]);

  useEffect(() => {
    if (!isBrowser) return;
    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  }, [updatePosition]);

  useEffect(() => {
    dropdownRef.current?.focus();
  }, []);

  useEffect(() => {
    if (activeOptionIndex >= 0) {
      optionRefs.current[activeOptionIndex]?.scrollIntoView({
        block: "nearest",
      });
    }
  }, [activeOptionIndex]);

  const dropdownStyle: React.CSSProperties = {
    position: "fixed",
    zIndex,
    ...(coords
      ? { top: coords.top, left: coords.left, minWidth: coords.minWidth }
      : { visibility: "hidden" as const, top: 0, left: 0 }),
  };

  if (!isBrowser) return null;

  const portalTarget = portalContainer ?? document.body;

  return createPortal(
    <div
      ref={dropdownRef}
      id={listboxId}
      className={cn(dropdownClassName)}
      style={dropdownStyle}
      role="listbox"
      tabIndex={-1}
      aria-label={dropdownAriaLabel}
      aria-activedescendant={activeOptionId}
      onKeyDown={onKeyDown}
      onBlur={onBlur}
      onMouseDown={(e) => e.preventDefault()}
      data-state="open"
      data-direction={direction}
    >
      {options.map((option, index) => (
        <div
          key={option}
          ref={(el) => {
            optionRefs.current[index] = el;
          }}
          id={getOptionId(index)}
          role="option"
          aria-selected={selectedValue === option}
          data-selected={selectedValue === option || undefined}
          data-highlighted={activeOptionIndex === index || undefined}
          className={cn(optionClassName)}
          onClick={() => onSelect(option)}
          onMouseEnter={() => onOptionMouseEnter(index)}
        >
          {option}
        </div>
      ))}
    </div>,
    portalTarget,
  );
});

const DEFAULT_SECTION_ORDER: SectionName[] = ["selector", "pageInfo", "nav"];

/**
 * Component: Pagination
 *
 * Purpose: Page navigation with buttons, rows-per-page selector, and ellipsis truncation.
 *
 * AI Usage Guidelines:
 * - Use `value` + `onValueChange` + `totalPages` for basic setup
 * - Use `showRowsPerPage` for data table pagination
 * - Use `sectionOrder` to rearrange layout sections
 *
 * Reference: PAGINATION.ai.md (this directory), src/pages/demo/PaginationDemo.tsx
 */
const Pagination = forwardRef<HTMLElement, PaginationProps>(
  (
    {
      totalPages,
      siblingCount = 1,
      rowsPerPage,
      rowOptions,
      onValueChange,
      value: valueProp,
      defaultValue = 1,
      disabled,
      onRowsPerPageChange,
      showRowsPerPage = false,
      rowsPerPageLabel = "rows",
      showLabel = "Show",
      dropdownAriaLabel = "Rows per page",
      dropdownPosition = "top",
      dropdownZIndex = 50,
      dropdownGap = 4,
      dropdownIcon,
      prevIcon,
      nextIcon,
      renderEllipsis,
      renderPageInfo,
      sectionOrder = DEFAULT_SECTION_ORDER,
      reduceMotion,
      classes: classesProp,
      unstyled = false,
      portalContainer,
      prevAriaLabel = "Previous page",
      nextAriaLabel = "Next page",
      paginationAriaLabel: paginationAriaLabelProp,
      pageAriaLabel,
      className,
      ...rest
    },
    ref,
  ) => {
    const instanceId = useId();
    const prefersReducedMotion = useReducedMotion(reduceMotion);
    const paginationAriaLabel = paginationAriaLabelProp ?? "Pagination";

    const [currentPage, setCurrentPage] = useControllableState({
      value: valueProp,
      defaultValue,
      onChange: onValueChange,
    });
    const resolvedCurrentPage = currentPage ?? 1;
    const resolvedOnPageChange = setCurrentPage;

    const baseClasses = unstyled ? UNSTYLED_PAGINATION_CLASSES : DEFAULT_PAGINATION_CLASSES;
    const mergedClasses = useMemo<Required<PaginationClasses>>(() => ({
      root: classesProp?.root ?? baseClasses.root,
      nav: classesProp?.nav ?? baseClasses.nav,
      pageButtons: classesProp?.pageButtons ?? baseClasses.pageButtons,
      pageButton: classesProp?.pageButton ?? baseClasses.pageButton,
      activePageButton: classesProp?.activePageButton ?? baseClasses.activePageButton,
      navButton: classesProp?.navButton ?? baseClasses.navButton,
      ellipsis: classesProp?.ellipsis ?? baseClasses.ellipsis,
      selector: classesProp?.selector ?? baseClasses.selector,
      selectorButton: classesProp?.selectorButton ?? baseClasses.selectorButton,
      selectorDropdown: classesProp?.selectorDropdown ?? baseClasses.selectorDropdown,
      selectorDropdownWrapper: classesProp?.selectorDropdownWrapper ?? baseClasses.selectorDropdownWrapper,
      selectorOption: classesProp?.selectorOption ?? baseClasses.selectorOption,
      label: classesProp?.label ?? baseClasses.label,
      dropdownIcon: classesProp?.dropdownIcon ?? baseClasses.dropdownIcon,
      prevIcon: classesProp?.prevIcon ?? baseClasses.prevIcon,
      nextIcon: classesProp?.nextIcon ?? baseClasses.nextIcon,
      pageInfo: classesProp?.pageInfo ?? baseClasses.pageInfo,
    }), [classesProp, baseClasses]);

    const resolvedRowOptions = useMemo(
      () => rowOptions ?? [...DEFAULT_ROW_OPTIONS],
      [rowOptions],
    );

    const safeTotalPages = Math.max(0, Math.floor(totalPages));
    const safeCurrentPage = Math.max(1, Math.min(resolvedCurrentPage, safeTotalPages || 1));

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [activeOptionIndex, setActiveOptionIndex] = useState(-1);
    const triggerRef = useRef<HTMLButtonElement>(null);

    const listboxId = `${instanceId}-listbox`;

    const getOptionId = useCallback(
      (index: number) => `${instanceId}-option-${index}`,
      [instanceId],
    );

    useEffect(() => {
      if (!isDropdownOpen || !isBrowser) return;

      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as Node;
        if (triggerRef.current?.contains(target)) return;
        const portalEl = document.getElementById(listboxId);
        if (portalEl?.contains(target)) return;
        setIsDropdownOpen(false);
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isDropdownOpen, listboxId]);

    useEffect(() => {
      if (!isDropdownOpen || !isBrowser) return;
      const handleScroll = () => setIsDropdownOpen(false);
      window.addEventListener("scroll", handleScroll, true);
      return () => window.removeEventListener("scroll", handleScroll, true);
    }, [isDropdownOpen]);

    const handleDropdownBlur = useCallback(
      (e: React.FocusEvent) => {
        if (
          !e.currentTarget.contains(e.relatedTarget as Node) &&
          !triggerRef.current?.contains(e.relatedTarget as Node)
        ) {
          setIsDropdownOpen(false);
        }
      },
      [],
    );

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
        resolvedOnPageChange?.(safeCurrentPage - 1);
      }
    }, [safeCurrentPage, resolvedOnPageChange]);

    const handleNextPage = useCallback(() => {
      if (safeCurrentPage < safeTotalPages) {
        resolvedOnPageChange?.(safeCurrentPage + 1);
      }
    }, [safeCurrentPage, safeTotalPages, resolvedOnPageChange]);

    const dropdownIconClass = cn(
      "w-3 h-3 transition-transform duration-200",
      isDropdownOpen && "rotate-180",
      mergedClasses.dropdownIcon,
    );

    const isFirstPage = safeCurrentPage <= 1;
    const isLastPage = safeCurrentPage >= safeTotalPages;
    const activeOptionId =
      isDropdownOpen && activeOptionIndex >= 0
        ? getOptionId(activeOptionIndex)
        : undefined;

    const selectorSection =
      showRowsPerPage && rowsPerPage !== undefined ? (
        <div className={mergedClasses.selector}>
          <span className={mergedClasses.label}>{showLabel}</span>
          <div className={cn("relative", mergedClasses.selectorDropdownWrapper)}>
            <button
              ref={triggerRef}
              type="button"
              disabled={disabled}
              onClick={() => {
                const opening = !isDropdownOpen;
                setIsDropdownOpen(opening);
                if (opening) {
                  const selectedIndex = resolvedRowOptions.indexOf(rowsPerPage ?? -1);
                  setActiveOptionIndex(selectedIndex >= 0 ? selectedIndex : 0);
                }
              }}
              onKeyDown={!isDropdownOpen ? handleDropdownKeyDown : undefined}
              className={cn(mergedClasses.selectorButton)}
              aria-expanded={isDropdownOpen}
              aria-haspopup="listbox"
              aria-controls={isDropdownOpen ? listboxId : undefined}
            >
              <span>{rowsPerPage}</span>
              {renderIcon(
                dropdownIcon,
                ChevronDownIcon,
                mergedClasses.dropdownIcon,
                dropdownIconClass,
              )}
            </button>

            {isDropdownOpen && (
              <RowSelectorPortal
                triggerRef={triggerRef}
                direction={dropdownPosition === "top" ? "up" : "down"}
                zIndex={dropdownZIndex}
                gap={dropdownGap}
                dropdownClassName={mergedClasses.selectorDropdown}
                optionClassName={mergedClasses.selectorOption}
                listboxId={listboxId}
                activeOptionId={activeOptionId}
                activeOptionIndex={activeOptionIndex}
                options={resolvedRowOptions}
                selectedValue={rowsPerPage}
                onSelect={handleRowsChange}
                onKeyDown={handleDropdownKeyDown}
                onBlur={handleDropdownBlur}
                onOptionMouseEnter={setActiveOptionIndex}
                getOptionId={getOptionId}
                dropdownAriaLabel={dropdownAriaLabel}
                portalContainer={portalContainer}
              />
            )}
          </div>
          <span className={mergedClasses.label}>{rowsPerPageLabel}</span>
        </div>
      ) : null;

    const pageInfoSection = renderPageInfo ? (
      <div className={mergedClasses.pageInfo}>
        {renderPageInfo({
          value: safeCurrentPage,
          currentPage: safeCurrentPage,
          totalPages: safeTotalPages,
          rowsPerPage,
        })}
      </div>
    ) : null;

    const navSection = (
      <div className={cn("flex items-center gap-2", mergedClasses.nav)}>
        <button
          type="button"
          onClick={handlePrevPage}
          disabled={isFirstPage}
          className={cn(mergedClasses.navButton)}
          aria-label={prevAriaLabel}
          data-disabled={isFirstPage || undefined}
        >
          {renderIcon(prevIcon, ChevronLeftIcon, mergedClasses.prevIcon, "w-5 h-5")}
        </button>

        <div className={cn("flex items-center gap-2", mergedClasses.pageButtons)}>
          {visiblePages.map((item, index) =>
            item === "ellipsis" ? (
              renderEllipsis ? (
                <Fragment key={`ellipsis-${index}`}>
                  {renderEllipsis({
                    position: index < visiblePages.length / 2 ? "start" : "end",
                    onValueChange: resolvedOnPageChange!,
                    onPageChange: resolvedOnPageChange!,
                  })}
                </Fragment>
              ) : (
                <span
                  key={`ellipsis-${index}`}
                  className={mergedClasses.ellipsis}
                  aria-hidden="true"
                >
                  &hellip;
                </span>
              )
            ) : (
              <button
                key={item}
                type="button"
                disabled={disabled}
                onClick={() => resolvedOnPageChange?.(item)}
                className={
                  safeCurrentPage === item
                    ? mergedClasses.activePageButton
                    : mergedClasses.pageButton
                }
                aria-label={pageAriaLabel ? pageAriaLabel(item) : `Page ${item}`}
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
          className={cn(mergedClasses.navButton)}
          aria-label={nextAriaLabel}
          data-disabled={isLastPage || undefined}
        >
          {renderIcon(nextIcon, ChevronRightIcon, mergedClasses.nextIcon, "w-5 h-5")}
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
        aria-label={paginationAriaLabel}
        aria-disabled={disabled || undefined}
        data-disabled={disabled || undefined}
        data-reduce-motion={prefersReducedMotion || undefined}
        className={cn(mergedClasses.root, className, disabled && "opacity-50 pointer-events-none")}
        {...rest}
      >
        {sectionOrder.map((section) => (
          <Fragment key={section}>{sections[section]}</Fragment>
        ))}
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          style={SR_ONLY_STYLE}
        >
          {`Page ${safeCurrentPage} of ${safeTotalPages}`}
        </div>
      </nav>
    );
  },
);

Pagination.displayName = "Pagination";

export default Pagination;
