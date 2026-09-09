import { useToast } from "@chumlab/ui/toast";

export default function ToastExample() {
  const toast = useToast();
  return (
    <>
      <button
        className="px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-bg-elevated text-cl-text hover:bg-cl-bg-elevated"
        onClick={
          () =>
          toast.toast({
            type: "info",
            message: "Custom progress color",
            description: "Using progressColor prop (inline style)",
            progressColor: "#a855f7"
          })
        }
      >
        Purple (progressColor)
      </button>
      <button
        className="px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-bg-elevated text-cl-text hover:bg-cl-bg-elevated"
        onClick={
          () =>
          toast.toast({
            type: "info",
            message: "Gradient progress",
            description: "Using classes.progress prop",
            classes: {
              indicator:
                "bg-linear-to-r from-cl-accent/30 via-cl-accent/30 to-cl-accent/40"
            }
          })
        }
      >
        Gradient (classes.progress)
      </button>
      <button
        className="px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-bg-elevated text-cl-text hover:bg-cl-bg-elevated"
        onClick={
          () =>
          toast.toast({
            type: "success",
            message: "Themed progress",
            description: "Green progress bar",
            progressColor: "#22c55e"
          })
        }
      >
        Green Progress
      </button>
    </>
  );
}
