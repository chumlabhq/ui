"use client";

import { useRef, useState } from "react";

export default function ModalExample() {
  const modalRef = useRef<HTMLDivElement>(null);
  const [refForwardOpen, setRefForwardOpen] = useState(false);
  return (
    <div className="flex flex-wrap gap-2">
      <button
        className="inline-flex items-center justify-center gap-2 h-10 px-5 text-sm font-medium rounded-cl-md transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-cl-text text-cl-bg hover:opacity-90 cursor-pointer"
        onClick={() => setRefForwardOpen(true)}
      >
        Modal with Ref
      </button>
      <button
        className="inline-flex items-center justify-center gap-2 h-10 px-5 text-sm font-medium rounded-cl-md transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-cl-bg-elevated text-cl-text border border-cl-border hover:border-cl-border-input hover:bg-cl-bg-elevated cursor-pointer"
        onClick={() => modalRef.current?.focus()}
      >
        Focus Modal via Ref
      </button>
    </div>
  );
}
