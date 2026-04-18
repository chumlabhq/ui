/**
 * Chumlab brand logo — uses logo-light.png image asset.
 */

import logoLight from "../assets/images/logo-light.png";
import logoDark from "../assets/images/logo-dark.png";

interface LogoMarkProps {
  size?: number;
  className?: string;
  /** Use "light" logo (for dark backgrounds) or "dark" logo (for light backgrounds). Default: "light" */
  variant?: "light" | "dark";
}

/**
 * Renders the Chumlab logo mark as an image element.
 *
 * @param size - Width in pixels (height auto-scales). Default: 32
 * @param className - Additional CSS classes for the `<img>` element
 * @param variant - "light" for dark backgrounds, "dark" for light backgrounds
 */
export const LogoMark = ({ size = 32, className = "", variant = "light" }: LogoMarkProps) => (
  <img
    src={variant === "dark" ? logoDark : logoLight}
    alt="Chumlab"
    width={size}
    className={className}
    style={{ width: size, height: "auto", objectFit: "contain" }}
  />
);

interface LogoWordmarkProps {
  className?: string;
}

/**
 * Renders the Chumlab brand name as styled text ("chum" bold + "lab" lighter).
 * Requires the Space Grotesk font family.
 *
 * @param className - Additional CSS classes for the outer `<span>`
 */
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

/**
 * Renders the full Chumlab logo — mark image alongside the wordmark text.
 *
 * @param size - Size in pixels passed to the inner LogoMark (default: 28)
 * @param className - Additional CSS classes for the outer wrapper `<span>`
 * @param textClassName - Additional CSS classes passed to the inner LogoWordmark
 */
export const LogoFull = ({ size = 28, className = "", textClassName = "" }: LogoFullProps) => (
  <span className={`inline-flex items-center gap-2.5 ${className}`}>
    <LogoMark size={size} />
    <LogoWordmark className={textClassName} />
  </span>
);

LogoMark.displayName = "LogoMark";
LogoWordmark.displayName = "LogoWordmark";
LogoFull.displayName = "LogoFull";
