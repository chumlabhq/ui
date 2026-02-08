import type { CSSProperties } from "react";

export const ChevronRightIcon = ({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) => (
  <svg viewBox="0 0 20 20" fill="currentColor" className={className} style={style}>
    <path
      fillRule="evenodd"
      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
      clipRule="evenodd"
    />
  </svg>
);

export const EllipsisIcon = ({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) => (
  <svg viewBox="0 0 20 20" fill="currentColor" className={className} style={style}>
    <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
  </svg>
);
