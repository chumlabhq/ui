import { useRef, useEffect, useId, forwardRef, useCallback, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import type { CSSProperties, ReactNode } from "react";
import type { MultiSelectDropdownProps, MultiSelectDropdownClasses } from "./utils/types";
import { useMultiSelectDropdown } from "./utils/useMultiSelectDropdown";
import { computeDropdownCoords, scrollOptionIntoView, isBrowser } from "./utils/helpers";
import type { DropdownCoords } from "./utils/helpers";
import { ChevronDownIcon } from "./utils/icons";
import MultiSelectDropdownShimmer from "./components/MultiSelectDropdownShimmer";
import { MultiSelectDropdownOption } from "./components/MultiSelectDropdownOption";
import { SelectedChip } from "./components/SelectedChip";
import { cn } from "../../utils/cn";
import {
  DEFAULT_MULTISELECTDROPDOWN_CLASSES,
  UNSTYLED_MULTISELECTDROPDOWN_CLASSES,
} from "./utils/constants";
import { SR_ONLY_STYLE } from "../../utils/srOnlyStyle";
import { mergeRefs } from "../../utils/mergeRefs";
import { useStablePositionAfterOpen } from "../../utils/useStablePositionAfterOpen";

const MAX_STATUS_LABELS = 5;

interface MultiSelectDropdownContentProps {
  triggerElement: HTMLElement | null;
  isOpen: boolean;
  keepMounted: boolean;
  position: "top" | "bottom";
  zIndex: number;
  gap: number;
  portalContainer?: HTMLElement | null;
  classes: Required<MultiSelectDropdownClasses>;
  listboxId: string;
  dropdownId: string;
  listboxAriaLabel: string;
  loading: boolean;
  contentRef?: React.RefObject<HTMLDivElement | null>;
  children: ReactNode;
}

function MultiSelectDropdownContent({
  triggerElement,
  isOpen,
  keepMounted,
  position: preferredPosition,
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
}: MultiSelectDropdownContentProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<DropdownCoords | null>(null);
  const isPositionStable = useStablePositionAfterOpen(isOpen);
  const rafIdRef = useRef<number | null>(null);

  const updatePosition = useCallback(() => {
    if (!triggerElement || !dropdownRef.current) return;
    setCoords(computeDropdownCoords(triggerElement, dropdownRef.current, preferredPosition, gap));
  }, [triggerElement, preferredPosition, gap]);

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
      <div className={classes.optionList || undefined}>{children}</div>
    </div>,
    portalContainer ?? document.body,
  );
}

const MultiSelectDropdown = forwardRef<
  HTMLDivElement,
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
      required = false,
      noResultsContent = "No options found",
      showChevron = true,
      fullWidth = false,
      loading: externalLoading = false,
      onLoadOptions,
      loadOnOpen = false,
      onLoadError,
      shimmerCount = 5,
      loadingText = "Loading...",
      maxDisplayedChips = 3,
      showSelectedChips = true,
      checkboxIcon,
      unstyled = false,
      lockScroll = true,
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
      ChevronIcon: ChevronIconProp = ChevronDownIcon,
      keepMounted = false,
      portalContainer,
      dropdownPosition = "bottom",
      dropdownZIndex = 50,
      dropdownGap = 4,
    },
    ref,
  ) => {
    const baseClasses = unstyled ? UNSTYLED_MULTISELECTDROPDOWN_CLASSES : DEFAULT_MULTISELECTDROPDOWN_CLASSES;

    const mergedClasses: Required<MultiSelectDropdownClasses> = useMemo(
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
        label: classesProp?.label ?? baseClasses.label,
        error: classesProp?.error ?? baseClasses.error,
        shimmer: classesProp?.shimmer ?? baseClasses.shimmer,
        shimmerItem: classesProp?.shimmerItem ?? baseClasses.shimmerItem,
        moreCount: classesProp?.moreCount ?? baseClasses.moreCount,
      }),
      [classesProp, baseClasses],
    );

    const generatedId = useId();
    const dropdownId = id || generatedId;
    const listboxId = `${dropdownId}-listbox`;
    const triggerId = `${dropdownId}-trigger`;
    const labelId = `${dropdownId}-label`;
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
      onLoadOptions,
      loadOnOpen,
      onLoadError,
      open,
      defaultOpen,
      onOpenChange,
      label,
      "aria-label": ariaLabel,
    });

    const activeDescendantId =
      isOpen && focusedIndex >= 0
        ? `${dropdownId}-option-${focusedIndex}`
        : undefined;

    const loading = externalLoading || isLoadingOptions;

    const statusMessage = loading
      ? loadingText
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
          triggerRef.current?.focus();
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

    // Scroll lock when dropdown is open
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
      if (!isOpen || typeof document === "undefined") return;
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
        mergeRefs(triggerRef, (node: HTMLButtonElement | null) => {
          setTriggerNode(node);
        }),
      [setTriggerNode],
    );

    const handleRemoveOptionAndFocus = useCallback(
      (optionValue: string) => {
        handleRemoveOption(optionValue);
        triggerRef.current?.focus();
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

        <div
          className={cn("relative", mergedClasses.wrapper) || undefined}
        >
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
            onKeyDown={handleKeyDownWithPassthrough}
            onFocus={onFocus}
            onBlur={onBlur}
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
              <ChevronIconProp
                className={mergedClasses.chevron || undefined}
                style={isOpen ? { transform: "rotate(180deg)" } : undefined}
              />
            )}
          </button>

          <MultiSelectDropdownContent
            triggerElement={triggerNode}
            isOpen={isOpen}
            keepMounted={keepMounted}
            position={dropdownPosition}
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
            {loading ? (
              <MultiSelectDropdownShimmer
                count={shimmerCount}
                className={mergedClasses.shimmer || undefined}
                itemClassName={mergedClasses.shimmerItem || undefined}
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
              ))
            )}
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
            className={mergedClasses.error || undefined}
          >
            {errorMessage}
          </div>
        )}
      </div>
    );
  },
);

MultiSelectDropdown.displayName = "MultiSelectDropdown";

export default MultiSelectDropdown;
