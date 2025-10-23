"use client";

import { SectionShell, SectionHeader, SectionDetails, SectionContent, ChuteFooter } from "./service-helper";
import ServiceFrequency2 from "@/components/service-agreement/service-frequency-2";
import { GetServicesReturnTyped, MaybeOption, options } from "@/lib/interface";
import { formatMoney, getNumber } from "@/lib/utils";


type Props = {
  details: GetServicesReturnTyped<"hopper_door_inspection"> ;
  frequency: MaybeOption | null;
  onChangeFrequency: (v: MaybeOption) => void;
  discount: number;
  incentives: boolean;
};

export default function HopperDoorInspectionSection({
  details,
  frequency,
  onChangeFrequency,
  discount,
  incentives,
}: Props) {
  if (details.items.length === 0) return null;

  return (
    <SectionShell id="hopper_door_inspection">
      <SectionHeader title="Self-Closing Hopper Door Inspection" />
      <SectionDetails>
        {/* (unchanged list, trimmed for brevity) */}
        <ul className="list-disc pl-6 space-y-1">
          <li><b>Self-Closing Hopper</b> Inspect against drawings ...</li>
          <li><b>Screw Mounted Self Closing Hoppers</b> ...</li>
          <li><b>Hardware General</b> ...</li>
          <li><b>Self-Closing and Self- Latching Function</b> ...</li>
          <li><b>Seals</b> ...</li>
          <li><b>Leaves</b> ...</li>
          <li>
            For more information, please visit{" "}
            <a href="https://www.elephantsfoot.com.au/chute-door-inspection/" className="underline text-efg-yellow" target="_blank">
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
              <div className="col-span-3 px-2 py-2">Sites</div>
              <div className="col-span-1 px-2 py-2">Level</div>
              <div className="col-span-1 px-2 py-2">Chutes</div>
              <div className="col-span-1 text-right px-2 py-2">Price per chute</div>
            </div>

            {details.items.map((r, i) => (
              <div key={i} className="grid grid-cols-6 gap-2 border-b border-input last:border-b-0 text-sm xl:text-base">
                {r.building_name ? (
                  <div className="col-span-3 px-2 py-2">
                    <div className="font-medium">{r.site_name}</div>
                    <div>{r.building_name}</div>
                  </div>
                ) : (
                  <div className="col-span-3 px-2 py-2 font-medium">{r.site_name}</div>
                )}
                <div className="col-span-1 px-2 py-2">{r.levels}</div>
                <div className="col-span-1 px-2 py-2">{r.chutes}</div>
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
                </div>
              </div>
              <div className="text-right px-2 py-2 w-fit flex-shrink-0">{formatMoney(getNumber(r.price))}</div>
            </div>
          ))}
        </div>

        <ChuteFooter items={details.items} frequency={frequency} discountPct={discount} incentives={incentives} />
      </SectionContent>
    </SectionShell>
  );
}
