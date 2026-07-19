/** @vitest-environment jsdom */
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Markdown from "./Markdown";

// The refine-path intent guard answers a no-op/question follow-up as a plain
// assistant turn, and its `message` is markdown (react-markdown + remark-gfm).
// This pins the rendered shape the classify-followup prompt is told to produce:
// a short lead sentence followed by bullets when it offers alternatives.
describe("Markdown (refine answer rendering)", () => {
  it("renders a no-op answer's alternatives as a bullet list", () => {
    const answer =
      "The middle tier is already highlighted. It has the accent border and the 'Popular' badge, so a rebuild wouldn't change anything. If you want it to stand out more, I could:\n\n" +
      "- make it taller than the other tiers\n" +
      "- add a soft shadow or a tinted background";

    render(<Markdown>{answer}</Markdown>);

    const items = screen.getAllByRole("listitem");
    expect(items.length).toBe(2);
    expect(items[0].textContent).toMatch(/taller/);
    expect(screen.getByText(/already highlighted/)).toBeTruthy();
    // The em-dash sentence connector is the AI tell the prompt tells it to avoid.
    expect(answer).not.toContain(" — ");
  });

  it("keeps a one-line answer as a single paragraph, no list", () => {
    render(<Markdown>{"It uses a toggle because the choice is binary and reversible."}</Markdown>);
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
    expect(screen.getByText(/binary and reversible/)).toBeTruthy();
  });
});
