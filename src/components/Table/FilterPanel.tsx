import { useEffect, useRef, type ReactNode, type RefObject } from "react";

/**
 * The column-filter dialog, in its own chunk.
 *
 * `enableColumnFilters` with `filterableColumns` is off by default, and even
 * with it on this subtree exists only while a filter popup is open — after a
 * click, portalled to `document.body`, over the grid rather than in it. That
 * makes it the one part of Table that can arrive late without costing a
 * hydration mismatch or moving a single cell: ADR 003's two constraints are
 * both about the first paint, and this is not in it.
 *
 * The trigger button, the filter icon and the filter state stay in `Table`.
 * They render with the header on the first paint whenever `filterableColumns`
 * is set, so deferring them would widen the header cell a frame later.
 *
 * The popup's own behaviour came with it — focus in, reposition, close on an
 * outside click or a scroll — because all of it reads this element. Left in
 * `Table` those effects would have run on the render that opens the popup,
 * when the chunk is still in flight and the node does not exist, which is the
 * quiet half of a lazy split: the subtree arrives and its behaviour does not.
 */
export interface FilterPanelProps {
  /** The button that opened it: an outside click there is the toggle, not a close. */
  triggerRef: RefObject<HTMLButtonElement | null>;
  id: string;
  columnId: string;
  top: number;
  left: number;
  options: { label: string; value: string }[];
  /** `false` means picking one value replaces the selection and closes. */
  multi?: boolean;
  values: string[];
  onValuesChange: (values: string[]) => void;
  onClose: () => void;
  /** Replaces the whole body; the header and the option list are skipped. */
  renderColumnFilter?: (
    columnId: string,
    currentValues: string[],
    setValues: (values: string[]) => void,
  ) => ReactNode;
  classes: {
    content: string;
    header: string;
    label: string;
    clearTrigger: string;
    item: string;
    itemControl: string;
  };
}

export default function FilterPanel({
  triggerRef,
  id,
  columnId,
  top,
  left,
  options,
  multi,
  values,
  onValuesChange,
  onClose,
  renderColumnFilter,
  classes,
}: FilterPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on an outside click, and on any scroll. Tolerates portals spawned
  // from within the filter content (a nested dropdown, say) by checking for
  // the marker attribute on ancestors.
  useEffect(() => {
    const isInside = (target: Node) => {
      if (panelRef.current?.contains(target)) return true;
      if (triggerRef.current?.contains(target)) return true;
      if (target instanceof HTMLElement || target instanceof SVGElement) {
        return !!(target as Element).closest(
          "[data-table-filter-content], [data-dropdown-id]",
        );
      }
      return false;
    };

    const onPointerDown = (e: MouseEvent) => {
      if (!isInside(e.target as Node)) onClose();
    };
    const onScroll = (e: Event) => {
      if (!isInside(e.target as Node)) onClose();
    };

    document.addEventListener("mousedown", onPointerDown);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [onClose, triggerRef]);

  // The dialog role's half of the bargain: it portals to body, so without this
  // Tab from the trigger walks into the next column header and the filter
  // options are unreachable from the keyboard entirely. The measurement is
  // more accurate than the trigger's estimate, so the position is corrected
  // here too.
  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    el.focus({ preventScroll: true });
    const rect = el.getBoundingClientRect();
    if (rect.right > window.innerWidth - 8) {
      el.style.left = `${left - (rect.right - window.innerWidth + 8)}px`;
    }
  }, [columnId, top, left]);

  return (
    <div
      ref={panelRef}
      data-table-filter-content
      id={id}
      // A non-modal dialog, not a menu.
      //
      // It had no role at all: a plain portalled div, so it announced
      // itself as nothing and axe had nothing to fault — which is how the
      // a11y phase walked past it. `menu` is the nearest role name and the
      // wrong one. A menu puts screen readers into application mode and
      // promises arrow-key roving over a single tab stop; these are
      // ordinary buttons the user reaches with Tab, and claiming `menu`
      // would take that away rather than describe it. What this actually
      // is, is a popup holding a group of toggles, which is `dialog`.
      //
      // The role brings obligations the popup did not meet, so they are
      // met above and by `onClose`: focus moves in on open (it is portalled to
      // body, so Tab from the trigger reached the next column header instead),
      // Escape closes, and focus returns to the trigger.
      role="dialog"
      aria-modal={false}
      aria-label={`Filter ${columnId}`}
      tabIndex={-1}
      onKeyDown={(e) => {
        if (e.key !== "Escape") return;
        e.stopPropagation();
        onClose();
      }}
      className={`outline-none fixed rounded-cl-md border shadow-xl overflow-hidden min-w-[160px] sm:min-w-[180px] max-w-[calc(100vw-32px)] z-[9999] ${renderColumnFilter ? "" : "max-h-[250px] overflow-y-auto"} ${classes.content || "bg-cl-bg-panel border-cl-border"}`}
      style={{ top, left }}
      onClick={(e) => e.stopPropagation()}
    >
      {renderColumnFilter ? (
        renderColumnFilter(columnId, values, onValuesChange)
      ) : (
        <>
          <div className={classes.header}>
            <span className={classes.label}>Filter {columnId}</span>
            {values.length > 0 && (
              <button
                type="button"
                onClick={() => onValuesChange([])}
                className={classes.clearTrigger}
              >
                Clear
              </button>
            )}
          </div>
          {options.map((opt) => {
            const isSelected = values.includes(opt.value);
            return (
              <button
                key={opt.value}
                type="button"
                className={classes.item}
                // A toggle in both modes — single-select clears when the
                // selected value is clicked again — so the checkmark beside
                // it has a state to announce.
                aria-pressed={isSelected}
                data-selected={isSelected || undefined}
                onClick={() => {
                  if (multi !== false) {
                    onValuesChange(
                      isSelected
                        ? values.filter((v) => v !== opt.value)
                        : [...values, opt.value],
                    );
                  } else {
                    onValuesChange(isSelected ? [] : [opt.value]);
                    onClose();
                  }
                }}
              >
                <div
                  className={classes.itemControl}
                  data-selected={isSelected || undefined}
                >
                  {isSelected && (
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      // On the accent-filled checkbox: white is 2.77:1
                      // against the dark theme's accent, under SC 1.4.11's
                      // 3:1 for a UI component. `--cl-on-accent` is 5.17:1
                      // light and 7.31:1 dark.
                      stroke="var(--cl-on-accent)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                {opt.label}
              </button>
            );
          })}
        </>
      )}
    </div>
  );
}
