import { forwardRef, useEffect, useRef, type KeyboardEvent } from "react";
import { useAccordionContext, useAccordionItemContext } from "../utils/context";
import { ChevronDownIcon } from "../utils/icons";
import { Slot } from "../utils/slot";
import type { AccordionTriggerProps } from "../utils/types";

const AccordionTrigger = forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  (
    {
      children,
      expandedIcon,
      collapsedIcon,
      iconPosition = "right",
      className,
      asChild = false,
      ...rest
    },
    ref
  ) => {
    const accordion = useAccordionContext();
    const item = useAccordionItemContext();
    const buttonRef = useRef<HTMLButtonElement | null>(null);

    const { registerItem, unregisterItem } = accordion;

    useEffect(() => {
      const button = buttonRef.current;
      if (button) {
        registerItem(item.value, button);
      }
      return () => {
        unregisterItem(item.value);
      };
    }, [registerItem, unregisterItem, item.value]);

    const setRefs = (node: HTMLButtonElement | null) => {
      buttonRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    const handleClick = () => {
      if (!item.disabled) {
        accordion.toggleItem(item.value);
      }
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
      const isVertical = accordion.orientation === "vertical";
      const isRtl = accordion.dir === "rtl";

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
          accordion.focusItem("next");
          break;
        case prevKey:
          event.preventDefault();
          accordion.focusItem("prev");
          break;
        case "Home":
          event.preventDefault();
          accordion.focusItem("first");
          break;
        case "End":
          event.preventDefault();
          accordion.focusItem("last");
          break;
      }
    };

    const renderIcon = () => {
      if (iconPosition === "none") return null;

      if (expandedIcon && collapsedIcon) {
        return item.isExpanded ? expandedIcon : collapsedIcon;
      }

      if (expandedIcon && !collapsedIcon) {
        return expandedIcon;
      }

      return (
        <ChevronDownIcon
          className={`${accordion.classNames.icon ?? ""} ${
            item.isExpanded ? "rotate-180" : ""
          }`}
        />
      );
    };

    const iconElement = iconPosition !== "none" && (
      <span className="shrink-0" aria-hidden="true">
        {renderIcon()}
      </span>
    );

    const dataState = item.isExpanded ? "open" : "closed";

    const HeadingTag = `h${accordion.headingLevel}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

    const triggerProps = {
      id: item.triggerId,
      type: "button" as const,
      className: `${accordion.classNames.trigger ?? ""} ${className ?? ""} ${
        iconPosition === "left" ? "flex-row-reverse justify-end" : ""
      }`.trim(),
      onClick: handleClick,
      onKeyDown: handleKeyDown,
      "aria-expanded": item.isExpanded,
      "aria-controls": item.contentId,
      disabled: item.disabled,
      "data-state": dataState,
      "data-disabled": item.disabled || undefined,
      "data-orientation": accordion.orientation,
      ...rest,
    };

    const Comp = asChild ? Slot : "button";

    const content = asChild ? (
      children
    ) : (
      <>
        {iconPosition === "left" && iconElement}
        <span className="flex-1 text-left">{children}</span>
        {iconPosition === "right" && iconElement}
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
