import { useId, useRef, useEffect, forwardRef, memo } from "react";
import type { KeyboardEvent } from "react";
import type { Tab, TabPanelProps } from "./types";
import Tooltip from "../Tooltip/Tooltip";

const TabButton = memo(function TabButton({
  tab,
  index,
  isActive,
  tabListId,
  showIcons,
  iconPosition,
  showCount,
  showZeroCount,
  alwaysShowLabels,
  disabled,
  tabButtonClassName,
  tabButtonActiveClassName,
  tabButtonInactiveClassName,
  tabButtonDisabledClassName,
  tabButtonFocusClassName,
  tabLabelClassName,
  tabLabelActiveClassName,
  tabLabelInactiveClassName,
  tabIconClassName,
  tabIconActiveClassName,
  tabIconInactiveClassName,
  tabCountClassName,
  tabCountActiveClassName,
  tabCountInactiveClassName,
  activeIndicatorClassName,
  onSelect,
  onKeyDown,
  buttonRef,
}: {
  tab: Tab;
  index: number;
  isActive: boolean;
  tabListId: string;
  showIcons: boolean;
  iconPosition: "left" | "right";
  showCount: boolean;
  showZeroCount: boolean;
  alwaysShowLabels: boolean;
  disabled: boolean;
  tabButtonClassName: string;
  tabButtonActiveClassName: string;
  tabButtonInactiveClassName: string;
  tabButtonDisabledClassName: string;
  tabButtonFocusClassName: string;
  tabLabelClassName: string;
  tabLabelActiveClassName: string;
  tabLabelInactiveClassName: string;
  tabIconClassName: string;
  tabIconActiveClassName: string;
  tabIconInactiveClassName: string;
  tabCountClassName: string;
  tabCountActiveClassName: string;
  tabCountInactiveClassName: string;
  activeIndicatorClassName: string;
  onSelect: (tabId: string) => void;
  onKeyDown: (e: KeyboardEvent<HTMLButtonElement>, index: number) => void;
  buttonRef: (el: HTMLButtonElement | null) => void;
}) {
  const isDisabled = disabled || tab.disabled;
  const count = Number(tab.count ?? 0);
  const shouldShowCount = showCount && (showZeroCount || count > 0);

  const IconComponent = tab.icon;
  const showIcon = showIcons && IconComponent;

  const iconElement = showIcon && (
    <IconComponent
      className={[
        tabIconClassName,
        isActive ? tabIconActiveClassName : tabIconInactiveClassName,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-hidden="true"
    />
  );

  const labelElement = (alwaysShowLabels || isActive) && (
    <span
      className={[
        tabLabelClassName,
        isActive ? tabLabelActiveClassName : tabLabelInactiveClassName,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {tab.label}
    </span>
  );

  const countElement = shouldShowCount && (
    <span
      className={[
        tabCountClassName,
        isActive ? tabCountActiveClassName : tabCountInactiveClassName,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label={`${count} items`}
    >
      {count}
    </span>
  );

  return (
    <button
      ref={buttonRef}
      type="button"
      id={`${tabListId}-tab-${tab.id}`}
      role="tab"
      aria-selected={isActive}
      aria-controls={`${tabListId}-panel-${tab.id}`}
      aria-disabled={isDisabled || undefined}
      tabIndex={isActive ? 0 : -1}
      disabled={isDisabled}
      onClick={() => !isDisabled && onSelect(tab.id)}
      onKeyDown={(e) => onKeyDown(e, index)}
      className={[
        tabButtonFocusClassName,
        tabButtonClassName,
        isActive ? tabButtonActiveClassName : tabButtonInactiveClassName,
        isDisabled ? tabButtonDisabledClassName : "",
      ]
        .filter(Boolean)
        .join(" ")}
      data-active={isActive || undefined}
      data-disabled={isDisabled || undefined}
    >
      <span className="inline-flex items-center gap-2">
        {iconPosition === "left" && iconElement}
        {labelElement}
        {iconPosition === "right" && iconElement}
      </span>
      {countElement}
      {isActive && activeIndicatorClassName && (
        <span className={activeIndicatorClassName} aria-hidden="true" />
      )}
    </button>
  );
});

const TabPanel = forwardRef<HTMLDivElement, TabPanelProps>(
  (
    {
      tabs,
      activeTabId,
      onTabChange,
      children,
      showIcons = true,
      iconPosition = "left",
      showCount = true,
      showZeroCount = false,
      alwaysShowLabels = true,
      showTooltips = true,
      tooltipPosition = "bottom",
      tooltipOffset = 4,
      disableAutoFocus = false,
      disabled = false,
      containerClassName = "",
      tabListClassName = "",
      tabButtonClassName = "",
      tabButtonActiveClassName = "",
      tabButtonInactiveClassName = "",
      tabButtonDisabledClassName = "",
      tabButtonFocusClassName = "outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-blue-500",
      tabLabelClassName = "",
      tabLabelActiveClassName = "",
      tabLabelInactiveClassName = "",
      tabIconClassName = "",
      tabIconActiveClassName = "",
      tabIconInactiveClassName = "",
      tabCountClassName = "",
      tabCountActiveClassName = "",
      tabCountInactiveClassName = "",
      activeIndicatorClassName = "",
      tabPanelClassName = "",
    },
    ref,
  ) => {
    const generatedId = useId();
    const tabListId = generatedId;
    const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const tabIdsKey = tabs.map((t) => t.id).join("|");
    const isKeyboardNavigating = useRef(false);

    useEffect(() => {
      tabRefs.current = tabRefs.current.slice(0, tabs.length);
    }, [tabs.length]);

    useEffect(() => {
      if (disableAutoFocus) return;
      // Skip auto-focus if we're handling keyboard navigation (focus is already managed)
      if (isKeyboardNavigating.current) {
        isKeyboardNavigating.current = false;
        return;
      }
      const activeIndex = tabs.findIndex((tab) => tab.id === activeTabId);
      if (activeIndex >= 0 && tabRefs.current[activeIndex]) {
        tabRefs.current[activeIndex]?.focus();
      }
    }, [activeTabId, tabIdsKey, disableAutoFocus, tabs]);

    const handleKeyDown = (
      e: KeyboardEvent<HTMLButtonElement>,
      index: number,
    ) => {
      const enabledTabs = tabs.filter((tab) => !tab.disabled && !disabled);
      const currentEnabledIndex = enabledTabs.findIndex(
        (tab) => tab.id === tabs[index].id,
      );

      let nextTab: Tab | undefined;

      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
          e.preventDefault();
          nextTab = enabledTabs[(currentEnabledIndex + 1) % enabledTabs.length];
          break;
        case "ArrowLeft":
        case "ArrowUp":
          e.preventDefault();
          nextTab =
            enabledTabs[
              (currentEnabledIndex - 1 + enabledTabs.length) %
                enabledTabs.length
            ];
          break;
        case "Home":
          e.preventDefault();
          nextTab = enabledTabs[0];
          break;
        case "End":
          e.preventDefault();
          nextTab = enabledTabs[enabledTabs.length - 1];
          break;
        default:
          return;
      }

      if (nextTab) {
        isKeyboardNavigating.current = true;
        const nextIndex = tabs.findIndex((t) => t.id === nextTab!.id);
        if (nextIndex >= 0 && tabRefs.current[nextIndex]) {
          tabRefs.current[nextIndex]?.focus();
        }
        onTabChange(nextTab.id);
      }
    };

    const renderTab = (tab: Tab, index: number) => {
      const isActive = activeTabId === tab.id;
      const shouldShowTooltip = showTooltips && tab.tooltip && !isActive;

      const button = (
        <TabButton
          tab={tab}
          index={index}
          isActive={isActive}
          tabListId={tabListId}
          showIcons={showIcons}
          iconPosition={iconPosition}
          showCount={showCount}
          showZeroCount={showZeroCount}
          alwaysShowLabels={alwaysShowLabels}
          disabled={disabled}
          tabButtonClassName={tabButtonClassName}
          tabButtonActiveClassName={tabButtonActiveClassName}
          tabButtonInactiveClassName={tabButtonInactiveClassName}
          tabButtonDisabledClassName={tabButtonDisabledClassName}
          tabButtonFocusClassName={tabButtonFocusClassName}
          tabLabelClassName={tabLabelClassName}
          tabLabelActiveClassName={tabLabelActiveClassName}
          tabLabelInactiveClassName={tabLabelInactiveClassName}
          tabIconClassName={tabIconClassName}
          tabIconActiveClassName={tabIconActiveClassName}
          tabIconInactiveClassName={tabIconInactiveClassName}
          tabCountClassName={tabCountClassName}
          tabCountActiveClassName={tabCountActiveClassName}
          tabCountInactiveClassName={tabCountInactiveClassName}
          activeIndicatorClassName={activeIndicatorClassName}
          onSelect={onTabChange}
          onKeyDown={handleKeyDown}
          buttonRef={(el) => (tabRefs.current[index] = el)}
        />
      );

      if (shouldShowTooltip) {
        return (
          <Tooltip
            key={tab.id}
            content={tab.tooltip}
            side={tooltipPosition}
            sideOffset={tooltipOffset}
          >
            <span className="inline-flex">{button}</span>
          </Tooltip>
        );
      }

      return (
        <span key={tab.id} className="inline-flex">
          {button}
        </span>
      );
    };

    const activeTab = tabs.find((tab) => tab.id === activeTabId);

    return (
      <div
        ref={ref}
        className={containerClassName}
        data-disabled={disabled || undefined}
      >
        <div
          role="tablist"
          aria-label="Tabs"
          aria-orientation="horizontal"
          className={tabListClassName}
        >
          {tabs.map(renderTab)}
        </div>

        {activeTab && (
          <div
            role="tabpanel"
            id={`${tabListId}-panel-${activeTab.id}`}
            aria-labelledby={`${tabListId}-tab-${activeTab.id}`}
            tabIndex={0}
            className={tabPanelClassName}
          >
            {children}
          </div>
        )}
      </div>
    );
  },
);

TabPanel.displayName = "TabPanel";

export default TabPanel;
