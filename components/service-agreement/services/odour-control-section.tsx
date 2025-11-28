"use client";

import ServiceFrequency2 from "@/components/service-agreement/service-frequency-2";
import { Input } from "@/components/ui/input";
import { GetServicesReturnTyped, MaybeOption, options } from "@/lib/interface";
import { formatMoney, getNumber, normalizeQty } from "@/lib/utils";
import {
  SectionContent,
  SectionDetails,
  SectionHeader,
  SectionShell,
} from "./service-helper";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { MinusIcon, PlusIcon } from "lucide-react";

function OdourControlFooter({
  items, // price already units * unitPrice
  discountPct,
  frequency,
  incentives,
}: {
  items: Array<{ price: string }>;
  discountPct: number;
  frequency: MaybeOption;
  incentives: boolean;
}) {
  if (!frequency) return null;
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

type Props = {
  details: GetServicesReturnTyped<"odour_control">;
  frequency: MaybeOption;
  onChangeFrequency: (v: MaybeOption) => void;
  discount: number;
  incentives: boolean;
  odourQtyError: boolean;
  odourNeedsUnits: boolean;
  odourUnits: Record<string, number>;
  setUnit: (key: string, qty: number) => void;
};

export default function OdourControlSection({
  details,
  frequency,
  onChangeFrequency,
  discount,
  incentives,
  odourQtyError,
  odourNeedsUnits,
  odourUnits,
  setUnit,
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

  const increment = (key: string) => {
    const current = odourUnits[key] ?? 0;
    setUnit(key, current + 1);
  };

  const decrement = (key: string) => {
    const current = odourUnits[key] ?? 0;
    setUnit(key, Math.max(0, current - 1)); // never below 0
  };

  return (
    <SectionShell id="odour_control">
      <SectionHeader title="Odour Control" />
      <SectionDetails>
        {/* (unchanged content) */}
        <ul className="list-disc pl-6 space-y-1">
          <li>
            Ensure system is clean and free of any debris, residue, or damage.
          </li>
          <li>Drain remaining solution.</li>
          <li>{`Pour solution into the odour management system's reservoir or container.`}</li>
          <li>Carefully inspect for any leaks, spills, or other issues.</li>
          <li>
            Test the operation of the odour management system to ensure it is
            functioning correctly.
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
          value={frequency}
          onChange={onChangeFrequency}
          options={options.filter((o) => o.value === "quarterly")}
        />

        {odourQtyError && (
          <div className="text-sm xl:text-base text-destructive mt-2">
            Enter the quantity for each location
          </div>
        )}

        {/* Desktop */}
        {/* Desktop */}
        <div className="hidden sm:block w-full bg-neutral-50 rounded-xl p-4 border border-input">
          <div className="flex flex-col text-sm xl:text-base min-w-[500px]">
            <div className="grid grid-cols-6 gap-2 border-b border-input text-sm">
              <div className="col-span-3 px-2 py-2">Sites</div>
              <div className="col-span-2 px-2 py-2">Units</div>
              <div className="col-span-1 px-2 py-2 text-right">
                Price per unit <br></br> (excl. GST)
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
                      <div className="px-2 font-semibold text-base col-span-3">
                        {site.site_name}
                      </div>

                      {site.buildings[0].items.map((r) => {
                        const key = r.id;
                        const qty = odourUnits[key] ?? 0;
                        const unitPrice = getNumber(r.price);
                        const invalid =
                          odourQtyError && odourNeedsUnits && qty <= 0;

                        return (
                          <div
                            key={key}
                            className="grid grid-cols-3 gap-2 border-b border-input last:border-b-0 col-span-3"
                          >
                            <div className="col-span-2 px-2">
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="has-[>svg]:px-1"
                                  onClick={() => decrement(key)}
                                >
                                  <MinusIcon className="size-4" />
                                </Button>
                                <Input
                                  type="text"
                                  value={qty}
                                  onChange={(e) =>
                                    setUnit(
                                      key,
                                      Number(
                                        normalizeQty(e.currentTarget.value)
                                      )
                                    )
                                  }
                                  aria-invalid={invalid}
                                  className={`h-8 w-14 flex-shrink-0 efg-input ${invalid ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="has-[>svg]:px-1"
                                  onClick={() => increment(key)}
                                >
                                  <PlusIcon className="size-4" />
                                </Button>
                              </div>
                            </div>
                            <div className="col-span-1 text-right px-2 text-neutral-700">
                              {formatMoney(unitPrice)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="px-2 font-semibold text-base">
                      {site.site_name}
                    </div>
                    {site.buildings.map((b) => (
                      <div
                        key={b.building_id}
                        className="grid grid-cols-6 gap-2"
                      >
                        <div className="px-2 text-neutral-700 font-medium col-span-3">
                          {b.building_name}
                        </div>

                        {b.items.map((r) => {
                          const key = r.id;
                          const qty = odourUnits[key] ?? 0;
                          const unitPrice = getNumber(r.price);
                          const invalid =
                            odourQtyError && odourNeedsUnits && qty <= 0;

                          return (
                            <div
                              key={key}
                              className="grid grid-cols-3 gap-2 border-b border-input last:border-b-0 col-span-3 text-neutral-700"
                            >
                              <div className="col-span-2 px-2">
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="has-[>svg]:px-1"
                                    onClick={() => decrement(key)}
                                  >
                                    <MinusIcon className="size-4" />
                                  </Button>
                                  <Input
                                    type="text"
                                    value={qty}
                                    onChange={(e) =>
                                      setUnit(
                                        key,
                                        Number(
                                          normalizeQty(e.currentTarget.value)
                                        )
                                      )
                                    }
                                    aria-invalid={invalid}
                                    className={`h-8 w-14 flex-shrink-0 efg-input ${invalid ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                  />
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="has-[>svg]:px-1"
                                    onClick={() => increment(key)}
                                  >
                                    <PlusIcon className="size-4" />
                                  </Button>
                                </div>
                              </div>
                              <div className="col-span-1 text-right px-2 text-neutral-700">
                                {formatMoney(unitPrice)}
                              </div>
                            </div>
                          );
                        })}
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
          <div className="grid grid-cols-2 gap-2 border-b border-input text-sm xl:text-base px-2 py-2">
            <div className="col-span-1 text-xs">Services</div>
            <div className="col-span-1 text-right text-xs">
              Price per unit <br /> (excl. GST)
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
                <div key={b.building_id}>
                  {/* BUILDING NAME */}
                  {b.building_name && (
                    <div className="text-sm font-medium text-neutral-700 px-2 mb-1">
                      {b.building_name}
                    </div>
                  )}

                  {/* SERVICES (items inside building) */}
                  {b.items.map((r) => {
                    const key = r.id;
                    const qty = odourUnits[key] ?? 0;
                    const unitPrice = getNumber(r.price);
                    const invalid =
                      odourQtyError && odourNeedsUnits && qty <= 0;

                    return (
                      <div
                        key={key}
                        className="flex flex-col border-b border-input last:border-b-0 px-2 py-2 text-neutral-700"
                      >
                        {/* Service Label? (Your version doesn't show one — so we skip it) */}

                        <div className="flex items-center justify-between gap-3 mt-1 pl-1">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="has-[>svg]:px-1"
                              onClick={() => decrement(key)}
                            >
                              <MinusIcon className="size-4" />
                            </Button>
                            <Input
                              id={`odour-units-${key}`}
                              inputMode="numeric"
                              type="text"
                              value={qty}
                              onChange={(e) =>
                                setUnit(
                                  key,
                                  Number(normalizeQty(e.currentTarget.value))
                                )
                              }
                              aria-invalid={invalid}
                              className={`h-8 w-14 flex-shrink-0 efg-input ${
                                invalid
                                  ? "border-destructive focus-visible:ring-destructive"
                                  : ""
                              }`}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              className="has-[>svg]:px-1"
                              onClick={() => increment(key)}
                            >
                              <PlusIcon className="size-4" />
                            </Button>
                          </div>

                          <div className="text-right">
                            <div className="text-sm">
                              {formatMoney(unitPrice)}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          ))}
        </div>

        <OdourControlFooter
          items={details.items.map((r) => {
            const frequencyValue =
              frequency === "yearly" ? 1 : frequency === "six-monthly" ? 2 : 4;
            const key = r.id;
            const qty = odourUnits[key] ?? 0;
            const unitPrice = getNumber(r.price);
            return { price: String(unitPrice * qty * frequencyValue) };
          })}
          discountPct={discount}
          frequency={frequency}
          incentives={incentives}
        />
      </SectionContent>
    </SectionShell>
  );
}
