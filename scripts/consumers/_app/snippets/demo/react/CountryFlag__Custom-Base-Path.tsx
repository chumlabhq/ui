import { CountryFlag } from "@chumlab/ui/country-flag";

export default function CountryFlagExample() {
  return (
    <CountryFlag
      code="us"
      size={48}
      basePath="/assets/flags"
      className="rounded-[3px]"
      fallback={
        <span
          className="inline-flex items-center justify-center rounded-[3px] text-[10px] font-bold tracking-wide bg-cl-bg-hover text-cl-text-tertiary dark:bg-cl-bg-elevated dark:text-cl-text-tertiary"
          style={{ width: 48, height: 36, borderRadius: 3 }}
        >
          US
        </span>
      }
    />
  );
}
