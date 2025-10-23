"use client";

import { SectionShell, SectionHeader, SectionDetails, SectionContent, EquipmentMaintenanceFooter } from "./service-helper";
import ServiceFrequency2 from "@/components/service-agreement/service-frequency-2";
import { GetServicesReturnTyped, MaybeOption, options } from "@/lib/interface";
import { formatMoney, getNumber } from "@/lib/utils";


type Props = {
  details: GetServicesReturnTyped<"equipment_maintenance">;
  frequency: MaybeOption | null;
  onChangeFrequency: (v: MaybeOption) => void;
  discount: number;
  incentives: boolean;
};

export default function EquipmentMaintenanceSection({
  details,
  frequency,
  onChangeFrequency,
  discount,
  incentives,
}: Props) {
  if (details.items.length === 0) return null;

  return (
    <SectionShell id="equipment_maintenance">
      <SectionHeader title="Equipment Preventative Maintenance" />
      <SectionDetails>
        {/* (kept verbatim) */}
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>EDIVERTER / GARBAGE ROOM</strong>
            <ul className="list-[circle] pl-6 space-y-1">
              <li>Check/Clean and/or adjust photo sensor &amp; reflector</li>
              <li>Check and clean all limit switches (if applicable)</li>
              <li>Check power pack (if applicable)</li>
              <li>Check &amp; grease diverter bearings</li>
              <li>Check electrical actuator &amp; controls</li>
              <li>Check PLC functions &amp; all wiring</li>
              <li>Check all electronic sequencing</li>
              <li>Check and adjust the stopping position (if applicable)</li>
              <li>Check safety controls</li>
              <li>Check hopper sliding door, slides, cable condition and fusible link</li>
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
              <li>Check and grease carousel ring gear and motor pinion, adjust tension if necessary</li>
              <li>Check &amp; grease conveyor track and screw drive</li>
            </ul>
          </li>
          <li>
            For more information, please visit{" "}
            <a href="https://www.elephantsfoot.com.au/preventative-maintenance/" className="underline text-efg-yellow" target="_blank">
              our website
            </a>
          </li>
        </ul>
      </SectionDetails>

      <SectionContent>
        <ServiceFrequency2 value={frequency} onChange={onChangeFrequency} options={options} />

        {/* Desktop */}
        <div className="hidden sm:block w-full bg-neutral-75 rounded-xl p-4">
          <div className="flex flex-col text-sm xl:text-base min-w-[500px]">
            <div className="grid grid-cols-6 gap-2 border-b border-input">
              <div className="col-span-2 px-2 py-2">Sites</div>
              <div className="col-span-1 px-2 py-2"></div>
              <div className="col-span-1 px-2 py-2">Equipment</div>
              <div className="col-span-1 px-2 py-2">Quantity</div>
              <div className="col-span-1 text-right px-2 py-2">Price</div>
            </div>

            {details.items.map((r, i) => (
              <div key={i} className="grid grid-cols-6 gap-2 border-b border-input last:border-b-0 text-sm xl:text-base">
                <div className="col-span-2 px-2 py-2">
                  <div className="font-medium">{r.site_name}</div>
                  {r.building_name && <div>{r.building_name}</div>}
                </div>
                <div className="col-span-1 px-2 py-2"></div>
                <div className="col-span-1 px-2 py-2">{r.equipment_label}</div>
                <div className="col-span-1 px-2 py-2">{r.quantity}</div>
                <div className="col-span-1 text-right px-2 py-2">{formatMoney(getNumber(r.price))}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile */}
        <div className="sm:hidden w-full flex flex-col rounded-xl bg-neutral-75 p-4">
          <div className="grid grid-cols-2 gap-2 border-b border-input text-sm xl:text-base">
            <div className="col-span-1 px-2 py-2 text-xs">Services</div>
            <div className="col-span-1 text-right px-2 py-2 text-xs">Price</div>
          </div>
          {details.items.map((r, i) => (
            <div key={`${r.site_id}-${r.building_id}-${i}`} className="flex flex-row gap-2 border-b border-input last:border-b-0 text-sm xl:text-base">
              <div className="w-full px-2 py-2">
                <div className="flex flex-col gap-1">
                  <div className="font-medium">{r.site_name}</div>
                  {r.building_name && <div className="text-xs">{r.building_name}</div>}
                  <div className="text-xs text-neutral-800">Equipment: {r.equipment_label}</div>
                </div>
              </div>
              <div className="text-right px-2 py-2 w-fit flex-shrink-0">{formatMoney(getNumber(r.price))}</div>
            </div>
          ))}
        </div>

        <EquipmentMaintenanceFooter
          items={details.items}
          frequency={frequency}
          discountPct={discount}
          incentives={incentives}
        />
      </SectionContent>
    </SectionShell>
  );
}
