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
  computeDropdownCoords,
  scrollOptionIntoView,
  isBrowser,
} from "./utils/helpers";
import type { DropdownCoords } from "./utils/helpers";
import DropdownShimmer from "./components/DropdownShimmer";
import { cn } from "../../utils/cn";
import {
  DEFAULT_DROPDOWN_CLASSES,
  UNSTYLED_DROPDOWN_CLASSES,
} from "./utils/constants";
import { SR_ONLY_STYLE } from "../../utils/srOnlyStyle";
import { mergeRefs } from "../../utils/mergeRefs";
import { useStablePositionAfterOpen } from "../../utils/useStablePositionAfterOpen";

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
          classes.option,
          isSelected && classes.optionSelected,
          isFocused && classes.optionFocused,
          isDisabled && classes.optionDisabled,
        ) || undefined
      }
      data-selected={isSelected || undefined}
      data-focused={isFocused || undefined}
      data-disabled={isDisabled || undefined}
      data-value={option.value}
      onClick={() => {
        if (!isDisabled) onSelect(option);
      }}
      onMouseEnter={() => { if (!isDisabled) onHover(index); }}
    >
      <span>{option.content || option.label}</span>
      {isSelected &&
        showSelectedIcon &&
        (selectedIcon || (
          <CheckIconComponent className={classes.checkIcon || undefined} />
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
        forcePosition,
      ),
    );
  }, [triggerElement, preferredPosition, gap, forcePosition]);

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
      aria-label={ariaLabel}
      aria-busy={loading || undefined}
      className={classes.content || undefined}
      style={dropdownStyle}
      data-state={isOpen ? "open" : "closed"}
      data-position={coords?.position ?? preferredPosition}
      data-dropdown-id={dropdownId}
    >
      <div className={classes.optionList || undefined}>{children}</div>
    </div>,
    portalContainer ?? document.body,
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
 * - COMPONENT.ai.md (this directory) — full AI knowledge doc
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
      dropdownZIndex = 50,
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

    const baseClasses = unstyled
      ? UNSTYLED_DROPDOWN_CLASSES
      : DEFAULT_DROPDOWN_CLASSES;

    const mergedClasses: Required<DropdownClasses> = useMemo(
      () => ({
        root: classesProp?.root ?? baseClasses.root,
        wrapper: classesProp?.wrapper ?? baseClasses.wrapper,
        trigger: classesProp?.trigger ?? baseClasses.trigger,
        triggerText: classesProp?.triggerText ?? baseClasses.triggerText,
        content: classesProp?.content ?? baseClasses.content,
        optionList: classesProp?.optionList ?? baseClasses.optionList,
        option: classesProp?.option ?? baseClasses.option,
        optionSelected:
          classesProp?.optionSelected ?? baseClasses.optionSelected,
        optionFocused: classesProp?.optionFocused ?? baseClasses.optionFocused,
        optionDisabled:
          classesProp?.optionDisabled ?? baseClasses.optionDisabled,
        chevron: classesProp?.chevron ?? baseClasses.chevron,
        checkIcon: classesProp?.checkIcon ?? baseClasses.checkIcon,
        clearIcon: classesProp?.clearIcon ?? baseClasses.clearIcon,
        noResults: classesProp?.noResults ?? baseClasses.noResults,
        label: classesProp?.label ?? baseClasses.label,
        error: classesProp?.error ?? baseClasses.error,
        description: classesProp?.description ?? baseClasses.description,
        success: classesProp?.success ?? baseClasses.success,
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
      "aria-labelledby": label ? labelId : undefined,
      "aria-label": !label ? ariaLabel : undefined,
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
                className={mergedClasses.shimmer}
                itemClassName={mergedClasses.shimmerItem}
              />
            ) : displayOptions.length === 0 ? (
              <div
                role="status"
                className={mergedClasses.noResults || undefined}
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
  },
);

Dropdown.displayName = "Dropdown";

export default Dropdown;
