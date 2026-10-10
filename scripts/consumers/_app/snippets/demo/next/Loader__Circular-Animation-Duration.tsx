import { CircularLoader } from "@chumlab/ui/loader";

export default function LoaderExample() {
  return (
    <div className="flex items-center gap-4 sm:gap-8 flex-wrap">
      {
        [
          { animationDuration: 2000, label: "Slow (2s)" },
          { animationDuration: 750, label: "Normal (0.75s)" },
          { animationDuration: 350, label: "Fast (0.35s)" }
        ].map(({ animationDuration, label }) => (
          <div key={label} className="flex flex-col items-center gap-2">
            <CircularLoader
              size={32}
              animationDuration={animationDuration}
              className="text-cl-accent"
            />
            <span className="text-xs font-medium text-cl-text-tertiary">
              {label}
            </span>
          </div>
        ))
      }
    </div>
  );
}
