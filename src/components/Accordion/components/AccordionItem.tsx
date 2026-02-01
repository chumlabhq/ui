import { forwardRef, useMemo, useEffect, useRef } from "react";
import { useAccordionContext, AccordionItemContext } from "../utils/context";
import { Slot } from "../../../utils/Slot";
import type { AccordionItemProps, AccordionItemContextValue } from "../utils/types";

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
    const accordion = useAccordionContext();

    const disabled = itemDisabled ?? accordion.disabled;
    const isExpanded = accordion.expandedValues.has(value);

    const triggerId = `${accordion.accordionId}-trigger-${value}`;
    const contentId = `${accordion.accordionId}-content-${value}`;
    const descriptionId = ariaDescribedBy ?? `${accordion.accordionId}-desc-${value}`;

    const orderedItems = useMemo(() => {
      const items = Array.from(accordion.expandedValues.keys());
      return items;
    }, [accordion.expandedValues]);
    
    const index = useMemo(() => {
      return orderedItems.indexOf(value) !== -1 
        ? orderedItems.indexOf(value) 
        : accordion.itemCount;
    }, [orderedItems, value, accordion.itemCount]);

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
        descriptionId: ariaDescribedBy ? descriptionId : undefined,
        onToggle,
        index,
      }),
      [value, disabled, isExpanded, triggerId, contentId, descriptionId, ariaDescribedBy, onToggle, index]
    );

    const dataState = isExpanded ? "open" : "closed";

    const Comp = asChild ? Slot : "div";

    const itemClassName = `${accordion.classNames.item ?? ""} ${className ?? ""}`.trim();

    return (
      <AccordionItemContext.Provider value={itemContextValue}>
        <Comp
          ref={ref}
          className={itemClassName || undefined}
          data-state={dataState}
          data-disabled={disabled || undefined}
          data-orientation={accordion.orientation}
          data-value={value}
          data-index={index}
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
