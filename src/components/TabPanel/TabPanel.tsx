import {
  useId,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  useState,
  forwardRef,
} from "react";
import type { KeyboardEvent, ReactNode } from "react";
import type { Tab, TabPanelProps, ResolvedClasses, TabRenderProps } from "./utils/types";
import { TabPanelContext } from "./utils/context";
import { useControllableState } from "../../utils/useControllableState";
import TabButton from "./components/TabButton";
import Tooltip from "../Tooltip/Tooltip";

const TabPanel = forwardRef<HTMLDivElement, TabPanelProps>(
  (
    {
      tabs,
      id,
      value: valueProp,
      defaultValue,
      onValueChange,
      children,
      orientation = "horizontal",
      activationMode = "automatic",
      loop = true,
      iconPosition = "left",
      showZeroCount = false,
      alwaysShowLabels = true,
      showTooltips = true,
      tooltipPosition = "bottom",
      tooltipOffset = 4,
      disabled = false,
      renderTab: renderTabProp,
      "aria-label": ariaLabel = "Tabs",
      classes: classesProp,
      className,
      style,
      forceMount = false,
      keepMounted = false,
    },
    ref,
  ) => {
    const [activeValue, setActiveValue] = useControllableState<string>({
      value: valueProp,
      defaultValue: defaultValue ?? tabs[0]?.id ?? "",
      onChange: onValueChange,
    });

    const activeTabExists = tabs.some((t) => t.id === activeValue);
    const resolvedValue = activeTabExists ? activeValue : (tabs[0]?.id ?? "");

    useEffect(() => {
      if (valueProp !== undefined) return;
      if (!activeTabExists && tabs.length > 0) {
        setActiveValue(tabs[0].id);
      }
    }, [tabs, activeTabExists, valueProp, setActiveValue]);

    const generatedId = useId();
    const tabListId = id ?? generatedId;

    const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const isKeyboardNavigating = useRef(false);

    const [manualFocusId, setManualFocusId] = useState<string | null>(null);
    const [activatedTabs, setActivatedTabs] = useState<Set<string>>(
      () => new Set([resolvedValue]),
    );
    const [prevResolvedValue, setPrevResolvedValue] = useState(resolvedValue);
    if (prevResolvedValue !== resolvedValue) {
      setPrevResolvedValue(resolvedValue);
      setManualFocusId(null);
      if (!activatedTabs.has(resolvedValue)) {
        setActivatedTabs((prev) => {
          const next = new Set(prev);
          next.add(resolvedValue);
          return next;
        });
      }
    }

    const tabbableTabId =
      activationMode === "manual" && manualFocusId
        ? manualFocusId
        : resolvedValue;

    useEffect(() => {
      tabRefs.current = tabRefs.current.slice(0, tabs.length);
    }, [tabs.length]);

    const setTabRef = useCallback(
      (index: number, el: HTMLButtonElement | null) => {
        tabRefs.current[index] = el;
      },
      [],
    );

    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
        const isHorizontal = orientation === "horizontal";
        const direction = window.getComputedStyle(e.currentTarget).direction;
        const isRTL = direction === "rtl";

        let forwardKey: string;
        let backwardKey: string;

        if (isHorizontal) {
          forwardKey = isRTL ? "ArrowLeft" : "ArrowRight";
          backwardKey = isRTL ? "ArrowRight" : "ArrowLeft";
        } else {
          forwardKey = "ArrowDown";
          backwardKey = "ArrowUp";
        }

        const enabledTabs = tabs.filter(
          (tab) => !tab.disabled && !disabled,
        );
        const currentEnabledIndex = enabledTabs.findIndex(
          (tab) => tab.id === tabs[index]?.id,
        );

        if (currentEnabledIndex < 0) return;

        let nextTab: Tab | undefined;

        switch (e.key) {
          case forwardKey:
            e.preventDefault();
            if (loop) {
              nextTab =
                enabledTabs[(currentEnabledIndex + 1) % enabledTabs.length];
            } else {
              const nextIdx = Math.min(
                currentEnabledIndex + 1,
                enabledTabs.length - 1,
              );
              if (nextIdx === currentEnabledIndex) return;
              nextTab = enabledTabs[nextIdx];
            }
            break;
          case backwardKey:
            e.preventDefault();
            if (loop) {
              nextTab =
                enabledTabs[
                  (currentEnabledIndex - 1 + enabledTabs.length) %
                    enabledTabs.length
                ];
            } else {
              const prevIdx = Math.max(currentEnabledIndex - 1, 0);
              if (prevIdx === currentEnabledIndex) return;
              nextTab = enabledTabs[prevIdx];
            }
            break;
          case "Home":
            e.preventDefault();
            nextTab = enabledTabs[0];
            break;
          case "End":
            e.preventDefault();
            nextTab = enabledTabs[enabledTabs.length - 1];
            break;
          case "Enter":
          case " ":
            if (activationMode === "manual") {
              e.preventDefault();
              const currentTab = tabs[index];
              if (currentTab && !currentTab.disabled && !disabled) {
                setActiveValue(currentTab.id);
                setManualFocusId(null);
              }
            }
            return;
          default:
            return;
        }

        if (nextTab) {
          isKeyboardNavigating.current = true;
          const nextIndex = tabs.findIndex((t) => t.id === nextTab!.id);
          if (nextIndex >= 0) {
            tabRefs.current[nextIndex]?.focus();
          }
          if (activationMode === "automatic") {
            setActiveValue(nextTab.id);
          } else {
            setManualFocusId(nextTab.id);
          }
        }
      },
      [tabs, disabled, orientation, loop, activationMode, setActiveValue],
    );

    const handleSelect = useCallback(
      (tabId: string) => {
        setActiveValue(tabId);
        if (activationMode === "manual") {
          setManualFocusId(null);
        }
      },
      [setActiveValue, activationMode],
    );

    const resolvedClasses: ResolvedClasses = useMemo(
      () => ({
        tab: classesProp?.tab ?? "",
        tabActive: classesProp?.tabActive ?? "",
        tabInactive: classesProp?.tabInactive ?? "",
        tabDisabled: classesProp?.tabDisabled ?? "",
        tabFocus: classesProp?.tabFocus ?? "",
        label: classesProp?.label ?? "",
        labelActive: classesProp?.labelActive ?? "",
        labelInactive: classesProp?.labelInactive ?? "",
        icon: classesProp?.icon ?? "",
        iconActive: classesProp?.iconActive ?? "",
        iconInactive: classesProp?.iconInactive ?? "",
        count: classesProp?.count ?? "",
        countActive: classesProp?.countActive ?? "",
        countInactive: classesProp?.countInactive ?? "",
        indicator: classesProp?.indicator ?? "",
      }),
      [classesProp],
    );

    const contextValue = useMemo(
      () => ({
        tabListId,
        iconPosition,
        showZeroCount,
        alwaysShowLabels,
        disabled,
        orientation,
        activationMode,
        classNames: resolvedClasses,
        onSelect: handleSelect,
        onKeyDown: handleKeyDown,
      }),
      [
        tabListId,
        iconPosition,
        showZeroCount,
        alwaysShowLabels,
        disabled,
        orientation,
        activationMode,
        resolvedClasses,
        handleSelect,
        handleKeyDown,
      ],
    );

    return (
      <TabPanelContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={classesProp?.root ?? className}
          style={style}
          data-disabled={disabled || undefined}
          data-orientation={orientation}
        >
          <div
            role="tablist"
            aria-label={ariaLabel}
            aria-orientation={orientation}
            className={classesProp?.tabList || undefined}
          >
            {tabs.map((tab, index) => {
              const isActive = resolvedValue === tab.id;
              const isTabbable = tabbableTabId === tab.id;
              const hasTooltip = showTooltips && !!tab.tooltip;
              const isDisabled = disabled || !!tab.disabled;

              const defaultTabButton = (
                <TabButton
                  key={hasTooltip && !renderTabProp ? undefined : tab.id}
                  tab={tab}
                  index={index}
                  isActive={isActive}
                  isTabbable={isTabbable}
                  setTabRef={setTabRef}
                />
              );

              const renderProps: TabRenderProps = {
                tab,
                index,
                isActive,
                isDisabled,
              };

              const tabElement = renderTabProp
                ? renderTabProp(renderProps, defaultTabButton)
                : defaultTabButton;

              if (hasTooltip) {
                return (
                  <Tooltip
                    key={tab.id}
                    content={tab.tooltip}
                    side={tooltipPosition}
                    sideOffset={tooltipOffset}
                    disabled={isActive}
                  >
                    {tabElement}
                  </Tooltip>
                );
              }

              return tabElement;
            })}
          </div>

          {tabs.map((tab) => {
            const isActive = resolvedValue === tab.id;
            const hasBeenActivated = activatedTabs.has(tab.id);

            const shouldRenderContent =
              forceMount ||
              isActive ||
              (keepMounted && hasBeenActivated);

            return (
              <div
                key={tab.id}
                role="tabpanel"
                id={`${tabListId}-panel-${tab.id}`}
                aria-labelledby={`${tabListId}-tab-${tab.id}`}
                tabIndex={isActive ? 0 : -1}
                className={classesProp?.panel || undefined}
                data-state={isActive ? "active" : "inactive"}
                data-orientation={orientation}
                hidden={!isActive || undefined}
              >
                {shouldRenderContent &&
                  (typeof children === "function"
                    ? (children as (tab: Tab) => ReactNode)(tab)
                    : children)}
              </div>
            );
          })}
        </div>
      </TabPanelContext.Provider>
    );
  },
);

TabPanel.displayName = "TabPanel";

export default TabPanel;
