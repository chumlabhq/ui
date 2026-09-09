"use client";

import { useState } from "react";

export default function ModalExample() {
  const [reduceMotionOpen, setReduceMotionOpen] = useState(false);
  const [reduceMotionAutoOpen, setReduceMotionAutoOpen] = useState(false);
  return (
    <div className="flex flex-wrap gap-2">
      <button
        className="inline-flex items-center justify-center gap-2 h-10 px-5 text-sm font-medium rounded-cl-md transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-cl-text text-cl-bg hover:opacity-90 cursor-pointer"
        onClick={() => setReduceMotionOpen(true)}
      >
        reduceMotion=true
      </button>
      <button
        className="inline-flex items-center justify-center gap-2 h-10 px-5 text-sm font-medium rounded-cl-md transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-cl-bg-elevated text-cl-text border border-cl-border hover:border-cl-border-input hover:bg-cl-bg-elevated cursor-pointer"
        onClick={() => setReduceMotionAutoOpen(true)}
      >
        reduceMotion="auto"
      </button>
    </div>
  );
}
