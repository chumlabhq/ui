import {
  useRef,
  useEffect,
  useId,
  forwardRef,
  memo,
  useMemo,
  useState,
  useCallback,
} from "react";
import { createPortal } from "react-dom";
import { useLayer } from "../../utils/layers";
import type { CSSProperties, ReactNode } from "react";
import type {
  SearchableDropdownProps,
  SearchableDropdownClasses,
} from "./utils/types";
import { useDropdown } from "./utils/useDropdown";
import { ChevronDownIcon, CheckIcon, SearchIcon } from "./utils/icons";
import {
  scrollOptionIntoView,
  isBrowser,
} from "./utils/helpers";
import SearchableDropdownShimmer from "./components/SearchableDropdownShimmer";
import { SearchableDropdownOption as SearchableDropdownOptionComponent } from "./components/SearchableDropdownOption";
import { cn } from "../../utils/scopedCn";
import {
  DEFAULT_SEARCHABLEDROPDOWN_CLASSES,
  UNSTYLED_SEARCHABLEDROPDOWN_CLASSES,
} from "./utils/constants";
import { SR_ONLY_STYLE } from "../../utils/srOnlyStyle";
import { mergeRefs } from "../../utils/mergeRefs";
import { useAnchoredPosition } from "../../utils/useAnchoredPosition";
import { useStablePositionAfterOpen } from "../../utils/useStablePositionAfterOpen";

import { motionSafeClasses } from "../../utils/classLayers";
import { useReducedMotion } from "../../utils/useReducedMotion";
import { comboboxNameProps } from "../../utils/comboboxName";
import { useAccessibleNameWarning } from "../../utils/useAccessibleNameWarning";
import { surfaceStyle } from "../../utils/menu/measuringStyle";
const DefaultClearIcon = () => (
  <svg
    viewBox="0 0 20 20"
    fill="currentColor"
    width={16}
    height={16}
    aria-hidden="true"
    focusable="false"
  >
    <path
      fillRule="evenodd"
      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
);

interface SearchableDropdownContentProps {
  triggerElement: HTMLElement | null;
  isOpen: boolean;
  keepMounted: boolean;
  position: "top" | "bottom";
  forcePosition: boolean;
  zIndex: number;
  gap: number;
  portalContainer?: HTMLElement | null;
  classes: Required<SearchableDropdownClasses>;
  contentRef?: React.RefObject<HTMLDivElement | null>;
  listboxId: string;
  dropdownId: string;
  focusedIndex: number;
  loading: boolean;
  ariaLabel: string;
  showSearch: boolean;
  searchPlaceholder: string;
  searchInputAriaLabel: string;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  SearchIconComponent: React.ComponentType<{ className?: string }>;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  onSearchInputKeyDown: (event: React.KeyboardEvent) => void;
  onSearchInputKeyDownCapture?: (event: React.KeyboardEvent) => void;
  children: ReactNode;
}

const SearchableDropdownContent = memo(function SearchableDropdownContent({
  triggerElement,
  isOpen,
  keepMounted,
  position: preferredPosition,
  forcePosition,
  zIndex,
  gap,
  portalContainer,
  classes,
  contentRef,
  listboxId,
  dropdownId,
  focusedIndex,
  loading,
  ariaLabel,
  showSearch,
  searchPlaceholder,
  searchInputAriaLabel,
  searchQuery,
  onSearchQueryChange,
  SearchIconComponent,
  searchInputRef,
  onSearchInputKeyDown,
  onSearchInputKeyDownCapture,
  children,
}: SearchableDropdownContentProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isPositionStable = useStablePositionAfterOpen(isOpen);
  const coords = useAnchoredPosition(triggerElement, dropdownRef, isOpen, {
    side: preferredPosition,
    gap,
    forceSide: forcePosition,
  });

  useEffect(() => {
    if (!isOpen || focusedIndex < 0) return;
    const optionEl = document.getElementById(
      `${dropdownId}-option-${focusedIndex}`,
    );
    if (optionEl) {
      scrollOptionIntoView(optionEl);
    }
  }, [isOpen, focusedIndex, dropdownId]);

  useEffect(() => {
    if (isOpen && showSearch && searchInputRef.current) {
      searchInputRef.current.focus({ preventScroll: true });
    }
  }, [isOpen, showSearch, searchInputRef]);

  if (!isBrowser) return null;
  if (!isOpen && !keepMounted) return null;

  const dropdownStyle: CSSProperties = {
    position: "fixed",
    zIndex,
    margin: 0,
    ...surfaceStyle(
      coords ? { top: coords.top, left: coords.left, minWidth: coords.width } : null,
      isPositionStable,
    ),
    ...(!isOpen && keepMounted ? { display: "none" } : {}),
  };

  return createPortal(
    <div
      ref={mergeRefs(dropdownRef, contentRef)}
      id={listboxId}
      role="listbox"
      aria-label={ariaLabel}
      aria-busy={loading || undefined}
      className={classes.content || undefined}
      style={dropdownStyle}
      data-state={isOpen ? "open" : "closed"}
      data-position={coords?.side ?? preferredPosition}
      data-dropdown-id={dropdownId}
    >
      {showSearch && (
        <div className={classes.searchControl || undefined}>
          <SearchIconComponent className={cn(classes.searchIcon) || undefined} />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            onKeyDown={onSearchInputKeyDown}
            onKeyDownCapture={onSearchInputKeyDownCapture}
            placeholder={searchPlaceholder}
            className={classes.searchInput || undefined}
            aria-label={searchInputAriaLabel}
            aria-autocomplete="list"
            aria-controls={listboxId}
            // The active-descendant relationship follows the focus. Opening
            // the menu moves focus here, so `aria-activedescendant` on the
            // trigger described the arrow-key highlight to an element nobody
            // was on: the navigation happened and was announced to nobody.
            //
            // The `combobox` role stays on the trigger. Exactly one element may
            // hold it, the trigger is what owns and announces the value, and a
            // textbox supports `aria-activedescendant` and `aria-autocomplete`
            // on its own — so the relationship moves without the role.
            aria-activedescendant={
              focusedIndex >= 0
                ? `${dropdownId}-option-${focusedIndex}`
                : undefined
            }
          />
        </div>
      )}
      <div className={classes.list || undefined}>{children}</div>
    </div>,
    portalContainer ?? document.body,
  );
});

/**
 * Component: SearchableDropdown
 *
 * Purpose:
 * Single-select dropdown with built-in search input, async search/prefetch,
 * portal rendering, and keyboard navigation.
 *
 * AI Usage Guidelines:
 * - Use for selecting a single value with search/filter capability
 * - Minimum: `<SearchableDropdown options={[...]} onValueChange={handler} />`
 * - Use `onSearch` for async search, `onLoadInitialOptions` for prefetch
 * - Pair `value` with `onValueChange` for controlled mode
 *
 * Behavior:
 * - Built-in search input with local filtering or async search
 * - Portal-rendered popup (never clipped by overflow ancestors)
 * - Auto-flips position (disable with `forceDropdownPosition`)
 * - Full keyboard navigation with type-ahead
 *
 * Reference:
 * - SEARCHABLEDROPDOWN.ai.md (this directory) — full AI knowledge doc
 * - src/pages/demo/SearchableDropdownDemo.tsx — live demo
 */
const SearchableDropdown = forwardRef<
  HTMLDivElement,
  SearchableDropdownProps
>((props, forwardedRef) => {
  const {
    options = [],
    value,
    defaultValue,
    onValueChange,
    open,
    defaultOpen,
    onOpenChange,
    id,
    name,
    placeholder = "Select an option",
    disabled = false,
    error = false,
    errorMessage,
    label,
    description,
    success = false,
    successMessage,
    required = false,
    clearable = false,
    showSearch = true,
    searchPlaceholder = "Search...",
    searchInputAriaLabel = "Search options",
    noResultsContent = "No results found",
    showChevron = true,
    showSelectedIcon = true,
    selectedIcon,
    fullWidth = false,
    loading: externalLoading = false,
    onSearch,
    searchDebounceMs = 300,
    initialOptions = [],
    onLoadInitialOptions,
    loadInitialOnOpen = false,
    onLoadError,
    shimmerCount = 5,
    loadingText = "Loading...",
    unstyled = false,
    classes: classesProp,
    className,
    style,
    keepMounted = false,
    portalContainer,
    lockScroll = false,
    dropdownPosition = "bottom",
    forceDropdownPosition = false,
    dropdownZIndex: dropdownZIndexProp,
    dropdownGap = 4,
    typeaheadTimeout = 500,
    "aria-label": ariaLabel,
    onBlur,
    onFocus,
    onKeyDown: onKeyDownProp,
    renderTrigger,
    ChevronIcon = ChevronDownIcon,
    CheckIcon: CheckIconProp = CheckIcon,
    ClearIcon: ClearIconProp = DefaultClearIcon,
    SearchIcon: SearchIconProp = SearchIcon,
  } = props;

  // ADR: floating content resolves its layer from the nearest overlay, so a
  // dropdown inside a drawer stacks above it. An explicit prop still wins.
  const dropdownZIndex = useLayer(dropdownZIndexProp);


  const prefersReducedMotion = useReducedMotion();

  const baseClassesRaw = unstyled ? UNSTYLED_SEARCHABLEDROPDOWN_CLASSES : DEFAULT_SEARCHABLEDROPDOWN_CLASSES;

  // Motion is decorative under ADR 001, so `unstyled` has already removed it;
  // this handles the other reason to stop animating. Applied to the defaults
  // only — a class string the consumer supplied is theirs to control.
  const baseClasses = motionSafeClasses(baseClassesRaw, prefersReducedMotion);

  const mergedClasses: Required<SearchableDropdownClasses> = useMemo(
    () => ({
      root: classesProp?.root ?? baseClasses.root,
      control: classesProp?.control ?? baseClasses.control,
      trigger: classesProp?.trigger ?? baseClasses.trigger,
      value: classesProp?.value ?? baseClasses.value,
      content: classesProp?.content ?? baseClasses.content,
      list: classesProp?.list ?? baseClasses.list,
      item: classesProp?.item ?? baseClasses.item,
      icon: classesProp?.icon ?? baseClasses.icon,
      itemIndicator: classesProp?.itemIndicator ?? baseClasses.itemIndicator,
      clearTrigger: classesProp?.clearTrigger ?? baseClasses.clearTrigger,
      empty: classesProp?.empty ?? baseClasses.empty,
      label: classesProp?.label ?? baseClasses.label,
      message: classesProp?.message ?? baseClasses.message,
      description: classesProp?.description ?? baseClasses.description,
      searchControl: classesProp?.searchControl ?? baseClasses.searchControl,
      searchInput: classesProp?.searchInput ?? baseClasses.searchInput,
      searchIcon: classesProp?.searchIcon ?? baseClasses.searchIcon,
      loading: classesProp?.loading ?? baseClasses.loading,
      loadingItem: classesProp?.loadingItem ?? baseClasses.loadingItem,
    }),
    [classesProp, baseClasses],
  );

  const generatedId = useId();
  const dropdownId = id || generatedId;
  const listboxId = `${dropdownId}-listbox`;
  const triggerId = `${dropdownId}-trigger`;
  const labelId = `${dropdownId}-label`;
  const valueId = `${dropdownId}-value`;

  // The value fallback in `comboboxNameProps` gives the trigger a name, but a
  // control named only by its own value says nothing about what it selects.
  useAccessibleNameWarning("SearchableDropdown", { label, "aria-label": ariaLabel });
  const errorId = `${dropdownId}-error`;
  const statusId = `${dropdownId}-status`;

  const [triggerNode, setTriggerNode] = useState<HTMLElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const {
    isOpen,
    searchQuery,
    focusedIndex,
    isSearching,
    isLoadingInitial,
    displayOptions,
    selectedOption,
    internalValue,
    shouldRestoreFocusRef,
    setSearchQuery,
    setFocusedIndex,
    handleToggle,
    handleClose,
    handleClear,
    handleOptionSelect,
    handleKeyDown,
  } = useDropdown({
    options,
    value,
    defaultValue,
    onValueChange,
    open,
    defaultOpen,
    onOpenChange,
    disabled,
    clearable,
    showSearch,
    onSearch,
    searchDebounceMs,
    initialOptions,
    onLoadInitialOptions,
    loadInitialOnOpen,
    onLoadError,
    typeaheadTimeout,
    label,
    "aria-label": ariaLabel,
  });

  const loading = externalLoading || isSearching || isLoadingInitial;
  const currentValue = value !== undefined ? value : internalValue;

  const activeDescendantId =
    isOpen && focusedIndex >= 0
      ? `${dropdownId}-option-${focusedIndex}`
      : undefined;

  const statusMessage = loading
    ? loadingText
    : isOpen
      ? `${displayOptions.length} option${displayOptions.length === 1 ? "" : "s"} available`
      : selectedOption
        ? `Selected: ${selectedOption.label}`
        : "";

  useEffect(() => {
    if (!isOpen) return;
    if (!isBrowser) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (triggerNode?.contains(target)) return;
      const portalDropdown = (target as HTMLElement).closest?.(
        `[data-dropdown-id="${dropdownId}"]`,
      );
      if (portalDropdown) return;
      handleClose();
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen, handleClose, triggerNode, dropdownId]);

  useEffect(() => {
    if (!isOpen) return;
    if (!isBrowser) return;

    const handleDocumentKeyDown = (event: KeyboardEvent) => {
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

  useEffect(() => {
    if (!isOpen && shouldRestoreFocusRef.current) {
      triggerNode?.focus({ preventScroll: true });
      shouldRestoreFocusRef.current = false;
    }
  }, [isOpen, shouldRestoreFocusRef, triggerNode]);

  // Scroll lock when dropdown is open — uses event prevention (works on any scrollable ancestor)
  const dropdownContentRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!lockScroll || !isOpen || !isBrowser) return;

    const preventScroll = (e: Event) => {
      // Allow scroll inside the dropdown content itself
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

  const rootClassName = cn(mergedClasses.root, className) || undefined;
  const rootStyle: CSSProperties = {
    ...(fullWidth ? { width: "100%" } : {}),
    ...style,
  };
  const hasRootStyle = Object.keys(rootStyle).length > 0;

  const listboxAriaLabel =
    ariaLabel ?? (typeof label === "string" ? label : undefined) ?? "Options";

  const handleKeyDownWithPassthrough = useCallback(
    (event: React.KeyboardEvent) => {
      onKeyDownProp?.(event);
      if (!event.defaultPrevented) {
        handleKeyDown(event);
      }
    },
    [onKeyDownProp, handleKeyDown],
  );

  const handleSearchInputKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      event.stopPropagation();
      handleKeyDown(event);
    },
    [handleKeyDown],
  );

  const handleSearchInputKeyDownCapture = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key !== "Escape" && event.key !== "Tab") return;
      handleClose();
      if (event.key === "Escape") {
        event.preventDefault();
      } else if (event.key === "Tab") {
        shouldRestoreFocusRef.current = false;
      }
    },
    [handleClose, shouldRestoreFocusRef],
  );

  const mergedTriggerRef = useCallback(
    (node: HTMLButtonElement | null) => {
      setTriggerNode(node);
    },
    [],
  );

  const renderTriggerRefCallback = useCallback(
    (node: HTMLElement | null) => {
      setTriggerNode(node);
    },
    [],
  );

  const triggerProps = {
    type: "button" as const,
    id: triggerId,
    role: "combobox" as const,
    "aria-expanded": isOpen,
    "aria-haspopup": "listbox" as const,
    "aria-controls": listboxId,
    "aria-activedescendant": showSearch ? undefined : activeDescendantId,
    "aria-invalid": (error || undefined) as boolean | undefined,
    "aria-describedby": error && errorMessage ? errorId : undefined,
    "aria-required": (required || undefined) as boolean | undefined,
    ...comboboxNameProps({ valueId, labelId, hasLabel: !!label, ariaLabel }),
    disabled,
    onClick: handleToggle,
    onKeyDown: handleKeyDownWithPassthrough,
    onFocus,
    onBlur,
    "data-disabled": (disabled || undefined) as true | undefined,
    "data-error": (error || undefined) as true | undefined,
    "data-open": (isOpen || undefined) as true | undefined,
    "data-placeholder": (!selectedOption || undefined) as true | undefined,
  };

  return (
    <div
      ref={forwardedRef}
      className={rootClassName}
      style={hasRootStyle ? rootStyle : undefined}
      data-disabled={disabled || undefined}
      data-error={error || undefined}
      data-open={isOpen || undefined}
      data-full-width={fullWidth || undefined}
      data-valid={(!error && success) || undefined}
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

      <div className={mergedClasses.control || undefined}>
        {renderTrigger ? (
          renderTrigger({
            ...triggerProps,
            ref: renderTriggerRefCallback,
            isOpen,
            selectedOption,
            placeholder,
          })
        ) : (
          <button
            ref={mergedTriggerRef}
            {...triggerProps}
            type="button"
            className={mergedClasses.trigger || undefined}
          >
            <span id={valueId} className={mergedClasses.value || undefined}>
              {selectedOption
                ? selectedOption.selectedContent ||
                  selectedOption.content ||
                  selectedOption.label
                : placeholder}
            </span>
            {showChevron && (
              <ChevronIcon
                className={cn(mergedClasses.icon) || undefined}
                style={isOpen ? { transform: "rotate(180deg)" } : undefined}
              />
            )}
          </button>
        )}

        {clearable && selectedOption && (
          <button
            type="button"
            // SC 2.1.1: this was tabIndex={-1}, so clearing could only be done
            // with a pointer — and for a single select there is no other way
            // back to an empty value.
            aria-label="Clear selection"
            className={mergedClasses.clearTrigger || undefined}
            onClick={(e) => {
              e.stopPropagation();
              handleClear(e);
              triggerNode?.focus({ preventScroll: true });
            }}
          >
            <ClearIconProp />
          </button>
        )}

        <SearchableDropdownContent
          triggerElement={triggerNode}
          isOpen={isOpen}
          keepMounted={keepMounted}
          position={dropdownPosition}
          forcePosition={forceDropdownPosition}
          zIndex={dropdownZIndex}
          gap={dropdownGap}
          portalContainer={portalContainer}
          classes={mergedClasses}
          contentRef={dropdownContentRef}
          listboxId={listboxId}
          dropdownId={dropdownId}
          focusedIndex={focusedIndex}
          loading={loading}
          ariaLabel={listboxAriaLabel}
          showSearch={showSearch}
          searchPlaceholder={searchPlaceholder}
          searchInputAriaLabel={searchInputAriaLabel}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          SearchIconComponent={SearchIconProp}
          searchInputRef={searchInputRef}
          onSearchInputKeyDown={handleSearchInputKeyDown}
          onSearchInputKeyDownCapture={handleSearchInputKeyDownCapture}
        >
          {loading ? (
            <SearchableDropdownShimmer
              count={shimmerCount}
              className={mergedClasses.loading}
              itemClassName={mergedClasses.loadingItem}
            />
          ) : displayOptions.length === 0 ? (
            <div role="status" className={mergedClasses.empty || undefined}>
              {noResultsContent}
            </div>
          ) : (
            displayOptions.map((option, index) => (
              <SearchableDropdownOptionComponent
                key={option.value}
                option={option}
                isSelected={option.value === currentValue}
                isFocused={index === focusedIndex}
                dropdownId={dropdownId}
                index={index}
                classes={mergedClasses}
                showSelectedIcon={showSelectedIcon}
                selectedIcon={selectedIcon}
                CheckIconComponent={CheckIconProp}
                onSelect={handleOptionSelect}
                onHover={setFocusedIndex}
              />
            ))
          )}
        </SearchableDropdownContent>
      </div>

      {name && (
        <input
          type="hidden"
          name={name}
          value={selectedOption ? (currentValue ?? "") : ""}
          aria-hidden="true"
        />
      )}

      <div
        id={statusId}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        style={SR_ONLY_STYLE}
      >
        {statusMessage}
      </div>

      {error && errorMessage && (
        <div
          id={errorId}
          role="alert"
          data-invalid
          className={mergedClasses.message || undefined}
        >
          {errorMessage}
        </div>
      )}

      {success && successMessage && !error && (
        <div role="status" data-valid className={mergedClasses.message || undefined}>{successMessage}</div>
      )}
    </div>
  );
});

SearchableDropdown.displayName = "SearchableDropdown";

export default SearchableDropdown;
