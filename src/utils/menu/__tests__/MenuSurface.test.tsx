/** @jsxImportSource react */
import { describe, expect, it, afterEach, beforeEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { useRef } from "react";
import MenuSurface from "../MenuSurface";
import { setReducedMotion } from "../../../test/matchMedia";

afterEach(cleanup);
beforeEach(() => setReducedMotion(false));

/**
 * jsdom reports every rect as zero, so nothing here asserts a coordinate — the
 * positioning slice's browser harness is where those live. What this suite owns
 * is the wiring around the measurement: where the surface renders, whether it
 * exists at all, and the hidden first frame that lets the measurement happen.
 */
function Harness({ children, ...props }: Partial<React.ComponentProps<typeof MenuSurface>>) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  return (
    <>
      <button ref={triggerRef} type="button">
        trigger
      </button>
      <MenuSurface trigger={triggerRef} isOpen {...props}>
        {children ?? <div data-testid="content">content</div>}
      </MenuSurface>
    </>
  );
}

const surface = () => document.querySelector<HTMLElement>("[data-side]");

describe("MenuSurface", () => {
  it("portals to the document body by default", () => {
    const { container } = render(<Harness />);
    const el = surface();
    expect(el).not.toBeNull();
    expect(container.contains(el), "the surface must not render inline").toBe(false);
    expect(document.body.contains(el)).toBe(true);
  });

  it("portals into a supplied container", () => {
    const host = document.createElement("div");
    document.body.appendChild(host);
    render(<Harness portalContainer={host} />);
    expect(host.contains(surface())).toBe(true);
    host.remove();
  });

  it("renders nothing when closed", () => {
    render(<Harness isOpen={false} />);
    expect(surface()).toBeNull();
  });

  it("stays mounted but hidden when keepMounted is set", () => {
    render(<Harness isOpen={false} keepMounted />);
    const el = surface();
    expect(el).not.toBeNull();
    expect(el?.style.display).toBe("none");
  });

  it("hides the first frame rather than painting at the corner", () => {
    // The surface has to be in the DOM before it can be measured, so the choice
    // is between a hidden frame and a visible jump from the top-left corner.
    render(<Harness />);
    expect(surface()?.style.visibility).toBe("hidden");
  });

  it("reports the side it resolved to, not the side it was asked for", () => {
    // Under jsdom every rect is zero, so "top" cannot hold the surface and the
    // flip fires. That is the hook working; `data-side` reports the outcome.
    render(<Harness side="top" />);
    expect(surface()?.dataset.side).toBe("bottom");
  });

  it("honours forceSide, which is what the family calls forceDropdownPosition", () => {
    render(<Harness side="top" forceSide />);
    expect(surface()?.dataset.side).toBe("top");
  });

  it("applies a z-index only when given one", () => {
    render(<Harness zIndex={70} />);
    expect(surface()?.style.zIndex).toBe("70");
    cleanup();
    render(<Harness />);
    expect(surface()?.style.zIndex).toBe("");
  });

  it("renders its children into the surface", () => {
    render(<Harness />);
    expect(surface()?.querySelector("[data-testid='content']")).not.toBeNull();
  });

  describe("self-check", () => {
    it("would notice if the surface stopped portalling", () => {
      // If `createPortal` were replaced by an inline render, the container
      // assertion above is the one that fails — this proves the query it uses
      // can tell the two apart.
      const { container } = render(
        <div>
          <span data-side="bottom">inline</span>
        </div>,
      );
      expect(container.contains(surface())).toBe(true);
    });
  });
});
