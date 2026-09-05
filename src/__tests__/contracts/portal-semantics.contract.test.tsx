/** @jsxImportSource react */
/**
 * SC 4.1.2 Name, Role, Value — a portalled surface announces what it is.
 *
 * Table's column-filter menu was a plain portalled `div` holding a header, a
 * Clear button and a list of option buttons. axe reported nothing on it, and
 * could not have: every rule it owns fires on a role being WRONG, and this had
 * no role to be wrong. It is the exact surface the a11y phase walked past, and
 * the only reason it surfaced at all is that a visual baseline needed something
 * to wait for and there was no role to wait on.
 *
 * So the property is stated instead of the instance. Content that leaves the
 * document flow loses the context its position gave it — a screen reader user
 * arriving at a group of buttons at the end of `<body>` has nothing to tell them
 * what those buttons belong to. Something in that subtree has to say.
 *
 * Interactive content only. A portalled tooltip or a decorative layer names
 * nothing to operate and is out of scope.
 */
import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { COMPONENTS } from "./registry.js";
import { fixturesFor } from "../fixtures/index.js";
import { applyAct } from "../fixtures/_act.contract.js";
import { setReducedMotion } from "../../test/matchMedia.js";

beforeEach(() => setReducedMotion(false));
afterEach(cleanup);

/** Something a user can operate, and therefore needs the context of. */
const INTERACTIVE =
  'button,a[href],input,select,textarea,[contenteditable="true"],' +
  '[tabindex]:not([tabindex="-1"]),[role="button"],[role="option"],' +
  '[role="menuitem"],[role="menuitemcheckbox"],[role="menuitemradio"],[role="checkbox"],[role="radio"]';

/**
 * A role puts the subtree in a container that is announced. `aria-label` alone
 * does not: a label on a `div` with no role is dropped by every screen reader.
 */
const announced = (element: Element) => element.hasAttribute("role");

/**
 * Interactive elements in `root` with no announced ancestor between them and
 * the portal root, the portal root included.
 */
function unannounced(root: Element): string[] {
  const orphans: string[] = [];
  for (const control of root.querySelectorAll(INTERACTIVE)) {
    let node: Element | null = control.parentElement;
    let covered = false;
    while (node && (node === root || root.contains(node))) {
      if (announced(node)) {
        covered = true;
        break;
      }
      node = node.parentElement;
    }
    if (!covered) orphans.push(control.outerHTML.slice(0, 80));
  }
  return orphans;
}

/** Everything React put straight on the body: one element per open portal. */
const portalRoots = (container: HTMLElement) =>
  [...document.body.children].filter((child) => child !== container && !child.contains(container));

/** `defaults` is a map of class constants, not props — nothing to spread here. */
const candidates = COMPONENTS;

describe("portal semantics contract", () => {
  describe("self-check", () => {
    it("catches a portalled group of buttons with no role", () => {
      const silent = document.createElement("div");
      silent.innerHTML = "<div><button>Alpha</button><button>Beta</button></div>";
      expect(unannounced(silent)).toHaveLength(2);
    });

    it("passes the same group once the surface declares one", () => {
      const announcedRoot = document.createElement("div");
      announcedRoot.setAttribute("role", "dialog");
      announcedRoot.innerHTML = "<div><button>Alpha</button><button>Beta</button></div>";
      expect(unannounced(announcedRoot)).toEqual([]);
    });

    it("does not accept a label standing in for a role", () => {
      const labelled = document.createElement("div");
      labelled.setAttribute("aria-label", "Filter status");
      labelled.innerHTML = "<button>Alpha</button>";
      expect(unannounced(labelled)).toHaveLength(1);
    });
  });

  for (const { name, Component } of candidates) {
    const fixtures = fixturesFor(name);
    if (!fixtures.length) continue;

    it(`${name} announces every portalled surface a user can operate`, async () => {
      const orphans: string[] = [];
      for (const fixture of fixtures) {
        const element = fixture.render ? (
          fixture.render()
        ) : (
          <Component {...fixture.props}>
            {fixture.children as React.ReactNode}
          </Component>
        );
        const { container } = render(
          (fixture.wrap ? fixture.wrap(element) : element) as React.ReactElement,
        );
        await applyAct(fixture, container);
        for (const root of portalRoots(container)) {
          for (const orphan of unannounced(root)) orphans.push(`${fixture.name}: ${orphan}`);
        }
        cleanup();
      }
      expect(orphans).toEqual([]);
    });
  }
});
