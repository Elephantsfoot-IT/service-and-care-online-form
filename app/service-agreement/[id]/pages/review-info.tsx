"use client";

/* ------------------------------ Imports ------------------------------ */
import { useServiceAgreementStore } from "@/app/service-agreement/service-agreement-store";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { GetServicesReturnTyped, MaybeOption } from "@/lib/interface";
import {
  cn,
  formatMoney,
  getDiscount,
  getServiceAnualCost,
  getServices,
  getServicesValue,
  scrollToTop,
} from "@/lib/utils";
import { ArrowLeftIcon } from "lucide-react";
import { useEffect, useMemo } from "react";

/* ------------------------------ Small helpers ------------------------------ */
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

function formatFullAddress(
  street?: string,
  city?: string,
  state?: string,
  postcode?: string,
  country?: string
) {
  if (!street || !city || !state || !postcode || !country) return null;
  return `${street}, ${city} ${state} ${postcode}, ${country}`;
}

/* ------------------------------ Section: Company ------------------------------ */
function CompanyDetailsCard() {
  const state = useServiceAgreementStore();
  const fullBizAddress = formatFullAddress(
    state.businessStreetAddress,
    state.businessCity,
    state.businessState,
    state.businessPostcode,
    "Australia"
  );

  return (
    <section className="flex flex-col gap-2 border border-input rounded-lg shadow-xs overflow-hidden bg-white">
      <header className="flex items-center gap-4 p-4 md:p-6 border-b border-input ">
        <Label className="text-lg">Company Details</Label>
        <Button
          variant="ghost"
          className="text-sm ml-auto"
          onClick={() => state.setPage(2)}
        >
          Edit
        </Button>
      </header>

      <div className="p-4 md:p-6 space-y-4">
        <div className="space-y-1">
          <Label className="text-neutral-500 text-sm">
            {state.companyType === "Other"
              ? "Company name"
              : "Strata plan number (CTS/SP/OC)"}
          </Label>
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

/* ------------------------------ Section: Billing ------------------------------ */
function BillingDetailsCard() {
  const state = useServiceAgreementStore();
  const fullPostalAddress = formatFullAddress(
    state.postalStreetAddress,
    state.postalCity,
    state.postalState,
    state.postalPostcode,
    "Australia"
  );

  return (
    <section className="flex flex-col gap-2 border border-input rounded-lg shadow-xs overflow-hidden bg-white">
      <header className="flex items-center gap-4 p-4 md:p-6 border-b border-input ">
        <Label className="text-lg">Billing Details</Label>
        <Button
          variant="ghost"
          className="text-sm ml-auto"
          onClick={() => state.setPage(3)}
        >
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

/* ------------------------------ Section: Additional Contacts ------------------------------ */
function AdditionalContactsList() {
  const state = useServiceAgreementStore();

  if (!state.additionalContacts?.length) return null;

  return (
    <>
      {state.additionalContacts.map((contact, index) => (
        <section
          key={contact.id}
          className="flex flex-col gap-2 border border-input rounded-lg shadow-xs overflow-hidden bg-white"
        >
          <header className="flex items-center gap-4 p-4 md:p-6 border-b border-input ">
            <Label className="text-lg">Contact ({index + 1})</Label>
            <Button
              variant="ghost"
              className="text-sm ml-auto"
              onClick={() => useServiceAgreementStore.getState().setPage(4)}
            >
              Edit
            </Button>
          </header>

          <div className="p-4 md:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 space-y-1">
                <Label className="text-neutral-500 text-sm">First name</Label>
                <span className="text-base break-words">
                  <Value>{contact.GivenName}</Value>
                </span>
              </div>
              <div className="flex-1 space-y-1">
                <Label className="text-neutral-500 text-sm">Last name</Label>
                <span className="text-base break-words">
                  <Value>{contact.FamilyName}</Value>
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 space-y-1">
                <Label className="text-neutral-500 text-sm">Mobile phone</Label>
                <span className="text-base break-words">
                  <Value>{contact.CellPhone}</Value>
                </span>
              </div>
              <div className="flex-1 space-y-1">
                <Label className="text-neutral-500 text-sm">
                  Email address
                </Label>
                <span className="text-base break-words">
                  <Value>{contact.Email}</Value>
                </span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 space-y-1">
                <Label className="text-neutral-500 text-sm">Position</Label>
                <span className="text-base break-words">
                  <Value>{contact.Position}</Value>
                </span>
              </div>
            </div>
          </div>
        </section>
      ))}
    </>
  );
}

/* ------------------------------ Section: Sites & their Contacts ------------------------------ */
function SitesSummaryList() {
  const state = useServiceAgreementStore();
  const sites = state.serviceAgreement?.sites ?? [];
  if (!sites.length) return null;

  return (
    <>
      {sites.map((site, idx) => {
        const addr = formatFullAddress(
          site.site_address?.Address,
          site.site_address?.City,
          site.site_address?.State,
          site.site_address?.PostalCode,
          site.site_address?.Country || "Australia"
        );

        return (
          <section
            key={site.simpro_site_id}
            className="flex flex-col gap-2 border border-input rounded-lg shadow-xs overflow-hidden bg-white"
          >
            <header className="flex items-center gap-4 p-4 md:p-6 border-b border-input ">
              <Label className="text-lg">Site ({idx + 1})</Label>
              <Button
                variant="ghost"
                className="text-sm ml-auto"
                onClick={() => state.setPage(5)}
              >
                Edit
              </Button>
            </header>

            <div className="p-4 md:p-6 space-y-4">
              <div className="space-y-1">
                <Label className="text-neutral-500 text-sm">Site name</Label>
                <span className="text-base break-words">
                  <Value>{site.site_name}</Value>
                </span>
              </div>

              <div className="space-y-1">
                <Label className="text-neutral-500 text-sm">Address</Label>
                <span className="text-base break-words">
                  {addr ? <>{addr}</> : <Value />}
                </span>
              </div>

              {!!site.site_contacts?.length && (
                <div className="space-y-3">
                  <Label className="text-neutral-500 text-sm">Contacts</Label>

                  {site.site_contacts.map((c, i) => (
                    <div
                      key={c.id}
                      className="border border-input rounded-lg overflow-hidden"
                    >
                      <div className="p-3 md:p-4 border-b border-input bg-neutral-50">
                        <Label className="text-base">Contact ({i + 1})</Label>
                      </div>

                      <div className="p-3 md:p-4 space-y-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="flex-1 space-y-1">
                            <Label className="text-neutral-500 text-sm">
                              First name
                            </Label>
                            <span className="text-base break-words">
                              <Value>{c.GivenName}</Value>
                            </span>
                          </div>
                          <div className="flex-1 space-y-1">
                            <Label className="text-neutral-500 text-sm">
                              Last name
                            </Label>
                            <span className="text-base break-words">
                              <Value>{c.FamilyName}</Value>
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="flex-1 space-y-1">
                            <Label className="text-neutral-500 text-sm">
                              Mobile phone
                            </Label>
                            <span className="text-base break-words">
                              <Value>{c.CellPhone}</Value>
                            </span>
                          </div>
                          <div className="flex-1 space-y-1">
                            <Label className="text-neutral-500 text-sm">
                              Email address
                            </Label>
                            <span className="text-base break-words">
                              <Value>{c.Email}</Value>
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="flex-1 space-y-1">
                            <Label className="text-neutral-500 text-sm">
                              Position
                            </Label>
                            <span className="text-base break-words">
                              <Value>{c.Position}</Value>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        );
      })}
    </>
  );
}

/* ------------------------------ Services ------------------------------ */
function ServicesList() {
  const state = useServiceAgreementStore();

  const numberOfServices = useMemo(() => {
    const vals = [
      state.chuteCleaningFrequency,
      state.equipmentMaintenanceFrequency,
      state.wasteRoomCleaningFrequency,
      state.odourControlFrequency,
      state.selfClosingHopperDoorInspectionFrequency,
      state.binCleaningFrequency,
    ];
    return vals.filter((v): v is NonNullable<typeof v> => v != null).length;
  }, [
    state.chuteCleaningFrequency,
    state.equipmentMaintenanceFrequency,
    state.wasteRoomCleaningFrequency,
    state.odourControlFrequency,
    state.selfClosingHopperDoorInspectionFrequency,
    state.binCleaningFrequency,
  ]);

  // Map value -> display label
  const freqLabel = (v: MaybeOption) =>
    v === "quarterly" ? "Quarterly"
    : v === "six-monthly" ? "Six-Monthly"
    : v === "yearly" ? "Yearly"
    : "Not selected";

  // Gather items for each service type
  const chuteCleaningDetails = getServices(
    state.serviceAgreement?.sites ?? [],
    "chute_cleaning"
  ) as GetServicesReturnTyped<"chute_cleaning">;
  const equipmentMaintenanceDetails = getServices(
    state.serviceAgreement?.sites ?? [],
    "equipment_maintenance"
  ) as GetServicesReturnTyped<"equipment_maintenance">;
  const selfClosingHopperDoorInspectionDetails = getServices(
    state.serviceAgreement?.sites ?? [],
    "hopper_door_inspection"
  ) as GetServicesReturnTyped<"hopper_door_inspection">;
  const wasteRoomCleaningDetails = getServices(
    state.serviceAgreement?.sites ?? [],
    "waste_room_pressure_clean"
  ) as GetServicesReturnTyped<"waste_room_pressure_clean">;
  const binCleaningDetails = getServices(
    state.serviceAgreement?.sites ?? [],
    "bin_cleaning"
  ) as GetServicesReturnTyped<"bin_cleaning">;
  const odourControlDetails = getServices(
    state.serviceAgreement?.sites ?? [],
    "odour_control"
  ) as GetServicesReturnTyped<"odour_control">;

  // Annual costs per service (0 if no frequency)
  const chuteAnnual = getServiceAnualCost(
    chuteCleaningDetails.items,
    state.chuteCleaningFrequency
  );
  const equipAnnual = getServiceAnualCost(
    equipmentMaintenanceDetails.items,
    state.equipmentMaintenanceFrequency
  );
  const hopperAnnual = getServiceAnualCost(
    selfClosingHopperDoorInspectionDetails.items,
    state.selfClosingHopperDoorInspectionFrequency
  );
  const wasteAnnual = getServiceAnualCost(
    wasteRoomCleaningDetails.items,
    state.wasteRoomCleaningFrequency
  );
  const binAnnual = getServiceAnualCost(
    binCleaningDetails.items,
    state.binCleaningFrequency
  );
  const odourAnnual = getServiceAnualCost(
    odourControlDetails.items,
    state.odourControlFrequency
  );

  // Totals + discount
  const discountPct = getDiscount(numberOfServices);
  const subtotal =
    chuteAnnual +
    equipAnnual +
    hopperAnnual +
    wasteAnnual +
    binAnnual +
    odourAnnual;
  const discountAmt = discountPct ? (subtotal * discountPct) / 100 : 0;
  const grandTotal = subtotal - discountAmt;

  // Row renderer (hides services with no items)
  const Row = ({
    label,
    freq,
    amount,
    hasItems,
  }: {
    label: string;
    freq: MaybeOption;
    amount: number;
    hasItems: boolean;
  }) => {
    if (!hasItems) return null;
    const selected = freq !== null;
    return (
      <div className="grid grid-cols-12 items-center py-2">
        <Label className="col-span-6 text-base">{label}</Label>
        <div className={cn("col-span-3 text-sm", selected ? "text-neutral-900" : "text-neutral-500")}>
          {freqLabel(freq)}
        </div>
        <div className="col-span-3 text-right text-base font-medium">
          {formatMoney(amount)}
        </div>
      </div>
    );
  };

  return (
    <section className="flex flex-col gap-2 border border-input rounded-lg shadow-xs overflow-hidden bg-white">
      <header className="flex items-center gap-4 p-4 md:p-6 border-b border-input">
        <Label className="text-lg">Services</Label>
        <Button
          variant="ghost"
          className="text-sm ml-auto"
          onClick={() => state.setPage(1)}
        >
          Edit
        </Button>
      </header>

      <div className="p-4 md:p-6 space-y-2 divide-y divide-input">
        {state.chuteCleaningFrequency && <Row
          label="Chute Cleaning"
          freq={state.chuteCleaningFrequency}
          amount={chuteAnnual}
          hasItems={chuteCleaningDetails.items.length > 0}
        />}
        {state.equipmentMaintenanceFrequency && <Row
          label="Equipment Preventative Maintenance"
          freq={state.equipmentMaintenanceFrequency}
          amount={equipAnnual}
          hasItems={equipmentMaintenanceDetails.items.length > 0}
        />}
        {state.selfClosingHopperDoorInspectionFrequency && <Row
          label="Self-Closing Hopper Door Inspection"
          freq={state.selfClosingHopperDoorInspectionFrequency}
          amount={hopperAnnual}
          hasItems={selfClosingHopperDoorInspectionDetails.items.length > 0}
        />}
        {state.wasteRoomCleaningFrequency && <Row
          label="Waste Room Pressure Clean"
          freq={state.wasteRoomCleaningFrequency}
          amount={wasteAnnual}
          hasItems={wasteRoomCleaningDetails.items.length > 0}
        />}
        {state.binCleaningFrequency && <Row
          label="Bin Cleaning"
          freq={state.binCleaningFrequency}
          amount={binAnnual}
          hasItems={binCleaningDetails.items.length > 0}
        />}
        {state.odourControlFrequency && <Row
          label="Odour Control"
          freq={state.odourControlFrequency}
          amount={odourAnnual}
          hasItems={odourControlDetails.items.length > 0}
        />}

        {/* Totals */}
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-neutral-600">Subtotal</span>
            <span className="font-medium">{formatMoney(subtotal)}</span>
          </div>

          {discountPct > 0 && (
            <>
              <div className="flex justify-between text-sm text-emerald-700">
                <span>Service discount ({discountPct}%)</span>
                <span>-{formatMoney(discountAmt)}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-neutral-600 text-sm font-medium">Annual cost (excl. GST)</span>
                <div className="text-right">
                  <div className="text-sm line-through text-neutral-500">
                    {formatMoney(subtotal)}
                  </div>
                  <div className="text-base font-semibold">
                    {formatMoney(grandTotal)}
                  </div>
                </div>
              </div>
            </>
          )}

          {discountPct === 0 && (
            <div className="flex justify-between items-baseline">
              <span className="text-neutral-600 text-sm font-medium">Annual cost (excl. GST)</span>
              <span className="text-base font-semibold">
                {formatMoney(grandTotal)}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}


/* ------------------------------ Page ------------------------------ */
export default function ReviewInfo() {
  const state = useServiceAgreementStore();

  const goBack = () => state.setPage(5);
  const goNext = () => state.setPage(7);

  useEffect(() => {
    scrollToTop();
  }, []);

  return (
    <div className="w-full mx-auto flex flex-col gap-10">
      <div className="flex flex-col">
        <Label className="text-2xl mb-1">Review Details</Label>
        <span className="text-lg text-neutral-500">
          Please review your selected services and the information you’ve
          provided.
        </span>
      </div>

      <ServicesList />
      <CompanyDetailsCard />
      <BillingDetailsCard />
      <AdditionalContactsList />
      <SitesSummaryList />

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
