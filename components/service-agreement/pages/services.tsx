// ServicesForm.tsx
"use client";

import { useServiceAgreementStore } from "@/app/service-agreement/service-agreement-store";
import IncentiveTable from "@/components/service-agreement/incentive-table";
import ServiceFrequency2 from "@/components/service-agreement/service-frequency-2";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  GetServicesReturnTyped,
  MaybeOption,
  OdourControlService,
  options,
} from "@/lib/interface";
import {
  cn,
  formatMoney,
  getDiscount,
  getFrequencyValue,
  getNumber,
  getServices,
  getServicesValue,
  getTotalPrice,
  normalizeQty,
  scrollToTop,
} from "@/lib/utils";
import { Label } from "@radix-ui/react-label";
import { format } from "date-fns-tz";
import { ArrowRightIcon, ChevronDownIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { HorizontalScroller } from "../scroll-indicator";
import { ServiceSummary } from "../service-summary";

/* ---------- Small helpers (do NOT touch your service grids) ---------- */

function SectionShell({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="flex flex-col scroll-mt-[140px]  bg-white">
      {children}
    </section>
  );
}

function SectionContent({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-4 py-8">{children}</div>;
}

function SectionDetails({
  children,
  helpHref,
}: {
  children: React.ReactNode;
  helpHref?: string;
}) {
  const [isOpen, setIsOpen] = useState<string | undefined>(undefined);

  return (
    <Accordion
      type="single"
      collapsible
      value={isOpen}
      onValueChange={setIsOpen}
    >
      <AccordionItem value="item-1">
        <div
          onClick={() => {
            if (isOpen === "item-1") {
              setIsOpen(undefined);
            } else {
              setIsOpen("item-1");
            }
          }}
          className="text-sm xl:text-base text-efg-yellow mr-1 flex flex-row items-center justify-center gap-1 mt-1  hover:underline hover:text-efg-yellow/80 w-fit cursor-pointer"
        >
          Service Details
          <ChevronDownIcon
            className={cn(
              "w-3.5 h-3.5 transition-transform duration-300 ",
              isOpen === "item-1" ? "rotate-180" : ""
            )}
          />
        </div>
        <AccordionContent
          className={cn(
            "bg-neutral-100 rounded-b-xl rounded-t-xl p-5 mt-1 h-fit accordion-down text-sm xl:text-base"
          )}
        >
          {children}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex flex-col">
      <div className="text-2xl xl:text-3xl  flex flex-row items-center gap-2">
        {title}
      </div>
    </div>
  );
}

/* ---------- Reusable footer for pricing (handles discount UI) ---------- */
function PricingFooter({
  items,
  frequency,
  discountPct,
  incentives,
}: {
  items: Array<{ price: string }>;
  frequency: string | null;
  discountPct: number;
  incentives: boolean;
}) {
  const base = items.reduce((acc, r) => acc + getNumber(r.price), 0);
  const subtotal = getServicesValue(base || 0, frequency); // annualised for this section
  const hasTotal = subtotal > 0;
  const showDiscount = discountPct > 0 && hasTotal && incentives;
  const discountAmt = showDiscount ? (subtotal * discountPct) / 100 : 0;
  const grandTotal = subtotal - discountAmt;

  if (grandTotal === 0) {
    return null;
  }

  return (
    <>
      <hr className="my-2 border border-input border-dashed" />
      <div className="space-y-2 w-full sm:max-w-[360px] ml-auto px-6">
        {showDiscount ? (
          <>
            <div className="flex justify-between text-sm xl:text-base text-emerald-600">
              <span>Service discount ({discountPct}%)</span>
              <span>-{formatMoney(discountAmt)}</span>
            </div>

            <div className="flex justify-between items-baseline">
              <span className="text-neutral-600 text-sm xl:text-base font-medium">
                Annual cost (excl. GST)
              </span>
              <div className="text-right">
                <div className="text-sm xl:text-base line-through text-neutral-500">
                  {formatMoney(subtotal)}
                </div>
                <div className="text-lg font-medium">
                  {formatMoney(grandTotal)}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex justify-between items-baseline">
            <span className="text-neutral-600 text-sm xl:text-base font-medium">
              Annual cost (excl. GST)
            </span>
            <span className="text-lg font-medium">
              {formatMoney(grandTotal)}
            </span>
          </div>
        )}
      </div>
    </>
  );
}

function ChuteFooter({
  items,
  frequency,
  discountPct,
  incentives,
}: {
  items: Array<{ price: string , chutes: string }>;
  frequency: string | null;
  discountPct: number;
  incentives: boolean;
}) {
  const base = items.reduce((acc, r) => acc + (getNumber(r.price)*getNumber(r.chutes)), 0);
  const subtotal = getServicesValue(base || 0, frequency); // annualised for this section
  const hasTotal = subtotal > 0;
  const showDiscount = discountPct > 0 && hasTotal && incentives;
  const discountAmt = showDiscount ? (subtotal * discountPct) / 100 : 0;
  const grandTotal = subtotal - discountAmt;

  if (grandTotal === 0) {
    return null;
  }
  return (
    <>
      <hr className="my-2 border border-input border-dashed" />
      <div className="space-y-2 w-full sm:max-w-[360px] ml-auto px-6">
        {showDiscount ? (
          <>
            <div className="flex justify-between text-sm xl:text-base text-emerald-600">
              <span>Service discount ({discountPct}%)</span>
              <span>-{formatMoney(discountAmt)}</span>
            </div>

            <div className="flex justify-between items-baseline">
              <span className="text-neutral-600 text-sm xl:text-base font-medium">
                Annual cost (excl. GST)
              </span>
              <div className="text-right">
                <div className="text-sm xl:text-base line-through text-neutral-500">
                  {formatMoney(subtotal)}
                </div>
                <div className="text-lg font-medium">
                  {formatMoney(grandTotal)}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex justify-between items-baseline">
            <span className="text-neutral-600 text-sm xl:text-base font-medium">
              Annual cost (excl. GST)
            </span>
            <span className="text-lg font-medium">
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
  incentives,
}: {
  items: Array<{ price: string }>;
  discountPct: number;
  frequency: MaybeOption;
  incentives: boolean;
}) {
  if (!frequency) {
    return null;
  }
  const subtotal = items.reduce((acc, r) => acc + getNumber(r.price), 0);
  if (subtotal === 0) return null;

  const showDiscount = discountPct > 0 && incentives;
  const discountAmt = showDiscount ? (subtotal * discountPct) / 100 : 0;
  const grandTotal = subtotal - discountAmt;

  return (
    <>
      <hr className="my-2 border border-input border-dashed" />
      <div className="space-y-2 w-full sm:max-w-[360px] ml-auto px-2">
        {showDiscount && (
          <div className="flex justify-between text-sm xl:text-base text-emerald-600">
            <span>Service discount ({discountPct}%)</span>
            <span>-{formatMoney(discountAmt)}</span>
          </div>
        )}

        <div className="flex justify-between items-baseline">
          <span className="text-neutral-600 text-sm xl:text-base font-medium">
            Annual cost (excl. GST)
          </span>
          <div className="text-right">
            {showDiscount && (
              <div className="text-sm xl:text-base line-through text-neutral-500">
                {formatMoney(subtotal)}
              </div>
            )}
            <div className="text-lg font-medium">{formatMoney(grandTotal)}</div>
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

  const desiredTier = useMemo(() => {
    if (numberOfServices === 3) return "basic";
    if (numberOfServices > 3 && numberOfServices < 6) return "essential";
    if (numberOfServices >= 6) return "premium";
    return "";
  }, [numberOfServices]);

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
    <div className="flex flex-col gap-20 sm:gap-30 xl:gap-60">
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
        {/* ➜ NEW notice block */}

        <div className="mt-2 text-sm xl:text-base bg-neutral-75 rounded-xl p-6 flex flex-col gap-2 mt-6">
          <div className="flex flex-row">
            <div className="w-1/3 flex-shrink-0 font-medium">Customer</div>
            <div className="w-2/3 flex-shrink-0">
              {state.serviceAgreement?.quote_for}
            </div>
          </div>

          <div className="flex flex-row">
            <div className="w-1/3 flex-shrink-0 font-medium">Valid until</div>
            <div className="w-2/3 flex-shrink-0">
              {format(state.serviceAgreement.expire_at, "EEE, dd/MM/yyyy")}
            </div>
          </div>
        </div>
        <div className="mt-1 ml-1 text-sm xl:text-base text-neutral-500">
          If this isn’t you, please contact us at{" "}
          <a href="tel:1300435374" className="underline">
            1300 435 374
          </a>{" "}
          or{" "}
          <a href="mailto:service@elephantsfoot.com.au" className="underline">
            service@elephantsfoot.com.au
          </a>
        </div>

        <div className=" mt-4 border border-input rounded-xl shadow-sm mt-6">
          <div className="text-lg font-medium bg-neutral-75 p-6 rounded-t-xl border-b border-input">
            Contract Duration
          </div>
          <div className="flex flex-row items-center gap-6 justify-between p-6">
            <div className="flex flex-col gap-1.5 flex-shrink-0">
              <Label className="text-sm xl:text-base text-muted-foreground">
                Start date
              </Label>
              <span className="text-base xl:text-lg font-medium  leading-tight">
                {format(state.serviceAgreement.start_date, "dd MMM yyyy")}
              </span>
            </div>
            <hr className="flex-1 border-input"></hr>

            <div className="flex flex-col gap-1.5 flex-shrink-0">
              <Label className="text-sm xl:text-base  text-muted-foreground">
                End date
              </Label>
              <span className="text-base xl:text-lg font-medium  leading-tight">
                {format(state.serviceAgreement.end_date, "dd MMM yyyy")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Chute Cleaning (reference style) */}
      {chuteCleaningDetails.items.length > 0 && (
        <SectionShell id="chute_cleaning">
          <SectionHeader title="Chute Cleaning" />
          <SectionDetails helpHref="https://www.elephantsfoot.com.au/chute-cleaning/">
            <ul className="list-disc pl-6 space-y-1">
              <li>
                Attach “Chute Cleaning in Progress” signs to hopper doors to
                ensure awareness that cleaning is underway.
              </li>
              <li>
                Use an environmentally friendly solution to break down any
                residue or buildup in the chute.
              </li>
              <li>
                Use high-pressure water to thoroughly clean the chute,
                dislodging any remaining debris.
              </li>
              <li>
                Wipe down and sanitize the hopper doors to maintain hygiene
                standards.
              </li>
              <li>
                High-pressure clean discharge hopper to remove any buildup or
                contaminants.
              </li>
              <li>Thoroughly clean all waste equipment.</li>
              <li>
                Ensure that the waste room is free of excess water to prevent
                slips and maintain cleanliness.
              </li>
              <li>
                Use odour-control spray to neutralize any unpleasant smells
                emanating from the waste chute, ensuring a more pleasant
                environment.
              </li>
              <li>
                For more information, please visit{" "}
                <a
                  href="https://www.elephantsfoot.com.au/chute-cleaning/"
                  className="underline text-efg-yellow"
                  target="_blank"
                >
                  our website
                </a>{" "}
              </li>
            </ul>
          </SectionDetails>
          <SectionContent>
            <ServiceFrequency2
              value={state.chuteCleaningFrequency}
              onChange={state.setChuteCleaningFrequency}
              options={options}
            />

            {/* Desktop table */}
            <div className="hidden sm:block w-full bg-neutral-75 rounded-xl p-4">
              <div className="flex flex-col text-sm xl:text-base min-w-[500px]">
                <div className="grid grid-cols-6 gap-2 border-b border-input">
                  <div className="col-span-3 px-2 py-2">Sites</div>
                  <div className="col-span-1 px-2 py-2">Level</div>
                  <div className="col-span-1 px-2 py-2">Chutes</div>
                  <div className="col-span-1 text-right px-2 py-2">
                    Price per chute
                  </div>
                </div>

                {chuteCleaningDetails.items.map((r, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-6 gap-2 border-b border-input last:border-b-0 text-sm xl:text-base"
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
                    <div className="col-span-1 px-2 py-2">{r.levels}</div>
                    <div className="col-span-1 px-2 py-2">{r.chutes}</div>
                    <div className="col-span-1 text-right px-2 py-2">
                      {formatMoney(getNumber(r.price))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile list */}
            <div className="sm:hidden w-full flex flex-col rounded-xl bg-neutral-75 p-4">
              <div className="grid grid-cols-2 gap-2 border-b border-input text-sm xl:text-base">
                <div className="col-span-1 px-2 py-2 text-xs">Services</div>
                <div className="col-span-1 text-right px-2 py-2 text-xs">
                  Price
                </div>
              </div>
              {chuteCleaningDetails.items.map((r, i) => (
                <div
                  key={i}
                  className="flex flex-row gap-2 border-b border-input last:border-b-0 text-sm xl:text-base"
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

            <ChuteFooter
              items={chuteCleaningDetails.items}
              frequency={state.chuteCleaningFrequency}
              discountPct={discount}
              incentives={state.serviceAgreement.incentives}
            />
          </SectionContent>
        </SectionShell>
      )}

      {/* Equipment Preventative Maintenance (styled like chute) */}
      {equipmentMaintenanceDetails.items.length > 0 && (
        <SectionShell id="equipment_maintenance">
          <SectionHeader title="Equipment Preventative Maintenance" />
          <SectionDetails helpHref="https://www.elephantsfoot.com.au/preventative-maintenance/">
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>EDIVERTER / GARBAGE ROOM</strong>
                <ul className="list-[circle] pl-6 space-y-1">
                  <li>
                    Check/Clean and/or adjust photo sensor &amp; reflector
                  </li>
                  <li>Check and clean all limit switches (if applicable)</li>
                  <li>Check power pack (if applicable)</li>
                  <li>Check &amp; grease diverter bearings</li>
                  <li>Check electrical actuator &amp; controls</li>
                  <li>Check PLC functions &amp; all wiring</li>
                  <li>Check all electronic sequencing</li>
                  <li>
                    Check and adjust the stopping position (if applicable)
                  </li>
                  <li>Check safety controls</li>
                  <li>
                    Check hopper sliding door, slides, cable condition and
                    fusible link
                  </li>
                  <li>Check turn buckle on hopper</li>
                  <li>Test operations of entire system</li>
                  <li>Report on steel welds &amp; structure</li>
                  <li>Report on housekeeping of garbage room</li>
                </ul>
              </li>

              <li>
                <strong>CAROUSELS &amp; LINEARS</strong>
                <ul className="list-[circle] pl-6 space-y-1">
                  <li>Ensure the plastic floor tray is clean</li>
                  <li>Clean the machine</li>
                  <li>Check and grease the ram screw rod and nut</li>
                  <li>Check drive chain tension</li>
                  <li>Check gearbox mount bolts</li>
                  <li>Check the plastic floor tray and centre runners</li>
                  <li>
                    Check and grease carousel ring gear and motor pinion, adjust
                    tension if necessary
                  </li>
                  <li>Check &amp; grease conveyor track and screw drive</li>
                </ul>
              </li>
              <li>
                For more information, please visit{" "}
                <a
                  href="https://www.elephantsfoot.com.au/preventative-maintenance/"
                  className="underline text-efg-yellow"
                  target="_blank"
                >
                  our website
                </a>{" "}
              </li>
            </ul>
          </SectionDetails>

          <SectionContent>
            <ServiceFrequency2
              value={state.equipmentMaintenanceFrequency}
              onChange={state.setEquipmentMaintenanceFrequency}
              options={options}
            />

            {/* Desktop table */}
            <div className="hidden sm:block w-full bg-neutral-75 rounded-xl p-4">
              <div className="flex flex-col text-sm xl:text-base min-w-[500px]">
                <div className="grid grid-cols-6 gap-2 border-b border-input">
                  <div className="col-span-2 px-2 py-2">Sites</div>
                  <div className="col-span-1 px-2 py-2"></div>
                  <div className="col-span-2 px-2 py-2">Equipment</div>
                  <div className="col-span-1 text-right px-2 py-2">Price</div>
                </div>

                {equipmentMaintenanceDetails.items.map((r, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-6 gap-2 border-b border-input last:border-b-0 text-sm xl:text-base"
                  >
                    <div className="col-span-2 px-2 py-2">
                      <div className="font-medium">{r.site_name}</div>
                      {r.building_name && <div>{r.building_name}</div>}
                    </div>
                    <div className="col-span-1 px-2 py-2"></div>
                    <div className="col-span-2 px-2 py-2">
                      {r.equipment_label}
                    </div>
                    <div className="col-span-1 text-right px-2 py-2">
                      {formatMoney(getNumber(r.price))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile list */}
            <div className="sm:hidden w-full flex flex-col rounded-xl bg-neutral-75 p-4">
              <div className="grid grid-cols-2 gap-2 border-b border-input text-sm xl:text-base">
                <div className="col-span-1 px-2 py-2 text-xs">Services</div>
                <div className="col-span-1 text-right px-2 py-2 text-xs">
                  Price
                </div>
              </div>
              {equipmentMaintenanceDetails.items.map((r, i) => (
                <div
                  key={`${r.site_id}-${r.building_id}-${i}`}
                  className="flex flex-row gap-2 border-b border-input last:border-b-0 text-sm xl:text-base"
                >
                  <div className="w-full px-2 py-2">
                    <div className="flex flex-col gap-1">
                      <div className="font-medium">{r.site_name}</div>
                      {r.building_name && (
                        <div className="text-xs">{r.building_name}</div>
                      )}
                      <div className="text-xs text-neutral-800">
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
              incentives={state.serviceAgreement.incentives}
            />
          </SectionContent>
        </SectionShell>
      )}

      {/* Self-Closing Hopper Door Inspection (styled like chute) */}
      {selfClosingHopperDoorInspectionDetails.items.length > 0 && (
        <SectionShell id="hopper_door_inspection">
          <SectionHeader title="Self-Closing Hopper Door Inspection" />
          <SectionDetails helpHref="https://www.elephantsfoot.com.au/chute-door-inspection/">
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <b>Self-Closing Hopper</b> Inspect against drawings that
                self-closing hoppers have been added, removed or modified. Check
                overall dimensioning of the self-closing hopper i.e. gaps, leaf
                and the door frame are in accordance with the relevant test
                report
              </li>
              <li>
                <b>Screw Mounted Self Closing Hoppers (where applicable)</b>{" "}
                Inspect to ensure screw fixings are all present and engaged in
                the frame securely and are in accordance with the relevant test
                report
              </li>
              <li>
                <b>Hardware General</b>
                <ul className="list-[circle] pl-6 space-y-1">
                  <li>
                    Locksets, latches, closers, pivots and hinges: Inspect all
                    hardware required for closing and latching is fitted and is
                    a make and model that has been fire tested for the specific
                    self-closing hopper.
                  </li>
                  <li>
                    Inspect all hardware is located correctly, securely attached
                    and operational with the correct fittings in accordance with
                    the requirements of the relevant test report.
                  </li>
                  <li>
                    Inspect the door leaf and door frame are free from
                    non-approved fittings, fixings, or attachments and free from
                    damage caused by relocation of hardware items.
                  </li>
                </ul>
              </li>
              <li>
                <b>Self-Closing and Self- Latching Function</b>
                <ul className="list-[circle] pl-6 space-y-1">
                  <li>
                    Verify the opening and closing forces are such that the
                    self-closing hoppers can be easily opened and closed in
                    normal conditions.
                  </li>
                  <li>
                    Inspect the door leaf and door set is self-closing and
                    self-latching if appropriate.
                  </li>
                </ul>
              </li>
              <li>
                <b>Seals</b> Inspect any installed door seals are approved for
                us on the proprietary door type, functioning as intended and are
                not damaged.
              </li>
              <li>
                <b>Leaves</b>
                <ul className="list-[circle] pl-6 space-y-1">
                  <li>
                    Inspect panel to ensure it is free of any visible
                    delamination, and other damage.
                  </li>
                  <li>
                    Inspect that the any perimeter seal is in good condition and
                    not damaged.
                  </li>
                  <li>Inspect door hinges are in</li>
                </ul>
              </li>
              <li>
                For more information, please visit{" "}
                <a
                  href="https://www.elephantsfoot.com.au/chute-door-inspection/"
                  className="underline text-efg-yellow"
                  target="_blank"
                >
                  our website
                </a>{" "}
              </li>
            </ul>
          </SectionDetails>

          <SectionContent>
            <ServiceFrequency2
              value={state.selfClosingHopperDoorInspectionFrequency}
              onChange={state.setSelfClosingHopperDoorInspectionFrequency}
              options={options}
            />

            {/* Desktop table */}
            <div className="hidden sm:block w-full bg-neutral-75 rounded-xl p-4">
              <div className="flex flex-col text-sm xl:text-base min-w-[500px]">
                <div className="grid grid-cols-6 gap-2 border-b border-input">
                  <div className="col-span-3 px-2 py-2">Sites</div>
                  <div className="col-span-1 px-2 py-2">Level</div>
                  <div className="col-span-1 px-2 py-2">Chutes</div>
                  <div className="col-span-1 text-right px-2 py-2">
                    Price per chute
                  </div>
                </div>

                {selfClosingHopperDoorInspectionDetails.items.map((r, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-6 gap-2 border-b border-input last:border-b-0 text-sm xl:text-base"
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
                    <div className="col-span-1 px-2 py-2">{r.levels}</div>
                    <div className="col-span-1 px-2 py-2">{r.chutes}</div>
                    <div className="col-span-1 text-right px-2 py-2">
                      {formatMoney(getNumber(r.price))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile list */}
            <div className="sm:hidden w-full flex flex-col rounded-xl bg-neutral-75 p-4">
              <div className="grid grid-cols-2 gap-2 border-b border-input text-sm xl:text-base">
                <div className="col-span-1 px-2 py-2 text-xs">Services</div>
                <div className="col-span-1 text-right px-2 py-2 text-xs">
                  Price
                </div>
              </div>
              {selfClosingHopperDoorInspectionDetails.items.map((r, i) => (
                <div
                  key={`${r.site_id}-${r.building_id}-${i}`}
                  className="flex flex-row gap-2 border-b border-input last:border-b-0 text-sm xl:text-base"
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

            <ChuteFooter
              items={selfClosingHopperDoorInspectionDetails.items}
              frequency={state.selfClosingHopperDoorInspectionFrequency}
              discountPct={discount}
              incentives={state.serviceAgreement.incentives}
            />
          </SectionContent>
        </SectionShell>
      )}

      {/* Waste Room Pressure Clean (styled like chute) */}
      {wasteRoomCleaningDetails.items.length > 0 && (
        <SectionShell id="waste_room_pressure_clean">
          <SectionHeader title="Waste Room Pressure Clean" />
          <SectionDetails helpHref="https://www.elephantsfoot.com.au/waste-room-restoration/">
            <ul className="list-disc pl-6 space-y-1">
              <li>
                Ensure that all equipment is powered off and disconnected from
                any power source.
              </li>
              <li>
                Use an environmentally friendly solution to break down any
                residue or buildup on the equipment.
              </li>
              <li>
                Use high-pressure water to clean the room and waste equipment,
                dislodging any remaining debris.
              </li>
              <li>
                Rinse the equipment thoroughly with clean water to remove any
                residue of the cleaning solution.
              </li>
              <li>
                Ensure that all surfaces are thoroughly cleaned and sanitized.
              </li>
              <li>
                Before reactivating the equipment, double-check that all
                surfaces are dry and free from any residue.
              </li>
              <li>Reconnect the power source and test the equipment.</li>
              <li>
                For more information, please visit{" "}
                <a
                  href="https://www.elephantsfoot.com.au/waste-room-restoration/"
                  className="underline text-efg-yellow"
                  target="_blank"
                >
                  our website
                </a>{" "}
              </li>
            </ul>
          </SectionDetails>
          <SectionContent>
            <ServiceFrequency2
              value={state.wasteRoomCleaningFrequency}
              onChange={state.setWasteRoomCleaningFrequency}
              options={options}
            />

            {/* Desktop table */}
            <div className="hidden sm:block w-full bg-neutral-75 rounded-xl p-4">
              <div className="flex flex-col text-sm xl:text-base min-w-[500px]">
                <div className="grid grid-cols-6 gap-2 border-b border-input">
                  <div className="col-span-2 px-2 py-2">Sites</div>
                  <div className="col-span-1 px-2 py-2"></div>
                  <div className="col-span-2 px-2 py-2">Area</div>
                  <div className="col-span-1 text-right px-2 py-2">Price</div>
                </div>

                {wasteRoomCleaningDetails.items.map((r, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-6 gap-2 border-b border-input last:border-b-0 text-sm xl:text-base"
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
            <div className="sm:hidden w-full flex flex-col rounded-xl bg-neutral-75 p-4">
              <div className="grid grid-cols-2 gap-2 border-b border-input text-sm xl:text-base">
                <div className="col-span-1 px-2 py-2 text-xs">Services</div>
                <div className="col-span-1 text-right px-2 py-2 text-xs">
                  Price
                </div>
              </div>
              {wasteRoomCleaningDetails.items.map((r, i) => (
                <div
                  key={`${r.site_id}-${r.building_id}-${i}`}
                  className="flex flex-row gap-2 border-b border-input last:border-b-0 text-sm xl:text-base"
                >
                  <div className="w-full px-2 py-2">
                    <div className="flex flex-col gap-1">
                      <div className="font-medium">{r.site_name}</div>
                      {r.building_name && (
                        <div className="text-xs">{r.building_name}</div>
                      )}
                      <div className="text-xs text-neutral-800">
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
              incentives={state.serviceAgreement.incentives}
            />
          </SectionContent>
        </SectionShell>
      )}

      {/* Bin Cleaning (styled like chute) */}
      {binCleaningDetails.items.length > 0 && (
        <SectionShell id="bin_cleaning">
          <SectionHeader title="Bin Cleaning" />
          <SectionDetails helpHref="https://www.elephantsfoot.com.au/service-care/">
            <ul className="list-disc pl-6 space-y-1">
              <li>
                Attach “Chute Cleaning in Progress” signs to hopper doors to
                ensure awareness that cleaning is underway.
              </li>
              <li>
                Use an environmentally friendly solution to break down any
                residue or buildup in the chute.
              </li>
              <li>
                Use high-pressure water to thoroughly clean the chute,
                dislodging any remaining debris.
              </li>
              <li>
                Wipe down and sanitize the hopper doors to maintain hygiene
                standards.
              </li>
              <li>
                High-pressure clean discharge hopper to remove any buildup or
                contaminants.
              </li>
              <li>Thoroughly clean all waste equipment.</li>
              <li>
                Ensure that the waste room is free of excess water to prevent
                slips and maintain cleanliness.
              </li>
              <li>
                Use odour-control spray to neutralize any unpleasant smells
                emanating from the waste chute, ensuring a more pleasant
                environment.
              </li>
              <li>
                For more information, please visit{" "}
                <a
                  href="https://www.elephantsfoot.com.au/service-care/"
                  className="underline text-efg-yellow"
                  target="_blank"
                >
                  our website
                </a>{" "}
              </li>
            </ul>
          </SectionDetails>
          <SectionContent>
            <ServiceFrequency2
              value={state.binCleaningFrequency}
              onChange={state.setBinCleaningFrequency}
              options={options}
            />

            {/* Desktop table */}
            <div className="hidden sm:block w-full bg-neutral-75 rounded-xl p-4">
              <div className="flex flex-col text-sm xl:text-base min-w-[500px]">
                <div className="grid grid-cols-6 gap-2 border-b border-input">
                  <div className="col-span-3 px-2 py-2">Sites</div>
                  <div className="col-span-1 px-2 py-2"></div>
                  <div className="col-span-1 px-2 py-2"></div>
                  <div className="col-span-1 text-right px-2 py-2">Price</div>
                </div>

                {binCleaningDetails.items.map((r, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-6 gap-2 border-b border-input last:border-b-0 text-sm xl:text-base"
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
            <div className="sm:hidden w-full flex flex-col rounded-xl bg-neutral-75 p-4">
              <div className="grid grid-cols-2 gap-2 border-b border-input text-sm xl:text-base">
                <div className="col-span-1 px-2 py-2 text-xs">Services</div>
                <div className="col-span-1 text-right px-2 py-2 text-xs">
                  Price
                </div>
              </div>
              {binCleaningDetails.items.map((r, i) => (
                <div
                  key={`${r.site_id}-${r.building_id}-${i}`}
                  className="flex flex-row gap-2 border-b border-input last:border-b-0 text-sm xl:text-base"
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
              incentives={state.serviceAgreement.incentives}
            />
          </SectionContent>
        </SectionShell>
      )}

      {/* Odour Control (styled like chute + units) */}
      {odourControlDetails.items.length > 0 && (
        <SectionShell id="odour_control">
          <SectionHeader title="Odour Control" />
          <SectionDetails helpHref="https://www.elephantsfoot.com.au/odour-management/">
            <ul className="list-disc pl-6 space-y-1">
              <li>
                Ensure system is clean and free of any debris, residue, or
                damage.
              </li>
              <li>Drain remaining solution.</li>
              <li>{`Pour solution into the odour management system's reservoir or container.`}</li>
              <li>Carefully inspect for any leaks, spills, or other issues.</li>
              <li>
                Test the operation of the odour management system to ensure it
                is functioning correctly.
              </li>
              <li>Inspect program and adjust if required.</li>
              <li>
                For more information, please visit{" "}
                <a
                  href="https://www.elephantsfoot.com.au/odour-management/"
                  className="underline text-efg-yellow"
                  target="_blank"
                >
                  our website
                </a>{" "}
              </li>
            </ul>
          </SectionDetails>
          <SectionContent>
            <ServiceFrequency2
              value={state.odourControlFrequency}
              onChange={state.setOdourControlFrequency}
              options={options.filter((o) => o.value === "quarterly")}
            />

            {odourQtyError && (
              <div className="text-sm xl:text-base text-destructive mt-2">
                Enter the quantity for each location
              </div>
            )}

            {(() => {
              const getKey = (r: OdourControlService) => r.id;

              // Desktop table
              return (
                <>
                  <div className="hidden sm:block w-full bg-neutral-75 rounded-xl p-4">
                    <div className="flex flex-col text-sm xl:text-base min-w-[640px]">
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
                        const frequencyValue = getFrequencyValue(
                          state.odourControlFrequency
                        );
                        const key = getKey(r);
                        const qty = state.odourControlUnits[key] ?? 0;
                        const unitPrice = getNumber(r.price);
                        const lineTotal = unitPrice * qty * frequencyValue;
                        const invalid =
                          odourQtyError && odourNeedsUnits && qty <= 0;

                        return (
                          <div
                            key={key}
                            className="grid grid-cols-7 gap-2 border-b border-input last:border-b-0 text-sm xl:text-base"
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
                  <div className="sm:hidden w-full flex flex-col rounded-xl bg-neutral-75 p-4 divide-y divide-input">
                    <div className="grid grid-cols-2 gap-2 border-b border-input text-sm xl:text-base">
                      <div className="col-span-1 px-2 py-2 text-xs">
                        Services
                      </div>
                      <div className="col-span-1 text-right px-2 py-2 text-xs">
                        Line total
                      </div>
                    </div>
                    {odourControlDetails.items.map((r) => {
                      const frequencyValue = getFrequencyValue(
                        state.odourControlFrequency
                      );
                      const key = getKey(r);
                      const qty = state.odourControlUnits[key] ?? 0;
                      const unitPrice = getNumber(r.price);
                      const lineTotal = unitPrice * qty * frequencyValue;
                      const invalid =
                        odourQtyError && odourNeedsUnits && qty <= 0;

                      return (
                        <div
                          key={key}
                          className="px-2 py-3 text-sm xl:text-base"
                        >
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
                      const frequencyValue =
                        state.odourControlFrequency === "yearly"
                          ? 1
                          : state.odourControlFrequency === "six-monthly"
                            ? 2
                            : 4;
                      const key = r.id;
                      const qty = state.odourControlUnits[key] ?? 0;
                      const unitPrice = getNumber(r.price);
                      return {
                        price: String(unitPrice * qty * frequencyValue),
                      };
                    })}
                    discountPct={discount}
                    frequency={state.odourControlFrequency}
                    incentives={state.serviceAgreement.incentives}
                  />
                </>
              );
            })()}
          </SectionContent>
        </SectionShell>
      )}

      {/* Exclusive Benefits */}
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
              <span className="text-lg text-neutral-500">
                Add services to unlock and redeem complimentary incentives from
                us — at no extra cost.
              </span>
            </div>

            <HorizontalScroller
              initialTargetSelector={
                desiredTier ? `[data-col="${desiredTier}"]` : undefined
              }
              scrollKey={desiredTier} // re-focus if tier changes
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

        <div className="flex flex-col gap-6">
          <div className="flex flex-col">
            <Label className="text-2xl xl:text-3xl mb-1">Service Summary</Label>
            <span className="ttext-lg text-neutral-500">
              Review your service plan and the total cost.
            </span>
          </div>

          <ServiceSummary />
        </div>

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
    </div>
  );
}

export default ServicesForm;
