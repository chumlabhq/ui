import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Toggle } from "../index";

describe("Toggle", () => {
  describe("Rendering", () => {
    it("renders a button element", () => {
      render(<Toggle>Bold</Toggle>);

      expect(screen.getByRole("button", { name: "Bold" })).toBeInTheDocument();
    });

    it("renders children content", () => {
      render(<Toggle>Italic</Toggle>);

      expect(screen.getByText("Italic")).toBeInTheDocument();
    });

    it("has type button", () => {
      render(<Toggle>B</Toggle>);

      expect(screen.getByRole("button")).toHaveAttribute("type", "button");
    });
  });

  describe("Toggling on click", () => {
    it("toggles from unpressed to pressed on click", async () => {
      const user = userEvent.setup();

      render(<Toggle>Bold</Toggle>);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-pressed", "false");

      await user.click(button);

      expect(button).toHaveAttribute("aria-pressed", "true");
    });

    it("toggles from pressed back to unpressed on second click", async () => {
      const user = userEvent.setup();

      render(<Toggle defaultPressed>Bold</Toggle>);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-pressed", "true");

      await user.click(button);

      expect(button).toHaveAttribute("aria-pressed", "false");
    });

    it("calls onPressedChange with new state on click", async () => {
      const user = userEvent.setup();
      const onPressedChange = vi.fn();

      render(<Toggle onPressedChange={onPressedChange}>Bold</Toggle>);

      await user.click(screen.getByRole("button"));

      expect(onPressedChange).toHaveBeenCalledTimes(1);
      expect(onPressedChange).toHaveBeenCalledWith(true);
    });
  });

  describe("Controlled mode", () => {
    it("reflects the controlled pressed state", () => {
      render(
        <Toggle pressed onPressedChange={() => {}}>
          Bold
        </Toggle>
      );

      expect(screen.getByRole("button")).toHaveAttribute(
        "aria-pressed",
        "true"
      );
    });

    it("reflects controlled unpressed state", () => {
      render(
        <Toggle pressed={false} onPressedChange={() => {}}>
          Bold
        </Toggle>
      );

      expect(screen.getByRole("button")).toHaveAttribute(
        "aria-pressed",
        "false"
      );
    });

    it("calls onPressedChange when clicked in controlled mode", async () => {
      const user = userEvent.setup();
      const onPressedChange = vi.fn();

      render(
        <Toggle pressed={false} onPressedChange={onPressedChange}>
          Bold
        </Toggle>
      );

      await user.click(screen.getByRole("button"));

      expect(onPressedChange).toHaveBeenCalledWith(true);
    });
  });

  describe("aria-pressed", () => {
    it("sets aria-pressed to false by default", () => {
      render(<Toggle>Bold</Toggle>);

      expect(screen.getByRole("button")).toHaveAttribute(
        "aria-pressed",
        "false"
      );
    });

    it("sets aria-pressed to true when defaultPressed is true", () => {
      render(<Toggle defaultPressed>Bold</Toggle>);

      expect(screen.getByRole("button")).toHaveAttribute(
        "aria-pressed",
        "true"
      );
    });
  });

  describe("Disabled", () => {
    it("disables the button when disabled prop is set", () => {
      render(<Toggle disabled>Bold</Toggle>);

      expect(screen.getByRole("button")).toBeDisabled();
    });

    it("does not toggle when disabled", async () => {
      const user = userEvent.setup();
      const onPressedChange = vi.fn();

      render(
        <Toggle disabled onPressedChange={onPressedChange}>
          Bold
        </Toggle>
      );

      await user.click(screen.getByRole("button"));

      expect(onPressedChange).not.toHaveBeenCalled();
    });

    it("disables the button when loading", () => {
      render(<Toggle loading>Bold</Toggle>);

      expect(screen.getByRole("button")).toBeDisabled();
    });
  });

  describe("Sizes", () => {
    it("applies data-size attribute for sm", () => {
      render(<Toggle size="sm">B</Toggle>);

      expect(screen.getByRole("button")).toHaveAttribute("data-size", "sm");
    });

    it("applies data-size attribute for md", () => {
      render(<Toggle size="md">B</Toggle>);

      expect(screen.getByRole("button")).toHaveAttribute("data-size", "md");
    });

    it("applies data-size attribute for lg", () => {
      render(<Toggle size="lg">B</Toggle>);

      expect(screen.getByRole("button")).toHaveAttribute("data-size", "lg");
    });
  });

  describe("Custom classes", () => {
    it("applies className to the button", () => {
      render(<Toggle className="my-toggle">Bold</Toggle>);

      expect(screen.getByRole("button")).toHaveClass("my-toggle");
    });

    it("applies classes.root to the button", () => {
      render(
        <Toggle classes={{ root: "custom-root" }}>Bold</Toggle>
      );

      expect(screen.getByRole("button")).toHaveClass("custom-root");
    });

    it("applies classes.content to the inner span", () => {
      render(
        <Toggle classes={{ content: "custom-content" }}>Bold</Toggle>
      );

      const content = document.querySelector(".custom-content");
      expect(content).toBeInTheDocument();
      expect(content).toHaveTextContent("Bold");
    });
  });
});
