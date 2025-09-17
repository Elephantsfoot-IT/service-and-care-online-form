import React from "react";
import {
  BriefcaseBusinessIcon,
  LandmarkIcon,
  Layers3Icon,
  ListCheckIcon,
  MapPinIcon,
  SignatureIcon,
  UsersIcon,
} from "lucide-react";
import { useServiceAgreementStore } from "@/app/service-agreement/service-agreement-store";
import { cn } from "@/lib/utils";

type Step = {
  page: number;
  label: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  fadeClass: string; // keeps your existing staggered animations
};

const steps: Step[] = [
  { page: 1, label: "Services Details", Icon: Layers3Icon, fadeClass: "fade-right fade-right-100" },
  { page: 2, label: "Company Details",  Icon: BriefcaseBusinessIcon, fadeClass: "fade-right fade-right-200" },
  { page: 3, label: "Billing Details",  Icon: LandmarkIcon,           fadeClass: "fade-right fade-right-300" },
  { page: 4, label: "Additional Contacts", Icon: UsersIcon,           fadeClass: "fade-right fade-right-400" },
  { page: 5, label: "Site Details",      Icon: MapPinIcon,            fadeClass: "fade-right fade-right-500" },
  { page: 6, label: "Review Details",    Icon: ListCheckIcon,         fadeClass: "fade-right fade-right-600" },
  { page: 7, label: "Sign Agreement",    Icon: SignatureIcon,         fadeClass: "fade-right fade-right-700" },
];

function FormVerticalProgress() {
  const state = useServiceAgreementStore();

  const goToPage = (page: number) => {
    if (page > state.progress) return;
    state.setPage(page);
  };

  return (
    <div className="flex flex-col gap-6">
      {steps.map(({ page, label, Icon, fadeClass }) => {
        const isActive = state.page === page;
        const isLocked = page > state.progress;

        return (
          <div key={page} className={fadeClass}>
            <button
              type="button"
              onClick={() => goToPage(page)}
              disabled={isLocked}
              aria-current={isActive ? "step" : undefined}
              className={cn(
                "flex w-full items-center gap-4 transition-all duration-200",
                isActive ? "opacity-100" : "opacity-40",
                isLocked ? "cursor-not-allowed" : "cursor-pointer"
              )}
            >
              <div className="size-10 border border-neutral-200 rounded-md flex items-center justify-center shadow-xs">
                <Icon className="size-4.5 text-neutral-600" />
              </div>
              <div className={cn("text-base", isActive && "underline")}>
                {label}
              </div>
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default FormVerticalProgress;
