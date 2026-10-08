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

export default function ToastExample() {
  return (
    <>
      <LocalProviderDemo
        animationDuration={1600}
        containerAriaLabel="Slow animation example"
        buttonClassName="px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-bg-panel border border-cl-border-input text-cl-text hover:bg-cl-bg-hover"
        label="Slow (1600ms)"
        message="Slid in over 1.6 seconds"
      />
      <LocalProviderDemo
        animationDuration={60}
        containerAriaLabel="Fast animation example"
        buttonClassName="px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-bg-panel border border-cl-border-input text-cl-text hover:bg-cl-bg-hover"
        label="Fast (60ms)"
        message="Snapped in over 60ms"
      />
      <LocalProviderDemo
        containerAriaLabel="Default animation example"
        buttonClassName="px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-accent text-cl-on-accent hover:bg-cl-accent/90"
        label="Default (500ms)"
        message="The provider default"
      />
    </>
  );
}
