"use client";

import { useState } from "react";
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

const CloseIcon = ({ className = "" }: { className?: string }) => (
  <Icon d="M18 6 6 18|M6 6l12 12" className={className} />
);

const ArrowRightIcon = ({ className = "" }: { className?: string }) => (
  <Icon d="M5 12h14|M12 5l7 7-7 7" className={className} />
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
  const [lastAction, setLastAction] = useState("");
  const [search, setSearch] = useState("");
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full sm:max-w-2xl">
      {
        (
          [
            [
              "Leading icon",
              <SearchIcon className={"text-cl-text-tertiary"} />,
              undefined,
              "Search..."
            ],
            [
              "Trailing icon",
              undefined,
              <ArrowRightIcon className={"text-cl-text-tertiary"} />,
              "Submit"
            ],
            [
              "Both icons",
              <SearchIcon className={"text-cl-text-tertiary"} />,
              <ArrowRightIcon className={"text-cl-text-tertiary"} />,
              "Search & submit"
            ]
          ] as const
        ).map(([label, leading, trailing, ph]) => (
          <div key={String(label)} className="space-y-1.5">
            <span
              className="text-[11px] font-semibold uppercase tracking-wider text-cl-text-tertiary"
            >
              {label}
            </span>
            <Input
              aria-label={String(label)}
              placeholder={ph as string}
              startIcon={leading}
              endIcon={trailing}
              classes={
                {
                  root: "flex flex-col data-[size=sm]:[&_[data-slot=wrapper]]:px-3 data-[size=sm]:[&_input]:text-xs data-[size=lg]:[&_[data-slot=wrapper]]:px-4 data-[size=lg]:[&_input]:text-base",
                  input: "w-full bg-transparent outline-none text-sm text-cl-text placeholder:text-cl-text-tertiary dark:[color-scheme:dark]",
                  label: "text-[13px] font-medium mb-1.5 block text-cl-text-secondary",
                  description: "text-xs mt-1 mb-1.5 text-cl-text-tertiary",
                  prefix: "text-sm select-none text-cl-text-tertiary",
                  suffix: "text-sm select-none text-cl-text-tertiary",
                  count: "text-[11px] mt-1 text-right tabular-nums text-cl-text-tertiary"
                }
              }
            />
          </div>
        ))
      }
      <div className="space-y-1.5">
        <span
          className="text-[11px] font-semibold uppercase tracking-wider text-cl-text-tertiary"
        >
          Clickable icons
        </span>
        <span
          className="text-[11px] font-semibold uppercase tracking-wider text-cl-text-tertiary"
          data-demo-action
        >
          {lastAction}
        </span>
        <Input
          aria-label="Search with clear"
          placeholder="Type to search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          startIcon={<SearchIcon className="text-cl-text-tertiary" />}
          onStartIconClick={() => setLastAction("Search submitted")}
          startIconLabel="Submit search"
          endIcon={
            search ? (
              <CloseIcon className="text-cl-text-tertiary hover:text-cl-text-secondary" />
            ) : (
              undefined
            )
          }
          onEndIconClick={search ? () => setSearch("") : undefined}
          endIconLabel="Clear"
          classes={
            {
              root: "flex flex-col data-[size=sm]:[&_[data-slot=wrapper]]:px-3 data-[size=sm]:[&_input]:text-xs data-[size=lg]:[&_[data-slot=wrapper]]:px-4 data-[size=lg]:[&_input]:text-base",
              input: "w-full bg-transparent outline-none text-sm text-cl-text placeholder:text-cl-text-tertiary dark:[color-scheme:dark]",
              label: "text-[13px] font-medium mb-1.5 block text-cl-text-secondary",
              description: "text-xs mt-1 mb-1.5 text-cl-text-tertiary",
              prefix: "text-sm select-none text-cl-text-tertiary",
              suffix: "text-sm select-none text-cl-text-tertiary",
              count: "text-[11px] mt-1 text-right tabular-nums text-cl-text-tertiary"
            }
          }
        />
      </div>
    </div>
  );
}
