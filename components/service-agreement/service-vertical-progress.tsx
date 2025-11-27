// FormVerticalProgress.tsx
"use client";
import { useServiceAgreementStore } from "@/app/service-agreement/service-agreement-store";
import { GetServicesReturnTyped } from "@/lib/interface";
import { cn, getServices } from "@/lib/utils";

type Props = {
  activeId?: string | null;
  onJump?: (id: string) => void;
};

const items = [
  {
    id: "chute_cleaning",
    label: "Chute Cleaning",
    img: "/service-icon/chute-clean.svg",
  },
  {
    id: "equipment_maintenance",
    label: "Equipment Preventative Maintenance",
    img: "/service-icon/clipboard.svg",
  },
  {
    id: "hopper_door_inspection",
    label: "Self-Closing Hopper Door Inspection",
    img: "/service-icon/door.svg",
  }, // fixed typo
  {
    id: "waste_room_pressure_clean",
    label: "Waste Room Pressure Clean",
    img: "/service-icon/tag.svg",
  },
  { id: "bin_cleaning", label: "Wheelie Bin Cleaning", img: "/service-icon/bin.svg" },
  {
    id: "odour_control",
    label: "Odour Control",
    img: "/service-icon/odour-control.svg",
  },
] as const;

function FormVerticalProgress({ activeId, onJump }: Props) {
  const state = useServiceAgreementStore();

  // Pull details for each service (same as in ServicesForm)
  const chuteCleaningDetails = getServices(
    state.serviceAgreement?.sites ?? [],
    "chute_cleaning"
  ) as GetServicesReturnTyped<"chute_cleaning">;

  const equipmentMaintenanceDetails = getServices(
    state.serviceAgreement?.sites ?? [],
    "equipment_maintenance"
  ) as GetServicesReturnTyped<"equipment_maintenance">;

  const selfClosingHopperDoorInspectionDetails = getServices(
    state.serviceAgreement?.sites ?? [],
    "hopper_door_inspection"
  ) as GetServicesReturnTyped<"hopper_door_inspection">;

  const wasteRoomCleaningDetails = getServices(
    state.serviceAgreement?.sites ?? [],
    "waste_room_pressure_clean"
  ) as GetServicesReturnTyped<"waste_room_pressure_clean">;

  const binCleaningDetails = getServices(
    state.serviceAgreement?.sites ?? [],
    "bin_cleaning"
  ) as GetServicesReturnTyped<"bin_cleaning">;

  const odourControlDetails = getServices(
    state.serviceAgreement?.sites ?? [],
    "odour_control"
  ) as GetServicesReturnTyped<"odour_control">;

  // Map each id to its item count
  const counts: Record<string, number> = {
    chute_cleaning: chuteCleaningDetails.items.length,
    equipment_maintenance: equipmentMaintenanceDetails.items.length,
    hopper_door_inspection: selfClosingHopperDoorInspectionDetails.items.length,
    waste_room_pressure_clean: wasteRoomCleaningDetails.items.length,
    bin_cleaning: binCleaningDetails.items.length,
    odour_control: odourControlDetails.items.length,
  };

  // Only show items that have at least one detail row
  const visibleItems = items.filter((it) => (counts[it.id] ?? 0) > 0);

  if (visibleItems.length === 0) return null;

  return (
    <div className="flex flex-col gap-6 text-neutral-800">
      {visibleItems.map((it, i) => (
        <div
          key={it.id}
          className={cn(`fade-right fade-right-${(i + 1) * 100}`)}
        >
          <div
            className={cn(
              "flex flex-row items-center gap-4 transition-all duration-200 cursor-pointer hover:opacity-100",
              activeId === it.id ? "opacity-100" : "opacity-50"
            )}
            onClick={() => onJump?.(it.id)}
          >
            <div className="size-10 border border-input rounded-lg flex items-center justify-center shadow-xs bg-white flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={it.img} alt={it.label} className="size-4.5" />
            </div>
            <div
              className={cn(
                "text-base",
                activeId === it.id ? "underline font-medium" : ""
              )}
            >
              <div className="text-base">{it.label}</div>
            </div>
          </div>
        </div>
      ))}

      {state.serviceAgreement?.incentives && <div className={cn(`fade-right fade-right-${(visibleItems.length + 1) * 100}`)}>
        <div
          className={cn(
            "flex flex-row items-center gap-4 transition-all duration-200 cursor-pointer hover:opacity-100",
            activeId === 'rewards' ? "opacity-100" : "opacity-40"
          )}
          onClick={() => onJump?.('rewards')}
        >
          <div className="size-10 border border-input rounded-lg flex items-center justify-center shadow-xs bg-white flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={"/service-icon/star.svg"} alt="Rewards" className="size-4.5" />
          </div>
          <div
            className={cn(
              "text-base",
              activeId === 'rewards' ? "underline font-medium" : ""
            )}
          >
            <div className="text-base">Complimentary Incentives</div>
          </div>
        </div>
      </div>}
    </div>
  );
}

export default FormVerticalProgress;
