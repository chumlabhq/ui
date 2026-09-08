import { Tooltip } from "@chumlab/ui/tooltip";

export default function TooltipExample() {
  return (
    <div className="flex flex-col gap-4 w-full">
     <div className={`p-4 rounded-cl-lg bg-cl-bg-hover border border-cl-border dark:bg-cl-bg-elevated dark:border dark:border-cl-border`}>
                  <p className={`text-sm mb-3 text-cl-text-secondary`}>
                    Tooltip only appears when text is truncated:
                  </p>
     <div className={`w-full max-w-[220px] p-3 rounded-cl-md shadow-sm bg-white border border-cl-border dark:bg-cl-bg-elevated dark:border dark:border-cl-border`}>
                    <Tooltip
                      truncate
                      truncateWidth={196}
                      classes={{ trigger: `text-sm font-medium text-cl-text` }}
                    >
                      This is a very long text that will be truncated and show tooltip on hover
                    </Tooltip>
                  </div>
                </div>
     <div className={`p-4 rounded-cl-lg bg-cl-bg-hover border border-cl-border dark:bg-cl-bg-elevated dark:border dark:border-cl-border`}>
                  <p className={`text-sm mb-3 text-cl-text-secondary`}>
                    Short text - no tooltip needed:
                  </p>
     <div className={`w-full max-w-[220px] p-3 rounded-cl-md shadow-sm bg-white border border-cl-border dark:bg-cl-bg-elevated dark:border dark:border-cl-border`}>
                    <Tooltip
                      truncate
                      truncateWidth={196}
                      classes={{ trigger: `text-sm font-medium text-cl-text` }}
                    >
                      Short text
                    </Tooltip>
                  </div>
                </div>
              </div>
  );
}
