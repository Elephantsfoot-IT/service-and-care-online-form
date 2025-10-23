"use client";

import { SectionShell, SectionHeader, SectionDetails, SectionContent, EquipmentMaintenanceFooter } from "./service-helper";
import ServiceFrequency2 from "@/components/service-agreement/service-frequency-2";
import { GetServicesReturnTyped, MaybeOption, options } from "@/lib/interface";
import { formatMoney, getNumber } from "@/lib/utils";


type Props = {
  details: GetServicesReturnTyped<"bin_cleaning"> ;
  frequency: MaybeOption | null;
  onChangeFrequency: (v: MaybeOption) => void;
  discount: number;
  incentives: boolean;
};

export default function BinCleaningSection({
  details,
  frequency,
  onChangeFrequency,
  discount,
  incentives,
}: Props) {
  if (details.items.length === 0) return null;

  return (
    <SectionShell id="bin_cleaning">
      <SectionHeader title="Bin Cleaning" />
      <SectionDetails>
        {/* (unchanged list, trimmed) */}
        <ul className="list-disc pl-6 space-y-1">
          <li>Attach “Chute Cleaning in Progress” signs...</li>
          <li>Use an environmentally friendly solution...</li>
          <li>Use high-pressure water to thoroughly clean...</li>
          <li>Wipe down and sanitize the hopper doors...</li>
          <li>High-pressure clean discharge hopper...</li>
          <li>Thoroughly clean all waste equipment.</li>
          <li>Ensure that the waste room is free of excess water...</li>
          <li>Use odour-control spray to neutralize smells...</li>
          <li>
            For more information, please visit{" "}
            <a href="https://www.elephantsfoot.com.au/service-care/" className="underline text-efg-yellow" target="_blank">
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
              <div className="col-span-1 px-2 py-2">Size</div>
              <div className="col-span-1 px-2 py-2">Quantity</div>
              <div className="col-span-1 text-right px-2 py-2">Price</div>
            </div>

            {details.items.map((r, i) => (
              <div key={i} className="grid grid-cols-6 gap-2 border-b border-input last:border-b-0 text-sm xl:text-base">
                <div className="col-span-3 px-2 py-2">
                  <div className="font-medium">{r.site_name}</div>
                  {r.building_name && <div>{r.building_name}</div>}
                </div>
                <div className="col-span-1 px-2 py-2">{r.bin_size}</div>
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
                </div>
              </div>
              <div className="text-right px-2 py-2 w-fit flex-shrink-0">{formatMoney(getNumber(r.price))}</div>
            </div>
          ))}
        </div>

        {/* Uses EquipmentMaintenanceFooter because it multiplies quantity*price already in your original */}
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
