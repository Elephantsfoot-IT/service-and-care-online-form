import React, { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

interface IncentiveTableProps {
  serviceCount: number;
  selectMore: () => void;
}

function FloatingIncentives({ serviceCount }: IncentiveTableProps) {
  const [isSectionInView, setIsSectionInView] = useState(false);
  const [hasScrolledPast, setHasScrolledPast] = useState(false);

  const currentTier = useMemo(() => {
    if (serviceCount < 3) return undefined;
    if (serviceCount < 4) return "basic";
    if (serviceCount < 6) return "essential";
    return "premium";
  }, [serviceCount]);

  useEffect(() => {
    const rewardsSection = document.getElementById("rewards");
    if (!rewardsSection) return;

    const checkVisibility = () => {
      const rect = rewardsSection.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Check if section is in view (any part of it is visible)
      const isInView = rect.top < viewportHeight && rect.bottom > 0;
      // Check if section has been scrolled past (entire section is above viewport)
      const isPast = rect.bottom < 0;
      
      setIsSectionInView(isInView);
      setHasScrolledPast(isPast);
    };

    const observer = new IntersectionObserver(
      () => {
        checkVisibility();
      },
      {
        threshold: [0, 0.1, 0.5, 1],
        rootMargin: "-50px 0px 0px 0px", // Trigger slightly before section enters view
      }
    );

    observer.observe(rewardsSection);
    
    // Also check on scroll for more responsive updates
    window.addEventListener("scroll", checkVisibility, { passive: true });
    checkVisibility(); // Initial check

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", checkVisibility);
    };
  }, []);

  if (serviceCount === 0) return null;

  const shouldFade = isSectionInView || hasScrolledPast;

  return (
    <div
      className={cn(
        "fade-up fade-up-300 sticky bottom-2 left-0 right-0 w-full border border-input bg-white z-50 rounded-xl hidden xl:grid grid-cols-10 divide-x divide-input shadow-xs overflow-hidden transition-all duration-500 ease-in-out",
        shouldFade 
          ? "opacity-0 translate-y-full pointer-events-none invisible" 
          : "opacity-100 translate-y-0 visible"
      )}
    >
      <div className="col-span-4 p-4 flex flex-col ">
        <span className="uppercase tracking-wide font-semibold text-sm">
          Complimentary Incentives
        </span>
        <span className="text-sm text-neutral-500">  Add services to unlock and redeem complimentary incentives from
        us — at no extra cost.</span>
       
      </div>
      
      {/* Basic tier */}
      <div className="col-span-2 transition-all duration-300 relative" data-col="basic">
        {currentTier === "basic" && (
          <div className="pointer-events-none absolute inset-0 z-0 border border-neutral-300 bg-neutral-300/10" />
        )}
        {(currentTier === "essential" || currentTier === "premium") && (
          <div className="pointer-events-none absolute inset-0 z-50 bg-neutral-300/10" />
        )}
        <div
          className={cn(
            "h-full relative transition-all duration-300",
            currentTier === "basic"
              ? "bg-neutral-200/40"
              : ""
          )}
        >
          {/* progress fill */}
          <div
            className={cn(
              "bg-neutral-300/40 h-full z-0 absolute left-0 transition-all duration-300",
              serviceCount === 0 && "w-0",
              serviceCount === 1 && "w-1/3",
              serviceCount === 2 && "w-2/3",
              serviceCount === 3 && "w-full bg-transparent"
            )}
          />
          <div className="relative z-10 p-4 flex-shrink-0 flex flex-col">
            <span className="uppercase tracking-wide font-semibold text-sm">
              Basic
            </span>
            {serviceCount < 3 ? (
              <div className="flex items-baseline gap-2">
                <span className="font-medium leading-none text-2xl">3</span>
                <span className="text-sm text-neutral-600">services required</span>
              </div>
            ) : (
              <div className="flex items-baseline gap-2">
                <span className="font-medium leading-none text-xl">Redeemed</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Essential tier */}
      <div className="col-span-2 transition-all duration-300 relative" data-col="essential">
        {currentTier === "essential" && (
          <div className="pointer-events-none absolute inset-0 z-30 border border-[#ffdb01] bg-[#ffdb01]/5" />
        )}
        {currentTier === "premium" && (
          <div className="pointer-events-none absolute inset-0 z-50 bg-neutral-300/10" />
        )}
        <div
          className={cn(
            "h-full relative transition-all duration-300",
            currentTier === "essential"
              ? "bg-[#ffdb01]"
              : ""
          )}
        >
          <div className="relative z-10 p-4 flex-shrink-0 flex flex-col">
            <span className="uppercase tracking-wide font-semibold text-sm">
              Essential
            </span>
            {serviceCount < 4 ? (
              <div className="flex items-baseline gap-2">
                <span className="font-medium leading-none text-2xl">4</span>
                <span className="text-sm text-neutral-600">services required</span>
              </div>
            ) : (
              <div className="flex items-baseline gap-2">
                <span className="font-medium leading-none text-xl">Redeemed</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Premium tier */}
      <div className="col-span-2 transition-all duration-300 relative" data-col="premium">
        {currentTier === "premium" && (
          <div className="pointer-events-none absolute inset-0 z-30 border border-[#1e60ad] bg-blue-400/5" />
        )}
        <div
          className={cn(
            "h-full relative transition-all duration-300",
            currentTier === "premium"
              ? "bg-[#1e60ad] text-white"
              : ""
          )}
        >
          {/* progress fill */}
          <div
            className={cn(
              "bg-neutral-300/40 h-full z-0 absolute left-0 transition-all duration-300",
              serviceCount < 5 && "w-0",
              serviceCount === 5 && "w-1/2",
              serviceCount === 6 && "w-full bg-transparent"
            )}
          />
          <div className="relative z-10 p-4 flex-shrink-0 flex flex-col">
            <span className="uppercase tracking-wide font-semibold text-sm">
              Premium
            </span>
            {serviceCount < 6 ? (
              <div className="flex items-baseline gap-2">
                <span className="font-medium leading-none text-2xl">6</span>
                <span
                  className={cn(
                    "text-sm",
                    currentTier === "premium"
                      ? "text-white/80"
                      : "text-neutral-600"
                  )}
                >
                  services required
                </span>
              </div>
            ) : (
              <div className="flex items-baseline gap-2">
                <span
                  className={cn(
                    "font-medium leading-none text-xl",
                    currentTier === "premium"
                      ? "text-white"
                      : "text-neutral-800"
                  )}
                >
                  Redeemed
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FloatingIncentives;
