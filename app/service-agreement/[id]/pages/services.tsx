// ServicesForm.tsx
"use client";
import IncentiveTable from "@/components/service-agreement/incentive-table";
import ServiceFrequency2 from "@/components/service-agreement/service-frequency-2";
import { Button } from "@/components/ui/button";
import { options } from "@/lib/interface";
import { scrollToTop } from "@/lib/utils";
import { Label } from "@radix-ui/react-label";
import { ArrowRightIcon, InfoIcon } from "lucide-react";
import { useEffect } from "react";
import { useServiceAgreementStore } from "../../service-agreement-store";
import { useMemo } from "react";
import { useState } from "react";

function ServicesForm() {
  const state = useServiceAgreementStore();
  const [showError, setShowError] = useState(false);

  const numberOfServices = useMemo(() => {
    const vals = [
      state.chuteCleaningFrequency,
      state.equipmentMaintenanceFrequency,
      state.wasteRoomCleaningFrequency,
      state.odourControlFrequency,
      state.selfClosingHopperDoorInspectionFrequency,
      state.binCleaningFrequency,
    ];
    return vals.filter((v): v is NonNullable<typeof v> => v != null).length;
  }, [
    state.chuteCleaningFrequency,
    state.equipmentMaintenanceFrequency,
    state.wasteRoomCleaningFrequency,
    state.odourControlFrequency,
    state.selfClosingHopperDoorInspectionFrequency,
    state.binCleaningFrequency,
  ]);

  useEffect(() => {
    scrollToTop();
  }, []);

  const goNext = () => {
    if (numberOfServices === 0) {
      setShowError(true);
    } else {
      setShowError(false);
      state.setPage(2);
    }
  };

  if (!state.serviceAgreement) return null;

  return (
    <div className="flex flex-col gap-16">
      {/* Chute Cleaning */}
      <section
        id="chute-cleaning"
        className="flex flex-col gap-6 scroll-mt-[140px]"
      >
        
        <div className="flex flex-col">
          <Label className="text-xl font-medium flex flex-row items-center gap-2">
            Chute Cleaning{" "}
            <a
              href="https://www.elephantsfoot.com.au/chute-cleaning/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open help in a new tab"
              className="inline-flex items-center"
            >
              <InfoIcon className="size-4 text-neutral-500 hover:text-neutral-700" />
            </a>
          </Label>
          <span className="text-base text-neutral-500">
            Chute cleaning that removes grime, mould, and odours—keeping
            multi-storey buildings hygienic and safe.
          </span>
        </div>
        <ServiceFrequency2
          value={state.chuteCleaningFrequency}
          onChange={state.setChuteCleaningFrequency}
          options={options}
        />
        <div className="border border-neutral-200 h-[500px] w-full rounded-md shadow-xs" />
      </section>

      {/* Waste Room Pressure Clean */}
      <section
        id="waste-room-pressure-clean"
        className="flex flex-col gap-6 scroll-mt-[140px]"
      >
        <div className="flex flex-col">
          <Label className="text-xl font-medium flex flex-row items-center gap-2">
            Waste Room Pressure Clean
            <a
              href="https://www.elephantsfoot.com.au/waste-room-restoration/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open help in a new tab"
              className="inline-flex items-center"
            >
              <InfoIcon className="size-4 text-neutral-500 hover:text-neutral-700" />
            </a>
          </Label>
          <span className="text-base text-neutral-500">
            High-pressure cleaning for hygienic, odour-free waste rooms.
          </span>
        </div>
        <ServiceFrequency2
          value={state.wasteRoomCleaningFrequency}
          onChange={state.setWasteRoomCleaningFrequency}
          options={options}
        />
        <div className="border border-neutral-200 h-[500px] w-full rounded-md shadow-xs" />
      </section>

      {/* Self-Closing Hopper Door Inspection */}
      <section
        id="hopper-door-inspection"
        className="flex flex-col gap-6 scroll-mt-[140px]"
      >
        <div className="flex flex-col">
          <Label className="text-xl font-medium flex flex-row items-center gap-2">
            Self-Closing Hopper Door Inspection
            <a
              href="https://www.elephantsfoot.com.au/chute-door-inspection/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open help in a new tab"
              className="inline-flex items-center"
            >
              <InfoIcon className="size-4 text-neutral-500 hover:text-neutral-700" />
            </a>
          </Label>
          <span className="text-base text-neutral-500">
            Chute-door inspections to ensure fire safety and compliance.
          </span>
        </div>
        <ServiceFrequency2
          value={state.selfClosingHopperDoorInspectionFrequency}
          onChange={state.setSelfClosingHopperDoorInspectionFrequency}
          options={options}
        />

        <div className="border border-neutral-200 h-[500px] w-full rounded-md shadow-xs" />
      </section>

      {/* Bin Cleaning */}
      <section
        id="bin-cleaning"
        className="flex flex-col gap-6 scroll-mt-[140px]"
      >
        <div className="flex flex-col">
          <Label className="text-xl font-medium flex flex-row items-center gap-2">
            Bin Cleaning
            <a
              href="https://www.elephantsfoot.com.au/service-care/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open help in a new tab"
              className="inline-flex items-center"
            >
              <InfoIcon className="size-4 text-neutral-500 hover:text-neutral-700" />
            </a>
          </Label>
          <span className="text-base text-neutral-500">
            Thorough bin cleaning to reduce odours, pests, and bacteria.
          </span>
        </div>
        <ServiceFrequency2
          value={state.binCleaningFrequency}
          onChange={state.setBinCleaningFrequency}
          options={options}
        />

        <div className="border border-neutral-200 h-[500px] w-full rounded-md shadow-xs" />
      </section>

      {/* Equipment Preventative Maintenance */}
      <section
        id="equipment-preventative-maintenance"
        className="flex flex-col gap-6 scroll-mt-[140px]"
      >
        <div className="flex flex-col">
          <Label className="text-xl font-medium flex flex-row items-center gap-2">
            Equipment Preventative Maintenance
            <a
              href="https://www.elephantsfoot.com.au/preventative-maintenance/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open help in a new tab"
              className="inline-flex items-center"
            >
              <InfoIcon className="size-4 text-neutral-500 hover:text-neutral-700" />
            </a>
          </Label>
          <span className="text-base text-neutral-500">
            Keep compactors and related equipment safe, compliant, and
            efficient.
          </span>
        </div>
        <ServiceFrequency2
          value={state.equipmentMaintenanceFrequency}
          onChange={state.setEquipmentMaintenanceFrequency}
          options={options}
        />

        <div className="border border-neutral-200 h-[500px] w-full rounded-md shadow-xs" />
      </section>

      {/* Odour Control */}
      <section
        id="odour-control"
        className="flex flex-col gap-6 scroll-mt-[140px]"
      >
        <div className="flex flex-col">
          <Label className="text-xl font-medium flex flex-row items-center gap-2">
            Odour Control
            <a
              href="https://www.elephantsfoot.com.au/odour-management/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open help in a new tab"
              className="inline-flex items-center"
            >
              <InfoIcon className="size-4 text-neutral-500 hover:text-neutral-700" />
            </a>
          </Label>
          <span className="text-base text-neutral-500">
            Targeted odour management to keep shared areas fresh.
          </span>
        </div>
        <ServiceFrequency2
          value={state.odourControlFrequency}
          onChange={state.setOdourControlFrequency}
          options={options.filter((option) => option.value === "quarterly")}
        />

        <div className="border border-neutral-200 h-[500px] w-full rounded-md shadow-xs" />
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

        <div className="overflow-x-auto p-1">
          <IncentiveTable serviceCount={numberOfServices} />
        </div>
      </section>

      {showError && (
        <div className="text-destructive text-sm">
          Choose at least 1 service to proceed.
        </div>
      )}

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
