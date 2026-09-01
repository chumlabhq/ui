import type { Page } from "@playwright/test";

/**
 * Counts click events reaching the document.
 *
 * Lets an "activate on Enter" test assert activation rather than only that
 * `keyboard.press` did not throw — which it cannot, whatever the control does.
 */
export async function watchClicks(page: Page) {
  await page.evaluate(() => {
    (window as unknown as { __clicks: number }).__clicks = 0;
    document.addEventListener(
      "click",
      () => {
        (window as unknown as { __clicks: number }).__clicks += 1;
      },
      true,
    );
  });
  return () =>
    page.evaluate(() => (window as unknown as { __clicks: number }).__clicks);
}
