import { useEffect, useRef } from "react";

/**
 * Warns, in development only, when a form control mounts with no accessible name.
 *
 * A library cannot force a consumer to label a control, and these components
 * are right to render without one — `<Input />` with an external `<label for>`
 * is legitimate. What it should not do is ship a control that is invisible to a
 * screen reader in silence.
 *
 * The full-fixture axe sweep found 18 such nodes across Checkbox, Input and
 * TextArea (E2E-TRIAGE.md Appendix K). Two of them reported under
 * `label-title-only` rather than `label`, purely because a `showCount` counter
 * adds `aria-describedby` — a description is not a name, and axe says so under
 * a rule whose message mentions `title`. Same defect, one warning.
 *
 * `title` is checked separately because it is the one attribute that looks like
 * a fix and is not: screen readers expose it inconsistently, and axe faults it
 * on its own.
 *
 * Guarded by `process.env.NODE_ENV`, which the library build leaves for the
 * consumer's bundler: the branch and the strings stay in their development
 * build and are dropped from their production one.
 */
export interface AccessibleNameSources {
  /** The component's own `label` prop. */
  label?: unknown;
  "aria-label"?: unknown;
  "aria-labelledby"?: unknown;
  title?: unknown;
}

export function useAccessibleNameWarning(
  component: string,
  sources: AccessibleNameSources,
): void {
  const present = (v: unknown) => v != null && v !== "";
  const named =
    present(sources.label) ||
    present(sources["aria-label"]) ||
    present(sources["aria-labelledby"]);
  const hasTitle = present(sources.title);

  // One warning per instance, not per render. The ref is read inside the
  // effect, never during render — react-hooks/refs forbids the latter.
  const warned = useRef(false);

  useEffect(() => {
    if (process.env.NODE_ENV === "production" || named || warned.current) return;
    warned.current = true;
    console.warn(
      `${component}: rendered with no accessible name. Pass \`label\`, ` +
        `\`aria-label\`, or \`aria-labelledby\` — or associate an external ` +
        `<label for>, in which case this warning is a false positive.` +
        (hasTitle
          ? ` A \`title\` is present, and it is not a substitute: screen readers ` +
            `expose it inconsistently and axe reports it as \`label-title-only\`.`
          : ""),
    );
  }, [component, named, hasTitle]);
}
