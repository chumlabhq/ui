import type { Fixtures } from "./types";

const fixtures: Fixtures = [
  { name: "initials", props: { name: "Ada Lovelace" } },
  { name: "image", props: { src: "https://example.test/a.png", alt: "Ada" } },
  {
    name: "fallback",
    props: { fallback: <span>?</span>, alt: "Unknown" },
    note: "fallback renders only with no src and no initials, so `name` is omitted.",
  },
  { name: "with-status", props: { name: "Ada", status: "online" } },
];
export default fixtures;
