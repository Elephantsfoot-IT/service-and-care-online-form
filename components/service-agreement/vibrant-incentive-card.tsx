import { cn } from "@/lib/utils";
import { CheckIcon, LockKeyholeIcon } from "lucide-react";
import { Button } from "../ui/button";

interface IncentiveCardProps {
  currentTier: string;
}

function VibrantIncentiveCard({ currentTier }: IncentiveCardProps) {
  return (
    <div className="flex sm:flex-row flex-col gap-6 w-full py-10 items-center">
      <div
        className={cn(
          "rounded-2xl p-4 flex-1 shadow-md min-h-[550px] min-w-[300px] w-full h-fit appear-up fade-up-200 flex flex-col",
          currentTier === "basic"
            ? "shadow-xl bg-linear-to-br from-[#d4d4d4] via-[#d4d4d4]/90 to-[#d4d4d4]/80"
            : "border border-neutral-100 "
        )}
      >
        {(currentTier === "essential" || currentTier === "pro") && (
          <div className="pointer-events-none absolute inset-0 z-50 bg-secondary/40" />
        )}

        <div className="text-xl font-medium text-left">Basic</div>

        {currentTier === "basic" ||
        currentTier === "essential" ||
        currentTier === "pro" ? (
          <>
            <div className="text-3xl font-semibold text-foreground mt-2">
              Eligible
            </div>
            <div className="mb-6 text-sm invisible">dummy</div>
          </>
        ) : (
          <>
            <div className="text-3xl font-semibold text-foreground mt-2">
              3 services
            </div>
            <div className="mb-6 text-sm text-muted-foreground">to unlock</div>
          </>
        )}

        <div className="text-base  mb-2">Benefits</div>
        <div className="flex flex-row gap-2 items-center mb-2">
          <CheckIcon className="size-4 text-green-600" />
          Price Lock Guarantee (24 Months)
        </div>
        <div className="flex flex-row gap-2 items-center mb-2">
          <CheckIcon className="size-4 text-green-600" />
          Priority Response Within 8 Hours
        </div>
        <div className="flex flex-row gap-2 items-center">
          <CheckIcon className="size-4 text-green-600" />
          Priority Booking
        </div>
        {currentTier === "" && (
          <Button className="bg-neutral-300 text-neutral-800 hover:bg-neutral-300/90 cursor-pointer w-full mt-auto mb-8">
            <LockKeyholeIcon></LockKeyholeIcon> Unlock Tier
          </Button>
        )}
      </div>
      <div
        className={cn(
          " rounded-2xl p-4 flex-1 shadow-md min-h-[550px] min-w-[300px] w-full h-fit appear-up fade-up-300 flex flex-col",
          currentTier === "essential"
            ? "shadow-xl bg-linear-to-br from-[#ffdb01] via-[#ffdb01]/80 to-[#ffdb01]/70 border border-transparent text-neutral-800"
            : "border border-neutral-100"
        )}
      >
        {currentTier === "pro" && (
          <div className="pointer-events-none absolute inset-0 z-50 bg-secondary/40" />
        )}

        <div className="text-xl font-medium text-left">Essential</div>

        {currentTier === "essential" || currentTier === "pro" ? (
          <>
            <div className="text-3xl font-semibold text-foreground mt-2">
              Eligible
            </div>
            <div className="mb-6 text-sm invisible">dummy</div>
          </>
        ) : (
          <>
            <div className="text-3xl font-semibold text-foreground mt-2">
              4 services
            </div>
            <div className="mb-6 text-sm text-muted-foreground">to unlock</div>
          </>
        )}

        <div className="text-base mb-2">Benefits</div>
        <div className="flex flex-row gap-2 items-center mb-2">
          <CheckIcon className="size-4 text-green-600" />
          Price Lock Guarantee (24 Months)
        </div>
        <div className="flex flex-row gap-2 items-center mb-2">
          <CheckIcon className="size-4 text-green-600" />
          Priority Response Within 8 Hours
        </div>
        <div className="flex flex-row gap-2 items-center mb-2">
          <CheckIcon className="size-4 text-green-600" />
          Priority Booking
        </div>
        <div className="flex flex-row gap-2 items-center mb-2">
          <CheckIcon className="size-4 text-green-600" />
          Priority Booking
        </div>
        <div className="flex flex-row gap-2 items-center mb-2">
          <CheckIcon className="size-4 text-green-600" />
          Flexible 21-Day Payment Terms
        </div>
        <div className="flex flex-row gap-2 items-center mb-2">
          <CheckIcon className="size-4 text-green-600" />
          10% Discounts on Parts
        </div>
        <div className="flex flex-row gap-2 items-center mb-2">
          <CheckIcon className="size-4 text-green-600" />
          Service Pricing Discounts
        </div>
        {currentTier !== "essential" && currentTier !== "pro" && (
          <Button className="bg-[#ffdb01] text-neutral-800 hover:bg-[#ffdb01]/90 cursor-pointer w-full mt-auto mb-8 tier-header">
            <LockKeyholeIcon></LockKeyholeIcon> Unlock Tier
          </Button>
        )}
      </div>
      <div
        className={cn(
          " rounded-2xl p-4 flex-1 shadow-md min-h-[550px] min-w-[300px] w-full h-fit appear-up fade-up-400 flex flex-col",
          currentTier === "pro"
            ? "shadow-xl bg-linear-to-br from-efg-blue  via-efg-blue/95  to-efg-blue/90 text-white border border-transparent"
            : "border border-neutral-100"
        )}
      >
        <div className="text-xl font-medium text-left">Pro</div>

        {currentTier === "pro" ? (
          <>
            <div className="text-3xl font-semibold  mt-2">Eligible</div>
            <div className="mb-6 text-sm invisible">dummy</div>
          </>
        ) : (
          <>
            <div className="text-3xl font-semibold text-foreground mt-2">
              6 services
            </div>
            <div className="mb-6 text-sm text-muted-foreground">to unlock</div>
          </>
        )}
        <div className="text-base mb-2">Benefits</div>
        <div className="flex flex-row gap-2 items-center mb-2">
          <CheckIcon className="size-4 text-green-600" />
          Price Lock Guarantee (24 Months)
        </div>
        <div className="flex flex-row gap-2 items-center mb-2">
          <CheckIcon className="size-4 text-green-600" />
          Priority Response Within 8 Hours
        </div>
        <div className="flex flex-row gap-2 items-center mb-2">
          <CheckIcon className="size-4 text-green-600" />
          Priority Booking
        </div>
        <div className="flex flex-row gap-2 items-center mb-2">
          <CheckIcon className="size-4 text-green-600" />
          Priority Booking
        </div>
        <div className="flex flex-row gap-2 items-center mb-2">
          <CheckIcon className="size-4 text-green-600" />
          Flexible 21-Day Payment Terms
        </div>
        <div className="flex flex-row gap-2 items-center mb-2">
          <CheckIcon className="size-4 text-green-600" />
          10% Discounts on Parts
        </div>
        <div className="flex flex-row gap-2 items-center mb-2">
          <CheckIcon className="size-4 text-green-600" />
          Service Pricing Discounts
        </div>
        <div className="flex flex-row gap-2 items-center mb-2">
          <CheckIcon className="size-4 text-green-600" />
          Complimentary Odour Control (First 3 Months)
        </div>

        {currentTier != "pro" && (
          <Button
            className={cn(
              "relative bg-efg-blue text-white hover:bg-efg-blue/90 cursor-pointer w-full mt-auto mb-8 "
            )}
          >
            <LockKeyholeIcon></LockKeyholeIcon> Unlock Tier
          </Button>
        )}
      </div>
    </div>
  );
}

export default VibrantIncentiveCard;
