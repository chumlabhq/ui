import { useRef, useEffect, useId, forwardRef, useCallback, useState, useMemo, memo } from "react";
import { useLayer } from "../../utils/layers.js";
import type { CSSProperties, ReactNode } from "react";
import type { MultiSelectDropdownProps, MultiSelectDropdownClasses } from "./utils/types.js";
import { useMultiSelectDropdown } from "./utils/useMultiSelectDropdown.js";
import { scrollOptionIntoView, isBrowser } from "./utils/helpers.js";
import { useAnchoredPosition } from "../../utils/useAnchoredPosition.js";
import { ChevronDownIcon, ClearIcon as ClearIconDefault } from "./utils/icons.js";
import MultiSelectDropdownShimmer from "./components/MultiSelectDropdownShimmer.js";
import { MultiSelectDropdownOption } from "./components/MultiSelectDropdownOption.js";
import { SelectedChip } from "./components/SelectedChip.js";
import { cn } from "../../utils/scopedCn.js";
import { mergeSlot } from "../../utils/mergeSlot.js";
import {
  DEFAULT_MULTISELECTDROPDOWN_CLASSES,
  UNSTYLED_MULTISELECTDROPDOWN_CLASSES,
} from "./utils/constants.js";
import { SR_ONLY_STYLE } from "../../utils/srOnlyStyle.js";
import { mergeRefs, setRef } from "../../utils/mergeRefs.js";

import { motionSafeClasses } from "../../utils/classLayers.js";
import { useReducedMotion } from "../../utils/useReducedMotion.js";
import { comboboxNameProps } from "../../utils/comboboxName.js";
import { useAccessibleNameWarning } from "../../utils/useAccessibleNameWarning.js";
import MenuSurface from "../../utils/menu/MenuSurface.js";
import { focusTriggerOnMouseDown } from "../../utils/menu/focusTriggerOnMouseDown.js";
const MAX_STATUS_LABELS = 5;

interface MultiSelectDropdownContentProps {
  triggerElement: HTMLElement | null;
  isOpen: boolean;
  keepMounted: boolean;
  position: "top" | "bottom";
  forcePosition: boolean;
  zIndex: number;
  gap: number;
  portalContainer?: HTMLElement | null;
  classes: Required<MultiSelectDropdownClasses>;
  listboxId: string;
  dropdownId: string;
  listboxAriaLabel: string;
  loading: boolean;
  contentRef?: React.RefObject<HTMLDivElement | null>;
  /** The loading or empty message, beside the listbox rather than inside it. */
  status?: ReactNode;
  children: ReactNode;
}

const MultiSelectDropdownContent = memo(function MultiSelectDropdownContent({
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
  status,
  children,
}: MultiSelectDropdownContentProps) {
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
      className={classes.content || undefined}
      data-state={isOpen ? "open" : "closed"}
      data-position={coords?.side ?? preferredPosition}
      data-dropdown-id={dropdownId}
    >
      {status}
      <div
        id={listboxId}
        role="listbox"
        aria-label={listboxAriaLabel}
        aria-multiselectable="true"
        aria-busy={loading || undefined}
        className={classes.list || undefined}
      >
        {children}
      </div>
    </MenuSurface>
  );
});

/**
 * Component: MultiSelectDropdown
 *
 * Purpose:
 * Multi-select dropdown with chip display, checkbox options, async loading,
 * and portal-based positioning.
 *
 * AI Usage Guidelines:
 * - Use for selecting multiple values from a list
 * - Minimum: `<MultiSelectDropdown options={[...]} onValueChange={handler} />`
 * - Pair `value` with `onValueChange` for controlled mode
 * - Use `loadOnOpen` + `loadOptions` for async data
 *
 * Behavior:
 * - Portal-rendered popup (never clipped by overflow ancestors)
 * - Auto-flips position when insufficient viewport space (disable with `forceDropdownSide`)
 * - Full keyboard navigation with arrow keys, Enter/Space to toggle
 * - Chips display with optional count-only mode
 *
 * Reference:
 * - MULTISELECTDROPDOWN.ai.md (this directory) — full AI knowledge doc
 * - src/pages/demo/MultiSelectDropdownDemo.tsx — live demo
 */
const MultiSelectDropdown = forwardRef<
  HTMLButtonElement,
  MultiSelectDropdownProps
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
      emptyContent = "No options found",
      clearable = false,
      showChevron = true,
      fullWidth = false,
      loading: externalLoading = false,
      loadOptions,
      loadOnOpen = false,
      onLoadError,
      shimmerCount = 5,
      loadingContent = "Loading...",
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
      onBlur,
      onFocus,
      onKeyDown: onKeyDownProp,
      chevronIcon,
      clearIcon,
      renderTrigger,
      keepMounted = false,
      portalContainer,
      dropdownSide = "bottom",
      forceDropdownSide = false,
      dropdownZIndex: dropdownZIndexProp,
      dropdownOffset = 4,
      typeaheadTimeout = 500,
    },
    ref,
  ) => {
    const dropdownZIndex = useLayer(dropdownZIndexProp);

    const prefersReducedMotion = useReducedMotion();
    const baseClassesRaw = unstyled ? UNSTYLED_MULTISELECTDROPDOWN_CLASSES : DEFAULT_MULTISELECTDROPDOWN_CLASSES;
    const baseClasses = motionSafeClasses(baseClassesRaw, prefersReducedMotion);

    const mergedClasses: Required<MultiSelectDropdownClasses> = useMemo(
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
        label: mergeSlot(baseClasses.label, classesProp?.label),
        message: mergeSlot(baseClasses.message, classesProp?.message),
        description: mergeSlot(baseClasses.description, classesProp?.description),
        loading: mergeSlot(baseClasses.loading, classesProp?.loading),
        loadingItem: mergeSlot(baseClasses.loadingItem, classesProp?.loadingItem),
        loadingItemControl: mergeSlot(baseClasses.loadingItemControl, classesProp?.loadingItemControl),
        loadingBar: mergeSlot(baseClasses.loadingBar, classesProp?.loadingBar),
        count: mergeSlot(baseClasses.count, classesProp?.count),
      }),
      [classesProp, baseClasses],
    );

    const generatedId = useId();
    const dropdownId = id || generatedId;
    const listboxId = `${dropdownId}-listbox`;
    const triggerId = `${dropdownId}-trigger`;
    const labelId = `${dropdownId}-label`;
    const valueId = `${dropdownId}-value`;

  useAccessibleNameWarning("MultiSelectDropdown", { label, "aria-label": ariaLabel });
    const errorId = `${dropdownId}-error`;

    const triggerRef = useRef<HTMLButtonElement>(null);
    const [triggerNode, setTriggerNode] = useState<HTMLElement | null>(null);
    const prevIsOpenRef = useRef(false);

    const {
      isOpen,
      currentValue,
      focusedIndex,
      isLoadingOptions,
      displayOptions,
      selectedOptions,
      shouldRestoreFocusRef,
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
      onValueChange,
      loadOptions,
      loadOnOpen,
      onLoadError,
      typeaheadTimeout,
      open,
      defaultOpen,
      onOpenChange,
      label,
      "aria-label": ariaLabel,
    });

    const chipsShown = showSelectedChips && selectedOptions.length > 0;

    const activeDescendantId =
      isOpen && focusedIndex >= 0
        ? `${dropdownId}-option-${focusedIndex}`
        : undefined;

    const loading = externalLoading || isLoadingOptions;

    const statusMessage = loading
      ? loadingContent
      : isOpen
        ? `${displayOptions.length} option${displayOptions.length === 1 ? "" : "s"} available`
        : selectedOptions.length > 0
          ? selectedOptions.length > MAX_STATUS_LABELS
            ? `Selected: ${selectedOptions.length} options`
            : `Selected: ${selectedOptions.map((o) => o.label).join(", ")}`
          : "";

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
      if (optionEl) scrollOptionIntoView(optionEl);
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
      const handleClickOutside = (event: MouseEvent | TouchEvent) => {
        const target = event.target as Node;
        if (triggerNode?.contains(target)) return;
        const portalEl = (target as HTMLElement).closest?.(`[data-dropdown-id="${dropdownId}"]`);
        if (portalEl) return;
        handleClose();
      };

      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside);
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("touchstart", handleClickOutside);
      };
    }, [isOpen, handleClose, triggerNode, dropdownId]);

    useEffect(() => {
      if (!isOpen || !isBrowser) return;
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
      (event: React.KeyboardEvent) => {
        onKeyDownProp?.(event);
        if (!event.defaultPrevented) {
          handleKeyDown(event);
        }
      },
      [onKeyDownProp, handleKeyDown],
    );

    const rootClassName =
      cn(
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
      "aria-controls": listboxId,
      "aria-activedescendant": activeDescendantId,
      ...comboboxNameProps({ valueId, labelId, hasLabel: !!label, ariaLabel, hasValueElement: !renderTrigger }),
      "aria-invalid": (error || undefined) as boolean | undefined,
      "aria-describedby": error && errorMessage ? errorId : undefined,
      "aria-required": (required || undefined) as boolean | undefined,
      disabled,
      onClick: handleToggle,
      onMouseDown: focusTriggerOnMouseDown,
      onKeyDown: handleKeyDownWithPassthrough,
      onFocus,
      onBlur,
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
          <div className={mergedClasses.description || undefined}>{description}</div>
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

          {clearable && currentValue.length > 0 && (
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

          <MultiSelectDropdownContent
            triggerElement={triggerNode}
            isOpen={isOpen}
            keepMounted={keepMounted}
            position={dropdownSide}
            forcePosition={forceDropdownSide}
            zIndex={dropdownZIndex}
            gap={dropdownOffset}
            portalContainer={portalContainer}
            classes={mergedClasses}
            listboxId={listboxId}
            dropdownId={dropdownId}
            listboxAriaLabel={listboxAriaLabel}
            loading={loading}
            contentRef={dropdownContentRef}
            status={
              loading ? (
                <MultiSelectDropdownShimmer
                  count={shimmerCount}
                  className={mergedClasses.loading || undefined}
                  itemClassName={mergedClasses.loadingItem || undefined}
                  itemControlClassName={mergedClasses.loadingItemControl || undefined}
                  barClassName={mergedClasses.loadingBar || undefined}
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
                  <MultiSelectDropdownOption
                    key={option.value}
                    option={option}
                    isSelected={currentValue.includes(option.value)}
                    isFocused={index === focusedIndex}
                    dropdownId={dropdownId}
                    index={index}
                    classes={mergedClasses}
                    checkboxIcon={checkboxIcon}
                    onToggle={handleOptionToggle}
                    onHover={setFocusedIndex}
                  />
                ))}
          </MultiSelectDropdownContent>
        </div>

        {name && (
          <input
            type="hidden"
            name={name}
            value={selectedOptions.map((o) => o.value).join(",")}
            aria-hidden="true"
          />
        )}

        <div
          id={`${dropdownId}-status`}
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
  },
);

MultiSelectDropdown.displayName = "MultiSelectDropdown";

export default MultiSelectDropdown;
