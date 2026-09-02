import { Breadcrumb } from "../../components/Breadcrumb";
import { fireEvent } from "@testing-library/react";
import type { Fixtures } from "./types";
import { CRUMBS } from "./_data";

const fixtures: Fixtures<typeof Breadcrumb> = [
  { name: "default", props: { items: CRUMBS } },
  {
    name: "disabled-mid",
    props: { items: [CRUMBS[0], { ...CRUMBS[1], disabled: true }, { id: "last", label: "Last" }] },
    note: "itemDisabled applies to a disabled crumb that is NOT the current page. CRUMBS puts its disabled crumb last, where isActive wins, so the key looked unreachable.",
  },
  { name: "collapsed", props: { items: [...CRUMBS, ...CRUMBS], maxVisibleItems: 3 }, note: "Drives the ellipsis and its menu." },
  {
    name: "collapsed-open",
    props: { items: [...CRUMBS, ...CRUMBS], maxVisibleItems: 3 },
    act: (c) => {
      const btn = c.querySelector("button");
      if (btn) fireEvent.click(btn);
    },
  },
  { name: "with-icons", props: { items: CRUMBS.map((i) => ({ ...i, icon: "•" })) } },
  { name: "with-tooltips", props: { items: CRUMBS.map((i) => ({ ...i, tooltip: "Tip" })), showTooltips: true } },
];
export default fixtures;
