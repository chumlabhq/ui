import { useEffect, useRef } from "react";

/** The two fields the check reads, so this module need not import the component's types. */
interface LazyOption {
  hasChildren?: boolean;
  children?: readonly LazyOption[];
}

/**
 * Warns, in development only, when CascadingDropdown's `onLoadChildren` is set
 * but no option declares `hasChildren`, so the loader can never fire.
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
 * The caller passes its raw props, and the tree walk and the message both live
 * inside the guarded effect. Passed in as a computed flag and a message string,
 * they were arguments — which a consumer's bundler cannot drop, however empty
 * it makes this body — so the message and the walk shipped in every production
 * build that rendered the component.
 *
 * Guarded by `process.env.NODE_ENV`, which the library build leaves for the
 * consumer's bundler: the branch and the strings stay in their development
 * build and are dropped from their production one.
 */
export function useInertPropWarning(loader: unknown, options: readonly LazyOption[]): void {
  // One warning per instance, not per render. The ref is read inside the
  // effect, never during render — react-hooks/refs forbids the latter.
  const warned = useRef(false);

  useEffect(() => {
    if (process.env.NODE_ENV === "production" || !loader || warned.current) return;
    const declaresChildren = (list: readonly LazyOption[]): boolean =>
      list.some((o) => o.hasChildren || (o.children ? declaresChildren(o.children) : false));
    if (declaresChildren(options)) return;
    warned.current = true;
    console.warn(
      "CascadingDropdown: `onLoadChildren` is set, but no option has `hasChildren: true`. " +
        "Children are loaded only for options that declare they have some, so the loader " +
        "will never fire.",
    );
  }, [loader, options]);
}
