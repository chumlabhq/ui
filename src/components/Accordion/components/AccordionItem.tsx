import { forwardRef, useMemo, useEffect, useRef } from "react";
import { useAccordionConfig, useAccordionContext, useIsItemExpanded, AccordionItemContext } from "../utils/context";
import { Slot } from "../../../utils/Slot";
import type { AccordionItemProps, AccordionItemContextValue } from "../utils/types";
import { cn } from "../../../utils/cn";

const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
  ({
    value,
    disabled: itemDisabled,
    children,
    className,
    asChild = false,
    onToggle,
    "aria-describedby": ariaDescribedBy,
    ...rest
  }, ref) => {
    const config = useAccordionConfig();
    const context = useAccordionContext();
    const isExpanded = useIsItemExpanded(value);

    const disabled = itemDisabled ?? config.disabled;

    const triggerId = `${config.accordionId}-trigger-${value}`;
    const contentId = `${config.accordionId}-content-${value}`;
    const isPending = context.pendingItem === value;

    const prevExpandedRef = useRef(isExpanded);
    useEffect(() => {
      if (prevExpandedRef.current !== isExpanded && onToggle) {
        onToggle(isExpanded);
      }
      prevExpandedRef.current = isExpanded;
    }, [isExpanded, onToggle]);

    const itemContextValue: AccordionItemContextValue = useMemo(
      () => ({
        value,
        disabled,
        isExpanded,
        triggerId,
        contentId,
        // Only set descriptionId when explicitly provided — auto-generating
        // an ID that points to a non-existent DOM element is an a11y anti-pattern
        descriptionId: ariaDescribedBy,
        onToggle,
      }),
      [value, disabled, isExpanded, triggerId, contentId, ariaDescribedBy, onToggle]
    );

    const dataState = isExpanded ? "open" : "closed";

    const Comp = asChild ? Slot : "div";

    return (
      <AccordionItemContext.Provider value={itemContextValue}>
        <Comp
          ref={ref}
          className={cn(config.classes.item, className) || undefined}
          data-state={dataState}
          data-disabled={disabled || undefined}
          data-pending={isPending || undefined}
          data-orientation={config.orientation}
          data-value={value}
          {...rest}
        >
          {children}
        </Comp>
      </AccordionItemContext.Provider>
    );
  }
);

AccordionItem.displayName = "AccordionItem";

export default AccordionItem;
