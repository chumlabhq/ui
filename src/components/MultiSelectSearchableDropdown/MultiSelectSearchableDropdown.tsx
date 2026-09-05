import { useRef, useEffect, useId, forwardRef, memo, useCallback, useState, useMemo } from "react";
import { useLayer } from "../../utils/layers";
import type { CSSProperties, KeyboardEvent as ReactKeyboardEvent, ReactNode } from "react";
import { isBrowser } from "../../utils/isBrowser";
import { SR_ONLY_STYLE } from "../../utils/srOnlyStyle";
import { mergeRefs } from "../../utils/mergeRefs";
import { useAnchoredPosition } from "../../utils/useAnchoredPosition";
import type { MultiSelectOption, MultiSelectSearchableDropdownProps, MultiSelectSearchableDropdownClasses } from "./utils/types";
import { useMultiSelectDropdown } from "./utils/useMultiSelectDropdown";
import { ChevronDownIcon, CheckIcon, SearchIcon, XIcon, ClearIcon as ClearIconDefault } from "./utils/icons";
import { cn } from "../../utils/scopedCn";
import { motionSafeClasses } from "../../utils/classLayers";
import { useReducedMotion } from "../../utils/useReducedMotion";
import { comboboxNameProps } from "../../utils/comboboxName";
import { useAccessibleNameWarning } from "../../utils/useAccessibleNameWarning";
import MenuSurface from "../../utils/menu/MenuSurface";
import {
  DEFAULT_MULTISELECTSEARCHABLEDROPDOWN_CLASSES,
  UNSTYLED_MULTISELECTSEARCHABLEDROPDOWN_CLASSES,
} from "./utils/constants";


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
  const coords = useAnchoredPosition(triggerElement, dropdownRef, isOpen, {
    side: preferredPosition,
    gap,
    forceSide: forcePosition,
  });

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
      id={listboxId}
      role="listbox"
      aria-label={listboxAriaLabel}
      aria-multiselectable="true"
      aria-busy={loading || undefined}
      className={classes.content || undefined}
      data-state={isOpen ? "open" : "closed"}
      data-position={coords?.side ?? preferredPosition}
      data-dropdown-id={dropdownId}
    >
      {children}
    </MenuSurface>
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
      classes.item,
    ) || undefined;

  const combinedCheckboxClassName =
    cn(
      classes.itemControl,
    ) || undefined;
  // ADR 002 R4: the state the checkboxChecked key named.
  const checkboxState = isSelected ? "checked" : "unchecked";

  return (
    <div
      id={`${dropdownId}-option-${index}`}
      role="option"
      aria-selected={isSelected}
      aria-disabled={option.disabled}
      className={combinedOptionClassName}
      data-selected={isSelected || undefined}
      data-highlighted={isFocused || undefined}
      data-disabled={option.disabled || undefined}
      onClick={() => onToggle(option)}
      onMouseEnter={() => onHover(index)}
    >
      <span className={combinedCheckboxClassName} data-checked={isSelected || undefined} data-state={checkboxState}>
        {isSelected && (checkboxIcon || <CheckIcon className={classes.itemIndicator || undefined} />)}
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
      dropdownZIndex: dropdownZIndexProp,
      dropdownGap = 4,
      typeaheadTimeout = 500,
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
    // ADR: floating content resolves its layer from the nearest overlay, so a
    // dropdown inside a drawer stacks above it. An explicit prop still wins.
    const dropdownZIndex = useLayer(dropdownZIndexProp);

    const prefersReducedMotion = useReducedMotion();
    const baseClassesRaw = unstyled
      ? UNSTYLED_MULTISELECTSEARCHABLEDROPDOWN_CLASSES
      : DEFAULT_MULTISELECTSEARCHABLEDROPDOWN_CLASSES;
    // Motion is decorative under ADR 001, so `unstyled` has already removed it;
    // this handles the other reason to stop animating. Applied to the defaults
    // only — a class string the consumer supplied is theirs to control.
    const baseClasses = motionSafeClasses(baseClassesRaw, prefersReducedMotion);

    const mergedClasses: Required<MultiSelectSearchableDropdownClasses> = useMemo(
      () => ({
        root: classesProp?.root ?? baseClasses.root,
        control: classesProp?.control ?? baseClasses.control,
        trigger: classesProp?.trigger ?? baseClasses.trigger,
        value: classesProp?.value ?? baseClasses.value,
        content: classesProp?.content ?? baseClasses.content,
        list: classesProp?.list ?? baseClasses.list,
        item: classesProp?.item ?? baseClasses.item,
        icon: classesProp?.icon ?? baseClasses.icon,
        itemControl: classesProp?.itemControl ?? baseClasses.itemControl,
        itemIndicator: classesProp?.itemIndicator ?? baseClasses.itemIndicator,
        chip: classesProp?.chip ?? baseClasses.chip,
        chipRemove: classesProp?.chipRemove ?? baseClasses.chipRemove,
        empty: classesProp?.empty ?? baseClasses.empty,
        clearTrigger: classesProp?.clearTrigger ?? baseClasses.clearTrigger,
        loading: classesProp?.loading ?? baseClasses.loading,
        loadingItem: classesProp?.loadingItem ?? baseClasses.loadingItem,
        label: classesProp?.label ?? baseClasses.label,
        message: classesProp?.message ?? baseClasses.message,
        description: classesProp?.description ?? baseClasses.description,
        searchControl: classesProp?.searchControl ?? baseClasses.searchControl,
        searchInput: classesProp?.searchInput ?? baseClasses.searchInput,
        searchIcon: classesProp?.searchIcon ?? baseClasses.searchIcon,
        count: classesProp?.count ?? baseClasses.count,
      }),
      [classesProp, baseClasses],
    );

    const generatedId = useId();
    const dropdownId = id || name || generatedId;
    const listboxId = `${dropdownId}-listbox`;
    const triggerId = `${dropdownId}-trigger`;
    const labelId = `${dropdownId}-label`;
    const valueId = `${dropdownId}-value`;

  // The value fallback in `comboboxNameProps` gives the trigger a name, but a
  // control named only by its own value says nothing about what it selects.
  useAccessibleNameWarning("MultiSelectSearchableDropdown", { label, "aria-label": ariaLabel });
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
      typeaheadTimeout,
      open,
      defaultOpen,
      onOpenChange,
      label,
      "aria-label": ariaLabel,
    });

    const chipsShown = showSelectedChips && selectedOptions.length > 0;

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

    // Focus the search input when the surface opens.
    //
    // Was a `setTimeout(…, 10)` — a guess at how long the portal takes to
    // paint, which loses the focus entirely on a frame slower than that. The
    // effect runs after the portal has committed, so the input exists by the
    // time this reads the ref. SearchableDropdown has always done it this way.
    useEffect(() => {
      if (isOpen && showSearch && searchInputRef.current) {
        searchInputRef.current.focus({ preventScroll: true });
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

        <div
          className={mergedClasses.control || undefined}
        >
          {renderTrigger ? (
            renderTrigger({
              ref: renderTriggerRefCallback,
              id: triggerId,
              role: "combobox",
              "aria-expanded": isOpen,
              "aria-haspopup": "listbox",
              "aria-controls": listboxId,
              "aria-activedescendant": showSearch ? undefined : activeDescendantId,
              "aria-invalid": (error || undefined) as boolean | undefined,
              "aria-describedby": error && errorMessage ? errorId : undefined,
              "aria-required": (required || undefined) as boolean | undefined,
              ...comboboxNameProps({ valueId, labelId, hasLabel: !!label, ariaLabel }),
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
              aria-activedescendant={showSearch ? undefined : activeDescendantId}
              {...comboboxNameProps({ valueId, labelId, hasLabel: !!label, ariaLabel })}
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
              {/* Each chip carries its own "Remove X" button, and a name computed
                  from the value element swept those up — the trigger announced
                  "Apple Remove Apple Banana Remove Banana". Only the chip branch has
                  that problem, so only it needs a separate name source; pointing at
                  the visible element everywhere else keeps the text in the DOM once. */}
              {chipsShown && (
                <span id={valueId} style={SR_ONLY_STYLE}>
                  {selectedOptions.map((option) => option.label).join(", ")}
                </span>
              )}
              <span
                id={chipsShown ? undefined : valueId}
                className={mergedClasses.value || undefined}
              >
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
                      <span className={mergedClasses.count || undefined}>
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
                  className={mergedClasses.icon || undefined}
                  style={isOpen ? { transform: "rotate(180deg)" } : undefined}
                />
              )}
            </button>
          )}

          {clearable && selectedValues.length > 0 && (
            <button
              type="button"
              // SC 2.1.1: this was tabIndex={-1}, so clearing could only be done
              // with a pointer — and for a single select there is no other way
              // back to an empty value.
              aria-label="Clear all selections"
              className={mergedClasses.clearTrigger || undefined}
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
              <div className={mergedClasses.searchControl || undefined}>
                <SearchIcon className={mergedClasses.searchIcon || undefined} />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder={searchPlaceholder}
                  aria-label={searchInputAriaLabel}
                  aria-controls={listboxId}
                  // The active-descendant relationship follows the focus:
                  // opening the menu moves focus here, so the trigger's
                  // `aria-activedescendant` described the highlight to an
                  // element nobody was on. `aria-autocomplete` was missing too.
                  // The `combobox` role stays on the trigger — see
                  // SearchableDropdown for why.
                  aria-autocomplete="list"
                  aria-activedescendant={activeDescendantId}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onClick={(e) => e.stopPropagation()}
                  className={cn(mergedClasses.searchInput) || undefined}
                />
              </div>
            )}

            <div className={mergedClasses.list || undefined}>
              {loading ? (
                <>
                  <div role="status" className={mergedClasses.loading || undefined}>
                    {loadingText}
                  </div>
                  <div className={mergedClasses.loading || undefined}>
                    {Array.from({ length: shimmerCount }).map((_, i) => (
                      <div key={i} className={mergedClasses.loadingItem || undefined} />
                    ))}
                  </div>
                </>
              ) : displayOptions.length === 0 ? (
                <div role="status" className={mergedClasses.empty || undefined}>
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
  }
);

MultiSelectSearchableDropdown.displayName = "MultiSelectSearchableDropdown";

export default MultiSelectSearchableDropdown;
