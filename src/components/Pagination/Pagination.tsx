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
import { useLayer } from "../../utils/layers.js";
import type { PaginationProps, PaginationClasses, IconProps, SectionName } from "./utils/types.js";
import { DEFAULT_ROW_OPTIONS, DEFAULT_PAGINATION_CLASSES, UNSTYLED_PAGINATION_CLASSES } from "./utils/constants.js";
import { getVisiblePages } from "./utils/helpers.js";
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from "./utils/icons.js";
import { cn, composeClasses } from "../../utils/scopedCn.js";
import { useReducedMotion } from "../../utils/useReducedMotion.js";
import { useControllableState } from "../../utils/useControllableState.js";
import { isBrowser } from "../../utils/isBrowser.js";
import { SR_ONLY_STYLE } from "../../utils/srOnlyStyle.js";

import { motionSafeClasses } from "../../utils/classLayers.js";
import { useAnchoredPosition } from "../../utils/useAnchoredPosition.js";
import { useMenuNavigation } from "../../utils/menu/useMenuNavigation.js";
import MenuSurface from "../../utils/menu/MenuSurface.js";
import { focusTriggerOnMouseDown } from "../../utils/menu/focusTriggerOnMouseDown.js";
import { mergeSlot } from "../../utils/mergeSlot.js";

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
  keepMounted,
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
  keepMounted?: boolean;
}) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<(HTMLDivElement | null)[]>([]);
  // The portal only mounts while the menu is open, so the hook is always
  // measuring; `direction` is this component's name for the preferred side.
  const coords = useAnchoredPosition(triggerRef, dropdownRef, true, {
    side: direction === "up" ? "top" : "bottom",
    gap,
  });

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

  return (
    <MenuSurface
      ref={dropdownRef}
      trigger={triggerRef}
      isOpen
      side={direction === "up" ? "top" : "bottom"}
      gap={gap}
      zIndex={zIndex}
      portalContainer={portalContainer}
      keepMounted={keepMounted}
      matchTriggerWidth={false}
      id={listboxId}
      className={cn(dropdownClassName)}
      style={{ minWidth: coords?.width }}
      role="listbox"
      tabIndex={-1}
      aria-label={dropdownAriaLabel}
      aria-activedescendant={activeOptionId}
      onKeyDown={onKeyDown}
      onBlur={onBlur}
      onMouseDown={(event) => event.preventDefault()}
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
    </MenuSurface>
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
      dropdownZIndex: dropdownZIndexProp,
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
      keepMounted = false,
      prevAriaLabel = "Previous page",
      nextAriaLabel = "Next page",
      paginationAriaLabel: paginationAriaLabelProp,
      pageAriaLabel,
      className,
      ...rest
    },
    ref,
  ) => {
    const dropdownZIndex = useLayer(dropdownZIndexProp);

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

    const baseClassesRaw = unstyled ? UNSTYLED_PAGINATION_CLASSES : DEFAULT_PAGINATION_CLASSES;

    const baseClasses = motionSafeClasses(baseClassesRaw, prefersReducedMotion);
    const mergedClasses = useMemo<Required<PaginationClasses>>(() => ({
      root: mergeSlot(baseClasses.root, classesProp?.root),
      row: mergeSlot(baseClasses.row, classesProp?.row),
      list: mergeSlot(baseClasses.list, classesProp?.list),
      item: mergeSlot(baseClasses.item, classesProp?.item),
      navButton: mergeSlot(baseClasses.navButton, classesProp?.navButton),
      ellipsis: mergeSlot(baseClasses.ellipsis, classesProp?.ellipsis),
      rowsPerPage: composeClasses(baseClasses.rowsPerPage, classesProp?.rowsPerPage),
      label: mergeSlot(baseClasses.label, classesProp?.label),
      navIcon: mergeSlot(baseClasses.navIcon, classesProp?.navIcon),
      pageInfo: mergeSlot(baseClasses.pageInfo, classesProp?.pageInfo),
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

    /**
     * Focus goes back to the trigger through a flag rather than from here.
     *
     * Calling `.focus()` inline runs before React has removed the surface, so
     * the browser can move focus again in the same tick — which is the bug the
     * flag was added for elsewhere in the family.
     */
    const shouldRestoreFocusRef = useRef(false);
    useEffect(() => {
      if (!isDropdownOpen && shouldRestoreFocusRef.current) {
        shouldRestoreFocusRef.current = false;
        triggerRef.current?.focus();
      }
    }, [isDropdownOpen]);

    const handleRowsChange = useCallback(
      (rows: number) => {
        onRowsPerPageChange?.(rows);
        setIsDropdownOpen(false);
        shouldRestoreFocusRef.current = true;
      },
      [onRowsPerPageChange],
    );

    /**
     * The shared keyboard model. Opening seeds the current row count so the
     * highlight starts where the value is, which is this component's own.
     */
    const { onKeyDown: onMenuKeyDown } = useMenuNavigation<number>({
      items: resolvedRowOptions,
      isOpen: isDropdownOpen,
      activeIndex: activeOptionIndex,
      onActiveIndexChange: setActiveOptionIndex,
      onSelect: handleRowsChange,
      // Opens on the row count already in use, not on the first option.
      seedOnOpen: "none",
      onOpen: () => {
        setIsDropdownOpen(true);
        const selectedIndex = resolvedRowOptions.indexOf(rowsPerPage ?? -1);
        setActiveOptionIndex(selectedIndex >= 0 ? selectedIndex : 0);
      },
      onClose: (reason) => {
        setIsDropdownOpen(false);
        // Escape returns the user to the control they opened; Tab is already
        // taking them somewhere else and must not be pulled back.
        if (reason === "escape") shouldRestoreFocusRef.current = true;
      },
    });

    const handleDropdownKeyDown = onMenuKeyDown;

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
      mergedClasses.rowsPerPage.icon,
    );

    const isFirstPage = safeCurrentPage <= 1;
    const isLastPage = safeCurrentPage >= safeTotalPages;
    const activeOptionId =
      isDropdownOpen && activeOptionIndex >= 0
        ? getOptionId(activeOptionIndex)
        : undefined;

    const selectorSection =
      showRowsPerPage && rowsPerPage !== undefined ? (
        <div className={mergedClasses.rowsPerPage.root}>
          <span className={mergedClasses.label}>{showLabel}</span>
          <div className={cn(mergedClasses.rowsPerPage.positioner)}>
            <button
              ref={triggerRef}
              type="button"
              disabled={disabled}
              onMouseDown={focusTriggerOnMouseDown}
              onClick={() => {
                const opening = !isDropdownOpen;
                setIsDropdownOpen(opening);
                if (opening) {
                  const selectedIndex = resolvedRowOptions.indexOf(rowsPerPage ?? -1);
                  setActiveOptionIndex(selectedIndex >= 0 ? selectedIndex : 0);
                }
              }}
              onKeyDown={!isDropdownOpen ? handleDropdownKeyDown : undefined}
              className={cn(mergedClasses.rowsPerPage.trigger)}
              aria-expanded={isDropdownOpen}
              aria-haspopup="listbox"
              aria-controls={isDropdownOpen ? listboxId : undefined}
            >
              <span>{rowsPerPage}</span>
              {renderIcon(
                dropdownIcon,
                ChevronDownIcon,
                mergedClasses.rowsPerPage.icon,
                dropdownIconClass,
              )}
            </button>

            {isDropdownOpen && (
              <RowSelectorPortal
                triggerRef={triggerRef}
                direction={dropdownPosition === "top" ? "up" : "down"}
                zIndex={dropdownZIndex}
                gap={dropdownGap}
                dropdownClassName={mergedClasses.rowsPerPage.content}
                optionClassName={mergedClasses.rowsPerPage.item}
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
                keepMounted={keepMounted}
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
          totalPages: safeTotalPages,
          rowsPerPage,
        })}
      </div>
    ) : null;

    const navSection = (
      <div className={cn(mergedClasses.row)}>
        <button
          type="button"
          onClick={handlePrevPage}
          disabled={isFirstPage}
          className={cn(mergedClasses.navButton)}
          aria-label={prevAriaLabel}
          data-disabled={isFirstPage || undefined}
        >
          {renderIcon(prevIcon, ChevronLeftIcon, mergedClasses.navIcon, "w-5 h-5")}
        </button>

        <div className={cn(mergedClasses.list)}>
          {visiblePages.map((item, index) =>
            item === "ellipsis" ? (
              renderEllipsis ? (
                <Fragment key={`ellipsis-${index}`}>
                  {renderEllipsis({
                    position: index < visiblePages.length / 2 ? "start" : "end",
                    onValueChange: resolvedOnPageChange!,
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
                className={mergedClasses.item}
                aria-label={pageAriaLabel ? pageAriaLabel(item) : `Page ${item}`}
                aria-current={safeCurrentPage === item ? "page" : undefined}
                data-state={safeCurrentPage === item ? "active" : undefined}
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
          {renderIcon(nextIcon, ChevronRightIcon, mergedClasses.navIcon, "w-5 h-5")}
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
        className={cn(mergedClasses.root, className)}
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
