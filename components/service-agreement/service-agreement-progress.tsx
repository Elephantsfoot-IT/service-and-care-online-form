import { useServiceAgreementStore } from "@/app/service-agreement/service-agreement-store";
import { Progress } from "@/components/ui/progress";

function ServiceAgreementProgress() {
  const state = useServiceAgreementStore();
  const value = (state.page ?? 0)/8 * 100;
  return (
    <>
      <div className="w-full flex flex-col gap-2 mr-auto xl:hidden max-w-[200px]">
       {/* <div className="text-sm text-neutral-800 font-medium">{state.page}/7</div> */}
       <Progress value={value} className="bg-neutral-200" />
      </div>
    </>
  );
}

export default ServiceAgreementProgress;
