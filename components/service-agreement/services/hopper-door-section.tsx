"use client";

import {
  SectionShell,
  SectionHeader,
  SectionDetails,
  SectionContent,
  ChuteFooter,
} from "./service-helper";
import ServiceFrequency2 from "@/components/service-agreement/service-frequency-2";
import { GetServicesReturnTyped, MaybeOption, options } from "@/lib/interface";
import { formatMoney, getNumber } from "@/lib/utils";
import { useMemo } from "react";

type Props = {
  details: GetServicesReturnTyped<"hopper_door_inspection">;
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
    <SectionShell id="hopper_door_inspection">
      <SectionHeader title="Self-Closing Hopper Door Inspection" />
      <SectionDetails>
        {/* (unchanged list, trimmed for brevity) */}
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <b>Self-Closing Hopper</b> Inspect against drawings that
            self-closing hoppers have been added, removed or modified. Check
            overall dimensioning of the self-closing hopper i.e. gaps, leaf and
            the door frame are in accordance with the relevant test report
          </li>
          <li>
            <b>Screw Mounted Self Closing Hoppers (where applicable)</b> Inspect
            to ensure screw fixings are all present and engaged in the frame
            securely and are in accordance with the relevant test report
          </li>
          <li>
            <b>Hardware General</b>
            <ul className="list-[circle] pl-6 space-y-1">
              <li>
                Locksets, latches, closers, pivots and hinges: Inspect all
                hardware required for closing and latching is fitted and is a
                make and model that has been fire tested for the specific
                self-closing hopper.
              </li>
              <li>
                Inspect all hardware is located correctly, securely attached and
                operational with the correct fittings in accordance with the
                requirements of the relevant test report.
              </li>
              <li>
                Inspect the door leaf and door frame are free from non-approved
                fittings, fixings, or attachments and free from damage caused by
                relocation of hardware items.
              </li>
            </ul>
          </li>
          <li>
            <b>Self-Closing and Self- Latching Function</b>
            <ul className="list-[circle] pl-6 space-y-1">
              <li>
                Verify the opening and closing forces are such that the
                self-closing hoppers can be easily opened and closed in normal
                conditions.
              </li>
              <li>
                Inspect the door leaf and door set is self-closing and
                self-latching if appropriate.
              </li>
            </ul>
          </li>
          <li>
            <b>Seals</b> Inspect any installed door seals are approved for us on
            the proprietary door type, functioning as intended and are not
            damaged.
          </li>
          <li>
            <b>Leaves</b>
            <ul className="list-[circle] pl-6 space-y-1">
              <li>
                Inspect panel to ensure it is free of any visible delamination,
                and other damage.
              </li>
              <li>
                Inspect that the any perimeter seal is in good condition and not
                damaged.
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
          value={frequency}
          onChange={onChangeFrequency}
          options={options}
        />

        {/* Desktop */}
        <div className="hidden sm:block w-full bg-neutral-50 rounded-xl p-4 border border-input">
          <div className="flex flex-col text-sm xl:text-base min-w-[500px]">
            <div className="grid grid-cols-6 gap-2 border-b border-input text-sm">
              <div className="col-span-3 px-2 py-2">Sites</div>
              <div className="col-span-1 px-2 py-2">Level</div>
              <div className="col-span-1 px-2 py-2">Chutes</div>
              <div className="col-span-1 text-right px-2 py-2">
                Price per chute <br></br> (excl. GST)
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
                          className="grid grid-cols-3 gap-2 border-b border-input last:border-b-0 col-span-3"
                        >
                          <div className="col-span-1 px-2 ">{r.levels}</div>
                          <div className="col-span-1 px-2 ">{r.chutes}</div>
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
                            <div className="col-span-1 px-2 ">{r.levels}</div>
                            <div className="col-span-1 px-2 ">{r.chutes}</div>
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

        <div className="sm:hidden w-full flex flex-col rounded-xl bg-neutral-50 px-2 py-4 border border-input">
          {/* Header */}
          <div className="grid grid-cols-2 gap-2 border-b border-input text-sm xl:text-base">
            <div className="col-span-1 px-2 py-2 text-xs">Services</div>
            <div className="col-span-1 text-right px-2 py-2 text-xs">
              Price per chute <br /> (excl. GST)
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
                        <div>{r.levels} Levels</div>
                        <div>{r.chutes} Chutes</div>
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

        <ChuteFooter
          items={details.items}
          frequency={frequency}
          discountPct={discount}
          incentives={incentives}
        />
      </SectionContent>
    </SectionShell>
  );
}
