import { useServiceAgreementStore } from "@/app/service-agreement/service-agreement-store";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { formatFullAddress } from "@/lib/utils";


function Value({ children }: { children?: string | null }) {
    const str = typeof children === "string" ? children.trim() : "";
    if (!str) {
      return (
        <span className="text-neutral-400">
          <span aria-hidden>—</span>
          <span className="sr-only">Not provided</span>
        </span>
      );
    }
    return <>{str}</>;
  }

/* ------------------------------ Section: Company ------------------------------ */
export function CompanyDetailsCard() {
  const state = useServiceAgreementStore();
  const fullBizAddress = formatFullAddress(
    state.businessStreetAddress,
    state.businessCity,
    state.businessState,
    state.businessPostcode,
    "Australia"
  );

  return (
    <section className="flex flex-col gap-2 border border-input rounded-xl shadow-sm overflow-hidden bg-white">
      <header className="flex items-center gap-4 p-4 md:p-6 border-b border-input bg-neutral-50">
        <Label className="text-base xl:text-lg">Company Details</Label>
        <Button variant="ghost" className="text-sm ml-auto">
          Edit
        </Button>
      </header>

      <div className="p-4 md:p-6 space-y-4">
        <div className="space-y-1">
          <Label className="text-neutral-500 text-sm">Company name</Label>
          <span className="text-base break-words">
            <Value>{state.companyName}</Value>
          </span>
        </div>

        <div className="space-y-1">
          <Label className="text-neutral-500 text-sm">ABN</Label>
          <span className="text-base break-words">
            <Value>{state.abn}</Value>
          </span>
        </div>

        <div className="space-y-1">
          <Label className="text-neutral-500 text-sm">Business address</Label>
          <span className="text-base break-words">
            {fullBizAddress ? <>{fullBizAddress}</> : <Value />}
          </span>
        </div>
      </div>
    </section>
  );
}
