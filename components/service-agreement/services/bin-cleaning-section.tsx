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
    <SectionShell id="bin_cleaning">
      <SectionHeader title="Wheelie Bin Cleaning" />
      <SectionDetails>
        <ul className="list-disc pl-6 space-y-1">
          <li>
           {` Assess the bin's condition, noting any damages or specific areas
            requiring attention.`}
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
              <div className="col-span-1 ">Quantity</div>
              <div className="col-span-2 text-right ">
                Total Price <br></br> (excl. GST)
              </div>
            </div>

            {groupedBySite.map((site) => (
              <div
                key={site.site_id}
                className="border-b border-input last:border-b-0"
              >
                {site.buildings.length === 1 ? (
                  // Single building - show site name, then totals
                  <div className="grid grid-cols-6 w-full px-2 p-2">
                    <div className="col-span-3 flex flex-col gap-1">
                      <div className="text-sm xl:text-base font-medium">
                        {site.site_name}
                      </div>
                      <div className="text-xs xl:text-sm">
                        {site.buildings[0].building_name}
                      </div>
                    </div>
                    <div className="col-span-3 flex items-center">
                      <div className="grid grid-cols-3 w-full">
                        <div className="col-span-1">
                          {site.buildings[0].items.reduce(
                            (sum, item) => sum + getNumber(item.quantity),
                            0
                          )}
                        </div>
                        <div className="col-span-2 text-right">
                          {formatMoney(
                            site.buildings[0].items.reduce(
                              (sum, item) =>
                                sum +
                                getNumber(item.price) * getNumber(item.quantity),
                              0
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Multiple buildings - show site name, then each building
                  <>
                    <div className="px-2 pt-2">
                      <div className="text-sm xl:text-base font-semibold">
                        {site.site_name}
                      </div>
                    </div>
                    {site.buildings.map((b) => (
                      <div
                        key={b.building_id}
                        className="grid grid-cols-6 w-full px-2 pb-2"
                      >
                        <div className="col-span-3 flex flex-col gap-1">
                          <div className="text-sm xl:text-base font-medium text-neutral-700">
                            {b.building_name}
                          </div>
                        </div>
                        <div className="col-span-3 flex items-center">
                          <div className="grid grid-cols-3 w-full">
                            <div className="col-span-1">
                              {b.items.reduce(
                                (sum, item) => sum + getNumber(item.quantity),
                                0
                              )}
                            </div>
                            <div className="col-span-2 text-right">
                              {formatMoney(
                                b.items.reduce(
                                  (sum, item) =>
                                    sum +
                                    getNumber(item.price) *
                                      getNumber(item.quantity),
                                  0
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Mobile */}
        <div className="sm:hidden w-full flex flex-col rounded-xl bg-neutral-50 px-2 py-4 gap-3 divide-y divide-input border border-input">
          <div className="grid grid-cols-3 gap-2 text-xs pb-2 px-2">
            <div className="col-span-1">Services</div>
            <div className="col-span-2 text-right">
              Total Price <br></br> (excl. GST)
            </div>
          </div>
          {groupedBySite.map((site) => (
            <div key={site.site_id} className="flex flex-col w-full px-2 pb-2">
              <div className="font-semibold text-sm">{site.site_name}</div>
              {site.buildings.map((b) => (
                <div key={b.building_id} className="mt-2">
                  {b.building_name && (
                    <div className="font-medium text-sm text-neutral-700 mb-1">
                      {b.building_name}
                    </div>
                  )}
                  <div className="flex flex-row gap-2 text-sm w-full justify-between items-center pl-2">
                    <div>
                      {b.items.reduce(
                        (sum, item) => sum + getNumber(item.quantity),
                        0
                      )}{" "}
                      {b.items.reduce(
                        (sum, item) => sum + getNumber(item.quantity),
                        0
                      ) === 1
                        ? "bin"
                        : "bins"}
                    </div>
                    <div className="text-right w-fit flex-shrink-0">
                      {formatMoney(
                        b.items.reduce(
                          (sum, item) =>
                            sum +
                            getNumber(item.price) * getNumber(item.quantity),
                          0
                        )
                      )}
                    </div>
                  </div>
                </div>
              ))}
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