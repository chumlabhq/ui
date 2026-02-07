import { forwardRef, useEffect, useRef, useCallback, type KeyboardEvent } from "react";
import { useAccordionConfig, useAccordionDispatch, useAccordionItemContext } from "../utils/context";
import { ChevronDownIcon } from "../utils/icons";
import { Slot } from "../../../utils/Slot";
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
      hideIcon = false,
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

    const setRefs = useCallback((node: HTMLButtonElement | null) => {
      buttonRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    }, [ref]);

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

    const getIconAnimationClass = useCallback(() => {
      if (iconAnimation === "none" || config.reduceMotion) return "";
      if (iconAnimation === "rotate") {
        return item.isExpanded ? "rotate-180" : "";
      }
      return "";
    }, [iconAnimation, config.reduceMotion, item.isExpanded]);

    const renderIcon = () => {
      if (iconPosition === "none" || hideIcon) return null;

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
          className={cn(config.classNames.icon, getIconAnimationClass()) || undefined}
        />
      );
    };

    const shouldShowIcon = iconPosition !== "none" && !hideIcon;
    const iconElement = shouldShowIcon && (
      <span className="shrink-0" aria-hidden="true">
        {renderIcon()}
      </span>
    );

    const dataState = item.isExpanded ? "open" : "closed";

    const HeadingTag = `h${config.headingLevel}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

    const triggerProps = {
      id: item.triggerId,
      type: "button" as const,
      className: cn(
        config.classNames.trigger,
        className,
        iconPosition === "left" && "flex-row-reverse justify-end"
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
          <span className={config.classNames.triggerLeft} aria-hidden="true">
            {leftSlot}
          </span>
        )}
        {iconPosition === "left" && iconElement}
        <span className="flex-1 text-left">
          <span className="block">{children}</span>
          {subtitle && (
            <span className={cn("block", config.classNames.subtitle)}>
              {subtitle}
            </span>
          )}
        </span>
        {iconPosition === "right" && iconElement}
        {rightSlot && (
          <span className={config.classNames.triggerRight} aria-hidden="true">
            {rightSlot}
          </span>
        )}
      </>
    );

    return (
      <HeadingTag className="m-0">
        <Comp ref={setRefs} {...triggerProps}>
          {content}
        </Comp>
      </HeadingTag>
    );
  }
);

AccordionTrigger.displayName = "AccordionTrigger";

export default AccordionTrigger;
