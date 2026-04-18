import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import {
  createExpandedStore,
  useExpandedStore,
  useAccordionContext,
  useAccordionDispatch,
  useAccordionConfig,
  useAccordionItemContext,
  useAccordionItem,
  useAccordionState,
  AccordionExpandedContext,
  AccordionContext,
  AccordionDispatchContext,
  AccordionConfigContext,
  AccordionItemContext,
} from "../utils/context";
import type {
  AccordionContextValue,
  AccordionDispatchValue,
  AccordionConfigValue,
  AccordionItemContextValue,
} from "../utils/types";
import React from "react";

// ─── createExpandedStore ────────────────────────────────────────────────────

describe("createExpandedStore", () => {
  it("getSnapshot returns the initial set", () => {
    const initial = new Set(["a", "b"]);
    const store = createExpandedStore(initial);
    expect(store.getSnapshot()).toBe(initial);
  });

  it("isExpanded returns true for contained values and false for others", () => {
    const store = createExpandedStore(new Set(["x"]));
    expect(store.isExpanded("x")).toBe(true);
    expect(store.isExpanded("y")).toBe(false);
  });

  it("subscribe adds a listener and returns an unsubscribe function", () => {
    const store = createExpandedStore(new Set<string>());
    const listener = vi.fn();
    const unsubscribe = store.subscribe(listener);

    // Trigger a change so the listener would fire
    store.setValues(new Set(["a"]));
    expect(listener).toHaveBeenCalledTimes(1);

    // After unsubscribe, listener must not be called again
    unsubscribe();
    store.setValues(new Set(["b"]));
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("setValues notifies listeners when the value reference changes", () => {
    const store = createExpandedStore(new Set<string>());
    const listener = vi.fn();
    store.subscribe(listener);

    const newSet = new Set(["c"]);
    store.setValues(newSet);

    expect(listener).toHaveBeenCalledTimes(1);
    expect(store.getSnapshot()).toBe(newSet);
  });

  it("setValues is a no-op when the same reference is passed", () => {
    const initial = new Set(["a"]);
    const store = createExpandedStore(initial);
    const listener = vi.fn();
    store.subscribe(listener);

    // Pass the exact same reference – should not notify
    store.setValues(initial);

    expect(listener).not.toHaveBeenCalled();
    expect(store.getSnapshot()).toBe(initial);
  });

  it("notifies multiple listeners on setValues", () => {
    const store = createExpandedStore(new Set<string>());
    const l1 = vi.fn();
    const l2 = vi.fn();
    store.subscribe(l1);
    store.subscribe(l2);

    store.setValues(new Set(["d"]));
    expect(l1).toHaveBeenCalledTimes(1);
    expect(l2).toHaveBeenCalledTimes(1);
  });
});

// ─── useExpandedStore ────────────────────────────────────────────────────────

describe("useExpandedStore", () => {
  it("throws when used outside AccordionExpandedContext", () => {
    expect(() =>
      renderHook(() => useExpandedStore())
    ).toThrow(
      "Accordion compound components must be used within an <Accordion> component"
    );
  });

  it("returns the store when context is provided", () => {
    const store = createExpandedStore(new Set<string>());
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AccordionExpandedContext.Provider value={store}>
        {children}
      </AccordionExpandedContext.Provider>
    );
    const { result } = renderHook(() => useExpandedStore(), { wrapper });
    expect(result.current).toBe(store);
  });
});

// ─── useAccordionContext ─────────────────────────────────────────────────────

describe("useAccordionContext", () => {
  it("throws when used outside AccordionContext", () => {
    expect(() =>
      renderHook(() => useAccordionContext())
    ).toThrow(
      "Accordion compound components must be used within an <Accordion> component"
    );
  });

  it("returns the context value when provided", () => {
    const value: AccordionContextValue = {
      type: "single",
      collapsible: true,
      loop: false,
      itemCount: 3,
      announceExpanded: false,
      pendingItem: null,
    };
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AccordionContext.Provider value={value}>{children}</AccordionContext.Provider>
    );
    const { result } = renderHook(() => useAccordionContext(), { wrapper });
    expect(result.current).toEqual(value);
  });
});

// ─── useAccordionDispatch ────────────────────────────────────────────────────

describe("useAccordionDispatch", () => {
  it("throws when used outside AccordionDispatchContext", () => {
    expect(() =>
      renderHook(() => useAccordionDispatch())
    ).toThrow(
      "Accordion compound components must be used within an <Accordion> component"
    );
  });

  it("returns the dispatch value when provided", () => {
    const dispatch: AccordionDispatchValue = {
      toggleItem: vi.fn(),
      registerItem: vi.fn(),
      unregisterItem: vi.fn(),
      focusItem: vi.fn(),
      focusItemByValue: vi.fn(),
    };
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AccordionDispatchContext.Provider value={dispatch}>
        {children}
      </AccordionDispatchContext.Provider>
    );
    const { result } = renderHook(() => useAccordionDispatch(), { wrapper });
    expect(result.current).toBe(dispatch);
  });
});

// ─── useAccordionConfig ──────────────────────────────────────────────────────

describe("useAccordionConfig", () => {
  it("throws when used outside AccordionConfigContext", () => {
    expect(() =>
      renderHook(() => useAccordionConfig())
    ).toThrow(
      "Accordion compound components must be used within an <Accordion> component"
    );
  });

  it("returns the config value when provided", () => {
    const config: AccordionConfigValue = {
      orientation: "vertical",
      dir: "ltr",
      classes: {},
      headingLevel: 3,
      reduceMotion: false,
      unstyled: false,
      accordionId: "acc-1",
      disabled: false,
      size: "md",
      variant: "default",
      animationDuration: 300,
      animationEasing: "ease",
    };
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AccordionConfigContext.Provider value={config}>
        {children}
      </AccordionConfigContext.Provider>
    );
    const { result } = renderHook(() => useAccordionConfig(), { wrapper });
    expect(result.current).toEqual(config);
  });
});

// ─── useAccordionItemContext ─────────────────────────────────────────────────

describe("useAccordionItemContext", () => {
  it("throws when used outside AccordionItemContext", () => {
    expect(() =>
      renderHook(() => useAccordionItemContext())
    ).toThrow(
      "AccordionTrigger and AccordionContent must be used within an <AccordionItem> component"
    );
  });

  it("returns the item context value when provided", () => {
    const itemCtx: AccordionItemContextValue = {
      value: "item-1",
      disabled: false,
      isExpanded: true,
      triggerId: "trigger-1",
      contentId: "content-1",
    };
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AccordionItemContext.Provider value={itemCtx}>
        {children}
      </AccordionItemContext.Provider>
    );
    const { result } = renderHook(() => useAccordionItemContext(), { wrapper });
    expect(result.current).toEqual(itemCtx);
  });
});

// ─── useAccordionItem ────────────────────────────────────────────────────────

function makeAllContextWrapper(
  expanded: Set<string>,
  dispatch: AccordionDispatchValue,
  context: AccordionContextValue,
  config: AccordionConfigValue,
) {
  const store = createExpandedStore(expanded);
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <AccordionExpandedContext.Provider value={store}>
        <AccordionDispatchContext.Provider value={dispatch}>
          <AccordionContext.Provider value={context}>
            <AccordionConfigContext.Provider value={config}>
              {children}
            </AccordionConfigContext.Provider>
          </AccordionContext.Provider>
        </AccordionDispatchContext.Provider>
      </AccordionExpandedContext.Provider>
    );
  };
}

const baseContext: AccordionContextValue = {
  type: "single",
  collapsible: true,
  loop: false,
  itemCount: 2,
  announceExpanded: false,
  pendingItem: null,
};

const baseConfig: AccordionConfigValue = {
  orientation: "vertical",
  dir: "ltr",
  classes: {},
  headingLevel: 3,
  reduceMotion: false,
  unstyled: false,
  accordionId: "acc-test",
  disabled: false,
  size: "md",
  variant: "default",
  animationDuration: 300,
  animationEasing: "ease",
};

describe("useAccordionItem", () => {
  it("returns isExpanded=false when item is not in the expanded set", () => {
    const dispatch: AccordionDispatchValue = {
      toggleItem: vi.fn(),
      registerItem: vi.fn(),
      unregisterItem: vi.fn(),
      focusItem: vi.fn(),
      focusItemByValue: vi.fn(),
    };
    const wrapper = makeAllContextWrapper(new Set<string>(), dispatch, baseContext, baseConfig);
    const { result } = renderHook(() => useAccordionItem("item-1"), { wrapper });
    expect(result.current.isExpanded).toBe(false);
  });

  it("returns isExpanded=true when item is in the expanded set", () => {
    const dispatch: AccordionDispatchValue = {
      toggleItem: vi.fn(),
      registerItem: vi.fn(),
      unregisterItem: vi.fn(),
      focusItem: vi.fn(),
      focusItemByValue: vi.fn(),
    };
    const wrapper = makeAllContextWrapper(new Set(["item-1"]), dispatch, baseContext, baseConfig);
    const { result } = renderHook(() => useAccordionItem("item-1"), { wrapper });
    expect(result.current.isExpanded).toBe(true);
  });

  it("toggle calls dispatch.toggleItem with the value", () => {
    const toggleItem = vi.fn();
    const dispatch: AccordionDispatchValue = {
      toggleItem,
      registerItem: vi.fn(),
      unregisterItem: vi.fn(),
      focusItem: vi.fn(),
      focusItemByValue: vi.fn(),
    };
    const wrapper = makeAllContextWrapper(new Set<string>(), dispatch, baseContext, baseConfig);
    const { result } = renderHook(() => useAccordionItem("item-1"), { wrapper });
    act(() => result.current.toggle());
    expect(toggleItem).toHaveBeenCalledWith("item-1");
  });

  it("expand calls dispatch.toggleItem when item is collapsed", () => {
    const toggleItem = vi.fn();
    const dispatch: AccordionDispatchValue = {
      toggleItem,
      registerItem: vi.fn(),
      unregisterItem: vi.fn(),
      focusItem: vi.fn(),
      focusItemByValue: vi.fn(),
    };
    const wrapper = makeAllContextWrapper(new Set<string>(), dispatch, baseContext, baseConfig);
    const { result } = renderHook(() => useAccordionItem("item-1"), { wrapper });
    act(() => result.current.expand());
    expect(toggleItem).toHaveBeenCalledWith("item-1");
  });

  it("expand is a no-op when item is already expanded", () => {
    const toggleItem = vi.fn();
    const dispatch: AccordionDispatchValue = {
      toggleItem,
      registerItem: vi.fn(),
      unregisterItem: vi.fn(),
      focusItem: vi.fn(),
      focusItemByValue: vi.fn(),
    };
    const wrapper = makeAllContextWrapper(new Set(["item-1"]), dispatch, baseContext, baseConfig);
    const { result } = renderHook(() => useAccordionItem("item-1"), { wrapper });
    act(() => result.current.expand());
    expect(toggleItem).not.toHaveBeenCalled();
  });

  it("collapse calls dispatch.toggleItem when item is expanded", () => {
    const toggleItem = vi.fn();
    const dispatch: AccordionDispatchValue = {
      toggleItem,
      registerItem: vi.fn(),
      unregisterItem: vi.fn(),
      focusItem: vi.fn(),
      focusItemByValue: vi.fn(),
    };
    const wrapper = makeAllContextWrapper(new Set(["item-1"]), dispatch, baseContext, baseConfig);
    const { result } = renderHook(() => useAccordionItem("item-1"), { wrapper });
    act(() => result.current.collapse());
    expect(toggleItem).toHaveBeenCalledWith("item-1");
  });

  it("collapse is a no-op when item is already collapsed", () => {
    const toggleItem = vi.fn();
    const dispatch: AccordionDispatchValue = {
      toggleItem,
      registerItem: vi.fn(),
      unregisterItem: vi.fn(),
      focusItem: vi.fn(),
      focusItemByValue: vi.fn(),
    };
    const wrapper = makeAllContextWrapper(new Set<string>(), dispatch, baseContext, baseConfig);
    const { result } = renderHook(() => useAccordionItem("item-1"), { wrapper });
    act(() => result.current.collapse());
    expect(toggleItem).not.toHaveBeenCalled();
  });
});

// ─── useAccordionState ───────────────────────────────────────────────────────

describe("useAccordionState", () => {
  it("returns correct state when nothing is expanded", () => {
    const dispatch: AccordionDispatchValue = {
      toggleItem: vi.fn(),
      registerItem: vi.fn(),
      unregisterItem: vi.fn(),
      focusItem: vi.fn(),
      focusItemByValue: vi.fn(),
    };
    const context: AccordionContextValue = {
      ...baseContext,
      itemCount: 3,
      type: "multiple",
    };
    const wrapper = makeAllContextWrapper(new Set<string>(), dispatch, context, baseConfig);
    const { result } = renderHook(() => useAccordionState(), { wrapper });

    expect(result.current.expandedValues).toEqual([]);
    expect(result.current.expandedCount).toBe(0);
    expect(result.current.itemCount).toBe(3);
    expect(result.current.type).toBe("multiple");
    expect(result.current.disabled).toBe(false);
    expect(result.current.isAllExpanded).toBe(false);
    expect(result.current.isAllCollapsed).toBe(true);
  });

  it("returns isAllExpanded=true when all items are expanded", () => {
    const dispatch: AccordionDispatchValue = {
      toggleItem: vi.fn(),
      registerItem: vi.fn(),
      unregisterItem: vi.fn(),
      focusItem: vi.fn(),
      focusItemByValue: vi.fn(),
    };
    const context: AccordionContextValue = {
      ...baseContext,
      itemCount: 2,
      type: "multiple",
    };
    const config: AccordionConfigValue = { ...baseConfig, disabled: true };
    const wrapper = makeAllContextWrapper(new Set(["a", "b"]), dispatch, context, config);
    const { result } = renderHook(() => useAccordionState(), { wrapper });

    expect(result.current.expandedValues).toEqual(expect.arrayContaining(["a", "b"]));
    expect(result.current.expandedCount).toBe(2);
    expect(result.current.isAllExpanded).toBe(true);
    expect(result.current.isAllCollapsed).toBe(false);
    expect(result.current.disabled).toBe(true);
  });
});
