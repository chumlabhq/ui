export function CheckIcon({ className, size }: { className?: string; size?: number }) {
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

CheckIcon.displayName = "CheckIcon";

export function IndeterminateIcon({ className, size }: { className?: string; size?: number }) {
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

IndeterminateIcon.displayName = "IndeterminateIcon";
