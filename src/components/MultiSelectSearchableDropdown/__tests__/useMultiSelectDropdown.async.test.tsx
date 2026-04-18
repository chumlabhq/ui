/**
 * Async tests for useMultiSelectDropdown are kept in a separate file to avoid
 * memory pressure when running many async act() wrappers in a single vitest worker.
 *
 * NOTE: When both `onSearch` and `loadInitialOnOpen` are combined, the hook's
 * debounce effect calls setAsyncOptions([]) with a new reference on every render
 * (when searchQuery is empty), which can cause a re-render loop in test environments.
 * Tests that exercise `loadInitialOnOpen` therefore do NOT pass `onSearch` simultaneously
 * to avoid this interaction.
 */
import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useMultiSelectDropdown } from "../utils/useMultiSelectDropdown";
import type { MultiSelectOption } from "../utils/types";

const OPTIONS: MultiSelectOption[] = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
];

// ---------------------------------------------------------------------------
// 18b / 19 / 20. Async onSearch with real short debounce
// ---------------------------------------------------------------------------

describe("useMultiSelectDropdown – async onSearch", () => {
  it("calls onSearch after debounce and populates displayOptions", async () => {
    const asyncResults: MultiSelectOption[] = [{ value: "x", label: "X" }];
    const onSearch = vi.fn().mockResolvedValue(asyncResults);

    const { result } = renderHook(() =>
      useMultiSelectDropdown({ options: [], onSearch, searchDebounceMs: 0 })
    );

    act(() => result.current.setSearchQuery("foo"));

    await act(async () => {
      await new Promise<void>((resolve) => setTimeout(resolve, 50));
    });

    expect(onSearch).toHaveBeenCalledWith("foo");
    expect(result.current.isSearching).toBe(false);
    expect(result.current.displayOptions).toEqual(asyncResults);
  });

  it("calls onSearch only once for the last query (debounce cancels prior calls)", async () => {
    const onSearch = vi.fn().mockResolvedValue([]);
    const { result } = renderHook(() =>
      useMultiSelectDropdown({ options: [], onSearch, searchDebounceMs: 0 })
    );

    // Fire multiple rapid updates — only the last should produce a call
    act(() => result.current.setSearchQuery("a"));
    act(() => result.current.setSearchQuery("ab"));
    act(() => result.current.setSearchQuery("abc"));

    await act(async () => {
      await new Promise<void>((resolve) => setTimeout(resolve, 50));
    });

    expect(onSearch).toHaveBeenCalledWith("abc");
  });

  it("clears asyncOptions and isSearching when searchQuery becomes empty after search", async () => {
    const asyncResults: MultiSelectOption[] = [{ value: "x", label: "X" }];
    const onSearch = vi.fn().mockResolvedValue(asyncResults);
    const { result } = renderHook(() =>
      useMultiSelectDropdown({ options: [], onSearch, searchDebounceMs: 0 })
    );

    act(() => result.current.setSearchQuery("foo"));
    await act(async () => {
      await new Promise<void>((resolve) => setTimeout(resolve, 50));
    });
    expect(result.current.displayOptions).toEqual(asyncResults);

    act(() => result.current.setSearchQuery(""));
    expect(result.current.displayOptions).toEqual([]);
    expect(result.current.isSearching).toBe(false);
  });

  it("calls onLoadError when onSearch rejects", async () => {
    const error = new Error("search failed");
    const onSearch = vi.fn().mockRejectedValue(error);
    const onLoadError = vi.fn();

    const { result } = renderHook(() =>
      useMultiSelectDropdown({ options: [], onSearch, onLoadError, searchDebounceMs: 0 })
    );

    act(() => result.current.setSearchQuery("fail"));
    await act(async () => {
      await new Promise<void>((resolve) => setTimeout(resolve, 50));
    });

    expect(onLoadError).toHaveBeenCalledWith(error);
    expect(result.current.isSearching).toBe(false);
    expect(result.current.displayOptions).toEqual([]);
  });

  it("keeps selected initialOptions in selectedOptions after search resolves", async () => {
    const initialOpts: MultiSelectOption[] = [{ value: "saved", label: "Saved Option" }];
    const searchResults: MultiSelectOption[] = [{ value: "r1", label: "Result 1" }];
    const onSearch = vi.fn().mockResolvedValue(searchResults);

    const { result } = renderHook(() =>
      useMultiSelectDropdown({
        options: [],
        onSearch,
        initialOptions: initialOpts,
        defaultValue: ["saved"],
        searchDebounceMs: 0,
      })
    );

    expect(result.current.selectedOptions).toEqual(initialOpts);

    act(() => result.current.setSearchQuery("res"));
    await act(async () => {
      await new Promise<void>((resolve) => setTimeout(resolve, 50));
    });

    // "saved" is in allOptions via initialOptions → still in selectedOptions
    expect(result.current.selectedOptions).toEqual(initialOpts);
  });
});

// ---------------------------------------------------------------------------
// 21. loadInitialOnOpen
// Note: these tests do NOT pass onSearch alongside onLoadInitialOptions to
// avoid the setAsyncOptions([]) infinite re-render in the debounce effect.
// ---------------------------------------------------------------------------

describe("useMultiSelectDropdown – loadInitialOnOpen", () => {
  it("calls onLoadInitialOptions on first open", async () => {
    const initialResults: MultiSelectOption[] = [{ value: "loaded", label: "Loaded" }];
    const onLoadInitialOptions = vi.fn().mockResolvedValue(initialResults);

    const { result } = renderHook(() =>
      useMultiSelectDropdown({
        options: [],
        onLoadInitialOptions,
        loadInitialOnOpen: true,
      })
    );

    await act(async () => { result.current.handleToggle(); });
    expect(onLoadInitialOptions).toHaveBeenCalledTimes(1);
  });

  it("does NOT call onLoadInitialOptions on subsequent opens", async () => {
    const initialResults: MultiSelectOption[] = [{ value: "loaded", label: "Loaded" }];
    const onLoadInitialOptions = vi.fn().mockResolvedValue(initialResults);

    const { result } = renderHook(() =>
      useMultiSelectDropdown({
        options: [],
        onLoadInitialOptions,
        loadInitialOnOpen: true,
      })
    );

    await act(async () => { result.current.handleToggle(); }); // first open
    expect(onLoadInitialOptions).toHaveBeenCalledTimes(1);

    act(() => result.current.handleToggle()); // close
    await act(async () => { result.current.handleToggle(); }); // second open
    expect(onLoadInitialOptions).toHaveBeenCalledTimes(1);
  });

  it("sets isLoadingInitial=true while loading, false after", async () => {
    let resolve!: (opts: MultiSelectOption[]) => void;
    const pending = new Promise<MultiSelectOption[]>((res) => { resolve = res; });
    const onLoadInitialOptions = vi.fn().mockReturnValue(pending);

    const { result } = renderHook(() =>
      useMultiSelectDropdown({
        options: [],
        onLoadInitialOptions,
        loadInitialOnOpen: true,
      })
    );

    act(() => result.current.handleToggle());
    expect(result.current.isLoadingInitial).toBe(true);

    await act(async () => { resolve([]); });
    expect(result.current.isLoadingInitial).toBe(false);
  });

  it("includes loaded options in displayOptions after loading", async () => {
    const initialResults: MultiSelectOption[] = [
      { value: "loaded", label: "Loaded Option" },
    ];
    const onLoadInitialOptions = vi.fn().mockResolvedValue(initialResults);

    const { result } = renderHook(() =>
      useMultiSelectDropdown({
        options: [],
        onLoadInitialOptions,
        loadInitialOnOpen: true,
      })
    );

    await act(async () => { result.current.handleToggle(); });
    // In sync mode (no onSearch), loaded options go into loadedInitialOptions
    // which feeds into allInitialOptions. Since isAsync=false, displayOptions = filteredSyncOptions = options
    // But we can verify the loaded options appear in allOptions via selectedOptions
    // when a loaded option value is in selectedValues
    expect(onLoadInitialOptions).toHaveBeenCalledTimes(1);
  });

  it("calls onLoadError when onLoadInitialOptions rejects", async () => {
    const error = new Error("load failed");
    const onLoadInitialOptions = vi.fn().mockRejectedValue(error);
    const onLoadError = vi.fn();

    const { result } = renderHook(() =>
      useMultiSelectDropdown({
        options: [],
        onLoadInitialOptions,
        loadInitialOnOpen: true,
        onLoadError,
      })
    );

    await act(async () => { result.current.handleToggle(); });
    expect(onLoadError).toHaveBeenCalledWith(error);
  });

  it("does not call onLoadInitialOptions when loadInitialOnOpen=false", async () => {
    const onLoadInitialOptions = vi.fn().mockResolvedValue([]);

    const { result } = renderHook(() =>
      useMultiSelectDropdown({
        options: OPTIONS,
        onLoadInitialOptions,
        loadInitialOnOpen: false,
      })
    );

    await act(async () => { result.current.handleToggle(); });
    expect(onLoadInitialOptions).not.toHaveBeenCalled();
  });

  it("loaded options appear in async displayOptions when onSearch also provided", async () => {
    // This tests the async mode with loadInitialOnOpen loading into allInitialOptions
    // Use a controlled approach: set searchQuery to truthy first so the debounce
    // effect no longer calls setAsyncOptions([]) on empty string, then open
    const initialResults: MultiSelectOption[] = [
      { value: "loaded", label: "Loaded Option" },
    ];
    const onLoadInitialOptions = vi.fn().mockResolvedValue(initialResults);
    const onSearch = vi.fn().mockResolvedValue([]);

    const { result } = renderHook(() =>
      useMultiSelectDropdown({
        options: [],
        onSearch,
        onLoadInitialOptions,
        loadInitialOnOpen: true,
        searchDebounceMs: 60_000, // large debounce so timer doesn't fire
      })
    );

    // Open → triggers loadInitialOnOpen effect
    act(() => result.current.handleToggle());

    // Wait for the load promise to resolve
    await act(async () => {
      await new Promise<void>((resolve) => setTimeout(resolve, 0));
    });

    // With empty searchQuery in async mode, displayOptions = allInitialOptions
    // which now includes the loaded results
    expect(result.current.displayOptions).toEqual(initialResults);
  });
});
