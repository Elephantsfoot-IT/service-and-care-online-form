"use client";

/* ------------------------------ Imports ------------------------------ */
import React, { useEffect, useMemo, useRef } from "react";
import { useServiceAgreementStore } from "@/app/service-agreement/service-agreement-store";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { scrollToTop } from "@/lib/utils";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  PlusIcon,
  UsersIcon,
} from "lucide-react";
import AdditionalcontactForm, {
  AdditionalContactFormHandle,
} from "@/components/service-agreement/additional-contact-form";
import { AdditionalContact } from "@/lib/interface";
import { toast } from "sonner";

/* ------------------------------ Component ------------------------------ */
export default function AdditionalContactInfo() {
  /* Store */
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

  /* Effects */
  useEffect(() => {
    scrollToTop();
  }, []);

  /* JSX */
  return (
    <div className="w-full mx-auto flex flex-col">
    
      <Label className="text-xl mb-1">Additional Contacts</Label>
      <span className="text-base text-neutral-500 mb-6">
        Provide optional additional contacts for your business as needed.
        (Optional)
      </span>

      <div className="flex justify-end mb-2">
        <Button
          disabled={state.additionalContacts.length >= 3}
          onClick={handleAddContact}
          variant="ghost"
        >
          <PlusIcon className="mr-1" /> Add Contact
        </Button>
      </div>

      {state.additionalContacts.length === 0 ? (
        <div className="text-sm w-full h-40 bg-neutral-50 rounded-md flex justify-center items-center gap-2">
          No Contact
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

      <div className="flex flex-row gap-2 justify-between mt-10">
        <Button
          variant="outline"
          onClick={goBack}
          className="w-fit cursor-pointer"
        >
          <ArrowLeftIcon /> Back
        </Button>
        <Button
          onClick={handleSubmit}
          className="w-[200px] cursor-pointer"
          variant="efg"
        >
          Continue <ArrowRightIcon />
        </Button>
      </div>
    </div>
  );
}
