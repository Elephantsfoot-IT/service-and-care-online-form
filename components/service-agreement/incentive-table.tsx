import { cn } from "@/lib/utils";
import {
  CheckCircle,
  CheckCircle2Icon,
  CheckIcon,
  LockKeyholeIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

interface IncentiveTableProps {
  currentTier: string;
  serviceCount: number;
}

function IncentiveTable({ currentTier, serviceCount }: IncentiveTableProps) {
  return (
    <div className="flex flex-col gap-6 fade-up w-full text-sm">
      {/* <div className="w-full grid grid-cols-6 mb-4">
        <div className="col-span-3"></div>
        <div
          className={cn(
            "col-span-3 h-8 bg-neutral-200  overflow-hidden ",
      
          )}
        >
          <div
            className={cn(
              "h-full  transition-all duration-300",
              serviceCount === 0 && "w-[0%] bg-[#ffdb01]",
              serviceCount === 1 && "w-[11.1%] bg-[#ffdb01]",
              serviceCount === 2 && "w-[22.2%] bg-[#ffdb01]",
              serviceCount === 3 && "w-[33.3%] bg-[#ffdb01]",
              serviceCount === 4 && "w-[66.7%] bg-[#ffdb01]",
              serviceCount === 5 && "w-[83.3%] bg-[#ffdb01]",
              serviceCount === 6 && "w-[100%] bg-[#ffdb01]"
            )}
          ></div>
        </div>
      </div> */}

      <div className="w-full grid grid-cols-9">
        {/* Incentives column */}
        <div className="col-span-3  border-neutral-200 border-solid">
          <div className="h-18 border-b border-neutral-200 border-solid font-medium flex justify-start items-center px-2 tex">
            Incentives
          </div>
          <div className="h-14 border-b border-neutral-200 border-solid flex justify-start items-center px-4">
            Price Lock Guarantee (24 Months)
          </div>
          <div className="h-14 border-b border-neutral-200 border-solid flex justify-start items-center px-4">
            Priority Response Within 8 Hours
          </div>
          <div className="h-14 border-b border-neutral-200 border-solid flex justify-start items-center px-4">
            Priority Booking
          </div>
          <div className="h-14 border-b border-neutral-200 border-solid flex justify-start items-center px-4">
            Flexible 21-Day Payment Terms
          </div>
          <div className="h-14 border-b border-neutral-200 border-solid flex justify-start items-center px-4">
            Discounts on Parts
          </div>
          <div className="h-14 border-b border-neutral-200 border-solid flex justify-start items-center px-4">
            Service Pricing Discounts
          </div>
          <div className="h-14 border-b flex justify-start items-center px-4">
            Complimentary Odour Control (First 3 Months)
          </div>
          <div className="h-14 border-none flex justify-start items-center px-4"></div>
        </div>

        {/* Basic tier */}
        <div className="col-span-2  border-solid transition-all duration-300 relative">
          {currentTier === "basic" && (
            <div className="pointer-events-none absolute inset-0 z-0 border-2 border-neutral-300 bg-neutral-300/20 " />
          )}
          {(currentTier === "essential" || currentTier === "pro") && (
            <div className="pointer-events-none absolute inset-0 z-50 bg-neutral-300/20" />
          )}

          <div
            className={cn(
              "h-18 border-b border-neutral-200 border-solid font-medium flex justify-center items-center relative transition-all duration-300 ",
              currentTier === "basic" && "bg-neutral-300 tier-header"
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
              <span className="text-base">Basic</span>
              <span className="text-xs text-neutral-600">Req. 3 services</span>
            </div>
          </div>
          <div className="h-14 border-b border-neutral-200 border-solid flex justify-center items-center">
          <CheckCircleIcon className="size-6 text-green-600" />
          </div>
          <div className="h-14 border-b border-neutral-200 border-solid flex justify-center items-center">
          <CheckCircleIcon className="size-6 text-green-600" />
          </div>
          <div className="h-14 border-b border-neutral-200 border-solid flex justify-center items-center">
          <CheckCircleIcon className="size-6 text-green-600" />
          </div>
          <div className="h-14 border-b border-neutral-200 border-solid flex justify-center items-center"></div>
          <div className="h-14 border-b border-neutral-200 border-solid flex justify-center items-center"></div>
          <div className="h-14 border-b border-neutral-200 border-solid flex justify-center items-center"></div>
          <div className="h-14 border-b flex justify-center items-center"></div>
          <div className="h-14 border-none flex justify-center items-center">
            {currentTier !== "basic" &&
              currentTier !== "essential" &&
              currentTier !== "pro" && (
                <Button className="bg-neutral-300 text-black hover:bg-neutral-300/90 cursor-pointer ">
                  <LockKeyholeIcon></LockKeyholeIcon> Unlock Tier
                </Button>
              )}
              {currentTier === "basic" && (
              <div className="font-medium">Eligible</div>
            )}
          </div>
        </div>

        {/* Essential tier */}
        <div className="col-span-2  border-solid transition-all duration-300 relative">
          {currentTier === "essential" && (
            <div className="pointer-events-none absolute inset-0 z-30 border-2 border-[#ffdb01] bg-[#ffdb01]/5 " />
          )}
          {currentTier === "pro" && (
            <div className="pointer-events-none absolute inset-0 z-50 bg-neutral-300/20" />
          )}

          <div
            className={cn(
              "h-18 border-solid font-medium flex justify-center items-center relative transition-all duration-300 ",
              currentTier === "essential"
                ? "bg-[#ffdb01] text-black tier-header border-b-[#ffdb01]"
                : " border-b border-neutral-200"
            )}
          >
            <div className="relative z-10 flex flex-col items-center">
              <span className="text-base">Essential</span>
              <span className="text-xs text-neutral-600">Req. 4 services</span>
            </div>
          </div>
          <div className="h-14 border-b border-neutral-200 border-solid flex justify-center items-center">
          <CheckCircleIcon className="size-6 text-green-600" />
          </div>
          <div className="h-14 border-b border-neutral-200 border-solid flex justify-center items-center">
          <CheckCircleIcon className="size-6 text-green-600" />
          </div>
          <div className="h-14 border-b border-neutral-200 border-solid flex justify-center items-center">
          <CheckCircleIcon className="size-6 text-green-600" />
          </div>
          <div className="h-14 border-b border-neutral-200 border-solid flex justify-center items-center">
          <CheckCircleIcon className="size-6 text-green-600" />
          </div>
          <div className="h-14 border-b border-neutral-200 border-solid flex justify-center items-center">
            10%
          </div>
          <div className="h-14 border-b border-neutral-200 border-solid flex justify-center items-center">
          <CheckCircleIcon className="size-6 text-green-600" />
          </div>
          <div className="h-14 border-b flex justify-center items-center"></div>
          <div className="h-14 border-none flex justify-center items-center">
            {currentTier !== "essential" && currentTier !== "pro" && (
              <Button className="bg-[#ffdb01] text-black hover:bg-[#ffdb01]/90 cursor-pointer tier-header">
                <LockKeyholeIcon></LockKeyholeIcon> Unlock Tier
              </Button>
            )}
            {currentTier === "essential" && (
              <div className="font-medium">Eligible</div>
            )}
          </div>
        </div>

        {/* Pro tier */}
        <div className="col-span-2  border-solid transition-all duration-300 relative">
          {currentTier === "pro" && (
            <div className="pointer-events-none absolute inset-0 z-30 border-2 border-[#1e60ad] bg-blue-400/5 " />
          )}

          <div
            className={cn(
              "h-18 border-solid font-medium flex justify-center items-center relative transition-all duration-300 ",
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
              <span className="text-base">Pro</span>
              <span className="text-xs text-neutral-600">Req. 6 services</span>
            </div>
          </div>
          <div className="h-14 border-b border-neutral-200 border-solid flex justify-center items-center">
            <CheckCircleIcon className="size-6 text-green-600" />
          </div>
          <div className="h-14 border-b border-neutral-200 border-solid flex justify-center items-center">
            <CheckCircleIcon className="size-6 text-green-600" />
          </div>
          <div className="h-14 border-b border-neutral-200 border-solid flex justify-center items-center">
            <CheckCircleIcon className="size-6 text-green-600" />
          </div>
          <div className="h-14 border-b border-neutral-200 border-solid flex justify-center items-center">
            <CheckCircleIcon className="size-6 text-green-600" />
          </div>
          <div className="h-14 border-b border-neutral-200 border-solid flex justify-center items-center">
            15%
          </div>
          <div className="h-14 border-b border-neutral-200 border-solid flex justify-center items-center">
            <CheckCircleIcon className="size-6 text-green-600" />
          </div>
          <div className="h-14 border-b flex justify-center items-center">
            <CheckCircleIcon className="size-6 text-green-600" />
          </div>
          <div className="h-14 border-none flex justify-center items-center">
            {currentTier != "pro" && (
              <Button
                className={cn(
                  "relative bg-[#1e60ad] text-white hover:bg-[#1e60ad]/90 cursor-pointer"
                )}
              >
                <LockKeyholeIcon></LockKeyholeIcon> Unlock Tier
              </Button>
            )}
            {currentTier === "pro" && (
              <div className="font-medium">Eligible</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default IncentiveTable;
