import { AvatarShimmer } from "../../components/Avatar";
import type { Fixtures } from "./types";

/**
 * ADR 002: AvatarShimmer is reachable from the package root and AvatarDemo
 * renders it standalone, so it is a component in its own right rather than a
 * part of Avatar. It has its own anatomy and therefore its own fixtures.
 */
const fixtures: Fixtures<typeof AvatarShimmer> = [
  { name: "default", props: {} },
  { name: "small", props: { size: "sm" } },
  { name: "large", props: { size: "lg" } },
  { name: "square", props: { shape: "square" } },
  { name: "static", props: { animate: false } },
];

export default fixtures;
