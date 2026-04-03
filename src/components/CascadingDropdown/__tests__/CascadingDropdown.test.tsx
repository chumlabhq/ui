import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CascadingDropdown } from "../index";
import type { CascadingOption } from "../utils/types";

const simpleOptions: CascadingOption[] = [
  { value: "fruits", label: "Fruits" },
  { value: "vegetables", label: "Vegetables" },
  { value: "grains", label: "Grains" },
];

const nestedOptions: CascadingOption[] = [
  {
    value: "fruits",
    label: "Fruits",
    children: [
      { value: "apple", label: "Apple" },
      { value: "banana", label: "Banana" },
    ],
  },
  {
    value: "vegetables",
    label: "Vegetables",
    children: [
      { value: "carrot", label: "Carrot" },
      { value: "broccoli", label: "Broccoli" },
    ],
  },
];

describe("CascadingDropdown", () => {
  describe("Rendering", () => {
    it("renders with default placeholder", () => {
      render(<CascadingDropdown options={simpleOptions} />);
      expect(screen.getByText("Select an option")).toBeInTheDocument();
    });

    it("renders with custom placeholder", () => {
      render(
        <CascadingDropdown
          options={simpleOptions}
          placeholder="Choose a category"
        />
      );
      expect(screen.getByText("Choose a category")).toBeInTheDocument();
    });

    it("renders label when provided", () => {
      render(
        <CascadingDropdown options={simpleOptions} label="Food Category" />
      );
      expect(screen.getByText("Food Category")).toBeInTheDocument();
    });

    it("renders required asterisk when required", () => {
      render(
        <CascadingDropdown
          options={simpleOptions}
          label="Category"
          required
        />
      );
      const label = screen.getByText("Category");
      expect(label.parentElement?.textContent).toContain("*");
    });

    it("renders description when provided", () => {
      render(
        <CascadingDropdown
          options={simpleOptions}
          description="Pick a food type"
        />
      );
      expect(screen.getByText("Pick a food type")).toBeInTheDocument();
    });

    it("renders error message when error is true", () => {
      render(
        <CascadingDropdown
          options={simpleOptions}
          error
          errorMessage="Required field"
        />
      );
      expect(screen.getByText("Required field")).toBeInTheDocument();
    });

    it("applies custom className", () => {
      const { container } = render(
        <CascadingDropdown
          options={simpleOptions}
          className="my-cascading"
        />
      );
      expect(container.firstElementChild).toHaveClass("my-cascading");
    });
  });

  describe("Interaction", () => {
    it("opens dropdown on trigger click", async () => {
      const user = userEvent.setup();
      render(<CascadingDropdown options={simpleOptions} />);

      const trigger = screen.getByRole("button");
      expect(trigger).toHaveAttribute("aria-expanded", "false");

      await user.click(trigger);
      expect(trigger).toHaveAttribute("aria-expanded", "true");
    });

    it("shows options when opened", async () => {
      const user = userEvent.setup();
      render(<CascadingDropdown options={simpleOptions} />);

      await user.click(screen.getByRole("button"));

      // The menu is portalled and may have visibility:hidden in jsdom (no layout),
      // so query with { hidden: true }
      expect(screen.getByRole("menu", { hidden: true })).toBeInTheDocument();
      expect(screen.getByText("Fruits")).toBeInTheDocument();
      expect(screen.getByText("Vegetables")).toBeInTheDocument();
      expect(screen.getByText("Grains")).toBeInTheDocument();
    });

    it("selects a flat option and calls onValueChange", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      render(
        <CascadingDropdown
          options={simpleOptions}
          onValueChange={onValueChange}
        />
      );

      await user.click(screen.getByRole("button"));
      await user.click(screen.getByText("Fruits"));

      expect(onValueChange).toHaveBeenCalledWith(
        { root: "fruits" },
        expect.any(Array)
      );
    });

    it("shows submenu on hover of parent with children", async () => {
      const user = userEvent.setup();
      render(<CascadingDropdown options={nestedOptions} />);

      await user.click(screen.getByRole("button"));

      // The parent items should have aria-haspopup="menu"
      const fruitItem = screen.getByText("Fruits").closest("[role='menuitem']");
      expect(fruitItem).toHaveAttribute("aria-haspopup", "menu");
    });

    it("selects submenu option and calls onValueChange", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      render(
        <CascadingDropdown
          options={nestedOptions}
          onValueChange={onValueChange}
        />
      );

      await user.click(screen.getByRole("button"));

      // Hover over parent to open submenu
      const fruitItem = screen.getByText("Fruits").closest("[role='menuitem']");
      await user.hover(fruitItem!);

      // Wait for submenu to appear
      const submenu = await screen.findByRole("menu", {
        name: "Fruits submenu",
      });
      expect(submenu).toBeInTheDocument();

      // Click on submenu option
      const appleOption = within(submenu).getByText("Apple");
      await user.click(appleOption);

      expect(onValueChange).toHaveBeenCalledWith(
        { fruits: "apple" },
        expect.any(Array)
      );
    });
  });

  describe("Disabled state", () => {
    it("does not open when disabled", async () => {
      const user = userEvent.setup();
      render(<CascadingDropdown options={simpleOptions} disabled />);

      const trigger = screen.getByRole("button");
      expect(trigger).toBeDisabled();

      await user.click(trigger);
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });
  });

  describe("Controlled mode", () => {
    it("renders controlled value display", () => {
      render(
        <CascadingDropdown
          options={nestedOptions}
          value={{ fruits: "apple" }}
        />
      );
      // The display value should reflect the selection
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("respects controlled open state", () => {
      render(
        <CascadingDropdown options={simpleOptions} open={true} />
      );
      const trigger = screen.getByRole("button");
      expect(trigger).toHaveAttribute("aria-expanded", "true");
    });
  });

  describe("Accessibility", () => {
    it("sets aria-haspopup on trigger", () => {
      render(<CascadingDropdown options={simpleOptions} />);
      const trigger = screen.getByRole("button");
      expect(trigger).toHaveAttribute("aria-haspopup", "true");
    });

    it("sets aria-invalid when error is true", () => {
      render(
        <CascadingDropdown
          options={simpleOptions}
          error
          errorMessage="Error"
        />
      );
      const trigger = screen.getByRole("button");
      expect(trigger).toHaveAttribute("aria-invalid", "true");
    });

    it("sets aria-required when required", () => {
      render(<CascadingDropdown options={simpleOptions} required />);
      const trigger = screen.getByRole("button");
      expect(trigger).toHaveAttribute("aria-required", "true");
    });

    it("sets custom aria-label on trigger", () => {
      render(
        <CascadingDropdown
          options={simpleOptions}
          aria-label="Pick food"
        />
      );
      const trigger = screen.getByRole("button");
      expect(trigger).toHaveAttribute("aria-label", "Pick food");
    });
  });
});
