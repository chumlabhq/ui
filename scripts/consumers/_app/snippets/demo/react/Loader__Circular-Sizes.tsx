import { CircularLoader } from "@chumlab/ui/loader";

export default function LoaderExample() {
  return (
    <div className="flex items-center gap-4 sm:gap-8 flex-wrap">
      {
        [16, 24, 40, 64].map((s) => (
          <div key={s} className="flex flex-col items-center gap-2">
            <CircularLoader size={s} className="text-cl-accent" />
            <span className="text-xs font-medium text-cl-text-tertiary">
              {s}
              px
            </span>
          </div>
        ))
      }
    </div>
  );
}
