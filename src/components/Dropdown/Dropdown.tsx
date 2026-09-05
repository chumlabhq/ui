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
import { useLayer } from "../../utils/layers";
import type { CSSProperties, ReactNode } from "react";
import type {
  DropdownOption,
  DropdownProps,
  DropdownClasses,
} from "./utils/types";
import { useDropdown } from "./utils/useDropdown";
import {
  ChevronDownIcon,
  CheckIcon as CheckIconDefault,
  ClearIcon as ClearIconDefault,
} from "./utils/icons";
import {
  scrollOptionIntoView,
  isBrowser,
} from "./utils/helpers";
import DropdownShimmer from "./components/DropdownShimmer";
import { cn } from "../../utils/scopedCn";
import {
  DEFAULT_DROPDOWN_CLASSES,
  UNSTYLED_DROPDOWN_CLASSES,
} from "./utils/constants";
import { SR_ONLY_STYLE } from "../../utils/srOnlyStyle";
import { mergeRefs } from "../../utils/mergeRefs";
import { useAnchoredPosition } from "../../utils/useAnchoredPosition";

import { motionSafeClasses } from "../../utils/classLayers";
import { useReducedMotion } from "../../utils/useReducedMotion";
import { comboboxNameProps } from "../../utils/comboboxName";
import { useAccessibleNameWarning } from "../../utils/useAccessibleNameWarning";
import MenuSurface from "../../utils/menu/MenuSurface";
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
      id={listboxId}
      role="listbox"
      aria-label={ariaLabel}
      aria-busy={loading || undefined}
      className={classes.content || undefined}
      data-state={isOpen ? "open" : "closed"}
      data-position={coords?.side ?? preferredPosition}
      data-dropdown-id={dropdownId}
    >
      <div className={classes.list || undefined}>{children}</div>
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

    // ADR: floating content resolves its layer from the nearest overlay, so a
    // dropdown inside a drawer stacks above it. An explicit prop still wins.
    const dropdownZIndex = useLayer(dropdownZIndexProp);


    const prefersReducedMotion = useReducedMotion();

    const baseClassesRaw = unstyled
      ? UNSTYLED_DROPDOWN_CLASSES
      : DEFAULT_DROPDOWN_CLASSES;

    // Motion is decorative under ADR 001, so `unstyled` has already removed it;
    // this handles the other reason to stop animating. Applied to the defaults
    // only — a class string the consumer supplied is theirs to control.
    const baseClasses = motionSafeClasses(baseClassesRaw, prefersReducedMotion);

    const mergedClasses: Required<DropdownClasses> = useMemo(
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

    // Scroll lock when dropdown is open — uses event prevention (works on any scrollable ancestor)
    const dropdownContentRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
      if (!lockScroll || !isOpen || !isBrowser) return;

      const preventScroll = (e: Event) => {
        // Allow scroll inside the dropdown content itself
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
          >
            {loading ? (
              <DropdownShimmer
                count={shimmerCount}
                className={mergedClasses.loading}
                itemClassName={mergedClasses.loadingItem}
              />
            ) : displayOptions.length === 0 ? (
              <div
                role="status"
                className={mergedClasses.empty || undefined}
              >
                {noResultsContent}
              </div>
            ) : (
              displayOptions.map((option, index) => (
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
              ))
            )}
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
