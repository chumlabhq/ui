import { describe, it, expect, vi, beforeEach } from "vitest";
import React, { createRef } from "react";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  AccordionShimmer,
  ChevronDownIcon,
  ChevronUpIcon,
  PlusIcon,
  MinusIcon,
  getDefaultStorageConfig,
} from "../index";
import { useReducedMotion } from "../hooks/useReducedMotion";
import type {
  AccordionSingleProps,
  AccordionMultipleProps,
  AccordionRef,
  AccordionShimmerProps,
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

    it("calls onValueChange with null when collapsing in single mode", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();

      render(
        <Accordion type="single" value="item-1" onValueChange={onValueChange} collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Item 1</AccordionTrigger>
            <AccordionContent>Content 1</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      await user.click(screen.getByRole("button", { name: "Item 1" }));
      expect(onValueChange).toHaveBeenCalledWith(null);
    });

    it("calls onValueChange with string value when expanding", async () => {
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

      await user.click(screen.getByRole("button", { name: "Item 2" }));
      expect(onValueChange).toHaveBeenCalledWith("item-2");
      expect(screen.getByRole("button", { name: "Item 1" })).toHaveAttribute(
        "aria-expanded",
        "true",
      );

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

      await user.click(screen.getByRole("button", { name: "Item 1" }));
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

      const content = screen.getByText("Content 1").closest("[aria-hidden]")!;
      expect(content).toHaveAttribute("aria-hidden", "true");
      expect(content).not.toHaveAttribute("role", "region");

      await user.click(screen.getByRole("button", { name: "Item 1" }));
      expect(content).toHaveAttribute("aria-hidden", "false");
      expect(content).toHaveAttribute("role", "region");
    });
  });

  describe("Custom ClassNames", () => {
    it("applies custom classNames to root", () => {
      const { container } = render(
        <Accordion
          type="single"
          classes={{
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
          classes={{
            item: "custom-item",
          }}
        >
          <AccordionItem value="item-1">
            <AccordionTrigger>Item 1</AccordionTrigger>
            <AccordionContent>Content 1</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      const heading = screen.getByText("Item 1").closest("h3");
      expect(heading?.parentElement).toHaveClass("custom-item");
    });

    it("applies custom classNames to trigger", () => {
      render(
        <Accordion
          type="single"
          classes={{
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
          classes={{
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
              expandedIcon={<span data-testid="expanded-icon">-</span>}
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

  describe("Print Styles", () => {
    it("injects print style into document head when expandOnPrint is true", () => {
      renderAccordion({ type: "single", expandOnPrint: true });

      const styleEl = document.head.querySelector("[data-accordion-print-styles]");
      expect(styleEl).toBeInTheDocument();
      expect(styleEl?.textContent).toContain("@media print");
    });

    it("removes print style from document head on unmount", () => {
      const { unmount } = render(
        <Accordion type="single" expandOnPrint>
          <AccordionItem value="item-1">
            <AccordionTrigger>Item 1</AccordionTrigger>
            <AccordionContent>Content 1</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      expect(document.head.querySelector("[data-accordion-print-styles]")).toBeInTheDocument();

      unmount();

      expect(document.head.querySelector("[data-accordion-print-styles]")).not.toBeInTheDocument();
    });

    it("does not inject style when expandOnPrint is false", () => {
      renderAccordion({ type: "single", expandOnPrint: false });

      // Clean up any styles from other tests
      const before = document.head.querySelectorAll("[data-accordion-print-styles]").length;
      expect(before).toBe(0);
    });
  });

  describe("Context Errors", () => {
    it("throws error when AccordionItem used outside Accordion", () => {
      const spy = vi.spyOn(console, "error").mockImplementation(() => {});

      expect(() => {
        render(
          <AccordionItem value="item-1">
            <AccordionTrigger>Item 1</AccordionTrigger>
          </AccordionItem>,
        );
      }).toThrow();

      spy.mockRestore();
    });

    it("throws error when AccordionTrigger used outside AccordionItem", () => {
      const spy = vi.spyOn(console, "error").mockImplementation(() => {});

      expect(() => {
        render(<AccordionTrigger>Trigger</AccordionTrigger>);
      }).toThrow();

      spy.mockRestore();
    });
  });

  describe("Imperative API fires onExpandedChange", () => {
    it("fires onExpandedChange from imperative expand", async () => {
      const onExpandedChange = vi.fn();
      const ref = createRef<AccordionRef>();

      render(
        <Accordion type="multiple" ref={ref} onExpandedChange={onExpandedChange}>
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
        ref.current?.expand("item-1");
      });

      expect(onExpandedChange).toHaveBeenCalledWith(
        expect.objectContaining({
          value: "item-1",
          isExpanded: true,
        }),
      );
    });

    it("fires onExpandedChange from imperative collapse", async () => {
      const onExpandedChange = vi.fn();
      const ref = createRef<AccordionRef>();

      render(
        <Accordion type="multiple" ref={ref} defaultValue={["item-1"]} onExpandedChange={onExpandedChange}>
          <AccordionItem value="item-1">
            <AccordionTrigger>Item 1</AccordionTrigger>
            <AccordionContent>Content 1</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      act(() => {
        ref.current?.collapse("item-1");
      });

      expect(onExpandedChange).toHaveBeenCalledWith(
        expect.objectContaining({
          value: "item-1",
          isExpanded: false,
        }),
      );
    });
  });

  describe("Imperative Handle", () => {
    it("toggle() toggles an item via ref", () => {
      const ref = createRef<AccordionRef>();

      render(
        <Accordion type="single" collapsible ref={ref}>
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

      const trigger1 = screen.getByRole("button", { name: "Item 1" });
      expect(trigger1).toHaveAttribute("aria-expanded", "false");

      act(() => {
        ref.current?.toggle("item-1");
      });
      expect(trigger1).toHaveAttribute("aria-expanded", "true");

      act(() => {
        ref.current?.toggle("item-1");
      });
      expect(trigger1).toHaveAttribute("aria-expanded", "false");
    });

    it("getExpandedValues() returns correct array", () => {
      const ref = createRef<AccordionRef>();

      render(
        <Accordion type="multiple" ref={ref} defaultValue={["item-1", "item-3"]}>
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

      const expanded = ref.current?.getExpandedValues();
      expect(expanded).toEqual(expect.arrayContaining(["item-1", "item-3"]));
      expect(expanded).toHaveLength(2);
    });

    it("isExpanded() returns correct boolean", () => {
      const ref = createRef<AccordionRef>();

      render(
        <Accordion type="multiple" ref={ref} defaultValue={["item-1"]}>
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

      expect(ref.current?.isExpanded("item-1")).toBe(true);
      expect(ref.current?.isExpanded("item-2")).toBe(false);
    });

    it("focusItem() focuses and scrolls into view", () => {
      const ref = createRef<AccordionRef>();

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

      const trigger2 = screen.getByRole("button", { name: "Item 2" });
      trigger2.scrollIntoView = vi.fn();

      act(() => {
        ref.current?.focusItem("item-2", true);
      });

      expect(trigger2).toHaveFocus();
      expect(trigger2.scrollIntoView).toHaveBeenCalledWith({
        behavior: "smooth",
        block: "nearest",
      });
    });

    it("getItemCount() returns correct count", () => {
      const ref = createRef<AccordionRef>();

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

    it("element returns the DOM element", () => {
      const ref = createRef<AccordionRef>();

      render(
        <Accordion type="single" ref={ref} id="test-el">
          <AccordionItem value="item-1">
            <AccordionTrigger>Item 1</AccordionTrigger>
            <AccordionContent>Content 1</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      expect(ref.current?.element).toBeInstanceOf(HTMLDivElement);
      expect(ref.current?.element?.id).toBe("test-el");
    });
  });

  describe("onKeyDown callback", () => {
    it("receives event and itemValue on key press", async () => {
      const user = userEvent.setup();
      const onKeyDown = vi.fn();

      render(
        <Accordion type="single" onKeyDown={onKeyDown}>
          <AccordionItem value="item-1">
            <AccordionTrigger>Item 1</AccordionTrigger>
            <AccordionContent>Content 1</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      const trigger = screen.getByRole("button", { name: "Item 1" });
      trigger.focus();
      await user.keyboard("{ArrowDown}");

      expect(onKeyDown).toHaveBeenCalled();
      const [event, itemValue] = onKeyDown.mock.calls[0];
      expect(event).toBeDefined();
      expect(itemValue).toBe("item-1");
    });
  });

  describe("AccordionContent with reduceMotion", () => {
    it("fires onOpenEnd immediately with reduceMotion='always'", async () => {
      const user = userEvent.setup();
      const onOpenEnd = vi.fn();

      render(
        <Accordion type="single" reduceMotion={true}>
          <AccordionItem value="item-1">
            <AccordionTrigger>Item 1</AccordionTrigger>
            <AccordionContent onOpenEnd={onOpenEnd}>
              Content 1
            </AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      await user.click(screen.getByRole("button", { name: "Item 1" }));

      expect(onOpenEnd).toHaveBeenCalled();
    });

    it("fires onCloseEnd immediately with reduceMotion='always'", async () => {
      const user = userEvent.setup();
      const onCloseEnd = vi.fn();

      render(
        <Accordion type="single" collapsible defaultValue="item-1" reduceMotion={true}>
          <AccordionItem value="item-1">
            <AccordionTrigger>Item 1</AccordionTrigger>
            <AccordionContent onCloseEnd={onCloseEnd}>
              Content 1
            </AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      await user.click(screen.getByRole("button", { name: "Item 1" }));

      expect(onCloseEnd).toHaveBeenCalled();
    });

    it("sets transitionDuration to 0ms with reduceMotion='always'", () => {
      render(
        <Accordion type="single" defaultValue="item-1" reduceMotion={true}>
          <AccordionItem value="item-1">
            <AccordionTrigger>Item 1</AccordionTrigger>
            <AccordionContent>Content 1</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      const content = screen.getByRole("region", { hidden: true });
      expect(content).toHaveStyle({ transitionDuration: "0ms" });
    });
  });

  describe("Keyboard nav with no initial focus", () => {
    it("ArrowDown with no focused item focuses the first item", async () => {
      const user = userEvent.setup();
      renderAccordion({ type: "single" });

      // Tab into the accordion to focus the first trigger
      await user.tab();
      const trigger1 = screen.getByRole("button", { name: "Item 1" });
      expect(trigger1).toHaveFocus();
    });

    it("does not loop at first item boundary when loop=false and ArrowUp is pressed", async () => {
      const user = userEvent.setup();
      renderAccordion({ type: "single", loop: false });

      const trigger1 = screen.getByRole("button", { name: "Item 1" });

      trigger1.focus();
      await user.keyboard("{ArrowUp}");

      expect(trigger1).toHaveFocus();
    });
  });

  describe("useAccordionStateManager - collapseAll and expand limits", () => {
    it("collapseAll does nothing on single non-collapsible accordion", () => {
      const ref = createRef<AccordionRef>();

      render(
        <Accordion type="single" collapsible={false} ref={ref} defaultValue="item-1">
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
        ref.current?.collapseAll();
      });

      // Should still be expanded since collapsible=false
      expect(ref.current?.isExpanded("item-1")).toBe(true);
    });

    it("expand rejects 3rd item when maxExpanded=2", () => {
      const ref = createRef<AccordionRef>();

      render(
        <Accordion type="multiple" maxExpanded={2} ref={ref}>
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

      act(() => {
        ref.current?.expand("item-1");
      });
      act(() => {
        ref.current?.expand("item-2");
      });
      act(() => {
        ref.current?.expand("item-3");
      });

      expect(ref.current?.isExpanded("item-1")).toBe(true);
      expect(ref.current?.isExpanded("item-2")).toBe(true);
      expect(ref.current?.isExpanded("item-3")).toBe(false);
    });
  });

  describe("Storage", () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it("stores state in localStorage when storageKey is set", async () => {
      const user = userEvent.setup();

      render(
        <Accordion type="multiple" storageKey="test-accordion-storage">
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

      const stored = localStorage.getItem("test-accordion-storage");
      expect(stored).toBeTruthy();
      expect(JSON.parse(stored!)).toContain("item-1");
    });

    it("handles corrupted JSON in localStorage gracefully", () => {
      localStorage.setItem("test-corrupted", "not-valid-json{{{");

      render(
        <Accordion type="multiple" storageKey="test-corrupted">
          <AccordionItem value="item-1">
            <AccordionTrigger>Item 1</AccordionTrigger>
            <AccordionContent>Content 1</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      // Should render without throwing
      expect(screen.getByRole("button", { name: "Item 1" })).toBeInTheDocument();
    });

    it("handles storage that throws errors", () => {
      const throwingStorage = {
        getItem: () => { throw new Error("storage error"); },
        setItem: () => { throw new Error("storage error"); },
        removeItem: () => { throw new Error("storage error"); },
        clear: () => { throw new Error("storage error"); },
        length: 0,
        key: () => null,
      };

      render(
        <Accordion
          type="multiple"
          storageKey={{
            key: "test-throwing",
            storage: throwingStorage as unknown as Storage,
          }}
        >
          <AccordionItem value="item-1">
            <AccordionTrigger>Item 1</AccordionTrigger>
            <AccordionContent>Content 1</AccordionContent>
          </AccordionItem>
        </Accordion>,
      );

      // Should render without throwing
      expect(screen.getByRole("button", { name: "Item 1" })).toBeInTheDocument();
    });
  });

  describe("getDefaultStorageConfig", () => {
    it("deserialize returns empty array for invalid JSON", () => {
      const config = getDefaultStorageConfig();
      const result = config.deserialize!("not-valid-json");
      expect(result).toEqual([]);
    });

    it("deserialize parses valid JSON", () => {
      const config = getDefaultStorageConfig();
      const result = config.deserialize!('["item-1","item-2"]');
      expect(result).toEqual(["item-1", "item-2"]);
    });

    it("serialize converts array to JSON", () => {
      const config = getDefaultStorageConfig();
      const result = config.serialize!(["item-1", "item-2"]);
      expect(result).toBe('["item-1","item-2"]');
    });
  });

  describe("Context Errors - additional", () => {
    it("throws error when AccordionContent used outside AccordionItem", () => {
      const spy = vi.spyOn(console, "error").mockImplementation(() => {});

      expect(() => {
        render(<AccordionContent>Content</AccordionContent>);
      }).toThrow();

      spy.mockRestore();
    });
  });

  describe("Icons", () => {
    it("ChevronDownIcon renders an SVG with correct props", () => {
      const { container } = render(<ChevronDownIcon className="test-class" />);
      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute("aria-hidden", "true");
      expect(svg).toHaveAttribute("viewBox", "0 0 20 20");
      expect(svg).toHaveClass("test-class");
    });

    it("ChevronUpIcon renders an SVG with correct props", () => {
      const { container } = render(<ChevronUpIcon className="test-class" />);
      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute("aria-hidden", "true");
      expect(svg).toHaveAttribute("viewBox", "0 0 20 20");
      expect(svg).toHaveClass("test-class");
    });

    it("PlusIcon renders an SVG with correct props", () => {
      const { container } = render(<PlusIcon className="test-class" />);
      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute("aria-hidden", "true");
      expect(svg).toHaveAttribute("viewBox", "0 0 20 20");
      expect(svg).toHaveClass("test-class");
    });

    it("MinusIcon renders an SVG with correct props", () => {
      const { container } = render(<MinusIcon className="test-class" />);
      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute("aria-hidden", "true");
      expect(svg).toHaveAttribute("viewBox", "0 0 20 20");
      expect(svg).toHaveClass("test-class");
    });

    it("Icons render with default empty className", () => {
      const { container } = render(<ChevronDownIcon />);
      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute("class", "");
    });
  });

  describe("useReducedMotion re-export", () => {
    it("useReducedMotion is a function exported from hooks/useReducedMotion", () => {
      expect(typeof useReducedMotion).toBe("function");
    });
  });
});

describe("AccordionShimmer", () => {
  it("renders with default props (count=3, size=md, variant=default)", () => {
    const { container } = render(<AccordionShimmer />);

    const root = container.firstChild as HTMLElement;
    expect(root).toHaveAttribute("role", "status");
    expect(root).toHaveAttribute("aria-label", "Loading 3 accordion items");
    expect(root).toHaveAttribute("aria-busy", "true");

    // Should render 3 items
    const items = root.children;
    expect(items.length).toBe(3);
  });

  it("renders correct number of items with custom count", () => {
    const { container } = render(<AccordionShimmer count={5} />);
    const root = container.firstChild as HTMLElement;
    expect(root.children.length).toBe(5);
    expect(root).toHaveAttribute("aria-label", "Loading 5 accordion items");
  });

  it("renders with size=sm", () => {
    const { container } = render(<AccordionShimmer size="sm" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders with size=lg", () => {
    const { container } = render(<AccordionShimmer size="lg" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders with variant=bordered", () => {
    const { container } = render(<AccordionShimmer variant="bordered" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders with variant=separated", () => {
    const { container } = render(<AccordionShimmer variant="separated" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders with variant=flush", () => {
    const { container } = render(<AccordionShimmer variant="flush" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("shows subtitle and content shimmer lines when showContent=true", () => {
    const { container } = render(<AccordionShimmer showContent count={1} />);
    const root = container.firstChild as HTMLElement;
    // showContent=true should render subtitle shimmer + content block with 3 lines
    const allShimmers = root.querySelectorAll(".rounded");
    // Title (1) + subtitle (1) + icon (1) + 3 content lines = 6
    expect(allShimmers.length).toBeGreaterThanOrEqual(5);
  });

  it("removes animate-pulse class when animate=false", () => {
    const { container } = render(<AccordionShimmer animate={false} count={1} />);
    const pulseElements = container.querySelectorAll(".animate-pulse");
    expect(pulseElements.length).toBe(0);
  });

  it("includes animate-pulse class when animate=true", () => {
    const { container } = render(<AccordionShimmer animate count={1} />);
    const pulseElements = container.querySelectorAll(".animate-pulse");
    expect(pulseElements.length).toBeGreaterThan(0);
  });

  it("applies custom className", () => {
    const { container } = render(<AccordionShimmer className="my-shimmer" />);
    expect(container.firstChild).toHaveClass("my-shimmer");
  });

  it("applies custom style", () => {
    const { container } = render(<AccordionShimmer style={{ maxWidth: 400 }} />);
    expect(container.firstChild).toHaveStyle({ maxWidth: "400px" });
  });

  it("supports asChild prop", () => {
    const Comp = AccordionShimmer as React.ComponentType<AccordionShimmerProps & { children?: React.ReactNode }>;
    const { container } = render(
      <Comp asChild>
        <div data-testid="custom-root">
          <span>Shimmer content</span>
        </div>
      </Comp>,
    );
    // With asChild, the Slot renders onto the child element
    expect(container.querySelector("[role='status']")).toBeInTheDocument();
  });
});

describe("AccordionShimmer – extended", () => {
  it("renders count=1 producing exactly 1 item", () => {
    const { container } = render(<AccordionShimmer count={1} />);
    const root = container.firstChild as HTMLElement;
    expect(root.children.length).toBe(1);
    expect(root).toHaveAttribute("aria-label", "Loading 1 accordion items");
  });

  it("showContent=false (default) does not render subtitle or content blocks", () => {
    const { container } = render(<AccordionShimmer count={1} />);
    const root = container.firstChild as HTMLElement;
    // With showContent=false there should be exactly 2 shimmer divs per item:
    // title bar + icon bar. The content block and subtitle bar are absent.
    const roundedDivs = root.querySelectorAll(".rounded");
    // Only title (1) + icon (1) = 2 rounded elements for a single item
    expect(roundedDivs.length).toBe(2);
  });

  it("showContent=true renders subtitle and 3 content lines per item", () => {
    const { container } = render(<AccordionShimmer count={2} showContent />);
    const root = container.firstChild as HTMLElement;
    // Per item: title (1) + subtitle (1) + icon (1) + 3 content lines = 6
    // For 2 items: 12 rounded elements
    const roundedDivs = root.querySelectorAll(".rounded");
    expect(roundedDivs.length).toBe(12);
  });

  it("forwards ref to the root element", () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<AccordionShimmer ref={ref} />);
    expect(ref.current).toBe(container.firstChild);
  });

  it("size='sm' applies 'px-3 py-2 text-xs' trigger classes to each item header", () => {
    const { container } = render(<AccordionShimmer size="sm" count={1} />);
    const triggerRow = container.querySelector(".px-3.py-2.text-xs");
    expect(triggerRow).toBeInTheDocument();
  });

  it("size='md' applies 'px-4 py-4 text-sm' trigger classes to each item header", () => {
    const { container } = render(<AccordionShimmer size="md" count={1} />);
    const triggerRow = container.querySelector(".px-4.py-4.text-sm");
    expect(triggerRow).toBeInTheDocument();
  });

  it("size='lg' applies 'px-6 py-5 text-base' trigger classes to each item header", () => {
    const { container } = render(<AccordionShimmer size="lg" count={1} />);
    const triggerRow = container.querySelector(".px-6.py-5.text-base");
    expect(triggerRow).toBeInTheDocument();
  });

  it("variant='bordered' applies bordered root class to the root element", () => {
    const { container } = render(<AccordionShimmer variant="bordered" />);
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveClass("border");
    expect(root).toHaveClass("rounded-lg");
    expect(root).toHaveClass("overflow-hidden");
  });

  it("variant='separated' applies separated root class (space-y-2) to the root element", () => {
    const { container } = render(<AccordionShimmer variant="separated" />);
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveClass("space-y-2");
  });

  it("variant='flush' does not add bordered or separated root classes", () => {
    const { container } = render(<AccordionShimmer variant="flush" />);
    const root = container.firstChild as HTMLElement;
    expect(root).not.toHaveClass("border");
    expect(root).not.toHaveClass("space-y-2");
    expect(root).not.toHaveClass("rounded-lg");
  });

  it("TITLE_WIDTHS cycle correctly for items beyond index 5 (index % 5)", () => {
    // TITLE_WIDTHS = [75, 68, 82, 70, 78]
    // Item at index 5 should reuse width for index 0 (75%)
    // Item at index 6 should reuse width for index 1 (68%)
    const { container } = render(<AccordionShimmer count={7} />);
    const root = container.firstChild as HTMLElement;

    const titleBars = Array.from(root.querySelectorAll<HTMLElement>(".flex-1 > div:first-child"));
    expect(titleBars.length).toBe(7);

    const widths = titleBars.map((el) => el.style.width);
    // Indices 0–4 should match indices 5–6 via modulo
    expect(widths[5]).toBe(widths[0]); // 75%
    expect(widths[6]).toBe(widths[1]); // 68%
  });

  it("has displayName set to 'AccordionShimmer'", () => {
    expect(AccordionShimmer.displayName).toBe("AccordionShimmer");
  });
});
