import { Slider } from "@chumlab/ui/slider";

export default function SliderExample() {
  return (
    <Slider
      label="Volume"
      defaultValue={50}
      loading
      classes={
        {
          root: "flex flex-col gap-2 w-full",
          label: "text-sm font-medium text-cl-text",
          description: "text-xs text-cl-text-secondary",
          track: "rounded-full bg-cl-bg-track",
          range: "rounded-full bg-cl-accent",
          thumb: "absolute rounded-full bg-white shadow-md transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent focus-visible:ring-offset-2 hover:shadow-lg cursor-grab focus-visible:ring-offset-cl-bg"
        }
      }
    />
  );
}
