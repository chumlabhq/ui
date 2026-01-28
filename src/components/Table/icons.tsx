interface IconProps {
  className?: string;
}

export function ChevronDownIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function ChevronLeftIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function ChevronRightIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function PinIcon({ className = "" }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 18 18"
      className={className}
      aria-hidden="true"
    >
      <g clipPath="url(#clip0_3995_33713)">
        <path
          fill="currentColor"
          d="M14.702 8.39a1.244 1.244 0 0 1-1.654.319c-.146-.097-.146-.094-.306.069-.788.798-1.004 1.012-1.66 1.662l-.295.294c-.046.043-.054.041-.019.09.837 1.26.305 2.67-.474 3.571-.396.426-.807.433-1.223.05-.723-.726-1.256-1.243-2.042-2.05-.075-.066-.042-.078-.143 0q-.927.758-1.858 1.51l-1.124.909a.68.68 0 0 1-.427.188.47.47 0 0 1-.332-.148c-.3-.293-.078-.6.019-.731.772-1.057 1.524-2.11 2.312-3.166.057-.08.048-.06-.021-.133A362 362 0 0 1 3.61 8.98c-.453-.448-.427-.902.056-1.321.905-.79 2.456-1.201 3.541-.41l.022.015c.935-.944 1.334-1.343 2.151-2.153a1.328 1.328 0 0 1 2.006-1.727A421 421 0 0 1 14.63 6.63a1.313 1.313 0 0 1 .071 1.76"
        />
      </g>
      <defs>
        <clipPath id="clip0_3995_33713">
          <path fill="#fff" d="M0 0h18v18H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}
