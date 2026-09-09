"use client";

import { useState } from "react";

export default function ModalExample() {
  const [bareOpen, setBareOpen] = useState(false);
  return (
    <>
      <button
        className="inline-flex items-center justify-center gap-2 h-10 px-5 text-sm font-medium rounded-cl-md transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-cl-text text-cl-bg hover:opacity-90"
        onClick={() => setBareOpen(true)}
      >
        Open without overlay, scroll lock or focus restore
      </button>
      <p className="mt-3 text-sm text-cl-text-secondary">
        Scroll the page behind it — it moves, which it cannot do for the modal above. Close it and focus returns to the top of the document rather than to this button.
      </p>
    </>
  );
}
