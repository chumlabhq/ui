import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RadioGroup, RadioButton } from "../index";

describe("RadioButton", () => {
  describe("Rendering", () => {
    it("renders a radiogroup", () => {
      render(
        <RadioGroup>
          <RadioButton value="a" label="Option A" />
          <RadioButton value="b" label="Option B" />
        </RadioGroup>
      );

      expect(screen.getByRole("radiogroup")).toBeInTheDocument();
    });

    it("renders radio inputs for each option", () => {
      render(
        <RadioGroup>
          <RadioButton value="a" label="Option A" />
          <RadioButton value="b" label="Option B" />
          <RadioButton value="c" label="Option C" />
        </RadioGroup>
      );

      expect(screen.getAllByRole("radio")).toHaveLength(3);
    });

    it("renders labels for each option", () => {
      render(
        <RadioGroup>
          <RadioButton value="a" label="Option A" />
          <RadioButton value="b" label="Option B" />
        </RadioGroup>
      );

      expect(screen.getByText("Option A")).toBeInTheDocument();
      expect(screen.getByText("Option B")).toBeInTheDocument();
    });

    it("renders group label", () => {
      render(
        <RadioGroup label="Choose one">
          <RadioButton value="a" label="Option A" />
        </RadioGroup>
      );

      expect(screen.getByText("Choose one")).toBeInTheDocument();
    });

    it("renders group description", () => {
      render(
        <RadioGroup label="Pick" description="Pick your favorite">
          <RadioButton value="a" label="Option A" />
        </RadioGroup>
      );

      expect(screen.getByText("Pick your favorite")).toBeInTheDocument();
    });

    it("renders required indicator", () => {
      render(
        <RadioGroup label="Selection" required>
          <RadioButton value="a" label="A" />
        </RadioGroup>
      );

      expect(screen.getByText("*")).toBeInTheDocument();
    });

    it("renders error message", () => {
      render(
        <RadioGroup error errorMessage="Please select an option">
          <RadioButton value="a" label="A" />
        </RadioGroup>
      );

      expect(screen.getByRole("alert")).toHaveTextContent(
        "Please select an option"
      );
    });
  });

  describe("Selecting an option", () => {
    it("selects an option on click", async () => {
      const user = userEvent.setup();

      render(
        <RadioGroup>
          <RadioButton value="a" label="Option A" />
          <RadioButton value="b" label="Option B" />
        </RadioGroup>
      );

      const radios = screen.getAllByRole("radio");
      expect(radios[0]).not.toBeChecked();
      expect(radios[1]).not.toBeChecked();

      await user.click(radios[1]);

      expect(radios[1]).toBeChecked();
      expect(radios[0]).not.toBeChecked();
    });

    it("calls onValueChange when an option is selected", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();

      render(
        <RadioGroup onValueChange={onValueChange}>
          <RadioButton value="a" label="Option A" />
          <RadioButton value="b" label="Option B" />
        </RadioGroup>
      );

      await user.click(screen.getAllByRole("radio")[1]);

      expect(onValueChange).toHaveBeenCalledTimes(1);
      expect(onValueChange).toHaveBeenCalledWith("b");
    });

    it("switches selection between options", async () => {
      const user = userEvent.setup();

      render(
        <RadioGroup>
          <RadioButton value="a" label="Option A" />
          <RadioButton value="b" label="Option B" />
        </RadioGroup>
      );

      const radios = screen.getAllByRole("radio");

      await user.click(radios[0]);
      expect(radios[0]).toBeChecked();

      await user.click(radios[1]);
      expect(radios[1]).toBeChecked();
      expect(radios[0]).not.toBeChecked();
    });
  });

  describe("Controlled mode", () => {
    it("reflects the controlled value", () => {
      render(
        <RadioGroup value="b" onValueChange={() => {}}>
          <RadioButton value="a" label="Option A" />
          <RadioButton value="b" label="Option B" />
        </RadioGroup>
      );

      const radios = screen.getAllByRole("radio");
      expect(radios[0]).not.toBeChecked();
      expect(radios[1]).toBeChecked();
    });

    it("calls onValueChange when clicking a different option", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();

      render(
        <RadioGroup value="a" onValueChange={onValueChange}>
          <RadioButton value="a" label="Option A" />
          <RadioButton value="b" label="Option B" />
        </RadioGroup>
      );

      await user.click(screen.getAllByRole("radio")[1]);

      expect(onValueChange).toHaveBeenCalledWith("b");
    });

    it("selects the defaultValue initially in uncontrolled mode", () => {
      render(
        <RadioGroup defaultValue="b">
          <RadioButton value="a" label="Option A" />
          <RadioButton value="b" label="Option B" />
        </RadioGroup>
      );

      const radios = screen.getAllByRole("radio");
      expect(radios[0]).not.toBeChecked();
      expect(radios[1]).toBeChecked();
    });
  });

  describe("Disabled", () => {
    it("disables all radio buttons when group is disabled", () => {
      render(
        <RadioGroup disabled>
          <RadioButton value="a" label="Option A" />
          <RadioButton value="b" label="Option B" />
        </RadioGroup>
      );

      const radios = screen.getAllByRole("radio");
      expect(radios[0]).toBeDisabled();
      expect(radios[1]).toBeDisabled();
    });

    it("disables individual radio buttons", () => {
      render(
        <RadioGroup>
          <RadioButton value="a" label="Option A" />
          <RadioButton value="b" label="Option B" disabled />
        </RadioGroup>
      );

      const radios = screen.getAllByRole("radio");
      expect(radios[0]).not.toBeDisabled();
      expect(radios[1]).toBeDisabled();
    });

    it("does not call onValueChange when group is disabled", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();

      render(
        <RadioGroup disabled onValueChange={onValueChange}>
          <RadioButton value="a" label="Option A" />
          <RadioButton value="b" label="Option B" />
        </RadioGroup>
      );

      await user.click(screen.getAllByRole("radio")[0]);

      expect(onValueChange).not.toHaveBeenCalled();
    });
  });

  describe("checked state", () => {
    it("checks the selected radio", () => {
      render(
        <RadioGroup defaultValue="a">
          <RadioButton value="a" label="Option A" />
          <RadioButton value="b" label="Option B" />
        </RadioGroup>
      );

      const radios = screen.getAllByRole("radio");
      expect(radios[0]).toBeChecked();
      expect(radios[1]).not.toBeChecked();
    });

    it("updates checked state when selection changes", async () => {
      const user = userEvent.setup();

      render(
        <RadioGroup defaultValue="a">
          <RadioButton value="a" label="Option A" />
          <RadioButton value="b" label="Option B" />
        </RadioGroup>
      );

      const radios = screen.getAllByRole("radio");
      expect(radios[0]).toBeChecked();

      await user.click(radios[1]);

      expect(radios[0]).not.toBeChecked();
      expect(radios[1]).toBeChecked();
    });
  });

  describe("Keyboard navigation", () => {
    it("can select a radio option via keyboard", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();

      render(
        <RadioGroup onValueChange={onValueChange}>
          <RadioButton value="a" label="Option A" />
          <RadioButton value="b" label="Option B" />
        </RadioGroup>
      );

      // Tab to the first radio and activate it
      await user.tab();
      await user.keyboard(" ");

      expect(onValueChange).toHaveBeenCalledWith("a");
    });

    it("focuses on radio inputs via tab", async () => {
      const user = userEvent.setup();

      render(
        <RadioGroup>
          <RadioButton value="a" label="Option A" />
          <RadioButton value="b" label="Option B" />
        </RadioGroup>
      );

      await user.tab();

      const radios = screen.getAllByRole("radio");
      // One of the radios should be focused
      expect(
        radios[0] === document.activeElement ||
          radios[1] === document.activeElement
      ).toBe(true);
    });
  });

  describe("Custom classes", () => {
    it("applies className to the radiogroup container", () => {
      render(
        <RadioGroup className="my-group">
          <RadioButton value="a" label="A" />
        </RadioGroup>
      );

      expect(screen.getByRole("radiogroup")).toHaveClass("my-group");
    });

    it("applies group classes.root to radiogroup", () => {
      render(
        <RadioGroup classes={{ root: "group-root" }}>
          <RadioButton value="a" label="A" />
        </RadioGroup>
      );

      expect(screen.getByRole("radiogroup")).toHaveClass("group-root");
    });

    it("applies classes.root to individual radio button labels", () => {
      render(
        <RadioGroup>
          <RadioButton value="a" label="A" classes={{ root: "radio-root" }} />
        </RadioGroup>
      );

      const root = document.querySelector(".radio-root");
      expect(root).toBeInTheDocument();
    });
  });
});
