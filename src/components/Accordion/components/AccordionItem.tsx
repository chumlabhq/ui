import { forwardRef, useMemo } from "react";
import { useAccordionContext, AccordionItemContext } from "../utils/context";
import { Slot } from "../utils/slot";
import type { AccordionItemProps, AccordionItemContextValue } from "../utils/types";

const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ value, disabled: itemDisabled, children, className, asChild = false, ...rest }, ref) => {
    const accordion = useAccordionContext();

    const disabled = itemDisabled ?? accordion.disabled;
    const isExpanded = accordion.expandedValues.has(value);

    const triggerId = `${accordion.accordionId}-trigger-${value}`;
    const contentId = `${accordion.accordionId}-content-${value}`;

    const itemContextValue: AccordionItemContextValue = useMemo(
      () => ({
        value,
        disabled,
        isExpanded,
        triggerId,
        contentId,
      }),
      [value, disabled, isExpanded, triggerId, contentId]
    );

    const dataState = isExpanded ? "open" : "closed";

    const Comp = asChild ? Slot : "div";

    return (
      <AccordionItemContext.Provider value={itemContextValue}>
        <Comp
          ref={ref}
          className={`${accordion.classNames.item ?? ""} ${className ?? ""}`.trim()}
          data-state={dataState}
          data-disabled={disabled || undefined}
          data-orientation={accordion.orientation}
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
