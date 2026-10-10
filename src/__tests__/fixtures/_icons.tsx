/**
 * Real glyphs for the fixtures that replace a component's icon.
 *
 * An SVG, never a text letter: `Button/with-icons` passed letters and hid a
 * height bug, because a glyph of text takes its box from the line-height and a
 * drawn icon does not. Each is drawn at the default icon's size — 16, except
 * Dropdown's clear glyph at 14 — so `icon-slots` can hold the custom box to
 * the default's. `data-fixture-glyph` is how that spec tells the two apart.
 */
import type { ReactNode } from "react";

const Glyph = ({ name, size = 16, children }: { name: string; size?: number; children: ReactNode }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    aria-hidden="true"
    focusable="false"
    data-fixture-glyph={name}
  >
    {children}
  </svg>
);

export const CrossGlyph = ({ size }: { size?: number }) => (
  <Glyph name="cross" size={size}>
    <path d="M4 4l8 8M12 4l-8 8" />
  </Glyph>
);

export const ChevronGlyph = () => (
  <Glyph name="chevron">
    <path d="M4 6l4 4 4-4" />
  </Glyph>
);

export const SearchGlyph = () => (
  <Glyph name="search">
    <circle cx="7" cy="7" r="4" />
    <path d="M10 10l3 3" />
  </Glyph>
);

export const SlashGlyph = () => (
  <Glyph name="slash">
    <path d="M10 3L6 13" />
  </Glyph>
);

export const DotsGlyph = () => (
  <Glyph name="dots">
    <path d="M3 8h.01M8 8h.01M13 8h.01" strokeWidth={2.5} />
  </Glyph>
);
