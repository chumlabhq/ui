import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DEMO_DIRECTION_KEY, DirectionToggle, useDemoDirection } from "../DirectionControl.js";

function Harness() {
  const [direction, setDirection] = useDemoDirection();
  return <DirectionToggle direction={direction} onChange={setDirection} />;
}

afterEach(() => {
  window.localStorage.clear();
  document.documentElement.removeAttribute("dir");
  vi.restoreAllMocks();
});

describe("the demo pages' direction control", () => {
  it("is one named, pressable button that writes dir on the document root and remembers it", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const toggle = screen.getByRole("button", { name: /right to left/i });
    expect(toggle).toHaveAttribute("aria-pressed", "false");
    expect(document.documentElement.getAttribute("dir")).toBe("ltr");
    toggle.focus();
    await user.keyboard("{Enter}");
    expect(toggle).toHaveAttribute("aria-pressed", "true");
    expect(document.documentElement.getAttribute("dir")).toBe("rtl");
    expect(window.localStorage.getItem(DEMO_DIRECTION_KEY)).toBe("rtl");
  });

  it("opens in the direction the viewer chose last", () => {
    window.localStorage.setItem(DEMO_DIRECTION_KEY, "rtl");
    render(<Harness />);
    expect(screen.getByRole("button", { name: /right to left/i })).toHaveAttribute("aria-pressed", "true");
    expect(document.documentElement.getAttribute("dir")).toBe("rtl");
  });

  it("puts back the root's own dir when the docs layout unmounts", () => {
    document.documentElement.setAttribute("dir", "ltr");
    window.localStorage.setItem(DEMO_DIRECTION_KEY, "rtl");
    const { unmount } = render(<Harness />);
    expect(document.documentElement.getAttribute("dir")).toBe("rtl");
    unmount();
    expect(document.documentElement.getAttribute("dir")).toBe("ltr");
  });

  it("still switches when site data is blocked, and only forgets the choice", async () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new DOMException("blocked", "SecurityError");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("blocked", "SecurityError");
    });
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole("button", { name: /right to left/i }));
    expect(document.documentElement.getAttribute("dir")).toBe("rtl");
  });
});
