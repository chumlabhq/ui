import { Tooltip } from "@chumlab/ui/tooltip";

const gradientBlue = { background: "linear-gradient(135deg, #0c3483 0%, #a2b6df 100%)" };

const gradientPink = { background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" };

const gradientGreen = { background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)" };

const gradientPurple = { background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" };

const contentClassNameGradient = "rounded-cl-md shadow-xl px-4 py-2.5 text-sm text-white font-medium";

export default function TooltipExample() {
  return (
    <>
      <Tooltip
                  content="Purple gradient with arrow"
                  classes={{ content: contentClassNameGradient }}
                  contentStyle={gradientPurple}
                  arrowColor="#764ba2"
                >
                  <button className={"cursor-pointer px-4 py-2 rounded-cl-md font-medium text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 bg-cl-bg-hover text-cl-text hover:bg-cl-bg-hover border border-cl-border focus-visible:ring-border-active dark:bg-cl-bg-elevated dark:text-cl-text dark:hover:bg-cl-text/10 dark:focus-visible:ring-border-active dark:focus-visible:ring-offset-cl-bg"}>Purple Gradient</button>
                </Tooltip>
      <Tooltip
                  content="Ocean breeze gradient"
                  classes={{ content: contentClassNameGradient }}
                  contentStyle={gradientGreen}
                  arrowColor="#38ef7d"
                >
                  <button className={"cursor-pointer px-4 py-2 rounded-cl-md font-medium text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 bg-cl-bg-hover text-cl-text hover:bg-cl-bg-hover border border-cl-border focus-visible:ring-border-active dark:bg-cl-bg-elevated dark:text-cl-text dark:hover:bg-cl-text/10 dark:focus-visible:ring-border-active dark:focus-visible:ring-offset-cl-bg"}>Green Gradient</button>
                </Tooltip>
      <Tooltip
                  content="Sunset gradient tooltip"
                  classes={{ content: contentClassNameGradient }}
                  contentStyle={gradientPink}
                  arrowColor="#f5576c"
                >
                  <button className={"cursor-pointer px-4 py-2 rounded-cl-md font-medium text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 bg-cl-bg-hover text-cl-text hover:bg-cl-bg-hover border border-cl-border focus-visible:ring-border-active dark:bg-cl-bg-elevated dark:text-cl-text dark:hover:bg-cl-text/10 dark:focus-visible:ring-border-active dark:focus-visible:ring-offset-cl-bg"}>Pink Gradient</button>
                </Tooltip>
      <Tooltip
                  content="Without arrow"
                  classes={{ content: contentClassNameGradient }}
                  contentStyle={gradientBlue}
                  showArrow={false}
                >
                  <button className={"cursor-pointer px-4 py-2 rounded-cl-md font-medium text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 bg-cl-bg-hover text-cl-text hover:bg-cl-bg-hover border border-cl-border focus-visible:ring-border-active dark:bg-cl-bg-elevated dark:text-cl-text dark:hover:bg-cl-text/10 dark:focus-visible:ring-border-active dark:focus-visible:ring-offset-cl-bg"}>No Arrow</button>
                </Tooltip>
    </>
  );
}
