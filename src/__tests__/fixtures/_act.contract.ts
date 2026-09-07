import { act } from "@testing-library/react";
import { gestures, type ActTools } from "./_act.js";
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
  focus: wrap(gestures.focus),
  keyDown: wrap(gestures.keyDown),
  change: wrap(gestures.change),
  settle: async (ms = 0) => {
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, ms));
    });
  },
};

/** Runs a fixture's act, if it has one. The single call site for the tier. */
export const applyAct = async (fixture: Pick<Fixture, "act">, container: HTMLElement) => {
  if (fixture.act) await fixture.act(container, contractActTools);
  // Settled whether or not there was an act. A subtree behind a dynamic import
  // — TimePicker's clock face, DatePicker's presets and marker tooltip —
  // resolves on a microtask, and a contract that read the DOM synchronously
  // would see the component without the half the fixture asked for.
  await contractActTools.settle();
};
