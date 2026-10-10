import { describe, expect, it, afterEach, beforeEach } from "vitest";
import { render, cleanup, screen } from "@testing-library/react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../../components/Accordion/index.js";
import { setReducedMotion } from "../../test/matchMedia.js";

/**
 * A `classes` override composes with the library default and wins on conflict.
 *
 * It used to replace: `classesProp?.trigger ?? cn(defaults)`, at 386 sites
 * across all thirty components. So a consumer who overrode one slot silently
 * lost everything the library had put there — `cursor-pointer`, and more
 * seriously the whole focus ring, which is a WCAG 2.4.7 failure with nothing to
 * warn them. It reached the demo pages first: every section that passed
 * `classes` rendered triggers with no pointer cursor.
 *
 * Both halves are asserted here because only having one is what let this
 * through. Compose without the consumer winning would be a floor they cannot
 * cross; the consumer winning without composing is the bug being fixed.
 */
const trigger = () => screen.getByRole("button", { name: /Section/ });

const renderWith = (classes?: { trigger?: string }) =>
  render(
    <Accordion selectionMode="single" collapsible classes={classes}>
      <AccordionItem value="a">
        <AccordionTrigger>Section</AccordionTrigger>
        <AccordionContent>Body</AccordionContent>
      </AccordionItem>
    </Accordion>,
  );

describe("a classes override composes with the library default", () => {
  // The harness refuses to default this, so the reduced-motion gate cannot go
  // inert the way it did once before.
  beforeEach(() => setReducedMotion(false));
  afterEach(cleanup);

  it("keeps the library's affordances when the override does not mention them", () => {
    renderWith({ trigger: "px-8 bg-red-500" });
    const cls = trigger().className;

    // The consumer's own classes are there.
    expect(cls).toContain("px-8");
    expect(cls).toContain("bg-red-500");
    // And so is what the library put on the slot, which used to vanish.
    expect(cls).toContain("cursor-pointer");
    expect(cls).toContain("focus-visible:ring-2");
  });

  it("lets the consumer's cursor beat the library's", () => {
    renderWith({ trigger: "cursor-default" });
    const cls = trigger().className;

    expect(cls).toContain("cursor-default");
    // tailwind-merge resolves the conflict to whichever comes last, and the
    // consumer's string is ordered last for exactly this reason.
    expect(cls).not.toContain("cursor-pointer");
  });

  it("lets the consumer's focus ring beat the library's", () => {
    renderWith({ trigger: "focus-visible:ring-4 focus-visible:ring-fuchsia-500" });
    const cls = trigger().className;

    expect(cls).toContain("focus-visible:ring-4");
    expect(cls).toContain("focus-visible:ring-fuchsia-500");
    expect(cls).not.toContain("focus-visible:ring-2");
    expect(cls).not.toContain("focus-visible:ring-cl-accent");
  });

  it("still paints the library's affordances with no override at all", () => {
    renderWith();
    const cls = trigger().className;
    expect(cls).toContain("cursor-pointer");
    expect(cls).toContain("focus-visible:ring-2");
  });
});
