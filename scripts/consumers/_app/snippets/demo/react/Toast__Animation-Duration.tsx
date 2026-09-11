import { ToastProvider, useToast } from "@chumlab/ui/toast";

const LocalProviderTrigger = ({
  className,
  label,
  message,
}: {
  className: string;
  label: string;
  message: string;
}) => {
  const { info } = useToast();
  return (
    <button className={className} onClick={() => info(message)}>
      {label}
    </button>
  );
};

const LocalProviderDemo = ({
  buttonClassName,
  label,
  message,
  ...providerProps
}: Omit<React.ComponentProps<typeof ToastProvider>, "children"> & {
  buttonClassName: string;
  label: string;
  message: string;
}) => (
  <ToastProvider {...providerProps}>
    <LocalProviderTrigger className={buttonClassName} label={label} message={message} />
  </ToastProvider>
);

export default function ToastExample() {
  return (
    <>
      <LocalProviderDemo
        animationDuration={1600}
        containerAriaLabel="Slow animation example"
        buttonClassName="px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-bg-panel border border-cl-border text-cl-text hover:bg-cl-bg-hover"
        label="Slow (1600ms)"
        message="Slid in over 1.6 seconds"
      />
      <LocalProviderDemo
        animationDuration={60}
        containerAriaLabel="Fast animation example"
        buttonClassName="px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-bg-panel border border-cl-border text-cl-text hover:bg-cl-bg-hover"
        label="Fast (60ms)"
        message="Snapped in over 60ms"
      />
      <LocalProviderDemo
        containerAriaLabel="Default animation example"
        buttonClassName="px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-accent text-cl-on-accent hover:bg-cl-accent/90 dark:bg-cl-accent dark:text-cl-on-accent dark:hover:bg-cl-accent/90"
        label="Default (500ms)"
        message="The provider default"
      />
    </>
  );
}
