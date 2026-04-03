import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import CircularLoader from "../CircularLoader";
import LinearLoader from "../LinearLoader";
import DotLoader from "../DotLoader";
import PulseLoader from "../PulseLoader";

describe("CircularLoader", () => {
  it("renders with role='status' and aria-label", () => {
    render(<CircularLoader />);
    const loader = screen.getByRole("status");
    expect(loader).toBeInTheDocument();
    expect(loader).toHaveAttribute("aria-label", "Loading");
  });

  it("renders an SVG element", () => {
    render(<CircularLoader />);
    const loader = screen.getByRole("status");
    expect(loader.querySelector("svg")).toBeInTheDocument();
  });

  it("applies default size via CSS variable", () => {
    render(<CircularLoader />);
    const loader = screen.getByRole("status");
    expect(loader.style.getPropertyValue("--loader-size")).toBe("20px");
  });

  it("applies custom size via CSS variable", () => {
    render(<CircularLoader size={48} />);
    const loader = screen.getByRole("status");
    expect(loader.style.getPropertyValue("--loader-size")).toBe("48px");
  });

  it("applies custom speed via CSS variable", () => {
    render(<CircularLoader speed={2} />);
    const loader = screen.getByRole("status");
    expect(loader.style.getPropertyValue("--loader-speed")).toBe("2s");
  });

  it("applies custom trackColor via CSS variable", () => {
    render(<CircularLoader trackColor="red" />);
    const loader = screen.getByRole("status");
    expect(loader.style.getPropertyValue("--loader-track")).toBe("red");
  });

  it("applies custom className", () => {
    render(<CircularLoader className="my-custom-class" />);
    const loader = screen.getByRole("status");
    expect(loader).toHaveClass("my-custom-class");
  });

  it("sets data-reduce-motion when reduceMotion is true", () => {
    render(<CircularLoader reduceMotion={true} />);
    const loader = screen.getByRole("status");
    expect(loader).toHaveAttribute("data-reduce-motion", "true");
  });

  it("forwards additional HTML attributes", () => {
    render(<CircularLoader data-testid="circular" />);
    expect(screen.getByTestId("circular")).toBeInTheDocument();
  });

  it("uses custom thickness for circles", () => {
    render(<CircularLoader thickness={4} />);
    const loader = screen.getByRole("status");
    const circles = loader.querySelectorAll("circle");
    expect(circles.length).toBe(2);
    circles.forEach((circle) => {
      expect(circle.getAttribute("stroke-width")).toBe("4");
    });
  });
});

describe("LinearLoader", () => {
  it("renders with role='status' and aria-label", () => {
    render(<LinearLoader />);
    const loader = screen.getByRole("status");
    expect(loader).toBeInTheDocument();
    expect(loader).toHaveAttribute("aria-label", "Loading");
  });

  it("applies default height", () => {
    render(<LinearLoader />);
    const loader = screen.getByRole("status");
    expect(loader.style.height).toBe("4px");
  });

  it("applies custom height", () => {
    render(<LinearLoader height={8} />);
    const loader = screen.getByRole("status");
    expect(loader.style.height).toBe("8px");
  });

  it("applies default width of 100%", () => {
    render(<LinearLoader />);
    const loader = screen.getByRole("status");
    expect(loader.style.width).toBe("100%");
  });

  it("applies numeric width in px", () => {
    render(<LinearLoader width={200} />);
    const loader = screen.getByRole("status");
    expect(loader.style.width).toBe("200px");
  });

  it("applies string width directly", () => {
    render(<LinearLoader width="50%" />);
    const loader = screen.getByRole("status");
    expect(loader.style.width).toBe("50%");
  });

  it("applies custom borderRadius", () => {
    render(<LinearLoader borderRadius={4} />);
    const loader = screen.getByRole("status");
    expect(loader.style.borderRadius).toBe("4px");
  });

  it("applies custom className", () => {
    render(<LinearLoader className="my-linear" />);
    const loader = screen.getByRole("status");
    expect(loader).toHaveClass("my-linear");
  });

  it("sets data-reduce-motion when reduceMotion is true", () => {
    render(<LinearLoader reduceMotion={true} />);
    const loader = screen.getByRole("status");
    expect(loader).toHaveAttribute("data-reduce-motion", "true");
  });

  it("applies custom trackColor as background", () => {
    render(<LinearLoader trackColor="blue" />);
    const loader = screen.getByRole("status");
    expect(loader.style.backgroundColor).toBe("blue");
  });
});

describe("DotLoader", () => {
  it("renders with role='status' and aria-label", () => {
    render(<DotLoader />);
    const loader = screen.getByRole("status");
    expect(loader).toBeInTheDocument();
    expect(loader).toHaveAttribute("aria-label", "Loading");
  });

  it("renders 3 dots by default", () => {
    render(<DotLoader />);
    const loader = screen.getByRole("status");
    // Filter out the <style> element
    const dotElements = Array.from(loader.children).filter(
      (el) => el.tagName !== "STYLE"
    );
    expect(dotElements).toHaveLength(3);
  });

  it("renders custom number of dots", () => {
    render(<DotLoader count={5} />);
    const loader = screen.getByRole("status");
    const dotElements = Array.from(loader.children).filter(
      (el) => el.tagName !== "STYLE"
    );
    expect(dotElements).toHaveLength(5);
  });

  it("applies custom dotSize", () => {
    render(<DotLoader dotSize={12} />);
    const loader = screen.getByRole("status");
    const firstDot = Array.from(loader.children).find(
      (el) => el.tagName !== "STYLE"
    ) as HTMLElement;
    expect(firstDot.style.width).toBe("12px");
    expect(firstDot.style.height).toBe("12px");
  });

  it("applies custom gap", () => {
    render(<DotLoader gap={8} />);
    const loader = screen.getByRole("status");
    expect(loader.style.gap).toBe("8px");
  });

  it("applies custom className", () => {
    render(<DotLoader className="my-dots" />);
    const loader = screen.getByRole("status");
    expect(loader).toHaveClass("my-dots");
  });

  it("sets data-reduce-motion when reduceMotion is true", () => {
    render(<DotLoader reduceMotion={true} />);
    const loader = screen.getByRole("status");
    expect(loader).toHaveAttribute("data-reduce-motion", "true");
  });
});

describe("PulseLoader", () => {
  it("renders with role='status' and aria-label", () => {
    render(<PulseLoader />);
    const loader = screen.getByRole("status");
    expect(loader).toBeInTheDocument();
    expect(loader).toHaveAttribute("aria-label", "Loading");
  });

  it("applies default size of 40px", () => {
    render(<PulseLoader />);
    const loader = screen.getByRole("status");
    expect(loader.style.width).toBe("40px");
    expect(loader.style.height).toBe("40px");
  });

  it("applies custom size", () => {
    render(<PulseLoader size={60} />);
    const loader = screen.getByRole("status");
    expect(loader.style.width).toBe("60px");
    expect(loader.style.height).toBe("60px");
  });

  it("renders core dot and default 2 rings", () => {
    render(<PulseLoader />);
    const loader = screen.getByRole("status");
    const spanElements = Array.from(loader.children).filter(
      (el) => el.tagName === "SPAN"
    );
    // 1 core dot + 2 rings
    expect(spanElements).toHaveLength(3);
  });

  it("renders custom number of rings", () => {
    render(<PulseLoader rings={4} />);
    const loader = screen.getByRole("status");
    const spanElements = Array.from(loader.children).filter(
      (el) => el.tagName === "SPAN"
    );
    // 1 core dot + 4 rings
    expect(spanElements).toHaveLength(5);
  });

  it("applies custom className", () => {
    render(<PulseLoader className="my-pulse" />);
    const loader = screen.getByRole("status");
    expect(loader).toHaveClass("my-pulse");
  });

  it("sets data-reduce-motion when reduceMotion is true", () => {
    render(<PulseLoader reduceMotion={true} />);
    const loader = screen.getByRole("status");
    expect(loader).toHaveAttribute("data-reduce-motion", "true");
  });

  it("forwards additional HTML attributes", () => {
    render(<PulseLoader data-testid="pulse" />);
    expect(screen.getByTestId("pulse")).toBeInTheDocument();
  });
});
