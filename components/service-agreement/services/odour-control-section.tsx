"use client";

import { SectionShell, SectionHeader, SectionDetails, SectionContent } from "./service-helper";
import ServiceFrequency2 from "@/components/service-agreement/service-frequency-2";
import { Input } from "@/components/ui/input";
import { formatMoney, getFrequencyValue, getNumber, normalizeQty } from "@/lib/utils";
import { GetServicesReturnTyped, MaybeOption, options } from "@/lib/interface";

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
          <span className="text-neutral-600 text-sm xl:text-base font-medium">Annual cost (excl. GST)</span>
          <div className="text-right">
            {showDiscount && <div className="text-sm xl:text-base line-through text-neutral-500">{formatMoney(subtotal)}</div>}
            <div className="text-lg font-medium">{formatMoney(grandTotal)}</div>
          </div>
        </div>
      </div>
    </>
  );
}

type Props = {
  details: GetServicesReturnTyped<"odour_control"> ;
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
  if (details.items.length === 0) return null;

  return (
    <SectionShell id="odour_control">
      <SectionHeader title="Odour Control" />
      <SectionDetails>
        {/* (unchanged content) */}
        <ul className="list-disc pl-6 space-y-1">
          <li>Ensure system is clean and free of debris...</li>
          <li>Drain remaining solution.</li>
          <li>Pour solution into the reservoir.</li>
          <li>Inspect for any leaks, spills, or other issues.</li>
          <li>Test the operation of the system.</li>
          <li>Inspect program and adjust if required.</li>
          <li>
            For more information, please visit{" "}
            <a href="https://www.elephantsfoot.com.au/odour-management/" className="underline text-efg-yellow" target="_blank">
              our website
            </a>
          </li>
        </ul>
      </SectionDetails>

      <SectionContent>
        <ServiceFrequency2 value={frequency} onChange={onChangeFrequency} options={options.filter((o) => o.value === "quarterly")} />

        {odourQtyError && <div className="text-sm xl:text-base text-destructive mt-2">Enter the quantity for each location</div>}

        {/* Desktop */}
        <div className="hidden sm:block w-full bg-neutral-75 rounded-xl p-4">
          <div className="flex flex-col text-sm xl:text-base min-w-[640px]">
            <div className="grid grid-cols-7 gap-2 border-b border-input">
              <div className="col-span-3 px-2 py-2">Sites</div>
              <div className="col-span-2 px-2 py-2">Units</div>
              <div className="col-span-1 px-2 py-2 text-right">Unit price</div>
              <div className="col-span-1 px-2 py-2 text-right">Line total</div>
            </div>

            {details.items.map((r) => {
              const frequencyValue = getFrequencyValue(frequency);
              const key = r.id;
              const qty = odourUnits[key] ?? 0;
              const unitPrice = getNumber(r.price);
              const lineTotal = unitPrice * qty * frequencyValue;
              const invalid = odourQtyError && odourNeedsUnits && qty <= 0;

              return (
                <div key={key} className="grid grid-cols-7 gap-2 border-b border-input last:border-b-0 text-sm xl:text-base">
                  <div className="col-span-3 px-2 py-2">
                    <div className="font-medium">{r.site_name}</div>
                    {r.building_name && <div>{r.building_name}</div>}
                  </div>

                  <div className="col-span-2 px-2 py-2">
                    <div className="flex items-center gap-2">
                      <Input
                        type="text"
                        value={qty}
                        onChange={(e) => setUnit(key, Number(normalizeQty(e.currentTarget.value)))}
                        aria-invalid={invalid}
                        className={`h-8 w-16 efg-input ${invalid ? "border-destructive focus-visible:ring-destructive" : ""}`}
                      />
                    </div>
                  </div>

                  <div className="col-span-1 px-2 py-2 text-right">{formatMoney(unitPrice)}</div>
                  <div className="col-span-1 px-2 py-2 text-right font-medium">{formatMoney(lineTotal)}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile */}
        <div className="sm:hidden w-full flex flex-col rounded-xl bg-neutral-75 p-4 divide-y divide-input">
          <div className="grid grid-cols-2 gap-2 border-b border-input text-sm xl:text-base">
            <div className="col-span-1 px-2 py-2 text-xs">Services</div>
            <div className="col-span-1 text-right px-2 py-2 text-xs">Line total</div>
          </div>
          {details.items.map((r) => {
            const frequencyValue = getFrequencyValue(frequency);
            const key = r.id;
            const qty = odourUnits[key] ?? 0;
            const unitPrice = getNumber(r.price);
            const lineTotal = unitPrice * qty * frequencyValue;
            const invalid = odourQtyError && odourNeedsUnits && qty <= 0;

            return (
              <div key={key} className="px-2 py-3 text-sm xl:text-base">
                <div className="mb-2">
                  <div className="font-medium">{r.site_name}</div>
                  {r.building_name && <div className="text-xs text-neutral-600">{r.building_name}</div>}
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Input
                      id={`odour-units-${key}`}
                      inputMode="numeric"
                      type="text"
                      value={qty}
                      onChange={(e) => setUnit(key, Number(normalizeQty(e.currentTarget.value)))}
                      aria-invalid={invalid}
                      className={`h-8 w-20 efg-input ${invalid ? "border-destructive focus-visible:ring-destructive" : ""}`}
                    />
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-neutral-600">Unit price</div>
                    <div className="text-sm">{formatMoney(unitPrice)}</div>
                  </div>
                </div>

                <div className="mt-2 text-right">
                  <span className="text-xs text-neutral-600 mr-2">Total</span>
                  <span className="font-medium">{formatMoney(lineTotal)}</span>
                </div>
              </div>
            );
          })}
        </div>

        <OdourControlFooter
          items={details.items.map((r) => {
            const frequencyValue = frequency === "yearly" ? 1 : frequency === "six-monthly" ? 2 : 4;
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
