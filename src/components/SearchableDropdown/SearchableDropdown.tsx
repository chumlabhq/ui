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
import { useLayer } from "../../utils/layers.js";
import type { CSSProperties, ReactNode } from "react";
import type {
  SearchableDropdownProps,
  SearchableDropdownClasses,
} from "./utils/types.js";
import { useDropdown } from "./utils/useDropdown.js";
import { ChevronDownIcon, SearchIcon } from "./utils/icons.js";
import {
  scrollOptionIntoView,
  isBrowser,
} from "./utils/helpers.js";
import SearchableDropdownShimmer from "./components/SearchableDropdownShimmer.js";
import { SearchableDropdownOption as SearchableDropdownOptionComponent } from "./components/SearchableDropdownOption.js";
import { cn } from "../../utils/scopedCn.js";
import { mergeSlot } from "../../utils/mergeSlot.js";
import {
  DEFAULT_SEARCHABLEDROPDOWN_CLASSES,
  UNSTYLED_SEARCHABLEDROPDOWN_CLASSES,
} from "./utils/constants.js";
import { SR_ONLY_STYLE } from "../../utils/srOnlyStyle.js";
import { FormValue } from "../../utils/FormValue.js";
import { mergeRefs, setRef } from "../../utils/mergeRefs.js";
import { useAnchoredPosition } from "../../utils/useAnchoredPosition.js";

import { motionSafeClasses } from "../../utils/classLayers.js";
import { useReducedMotion } from "../../utils/useReducedMotion.js";
import { comboboxNameProps } from "../../utils/comboboxName.js";
import { useAccessibleNameWarning } from "../../utils/useAccessibleNameWarning.js";
import { useControlledSwitchWarning } from "../../utils/useControlledSwitchWarning.js";
import MenuSurface from "../../utils/menu/MenuSurface.js";
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
  searchIcon?: ReactNode;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  onSearchInputKeyDown: (event: React.KeyboardEvent) => void;
  onSearchInputKeyDownCapture?: (event: React.KeyboardEvent) => void;
  /** The loading or empty message, beside the listbox rather than inside it. */
  status?: ReactNode;
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
  searchIcon,
  searchInputRef,
  onSearchInputKeyDown,
  onSearchInputKeyDownCapture,
  status,
  children,
}: SearchableDropdownContentProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
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

  return (
    <MenuSurface
      ref={mergeRefs(dropdownRef, contentRef)}
      trigger={triggerElement}
      isOpen={isOpen}
      side={preferredPosition}
      forceSide={forcePosition}
      gap={gap}
      zIndex={zIndex}
      portalContainer={portalContainer}
      keepMounted={keepMounted}
      matchTriggerWidth={false}
      // The panel is announced even though it is no longer the listbox: it is
      // portalled to the body, and the search field inside it would otherwise
      // sit in a subtree that tells a screen-reader user nothing about what it
      // belongs to (portal-semantics.contract).
      role="group"
      aria-label={ariaLabel}
      className={classes.content || undefined}
      data-state={isOpen ? "open" : "closed"}
      data-position={coords?.side ?? preferredPosition}
      data-dropdown-id={dropdownId}
    >
      {showSearch && (
        <div className={classes.searchControl || undefined}>
          {searchIcon ?? <SearchIcon className={cn(classes.searchIcon) || undefined} />}
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
      {status}
      {/* The search field and the "no results" message are siblings of the
          listbox, not children of it: a listbox owns options and groups, and a
          textbox inside one is announced as part of the list. */}
      <div
        id={listboxId}
        role="listbox"
        aria-label={ariaLabel}
        aria-busy={loading || undefined}
        className={classes.list || undefined}
      >
        {children}
      </div>
    </MenuSurface>
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
 * - Use `searchOptions` for async search, `loadInitialOptions` for prefetch
 * - Pair `value` with `onValueChange` for controlled mode
 *
 * Behavior:
 * - Built-in search input with local filtering or async search
 * - Portal-rendered popup (never clipped by overflow ancestors)
 * - Auto-flips position (disable with `forceDropdownSide`)
 * - Full keyboard navigation with type-ahead
 *
 * Reference:
 * - SEARCHABLEDROPDOWN.ai.md (this directory) — full AI knowledge doc
 * - src/pages/demo/SearchableDropdownDemo.tsx — live demo
 */
const SearchableDropdown = forwardRef<
  HTMLButtonElement,
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
    emptyContent = "No results found",
    showChevron = true,
    showSelectedIcon = true,
    selectedIcon,
    fullWidth = false,
    loading: externalLoading = false,
    searchOptions,
    searchDebounce = 300,
    initialOptions = [],
    loadInitialOptions,
    loadInitialOnOpen = false,
    onLoadError,
    shimmerCount = 5,
    loadingContent = "Loading...",
    unstyled = false,
    classes: classesProp,
    className,
    style,
    keepMounted = false,
    portalContainer,
    lockScroll = false,
    dropdownSide = "bottom",
    forceDropdownSide = false,
    dropdownZIndex: dropdownZIndexProp,
    dropdownOffset = 4,
    typeaheadTimeout = 500,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    "aria-describedby": ariaDescribedBy,
    onBlur,
    onFocus,
    onKeyDown: onKeyDownProp,
    renderTrigger,
    chevronIcon,
    clearIcon,
    searchIcon,
  } = props;

  const dropdownZIndex = useLayer(dropdownZIndexProp);

  const prefersReducedMotion = useReducedMotion();

  const baseClassesRaw = unstyled ? UNSTYLED_SEARCHABLEDROPDOWN_CLASSES : DEFAULT_SEARCHABLEDROPDOWN_CLASSES;

  const baseClasses = motionSafeClasses(baseClassesRaw, prefersReducedMotion);

  const mergedClasses: Required<SearchableDropdownClasses> = useMemo(
    () => ({
      root: mergeSlot(baseClasses.root, classesProp?.root),
      control: mergeSlot(baseClasses.control, classesProp?.control),
      trigger: mergeSlot(baseClasses.trigger, classesProp?.trigger),
      value: mergeSlot(baseClasses.value, classesProp?.value),
      content: mergeSlot(baseClasses.content, classesProp?.content),
      list: mergeSlot(baseClasses.list, classesProp?.list),
      item: mergeSlot(baseClasses.item, classesProp?.item),
      icon: mergeSlot(baseClasses.icon, classesProp?.icon),
      itemIndicator: mergeSlot(baseClasses.itemIndicator, classesProp?.itemIndicator),
      clearTrigger: mergeSlot(baseClasses.clearTrigger, classesProp?.clearTrigger),
      empty: mergeSlot(baseClasses.empty, classesProp?.empty),
      label: mergeSlot(baseClasses.label, classesProp?.label),
      message: mergeSlot(baseClasses.message, classesProp?.message),
      description: mergeSlot(baseClasses.description, classesProp?.description),
      searchControl: mergeSlot(baseClasses.searchControl, classesProp?.searchControl),
      searchInput: mergeSlot(baseClasses.searchInput, classesProp?.searchInput),
      searchIcon: mergeSlot(baseClasses.searchIcon, classesProp?.searchIcon),
      loading: mergeSlot(baseClasses.loading, classesProp?.loading),
      loadingItem: mergeSlot(baseClasses.loadingItem, classesProp?.loadingItem),
    }),
    [classesProp, baseClasses],
  );

  const generatedId = useId();
  const dropdownId = id || generatedId;
  const listboxId = `${dropdownId}-listbox`;
  const triggerId = id ?? `${dropdownId}-trigger`;
  const labelId = `${dropdownId}-label`;
  const valueId = `${dropdownId}-value`;

  useAccessibleNameWarning("SearchableDropdown", { label, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy });
  const errorId = `${dropdownId}-error`;
  const descriptionId = `${dropdownId}-description`;
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
    resetValue,
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
    searchOptions,
    searchDebounce,
    initialOptions,
    loadInitialOptions,
    loadInitialOnOpen,
    onLoadError,
    typeaheadTimeout,
    label,
    "aria-label": ariaLabel,
  });

  const loading = externalLoading || isSearching || isLoadingInitial;
  const currentValue = value !== undefined ? value : internalValue;
  useControlledSwitchWarning(value !== undefined, "SearchableDropdown");

  const activeDescendantId =
    isOpen && focusedIndex >= 0
      ? `${dropdownId}-option-${focusedIndex}`
      : undefined;

  const statusMessage = loading
    ? loadingContent
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
      setRef(forwardedRef, node);
    },
    [forwardedRef],
  );

  const renderTriggerRefCallback = useCallback(
    (node: HTMLElement | null) => {
      setTriggerNode(node);
      setRef(forwardedRef, node as HTMLButtonElement | null);
    },
    [forwardedRef],
  );

  const triggerProps = {
    type: "button" as const,
    id: triggerId,
    role: "combobox" as const,
    "aria-expanded": isOpen,
    "aria-haspopup": "listbox" as const,
    "aria-controls": isOpen ? listboxId : undefined,
    "aria-activedescendant": showSearch ? undefined : activeDescendantId,
    "aria-invalid": (error || undefined) as boolean | undefined,
    "aria-describedby": [ariaDescribedBy, description && descriptionId, error && errorMessage ? errorId : undefined].filter(Boolean).join(" ") || undefined,
    "aria-required": (required || undefined) as boolean | undefined,
    ...comboboxNameProps({ valueId, labelId, hasLabel: !!label, ariaLabel, ariaLabelledBy, hasValueElement: !renderTrigger }),
    disabled,
    onClick: handleToggle,
    onKeyDown: handleKeyDownWithPassthrough,
    onFocus,
    onBlur,
    "data-disabled": (disabled || undefined) as true | undefined,
    "data-error": (error || undefined) as true | undefined,
    "data-valid": ((!error && success) || undefined) as true | undefined,
    "data-open": (isOpen || undefined) as true | undefined,
    "data-placeholder": (!selectedOption || undefined) as true | undefined,
  };

  return (
    <div
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
        <div id={descriptionId} className={mergedClasses.description || undefined}>{description}</div>
      )}

      <div className={mergedClasses.control || undefined}>
        {renderTrigger ? (
          renderTrigger(
            { ...triggerProps, ref: renderTriggerRefCallback },
            { isOpen, selectedOption, placeholder },
          )
        ) : (
          <button
            ref={mergedTriggerRef}
            {...triggerProps}
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
              chevronIcon ? (
                <span
                  className={mergedClasses.icon || undefined}
                  style={isOpen ? { transform: "rotate(180deg)" } : undefined}
                >
                  {chevronIcon}
                </span>
              ) : (
                <ChevronDownIcon
                  className={cn(mergedClasses.icon) || undefined}
                  style={isOpen ? { transform: "rotate(180deg)" } : undefined}
                />
              )
            )}
          </button>
        )}

        {clearable && selectedOption && (
          <button
            type="button"
            aria-label="Clear selection"
            className={mergedClasses.clearTrigger || undefined}
            onClick={(e) => {
              e.stopPropagation();
              handleClear(e);
              triggerNode?.focus({ preventScroll: true });
            }}
          >
            {clearIcon ?? <DefaultClearIcon />}
          </button>
        )}

        <SearchableDropdownContent
          triggerElement={triggerNode}
          isOpen={isOpen}
          keepMounted={keepMounted}
          position={dropdownSide}
          forcePosition={forceDropdownSide}
          zIndex={dropdownZIndex}
          gap={dropdownOffset}
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
          searchIcon={searchIcon}
          searchInputRef={searchInputRef}
          onSearchInputKeyDown={handleSearchInputKeyDown}
          onSearchInputKeyDownCapture={handleSearchInputKeyDownCapture}
          status={
            loading ? (
              <SearchableDropdownShimmer
                count={shimmerCount}
                className={mergedClasses.loading}
                itemClassName={mergedClasses.loadingItem}
              />
            ) : displayOptions.length === 0 ? (
              <div role="status" className={mergedClasses.empty || undefined}>
                {emptyContent}
              </div>
            ) : null
          }
        >
          {loading
            ? null
            : displayOptions.map((option, index) => (
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
                  onSelect={handleOptionSelect}
                  onHover={setFocusedIndex}
                />
              ))}
        </SearchableDropdownContent>
      </div>

      {name && (
        <FormValue
          entries={[[name, selectedOption ? (currentValue ?? "") : ""]]}
          required={required}
          disabled={disabled}
          onReset={resetValue}
          focusTarget={triggerNode}
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
