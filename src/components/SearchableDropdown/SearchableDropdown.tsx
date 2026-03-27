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
import type { CSSProperties, ReactNode } from "react";
import type {
  SearchableDropdownProps,
  SearchableDropdownClasses,
} from "./utils/types";
import { useDropdown } from "./utils/useDropdown";
import { ChevronDownIcon, CheckIcon, SearchIcon } from "./utils/icons";
import {
  computeDropdownCoords,
  scrollOptionIntoView,
  isBrowser,
} from "./utils/helpers";
import type { DropdownCoords } from "./utils/helpers";
import SearchableDropdownShimmer from "./components/SearchableDropdownShimmer";
import { SearchableDropdownOption as SearchableDropdownOptionComponent } from "./components/SearchableDropdownOption";
import { cn } from "../../utils/cn";
import {
  DEFAULT_SEARCHABLEDROPDOWN_CLASSES,
  UNSTYLED_SEARCHABLEDROPDOWN_CLASSES,
} from "./utils/constants";
import { SR_ONLY_STYLE } from "../../utils/srOnlyStyle";
import { mergeRefs } from "../../utils/mergeRefs";
import { useStablePositionAfterOpen } from "../../utils/useStablePositionAfterOpen";

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
  searchQuery,
  onSearchQueryChange,
  SearchIconComponent,
  searchInputRef,
  onSearchInputKeyDown,
  onSearchInputKeyDownCapture,
  children,
}: SearchableDropdownContentProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<DropdownCoords | null>(null);
  const isPositionStable = useStablePositionAfterOpen(isOpen);
  const rafIdRef = useRef<number | null>(null);

  const updatePosition = useCallback(() => {
    if (!triggerElement || !dropdownRef.current) return;
    setCoords(
      computeDropdownCoords(
        triggerElement,
        dropdownRef.current,
        preferredPosition,
        gap,
      ),
    );
  }, [triggerElement, preferredPosition, gap]);

  useEffect(() => {
    if (!isOpen) return;
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
    }
    rafIdRef.current = requestAnimationFrame(updatePosition);
  }, [isOpen, updatePosition]);

  useEffect(() => {
    if (!isOpen || !isBrowser) return;
    const handleResize = () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
      rafIdRef.current = requestAnimationFrame(updatePosition);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [isOpen, updatePosition]);

  useEffect(() => {
    if (!isOpen || !isBrowser) return;
    const handleScroll = () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
      rafIdRef.current = requestAnimationFrame(updatePosition);
    };
    window.addEventListener("scroll", handleScroll, true);
    return () => {
      window.removeEventListener("scroll", handleScroll, true);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [isOpen, updatePosition]);

  useEffect(() => {
    if (!isOpen || !isBrowser || !triggerElement) return;
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
      rafIdRef.current = requestAnimationFrame(updatePosition);
    });
    observer.observe(triggerElement);
    return () => {
      observer.disconnect();
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [isOpen, triggerElement, updatePosition]);

  useEffect(() => {
    if (!isOpen || !isBrowser) return;
    if (typeof ResizeObserver === "undefined") return;
    const el = dropdownRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
      rafIdRef.current = requestAnimationFrame(updatePosition);
    });
    observer.observe(el);
    return () => {
      observer.disconnect();
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [isOpen, updatePosition]);

  useEffect(() => {
    if (!isOpen || !isBrowser) return;
    const vv = window.visualViewport;
    if (!vv || typeof vv.addEventListener !== "function") return;
    const handleViewportChange = () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
      rafIdRef.current = requestAnimationFrame(updatePosition);
    };
    vv.addEventListener("resize", handleViewportChange);
    vv.addEventListener("scroll", handleViewportChange);
    return () => {
      if (typeof vv.removeEventListener === "function") {
        vv.removeEventListener("resize", handleViewportChange);
        vv.removeEventListener("scroll", handleViewportChange);
      }
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [isOpen, updatePosition]);

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
      searchInputRef.current.focus();
    }
  }, [isOpen, showSearch, searchInputRef]);

  if (!isBrowser) return null;
  if (!isOpen && !keepMounted) return null;

  const dropdownStyle: CSSProperties = {
    position: "fixed",
    zIndex,
    margin: 0,
    ...(coords && isPositionStable
      ? { top: coords.top, left: coords.left, minWidth: coords.width }
      : { visibility: "hidden" as const, top: 0, left: 0 }),
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
      data-position={coords?.position ?? preferredPosition}
      data-dropdown-id={dropdownId}
    >
      {showSearch && (
        <div className={classes.searchInput || undefined}>
          <SearchIconComponent className={classes.searchIcon} />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            onKeyDown={onSearchInputKeyDown}
            onKeyDownCapture={onSearchInputKeyDownCapture}
            placeholder={searchPlaceholder}
            className={classes.searchInputElement || undefined}
            aria-label="Search options"
            aria-autocomplete="list"
          />
        </div>
      )}
      <div className={classes.optionList || undefined}>{children}</div>
    </div>,
    portalContainer ?? document.body,
  );
});

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
    required = false,
    clearable = false,
    showSearch = true,
    searchPlaceholder = "Search...",
    noResultsContent = "No options found",
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
    lockScroll = true,
    dropdownPosition = "bottom",
    dropdownZIndex = 50,
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

  const baseClasses = unstyled ? UNSTYLED_SEARCHABLEDROPDOWN_CLASSES : DEFAULT_SEARCHABLEDROPDOWN_CLASSES;

  const mergedClasses: Required<SearchableDropdownClasses> = useMemo(
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
      checkIcon: classesProp?.checkIcon ?? baseClasses.checkIcon,
      clearIcon: classesProp?.clearIcon ?? baseClasses.clearIcon,
      noResults: classesProp?.noResults ?? baseClasses.noResults,
      label: classesProp?.label ?? baseClasses.label,
      error: classesProp?.error ?? baseClasses.error,
      searchInput: classesProp?.searchInput ?? baseClasses.searchInput,
      searchInputElement: classesProp?.searchInputElement ?? baseClasses.searchInputElement,
      searchIcon: classesProp?.searchIcon ?? baseClasses.searchIcon,
      shimmer: classesProp?.shimmer ?? baseClasses.shimmer,
      shimmerItem: classesProp?.shimmerItem ?? baseClasses.shimmerItem,
    }),
    [classesProp, baseClasses],
  );

  const generatedId = useId();
  const dropdownId = id || generatedId;
  const listboxId = `${dropdownId}-listbox`;
  const triggerId = `${dropdownId}-trigger`;
  const labelId = `${dropdownId}-label`;
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
      triggerNode?.focus();
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
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef) (forwardedRef as React.MutableRefObject<HTMLButtonElement | null>).current = node;
      setTriggerNode(node);
    },
    [forwardedRef],
  );

  const renderTriggerRefCallback = useCallback(
    (node: HTMLElement | null) => {
      if (typeof forwardedRef === "function") forwardedRef(node as HTMLButtonElement);
      else if (forwardedRef) (forwardedRef as React.MutableRefObject<HTMLElement | null>).current = node;
      if (node && process.env.NODE_ENV !== "production") {
        if (node.tagName !== "BUTTON") {
          console.warn(
            "[SearchableDropdown] renderTrigger must return a <button> element for proper accessibility. " +
              `Received: <${node.tagName.toLowerCase()}>. Screen readers and keyboard navigation may not work correctly.`,
          );
        }
      }
      setTriggerNode(node);
    },
    [forwardedRef],
  );

  const triggerProps = {
    type: "button" as const,
    id: triggerId,
    role: "combobox" as const,
    "aria-expanded": isOpen,
    "aria-haspopup": "listbox" as const,
    "aria-controls": listboxId,
    "aria-activedescendant": activeDescendantId,
    "aria-invalid": (error || undefined) as boolean | undefined,
    "aria-describedby": error && errorMessage ? errorId : undefined,
    "aria-required": (required || undefined) as boolean | undefined,
    "aria-labelledby": label ? labelId : undefined,
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
      className={rootClassName}
      style={hasRootStyle ? rootStyle : undefined}
      data-disabled={disabled || undefined}
      data-error={error || undefined}
      data-open={isOpen || undefined}
      data-full-width={fullWidth || undefined}
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

      <div className={mergedClasses.wrapper || undefined}>
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
            <span className={mergedClasses.triggerText || undefined}>
              {selectedOption
                ? selectedOption.selectedContent ||
                  selectedOption.content ||
                  selectedOption.label
                : placeholder}
            </span>
            {showChevron && (
              <ChevronIcon
                className={mergedClasses.chevron || undefined}
                style={isOpen ? { transform: "rotate(180deg)" } : undefined}
              />
            )}
          </button>
        )}

        {clearable && selectedOption && (
          <button
            type="button"
            tabIndex={-1}
            aria-label="Clear selection"
            className={mergedClasses.clearIcon || undefined}
            onClick={(e) => {
              e.stopPropagation();
              handleClear(e);
              triggerNode?.focus();
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
              className={mergedClasses.shimmer}
              itemClassName={mergedClasses.shimmerItem}
            />
          ) : displayOptions.length === 0 ? (
            <div role="status" className={mergedClasses.noResults || undefined}>
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
          className={mergedClasses.error || undefined}
        >
          {errorMessage}
        </div>
      )}
    </div>
  );
});

SearchableDropdown.displayName = "SearchableDropdown";

export default SearchableDropdown;
