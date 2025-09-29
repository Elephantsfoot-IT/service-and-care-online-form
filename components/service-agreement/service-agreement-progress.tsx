import { useServiceAgreementStore } from "@/app/service-agreement/service-agreement-store";
import { Progress } from "@/components/ui/progress";

function ServiceAgreementProgress() {
  const state = useServiceAgreementStore();
  const value = ((state.page ?? 0) / 4) * 100;
  if (state.page === 1) return null;
  return (
    <>
      <div className="flex flex-col gap-2 mr-auto xl:hidden w-2/3">
        <Progress value={value} className="bg-neutral-200" />
        
      </div>
    </>
  );
}

export default ServiceAgreementProgress;
