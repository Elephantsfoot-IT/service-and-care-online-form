// ServicesForm.tsx
"use client";

import IncentiveTable from "@/components/service-agreement/incentive-table";
import ServiceFrequency2 from "@/components/service-agreement/service-frequency-2";
import { Button } from "@/components/ui/button";
import {
  GetServicesReturnTyped,
  MaybeOption,
  OdourControlService,
  options,
} from "@/lib/interface";
import {
  formatMoney,
  getDiscount,
  getNumber,
  getServices,
  getServicesValue,
  normalizeQty,
  scrollToTop,
} from "@/lib/utils";
import { Label } from "@radix-ui/react-label";
import { ArrowRightIcon, InfoIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useServiceAgreementStore } from "@/app/service-agreement/service-agreement-store";
import { Input } from "@/components/ui/input";
import { ServiceSummary } from "../service-summary";
import { format } from "date-fns-tz";

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
      className="flex flex-col scroll-mt-[140px] border border-neutral-300 shadow-sm rounded-xl overflow-hidden bg-white p-6"
    >
      {children}
    </section>
  );
}

function SectionContent({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-4 py-8">{children}</div>;
}

function SectionHeader({
  title,
  description,
  helpHref,
  image,
  imageAlt,
}: {
  title: string;
  description?: string;
  helpHref?: string;
  image?: string;
  imageAlt?: string;
}) {
  return (
    <div className="flex flex-col">
      <div className="text-base xl:text-lg font-medium flex flex-row items-center gap-2">
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
      </div>
      {description && (
        <span className="text-sm xl:text-base text-neutral-500">
          {description}
        </span>
      )}
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
  const subtotal = getServicesValue(base || 0, frequency); // annualised for this section
  const hasTotal = subtotal > 0;
  const showDiscount = discountPct > 0 && hasTotal;
  const discountAmt = showDiscount ? (subtotal * discountPct) / 100 : 0;
  const grandTotal = subtotal - discountAmt;

  if (grandTotal === 0) {
    return null;
  }

  return (
    <>
      <hr className="my-2 border border-input" />
      <div className="space-y-2 w-full sm:max-w-[360px] ml-auto px-2">
        {showDiscount ? (
          <>
            <div className="flex justify-between text-sm text-emerald-600">
              <span>Service discount ({discountPct}%)</span>
              <span>-{formatMoney(discountAmt)}</span>
            </div>

            <div className="flex justify-between items-baseline">
              <span className="text-neutral-600 text-sm font-medium">
                Annual cost (excl. GST)
              </span>
              <div className="text-right">
                <div className="text-sm line-through text-neutral-500">
                  {formatMoney(subtotal)}
                </div>
                <div className="text-base font-medium">
                  {formatMoney(grandTotal)}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex justify-between items-baseline">
            <span className="text-neutral-600 text-sm font-medium">
              Annual cost (excl. GST)
            </span>
            <span className="text-base font-medium">
              {formatMoney(grandTotal)}
            </span>
          </div>
        )}
      </div>
    </>
  );
}

function OdourControlFooter({
  items, // [{ price: string }] where price is already units * unitPrice
  discountPct,
  frequency,
}: {
  items: Array<{ price: string }>;
  discountPct: number;
  frequency: MaybeOption;
}) {
  if (!frequency) {
    return null;
  }
  const subtotal = items.reduce((acc, r) => acc + getNumber(r.price), 0);
  if (subtotal === 0) return null;

  const showDiscount = discountPct > 0;
  const discountAmt = showDiscount ? (subtotal * discountPct) / 100 : 0;
  const grandTotal = subtotal - discountAmt;

  return (
    <>
      <hr className="my-2 border border-input" />
      <div className="space-y-2 w-full sm:max-w-[360px] ml-auto px-2">
        {showDiscount && (
          <div className="flex justify-between text-sm text-emerald-600">
            <span>Service discount ({discountPct}%)</span>
            <span>-{formatMoney(discountAmt)}</span>
          </div>
        )}

        <div className="flex justify-between items-baseline">
          <span className="text-neutral-600 text-sm font-medium">
            Annual cost (excl. GST)
          </span>
          <div className="text-right">
            {showDiscount && (
              <div className="text-sm line-through text-neutral-500">
                {formatMoney(subtotal)}
              </div>
            )}
            <div className="text-base font-medium">
              {formatMoney(grandTotal)}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ------------------------------- Page ------------------------------- */

function ServicesForm({ selectMore }: { selectMore: () => void }) {
  const state = useServiceAgreementStore();
  const [showError, setShowError] = useState(false);
  const [odourQtyError, setOdourQtyError] = useState(false);

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

  // --- Odour Control validation: if frequency selected, all unit inputs must be > 0
  const odourNeedsUnits = !!state.odourControlFrequency;
  const hasMissingOdourQty = useMemo(() => {
    if (!odourNeedsUnits) return false;
    return odourControlDetails.items.some(
      (r) => (state.odourControlUnits[r.id] ?? 0) <= 0
    );
  }, [odourNeedsUnits, state.odourControlUnits, odourControlDetails.items]);

  // Clear message as soon as user fixes the inputs or unselects frequency
  useEffect(() => {
    if (!hasMissingOdourQty) setOdourQtyError(false);
  }, [hasMissingOdourQty]);

  const goNext = () => {
    if (numberOfServices === 0) {
      setShowError(true);
      return;
    }

    // Block if odour control selected but some unit(s) are empty or 0
    if (odourNeedsUnits && hasMissingOdourQty) {
      setOdourQtyError(true);
      // Scroll to the odour control section to show the error
      document
        .getElementById("odour_control")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    setShowError(false);
    state.setPage(2);
  };

  if (!state.serviceAgreement) return null;

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col">
        <Label className="text-2xl font-medium mb-2">Service Agreement Form</Label>
        <span className="text-base xl:text-lg text-neutral-500 font-normal">
          Thanks for choosing{" "}
          <span className="font-medium text-neutral-700">
            Elephants Foot Service & Care
          </span>
          . This form captures your sites and the services/frequencies you’d
          like so we can tailor a maintenance plan that keeps your building
          safe, compliant, and fresh. Once submitted, our team will confirm the
          details and next steps.
        </span>
        <div className="font-medium mt-2 flex flex-row items-center gap-2">
          *This proposal is valid until
          <span className="underline">
            {format(state.serviceAgreement.expire_at, "dd MMM yyyy")}.
          </span>
        </div>
      </div>

      <SectionShell id="service_agreement_duration">
        <SectionHeader
          title="Service Agreement Duration"
          description="The duration of your service agreement."
        />
        <SectionContent>
          <div className="flex flex-row items-center gap-4 justify-between">
            <div className="flex flex-col w-fit flex-shrink-0">
              <Label className="text-sm">Start date</Label>
              <span className="text-base font-medium">
                {format(state.serviceAgreement.start_date, "dd MMM yyyy")}
              </span>
            </div>
            <hr className="w-full border-input" />
            <div className="flex flex-col w-fit flex-shrink-0">
              <Label className="text-sm">End date</Label>
              <span className="text-base font-medium">
                {format(state.serviceAgreement.end_date, "dd MMM yyyy")}
              </span>
            </div>
          </div>
        </SectionContent>
      </SectionShell>

      <div className="flex flex-col mt-10">
        <Label className="text-2xl font-medium mb-2">Build Your Service Plan</Label>
        <span className="text-base xl:text-lg text-neutral-500 font-normal">
          Pick the services you need by setting a frequency.
        </span>
      </div>

      {/* Chute Cleaning (reference style) */}
      {chuteCleaningDetails.items.length > 0 && (
        <SectionShell id="chute_cleaning">
          <SectionHeader
            title="Chute Cleaning"
            description="Chute cleaning that removes grime, mould, and odours—keeping multi-storey buildings hygienic and safe."
            helpHref="https://www.elephantsfoot.com.au/chute-cleaning/"
            image="/Service & Care Icons/Service & Care Cleaning.png"
            imageAlt="Chute Cleaning"
          />

          <SectionContent>
            <ServiceFrequency2
              value={state.chuteCleaningFrequency}
              onChange={state.setChuteCleaningFrequency}
              options={options}
            />

            {/* Desktop table */}
            <div className="hidden xl:block w-full bg-neutral-75 rounded-xl p-4">
              <div className="flex flex-col text-sm min-w-[500px]">
                <div className="grid grid-cols-6 gap-2 border-b border-input">
                  <div className="col-span-3 px-2 py-2">Sites</div>
                  <div className="col-span-1 px-2 py-2">Qty</div>
                  <div className="col-span-1 px-2 py-2">Level</div>
                  <div className="col-span-1 text-right px-2 py-2">Price</div>
                </div>

                {chuteCleaningDetails.items.map((r, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-6 gap-2 border-b border-input last:border-b-0"
                  >
                    {r.building_name ? (
                      <div className="col-span-3 px-2 py-2">
                        <div className="font-medium">{r.site_name}</div>
                        <div>{r.building_name}</div>
                      </div>
                    ) : (
                      <div className="col-span-3 px-2 py-2 font-medium">
                        {r.site_name}
                      </div>
                    )}

                    <div className="col-span-1 px-2 py-2">{r.chutes}</div>
                    <div className="col-span-1 px-2 py-2">{r.levels}</div>
                    <div className="col-span-1 text-right px-2 py-2">
                      {formatMoney(getNumber(r.price))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile list */}
            <div className="xl:hidden w-full flex flex-col rounded-xl bg-neutral-75 p-4">
              <div className="grid grid-cols-2 gap-2 border-b border-input text-sm">
                <div className="col-span-1 px-2 py-2 text-xs">Services</div>
                <div className="col-span-1 text-right px-2 py-2 text-xs">
                  Price
                </div>
              </div>
              {chuteCleaningDetails.items.map((r, i) => (
                <div
                  key={i}
                  className="flex flex-row gap-2 border-b border-input last:border-b-0 text-sm"
                >
                  <div className="w-full px-2 py-2">
                    <div className="flex flex-col gap-1">
                      <div className="font-medium">{r.site_name}</div>
                      {r.building_name && (
                        <div className="text-xs">{r.building_name}</div>
                      )}
                      <div className="flex flex-row gap-2 items-center">
                        <div className="text-xs">{r.levels} × Levels</div>
                        <div className="text-xs">{r.chutes} × Chutes</div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right px-2 py-2 w-fit flex-shrink-0">
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
          </SectionContent>
        </SectionShell>
      )}

      {/* Equipment Preventative Maintenance (styled like chute) */}
      {equipmentMaintenanceDetails.items.length > 0 && (
        <SectionShell id="equipment_maintenance">
          <SectionHeader
            title="Equipment Preventative Maintenance"
            description="Keep compactors and related equipment safe, compliant, and efficient."
            helpHref="https://www.elephantsfoot.com.au/preventative-maintenance/"
            image="/Service & Care Icons/Service & Care Preventative Maintenance.png"
            imageAlt="Equipment Preventative Maintenance"
          />

          <SectionContent>
            <ServiceFrequency2
              value={state.equipmentMaintenanceFrequency}
              onChange={state.setEquipmentMaintenanceFrequency}
              options={options}
            />

            {/* Desktop table */}
            <div className="hidden xl:block w-full bg-neutral-75 rounded-xl p-4">
              <div className="flex flex-col text-sm min-w-[500px]">
                <div className="grid grid-cols-6 gap-2 border-b border-input">
                  <div className="col-span-2 px-2 py-2">Sites</div>
                  <div className="col-span-1 px-2 py-2"></div>
                  <div className="col-span-2 px-2 py-2">Equipment</div>
                  <div className="col-span-1 text-right px-2 py-2">Price</div>
                </div>

                {equipmentMaintenanceDetails.items.map((r, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-6 gap-2 border-b border-input last:border-b-0"
                  >
                    <div className="col-span-2 px-2 py-2">
                      <div className="font-medium">{r.site_name}</div>
                      {r.building_name && <div>{r.building_name}</div>}
                    </div>
                    <div className="col-span-1 px-2 py-2"></div>
                    <div className="col-span-2 px-2 py-2">{r.equipment_label}</div>
                    <div className="col-span-1 text-right px-2 py-2">
                      {formatMoney(getNumber(r.price))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile list */}
            <div className="xl:hidden w-full flex flex-col rounded-xl bg-neutral-75 p-4">
              <div className="grid grid-cols-2 gap-2 border-b border-input text-sm">
                <div className="col-span-1 px-2 py-2 text-xs">Services</div>
                <div className="col-span-1 text-right px-2 py-2 text-xs">
                  Price
                </div>
              </div>
              {equipmentMaintenanceDetails.items.map((r, i) => (
                <div
                  key={`${r.site_id}-${r.building_id}-${i}`}
                  className="flex flex-row gap-2 border-b border-input last:border-b-0 text-sm"
                >
                  <div className="w-full px-2 py-2">
                    <div className="flex flex-col gap-1">
                      <div className="font-medium">{r.site_name}</div>
                      {r.building_name && (
                        <div className="text-xs">{r.building_name}</div>
                      )}
                      <div className="text-xs text-neutral-700">
                        Equipment: {r.equipment_label}
                      </div>
                    </div>
                  </div>
                  <div className="text-right px-2 py-2 w-fit flex-shrink-0">
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
          </SectionContent>
        </SectionShell>
      )}

      {/* Self-Closing Hopper Door Inspection (styled like chute) */}
      {selfClosingHopperDoorInspectionDetails.items.length > 0 && (
        <SectionShell id="hopper_door_inspection">
          <SectionHeader
            title="Self-Closing Hopper Door Inspection"
            description="Chute-door inspections to ensure fire safety and compliance."
            helpHref="https://www.elephantsfoot.com.au/chute-door-inspection/"
            image="/Service & Care Icons/Service & Care Door Inspection.png"
            imageAlt="Self-Closing Hopper Door Inspection"
          />

          <SectionContent>
            <ServiceFrequency2
              value={state.selfClosingHopperDoorInspectionFrequency}
              onChange={state.setSelfClosingHopperDoorInspectionFrequency}
              options={options}
            />

            {/* Desktop table */}
            <div className="hidden xl:block w-full bg-neutral-75 rounded-xl p-4">
              <div className="flex flex-col text-sm min-w-[500px]">
                <div className="grid grid-cols-6 gap-2 border-b border-input">
                  <div className="col-span-3 px-2 py-2">Sites</div>
                  <div className="col-span-1 px-2 py-2"></div>
                  <div className="col-span-1 px-2 py-2"></div>
                  <div className="col-span-1 text-right px-2 py-2">Price</div>
                </div>

                {selfClosingHopperDoorInspectionDetails.items.map((r, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-6 gap-2 border-b border-input last:border-b-0"
                  >
                    <div className="col-span-3 px-2 py-2">
                      <div className="font-medium">{r.site_name}</div>
                      {r.building_name && <div>{r.building_name}</div>}
                    </div>
                    <div className="col-span-1 px-2 py-2"></div>
                    <div className="col-span-1 px-2 py-2"></div>
                    <div className="col-span-1 text-right px-2 py-2">
                      {formatMoney(getNumber(r.price))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile list */}
            <div className="xl:hidden w-full flex flex-col rounded-xl bg-neutral-75 p-4">
              <div className="grid grid-cols-2 gap-2 border-b border-input text-sm">
                <div className="col-span-1 px-2 py-2 text-xs">Services</div>
                <div className="col-span-1 text-right px-2 py-2 text-xs">
                  Price
                </div>
              </div>
              {selfClosingHopperDoorInspectionDetails.items.map((r, i) => (
                <div
                  key={`${r.site_id}-${r.building_id}-${i}`}
                  className="flex flex-row gap-2 border-b border-input last:border-b-0 text-sm"
                >
                  <div className="w-full px-2 py-2">
                    <div className="flex flex-col gap-1">
                      <div className="font-medium">{r.site_name}</div>
                      {r.building_name && (
                        <div className="text-xs">{r.building_name}</div>
                      )}
                    </div>
                  </div>
                  <div className="text-right px-2 py-2 w-fit flex-shrink-0">
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
          </SectionContent>
        </SectionShell>
      )}

      {/* Waste Room Pressure Clean (styled like chute) */}
      {wasteRoomCleaningDetails.items.length > 0 && (
        <SectionShell id="waste_room_pressure_clean">
          <SectionHeader
            title="Waste Room Pressure Clean"
            description="High-pressure cleaning for hygienic, odour-free waste rooms."
            helpHref="https://www.elephantsfoot.com.au/waste-room-restoration/"
            image="/Service & Care Icons/Service & Care Test Tag.png"
            imageAlt="Waste Room Pressure Clean"
          />

          <SectionContent>
            <ServiceFrequency2
              value={state.wasteRoomCleaningFrequency}
              onChange={state.setWasteRoomCleaningFrequency}
              options={options}
            />

            {/* Desktop table */}
            <div className="hidden xl:block w-full bg-neutral-75 rounded-xl p-4">
              <div className="flex flex-col text-sm min-w-[500px]">
                <div className="grid grid-cols-6 gap-2 border-b border-input">
                  <div className="col-span-2 px-2 py-2">Sites</div>
                  <div className="col-span-1 px-2 py-2"></div>
                  <div className="col-span-2 px-2 py-2">Area</div>
                  <div className="col-span-1 text-right px-2 py-2">Price</div>
                </div>

                {wasteRoomCleaningDetails.items.map((r, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-6 gap-2 border-b border-input last:border-b-0"
                  >
                    <div className="col-span-2 px-2 py-2">
                      <div className="font-medium">{r.site_name}</div>
                      {r.building_name && <div>{r.building_name}</div>}
                    </div>
                    <div className="col-span-1 px-2 py-2"></div>
                    <div className="col-span-2 px-2 py-2">{r.area_label}</div>
                    <div className="col-span-1 text-right px-2 py-2">
                      {formatMoney(getNumber(r.price))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile list */}
            <div className="xl:hidden w-full flex flex-col rounded-xl bg-neutral-75 p-4">
              <div className="grid grid-cols-2 gap-2 border-b border-input text-sm">
                <div className="col-span-1 px-2 py-2 text-xs">Services</div>
                <div className="col-span-1 text-right px-2 py-2 text-xs">
                  Price
                </div>
              </div>
              {wasteRoomCleaningDetails.items.map((r, i) => (
                <div
                  key={`${r.site_id}-${r.building_id}-${i}`}
                  className="flex flex-row gap-2 border-b border-input last:border-b-0 text-sm"
                >
                  <div className="w-full px-2 py-2">
                    <div className="flex flex-col gap-1">
                      <div className="font-medium">{r.site_name}</div>
                      {r.building_name && (
                        <div className="text-xs">{r.building_name}</div>
                      )}
                      <div className="text-xs text-neutral-700">
                        Area: {r.area_label}
                      </div>
                    </div>
                  </div>
                  <div className="text-right px-2 py-2 w-fit flex-shrink-0">
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
          </SectionContent>
        </SectionShell>
      )}

      {/* Bin Cleaning (styled like chute) */}
      {binCleaningDetails.items.length > 0 && (
        <SectionShell id="bin_cleaning">
          <SectionHeader
            title="Bin Cleaning"
            description="Thorough bin cleaning to reduce odours, pests, and bacteria."
            helpHref="https://www.elephantsfoot.com.au/service-care/"
            image="/Service & Care Icons/Service & Care Equipment Replacement.png"
            imageAlt="Bin Cleaning"
          />

          <SectionContent>
            <ServiceFrequency2
              value={state.binCleaningFrequency}
              onChange={state.setBinCleaningFrequency}
              options={options}
            />

            {/* Desktop table */}
            <div className="hidden xl:block w-full bg-neutral-75 rounded-xl p-4">
              <div className="flex flex-col text-sm min-w-[500px]">
                <div className="grid grid-cols-6 gap-2 border-b border-input">
                  <div className="col-span-3 px-2 py-2">Sites</div>
                  <div className="col-span-1 px-2 py-2"></div>
                  <div className="col-span-1 px-2 py-2"></div>
                  <div className="col-span-1 text-right px-2 py-2">Price</div>
                </div>

                {binCleaningDetails.items.map((r, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-6 gap-2 border-b border-input last:border-b-0"
                  >
                    <div className="col-span-3 px-2 py-2">
                      <div className="font-medium">{r.site_name}</div>
                      {r.building_name && <div>{r.building_name}</div>}
                    </div>
                    <div className="col-span-1 px-2 py-2"></div>
                    <div className="col-span-1 px-2 py-2"></div>
                    <div className="col-span-1 text-right px-2 py-2">
                      {formatMoney(getNumber(r.price))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile list */}
            <div className="xl:hidden w-full flex flex-col rounded-xl bg-neutral-75 p-4">
              <div className="grid grid-cols-2 gap-2 border-b border-input text-sm">
                <div className="col-span-1 px-2 py-2 text-xs">Services</div>
                <div className="col-span-1 text-right px-2 py-2 text-xs">
                  Price
                </div>
              </div>
              {binCleaningDetails.items.map((r, i) => (
                <div
                  key={`${r.site_id}-${r.building_id}-${i}`}
                  className="flex flex-row gap-2 border-b border-input last:border-b-0 text-sm"
                >
                  <div className="w-full px-2 py-2">
                    <div className="flex flex-col gap-1">
                      <div className="font-medium">{r.site_name}</div>
                      {r.building_name && (
                        <div className="text-xs">{r.building_name}</div>
                      )}
                    </div>
                  </div>
                  <div className="text-right px-2 py-2 w-fit flex-shrink-0">
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
          </SectionContent>
        </SectionShell>
      )}

      {/* Odour Control (styled like chute + units) */}
      {odourControlDetails.items.length > 0 && (
        <SectionShell id="odour_control">
          <SectionHeader
            title="Odour Control"
            description="Targeted odour management to keep shared areas fresh."
            helpHref="https://www.elephantsfoot.com.au/odour-management/"
            image="/Service & Care Icons/Service & Care Odour Management Box.png"
            imageAlt="Odour Control"
          />

          <SectionContent>
            <ServiceFrequency2
              value={state.odourControlFrequency}
              onChange={state.setOdourControlFrequency}
              options={options.filter((o) => o.value === "quarterly")}
            />

            {odourQtyError && (
              <div className="text-sm text-destructive mt-2">
                Enter the quantity for each location
              </div>
            )}

            {(() => {
              const getKey = (r: OdourControlService) => r.id;

              // Desktop table
              return (
                <>
                  <div className="hidden xl:block w-full bg-neutral-75 rounded-xl p-4">
                    <div className="flex flex-col text-sm min-w-[640px]">
                      <div className="grid grid-cols-7 gap-2 border-b border-input">
                        <div className="col-span-3 px-2 py-2">Sites</div>
                        <div className="col-span-2 px-2 py-2">Units</div>
                        <div className="col-span-1 px-2 py-2 text-right">
                          Unit price
                        </div>
                        <div className="col-span-1 px-2 py-2 text-right">
                          Line total
                        </div>
                      </div>

                      {odourControlDetails.items.map((r) => {
                        const key = getKey(r);
                        const qty = state.odourControlUnits[key] ?? 0;
                        const unitPrice = getNumber(r.price);
                        const lineTotal = unitPrice * qty;
                        const invalid =
                          odourQtyError && odourNeedsUnits && qty <= 0;

                        return (
                          <div
                            key={key}
                            className="grid grid-cols-7 gap-2 border-b border-input last:border-b-0"
                          >
                            <div className="col-span-3 px-2 py-2">
                              <div className="font-medium">{r.site_name}</div>
                              {r.building_name && <div>{r.building_name}</div>}
                            </div>

                            <div className="col-span-2 px-2 py-2">
                              <div className="flex items-center gap-2">
                                <Input
                                  type="text"
                                  value={qty}
                                  onChange={(e) => {
                                    const v = normalizeQty(
                                      e.currentTarget.value
                                    );
                                    state.setOdourControlUnit(key, Number(v));
                                  }}
                                  aria-invalid={invalid}
                                  className={`h-8 w-16 efg-input ${
                                    invalid
                                      ? "border-destructive focus-visible:ring-destructive"
                                      : ""
                                  }`}
                                />
                              </div>
                            </div>

                            <div className="col-span-1 px-2 py-2 text-right">
                              {formatMoney(unitPrice)}
                            </div>
                            <div className="col-span-1 px-2 py-2 text-right font-medium">
                              {formatMoney(lineTotal)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Mobile list */}
                  <div className="xl:hidden w-full flex flex-col rounded-xl bg-neutral-75 p-4 divide-y divide-input">
                    <div className="grid grid-cols-2 gap-2 border-b border-input text-sm">
                      <div className="col-span-1 px-2 py-2 text-xs">Services</div>
                      <div className="col-span-1 text-right px-2 py-2 text-xs">
                        Line total
                      </div>
                    </div>
                    {odourControlDetails.items.map((r) => {
                      const key = getKey(r);
                      const qty = state.odourControlUnits[key] ?? 0;
                      const unitPrice = getNumber(r.price);
                      const lineTotal = unitPrice * qty;
                      const invalid =
                        odourQtyError && odourNeedsUnits && qty <= 0;

                      return (
                        <div key={key} className="px-2 py-3">
                          {/* Top: site + building */}
                          <div className="mb-2">
                            <div className="font-medium">{r.site_name}</div>
                            {r.building_name && (
                              <div className="text-xs text-neutral-600">
                                {r.building_name}
                              </div>
                            )}
                          </div>

                          {/* Middle: units (left) & unit price (right) */}
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <Input
                                id={`odour-units-${key}`}
                                inputMode="numeric"
                                type="text"
                                value={qty}
                                onChange={(e) => {
                                  const v = normalizeQty(e.currentTarget.value);
                                  state.setOdourControlUnit(key, Number(v));
                                }}
                                aria-invalid={invalid}
                                className={`h-8 w-20 efg-input ${
                                  invalid
                                    ? "border-destructive focus-visible:ring-destructive"
                                    : ""
                                }`}
                              />
                            </div>

                            <div className="text-right">
                              <div className="text-xs text-neutral-600">
                                Unit price
                              </div>
                              <div className="text-sm">
                                {formatMoney(unitPrice)}
                              </div>
                            </div>
                          </div>

                          {/* Bottom: line total */}
                          <div className="mt-2 text-right">
                            <span className="text-xs text-neutral-600 mr-2">
                              Total
                            </span>
                            <span className="font-medium">
                              {formatMoney(lineTotal)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Pricing footer (units-aware) */}
                  <OdourControlFooter
                    items={odourControlDetails.items.map((r) => {
                      const key = r.id;
                      const qty = state.odourControlUnits[key] ?? 0;
                      const unitPrice = getNumber(r.price);
                      return { price: String(unitPrice * qty) };
                    })}
                    discountPct={discount}
                    frequency={state.odourControlFrequency}
                  />
                </>
              );
            })()}
          </SectionContent>
        </SectionShell>
      )}

      {/* Exclusive Benefits */}
      {state.serviceAgreement.incentives && (
        <section id="rewards" className="flex flex-col gap-6 scroll-mt-[140px] mt-10">
          <div className="flex flex-col">
            <Label className="text-2xl font-medium mb-2">Complimentary Incentives</Label>
            <span className="text-lg text-neutral-500">
              Add services to unlock and redeem complimentary incentives from us — at no
              extra cost.
            </span>
          </div>
          <div className="overflow-x-auto p-1">
            <IncentiveTable
              serviceCount={numberOfServices}
              selectMore={selectMore}
            />
          </div>
        </section>
      )}

      <div className="flex flex-col gap-6 mt-10">
        <div className="flex flex-col">
          <Label className="text-2xl font-medium mb-2">Service Summary</Label>
          <span className="text-base xl:text-lg text-neutral-500">
            Review your service plan and the total cost.
          </span>
        </div>

        <ServiceSummary />
      </div>

      {showError && (
        <div className="text-destructive text-sm">Choose at least 1 service to proceed.</div>
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
