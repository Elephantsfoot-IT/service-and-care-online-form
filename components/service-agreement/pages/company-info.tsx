import { useServiceAgreementStore } from "@/app/service-agreement/service-agreement-store";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { scrollToTop } from "@/lib/utils";
import { ArrowLeftIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import { BillingDetailsCard } from "../company-info/billing-detail-card";
import { CompanyDetailsCard } from "../company-info/company-detail-card";
import { AdditionalContactsList, AdditionalContactsListHandle } from "../company-info/additional-contact-card";




function CompanyInfo() {
  const state = useServiceAgreementStore();

  const goBack = () => state.setPage(1);
  // Ref to child list
  const addlRef = useRef<AdditionalContactsListHandle>(null);

  // Next: validate additional contacts first
  const goNext = async () => {
    const ok = await addlRef.current?.handleSubmit?.();
    if (!ok) return; // stop if invalid
    state.setPage(3);
  };

  useEffect(() => {
    scrollToTop();
  }, []);
  return (
    <div className="w-full mx-auto flex flex-col gap-10">
      <div className="flex flex-col">
        <Label className="text-2xl mb-1">
          Company Details{/* or “Your information” */}
          {state?.serviceAgreement?.simpro_customer?.CompanyName
            ? ` — ${state.serviceAgreement.simpro_customer.CompanyName}`
            : ""}
        </Label>
        <span className="text-lg text-neutral-500">
          Review and update your information before continuing.
        </span>
      </div>

      <CompanyDetailsCard />
      <BillingDetailsCard />
      <AdditionalContactsList ref={addlRef} />

      {/* Nav */}
      <div className="flex flex-row gap-2 justify-between mt-10">
        <Button
          variant="outline"
          onClick={goBack}
          className="w-fit cursor-pointer"
        >
          <ArrowLeftIcon /> Back
        </Button>
        <Button
          onClick={goNext}
          className="w-[200px] cursor-pointer"
          variant="efg"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}

export default CompanyInfo;
