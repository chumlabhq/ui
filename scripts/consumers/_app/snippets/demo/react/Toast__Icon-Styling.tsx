import { useToast } from "@chumlab/ui/toast";

export default function ToastExample() {
  const toast = useToast();
  return (
    <>
      <button
                  className={"px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-bg-elevated text-cl-text hover:bg-cl-bg-elevated"}
                  onClick={() =>
                    toast.toast({
                      type: "info",
                      message: "Styled icon",
                      description: "Icon with custom background",
                      icon: <span className="text-lg">✨</span>,
                      classes: { icon: "bg-cl-text/20 p-1.5 rounded-full" }
                    })
                  }
                >
                  Rounded Icon Background
                </button>
      <button
                  className={"px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-bg-elevated text-cl-text hover:bg-cl-bg-elevated"}
                  onClick={() =>
                    toast.toast({
                      type: "success",
                      message: "Large icon",
                      description: "Icon with larger size",
                      classes: { icon: "text-2xl" }
                    })
                  }
                >
                  Large Default Icon
                </button>
    </>
  );
}
