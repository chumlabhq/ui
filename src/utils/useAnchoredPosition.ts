import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { isBrowser } from "./isBrowser.js";
import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect.js";
import {
  computeAnchoredPosition,
  readViewport,
  type AnchoredPosition,
  type AnchoredPositionOptions,
} from "./anchoredPosition.js";

export type {
  AnchoredPosition,
  AnchoredPositionOptions,
  AnchoredSide,
} from "./anchoredPosition.js";

/**
 * Keeps a floating element positioned against its trigger.
 *
 * The one anchored-position implementation. Nine copies of this existed, in
 * eight different states, and the differences were not stylistic: five threw on
 * SSR, four clamped the right edge by the trigger's width so a wider menu hung
 * off screen, five never clamped a negative left at all, and none read the
 * `visualViewport` offsets.
 *
 * Measurement is deliberately in a layout effect and repeated on scroll and
 * resize. Reading the rect in a passive effect gives the browser a frame in
 * which the element is painted at its unpositioned coordinates, which is the
 * flicker the components with `useStablePositionAfterOpen` were hiding.
 */
/**
 * Either shape the call sites already hold the elements in. Three of the nine
 * keep the trigger as state (`triggerElement`) because it is set by a callback
 * ref in a different component; the rest keep a ref. Accepting both keeps the
 * conversion to the positioning itself.
 */
export type AnchorTarget = HTMLElement | null | RefObject<HTMLElement | null>;

const resolve = (target: AnchorTarget): HTMLElement | null =>
  target && "current" in target ? target.current : target;

export function useAnchoredPosition(
  trigger: AnchorTarget,
  floating: AnchorTarget,
  isOpen: boolean,
  options: AnchoredPositionOptions = {},
): AnchoredPosition | null {
  const [position, setPosition] = useState<AnchoredPosition | null>(null);

  const {
    side,
    gap,
    margin,
    forceSide,
    clampOnlyWhenTriggerVisible,
  } = options;

  // Destructured rather than depending on `options`, which callers write as an
  // object literal: a fresh identity every render would re-subscribe the scroll
  // listener on each one.
  const measure = useCallback(() => {
    const triggerEl = resolve(trigger);
    const floatingEl = resolve(floating);
    if (!triggerEl || !floatingEl) return;

    setPosition(
      computeAnchoredPosition(
        triggerEl.getBoundingClientRect(),
        floatingEl.getBoundingClientRect(),
        readViewport(),
        { side, gap, margin, forceSide, clampOnlyWhenTriggerVisible },
      ),
    );
  }, [trigger, floating, side, gap, margin, forceSide, clampOnlyWhenTriggerVisible]);

  // Coalesced to one frame. A capture-phase scroll listener fires for every
  // nested scroller on the way up, and Dropdown was the only copy that batched
  // — the rest recomputed the layout several times per scroll event.
  const frameRef = useRef<number | null>(null);
  const schedule = useCallback(() => {
    if (!isBrowser) return;
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null;
      measure();
    });
  }, [measure]);

  useIsomorphicLayoutEffect(() => {
    if (!isOpen) {
      setPosition(null);
      return;
    }
    measure();
  }, [isOpen, measure]);

  useEffect(() => {
    if (!isOpen || !isBrowser) return;

    // `true` for capture, so a scroll inside any ancestor moves the floating
    // element rather than only a scroll of the document.
    window.addEventListener("scroll", schedule, true);
    window.addEventListener("resize", schedule);
    // The visual viewport moves independently of the layout one; without these
    // the element stays where the layout viewport put it while the keyboard is
    // up.
    // Optional on the method, not just the property: a `visualViewport` that
    // exists without `addEventListener` is a shape jsdom and older Safari both
    // produce, and Dropdown's copy guarded for it.
    window.visualViewport?.addEventListener?.("resize", schedule);
    window.visualViewport?.addEventListener?.("scroll", schedule);

    // The floating element's own size decides where it is allowed to sit, so a
    // menu that grows after its first paint — options arriving from a loader —
    // has to re-anchor. Dropdown watched the trigger; watching both is what
    // makes the wider-than-trigger clamp hold as content changes.
    /**
     * A web font that lands after the surface opens moves the trigger without
     * resizing it, and the `ResizeObserver` below cannot see that: the crumb
     * text ahead of Breadcrumb's ellipsis got 0.55px narrower when Geist
     * replaced the fallback, the trigger slid left, and the menu stayed where
     * the stale rect had put it. It was caught as a visual baseline that could
     * not be reproduced — the recording had a cold font cache and every run
     * since had a warm one — and on a consumer's first paint it is every
     * floating surface in the package sitting beside its trigger rather than
     * against it.
     *
     * `loadingdone` rather than the `ready` promise alone: `ready` resolves
     * once, and a page that loads a second face later gets a second event.
     */
    const fonts: FontFaceSet | undefined = document.fonts;
    fonts?.addEventListener?.("loadingdone", schedule);
    // The one case the event misses: loading finished between the measurement
    // and this subscription.
    void fonts?.ready?.then(schedule);

    const observer =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(schedule);
    const triggerEl = resolve(trigger);
    const floatingEl = resolve(floating);
    if (observer) {
      if (triggerEl) observer.observe(triggerEl);
      if (floatingEl) observer.observe(floatingEl);
    }

    return () => {
      fonts?.removeEventListener?.("loadingdone", schedule);
      window.removeEventListener("scroll", schedule, true);
      window.removeEventListener("resize", schedule);
      window.visualViewport?.removeEventListener?.("resize", schedule);
      window.visualViewport?.removeEventListener?.("scroll", schedule);
      observer?.disconnect();
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [isOpen, schedule, trigger, floating]);

  return position;
}
