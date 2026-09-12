import { chromium } from "playwright";
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1280, height: 1000 } });
await ctx.addInitScript(([k, v]) => localStorage.setItem(k, v), ["chumlab-theme", "dark"]);
const p = await ctx.newPage();
await p.goto("http://localhost:5173/stepper", { waitUntil: "networkidle" });
const statuses = (title) => p.evaluate((t) => {
  const s = [...document.querySelectorAll("section")].find((x) => x.textContent.includes(t));
  return [...s.querySelectorAll("[data-status]")].filter((e) => e.tagName === "BUTTON" || e.getAttribute("role") === "group")
    .map((e) => `${e.textContent.trim().replace(/\s+/g, " ").slice(0, 12)}=${e.getAttribute("data-status")}`).join(" ");
}, title);
for (const title of ["Full Width", "Per-Step Icon Overrides", "Non-linear Navigation"]) {
  const sec = p.locator("section").filter({ hasText: title }).first();
  await sec.scrollIntoViewIfNeeded();
  await p.waitForTimeout(200);
  console.log(`${title}\n   before: ${await statuses(title)}`);
  const last = sec.locator("button[data-status]").last();
  await last.click({ timeout: 5000 }).catch((e) => console.log("   click failed:", e.message.slice(0, 40)));
  await p.waitForTimeout(300);
  console.log(`   after clicking the last step: ${await statuses(title)}`);
}
await b.close();
