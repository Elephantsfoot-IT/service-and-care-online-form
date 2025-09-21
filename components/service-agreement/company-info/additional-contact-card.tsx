"use client";

import { useServiceAgreementStore } from "@/app/service-agreement/service-agreement-store";
import AdditionalcontactForm, {
  AdditionalContactFormHandle,
} from "@/components/service-agreement/additional-contact-form";
import { Button } from "@/components/ui/button";
import { AdditionalContact } from "@/lib/interface";
import { PlusIcon } from "lucide-react";
import React, { useRef, useImperativeHandle } from "react";
import { toast } from "sonner";

/** 👇 expose this type to the parent */
export type AdditionalContactsListHandle = {
  /** validate all child forms; returns true if OK to proceed */
  handleSubmit: () => Promise<boolean>;
};

type Props = {
    className?: string; // optional, future-proof
};

export const AdditionalContactsList = React.forwardRef<
  AdditionalContactsListHandle,
  Props
>(function AdditionalContactsList(_props, ref) {
  const state = useServiceAgreementStore();

  // Refs per child form
  const formRefs = useRef<Record<string, AdditionalContactFormHandle | null>>(
    {}
  );

  const setFormRef =
    (id: string) => (instance: AdditionalContactFormHandle | null) => {
      formRefs.current[id] = instance;
    };

  /** validate all child forms; do NOT navigate here */
  const handleSubmit = async (): Promise<boolean> => {
    const refs = state.additionalContacts
      .map((c) => formRefs.current[c.id!])
      .filter(Boolean) as AdditionalContactFormHandle[];

    if (refs.length === 0) {
      // nothing to validate; OK to proceed
      return true;
    }

    const results = await Promise.all(refs.map((r) => r.validate()));
    const allValid = results.every(Boolean);

    if (!allValid) {
      // optional UX
      toast.error("Please complete all additional contact fields.");
      return false;
    }
    return true;
  };

  // Expose to parent
  useImperativeHandle(ref, () => ({ handleSubmit }), [state.additionalContacts]);

  const handleChange = (data: AdditionalContact) => {
    state.setAdditionalContacts(
      state.additionalContacts.map((c) => (c.id === data.id ? data : c))
    );
  };

  const handleDelete = (id: string) => {
    state.setAdditionalContacts(
      state.additionalContacts.filter((c) => c.id !== id)
    );
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
        <div className="text-sm w-full h-40 bg-white border border-input shadow-sm rounded-xl flex flex-col items-center justify-center gap-2 text-center px-4">
          <div className="text-base xl:text-lg font-medium">Additional contacts</div>
          <p className="text-neutral-500">
            Add extra people for quotes, jobs, invoices or statements so we can
            reach the right person.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-1"
            onClick={handleAddContact}
          >
            <PlusIcon className="mr-1 h-4 w-4" />
            Add contact
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {state.additionalContacts.map((contact, index) => (
            <AdditionalcontactForm
              key={contact.id}
              ref={setFormRef(contact.id!)}
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
});
