import type { Frame, Page } from "@playwright/test";

/**
 * Resolves once nothing on the page is moving: every finite animation and
 * transition has ended and stayed ended for 150 ms, three polls.
 *
 * For the wait after an action whose result is a motion, where a fixed delay
 * guesses at the motion's length and a loaded machine outruns the guess. The
 * rule is `gotoFixture`'s, for the same reasons (see `_nav.ts`): polled on an
 * interval because frames have stalled under load, held because a transition
 * starts a frame after the action, and one that would outlast the wait (a loop,
 * a toast's countdown) is the page's resting state, not a motion to wait for.
 */
export async function motionEnded(page: Page | Frame): Promise<void> {
  await page.evaluate(() => {
    delete (window as unknown as { motionHeldSince?: number }).motionHeldSince;
  });
  await page.waitForFunction(
    () => {
      const held = window as unknown as { motionHeldSince?: number };
      const still = document.getAnimations().every((a) => {
        const timing = a.effect?.getComputedTiming();
        return a.playState !== "running" || !timing || Number(timing.endTime) - Number(timing.localTime ?? 0) > 10000;
      });
      if (!still) {
        held.motionHeldSince = undefined;
        return false;
      }
      held.motionHeldSince ??= performance.now();
      return performance.now() - held.motionHeldSince >= 150;
    },
    undefined,
    { timeout: 10000, polling: 50 },
  );
}
