// hooks/useScrollSpy.ts
import { useEffect, useState } from "react";

type Options = { offset?: number };

export function useScrollSpy(ids: string[], { offset = 120 }: Options = {}) {
  const [activeId, setActiveId] = useState<string | null>(ids[0] ?? null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const getActive = () => {
      const scrollY = window.scrollY + offset;
      let current: string | null = null;

      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top + window.scrollY;
        if (top <= scrollY) {
          current = id; // keeps the last section whose top is above the buffer line
        } else {
          break;
        }
      }
      if (current) setActiveId(current);
    };

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          getActive();
          ticking = false;
        });
        ticking = true;
      }
    };

    // initial
    getActive();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ids, offset]);

  return activeId;
}
