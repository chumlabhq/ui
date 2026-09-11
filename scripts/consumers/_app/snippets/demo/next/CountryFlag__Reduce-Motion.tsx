"use client";

import { useState } from "react";
import { CountryFlag, CountryFlagShimmer } from "@chumlab/ui/country-flag";

export default function CountryFlagExample() {
  const [motionRun, setMotionRun] = useState(0);
  return (
    <>
      <div className="text-center">
        <CountryFlag key={`auto-${motionRun}`} code="us" size={48} className="rounded-[3px]" />
        <p className="text-xs mt-2 text-xs font-medium text-cl-text-tertiary">default (auto)</p>
      </div>
      <div className="text-center">
        <CountryFlag
          key={`reduced-${motionRun}`}
          code="gb"
          size={48}
          reduceMotion={true}
          className="rounded-[3px]"
        />
        <p className="text-xs mt-2 text-xs font-medium text-cl-text-tertiary">no transition</p>
      </div>
      <div className="text-center">
        <CountryFlagShimmer size={48} className="rounded-[3px]" />
        <p className="text-xs mt-2 text-xs font-medium text-cl-text-tertiary">
          pulse (default)
        </p>
      </div>
      <div className="text-center">
        <CountryFlagShimmer size={48} reduceMotion={true} className="rounded-[3px]" />
        <p className="text-xs mt-2 text-xs font-medium text-cl-text-tertiary">no pulse</p>
      </div>
    </>
  );
}
