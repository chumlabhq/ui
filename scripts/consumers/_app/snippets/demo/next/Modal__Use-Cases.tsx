"use client";

import { useState } from "react";

export default function ModalExample() {
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [imagePreviewOpen, setImagePreviewOpen] = useState(false);
  return (
    <div className="flex flex-wrap gap-2">
      <button
        className="inline-flex items-center justify-center gap-2 h-10 px-5 text-sm font-medium rounded-cl-md transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-cl-error text-cl-bg hover:bg-cl-error/90 cursor-pointer"
        onClick={() => setConfirmDeleteOpen(true)}
      >
        Confirm Delete
      </button>
      <button
        className="inline-flex items-center justify-center gap-2 h-10 px-5 text-sm font-medium rounded-cl-md transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-cl-success text-cl-bg hover:bg-cl-success/90 cursor-pointer"
        onClick={() => setSuccessOpen(true)}
      >
        Success State
      </button>
      <button
        className="inline-flex items-center justify-center gap-2 h-10 px-5 text-sm font-medium rounded-cl-md transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-cl-accent text-cl-on-accent hover:bg-cl-accent/90 cursor-pointer"
        onClick={() => setUpgradeOpen(true)}
      >
        Upgrade Plan
      </button>
      <button
        className="inline-flex items-center justify-center gap-2 h-10 px-5 text-sm font-medium rounded-cl-md transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-cl-bg-elevated text-cl-text border border-cl-border hover:border-cl-border-input hover:bg-cl-bg-elevated cursor-pointer"
        onClick={() => setImagePreviewOpen(true)}
      >
        Image Preview
      </button>
    </div>
  );
}
