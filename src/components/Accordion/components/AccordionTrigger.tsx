import {
  forwardRef,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  useContext,
  type KeyboardEvent,
} from "react";
import { useAccordionConfig, useAccordionDispatch, useAccordionItemContext, AccordionTriggerIdContext } from "../utils/context.js";
import { useIsomorphicLayoutEffect } from "../../../utils/useIsomorphicLayoutEffect.js";
import { ChevronDownIcon } from "../utils/icons.js";
import { Slot } from "../../../utils/Slot.js";
import { mergeRefs } from "../../../utils/mergeRefs.js";
import type { AccordionTriggerProps } from "../utils/types.js";
import { cn } from "../../../utils/scopedCn.js";
import { isRtl } from "../../../utils/isBrowser.js";

const AccordionTrigger = forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  (
    {
      children,
      expandedIcon,
      collapsedIcon,
      iconPosition = "end",
      className,
      asChild = false,
      subtitle,
      iconAnimation = "rotate",
      leftSlot,
      rightSlot,
      "aria-describedby": ariaDescribedBy,
      ...rest
    },
    ref
  ) => {
    const config = useAccordionConfig();
    const dispatch = useAccordionDispatch();
    const item = useAccordionItemContext();
    const buttonRef = useRef<HTMLButtonElement | null>(null);

    const { registerItem, unregisterItem } = dispatch;

    const setTriggerId = useContext(AccordionTriggerIdContext);
    useIsomorphicLayoutEffect(() => {
      setTriggerId?.(rest.id);
      return () => setTriggerId?.(undefined);
    }, [setTriggerId, rest.id]);

    useEffect(() => {
      const button = buttonRef.current;
      if (button) {
        registerItem(item.value, button);
      }
      return () => {
        unregisterItem(item.value);
      };
    }, [registerItem, unregisterItem, item.value]);

    const mergedButtonRef = useMemo(() => mergeRefs(buttonRef, ref), [ref]);

    const handleClick = useCallback(() => {
      if (!item.disabled) {
        dispatch.toggleItem(item.value);
      }
    }, [item.disabled, item.value, dispatch]);

    const handleKeyDown = useCallback((event: KeyboardEvent<HTMLButtonElement>) => {
      const isVertical = config.orientation === "vertical";
      const rtl = isRtl(event.currentTarget);

      let nextKey: string;
      let prevKey: string;

      if (isVertical) {
        nextKey = "ArrowDown";
        prevKey = "ArrowUp";
      } else {
        nextKey = rtl ? "ArrowLeft" : "ArrowRight";
        prevKey = rtl ? "ArrowRight" : "ArrowLeft";
      }

      switch (event.key) {
        case nextKey:
          event.preventDefault();
          dispatch.focusItem("next");
          break;
        case prevKey:
          event.preventDefault();
          dispatch.focusItem("prev");
          break;
        case "Home":
          event.preventDefault();
          dispatch.focusItem("first");
          break;
        case "End":
          event.preventDefault();
          dispatch.focusItem("last");
          break;
      }
    }, [config.orientation, dispatch]);

    const getIconAnimationClass = () => {
      if (iconAnimation === "none" || config.reduceMotion) return "";
      if (iconAnimation === "rotate") {
        return item.isExpanded ? "rotate-180" : "";
      }
      return "";
    };

    const renderIcon = () => {
      if (iconPosition === "none") return null;

      if (iconAnimation === "switch" && expandedIcon && collapsedIcon) {
        return item.isExpanded ? expandedIcon : collapsedIcon;
      }

      if (expandedIcon && collapsedIcon) {
        return item.isExpanded ? expandedIcon : collapsedIcon;
      }

      if (expandedIcon && !collapsedIcon) {
        return expandedIcon;
      }

      return (
        <ChevronDownIcon
          className={cn(config.classes.itemIndicator, getIconAnimationClass()) || undefined}
        />
      );
    };

    const shouldShowIcon = iconPosition !== "none";
    const iconElement = shouldShowIcon && (
      <span className={config.classes.icon || undefined} aria-hidden="true" inert>
        {renderIcon()}
      </span>
    );

    const dataState = item.isExpanded ? "open" : "closed";

    const HeadingTag = `h${config.headingLevel}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

    const triggerProps = {
      id: item.triggerId,
      type: "button" as const,
      className: cn(
        config.classes.trigger,
        className,
        iconPosition === "start" && "gap-2"
      ) || undefined,
      onClick: handleClick,
      onKeyDown: handleKeyDown,
      "aria-expanded": item.isExpanded,
      "aria-controls": item.isExpanded ? item.contentId : undefined,
      "aria-label": item.ariaLabel,
      "aria-labelledby": item.ariaLabelledBy,
      "aria-describedby": ariaDescribedBy ?? item.descriptionId,
      disabled: item.disabled,
      "data-state": dataState,
      "data-disabled": item.disabled || undefined,
      "data-orientation": config.orientation,
      ...rest,
    };

    const Comp = asChild ? Slot : "button";

    const content = asChild ? (
      children
    ) : (
      <>
        {leftSlot && (
          <span className={config.classes.itemIcon || undefined} aria-hidden="true" inert>
            {leftSlot}
          </span>
        )}
        {iconPosition === "start" && iconElement}
        <span className={config.classes.itemText || undefined}>
          <span>{children}</span>
          {subtitle && (
            <span className={cn(config.classes.description) || undefined}>
              {subtitle}
            </span>
          )}
        </span>
        {iconPosition === "end" && iconElement}
        {rightSlot && (
          <span className={config.classes.triggerActions || undefined} aria-hidden="true" inert>
            {rightSlot}
          </span>
        )}
      </>
    );

    return (
      <HeadingTag className={config.classes.header || undefined}>
        <Comp ref={mergedButtonRef} {...triggerProps}>
          {content}
        </Comp>
      </HeadingTag>
    );
  }
);

AccordionTrigger.displayName = "AccordionTrigger";

export default AccordionTrigger;
