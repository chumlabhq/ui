/** @jsxImportSource react */
/**
 * The two guarantees every contract render loop now rests on, each shown to
 * hold rather than assumed.
 *
 * - A fixture's act ends only once the component's own lazy loads have
 *   settled. The wait is on the load the component started, so it holds when a
 *   load is slower than its module: proven here with a 200 ms delay injected in
 *   front of TimePicker's clock face, which is the exact gap the 2h wait left.
 * - A loop cannot reach another test's DOM: its unmount removes only what it
 *   rendered, and once its test has finished it refuses to render again. A
 *   timed-out test kept running and its global `cleanup()` failed 75 of the
 *   tests after it in one full run.
 */
import { beforeEach, describe, expect, it } from "vitest";
import { contractActTools, fixtureSession } from "../fixtures/_act.contract.js";
import { fixturesFor } from "../fixtures/index.js";
import { loadsSettled, pendingLoads, setLazyDelay } from "../../test/lazyLoads.js";
import { setReducedMotion } from "../../test/matchMedia.js";
import { COMPONENTS } from "./registry.js";

beforeEach(() => setReducedMotion(false));

describe("fixture session", () => {
  it("waits for a lazy half's own load, not a frame count", async () => {
    const entry = COMPONENTS.find((c) => c.name === "TimePicker")!;
    const fixture = fixturesFor("TimePicker").find((f) => f.name === "open-clock")!;
    const session = fixtureSession();
    setLazyDelay(200);
    try {
      const { container } = session.render(
        <entry.Component {...entry.props} {...(fixture.props as Record<string, unknown>)} />,
      );
      // Without the wait: the face is still on its way. If this ever sees it,
      // the load was not cold and the second half below proves nothing.
      await session.act(fixture, container, { waitForLazy: false });
      expect(pendingLoads(), "the clock face's load never started").toBeGreaterThan(0);
      expect(document.body.querySelectorAll("[data-state]").length).toBe(0);

      // The wait applyAct uses, on the same render: the face arrives.
      await loadsSettled(() => contractActTools.settle());
      expect(pendingLoads()).toBe(0);
      expect(document.body.querySelectorAll("[data-state]").length).toBeGreaterThan(0);
    } finally {
      setLazyDelay(0);
      session.unmount();
    }
  });

  it("unmounts only what it rendered", () => {
    const mine = fixtureSession();
    const theirs = fixtureSession();
    mine.render(<div data-mine />);
    theirs.render(<div data-theirs />);
    mine.unmount();
    expect(document.body.querySelector("[data-mine]")).toBeNull();
    expect(document.body.querySelector("[data-theirs]")).not.toBeNull();
    theirs.unmount();
  });

  let finished: ReturnType<typeof fixtureSession> | null = null;

  it("hands a session to the next test", () => {
    finished = fixtureSession();
    finished.render(<div data-orphan />);
  });

  it("refuses to render once the test that made it has finished", () => {
    const before = document.body.innerHTML;
    expect(() => finished!.render(<div data-late />)).toThrow(/after its test finished/);
    expect(document.body.innerHTML).toBe(before);
    expect(document.body.querySelector("[data-late]")).toBeNull();
  });
});
