import { useState } from "react";
import { InternationalPhoneInput, PhoneNumberData } from "@chumlab/ui/international-phone-input";

const DotIcon = ({ className = "" }: { className?: string }) => (
  <span
    className={`inline-block w-2 h-2 rounded-full bg-current ${className}`}
  />
);

const CircleCheckIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      clipRule="evenodd"
    />
  </svg>
);

const StarIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

export default function InternationalPhoneInputExample() {
  const [customIconValue, setCustomIconValue] = useState<PhoneNumberData | undefined>();
  const [circleCheckIconValue, setCircleCheckIconValue] = useState<PhoneNumberData | undefined>();
  const [noIconValue, setNoIconValue] = useState<PhoneNumberData | undefined>();
  return (
    <div className="flex flex-wrap gap-8">
      <div className="w-full sm:max-w-md">
        <span
          id="phone-icon-star"
          className="text-[11px] font-semibold uppercase tracking-wider text-cl-text-tertiary"
        >
          Star icon
        </span>
        <div className="mt-2">
          <InternationalPhoneInput
            aria-labelledby="phone-icon-star"
            value={customIconValue}
            onValueChange={setCustomIconValue}
            placeholder="Enter phone number"
            selectedIcon={<StarIcon className="w-4 h-4 shrink-0 text-cl-warning" />}
            classes={
              {
                root: "flex flex-col gap-1",
                label: "text-[13px] font-medium mb-1.5 block text-cl-text-secondary",
                input: "flex-1 h-10 px-3 rounded-cl-md border outline-none text-sm transition-all duration-150 text-cl-text placeholder:text-cl-text-tertiary border-cl-border-input bg-cl-bg-input focus:ring-2 focus:ring-cl-accent focus:border-cl-border-input-focus dark:[color-scheme:dark]",
                countrySelect: {
                         trigger: "flex items-center justify-between gap-2 h-10 px-3 rounded-cl-md border transition-all duration-150 outline-none min-w-[130px] border-cl-border-input bg-cl-bg-input hover:bg-cl-bg-hover text-cl-text-chrome",
                         content: "w-72 rounded-cl-md shadow-lg overflow-hidden bg-cl-bg-panel border border-cl-text/10",
                         searchControl: "flex items-center gap-2 px-3 py-2 border-b border-cl-text/10",
                         searchInput: "flex-1 bg-transparent focus:outline-none text-sm text-cl-text placeholder:text-cl-text-tertiary",
                         list: "max-h-60 overflow-y-auto",
                         item: "flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-cl-bg-hover text-cl-text-chrome",
                         icon: "w-4 h-4 shrink-0 transition-transform duration-200",
                         itemIndicator: "w-4 h-4 shrink-0 text-cl-accent",
                         searchIcon: "w-4 h-4 shrink-0 text-cl-text-tertiary",
                         empty: "px-3 py-4 text-sm text-center text-cl-text-tertiary"
                       }
              }
            }
          />
        </div>
      </div>
      <div className="w-full sm:max-w-md">
        <span
          id="phone-icon-circle"
          className="text-[11px] font-semibold uppercase tracking-wider text-cl-text-tertiary"
        >
          Circle check icon
        </span>
        <div className="mt-2">
          <InternationalPhoneInput
            aria-labelledby="phone-icon-circle"
            value={circleCheckIconValue}
            onValueChange={setCircleCheckIconValue}
            placeholder="Enter phone number"
            selectedIcon={<CircleCheckIcon className="w-4 h-4 shrink-0 text-cl-success" />}
            classes={
              {
                root: "flex flex-col gap-1",
                label: "text-[13px] font-medium mb-1.5 block text-cl-text-secondary",
                input: "flex-1 h-10 px-3 rounded-cl-md border outline-none text-sm transition-all duration-150 text-cl-text placeholder:text-cl-text-tertiary border-cl-border-input bg-cl-bg-input focus:ring-2 focus:ring-cl-accent focus:border-cl-border-input-focus dark:[color-scheme:dark]",
                countrySelect: {
                         trigger: "flex items-center justify-between gap-2 h-10 px-3 rounded-cl-md border transition-all duration-150 outline-none min-w-[130px] border-cl-border-input bg-cl-bg-input hover:bg-cl-bg-hover text-cl-text-chrome",
                         content: "w-72 rounded-cl-md shadow-lg overflow-hidden bg-cl-bg-panel border border-cl-text/10",
                         searchControl: "flex items-center gap-2 px-3 py-2 border-b border-cl-text/10",
                         searchInput: "flex-1 bg-transparent focus:outline-none text-sm text-cl-text placeholder:text-cl-text-tertiary",
                         list: "max-h-60 overflow-y-auto",
                         item: "flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-cl-bg-hover text-cl-text-chrome",
                         icon: "w-4 h-4 shrink-0 transition-transform duration-200",
                         itemIndicator: "w-4 h-4 shrink-0 text-cl-accent",
                         searchIcon: "w-4 h-4 shrink-0 text-cl-text-tertiary",
                         empty: "px-3 py-4 text-sm text-center text-cl-text-tertiary"
                       }
              }
            }
          />
        </div>
      </div>
      <div className="w-full sm:max-w-md">
        <span
          id="phone-icon-dot"
          className="text-[11px] font-semibold uppercase tracking-wider text-cl-text-tertiary"
        >
          Dot indicator
        </span>
        <div className="mt-2">
          <InternationalPhoneInput
            aria-labelledby="phone-icon-dot"
            value={noIconValue}
            onValueChange={setNoIconValue}
            placeholder="Enter phone number"
            selectedIcon={<DotIcon className="text-cl-accent" />}
            classes={
              {
                root: "flex flex-col gap-1",
                label: "text-[13px] font-medium mb-1.5 block text-cl-text-secondary",
                input: "flex-1 h-10 px-3 rounded-cl-md border outline-none text-sm transition-all duration-150 text-cl-text placeholder:text-cl-text-tertiary border-cl-border-input bg-cl-bg-input focus:ring-2 focus:ring-cl-accent focus:border-cl-border-input-focus dark:[color-scheme:dark]",
                countrySelect: {
                         trigger: "flex items-center justify-between gap-2 h-10 px-3 rounded-cl-md border transition-all duration-150 outline-none min-w-[130px] border-cl-border-input bg-cl-bg-input hover:bg-cl-bg-hover text-cl-text-chrome",
                         content: "w-72 rounded-cl-md shadow-lg overflow-hidden bg-cl-bg-panel border border-cl-text/10",
                         searchControl: "flex items-center gap-2 px-3 py-2 border-b border-cl-text/10",
                         searchInput: "flex-1 bg-transparent focus:outline-none text-sm text-cl-text placeholder:text-cl-text-tertiary",
                         list: "max-h-60 overflow-y-auto",
                         item: "flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-cl-bg-hover text-cl-text-chrome",
                         icon: "w-4 h-4 shrink-0 transition-transform duration-200",
                         itemIndicator: "w-4 h-4 shrink-0 text-cl-accent",
                         searchIcon: "w-4 h-4 shrink-0 text-cl-text-tertiary",
                         empty: "px-3 py-4 text-sm text-center text-cl-text-tertiary"
                       }
              }
            }
          />
        </div>
      </div>
    </div>
  );
}
