/**
 * Churn Lab brand logo.
 *
 * Icon: A vortex/spiral — three arcs spinning inward,
 * representing continuous motion and transformation.
 *
 * Wordmark: "churn lab" in Space Grotesk — geometric, techy, modern.
 */

interface LogoMarkProps {
  size?: number;
  className?: string;
}

export const LogoMark = ({ size = 32, className = "" }: LogoMarkProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 36 36"
    fill="none"
    className={className}
    aria-label="Churn Lab"
  >
    <defs>
      <linearGradient id="cl-a" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#c084fc" />
        <stop offset="100%" stopColor="#e879f9" />
      </linearGradient>
      <linearGradient id="cl-b" x1="100%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#818cf8" />
        <stop offset="100%" stopColor="#c084fc" />
      </linearGradient>
      <linearGradient id="cl-c" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#f472b6" />
        <stop offset="100%" stopColor="#c084fc" />
      </linearGradient>
    </defs>

    {/* Three spiral arms */}
    <path d="M 18 4 A 14 14 0 0 1 30 12" stroke="url(#cl-a)" strokeWidth="2.8" strokeLinecap="round" />
    <path d="M 30 24 A 14 14 0 0 1 12 31" stroke="url(#cl-b)" strokeWidth="2.8" strokeLinecap="round" />
    <path d="M 6 12 A 14 14 0 0 1 18 4" stroke="url(#cl-c)" strokeWidth="2.8" strokeLinecap="round" opacity="0.7" />

    {/* Inner swirl */}
    <path d="M 18 11 A 7 7 0 0 1 25 18" stroke="url(#cl-a)" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
    <path d="M 25 18 A 7 7 0 0 1 18 25" stroke="url(#cl-b)" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
    <path d="M 18 25 A 7 7 0 0 1 11 18" stroke="url(#cl-c)" strokeWidth="2" strokeLinecap="round" opacity="0.3" />

    {/* Center dot */}
    <circle cx="18" cy="18" r="2" fill="url(#cl-a)" opacity="0.8" />
  </svg>
);

interface LogoWordmarkProps {
  className?: string;
}

export const LogoWordmark = ({ className = "" }: LogoWordmarkProps) => (
  <span
    className={`inline-flex items-baseline gap-[0.15em] ${className}`}
    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
  >
    <span className="font-bold tracking-[-0.01em]">churn</span>
    <span className="font-normal tracking-[0.04em] opacity-40">lab</span>
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
