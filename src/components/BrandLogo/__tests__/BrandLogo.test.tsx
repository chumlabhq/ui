import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LogoMark, LogoWordmark, LogoFull } from "../index";

describe("BrandLogo", () => {
  describe("LogoMark", () => {
    it("renders an img element with correct alt text", () => {
      render(<LogoMark />);

      const img = screen.getByAltText("Chumlab");
      expect(img).toBeInTheDocument();
      expect(img.tagName).toBe("IMG");
    });

    it("uses default size of 32", () => {
      render(<LogoMark />);

      const img = screen.getByAltText("Chumlab");
      expect(img).toHaveAttribute("width", "32");
      expect(img).toHaveAttribute("height", "32");
    });

    it("applies custom size prop", () => {
      render(<LogoMark size={64} />);

      const img = screen.getByAltText("Chumlab");
      expect(img).toHaveAttribute("width", "64");
      expect(img).toHaveAttribute("height", "64");
    });

    it("applies custom className", () => {
      render(<LogoMark className="my-logo" />);

      const img = screen.getByAltText("Chumlab");
      expect(img).toHaveClass("my-logo");
    });

    it("has object-fit contain style", () => {
      render(<LogoMark />);

      const img = screen.getByAltText("Chumlab");
      expect(img).toHaveStyle({ objectFit: "contain" });
    });

    it("has correct displayName", () => {
      expect(LogoMark.displayName).toBe("LogoMark");
    });
  });

  describe("LogoWordmark", () => {
    it("renders the brand name text", () => {
      render(<LogoWordmark />);

      expect(screen.getByText("chum")).toBeInTheDocument();
      expect(screen.getByText("lab")).toBeInTheDocument();
    });

    it("renders 'chum' with bold styling", () => {
      render(<LogoWordmark />);

      const chum = screen.getByText("chum");
      expect(chum).toHaveClass("font-bold");
    });

    it("renders 'lab' with normal weight and reduced opacity", () => {
      render(<LogoWordmark />);

      const lab = screen.getByText("lab");
      expect(lab).toHaveClass("font-normal");
      expect(lab).toHaveClass("opacity-50");
    });

    it("applies custom className to outer span", () => {
      const { container } = render(<LogoWordmark className="custom-word" />);

      const outer = container.firstChild as HTMLElement;
      expect(outer).toHaveClass("custom-word");
    });

    it("uses Space Grotesk font family", () => {
      const { container } = render(<LogoWordmark />);

      const outer = container.firstChild as HTMLElement;
      expect(outer).toHaveStyle({ fontFamily: "'Space Grotesk', sans-serif" });
    });

    it("has correct displayName", () => {
      expect(LogoWordmark.displayName).toBe("LogoWordmark");
    });
  });

  describe("LogoFull", () => {
    it("renders both the logo mark image and the wordmark text", () => {
      render(<LogoFull />);

      expect(screen.getByAltText("Chumlab")).toBeInTheDocument();
      expect(screen.getByText("chum")).toBeInTheDocument();
      expect(screen.getByText("lab")).toBeInTheDocument();
    });

    it("uses default size of 28 for the logo mark", () => {
      render(<LogoFull />);

      const img = screen.getByAltText("Chumlab");
      expect(img).toHaveAttribute("width", "28");
      expect(img).toHaveAttribute("height", "28");
    });

    it("passes custom size to the logo mark", () => {
      render(<LogoFull size={48} />);

      const img = screen.getByAltText("Chumlab");
      expect(img).toHaveAttribute("width", "48");
      expect(img).toHaveAttribute("height", "48");
    });

    it("applies className to the outer wrapper", () => {
      const { container } = render(<LogoFull className="full-logo" />);

      const outer = container.firstChild as HTMLElement;
      expect(outer).toHaveClass("full-logo");
    });

    it("passes textClassName to the wordmark", () => {
      const { container } = render(<LogoFull textClassName="text-xl" />);

      // The wordmark span is the second child inside the outer wrapper
      const wordmark = container.querySelector(
        "span.inline-flex.items-baseline"
      );
      expect(wordmark).toHaveClass("text-xl");
    });

    it("has correct displayName", () => {
      expect(LogoFull.displayName).toBe("LogoFull");
    });

    it("renders as inline-flex with items-center", () => {
      const { container } = render(<LogoFull />);

      const outer = container.firstChild as HTMLElement;
      expect(outer).toHaveClass("inline-flex");
      expect(outer).toHaveClass("items-center");
    });
  });
});
