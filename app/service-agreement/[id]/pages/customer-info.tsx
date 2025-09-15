'use client'
import { Button } from "@/components/ui/button";

import { useServiceAgreementStore } from "@/app/service-agreement/service-agreement-store";

import { ArrowRightIcon } from "lucide-react";

function CustomerInformation() {
  const state = useServiceAgreementStore();
  const goBack = () => {
    state.setPage(1);
  };
  const handleSubmit = () => {
    state.setPage(3);
  };
  return (
    <div className="my-20 max-w-screen-md w-full mx-auto px-6">
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

export default CustomerInformation;
