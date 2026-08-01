import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * Matches the library's own design-token utilities — `bg-cl-accent`,
 * `rounded-cl-lg`, `text-cl-text-secondary`, and opacity variants such as
 * `bg-cl-accent/15`.
 */
const isClToken = (value: string) => value.startsWith("cl-");

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        "text-xs",
        "text-sm",
        "text-base",
        "text-lg",
        "text-xl",
        "text-2xl",
        "text-3xl",
        "text-4xl",
        "text-5xl",
      ],

      // The `cl-` scale is ours, not Tailwind's, so tailwind-merge cannot tell
      // that `rounded-cl-lg` is a border-radius or `bg-cl-accent` a background
      // colour. It kept BOTH the component's class and the consumer's, leaving
      // which one applied down to stylesheet order — so overriding a colour or
      // radius through className, the most common customisation there is,
      // failed silently. Registering each prefix under its real class group is
      // what lets a consumer's class replace ours.
      //
      // The prefixes mirror what the built components actually emit.
      "text-color": [{ text: [isClToken] }],
      "bg-color": [{ bg: [isClToken] }],
      "border-color": [{ border: [isClToken] }],
      "ring-color": [{ ring: [isClToken] }],
      "ring-offset-color": [{ "ring-offset": [isClToken] }],
      stroke: [{ stroke: [isClToken] }],
      fill: [{ fill: [isClToken] }],
      shadow: [{ shadow: [isClToken] }],
      rounded: [{ rounded: [isClToken] }],
      "rounded-t": [{ "rounded-t": [isClToken] }],
      "rounded-b": [{ "rounded-b": [isClToken] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
