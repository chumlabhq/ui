import { DotLoader } from "@chumlab/ui/loader";

export default function LoaderExample() {
  return (
    <div className="flex items-center gap-6 sm:gap-10 flex-wrap">
                {[
                  {
                    cls: "text-cl-accent",
                    name: "Indigo"
                  },
                  {
                    cls: "text-cl-accent",
                    name: "Emerald"
                  },
                  { cls: "text-cl-accent", name: "Rose" },
                  {
                    cls: "text-cl-accent",
                    name: "Amber"
                  }
                ].map(({ cls, name }) => (
                  <div key={name} className="flex flex-col items-center gap-2">
                    <DotLoader dotSize={10} className={cls} />
                    <span className={"text-xs font-medium text-cl-text-tertiary"}>{name}</span>
                  </div>
                ))}
              </div>
  );
}
