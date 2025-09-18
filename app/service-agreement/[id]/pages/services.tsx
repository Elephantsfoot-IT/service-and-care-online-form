// ServicesForm.tsx
"use client";

import IncentiveTable from "@/components/service-agreement/incentive-table";
import ServiceFrequency2 from "@/components/service-agreement/service-frequency-2";
import { Button } from "@/components/ui/button";
import { GetServicesReturnTyped, options } from "@/lib/interface";
import {
  formatMoney,
  getDiscount,
  getNumber,
  getServices,
  getServicesValue,
  scrollToTop,
} from "@/lib/utils";
import { Label } from "@radix-ui/react-label";
import { ArrowRightIcon, InfoIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useServiceAgreementStore } from "../../service-agreement-store";

/* ---------- Small helpers (do NOT touch your service grids) ---------- */

function SectionShell({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="flex flex-col gap-6 scroll-mt-[140px] border border-input rounded-lg overflow-hidden shadow-xs"
    >
      {children}
    </section>
  );
}

function SectionHeader({
  title,
  description,
  helpHref,
}: {
  title: string;
  description: string;
  helpHref?: string;
}) {
  return (
    <div className="flex flex-col bg-neutral-50 p-4 md:p-6 2xl:p-8 border-b border-input">
      <Label className="text-xl font-medium flex flex-row items-center gap-2">
        {title}
        {helpHref && (
          <a
            href={helpHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open help in a new tab"
            className="inline-flex items-center"
          >
            <InfoIcon className="size-4 text-neutral-500 hover:text-neutral-700" />
          </a>
        )}
      </Label>
      <span className="text-base text-neutral-500">{description}</span>
    </div>
  );
}

/* ---------- Reusable footer for pricing (handles discount UI) ---------- */
function PricingFooter({
  items,
  frequency,
  discountPct,
}: {
  items: Array<{ price: string }>;
  frequency: string | null;
  discountPct: number;
}) {
  const base = items.reduce((acc, r) => acc + getNumber(r.price), 0);
  const total = getServicesValue(base || 0, frequency);
  const onSale = discountPct !== 0 && total > 0;
  const discounted = onSale ? total * (1 - discountPct / 100) : total;

  return (
    <div className="flex flex-row justify-between items-start px-4 py-4 gap-20 w-[300px] ml-auto">
      <div className="font-medium text-sm">Annual cost:</div>
      <div className="text-right flex flex-col items-end font-medium text-lg">
        <div
          className={
            onSale
              ? "line-through decoration-red-500 decoration-2 text-neutral-500"
              : ""
          }
        >
          {formatMoney(total)}
        </div>

        {onSale && <div className="text-xs text-red-500">-{discountPct}%</div>}

        {onSale && <div>{formatMoney(discounted)}</div>}

        <div className="text-xs text-neutral-500">(Excl. GST)</div>
      </div>
    </div>
  );
}

/* ------------------------------- Page ------------------------------- */

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

  useEffect(() => {
    if (numberOfServices > 0) setShowError(false);
  }, [numberOfServices]);

  const goNext = () => {
    if (numberOfServices === 0) {
      setShowError(true);
    } else {
      setShowError(false);
      state.setPage(2);
    }
  };

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

  if (!state.serviceAgreement) return null;

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col">
        <Label className="text-2xl mb-1 font-medium">
          Build Your Service Plan
        </Label>
        <span className="text-lg text-neutral-500 font-normal">
          Pick the services you need by setting a frequency.
        </span>
      </div>
      {/* Chute Cleaning */}
      <SectionShell id="chute-cleaning">
        <SectionHeader
          title="Chute Cleaning"
          description="Chute cleaning that removes grime, mould, and odours—keeping multi-storey buildings hygienic and safe."
          helpHref="https://www.elephantsfoot.com.au/chute-cleaning/"
        />

        <div className="p-4 md:p-6 2xl:p-8">
          <ServiceFrequency2
            value={state.chuteCleaningFrequency}
            onChange={state.setChuteCleaningFrequency}
            options={options}
          />

          {/* Service grid (left intact) */}
          <div className="max-h-[500px] w-full rounded-lg overflow-auto py-4">
            <div className="flex flex-col text-sm min-w-[500px]">
              <div className="grid grid-cols-6 gap-2 border-b border-input">
                <div className="col-span-3 px-4 py-2 font-medium">Sites</div>
                <div className="col-span-1 px-4 py-2 font-medium">Qty</div>
                <div className="col-span-1 px-4 py-2 font-medium">Level</div>
                <div className="col-span-1 text-right px-4 py-2 font-medium">
                  Price
                </div>
              </div>

              {chuteCleaningDetails.items.map((r, i) => (
                <div
                  key={i}
                  className="grid grid-cols-6 gap-2 border-b border-input"
                >
                  {r.building_name ? (
                    <div className="col-span-3 px-4 py-2">
                      <div>{r.building_name}</div>
                      <div className="text-neutral-500">{r.site_name}</div>
                    </div>
                  ) : (
                    <div className="col-span-1 px-4 py-2">{r.site_name}</div>
                  )}

                  <div className="col-span-1 px-4 py-2">{r.chutes}</div>
                  <div className="col-span-1 px-4 py-2">{r.levels}</div>
                  <div className="col-span-1 text-right px-4 py-2 font-medium">
                    {formatMoney(getNumber(r.price))}
                  </div>
                </div>
              ))}
            </div>

            <PricingFooter
              items={chuteCleaningDetails.items}
              frequency={state.chuteCleaningFrequency}
              discountPct={discount}
            />
          </div>
        </div>
      </SectionShell>

      {/* Waste Room Pressure Clean */}
      <SectionShell id="waste-room-pressure-clean">
        <SectionHeader
          title="Waste Room Pressure Clean"
          description="High-pressure cleaning for hygienic, odour-free waste rooms."
          helpHref="https://www.elephantsfoot.com.au/waste-room-restoration/"
        />

        <div className="p-4 md:p-6 2xl:p-8">
          <ServiceFrequency2
            value={state.wasteRoomCleaningFrequency}
            onChange={state.setWasteRoomCleaningFrequency}
            options={options}
          />

          {/* Service grid (left intact) */}
          <div className="max-h-[500px] w-full rounded-lg overflow-auto py-4">
            <div className="flex flex-col text-sm min-w-[500px]">
              <div className="grid grid-cols-6 gap-2 border-b border-input">
                <div className="col-span-3 px-4 py-2 font-medium">Sites</div>
                <div className="col-span-1 px-4 py-2 font-medium"></div>
                <div className="col-span-1 px-4 py-2 font-medium">Area</div>
                <div className="col-span-1 text-right px-4 py-2 font-medium">
                  Price
                </div>
              </div>

              {wasteRoomCleaningDetails.items.map((r, i) => (
                <div
                  key={i}
                  className="grid grid-cols-6 gap-2 border-b border-input"
                >
                  {r.building_name ? (
                    <div className="col-span-3 px-4 py-2">
                      <div>{r.building_name}</div>
                      <div className="text-neutral-500">{r.site_name}</div>
                    </div>
                  ) : (
                    <div className="col-span-1 px-4 py-2">{r.site_name}</div>
                  )}
                  <div className="col-span-1 px-4 py-2"></div>
                  <div className="col-span-1 px-4 py-2">{r.area_label}</div>
                  <div className="col-span-1 text-right px-4 py-2 font-medium">
                    {formatMoney(getNumber(r.price))}
                  </div>
                </div>
              ))}
            </div>

            <PricingFooter
              items={wasteRoomCleaningDetails.items}
              frequency={state.wasteRoomCleaningFrequency}
              discountPct={discount}
            />
          </div>
        </div>
      </SectionShell>

      {/* Self-Closing Hopper Door Inspection */}
      <SectionShell id="hopper-door-inspection">
        <SectionHeader
          title="Self-Closing Hopper Door Inspection"
          description="Chute-door inspections to ensure fire safety and compliance."
          helpHref="https://www.elephantsfoot.com.au/chute-door-inspection/"
        />

        <div className="p-4 md:p-6 2xl:p-8">
          <ServiceFrequency2
            value={state.selfClosingHopperDoorInspectionFrequency}
            onChange={state.setSelfClosingHopperDoorInspectionFrequency}
            options={options}
          />

          {/* Service grid (left intact) */}
          <div className="max-h-[500px] w-full rounded-lg overflow-auto py-4">
            <div className="flex flex-col text-sm min-w-[500px]">
              <div className="grid grid-cols-6 gap-2 border-b border-input">
                <div className="col-span-3 px-4 py-2 font-medium">Sites</div>
                <div className="col-span-1 px-4 py-2 font-medium"></div>
                <div className="col-span-1 px-4 py-2 font-medium"></div>
                <div className="col-span-1 text-right px-4 py-2 font-medium">
                  Price
                </div>
              </div>

              {selfClosingHopperDoorInspectionDetails.items.map((r, i) => (
                <div
                  key={i}
                  className="grid grid-cols-6 gap-2 border-b border-input"
                >
                  {r.building_name ? (
                    <div className="col-span-3 px-4 py-2">
                      <div>{r.building_name}</div>
                      <div className="text-neutral-500">{r.site_name}</div>
                    </div>
                  ) : (
                    <div className="col-span-1 px-4 py-2">{r.site_name}</div>
                  )}
                  <div className="col-span-1 px-4 py-2"></div>
                  <div className="col-span-1 px-4 py-2"></div>
                  <div className="col-span-1 text-right px-4 py-2 font-medium">
                    {formatMoney(getNumber(r.price))}
                  </div>
                </div>
              ))}
            </div>

            <PricingFooter
              items={selfClosingHopperDoorInspectionDetails.items}
              frequency={state.selfClosingHopperDoorInspectionFrequency}
              discountPct={discount}
            />
          </div>
        </div>
      </SectionShell>

      {/* Bin Cleaning */}
      <SectionShell id="bin-cleaning">
        <SectionHeader
          title="Bin Cleaning"
          description="Thorough bin cleaning to reduce odours, pests, and bacteria."
          helpHref="https://www.elephantsfoot.com.au/service-care/"
        />

        <div className="p-4 md:p-6 2xl:p-8">
          <ServiceFrequency2
            value={state.binCleaningFrequency}
            onChange={state.setBinCleaningFrequency}
            options={options}
          />

          {/* Service grid (left intact) */}
          <div className="max-h-[500px] w-full rounded-lg overflow-auto py-4">
            <div className="flex flex-col text-sm min-w-[500px]">
              <div className="grid grid-cols-6 gap-2 border-b border-input">
                <div className="col-span-3 px-4 py-2 font-medium">Sites</div>
                <div className="col-span-1 px-4 py-2 font-medium"></div>
                <div className="col-span-1 px-4 py-2 font-medium"></div>
                <div className="col-span-1 text-right px-4 py-2 font-medium">
                  Price
                </div>
              </div>

              {binCleaningDetails.items.map((r, i) => (
                <div
                  key={i}
                  className="grid grid-cols-6 gap-2 border-b border-input"
                >
                  {r.building_name ? (
                    <div className="col-span-3 px-4 py-2">
                      <div>{r.building_name}</div>
                      <div className="text-neutral-500">{r.site_name}</div>
                    </div>
                  ) : (
                    <div className="col-span-1 px-4 py-2">{r.site_name}</div>
                  )}
                  <div className="col-span-1 px-4 py-2"></div>
                  <div className="col-span-1 px-4 py-2"></div>
                  <div className="col-span-1 text-right px-4 py-2 font-medium">
                    {formatMoney(getNumber(r.price))}
                  </div>
                </div>
              ))}
            </div>

            <PricingFooter
              items={binCleaningDetails.items}
              frequency={state.binCleaningFrequency}
              discountPct={discount}
            />
          </div>
        </div>
      </SectionShell>

      {/* Equipment Preventative Maintenance */}
      <SectionShell id="equipment-preventative-maintenance">
        <SectionHeader
          title="Equipment Preventative Maintenance"
          description="Keep compactors and related equipment safe, compliant, and efficient."
          helpHref="https://www.elephantsfoot.com.au/preventative-maintenance/"
        />

        <div className="p-4 md:p-6 2xl:p-8">
          <ServiceFrequency2
            value={state.equipmentMaintenanceFrequency}
            onChange={state.setEquipmentMaintenanceFrequency}
            options={options}
          />

          {/* Service grid (left intact) */}
          <div className="max-h-[500px] w-full rounded-lg overflow-auto py-4">
            <div className="flex flex-col text-sm min-w-[500px]">
              <div className="grid grid-cols-6 gap-2 border-b border-input">
                <div className="col-span-3 px-4 py-2 font-medium">Sites</div>
                <div className="col-span-1 px-4 py-2 font-medium"></div>
                <div className="col-span-1 px-4 py-2 font-medium">
                  Equipment
                </div>
                <div className="col-span-1 text-right px-4 py-2 font-medium">
                  Price
                </div>
              </div>

              {equipmentMaintenanceDetails.items.map((r, i) => (
                <div
                  key={i}
                  className="grid grid-cols-6 gap-2 border-b border-input"
                >
                  {r.building_name ? (
                    <div className="col-span-3 px-4 py-2">
                      <div>{r.building_name}</div>
                      <div className="text-neutral-500">{r.site_name}</div>
                    </div>
                  ) : (
                    <div className="col-span-1 px-4 py-2">{r.site_name}</div>
                  )}
                  <div className="col-span-1 px-4 py-2"></div>
                  <div className="col-span-1 px-4 py-2">
                    {r.equipment_label}
                  </div>
                  <div className="col-span-1 text-right px-4 py-2 font-medium">
                    {formatMoney(getNumber(r.price))}
                  </div>
                </div>
              ))}
            </div>

            <PricingFooter
              items={equipmentMaintenanceDetails.items}
              frequency={state.equipmentMaintenanceFrequency}
              discountPct={discount}
            />
          </div>
        </div>
      </SectionShell>

      {/* Odour Control */}
      <SectionShell id="odour-control">
        <SectionHeader
          title="Odour Control"
          description="Targeted odour management to keep shared areas fresh."
          helpHref="https://www.elephantsfoot.com.au/odour-management/"
        />

        <div className="p-4 md:p-6 2xl:p-8">
          <ServiceFrequency2
            value={state.odourControlFrequency}
            onChange={state.setOdourControlFrequency}
            options={options}
          />

          {/* Service grid (left intact) */}
          <div className="max-h-[500px] w-full rounded-lg overflow-auto py-4">
            <div className="flex flex-col text-sm min-w-[500px]">
              <div className="grid grid-cols-6 gap-2 border-b border-input">
                <div className="col-span-3 px-4 py-2 font-medium">Sites</div>
                <div className="col-span-1 px-4 py-2 font-medium"></div>
                <div className="col-span-1 px-4 py-2 font-medium"></div>
                <div className="col-span-1 text-right px-4 py-2 font-medium">
                  Price
                </div>
              </div>

              {odourControlDetails.items.map((r, i) => (
                <div
                  key={i}
                  className="grid grid-cols-6 gap-2 border-b border-input"
                >
                  {r.building_name ? (
                    <div className="col-span-3 px-4 py-2">
                      <div>{r.building_name}</div>
                      <div className="text-neutral-500">{r.site_name}</div>
                    </div>
                  ) : (
                    <div className="col-span-1 px-4 py-2">{r.site_name}</div>
                  )}
                  <div className="col-span-1 px-4 py-2"></div>
                  <div className="col-span-1 px-4 py-2"></div>
                  <div className="col-span-1 text-right px-4 py-2 font-medium">
                    {formatMoney(getNumber(r.price))}
                  </div>
                </div>
              ))}
            </div>

            <PricingFooter
              items={odourControlDetails.items}
              frequency={state.odourControlFrequency}
              discountPct={discount}
            />
          </div>
        </div>
      </SectionShell>

      {/* Exclusive Benefits */}
      <section id="reward" className="flex flex-col gap-6 scroll-mt-[140px]">
        <div className="flex flex-col">
          <Label className="text-xl font-medium">
            Complimentary Incentives
          </Label>
          <span className="text-base text-neutral-500">
            Add services to unlock and redeem complimentary incentives from us —
            at no extra cost.
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
