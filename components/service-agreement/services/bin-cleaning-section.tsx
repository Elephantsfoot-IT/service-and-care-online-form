"use client";

import {
  SectionShell,
  SectionHeader,
  SectionDetails,
  SectionContent,
  EquipmentMaintenanceFooter,
} from "./service-helper";
import ServiceFrequency2 from "@/components/service-agreement/service-frequency-2";
import { GetServicesReturnTyped, MaybeOption, options } from "@/lib/interface";
import { formatMoney, getNumber } from "@/lib/utils";
import { useMemo } from "react";

type Props = {
  details: GetServicesReturnTyped<"bin_cleaning">;
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
  const groupedByBuilding = useMemo(() => {
    type Item = (typeof details.items)[number];
    const byBuilding = new Map<
      string,
      {
        siteId: string;
        siteName: string;
        buildingId: string;
        buildingName: string | null; // null/empty means "no building label"
        items: Item[];
      }
    >();

    for (const r of details.items) {
      const siteId = r.site_id;
      const siteName = r.site_name;

      // Normalise "no building" so it still groups
      const buildingId = r.building_id || "__no_building__";
      const buildingName = r.building_name ?? null;

      // Key ensures uniqueness across sites
      const key = `${siteId}::${buildingId}`;

      if (!byBuilding.has(key)) {
        byBuilding.set(key, {
          siteId,
          siteName,
          buildingId,
          buildingName,
          items: [],
        });
      }
      byBuilding.get(key)!.items.push(r);
    }

    // Sort by site name, then building name (empty first)
    return Array.from(byBuilding.values()).sort((a, b) => {
      const s = a.siteName.localeCompare(b.siteName);
      if (s !== 0) return s;
      const an = a.buildingName ?? "";
      const bn = b.buildingName ?? "";
      return an.localeCompare(bn);
    });
  }, [details.items]);
  if (details.items.length === 0) return null;
  return (
    <SectionShell id="bin_cleaning">
      <SectionHeader title="Wheelie Bin Cleaning" />
      <SectionDetails>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            Assess the bin’s condition, noting any damages or specific areas
            requiring attention.
          </li>
          <li>Remove any excess waste in the bin.</li>
          <li>
            High-pressure clean to remove grime, dirt and residue from the
            interior and exterior surfaces.
          </li>
          <li>
            Manually scrub any stubborn stains, particularly around handles,
            lids and base areas.
          </li>
          <li>Apply disinfectants to eliminate bacteria and reduce odours.</li>
          <li>
            Use an eco-friendly deodorising agent to leave the bin smelling
            fresh.
          </li>
          <li>
            Provide a report on the cleaning, noting any damages or
            recommendations for repair.
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
        <div className="hidden sm:block w-full bg-neutral-50 rounded-xl p-4 border border-input">
          <div className="flex flex-col text-sm xl:text-base min-w-[500px]">
            <div className="grid grid-cols-6 border-b border-input py-2 px-2 text-sm">
              <div className="col-span-3 ">Sites</div>
              <div className="col-span-1 ">Bin Size</div>
              <div className="col-span-1">Quantity</div>
              <div className="col-span-1 text-right ">
                Price per bin <br></br> (excl. GST)
              </div>
            </div>
            {groupedByBuilding.map((b, i) => (
              <div
                key={i}
                className="grid grid-cols-6 w-full px-2 p-2 border-b border-input last:border-b-0"
              >
                <div className="col-span-3 flex flex-col gap-1">
                  <div className="text-sm xl:text-base font-medium">
                    {b.siteName}
                  </div>
                  <div className="text-xs xl:text-sm">{b.buildingName}</div>
                </div>
                <div className="col-span-3 flex flex-col gap-1">
                  {b.items.map((item, index) => (
                    <div key={index} className="grid grid-cols-3">
                      <div className="col-span-1">{item.bin_size}</div>
                      <div className="col-span-1">{item.quantity}</div>
                      <div className="col-span-1 text-right flex-shrink-0">
                        {formatMoney(getNumber(item.price))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile */}
        <div className="sm:hidden w-full flex flex-col rounded-xl bg-neutral-50 px-2 py-4 gap-3 divide-y divide-input border border-input">
          <div className="grid grid-cols-3 gap-2 text-xs pb-2 px-2">
            <div className="col-span-1">Services</div>
            <div className="col-span-2 text-right">
              Price per system <br></br> (excl. GST)
            </div>
          </div>
          {groupedByBuilding.map((b, i) => (
            <div key={i} className="flex flex-col w-full px-2 pb-2">
              <div className="font-medium text-sm">
                {b.siteName} {b.buildingName && `- ${b.buildingName}`}
              </div>
              <div className="flex flex-col w-full gap-2 mt-2">
                {b.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-row gap-2 last:border-b-0 text-sm w-full justify-between items-center pl-1"
                  >
                    <div>
                      {item.quantity} × {item.bin_size}{" "}
                      {Number(item.quantity) > 1 ? `bins` : `bin`}
                    </div>
                    <div className="text-right w-fit flex-shrink-0">
                      {formatMoney(getNumber(item.price))}
                    </div>
                  </div>
                ))}
              </div>
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
