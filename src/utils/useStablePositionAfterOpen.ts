import { useEffect, useRef, useState } from "react";

export function useStablePositionAfterOpen(isOpen: boolean): boolean {
  const [stable, setStable] = useState(false);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const rafRef = useRef<{ id1?: number; id2?: number }>({});

  // Reset stable immediately when isOpen changes (render-time derived state)
  if (prevIsOpen !== isOpen) {
    setPrevIsOpen(isOpen);
    if (!isOpen) {
      setStable(false);
    }
  }

  useEffect(() => {
    if (!isOpen) return;
    rafRef.current.id1 = requestAnimationFrame(() => {
      rafRef.current.id2 = requestAnimationFrame(() => {
        setStable(true);
      });
    });
    return () => {
      if (rafRef.current.id1 !== undefined) cancelAnimationFrame(rafRef.current.id1);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      if (rafRef.current.id2 !== undefined) cancelAnimationFrame(rafRef.current.id2);
    };
  }, [isOpen]);

  return isOpen && stable;
}
