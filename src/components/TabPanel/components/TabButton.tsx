import { memo } from "react";
import type { Tab } from "../utils/types";
import { useTabPanelContext } from "../utils/context";
import { cn } from "../../../utils/cn";

interface TabButtonProps {
  tab: Tab;
  index: number;
  isActive: boolean;
  isTabbable: boolean;
  setTabRef: (index: number, el: HTMLButtonElement | null) => void;
}

const TabButton = memo(function TabButton({
  tab,
  index,
  isActive,
  isTabbable,
  setTabRef,
}: TabButtonProps) {
  const ctx = useTabPanelContext();
  const isDisabled = ctx.disabled || tab.disabled;
  const count = Number(tab.count ?? 0);
  const hasCount = tab.count !== undefined;
  const shouldShowCount = hasCount && (ctx.showZeroCount || count > 0);
  const { classNames } = ctx;
  const showLabel = ctx.alwaysShowLabels || isActive;

  const iconElement = tab.icon != null && (
    <span
      className={cn(
        classNames.icon,
        isActive ? classNames.iconActive : classNames.iconInactive,
      ) || undefined}
      aria-hidden="true"
    >
      {tab.icon}
    </span>
  );

  const labelElement = showLabel && (
    <span
      className={cn(
        classNames.label,
        isActive ? classNames.labelActive : classNames.labelInactive,
      ) || undefined}
    >
      {tab.label}
    </span>
  );

  const countElement = shouldShowCount && (
    <span
      className={cn(
        classNames.count,
        isActive ? classNames.countActive : classNames.countInactive,
      ) || undefined}
      aria-label={`${count} items`}
    >
      {count}
    </span>
  );

  return (
    <button
      ref={(el) => {
        setTabRef(index, el);
      }}
      type="button"
      id={`${ctx.tabListId}-tab-${tab.id}`}
      role="tab"
      aria-selected={isActive}
      aria-controls={`${ctx.tabListId}-panel-${tab.id}`}
      aria-disabled={isDisabled || undefined}
      aria-label={!showLabel ? tab.label : undefined}
      tabIndex={isTabbable ? 0 : -1}
      onClick={() => !isDisabled && ctx.onSelect(tab.id)}
      onKeyDown={(e) => ctx.onKeyDown(e, index)}
      className={cn(
        classNames.tabFocus,
        classNames.tab,
        isActive ? classNames.tabActive : classNames.tabInactive,
        isDisabled && classNames.tabDisabled,
      ) || undefined}
      data-state={isActive ? "active" : "inactive"}
      data-disabled={isDisabled || undefined}
      data-orientation={ctx.orientation}
    >
      {ctx.iconPosition === "left" && iconElement}
      {labelElement}
      {ctx.iconPosition === "right" && iconElement}
      {countElement}
      {isActive && classNames.indicator && (
        <span className={classNames.indicator} aria-hidden="true" />
      )}
    </button>
  );
});

TabButton.displayName = "TabButton";

export default TabButton;
