import { CountryFlag } from "@chumlab/ui/country-flag";

export default function CountryFlagExample() {
  return (
    <>
      {
        (["xs", "sm", "md", "lg", "xl", "2xl"] as const).map((s) => (
          <div key={s} className="text-center">
            <CountryFlag code="us" size={s} className="rounded-[3px]" />
            <p className="text-xs mt-2 text-xs font-medium text-cl-text-tertiary">
              {s}
            </p>
          </div>
        ))
      }
      <div className="text-center">
        <CountryFlag code="us" size={48} className="rounded-[3px]" />
        <p className="text-xs mt-2 text-xs font-medium text-cl-text-tertiary">48px</p>
      </div>
      <div className="text-center">
        <CountryFlag code="us" size={64} className="rounded-[3px]" />
        <p className="text-xs mt-2 text-xs font-medium text-cl-text-tertiary">64px</p>
      </div>
    </>
  );
}
