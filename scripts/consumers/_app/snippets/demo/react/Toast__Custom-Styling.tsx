import { Button } from "@chumlab/ui/button";
import { ToastProvider, useToast } from "@chumlab/ui/toast";

function ToastTrigger() {
  const toast = useToast();
  return (
    <>
      <Button
        className="px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-bg-panel border border-cl-border-input text-cl-text hover:bg-cl-bg-hover"
        onClick={
          () =>
          toast.toast({
            variant: "info",
            message: "Light themed toast",
            description: "Using classes.container to override styles",
            classes: {
              // bg is hardcoded white, so the text needs to be
              // hardcoded dark too — text-cl-text would invert to
              // near-white in dark mode and disappear on the white
              // surface. Using the light-mode --cl-text hex value.
              root: "bg-white border border-[#e5e7eb] text-[#0f1218]",
              description: "text-[#0f1218]/70",
              icon: "text-cl-accent",
              closeTrigger: "text-[#0f1218]/60 hover:text-[#0f1218] hover:bg-black/5"
            }
          })
        }
      >
        Light Theme
      </Button>
      <Button
        className="px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-bg-panel border border-cl-border-input text-cl-text hover:bg-cl-bg-hover"
        onClick={
          () =>
          toast.toast({
            variant: "success",
            message: "Custom border radius",
            description: "Rounded-full style",
            classes: {
              root: "rounded-full bg-[#195030]"
            }
          })
        }
      >
        Rounded Full
      </Button>
      <Button
        className="px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-bg-panel border border-cl-border-input text-cl-text hover:bg-cl-bg-hover"
        onClick={
          () =>
          toast.toast({
            variant: "info",
            message: "Custom message style",
            description: "Description with custom styling",
            classes: {
              title: "text-lg font-bold text-cl-warning",
              description: "text-xs italic text-cl-accent"
            }
          })
        }
      >
        Custom Text Styles
      </Button>
      <Button
        className="px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-bg-panel border border-cl-border-input text-cl-text hover:bg-cl-bg-hover"
        onClick={
          () =>
          toast.toast({
            variant: "success",
            message: "Custom content wrapper",
            description: "Using classes.content for padding",
            classes: {
              root: "p-6 bg-cl-text/10 rounded-cl-md"
            }
          })
        }
      >
        Custom Content Wrapper
      </Button>
    </>
  );
}

export default function ToastExample() {
  return (
    <ToastProvider>
      <ToastTrigger />
    </ToastProvider>
  );
}
