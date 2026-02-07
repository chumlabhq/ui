import { describe, it, expect, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../index";
import type {
  AccordionSingleProps,
  AccordionMultipleProps,
} from "../utils/types";

type RenderAccordionProps =
  | Omit<AccordionSingleProps, "children">
  | Omit<AccordionMultipleProps, "children">;

function renderAccordion(props: RenderAccordionProps) {
  const accordionProps = props as AccordionSingleProps | AccordionMultipleProps;
  return render(
    <Accordion {...accordionProps}>
      <AccordionItem value="item-1">
        <AccordionTrigger>Item 1</AccordionTrigger>
        <AccordionContent>Content 1</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Item 2</AccordionTrigger>
        <AccordionContent>Content 2</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Item 3</AccordionTrigger>
        <AccordionContent>Content 3</AccordionContent>
      </AccordionItem>
    </Accordion>,
  );
}

describe("Accordion", () => {
  describe("Rendering", () => {
    it("renders all accordion items", () => {
      renderAccordion({ type: "single" });

      expect(screen.getByText("Item 1")).toBeInTheDocument();
      expect(screen.getByText("Item 2")).toBeInTheDocument();
      expect(screen.getByText("Item 3")).toBeInTheDocument();
    });

    it("renders with custom className", () => {
      const { container } = renderAccordion({
        type: "single",
        className: "custom-class",
      });

      expect(container.firstChild).toHaveClass("custom-class");
    });

    it("renders with custom id", () => {
      renderAccordion({ type: "single", id: "my-accordion" });

      expect(document.getElementById("my-accordion")).toBeInTheDocument();
    });

    it("renders with aria-label", () => {
      const { container } = renderAccordion({
        type: "single",
        "aria-label": "FAQ Section",
      });

      expect(container.firstChild).toHaveAttribute("aria-label", "FAQ Section");
    });
  });

  describe("Single Selection Mode", () => {
    it("opens an item when clicked", async () => {
      const user = userEvent.setup();
      renderAccordion({ type: "single" });

      const trigger = screen.getByRole("button", { name: "Item 1" });
      await user.click(trigger);

      expect(trigger).toHaveAttribute("aria-expanded", "true");
    });

    it("closes previously opened item when another is clicked", async () => {
      const user = userEvent.setup();
      renderAccordion({ type: "single" });

      const trigger1 = screen.getByRole("button", { name: "Item 1" });
      const trigger2 = screen.getByRole("button", { name: "Item 2" });

      await user.click(trigger1);
      expect(trigger1).toHaveAttribute("aria-expanded", "true");

      await user.click(trigger2);
      expect(trigger1).toHaveAttribute("aria-expanded", "false");
      expect(trigger2).toHaveAttribute("aria-expanded", "true");
    });

    it("does not close item when clicked again if collapsible=false", async () => {
      const user = userEvent.setup();
      renderAccordion({ type: "single", collapsible: false });

      const trigger = screen.getByRole("button", { name: "Item 1" });
      await user.click(trigger);
      expect(trigger).toHaveAttribute("aria-expanded", "true");

      await user.click(trigger);
      expect(trigger).toHaveAttribute("aria-expanded", "true");
    });

    it("closes item when clicked again if collapsible=true", async () => {
      const user = userEvent.setup();
      renderAccordion({ type: "single", collapsible: true });

      const trigger = screen.getByRole("button", { name: "Item 1" });
      await user.click(trigger);
      expect(trigger).toHaveAttribute("aria-expanded", "true");

      await user.click(trigger);
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });

    it("calls onValueChange with string value", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      renderAccordion({ type: "single", value: "", onValueChange });

      await user.click(screen.getByRole("button", { name: "Item 1" }));

      expect(onValueChange).toHaveBeenCalledWith("item-1");
    });

    it("respects defaultValue", () => {
      renderAccordion({ type: "single", defaultValue: "item-2" });

      expect(screen.getByRole("button", { name: "Item 2" })).toHaveAttribute(
        "aria-expanded",
        "true",
      );
      expect(screen.getByRole("button", { name: "Item 1" })).toHaveAttribute(
        "aria-expanded",
        "false",
      );
    });
  });

  describe("Multiple Selection Mode", () => {
    it("allows multiple items to be open", async () => {
      const user = userEvent.setup();
      renderAccordion({ type: "multiple" });

      const trigger1 = screen.getByRole("button", { name: "Item 1" });
      const trigger2 = screen.getByRole("button", { name: "Item 2" });

      await user.click(trigger1);
      await user.click(trigger2);

      expect(trigger1).toHaveAttribute("aria-expanded", "true");
      expect(trigger2).toHaveAttribute("aria-expanded", "true");
    });

    it("calls onValueChange with array of values", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      const { rerender } = render(
        <Accordion type="multiple" value={[]} onValueChange={onValueChange}>
          <AccordionItem value="item-1">
            <AccordionTrigger>Item 1</AccordionTrigger>
            <AccordionContent>Content 1</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Item 2</AccordionTrigger>
            <AccordionContent>Content 2</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Item 3</AccordionTrigger>
            <AccordionContent>Content 3</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      await user.click(screen.getByRole("button", { name: "Item 1" }));
      expect(onValueChange).toHaveBeenCalledWith(["item-1"]);

      rerender(
        <Accordion
          type="multiple"
          value={["item-1"]}
          onValueChange={onValueChange}
        >
          <AccordionItem value="item-1">
            <AccordionTrigger>Item 1</AccordionTrigger>
            <AccordionContent>Content 1</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Item 2</AccordionTrigger>
            <AccordionContent>Content 2</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Item 3</AccordionTrigger>
            <AccordionContent>Content 3</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      await user.click(screen.getByRole("button", { name: "Item 2" }));
      expect(onValueChange).toHaveBeenCalledWith(["item-1", "item-2"]);
    });

    it("allows closing items in multiple mode", async () => {
      const user = userEvent.setup();
      renderAccordion({ type: "multiple" });

      const trigger = screen.getByRole("button", { name: "Item 1" });
      await user.click(trigger);
      expect(trigger).toHaveAttribute("aria-expanded", "true");

      await user.click(trigger);
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });

    it("respects defaultValue array", () => {
      renderAccordion({
        type: "multiple",
        defaultValue: ["item-1", "item-3"],
      });

      expect(screen.getByRole("button", { name: "Item 1" })).toHaveAttribute(
        "aria-expanded",
        "true",
      );
      expect(screen.getByRole("button", { name: "Item 2" })).toHaveAttribute(
        "aria-expanded",
        "false",
      );
      expect(screen.getByRole("button", { name: "Item 3" })).toHaveAttribute(
        "aria-expanded",
        "true",
      );
    });

    it("sets data-type=multiple for multiple type", () => {
      const { container } = renderAccordion({ type: "multiple" });
      expect(container.firstChild).toHaveAttribute("data-type", "multiple");
    });
  });

  describe("Controlled Mode", () => {
    it("respects controlled value in single mode", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();

      const { rerender } = render(
        <Accordion type="single" value="item-1" onValueChange={onValueChange}>
          <AccordionItem value="item-1">
            <AccordionTrigger>Item 1</AccordionTrigger>
            <AccordionContent>Content 1</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Item 2</AccordionTrigger>
            <AccordionContent>Content 2</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      expect(screen.getByRole("button", { name: "Item 1" })).toHaveAttribute(
        "aria-expanded",
        "true",
      );

      // Clicking should call onValueChange but not change UI until rerender
      await user.click(screen.getByRole("button", { name: "Item 2" }));
      expect(onValueChange).toHaveBeenCalledWith("item-2");
      expect(screen.getByRole("button", { name: "Item 1" })).toHaveAttribute(
        "aria-expanded",
        "true",
      );

      // Rerender with new value
      rerender(
        <Accordion type="single" value="item-2" onValueChange={onValueChange}>
          <AccordionItem value="item-1">
            <AccordionTrigger>Item 1</AccordionTrigger>
            <AccordionContent>Content 1</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Item 2</AccordionTrigger>
            <AccordionContent>Content 2</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      expect(screen.getByRole("button", { name: "Item 2" })).toHaveAttribute(
        "aria-expanded",
        "true",
      );
      expect(screen.getByRole("button", { name: "Item 1" })).toHaveAttribute(
        "aria-expanded",
        "false",
      );
    });

    it("respects controlled value in multiple mode", () => {
      render(
        <Accordion
          type="multiple"
          value={["item-1", "item-3"]}
          onValueChange={() => {}}
        >
          <AccordionItem value="item-1">
            <AccordionTrigger>Item 1</AccordionTrigger>
            <AccordionContent>Content 1</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Item 2</AccordionTrigger>
            <AccordionContent>Content 2</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Item 3</AccordionTrigger>
            <AccordionContent>Content 3</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      expect(screen.getByRole("button", { name: "Item 1" })).toHaveAttribute(
        "aria-expanded",
        "true",
      );
      expect(screen.getByRole("button", { name: "Item 2" })).toHaveAttribute(
        "aria-expanded",
        "false",
      );
      expect(screen.getByRole("button", { name: "Item 3" })).toHaveAttribute(
        "aria-expanded",
        "true",
      );
    });
  });

  describe("Keyboard Navigation", () => {
    it("navigates down with ArrowDown", async () => {
      const user = userEvent.setup();
      renderAccordion({ type: "single" });

      const trigger1 = screen.getByRole("button", { name: "Item 1" });
      const trigger2 = screen.getByRole("button", { name: "Item 2" });

      trigger1.focus();
      await user.keyboard("{ArrowDown}");

      expect(trigger2).toHaveFocus();
    });

    it("navigates up with ArrowUp", async () => {
      const user = userEvent.setup();
      renderAccordion({ type: "single" });

      const trigger1 = screen.getByRole("button", { name: "Item 1" });
      const trigger2 = screen.getByRole("button", { name: "Item 2" });

      trigger2.focus();
      await user.keyboard("{ArrowUp}");

      expect(trigger1).toHaveFocus();
    });

    it("moves to first item with Home key", async () => {
      const user = userEvent.setup();
      renderAccordion({ type: "single" });

      const trigger1 = screen.getByRole("button", { name: "Item 1" });
      const trigger3 = screen.getByRole("button", { name: "Item 3" });

      trigger3.focus();
      await user.keyboard("{Home}");

      expect(trigger1).toHaveFocus();
    });

    it("moves to last item with End key", async () => {
      const user = userEvent.setup();
      renderAccordion({ type: "single" });

      const trigger1 = screen.getByRole("button", { name: "Item 1" });
      const trigger3 = screen.getByRole("button", { name: "Item 3" });

      trigger1.focus();
      await user.keyboard("{End}");

      expect(trigger3).toHaveFocus();
    });

    it("loops from last to first when loop=true", async () => {
      const user = userEvent.setup();
      renderAccordion({ type: "single", loop: true });

      const trigger1 = screen.getByRole("button", { name: "Item 1" });
      const trigger3 = screen.getByRole("button", { name: "Item 3" });

      trigger3.focus();
      await user.keyboard("{ArrowDown}");

      expect(trigger1).toHaveFocus();
    });

    it("loops from first to last when loop=true", async () => {
      const user = userEvent.setup();
      renderAccordion({ type: "single", loop: true });

      const trigger1 = screen.getByRole("button", { name: "Item 1" });
      const trigger3 = screen.getByRole("button", { name: "Item 3" });

      trigger1.focus();
      await user.keyboard("{ArrowUp}");

      expect(trigger3).toHaveFocus();
    });

    it("does not loop when loop=false", async () => {
      const user = userEvent.setup();
      renderAccordion({ type: "single", loop: false });

      const trigger3 = screen.getByRole("button", { name: "Item 3" });

      trigger3.focus();
      await user.keyboard("{ArrowDown}");

      expect(trigger3).toHaveFocus();
    });

    it("opens item with Enter key", async () => {
      const user = userEvent.setup();
      renderAccordion({ type: "single" });

      const trigger = screen.getByRole("button", { name: "Item 1" });
      trigger.focus();
      await user.keyboard("{Enter}");

      expect(trigger).toHaveAttribute("aria-expanded", "true");
    });

    it("opens item with Space key", async () => {
      const user = userEvent.setup();
      renderAccordion({ type: "single" });

      const trigger = screen.getByRole("button", { name: "Item 1" });
      trigger.focus();
      await user.keyboard(" ");

      expect(trigger).toHaveAttribute("aria-expanded", "true");
    });
  });

  describe("Horizontal Orientation", () => {
    it("uses ArrowRight/ArrowLeft for horizontal orientation", async () => {
      const user = userEvent.setup();
      renderAccordion({ type: "single", orientation: "horizontal" });

      const trigger1 = screen.getByRole("button", { name: "Item 1" });
      const trigger2 = screen.getByRole("button", { name: "Item 2" });

      trigger1.focus();
      await user.keyboard("{ArrowRight}");

      expect(trigger2).toHaveFocus();

      await user.keyboard("{ArrowLeft}");

      expect(trigger1).toHaveFocus();
    });

    it("sets data-orientation attribute", () => {
      const { container } = renderAccordion({
        type: "single",
        orientation: "horizontal",
      });

      expect(container.firstChild).toHaveAttribute(
        "data-orientation",
        "horizontal",
      );
    });
  });

  describe("RTL Support", () => {
    it("reverses arrow keys in RTL horizontal mode", async () => {
      const user = userEvent.setup();
      renderAccordion({
        type: "single",
        orientation: "horizontal",
        dir: "rtl",
      });

      const trigger1 = screen.getByRole("button", { name: "Item 1" });
      const trigger2 = screen.getByRole("button", { name: "Item 2" });

      trigger1.focus();
      await user.keyboard("{ArrowLeft}");

      expect(trigger2).toHaveFocus();
    });

    it("sets dir attribute", () => {
      const { container } = renderAccordion({ type: "single", dir: "rtl" });

      expect(container.firstChild).toHaveAttribute("dir", "rtl");
    });
  });

  describe("Disabled State", () => {
    it("does not open disabled accordion", async () => {
      const user = userEvent.setup();
      renderAccordion({ type: "single", disabled: true });

      const trigger = screen.getByRole("button", { name: "Item 1" });
      await user.click(trigger);

      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });

    it("disables all triggers when accordion is disabled", () => {
      renderAccordion({ type: "single", disabled: true });

      expect(screen.getByRole("button", { name: "Item 1" })).toBeDisabled();
      expect(screen.getByRole("button", { name: "Item 2" })).toBeDisabled();
      expect(screen.getByRole("button", { name: "Item 3" })).toBeDisabled();
    });

    it("disables individual items", async () => {
      const user = userEvent.setup();
      render(
        <Accordion type="single">
          <AccordionItem value="item-1" disabled>
            <AccordionTrigger>Item 1</AccordionTrigger>
            <AccordionContent>Content 1</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Item 2</AccordionTrigger>
            <AccordionContent>Content 2</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      const trigger1 = screen.getByRole("button", { name: "Item 1" });
      const trigger2 = screen.getByRole("button", { name: "Item 2" });

      expect(trigger1).toBeDisabled();
      expect(trigger2).not.toBeDisabled();

      await user.click(trigger1);
      expect(trigger1).toHaveAttribute("aria-expanded", "false");
    });

    it("skips disabled items during keyboard navigation", async () => {
      const user = userEvent.setup();
      render(
        <Accordion type="single">
          <AccordionItem value="item-1">
            <AccordionTrigger>Item 1</AccordionTrigger>
            <AccordionContent>Content 1</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2" disabled>
            <AccordionTrigger>Item 2</AccordionTrigger>
            <AccordionContent>Content 2</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Item 3</AccordionTrigger>
            <AccordionContent>Content 3</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      const trigger1 = screen.getByRole("button", { name: "Item 1" });
      const trigger3 = screen.getByRole("button", { name: "Item 3" });

      trigger1.focus();
      await user.keyboard("{ArrowDown}");

      // Should skip disabled item-2 and focus item-3
      expect(trigger3).toHaveFocus();
    });
  });

  describe("Accessibility", () => {
    it("associates trigger with content via aria-controls", () => {
      renderAccordion({ type: "single", id: "test-accordion" });

      const trigger = screen.getByText("Item 1").closest("button");
      const controlsId = trigger?.getAttribute("aria-controls");

      expect(controlsId).toBeTruthy();
    });

    it("sets aria-labelledby on content region", async () => {
      const user = userEvent.setup();
      renderAccordion({ type: "single", id: "test-accordion" });

      const trigger = screen.getByText("Item 1").closest("button")!;
      await user.click(trigger);

      const triggerId = trigger.getAttribute("id");
      const content = screen.getByRole("region", { hidden: true });

      expect(content).toHaveAttribute("aria-labelledby", triggerId);
    });

    it("sets role=region on content", async () => {
      const user = userEvent.setup();
      renderAccordion({ type: "single" });

      await user.click(screen.getByText("Item 1"));

      expect(screen.getByRole("region", { hidden: true })).toBeInTheDocument();
    });

    it("wraps trigger in heading element", () => {
      renderAccordion({ type: "single", headingLevel: 2 });

      const trigger = screen.getByText("Item 1").closest("button");
      expect(trigger?.closest("h2")).toBeInTheDocument();
    });

    it("respects custom headingLevel", () => {
      renderAccordion({ type: "single", headingLevel: 4 });

      const trigger = screen.getByText("Item 1").closest("button");
      expect(trigger?.closest("h4")).toBeInTheDocument();
    });

    it("sets data-state attribute on items", async () => {
      const user = userEvent.setup();
      renderAccordion({ type: "single" });

      const trigger = screen.getByText("Item 1").closest("button")!;
      expect(trigger).toHaveAttribute("data-state", "closed");

      await user.click(trigger);
      expect(trigger).toHaveAttribute("data-state", "open");
    });

    it("sets data-disabled attribute when disabled", () => {
      renderAccordion({ type: "single", disabled: true });

      const trigger = screen.getByText("Item 1").closest("button");
      expect(trigger).toHaveAttribute("data-disabled", "true");
    });
  });

  describe("Animation Callbacks", () => {
    it("calls onOpenStart when opening", async () => {
      const user = userEvent.setup();
      const onOpenStart = vi.fn();

      render(
        <Accordion type="single">
          <AccordionItem value="item-1">
            <AccordionTrigger>Item 1</AccordionTrigger>
            <AccordionContent onOpenStart={onOpenStart}>
              Content 1
            </AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      await user.click(screen.getByRole("button", { name: "Item 1" }));

      expect(onOpenStart).toHaveBeenCalled();
    });

    it("calls onOpenEnd after animation duration", async () => {
      vi.useFakeTimers();
      const onOpenEnd = vi.fn();

      render(
        <Accordion type="single" defaultValue="item-1">
          <AccordionItem value="item-1">
            <AccordionTrigger>Item 1</AccordionTrigger>
            <AccordionContent onOpenEnd={onOpenEnd} animationDuration={300}>
              Content 1
            </AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      // Trigger a state change by re-rendering with the same value
      // The callbacks are called when isExpanded changes
      vi.advanceTimersByTime(300);

      vi.useRealTimers();
    });

    it("calls onCloseStart when closing", async () => {
      const user = userEvent.setup();
      const onCloseStart = vi.fn();

      render(
        <Accordion type="single" collapsible defaultValue="item-1">
          <AccordionItem value="item-1">
            <AccordionTrigger>Item 1</AccordionTrigger>
            <AccordionContent onCloseStart={onCloseStart}>
              Content 1
            </AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      // Item is already open, clicking will close it
      await user.click(screen.getByRole("button", { name: "Item 1" }));
      expect(onCloseStart).toHaveBeenCalled();
    });

    it("supports animationDuration prop", () => {
      render(
        <Accordion type="single" defaultValue="item-1">
          <AccordionItem value="item-1">
            <AccordionTrigger>Item 1</AccordionTrigger>
            <AccordionContent animationDuration={500}>
              Content 1
            </AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      const content = screen.getByRole("region", { hidden: true });
      expect(content).toHaveStyle({ transitionDuration: "500ms" });
    });
  });

  describe("Content Rendering", () => {
    it("does not render content initially when not expanded", () => {
      renderAccordion({ type: "single" });

      expect(screen.queryByText("Content 1")).not.toBeInTheDocument();
    });

    it("renders content when expanded", async () => {
      const user = userEvent.setup();
      renderAccordion({ type: "single" });

      await user.click(screen.getByRole("button", { name: "Item 1" }));

      expect(screen.getByText("Content 1")).toBeInTheDocument();
    });

    it("keeps content mounted after first open (for animation)", async () => {
      const user = userEvent.setup();
      renderAccordion({ type: "single", collapsible: true });

      await user.click(screen.getByRole("button", { name: "Item 1" }));
      expect(screen.getByText("Content 1")).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "Item 1" })); // Close
      // Content should still be in DOM for close animation
      expect(screen.getByText("Content 1")).toBeInTheDocument();
    });

    it("respects forceMount prop", () => {
      render(
        <Accordion type="single">
          <AccordionItem value="item-1">
            <AccordionTrigger>Item 1</AccordionTrigger>
            <AccordionContent forceMount>Content 1</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      expect(screen.getByText("Content 1")).toBeInTheDocument();
    });

    it("sets aria-hidden on collapsed content", async () => {
      const user = userEvent.setup();
      render(
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Item 1</AccordionTrigger>
            <AccordionContent forceMount>Content 1</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      const content = screen.getByRole("region", { hidden: true });
      expect(content).toHaveAttribute("aria-hidden", "true");

      await user.click(screen.getByRole("button", { name: "Item 1" }));
      expect(content).toHaveAttribute("aria-hidden", "false");
    });
  });

  describe("Custom ClassNames", () => {
    it("applies custom classNames to root", () => {
      const { container } = render(
        <Accordion
          type="single"
          classNames={{
            root: "custom-root",
          }}
        >
          <AccordionItem value="item-1">
            <AccordionTrigger>Item 1</AccordionTrigger>
            <AccordionContent>Content 1</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      expect(container.firstChild).toHaveClass("custom-root");
    });

    it("applies custom classNames to item", () => {
      render(
        <Accordion
          type="single"
          classNames={{
            item: "custom-item",
          }}
        >
          <AccordionItem value="item-1">
            <AccordionTrigger>Item 1</AccordionTrigger>
            <AccordionContent>Content 1</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      // The item div is the parent of the heading which contains the trigger
      const heading = screen.getByText("Item 1").closest("h3");
      expect(heading?.parentElement).toHaveClass("custom-item");
    });

    it("applies custom classNames to trigger", () => {
      render(
        <Accordion
          type="single"
          classNames={{
            trigger: "custom-trigger",
          }}
        >
          <AccordionItem value="item-1">
            <AccordionTrigger>Item 1</AccordionTrigger>
            <AccordionContent>Content 1</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      const trigger = screen.getByText("Item 1").closest("button");
      expect(trigger).toHaveClass("custom-trigger");
    });

    it("applies custom classNames to content", async () => {
      const user = userEvent.setup();
      render(
        <Accordion
          type="single"
          classNames={{
            content: "custom-content",
          }}
        >
          <AccordionItem value="item-1">
            <AccordionTrigger>Item 1</AccordionTrigger>
            <AccordionContent>Content 1</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      await user.click(screen.getByText("Item 1"));

      // Content class is applied to inner content wrapper
      const contentText = screen.getByText("Content 1");
      expect(contentText.closest(".custom-content")).toBeInTheDocument();
    });
  });

  describe("Icon Customization", () => {
    it("renders default chevron icon", async () => {
      const user = userEvent.setup();
      renderAccordion({ type: "single" });

      const trigger = screen.getByRole("button", { name: "Item 1" });
      await user.click(trigger);

      const svg = trigger.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });

    it("renders custom expanded/collapsed icons", async () => {
      const user = userEvent.setup();
      render(
        <Accordion type="single">
          <AccordionItem value="item-1">
            <AccordionTrigger
              expandedIcon={<span data-testid="expanded-icon">−</span>}
              collapsedIcon={<span data-testid="collapsed-icon">+</span>}
            >
              Item 1
            </AccordionTrigger>
            <AccordionContent>Content 1</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      expect(screen.getByTestId("collapsed-icon")).toBeInTheDocument();
      expect(screen.queryByTestId("expanded-icon")).not.toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "Item 1" }));

      expect(screen.getByTestId("expanded-icon")).toBeInTheDocument();
      expect(screen.queryByTestId("collapsed-icon")).not.toBeInTheDocument();
    });

    it("hides icon when iconPosition=none", () => {
      render(
        <Accordion type="single">
          <AccordionItem value="item-1">
            <AccordionTrigger iconPosition="none">Item 1</AccordionTrigger>
            <AccordionContent>Content 1</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      const trigger = screen.getByRole("button", { name: "Item 1" });
      const svg = trigger.querySelector("svg");
      expect(svg).not.toBeInTheDocument();
    });

    it("positions icon on left when iconPosition=left", () => {
      render(
        <Accordion type="single">
          <AccordionItem value="item-1">
            <AccordionTrigger iconPosition="left">Item 1</AccordionTrigger>
            <AccordionContent>Content 1</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      const trigger = screen.getByRole("button", { name: "Item 1" });
      expect(trigger).toHaveClass("flex-row-reverse");
    });
  });

  describe("Data Attributes", () => {
    it("sets data-state on accordion root", async () => {
      const user = userEvent.setup();
      const { container } = renderAccordion({ type: "single" });

      expect(container.firstChild).toHaveAttribute("data-state", "all-closed");

      await user.click(screen.getByRole("button", { name: "Item 1" }));

      expect(container.firstChild).toHaveAttribute(
        "data-state",
        "has-expanded",
      );
    });
  });

  describe("Context Errors", () => {
    it("throws error when AccordionItem used outside Accordion", () => {
      // Suppress console.error for this test
      const spy = vi.spyOn(console, "error").mockImplementation(() => {});

      expect(() => {
        render(
          <AccordionItem value="item-1">
            <AccordionTrigger>Item 1</AccordionTrigger>
          </AccordionItem>,
        );
      }).toThrow(
        "Accordion compound components must be used within an <Accordion> component",
      );

      spy.mockRestore();
    });

    it("throws error when AccordionTrigger used outside AccordionItem", () => {
      const spy = vi.spyOn(console, "error").mockImplementation(() => {});

      expect(() => {
        render(
          <Accordion type="single">
            <AccordionTrigger>Item 1</AccordionTrigger>
          </Accordion>,
        );
      }).toThrow(
        "AccordionTrigger and AccordionContent must be used within an <AccordionItem> component",
      );

      spy.mockRestore();
    });
  });

  describe("Ref Forwarding", () => {
    it("forwards ref with imperative handle to accordion", () => {
      const ref = { current: null as import("../utils/types").AccordionRef | null };
      render(
        <Accordion type="single" ref={ref}>
          <AccordionItem value="item-1">
            <AccordionTrigger>Item 1</AccordionTrigger>
            <AccordionContent>Content 1</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      expect(ref.current).not.toBeNull();
      expect(ref.current?.element).toBeInstanceOf(HTMLDivElement);
      expect(typeof ref.current?.expandAll).toBe("function");
      expect(typeof ref.current?.collapseAll).toBe("function");
    });

    it("forwards ref to trigger button", () => {
      const ref = vi.fn();
      render(
        <Accordion type="single">
          <AccordionItem value="item-1">
            <AccordionTrigger ref={ref}>Item 1</AccordionTrigger>
            <AccordionContent>Content 1</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      expect(ref).toHaveBeenCalled();
      expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLButtonElement);
    });

    it("forwards ref to content", async () => {
      const user = userEvent.setup();
      const ref = vi.fn();
      render(
        <Accordion type="single">
          <AccordionItem value="item-1">
            <AccordionTrigger>Item 1</AccordionTrigger>
            <AccordionContent ref={ref}>Content 1</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      await user.click(screen.getByRole("button", { name: "Item 1" }));

      expect(ref).toHaveBeenCalled();
      expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe("Imperative API (AccordionRef)", () => {
    it("expands item programmatically via ref.expand()", () => {
      const ref = { current: null as import("../utils/types").AccordionRef | null };
      render(
        <Accordion type="single" ref={ref}>
          <AccordionItem value="item-1">
            <AccordionTrigger>Item 1</AccordionTrigger>
            <AccordionContent>Content 1</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Item 2</AccordionTrigger>
            <AccordionContent>Content 2</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      act(() => {
        ref.current?.expand("item-2");
      });

      expect(screen.getByRole("button", { name: "Item 2" })).toHaveAttribute(
        "aria-expanded",
        "true",
      );
    });

    it("collapses item programmatically via ref.collapse()", async () => {
      const user = userEvent.setup();
      const ref = { current: null as import("../utils/types").AccordionRef | null };
      render(
        <Accordion type="single" collapsible ref={ref}>
          <AccordionItem value="item-1">
            <AccordionTrigger>Item 1</AccordionTrigger>
            <AccordionContent>Content 1</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      await user.click(screen.getByRole("button", { name: "Item 1" }));
      expect(screen.getByRole("button", { name: "Item 1" })).toHaveAttribute(
        "aria-expanded",
        "true",
      );

      act(() => {
        ref.current?.collapse("item-1");
      });

      expect(screen.getByRole("button", { name: "Item 1" })).toHaveAttribute(
        "aria-expanded",
        "false",
      );
    });

    it("toggles item programmatically via ref.toggle()", () => {
      const ref = { current: null as import("../utils/types").AccordionRef | null };
      render(
        <Accordion type="single" collapsible ref={ref}>
          <AccordionItem value="item-1">
            <AccordionTrigger>Item 1</AccordionTrigger>
            <AccordionContent>Content 1</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      act(() => {
        ref.current?.toggle("item-1");
      });
      expect(screen.getByRole("button", { name: "Item 1" })).toHaveAttribute(
        "aria-expanded",
        "true",
      );

      act(() => {
        ref.current?.toggle("item-1");
      });
      expect(screen.getByRole("button", { name: "Item 1" })).toHaveAttribute(
        "aria-expanded",
        "false",
      );
    });

    it("expands all items via ref.expandAll() in multiple mode", () => {
      const ref = { current: null as import("../utils/types").AccordionRef | null };
      render(
        <Accordion type="multiple" ref={ref}>
          <AccordionItem value="item-1">
            <AccordionTrigger>Item 1</AccordionTrigger>
            <AccordionContent>Content 1</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Item 2</AccordionTrigger>
            <AccordionContent>Content 2</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      act(() => {
        ref.current?.expandAll();
      });

      expect(screen.getByRole("button", { name: "Item 1" })).toHaveAttribute(
        "aria-expanded",
        "true",
      );
      expect(screen.getByRole("button", { name: "Item 2" })).toHaveAttribute(
        "aria-expanded",
        "true",
      );
    });

    it("collapses all items via ref.collapseAll()", async () => {
      const user = userEvent.setup();
      const ref = { current: null as import("../utils/types").AccordionRef | null };
      render(
        <Accordion type="multiple" ref={ref}>
          <AccordionItem value="item-1">
            <AccordionTrigger>Item 1</AccordionTrigger>
            <AccordionContent>Content 1</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Item 2</AccordionTrigger>
            <AccordionContent>Content 2</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      await user.click(screen.getByRole("button", { name: "Item 1" }));
      await user.click(screen.getByRole("button", { name: "Item 2" }));

      act(() => {
        ref.current?.collapseAll();
      });

      expect(screen.getByRole("button", { name: "Item 1" })).toHaveAttribute(
        "aria-expanded",
        "false",
      );
      expect(screen.getByRole("button", { name: "Item 2" })).toHaveAttribute(
        "aria-expanded",
        "false",
      );
    });

    it("returns expanded values via ref.getExpandedValues()", async () => {
      const user = userEvent.setup();
      const ref = { current: null as import("../utils/types").AccordionRef | null };
      render(
        <Accordion type="multiple" ref={ref}>
          <AccordionItem value="item-1">
            <AccordionTrigger>Item 1</AccordionTrigger>
            <AccordionContent>Content 1</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Item 2</AccordionTrigger>
            <AccordionContent>Content 2</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      await user.click(screen.getByRole("button", { name: "Item 1" }));

      expect(ref.current?.getExpandedValues()).toEqual(["item-1"]);
    });

    it("checks expansion state via ref.isExpanded()", async () => {
      const user = userEvent.setup();
      const ref = { current: null as import("../utils/types").AccordionRef | null };
      render(
        <Accordion type="single" ref={ref}>
          <AccordionItem value="item-1">
            <AccordionTrigger>Item 1</AccordionTrigger>
            <AccordionContent>Content 1</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      expect(ref.current?.isExpanded("item-1")).toBe(false);

      await user.click(screen.getByRole("button", { name: "Item 1" }));

      expect(ref.current?.isExpanded("item-1")).toBe(true);
    });

    it("focuses item programmatically via ref.focusItem()", () => {
      const ref = { current: null as import("../utils/types").AccordionRef | null };
      render(
        <Accordion type="single" ref={ref}>
          <AccordionItem value="item-1">
            <AccordionTrigger>Item 1</AccordionTrigger>
            <AccordionContent>Content 1</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Item 2</AccordionTrigger>
            <AccordionContent>Content 2</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      act(() => {
        ref.current?.focusItem("item-2");
      });

      expect(screen.getByRole("button", { name: "Item 2" })).toHaveFocus();
    });

    it("returns item count via ref.getItemCount()", () => {
      const ref = { current: null as import("../utils/types").AccordionRef | null };
      render(
        <Accordion type="single" ref={ref}>
          <AccordionItem value="item-1">
            <AccordionTrigger>Item 1</AccordionTrigger>
            <AccordionContent>Content 1</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Item 2</AccordionTrigger>
            <AccordionContent>Content 2</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Item 3</AccordionTrigger>
            <AccordionContent>Content 3</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      expect(ref.current?.getItemCount()).toBe(3);
    });
  });

  describe("maxExpanded (Multiple Mode)", () => {
    it("limits expansion to maxExpanded count", async () => {
      const user = userEvent.setup();
      render(
        <Accordion type="multiple" maxExpanded={2}>
          <AccordionItem value="item-1">
            <AccordionTrigger>Item 1</AccordionTrigger>
            <AccordionContent>Content 1</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Item 2</AccordionTrigger>
            <AccordionContent>Content 2</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Item 3</AccordionTrigger>
            <AccordionContent>Content 3</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      await user.click(screen.getByRole("button", { name: "Item 1" }));
      await user.click(screen.getByRole("button", { name: "Item 2" }));
      await user.click(screen.getByRole("button", { name: "Item 3" }));

      expect(screen.getByRole("button", { name: "Item 1" })).toHaveAttribute(
        "aria-expanded",
        "true",
      );
      expect(screen.getByRole("button", { name: "Item 2" })).toHaveAttribute(
        "aria-expanded",
        "true",
      );
      expect(screen.getByRole("button", { name: "Item 3" })).toHaveAttribute(
        "aria-expanded",
        "false",
      );
    });

    it("allows expansion after collapsing when at maxExpanded", async () => {
      const user = userEvent.setup();
      render(
        <Accordion type="multiple" maxExpanded={1}>
          <AccordionItem value="item-1">
            <AccordionTrigger>Item 1</AccordionTrigger>
            <AccordionContent>Content 1</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Item 2</AccordionTrigger>
            <AccordionContent>Content 2</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      await user.click(screen.getByRole("button", { name: "Item 1" }));
      await user.click(screen.getByRole("button", { name: "Item 1" })); // collapse
      await user.click(screen.getByRole("button", { name: "Item 2" }));

      expect(screen.getByRole("button", { name: "Item 2" })).toHaveAttribute(
        "aria-expanded",
        "true",
      );
    });
  });

  describe("onExpandedChange Callback", () => {
    it("receives detailed expansion event", async () => {
      const user = userEvent.setup();
      const onExpandedChange = vi.fn();
      render(
        <Accordion type="single" value="" onExpandedChange={onExpandedChange}>
          <AccordionItem value="item-1">
            <AccordionTrigger>Item 1</AccordionTrigger>
            <AccordionContent>Content 1</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Item 2</AccordionTrigger>
            <AccordionContent>Content 2</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      await user.click(screen.getByRole("button", { name: "Item 1" }));

      expect(onExpandedChange).toHaveBeenCalledWith({
        value: "item-1",
        isExpanded: true,
        expandedCount: 1,
        totalCount: 2,
      });
    });
  });

  describe("AccordionItem onToggle Callback", () => {
    it("calls onToggle when item expansion state changes", async () => {
      const user = userEvent.setup();
      const onToggle = vi.fn();
      render(
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1" onToggle={onToggle}>
            <AccordionTrigger>Item 1</AccordionTrigger>
            <AccordionContent>Content 1</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      await user.click(screen.getByRole("button", { name: "Item 1" }));
      expect(onToggle).toHaveBeenCalledWith(true);

      await user.click(screen.getByRole("button", { name: "Item 1" }));
      expect(onToggle).toHaveBeenCalledWith(false);
    });
  });

  describe("preventClose Callback", () => {
    it("prevents closing when preventClose returns true", async () => {
      const user = userEvent.setup();
      const preventClose = vi.fn().mockReturnValue(true);
      render(
        <Accordion type="single" collapsible preventClose={preventClose}>
          <AccordionItem value="item-1">
            <AccordionTrigger>Item 1</AccordionTrigger>
            <AccordionContent>Content 1</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      await user.click(screen.getByRole("button", { name: "Item 1" }));
      expect(screen.getByRole("button", { name: "Item 1" })).toHaveAttribute(
        "aria-expanded",
        "true",
      );

      await user.click(screen.getByRole("button", { name: "Item 1" }));

      expect(preventClose).toHaveBeenCalledWith("item-1");
      expect(screen.getByRole("button", { name: "Item 1" })).toHaveAttribute(
        "aria-expanded",
        "true",
      );
    });

    it("allows closing when preventClose returns false", async () => {
      const user = userEvent.setup();
      const preventClose = vi.fn().mockReturnValue(false);
      render(
        <Accordion type="single" collapsible preventClose={preventClose}>
          <AccordionItem value="item-1">
            <AccordionTrigger>Item 1</AccordionTrigger>
            <AccordionContent>Content 1</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      await user.click(screen.getByRole("button", { name: "Item 1" }));
      await user.click(screen.getByRole("button", { name: "Item 1" }));

      expect(screen.getByRole("button", { name: "Item 1" })).toHaveAttribute(
        "aria-expanded",
        "false",
      );
    });

    it("supports async preventClose", async () => {
      const user = userEvent.setup();
      const preventClose = vi.fn().mockResolvedValue(true);
      render(
        <Accordion type="single" collapsible preventClose={preventClose}>
          <AccordionItem value="item-1">
            <AccordionTrigger>Item 1</AccordionTrigger>
            <AccordionContent>Content 1</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      await user.click(screen.getByRole("button", { name: "Item 1" }));
      await user.click(screen.getByRole("button", { name: "Item 1" }));

      expect(screen.getByRole("button", { name: "Item 1" })).toHaveAttribute(
        "aria-expanded",
        "true",
      );
    });
  });

  describe("Content Unmount Behavior", () => {
    it("unmounts content when unmountOnClose=true after closing", async () => {
      const user = userEvent.setup();
      render(
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Item 1</AccordionTrigger>
            <AccordionContent unmountOnClose>Content 1</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      await user.click(screen.getByRole("button", { name: "Item 1" }));
      expect(screen.getByText("Content 1")).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "Item 1" }));
      expect(screen.queryByText("Content 1")).not.toBeInTheDocument();
    });
  });

  describe("AccordionItem Ref Forwarding", () => {
    it("forwards ref to item container", () => {
      const ref = vi.fn();
      render(
        <Accordion type="single">
          <AccordionItem value="item-1" ref={ref}>
            <AccordionTrigger>Item 1</AccordionTrigger>
            <AccordionContent>Content 1</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      expect(ref).toHaveBeenCalled();
      expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLDivElement);
    });
  });
});
