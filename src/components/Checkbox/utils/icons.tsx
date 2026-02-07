export const DefaultCheckIcon = ({ className, size }: { className?: string; size?: number }) => (
  <svg
    className={className}
    style={size ? { width: size, height: size } : undefined}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={3}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

export const DefaultIndeterminateIcon = ({ className, size }: { className?: string; size?: number }) => (
  <svg
    className={className}
    style={size ? { width: size, height: size } : undefined}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={3}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
  </svg>
);
