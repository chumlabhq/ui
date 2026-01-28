import {
  forwardRef,
  useState,
  useCallback,
  useRef,
  useEffect,
  useId,
} from "react";
import type {
  AccordionProps,
  AccordionItemProps,
  AccordionButtonProps,
  AccordionPanelProps,
} from "./types";
import { ChevronDownIcon } from "./icons";
import AccordionShimmer from "./AccordionShimmer";
import { Button } from "../Button";

const AccordionButton = forwardRef<HTMLButtonElement, AccordionButtonProps>(
  (
    {
      id,
      children,
      isExpanded,
      onClick,
      ariaControls,
      disabled = false,
      expandedIcon,
      collapsedIcon,
      iconPosition = "right",
      buttonClassName = "",
      buttonProps,
      iconClassName = "",
    },
    ref,
  ) => {
    const renderIcon = () => {
      if (expandedIcon && collapsedIcon) {
        return isExpanded ? expandedIcon : collapsedIcon;
      }

      if (expandedIcon && !collapsedIcon) {
        return expandedIcon;
      }

      return (
        <ChevronDownIcon
          className={`transition-transform ${isExpanded ? "rotate-180" : ""} ${iconClassName}`}
        />
      );
    };

    const iconElement = <span className="shrink-0">{renderIcon()}</span>;

    return (
      <div className="w-full" role="heading" aria-level={3}>
        <Button
          ref={ref}
          id={id}
          className={`w-full ${buttonClassName}`}
          contentClassName={`w-full flex items-center ${
            iconPosition === "left" ? "flex-row" : "flex-row justify-between"
          }`}
          onClick={() => !disabled && onClick()}
          aria-expanded={isExpanded}
          aria-controls={ariaControls}
          aria-disabled={disabled}
          disabled={disabled}
          type="button"
          {...buttonProps}
        >
          {iconPosition === "left" && iconElement}
          <span className="flex-1">{children}</span>
          {iconPosition === "right" && iconElement}
        </Button>
      </div>
    );
  },
);

AccordionButton.displayName = "AccordionButton";

// AccordionPanel Component
const AccordionPanel = forwardRef<HTMLDivElement, AccordionPanelProps>(
  (
    {
      children,
      isExpanded,
      id,
      ariaLabelledby,
      panelClassName = "",
      contentClassName = "px-4 py-4",
      animationDuration = 300,
      ...rest
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        id={id}
        className={`grid transition-all ease-in-out ${
          isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        } ${panelClassName}`}
        style={{ transitionDuration: `${animationDuration}ms` }}
        aria-hidden={!isExpanded}
        role="region"
        aria-labelledby={ariaLabelledby}
        {...rest}
      >
        <div className="overflow-hidden">
          <div className={contentClassName}>{children}</div>
        </div>
      </div>
    );
  },
);

AccordionPanel.displayName = "AccordionPanel";

// AccordionItem Component
const AccordionItemComponent = forwardRef<HTMLDivElement, AccordionItemProps>(
  (
    {
      item,
      isExpanded,
      onToggle,
      expandedIcon,
      collapsedIcon,
      iconPosition = "right",
      itemClassName = "",
      buttonClassName = "",
      buttonProps,
      panelClassName = "",
      contentClassName = "px-4 py-4",
      titleClassName = "",
      iconClassName = "",
    },
    ref,
  ) => {
    const generatedId = useId();
    const buttonId = `accordion-button-${item.id}-${generatedId}`;
    const panelId = `accordion-panel-${item.id}-${generatedId}`;

    const handleToggle = () => onToggle(item.id);

    return (
      <div
        ref={ref}
        className={`w-full ${itemClassName}`}
        data-accordion-item
        data-expanded={isExpanded || undefined}
        data-disabled={item.disabled || undefined}
      >
        <AccordionButton
          id={buttonId}
          isExpanded={isExpanded}
          onClick={handleToggle}
          ariaControls={panelId}
          disabled={item.disabled}
          expandedIcon={expandedIcon}
          collapsedIcon={collapsedIcon}
          iconPosition={iconPosition}
          buttonClassName={buttonClassName}
          buttonProps={buttonProps}
          iconClassName={iconClassName}
        >
          <span className={`w-full block ${titleClassName}`}>{item.title}</span>
        </AccordionButton>
        <AccordionPanel
          id={panelId}
          isExpanded={isExpanded}
          ariaLabelledby={buttonId}
          panelClassName={panelClassName}
          contentClassName={contentClassName}
        >
          {item.content}
        </AccordionPanel>
      </div>
    );
  },
);

AccordionItemComponent.displayName = "AccordionItem";

// Main Accordion Component
const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      items,
      allowMultipleExpanded = false,
      allowZeroExpanded = true,
      preExpanded = [],
      onChange,
      isLoading = false,
      shimmerItemCount = 5,
      expandedIcon,
      collapsedIcon,
      iconPosition = "right",
      accordionClassName = "",
      itemClassName = "",
      buttonClassName = "",
      buttonProps,
      panelClassName = "",
      contentClassName = "px-4 py-4",
      titleClassName = "",
      iconClassName = "",
      shimmerClassName = "",
      shimmerItemClassName = "",
      shimmerHeaderClassName = "",
      shimmerTitleClassName = "",
      shimmerIconClassName = "",
      shimmerContentClassName = "",
      shimmerLineClassName = "",
      ...rest
    },
    ref,
  ) => {
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);
    const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
    const lastToggledSectionRef = useRef<string | null>(null);

    const [expandedItems, setExpandedItems] = useState<Set<string>>(
      new Set(preExpanded),
    );

    const findScrollableParent = (element: HTMLElement): HTMLElement | null => {
      let parent = element.parentElement;

      while (parent) {
        const style = window.getComputedStyle(parent);
        const isScrollable =
          style.overflow === "auto" ||
          style.overflow === "scroll" ||
          style.overflowY === "auto" ||
          style.overflowY === "scroll";

        if (isScrollable && parent.scrollHeight > parent.clientHeight) {
          return parent;
        }

        if (parent === document.body || parent === document.documentElement) {
          return parent;
        }

        parent = parent.parentElement;
      }

      return document.documentElement;
    };

    const isElementInView = (
      element: HTMLElement,
      container: HTMLElement,
    ): boolean => {
      const elementRect = element.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      return (
        elementRect.top >= containerRect.top &&
        elementRect.bottom <= containerRect.bottom
      );
    };

    const scrollToElement = useCallback((element: HTMLElement) => {
      if (!scrollContainerRef.current) return;

      const scrollableContainer = findScrollableParent(
        scrollContainerRef.current,
      );
      if (!scrollableContainer) return;

      if (isElementInView(element, scrollableContainer)) {
        return;
      }

      const containerRect = scrollableContainer.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();

      const scrollTop =
        scrollableContainer.scrollTop +
        (elementRect.top - containerRect.top) -
        20;

      scrollableContainer.scrollTo({
        top: Math.max(0, scrollTop),
        behavior: "smooth",
      });
    }, []);

    useEffect(() => {
      const lastToggled = lastToggledSectionRef.current;
      if (lastToggled && expandedItems.has(lastToggled)) {
        const sectionElement = sectionRefs.current[lastToggled];
        if (sectionElement) {
          const timeoutId = setTimeout(() => {
            scrollToElement(sectionElement);
            lastToggledSectionRef.current = null;
          }, 150);
          return () => clearTimeout(timeoutId);
        }
      }
    }, [expandedItems, scrollToElement]);

    const handleToggle = useCallback(
      (id: string) => {
        const item = items?.find((i) => i.id === id);

        if (item?.disabled) return;

        setExpandedItems((prev) => {
          const newExpanded = new Set(prev);

          if (newExpanded.has(id)) {
            if (allowZeroExpanded || newExpanded.size > 1) {
              newExpanded.delete(id);
            }
          } else {
            if (!allowMultipleExpanded) {
              newExpanded.clear();
            }
            newExpanded.add(id);
            lastToggledSectionRef.current = id;
          }

          const expandedArray = Array.from(newExpanded);
          onChange?.(expandedArray);
          return newExpanded;
        });
      },
      [allowMultipleExpanded, allowZeroExpanded, onChange, items],
    );

    const combinedRef = useCallback(
      (node: HTMLDivElement | null) => {
        scrollContainerRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref],
    );

    if (isLoading) {
      return (
        <AccordionShimmer
          className={shimmerClassName || accordionClassName}
          itemCount={shimmerItemCount}
          itemClassName={shimmerItemClassName}
          headerClassName={shimmerHeaderClassName}
          titleClassName={shimmerTitleClassName}
          iconClassName={shimmerIconClassName}
          contentClassName={shimmerContentClassName}
          lineClassName={shimmerLineClassName}
        />
      );
    }

    return (
      <div
        ref={combinedRef}
        className={`w-full flex flex-col ${accordionClassName}`}
        role="region"
        aria-label="Accordion"
        {...rest}
      >
        {items.map((item) => (
          <AccordionItemComponent
            key={item.id}
            item={item}
            isExpanded={expandedItems.has(item.id)}
            onToggle={handleToggle}
            expandedIcon={expandedIcon}
            collapsedIcon={collapsedIcon}
            iconPosition={iconPosition}
            itemClassName={itemClassName}
            buttonClassName={buttonClassName}
            buttonProps={buttonProps}
            panelClassName={panelClassName}
            contentClassName={contentClassName}
            titleClassName={titleClassName}
            iconClassName={iconClassName}
            ref={(el) => {
              sectionRefs.current[item.id] = el;
            }}
          />
        ))}
      </div>
    );
  },
);

Accordion.displayName = "Accordion";

export default Accordion;
export {
  AccordionButton,
  AccordionPanel,
  AccordionItemComponent as AccordionItem,
  AccordionShimmer,
};
