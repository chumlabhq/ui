export function DefaultCheckIcon({ className, size }: { className?: string; size?: number }) {
  return (
    <svg
      className={className}
      style={size ? { width: size, height: size } : undefined}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={3}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

DefaultCheckIcon.displayName = "DefaultCheckIcon";

export function DefaultIndeterminateIcon({ className, size }: { className?: string; size?: number }) {
  return (
    <svg
      className={className}
      style={size ? { width: size, height: size } : undefined}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={3}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
    </svg>
  );
}

DefaultIndeterminateIcon.displayName = "DefaultIndeterminateIcon";
