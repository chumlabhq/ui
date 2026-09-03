import { useEffect, useRef } from "react";

/**
 * Warns, in development only, when a prop is set but the state that would make
 * it do anything never occurs.
 *
 * The prop-union work removed every combination this library could express in
 * the type system: a prop that is inert because of another *prop* now fails to
 * typecheck. What a union cannot reach is a prop made inert by the *data* — a
 * loader keyed off a flag the consumer's own option objects never set. There is
 * nothing to check at compile time and nothing visibly broken at runtime; the
 * loader simply never fires, which is indistinguishable from a slow server.
 *
 * Silence is the defect. This says so once per instance.
 *
 * Guarded by `import.meta.env.DEV`, so the branch and the strings are dropped
 * from a production build.
 */
export function useInertPropWarning(
  component: string,
  inert: boolean,
  message: string,
): void {
  // One warning per instance, not per render. The ref is read inside the
  // effect, never during render — react-hooks/refs forbids the latter.
  const warned = useRef(false);

  useEffect(() => {
    if (!import.meta.env.DEV || !inert || warned.current) return;
    warned.current = true;
    console.warn(`${component}: ${message}`);
  }, [component, inert, message]);
}
