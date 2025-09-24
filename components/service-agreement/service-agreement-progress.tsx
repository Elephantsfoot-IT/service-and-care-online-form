import { useServiceAgreementStore } from "@/app/service-agreement/service-agreement-store";
import { Progress } from "@/components/ui/progress";

function ServiceAgreementProgress() {
  const state = useServiceAgreementStore();
  const value = (state.page ?? 0)/3 * 100;
  if (state.page === 1) return null;
  return (
    <>
      <div className="w-full flex flex-col gap-2 mr-auto xl:hidden">
       {/* <div className="text-sm text-neutral-800 font-medium">{state.page}/7</div> */}
       <div className="flex flex-row items-center justify-between">
       <div className="text-sm font-medium">
        Step {state.page} of 3
       </div>
       <div className="text-sm text-neutral-600">
        {state.page === 1 && "Services Details"}
        {state.page === 2 && "Customer Information"}
        {state.page === 3 && "Review & Sign Agreement"}
       </div>
       </div>
       
       <Progress value={value} className="bg-neutral-200" />
      </div>
    </>
  );
}

export default ServiceAgreementProgress;
