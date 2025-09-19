import { cn } from "@/lib/utils";
import { CheckIcon, LockKeyholeIcon } from "lucide-react";
import { Button } from "../ui/button";

type Tier = "none" | "basic" | "essential" | "pro";

interface IncentiveCardProps {
  currentTier: Tier; // pass "none" if nothing unlocked yet
}

type TierConfig = {
  id: Exclude<Tier, "none">;
  label: string;
  unlockServices: number;
  headerClassesWhenActive: string;
  cardClassesWhenActive: string;
  // optional dim overlay when a higher tier is unlocked
  dimWhenHigher?: boolean;
  benefits: string[];
};

const TIERS: TierConfig[] = [
  {
    id: "basic",
    label: "Basic",
    unlockServices: 3,
    headerClassesWhenActive: "text-foreground",
    cardClassesWhenActive:
      "shadow-xl bg-gradient-to-tr from-neutral-300/50 to-neutral-300/10 border border-neutral-300 ring-2 ring-neutral-300",
    dimWhenHigher: true,
    benefits: [
      "Price Lock Guarantee (24 Months)",
      "Priority Response Within 8 Hours",
      "Priority Booking",
    ],
  },
  {
    id: "essential",
    label: "Essential",
    unlockServices: 4,
    headerClassesWhenActive: "text-neutral-800",
    cardClassesWhenActive:
      "shadow-xl bg-gradient-to-tr from-yellow-300/50 to-yellow-300/10 from-[50%] border border-[#ffdb01] ring-2 ring-[#ffdb01]",
    dimWhenHigher: true,
    benefits: [
      "Price Lock Guarantee (24 Months)",
      "Priority Response Within 8 Hours",
      "Priority Booking",
      "Flexible 21-Day Payment Terms",
      "10% Discounts on Parts",
      "Service Pricing Discounts",
    ],
  },
  {
    id: "pro",
    label: "Pro",
    unlockServices: 6,
    headerClassesWhenActive: "text-white",
    cardClassesWhenActive:
      "shadow-xl bg-gradient-to-tr from-blue-400/50 to-blue-500/10 from-[40%] border border-[#1e60ad] ring-2 ring-[#1e60ad] text-white",
    benefits: [
      "Price Lock Guarantee (24 Months)",
      "Priority Response Within 8 Hours",
      "Priority Booking",
      "Flexible 21-Day Payment Terms",
      "10% Discounts on Parts",
      "Service Pricing Discounts",
      "Complimentary Odour Control (First 3 Months)",
    ],
  },
];

const tierRank: Record<Tier, number> = {
  none: 0,
  basic: 1,
  essential: 2,
  pro: 3,
};

function TierCard({
  tier,
  currentTier,
}: {
  tier: TierConfig;
  currentTier: Tier;
}) {
  const isActive = tier.id === currentTier;
  const currentRank = tierRank[currentTier];
  const myRank = tierRank[tier.id];
  const isLocked = currentRank < myRank;
  const shouldDim = !isActive && tier.dimWhenHigher && currentRank > myRank;

  return (
    <div
      className={cn(
        "relative rounded-2xl p-4 flex-1 shadow-md min-h-[550px] min-w-[300px] w-full h-fit appear-up flex flex-col",
        // staggered: you can add fade-up-* outside if needed
        isActive ? tier.cardClassesWhenActive : "border border-neutral-100"
      )}
    >
      {shouldDim && (
        <div className="pointer-events-none absolute inset-0 z-50 bg-neutral-75/40" />
      )}

      <div className={cn("text-xl font-medium text-left", isActive && tier.headerClassesWhenActive)}>
        {tier.label}
      </div>

      {/* Status / unlock requirement */}
      {isLocked ? (
        <>
          <div className="text-3xl font-semibold text-foreground mt-2">
            {tier.unlockServices} services
          </div>
          <div className="mb-6 text-sm text-muted-foreground">to unlock</div>
        </>
      ) : (
        <>
          <div className="text-3xl font-semibold mt-2">Eligible</div>
          <div className="mb-6 text-sm invisible">placeholder</div>
        </>
      )}

      {/* Benefits */}
      <div className="text-base mb-2">Benefits</div>
      <ul className="space-y-2">
        {tier.benefits.map((b) => (
          <li key={b} className="flex flex-row gap-2 items-center">
            <CheckIcon className="size-4 text-green-600" />
            {b}
          </li>
        ))}
      </ul>

      {/* Unlock button */}
      {isLocked && (
        <Button
          className={cn(
            "w-full mt-auto mb-8 cursor-pointer",
            tier.id === "basic" && "bg-neutral-300 text-neutral-800 hover:bg-neutral-300/90",
            tier.id === "essential" && "bg-[#ffdb01] text-neutral-800 hover:bg-[#ffdb01]/90 ",
            tier.id === "pro" && "bg-[#1e60ad] text-white hover:bg-[#1e60ad]/90"
          )}
        >
          <LockKeyholeIcon className="mr-2" />
          Unlock Tier
        </Button>
      )}
    </div>
  );
}

export default function IncentiveCard({ currentTier }: IncentiveCardProps) {
  return (
    <div className="flex flex-row gap-6 w-full py-10 items-center">
      <div className="appear-up fade-up-200 flex-1">
        <TierCard tier={TIERS[0]} currentTier={currentTier} />
      </div>
      <div className="appear-up fade-up-300 flex-1">
        <TierCard tier={TIERS[1]} currentTier={currentTier} />
      </div>
      <div className="appear-up fade-up-400 flex-1">
        <TierCard tier={TIERS[2]} currentTier={currentTier} />
      </div>
    </div>
  );
}
