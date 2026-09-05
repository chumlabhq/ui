import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  forwardRef,
  useId,
} from "react";
import { useLayer } from "../../utils/layers.js";
import type {
  BreadcrumbItem,
  BreadcrumbProps,
  BreadcrumbClasses,
  BreadcrumbTooltipProps,
} from "./utils/types.js";
import {
  DEFAULT_BREADCRUMB_CLASSES,
  UNSTYLED_BREADCRUMB_CLASSES,
} from "./utils/constants.js";
import { ChevronRightIcon, EllipsisIcon as DefaultEllipsisIcon } from "./icons.js";
import BreadcrumbItemContent from "./components/BreadcrumbItemContent.js";
import Tooltip from "../Tooltip/Tooltip.js";
import { cn } from "../../utils/scopedCn.js";
import { isBrowser } from "../../utils/isBrowser.js";

import { motionSafeClasses } from "../../utils/classLayers.js";
import { useReducedMotion } from "../../utils/useReducedMotion.js";
import MenuSurface from "../../utils/menu/MenuSurface.js";
import { useMenuNavigation } from "../../utils/menu/useMenuNavigation.js";

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
  keepMounted,
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
  keepMounted?: boolean;
}) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Auto-focus first enabled item
  useEffect(() => {
    if (menuItemRefs.current.length > 0) {
      const firstEnabled = menuItemRefs.current.find((el) => el && !el.disabled);
      firstEnabled?.focus();
    }
  }, [menuItemRefs]);

  return (
    <MenuSurface
      ref={dropdownRef}
      trigger={buttonRef}
      isOpen
      side={position}
      gap={gap}
      zIndex={zIndex}
      portalContainer={portalContainer}
      keepMounted={keepMounted}
      matchTriggerWidth={false}
      id={dropdownId}
      role="menu"
      className={dropdownClassName || undefined}
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
    </MenuSurface>
  );
}

DropdownPortal.displayName = "DropdownPortal";

// ─── Breadcrumb ────────────────────────────────────────────────────────────

/**
 * Component: Breadcrumb
 *
 * Purpose:
 * A navigation trail showing the user's location in a page hierarchy.
 * Automatically truncates long trails into a dropdown with keyboard navigation.
 *
 * AI Usage Guidelines:
 * - Pass an `items` array — last item is always the active page
 * - Use `maxVisibleItems` to collapse deep hierarchies
 * - Items with `href` render as links, others as buttons
 * - Use `onItemClick` for SPA navigation (preventDefault is handled)
 *
 * Behavior:
 * - Truncation: first item + last N-1 items visible, middle items in dropdown
 * - Dropdown: portal-rendered, keyboard navigable, closes on outside click/Escape
 * - Disabled items: skipped in navigation, `aria-disabled`, no click handlers
 *
 * Reference:
 * - BREADCRUMB.ai.md (this directory) — full AI knowledge doc with props, styling guide, patterns
 * - src/pages/demo/BreadcrumbDemo.tsx — live demo with all features implemented
 */
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
      dropdownZIndex: dropdownZIndexProp,
      portalContainer,
      keepMounted = false,
      ellipsisAriaLabel = "Show collapsed breadcrumb items",
      onDropdownOpenChange,
      ...rest
    },
    ref,
  ) => {
    // ADR: floating content resolves its layer from the nearest overlay, so a
    // dropdown inside a drawer stacks above it. An explicit prop still wins.
    const dropdownZIndex = useLayer(dropdownZIndexProp);

    const generatedId = useId();
    const dropdownId = `breadcrumb-dropdown-${generatedId}`;

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const shouldRestoreFocusRef = useRef(false);
    const ellipsisButtonRef = useRef<HTMLButtonElement>(null);
    const menuItemRefs = useRef<(HTMLButtonElement | null)[]>([]);
    // Tight gap so the dropdown reads as anchored to the ellipsis trigger
    // rather than floating away from it. 4 px felt visually closer to 20 px
    // once the dropdown's own py-1 padding stacked on top.
    const dropdownGap = 0;
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
    const prefersReducedMotion = useReducedMotion();
    const baseClassesRaw = unstyled ? UNSTYLED_BREADCRUMB_CLASSES : DEFAULT_BREADCRUMB_CLASSES;
    // Motion is decorative under ADR 001, so `unstyled` has already removed it;
    // this handles the other reason to stop animating. Applied to the defaults
    // only — a class string the consumer supplied is theirs to control.
    const baseClasses = motionSafeClasses(baseClassesRaw, prefersReducedMotion);
    const mergedClasses: Required<BreadcrumbClasses> = useMemo(
      () => ({
        root: classesProp?.root ?? baseClasses.root,
        list: classesProp?.list ?? baseClasses.list,
        item: classesProp?.item ?? baseClasses.item,
        link: classesProp?.link ?? baseClasses.link,
        separator: classesProp?.separator ?? baseClasses.separator,
        itemIcon: classesProp?.itemIcon ?? baseClasses.itemIcon,
        ellipsis: classesProp?.ellipsis ?? baseClasses.ellipsis,
        ellipsisTrigger: classesProp?.ellipsisTrigger ?? baseClasses.ellipsisTrigger,
        content: classesProp?.content ?? baseClasses.content,
        collapsedItem: classesProp?.collapsedItem ?? baseClasses.collapsedItem,
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
      if (!isDropdownOpen || !isBrowser) return;
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
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
      if (!isDropdownOpen || !isBrowser) return;
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

    /**
     * The shared keyboard model, driving real DOM focus.
     *
     * This menu moves focus rather than pointing with `aria-activedescendant`,
     * so the index the primitive owns is applied to the item refs here. The
     * navigation itself — wrap, skip disabled, Home/End, Enter and Space — is
     * no longer written out per component.
     */
    const {
      activeIndex: activeItemIndex,
      setActiveIndex: setActiveItemIndex,
      onKeyDown: onMenuKeyDown,
    } = useMenuNavigation<BreadcrumbItem>({
      items: collapsedItems,
      isOpen: isDropdownOpen,
      isDisabled: (item) => !!item.disabled,
      onSelect: handleItemClick,
      onClose: (reason) => {
        setIsDropdownOpen(false);
        // Escape returns to the trigger; Tab is already leaving.
        if (reason === "escape") shouldRestoreFocusRef.current = true;
      },
    });

    useEffect(() => {
      if (isDropdownOpen && activeItemIndex >= 0) {
        menuItemRefs.current[activeItemIndex]?.focus();
      }
    }, [isDropdownOpen, activeItemIndex]);

    /**
     * Focus returns to the ellipsis through a flag, not from the Escape handler.
     *
     * Calling `.focus()` inline runs before React has removed the menu, so the
     * browser can move focus again in the same tick.
     */
    useEffect(() => {
      if (!isDropdownOpen && shouldRestoreFocusRef.current) {
        shouldRestoreFocusRef.current = false;
        ellipsisButtonRef.current?.focus();
      }
    }, [isDropdownOpen]);

    const handleMenuKeyDown = useCallback(
      (e: React.KeyboardEvent, index: number) => {
        // The item under the pointer is the one the keys act from.
        if (activeItemIndex !== index) setActiveItemIndex(index);
        onMenuKeyDown(e);
      },
      [activeItemIndex, setActiveItemIndex, onMenuKeyDown],
    );


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

        const content = <BreadcrumbItemContent item={item} iconClassName={mergedClasses.itemIcon} />;

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
              className={cn(mergedClasses.link, mergedClasses.item) || undefined}
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
              className={mergedClasses.item || undefined}
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
            className={mergedClasses.item || undefined}
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
          className={mergedClasses.ellipsisTrigger || undefined}
          aria-expanded={isDropdownOpen}
          aria-haspopup="menu"
          aria-controls={isDropdownOpen ? dropdownId : undefined}
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
              dropdownClassName={mergedClasses.content}
              dropdownItemClassName={mergedClasses.collapsedItem}
              iconClassName={mergedClasses.itemIcon}
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
              keepMounted={keepMounted}
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
      keepMounted,
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
