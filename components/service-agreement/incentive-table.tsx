import { cn } from "@/lib/utils";
import { CheckIcon, MinusIcon } from "lucide-react";
import { useMemo } from "react";
import { Button } from "../ui/button";

interface IncentiveTableProps {
  serviceCount: number;
  selectMore: () => void;
}

function IncentiveTable({ serviceCount, selectMore }: IncentiveTableProps) {
  const currentTier = useMemo(() => {
    if (serviceCount < 3) return undefined;
    if (serviceCount < 4) return "basic";
    if (serviceCount < 6) return "essential";
    return "premium";
  }, [serviceCount]);

  return (
    <div className="flex flex-col gap-6 w-full text-sm xl:text-base leading-6 ">
      {/* Rounded container to match app style */}
      <div className="bg-white">
        <div className="w-full grid grid-cols-10 divide-x divide-input">
          {/* Incentives column */}
          <div className="col-span-4 border-input border-solid">
            <div className="h-40 border-b border-input border-solid font-medium flex justify-start items-center px-2 " />
            <div className="h-14 border-b border-input border-solid flex justify-start items-center px-4 ">
              Price Lock Guarantee (24 Months)
            </div>
            <div className="h-14 border-b border-input border-solid flex justify-start items-center px-4 ">
              Priority Response Within 8 Hours
            </div>
            <div className="h-14 border-b border-input border-solid flex justify-start items-center px-4 ">
              Priority Booking
            </div>
            <div className="h-14 border-b border-input border-solid flex justify-start items-center px-4 ">
              Flexible 21-Day Payment Terms
            </div>
            <div className="h-14 border-b border-input border-solid flex justify-start items-center px-4 ">
              Discounts on Parts
            </div>
            <div className="h-14 border-b border-input border-solid flex justify-start items-center px-4 ">
              Service Pricing Discounts
            </div>
            <div className="h-14 border-none flex justify-start items-center px-4 ">
              Complimentary Odour Control (First 3 Months)
            </div>
            <div className="h-4 border-none flex justify-center items-center"></div>
          </div>

          {/* Basic tier */}
          <div className="col-span-2 transition-all duration-300 relative" data-col="basic">
            {currentTier === "basic" && (
              <div className="pointer-events-none absolute inset-0 z-0 border border-neutral-300 bg-neutral-300/10" />
            )}
            {(currentTier === "essential" || currentTier === "premium") && (
              <div className="pointer-events-none absolute inset-0 z-50 bg-neutral-300/10" />
            )}

            {/* BASIC */}
            <div
              className={cn(
                "h-40 border-solid relative transition-all duration-300",
                currentTier === "basic"
                  ? "bg-neutral-200/40"
                  : "border-b border-input"
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
              <div className="relative z-10 flex h-full w-full items-start p-4 md:p-6 ">
                <div className="flex flex-col items-start gap-2 w-full">
                  <span className="uppercase tracking-wide font-semibold text-xs md:text-sm">
                    Basic
                  </span>

                  {serviceCount < 3 ? (
                    <div className="flex items-baseline gap-2">
                      <span className="font-medium leading-none text-3xl">
                        3
                      </span>
                      <span className="text-sm text-neutral-600">
                        services required
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-2">
                      <span className="font-medium leading-none text-xl">
                        Redeemed
                      </span>
                    </div>
                  )}

                  {currentTier != "basic" &&
                    currentTier != "essential" &&
                    currentTier != "premium" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className={cn(
                          "mt-2 w-full",
                        )}
                        onClick={selectMore}
                      >
                        Redeem
                      </Button>
                    )}
                </div>
              </div>
            </div>

            <div className="h-14 border-b border-input flex justify-center items-center">
              <CheckIcon className="size-4 text-neutral-800" />
            </div>
            <div className="h-14 border-b border-input flex justify-center items-center">
              <CheckIcon className="size-4 text-neutral-800" />
            </div>
            <div className="h-14 border-b border-input flex justify-center items-center">
              <CheckIcon className="size-4 text-neutral-800" />
            </div>
            <div className="h-14 border-b border-input flex justify-center items-center">
              <MinusIcon className="size-4 text-neutral-300" />
            </div>
            <div className="h-14 border-b border-input flex justify-center items-center">
              <MinusIcon className="size-4 text-neutral-300" />
            </div>
            <div className="h-14 border-b border-input flex justify-center items-center">
              <MinusIcon className="size-4 text-neutral-300" />
            </div>
            <div className="h-14 border-none flex justify-center items-center">
              <MinusIcon className="size-4 text-neutral-300" />
            </div>
            <div className="h-4 border-none flex justify-center items-center"></div>
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
                "h-40 border-solid relative transition-all duration-300",
                currentTier === "essential"
                  ? "bg-[#ffdb01] border-b-[#ffdb01]"
                  : "border-b border-input"
              )}
            >
              <div className="relative z-10 flex h-full w-full items-start p-4 md:p-6">
                <div className="flex flex-col items-start gap-2 w-full">
                  <span className="uppercase tracking-wide font-semibold text-xs md:text-sm">
                    Essential
                  </span>

                  {serviceCount < 4 ? (
                    <div className="flex items-baseline gap-2">
                      <span className="font-medium leading-none text-3xl">
                        4
                      </span>
                      <span className="text-sm text-neutral-600">
                        services required
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-2">
                      <span className="font-medium leading-none text-xl">
                        Redeemed
                      </span>
                    </div>
                  )}

                  {currentTier != "essential" && currentTier != "premium" && (
                    <Button
                      size="sm"
                      className={cn(
                        "mt-2 w-full",
                        "bg-[#ffdb01] hover:bg-[#ffdb01]/90 border-b-[#ffdb01] text-neutral-800"
                      )}
                      onClick={selectMore}
                    >
                      Redeem
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="h-14 border-b border-input flex justify-center items-center">
              <CheckIcon className="size-4 text-neutral-800" />
            </div>
            <div className="h-14 border-b border-input flex justify-center items-center">
              <CheckIcon className="size-4 text-neutral-800" />
            </div>
            <div className="h-14 border-b border-input flex justify-center items-center">
              <CheckIcon className="size-4 text-neutral-800" />
            </div>
            <div className="h-14 border-b border-input flex justify-center items-center">
              <CheckIcon className="size-4 text-neutral-800" />
            </div>
            <div className="h-14 border-b border-input flex justify-center items-center">
              <span className="text-sm">10%</span>
            </div>
            <div className="h-14 border-b border-input flex justify-center items-center">
              <span className="text-sm">5%</span>
            </div>
            <div className="h-14 border-none flex justify-center items-center">
              <MinusIcon className="size-4 text-neutral-300" />
            </div>
            <div className="h-4 border-none flex justify-center items-center"></div>
          </div>

          {/* Pro tier */}
          <div className="col-span-2 transition-all duration-300 relative" data-col="premium">
            {currentTier === "premium" && (
              <div className="pointer-events-none absolute inset-0 z-30 border border-[#1e60ad] bg-blue-400/5 rounded-br-lg" />
            )}

            {/* PRO */}
            <div
              className={cn(
                "h-40 border-solid relative transition-all duration-300",
                currentTier === "premium"
                  ? "bg-[#1e60ad] text-white border-b-[#1e60ad]"
                  : "border-b border-input"
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
              <div className="relative z-10 flex h-full w-full items-start p-4 md:p-6">
                <div className="flex flex-col items-start gap-2 w-full">
                  <span className="uppercase tracking-wide font-semibold text-xs md:text-sm">
                    Premium
                  </span>

                  {serviceCount < 6 ? (
                    <div className="flex items-baseline gap-2">
                      <span className="font-medium leading-none text-3xl">
                        6
                      </span>
                      <span
                        className={cn(
                          "text-sm",
                          currentTier === "premium"
                            ? "text-white/80"
                            : "text-neutral-800"
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
                  {currentTier != "premium" && (
                    <Button
                      size="sm"
                      className={cn(
                        "mt-2 w-full",
                        "bg-[#1e60ad] hover:bg-[#1e60ad]/90 text-white  border-b-[#1e60ad]"
                      )}
                      onClick={selectMore}
                    >
                      Redeem
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="h-14 border-b border-input flex justify-center items-center">
              <CheckIcon className="size-4 text-neutral-800" />
            </div>
            <div className="h-14 border-b border-input flex justify-center items-center">
              <CheckIcon className="size-4 text-neutral-800" />
            </div>
            <div className="h-14 border-b border-input flex justify-center items-center">
              <CheckIcon className="size-4 text-neutral-800" />
            </div>
            <div className="h-14 border-b border-input flex justify-center items-center">
              <CheckIcon className="size-4 text-neutral-800" />
            </div>
            <div className="h-14 border-b border-input flex justify-center items-center">
              <span className="text-sm">15%</span>
            </div>
            <div className="h-14 border-b border-input flex justify-center items-center">
              <span className="text-sm">10%</span>
            </div>
            <div className="h-14 border-none flex justify-center items-center">
              <CheckIcon className="size-4 text-neutral-800" />
            </div>
            <div className="h-4 border-none flex justify-center items-center"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IncentiveTable;
