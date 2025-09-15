import { useServiceAgreementStore } from "@/app/service-agreement/service-agreement-store";
import { cn } from "@/lib/utils";
import React from "react";
import { Progress } from "@/components/ui/progress";

function ServiceAgreementProgress() {
  const state = useServiceAgreementStore();
  const value = (state.page / 4) * 100;
  return (
    <>
      <div className="max-w-screen-sm w-full mx-auto flex flex-row gap-2  ">
        <Progress value={value} className="bg-neutral-200 max-w-[200px]" />
      </div>
    </>
  );
}

export default ServiceAgreementProgress;
