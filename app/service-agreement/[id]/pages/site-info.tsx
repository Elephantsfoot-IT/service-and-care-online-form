'use client'
import { useServiceAgreementStore } from "@/app/service-agreement/service-agreement-store";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";

export default function SiteInfo() {
  const state = useServiceAgreementStore();
  const goBack = () => {
    state.setPage(2);
  };
  const handleSubmit = () => {
    state.setPage(4);
  };
  return (
    <div className="my-20 max-w-screen-md w-full mx-auto">
      <div className="flex flex-row gap-2 justify-end">
        <Button
          variant="secondary"
          onClick={goBack}
          className="mt-10 w-fit cursor-pointer"
        >
          Back
        </Button>
        <Button onClick={handleSubmit} className="mt-10 w-fit cursor-pointer" variant="efg">
          Continue <ArrowRightIcon />
        </Button>
      </div>
    </div>
  );
}
