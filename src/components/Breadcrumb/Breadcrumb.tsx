import { useState, useRef, useEffect, useCallback, useMemo, forwardRef, memo } from "react";
import type { BreadcrumbItem, BreadcrumbProps, BreadcrumbTooltipProps } from "./types";
import { ChevronRightIcon, EllipsisIcon } from "./icons";
import { Button } from "../Button";

const BreadcrumbItemContent = memo(function BreadcrumbItemContent({
  item,
  iconClassName,
}: {
  item: BreadcrumbItem;
  iconClassName: string;
}) {
  const icon = item.icon && (
    <span className={iconClassName}>{item.icon}</span>
  );

  return (
    <>
      {item.iconPosition === "left" && icon}
      <span className="truncate">{item.content || item.label}</span>
      {item.iconPosition === "right" && icon}
    </>
  );
});

const CollapsedDropdownItem = memo(function CollapsedDropdownItem({
  item,
  itemClassName,
  iconClassName,
  onClick,
  defaultTooltipProps,
}: {
  item: BreadcrumbItem;
  itemClassName: string;
  iconClassName: string;
  onClick: (item: BreadcrumbItem) => void;
  defaultTooltipProps?: BreadcrumbTooltipProps;
}) {
  const handleClick = () => {
    if (!item.disabled) {
      onClick(item);
    }
  };

  const mergedTooltipProps = {
    ...defaultTooltipProps,
    ...item.tooltipProps,
  };

  const content = (
    <Button
      as="span"
      role="menuitem"
      tabIndex={item.disabled ? -1 : 0}
      className={itemClassName}
      onClick={handleClick}
      disabled={item.disabled}
      data-disabled={item.disabled || undefined}
      aria-disabled={item.disabled}
      tooltip={item.tooltip}
      tooltipProps={mergedTooltipProps}
    >
      <BreadcrumbItemContent item={item} iconClassName={iconClassName} />
    </Button>
  );

  return content;
});

const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(
  (
    {
      items,
      maxVisibleItems = 4,
      separator,
      onItemClick,
      ariaLabel = "Breadcrumb",
      className = "",
      containerClassName = "",
      itemClassName = "",
      activeItemClassName = "",
      separatorClassName = "",
      ellipsisClassName = "",
      ellipsisButtonClassName = "",
      ellipsisDropdownClassName = "",
      ellipsisDropdownItemClassName = "",
      iconClassName = "",
      linkClassName = "",
      SeparatorIcon,
      EllipsisIcon: CustomEllipsisIcon,
      iconSize = "w-4 h-4",
      ellipsisTooltip,
      ellipsisTooltipProps,
      defaultTooltipProps,
    },
    ref
  ) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const ellipsisButtonRef = useRef<HTMLButtonElement>(null);

    const handleClickOutside = useCallback((event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        ellipsisButtonRef.current &&
        !ellipsisButtonRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }, []);

    useEffect(() => {
      if (isDropdownOpen) {
        document.addEventListener("mousedown", handleClickOutside);
      }
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isDropdownOpen, handleClickOutside]);

    const handleItemClick = useCallback(
      (item: BreadcrumbItem) => {
        if (item.disabled) return;
        item.onClick?.();
        onItemClick?.(item);
        setIsDropdownOpen(false);
      },
      [onItemClick]
    );

    const handleEllipsisClick = useCallback(() => {
      setIsDropdownOpen((prev) => !prev);
    }, []);

    const handleEllipsisKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleEllipsisClick();
        } else if (e.key === "Escape") {
          setIsDropdownOpen(false);
        }
      },
      [handleEllipsisClick]
    );

    const { visibleItems, collapsedItems, shouldTruncate } = useMemo(() => {
      const totalItems = items.length;
      const effectiveMaxVisible = Math.max(maxVisibleItems, 2);

      if (totalItems <= effectiveMaxVisible) {
        return {
          visibleItems: items,
          collapsedItems: [],
          shouldTruncate: false,
        };
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

    const SeparatorComponent = SeparatorIcon || ChevronRightIcon;
    const EllipsisComponent = CustomEllipsisIcon || EllipsisIcon;

    const renderSeparator = useCallback(
      (key: string) => (
        <li
          key={key}
          role="presentation"
          aria-hidden="true"
          className={separatorClassName}
        >
          {separator || <SeparatorComponent className={iconSize} />}
        </li>
      ),
      [separator, separatorClassName, SeparatorComponent, iconSize]
    );

    const renderItem = useCallback(
      (item: BreadcrumbItem, _index: number, isLast: boolean) => {
        const isActive = isLast;
        const itemClasses = isActive ? activeItemClassName : itemClassName;

        const content = (
          <BreadcrumbItemContent item={item} iconClassName={iconClassName} />
        );

        const mergedTooltipProps = {
          ...defaultTooltipProps,
          ...item.tooltipProps,
        };

        if (item.href && !item.disabled) {
          return (
            <li key={item.id}>
              <Button
                as="a"
                href={item.href}
                className={[linkClassName, itemClasses].filter(Boolean).join(" ")}
                onClick={(e) => {
                  if (item.onClick || onItemClick) {
                    e.preventDefault();
                    handleItemClick(item);
                  }
                }}
                aria-current={isActive ? "page" : undefined}
                data-disabled={item.disabled || undefined}
                tooltip={item.tooltip}
                tooltipProps={mergedTooltipProps}
              >
                {content}
              </Button>
            </li>
          );
        }

        const isClickable = !item.disabled && (item.onClick || onItemClick);

        return (
          <li key={item.id}>
            <Button
              type="button"
              disabled={item.disabled}
              tabIndex={item.disabled ? -1 : 0}
              className={itemClasses}
              onClick={() => handleItemClick(item)}
              aria-current={isActive ? "page" : undefined}
              data-disabled={item.disabled || undefined}
              data-active={isActive || undefined}
              data-clickable={isClickable || undefined}
              tooltip={item.tooltip}
              tooltipProps={mergedTooltipProps}
            >
              {content}
            </Button>
          </li>
        );
      },
      [
        activeItemClassName,
        itemClassName,
        iconClassName,
        linkClassName,
        onItemClick,
        handleItemClick,
        defaultTooltipProps,
      ]
    );

    const renderEllipsis = useCallback(() => {
      const ellipsisButton = (
        <Button
          ref={ellipsisButtonRef as React.Ref<HTMLButtonElement>}
          type="button"
          onClick={handleEllipsisClick}
          onKeyDown={handleEllipsisKeyDown}
          className={ellipsisButtonClassName}
          aria-expanded={isDropdownOpen}
          aria-haspopup="menu"
          aria-label="Show collapsed breadcrumb items"
          tooltip={ellipsisTooltip}
          tooltipProps={ellipsisTooltipProps}
        >
          <EllipsisComponent className={iconSize} />
        </Button>
      );

      return (
        <li key="ellipsis" className={["relative", ellipsisClassName].filter(Boolean).join(" ")}>
          {ellipsisButton}

          {isDropdownOpen && (
            <div
              ref={dropdownRef}
              role="menu"
              className={ellipsisDropdownClassName}
              data-open={isDropdownOpen || undefined}
            >
              {collapsedItems.map((item) => (
                <CollapsedDropdownItem
                  key={item.id}
                  item={item}
                  itemClassName={ellipsisDropdownItemClassName}
                  iconClassName={iconClassName}
                  onClick={handleItemClick}
                  defaultTooltipProps={defaultTooltipProps}
                />
              ))}
            </div>
          )}
        </li>
      );
    }, [
      ellipsisClassName,
      ellipsisButtonClassName,
      ellipsisDropdownClassName,
      ellipsisDropdownItemClassName,
      iconClassName,
      isDropdownOpen,
      collapsedItems,
      handleEllipsisClick,
      handleEllipsisKeyDown,
      handleItemClick,
      EllipsisComponent,
      iconSize,
      ellipsisTooltip,
      ellipsisTooltipProps,
      defaultTooltipProps,
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
        className={containerClassName}
        data-truncated={shouldTruncate || undefined}
        data-dropdown-open={isDropdownOpen || undefined}
      >
        <ol className={className}>{renderedItems}</ol>
      </nav>
    );
  }
);

Breadcrumb.displayName = "Breadcrumb";

export default Breadcrumb;
