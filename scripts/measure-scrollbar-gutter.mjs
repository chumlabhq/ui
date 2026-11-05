/**
 * Prints the classic-scrollbar gutter Firefox reserves on a page that scrolls,
 * under one named combination of Windows' setting and Firefox's prefs. Only says
 * what it measured: the scroll-lock test's own floor is what fails the job.
 *
 *   node scripts/measure-scrollbar-gutter.mjs none|prefs-only|registry-only|both
 */
import { firefox } from "@playwright/test";

const combination = process.argv[2] ?? "none";
const withPrefs = combination === "prefs-only" || combination === "both";
const browser = await firefox.launch({
  firefoxUserPrefs: withPrefs ? { "widget.windows.overlay-scrollbars.enabled": false, "ui.useOverlayScrollbars": 0 } : {},
});
for (const dir of ["ltr", "rtl"]) {
  const page = await browser.newPage();
  await page.setContent(`<!doctype html><html dir="${dir}"><body style="margin:0"><div style="height:3000px"></div></body></html>`);
  const gutter = await page.evaluate(() => window.innerWidth - document.documentElement.clientWidth);
  console.log(`SCROLLBAR_GUTTER ${process.platform} ${combination} ${dir} gutter=${gutter}`);
  await page.close();
}
await browser.close();
