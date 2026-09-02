/** @jsxImportSource react */
import { it, beforeEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { writeFileSync } from "node:fs";
import { COMPONENTS } from "./registry";
import { fixturesFor } from "../fixtures";
import { setReducedMotion } from "../../test/matchMedia";

beforeEach(() => setReducedMotion(false));

const WANT = ["Dropdown", "Checkbox", "Switch", "TabPanel", "Stepper", "Pagination",
  "Breadcrumb", "Slider", "OtpInput", "RadioButton/RadioButton", "TimePicker",
  "DatePicker", "Table", "CascadingDropdown", "MultiSelectDropdown",
  "MultiSelectSearchableDropdown", "SearchableDropdown", "InternationalPhoneInput"];

it("probes rendered DOM per fixture", async () => {
  const out: Record<string, unknown[]> = {};
  for (const c of COMPONENTS) {
    if (!WANT.includes(c.name)) continue;
    for (const f of fixturesFor(c.name).filter((x) => !x.render)) {
      const el = (
        <c.Component {...c.props} {...f.props}>
          {f.children as React.ReactNode}
        </c.Component>
      );
      const { container } = render(
        (f.wrap ? f.wrap(el) : c.wrap ? c.wrap(el) : el) as React.ReactElement,
      );
      if (f.act) await f.act(container);
      const nodes: unknown[] = [];
      for (const n of Array.from(document.body.querySelectorAll("*")).slice(0, 400)) {
        const attrs = n.getAttributeNames().filter((a) => a.startsWith("data-") || a === "role");
        if (attrs.length) {
          nodes.push({ tag: n.tagName.toLowerCase(),
            a: Object.fromEntries(attrs.map((a) => [a, n.getAttribute(a)])) });
        }
      }
      out[`${c.name}|${f.name}`] = nodes;
      cleanup();
    }
  }
  writeFileSync(
    "/private/tmp/claude-501/-Users-adityaagarwal-Developer-chumlab/03407024-917b-414f-98ae-2e29b52e1371/scratchpad/probe.json",
    JSON.stringify(out, null, 1));
});
