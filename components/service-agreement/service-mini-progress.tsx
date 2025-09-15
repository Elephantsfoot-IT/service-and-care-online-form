import { useServiceAgreementStore } from "@/app/service-agreement/service-agreement-store";
import { cn } from "@/lib/utils";
import React from "react";

function ServiceMiniProgress() {
  const state = useServiceAgreementStore();
  return (
    <>
      <div className="w-fit flex flex-row gap-1">
        <div onClick={() => state.setPage(2)} className="">
          <div
            className={cn(
              "h-3 rounded-full cursor-pointer",
              state.page >= 1 ? "bg-efg-yellow" : "bg-neutral-100",
              state.page === 1 ? "w-9" : "w-3"
            )}
          ></div>
        </div>
        <div onClick={() => state.setPage(2)} className="">
          <div
            className={cn(
              "h-3 rounded-full cursor-pointer",
              state.page >= 2 ? "bg-efg-yellow" : "bg-neutral-100",
              state.page === 2 ? "w-9" : "w-3"
            )}
          ></div>
        </div>
        <div onClick={() => state.setPage(3)} className="">
          <div
            className={cn(
              "h-3  rounded-full cursor-pointer",
              state.page >= 3 ? "bg-efg-yellow" : "bg-neutral-100",
              state.page === 3 ? "w-9" : "w-3"
            )}
          ></div>
        </div>
        <div onClick={() => state.setPage(4)} className="">
          <div
            className={cn(
                "h-3 rounded-full cursor-pointer",
              state.page === 4 ? "bg-efg-yellow" : "bg-neutral-100",
              state.page === 4 ? "w-9" : "w-3"
            )}
          ></div>
        </div>
      </div>
    </>
  );
}

export default ServiceMiniProgress;
