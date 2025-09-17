import { cn } from "@/lib/utils";
import { CheckIcon, MinusIcon } from "lucide-react";
import { useMemo } from "react";

interface IncentiveTableProps {
  serviceCount: number;
}

function IncentiveTable({ serviceCount }: IncentiveTableProps) {
  const currentTier = useMemo(() => {
    if (serviceCount < 3) return undefined;
    if (serviceCount < 4) return "basic";
    if (serviceCount < 6) return "essential";
    return "pro";
  }, [serviceCount]);

  return (
    <div className="flex flex-col gap-6 w-full text-sm leading-6 min-w-[820px]">
      {/* Rounded container to match app style */}
      <div className="rounded-lg border border-neutral-200 shadow-xs overflow-hidden">
        <div className="w-full grid grid-cols-9">
          {/* Incentives column */}
          <div className="col-span-3 border-neutral-200 border-solid">
            <div className="h-18 border-b border-neutral-200 border-solid font-medium flex justify-start items-center px-2 " />
            <div className="h-14 border-b border-neutral-200 border-solid flex justify-start items-center px-4 font-medium">
              Price Lock Guarantee (24 Months)
            </div>
            <div className="h-14 border-b border-neutral-200 border-solid flex justify-start items-center px-4 font-medium">
              Priority Response Within 8 Hours
            </div>
            <div className="h-14 border-b border-neutral-200 border-solid flex justify-start items-center px-4 font-medium">
              Priority Booking
            </div>
            <div className="h-14 border-b border-neutral-200 border-solid flex justify-start items-center px-4 font-medium">
              Flexible 21-Day Payment Terms
            </div>
            <div className="h-14 border-b border-neutral-200 border-solid flex justify-start items-center px-4 font-medium">
              Discounts on Parts
            </div>
            <div className="h-14 border-b border-neutral-200 border-solid flex justify-start items-center px-4 font-medium">
              Service Pricing Discounts
            </div>
            <div className="h-14 border-b flex justify-start items-center px-4 font-medium">
              Complimentary Odour Control (First 3 Months)
            </div>
            <div className="h-14 border-none flex justify-start items-center px-4" />
          </div>

          {/* Basic tier */}
          <div className="col-span-2 transition-all duration-300 relative">
            {currentTier === "basic" && (
              <div className="pointer-events-none absolute inset-0 z-0 border-2 border-neutral-300 bg-neutral-300/20" />
            )}
            {(currentTier === "essential" || currentTier === "pro") && (
              <div className="pointer-events-none absolute inset-0 z-50 bg-neutral-300/10" />
            )}

            <div
              className={cn(
                "h-18 border-b border-neutral-200 border-solid font-medium flex justify-center items-center relative transition-all duration-300 ",
                currentTier === "basic" && "bg-neutral-200/60 tier-header"
              )}
            >
              <div
                className={cn(
                  "bg-neutral-300/40 h-full z-0 absolute left-0 transition-all duration-300",
                  serviceCount === 0 && "w-0",
                  serviceCount === 1 && "w-1/3",
                  serviceCount === 2 && "w-2/3",
                  serviceCount === 3 && "w-full bg-transparent"
                )}
              />
              <div className="relative z-10 flex flex-col items-center">
                <span className="text-base font-semibold">Basic</span>
                <span
                  className={cn(
                    "text-xs font-medium",
                    currentTier === "basic" ? "text-neutral-800" : "text-neutral-600"
                  )}
                >
                  {serviceCount < 3 ? "Requires 3 services" : "Unlocked"}
                </span>
              </div>
            </div>

            <div className="h-14 border-b border-neutral-200 flex justify-center items-center">
              <CheckIcon className="size-4 text-neutral-800" />
            </div>
            <div className="h-14 border-b border-neutral-200 flex justify-center items-center">
              <CheckIcon className="size-4 text-neutral-800" />
            </div>
            <div className="h-14 border-b border-neutral-200 flex justify-center items-center">
              <CheckIcon className="size-4 text-neutral-800" />
            </div>
            <div className="h-14 border-b border-neutral-200 flex justify-center items-center">
              <MinusIcon className="size-4 text-neutral-300" />
            </div>
            <div className="h-14 border-b border-neutral-200 flex justify-center items-center">
              <MinusIcon className="size-4 text-neutral-300" />
            </div>
            <div className="h-14 border-b border-neutral-200 flex justify-center items-center">
              <MinusIcon className="size-4 text-neutral-300" />
            </div>
            <div className="h-14 border-b flex justify-center items-center">
              <MinusIcon className="size-4 text-neutral-300" />
            </div>
          </div>

          {/* Essential tier */}
          <div className="col-span-2 transition-all duration-300 relative">
            {currentTier === "essential" && (
              <div className="pointer-events-none absolute inset-0 z-30 border-2 border-[#ffdb01] bg-[#ffdb01]/5" />
            )}
            {currentTier === "pro" && (
              <div className="pointer-events-none absolute inset-0 z-50 bg-neutral-300/10" />
            )}

            <div
              className={cn(
                "h-18 border-solid font-medium flex justify-center items-center relative transition-all duration-300 ",
                currentTier === "essential"
                  ? "bg-[#ffdb01] text-neutral-800 tier-header border-b-[#ffdb01]"
                  : "border-b border-neutral-200"
              )}
            >
              <div className="relative z-10 flex flex-col items-center">
                <span className="text-base font-semibold">Essential</span>
                <span
                  className={cn(
                    "text-xs font-medium",
                    currentTier === "essential" ? "text-neutral-800" : "text-neutral-600"
                  )}
                >
                  {serviceCount < 4 ? "Requires 4 services" : "Unlocked"}
                </span>
              </div>
            </div>

            <div className="h-14 border-b border-neutral-200 flex justify-center items-center">
              <CheckIcon className="size-4 text-neutral-800" />
            </div>
            <div className="h-14 border-b border-neutral-200 flex justify-center items-center">
              <CheckIcon className="size-4 text-neutral-800" />
            </div>
            <div className="h-14 border-b border-neutral-200 flex justify-center items-center">
              <CheckIcon className="size-4 text-neutral-800" />
            </div>
            <div className="h-14 border-b border-neutral-200 flex justify-center items-center">
              <CheckIcon className="size-4 text-neutral-800" />
            </div>
            <div className="h-14 border-b border-neutral-200 flex justify-center items-center">
              <span className="text-sm font-semibold">10%</span>
            </div>
            <div className="h-14 border-b border-neutral-200 flex justify-center items-center">
              <CheckIcon className="size-4 text-neutral-800" />
            </div>
            <div className="h-14 border-b flex justify-center items-center">
              <MinusIcon className="size-4 text-neutral-300" />
            </div>
          </div>

          {/* Pro tier */}
          <div className="col-span-2 transition-all duration-300 relative">
            {currentTier === "pro" && (
              <div className="pointer-events-none absolute inset-0 z-30 border-2 border-[#1e60ad] bg-blue-400/5" />
            )}

            <div
              className={cn(
                "h-18 border-solid font-medium flex justify-center items-center relative transition-all duration-300",
                currentTier === "pro"
                  ? "bg-[#1e60ad] text-white tier-header border-b-[#1e60ad]"
                  : "border-b border-neutral-200"
              )}
            >
              <div
                className={cn(
                  "bg-neutral-300/40 h-full z-0 absolute left-0 transition-all duration-300",
                  serviceCount < 5 && "w-0",
                  serviceCount === 5 && "w-1/2",
                  serviceCount === 6 && "w-full bg-transparent"
                )}
              />
              <div className="relative z-10 flex flex-col items-center">
                <span className="text-base font-semibold">Pro</span>
                <span
                  className={cn(
                    "text-xs font-medium",
                    currentTier === "pro" ? "text-white/90" : "text-neutral-600"
                  )}
                >
                  {serviceCount < 6 ? "Requires 6 services" : "Unlocked"}
                </span>
              </div>
            </div>

            <div className="h-14 border-b border-neutral-200 flex justify-center items-center">
              <CheckIcon className="size-4 text-neutral-800" />
            </div>
            <div className="h-14 border-b border-neutral-200 flex justify-center items-center">
              <CheckIcon className="size-4 text-neutral-800" />
            </div>
            <div className="h-14 border-b border-neutral-200 flex justify-center items-center">
              <CheckIcon className="size-4 text-neutral-800" />
            </div>
            <div className="h-14 border-b border-neutral-200 flex justify-center items-center">
              <CheckIcon className="size-4 text-neutral-800" />
            </div>
            <div className="h-14 border-b border-neutral-200 flex justify-center items-center">
              <span className="text-sm font-semibold">15%</span>
            </div>
            <div className="h-14 border-b border-neutral-200 flex justify-center items-center">
              <CheckIcon className="size-4 text-neutral-800" />
            </div>
            <div className="h-14 border-b flex justify-center items-center">
              <CheckIcon className="size-4 text-neutral-800" />
            </div>
            <div className="h-14 border-none flex justify-center items-center" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default IncentiveTable;
