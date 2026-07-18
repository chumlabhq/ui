import type { MouseEvent, ReactNode } from "react";
import { Button } from "../../../components/Button";
import { cn } from "../../../utils/cn";

type Variant = "primary" | "secondary" | "ghost";

// Dogfoods the published @chumlab/ui Button (structural: padding, focus ring,
// disabled) and applies the playground's accent recipes via className — the
// intended styling path for the library primitive.
const RECIPES: Record<Variant, string> = {
  primary:
    "bg-[color:var(--accent)] text-[color:var(--bg-base)] font-medium hover:bg-[#7eb1ff] disabled:opacity-45",
  secondary:
    "bg-[color:var(--bg-elevated)] text-[color:var(--text-primary)] border border-[color:var(--border-soft)] hover:border-[color:var(--border-active)]",
  ghost:
    "bg-transparent text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]",
};

interface PgButtonProps {
  variant?: Variant;
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  children: ReactNode;
}

export default function PgButton({
  variant = "primary",
  className,
  children,
  ...props
}: PgButtonProps) {
  return (
    <Button className={cn(RECIPES[variant], className)} {...props}>
      {children}
    </Button>
  );
}
