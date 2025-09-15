"use client";
import IncentiveTable from "@/components/service-agreement/incentive-table";
import { ServiceFrequency } from "@/components/service-agreement/service-frequency";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useServiceAgreementStore } from "../../service-agreement-store";

type Option = "quarterly" | "six-monthly" | "yearly";
type MaybeOption = Option | null;

type ServiceKey =
  | "chute-cleaning"
  | "equipment-maintenance"
  | "waste-room-cleaning"
  | "odour-control"
  | "self-closing-hopper-door-inspection"
  | "bin-cleaning";

type Row = { site: string; qty?: number; level?: string; price: number };

type ServiceDef = {
  key: ServiceKey;
  title: string;
  description: string;
  unitLabel: string; // "(per chute, excl. GST)" etc
  rows: Row[]; // Different prices per service
  levelLabel?: string;
};

const VISITS_PER_YEAR: Record<Exclude<Option, null>, number> = {
  yearly: 1,
  "six-monthly": 2,
  quarterly: 4,
};

const SERVICES: ServiceDef[] = [
  {
    key: "chute-cleaning",
    title: "Chutes Cleaning",
    description: "Removes build-up and odours, restores airflow hygiene.",
    unitLabel: "(per chute, excl. GST)",
    levelLabel: "Level",
    rows: [
      { site: "Darlinghurst", qty: 1, level: "Up to 10 Levels", price: 650 },
      { site: "Wahroonga", qty: 1, level: "Up to 10 Levels", price: 950 },
      { site: "Miranda ACH", qty: 1, level: "Up to 10 Levels", price: 690 },
      { site: "Miranda Mason", qty: 1, level: "Up to 10 Levels", price: 690 },
    ],
  },
  {
    key: "equipment-maintenance",
    title: "Equipment Preventative Maintenance",
    description: "Scheduled checks reduce failures, extend equipment lifespan.",
    unitLabel: "(per system, excl. GST)",
    levelLabel: "Equipment",
    rows: [
      { site: "Darlinghurst", level: "Linear With Compactor", price: 310 },
      { site: "Wahroonga", level: "Carousel with Compactor", price: 310 },
      { site: "Miranda ACH", level: "Linear", price: 310 },
      { site: "Miranda Mason", level: "Linear", price: 310 },
    ],
  },
  {
    key: "waste-room-cleaning",
    title: "Waste Room Cleaning",
    description: "Deep cleans floors, walls, touchpoints; improves hygiene.",
    unitLabel: "(per room, excl. GST)",
    levelLabel: "Area (m²)",
    rows: [
      { site: "Darlinghurst", level: "0 m² – 20 m²", price: 425.0 },
      { site: "Wahroonga", level: "21 m² – 40 m²", price: 490.0 },
      { site: "Miranda ACH", level: "41 m² – 60 m²", price: 550.0 },
      { site: "Miranda Mason", level: "61 m² – 80 m²", price: 600.0 },
    ],
  },
  {
    key: "odour-control",
    title: "Odour Control",
    description:
      "Neutralises smells at source, maintains fresher environments.",
    unitLabel: "(per system, excl. GST)",
    rows: [
      { site: "Darlinghurst", price: 180 },
      { site: "Wahroonga", price: 240 },
      { site: "Miranda ACH", price: 200 },
      { site: "Miranda Mason", price: 200 },
    ],
  },
  {
    key: "self-closing-hopper-door-inspection",
    title: "Self-Closing Hopper Door Inspection",
    description: "Tests alignment, tension, seals; ensures safe closure.",
    unitLabel: "(per door, excl. GST)",
    rows: [
      { site: "Darlinghurst", price: 150 },
      { site: "Wahroonga", price: 210 },
      { site: "Miranda ACH", price: 175 },
      { site: "Miranda Mason", price: 175 },
    ],
  },
  {
    key: "bin-cleaning",
    title: "Bin Cleaning",
    description: "Washes, sanitises bins; removes residue and pests.",
    unitLabel: "(per bin, excl. GST)",
    rows: [
      { site: "Darlinghurst", price: 140 },
      { site: "Wahroonga", price: 255 },
      { site: "Miranda ACH", price: 245 },
      { site: "Miranda Mason", price: 145 },
    ],
  },
];

function formatMoney(n: number) {
  return n.toLocaleString("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 2,
  });
}

function ServicesForm() {
  const [serviceCount, setServiceCount] = useState<number>(0);
  const [currentTier, setCurrentTier] = useState<string>("");
  const state = useServiceAgreementStore();

  const goNext = () => {
    state.setPage(2);
  };

  // one piece of state per service’s frequency (keeps your existing ServiceFrequency API)
  const [chuteCleaningFrequency, setChuteCleaningFrequency] =
    useState<MaybeOption>();
  const [equipmentMaintenanceFrequency, setEquipmentMaintenanceFrequency] =
    useState<MaybeOption>();
  const [wasteRoomCleaningFrequency, setWasteRoomCleaningFrequency] =
    useState<MaybeOption>();
  const [odourControlFrequency, setOdourControlFrequency] =
    useState<MaybeOption>();
  const [
    selfClosingHopperDoorInspectionFrequency,
    setSelfClosingHopperDoorInspectionFrequency,
  ] = useState<MaybeOption>();
  const [binCleaningFrequency, setBinCleaningFrequency] =
    useState<MaybeOption>();

  // helpers to get/set frequency by key (so we can map services cleanly)
  const getFrequency = (key: ServiceKey): MaybeOption | undefined => {
    switch (key) {
      case "chute-cleaning":
        return chuteCleaningFrequency;
      case "equipment-maintenance":
        return equipmentMaintenanceFrequency;
      case "waste-room-cleaning":
        return wasteRoomCleaningFrequency;
      case "odour-control":
        return odourControlFrequency;
      case "self-closing-hopper-door-inspection":
        return selfClosingHopperDoorInspectionFrequency;
      case "bin-cleaning":
        return binCleaningFrequency;
    }
  };
  const setFrequency = (key: ServiceKey, v: MaybeOption) => {
    switch (key) {
      case "chute-cleaning":
        return setChuteCleaningFrequency(v);
      case "equipment-maintenance":
        return setEquipmentMaintenanceFrequency(v);
      case "waste-room-cleaning":
        return setWasteRoomCleaningFrequency(v);
      case "odour-control":
        return setOdourControlFrequency(v);
      case "self-closing-hopper-door-inspection":
        return setSelfClosingHopperDoorInspectionFrequency(v);
      case "bin-cleaning":
        return setBinCleaningFrequency(v);
    }
  };

  // compute per-service total based on rows * unit price * visits
  const serviceTotals = useMemo(() => {
    const map = new Map<ServiceKey, number>();
    for (const svc of SERVICES) {
      const freq = getFrequency(svc.key);
      const visits = freq ? VISITS_PER_YEAR[freq] : 0; // 0 if not selected
      const base = svc.rows.reduce((sum, r) => sum + r.price * (r.qty || 1), 0);
      map.set(svc.key, base * visits);
    }
    return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    chuteCleaningFrequency,
    equipmentMaintenanceFrequency,
    wasteRoomCleaningFrequency,
    odourControlFrequency,
    selfClosingHopperDoorInspectionFrequency,
    binCleaningFrequency,
  ]);

  // update incentive tier selection from count of selected services
  useEffect(() => {
    const count =
      (chuteCleaningFrequency ? 1 : 0) +
      (equipmentMaintenanceFrequency ? 1 : 0) +
      (wasteRoomCleaningFrequency ? 1 : 0) +
      (odourControlFrequency ? 1 : 0) +
      (selfClosingHopperDoorInspectionFrequency ? 1 : 0) +
      (binCleaningFrequency ? 1 : 0);

    setServiceCount(count);

    if (count <= 2) setCurrentTier("");
    else if (count >= 3 && count < 4) setCurrentTier("basic");
    else if (count >= 4 && count < 6) setCurrentTier("essential");
    else if (count >= 6) setCurrentTier("pro");
    else setCurrentTier("");
  }, [
    chuteCleaningFrequency,
    equipmentMaintenanceFrequency,
    wasteRoomCleaningFrequency,
    odourControlFrequency,
    selfClosingHopperDoorInspectionFrequency,
    binCleaningFrequency,
  ]);

  return (
    <div className="my-20 max-w-screen-xl w-full mx-auto px-6">
      <div className="min-h-[200px] flex flex-col gap-10 my-20">
        {/* map all services with unique pricing */}
        {SERVICES.map((svc) => {
          const freq = getFrequency(svc.key);
          const total = serviceTotals.get(svc.key) ?? 0;

          return (
            <div
              key={svc.key}
              className="border border-neutral-200 shadow overflow-hidden "
            >
              <div className="flex flex-row items-end justify-between gap-4 border-b border-neutral-200 px-6 py-4 bg-neutral-50">
                <div>
                  <div className="text-lg font-medium">{svc.title}</div>
                  <div className="text-neutral-500">{svc.description}</div>
                </div>
                <div className="text-right">
                  <div className="text-neutral-500">Total</div>
                  <div className="text-3xl font-medium">
                    {formatMoney(total)}
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 mt-2">
                <ServiceFrequency
                  value={freq}
                  onChange={(v) => setFrequency(svc.key, v)}
                  serviceKey={svc.key}
                />
              </div>

              <div className="flex flex-col divide-y divide-neutral-200 text-sm px-6 py-4">
                <div className="grid grid-cols-6 gap-2">
                  <div className="col-span-3 px-4 py-2 font-medium">Sites</div>
                  <div className="col-span-1 px-4 py-2 font-medium">
                    {svc.rows[0].qty ? "Qty" : ""}
                  </div>
                  <div className="col-span-1 px-4 py-2 font-medium">
                    {svc.rows[0].level ? svc.levelLabel : ""}
                  </div>
                  <div className="col-span-1 text-right px-4 py-2 font-medium">
                    Price{" "}
                    <span className="font-normal text-neutral-600">
                      {svc.unitLabel}
                    </span>
                  </div>
                </div>

                {svc.rows.map((r, i) => (
                  <div key={i} className="grid grid-cols-6 gap-2">
                    <div className="col-span-3 px-4 py-2">{r.site}</div>
                    <div className="col-span-1 px-4 py-2">{r.qty}</div>
                    <div className="col-span-1 px-4 py-2">{r.level}</div>
                    <div className="col-span-1 text-right px-4 py-2 font-medium">
                      {formatMoney(r.price)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Exclusive benefits header */}
      <div className="flex flex-col gap-2 items-center">
        <div className="text-4xl font-medium text-[#1e60ad]">
          Exclusive Benefits
        </div>
        <span className="text-lg text-neutral-600">
          Enjoy our exclusive benefits when you choose additional services with
          us.
        </span>
      </div>

      {/* Incentive table */}
      <div className="w-full overflow-x-auto mt-6">
        <div className="w-full min-w-[820px]">
          <IncentiveTable
            currentTier={currentTier}
            serviceCount={serviceCount}
          />
        </div>
      </div>

      <div className="w-full flex justify-end mt-16">
        <Button className="cursor-pointer" onClick={goNext}>Continue <ArrowRightIcon></ArrowRightIcon></Button>
      </div>
    </div>
  );
}

export default ServicesForm;
