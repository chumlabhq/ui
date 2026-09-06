import { test, expect } from "@playwright/test";
import { gotoFixture } from "./_nav";

/**
 * The browser-tier re-attempt ADR 002 R8 asks for before a key is deleted.
 *
 * `fixtures.contract` decides reachability in jsdom, which cannot hover, cannot
 * double-click and implements no pointer capture — and every key in
 * `002-unrenderable-keys.json` was waived from there. That record has been
 * wrong before: `Table.input` was recorded ATTEMPTED, still unreachable and a
 * real double-click opens the editor.
 *
 * So each surviving waived key is driven here, in a real browser, through the
 * interaction its state needs, with `?classes={...}` putting a sentinel on the
 * key. The sentinel in the DOM is the whole assertion: it means a consumer's
 * value reached the element, which is the only thing the key promises.
 */
test.describe("waived classes keys, re-attempted", () => {
  test("Table.input — a real double-click puts the consumer's class on the editor", async ({
    page,
  }) => {
    await gotoFixture(page, "Table", "editing-cell", { classes: { input: "ovr-input" } });

    const cell = page.locator("[data-fixture] tbody td").first();
    await expect(page.locator(".ovr-input")).toHaveCount(0);
    await cell.dblclick();

    await expect(
      page.locator("[data-fixture] tbody input.ovr-input"),
      "the editor opened but `classes.input` did not reach it",
    ).toHaveCount(1);
  });

  test("DatePicker.markerTooltip — a real hover opens the tooltip and the class is not on it", async ({
    page,
  }) => {
    await gotoFixture(page, "DatePicker", "marker-tooltip", {
      classes: { markerTooltip: "ovr-marker-tooltip" },
    });

    const marked = page.locator("[data-marked]").first();
    await marked.hover();
    const tooltip = page.locator('[role="tooltip"]');
    await expect(tooltip, "the hover did not open the marker tooltip").toHaveCount(1);

    // The re-attempt's finding, asserted rather than asserted-away: the tooltip
    // renders, and the key cannot style it. `useMarkerTooltip` writes a literal
    // class string and never reads the value threaded to it, so the key has no
    // sink at all. Deleted in this pass; this test is what would fail if it were
    // wired up later without the key coming back.
    await expect(page.locator(".ovr-marker-tooltip")).toHaveCount(0);
  });
});
