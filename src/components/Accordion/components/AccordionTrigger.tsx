import {
  forwardRef,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  type KeyboardEvent,
} from "react";
import { useAccordionConfig, useAccordionDispatch, useAccordionItemContext } from "../utils/context";
import { ChevronDownIcon } from "../utils/icons";
import { Slot } from "../../../utils/Slot";
import { mergeRefs } from "../../../utils/mergeRefs";
import type { AccordionTriggerProps } from "../utils/types";
import { cn } from "../../../utils/cn";

const AccordionTrigger = forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  (
    {
      children,
      expandedIcon,
      collapsedIcon,
      iconPosition = "right",
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
      const isRtl = config.dir === "rtl";

      let nextKey: string;
      let prevKey: string;

      if (isVertical) {
        nextKey = "ArrowDown";
        prevKey = "ArrowUp";
      } else {
        nextKey = isRtl ? "ArrowLeft" : "ArrowRight";
        prevKey = isRtl ? "ArrowRight" : "ArrowLeft";
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
    }, [config.orientation, config.dir, dispatch]);

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
          className={cn(config.classes.icon, getIconAnimationClass()) || undefined}
        />
      );
    };

    const shouldShowIcon = iconPosition !== "none";
    const iconElement = shouldShowIcon && (
      <span className={config.classes.iconWrapper || undefined} aria-hidden="true">
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
        iconPosition === "left" && "gap-2"
      ) || undefined,
      onClick: handleClick,
      onKeyDown: handleKeyDown,
      "aria-expanded": item.isExpanded,
      "aria-controls": item.contentId,
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
          <span className={config.classes.triggerLeft || undefined} aria-hidden="true">
            {leftSlot}
          </span>
        )}
        {iconPosition === "left" && iconElement}
        <span className={config.classes.triggerInner || undefined}>
          <span>{children}</span>
          {subtitle && (
            <span className={cn("block", config.classes.subtitle) || undefined}>
              {subtitle}
            </span>
          )}
        </span>
        {iconPosition === "right" && iconElement}
        {rightSlot && (
          <span className={config.classes.triggerRight || undefined} aria-hidden="true">
            {rightSlot}
          </span>
        )}
      </>
    );

    return (
      <HeadingTag className={config.classes.heading || undefined}>
        <Comp ref={mergedButtonRef} {...triggerProps}>
          {content}
        </Comp>
      </HeadingTag>
    );
  }
);

AccordionTrigger.displayName = "AccordionTrigger";

export default AccordionTrigger;
