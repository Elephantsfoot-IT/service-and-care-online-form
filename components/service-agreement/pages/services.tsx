// ServicesForm.tsx
"use client";

import { useServiceAgreementStore } from "@/app/service-agreement/service-agreement-store";
import IncentiveTable from "@/components/service-agreement/incentive-table";
import { Button } from "@/components/ui/button";
import { GetServicesReturnTyped } from "@/lib/interface";
import { getDiscount, getServices, scrollToTop } from "@/lib/utils";
import { Label } from "@radix-ui/react-label";
import { format } from "date-fns-tz";
import { ArrowRightIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { HorizontalScroller } from "../scroll-indicator";
import { ServiceSummary } from "../service-summary";
import BinCleaningSection from "../services/bin-cleaning-section";
import ChuteCleaningSection from "../services/chute-cleaning-section";
import EquipmentMaintenanceSection from "../services/equipment-section";
import HopperDoorInspectionSection from "../services/hopper-door-section";
import OdourControlSection from "../services/odour-control-section";
import WasteRoomPressureCleanSection from "../services/waste-room-section";
import FloatingIncentives from "../floating-incentive";

function ServicesForm({ selectMore }: { selectMore: () => void }) {
  const state = useServiceAgreementStore();

  // Local UI flags
  const [showError, setShowError] = useState(false);
  const [odourQtyError, setOdourQtyError] = useState(false);

  // ------------------------------------------------------------------
  // Derived values (counts, tiers, discounts)
  // ------------------------------------------------------------------
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

  const desiredTier = useMemo(() => {
    if (numberOfServices === 3) return "basic";
    if (numberOfServices > 3 && numberOfServices < 6) return "essential";
    if (numberOfServices >= 6) return "premium";
    return "";
  }, [numberOfServices]);

  // ------------------------------------------------------------------
  // Initial scroll and error reset on change
  // ------------------------------------------------------------------
  useEffect(() => {
    scrollToTop();
  }, []);

  useEffect(() => {
    if (numberOfServices > 0) setShowError(false);
  }, [numberOfServices]);

  // ------------------------------------------------------------------
  // Normalize data per service type for the UI sections
  // ------------------------------------------------------------------
  const chuteCleaningDetails = getServices(
    state.serviceAgreement?.sites ?? [],
    "chute_cleaning"
  ) as GetServicesReturnTyped<"chute_cleaning">;

  const wasteRoomCleaningDetails = getServices(
    state.serviceAgreement?.sites ?? [],
    "waste_room_pressure_clean"
  ) as GetServicesReturnTyped<"waste_room_pressure_clean">;

  const selfClosingHopperDoorInspectionDetails = getServices(
    state.serviceAgreement?.sites ?? [],
    "hopper_door_inspection"
  ) as GetServicesReturnTyped<"hopper_door_inspection">;

  const binCleaningDetails = getServices(
    state.serviceAgreement?.sites ?? [],
    "bin_cleaning"
  ) as GetServicesReturnTyped<"bin_cleaning">;

  const equipmentMaintenanceDetails = getServices(
    state.serviceAgreement?.sites ?? [],
    "equipment_maintenance"
  ) as GetServicesReturnTyped<"equipment_maintenance">;

  const odourControlDetails = getServices(
    state.serviceAgreement?.sites ?? [],
    "odour_control"
  ) as GetServicesReturnTyped<"odour_control">;

  const discount = getDiscount(numberOfServices);

  // ------------------------------------------------------------------
  // Odour Control validation state (requires units when selected)
  // ------------------------------------------------------------------
  const odourNeedsUnits = !!state.odourControlFrequency;

  const hasMissingOdourQty = useMemo(() => {
    if (!odourNeedsUnits) return false;
    return odourControlDetails.items.some(
      (r) => (state.odourControlUnits[r.id] ?? 0) <= 0
    );
  }, [odourNeedsUnits, state.odourControlUnits, odourControlDetails.items]);

  useEffect(() => {
    if (!hasMissingOdourQty) setOdourQtyError(false);
  }, [hasMissingOdourQty]);

  // ------------------------------------------------------------------
  // Continue → basic validation + move to next page
  // ------------------------------------------------------------------
  const goNext = () => {
    // Require at least one selected service
    if (numberOfServices === 0) {
      setShowError(true);
      return;
    }

    // If Odour Control is selected, ensure every row has a positive unit
    if (odourNeedsUnits && hasMissingOdourQty) {
      setOdourQtyError(true);
      document
        .getElementById("odour_control")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    setShowError(false);
    state.setPage(2);
  };

  if (!state.serviceAgreement) return null;

  // ------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------
  return (
    <div className="flex flex-col gap-30 relative">
      {/* --------------------------------------------------------------
          Page header + customer and contract meta
      -------------------------------------------------------------- */}
      <div className="flex flex-col">
        <Label className="text-6xl ">
          <span className="text-efg-main">Service</span> Agreement{" "}
        </Label>

        <span className="text-base xl:text-lg text-neutral-500 font-normal mt-6">
          Thanks for choosing{" "}
          <span className="font-medium text-neutral-800">
            Elephants Foot Service & Care
          </span>
          . This form captures your sites and the services/frequencies you’d
          like so we can tailor a maintenance plan that keeps your building
          safe, compliant, and fresh. Once submitted, our team will confirm the
          details and next steps.
        </span>

        {/* Customer summary */}
        <div className="mt-2 text-sm xl:text-base bg-neutral-50 rounded-xl p-6 flex flex-col gap-2 mt-6 border border-input">
          <div className="flex flex-col sm:flex-row sm:gap-6">
            <div className="sm:w-1/3 flex-shrink-0 text-neutral-700">
              Customer
            </div>
            <div className="sm:w-2/3 flex-shrink-0 font-medium">
              {state.serviceAgreement?.quote_for}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:gap-6">
            <div className="sm:w-1/3 flex-shrink-0 text-neutral-700">
              Proposal Expiry Date
            </div>
            <div className="sm:w-2/3 flex-shrink-0  font-medium">
              {format(state.serviceAgreement.expire_at, "dd/MM/yyyy")}
            </div>
          </div>
        </div>

        {/* Support contacts */}
        <div className="mt-2 ml-1 text-sm xl:text-base text-neutral-500">
          If this isn’t you, please contact us at{" "}
          <a href="tel:1300435374" className="underline">
            1300 435 374
          </a>{" "}
          or{" "}
          <a href="mailto:service@elephantsfoot.com.au" className="underline">
            service@elephantsfoot.com.au
          </a>
        </div>

        {/* Contract duration card */}
        <div className=" mt-4 border border-input rounded-xl  mt-6">
          <div className="text-sm xl:text-base font-medium bg-neutral-50 p-6 rounded-t-xl border-b border-input">
            Contract Duration
          </div>
          <div className="p-6 flex flex-col gap-3">
            <div className="flex flex-row items-center gap-6 justify-between ">
              <div className="flex flex-col gap-1.5 flex-shrink-0">
                <Label className="text-sm xl:text-base text-muted-foreground">
                  Contract Start Date
                </Label>
                <span className="text-base xl:text-lg font-medium  leading-tight">
                  {format(state.serviceAgreement.start_date, "dd MMM yyyy")}
                </span>
              </div>
              <hr className="flex-1 border-input" />
              <div className="flex flex-col gap-1.5 flex-shrink-0">
                <Label className="text-sm xl:text-base  text-muted-foreground">
                  Contract End Date
                </Label>
                <span className="text-base xl:text-lg font-medium  leading-tight">
                  {format(state.serviceAgreement.end_date, "dd MMM yyyy")}
                </span>
              </div>
            </div>
            <div className="text-neutral-500">
              *The dates shown above are indicative only. The contract term
              shall commence on the date of agreement signature and continue for
              two 2 years.
            </div>
          </div>
        </div>
      </div>

      {/* --------------------------------------------------------------
          Service sections (each encapsulated component)
      -------------------------------------------------------------- */}

      <ChuteCleaningSection
        details={chuteCleaningDetails}
        frequency={state.chuteCleaningFrequency}
        onChangeFrequency={state.setChuteCleaningFrequency}
        discount={discount}
        incentives={state.serviceAgreement.incentives}
      />

      <EquipmentMaintenanceSection
        details={equipmentMaintenanceDetails}
        frequency={state.equipmentMaintenanceFrequency}
        onChangeFrequency={state.setEquipmentMaintenanceFrequency}
        discount={discount}
        incentives={state.serviceAgreement.incentives}
      />

      <HopperDoorInspectionSection
        details={selfClosingHopperDoorInspectionDetails}
        frequency={state.selfClosingHopperDoorInspectionFrequency}
        onChangeFrequency={state.setSelfClosingHopperDoorInspectionFrequency}
        discount={discount}
        incentives={state.serviceAgreement.incentives}
      />

      <WasteRoomPressureCleanSection
        details={wasteRoomCleaningDetails}
        frequency={state.wasteRoomCleaningFrequency}
        onChangeFrequency={state.setWasteRoomCleaningFrequency}
        discount={discount}
        incentives={state.serviceAgreement.incentives}
      />

      <BinCleaningSection
        details={binCleaningDetails}
        frequency={state.binCleaningFrequency}
        onChangeFrequency={state.setBinCleaningFrequency}
        discount={discount}
        incentives={state.serviceAgreement.incentives}
      />

      <OdourControlSection
        details={odourControlDetails}
        frequency={state.odourControlFrequency}
        onChangeFrequency={state.setOdourControlFrequency}
        discount={discount}
        incentives={state.serviceAgreement.incentives}
        odourQtyError={odourQtyError}
        odourNeedsUnits={odourNeedsUnits}
        odourUnits={state.odourControlUnits}
        setUnit={state.setOdourControlUnit}
      />

      {/* --------------------------------------------------------------
          Incentives + summary + navigation
      -------------------------------------------------------------- */}
      <div className="flex flex-col gap-20">
        {state.serviceAgreement.incentives && (
          <section
            id="rewards"
            className="flex flex-col gap-6 scroll-mt-[140px] mt-10"
          >
            <div className="flex flex-col">
              <Label className="text-2xl xl:text-3xl font-normal mb-1">
                Complimentary Incentives
              </Label>
              <span className="text-base xl:text-lg text-neutral-500">
                Add services to unlock and redeem complimentary incentives from
                us — at no extra cost.
              </span>
            </div>

            <HorizontalScroller
              initialTargetSelector={
                desiredTier ? `[data-col="${desiredTier}"]` : undefined
              }
              scrollKey={desiredTier}
              className="p-1"
            >
              <div className="min-w-[900px] ">
                <IncentiveTable
                  serviceCount={numberOfServices}
                  selectMore={selectMore}
                />
              </div>
            </HorizontalScroller>
          </section>
        )}

        {/* Summary */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col">
            <Label className="text-2xl xl:text-3xl mb-1">Service Summary</Label>
            <span className="ttext-lg text-neutral-500">
              Review your service plan and the total cost.
            </span>
          </div>
          <ServiceSummary />
        </div>

        {/* Validation message */}
        {showError && (
          <div className="text-destructive text-sm">
            Choose at least 1 service to proceed.
          </div>
        )}

        {/* Continue CTA */}
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

      <FloatingIncentives
        serviceCount={numberOfServices}
        selectMore={selectMore}
      />
    </div>
  );
}

export default ServicesForm;
