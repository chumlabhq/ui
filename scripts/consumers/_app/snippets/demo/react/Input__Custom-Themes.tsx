import { Input } from "@chumlab/ui/input";

const Icon = ({
  d,
  size = 16,
  className = "",
}: {
  d: string;
  size?: number;
  className?: string;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {d.split("|").map((path, i) => (
      <path key={i} d={path} />
    ))}
  </svg>
);

const SearchIcon = ({ className = "" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

export default function InputExample() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                  {(
                    [
                      [
                        "Pill shape",
     `px-5 py-2.5 rounded-full gap-2.5 transition-all duration-150 border border-cl-border bg-cl-bg-hover shadow-sm focus-within:ring-2 focus-within:ring-cl-accent/15 focus-within:border-cl-border-input-focus focus-within:bg-cl-bg-elevated dark:border dark:border-cl-text/10 dark:bg-cl-text/4 dark:focus-within:ring-2 dark:focus-within:ring-cl-accent/30 dark:focus-within:border-cl-border-input-focus/50`,
                        "Search...",
                        <SearchIcon className={"text-cl-text-tertiary"} />
                      ],
                      [
                        "Underline",
                        `px-0.5 py-2.5 border-b-2 gap-2.5 transition-all duration-150 border border-cl-border focus-within:border-cl-border-input-focus dark:border dark:border-cl-text/10 dark:focus-within:border-cl-border-input-focus`,
                        "Enter text...",
                        undefined
                      ],
                      [
                        "Purple accent",
                        `px-3.5 py-2.5 rounded-cl-lg border gap-2.5 transition-all duration-150 border-cl-border-input-focus bg-cl-accent/30 shadow-sm focus-within:ring-2 focus-within:ring-cl-accent/15 focus-within:border-cl-border-input-focus dark:border dark:border-cl-border-input-focus/30 dark:bg-cl-accent/0.06 dark:focus-within:ring-2 dark:focus-within:ring-cl-accent/25 dark:focus-within:border-cl-border-input-focus`,
                        "Purple theme...",
                        undefined
                      ],
                      [
                        "Elevated shadow",
                        `px-3.5 py-2.5 rounded-cl-lg border-0 gap-2.5 transition-all duration-150 bg-white shadow-md shadow-black/[0.08] focus-within:shadow-lg focus-within:ring-1 focus-within:ring-border-soft dark:bg-cl-text/6 dark:shadow-lg dark:shadow-black/20 dark:focus-within:ring-1 dark:focus-within:ring-cl-text/10`,
                        "Floating...",
                        undefined
                      ],
                      [
                        "Green money",
                        `px-3.5 py-2.5 rounded-cl-lg border gap-2.5 transition-all duration-150 border-cl-success bg-cl-success/30 shadow-sm focus-within:ring-2 focus-within:ring-cl-success/15 dark:border dark:border-cl-success/30 dark:bg-cl-success/0.06 dark:focus-within:ring-2 dark:focus-within:ring-cl-success/25`,
                        "0.00",
                        <Icon
                          d="M12 2v20|M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
                          className={false ? "text-cl-success" : "text-cl-success"}
                        />
                      ],
                      [
                        "Large size",
                        `px-4 py-4 rounded-cl-lg border gap-3 transition-all duration-150 border-cl-border bg-white shadow-sm focus-within:ring-2 focus-within:ring-cl-accent/15 dark:border dark:border-cl-text/10 dark:bg-cl-text/4 dark:focus-within:ring-2 dark:focus-within:ring-cl-accent/30`,
                        "Large input...",
                        undefined
                      ]
                    ] as const
                  ).map(([label, wCls, ph, icon]) => (
                    <div key={String(label)} className="space-y-1.5">
                      <span className={"text-[11px] font-semibold uppercase tracking-wider text-cl-text-disabled"}>{label}</span>
                      <Input
                        aria-label={String(label)}
                        placeholder={ph as string}
                        startIcon={icon}
                        classes={{
                          ...({
        root: "flex flex-col data-[size=sm]:[&_[data-slot=wrapper]]:px-3 data-[size=sm]:[&_[data-slot=wrapper]]:py-1.5 data-[size=sm]:[&_input]:text-xs data-[size=lg]:[&_[data-slot=wrapper]]:px-4 data-[size=lg]:[&_[data-slot=wrapper]]:py-3.5 data-[size=lg]:[&_input]:text-base",
        input: `w-full bg-transparent outline-none text-sm text-cl-text placeholder:text-cl-text-tertiary dark:text-white dark:placeholder:text-cl-text-tertiary dark:[color-scheme:dark]`,
        label: `text-[13px] font-medium mb-1.5 block text-cl-text-secondary`,
        description: `text-xs mt-1 mb-1.5 text-cl-text-tertiary`,
        prefix: `text-sm select-none text-cl-text-tertiary`,
        suffix: `text-sm select-none text-cl-text-tertiary`,
        count: `text-[11px] mt-1 text-right tabular-nums text-cl-text-tertiary`
      }),
                          input:
                            String(label) === "Large size"
                              ? `w-full bg-transparent outline-none text-lg text-cl-text placeholder:text-cl-text-disabled`
                              : ({
        root: "flex flex-col data-[size=sm]:[&_[data-slot=wrapper]]:px-3 data-[size=sm]:[&_[data-slot=wrapper]]:py-1.5 data-[size=sm]:[&_input]:text-xs data-[size=lg]:[&_[data-slot=wrapper]]:px-4 data-[size=lg]:[&_[data-slot=wrapper]]:py-3.5 data-[size=lg]:[&_input]:text-base",
        input: `w-full bg-transparent outline-none text-sm text-cl-text placeholder:text-cl-text-tertiary dark:text-white dark:placeholder:text-cl-text-tertiary dark:[color-scheme:dark]`,
        label: `text-[13px] font-medium mb-1.5 block text-cl-text-secondary`,
        description: `text-xs mt-1 mb-1.5 text-cl-text-tertiary`,
        prefix: `text-sm select-none text-cl-text-tertiary`,
        suffix: `text-sm select-none text-cl-text-tertiary`,
        count: `text-[11px] mt-1 text-right tabular-nums text-cl-text-tertiary`
      }).input,
                          control: wCls as string
                        }}
                      />
                    </div>
                  ))}
                </div>
  );
}
