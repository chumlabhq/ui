"use client";

import { useState } from "react";
import { Slider } from "@chumlab/ui/slider";

const VolumeIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className={"w-3 h-3"}>
    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071a1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10a7.971 7.971 0 00-2.343-5.657a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

const StarIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-cl-warning">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const HeartIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-cl-accent">
    <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
  </svg>
);

export default function SliderExample() {
  const [basic22, setBasic22] = useState(50);
  const [volume2, setVolume2] = useState(65);
  const [custom1, setCustom1] = useState(50);
  const [custom22, setCustom22] = useState(3);
  return (
    <div className="flex flex-col gap-10 w-full sm:max-w-sm">
      <div className="space-y-1">
        <span className="text-xs font-medium text-cl-text-tertiary">Heart icon</span>
        <Slider
          value={custom1}
          onValueChange={(v) => setCustom1(v as number)}
          renderThumb={
            () => (
              <div className="flex items-center justify-center w-full h-full"><HeartIcon /></div>
            )
          }
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
                            thumb: "absolute rounded-full bg-white border-2 border-cl-border-input-focus shadow-md transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent focus-visible:ring-offset-2 hover:shadow-lg cursor-grab focus-visible:ring-offset-cl-bg",
                            range: "rounded-full bg-cl-accent/90"
                          }
          }
          showTooltip
        />
      </div>
      <div className="space-y-1">
        <span className="text-xs font-medium text-cl-text-tertiary">Star rating</span>
        <Slider
          value={custom22}
          onValueChange={(v) => setCustom22(v as number)}
          min={1}
          max={5}
          step={1}
          renderThumb={
            () => (
              <div className="flex items-center justify-center w-full h-full"><StarIcon /></div>
            )
          }
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
                            thumb: "absolute rounded-full bg-white border-2 border-cl-warning shadow-md transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-warning focus-visible:ring-offset-2 hover:shadow-lg cursor-grab focus-visible:ring-offset-cl-bg",
                            range: "rounded-full bg-cl-warning/30"
                          }
          }
          showTooltip
          formatTooltip={(v) => `${v} star${v !== 1 ? "s" : ""}`}
        />
      </div>
      <div className="space-y-1">
        <span className="text-xs font-medium text-cl-text-tertiary">Volume icon</span>
        <Slider
          value={volume2}
          onValueChange={(v) => setVolume2(v as number)}
          renderThumb={
            () => (
              <div className={"flex items-center justify-center w-full h-full text-cl-accent"}>
                <VolumeIcon />
              </div>
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
          showTooltip
          formatTooltip={(v) => `${v}%`}
        />
      </div>
      <div className="space-y-1">
        <span className="text-xs font-medium text-cl-text-tertiary">Emoji thumb</span>
        <Slider
          value={basic22}
          onValueChange={(v) => setBasic22(v as number)}
          renderThumb={
            ({ value: v }) => (
              <div className="flex items-center justify-center w-full h-full text-xs">
                {v < 30 ? "\u{1F61E}" : v < 70 ? "\u{1F610}" : "\u{1F60A}"}
              </div>
            )
          }
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
                            thumb: "absolute rounded-full bg-white border border-cl-border-input shadow-md transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cl-accent focus-visible:ring-offset-2 hover:shadow-lg cursor-grab focus-visible:ring-offset-cl-bg"
                          }
          }
          showTooltip
        />
      </div>
    </div>
  );
}
