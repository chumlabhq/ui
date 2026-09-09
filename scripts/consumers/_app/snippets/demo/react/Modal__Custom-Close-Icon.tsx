import { useState } from "react";

export default function ModalExample() {
  const [customCloseIconOpen, setCustomCloseIconOpen] = useState(false);
  return (
    <button
      className="inline-flex items-center justify-center gap-2 h-10 px-5 text-sm font-medium rounded-cl-md transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-cl-text text-cl-bg hover:opacity-90 cursor-pointer"
      onClick={() => setCustomCloseIconOpen(true)}
    >
      Custom Close Icon
    </button>
  );
}
