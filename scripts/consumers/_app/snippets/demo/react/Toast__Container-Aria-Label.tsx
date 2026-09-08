export default function ToastExample() {
  return (
    <p
                className={`text-xs text-cl-text-secondary`}
              >
                The toast container has{" "}
                <code className="font-mono">role=&quot;region&quot;</code> with an{" "}
                <code className="font-mono">aria-label</code> for screen readers.
              </p>
  );
}
