import { Button } from "@chumlab/ui/button";
import { ToastProvider, useToast } from "@chumlab/ui/toast";

const LocalProviderTrigger = ({
  className,
  label,
  message,
  duration,
}: {
  className: string;
  label: string;
  message: string;
  duration?: number;
}) => {
  const { info } = useToast();
  return (
    <button className={className} onClick={() => info(message, { duration })}>
      {label}
    </button>
  );
};

const LocalProviderDemo = ({
  buttonClassName,
  label,
  message,
  duration,
  ...providerProps
}: Omit<React.ComponentProps<typeof ToastProvider>, "children"> & {
  buttonClassName: string;
  label: string;
  message: string;
  duration?: number;
}) => (
  <ToastProvider {...providerProps}>
    <LocalProviderTrigger className={buttonClassName} label={label} message={message} duration={duration} />
  </ToastProvider>
);

function ToastTrigger() {
  const toast = useToast();
  return (
    <>
      <Button
        className="px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-accent text-cl-on-accent hover:bg-cl-accent/90"
        onClick={
          () =>
          toast.info("Press Escape to dismiss", {
            duration: Infinity,
            description:
              "This toast can be dismissed with the Escape key"
          })
        }
      >
        With Escape Dismissal
      </Button>
      <LocalProviderDemo
        closeOnEscape={false}
        containerAriaLabel="Escape disabled example"
        buttonClassName="px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-bg-panel border border-cl-border-input text-cl-text hover:bg-cl-bg-hover"
        label="Without Escape Dismissal"
        message="Escape leaves this one; use its close button"
        duration={Infinity}
      />
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
