// components/ui/HorizontalScroller.tsx
"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  /** px to scroll per arrow press (defaults to 60% of viewport width) */
  stepPx?: number;
  /** optional initial selector to scroll to (e.g. `[data-col="premium"]`) */
  initialTargetSelector?: string;
  /** if you want to control scroll via state changes, change this key to re-run scrollIntoView */
  scrollKey?: string | number;
  className?: string;
};

export function HorizontalScroller({
  children,
  stepPx,
  initialTargetSelector,
  scrollKey,
  className,
}: Props) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = React.useState(false);
  const [showRight, setShowRight] = React.useState(false);
  const [showHint, setShowHint] = React.useState(true);

  const recompute = React.useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setShowLeft(scrollLeft > 2);
    setShowRight(scrollLeft + clientWidth < scrollWidth - 2);
  }, []);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Initial state + observer
    recompute();
    const onScroll = () => {
      setShowHint(false);
      recompute();
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    // Recompute on resize
    const ro = new ResizeObserver(recompute);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
    };
  }, [recompute]);

  // Optional: focus a column/tier on mount or when scrollKey changes
  React.useEffect(() => {
    if (!initialTargetSelector) return;
    const el = ref.current;
    const target = el?.querySelector<HTMLElement>(initialTargetSelector);
    if (el && target) {
      // Align the target’s left edge nicely into view
      const left = target.offsetLeft - 16; // small padding
      el.scrollTo({ left, behavior: "smooth" });
    }
  }, [initialTargetSelector, scrollKey]);

  const step = stepPx ?? Math.round((typeof window !== "undefined" ? window.innerWidth : 1200) * 0.6);

  const nudge = (dir: -1 | 1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: step * dir, behavior: "smooth" });
  };

  return (
    <div className={cn("relative", className)}>
      {/* Scroller */}
      <div
        ref={ref}
        className="overflow-x-auto scroll-smooth rounded-lg border border-input shadow-sm"
        role="region"
        aria-label="Scrollable incentive tiers"
      >
        {children}
      </div>

      {/* Edge fades (pointer-events: none; purely visual) */}
      {showLeft && (
        <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-linear-to-r from-white to-transparent" />
      )}
      {showRight && (
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-linear-to-l from-white to-transparent" />
      )}

      {/* Arrow buttons (accessible) */}
      {showLeft && (
        <button
          type="button"
          aria-label="Scroll left"
          onClick={() => nudge(-1)}
          className="absolute left-1 top-1/2 -translate-y-1/2 rounded-full bg-white/90 shadow-md ring-1 ring-black/5 hover:bg-white p-1"
        >
          <ChevronLeft className="size-5" />
        </button>
      )}
      {showRight && (
        <button
          type="button"
          aria-label="Scroll right"
          onClick={() => nudge(1)}
          className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-white/90 shadow-md ring-1 ring-black/5 hover:bg-white p-1"
        >
          <ChevronRight className="size-5" />
        </button>
      )}

      {/* Subtle hint (auto-hides after first scroll) */}
      {showRight && showHint && (
        <div className="pointer-events-none absolute bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2 select-none rounded-full bg-neutral-900/60 px-3 py-1 text-base w-fit text-white animate-pulse">
          Scroll to see more →
        </div>
      )}
    </div>
  );
}
