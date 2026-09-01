import { act } from "@testing-library/react";

/**
 * Flushes effects and the microtask queue.
 *
 * Portalled surfaces mount inside a layout effect that measures the trigger, so
 * they are absent from the DOM on the synchronous render pass. Without this the
 * whole floating half of the library looks unrenderable.
 */
export const tick = async (ms = 0) => {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, ms));
  });
};
