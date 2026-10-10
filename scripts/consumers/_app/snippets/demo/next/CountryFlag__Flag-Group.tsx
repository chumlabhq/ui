import { CountryFlag, CountryFlagGroup } from "@chumlab/ui/country-flag";

export default function CountryFlagExample() {
  return (
    <>
      <CountryFlagGroup
        size={48}
        classes={
          {
            root: "flex items-center -space-x-1.5",
            item: "rounded-[3px] outline outline-[1.5px] outline-cl-bg",
            count: "shrink-0 flex items-center justify-center rounded-[3px] text-[11px] font-semibold select-none bg-cl-bg-hover text-cl-text-secondary outline outline-[1.5px] outline-cl-bg"
          }
        }
      >
        <CountryFlag code="us" className="rounded-[3px]" />
        <CountryFlag code="gb" className="rounded-[3px]" />
        <CountryFlag code="jp" className="rounded-[3px]" />
        <CountryFlag code="de" className="rounded-[3px]" />
      </CountryFlagGroup>
      <CountryFlagGroup
        size={48}
        maxVisible={3}
        classes={
          {
            root: "flex items-center -space-x-1.5",
            item: "rounded-[3px] outline outline-[1.5px] outline-cl-bg",
            count: "shrink-0 flex items-center justify-center rounded-[3px] text-[11px] font-semibold select-none bg-cl-bg-hover text-cl-text-secondary outline outline-[1.5px] outline-cl-bg"
          }
        }
      >
        <CountryFlag code="us" className="rounded-[3px]" />
        <CountryFlag code="gb" className="rounded-[3px]" />
        <CountryFlag code="jp" className="rounded-[3px]" />
        <CountryFlag code="de" className="rounded-[3px]" />
        <CountryFlag code="fr" className="rounded-[3px]" />
      </CountryFlagGroup>
      <CountryFlagGroup
        size={48}
        maxVisible={2}
        showCountTooltip
        classes={
          {
            root: "flex items-center -space-x-1.5",
            item: "rounded-[3px] outline outline-[1.5px] outline-cl-bg",
            count: "shrink-0 flex items-center justify-center rounded-[3px] text-[11px] font-semibold select-none bg-cl-bg-hover text-cl-text-secondary outline outline-[1.5px] outline-cl-bg"
          }
        }
      >
        <CountryFlag code="us" alt="United States" className="rounded-[3px]" />
        <CountryFlag code="gb" alt="United Kingdom" className="rounded-[3px]" />
        <CountryFlag code="jp" alt="Japan" className="rounded-[3px]" />
        <CountryFlag code="de" alt="Germany" className="rounded-[3px]" />
      </CountryFlagGroup>
      <div className="p-4 rounded-cl-md bg-cl-bg-elevated">
        <CountryFlagGroup
          size={48}
          classes={
            {
              root: "flex items-center -space-x-1.5",
              item: "rounded-[3px] outline outline-[1.5px] outline-gray-800",
              count:
                "shrink-0 flex items-center justify-center rounded-[3px] text-[11px] font-semibold select-none bg-cl-bg-elevated text-cl-text-secondary outline outline-[1.5px] outline-gray-800"
            }
          }
        >
          <CountryFlag code="us" className="rounded-[3px]" />
          <CountryFlag code="gb" className="rounded-[3px]" />
          <CountryFlag code="jp" className="rounded-[3px]" />
          <CountryFlag code="de" className="rounded-[3px]" />
        </CountryFlagGroup>
      </div>
      <CountryFlagGroup
        size={48}
        maxVisible={2}
        classes={
          {
            root: "flex items-center -space-x-1.5",
            item: "rounded-[3px] outline outline-[1.5px] outline-cl-bg",
            count: "shrink-0 flex items-center justify-center rounded-[3px] text-[11px] font-semibold select-none bg-cl-bg-hover text-cl-text-secondary outline outline-[1.5px] outline-cl-bg"
          }
        }
        renderSurplus={
          (count) => (
            <span
              className={"ml-2 text-xs font-medium text-cl-text-secondary"}
            >
              and {count} more
            </span>
          )
        }
      >
        <CountryFlag code="us" className="rounded-[3px]" />
        <CountryFlag code="gb" className="rounded-[3px]" />
        <CountryFlag code="jp" className="rounded-[3px]" />
        <CountryFlag code="de" className="rounded-[3px]" />
      </CountryFlagGroup>
      <CountryFlagGroup
        size={56}
        classes={
          {
                          ...({
            root: "flex items-center -space-x-1.5",
            item: "rounded-[3px] outline outline-[1.5px] outline-cl-bg",
            count: "shrink-0 flex items-center justify-center rounded-[3px] text-[11px] font-semibold select-none bg-cl-bg-hover text-cl-text-secondary outline outline-[1.5px] outline-cl-bg"
          }),
                          item: "rounded outline outline-[1.5px] outline-cl-bg",
                          count: `${"shrink-0 flex items-center justify-center rounded-[3px] text-[11px] font-semibold select-none bg-cl-bg-hover text-cl-text-secondary outline outline-[1.5px] outline-cl-bg"} text-xs rounded`
                        }
        }
      >
        <CountryFlag code="us" className="rounded" />
        <CountryFlag code="gb" className="rounded" />
        <CountryFlag code="jp" className="rounded" />
      </CountryFlagGroup>
    </>
  );
}
