import { Breadcrumb } from "../../components/Breadcrumb/index.js";
import type { Fixtures } from "./types.js";
import { RtlBoundary } from "./_harness.js";
import { CRUMBS } from "./_data.js";

const fixtures: Fixtures<typeof Breadcrumb> = [
  { name: "default", props: { items: CRUMBS } },
  {
    name: "disabled-mid",
    props: { items: [CRUMBS[0], { ...CRUMBS[1], disabled: true }, { id: "last", label: "Last" }] },
    note: "itemDisabled applies to a disabled crumb that is NOT the current page. CRUMBS puts its disabled crumb last, where isActive wins, so the key looked unreachable.",
  },
  { name: "collapsed", props: { items: [...CRUMBS, ...CRUMBS], maxVisibleItems: 3 }, note: "Drives the ellipsis and its menu." },
  {
    // Tooltips ON, because the menu is where they must NOT appear: it focuses
    // its first item on open, so a tooltip on a collapsed item opened with no
    // pointer near it and covered the row beneath. Without the tooltips in
    // these props the picture could not have caught that, and did not.
    // Planted by putting the Tooltip wrapper back on the collapsed item: 915
    // differing pixels against the suite's 30-pixel budget.
    name: "collapsed-open",
    props: {
      items: [...CRUMBS, ...CRUMBS].map((i) => ({ ...i, tooltip: "Tip" })),
      maxVisibleItems: 3,
      showTooltips: true,
    },
    act: (c, ui) => ui.click(c.querySelector("button")),
  },
  { name: "with-icons", props: { items: CRUMBS.map((i) => ({ ...i, icon: "•" })) } },
  { name: "with-tooltips", props: { items: CRUMBS.map((i) => ({ ...i, tooltip: "Tip" })), showTooltips: true } },
  {
    name: "collapsed-open-rtl",
    props: { items: [...CRUMBS, ...CRUMBS], maxVisibleItems: 3 },
    wrap: (node) => <RtlBoundary>{node}</RtlBoundary>,
    act: (c, ui) => ui.click(c.querySelector("button")),
  },
];
export default fixtures;
