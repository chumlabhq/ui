"use client";

import { useState } from "react";
import { Slider, SliderMark } from "@chumlab/ui/slider";

const ratingMarks: SliderMark[] = [
    { value: 1, label: "1" },
    { value: 2, label: "2" },
    { value: 3, label: "3" },
    { value: 4, label: "4" },
    { value: 5, label: "5" },
  ];

const tempMarks: SliderMark[] = [
    { value: 16, label: "16\u00b0C" },
    { value: 20, label: "20\u00b0C" },
    { value: 24, label: "24\u00b0C" },
    { value: 28, label: "28\u00b0C" },
    { value: 32, label: "32\u00b0C" },
  ];

export default function SliderExample() {
  const [temp, setTemp] = useState(22);
  return (
    <div className="flex flex-col gap-12 w-full sm:max-w-md">
      <div className="space-y-1">
        <span className="text-xs font-medium text-cl-text-tertiary">
          Default marks with labels
        </span>
        <Slider
          value={temp}
          onValueChange={(v) => setTemp(v as number)}
          min={16}
          max={32}
          step={1}
          marks={tempMarks}
          showTooltip
          formatTooltip={(v) => `${v}\u00b0C`}
          classes={
            {
              root: "flex flex-col gap-2 w-full",
              label: "text-sm font-medium text-cl-text",
              description: "text-xs text-cl-text-secondary",
              track: "rounded-full bg-cl-bg-track",
              range: "rounded-full bg-cl-accent",
              thumb: "absolute rounded-full bg-white shadow-md transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent focus-visible:ring-offset-2 hover:shadow-lg cursor-grab focus-visible:ring-offset-cl-bg"
            }
          }
        />
        <div className="text-xs text-cl-text-secondary">
          Temperature:
          {temp}
          &deg;C
        </div>
      </div>
      <div className="space-y-1">
        <span className="text-xs font-medium text-cl-text-tertiary">Large dots (10px)</span>
        <Slider
          defaultValue={50}
          marks={
            [
              { value: 0, label: "0" },
              { value: 25, label: "25" },
              { value: 50, label: "50" },
              { value: 75, label: "75" },
              { value: 100, label: "100" }
            ]
          }
          markDotSize={10}
          classes={
            {
              root: "flex flex-col gap-2 w-full",
              label: "text-sm font-medium text-cl-text",
              description: "text-xs text-cl-text-secondary",
              track: "rounded-full bg-cl-bg-track",
              range: "rounded-full bg-cl-accent",
              thumb: "absolute rounded-full bg-white shadow-md transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent focus-visible:ring-offset-2 hover:shadow-lg cursor-grab focus-visible:ring-offset-cl-bg"
            }
          }
        />
      </div>
      <div className="space-y-1">
        <span className="text-xs font-medium text-cl-text-tertiary">Dots only (no labels)</span>
        <Slider
          defaultValue={60}
          marks={[0, 20, 40, 60, 80, 100].map((v) => ({ value: v }))}
          showMarkLabels={false}
          markDotSize={8}
          classes={
            {
              root: "flex flex-col gap-2 w-full",
              label: "text-sm font-medium text-cl-text",
              description: "text-xs text-cl-text-secondary",
              track: "rounded-full bg-cl-bg-track",
              range: "rounded-full bg-cl-accent",
              thumb: "absolute rounded-full bg-white shadow-md transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent focus-visible:ring-offset-2 hover:shadow-lg cursor-grab focus-visible:ring-offset-cl-bg"
            }
          }
        />
      </div>
      <div className="space-y-1">
        <span className="text-xs font-medium text-cl-text-tertiary">Solid filled dots</span>
        <Slider
          defaultValue={3}
          min={1}
          max={5}
          step={1}
          marks={ratingMarks}
          markDotSize={10}
          classes={
            {
                            ...({
              root: "flex flex-col gap-2 w-full",
              label: "text-sm font-medium text-cl-text",
              description: "text-xs text-cl-text-secondary",
              track: "rounded-full bg-cl-bg-track",
              range: "rounded-full bg-cl-accent",
              thumb: "absolute rounded-full bg-white shadow-md transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent focus-visible:ring-offset-2 hover:shadow-lg cursor-grab focus-visible:ring-offset-cl-bg"
            }),
                            marker: "rounded-full bg-cl-bg-hover"
                          }
          }
        />
      </div>
      <div className="space-y-1">
        <span className="text-xs font-medium text-cl-text-tertiary">
          Custom renderMark (line ticks)
        </span>
        <Slider
          defaultValue={50}
          step={10}
          marks={
            [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((v) => ({
              value: v,
              label: v % 20 === 0 ? String(v) : undefined
            }))
          }
          renderMark={
            ({ isActive }) => (
              <div
                style={{
                  width: "2px",
                  height: "10px",
                  borderRadius: "1px",
                  backgroundColor: isActive
                    ? ("var(--cl-accent)")
                    : ("var(--cl-bg-track)"),
                  transform: "translateY(-50%)"
                }}
              />
            )
          }
          classes={
            {
              root: "flex flex-col gap-2 w-full",
              label: "text-sm font-medium text-cl-text",
              description: "text-xs text-cl-text-secondary",
              track: "rounded-full bg-cl-bg-track",
              range: "rounded-full bg-cl-accent",
              thumb: "absolute rounded-full bg-white shadow-md transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent focus-visible:ring-offset-2 hover:shadow-lg cursor-grab focus-visible:ring-offset-cl-bg"
            }
          }
        />
      </div>
      <div className="space-y-1">
        <span className="text-xs font-medium text-cl-text-tertiary">
          Custom renderMark (diamonds)
        </span>
        <Slider
          defaultValue={40}
          marks={[0, 25, 50, 75, 100].map((v) => ({ value: v, label: `${v}%` }))}
          renderMark={
            ({ isActive }) => (
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  backgroundColor: isActive
                    ? ("var(--cl-accent)")
                    : ("var(--cl-bg-track)"),
                  transform: "translateY(-50%) rotate(45deg)"
                }}
              />
            )
          }
          classes={
            {
              root: "flex flex-col gap-2 w-full",
              label: "text-sm font-medium text-cl-text",
              description: "text-xs text-cl-text-secondary",
              track: "rounded-full bg-cl-bg-track",
              range: "rounded-full bg-cl-accent",
              thumb: "absolute rounded-full bg-white shadow-md transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent focus-visible:ring-offset-2 hover:shadow-lg cursor-grab focus-visible:ring-offset-cl-bg"
            }
          }
        />
      </div>
    </div>
  );
}
