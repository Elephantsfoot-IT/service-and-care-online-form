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
import { useMemo } from "react";

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
  const groupedBySite = useMemo(() => {
    type Raw = (typeof details.items)[number];

    const siteMap = new Map<
      string, // site_id
      {
        site_id: string;
        site_name: string;
        buildings: Map<
          string, // building_id or placeholder
          {
            building_id: string;
            building_name: string | null;
            items: Raw[];
          }
        >;
      }
    >();

    for (const r of details.items) {
      const siteId = r.site_id;
      const siteName = r.site_name;

      const buildingId = r.building_id || "__no_building__";
      const buildingName = r.building_name ?? null;

      // Create site entry if missing
      if (!siteMap.has(siteId)) {
        siteMap.set(siteId, {
          site_id: siteId,
          site_name: siteName,
          buildings: new Map(),
        });
      }

      const siteEntry = siteMap.get(siteId)!;

      // Create building under site if missing
      if (!siteEntry.buildings.has(buildingId)) {
        siteEntry.buildings.set(buildingId, {
          building_id: buildingId,
          building_name: buildingName,
          items: [],
        });
      }

      siteEntry.buildings.get(buildingId)!.items.push(r);
    }

    // Return clean structured array
    return Array.from(siteMap.values()).map((site) => ({
      site_id: site.site_id,
      site_name: site.site_name,
      buildings: Array.from(site.buildings.values()),
    }));
  }, [details]);

  if (groupedBySite.length === 0) return null;

  return (
    <SectionShell id="waste_room_pressure_clean">
      <SectionHeader title="Waste Room Pressure Clean" />
      <SectionDetails>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            Ensure that all equipment is powered off and disconnected from any
            power source.
          </li>
          <li>
            Use an environmentally friendly solution to break down any residue
            or buildup on the equipment.
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
            Before reactivating the equipment, double-check that all surfaces
            are dry and free from any residue.
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
          value={frequency}
          onChange={onChangeFrequency}
          options={options}
        />

        {/* Desktop */}
        <div className="hidden sm:block w-full bg-neutral-50 rounded-xl p-4 border border-input">
          <div className="flex flex-col text-sm xl:text-base min-w-[500px]">
            <div className="grid grid-cols-6 gap-2 border-b border-input text-sm">
              <div className="col-span-3 px-2 py-2">Sites</div>
              <div className="col-span-2 px-2 py-2">Area</div>
              <div className="col-span-1 text-right px-2 py-2">
                Price per room <br></br> (excl. GST)
              </div>
            </div>

            {groupedBySite.map((site) => (
              <div
                key={site.site_id}
                className="border-b border-input py-3 flex flex-col gap-2 last:border-b-0"
              >
                {/* Buildings */}
                {site.buildings.length === 1 ? (
                  <>
                    <div className="grid grid-cols-6 gap-2">
                      {
                        <div className="px-2 font-semibold text-base col-span-3">
                          {site.site_name}
                        </div>
                      }

                      {site.buildings[0].items.map((r, i) => (
                        <div
                          key={i}
                          className="grid grid-cols-3 gap-2 border-b border-input last:border-b-0 col-span-3 text-neutral-700"
                        >
                          <div className="col-span-2 px-2 ">{r.area_label}</div>
                          <div className="col-span-1 text-right px-2 ">
                            {formatMoney(getNumber(r.price))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="px-2 font-semibold text-base col-span-3">
                      {site.site_name}
                    </div>
                    {site.buildings.map((b) => (
                      <div
                        key={b.building_id}
                        className="grid grid-cols-6 gap-2"
                      >
                        {
                          <div className="px-2 text-neutral-700 font-medium col-span-3">
                            {b.building_name}
                          </div>
                        }

                        {b.items.map((r, i) => (
                          <div
                            key={i}
                            className="grid grid-cols-3 gap-2 border-b border-input last:border-b-0 col-span-3 text-neutral-700"
                          >
                            <div className="col-span-2 px-2 ">
                              {r.area_label}
                            </div>
                            <div className="col-span-1 text-right px-2 ">
                              {formatMoney(getNumber(r.price))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Mobile */}
        <div className="sm:hidden w-full flex flex-col rounded-xl bg-neutral-50 px-2 py-4 border border-input">
          {/* Header */}
          <div className="grid grid-cols-2 gap-2 border-b border-input text-sm xl:text-base">
            <div className="col-span-1 px-2 py-2 text-xs">Services</div>
            <div className="col-span-1 text-right px-2 py-2 text-xs">
              Price per room <br /> (excl. GST)
            </div>
          </div>

          {/* Grouped Structure */}
          {groupedBySite.map((site) => (
            <div
              key={site.site_id}
              className="py-3 flex flex-col gap-2 border-b border-input last:border-b-0"
            >
              {/* SITE */}
              <div className="font-semibold text-sm px-2">{site.site_name}</div>

              {/* BUILDINGS */}
              {site.buildings.map((b) => (
                <div key={b.building_id} className="">
                  {/* BUILDING NAME */}
                  {b.building_name && (
                    <div className="text-sm font-medium text-neutral-700 px-2 mb-1">
                      {b.building_name}
                    </div>
                  )}

                  {/* SERVICES */}
                  {b.items.map((r, i) => (
                    <div
                      key={i}
                      className="flex flex-col border-b border-input last:border-b-0 2 px-2 text-neutral-700"
                    >
                      <div className="flex flex-row gap-2 items-center justify-between text-sm">
                        <div>{r.area_label}</div>
                        <div className="text-right px-2 w-fit flex-shrink-0">
                          {formatMoney(getNumber(r.price))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
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
