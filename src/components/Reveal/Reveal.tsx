import {
  createElement,
  useEffect,
  useState,
  type AnchorHTMLAttributes,
  type CSSProperties,
  type ElementType,
  type ReactNode,
  type TransitionEvent,
} from "react";

const EASING = "cubic-bezier(0.32, 0.72, 0.24, 1)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function shouldStartVisible(): boolean {
  if (typeof window === "undefined") return false;
  if (
    typeof window.matchMedia === "function" &&
    window.matchMedia(REDUCED_MOTION_QUERY).matches
  ) {
    return true;
  }
  if (typeof IntersectionObserver === "undefined") return true;
  return false;
}

interface RevealOwnProps {
  /** Delay before the entry transition starts, in ms. */
  delay?: number;
  /** Initial vertical offset in px. Final state translates back to 0. */
  translateY?: number;
  /** Initial horizontal offset in px. Final state translates back to 0. */
  translateX?: number;
  /** Transition duration, in ms. */
  duration?: number;
  /** Initial scale. Final state scales back to 1. */
  scale?: number;
  /** Element / component to render as. Defaults to "div". */
  as?: ElementType;
  className?: string;
  children?: ReactNode;
}

// AnchorHTMLAttributes is a superset of HTMLAttributes plus anchor-specific
// attributes (href, target, rel, …) — Reveal forwards any of these through
// the ...rest spread when rendered as <a>.
export type RevealProps = RevealOwnProps &
  Omit<AnchorHTMLAttributes<HTMLElement>, keyof RevealOwnProps>;

export default function Reveal({
  delay = 0,
  translateY = 12,
  translateX = 0,
  duration = 600,
  scale = 1,
  as: Tag = "div",
  className,
  style,
  children,
  ...rest
}: RevealProps) {
  // Callback ref captures the mounted DOM node into state. Using state
  // (instead of a useRef object) sidesteps the react-hooks/refs lint rule
  // that fires when a ref object is passed through createElement.
  const [node, setNode] = useState<HTMLElement | null>(null);

  // Initial visible state captures the "no animation needed" cases at mount
  // time so the effect below can be a pure observer-setup with no setState
  // branches in its body (which would trip react-hooks/set-state-in-effect).
  const [visible, setVisible] = useState<boolean>(shouldStartVisible);

  // Once the transform transition completes, drop the inline transform so the
  // element no longer creates a GPU compositing layer. A lingering identity
  // transform (translate3d(0,0,0) scale(1)) renders pixels through a separate
  // layer, which can paint identical bg colors a hair differently from
  // non-composited siblings (visible as a seam against the footer). When
  // reduced-motion or no IO support means we're visible at mount, settle
  // immediately so we never create the layer in the first place.
  const [settled, setSettled] = useState<boolean>(shouldStartVisible);

  useEffect(() => {
    if (visible) return;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [node, visible]);

  // When the caller passes 0/0/1, there's nothing to translate or scale —
  // skip the transform entirely so we never promote the element to a GPU
  // compositor layer in the first place. Without this branch, an identity
  // transform like translate3d(0,0,0) scale(1) is technically applied,
  // creates a stacking context, and paints solid bg colors a hair
  // differently than non-composited siblings — the seam the user reported
  // between the blog listing and the footer (which uses translateY=0).
  const isIdentityTransform =
    translateX === 0 && translateY === 0 && scale === 1;
  const initialTransform = `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`;
  const finalTransform = "translate3d(0, 0, 0) scale(1)";

  const mergedStyle: CSSProperties = settled
    ? { ...style }
    : isIdentityTransform
      ? {
          opacity: visible ? 1 : 0,
          transition: `opacity ${duration}ms ${EASING} ${delay}ms`,
          willChange: visible ? undefined : "opacity",
          ...style,
        }
      : {
          opacity: visible ? 1 : 0,
          transform: visible ? finalTransform : initialTransform,
          transition: `opacity ${duration}ms ${EASING} ${delay}ms, transform ${duration}ms ${EASING} ${delay}ms`,
          willChange: visible ? undefined : "opacity, transform",
          ...style,
        };

  const handleTransitionEnd = (e: TransitionEvent<HTMLElement>) => {
    if (e.target !== e.currentTarget) return;
    // Identity-transform Reveals only run an opacity transition, so we
    // can't only listen for transform — we'd never settle. Either ending
    // is enough; both fire at the same time anyway when both transition.
    if (e.propertyName !== "transform" && e.propertyName !== "opacity") return;
    if (!visible) return;
    setSettled(true);
  };

  return createElement(
    Tag,
    {
      ref: setNode,
      className,
      style: mergedStyle,
      onTransitionEnd: settled ? undefined : handleTransitionEnd,
      ...rest,
    },
    children,
  );
}
