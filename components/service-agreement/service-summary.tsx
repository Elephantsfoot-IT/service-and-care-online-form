"use client";

/* ------------------------------ Imports ------------------------------ */
import { useServiceAgreementStore } from "@/app/service-agreement/service-agreement-store";
import { GetServicesReturnTyped, MaybeOption } from "@/lib/interface";
import {
  formatMoney,
  getDiscount,
  getServiceAnualCost,
  getServices,
  getNumber,
  getFrequencyValue,
} from "@/lib/utils";
import { useMemo } from "react";

/* ------------------------------ Helpers ------------------------------ */
function freqLabel(freq: MaybeOption) {
  if (!freq) return null;
  if (freq === "quarterly") return "Quarterly";
  if (freq === "six-monthly") return "Six-Monthly";
  if (freq === "yearly") return "Yearly";
  return null;
}

export function ServiceSummary() {
  const state = useServiceAgreementStore();

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

  // Gather items for each service type
  const chuteCleaningDetails = getServices(
    state.serviceAgreement?.sites ?? [],
    "chute_cleaning"
  ) as GetServicesReturnTyped<"chute_cleaning">;
  const equipmentMaintenanceDetails = getServices(
    state.serviceAgreement?.sites ?? [],
    "equipment_maintenance"
  ) as GetServicesReturnTyped<"equipment_maintenance">;
  const selfClosingHopperDoorInspectionDetails = getServices(
    state.serviceAgreement?.sites ?? [],
    "hopper_door_inspection"
  ) as GetServicesReturnTyped<"hopper_door_inspection">;
  const wasteRoomCleaningDetails = getServices(
    state.serviceAgreement?.sites ?? [],
    "waste_room_pressure_clean"
  ) as GetServicesReturnTyped<"waste_room_pressure_clean">;
  const binCleaningDetails = getServices(
    state.serviceAgreement?.sites ?? [],
    "bin_cleaning"
  ) as GetServicesReturnTyped<"bin_cleaning">;
  const odourControlDetails = getServices(
    state.serviceAgreement?.sites ?? [],
    "odour_control"
  ) as GetServicesReturnTyped<"odour_control">;

  /* ---------------- Annual costs per service ----------------
     All services use getServiceAnualCost(..., frequency) EXCEPT
     Odour Control: it is strictly SUM(units × unitPrice) with NO
     frequency multiplier. If frequency is not selected -> 0. */
  const chuteAnnual = getServiceAnualCost(
    chuteCleaningDetails.items,
    state.chuteCleaningFrequency
  );
  const equipAnnual = getServiceAnualCost(
    equipmentMaintenanceDetails.items,
    state.equipmentMaintenanceFrequency
  );
  const hopperAnnual = getServiceAnualCost(
    selfClosingHopperDoorInspectionDetails.items,
    state.selfClosingHopperDoorInspectionFrequency
  );
  const wasteAnnual = getServiceAnualCost(
    wasteRoomCleaningDetails.items,
    state.wasteRoomCleaningFrequency
  );
  const binAnnual = getServiceAnualCost(
    binCleaningDetails.items,
    state.binCleaningFrequency
  );

  // ✅ Correct odour control computation (units × unitPrice, no multiplier)
 
  const odourAnnual = useMemo(() => {
    if (!state.odourControlFrequency) return 0;
    return odourControlDetails.items.reduce((acc, r) => {
      const frequencyValue = getFrequencyValue(state.odourControlFrequency);
      const qty = state.odourControlUnits?.[r.id] ?? 0;
      const unitPrice = getNumber(r.price);
      return acc + qty * unitPrice * frequencyValue;
    }, 0);
  }, [
    state.odourControlFrequency,
    state.odourControlUnits,
    odourControlDetails.items,
  ]);

  // Totals + discount
  const discountPct = getDiscount(numberOfServices);
  const subtotal =
    chuteAnnual +
    equipAnnual +
    hopperAnnual +
    wasteAnnual +
    binAnnual +
    odourAnnual;

  const discountAmt = discountPct ? (subtotal * discountPct) / 100 : 0;
  const grandTotal = state.serviceAgreement?.incentives ? subtotal - discountAmt : subtotal;

  // Clean, headerless row
  const Row = ({
    label,
    freq,
    amount,
    hint,
    show,
  }: {
    label: string;
    freq: MaybeOption;
    amount: number;
    hint?: string;
    show: boolean;
  }) => {
    if (!show) return null;
    return (
      <div className="flex items-center justify-between gap-4 px-4 md:px-6 py-4 transition-colors">
        <div className="min-w-0">
          <div className="text-sm xl:text-base  text-neutral-900 truncate">{label}</div>
        </div>
        <div className="text-sm xl:text-base text-neutral-900">{formatMoney(amount)}</div>
      </div>
    );
  };

  return (
    <section className="flex flex-col border border-input rounded-lg shadow-sm overflow-hidden bg-white">
      <div className="divide-y divide-input">
        <Row
          label="Chute Cleaning"
          freq={state.chuteCleaningFrequency}
          amount={chuteAnnual}
          show={
            !!state.chuteCleaningFrequency &&
            chuteCleaningDetails.items.length > 0
          }
        />
        <Row
          label="Equipment Preventative Maintenance"
          freq={state.equipmentMaintenanceFrequency}
          amount={equipAnnual}
          show={
            !!state.equipmentMaintenanceFrequency &&
            equipmentMaintenanceDetails.items.length > 0
          }
        />
        <Row
          label="Self-Closing Hopper Door Inspection"
          freq={state.selfClosingHopperDoorInspectionFrequency}
          amount={hopperAnnual}
          show={
            !!state.selfClosingHopperDoorInspectionFrequency &&
            selfClosingHopperDoorInspectionDetails.items.length > 0
          }
        />
        <Row
          label="Waste Room Pressure Clean"
          freq={state.wasteRoomCleaningFrequency}
          amount={wasteAnnual}
          show={
            !!state.wasteRoomCleaningFrequency &&
            wasteRoomCleaningDetails.items.length > 0
          }
        />
        <Row
          label="Bin Cleaning"
          freq={state.binCleaningFrequency}
          amount={binAnnual}
          show={
            !!state.binCleaningFrequency && binCleaningDetails.items.length > 0
          }
        />
        <Row
          label="Odour Control"
          freq={state.odourControlFrequency}
          amount={odourAnnual}
          hint={state.odourControlFrequency ? "Units × price" : undefined}
          show={
            !!state.odourControlFrequency &&
            odourControlDetails.items.length > 0
          }
        />

        {/* Totals */}
        <div>
          {(discountPct > 0 && state.serviceAgreement?.incentives ) ? (
            <>
              <div className="flex justify-between text-sm xl:text-base text-emerald-600 px-4 md:px-6 pt-4 ">
                <span>Service discount ({discountPct}%)</span>
                <span className="font-medium">-{formatMoney(discountAmt)}</span>
              </div>

              <div className="flex justify-between items-baseline px-4 md:px-6 pb-4 border-b border-input">
                <span className="text-neutral-800 text-sm xl:text-base font-medium flex flex-col">
                  Annual cost <span className="font-normal text-xs xl:text-sm">(1 year, excl. GST)</span>
                </span>
                <div className="text-right">
                  <div className="text-sm xl:text-base line-through text-neutral-500">
                    {formatMoney(subtotal)}
                  </div>
                  <div className="text-lg font-medium text-neutral-900">
                    {formatMoney(grandTotal)}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-baseline px-4 md:px-6 py-6">
                <span className="text-neutral-800 text-sm xl:text-base font-medium flex flex-col">
                  Contract value{" "}
                  <span className="font-normal text-xs xl:text-sm">(2 years, excl. GST)</span>
                </span>
                <div className="text-lg font-medium text-neutral-900">
                  {formatMoney(grandTotal * 2)}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between items-baseline px-4 md:px-6 py-6">
                <span className="text-neutral-800 text-sm xl:text-base font-medium flex flex-col">
                  Annual cost{" "}
                  <span className="font-normal text-xs xl:text-sm">(1 year, excl. GST)</span>
                </span>
                <span className="text-base font-medium text-neutral-900">
                  {formatMoney(grandTotal)}
                </span>
              </div>

              <div className="flex justify-between items-baseline border-t border-input px-4 md:px-6 py-6">
                <span className="text-neutral-800 text-sm xl:text-base font-medium flex flex-col">
                  Contract value{" "}
                  <span className="font-normal text-xs xl:text-sm">(2 years, excl. GST)</span>
                </span>
                <span className="text-base font-medium text-neutral-900">
                  {formatMoney(grandTotal * 2)}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
