"use client";

import {
  SectionShell,
  SectionHeader,
  SectionDetails,
  SectionContent,
  PricingFooter,
} from "./service-helper";
import ServiceFrequency2 from "@/components/service-agreement/service-frequency-2";
import { GetServicesReturnTyped, MaybeOption, options } from "@/lib/interface";
import { formatMoney, getNumber } from "@/lib/utils";

type Props = {
  details: GetServicesReturnTyped<"waste_room_pressure_clean">;
  frequency: MaybeOption | null;
  onChangeFrequency: (v: MaybeOption) => void;
  discount: number;
  incentives: boolean;
};

export default function WasteRoomPressureCleanSection({
  details,
  frequency,
  onChangeFrequency,
  discount,
  incentives,
}: Props) {
  if (details.items.length === 0) return null;

  return (
    <SectionShell id="waste_room_pressure_clean">
      <SectionHeader title="Waste Room Pressure Clean" />
      <SectionDetails>
        {/* (unchanged content) */}
        <ul className="list-disc pl-6 space-y-1">
          <li>Ensure that all equipment is powered off and disconnected...</li>
          <li>
            Use an environmentally friendly solution to break down residue...
          </li>
          <li>Use high-pressure water to clean the room and equipment...</li>
          <li>Rinse the equipment thoroughly...</li>
          <li>
            Ensure that all surfaces are thoroughly cleaned and sanitized.
          </li>
          <li>Before reactivating the equipment, double-check dryness...</li>
          <li>Reconnect the power source and test the equipment.</li>
          <li>
            For more information, please visit{" "}
            <a
              href="https://www.elephantsfoot.com.au/waste-room-restoration/"
              className="underline text-efg-yellow"
              target="_blank"
            >
              our website
            </a>
          </li>
        </ul>
      </SectionDetails>

      <SectionContent>
        <ServiceFrequency2
          value={frequency}
          onChange={onChangeFrequency}
          options={options}
        />

        {/* Desktop */}
        <div className="hidden sm:block w-full bg-neutral-75 rounded-xl p-4">
          <div className="flex flex-col text-sm xl:text-base min-w-[500px]">
            <div className="grid grid-cols-6 gap-2 border-b border-input">
              <div className="col-span-2 px-2 py-2">Sites</div>
              <div className="col-span-1 px-2 py-2"></div>
              <div className="col-span-2 px-2 py-2">Area</div>
              <div className="col-span-1 text-right px-2 py-2">Price</div>
            </div>

            {details.items.map((r, i) => (
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

        {/* Mobile */}
        <div className="sm:hidden w-full flex flex-col rounded-xl bg-neutral-75 p-4">
          <div className="grid grid-cols-2 gap-2 border-b border-input text-sm xl:text-base">
            <div className="col-span-1 px-2 py-2 text-xs">Services</div>
            <div className="col-span-1 text-right px-2 py-2 text-xs">Price</div>
          </div>
          {details.items.map((r, i) => (
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
          items={details.items}
          frequency={frequency}
          discountPct={discount}
          incentives={incentives}
        />
      </SectionContent>
    </SectionShell>
  );
}
