import { useRef, useEffect, useId, forwardRef, memo, useCallback, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import type { CSSProperties, KeyboardEvent as ReactKeyboardEvent, ReactNode } from "react";
import { isBrowser } from "../../utils/isBrowser";
import { SR_ONLY_STYLE } from "../../utils/srOnlyStyle";
import { mergeRefs } from "../../utils/mergeRefs";
import { useStablePositionAfterOpen } from "../../utils/useStablePositionAfterOpen";
import type { MultiSelectOption, MultiSelectSearchableDropdownProps, MultiSelectSearchableDropdownClasses } from "./utils/types";
import { useMultiSelectDropdown } from "./utils/useMultiSelectDropdown";
import { ChevronDownIcon, CheckIcon, SearchIcon, XIcon, ClearIcon as ClearIconDefault } from "./utils/icons";
import { cn } from "../../utils/cn";
import {
  DEFAULT_MULTISELECTSEARCHABLEDROPDOWN_CLASSES,
  UNSTYLED_MULTISELECTSEARCHABLEDROPDOWN_CLASSES,
} from "./utils/constants";

interface DropdownCoords {
  top: number;
  left: number;
  width: number;
  position: "top" | "bottom";
}

function computeDropdownCoords(
  triggerEl: HTMLElement,
  dropdownEl: HTMLElement,
  preferredPosition: "top" | "bottom",
  gap: number,
  forcePosition = false,
): DropdownCoords {
  const rect = triggerEl.getBoundingClientRect();
  const dropdownHeight = dropdownEl.getBoundingClientRect().height;
  const viewportHeight = isBrowser ? (window.visualViewport?.height ?? window.innerHeight) : 768;
  const viewportWidth = isBrowser ? (window.visualViewport?.width ?? window.innerWidth) : 1024;
  let position = preferredPosition;
  if (!forcePosition) {
    if (position === "bottom" && rect.bottom + gap + dropdownHeight > viewportHeight) {
      if (rect.top - gap - dropdownHeight > 0) position = "top";
    } else if (position === "top" && rect.top - gap - dropdownHeight < 0) {
      if (rect.bottom + gap + dropdownHeight <= viewportHeight) position = "bottom";
    }
  }
  const top = position === "top" ? rect.top - dropdownHeight - gap : rect.bottom + gap;
  let left = rect.left;
  const dropdownWidth = rect.width;
  if (left + dropdownWidth > viewportWidth) {
    left = Math.max(0, viewportWidth - dropdownWidth);
  }
  return { top, left, width: rect.width, position };
}

interface DropdownContentProps {
  triggerElement: HTMLElement | null;
  isOpen: boolean;
  keepMounted: boolean;
  position: "top" | "bottom";
  forcePosition: boolean;
  zIndex: number;
  gap: number;
  portalContainer?: HTMLElement | null;
  classes: Required<MultiSelectSearchableDropdownClasses>;
  listboxId: string;
  dropdownId: string;
  listboxAriaLabel: string;
  loading: boolean;
  contentRef?: React.RefObject<HTMLDivElement | null>;
  children: ReactNode;
}

function DropdownContent({
  triggerElement,
  isOpen,
  keepMounted,
  position: preferredPosition,
  forcePosition,
  zIndex,
  gap,
  portalContainer,
  classes,
  listboxId,
  dropdownId,
  listboxAriaLabel,
  loading,
  contentRef,
  children,
}: DropdownContentProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<DropdownCoords | null>(null);
  const isPositionStable = useStablePositionAfterOpen(isOpen);
  const rafIdRef = useRef<number | null>(null);

  const updatePosition = useCallback(() => {
    if (!triggerElement || !dropdownRef.current) return;
    setCoords(computeDropdownCoords(triggerElement, dropdownRef.current, preferredPosition, gap, forcePosition));
  }, [triggerElement, preferredPosition, gap, forcePosition]);

  useEffect(() => {
    if (!isOpen) return;
    if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current);
    rafIdRef.current = requestAnimationFrame(updatePosition);
  }, [isOpen, updatePosition]);

  useEffect(() => {
    if (!isOpen || !isBrowser) return;
    const handleResize = () => {
      if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = requestAnimationFrame(updatePosition);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current);
    };
  }, [isOpen, updatePosition]);

  useEffect(() => {
    if (!isOpen || !isBrowser) return;
    const handleScroll = () => {
      if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = requestAnimationFrame(updatePosition);
    };
    window.addEventListener("scroll", handleScroll, true);
    return () => {
      window.removeEventListener("scroll", handleScroll, true);
      if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current);
    };
  }, [isOpen, updatePosition]);

  useEffect(() => {
    if (!isOpen || !isBrowser || !triggerElement) return;
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => {
      if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = requestAnimationFrame(updatePosition);
    });
    observer.observe(triggerElement);
    return () => {
      observer.disconnect();
      if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current);
    };
  }, [isOpen, triggerElement, updatePosition]);

  useEffect(() => {
    if (!isOpen || !isBrowser) return;
    if (typeof ResizeObserver === "undefined") return;
    const el = dropdownRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => {
      if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = requestAnimationFrame(updatePosition);
    });
    observer.observe(el);
    return () => {
      observer.disconnect();
      if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current);
    };
  }, [isOpen, updatePosition]);

  useEffect(() => {
    if (!isOpen || !isBrowser) return;
    const vv = window.visualViewport;
    if (!vv?.addEventListener) return;
    const handleViewportChange = () => {
      if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = requestAnimationFrame(updatePosition);
    };
    vv.addEventListener("resize", handleViewportChange);
    vv.addEventListener("scroll", handleViewportChange);
    return () => {
      vv.removeEventListener?.("resize", handleViewportChange);
      vv.removeEventListener?.("scroll", handleViewportChange);
      if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current);
    };
  }, [isOpen, updatePosition]);

  if (!isBrowser) return null;
  if (!isOpen && !keepMounted) return null;

  const dropdownStyle: CSSProperties = {
    position: "fixed",
    zIndex,
    margin: 0,
    ...(coords && isPositionStable
      ? { top: coords.top, left: coords.left, width: coords.width }
      : { visibility: "hidden" as const, top: 0, left: 0 }),
    ...(!isOpen && keepMounted ? { display: "none" } : {}),
  };

  return createPortal(
    <div
      ref={mergeRefs(dropdownRef, contentRef)}
      id={listboxId}
      role="listbox"
      aria-label={listboxAriaLabel}
      aria-multiselectable="true"
      aria-busy={loading || undefined}
      className={classes.content || undefined}
      style={dropdownStyle}
      data-state={isOpen ? "open" : "closed"}
      data-position={coords?.position ?? preferredPosition}
      data-dropdown-id={dropdownId}
    >
      {children}
    </div>,
    portalContainer ?? document.body,
  );
}

const OptionItem = memo(function OptionItem({
  option,
  isSelected,
  isFocused,
  dropdownId,
  index,
  classes,
  checkboxIcon,
  onToggle,
  onHover,
}: {
  option: MultiSelectOption;
  isSelected: boolean;
  isFocused: boolean;
  dropdownId: string;
  index: number;
  classes: Required<MultiSelectSearchableDropdownClasses>;
  checkboxIcon?: ReactNode;
  onToggle: (option: MultiSelectOption) => void;
  onHover: (index: number) => void;
}) {
  const combinedOptionClassName =
    cn(
      classes.option,
      isSelected && classes.optionSelected,
      isFocused && classes.optionFocused,
      option.disabled && classes.optionDisabled,
    ) || undefined;

  const combinedCheckboxClassName =
    cn(
      classes.checkbox,
      isSelected && classes.checkboxChecked,
    ) || undefined;

  return (
    <div
      id={`${dropdownId}-option-${index}`}
      role="option"
      aria-selected={isSelected}
      aria-disabled={option.disabled}
      className={combinedOptionClassName}
      data-selected={isSelected || undefined}
      data-focused={isFocused || undefined}
      data-disabled={option.disabled || undefined}
      onClick={() => onToggle(option)}
      onMouseEnter={() => onHover(index)}
    >
      <span className={combinedCheckboxClassName} data-checked={isSelected || undefined}>
        {isSelected && (checkboxIcon || <CheckIcon className={classes.checkboxIcon || "w-full h-full"} />)}
      </span>
      <span className="flex-1 truncate">
        {option.content || option.label}
      </span>
    </div>
  );
});

const SelectedChip = memo(function SelectedChip({
  option,
  classes,
  onRemove,
}: {
  option: MultiSelectOption;
  classes: Required<MultiSelectSearchableDropdownClasses>;
  onRemove: (value: string) => void;
}) {
  return (
    <span className={classes.chip || undefined}>
      <span className="truncate">
        {option.selectedContent || option.content || option.label}
      </span>
      <span
        role="button"
        tabIndex={0}
        onClick={(e) => {
          e.stopPropagation();
          onRemove(option.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            e.stopPropagation();
            onRemove(option.value);
          }
        }}
        className={classes.chipRemove || undefined}
        aria-label={`Remove ${option.label}`}
      >
        <XIcon className="w-full h-full" />
      </span>
    </span>
  );
});

/**
 * Component: MultiSelectSearchableDropdown
 *
 * Purpose:
 * Searchable multi-select dropdown with chip display, async search/prefetch,
 * checkbox options, and portal-based positioning.
 *
 * AI Usage Guidelines:
 * - Use for selecting multiple values with search/filter capability
 * - Minimum: `<MultiSelectSearchableDropdown options={[...]} onValueChange={handler} />`
 * - Use `onSearch` for async search, `onLoadInitialOptions` for prefetch
 * - Pair `value` with `onValueChange` for controlled mode
 *
 * Behavior:
 * - Built-in search input with local filtering or async search
 * - Portal-rendered popup (never clipped by overflow ancestors)
 * - Auto-flips position (disable with `forceDropdownPosition`)
 * - Full keyboard navigation
 *
 * Reference:
 * - MULTISELECTSEARCHABLEDROPDOWN.ai.md (this directory) — full AI knowledge doc
 * - src/pages/demo/MultiSelectSearchableDropdownDemo.tsx — live demo
 */
const MultiSelectSearchableDropdown = forwardRef<
  HTMLDivElement,
  MultiSelectSearchableDropdownProps
>(
  (
    {
      options = [],
      value,
      defaultValue,
      onValueChange,
      id,
      name,
      placeholder = "Select options...",
      disabled = false,
      error = false,
      errorMessage,
      label,
      description,
      success = false,
      successMessage,
      required = false,
      showSearch = true,
      searchPlaceholder = "Search...",
      noResultsContent = "No options found",
      loadingText = "Loading...",
      shimmerCount = 5,
      clearable = false,
      showChevron = true,
      fullWidth = false,
      loading: externalLoading = false,
      onSearch,
      searchDebounceMs = 300,
      initialOptions = [],
      onLoadInitialOptions,
      loadInitialOnOpen = false,
      onLoadError,
      maxDisplayedChips = 3,
      showSelectedChips = true,
      checkboxIcon,
      unstyled = false,
      lockScroll = false,
      classes: classesProp,
      className,
      style,
      open,
      defaultOpen,
      onOpenChange,
      "aria-label": ariaLabel,
      portalContainer,
      dropdownPosition = "bottom",
      forceDropdownPosition = false,
      dropdownZIndex = 50,
      dropdownGap = 4,
      keepMounted = false,
      onBlur: onBlurProp,
      onFocus: onFocusProp,
      onKeyDown: onKeyDownProp,
      ClearIcon: ClearIconProp,
      renderTrigger,
      searchInputAriaLabel = "Search options",
    },
    ref
  ) => {
    const baseClasses = unstyled
      ? UNSTYLED_MULTISELECTSEARCHABLEDROPDOWN_CLASSES
      : DEFAULT_MULTISELECTSEARCHABLEDROPDOWN_CLASSES;

    const mergedClasses: Required<MultiSelectSearchableDropdownClasses> = useMemo(
      () => ({
        root: classesProp?.root ?? baseClasses.root,
        wrapper: classesProp?.wrapper ?? baseClasses.wrapper,
        trigger: classesProp?.trigger ?? baseClasses.trigger,
        triggerText: classesProp?.triggerText ?? baseClasses.triggerText,
        content: classesProp?.content ?? baseClasses.content,
        optionList: classesProp?.optionList ?? baseClasses.optionList,
        option: classesProp?.option ?? baseClasses.option,
        optionSelected: classesProp?.optionSelected ?? baseClasses.optionSelected,
        optionFocused: classesProp?.optionFocused ?? baseClasses.optionFocused,
        optionDisabled: classesProp?.optionDisabled ?? baseClasses.optionDisabled,
        chevron: classesProp?.chevron ?? baseClasses.chevron,
        checkbox: classesProp?.checkbox ?? baseClasses.checkbox,
        checkboxChecked: classesProp?.checkboxChecked ?? baseClasses.checkboxChecked,
        checkboxIcon: classesProp?.checkboxIcon ?? baseClasses.checkboxIcon,
        chip: classesProp?.chip ?? baseClasses.chip,
        chipRemove: classesProp?.chipRemove ?? baseClasses.chipRemove,
        noResults: classesProp?.noResults ?? baseClasses.noResults,
        clearIcon: classesProp?.clearIcon ?? baseClasses.clearIcon,
        loading: classesProp?.loading ?? baseClasses.loading,
        shimmer: classesProp?.shimmer ?? baseClasses.shimmer,
        shimmerItem: classesProp?.shimmerItem ?? baseClasses.shimmerItem,
        label: classesProp?.label ?? baseClasses.label,
        error: classesProp?.error ?? baseClasses.error,
        description: classesProp?.description ?? baseClasses.description,
        success: classesProp?.success ?? baseClasses.success,
        searchInput: classesProp?.searchInput ?? baseClasses.searchInput,
        searchInputElement: classesProp?.searchInputElement ?? baseClasses.searchInputElement,
        searchIcon: classesProp?.searchIcon ?? baseClasses.searchIcon,
        moreCount: classesProp?.moreCount ?? baseClasses.moreCount,
      }),
      [classesProp, baseClasses],
    );

    const generatedId = useId();
    const dropdownId = id || name || generatedId;
    const listboxId = `${dropdownId}-listbox`;
    const triggerId = `${dropdownId}-trigger`;
    const labelId = `${dropdownId}-label`;
    const errorId = `${dropdownId}-error`;

    const triggerRef = useRef<HTMLButtonElement>(null);
    const [triggerNode, setTriggerNode] = useState<HTMLElement | null>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const prevIsOpenRef = useRef(false);

    const {
      isOpen,
      searchQuery,
      focusedIndex,
      isSearching,
      isLoadingInitial,
      displayOptions,
      selectedOptions,
      selectedValues,
      shouldRestoreFocusRef,
      setSearchQuery,
      setFocusedIndex,
      handleToggle,
      handleClose,
      handleOptionToggle,
      handleRemoveOption,
      handleKeyDown,
    } = useMultiSelectDropdown({
      options,
      value,
      defaultValue,
      disabled,
      showSearch,
      onSearch,
      searchDebounceMs,
      onValueChange,
      initialOptions,
      onLoadInitialOptions,
      loadInitialOnOpen,
      onLoadError,
      open,
      defaultOpen,
      onOpenChange,
      label,
      "aria-label": ariaLabel,
    });

    const loading = externalLoading || isSearching || isLoadingInitial;

    const statusMessage = loading
      ? "Loading options"
      : isOpen
        ? `${displayOptions.length} option${displayOptions.length === 1 ? "" : "s"} available`
        : "";

    const activeDescendantId =
      isOpen && focusedIndex >= 0
        ? `${dropdownId}-option-${focusedIndex}`
        : undefined;

    // Focus search input when dropdown opens
    useEffect(() => {
      if (isOpen && showSearch) {
        const timer = setTimeout(() => searchInputRef.current?.focus({ preventScroll: true }), 10);
        return () => clearTimeout(timer);
      }
    }, [isOpen, showSearch]);

    // Restore focus to trigger when dropdown closes
    useEffect(() => {
      if (!isOpen && prevIsOpenRef.current) {
        if (shouldRestoreFocusRef.current) {
          triggerRef.current?.focus({ preventScroll: true });
          shouldRestoreFocusRef.current = false;
        }
      }
      prevIsOpenRef.current = isOpen;
    }, [isOpen, shouldRestoreFocusRef]);

    // Scroll focused option into view
    useEffect(() => {
      if (!isOpen || focusedIndex < 0 || !isBrowser) return;
      const optionEl = document.getElementById(`${dropdownId}-option-${focusedIndex}`);
      if (optionEl) {
        try {
          optionEl.scrollIntoView({ block: "nearest" });
        } catch {
          optionEl.scrollIntoView(false);
        }
      }
    }, [isOpen, focusedIndex, dropdownId]);

    // Scroll lock when dropdown is open
    const dropdownContentRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
      if (!lockScroll || !isOpen || !isBrowser) return;

      const preventScroll = (e: Event) => {
        if (dropdownContentRef.current?.contains(e.target as Node)) return;
        e.preventDefault();
      };

      window.addEventListener("wheel", preventScroll, { capture: true, passive: false });
      window.addEventListener("touchmove", preventScroll, { capture: true, passive: false });

      return () => {
        window.removeEventListener("wheel", preventScroll, { capture: true } as EventListenerOptions);
        window.removeEventListener("touchmove", preventScroll, { capture: true } as EventListenerOptions);
      };
    }, [lockScroll, isOpen]);

    // Click outside to close (portal-aware)
    useEffect(() => {
      if (!isOpen || !isBrowser) return;

      const handleClickOutside = (event: MouseEvent | TouchEvent) => {
        const target = event.target as Node;
        if (triggerNode?.contains(target)) return;
        const portalEl = (target as HTMLElement).closest?.(`[data-dropdown-id="${dropdownId}"]`);
        if (portalEl) return;
        handleClose();
      };

      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("touchstart", handleClickOutside);
      };
    }, [isOpen, handleClose, triggerNode, dropdownId]);

    // Global keyboard handling for Escape/Tab when portal is open
    useEffect(() => {
      if (!isOpen || !isBrowser) return;
      const handleDocumentKeyDown = (event: globalThis.KeyboardEvent) => {
        if (event.key !== "Escape" && event.key !== "Tab") return;
        handleClose();
        if (event.key === "Escape") {
          event.preventDefault();
        } else if (event.key === "Tab") {
          shouldRestoreFocusRef.current = false;
        }
      };
      document.addEventListener("keydown", handleDocumentKeyDown, true);
      return () => {
        document.removeEventListener("keydown", handleDocumentKeyDown, true);
      };
    }, [isOpen, handleClose, shouldRestoreFocusRef]);

    const mergedTriggerRef = useMemo(
      () =>
        mergeRefs(triggerRef, (node: HTMLButtonElement | null) => {
          setTriggerNode(node);
        }),
      [setTriggerNode],
    );

    const handleClear = useCallback(() => {
      if (onValueChange) {
        onValueChange([], []);
      }
    }, [onValueChange]);

    const ClearIconComponent = ClearIconProp ?? ClearIconDefault;

    const renderTriggerRefCallback = useCallback(
      (node: HTMLElement | null) => {
        setTriggerNode(node);
      },
      [setTriggerNode],
    );

    const handleRemoveOptionAndFocus = useCallback(
      (optionValue: string) => {
        handleRemoveOption(optionValue);
        triggerRef.current?.focus({ preventScroll: true });
      },
      [handleRemoveOption],
    );

    const listboxAriaLabel =
      ariaLabel ??
      (typeof label === "string" ? label : undefined) ??
      "Options";

    const handleKeyDownWithPassthrough = useCallback(
      (event: ReactKeyboardEvent) => {
        onKeyDownProp?.(event);
        if (!event.defaultPrevented) {
          handleKeyDown(event);
        }
      },
      [onKeyDownProp, handleKeyDown],
    );

    const rootClassName =
      cn(
        // layout containment: keep in-flow subtree from inflating document scroll metrics
        "min-w-0 [contain:layout]",
        mergedClasses.root,
        className,
        fullWidth && "w-full",
      ) || undefined;

    const rootStyle: CSSProperties = {
      ...(fullWidth ? { width: "100%" } : {}),
      ...style,
    };
    const hasRootStyle = Object.keys(rootStyle).length > 0;

    const displayedChips = selectedOptions.slice(0, maxDisplayedChips);
    const remainingCount = selectedOptions.length - maxDisplayedChips;

    return (
      <div
        ref={ref}
        className={rootClassName}
        style={hasRootStyle ? rootStyle : undefined}
        data-disabled={disabled || undefined}
        data-error={error || undefined}
        data-open={isOpen || undefined}
        data-full-width={fullWidth || undefined}
        data-success={success || undefined}
      >
        {label && (
          <label
            id={labelId}
            htmlFor={triggerId}
            className={mergedClasses.label || undefined}
          >
            {label}
            {required && <span aria-hidden="true">*</span>}
          </label>
        )}

        {description && (
          <div className={mergedClasses.description || undefined}>{description}</div>
        )}

        <div
          className={cn("relative", mergedClasses.wrapper) || undefined}
        >
          {renderTrigger ? (
            renderTrigger({
              ref: renderTriggerRefCallback,
              id: triggerId,
              role: "combobox",
              "aria-expanded": isOpen,
              "aria-haspopup": "listbox",
              "aria-controls": listboxId,
              "aria-activedescendant": activeDescendantId,
              "aria-invalid": (error || undefined) as boolean | undefined,
              "aria-describedby": error && errorMessage ? errorId : undefined,
              "aria-required": (required || undefined) as boolean | undefined,
              "aria-labelledby": label ? labelId : undefined,
              disabled,
              onClick: handleToggle,
              onKeyDown: handleKeyDownWithPassthrough,
              onFocus: onFocusProp,
              onBlur: onBlurProp,
              "data-disabled": (disabled || undefined) as true | undefined,
              "data-error": (error || undefined) as true | undefined,
              "data-open": (isOpen || undefined) as true | undefined,
              isOpen,
              selectedOptions,
              placeholder,
            })
          ) : (
            <button
              ref={mergedTriggerRef}
              type="button"
              id={triggerId}
              role="combobox"
              aria-expanded={isOpen}
              aria-haspopup="listbox"
              aria-controls={listboxId}
              aria-activedescendant={activeDescendantId}
              aria-labelledby={label ? labelId : undefined}
              aria-invalid={error || undefined}
              aria-describedby={error && errorMessage ? errorId : undefined}
              aria-required={required || undefined}
              disabled={disabled}
              onClick={handleToggle}
              onFocus={onFocusProp}
              onBlur={onBlurProp}
              onKeyDown={handleKeyDownWithPassthrough}
              className={mergedClasses.trigger || undefined}
              data-disabled={disabled || undefined}
              data-error={error || undefined}
              data-open={isOpen || undefined}
            >
              <span className={mergedClasses.triggerText || "flex-1 flex items-center gap-1 min-w-0 overflow-hidden"}>
                {showSelectedChips && selectedOptions.length > 0 ? (
                  <>
                    {displayedChips.map((option) => (
                      <SelectedChip
                        key={option.value}
                        option={option}
                        classes={mergedClasses}
                        onRemove={handleRemoveOptionAndFocus}
                      />
                    ))}
                    {remainingCount > 0 && (
                      <span className={mergedClasses.moreCount || undefined}>
                        +{remainingCount}
                      </span>
                    )}
                  </>
                ) : selectedOptions.length > 0 ? (
                  <span className="truncate">
                    {selectedOptions.length} selected
                  </span>
                ) : (
                  <span className="truncate">{placeholder}</span>
                )}
              </span>
              {showChevron && (
                <ChevronDownIcon
                  className={mergedClasses.chevron || undefined}
                  style={isOpen ? { transform: "rotate(180deg)" } : undefined}
                />
              )}
            </button>
          )}

          {clearable && selectedValues.length > 0 && (
            <button
              type="button"
              tabIndex={-1}
              aria-label="Clear all selections"
              className={mergedClasses.clearIcon || undefined}
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
                triggerNode?.focus({ preventScroll: true });
              }}
            >
              <ClearIconComponent className="w-4 h-4" />
            </button>
          )}

          <DropdownContent
            triggerElement={triggerNode}
            isOpen={isOpen}
            keepMounted={keepMounted}
            position={dropdownPosition}
            forcePosition={forceDropdownPosition}
            zIndex={dropdownZIndex}
            gap={dropdownGap}
            portalContainer={portalContainer}
            classes={mergedClasses}
            listboxId={listboxId}
            dropdownId={dropdownId}
            listboxAriaLabel={listboxAriaLabel}
            loading={loading}
            contentRef={dropdownContentRef}
          >
            {showSearch && (
              <div className={mergedClasses.searchInput || undefined}>
                <SearchIcon className={mergedClasses.searchIcon || undefined} />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder={searchPlaceholder}
                  aria-label={searchInputAriaLabel}
                  aria-controls={listboxId}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onClick={(e) => e.stopPropagation()}
                  className={cn("flex-1 bg-transparent outline-none", mergedClasses.searchInputElement) || undefined}
                />
              </div>
            )}

            <div className={mergedClasses.optionList || undefined}>
              {loading ? (
                <>
                  <div role="status" className={mergedClasses.loading || undefined}>
                    {loadingText}
                  </div>
                  <div className={mergedClasses.shimmer || undefined}>
                    {Array.from({ length: shimmerCount }).map((_, i) => (
                      <div key={i} className={mergedClasses.shimmerItem || undefined} />
                    ))}
                  </div>
                </>
              ) : displayOptions.length === 0 ? (
                <div role="status" className={mergedClasses.noResults || undefined}>
                  {noResultsContent}
                </div>
              ) : (
                displayOptions.map((option, index) => (
                  <OptionItem
                    key={option.value}
                    option={option}
                    isSelected={selectedValues.includes(option.value)}
                    isFocused={index === focusedIndex}
                    dropdownId={dropdownId}
                    index={index}
                    classes={mergedClasses}
                    checkboxIcon={checkboxIcon}
                    onToggle={handleOptionToggle}
                    onHover={setFocusedIndex}
                  />
                ))
              )}
            </div>
          </DropdownContent>
        </div>

        {name && (
          <input type="hidden" name={name} value={selectedOptions.map((o) => o.value).join(",")} aria-hidden="true" />
        )}

        <div id={`${dropdownId}-status`} role="status" aria-live="polite" aria-atomic="true" style={SR_ONLY_STYLE}>{statusMessage}</div>

        {error && errorMessage && (
          <div
            id={errorId}
            role="alert"
            className={mergedClasses.error || undefined}
          >
            {errorMessage}
          </div>
        )}

        {success && successMessage && !error && (
          <div className={mergedClasses.success || undefined}>{successMessage}</div>
        )}
      </div>
    );
  }
);

MultiSelectSearchableDropdown.displayName = "MultiSelectSearchableDropdown";

export default MultiSelectSearchableDropdown;
