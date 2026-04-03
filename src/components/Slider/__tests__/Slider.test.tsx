import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Slider } from "../index";

describe("Slider", () => {
  describe("Rendering", () => {
    it("renders a slider element", () => {
      render(<Slider />);

      expect(screen.getByRole("slider")).toBeInTheDocument();
    });

    it("renders with a label", () => {
      render(<Slider label="Volume" />);

      expect(screen.getByText("Volume")).toBeInTheDocument();
    });

    it("renders with a description", () => {
      render(<Slider label="Volume" description="Adjust the volume level" />);

      expect(screen.getByText("Adjust the volume level")).toBeInTheDocument();
    });

    it("renders required indicator when required", () => {
      render(<Slider label="Volume" required />);

      expect(screen.getByText("*")).toBeInTheDocument();
    });

    it("renders error message when error is set", () => {
      render(<Slider error errorMessage="Value is out of range" />);

      expect(screen.getByRole("alert")).toHaveTextContent(
        "Value is out of range"
      );
    });

    it("renders success message when success is set", () => {
      render(<Slider success successMessage="Looks good!" />);

      expect(screen.getByText("Looks good!")).toBeInTheDocument();
    });
  });

  describe("Value display", () => {
    it("displays default value of 0 via aria-valuenow", () => {
      render(<Slider />);

      expect(screen.getByRole("slider")).toHaveAttribute(
        "aria-valuenow",
        "0"
      );
    });

    it("displays the provided defaultValue via aria-valuenow", () => {
      render(<Slider defaultValue={42} />);

      expect(screen.getByRole("slider")).toHaveAttribute(
        "aria-valuenow",
        "42"
      );
    });
  });

  describe("Controlled mode", () => {
    it("reflects the controlled value", () => {
      render(<Slider value={75} onValueChange={() => {}} />);

      expect(screen.getByRole("slider")).toHaveAttribute(
        "aria-valuenow",
        "75"
      );
    });

    it("calls onValueChange when value changes via keyboard", () => {
      const onValueChange = vi.fn();

      render(<Slider value={50} onValueChange={onValueChange} />);

      const slider = screen.getByRole("slider");
      fireEvent.keyDown(slider, { key: "ArrowRight" });

      expect(onValueChange).toHaveBeenCalled();
    });
  });

  describe("min / max / step", () => {
    it("uses custom min and max", () => {
      render(<Slider min={10} max={200} defaultValue={10} />);

      const slider = screen.getByRole("slider");
      expect(slider).toHaveAttribute("aria-valuemin", "10");
      expect(slider).toHaveAttribute("aria-valuemax", "200");
    });

    it("steps by the specified amount via keyboard", () => {
      const onValueChange = vi.fn();

      render(
        <Slider
          defaultValue={50}
          step={5}
          onValueChange={onValueChange}
        />
      );

      const slider = screen.getByRole("slider");
      fireEvent.keyDown(slider, { key: "ArrowRight" });

      expect(onValueChange).toHaveBeenCalledWith(55);
    });
  });

  describe("Disabled", () => {
    it("sets aria-disabled when disabled", () => {
      render(<Slider disabled />);

      expect(screen.getByRole("slider")).toHaveAttribute("aria-disabled", "true");
    });

    it("sets tabIndex to -1 when disabled", () => {
      render(<Slider disabled />);

      expect(screen.getByRole("slider")).toHaveAttribute("tabindex", "-1");
    });

    it("does not change value via keyboard when disabled", () => {
      const onValueChange = vi.fn();

      render(
        <Slider
          defaultValue={50}
          disabled
          onValueChange={onValueChange}
        />
      );

      const slider = screen.getByRole("slider");
      fireEvent.keyDown(slider, { key: "ArrowRight" });

      expect(onValueChange).not.toHaveBeenCalled();
    });
  });

  describe("Accessibility attributes", () => {
    it("sets aria-valuemin, aria-valuemax, and aria-valuenow", () => {
      render(<Slider min={5} max={95} defaultValue={50} />);

      const slider = screen.getByRole("slider");
      expect(slider).toHaveAttribute("aria-valuemin", "5");
      expect(slider).toHaveAttribute("aria-valuemax", "95");
      expect(slider).toHaveAttribute("aria-valuenow", "50");
    });

    it("applies aria-label to the thumb", () => {
      render(<Slider aria-label="Brightness" />);

      expect(screen.getByRole("slider")).toHaveAttribute(
        "aria-label",
        "Brightness"
      );
    });

    it("sets aria-orientation", () => {
      render(<Slider orientation="vertical" />);

      expect(screen.getByRole("slider")).toHaveAttribute(
        "aria-orientation",
        "vertical"
      );
    });

    it("sets default aria-label to Minimum for single thumb", () => {
      render(<Slider />);

      expect(screen.getByRole("slider")).toHaveAttribute(
        "aria-label",
        "Minimum"
      );
    });
  });

  describe("Keyboard interaction", () => {
    it("increases value with ArrowRight", () => {
      const onValueChange = vi.fn();

      render(<Slider defaultValue={50} onValueChange={onValueChange} />);

      const slider = screen.getByRole("slider");
      fireEvent.keyDown(slider, { key: "ArrowRight" });

      expect(onValueChange).toHaveBeenCalledWith(51);
    });

    it("decreases value with ArrowLeft", () => {
      const onValueChange = vi.fn();

      render(<Slider defaultValue={50} onValueChange={onValueChange} />);

      const slider = screen.getByRole("slider");
      fireEvent.keyDown(slider, { key: "ArrowLeft" });

      expect(onValueChange).toHaveBeenCalledWith(49);
    });

    it("jumps to min on Home key", () => {
      const onValueChange = vi.fn();

      render(
        <Slider defaultValue={50} min={10} onValueChange={onValueChange} />
      );

      const slider = screen.getByRole("slider");
      fireEvent.keyDown(slider, { key: "Home" });

      expect(onValueChange).toHaveBeenCalledWith(10);
    });

    it("jumps to max on End key", () => {
      const onValueChange = vi.fn();

      render(
        <Slider defaultValue={50} max={90} onValueChange={onValueChange} />
      );

      const slider = screen.getByRole("slider");
      fireEvent.keyDown(slider, { key: "End" });

      expect(onValueChange).toHaveBeenCalledWith(90);
    });

    it("clamps value at max boundary", () => {
      render(
        <Slider defaultValue={100} max={100} />
      );

      const slider = screen.getByRole("slider");
      fireEvent.keyDown(slider, { key: "ArrowRight" });

      // Value stays at max
      expect(slider).toHaveAttribute("aria-valuenow", "100");
    });

    it("clamps value at min boundary", () => {
      render(
        <Slider defaultValue={0} min={0} />
      );

      const slider = screen.getByRole("slider");
      fireEvent.keyDown(slider, { key: "ArrowLeft" });

      // Value stays at min
      expect(slider).toHaveAttribute("aria-valuenow", "0");
    });
  });

  describe("Custom classes", () => {
    it("applies className to the root element", () => {
      const { container } = render(<Slider className="my-slider" />);

      expect(container.firstChild).toHaveClass("my-slider");
    });

    it("applies classes.root to root container", () => {
      render(<Slider classes={{ root: "custom-root" }} />);

      const root = document.querySelector(".custom-root");
      expect(root).toBeInTheDocument();
    });
  });
});
