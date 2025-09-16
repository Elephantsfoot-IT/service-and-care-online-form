"use client";
import { useServiceAgreementStore } from "@/app/service-agreement/service-agreement-store";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { scrollToTop } from "@/lib/utils";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { useEffect } from "react";

export default function SiteInfo() {
  const state = useServiceAgreementStore();
  const goBack = () => {
    state.setPage(3);
  };
  const handleSubmit = () => {
    state.setPage(5);
  };
  useEffect(() => {
    scrollToTop();
  }, []);
  return (
    <div className=" w-full mx-auto flex flex-col ">
      <Label className="text-xl mb-1 text-efg-dark-blue ">
        Site Information
      </Label>

      <span className="text-lg mb-10 text-neutral-500 mb-6">
        Provide the site information associated with this service agreement.
      </span>

      <div className="flex flex-row gap-2 justify-between mt-10">
        <Button
          variant="outline"
          onClick={goBack}
          className=" w-fit cursor-pointer"
        >
          <ArrowLeftIcon></ArrowLeftIcon> Back
        </Button>
        <Button
          onClick={handleSubmit}
          className=" w-[200px] cursor-pointer"
          variant="efg"
        >
          Continue <ArrowRightIcon />
        </Button>
      </div>
    </div>
  );
}
