"use client";

import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem } from "@/components/ui/accordion";
import { cn, formatMoney, getNumber, getServicesValue } from "@/lib/utils";
import { ChevronDownIcon } from "lucide-react";

export function SectionShell({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <section id={id} className="flex flex-col scroll-mt-[140px] bg-white">
      {children}
    </section>
  );
}

export function SectionContent({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-4 py-8">{children}</div>;
}

export function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex flex-col">
      <div className="text-2xl xl:text-3xl flex flex-row items-center gap-2">{title}</div>
    </div>
  );
}

export function SectionDetails({
  children,
  helpHref,
}: {
  children: React.ReactNode;
  helpHref?: string;
}) {
  const [isOpen, setIsOpen] = useState<string | undefined>(undefined);
  return (
    <Accordion type="single" collapsible value={isOpen} onValueChange={setIsOpen}>
      <AccordionItem value="item-1">
        <div
          onClick={() => setIsOpen((v) => (v === "item-1" ? undefined : "item-1"))}
          className="text-sm xl:text-base text-efg-yellow mr-1 flex flex-row items-center justify-center gap-1 mt-1 hover:underline hover:text-efg-yellow/80 w-fit cursor-pointer"
        >
          Service Details
          <ChevronDownIcon
            className={cn("w-3.5 h-3.5 transition-transform duration-300", isOpen === "item-1" ? "rotate-180" : "")}
          />
        </div>
        <AccordionContent className={cn("bg-neutral-100 rounded-b-xl rounded-t-xl p-5 mt-1 h-fit accordion-down text-sm xl:text-base")}>
          {children}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

/* ---------- Footers (unchanged logic, just moved) ---------- */

export function PricingFooter({
  items,
  frequency,
  discountPct,
  incentives,
}: {
  items: Array<{ price: string }>;
  frequency: string | null;
  discountPct: number;
  incentives: boolean;
}) {
  const base = items.reduce((acc, r) => acc + getNumber(r.price), 0);
  const subtotal = getServicesValue(base || 0, frequency);
  const hasTotal = subtotal > 0;
  const showDiscount = discountPct > 0 && hasTotal && incentives;
  const discountAmt = showDiscount ? (subtotal * discountPct) / 100 : 0;
  const grandTotal = subtotal - discountAmt;
  if (grandTotal === 0) return null;

  return (
    <>
      <hr className="my-2 border border-input border-dashed" />
      <div className="space-y-2 w-full sm:max-w-[360px] ml-auto px-6">
        {showDiscount ? (
          <>
            <div className="flex justify-between text-sm xl:text-base text-emerald-600">
              <span>Service discount ({discountPct}%)</span>
              <span>-{formatMoney(discountAmt)}</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-neutral-600 text-sm xl:text-base font-medium">Annual cost (excl. GST)</span>
              <div className="text-right">
                <div className="text-sm xl:text-base line-through text-neutral-500">{formatMoney(subtotal)}</div>
                <div className="text-lg font-medium">{formatMoney(grandTotal)}</div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex justify-between items-baseline">
            <span className="text-neutral-600 text-sm xl:text-base font-medium">Annual cost (excl. GST)</span>
            <span className="text-lg font-medium">{formatMoney(grandTotal)}</span>
          </div>
        )}
      </div>
    </>
  );
}

export function ChuteFooter({
  items,
  frequency,
  discountPct,
  incentives,
}: {
  items: Array<{ price: string; chutes: string }>;
  frequency: string | null;
  discountPct: number;
  incentives: boolean;
}) {
  const base = items.reduce((acc, r) => acc + getNumber(r.price) * getNumber(r.chutes), 0);
  const subtotal = getServicesValue(base || 0, frequency);
  const hasTotal = subtotal > 0;
  const showDiscount = discountPct > 0 && hasTotal && incentives;
  const discountAmt = showDiscount ? (subtotal * discountPct) / 100 : 0;
  const grandTotal = subtotal - discountAmt;
  if (grandTotal === 0) return null;

  return (
    <>
      <hr className="my-2 border border-input border-dashed" />
      <div className="space-y-2 w-full sm:max-w-[360px] ml-auto px-6">
        {showDiscount ? (
          <>
            <div className="flex justify-between text-sm xl:text-base text-emerald-600">
              <span>Service discount ({discountPct}%)</span>
              <span>-{formatMoney(discountAmt)}</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-neutral-600 text-sm xl:text-base font-medium">Annual cost (excl. GST)</span>
              <div className="text-right">
                <div className="text-sm xl:text-base line-through text-neutral-500">{formatMoney(subtotal)}</div>
                <div className="text-lg font-medium">{formatMoney(grandTotal)}</div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex justify-between items-baseline">
            <span className="text-neutral-600 text-sm xl:text-base font-medium">Annual cost (excl. GST)</span>
            <span className="text-lg font-medium">{formatMoney(grandTotal)}</span>
          </div>
        )}
      </div>
    </>
  );
}

export function EquipmentMaintenanceFooter({
  items,
  frequency,
  discountPct,
  incentives,
}: {
  items: Array<{ price: string; quantity: string }>;
  frequency: string | null;
  discountPct: number;
  incentives: boolean;
}) {
  const base = items.reduce((acc, r) => acc + getNumber(r.price) * getNumber(r.quantity), 0);
  const subtotal = getServicesValue(base || 0, frequency);
  const hasTotal = subtotal > 0;
  const showDiscount = discountPct > 0 && hasTotal && incentives;
  const discountAmt = showDiscount ? (subtotal * discountPct) / 100 : 0;
  const grandTotal = subtotal - discountAmt;
  if (grandTotal === 0) return null;

  return (
    <>
      <hr className="my-2 border border-input border-dashed" />
      <div className="space-y-2 w-full sm:max-w-[360px] ml-auto px-6">
        {showDiscount ? (
          <>
            <div className="flex justify-between text-sm xl:text-base text-emerald-600">
              <span>Service discount ({discountPct}%)</span>
              <span>-{formatMoney(discountAmt)}</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-neutral-600 text-sm xl:text-base font-medium">Annual cost (excl. GST)</span>
              <div className="text-right">
                <div className="text-sm xl:text-base line-through text-neutral-500">{formatMoney(subtotal)}</div>
                <div className="text-lg font-medium">{formatMoney(grandTotal)}</div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex justify-between items-baseline">
            <span className="text-neutral-600 text-sm xl:text-base font-medium">Annual cost (excl. GST)</span>
            <span className="text-lg font-medium">{formatMoney(grandTotal)}</span>
          </div>
        )}
      </div>
    </>
  );
}
