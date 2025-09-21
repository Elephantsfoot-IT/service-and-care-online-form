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
  
  

/* ------------------------------ Section: Billing ------------------------------ */
export function BillingDetailsCard() {
  const state = useServiceAgreementStore();
  const fullPostalAddress = formatFullAddress(
    state.postalStreetAddress,
    state.postalCity,
    state.postalState,
    state.postalPostcode,
    "Australia"
  );

  return (
    <section className="flex flex-col gap-2 border border-input rounded-xl shadow-sm overflow-hidden bg-white">
      <header className="flex items-center gap-4 p-4 md:p-6 border-b border-input bg-neutral-50">
        <Label className="text-base xl:text-lg">Billing Details</Label>
        <Button variant="ghost" className="text-sm ml-auto">
          Edit
        </Button>
      </header>

      <div className="p-4 md:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 space-y-1">
            <Label className="text-neutral-500 text-sm">First name</Label>
            <span className="text-base break-words">
              <Value>{state.accountFirstName}</Value>
            </span>
          </div>
          <div className="flex-1 space-y-1">
            <Label className="text-neutral-500 text-sm">Last name</Label>
            <span className="text-base break-words">
              <Value>{state.accountLastName}</Value>
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 space-y-1">
            <Label className="text-neutral-500 text-sm">Mobile phone</Label>
            <span className="text-base break-words">
              <Value>{state.accountMobile}</Value>
            </span>
          </div>
          <div className="flex-1 space-y-1">
            <Label className="text-neutral-500 text-sm">Office phone</Label>
            <span className="text-base break-words">
              <Value>{state.accountPhone}</Value>
            </span>
          </div>
        </div>

        <div className="space-y-1">
          <Label className="text-neutral-500 text-sm">Email address</Label>
          <span className="text-base break-words">
            <Value>{state.accountEmail}</Value>
          </span>
        </div>

        <div className="space-y-1">
          <Label className="text-neutral-500 text-sm">Postal address</Label>
          <span className="text-base break-words">
            {fullPostalAddress ? <>{fullPostalAddress}</> : <Value />}
          </span>
        </div>
      </div>
    </section>
  );
}
