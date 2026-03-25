import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  forwardRef,
  useId,
} from "react";
import { createPortal } from "react-dom";
import type {
  BreadcrumbItem,
  BreadcrumbProps,
  BreadcrumbClasses,
  BreadcrumbTooltipProps,
} from "./utils/types";
import {
  DEFAULT_BREADCRUMB_CLASSES,
  UNSTYLED_BREADCRUMB_CLASSES,
} from "./utils/constants";
import { ChevronRightIcon, EllipsisIcon as DefaultEllipsisIcon } from "./icons";
import BreadcrumbItemContent from "./components/BreadcrumbItemContent";
import Tooltip from "../Tooltip/Tooltip";
import { cn } from "../../utils/cn";

const isBrowser = typeof window !== "undefined";

interface DropdownCoords {
  top: number;
  left: number;
}

function computeDropdownCoords(
  buttonEl: HTMLButtonElement,
  dropdownEl: HTMLDivElement,
  position: "top" | "bottom" | "left" | "right",
  gap: number,
): DropdownCoords {
  const rect = buttonEl.getBoundingClientRect();
  const dropdownRect = dropdownEl.getBoundingClientRect();

  switch (position) {
    case "top":
      return { top: rect.top - dropdownRect.height - gap, left: rect.left };
    case "bottom":
      return { top: rect.bottom + gap, left: rect.left };
    case "left":
      return { top: rect.top, left: rect.left - dropdownRect.width - gap };
    case "right":
      return { top: rect.top, left: rect.right + gap };
  }
}

// ─── Dropdown Item ─────────────────────────────────────────────────────────

function CollapsedDropdownItem({
  item,
  itemClassName,
  itemDisabledClassName,
  iconClassName,
  onClick,
  onKeyDown,
  setRef,
  index,
  showTooltips,
  tooltipPosition,
  tooltipOffset,
  defaultTooltipProps,
}: {
  item: BreadcrumbItem;
  itemClassName?: string;
  itemDisabledClassName?: string;
  iconClassName?: string;
  onClick: (item: BreadcrumbItem) => void;
  onKeyDown: (e: React.KeyboardEvent, index: number) => void;
  setRef: (index: number, el: HTMLButtonElement | null) => void;
  index: number;
  showTooltips: boolean;
  tooltipPosition: BreadcrumbTooltipProps["side"];
  tooltipOffset: number;
  defaultTooltipProps?: BreadcrumbTooltipProps;
}) {
  const isDisabled = !!item.disabled;

  const handleClick = () => {
    if (!isDisabled) onClick(item);
  };

  const mergedTooltipProps = { ...defaultTooltipProps, ...item.tooltipProps };

  const button = (
    <button
      ref={(el) => setRef(index, el)}
      type="button"
      role="menuitem"
      tabIndex={-1}
      className={cn(itemClassName, isDisabled && itemDisabledClassName) || undefined}
      onClick={handleClick}
      onKeyDown={(e) => onKeyDown(e, index)}
      disabled={isDisabled}
      data-disabled={isDisabled || undefined}
      aria-disabled={isDisabled || undefined}
    >
      <BreadcrumbItemContent item={item} iconClassName={iconClassName} />
    </button>
  );

  if (showTooltips && item.tooltip) {
    return (
      <Tooltip
        content={item.tooltip}
        side={mergedTooltipProps.side ?? tooltipPosition}
        sideOffset={mergedTooltipProps.sideOffset ?? tooltipOffset}
        maxWidth={mergedTooltipProps.maxWidth}
        delayDuration={mergedTooltipProps.delayDuration}
        showArrow={mergedTooltipProps.showArrow}
      >
        {button}
      </Tooltip>
    );
  }

  return button;
}

CollapsedDropdownItem.displayName = "CollapsedDropdownItem";

// ─── Dropdown Portal ───────────────────────────────────────────────────────

function DropdownPortal({
  buttonRef,
  dropdownId,
  dropdownClassName,
  dropdownItemClassName,
  dropdownItemDisabledClassName,
  iconClassName,
  collapsedItems,
  position,
  zIndex,
  gap,
  onItemClick,
  onMenuKeyDown,
  setMenuItemRef,
  menuItemRefs,
  showTooltips,
  tooltipPosition,
  tooltipOffset,
  defaultTooltipProps,
  portalContainer,
}: {
  buttonRef: React.RefObject<HTMLButtonElement | null>;
  dropdownId: string;
  dropdownClassName?: string;
  dropdownItemClassName?: string;
  dropdownItemDisabledClassName?: string;
  iconClassName?: string;
  collapsedItems: BreadcrumbItem[];
  position: "top" | "bottom" | "left" | "right";
  zIndex: number;
  gap: number;
  onItemClick: (item: BreadcrumbItem) => void;
  onMenuKeyDown: (e: React.KeyboardEvent, index: number) => void;
  setMenuItemRef: (index: number, el: HTMLButtonElement | null) => void;
  menuItemRefs: React.RefObject<(HTMLButtonElement | null)[]>;
  showTooltips: boolean;
  tooltipPosition: BreadcrumbTooltipProps["side"];
  tooltipOffset: number;
  defaultTooltipProps?: BreadcrumbTooltipProps;
  portalContainer?: HTMLElement | null;
}) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<DropdownCoords | null>(null);

  const updatePosition = useCallback(() => {
    if (!buttonRef.current || !dropdownRef.current) return;
    setCoords(
      computeDropdownCoords(buttonRef.current, dropdownRef.current, position, gap),
    );
  }, [buttonRef, position, gap]);

  useEffect(() => {
    requestAnimationFrame(updatePosition);
  }, [updatePosition]);

  // Reposition on resize and any ancestor scroll (capture phase)
  useEffect(() => {
    if (!isBrowser) return;
    let rafId: number;
    const handleReposition = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updatePosition);
    };
    window.addEventListener("resize", handleReposition);
    window.addEventListener("scroll", handleReposition, true);
    return () => {
      window.removeEventListener("resize", handleReposition);
      window.removeEventListener("scroll", handleReposition, true);
      cancelAnimationFrame(rafId);
    };
  }, [updatePosition]);

  // Auto-focus first enabled item
  useEffect(() => {
    if (menuItemRefs.current.length > 0) {
      const firstEnabled = menuItemRefs.current.find((el) => el && !el.disabled);
      firstEnabled?.focus();
    }
  }, [menuItemRefs]);

  const dropdownStyle: React.CSSProperties = {
    position: "fixed",
    zIndex,
    ...(coords
      ? { top: coords.top, left: coords.left }
      : { visibility: "hidden" as const, top: 0, left: 0 }),
  };

  if (!isBrowser) return null;

  return createPortal(
    <div
      ref={dropdownRef}
      role="menu"
      className={dropdownClassName || undefined}
      style={dropdownStyle}
      data-state="open"
      data-position={position}
      data-breadcrumb-dropdown-id={dropdownId}
    >
      {collapsedItems.map((item, idx) => (
        <CollapsedDropdownItem
          key={item.id}
          item={item}
          index={idx}
          itemClassName={dropdownItemClassName}
          itemDisabledClassName={dropdownItemDisabledClassName}
          iconClassName={iconClassName}
          onClick={onItemClick}
          onKeyDown={onMenuKeyDown}
          setRef={setMenuItemRef}
          showTooltips={showTooltips}
          tooltipPosition={tooltipPosition}
          tooltipOffset={tooltipOffset}
          defaultTooltipProps={defaultTooltipProps}
        />
      ))}
    </div>,
    portalContainer ?? document.body,
  );
}

DropdownPortal.displayName = "DropdownPortal";

// ─── Breadcrumb ────────────────────────────────────────────────────────────

const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(
  (
    {
      items,
      maxVisibleItems = 4,
      separator,
      onItemClick,
      "aria-label": ariaLabel = "Breadcrumb",
      classes: classesProp,
      unstyled = false,
      className,
      style,
      separatorIcon: SeparatorIconProp,
      ellipsisIcon: EllipsisIconProp,
      iconSize = 16,
      showTooltips = true,
      tooltipPosition = "bottom",
      tooltipOffset = 4,
      defaultTooltipProps,
      ellipsisTooltip,
      ellipsisTooltipProps,
      dropdownPosition = "top",
      dropdownZIndex = 50,
      portalContainer,
      ellipsisAriaLabel = "Show collapsed breadcrumb items",
      onDropdownOpenChange,
      ...rest
    },
    ref,
  ) => {
    const generatedId = useId();
    const dropdownId = `breadcrumb-dropdown-${generatedId}`;

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const ellipsisButtonRef = useRef<HTMLButtonElement>(null);
    const menuItemRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const dropdownGap = 4;
    const mountedRef = useRef(false);

    // ─── Notify on dropdown state change (skip initial mount) ────────
    useEffect(() => {
      if (!mountedRef.current) {
        mountedRef.current = true;
        return;
      }
      onDropdownOpenChange?.(isDropdownOpen);
    }, [isDropdownOpen, onDropdownOpenChange]);

    // ─── Merged classes system ────────────────────────────────────────
    const baseClasses = unstyled ? UNSTYLED_BREADCRUMB_CLASSES : DEFAULT_BREADCRUMB_CLASSES;
    const mergedClasses: Required<BreadcrumbClasses> = useMemo(
      () => ({
        root: classesProp?.root ?? baseClasses.root,
        list: classesProp?.list ?? baseClasses.list,
        item: classesProp?.item ?? baseClasses.item,
        itemActive: classesProp?.itemActive ?? baseClasses.itemActive,
        itemDisabled: classesProp?.itemDisabled ?? baseClasses.itemDisabled,
        link: classesProp?.link ?? baseClasses.link,
        separator: classesProp?.separator ?? baseClasses.separator,
        icon: classesProp?.icon ?? baseClasses.icon,
        ellipsis: classesProp?.ellipsis ?? baseClasses.ellipsis,
        ellipsisButton: classesProp?.ellipsisButton ?? baseClasses.ellipsisButton,
        dropdown: classesProp?.dropdown ?? baseClasses.dropdown,
        dropdownItem: classesProp?.dropdownItem ?? baseClasses.dropdownItem,
        dropdownItemDisabled: classesProp?.dropdownItemDisabled ?? baseClasses.dropdownItemDisabled,
      }),
      [classesProp, baseClasses],
    );

    // ─── Click outside ───────────────────────────────────────────────
    const handleClickOutside = useCallback(
      (event: MouseEvent | TouchEvent) => {
        const target = event.target as Node;
        if (ellipsisButtonRef.current?.contains(target)) return;
        const menuEls = menuItemRefs.current;
        for (const el of menuEls) {
          if (el?.contains(target)) return;
        }
        // Use instance-specific selector
        const portalDropdown = (target as HTMLElement).closest?.(
          `[data-breadcrumb-dropdown-id="${dropdownId}"]`,
        );
        if (portalDropdown) return;
        setIsDropdownOpen(false);
      },
      [dropdownId],
    );

    useEffect(() => {
      if (isDropdownOpen) {
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside);
      }
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("touchstart", handleClickOutside);
      };
    }, [isDropdownOpen, handleClickOutside]);

    // ─── Close on scroll ─────────────────────────────────────────────
    useEffect(() => {
      if (!isDropdownOpen || !isBrowser) return;
      const handleScroll = () => setIsDropdownOpen(false);
      window.addEventListener("scroll", handleScroll, true);
      return () => window.removeEventListener("scroll", handleScroll, true);
    }, [isDropdownOpen]);

    // ─── Close on Escape (document level) ────────────────────────────
    useEffect(() => {
      if (!isDropdownOpen) return;
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setIsDropdownOpen(false);
          ellipsisButtonRef.current?.focus();
        }
      };
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }, [isDropdownOpen]);

    // ─── Close on focus leaving ──────────────────────────────────────
    useEffect(() => {
      if (!isDropdownOpen || !isBrowser) return;
      const handleFocusOut = (e: FocusEvent) => {
        const related = e.relatedTarget as Node | null;
        if (!related) return;
        // If focus is going to the ellipsis button or a menu item, keep open
        if (ellipsisButtonRef.current?.contains(related)) return;
        for (const el of menuItemRefs.current) {
          if (el?.contains(related)) return;
        }
        const portalDropdown = (related as HTMLElement).closest?.(
          `[data-breadcrumb-dropdown-id="${dropdownId}"]`,
        );
        if (portalDropdown) return;
        setIsDropdownOpen(false);
      };
      document.addEventListener("focusout", handleFocusOut);
      return () => document.removeEventListener("focusout", handleFocusOut);
    }, [isDropdownOpen, dropdownId]);

    // ─── Item click ──────────────────────────────────────────────────
    const handleItemClick = useCallback(
      (item: BreadcrumbItem) => {
        if (item.disabled) return;
        item.onClick?.();
        onItemClick?.(item);
        setIsDropdownOpen(false);
      },
      [onItemClick],
    );

    const handleEllipsisClick = useCallback(() => {
      setIsDropdownOpen((prev) => !prev);
    }, []);

    const handleEllipsisKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        // Enter/Space handled natively by <button> — only add non-native keys
        if (e.key === "ArrowDown" && !isDropdownOpen) {
          e.preventDefault();
          setIsDropdownOpen(true);
        }
      },
      [isDropdownOpen],
    );

    const handleMenuKeyDown = useCallback(
      (e: React.KeyboardEvent, index: number) => {
        const enabledItems = menuItemRefs.current.filter((el) => el && !el.disabled);
        const currentEnabledIndex = enabledItems.indexOf(menuItemRefs.current[index]);

        switch (e.key) {
          case "ArrowDown": {
            e.preventDefault();
            const next = enabledItems[(currentEnabledIndex + 1) % enabledItems.length];
            next?.focus();
            break;
          }
          case "ArrowUp": {
            e.preventDefault();
            const prev = enabledItems[(currentEnabledIndex - 1 + enabledItems.length) % enabledItems.length];
            prev?.focus();
            break;
          }
          case "Home":
            e.preventDefault();
            enabledItems[0]?.focus();
            break;
          case "End":
            e.preventDefault();
            enabledItems[enabledItems.length - 1]?.focus();
            break;
          case "Escape":
            e.preventDefault();
            setIsDropdownOpen(false);
            ellipsisButtonRef.current?.focus();
            break;
          case "Tab":
            setIsDropdownOpen(false);
            break;
          case "Enter":
          case " ": {
            e.preventDefault();
            const el = menuItemRefs.current[index];
            el?.click();
            break;
          }
        }
      },
      [],
    );

    const setMenuItemRef = useCallback(
      (index: number, el: HTMLButtonElement | null) => {
        menuItemRefs.current[index] = el;
      },
      [],
    );

    // ─── Truncation logic ────────────────────────────────────────────
    const { visibleItems, collapsedItems, shouldTruncate } = useMemo(() => {
      const totalItems = items.length;
      const effectiveMaxVisible = Math.max(maxVisibleItems, 2);

      if (totalItems <= effectiveMaxVisible) {
        return { visibleItems: items, collapsedItems: [], shouldTruncate: false };
      }

      const firstItem = items[0];
      const itemsToShowAtEnd = effectiveMaxVisible - 1;
      const lastItems = items.slice(-itemsToShowAtEnd);
      const collapsed = items.slice(1, totalItems - itemsToShowAtEnd);

      return {
        visibleItems: [firstItem, ...lastItems],
        collapsedItems: collapsed,
        shouldTruncate: true,
      };
    }, [items, maxVisibleItems]);

    useEffect(() => {
      menuItemRefs.current = menuItemRefs.current.slice(0, collapsedItems.length);
    }, [collapsedItems.length]);

    // ─── Icons ───────────────────────────────────────────────────────
    const SeparatorComponent = SeparatorIconProp || ChevronRightIcon;
    const EllipsisComponent = EllipsisIconProp || DefaultEllipsisIcon;

    const iconSizeProps = useMemo(() => {
      if (typeof iconSize === "number") {
        return { style: { width: iconSize, height: iconSize } };
      }
      return { className: iconSize };
    }, [iconSize]);

    // ─── Render helpers ──────────────────────────────────────────────
    const renderSeparator = useCallback(
      (key: string) => (
        <li key={key} role="presentation" aria-hidden="true" className={mergedClasses.separator || undefined}>
          {separator || <SeparatorComponent {...iconSizeProps} />}
        </li>
      ),
      [separator, mergedClasses.separator, SeparatorComponent, iconSizeProps],
    );

    const renderItem = useCallback(
      (item: BreadcrumbItem, _index: number, isLast: boolean) => {
        const isActive = isLast;
        const isDisabled = !!item.disabled;
        const isClickable = !isDisabled && (!!item.onClick || !!onItemClick);

        const content = <BreadcrumbItemContent item={item} iconClassName={mergedClasses.icon} />;

        // Only merge when tooltip is actually shown to avoid unnecessary object creation
        const mergedTooltipProps = showTooltips && item.tooltip
          ? { ...defaultTooltipProps, ...item.tooltipProps }
          : null;

        const wrapWithTooltip = (el: React.ReactElement, key: string) => {
          if (mergedTooltipProps) {
            return (
              <li key={key}>
                <Tooltip
                  content={item.tooltip}
                  side={mergedTooltipProps.side ?? tooltipPosition}
                  sideOffset={mergedTooltipProps.sideOffset ?? tooltipOffset}
                  maxWidth={mergedTooltipProps.maxWidth}
                  delayDuration={mergedTooltipProps.delayDuration}
                  showArrow={mergedTooltipProps.showArrow}
                >
                  {el}
                </Tooltip>
              </li>
            );
          }
          return <li key={key}>{el}</li>;
        };

        if (item.href && !isDisabled) {
          return wrapWithTooltip(
            <a
              href={item.href}
              className={cn(mergedClasses.link, isActive ? mergedClasses.itemActive : mergedClasses.item) || undefined}
              onClick={(e) => {
                if (item.onClick || onItemClick) {
                  e.preventDefault();
                  handleItemClick(item);
                }
              }}
              aria-current={isActive ? "page" : undefined}
              data-state={isActive ? "active" : "inactive"}
              data-disabled={isDisabled || undefined}
            >
              {content}
            </a>,
            item.id,
          );
        }

        if (isActive) {
          return wrapWithTooltip(
            <span
              className={mergedClasses.itemActive || undefined}
              aria-current="page"
              data-state="active"
            >
              {content}
            </span>,
            item.id,
          );
        }

        return wrapWithTooltip(
          <button
            type="button"
            disabled={isDisabled}
            tabIndex={isDisabled ? -1 : 0}
            className={cn(mergedClasses.item, isDisabled && mergedClasses.itemDisabled) || undefined}
            onClick={() => handleItemClick(item)}
            data-state="inactive"
            data-disabled={isDisabled || undefined}
            data-clickable={isClickable || undefined}
            aria-disabled={isDisabled || undefined}
          >
            {content}
          </button>,
          item.id,
        );
      },
      [
        mergedClasses,
        onItemClick,
        handleItemClick,
        showTooltips,
        tooltipPosition,
        tooltipOffset,
        defaultTooltipProps,
      ],
    );

    const renderEllipsis = useCallback(() => {
      const mergedEllipsisTp = { ...defaultTooltipProps, ...ellipsisTooltipProps };

      const ellipsisButton = (
        <button
          ref={ellipsisButtonRef}
          type="button"
          onClick={handleEllipsisClick}
          onKeyDown={handleEllipsisKeyDown}
          className={mergedClasses.ellipsisButton || undefined}
          aria-expanded={isDropdownOpen}
          aria-haspopup="menu"
          aria-label={ellipsisAriaLabel}
        >
          <EllipsisComponent {...iconSizeProps} />
        </button>
      );

      const wrappedEllipsisButton =
        showTooltips && ellipsisTooltip && !isDropdownOpen ? (
          <Tooltip
            content={ellipsisTooltip}
            side={mergedEllipsisTp.side ?? tooltipPosition}
            sideOffset={mergedEllipsisTp.sideOffset ?? tooltipOffset}
            maxWidth={mergedEllipsisTp.maxWidth}
            delayDuration={mergedEllipsisTp.delayDuration}
            showArrow={mergedEllipsisTp.showArrow}
          >
            {ellipsisButton}
          </Tooltip>
        ) : (
          ellipsisButton
        );

      return (
        <li key="ellipsis" className={mergedClasses.ellipsis || undefined}>
          {wrappedEllipsisButton}
          {isDropdownOpen && (
            <DropdownPortal
              buttonRef={ellipsisButtonRef}
              dropdownId={dropdownId}
              dropdownClassName={mergedClasses.dropdown}
              dropdownItemClassName={mergedClasses.dropdownItem}
              dropdownItemDisabledClassName={mergedClasses.dropdownItemDisabled}
              iconClassName={mergedClasses.icon}
              collapsedItems={collapsedItems}
              position={dropdownPosition}
              zIndex={dropdownZIndex}
              gap={dropdownGap}
              onItemClick={handleItemClick}
              onMenuKeyDown={handleMenuKeyDown}
              setMenuItemRef={setMenuItemRef}
              menuItemRefs={menuItemRefs}
              showTooltips={showTooltips}
              tooltipPosition={tooltipPosition}
              tooltipOffset={tooltipOffset}
              defaultTooltipProps={defaultTooltipProps}
              portalContainer={portalContainer}
            />
          )}
        </li>
      );
    }, [
      mergedClasses,
      isDropdownOpen,
      collapsedItems,
      handleEllipsisClick,
      handleEllipsisKeyDown,
      handleItemClick,
      handleMenuKeyDown,
      setMenuItemRef,
      EllipsisComponent,
      iconSizeProps,
      showTooltips,
      tooltipPosition,
      tooltipOffset,
      ellipsisTooltip,
      ellipsisTooltipProps,
      defaultTooltipProps,
      dropdownPosition,
      dropdownZIndex,
      dropdownId,
      ellipsisAriaLabel,
      portalContainer,
    ]);

    // ─── Build rendered items ────────────────────────────────────────
    const renderedItems = useMemo(() => {
      const result: React.ReactNode[] = [];

      if (shouldTruncate) {
        result.push(renderItem(visibleItems[0], 0, false));
        result.push(renderSeparator("sep-0"));
        result.push(renderEllipsis());

        visibleItems.slice(1).forEach((item, idx) => {
          const isLast = idx === visibleItems.length - 2;
          result.push(renderSeparator(`sep-${idx + 1}`));
          result.push(renderItem(item, idx + 1, isLast));
        });
      } else {
        visibleItems.forEach((item, idx) => {
          const isLast = idx === visibleItems.length - 1;
          if (idx > 0) {
            result.push(renderSeparator(`sep-${idx}`));
          }
          result.push(renderItem(item, idx, isLast));
        });
      }

      return result;
    }, [shouldTruncate, visibleItems, renderItem, renderSeparator, renderEllipsis]);

    return (
      <nav
        ref={ref}
        aria-label={ariaLabel}
        className={cn(mergedClasses.root, className) || undefined}
        style={style}
        data-truncated={shouldTruncate || undefined}
        data-dropdown-open={isDropdownOpen || undefined}
        {...rest}
      >
        <ol className={mergedClasses.list || undefined}>{renderedItems}</ol>
      </nav>
    );
  },
);

Breadcrumb.displayName = "Breadcrumb";

export default Breadcrumb;
