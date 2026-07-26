import { describe, it, expect, afterEach } from "vitest";
import { pushModal, popModal, isTopModal } from "../utils/helpers";

// ─── pushModal / popModal / isTopModal ───────────────────────────────────────
// The modal stack is a module-level singleton so we manage state carefully.

describe("Modal stack management", () => {
  // Clean up after each test by popping any IDs we push.
  afterEach(() => {
    popModal("modal-a");
    popModal("modal-b");
    popModal("modal-c");
  });

  it("isTopModal returns false when stack is empty", () => {
    expect(isTopModal("modal-a")).toBe(false);
  });

  it("pushModal makes the pushed ID the top modal", () => {
    pushModal("modal-a");
    expect(isTopModal("modal-a")).toBe(true);
  });

  it("last pushed modal is the top modal", () => {
    pushModal("modal-a");
    pushModal("modal-b");
    expect(isTopModal("modal-b")).toBe(true);
    expect(isTopModal("modal-a")).toBe(false);
  });

  it("pushModal moves an existing ID to the top (deduplication)", () => {
    pushModal("modal-a");
    pushModal("modal-b");
    // Re-push modal-a → it should become the top
    pushModal("modal-a");
    expect(isTopModal("modal-a")).toBe(true);
    expect(isTopModal("modal-b")).toBe(false);
  });

  it("popModal removes an ID from the stack", () => {
    pushModal("modal-a");
    popModal("modal-a");
    expect(isTopModal("modal-a")).toBe(false);
  });

  it("popModal restores the previous top modal", () => {
    pushModal("modal-a");
    pushModal("modal-b");
    popModal("modal-b");
    expect(isTopModal("modal-a")).toBe(true);
  });

  it("popModal on an ID not in the stack is a no-op", () => {
    pushModal("modal-a");
    // modal-c was never pushed – should not throw and modal-a stays on top
    popModal("modal-c");
    expect(isTopModal("modal-a")).toBe(true);
  });

  it("only the top modal is top, regardless of mount order", () => {
    pushModal("modal-b");
    pushModal("modal-a");
    pushModal("modal-c");
    expect(isTopModal("modal-c")).toBe(true);
    expect(isTopModal("modal-a")).toBe(false);
    expect(isTopModal("modal-b")).toBe(false);
    // Closing the top hands control back to the one beneath it, not to the
    // first-mounted modal.
    popModal("modal-c");
    expect(isTopModal("modal-a")).toBe(true);
  });
});
