/** @jsxImportSource react */
/**
 * SC 4.1.3 Status Messages — a status is announced without taking the focus.
 *
 * Two halves, and the second is the one that gets missed: the region has to be
 * a live region, and showing it must not move the focus. A component that
 * focuses its own error message satisfies a checker looking for `role="alert"`
 * while yanking a keyboard user out of the field they were filling in.
 *
 * Driven over the fixtures that actually render an error, a success or a
 * loading state, so a component whose live region only appears in one state is
 * still covered.
 */
import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { render, cleanup, act } from "@testing-library/react";
import { COMPONENTS } from "./registry";
import { fixturesFor } from "../fixtures";

import { setReducedMotion } from "../../test/matchMedia";

beforeEach(() => setReducedMotion(false));
afterEach(cleanup);

const LIVE = '[role="alert"], [role="status"], [aria-live]';

/** Fixtures whose whole point is a message or a busy state. */
const MESSAGE_FIXTURE = /^(error|success|loading|open-empty|with-error|invalid)$/;

const renderFixture = async (
  Component: React.ComponentType<Record<string, unknown>>,
  fixture: ReturnType<typeof fixturesFor>[number],
) => {
  const element = (
    <Component {...fixture.props}>{fixture.children as React.ReactNode}</Component>
  );
  const { container } = render(
    (fixture.wrap ? fixture.wrap(element) : element) as React.ReactElement,
  );
  if (fixture.act) await fixture.act(container);
};

const candidates = COMPONENTS.filter((c) =>
  fixturesFor(c.name).some((f) => MESSAGE_FIXTURE.test(f.name)),
);

describe("status messages contract", () => {
  it("covers a meaningful number of components", () => {
    // Guards the regex above: if fixture naming drifts, this suite would
    // quietly assert nothing at all.
    expect(candidates.length).toBeGreaterThan(8);
  });

  describe("self-check", () => {
    it("recognises a live region", () => {
      const host = document.createElement("div");
      host.innerHTML = '<div role="alert">boom</div>';
      document.body.appendChild(host);
      expect(host.querySelectorAll(LIVE)).toHaveLength(1);
      host.remove();
    });

    it("does not recognise a plain element as one", () => {
      const host = document.createElement("div");
      host.innerHTML = "<div>boom</div>";
      document.body.appendChild(host);
      expect(host.querySelectorAll(LIVE)).toHaveLength(0);
      host.remove();
    });
  });

  for (const component of candidates) {
    const messageFixtures = fixturesFor(component.name).filter((f) =>
      MESSAGE_FIXTURE.test(f.name),
    );

    it(`${component.name} announces its message states without taking focus`, async () => {
      const notLive: string[] = [];
      const stoleFocus: string[] = [];

      for (const fixture of messageFixtures) {
        // A fresh body each time, so the focus check reads this render only.
        document.body.focus();
        const before = document.activeElement;

        await act(async () => {
          await renderFixture(
            component.Component as React.ComponentType<Record<string, unknown>>,
            fixture,
          );
        });

        // The message itself has to be the live region, not merely somewhere on
        // a page that happens to contain one. Asking "is there any live region"
        // passed three components whose success text was a plain <div> beside
        // an unrelated live region.
        const props = fixture.props as Record<string, unknown>;
        const expected =
          fixture.name === "error" ? props.errorMessage : props.successMessage;
        if (typeof expected === "string" && expected) {
          const announced = [...document.querySelectorAll(LIVE)].some((el) =>
            el.textContent?.includes(expected),
          );
          if (!announced) notLive.push(`${fixture.name}: "${expected}" is not in a live region`);
        }

        // Only the message states. `open-empty` opens a menu, which correctly
        // moves focus to its search field — that is the open doing it, not the
        // status appearing, and flagging it would make this suite argue against
        // behaviour the combobox pattern requires.
        const after = document.activeElement;
        if (
          /^(error|success)$/.test(fixture.name) &&
          after !== before &&
          after !== document.body
        ) {
          stoleFocus.push(`${fixture.name} -> ${after?.tagName}`);
        }
        cleanup();
      }

      expect(notLive, "a message state with no live region").toEqual([]);
      expect(
        stoleFocus,
        "showing a status moved the focus — 4.1.3 requires the opposite",
      ).toEqual([]);
    });
  }
});
