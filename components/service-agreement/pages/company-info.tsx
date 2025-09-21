import React, { useEffect, useRef } from "react";
import { useServiceAgreementStore } from "@/app/service-agreement/service-agreement-store";
import { formatFullAddress, scrollToTop } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, PlusIcon } from "lucide-react";
import { AdditionalContact } from "@/lib/interface";
import { toast } from "sonner";
import AdditionalcontactForm, {
  AdditionalContactFormHandle,
} from "@/components/service-agreement/additional-contact-form";

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

function AdditionalContactsList() {
  const state = useServiceAgreementStore();

  /* Refs */
  // Keep a map of refs keyed by contact id
  const formRefs = useRef<Record<string, AdditionalContactFormHandle | null>>(
    {}
  );

  const setFormRef =
    (id: string) => (instance: AdditionalContactFormHandle | null) => {
      formRefs.current[id] = instance;
    };

  /* Handlers */
  const goBack = () => state.setPage(3);

  const handleSubmit = async () => {
    // Validate all child forms before continuing
    const refs = state.additionalContacts
      .map((c) => formRefs.current[c.id!])
      .filter(Boolean) as AdditionalContactFormHandle[];

    if (refs.length === 0) {
      state.setPage(5); // nothing to validate
      return;
    }

    const results = await Promise.all(refs.map((r) => r.validate()));
    const allValid = results.every(Boolean);

    if (!allValid) {
      // Optionally show a toast/toaster here
      return; // stop navigation if any form invalid
    }

    state.setPage(5);
  };

  const handleChange = (data: AdditionalContact) => {
    state.setAdditionalContacts(
      state.additionalContacts.map((c) => (c.id === data.id ? data : c))
    );
  };

  const handleDelete = (id: string) => {
    state.setAdditionalContacts(
      state.additionalContacts.filter((c) => c.id !== id)
    );
    // Clean the ref
    delete formRefs.current[id];
    toast.success("Contact deleted successfully");
  };

  const handleAddContact = () => {
    if (state.additionalContacts.length >= 3) return;
    state.setAdditionalContacts([
      ...state.additionalContacts,
      {
        id: crypto.randomUUID(),
        GivenName: "",
        FamilyName: "",
        Email: "",
        WorkPhone: "",
        CellPhone: "",
        Position: "",
        Department: "",
        QuoteContact: false,
        JobContact: false,
        InvoiceContact: false,
        StatementContact: false,
        PrimaryQuoteContact: false,
        PrimaryJobContact: false,
        PrimaryInvoiceContact: false,
        PrimaryStatementContact: false,
      },
    ]);
  };

  return (
    <>
      {state.additionalContacts.length === 0 ? (
        <div className="text-sm w-full h-40 bg-white border border-input shadow-xs rounded-lg flex flex-col items-center justify-center gap-2 text-center px-4">
          <div className="font-medium">Additional contacts (optional)</div>
          <p className="text-neutral-500">
            Add extra people for quotes, jobs, invoices or statements so we can
            reach the right person.
          </p>

          {/* CTA (hook up your own handler) */}
          {/* import { Button } from "@/components/ui/button"; import { PlusIcon } from "lucide-react"; */}
          <Button
            variant="outline"
            size="sm"
            className="mt-1"
            onClick={handleAddContact} // replace with your own action
          >
            <PlusIcon className="mr-1 h-4 w-4" />
            Add contact
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          {state.additionalContacts.map((contact, index) => (
            <AdditionalcontactForm
              key={contact.id}
              ref={setFormRef(contact.id!)} // <-- capture child handle
              contact={contact}
              index={index}
              handleDelete={handleDelete}
              handleChange={handleChange}
            />
          ))}
        </div>
      )}
      <div className="flex justify-end">
        <Button
          disabled={state.additionalContacts.length >= 3}
          onClick={handleAddContact}
          variant="outline"
        >
          <PlusIcon className="mr-1" /> Add Contact
        </Button>
      </div>
    </>
  );
}

function CompanyInfo() {
  const state = useServiceAgreementStore();

  const goBack = () => state.setPage(1);
  const goNext = () => state.setPage(3);

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

      <AdditionalContactsList />

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
