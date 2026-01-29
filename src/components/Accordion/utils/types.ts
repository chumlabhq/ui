import type { HTMLAttributes, ReactNode, FocusEvent } from "react";

export type AccordionType = "single" | "multiple";
export type Orientation = "vertical" | "horizontal";
export type Direction = "ltr" | "rtl";
export type DataState = "open" | "closed";

export interface AnimationCallbacks {
  onOpenStart?: () => void;
  onOpenEnd?: () => void;
  onCloseStart?: () => void;
  onCloseEnd?: () => void;
}

export interface AccordionClassNames {
  root?: string;
  item?: string;
  trigger?: string;
  content?: string;
  icon?: string;
}

interface AccordionBaseProps extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange" | "dir"> {
  orientation?: Orientation;
  dir?: Direction;
  disabled?: boolean;
  loop?: boolean;
  classNames?: AccordionClassNames;
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  children: ReactNode;
  asChild?: boolean;
  onFocusCapture?: (event: FocusEvent<HTMLDivElement>) => void;
  onBlurCapture?: (event: FocusEvent<HTMLDivElement>) => void;
}

export interface AccordionSingleProps extends AccordionBaseProps {
  type: "single";
  collapsible?: boolean;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

export interface AccordionMultipleProps extends AccordionBaseProps {
  type: "multiple";
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
}

export type AccordionProps = AccordionSingleProps | AccordionMultipleProps;

export interface AccordionItemProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
  disabled?: boolean;
  children: ReactNode;
  asChild?: boolean;
}

export interface AccordionTriggerProps extends Omit<HTMLAttributes<HTMLButtonElement>, "onClick"> {
  children: ReactNode;
  expandedIcon?: ReactNode;
  collapsedIcon?: ReactNode;
  iconPosition?: "left" | "right" | "none";
  asChild?: boolean;
}

export interface AccordionContentProps extends HTMLAttributes<HTMLDivElement>, AnimationCallbacks {
  children: ReactNode;
  forceMount?: boolean;
  animationDuration?: number;
  asChild?: boolean;
}

export interface AccordionContextValue {
  type: AccordionType;
  orientation: Orientation;
  dir: Direction;
  disabled: boolean;
  collapsible: boolean;
  loop: boolean;
  classNames: AccordionClassNames;
  headingLevel: 1 | 2 | 3 | 4 | 5 | 6;
  expandedValues: Set<string>;
  toggleItem: (value: string) => void;
  registerItem: (value: string, element: HTMLButtonElement | null) => void;
  unregisterItem: (value: string) => void;
  focusItem: (direction: "next" | "prev" | "first" | "last") => void;
  accordionId: string;
}

export interface AccordionItemContextValue {
  value: string;
  disabled: boolean;
  isExpanded: boolean;
  triggerId: string;
  contentId: string;
}
