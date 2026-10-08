import { useState } from "react";
import { Button } from "@chumlab/ui/button";
import { Modal } from "@chumlab/ui/modal";

export default function ModalExample() {
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [imagePreviewOpen, setImagePreviewOpen] = useState(false);
  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Button
          className="inline-flex items-center justify-center gap-2 h-10 px-5 text-sm font-medium rounded-cl-md transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-cl-error text-cl-bg hover:bg-cl-error/90 cursor-pointer"
          onClick={() => setConfirmDeleteOpen(true)}
        >
          Confirm Delete
        </Button>
        <Button
          className="inline-flex items-center justify-center gap-2 h-10 px-5 text-sm font-medium rounded-cl-md transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-cl-success text-cl-bg hover:bg-cl-success/90 cursor-pointer"
          onClick={() => setSuccessOpen(true)}
        >
          Success State
        </Button>
        <Button
          className="inline-flex items-center justify-center gap-2 h-10 px-5 text-sm font-medium rounded-cl-md transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-cl-accent text-cl-on-accent hover:bg-cl-accent/90 cursor-pointer"
          onClick={() => setUpgradeOpen(true)}
        >
          Upgrade Plan
        </Button>
        <Button
          className="inline-flex items-center justify-center gap-2 h-10 px-5 text-sm font-medium rounded-cl-md transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-cl-bg-elevated text-cl-text border border-cl-border hover:border-cl-border-input hover:bg-cl-bg-elevated cursor-pointer"
          onClick={() => setImagePreviewOpen(true)}
        >
          Image Preview
        </Button>
      </div>
      <Modal
        open={confirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        showHeader={false}
        preventOutsideClick
        closeOnEscape={false}
        classes={{ body: "p-6" }}
      >
        <div className="flex flex-col items-center">
          <div
            className="relative mb-5 flex h-16 w-16 items-center justify-center rounded-cl-lg bg-cl-error/15 dark:bg-cl-error/10"
          >
            <div
              className="absolute inset-0 rounded-cl-lg bg-cl-error/50 dark:bg-cl-error/5 animate-pulse"
            />
            <svg
              className="relative h-8 w-8 text-cl-error"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-bold mb-1 text-cl-text">Delete this project?</h3>
          <p className="text-sm text-center mb-5 max-w-xs text-cl-text-secondary">
            This will permanently remove
            <span className="font-semibold text-cl-error">"Marketing Website"</span>
            and all its data. This cannot be undone.
          </p>
          <div
            className="w-full rounded-cl-lg p-4 mb-6 border bg-cl-error/15 border-cl-error dark:bg-cl-error/20 dark:border dark:border-cl-error/40"
          >
            <div className="flex items-start gap-3">
              <svg
                className="h-5 w-5 mt-0.5 shrink-0 text-cl-error"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <p className="text-sm font-medium text-cl-error">What will be deleted:</p>
                <ul className="text-xs mt-1.5 space-y-1 text-cl-error/80">
                  <li>12 pages and all content</li>
                  <li>3 team members will lose access</li>
                  <li>Connected analytics data</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="flex w-full gap-3">
            <Button
              className="flex-1 inline-flex items-center justify-center gap-2 h-10 px-5 text-sm font-medium rounded-cl-md transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-cl-bg-elevated text-cl-text border border-cl-border hover:border-cl-border-input hover:bg-cl-bg-elevated cursor-pointer cursor-pointer"
              onClick={() => setConfirmDeleteOpen(false)}
            >
              Keep Project
            </Button>
            <Button
              className="flex-1 px-4 py-2.5 text-sm font-medium rounded-cl-lg transition-all text-cl-bg bg-cl-error hover:bg-cl-error dark:hover:bg-cl-error/30 cursor-pointer"
              onClick={() => setConfirmDeleteOpen(false)}
            >
              Yes, Delete
            </Button>
          </div>
        </div>
      </Modal>
      <Modal
        open={successOpen}
        onOpenChange={setSuccessOpen}
        showHeader={false}
        classes={{ body: "p-6" }}
      >
        <div className="flex flex-col items-center">
          <div className="relative mb-5">
            <div
              className="absolute -inset-3 rounded-full blur-xl bg-cl-success/25 dark:bg-cl-success/20"
            />
            <div
              className="relative flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-cl-success/30 to-cl-success shadow-lg shadow-success/25"
            >
              <svg
                className="h-8 w-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
          <h3 className="text-xl font-bold mb-1 text-cl-text">Payment Successful!</h3>
          <p className="text-sm mb-5 text-cl-text-secondary">
            Your order has been confirmed and is being processed.
          </p>
          <div
            className="w-full rounded-cl-lg divide-y mb-6 border border-cl-border divide-border-faint bg-cl-bg-hover dark:border dark:bg-cl-bg-elevated/50"
          >
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-sm text-cl-text-secondary">Order</span>
              <span className="text-sm font-mono font-medium text-cl-text">#ORD-2024-8847</span>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-sm text-cl-text-secondary">Amount</span>
              <span className="text-sm font-bold text-cl-success">$149.00</span>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-sm text-cl-text-secondary">Confirmation</span>
              <span className="text-sm text-cl-text-secondary">john.doe@example.com</span>
            </div>
          </div>
          <div className="flex w-full gap-3">
            <Button
              className="flex-1 inline-flex items-center justify-center gap-2 h-10 px-5 text-sm font-medium rounded-cl-md transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-cl-bg-elevated text-cl-text border border-cl-border hover:border-cl-border-input hover:bg-cl-bg-elevated cursor-pointer cursor-pointer"
              onClick={() => setSuccessOpen(false)}
            >
              View Order
            </Button>
            <Button
              className="flex-1 px-4 py-2.5 text-sm font-medium rounded-cl-lg transition-all text-cl-bg bg-cl-success hover:bg-cl-success dark:hover:bg-cl-success/30 cursor-pointer"
              onClick={() => setSuccessOpen(false)}
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </Modal>
      <Modal
        open={upgradeOpen}
        onOpenChange={setUpgradeOpen}
        showHeader={false}
        classes={{ body: "p-0" }}
      >
        <div className="bg-cl-accent p-8 text-center text-cl-on-accent">
          <div
            className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-cl-text/20 backdrop-blur-sm"
          >
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-bold mb-2">Upgrade to Pro</h3>
          <p className="text-white/85">Unlock all features and boost your productivity.</p>
        </div>
        <div className="p-6">
          <ul className="space-y-3 mb-6">
            {
              ["Unlimited projects", "Advanced analytics", "Priority support", "API access"].map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div
                    className="flex h-5 w-5 items-center justify-center rounded-full bg-cl-accent/10 dark:bg-cl-accent/40"
                  >
                    <svg
                      className="h-3 w-3 text-cl-accent"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-cl-text-secondary">
                    {feature}
                  </span>
                </li>
              ))
            }
          </ul>
          <div className="flex items-baseline gap-1 justify-center mb-6">
            <span className="text-3xl font-bold text-cl-text">$29</span>
            <span className="text-cl-text-tertiary">/month</span>
          </div>
          <Button
            size="lg"
            onClick={() => setUpgradeOpen(false)}
            className="w-full rounded-cl-md bg-cl-text text-cl-bg hover:opacity-90"
          >
            Upgrade Now
          </Button>
          <button
            onClick={() => setUpgradeOpen(false)}
            className="w-full mt-3 text-sm text-cl-text-tertiary hover:text-cl-text cursor-pointer"
          >
            Maybe later
          </button>
        </div>
      </Modal>
      <Modal
        open={imagePreviewOpen}
        onOpenChange={setImagePreviewOpen}
        showHeader={false}
        overlayOpacity={0.85}
        classes={{ content: "bg-cl-bg", body: "p-0" }}
      >
        <div className="relative">
          <button
            aria-label="Close"
            onClick={() => setImagePreviewOpen(false)}
            className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(0,0,0,0.55)] text-white hover:bg-[rgba(0,0,0,0.75)] transition-colors cursor-pointer"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <div
            className="aspect-video bg-linear-to-br from-cl-accent/40 via-cl-accent/30 to-cl-accent/60 flex items-center justify-center"
          >
            <div className="text-center text-white">
              <svg
                className="h-16 w-16 mx-auto mb-4 opacity-80"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-lg font-medium opacity-90">Image Preview</p>
            </div>
          </div>
          <div className="bg-cl-bg p-4 flex flex-wrap items-center justify-between gap-3">
            <div className="text-cl-text min-w-0">
              <p className="font-medium truncate">Sunset at Malibu Beach</p>
              <p className="text-sm text-cl-text-tertiary truncate">4032 × 3024 • 3.2 MB</p>
            </div>
            <Button
              className="flex items-center gap-2 px-3 py-2 text-sm text-cl-text-secondary hover:text-cl-text hover:bg-cl-bg-elevated rounded-cl-md transition-colors cursor-pointer"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
