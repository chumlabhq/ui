import type { ReactNode } from "react";

export interface SwitchProps {
  label?: ReactNode;
  description?: ReactNode;
  isChecked?: boolean;
  handleToggle?: () => void;
  id?: string;
  disabled?: boolean;
  containerClassName?: string;
  labelContainerClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  trackerClassName?: string;
  thumbClassName?: string;
  checkedTrackerClassName?: string;
  uncheckedTrackerClassName?: string;
  checkedThumbClassName?: string;
  uncheckedThumbClassName?: string;
  checkedIcon?: ReactNode;
  uncheckedIcon?: ReactNode;
}
