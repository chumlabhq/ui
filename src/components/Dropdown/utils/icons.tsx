import type { CSSProperties } from "react";

export const ChevronDownIcon = ({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) => (
  <svg
    viewBox="0 0 20 20"
    fill="currentColor"
    width={16}
    height={16}
    className={className}
    style={style}
    aria-hidden="true"
    focusable="false"
  >
    <path
      fillRule="evenodd"
      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
);

export const CheckIcon = ({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) => (
  <svg
    viewBox="0 0 20 20"
    fill="currentColor"
    width={16}
    height={16}
    className={className}
    style={style}
    aria-hidden="true"
    focusable="false"
  >
    <path
      fillRule="evenodd"
      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
      clipRule="evenodd"
    />
  </svg>
);

export const ClearIcon = ({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) => (
  <svg
    viewBox="0 0 20 20"
    fill="currentColor"
    width={14}
    height={14}
    className={className}
    style={style}
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"
    />
  </svg>
);
