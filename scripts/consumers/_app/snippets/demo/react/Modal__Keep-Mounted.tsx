import { useState } from "react";

export default function ModalExample() {
  const [keepMountedOpen, setKeepMountedOpen] = useState(false);
  const [keepMountedLog, setKeepMountedLog] = useState<string[]>([]);
  return (
    <div className="space-y-3">
                <button className={(`${("inline-flex items-center justify-center gap-2 h-10 px-5 text-sm font-medium rounded-cl-md transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer")} bg-cl-text text-cl-bg hover:opacity-90`)} onClick={() => setKeepMountedOpen(true)}>
                  Keep Mounted Modal
                </button>
                {keepMountedLog.length > 0 && (
                  <div className={`text-xs font-mono p-3 rounded-cl-md max-h-32 overflow-auto bg-cl-bg-elevated text-cl-text-secondary`}>
                    {keepMountedLog.map((log, i) => (
                      <div key={i}>{log}</div>
                    ))}
                  </div>
                )}
              </div>
  );
}
