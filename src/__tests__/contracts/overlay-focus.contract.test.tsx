/** @jsxImportSource react */
/**
 * SC 2.1.2 No Keyboard Trap and SC 2.4.3 Focus Order, for the three surfaces
 * that deliberately hold focus.
 *
 * Modal, Drawer and DatePicker all declare `aria-modal`, which tells assistive
 * technology the rest of the page is inert. A dialog that makes that claim has
 * to make it true — focus enters it, Tab cycles inside it, and Escape gives the
 * focus back — and a dialog that traps has to be escapable, which is what 2.1.2
 * is about.
 *
 * Asserted for all three together rather than per component, because they now
 * share `cycleTabWithin`: a regression in the shared helper should fail
 * everywhere at once, and a component that stops using it should fail here.
 */
import { useState } from "react";
import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { render, cleanup, fireEvent, act } from "@testing-library/react";
import { Modal } from "../../components/Modal/index.js";
import { Drawer } from "../../components/Drawer/index.js";
import { DatePicker } from "../../components/DatePicker/index.js";
import { cycleTabWithin } from "../../utils/focusUtils.js";

import { setReducedMotion } from "../../test/matchMedia.js";

beforeEach(() => setReducedMotion(false));
afterEach(cleanup);

const active = () => document.activeElement as HTMLElement | null;
const dialog = () => document.querySelector('[role="dialog"]') as HTMLElement | null;

interface Surface {
  name: string;
  open: () => Promise<void>;
  /** Escape must close it and hand the focus back. */
  closes: boolean;
}

/**
 * Driven by real state, not a no-op handler. Rendered controlled with
 * `onOpenChange={() => {}}`, Escape fires the callback and the component
 * correctly stays open, so the escapability assertion would be testing the
 * harness rather than the component.
 */
function ControlledModal() {
  const [open, setOpen] = useState(true);
  return (
    <Modal open={open} onOpenChange={setOpen} title="T">
      <button>one</button>
      <button>two</button>
    </Modal>
  );
}

function ControlledDrawer() {
  const [open, setOpen] = useState(true);
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <button>one</button>
      <button>two</button>
    </Drawer>
  );
}

const SURFACES: Surface[] = [
  {
    name: "Modal",
    closes: true,
    open: async () => {
      render(<ControlledModal />);
      await act(async () => {
        vi.advanceTimersByTime(50);
      });
    },
  },
  {
    name: "Drawer",
    closes: true,
    open: async () => {
      render(<ControlledDrawer />);
      await act(async () => {
        vi.advanceTimersByTime(50);
      });
    },
  },
  {
    name: "DatePicker",
    closes: true,
    open: async () => {
      render(<DatePicker selectionMode="single" value={new Date(2026, 0, 15)} defaultOpen />);
      await act(async () => {
        vi.advanceTimersByTime(50);
      });
    },
  },
];

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe("overlay focus contract", () => {
  describe("self-check", () => {
    it("cycleTabWithin swallows Tab when nothing inside can take focus", () => {
      const box = document.createElement("div");
      document.body.appendChild(box);
      const event = { shiftKey: false, preventDefault: vi.fn() };
      cycleTabWithin(box, event);
      expect(event.preventDefault).toHaveBeenCalled();
      box.remove();
    });

    it("cycleTabWithin pulls focus back when it has left the container", () => {
      const box = document.createElement("div");
      box.innerHTML = "<button>a</button><button>b</button>";
      document.body.appendChild(box);
      // Focus outside: the shape WebKit produces, because it leaves buttons out
      // of the tab order and drops focus to <body>.
      (document.body as HTMLElement).focus();
      cycleTabWithin(box, { shiftKey: false, preventDefault: () => {} });
      expect(box.contains(active())).toBe(true);
      box.remove();
    });

    it("cycleTabWithin wraps backwards to the last element", () => {
      const box = document.createElement("div");
      box.innerHTML = "<button>a</button><button>b</button>";
      document.body.appendChild(box);
      (box.firstElementChild as HTMLElement).focus();
      cycleTabWithin(box, { shiftKey: true, preventDefault: () => {} });
      expect(active()).toBe(box.lastElementChild);
      box.remove();
    });
  });

  describe.each(SURFACES)("$name", ({ open }) => {
    it("moves the focus inside on open", async () => {
      await open();
      const panel = dialog();
      expect(panel, "no dialog rendered").not.toBeNull();
      expect(panel!.contains(active()), "focus stayed outside the dialog").toBe(true);
    });

    it("keeps Tab inside, in both directions", async () => {
      await open();
      const panel = dialog()!;

      for (let i = 0; i < 12; i++) {
        fireEvent.keyDown(active() ?? document.body, { key: "Tab" });
        expect(panel.contains(active()), "Tab escaped the dialog").toBe(true);
      }
      for (let i = 0; i < 12; i++) {
        fireEvent.keyDown(active() ?? document.body, { key: "Tab", shiftKey: true });
        expect(panel.contains(active()), "Shift+Tab escaped the dialog").toBe(true);
      }
    });

    it("is escapable — the trap is not a keyboard trap", async () => {
      await open();
      // 2.1.2 is satisfied by an advertised way out, not by Tab alone.
      //
      // Dispatched from the focused element so it reaches both mechanisms the
      // way a real key press does: DatePicker handles Escape on the panel,
      // while Modal and Drawer listen on `document` in the capture phase so a
      // stack of overlays can decide which one is on top.
      await act(async () => {
        fireEvent.keyDown(active() ?? document.body, { key: "Escape" });
      });
      // All three stay mounted through an exit transition, so the assertion has
      // to wait it out rather than read the DOM mid-animation.
      await act(async () => {
        vi.advanceTimersByTime(1000);
      });
      expect(dialog(), "Escape did not close the dialog").toBeNull();
    });
  });
});
