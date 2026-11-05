import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TimePicker } from "../index.js";
import { setReducedMotion } from "../../../test/matchMedia.js";

beforeEach(() => setReducedMotion(false));

describe("TimePicker onValueChange", () => {
  it("stays quiet when the field is left holding the time it had", async () => {
    const onValueChange = vi.fn();
    render(<TimePicker label="Time" format="24h" defaultValue="09:30" onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole("combobox"));
    await userEvent.tab();
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
