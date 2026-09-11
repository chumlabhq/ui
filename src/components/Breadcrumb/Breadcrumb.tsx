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

function CollapsedDropdownItem({
  item,
  itemClassName,
  itemDisabledClassName,
  iconClassName,
  onClick,
  onKeyDown,
  setRef,
  index,
}: {
  item: BreadcrumbItem;
  itemClassName?: string;
  itemDisabledClassName?: string;
  iconClassName?: string;
  onClick: (item: BreadcrumbItem) => void;
  onKeyDown: (e: React.KeyboardEvent, index: number) => void;
  setRef: (index: number, el: HTMLButtonElement | null) => void;
  index: number;
}) {
  const isDisabled = !!item.disabled;

  const handleClick = () => {
    if (!isDisabled) onClick(item);
  };

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

  /**
   * No tooltip in here, unlike the trail.
   *
   * A tooltip on a trail item earns its place: the label may be truncated and
   * the trail is one line. In the dropdown the full label is already on screen,
   * so the tooltip repeats it — and the menu focuses its first item on open, so
   * it opens with no pointer anywhere near it and lands on the row BELOW. With
   * the default `side="bottom"` and 36px rows, `View all projects` covered
   * `Web Development` the moment the menu opened.
   */
  return button;
}

CollapsedDropdownItem.displayName = "CollapsedDropdownItem";

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
  portalContainer,
  keepMounted,
  ellipsisAriaLabel,
}: {
  buttonRef: React.RefObject<HTMLButtonElement | null>;
  dropdownId: string;
  /** The trigger's label, reused to name the surface it opens. */
  ellipsisAriaLabel: string;
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
  portalContainer?: HTMLElement | null;
  keepMounted?: boolean;
}) {
  const dropdownRef = useRef<HTMLDivElement>(null);

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
      // The trigger's own label, on the surface it opens: a `menu` is not named
      // by the items inside it, so it announced as "menu" and nothing else.
      aria-label={ellipsisAriaLabel}
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
        />
      ))}
    </MenuSurface>
  );
}

DropdownPortal.displayName = "DropdownPortal";

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

    /**
     * Every path that changes the dropdown's state reports it, rather than an
     * effect watching the state.
     *
     * The effect was guarded by a `mountedRef` so it would not fire on mount,
     * and StrictMode's double invoke walks straight through that: the first
     * pass sets the ref, the cleanup runs, the second pass sees a mounted ref
     * and calls back with `false`. The demo page's `onDropdownOpenChange`
     * example printed "Dropdown closed" on arrival, before anything had opened.
     * A callback that reports a change is called BY the change.
     */
    const openRef = useRef(false);
    const setDropdownOpen = useCallback(
      (next: boolean) => {
        // The guard reads a ref rather than the state: several of the callers
        // are document listeners that close over the value they were bound
        // with. Outside the updater, too — React may run an updater twice, so
        // a callback fired inside one is fired twice.
        if (openRef.current === next) return;
        openRef.current = next;
        setIsDropdownOpen(next);
        onDropdownOpenChange?.(next);
      },
      [onDropdownOpenChange],
    );

    const prefersReducedMotion = useReducedMotion();
    const baseClassesRaw = unstyled ? UNSTYLED_BREADCRUMB_CLASSES : DEFAULT_BREADCRUMB_CLASSES;
    const baseClasses = motionSafeClasses(baseClassesRaw, prefersReducedMotion);
    // `linkAndItem` is internal: the anchor's combined class, not a slot a
    // consumer can name.
    const mergedClasses: Required<BreadcrumbClasses> & { linkAndItem: string } = useMemo(
      () => ({
        root: cn(baseClasses.root, classesProp?.root),
        list: cn(baseClasses.list, classesProp?.list),
        item: cn(baseClasses.item, classesProp?.item),
        link: cn(baseClasses.link, classesProp?.link),
        // The anchor paints from `link` AND `item`. Composing each slot on its
        // own and joining them applied the library's `item` after the
        // consumer's `link` override and beat it — both carry `rounded`. Library
        // halves first, then consumer halves, so the consumer stays last however
        // many slots land on one element.
        linkAndItem: cn(
          baseClasses.link,
          baseClasses.item,
          classesProp?.link,
          classesProp?.item,
        ),
        separator: cn(baseClasses.separator, classesProp?.separator),
        itemIcon: cn(baseClasses.itemIcon, classesProp?.itemIcon),
        ellipsis: cn(baseClasses.ellipsis, classesProp?.ellipsis),
        ellipsisTrigger: cn(baseClasses.ellipsisTrigger, classesProp?.ellipsisTrigger),
        content: cn(baseClasses.content, classesProp?.content),
        collapsedItem: cn(baseClasses.collapsedItem, classesProp?.collapsedItem),
      }),
      [classesProp, baseClasses],
    );

    const handleClickOutside = useCallback(
      (event: MouseEvent | TouchEvent) => {
        const target = event.target as Node;
        if (ellipsisButtonRef.current?.contains(target)) return;
        const menuEls = menuItemRefs.current;
        for (const el of menuEls) {
          if (el?.contains(target)) return;
        }
        const portalDropdown = (target as HTMLElement).closest?.(
          `[data-breadcrumb-dropdown-id="${dropdownId}"]`,
        );
        if (portalDropdown) return;
        setDropdownOpen(false);
      },
      [dropdownId, setDropdownOpen],
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

    useEffect(() => {
      if (!isDropdownOpen || !isBrowser) return;
      const handleScroll = () => setDropdownOpen(false);
      window.addEventListener("scroll", handleScroll, true);
      return () => window.removeEventListener("scroll", handleScroll, true);
    }, [isDropdownOpen, setDropdownOpen]);

    useEffect(() => {
      if (!isDropdownOpen || !isBrowser) return;
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setDropdownOpen(false);
          ellipsisButtonRef.current?.focus();
        }
      };
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }, [isDropdownOpen, setDropdownOpen]);

    useEffect(() => {
      if (!isDropdownOpen || !isBrowser) return;
      const handleFocusOut = (e: FocusEvent) => {
        const related = e.relatedTarget as Node | null;
        if (!related) return;
        if (ellipsisButtonRef.current?.contains(related)) return;
        for (const el of menuItemRefs.current) {
          if (el?.contains(related)) return;
        }
        const portalDropdown = (related as HTMLElement).closest?.(
          `[data-breadcrumb-dropdown-id="${dropdownId}"]`,
        );
        if (portalDropdown) return;
        setDropdownOpen(false);
      };
      document.addEventListener("focusout", handleFocusOut);
      return () => document.removeEventListener("focusout", handleFocusOut);
    }, [isDropdownOpen, dropdownId, setDropdownOpen]);

    const handleItemClick = useCallback(
      (item: BreadcrumbItem) => {
        if (item.disabled) return;
        item.onClick?.();
        onItemClick?.(item);
        setDropdownOpen(false);
      },
      [onItemClick, setDropdownOpen],
    );

    const handleEllipsisClick = useCallback(() => {
      setDropdownOpen(!openRef.current);
    }, [setDropdownOpen]);

    const handleEllipsisKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        // Enter/Space handled natively by <button> — only add non-native keys
        if (e.key === "ArrowDown" && !isDropdownOpen) {
          e.preventDefault();
          setDropdownOpen(true);
        }
      },
      [isDropdownOpen, setDropdownOpen],
    );

    const setMenuItemRef = useCallback(
      (index: number, el: HTMLButtonElement | null) => {
        menuItemRefs.current[index] = el;
      },
      [],
    );

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
        setDropdownOpen(false);
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

    const SeparatorComponent = SeparatorIconProp || ChevronRightIcon;
    const EllipsisComponent = EllipsisIconProp || DefaultEllipsisIcon;

    const iconSizeProps = useMemo(() => {
      if (typeof iconSize === "number") {
        return { style: { width: iconSize, height: iconSize } };
      }
      return { className: iconSize };
    }, [iconSize]);

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
              className={mergedClasses.linkAndItem || undefined}
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
              portalContainer={portalContainer}
              keepMounted={keepMounted}
              ellipsisAriaLabel={ellipsisAriaLabel}
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
