"use client";
import { useServiceAgreementStore } from "@/app/service-agreement/service-agreement-store";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { scrollToTop } from "@/lib/utils";
import { ArrowRightIcon } from "lucide-react";
import { useEffect } from "react";

export default function SiteInfo() {
  const state = useServiceAgreementStore();
  const goBack = () => {
    state.setPage(2);
  };
  const handleSubmit = () => {
    state.setPage(4);
  };
  useEffect(() => {
    scrollToTop();
  }, []);
  return (
    <div className="my-12 max-w-screen-sm w-full mx-auto flex flex-col ">
      <Label className="text-3xl mb-1 text-efg-dark-blue ">
        Site Information
      </Label>
      <span className="text-lg mb-10 text-neutral-500 mb-6">
        Provide the site information associated with this service agreement.
      </span>
     
      <div className="flex flex-row gap-2 justify-end">
        <Button
          variant="secondary"
          onClick={goBack}
          className="mt-10 w-fit cursor-pointer"
        >
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          className="mt-10 w-fit cursor-pointer"
          variant="efg"
        >
          Continue <ArrowRightIcon />
        </Button>
      </div>
    </div>
  );
}
