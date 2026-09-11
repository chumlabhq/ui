import { useToast } from "@chumlab/ui/toast";

export default function ToastExample() {
  const toast = useToast();
  return (
    <>
      <button
        className="px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-bg-panel border border-cl-border text-cl-text hover:bg-cl-bg-hover"
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
        className="px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-bg-panel border border-cl-border text-cl-text hover:bg-cl-bg-hover"
        onClick={
          () =>
          toast.toast({
            type: "info",
            message: "Gradient progress",
            description: "Using classes.progress prop",
            classes: {
              indicator:
                "bg-linear-to-r from-cl-accent via-cl-warning to-cl-error"
            }
          })
        }
      >
        Gradient (classes.progress)
      </button>
      <button
        className="px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-bg-panel border border-cl-border text-cl-text hover:bg-cl-bg-hover"
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
