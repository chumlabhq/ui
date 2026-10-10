import { LinearLoader } from "@chumlab/ui/loader";

export default function LoaderExample() {
  return (
    <div className="flex flex-col gap-4 w-full max-w-xs sm:max-w-md">
      {
        [
          { animationDuration: 3000, label: "Slow (3s)" },
          { animationDuration: 1500, label: "Normal (1.5s)" },
          { animationDuration: 700, label: "Fast (0.7s)" }
        ].map(({ animationDuration, label }) => (
          <div key={label} className="space-y-1">
            <span className="text-xs font-medium text-cl-text-tertiary">
              {label}
            </span>
            <LinearLoader
              trackColor="var(--cl-bg-track)"
              animationDuration={animationDuration}
              className="text-cl-accent"
            />
          </div>
        ))
      }
    </div>
  );
}
