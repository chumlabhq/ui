import { CircularLoader } from "@chumlab/ui/loader";

export default function LoaderExample() {
  return (
    <div className="flex items-center gap-4 sm:gap-8 flex-wrap">
      {
        [
          { cls: "text-cl-accent", name: "Indigo" },
          { cls: "text-cl-success", name: "Emerald" },
          { cls: "text-cl-error", name: "Rose" },
          { cls: "text-cl-warning", name: "Amber" }
        ].map(({ cls, name }) => (
          <div key={name} className="flex flex-col items-center gap-2">
            <CircularLoader size={32} className={cls} />
            <span className="text-xs font-medium text-cl-text-tertiary">
              {name}
            </span>
          </div>
        ))
      }
    </div>
  );
}
