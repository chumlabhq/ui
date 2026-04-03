/**
 * Chumlab brand logo — blue tone palette.
 *
 * Icon: A vortex/spiral — three arcs spinning inward.
 * Wordmark: "chumlab" in Space Grotesk.
 */

import { useId } from "react";

interface LogoMarkProps {
  size?: number;
  className?: string;
}

export const LogoMark = ({ size = 32, className = "" }: LogoMarkProps) => {
  const uid = useId().replace(/:/g, "");
  const idA = `cl${uid}a`;
  const idB = `cl${uid}b`;
  const idC = `cl${uid}c`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      className={className}
      aria-label="Chumlab"
    >
      <defs>
        <linearGradient id={idA} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
        <linearGradient id={idB} x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
        <linearGradient id={idC} x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#60a5fa" />
        </linearGradient>
      </defs>

      {/* Three spiral arms */}
      <path d="M 18 4 A 14 14 0 0 1 30 12" stroke={`url(#${idA})`} strokeWidth="3" strokeLinecap="round" />
      <path d="M 30 24 A 14 14 0 0 1 12 31" stroke={`url(#${idB})`} strokeWidth="3" strokeLinecap="round" />
      <path d="M 6 12 A 14 14 0 0 1 18 4" stroke={`url(#${idC})`} strokeWidth="3" strokeLinecap="round" opacity="0.75" />

      {/* Inner swirl */}
      <path d="M 18 11 A 7 7 0 0 1 25 18" stroke={`url(#${idA})`} strokeWidth="2.2" strokeLinecap="round" opacity="0.55" />
      <path d="M 25 18 A 7 7 0 0 1 18 25" stroke={`url(#${idB})`} strokeWidth="2.2" strokeLinecap="round" opacity="0.45" />
      <path d="M 18 25 A 7 7 0 0 1 11 18" stroke={`url(#${idC})`} strokeWidth="2.2" strokeLinecap="round" opacity="0.35" />

      {/* Center dot */}
      <circle cx="18" cy="18" r="2.2" fill={`url(#${idA})`} opacity="0.85" />
    </svg>
  );
};

interface LogoWordmarkProps {
  className?: string;
}

export const LogoWordmark = ({ className = "" }: LogoWordmarkProps) => (
  <span
    className={`inline-flex items-baseline gap-[0.15em] ${className}`}
    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
  >
    <span className="font-bold tracking-[-0.01em]">chum</span>
    <span className="font-normal tracking-[0.04em] opacity-50">lab</span>
  </span>
);

interface LogoFullProps {
  size?: number;
  className?: string;
  textClassName?: string;
}

export const LogoFull = ({ size = 28, className = "", textClassName = "" }: LogoFullProps) => (
  <span className={`inline-flex items-center gap-2.5 ${className}`}>
    <LogoMark size={size} />
    <LogoWordmark className={textClassName} />
  </span>
);
