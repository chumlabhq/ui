import { Tooltip } from "@chumlab/ui/tooltip";

export default function TooltipExample() {
  return (
    <div className="w-full rounded-cl-lg border overflow-hidden border-cl-border">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-cl-bg-elevated">
        <div
          className="px-4 py-3 text-xs font-semibold uppercase tracking-wider bg-cl-bg-elevated text-cl-text-tertiary"
        >
          Title
        </div>
        <div
          className="px-4 py-3 text-xs font-semibold uppercase tracking-wider bg-cl-bg-elevated text-cl-text-tertiary"
        >
          Description
        </div>
        <div
          className="px-4 py-3 text-xs font-semibold uppercase tracking-wider bg-cl-bg-elevated text-cl-text-tertiary"
        >
          Author
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-cl-bg-elevated">
        <div className="px-4 py-3 bg-cl-bg-elevated">
          <Tooltip
            truncate
            truncateWidth={150}
            classes={{ trigger: "text-sm font-medium cursor-pointer hover:underline text-cl-accent hover:text-cl-text" }}
          >
            Short Title
          </Tooltip>
        </div>
        <div className="px-4 py-3 bg-cl-bg-elevated">
          <Tooltip
            truncate
            truncateWidth={150}
            classes={{ trigger: "text-sm text-cl-text-secondary" }}
          >
            Brief description
          </Tooltip>
        </div>
        <div className="px-4 py-3 bg-cl-bg-elevated">
          <Tooltip
            truncate
            truncateWidth={150}
            classes={{ trigger: "text-sm text-cl-text-secondary" }}
          >
            John Doe
          </Tooltip>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-cl-bg-elevated">
        <div className="px-4 py-3 bg-cl-bg-elevated">
          <Tooltip
            truncate
            truncateWidth={150}
            classes={{ trigger: "text-sm font-medium cursor-pointer hover:underline text-cl-accent hover:text-cl-text" }}
          >
            This is a very long title that should truncate nicely
          </Tooltip>
        </div>
        <div className="px-4 py-3 bg-cl-bg-elevated">
          <Tooltip
            truncate
            truncateWidth={150}
            classes={{ trigger: "text-sm text-cl-text-secondary" }}
          >
            A much longer description that definitely won't fit in the cell
          </Tooltip>
        </div>
        <div className="px-4 py-3 bg-cl-bg-elevated">
          <Tooltip
            truncate
            truncateWidth={150}
            classes={{ trigger: "text-sm text-cl-text-secondary" }}
          >
            Alexander Christopher Williams III
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
