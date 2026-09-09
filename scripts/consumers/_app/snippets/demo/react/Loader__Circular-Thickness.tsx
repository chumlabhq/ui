import { CircularLoader } from "@chumlab/ui/loader";

export default function LoaderExample() {
  return (
    <div className="flex items-center gap-4 sm:gap-8 flex-wrap">
      {
        [
          { thickness: 1, label: "Thin (1)" },
          { thickness: 2, label: "Normal (2)" },
          { thickness: 4, label: "Thick (4)" },
          { thickness: 6, label: "Extra thick (6)" }
        ].map(({ thickness, label }) => (
          <div key={label} className="flex flex-col items-center gap-2">
            <CircularLoader size={40} thickness={thickness} className="text-cl-accent" />
            <span className="text-xs font-medium text-cl-text-tertiary">
              {label}
            </span>
          </div>
        ))
      }
    </div>
  );
}
