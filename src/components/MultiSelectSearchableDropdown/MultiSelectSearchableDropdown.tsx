import { useRef, useEffect, useId, forwardRef, memo, useCallback, useState, useMemo } from "react";
import { useLayer } from "../../utils/layers.js";
import type { CSSProperties, KeyboardEvent as ReactKeyboardEvent, ReactNode } from "react";
import { isBrowser } from "../../utils/isBrowser.js";
import { SR_ONLY_STYLE } from "../../utils/srOnlyStyle.js";
import { FormValue } from "../../utils/FormValue.js";
import { mergeRefs, setRef } from "../../utils/mergeRefs.js";
import { useAnchoredPosition } from "../../utils/useAnchoredPosition.js";
import type { MultiSelectOption, MultiSelectSearchableDropdownProps, MultiSelectSearchableDropdownClasses } from "./utils/types.js";
import { useMultiSelectDropdown } from "./utils/useMultiSelectDropdown.js";
import { ChevronDownIcon, CheckIcon, SearchIcon, XIcon, ClearIcon as ClearIconDefault } from "./utils/icons.js";
import { cn } from "../../utils/scopedCn.js";
import { mergeSlot } from "../../utils/mergeSlot.js";
import { motionSafeClasses } from "../../utils/classLayers.js";
import { useReducedMotion } from "../../utils/useReducedMotion.js";
import { comboboxNameProps } from "../../utils/comboboxName.js";
import { useAccessibleNameWarning } from "../../utils/useAccessibleNameWarning.js";
import MenuSurface from "../../utils/menu/MenuSurface.js";
import {
  DEFAULT_MULTISELECTSEARCHABLEDROPDOWN_CLASSES,
  UNSTYLED_MULTISELECTSEARCHABLEDROPDOWN_CLASSES,
} from "./utils/constants.js";

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
  dropdownId: string;
  listboxAriaLabel: string;
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
  dropdownId,
  listboxAriaLabel,
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
      // Announced even though it is no longer the listbox — the search field
      // inside it is portalled content with no other context
      // (portal-semantics.contract).
      role="group"
      aria-label={listboxAriaLabel}
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
        className={classes.chipRemoveTrigger || undefined}
        aria-label={`Remove ${option.label}`}
      >
        <XIcon className="w-3 h-3" />
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
 * - Use `searchOptions` for async search, `loadInitialOptions` for prefetch
 * - Pair `value` with `onValueChange` for controlled mode
 *
 * Behavior:
 * - Built-in search input with local filtering or async search
 * - Portal-rendered popup (never clipped by overflow ancestors)
 * - Auto-flips position (disable with `forceDropdownSide`)
 * - Full keyboard navigation
 *
 * Reference:
 * - MULTISELECTSEARCHABLEDROPDOWN.ai.md (this directory) — full AI knowledge doc
 * - src/pages/demo/MultiSelectSearchableDropdownDemo.tsx — live demo
 */
const MultiSelectSearchableDropdown = forwardRef<
  HTMLButtonElement,
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
      emptyContent = "No options found",
      loadingContent = "Loading...",
      shimmerCount = 5,
      clearable = false,
      showChevron = true,
      fullWidth = false,
      loading: externalLoading = false,
      searchOptions,
      searchDebounce = 300,
      initialOptions = [],
      loadInitialOptions,
      loadInitialOnOpen = false,
      onLoadError,
      maxVisible = 3,
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
      "aria-labelledby": ariaLabelledBy,
      "aria-describedby": ariaDescribedBy,
      portalContainer,
      dropdownSide = "bottom",
      forceDropdownSide = false,
      dropdownZIndex: dropdownZIndexProp,
      dropdownOffset = 4,
      typeaheadTimeout = 500,
      keepMounted = false,
      onBlur: onBlurProp,
      onFocus: onFocusProp,
      onKeyDown: onKeyDownProp,
      clearIcon,
      renderTrigger,
      searchInputAriaLabel = "Search options",
    },
    ref
  ) => {
    const dropdownZIndex = useLayer(dropdownZIndexProp);

    const prefersReducedMotion = useReducedMotion();
    const baseClassesRaw = unstyled
      ? UNSTYLED_MULTISELECTSEARCHABLEDROPDOWN_CLASSES
      : DEFAULT_MULTISELECTSEARCHABLEDROPDOWN_CLASSES;
    const baseClasses = motionSafeClasses(baseClassesRaw, prefersReducedMotion);

    const mergedClasses: Required<MultiSelectSearchableDropdownClasses> = useMemo(
      () => ({
        root: mergeSlot(baseClasses.root, classesProp?.root),
        control: mergeSlot(baseClasses.control, classesProp?.control),
        trigger: mergeSlot(baseClasses.trigger, classesProp?.trigger),
        value: mergeSlot(baseClasses.value, classesProp?.value),
        content: mergeSlot(baseClasses.content, classesProp?.content),
        list: mergeSlot(baseClasses.list, classesProp?.list),
        item: mergeSlot(baseClasses.item, classesProp?.item),
        icon: mergeSlot(baseClasses.icon, classesProp?.icon),
        itemControl: mergeSlot(baseClasses.itemControl, classesProp?.itemControl),
        itemIndicator: mergeSlot(baseClasses.itemIndicator, classesProp?.itemIndicator),
        chip: mergeSlot(baseClasses.chip, classesProp?.chip),
        chipRemoveTrigger: mergeSlot(baseClasses.chipRemoveTrigger, classesProp?.chipRemoveTrigger),
        empty: mergeSlot(baseClasses.empty, classesProp?.empty),
        clearTrigger: mergeSlot(baseClasses.clearTrigger, classesProp?.clearTrigger),
        loading: mergeSlot(baseClasses.loading, classesProp?.loading),
        loadingItem: mergeSlot(baseClasses.loadingItem, classesProp?.loadingItem),
        label: mergeSlot(baseClasses.label, classesProp?.label),
        message: mergeSlot(baseClasses.message, classesProp?.message),
        description: mergeSlot(baseClasses.description, classesProp?.description),
        searchControl: mergeSlot(baseClasses.searchControl, classesProp?.searchControl),
        searchInput: mergeSlot(baseClasses.searchInput, classesProp?.searchInput),
        searchIcon: mergeSlot(baseClasses.searchIcon, classesProp?.searchIcon),
        count: mergeSlot(baseClasses.count, classesProp?.count),
      }),
      [classesProp, baseClasses],
    );

    const generatedId = useId();
    const dropdownId = id || name || generatedId;
    const listboxId = `${dropdownId}-listbox`;
    const triggerId = id ?? `${dropdownId}-trigger`;
    const labelId = `${dropdownId}-label`;
    const valueId = `${dropdownId}-value`;

  useAccessibleNameWarning("MultiSelectSearchableDropdown", { label, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy });
    const errorId = `${dropdownId}-error`;
    const descriptionId = `${dropdownId}-description`;

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
      resetValue,
    } = useMultiSelectDropdown({
      options,
      value,
      defaultValue,
      disabled,
      showSearch,
      searchOptions,
      searchDebounce,
      onValueChange,
      initialOptions,
      loadInitialOptions,
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

    // No timer: the effect runs after the portal has committed, so the input
    // exists by the time this reads the ref. A delay guessed in milliseconds
    // loses the focus on any frame slower than the guess.
    useEffect(() => {
      if (isOpen && showSearch && searchInputRef.current) {
        searchInputRef.current.focus({ preventScroll: true });
      }
    }, [isOpen, showSearch]);

    useEffect(() => {
      if (!isOpen && prevIsOpenRef.current) {
        if (shouldRestoreFocusRef.current) {
          triggerRef.current?.focus({ preventScroll: true });
          shouldRestoreFocusRef.current = false;
        }
      }
      prevIsOpenRef.current = isOpen;
    }, [isOpen, shouldRestoreFocusRef]);

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
        mergeRefs(triggerRef, ref, (node: HTMLButtonElement | null) => {
          setTriggerNode(node);
        }),
      [setTriggerNode, ref],
    );

    const handleClear = useCallback(() => {
      if (onValueChange) {
        onValueChange([], []);
      }
    }, [onValueChange]);

    const renderTriggerRefCallback = useCallback(
      (node: HTMLElement | null) => {
        setTriggerNode(node);
        setRef(ref, node as HTMLButtonElement | null);
      },
      [setTriggerNode, ref],
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

    const displayedChips = selectedOptions.slice(0, maxVisible);
    const remainingCount = selectedOptions.length - maxVisible;

    // One object for both triggers. The custom one was handed its own copy of
    // this list in three components, and the copies drifted: `type="button"`
    // and CascadingDropdown's `aria-controls` reached the default trigger only.
    const triggerProps = {
      type: "button" as const,
      id: triggerId,
      role: "combobox" as const,
      "aria-expanded": isOpen,
      "aria-haspopup": "listbox" as const,
      "aria-controls": isOpen ? listboxId : undefined,
      "aria-activedescendant": showSearch ? undefined : activeDescendantId,
      ...comboboxNameProps({ valueId, labelId, hasLabel: !!label, ariaLabel, ariaLabelledBy, hasValueElement: !renderTrigger }),
      "aria-invalid": (error || undefined) as boolean | undefined,
      "aria-describedby": [ariaDescribedBy, description && descriptionId, error && errorMessage ? errorId : undefined].filter(Boolean).join(" ") || undefined,
      "aria-required": (required || undefined) as boolean | undefined,
      disabled,
      onClick: handleToggle,
      onKeyDown: handleKeyDownWithPassthrough,
      onFocus: onFocusProp,
      onBlur: onBlurProp,
      "data-disabled": (disabled || undefined) as true | undefined,
      "data-error": (error || undefined) as true | undefined,
      "data-valid": ((!error && success) || undefined) as true | undefined,
      "data-open": (isOpen || undefined) as true | undefined,
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

        <div
          className={mergedClasses.control || undefined}
        >
          {renderTrigger ? (
            renderTrigger(
              { ...triggerProps, ref: renderTriggerRefCallback },
              { isOpen, selectedOptions, placeholder },
            )
          ) : (
            <button
              ref={mergedTriggerRef}
              {...triggerProps}
              className={mergedClasses.trigger || undefined}
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
              aria-label="Clear all selections"
              className={mergedClasses.clearTrigger || undefined}
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
                triggerNode?.focus({ preventScroll: true });
              }}
            >
              {clearIcon ?? <ClearIconDefault className="w-4 h-4" />}
            </button>
          )}

          <DropdownContent
            triggerElement={triggerNode}
            isOpen={isOpen}
            keepMounted={keepMounted}
            position={dropdownSide}
            forcePosition={forceDropdownSide}
            zIndex={dropdownZIndex}
            gap={dropdownOffset}
            portalContainer={portalContainer}
            classes={mergedClasses}
            dropdownId={dropdownId}
            listboxAriaLabel={listboxAriaLabel}
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

            {/* Outside the listbox: it owns options and groups, and the search
                field and status message are neither. */}
            {loading ? (
              <>
                <div role="status" className={mergedClasses.loading || undefined}>
                  {loadingContent}
                </div>
                <div className={mergedClasses.loading || undefined}>
                  {Array.from({ length: shimmerCount }).map((_, i) => (
                    <div key={i} className={mergedClasses.loadingItem || undefined} />
                  ))}
                </div>
              </>
            ) : displayOptions.length === 0 ? (
              <div role="status" className={mergedClasses.empty || undefined}>
                {emptyContent}
              </div>
            ) : null}

            <div
              id={listboxId}
              role="listbox"
              aria-label={listboxAriaLabel}
              aria-multiselectable="true"
              aria-busy={loading || undefined}
              className={mergedClasses.list || undefined}
            >
              {loading || displayOptions.length === 0
                ? null
                : displayOptions.map((option, index) => (
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
                  ))}
            </div>
          </DropdownContent>
        </div>

        {name && (
          <FormValue
            entries={[[name, selectedOptions.map((o) => o.value).join(",")]]}
            required={required && !disabled}
            onReset={resetValue}
            focusTarget={triggerRef}
          />
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
