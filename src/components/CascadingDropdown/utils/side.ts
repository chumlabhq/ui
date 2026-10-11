export const physicalSide = (side: "start" | "end", el: Element | null): "left" | "right" =>
  (side === "end") === ((el?.closest("[dir]")?.getAttribute("dir") ?? document.dir) === "rtl") ? "left" : "right";
