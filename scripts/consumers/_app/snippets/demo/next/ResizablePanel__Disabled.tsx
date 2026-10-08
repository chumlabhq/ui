"use client";

import { useState } from "react";
import { Button } from "@chumlab/ui/button";
import { ResizablePanel } from "@chumlab/ui/resizable-panel";

const handleClass = (_color: string) => {
    void _color;
    return "bg-cl-border hover:bg-cl-text/20 transition-colors motion-reduce:transition-none";
  };

export default function ResizablePanelExample() {
  const [disabledToggle, setDisabledToggle] = useState(true);
  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-3">
        <Button
          size="sm"
          onClick={() => setDisabledToggle((p) => !p)}
          className={
            disabledToggle
            ? "rounded-cl-md bg-cl-error hover:bg-cl-error text-cl-bg"
            : "rounded-cl-md bg-cl-success hover:bg-cl-success text-cl-bg"
          }
        >
          {disabledToggle ? "Disabled" : "Enabled"}
          — Click to toggle
        </Button>
      </div>
      <ResizablePanel
        defaultValue={280}
        disabled={disabledToggle}
        classes={
          {
            root: `h-40 rounded-cl-md bg-cl-bg-elevated border border-cl-border transition-opacity ${
              disabledToggle ? "opacity-60" : ""
            }`,
            handle: disabledToggle ? "" : handleClass("blue")
          }
        }
      >
        <div className="p-4">
          <p
            className={`font-medium ${disabledToggle ? "text-cl-text-tertiary" : "text-cl-text"}`}
          >
            {disabledToggle ? "Disabled Panel" : "Enabled Panel"}
          </p>
          <p className="text-sm mt-2 text-cl-text-tertiary">
            {disabledToggle ? "Cannot be resized" : "Drag to resize"}
          </p>
        </div>
      </ResizablePanel>
    </div>
  );
}
