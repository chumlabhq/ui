import type { HTMLAttributes, ReactNode } from "react";
import type { ButtonProps } from "../Button/types";

export interface AccordionItem {
  id: string;
  title: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}

export interface AccordionProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "onChange"
> {
  items: AccordionItem[];
  allowMultipleExpanded?: boolean;
  allowZeroExpanded?: boolean;
  preExpanded?: string[];
  onChange?: (expandedIds: string[]) => void;
  isLoading?: boolean;
  shimmerItemCount?: number;
  expandedIcon?: ReactNode;
  collapsedIcon?: ReactNode;
  iconPosition?: "left" | "right";
  accordionClassName?: string;
  itemClassName?: string;
  buttonClassName?: string;
  buttonProps?: Omit<ButtonProps, "onClick" | "disabled" | "className">;
  panelClassName?: string;
  contentClassName?: string;
  titleClassName?: string;
  iconClassName?: string;
  shimmerClassName?: string;
  shimmerItemClassName?: string;
  shimmerHeaderClassName?: string;
  shimmerTitleClassName?: string;
  shimmerIconClassName?: string;
  shimmerContentClassName?: string;
  shimmerLineClassName?: string;
}

export interface AccordionItemProps {
  item: AccordionItem;
  isExpanded: boolean;
  onToggle: (id: string) => void;
  expandedIcon?: ReactNode;
  collapsedIcon?: ReactNode;
  iconPosition?: "left" | "right";
  itemClassName?: string;
  buttonClassName?: string;
  buttonProps?: Omit<ButtonProps, "onClick" | "disabled" | "className">;
  panelClassName?: string;
  contentClassName?: string;
  titleClassName?: string;
  iconClassName?: string;
}

export interface AccordionButtonProps {
  id?: string;
  children: ReactNode;
  isExpanded: boolean;
  onClick: () => void;
  ariaControls: string;
  disabled?: boolean;
  expandedIcon?: ReactNode;
  collapsedIcon?: ReactNode;
  iconPosition?: "left" | "right";
  buttonClassName?: string;
  buttonProps?: Omit<ButtonProps, "onClick" | "disabled" | "className">;
  iconClassName?: string;
}

export interface AccordionPanelProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  isExpanded: boolean;
  id: string;
  ariaLabelledby: string;
  panelClassName?: string;
  contentClassName?: string;
  animationDuration?: number;
}

export interface AccordionShimmerProps {
  className?: string;
  itemCount?: number;
  showExpandedItems?: number;
  itemClassName?: string;
  headerClassName?: string;
  titleClassName?: string;
  iconClassName?: string;
  contentClassName?: string;
  lineClassName?: string;
}
