'use client'
import { useServiceAgreementStore } from "@/app/service-agreement/service-agreement-store";
import { Button } from "@/components/ui/button";
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
    <div className="my-20 max-w-screen-md w-full mx-auto">
      <div className="my-10 min-h-[200vh] bg-neutral-50">
       
      </div>
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
