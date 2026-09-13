"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@chumlab/ui/button";
import { Modal } from "@chumlab/ui/modal";

const KeepMountedLogger = ({ onLog }: { onLog: (msg: string) => void }) => {
  useEffect(() => {
    onLog("Mounted");
    return () => onLog("Unmounted");
  }, [onLog]);
  return <p className="text-cl-text-secondary">This content logs mount/unmount events.</p>;
};

export default function ModalExample() {
  const [keepMountedOpen, setKeepMountedOpen] = useState(false);
  const [keepMountedLog, setKeepMountedLog] = useState<string[]>([]);
  const handleKeepMountedLog = useCallback((msg: string) => {
    setKeepMountedLog((prev) => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] ${msg}`,
    ]);
  }, []);
  return (
    <>
      <div className="space-y-3">
        <Button
          className="inline-flex items-center justify-center gap-2 h-10 px-5 text-sm font-medium rounded-cl-md transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-cl-text text-cl-bg hover:opacity-90 cursor-pointer"
          onClick={() => setKeepMountedOpen(true)}
        >
          Keep Mounted Modal
        </Button>
        {
          keepMountedLog.length > 0 && (
            <div
              className="text-xs font-mono p-3 rounded-cl-md max-h-32 overflow-auto bg-cl-bg-elevated text-cl-text-secondary"
            >
              {
                keepMountedLog.map((log, i) => (
                  <div key={i}>
                    {log}
                  </div>
                ))
              }
            </div>
          )
        }
      </div>
      <Modal
        open={keepMountedOpen}
        onOpenChange={setKeepMountedOpen}
        title="Keep Mounted"
        description="This modal stays in the DOM even when closed."
        keepMounted
        classes={
          {
            content: "w-full max-w-lg m-4 rounded-cl-lg shadow-2xl overflow-hidden bg-cl-bg-elevated border border-cl-border",
            header: "flex items-start gap-3 p-6 pb-4",
            title: "font-semibold text-lg text-cl-text",
            description: "mt-1 text-sm text-cl-text-secondary",
            closeTrigger: "shrink-0 p-1 rounded-cl-md hover:bg-cl-bg-hover transition-colors ml-auto",
            closeIcon: "w-5 h-5 text-cl-text-tertiary",
            body: "px-6 pb-6"
          }
        }
      >
        <KeepMountedLogger onLog={handleKeepMountedLog} />
        <div className="flex justify-end mt-4">
          <Button
            className="inline-flex items-center justify-center gap-2 h-10 px-5 text-sm font-medium rounded-cl-md transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-cl-text text-cl-bg hover:opacity-90 cursor-pointer"
            onClick={() => setKeepMountedOpen(false)}
          >
            Close
          </Button>
        </div>
      </Modal>
    </>
  );
}
