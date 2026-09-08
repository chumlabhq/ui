import { Tooltip } from "@chumlab/ui/tooltip";

const richContentStatus = (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-cl-success"></span>
        <span className="font-medium">Online</span>
      </div>
      <p className={`text-xs text-cl-text-secondary`}>Last seen just now</p>
    </div>
  );

const richContentProTip = (
    <div className="space-y-2">
      <div className={`font-semibold text-cl-text`}>Pro Tip</div>
      <p className={false ? "text-cl-text-secondary" : "text-cl-text-secondary"}>
        Tooltips can contain <strong>rich HTML</strong> content including{" "}
        <span className={false ? "text-cl-accent" : "text-cl-accent"}>colored text</span>,{" "}
        <em>italics</em>, and more.
      </p>
    </div>
  );

export default function TooltipExample() {
  return (
    <>
      <Tooltip content={richContentProTip} maxWidth={280}>
                  <button className={"cursor-pointer px-4 py-2 rounded-cl-md font-medium text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 bg-cl-bg-hover text-cl-text hover:bg-cl-bg-hover border border-cl-border focus-visible:ring-border-active dark:bg-cl-bg-elevated dark:text-cl-text dark:hover:bg-cl-text/10 dark:focus-visible:ring-border-active dark:focus-visible:ring-offset-cl-bg"}>Rich Content</button>
                </Tooltip>
      <Tooltip content={richContentStatus}>
                  <button className={"cursor-pointer px-4 py-2 rounded-cl-md font-medium text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 bg-cl-bg-hover text-cl-text hover:bg-cl-bg-hover border border-cl-border focus-visible:ring-border-active dark:bg-cl-bg-elevated dark:text-cl-text dark:hover:bg-cl-text/10 dark:focus-visible:ring-border-active dark:focus-visible:ring-offset-cl-bg"}>Status Tooltip</button>
                </Tooltip>
    </>
  );
}
