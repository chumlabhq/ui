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
        containerAriaLabel="Order updates"
        buttonClassName="px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-bg-panel border border-cl-border text-cl-text hover:bg-cl-bg-hover"
        label='containerAriaLabel="Order updates"'
        message="This one lands in a region named Order updates"
      />
      <LocalProviderDemo
        containerAriaLabel="Notifications (default)"
        buttonClassName="px-3 py-1.5 text-xs font-medium rounded-cl-md transition-colors cursor-pointer bg-cl-accent text-cl-on-accent hover:bg-cl-accent/90 dark:bg-cl-accent dark:text-cl-on-accent dark:hover:bg-cl-accent/90"
        label='Default ("Notifications")'
        message="This one lands in the default region"
      />
    </>
  );
}
