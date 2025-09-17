// ServicesForm.tsx
"use client";
import { useEffect } from "react";
import { Label } from "@radix-ui/react-label";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import { scrollToTop } from "@/lib/utils";
import { useServiceAgreementStore } from "../../service-agreement-store";
import IncentiveTable from "@/components/service-agreement/incentive-table";

function ServicesForm() {
  const state = useServiceAgreementStore();

  useEffect(() => {
    scrollToTop();
  }, []);

  if (!state.serviceAgreement) return null;

  const goNext = () => state.setPage(2);

  return (
    <div className="flex flex-col gap-16">
      {/* Chute Cleaning */}
      <section
        id="chute-cleaning"
        className="flex flex-col gap-6 scroll-mt-[140px]"
      >
        <div className="flex flex-col">
          <Label className="text-xl font-medium">Chute Cleaning</Label>
          <span className="text-base text-neutral-500">
            Chute cleaning that removes grime, mould, and odours—keeping
            multi-storey buildings hygienic and safe.
          </span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-neutral-100 h-[100px] rounded-md" />
          <div className="bg-neutral-100 h-[100px] rounded-md" />
          <div className="bg-neutral-100 h-[100px] rounded-md" />
        </div>
        <div className="bg-neutral-100 h-[500px] w-full rounded-md" />
      </section>

      {/* Waste Room Pressure Clean */}
      <section
        id="waste-room-pressure-clean"
        className="flex flex-col gap-6 scroll-mt-[140px]"
      >
        <div className="flex flex-col">
          <Label className="text-xl font-medium">
            Waste Room Pressure Clean
          </Label>
          <span className="text-base text-neutral-500">
            High-pressure cleaning for hygienic, odour-free waste rooms.
          </span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-neutral-100 h-[100px] rounded-md" />
          <div className="bg-neutral-100 h-[100px] rounded-md" />
          <div className="bg-neutral-100 h-[100px] rounded-md" />
        </div>
        <div className="bg-neutral-100 h-[500px] w-full rounded-md" />
      </section>

      {/* Self-Closing Hopper Door Inspection */}
      <section
        id="hopper-door-inspection"
        className="flex flex-col gap-6 scroll-mt-[140px]"
      >
        <div className="flex flex-col">
          <Label className="text-xl font-medium">
            Self-Closing Hopper Door Inspection
          </Label>
          <span className="text-base text-neutral-500">
            Chute-door inspections to ensure fire safety and compliance.
          </span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-neutral-100 h-[100px] rounded-md" />
          <div className="bg-neutral-100 h-[100px] rounded-md" />
          <div className="bg-neutral-100 h-[100px] rounded-md" />
        </div>
        <div className="bg-neutral-100 h-[500px] w-full rounded-md" />
      </section>

      {/* Bin Cleaning */}
      <section
        id="bin-cleaning"
        className="flex flex-col gap-6 scroll-mt-[140px]"
      >
        <div className="flex flex-col">
          <Label className="text-xl font-medium">Bin Cleaning</Label>
          <span className="text-base text-neutral-500">
            Thorough bin cleaning to reduce odours, pests, and bacteria.
          </span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-neutral-100 h-[100px] rounded-md" />
          <div className="bg-neutral-100 h-[100px] rounded-md" />
          <div className="bg-neutral-100 h-[100px] rounded-md" />
        </div>
        <div className="bg-neutral-100 h-[500px] w-full rounded-md" />
      </section>

      {/* Equipment Preventative Maintenance */}
      <section
        id="equipment-preventative-maintenance"
        className="flex flex-col gap-6 scroll-mt-[140px]"
      >
        <div className="flex flex-col">
          <Label className="text-xl font-medium">
            Equipment Preventative Maintenance
          </Label>
          <span className="text-base text-neutral-500">
            Keep compactors and related equipment safe, compliant, and
            efficient.
          </span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-neutral-100 h-[100px] rounded-md" />
          <div className="bg-neutral-100 h-[100px] rounded-md" />
          <div className="bg-neutral-100 h-[100px] rounded-md" />
        </div>
        <div className="bg-neutral-100 h-[500px] w-full rounded-md" />
      </section>

      {/* Odour Control */}
      <section
        id="odour-control"
        className="flex flex-col gap-6 scroll-mt-[140px]"
      >
        <div className="flex flex-col">
          <Label className="text-xl font-medium">Odour Control</Label>
          <span className="text-base text-neutral-500">
            Targeted odour management to keep shared areas fresh.
          </span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-neutral-100 h-[100px] rounded-md" />
          <div className="bg-neutral-100 h-[100px] rounded-md" />
          <div className="bg-neutral-100 h-[100px] rounded-md" />
        </div>
        <div className="bg-neutral-100 h-[500px] w-full rounded-md" />
      </section>

      {/* Exclusive Benefits */}
      <section id="reward" className="flex flex-col gap-6 scroll-mt-[140px]">
        <div className="flex flex-col">
          <Label className="text-xl font-medium">Exclusive Benefits</Label>
          <span className="text-base text-neutral-500">
            Enjoy our exclusive benefits when you choose additional services
            with us.
          </span>
        </div>
        <div className="w-full overflow-x-auto flex flex-col gap-4">
          <div className="w-full min-w-[820px] scroll-mt-[140px]">
            <IncentiveTable currentTier={"essential"} serviceCount={4} />
          </div>
        </div>
      </section>

      {/* Continue */}
      <div className="w-full flex justify-end mt-16">
        <Button
          variant="efg"
          className="cursor-pointer w-[200px]"
          onClick={goNext}
        >
          Continue <ArrowRightIcon />
        </Button>
      </div>
    </div>
  );
}

export default ServicesForm;
