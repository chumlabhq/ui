import { useEffect } from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ToastProvider, useToast } from "../index.js";
import { setReducedMotion } from "../../../test/matchMedia.js";

beforeEach(() => setReducedMotion(false));

type Api = ReturnType<typeof useToast>;
const held: { api: Api | null } = { api: null };
const Grab = () => {
  const toast = useToast();
  useEffect(() => {
    held.api = toast;
  });
  return null;
};

describe("Toast id", () => {
  it("uses the id it is given, returns it and reports it to onDismiss", () => {
    const onDismiss = vi.fn();
    render(<ToastProvider><Grab /></ToastProvider>);
    let id = "";
    act(() => {
      id = held.api!.info("Saved", { id: "saved", onDismiss, duration: 60000, showCloseButton: true });
    });
    expect(id).toBe("saved");
    fireEvent.click(screen.getByRole("button", { name: /close|dismiss/i }));
    expect(onDismiss.mock.calls).toEqual([["saved"]]);
    let generated = "";
    act(() => {
      generated = held.api!.toast("Saved");
    });
    expect(generated).toMatch(/^toast-/);
  });

  it("replaces a live toast shown again with its id", () => {
    render(<ToastProvider><Grab /></ToastProvider>);
    act(() => {
      held.api!.info("First", { id: "one", duration: 60000 });
      held.api!.info("Second", { id: "one", duration: 60000 });
    });
    expect(screen.queryByText("First")).toBeNull();
    expect(screen.getAllByText("Second")).toHaveLength(1);
  });
});
