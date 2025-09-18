// FormVerticalProgress.tsx
"use client";
import { cn } from "@/lib/utils";

type Props = {
  activeId?: string | null;
  onJump?: (id: string) => void; // <-- add this
};
const items = [
  { id: "chute-cleaning", label: "Chute Cleaning" ,  img: '/service-icon/chute-clean.svg'},
  {
    id: "equipment-preventative-maintenance",
    label: "Equipment Preventative Maintenance",
    img: '/service-icon/clipboard.svg',
  },
  {
    id: "hopper-door-inspection",
    label: "Self-Closing Hooper Door Inspection",
    img: '/service-icon/door.svg',
  },
  { id: "waste-room-pressure-clean", label: "Waste Room Pressure Clean"  , img: '/service-icon/tag.svg'},
  
  { id: "bin-cleaning", label: "Bin Cleaning" , img: '/service-icon/bin.svg'},
  
  { id: "odour-control", label: "Odour Control" , img: '/service-icon/odour-control.svg'},
];

function FormVerticalProgress({ activeId, onJump }: Props) {
  return (
    <div className="flex flex-col gap-6">
      {items.map((it, i) => (
        <div key={it.id} className={cn(`fade-right fade-right-${(i + 1) * 100}`)}>
          <div
            className={cn(
              "flex flex-row items-center gap-4 transition-all duration-200 cursor-pointer",
              activeId === it.id ? "opacity-100" : "opacity-40"
            )}
            onClick={() => onJump?.(it.id)}
          >
            <div className="size-10 border border-input rounded-lg flex items-center justify-center shadow-xs">
              <img src={it.img} alt={it.label} className="size-4.5" />
            </div>
            <div
              className={cn("text-base ", activeId === it.id ? "underline font-medium" : "")}
            >
              <div className="text-base">{it.label}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default FormVerticalProgress;
