import { useEffect, useState } from "react";

export function useStablePositionAfterOpen(isOpen: boolean): boolean {
  const [stable, setStable] = useState(false);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  // Reset stable immediately when isOpen changes (render-time derived state)
  if (prevIsOpen !== isOpen) {
    setPrevIsOpen(isOpen);
    if (!isOpen) {
      setStable(false);
    }
  }

  useEffect(() => {
    if (!isOpen) return;
    let id2: number | undefined;
    const id1 = requestAnimationFrame(() => {
      id2 = requestAnimationFrame(() => {
        setStable(true);
      });
    });
    return () => {
      cancelAnimationFrame(id1);
      if (id2 !== undefined) cancelAnimationFrame(id2);
    };
  }, [isOpen]);

  return isOpen && stable;
}
