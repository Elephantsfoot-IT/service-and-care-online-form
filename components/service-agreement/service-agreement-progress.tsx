import { useServiceAgreementStore } from "@/app/service-agreement/service-agreement-store";
import { cn } from "@/lib/utils";

function ServiceAgreementProgress() {
  const state = useServiceAgreementStore();
  return (
    <>
      <div className="w-fullflex flex-row gap-2 ">
        <div onClick={() => state.setPage(2)} className="flex-1">
          <div
            className={cn(
              "w-full h-2 rounded-full cursor-pointer",
              state.page >= 1 ? "bg-efg-yellow" : "bg-neutral-100"
            )}
          ></div>
        </div>
        <div onClick={() => state.setPage(2)} className="flex-1">
          <div
            className={cn(
              "w-full h-2 rounded-full cursor-pointer",
              state.page >= 2 ? "bg-efg-yellow" : "bg-neutral-100"
            )}
          ></div>
        </div>
        <div onClick={() => state.setPage(3)} className="flex-1">
          <div
            className={cn(
              "w-full h-2  rounded-full cursor-pointer",
              state.page >= 3 ? "bg-efg-yellow" : "bg-neutral-100"
            )}
          ></div>
        </div>
        <div onClick={() => state.setPage(4)} className="flex-1">
          <div
            className={cn(
              "w-full h-2 rounded-full cursor-pointer",
              state.page === 4 ? "bg-efg-yellow" : "bg-neutral-100"
            )}
          ></div>
        </div>
      </div>
      {/* <div className="w-full flex flex-row gap-2 mr-auto md:hidden">
        <Progress value={value} className="bg-neutral-200" />
      </div> */}
    </>
  );
}

export default ServiceAgreementProgress;
