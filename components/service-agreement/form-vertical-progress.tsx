import React from "react";
import {
  BriefcaseBusinessIcon,
  LandmarkIcon,
  ListCheckIcon,
  MapPinIcon,
  SignatureIcon,
  UsersIcon,
} from "lucide-react";
import { useServiceAgreementStore } from "@/app/service-agreement/service-agreement-store";
import { cn } from "@/lib/utils";

function FormVerticalProgress() {
  const state = useServiceAgreementStore();

  const goToPage = (page: number) => {
    if (page > state.progress) {
      return;
    }
    state.setPage(page);
  }
  return (
    <div className="flex flex-col gap-6 ">
      <div className="fade-right fade-right-100">
        <div
          className={cn(
            "flex flex-row items-center gap-4 transition-all duration-300 cursor-pointer",
            state.page === 2 ? "opacity-100" : "opacity-40"
          )}
          onClick={() => goToPage(2)}
        >
          <div className="size-10 border border-neutral-200 rounded-md flex items-center justify-center shadow">
            <BriefcaseBusinessIcon className="size-4.5 text-neutral-600"></BriefcaseBusinessIcon>
          </div>
          <div
            className={cn(
              "text-base font-medium",
              state.page === 2 ? "underline" : ""
            )}
          >
            Company Details
          </div>
        </div>
      </div>

      <div className="fade-right fade-right-200">
        <div
          className={cn(
            "flex flex-row items-center gap-4 transition-all duration-300 cursor-pointer",
            state.page === 3 ? "opacity-100" : "opacity-40"
          )}
          onClick={() => goToPage(3)}
        >
          <div className="size-10 border border-neutral-200 rounded-md flex items-center justify-center shadow">
            <LandmarkIcon className="size-4.5 text-neutral-600"></LandmarkIcon>
          </div>
          <div
            className={cn(
              "text-base font-medium",
              state.page === 3 ? "underline" : ""
            )}
          >
            Billing Details
          </div>
        </div>
      </div>

      <div className="fade-right fade-right-300">
        <div
          className={cn(
            "flex flex-row items-center gap-4 transition-all duration-300 cursor-pointer",
            state.page === 4 ? "opacity-100" : "opacity-40"
          )}
          onClick={() => goToPage(4)}
        >
          <div className="size-10 border border-neutral-200 rounded-md flex items-center justify-center shadow">
            <UsersIcon className="size-4.5 text-neutral-600"></UsersIcon>
          </div>
          <div
            className={cn(
              "text-base font-medium",
              state.page === 4 ? "underline" : ""
            )}
          >
            Additional Contacts
          </div>
        </div>
      </div>

      <div className="fade-right fade-right-400">
        <div
          className={cn(
            "flex flex-row items-center gap-4 transition-all duration-300 cursor-pointer",
            state.page === 5 ? "opacity-100" : "opacity-40"
          )}
          onClick={() => goToPage(5)}
        >
          <div className="size-10 border border-neutral-200 rounded-md flex items-center justify-center shadow">
            <MapPinIcon className="size-4.5 text-neutral-600"></MapPinIcon>
          </div>
          <div
            className={cn(
              "text-base font-medium",
              state.page === 5 ? "underline" : ""
            )}
          >
            Site Details
          </div>
        </div>
      </div>

      <div className="fade-right fade-right-500">
        <div
          className={cn(
            "flex flex-row items-center gap-4 transition-all duration-300 cursor-pointer",
            state.page === 6 ? "opacity-100" : "opacity-40"
          )}
          onClick={() => goToPage(6)}
        >
          <div className="size-10 border border-neutral-200 rounded-md flex items-center justify-center shadow">
            <ListCheckIcon className="size-4.5 text-neutral-600"></ListCheckIcon>
          </div>
          <div
            className={cn(
              "text-base font-medium",
              state.page === 6 ? "underline" : ""
            )}
          >
            Review Details
          </div>
        </div>
      </div>

      <div className="fade-right fade-right-600">
        <div
          className={cn(
            "flex flex-row items-center gap-4 transition-all duration-300 cursor-pointer ",
            state.page === 7 ? "opacity-100" : "opacity-40"
          )}
          onClick={() => goToPage(7)}
        >
          <div className="size-10 border border-neutral-200 rounded-md flex items-center justify-center shadow">
            <SignatureIcon className="size-4.5 text-neutral-600"></SignatureIcon>
          </div>
          <div
            className={cn(
              "text-base font-medium",
              state.page === 7 ? "underline" : ""
            )}
          >
            Sign Agreement
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormVerticalProgress;
