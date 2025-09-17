// FormVerticalProgress.tsx
"use client";
import { cn, fastScrollToEl } from "@/lib/utils";

type Props = {
  activeId?: string | null;
};

const items = [
  { id: "chute-cleaning", label: "Chute Cleaning" },
  { id: "waste-room-pressure-clean", label: "Waste Room Pressure Clean" },
  { id: "hopper-door-inspection", label: "Self-Closing Hooper Door Inspection" },
  { id: "bin-cleaning", label: "Bin Cleaning" },
  { id: "equipment-preventative-maintenance", label: "Equipment Preventative Maintenance" },
  { id: "odour-control", label: "Odour Control" },
];

function FormVerticalProgress({ activeId }: Props) {
  const onJump = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    fastScrollToEl(el, { offset: 140, duration: 300 }); // smaller duration = faster
  };

  return (
    <div className="flex flex-col gap-6">
      {items.map((it, i) => (
        <div key={it.id} className={cn(`fade-right fade-right-${(i + 1) * 100}`)}>
          <button
            type="button"
            onClick={() => onJump(it.id)}
            className={cn(
              "flex w-full text-left items-center gap-4 transition-all duration-200 cursor-pointer",
              activeId === it.id ? "opacity-100 underline" : "opacity-50"
            )}
          >
            <div className="text-base">{it.label}</div>
          </button>
        </div>
      ))}
    </div>
  );
}

export default FormVerticalProgress;
