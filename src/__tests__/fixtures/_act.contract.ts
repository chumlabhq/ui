import { act, render, type RenderResult } from "@testing-library/react";
import { appendFileSync } from "node:fs";
import { createElement, type ComponentType, type ReactElement, type ReactNode } from "react";
import { expect, onTestFinished } from "vitest";
import { gestures, type ActTools } from "./_act.js";
import { loadsSettled } from "../../test/lazyLoads.js";
import type { Fixture } from "./types.js";

/**
 * The jsdom implementation of `ActTools`, for the contract tier.
 *
 * Separate module because @testing-library must not be reachable from
 * `_act.ts`: the fixture modules import that one, and the fixture page imports
 * the fixture modules, so anything in it ships into the dev bundle and — worse —
 * would be callable from an act again.
 *
 * Every gesture is wrapped in `act` so React flushes before the next line,
 * which is what `fireEvent` did for these fixtures before.
 */
const wrap =
  <A extends unknown[]>(gesture: (...args: A) => void) =>
  (...args: A) => {
    act(() => {
      gesture(...args);
    });
  };

export const contractActTools: ActTools = {
  click: wrap(gestures.click),
  dblClick: wrap(gestures.dblClick),
  mouseEnter: wrap(gestures.mouseEnter),
  pointerDown: wrap(gestures.pointerDown),
  pointerMove: wrap(gestures.pointerMove),
  focus: wrap(gestures.focus),
  keyDown: wrap(gestures.keyDown),
  change: wrap(gestures.change),
  settle: async (ms = 0) => {
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, ms));
    });
  },
};

/**
 * A step slower than this names itself, and nothing below it logs.
 *
 * Measured over one full `run-vitest` (2026-10-01, 32,815 steps): p50 0.0 ms,
 * p99 13.3 ms, p99.9 102 ms, and the slowest 471 ms — InternationalPhoneInput's
 * `country-open` click, which renders the whole country list. The full run that
 * hung was 3.5x slower than recorded overall (284 s against 80 s), which puts
 * that slowest normal step near 1650 ms under the same pressure. 2000 ms stays
 * quiet through that and still names a hang long before the 30 s timeout does.
 */
const SLOW_STEP_MS = 2000;

/** `CHUMLAB_STEP_TIMES=<file>` records every step's time, which is how the threshold was chosen. */
const RECORD = process.env.CHUMLAB_STEP_TIMES;

const report = (fixture: string, step: string, ms: number) => {
  if (RECORD) appendFileSync(RECORD, `${JSON.stringify({ test: expect.getState().currentTestName, fixture, step, ms })}\n`);
  if (ms > SLOW_STEP_MS) {
    console.warn(
      `SLOW_FIXTURE_STEP ${ms.toFixed(0)}ms > ${SLOW_STEP_MS}ms: ${step} in fixture "${fixture}" ` +
        `(${expect.getState().currentTestName})`,
    );
  }
};

/**
 * The tools a fixture's act receives, each step timed. A settle is timed net of
 * the delay it was asked for, so `settle(10)` inside a polling loop is judged
 * on what it cost beyond its own wait.
 */
const timedTools = (fixture: string): ActTools => {
  const steps: Record<string, number> = {};
  const label = (name: string) => `${name}#${(steps[name] = (steps[name] ?? 0) + 1)}`;
  const time =
    <A extends unknown[]>(name: string, step: (...args: A) => void) =>
    (...args: A) => {
      const step_ = label(name);
      const start = performance.now();
      try {
        step(...args);
      } finally {
        report(fixture, step_, performance.now() - start);
      }
    };
  return {
    click: time("click", contractActTools.click),
    dblClick: time("dblClick", contractActTools.dblClick),
    mouseEnter: time("mouseEnter", contractActTools.mouseEnter),
    pointerDown: time("pointerDown", contractActTools.pointerDown),
    pointerMove: time("pointerMove", contractActTools.pointerMove),
    focus: time("focus", contractActTools.focus),
    keyDown: time("keyDown", contractActTools.keyDown),
    change: time("change", contractActTools.change),
    settle: async (ms = 0) => {
      const step_ = label("settle");
      const start = performance.now();
      await contractActTools.settle(ms);
      report(fixture, step_, performance.now() - start - ms);
    },
  };
};

/**
 * Runs a fixture's act, if it has one, then waits for every lazy load the
 * component has in flight. The single call site for the tier.
 *
 * The wait is the condition, not a frame count: a lazy half — TimePicker's
 * clock face, DatePicker's presets and marker tooltip, Table's filter panel —
 * arrives when its own `load` settles, and `loadsSettled` waits for exactly
 * those promises. A fixture read before then is read without the half it asked
 * for, which is how `clockHours` failed in two contracts run alone.
 */
export const applyAct = async (
  fixture: Pick<Fixture, "act"> & { name?: string },
  container: HTMLElement,
  options: { waitForLazy?: boolean; beforeStep?: () => void } = {},
) => {
  const name = fixture.name ?? "(unnamed)";
  const before = options.beforeStep ?? (() => {});
  const timed = timedTools(name);
  const tools = Object.fromEntries(
    Object.entries(timed).map(([key, step]) => [
      key,
      (...args: unknown[]) => {
        before();
        return (step as (...a: unknown[]) => unknown)(...args);
      },
    ]),
  ) as unknown as ActTools;
  const settle = () => {
    before();
    return contractActTools.settle();
  };
  if (fixture.act) await fixture.act(container, tools);
  await settle();
  if (options.waitForLazy === false) return;
  const start = performance.now();
  await loadsSettled(settle);
  report(name, "lazy loads", performance.now() - start);
};

/**
 * A render loop that cannot touch another test's DOM.
 *
 * When a test times out, vitest stops waiting for it but its body keeps
 * running. A loop that called the global `cleanup()` then unmounted the NEXT
 * test's fixture in the middle of its act, and its own renders landed in the
 * next test's sweep: one DatePicker test that overran in the full run failed 75
 * of the 76 tests after it in `state-replacement`, and a planted 2.5 s stall
 * reproduced the same 70.
 *
 * So a session unmounts only what it rendered, and checks before every render,
 * act and act step that its own test is still the one running; once that test
 * has finished — passed, failed or timed out — it removes its own DOM and stops.
 *
 * A timed-out test is also suspended inside an `act` scope whenever its last
 * step was a settle, and React keeps one scope stack per module, not per test.
 * The next test's render opened a scope inside it, the two closed out of
 * order, and React restored a queue that never flushed again: every later
 * render in the file committed nothing. CL1's full run failed 35 tests in
 * `overrides.contract` that way, after one DatePicker sweep overran its 90 s.
 * So the test's finish waits for the act in flight to close. Its next step
 * stops it, and the next test starts with no scope open.
 */
export function fixtureSession() {
  const token = { open: true };
  let inFlight: Promise<unknown> = Promise.resolve();
  onTestFinished(async () => {
    token.open = false;
    await inFlight.catch(() => {});
  });
  const mounted: RenderResult[] = [];

  const unmount = () => {
    for (const result of mounted.splice(0)) {
      result.unmount();
      result.container.remove();
    }
  };
  const guard = (what: string) => {
    if (token.open) return;
    unmount();
    throw new Error(`fixture session: ${what} after its test finished — stopped so it cannot reach a later test`);
  };

  return {
    render(ui: ReactElement): RenderResult {
      guard("render");
      const result = render(ui);
      mounted.push(result);
      return result;
    },
    async act(fixture: Parameters<typeof applyAct>[0], container: HTMLElement, options?: Parameters<typeof applyAct>[2]) {
      guard("act");
      const run = applyAct(fixture, container, { ...options, beforeStep: () => guard("act step") });
      inFlight = run;
      await run;
      guard("act");
    },
    /**
     * The plain case — a fixture's props and children on the component, through
     * the fixture's own wrapper — rendered and acted on. Four contracts each
     * kept an identical copy of this.
     */
    async mountFixture(
      Component: ComponentType<Record<string, unknown>>,
      fixture: Pick<Fixture, "props" | "children" | "wrap" | "act" | "name">,
    ) {
      const element = createElement(
        Component,
        fixture.props as Record<string, unknown>,
        fixture.children as ReactNode,
      );
      const { container } = this.render((fixture.wrap ? fixture.wrap(element) : element) as ReactElement);
      await this.act(fixture, container);
      return container;
    },
    unmount,
  };
}
