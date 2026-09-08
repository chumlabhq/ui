"use client";

import { useState } from "react";

export default function ModalExample() {
  const [customOverlayOpen, setCustomOverlayOpen] = useState(false);
  const [preventCloseOpen, setPreventCloseOpen] = useState(false);
  return (
    <div className="flex flex-wrap gap-2">
                <button className={(`${("inline-flex items-center justify-center gap-2 h-10 px-5 text-sm font-medium rounded-cl-md transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer")} bg-cl-bg-elevated text-cl-text border border-cl-border hover:border-cl-border-input hover:bg-cl-bg-elevated`)} onClick={() => setCustomOverlayOpen(true)}>
                  Custom Overlay
                </button>
                <button className={(`${("inline-flex items-center justify-center gap-2 h-10 px-5 text-sm font-medium rounded-cl-md transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer")} bg-cl-bg-elevated text-cl-text border border-cl-border hover:border-cl-border-input hover:bg-cl-bg-elevated`)} onClick={() => setPreventCloseOpen(true)}>
                  Prevent Outside Click
                </button>
              </div>
  );
}
