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
  DropdownOption,
  DropdownProps,
  DropdownClasses,
} from "./utils/types.js";
import { useDropdown } from "./utils/useDropdown.js";
import {
  ChevronDownIcon,
  CheckIcon as CheckIconDefault,
  ClearIcon as ClearIconDefault,
} from "./utils/icons.js";
import {
  scrollOptionIntoView,
  isBrowser,
} from "./utils/helpers.js";
import DropdownShimmer from "./components/DropdownShimmer.js";
import { cn } from "../../utils/scopedCn.js";
import { mergeSlot } from "../../utils/mergeSlot.js";
import {
  DEFAULT_DROPDOWN_CLASSES,
  UNSTYLED_DROPDOWN_CLASSES,
} from "./utils/constants.js";
import { SR_ONLY_STYLE } from "../../utils/srOnlyStyle.js";
import { mergeRefs } from "../../utils/mergeRefs.js";
import { useAnchoredPosition } from "../../utils/useAnchoredPosition.js";

import { motionSafeClasses } from "../../utils/classLayers.js";
import { useReducedMotion } from "../../utils/useReducedMotion.js";
import { comboboxNameProps } from "../../utils/comboboxName.js";
import { useAccessibleNameWarning } from "../../utils/useAccessibleNameWarning.js";
import MenuSurface from "../../utils/menu/MenuSurface.js";
import { focusTriggerOnMouseDown } from "../../utils/menu/focusTriggerOnMouseDown.js";
const DropdownOptionItem = memo(function DropdownOptionItem({
  option,
  isSelected,
  isFocused,
  dropdownId,
  index,
  classes,
  showSelectedIcon,
  selectedIcon,
  CheckIconComponent,
  onSelect,
  onHover,
}: {
  option: DropdownOption;
  isSelected: boolean;
  isFocused: boolean;
  dropdownId: string;
  index: number;
  classes: Required<DropdownClasses>;
  showSelectedIcon: boolean;
  selectedIcon?: ReactNode;
  CheckIconComponent: React.ComponentType<{
    className?: string;
    style?: CSSProperties;
  }>;
  onSelect: (option: DropdownOption) => void;
  onHover: (index: number) => void;
}) {
  const isDisabled = !!option.disabled;

  return (
    <div
      id={`${dropdownId}-option-${index}`}
      role="option"
      aria-selected={isSelected}
      aria-disabled={isDisabled || undefined}
      aria-label={option.label}
      className={
        cn(
          classes.item,
        ) || undefined
      }
      data-selected={isSelected || undefined}
      data-highlighted={isFocused || undefined}
      data-disabled={isDisabled || undefined}
      data-value={option.value}
      onClick={() => {
        if (!isDisabled) onSelect(option);
      }}
      onKeyDown={(e) => {
        if (!isDisabled && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onSelect(option);
        }
      }}
      onMouseEnter={() => { if (!isDisabled) onHover(index); }}
    >
      <span>{option.content || option.label}</span>
      {isSelected &&
        showSelectedIcon &&
        (selectedIcon || (
          <CheckIconComponent className={cn(classes.itemIndicator) || undefined} />
        ))}
    </div>
  );
});

interface DropdownContentProps {
  triggerElement: HTMLElement | null;
  isOpen: boolean;
  keepMounted: boolean;
  position: "top" | "bottom";
  forcePosition: boolean;
  zIndex: number;
  gap: number;
  portalContainer?: HTMLElement | null;
  classes: Required<DropdownClasses>;
  listboxId: string;
  dropdownId: string;
  focusedIndex: number;
  loading: boolean;
  ariaLabel: string;
  contentRef?: React.RefObject<HTMLDivElement | null>;
  /**
   * The loading or empty message, rendered beside the listbox rather than
   * inside it. A `listbox` owns options and nothing else — axe reported
   * "children which are not allowed: [role=status]" on four fixtures, and a
   * screen reader reading the list would have had to read past it.
   */
  status?: ReactNode;
  children: ReactNode;
}

const DropdownContent = memo(function DropdownContent({
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
  focusedIndex,
  loading,
  ariaLabel,
  contentRef,
  status,
  children,
}: DropdownContentProps) {
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
      {/* The listbox is the option list, not the panel around it. The panel
          holds the status message too, and a listbox may own nothing but
          options and groups. */}
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
 * Component: Dropdown
 *
 * Purpose:
 * A single-select dropdown (combobox) with portal rendering, keyboard navigation,
 * async loading, and full style customization via a classes object.
 *
 * AI Usage Guidelines:
 * - Use for selecting one value from a list of options
 * - Minimum required: `options` array with `{ value, label }` objects
 * - Pair `value` with `onValueChange` for controlled mode, or use `defaultValue`
 * - Avoid combining `value` and `defaultValue`
 *
 * Behavior:
 * - Portal-rendered popup (never clipped by overflow ancestors)
 * - Auto-flips position when insufficient viewport space (disable with `forceDropdownPosition`)
 * - Full keyboard navigation with type-ahead search
 * - Async option loading with shimmer states
 *
 * Reference:
 * - DROPDOWN.ai.md (this directory) — full AI knowledge doc
 * - src/pages/demo/DropdownDemo.tsx — live demo
 */
const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(
  (props, forwardedRef) => {
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
      noResultsContent = "No options available",
      showChevron = true,
      showSelectedIcon = true,
      selectedIcon,
      fullWidth = false,
      loading: externalLoading = false,
      onLoadOptions,
      loadOnOpen = false,
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
      CheckIcon: CheckIconProp = CheckIconDefault,
      ClearIcon: ClearIconProp = ClearIconDefault,
    } = props;

    const dropdownZIndex = useLayer(dropdownZIndexProp);

    const prefersReducedMotion = useReducedMotion();

    const baseClassesRaw = unstyled
      ? UNSTYLED_DROPDOWN_CLASSES
      : DEFAULT_DROPDOWN_CLASSES;

    const baseClasses = motionSafeClasses(baseClassesRaw, prefersReducedMotion);

    const mergedClasses: Required<DropdownClasses> = useMemo(
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
        loading: mergeSlot(baseClasses.loading, classesProp?.loading),
        loadingItem: mergeSlot(baseClasses.loadingItem, classesProp?.loadingItem),
      }),
      [classesProp, baseClasses],
    );

    const generatedId = useId();
    const dropdownId = id || generatedId;
    const listboxId = `${dropdownId}-listbox`;
    const triggerId = `${dropdownId}-trigger`;
    const labelId = `${dropdownId}-label`;
    const valueId = `${dropdownId}-value`;

  useAccessibleNameWarning("Dropdown", { label, "aria-label": ariaLabel });
    const errorId = `${dropdownId}-error`;
    const statusId = `${dropdownId}-status`;

    const [triggerNode, setTriggerNode] = useState<HTMLElement | null>(null);

    const {
      isOpen,
      focusedIndex,
      isLoadingOptions,
      displayOptions,
      selectedOption,
      currentValue,
      activeDescendantId,
      shouldRestoreFocusRef,
      statusMessage,
      setFocusedIndex,
      handleToggle,
      handleClose,
      handleOptionSelect,
      handleClear,
      handleKeyDown,
    } = useDropdown({
      options,
      value,
      defaultValue,
      disabled,
      open,
      defaultOpen,
      clearable,
      onValueChange,
      onOpenChange,
      onLoadOptions,
      loadOnOpen,
      onLoadError,
      dropdownId,
      typeaheadTimeout,
      label,
      "aria-label": ariaLabel,
      loadingText,
    });

    const loading = externalLoading || isLoadingOptions;

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

      window.addEventListener("wheel", preventScroll, {
        capture: true,
        passive: false,
      });
      window.addEventListener("touchmove", preventScroll, {
        capture: true,
        passive: false,
      });

      return () => {
        window.removeEventListener("wheel", preventScroll, {
          capture: true,
        } as EventListenerOptions);
        window.removeEventListener("touchmove", preventScroll, {
          capture: true,
        } as EventListenerOptions);
      };
    }, [lockScroll, isOpen]);

    useEffect(() => {
      if (!isOpen || !isBrowser) return;

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

    /**
     * Escape and Tab close the menu wherever focus is.
     *
     * The trigger's own handler only sees keys while the trigger has focus, and
     * focus can be somewhere else — moved programmatically, or returned to
     * `<body>` by the browser — with the menu still open. Capture phase, so a
     * child that stops propagation cannot swallow the dismissal.
     *
     * Tab clears the restore flag: it is already taking the user somewhere, and
     * pulling focus back to the trigger would fight that.
     */
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
      id: triggerId,
      role: "combobox" as const,
      "aria-expanded": isOpen,
      "aria-haspopup": "listbox" as const,
      "aria-controls": listboxId,
      "aria-activedescendant": activeDescendantId,
      "aria-invalid": (error || undefined) as boolean | undefined,
      "aria-describedby": error && errorMessage ? errorId : undefined,
      "aria-required": (required || undefined) as boolean | undefined,
      ...comboboxNameProps({ valueId, labelId, hasLabel: !!label, ariaLabel, hasValueElement: !renderTrigger }),
      disabled,
      onClick: handleToggle,
      onMouseDown: focusTriggerOnMouseDown,
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
              aria-label="Clear selection"
              className={mergedClasses.clearTrigger || undefined}
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
                triggerNode?.focus({ preventScroll: true });
              }}
            >
              <ClearIconProp />
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
            focusedIndex={focusedIndex}
            loading={loading}
            ariaLabel={listboxAriaLabel}
            contentRef={dropdownContentRef}
            status={
              loading ? (
                <DropdownShimmer
                  count={shimmerCount}
                  className={mergedClasses.loading}
                  itemClassName={mergedClasses.loadingItem}
                />
              ) : displayOptions.length === 0 ? (
                <div role="status" className={mergedClasses.empty || undefined}>
                  {noResultsContent}
                </div>
              ) : null
            }
          >
            {loading
              ? null
              : displayOptions.map((option, index) => (
                  <DropdownOptionItem
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
                ))}
          </DropdownContent>
        </div>

        {name && (
          <input
            type="hidden"
            name={name}
            value={currentValue ?? ""}
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
  },
);

Dropdown.displayName = "Dropdown";

export default Dropdown;
