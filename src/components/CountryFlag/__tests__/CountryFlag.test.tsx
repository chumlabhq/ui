import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  CountryFlag,
  CountryFlagGroup,
  CountryFlagGroupCount,
  CountryFlagShimmer,
  CountryFlagGroupShimmer,
} from "../index";

// ---------------------------------------------------------------------------
// CountryFlag — Rendering
// ---------------------------------------------------------------------------

describe("CountryFlag", () => {
  describe("Rendering", () => {
    it("renders an img with the correct CDN src for a given country code", () => {
      render(<CountryFlag code="us" />);

      const img = screen.getByRole("img").querySelector("img");
      expect(img).toHaveAttribute(
        "src",
        expect.stringContaining("/us.png"),
      );
    });

    it("normalises uppercase codes to lowercase in the src URL", () => {
      render(<CountryFlag code="GB" />);

      const img = screen.getByRole("img").querySelector("img");
      expect(img).toHaveAttribute(
        "src",
        expect.stringContaining("/gb.png"),
      );
    });

    it("applies custom pixel size via number prop", () => {
      render(<CountryFlag code="us" size={48} />);

      const wrapper = screen.getByRole("img");
      expect(wrapper).toHaveStyle({ width: "48px", height: "36px" });
    });

    it("applies a named size preset", () => {
      render(<CountryFlag code="us" size="xl" />);

      const wrapper = screen.getByRole("img");
      // xl = 32px width, 24px height (32 * 0.75)
      expect(wrapper).toHaveStyle({ width: "32px", height: "24px" });
    });

    it("supports a custom aspect ratio", () => {
      render(<CountryFlag code="ch" size={40} aspectRatio={1} />);

      const wrapper = screen.getByRole("img");
      expect(wrapper).toHaveStyle({ width: "40px", height: "40px" });
    });

    it("renders nothing visible when code is empty", () => {
      render(<CountryFlag code="" />);

      const wrapper = screen.getByRole("img");
      expect(wrapper.querySelector("img")).not.toBeInTheDocument();
    });

    it("renders custom fallback when image fails to load", () => {
      render(
        <CountryFlag
          code="xx"
          fallback={<span data-testid="fallback">?</span>}
        />,
      );

      const img = screen.getByRole("img").querySelector("img")!;
      fireEvent.error(img);

      expect(screen.getByTestId("fallback")).toBeInTheDocument();
    });

    it("renders nothing when image fails and no fallback is provided", () => {
      render(<CountryFlag code="xx" />);

      const img = screen.getByRole("img").querySelector("img")!;
      fireEvent.error(img);

      expect(screen.getByRole("img").querySelector("img")).not.toBeInTheDocument();
      expect(screen.getByRole("img").children).toHaveLength(0);
    });

    it("forwards ref to the outer span", () => {
      const ref = vi.fn();
      render(<CountryFlag code="us" ref={ref} />);

      expect(ref).toHaveBeenCalledWith(expect.any(HTMLSpanElement));
    });

    it("spreads additional HTML attributes onto the wrapper", () => {
      render(<CountryFlag code="us" data-testid="flag" />);

      expect(screen.getByTestId("flag")).toBeInTheDocument();
    });
  });

  // ---------------------------------------------------------------------------
  // CountryFlag — Image lifecycle callbacks
  // ---------------------------------------------------------------------------

  describe("Image lifecycle", () => {
    it("calls onLoad with the native event when the image loads", () => {
      const onLoad = vi.fn();
      render(<CountryFlag code="us" onLoad={onLoad} />);

      const img = screen.getByRole("img").querySelector("img")!;
      fireEvent.load(img);

      expect(onLoad).toHaveBeenCalledTimes(1);
      expect(onLoad).toHaveBeenCalledWith(expect.objectContaining({ type: "load" }));
    });

    it("calls onError with the native event when the image fails", () => {
      const onError = vi.fn();
      render(<CountryFlag code="xx" onError={onError} />);

      const img = screen.getByRole("img").querySelector("img")!;
      fireEvent.error(img);

      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError).toHaveBeenCalledWith(expect.objectContaining({ type: "error" }));
    });

    it("exposes data-loading attribute while the image is loading", () => {
      render(<CountryFlag code="us" />);

      const wrapper = screen.getByRole("img");
      expect(wrapper).toHaveAttribute("data-loading", "");
    });

    it("removes data-loading after the image loads", () => {
      render(<CountryFlag code="us" />);

      const wrapper = screen.getByRole("img");
      const img = wrapper.querySelector("img")!;
      fireEvent.load(img);

      expect(wrapper).not.toHaveAttribute("data-loading");
    });

    it("resets error state when code prop changes", () => {
      const { rerender } = render(<CountryFlag code="xx" />);

      // Trigger error for the first code
      const img1 = screen.getByRole("img").querySelector("img")!;
      fireEvent.error(img1);

      // Change code — should show a new image, not fallback
      rerender(<CountryFlag code="us" />);

      const img2 = screen.getByRole("img").querySelector("img");
      expect(img2).toBeInTheDocument();
      expect(img2).toHaveAttribute("src", expect.stringContaining("/us.png"));
    });
  });

  // ---------------------------------------------------------------------------
  // CountryFlag — Accessibility
  // ---------------------------------------------------------------------------

  describe("Accessibility", () => {
    it("sets role=img on the wrapper", () => {
      render(<CountryFlag code="us" />);

      expect(screen.getByRole("img")).toBeInTheDocument();
    });

    it("generates an aria-label from the country code when no alt is provided", () => {
      render(<CountryFlag code="de" />);

      expect(screen.getByRole("img")).toHaveAttribute("aria-label", "DE flag");
    });

    it("uses the alt prop as aria-label when provided", () => {
      render(<CountryFlag code="de" alt="Germany" />);

      expect(screen.getByRole("img")).toHaveAttribute("aria-label", "Germany");
    });

    it("marks the inner img as aria-hidden", () => {
      render(<CountryFlag code="us" />);

      const img = screen.getByRole("img").querySelector("img")!;
      expect(img).toHaveAttribute("aria-hidden");
    });
  });

  // ---------------------------------------------------------------------------
  // CountryFlag — loading prop
  // ---------------------------------------------------------------------------

  describe("Loading prop", () => {
    it("renders shimmer placeholder when loading=true", () => {
      render(<CountryFlag code="us" loading />);

      expect(screen.getByRole("status")).toHaveAttribute(
        "aria-label",
        "Loading flag",
      );
      expect(screen.queryByRole("img")).not.toBeInTheDocument();
    });

    it("renders the flag normally when loading=false", () => {
      render(<CountryFlag code="us" loading={false} />);

      expect(screen.getByRole("img")).toBeInTheDocument();
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });

    it("passes size and aspectRatio to the shimmer", () => {
      render(<CountryFlag code="us" size={48} aspectRatio={1} loading />);

      const shimmer = screen.getByRole("status");
      expect(shimmer).toHaveStyle({ width: "48px", height: "48px" });
    });

    it("transitions from loading to loaded when prop changes", () => {
      const { rerender } = render(<CountryFlag code="us" loading />);

      expect(screen.getByRole("status")).toBeInTheDocument();

      rerender(<CountryFlag code="us" loading={false} />);

      expect(screen.queryByRole("status")).not.toBeInTheDocument();
      expect(screen.getByRole("img")).toBeInTheDocument();
    });
  });
});

// ---------------------------------------------------------------------------
// CountryFlagGroup
// ---------------------------------------------------------------------------

describe("CountryFlagGroup", () => {
  describe("Rendering", () => {
    it("renders all children when no max is set", () => {
      render(
        <CountryFlagGroup>
          <CountryFlag code="us" />
          <CountryFlag code="gb" />
          <CountryFlag code="ca" />
        </CountryFlagGroup>,
      );

      const flags = screen.getAllByRole("img");
      expect(flags).toHaveLength(3);
    });

    it("limits visible flags and shows count badge when max is set", () => {
      render(
        <CountryFlagGroup max={2} size="lg">
          <CountryFlag code="us" />
          <CountryFlag code="gb" />
          <CountryFlag code="ca" />
          <CountryFlag code="de" />
        </CountryFlagGroup>,
      );

      // 2 visible flags + 1 count badge (role="img")
      const imgs = screen.getAllByRole("img");
      expect(imgs).toHaveLength(3);
      expect(screen.getByText("+2")).toBeInTheDocument();
    });

    it("shows all children when max is 0 (treated as no limit)", () => {
      render(
        <CountryFlagGroup max={0}>
          <CountryFlag code="us" />
          <CountryFlag code="gb" />
        </CountryFlagGroup>,
      );

      const flags = screen.getAllByRole("img");
      expect(flags).toHaveLength(2);
    });

    it("shows all children when max is negative (treated as no limit)", () => {
      render(
        <CountryFlagGroup max={-1}>
          <CountryFlag code="us" />
          <CountryFlag code="gb" />
        </CountryFlagGroup>,
      );

      const flags = screen.getAllByRole("img");
      expect(flags).toHaveLength(2);
    });

    it("floors non-integer max values", () => {
      render(
        <CountryFlagGroup max={2.9} size="md">
          <CountryFlag code="us" />
          <CountryFlag code="gb" />
          <CountryFlag code="ca" />
          <CountryFlag code="de" />
        </CountryFlagGroup>,
      );

      // max floors to 2 → 2 flags + 1 count badge
      expect(screen.getByText("+2")).toBeInTheDocument();
    });
  });

  describe("Context — itemClassName", () => {
    it("passes itemClassName to child CountryFlags via context", () => {
      render(
        <CountryFlagGroup itemClassName="rounded-full ring-2">
          <CountryFlag code="us" />
        </CountryFlagGroup>,
      );

      const flag = screen.getByRole("img");
      expect(flag.className).toContain("rounded-full");
      expect(flag.className).toContain("ring-2");
    });
  });

  describe("Surplus rendering", () => {
    it("uses renderSurplus when provided instead of default count badge", () => {
      render(
        <CountryFlagGroup
          max={1}
          renderSurplus={(count) => (
            <span data-testid="custom-surplus">{count} more</span>
          )}
        >
          <CountryFlag code="us" />
          <CountryFlag code="gb" />
          <CountryFlag code="ca" />
        </CountryFlagGroup>,
      );

      expect(screen.getByTestId("custom-surplus")).toHaveTextContent("2 more");
      expect(screen.queryByText("+2")).not.toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has role=group with a descriptive aria-label", () => {
      render(
        <CountryFlagGroup>
          <CountryFlag code="us" />
          <CountryFlag code="gb" />
        </CountryFlagGroup>,
      );

      const group = screen.getByRole("group");
      expect(group).toHaveAttribute(
        "aria-label",
        "Flag group with 2 flags",
      );
    });

    it("includes remaining count in aria-label when max is set", () => {
      render(
        <CountryFlagGroup max={1} size="md">
          <CountryFlag code="us" />
          <CountryFlag code="gb" />
          <CountryFlag code="ca" />
        </CountryFlagGroup>,
      );

      expect(screen.getByRole("group")).toHaveAttribute(
        "aria-label",
        "Flag group with 3 flags, 2 more not shown",
      );
    });

    it("uses singular 'flag' for a single child", () => {
      render(
        <CountryFlagGroup>
          <CountryFlag code="us" />
        </CountryFlagGroup>,
      );

      expect(screen.getByRole("group")).toHaveAttribute(
        "aria-label",
        "Flag group with 1 flag",
      );
    });
  });
});

// ---------------------------------------------------------------------------
// CountryFlagGroupCount
// ---------------------------------------------------------------------------

describe("CountryFlagGroupCount", () => {
  it("renders the count with a plus prefix", () => {
    render(<CountryFlagGroupCount count={5} />);

    expect(screen.getByText("+5")).toBeInTheDocument();
  });

  it("sets role=img with an accessible label", () => {
    render(<CountryFlagGroupCount count={3} />);

    const el = screen.getByRole("img");
    expect(el).toHaveAttribute(
      "aria-label",
      "3 more flags not shown",
    );
  });

  it("uses singular when count is 1", () => {
    render(<CountryFlagGroupCount count={1} />);

    expect(screen.getByRole("img")).toHaveAttribute(
      "aria-label",
      "1 more flag not shown",
    );
  });

  it("accepts size as a named preset", () => {
    render(<CountryFlagGroupCount count={2} size="xl" />);

    const el = screen.getByRole("img");
    // xl = 32px width, 24px height
    expect(el).toHaveStyle({ minWidth: "32px", height: "24px" });
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<CountryFlagGroupCount count={1} ref={ref} />);

    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });
});

// ---------------------------------------------------------------------------
// CountryFlagShimmer
// ---------------------------------------------------------------------------

describe("CountryFlagShimmer", () => {
  it("renders a loading placeholder with correct dimensions", () => {
    render(<CountryFlagShimmer size="lg" />);

    const el = screen.getByRole("status");
    // lg = 24px width, 18px height (24 * 0.75)
    expect(el).toHaveStyle({ width: "24px", height: "18px" });
  });

  it("announces loading state to screen readers", () => {
    render(<CountryFlagShimmer />);

    expect(screen.getByRole("status")).toHaveAttribute(
      "aria-label",
      "Loading flag",
    );
  });

  it("supports custom aspect ratio", () => {
    render(<CountryFlagShimmer size={40} aspectRatio={1} />);

    expect(screen.getByRole("status")).toHaveStyle({
      width: "40px",
      height: "40px",
    });
  });

  it("can disable animation", () => {
    render(<CountryFlagShimmer animate={false} />);

    expect(screen.getByRole("status").className).not.toContain("animate-pulse");
  });
});

// ---------------------------------------------------------------------------
// CountryFlagGroupShimmer
// ---------------------------------------------------------------------------

describe("CountryFlagGroupShimmer", () => {
  it("renders the specified number of shimmer items", () => {
    render(<CountryFlagGroupShimmer count={5} />);

    const el = screen.getByRole("status");
    // 5 shimmer spans inside the wrapper
    expect(el.querySelectorAll("span")).toHaveLength(5);
  });

  it("defaults to 3 shimmer items", () => {
    render(<CountryFlagGroupShimmer />);

    expect(screen.getByRole("status").querySelectorAll("span")).toHaveLength(3);
  });

  it("renders an extra placeholder when showCount is true", () => {
    render(<CountryFlagGroupShimmer count={2} showCount />);

    // 2 items + 1 count placeholder
    expect(screen.getByRole("status").querySelectorAll("span")).toHaveLength(3);
  });

  it("announces loading to screen readers", () => {
    render(<CountryFlagGroupShimmer />);

    expect(screen.getByRole("status")).toHaveAttribute(
      "aria-label",
      "Loading flag group",
    );
  });
});
