import { Slider } from "@chumlab/ui/slider";

export default function SliderExample() {
  return (
    <div className="flex flex-col gap-6 w-full sm:max-w-sm">
      <div className="space-y-1">
        <span className="text-xs font-medium text-cl-text-tertiary">
          Rounded rectangle thumb
        </span>
        <Slider
          defaultValue={60}
          classes={
            {
                            ...({
              root: "flex flex-col gap-2 w-full",
              label: "text-sm font-medium text-cl-text",
              description: "text-xs text-cl-text-secondary",
              track: "rounded-full bg-cl-bg-hover dark:bg-cl-text/[0.12]",
              range: "rounded-full bg-cl-accent",
              thumb: "absolute rounded-full bg-white dark:bg-cl-text shadow-md transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent focus-visible:ring-offset-2 hover:shadow-lg cursor-grab focus-visible:ring-offset-white dark:focus-visible:ring-offset-cl-bg"
            }),
                            thumb: "absolute rounded-cl-md bg-cl-accent shadow-md transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent focus-visible:ring-offset-2 hover:shadow-lg cursor-grab focus-visible:ring-offset-cl-bg"
                          }
          }
        />
      </div>
      <div className="space-y-1">
        <span className="text-xs font-medium text-cl-text-tertiary">Tall track (12px)</span>
        <Slider
          defaultValue={45}
          classes={
            {
                            ...({
              root: "flex flex-col gap-2 w-full",
              label: "text-sm font-medium text-cl-text",
              description: "text-xs text-cl-text-secondary",
              track: "rounded-full bg-cl-bg-hover dark:bg-cl-text/[0.12]",
              range: "rounded-full bg-cl-accent",
              thumb: "absolute rounded-full bg-white dark:bg-cl-text shadow-md transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent focus-visible:ring-offset-2 hover:shadow-lg cursor-grab focus-visible:ring-offset-white dark:focus-visible:ring-offset-cl-bg"
            }),
                            track: "rounded-full h-3 bg-cl-bg-hover",
                            range: "rounded-full bg-gradient-to-r from-cl-accent/150 to-cl-accent",
                            control: "relative select-none touch-none py-1"
                          }
          }
        />
      </div>
    </div>
  );
}
