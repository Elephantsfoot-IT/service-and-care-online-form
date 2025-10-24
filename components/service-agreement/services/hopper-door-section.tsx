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
  if (details.items.length === 0) return null;

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

            {details.items.map((r, i) => (
              <div
                key={i}
                className="grid grid-cols-6 gap-2 border-b border-input last:border-b-0 "
              >
                {r.building_name ? (
                  <div className="col-span-3 px-2 py-2 flex flex-col gap-1">
                    <div className="font-medium text-sm xl:text-base">
                      {r.site_name}
                    </div>
                    <div className="text-xs xl:text-sm">{r.building_name}</div>
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
        {/* Mobile */}
        <div className="sm:hidden w-full flex flex-col rounded-xl bg-neutral-50 px-2 py-4 border border-input">
          <div className="grid grid-cols-2 gap-2 border-b border-input text-sm xl:text-base">
            <div className="col-span-1 px-2 py-2 text-xs">Services</div>
            <div className="col-span-1 text-right px-2 py-2 text-xs">
              Price per chute <br></br> (excl. GST)
            </div>
          </div>
          {details.items.map((r, i) => (
            <div
              key={i}
              className="flex flex-col border-b border-input last:border-b-0 py-2 px-2"
            >
              <div className="font-medium text-sm">
                {r.site_name} {r.building_name && `- ${r.building_name}`}
              </div>
              <div className="flex flex-row gap-2 items-center justify-between text-sm pl-1">
                <div className="flex flex-col gap-1">
                  <div className="flex flex-row gap-2 items-center">
                    <div className="">{r.levels} Levels</div> -
                    <div className="">{r.chutes} Chutes</div>
                  </div>
                </div>

                <div className="text-right px-2 py-2 w-fit flex-shrink-0">
                  {formatMoney(getNumber(r.price))}
                </div>
              </div>
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
