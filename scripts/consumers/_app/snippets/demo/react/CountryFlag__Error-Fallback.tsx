import { CountryFlag } from "@chumlab/ui/country-flag";

export default function CountryFlagExample() {
  return (
    <>
      <div className="text-center">
        <CountryFlag
          code="xx"
          size={48}
          className="rounded-[3px]"
          fallback={
            <span
              className="inline-flex items-center justify-center rounded-[3px] text-[10px] font-bold tracking-wide bg-cl-bg-hover text-cl-text-tertiary dark:bg-cl-bg-elevated dark:text-cl-text-tertiary"
              style={{ width: 48, height: 36, borderRadius: 3 }}
            >
              ??
            </span>
          }
        />
        <p className="text-xs mt-2 text-xs font-medium text-cl-text-tertiary">invalid code</p>
      </div>
      <div className="text-center">
        <CountryFlag
          code=""
          size={48}
          className="rounded-[3px]"
          fallback={
            <span
              className="inline-flex items-center justify-center rounded-[3px] text-[10px] font-bold tracking-wide bg-cl-bg-hover text-cl-text-tertiary dark:bg-cl-bg-elevated dark:text-cl-text-tertiary"
              style={{ width: 48, height: 36, borderRadius: 3 }}
            >
              --
            </span>
          }
        />
        <p className="text-xs mt-2 text-xs font-medium text-cl-text-tertiary">empty code</p>
      </div>
      <div className="text-center">
        <CountryFlag
          code="zz"
          size={48}
          className="rounded-[3px]"
          fallback={
            <span
              className="inline-flex items-center justify-center rounded-[3px] text-[10px] font-bold tracking-wide bg-cl-bg-hover text-cl-text-tertiary dark:bg-cl-bg-elevated dark:text-cl-text-tertiary"
              style={{ width: 48, height: 36, borderRadius: 3 }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4" />
                <path d="M12 16h.01" />
              </svg>
            </span>
          }
        />
        <p className="text-xs mt-2 text-xs font-medium text-cl-text-tertiary">icon fallback</p>
      </div>
    </>
  );
}
