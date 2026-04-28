/**
 * Chumlab brand logo. The mark is the monkey-with-goggles PNG; the wordmark
 * is "Chumlab" in Inter 500 with tight letter-spacing. Color is inherited.
 */

import logoLight from "../assets/images/logo-light.png";
import logoDark from "../assets/images/logo-dark.png";

interface LogoMarkProps {
  size?: number;
  className?: string;
  /** "light" for dark surfaces (default), "dark" for cream/light surfaces. */
  variant?: "light" | "dark";
}

export const LogoMark = ({
  size = 32,
  className = "",
  variant = "light",
}: LogoMarkProps) => (
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
 * "Chumlab" wordmark in Inter 500 with tight letter-spacing. Inherits color
 * from the parent so it works on any surface.
 */
export const LogoWordmark = ({ className = "" }: LogoWordmarkProps) => (
  <span
    className={`font-sans font-medium leading-none ${className}`}
    style={{ fontSize: "1em", letterSpacing: "-0.02em" }}
  >
    Chumlab
  </span>
);

interface LogoFullProps {
  size?: number;
  className?: string;
  textClassName?: string;
  variant?: "light" | "dark";
}

export const LogoFull = ({
  size = 28,
  className = "",
  textClassName = "",
  variant = "light",
}: LogoFullProps) => (
  <span className={`inline-flex items-center gap-2.5 ${className}`}>
    <LogoMark size={size} variant={variant} />
    <LogoWordmark className={textClassName} />
  </span>
);

LogoMark.displayName = "LogoMark";
LogoWordmark.displayName = "LogoWordmark";
LogoFull.displayName = "LogoFull";
