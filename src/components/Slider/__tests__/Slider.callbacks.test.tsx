import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Slider } from "../index.js";
import { setReducedMotion } from "../../../test/matchMedia.js";

beforeEach(() => setReducedMotion(false));

const setup = (props: Record<string, unknown>) => {
  const onValueCommit = vi.fn();
  render(<Slider aria-label="S" defaultValue={50} onValueCommit={onValueCommit} {...props} />);
  return { onValueCommit, thumb: screen.getByRole("slider") };
};

describe("Slider onValueCommit", () => {
  it("reports the new value on a key, not the previous one", () => {
    const { onValueCommit, thumb } = setup({});
    fireEvent.keyDown(thumb, { key: "ArrowRight" });
    expect(onValueCommit.mock.calls).toEqual([[51]]);
  });

  it("stays quiet on a key at the bound, which changes nothing", () => {
    const { onValueCommit, thumb } = setup({ defaultValue: 100 });
    fireEvent.keyDown(thumb, { key: "ArrowRight" });
    expect(onValueCommit).not.toHaveBeenCalled();
  });

  it("stays quiet on a press and release that moved nothing", () => {
    const { onValueCommit, thumb } = setup({});
    fireEvent.pointerDown(thumb, { button: 0 });
    fireEvent.pointerUp(document);
    expect(onValueCommit).not.toHaveBeenCalled();
  });
});
