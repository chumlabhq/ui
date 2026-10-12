import { expect, test, type Page } from "./_test";
import { gotoFixture } from "./_nav";

/**
 * A custom icon renders where the default did, in the same box.
 *
 * A2c turned the components' icon props from ComponentTypes, which received
 * the slot's classes, into ReactNodes rendered as given — or, where the
 * library still has to turn or place the icon, rendered inside a box carrying
 * the slot. Either way the consumer's glyph now sits in markup the library
 * builds around it, and nothing else looks at that markup: the visual
 * baselines photograph the default icons, and icon-bounds only asks that an
 * icon stay under its ceiling.
 *
 * So each `*-custom-*` fixture is held to the default fixture it mirrors: same
 * props, one icon swapped for a 16×16 SVG glyph (`fixtures/_icons.tsx`, a
 * real drawing because a text letter takes its box from the line-height). The
 * glyph's box must match the default icon's box, and its centre must sit at
 * the same offset from the element that holds it. The tolerance is half a
 * pixel: below that is sub-pixel rounding between two layouts; at or above it
 * a reader can see the icon has moved or changed size.
 */
const TOLERANCE = 0.5;

interface Slot {
  component: string;
  custom: string;
  reference: string;
  /** Which part holds the icon. */
  anchor: "trigger" | "clear" | "search" | "separator" | "ellipsis";
}

const SLOTS: Slot[] = [
  { component: "Dropdown", custom: "open-custom-chevron-icon", reference: "open", anchor: "trigger" },
  { component: "Dropdown", custom: "open-with-selection-custom-clear-icon", reference: "open-with-selection", anchor: "clear" },
  { component: "SearchableDropdown", custom: "open-custom-chevron-icon", reference: "open", anchor: "trigger" },
  { component: "SearchableDropdown", custom: "open-with-selection-custom-clear-icon", reference: "open-with-selection", anchor: "clear" },
  { component: "SearchableDropdown", custom: "open-search-custom-search-icon", reference: "open-search", anchor: "search" },
  { component: "MultiSelectDropdown", custom: "open-custom-chevron-icon", reference: "open", anchor: "trigger" },
  { component: "MultiSelectDropdown", custom: "open-with-selection-custom-clear-icon", reference: "open-with-selection", anchor: "clear" },
  { component: "MultiSelectSearchableDropdown", custom: "open-with-selection-custom-clear-icon", reference: "open-with-selection", anchor: "clear" },
  { component: "CascadingDropdown", custom: "open-with-selection-custom-clear-icon", reference: "open-with-selection", anchor: "clear" },
  { component: "CascadingDropdown", custom: "open-search-custom-search-icon", reference: "open-search", anchor: "search" },
  { component: "Breadcrumb", custom: "collapsed-custom-ellipsis-icon", reference: "collapsed", anchor: "ellipsis" },
  { component: "Breadcrumb", custom: "custom-separator-icon", reference: "default", anchor: "separator" },
];

interface Box {
  w: number;
  h: number;
  dx: number;
  dy: number;
  glyph: string | null;
}

/** The icon in the slot's holder: its size, its centre's offset from the holder, and whether it is a fixture glyph. */
async function measure(page: Page, anchor: Slot["anchor"]): Promise<Box | null> {
  return page.evaluate((anchor) => {
    const holder = (() => {
      const fixture = document.querySelector("[data-fixture]");
      switch (anchor) {
        case "trigger":
          return fixture?.querySelector("[role=combobox]") ?? null;
        case "clear":
          return document.querySelector("button[aria-label^='Clear']");
        case "search": {
          const input = [...document.querySelectorAll("input")].find(
            (i) => i.type !== "hidden" && /search/i.test(`${i.getAttribute("aria-label")} ${i.placeholder}`),
          );
          return input?.parentElement ?? null;
        }
        case "separator":
          return fixture?.querySelector("li[role=presentation]") ?? null;
        case "ellipsis":
          return fixture?.querySelector("button[aria-haspopup=menu]") ?? null;
      }
    })();
    if (!holder) return null;
    const svgs = [...holder.querySelectorAll("svg")].filter((s) => !s.parentElement?.closest("svg"));
    const icon = svgs.find((s) => s.hasAttribute("data-fixture-glyph")) ?? svgs.at(-1);
    if (!icon) return null;
    const a = holder.getBoundingClientRect();
    const r = icon.getBoundingClientRect();
    return {
      w: r.width,
      h: r.height,
      dx: r.left + r.width / 2 - a.left,
      dy: r.top + r.height / 2 - a.top,
      glyph: icon.getAttribute("data-fixture-glyph"),
    };
  }, anchor);
}

for (const slot of SLOTS) {
  test(`${slot.component}/${slot.custom} renders its icon where /${slot.reference} renders the default, in the same box`, async ({ page }) => {
    await gotoFixture(page, slot.component, slot.reference);
    await page.addStyleTag({ content: "*{transition:none!important;animation:none!important}" });
    const def = await measure(page, slot.anchor);
    await gotoFixture(page, slot.component, slot.custom);
    await page.addStyleTag({ content: "*{transition:none!important;animation:none!important}" });
    const custom = await measure(page, slot.anchor);
    expect(def, `no default icon in the ${slot.anchor} of /${slot.reference}`).not.toBeNull();
    expect(custom, `no custom icon in the ${slot.anchor} of /${slot.custom}`).not.toBeNull();
    const off = Math.max(Math.abs(def!.w - custom!.w), Math.abs(def!.h - custom!.h), Math.abs(def!.dx - custom!.dx), Math.abs(def!.dy - custom!.dy));
    console.log(
      `ICON_SLOT ${slot.component}/${slot.custom} default ${def!.w}×${def!.h} @${def!.dx.toFixed(1)},${def!.dy.toFixed(1)} custom ${custom!.w}×${custom!.h} @${custom!.dx.toFixed(1)},${custom!.dy.toFixed(1)} off=${off.toFixed(2)} tolerance=${TOLERANCE}`,
    );
    expect(custom!.glyph, "the icon measured is not the fixture's glyph").not.toBeNull();
    expect(def!.glyph, "the reference fixture renders a glyph, not the default icon").toBeNull();
    expect(off, "box or position moved").toBeLessThan(TOLERANCE);
  });
}
